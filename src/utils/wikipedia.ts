import type { WikipediaArticleSummary, WikipediaQuizQuestion } from '../types/game';

export interface CuratedTopic {
  id: string;
  query: string;
  labelEn: string;
  labelTa: string;
  icon: string;
}

export const CURATED_TOPICS: CuratedTopic[] = [
  { id: 'science', query: 'Science', labelEn: 'Science', labelTa: 'அறிவியல்', icon: '🔬' },
  { id: 'ai', query: 'Artificial Intelligence', labelEn: 'Artificial Intelligence', labelTa: 'செயற்கை நுண்ணறிவு', icon: '🤖' },
  { id: 'brain', query: 'Human brain', labelEn: 'Human Brain', labelTa: 'மனித மூளை', icon: '🧠' },
  { id: 'einstein', query: 'Albert Einstein', labelEn: 'Albert Einstein', labelTa: 'ஆல்பர்ட் ஐன்ஸ்டைன்', icon: '💡' },
  { id: 'space', query: 'Space exploration', labelEn: 'Space Exploration', labelTa: 'விண்வெளி ஆய்வு', icon: '🚀' },
  { id: 'quantum', query: 'Quantum mechanics', labelEn: 'Quantum Physics', labelTa: 'குவாண்டம் இயற்பியல்', icon: '⚛️' },
  { id: 'kalam', query: 'A. P. J. Abdul Kalam', labelEn: 'Dr. A.P.J. Abdul Kalam', labelTa: 'ஏ. பி. ஜே. அப்துல் கலாம்', icon: '🚀' },
  { id: 'tamil', query: 'Tamil language', labelEn: 'Tamil Language', labelTa: 'தமிழ் மொழி', icon: '📜' },
  { id: 'math', query: 'Mathematics', labelEn: 'Mathematics', labelTa: 'கணிதம்', icon: '📐' },
  { id: 'bharathi', query: 'Subramania Bharati', labelEn: 'Subramania Bharati', labelTa: 'பாரதியார்', icon: '✍️' },
  { id: 'universe', query: 'Universe', labelEn: 'Cosmology & Universe', labelTa: 'அண்டம் & பேரண்டம்', icon: '🌌' },
  { id: 'solar', query: 'Solar System', labelEn: 'Solar System', labelTa: 'சூரியக் குடும்பம்', icon: '🪐' },
];

