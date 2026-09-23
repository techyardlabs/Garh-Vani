export interface DialectInfo {
  id: string;
  nameDevanagari: string;
  nameEnglish: string;
  region: string;
  keyFeatures: string;
  linguisticNotes: string;
  samplePhrase: string;
  sampleTranslation: string;
}

export interface Proverb {
  devanagari: string;
  transliteration: string;
  literal: string;
  context: string;
  category: string;
}

export interface LexiconItem {
  term: string;
  transliteration: string;
  category: 'Ecological' | 'Cultural' | 'Agrarian' | 'Social/Kinship' | 'Topographical';
  meaning: string;
  journalisticContext: string;
  exampleSentence: string;
}

export interface SampleInput {
  title: string;
  category: 'Editorial/News' | 'Ecological/Environment' | 'Village Dialogue' | 'Literary Essay' | 'Official Notice';
  sourceLang: 'Hindi' | 'English';
  text: string;
  headlineHint: string;
}

export const DIALECTS: DialectInfo[] = [
  {
    id: 'srinagariya',
    nameDevanagari: 'श्रीनगरिया (साहित्यिक मानक)',
    nameEnglish: 'Srinagariya (Literary Standard)',
    region: 'Alaknanda Valley, Srinagar Garhwal, Central Literary Belt',
    keyFeatures: 'The recognized print & academic benchmark (साहित्यिक मानक). Preserves classic auxiliary verbs (छ, छा, छी, छन), standard retroflex ळ, formal honorifics, and morphological symmetry.',
    linguisticNotes: 'Used in Sahitya Akademi publications, Chitthi-Patri, Hilans, and newspaper columns. Employs classic past tense markers (-या, -इ) and clean phonetics.',
    samplePhrase: 'ऊ आज अपणा गौं जाणो छ।',
    sampleTranslation: 'वह आज अपने गाँव जा रहा है। (He is going to his village today.)',
  },
  {
    id: 'tehriyali',
    nameDevanagari: 'टिहरियाळि (भागीरथी घाटी)',
    nameEnglish: 'Tehriyali (Bhagirathi Basin)',
    region: 'Tehri Garhwal, Bhagirathi & Bhilangana Valleys, Pratapnagar',
    keyFeatures: 'Vowel diphthong shift (ऊ गै vs ऊ ग्या), distinct auxiliary verbs, rapid conversational rhythm, localized postpositions (मखि, कथै).',
    linguisticNotes: 'Distinctive contraction of past participle (-गै, -रै, -भै) instead of Srinagariya (-ग्या, -रया). Strong preserve of traditional hill pastoral terms.',
    samplePhrase: 'ऊ आज अपणा डांडा गै।',
    sampleTranslation: 'वह आज अपनी पहाड़ी पर गया। (He went to his hill ridge today.)',
  },
  {
    id: 'salani',
    nameDevanagari: 'सलाणी (गंगा-सळान / पौड़ी)',
    nameEnglish: 'Salani (Ganga Salan & Pauri Belt)',
    region: 'Pauri, Lansdowne, Kotdwar, Ganga Salan Foothills',
    keyFeatures: 'Influence of sub-Himalayan phonetics, clear postposition marker \'मा\' and \'कन\', consistent -या past tense (ग्या, खायो), slightly broadened vowels.',
    linguisticNotes: 'Widely spoken across Southern Garhwal; heavy presence in regional broadcast journalism and diaspora literature.',
    samplePhrase: 'हम सबी आज कौथीग मा जाणा छां।',
    sampleTranslation: 'हम सभी आज मेले में जा रहे हैं। (All of us are going to the fair today.)',
  },
  {
    id: 'badhani_chamoli',
    nameDevanagari: 'बधाणी / चमोली (पिंडर-अलकनंदा)',
    nameEnglish: 'Badhani / Upper Chamoli',
    region: 'Pindar Valley, Tharali, Dewal, Karnaprayag, Joshimath border',
    keyFeatures: 'Archaic Indo-Aryan consonant clusters, conservative pronoun forms (कथ, कुथी, क्वी, जन), distinct nasalization and high-valley vocabulary.',
    linguisticNotes: 'Retains Sanskrit cognates and older Central Pahari case endings that have been simplified in lower river valleys.',
    samplePhrase: 'तिन कुथी बटी ये पाणी ल्यायी? कथ छ तिमारू घर?',
    sampleTranslation: 'तुमने कहाँ से यह पानी लाया? कहाँ है तुम्हारा घर? (Where did you bring this water from? Where is your home?)',
  },
  {
    id: 'nagpuriya',
    nameDevanagari: 'नागपुरिया (मंदाकिनी घाटी)',
    nameEnglish: 'Nagpuriya (Mandakini & Rudraprayag)',
    region: 'Rudraprayag, Ukhimath, Guptkashi, Mandakini Basin',
    keyFeatures: 'Tonal cadences, resonant pitch accent, unique interrogative particles (कथै, क्यैक, कैन्कै), expressive sound symbolism for terrain.',
    linguisticNotes: 'Geographically nestled between Kedarnath and Tungnath ridges; spoken with dynamic rising intonation in questions.',
    samplePhrase: 'तू कैन्कै ये डांडा चड़लो? आज ब्याळि घाम नी छ।',
    sampleTranslation: 'तू कैसे इस पहाड़ी पर चढ़ेगा? आज शाम धूप नहीं है। (How will you climb this ridge? There is no sun this evening.)',
  },
  {
    id: 'jaunpuri_ravalti',
    nameDevanagari: 'जौनपुरी / रवाल्टी (पश्चिमी सीमांत)',
    nameEnglish: 'Jaunpuri / Ravalti (Western Border)',
    region: 'Yamuna, Tons & Kamal River Valleys, Purola, Nainbagh, Rawai',
    keyFeatures: 'Transitional dialect between Garhwali and Jaunsari/Western Pahari. Verb participle suffixes (-ौंतो, -आवंतो), unique demonstratives (एऊ, वोऊ).',
    linguisticNotes: 'Crucial for comprehensive Central Pahari lexicography; bridges Garhwal and Himachal border cultures with rich pastoral idioms.',
    samplePhrase: 'एऊ मान्छू आपणे डांडे आवंतो छौ।',
    sampleTranslation: 'यह मनुष्य अपने पहाड़ की ओर आ रहा था। (This man was coming towards his ridge.)',
  },
  {
    id: 'kumaoni',
    nameDevanagari: 'कुमाऊँनी (Kumaoni - अल्मोड़ा / नैनीताल / पिथौरागढ़)',
    nameEnglish: 'Kumaoni (Central Pahari Sister Language)',
    region: 'Kumaon Division: Almora, Nainital, Bageshwar, Pithoragarh, Champawat, Ranikhet',
    keyFeatures: 'Major sister language of Uttarakhand. Characteristic auxiliary verbs (छु/छूं, छै, छ, छा/छौं, छन), absolutive participle in \'-बेर\' (खाइबेर, जाइबेर), distinctive pronouns (म्य/मैं, हमार, तमार, उनको), and unique vocabulary (इजा, बूबू, कौतिक, नौलो, भल).',
    linguisticNotes: 'Rich literary and folk heritage; celebrated by poets like Gumani Pant, Charu Chandra Pande, and Sher Singh Pangtey. Vibrant traditions of Jhora-Chanchari ballads and Chholiya martial dance.',
    samplePhrase: 'इजा ले आंगण मा घाम तापि बेर बोल्यो: बेटा, तू कतुका साल बाद अपण गौं आयो। नौलो को सीतल पाणी पि ले।',
    sampleTranslation: 'माँ ने आँगन में धूप सेकते हुए कहा: बेटा, तुम कितने सालों बाद अपने गाँव आए हो। नौले का शीतल पानी पी लो। (Mother said warming in the sun: Son, after how many years you have visited your village. Drink the cool spring water.)',
  },
  {
    id: 'jaunsari',
    nameDevanagari: 'जौनसारी (Jaunsari - चक्राता / कालसी / जौनसार-बावर)',
    nameEnglish: 'Jaunsari (Western-Central Pahari Transition Language)',
    region: 'Jaunsar-Bawar: Chakrata, Kalsi, Tyuni, Upper Tons Basin, Dehradun Tribal Belt',
    keyFeatures: 'Distinct indigenous Pahari language. Auxiliary verbs \'सो, सा, थी, थिया\', distinctive pronouns \'आमु (हम), तुमु (तुम), मोख (मुझे), तोख (तुझे)\', verbal participles in \'-दो, -तो, -आवंतो\', and rich tribal culture centered around Mahasu Devta and Bissu festival.',
    linguisticNotes: 'Spoken across the Jaunsar-Bawar region bordering Himachal Pradesh; famous for legendary Harul ballad songs, wooden architecture, and customary community councils (Khat-Sayana).',
    samplePhrase: 'आमु सबी बिस्सू मेळा मा जांदा सा अर महासू देवते री पूजा करदा सा।',
    sampleTranslation: 'हम सभी बिस्सू मेले में जा रहे हैं और महासू देवता की पूजा कर रहे हैं। (All of us are going to the Bissu festival and worshipping Lord Mahasu.)',
  },
];

