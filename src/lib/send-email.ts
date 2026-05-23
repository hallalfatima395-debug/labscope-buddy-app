import { supabase } from "@/integrations/supabase/client";

interface SendEmailArgs {
  to: string;
  subject: string;
  html: string;
}

/**
 * Envoie un email réel via l'Edge Function `send-email` (SMTP Gmail).
 * Fire-and-forget : ne bloque pas l'UI et n'expose pas d'erreur visible.
 */
export function sendEmailInBackground(args: SendEmailArgs): void {
  void supabase.functions
    .invoke("send-email", { body: args })
    .then(({ error }) => {
      if (error) console.error("[send-email] Échec d'envoi:", error);
    })
    .catch((err) => console.error("[send-email] Exception:", err));
}

export function buildDirecteurAcceptedEmail(name: string): {
  subject: string;
  html: string;
} {
  const safeName = name?.trim() || "Directeur";
  return {
    subject: "Votre compte Directeur a été validé - LabScope",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1f2937;">
        <h2 style="color: #0D9488; margin-top: 0;">Félicitations, ${safeName} !</h2>
        <p>Nous avons le plaisir de vous informer que votre compte <strong>Directeur de laboratoire</strong> sur la plateforme <strong>LabScope</strong> vient d'être validé par l'administration centrale.</p>
        <p>Votre compte est désormais <strong>actif</strong>. Vous pouvez vous connecter dès maintenant pour gérer votre laboratoire, vos équipes, vos chercheurs et vos publications.</p>
        <p style="margin: 28px 0;">
          <a href="https://id-preview--29d5503e-837e-4596-81eb-bc4252f82b2c.lovable.app/login"
             style="background:#0D9488;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;">
            Accéder à mon Dashboard
          </a>
        </p>
        <p style="color:#6b7280;font-size:13px;">— L'équipe LabScope</p>
      </div>
    `,
  };
}

export function buildMembreAcceptedEmail(name: string, lab: string): {
  subject: string;
  html: string;
} {
  const safeName = name?.trim() || "Cher utilisateur";
  return {
    subject: "Votre inscription au laboratoire a été acceptée - LabScope",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1f2937;">
        <h2 style="color: #0D9488; margin-top: 0;">Bonjour ${safeName},</h2>
        <p>Nous avons le plaisir de vous informer que votre demande d'inscription au laboratoire <strong>${lab}</strong> vient d'être <strong>validée</strong> par le Directeur de laboratoire.</p>
        <p>Votre profil est désormais actif sur la plateforme <strong>LabScope</strong>. Vous pouvez vous connecter à votre Dashboard pour accéder à l'ensemble des fonctionnalités qui vous sont dédiées.</p>
        <p style="margin: 28px 0;">
          <a href="https://id-preview--29d5503e-837e-4596-81eb-bc4252f82b2c.lovable.app/login"
             style="background:#0D9488;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;">
            Se connecter à LabScope
          </a>
        </p>
        <p style="color:#6b7280;font-size:13px;">— L'équipe LabScope</p>
      </div>
    `,
  };
}