// Offline sample fallbacks to guarantee zero blank screens even without connectivity
const OFFLINE_FALLBACK_ARTICLES: Record<'en' | 'ta', WikipediaArticleSummary[]> = {
  en: [
    {
      pageid: 736,
      title: 'Albert Einstein',
      extract:
        'Albert Einstein (14 March 1879 – 18 April 1955) was a German-born theoretical physicist widely acknowledged as one of the greatest and most influential physicists of all time. He is best known for developing the theory of relativity and made critical contributions to quantum mechanics. His mass–energy equivalence equation E = mc² is world renowned. He received the 1921 Nobel Prize in Physics.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/360px-Albert_Einstein_Head.jpg',
      fullurl: 'https://en.wikipedia.org/wiki/Albert_Einstein',
      lang: 'en',
      wordCount: 72,
    },
    {
      pageid: 1164,
      title: 'Artificial Intelligence',
      extract:
        'Artificial intelligence (AI) is the intelligence of machines or software, as opposed to the intelligence of humans or other animals. It is a field of study in computer science that develops and studies intelligent machines. Major AI subfields include machine learning, deep learning, natural language processing, computer vision, and robotics.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Artificial_intelligence_prompt.png/360px-Artificial_intelligence_prompt.png',
      fullurl: 'https://en.wikipedia.org/wiki/Artificial_intelligence',
      lang: 'en',
      wordCount: 52,
    },
    {
      pageid: 13344,
      title: 'Human Brain',
      extract:
        'The human brain is the central organ of the human nervous system. Consisting of the cerebrum, the brainstem, and the cerebellum, it contains an estimated 86 billion neurons. The cerebrum is responsible for conscious thought, memory, decision making, spatial reasoning, and perception.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Human_brain_NIH.png/360px-Human_brain_NIH.png',
      fullurl: 'https://en.wikipedia.org/wiki/Human_brain',
      lang: 'en',
      wordCount: 46,
    },
    {
      pageid: 25484,
      title: 'Quantum Mechanics',
      extract:
        'Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. It introduces key concepts such as wave-particle duality, quantum superposition, and quantum entanglement.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Hydrogen_Density_Plots.png/360px-Hydrogen_Density_Plots.png',
      fullurl: 'https://en.wikipedia.org/wiki/Quantum_mechanics',
      lang: 'en',
      wordCount: 43,
    },
  ],
  ta: [
    {
      pageid: 7452,
      title: 'ஆல்பர்ட் ஐன்ஸ்டைன்',
      extract:
        'ஆல்பர்ட் ஐன்ஸ்டைன் (14 மார்ச் 1879 – 18 ஏப்ரல் 1955) ஜெர்மனியில் பிறந்த ஒரு கோட்பாட்டு இயற்பியலாளர் ஆவார். இவர் சார்புக் கோட்பாட்டை உருவாக்கியதன் மூலம் நவீன இயற்பியலின் அடிப்படைகளை மாற்றியமைத்தார். ஒளிமின் விளைவு பற்றிய இவரது விளக்கத்திற்காக 1921 ஆம் ஆண்டிற்கான இயற்பியலுக்கான நோபல் பரிசு இவருக்கு வழங்கப்பட்டது.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/360px-Albert_Einstein_Head.jpg',
      fullurl: 'https://ta.wikipedia.org/wiki/%E0%AE%86%E0%AE%B2%E0%AF%8D%E0%AE%AA%E0%AE%B0%E0%AF%8D%E0%AE%9F%E0%AF%8D_%E0%AE%90%E0%AE%A9%E0%AF%8D%E0%AE%B8%E0%AF%8D%E0%AE%9F%E0%AF%88%E0%AE%A9%E0%AF%8D',
      lang: 'ta',
      wordCount: 41,
    },
    {
      pageid: 8645,
      title: 'ஏ. பி. ஜே. அப்துல் கலாம்',
      extract:
        'அவுல் பக்கீர் ஜைனுலாபுதீன் அப்துல் கலாம் (15 அக்டோபர் 1931 – 27 சூலை 2015) இந்தியாவின் 11-வது குடியரசுத் தலைவராகப் பணியாற்றிய ஒரு இந்திய விண்வெளி விஞ்ஞானி ஆவார். இந்தியாவின் ஏவுகணை மற்றும் அணு ஆயுத திட்டங்களில் இவரது பங்களிப்பிற்காக "இந்தியாவின் ஏவுகணை மனிதர்" என்று புகழப்படுகிறார்.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/A._P._J._Abdul_Kalam.jpg/360px-A._P._J._Abdul_Kalam.jpg',
      fullurl: 'https://ta.wikipedia.org/wiki/%E0%AE%8F._%E0%AE%AA%E0%AE%bf._%E0%AE%9C%E0%AF%87._%E0%AE%85%E0%AE%AA%E0%AF%8D%E0%AE%A4%E0%AF%81%E0%AE%B2%E0%AF%8D_%E0%AE%95%E0%AE%B2%E0%AE%BE%E0%AE%AE%E0%AF%8D',
      lang: 'ta',
      wordCount: 42,
    },
    {
      pageid: 1145,
      title: 'தமிழ் மொழி',
      extract:
        'தமிழ் திராவிட மொழிக் குடும்பத்தைச் சேர்ந்த ஒரு செம்மொழி ஆகும். இது உலகிலேயே மிக நீண்ட தொடர்ச்சியான இலக்கிய பாரம்பரியத்தைக் கொண்ட தொன்மையான மொழிகளில் ஒன்றாகும். இந்தியா, இலங்கை, சிங்கப்பூர், மலேசியா ஆகிய நாடுகளில் பரவலாகப் பேசப்படுகிறது.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Tamil_letter_a.svg/360px-Tamil_letter_a.svg.png',
      fullurl: 'https://ta.wikipedia.org/wiki/%E0%AE%A4%E0%AE%AE%E0%AE%bf%E0%AE%B4%E0%AF%8D',
      lang: 'ta',
      wordCount: 35,
    },
    {
      pageid: 5932,
      title: 'செயற்கை நுண்ணறிவு',
      extract:
        'செயற்கை நுண்ணறிவு என்பது கணினிகள் மற்றும் இயந்திரங்கள் மனிதர்களைப் போன்ற சிந்தனை, கற்றல், முடிவெடுத்தல் மற்றும் பகுப்பாய்வு ஆற்றல்களை வெளிப்படுத்தும் அறிவியல் புலமாகும். இதில் எந்திரக் கற்றல் மற்றும் ஆழமான கற்றல் போன்ற முக்கிய பிரிவுகள் அடங்கும்.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Artificial_intelligence_prompt.png/360px-Artificial_intelligence_prompt.png',
      fullurl: 'https://ta.wikipedia.org/wiki/%E0%AE%9Worker%E0%AE%B1%E0%AF%8D%E0%AE%95%E0%AF%88_%E0%AE%A8%E0%AF%81%E0%AE%A3%E0%AF%8D%E0%AE%A3%E0%AE%B1%E0%AE%bf%E0%AE%B5%E0%AF%81',
      lang: 'ta',
      wordCount: 31,
    },
  ],
};

