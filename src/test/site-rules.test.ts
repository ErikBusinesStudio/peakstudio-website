import { describe, expect, it } from "vitest";
import { CONTATTI, DATI_LEGALI, IDENTITA, totalePreventivo, GIORNI_CONSEGNA, PIANI, MANUTENZIONE, ADDON, stimaMensile, TESTIMONIANZE, temperatura } from "@/config/site";
import { isValidReach } from "@/lib/contact";

describe("regole sito Peak Studio", () => {
  it("consegna in 7 giorni", () => expect(GIORNI_CONSEGNA).toBe(7));
  it("prezzi di partenza dei piani, Su misura senza prezzo", () =>
    expect(PIANI.map((p) => p.prezzoDa)).toEqual([390, 790, 1490, 1200, null]));
  it("totale Business + Google Business = 830 €", () =>
    expect(totalePreventivo("business", ["gbp"])).toEqual({ totale: 830, daDefinire: false }));
  it("aggiunta già inclusa nel piano non si paga due volte", () =>
    expect(totalePreventivo("business", ["lingua"])).toEqual({ totale: 790, daDefinire: false }));
  it("Su misura resta a preventivo", () => expect(totalePreventivo("custom", []).daDefinire).toBe(true));
  it("nessun indirizzo o partita IVA nei dati pubblici", () => {
    expect("indirizzo" in CONTATTI).toBe(false);
    expect("piva" in DATI_LEGALI).toBe(false);
  });
  it("Business è il piano consigliato", () => expect(PIANI.find((p) => p.consigliato)?.id).toBe("business"));
  it("manutenzione 60 €/mese", () => expect(MANUTENZIONE.prezzoMese).toBe(60));
  it("ogni aggiunta ha un prezzo e SEO, testi e newsletter non ci sono", () => {
    expect(ADDON.every((a) => a.prezzo != null)).toBe(true);
    expect(ADDON.some((a) => ["seo", "copy", "newsletter", "migrazione"].includes(a.id))).toBe(false);
  });
  it("identità digitale: nome e dominio 30, logo 150, coordinata 290, completa 590", () =>
    expect(IDENTITA.map((x) => x.prezzoDa)).toEqual([30, 150, 290, 590]));
  it("scheda Google Business 40 €", () => expect(ADDON[0].prezzo).toBe(40));
  it("stima = a × (c/10) × b", () => expect(stimaMensile(20, 150, 3)).toBe(900));
  it("nessuna testimonianza inventata", () => expect(TESTIMONIANZE).toHaveLength(0));
  it("temperatura da +4 a −28 °C", () => {
    expect(temperatura(0)).toBe(4);
    expect(temperatura(4000)).toBe(-28);
  });
  it("il modulo accetta telefono o email", () => {
    expect(isValidReach("mario@example.com")).toBe(true);
    expect(isValidReach("+39 333 1234567")).toBe(true);
    expect(isValidReach("ciao")).toBe(false);
  });
});

describe("aggiunte", () => {
  it("lingua aggiuntiva costa 30 €", () => expect(ADDON.find((a) => a.id === "lingua")?.prezzo).toBe(30));
});
