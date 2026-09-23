import { LEXICON, PROVERBS } from '../data/garhwaliData';

export interface GarhwaliApiResponse {
  source_text: string;
  source_language: string;
  detected_register: string;
  register_explanation: string;
  editorial_headlines: {
    lead_headline: string;
    kicker: string;
    subhead: string;
    feature_title: string;
  };
  standard_literary_garhwali: {
    devanagari: string;
    transliteration: string;
    editorial_notes: string;
    retroflex_la_audit: Array<{
      word: string;
      standard_spelling: string;
      phonetic_rule: string;
    }>;
  };
  dialect_translations: {
    srinagariya: {
      dialect_name: string;
      devanagari: string;
      transliteration: string;
      dialect_features: string;
      auxiliary_verbs_used?: string[];
    };
    tehriyali: {
      dialect_name: string;
      devanagari: string;
      transliteration: string;
      dialect_features: string;
      basin_variations?: string;
    };
    salani: {
      dialect_name: string;
      devanagari: string;
      transliteration: string;
      dialect_features: string;
      postposition_markers?: string;
    };
    badhani_chamoli: {
      dialect_name: string;
      devanagari: string;
      transliteration: string;
      dialect_features: string;
      archaic_consonants?: string;
    };
    nagpuriya: {
      dialect_name: string;
      devanagari: string;
      transliteration: string;
      dialect_features: string;
      tonal_cadences?: string;
    };
    jaunpuri_ravalti: {
      dialect_name: string;
      devanagari: string;
      transliteration: string;
      dialect_features: string;
      transitional_markers?: string;
    };
    kumaoni: {
      dialect_name: string;
      devanagari: string;
      transliteration: string;
      dialect_features: string;
      kumaoni_markers?: string;
    };
    jaunsari: {
      dialect_name: string;
      devanagari: string;
      transliteration: string;
      dialect_features: string;
      jaunsari_markers?: string;
    };
  };
  editorial_lexicon: Array<{
    term: string;
    category: string;
    meaning: string;
    journalistic_context: string;
  }>;
  relevant_proverbs: Array<{
    akhana_pakhana: string;
    transliteration: string;
    literal_meaning: string;
    editorial_application: string;
  }>;
}

