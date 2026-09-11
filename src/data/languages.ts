import type { Language } from "../store/profile";

export const SUPPORTED_LANGUAGES: { id: Language; label: string; native: string }[] = [
  { id: "en", label: "English", native: "English" },
  { id: "hi", label: "Hindi", native: "हिंदी" },
  { id: "bn", label: "Bengali", native: "বাংলা" },
  { id: "te", label: "Telugu", native: "తెలుగు" },
  { id: "ta", label: "Tamil", native: "தமிழ்" },
  { id: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { id: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { id: "ml", label: "Malayalam", native: "മലയാളം" },
];
