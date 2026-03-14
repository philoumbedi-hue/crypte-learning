import { Resend } from 'resend';

export async function sendVerificationEmail(email: string, token: string) {
  const domain = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const confirmLink = `${domain}/auth/verify-email?token=${token}`;

  console.log('\n╔══════════════════════════════════════╗');
  console.log('║    📧 EMAIL DE VÉRIFICATION CRYPTE    ║');
  console.log('╠══════════════════════════════════════╣');
  console.log(`║  À       : ${email.padEnd(27)}║`);
  console.log(`║  Token   : ${token.slice(0, 8)}...${String('').padEnd(16)}║`);
  console.log(`║  Expire  : dans 2 heures              ║`);
  console.log('╠══════════════════════════════════════╣');
  console.log(`║  LIEN DE CONFIRMATION :               ║`);
  console.log(`║  ${confirmLink.slice(0, 38)}  ║`);
  console.log('╚══════════════════════════════════════╝\n');

  // Send real email if Resend is configured
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'CRYPTE Académie <onboarding@resend.dev>', // Use a verified domain in production if possible
        to: email,
        subject: '✅ Confirmez votre compte CRYPTE',
        html: `
                <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
                  <h2 style="color:#4f46e5;font-size:22px;font-weight:900;text-transform:uppercase">
                    Confirmer votre compte
                  </h2>
                  <p style="color:#52525b">
                    Merci de vous être inscrit sur la plateforme <strong>CRYPTE</strong>.<br/>
                    Cliquez sur le bouton ci-dessous pour activer votre compte.
                  </p>
                  <a href="${confirmLink}"
                     style="display:inline-block;margin-top:16px;padding:14px 32px;
                            background:#4f46e5;color:#fff;font-weight:900;text-decoration:none;
                            border-radius:12px;font-size:14px;letter-spacing:.05em;text-transform:uppercase">
                    Confirmer mon email
                  </a>
                  <p style="margin-top:24px;color:#a1a1aa;font-size:12px">
                    Ce lien expire dans <strong>2 heures</strong>.
                    Si vous n'êtes pas à l'origine de cette inscription, ignorez cet email.
                  </p>
                </div>
              `,
      });
      console.log("✅ Email envoyé avec succès via Resend à", email);
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi de l'email via Resend:", error);
    }
  } else {
    console.log("⚠️ Pass de variable 'RESEND_API_KEY' dans .env -> L'email réel n'a pas été envoyé. (Mode Simulation actif)");
  }
}
