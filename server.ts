import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.resolve(process.cwd());

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback cognitive coach when API key is not configured or in offline mode
function getFallbackCognitiveGuidance(prompt: string, context?: string, language: string = 'en'): string {
  const isTamil = language === 'ta';
  const query = prompt.toLowerCase();

  if (query.includes('memory') || query.includes('நினைவாற்றல்') || query.includes('matrix')) {
    if (isTamil) {
      return `🧠 **Sand.E IQ நினைவாற்றல் பயிற்சி வழிகாட்டி:**\n\n1. **பிரித்தல் முறை (Chunking):** கட்டங்களை தனித்தனி புள்ளிகளாகப் பார்க்காமல், 2-3 தொகுதிகளாக (வடிவங்கள் அல்லது கோடுகள்) குழுவாக்குங்கள்.\n2. **கண் நிலைநிறுத்தல்:** நடுப்பகுதியில் கவனம் செலுத்தி, வெளி விளிம்புகளின் ஒளிரும் புள்ளிகளை மனத்திரையில் பதித்துக் கொள்ளுங்கள்.\n3. **உடனடி நினைவுகூர்தல்:** ஒளி அணைந்ததும் 1 வினாடி அமைதியாக வடிவத்தை மீண்டும் மனதில் ஓடவிட்டு, பின்னர் தொடுங்கள்.`;
    }
    return `🧠 **Sand.E IQ Working Memory Strategy:**\n\n1. **Visual Chunking:** Group lit cyan nodes into geometrical shapes (triangles, L-shapes, or clusters) instead of memorizing isolated coordinates.\n2. **Center Anchoring:** Anchor your gaze near the center to capture peripheral flashes simultaneously.\n3. **Mental Replay:** Allow a 1-second pause after lights dim to solidify your mental snapshot before tapping.`;
  }

  if (query.includes('pattern') || query.includes('வரிசை') || query.includes('வடிவம்') || query.includes('matrix')) {
    if (isTamil) {
      return `🔷 **வடிவ தர்க்க பகுப்பாய்வு (Pattern Reasoning):**\n\n1. **வரிசை & நெடுவரிசை விதி:** வடிவங்கள் இடமிருந்து வலமாக மாறும் போது சுழற்சி (Rotation), எண்ணிக்கை (Count) அல்லது நிறம் எவ்வாறு மாறுகிறது என்பதைக் கவனியுங்கள்.\n2. **மாற்றத்தை நீக்குதல்:** பொருந்தாத விருப்பங்களை முதலில் நிராகரித்து, எஞ்சியவற்றைச் சரிபார்க்கவும்.\n3. **சமச்சீர்மை:** பல புதிர்களில் சுழற்சி 45° அல்லது 90° கடிகார திசையில் நகர்கிறது.`;
    }
    return `🔷 **Pattern & Spatial Reasoning Strategy:**\n\n1. **Rule Decomposition:** Scan rows and columns systematically for rotation (+45°/+90°), count shifts, or layer superposition (XOR/AND).\n2. **Feature Isolation:** Track one variable at a time (e.g., outer shape first, then inner symbol).\n3. **Elimination Tactic:** Rapidly discard options that violate the primary orientation rule.`;
  }

  if (query.includes('sequence') || query.includes('எண்') || query.includes('math')) {
    if (isTamil) {
      return `🔢 **எண் தொடர் உத்திகள் (Sequence Deduction):**\n\n1. **வித்தியாசங்களை சோதிக்கவும் (Delta Check):** அடுத்தடுத்த எண்களுக்கு இடையேயான வேறுபாடு நிலையானதா அல்லது பெருக்கலா (+2, +4, +8 அல்லது n²)?\n2. **மாற்றுத் தொடர்கள் (Alternating):** ஒற்றைப்படை மற்றும் இரட்டைப்படை இடங்களில் உள்ள எண்கள் தனித்தனி விதிகளில் இயங்கலாம்.\n3. **ஃபிபோனாச்சி தத்துவம்:** முந்தைய இரண்டு எண்களின் கூட்டல் அடுத்த எண்ணாக வரலாம்.`;
    }
    return `🔢 **Numerical & Sequence Solving Strategy:**\n\n1. **First & Second Differences:** Compute differences between consecutive terms; constant second differences indicate quadratic formulas (n²).\n2. **Alternating Sequences:** Separate odd-indexed and even-indexed positions to identify dual interleaved rules.\n3. **Recursive Combinations:** Check for additive recurrences like Fibonacci (aₙ = aₙ₋₁ + aₙ₋₂).`;
  }

  if (isTamil) {
    return `💡 **Sand.E IQ AI சிந்தனை வழிகாட்டி:**\n\n"${prompt}" பற்றிய விளக்கம்:\n\n- புதிரைத் தீர்க்க அமைதியான கவனம் தேவை. ஒவ்வொரு கேள்விக்கான விவரங்களையும் படியுங்கள்.\n- தவறான விடைகளை நீக்குவது சரியான விடையை விரைவாகக் கண்டறிய உதவும்.\n- Sand.E IQ மதிப்பெண்கள் உங்கள் அன்றாட மூளை சுறுசுறுப்பையும் கற்றலையும் அளவிடுகின்றன; தொடர் பயிற்சியே உயர் திறனை அளிக்கும்!`;
  }

  return `💡 **Sand.E IQ Cognitive Mentor:**\n\nRegarding: "${prompt}"\n\n- **Core Analytical Principle:** Break complex problems into atomic conditions. Identify what stays constant versus what transforms.\n- **Speed & Accuracy Balance:** Take the first 5 seconds to fully parse the question prompt before looking at the choices.\n- **Continuous Neuro-Training:** Consistent daily puzzle solves expand working memory and cognitive agility over time.`;
}

