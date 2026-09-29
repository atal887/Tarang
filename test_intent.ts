import { detectIntent } from './src/services/intentService.ts';
import { questionBank } from './src/data/questionBank.ts';

const q = 'what about mumbai ?'.trim().toLowerCase();
for (const item of questionBank) {
  if (item.english.q.toLowerCase() === q || item.hindi.q.toLowerCase() === q || item.regional.q.toLowerCase() === q) {
    console.log("EXACT MATCH", item);
  }
}
console.log(detectIntent('what about mumbai ?', 'English'));
