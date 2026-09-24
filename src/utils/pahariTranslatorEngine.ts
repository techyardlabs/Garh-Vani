/**
 * High-Accuracy Central & Western Pahari Linguistic Translation Engine
 * Specializing in:
 * - Standard Literary Garhwali (साहित्यिक मानक गढ़वळि with retroflex ळ)
 * - 6 Garhwali Valley Dialects (Srinagariya, Tehriyali, Salani, Badhani/Chamoli, Nagpuriya, Jaunpuri/Ravalti)
 * - Kumaoni (कुमाऊँनी - Almora/Nainital/Pithoragarh)
 * - Jaunsari (जौनसारी - Chakrata/Jaunsar-Bawar Western Pahari)
 */

export interface TranslatedDialects {
  srinagariya: string;
  tehriyali: string;
  salani: string;
  badhani_chamoli: string;
  nagpuriya: string;
  jaunpuri_ravalti: string;
  kumaoni: string;
  jaunsari: string;
}

export interface LinguisticTranslation {
  sourceText: string;
  sourceLang: string;
  standardGarhwaliDevanagari: string;
  standardGarhwaliTransliteration: string;
  dialects: TranslatedDialects;
  transliterations: Record<keyof TranslatedDialects, string>;
  detectedRegister: string;
  retroflexAudit: Array<{ word: string; standard_spelling: string; phonetic_rule: string }>;
  editorialHeadlines: {
    lead_headline: string;
    kicker: string;
    subhead: string;
    feature_title: string;
  };
  keyVocabulary: Array<{ term: string; meaning: string; context?: string }>;
}

// Full conversational phrases dictionary
interface PhraseMapping {
  match: RegExp;
  garhwali: string;
  garhwaliTranslit: string;
  srinagariya: string;
  tehriyali: string;
  salani: string;
  badhani: string;
  nagpuriya: string;
  jaunpuri: string;
  kumaoni: string;
  kumaoniTranslit: string;
  jaunsari: string;
  jaunsariTranslit: string;
  vocab: Array<{ term: string; meaning: string }>;
}