// Server-side AI Assistant Endpoint
app.post('/api/ai-assistant', async (req: Request, res: Response) => {
  try {
    const { prompt, context, language = 'en', difficulty = 'medium' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt is required and must be a string' });
      return;
    }

    if (aiClient) {
      try {
        const systemInstruction = `You are the official AI Learning Assistant & Brain Coach of "Sand.E IQ" (Tagline: "Challenge Your Mind").
Your role is to guide users to think analytically, explain cognitive logic, dissect puzzle solutions, and teach memory/reasoning strategies.
Language: The user requested responses in ${language === 'ta' ? 'Tamil (தமிழ்)' : 'English'}.
Guidelines:
- Explain correct answers clearly with step-by-step deductive logic.
- For hints, guide the user's thinking without immediately spoiling the final answer if they ask for a clue.
- Tone: Futuristic, encouraging, professional, sharp, and educational.
- Strict requirement: NEVER describe puzzle results or scores as clinically valid medical/psychometric IQ numbers. Frame all results as cognitive training exercise scores, brain-training indices, and neuro-agility benchmarks.
- Keep responses concise, structured, and easy to read on mobile or desktop screens. Use bullet points where appropriate.`;

        const userContent = context
          ? `Context: ${context}\n\nUser Question/Request: ${prompt}`
          : prompt;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userContent,
          config: {
            systemInstruction,
            temperature: 0.6,
          },
        });

        const reply = response.text || getFallbackCognitiveGuidance(prompt, context, language);
        res.json({ reply, source: 'gemini-api' });
        return;
      } catch (err: any) {
        console.warn('Gemini API call failed, falling back to local coach:', err?.message || err);
        const fallback = getFallbackCognitiveGuidance(prompt, context, language);
        res.json({ reply: fallback, source: 'local-fallback', note: 'Answer provided by Sand.E Cognitive Engine' });
        return;
      }
    }

    // No API key configured: provide instant local AI coach guidance
    const fallback = getFallbackCognitiveGuidance(prompt, context, language);
    res.json({ reply: fallback, source: 'local-fallback' });
  } catch (err: any) {
    console.error('AI assistant route error:', err);
    res.status(500).json({ error: 'Failed to generate guidance. Please try again.' });
  }
});

