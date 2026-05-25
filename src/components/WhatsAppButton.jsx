import { MessageCircle } from "lucide-react";

/* Floating WhatsApp button for student queries / group invites.
   👉 Replace WA_NUMBER with your number (country code, no +) or
      set WA_GROUP to your group-invite link. */
const WA_NUMBER = "910000000000";
const WA_GROUP = ""; // e.g. "https://chat.whatsapp.com/XXXXXXXX"
const PREFILL = "Hi EduReach! I have a question about JEE counselling.";

export default function WhatsAppButton() {
  const href = WA_GROUP || `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(PREFILL)}`;
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      style={{
        position: "fixed", right: 20, bottom: 84, zIndex: 71,
        width: 56, height: 56, borderRadius: "50%",
        background: "#25D366", color: "#fff", display: "grid", placeItems: "center",
        boxShadow: "0 10px 28px rgba(37,211,102,.45)",
      }}
    >
      {/* WhatsApp glyph */}
      <svg width="30" height="30" viewBox="0 0 32 32" fill="#fff" aria-hidden="true">
        <path d="M16.04 4C9.43 4 4.06 9.36 4.06 15.97c0 2.1.55 4.15 1.6 5.96L4 28l6.25-1.63a11.9 11.9 0 0 0 5.79 1.48h.01c6.6 0 11.97-5.37 11.98-11.98A11.9 11.9 0 0 0 16.04 4Zm0 21.86h-.01c-1.78 0-3.52-.48-5.04-1.38l-.36-.21-3.71.97.99-3.62-.24-.37a9.86 9.86 0 0 1-1.51-5.27c0-5.46 4.45-9.9 9.9-9.9 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 6.99c0 5.46-4.45 9.9-9.9 9.9Zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z"/>
      </svg>
    </a>
  );
}
