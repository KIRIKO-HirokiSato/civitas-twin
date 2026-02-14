import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

// ES Module で __dirname を使うための設定
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
const allowedOrigins = [
  'https://civitas-twin-902796884296.asia-northeast1.run.app',
];
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:3000', 'http://localhost:8080');
}
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', apiLimiter);

app.use(express.json({ limit: '1mb' }));

// Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// API endpoint: Generate content
app.post('/api/generate', async (req, res) => {
  try {
    const { systemInstruction, contents, generationConfig } = req.body;

    if (!systemInstruction || !contents) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Use ai.models.generateContent() API (same as frontend)
    const result = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents,
      config: {
        systemInstruction: typeof systemInstruction === 'string'
          ? { parts: [{ text: systemInstruction }] }
          : systemInstruction,
        ...generationConfig,
      },
    });

    const response = result;

    res.json({
      text: response.text || '',
      groundingUrls: response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.filter((chunk) => chunk.web)
        .map((chunk) => ({ title: chunk.web.title, uri: chunk.web.uri })) || []
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: 'Failed to generate content',
      ...(process.env.NODE_ENV !== 'production' && { details: error.message }),
    });
  }
});

// API endpoint: Start chat session
app.post('/api/chat/start', async (req, res) => {
  try {
    const { systemInstruction, history } = req.body;

    if (!systemInstruction) {
      return res.status(400).json({ error: 'Missing systemInstruction' });
    }

    // チャットセッションは状態を持つため、ここではシステム指示のみ返す
    // 実際のチャットはフロントエンドでセッションを管理する必要がある
    res.json({
      sessionId: Math.random().toString(36).substring(7),
      ready: true
    });
  } catch (error) {
    console.error('Chat Start Error:', error);
    res.status(500).json({
      error: 'Failed to start chat',
      ...(process.env.NODE_ENV !== 'production' && { details: error.message }),
    });
  }
});

// API endpoint: Send chat message
app.post('/api/chat/send', async (req, res) => {
  try {
    const { systemInstruction, history, message } = req.body;

    if (!systemInstruction || !message) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Create chat using ai.chats.create() API
    const chat = await ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: typeof systemInstruction === 'string'
          ? systemInstruction
          : systemInstruction,
        temperature: 0.7,
      },
    });

    // If history exists, restore it (simplified - history management should be improved)
    if (history && history.length > 0) {
      for (const msg of history) {
        // Skip for now - proper history management would need session storage
      }
    }

    const result = await chat.sendMessage(message);

    res.json({
      text: result.text || result.response?.text() || '',
      role: 'model'
    });
  } catch (error) {
    console.error('Chat Send Error:', error);
    res.status(500).json({
      error: 'Failed to send message',
      ...(process.env.NODE_ENV !== 'production' && { details: error.message }),
    });
  }
});

// 静的ファイルを配信（ビルド済みのフロントエンド）
app.use(express.static(path.join(__dirname, '../dist')));

// SPA用のフォールバック（全てのルートで index.html を返す）
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 API endpoint: http://0.0.0.0:${PORT}/api/generate`);
  console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? '✓ Loaded' : '✗ Missing'}`);
});
