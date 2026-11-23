import { Check } from "lucide-react";
import Header from "@/components/peak/Header";
import Footer from "@/components/peak/Footer";
import CookieBanner from "@/components/peak/CookieBanner";
import { useCopy } from "@/config/copy";
import { CONTATTI, DATI_LEGALI } from "@/config/site";
import { usePageMeta } from "@/hooks/peak";

type Block = { h: string; p: string };
type Row = { name: string; where: string; why: string; time: string; kind: string };

const AGGIORNATO = "23/11/2026";

/** Tutto ciò che il sito salva sul dispositivo o chiede a servizi esterni: controllato sul codice del sito. */
const cookieData = (lang: "it" | "en") => {
  const who = `${DATI_LEGALI.ditta}, ${CONTATTI.email}`;
  const it = lang === "it";
  return {
    title: "Cookie Policy",
    updated: it ? `Ultimo aggiornamento: ${AGGIORNATO}` : `Last updated: ${AGGIORNATO}`,
    summaryTitle: it ? "In breve" : "In short",
    summary: it
      ? [
          "Nessun cookie di profilazione né pubblicitario.",
          "Nessun cookie di statistica o di profilazione. La piattaforma di hosting può misurare le visite in forma aggregata, senza cookie e senza dati personali.",
          "Solo 3 memorie tecniche, che servono al funzionamento e non richiedono consenso.",
          "I caratteri sono ospitati sul sito stesso, non su Google Fonts.",
        ]
      : [
          "No profiling or advertising cookies.",
          "No statistics or profiling cookies. The hosting platform may measure visits in aggregate form, without cookies or personal data.",
          "Only 3 technical storage items, needed to run the site and not requiring consent.",
          "Fonts are hosted on the site itself, not on Google Fonts.",
        ],
    tableTitle: it ? "Cosa salva il sito sul tuo dispositivo" : "What the site stores on your device",
    cols: it ? ["Nome", "Dove", "A cosa serve", "Durata", "Tipo"] : ["Name", "Where", "What it is for", "Duration", "Type"],
    rows: (it
      ? [
          { name: "peak-lang", where: "Memoria locale (localStorage)", why: "Ricorda la lingua scelta (italiano o inglese).", time: "Finché non la cambi o cancelli i dati del sito", kind: "Tecnico, necessario" },
          { name: "peak-cookie-consent", where: "Memoria di sessione (sessionStorage)", why: "Ricorda la scelta fatta sul banner, per non mostrartelo di nuovo durante la visita.", time: "Fino alla chiusura della scheda", kind: "Tecnico, necessario" },
          { name: "peak-preloaded", where: "Memoria di sessione (sessionStorage)", why: "Segna che hai già visto l'animazione iniziale, per non ripeterla.", time: "Fino alla chiusura della scheda", kind: "Tecnico, necessario" },
        ]
      : [
          { name: "peak-lang", where: "Local storage", why: "Remembers the language you chose (Italian or English).", time: "Until you change it or clear the site data", kind: "Technical, necessary" },
          { name: "peak-cookie-consent", where: "Session storage", why: "Remembers your choice on the banner so it does not reappear during the visit.", time: "Until the tab is closed", kind: "Technical, necessary" },
          { name: "peak-preloaded", where: "Session storage", why: "Marks that you have already seen the intro animation, so it does not repeat.", time: "Until the tab is closed", kind: "Technical, necessary" },
        ]) as Row[],
    tableNote: it
      ? "Solo per me, nell'area riservata /admin, il sito salva anche un codice di accesso (sb-…-auth-token, memoria locale) che serve a tenere aperta la sessione. Ai visitatori non viene mai assegnato."
      : "Only for me, in the private /admin area, the site also stores a login token (sb-…-auth-token, local storage) to keep the session open. It is never assigned to visitors.",
    blocks: (it
      ? [
          { h: "Chi è responsabile", p: `${who}. Questa informativa spiega cosa salva il sito sul tuo dispositivo e perché, secondo il GDPR (Regolamento UE 2016/679), il D.Lgs. 196/2003 e le Linee guida del Garante privacy su cookie e altri strumenti di tracciamento del 10 giugno 2021.` },
          { h: "Cosa sono i cookie", p: "I cookie e le tecnologie simili (come la memoria locale o di sessione del browser) sono piccole informazioni che un sito salva sul tuo dispositivo per funzionare bene o ricordare le tue scelte. Possono essere tecnici, di statistica o di profilazione." },
          { h: "Cookie tecnici", p: "Sono quelli della tabella sopra. Servono a far funzionare il sito e a ricordare scelte semplici, quindi, come prevede la normativa, si installano senza il tuo consenso. Qui l'informativa è questa pagina." },
          { h: "Statistiche e misurazione", p: "Il sito non usa Google Analytics, Meta Pixel né mappe di calore. La piattaforma che ospita il sito (Lovable) offre però una statistica delle visite integrata, che misura solo dati aggregati: pagine viste, visitatori unici, provenienza generica, tipo di dispositivo, browser e paese. Funziona senza cookie, non salva nulla nel tuo browser, non conserva il tuo indirizzo IP, non crea profili né ti segue su altri siti e rispetta il segnale Global Privacy Control. I dati aggregati sono conservati per un periodo limitato (da 90 giorni a un anno). Poiché non usa cookie né identificativi, non richiede il tuo consenso come cookie; la piattaforma può comunque mostrare un proprio avviso ai visitatori dell'Unione Europea. Se in futuro aggiungerò altri strumenti di statistica, partiranno solo dopo il tuo consenso esplicito e questa pagina riporterà fornitore, finalità e durata." },
          { h: "Profilazione e pubblicità", p: "Il sito non usa cookie di profilazione, pubblicitari o di retargeting, non incorpora video o mappe di altri siti e non ha pulsanti social che tracciano la navigazione. Non vendo né cedo i tuoi dati per scopi di marketing." },
          { h: "Il banner: come funziona oggi", p: "Poiché oggi non ci sono cookie facoltativi, premere Accetta o Rifiuta non cambia ciò che il sito fa. La scelta viene comunque registrata solo per la visita in corso e il banner ricompare a ogni nuova visita: non viene conservato nulla di te tra una visita e l'altra." },
          { h: "Servizi esterni coinvolti", p: "Quando usi il sito, alcune richieste passano da fornitori tecnici. Hosting e database/back-end (Lovable e Supabase): ricevono il tuo indirizzo IP e dati tecnici del browser per consegnare le pagine, i prezzi e il portfolio, e per salvare ciò che invii con il modulo contatti o con una recensione. Servizio email: invia a me la notifica dei nuovi messaggi. Nessuno di questi imposta cookie di tracciamento sul tuo dispositivo tramite questo sito." },
          { h: "Link verso altri siti", p: "Quando clicchi su WhatsApp (Meta), su un progetto del portfolio, su Google, Trustpilot o su un altro link esterno, esci dal sito: quei servizi applicano le proprie regole su cookie e privacy, che non controllo. Ti invito a leggerle." },
          { h: "Come gestire o cancellare i dati dal browser", p: "Puoi cancellare i dati di questo sito o bloccare i cookie dalle impostazioni del browser, nella sezione Privacy e sicurezza (Chrome, Edge, Firefox e Safari la offrono). Bloccare le memorie tecniche non impedisce di usare il sito, ma la lingua scelta potrebbe non essere ricordata e l'animazione iniziale potrebbe ripetersi." },
          { h: "I tuoi diritti", p: `Puoi chiedere informazioni, accesso, rettifica o cancellazione dei dati in qualsiasi momento scrivendo a ${CONTATTI.email}, e proporre reclamo al Garante per la protezione dei dati personali (garanteprivacy.it). Vedi anche l'Informativa privacy.` },
          { h: "Aggiornamenti", p: "Questa informativa può cambiare se cambia il sito. La versione in vigore è sempre in questa pagina, con la data dell'ultimo aggiornamento." },
        ]
      : [
          { h: "Who is responsible", p: `${who}. This policy explains what this site stores on your device and why, under the GDPR (EU Regulation 2016/679), Legislative Decree 196/2003 and the Italian Data Protection Authority guidelines on cookies and other tracking tools of 10 June 2021.` },
          { h: "What cookies are", p: "Cookies and similar technologies (such as the browser's local or session storage) are small pieces of information a site saves on your device to work properly or to remember your choices. They can be technical, statistical or profiling." },
          { h: "Technical cookies", p: "These are the ones in the table above. They make the site work and remember simple choices, so, as the law provides, they are set without your consent. This page is the information notice for them." },
          { h: "Statistics and measurement", p: "The site does not use Google Analytics, Meta Pixel or heatmaps. The platform hosting the site (Lovable) does offer a built-in visit statistic that measures aggregate data only: page views, unique visitors, general referrer, device type, browser and country. It works without cookies, stores nothing in your browser, does not keep your IP address, builds no profiles, does not follow you across sites and honours the Global Privacy Control signal. Aggregate data is kept for a limited period (90 days to one year). Since it uses no cookies or identifiers, it needs no cookie consent; the platform may still show its own notice to visitors in the European Union. If I add other analytics tools in the future, they will start only after your explicit consent and this page will list the provider, purpose and duration." },
          { h: "Profiling and advertising", p: "The site does not use profiling, advertising or retargeting cookies, does not embed videos or maps from other sites and has no social buttons that track browsing. I do not sell or share your data for marketing." },
          { h: "The banner: how it works today", p: "Since there are no optional cookies today, pressing Accept or Reject does not change what the site does. Your choice is still stored only for the current visit and the banner reappears on every new visit: nothing about you is kept between visits." },
          { h: "External services involved", p: "When you use the site, some requests go through technical providers. Hosting and database/back-end (Lovable and Supabase): they receive your IP address and browser technical data to deliver the pages, prices and portfolio, and to save what you send through the contact form or a review. Email service: sends me the notification of new messages. None of them sets tracking cookies on your device through this site." },
          { h: "Links to other sites", p: "When you click on WhatsApp (Meta), a portfolio project, Google, Trustpilot or another external link, you leave this site: those services apply their own cookie and privacy rules, which I do not control. I encourage you to read them." },
          { h: "How to manage or delete data from your browser", p: "You can delete this site's data or block cookies from your browser settings, in the Privacy and security section (Chrome, Edge, Firefox and Safari all offer it). Blocking technical storage does not stop you from using the site, but your chosen language may not be remembered and the intro animation may repeat." },
          { h: "Your rights", p: `You can ask for information, access, correction or deletion of your data at any time by writing to ${CONTATTI.email}, and lodge a complaint with the Italian Data Protection Authority (garanteprivacy.it). See also the Privacy Policy.` },
          { h: "Updates", p: "This policy may change if the site changes. The current version is always on this page, with the date of the last update." },
        ]) as Block[],
  };
};