// Wikipedia Knowledge Challenge Quiz Generator Endpoint
app.post('/api/wikipedia/generate-quiz', async (req: Request, res: Response) => {
  try {
    const { title, extract, lang = 'en', fullurl } = req.body;
    if (!title || !extract || typeof title !== 'string' || typeof extract !== 'string') {
      res.status(400).json({ error: 'Title and extract are required' });
      return;
    }

    const isTamil = lang === 'ta';

    if (aiClient) {
      try {
        const prompt = `Based strictly on the following Wikipedia encyclopedia article:
Article Title: "${title}"
Article Content:
"""
${extract}
"""

Create 3 multiple-choice cognitive comprehension questions.
Language: ${isTamil ? 'Tamil (தமிழ்)' : 'English'}.
Requirements:
- Each question must test a factual detail, concept, discovery, or definition from the text.
- Provide 4 plausible options for each question.
- Specify the correctIndex (0, 1, 2, or 3).
- Provide a brief explanation verifying the answer from the Wikipedia text.
- Provide a short cognitive tip guiding analytical thinking.
Return strictly valid JSON array of objects with keys: "question", "options" (array of 4 strings), "correctIndex" (0-3), "explanation", "cognitiveTip".`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            temperature: 0.3,
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text || '';
        let parsed = JSON.parse(rawText);
        if (!Array.isArray(parsed) && Array.isArray((parsed as any).questions)) {
          parsed = (parsed as any).questions;
        }

        if (Array.isArray(parsed) && parsed.length >= 2) {
          const validatedQuestions = parsed.slice(0, 4).map((q: any, idx: number) => ({
            id: `wiki-ai-${idx}-${Date.now()}`,
            question: String(q.question || ''),
            options:
              Array.isArray(q.options) && q.options.length === 4
                ? q.options.map(String)
                : [
                    String(q.options?.[0] || 'Option A'),
                    String(q.options?.[1] || 'Option B'),
                    String(q.options?.[2] || 'Option C'),
                    String(q.options?.[3] || 'Option D'),
                  ],
            correctIndex:
              typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex <= 3
                ? q.correctIndex
                : 0,
            explanation: String(q.explanation || `Fact verified from Wikipedia article "${title}".`),
            cognitiveTip: String(
              q.cognitiveTip ||
                (isTamil ? 'கட்டுரையின் முக்கிய உண்மைகளைக் கவனியுங்கள்.' : 'Observe key factual details in the text.')
            ),
            sourceArticle: title,
            sourceUrl: fullurl || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
            lang,
          }));

          res.json({ questions: validatedQuestions, source: 'gemini-3.8-flash' });
          return;
        }
      } catch (aiErr) {
        console.warn('Gemini quiz generation failed, using local fallback:', aiErr);
      }
    }

    res.json({ questions: [], note: 'Using deterministic question generator fallback' });
  } catch (err: any) {
    console.error('Wikipedia quiz generator error:', err);
    res.status(500).json({ error: 'Failed generating quiz' });
  }
});


// In-memory data store for multiplayer rooms & admin management
interface MultiplayerPlayer {
  id: string;
  name: string;
  score: number;
  currentQIndex: number;
  lastActive: number;
  isHost: boolean;
}

interface MultiplayerRoom {
  code: string;
  hostId: string;
  status: 'lobby' | 'playing' | 'ended';
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  createdAt: number;
  startedAt?: number;
  players: Record<string, MultiplayerPlayer>;
  questionIds: string[];
}

const multiplayerRooms: Record<string, MultiplayerRoom> = {};

// Clean inactive rooms older than 3 hours
setInterval(() => {
  const now = Date.now();
  for (const code of Object.keys(multiplayerRooms)) {
    if (now - multiplayerRooms[code].createdAt > 3 * 3600 * 1000) {
      delete multiplayerRooms[code];
    }
  }
}, 60000);

// Admin in-memory mock store with audit log
interface AdminAuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  adminUser: string;
}

const adminAuditLogs: AdminAuditLog[] = [
  {
    id: 'log-init-1',
    action: 'SYSTEM_BOOT',
    details: 'Sand.E IQ Neural System & Question Registry initialized',
    timestamp: new Date().toISOString(),
    adminUser: 'superadmin',
  },
];

// Managed questions store (in-memory overlay for admin question management)
interface ManagedQuestion {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  title: string;
  titleTa: string;
  prompt: string;
  promptTa: string;
  options: { id: string; text: string; textTa: string; isCorrect: boolean }[];
  explanation: string;
  explanationTa: string;
  isPublished: boolean;
}

let managedQuestions: ManagedQuestion[] = [
  {
    id: 'custom-1',
    difficulty: 'easy',
    category: 'spatial',
    title: 'Clockwise Rotation Step',
    titleTa: 'கடிகார சுழற்சி படிநிலை',
    prompt: 'A dial rotates 45 degrees clockwise each tick. Starting at 12 o’clock, where is it after 4 ticks?',
    promptTa: 'ஒரு கடிகார முள் 45° சுழல்கிறது. 12 மணியிலிருந்து 4 சுழற்சிகளுக்குப் பிறகு எங்கு நிற்கும்?',
    options: [
      { id: 'opt-1', text: '6 o’clock (180°)', textTa: '6 மணி (180°)', isCorrect: true },
      { id: 'opt-2', text: '3 o’clock (90°)', textTa: '3 மணி (90°)', isCorrect: false },
      { id: 'opt-3', text: '9 o’clock (270°)', textTa: '9 மணி (270°)', isCorrect: false },
      { id: 'opt-4', text: '4 o’clock (120°)', textTa: '4 மணி (120°)', isCorrect: false },
    ],
    explanation: '4 ticks * 45° = 180° displacement, pointing directly opposite to 6 o’clock.',
    explanationTa: '4 x 45° = 180° சுழற்சி. எனவே 12-க்கு நேர் எதிரான 6 மணியைக் காட்டும்.',
    isPublished: true,
  },
];