export const LEXICON: LexiconItem[] = [
  {
    term: 'धारा (Dhara)',
    transliteration: 'Dhārā',
    category: 'Ecological',
    meaning: 'Natural perennial mountain spring emerging from rock fissures, vital life-source of Himalayan hamlets.',
    journalisticContext: 'Used in environmental reporting on water crises, drying mountain aquifers, and rejuvenation projects.',
    exampleSentence: 'गाँव का पुरातन धारा मा अब पाणि कम होण बैठिग्ये।',
  },
  {
    term: 'गधेरा (Gadhera)',
    transliteration: 'Gadherā',
    category: 'Ecological',
    meaning: 'Rapid mountain rivulet or torrent cutting through steep ravines, tributary to main river basins.',
    journalisticContext: 'Crucial in monsoon weather bulletins, flash flood reports, and micro-hydro catchment coverage.',
    exampleSentence: 'बर्खा का मैना मा गधेरा उफाण पर ऐ गैन।',
  },
  {
    term: 'बुग्याल (Bugyal)',
    transliteration: 'Bugyāl',
    category: 'Topographical',
    meaning: 'High-altitude Himalayan alpine pasture / meadow (above 3,300m), velvet grasslands during summer.',
    journalisticContext: 'Featured in pastoralism features, transhumance migration stories, eco-tourism, and biodiversity surveys.',
    exampleSentence: 'गर्म्युं मा भेड-बाखरा लेकै अनवाल बुग्यालुं मा चले जांदन।',
  },
  {
    term: 'डांडा-कांडा (Danda-Kanda)',
    transliteration: 'Ḍāṇḍā-Kāṇḍā',
    category: 'Topographical',
    meaning: 'High mountain ridges, crests, and adjoining rugged summits that form the Himalayan skyline.',
    journalisticContext: 'Used poetically and in disaster journalism to describe remote hilltop settlements and border reaches.',
    exampleSentence: 'डांडा-कांडा मा बर्फ की सेत चादर बिछीं गे।',
  },
  {
    term: 'मैती (Maiti)',
    transliteration: 'Maitī',
    category: 'Social/Kinship',
    meaning: 'A married woman\'s maternal home/village, also root of the historic Maiti environmental movement in Chamoli.',
    journalisticContext: 'Core cultural term in hill social reporting, folklore essays, women\'s leadership articles, and tree-planting movements.',
    exampleSentence: 'मैती की याद मा ब्वे का आंसु ढुलकी गैन।',
  },
  {
    term: 'नौला (Naula)',
    transliteration: 'Naulā',
    category: 'Ecological',
    meaning: 'Traditional subterranean stone-masonry aquifer chamber designed to store seep-spring groundwater without evaporation.',
    journalisticContext: 'Essential term in vernacular heritage conservation, groundwater journalism, and architecture features.',
    exampleSentence: 'पुरातन नौला की छंतोली आज भी देवदारु की छाया मा शीतल छ।',
  },
  {
    term: 'बांद (Baand)',
    transliteration: 'Bānd',
    category: 'Ecological',
    meaning: 'Himalayan Oak (Quercus leucotrichophora), the ecological pillar of Central Pahari moisture retention and fodder.',
    journalisticContext: 'Dominates forest fire reporting, soil-moisture scientific features, and traditional pastoral economy stories.',
    exampleSentence: 'बांद का जंगल पहाड़ का पाणि और माटी कु आधार छन।',
  },
  {
    term: 'कौथीग (Kauthig)',
    transliteration: 'Kauthīg',
    category: 'Cultural',
    meaning: 'Traditional community folk fair and cultural carnival held at temple grounds or river confluences.',
    journalisticContext: 'Standard print term in regional festival coverage, cultural tourism pages, and heritage photo-essays.',
    exampleSentence: 'बैसाखी का मैना मा देबप्रयाग मा भारी कौथीग लगद।',
  },
  {
    term: 'घंडियाल (Ghandiyal)',
    transliteration: 'Ghaṇḍiyāl',
    category: 'Cultural',
    meaning: 'Guardian deity of high ridges and village boundaries, associated with sacred bells and ritual surveillance.',
    journalisticContext: 'Invoked in Jagar anthropological reports, folk belief studies, and community dispute resolutions.',
    exampleSentence: 'डांडा पर घंडियाल देवता का थान मा दीवा बळी।',
  },
  {
    term: 'छंतोला (Chhantola)',
    transliteration: 'Chhantolā',
    category: 'Cultural',
    meaning: 'Ceremonial silver-ribbed or silk umbrella carried in royal and holy deity processions like Nanda Raj Jat.',
    journalisticContext: 'Standard term in religious procession journalism, heritage photo captions, and pilgrimage chronicles.',
    exampleSentence: 'नंदा का छंतोला जब उठद त पूरा पहाड़ जयकारा से गूंज उठद।',
  },
  {
    term: 'पलि-भौंत (Pali-Bhont)',
    transliteration: 'Pali-Bhōnt',
    category: 'Social/Kinship',
    meaning: 'The ancestral hearth, stone terrace fields, and rural homestead left behind by emigrants.',
    journalisticContext: 'Central keyword in Uttarakhand migration (पलायन / पलायन आयोग) reports and ghost-village socio-economic studies.',
    exampleSentence: 'पलि-भौंत मा अब खाली बुजुर्ग और बन्द ताला बचीं रैन।',
  },
  {
    term: 'रंवाई-जौनपुर शब्दावली (Rawai-Jaunpur Vani)',
    transliteration: 'Raṅwāī-Jaunpūr Śabdāvalī',
    category: 'Cultural',
    meaning: 'Distinct border vocabulary belonging to the Upper Yamuna valley characterized by pastoral honorifics.',
    journalisticContext: 'Used by editors when covering the Western borders of Tehri and Uttarkashi districts.',
    exampleSentence: 'रंवाई का लोकाचार मा अतिथि कु आदर देव-समान हुंद।',
  },
  {
    term: 'इजा (Ija - Kumaoni)',
    transliteration: 'Ijā',
    category: 'Social/Kinship',
    meaning: 'Kumaoni word for mother (माता), signifying deep maternal devotion and matriarchal reverence across Kumaon.',
    journalisticContext: 'Found throughout Kumaoni literature, migration essays, and folk memoirs.',
    exampleSentence: 'इजा ले आंगण मा घाम तापि बेर बोल्यो कि अपण गौं कभै जनि बिसरिये।',
  },
  {
    term: 'बूबू (Booboo - Kumaoni)',
    transliteration: 'Būbū',
    category: 'Social/Kinship',
    meaning: 'Paternal grandfather in Kumaoni, the traditional village elder and narrator of oral history.',
    journalisticContext: 'Frequently cited in hill heritage and socio-generational dialogue articles.',
    exampleSentence: 'बूबू जी पंचायती चबूतरा मा बैठी बेर पुरान किस्सा सुनाना छा।',
  },
  {
    term: 'कौतिक (Kautik - Kumaoni)',
    transliteration: 'Kautik',
    category: 'Cultural',
    meaning: 'Traditional Kumaoni regional fair, trade carnival, and folk assembly (e.g., Uttarayani at Bageshwar, Nanda Devi Mela at Almora).',
    journalisticContext: 'Primary term in regional tourism, trade chronicles, and festival reporting.',
    exampleSentence: 'बागेश्वर का उत्तरायणी कौतिक मा लाखन भक्त सरयू-गोमती संगम मा न्हाना।',
  },
  {
    term: 'झोड़ा-चांचरी (Jhora-Chanchari - Kumaoni)',
    transliteration: 'Jhoṛā-Chāñcharī',
    category: 'Cultural',
    meaning: 'Celebrated Kumaoni circular community song-dance expressing Himalayan folklore, seasonal changes, and romance.',
    journalisticContext: 'Standard arts and culture journalistic terminology across Kumaon.',
    exampleSentence: 'हुड़का की थाप पर गाँव की महिलाएं झोड़ा गाई बेर आनंद लेछीं।',
  },
  {
    term: 'हारुल (Harul - Jaunsari)',
    transliteration: 'Hārul',
    category: 'Cultural',
    meaning: 'Sacred heroic ballad and synchronized group step-dance of the Jaunsari community reciting historical legends of the Pandavas.',
    journalisticContext: 'Prominently featured in tribal heritage, indigenous performing arts, and Dehradun district cultural coverage.',
    exampleSentence: 'जौनसार बावर मा बिस्सू पर्व का टेम पूरा गाँव हारुल नृत्य करदो सा।',
  },
  {
    term: 'महासू देवता (Mahasu Devta - Jaunsari)',
    transliteration: 'Mahāsū Devtā',
    category: 'Cultural',
    meaning: 'Supreme deity and arbiter of divine justice in Jaunsar-Bawar and adjoining Western Pahari valleys (Botha, Basik, Pabasi, Chalda Mahasu).',
    journalisticContext: 'Invoked in tribal judiciary studies, sacred wooden temple architecture stories, and customary law reports.',
    exampleSentence: 'हनोल मा महासू देवता रो भव्य मंदर संपूर्ण जौनसार-बावर रो मुख्य तीर्थ सो।',
  },
  {
    term: 'बिस्सू (Bissu - Jaunsari)',
    transliteration: 'Bissū',
    category: 'Cultural',
    meaning: 'Grandest traditional spring festival of Jaunsar-Bawar celebrating the harvest with Thoda archery and festive feast gatherings.',
    journalisticContext: 'Core term in seasonal ethnographic reportage and cultural calendars.',
    exampleSentence: 'बिस्सू का पावन अवसर पर आमु सबी पारंपरिक वेशभूषा मा सजदा सा।',
  },
  {
    term: 'खत-सयाणा (Khat-Sayana - Jaunsari)',
    transliteration: 'Khat-Sayāṇā',
    category: 'Social/Kinship',
    meaning: 'Traditional hereditary community chieftain and head of a territorial group of villages (Khat) administering customary tribal law.',
    journalisticContext: 'Crucial in local governance analysis, tribal Panchayati Raj integrations, and customary justice articles.',
    exampleSentence: 'खत-सयाणा न गाँव का आपसी विवाद कणि चौपाल मा सुलझाई दियो।',
  },
];

