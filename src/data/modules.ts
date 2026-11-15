import type { StudyModule } from '../types/study';

export const STUDY_MODULES: StudyModule[] = [
  {
    id: 'legislativa',
    order: 1,
    title: 'Legislativa, zákon č. 108/2006 Sb. a Domov pro seniory',
    shortTitle: 'Legislativa & 108/2006',
    subtitle: 'Základní zákon, formy služeb, příspěvek na péči 2026, úhrady a kvalifikace PSS',
    estimatedMinutes: 20,
    accentColor: 'teal',
    badgeText: 'Okruh 1 · Zákonný základ',
    overview:
      'Tento okruh je páteří celé písemné i ústní zkoušky. Musíte bezpečně ovládat zákon č. 108/2006 Sb., o sociálních službách, a prováděcí vyhlášku č. 505/2006 Sb., znát přesná čísla (2026), druhy a formy služeb, příspěvek na péči a své zákonné povinnosti jako pracovník v sociálních službách (PSS).',
    sections: [
      {
        id: 'leg-zakon-zasady',
        title: '1.1 Zákon č. 108/2006 Sb. – základní zásady (§ 2) a formy služeb',
        summary:
          'Zákon o sociálních službách vstoupil v účinnost 1. 1. 2007 a upravuje podmínky pomoci lidem v nepříznivé sociální situaci.',
        keyPoints: [
          'Zásada lidské důstojnosti (§ 2): Rozsah a forma pomoci a podpory musí zachovávat lidskou důstojnost osob, vycházet z individuálně určených potřeb a podporovat rozvoj jejich samostatnosti a soběstačnosti.',
          'Sociální služby se poskytují v zájmu osob a v náležité kvalitě takovými způsoby, které vždy důsledně zajišťují dodržování lidských práv a základních svobod.',
          'Bezplatné základní sociální poradenství: Každá osoba má zákonný nárok na bezplatné poskytnutí základního sociálního poradenství o možnostech řešení nepříznivé sociální situace – musí ho poskytnout každý poskytovatel.',
          '3 formy sociálních služeb (§ 33): Pobytové (např. domov pro seniory – s ubytováním), Ambulantní (klient dochází, např. denní stacionář) a Terénní (služba jde za klientem domů, např. pečovatelská služba, osobní asistence).',
          '3 druhy sociálních služeb: 1. Sociální poradenství, 2. Služby sociální péče (sem patří Domov pro seniory!), 3. Služby sociální prevence.',
        ],
        mnemonic: '3 formy = P-A-T (Pobytová, Ambulantní, Terénní). Domov pro seniory je Pobytová služba sociální PÉČE.',
      },
      {
        id: 'leg-ds-vs-dzr',
        title: '1.2 Domov pro seniory (§ 49) a 8 základních činností (§ 15 vyhl. 505/2006)',
        summary:
          'Zkoušející často chtějí přesně rozlišit Domov pro seniory (§ 49) od Domova se zvláštním režimem (§ 50) a od Pečovatelské služby (§ 40).',
        keyPoints: [
          'Domov pro seniory (§ 49): Pobytová služba pro osoby, které dosáhly věku rozhodného pro přiznání starobního důchodu a mají sníženou soběstačnost zejména z důvodu věku, jejichž situace vyžaduje pravidelnou pomoc jiné fyzické osoby.',
          'Domov se zvláštním režimem (§ 50): Pobytová služba s upraveným režimem pro osoby se sníženou soběstačností z důvodu chronického duševního onemocnění, závislosti na návykových látkách nebo stařecké, Alzheimerovy či jiných typů demence.',
          '8 základních činností v Domově pro seniory (§ 15 vyhlášky č. 505/2006 Sb.): 1. Poskytnutí ubytování (včetně úklidu, praní, drobných oprav prádla a žehlení), 2. Poskytnutí stravy (celodenní, min. 3 hlavní jídla), 3. Pomoc při zvládání běžných úkonů péče o vlastní osobu, 4. Pomoc při osobní hygieně (včetně péče o vlasy a nehty, WC), 5. Zprostředkování kontaktu se společenským prostředím, 6. Sociálně terapeutické činnosti, 7. Aktivizační činnosti, 8. Pomoc při uplatňování práv, oprávněných zájmů a při obstarávání osobních záležitostí.',
        ],
        practicalTip:
          'Pozor na drobnou, ale častou zkouškovou otázku: v Domově pro seniory je úklid, praní, drobné opravy prádla a žehlení součástí položky „poskytnutí ubytování“ (nikoliv samostatně placená pečovatelská služba).',
      },
      {
        id: 'leg-pnp-2026',
        title: '1.3 10 základních životních potřeb (§ 9) a Příspěvek na péči (2026)',
        summary:
          'Příspěvek na péči je určen přímo osobě (nikoliv zařízení) na nákup potřebné péče. V domově pro seniory však příspěvek náleží zařízení na úhradu péče.',
        keyPoints: [
          '10 základních životních potřeb (§ 9): 1. Mobilita, 2. Orientace, 3. Komunikace, 4. Stravování, 5. Oblékání a obouvání, 6. Tělesná hygiena, 7. Výkon fyziologické potřeby, 8. Péče o zdraví, 9. Osobní aktivity, 10. Péče o domácnost.',
          'U osob do 18 let se péče o domácnost NEHODNOTÍ – posuzuje se pouze 9 potřeb.',
          'Stupně závislosti u dospělých (nad 18 let): I. stupeň (3–4 nezvládané potřeby), II. stupeň (5–6), III. stupeň (7–8), IV. stupeň (9–10).',
          'Měsíční výše příspěvku na péči pro dospělé (platné v roce 2026): I. = 1 300 Kč | II. = 5 400 Kč | III. = 14 800 Kč | IV. v pobytovém zařízení (DS, DZR) = 23 000 Kč | IV. doma / v terénu = 27 000 Kč.',
        ],
        table: {
          headers: ['Stupeň závislosti', 'Nezvládané potřeby (18+)', 'Dospělí 18+ (2026)', 'Děti do 18 let (2026)'],
          rows: [
            ['I. stupeň (lehká)', '3 – 4 potřeby', '1 300 Kč', '4 900 Kč (3 potřeby)'],
            ['II. stupeň (středně těžká)', '5 – 6 potřeb', '5 400 Kč', '8 200 Kč (4–5 potřeb)'],
            ['III. stupeň (těžká)', '7 – 8 potřeb', '14 800 Kč', '16 100 Kč (6–7 potřeb)'],
            ['IV. stupeň – pobytová služba', '9 – 10 potřeb', '23 000 Kč', '23 000 Kč (8–9 potřeb)'],
            ['IV. stupeň – doma / terénní', '9 – 10 potřeb', '27 000 Kč', '27 000 Kč (8–9 potřeb)'],
          ],
        },
        mnemonic: 'Kouzelná pomůcka pro 10 potřeb: M-O-K-S-O-T-V-P-O-P (Mobilita, Orientace, Komunikace, Stravování, Oblékání, Tělesná hygiena, Výkon fyz. potřeby, Péče o zdraví, Osobní aktivity, Péče o domácnost).',
      },
      {
        id: 'leg-uhrady-2026',
        title: '1.4 Maximální úhrady v domově pro seniory (2026) a pravidlo 15 %',
        summary:
          'Vyhláška č. 505/2006 Sb. určuje horní stropy za ubytování a stravu a zákon chrání seniora před finanční nouzí.',
        keyPoints: [
          'Maximální denní úhrada za ubytování v DS (2026): nejvýše 335 Kč/den ve vícelůžkovém pokoji a nejvýše 380 Kč/den v jednolůžkovém pokoji.',
          'Maximální denní úhrada za celodenní stravu (2026): nejvýše 290 Kč/den (samostatný oběd max. 135 Kč/den).',
          'Pravidlo minimálního zůstatku (§ 73 odst. 3): Po úhradě za ubytování a stravu v celoroční pobytové službě musí klientovi zůstat alespoň 15 % z jeho měsíčního příjmu (důchodu). Pokud má nízký důchod a na plnou úhradu nestačí, úhrada se přiměřeně sníží.',
          'Úkony péče se v domově pro seniory hradí z přiznaného příspěvku na péči.',
        ],
      },
      {
        id: 'leg-pss-116',
        title: '1.5 Kvalifikace a povinnosti pracovníka v sociálních službách (§ 116 a § 100)',
        summary:
          'Aby mohl člověk vykonávat přímou obslužnou péči, musí splnit zákonné vzdělání, bezúhonnost a zdravotní způsobilost.',
        keyPoints: [
          'Kvalifikační kurz PSS (§ 116): akreditovaný MPSV v minimálním rozsahu 150 hodin (teorie + praxe).',
          'Další vzdělávání (§ 116 odst. 9): Pracovník v sociálních službách je povinen průběžně se vzdělávat nejméně v rozsahu 24 hodin za kalendářní rok.',
          'Povinnost mlčenlivosti (§ 100): Platí o všech skutečnostech zjištěných při poskytování služby – a trvá i po skončení pracovního poměru!',
          'Pozor na kompetence: PSS NENÍ zdravotnický pracovník (neaplikuje injekce, nepřipravuje léky, neléčí rány). Sleduje však změny u klienta a hlásí je zdravotní sestře.',
        ],
      },
    ],
    examTips: [
      'U ústní zkoušky začněte u zákona 108/2006 Sb. tím, že jde o ochranu lidské důstojnosti a podporu soběstačnosti (§ 2).',
      'Umějte z hlavy odlišit IV. stupeň příspěvku na péči: 23 000 Kč v domově pro seniory vs. 27 000 Kč doma.',
      'Vždy zdůrazněte magickou hranici 15 % zůstatku z příjmu klienta po zaplacení stravy a bydlení.',
    ],
    examTraps: [
      {
        trap: '„Pracovník v sociálních službách může po zaučení sestrou podávat klientovi v domově pro seniory inzulín.“',
        truth: 'NE! Inzulín a příprava/podání léků v pobytovém zařízení je zdravotnický výkon sestry. PSS není zdravotnický pracovník.',
      },
      {
        trap: '„U dětí do 18 let se posuzuje všech 10 základních životních potřeb jako u dospělých.“',
        truth: 'NE! U dětí do 18 let se neposuzuje „péče o domácnost“, hodnotí se pouze 9 základních životních potřeb.',
      },
      {
        trap: '„Povinnost mlčenlivosti končí dnem, kdy pečovatel podá výpověď a odejde z domova.“',
        truth: 'NE! Podle § 100 zákona č. 108/2006 Sb. trvá povinnost mlčenlivosti i po skončení pracovněprávního vztahu.',
      },
    ],
  },
  {
    id: 'standardy-prava',
    order: 2,
    title: 'Standardy kvality, etika, ochrana práv a § 89 (omezení pohybu)',
    shortTitle: 'Standardy & Ochrana práv',
    subtitle: '15 standardů kvality, individuální plánování, stížnosti, prevence týrání a § 89',
    estimatedMinutes: 18,
    accentColor: 'emerald',
    badgeText: 'Okruh 2 · Kvalita & Etika',
    overview:
      'Inspekce kvality sociálních služeb kontrolují tzv. Standardy kvality (příloha č. 2 vyhlášky č. 505/2006 Sb.). Zkoušející kladou obrovský důraz na ochranu práv seniorů, individuální plánování, stížnosti a přísná pravidla omezujících opatření podle § 89.',
    sections: [
      {
        id: 'std-15-prehled',
        title: '2.1 Systém 15 Standardů kvality sociálních služeb',
        summary:
          'Standardy jsou rozděleny do tří skupin: procesní (1–8), personální (9–10) a provozní (11–15).',
        keyPoints: [
          'Procesní standardy (1–8 – jak služba pracuje s klientem): 1. Cíle a způsoby, 2. Ochrana práv osob, 3. Jednání se zájemcem, 4. Smlouva, 5. Individuální plánování, 6. Dokumentace, 7. Stížnosti, 8. Návaznost na další zdroje.',
          'Personální standardy (9–10 – lidé v týmu): 9. Personální a organizační zajištění, 10. Profesní rozvoj zaměstnanců (školení, 24 h/rok, supervize).',
          'Provozní standardy (11–15 – zázemí a bezpečnost): 11. Místní a časová dostupnost, 12. Informovanost, 13. Prostředí a podmínky, 14. Nouzové a havarijní situace, 15. Zvyšování kvality.',
          'Zásadní kritéria (např. ve Standardech 1, 2, 5, 7, 14): jejich hrubé neplnění může vést až k odebrání registrace služby!',
        ],
        mnemonic: '8 Procesních (cesta klienta od zájemce po stížnost a návaznost) + 2 Personální (lidi a rozvoj) + 5 Provozních (barák, info, bezpečnost, kvalita) = 15.',
      },
      {
        id: 'std-ip-stiznosti',
        title: '2.2 Individuální plánování (Standard č. 5) a Stížnosti (Standard č. 7)',
        summary:
          'Péče nesmí být „pásová výroba“ podle jednotného harmonogramu ústavu, ale podle potřeb a rytmu konkrétního seniora.',
        keyPoints: [
          'Individuální plán (IP): Vytváří se společně s klientem a jeho klíčovým pracovníkem. Obsahuje jeho přání, zvyky (kdy vstává, zda pije čaj či kávu), cíle a konkrétní domluvu podpory.',
          'Pravidelné přehodnocování IP: Plán je živý dokument – mění se, kdykoliv se změní zdravotní stav či přání klienta.',
          'Stížnosti (Standard č. 7): Stížnost není „zrada“, ale zpětná vazba pro zlepšení! Klient si může stěžovat ústně, písemně i anonymně (schránka důvěry) nebo přes nezávislou osobu.',
          'Zákaz postihu: Nikdo nesmí klienta trestat, zanedbávat či zesměšňovat za to, že si stěžoval.',
        ],
      },
      {
        id: 'std-paragraf-89',
        title: '2.3 Opatření omezující pohyb osob (§ 89 zákona č. 108/2006 Sb.)',
        summary:
          'Jedno z nejdůležitějších témat u zkoušek. V domovech pro seniory se nesmějí používat postranice, zamykání pokojů ani tlumící léky z pohodlnosti personálu!',
        keyPoints: [
          'Základní zákaz: Při poskytování sociálních služeb NELZE používat opatření omezující pohyb osob.',
          'Jediná zákonná výjimka: Pouze v případě PŘÍMÉHO OHROŽENÍ ZDRAVÍ A ŽIVOTA klienta nebo jiných fyzických osob – a pouze po DOBU NEZBYTNĚ NUTNOU k odvrácení nebezpečí!',
          'Podmínka mírnějších prostředků: Nejprve se musí neúspěšně vyčerpat mírnější cesty (slovní zklidnění, odvedení pozornosti, odstranění nebezpečných předmětů).',
          'Zákonná hierarchie (§ 89 odst. 4): 1. Fyzický úchop → 2. Místnost zřízená k bezpečnému pobytu → 3. Léčivé přípravky (výhradně na základě ordinace přivolaného lékaře a ZA JEHO PŘÍTOMNOSTI!).',
          'Povinnosti po použití: Přivolat lékaře (pokud nestačil krátký úchop), provést podrobný písemný záznam do evidence omezení, nahlásit opatrovníkovi/zákonnému zástupci a poučit klienta.',
        ],
        practicalTip:
          'Pozor na zvedání obou postranic na lůžku! Pokud klient z postele nemůže sám vylézt a chce vstát, vytažené postranice bez jeho souhlasu a bez bezpečnostní indikace mohou být hodnoceny jako nezákonné omezení svobody (a navíc hrozí nebezpečný pád přes ně!).',
      },
      {
        id: 'std-ean-etika',
        title: '2.4 Prevence týrání seniorů (EAN), etika a střet zájmů',
        summary:
          'Pracovník chrání důstojnost a bezpečí klienta a hlídá hranice profesionálního vztahu.',
        keyPoints: [
          'Formy EAN (Elder Abuse and Neglect): fyzické týrání (štípání, tahání, modřiny), psychické (křik, infantilizace – „babičko, nekřičte na mě“, vyhrožování), finanční zneužívání (rodina či personál bere důchod), sexuální a zanedbávání péče (žíznící či špinavý klient).',
          'Dary a střet zájmů: Pracovník nesmí přijímat peníze, hodnotné dary ani dědictví od klientů nebo jejich rodin. Zabrání tak podezření ze zvýhodňování či vydírání.',
          'Soukromí a intimita: Klepat před vstupem na pokoj, nezdržovat se při hygieně s otevřenými dveřmi, neodhalovat zbytečně tělo klienta, oslovovat příjmením a vykat (pokud si klient nepřeje jinak).',
        ],
      },
    ],
    examTips: [
      'Pokud se komise zeptá na „postranice nebo přikurtování neklidného seniora“, ihned citujte § 89 – zákaz omezení, výjimka jen přímé ohrožení života/zdraví, nejprve slovní zklidnění, až pak úchop / bezpečná místnost / léky jen s lékařem.',
      'U individuálního plánu vždy zmiňte pojmy „klíčový pracovník“, „přání klienta“ a „prevence ústavního stereotypu“.',
    ],
    examTraps: [
      {
        trap: '„Když je klient v noci zmatený a padá z postele, můžeme mu bez dalšího zvednout všechny postranice a přivázat ho pásem, aby si neublížil.“',
        truth: 'NE! To je nelegální omezování pohybu (§ 89). Bezpečnost se řeší sníženým lůžkem, matrací vedle postele, hlásičem pohybu či řešením příčiny neklidu (bolest, WC).',
      },
      {
        trap: '„Anonymní stížnost hozenou do schránky nemusí domov řešit.“',
        truth: 'NE! Podle Standardu č. 7 musí mít služba postup i pro vyřizování anonymních stížností.',
      },
    ],
  },
  {
    id: 'prima-pece',
    order: 3,
    title: 'Přímá péče: Hygiena, výživa, inkontinence a hranice kompetencí',
    shortTitle: 'Hygiena, výživa & Péče',
    subtitle: 'Osobní hygiena, pitný režim, diety, péče o PMK a stomie, PSS vs. zdravotní sestra',
    estimatedMinutes: 22,
    accentColor: 'cyan',
    badgeText: 'Okruh 3 · Denní praxe',
    overview:
      'Zde se potkává každodenní rutina v domově pro seniory se základy ošetřovatelství. Zkoušející budou chtít znát správný postup při hygieně na lůžku, péči o kůži a dutinu ústní, rozpoznání dehydratace, práci s inkontinencí a jasné hranice toho, co smí PSS a co smí jen sestra.',
    sections: [
      {
        id: 'pece-hygiena',
        title: '3.1 Zásady osobní hygieny seniorů a hygiena na lůžku',
        summary:
          'Hygiena není jen očista těla, ale i prevence infekcí, opruzenin a příležitost ke kontrole stavu kůže a ke klidnému kontaktu.',
        keyPoints: [
          'Zajištění soukromí a tepelného komfortu: Zavřít okno i dveře, vyvětrat předem, použít zástěnu, odkrývat vždy jen tu část těla, kterou právě myjeme (prevence prochladnutí i studu).',
          'Postup mytí na lůžku (od nejčistšího k nejšpinavějšímu): Obličej (čistou vodou bez mýdla, oči od zevního koutku k vnitřnímu!), krk, hrudník a ruce, záda, dolní končetiny, a nakonec intimní partie a konečník (čistou žínkou zepředu dozadu!).',
          'Ochrana kožních záhybů (prevence intertriga): Pod prsy, v tříslech, pod břichem a mezi prsty nohou vždy důkladně osušit přikládáním ručníku (nikoliv hrubým třením!).',
          'Dutina ústní a zubní protéza: Protézu čistit kartáčkem pod tekoucí studenou/vlažnou vodou nad umyvadlem napuštěným vodou nebo s ručníkem (aby při pádu nepraskla!), ústa vypláchnout i bezzubým klientům.',
          'Péče o nehty a vlasy: U klientů s cukrovkou (diabetes mellitus) nebo poruchou prokrvení dolních končetin NEHTY NA NOHOU NESTŘÍHAT nůžkami – hrozí těžce se hojící infekce (diabetická noha); pouze opatrně pilovat nebo zajistit odbornou pedikúru/sestru!',
        ],
      },
      {
        id: 'pece-vyziva',
        title: '3.2 Výživa, pitný režim a polykání (dysfagie)',
        summary:
          'Senioři mají přirozeně oslabený pocit žízně a často méně chuti k jídlu. Dehydratace a malnutrice přímo vedou k pádům, zmatenosti a dekubitům.',
        keyPoints: [
          'Dehydratace u seniora – varovné příznaky: Suché rty a oschlý jazyk, tmavá a zapáchající moč, zácpa, únava, pokles tlaku, zhoršený kožní turgor (pomalé vyrovnání kožní řasy pod klíční kostí) a NÁHLÁ ZMATENOST (delirium).',
          'Doporučený příjem tekutin: Cca 1,5–2 litry denně (pokud lékař neomezí např. při těžkém srdečním či ledvinném selhávání). Nabízet v malých porcích během celého dne (do 17–18 h více, večer méně kvůli nočnímu vstávání).',
          'Bezpečné krmení a prevence aspirace (vdechnutí): Klient musí sedět zpříma (90°), nikdy ho nekrmit v záklonu nebo vleže! Nechávat dostatek času na polknutí, po jídle ponechat vsedě alespoň 20–30 minut.',
          'Základní diety: č. 3 (racionální), č. 2 (šetřící – lehce stravitelná při onemocnění žaludku/žlučníku), č. 9 (diabetická – bez jednoduchých cukrů, pravidelný režim po aplikaci inzulinu!).',
        ],
      },
      {
        id: 'pece-inkontinence-pmk',
        title: '3.3 Inkontinence, vyprazdňování a péče o klienta s PMK / stomií',
        summary:
          'Únik moči nebo stolice vyžaduje mimořádný takt, kvalitní absorpční pomůcky a důslednou hygienu bez zbytečného ponižování.',
        keyPoints: [
          'Druhy inkontinence: Stresová (únik při kašli/smíchu), Urgentní (náhlé nutkání), Přepadová (při zvětšené prostatě), Funkční (klient nedojde včas na WC kvůli mobilitě nebo demenci).',
          'Inkontinenční pomůcky: Vložky, vložné pleny se síťovanými kalhotkami, zalepovací kalhotkové pleny (pro ležící), navlékací kalhotky (pro mobilní). Výměna vždy dle indikátoru vlhkosti a po každé stolici, ošetření ochranným krémem.',
          'Klient s permanentním močovým katétrem (PMK): Sběrný sáček musí viset VŽDY pod úrovní močového měchýře (zabránění zpětného toku a infekce) a NIKDY nesmí ležet na podlaze! Hadička nesmí být zalomená. Jakmile moč neodtéká nebo je v ní krev/zákal, ihned hlásit sestře.',
          'Zácpa (obstipace): Hlásit sestře, pokud klient neměl stolici déle než 3 dny.',
        ],
      },
      {
        id: 'pece-kompetence',
        title: '3.4 Zlaté pravidlo: Co smí PSS a co výhradně zdravotní sestra',
        summary:
          'Sociálně-zdravotní pomezí v domově pro seniory má přesné zákonné hranice (zákon č. 108/2006 Sb. vs. vyhláška č. 55/2011 Sb.).',
        keyPoints: [
          'Kompetence PSS (přímá obslužná péče): Hygiena, koupel, převlékání, polohování, úprava lůžka, podávání jídla a tekutin, výměna plenkových kalhotek, doprovod na WC, sledování změn u klienta a hlášení sestře.',
          'Výhradní kompetence zdravotní sestry: Příprava a podávání léků, aplikace inzulinu a injekcí, měření glykémie glukometrem, cévkování, odborné převazy ran a dekubitů, hodnocení skóre rizika (Nortonová), odsávání dýchacích cest.',
          'Role očí a uší týmu: Protože pečovatel tráví s klientem nejvíce času, všimne si jako první zarudnutí na kříži, otoku kotníku, nechutenství nebo změny nálady – jeho hlavní povinností je včas informovat sestru.',
        ],
      },
    ],
    examTips: [
      'Pamatujte si „sáček od cévky pod úrovní měchýře a ne na zemi“ – zkoušející tuto větu milují.',
      'U hygieny vždy začněte zajištěním soukromí, tepla a podporou toho, co si klient umí umýt sám.',
      'U diabetika zdůrazněte zákaz stříhání nehtů na nohou nůžkami pracovníkem v přímé péči.',
    ],
    examTraps: [
      {
        trap: '„Při mytí očí na lůžku postupujeme od vnitřního koutku směrem k zevnímu.“',
        truth: 'POZOR! V učebnicích ošetřovatelství platí: čisté oči myjeme od ZEVNÍHO koutku k VNITŘNÍMU (aby se nečistota nedostala do slzného kanálku; u infekce a hnisavého výtoku naopak zevně, aby se nezanesla do druhého oka – vždy samostatnou částí žínky/tamponu).',
      },
      {
        trap: '„Když senior málo pije, můžeme mu v noci dát půl litru čaje najednou.“',
        truth: 'NE! Seniorovi dáváme pít po malých doušcích celý den; večer větší množství způsobí noční buzení a riziko pádu cestou na WC.',
      },
    ],
  },
  {
    id: 'mobilita-dekubity',
    order: 4,
    title: 'Mobilita, dekubity (proleženiny), polohování a prevence pádů',
    shortTitle: 'Mobilita & Dekubity',
    subtitle: '4 stupně dekubitů, predilekční místa, škála Nortonové, kinestetika a vozík',
    estimatedMinutes: 20,
    accentColor: 'amber',
    badgeText: 'Okruh 4 · Prevence komplikací',
    overview:
      'Proleženiny (dekubity) a pády jsou dvě nejčastější a nejnebezpečnější komplikace v domovech pro seniory. Musíte umět rozpoznat už první stupeň dekubitu, znát ohrožená místa, intervaly polohování, základy škály Nortonové a bezpečnou manipulaci s klientem bez zničení vlastních zad.',
    sections: [
      {
        id: 'mob-dekubity-vznik',
        title: '4.1 Jak vznikají dekubity a 4 stupně poškození kůže',
        summary:
          'Dekubit vzniká stlačením cév mezi kostí a podložkou (ischemie). Stačí 2 hodiny trvalého tlaku a tkáň odumírá.',
        keyPoints: [
          'Hlavní faktory vzniku: Tlak (váha těla), Tření a Střižná síla (když klient klouže dolů na polohovací posteli), Vlhkost (pot, moč, stolice), Malnutrice a věk.',
          'I. stupeň: Neblednoucí zarudnutí neporušené kůže (po stisku prstem nezůstane bílá stopa!). Řešení: IHNED odlehčit, NIKDY nemasírovat, hlásit sestře!',
          'II. stupeň: Puchýř nebo mělká odřenina/vřed (nepropichovat puchýř!).',
          'III. stupeň: Hluboký vřed zasahující podkoží (možná nekróza/povlak).',
          'IV. stupeň: Rozsáhlá destrukce až na sval, šlachu nebo kost (vysoké riziko sepse).',
        ],
      },
      {
        id: 'mob-predilekce-polohovani',
        title: '4.2 Predilekční místa a zásady správného polohování',
        summary:
          'Riziková místa závisí na poloze klienta. Správným polohováním a podložením se většině proleženin dá zcela zabránit.',
        keyPoints: [
          'Vleže na zádech: Týl hlavy, lopatky, lokty, křížová kost a kostrč (nejčastěji!), paty (druhé nejčastější!).',
          'Vleže na boku: Ušní boltec, rameno, velký chocholík kyčle, vnitřní/zevní strany kolen, kotníky.',
          'Vsedě na vozíku: Lopatky, sedací hrboly (ischia), kostrč, podkolení, paty na stupačkách.',
          'Interval polohování: Standardně každé 2 hodiny ve dne a každé 3 hodiny v noci (zapisuje se do polohovacího záznamu!).',
          'Šikmá 30° boční poloha: Místo tvrdé 90° polohy na kyčli natočíme klienta jen o 30° a podepřeme záda klínem – tlak se přenese do měkké svaloviny hýždí.',
          'Pravidlo pro paty: Podložit lýtka měkkým polštářem/válcem tak, aby paty volně visely ve vzduchu.',
        ],
      },
      {
        id: 'mob-norton-imobilita',
        title: '4.3 Škála Nortonové a imobilizační syndrom',
        summary:
          'Škála Nortonové hodnotí riziko dekubitů – čím NIŽŠÍ je součet bodů, tím VYŠŠÍ je riziko!',
        keyPoints: [
          '5 položek škály Nortonové (každá 1–4 body, celkem 5–20 bodů): 1. Fyzický stav, 2. Stav vědomí, 3. Aktivita, 4. Pohyblivost, 5. Inkontinence.',
          'Výsledek škály: 15–20 bodů = nízké riziko | 13–14 bodů = zvýšené riziko | 12 bodů a méně = VYSOKÉ riziko vzniku dekubitů.',
          'Imobilizační syndrom (následky dlouhého ležení): Svalová atrofie a kontraktury kloubů, dekubity, zápal plic (mělký dech a městnání hlenů), žilní trombóza, zácpa, infekce močových cest a apatie/deprese.',
        ],
      },
      {
        id: 'mob-kinestetika-pady',
        title: '4.4 Kinestetika, bezpečná manipulace a prevence pádů',
        summary:
          'Správná ergonomie chrání jak důstojnost a klouby seniora, tak páteř pečovatele.',
        keyPoints: [
          'Zlaté pravidlo pro pečovatele: Široký stoj, rovná záda, zpevněný střed těla, zvedat silou nohou (pokrčená kolena), přenášet váhu a být co nejblíže klientovi. U těžších klientů vždy pracovat ve dvou nebo použít zvedák/skluznou podložku!',
          'Bezpečnost s invalidním vozíkem: PŘED KAŽDÝM přesunem (na postel, na WC, z vozíku) VŽDY ZABRZDETE OBA KOLA vozíku a sklopte/odklopte stupačky!',
          'Prevence pádů v DS: Pevná uzavřená obuv s protiskluzovou podrážkou (nikoliv nazouvací pantofle!), suchá podlaha bez koberců a kabelů, dostatek světla (i noční světélko na WC), pomalé vstávání z lůžka (prevence ortostatické hypotenze) a dosahové zvonky.',
        ],
      },
    ],
    examTips: [
      'Nezapomeňte obrácenou logiku škály Nortonové: málo bodů (≤ 12) = velký průšvih (vysoké riziko)!',
      'Při otázce na manipulaci s klientem vždy jako první větu řekněte: „Zajistím komunikaci s klientem, zabrzdím lůžko i vozík a přizvu kolegu nebo použiji pomůcku.“',
    ],
    examTraps: [
      {
        trap: '„Když uvidím na kříži zarudlé místo I. stupně, pořádně ho namasíruji francovkou, aby se prokrvilo.“',
        truth: 'ZÁSADNÍ CHYBA! Masáž poškozené tkáně prohloubí mikrotraumata a zrychlí vznik hlubokého dekubitu. Místo jen odlehčíme, omyjeme a nahlásíme sestře.',
      },
      {
        trap: '„Pod kolena ležícímu klientovi dáme polštář a tím ochráníme paty.“',
        truth: 'POZOR! Polštář jen pod kolenem může stlačovat podkolenní cévy a podporovat trombózu. Podkládáme celou délku lýtek tak, aby paty zůstaly ve vzduchu.',
      },
    ],
  },
  {
    id: 'komunikace-demence',
    order: 5,
    title: 'Komunikace, psychologie stáří, demence, validace a bazální stimulace',
    shortTitle: 'Komunikace & Demence',
    subtitle: 'Demence vs. Delirium vs. Deprese, validace Naomi Feil, bazální stimulace a smyslové poruchy',
    estimatedMinutes: 22,
    accentColor: 'violet',
    badgeText: 'Okruh 5 · Psychologie & Přístup',
    overview:
      'Práce s pamětí, dezorientací a změnami nálad tvoří polovinu úspěchu v domově pro seniory. U zkoušky musíte suverénně rozlišit demenci od akutního deliria, vysvětlit validaci a ukázat, jak mluvit s nedoslýchavým či nevidomým klientem.',
    sections: [
      {
        id: 'kom-3d',
        title: '5.1 Klíčové rozlišení „3D“: Demence vs. Delirium vs. Deprese',
        summary:
          'Zmatenost seniora nemusí vždy znamenat demenci. Záměna s deliriem může klienta ohrozit na životě!',
        keyPoints: [
          'Demence (např. Alzheimerova nemoc): Začíná pomalu a plíživě (měsíce až roky), postupně se zhoršuje. Vědomí a bdělost jsou zachovány, vázne krátkodobá paměť, orientace a řeč.',
          'Delirium (akutní zmatenost): Vzniká NÁHLE (hodiny až dny), stav během dne kolísá (často horší v noci), bývá porucha pozornosti, halucinace či neklid. Příčina je TĚLESNÁ (dehydratace, infekce močových cest, horečka, bolest, léky) a při včasné léčbě je VRATNÉ!',
          'Deprese (pseudodemence): Často po ztrátě blízkého nebo nástupu do DS. Smutek, ztráta radosti, poruchy spánku, klient na otázky odpovídá „Nevím, to nemá cenu“ (na rozdíl od demence, kdy si vymýšlí – konfabuluje).',
        ],
        table: {
          headers: ['Znak', 'Demence', 'Delirium', 'Deprese'],
          rows: [
            ['Nástup', 'Pomalý, plíživý (měsíce/roky)', 'Náhlý (hodiny až dny)', 'Týdny až měsíce'],
            ['Průběh', 'Postupně zhoršující, stabilní v rámci dne', 'Kolísavý (horší večer a v noci)', 'Ranní pesima, smutek'],
            ['Léčitelnost', 'Chronická (zmírnění průběhu)', 'VRATNÁ po odstranění příčiny!', 'Dobře léčitelná terapií a léky'],
          ],
        },
      },
      {
        id: 'kom-validace-rem',
        title: '5.2 Validace (Naomi Feil), Reminiscence a Biografický přístup',
        summary:
          'Když se dezorientovaný senior chce vrátit domů za maminkou nebo do práce, logické hádání vede jen ke strachu a agresi.',
        keyPoints: [
          'Validace (potvrzení pocitů): Nevyvracíme klientovi jeho subjektivní realitu („Vaše maminka už dávno umřela“), ale uznáme emoci za ní („Stýská se vám po mamince, byla jste na ni zvyklá, povězte mi, jaká byla“). Používáme otevřené otázky (Kdo, Co, Kdy, Kde – NIKDY ne „Proč“!), udržujeme vřelý oční kontakt a klidný hlas.',
          'Sundowning (syndrom západu slunce): Navečer s únavou a šerem narůstá úzkost a bloudění. Pomáhá rozsvítit teplé světlo, nabídnout teplý čaj a klidnou známou činnost.',
          'Reminiscence: Práce se vzpomínkami pomocí fotografií, starých kuchyňských předmětů, písní mládí – posiluje identitu a sebeúctu.',
          'Biografický přístup: Znalost životního příběhu klienta (povolání, koníčky, návyky) umožňuje porozumět jeho chování.',
        ],
      },
      {
        id: 'kom-bazalni',
        title: '5.3 Bazální stimulace (prof. Andreas Fröhlich)',
        summary:
          'Pomáhá těžce nemocným a ležícím klientům vnímat vlastní tělo a okolní svět skrze jednoduché známé smyslové podněty.',
        keyPoints: [
          'Iniciální dotek: Vždy na začátku i na konci kontaktu klidný, jednoznačný dotek na předem dohodnuté místo (např. rameno nebo předloktí) současně s oslovením.',
          'Somatická stimulace – koupele: Uklidňující koupel (tahy žínkou PO směru růstu chloupků – od hlavy k nohám, pro neklidné a úzkostné klienty před spaním) vs. Povzbuzující koupel (tahy PROTI směru růstu chloupků, ráno pro apatické klienty).',
          'Poloha hnízdo: Obklopení klienta stočenými přikrývkami nebo polštáři dává ležícímu člověku pocit bezpečí a jasných hranic vlastního těla.',
        ],
      },
      {
        id: 'kom-smysly',
        title: '5.4 Komunikace se seniory se zrakovým, sluchovým a řečovým postižením',
        summary:
          'Respektující komunikace odstraňuje izolaci a předchází zbytečnému označení klienta za „zmateného“.',
        keyPoints: [
          'Porucha sluchu: Mluvit zřetelně zpříma (ne ze strany ani zezadu!), nekřičet (křik zkresluje tóny a působí agresivně), snížit hluk rádia/TV, kontrolovat čistotu a baterii sluchadla.',
          'Porucha zraku: Hned po vstupu se představit a říct, co budete dělat; při jídle popsat rozložení na talíři podle hodinového ciferníku (na 12 brambory, na 6 maso, na 3 omáčka); nepokládat předměty jinam, než je klient zvyklý.',
          'Afázie (po mrtvici): Neznamená pokles inteligence! Mluvit v krátkých větách, klást otázky na ANO/NE, dát čas na odpověď a nedoplňovat za klienta každé slovo bez dovolení.',
        ],
      },
    ],
    examTips: [
      'Při příkladu paní, která balí kufr a „musí domů uvařit dětem“, použijte validaci: potvrďte její lásku k rodině a péči, nezapírejte její věk a jemně odveďte pozornost.',
      'U nevidomého seniora u zkoušky vždy zazářite „pravidlem hodinového ciferníku“ na talíři a představením se ihned u dveří.',
    ],
    examTraps: [
      {
        trap: '„Když babička s Alzheimerem hledá maminku, je potřeba jí každý den jasně říct pravdu, že maminka před 40 lety zemřela, aby se zorientovala.“',
        truth: 'CHYBA! To by jí způsobovalo každý den nový šok a zármutek jako poprvé. Používáme validaci a podporujeme pocit bezpečí.',
      },
      {
        trap: '„Náhlá noční zmatenost u dosud bystré klientky znamená, že přes noc dostala Alzheimerovu demenci.“',
        truth: 'NE! Náhlý vznik zmatenosti ukazuje na DELIRIUM (často infekce močových cest nebo dehydratace) – je nutné ihned přivolat sestru/lékaře!',
      },
    ],
  },
  {
    id: 'aktivizace-paliativa',
    order: 6,
    title: 'Prevence závislosti, aktivizace a paliativní péče (doprovázení)',
    shortTitle: 'Aktivizace & Paliativa',
    subtitle: 'Podpora soběstačnosti, druhy aktivizace, 5 fází Kübler-Rossové a důstojný závěr života',
    estimatedMinutes: 18,
    accentColor: 'rose',
    badgeText: 'Okruh 6 · Smysl & Doprovázení',
    overview:
      'Sociální péče v domově pro seniory nemá být jen „údržba těla“. Spojuje podporu zbývající soběstačnosti, radost z aktivního dne a v závěru života lidsky citlivou paliativní a hospicovou péči bez osamění.',
    sections: [
      {
        id: 'akt-prevence-zavislosti',
        title: '6.1 Prevence vzniku závislosti na sociální službě',
        summary:
          'Zlaté pravidlo sociální práce zní: „Nepřebírejte za klienta to, co s vaší trpělivou podporou ještě zvládne sám.“',
        keyPoints: [
          'Riziko „naučené bezmocnosti“: Když spěchající pečovatel seniora vždy sám nakrmí, obuje a umyje, senior za pár týdnů ztratí dovednost i chuť cokoliv zkoušet.',
          'Zásada přiměřené pomoci (princip podpory): Dát klientovi čas, připravit pomůcky (např. podavač ponožek, silnější rukojeť lžíce), pochválit i drobný pokrok a pomoci jen s tou částí úkonu, která už nejde (např. zapnout poslední knoflík na zádech).',
        ],
      },
      {
        id: 'akt-metody',
        title: '6.2 Aktivizační a volnočasové techniky v domově pro seniory',
        summary:
          'Aktivizace vychází z individuálního plánu a zájmů klienta – nesmí být povinná ani infantilní (nedávat dospělým seniorům dětské omalovánky bez kontextu).',
        keyPoints: [
          'Kognitivní a paměťový trénink: Kvízy, přísloví, doplňování slov, čtení zpráv a povídání nad kronikou.',
          'Pohybové a ergoterapeutické aktivity: Skupinové cvičení na židlích, vaření a pečení v kuchyňce, práce s hlínou či látkou (jemná motorika).',
          'Arteterapie, muzikoterapie a animoterapie (canisterapie / felinoterapie): Zpěv známých lidových písní často „probudí“ i jinak uzavřené klienty s těžkou demencí; kontakt se psem snižuje úzkost a krevní tlak.',
          'Individuální aktivizace u lůžka: Pro ležící klienty – předčítání, poslech audioknih, doteková stimulace, rozhovor nad rodinným albem.',
        ],
      },
      {
        id: 'akt-paliativa',
        title: '6.3 Paliativní a hospicová péče v domově pro seniory',
        summary:
          'Paliativní péče neslibuje vyléčení, ale slibuje, že člověk nebude trpět nesnesitelnou bolestí, dušností a nezůstane v těžké chvíli sám.',
        keyPoints: [
          'Cíl paliativní péče: Maximální kvalita života v jeho závěru, úleva od bolesti, dušnosti a strachu, podpora rodiny i v době truchlení.',
          '5 fází vyrovnávání dle Elisabeth Kübler-Rossové: 1. Popření (šok – „To nemůže být pravda“), 2. Hněv („Proč zrovna já?!“ – nikdy nebrat osobně!), 3. Smlouvání („Kdybych ještě zažil Vánoce...“), 4. Deprese (hluboký smutek), 5. Smíření (klidné přijetí).',
          'Praktická péče o umírajícího: Měkké přítmí a klid, nevysilovat zbytečnými výkony, časté zvlhčování rtů a dutiny ústní (boraxglycerinem nebo heřmánkem/vodou), držení za ruku (sluch zůstává nejdéle!), umožnit přítomnost rodiny či duchovního a respektovat dříve vyslovená přání.',
          'Péče o tělo zemřelého: Po konstatování smrti lékařem s úctou upravit tělo (vyrovnat končetiny, zavřít oči, zajistit čelist), zachovat pietu pro rozloučení rodiny a spolubydlících.',
        ],
      },
    ],
    examTips: [
      'Umějte vyjmenovat všech 5 fází dle Kübler-Rossové přesně v pořadí: Popření – Hněv – Smlouvání – Deprese – Smíření.',
      'U aktivizace vždy zdůrazněte „dobrovolnost a respekt k dospělosti seniora“ (žádné nucení ani dětské hry, pokud si je klient sám nepřeje).',
    ],
    examTraps: [
      {
        trap: '„Umírající klient v bezvědomí už nic nevnímá, takže při práci v pokoji se můžeme normálně bavit o víkendu nebo soukromí.“',
        truth: 'NIKDY! Sluch je poslední smysl, který vyhasíná. V pokoji umírajícího mluvíme vždy klidně, s úctou a přímo na něj.',
      },
    ],
  },
  {
    id: 'narocne-situace',
    order: 7,
    title: 'Zvládání agrese, krizové situace, syndrom vyhoření a supervize',
    shortTitle: 'Náročné situace & Vyhoření',
    subtitle: 'Deeskalace konfliktu, šetrná sebeobrana, krizová intervence a prevence vyhoření',
    estimatedMinutes: 16,
    accentColor: 'indigo',
    badgeText: 'Okruh 7 · Bezpečí & Psychohygiena',
    overview:
      'Práce v přímé péči je emočně i fyzicky náročná. Tento okruh učí, jak bezpečně zvládnout agresivního nebo vyděšeného klienta bez použití násilí a jak pečovat o vlastní duševní zdraví, abyste v profesi nevyhořeli.',
    sections: [
      {
        id: 'nar-agrese-deeskalace',
        title: '7.1 Příčiny agrese seniorů a bezpečná deeskalace',
        summary:
          'Agrese v domově pro seniory téměř nikdy není „zlý úmysl“ – je to nouzový signál strachu, bolesti, studu nebo zmatenosti.',
        keyPoints: [
          'Hledejte skrytý spouštěč: Neřešená bolest, plný močový měchýř, strach při svlékání cizím člověkem, hluk, příliš rychlý pohyb pečovatele zezadu nebo frustrace z nepochopení.',
          'Pravidla verbální deeskalace: Zachovat klid a nízký tón hlasu, nekřičet a neargumentovat, nehodnotit („Vy jste zase zlý“), naslouchat, nabídnout prostor a volbu („Chcete raději sprchu až po obědě?“).',
          'Fyzická bezpečnost pečovatele: Držet si bezpečný odstup (na délku paže a půl), stát mírně bokem (ne čelně v útočném postoji), mít VŽDY volnou únikovou cestu ke dveřím (nikdy se nenechat zatlačit do rohu!), sundat visací šperky/dlouhé vlasy mít sepnuté.',
          'Šetrná sebeobrana: Nikdy neútočit ani netrestat – cílem je jen vyprostit se z úchopu (např. tahem směrem k palci útočníka), odstoupit do bezpečí a přivolat posilu týmu.',
        ],
      },
      {
        id: 'nar-krizova',
        title: '7.2 Krizová intervence a podpora klienta v akutní tísni',
        summary:
          'Krize nastává při náhlé ztrátě (úmrtí partnera, zhoršení zraku/mobility, přesun z domova do DS), kdy běžné mechanismy zvládání selhávají.',
        keyPoints: [
          'První psychologická pomoc: Být tu s klientem, zajistit fyzické bezpečí a klid, projevit lidský zájem, nebagatelizovat („Vždyť se nic neděje, na to si zvyknete“), ale přijmout slzy a smutek.',
          'Když klient mluví o sebevraždě nebo ztrátě smyslu života: Nikdy to nebrat na lehkou váhu! Vyslechnout bez souzení, nenechat klienta o samotě v rizikovém stavu a OKAMŽITĚ informovat vedoucího/sestru/lékaře.',
        ],
      },
      {
        id: 'nar-vyhoreni-supervize',
        title: '7.3 Syndrom vyhoření (burnout) a role supervize',
        summary:
          'Kdo neumí pečovat sám o sebe, dlouho nevydrží s láskou pečovat o druhé.',
        keyPoints: [
          'Projevy syndromu vyhoření: Chronická únava a nespavost, emoční otupělost a cynismus ke klientům („už je jen přebaluji jako balíky“), podrážděnost na kolegy, pocit marnosti a somatické potíže (bolesti zad, hlavy, časté nemoci).',
          'Prevence (psychohygiena): Jasné hranice mezi prací a domovem, rituál „odložení práce za dveřmi domova“, pohyb, koníčky, přiměřený humor v týmu, sdílení emocí.',
          'Supervize vs. Intervize: Supervize je vedená nezávislým externím odborníkem (bezpečný prostor pro reflexi těžkých případů a týmových vztahů); intervize je vzájemná podpora a porada kolegů na stejném pracovišti.',
        ],
      },
    ],
    examTips: [
      'U otázky na agresivního klienta vyjmenujte jako první: 1. Bezpečná vzdálenost a úniková cesta, 2. Klidný hlas a zjištění příčiny (bolest, strach, WC), 3. Přivolání kolegy.',
      'Jasně odlište supervizi (podpora a prevence vyhoření, externí odborník) od manažerské kontroly.',
    ],
    examTraps: [
      {
        trap: '„Když na mě klient s demencí zvedne ruku, musím mu přísně ukázat autoritu a zvýšit hlas, aby si nedovoloval.“',
        truth: 'NAOPAK! Křik a demonstrace síly jen zvyšují jeho strach a spouštějí další obranu či agresi. Vždy zpomalte, snižte hlas, udělejte krok zpět a dejte prostor.',
      },
    ],
  },
  {
    id: 'prvni-pomoc',
    order: 8,
    title: 'První pomoc, akutní stavy seniorů a hygienicko-epidemiologický režim',
    shortTitle: 'První pomoc & Epidemiologie',
    subtitle: 'KPR 30:2, dušení, CMP (FAST), zlomenina krčku, hypoglykémie a bariérový režim',
    estimatedMinutes: 22,
    accentColor: 'red',
    badgeText: 'Okruh 8 · Život zachraňující postupy',
    overview:
      'Každý pracovník v sociálních službách má zákonnou i morální povinnost poskytnout první pomoc. Zde jsou naprosto přesné postupy pro zástavu oběhu, mrtvici, dušení při jídle, pád se zlomeninou krčku, hypoglykémii i prevenci šíření infekcí.',
    sections: [
      {
        id: 'pp-kpr',
        title: '8.1 Zástava oběhu (KPR) a volání záchranné služby 155',
        summary:
          'U zástavy rozhodují vteřiny – stlačování hrudníku nahrazuje pumpu srdce, dokud nepřijede ZZS nebo není použit AED.',
        keyPoints: [
          'Postup krok za krokem: 1. Bezpečí pro zachránce → 2. Oslovení a zatřesení rameny (reakce?) → 3. Záklon hlavy a zvednutí brady, kontrola normálního dýchání max. 10 sekund → 4. Při bezvědomí bez normálního dýchání ihned volat 155 (hlasitý odposlech!) a poslat pro AED.',
          'Pozor na GASPING (lapavé dýchání): Pomalé, chrčivé nádechy „jak kapr na suchu“ NEJSOU normální dýchání – znamenají srdeční zástavu! Okamžitě zahajte KPR!',
          'Resuscitace dospělého (KPR): Střed hrudníku (dolní polovina hrudní kosti), hloubka 5–6 cm, frekvence 100–120 stlačení/min. Poměr 30 stlačení : 2 vdechům (pokud netroufáte či nemáte pomůcku pro umělé dýchání, provádějte nepřetržitě samotnou masáž srdce!).',
        ],
      },
      {
        id: 'pp-cmp-duseni',
        title: '8.2 Mrtvice (CMP – test FAST) a akutní dušení soustem',
        summary:
          'V domově pro seniory jsou cévní mozková příhoda a vdechnutí potravy nejčastější akutní stavy mimo pád.',
        keyPoints: [
          'Test FAST (podezření na CMP / mrtvici): F (Face) = pokleslý ústní koutek při úsměvu; A (Arm) = pokles jedné předpažené ruky; S (Speech) = nesrozumitelná, setřelá řeč nebo neschopnost mluvit; T (Time) = čas ihned volat 155 a zaznamenat přesný čas vzniku příznaků!',
          'Dušení (obstrukce dýchacích cest): 1. Pokud senior účinně kašle, jen ho povzbuzujeme ke kašli (nebít do zad při silném kašli!). 2. Pokud nemůže mluvit, kašlat ani se nadechnout: provedeme 5 rázných úderů hranou dlaně mezi lopatky v předklonu → pokud nepomůže, 5× Heimlichův manévr (stlačení nadbřišku dovnitř a nahoru) a střídáme 5:5. Upadne-li do bezvědomí, voláme 155 a zahajujeme KPR.',
        ],
      },
      {
        id: 'pp-pad-hypo-epi',
        title: '8.3 Pád seniora (zlomenina krčku), hypoglykémie, krvácení a epilepsie',
        summary:
          'Správná reakce po pádu nebo při poklesu cukru zabrání trvalému poškození nebo druhotnému šoku.',
        keyPoints: [
          'Pád a podezření na zlomeninu krčku stehenní kosti: Zlomená dolní končetina bývá typicky ZKRÁCENÁ a ZEVNĚ ROTOVANÁ (špička směřuje ven), silná bolest v třísle/kyčli. NIKDY klienta násilím nezvedejte ani nepokládejte na lůžko! Zajistěte tepelný komfort, podložte koleno/končetinu v nalezené poloze, uklidňujte a ihned volejte sestru a 155.',
          'Hypoglykémie (nízký cukr < 3,9 mmol/l): Rychlý nástup! Studený pot, třes, slabost, bledost, neklid či zmatenost. Při vědomí IHNED podat rychlý cukr (sladký nápoj, džus, hroznový cukr) a volat sestru. V bezvědomí NIC DO ÚST NEPODÁVAT (riziko udušení!), volat 155.',
          'Epileptický záchvat: Odstranit tvrdé předměty z okolí, podložit hlavu něčím měkkým, měřit délku záchvatu! NIKDY NEBRÁNIT křečím násilím a NIKDY NIC NEVKLÁDAT DO ÚST! Po odeznění uložit do zotavovací polohy na bok a hlídat dech.',
          'Masivní krvácení: Okamžitě zatlačit prsty/tlakovým obvazem přímo v ráně (v rukavicích!), zvednout končetinu nad úroveň srdce a volat 155.',
        ],
      },
      {
        id: 'pp-epidemiologie',
        title: '8.4 Hygienicko-epidemiologický režim a bariérová péče',
        summary:
          'V pobytovém zařízení s oslabenými seniory se infekce šíří velmi rychle, pokud se podcení hygiena rukou a prádla.',
        keyPoints: [
          'Hygiena rukou (5 momentů WHO): Před kontaktem s klientem, před čistým/aseptickým výkonem, po kontaktu s tělesnými tekutinami, po kontaktu s klientem a po kontaktu s okolím klienta. Správná dezinfekce rukou trvá alespoň 30 sekund (včetně palců, meziprstí a špiček prstů).',
          'OOPP (osobní ochranné pracovní prostředky): Jednorázové rukavice, ochranný plášť/zástěra, případně respirátor či štít při infekci. Rukavice nenahrazují dezinfekci rukou – po jejich sundání vždy dezinfikovat ruce!',
          'Bariérový režim (např. svrab, norovirový průjem, MRSA, COVID-19): Izolace klienta na pokoji, vyčleněné pomůcky, infekční prádlo do rozpustných/označených pytlů (netřepat s prádlem po chodbě!).',
        ],
      },
    ],
    examTips: [
      'Zásadní zkušební hláška u epilepsie: „Do úst nic nevkládám, křečím nebráním, chráním jen hlavu a měřím čas!“',
      'U zlomeniny krčku nezapomeňte popsat dva typické znaky: zkrácená noha + vytočená špička ven (zevní rotace) + zákaz zvedání.',
    ],
    examTraps: [
      {
        trap: '„Když senior leží na zemi, lapavě sípe jako kapr na suchu, ještě dýchá – nesmím mu stlačovat hrudník.“',
        truth: 'CHYBA! To je gasping (terminální lapavé dechy při zástavě srdce). Bereme ho jako ZÁSTAVU dýchání a okamžitě zahajujeme KPR 30:2!',
      },
      {
        trap: '„Když mám na sobě jednorázové rukavice, nemusím si po sundání dezinfikovat ruce.“',
        truth: 'NE! Rukavice mívají mikropóry a při svlékání se ruce mohou kontaminovat. Po sundání rukavic vždy následuje hygiena rukou.',
      },
    ],
  },
];