// MULTIPLAYER ENDPOINTS
app.post('/api/multiplayer/create', (req: Request, res: Response) => {
  try {
    const { playerName, difficulty = 'easy', questionCount = 5 } = req.body;
    if (!playerName || typeof playerName !== 'string') {
      res.status(400).json({ error: 'Player name is required' });
      return;
    }

    // Generate random 5-character alphanumeric room code
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    const hostId = 'host-' + Date.now();

    const room: MultiplayerRoom = {
      code,
      hostId,
      status: 'lobby',
      difficulty: difficulty === 'medium' || difficulty === 'hard' ? difficulty : 'easy',
      questionCount: Math.max(3, Math.min(10, Number(questionCount) || 5)),
      createdAt: Date.now(),
      players: {
        [hostId]: {
          id: hostId,
          name: playerName.trim().substring(0, 20),
          score: 0,
          currentQIndex: 0,
          lastActive: Date.now(),
          isHost: true,
        },
      },
      questionIds: [],
    };

    multiplayerRooms[code] = room;
    res.json({ success: true, roomCode: code, playerId: hostId, isHost: true });
  } catch (err) {
    console.error('Multiplayer create error:', err);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

app.post('/api/multiplayer/join', (req: Request, res: Response) => {
  try {
    const { roomCode, playerName } = req.body;
    if (!roomCode || typeof roomCode !== 'string') {
      res.status(400).json({ error: 'Valid room code required' });
      return;
    }
    const cleanCode = roomCode.trim().toUpperCase();
    const room = multiplayerRooms[cleanCode];

    if (!room) {
      res.status(404).json({ error: 'Room not found. Check the room code and try again.' });
      return;
    }

    if (room.status === 'ended') {
      res.status(400).json({ error: 'This match has already ended.' });
      return;
    }

    const playerId = 'player-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
    room.players[playerId] = {
      id: playerId,
      name: (playerName || 'Challenger').trim().substring(0, 20),
      score: 0,
      currentQIndex: 0,
      lastActive: Date.now(),
      isHost: false,
    };

    res.json({ success: true, roomCode: cleanCode, playerId, isHost: false });
  } catch (err) {
    console.error('Multiplayer join error:', err);
    res.status(500).json({ error: 'Failed to join room' });
  }
});

app.get('/api/multiplayer/room/:code', (req: Request, res: Response) => {
  try {
    const cleanCode = req.params.code.trim().toUpperCase();
    const room = multiplayerRooms[cleanCode];
    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }
    res.json({
      code: room.code,
      status: room.status,
      difficulty: room.difficulty,
      questionCount: room.questionCount,
      hostId: room.hostId,
      players: Object.values(room.players),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed reading room status' });
  }
});

app.post('/api/multiplayer/room/:code/start', (req: Request, res: Response) => {
  try {
    const cleanCode = req.params.code.trim().toUpperCase();
    const { playerId } = req.body;
    const room = multiplayerRooms[cleanCode];
    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }
    if (room.hostId !== playerId) {
      res.status(403).json({ error: 'Only the room host can start the challenge.' });
      return;
    }

    room.status = 'playing';
    room.startedAt = Date.now();
    res.json({ success: true, status: room.status });
  } catch (err) {
    res.status(500).json({ error: 'Failed starting match' });
  }
});

app.post('/api/multiplayer/room/:code/score', (req: Request, res: Response) => {
  try {
    const cleanCode = req.params.code.trim().toUpperCase();
    const { playerId, points, nextQIndex } = req.body;
    const room = multiplayerRooms[cleanCode];
    if (!room || !room.players[playerId]) {
      res.status(404).json({ error: 'Room or player not found' });
      return;
    }

    const player = room.players[playerId];
    player.score += Math.max(0, Math.min(2500, Number(points) || 0));
    player.currentQIndex = Math.max(player.currentQIndex, Number(nextQIndex) || player.currentQIndex);
    player.lastActive = Date.now();

    // If all players completed all questions, set status to ended
    const allDone = Object.values(room.players).every((p) => p.currentQIndex >= room.questionCount);
    if (allDone) {
      room.status = 'ended';
    }

    res.json({ success: true, score: player.score, status: room.status });
  } catch (err) {
    res.status(500).json({ error: 'Failed updating score' });
  }
});

// ADMIN API ENDPOINTS (Protected with secure server token verification)
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'sande_iq_admin_2026_secure';

function checkAdminAuth(req: Request, res: Response): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
    return false;
  }
  const token = authHeader.split(' ')[1];
  if (token !== ADMIN_SECRET_KEY) {
    res.status(403).json({ error: 'Forbidden: Invalid administrator credentials' });
    return false;
  }
  return true;
}

app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  // Secure server-side credential verification (superadmin / admin)
  if (username === 'admin' && (password === 'sande_iq_master' || password === ADMIN_SECRET_KEY)) {
    adminAuditLogs.push({
      id: 'log-' + Date.now(),
      action: 'ADMIN_LOGIN_SUCCESS',
      details: `Administrator '${username}' logged in successfully`,
      timestamp: new Date().toISOString(),
      adminUser: username,
    });
    res.json({ success: true, token: ADMIN_SECRET_KEY, username: 'admin', role: 'Super Administrator' });
  } else {
    adminAuditLogs.push({
      id: 'log-' + Date.now(),
      action: 'ADMIN_LOGIN_FAILED',
      details: `Failed authentication attempt for username '${username}'`,
      timestamp: new Date().toISOString(),
      adminUser: 'anonymous',
    });
    res.status(401).json({ error: 'Invalid administrator username or password' });
  }
});

