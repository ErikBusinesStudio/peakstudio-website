import { lazy, Suspense, useEffect, useState } from "react";
import Header from "@/components/peak/Header";
import Hero from "@/components/peak/Hero";
import TrustStrip from "@/components/peak/TrustStrip";
import Thaw from "@/components/peak/Thaw";
import Services from "@/components/peak/Services";
import Process from "@/components/peak/Process";
import Works from "@/components/peak/Works";
import Pricing from "@/components/peak/Pricing";
import Me from "@/components/peak/Me";
import Faq from "@/components/peak/Faq";
import Contact from "@/components/peak/Contact";
import Footer from "@/components/peak/Footer";
import Altimeter from "@/components/peak/Altimeter";
import CookieBanner from "@/components/peak/CookieBanner";
import WhatsAppFab from "@/components/peak/WhatsAppFab";
import Crevasse from "@/components/peak/fx/Crevasse";
import Marquee from "@/components/peak/fx/Marquee";
import Preloader from "@/components/peak/fx/Preloader";
import { isFinePointer, useJsonLd, useReducedMotion, usePageMeta } from "@/hooks/peak";
import { useCopy } from "@/config/copy";
import { ADDON, DOMINIO_PRINCIPALE, IDENTITA, MANUTENZIONE, PIANI } from "@/config/site";

const Cursor = lazy(() => import("@/components/peak/fx/Cursor"));
const Avalanche = lazy(() => import("@/components/peak/fx/Avalanche"));
const Reviews = lazy(() => import("@/components/peak/Reviews"));

const Index = () => {
  usePageMeta();
  const { c, lang } = useCopy();
  // dati strutturati: domande frequenti e listino (letti da site.ts / copy.ts, mai scritti a mano)
  useJsonLd("home", {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: c.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "OfferCatalog",
        name: lang === "en" ? "Peak Studio services and starting prices" : "Servizi e prezzi di partenza Peak Studio",
        itemListElement: [
          ...PIANI.filter((p) => p.prezzoDa != null).map((p) => ({ "@type": "Offer", name: p.nome, priceSpecification: { "@type": "PriceSpecification", minPrice: p.prezzoDa, priceCurrency: "EUR" }, url: `${DOMINIO_PRINCIPALE}/#prezzi` })),
          ...IDENTITA.map((x) => ({ "@type": "Offer", name: x.nome[lang], priceSpecification: { "@type": "PriceSpecification", minPrice: x.prezzoDa, priceCurrency: "EUR" }, url: `${DOMINIO_PRINCIPALE}/#prezzi` })),
          ...ADDON.filter((a) => a.prezzo != null).map((a) => ({ "@type": "Offer", name: a.nome[lang], priceSpecification: { "@type": "PriceSpecification", minPrice: a.prezzo, priceCurrency: "EUR" }, url: `${DOMINIO_PRINCIPALE}/#prezzi` })),
          { "@type": "Offer", name: lang === "en" ? "Monthly maintenance" : "Manutenzione mensile", priceSpecification: { "@type": "UnitPriceSpecification", price: MANUTENZIONE.prezzoMese, priceCurrency: "EUR", unitText: "MON" }, url: `${DOMINIO_PRINCIPALE}/#prezzi` },
        ],
      },
    ],
  });
  const reduced = useReducedMotion();
  const [fine, setFine] = useState(false);
  useEffect(() => { setFine(isFinePointer()); }, []);
  // arrivo da un'altra pagina con /#sezione: scorre alla sezione dopo il primo disegno
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: "start" }), 120);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      {!reduced && <Preloader />}
      <Header />
      <Altimeter />
      <main id="contenuto" tabIndex={-1} className="outline-none">
        <Hero />
        <TrustStrip />
        <Thaw />
        <Marquee />
        <Services />
        <Crevasse from="zone-ice-2" to="zone-snow" />
        <Process />
        <Crevasse from="zone-snow" to="zone-mid" />
        <Works />
        <Suspense fallback={null}>
          <Reviews />
        </Suspense>
        <Pricing />
        <Crevasse from="zone-mid" to="zone-deep" />
        <Me />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
      <CookieBanner />
      <Suspense fallback={null}>
        {fine && !reduced && <Cursor />}
        {!reduced && <Avalanche />}
      </Suspense>
    </>
  );
};

export default Index;
