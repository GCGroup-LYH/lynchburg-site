export async function onRequestPost(context) {
  // Cloudflare Pages puts everything inside the 'context' object
  const { request, env } = context;

  // Parse the form data
  const formData = await request.formData();
  const formType = formData.get("form_type"); 
  const userName = formData.get("name");
  const userEmail = formData.get("email");
  const message = formData.get("message");

  // ---------------------------------------------------------
  // THE ROUTING MAP
  // ---------------------------------------------------------
  const routeMap = {
    "main": env.EMAIL_MAIN || "emcitconsultants@outlook.com",
    "brittany": env.EMAIL_BRITTANY || "emcitconsultants@outlook.com",
    "lindsey": env.EMAIL_LINDSEY || "emcitconsultants@outlook.com",
    "jessica": env.EMAIL_JESSICA || "emcitconsultants@outlook.com",
    "abby": env.EMAIL_ABBY || "emcitconsultants@outlook.com",
  };

  const destinationEmail = routeMap[formType] || routeMap["main"];

  // ---------------------------------------------------------
  // SEND TO RESEND API
  // ---------------------------------------------------------
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Website Forms <onboarding@resend.dev>", 
      to: destinationEmail,
      subject: `New Message from ${userName} (${formType} form)`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Sent to:</strong> ${formType} team</p>
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `
    })
  });

  if (res.ok) {
    // Redirect the user to a "Thank You" page on success
    return Response.redirect(new URL("/success", request.url).toString(), 303);
  } else {
    const errorText = await res.text();
    return new Response(`Failed to send message: ${errorText}`, { status: 500 });
  }
}