app.get('/api/admin/stats', (req: Request, res: Response) => {
  if (!checkAdminAuth(req, res)) return;
  res.json({
    activeRooms: Object.keys(multiplayerRooms).length,
    totalManagedQuestions: managedQuestions.length,
    auditLogsCount: adminAuditLogs.length,
    systemUptimeSeconds: Math.floor(process.uptime()),
    engineStatus: 'Sand.E IQ Neural Engine Operational',
    aiStatus: Boolean(aiClient) ? 'Gemini 3.8 Flash Online' : 'Sand.E Local Cognitive Engine Active',
  });
});

app.get('/api/admin/questions', (req: Request, res: Response) => {
  if (!checkAdminAuth(req, res)) return;
  res.json({ questions: managedQuestions });
});

app.post('/api/admin/questions', (req: Request, res: Response) => {
  if (!checkAdminAuth(req, res)) return;
  const { difficulty, category, title, titleTa, prompt, promptTa, options, explanation, explanationTa } = req.body;

  if (!title || !prompt || !Array.isArray(options) || options.length < 2) {
    res.status(400).json({ error: 'Question requires title, prompt, and at least 2 options' });
    return;
  }

  const newQ: ManagedQuestion = {
    id: 'q-' + Date.now(),
    difficulty: difficulty || 'easy',
    category: category || 'general',
    title,
    titleTa: titleTa || title,
    prompt,
    promptTa: promptTa || prompt,
    options,
    explanation: explanation || 'Standard analytical deductive explanation.',
    explanationTa: explanationTa || explanation || 'தர்க்கரீதியான முழு விளக்கம்.',
    isPublished: true,
  };

  managedQuestions.push(newQ);
  adminAuditLogs.push({
    id: 'log-' + Date.now(),
    action: 'CREATE_QUESTION',
    details: `Added new question: "${title}" (${difficulty})`,
    timestamp: new Date().toISOString(),
    adminUser: 'admin',
  });

  res.json({ success: true, question: newQ });
});

app.delete('/api/admin/questions/:id', (req: Request, res: Response) => {
  if (!checkAdminAuth(req, res)) return;
  const { id } = req.params;
  const idx = managedQuestions.findIndex((q) => q.id === id);
  if (idx === -1) {
    res.status(404).json({ error: 'Question not found' });
    return;
  }
  const deleted = managedQuestions.splice(idx, 1)[0];
  adminAuditLogs.push({
    id: 'log-' + Date.now(),
    action: 'DELETE_QUESTION',
    details: `Deleted question ID ${id}: "${deleted.title}"`,
    timestamp: new Date().toISOString(),
    adminUser: 'admin',
  });
  res.json({ success: true, deletedId: id });
});

