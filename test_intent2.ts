import { detectIntent } from './src/services/intentService.ts';
import { questionBank } from './src/data/questionBank.ts';

const q = 'what about mumbai'.toLowerCase();
const queryWords = q.split(/\s+/).filter(w => w.length > 2);
for (const item of questionBank) {
  const bankWords = item.english.q.toLowerCase().split(/\s+/);
  let score = 0;
  for (const w of queryWords) {
    if (bankWords.some(bw => {
      const cleanBw = bw.replace(/[^a-z0-9]/gi, '');
      if (cleanBw.length <= 2) return false;
      return cleanBw.includes(w) || w.includes(cleanBw);
    })) {
      score++;
    }
  }
  const normalizedScore = score / Math.max(queryWords.length, 1);
  const bankPenalty = score / Math.max(bankWords.length, 1);
  const combinedScore = score + normalizedScore + bankPenalty;
  
  if (combinedScore > 1.2 && score >= 1) {
    console.log("MATCH", item.intent, item.english.q, "Score:", combinedScore, "Raw:", score);
  }
}
console.log(detectIntent('what about mumbai', 'English'));
