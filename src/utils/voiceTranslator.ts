import { DIALECTS } from '../data/garhwaliData';
import { translateLinguistically } from './pahariTranslatorEngine';

export type TargetLanguageType = 'garhwali' | 'kumaoni' | 'jaunsari';

export interface VoiceTranslationResult {
  sourceText: string;
  detectedSourceLang: string;
  targetLanguage: TargetLanguageType;
  targetLanguageName: string;
  targetDialect: string;
  dialectName: string;
  translatedText: string;
  garhwaliText: string;
  kumaoniText: string;
  jaunsariText: string;
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
  targetLanguage: TargetLanguageType = 'garhwali',
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
    translit =
      targetLanguage === 'kumaoni'
        ? 'Pailag / Namaskar! Tam kasa chha? Sab rajee-khusee chhoo na?'
        : targetLanguage === 'jaunsari'
        ? 'Pranaam / Jai Mahasu! Tumu kanak sa? Sab kushal-mangal so?'
        : 'Namaskar! Aap kanak chhan? Sab kushal-mangal ta chha?';
    vocab = [
      { term: 'कनक / कसा (Kanak / Kasa)', meaning: 'कैसे / How' },
      { term: 'छन / छा / सा (Chhan / Chha / Sa)', meaning: 'हैं / Are (Honorific auxiliary verb)' },
      { term: 'पैलाग (Pailag)', meaning: 'प्रणाम / Respectful Kumaoni greeting (touching feet)' },
      { term: 'तुमु (Tumu)', meaning: 'आप / You (Jaunsari honorific pronoun)' },
    ];
    note = 'Central & Western Pahari greeting: Srinagariya uses छन, Kumaoni uses कसा छा/छू, and Jaunsari uses तुमु कनक सा।';
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
    kumaoni = 'म्यकणि बाटो बताओ, तीर्थ जाणा को सीधो रस्तो काँ छू?';
    jaunsari = 'मोख बाटो बोलो, मंदिर जाणे रो सीधो बाटो कख सो?';
    translit =
      targetLanguage === 'kumaoni'
        ? 'Myakani bato batao, teerth jaana ko seedho rasto kaan chhoo?'
        : targetLanguage === 'jaunsari'
        ? 'Mokh bato bolo, mandir jaane ro seedho bato kakh so?'
        : 'Mathai bato batawa, Badrinath-Kedarnath jana ku seedho rasto katha chha?';
    vocab = [
      { term: 'बाटो / रस्तो (Bato / Rasto)', meaning: 'रास्ता या मार्ग / Trail or road' },
      { term: 'मथै / म्यकणि / मोख (Mathai / Myakani / Mokh)', meaning: 'मुझे / To me' },
      { term: 'कथ / काँ / कख (Katha / Kaan / Kakh)', meaning: 'कहाँ / Where' },
    ];
    note = 'Mountain wayfinding: Srinagariya "मथै ... कथ", Kumaoni "म्यकणि ... काँ", Jaunsari "मोख ... कख"';
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
    badhani = 'उच्च डांड्यों मा आज हिमाच्छादन छ अर सीतळ बयाळ चलणी छ।';
    nagpuriya = 'मंदाकिनी घाटी मा आज जाड़ो बढ़िग्युं छ अर बर्फ पड़णी छ।';
    jaunpuri = 'डांडे मा आज खूब सीत सो अर हिउँ पड़दो सो।';
    kumaoni = 'डाना-काना मा आज खूब जाड़ छू अर हिउँ पड़ण रौ। बयाळ लै चलणी छू।';
    jaunsari = 'डांडे मां आज घणो जाड़ो सो अर बर्फ गिरदी सी।';
    translit =
      targetLanguage === 'kumaoni'
        ? 'Daana-kaana ma aaj khoob jaad chhoo ar hiun padan rau. Bayaal lai chalni chhoo.'
        : targetLanguage === 'jaunsari'
        ? 'Daande maan aaj ghano jaado so ar barf girdy see.'
        : 'Danda-kanda ma aaj khoob thandi chha ar hiun padanoo chha. Bayaal bhee jor se chal-li chha.';
    vocab = [
      { term: 'डांडा / डाना (Danda / Daana)', meaning: 'पहाड़ / Mountain ridges' },
      { term: 'हिउँ (Hiun)', meaning: 'बर्फ या हिमपात / Snow' },
      { term: 'बयाळ (Bayaal)', meaning: 'पहाड़ी बयार / Mountain breeze' },
      { term: 'जाड़ / जाड़ो (Jaad / Jaado)', meaning: 'ठंड / Severe cold' },
    ];
    note = 'Mountain climate idioms with authentic regional lexicon: हिउँ (snow) and बयाळ (wind).';
  }
  // 4. Water / Spring / Naula / Village Life
  else if (
    lower.includes('water') ||
    lower.includes('spring') ||
    lower.includes('village') ||
    text.includes('पानी') ||
    text.includes('जल') ||
    text.includes('धारा') ||
    text.includes('गाँव') ||
    text.includes('नौला')
  ) {
    srinagariya = 'गाँव कु मीठो धारो अर नौळा कु निर्मळ सीतळ पाणी कख मिललू?';
    tehriyali = 'हमार गाँव मा मंगरो अर धारो कु बियाळ पाणी कख देखण मिललू?';
    salani = 'गाँव कु धारो कु पाणी भौत मीठो अर सीतळ छ।';
    badhani = 'पहाड़ी धारा कु अमृत तुल्य पाणी कख बटी आंद?';
    nagpuriya = 'गाँव का पंदेरा मा मीठो पाणी बग्गदो छ।';
    jaunpuri = 'गाँव रा पंदेरा रो निर्मळ पाणी कख मिलदो सो?';
    kumaoni = 'गाँवा नौला अर धारो को मीठ पाणी काँ मिलल? नौलो को पाणी भौत पवित्र छू।';
    jaunsari = 'गाँवे रा पंदेरा रो मीठो पाणी कख मिलदा सो?';
    translit =
      targetLanguage === 'kumaoni'
        ? 'Gaanwa naula ar dhaaro ko meeth paani kaan milal? Naulo ko paani bhaut pavitra chhoo.'
        : targetLanguage === 'jaunsari'
        ? 'Gaanwe ra pandera ro meetho paani kakh milda so?'
        : 'Gaanw ku meetho dhaaro ar naula ku nirmal seetal paani kakh milaloo?';
    vocab = [
      { term: 'नौळा / नौला (Naula)', meaning: 'प्राकृतिक पारंपरिक जलकुंड / Traditional aquifer' },
      { term: 'धारो / मंगरो (Dhaaro / Mangro)', meaning: 'प्राकृतिक जलधारा / Water stream' },
      { term: 'पंदेरा (Pandera)', meaning: 'गाँव का पानी भरने का स्थान / Village water source' },
    ];
    note = 'Historic Himalayan water architecture: Kumaoni traditional नौला (aquifer) and Garhwali धारो/मंगरो।';
  }
  // Default / Catch-all Conversational Pahari using linguistic translation engine
  else {
    const linguistic = translateLinguistically(text, sourceLang, 'Conversational');
    srinagariya = linguistic.dialects.srinagariya;
    tehriyali = linguistic.dialects.tehriyali;
    salani = linguistic.dialects.salani;
    badhani = linguistic.dialects.badhani_chamoli;
    nagpuriya = linguistic.dialects.nagpuriya;
    jaunpuri = linguistic.dialects.jaunpuri_ravalti;
    kumaoni = linguistic.dialects.kumaoni;
    jaunsari = linguistic.dialects.jaunsari;
    translit =
      targetLanguage === 'kumaoni'
        ? linguistic.transliterations.kumaoni
        : targetLanguage === 'jaunsari'
        ? linguistic.transliterations.jaunsari
        : linguistic.transliterations.srinagariya;
    vocab = linguistic.keyVocabulary;
    note = 'Authentic conversational Central & Western Pahari translation with verified grammar and auxiliary verb concordance.';
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
    kumaoni: 'कुमाऊँनी (Kumaoni)',
    jaunsari: 'जौनसारी (Jaunsari)',
  };

  // Determine active translatedText based on targetLanguage
  let translated = srinagariya;
  let langName = 'गढ़वाली (Garhwali)';

  if (targetLanguage === 'kumaoni') {
    translated = kumaoni;
    langName = 'कुमाऊँनी (Kumaoni)';
  } else if (targetLanguage === 'jaunsari') {
    translated = jaunsari;
    langName = 'जौनसारी (Jaunsari)';
  } else {
    translated = dialectMap[targetDialect] || srinagariya;
    langName = `गढ़वाली - ${dialectNames[targetDialect] || 'श्रीनगरिया'}`;
  }

  return {
    sourceText: text,
    detectedSourceLang: detectedLang,
    targetLanguage,
    targetLanguageName: langName,
    targetDialect,
    dialectName: dialectNames[targetDialect] || dialectNames.srinagariya,
    translatedText: translated,
    garhwaliText: dialectMap[targetDialect] || srinagariya,
    kumaoniText: kumaoni,
    jaunsariText: jaunsari,
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
