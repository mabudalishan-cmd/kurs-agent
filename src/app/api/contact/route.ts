import { createServerSupabaseClient } from "@/lib/supabase";
import { getClientIp, rateLimit, tooManyRequests } from "@/lib/rate-limit";
import { readJsonBody, validateContact } from "@/lib/validation";

// IP başına 10 dəqiqədə 5 mesaj
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  const limitResult = rateLimit(`contact:${getClientIp(request)}`, LIMIT, WINDOW_MS);
  if (!limitResult.success) {
    return tooManyRequests(limitResult);
  }

  const body = await readJsonBody(request);
  const validation = validateContact(body);
  if (!validation.ok) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("messages").insert(validation.data);

    if (error) {
      console.error("Contact insert error:", error);
      return Response.json(
        { error: "Mesaj göndərilə bilmədi. Bir az sonra yenidən cəhd edin." },
        { status: 500 }
      );
    }

    return Response.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Contact route error:", err);
    return Response.json(
      { error: "Mesaj göndərilə bilmədi. Bir az sonra yenidən cəhd edin." },
      { status: 500 }
    );
  }
}
