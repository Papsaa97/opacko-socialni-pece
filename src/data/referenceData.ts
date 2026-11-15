export interface DecubitusHotspot {
  id: string;
  position: 'back' | 'side' | 'sitting';
  name: string;
  x: number;
  y: number;
  whyRisk: string;
  prevention: string;
}

export const DECUBITUS_HOTSPOTS: DecubitusHotspot[] = [
  // Poloha na zádech (viewBox 0 0 320 420)
  {
    id: 'back-occiput',
    position: 'back',
    name: 'Týl hlavy (záhlaví)',
    x: 160,
    y: 44,
    whyRisk: 'Tenká vrstva podkoží přímo na lebeční kosti při dlouhodobém ležení na zádech.',
    prevention: 'Měkký tvarovaný podhlavník, pravidelné jemné natáčení hlavy vpravo a vlevo při polohování.',
  },
  {
    id: 'back-scapulae',
    position: 'back',
    name: 'Lopatky a trny obratlů',
    x: 132,
    y: 122,
    whyRisk: 'Kostní výběžky tlačí na měkké tkáně při skluzu v polohovací posteli (střižná síla).',
    prevention: 'Vyvarovat se vysokému polosedu bez podložení pod koleny; používat podložky a pravidelně polohovat.',
  },
  {
    id: 'back-elbows',
    position: 'back',
    name: 'Lokty (okovec)',
    x: 84,
    y: 190,
    whyRisk: 'Klient si lokty často odírá o hrubé prostěradlo při snaze posunout se nahoru.',
    prevention: 'Podkládat předloktí měkkými polštářky, hlídat čistotu a hydrataci kůže, nekrčit prostěradlo.',
  },
  {
    id: 'back-sacrum',
    position: 'back',
    name: 'Křížová kost a kostrč (sakrální oblast)',
    x: 160,
    y: 222,
    whyRisk: 'Nejčastější místo dekubitů! Kombinace vysokého tlaku trupu, vlhkosti (inkontinence) a střižných sil.',
    prevention: 'Polohování po 2 hod. ve dne (3 hod. v noci) na boky pod úhlem 30°, antidekubitní matrace, důsledná inkontinenční hygiena a bariérové krémy.',
  },
  {
    id: 'back-heels',
    position: 'back',
    name: 'Paty',
    x: 134,
    y: 382,
    whyRisk: 'Druhé nejčastější místo proleženin. Malá plocha patní kosti nese celou váhu dolní končetiny.',
    prevention: 'Paty musí „viset ve vzduchu“ – podložit lýtka měkkým válcem nebo antidekubitní botičkou (nikdy ne jen pod kolenem!).',
  },

  // Poloha na boku
  {
    id: 'side-ear',
    position: 'side',
    name: 'Ušní boltec a lícní kost',
    x: 158,
    y: 48,
    whyRisk: 'Chrupavka ucha je citlivá na ischemii při tvrdém polštáři nebo přeložení ucha.',
    prevention: 'Zkontrolovat, že ucho není ohnuté, používat měkký poddajný polštář nebo polohovací polštářek s otvorem.',
  },
  {
    id: 'side-shoulder',
    position: 'side',
    name: 'Ramenní kloub (akromion)',
    x: 155,
    y: 112,
    whyRisk: 'Při úhlu 90° nese celé rameno váhu horní poloviny těla.',
    prevention: 'Upřednostňovat šetrnou 30° boční polohu (klient neleží kolmo na rameni a kyčli), horní paži podepřít polštářem.',
  },
  {
    id: 'side-trochanter',
    position: 'side',
    name: 'Velký chocholík stehenní kosti (kyčel)',
    x: 158,
    y: 218,
    whyRisk: 'Výrazný kostní výběžek na zevní straně kyčle s vysokým rizikem hlubokých dekubitů.',
    prevention: 'Poloha pod úhlem 30° (klín za zády, hmotnost přenesena na svalstvo hýždí), podložení mezi koleny.',
  },
  {
    id: 'side-knees',
    position: 'side',
    name: 'Vnitřní a zevní strana kolen',
    x: 162,
    y: 300,
    whyRisk: 'Vzájemné tření kolen o sebe nebo tlak spodního kolene na podložku.',
    prevention: 'Vždy vložit měkký polštář nebo podložku mezi dolní končetiny od kolen až po kotníky.',
  },
  {
    id: 'side-malleolus',
    position: 'side',
    name: 'Zevní a vnitřní kotníky',
    x: 156,
    y: 374,
    whyRisk: 'Kotníky nemají téměř žádnou tukovou ani svalovou vrstvu.',
    prevention: 'Podložit bérce tak, aby kotník neležel přímo na matraci a kotníky se netřely o sebe.',
  },

  // Vsedě (vozík / křeslo)
  {
    id: 'sit-scapulae',
    position: 'sitting',
    name: 'Lopatky a hrudní páteř',
    x: 120,
    y: 126,
    whyRisk: 'Tlak opěradla vozíku při sesutém sedu a oslabeném svalstvu zad.',
    prevention: 'Správné nastavení opěrky, polohovací sedák s oporou beder, kontrola polohy každé 2 hodiny.',
  },
  {
    id: 'sit-ischial',
    position: 'sitting',
    name: 'Sedací hrboly (ischia) a kostrč',
    x: 154,
    y: 230,
    whyRisk: 'Při dlouhém sezení nese téměř celou hmotnost těla malá plocha sedacích hrbolů.',
    prevention: 'Speciální antidekubitní podsedák (gelový, vzduchový, paměťová pěna), odlehčování každých 15–30 minut nebo návrat na lůžko po max. 2 hodinách.',
  },
  {
    id: 'sit-popliteal',
    position: 'sitting',
    name: 'Podkolenní jamka a zadní plocha stehen',
    x: 205,
    y: 265,
    whyRisk: 'Příliš dlouhý sedák vozíku tlačí na cévy a nervy v podkolení.',
    prevention: 'Mezi okrajem sedáku a podkolenní jamkou musí zůstat mezera na 2–3 prsty. Chodidla opřená o stupačky.',
  },
  {
    id: 'sit-heels',
    position: 'sitting',
    name: 'Paty a nárty na stupačkách',
    x: 224,
    y: 368,
    whyRisk: 'Tlak tvrdé stupačky na patu nebo sklouznutí nohy za stupačku.',
    prevention: 'Správná výška stupaček (stehna vodorovně), pohodlná měkká obuv bez pevných švů, patní řemínky.',
  },
];

