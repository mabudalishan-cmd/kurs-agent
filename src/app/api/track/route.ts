import { createServerSupabaseClient } from "@/lib/supabase";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { readJsonBody, validateTrack } from "@/lib/validation";

// IP başına dəqiqədə 60 səhifə baxışı — normal gəzinti üçün kifayətdir
const LIMIT = 60;
const WINDOW_MS = 60 * 1000;

export async function POST(request: Request) {
  // Analitika heç vaxt sayta təsir etməməlidir — limit aşılanda da 204 qaytarırıq.
  const limitResult = rateLimit(`track:${getClientIp(request)}`, LIMIT, WINDOW_MS);
  if (!limitResult.success) {
    return new Response(null, { status: 204 });
  }

  const body = await readJsonBody(request);
  const validation = validateTrack(body);
  if (!validation.ok) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("page_views").insert(validation.data);

    if (error) {
      console.error("Track insert error:", error);
    }
  } catch (err) {
    console.error("Track route error:", err);
  }

  return new Response(null, { status: 204 });
}
