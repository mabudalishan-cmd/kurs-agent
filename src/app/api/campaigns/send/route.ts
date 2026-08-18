import { Resend } from "resend";
import { createServerSupabaseClient } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { readJsonBody, cleanText } from "@/lib/validation";

// Resend batch API-si bir sorğuda maksimum 100 mesaj qəbul edir.
const BATCH_SIZE = 100;

/**
 * Admin mətnini təhlükəsiz HTML-ə çevirir.
 * Məzmun admin panelindən düz mətn kimi gəlir — teqləri neytrallaşdırırıq.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailHtml(
  subject: string,
  content: string,
  imageUrl: string | null
): string {
  const image = imageUrl
    ? `<img src="${escapeHtml(imageUrl)}" alt="" style="max-width:100%;border-radius:12px;margin-bottom:24px" />`
    : "";

  const body = escapeHtml(content).replace(/\n/g, "<br />");

  return `<!doctype html>
<html lang="az">
  <body style="margin:0;padding:24px;background:#f5f5f7;font-family:-apple-system,Segoe UI,Roboto,sans-serif">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px">
      <h1 style="margin:0 0 24px;font-size:22px;color:#111827">${escapeHtml(subject)}</h1>
      ${image}
      <div style="font-size:15px;line-height:1.6;color:#374151">${body}</div>
      <hr style="margin:32px 0 16px;border:none;border-top:1px solid #e5e7eb" />
      <p style="margin:0;font-size:12px;color:#9ca3af">
        HelloWorld Academy — bu məktubu abunə olduğunuz üçün alırsınız.
      </p>
    </div>
  </body>
</html>`;
}

export async function POST(request: Request) {
  // ── 1. Admin autentifikasiyası ────────────────────────────
  // proxy.ts yalnız /admin yollarını qoruyur, /api yollarını yox —
  // ona görə icazəni burada özümüz yoxlayırıq.
  const authClient = await createSupabaseServerClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return Response.json({ error: "İcazə yoxdur." }, { status: 401 });
  }

  // ── 2. Konfiqurasiya ──────────────────────────────────────
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    return Response.json(
      {
        error:
          "E-poçt xidməti konfiqurasiya olunmayıb. RESEND_API_KEY və EMAIL_FROM dəyişənlərini .env.local faylına əlavə edin.",
      },
      { status: 503 }
    );
  }

  // ── 3. Kampaniyanı oxu ────────────────────────────────────
  const body = await readJsonBody(request);
  const campaignId = cleanText((body as Record<string, unknown>)?.campaignId);

  if (!campaignId) {
    return Response.json({ error: "campaignId tələb olunur." }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  const { data: campaign, error: campaignError } = await supabase
    .from("email_campaigns")
    .select("id, subject, content, image_url, status")
    .eq("id", campaignId)
    .single();

  if (campaignError || !campaign) {
    return Response.json({ error: "Kampaniya tapılmadı." }, { status: 404 });
  }

  if (campaign.status === "sent" || campaign.status === "sending") {
    return Response.json(
      { error: "Bu kampaniya artıq göndərilib və ya göndərilir." },
      { status: 409 }
    );
  }

  // ── 4. Abunəçiləri oxu ────────────────────────────────────
  const { data: subscribers, error: subscribersError } = await supabase
    .from("subscribers")
    .select("email");

  if (subscribersError) {
    return Response.json(
      { error: "Abunəçilər oxuna bilmədi." },
      { status: 500 }
    );
  }

  const recipients = (subscribers ?? [])
    .map((s) => (s as { email: string }).email)
    .filter(Boolean);

  if (recipients.length === 0) {
    return Response.json(
      { error: "Abunəçi yoxdur — göndəriləcək ünvan tapılmadı." },
      { status: 400 }
    );
  }

  // ── 5. Göndərilir statusuna keç ───────────────────────────
  await supabase
    .from("email_campaigns")
    .update({ status: "sending", recipient_count: recipients.length })
    .eq("id", campaignId);

  // ── 6. Resend ilə partiyalarla göndər ─────────────────────
  const resend = new Resend(apiKey);
  const html = buildEmailHtml(
    campaign.subject,
    campaign.content,
    campaign.image_url
  );

  let sentCount = 0;
  let failedCount = 0;

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const chunk = recipients.slice(i, i + BATCH_SIZE);

    try {
      const { error } = await resend.batch.send(
        chunk.map((to) => ({
          from,
          to,
          subject: campaign.subject,
          html,
        }))
      );

      if (error) {
        console.error("Resend batch error:", error);
        failedCount += chunk.length;
      } else {
        sentCount += chunk.length;
      }
    } catch (err) {
      console.error("Resend batch exception:", err);
      failedCount += chunk.length;
    }
  }

  // ── 7. Nəticəni yaz ───────────────────────────────────────
  const finalStatus = sentCount > 0 ? "sent" : "failed";

  await supabase
    .from("email_campaigns")
    .update({
      status: finalStatus,
      recipient_count: recipients.length,
      sent_count: sentCount,
      failed_count: failedCount,
      sent_at: new Date().toISOString(),
    })
    .eq("id", campaignId);

  return Response.json({
    ok: sentCount > 0,
    status: finalStatus,
    recipientCount: recipients.length,
    sentCount,
    failedCount,
  });
}