export const PROVERBS: Proverb[] = [
  {
    devanagari: 'डांडा-कांडा का फूल, डांड्युं माई सुखान।',
    transliteration: 'Ḍāṇḍā-kāṇḍā kā phūla, ḍāṇḍyuṁ māī sukhāna.',
    literal: 'Wild flowers blooming on rugged cliffs wither away unseen on the same cliffs.',
    context: 'Unrecognized rural genius; deep potential of remote mountain youth remaining unnoticed without regional institutional support.',
    category: 'Editorial Commentary & Society',
  },
  {
    devanagari: 'बांदरो हाथ मा नरिवल। (Kumaoni)',
    transliteration: 'Bāndaro hātha mā narivala.',
    literal: 'A whole coconut placed in the hand of a monkey.',
    context: 'Precious resources or high responsibilities conferred upon an inexperienced or reckless authority (कुमाऊँनी लोकोक्ति).',
    category: 'Political & Governance Satire',
  },
  {
    devanagari: 'आपुई मरे स्वर्ग दिखिंदो। (Kumaoni)',
    transliteration: 'Āpuī mare svarga dikhindo.',
    literal: 'Only when one undergoes the hardship oneself is true insight and heaven witnessed.',
    context: 'Self-reliance, grassroots activism, and the truth that development cannot be imported solely from external capitals.',
    category: 'Self-Reliance & Philosophy',
  },
  {
    devanagari: 'मासू देवते रो बाटो सीधो सो, मन मा खोट कभै नि रखणी। (Jaunsari)',
    transliteration: 'Māsū Devate ro bāṭo seedho so, man mā khoṭ kabhai ni rakhṇī.',
    literal: 'The path of Lord Mahasu is straight and unbending; deceit should never enter one\'s heart.',
    context: 'Uncompromising integrity, tribal judicial honesty, and unwavering adherence to civic truth in public life.',
    category: 'Social Ethics & Truth',
  },
  {
    devanagari: 'आपुई करदो आपुई भरदो। (Jaunsari)',
    transliteration: 'Āpuī karado āpuī bharado.',
    literal: 'As a person acts, so shall that person reap and endure the consequence.',
    context: 'Universal karmic law, civic accountability, and individual duty within community life.',
    category: 'Moral Commentary',
  },
  {
    devanagari: 'आगि लगै पण पाणि कुथी?',
    transliteration: 'Āgi lagai paṇa pāṇi kuthī?',
    literal: 'The fire has broken out, but where is the water to douse it?',
    context: 'Administrative unpreparedness during forest fires or natural calamities; crisis management paralysis.',
    category: 'Governance & Calamity Journalism',
  },
  {
    devanagari: 'गधेरा का पाणि, धारा की बाटु।',
    transliteration: 'Gadherā kā pāṇi, dhārā kī bāṭu.',
    literal: 'Water follows the torrent bed, pilgrims follow the spring path.',
    context: 'Natural inevitability; truth and organic community solutions finding their own rightful course without artificial hindrance.',
    category: 'Literary & Philosophical',
  },
  {
    devanagari: 'मैका की भैंस, भैंसा का सींग।',
    transliteration: 'Maikā kī bhaiṁsa, bhaiṁsā kā sīṅga.',
    literal: 'One\'s maternal buffalo is praised even for dangerous horns.',
    context: 'Affectionate bias towards one\'s ancestral homeland or mother tongue; pride in mountain heritage despite hardship.',
    category: 'Cultural Identity',
  },
  {
    devanagari: 'आपन पेट त कुत्ता भी भरद, मान्छू ऊ छ जो औरों की सोचद।',
    transliteration: 'Āpana peṭa ta kuttā bhī bharada, mānchū ū cha jo auroṁ kī socada.',
    literal: 'Even a dog feeds its own belly; a true human is one who considers others.',
    context: 'Civic responsibility, editorial calls for communal solidarity, cooperative farming, and village water sharing.',
    category: 'Social Ethics',
  },
  {
    devanagari: 'धूप देखिकै छांछ नि मांगींदी।',
    transliteration: 'Dhūpa dekhikai chāñcha ni māṅgīndī.',
    literal: 'Do not demand buttermilk just because the scorching sun is out.',
    context: 'Patience and decorum; demanding rights or favors at an untimely juncture.',
    category: 'Political Commentary',
  },
  {
    devanagari: 'घाम डांडा मा, ब्याळि गौं मा।',
    transliteration: 'Ghāma ḍāṇḍā mā, byāḷi gauṁ mā.',
    literal: 'The sunlight lingers on the high crest, while evening shadows already blanket the valley village.',
    context: 'Passing of time, fleeting youth, or disparity between high officeholders and grassroots citizens.',
    category: 'Literary Prose',
  },
];

