import { useRef, useState } from "react";
import { Clock, CreditCard, Globe, Plus, ShieldCheck, Tag, Wrench, ClipboardList } from "lucide-react";
import { useCopy } from "@/config/copy";
import { useRevealOnce } from "@/hooks/peak";
import SectionHead from "./SectionHead";

const ICONS = [Clock, Tag, ClipboardList, Globe, Wrench, ShieldCheck, CreditCard];

/**
 * Domande a scomparsa: una aperta alla volta, con etichetta-chiave sempre visibile
 * (tempo, prezzo...) così si capisce a colpo d'occhio prima di aprire.
 * Animazioni solo con transizioni CSS: disattivate con prefers-reduced-motion.
 */
const Faq = () => {
  const { c } = useCopy();
  const [open, setOpen] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const shown = useRevealOnce(listRef);

  return (
    <section id="faq" aria-labelledby="faq-title" className="zone-deep border-t border-border py-24 md:py-32">
      <div className="wrap max-w-4xl">
        <SectionHead id="faq" kicker={c.faq.kicker} quota={3700} title={c.faq.title} />
        <ul ref={listRef} className="space-y-3">
          {c.faq.items.map((f, i) => {
            const Icon = ICONS[i % ICONS.length];
            const isOpen = open === i;
            return (
              <li key={f.q} style={{ transitionDelay: `${i * 60}ms` }} className={`reveal ${shown ? "is-in" : ""}`}>
               <div
                className={`surface overflow-hidden transition-[box-shadow,border-color] duration-300 motion-reduce:transition-none ${
                  isOpen ? "border-[hsl(var(--cyan))] shadow-[0_0_0_1px_hsl(var(--cyan)/0.5)]" : ""
                }`}
               >
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex min-h-[64px] w-full items-center gap-4 px-5 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[hsl(var(--cyan))] md:px-7"
                  >
                    <span
                      aria-hidden
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border transition-colors duration-300 motion-reduce:transition-none ${
                        isOpen ? "bg-[hsl(var(--cyan))] text-[hsl(var(--deep-900))]" : ""
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-semibold leading-snug md:text-xl">{f.q}</span>
                      <span className="hud mt-1 inline-block rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">{f.chip}</span>
                    </span>
                    <Plus
                      aria-hidden
                      className={`h-6 w-6 shrink-0 transition-transform duration-300 motion-reduce:transition-none ${isOpen ? "rotate-45" : ""}`}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-6 pl-[calc(1.25rem+44px+1rem)] text-base text-muted-foreground md:px-7 md:pb-6 md:pl-[calc(1.75rem+44px+1rem)] md:text-lg">{f.a}</p>
                  </div>
                </div>
               </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Faq;
