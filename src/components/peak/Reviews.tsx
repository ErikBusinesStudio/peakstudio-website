import { FormEvent, useEffect, useRef, useState } from "react";
import { BadgeCheck, ExternalLink, Star } from "lucide-react";
import { useCopy } from "@/config/copy";
import { RECENSIONI } from "@/config/site";
import { useRevealOnce } from "@/hooks/peak";
import SectionHead from "./SectionHead";

type Review = { id: string; name: string; role: string; text: string; rating: number };

const Stars = ({ n }: { n: number }) => (
  <span className="flex gap-0.5" aria-hidden>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} className={`h-4 w-4 ${i <= n ? "fill-[hsl(var(--cyan))] text-[hsl(var(--cyan))]" : "text-muted-foreground/40"}`} />
    ))}
  </span>
);

/**
 * Recensioni vere: mostra solo quelle approvate da /admin (tabella `reviews`).
 * Le recensioni nuove arrivano in coda "pending" e compaiono dopo l'approvazione.
 */
const Reviews = () => {
  const { c, lang } = useCopy();
  const r = c.reviews;
  const [list, setList] = useState<Review[]>([]);
  const [ratings, setRatings] = useState<number[]>([]);
  const [f, setF] = useState({ name: "", role: "", text: "", rating: 5, consent: false, trap: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error" | "invalid">("idle");
  const gridRef = useRef<HTMLUListElement>(null);
  const shown = useRevealOnce(gridRef);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data } = await supabase
          .from("reviews")
          .select("id,name,role,text,rating")
          .eq("status", "approved")
          .order("created_at", { ascending: false })
          .limit(6);
        if (alive && data) setList(data as Review[]);
        const all = await supabase.from("reviews").select("rating").eq("status", "approved").limit(1000);
        if (alive && all.data) setRatings(all.data.map((x: { rating: number }) => x.rating));
      } catch {
        /* senza rete la sezione mostra solo il modulo */
      }
    })();
    return () => { alive = false; };
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    if (f.trap) return; // campo trappola per i bot
    if (!f.name.trim() || f.text.trim().length < 10 || !f.consent) {
      setStatus("invalid");
      return;
    }
    setStatus("loading");
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.functions.invoke("submit-review", {
        body: { name: f.name.trim(), role: f.role.trim() || (lang === "en" ? "Client" : "Cliente"), text: f.text.trim(), rating: f.rating },
      });
      if (error) throw error;
      setStatus("ok");
      setF({ name: "", role: "", text: "", rating: 5, consent: false, trap: "" });
    } catch {
      setStatus("error");
    }
  };

  const total = ratings.length;
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, v: ratings.filter((x) => x === n).length }));
  const avg = total ? ratings.reduce((a, b) => a + b, 0) / total : 0;
  const pct5 = total ? Math.round((dist[0].v / total) * 100) : 0;
  const nf = (n: number) => n.toLocaleString(lang === "en" ? "en-GB" : "it-IT", { maximumFractionDigits: 1, minimumFractionDigits: 1 });

  const links = [
    { href: RECENSIONI.google, label: r.google },
    { href: RECENSIONI.trustpilot, label: r.trustpilot },
  ].filter((l) => l.href);

  const input = "mt-1.5 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--cyan))]";

  return (
    <section id="recensioni" aria-labelledby="recensioni-title" className="zone-mid py-24 md:py-32">
      <div className="wrap">
        <SectionHead id="recensioni" kicker={r.kicker} quota={2650} title={r.title} intro={r.intro} />

        <div className="grid gap-5 lg:grid-cols-12">
          <div className="surface flex flex-col justify-between p-6 lg:col-span-4">
            <div>
              <p className="hud text-muted-foreground">{r.avg}</p>
              <p className="mt-2 font-display text-6xl font-extrabold tracking-tight">{total ? nf(avg) : "0,0"}<span className="text-2xl text-muted-foreground"> / 5</span></p>
              <div className="mt-3"><Stars n={Math.round(avg)} /></div>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-border p-3"><dt className="text-muted-foreground">{r.count(total).replace(/^\d+ /, "")}</dt><dd className="font-display text-2xl font-extrabold">{total}</dd></div>
              <div className="rounded-xl border border-border p-3"><dt className="text-muted-foreground">{r.five}</dt><dd className="font-display text-2xl font-extrabold">{total ? `${pct5}%` : "0%"}</dd></div>
            </dl>
          </div>
          <div className="surface p-6 lg:col-span-8">
            <h3 className="font-display text-xl font-extrabold">{r.chartTitle}</h3>
            {total === 0 && <p className="mt-2 text-sm text-muted-foreground">{r.chartNone}</p>}
            <ul className="mt-4 space-y-3" aria-label={r.chartTitle}>
              {dist.map(({ n, v }) => (
                <li key={n} className="flex items-center gap-3">
                  <span className="flex w-14 shrink-0 items-center gap-1 text-sm font-semibold">{n}<Star aria-hidden className="h-4 w-4 fill-[hsl(var(--cyan))] text-[hsl(var(--cyan))]" /></span>
                  <span className="h-3 flex-1 overflow-hidden rounded-full bg-muted/60" aria-hidden>
                    <span className="block h-full rounded-full bg-[hsl(var(--cyan))] transition-[width] duration-700" style={{ width: total ? `${(v / total) * 100}%` : "0%" }} />
                  </span>
                  <span className="w-8 shrink-0 text-right text-sm tabular-nums">{v}<span className="sr-only"> {r.star(n)}</span></span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="mt-5 flex flex-wrap gap-2" aria-label={r.stepsTitle}>
          {r.trust.map((t: string) => (
            <li key={t} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm"><BadgeCheck aria-hidden className="h-4 w-4 text-[hsl(var(--cyan))]" />{t}</li>
          ))}
        </ul>

        <div className="mt-8">
        {list.length > 0 ? (
          <ul ref={gridRef} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list.map((x, i) => (
              <li
                key={x.id}
                style={{ transitionDelay: `${i * 70}ms` }}
                className={`reveal ${shown ? "is-in" : ""} surface flex flex-col p-6`}
              >
                <p className="sr-only">{r.star(x.rating)}</p>
                <Stars n={x.rating} />
                <blockquote className="mt-4 flex-1 text-lg">“{x.text}”</blockquote>
                <p className="mt-5 font-semibold">
                  {x.name} <span className="font-normal text-muted-foreground">· {x.role}</span>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="surface max-w-2xl p-6 text-lg text-muted-foreground">{r.empty}</p>
        )}
        </div>

        <div className="surface mt-8 p-6 md:p-8">
          <h3 className="font-display text-2xl font-extrabold">{r.stepsTitle}</h3>
          <ol className="mt-5 grid gap-4 md:grid-cols-3">
            {r.steps.map((s: { t: string; d: string }, i: number) => (
              <li key={s.t} className="rounded-2xl border border-border p-5">
                <span className="hud text-[hsl(var(--cyan))]">0{i + 1}</span>
                <p className="mt-1 font-display text-xl font-extrabold">{s.t}</p>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">{r.pending}</p>
        </div>

        <div className="surface mt-10 grid gap-8 p-6 md:p-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h3 className="font-display text-2xl font-extrabold">{r.formTitle}</h3>
            <p className="mt-2 text-muted-foreground">{r.formIntro}</p>
            {links.length > 0 && (
              <div className="mt-6">
                <p className="hud text-muted-foreground">{r.also}</p>
                <ul className="mt-2">
                  {links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 underline underline-offset-4">
                        {l.label}
                        <ExternalLink aria-hidden className="h-4 w-4" />
                        <span className="sr-only">({r.outbound})</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <form onSubmit={submit} className="space-y-4 lg:col-span-8" noValidate>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-semibold">
                {r.name}
                <input className={input} value={f.name} maxLength={100} autoComplete="name" onChange={(e) => setF({ ...f, name: e.target.value })} required />
              </label>
              <label className="block text-sm font-semibold">
                {r.role}
                <input className={input} value={f.role} maxLength={100} onChange={(e) => setF({ ...f, role: e.target.value })} />
              </label>
            </div>

            <fieldset>
              <legend className="text-sm font-semibold">{r.rating}</legend>
              <div className="mt-1.5 flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={f.rating === n}
                    aria-label={r.star(n)}
                    onClick={() => setF({ ...f, rating: n })}
                    className="flex h-11 w-11 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--cyan))]"
                  >
                    <Star aria-hidden className={`h-7 w-7 transition-colors ${n <= f.rating ? "fill-[hsl(var(--cyan))] text-[hsl(var(--cyan))]" : "text-muted-foreground/50"}`} />
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="block text-sm font-semibold">
              {r.text}
              <textarea className={`${input} min-h-[120px]`} value={f.text} maxLength={500} onChange={(e) => setF({ ...f, text: e.target.value })} required />
            </label>

            {/* trappola anti-bot: invisibile alle persone */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>Sito web<input tabIndex={-1} autoComplete="off" value={f.trap} onChange={(e) => setF({ ...f, trap: e.target.value })} /></label>
            </div>

            <label className="flex min-h-[44px] items-start gap-3 text-sm">
              <input type="checkbox" className="mt-1 h-5 w-5 shrink-0" checked={f.consent} onChange={(e) => setF({ ...f, consent: e.target.checked })} />
              <span>{r.consent}</span>
            </label>

            <div role="status" aria-live="polite" className="min-h-[1.5rem] text-sm">
              {status === "ok" && <p className="font-semibold">{r.ok}</p>}
              {status === "error" && <p className="text-destructive">{r.err}</p>}
              {status === "invalid" && <p className="text-destructive">{r.invalid}</p>}
            </div>

            <button type="submit" disabled={status === "loading"} className="btn btn-primary">
              {status === "loading" ? r.sending : r.send}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