/**
 * Searches official Wikimedia API using Open Action Query Generator
 */
export async function searchWikipedia(
  rawQuery: string,
  lang: 'en' | 'ta' = 'en',
  limit: number = 9
): Promise<WikipediaArticleSummary[]> {
  const query = rawQuery.trim();

  // If empty query, search a featured topic for this language
  const searchTerm = query || (lang === 'ta' ? 'அறிவியல்' : 'Science');

  const endpoint = `https://${lang}.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
    searchTerm
  )}&gsrlimit=${limit}&prop=extracts|pageimages|info&exintro=1&explaintext=1&exchars=400&piprop=thumbnail&pithumbsize=400&inprop=url&format=json&origin=*`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Wikimedia API responded with HTTP ${res.status}`);
    }

    const data = await res.json();
    const pages = data?.query?.pages;

    if (!pages || typeof pages !== 'object') {
      // If search returns no results, try fallback
      return [];
    }

    const items: WikipediaArticleSummary[] = Object.values(pages)
      .map((p: any) => {
        const title = String(p.title || '');
        const extract = String(p.extract || '').trim();
        const thumbnail = p.thumbnail?.source;
        const fullurl =
          p.fullurl || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`;

        const wordCount = extract ? extract.split(/\s+/).length : 0;

        return {
          pageid: Number(p.pageid || 0),
          title,
          extract,
          thumbnail,
          fullurl,
          lang,
          wordCount,
        };
      })
      .filter((item) => item.title && item.extract.length > 20)
      .sort((a, b) => b.extract.length - a.extract.length);

    if (items.length > 0) {
      return items;
    }

    return OFFLINE_FALLBACK_ARTICLES[lang];
  } catch (err) {
    console.warn('Wikipedia search error, providing localized fallback:', err);
    return OFFLINE_FALLBACK_ARTICLES[lang];
  }
}

/**
 * Fetches a random article from Wikimedia API
 */