export interface DecubitusStage {
  stage: string;
  title: string;
  visualSign: string;
  actionForPss: string;
  severityColor: string;
}

export const DECUBITUS_STAGES: DecubitusStage[] = [
  {
    stage: 'I. stupeň',
    title: 'Neblednoucí zarudnutí neporušené kůže',
    visualSign:
      'Kůže je celistvá, ale červená (u tmavší kůže namodralá). Po zatlačení prstem zarudnutí NEBLEDNE! Může být teplá, tuhá nebo bolestivá.',
    actionForPss:
      'Okamžitě odlehčit tlak (přepolohovat!), NIKDY místo nemasírovat ani netřít! Ihned nahlásit zdravotní sestře. Zkontrolovat stav prostěradla a inkontinenčních pomůcek.',
    severityColor: 'amber',
  },
  {
    stage: 'II. stupeň',
    title: 'Puchýř nebo povrchové poškození kůže',
    visualSign:
      'Částečná ztráta kůže zasahující epidermis/dermis. Vypadá jako odřenina, mělký růžovočervený vřed bez povlaku nebo naplněný puchýř.',
    actionForPss:
      'Puchýř v žádném případě nepropichovat ani nestrhávat! Chránit před dalším tlakem a třením, ihned předat k ošetření zdravotní sestře.',
    severityColor: 'orange',
  },
  {
    stage: 'III. stupeň',
    title: 'Hluboký vřed zasahující podkoží',
    visualSign:
      'Úplná ztráta kůže s poškozením podkožního tuku. Mohou být viditelné povlaky nebo nekróza (černá/žlutá tkáň), mohou být podminované okraje. Sval a kost ještě nejsou obnaženy.',
    actionForPss:
      'Výhradně v kompetenci zdravotní sestry a lékaře! PSS zajišťuje přísné polohování mimo ránu, prevenci znečištění stolicí/močí a hlásí prosáknutí krytí či zápach.',
    severityColor: 'rose',
  },
  {
    stage: 'IV. stupeň',
    title: 'Rozsáhlá destrukce až na sval, šlachu nebo kost',
    visualSign:
      'Hluboký defekt odhalující svaly, šlachy nebo kosti. Vysoké riziko těžké infekce (sepse). Klient nemusí cítit bolest kvůli poškození nervů.',
    actionForPss:
      'Maximální šetrnost při manipulaci, striktní dodržování pokynů sestry, sledování celkových příznaků infekce (teplota, třesavka, zmatenost) a ihned hlásit.',
    severityColor: 'red',
  },
];

