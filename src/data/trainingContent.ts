export type Language = 'en' | 'hi';

export interface LessonContent {
  id: string;
  order: number;
  time: string;
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  intro: { en: string; hi: string };
  body: { en: string; hi: string }[];
  stepsTitle?: { en: string; hi: string };
  steps?: { en: string; hi: string }[];
  exampleTitle: { en: string; hi: string };
  example: { en: string; hi: string };
  guidanceTitle: { en: string; hi: string };
  guidance: { en: string; hi: string };
}

export const trainingLessons: LessonContent[] = [
  {
    id: "plan-trip",
    order: 1,
    time: "3 min",
    title: { 
      en: "How TARANG helps you plan a trip", 
      hi: "तरंग आपको यात्रा की योजना बनाने में कैसे मदद करता है" 
    },
    description: { 
      en: "Learn the basics of safe trip planning.", 
      hi: "सुरक्षित यात्रा योजना की मूल बातें जानें।" 
    },
    intro: { 
      en: "TARANG helps fishermen decide when and where a trip is safer by bringing together information about sea conditions, weather, fishing potential and route safety.", 
      hi: "तरंग समुद्र की स्थिति, मौसम, मछली पकड़ने की क्षमता और मार्ग की सुरक्षा के बारे में जानकारी एक साथ लाकर मछुआरों को यह तय करने में मदद करता है कि यात्रा कब और कहाँ सुरक्षित है।" 
    },
    body: [
      {
        en: "For a multi-day trip, TARANG does not only look at the first day. It evaluates each day and considers the higher-risk day when making the overall recommendation.",
        hi: "कई दिनों की यात्रा के लिए, तरंग केवल पहले दिन को नहीं देखता है। यह प्रत्येक दिन का मूल्यांकन करता है और समग्र सिफारिश करते समय उच्च जोखिम वाले दिन पर विचार करता है।"
      }
    ],
    stepsTitle: {
      en: "The basic process:",
      hi: "मूल प्रक्रिया:"
    },
    steps: [
      { en: "1. Enter or confirm your trip details.", hi: "1. अपनी यात्रा का विवरण दर्ज करें या पुष्टि करें।" },
      { en: "2. TARANG checks conditions for each day.", hi: "2. तरंग प्रत्येक दिन के लिए स्थितियों की जांच करता है।" },
      { en: "3. It evaluates safety for your boat.", hi: "3. यह आपकी नाव की सुरक्षा का मूल्यांकन करता है।" },
      { en: "4. It checks fishing potential.", hi: "4. यह मछली पकड़ने की क्षमता की जांच करता है।" },
      { en: "5. It compares the days.", hi: "5. यह दिनों की तुलना करता है।" },
      { en: "6. It recommends the safest practical plan.", hi: "6. यह सबसे सुरक्षित व्यावहारिक योजना की सिफारिश करता है।" }
    ],
    exampleTitle: { en: "Practical example", hi: "व्यावहारिक उदाहरण" },
    example: { 
      en: "If Day 1 and Day 2 are favourable but Day 3 has significantly higher risk, TARANG may recommend returning by the end of Day 2.", 
      hi: "यदि दिन 1 और दिन 2 अनुकूल हैं, लेकिन दिन 3 में काफी अधिक जोखिम है, तो तरंग दिन 2 के अंत तक लौटने की सिफारिश कर सकता है।" 
    },
    guidanceTitle: { en: "How to use this in TARANG", hi: "तरंग में इसका उपयोग कैसे करें" },
    guidance: { 
      en: "Always provide accurate boat and duration details so TARANG can give you the most relevant safety recommendation.", 
      hi: "हमेशा सटीक नाव और अवधि का विवरण प्रदान करें ताकि तरंग आपको सबसे प्रासंगिक सुरक्षा सिफारिश दे सके।" 
    }
  },
  {
    id: "fishing-zones",
    order: 2,
    time: "2 min",
    title: { 
      en: "How to find promising fishing zones", 
      hi: "संभावित मछली पकड़ने के क्षेत्र कैसे खोजें" 
    },
    description: { 
      en: "Understand how fishing potential is calculated.", 
      hi: "समझें कि मछली पकड़ने की क्षमता की गणना कैसे की जाती है।" 
    },
    intro: { 
      en: "TARANG can use ocean and environmental information to identify areas with promising fishing conditions.", 
      hi: "तरंग समुद्र और पर्यावरण की जानकारी का उपयोग करके संभावित मछली पकड़ने की स्थिति वाले क्षेत्रों की पहचान कर सकता है।" 
    },
    body: [
      {
        en: "Potential Fishing Zones (PFZ) represent areas with favourable productivity conditions based on temperature and chlorophyll levels. TARANG considers both Fishing potential AND Safety conditions.",
        hi: "संभावित मत्स्य पालन क्षेत्र (PFZ) तापमान और क्लोरोफिल के स्तर के आधार पर अनुकूल उत्पादकता की स्थिति वाले क्षेत्रों का प्रतिनिधित्व करते हैं। तरंग मछली पकड़ने की क्षमता और सुरक्षा स्थितियों दोनों पर विचार करता है।"
      },
      {
        en: "The best recommendation is not necessarily the area with the highest fishing potential if that area has a higher safety risk.",
        hi: "सबसे अच्छी सिफारिश जरूरी नहीं कि उच्चतम मछली पकड़ने की क्षमता वाला क्षेत्र हो यदि उस क्षेत्र में अधिक सुरक्षा जोखिम है।"
      }
    ],
    exampleTitle: { en: "Practical example", hi: "व्यावहारिक उदाहरण" },
    example: { 
      en: "You might see a zone 15km away with 'Good' potential and low risk, recommended over a zone 20km away with 'Excellent' potential but high wave risks.", 
      hi: "आप 15 किमी दूर कम जोखिम और 'अच्छी' क्षमता वाला क्षेत्र देख सकते हैं, जिसे 20 किमी दूर 'उत्कृष्ट' क्षमता लेकिन उच्च लहर जोखिम वाले क्षेत्र से अधिक अनुशंसित किया गया है।" 
    },
    guidanceTitle: { en: "How to use this in TARANG", hi: "तरंग में इसका उपयोग कैसे करें" },
    guidance: { 
      en: "Look for the recommended zone on the map, and remember it indicates promising potential, not a guaranteed catch.", 
      hi: "नक्शे पर अनुशंसित क्षेत्र देखें, और याद रखें कि यह एक आशाजनक क्षमता का संकेत देता है, न कि गारंटीकृत पकड़ का।" 
    }
  },
  {
    id: "risk-scores",
    order: 3,
    time: "2 min",
    title: { 
      en: "How to understand risk scores", 
      hi: "जोखिम स्कोर को कैसे समझें" 
    },
    description: { 
      en: "Learn what the safety numbers mean.", 
      hi: "जानें कि सुरक्षा संख्याओं का क्या अर्थ है।" 
    },
    intro: { 
      en: "TARANG represents overall risk on a 0–100 scale.", 
      hi: "तरंग 0-100 के पैमाने पर समग्र जोखिम का प्रतिनिधित्व करता है।" 
    },
    body: [
      {
        en: "0–40: Low Risk. 41–60: Caution. 61–100: High Risk.",
        hi: "0-40: कम जोखिम। 41-60: सावधानी। 61-100: उच्च जोखिम।"
      },
      {
        en: "The score is based on relevant environmental and trip factors. A higher score means greater concern.",
        hi: "स्कोर प्रासंगिक पर्यावरणीय और यात्रा कारकों पर आधारित है। उच्च स्कोर का अर्थ है अधिक चिंता।"
      }
    ],
    exampleTitle: { en: "Practical example", hi: "व्यावहारिक उदाहरण" },
    example: { 
      en: "28/100 means current conditions are relatively favourable. 62/100 means conditions require greater caution and may make the trip unsuitable.", 
      hi: "28/100 का मतलब है कि वर्तमान स्थिति अपेक्षाकृत अनुकूल है। 62/100 का मतलब है कि स्थितियों में अधिक सावधानी की आवश्यकता है और यात्रा अनुपयुक्त हो सकती है।" 
    },
    guidanceTitle: { en: "How to use this in TARANG", hi: "तरंग में इसका उपयोग कैसे करें" },
    guidance: { 
      en: "Check the risk score for each day of your trip to decide whether it's safe to proceed or if you should turn back early.", 
      hi: "यह तय करने के लिए कि क्या आगे बढ़ना सुरक्षित है या आपको जल्दी वापस आ जाना चाहिए, अपनी यात्रा के प्रत्येक दिन के लिए जोखिम स्कोर की जांच करें।" 
    }
  },
  {
    id: "safer-routes",
    order: 4,
    time: "3 min",
    title: { 
      en: "How to use safer routes", 
      hi: "सुरक्षित मार्गों का उपयोग कैसे करें" 
    },
    description: { 
      en: "Navigate avoiding hazardous zones.", 
      hi: "खतरनाक क्षेत्रों से बचते हुए नेविगेट करें।" 
    },
    intro: { 
      en: "TARANG can evaluate possible paths between the harbour and a recommended fishing zone.", 
      hi: "तरंग बंदरगाह और अनुशंसित मछली पकड़ने के क्षेत्र के बीच संभावित रास्तों का मूल्यांकन कर सकता है।" 
    },
    body: [
      {
        en: "The route considers safety conditions along the journey rather than simply choosing the shortest path.",
        hi: "मार्ग केवल सबसे छोटा रास्ता चुनने के बजाय यात्रा के दौरान सुरक्षा स्थितियों पर विचार करता है।"
      },
      {
        en: "The safest route may not always be the shortest route because it navigates around high-risk areas like severe wave zones or restricted waters.",
        hi: "सबसे सुरक्षित मार्ग हमेशा सबसे छोटा मार्ग नहीं हो सकता है क्योंकि यह गंभीर लहर क्षेत्रों या प्रतिबंधित पानी जैसे उच्च जोखिम वाले क्षेत्रों के आसपास नेविगेट करता है।"
      }
    ],
    stepsTitle: {
      en: "TARANG evaluates:",
      hi: "तरंग मूल्यांकन करता है:"
    },
    steps: [
      { en: "1. Starting point", hi: "1. प्रारंभिक बिंदु" },
      { en: "2. Destination", hi: "2. गंतव्य" },
      { en: "3. Surrounding risk areas", hi: "3. आस-पास के जोखिम वाले क्षेत्र" },
      { en: "4. Possible paths", hi: "4. संभावित रास्ते" },
      { en: "5. Risk of each path", hi: "5. प्रत्येक रास्ते का जोखिम" },
      { en: "6. Recommended lower-risk route", hi: "6. अनुशंसित कम जोखिम वाला मार्ग" }
    ],
    exampleTitle: { en: "Practical example", hi: "व्यावहारिक उदाहरण" },
    example: { 
      en: "Instead of a straight 20km line crossing a severe weather warning, TARANG will plot a 24km curved path that keeps your vessel in safer waters.", 
      hi: "गंभीर मौसम की चेतावनी को पार करने वाली सीधी 20 किमी लाइन के बजाय, तरंग एक 24 किमी घुमावदार रास्ता बनाएगा जो आपके जहाज को सुरक्षित पानी में रखता है।" 
    },
    guidanceTitle: { en: "How to use this in TARANG", hi: "तरंग में इसका उपयोग कैसे करें" },
    guidance: { 
      en: "Ask TARANG for the safest route whenever you want help choosing a route to your fishing zone.", 
      hi: "जब भी आप अपने मछली पकड़ने के क्षेत्र के लिए मार्ग चुनने में मदद चाहते हैं तो तरंग से सबसे सुरक्षित मार्ग पूछें।" 
    }
  },
  {
    id: "active-trip",
    order: 5,
    time: "2 min",
    title: { 
      en: "How to use TARANG during a trip", 
      hi: "यात्रा के दौरान तरंग का उपयोग कैसे करें" 
    },
    description: { 
      en: "Stay updated while on the water.", 
      hi: "पानी पर रहते हुए अपडेट रहें।" 
    },
    intro: { 
      en: "TARANG is designed to keep you informed before and during your time at sea.", 
      hi: "तरंग को समुद्र में आपके समय से पहले और उसके दौरान आपको सूचित रखने के लिए डिज़ाइन किया गया है।" 
    },
    body: [
      {
        en: "Before leaving: Check sea conditions. Check your trip recommendation. Review the recommended route.",
        hi: "निकलने से पहले: समुद्र की स्थिति की जांच करें। अपनी यात्रा की सिफारिश की जांच करें। अनुशंसित मार्ग की समीक्षा करें।"
      },
      {
        en: "During the trip: Check TARANG for route status and relevant warnings.",
        hi: "यात्रा के दौरान: मार्ग की स्थिति और प्रासंगिक चेतावनियों के लिए तरंग की जाँच करें।"
      }
    ],
    exampleTitle: { en: "Practical example", hi: "व्यावहारिक उदाहरण" },
    example: { 
      en: "The prototype's Active Trip experience demonstrates how route monitoring and continuous safety alerts function on the water.", 
      hi: "प्रोटोटाइप का सक्रिय यात्रा अनुभव प्रदर्शित करता है कि पानी पर मार्ग की निगरानी और निरंतर सुरक्षा अलर्ट कैसे काम करते हैं।" 
    },
    guidanceTitle: { en: "How to use this in TARANG", hi: "तरंग में इसका उपयोग कैसे करें" },
    guidance: { 
      en: "Keep the Active Trip screen open during navigation to quickly reference your progress and any incoming hazard alerts.", 
      hi: "नेविगेशन के दौरान अपनी प्रगति और किसी भी आने वाले खतरे के अलर्ट को जल्दी से संदर्भित करने के लिए सक्रिय यात्रा स्क्रीन को खुला रखें।" 
    }
  }
];
