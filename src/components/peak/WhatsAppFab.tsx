import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useCopy } from "@/config/copy";
import { whatsappUrl } from "@/config/site";

/** Pulsante WhatsApp fisso in basso a sinistra: compare dopo l'hero, per non coprire i pulsanti iniziali. */
const WhatsAppFab = () => {
  const { c } = useCopy();
  const [on, setOn] = useState(false);
  useEffect(() => {
    const f = () => setOn(window.scrollY > window.innerHeight * 0.6);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  if (!on) return null;
  return (
    <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-primary wa-fab fixed bottom-4 left-4 z-[55] !min-h-[52px] !px-5 shadow-2xl md:bottom-6 md:left-6">
      <MessageCircle aria-hidden className="h-5 w-5 shrink-0" />
      <span className="hidden sm:inline">{c.contact.whatsapp}</span>
      <span className="sr-only sm:hidden">{c.contact.whatsapp}</span>
    </a>
  );
};

export default WhatsAppFab;
