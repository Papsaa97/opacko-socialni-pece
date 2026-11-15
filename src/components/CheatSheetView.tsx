import React from 'react';
import { Printer } from 'lucide-react';
import { FIFTEEN_QUALITY_STANDARDS, TEN_BASIC_LIFE_NEEDS } from '../data';

export const CheatSheetView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Tahák ke zkoušce (tisk / PDF)
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Nejdůležitější čísla 2026, paragrafy, 15 standardů, první pomoc a zásady přehledně na
            pár stran A4.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-sm cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Vytisknout tahák / Uložit do PDF
        </button>
      </div>

      {/* Printable Sheet Content */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 print:border-none print:p-0 print:rounded-none">
        <div className="border-b-2 border-teal-600 pb-3 flex items-baseline justify-between gap-2">
          <div>
            <h1 className="text-xl font-black text-teal-800 dark:text-teal-300 print:text-black">
              TAHÁK KE ZKOUŠCE: Pracovník v sociálních službách (Domov pro seniory)
            </h1>
            <p className="text-xs text-slate-500">
              Zákon č. 108/2006 Sb. · Vyhláška č. 505/2006 Sb. · Platné sazby pro rok 2026
            </p>
          </div>
          <span className="text-xs font-bold text-teal-700">Pečuj s jistotou</span>
        </div>

        {/* Section 1: Key Numbers */}
        <div className="print-break-inside-avoid grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h2 className="font-extrabold text-sm uppercase tracking-wider text-teal-700 dark:text-teal-400">
              1. Klíčová čísla & Příspěvek na péči 2026
            </h2>
            <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-200">
              <li>
                <strong>Kurz PSS (§ 116):</strong> min. <strong>150 hodin</strong>. Povinné další
                vzdělávání: <strong>min. 24 hodin/rok</strong>.
              </li>
              <li>
                <strong>Mlčenlivost (§ 100):</strong> trvá i po skončení pracovního poměru!
              </li>
              <li>
                <strong>Domov pro seniory (§ 49):</strong> pobytová služba sociální péče; 8
                základních činností (§ 15 vyhl. 505/2006).
              </li>
              <li>
                <strong>Příspěvek na péči (dospělí 18+, 2026):</strong> I. ={' '}
                <strong>1 300 Kč</strong> (3–4 potřeby) | II. = <strong>5 400 Kč</strong> (5–6) |
                III. = <strong>14 800 Kč</strong> (7–8) | IV. pobytové zařízení ={' '}
                <strong>23 000 Kč</strong> (9–10), doma = <strong>27 000 Kč</strong>.
              </li>
              <li>
                <strong>Děti do 18 let:</strong> hodnotí se jen <strong>9 potřeb</strong> (bez péče
                o domácnost); I. = 4 900 Kč, II. = 8 200 Kč, III. = 16 100 Kč, IV. = 23 000 / 27 000 Kč.
              </li>
              <li>
                <strong>Max. úhrady v DS (2026):</strong> ubytování{' '}
                <strong>335 Kč/den</strong> (vícelůžkový) / <strong>380 Kč/den</strong>{' '}
                (jednolůžkový); strava max. <strong>290 Kč/den</strong> (oběd 135 Kč).
              </li>
              <li>
                <strong>Pravidlo 15 % (§ 73 odst. 3):</strong> Po úhradě bydlení a stravy musí
                klientovi v DS zůstat <strong>min. 15 % příjmu</strong>.
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h2 className="font-extrabold text-sm uppercase tracking-wider text-rose-700 dark:text-rose-400">
              2. Opatření omezující pohyb (§ 89) & Etika
            </h2>
            <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-200">
              <li>
                <strong>Zásadně ZAKÁZÁNO</strong> – nikdy pro pohodlí personálu ani jako trest!
              </li>
              <li>
                <strong>Jediná výjimka:</strong> přímé ohrožení života a zdraví klienta či okolí, po
                vyčerpání mírnějších cest (slovní zklidnění) a po dobu nezbytně nutnou.
              </li>
              <li>
                <strong>Hierarchie (§ 89 odst. 4):</strong> 1. fyzický úchop → 2. místnost pro
                bezpečný pobyt → 3. léky (jen na ordinaci a za přítomnosti lékaře).
              </li>
              <li>
                <strong>Povinnosti:</strong> přivolat lékaře, zapsat do evidence, informovat
                opatrovníka.
              </li>
              <li>
                <strong>Kompetence PSS vs. sestra:</strong> PSS NENÍ zdravotník! Léky, inzulin,
                převazy ran II.–IV. st., cévkování a hodnocení Nortonové dělá sestra. PSS pozoruje a
                hlásí.
              </li>
              <li>
                <strong>Dary & EAN:</strong> Peníze a hodnotné dary odmítáme; podezření na týrání /
                zanedbávání (EAN) hlásíme vedení a sestře.
              </li>
            </ul>
          </div>
        </div>

        {/* Section 2: 10 Needs & 15 Standards */}
        <div className="print-break-inside-avoid grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h2 className="font-extrabold text-sm uppercase tracking-wider text-teal-700 dark:text-teal-400">
              3. 10 základních životních potřeb (§ 9)
            </h2>
            <ol className="text-xs grid grid-cols-2 gap-x-3 gap-y-1 text-slate-700 dark:text-slate-200">
              {TEN_BASIC_LIFE_NEEDS.map((n) => (
                <li key={n.id}>
                  <strong>{n.number}.</strong> {n.name}
                  {!n.childEvaluated && ' *'}
                </li>
              ))}
            </ol>
            <p className="text-[11px] text-slate-500">
              * U osob do 18 let se péče o domácnost neposuzuje.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h2 className="font-extrabold text-sm uppercase tracking-wider text-teal-700 dark:text-teal-400">
              4. 15 Standardů kvality sociálních služeb
            </h2>
            <div className="text-[11px] grid grid-cols-1 gap-0.5 text-slate-700 dark:text-slate-200">
              {FIFTEEN_QUALITY_STANDARDS.map((s) => (
                <div key={s.num}>
                  <strong>{s.num}.</strong> {s.title}{' '}
                  <span className="text-slate-400">({s.group})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Care, Decubitus, Dementia & First Aid */}
        <div className="print-break-inside-avoid grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h2 className="font-extrabold text-sm uppercase tracking-wider text-amber-700 dark:text-amber-400">
              5. Dekubity, hygiena, demence & paliativa
            </h2>
            <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-200">
              <li>
                <strong>Dekubity:</strong> I. neblednoucí zarudnutí (<strong>NEMASÍROVAT!</strong>{' '}
                hned odlehčit a hlásit), II. puchýř/odřenina, III. podkoží, IV. sval/kost.
              </li>
              <li>
                <strong>Polohování:</strong> <strong>2 h ve dne / 3 h v noci</strong>; 30° šikmý bok;
                paty podložit pod lýtky (visí ve vzduchu).
              </li>
              <li>
                <strong>Škála Nortonové (5–20 b.):</strong> obrácená! ≤ 12 b. ={' '}
                <strong>vysoké riziko</strong>.
              </li>
              <li>
                <strong>PMK sáček:</strong> vždy <strong>pod úrovní měchýře</strong> a nikdy na
                podlaze.
              </li>
              <li>
                <strong>Demence vs. Delirium:</strong> Demence pomalá; Delirium náhlé, kolísavé,
                tělesná příčina (dehydratace, moč. infekce) a <strong>vratné!</strong>
              </li>
              <li>
                <strong>Validace (Naomi Feil):</strong> uznat emoci, neptat se „Proč?“.{' '}
                <strong>Bazální stimulace:</strong> iniciální dotek; uklidňující koupel PO směru
                chloupků.
              </li>
              <li>
                <strong>5 fází Kübler-Rossové:</strong> Popření – Hněv – Smlouvání – Deprese –
                Smíření. Sluch odchází jako poslední!
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h2 className="font-extrabold text-sm uppercase tracking-wider text-rose-700 dark:text-rose-400">
              6. První pomoc bleskově (155)
            </h2>
            <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-200">
              <li>
                <strong>KPR dospělého:</strong> <strong>30 : 2</strong> (hloubka 5–6 cm, 100–120/min)
                + AED. <strong>Gasping</strong> (lapavé dechy) = zástava → ihned KPR!
              </li>
              <li>
                <strong>Mrtvice (CMP – FAST):</strong> Face (koutek), Arm (ruka), Speech (řeč),
                Time → ihned 155 + čas vzniku.
              </li>
              <li>
                <strong>Dušení:</strong> účinný kašel → povzbuzovat. Tiché dušení →{' '}
                <strong>5 úderů mezi lopatky + 5× Heimlich</strong>.
              </li>
              <li>
                <strong>Zlomenina krčku:</strong> noha <strong>zkrácená a vytočená ven</strong> →
                NEZVEDAT, přikrýt, volat 155.
              </li>
              <li>
                <strong>Hypoglykémie:</strong> studený pot, třes → při vědomí rychlý cukr + sestra;
                v bezvědomí NIC DO ÚST!
              </li>
              <li>
                <strong>Epilepsie:</strong> chránit hlavu, měřit čas, křečím nebránit, NIC do úst!
              </li>
              <li>
                <strong>Dezinfekce rukou:</strong> min. <strong>30 sekund</strong> (i po sundání
                rukavic).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