export const TEN_BASIC_LIFE_NEEDS = [
  {
    id: 'mobilita',
    number: 1,
    name: 'Mobilita',
    description: 'Schopnost vstávat, usedat, stát, měnit polohy, chodit po rovině i po schodech.',
    childEvaluated: true,
  },
  {
    id: 'orientace',
    number: 2,
    name: 'Orientace',
    description: 'Schopnost orientovat se zrakem, sluchem, rozumem v čase, místě a vlastní osobě.',
    childEvaluated: true,
  },
  {
    id: 'komunikace',
    number: 3,
    name: 'Komunikace',
    description: 'Schopnost dorozumět se řečí, písmem nebo náhradními způsoby a porozumět sdělení.',
    childEvaluated: true,
  },
  {
    id: 'stravovani',
    number: 4,
    name: 'Stravování',
    description: 'Schopnost vybrat, naporcovat a přijmout stravu a tekutiny (včetně dietního režimu).',
    childEvaluated: true,
  },
  {
    id: 'oblekani',
    number: 5,
    name: 'Oblékání a obouvání',
    description: 'Schopnost vybrat si přiměřené oblečení, obléknout se, svléknout a obout.',
    childEvaluated: true,
  },
  {
    id: 'hygiena',
    number: 6,
    name: 'Tělesná hygiena',
    description: 'Schopnost umýt se, vykoupat, pečovat o dutinu ústní, vlasy, nehty a osušit se.',
    childEvaluated: true,
  },
  {
    id: 'fyziologicka',
    number: 7,
    name: 'Výkon fyziologické potřeby',
    description: 'Schopnost včas dojít na WC, vyprázdnit se, očistit a použít pomůcky při inkontinenci.',
    childEvaluated: true,
  },
  {
    id: 'zdravi',
    number: 8,
    name: 'Péče o zdraví',
    description: 'Schopnost dodržovat léčebný režim, užívat předepsané léky, ošetřit drobné poranění.',
    childEvaluated: true,
  },
  {
    id: 'aktivity',
    number: 9,
    name: 'Osobní aktivity',
    description: 'Schopnost stanovit a dodržet denní program, zapojit se do běžných činností a kontaktu.',
    childEvaluated: true,
  },
  {
    id: 'domacnost',
    number: 10,
    name: 'Péče o domácnost',
    description: 'Schopnost nakoupit, uvařit jednoduché jídlo, běžně uklidit, vyprat a hospodařit. (U dětí do 18 let se NEHODNOTÍ!)',
    childEvaluated: false,
  },
];

export const FIFTEEN_QUALITY_STANDARDS = [
  { num: 1, group: 'Procesní', title: 'Cíle a způsoby poskytování sociální služby', note: 'Poslání, cíle, cílová skupina, zásady (zásadní kritérium).' },
  { num: 2, group: 'Procesní', title: 'Ochrana práv osob', note: 'Prevence střetu zájmů, ochrana důstojnosti a soukromí, nulová tolerance zneužívání (zásadní kritérium).' },
  { num: 3, group: 'Procesní', title: 'Jednání se zájemcem o sociální službu', note: 'Srozumitelné informace před podpisem smlouvy, odmítnutí jen ze zákonných důvodů.' },
  { num: 4, group: 'Procesní', title: 'Smlouva o poskytování sociální služby', note: 'Písemná forma v DS, srozumitelnost, úhrada, výpovědní důvody.' },
  { num: 5, group: 'Procesní', title: 'Individuální plánování průběhu sociální služby', note: 'Klíčový pracovník, osobní cíle klienta, pravidelné přehodnocování (zásadní kritérium).' },
  { num: 6, group: 'Procesní', title: 'Dokumentace o poskytování sociální služby', note: 'Záznamy o průběhu péče, ochrana osobních údajů (GDPR), nahlížení klienta.' },
  { num: 7, group: 'Procesní', title: 'Stížnosti na kvalitu nebo způsob poskytování služby', note: 'Právo stěžovat si bez obavy z odvetného chování, i anonymně, srozumitelný postup (zásadní kritérium).' },
  { num: 8, group: 'Procesní', title: 'Návaznost poskytované sociální služby na další zdroje', note: 'Spolupráce s rodinou, lékaři, úřady a návaznými službami v přirozené komunitě.' },
  { num: 9, group: 'Personální', title: 'Personální a organizační zajištění sociální služby', note: 'Odborná způsobilost dle § 116, počet pracovníků, jasné kompetence.' },
  { num: 10, group: 'Personální', title: 'Profesní rozvoj zaměstnanců', note: 'Zaškolení, povinných min. 24 h dalšího vzdělávání ročně, supervize.' },
  { num: 11, group: 'Provozní', title: 'Místní a časová dostupnost poskytované sociální služby', note: 'Provozní doba (v DS nepřetržitě 24/7), bezbariérovost a dostupnost.' },
  { num: 12, group: 'Provozní', title: 'Informovanost o poskytované sociální službě', note: 'Veřejné materiály, web, srozumitelné údaje pro zájemce i veřejnost.' },
  { num: 13, group: 'Provozní', title: 'Prostředí a podmínky', note: 'Bezpečné, důstojné, čisté a přizpůsobené prostory domova pro seniory.' },
  { num: 14, group: 'Provozní', title: 'Nouzové a havarijní situace', note: 'Postupy při požáru, výpadku proudu, náhlém kolapsu, agresivitě.' },
  { num: 15, group: 'Provozní', title: 'Zvyšování kvality sociální služby', note: 'Pravidelné vyhodnocování spokojenosti klientů a zlepšování péče.' },
];