const PHRASE_DICTIONARY: PhraseMapping[] = [
  // 1. "आप कैसे हैं?" / "तुम कैसे हो?" / "Hello how are you?"
  {
    match: /(?:आप\s+कैसे\s+हैं|तुम\s+कैसे\s+हो|तू\s+कैसा\s+है|how\s+are\s+you|how're\s+you)/i,
    garhwali: 'आप कनक छन? सब कुशल-मंगल त छ?',
    garhwaliTranslit: 'Aap kanak chhan? Sab kushal-mangal ta chha?',
    srinagariya: 'आप कनक छन? सब कुशल-मंगल त छ?',
    tehriyali: 'तुम कनक छा? घर-परिवार मा सब राज़ी-खुशी?',
    salani: 'आप कनक छां? सब ठीक-ठाक छ ना?',
    badhani: 'तुम कनक छौ? सबी जन कुशल छन?',
    nagpuriya: 'आप कनक छन? मंदाकिनी घाटी मा सब मंगलमय छ?',
    jaunpuri: 'तुम कनक सो? सब ठीक-ठाक सो?',
    kumaoni: 'पैलाग! तम कसा छा? घर-परिवार मा सब राजी-खुसी छू ना?',
    kumaoniTranslit: 'Pailag! Tam kasa chha? Ghar-parivar ma sab rajee-khusee chhoo na?',
    jaunsari: 'प्रणाम! तुमु कनक सा? सब कुशल-मंगल सो?',
    jaunsariTranslit: 'Pranaam! Tumu kanak sa? Sab kushal-mangal so?',
    vocab: [
      { term: 'कनक / कसा (Kanak / Kasa)', meaning: 'कैसे / How' },
      { term: 'छन / छा / सा (Chhan / Chha / Sa)', meaning: 'हैं / Are (Honorific auxiliary verb)' },
      { term: 'पैलाग (Pailag)', meaning: 'प्रणाम / Respectful Kumaoni greeting' },
      { term: 'तुमु (Tumu)', meaning: 'आप / You (Jaunsari honorific pronoun)' },
    ],
  },
  // 2. "आपका क्या नाम है?" / "What is your name?"
  {
    match: /(?:आपका\s+(?:क्या\s+)?नाम\s+(?:क्या\s+)?है|तुम्हारा\s+(?:क्या\s+)?नाम\s+(?:क्या\s+)?है|तेरा\s+नाम\s+क्या\s+है|what\s+is\s+your\s+name)/i,
    garhwali: 'आपुको क्या नौं छ?',
    garhwaliTranslit: 'Aapuko kya naun chha?',
    srinagariya: 'आपुको क्या नौं छ?',
    tehriyali: 'तुम्हारो नौं क्या छ?',
    salani: 'आप कु नौं क्या छ जी?',
    badhani: 'आपुको शुभ नौं क्या छ?',
    nagpuriya: 'तुम्हारो नौं क्या छै?',
    jaunpuri: 'तुमोरो के नौं सो?',
    kumaoni: 'तमार के नौं छू? / आपुको के नौं छू?',
    kumaoniTranslit: 'Tamar ke naun chhoo? / Aapuko ke naun chhoo?',
    jaunsari: 'तुमोरो के नौं सो?',
    jaunsariTranslit: 'Tumoro ke naun so?',
    vocab: [
      { term: 'नौं (Naun)', meaning: 'नाम / Name' },
      { term: 'के / क्या (Ke / Kya)', meaning: 'क्या / What' },
      { term: 'छू / छ / सो (Chhoo / Chha / So)', meaning: 'है / Is' },
    ],
  },
  // 3. "मेरा नाम ... है" / "My name is ..."
  {
    match: /(?:मेरा\s+नाम\s+([^\s,।.]+)\s+है|my\s+name\s+is\s+([^\s,.]+))/i,
    garhwali: 'मेरो नौं {name} छ।',
    garhwaliTranslit: 'Mero naun {name} chha.',
    srinagariya: 'मेरो नौं {name} छ।',
    tehriyali: 'मेरो नौं {name} छ।',
    salani: 'मेरो नौं {name} छ।',
    badhani: 'मेरो नाम {name} छ।',
    nagpuriya: 'मेरो नौं {name} छै।',
    jaunpuri: 'मोरो नौं {name} सो।',
    kumaoni: 'म्यार नौं {name} छू।',
    kumaoniTranslit: 'Myar naun {name} chhoo.',
    jaunsari: 'मोरो नौं {name} सो।',
    jaunsariTranslit: 'Moro naun {name} so.',
    vocab: [
      { term: 'मेरो / म्यार / मोरो (Mero / Myar / Moro)', meaning: 'मेरा / My' },
      { term: 'नौं (Naun)', meaning: 'नाम / Name' },
    ],
  },
  // 4. "मैं ठीक हूँ" / "I am fine"
  {
    match: /(?:मैं\s+(?:बिल्कुल\s+)?(?:ठीक|अच्छा|भला)\s+हूँ|सब\s+ठीक\s+है|i\s+am\s+(?:fine|good|well|okay))/i,
    garhwali: 'मि बिल्कुल ठीक छौं, सब कुशल-मंगल छ।',
    garhwaliTranslit: 'Mi bilkul theek chhaun, sab kushal-mangal chha.',
    srinagariya: 'मि ठीक छौं, भगवान की दया से सब कुशल छ।',
    tehriyali: 'मि राज़ी-खुशी छौं, सब ठीक-ठाक छ।',
    salani: 'मि भलो छौं, सब कुशल छ।',
    badhani: 'मि आनंदपूर्वक छौं।',
    nagpuriya: 'मि ठीक छौं, सब मंगल छै।',
    jaunpuri: 'आऊं ठीक सौं, सब कुशल सो।',
    kumaoni: 'म्य बिल्कुल ठीक छू, घर-द्वार मा सब राजी-खुसी छू।',
    kumaoniTranslit: 'My bilkul theek chhoo, ghar-dwaar ma sab rajee-khusee chhoo.',
    jaunsari: 'आऊं ठीक सौं, महासू जी री कृपा से सब कुशल सो।',
    jaunsariTranslit: 'Aaoon theek saun, Mahasu ji ree kripa se sab kushal so.',
    vocab: [
      { term: 'मि / म्य / आऊं (Mi / My / Aaoon)', meaning: 'मैं / I' },
      { term: 'छौं / छू / सौं (Chhaun / Chhoo / Saun)', meaning: 'हूँ / Am' },
      { term: 'राज़ी-खुशी / राजी-खुसी', meaning: 'सकुशल / Well and happy' },
    ],
  },
  // 5. "आप कहाँ जा रहे हैं?" / "Where are you going?"
  {
    match: /(?:आप\s+कहाँ\s+जा\s+रहे\s+हैं|तुम\s+कहाँ\s+जा\s+रहे\s+हो|where\s+are\s+you\s+going)/i,
    garhwali: 'आप कख जाणा छन?',
    garhwaliTranslit: 'Aap kakh jaana chhan?',
    srinagariya: 'आप कख जाणा छन?',
    tehriyali: 'तुम कख जाणा छा?',
    salani: 'आप कख जाणा छां?',
    badhani: 'तुम कुथी जाणा छौ?',
    nagpuriya: 'आप कथै जाणा छन?',
    jaunpuri: 'तुमु कख जांदे सा?',
    kumaoni: 'तम काँ जाणा छा?',
    kumaoniTranslit: 'Tam kaan jaana chha?',
    jaunsari: 'तुमु कख जांदे सा?',
    jaunsariTranslit: 'Tumu kakh jaande sa?',
    vocab: [
      { term: 'कख / काँ / कुथी (Kakh / Kaan / Kuthee)', meaning: 'कहाँ / Where' },
      { term: 'जाणा / जांदे (Jaana / Jaande)', meaning: 'जा रहे / Going' },
    ],
  },
  // 6. "मैं घर जा रहा हूँ" / "I am going home"
  {
    match: /(?:मैं\s+घर\s+जा\s+रहा\s+हूँ|i\s+am\s+going\s+home)/i,
    garhwali: 'मि घर जाणु छौं।',
    garhwaliTranslit: 'Mi ghar jaanu chhaun.',
    srinagariya: 'मि घौर जाणु छौं।',
    tehriyali: 'मि घर जाणु छौं।',
    salani: 'मि घर जाणु छौं।',
    badhani: 'मि निज आवास जाणु छौं।',
    nagpuriya: 'मि घर जाणु छौं।',
    jaunpuri: 'आऊं घर जांदो सौं।',
    kumaoni: 'म्य घर जांण छू।',
    kumaoniTranslit: 'My ghar jaan chhoo.',
    jaunsari: 'आऊं घर जांदो सौं।',
    jaunsariTranslit: 'Aaoon ghar jaando saun.',
    vocab: [
      { term: 'घौर / घर (Ghaur / Ghar)', meaning: 'घर / Home' },
      { term: 'जाणु / जांण / जांदो (Jaanu / Jaan / Jaando)', meaning: 'जा रहा / Going' },
    ],
  },
  // 7. "रास्ता कहाँ है?" / "किधर से रास्ता है?" / "Where is the way/road?"
  {
    match: /(?:रास्ता\s+(?:कहाँ|किधर)\s+है|सड़क\s+(?:कहाँ|किधर)\s+है|where\s+is\s+the\s+(?:way|road|trail))/i,
    garhwali: 'बाटो कख छ? मथै सीधो रस्तो बतावा।',
    garhwaliTranslit: 'Baato kakh chha? Mathai seedho rasto batawa.',
    srinagariya: 'बाटो कख छ? मथै सीधो रस्तो बतावा।',
    tehriyali: 'बाटो कख छ? मखि रस्तो ब्वला।',
    salani: 'बाटो कख जांद? मि कन रस्तो बताओ।',
    badhani: 'सुपथ कुथी छ? मथै मार्ग बतावा।',
    nagpuriya: 'बाटो कथै छै? मथै रस्तो ब्वला।',
    jaunpuri: 'बाटो कख सो? मोख सीधो रस्तो बोलो।',
    kumaoni: 'बाटो काँ छू? म्यकणि सीधो रस्तो बताओ।',
    kumaoniTranslit: 'Baato kaan chhoo? Myakani seedho rasto batao.',
    jaunsari: 'बाटो कख सो? मोख सीधो बाटो बोलो।',
    jaunsariTranslit: 'Baato kakh so? Mokh seedho baato bolo.',
    vocab: [
      { term: 'बाटो / रस्तो (Baato / Rasto)', meaning: 'रास्ता / Way or trail' },
      { term: 'मथै / म्यकणि / मोख (Mathai / Myakani / Mokh)', meaning: 'मुझे / To me' },
    ],
  },
  // 8. "मुझे पानी चाहिए" / "पानी कहाँ मिलेगा?" / "Water spring"
  {
    match: /(?:मुझे\s+पानी\s+(?:चाहिए|दो|पिलाओ)|पानी\s+कहाँ\s+मिलेगा|where\s+(?:can\s+i\s+get|is)\s+water)/i,
    garhwali: 'मथै पाणी चयीं छ, नौळा अर धारो कु सीतळ पाणी कख मिललू?',
    garhwaliTranslit: 'Mathai paani chayein chha, naula ar dhaaro ku seetal paani kakh milaloo?',
    srinagariya: 'मथै पाणी चयीं छ, नौळा कु सीतळ पाणी कख मिललू?',
    tehriyali: 'मखि पाणी चाहीं छ, मंगरो कु निर्मळ पाणी कख छ?',
    salani: 'मि कन पाणी चयीं, धारो कु पाणि कख मिलदू?',
    badhani: 'मथै जल चयीं, पवित्र धारा कु जल कख छ?',
    nagpuriya: 'मथै पाणी चाहीं छै, पंदेरा कु मीठो पाणी कख बग्गद?',
    jaunpuri: 'मोख पाणी चाही सो, पंदेरे रो निर्मळ पाणी कख मिलदो सो?',
    kumaoni: 'म्यकणि पाणी चाहीं छू, नौला अर धारो को मीठ पाणी काँ मिलल?',
    kumaoniTranslit: 'Myakani paani chaheen chhoo, naula ar dhaaro ko meeth paani kaan milal?',
    jaunsari: 'मोख पाणी चाही सो, पंदेरे रो निर्मळ पाणी कख मिलदा सो?',
    jaunsariTranslit: 'Mokh paani chaahi so, pandere ro nirmal paani kakh milda so?',
    vocab: [
      { term: 'पाणी (Paani)', meaning: 'जल / Water (pure retroflex nasal)' },
      { term: 'नौळा / नौला (Naula)', meaning: 'पारंपरिक जलकुण्ड / Traditional Himalayan aquifer' },
      { term: 'सीतळ (Seetal)', meaning: 'शीतल / Cool & refreshing (retroflex ळ)' },
    ],
  },
  // 9. "बहुत धन्यवाद" / "आभार" / "Thank you very much"
  {
    match: /(?:बहुत\s+(?:बहुत\s+)?(?:धन्यवाद|शुक्रिया|आभार)|thank\s+you\s+very\s+much|thanks\s+a\s+lot)/i,
    garhwali: 'आपुको भौत-भौत धन्यवाद अर आभार!',
    garhwaliTranslit: 'Aapuko bhaut-bhaut dhanyavaad ar aabhaar!',
    srinagariya: 'आपुको भौत-भौत धन्यवाद अर आभार!',
    tehriyali: 'तुम्हारो भौत आभार, मन प्रसन्न ह्वै गै।',
    salani: 'आपुको भौत-भौत धन्यवाद!',
    badhani: 'आपुको सादर कृतज्ञता अर धन्यवाद!',
    nagpuriya: 'भौत-भौत धन्यवाद आपथै!',
    jaunpuri: 'तुमोरो घणो धन्यवाद अर आभार!',
    kumaoni: 'तमार भौत-भौत धन्यवाद अर पैलाग!',
    kumaoniTranslit: 'Tamar bhaut-bhaut dhanyavaad ar pailag!',
    jaunsari: 'तुमोरो घणो धन्यवाद अर जय महासू!',
    jaunsariTranslit: 'Tumoro ghano dhanyavaad ar Jai Mahasu!',
    vocab: [
      { term: 'भौत / घणो (Bhaut / Ghano)', meaning: 'बहुत / Very much' },
      { term: 'पैलाग (Pailag)', meaning: 'प्रणाम / Respectful reverence' },
    ],
  },
  // 10. "आज मौसम बहुत अच्छा है / ठंड है"
  {
    match: /(?:मौसम\s+बहुत\s+(?:अच्छा|ठंडा|खराब)\s+है|आज\s+(?:बहुत\s+)?ठंड\s+है|today\s+the\s+weather\s+is\s+cold)/i,
    garhwali: 'डांडा-कांडा मा आज भौत ठण्डी छ अर बयाळ जोर से चल्लि छ।',
    garhwaliTranslit: 'Danda-kanda ma aaj bhaut thandi chha ar bayaal jor se chal-li chha.',
    srinagariya: 'डांडा-कांडा मा आज खूब ठण्डी छ अर हिउँ पड़णू छ।',
    tehriyali: 'डांड्युं पर आज भयंकर जाड़ो छ अर बयाळ बग्गणी छ।',
    salani: 'पहाड़ों मा आज बड्डी ठण्ड छ अर घाम नि निकळि।',
    badhani: 'उच्च डांड्यों मा आज हिमाच्छादन छ अर सीतळ बयाळ चलणी छ।',
    nagpuriya: 'मंदाकिनी घाटी मा आज जाड़ो बढ़िग्युं छ!',
    jaunpuri: 'डांडे मा आज खूब सीत सो अर हिउँ पड़दो सो।',
    kumaoni: 'डाना-काना मा आज खूब जाड़ छू अर हिउँ पड़ण रौ। बयाळ लै चलणी छू।',
    kumaoniTranslit: 'Daana-kaana ma aaj khoob jaad chhoo ar hiun padan rau. Bayaal lai chalni chhoo.',
    jaunsari: 'डांडे मां आज घणो जाड़ो सो अर बर्फ गिरदी सी।',
    jaunsariTranslit: 'Daande maan aaj ghano jaado so ar barf girdy see.',
    vocab: [
      { term: 'डांडा-कांडा / डाना-काना', meaning: 'पहाड़ और पर्वत शिखर / Mountain ridges' },
      { term: 'बयाळ (Bayaal)', meaning: 'पहाड़ी शीतल हवा / Mountain breeze (retroflex ळ)' },
      { term: 'हिउँ (Hiun)', meaning: 'बर्फ / Snow' },
      { term: 'जाड़ / जाड़ो (Jaad / Jaado)', meaning: 'ठंड / Winter cold' },
    ],
  },
];

// Word-level lexicons for Hindi to Pahari translation
const HINDI_TO_PAHARI_VOCAB: Record<string, { garhwali: string; kumaoni: string; jaunsari: string }> = {
  // Pronouns
  'मैं': { garhwali: 'मि', kumaoni: 'म्य', jaunsari: 'आऊं' },
  'मुझे': { garhwali: 'मथै', kumaoni: 'म्यकणि', jaunsari: 'मोख' },
  'मुझको': { garhwali: 'मथै', kumaoni: 'म्यकणि', jaunsari: 'मोख' },
  'मेरा': { garhwali: 'मेरो', kumaoni: 'म्यार', jaunsari: 'मोरो' },
  'मेरी': { garhwali: 'मेरी', kumaoni: 'म्यर', jaunsari: 'मोरी' },
  'मेरे': { garhwali: 'मेरा', kumaoni: 'म्यार', jaunsari: 'मोरे' },
  'हम': { garhwali: 'हम', kumaoni: 'हमार', jaunsari: 'आमु' },
  'हमें': { garhwali: 'हमथै', kumaoni: 'हमकणि', jaunsari: 'आमूख' },
  'हमको': { garhwali: 'हमथै', kumaoni: 'हमकणि', jaunsari: 'आमूख' },
  'हमारा': { garhwali: 'हमारो', kumaoni: 'हमार', jaunsari: 'आमोरो' },
  'हमारी': { garhwali: 'हमारी', kumaoni: 'हमार', jaunsari: 'आमोरी' },
  'हमारे': { garhwali: 'हमारा', kumaoni: 'हमार', jaunsari: 'आमोरे' },
  'तुम': { garhwali: 'तुम', kumaoni: 'तम', jaunsari: 'तुमु' },
  'तुम्हें': { garhwali: 'तुमथै', kumaoni: 'तमकणि', jaunsari: 'तुमोख' },
  'तुमको': { garhwali: 'तुमथै', kumaoni: 'तमकणि', jaunsari: 'तुमोख' },
  'तुम्हारा': { garhwali: 'तुम्हारो', kumaoni: 'तमार', jaunsari: 'तुमोरो' },
  'तुम्हारी': { garhwali: 'तुम्हारी', kumaoni: 'तमार', jaunsari: 'तुमोरी' },
  'तुम्हारे': { garhwali: 'तुम्हारा', kumaoni: 'तमार', jaunsari: 'तुमोरे' },
  'आप': { garhwali: 'आप', kumaoni: 'तम', jaunsari: 'तुमु' },
  'आपको': { garhwali: 'आपथै', kumaoni: 'आपकणि', jaunsari: 'तुमोख' },
  'आपका': { garhwali: 'आपुको', kumaoni: 'तमार', jaunsari: 'तुमोरो' },
  'आपकी': { garhwali: 'आपुकी', kumaoni: 'तमार', jaunsari: 'तुमोरी' },
  'आपके': { garhwali: 'आपुका', kumaoni: 'तमार', jaunsari: 'तुमोरे' },
  'यह': { garhwali: 'यो', kumaoni: 'यो', jaunsari: 'यो' },
  'ये': { garhwali: 'ये', kumaoni: 'या', jaunsari: 'ए' },
  'वह': { garhwali: 'ऊ', kumaoni: 'ऊ', jaunsari: 'सो' },
  'वो': { garhwali: 'वो', kumaoni: 'वा', jaunsari: 'ते' },
  'उसका': { garhwali: 'वेको', kumaoni: 'वीको', jaunsari: 'तेरो' },
  'उसकी': { garhwali: 'वेकी', kumaoni: 'वीकी', jaunsari: 'तेरी' },
  'उसके': { garhwali: 'वेका', kumaoni: 'वीका', jaunsari: 'तेरे' },
  'उसे': { garhwali: 'वेथै', kumaoni: 'वींकणि', jaunsari: 'तेखो' },
  'उनका': { garhwali: 'उंको', kumaoni: 'उंको', jaunsari: 'तेरो' },
  'उनकी': { garhwali: 'उंकी', kumaoni: 'उंकी', jaunsari: 'तेरी' },
  'उनके': { garhwali: 'उंका', kumaoni: 'उंका', jaunsari: 'तेरे' },
  'उन्हें': { garhwali: 'उनथै', kumaoni: 'उंकणि', jaunsari: 'तेखो' },
  'कौन': { garhwali: 'को', kumaoni: 'को', jaunsari: 'कुण' },
  'क्या': { garhwali: 'क्या', kumaoni: 'के', jaunsari: 'के' },
  'कहाँ': { garhwali: 'कख', kumaoni: 'काँ', jaunsari: 'कख' },
  'किधर': { garhwali: 'कख', kumaoni: 'काँ', jaunsari: 'कख' },
  'कब': { garhwali: 'कबे', kumaoni: 'कब', jaunsari: 'कबे' },
  'कैसे': { garhwali: 'कनक', kumaoni: 'कसा', jaunsari: 'कनक' },
  'कैसा': { garhwali: 'कनु', kumaoni: 'कसो', jaunsari: 'कनो' },
  'कैसी': { garhwali: 'कनी', kumaoni: 'कसी', jaunsari: 'कनी' },
  'क्यों': { garhwali: 'क्यैक', kumaoni: 'किलै', jaunsari: 'कीरो' },
  'कितना': { garhwali: 'कतगा', kumaoni: 'कतुक', jaunsari: 'केतो' },
  'कितने': { garhwali: 'कतगा', kumaoni: 'कतुका', jaunsari: 'केते' },
  'कितनी': { garhwali: 'कति', kumaoni: 'कतुकी', jaunsari: 'केती' },

  // Postpositions
  'में': { garhwali: 'मा', kumaoni: 'मा', jaunsari: 'मां' },
  'से': { garhwali: 'बटी', kumaoni: 'बै', jaunsari: 'से' },
  'का': { garhwali: 'कु', kumaoni: 'को', jaunsari: 'रो' },
  'की': { garhwali: 'की', kumaoni: 'की', jaunsari: 'री' },
  'के': { garhwali: 'का', kumaoni: 'का', jaunsari: 'रा' },
  'को': { garhwali: 'थैन', kumaoni: 'कणि', jaunsari: 'खो' },
  'पर': { garhwali: 'पर', kumaoni: 'पर', jaunsari: 'मां' },
  'साथ': { garhwali: 'दगड़ि', kumaoni: 'दगड़ि', jaunsari: 'दगड़े' },
  'के साथ': { garhwali: 'दगड़ि', kumaoni: 'दगड़ि', jaunsari: 'दगड़े' },
  'लिए': { garhwali: 'खातिर', kumaoni: 'खातिर', jaunsari: 'खातिर' },
  'के लिए': { garhwali: 'खातिर', kumaoni: 'खातिर', jaunsari: 'खातिर' },
  'तक': { garhwali: 'तक', kumaoni: 'तक', jaunsari: 'तक' },

  // Auxiliaries & Particles
  'है': { garhwali: 'छ', kumaoni: 'छू', jaunsari: 'सो' },
  'हैं': { garhwali: 'छन', kumaoni: 'छन', jaunsari: 'सा' },
  'हूँ': { garhwali: 'छौं', kumaoni: 'छू', jaunsari: 'सौं' },
  'हो': { garhwali: 'छा', kumaoni: 'छा', jaunsari: 'सा' },
  'था': { garhwali: 'छौ', kumaoni: 'छी', jaunsari: 'थिया' },
  'थी': { garhwali: 'छी', kumaoni: 'छि', jaunsari: 'थी' },
  'थे': { garhwali: 'छा', kumaoni: 'छा', jaunsari: 'थे' },
  'होगा': { garhwali: 'होलु', kumaoni: 'होल', jaunsari: 'हुणो' },
  'होगी': { garhwali: 'होली', kumaoni: 'होली', jaunsari: 'हुणी' },
  'होंगे': { garhwali: 'होला', kumaoni: 'होला', jaunsari: 'हुणे' },
  'नहीं': { garhwali: 'नी', kumaoni: 'न्है', jaunsari: 'ना' },
  'मत': { garhwali: 'जनि', kumaoni: 'जनि', jaunsari: 'ना' },
  'और': { garhwali: 'अर', kumaoni: 'अर', jaunsari: 'अर' },
  'तथा': { garhwali: 'अर', kumaoni: 'अर', jaunsari: 'अर' },
  'एवं': { garhwali: 'अर', kumaoni: 'अर', jaunsari: 'अर' },
  'भी': { garhwali: 'भी', kumaoni: 'लै', jaunsari: 'भी' },
  'तो': { garhwali: 'त', kumaoni: 'त', jaunsari: 'त' },
  'लेकिन': { garhwali: 'पण', kumaoni: 'पण', jaunsari: 'पण' },
  'परन्तु': { garhwali: 'पण', kumaoni: 'पण', jaunsari: 'पण' },
  'मगर': { garhwali: 'पण', kumaoni: 'पण', jaunsari: 'पण' },

  // Common Nouns
  'नाम': { garhwali: 'नौं', kumaoni: 'नौं', jaunsari: 'नौं' },
  'पानी': { garhwali: 'पाणी', kumaoni: 'पाणी', jaunsari: 'पाणी' },
  'जल': { garhwali: 'पाणी', kumaoni: 'पाणी', jaunsari: 'पाणी' },
  'गाँव': { garhwali: 'गौं', kumaoni: 'गाँव', jaunsari: 'गाँव' },
  'घर': { garhwali: 'घौर', kumaoni: 'घर', jaunsari: 'घर' },
  'मकान': { garhwali: 'घौर', kumaoni: 'घर', jaunsari: 'घर' },
  'पहाड़': { garhwali: 'डांडा-कांडा', kumaoni: 'डाना-काना', jaunsari: 'डांडा' },
  'पर्वत': { garhwali: 'डांडा', kumaoni: 'डाना', jaunsari: 'डांडा' },
  'रास्ता': { garhwali: 'बाटो', kumaoni: 'बाटो', jaunsari: 'बाटो' },
  'मार्ग': { garhwali: 'बाटो', kumaoni: 'बाटो', jaunsari: 'बाटो' },
  'सड़क': { garhwali: 'सड़क', kumaoni: 'बाटो', jaunsari: 'सड़क' },
  'नदी': { garhwali: 'गाड़', kumaoni: 'गाड़', jaunsari: 'गाड़' },
  'झरना': { garhwali: 'छड़ा', kumaoni: 'छड़ा', jaunsari: 'झरना' },
  'जंगल': { garhwali: 'बाण', kumaoni: 'जंगळ', jaunsari: 'जंगल' },
  'वन': { garhwali: 'बाण', kumaoni: 'जंगळ', jaunsari: 'बाण' },
  'पेड़': { garhwali: 'रुख', kumaoni: 'रुख', jaunsari: 'रुख' },
  'वृक्ष': { garhwali: 'रुख', kumaoni: 'रुख', jaunsari: 'रुख' },
  'घास': { garhwali: 'घाह', kumaoni: 'घाह', jaunsari: 'घास' },
  'रोटी': { garhwali: 'रोटि', kumaoni: 'रोटी', jaunsari: 'रोटी' },
  'खाना': { garhwali: 'खाणो', kumaoni: 'खाण', jaunsari: 'खाणो' },
  'भोजन': { garhwali: 'खाणो', kumaoni: 'खाण', jaunsari: 'खाणो' },
  'चावल': { garhwali: 'भात', kumaoni: 'भात', jaunsari: 'भात' },
  'दूध': { garhwali: 'दूध', kumaoni: 'दूध', jaunsari: 'दूध' },
  'चाय': { garhwali: 'चाय', kumaoni: 'चाय', jaunsari: 'चाय' },
  'लोग': { garhwali: 'मनखि', kumaoni: 'मनखि', jaunsari: 'लोका' },
  'आदमी': { garhwali: 'मनखि', kumaoni: 'मनखि', jaunsari: 'मानस' },
  'महिला': { garhwali: 'सयाणी', kumaoni: 'महिला', jaunsari: 'सयाणी' },
  'स्त्री': { garhwali: 'जनानी', kumaoni: 'जनानी', jaunsari: 'जनानी' },
  'लड़का': { garhwali: 'नौनु', kumaoni: 'च्यल', jaunsari: 'छोकरा' },
  'लड़की': { garhwali: 'नौनी', kumaoni: 'च्यली', jaunsari: 'छोकरी' },
  'बच्चा': { garhwali: 'नातिंगळ', kumaoni: 'नान', jaunsari: 'टाबर' },
  'बच्चे': { garhwali: 'नातिंगळा', kumaoni: 'नानतिन', jaunsari: 'टाबरा' },
  'पिता': { garhwali: 'बाबाजी', kumaoni: 'बाबु', jaunsari: 'बाबाजी' },
  'पिताजी': { garhwali: 'बाबाजी', kumaoni: 'बाबाजी', jaunsari: 'बाबाजी' },
  'माँ': { garhwali: 'ब्वै', kumaoni: 'इजा', jaunsari: 'ईजा' },
  'माताजी': { garhwali: 'ब्वै', kumaoni: 'इजा', jaunsari: 'ईजा' },
  'भाई': { garhwali: 'भुल्ला', kumaoni: 'दाज्यू', jaunsari: 'भाई' },
  'बहन': { garhwali: 'बैणी', kumaoni: 'दीदी', jaunsari: 'बैणी' },
  'दोस्त': { garhwali: 'दगड़्या', kumaoni: 'दगड़्या', jaunsari: 'संगी' },
  'मित्र': { garhwali: 'दगड़्या', kumaoni: 'दगड़्या', jaunsari: 'संगी' },
  'दिन': { garhwali: 'दिन', kumaoni: 'दिन', jaunsari: 'दिन' },
  'रात': { garhwali: 'रात', kumaoni: 'रात', jaunsari: 'रात' },
  'सुबह': { garhwali: 'ब्याळ', kumaoni: 'सबेर', jaunsari: 'सबेर' },
  'शाम': { garhwali: 'ब्याळ', kumaoni: 'ब्याळ', jaunsari: 'सांज' },
  'आज': { garhwali: 'आज', kumaoni: 'आज', jaunsari: 'आज' },
  'कल': { garhwali: 'भोल', kumaoni: 'भोल', jaunsari: 'भोल' },
  'समय': { garhwali: 'टेम', kumaoni: 'टेम', jaunsari: 'टेम' },
  'बात': { garhwali: 'कुरड़ी', kumaoni: 'बात', jaunsari: 'बात' },
  'बातें': { garhwali: 'कुरड्यां', kumaoni: 'बातन', jaunsari: 'बातां' },

  // Adjectives
  'बहुत': { garhwali: 'भौत', kumaoni: 'भौत', jaunsari: 'घणो' },
  'अच्छा': { garhwali: 'भलो', kumaoni: 'भल', jaunsari: 'भलो' },
  'अच्छी': { garhwali: 'भली', kumaoni: 'भली', jaunsari: 'भली' },
  'अच्छे': { garhwali: 'भला', kumaoni: 'भला', jaunsari: 'भले' },
  'बड़ा': { garhwali: 'बड्डो', kumaoni: 'बड्ड', jaunsari: 'बड़ो' },
  'बड़ी': { garhwali: 'बड्डी', kumaoni: 'बड्डी', jaunsari: 'बड़ी' },
  'बड़े': { garhwali: 'बड्डा', kumaoni: 'बड्डा', jaunsari: 'बड़े' },
  'छोटा': { garhwali: 'नान', kumaoni: 'नान', jaunsari: 'छोटो' },
  'छोटी': { garhwali: 'नानी', kumaoni: 'नानी', jaunsari: 'छोटी' },
  'छोटे': { garhwali: 'नाना', kumaoni: 'नाना', jaunsari: 'छोटे' },
  'सुंदर': { garhwali: 'सुन्दर', kumaoni: 'भल', jaunsari: 'भलो' },
  'मीठा': { garhwali: 'मीठो', kumaoni: 'मीठ', jaunsari: 'मीठो' },
  'मीठी': { garhwali: 'मीठी', kumaoni: 'मीठी', jaunsari: 'मीठी' },
  'ठंडा': { garhwali: 'सीतळ', kumaoni: 'ठण्ड', jaunsari: 'सीतळ' },
  'ठंडी': { garhwali: 'सीतळ', kumaoni: 'ठण्डी', jaunsari: 'सीतळ' },
  'गर्म': { garhwali: 'तातो', kumaoni: 'तात', jaunsari: 'तातो' },
  'पुराना': { garhwali: 'पुरातन', kumaoni: 'पुरान', jaunsari: 'पुरानो' },
  'नया': { garhwali: 'नौ', kumaoni: 'नयो', jaunsari: 'नवो' },

  // Common Verbs / Actions
  'करना': { garhwali: 'करनु', kumaoni: 'करन', jaunsari: 'करणो' },
  'करते': { garhwali: 'कन्ना', kumaoni: 'कन्ना', jaunsari: 'करदा' },
  'करता': { garhwali: 'कन्द', kumaoni: 'करँ', jaunsari: 'करदो' },
  'करती': { garhwali: 'कन्दि', kumaoni: 'करछि', jaunsari: 'करदी' },
  'जाना': { garhwali: 'जाणु', kumaoni: 'जांण', jaunsari: 'जाणो' },
  'जाते': { garhwali: 'जांदन', kumaoni: 'जाँछन', jaunsari: 'जांदा' },
  'जाता': { garhwali: 'जांद', kumaoni: 'जाँ', jaunsari: 'जांदो' },
  'जाती': { garhwali: 'जांदि', kumaoni: 'जाँछि', jaunsari: 'जांदी' },
  'आना': { garhwali: 'औणु', kumaoni: 'आंण', jaunsari: 'आणो' },
  'आते': { garhwali: 'आंदन', kumaoni: 'आँछन', jaunsari: 'आंदा' },
  'आता': { garhwali: 'आंद', kumaoni: 'आँ', jaunsari: 'आंदो' },
  'बोलना': { garhwali: 'ब्वळणु', kumaoni: 'ब्वलन', jaunsari: 'बोलणो' },
  'बोलते': { garhwali: 'ब्वल्दन', kumaoni: 'ब्वल्छन', jaunsari: 'बोलदा' },
  'कहना': { garhwali: 'ब्वळणु', kumaoni: 'कन', jaunsari: 'कहणो' },
  'कहते': { garhwali: 'ब्वल्दन', kumaoni: 'कन्दन', jaunsari: 'कहंदा' },
  'देखना': { garhwali: 'देख्णु', kumaoni: 'हेरण', jaunsari: 'देखणो' },
  'देखते': { garhwali: 'देख्दन', kumaoni: 'हेरछन', jaunsari: 'देखदा' },
  'सुनना': { garhwali: 'सुण्णु', kumaoni: 'सुनन', jaunsari: 'सुणणो' },
  'रहना': { garhwali: 'रैणु', kumaoni: 'रौण', jaunsari: 'रोणो' },
  'रहते': { garhwali: 'रान्दान', kumaoni: 'रौछा', jaunsari: 'रौंदा' },
  'खाना_v': { garhwali: 'खाणु', kumaoni: 'खाण', jaunsari: 'खाणो' },
  'पीना': { garhwali: 'पीणु', kumaoni: 'पीण', jaunsari: 'पीणो' },
  'चलना': { garhwali: 'चल्नु', kumaoni: 'हिनन', jaunsari: 'चलणो' },
  'चलो': { garhwali: 'हिया', kumaoni: 'हिया', jaunsari: 'हिया' },
  'आइए': { garhwali: 'आवा', kumaoni: 'आया', jaunsari: 'आओ' },
  'बैठिए': { garhwali: 'बैठा', kumaoni: 'बैठा', jaunsari: 'बैठो' },
  'सुनिए': { garhwali: 'सुणा', kumaoni: 'सुणा', jaunsari: 'सुणो' },
  'बताइए': { garhwali: 'बतावा', kumaoni: 'बताओ', jaunsari: 'बताओ' },
  'दीजिए': { garhwali: 'द्यावा', kumaoni: 'दिया', jaunsari: 'द्यो' },
  'लीजिए': { garhwali: 'ल्यावा', kumaoni: 'लिहा', jaunsari: 'ल्यो' },
  'नमस्ते': { garhwali: 'नमस्कार', kumaoni: 'पैलाग', jaunsari: 'प्रणाम' },
  'प्रणाम': { garhwali: 'प्रणाम', kumaoni: 'पैलाग', jaunsari: 'जय महासू' },
};

// Translates English sentences to Hindi before Pahari mapping
const ENGLISH_TO_HINDI_COMMON: Record<string, string> = {
  'hello': 'नमस्ते',
  'how are you': 'आप कैसे हैं',
  'what is your name': 'आपका क्या नाम है',
  'my name is': 'मेरा नाम है',
  'i am fine': 'मैं ठीक हूँ',
  'where are you going': 'आप कहाँ जा रहे हैं',
  'i am going home': 'मैं घर जा रहा हूँ',
  'where is the way': 'रास्ता कहाँ है',
  'where is the road': 'सड़क कहाँ है',
  'where can i find water': 'पानी कहाँ मिलेगा',
  'thank you very much': 'बहुत धन्यवाद',
  'the weather is very good': 'मौसम बहुत अच्छा है',
  'it is very cold today': 'आज बहुत ठंड है',
};

// Clean and tokenize text
function cleanTokens(text: string): string[] {
  return text
    .replace(/[?,!।.:;"'()[\]{}]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

// Token-by-token sentence translation with multi-word lookahead
export function translateSentenceTokenByToken(
  hindiSentence: string,
  targetLang: 'garhwali' | 'kumaoni' | 'jaunsari'
): string {
  let text = hindiSentence.trim();

  // Multi-word verb phrases replacements
  const multiWordRules: Array<{ pattern: RegExp; garhwali: string; kumaoni: string; jaunsari: string }> = [
    { pattern: /जा\s+रहा\s+हूँ/g, garhwali: 'जाणु छौं', kumaoni: 'जांण छू', jaunsari: 'जांदो सौं' },
    { pattern: /जा\s+रही\s+हूँ/g, garhwali: 'जाणि छौं', kumaoni: 'जांण छू', jaunsari: 'जांदी सौं' },
    { pattern: /जा\s+रहे\s+हैं/g, garhwali: 'जाणा छन', kumaoni: 'जाणा छा', jaunsari: 'जांदे सा' },
    { pattern: /जा\s+रहा\s+है/g, garhwali: 'जाणु छ', kumaoni: 'जांण छू', jaunsari: 'जांदो सो' },
    { pattern: /जा\s+रही\s+है/g, garhwali: 'जाणि छ', kumaoni: 'जांण छू', jaunsari: 'जांदी सो' },
    { pattern: /आ\s+रहा\s+हूँ/g, garhwali: 'औणु छौं', kumaoni: 'आंण छू', jaunsari: 'आवंतो सौं' },
    { pattern: /आ\s+रहे\s+हैं/g, garhwali: 'आणा छन', kumaoni: 'आणा छा', jaunsari: 'आवंता सा' },
    { pattern: /आ\s+रहा\s+है/g, garhwali: 'औणु छ', kumaoni: 'आंण छू', jaunsari: 'आवंतो सो' },
    { pattern: /कर\s+रहा\s+हूँ/g, garhwali: 'कर्नु छौं', kumaoni: 'करन छू', jaunsari: 'करदो सौं' },
    { pattern: /कर\s+रहे\s+हैं/g, garhwali: 'कन्ना छन', kumaoni: 'कन्ना छा', jaunsari: 'करदा सा' },
    { pattern: /कर\s+रहा\s+है/g, garhwali: 'कर्नु छ', kumaoni: 'करन छू', jaunsari: 'करदो सो' },
    { pattern: /बोल\s+रहा\s+हूँ/g, garhwali: 'ब्वल्नु छौं', kumaoni: 'ब्वलन छू', jaunsari: 'बोलदो सौं' },
    { pattern: /बोल\s+रहे\s+हैं/g, garhwali: 'ब्वल्दा छन', kumaoni: 'ब्वल्छा', jaunsari: 'बोलदा सा' },
    { pattern: /रहता\s+हूँ/g, garhwali: 'रौंदो छौं', kumaoni: 'रौंछू', jaunsari: 'रौंदो सौं' },
    { pattern: /रहते\s+हैं/g, garhwali: 'रान्दान', kumaoni: 'रौछा', jaunsari: 'रौंदा सा' },
    { pattern: /रहती\s+है/g, garhwali: 'रौंदि छ', kumaoni: 'रौंछि', jaunsari: 'रौंदी सो' },
    { pattern: /रहता\s+है/g, garhwali: 'रौंद छ', kumaoni: 'रौँ छू', jaunsari: 'रौंदो सो' },
    { pattern: /पानी\s+चाहिए/g, garhwali: 'पाणी चयीं छ', kumaoni: 'पाणी चाहीं छू', jaunsari: 'पाणी चाही सो' },
    { pattern: /मदद\s+चाहिए/g, garhwali: 'मदद चयीं छ', kumaoni: 'मदद चाहीं छू', jaunsari: 'मदद चाही सो' },
    { pattern: /क्या\s+हाल\s+चाल\s+है/g, garhwali: 'क्या हाल-चाल छ?', kumaoni: 'के हाल-चाल छू?', jaunsari: 'के हाल-चाल सो?' },
    { pattern: /सब\s+ठीक\s+है/g, garhwali: 'सब ठीक छ', kumaoni: 'सब भल छू', jaunsari: 'सब ठीक सो' },
    { pattern: /कहाँ\s+से\s+हो/g, garhwali: 'कख बटी छा?', kumaoni: 'काँ बै छा?', jaunsari: 'कख से सा?' },
    { pattern: /कहाँ\s+से\s+हैं/g, garhwali: 'कख बटी छन?', kumaoni: 'काँ बै छा?', jaunsari: 'कख से सा?' },
    { pattern: /कहाँ\s+रहते\s+हो/g, garhwali: 'कख रान्दा छा?', kumaoni: 'काँ रौछा?', jaunsari: 'कख रौंदा सा?' },
    { pattern: /कहाँ\s+रहते\s+हैं/g, garhwali: 'कख रान्दान?', kumaoni: 'काँ रौछा?', jaunsari: 'कख रौंदा सा?' },
  ];

  for (const rule of multiWordRules) {
    if (rule.pattern.test(text)) {
      text = text.replace(rule.pattern, rule[targetLang]);
    }
  }

  // Split into tokens preserving punctuation
  const words = text.split(/(\s+|[?,!।.:;"'()[\]{}])/);
  const translatedWords = words.map((token) => {
    const cleanWord = token.trim();
    if (!cleanWord) return token;

    if (HINDI_TO_PAHARI_VOCAB[cleanWord]) {
      return HINDI_TO_PAHARI_VOCAB[cleanWord][targetLang];
    }
    return token;
  });

  let result = translatedWords.join('');

  // Grammar harmonization for specific target language endings
  if (targetLang === 'garhwali') {
    // Replace dangling standard 'है' with 'छ', 'हैं' with 'छन'
    result = result.replace(/\bहै\b/g, 'छ').replace(/\bहैं\b/g, 'छन').replace(/\bहूँ\b/g, 'छौं');
    // Ensure retroflex ळ orthography
    result = result.replace(/गढ़वाली/g, 'गढ़वाळी').replace(/पानी/g, 'पाणि').replace(/शीतल/g, 'सीतळ');
  } else if (targetLang === 'kumaoni') {
    result = result.replace(/\bहै\b/g, 'छू').replace(/\bहैं\b/g, 'छन').replace(/\bहूँ\b/g, 'छूं');
    result = result.replace(/कुमाउनी/g, 'कुमाऊँनी').replace(/कुमाऊनी/g, 'कुमाऊँनी');
  } else if (targetLang === 'jaunsari') {
    result = result.replace(/\bहै\b/g, 'सो').replace(/\bहैं\b/g, 'सा').replace(/\bहूँ\b/g, 'सौं');
  }

  return result;
}

// Convert Devanagari text to readable phonetic Romanized transliteration
export function transliterateDevanagari(text: string): string {
  const charMap: Record<string, string> = {
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri',
    'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'an', 'अः': 'ah',
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
    'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
    'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
    'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
    'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
    'य': 'y', 'र': 'r', 'ल': 'l', 'ळ': 'l', 'व': 'w', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
    'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', 'ँ': 'n', '्': '', 'ः': 'h',
  };

  let out = '';
  const consonants = 'कखगघङचछजझञटठडढणतथदधनपफबभमयरलळवशषसह';
  const matras = 'ािीुूृेैोौ्';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === ' ') {
      out += ' ';
    } else if (charMap[char]) {
      out += charMap[char];
      if (consonants.includes(char) && (!nextChar || (!matras.includes(nextChar) && nextChar !== ' '))) {
        out += 'a';
      }
    } else {
      out += char;
    }
  }

  // Clean double spaces or weird trailing 'a's
  return out.replace(/\s+/g, ' ').trim();
}

// Master translation pipeline that runs offline or as reliable server linguistic engine
export function translateLinguistically(
  inputText: string,
  sourceLangHint = 'Auto',
  register = 'साहित्यिक / पत्रकारीय'
): LinguisticTranslation {
  const text = inputText.trim();

  // 1. Direct conversational phrase dictionary lookup
  for (const entry of PHRASE_DICTIONARY) {
    if (entry.match.test(text)) {
      // Dynamic name substitution if applicable
      const nameMatch = text.match(entry.match);
      let srinagariya = entry.srinagariya;
      let tehriyali = entry.tehriyali;
      let salani = entry.salani;
      let badhani = entry.badhani;
      let nagpuriya = entry.nagpuriya;
      let jaunpuri = entry.jaunpuri;
      let kumaoni = entry.kumaoni;
      let jaunsari = entry.jaunsari;
      let garhwali = entry.garhwali;

      if (nameMatch && (nameMatch[1] || nameMatch[2])) {
        const extractedName = (nameMatch[1] || nameMatch[2]).trim();
        srinagariya = srinagariya.replace('{name}', extractedName);
        tehriyali = tehriyali.replace('{name}', extractedName);
        salani = salani.replace('{name}', extractedName);
        badhani = badhani.replace('{name}', extractedName);
        nagpuriya = nagpuriya.replace('{name}', extractedName);
        jaunpuri = jaunpuri.replace('{name}', extractedName);
        kumaoni = kumaoni.replace('{name}', extractedName);
        jaunsari = jaunsari.replace('{name}', extractedName);
        garhwali = garhwali.replace('{name}', extractedName);
      }

      return {
        sourceText: text,
        sourceLang: sourceLangHint,
        standardGarhwaliDevanagari: garhwali,
        standardGarhwaliTransliteration: entry.garhwaliTranslit,
        dialects: {
          srinagariya,
          tehriyali,
          salani,
          badhani_chamoli: badhani,
          nagpuriya,
          jaunpuri_ravalti: jaunpuri,
          kumaoni,
          jaunsari,
        },
        transliterations: {
          srinagariya: transliterateDevanagari(srinagariya),
          tehriyali: transliterateDevanagari(tehriyali),
          salani: transliterateDevanagari(salani),
          badhani_chamoli: transliterateDevanagari(badhani),
          nagpuriya: transliterateDevanagari(nagpuriya),
          jaunpuri_ravalti: transliterateDevanagari(jaunpuri),
          kumaoni: entry.kumaoniTranslit || transliterateDevanagari(kumaoni),
          jaunsari: entry.jaunsariTranslit || transliterateDevanagari(jaunsari),
        },
        detectedRegister: 'संवादी एवं शिष्टाचार (Conversational & Courtesy)',
        retroflexAudit: [
          { word: 'गढ़वाळी', standard_spelling: 'गढ़वाळी', phonetic_rule: 'मूर्धन्य ळ का शास्त्रीय प्रयोग' },
        ],
        editorialHeadlines: {
          lead_headline: `${garhwali.slice(0, 45)}...`,
          kicker: 'क्षेत्रीय संवाद एवं लोकभाषा',
          subhead: 'साहित्यिक व प्रांतीय बोली रूप',
          feature_title: garhwali.slice(0, 30),
        },
        keyVocabulary: entry.vocab,
      };
    }
  }

  // 2. Full sentence token-level grammar translation
  const garhwaliTranslation = translateSentenceTokenByToken(text, 'garhwali');
  const kumaoniTranslation = translateSentenceTokenByToken(text, 'kumaoni');
  const jaunsariTranslation = translateSentenceTokenByToken(text, 'jaunsari');

  // Generate 6 valley dialect nuances for Garhwali
  const srinagariya = garhwaliTranslation;
  const tehriyali = garhwaliTranslation
    .replace(/जाणा छन/g, 'जाणा छा')
    .replace(/कख/g, 'कख')
    .replace(/मथै/g, 'मखि')
    .replace(/ब्वले जांद/g, 'ब्वले गै');
  const salani = garhwaliTranslation
    .replace(/छन/g, 'छां')
    .replace(/मथै/g, 'मि कन')
    .replace(/कख/g, 'कख जांद');
  const badhani = garhwaliTranslation
    .replace(/कख/g, 'कुथी')
    .replace(/छन/g, 'छौ')
    .replace(/मनखि/g, 'जन');
  const nagpuriya = garhwaliTranslation
    .replace(/छ/g, 'छै')
    .replace(/कख/g, 'कथै');
  const jaunpuri = garhwaliTranslation
    .replace(/कु /g, 'रो ')
    .replace(/का /g, 'रा ')
    .replace(/की /g, 'री ')
    .replace(/छ/g, 'सो')
    .replace(/छन/g, 'सा')
    .replace(/मथै/g, 'मोख');

  const dialects: TranslatedDialects = {
    srinagariya,
    tehriyali,
    salani,
    badhani_chamoli: badhani,
    nagpuriya,
    jaunpuri_ravalti: jaunpuri,
    kumaoni: kumaoniTranslation,
    jaunsari: jaunsariTranslation,
  };

  const transliterations = {
    srinagariya: transliterateDevanagari(srinagariya),
    tehriyali: transliterateDevanagari(tehriyali),
    salani: transliterateDevanagari(salani),
    badhani_chamoli: transliterateDevanagari(badhani),
    nagpuriya: transliterateDevanagari(nagpuriya),
    jaunpuri_ravalti: transliterateDevanagari(jaunpuri),
    kumaoni: transliterateDevanagari(kumaoniTranslation),
    jaunsari: transliterateDevanagari(jaunsariTranslation),
  };

  const retroflexAudit = [
    { word: 'गढ़वाळी', standard_spelling: 'गढ़वाळी', phonetic_rule: 'मूर्धन्य ळ का शास्त्रीय प्रयोग' },
    { word: 'पाणी / पाणि', standard_spelling: 'पाणी', phonetic_rule: 'ण का शुद्ध उच्चारण' },
    { word: 'सीतळ', standard_spelling: 'सीतळ', phonetic_rule: 'मूर्धन्य ळ युक्त अभिव्यक्ति' },
  ];

  const editorialHeadlines = {
    lead_headline: `${garhwaliTranslation.slice(0, 42)}...`,
    kicker: 'क्षेत्रीय भाषांतर एवं लोकसाहित्य',
    subhead: 'साहित्यिक एवं आंचलिक बोली संस्करण',
    feature_title: garhwaliTranslation.slice(0, 28),
  };

  return {
    sourceText: text,
    sourceLang: sourceLangHint,
    standardGarhwaliDevanagari: garhwaliTranslation,
    standardGarhwaliTransliteration: transliterateDevanagari(garhwaliTranslation),
    dialects,
    transliterations,
    detectedRegister: register,
    retroflexAudit,
    editorialHeadlines,
    keyVocabulary: [
      { term: 'गढ़वाळी (Garhwali)', meaning: 'उत्तराखंड की प्रमुख मध्य पहाड़ी भाषा' },
      { term: 'कुमाऊँनी (Kumaoni)', meaning: 'अल्मोड़ा-नैनीताल मध्य पहाड़ी भाषा (सहायक क्रिया: छू/छन)' },
      { term: 'जौनसारी (Jaunsari)', meaning: 'चक्राता जौनसार-बावर पश्चिमी पहाड़ी भाषा (सहायक क्रिया: सो/सा)' },
    ],
  };
}
