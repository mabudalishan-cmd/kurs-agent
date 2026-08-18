import { createServerSupabaseClient } from "@/lib/supabase";
import { getClientIp, rateLimit, tooManyRequests } from "@/lib/rate-limit";
import { readJsonBody, validateSubscribe } from "@/lib/validation";

// IP başına 1 saatda 5 abunəlik
const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

// Postgres unique constraint pozuntusu
const UNIQUE_VIOLATION = "23505";

export async function POST(request: Request) {
  const limitResult = rateLimit(
    `subscribe:${getClientIp(request)}`,
    LIMIT,
    WINDOW_MS
  );
  if (!limitResult.success) {
    return tooManyRequests(limitResult);
  }

  const body = await readJsonBody(request);
  const validation = validateSubscribe(body);
  if (!validation.ok) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase
      .from("subscribers")
      .insert({ email: validation.data.email });

    if (error) {
      if (error.code === UNIQUE_VIOLATION) {
        return Response.json(
          { error: "Bu e-poçt artıq abunə olub.", code: "already_subscribed" },
          { status: 409 }
        );
      }
      console.error("Subscribe insert error:", error);
      return Response.json(
        { error: "Abunə olmaq mümkün olmadı. Bir az sonra yenidən cəhd edin." },
        { status: 500 }
      );
    }

    return Response.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Subscribe route error:", err);
    return Response.json(
      { error: "Abunə olmaq mümkün olmadı. Bir az sonra yenidən cəhd edin." },
      { status: 500 }
    );
  }
}
