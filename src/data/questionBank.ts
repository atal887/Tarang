export type IntentCategory = "SAFETY_TOMORROW" | "NEAREST_PFZ" | "WAVE_HEIGHT" | "CYCLONE_ALERT" | "MULTI_DAY_TRIP" | "SAFE_ROUTE" | "CHLOROPHYLL_ZONE" | "AVOID_ZONE" | "WIND_FORECAST" | "BOAT_SAFETY" | "WHY_NOT_RECOMMENDED" | "SAFEST_TIME" | "RESTRICTED_ZONE" | "CURRENT_COASTAL_CONDITIONS" | "NIGHT_VISIBILITY" | "WEEKEND_FISHING" | "BEST_FISHING_ZONE" | "UNKNOWN";

export const questionBank = [
  {
    "city": "Kochi",
    "state": "Kerala",
    "language": "Malayalam",
    "no": "1",
    "intent": "SAFETY_TOMORROW",
    "english": {
      "q": "Is it safe to fish near Kochi tomorrow?",
      "a": "Based on the demo forecast for tomorrow, conditions are moderately safe for fishing near Kochi. Check the latest local warning before departure."
    },
    "hindi": {
      "q": "क्या कल कोच्चि के पास मछली पकड़ना सुरक्षित है?",
      "a": "डेमो पूर्वानुमान के अनुसार, कल Kochi के पास मछली पकड़ने की परिस्थितियाँ मध्यम रूप से सुरक्षित हैं। रवाना होने से पहले नवीनतम स्थानीय चेतावनी अवश्य जाँचें।"
    },
    "regional": {
      "q": "നാളെ കൊച്ചിക്ക് സമീപം മീൻപിടിക്കാൻ സുരക്ഷിതമാണോ?",
      "a": "ഡെമോ പ്രവചനമനുസരിച്ച്, നാളെ Kochi-ന് സമീപം മത്സ്യബന്ധനത്തിന് സാഹചര്യങ്ങൾ മിതമായി സുരക്ഷിതമാണ്. പുറപ്പെടുന്നതിന് മുമ്പ് ഏറ്റവും പുതിയ പ്രാദേശിക മുന്നറിയിപ്പ് പരിശോധിക്കുക."
    }
  },
  {
    "city": "Kochi",
    "state": "Kerala",
    "language": "Malayalam",
    "no": "2",
    "intent": "NEAREST_PFZ",
    "english": {
      "q": "Where is the nearest Potential Fishing Zone today?",
      "a": "The nearest demo Potential Fishing Zone is shown on the map for Kochi; use the highlighted zone and check its current risk before departure."
    },
    "hindi": {
      "q": "आज सबसे नज़दीकी संभावित मछली पकड़ने का क्षेत्र (PFZ) कहाँ है?",
      "a": "Kochi के लिए निकटतम डेमो संभावित मछली पकड़ने का क्षेत्र मानचित्र पर दिखाया गया है; रवाना होने से पहले चिन्हित क्षेत्र का वर्तमान जोखिम जाँचें।"
    },
    "regional": {
      "q": "ഇന്ന് ഏറ്റവും അടുത്തുള്ള സാധ്യതയുള്ള മത്സ്യബന്ധന മേഖല (PFZ) എവിടെയാണ്?",
      "a": "Kochi-ന് സമീപമുള്ള ഡെമോ PFZ മാപ്പിൽ കാണിച്ചിരിക്കുന്നു. പുറപ്പെടുന്നതിന് മുമ്പ് അടയാളപ്പെടുത്തിയ മേഖലയിലെ നിലവിലെ അപകടസാധ്യത പരിശോധിക്കുക."
    }
  },
  {
    "city": "Kochi",
    "state": "Kerala",
    "language": "Malayalam",
    "no": "3",
    "intent": "WAVE_HEIGHT",
    "english": {
      "q": "What is the wave height near Kochi right now?",
      "a": "In the demo scenario, wave height near Kochi is 1.2–1.8 m. Treat this as demonstration data, not a live observation."
    },
    "hindi": {
      "q": "अभी कोच्चि के पास लहरों की ऊँचाई कितनी है?",
      "a": "डेमो परिदृश्य में Kochi के पास लहरों की ऊँचाई 1.2–1.8 मीटर है। इसे केवल प्रदर्शन डेटा मानें, वास्तविक समय का मापन नहीं।"
    },
    "regional": {
      "q": "ഇപ്പോൾ കൊച്ചിക്ക് സമീപം തിരമാലയുടെ ഉയരം എത്രയാണ്?",
      "a": "ഡെമോ സാഹചര്യത്തിൽ Kochi-ന് സമീപമുള്ള തിരമാലയുടെ ഉയരം 1.2–1.8 മീറ്ററാണ്. ഇത് ഡെമോ ഡാറ്റ മാത്രമാണ്, തത്സമയ അളവല്ല."
    }
  },
  {
    "city": "Kochi",
    "state": "Kerala",
    "language": "Malayalam",
    "no": "4",
    "intent": "CYCLONE_ALERT",
    "english": {
      "q": "Are there any cyclone alerts in my area?",
      "a": "No severe cyclone alert is active in the demo scenario for Kochi. Always verify the latest official warning before departure."
    },
    "hindi": {
      "q": "क्या मेरे क्षेत्र में कोई चक्रवात चेतावनी है?",
      "a": "डेमो परिदृश्य में Kochi के लिए कोई गंभीर चक्रवात चेतावनी सक्रिय नहीं है। रवाना होने से पहले नवीनतम आधिकारिक चेतावनी अवश्य जाँचें।"
    },
    "regional": {
      "q": "എന്റെ പ്രദേശത്ത് ചുഴലിക്കാറ്റ് മുന്നറിയിപ്പ് ഉണ്ടോ?",
      "a": "ഡെമോ സാഹചര്യത്തിൽ Kochi-ന് സമീപം ഗുരുതരമായ ചുഴലിക്കാറ്റ് മുന്നറിയിപ്പ് സജീവമല്ല. പുറപ്പെടുന്നതിന് മുമ്പ് ഔദ്യോഗിക മുന്നറിയിപ്പ് പരിശോധിക്കുക."
    }
  },
  {
    "city": "Kochi",
    "state": "Kerala",
    "language": "Malayalam",
    "no": "5",
    "intent": "MULTI_DAY_TRIP",
    "english": {
      "q": "Is it safe for a 3-day trip starting tomorrow?",
      "a": "For the demo 3-day trip, Day 1 is Safe, Day 2 is Safe, and Day 3 is Caution. The overall trip status is Caution because the worst day governs."
    },
    "hindi": {
      "q": "क्या कल से शुरू होने वाली 3-दिन की यात्रा सुरक्षित है?",
      "a": "डेमो 3-दिन की यात्रा में दिन 1 सुरक्षित, दिन 2 सुरक्षित और दिन 3 सावधानी है। पूरी यात्रा की स्थिति सावधानी है क्योंकि सबसे जोखिम वाले दिन के आधार पर निर्णय होता है।"
    },
    "regional": {
      "q": "നാളെ മുതൽ തുടങ്ങുന്ന 3 ദിവസത്തെ യാത്ര സുരക്ഷിതമാണോ?",
      "a": "ഡെമോ 3-ദിവസ യാത്രയിൽ ദിവസം 1 സുരക്ഷിതം, ദിവസം 2 സുരക്ഷിതം, ദിവസം 3 ജാഗ്രതയാണ്. ഏറ്റവും അപകടമുള്ള ദിവസത്തെ അടിസ്ഥാനമാക്കി ആകെ നില ജാഗ്രതയാണ്."
    }
  },
  {
    "city": "Kochi",
    "state": "Kerala",
    "language": "Malayalam",
    "no": "6",
    "intent": "SAFE_ROUTE",
    "english": {
      "q": "What's the safest route from Kochi harbor to the nearest fishing zone?",
      "a": "The demo route from Kochi harbor to the nearest fishing zone avoids the highlighted hazard areas and follows the lowest-risk path shown on the map."
    },
    "hindi": {
      "q": "कोच्चि बंदरगाह से नज़दीकी मछली पकड़ने के क्षेत्र तक सबसे सुरक्षित रास्ता कौन सा है?",
      "a": "डेमो मार्ग Kochi बंदरगाह से निकटतम मछली पकड़ने के क्षेत्र तक चिन्हित जोखिम वाले क्षेत्रों से बचता है और मानचित्र पर दिखाए गए कम-जोखिम वाले रास्ते का अनुसरण करता है।"
    },
    "regional": {
      "q": "കൊച്ചി തുറമുഖത്ത് നിന്ന് ഏറ്റവും അടുത്ത മത്സ്യബന്ധന മേഖലയിലേക്കുള്ള സുരക്ഷിതമായ വഴി ഏതാണ്?",
      "a": "ഡെമോ റൂട്ട് Kochi തുറമുഖത്തിൽ നിന്ന് സമീപത്തെ മത്സ്യബന്ധന മേഖലയിലേക്ക് ഉയർന്ന അപകടമുള്ള പ്രദേശങ്ങൾ ഒഴിവാക്കി മാപ്പിലെ കുറഞ്ഞ അപകടസാധ്യതയുള്ള പാത പിന്തുടരുന്നു."
    }
  },
  {
    "city": "Kochi",
    "state": "Kerala",
    "language": "Malayalam",
    "no": "7",
    "intent": "CHLOROPHYLL_ZONE",
    "english": {
      "q": "Which regions show high chlorophyll concentration nearby?",
      "a": "The demo map highlights the nearby areas with higher chlorophyll concentration; these are candidate productivity zones, not a guaranteed catch."
    },
    "hindi": {
      "q": "आस-पास किन क्षेत्रों में क्लोरोफिल का स्तर अधिक है?",
      "a": "डेमो मानचित्र में अधिक क्लोरोफिल वाले आसपास के क्षेत्र चिन्हित हैं; ये संभावित उत्पादक क्षेत्र हैं, निश्चित पकड़ की गारंटी नहीं।"
    },
    "regional": {
      "q": "സമീപത്ത് ഏത് പ്രദേശങ്ങളിലാണ് ക്ലോറോഫിൽ അളവ് കൂടുതൽ?",
      "a": "ഡെമോ മാപ്പിൽ കൂടുതൽ ക്ലോറോഫിൽ ഉള്ള സമീപ പ്രദേശങ്ങൾ അടയാളപ്പെടുത്തിയിട്ടുണ്ട്. ഇവ സാധ്യതയുള്ള ഉൽപാദന മേഖലകളാണ്; ഉറപ്പായ മീൻപിടിത്തമല്ല."
    }
  },
  {
    "city": "Kochi",
    "state": "Kerala",
    "language": "Malayalam",
    "no": "8",
    "intent": "AVOID_ZONE",
    "english": {
      "q": "Should I avoid any zones today due to bad weather?",
      "a": "Yes. In the demo scenario, the system recommends avoiding the highlighted high-risk zones today because of adverse conditions."
    },
    "hindi": {
      "q": "क्या आज खराब मौसम के कारण मुझे किसी क्षेत्र से बचना चाहिए?",
      "a": "हाँ। डेमो परिदृश्य में प्रतिकूल परिस्थितियों के कारण सिस्टम आज चिन्हित उच्च-जोखिम वाले क्षेत्रों से बचने की सलाह देता है।"
    },
    "regional": {
      "q": "മോശം കാലാവസ്ഥ കാരണം ഇന്ന് ഏതെങ്കിലും മേഖല ഒഴിവാക്കണോ?",
      "a": "അതെ. ഡെമോ സാഹചര്യത്തിൽ മോശം സാഹചര്യങ്ങൾ കാരണം അടയാളപ്പെടുത്തിയ ഉയർന്ന അപകടമുള്ള മേഖലകൾ ഇന്ന് ഒഴിവാക്കാൻ സിസ്റ്റം നിർദ്ദേശിക്കുന്നു."
    }
  },
  {
    "city": "Kochi",
    "state": "Kerala",
    "language": "Malayalam",
    "no": "9",
    "intent": "WIND_FORECAST",
    "english": {
      "q": "What is the wind speed forecast for tonight?",
      "a": "The demo forecast for tonight shows wind around 12–18 km/h near Kochi. Verify the latest forecast before going out."
    },
    "hindi": {
      "q": "आज रात के लिए हवा की गति का पूर्वानुमान क्या है?",
      "a": "डेमो पूर्वानुमान में आज रात Kochi के पास हवा की गति लगभग 12–18 किमी/घंटा है। बाहर जाने से पहले नवीनतम पूर्वानुमान जाँचें।"
    },
    "regional": {
      "q": "ഇന്ന് രാത്രിയിലെ കാറ്റിന്റെ വേഗതയുടെ പ്രവചനം എന്താണ്?",
      "a": "ഡെമോ പ്രവചനത്തിൽ ഇന്ന് രാത്രി Kochi-ന് സമീപം കാറ്റിന്റെ വേഗം ഏകദേശം 12–18 കി.മീ/മണിക്കൂർ ആണ്. പുറപ്പെടുന്നതിന് മുമ്പ് ഏറ്റവും പുതിയ പ്രവചനം പരിശോധിക്കുക."
    }
  },
  {
    "city": "Kochi",
    "state": "Kerala",
    "language": "Malayalam",
    "no": "10",
    "intent": "BOAT_SAFETY",
    "english": {
      "q": "Is my motorized boat safe to go out in these conditions?",
      "a": "For the demo vessel profile, the motorized boat is rated Caution under these conditions. The exact result depends on the vessel profile and current inputs."
    },
    "hindi": {
      "q": "क्या इन परिस्थितियों में मेरी मोटर वाली नाव जाना सुरक्षित है?",
      "a": "डेमो नाव प्रोफ़ाइल के लिए इन परिस्थितियों में मोटर वाली नाव की स्थिति सावधानी है। वास्तविक परिणाम नाव की प्रोफ़ाइल और वर्तमान इनपुट पर निर्भर करता है।"
    },
    "regional": {
      "q": "ഈ സാഹചര്യത്തിൽ എന്റെ മോട്ടോർ ബോട്ട് പോകാൻ സുരക്ഷിതമാണോ?",
      "a": "ഡെമോ ബോട്ട് പ്രൊഫൈലിൽ ഈ സാഹചര്യങ്ങളിൽ മോട്ടോർ ബോട്ടിന്റെ നില ജാഗ്രതയാണ്. യഥാർത്ഥ ഫലം ബോട്ട് പ്രൊഫൈലിനെയും നിലവിലെ ഡാറ്റയെയും ആശ്രയിക്കും."
    }
  },
  {
    "city": "Kochi",
    "state": "Kerala",
    "language": "Malayalam",
    "no": "11",
    "intent": "WHY_NOT_RECOMMENDED",
    "english": {
      "q": "Why is fishing not recommended today?",
      "a": "Fishing is not recommended in the demo scenario because the safety checks identify adverse conditions as the dominant risk factor."
    },
    "hindi": {
      "q": "आज मछली पकड़ने की सलाह क्यों नहीं दी जा रही?",
      "a": "डेमो परिदृश्य में मछली पकड़ने की सलाह नहीं दी जा रही है क्योंकि सुरक्षा जाँच में प्रतिकूल परिस्थितियाँ प्रमुख जोखिम कारक पाई गई हैं।"
    },
    "regional": {
      "q": "ഇന്ന് മീൻപിടിക്കാൻ ശുപാർശ ചെയ്യാത്തത് എന്തുകൊണ്ട്?",
      "a": "ഡെമോ സാഹചര്യത്തിൽ മത്സ്യബന്ധനം ശുപാർശ ചെയ്യുന്നില്ല, കാരണം സുരക്ഷാ പരിശോധനയിൽ മോശം സാഹചര്യങ്ങളാണ് പ്രധാന അപകട ഘടകമായി കണ്ടെത്തിയത്."
    }
  },
  {
    "city": "Kochi",
    "state": "Kerala",
    "language": "Malayalam",
    "no": "12",
    "intent": "SAFETY_TOMORROW",
    "english": {
      "q": "What time is safest to go out tomorrow?",
      "a": "The demo recommends the daytime window with the lowest combined risk. Re-check the forecast close to departure rather than relying on this fixed demo answer."
    },
    "hindi": {
      "q": "कल जाने के लिए सबसे सुरक्षित समय कौन सा है?",
      "a": "डेमो में दिन के उस समय की सिफारिश की गई है जिसमें संयुक्त जोखिम सबसे कम है। रवाना होने के समय के करीब पूर्वानुमान दोबारा जाँचें; इस स्थिर डेमो उत्तर पर निर्भर न रहें।"
    },
    "regional": {
      "q": "നാളെ പോകാൻ ഏറ്റവും സുരക്ഷിതമായ സമയം ഏതാണ്?",
      "a": "ഡെമോയിൽ സംയുക്ത അപകടസാധ്യത ഏറ്റവും കുറഞ്ഞ പകൽ സമയമാണ് ശുപാർശ ചെയ്യുന്നത്. പുറപ്പെടുന്നതിന് അടുത്ത് പ്രവചനം വീണ്ടും പരിശോധിക്കുക."
    }
  },
  {
    "city": "Kochi",
    "state": "Kerala",
    "language": "Malayalam",
    "no": "13",
    "intent": "RESTRICTED_ZONE",
    "english": {
      "q": "Are there any restricted zones near Kochi?",
      "a": "The demo map flags restricted or protected areas near Kochi. Do not enter a restricted zone; confirm the latest official boundaries."
    },
    "hindi": {
      "q": "क्या कोच्चि के पास कोई प्रतिबंधित क्षेत्र है?",
      "a": "Kochi के पास डेमो मानचित्र प्रतिबंधित या संरक्षित क्षेत्रों को चिन्हित करता है। प्रतिबंधित क्षेत्र में प्रवेश न करें; नवीनतम आधिकारिक सीमाएँ जाँचें।"
    },
    "regional": {
      "q": "കൊച്ചിക്ക് സമീപം നിയന്ത്രിത മേഖലകൾ ഉണ്ടോ?",
      "a": "Kochi-ന് സമീപമുള്ള നിയന്ത്രിത അല്ലെങ്കിൽ സംരക്ഷിത പ്രദേശങ്ങൾ ഡെമോ മാപ്പിൽ അടയാളപ്പെടുത്തിയിട്ടുണ്ട്. ഏറ്റവും പുതിയ ഔദ്യോഗിക അതിർത്തികൾ പരിശോധിക്കുക."
    }
  },
  {
    "city": "Kochi",
    "state": "Kerala",
    "language": "Malayalam",
    "no": "14",
    "intent": "CURRENT_COASTAL_CONDITIONS",
    "english": {
      "q": "What's the current near the coast today?",
      "a": "The demo scenario shows a moderate near-shore current near Kochi. Current conditions can change, so verify the latest marine data."
    },
    "hindi": {
      "q": "आज तट के पास समुद्री धारा कैसी है?",
      "a": "डेमो परिदृश्य में Kochi के तट के पास समुद्री धारा मध्यम है। समुद्री परिस्थितियाँ बदल सकती हैं, इसलिए नवीनतम डेटा जाँचें।"
    },
    "regional": {
      "q": "ഇന്ന് തീരത്തിനടുത്ത് കടൽ പ്രവാഹം എങ്ങനെയാണ്?",
      "a": "ഡെമോ സാഹചര്യത്തിൽ Kochi-ന് സമീപമുള്ള തീരപ്രദേശത്തെ കടൽപ്രവാഹം മിതമാണ്. ഏറ്റവും പുതിയ സമുദ്ര ഡാറ്റ പരിശോധിക്കുക."
    }
  },
  {
    "city": "Kochi",
    "state": "Kerala",
    "language": "Malayalam",
    "no": "15",
    "intent": "NIGHT_VISIBILITY",
    "english": {
      "q": "Is visibility good enough for night fishing today?",
      "a": "The demo scenario rates visibility as adequate for the selected period, but night fishing should only proceed after checking the latest visibility and weather conditions."
    },
    "hindi": {
      "q": "क्या आज रात मछली पकड़ने के लिए दृश्यता पर्याप्त है?",
      "a": "डेमो परिदृश्य में चुने गए समय के लिए दृश्यता पर्याप्त है, लेकिन रात में मछली पकड़ने से पहले नवीनतम दृश्यता और मौसम की स्थिति जाँचनी चाहिए।"
    },
    "regional": {
      "q": "ഇന്ന് രാത്രി മീൻപിടിക്കാൻ ദൃശ്യപരത മതിയാകുമോ?",
      "a": "ഡെമോ സാഹചര്യത്തിൽ തിരഞ്ഞെടുത്ത സമയത്തേക്ക് ദൃശ്യപരത മതിയായതാണ്. രാത്രിയിൽ പോകുന്നതിന് മുമ്പ് ഏറ്റവും പുതിയ ദൃശ്യപരതയും കാലാവസ്ഥയും പരിശോധിക്കുക."
    }
  },
  {
    "city": "Kochi",
    "state": "Kerala",
    "language": "Malayalam",
    "no": "16",
    "intent": "WEEKEND_FISHING",
    "english": {
      "q": "Can I go fishing this weekend?",
      "a": "For the demo weekend forecast, fishing is rated Caution. Re-check the forecast and warnings closer to the actual trip."
    },
    "hindi": {
      "q": "क्या मैं इस सप्ताहांत मछली पकड़ने जा सकता हूँ?",
      "a": "डेमो सप्ताहांत पूर्वानुमान में मछली पकड़ने की स्थिति सावधानी है। वास्तविक यात्रा के करीब पूर्वानुमान और चेतावनियाँ दोबारा जाँचें।"
    },
    "regional": {
      "q": "ഈ വാരാന്ത്യത്തിൽ എനിക്ക് മീൻപിടിക്കാൻ പോകാമോ?",
      "a": "ഡെമോ വാരാന്ത്യ പ്രവചനത്തിൽ മത്സ്യബന്ധനത്തിന് ജാഗ്രത നിലയാണ്. യാത്രയ്ക്ക് അടുത്ത് പ്രവചനവും മുന്നറിയിപ്പുകളും വീണ്ടും പരിശോധിക്കുക."
    }
  },
  {
    "city": "Kochi",
    "state": "Kerala",
    "language": "Malayalam",
    "no": "17",
    "intent": "BEST_FISHING_ZONE",
    "english": {
      "q": "What is the best fishing zone for my boat type?",
      "a": "The demo ranks the highlighted PFZ as the best candidate for the selected boat type after combining productivity and safety. It is a recommendation, not a guaranteed catch."
    },
    "hindi": {
      "q": "मेरी नाव के प्रकार के लिए सबसे अच्छा मछली पकड़ने का क्षेत्र कौन सा है?",
      "a": "डेमो में चुनी गई नाव के प्रकार के लिए उत्पादकता और सुरक्षा को मिलाकर चिन्हित PFZ को सबसे अच्छा विकल्प माना गया है। यह सिफारिश है, पकड़ की गारंटी नहीं।"
    },
    "regional": {
      "q": "എന്റെ ബോട്ട് തരത്തിന് ഏറ്റവും അനുയോജ്യമായ മത്സ്യബന്ധന മേഖല ഏതാണ്?",
      "a": "സുരക്ഷയും ഉൽപാദനക്ഷമതയും കൂട്ടിച്ചേർത്ത് തിരഞ്ഞെടുത്ത ബോട്ട് തരത്തിന് ഡെമോയിൽ അടയാളപ്പെടുത്തിയ PFZ മികച്ച സാധ്യതയായി റാങ്ക് ചെയ്തിട്ടുണ്ട്. ഉറപ്പായ മീൻപിടിത്തമല്ല."
    }
  },
  {
    "city": "Mangalore",
    "state": "Karnataka",
    "language": "Kannada",
    "no": "1",
    "intent": "SAFETY_TOMORROW",
    "english": {
      "q": "Is it safe to fish near Mangalore tomorrow?",
      "a": "Based on the demo forecast for tomorrow, conditions are moderately safe for fishing near Mangalore. Check the latest local warning before departure."
    },
    "hindi": {
      "q": "क्या कल मंगलौर के पास मछली पकड़ना सुरक्षित है?",
      "a": "डेमो पूर्वानुमान के अनुसार, कल Mangalore के पास मछली पकड़ने की परिस्थितियाँ मध्यम रूप से सुरक्षित हैं। रवाना होने से पहले नवीनतम स्थानीय चेतावनी अवश्य जाँचें।"
    },
    "regional": {
      "q": "ನಾಳೆ ಮಂಗಳೂರು ಬಳಿ ಮೀನುಗಾರಿಕೆ ಸುರಕ್ಷಿತವೇ?",
      "a": "ಡೆಮೊ ಮುನ್ಸೂಚನೆಯ ಪ್ರಕಾರ, ನಾಳೆ Mangalore ಸಮೀಪ ಮೀನುಗಾರಿಕೆಗೆ ಪರಿಸ್ಥಿತಿಗಳು ಮಧ್ಯಮವಾಗಿ ಸುರಕ್ಷಿತವಾಗಿವೆ. ಹೊರಡುವ ಮೊದಲು ಇತ್ತೀಚಿನ ಸ್ಥಳೀಯ ಎಚ್ಚರಿಕೆಯನ್ನು ಪರಿಶೀಲಿಸಿ."
    }
  },
  {
    "city": "Mangalore",
    "state": "Karnataka",
    "language": "Kannada",
    "no": "2",
    "intent": "NEAREST_PFZ",
    "english": {
      "q": "Where is the nearest Potential Fishing Zone today?",
      "a": "The nearest demo Potential Fishing Zone is shown on the map for Mangalore; use the highlighted zone and check its current risk before departure."
    },
    "hindi": {
      "q": "आज सबसे नज़दीकी संभावित मछली पकड़ने का क्षेत्र (PFZ) कहाँ है?",
      "a": "Mangalore के लिए निकटतम डेमो संभावित मछली पकड़ने का क्षेत्र मानचित्र पर दिखाया गया है; रवाना होने से पहले चिन्हित क्षेत्र का वर्तमान जोखिम जाँचें।"
    },
    "regional": {
      "q": "ಇಂದು ಹತ್ತಿರದ ಸಂಭಾವ್ಯ ಮೀನುಗಾರಿಕಾ ವಲಯ (PFZ) ಎಲ್ಲಿದೆ?",
      "a": "Mangalore ಸಮೀಪದ ಡೆಮೊ PFZ ಅನ್ನು ನಕ್ಷೆಯಲ್ಲಿ ತೋರಿಸಲಾಗಿದೆ. ಹೊರಡುವ ಮೊದಲು ಗುರುತಿಸಲಾದ ಪ್ರದೇಶದ ಪ್ರಸ್ತುತ ಅಪಾಯವನ್ನು ಪರಿಶೀಲಿಸಿ."
    }
  },
  {
    "city": "Mangalore",
    "state": "Karnataka",
    "language": "Kannada",
    "no": "3",
    "intent": "WAVE_HEIGHT",
    "english": {
      "q": "What is the wave height near Mangalore right now?",
      "a": "In the demo scenario, wave height near Mangalore is 1.2–1.8 m. Treat this as demonstration data, not a live observation."
    },
    "hindi": {
      "q": "अभी मंगलौर के पास लहरों की ऊँचाई कितनी है?",
      "a": "डेमो परिदृश्य में Mangalore के पास लहरों की ऊँचाई 1.2–1.8 मीटर है। इसे केवल प्रदर्शन डेटा मानें, वास्तविक समय का मापन नहीं।"
    },
    "regional": {
      "q": "ಈಗ ಮಂಗಳೂರು ಬಳಿ ಅಲೆಗಳ ಎತ್ತರ ಎಷ್ಟು?",
      "a": "ಡೆಮೊ ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ Mangalore ಸಮೀಪದ ಅಲೆಗಳ ಎತ್ತರ 1.2–1.8 ಮೀಟರ್. ಇದು ಡೆಮೊ ಡೇಟಾ ಮಾತ್ರ, ನೇರ ವೀಕ್ಷಣೆ ಅಲ್ಲ."
    }
  },
  {
    "city": "Mangalore",
    "state": "Karnataka",
    "language": "Kannada",
    "no": "4",
    "intent": "CYCLONE_ALERT",
    "english": {
      "q": "Are there any cyclone alerts in my area?",
      "a": "No severe cyclone alert is active in the demo scenario for Mangalore. Always verify the latest official warning before departure."
    },
    "hindi": {
      "q": "क्या मेरे क्षेत्र में कोई चक्रवात चेतावनी है?",
      "a": "डेमो परिदृश्य में Mangalore के लिए कोई गंभीर चक्रवात चेतावनी सक्रिय नहीं है। रवाना होने से पहले नवीनतम आधिकारिक चेतावनी अवश्य जाँचें।"
    },
    "regional": {
      "q": "ನನ್ನ ಪ್ರದೇಶದಲ್ಲಿ ಚಂಡಮಾರುತ ಎಚ್ಚರಿಕೆ ಇದೆಯೇ?",
      "a": "ಡೆಮೊ ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ Mangaloreಗಾಗಿ ಯಾವುದೇ ಗಂಭೀರ ಚಂಡಮಾರುತ ಎಚ್ಚರಿಕೆ ಸಕ್ರಿಯವಾಗಿಲ್ಲ. ಹೊರಡುವ ಮೊದಲು ಅಧಿಕೃತ ಎಚ್ಚರಿಕೆಯನ್ನು ಪರಿಶೀಲಿಸಿ."
    }
  },
  {
    "city": "Mangalore",
    "state": "Karnataka",
    "language": "Kannada",
    "no": "5",
    "intent": "MULTI_DAY_TRIP",
    "english": {
      "q": "Is it safe for a 3-day trip starting tomorrow?",
      "a": "For the demo 3-day trip, Day 1 is Safe, Day 2 is Safe, and Day 3 is Caution. The overall trip status is Caution because the worst day governs."
    },
    "hindi": {
      "q": "क्या कल से शुरू होने वाली 3-दिन की यात्रा सुरक्षित है?",
      "a": "डेमो 3-दिन की यात्रा में दिन 1 सुरक्षित, दिन 2 सुरक्षित और दिन 3 सावधानी है। पूरी यात्रा की स्थिति सावधानी है क्योंकि सबसे जोखिम वाले दिन के आधार पर निर्णय होता है।"
    },
    "regional": {
      "q": "ನಾಳೆಯಿಂದ ಪ್ರಾರಂಭವಾಗುವ 3-ದಿನಗಳ ಪ್ರಯಾಣ ಸುರಕ್ಷಿತವೇ?",
      "a": "ಡೆಮೊ 3-ದಿನದ ಪ್ರಯಾಣದಲ್ಲಿ ದಿನ 1 ಸುರಕ್ಷಿತ, ದಿನ 2 ಸುರಕ್ಷಿತ ಮತ್ತು ದಿನ 3 ಎಚ್ಚರಿಕೆ. ಹೆಚ್ಚು ಅಪಾಯದ ದಿನದ ಆಧಾರದ ಮೇಲೆ ಒಟ್ಟು ಸ್ಥಿತಿ ಎಚ್ಚರಿಕೆ."
    }
  },
  {
    "city": "Mangalore",
    "state": "Karnataka",
    "language": "Kannada",
    "no": "6",
    "intent": "SAFE_ROUTE",
    "english": {
      "q": "What's the safest route from Mangalore harbor to the nearest fishing zone?",
      "a": "The demo route from Mangalore harbor to the nearest fishing zone avoids the highlighted hazard areas and follows the lowest-risk path shown on the map."
    },
    "hindi": {
      "q": "मंगलौर बंदरगाह से नज़दीकी मछली पकड़ने के क्षेत्र तक सबसे सुरक्षित रास्ता कौन सा है?",
      "a": "डेमो मार्ग Mangalore बंदरगाह से निकटतम मछली पकड़ने के क्षेत्र तक चिन्हित जोखिम वाले क्षेत्रों से बचता है और मानचित्र पर दिखाए गए कम-जोखिम वाले रास्ते का अनुसरण करता है।"
    },
    "regional": {
      "q": "ಮಂಗಳೂರು ಬಂದರಿನಿಂದ ಹತ್ತಿರದ ಮೀನುಗಾರಿಕಾ ವಲಯಕ್ಕೆ ಸುರಕ್ಷಿತ ಮಾರ್ಗ ಯಾವುದು?",
      "a": "ಡೆಮೊ ಮಾರ್ಗವು Mangalore ಬಂದರಿನಿಂದ ಸಮೀಪದ ಮೀನುಗಾರಿಕಾ ವಲಯಕ್ಕೆ ಅಪಾಯದ ಪ್ರದೇಶಗಳನ್ನು ತಪ್ಪಿಸಿ ನಕ್ಷೆಯಲ್ಲಿ ತೋರಿಸಿದ ಕಡಿಮೆ-ಅಪಾಯದ ಮಾರ್ಗವನ್ನು ಅನುಸರಿಸುತ್ತದೆ."
    }
  },
  {
    "city": "Mangalore",
    "state": "Karnataka",
    "language": "Kannada",
    "no": "7",
    "intent": "CHLOROPHYLL_ZONE",
    "english": {
      "q": "Which regions show high chlorophyll concentration nearby?",
      "a": "The demo map highlights the nearby areas with higher chlorophyll concentration; these are candidate productivity zones, not a guaranteed catch."
    },
    "hindi": {
      "q": "आस-पास किन क्षेत्रों में क्लोरोफिल का स्तर अधिक है?",
      "a": "डेमो मानचित्र में अधिक क्लोरोफिल वाले आसपास के क्षेत्र चिन्हित हैं; ये संभावित उत्पादक क्षेत्र हैं, निश्चित पकड़ की गारंटी नहीं।"
    },
    "regional": {
      "q": "ಹತ್ತಿರದಲ್ಲಿ ಯಾವ ಪ್ರದೇಶಗಳಲ್ಲಿ ಕ್ಲೋರೊಫಿಲ್ ಪ್ರಮಾಣ ಹೆಚ್ಚಿದೆ?",
      "a": "ಡೆಮೊ ನಕ್ಷೆಯಲ್ಲಿ ಹೆಚ್ಚಿನ ಕ್ಲೋರೊಫಿಲ್ ಇರುವ ಸಮೀಪದ ಪ್ರದೇಶಗಳನ್ನು ಗುರುತಿಸಲಾಗಿದೆ. ಇವು ಸಾಧ್ಯತೆಯಿರುವ ಉತ್ಪಾದಕ ಪ್ರದೇಶಗಳು; ಖಚಿತ ಮೀನುಗಾರಿಕೆಯ ಭರವಸೆ ಅಲ್ಲ."
    }
  },
  {
    "city": "Mangalore",
    "state": "Karnataka",
    "language": "Kannada",
    "no": "8",
    "intent": "AVOID_ZONE",
    "english": {
      "q": "Should I avoid any zones today due to bad weather?",
      "a": "Yes. In the demo scenario, the system recommends avoiding the highlighted high-risk zones today because of adverse conditions."
    },
    "hindi": {
      "q": "क्या आज खराब मौसम के कारण मुझे किसी क्षेत्र से बचना चाहिए?",
      "a": "हाँ। डेमो परिदृश्य में प्रतिकूल परिस्थितियों के कारण सिस्टम आज चिन्हित उच्च-जोखिम वाले क्षेत्रों से बचने की सलाह देता है।"
    },
    "regional": {
      "q": "ಇಂದು ಕೆಟ್ಟ ಹವಾಮಾನದಿಂದಾಗಿ ಯಾವುದೇ ವಲಯ ತಪ್ಪಿಸಬೇಕೇ?",
      "a": "ಹೌದು. ಡೆಮೊ ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ ಪ್ರತಿಕೂಲ ಕಾರಣಗಳಿಂದ ಗುರುತಿಸಲಾದ ಹೆಚ್ಚಿನ ಅಪಾಯದ ವಲಯಗಳನ್ನು ಇಂದು ತಪ್ಪಿಸಲು ವ್ಯವಸ್ಥೆ ಸೂಚಿಸುತ್ತದೆ."
    }
  },
  {
    "city": "Mangalore",
    "state": "Karnataka",
    "language": "Kannada",
    "no": "9",
    "intent": "WIND_FORECAST",
    "english": {
      "q": "What is the wind speed forecast for tonight?",
      "a": "The demo forecast for tonight shows wind around 12–18 km/h near Mangalore. Verify the latest forecast before going out."
    },
    "hindi": {
      "q": "आज रात के लिए हवा की गति का पूर्वानुमान क्या है?",
      "a": "डेमो पूर्वानुमान में आज रात Mangalore के पास हवा की गति लगभग 12–18 किमी/घंटा है। बाहर जाने से पहले नवीनतम पूर्वानुमान जाँचें।"
    },
    "regional": {
      "q": "ಇಂದು ರಾತ್ರಿಗೆ ಗಾಳಿಯ ವೇಗದ ಮುನ್ಸೂಚನೆ ಏನು?",
      "a": "ಡೆಮೊ ಮುನ್ಸೂಚನೆಯಲ್ಲಿ ಇಂದು ರಾತ್ರಿ Mangalore ಸಮೀಪ ಗಾಳಿಯ ವೇಗ ಸುಮಾರು 12–18 ಕಿಮೀ/ಗಂ. ಹೊರಡುವ ಮೊದಲು ಇತ್ತೀಚಿನ ಮುನ್ಸೂಚನೆಯನ್ನು ಪರಿಶೀಲಿಸಿ."
    }
  },
  {
    "city": "Mangalore",
    "state": "Karnataka",
    "language": "Kannada",
    "no": "10",
    "intent": "BOAT_SAFETY",
    "english": {
      "q": "Is my motorized boat safe to go out in these conditions?",
      "a": "For the demo vessel profile, the motorized boat is rated Caution under these conditions. The exact result depends on the vessel profile and current inputs."
    },
    "hindi": {
      "q": "क्या इन परिस्थितियों में मेरी मोटर वाली नाव जाना सुरक्षित है?",
      "a": "डेमो नाव प्रोफ़ाइल के लिए इन परिस्थितियों में मोटर वाली नाव की स्थिति सावधानी है। वास्तविक परिणाम नाव की प्रोफ़ाइल और वर्तमान इनपुट पर निर्भर करता है।"
    },
    "regional": {
      "q": "ಈ ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ ನನ್ನ ಮೋಟಾರು ದೋಣಿ ಹೋಗಲು ಸುರಕ್ಷಿತವೇ?",
      "a": "ಡೆಮೊ ದೋಣಿ ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ಈ ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ ಮೋಟಾರ್ ದೋಣಿಯ ಸ್ಥಿತಿ ಎಚ್ಚರಿಕೆ. ನಿಜವಾದ ಫಲಿತಾಂಶ ದೋಣಿ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಪ್ರಸ್ತುತ ಮಾಹಿತಿಯನ್ನು ಅವಲಂಬಿಸುತ್ತದೆ."
    }
  },
  {
    "city": "Mangalore",
    "state": "Karnataka",
    "language": "Kannada",
    "no": "11",
    "intent": "WHY_NOT_RECOMMENDED",
    "english": {
      "q": "Why is fishing not recommended today?",
      "a": "Fishing is not recommended in the demo scenario because the safety checks identify adverse conditions as the dominant risk factor."
    },
    "hindi": {
      "q": "आज मछली पकड़ने की सलाह क्यों नहीं दी जा रही?",
      "a": "डेमो परिदृश्य में मछली पकड़ने की सलाह नहीं दी जा रही है क्योंकि सुरक्षा जाँच में प्रतिकूल परिस्थितियाँ प्रमुख जोखिम कारक पाई गई हैं।"
    },
    "regional": {
      "q": "ಇಂದು ಮೀನುಗಾರಿಕೆಗೆ ಶಿಫಾರಸು ಮಾಡದಿರಲು ಕಾರಣವೇನು?",
      "a": "ಡೆಮೊ ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ ಮೀನುಗಾರಿಕೆಯನ್ನು ಶಿಫಾರಸು ಮಾಡಲಾಗುವುದಿಲ್ಲ, ಏಕೆಂದರೆ ಸುರಕ್ಷತಾ ಪರಿಶೀಲನೆಯಲ್ಲಿ ಪ್ರತಿಕೂಲ ಪರಿಸ್ಥಿತಿಗಳು ಮುಖ್ಯ ಅಪಾಯವಾಗಿ ಕಂಡುಬಂದಿವೆ."
    }
  },
  {
    "city": "Mangalore",
    "state": "Karnataka",
    "language": "Kannada",
    "no": "12",
    "intent": "SAFETY_TOMORROW",
    "english": {
      "q": "What time is safest to go out tomorrow?",
      "a": "The demo recommends the daytime window with the lowest combined risk. Re-check the forecast close to departure rather than relying on this fixed demo answer."
    },
    "hindi": {
      "q": "कल जाने के लिए सबसे सुरक्षित समय कौन सा है?",
      "a": "डेमो में दिन के उस समय की सिफारिश की गई है जिसमें संयुक्त जोखिम सबसे कम है। रवाना होने के समय के करीब पूर्वानुमान दोबारा जाँचें; इस स्थिर डेमो उत्तर पर निर्भर न रहें।"
    },
    "regional": {
      "q": "ನಾಳೆ ಹೋಗಲು ಸುರಕ್ಷಿತ ಸಮಯ ಯಾವುದು?",
      "a": "ಡೆಮೊದಲ್ಲಿ ಒಟ್ಟು ಅಪಾಯ ಕಡಿಮೆ ಇರುವ ಹಗಲಿನ ಸಮಯವನ್ನು ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ. ಹೊರಡುವ ಸಮಯಕ್ಕೆ ಸಮೀಪ ಮುನ್ಸೂಚನೆಯನ್ನು ಮತ್ತೆ ಪರಿಶೀಲಿಸಿ."
    }
  },
  {
    "city": "Mangalore",
    "state": "Karnataka",
    "language": "Kannada",
    "no": "13",
    "intent": "RESTRICTED_ZONE",
    "english": {
      "q": "Are there any restricted zones near Mangalore?",
      "a": "The demo map flags restricted or protected areas near Mangalore. Do not enter a restricted zone; confirm the latest official boundaries."
    },
    "hindi": {
      "q": "क्या मंगलौर के पास कोई प्रतिबंधित क्षेत्र है?",
      "a": "Mangalore के पास डेमो मानचित्र प्रतिबंधित या संरक्षित क्षेत्रों को चिन्हित करता है। प्रतिबंधित क्षेत्र में प्रवेश न करें; नवीनतम आधिकारिक सीमाएँ जाँचें।"
    },
    "regional": {
      "q": "ಮಂಗಳೂರು ಬಳಿ ನಿರ್ಬಂಧಿತ ವಲಯಗಳಿವೆಯೇ?",
      "a": "Mangalore ಸಮೀಪದ ನಿರ್ಬಂಧಿತ ಅಥವಾ ಸಂರಕ್ಷಿತ ಪ್ರದೇಶಗಳನ್ನು ಡೆಮೊ ನಕ್ಷೆ ಗುರುತಿಸುತ್ತದೆ. ಇತ್ತೀಚಿನ ಅಧಿಕೃತ ಗಡಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ."
    }
  },
  {
    "city": "Mangalore",
    "state": "Karnataka",
    "language": "Kannada",
    "no": "14",
    "intent": "CURRENT_COASTAL_CONDITIONS",
    "english": {
      "q": "What's the current near the coast today?",
      "a": "The demo scenario shows a moderate near-shore current near Mangalore. Current conditions can change, so verify the latest marine data."
    },
    "hindi": {
      "q": "आज तट के पास समुद्री धारा कैसी है?",
      "a": "डेमो परिदृश्य में Mangalore के तट के पास समुद्री धारा मध्यम है। समुद्री परिस्थितियाँ बदल सकती हैं, इसलिए नवीनतम डेटा जाँचें।"
    },
    "regional": {
      "q": "ಇಂದು ಕರಾವಳಿ ಬಳಿ ಪ್ರವಾಹ ಹೇಗಿದೆ?",
      "a": "ಡೆಮೊ ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ Mangalore ಕರಾವಳಿಯ ಸಮೀಪ ಸಮುದ್ರದ ಪ್ರವಾಹ ಮಧ್ಯಮವಾಗಿದೆ. ಇತ್ತೀಚಿನ ಸಮುದ್ರ ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ."
    }
  },
  {
    "city": "Mangalore",
    "state": "Karnataka",
    "language": "Kannada",
    "no": "15",
    "intent": "NIGHT_VISIBILITY",
    "english": {
      "q": "Is visibility good enough for night fishing today?",
      "a": "The demo scenario rates visibility as adequate for the selected period, but night fishing should only proceed after checking the latest visibility and weather conditions."
    },
    "hindi": {
      "q": "क्या आज रात मछली पकड़ने के लिए दृश्यता पर्याप्त है?",
      "a": "डेमो परिदृश्य में चुने गए समय के लिए दृश्यता पर्याप्त है, लेकिन रात में मछली पकड़ने से पहले नवीनतम दृश्यता और मौसम की स्थिति जाँचनी चाहिए।"
    },
    "regional": {
      "q": "ಇಂದು ರಾತ್ರಿ ಮೀನುಗಾರಿಕೆಗೆ ಸಾಕಷ್ಟು ಗೋಚರತೆ ಇದೆಯೇ?",
      "a": "ಡೆಮೊ ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ ಆಯ್ಕೆ ಮಾಡಿದ ಸಮಯಕ್ಕೆ ದೃಶ್ಯತೆ ಸಾಕಷ್ಟಿದೆ. ರಾತ್ರಿ ಮೀನುಗಾರಿಕೆಗೆ ಮೊದಲು ಇತ್ತೀಚಿನ ದೃಶ್ಯತೆ ಮತ್ತು ಹವಾಮಾನ ಪರಿಶೀಲಿಸಿ."
    }
  },
  {
    "city": "Mangalore",
    "state": "Karnataka",
    "language": "Kannada",
    "no": "16",
    "intent": "WEEKEND_FISHING",
    "english": {
      "q": "Can I go fishing this weekend?",
      "a": "For the demo weekend forecast, fishing is rated Caution. Re-check the forecast and warnings closer to the actual trip."
    },
    "hindi": {
      "q": "क्या मैं इस सप्ताहांत मछली पकड़ने जा सकता हूँ?",
      "a": "डेमो सप्ताहांत पूर्वानुमान में मछली पकड़ने की स्थिति सावधानी है। वास्तविक यात्रा के करीब पूर्वानुमान और चेतावनियाँ दोबारा जाँचें।"
    },
    "regional": {
      "q": "ಈ ವಾರಾಂತ್ಯದಲ್ಲಿ ನಾನು ಮೀನುಗಾರಿಕೆಗೆ ಹೋಗಬಹುದೇ?",
      "a": "ಡೆಮೊ ವಾರಾಂತ್ಯ ಮುನ್ಸೂಚನೆಯಲ್ಲಿ ಮೀನುಗಾರಿಕೆ ಎಚ್ಚರಿಕೆ ಸ್ಥಿತಿಯಲ್ಲಿದೆ. ನಿಜವಾದ ಪ್ರಯಾಣಕ್ಕೆ ಮುನ್ನ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ."
    }
  },
  {
    "city": "Mangalore",
    "state": "Karnataka",
    "language": "Kannada",
    "no": "17",
    "intent": "BEST_FISHING_ZONE",
    "english": {
      "q": "What is the best fishing zone for my boat type?",
      "a": "The demo ranks the highlighted PFZ as the best candidate for the selected boat type after combining productivity and safety. It is a recommendation, not a guaranteed catch."
    },
    "hindi": {
      "q": "मेरी नाव के प्रकार के लिए सबसे अच्छा मछली पकड़ने का क्षेत्र कौन सा है?",
      "a": "डेमो में चुनी गई नाव के प्रकार के लिए उत्पादकता और सुरक्षा को मिलाकर चिन्हित PFZ को सबसे अच्छा विकल्प माना गया है। यह सिफारिश है, पकड़ की गारंटी नहीं।"
    },
    "regional": {
      "q": "ನನ್ನ ದೋಣಿ ಪ್ರಕಾರಕ್ಕೆ ಉತ್ತಮ ಮೀನುಗಾರಿಕಾ ವಲಯ ಯಾವುದು?",
      "a": "ಸುರಕ್ಷತೆ ಮತ್ತು ಉತ್ಪಾದಕತೆಯನ್ನು ಸೇರಿಸಿ ಆಯ್ಕೆ ಮಾಡಿದ ದೋಣಿ ಪ್ರಕಾರಕ್ಕೆ ಗುರುತಿಸಲಾದ PFZ ಅನ್ನು ಡೆಮೊದಲ್ಲಿ ಉತ್ತಮ ಅಭ್ಯರ್ಥಿಯಾಗಿ ರ್ಯಾಂಕ್ ಮಾಡಲಾಗಿದೆ. ಖಚಿತ ಹಿಡಿತದ ಭರವಸೆ ಅಲ್ಲ."
    }
  },
  {
    "city": "Veraval",
    "state": "Gujarat",
    "language": "Gujarati",
    "no": "1",
    "intent": "SAFETY_TOMORROW",
    "english": {
      "q": "Is it safe to fish near Veraval tomorrow?",
      "a": "Based on the demo forecast for tomorrow, conditions are moderately safe for fishing near Veraval. Check the latest local warning before departure."
    },
    "hindi": {
      "q": "क्या कल वेरावल के पास मछली पकड़ना सुरक्षित है?",
      "a": "डेमो पूर्वानुमान के अनुसार, कल Veraval के पास मछली पकड़ने की परिस्थितियाँ मध्यम रूप से सुरक्षित हैं। रवाना होने से पहले नवीनतम स्थानीय चेतावनी अवश्य जाँचें।"
    },
    "regional": {
      "q": "શું આવતીકાલે વેરાવળ પાસે માછલી પકડવી સુરક્ષિત છે?",
      "a": "ડેમો આગાહી મુજબ, આવતીકાલે Veraval નજીક માછીમારી માટે પરિસ્થિતિ મધ્યમ રીતે સુરક્ષિત છે. નીકળતા પહેલાં નવીનતમ સ્થાનિક ચેતવણી તપાસો."
    }
  },
  {
    "city": "Veraval",
    "state": "Gujarat",
    "language": "Gujarati",
    "no": "2",
    "intent": "NEAREST_PFZ",
    "english": {
      "q": "Where is the nearest Potential Fishing Zone today?",
      "a": "The nearest demo Potential Fishing Zone is shown on the map for Veraval; use the highlighted zone and check its current risk before departure."
    },
    "hindi": {
      "q": "आज सबसे नज़दीकी संभावित मछली पकड़ने का क्षेत्र (PFZ) कहाँ है?",
      "a": "Veraval के लिए निकटतम डेमो संभावित मछली पकड़ने का क्षेत्र मानचित्र पर दिखाया गया है; रवाना होने से पहले चिन्हित क्षेत्र का वर्तमान जोखिम जाँचें।"
    },
    "regional": {
      "q": "આજે સૌથી નજીકનો સંભવિત મત્સ્યક્ષેત્ર (PFZ) ક્યાં છે?",
      "a": "Veraval નજીકનો ડેમો PFZ નકશા પર બતાવવામાં આવ્યો છે. નીકળતા પહેલાં દર્શાવેલા વિસ્તારનું વર્તમાન જોખમ તપાસો."
    }
  },
  {
    "city": "Veraval",
    "state": "Gujarat",
    "language": "Gujarati",
    "no": "3",
    "intent": "WAVE_HEIGHT",
    "english": {
      "q": "What is the wave height near Veraval right now?",
      "a": "In the demo scenario, wave height near Veraval is 1.2–1.8 m. Treat this as demonstration data, not a live observation."
    },
    "hindi": {
      "q": "अभी वेरावल के पास लहरों की ऊँचाई कितनी है?",
      "a": "डेमो परिदृश्य में Veraval के पास लहरों की ऊँचाई 1.2–1.8 मीटर है। इसे केवल प्रदर्शन डेटा मानें, वास्तविक समय का मापन नहीं।"
    },
    "regional": {
      "q": "અત્યારે વેરાવળ પાસે મોજાની ઊંચાઈ કેટલી છે?",
      "a": "ડેમો પરિસ્થિતિમાં Veraval નજીક મોજાંની ઊંચાઈ 1.2–1.8 મીટર છે. આ માત્ર ડેમો ડેટા છે, લાઇવ માપન નથી."
    }
  },
  {
    "city": "Veraval",
    "state": "Gujarat",
    "language": "Gujarati",
    "no": "4",
    "intent": "CYCLONE_ALERT",
    "english": {
      "q": "Are there any cyclone alerts in my area?",
      "a": "No severe cyclone alert is active in the demo scenario for Veraval. Always verify the latest official warning before departure."
    },
    "hindi": {
      "q": "क्या मेरे क्षेत्र में कोई चक्रवात चेतावनी है?",
      "a": "डेमो परिदृश्य में Veraval के लिए कोई गंभीर चक्रवात चेतावनी सक्रिय नहीं है। रवाना होने से पहले नवीनतम आधिकारिक चेतावनी अवश्य जाँचें।"
    },
    "regional": {
      "q": "શું મારા વિસ્તારમાં કોઈ વાવાઝોડાની ચેતવણી છે?",
      "a": "ડેમો પરિસ્થિતિમાં Veraval માટે કોઈ ગંભીર વાવાઝોડાની ચેતવણી સક્રિય નથી. નીકળતા પહેલાં સત્તાવાર ચેતવણી તપાસો."
    }
  },
  {
    "city": "Veraval",
    "state": "Gujarat",
    "language": "Gujarati",
    "no": "5",
    "intent": "MULTI_DAY_TRIP",
    "english": {
      "q": "Is it safe for a 3-day trip starting tomorrow?",
      "a": "For the demo 3-day trip, Day 1 is Safe, Day 2 is Safe, and Day 3 is Caution. The overall trip status is Caution because the worst day governs."
    },
    "hindi": {
      "q": "क्या कल से शुरू होने वाली 3-दिन की यात्रा सुरक्षित है?",
      "a": "डेमो 3-दिन की यात्रा में दिन 1 सुरक्षित, दिन 2 सुरक्षित और दिन 3 सावधानी है। पूरी यात्रा की स्थिति सावधानी है क्योंकि सबसे जोखिम वाले दिन के आधार पर निर्णय होता है।"
    },
    "regional": {
      "q": "આવતીકાલથી શરૂ થતી 3-દિવસની સફર સુરક્ષિત છે?",
      "a": "ડેમો 3-દિવસની સફરમાં દિવસ 1 સુરક્ષિત, દિવસ 2 સુરક્ષિત અને દિવસ 3 સાવચેતી છે. સૌથી જોખમી દિવસના આધારે કુલ સ્થિતિ સાવચેતી છે."
    }
  },
  {
    "city": "Veraval",
    "state": "Gujarat",
    "language": "Gujarati",
    "no": "6",
    "intent": "SAFE_ROUTE",
    "english": {
      "q": "What's the safest route from Veraval harbor to the nearest fishing zone?",
      "a": "The demo route from Veraval harbor to the nearest fishing zone avoids the highlighted hazard areas and follows the lowest-risk path shown on the map."
    },
    "hindi": {
      "q": "वेरावल बंदरगाह से नज़दीकी मछली पकड़ने के क्षेत्र तक सबसे सुरक्षित रास्ता कौन सा है?",
      "a": "डेमो मार्ग Veraval बंदरगाह से निकटतम मछली पकड़ने के क्षेत्र तक चिन्हित जोखिम वाले क्षेत्रों से बचता है और मानचित्र पर दिखाए गए कम-जोखिम वाले रास्ते का अनुसरण करता है।"
    },
    "regional": {
      "q": "વેરાવળ બંદરથી નજીકના મત્સ્યક્ષેત્ર સુધીનો સૌથી સુરક્ષિત માર્ગ કયો છે?",
      "a": "ડેમો માર્ગ Veraval બંદરથી નજીકના માછીમારી ક્ષેત્ર સુધી જોખમી વિસ્તારો ટાળીને નકશામાં દર્શાવેલો ઓછા-જોખમનો માર્ગ અનુસરે છે."
    }
  },
  {
    "city": "Veraval",
    "state": "Gujarat",
    "language": "Gujarati",
    "no": "7",
    "intent": "CHLOROPHYLL_ZONE",
    "english": {
      "q": "Which regions show high chlorophyll concentration nearby?",
      "a": "The demo map highlights the nearby areas with higher chlorophyll concentration; these are candidate productivity zones, not a guaranteed catch."
    },
    "hindi": {
      "q": "आस-पास किन क्षेत्रों में क्लोरोफिल का स्तर अधिक है?",
      "a": "डेमो मानचित्र में अधिक क्लोरोफिल वाले आसपास के क्षेत्र चिन्हित हैं; ये संभावित उत्पादक क्षेत्र हैं, निश्चित पकड़ की गारंटी नहीं।"
    },
    "regional": {
      "q": "નજીકમાં કયા વિસ્તારોમાં ક્લોરોફિલનું પ્રમાણ વધુ છે?",
      "a": "ડેમો નકશામાં વધુ ક્લોરોફિલ ધરાવતા નજીકના વિસ્તારો દર્શાવ્યા છે. આ સંભવિત ઉત્પાદક વિસ્તારો છે, પકડની ગેરંટી નથી."
    }
  },
  {
    "city": "Veraval",
    "state": "Gujarat",
    "language": "Gujarati",
    "no": "8",
    "intent": "AVOID_ZONE",
    "english": {
      "q": "Should I avoid any zones today due to bad weather?",
      "a": "Yes. In the demo scenario, the system recommends avoiding the highlighted high-risk zones today because of adverse conditions."
    },
    "hindi": {
      "q": "क्या आज खराब मौसम के कारण मुझे किसी क्षेत्र से बचना चाहिए?",
      "a": "हाँ। डेमो परिदृश्य में प्रतिकूल परिस्थितियों के कारण सिस्टम आज चिन्हित उच्च-जोखिम वाले क्षेत्रों से बचने की सलाह देता है।"
    },
    "regional": {
      "q": "શું આજે ખરાબ હવામાનને કારણે કોઈ ઝોન ટાળવો જોઈએ?",
      "a": "હા. ડેમો પરિસ્થિતિમાં પ્રતિકૂળ પરિસ્થિતિને કારણે દર્શાવેલા ઊંચા જોખમવાળા વિસ્તારો આજે ટાળવાની ભલામણ છે."
    }
  },
  {
    "city": "Veraval",
    "state": "Gujarat",
    "language": "Gujarati",
    "no": "9",
    "intent": "WIND_FORECAST",
    "english": {
      "q": "What is the wind speed forecast for tonight?",
      "a": "The demo forecast for tonight shows wind around 12–18 km/h near Veraval. Verify the latest forecast before going out."
    },
    "hindi": {
      "q": "आज रात के लिए हवा की गति का पूर्वानुमान क्या है?",
      "a": "डेमो पूर्वानुमान में आज रात Veraval के पास हवा की गति लगभग 12–18 किमी/घंटा है। बाहर जाने से पहले नवीनतम पूर्वानुमान जाँचें।"
    },
    "regional": {
      "q": "આજે રાત માટે પવનની ઝડપની આગાહી શું છે?",
      "a": "ડેમો આગાહીમાં આજે રાત્રે Veraval નજીક પવનની ઝડપ આશરે 12–18 કિમી/કલાક છે. બહાર જતાં પહેલાં નવીનતમ આગાહી તપાસો."
    }
  },
  {
    "city": "Veraval",
    "state": "Gujarat",
    "language": "Gujarati",
    "no": "10",
    "intent": "BOAT_SAFETY",
    "english": {
      "q": "Is my motorized boat safe to go out in these conditions?",
      "a": "For the demo vessel profile, the motorized boat is rated Caution under these conditions. The exact result depends on the vessel profile and current inputs."
    },
    "hindi": {
      "q": "क्या इन परिस्थितियों में मेरी मोटर वाली नाव जाना सुरक्षित है?",
      "a": "डेमो नाव प्रोफ़ाइल के लिए इन परिस्थितियों में मोटर वाली नाव की स्थिति सावधानी है। वास्तविक परिणाम नाव की प्रोफ़ाइल और वर्तमान इनपुट पर निर्भर करता है।"
    },
    "regional": {
      "q": "આ પરિસ્થિતિમાં મારી મોટરવાળી હોડી જવી સુરક્ષિત છે?",
      "a": "ડેમો બોટ પ્રોફાઇલમાં આ પરિસ્થિતિમાં મોટર બોટની સ્થિતિ સાવચેતી છે. વાસ્તવિક પરિણામ બોટ પ્રોફાઇલ અને વર્તમાન ડેટા પર આધારિત રહેશે."
    }
  },
  {
    "city": "Veraval",
    "state": "Gujarat",
    "language": "Gujarati",
    "no": "11",
    "intent": "WHY_NOT_RECOMMENDED",
    "english": {
      "q": "Why is fishing not recommended today?",
      "a": "Fishing is not recommended in the demo scenario because the safety checks identify adverse conditions as the dominant risk factor."
    },
    "hindi": {
      "q": "आज मछली पकड़ने की सलाह क्यों नहीं दी जा रही?",
      "a": "डेमो परिदृश्य में मछली पकड़ने की सलाह नहीं दी जा रही है क्योंकि सुरक्षा जाँच में प्रतिकूल परिस्थितियाँ प्रमुख जोखिम कारक पाई गई हैं।"
    },
    "regional": {
      "q": "આજે માછીમારીની ભલામણ કેમ નથી?",
      "a": "ડેમો પરિસ્થિતિમાં માછીમારીની ભલામણ નથી, કારણ કે સલામતી તપાસમાં પ્રતિકૂળ પરિસ્થિતિ મુખ્ય જોખમ તરીકે મળી છે."
    }
  },
  {
    "city": "Veraval",
    "state": "Gujarat",
    "language": "Gujarati",
    "no": "12",
    "intent": "SAFETY_TOMORROW",
    "english": {
      "q": "What time is safest to go out tomorrow?",
      "a": "The demo recommends the daytime window with the lowest combined risk. Re-check the forecast close to departure rather than relying on this fixed demo answer."
    },
    "hindi": {
      "q": "कल जाने के लिए सबसे सुरक्षित समय कौन सा है?",
      "a": "डेमो में दिन के उस समय की सिफारिश की गई है जिसमें संयुक्त जोखिम सबसे कम है। रवाना होने के समय के करीब पूर्वानुमान दोबारा जाँचें; इस स्थिर डेमो उत्तर पर निर्भर न रहें।"
    },
    "regional": {
      "q": "આવતીકાલે જવા માટે સૌથી સુરક્ષિત સમય કયો છે?",
      "a": "ડેમોમાં સંયુક્ત જોખમ સૌથી ઓછું હોય તેવો દિવસનો સમય ભલામણ કરવામાં આવ્યો છે. નીકળવાના સમય નજીક આગાહી ફરી તપાસો."
    }
  },
  {
    "city": "Veraval",
    "state": "Gujarat",
    "language": "Gujarati",
    "no": "13",
    "intent": "RESTRICTED_ZONE",
    "english": {
      "q": "Are there any restricted zones near Veraval?",
      "a": "The demo map flags restricted or protected areas near Veraval. Do not enter a restricted zone; confirm the latest official boundaries."
    },
    "hindi": {
      "q": "क्या वेरावल के पास कोई प्रतिबंधित क्षेत्र है?",
      "a": "Veraval के पास डेमो मानचित्र प्रतिबंधित या संरक्षित क्षेत्रों को चिन्हित करता है। प्रतिबंधित क्षेत्र में प्रवेश न करें; नवीनतम आधिकारिक सीमाएँ जाँचें।"
    },
    "regional": {
      "q": "શું વેરાવળ પાસે કોઈ પ્રતિબંધિત ઝોન છે?",
      "a": "Veraval નજીકના પ્રતિબંધિત અથવા સંરક્ષિત વિસ્તારો ડેમો નકશામાં દર્શાવવામાં આવ્યા છે. નવીનતમ સત્તાવાર સીમાઓ તપાસો."
    }
  },
  {
    "city": "Veraval",
    "state": "Gujarat",
    "language": "Gujarati",
    "no": "14",
    "intent": "CURRENT_COASTAL_CONDITIONS",
    "english": {
      "q": "What's the current near the coast today?",
      "a": "The demo scenario shows a moderate near-shore current near Veraval. Current conditions can change, so verify the latest marine data."
    },
    "hindi": {
      "q": "आज तट के पास समुद्री धारा कैसी है?",
      "a": "डेमो परिदृश्य में Veraval के तट के पास समुद्री धारा मध्यम है। समुद्री परिस्थितियाँ बदल सकती हैं, इसलिए नवीनतम डेटा जाँचें।"
    },
    "regional": {
      "q": "આજે કિનારા પાસે પ્રવાહ કેવો છે?",
      "a": "ડેમો પરિસ્થિતિમાં Veravalના કિનારા નજીક સમુદ્રી પ્રવાહ મધ્યમ છે. નવીનતમ સમુદ્રી ડેટા તપાસો."
    }
  },
  {
    "city": "Veraval",
    "state": "Gujarat",
    "language": "Gujarati",
    "no": "15",
    "intent": "NIGHT_VISIBILITY",
    "english": {
      "q": "Is visibility good enough for night fishing today?",
      "a": "The demo scenario rates visibility as adequate for the selected period, but night fishing should only proceed after checking the latest visibility and weather conditions."
    },
    "hindi": {
      "q": "क्या आज रात मछली पकड़ने के लिए दृश्यता पर्याप्त है?",
      "a": "डेमो परिदृश्य में चुने गए समय के लिए दृश्यता पर्याप्त है, लेकिन रात में मछली पकड़ने से पहले नवीनतम दृश्यता और मौसम की स्थिति जाँचनी चाहिए।"
    },
    "regional": {
      "q": "શું આજે રાત્રે માછીમારી માટે પૂરતી દૃશ્યતા છે?",
      "a": "ડેમો પરિસ્થિતિમાં પસંદ કરેલા સમય માટે દૃશ્યતા પૂરતી છે. રાત્રે માછીમારી પહેલાં નવીનતમ દૃશ્યતા અને હવામાન તપાસો."
    }
  },
  {
    "city": "Veraval",
    "state": "Gujarat",
    "language": "Gujarati",
    "no": "16",
    "intent": "WEEKEND_FISHING",
    "english": {
      "q": "Can I go fishing this weekend?",
      "a": "For the demo weekend forecast, fishing is rated Caution. Re-check the forecast and warnings closer to the actual trip."
    },
    "hindi": {
      "q": "क्या मैं इस सप्ताहांत मछली पकड़ने जा सकता हूँ?",
      "a": "डेमो सप्ताहांत पूर्वानुमान में मछली पकड़ने की स्थिति सावधानी है। वास्तविक यात्रा के करीब पूर्वानुमान और चेतावनियाँ दोबारा जाँचें।"
    },
    "regional": {
      "q": "શું હું આ સપ્તાહાંતે માછીમારી કરવા જઈ શકું?",
      "a": "ડેમો સપ્તાહાંત આગાહીમાં માછીમારી માટે સાવચેતી સ્થિતિ છે. વાસ્તવિક સફર પહેલાં આગાહી અને ચેતવણીઓ ફરી તપાસો."
    }
  },
  {
    "city": "Veraval",
    "state": "Gujarat",
    "language": "Gujarati",
    "no": "17",
    "intent": "BEST_FISHING_ZONE",
    "english": {
      "q": "What is the best fishing zone for my boat type?",
      "a": "The demo ranks the highlighted PFZ as the best candidate for the selected boat type after combining productivity and safety. It is a recommendation, not a guaranteed catch."
    },
    "hindi": {
      "q": "मेरी नाव के प्रकार के लिए सबसे अच्छा मछली पकड़ने का क्षेत्र कौन सा है?",
      "a": "डेमो में चुनी गई नाव के प्रकार के लिए उत्पादकता और सुरक्षा को मिलाकर चिन्हित PFZ को सबसे अच्छा विकल्प माना गया है। यह सिफारिश है, पकड़ की गारंटी नहीं।"
    },
    "regional": {
      "q": "મારી હોડીના પ્રકાર માટે શ્રેષ્ઠ મત્સ્યક્ષેત્ર કયો છે?",
      "a": "સલામતી અને ઉત્પાદકતા જોડીને પસંદ કરેલા બોટ પ્રકાર માટે દર્શાવેલ PFZને ડેમોમાં શ્રેષ્ઠ ઉમેદવાર તરીકે રેન્ક કરવામાં આવ્યો છે. પકડની ગેરંટી નથી."
    }
  },
  {
    "city": "Chennai",
    "state": "Tamil Nadu",
    "language": "Tamil",
    "no": "1",
    "intent": "SAFETY_TOMORROW",
    "english": {
      "q": "Is it safe to fish near Chennai tomorrow?",
      "a": "Based on the demo forecast for tomorrow, conditions are moderately safe for fishing near Chennai. Check the latest local warning before departure."
    },
    "hindi": {
      "q": "क्या कल चेन्नई के पास मछली पकड़ना सुरक्षित है?",
      "a": "डेमो पूर्वानुमान के अनुसार, कल Chennai के पास मछली पकड़ने की परिस्थितियाँ मध्यम रूप से सुरक्षित हैं। रवाना होने से पहले नवीनतम स्थानीय चेतावनी अवश्य जाँचें।"
    },
    "regional": {
      "q": "நாளை சென்னைக்கு அருகில் மீன்பிடிப்பது பாதுகாப்பானதா?",
      "a": "டெமோ முன்னறிவிப்பின்படி, நாளை Chennai அருகே மீன்பிடிக்க நிலைமைகள் மிதமான பாதுகாப்புடன் உள்ளன. புறப்படுவதற்கு முன் சமீபத்திய உள்ளூர் எச்சரிக்கையைச் சரிபார்க்கவும்."
    }
  },
  {
    "city": "Chennai",
    "state": "Tamil Nadu",
    "language": "Tamil",
    "no": "2",
    "intent": "NEAREST_PFZ",
    "english": {
      "q": "Where is the nearest Potential Fishing Zone today?",
      "a": "The nearest demo Potential Fishing Zone is shown on the map for Chennai; use the highlighted zone and check its current risk before departure."
    },
    "hindi": {
      "q": "आज सबसे नज़दीकी संभावित मछली पकड़ने का क्षेत्र (PFZ) कहाँ है?",
      "a": "Chennai के लिए निकटतम डेमो संभावित मछली पकड़ने का क्षेत्र मानचित्र पर दिखाया गया है; रवाना होने से पहले चिन्हित क्षेत्र का वर्तमान जोखिम जाँचें।"
    },
    "regional": {
      "q": "இன்று அருகிலுள்ள சாத்தியமான மீன்பிடி மண்டலம் (PFZ) எங்கே உள்ளது?",
      "a": "Chennai அருகிலுள்ள டெமோ PFZ வரைபடத்தில் காட்டப்பட்டுள்ளது. புறப்படுவதற்கு முன் குறிக்கப்பட்ட பகுதியின் தற்போதைய அபாயத்தைச் சரிபார்க்கவும்."
    }
  },
  {
    "city": "Chennai",
    "state": "Tamil Nadu",
    "language": "Tamil",
    "no": "3",
    "intent": "WAVE_HEIGHT",
    "english": {
      "q": "What is the wave height near Chennai right now?",
      "a": "In the demo scenario, wave height near Chennai is 1.2–1.8 m. Treat this as demonstration data, not a live observation."
    },
    "hindi": {
      "q": "अभी चेन्नई के पास लहरों की ऊँचाई कितनी है?",
      "a": "डेमो परिदृश्य में Chennai के पास लहरों की ऊँचाई 1.2–1.8 मीटर है। इसे केवल प्रदर्शन डेटा मानें, वास्तविक समय का मापन नहीं।"
    },
    "regional": {
      "q": "இப்போது சென்னைக்கு அருகில் அலை உயரம் எவ்வளவு?",
      "a": "டெமோ சூழலில் Chennai அருகே அலை உயரம் 1.2–1.8 மீட்டர். இது டெமோ தரவு மட்டுமே; நேரடி அளவீடு அல்ல."
    }
  },
  {
    "city": "Chennai",
    "state": "Tamil Nadu",
    "language": "Tamil",
    "no": "4",
    "intent": "CYCLONE_ALERT",
    "english": {
      "q": "Are there any cyclone alerts in my area?",
      "a": "No severe cyclone alert is active in the demo scenario for Chennai. Always verify the latest official warning before departure."
    },
    "hindi": {
      "q": "क्या मेरे क्षेत्र में कोई चक्रवात चेतावनी है?",
      "a": "डेमो परिदृश्य में Chennai के लिए कोई गंभीर चक्रवात चेतावनी सक्रिय नहीं है। रवाना होने से पहले नवीनतम आधिकारिक चेतावनी अवश्य जाँचें।"
    },
    "regional": {
      "q": "எனது பகுதியில் புயல் எச்சரிக்கை உள்ளதா?",
      "a": "டெமோ சூழலில் Chennaiக்கு தீவிர புயல் எச்சரிக்கை செயல்பாட்டில் இல்லை. புறப்படுவதற்கு முன் அதிகாரப்பூர்வ எச்சரிக்கையைச் சரிபார்க்கவும்."
    }
  },
  {
    "city": "Chennai",
    "state": "Tamil Nadu",
    "language": "Tamil",
    "no": "5",
    "intent": "MULTI_DAY_TRIP",
    "english": {
      "q": "Is it safe for a 3-day trip starting tomorrow?",
      "a": "For the demo 3-day trip, Day 1 is Safe, Day 2 is Safe, and Day 3 is Caution. The overall trip status is Caution because the worst day governs."
    },
    "hindi": {
      "q": "क्या कल से शुरू होने वाली 3-दिन की यात्रा सुरक्षित है?",
      "a": "डेमो 3-दिन की यात्रा में दिन 1 सुरक्षित, दिन 2 सुरक्षित और दिन 3 सावधानी है। पूरी यात्रा की स्थिति सावधानी है क्योंकि सबसे जोखिम वाले दिन के आधार पर निर्णय होता है।"
    },
    "regional": {
      "q": "நாளை தொடங்கும் 3-நாள் பயணம் பாதுகாப்பானதா?",
      "a": "டெமோ 3 நாள் பயணத்தில் நாள் 1 பாதுகாப்பானது, நாள் 2 பாதுகாப்பானது, நாள் 3 எச்சரிக்கை. அதிக அபாயமுள்ள நாளின் அடிப்படையில் மொத்த நிலை எச்சரிக்கை."
    }
  },
  {
    "city": "Chennai",
    "state": "Tamil Nadu",
    "language": "Tamil",
    "no": "6",
    "intent": "SAFE_ROUTE",
    "english": {
      "q": "What's the safest route from Chennai harbor to the nearest fishing zone?",
      "a": "The demo route from Chennai harbor to the nearest fishing zone avoids the highlighted hazard areas and follows the lowest-risk path shown on the map."
    },
    "hindi": {
      "q": "चेन्नई बंदरगाह से नज़दीकी मछली पकड़ने के क्षेत्र तक सबसे सुरक्षित रास्ता कौन सा है?",
      "a": "डेमो मार्ग Chennai बंदरगाह से निकटतम मछली पकड़ने के क्षेत्र तक चिन्हित जोखिम वाले क्षेत्रों से बचता है और मानचित्र पर दिखाए गए कम-जोखिम वाले रास्ते का अनुसरण करता है।"
    },
    "regional": {
      "q": "சென்னை துறைமுகத்திலிருந்து அருகிலுள்ள மீன்பிடி மண்டலத்திற்கு பாதுகாப்பான பாதை எது?",
      "a": "டெமோ பாதை Chennai துறைமுகத்திலிருந்து அருகிலுள்ள மீன்பிடி மண்டலத்துக்கு அதிக அபாயப் பகுதிகளைத் தவிர்த்து, வரைபடத்தில் காட்டப்பட்ட குறைந்த அபாயப் பாதையைப் பின்பற்றுகிறது."
    }
  },
  {
    "city": "Chennai",
    "state": "Tamil Nadu",
    "language": "Tamil",
    "no": "7",
    "intent": "CHLOROPHYLL_ZONE",
    "english": {
      "q": "Which regions show high chlorophyll concentration nearby?",
      "a": "The demo map highlights the nearby areas with higher chlorophyll concentration; these are candidate productivity zones, not a guaranteed catch."
    },
    "hindi": {
      "q": "आस-पास किन क्षेत्रों में क्लोरोफिल का स्तर अधिक है?",
      "a": "डेमो मानचित्र में अधिक क्लोरोफिल वाले आसपास के क्षेत्र चिन्हित हैं; ये संभावित उत्पादक क्षेत्र हैं, निश्चित पकड़ की गारंटी नहीं।"
    },
    "regional": {
      "q": "அருகில் எந்த பகுதிகளில் குளோரோபில் அளவு அதிகமாக உள்ளது?",
      "a": "டெமோ வரைபடத்தில் அதிக குளோரோஃபில் உள்ள அருகிலுள்ள பகுதிகள் குறிக்கப்பட்டுள்ளன. இவை சாத்தியமான உற்பத்திப் பகுதிகள்; பிடிப்பு உறுதி அல்ல."
    }
  },
  {
    "city": "Chennai",
    "state": "Tamil Nadu",
    "language": "Tamil",
    "no": "8",
    "intent": "AVOID_ZONE",
    "english": {
      "q": "Should I avoid any zones today due to bad weather?",
      "a": "Yes. In the demo scenario, the system recommends avoiding the highlighted high-risk zones today because of adverse conditions."
    },
    "hindi": {
      "q": "क्या आज खराब मौसम के कारण मुझे किसी क्षेत्र से बचना चाहिए?",
      "a": "हाँ। डेमो परिदृश्य में प्रतिकूल परिस्थितियों के कारण सिस्टम आज चिन्हित उच्च-जोखिम वाले क्षेत्रों से बचने की सलाह देता है।"
    },
    "regional": {
      "q": "இன்று மோசமான வானிலை காரணமாக எந்த மண்டலத்தையும் தவிர்க்க வேண்டுமா?",
      "a": "ஆம். டெமோ சூழலில் மோசமான நிலைமைகள் காரணமாக குறிக்கப்பட்ட அதிக அபாயப் பகுதிகளை இன்று தவிர்க்க அமைப்பு பரிந்துரைக்கிறது."
    }
  },
  {
    "city": "Chennai",
    "state": "Tamil Nadu",
    "language": "Tamil",
    "no": "9",
    "intent": "WIND_FORECAST",
    "english": {
      "q": "What is the wind speed forecast for tonight?",
      "a": "The demo forecast for tonight shows wind around 12–18 km/h near Chennai. Verify the latest forecast before going out."
    },
    "hindi": {
      "q": "आज रात के लिए हवा की गति का पूर्वानुमान क्या है?",
      "a": "डेमो पूर्वानुमान में आज रात Chennai के पास हवा की गति लगभग 12–18 किमी/घंटा है। बाहर जाने से पहले नवीनतम पूर्वानुमान जाँचें।"
    },
    "regional": {
      "q": "இன்றிரவுக்கான காற்றின் வேக முன்னறிவிப்பு என்ன?",
      "a": "டெமோ முன்னறிவிப்பில் இன்று இரவு Chennai அருகே காற்றின் வேகம் சுமார் 12–18 கிமீ/மணி. புறப்படுவதற்கு முன் சமீபத்திய முன்னறிவிப்பைச் சரிபார்க்கவும்."
    }
  },
  {
    "city": "Chennai",
    "state": "Tamil Nadu",
    "language": "Tamil",
    "no": "10",
    "intent": "BOAT_SAFETY",
    "english": {
      "q": "Is my motorized boat safe to go out in these conditions?",
      "a": "For the demo vessel profile, the motorized boat is rated Caution under these conditions. The exact result depends on the vessel profile and current inputs."
    },
    "hindi": {
      "q": "क्या इन परिस्थितियों में मेरी मोटर वाली नाव जाना सुरक्षित है?",
      "a": "डेमो नाव प्रोफ़ाइल के लिए इन परिस्थितियों में मोटर वाली नाव की स्थिति सावधानी है। वास्तविक परिणाम नाव की प्रोफ़ाइल और वर्तमान इनपुट पर निर्भर करता है।"
    },
    "regional": {
      "q": "இந்த சூழலில் எனது மோட்டார் படகு செல்வது பாதுகாப்பானதா?",
      "a": "டெமோ படகு சுயவிவரத்தில் இந்த நிலைமைகளில் மோட்டார் படகின் நிலை எச்சரிக்கை. உண்மையான முடிவு படகு சுயவிவரம் மற்றும் தற்போதைய தரவைப் பொறுத்தது."
    }
  },
  {
    "city": "Chennai",
    "state": "Tamil Nadu",
    "language": "Tamil",
    "no": "11",
    "intent": "WHY_NOT_RECOMMENDED",
    "english": {
      "q": "Why is fishing not recommended today?",
      "a": "Fishing is not recommended in the demo scenario because the safety checks identify adverse conditions as the dominant risk factor."
    },
    "hindi": {
      "q": "आज मछली पकड़ने की सलाह क्यों नहीं दी जा रही?",
      "a": "डेमो परिदृश्य में मछली पकड़ने की सलाह नहीं दी जा रही है क्योंकि सुरक्षा जाँच में प्रतिकूल परिस्थितियाँ प्रमुख जोखिम कारक पाई गई हैं।"
    },
    "regional": {
      "q": "இன்று மீன்பிடிக்க பரிந்துரைக்கப்படாதது ஏன்?",
      "a": "டெமோ சூழலில் மீன்பிடிக்க பரிந்துரைக்கப்படவில்லை, ஏனெனில் பாதுகாப்புச் சோதனையில் மோசமான நிலைமைகள் முக்கிய அபாயமாக கண்டறியப்பட்டுள்ளன."
    }
  },
  {
    "city": "Chennai",
    "state": "Tamil Nadu",
    "language": "Tamil",
    "no": "12",
    "intent": "SAFETY_TOMORROW",
    "english": {
      "q": "What time is safest to go out tomorrow?",
      "a": "The demo recommends the daytime window with the lowest combined risk. Re-check the forecast close to departure rather than relying on this fixed demo answer."
    },
    "hindi": {
      "q": "कल जाने के लिए सबसे सुरक्षित समय कौन सा है?",
      "a": "डेमो में दिन के उस समय की सिफारिश की गई है जिसमें संयुक्त जोखिम सबसे कम है। रवाना होने के समय के करीब पूर्वानुमान दोबारा जाँचें; इस स्थिर डेमो उत्तर पर निर्भर न रहें।"
    },
    "regional": {
      "q": "நாளை செல்ல மிகவும் பாதுகாப்பான நேரம் எது?",
      "a": "டெமோவில் ஒருங்கிணைந்த அபாயம் குறைவாக உள்ள பகல் நேரம் பரிந்துரைக்கப்படுகிறது. புறப்படும் நேரத்திற்கு அருகில் முன்னறிவிப்பை மீண்டும் சரிபார்க்கவும்."
    }
  },
  {
    "city": "Chennai",
    "state": "Tamil Nadu",
    "language": "Tamil",
    "no": "13",
    "intent": "RESTRICTED_ZONE",
    "english": {
      "q": "Are there any restricted zones near Chennai?",
      "a": "The demo map flags restricted or protected areas near Chennai. Do not enter a restricted zone; confirm the latest official boundaries."
    },
    "hindi": {
      "q": "क्या चेन्नई के पास कोई प्रतिबंधित क्षेत्र है?",
      "a": "Chennai के पास डेमो मानचित्र प्रतिबंधित या संरक्षित क्षेत्रों को चिन्हित करता है। प्रतिबंधित क्षेत्र में प्रवेश न करें; नवीनतम आधिकारिक सीमाएँ जाँचें।"
    },
    "regional": {
      "q": "சென்னைக்கு அருகில் தடைசெய்யப்பட்ட மண்டலங்கள் உள்ளதா?",
      "a": "Chennai அருகிலுள்ள கட்டுப்படுத்தப்பட்ட அல்லது பாதுகாக்கப்பட்ட பகுதிகளை டெமோ வரைபடம் காட்டுகிறது. சமீபத்திய அதிகாரப்பூர்வ எல்லைகளைச் சரிபார்க்கவும்."
    }
  },
  {
    "city": "Chennai",
    "state": "Tamil Nadu",
    "language": "Tamil",
    "no": "14",
    "intent": "CURRENT_COASTAL_CONDITIONS",
    "english": {
      "q": "What's the current near the coast today?",
      "a": "The demo scenario shows a moderate near-shore current near Chennai. Current conditions can change, so verify the latest marine data."
    },
    "hindi": {
      "q": "आज तट के पास समुद्री धारा कैसी है?",
      "a": "डेमो परिदृश्य में Chennai के तट के पास समुद्री धारा मध्यम है। समुद्री परिस्थितियाँ बदल सकती हैं, इसलिए नवीनतम डेटा जाँचें।"
    },
    "regional": {
      "q": "இன்று கடற்கரைக்கு அருகில் நீரோட்டம் எப்படி உள்ளது?",
      "a": "டெமோ சூழலில் Chennai கடற்கரைக்கு அருகிலுள்ள கடல் நீரோட்டம் மிதமாக உள்ளது. சமீபத்திய கடல் தரவைச் சரிபார்க்கவும்."
    }
  },
  {
    "city": "Chennai",
    "state": "Tamil Nadu",
    "language": "Tamil",
    "no": "15",
    "intent": "NIGHT_VISIBILITY",
    "english": {
      "q": "Is visibility good enough for night fishing today?",
      "a": "The demo scenario rates visibility as adequate for the selected period, but night fishing should only proceed after checking the latest visibility and weather conditions."
    },
    "hindi": {
      "q": "क्या आज रात मछली पकड़ने के लिए दृश्यता पर्याप्त है?",
      "a": "डेमो परिदृश्य में चुने गए समय के लिए दृश्यता पर्याप्त है, लेकिन रात में मछली पकड़ने से पहले नवीनतम दृश्यता और मौसम की स्थिति जाँचनी चाहिए।"
    },
    "regional": {
      "q": "இன்றிரவு மீன்பிடிக்க போதுமான தெரிவுநிலை உள்ளதா?",
      "a": "டெமோ சூழலில் தேர்ந்தெடுத்த நேரத்திற்கு தெரிவுநிலை போதுமானது. இரவு மீன்பிடிக்கு முன் சமீபத்திய தெரிவுநிலை மற்றும் வானிலையைச் சரிபார்க்கவும்."
    }
  },
  {
    "city": "Chennai",
    "state": "Tamil Nadu",
    "language": "Tamil",
    "no": "16",
    "intent": "WEEKEND_FISHING",
    "english": {
      "q": "Can I go fishing this weekend?",
      "a": "For the demo weekend forecast, fishing is rated Caution. Re-check the forecast and warnings closer to the actual trip."
    },
    "hindi": {
      "q": "क्या मैं इस सप्ताहांत मछली पकड़ने जा सकता हूँ?",
      "a": "डेमो सप्ताहांत पूर्वानुमान में मछली पकड़ने की स्थिति सावधानी है। वास्तविक यात्रा के करीब पूर्वानुमान और चेतावनियाँ दोबारा जाँचें।"
    },
    "regional": {
      "q": "இந்த வார இறுதியில் நான் மீன்பிடிக்க செல்லலாமா?",
      "a": "டெமோ வார இறுதி முன்னறிவிப்பில் மீன்பிடி எச்சரிக்கை நிலையில் உள்ளது. உண்மையான பயணத்திற்கு முன் முன்னறிவிப்பு மற்றும் எச்சரிக்கைகளை மீண்டும் சரிபார்க்கவும்."
    }
  },
  {
    "city": "Chennai",
    "state": "Tamil Nadu",
    "language": "Tamil",
    "no": "17",
    "intent": "BEST_FISHING_ZONE",
    "english": {
      "q": "What is the best fishing zone for my boat type?",
      "a": "The demo ranks the highlighted PFZ as the best candidate for the selected boat type after combining productivity and safety. It is a recommendation, not a guaranteed catch."
    },
    "hindi": {
      "q": "मेरी नाव के प्रकार के लिए सबसे अच्छा मछली पकड़ने का क्षेत्र कौन सा है?",
      "a": "डेमो में चुनी गई नाव के प्रकार के लिए उत्पादकता और सुरक्षा को मिलाकर चिन्हित PFZ को सबसे अच्छा विकल्प माना गया है। यह सिफारिश है, पकड़ की गारंटी नहीं।"
    },
    "regional": {
      "q": "எனது படகு வகைக்கு சிறந்த மீன்பிடி மண்டலம் எது?",
      "a": "பாதுகாப்பு மற்றும் உற்பத்தித்திறனை இணைத்து, தேர்ந்தெடுக்கப்பட்ட படகு வகைக்கு குறிக்கப்பட்ட PFZ டெமோவில் சிறந்த வாய்ப்பாக தரவரிசைப்படுத்தப்பட்டுள்ளது. பிடிப்பு உறுதி அல்ல."
    }
  },
  {
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "language": "Telugu",
    "no": "1",
    "intent": "SAFETY_TOMORROW",
    "english": {
      "q": "Is it safe to fish near Visakhapatnam tomorrow?",
      "a": "Based on the demo forecast for tomorrow, conditions are moderately safe for fishing near Visakhapatnam. Check the latest local warning before departure."
    },
    "hindi": {
      "q": "क्या कल विशाखापत्तनम के पास मछली पकड़ना सुरक्षित है?",
      "a": "डेमो पूर्वानुमान के अनुसार, कल Visakhapatnam के पास मछली पकड़ने की परिस्थितियाँ मध्यम रूप से सुरक्षित हैं। रवाना होने से पहले नवीनतम स्थानीय चेतावनी अवश्य जाँचें।"
    },
    "regional": {
      "q": "రేపు విశాఖపట్నం దగ్గర చేపలు పట్టడం సురక్షితమేనా?",
      "a": "డెమో అంచనా ప్రకారం, రేపు Visakhapatnam సమీపంలో చేపలు పట్టడానికి పరిస్థితులు మితమైన భద్రతతో ఉన్నాయి. బయలుదేరే ముందు తాజా స్థానిక హెచ్చరికను తనిఖీ చేయండి."
    }
  },
  {
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "language": "Telugu",
    "no": "2",
    "intent": "NEAREST_PFZ",
    "english": {
      "q": "Where is the nearest Potential Fishing Zone today?",
      "a": "The nearest demo Potential Fishing Zone is shown on the map for Visakhapatnam; use the highlighted zone and check its current risk before departure."
    },
    "hindi": {
      "q": "आज सबसे नज़दीकी संभावित मछली पकड़ने का क्षेत्र (PFZ) कहाँ है?",
      "a": "Visakhapatnam के लिए निकटतम डेमो संभावित मछली पकड़ने का क्षेत्र मानचित्र पर दिखाया गया है; रवाना होने से पहले चिन्हित क्षेत्र का वर्तमान जोखिम जाँचें।"
    },
    "regional": {
      "q": "ఈరోజు సమీపంలో ఉన్న సంభావ్య మత్స్య మండలం (PFZ) ఎక్కడ ఉంది?",
      "a": "Visakhapatnam సమీపంలోని డెమో PFZ మ్యాప్‌లో చూపబడింది. బయలుదేరే ముందు గుర్తించిన ప్రాంతం యొక్క ప్రస్తుత ప్రమాదాన్ని తనిఖీ చేయండి."
    }
  },
  {
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "language": "Telugu",
    "no": "3",
    "intent": "WAVE_HEIGHT",
    "english": {
      "q": "What is the wave height near Visakhapatnam right now?",
      "a": "In the demo scenario, wave height near Visakhapatnam is 1.2–1.8 m. Treat this as demonstration data, not a live observation."
    },
    "hindi": {
      "q": "अभी विशाखापत्तनम के पास लहरों की ऊँचाई कितनी है?",
      "a": "डेमो परिदृश्य में Visakhapatnam के पास लहरों की ऊँचाई 1.2–1.8 मीटर है। इसे केवल प्रदर्शन डेटा मानें, वास्तविक समय का मापन नहीं।"
    },
    "regional": {
      "q": "ఇప్పుడు విశాఖపట్నం దగ్గర అల ఎత్తు ఎంత?",
      "a": "డెమో పరిస్థితిలో Visakhapatnam సమీపంలో అలల ఎత్తు 1.2–1.8 మీటర్లు. ఇది డెమో డేటా మాత్రమే, ప్రత్యక్ష కొలత కాదు."
    }
  },
  {
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "language": "Telugu",
    "no": "4",
    "intent": "CYCLONE_ALERT",
    "english": {
      "q": "Are there any cyclone alerts in my area?",
      "a": "No severe cyclone alert is active in the demo scenario for Visakhapatnam. Always verify the latest official warning before departure."
    },
    "hindi": {
      "q": "क्या मेरे क्षेत्र में कोई चक्रवात चेतावनी है?",
      "a": "डेमो परिदृश्य में Visakhapatnam के लिए कोई गंभीर चक्रवात चेतावनी सक्रिय नहीं है। रवाना होने से पहले नवीनतम आधिकारिक चेतावनी अवश्य जाँचें।"
    },
    "regional": {
      "q": "నా ప్రాంతంలో తుఫాను హెచ్చరిక ఉందా?",
      "a": "డెమో పరిస్థితిలో Visakhapatnam కోసం తీవ్రమైన తుఫాను హెచ్చరిక సక్రియంగా లేదు. బయలుదేరే ముందు అధికారిక హెచ్చరికను తనిఖీ చేయండి."
    }
  },
  {
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "language": "Telugu",
    "no": "5",
    "intent": "MULTI_DAY_TRIP",
    "english": {
      "q": "Is it safe for a 3-day trip starting tomorrow?",
      "a": "For the demo 3-day trip, Day 1 is Safe, Day 2 is Safe, and Day 3 is Caution. The overall trip status is Caution because the worst day governs."
    },
    "hindi": {
      "q": "क्या कल से शुरू होने वाली 3-दिन की यात्रा सुरक्षित है?",
      "a": "डेमो 3-दिन की यात्रा में दिन 1 सुरक्षित, दिन 2 सुरक्षित और दिन 3 सावधानी है। पूरी यात्रा की स्थिति सावधानी है क्योंकि सबसे जोखिम वाले दिन के आधार पर निर्णय होता है।"
    },
    "regional": {
      "q": "రేపటి నుండి మొదలయ్యే 3-రోజుల ప్రయాణం సురక్షితమేనా?",
      "a": "డెమో 3-రోజుల ప్రయాణంలో రోజు 1 సురక్షితం, రోజు 2 సురక్షితం, రోజు 3 జాగ్రత్త. అత్యధిక ప్రమాదం ఉన్న రోజు ఆధారంగా మొత్తం స్థితి జాగ్రత్త."
    }
  },
  {
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "language": "Telugu",
    "no": "6",
    "intent": "SAFE_ROUTE",
    "english": {
      "q": "What's the safest route from Visakhapatnam harbor to the nearest fishing zone?",
      "a": "The demo route from Visakhapatnam harbor to the nearest fishing zone avoids the highlighted hazard areas and follows the lowest-risk path shown on the map."
    },
    "hindi": {
      "q": "विशाखापत्तनम बंदरगाह से नज़दीकी मछली पकड़ने के क्षेत्र तक सबसे सुरक्षित रास्ता कौन सा है?",
      "a": "डेमो मार्ग Visakhapatnam बंदरगाह से निकटतम मछली पकड़ने के क्षेत्र तक चिन्हित जोखिम वाले क्षेत्रों से बचता है और मानचित्र पर दिखाए गए कम-जोखिम वाले रास्ते का अनुसरण करता है।"
    },
    "regional": {
      "q": "విశాఖపట్నం రేవు నుండి సమీప మత్స్య మండలానికి సురక్షితమైన మార్గం ఏది?",
      "a": "డెమో మార్గం Visakhapatnam నౌకాశ్రయం నుండి సమీప చేపల వేట ప్రాంతానికి ప్రమాదకర ప్రాంతాలను తప్పించి మ్యాప్‌లో చూపిన తక్కువ-ప్రమాద మార్గాన్ని అనుసరిస్తుంది."
    }
  },
  {
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "language": "Telugu",
    "no": "7",
    "intent": "CHLOROPHYLL_ZONE",
    "english": {
      "q": "Which regions show high chlorophyll concentration nearby?",
      "a": "The demo map highlights the nearby areas with higher chlorophyll concentration; these are candidate productivity zones, not a guaranteed catch."
    },
    "hindi": {
      "q": "आस-पास किन क्षेत्रों में क्लोरोफिल का स्तर अधिक है?",
      "a": "डेमो मानचित्र में अधिक क्लोरोफिल वाले आसपास के क्षेत्र चिन्हित हैं; ये संभावित उत्पादक क्षेत्र हैं, निश्चित पकड़ की गारंटी नहीं।"
    },
    "regional": {
      "q": "సమీపంలో ఏ ప్రాంతాల్లో క్లోరోఫిల్ స్థాయి ఎక్కువగా ఉంది?",
      "a": "డెమో మ్యాప్‌లో ఎక్కువ క్లోరోఫిల్ ఉన్న సమీప ప్రాంతాలు గుర్తించబడ్డాయి. ఇవి సంభావ్య ఉత్పాదక ప్రాంతాలు; చేపల వేట హామీ కాదు."
    }
  },
  {
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "language": "Telugu",
    "no": "8",
    "intent": "AVOID_ZONE",
    "english": {
      "q": "Should I avoid any zones today due to bad weather?",
      "a": "Yes. In the demo scenario, the system recommends avoiding the highlighted high-risk zones today because of adverse conditions."
    },
    "hindi": {
      "q": "क्या आज खराब मौसम के कारण मुझे किसी क्षेत्र से बचना चाहिए?",
      "a": "हाँ। डेमो परिदृश्य में प्रतिकूल परिस्थितियों के कारण सिस्टम आज चिन्हित उच्च-जोखिम वाले क्षेत्रों से बचने की सलाह देता है।"
    },
    "regional": {
      "q": "ఈరోజు చెడు వాతావరణం వల్ల ఏదైనా మండలాన్ని నివారించాలా?",
      "a": "అవును. డెమో పరిస్థితిలో ప్రతికూల పరిస్థితుల కారణంగా గుర్తించిన అధిక-ప్రమాద ప్రాంతాలను ఈరోజు నివారించాలని సిస్టమ్ సూచిస్తుంది."
    }
  },
  {
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "language": "Telugu",
    "no": "9",
    "intent": "WIND_FORECAST",
    "english": {
      "q": "What is the wind speed forecast for tonight?",
      "a": "The demo forecast for tonight shows wind around 12–18 km/h near Visakhapatnam. Verify the latest forecast before going out."
    },
    "hindi": {
      "q": "आज रात के लिए हवा की गति का पूर्वानुमान क्या है?",
      "a": "डेमो पूर्वानुमान में आज रात Visakhapatnam के पास हवा की गति लगभग 12–18 किमी/घंटा है। बाहर जाने से पहले नवीनतम पूर्वानुमान जाँचें।"
    },
    "regional": {
      "q": "ఈరాత్రికి గాలి వేగం అంచనా ఏమిటి?",
      "a": "డెమో అంచనాలో ఈ రాత్రి Visakhapatnam సమీపంలో గాలి వేగం సుమారు 12–18 కి.మీ/గం. బయటకు వెళ్లే ముందు తాజా అంచనాను తనిఖీ చేయండి."
    }
  },
  {
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "language": "Telugu",
    "no": "10",
    "intent": "BOAT_SAFETY",
    "english": {
      "q": "Is my motorized boat safe to go out in these conditions?",
      "a": "For the demo vessel profile, the motorized boat is rated Caution under these conditions. The exact result depends on the vessel profile and current inputs."
    },
    "hindi": {
      "q": "क्या इन परिस्थितियों में मेरी मोटर वाली नाव जाना सुरक्षित है?",
      "a": "डेमो नाव प्रोफ़ाइल के लिए इन परिस्थितियों में मोटर वाली नाव की स्थिति सावधानी है। वास्तविक परिणाम नाव की प्रोफ़ाइल और वर्तमान इनपुट पर निर्भर करता है।"
    },
    "regional": {
      "q": "ఈ పరిస్థితుల్లో నా మోటారు పడవ వెళ్లడం సురక్షితమేనా?",
      "a": "డెమో పడవ ప్రొఫైల్‌లో ఈ పరిస్థితుల్లో మోటారు పడవ స్థితి జాగ్రత్త. నిజమైన ఫలితం పడవ ప్రొఫైల్ మరియు ప్రస్తుత డేటాపై ఆధారపడి ఉంటుంది."
    }
  },
  {
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "language": "Telugu",
    "no": "11",
    "intent": "WHY_NOT_RECOMMENDED",
    "english": {
      "q": "Why is fishing not recommended today?",
      "a": "Fishing is not recommended in the demo scenario because the safety checks identify adverse conditions as the dominant risk factor."
    },
    "hindi": {
      "q": "आज मछली पकड़ने की सलाह क्यों नहीं दी जा रही?",
      "a": "डेमो परिदृश्य में मछली पकड़ने की सलाह नहीं दी जा रही है क्योंकि सुरक्षा जाँच में प्रतिकूल परिस्थितियाँ प्रमुख जोखिम कारक पाई गई हैं।"
    },
    "regional": {
      "q": "ఈరోజు చేపలు పట్టడం సిఫారసు చేయకపోవడానికి కారణం ఏమిటి?",
      "a": "డెమో పరిస్థితిలో చేపలు పట్టడం సిఫారసు చేయబడదు, ఎందుకంటే భద్రతా తనిఖీలో ప్రతికూల పరిస్థితులు ప్రధాన ప్రమాదంగా గుర్తించబడ్డాయి."
    }
  },
  {
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "language": "Telugu",
    "no": "12",
    "intent": "SAFETY_TOMORROW",
    "english": {
      "q": "What time is safest to go out tomorrow?",
      "a": "The demo recommends the daytime window with the lowest combined risk. Re-check the forecast close to departure rather than relying on this fixed demo answer."
    },
    "hindi": {
      "q": "कल जाने के लिए सबसे सुरक्षित समय कौन सा है?",
      "a": "डेमो में दिन के उस समय की सिफारिश की गई है जिसमें संयुक्त जोखिम सबसे कम है। रवाना होने के समय के करीब पूर्वानुमान दोबारा जाँचें; इस स्थिर डेमो उत्तर पर निर्भर न रहें।"
    },
    "regional": {
      "q": "రేపు వెళ్లడానికి సురక్షితమైన సమయం ఏది?",
      "a": "డెమోలో కలిపిన ప్రమాదం తక్కువగా ఉన్న పగటి సమయం సిఫారసు చేయబడింది. బయలుదేరే సమయానికి దగ్గరగా అంచనాను మళ్లీ తనిఖీ చేయండి."
    }
  },
  {
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "language": "Telugu",
    "no": "13",
    "intent": "RESTRICTED_ZONE",
    "english": {
      "q": "Are there any restricted zones near Visakhapatnam?",
      "a": "The demo map flags restricted or protected areas near Visakhapatnam. Do not enter a restricted zone; confirm the latest official boundaries."
    },
    "hindi": {
      "q": "क्या विशाखापत्तनम के पास कोई प्रतिबंधित क्षेत्र है?",
      "a": "Visakhapatnam के पास डेमो मानचित्र प्रतिबंधित या संरक्षित क्षेत्रों को चिन्हित करता है। प्रतिबंधित क्षेत्र में प्रवेश न करें; नवीनतम आधिकारिक सीमाएँ जाँचें।"
    },
    "regional": {
      "q": "విశాఖపట్నం దగ్గర నిషేధిత మండలాలు ఏమైనా ఉన్నాయా?",
      "a": "Visakhapatnam సమీపంలోని పరిమిత లేదా రక్షిత ప్రాంతాలను డెమో మ్యాప్ గుర్తిస్తుంది. తాజా అధికారిక సరిహద్దులను తనిఖీ చేయండి."
    }
  },
  {
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "language": "Telugu",
    "no": "14",
    "intent": "CURRENT_COASTAL_CONDITIONS",
    "english": {
      "q": "What's the current near the coast today?",
      "a": "The demo scenario shows a moderate near-shore current near Visakhapatnam. Current conditions can change, so verify the latest marine data."
    },
    "hindi": {
      "q": "आज तट के पास समुद्री धारा कैसी है?",
      "a": "डेमो परिदृश्य में Visakhapatnam के तट के पास समुद्री धारा मध्यम है। समुद्री परिस्थितियाँ बदल सकती हैं, इसलिए नवीनतम डेटा जाँचें।"
    },
    "regional": {
      "q": "ఈరోజు తీరం దగ్గర సముద్ర ప్రవాహం ఎలా ఉంది?",
      "a": "డెమో పరిస్థితిలో Visakhapatnam తీరానికి సమీపంలోని సముద్ర ప్రవాహం మితంగా ఉంది. తాజా సముద్ర డేటాను తనిఖీ చేయండి."
    }
  },
  {
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "language": "Telugu",
    "no": "15",
    "intent": "NIGHT_VISIBILITY",
    "english": {
      "q": "Is visibility good enough for night fishing today?",
      "a": "The demo scenario rates visibility as adequate for the selected period, but night fishing should only proceed after checking the latest visibility and weather conditions."
    },
    "hindi": {
      "q": "क्या आज रात मछली पकड़ने के लिए दृश्यता पर्याप्त है?",
      "a": "डेमो परिदृश्य में चुने गए समय के लिए दृश्यता पर्याप्त है, लेकिन रात में मछली पकड़ने से पहले नवीनतम दृश्यता और मौसम की स्थिति जाँचनी चाहिए।"
    },
    "regional": {
      "q": "ఈరాత్రి చేపలు పట్టడానికి తగినంత దృశ్యమానత ఉందా?",
      "a": "డెమో పరిస్థితిలో ఎంచుకున్న సమయానికి దృశ్యమానత సరిపోతుంది. రాత్రి చేపల వేటకు ముందు తాజా దృశ్యమానత మరియు వాతావరణాన్ని తనిఖీ చేయండి."
    }
  },
  {
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "language": "Telugu",
    "no": "16",
    "intent": "WEEKEND_FISHING",
    "english": {
      "q": "Can I go fishing this weekend?",
      "a": "For the demo weekend forecast, fishing is rated Caution. Re-check the forecast and warnings closer to the actual trip."
    },
    "hindi": {
      "q": "क्या मैं इस सप्ताहांत मछली पकड़ने जा सकता हूँ?",
      "a": "डेमो सप्ताहांत पूर्वानुमान में मछली पकड़ने की स्थिति सावधानी है। वास्तविक यात्रा के करीब पूर्वानुमान और चेतावनियाँ दोबारा जाँचें।"
    },
    "regional": {
      "q": "ఈ వారాంతంలో నేను చేపలు పట్టడానికి వెళ్లవచ్చా?",
      "a": "డెమో వారాంతపు అంచనాలో చేపల వేట జాగ్రత్త స్థితిలో ఉంది. నిజమైన ప్రయాణానికి ముందు అంచనా మరియు హెచ్చరికలను మళ్లీ తనిఖీ చేయండి."
    }
  },
  {
    "city": "Digha",
    "state": "West Bengal",
    "language": "Bengali",
    "no": "1",
    "intent": "SAFETY_TOMORROW",
    "english": {
      "q": "Is it safe to fish near Digha tomorrow?",
      "a": "Based on the demo forecast for tomorrow, conditions are moderately safe for fishing near Digha. Check the latest local warning before departure."
    },
    "hindi": {
      "q": "क्या कल दीघा के पास मछली पकड़ना सुरक्षित है?",
      "a": "डेमो पूर्वानुमान के अनुसार, कल Digha के पास मछली पकड़ने की परिस्थितियाँ मध्यम रूप से सुरक्षित हैं। रवाना होने से पहले नवीनतम स्थानीय चेतावनी अवश्य जाँचें।"
    },
    "regional": {
      "q": "আগামীকাল দীঘার কাছে মাছ ধরা কি নিরাপদ?",
      "a": "ডেমো পূর্বাভাস অনুযায়ী, আগামীকাল Digha-এর কাছে মাছ ধরার পরিস্থিতি মাঝারি নিরাপদ। রওনা হওয়ার আগে সর্বশেষ স্থানীয় সতর্কতা দেখুন।"
    }
  },
  {
    "city": "Digha",
    "state": "West Bengal",
    "language": "Bengali",
    "no": "2",
    "intent": "NEAREST_PFZ",
    "english": {
      "q": "Where is the nearest Potential Fishing Zone today?",
      "a": "The nearest demo Potential Fishing Zone is shown on the map for Digha; use the highlighted zone and check its current risk before departure."
    },
    "hindi": {
      "q": "आज सबसे नज़दीकी संभावित मछली पकड़ने का क्षेत्र (PFZ) कहाँ है?",
      "a": "Digha के लिए निकटतम डेमो संभावित मछली पकड़ने का क्षेत्र मानचित्र पर दिखाया गया है; रवाना होने से पहले चिन्हित क्षेत्र का वर्तमान जोखिम जाँचें।"
    },
    "regional": {
      "q": "আজ সবচেয়ে কাছের সম্ভাব্য মৎস্য অঞ্চল (PFZ) কোথায়?",
      "a": "Digha-এর কাছের ডেমো PFZ মানচিত্রে দেখানো হয়েছে। রওনা হওয়ার আগে চিহ্নিত এলাকার বর্তমান ঝুঁকি পরীক্ষা করুন।"
    }
  },
  {
    "city": "Digha",
    "state": "West Bengal",
    "language": "Bengali",
    "no": "3",
    "intent": "WAVE_HEIGHT",
    "english": {
      "q": "What is the wave height near Digha right now?",
      "a": "In the demo scenario, wave height near Digha is 1.2–1.8 m. Treat this as demonstration data, not a live observation."
    },
    "hindi": {
      "q": "अभी दीघा के पास लहरों की ऊँचाई कितनी है?",
      "a": "डेमो परिदृश्य में Digha के पास लहरों की ऊँचाई 1.2–1.8 मीटर है। इसे केवल प्रदर्शन डेटा मानें, वास्तविक समय का मापन नहीं।"
    },
    "regional": {
      "q": "এখন দীঘার কাছে ঢেউয়ের উচ্চতা কত?",
      "a": "ডেমো পরিস্থিতিতে Digha-এর কাছে ঢেউয়ের উচ্চতা 1.2–1.8 মিটার। এটি শুধু ডেমো ডেটা, সরাসরি পর্যবেক্ষণ নয়।"
    }
  },
  {
    "city": "Digha",
    "state": "West Bengal",
    "language": "Bengali",
    "no": "4",
    "intent": "CYCLONE_ALERT",
    "english": {
      "q": "Are there any cyclone alerts in my area?",
      "a": "No severe cyclone alert is active in the demo scenario for Digha. Always verify the latest official warning before departure."
    },
    "hindi": {
      "q": "क्या मेरे क्षेत्र में कोई चक्रवात चेतावनी है?",
      "a": "डेमो परिदृश्य में Digha के लिए कोई गंभीर चक्रवात चेतावनी सक्रिय नहीं है। रवाना होने से पहले नवीनतम आधिकारिक चेतावनी अवश्य जाँचें।"
    },
    "regional": {
      "q": "আমার এলাকায় কি কোনো ঘূর্ণিঝড় সতর্কতা আছে?",
      "a": "ডেমো পরিস্থিতিতে Digha-এর জন্য কোনো গুরুতর ঘূর্ণিঝড় সতর্কতা সক্রিয় নেই। রওনা হওয়ার আগে সরকারি সতর্কতা দেখুন।"
    }
  },
  {
    "city": "Digha",
    "state": "West Bengal",
    "language": "Bengali",
    "no": "5",
    "intent": "MULTI_DAY_TRIP",
    "english": {
      "q": "Is it safe for a 3-day trip starting tomorrow?",
      "a": "For the demo 3-day trip, Day 1 is Safe, Day 2 is Safe, and Day 3 is Caution. The overall trip status is Caution because the worst day governs."
    },
    "hindi": {
      "q": "क्या कल से शुरू होने वाली 3-दिन की यात्रा सुरक्षित है?",
      "a": "डेमो 3-दिन की यात्रा में दिन 1 सुरक्षित, दिन 2 सुरक्षित और दिन 3 सावधानी है। पूरी यात्रा की स्थिति सावधानी है क्योंकि सबसे जोखिम वाले दिन के आधार पर निर्णय होता है।"
    },
    "regional": {
      "q": "আগামীকাল থেকে শুরু হওয়া ৩-দিনের যাত্রা কি নিরাপদ?",
      "a": "ডেমো ৩ দিনের যাত্রায় দিন ১ নিরাপদ, দিন ২ নিরাপদ এবং দিন ৩ সতর্কতা। সবচেয়ে ঝুঁকিপূর্ণ দিনের ভিত্তিতে মোট অবস্থা সতর্কতা।"
    }
  },
  {
    "city": "Digha",
    "state": "West Bengal",
    "language": "Bengali",
    "no": "6",
    "intent": "SAFE_ROUTE",
    "english": {
      "q": "What's the safest route from Digha harbor to the nearest fishing zone?",
      "a": "The demo route from Digha harbor to the nearest fishing zone avoids the highlighted hazard areas and follows the lowest-risk path shown on the map."
    },
    "hindi": {
      "q": "दीघा बंदरगाह से नज़दीकी मछली पकड़ने के क्षेत्र तक सबसे सुरक्षित रास्ता कौन सा है?",
      "a": "डेमो मार्ग Digha बंदरगाह से निकटतम मछली पकड़ने के क्षेत्र तक चिन्हित जोखिम वाले क्षेत्रों से बचता है और मानचित्र पर दिखाए गए कम-जोखिम वाले रास्ते का अनुसरण करता है।"
    },
    "regional": {
      "q": "দীঘা বন্দর থেকে নিকটতম মৎস্য অঞ্চলে যাওয়ার সবচেয়ে নিরাপদ পথ কোনটি?",
      "a": "ডেমো রুটটি Digha বন্দর থেকে নিকটতম মাছ ধরার অঞ্চলে ঝুঁকিপূর্ণ এলাকা এড়িয়ে মানচিত্রে দেখানো কম-ঝুঁকির পথ অনুসরণ করে।"
    }
  },
  {
    "city": "Digha",
    "state": "West Bengal",
    "language": "Bengali",
    "no": "7",
    "intent": "CHLOROPHYLL_ZONE",
    "english": {
      "q": "Which regions show high chlorophyll concentration nearby?",
      "a": "The demo map highlights the nearby areas with higher chlorophyll concentration; these are candidate productivity zones, not a guaranteed catch."
    },
    "hindi": {
      "q": "आस-पास किन क्षेत्रों में क्लोरोफिल का स्तर अधिक है?",
      "a": "डेमो मानचित्र में अधिक क्लोरोफिल वाले आसपास के क्षेत्र चिन्हित हैं; ये संभावित उत्पादक क्षेत्र हैं, निश्चित पकड़ की गारंटी नहीं।"
    },
    "regional": {
      "q": "কাছাকাছি কোন অঞ্চলে ক্লোরোফিলের পরিমাণ বেশি?",
      "a": "ডেমো মানচিত্রে বেশি ক্লোরোফিলযুক্ত কাছের এলাকাগুলি চিহ্নিত করা হয়েছে। এগুলি সম্ভাব্য উৎপাদনশীল এলাকা; মাছ ধরার নিশ্চয়তা নয়।"
    }
  },
  {
    "city": "Digha",
    "state": "West Bengal",
    "language": "Bengali",
    "no": "8",
    "intent": "AVOID_ZONE",
    "english": {
      "q": "Should I avoid any zones today due to bad weather?",
      "a": "Yes. In the demo scenario, the system recommends avoiding the highlighted high-risk zones today because of adverse conditions."
    },
    "hindi": {
      "q": "क्या आज खराब मौसम के कारण मुझे किसी क्षेत्र से बचना चाहिए?",
      "a": "हाँ। डेमो परिदृश्य में प्रतिकूल परिस्थितियों के कारण सिस्टम आज चिन्हित उच्च-जोखिम वाले क्षेत्रों से बचने की सलाह देता है।"
    },
    "regional": {
      "q": "আজ খারাপ আবহাওয়ার কারণে কোনো অঞ্চল এড়িয়ে যাওয়া উচিত?",
      "a": "হ্যাঁ। ডেমো পরিস্থিতিতে প্রতিকূল অবস্থার কারণে চিহ্নিত উচ্চ-ঝুঁকির এলাকাগুলি আজ এড়াতে সিস্টেম পরামর্শ দেয়।"
    }
  },
  {
    "city": "Digha",
    "state": "West Bengal",
    "language": "Bengali",
    "no": "9",
    "intent": "WIND_FORECAST",
    "english": {
      "q": "What is the wind speed forecast for tonight?",
      "a": "The demo forecast for tonight shows wind around 12–18 km/h near Digha. Verify the latest forecast before going out."
    },
    "hindi": {
      "q": "आज रात के लिए हवा की गति का पूर्वानुमान क्या है?",
      "a": "डेमो पूर्वानुमान में आज रात Digha के पास हवा की गति लगभग 12–18 किमी/घंटा है। बाहर जाने से पहले नवीनतम पूर्वानुमान जाँचें।"
    },
    "regional": {
      "q": "আজ রাতের জন্য বাতাসের গতির পূর্বাভাস কী?",
      "a": "ডেমো পূর্বাভাসে আজ রাতে Digha-এর কাছে বাতাসের গতি প্রায় 12–18 কিমি/ঘণ্টা। বের হওয়ার আগে সর্বশেষ পূর্বাভাস দেখুন।"
    }
  },
  {
    "city": "Digha",
    "state": "West Bengal",
    "language": "Bengali",
    "no": "10",
    "intent": "BOAT_SAFETY",
    "english": {
      "q": "Is my motorized boat safe to go out in these conditions?",
      "a": "For the demo vessel profile, the motorized boat is rated Caution under these conditions. The exact result depends on the vessel profile and current inputs."
    },
    "hindi": {
      "q": "क्या इन परिस्थितियों में मेरी मोटर वाली नाव जाना सुरक्षित है?",
      "a": "डेमो नाव प्रोफ़ाइल के लिए इन परिस्थितियों में मोटर वाली नाव की स्थिति सावधानी है। वास्तविक परिणाम नाव की प्रोफ़ाइल और वर्तमान इनपुट पर निर्भर करता है।"
    },
    "regional": {
      "q": "এই পরিস্থিতিতে আমার মোটরচালিত নৌকা যাওয়া নিরাপদ কি?",
      "a": "ডেমো নৌকার প্রোফাইলে এই পরিস্থিতিতে মোটরচালিত নৌকার অবস্থা সতর্কতা। বাস্তব ফল নৌকার প্রোফাইল ও বর্তমান তথ্যের ওপর নির্ভর করবে।"
    }
  },
  {
    "city": "Digha",
    "state": "West Bengal",
    "language": "Bengali",
    "no": "11",
    "intent": "WHY_NOT_RECOMMENDED",
    "english": {
      "q": "Why is fishing not recommended today?",
      "a": "Fishing is not recommended in the demo scenario because the safety checks identify adverse conditions as the dominant risk factor."
    },
    "hindi": {
      "q": "आज मछली पकड़ने की सलाह क्यों नहीं दी जा रही?",
      "a": "डेमो परिदृश्य में मछली पकड़ने की सलाह नहीं दी जा रही है क्योंकि सुरक्षा जाँच में प्रतिकूल परिस्थितियाँ प्रमुख जोखिम कारक पाई गई हैं।"
    },
    "regional": {
      "q": "আজ মাছ ধরার পরামর্শ দেওয়া হচ্ছে না কেন?",
      "a": "ডেমো পরিস্থিতিতে মাছ ধরার পরামর্শ দেওয়া হচ্ছে না, কারণ নিরাপত্তা পরীক্ষায় প্রতিকূল পরিস্থিতিকে প্রধান ঝুঁকি হিসেবে পাওয়া গেছে।"
    }
  },
  {
    "city": "Digha",
    "state": "West Bengal",
    "language": "Bengali",
    "no": "12",
    "intent": "SAFETY_TOMORROW",
    "english": {
      "q": "What time is safest to go out tomorrow?",
      "a": "The demo recommends the daytime window with the lowest combined risk. Re-check the forecast close to departure rather than relying on this fixed demo answer."
    },
    "hindi": {
      "q": "कल जाने के लिए सबसे सुरक्षित समय कौन सा है?",
      "a": "डेमो में दिन के उस समय की सिफारिश की गई है जिसमें संयुक्त जोखिम सबसे कम है। रवाना होने के समय के करीब पूर्वानुमान दोबारा जाँचें; इस स्थिर डेमो उत्तर पर निर्भर न रहें।"
    },
    "regional": {
      "q": "আগামীকাল যাওয়ার জন্য সবচেয়ে নিরাপদ সময় কোনটি?",
      "a": "ডেমোতে সম্মিলিত ঝুঁকি সবচেয়ে কম এমন দিনের সময়টি সুপারিশ করা হয়েছে। রওনা হওয়ার কাছাকাছি সময়ে পূর্বাভাস আবার দেখুন।"
    }
  },
  {
    "city": "Digha",
    "state": "West Bengal",
    "language": "Bengali",
    "no": "13",
    "intent": "RESTRICTED_ZONE",
    "english": {
      "q": "Are there any restricted zones near Digha?",
      "a": "The demo map flags restricted or protected areas near Digha. Do not enter a restricted zone; confirm the latest official boundaries."
    },
    "hindi": {
      "q": "क्या दीघा के पास कोई प्रतिबंधित क्षेत्र है?",
      "a": "Digha के पास डेमो मानचित्र प्रतिबंधित या संरक्षित क्षेत्रों को चिन्हित करता है। प्रतिबंधित क्षेत्र में प्रवेश न करें; नवीनतम आधिकारिक सीमाएँ जाँचें।"
    },
    "regional": {
      "q": "দীঘার কাছে কোনো নিষিদ্ধ অঞ্চল আছে কি?",
      "a": "Digha-এর কাছে নিষিদ্ধ বা সংরক্ষিত এলাকাগুলি ডেমো মানচিত্রে চিহ্নিত করা হয়েছে। সর্বশেষ সরকারি সীমানা পরীক্ষা করুন।"
    }
  },
  {
    "city": "Digha",
    "state": "West Bengal",
    "language": "Bengali",
    "no": "14",
    "intent": "CURRENT_COASTAL_CONDITIONS",
    "english": {
      "q": "What's the current near the coast today?",
      "a": "The demo scenario shows a moderate near-shore current near Digha. Current conditions can change, so verify the latest marine data."
    },
    "hindi": {
      "q": "आज तट के पास समुद्री धारा कैसी है?",
      "a": "डेमो परिदृश्य में Digha के तट के पास समुद्री धारा मध्यम है। समुद्री परिस्थितियाँ बदल सकती हैं, इसलिए नवीनतम डेटा जाँचें।"
    },
    "regional": {
      "q": "আজ উপকূলের কাছে স্রোত কেমন?",
      "a": "ডেমো পরিস্থিতিতে Digha উপকূলের কাছে সমুদ্রস্রোত মাঝারি। সর্বশেষ সামুদ্রিক তথ্য পরীক্ষা করুন।"
    }
  },
  {
    "city": "Digha",
    "state": "West Bengal",
    "language": "Bengali",
    "no": "15",
    "intent": "NIGHT_VISIBILITY",
    "english": {
      "q": "Is visibility good enough for night fishing today?",
      "a": "The demo scenario rates visibility as adequate for the selected period, but night fishing should only proceed after checking the latest visibility and weather conditions."
    },
    "hindi": {
      "q": "क्या आज रात मछली पकड़ने के लिए दृश्यता पर्याप्त है?",
      "a": "डेमो परिदृश्य में चुने गए समय के लिए दृश्यता पर्याप्त है, लेकिन रात में मछली पकड़ने से पहले नवीनतम दृश्यता और मौसम की स्थिति जाँचनी चाहिए।"
    },
    "regional": {
      "q": "আজ রাতে মাছ ধরার জন্য পর্যাপ্ত দৃশ্যমানতা আছে কি?",
      "a": "ডেমো পরিস্থিতিতে নির্বাচিত সময়ে দৃশ্যমানতা যথেষ্ট। রাতে মাছ ধরার আগে সর্বশেষ দৃশ্যমানতা ও আবহাওয়া পরীক্ষা করুন।"
    }
  },
  {
    "city": "Digha",
    "state": "West Bengal",
    "language": "Bengali",
    "no": "16",
    "intent": "WEEKEND_FISHING",
    "english": {
      "q": "Can I go fishing this weekend?",
      "a": "For the demo weekend forecast, fishing is rated Caution. Re-check the forecast and warnings closer to the actual trip."
    },
    "hindi": {
      "q": "क्या मैं इस सप्ताहांत मछली पकड़ने जा सकता हूँ?",
      "a": "डेमो सप्ताहांत पूर्वानुमान में मछली पकड़ने की स्थिति सावधानी है। वास्तविक यात्रा के करीब पूर्वानुमान और चेतावनियाँ दोबारा जाँचें।"
    },
    "regional": {
      "q": "এই সপ্তাহান্তে আমি কি মাছ ধরতে যেতে পারি?",
      "a": "ডেমো সপ্তাহান্তের পূর্বাভাসে মাছ ধরার অবস্থা সতর্কতা। প্রকৃত যাত্রার আগে পূর্বাভাস ও সতর্কতা আবার পরীক্ষা করুন।"
    }
  }
];