export const SAMPLE_INPUTS: SampleInput[] = [
  {
    title: 'चमोली आपदा एवं अलकनंदा बेसिन रिपोर्ट (Disaster Bulletin)',
    category: 'Editorial/News',
    sourceLang: 'Hindi',
    headlineHint: 'चमोली मा अलकनंदा और धौलीगंगा उफाण पर, डांड्युं मा सतर्कता जारी',
    text: 'उत्तराखंड के चमोली जिले में ऊपरी हिमालयी क्षेत्र में भारी बारिश और बादल फटने के कारण अलकनंदा और धौलीगंगा नदियों का जलस्तर तेजी से बढ़ गया है। जिला प्रशासन ने नदी तट पर बसे सभी गांवों और निचले कस्बों के निवासियों को सुरक्षित स्थानों पर जाने की सलाह दी है। स्थानीय गधेरों में अचानक आए मलबे के कारण बद्रीनाथ राष्ट्रीय राजमार्ग कई स्थानों पर अवरुद्ध हो गया है। एसडीआरएफ और राहत दल मौके पर पहुंच चुके हैं।',
  },
  {
    title: 'पहाड़ी कृषि, मिलेट्स एवं बुग्याल चराई (Millets & Bugyal Pastoralism)',
    category: 'Ecological/Environment',
    sourceLang: 'Hindi',
    headlineHint: 'मंडुआ और झंगोरा का दिन फिरे, बुग्यालुं मा अनवालुं की चहल-पहल',
    text: 'गढ़वाल के पर्वतीय ढलानों पर परंपरागत मोटे अनाज मंडुआ और झंगोरा की खेती अब फिर से नई पहचान पा रही है। स्वास्थ्य के प्रति बढ़ती जागरूकता ने इन पौष्टिक फसलों की मांग शहरों में बढ़ा दी है। वहीं दूसरी ओर, ग्रीष्म ऋतु शुरू होते ही घाटी के अनवाल अपने भेड़-बकरियों के साथ ऊपरी बुग्यालों की ओर कूच करने लगे हैं। बांद और बुरांश के वनों से गुजरते हुए यह चरवाहे हिमालयी जैव विविधता के रक्षक भी हैं।',
  },
  {
    title: 'प्रवास से घर वापसी (Elderly Mother Welcoming Son to Village)',
    category: 'Village Dialogue',
    sourceLang: 'Hindi',
    headlineHint: 'परदेस बटी घर ऐया बेटा कु डांडा का आंगण मा स्वागत',
    text: 'माँ ने आंगण में धूप सेंकते हुए कहा: बेटा, तुम इतने सालों बाद अपने गाँव आए हो। देखो, डांडा-कांडा आज भी वैसे ही खामोश हैं, लेकिन गाँव के कई घरों में अब ताले लटक चुके हैं। तुम शहर में चाहे कितना भी कमा लो, लेकिन अपने मैती और पलि-भौंत की मिट्टी की खुशबू कभी मत भूलना। हाथ-मुँह धोकर नौले का शीतल पानी पियो और चूल्हे की मंडुए की रोटी खाओ।',
  },
  {
    title: 'Himalayan Spring Rejuvenation Project (English News Desk)',
    category: 'Editorial/News',
    sourceLang: 'English',
    headlineHint: 'State Water Bureau launches major conservation campaign across Garhwal valleys',
    text: 'A comprehensive scientific survey has revealed that nearly thirty percent of traditional mountain springs and perennial water channels across Tehri and Rudraprayag are experiencing a sharp decline in discharge. The regional water conservation department has initiated an urgent aquifer replenishment program using indigenous broad-leaf oak forestry and contour trenches along the high ridges. Local panchayats will lead the restoration of community stepwells.',
  },
  {
    title: 'नंदा राजजात और लोक संस्कृति (Literary & Cultural Essay)',
    category: 'Literary Essay',
    sourceLang: 'Hindi',
    headlineHint: 'हिमावंत की ध्याणी नंदा: आस्था, जागर और छंतोला की अमर गाथा',
    text: 'गढ़वाल की सांस्कृतिक चेतना में मां नंदा का स्थान सर्वोच्च है। जब बारह वर्षों में नंदा राजजात की यात्रा नौटी गाँव से निकलती है, तो संपूर्ण हिमालय भावविभोर हो उठता है। चार सींगों वाला चौसिंग्या खाडू और पवित्र छंतोला जब बर्फानी चोटियों की ओर बढ़ता है, तो घाटियों में जागर के स्वर गूंजते हैं। यह केवल एक धार्मिक यात्रा नहीं, बल्कि पर्यावरण, मातृशक्ति और लोक-एकता का अद्वितीय महाकुंभ है।',
  },
  {
    title: 'कुमाऊँ के नौले, झोड़ा एवं लोक विरासत (Kumaoni Cultural & Ecological Essay)',
    category: 'Ecological/Environment',
    sourceLang: 'Hindi',
    headlineHint: 'अल्मोड़ा और बागेश्वर का नौलो मा निर्मल जल, झोड़ा-चांचरी की गूंज',
    text: 'कुमाऊँ अंचल में परंपरागत नौले केवल जल स्रोत नहीं हैं, बल्कि यह स्थापत्य कला और सामाजिक समरसता के पावन मंदिर हैं। अल्मोड़ा, पिथौरागढ़ और चम्पावत के प्राचीन नौलों का जल ग्रीष्म ऋतु में भी अमृत समान शीतल रहता है। जब सायंकाल गाँव के आंगण में हुड़के की थाप पर महिलाएँ झोड़ा और चांचरी गाती हैं, तो पूरा पहाड़ अपनी समृद्ध लोक संस्कृति से झूम उठता है। इजा और बूबू के आशीर्वाद से यह धरोहर आज भी जीवंत है।',
  },
  {
    title: 'जौनसार-बावर का महासू मंदिर एवं बिस्सू पर्व (Jaunsari Tribal Traditions)',
    category: 'Literary Essay',
    sourceLang: 'Hindi',
    headlineHint: 'हनोल मा महासू देवता रो पवित्र मंदर, बिस्सू मेळा मा हारुल नृत्य',
    text: 'जौनसार-बावर की पावन भूमि पर टोंस नदी के तट पर हनोल में स्थित महासू देवता का मंदिर न्याय और जन-आस्था का अमर केंद्र है। वैशाख मास में जब बिस्सू पर्व का शुभारंभ होता है, तो चक्राता, कालसी और त्यूणी के ग्रामीण अपनी पारंपरिक भेषभूषा में सज-धजकर एकत्रित होते हैं। वीर रस से परिपूर्ण हारुल गीतों की धुन पर जब नर्तक कदम मिलाते हैं, तो महाभारत कालीन संस्कृति साक्षात उपस्थित हो जाती है।',
  },
];