export const VITAL_SIGNS_REFERENCE = [
  {
    parameter: 'Tělesná teplota (TT)',
    normalRange: '36,0 – 36,9 °C',
    warningSigns: 'Pod 35,5 °C (hypotermie – pozor u seniorů!) nebo nad 38,0 °C (horečka; u seniorů se infekce může projevit bez horečky jen náhlou zmateností!).',
    pssNote: 'Měří zpravidla sestra nebo dle interního řádu; PSS hlásí třesavku, horkou či studenou kůži, apatii.',
  },
  {
    parameter: 'Tepová frekvence (puls)',
    normalRange: '60 – 90 tepů / min',
    warningSigns: 'Pod 50/min (bradykardie), nad 100/min v klidu (tachykardie) nebo nepravidelný tep.',
    pssNote: 'Při zástavě se tep u laické KPR nehmatá – sledujeme vědomí a normální dýchání!',
  },
  {
    parameter: 'Krevní tlak (TK)',
    normalRange: 'cca 120/80 mmHg (u seniorů tolerance do 140/90)',
    warningSigns: 'Pod 90/60 (hypotenze – riziko kolapsu a pádu při vstávání!) nebo nad 180/110 (hypertenzní krize s bolestí hlavy/hrudi).',
    pssNote: 'Pokud si senior stěžuje na motání hlavy při posazení (ortostatická hypotenze), nenechávat ho hned vstát a přivolat sestru.',
  },
  {
    parameter: 'Dechová frekvence',
    normalRange: '12 – 20 dechů / min',
    warningSigns: 'Pod 10 nebo nad 25/min, lapavé dýchání (gasping = zástava!), chrčení, modrání rtů (cyanóza).',
    pssNote: 'Dušnost je vždy varovný příznak – zvednout horní polovinu těla (poloha vsedě/polosedě) a ihned volat sestru/155.',
  },
  {
    parameter: 'Glykémie (hladina cukru v krvi)',
    normalRange: '3,9 – 5,6 mmol/l nalačno',
    warningSigns: 'Pod 3,9 mmol/l (HYPOGLYKÉMIE – studený pot, třes, zmatenost, agresivita, bezvědomí) vs. vysoko nad 15 (HYPERGLYKÉMIE – žízeň, aceton z úst).',
    pssNote: 'Odběr z prstu provádí sestra; při podezření na hypoglykémii u vědomého klienta podat sladký nápoj/hroznový cukr a ihned volat sestru.',
  },
];

export const COMPETENCY_MATRIX = [
  {
    task: 'Pomoc s koupáním, oblékáním, polohováním a úpravou lůžka',
    pss: 'Ano – hlavní náplň přímé obslužné péče (§ 15 vyhl. 505/2006)',
    nurse: 'Dohled u vysoce rizikových klientů (po operaci, těžké dekubity)',
  },
  {
    task: 'Podávání stravy a tekutin, dopomoc při jídle',
    pss: 'Ano – sleduje příjem stravy, zbytků a polykání (dysfagie)',
    nurse: 'Výživa sondou (PEG, NGS) a parenterální výživa',
  },
  {
    task: 'Příprava léků do dávkovačů, aplikace inzulinu a injekcí',
    pss: 'NE – pracovník v sociálních službách není zdravotník!',
    nurse: 'Výhradně všeobecná / praktická sestra dle ordinace lékaře',
  },
  {
    task: 'Ošetřování ran, dekubitů II.–IV. st., cévkování močového měchýře',
    pss: 'NE – sleduje stav kůže, čistí okolí, hlásí změny a prosak krytí',
    nurse: 'Výhradně zdravotnický pracovník (převazy, zavedení PMK)',
  },
  {
    task: 'Vyprazdňování sběrného sáčku PMK a péče o stomii',
    pss: 'Běžná péče o zevní hygienu, sledování náplně sáčku (sáček vždy pod úrovní měchýře!), výměna podložek dle kompetence a vnitřního předpisu',
    nurse: 'Zavedení/výměna PMK, řešení neprůchodnosti, krvácení či komplikací stomie',
  },
  {
    task: 'Hodnocení rizika dekubitů (škála Nortonové) a pádů',
    pss: 'Pozoruje denní změny u klienta (zarudnutí, otoky, nejistá chůze) a ihned hlásí',
    nurse: 'Odborně vyplňuje a vyhodnocuje ošetřovatelskou dokumentaci a skóre',
  },
];
