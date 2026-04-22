const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method === "POST" && url.pathname === "/api/submit") {
      const formData = await request.formData();

      const formType       = formData.get("form_type");
      const directEmail    = formData.get("therapist_email");
      const userName       = formData.get("name");
      const userEmail      = formData.get("email");
      const userPhone      = formData.get("phone") || "Not provided";
      const message        = formData.get("message");
      const turnstileToken = formData.get("cf-turnstile-response");

      // 1. VERIFY TURNSTILE TOKEN
      const verifyForm = new FormData();
      verifyForm.append("secret", env.TURNSTILE_SECRET);
      verifyForm.append("response", turnstileToken);
      verifyForm.append("remoteip", request.headers.get("CF-Connecting-IP"));

      const verifyRes = await fetch(TURNSTILE_VERIFY_URL, {
        method: "POST",
        body: verifyForm,
      });
      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        return new Response(
          JSON.stringify({ ok: false, error: "Bot verification failed. Please try again." }),
          { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
        );
      }

      // 2. DETERMINE DESTINATION EMAIL
      // Bio forms pass therapist_email directly (Option A)
      // Main contact form falls back to route map
      const routeMap = {
        "main":     env.EMAIL_MAIN     || "emcitconsultants@outlook.com",
        "brittany": env.EMAIL_BRITTANY || "emcitconsultants@outlook.com",
        "lindsey":  env.EMAIL_LINDSEY  || "emcitconsultants@outlook.com",
        "jessica":  env.EMAIL_JESSICA  || "emcitconsultants@outlook.com",
        "abby":     env.EMAIL_ABBY     || "emcitconsultants@outlook.com",
      };

      const destinationEmail = directEmail || routeMap[formType] || routeMap["main"];
      const formLabel = directEmail ? `${userName}'s therapist` : formType;

      // 3. SEND VIA RESEND
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Website Forms <onboarding@resend.dev>",
          to: destinationEmail,
          reply_to: userEmail,
          subject: `New Message from ${userName} — ${formLabel} form`,
          html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Form:</strong> ${formLabel}</p>
            <p><strong>Name:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Phone:</strong> ${userPhone}</p>
            <p><strong>Message:</strong><br/>${message}</p>
          `,
        }),
      });

      if (res.ok) {
        return new Response(
          JSON.stringify({ ok: true }),
          { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
        );
      } else {
        const errorText = await res.text();
        return new Response(
          JSON.stringify({ ok: false, error: errorText }),
          { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
        );
      }
    }

    // Serve static site for everything else
    return env.ASSETS.fetch(request);
  },
};