export const RETROFLEX_RULES = [
  {
    char: 'ळ (Retroflex Lateral Flap)',
    usage: 'Core phoneme in Garhwali and traditional Kumaoni. Used where standard Hindi uses \'ल\' but Central Pahari articulates retroflex curl against the palate.',
    examples: 'पाळ (to nurture), बळद (bullock), गळि (alley), काळो (black), घंडियाळ (guardian deity), टिहरियाळि (Tehriyali), नौळो (fresh spring).',
    editorialStandard: 'Print editions must NEVER substitute standard \'ल\' for \'ळ\' in literary and editorial prose. Substituting \'ल\' is considered an orthographic lapse in Sahitya Akademi standards.',
  },
  {
    char: 'कुमाऊँनी सहायक क्रियाएं एवं कृदंत (छ/छु/छा एवं -बेर)',
    usage: 'Kumaoni verbal system uses distinct person agreement and the characteristic absolutive participle \'-बेर\'.',
    examples: 'मैं घर छु (I am home), उ जाँ छ (He goes), हम छा (We are), खाइबेर (having eaten), सुणिबेर (having heard), इजा/बूबू (mother/grandfather).',
    editorialStandard: 'In Kumaoni editorial writing, maintain the integrity of \'-बेर\' participles (e.g. जाइबेर, देखिबेर) and avoid mixing plains Hindi postpositions.',
  },
  {
    char: 'जौनसारी क्रिया-रूप एवं सर्वनाम (सो/सा/थी एवं आमु/तुमु)',
    usage: 'Jaunsari uses distinct Western Pahari verbal copulas (\'सो\' singular, \'सा\' plural, \'थी/थिया\' past) and exclusive pronouns.',
    examples: 'आमु जांदा सा (We are going), उ बोलदो सो (He is speaking), मोख पाणी चहिये (I need water), बिस्सू (spring festival), हारुल (sacred dance).',
    editorialStandard: 'Jaunsari texts preserve the genuine \'-दो/-तो\' participial endings and distinctive postpositions (\'रो/री/रे\' instead of \'का/की/के\').',
  },
  {
    char: 'अनुस्वार / अनुनासिक (ं / ँ)',
    usage: 'Precise nasal vowel markers indicating plural verb forms and case endings across Himalayan languages.',
    examples: 'जांदन (they go), छां (we are), गौं (village), डांड्युं (hills - locative plural), मखि (towards me).',
    editorialStandard: 'Editorial conventions require candrabindu (ँ) for nasalized open vowels (गौं, भ्वैं) and standard anusvara (ं) for nasal consonant homorganics.',
  },
];