const content = (kind: "privacy" | "cookie", lang: "it" | "en"): { title: string; blocks: Block[] } => {
  const who = `${DATI_LEGALI.ditta}, ${CONTATTI.email}`;
  if (kind === "privacy")
    return lang === "en"
      ? { title: "Privacy Policy", blocks: [
          { h: "Data controller", p: who },
          { h: "Data collected", p: "Name, phone or email, type of business and the message you send via the contact form or WhatsApp." },
          { h: "Purpose and legal basis", p: "Replying to your request and preparing a quote (pre-contractual measures, art. 6.1.b GDPR)." },
          { h: "Reviews", p: "If you send a review (name, business, rating, text), it is stored and published on the site only after I have read and approved it. The legal basis is your consent (art. 6.1.a GDPR), given by ticking the box in the form. You can ask me to remove it at any time." },
          { h: "Who receives the data", p: "Data is processed by service providers acting on my behalf: the hosting platform and database/back-end (Lovable and Supabase) and the email service used to notify me of new messages. WhatsApp (Meta) processes the data only if you choose to write to me there. I do not sell your data." },
          { h: "Transfers outside the EU", p: "Some providers may process data outside the European Economic Area. In that case they rely on the safeguards required by the GDPR, such as standard contractual clauses." },
          { h: "Retention", p: "Data is kept for the time needed to handle the request and for up to 24 months afterwards, unless a contract follows." },
          { h: "Your rights", p: `You can request access, correction, deletion or restriction of your data by writing to ${CONTATTI.email}. You can also lodge a complaint with the Italian Data Protection Authority.` },
        ] }
      : { title: "Informativa privacy", blocks: [
          { h: "Titolare del trattamento", p: who },
          { h: "Dati raccolti", p: "Nome, telefono o email, tipo di attività e il messaggio che invii dal modulo contatti o su WhatsApp." },
          { h: "Finalità e base giuridica", p: "Rispondere alla tua richiesta e preparare un preventivo (misure precontrattuali, art. 6.1.b GDPR)." },
          { h: "Recensioni", p: "Se invii una recensione (nome, attività, voto, testo), viene salvata e pubblicata sul sito solo dopo che l'ho letta e approvata. La base giuridica è il tuo consenso (art. 6.1.a GDPR), espresso spuntando la casella del modulo. Puoi chiedermi di rimuoverla in qualsiasi momento." },
          { h: "Chi riceve i dati", p: "I dati sono trattati da fornitori che operano per mio conto: la piattaforma di hosting e il database/back-end (Lovable e Supabase) e il servizio email con cui ricevo la notifica dei nuovi messaggi. WhatsApp (Meta) tratta i dati solo se scegli di scrivermi lì. Non vendo i tuoi dati." },
          { h: "Trasferimenti fuori dall'UE", p: "Alcuni fornitori possono trattare dati fuori dallo Spazio economico europeo. In tal caso si basano sulle garanzie previste dal GDPR, come le clausole contrattuali standard." },
          { h: "Conservazione", p: "I dati sono conservati per il tempo necessario a gestire la richiesta e fino a 24 mesi successivi, salvo instaurazione di un contratto." },
          { h: "I tuoi diritti", p: `Puoi chiedere accesso, rettifica, cancellazione o limitazione dei tuoi dati scrivendo a ${CONTATTI.email}. Puoi anche proporre reclamo al Garante per la protezione dei dati personali.` },
        ] };
  return { title: "Cookie Policy", blocks: [] };
};

