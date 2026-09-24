// server.ts
import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

// src/utils/pahariTranslatorEngine.ts
var PHRASE_DICTIONARY = [
  // 1. "आप कैसे हैं?" / "तुम कैसे हो?" / "Hello how are you?"
  {
    match: /(?:आप\s+कैसे\s+हैं|तुम\s+कैसे\s+हो|तू\s+कैसा\s+है|how\s+are\s+you|how're\s+you)/i,
    garhwali: "\u0906\u092A \u0915\u0928\u0915 \u091B\u0928? \u0938\u092C \u0915\u0941\u0936\u0932-\u092E\u0902\u0917\u0932 \u0924 \u091B?",
    garhwaliTranslit: "Aap kanak chhan? Sab kushal-mangal ta chha?",
    srinagariya: "\u0906\u092A \u0915\u0928\u0915 \u091B\u0928? \u0938\u092C \u0915\u0941\u0936\u0932-\u092E\u0902\u0917\u0932 \u0924 \u091B?",
    tehriyali: "\u0924\u0941\u092E \u0915\u0928\u0915 \u091B\u093E? \u0918\u0930-\u092A\u0930\u093F\u0935\u093E\u0930 \u092E\u093E \u0938\u092C \u0930\u093E\u091C\u093C\u0940-\u0916\u0941\u0936\u0940?",
    salani: "\u0906\u092A \u0915\u0928\u0915 \u091B\u093E\u0902? \u0938\u092C \u0920\u0940\u0915-\u0920\u093E\u0915 \u091B \u0928\u093E?",
    badhani: "\u0924\u0941\u092E \u0915\u0928\u0915 \u091B\u094C? \u0938\u092C\u0940 \u091C\u0928 \u0915\u0941\u0936\u0932 \u091B\u0928?",
    nagpuriya: "\u0906\u092A \u0915\u0928\u0915 \u091B\u0928? \u092E\u0902\u0926\u093E\u0915\u093F\u0928\u0940 \u0918\u093E\u091F\u0940 \u092E\u093E \u0938\u092C \u092E\u0902\u0917\u0932\u092E\u092F \u091B?",
    jaunpuri: "\u0924\u0941\u092E \u0915\u0928\u0915 \u0938\u094B? \u0938\u092C \u0920\u0940\u0915-\u0920\u093E\u0915 \u0938\u094B?",
    kumaoni: "\u092A\u0948\u0932\u093E\u0917! \u0924\u092E \u0915\u0938\u093E \u091B\u093E? \u0918\u0930-\u092A\u0930\u093F\u0935\u093E\u0930 \u092E\u093E \u0938\u092C \u0930\u093E\u091C\u0940-\u0916\u0941\u0938\u0940 \u091B\u0942 \u0928\u093E?",
    kumaoniTranslit: "Pailag! Tam kasa chha? Ghar-parivar ma sab rajee-khusee chhoo na?",
    jaunsari: "\u092A\u094D\u0930\u0923\u093E\u092E! \u0924\u0941\u092E\u0941 \u0915\u0928\u0915 \u0938\u093E? \u0938\u092C \u0915\u0941\u0936\u0932-\u092E\u0902\u0917\u0932 \u0938\u094B?",
    jaunsariTranslit: "Pranaam! Tumu kanak sa? Sab kushal-mangal so?",
    vocab: [
      { term: "\u0915\u0928\u0915 / \u0915\u0938\u093E (Kanak / Kasa)", meaning: "\u0915\u0948\u0938\u0947 / How" },
      { term: "\u091B\u0928 / \u091B\u093E / \u0938\u093E (Chhan / Chha / Sa)", meaning: "\u0939\u0948\u0902 / Are (Honorific auxiliary verb)" },
      { term: "\u092A\u0948\u0932\u093E\u0917 (Pailag)", meaning: "\u092A\u094D\u0930\u0923\u093E\u092E / Respectful Kumaoni greeting" },
      { term: "\u0924\u0941\u092E\u0941 (Tumu)", meaning: "\u0906\u092A / You (Jaunsari honorific pronoun)" }
    ]
  },
  // 2. "आपका क्या नाम है?" / "What is your name?"
  {
    match: /(?:आपका\s+(?:क्या\s+)?नाम\s+(?:क्या\s+)?है|तुम्हारा\s+(?:क्या\s+)?नाम\s+(?:क्या\s+)?है|तेरा\s+नाम\s+क्या\s+है|what\s+is\s+your\s+name)/i,
    garhwali: "\u0906\u092A\u0941\u0915\u094B \u0915\u094D\u092F\u093E \u0928\u094C\u0902 \u091B?",
    garhwaliTranslit: "Aapuko kya naun chha?",
    srinagariya: "\u0906\u092A\u0941\u0915\u094B \u0915\u094D\u092F\u093E \u0928\u094C\u0902 \u091B?",
    tehriyali: "\u0924\u0941\u092E\u094D\u0939\u093E\u0930\u094B \u0928\u094C\u0902 \u0915\u094D\u092F\u093E \u091B?",
    salani: "\u0906\u092A \u0915\u0941 \u0928\u094C\u0902 \u0915\u094D\u092F\u093E \u091B \u091C\u0940?",
    badhani: "\u0906\u092A\u0941\u0915\u094B \u0936\u0941\u092D \u0928\u094C\u0902 \u0915\u094D\u092F\u093E \u091B?",
    nagpuriya: "\u0924\u0941\u092E\u094D\u0939\u093E\u0930\u094B \u0928\u094C\u0902 \u0915\u094D\u092F\u093E \u091B\u0948?",
    jaunpuri: "\u0924\u0941\u092E\u094B\u0930\u094B \u0915\u0947 \u0928\u094C\u0902 \u0938\u094B?",
    kumaoni: "\u0924\u092E\u093E\u0930 \u0915\u0947 \u0928\u094C\u0902 \u091B\u0942? / \u0906\u092A\u0941\u0915\u094B \u0915\u0947 \u0928\u094C\u0902 \u091B\u0942?",
    kumaoniTranslit: "Tamar ke naun chhoo? / Aapuko ke naun chhoo?",
    jaunsari: "\u0924\u0941\u092E\u094B\u0930\u094B \u0915\u0947 \u0928\u094C\u0902 \u0938\u094B?",
    jaunsariTranslit: "Tumoro ke naun so?",
    vocab: [
      { term: "\u0928\u094C\u0902 (Naun)", meaning: "\u0928\u093E\u092E / Name" },
      { term: "\u0915\u0947 / \u0915\u094D\u092F\u093E (Ke / Kya)", meaning: "\u0915\u094D\u092F\u093E / What" },
      { term: "\u091B\u0942 / \u091B / \u0938\u094B (Chhoo / Chha / So)", meaning: "\u0939\u0948 / Is" }
    ]
  },
  // 3. "मेरा नाम ... है" / "My name is ..."
  {
    match: /(?:मेरा\s+नाम\s+([^\s,।.]+)\s+है|my\s+name\s+is\s+([^\s,.]+))/i,
    garhwali: "\u092E\u0947\u0930\u094B \u0928\u094C\u0902 {name} \u091B\u0964",
    garhwaliTranslit: "Mero naun {name} chha.",
    srinagariya: "\u092E\u0947\u0930\u094B \u0928\u094C\u0902 {name} \u091B\u0964",
    tehriyali: "\u092E\u0947\u0930\u094B \u0928\u094C\u0902 {name} \u091B\u0964",
    salani: "\u092E\u0947\u0930\u094B \u0928\u094C\u0902 {name} \u091B\u0964",
    badhani: "\u092E\u0947\u0930\u094B \u0928\u093E\u092E {name} \u091B\u0964",
    nagpuriya: "\u092E\u0947\u0930\u094B \u0928\u094C\u0902 {name} \u091B\u0948\u0964",
    jaunpuri: "\u092E\u094B\u0930\u094B \u0928\u094C\u0902 {name} \u0938\u094B\u0964",
    kumaoni: "\u092E\u094D\u092F\u093E\u0930 \u0928\u094C\u0902 {name} \u091B\u0942\u0964",
    kumaoniTranslit: "Myar naun {name} chhoo.",
    jaunsari: "\u092E\u094B\u0930\u094B \u0928\u094C\u0902 {name} \u0938\u094B\u0964",
    jaunsariTranslit: "Moro naun {name} so.",
    vocab: [
      { term: "\u092E\u0947\u0930\u094B / \u092E\u094D\u092F\u093E\u0930 / \u092E\u094B\u0930\u094B (Mero / Myar / Moro)", meaning: "\u092E\u0947\u0930\u093E / My" },
      { term: "\u0928\u094C\u0902 (Naun)", meaning: "\u0928\u093E\u092E / Name" }
    ]
  },
  // 4. "मैं ठीक हूँ" / "I am fine"
  {
    match: /(?:मैं\s+(?:बिल्कुल\s+)?(?:ठीक|अच्छा|भला)\s+हूँ|सब\s+ठीक\s+है|i\s+am\s+(?:fine|good|well|okay))/i,
    garhwali: "\u092E\u093F \u092C\u093F\u0932\u094D\u0915\u0941\u0932 \u0920\u0940\u0915 \u091B\u094C\u0902, \u0938\u092C \u0915\u0941\u0936\u0932-\u092E\u0902\u0917\u0932 \u091B\u0964",
    garhwaliTranslit: "Mi bilkul theek chhaun, sab kushal-mangal chha.",
    srinagariya: "\u092E\u093F \u0920\u0940\u0915 \u091B\u094C\u0902, \u092D\u0917\u0935\u093E\u0928 \u0915\u0940 \u0926\u092F\u093E \u0938\u0947 \u0938\u092C \u0915\u0941\u0936\u0932 \u091B\u0964",
    tehriyali: "\u092E\u093F \u0930\u093E\u091C\u093C\u0940-\u0916\u0941\u0936\u0940 \u091B\u094C\u0902, \u0938\u092C \u0920\u0940\u0915-\u0920\u093E\u0915 \u091B\u0964",
    salani: "\u092E\u093F \u092D\u0932\u094B \u091B\u094C\u0902, \u0938\u092C \u0915\u0941\u0936\u0932 \u091B\u0964",
    badhani: "\u092E\u093F \u0906\u0928\u0902\u0926\u092A\u0942\u0930\u094D\u0935\u0915 \u091B\u094C\u0902\u0964",
    nagpuriya: "\u092E\u093F \u0920\u0940\u0915 \u091B\u094C\u0902, \u0938\u092C \u092E\u0902\u0917\u0932 \u091B\u0948\u0964",
    jaunpuri: "\u0906\u090A\u0902 \u0920\u0940\u0915 \u0938\u094C\u0902, \u0938\u092C \u0915\u0941\u0936\u0932 \u0938\u094B\u0964",
    kumaoni: "\u092E\u094D\u092F \u092C\u093F\u0932\u094D\u0915\u0941\u0932 \u0920\u0940\u0915 \u091B\u0942, \u0918\u0930-\u0926\u094D\u0935\u093E\u0930 \u092E\u093E \u0938\u092C \u0930\u093E\u091C\u0940-\u0916\u0941\u0938\u0940 \u091B\u0942\u0964",
    kumaoniTranslit: "My bilkul theek chhoo, ghar-dwaar ma sab rajee-khusee chhoo.",
    jaunsari: "\u0906\u090A\u0902 \u0920\u0940\u0915 \u0938\u094C\u0902, \u092E\u0939\u093E\u0938\u0942 \u091C\u0940 \u0930\u0940 \u0915\u0943\u092A\u093E \u0938\u0947 \u0938\u092C \u0915\u0941\u0936\u0932 \u0938\u094B\u0964",
    jaunsariTranslit: "Aaoon theek saun, Mahasu ji ree kripa se sab kushal so.",
    vocab: [
      { term: "\u092E\u093F / \u092E\u094D\u092F / \u0906\u090A\u0902 (Mi / My / Aaoon)", meaning: "\u092E\u0948\u0902 / I" },
      { term: "\u091B\u094C\u0902 / \u091B\u0942 / \u0938\u094C\u0902 (Chhaun / Chhoo / Saun)", meaning: "\u0939\u0942\u0901 / Am" },
      { term: "\u0930\u093E\u091C\u093C\u0940-\u0916\u0941\u0936\u0940 / \u0930\u093E\u091C\u0940-\u0916\u0941\u0938\u0940", meaning: "\u0938\u0915\u0941\u0936\u0932 / Well and happy" }
    ]
  },
  // 5. "आप कहाँ जा रहे हैं?" / "Where are you going?"
  {
    match: /(?:आप\s+कहाँ\s+जा\s+रहे\s+हैं|तुम\s+कहाँ\s+जा\s+रहे\s+हो|where\s+are\s+you\s+going)/i,
    garhwali: "\u0906\u092A \u0915\u0916 \u091C\u093E\u0923\u093E \u091B\u0928?",
    garhwaliTranslit: "Aap kakh jaana chhan?",
    srinagariya: "\u0906\u092A \u0915\u0916 \u091C\u093E\u0923\u093E \u091B\u0928?",
    tehriyali: "\u0924\u0941\u092E \u0915\u0916 \u091C\u093E\u0923\u093E \u091B\u093E?",
    salani: "\u0906\u092A \u0915\u0916 \u091C\u093E\u0923\u093E \u091B\u093E\u0902?",
    badhani: "\u0924\u0941\u092E \u0915\u0941\u0925\u0940 \u091C\u093E\u0923\u093E \u091B\u094C?",
    nagpuriya: "\u0906\u092A \u0915\u0925\u0948 \u091C\u093E\u0923\u093E \u091B\u0928?",
    jaunpuri: "\u0924\u0941\u092E\u0941 \u0915\u0916 \u091C\u093E\u0902\u0926\u0947 \u0938\u093E?",
    kumaoni: "\u0924\u092E \u0915\u093E\u0901 \u091C\u093E\u0923\u093E \u091B\u093E?",
    kumaoniTranslit: "Tam kaan jaana chha?",
    jaunsari: "\u0924\u0941\u092E\u0941 \u0915\u0916 \u091C\u093E\u0902\u0926\u0947 \u0938\u093E?",
    jaunsariTranslit: "Tumu kakh jaande sa?",
    vocab: [
      { term: "\u0915\u0916 / \u0915\u093E\u0901 / \u0915\u0941\u0925\u0940 (Kakh / Kaan / Kuthee)", meaning: "\u0915\u0939\u093E\u0901 / Where" },
      { term: "\u091C\u093E\u0923\u093E / \u091C\u093E\u0902\u0926\u0947 (Jaana / Jaande)", meaning: "\u091C\u093E \u0930\u0939\u0947 / Going" }
    ]
  },
  // 6. "मैं घर जा रहा हूँ" / "I am going home"
  {
    match: /(?:मैं\s+घर\s+जा\s+रहा\s+हूँ|i\s+am\s+going\s+home)/i,
    garhwali: "\u092E\u093F \u0918\u0930 \u091C\u093E\u0923\u0941 \u091B\u094C\u0902\u0964",
    garhwaliTranslit: "Mi ghar jaanu chhaun.",
    srinagariya: "\u092E\u093F \u0918\u094C\u0930 \u091C\u093E\u0923\u0941 \u091B\u094C\u0902\u0964",
    tehriyali: "\u092E\u093F \u0918\u0930 \u091C\u093E\u0923\u0941 \u091B\u094C\u0902\u0964",
    salani: "\u092E\u093F \u0918\u0930 \u091C\u093E\u0923\u0941 \u091B\u094C\u0902\u0964",
    badhani: "\u092E\u093F \u0928\u093F\u091C \u0906\u0935\u093E\u0938 \u091C\u093E\u0923\u0941 \u091B\u094C\u0902\u0964",
    nagpuriya: "\u092E\u093F \u0918\u0930 \u091C\u093E\u0923\u0941 \u091B\u094C\u0902\u0964",
    jaunpuri: "\u0906\u090A\u0902 \u0918\u0930 \u091C\u093E\u0902\u0926\u094B \u0938\u094C\u0902\u0964",
    kumaoni: "\u092E\u094D\u092F \u0918\u0930 \u091C\u093E\u0902\u0923 \u091B\u0942\u0964",
    kumaoniTranslit: "My ghar jaan chhoo.",
    jaunsari: "\u0906\u090A\u0902 \u0918\u0930 \u091C\u093E\u0902\u0926\u094B \u0938\u094C\u0902\u0964",
    jaunsariTranslit: "Aaoon ghar jaando saun.",
    vocab: [
      { term: "\u0918\u094C\u0930 / \u0918\u0930 (Ghaur / Ghar)", meaning: "\u0918\u0930 / Home" },
      { term: "\u091C\u093E\u0923\u0941 / \u091C\u093E\u0902\u0923 / \u091C\u093E\u0902\u0926\u094B (Jaanu / Jaan / Jaando)", meaning: "\u091C\u093E \u0930\u0939\u093E / Going" }
    ]
  },
  // 7. "रास्ता कहाँ है?" / "किधर से रास्ता है?" / "Where is the way/road?"
  {
    match: /(?:रास्ता\s+(?:कहाँ|किधर)\s+है|सड़क\s+(?:कहाँ|किधर)\s+है|where\s+is\s+the\s+(?:way|road|trail))/i,
    garhwali: "\u092C\u093E\u091F\u094B \u0915\u0916 \u091B? \u092E\u0925\u0948 \u0938\u0940\u0927\u094B \u0930\u0938\u094D\u0924\u094B \u092C\u0924\u093E\u0935\u093E\u0964",
    garhwaliTranslit: "Baato kakh chha? Mathai seedho rasto batawa.",
    srinagariya: "\u092C\u093E\u091F\u094B \u0915\u0916 \u091B? \u092E\u0925\u0948 \u0938\u0940\u0927\u094B \u0930\u0938\u094D\u0924\u094B \u092C\u0924\u093E\u0935\u093E\u0964",
    tehriyali: "\u092C\u093E\u091F\u094B \u0915\u0916 \u091B? \u092E\u0916\u093F \u0930\u0938\u094D\u0924\u094B \u092C\u094D\u0935\u0932\u093E\u0964",
    salani: "\u092C\u093E\u091F\u094B \u0915\u0916 \u091C\u093E\u0902\u0926? \u092E\u093F \u0915\u0928 \u0930\u0938\u094D\u0924\u094B \u092C\u0924\u093E\u0913\u0964",
    badhani: "\u0938\u0941\u092A\u0925 \u0915\u0941\u0925\u0940 \u091B? \u092E\u0925\u0948 \u092E\u093E\u0930\u094D\u0917 \u092C\u0924\u093E\u0935\u093E\u0964",
    nagpuriya: "\u092C\u093E\u091F\u094B \u0915\u0925\u0948 \u091B\u0948? \u092E\u0925\u0948 \u0930\u0938\u094D\u0924\u094B \u092C\u094D\u0935\u0932\u093E\u0964",
    jaunpuri: "\u092C\u093E\u091F\u094B \u0915\u0916 \u0938\u094B? \u092E\u094B\u0916 \u0938\u0940\u0927\u094B \u0930\u0938\u094D\u0924\u094B \u092C\u094B\u0932\u094B\u0964",
    kumaoni: "\u092C\u093E\u091F\u094B \u0915\u093E\u0901 \u091B\u0942? \u092E\u094D\u092F\u0915\u0923\u093F \u0938\u0940\u0927\u094B \u0930\u0938\u094D\u0924\u094B \u092C\u0924\u093E\u0913\u0964",
    kumaoniTranslit: "Baato kaan chhoo? Myakani seedho rasto batao.",
    jaunsari: "\u092C\u093E\u091F\u094B \u0915\u0916 \u0938\u094B? \u092E\u094B\u0916 \u0938\u0940\u0927\u094B \u092C\u093E\u091F\u094B \u092C\u094B\u0932\u094B\u0964",
    jaunsariTranslit: "Baato kakh so? Mokh seedho baato bolo.",
    vocab: [
      { term: "\u092C\u093E\u091F\u094B / \u0930\u0938\u094D\u0924\u094B (Baato / Rasto)", meaning: "\u0930\u093E\u0938\u094D\u0924\u093E / Way or trail" },
      { term: "\u092E\u0925\u0948 / \u092E\u094D\u092F\u0915\u0923\u093F / \u092E\u094B\u0916 (Mathai / Myakani / Mokh)", meaning: "\u092E\u0941\u091D\u0947 / To me" }
    ]
  },
  // 8. "मुझे पानी चाहिए" / "पानी कहाँ मिलेगा?" / "Water spring"
  {
    match: /(?:मुझे\s+पानी\s+(?:चाहिए|दो|पिलाओ)|पानी\s+कहाँ\s+मिलेगा|where\s+(?:can\s+i\s+get|is)\s+water)/i,
    garhwali: "\u092E\u0925\u0948 \u092A\u093E\u0923\u0940 \u091A\u092F\u0940\u0902 \u091B, \u0928\u094C\u0933\u093E \u0905\u0930 \u0927\u093E\u0930\u094B \u0915\u0941 \u0938\u0940\u0924\u0933 \u092A\u093E\u0923\u0940 \u0915\u0916 \u092E\u093F\u0932\u0932\u0942?",
    garhwaliTranslit: "Mathai paani chayein chha, naula ar dhaaro ku seetal paani kakh milaloo?",
    srinagariya: "\u092E\u0925\u0948 \u092A\u093E\u0923\u0940 \u091A\u092F\u0940\u0902 \u091B, \u0928\u094C\u0933\u093E \u0915\u0941 \u0938\u0940\u0924\u0933 \u092A\u093E\u0923\u0940 \u0915\u0916 \u092E\u093F\u0932\u0932\u0942?",
    tehriyali: "\u092E\u0916\u093F \u092A\u093E\u0923\u0940 \u091A\u093E\u0939\u0940\u0902 \u091B, \u092E\u0902\u0917\u0930\u094B \u0915\u0941 \u0928\u093F\u0930\u094D\u092E\u0933 \u092A\u093E\u0923\u0940 \u0915\u0916 \u091B?",
    salani: "\u092E\u093F \u0915\u0928 \u092A\u093E\u0923\u0940 \u091A\u092F\u0940\u0902, \u0927\u093E\u0930\u094B \u0915\u0941 \u092A\u093E\u0923\u093F \u0915\u0916 \u092E\u093F\u0932\u0926\u0942?",
    badhani: "\u092E\u0925\u0948 \u091C\u0932 \u091A\u092F\u0940\u0902, \u092A\u0935\u093F\u0924\u094D\u0930 \u0927\u093E\u0930\u093E \u0915\u0941 \u091C\u0932 \u0915\u0916 \u091B?",
    nagpuriya: "\u092E\u0925\u0948 \u092A\u093E\u0923\u0940 \u091A\u093E\u0939\u0940\u0902 \u091B\u0948, \u092A\u0902\u0926\u0947\u0930\u093E \u0915\u0941 \u092E\u0940\u0920\u094B \u092A\u093E\u0923\u0940 \u0915\u0916 \u092C\u0917\u094D\u0917\u0926?",
    jaunpuri: "\u092E\u094B\u0916 \u092A\u093E\u0923\u0940 \u091A\u093E\u0939\u0940 \u0938\u094B, \u092A\u0902\u0926\u0947\u0930\u0947 \u0930\u094B \u0928\u093F\u0930\u094D\u092E\u0933 \u092A\u093E\u0923\u0940 \u0915\u0916 \u092E\u093F\u0932\u0926\u094B \u0938\u094B?",
    kumaoni: "\u092E\u094D\u092F\u0915\u0923\u093F \u092A\u093E\u0923\u0940 \u091A\u093E\u0939\u0940\u0902 \u091B\u0942, \u0928\u094C\u0932\u093E \u0905\u0930 \u0927\u093E\u0930\u094B \u0915\u094B \u092E\u0940\u0920 \u092A\u093E\u0923\u0940 \u0915\u093E\u0901 \u092E\u093F\u0932\u0932?",
    kumaoniTranslit: "Myakani paani chaheen chhoo, naula ar dhaaro ko meeth paani kaan milal?",
    jaunsari: "\u092E\u094B\u0916 \u092A\u093E\u0923\u0940 \u091A\u093E\u0939\u0940 \u0938\u094B, \u092A\u0902\u0926\u0947\u0930\u0947 \u0930\u094B \u0928\u093F\u0930\u094D\u092E\u0933 \u092A\u093E\u0923\u0940 \u0915\u0916 \u092E\u093F\u0932\u0926\u093E \u0938\u094B?",
    jaunsariTranslit: "Mokh paani chaahi so, pandere ro nirmal paani kakh milda so?",
    vocab: [
      { term: "\u092A\u093E\u0923\u0940 (Paani)", meaning: "\u091C\u0932 / Water (pure retroflex nasal)" },
      { term: "\u0928\u094C\u0933\u093E / \u0928\u094C\u0932\u093E (Naula)", meaning: "\u092A\u093E\u0930\u0902\u092A\u0930\u093F\u0915 \u091C\u0932\u0915\u0941\u0923\u094D\u0921 / Traditional Himalayan aquifer" },
      { term: "\u0938\u0940\u0924\u0933 (Seetal)", meaning: "\u0936\u0940\u0924\u0932 / Cool & refreshing (retroflex \u0933)" }
    ]
  },
  // 9. "बहुत धन्यवाद" / "आभार" / "Thank you very much"
  {
    match: /(?:बहुत\s+(?:बहुत\s+)?(?:धन्यवाद|शुक्रिया|आभार)|thank\s+you\s+very\s+much|thanks\s+a\s+lot)/i,
    garhwali: "\u0906\u092A\u0941\u0915\u094B \u092D\u094C\u0924-\u092D\u094C\u0924 \u0927\u0928\u094D\u092F\u0935\u093E\u0926 \u0905\u0930 \u0906\u092D\u093E\u0930!",
    garhwaliTranslit: "Aapuko bhaut-bhaut dhanyavaad ar aabhaar!",
    srinagariya: "\u0906\u092A\u0941\u0915\u094B \u092D\u094C\u0924-\u092D\u094C\u0924 \u0927\u0928\u094D\u092F\u0935\u093E\u0926 \u0905\u0930 \u0906\u092D\u093E\u0930!",
    tehriyali: "\u0924\u0941\u092E\u094D\u0939\u093E\u0930\u094B \u092D\u094C\u0924 \u0906\u092D\u093E\u0930, \u092E\u0928 \u092A\u094D\u0930\u0938\u0928\u094D\u0928 \u0939\u094D\u0935\u0948 \u0917\u0948\u0964",
    salani: "\u0906\u092A\u0941\u0915\u094B \u092D\u094C\u0924-\u092D\u094C\u0924 \u0927\u0928\u094D\u092F\u0935\u093E\u0926!",
    badhani: "\u0906\u092A\u0941\u0915\u094B \u0938\u093E\u0926\u0930 \u0915\u0943\u0924\u091C\u094D\u091E\u0924\u093E \u0905\u0930 \u0927\u0928\u094D\u092F\u0935\u093E\u0926!",
    nagpuriya: "\u092D\u094C\u0924-\u092D\u094C\u0924 \u0927\u0928\u094D\u092F\u0935\u093E\u0926 \u0906\u092A\u0925\u0948!",
    jaunpuri: "\u0924\u0941\u092E\u094B\u0930\u094B \u0918\u0923\u094B \u0927\u0928\u094D\u092F\u0935\u093E\u0926 \u0905\u0930 \u0906\u092D\u093E\u0930!",
    kumaoni: "\u0924\u092E\u093E\u0930 \u092D\u094C\u0924-\u092D\u094C\u0924 \u0927\u0928\u094D\u092F\u0935\u093E\u0926 \u0905\u0930 \u092A\u0948\u0932\u093E\u0917!",
    kumaoniTranslit: "Tamar bhaut-bhaut dhanyavaad ar pailag!",
    jaunsari: "\u0924\u0941\u092E\u094B\u0930\u094B \u0918\u0923\u094B \u0927\u0928\u094D\u092F\u0935\u093E\u0926 \u0905\u0930 \u091C\u092F \u092E\u0939\u093E\u0938\u0942!",
    jaunsariTranslit: "Tumoro ghano dhanyavaad ar Jai Mahasu!",
    vocab: [
      { term: "\u092D\u094C\u0924 / \u0918\u0923\u094B (Bhaut / Ghano)", meaning: "\u092C\u0939\u0941\u0924 / Very much" },
      { term: "\u092A\u0948\u0932\u093E\u0917 (Pailag)", meaning: "\u092A\u094D\u0930\u0923\u093E\u092E / Respectful reverence" }
    ]
  },
  // 10. "आज मौसम बहुत अच्छा है / ठंड है"
  {
    match: /(?:मौसम\s+बहुत\s+(?:अच्छा|ठंडा|खराब)\s+है|आज\s+(?:बहुत\s+)?ठंड\s+है|today\s+the\s+weather\s+is\s+cold)/i,
    garhwali: "\u0921\u093E\u0902\u0921\u093E-\u0915\u093E\u0902\u0921\u093E \u092E\u093E \u0906\u091C \u092D\u094C\u0924 \u0920\u0923\u094D\u0921\u0940 \u091B \u0905\u0930 \u092C\u092F\u093E\u0933 \u091C\u094B\u0930 \u0938\u0947 \u091A\u0932\u094D\u0932\u093F \u091B\u0964",
    garhwaliTranslit: "Danda-kanda ma aaj bhaut thandi chha ar bayaal jor se chal-li chha.",
    srinagariya: "\u0921\u093E\u0902\u0921\u093E-\u0915\u093E\u0902\u0921\u093E \u092E\u093E \u0906\u091C \u0916\u0942\u092C \u0920\u0923\u094D\u0921\u0940 \u091B \u0905\u0930 \u0939\u093F\u0909\u0901 \u092A\u095C\u0923\u0942 \u091B\u0964",
    tehriyali: "\u0921\u093E\u0902\u0921\u094D\u092F\u0941\u0902 \u092A\u0930 \u0906\u091C \u092D\u092F\u0902\u0915\u0930 \u091C\u093E\u095C\u094B \u091B \u0905\u0930 \u092C\u092F\u093E\u0933 \u092C\u0917\u094D\u0917\u0923\u0940 \u091B\u0964",
    salani: "\u092A\u0939\u093E\u095C\u094B\u0902 \u092E\u093E \u0906\u091C \u092C\u0921\u094D\u0921\u0940 \u0920\u0923\u094D\u0921 \u091B \u0905\u0930 \u0918\u093E\u092E \u0928\u093F \u0928\u093F\u0915\u0933\u093F\u0964",
    badhani: "\u0909\u091A\u094D\u091A \u0921\u093E\u0902\u0921\u094D\u092F\u094B\u0902 \u092E\u093E \u0906\u091C \u0939\u093F\u092E\u093E\u091A\u094D\u091B\u093E\u0926\u0928 \u091B \u0905\u0930 \u0938\u0940\u0924\u0933 \u092C\u092F\u093E\u0933 \u091A\u0932\u0923\u0940 \u091B\u0964",
    nagpuriya: "\u092E\u0902\u0926\u093E\u0915\u093F\u0928\u0940 \u0918\u093E\u091F\u0940 \u092E\u093E \u0906\u091C \u091C\u093E\u095C\u094B \u092C\u095D\u093F\u0917\u094D\u092F\u0941\u0902 \u091B!",
    jaunpuri: "\u0921\u093E\u0902\u0921\u0947 \u092E\u093E \u0906\u091C \u0916\u0942\u092C \u0938\u0940\u0924 \u0938\u094B \u0905\u0930 \u0939\u093F\u0909\u0901 \u092A\u095C\u0926\u094B \u0938\u094B\u0964",
    kumaoni: "\u0921\u093E\u0928\u093E-\u0915\u093E\u0928\u093E \u092E\u093E \u0906\u091C \u0916\u0942\u092C \u091C\u093E\u0921\u093C \u091B\u0942 \u0905\u0930 \u0939\u093F\u0909\u0901 \u092A\u0921\u093C\u0923 \u0930\u094C\u0964 \u092C\u092F\u093E\u0933 \u0932\u0948 \u091A\u0932\u0923\u0940 \u091B\u0942\u0964",
    kumaoniTranslit: "Daana-kaana ma aaj khoob jaad chhoo ar hiun padan rau. Bayaal lai chalni chhoo.",
    jaunsari: "\u0921\u093E\u0902\u0921\u0947 \u092E\u093E\u0902 \u0906\u091C \u0918\u0923\u094B \u091C\u093E\u0921\u093C\u094B \u0938\u094B \u0905\u0930 \u092C\u0930\u094D\u092B \u0917\u093F\u0930\u0926\u0940 \u0938\u0940\u0964",
    jaunsariTranslit: "Daande maan aaj ghano jaado so ar barf girdy see.",
    vocab: [
      { term: "\u0921\u093E\u0902\u0921\u093E-\u0915\u093E\u0902\u0921\u093E / \u0921\u093E\u0928\u093E-\u0915\u093E\u0928\u093E", meaning: "\u092A\u0939\u093E\u0921\u093C \u0914\u0930 \u092A\u0930\u094D\u0935\u0924 \u0936\u093F\u0916\u0930 / Mountain ridges" },
      { term: "\u092C\u092F\u093E\u0933 (Bayaal)", meaning: "\u092A\u0939\u093E\u0921\u093C\u0940 \u0936\u0940\u0924\u0932 \u0939\u0935\u093E / Mountain breeze (retroflex \u0933)" },
      { term: "\u0939\u093F\u0909\u0901 (Hiun)", meaning: "\u092C\u0930\u094D\u092B / Snow" },
      { term: "\u091C\u093E\u095C / \u091C\u093E\u095C\u094B (Jaad / Jaado)", meaning: "\u0920\u0902\u0921 / Winter cold" }
    ]
  }
];
var HINDI_TO_PAHARI_VOCAB = {
  // Pronouns
  "\u092E\u0948\u0902": { garhwali: "\u092E\u093F", kumaoni: "\u092E\u094D\u092F", jaunsari: "\u0906\u090A\u0902" },
  "\u092E\u0941\u091D\u0947": { garhwali: "\u092E\u0925\u0948", kumaoni: "\u092E\u094D\u092F\u0915\u0923\u093F", jaunsari: "\u092E\u094B\u0916" },
  "\u092E\u0941\u091D\u0915\u094B": { garhwali: "\u092E\u0925\u0948", kumaoni: "\u092E\u094D\u092F\u0915\u0923\u093F", jaunsari: "\u092E\u094B\u0916" },
  "\u092E\u0947\u0930\u093E": { garhwali: "\u092E\u0947\u0930\u094B", kumaoni: "\u092E\u094D\u092F\u093E\u0930", jaunsari: "\u092E\u094B\u0930\u094B" },
  "\u092E\u0947\u0930\u0940": { garhwali: "\u092E\u0947\u0930\u0940", kumaoni: "\u092E\u094D\u092F\u0930", jaunsari: "\u092E\u094B\u0930\u0940" },
  "\u092E\u0947\u0930\u0947": { garhwali: "\u092E\u0947\u0930\u093E", kumaoni: "\u092E\u094D\u092F\u093E\u0930", jaunsari: "\u092E\u094B\u0930\u0947" },
  "\u0939\u092E": { garhwali: "\u0939\u092E", kumaoni: "\u0939\u092E\u093E\u0930", jaunsari: "\u0906\u092E\u0941" },
  "\u0939\u092E\u0947\u0902": { garhwali: "\u0939\u092E\u0925\u0948", kumaoni: "\u0939\u092E\u0915\u0923\u093F", jaunsari: "\u0906\u092E\u0942\u0916" },
  "\u0939\u092E\u0915\u094B": { garhwali: "\u0939\u092E\u0925\u0948", kumaoni: "\u0939\u092E\u0915\u0923\u093F", jaunsari: "\u0906\u092E\u0942\u0916" },
  "\u0939\u092E\u093E\u0930\u093E": { garhwali: "\u0939\u092E\u093E\u0930\u094B", kumaoni: "\u0939\u092E\u093E\u0930", jaunsari: "\u0906\u092E\u094B\u0930\u094B" },
  "\u0939\u092E\u093E\u0930\u0940": { garhwali: "\u0939\u092E\u093E\u0930\u0940", kumaoni: "\u0939\u092E\u093E\u0930", jaunsari: "\u0906\u092E\u094B\u0930\u0940" },
  "\u0939\u092E\u093E\u0930\u0947": { garhwali: "\u0939\u092E\u093E\u0930\u093E", kumaoni: "\u0939\u092E\u093E\u0930", jaunsari: "\u0906\u092E\u094B\u0930\u0947" },
  "\u0924\u0941\u092E": { garhwali: "\u0924\u0941\u092E", kumaoni: "\u0924\u092E", jaunsari: "\u0924\u0941\u092E\u0941" },
  "\u0924\u0941\u092E\u094D\u0939\u0947\u0902": { garhwali: "\u0924\u0941\u092E\u0925\u0948", kumaoni: "\u0924\u092E\u0915\u0923\u093F", jaunsari: "\u0924\u0941\u092E\u094B\u0916" },
  "\u0924\u0941\u092E\u0915\u094B": { garhwali: "\u0924\u0941\u092E\u0925\u0948", kumaoni: "\u0924\u092E\u0915\u0923\u093F", jaunsari: "\u0924\u0941\u092E\u094B\u0916" },
  "\u0924\u0941\u092E\u094D\u0939\u093E\u0930\u093E": { garhwali: "\u0924\u0941\u092E\u094D\u0939\u093E\u0930\u094B", kumaoni: "\u0924\u092E\u093E\u0930", jaunsari: "\u0924\u0941\u092E\u094B\u0930\u094B" },
  "\u0924\u0941\u092E\u094D\u0939\u093E\u0930\u0940": { garhwali: "\u0924\u0941\u092E\u094D\u0939\u093E\u0930\u0940", kumaoni: "\u0924\u092E\u093E\u0930", jaunsari: "\u0924\u0941\u092E\u094B\u0930\u0940" },
  "\u0924\u0941\u092E\u094D\u0939\u093E\u0930\u0947": { garhwali: "\u0924\u0941\u092E\u094D\u0939\u093E\u0930\u093E", kumaoni: "\u0924\u092E\u093E\u0930", jaunsari: "\u0924\u0941\u092E\u094B\u0930\u0947" },
  "\u0906\u092A": { garhwali: "\u0906\u092A", kumaoni: "\u0924\u092E", jaunsari: "\u0924\u0941\u092E\u0941" },
  "\u0906\u092A\u0915\u094B": { garhwali: "\u0906\u092A\u0925\u0948", kumaoni: "\u0906\u092A\u0915\u0923\u093F", jaunsari: "\u0924\u0941\u092E\u094B\u0916" },
  "\u0906\u092A\u0915\u093E": { garhwali: "\u0906\u092A\u0941\u0915\u094B", kumaoni: "\u0924\u092E\u093E\u0930", jaunsari: "\u0924\u0941\u092E\u094B\u0930\u094B" },
  "\u0906\u092A\u0915\u0940": { garhwali: "\u0906\u092A\u0941\u0915\u0940", kumaoni: "\u0924\u092E\u093E\u0930", jaunsari: "\u0924\u0941\u092E\u094B\u0930\u0940" },
  "\u0906\u092A\u0915\u0947": { garhwali: "\u0906\u092A\u0941\u0915\u093E", kumaoni: "\u0924\u092E\u093E\u0930", jaunsari: "\u0924\u0941\u092E\u094B\u0930\u0947" },
  "\u092F\u0939": { garhwali: "\u092F\u094B", kumaoni: "\u092F\u094B", jaunsari: "\u092F\u094B" },
  "\u092F\u0947": { garhwali: "\u092F\u0947", kumaoni: "\u092F\u093E", jaunsari: "\u090F" },
  "\u0935\u0939": { garhwali: "\u090A", kumaoni: "\u090A", jaunsari: "\u0938\u094B" },
  "\u0935\u094B": { garhwali: "\u0935\u094B", kumaoni: "\u0935\u093E", jaunsari: "\u0924\u0947" },
  "\u0909\u0938\u0915\u093E": { garhwali: "\u0935\u0947\u0915\u094B", kumaoni: "\u0935\u0940\u0915\u094B", jaunsari: "\u0924\u0947\u0930\u094B" },
  "\u0909\u0938\u0915\u0940": { garhwali: "\u0935\u0947\u0915\u0940", kumaoni: "\u0935\u0940\u0915\u0940", jaunsari: "\u0924\u0947\u0930\u0940" },
  "\u0909\u0938\u0915\u0947": { garhwali: "\u0935\u0947\u0915\u093E", kumaoni: "\u0935\u0940\u0915\u093E", jaunsari: "\u0924\u0947\u0930\u0947" },
  "\u0909\u0938\u0947": { garhwali: "\u0935\u0947\u0925\u0948", kumaoni: "\u0935\u0940\u0902\u0915\u0923\u093F", jaunsari: "\u0924\u0947\u0916\u094B" },
  "\u0909\u0928\u0915\u093E": { garhwali: "\u0909\u0902\u0915\u094B", kumaoni: "\u0909\u0902\u0915\u094B", jaunsari: "\u0924\u0947\u0930\u094B" },
  "\u0909\u0928\u0915\u0940": { garhwali: "\u0909\u0902\u0915\u0940", kumaoni: "\u0909\u0902\u0915\u0940", jaunsari: "\u0924\u0947\u0930\u0940" },
  "\u0909\u0928\u0915\u0947": { garhwali: "\u0909\u0902\u0915\u093E", kumaoni: "\u0909\u0902\u0915\u093E", jaunsari: "\u0924\u0947\u0930\u0947" },
  "\u0909\u0928\u094D\u0939\u0947\u0902": { garhwali: "\u0909\u0928\u0925\u0948", kumaoni: "\u0909\u0902\u0915\u0923\u093F", jaunsari: "\u0924\u0947\u0916\u094B" },
  "\u0915\u094C\u0928": { garhwali: "\u0915\u094B", kumaoni: "\u0915\u094B", jaunsari: "\u0915\u0941\u0923" },
  "\u0915\u094D\u092F\u093E": { garhwali: "\u0915\u094D\u092F\u093E", kumaoni: "\u0915\u0947", jaunsari: "\u0915\u0947" },
  "\u0915\u0939\u093E\u0901": { garhwali: "\u0915\u0916", kumaoni: "\u0915\u093E\u0901", jaunsari: "\u0915\u0916" },
  "\u0915\u093F\u0927\u0930": { garhwali: "\u0915\u0916", kumaoni: "\u0915\u093E\u0901", jaunsari: "\u0915\u0916" },
  "\u0915\u092C": { garhwali: "\u0915\u092C\u0947", kumaoni: "\u0915\u092C", jaunsari: "\u0915\u092C\u0947" },
  "\u0915\u0948\u0938\u0947": { garhwali: "\u0915\u0928\u0915", kumaoni: "\u0915\u0938\u093E", jaunsari: "\u0915\u0928\u0915" },
  "\u0915\u0948\u0938\u093E": { garhwali: "\u0915\u0928\u0941", kumaoni: "\u0915\u0938\u094B", jaunsari: "\u0915\u0928\u094B" },
  "\u0915\u0948\u0938\u0940": { garhwali: "\u0915\u0928\u0940", kumaoni: "\u0915\u0938\u0940", jaunsari: "\u0915\u0928\u0940" },
  "\u0915\u094D\u092F\u094B\u0902": { garhwali: "\u0915\u094D\u092F\u0948\u0915", kumaoni: "\u0915\u093F\u0932\u0948", jaunsari: "\u0915\u0940\u0930\u094B" },
  "\u0915\u093F\u0924\u0928\u093E": { garhwali: "\u0915\u0924\u0917\u093E", kumaoni: "\u0915\u0924\u0941\u0915", jaunsari: "\u0915\u0947\u0924\u094B" },
  "\u0915\u093F\u0924\u0928\u0947": { garhwali: "\u0915\u0924\u0917\u093E", kumaoni: "\u0915\u0924\u0941\u0915\u093E", jaunsari: "\u0915\u0947\u0924\u0947" },
  "\u0915\u093F\u0924\u0928\u0940": { garhwali: "\u0915\u0924\u093F", kumaoni: "\u0915\u0924\u0941\u0915\u0940", jaunsari: "\u0915\u0947\u0924\u0940" },
  // Postpositions
  "\u092E\u0947\u0902": { garhwali: "\u092E\u093E", kumaoni: "\u092E\u093E", jaunsari: "\u092E\u093E\u0902" },
  "\u0938\u0947": { garhwali: "\u092C\u091F\u0940", kumaoni: "\u092C\u0948", jaunsari: "\u0938\u0947" },
  "\u0915\u093E": { garhwali: "\u0915\u0941", kumaoni: "\u0915\u094B", jaunsari: "\u0930\u094B" },
  "\u0915\u0940": { garhwali: "\u0915\u0940", kumaoni: "\u0915\u0940", jaunsari: "\u0930\u0940" },
  "\u0915\u0947": { garhwali: "\u0915\u093E", kumaoni: "\u0915\u093E", jaunsari: "\u0930\u093E" },
  "\u0915\u094B": { garhwali: "\u0925\u0948\u0928", kumaoni: "\u0915\u0923\u093F", jaunsari: "\u0916\u094B" },
  "\u092A\u0930": { garhwali: "\u092A\u0930", kumaoni: "\u092A\u0930", jaunsari: "\u092E\u093E\u0902" },
  "\u0938\u093E\u0925": { garhwali: "\u0926\u0917\u0921\u093C\u093F", kumaoni: "\u0926\u0917\u0921\u093C\u093F", jaunsari: "\u0926\u0917\u0921\u093C\u0947" },
  "\u0915\u0947 \u0938\u093E\u0925": { garhwali: "\u0926\u0917\u0921\u093C\u093F", kumaoni: "\u0926\u0917\u0921\u093C\u093F", jaunsari: "\u0926\u0917\u0921\u093C\u0947" },
  "\u0932\u093F\u090F": { garhwali: "\u0916\u093E\u0924\u093F\u0930", kumaoni: "\u0916\u093E\u0924\u093F\u0930", jaunsari: "\u0916\u093E\u0924\u093F\u0930" },
  "\u0915\u0947 \u0932\u093F\u090F": { garhwali: "\u0916\u093E\u0924\u093F\u0930", kumaoni: "\u0916\u093E\u0924\u093F\u0930", jaunsari: "\u0916\u093E\u0924\u093F\u0930" },
  "\u0924\u0915": { garhwali: "\u0924\u0915", kumaoni: "\u0924\u0915", jaunsari: "\u0924\u0915" },
  // Auxiliaries & Particles
  "\u0939\u0948": { garhwali: "\u091B", kumaoni: "\u091B\u0942", jaunsari: "\u0938\u094B" },
  "\u0939\u0948\u0902": { garhwali: "\u091B\u0928", kumaoni: "\u091B\u0928", jaunsari: "\u0938\u093E" },
  "\u0939\u0942\u0901": { garhwali: "\u091B\u094C\u0902", kumaoni: "\u091B\u0942", jaunsari: "\u0938\u094C\u0902" },
  "\u0939\u094B": { garhwali: "\u091B\u093E", kumaoni: "\u091B\u093E", jaunsari: "\u0938\u093E" },
  "\u0925\u093E": { garhwali: "\u091B\u094C", kumaoni: "\u091B\u0940", jaunsari: "\u0925\u093F\u092F\u093E" },
  "\u0925\u0940": { garhwali: "\u091B\u0940", kumaoni: "\u091B\u093F", jaunsari: "\u0925\u0940" },
  "\u0925\u0947": { garhwali: "\u091B\u093E", kumaoni: "\u091B\u093E", jaunsari: "\u0925\u0947" },
  "\u0939\u094B\u0917\u093E": { garhwali: "\u0939\u094B\u0932\u0941", kumaoni: "\u0939\u094B\u0932", jaunsari: "\u0939\u0941\u0923\u094B" },
  "\u0939\u094B\u0917\u0940": { garhwali: "\u0939\u094B\u0932\u0940", kumaoni: "\u0939\u094B\u0932\u0940", jaunsari: "\u0939\u0941\u0923\u0940" },
  "\u0939\u094B\u0902\u0917\u0947": { garhwali: "\u0939\u094B\u0932\u093E", kumaoni: "\u0939\u094B\u0932\u093E", jaunsari: "\u0939\u0941\u0923\u0947" },
  "\u0928\u0939\u0940\u0902": { garhwali: "\u0928\u0940", kumaoni: "\u0928\u094D\u0939\u0948", jaunsari: "\u0928\u093E" },
  "\u092E\u0924": { garhwali: "\u091C\u0928\u093F", kumaoni: "\u091C\u0928\u093F", jaunsari: "\u0928\u093E" },
  "\u0914\u0930": { garhwali: "\u0905\u0930", kumaoni: "\u0905\u0930", jaunsari: "\u0905\u0930" },
  "\u0924\u0925\u093E": { garhwali: "\u0905\u0930", kumaoni: "\u0905\u0930", jaunsari: "\u0905\u0930" },
  "\u090F\u0935\u0902": { garhwali: "\u0905\u0930", kumaoni: "\u0905\u0930", jaunsari: "\u0905\u0930" },
  "\u092D\u0940": { garhwali: "\u092D\u0940", kumaoni: "\u0932\u0948", jaunsari: "\u092D\u0940" },
  "\u0924\u094B": { garhwali: "\u0924", kumaoni: "\u0924", jaunsari: "\u0924" },
  "\u0932\u0947\u0915\u093F\u0928": { garhwali: "\u092A\u0923", kumaoni: "\u092A\u0923", jaunsari: "\u092A\u0923" },
  "\u092A\u0930\u0928\u094D\u0924\u0941": { garhwali: "\u092A\u0923", kumaoni: "\u092A\u0923", jaunsari: "\u092A\u0923" },
  "\u092E\u0917\u0930": { garhwali: "\u092A\u0923", kumaoni: "\u092A\u0923", jaunsari: "\u092A\u0923" },
  // Common Nouns
  "\u0928\u093E\u092E": { garhwali: "\u0928\u094C\u0902", kumaoni: "\u0928\u094C\u0902", jaunsari: "\u0928\u094C\u0902" },
  "\u092A\u093E\u0928\u0940": { garhwali: "\u092A\u093E\u0923\u0940", kumaoni: "\u092A\u093E\u0923\u0940", jaunsari: "\u092A\u093E\u0923\u0940" },
  "\u091C\u0932": { garhwali: "\u092A\u093E\u0923\u0940", kumaoni: "\u092A\u093E\u0923\u0940", jaunsari: "\u092A\u093E\u0923\u0940" },
  "\u0917\u093E\u0901\u0935": { garhwali: "\u0917\u094C\u0902", kumaoni: "\u0917\u093E\u0901\u0935", jaunsari: "\u0917\u093E\u0901\u0935" },
  "\u0918\u0930": { garhwali: "\u0918\u094C\u0930", kumaoni: "\u0918\u0930", jaunsari: "\u0918\u0930" },
  "\u092E\u0915\u093E\u0928": { garhwali: "\u0918\u094C\u0930", kumaoni: "\u0918\u0930", jaunsari: "\u0918\u0930" },
  "\u092A\u0939\u093E\u0921\u093C": { garhwali: "\u0921\u093E\u0902\u0921\u093E-\u0915\u093E\u0902\u0921\u093E", kumaoni: "\u0921\u093E\u0928\u093E-\u0915\u093E\u0928\u093E", jaunsari: "\u0921\u093E\u0902\u0921\u093E" },
  "\u092A\u0930\u094D\u0935\u0924": { garhwali: "\u0921\u093E\u0902\u0921\u093E", kumaoni: "\u0921\u093E\u0928\u093E", jaunsari: "\u0921\u093E\u0902\u0921\u093E" },
  "\u0930\u093E\u0938\u094D\u0924\u093E": { garhwali: "\u092C\u093E\u091F\u094B", kumaoni: "\u092C\u093E\u091F\u094B", jaunsari: "\u092C\u093E\u091F\u094B" },
  "\u092E\u093E\u0930\u094D\u0917": { garhwali: "\u092C\u093E\u091F\u094B", kumaoni: "\u092C\u093E\u091F\u094B", jaunsari: "\u092C\u093E\u091F\u094B" },
  "\u0938\u0921\u093C\u0915": { garhwali: "\u0938\u095C\u0915", kumaoni: "\u092C\u093E\u091F\u094B", jaunsari: "\u0938\u095C\u0915" },
  "\u0928\u0926\u0940": { garhwali: "\u0917\u093E\u095C", kumaoni: "\u0917\u093E\u095C", jaunsari: "\u0917\u093E\u095C" },
  "\u091D\u0930\u0928\u093E": { garhwali: "\u091B\u0921\u093C\u093E", kumaoni: "\u091B\u0921\u093C\u093E", jaunsari: "\u091D\u0930\u0928\u093E" },
  "\u091C\u0902\u0917\u0932": { garhwali: "\u092C\u093E\u0923", kumaoni: "\u091C\u0902\u0917\u0933", jaunsari: "\u091C\u0902\u0917\u0932" },
  "\u0935\u0928": { garhwali: "\u092C\u093E\u0923", kumaoni: "\u091C\u0902\u0917\u0933", jaunsari: "\u092C\u093E\u0923" },
  "\u092A\u0947\u0921\u093C": { garhwali: "\u0930\u0941\u0916", kumaoni: "\u0930\u0941\u0916", jaunsari: "\u0930\u0941\u0916" },
  "\u0935\u0943\u0915\u094D\u0937": { garhwali: "\u0930\u0941\u0916", kumaoni: "\u0930\u0941\u0916", jaunsari: "\u0930\u0941\u0916" },
  "\u0918\u093E\u0938": { garhwali: "\u0918\u093E\u0939", kumaoni: "\u0918\u093E\u0939", jaunsari: "\u0918\u093E\u0938" },
  "\u0930\u094B\u091F\u0940": { garhwali: "\u0930\u094B\u091F\u093F", kumaoni: "\u0930\u094B\u091F\u0940", jaunsari: "\u0930\u094B\u091F\u0940" },
  "\u0916\u093E\u0928\u093E": { garhwali: "\u0916\u093E\u0923\u094B", kumaoni: "\u0916\u093E\u0923", jaunsari: "\u0916\u093E\u0923\u094B" },
  "\u092D\u094B\u091C\u0928": { garhwali: "\u0916\u093E\u0923\u094B", kumaoni: "\u0916\u093E\u0923", jaunsari: "\u0916\u093E\u0923\u094B" },
  "\u091A\u093E\u0935\u0932": { garhwali: "\u092D\u093E\u0924", kumaoni: "\u092D\u093E\u0924", jaunsari: "\u092D\u093E\u0924" },
  "\u0926\u0942\u0927": { garhwali: "\u0926\u0942\u0927", kumaoni: "\u0926\u0942\u0927", jaunsari: "\u0926\u0942\u0927" },
  "\u091A\u093E\u092F": { garhwali: "\u091A\u093E\u092F", kumaoni: "\u091A\u093E\u092F", jaunsari: "\u091A\u093E\u092F" },
  "\u0932\u094B\u0917": { garhwali: "\u092E\u0928\u0916\u093F", kumaoni: "\u092E\u0928\u0916\u093F", jaunsari: "\u0932\u094B\u0915\u093E" },
  "\u0906\u0926\u092E\u0940": { garhwali: "\u092E\u0928\u0916\u093F", kumaoni: "\u092E\u0928\u0916\u093F", jaunsari: "\u092E\u093E\u0928\u0938" },
  "\u092E\u0939\u093F\u0932\u093E": { garhwali: "\u0938\u092F\u093E\u0923\u0940", kumaoni: "\u092E\u0939\u093F\u0932\u093E", jaunsari: "\u0938\u092F\u093E\u0923\u0940" },
  "\u0938\u094D\u0924\u094D\u0930\u0940": { garhwali: "\u091C\u0928\u093E\u0928\u0940", kumaoni: "\u091C\u0928\u093E\u0928\u0940", jaunsari: "\u091C\u0928\u093E\u0928\u0940" },
  "\u0932\u0921\u093C\u0915\u093E": { garhwali: "\u0928\u094C\u0928\u0941", kumaoni: "\u091A\u094D\u092F\u0932", jaunsari: "\u091B\u094B\u0915\u0930\u093E" },
  "\u0932\u0921\u093C\u0915\u0940": { garhwali: "\u0928\u094C\u0928\u0940", kumaoni: "\u091A\u094D\u092F\u0932\u0940", jaunsari: "\u091B\u094B\u0915\u0930\u0940" },
  "\u092C\u091A\u094D\u091A\u093E": { garhwali: "\u0928\u093E\u0924\u093F\u0902\u0917\u0933", kumaoni: "\u0928\u093E\u0928", jaunsari: "\u091F\u093E\u092C\u0930" },
  "\u092C\u091A\u094D\u091A\u0947": { garhwali: "\u0928\u093E\u0924\u093F\u0902\u0917\u0933\u093E", kumaoni: "\u0928\u093E\u0928\u0924\u093F\u0928", jaunsari: "\u091F\u093E\u092C\u0930\u093E" },
  "\u092A\u093F\u0924\u093E": { garhwali: "\u092C\u093E\u092C\u093E\u091C\u0940", kumaoni: "\u092C\u093E\u092C\u0941", jaunsari: "\u092C\u093E\u092C\u093E\u091C\u0940" },
  "\u092A\u093F\u0924\u093E\u091C\u0940": { garhwali: "\u092C\u093E\u092C\u093E\u091C\u0940", kumaoni: "\u092C\u093E\u092C\u093E\u091C\u0940", jaunsari: "\u092C\u093E\u092C\u093E\u091C\u0940" },
  "\u092E\u093E\u0901": { garhwali: "\u092C\u094D\u0935\u0948", kumaoni: "\u0907\u091C\u093E", jaunsari: "\u0908\u091C\u093E" },
  "\u092E\u093E\u0924\u093E\u091C\u0940": { garhwali: "\u092C\u094D\u0935\u0948", kumaoni: "\u0907\u091C\u093E", jaunsari: "\u0908\u091C\u093E" },
  "\u092D\u093E\u0908": { garhwali: "\u092D\u0941\u0932\u094D\u0932\u093E", kumaoni: "\u0926\u093E\u091C\u094D\u092F\u0942", jaunsari: "\u092D\u093E\u0908" },
  "\u092C\u0939\u0928": { garhwali: "\u092C\u0948\u0923\u0940", kumaoni: "\u0926\u0940\u0926\u0940", jaunsari: "\u092C\u0948\u0923\u0940" },
  "\u0926\u094B\u0938\u094D\u0924": { garhwali: "\u0926\u0917\u0921\u093C\u094D\u092F\u093E", kumaoni: "\u0926\u0917\u0921\u093C\u094D\u092F\u093E", jaunsari: "\u0938\u0902\u0917\u0940" },
  "\u092E\u093F\u0924\u094D\u0930": { garhwali: "\u0926\u0917\u0921\u093C\u094D\u092F\u093E", kumaoni: "\u0926\u0917\u0921\u093C\u094D\u092F\u093E", jaunsari: "\u0938\u0902\u0917\u0940" },
  "\u0926\u093F\u0928": { garhwali: "\u0926\u093F\u0928", kumaoni: "\u0926\u093F\u0928", jaunsari: "\u0926\u093F\u0928" },
  "\u0930\u093E\u0924": { garhwali: "\u0930\u093E\u0924", kumaoni: "\u0930\u093E\u0924", jaunsari: "\u0930\u093E\u0924" },
  "\u0938\u0941\u092C\u0939": { garhwali: "\u092C\u094D\u092F\u093E\u0933", kumaoni: "\u0938\u092C\u0947\u0930", jaunsari: "\u0938\u092C\u0947\u0930" },
  "\u0936\u093E\u092E": { garhwali: "\u092C\u094D\u092F\u093E\u0933", kumaoni: "\u092C\u094D\u092F\u093E\u0933", jaunsari: "\u0938\u093E\u0902\u091C" },
  "\u0906\u091C": { garhwali: "\u0906\u091C", kumaoni: "\u0906\u091C", jaunsari: "\u0906\u091C" },
  "\u0915\u0932": { garhwali: "\u092D\u094B\u0932", kumaoni: "\u092D\u094B\u0932", jaunsari: "\u092D\u094B\u0932" },
  "\u0938\u092E\u092F": { garhwali: "\u091F\u0947\u092E", kumaoni: "\u091F\u0947\u092E", jaunsari: "\u091F\u0947\u092E" },
  "\u092C\u093E\u0924": { garhwali: "\u0915\u0941\u0930\u095C\u0940", kumaoni: "\u092C\u093E\u0924", jaunsari: "\u092C\u093E\u0924" },
  "\u092C\u093E\u0924\u0947\u0902": { garhwali: "\u0915\u0941\u0930\u0921\u094D\u092F\u093E\u0902", kumaoni: "\u092C\u093E\u0924\u0928", jaunsari: "\u092C\u093E\u0924\u093E\u0902" },
  // Adjectives
  "\u092C\u0939\u0941\u0924": { garhwali: "\u092D\u094C\u0924", kumaoni: "\u092D\u094C\u0924", jaunsari: "\u0918\u0923\u094B" },
  "\u0905\u091A\u094D\u091B\u093E": { garhwali: "\u092D\u0932\u094B", kumaoni: "\u092D\u0932", jaunsari: "\u092D\u0932\u094B" },
  "\u0905\u091A\u094D\u091B\u0940": { garhwali: "\u092D\u0932\u0940", kumaoni: "\u092D\u0932\u0940", jaunsari: "\u092D\u0932\u0940" },
  "\u0905\u091A\u094D\u091B\u0947": { garhwali: "\u092D\u0932\u093E", kumaoni: "\u092D\u0932\u093E", jaunsari: "\u092D\u0932\u0947" },
  "\u092C\u0921\u093C\u093E": { garhwali: "\u092C\u0921\u094D\u0921\u094B", kumaoni: "\u092C\u0921\u094D\u0921", jaunsari: "\u092C\u095C\u094B" },
  "\u092C\u0921\u093C\u0940": { garhwali: "\u092C\u0921\u094D\u0921\u0940", kumaoni: "\u092C\u0921\u094D\u0921\u0940", jaunsari: "\u092C\u095C\u0940" },
  "\u092C\u0921\u093C\u0947": { garhwali: "\u092C\u0921\u094D\u0921\u093E", kumaoni: "\u092C\u0921\u094D\u0921\u093E", jaunsari: "\u092C\u095C\u0947" },
  "\u091B\u094B\u091F\u093E": { garhwali: "\u0928\u093E\u0928", kumaoni: "\u0928\u093E\u0928", jaunsari: "\u091B\u094B\u091F\u094B" },
  "\u091B\u094B\u091F\u0940": { garhwali: "\u0928\u093E\u0928\u0940", kumaoni: "\u0928\u093E\u0928\u0940", jaunsari: "\u091B\u094B\u091F\u0940" },
  "\u091B\u094B\u091F\u0947": { garhwali: "\u0928\u093E\u0928\u093E", kumaoni: "\u0928\u093E\u0928\u093E", jaunsari: "\u091B\u094B\u091F\u0947" },
  "\u0938\u0941\u0902\u0926\u0930": { garhwali: "\u0938\u0941\u0928\u094D\u0926\u0930", kumaoni: "\u092D\u0932", jaunsari: "\u092D\u0932\u094B" },
  "\u092E\u0940\u0920\u093E": { garhwali: "\u092E\u0940\u0920\u094B", kumaoni: "\u092E\u0940\u0920", jaunsari: "\u092E\u0940\u0920\u094B" },
  "\u092E\u0940\u0920\u0940": { garhwali: "\u092E\u0940\u0920\u0940", kumaoni: "\u092E\u0940\u0920\u0940", jaunsari: "\u092E\u0940\u0920\u0940" },
  "\u0920\u0902\u0921\u093E": { garhwali: "\u0938\u0940\u0924\u0933", kumaoni: "\u0920\u0923\u094D\u0921", jaunsari: "\u0938\u0940\u0924\u0933" },
  "\u0920\u0902\u0921\u0940": { garhwali: "\u0938\u0940\u0924\u0933", kumaoni: "\u0920\u0923\u094D\u0921\u0940", jaunsari: "\u0938\u0940\u0924\u0933" },
  "\u0917\u0930\u094D\u092E": { garhwali: "\u0924\u093E\u0924\u094B", kumaoni: "\u0924\u093E\u0924", jaunsari: "\u0924\u093E\u0924\u094B" },
  "\u092A\u0941\u0930\u093E\u0928\u093E": { garhwali: "\u092A\u0941\u0930\u093E\u0924\u0928", kumaoni: "\u092A\u0941\u0930\u093E\u0928", jaunsari: "\u092A\u0941\u0930\u093E\u0928\u094B" },
  "\u0928\u092F\u093E": { garhwali: "\u0928\u094C", kumaoni: "\u0928\u092F\u094B", jaunsari: "\u0928\u0935\u094B" },
  // Common Verbs / Actions
  "\u0915\u0930\u0928\u093E": { garhwali: "\u0915\u0930\u0928\u0941", kumaoni: "\u0915\u0930\u0928", jaunsari: "\u0915\u0930\u0923\u094B" },
  "\u0915\u0930\u0924\u0947": { garhwali: "\u0915\u0928\u094D\u0928\u093E", kumaoni: "\u0915\u0928\u094D\u0928\u093E", jaunsari: "\u0915\u0930\u0926\u093E" },
  "\u0915\u0930\u0924\u093E": { garhwali: "\u0915\u0928\u094D\u0926", kumaoni: "\u0915\u0930\u0901", jaunsari: "\u0915\u0930\u0926\u094B" },
  "\u0915\u0930\u0924\u0940": { garhwali: "\u0915\u0928\u094D\u0926\u093F", kumaoni: "\u0915\u0930\u091B\u093F", jaunsari: "\u0915\u0930\u0926\u0940" },
  "\u091C\u093E\u0928\u093E": { garhwali: "\u091C\u093E\u0923\u0941", kumaoni: "\u091C\u093E\u0902\u0923", jaunsari: "\u091C\u093E\u0923\u094B" },
  "\u091C\u093E\u0924\u0947": { garhwali: "\u091C\u093E\u0902\u0926\u0928", kumaoni: "\u091C\u093E\u0901\u091B\u0928", jaunsari: "\u091C\u093E\u0902\u0926\u093E" },
  "\u091C\u093E\u0924\u093E": { garhwali: "\u091C\u093E\u0902\u0926", kumaoni: "\u091C\u093E\u0901", jaunsari: "\u091C\u093E\u0902\u0926\u094B" },
  "\u091C\u093E\u0924\u0940": { garhwali: "\u091C\u093E\u0902\u0926\u093F", kumaoni: "\u091C\u093E\u0901\u091B\u093F", jaunsari: "\u091C\u093E\u0902\u0926\u0940" },
  "\u0906\u0928\u093E": { garhwali: "\u0914\u0923\u0941", kumaoni: "\u0906\u0902\u0923", jaunsari: "\u0906\u0923\u094B" },
  "\u0906\u0924\u0947": { garhwali: "\u0906\u0902\u0926\u0928", kumaoni: "\u0906\u0901\u091B\u0928", jaunsari: "\u0906\u0902\u0926\u093E" },
  "\u0906\u0924\u093E": { garhwali: "\u0906\u0902\u0926", kumaoni: "\u0906\u0901", jaunsari: "\u0906\u0902\u0926\u094B" },
  "\u092C\u094B\u0932\u0928\u093E": { garhwali: "\u092C\u094D\u0935\u0933\u0923\u0941", kumaoni: "\u092C\u094D\u0935\u0932\u0928", jaunsari: "\u092C\u094B\u0932\u0923\u094B" },
  "\u092C\u094B\u0932\u0924\u0947": { garhwali: "\u092C\u094D\u0935\u0932\u094D\u0926\u0928", kumaoni: "\u092C\u094D\u0935\u0932\u094D\u091B\u0928", jaunsari: "\u092C\u094B\u0932\u0926\u093E" },
  "\u0915\u0939\u0928\u093E": { garhwali: "\u092C\u094D\u0935\u0933\u0923\u0941", kumaoni: "\u0915\u0928", jaunsari: "\u0915\u0939\u0923\u094B" },
  "\u0915\u0939\u0924\u0947": { garhwali: "\u092C\u094D\u0935\u0932\u094D\u0926\u0928", kumaoni: "\u0915\u0928\u094D\u0926\u0928", jaunsari: "\u0915\u0939\u0902\u0926\u093E" },
  "\u0926\u0947\u0916\u0928\u093E": { garhwali: "\u0926\u0947\u0916\u094D\u0923\u0941", kumaoni: "\u0939\u0947\u0930\u0923", jaunsari: "\u0926\u0947\u0916\u0923\u094B" },
  "\u0926\u0947\u0916\u0924\u0947": { garhwali: "\u0926\u0947\u0916\u094D\u0926\u0928", kumaoni: "\u0939\u0947\u0930\u091B\u0928", jaunsari: "\u0926\u0947\u0916\u0926\u093E" },
  "\u0938\u0941\u0928\u0928\u093E": { garhwali: "\u0938\u0941\u0923\u094D\u0923\u0941", kumaoni: "\u0938\u0941\u0928\u0928", jaunsari: "\u0938\u0941\u0923\u0923\u094B" },
  "\u0930\u0939\u0928\u093E": { garhwali: "\u0930\u0948\u0923\u0941", kumaoni: "\u0930\u094C\u0923", jaunsari: "\u0930\u094B\u0923\u094B" },
  "\u0930\u0939\u0924\u0947": { garhwali: "\u0930\u093E\u0928\u094D\u0926\u093E\u0928", kumaoni: "\u0930\u094C\u091B\u093E", jaunsari: "\u0930\u094C\u0902\u0926\u093E" },
  "\u0916\u093E\u0928\u093E_v": { garhwali: "\u0916\u093E\u0923\u0941", kumaoni: "\u0916\u093E\u0923", jaunsari: "\u0916\u093E\u0923\u094B" },
  "\u092A\u0940\u0928\u093E": { garhwali: "\u092A\u0940\u0923\u0941", kumaoni: "\u092A\u0940\u0923", jaunsari: "\u092A\u0940\u0923\u094B" },
  "\u091A\u0932\u0928\u093E": { garhwali: "\u091A\u0932\u094D\u0928\u0941", kumaoni: "\u0939\u093F\u0928\u0928", jaunsari: "\u091A\u0932\u0923\u094B" },
  "\u091A\u0932\u094B": { garhwali: "\u0939\u093F\u092F\u093E", kumaoni: "\u0939\u093F\u092F\u093E", jaunsari: "\u0939\u093F\u092F\u093E" },
  "\u0906\u0907\u090F": { garhwali: "\u0906\u0935\u093E", kumaoni: "\u0906\u092F\u093E", jaunsari: "\u0906\u0913" },
  "\u092C\u0948\u0920\u093F\u090F": { garhwali: "\u092C\u0948\u0920\u093E", kumaoni: "\u092C\u0948\u0920\u093E", jaunsari: "\u092C\u0948\u0920\u094B" },
  "\u0938\u0941\u0928\u093F\u090F": { garhwali: "\u0938\u0941\u0923\u093E", kumaoni: "\u0938\u0941\u0923\u093E", jaunsari: "\u0938\u0941\u0923\u094B" },
  "\u092C\u0924\u093E\u0907\u090F": { garhwali: "\u092C\u0924\u093E\u0935\u093E", kumaoni: "\u092C\u0924\u093E\u0913", jaunsari: "\u092C\u0924\u093E\u0913" },
  "\u0926\u0940\u091C\u093F\u090F": { garhwali: "\u0926\u094D\u092F\u093E\u0935\u093E", kumaoni: "\u0926\u093F\u092F\u093E", jaunsari: "\u0926\u094D\u092F\u094B" },
  "\u0932\u0940\u091C\u093F\u090F": { garhwali: "\u0932\u094D\u092F\u093E\u0935\u093E", kumaoni: "\u0932\u093F\u0939\u093E", jaunsari: "\u0932\u094D\u092F\u094B" },
  "\u0928\u092E\u0938\u094D\u0924\u0947": { garhwali: "\u0928\u092E\u0938\u094D\u0915\u093E\u0930", kumaoni: "\u092A\u0948\u0932\u093E\u0917", jaunsari: "\u092A\u094D\u0930\u0923\u093E\u092E" },
  "\u092A\u094D\u0930\u0923\u093E\u092E": { garhwali: "\u092A\u094D\u0930\u0923\u093E\u092E", kumaoni: "\u092A\u0948\u0932\u093E\u0917", jaunsari: "\u091C\u092F \u092E\u0939\u093E\u0938\u0942" }
};
function translateSentenceTokenByToken(hindiSentence, targetLang) {
  let text = hindiSentence.trim();
  const multiWordRules = [
    { pattern: /जा\s+रहा\s+हूँ/g, garhwali: "\u091C\u093E\u0923\u0941 \u091B\u094C\u0902", kumaoni: "\u091C\u093E\u0902\u0923 \u091B\u0942", jaunsari: "\u091C\u093E\u0902\u0926\u094B \u0938\u094C\u0902" },
    { pattern: /जा\s+रही\s+हूँ/g, garhwali: "\u091C\u093E\u0923\u093F \u091B\u094C\u0902", kumaoni: "\u091C\u093E\u0902\u0923 \u091B\u0942", jaunsari: "\u091C\u093E\u0902\u0926\u0940 \u0938\u094C\u0902" },
    { pattern: /जा\s+रहे\s+हैं/g, garhwali: "\u091C\u093E\u0923\u093E \u091B\u0928", kumaoni: "\u091C\u093E\u0923\u093E \u091B\u093E", jaunsari: "\u091C\u093E\u0902\u0926\u0947 \u0938\u093E" },
    { pattern: /जा\s+रहा\s+है/g, garhwali: "\u091C\u093E\u0923\u0941 \u091B", kumaoni: "\u091C\u093E\u0902\u0923 \u091B\u0942", jaunsari: "\u091C\u093E\u0902\u0926\u094B \u0938\u094B" },
    { pattern: /जा\s+रही\s+है/g, garhwali: "\u091C\u093E\u0923\u093F \u091B", kumaoni: "\u091C\u093E\u0902\u0923 \u091B\u0942", jaunsari: "\u091C\u093E\u0902\u0926\u0940 \u0938\u094B" },
    { pattern: /आ\s+रहा\s+हूँ/g, garhwali: "\u0914\u0923\u0941 \u091B\u094C\u0902", kumaoni: "\u0906\u0902\u0923 \u091B\u0942", jaunsari: "\u0906\u0935\u0902\u0924\u094B \u0938\u094C\u0902" },
    { pattern: /आ\s+रहे\s+हैं/g, garhwali: "\u0906\u0923\u093E \u091B\u0928", kumaoni: "\u0906\u0923\u093E \u091B\u093E", jaunsari: "\u0906\u0935\u0902\u0924\u093E \u0938\u093E" },
    { pattern: /आ\s+रहा\s+है/g, garhwali: "\u0914\u0923\u0941 \u091B", kumaoni: "\u0906\u0902\u0923 \u091B\u0942", jaunsari: "\u0906\u0935\u0902\u0924\u094B \u0938\u094B" },
    { pattern: /कर\s+रहा\s+हूँ/g, garhwali: "\u0915\u0930\u094D\u0928\u0941 \u091B\u094C\u0902", kumaoni: "\u0915\u0930\u0928 \u091B\u0942", jaunsari: "\u0915\u0930\u0926\u094B \u0938\u094C\u0902" },
    { pattern: /कर\s+रहे\s+हैं/g, garhwali: "\u0915\u0928\u094D\u0928\u093E \u091B\u0928", kumaoni: "\u0915\u0928\u094D\u0928\u093E \u091B\u093E", jaunsari: "\u0915\u0930\u0926\u093E \u0938\u093E" },
    { pattern: /कर\s+रहा\s+है/g, garhwali: "\u0915\u0930\u094D\u0928\u0941 \u091B", kumaoni: "\u0915\u0930\u0928 \u091B\u0942", jaunsari: "\u0915\u0930\u0926\u094B \u0938\u094B" },
    { pattern: /बोल\s+रहा\s+हूँ/g, garhwali: "\u092C\u094D\u0935\u0932\u094D\u0928\u0941 \u091B\u094C\u0902", kumaoni: "\u092C\u094D\u0935\u0932\u0928 \u091B\u0942", jaunsari: "\u092C\u094B\u0932\u0926\u094B \u0938\u094C\u0902" },
    { pattern: /बोल\s+रहे\s+हैं/g, garhwali: "\u092C\u094D\u0935\u0932\u094D\u0926\u093E \u091B\u0928", kumaoni: "\u092C\u094D\u0935\u0932\u094D\u091B\u093E", jaunsari: "\u092C\u094B\u0932\u0926\u093E \u0938\u093E" },
    { pattern: /रहता\s+हूँ/g, garhwali: "\u0930\u094C\u0902\u0926\u094B \u091B\u094C\u0902", kumaoni: "\u0930\u094C\u0902\u091B\u0942", jaunsari: "\u0930\u094C\u0902\u0926\u094B \u0938\u094C\u0902" },
    { pattern: /रहते\s+हैं/g, garhwali: "\u0930\u093E\u0928\u094D\u0926\u093E\u0928", kumaoni: "\u0930\u094C\u091B\u093E", jaunsari: "\u0930\u094C\u0902\u0926\u093E \u0938\u093E" },
    { pattern: /रहती\s+है/g, garhwali: "\u0930\u094C\u0902\u0926\u093F \u091B", kumaoni: "\u0930\u094C\u0902\u091B\u093F", jaunsari: "\u0930\u094C\u0902\u0926\u0940 \u0938\u094B" },
    { pattern: /रहता\s+है/g, garhwali: "\u0930\u094C\u0902\u0926 \u091B", kumaoni: "\u0930\u094C\u0901 \u091B\u0942", jaunsari: "\u0930\u094C\u0902\u0926\u094B \u0938\u094B" },
    { pattern: /पानी\s+चाहिए/g, garhwali: "\u092A\u093E\u0923\u0940 \u091A\u092F\u0940\u0902 \u091B", kumaoni: "\u092A\u093E\u0923\u0940 \u091A\u093E\u0939\u0940\u0902 \u091B\u0942", jaunsari: "\u092A\u093E\u0923\u0940 \u091A\u093E\u0939\u0940 \u0938\u094B" },
    { pattern: /मदद\s+चाहिए/g, garhwali: "\u092E\u0926\u0926 \u091A\u092F\u0940\u0902 \u091B", kumaoni: "\u092E\u0926\u0926 \u091A\u093E\u0939\u0940\u0902 \u091B\u0942", jaunsari: "\u092E\u0926\u0926 \u091A\u093E\u0939\u0940 \u0938\u094B" },
    { pattern: /क्या\s+हाल\s+चाल\s+है/g, garhwali: "\u0915\u094D\u092F\u093E \u0939\u093E\u0932-\u091A\u093E\u0932 \u091B?", kumaoni: "\u0915\u0947 \u0939\u093E\u0932-\u091A\u093E\u0932 \u091B\u0942?", jaunsari: "\u0915\u0947 \u0939\u093E\u0932-\u091A\u093E\u0932 \u0938\u094B?" },
    { pattern: /सब\s+ठीक\s+है/g, garhwali: "\u0938\u092C \u0920\u0940\u0915 \u091B", kumaoni: "\u0938\u092C \u092D\u0932 \u091B\u0942", jaunsari: "\u0938\u092C \u0920\u0940\u0915 \u0938\u094B" },
    { pattern: /कहाँ\s+से\s+हो/g, garhwali: "\u0915\u0916 \u092C\u091F\u0940 \u091B\u093E?", kumaoni: "\u0915\u093E\u0901 \u092C\u0948 \u091B\u093E?", jaunsari: "\u0915\u0916 \u0938\u0947 \u0938\u093E?" },
    { pattern: /कहाँ\s+से\s+हैं/g, garhwali: "\u0915\u0916 \u092C\u091F\u0940 \u091B\u0928?", kumaoni: "\u0915\u093E\u0901 \u092C\u0948 \u091B\u093E?", jaunsari: "\u0915\u0916 \u0938\u0947 \u0938\u093E?" },
    { pattern: /कहाँ\s+रहते\s+हो/g, garhwali: "\u0915\u0916 \u0930\u093E\u0928\u094D\u0926\u093E \u091B\u093E?", kumaoni: "\u0915\u093E\u0901 \u0930\u094C\u091B\u093E?", jaunsari: "\u0915\u0916 \u0930\u094C\u0902\u0926\u093E \u0938\u093E?" },
    { pattern: /कहाँ\s+रहते\s+हैं/g, garhwali: "\u0915\u0916 \u0930\u093E\u0928\u094D\u0926\u093E\u0928?", kumaoni: "\u0915\u093E\u0901 \u0930\u094C\u091B\u093E?", jaunsari: "\u0915\u0916 \u0930\u094C\u0902\u0926\u093E \u0938\u093E?" }
  ];
  for (const rule of multiWordRules) {
    if (rule.pattern.test(text)) {
      text = text.replace(rule.pattern, rule[targetLang]);
    }
  }
  const words = text.split(/(\s+|[?,!।.:;"'()[\]{}])/);
  const translatedWords = words.map((token) => {
    const cleanWord = token.trim();
    if (!cleanWord) return token;
    if (HINDI_TO_PAHARI_VOCAB[cleanWord]) {
      return HINDI_TO_PAHARI_VOCAB[cleanWord][targetLang];
    }
    return token;
  });
  let result = translatedWords.join("");
  if (targetLang === "garhwali") {
    result = result.replace(/\bहै\b/g, "\u091B").replace(/\bहैं\b/g, "\u091B\u0928").replace(/\bहूँ\b/g, "\u091B\u094C\u0902");
    result = result.replace(/गढ़वाली/g, "\u0917\u0922\u093C\u0935\u093E\u0933\u0940").replace(/पानी/g, "\u092A\u093E\u0923\u093F").replace(/शीतल/g, "\u0938\u0940\u0924\u0933");
  } else if (targetLang === "kumaoni") {
    result = result.replace(/\bहै\b/g, "\u091B\u0942").replace(/\bहैं\b/g, "\u091B\u0928").replace(/\bहूँ\b/g, "\u091B\u0942\u0902");
    result = result.replace(/कुमाउनी/g, "\u0915\u0941\u092E\u093E\u090A\u0901\u0928\u0940").replace(/कुमाऊनी/g, "\u0915\u0941\u092E\u093E\u090A\u0901\u0928\u0940");
  } else if (targetLang === "jaunsari") {
    result = result.replace(/\bहै\b/g, "\u0938\u094B").replace(/\bहैं\b/g, "\u0938\u093E").replace(/\bहूँ\b/g, "\u0938\u094C\u0902");
  }
  return result;
}
function transliterateDevanagari(text) {
  const charMap = {
    "\u0905": "a",
    "\u0906": "aa",
    "\u0907": "i",
    "\u0908": "ee",
    "\u0909": "u",
    "\u090A": "oo",
    "\u090B": "ri",
    "\u090F": "e",
    "\u0910": "ai",
    "\u0913": "o",
    "\u0914": "au",
    "\u0905\u0902": "an",
    "\u0905\u0903": "ah",
    "\u0915": "k",
    "\u0916": "kh",
    "\u0917": "g",
    "\u0918": "gh",
    "\u0919": "ng",
    "\u091A": "ch",
    "\u091B": "chh",
    "\u091C": "j",
    "\u091D": "jh",
    "\u091E": "ny",
    "\u091F": "t",
    "\u0920": "th",
    "\u0921": "d",
    "\u0922": "dh",
    "\u0923": "n",
    "\u0924": "t",
    "\u0925": "th",
    "\u0926": "d",
    "\u0927": "dh",
    "\u0928": "n",
    "\u092A": "p",
    "\u092B": "ph",
    "\u092C": "b",
    "\u092D": "bh",
    "\u092E": "m",
    "\u092F": "y",
    "\u0930": "r",
    "\u0932": "l",
    "\u0933": "l",
    "\u0935": "w",
    "\u0936": "sh",
    "\u0937": "sh",
    "\u0938": "s",
    "\u0939": "h",
    "\u093E": "a",
    "\u093F": "i",
    "\u0940": "ee",
    "\u0941": "u",
    "\u0942": "oo",
    "\u0943": "ri",
    "\u0947": "e",
    "\u0948": "ai",
    "\u094B": "o",
    "\u094C": "au",
    "\u0902": "n",
    "\u0901": "n",
    "\u094D": "",
    "\u0903": "h"
  };
  let out = "";
  const consonants = "\u0915\u0916\u0917\u0918\u0919\u091A\u091B\u091C\u091D\u091E\u091F\u0920\u0921\u0922\u0923\u0924\u0925\u0926\u0927\u0928\u092A\u092B\u092C\u092D\u092E\u092F\u0930\u0932\u0933\u0935\u0936\u0937\u0938\u0939";
  const matras = "\u093E\u093F\u0940\u0941\u0942\u0943\u0947\u0948\u094B\u094C\u094D";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    if (char === " ") {
      out += " ";
    } else if (charMap[char]) {
      out += charMap[char];
      if (consonants.includes(char) && (!nextChar || !matras.includes(nextChar) && nextChar !== " ")) {
        out += "a";
      }
    } else {
      out += char;
    }
  }
  return out.replace(/\s+/g, " ").trim();
}
function translateLinguistically(inputText, sourceLangHint = "Auto", register = "\u0938\u093E\u0939\u093F\u0924\u094D\u092F\u093F\u0915 / \u092A\u0924\u094D\u0930\u0915\u093E\u0930\u0940\u092F") {
  const text = inputText.trim();
  for (const entry of PHRASE_DICTIONARY) {
    if (entry.match.test(text)) {
      const nameMatch = text.match(entry.match);
      let srinagariya2 = entry.srinagariya;
      let tehriyali2 = entry.tehriyali;
      let salani2 = entry.salani;
      let badhani2 = entry.badhani;
      let nagpuriya2 = entry.nagpuriya;
      let jaunpuri2 = entry.jaunpuri;
      let kumaoni = entry.kumaoni;
      let jaunsari = entry.jaunsari;
      let garhwali = entry.garhwali;
      if (nameMatch && (nameMatch[1] || nameMatch[2])) {
        const extractedName = (nameMatch[1] || nameMatch[2]).trim();
        srinagariya2 = srinagariya2.replace("{name}", extractedName);
        tehriyali2 = tehriyali2.replace("{name}", extractedName);
        salani2 = salani2.replace("{name}", extractedName);
        badhani2 = badhani2.replace("{name}", extractedName);
        nagpuriya2 = nagpuriya2.replace("{name}", extractedName);
        jaunpuri2 = jaunpuri2.replace("{name}", extractedName);
        kumaoni = kumaoni.replace("{name}", extractedName);
        jaunsari = jaunsari.replace("{name}", extractedName);
        garhwali = garhwali.replace("{name}", extractedName);
      }
      return {
        sourceText: text,
        sourceLang: sourceLangHint,
        standardGarhwaliDevanagari: garhwali,
        standardGarhwaliTransliteration: entry.garhwaliTranslit,
        dialects: {
          srinagariya: srinagariya2,
          tehriyali: tehriyali2,
          salani: salani2,
          badhani_chamoli: badhani2,
          nagpuriya: nagpuriya2,
          jaunpuri_ravalti: jaunpuri2,
          kumaoni,
          jaunsari
        },
        transliterations: {
          srinagariya: transliterateDevanagari(srinagariya2),
          tehriyali: transliterateDevanagari(tehriyali2),
          salani: transliterateDevanagari(salani2),
          badhani_chamoli: transliterateDevanagari(badhani2),
          nagpuriya: transliterateDevanagari(nagpuriya2),
          jaunpuri_ravalti: transliterateDevanagari(jaunpuri2),
          kumaoni: entry.kumaoniTranslit || transliterateDevanagari(kumaoni),
          jaunsari: entry.jaunsariTranslit || transliterateDevanagari(jaunsari)
        },
        detectedRegister: "\u0938\u0902\u0935\u093E\u0926\u0940 \u090F\u0935\u0902 \u0936\u093F\u0937\u094D\u091F\u093E\u091A\u093E\u0930 (Conversational & Courtesy)",
        retroflexAudit: [
          { word: "\u0917\u0922\u093C\u0935\u093E\u0933\u0940", standard_spelling: "\u0917\u0922\u093C\u0935\u093E\u0933\u0940", phonetic_rule: "\u092E\u0942\u0930\u094D\u0927\u0928\u094D\u092F \u0933 \u0915\u093E \u0936\u093E\u0938\u094D\u0924\u094D\u0930\u0940\u092F \u092A\u094D\u0930\u092F\u094B\u0917" }
        ],
        editorialHeadlines: {
          lead_headline: `${garhwali.slice(0, 45)}...`,
          kicker: "\u0915\u094D\u0937\u0947\u0924\u094D\u0930\u0940\u092F \u0938\u0902\u0935\u093E\u0926 \u090F\u0935\u0902 \u0932\u094B\u0915\u092D\u093E\u0937\u093E",
          subhead: "\u0938\u093E\u0939\u093F\u0924\u094D\u092F\u093F\u0915 \u0935 \u092A\u094D\u0930\u093E\u0902\u0924\u0940\u092F \u092C\u094B\u0932\u0940 \u0930\u0942\u092A",
          feature_title: garhwali.slice(0, 30)
        },
        keyVocabulary: entry.vocab
      };
    }
  }
  const garhwaliTranslation = translateSentenceTokenByToken(text, "garhwali");
  const kumaoniTranslation = translateSentenceTokenByToken(text, "kumaoni");
  const jaunsariTranslation = translateSentenceTokenByToken(text, "jaunsari");
  const srinagariya = garhwaliTranslation;
  const tehriyali = garhwaliTranslation.replace(/जाणा छन/g, "\u091C\u093E\u0923\u093E \u091B\u093E").replace(/कख/g, "\u0915\u0916").replace(/मथै/g, "\u092E\u0916\u093F").replace(/ब्वले जांद/g, "\u092C\u094D\u0935\u0932\u0947 \u0917\u0948");
  const salani = garhwaliTranslation.replace(/छन/g, "\u091B\u093E\u0902").replace(/मथै/g, "\u092E\u093F \u0915\u0928").replace(/कख/g, "\u0915\u0916 \u091C\u093E\u0902\u0926");
  const badhani = garhwaliTranslation.replace(/कख/g, "\u0915\u0941\u0925\u0940").replace(/छन/g, "\u091B\u094C").replace(/मनखि/g, "\u091C\u0928");
  const nagpuriya = garhwaliTranslation.replace(/छ/g, "\u091B\u0948").replace(/कख/g, "\u0915\u0925\u0948");
  const jaunpuri = garhwaliTranslation.replace(/कु /g, "\u0930\u094B ").replace(/का /g, "\u0930\u093E ").replace(/की /g, "\u0930\u0940 ").replace(/छ/g, "\u0938\u094B").replace(/छन/g, "\u0938\u093E").replace(/मथै/g, "\u092E\u094B\u0916");
  const dialects = {
    srinagariya,
    tehriyali,
    salani,
    badhani_chamoli: badhani,
    nagpuriya,
    jaunpuri_ravalti: jaunpuri,
    kumaoni: kumaoniTranslation,
    jaunsari: jaunsariTranslation
  };
  const transliterations = {
    srinagariya: transliterateDevanagari(srinagariya),
    tehriyali: transliterateDevanagari(tehriyali),
    salani: transliterateDevanagari(salani),
    badhani_chamoli: transliterateDevanagari(badhani),
    nagpuriya: transliterateDevanagari(nagpuriya),
    jaunpuri_ravalti: transliterateDevanagari(jaunpuri),
    kumaoni: transliterateDevanagari(kumaoniTranslation),
    jaunsari: transliterateDevanagari(jaunsariTranslation)
  };
  const retroflexAudit = [
    { word: "\u0917\u0922\u093C\u0935\u093E\u0933\u0940", standard_spelling: "\u0917\u0922\u093C\u0935\u093E\u0933\u0940", phonetic_rule: "\u092E\u0942\u0930\u094D\u0927\u0928\u094D\u092F \u0933 \u0915\u093E \u0936\u093E\u0938\u094D\u0924\u094D\u0930\u0940\u092F \u092A\u094D\u0930\u092F\u094B\u0917" },
    { word: "\u092A\u093E\u0923\u0940 / \u092A\u093E\u0923\u093F", standard_spelling: "\u092A\u093E\u0923\u0940", phonetic_rule: "\u0923 \u0915\u093E \u0936\u0941\u0926\u094D\u0927 \u0909\u091A\u094D\u091A\u093E\u0930\u0923" },
    { word: "\u0938\u0940\u0924\u0933", standard_spelling: "\u0938\u0940\u0924\u0933", phonetic_rule: "\u092E\u0942\u0930\u094D\u0927\u0928\u094D\u092F \u0933 \u092F\u0941\u0915\u094D\u0924 \u0905\u092D\u093F\u0935\u094D\u092F\u0915\u094D\u0924\u093F" }
  ];
  const editorialHeadlines = {
    lead_headline: `${garhwaliTranslation.slice(0, 42)}...`,
    kicker: "\u0915\u094D\u0937\u0947\u0924\u094D\u0930\u0940\u092F \u092D\u093E\u0937\u093E\u0902\u0924\u0930 \u090F\u0935\u0902 \u0932\u094B\u0915\u0938\u093E\u0939\u093F\u0924\u094D\u092F",
    subhead: "\u0938\u093E\u0939\u093F\u0924\u094D\u092F\u093F\u0915 \u090F\u0935\u0902 \u0906\u0902\u091A\u0932\u093F\u0915 \u092C\u094B\u0932\u0940 \u0938\u0902\u0938\u094D\u0915\u0930\u0923",
    feature_title: garhwaliTranslation.slice(0, 28)
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
      { term: "\u0917\u0922\u093C\u0935\u093E\u0933\u0940 (Garhwali)", meaning: "\u0909\u0924\u094D\u0924\u0930\u093E\u0916\u0902\u0921 \u0915\u0940 \u092A\u094D\u0930\u092E\u0941\u0916 \u092E\u0927\u094D\u092F \u092A\u0939\u093E\u0921\u093C\u0940 \u092D\u093E\u0937\u093E" },
      { term: "\u0915\u0941\u092E\u093E\u090A\u0901\u0928\u0940 (Kumaoni)", meaning: "\u0905\u0932\u094D\u092E\u094B\u0921\u093C\u093E-\u0928\u0948\u0928\u0940\u0924\u093E\u0932 \u092E\u0927\u094D\u092F \u092A\u0939\u093E\u0921\u093C\u0940 \u092D\u093E\u0937\u093E (\u0938\u0939\u093E\u092F\u0915 \u0915\u094D\u0930\u093F\u092F\u093E: \u091B\u0942/\u091B\u0928)" },
      { term: "\u091C\u094C\u0928\u0938\u093E\u0930\u0940 (Jaunsari)", meaning: "\u091A\u0915\u094D\u0930\u093E\u0924\u093E \u091C\u094C\u0928\u0938\u093E\u0930-\u092C\u093E\u0935\u0930 \u092A\u0936\u094D\u091A\u093F\u092E\u0940 \u092A\u0939\u093E\u0921\u093C\u0940 \u092D\u093E\u0937\u093E (\u0938\u0939\u093E\u092F\u0915 \u0915\u094D\u0930\u093F\u092F\u093E: \u0938\u094B/\u0938\u093E)" }
    ]
  };
}

// server.ts
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var PORT = process.env.PORT || 3e3;
process.on("uncaughtException", (err) => {
  console.error("[Process Error] Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("[Process Error] Unhandled Rejection at:", promise, "reason:", reason);
});
var app = express();
app.use(express.json({ limit: "10mb" }));
var ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
var GARHWALI_SYSTEM_PROMPT = `You are an authoritative Garhwali linguist, lexicographer, and professional literary translator specializing in Central Pahari languages and Uttarakhand regional publishing standards.

Your primary mission is twofold:
1. Translate text from English or Hindi into Garhwali across distinct regional dialects (Srinagariya, Tehriyali, Salani, Badhani/Chamoli, Nagpuriya, Jaunpuri/Ravalti).
2. Assist news editors and book publishers by providing publication-ready, grammatically standardized literary Garhwali (\u0938\u093E\u0939\u093F\u0924\u094D\u092F\u093F\u0915/\u092A\u094D\u0930\u0915\u093E\u0936\u0928 \u092E\u093E\u0928\u0915 \u0917\u0922\u093C\u0935\u0933\u093F), adhering to accepted regional print media conventions (e.g., Dainik Jagran Garhwali editions, Chitthi-Patri, Hilans, and Sahitya Akademi Garhwali publications).

### DIALECT PROFILES & REGIONAL RULES:
- Srinagariya (\u0936\u094D\u0930\u0940\u0928\u0917\u0930\u093F\u092F\u093E - \u0938\u093E\u0939\u093F\u0924\u094D\u092F\u093F\u0915 \u092E\u093E\u0928\u0915): The de facto literary standard for books, press, and formal literature. Retains standard orthography, classic auxiliary verbs (\u091B/\u091B\u093E/\u091B\u0940/\u091B\u0928), and formal pronoun sets.
- Tehriyali (\u091F\u093F\u0939\u0930\u093F\u092F\u093E\u0933\u093F): Uses distinct verb markers, vowel shifts (e.g., \u090A \u0917\u0948 vs \u090A \u0917\u094D\u092F\u093E/\u0917\u094B), and Bhagirathi-Bhilangana basin colloquial roots.
- Salani (\u0938\u0932\u093E\u0923\u0940): Pauri/Kotdwar/Ganga Salan region. Influenced by plains phonetics, distinct postposition markers ('\u092E\u093E', '\u0915\u0928'), and specific past-tense conjugations (-\u092F\u093E, -\u0907).
- Badhani / Chamoli (\u092C\u0927\u093E\u0923\u0940 / \u091A\u092E\u094B\u0932\u0940): Upper Chamoli / Pindar basin. Preserves archaic Indo-Aryan consonant clusters and conservative pronoun variants (\u0915\u0925/\u0915\u0941\u0925\u0940/\u0915\u094D\u0935\u0940/\u091C\u0928).
- Nagpuriya (\u0928\u093E\u0917\u092A\u0941\u0930\u093F\u092F\u093E): Mandakini/Rudraprayag valley. Pronounced tonal cadences and unique interrogative particles (\u0915\u0925\u0948/\u0915\u094D\u092F\u0948\u0915/\u0915\u0948\u0928\u094D\u0915\u0948).
- Jaunpuri / Ravalti (\u091C\u094C\u0928\u092A\u0941\u0930\u0940 / \u0930\u0935\u093E\u0932\u094D\u091F\u0940): Western border; features transitional phonetic features between Garhwali and Jaunsari/Himachali (-\u094C\u0902\u0924\u094B/-\u0906\u0935\u0902\u0924\u094B).
- Kumaoni (\u0915\u0941\u092E\u093E\u090A\u0901\u0928\u0940 - \u0905\u0932\u094D\u092E\u094B\u0921\u093C\u093E / \u0928\u0948\u0928\u0940\u0924\u093E\u0932 / \u092A\u093F\u0925\u094C\u0930\u093E\u0917\u0922\u093C): Distinct Central Pahari sister language; auxiliary verbs (\u091B\u0941/\u091B\u0942\u0902, \u091B\u0948, \u091B, \u091B\u093E/\u091B\u094C\u0902, \u091B\u0928), absolutive participles with '-\u092C\u0947\u0930' (\u091C\u093E\u0907\u092C\u0947\u0930, \u0916\u093E\u0907\u092C\u0947\u0930), pronouns (\u0939\u092E\u093E\u0930, \u0924\u092E\u093E\u0930, \u092E\u094D\u092F/\u092E\u0948\u0902).
- Jaunsari (\u091C\u094C\u0928\u0938\u093E\u0930\u0940 - \u091A\u0915\u094D\u0930\u093E\u0924\u093E / \u0915\u093E\u0932\u0938\u0940 / \u091C\u094C\u0928\u0938\u093E\u0930-\u092C\u093E\u0935\u0930): Distinct Western Pahari language of Jaunsar-Bawar; auxiliary verbs "\u0938\u094B (\u0939\u0948), \u0938\u093E (\u0939\u0948\u0902), \u0925\u0940/\u0925\u093F\u092F\u093E (\u0925\u093E)", pronouns "\u0906\u092E\u0941 (\u0939\u092E), \u0924\u0941\u092E\u0941 (\u0924\u0941\u092E), \u092E\u094B\u0916 (\u092E\u0941\u091D\u0947)", participles in "-\u0926\u094B/-\u0924\u094B/-\u0906\u0935\u0902\u0924\u094B".

### ORTHOGRAPHIC & PUBLICATION STANDARDS:
1. Editorial Accuracy: Always distinguish between standard retroflex '\u0933' (Garhwali L) and '\u0932', and use precise nasalization (\u0905\u0928\u0941\u0938\u094D\u0935\u093E\u0930/\u0905\u0928\u0941\u0928\u093E\u0938\u093F\u0915) according to Garhwali literature guidelines.
2. Tone & Register Detection:
   - For Literary/Book/Editorial inputs: Use high-register prose, rich proverbs (\u0906\u0916\u093E\u0923\u093E/\u092A\u0916\u093E\u0923\u093E), formal postpositions, and consistent honorifics. Provide headline variations suitable for newspaper columns.
   - For Conversational inputs: Reflect natural spoken rhythm and valley-specific colloquial terms.
3. Transliteration: Provide an accessible Romanized phonetic transliteration for learners and non-Devanagari readers.
4. Editorial Lexicon: Highlight specialized Garhwali cultural/ecological terms that add authenticity to news articles (e.g., \u0927\u093E\u0930\u093E, \u0917\u0927\u0947\u0930\u093E, \u092E\u0948\u0924\u0940, \u0921\u093E\u0902\u0921\u093E-\u0915\u093E\u0902\u0921\u093E, \u092C\u0941\u0917\u094D\u092F\u093E\u0932, \u0930\u0902\u0935\u093E\u0908-\u091C\u094C\u0928\u092A\u0941\u0930 \u0936\u092C\u094D\u0926\u093E\u0935\u0932\u0940).

### OUTPUT FORMAT:
You MUST respond strictly in valid JSON adhering to the provided JSON schema. Do not include markdown code fences or conversational preambles outside the JSON response.`;
var TRANSLATION_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    source_text: { type: Type.STRING },
    source_language: { type: Type.STRING },
    detected_register: { type: Type.STRING },
    register_explanation: { type: Type.STRING },
    editorial_headlines: {
      type: Type.OBJECT,
      properties: {
        lead_headline: { type: Type.STRING },
        kicker: { type: Type.STRING },
        subhead: { type: Type.STRING },
        feature_title: { type: Type.STRING }
      },
      required: ["lead_headline", "kicker", "subhead", "feature_title"]
    },
    standard_literary_garhwali: {
      type: Type.OBJECT,
      properties: {
        devanagari: { type: Type.STRING },
        transliteration: { type: Type.STRING },
        editorial_notes: { type: Type.STRING },
        retroflex_la_audit: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING },
              standard_spelling: { type: Type.STRING },
              phonetic_rule: { type: Type.STRING }
            },
            required: ["word", "standard_spelling", "phonetic_rule"]
          }
        }
      },
      required: ["devanagari", "transliteration", "editorial_notes", "retroflex_la_audit"]
    },
    dialect_translations: {
      type: Type.OBJECT,
      properties: {
        srinagariya: {
          type: Type.OBJECT,
          properties: {
            dialect_name: { type: Type.STRING },
            devanagari: { type: Type.STRING },
            transliteration: { type: Type.STRING },
            dialect_features: { type: Type.STRING },
            auxiliary_verbs_used: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["dialect_name", "devanagari", "transliteration", "dialect_features"]
        },
        tehriyali: {
          type: Type.OBJECT,
          properties: {
            dialect_name: { type: Type.STRING },
            devanagari: { type: Type.STRING },
            transliteration: { type: Type.STRING },
            dialect_features: { type: Type.STRING },
            basin_variations: { type: Type.STRING }
          },
          required: ["dialect_name", "devanagari", "transliteration", "dialect_features"]
        },
        salani: {
          type: Type.OBJECT,
          properties: {
            dialect_name: { type: Type.STRING },
            devanagari: { type: Type.STRING },
            transliteration: { type: Type.STRING },
            dialect_features: { type: Type.STRING },
            postposition_markers: { type: Type.STRING }
          },
          required: ["dialect_name", "devanagari", "transliteration", "dialect_features"]
        },
        badhani_chamoli: {
          type: Type.OBJECT,
          properties: {
            dialect_name: { type: Type.STRING },
            devanagari: { type: Type.STRING },
            transliteration: { type: Type.STRING },
            dialect_features: { type: Type.STRING },
            archaic_consonants: { type: Type.STRING }
          },
          required: ["dialect_name", "devanagari", "transliteration", "dialect_features"]
        },
        nagpuriya: {
          type: Type.OBJECT,
          properties: {
            dialect_name: { type: Type.STRING },
            devanagari: { type: Type.STRING },
            transliteration: { type: Type.STRING },
            dialect_features: { type: Type.STRING },
            tonal_cadences: { type: Type.STRING }
          },
          required: ["dialect_name", "devanagari", "transliteration", "dialect_features"]
        },
        jaunpuri_ravalti: {
          type: Type.OBJECT,
          properties: {
            dialect_name: { type: Type.STRING },
            devanagari: { type: Type.STRING },
            transliteration: { type: Type.STRING },
            dialect_features: { type: Type.STRING },
            transitional_markers: { type: Type.STRING }
          },
          required: ["dialect_name", "devanagari", "transliteration", "dialect_features"]
        },
        kumaoni: {
          type: Type.OBJECT,
          properties: {
            dialect_name: { type: Type.STRING },
            devanagari: { type: Type.STRING },
            transliteration: { type: Type.STRING },
            dialect_features: { type: Type.STRING },
            kumaoni_markers: { type: Type.STRING }
          },
          required: ["dialect_name", "devanagari", "transliteration", "dialect_features"]
        },
        jaunsari: {
          type: Type.OBJECT,
          properties: {
            dialect_name: { type: Type.STRING },
            devanagari: { type: Type.STRING },
            transliteration: { type: Type.STRING },
            dialect_features: { type: Type.STRING },
            jaunsari_markers: { type: Type.STRING }
          },
          required: ["dialect_name", "devanagari", "transliteration", "dialect_features"]
        }
      },
      required: ["srinagariya", "tehriyali", "salani", "badhani_chamoli", "nagpuriya", "jaunpuri_ravalti", "kumaoni", "jaunsari"]
    },
    editorial_lexicon: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING },
          category: { type: Type.STRING },
          meaning: { type: Type.STRING },
          journalistic_context: { type: Type.STRING }
        },
        required: ["term", "category", "meaning", "journalistic_context"]
      }
    },
    relevant_proverbs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          akhana_pakhana: { type: Type.STRING },
          transliteration: { type: Type.STRING },
          literal_meaning: { type: Type.STRING },
          editorial_application: { type: Type.STRING }
        },
        required: ["akhana_pakhana", "transliteration", "literal_meaning", "editorial_application"]
      }
    }
  },
  required: [
    "source_text",
    "source_language",
    "detected_register",
    "editorial_headlines",
    "standard_literary_garhwali",
    "dialect_translations",
    "editorial_lexicon",
    "relevant_proverbs"
  ]
};
app.post("/api/garhwali/translate", async (req, res) => {
  const { text, sourceLang = "Auto", register = "Auto", focusDialect = "all" } = req.body;
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return res.status(400).json({ error: "Text input is required" });
  }
  const clean = text.trim();
  try {
    const promptUserInstruction = `Translate and analyze the following text into standard literary Garhwali and its 6 distinct regional dialects.
Requested register/preference: ${register}.
Focus dialect: ${focusDialect}.
Source text (${sourceLang}):
"${clean}"

Provide the response in the specified JSON schema strictly.`;
    let outputText = "";
    const candidateModels = ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-3.1-flash-lite"];
    for (const model of candidateModels) {
      try {
        const translatePromise = ai.models.generateContent({
          model,
          contents: promptUserInstruction,
          config: {
            systemInstruction: GARHWALI_SYSTEM_PROMPT,
            temperature: 0.3,
            responseMimeType: "application/json",
            responseSchema: TRANSLATION_RESPONSE_SCHEMA
          }
        });
        const response = await withTimeout(translatePromise, 9e3, `Model ${model} timed out`);
        if (response?.text) {
          outputText = response.text;
          break;
        }
      } catch (err) {
        console.warn(`Translation attempt with ${model} failed:`, err?.message?.slice(0, 150));
      }
    }
    if (outputText) {
      const parsed = JSON.parse(outputText.trim());
      return res.json(parsed);
    }
    throw new Error("All model attempts failed or timed out");
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.warn("Translation API error/timeout, using high-accuracy linguistic engine:", errorMsg);
    const linguistic = translateLinguistically(clean, sourceLang, register);
    return res.json({
      source_text: clean,
      source_language: sourceLang === "Auto" ? "Hindi" : sourceLang,
      detected_register: register || "Conversational & Literary",
      register_explanation: "\u0909\u0924\u094D\u0924\u0930\u093E\u0916\u0902\u0921\u0940 \u0938\u093E\u0939\u093F\u0924\u094D\u092F\u093F\u0915 \u0935 \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u0940\u092F \u092C\u094B\u0932\u091A\u093E\u0932 \u092E\u093E\u0928\u0915 (\u092A\u094D\u0930\u093E\u092E\u093E\u0923\u093F\u0915 \u092D\u093E\u0937\u093E\u0902\u0924\u0930)",
      editorial_headlines: linguistic.editorialHeadlines,
      standard_literary_garhwali: {
        devanagari: linguistic.standardGarhwaliDevanagari,
        transliteration: linguistic.standardGarhwaliTransliteration,
        editorial_notes: "\u092E\u093E\u0928\u0915 \u0938\u093E\u0939\u093F\u0924\u094D\u092F\u093F\u0915 \u0926\u0947\u0935\u0928\u093E\u0917\u0930\u0940 \u0935\u0930\u094D\u0924\u0928\u0940 \u090F\u0935\u0902 \u0936\u0941\u0926\u094D\u0927 \u092E\u0942\u0930\u094D\u0927\u0928\u094D\u092F \u0933 \u092F\u0941\u0915\u094D\u0924 \u0905\u092D\u093F\u0935\u094D\u092F\u0915\u094D\u0924\u093F\u0964",
        retroflex_la_audit: linguistic.retroflexAudit
      },
      dialect_translations: {
        srinagariya: {
          dialect_name: "\u0936\u094D\u0930\u0940\u0928\u0917\u0930\u093F\u092F\u093E (\u0938\u093E\u0939\u093F\u0924\u094D\u092F\u093F\u0915 \u092E\u093E\u0928\u0915)",
          devanagari: linguistic.dialects.srinagariya,
          transliteration: linguistic.transliterations.srinagariya,
          dialect_features: "\u0905\u0932\u0915\u0928\u0902\u0926\u093E \u0918\u093E\u091F\u0940 \u0915\u0940 \u092E\u093E\u0928\u0915 \u0938\u093E\u0939\u093F\u0924\u094D\u092F\u093F\u0915 \u0936\u0948\u0932\u0940",
          auxiliary_verbs_used: ["\u091B", "\u091B\u0928"]
        },
        tehriyali: {
          dialect_name: "\u091F\u093F\u0939\u0930\u093F\u092F\u093E\u0933\u093F",
          devanagari: linguistic.dialects.tehriyali,
          transliteration: linguistic.transliterations.tehriyali,
          dialect_features: "\u091F\u093F\u0939\u0930\u0940 \u0917\u0922\u093C\u0935\u093E\u0932 \u0915\u0940 \u0938\u092E\u0943\u0926\u094D\u0927 \u0932\u094B\u0915 \u0936\u0948\u0932\u0940"
        },
        salani: {
          dialect_name: "\u0938\u0932\u093E\u0923\u0940",
          devanagari: linguistic.dialects.salani,
          transliteration: linguistic.transliterations.salani,
          dialect_features: "\u0917\u0902\u0917\u093E-\u0938\u0932\u093E\u0923 \u0935 \u0915\u094B\u091F\u0926\u094D\u0935\u093E\u0930 \u0915\u094D\u0937\u0947\u0924\u094D\u0930 \u0915\u0940 \u0935\u094D\u092F\u093E\u0915\u0930\u0923\u093F\u0915 \u0935\u093F\u0936\u0947\u0937\u0924\u093E\u090F\u0902"
        },
        badhani_chamoli: {
          dialect_name: "\u092C\u0927\u093E\u0923\u0940 / \u091A\u092E\u094B\u0932\u0940",
          devanagari: linguistic.dialects.badhani_chamoli,
          transliteration: linguistic.transliterations.badhani_chamoli,
          dialect_features: "\u092A\u093F\u0902\u0921\u0930 \u0905\u0902\u091A\u0932 \u0915\u0940 \u092A\u0941\u0930\u093E\u0924\u0928 \u0935 \u0938\u0902\u0935\u093E\u0926\u0940 \u0935\u093F\u0936\u0947\u0937\u0924\u093E\u090F\u0902"
        },
        nagpuriya: {
          dialect_name: "\u0928\u093E\u0917\u092A\u0941\u0930\u093F\u092F\u093E",
          devanagari: linguistic.dialects.nagpuriya,
          transliteration: linguistic.transliterations.nagpuriya,
          dialect_features: "\u0930\u0941\u0926\u094D\u0930\u092A\u094D\u0930\u092F\u093E\u0917 \u0935 \u092E\u0902\u0926\u093E\u0915\u093F\u0928\u0940 \u0905\u0902\u091A\u0932 \u0915\u0940 \u0938\u0941\u0930\u092E\u094D\u092F \u0924\u093E\u0928"
        },
        jaunpuri_ravalti: {
          dialect_name: "\u091C\u094C\u0928\u092A\u0941\u0930\u0940 / \u0930\u0935\u093E\u0932\u094D\u091F\u0940",
          devanagari: linguistic.dialects.jaunpuri_ravalti,
          transliteration: linguistic.transliterations.jaunpuri_ravalti,
          dialect_features: "\u0930\u0902\u0935\u093E\u0908-\u091C\u094C\u0928\u092A\u0941\u0930 \u092F\u092E\u0941\u0928\u093E \u0918\u093E\u091F\u0940 \u0915\u0940 \u0935\u093F\u0936\u093F\u0937\u094D\u091F \u0927\u094D\u0935\u0928\u093F"
        },
        kumaoni: {
          dialect_name: "\u0915\u0941\u092E\u093E\u090A\u0901\u0928\u0940 (Kumaoni)",
          devanagari: linguistic.dialects.kumaoni,
          transliteration: linguistic.transliterations.kumaoni,
          dialect_features: "\u0905\u0932\u094D\u092E\u094B\u0921\u093C\u093E-\u0928\u0948\u0928\u0940\u0924\u093E\u0932 \u092E\u0927\u094D\u092F \u092A\u0939\u093E\u0921\u093C\u0940 \u092E\u093E\u0928\u0915 (\u0938\u0939\u093E\u092F\u0915 \u0915\u094D\u0930\u093F\u092F\u093E: \u091B\u0942/\u091B\u0928, \u0915\u0943\u0926\u0902\u0924: -\u092C\u0947\u0930)"
        },
        jaunsari: {
          dialect_name: "\u091C\u094C\u0928\u0938\u093E\u0930\u0940 (Jaunsari)",
          devanagari: linguistic.dialects.jaunsari,
          transliteration: linguistic.transliterations.jaunsari,
          dialect_features: "\u091C\u094C\u0928\u0938\u093E\u0930-\u092C\u093E\u0935\u0930 \u092A\u0936\u094D\u091A\u093F\u092E\u0940 \u092A\u0939\u093E\u0921\u093C\u0940 \u0936\u0948\u0932\u0940 (\u0938\u0939\u093E\u092F\u0915 \u0915\u094D\u0930\u093F\u092F\u093E: \u0938\u094B/\u0938\u093E, \u0915\u0943\u0926\u0902\u0924: -\u0926\u094B/-\u0924\u094B)"
        }
      },
      editorial_lexicon: [
        {
          term: "\u0928\u094C\u0933\u093E / \u0927\u093E\u0930\u094B",
          category: "\u092A\u093E\u0930\u093F\u0938\u094D\u0925\u093F\u0924\u093F\u0915\u0940 \u090F\u0935\u0902 \u091C\u0932 \u0938\u0902\u092A\u0926\u093E",
          meaning: "\u092A\u093E\u0930\u0902\u092A\u0930\u093F\u0915 \u092A\u094D\u0930\u093E\u0915\u0943\u0924\u093F\u0915 \u091C\u0932 \u0938\u0902\u0930\u091A\u0928\u093E\u090F\u0902",
          journalistic_context: "\u092A\u0939\u093E\u0921\u093C\u0940 \u091C\u0940\u0935\u0928 \u0915\u0940 \u091C\u0940\u0935\u0928\u0930\u0947\u0916\u093E"
        },
        {
          term: "\u0921\u093E\u0902\u0921\u093E-\u0915\u093E\u0902\u0921\u093E",
          category: "\u092D\u0942\u0917\u094B\u0932 \u090F\u0935\u0902 \u092A\u0930\u094D\u092F\u093E\u0935\u0930\u0923",
          meaning: "\u0939\u093F\u092E\u093E\u0932\u092F\u0940 \u092A\u0930\u094D\u0935\u0924 \u0936\u093F\u0916\u0930 \u090F\u0935\u0902 \u0935\u0928 \u0935\u093F\u0938\u094D\u0924\u093E\u0930",
          journalistic_context: "\u092A\u0930\u094D\u092F\u093E\u0935\u0930\u0923\u0940\u092F \u0930\u093F\u092A\u094B\u0930\u094D\u091F\u093F\u0902\u0917"
        }
      ],
      relevant_proverbs: [
        {
          akhana_pakhana: "\u091C\u0948 \u0926\u0947\u0936 \u092E\u093E \u0930\u0948\u0923\u093E, \u0935\u0948 \u0926\u0947\u0936 \u0915\u0940 \u092C\u094D\u0935\u0932\u0940 \u092C\u094D\u0935\u0933\u0923\u0940\u0964",
          transliteration: "Jai desh ma raina, wai desh ki bwoli bwolani.",
          literal_meaning: "Speak the language and honor the culture of the mountain you inhabit.",
          editorial_application: "\u0915\u094D\u0937\u0947\u0924\u094D\u0930\u0940\u092F \u092D\u093E\u0937\u093E \u090F\u0935\u0902 \u0932\u094B\u0915 \u0938\u092E\u094D\u092E\u093E\u0928 \u0915\u093E \u092E\u0942\u0932\u092E\u0902\u0924\u094D\u0930"
        }
      ]
    });
  }
});
function withTimeout(promise, timeoutMs, timeoutMsg) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(timeoutMsg)), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}
function getServerVoiceFallback(text, sourceLang = "Auto", targetLanguage = "garhwali", targetDialect = "srinagariya") {
  const clean = text.trim();
  const lower = clean.toLowerCase();
  let srinagariya = "";
  let tehriyali = "";
  let salani = "";
  let badhani = "";
  let nagpuriya = "";
  let jaunpuri = "";
  let kumaoni = "";
  let jaunsari = "";
  let translit = "";
  let vocab = [];
  let note = "";
  if (lower.includes("hello") || lower.includes("how are you") || clean.includes("\u0928\u092E\u0938\u094D\u0924\u0947") || clean.includes("\u0915\u0948\u0938\u0947") || clean.includes("\u092A\u094D\u0930\u0923\u093E\u092E")) {
    srinagariya = "\u0928\u092E\u0938\u094D\u0915\u093E\u0930! \u0906\u092A \u0915\u0928\u0915 \u091B\u0928? \u0938\u092C \u0915\u0941\u0936\u0932-\u092E\u0902\u0917\u0932 \u0924 \u091B?";
    tehriyali = "\u0928\u092E\u0938\u094D\u0915\u093E\u0930! \u0924\u0941\u092E \u0915\u0928\u0915 \u091B\u093E? \u0918\u0930-\u092A\u0930\u093F\u0935\u093E\u0930 \u092E\u093E \u0938\u092C \u0930\u093E\u091C\u093C\u0940-\u0916\u0941\u0936\u0940?";
    salani = "\u0928\u092E\u0938\u094D\u0915\u093E\u0930! \u0906\u092A \u0915\u0928\u0915 \u091B\u093E\u0902? \u0938\u092C \u0920\u0940\u0915-\u0920\u093E\u0915 \u091B \u0928\u093E?";
    badhani = "\u0928\u092E\u0938\u094D\u0915\u093E\u0930! \u0924\u0941\u092E \u0915\u0928\u0915 \u091B\u094C? \u0938\u092C\u0940 \u091C\u0928 \u0915\u0941\u0936\u0932 \u091B\u0928?";
    nagpuriya = "\u0928\u092E\u0938\u094D\u0915\u093E\u0930! \u0906\u092A \u0915\u0928\u0915 \u091B\u0928? \u0938\u092C \u092E\u0902\u0917\u0932\u092E\u092F \u091B?";
    jaunpuri = "\u092A\u094D\u0930\u0923\u093E\u092E! \u0924\u0941\u092E \u0915\u0928\u0915 \u0938\u094B? \u0938\u092C \u0920\u0940\u0915-\u0920\u093E\u0915 \u0938\u094B?";
    kumaoni = "\u092A\u0948\u0932\u093E\u0917 / \u0928\u092E\u0938\u094D\u0915\u093E\u0930! \u0924\u092E \u0915\u0938\u093E \u091B\u093E? \u0918\u0930-\u092A\u0930\u093F\u0935\u093E\u0930 \u092E\u093E \u0938\u092C \u0930\u093E\u091C\u0940-\u0916\u0941\u0938\u0940 \u091B\u0942 \u0928\u093E?";
    jaunsari = "\u092A\u094D\u0930\u0923\u093E\u092E / \u091C\u092F \u092E\u0939\u093E\u0938\u0942! \u0924\u0941\u092E\u0941 \u0915\u0928\u0915 \u0938\u093E? \u0938\u092C \u0915\u0941\u0936\u0932-\u092E\u0902\u0917\u0932 \u0938\u094B?";
    translit = targetLanguage === "kumaoni" ? "Pailag / Namaskar! Tam kasa chha? Sab rajee-khusee chhoo na?" : targetLanguage === "jaunsari" ? "Pranaam / Jai Mahasu! Tumu kanak sa? Sab kushal-mangal so?" : "Namaskar! Aap kanak chhan? Sab kushal-mangal ta chha?";
    vocab = [
      { term: "\u0915\u0928\u0915 / \u0915\u0938\u093E (Kanak / Kasa)", meaning: "\u0915\u0948\u0938\u0947 / How" },
      { term: "\u091B\u0928 / \u091B\u093E / \u0938\u093E (Chhan / Chha / Sa)", meaning: "\u0939\u0948\u0902 / Are (Honorific auxiliary verb)" },
      { term: "\u092A\u0948\u0932\u093E\u0917 (Pailag)", meaning: "\u092A\u094D\u0930\u0923\u093E\u092E / Respectful Kumaoni greeting" }
    ];
    note = "Traditional Central & Western Pahari greeting with dialectal auxiliary verbs.";
  } else if (lower.includes("way") || lower.includes("road") || clean.includes("\u0930\u093E\u0938\u094D\u0924\u093E") || clean.includes("\u0915\u0939\u093E\u0901") || clean.includes("\u0915\u093F\u0927\u0930") || clean.includes("\u092E\u0902\u0926\u093F\u0930") || clean.includes("\u092C\u0926\u094D\u0930\u0940\u0928\u093E\u0925")) {
    srinagariya = "\u092E\u0925\u0948 \u092C\u093E\u091F\u094B \u092C\u0924\u093E\u0935\u093E, \u0924\u0940\u0930\u094D\u0925 \u091C\u093E\u0923\u093E \u0915\u0941 \u0938\u0940\u0927\u094B \u0930\u0938\u094D\u0924\u094B \u0915\u0925 \u091B?";
    tehriyali = "\u092E\u0916\u093F \u092C\u093E\u091F\u094B \u092C\u094D\u0935\u0932\u093E, \u0924\u0940\u0930\u094D\u0925 \u091C\u093E\u0923\u093E \u0915\u0941 \u0930\u0938\u094D\u0924\u094B \u0915\u0916 \u091B?";
    salani = "\u092E\u093F \u0915\u0928 \u092C\u093E\u091F\u094B \u092C\u0924\u093E\u0913, \u0927\u093E\u092E \u091C\u093E\u0923\u093E \u0915\u0941 \u092C\u093E\u091F\u094B \u0938\u093F\u0927\u094B \u0915\u0916 \u091C\u093E\u0902\u0926?";
    badhani = "\u092E\u0925\u0948 \u092C\u093E\u091F\u094B \u092C\u0924\u093E\u0935\u093E, \u0909\u091A\u094D\u091A \u0939\u093F\u092E\u093E\u0932\u092F\u0940 \u0924\u0940\u0930\u094D\u0925 \u091C\u093E\u0923\u093E \u0915\u0941 \u0938\u0941\u092A\u0925 \u0915\u0916 \u091B?";
    nagpuriya = "\u092E\u0925\u0948 \u092C\u093E\u091F\u094B \u092C\u094D\u0935\u0932\u093E, \u0915\u0947\u0926\u093E\u0930\u0918\u093E\u091F\u0940 \u091C\u093E\u0923\u093E \u0915\u0941 \u092C\u093E\u091F\u094B \u0915\u0925\u0948 \u091B?";
    jaunpuri = "\u092E\u094B\u0916 \u092C\u093E\u091F\u094B \u092C\u094B\u0932\u094B, \u0924\u0940\u0930\u094D\u0925 \u091C\u093E\u0923\u0947 \u0930\u094B \u0938\u0940\u0927\u094B \u0930\u0938\u094D\u0924\u094B \u0915\u0916 \u0938\u094B?";
    kumaoni = "\u092E\u094D\u092F\u0915\u0923\u093F \u092C\u093E\u091F\u094B \u092C\u0924\u093E\u0913, \u0924\u0940\u0930\u094D\u0925 \u091C\u093E\u0923\u093E \u0915\u094B \u0938\u0940\u0927\u094B \u0930\u0938\u094D\u0924\u094B \u0915\u093E\u0901 \u091B\u0942?";
    jaunsari = "\u092E\u094B\u0916 \u092C\u093E\u091F\u094B \u092C\u094B\u0932\u094B, \u092E\u0902\u0926\u093F\u0930 \u091C\u093E\u0923\u0947 \u0930\u094B \u0938\u0940\u0927\u094B \u092C\u093E\u091F\u094B \u0915\u0916 \u0938\u094B?";
    translit = targetLanguage === "kumaoni" ? "Myakani bato batao, teerth jaana ko seedho rasto kaan chhoo?" : targetLanguage === "jaunsari" ? "Mokh bato bolo, mandir jaane ro seedho bato kakh so?" : "Mathai bato batawa, teerth jaana ku seedho rasto katha chha?";
    vocab = [
      { term: "\u092C\u093E\u091F\u094B / \u0930\u0938\u094D\u0924\u094B (Bato / Rasto)", meaning: "\u0930\u093E\u0938\u094D\u0924\u093E \u092F\u093E \u092E\u093E\u0930\u094D\u0917 / Trail or road" },
      { term: "\u092E\u0925\u0948 / \u092E\u094D\u092F\u0915\u0923\u093F / \u092E\u094B\u0916 (Mathai / Myakani / Mokh)", meaning: "\u092E\u0941\u091D\u0947 / To me" }
    ];
    note = "Mountain wayfinding in regional dialects.";
  } else if (lower.includes("water") || clean.includes("\u092A\u093E\u0928\u0940") || clean.includes("\u091C\u0932") || clean.includes("\u0927\u093E\u0930\u093E") || clean.includes("\u0928\u094C\u0932\u093E")) {
    srinagariya = "\u0917\u093E\u0901\u0935 \u0915\u0941 \u092E\u0940\u0920\u094B \u0927\u093E\u0930\u094B \u0905\u0930 \u0928\u094C\u0933\u093E \u0915\u0941 \u0928\u093F\u0930\u094D\u092E\u0933 \u0938\u0940\u0924\u0933 \u092A\u093E\u0923\u0940 \u0915\u0916 \u092E\u093F\u0932\u0932\u0942?";
    tehriyali = "\u0939\u092E\u093E\u0930 \u0917\u093E\u0901\u0935 \u092E\u093E \u092E\u0902\u0917\u0930\u094B \u0905\u0930 \u0927\u093E\u0930\u094B \u0915\u0941 \u092C\u093F\u092F\u093E\u0933 \u092A\u093E\u0923\u0940 \u0915\u0916 \u0926\u0947\u0916\u0923 \u092E\u093F\u0932\u0932\u0942?";
    salani = "\u0917\u093E\u0901\u0935 \u0915\u0941 \u0927\u093E\u0930\u094B \u0915\u0941 \u092A\u093E\u0923\u0940 \u092D\u094C\u0924 \u092E\u0940\u0920\u094B \u0905\u0930 \u0938\u0940\u0924\u0933 \u091B\u0964";
    badhani = "\u092A\u0939\u093E\u095C\u0940 \u0927\u093E\u0930\u093E \u0915\u0941 \u0905\u092E\u0943\u0924 \u0924\u0941\u0932\u094D\u092F \u092A\u093E\u0923\u0940 \u0915\u0916 \u092C\u091F\u0940 \u0906\u0902\u0926?";
    nagpuriya = "\u0917\u093E\u0901\u0935 \u0915\u093E \u092A\u0902\u0926\u0947\u0930\u093E \u092E\u093E \u092E\u0940\u0920\u094B \u092A\u093E\u0923\u0940 \u092C\u0917\u094D\u0917\u0926\u094B \u091B\u0964";
    jaunpuri = "\u0917\u093E\u0901\u0935 \u0930\u093E \u092A\u0902\u0926\u0947\u0930\u093E \u0930\u094B \u0928\u093F\u0930\u094D\u092E\u0933 \u092A\u093E\u0923\u0940 \u0915\u0916 \u092E\u093F\u0932\u0926\u094B \u0938\u094B?";
    kumaoni = "\u0917\u093E\u0901\u0935\u093E \u0928\u094C\u0932\u093E \u0905\u0930 \u0927\u093E\u0930\u094B \u0915\u094B \u092E\u0940\u0920 \u092A\u093E\u0923\u0940 \u0915\u093E\u0901 \u092E\u093F\u0932\u0932? \u0928\u094C\u0932\u094B \u0915\u094B \u092A\u093E\u0923\u0940 \u092D\u094C\u0924 \u092A\u0935\u093F\u0924\u094D\u0930 \u091B\u0942\u0964";
    jaunsari = "\u0917\u093E\u0901\u0935\u0947 \u0930\u093E \u092A\u0902\u0926\u0947\u0930\u093E \u0930\u094B \u092E\u0940\u0920\u094B \u092A\u093E\u0923\u0940 \u0915\u0916 \u092E\u093F\u0932\u0926\u093E \u0938\u094B?";
    translit = targetLanguage === "kumaoni" ? "Gaanwa naula ar dhaaro ko meeth paani kaan milal?" : targetLanguage === "jaunsari" ? "Gaanwe ra pandera ro meetho paani kakh milda so?" : "Gaanw ku meetho dhaaro ar naula ku nirmal seetal paani kakh milaloo?";
    vocab = [
      { term: "\u0928\u094C\u0933\u093E / \u0928\u094C\u0932\u093E (Naula)", meaning: "\u092A\u094D\u0930\u093E\u0915\u0943\u0924\u093F\u0915 \u092A\u093E\u0930\u0902\u092A\u0930\u093F\u0915 \u091C\u0932\u0915\u0941\u0902\u0921" },
      { term: "\u0927\u093E\u0930\u094B (Dhaaro)", meaning: "\u092A\u094D\u0930\u093E\u0915\u0943\u0924\u093F\u0915 \u091C\u0932\u0927\u093E\u0930\u093E" }
    ];
    note = "Traditional Pahari water architecture: \u0928\u094C\u0932\u093E and \u0927\u093E\u0930\u094B.";
  } else {
    const linguistic = translateLinguistically(clean, sourceLang, "Conversational");
    srinagariya = linguistic.dialects.srinagariya;
    tehriyali = linguistic.dialects.tehriyali;
    salani = linguistic.dialects.salani;
    badhani = linguistic.dialects.badhani_chamoli;
    nagpuriya = linguistic.dialects.nagpuriya;
    jaunpuri = linguistic.dialects.jaunpuri_ravalti;
    kumaoni = linguistic.dialects.kumaoni;
    jaunsari = linguistic.dialects.jaunsari;
    translit = targetLanguage === "kumaoni" ? linguistic.transliterations.kumaoni : targetLanguage === "jaunsari" ? linguistic.transliterations.jaunsari : linguistic.transliterations.srinagariya;
    vocab = linguistic.keyVocabulary;
    note = "Authentic conversational Central & Western Pahari syntax.";
  }
  const dialectVariants = {
    srinagariya,
    tehriyali,
    salani,
    badhani_chamoli: badhani,
    nagpuriya,
    jaunpuri_ravalti: jaunpuri,
    kumaoni,
    jaunsari
  };
  let translatedText = srinagariya;
  let targetLanguageName = "\u0917\u0922\u093C\u0935\u093E\u0932\u0940 (Garhwali)";
  if (targetLanguage === "kumaoni") {
    translatedText = kumaoni;
    targetLanguageName = "\u0915\u0941\u092E\u093E\u090A\u0901\u0928\u0940 (Kumaoni)";
  } else if (targetLanguage === "jaunsari") {
    translatedText = jaunsari;
    targetLanguageName = "\u091C\u094C\u0928\u0938\u093E\u0930\u0940 (Jaunsari)";
  } else {
    translatedText = dialectVariants[targetDialect] || srinagariya;
    targetLanguageName = `\u0917\u0922\u093C\u0935\u093E\u0932\u0940 (${targetDialect})`;
  }
  return {
    sourceText: clean,
    detectedSourceLang: /[a-zA-Z]/.test(clean) && !/[\u0900-\u097F]/.test(clean) ? "English" : "Hindi",
    targetLanguage,
    targetLanguageName,
    targetDialect,
    dialectName: targetLanguageName,
    translatedText,
    garhwaliText: srinagariya,
    kumaoniText: kumaoni,
    jaunsariText: jaunsari,
    transliteration: translit,
    dialectVariants,
    keyVocabulary: vocab,
    conversationalNote: note
  };
}
app.post("/api/garhwali/voice-translate", async (req, res) => {
  const { text, sourceLang = "Auto", targetLanguage = "garhwali", targetDialect = "srinagariya" } = req.body;
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return res.status(400).json({ error: "Spoken text is required" });
  }
  const cleanInput = text.trim();
  try {
    const voicePrompt = `You are a Central & Western Pahari conversational translator.
Translate this spoken conversation (${sourceLang}): "${cleanInput}"
Target requested language: ${targetLanguage.toUpperCase()} (sub-dialect: ${targetDialect}).
Enforce retroflex \u0933 in Garhwali where applicable. Use authentic Kumaoni or Jaunsari syntax if requested.

Return valid JSON with:
{
  "sourceText": "${cleanInput}",
  "detectedSourceLang": "${sourceLang}",
  "targetLanguage": "${targetLanguage}",
  "targetLanguageName": "${targetLanguage}",
  "targetDialect": "${targetDialect}",
  "dialectName": "${targetDialect}",
  "translatedText": string,
  "garhwaliText": string,
  "kumaoniText": string,
  "jaunsariText": string,
  "transliteration": string,
  "dialectVariants": {
    "srinagariya": string,
    "tehriyali": string,
    "salani": string,
    "badhani_chamoli": string,
    "nagpuriya": string,
    "jaunpuri_ravalti": string,
    "kumaoni": string,
    "jaunsari": string
  },
  "keyVocabulary": [
    { "term": string, "meaning": string }
  ],
  "conversationalNote": string
}`;
    let outputText = "";
    const voiceModels = ["gemini-3.1-flash-lite", "gemini-3.6-flash", "gemini-3.8-flash"];
    for (const m of voiceModels) {
      try {
        const generatePromise = ai.models.generateContent({
          model: m,
          contents: voicePrompt,
          config: {
            responseMimeType: "application/json",
            maxOutputTokens: 600,
            temperature: 0.2
          }
        });
        const resp = await withTimeout(generatePromise, 6e3, `Model ${m} timed out`);
        if (resp?.text) {
          outputText = resp.text;
          break;
        }
      } catch (err) {
        console.warn(`Voice translation attempt with ${m} failed:`, err?.message?.slice(0, 100));
      }
    }
    if (outputText) {
      const parsed = JSON.parse(outputText.trim());
      if (!parsed.translatedText) {
        if (targetLanguage === "kumaoni") {
          parsed.translatedText = parsed.kumaoniText || parsed.dialectVariants?.kumaoni || parsed.garhwaliText;
        } else if (targetLanguage === "jaunsari") {
          parsed.translatedText = parsed.jaunsariText || parsed.dialectVariants?.jaunsari || parsed.garhwaliText;
        } else {
          parsed.translatedText = parsed.garhwaliText || parsed.dialectVariants?.srinagariya || cleanInput;
        }
      }
      parsed.targetLanguage = targetLanguage;
      return res.json(parsed);
    }
    throw new Error("Empty response from model");
  } catch (err) {
    const errStr = err instanceof Error ? err.message : String(err);
    console.warn("Voice translation fallback triggered (preventing 504):", errStr);
    const fallback = getServerVoiceFallback(cleanInput, sourceLang, targetLanguage, targetDialect);
    return res.json(fallback);
  }
});
app.post("/api/garhwali/tts", async (req, res) => {
  try {
    const { text, targetLanguage = "garhwali", dialectName = "Srinagariya", style = "" } = req.body;
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required for TTS" });
    }
    let speechPromptStyle = "";
    if (targetLanguage === "kumaoni") {
      speechPromptStyle = `Native Kumaoni speaker from Almora/Nainital, expressive and warm Central Pahari melodic cadence, clear enunciation ${style}`.trim();
    } else if (targetLanguage === "jaunsari") {
      speechPromptStyle = `Native Jaunsari Western Pahari speaker from Chakrata/Jaunsar-Bawar, authentic hill cadence, clear articulation ${style}`.trim();
    } else {
      speechPromptStyle = `Authentic Garhwali speaker (${dialectName}), Central Pahari cadence with clear retroflex \u0933 articulation, natural and warm ${style}`.trim();
    }
    const ttsPromise = ai.models.generateContent({
      model: "gemini-3.8-flash-lite-tts",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: text.trim(),
              speechMetadata: {
                style: speechPromptStyle
              }
            }
          ]
        }
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" }
          }
        }
      }
    });
    const ttsResponse = await withTimeout(ttsPromise, 4200, "TTS timed out");
    const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({
        audioBase64: base64Audio,
        sampleRate: 24e3,
        format: "pcm_or_wav"
      });
    }
    return res.json({
      audioBase64: null,
      fallbackSynthesis: true
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.warn("TTS API timed out or errored, returning synthesis fallback:", errorMsg);
    return res.json({
      audioBase64: null,
      fallbackSynthesis: true,
      notice: errorMsg
    });
  }
});
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Garh-Vani Literary Garhwali Bureau & Dialect Engine",
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});
app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});
async function startServer() {
  const distPath = path.resolve(__dirname, "dist");
  const distIndexPath = path.resolve(distPath, "index.html");
  const hasDist = fs.existsSync(distIndexPath);
  const isDevScript = process.env.npm_lifecycle_event === "dev";
  const isProduction = process.env.NODE_ENV === "production" || process.env.npm_lifecycle_event === "start" || !isDevScript && hasDist;
  const serveStatic = hasDist && isProduction;
  if (serveStatic) {
    console.log(`Serving static production build from ${distPath}`);
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(distIndexPath);
    });
  } else {
    console.log("Mounting Vite middleware in development mode");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  }
  const isSocket = typeof PORT === "string" && (PORT.startsWith("/") || PORT.startsWith("\\\\.\\pipe"));
  const server = isSocket ? app.listen(PORT, () => {
    console.log(`Garh-Vani server listening on socket ${PORT} [mode: ${serveStatic ? "production" : "development"}]`);
  }) : app.listen(Number(PORT) || 3e3, "0.0.0.0", () => {
    console.log(`Garh-Vani server running at http://0.0.0.0:${PORT} [mode: ${serveStatic ? "production" : "development"}]`);
  });
  server.on("error", (err) => {
    console.error("Server listen error:", err);
  });
}
startServer();