app.get('/api/admin/audit-logs', (req: Request, res: Response) => {
  if (!checkAdminAuth(req, res)) return;
  res.json({ logs: adminAuditLogs.slice(-50).reverse() });
});

// -------------------------------------------------------------
// GLOBAL LEADERBOARD & SERVER PERSISTENCE (Feature 3)
// -------------------------------------------------------------
interface ServerLeaderboardEntry {
  id: string;
  playerName: string;
  mode: string;
  difficulty: string;
  score: number;
  iqEstimate: number;
  timeSeconds: number;
  accuracy: number;
  date: string;
}

const serverLeaderboard: ServerLeaderboardEntry[] = [
  {
    id: 'seed-1',
    playerName: 'Arunan S (Founder)',
    mode: 'quiz',
    difficulty: 'hard',
    score: 6850,
    iqEstimate: 144,
    timeSeconds: 42,
    accuracy: 100,
    date: new Date().toISOString(),
  },
  {
    id: 'seed-2',
    playerName: 'Sand.E Master',
    mode: 'braingames',
    difficulty: 'hard',
    score: 5920,
    iqEstimate: 139,
    timeSeconds: 50,
    accuracy: 96,
    date: new Date().toISOString(),
  },
  {
    id: 'seed-3',
    playerName: 'Logic Cadet',
    mode: 'quiz',
    difficulty: 'medium',
    score: 4200,
    iqEstimate: 122,
    timeSeconds: 65,
    accuracy: 90,
    date: new Date().toISOString(),
  },
];