const slug = (t: string) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const Legal = ({ kind }: { kind: "privacy" | "cookie" }) => {
  const { lang } = useCopy();
  const it = lang === "it";

  if (kind === "cookie") {
    const d = cookieData(lang);
    usePageMeta(`${d.title} | Peak Studio`, it ? "Quali cookie e memorie tecniche usa peakstudio.click, perché, per quanto tempo e come gestirli." : "Which cookies and technical storage peakstudio.click uses, why, for how long and how to manage them.");
    const toc = [{ h: d.tableTitle, id: "memorie" }, ...d.blocks.map((b) => ({ h: b.h, id: slug(b.h) }))];
    return (
      <>
        <Header />
        <main id="contenuto" tabIndex={-1} className="zone-snow min-h-screen pt-28 outline-none">
          <article className="wrap max-w-3xl pb-24">
            <h1 className="section-title !text-[clamp(2.5rem,9vw,6rem)]">{d.title}</h1>
            <p className="hud mt-4 text-muted-foreground">{d.updated}</p>

            <div className="surface mt-8 p-6">
              <h2 className="font-display text-2xl font-extrabold">{d.summaryTitle}</h2>
              <ul className="mt-4 space-y-3">
                {d.summary.map((x) => (
                  <li key={x} className="flex gap-3"><Check aria-hidden className="mt-1 h-5 w-5 shrink-0 text-[hsl(var(--glacier-700))]" /><span>{x}</span></li>
                ))}
              </ul>
            </div>

            <nav aria-label={it ? "Indice della pagina" : "Page contents"} className="mt-8">
              <p className="hud text-muted-foreground">{it ? "In questa pagina" : "On this page"}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {toc.map((t) => (
                  <li key={t.id}><a href={`#${t.id}`} className="inline-flex min-h-[44px] items-center rounded-full border border-border px-4 text-sm hover:border-[hsl(var(--glacier-700))]">{t.h}</a></li>
                ))}
              </ul>
            </nav>

            <section id="memorie" className="mt-12 scroll-mt-28">
              <h2 className="font-display text-2xl font-extrabold">{d.tableTitle}</h2>
              {/* tabella su schermi larghi, schede su telefono */}
              <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-border md:block">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="bg-[hsl(var(--glacier-700)/0.08)]">
                    <tr>{d.cols.map((h) => <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {d.rows.map((r) => (
                      <tr key={r.name} className="border-t border-border align-top">
                        <th scope="row" className="px-4 py-3 font-mono text-[13px] font-semibold">{r.name}</th>
                        <td className="px-4 py-3">{r.where}</td>
                        <td className="px-4 py-3">{r.why}</td>
                        <td className="px-4 py-3">{r.time}</td>
                        <td className="px-4 py-3">{r.kind}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="mt-4 space-y-4 md:hidden">
                {d.rows.map((r) => (
                  <li key={r.name} className="surface p-5">
                    <p className="font-mono text-sm font-semibold">{r.name}</p>
                    <dl className="mt-3 space-y-2 text-sm">
                      {[[d.cols[1], r.where], [d.cols[2], r.why], [d.cols[3], r.time], [d.cols[4], r.kind]].map(([k, v]) => (
                        <div key={k}><dt className="hud text-muted-foreground">{k}</dt><dd>{v}</dd></div>
                      ))}
                    </dl>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">{d.tableNote}</p>
            </section>

            {d.blocks.map((b) => (
              <section key={b.h} id={slug(b.h)} className="mt-10 scroll-mt-28">
                <h2 className="font-display text-2xl font-extrabold">{b.h}</h2>
                <p className="mt-3 text-muted-foreground">{b.p}</p>
              </section>
            ))}
          </article>
        </main>
        <Footer />
        <CookieBanner />
      </>
    );
  }

  const { title, blocks } = content("privacy", lang);
  usePageMeta(`${title} | Peak Studio`, title);
  return (
    <>
      <Header />
      <main id="contenuto" tabIndex={-1} className="zone-snow min-h-screen pt-28 outline-none">
        <article className="wrap max-w-3xl pb-24">
          <h1 className="section-title !text-[clamp(2.5rem,9vw,6rem)]">{title}</h1>
          {blocks.map((b) => (
            <section key={b.h} className="mt-10">
              <h2 className="font-display text-2xl font-extrabold">{b.h}</h2>
              <p className="mt-3 text-muted-foreground">{b.p}</p>
            </section>
          ))}
        </article>
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
};

export default Legal;
