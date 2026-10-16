import { DailyBrainPuzzle } from '../types/game';

export const DAILY_PUZZLES_BANK: DailyBrainPuzzle[] = [
  {
    id: 'daily-1',
    dateKey: '2026-10-10',
    dayNumber: 283,
    title: 'The Enigma of Three Switches',
    titleTa: 'மூன்று சுவிட்சுகள் மற்றும் மர்ம அறை',
    type: 'logic_riddle',
    prompt: 'You are outside a closed room with 3 switches (1, 2, 3). Only one switch turns on the light bulb inside the room. You can only enter the room once. How can you determine with 100% certainty which switch controls the light?',
    promptTa: 'மூடிய அறைக்கு வெளியே 3 சுவிட்சுகள் (1, 2, 3) உள்ளன. ஒன்றே ஒன்றுதான் உள்ளிருக்கும் பல்பை எரியவைக்கும். நீங்கள் அறைக்குள் ஒரே ஒரு முறை மட்டுமே சென்று பார்க்க முடியும். எந்த சுவிட்ச் பல்பைக் கட்டுப்படுத்துகிறது என்பதை எவ்வாறு உறுதியாகக் கண்டறிவீர்கள்?',
    options: [
      {
        id: 'opt-1',
        text: 'Turn switch 1 on for 10 mins, turn it off, turn switch 2 on, and enter (check light and heat)',
        textTa: 'சுவிட்ச் 1-ஐ 10 நிமிடம் எரியவிட்டு அணைத்து, சுவிட்ச் 2-ஐ ஆன் செய்துவிட்டு உள்ளே செல்ல வேண்டும் (ஒளி மற்றும் வெப்பம் பரிசோதித்தல்)',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        text: 'Turn on all 3 switches at the same time and enter',
        textTa: 'ஒரே நேரத்தில் 3 சுவிட்சுகளையும் ஆன் செய்துவிட்டு உள்ளே செல்ல வேண்டும்',
        isCorrect: false,
      },
      {
        id: 'opt-3',
        text: 'Leave all off and look through the keyhole',
        textTa: 'எல்லாவற்றையும் அணைத்துவிட்டு பூட்டுத் துவாரத்தின் வழியாகப் பார்க்க வேண்டும்',
        isCorrect: false,
      },
      {
        id: 'opt-4',
        text: 'Flip switch 1, then enter immediately',
        textTa: 'சுவிட்ச் 1-ஐ மட்டும் போட்டுவிட்டு உடனே உள்ளே செல்ல வேண்டும்',
        isCorrect: false,
      },
    ],
    explanation: 'By turning switch 1 on for 10 minutes then turning it off, the bulb heats up. If the light is on upon entering, it is switch 2. If it is off but warm to the touch, it is switch 1. If it is off and cold, it is switch 3!',
    explanationTa: 'சுவிட்ச் 1-ஐ 10 நிமிடங்கள் ஆன் செய்து பின் ஆஃப் செய்தால் பல்ப் சூடாகும். சுவிட்ச் 2-ஐ ஆன் செய்துவிட்டு உள்ளே செல்லும்போது: பல்ப் எரிந்தால் அது சுவிட்ச் 2. பல்ப் எரியாமல் சூடாக இருந்தால் சுவிட்ச் 1. எரியாமல் குளிர்ந்திருந்தால் சுவிட்ச் 3!',
    hint: 'Think about physical senses beyond just sight (heat radiation).',
    hintTa: 'பார்வையைத் தாண்டி பல்பின் வெப்பத்தையும் கருத்தில் கொள்ளுங்கள்.',
    bonusPoints: 1200,
  },
  {
    id: 'daily-2',
    dateKey: '2026-10-11',
    dayNumber: 284,
    title: 'The Burning Ropes Timer',
    titleTa: 'எரியும் கயிறுகளின் நேரக் கணக்கீடு',
    type: 'math_intuition',
    prompt: 'You have two distinct ropes. Each rope takes exactly 60 minutes to burn from one end to another, but they burn unevenly. How can you measure exactly 45 minutes using these two ropes and a lighter?',
    promptTa: 'உங்களிடம் இரண்டு கயிறுகள் உள்ளன. ஒவ்வொன்றும் ஒரு முனையிலிருந்து மறுமுனை வரை எரிய சரியாக 60 நிமிடங்கள் எடுக்கும், ஆனால் சீரற்ற வேகத்தில் எரியும். இவைகளைக் கொண்டு சரியாக 45 நிமிடங்களை எவ்வாறு அளவிடுவீர்கள்?',
    options: [
      {
        id: 'opt-1',
        text: 'Light rope 1 from both ends and rope 2 from one end; when rope 1 burns out (30 mins), light the other end of rope 2 (+15 mins)',
        textTa: 'கயிறு 1-ன் இரு முனைகளையும், கயிறு 2-ன் ஒரு முனையையும் எரிக்க வேண்டும்; கயிறு 1 முடிந்ததும் (30 நிமி), கயிறு 2-ன் மறுமுனையையும் எரிக்க வேண்டும் (+15 நிமி)',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        text: 'Cut rope 1 into quarters with scissors',
        textTa: 'கயிறு 1-ஐ கத்தரிக்கோலால் 4 சம பாகங்களாக வெட்ட வேண்டும்',
        isCorrect: false,
      },
      {
        id: 'opt-3',
        text: 'Burn rope 1 completely, then extinguish rope 2 halfway',
        textTa: 'கயிறு 1-ஐ முழுமையாக எரித்து, கயிறு 2-ஐ பாதியில் அணைக்க வேண்டும்',
        isCorrect: false,
      },
      {
        id: 'opt-4',
        text: 'Twist both ropes together and burn from one end',
        textTa: 'இரு கயிறுகளையும் ஒன்றாக முறுக்கி ஒரு முனையில் எரிக்க வேண்டும்',
        isCorrect: false,
      },
    ],
    explanation: 'Lighting a 60-min rope from both ends burns it in exactly 30 minutes. Meanwhile, rope 2 burned for 30 minutes, leaving 30 minutes worth. Lighting the other end of rope 2 burns the remaining portion in 15 minutes: 30 + 15 = 45 minutes!',
    explanationTa: 'ஒரு கயிற்றின் இரு முனைகளையும் ஒரே நேரத்தில் எரித்தால் அது சரியாக 30 நிமிடங்களில் எரிந்து முடியும். அப்போது 2-வது கயிறும் 30 நிமிடத்திற்கு எரிந்திருக்கும் (மீதி 30 நிமிடம்). உடனே 2-வது கயிற்றின் மறுமுனையையும் பற்றவைத்தால், அது 15 நிமிடங்களில் முடியும்: 30 + 15 = 45 நிமிடங்கள்!',
    hint: 'Burning a rope from both ends halves the total burn duration.',
    hintTa: 'ஒரு கயிற்றை இரு முனைகளிலும் எரித்தால் எரியும் நேரம் பாதியாகக் குறையும்.',
    bonusPoints: 1500,
  },
  {
    id: 'daily-3',
    dateKey: '2026-10-12',
    dayNumber: 285,
    title: 'The Counterfeit Gold Coin Scale',
    titleTa: 'போலி தங்கக் காசும் தராசும்',
    type: 'spatial_deduction',
    prompt: 'You have 9 identical-looking gold coins. Exactly 1 coin is counterfeit and weighs slightly lighter than the other 8. Using a balance scale, what is the MINIMUM number of weighings guaranteed to find the fake coin?',
    promptTa: 'உங்களிடம் ஒரே மாதிரியான 9 தங்கக் காசுகள் உள்ளன. அதில் ஒன்று போலி, மற்ற 8-ஐ விட சற்றே எடை குறைவு. ஒரு தராசைப் பயன்படுத்தி குறைந்தபட்சம் எத்தனை எடைகளில் போலி காசைக் கண்டறிய முடியும்?',
    options: [
      { id: 'opt-1', text: '2 Weighings', textTa: '2 முறை மட்டுமே', isCorrect: true },
      { id: 'opt-2', text: '3 Weighings', textTa: '3 முறைகள்', isCorrect: false },
      { id: 'opt-3', text: '4 Weighings', textTa: '4 முறைகள்', isCorrect: false },
      { id: 'opt-4', text: '1 Weighing', textTa: '1 முறை', isCorrect: false },
    ],
    explanation: 'Divide the 9 coins into three groups of 3 (A, B, C). Weigh A vs B (Weighing 1). If balanced, fake is in C; if unbalanced, fake is in the lighter pan. Take the group of 3 and weigh 1 coin vs 1 coin (Weighing 2). Exactly 2 weighings!',
    explanationTa: '9 காசுகளையும் 3, 3, 3 என மூன்று குழுக்களாகப் பிரிக்கவும். முதல் 3-ஐயும் 2-வது 3-ஐயும் தராசில் வைக்கவும் (1-வது எடை). சமமாக இருந்தால் போலி 3-வது குழுவில் உள்ளது; சமமில்லை எனில் குறைந்த எடையுள்ள குழுவில் உள்ளது. பின்னர் அந்தக் குழுவிலிருந்து 1 vs 1 காசை நிறுத்தினால் (2-வது எடை) உடனே தெரிந்துவிடும்!',
    hint: 'Use ternary division (powers of 3: 3² = 9).',
    hintTa: 'மூன்றின் மடங்குகளாக (Ternary 3²=9) பிரித்து தர்க்கத்தை அணுகுங்கள்.',
    bonusPoints: 1400,
  },
  {
    id: 'daily-4',
    dateKey: '2026-10-13',
    dayNumber: 286,
    title: 'Alternating Binary Matrix',
    titleTa: 'இருநிலை மாற்று மேட்ரிக்ஸ்',
    type: 'sequence_matrix',
    prompt: 'Look at the sequence: 101, 111, 101, 010, 000, ? What comes next?',
    promptTa: 'வரிசையைக் கவனியுங்கள்: 101, 111, 101, 010, 000, ? அடுத்து வருவது எது?',
    options: [
      { id: 'opt-1', text: '010', textTa: '010', isCorrect: true },
      { id: 'opt-2', text: '111', textTa: '111', isCorrect: false },
      { id: 'opt-3', text: '001', textTa: '001', isCorrect: false },
      { id: 'opt-4', text: '100', textTa: '100', isCorrect: false },
    ],
    explanation: 'The pattern is symmetric bit-inversion. The first triplet [101, 111, 101] inverts its bits in the second triplet: 101 -> 010, 111 -> 000, and 101 -> 010.',
    explanationTa: 'இது பிட் தலைகீழ் மாற்றத் தொடர் (Bit Inversion). முதல் மூன்று எண்களின் (101, 111, 101) பிட்டுகள் அடுத்த மூன்றில் மாறுகின்றன: 101 -> 010, 111 -> 000, 101 -> 010.',
    hint: 'Compare the 1st and 4th items, 2nd and 5th items.',
    hintTa: 'முதல் எண்ணையும் நான்காவது எண்ணையும் ஒப்பிட்டுப் பாருங்கள்.',
    bonusPoints: 1300,
  },
];

export function getTodayPuzzle(customDateKey?: string): DailyBrainPuzzle {
  const targetKey = customDateKey || new Date().toISOString().split('T')[0];
  const exact = DAILY_PUZZLES_BANK.find((p) => p.dateKey === targetKey);
  if (exact) return exact;

  // Modulo index based on date string hash for endless daily puzzles
  let hash = 0;
  for (let i = 0; i < targetKey.length; i++) {
    hash = (hash * 31 + targetKey.charCodeAt(i)) % DAILY_PUZZLES_BANK.length;
  }
  const picked = DAILY_PUZZLES_BANK[Math.abs(hash)];
  return {
    ...picked,
    dateKey: targetKey,
  };
}