app.get('/api/leaderboard', (req: Request, res: Response) => {
  try {
    const { mode, difficulty, limit = 50 } = req.query;
    let list = [...serverLeaderboard];

    if (mode && typeof mode === 'string' && mode !== 'all') {
      list = list.filter((e) => e.mode === mode);
    }
    if (difficulty && typeof difficulty === 'string' && difficulty !== 'all') {
      list = list.filter((e) => e.difficulty === difficulty);
    }

    list.sort((a, b) => b.score - a.score);
    res.json({
      success: true,
      entries: list.slice(0, Math.min(100, Number(limit) || 50)),
      total: list.length,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed fetching leaderboard' });
  }
});

app.post('/api/leaderboard', (req: Request, res: Response) => {
  try {
    const { playerName, mode, difficulty, score, iqEstimate, timeSeconds, accuracy } = req.body;
    if (!playerName || typeof score !== 'number') {
      res.status(400).json({ error: 'Invalid score payload' });
      return;
    }

    // Server-side validation: prevent unrealistic scores
    const cleanScore = Math.max(0, Math.min(15000, Number(score) || 0));
    const cleanAccuracy = Math.max(0, Math.min(100, Number(accuracy) || 0));
    const cleanTime = Math.max(1, Math.min(3600, Number(timeSeconds) || 30));
    const cleanIQ = Math.max(70, Math.min(160, Number(iqEstimate) || 100));

    const newEntry: ServerLeaderboardEntry = {
      id: 'glb-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      playerName: String(playerName).trim().substring(0, 24) || 'Challenger',
      mode: String(mode || 'quiz'),
      difficulty: String(difficulty || 'easy'),
      score: cleanScore,
      iqEstimate: cleanIQ,
      timeSeconds: cleanTime,
      accuracy: cleanAccuracy,
      date: new Date().toISOString(),
    };

    serverLeaderboard.push(newEntry);
    serverLeaderboard.sort((a, b) => b.score - a.score);
    if (serverLeaderboard.length > 250) {
      serverLeaderboard.length = 250;
    }

    const rank = serverLeaderboard.findIndex((e) => e.id === newEntry.id) + 1;
    res.json({ success: true, entry: newEntry, rank });
  } catch (err) {
    res.status(500).json({ error: 'Failed submitting score' });
  }
});

// -------------------------------------------------------------
// DAILY TOURNAMENTS (Feature 13)
// -------------------------------------------------------------
interface ServerTournamentEntry {
  id: string;
  tournamentDate: string;
  playerName: string;
  score: number;
  timeSeconds: number;
  accuracy: number;
  submittedAt: string;
}

const dailyTournaments: Record<string, ServerTournamentEntry[]> = {
  [new Date().toISOString().split('T')[0]]: [
    {
      id: 'tourn-seed-1',
      tournamentDate: new Date().toISOString().split('T')[0],
      playerName: 'Arunan S',
      score: 5400,
      timeSeconds: 38,
      accuracy: 100,
      submittedAt: new Date().toISOString(),
    },
    {
      id: 'tourn-seed-2',
      tournamentDate: new Date().toISOString().split('T')[0],
      playerName: 'Sand.E Master',
      score: 4850,
      timeSeconds: 45,
      accuracy: 92,
      submittedAt: new Date().toISOString(),
    },
  ],
};

app.get('/api/tournaments/today', (_req: Request, res: Response) => {
  const today = new Date().toISOString().split('T')[0];
  const entries = dailyTournaments[today] || [];
  entries.sort((a, b) => b.score - a.score);

  res.json({
    success: true,
    date: today,
    tournamentTitle: 'Sand.E IQ Daily Cognitive Open',
    tournamentTitleTa: 'சாண்ட்.இ IQ அன்றாட தர்க்கப் போட்டி',
    entries: entries.map((e, idx) => ({ ...e, rank: idx + 1 })),
    totalParticipants: entries.length,
    rules: [
      'Standardized 5-question cognitive challenge',
      'Fastest accurate responses receive time multipliers',
      'One official entry per player per day',
    ],
  });
});

app.post('/api/tournaments/submit', (req: Request, res: Response) => {
  try {
    const { playerName, score, timeSeconds, accuracy } = req.body;
    const today = new Date().toISOString().split('T')[0];

    if (!playerName || typeof score !== 'number') {
      res.status(400).json({ error: 'Invalid tournament payload' });
      return;
    }

    if (!dailyTournaments[today]) {
      dailyTournaments[today] = [];
    }

    const cleanScore = Math.max(0, Math.min(10000, Number(score) || 0));
    const newEntry: ServerTournamentEntry = {
      id: 'tentry-' + Date.now(),
      tournamentDate: today,
      playerName: String(playerName).trim().substring(0, 24) || 'Contender',
      score: cleanScore,
      timeSeconds: Math.max(1, Number(timeSeconds) || 30),
      accuracy: Math.max(0, Math.min(100, Number(accuracy) || 0)),
      submittedAt: new Date().toISOString(),
    };

    dailyTournaments[today].push(newEntry);
    dailyTournaments[today].sort((a, b) => b.score - a.score);

    const rank = dailyTournaments[today].findIndex((e) => e.id === newEntry.id) + 1;
    res.json({ success: true, rank, total: dailyTournaments[today].length, entry: newEntry });
  } catch (err) {
    res.status(500).json({ error: 'Failed submitting tournament score' });
  }
});

// -------------------------------------------------------------
// QUESTION OF THE DAY (Feature 5)
// -------------------------------------------------------------
const DAILY_QOTD_LIST = [
  {
    id: 'qotd-1',
    category: 'spatial',
    title: 'Cube Face Projection',
    titleTa: 'கனசதுர பக்கக் காட்சி',
    prompt: 'A 3x3x3 wooden cube is painted neon cyan on all outer faces, then cut into 27 unit cubes. How many small cubes have EXACTLY TWO painted faces?',
    promptTa: 'ஒரு 3x3x3 மரக் கனசதுரத்தின் வெளிப்பகுதிகள் அனைத்தும் சியான் வண்ணம் பூசப்பட்டு, 27 சிறிய துண்டுகளாக வெட்டப்படுகின்றன. சரியாக இரண்டு முகங்களில் மட்டுமே வண்ணம் உள்ள சிறிய கனசதுரங்கள் எத்தனை?',
    options: [
      { id: 'opt-1', text: '12 unit cubes', textTa: '12 சிறிய கனசதுரங்கள்', isCorrect: true },
      { id: 'opt-2', text: '8 unit cubes', textTa: '8 சிறிய கனசதுரங்கள்', isCorrect: false },
      { id: 'opt-3', text: '6 unit cubes', textTa: '6 சிறிய கனசதுரங்கள்', isCorrect: false },
      { id: 'opt-4', text: '16 unit cubes', textTa: '16 சிறிய கனசதுரங்கள்', isCorrect: false },
    ],
    explanation: 'A cube has 12 edges. On each edge of length 3, exactly 1 cube (the middle edge piece) has 2 painted faces. 12 edges * 1 = 12 cubes.',
    explanationTa: 'ஒரு கனசதுரத்திற்கு 12 விளிம்புகள் உள்ளன. 3 நீளமுள்ள ஒவ்வொரு விளிம்பின் நடுவில் உள்ள 1 சிறிய கனசதுரத்திற்கு மட்டுமே 2 முகங்கள் வண்ணமாக இருக்கும். 12 x 1 = 12.',
    bonusXP: 150,
  },
  {
    id: 'qotd-2',
    category: 'logic',
    title: 'Dual Statement Deduction',
    titleTa: 'இரட்டை கூற்று தர்க்கம்',
    prompt: 'Statement: "All cognitive masters practice daily. Some daily practitioners solve puzzles in under 30 seconds." Which conclusion follows logically?',
    promptTa: 'கூற்று: "அனைத்து அறிவுத்திறன் வல்லுநர்களும் தினமும் பயிற்சி செய்கிறார்கள். தினசரி பயிற்சி செய்பவர்களில் சிலர் 30 வினாடிகளுக்குள் புதிர்களைத் தீர்க்கிறார்கள்." தர்க்கரீதியாக எது சரியானது?',
    options: [
      { id: 'opt-1', text: 'Some who practice daily have sharp speed', textTa: 'தினசரி பயிற்சி செய்பவர்களில் சிலர் விரைவான வேகம் கொண்டுள்ளனர்', isCorrect: true },
      { id: 'opt-2', text: 'All cognitive masters solve in under 30 seconds', textTa: 'அனைத்து வல்லுநர்களும் 30 வினாடிக்குள் தீர்ப்பார்கள்', isCorrect: false },
      { id: 'opt-3', text: 'No beginner can practice daily', textTa: 'ஆரம்பநிலையாளர்கள் தினமும் பயிற்சி செய்ய முடியாது', isCorrect: false },
      { id: 'opt-4', text: 'Speed alone creates cognitive mastery', textTa: 'வேகம் மட்டுமே திறமையை உருவாக்கும்', isCorrect: false },
    ],
    explanation: 'The statement directly asserts that some daily practitioners solve in under 30s. We cannot deduce that all cognitive masters share this speed.',
    explanationTa: 'கூற்று நேரடியாகவே தினசரி பயிற்சி செய்பவர்களில் சிலர் வேகத்தைக் கொண்டுள்ளனர் என்று கூறுகிறது.',
    bonusXP: 150,
  },
];

app.get('/api/qotd', (_req: Request, res: Response) => {
  const today = new Date().toISOString().split('T')[0];
  const dayIndex = Math.abs(today.split('-').reduce((acc, part) => acc + Number(part), 0)) % DAILY_QOTD_LIST.length;
  const qotd = DAILY_QOTD_LIST[dayIndex];
  res.json({
    success: true,
    date: today,
    question: qotd,
  });
});


// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'Sand.E IQ',
    aiAvailable: Boolean(aiClient),
    multiplayerRooms: Object.keys(multiplayerRooms).length,
  });
});

