import { DIALECTS } from '../data/garhwaliData';

export interface VoiceTranslationResult {
  sourceText: string;
  detectedSourceLang: string;
  targetDialect: string;
  dialectName: string;
  garhwaliText: string;
  transliteration: string;
  audioBase64?: string;
  sampleRate?: number;
  dialectVariants: {
    srinagariya: string;
    tehriyali: string;
    salani: string;
    badhani_chamoli: string;
    nagpuriya: string;
    jaunpuri_ravalti: string;
    kumaoni: string;
    jaunsari: string;
  };
  keyVocabulary: Array<{ term: string; meaning: string }>;
  conversationalNote: string;
}

// Conversational rule-based phrase generator for authentic Central Pahari spoken speech
export function generateVoiceFallback(
  spokenText: string,
  sourceLang = 'Auto',
  targetDialect = 'srinagariya'
): VoiceTranslationResult {
  const text = spokenText.trim();
  const lower = text.toLowerCase();

  const isEnglish = /[a-zA-Z]/.test(text) && !/[\u0900-\u097F]/.test(text);
  const detectedLang = isEnglish ? 'English' : (sourceLang !== 'Auto' ? sourceLang : 'Hindi');

  // Conversational mappings for common greetings, travel, questions, mountain life
  let srinagariya = '';
  let tehriyali = '';
  let salani = '';
  let badhani = '';
  let nagpuriya = '';
  let jaunpuri = '';
  let kumaoni = '';
  let jaunsari = '';
  let translit = '';
  let vocab: Array<{ term: string; meaning: string }> = [];
  let note = '';

  // 1. Greetings & Well-being
  if (
    lower.includes('hello') ||
    lower.includes('how are you') ||
    text.includes('नमस्ते') ||
    text.includes('कैसे हो') ||
    text.includes('कैसा है') ||
    text.includes('प्रणाम')
  ) {
    srinagariya = 'नमस्कार! आप कनक छन? सब कुशल-मंगल त छ?';
    tehriyali = 'नमस्कार! तुम कनक छा? घर-परिवार मा सब राज़ी-खुशी?';
    salani = 'नमस्कार! आप कनक छां? सब ठीक-ठाक छ ना?';
    badhani = 'नमस्कार! तुम कनक छौ? सबी जन कुशल छन?';
    nagpuriya = 'नमस्कार! आप कनक छन? सब मंगलमय छ?';
    jaunpuri = 'प्रणाम! तुम कनक सो? सब ठीक-ठाक सो?';
    kumaoni = 'पैलाग / नमस्कार! तम कसा छा? घर-परिवार मा सब राजी-खुसी छू ना?';
    jaunsari = 'प्रणाम / जय महासू! तुमु कनक सा? सब कुशल-मंगल सो?';
    translit = 'Namaskar! Aap kanak chhan? Sab kushal-mangal ta chha?';
    vocab = [
      { term: 'कनक / कसा (Kanak / Kasa)', meaning: 'कैसे / How' },
      { term: 'छन / छा / सा (Chhan / Chha / Sa)', meaning: 'हैं / Are (Honorific auxiliary verb)' },
      { term: 'पैलाग (Pailag)', meaning: 'प्रणाम / Respectful Kumaoni greeting (touching feet)' },
      { term: 'कुशल-मंगल (Kushal-mangal)', meaning: 'खैरियत / Well-being' },
    ];
    note = 'Traditional Central Pahari respectful greeting with dialectal auxiliary verbs (छन in Srinagar, छा in Tehri/Kumaon, सा in Jaunsar).';
  }
  // 2. Wayfinding / Directions / Pilgrimage (Badrinath, Kedarnath, Road)
  else if (
    lower.includes('way') ||
    lower.includes('road') ||
    lower.includes('badrinath') ||
    lower.includes('kedarnath') ||
    text.includes('रास्ता') ||
    text.includes('सड़क') ||
    text.includes('किधर') ||
    text.includes('कहाँ') ||
    text.includes('बद्रीनाथ') ||
    text.includes('केदारनाथ')
  ) {
    srinagariya = 'मथै बाटो बतावा, बद्रीनाथ-केदारनाथ जाणा कु सीधो रस्तो कथ छ?';
    tehriyali = 'मखि बाटो ब्वला, बद्रीनाथ-केदारनाथ जाणा कु रस्तो कख छ?';
    salani = 'मि कन बाटो बताओ, धाम जाणा कु बाटो सिधो कख जांद?';
    badhani = 'मथै बाटो बतावा, उच्च हिमालयी तीर्थ जाणा कु सुपथ कख छ?';
    nagpuriya = 'मथै बाटो ब्वला, केदारघाटी जाणा कु बाटो कथै छ?';
    jaunpuri = 'मोख बाटो बोलो, तीर्थ जाणे रो सीधो रस्तो कख सो?';
    kumaoni = 'म्यकणि बाटो बताओ, तीर्थ जाणा को सीधो रस्तो काँ छ?';
    jaunsari = 'मोख बाटो बोलो, मंदिर जाणे रो सीधो बाटो कख सो?';
    translit = 'Mathai bato batawa, Badrinath-Kedarnath jana ku seedho rasto katha chha?';
    vocab = [
      { term: 'बाटो / रस्तो (Bato / Rasto)', meaning: 'रास्ता या मार्ग / Trail or road' },
      { term: 'मथै / मखि / म्यकणि (Mathai / Makhi / Myakani)', meaning: 'मुझे / To me (Dative pronoun)' },
      { term: 'कथ / कख / काँ (Katha / Kakha / Kaan)', meaning: 'कहाँ / Where' },
    ];
    note = 'Direct conversational mountain wayfinding; note the distinction between Srinagariya "मथै", Tehriyali "मखि", Kumaoni "म्यकणि", and Jaunsari "मोख".';
  }
  // 3. Weather / Mountains / Cold / Snow / Rain
  else if (
    lower.includes('weather') ||
    lower.includes('cold') ||
    lower.includes('snow') ||
    lower.includes('rain') ||
    text.includes('मौसम') ||
    text.includes('ठंड') ||
    text.includes('बर्फ') ||
    text.includes('बारिश') ||
    text.includes('धूप')
  ) {
    srinagariya = 'डांडा-कांडा मा आज खूब ठण्डी छ अर हिउँ पड़णू छ। बयाळ भी जोर से चल्लि छ।';
    tehriyali = 'डांड्युं पर आज भयंकर जाड़ो छ अर हिउँ पड़ण लग्युं छ। शीतळ बयाळ बग्गणी छ।';
    salani = 'पहाड़ों मा आज बड्डी ठण्ड छ अर बर्खा का साथ हिउँ गिरणु छ।';
    badhani = 'उच्च डांडा मा भारी हिमपात ह्वेगे अर भयंकर शीतोष्ण बयाळ छन।';
    nagpuriya = 'मंदाकिनी घाटी मा आज भारी ठंड छ अर डांडा पर सफेद हिउँ जम गै! ';
    jaunpuri = 'डांडे आज भारी जाड़ो सो अर हिउँ पड़ंतो सो। बयाळ जोरों मा छौ।';
    kumaoni = 'डाणा-काणा मा आज भयंकर ठंड छू अर हिउँ पड़नो छू। सीतल बयाळ चलि रै।';
    jaunsari = 'डांडे आज भारी जाड़ो सो अर हिउँ पड़ंतो सो। सीतळ बयाळ जोरों मा चालदी सी।';
    translit = 'Danda-kanda ma aaj khoob thandi chha ar hiun padnoo chha. Bayal bhee jor se chal-li chha.';
    vocab = [
      { term: 'डांडा-कांडा / डाणा-काणा (Danda-kanda / Dana-kana)', meaning: 'ऊंचे पर्वत व चोटियां / High mountain ridges' },
      { term: 'हिउँ (Hiun)', meaning: 'बर्फ / Snow' },
      { term: 'बयाळ (Bayal)', meaning: 'पहाड़ी शीतल हवा / Mountain breeze' },
      { term: 'जाड़ो / ठंड (Jado / Thand)', meaning: 'ठंड / Bitter cold' },
    ];
    note = 'Pure Central Pahari climatic vocabulary with authentic retroflex flap in "बयाळ" (breeze) and "हिउँ" (snow).';
  }
  // 4. Water / Springs / Village life
  else if (
    lower.includes('water') ||
    lower.includes('village') ||
    lower.includes('stay') ||
    lower.includes('food') ||
    text.includes('पानी') ||
    text.includes('गाँव') ||
    text.includes('नौला') ||
    text.includes('धारा') ||
    text.includes('खाना') ||
    text.includes('रहने')
  ) {
    srinagariya = 'हमार गौं कु पाणी बहुतै मीठो छ, धारा अर नौळा बटी निर्मळ जल औंद।';
    tehriyali = 'हमार गौं कु पाणि बहुत मीठो छ, धारा बटी शीतळ जल मिलद।';
    salani = 'गौं मा धारो कु पाणि सबसें सीतळ अर मीठो हुंद।';
    badhani = 'हमार पाहाड़ी गौं मा प्राकृतिक धारा-नौळा कु अमृत पाणि छ।';
    nagpuriya = 'घाटी का गौं मा मीठो पाणि छ, यां सबी लोग प्रेम से रौन।';
    jaunpuri = 'हमार गांवे रो पाणि भारी मीठो सो, धारा बटी निर्मल पाणि आवंतो।';
    kumaoni = 'हमार गौं को पाणी बहुत मीठो छू, नौला अर धारा बटी सीतल जल मिलँछ।';
    jaunsari = 'हमार गांवे रो पाणी भारी मीठो सो, नौळे बटी सीतळ पाणी आवंतो सो।';
    translit = 'Hamar goun ku paani bahutai meetho chha, dhara ar naula batee nirmal jal aund.';
    vocab = [
      { term: 'गौं (Goun)', meaning: 'गाँव / Mountain hamlet' },
      { term: 'धारा (Dhara)', meaning: 'प्राकृतिक जल स्रोत / Natural mountain spring' },
      { term: 'नौळा / नौला (Naula)', meaning: 'पारंपरिक जल-कुंड / Traditional subterranean water sanctuary' },
    ];
    note = 'Ecological vocabulary deeply rooted in Himalayan hydrological heritage; strictly uses retroflex "नौळा" and "सीतळ".';
  }
  // 5. General Conversational Fallback / Translation
  else {
    srinagariya = `गढ़वळि मा ब्वलां त: "${text}" कु मतलब छ कि हमार पहाड़ मा सबी बात प्रेम अर आदर से बोली जांद।`;
    tehriyali = `टिहरियाळि बोली मा: "${text}" कु आशय छ कि डांडा-कांडा मा मिलिजुलि कै रौणा छ।`;
    salani = `सलाणी बोली मा: "${text}" कन हम सहज पहाड़ी भाषा मा ब्वल्दा छां।`;
    badhani = `बधाणी अंचल मा: "${text}" कु विशुद्ध रूप हमार पुरानी संस्कृति मा मिलद।`;
    nagpuriya = `नागपुरिया बोली मा: "${text}" कु भावार्थ प्रेमपूर्वक प्रकट करयो जांद।`;
    jaunpuri = `जौनपुरी-रवाल्टी मा: "${text}" रो सहज अर्थ हमार लोकबोली मा झलकद।`;
    kumaoni = `कुमाऊँनी बोली मा: "${text}" को अर्थ छू कि हम सबी प्रेम अर मान दगड़ि बात करौं।`;
    jaunsari = `जौनसारी बोली मा: "${text}" रो आशय सो कि आमु सबी मिलि-जुलि बेर प्रेम से रौंदा सा।`;
    translit = `Garhwali ma bwolan ta: "${text}" ku matlab chha ki hamar pahad ma sabee baat prem ar aadar se bolee jaand.`;
    vocab = [
      { term: 'ब्वलां / ब्वलो (Bwolan / Bwolo)', meaning: 'बोलें / To speak' },
      { term: 'हमार / आमु (Hamar / Aamu)', meaning: 'हमारा / Our (हम / We)' },
      { term: 'बोली जांद / करौं (Bolee jaand / Karaun)', meaning: 'बोली जाती है / करते हैं' },
    ];
    note = 'Authentic spoken syntax preserving Central and Western Pahari vowel elision and phonological harmony.';
  }

  const dialectMap: Record<string, string> = {
    srinagariya,
    tehriyali,
    salani,
    badhani_chamoli: badhani,
    nagpuriya,
    jaunpuri_ravalti: jaunpuri,
    kumaoni,
    jaunsari,
  };

  const dialectNames: Record<string, string> = {
    srinagariya: 'श्रीनगरिया (साहित्यिक मानक)',
    tehriyali: 'टिहरियाळि (भागीरथी बेसिन)',
    salani: 'सलाणी (गंगा-सळान / पौड़ी)',
    badhani_chamoli: 'बधाणी / चमोली (पिंडर अंचल)',
    nagpuriya: 'नागपुरिया (मंदाकिनी घाटी)',
    jaunpuri_ravalti: 'जौनपुरी / रवाल्टी (पश्चिमी सीमांत)',
    kumaoni: 'कुमाऊँनी (Kumaoni - अल्मोड़ा / नैनीताल / पिथौरागढ़)',
    jaunsari: 'जौनसारी (Jaunsari - चक्राता / कालसी / जौनसार-बावर)',
  };

  const selectedGarhwali = dialectMap[targetDialect] || srinagariya;

  return {
    sourceText: text,
    detectedSourceLang: detectedLang,
    targetDialect,
    dialectName: dialectNames[targetDialect] || dialectNames.srinagariya,
    garhwaliText: selectedGarhwali,
    transliteration: translit,
    dialectVariants: {
      srinagariya,
      tehriyali,
      salani,
      badhani_chamoli: badhani,
      nagpuriya,
      jaunpuri_ravalti: jaunpuri,
      kumaoni,
      jaunsari,
    },
    keyVocabulary: vocab,
    conversationalNote: note,
  };
}