export async function fetchRandomWikipediaArticles(
  lang: 'en' | 'ta' = 'en',
  limit: number = 6
): Promise<WikipediaArticleSummary[]> {
  const endpoint = `https://${lang}.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&grnlimit=${limit}&prop=extracts|pageimages|info&exintro=1&explaintext=1&exchars=380&piprop=thumbnail&pithumbsize=400&inprop=url&format=json&origin=*`;

  try {
    const res = await fetch(endpoint, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('Random query failed');
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return OFFLINE_FALLBACK_ARTICLES[lang];

    return Object.values(pages)
      .map((p: any) => ({
        pageid: Number(p.pageid || 0),
        title: String(p.title || ''),
        extract: String(p.extract || '').trim(),
        thumbnail: p.thumbnail?.source,
        fullurl: p.fullurl || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(p.title.replace(/ /g, '_'))}`,
        lang,
        wordCount: (p.extract || '').split(/\s+/).length,
      }))
      .filter((item) => item.extract.length > 30);
  } catch {
    return OFFLINE_FALLBACK_ARTICLES[lang];
  }
}

/**
 * Intelligent deterministic algorithmic quiz generator
 * Used as immediate fallback if server-side AI is offline or unavailable
 */
export function generateLocalQuizFromArticle(
  article: WikipediaArticleSummary,
  lang: 'en' | 'ta'
): WikipediaQuizQuestion[] {
  const title = article.title;
  const text = article.extract;
  const isTamil = lang === 'ta';

  // Split into meaningful sentences
  const sentences = text
    .split(/[.!?।]\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 35 && !s.includes('==='));

  const questions: WikipediaQuizQuestion[] = [];

  // Question 1: Core definition / Identity
  if (sentences.length > 0) {
    const firstSentence = sentences[0];
    const prompt = isTamil
      ? `விக்கிபீடியா கட்டுரையின்படி, "${title}" என்பதன் முதன்மை விளக்கம் அல்லது அடையாளம் என்ன?`
      : `According to the Wikipedia article, what is the primary definition or identity of "${title}"?`;

    // Create a concise summary of the first sentence as the correct answer
    const cleanFirst = firstSentence.length > 140 ? firstSentence.slice(0, 137) + '...' : firstSentence;

    const distractorsEn = [
      `A fictional character created in 20th-century literature without real-world application.`,
      `A specialized astronomical instrument used exclusively for deep space satellite telemetry.`,
      `An obsolete medieval calculation method superseded by modern differential calculus.`,
    ];

    const distractorsTa = [
      `20-ஆம் நூற்றாண்டில் புனையப்பட்ட ஒரு கற்பனைக் கதாபாத்திரம் மற்றும் இலக்கிய வடிவம்.`,
      `ஆழ்கடல் ஆராய்ச்சிக்காக மட்டுமே பயன்படுத்தப்படும் ஒரு பழங்கால அளவீட்டு முறை.`,
      `நவீன கணிதத்தால் முற்றிலும் கைவிடப்பட்ட ஒரு இடைக்கால கணக்கீட்டு கோட்பாடு.`,
    ];

    const options = [cleanFirst, ...(isTamil ? distractorsTa : distractorsEn)];
    // Shuffle options
    const shuffled = shuffleWithOptions(options, 0);

    questions.push({
      id: `wiki-q1-${article.pageid}-${Date.now()}`,
      question: prompt,
      options: shuffled.options,
      correctIndex: shuffled.correctIndex,
      explanation: isTamil
        ? `விக்கிபீடியா மூலக் கட்டுரை "${title}": "${firstSentence}"`
        : `Wikipedia Article Source "${title}": "${firstSentence}"`,
      cognitiveTip: isTamil
        ? `கட்டுரையின் தொடக்க வாக்கியத்தை கவனமாக வாசித்தால் முதன்மை அடையாளத்தை அறியலாம்.`
        : `Check the opening lead sentence of the Wikipedia article for the core definition.`,
      sourceArticle: title,
      sourceUrl: article.fullurl,
      lang,
    });
  }

  // Question 2: Detail / Key Fact
  if (sentences.length > 1) {
    const secondSentence = sentences[1];
    const prompt = isTamil
      ? `"${title}" பற்றிய விக்கிபீடியா குறிப்பில் குறிப்பிடப்பட்டுள்ள முக்கிய உண்மை எது?`
      : `Which of the following facts is specifically highlighted about "${title}"?`;

    const cleanSecond = secondSentence.length > 140 ? secondSentence.slice(0, 137) + '...' : secondSentence;

    const distractorsEn = [
      `It was originally discovered during the Apollo 11 lunar landing in July 1969.`,
      `It was definitively proven invalid by the Royal Society in late 19th century London.`,
      `It is an exclusive trademark owned by an international telecommunication consortium.`,
    ];

    const distractorsTa = [
      `இது ஜூலை 1969-இல் அப்பல்லோ 11 நிலவுப் பயணத்தின் போது முதன்முதலில் கண்டுபிடிக்கப்பட்டது.`,
      `19-ஆம் நூற்றாண்டின் இறுதியில் இலண்டன் ராயல் சொசைட்டியால் இது தவறானது என நிரூபிக்கப்பட்டது.`,
      `இது சர்வதேச தொலைத்தொடர்பு கூட்டமைப்பிற்கு மட்டுமே சொந்தமான பிரத்யேக வர்த்தக முத்திரை.`,
    ];

    const options = [cleanSecond, ...(isTamil ? distractorsTa : distractorsEn)];
    const shuffled = shuffleWithOptions(options, 0);

    questions.push({
      id: `wiki-q2-${article.pageid}-${Date.now()}`,
      question: prompt,
      options: shuffled.options,
      correctIndex: shuffled.correctIndex,
      explanation: isTamil
        ? `கட்டுரையின் விவரம்: "${secondSentence}"`
        : `Article detail: "${secondSentence}"`,
      cognitiveTip: isTamil
        ? `விக்கிபீடியாவின் வரலாற்று மற்றும் கோட்பாட்டு சூழலை உற்று நோக்குங்கள்.`
        : `Notice the factual dates, relationships, and context described in the article summary.`,
      sourceArticle: title,
      sourceUrl: article.fullurl,
      lang,
    });
  }

  // Question 3: Comprehension / True statement
  if (sentences.length > 2) {
    const thirdSentence = sentences[2];
    const prompt = isTamil
      ? `"${title}" தொடர்பான பின்வரும் கூற்றுகளில் விக்கிபீடியா ஆதாரத்துடன் பொருந்தும் கூற்று எது?`
      : `Regarding "${title}", which statement aligns directly with the official Wikipedia summary?`;

    const cleanThird = thirdSentence.length > 140 ? thirdSentence.slice(0, 137) + '...' : thirdSentence;

    const distractorsEn = [
      `It is currently illegal to study this subject under modern international maritime conventions.`,
      `It was entirely replaced by an alternate theory proposed in the early Roman Empire.`,
      `It has zero measurable impact on scientific, historical, or cultural development.`,
    ];

    const distractorsTa = [
      `நவீன சர்வதேச கடல்சார் சட்டங்களின் கீழ் இந்த தலைப்பைப் படிப்பது தடைசெய்யப்பட்டுள்ளது.`,
      `ரோமானியப் பேரரசின் தொடக்கத்தில் முன்மொழியப்பட்ட மற்றொரு கோட்பாட்டால் இது மாற்றப்பட்டது.`,
      `அறிவியல், வரலாறு அல்லது கலாச்சார வளர்ச்சியில் இதற்கு எந்தவொரு தாக்கமும் இல்லை.`,
    ];

    const options = [cleanThird, ...(isTamil ? distractorsTa : distractorsEn)];
    const shuffled = shuffleWithOptions(options, 0);

    questions.push({
      id: `wiki-q3-${article.pageid}-${Date.now()}`,
      question: prompt,
      options: shuffled.options,
      correctIndex: shuffled.correctIndex,
      explanation: isTamil
        ? `ஆதாரக் கூற்று: "${thirdSentence}"`
        : `Wikipedia verified statement: "${thirdSentence}"`,
      cognitiveTip: isTamil
        ? `அறிவியல் அல்லது வரலாற்று முக்கியத்துவத்தைக் குறிக்கும் பகுதியைக் கவனியுங்கள்.`
        : `Focus on the substantive evidence provided in the verified encyclopedia extract.`,
      sourceArticle: title,
      sourceUrl: article.fullurl,
      lang,
    });
  }

  return questions;
}

function shuffleWithOptions(options: string[], correctOriginalIndex: number): { options: string[]; correctIndex: number } {
  const correctItem = options[correctOriginalIndex];
  const shuffled = [...options];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const correctIndex = shuffled.indexOf(correctItem);
  return { options: shuffled, correctIndex };
}

/**
 * Creates Knowledge Challenge questions using Server AI (Gemini 3.8 Flash)
 * with graceful fallback to deterministic generator
 */
export async function createKnowledgeChallenge(
  article: WikipediaArticleSummary,
  lang: 'en' | 'ta' = 'en'
): Promise<WikipediaQuizQuestion[]> {
  try {
    const response = await fetch('/api/wikipedia/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: article.title,
        extract: article.extract,
        lang,
        fullurl: article.fullurl,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.questions) && data.questions.length >= 2) {
        return data.questions;
      }
    }
  } catch (err) {
    console.warn('Backend AI quiz generation unavailable, using local generator:', err);
  }

  return generateLocalQuizFromArticle(article, lang);
}
