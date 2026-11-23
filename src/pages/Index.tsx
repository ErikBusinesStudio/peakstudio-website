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
import { isFinePointer, useReducedMotion, usePageMeta } from "@/hooks/peak";

const Cursor = lazy(() => import("@/components/peak/fx/Cursor"));
const Avalanche = lazy(() => import("@/components/peak/fx/Avalanche"));
const Reviews = lazy(() => import("@/components/peak/Reviews"));

const Index = () => {
  usePageMeta();
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
