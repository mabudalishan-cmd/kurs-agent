import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { courses as staticCourses } from "@/data/courses";
import { getClientIp, rateLimit, tooManyRequests } from "@/lib/rate-limit";

// Gemini sorğuları pulludur — IP başına dəqiqədə 10 mesaj
const CHAT_LIMIT = 10;
const CHAT_WINDOW_MS = 60 * 1000;
const MAX_MESSAGE_LENGTH = 2000;

// ─── Static FAQ fallback (used when faq_items table doesn't exist) ───────────

const staticFaqItems = [
  {
    question: "Kurslar necə keçirilir?",
    answer:
      "Bütün kurslarımız onlayn formatda, canlı dərslər və qeydə alınmış videolar şəklində keçirilir.",
  },
  {
    question: "Sertifikat alıram mı?",
    answer:
      "Bəli, hər kursu uğurla bitirdikdə beynəlxalq tanınan sertifikat əldə edirsiniz.",
  },
  {
    question: "Ödəniş necə edilir?",
    answer:
      "Kart vasitəsilə tam ödəniş və ya aylıq hissələrlə ödəniş edə bilərsiniz.",
  },
  {
    question: "Əvvəlcədən təcrübəm olmalıdır?",
    answer: "Xeyr, kurslarımızın çoxu sıfırdan başlayanlar üçün nəzərdə tutulub.",
  },
  {
    question: "Kursu bitirdikdən sonra iş tapmaqda kömək olunur?",
    answer:
      "Bəli, məzunlarımıza CV hazırlığı və iş yerləşdirmə dəstəyi göstəririk.",
  },
];

// ─── System Instruction ──────────────────────────────────────────────────────

const SYSTEM_INSTRUCTION = `Sən HelloWorld Academy-nin rəsmi AI köməkçisisən. Sənin YALNIZ və YALNIZ bir vəzifən var: istifadəçilərə akademiyamızın proqramlaşdırma və kiber təhlükəsizlik kursları, qiymətlər, qeydiyyat və xidmətlərimiz haqqında dəqiq məlumat vermək.
KÖNÜLLÜ QAYDA: Əgər istifadəçi akademiyaya aid olmayan kənar bir sual versə (məsələn: ümumi proqramlaşdırma kodları yazdırmaq, hava haqqında, kənar mövzular və s.), nəzakətlə imtina et və yaz: 'Təəssüf ki, mən yalnız HelloWorld Academy kursları və xidmətləri haqqında məlumat verə bilərəm. Ətraflı məlumat və ya qeydiyyat üçün WhatsApp vasitəsilə bizimlə əlaqə saxlaya bilərsiniz.'
Həmişə mehriban və peşəkar tonda, Azərbaycan dilində cavab ver.`;

// ─── Knowledge Base builder ───────────────────────────────────────────────────

interface CourseRow {
  title: string;
  description: string;
  price: number | string;
  duration: string;
  level: string;
  category: string;
}

interface FaqRow {
  question: string;
  answer: string;
}

function buildKnowledgeBase(courses: CourseRow[], faqItems: FaqRow[]): string {
  const courseText = courses
    .map((c, i) => {
      const price =
        typeof c.price === "number" ? `${c.price} AZN` : String(c.price);
      return `${i + 1}. Kurs: ${c.title}
   Təsvir: ${c.description}
   Qiymət: ${price}
   Müddət: ${c.duration}
   Səviyyə: ${c.level}
   Kateqoriya: ${c.category}`;
    })
    .join("\n\n");

  const faqText = faqItems
    .map((f) => `S: ${f.question}\nC: ${f.answer}`)
    .join("\n\n");

  return `BİLGİ BAZASI — HelloWorld Academy

KURS MƏLUMATLARI:
${courseText}

TEZ-TEZ VERİLƏN SUALLAR:
${faqText}`;
}

// ─── Supabase fetch with fallback ────────────────────────────────────────────

async function fetchKnowledgeBase(): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let courses: CourseRow[] = staticCourses as unknown as CourseRow[];
  let faqItems: FaqRow[] = staticFaqItems;

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Fetch courses
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("title, description, price, duration, level, category");
    if (!courseError && courseData && courseData.length > 0) {
      courses = courseData as unknown as CourseRow[];
    }

    // Try to fetch FAQ items (table may not exist yet — fall back gracefully)
    const { data: faqData, error: faqError } = await supabase
      .from("faq_items")
      .select("question, answer")
      .eq("is_active", true)
      .order("display_order", { ascending: true });
    if (!faqError && faqData && faqData.length > 0) {
      faqItems = faqData as unknown as FaqRow[];
    }
  }

  return buildKnowledgeBase(courses, faqItems);
}

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const limitResult = rateLimit(
    `chat:${getClientIp(request)}`,
    CHAT_LIMIT,
    CHAT_WINDOW_MS,
  );
  if (!limitResult.success) {
    return tooManyRequests(limitResult);
  }

  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return Response.json(
        { error: "Mesaj tələb olunur." },
        { status: 400 },
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return Response.json(
        { error: "Mesaj çox uzundur." },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "GEMINI_API_KEY environment variable is missing." },
        { status: 500 },
      );
    }

    // Build dynamic knowledge base from Supabase (or static fallback)
    const knowledgeBase = await fetchKnowledgeBase();

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    // Model adı env ilə dəyişdirilə bilər — Google model adlarını vaxtaşırı yeniləyir.
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const prompt = `${knowledgeBase}

İstifadəçinin sualı: ${message}

Yuxarıdakı məlumatlardan istifadə edərək, istifadəçinin sualına Azərbaycan dilində, mehriban və peşəkar tonda cavab ver. Əgər sual akademiya ilə əlaqəli deyilsə, nəzakətlə imtina et.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return Response.json({ response: responseText });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      {
        error:
          "Bağışlayın, texniki xəta baş verdi. Zəhmət olmasa bir az sonra yenidən cəhd edin.",
      },
      { status: 500 },
    );
  }
}