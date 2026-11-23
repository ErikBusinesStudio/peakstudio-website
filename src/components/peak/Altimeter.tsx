import { useEffect, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import { useCopy } from "@/config/copy";
import { CAMPI, QUOTA_MAX, temperatura } from "@/config/site";
import { scrollToId } from "@/hooks/peak";

/**
 * Navigatore di sezione fisso. Mostra i NOMI delle sezioni (non solo le quote):
 * a destra su schermi grandi, in basso con un menù a tendina su telefono e tablet.
 * Quota e temperatura restano come dettaglio, ma non servono per orientarsi.
 */
const Altimeter = () => {
  const { c, lang } = useCopy();
  const [quota, setQuota] = useState(0);
  const [active, setActive] = useState(0);
  const [menu, setMenu] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const mid = window.innerHeight * 0.4;
      let idx = 0;
      let q = 0;
      for (let i = 0; i < CAMPI.length; i++) {
        const el = document.getElementById(CAMPI[i].id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid) {
          idx = i;
          const next = CAMPI[i + 1];
          const f = Math.min(1, Math.max(0, (mid - r.top) / Math.max(1, r.height)));
          q = CAMPI[i].quota + (next ? (next.quota - CAMPI[i].quota) * f : 0);
        }
      }
      setActive(idx);
      setQuota(Math.round(q / 10) * 10);
      document.documentElement.style.setProperty("--climb", String(q / QUOTA_MAX));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(calc); };
    calc();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);

  // chiude il menù mobile con Esc o toccando fuori
  useEffect(() => {
    if (!menu) return;
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setMenu(false); };
    const out = (e: PointerEvent) => { if (boxRef.current && !boxRef.current.contains(e.target as Node)) setMenu(false); };
    window.addEventListener("keydown", key);
    window.addEventListener("pointerdown", out);
    return () => { window.removeEventListener("keydown", key); window.removeEventListener("pointerdown", out); };
  }, [menu]);

  const t = temperatura(quota);
  const temp = `${t > 0 ? "+" : t < 0 ? "−" : ""}${Math.abs(t)} °C`;
  const go = (id: string) => { setMenu(false); scrollToId(id); };
  const progress = Math.round((quota / QUOTA_MAX) * 100);

  return (
    <>
      {/* desktop: binario con i nomi; le etichette si aprono al passaggio del mouse (sempre aperte su schermi molto larghi) */}
      <nav aria-label={c.altimeter.label} className="altimeter group fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
        <div className="zone-deep rounded-2xl border border-border py-3 pl-3 pr-3 shadow-2xl backdrop-blur" style={{ backgroundColor: "hsl(var(--deep-900) / 0.9)" }}>
          <ol className="relative">
            {/* binario + avanzamento */}
            <span aria-hidden className="absolute bottom-3 right-[5px] top-3 w-px bg-border" />
            <span aria-hidden className="absolute right-[4px] top-3 w-[3px] rounded-full bg-[hsl(var(--cyan))] transition-[height] duration-300 motion-reduce:transition-none" style={{ height: `calc((100% - 1.5rem) * ${progress / 100})` }} />
            {CAMPI.map((cp, i) => {
              const on = i === active;
              const passed = i < active;
              return (
                <li key={cp.id}>
                  <button
                    type="button"
                    onClick={() => go(cp.id)}
                    aria-current={on ? "location" : undefined}
                    aria-label={`${c.altimeter.goto} ${cp.label[lang]}`}
                    className="relative flex min-h-[32px] w-full items-center justify-end gap-3 rounded-full pr-0 outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--cyan))]"
                  >
                    <span
                      className={`overflow-hidden whitespace-nowrap rounded-full px-0 text-[13px] font-semibold transition-all duration-300 motion-reduce:transition-none ${
                        on
                          ? "max-w-[160px] bg-[hsl(var(--cyan))] px-3 py-1 text-[hsl(var(--deep-900))]"
                          : "max-w-0 text-muted-foreground group-hover:max-w-[160px] group-hover:px-2 group-focus-within:max-w-[160px] group-focus-within:px-2 2xl:max-w-[160px] 2xl:px-2"
                      }`}
                    >
                      {cp.label[lang]}
                    </span>
                    <span
                      aria-hidden
                      className={`relative z-10 mr-[1px] h-[11px] w-[11px] shrink-0 rotate-45 border transition-colors duration-300 motion-reduce:transition-none ${
                        on ? "border-[hsl(var(--cyan))] bg-[hsl(var(--cyan))]" : passed ? "border-[hsl(var(--cyan))] bg-[hsl(var(--deep-900))]" : "border-border bg-[hsl(var(--deep-900))]"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="hud mt-3 text-right text-[11px] text-muted-foreground" aria-hidden>
            {quota.toLocaleString("it-IT")} m · {temp}
          </p>
        </div>
      </nav>

      {/* telefono e tablet: pulsante con la sezione corrente, apre l'elenco */}
      <div ref={boxRef} className="alt-mobile fixed bottom-4 right-4 z-40 xl:hidden">
        {menu && (
          <ul id="altimeter-menu" className="zone-deep mb-2 max-h-[60vh] w-56 overflow-auto rounded-2xl border border-border p-2 shadow-2xl" style={{ backgroundColor: "hsl(var(--deep-900) / 0.96)" }}>
            {CAMPI.map((cp, i) => (
              <li key={cp.id}>
                <button
                  type="button"
                  onClick={() => go(cp.id)}
                  aria-current={i === active ? "location" : undefined}
                  className={`flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-left text-base font-semibold ${i === active ? "bg-[hsl(var(--cyan))] text-[hsl(var(--deep-900))]" : "text-foreground hover:bg-white/10"}`}
                >
                  <span aria-hidden className={`h-2 w-2 shrink-0 rotate-45 ${i === active ? "bg-[hsl(var(--deep-900))]" : "bg-[hsl(var(--cyan))]"}`} />
                  {cp.label[lang]}
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={() => setMenu((m) => !m)}
          aria-expanded={menu}
          aria-controls="altimeter-menu"
          aria-label={c.altimeter.label}
          className="zone-deep ml-auto flex min-h-[44px] items-center gap-2 rounded-full border border-border py-2 pl-4 pr-3 text-sm font-semibold shadow-xl"
          style={{ backgroundColor: "hsl(var(--deep-900) / 0.94)" }}
        >
          <span aria-hidden className="h-2 w-2 rotate-45 bg-[hsl(var(--cyan))]" />
          {CAMPI[active].label[lang]}
          <ChevronUp aria-hidden className={`h-4 w-4 transition-transform motion-reduce:transition-none ${menu ? "rotate-180" : ""}`} />
        </button>
      </div>
    </>
  );
};

export default Altimeter;