// Google Search Console Site Verification Endpoints
app.get('/google9a64c3917c376658.html', (_req: Request, res: Response) => {
  res.type('text/html').send('google-site-verification: google9a64c3917c376658.html');
});
app.get('/googlewwU80KNQRZ1W6t5H8GnTR3ESzzIVVSFYViLUFbry6QA.html', (_req: Request, res: Response) => {
  res.type('text/html').send('google-site-verification: googlewwU80KNQRZ1W6t5H8GnTR3ESzzIVVSFYViLUFbry6QA.html');
});
app.get('/wwU80KNQRZ1W6t5H8GnTR3ESzzIVVSFYViLUFbry6QA.html', (_req: Request, res: Response) => {
  res.type('text/html').send('google-site-verification: wwU80KNQRZ1W6t5H8GnTR3ESzzIVVSFYViLUFbry6QA');
});
app.get('/google6BRV8Aa1gz6CBhQ91beDXUgtEGlAIzfC0qHwW8IQxms.html', (_req: Request, res: Response) => {
  res.type('text/html').send('google-site-verification: google6BRV8Aa1gz6CBhQ91beDXUgtEGlAIzfC0qHwW8IQxms.html');
});
app.get('/6BRV8Aa1gz6CBhQ91beDXUgtEGlAIzfC0qHwW8IQxms.html', (_req: Request, res: Response) => {
  res.type('text/html').send('google-site-verification: 6BRV8Aa1gz6CBhQ91beDXUgtEGlAIzfC0qHwW8IQxms');
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sand.E IQ dev server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});
