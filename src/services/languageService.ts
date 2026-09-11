import { questionBank } from "../data/questionBank";

export type SupportedLanguage = "English" | "Hindi" | "Bengali" | "Tamil" | "Kannada" | "Gujarati" | "Malayalam" | "Telugu";

export function detectLanguage(query: string): SupportedLanguage {
  const q = query.toLowerCase().trim();
  
  // 1. Exact match against question bank
  for (const item of questionBank) {
    if (item.english.q.toLowerCase() === q) return "English";
    if (item.hindi.q.toLowerCase() === q) return "Hindi";
    if (item.regional.q.toLowerCase() === q) {
      return item.language as SupportedLanguage;
    }
  }

  // 2. Script detection
  const hindiRegex = /[\u0900-\u097F]/;
  const bengaliRegex = /[\u0980-\u09FF]/;
  const gujaratiRegex = /[\u0A80-\u0AFF]/;
  const tamilRegex = /[\u0B80-\u0BFF]/;
  const teluguRegex = /[\u0C00-\u0C7F]/;
  const kannadaRegex = /[\u0C80-\u0CFF]/;
  const malayalamRegex = /[\u0D00-\u0D7F]/;

  if (hindiRegex.test(query)) return "Hindi";
  if (bengaliRegex.test(query)) return "Bengali";
  if (gujaratiRegex.test(query)) return "Gujarati";
  if (tamilRegex.test(query)) return "Tamil";
  if (teluguRegex.test(query)) return "Telugu";
  if (kannadaRegex.test(query)) return "Kannada";
  if (malayalamRegex.test(query)) return "Malayalam";

  // 3. Romanized / Hinglish keywords detection
  const hinglishKeywords = ["kya", "hai", "kal", "aaj", "kahan", "kaise", "surakshit", "liye", "aur", "nahi"];
  let hinglishCount = 0;
  const words = q.split(/\s+/);
  for (const word of words) {
    if (hinglishKeywords.includes(word)) hinglishCount++;
  }
  
  // If multiple Hinglish words match, assume Hindi
  if (hinglishCount >= 2) return "Hindi";

  // Default to English
  return "English";
}

export function getLocaleForLanguage(lang: SupportedLanguage): string {
  switch (lang) {
    case "Hindi": return "hi-IN";
    case "Bengali": return "bn-IN";
    case "Tamil": return "ta-IN";
    case "Kannada": return "kn-IN";
    case "Gujarati": return "gu-IN";
    case "Malayalam": return "ml-IN";
    case "Telugu": return "te-IN";
    case "English":
    default:
      return "en-IN";
  }
}
