import type { CaseScenario } from '../types/study';

export const CASE_SCENARIOS: CaseScenario[] = [
  {
    id: 'sc-validace-kufr',
    moduleId: 'komunikace-demence',
    title: 'Paní Marie si balí tašku a chce jít „za dětmi do školy“',
    clientProfile: 'Paní Marie (84 let), středně těžká Alzheimerova demence, v domově bydlí 4 měsíce.',
    situation:
      'Je 17:15 (začíná se stmívat). Paní Marie nervózně chodí po chodbě s igelitovou taškou plnou ručníků, klepe na skleněné dveře oddělení a pláče: „Pusťte mě hned domů, musím vyzvednout Kubíka ze školy a udělat mu večeři, dostane vynadáno!“',
    choices: [
      {
        id: 'a',
        text: 'Důrazně jí vysvětlím realitu: „Paní Marie, váš Jakub má už 55 let a bydlí v Brně. Vy bydlíte v domově pro seniory, nikam dnes nejdete.“',
        isBest: false,
        scoreDelta: 0,
        feedback:
          'Konfrontace s realitou u středně těžké demence působí nový šok, nedůvěru a prohlubuje úzkost nebo agresi. Klientka si zítra fakt stejně nezapamatuje, ale odnese si pocit, že jí chcete ublížit.',
      },
      {
        id: 'b',
        text: 'Přistoupím čelem v úrovni očí, klidným hlasem uznám její emoci (validace): „Vidím, že máte o Kubíka velkou starost a jste moc pečlivá maminka. Pojďte si na chvilku sednout sem k teplému čaji a řekněte mi, co jste mu ráda vařila.“',
        isBest: true,
        scoreDelta: 10,
        feedback:
          'Výborně! Použila jste validaci (Naomi Feil), uznala jste její emoci bez lhaní i bez drsné konfrontace, nabídla bezpečí a odvedla pozornost k příjemné vzpomínce v době večerního neklidu (sundowning).',
      },
      {
        id: 'c',
        text: 'Řeknu jí: „Dobře, zůstaňte tu u dveří, já vám zavolám taxíka, ale počkejte půl hodiny,“ abych měla klid na rozvoz večeří.',
        isBest: false,
        scoreDelta: 2,
        feedback:
          'Vědomé obelhávání klienta („zavolám taxíka“) snižuje důvěru, když slib nesplníte, a zanechává paní Marii v úzkosti stát za dveřmi.',
      },
      {
        id: 'd',
        text: 'Vezmu jí tašku z ruky, odvedu ji do pokoje a zamknu dveře, aby neutekla.',
        isBest: false,
        scoreDelta: 0,
        feedback:
          'Závažná chyba! Odebrání osobních věcí vyvolá paniku a zamčení pokoje je nezákonné omezení osobní svobody (§ 89 zákona č. 108/2006 Sb.).',
      },
    ],
    oralExamModelAnswer: [
      'Rozpoznám příznaky syndromu západu slunce (sundowning) u klientky s demencí.',
      'Nepoužívám hádku ani direktivní opravování reality, nelžu jí a v žádném případě ji nezamykám.',
      'Aplikuji validaci dle Naomi Feil: přijmu její pocit mateřské lásky a starosti, navážu klidný oční kontakt, nabídnu doprovod, světlo, teplý nápoj a rozhovor o minulosti (reminiscence).',
    ],
    keyTakeaway: 'U demence potvrzujte emoci, ne fakta. Nikdy klienta neponižujte ani nezamykejte.',
  },
  {
    id: 'sc-hygiena-odmitani',
    moduleId: 'prima-pece',
    title: 'Nový klient kategoricky odmítá večerní sprchu',
    clientProfile: 'Pan Josef (79 let), po lehčí CMP, v domově je teprve 5. den (adaptační období).',
    situation:
      'Přijdete na večerní směnu v 19:00 a chcete pana Josefa vzít do sprchy. On se rozčílí, odmítá svléknout košili a říká: „Nechte mě být, nebudu se před cizí ženskou svlékat, nejsem žádné malé děcko!“',
    choices: [
      {
        id: 'a',
        text: 'Zavolám druhou kolegyni a společně ho rychle svlékneme, protože v harmonogramu je napsaná koupel.',
        isBest: false,
        scoreDelta: 0,
        feedback:
          'Násilné prosazování hygieny proti vůli klienta hrubě porušuje jeho lidskou důstojnost (§ 2) a způsobuje trauma i odpor k personálu.',
      },
      {
        id: 'b',
        text: 'Respektuji jeho hranice a stud. Klidně se omluvím za spěch, ujistím ho, že nic nemusí proti své vůli, a zkusím zjistit, jak byl zvyklý (zda se sprchoval raději ráno, zda chce umýt jen u umyvadla s částečným zakrytím nebo mužského pečovatele).',
        isBest: true,
        scoreDelta: 10,
        feedback:
          'Skvěle! Respektujete stud, autonomii i zvyklosti klienta v adaptační fázi. Nabídnutím volby (ráno vs. večer, omytí jen intimních partií pod ručníkem, pečovatel muž) vracíte panu Josefovi pocit kontroly nad vlastním tělem.',
      },
      {
        id: 'c',
        text: 'Vyčtu mu: „Pane Josefe, když se neumyjete, budete zapáchat a dostanete opruzeniny, to si myslíte, že na vás zítra bude čas?“',
        isBest: false,
        scoreDelta: 0,
        feedback:
          'Moralizování, vyhrožování a vytváření pocitu viny ničí důvěru v době citlivé adaptace.',
      },
    ],
    oralExamModelAnswer: [
      'Pochopím stud a adaptační krizi nově příchozího klienta – cizí prostředí a ztráta intimity.',
      'Nikdy neprovádím hygienu násilím ani za pomoci přesily jen kvůli „rozpisu koupelí“.',
      'Nabídnu varianty: posunout sprchu na ráno dle zvyku z domova, nabídnout částečnou hygienu se zakrytím těla, případně muže-pečovatele, a výsledek zapíšu do dokumentace pro individuální plán.',
    ],
    keyTakeaway: 'Hygiena se přizpůsobuje zvykům a studu klienta, nikdy ne naopak.',
  },
  {
    id: 'sc-pad-krcek',
    moduleId: 'prvni-pomoc',
    title: 'Pád paní Věry na chodbě – podezření na zlomeninu krčku',
    clientProfile: 'Paní Věra (86 let), osteoporóza, chodí s francouzskou holí.',
    situation:
      'Slyšíte ránu na chodbě. Paní Věra leží na boku na zemi, sténá bolestí v levé kyčli. Když se podíváte na dolní končetiny, levá noha je viditelně kratší než pravá a špička nohy směřuje ven.',
    choices: [
      {
        id: 'a',
        text: 'Rychle ji s kolegyní zvedneme za podpaží na vozík a odvezeme ji do postele, aby jí nebyla zima na chodbě.',
        isBest: false,
        scoreDelta: 0,
        feedback:
          'Nebezpečná chyba! Zkrácená a zevně rotovaná končetina po pádu je učebnicovým příznakem zlomeniny krčku stehenní kosti. Násilné zvedání může způsobit posun úlomků a poškození cév či nervů.',
      },
      {
        id: 'b',
        text: 'Paní Věru nezvedám ani s ní nehýbu. Přikryji ji dekou, podložím měkce hlavu i poraněnou končetinu v nalezené poloze, uklidňuji ji, zůstanu s ní a okamžitě volám zdravotní sestru a ZZS 155.',
        isBest: true,
        scoreDelta: 10,
        feedback:
          'Naprosto správně! Rozpoznala jste příznaky zlomeniny krčku stehenní kosti (zkrácení + zevní rotace + bolest v kyčli), zabránila druhotnému poškození a zajistila teplo a rychlou pomoc.',
      },
      {
        id: 'c',
        text: 'Zkusím jí nohu opatrně srovnat do roviny a zvednout ji, jestli se na ni dokáže postavit.',
        isBest: false,
        scoreDelta: 0,
        feedback:
          'Zlomeninu nikdy nesmíte „rovnat“ ani zkoušet zatížení končetiny – hrozí těžký šok a vnitřní krvácení.',
      },
    ],
    oralExamModelAnswer: [
      'Popis příznaků: silná bolest v kyčli/třísle, neschopnost pohybu, typicky zkrácená a zevně rotovaná dolní končetina.',
      'Postup PSS: s klientem nemanipulovat a nezvedat ho! Zajistit tepelný komfort (deka pod i přes klienta), vypodložit v nalezené poloze, komunikovat a uklidňovat, ihned volat sestru a ZZS 155.',
      'Poznámka: nic nedávat pít ani jíst kvůli možné operaci v celkové anestezii.',
    ],
    keyTakeaway: 'Zkrácená a vytočená noha po pádu = zlomenina krčku → NEZVEDAT, přikrýt, volat 155.',
  },
  {
    id: 'sc-dekubit-1st',
    moduleId: 'mobilita-dekubity',
    title: 'Zarudnutí na křížové kosti při ranní hygieně',
    clientProfile: 'Pan Karel (88 let), imobilní po těžké cévní mozkové příhodě, inkontinentní.',
    situation:
      'Při ranním přebalování na lůžku vidíte v křížové oblasti červenou skvrnu o velikosti dlaně. Kůže není prasklá ani nemá puchýř, ale když na ni jemně zatlačíte prstem, zarudnutí nezbělá.',
    choices: [
      {
        id: 'a',
        text: 'Místo důkladně namasíruji chladivou francovkou a potřu vrstvou sádla, aby se pokožka dobře prokrvila.',
        isBest: false,
        scoreDelta: 0,
        feedback:
          'Zásadní chyba! Neblednoucí zarudnutí je dekubit I. stupně. Masírování nebo tření poškozuje již ischemickou tkáň pod povrchem a urychluje vznik hluboké rány.',
      },
      {
        id: 'b',
        text: 'Zajistím čistou a suchou kůži bez tření, pana Karla ihned přepolohuji na bok (30° poloha) tak, aby na kříž nebyl žádný tlak, a okamžitě nález nahlásím zdravotní sestře.',
        isBest: true,
        scoreDelta: 10,
        feedback:
          'Přesně tak! Neblednoucí zarudnutí je dekubit I. stupně. Klíčové je okamžité odlehčení tlaku, zákaz masáže a včasné nahlášení zdravotní sestře k dalšímu ošetřovatelskému plánu.',
      },
      {
        id: 'c',
        text: 'Nechám ho ležet na zádech, protože ráno má jít na snídani v polosedu, a nahlásím to sestře až na konci směny.',
        isBest: false,
        scoreDelta: 0,
        feedback:
          'Polosed na zádech zvyšuje tlak i střižnou sílu na křížovou kost a odklad hlášení vede k rozvoji II.–III. stupně během hodin.',
      },
    ],
    oralExamModelAnswer: [
      'Identifikace stavu: neblednoucí zarudnutí neporušené kůže nad kostním výběžkem = dekubit I. stupně.',
      'Okamžitá akce PSS: odlehčit tlak (přepolohovat do 30° boční polohy), zkontrolovat suché a vyhlazené lůžko, v žádném případě kůži nemasírovat ani nedrhnout!',
      'Kompetence: okamžitě hlásit zdravotní sestře, která zhodnotí stav a případně aplikuje ochranné krytí či aktualizuje škálu Nortonové.',
    ],
    keyTakeaway: 'Neblednoucí zarudnutí = I. stupeň dekubitu → odlehčit, nemasírovat, hned hlásit sestře.',
  },
  {
    id: 'sc-hypoglykemie',
    moduleId: 'prvni-pomoc',
    title: 'Diabetik pan Novák je najednou zpocený, třese se a mluví z cesty',
    clientProfile: 'Pan Novák (74 let), léčí se s diabetem na inzulinu, ráno jedl velmi málo.',
    situation:
      'V 10:15 přijdete na pokoj a vidíte, že pan Novák sedí na židli, je bledý, na čele má studený pot, třesou se mu ruce a zmateně opakuje nesouvislá slova. Stále je při vědomí a komunikuje.',
    choices: [
      {
        id: 'a',
        text: 'Vytáhnu jeho inzulinové pero ze šuplíku a píchnu mu dávku, protože cukrovkáři potřebují inzulin.',
        isBest: false,
        scoreDelta: 0,
        feedback:
          'Život ohrožující chyba! Jedná se o příznaky HYPOGLYKÉMIE (málo cukru). Podání inzulinu by srazilo cukr ještě níž a zabilo ho – navíc PSS nesmí nikdy píchat inzulin!',
      },
      {
        id: 'b',
        text: 'Poznám podezření na hypoglykémii. Protože je při vědomí a polyká, okamžitě mu podám rychlý cukr (sladký čaj, džus, kostku cukru nebo hroznový cukr) a současně ihned zavolám zdravotní sestru.',
        isBest: true,
        scoreDelta: 10,
        feedback:
          'Skvělá reakce! Studený pot, třes, bledost a náhlá zmatenost po jídle/inzulinu jsou klasickými znaky hypoglykémie. Rychlý cukr při vědomí zachraňuje život a sestra okamžitě změří glykémii.',
      },
      {
        id: 'c',
        text: 'Uložím ho spát do postele a podám mu neslazenou minerálku, že si jen potřebuje odpočinout.',
        isBest: false,
        scoreDelta: 0,
        feedback:
          'Bez doplnění cukru se stav během minut zhorší v hypoglykemické bezvědomí a křeče.',
      },
    ],
    oralExamModelAnswer: [
      'Rozlišení: studený pot, třes, slabost a náhlá zmatenost u diabetika = akutní hypoglykémie (pokles cukru pod 3,9 mmol/l).',
      'První pomoc při vědomí: ihned podat rychlé cukry ústy (slazený nápoj, džus, glukózový bonbon), nenechávat klienta samotného a přivolat zdravotní sestru k přeměření glykémie.',
      'Kdyby byl v bezvědomí: nic do úst nelít, volat 155 a uložit na bok (zotavovací poloha).',
    ],
    keyTakeaway: 'Studený pot + třes u diabetika = hypoglykémie → při vědomí sladký nápoj a volat sestru.',
  },
  {
    id: 'sc-duseni-obed',
    moduleId: 'prvni-pomoc',
    title: 'Klientka se při obědě chytla za krk a nemůže se nadechnout',
    clientProfile: 'Paní Božena (81 let), jí maso na kousky v jídelně.',
    situation:
      'U oběda najednou paní Božena vstane od stolu, chytne se oběma rukama za hrdlo, tvář jí rudne až modrá, nevydává žádný zvuk, nemůže zakašlat ani mluvit.',
    choices: [
      {
        id: 'a',
        text: 'Rychle jí podám sklenici vody, aby sousto zapila a spláchla do žaludku.',
        isBest: false,
        scoreDelta: 0,
        feedback:
          'Nebezpečné! Voda při ucpaných dýchacích cestách nezaplaví jícen, ale zhorší dušení a vede k vdechnutí tekutiny.',
      },
      {
        id: 'b',
        text: 'Jde o těžké dušení (tichá obstrukce). Okamžitě ji předkloním, dám až 5 rázných úderů mezi lopatky; pokud sousto nevypadne, provedu až 5× Heimlichův manévr (stlačení nadbřišku) a střídám 5:5. Kolega mezitím volá sestru / 155.',
        isBest: true,
        scoreDelta: 10,
        feedback:
          'Perfektní! Tiché dušení bez kašle znamená úplnou obstrukci dýchacích cest – vyžaduje okamžité střídání 5 úderů mezi lopatky a 5 břišních stlačení.',
      },
      {
        id: 'c',
        text: 'Posadím ji a jemně ji hladím po zádech, ať si zkusí v klidu odkašlat.',
        isBest: false,
        scoreDelta: 0,
        feedback:
          'Pokud nemůže mluvit ani kašlat, neúčinný kašel těleso nevypudí – do 2–3 minut upadne do bezvědomí z nedostatku kyslíku.',
      },
    ],
    oralExamModelAnswer: [
      'Posouzení závažnosti: dokud klient účinně kašle, pouze ho ke kašli povzbuzujeme. Zde však nemůže mluvit, kašlat ani dýchat (těžká obstrukce).',
      'Zásah: předklonit a 5× rázně udeřit hranou dlaně mezi lopatky → při neúspěchu 5× Heimlichův manévr (pěst nad pupek pod hrudní kost, tlak dovnitř a nahoru) → střídat 5:5.',
      'Při ztrátě vědomí: opatrně položit na zem, volat 155 a zahájit KPR (30:2). Po úspěšném Heimlichu zajistit lékařskou kontrolu.',
    ],
    keyTakeaway: 'Nemůže kašlat ani mluvit = 5 úderů mezi lopatky + 5× Heimlichův manévr.',
  },
  {
    id: 'sc-dar-penize',
    moduleId: 'standardy-prava',
    title: 'Dcera klientky vám dává v obálce „přilepšení k výplatě“',
    clientProfile: 'Dcera paní Aleny (89 let), která je na oddělení velmi náročná.',
    situation:
      'Na konci návštěvy za vámi na chodbu vyjde dcera paní Aleny, rozhlédne se a strká vám do kapsy obálku se slovy: „Vezměte si ty dva tisíce na kávu, jste na maminku tak hodná, tak abych měla jistotu, že ji budete dávat k oknu přednostně.“',
    choices: [
      {
        id: 'a',
        text: 'Obálku přijmu a poděkuji, abych dceru neurazila, a peníze pak dám do společné kasy na oddělení na cukroví.',
        isBest: false,
        scoreDelta: 0,
        feedback:
          'Přijetí peněz od rodiny je hrubým porušením Etického kodexu a Standardu č. 2 (střet zájmů, zvýhodňování jednoho klienta na úkor ostatních).',
      },
      {
        id: 'b',
        text: 'Slušně, ale jasně a s úsměvem odmítnu: „Moc si vážím vaší spokojenosti s naší péčí, ale ze zákona a vnitřních pravidel nesmím přijímat žádné peníze ani cenné dary. O maminku pečujeme se stejnou péčí bez ohledu na dary.“ Situaci nahlásím vedoucí.',
        isBest: true,
        scoreDelta: 10,
        feedback:
          'Profesionální asertivní reakce! Chránila jste rovnost všech klientů, vyhnula se střetu zájmů a zachovala milý, ale pevný vztah s rodinou.',
      },
      {
        id: 'c',
        text: 'Odmítnu s výčitkou: „To si snad děláte legraci, chcete mě dostat do kárného řízení?!“',
        isBest: false,
        scoreDelta: 2,
        feedback:
          'Odmítnutí je sice správné věcně, ale útočný tón zbytečně zničí spolupráci s rodinou, která mohla dar myslet ze zvyku či vděčnosti.',
      },
    ],
    oralExamModelAnswer: [
      'Jde o střet zájmů a etické dilema (Standard č. 2 – Ochrana práv osob a Etický kodex PSS).',
      'Peněžní dary ani hodnotné dary pracovník nesmí přijímat, zvlášť jsou-li spojené s žádostí o přednostní zacházení.',
      'Reakce: zdvořilé a pevné odmítnutí s vysvětlením pravidel organizace, ujištění o kvalitní péči pro všechny stejně a zápis/informování nadřízeného.',
    ],
    keyTakeaway: 'Peníze a dary od klientů či rodiny zdvořile odmítáme – chráníme rovnost a vlastní integritu.',
  },
  {
    id: 'sc-omezeni-89',
    moduleId: 'standardy-prava',
    title: 'Kolegyně navrhuje na noční směně přivázat neklidnému pánovi ruce',
    clientProfile: 'Pan František (83 let), po operaci, v noci si opakovaně strhává plenkové kalhotky a křičí.',
    situation:
      'Kolegyně v 01:30 už je vyčerpaná a říká vám: „Pojď, uvážeme mu obě ruce obinadlem k postranicím a zvedneme obě bočnice, jinak se z něj do rána zblázníme a ještě vyleze z postele.“',
    choices: [
      {
        id: 'a',
        text: 'Pomohu jí, protože na noční směně jsme jen dvě a nemůžeme u něj sedět celou noc.',
        isBest: false,
        scoreDelta: 0,
        feedback:
          'Těžké porušení § 89 zákona č. 108/2006 Sb. i trestní odpovědnosti! Mechanické přivazování z pohodlnosti personálu je nelegální a může klienta uškrtit nebo mu způsobit těžká poranění.',
      },
      {
        id: 'b',
        text: 'Kategoricky odmítnu, vysvětlím kolegyni, že jde o zakázané omezení pohybu (§ 89). Společně zkontrolujeme příčinu neklidu (bolest, plný měchýř, žízeň, opruzenina), zklidníme pana Františka slovně, snížíme lůžko co nejníže a případně přivoláme zdravotní sestru.',
        isBest: true,
        scoreDelta: 10,
        feedback:
          'Výborně! Ochranila jste lidská práva i zdraví klienta, správně uplatnila § 89 a zaměřila se na hledání skutečné příčiny nočního neklidu ve spolupráci se sestrou.',
      },
      {
        id: 'c',
        text: 'Navrhnu dát mu z naší příruční lékárničky dva prášky na spaní bez vědomí lékaře, aby usnul.',
        isBest: false,
        scoreDelta: 0,
        feedback:
          'Podání tlumících léků bez ordinace lékaře je jednak nekompetentní zásah (PSS nesmí podávat léky) a jednak nelegální chemické omezení dle § 89.',
      },
    ],
    oralExamModelAnswer: [
      'Citace § 89 zákona č. 108/2006 Sb.: opatření omezující pohyb osob jsou ZAKÁZÁNA kromě přímého ohrožení života a zdraví.',
      'Vázání obinadlem pro klid personálu je nepřípustné. Hierarchie dle § 89 zná jen fyzický úchop, bezpečnou místnost a léky ordinované a podané za přítomnosti lékaře.',
      'Postup: zjistit tělesnou příčinu neklidu (bolest, retence moči, zácpa, delirium), slovně zklidnit, zajistit bezpečné snížené lůžko a konzultovat zdravotní sestru.',
    ],
    keyTakeaway: 'Pohodlí služby nikdy neospravedlní omezení pohybu (§ 89) – vždy hledejte příčinu neklidu.',
  },
  {
    id: 'sc-adaptace-smutek',
    moduleId: 'aktivizace-paliativa',
    title: 'Nová klientka celý týden pláče a odmítá chodit do jídelny',
    clientProfile: 'Paní Helena (78 let), po smrti manžela nastoupila do domova před 10 dny.',
    situation:
      'Paní Helena sedí na okraji postele, dívá se z okna a tiše pláče: „Já tady nikoho neznám, nechci mezi lidi. Celý život jsem měla vlastní kuchyň a teď mi všechno vzali.“',
    choices: [
      {
        id: 'a',
        text: 'Veselým hlasem ji povzbudím: „Ale paní Heleno, neplačte, vždyť tu máte krásný čistý pokoj a vařit nemusíte! Musíte hned dolů do jídelny, jinak si nikdy nezvyknete.“',
        isBest: false,
        scoreDelta: 1,
        feedback:
          'Bagatelizování smutku („neplačte, máte to tu hezké“) a nucení do společnosti v akutní adaptační krizi prohlubuje pocit osamělosti a nepochopení.',
      },
      {
        id: 'b',
        text: 'Sednu si na chvíli k ní, naslouchám a uznám její ztrátu: „Je to pro vás velká změna a po domově i manželovi se vám moc stýská.“ Nabídnu, že jídlo jí dnes můžeme donést na pokoj, a postupně se zeptám, co by jí v pokoji pomohlo cítit se lépe (fotky, oblíbený hrnek).',
        isBest: true,
        scoreDelta: 10,
        feedback:
          'Krásná empatická reakce a krizová intervence v adaptační fázi! Uznání práva na smutek, nenásilné tempo a postupné budování bezpečí přes vlastní známé věci z domova.',
      },
      {
        id: 'c',
        text: 'Nechám ji být a rychle odejdu, ať má soukromí a vybrečí se sama.',
        isBest: false,
        scoreDelta: 2,
        feedback:
          'Úplné stažení bez krátkého lidského kontaktu může v klientce vyvolat pocit, že je všem lhostejná.',
      },
    ],
    oralExamModelAnswer: [
      'Jde o normální reakci na ztrátu domova a partnera v tzv. adaptačním období.',
      'První pomoc: empatie bez bagatelizace, aktivní naslouchání, přijetí smutku a postupné seznamování s novým prostředím bez nátlaku.',
      'Zapojení klíčového pracovníka: úprava pokoje vlastními předměty, postupné pozvání např. jen k jedné sympatické spolubydlící a spolupráce s rodinou.',
    ],
    keyTakeaway: 'Nový klient má právo truchlit za ztrátu domova – nenuťte ho hned „být veselý“.',
  },
  {
    id: 'sc-knofliky-sobestacnost',
    moduleId: 'aktivizace-paliativa',
    title: 'Klientka si po mrtvici zapíná svetr velmi pomalu a čeká další pokoj',
    clientProfile: 'Paní Libuše (76 let), pravostranné oslabení po CMP, trénuje jemnou motoriku.',
    situation:
      'Ráno pomáháte paní Libuši s oblékáním. Trvá jí 5 minut, než levou rukou zapne tři knoflíky, je soustředěná a viditelně se snaží. Na chodbě už čekají další tři pokoje na snídani.',
    choices: [
      {
        id: 'a',
        text: 'Řeknu: „Paní Libuško, já vám to radši zapnu hned, za chvíli vezou čaj,“ a rychle ji obléknu sama.',
        isBest: false,
        scoreDelta: 0,
        feedback:
          'Tímto způsobem sice ušetříte 3 minuty, ale podporujete vznik závislosti na službě a „naučené bezmocnosti“. Klientka ztrácí motivaci i jemnou motoriku.',
      },
      {
        id: 'b',
        text: 'Podpořím její samostatnost – pochválím ji za trpělivost, případně pomůžu jen se zapnutím horního knoflíku u krku, kde nevidí, a do příště si na ni naplánuji o pár minut dřívější začátek nebo probereme s rodinou svetr na zip či suchý zip.',
        isBest: true,
        scoreDelta: 10,
        feedback:
          'Učebnicová prevence závislosti na službě (§ 2 zákona 108/2006)! Zapojíte klientku podle jejích možností, dopomůžete jen s nepřístupnou částí a organizačně upravíte čas či kompenzační oblečení.',
      },
      {
        id: 'c',
        text: 'Nechám ji v pyžamu bez snídaně, dokud si svetr nezapne celý sama.',
        isBest: false,
        scoreDelta: 0,
        feedback:
          'Rigidní přístup bez přiměřené pomoci by vedl ke frustraci a hladu.',
      },
    ],
    oralExamModelAnswer: [
      'Zásada prevence vzniku závislosti na sociální službě (§ 2 zákona č. 108/2006 Sb.): nedělat za klienta to, co zvládne sám.',
      'Přiměřená podpora: dát čas, ocenit snahu, podat jen částečnou pomoc (horní knoflík) a do individuálního plánu navrhnout ergonomické oblečení či úpravu časového harmonogramu.',
    ],
    keyTakeaway: 'Spěch personálu vytváří závislost klienta – pomáhejte jen tam, kde to klient opravdu nezvládne.',
  },
  {
    id: 'sc-ean-podezreni',
    moduleId: 'standardy-prava',
    title: 'Podezření na finanční zneužívání a modřiny po víkendové návštěvě syna',
    clientProfile: 'Pan Jaroslav (85 let), mírná demence, jinak bez sklonu k pádům.',
    situation:
      'Syn si pana Jaroslava bere každou první sobotu v měsíci (po výplatě důchodu) na pár hodin domů. Posledně se pan Jaroslav vrátil zamlklý, bez kapesného na kávu, s novou tmavou modřinou na vnitřní straně nadloktí (tvar otisku prstů) a šeptal: „Nikomu nic neříkejte, on by se zlobil.“',
    choices: [
      {
        id: 'a',
        text: 'Nezasahuji do rodinných záležitostí – co se děje mimo domov pro seniory u syna, to není moje věc.',
        isBest: false,
        scoreDelta: 0,
        feedback:
          'Závažné pochybení! Modřiny v neobvyklých místech (vnitřní strana paží), strach a mizející peníze po výplatě důchodu jsou jasné varovné znaky syndromu EAN (týrání a zneužívání seniorů).',
      },
      {
        id: 'b',
        text: 'Klientovi zajistím bezpečí a citlivě si ho vyslechnu bez nátlaku. Nález ihned zdokumentuji, nahlásím zdravotní sestře (ošetření a popis poranění) a vedoucímu sociální služby / sociální pracovnici k prošetření podle Standardu č. 2.',
        isBest: true,
        scoreDelta: 10,
        feedback:
          'Správně! Pracovník v sociálních službách má povinnost chránit klienta před týráním, zanedbáváním a zneužíváním (EAN). Zajištění lékařského/sesterského záznamu a předání vedení je nezbytný zákonný krok.',
      },
      {
        id: 'c',
        text: 'Při příští návštěvě si syna sama odchytím na chodbě a vyřvu si to s ním, aby ho to přešlo.',
        isBest: false,
        scoreDelta: 1,
        feedback:
          'Neprofesionální konfrontace bez důkazního záznamu a zapojení vedení může ohrozit samotného seniora (syn si ho může vzít domů natrvalo nebo mu vyhrožovat).',
      },
    ],
    oralExamModelAnswer: [
      'Identifikace rizika: syndrom EAN (Elder Abuse and Neglect) – podezření na kombinaci fyzického týrání (charakteristické otisky prstů na vnitřní straně paží), psychického zastrašování a finančního zneužívání.',
      'Povinnost PSS dle Standardu č. 2 (Ochrana práv osob): citlivá komunikace s klientem, nezamlčovat nález, okamžité hlášení sestře (dokumentace poranění) a vedení / sociálnímu pracovníkovi (krizový tým, OSPOD/opatrovnictví/policie dle závažnosti).',
    ],
    keyTakeaway: 'Modřiny na vnitřní straně paží + strach + chybějící peníze = podezření na EAN → vždy dokumentovat a hlásit vedení.',
  },
  {
    id: 'sc-umirajici-komfort',
    moduleId: 'aktivizace-paliativa',
    title: 'Péče o umírající klientku v posledních hodinách života',
    clientProfile: 'Paní Marta (92 let), v terminálním stadiu srdečního selhávání, nereaguje na oslovení, dýchá mělce s pauzami.',
    situation:
      'Jste v pokoji paní Marty během odpolední směny. Rty má úplně suché a popraskané, v rohu pokoje tiše sedí její uplakaná dcera a neví, zda na maminku může mluvit nebo ji držet za ruku.',
    choices: [
      {
        id: 'a',
        text: 'Požádám dceru, ať jde na chodbu, abych mohla maminku rychle převléct a udělat velkou koupel.',
        isBest: false,
        scoreDelta: 0,
        feedback:
          'V posledních hodinách života nevysilujeme umírajícího zbytečnou zátěží ani neoddělujeme rodinu! Blízkost milovaných je nenahraditelná.',
      },
      {
        id: 'b',
        text: 'Zachovám klidné, důstojné ticho a přítmí. Paní Martě jemně zvlhčím rty a ústa (např. štětičkou s vodou/boraxglycerinem), oslovím ji jménem a dceru laskavě ujistím, že sluch a dotek vnímá člověk nejdéle – může ji držet za ruku a tiše jí říkat, co cítí.',
        isBest: true,
        scoreDelta: 10,
        feedback:
          'Hluboce lidská a odborně perfektní paliativní péče! Udržování vlhkosti rtů je klíčovým komfortním úkonem a podpora rodiny u lůžka pomáhá oběma stranám.',
      },
      {
        id: 'c',
        text: 'Řeknu dceři: „Už vás neslyší, je v bezvědomí, běžte se raději domů vyspat.“',
        isBest: false,
        scoreDelta: 0,
        feedback:
          'Sluch zůstává zachován velmi dlouho i u hluboce utlumených pacientů. Oddělit rodinu na základě mylného tvrzení je odborně i eticky špatně.',
      },
    ],
    oralExamModelAnswer: [
      'Cíl paliativní péče: úleva od strádání (žádné invazivní nebo vysilující úkony navíc), zachování důstojnosti a přítomnosti blízkých.',
      'Péče o komfort: jemná péče o dutinu ústní a rty, šetrná poloha ulevující dýchání, klidné prostředí, vlídné oslovování (sluch je poslední smysl!).',
      'Práce s rodinou: nabídnout židli, čaj, soukromí a povzbudit rodinu k doteku a mluvení.',
    ],
    keyTakeaway: 'U umírajícího nevysilovat, zvlhčovat rty, mluvit klidně (sluch zůstává nejdéle) a podpořit přítomnost rodiny.',
  },
];