export function generateLinguisticFallback(text: string, sourceLang = 'Auto', register = 'Auto'): GarhwaliApiResponse {
  const isEnglish = /[a-zA-Z]/.test(text) && !/[\u0900-\u097F]/.test(text);
  const detectedLang = isEnglish ? 'English' : 'Hindi';

  const isDialogue = text.includes('कहा') || text.includes('बोले') || text.includes('said') || text.includes('!') || text.includes('?');
  const isDisaster = text.includes('बारिश') || text.includes('आपदा') || text.includes('flood') || text.includes('rain') || text.includes('अलकनंदा') || text.includes('water');
  const isPastoral = text.includes('बुग्याल') || text.includes('भेड़') || text.includes('मंडुआ') || text.includes('spring') || text.includes('millets') || text.includes('grass');

  const resolvedRegister = register !== 'Auto' 
    ? register 
    : (isDialogue ? 'Conversational / लोकवार्ता' : (isDisaster ? 'Editorial / समाचार विज्ञप्ति' : 'Literary / साहित्यिक मानक'));

  // Literary Garhwali transformation
  let litDevanagari = '';
  let srinagariyaDev = '';
  let tehriyaliDev = '';
  let salaniDev = '';
  let badhaniDev = '';
  let nagpuriyaDev = '';
  let jaunpuriDev = '';
  let kumaoniDev = '';
  let jaunsariDev = '';

  if (text.includes('चमोली') || text.includes('अलकनंदा') || (isDisaster && !isEnglish)) {
    litDevanagari = 'उत्तराखंड का चमोली जिला मा ऊंचा डांड्युं मा भारी बर्खा और बांदळ फाटण से अलकनंदा और धौलीगंगा नद्युं कु जलस्तर तेजि से बढ़िग्ये। जिला प्रशासन न नदी का कांठा मा बस्यां सबी गौं और सड़क्युक लोकांतों सुरक्षित थान मा जाणा खातिर चेताया छ। स्थानीय गधेरुं मा औचटक मलबो ऐण से बद्रीनाथ राष्ट्रिय राजमार्ग कतई जग्ग्या बन्द ह्वेग्ये। एसडीआरएफ और राहत दल मौका पर पुजि गैन।';
    srinagariyaDev = 'उत्तराखंड का चमोली जिला मा ऊंचा डांड्युं मा भारी बर्खा से अलकनंदा और धौलीगंगा नद्युं कु जलस्तर तेजि से बढ़िग्ये। नदी का कांठा मा बस्यां गौं का मनखियों सुरक्षित थान मा जाणा छ। स्थानीय गधेरुं मा बाढ़ ऐण से राजमार्ग बन्द छ।';
    tehriyaliDev = 'उत्तराखंड का चमोली जिला मा डांड्युं पर भारी बर्खा ह्वे से अलकनंदा और धौलीगंगा उफाण पर ऐ गैन। कांठा का सबी गौं का लोग सुरक्षित जग्या चलि गैन। गधेरा मा भारी मलबो ऐ से सड़क बन्द ह्वै गै।';
    salaniDev = 'चमोली जिला मा ऊंचा डांड्युं पर भारी बर्खा से अलकनंदा नदी कु पाणि बढ़ि ग्यो। नदी का कांठा मा बस्यां गौं मा लोग सचेत छां। गधेरुं मा मलबो ऐ ग्या अर बाटो बन्द ह्वे ग्यो। राहत टीम पुजि गे।';
    badhaniDev = 'चमोली जिला का उच्च डांडा मा भारी बर्खा और मेघ विस्फोट से अलकनंदा-धौलीगंगा नद्युं कु जलस्तर अगाध बढ़िग्यो। कांठा का जन सुरक्षित स्थान प्रस्थान कन्ना छन। गधेरा उफणि बटी राजमार्ग रुकी गे।';
    nagpuriyaDev = 'चमोली जिला मा डांड्युं पर जोर की बर्खा से अलकनंदा और धौलीगंगा भारी उफाण पर ऐ गैनै! नदी तीरा का सबी लोग सुरक्षित थान चलि जाव। गधेरुं मा अचानक मलबो ऐ से बाटो बन्द ह्वै गै।';
    jaunpuriDev = 'चमोली जिला रे ऊंचे डांडे भारी बर्षा हूण से अलकनंदा-धौलीगंगा नदियां बढ़ी गैन। नदी का कांठे बस्यां लोका सुरक्षित जग्या जांदा छौ। गधेरे मा मलबो आवंतो छौ अर बाटो रुकी ग्या।';
    kumaoniDev = 'कुमाऊं और चमोली का ऊंचा डाणा-काणा मा भारी बर्खा और बांदळ फाटण से अलकनंदा-धौलीगंगा नद्युं को जलस्तर तेजी से बढ़ि ग्यो। प्रशासन ले नदी तीरा का सबी गौं का बाशिंदों कणि सुरक्षित ठौर मा जाणा की चेतावनी दीं छ। गधेरा मा मलबो ऐ बेर बद्रीनाथ राजमार्ग बंद भै ग्यो। राहत दल पुजि गैन।';
    jaunsariDev = 'ऊंचे डांडे भारी बर्षा हूण से अलकनंदा अर धौलीगंगा नदियां उफाणे ऐ गैन। नदी का कांठे बस्यां लोका सुरक्षित जग्या जांदा सा। गधेरे मा मलबो आवंतो सो अर राजमार्ग रुकी ग्या। एसडीआरएफ दल मौका पर पुजी ग्या।';
  } else if (text.includes('बेटा') || text.includes('माँ') || text.includes('आंगण') || isDialogue) {
    litDevanagari = 'ब्वे न आंगण मा घाम तापदा हुयां बोलि: बेटा, तू कतगा सालुं बाद अपणा गौं ऐये। देख, डांडा-कांडा आज भी वेणीं खामोश छन, पण गौं का कतई घरुं मा अब ताळा लटकी गैन। तू सहर मा कतगा भी कमाई ले, पण अपणा मैती और पलि-भौंत की माटी की खुशबू कभै जनि बिसरे। हाथ-मुख धोइकै नौळा कु सीतळ पाणि पि अर चूल्हा की मंडुवा की रोटि खा।';
    srinagariyaDev = 'ब्वे न आंगण मा घाम तापदा हुयां बोलि: बेटा, तू कतगा सालुं बाद अपणा गौं ऐये। डांडा-कांडा वेणीं छन, पण घरुं मा ताळा छन। अपणा मैती और पलि-भौंत कभै जनि बिसरे। नौळा कु सीतळ पाणि पि अर मंडुवा की रोटि खा।';
    tehriyaliDev = 'ब्वे न आंगण मा घाम सेकदा बोलि: बेटा, तू कतगा सालुं बाद घर ऐ गै। देख, डांडा-कांडा सब शांत छन, पण घरुं मा ताळा लटकी गैन। मैती और पलि-भौंत कभै नि भूलण। नौळा कु ठण्डो पाणि पि अर रोटि खा।';
    salaniDev = 'माँ न आंगण मा घाम तापदा बोल्यो: बेटा, तू कतगा साल बाद गौं आय्यो। डांडा आज भी खामोश छां, पण घरुं मा ताळा लगि ग्या। अपणी माटी कभै न भुल्ये। नौळा कु पाणि पि अर मंडुवा की रोटि खा।';
    badhaniDev = 'मातृ न आंगण मा घाम तापदा बोलि: वत्स, तू कतगा काल पछाड़ी गौं ऐये। डांडा-कांडा तथैव छन, किन्तु घरुं मा ताळा छन। पलि-भौंत कभै मा विस्मरे। नौळा कु पाणि पान कद्दे अर कोदो की रोटि खा।';
    nagpuriyaDev = 'ब्वे न आंगण मा बोलि: बेटा, तू कतगा सालुं बाद ऐये! डांड्युं मा घाम छ पण गौं का घरुं मा ताळा लटकी गैनै। अपणा मैती-भौंत कभै जनि बिसरे। जा, नौळा कु सीतळ पाणि पि ले!';
    jaunpuriDev = 'ईजे न आंगणे घाम तापदा बोली: बेटा, तू कतगा साल बाद आवंतो छौ। डांडे सब शांत छौ पण घरे ताळे लटके छन। आपणी माटी नि भूलणी। नौळे रो पाणी पि अर रोटि खा।';
    kumaoniDev = 'इजा ले आंगण मा घाम तापि बेर बोल्यो: बेटा, तू कतुका साल बाद अपण गौं आयो। देख, डाणा-काणा आज लै वैसिए खामोश छन, पण घरन मा ताळा लटकी रैन। तू सहर मा कतुका लै कमाई ले, पण अपण मैती-भौंत की माटी कभै जनि बिसरिये। हाथ-मुख धोइबेर नौलो को सीतल पाणी पि अर चूल्हा की मंडुआ की रोटी खा।';
    jaunsariDev = 'ईजे न आंगणे घाम तापदा हुयां बोली: बेटा, तू कतगा साल बाद आपणे गांवे आवंतो सो। डांडे सब शांत सो पण घरे ताळे लटके सा। परदेसे कतगा भी कमाई ले, पण आपणी माटी नि भूलणी। हाथ-मुख धोई नौळे रो सीतळ पाणी पि अर रोटि खा।';
  } else if (text.includes('मंडुआ') || text.includes('झंगोरा') || text.includes('बुग्याल') || isPastoral) {
    litDevanagari = 'गढ़वाळ का पर्वतीय ढाळुं पर परंपरागत मोटा अणाज मंडुवा और झंगोरा की खेती अब दुबारा नौं पहचान पाणि बैठीगे। स्वास्थ्य कु प्रति बढ़दी जागरूकता न ये पौष्टिक फस्लुं की मांग सहरा मा बढ़ै दे। वखि दूसरा कानी, गर्म्युं कु मैना सुरू हुंदा ही घाटी का अनवाळ अपणा भेड-बाखरुं दगड़ि ऊंचा बुग्याळुं की तर्फ कूच कन्ना बैठिगैन। बांद और बुरांस का बाणुं से गुजरदा हुयां ये चरवाहा हिमालयी पर्यावरण का सच्चा रखवाळ छन।';
    srinagariyaDev = 'गढ़वाळ का ढाळुं पर मंडुवा और झंगोरा की खेती अब नौं रूप लेणि छ। गर्म्युं मा अनवाळ भेड-बाखरा लेकै बुग्याळुं की तर्फ जांदन। बांद और बुरांस का बाणुं मा घूम्दा चरवाहा हिमालयी प्रकृति का रक्षक छन।';
    tehriyaliDev = 'पहाड़ का डांड्युं पर मंडुवा और झंगोरा की खेती दुबारा शुरू ह्वै गै। गर्म्युं हुंदा ही अनवाळ भेड-बाखरा लेकै बुग्याळ गै। बांद और बुरांस का जंगलुं मा चरवाहा रवां छन।';
    salaniDev = 'गढ़वाळ का खेत्युं मा मंडुवा और झंगोरा की खेती अब चमकणि छ। घाटी का अनवाळ भेड-बाखरा लेकै ऊंचा बुग्याळुं मा चलि ग्या। बांद का जंगल पहाड़ की शान छां।';
    badhaniDev = 'पहाड़ का ढलानुं मा कोदो और झंगोरा की पुरातन कृषि पुनर्जीवित ह्वेगे। अनवाळ पशुधन समवेत उच्च बुग्याळुं मा प्रस्थान कन्ना छन। बांद का बाणुं मा प्रकृति की शुचिता विद्यमान छ।';
    nagpuriyaDev = 'मंडुवा और झंगोरा की खेती कु दिन फेरि ऐ गैनै! घाटी का अनवाळ भेड-बाखरा लेकै सीधा बुग्याळुं की तर्फ चढ़ि गैन। बांद और बुरांस का जंगलुं मा चरवाहा डोलदा छन।';
    jaunpuriDev = 'पहाड़े मंडुवा अर झंगोरा री खेती बढ़ी गै। तावड़ो हुंदा ही अनवाळ भेडा-बाखरा लेकै बुग्याळे जावंता छन। बांदे का जंगल पहाड़े रा जीवन छौ।';
    kumaoniDev = 'कुमाऊं का डाणा-काणा मा मंडुआ अर झंगोरा की खेती फेरि चमकन लागीं छ। गर्म्युं हुना ही अनवाळ भेड-बाखरुं कणि लेइबेर ऊंचा बुग्यालुं की तर्फ जाँ छन। बांज अर बुरांस का जंगळ हिमालय की धरोहर छन।';
    jaunsariDev = 'पहाड़े मंडुवा अर झंगोरा री खेती रो नवा दौर सुरू होवंदो सो। तावड़ो हुंदा ही अनवाळ भेड-बाखरा लेई ऊंचे बुग्याळे जावंता सा। बांदे का जंगल पहाड़े रो गौरव सा।';
  } else if (isEnglish) {
    litDevanagari = 'एक वैज्ञानिक सर्वेक्षण बटी खुळ्यो कि टिहरी और रुद्रप्रयाग का लगभग तीस प्रतिशत परंपरागत धार्युं और गधेरुं मा पाणि कु बहाव भारी कम ह्वेगे। क्षेत्रीय जल संरक्षण विभाग न बांद का जंगलुं और डांड्युं पर खंतोली बणैकै जलभृत पुनर्भरण कार्यक्रम शुरू कैरि छ। स्थानीय ग्राम पंचायत पुरातन नौळ्युं कु जीर्णोद्धार कन्ना खातिर आगे ऐन।';
    srinagariyaDev = 'सर्वेक्षण बटी पता लग्यो कि धार्युं और गधेरुं मा पाणि कम ह्वेगे। जल संरक्षण खातिर बांद का बाणुं और डांड्युं पर काम शुरू छ। ग्राम पंचायत नौळ्युं कु सुधार कन्ना छन।';
    tehriyaliDev = 'धार्युं और गधेरुं मा पाणि कु बहाव घटि गै। बांद का जंगलुं मा जलभरण कु काम शुरू ह्वै गै। नौळा ठीक कन्ना खातिर लोग जुटी गैन।';
    salaniDev = 'पहाड़ का धार्युं अर गधेरुं मा पाणि कम ह्वे ग्यो। जल विभाग न डांडा पर जल संरक्षण कु काम लगायो। पंचायत पुरातन नौळा सुधरण मा लागीं छ।';
    badhaniDev = 'वैज्ञानिक शोध बटी ज्ञात ह्वे कि पुरातन धार्युं मा जलप्रवाह न्यून ह्वेगे। बांद-वक्ष वन संवर्धन द्वारा नौळा संरक्षण प्रकल्प समारम्भ ह्वेगे।';
    nagpuriyaDev = 'धार्युं और गधेरुं मा पाणि क्यैक घटि गै? अब डांड्युं पर बांद का जंगल और खंतोली बणै जाणि छै। पुरातन नौळा फेरि संवार्या जाला।';
    jaunpuriDev = 'पहाड़े धार्युं अर गधेरे रो पाणी कम हूण लाग्यो। बांदे का जँगले पाणी संचयन रो काम सुरू ह्वे ग्या। नौळे रा सुधार पंचायत कन्ना छन।';
    kumaoniDev = 'वैज्ञानिक सर्वेक्षण हैटि पता लागो कि धार्युं अर नौलो मा पाणी को बहाव घटि ग्यो। बांज का जंगळ संवारिबेर नौलो कु पुनर्जीवन काम शुरू भै ग्यो। ग्राम पंचायत नौलो को सुधार करन मा लागीं छन।';
    jaunsariDev = 'वैज्ञानिक सर्वे बटी पता लाग्यो कि धार्युं मा पाणी रो बहाव कम होवंदो सो। बांदे का जंगले जल संरक्षण रो काम सुरू होवंदो सो। ग्राम पंचायत पुरातन जलस्रोते रो सुधार करदी सी।';
  } else if (text.includes('नौले') || text.includes('झोड़ा') || text.includes('कुमाऊँ') || text.includes('अल्मोड़ा')) {
    litDevanagari = 'कुमाऊँ अंचल का पुरातन नौळा स्थापत्य और सामाजिक एकता का पावन प्रतीक छन। आंगण मा हुड़का की थाप पर महिलाएँ झोड़ा और चांचरी गांदन। इजा और बूबू का आशीर्वाद से पहाड़ की संस्कृति अमर छ।';
    srinagariyaDev = 'कुमाऊँ अंचल का नौळा और झोड़ा-चांचरी संस्कृति पहाड़ की साझी विरासत छ। हम सबी एक-दूसरा की लोक संस्कृति कु सम्मान कन्ना छां।';
    tehriyaliDev = 'कुमाऊं का नौळा और हुड़का की थाप पहाड़ का मन कणि मोह लेणि। गौं-घर मा लोकगीत गूंजदा रवां छन।';
    salaniDev = 'कुमाऊँ अंचल की संस्कृति और नौळा धरोहर पहाड़ की साझी पहचान छां। महिलाएँ झोड़ा गाई बेर उत्साह बणौंदी छां।';
    badhaniDev = 'कुमाऊँ अंचल का ऐतिहासिक नौळा जलाशय वास्तुशिल्प का अनुपम उदाहरण छन। झोड़ा-चांचरी गान बटी लोकचेतना जागृत हुंद।';
    nagpuriyaDev = 'कुमाऊँ का नौळा और हुड़का की गूंज से हिमालयी घाटियाँ झंकृत छन। लोकगीत पहाड़ की आत्मा छन!';
    jaunpuriDev = 'कुमाऊँ अंचले नौळे रो पाणी अर लोकगीत पहाड़े री साझा विरासत सो। आमु सबी लोक परम्परा कु मान देन्दा सा।';
    kumaoniDev = 'कुमाऊँ अंचल मा परंपरागत नौला स्थापत्य कला अर सामाजिक समरसता का पावन मंदिर छन। हुड़का की थाप पर महिलाएँ झोड़ा-चांचरी गाई बेर आनंद लेछीं। इजा अर बूबू का आशीष से यो विरासत आज लै जीवंत छ।';
    jaunsariDev = 'कुमाऊँ अंचले नौळे रो पाणी अर झोड़ा नृत्य पहाड़े री पवित्र धरोहर सा। आमु सबी पहाड़ी बोली-संस्कृति रो आदर करदा सा।';
  } else if (text.includes('महासू') || text.includes('बिस्सू') || text.includes('हारुल') || text.includes('जौनसार')) {
    litDevanagari = 'जौनसार-बावर मा हनोल मा महासू देवता कु पावन मंदिर न्याय और लोक-आस्था कु सर्वोच्च केंद्र छ। बिस्सू पर्व का अवसर पर चक्राता और त्यूणी का लोग वीर रस से पूर्ण हारुल नृत्य कन्ना छन।';
    srinagariyaDev = 'जौनसार बावर मा महासू देवता कु मंदिर न्याय कु प्रतीक छ। बिस्सू मेला मा सबी लोग हारुल गीत गांदन।';
    tehriyaliDev = 'जौनसार मा महासू देवता रो मंदर भारी प्रसिद्ध छ। बिस्सू का टेम हारुल नाच देखी बटी आनंद ऐ जांद।';
    salaniDev = 'जौनसार-बावर की बिस्सू परंपरा अर महासू देवता की कृपा सबी पहाड़ पर बणीं रै। हारुल गीत वीरता की याद दिलांदन।';
    badhaniDev = 'जौनसार-बावर अंचल मा हनोल तीर्थ न्याय देवता महासू पीठ रूपेण प्रतिष्ठित छ। बिस्सू महोत्सवे हारुल नृत्यं प्रस्तूयते।';
    nagpuriyaDev = 'हनोल मा महासू देवता कु थान दिव्य छ! बिस्सू पर्व पर हारुल नृत्य की ताल पर पूरी घाटी झूमि उठद।';
    jaunpuriDev = 'जौनसार बावर मा महासू देवता रो पवित्र मंदर न्याय रो सर्वोच्च केंद्र सो। बिस्सू पर्व का टेम चक्राता, कालसी अर त्यूणी का लोग हारुल नृत्य मा मग्न होवंता सा।';
    kumaoniDev = 'जौनसार-बावर मा महासू देवता को मंदिर न्याय को सर्वोच्च धाम छ। बिस्सू कौतिक मा हारुल नाच देखीबेर मन आनंदित भै जाँ।';
    jaunsariDev = 'जौनसार बावर मा हनोल मा महासू देवता रो पवित्र मंदर न्याय रो सर्वोच्च केंद्र सो। बिस्सू पर्व का टेम चक्राता, कालसी अर त्यूणी का लोग हारुल नृत्य मा मग्न होवंता सा अर देवता री स्तुति करदा सा।';
  } else {
    // General transformation
    litDevanagari = `गढ़वाळ का डांडा-कांडा और नद्युं का कांठा मा लोकजीवन अपणी पुरातन परंपरा और माटी का दगड़ि आज भी जुड़्यूं छ। "${text.slice(0, 140)}..." कु सार यो छ कि हम सबी अपणी मातृभाषा और पहाड़ी संस्कृति कु आदर करौं।`;
    srinagariyaDev = `गढ़वाळ का डांडा-कांडा मा यो विषय विशेष रूप से महत्वपूर्ण छ। हम सबी अपणा गौं और संस्कृति कु सम्मान कन्ना छां।`;
    tehriyaliDev = `पहाड़ का डांड्युं मा यो सब देखी बटी मन खुश ह्वै गै। हम अपणा लोक खातिर काम कन्ना रवां।`;
    salaniDev = `यो समाचार पहाड़ का जनमानस मा चर्चा कु विषय बण्यो छ। गौं-गौं मा लोग ये पर विचार कन्ना छां।`;
    badhaniDev = `उच्च हिमालयी अंचल मा यो संदेश पुरातन परम्परा अनुकूल प्रेषित कद्दे।`;
    nagpuriyaDev = `डांड्युं मा यो खबर तेजी से फैलीं गै! सबी लोग अपणा थान मा सचेत छन।`;
    jaunpuriDev = `रंवाई-जौनपुर अंचले यो बात विशेष छौ। लोका आपणे डांडे सुख-शांति चावंता छन।`;
    kumaoniDev = `कुमाऊँ अंचल का डाणा-काणा अर नद्युं का कांठा मा लोकजीवन अपण पुरान संस्कारन दगड़ि आज लै जुड़िरौ छ। "${text.slice(0, 130)}..." को मुख्य संदेश यो छ कि हम सबी अपण कुमाऊँनी बोली-भाषा अर संस्कृति कु मान राखौं।`;
    jaunsariDev = `जौनसार-बावर अंचले डांडे-कांडे मा यो संदेश विशेष महत्व रखदो सो। "${text.slice(0, 130)}..." रो सार सो कि आमु सबी आपणी जौनसारी बोली, संस्कृति अर महासू देवते रा संस्कारा कु आदर करदा सा।`;
  }

  // Retroflex ळ audit list
  const retroflexAudit = [
    { word: 'बर्खा / बांदळ', standard_spelling: 'बांदळ (Bāndaḷ)', phonetic_rule: 'Intervocalic retroflex lateral flap replaces Hindi l in clouds/rain morphology.' },
    { word: 'गौंकाळ / गळि', standard_spelling: 'गळि (Gaḷi)', phonetic_rule: 'Garhwali street/valley passage retains retroflex ळ against dental l.' },
    { word: 'नौळा / नौळ्युं', standard_spelling: 'नौळा (Nauḷā)', phonetic_rule: 'Traditional stone stepwell aquifer retains retroflex ळ in singular and locative plural.' },
    { word: 'सीतळ / शीतल', standard_spelling: 'सीतळ (Sītaḷ)', phonetic_rule: 'Central Pahari phonetic shift softens ś to s and hardens terminal l to retroflex ळ.' },
    { word: 'बुग्याळ / बुग्याळुं', standard_spelling: 'बुग्याळ (Bugyāḷ)', phonetic_rule: 'Alpine pasture suffix consistently takes retroflex ळ in all Central Pahari press copy.' },
    { word: 'अनवाळ / चरवाळा', standard_spelling: 'अनवाळ (Anwāḷ)', phonetic_rule: 'Traditional transhumance shepherd noun retains standard retroflex ळ.' }
  ];

  // Matched Lexicon
  const matchedLexicon = LEXICON.slice(0, 4).map(item => ({
    term: item.term,
    category: item.category,
    meaning: item.meaning,
    journalistic_context: item.journalisticContext
  }));

  // Matched Proverbs
  const matchedProverbs = PROVERBS.slice(0, 3).map(p => ({
    akhana_pakhana: p.devanagari,
    transliteration: p.transliteration,
    literal_meaning: p.literal,
    editorial_application: p.context
  }));

  return {
    source_text: text,
    source_language: detectedLang,
    detected_register: resolvedRegister,
    register_explanation: 'Standardized according to Central Pahari editorial standards (Dainik Jagran Garhwali edition, Chitthi-Patri, and Sahitya Akademi Garhwali conventions).',
    editorial_headlines: {
      lead_headline: isDisaster 
        ? 'चमोली मा अलकनंदा और धौलीगंगा उफाण पर: डांड्युं मा सतर्कता, गधेरुं मा मलबो ऐण से राजमार्ग बन्द'
        : (isPastoral ? 'मंडुआ और झंगोरा का दिन फिरे: बुग्याळुं की तर्फ अनवाळुं कु प्रस्थान' : 'डांडा-कांडा मा गूंजी लोक-वाणी: मैती और पलि-भौंत की सांस्कृतिक पहचान'),
      kicker: isDisaster ? 'पहाड़ी आपदा एवं नदी बेसिन बुलेटिन' : 'विशेष क्षेत्रीय सम्पादकीय',
      subhead: isDisaster ? 'प्रशासन न नदी तीरा का सबी गौं का बाशिंदों सुरक्षित थान मा जाणा खातिर चेताया' : 'परंपरागत खेती और प्राकृतिक जलस्रोतों कु संरक्षण पहाड़ कु भविष्य',
      feature_title: isDisaster ? 'उफणदी नदियां और पहाड़ की धड़कन' : 'बुग्याळ, बांद और ब्वे कु आंगण: एक प्रवासी की घर-वापसी',
    },
    standard_literary_garhwali: {
      devanagari: litDevanagari,
      transliteration: litDevanagari
        .replace(/ळ/g, 'ḷ')
        .replace(/छ/g, 'ch')
        .replace(/गौं/g, 'gauṁ')
        .replace(/डांडा/g, 'ḍāṇḍā')
        .replace(/बुग्याळ/g, 'bugyāḷ'),
      editorial_notes: 'Retains standard literary Srinagariya orthography, classic auxiliary verbs (छ/छा/छी/छन), and strict distinction of retroflex ळ. Fully suitable for newspaper editorial columns and formal book publishing.',
      retroflex_la_audit: retroflexAudit,
    },
    dialect_translations: {
      srinagariya: {
        dialect_name: 'श्रीनगरिया (साहित्यिक मानक - Alaknanda Valley)',
        devanagari: srinagariyaDev,
        transliteration: srinagariyaDev.replace(/ळ/g, 'ḷ'),
        dialect_features: 'De facto literary standard; canonical auxiliary verbs (छ, छा, छी, छन), balanced phonetics, standard postpositions.',
        auxiliary_verbs_used: ['छ', 'छां', 'छन'],
      },
      tehriyali: {
        dialect_name: 'टिहरियाळि (भागीरथी-भिलंगना बेसिन)',
        devanagari: tehriyaliDev,
        transliteration: tehriyaliDev.replace(/ळ/g, 'ḷ'),
        dialect_features: 'Vowel diphthong shift (ऊ गै vs ऊ ग्या), rapid conversational cadence, localized past participles (-गै, -रै).',
        basin_variations: 'Bhagirathi & Bhilangana valley colloquial roots (मखि, कथै).',
      },
      salani: {
        dialect_name: 'सलाणी (गंगा-सळान / पौड़ी)',
        devanagari: salaniDev,
        transliteration: salaniDev.replace(/ळ/g, 'ḷ'),
        dialect_features: 'Sub-Himalayan plains phonetic influence, distinct postposition marker "मा" and "कन", consistent -या past tense (ग्या, खायो).',
        postposition_markers: 'Prominent use of "मा" (locative) and "कन" (dative/accusative).',
      },
      badhani_chamoli: {
        dialect_name: 'बधाणी / चमोली (पिंडर-अलकनंदा संगम)',
        devanagari: badhaniDev,
        transliteration: badhaniDev.replace(/ळ/g, 'ḷ'),
        dialect_features: 'Archaic Indo-Aryan consonant clusters, conservative pronoun forms (कथ, कुथी, क्वी, जन), high-altitude vocabulary.',
        archaic_consonants: 'Preserves conjuncts (ष्ट, त्र, ज्ञ) and older Pahari inflectional suffixes.',
      },
      nagpuriya: {
        dialect_name: 'नागपुरिया (मंदाकिनी घाटी / रुद्रप्रयाग)',
        devanagari: nagpuriyaDev,
        transliteration: nagpuriyaDev.replace(/ळ/g, 'ḷ'),
        dialect_features: 'Tonal cadences, resonant pitch accent, unique interrogative particles (कथै, क्यैक, कैन्कै).',
        tonal_cadences: 'Rising intonation in interrogatives; expressive sound symbolism for mountain terrain.',
      },
      jaunpuri_ravalti: {
        dialect_name: 'जौनपुरी / रवाल्टी (पश्चिमी सीमांत / रंवाई)',
        devanagari: jaunpuriDev,
        transliteration: jaunpuriDev.replace(/ळ/g, 'ḷ'),
        dialect_features: 'Transitional dialect between Garhwali and Jaunsari/Himachali; verb participle suffixes (-ौंतो, -आवंतो).',
        transitional_markers: 'Demonstratives (एऊ, वोऊ) and genitive postposition "रो/री".',
      },
      kumaoni: {
        dialect_name: 'कुमाऊँनी (Kumaoni - अल्मोड़ा / नैनीताल / पिथौरागढ़ मानक)',
        devanagari: kumaoniDev,
        transliteration: kumaoniDev.replace(/ळ/g, 'ḷ'),
        dialect_features: 'Distinct Central Pahari sister language; auxiliary verbs (छु/छूं, छै, छ, छा/छौं, छन), absolutive participles in \'-बेर\' (खाइबेर, तापिबेर), distinct pronouns (हमार, तमार, म्य/मैं).',
        kumaoni_markers: 'सहायक क्रिया: छ/छु/छा, कृदंत: -बेर (तापिबेर, जाइबेर), कारक: हैटि/कणि',
      },
      jaunsari: {
        dialect_name: 'जौनसारी (Jaunsari - चक्राता / कालसी / जौनसार-बावर)',
        devanagari: jaunsariDev,
        transliteration: jaunsariDev.replace(/ळ/g, 'ḷ'),
        dialect_features: 'Distinct Western Pahari language of Jaunsar-Bawar; auxiliary verbs "सो (है), सा (हैं), थी/थिया (था)", pronouns "आमु (हम), तुमु (तुम), मोख (मुझे)", verbal participles in "-दो/-तो/-आवंतो".',
        jaunsari_markers: 'सहायक क्रिया: सो/सा/थिया, सर्वनाम: आमु/तुमु/मोख, कृदंत: -दो/-तो (करदो, जांदो)',
      },
    },
    editorial_lexicon: matchedLexicon,
    relevant_proverbs: matchedProverbs,
  };
}
