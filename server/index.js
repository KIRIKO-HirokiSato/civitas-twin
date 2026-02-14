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

// Trust proxy for Cloud Run (behind load balancer)
app.set('trust proxy', true);

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
  validate: { trustProxy: false },
});
app.use('/api/', apiLimiter);

app.use(express.json({ limit: '1mb' }));

// Vertex AI client via @google/genai SDK (uses Application Default Credentials)
// IMPORTANT: Gemini 3 系モデルは global エンドポイントのみ対応
const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GCP_PROJECT || 'gen-lang-client-0491126700',
  location: 'global',  // Gemini 3 系は asia-northeast1 では利用不可
});

// API endpoint: Generate content
app.post('/api/generate', async (req, res) => {
  try {
    const { systemInstruction, contents, generationConfig } = req.body;

    if (!systemInstruction || !contents) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Ensure all content items have a role field (required by Vertex AI API)
    const normalizedContents = contents.map((item) => ({
      role: item.role || 'user',
      parts: item.parts,
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: normalizedContents,
      config: {
        systemInstruction,
        ...generationConfig,
      },
    });

    res.json({
      text: response.text || '',
      groundingUrls: response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.filter((chunk) => chunk.web)
        .map((chunk) => ({ title: chunk.web.title, uri: chunk.web.uri })) || []
    });
  } catch (error) {
    console.error('Vertex AI Error:', error);
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

    // Debug logging
    console.log('📩 Chat send request:', {
      hasSystemInstruction: !!systemInstruction,
      systemInstructionLength: systemInstruction?.length,
      historyLength: history?.length,
      messageType: typeof message,
      messageValue: message,
    });

    if (!systemInstruction || !message) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Validate message type
    if (typeof message !== 'string' && !Array.isArray(message)) {
      console.error('❌ Invalid message type:', typeof message, message);
      return res.status(400).json({ error: 'Message must be a string or array of parts' });
    }

    // Normalize history to ensure all items have role field and valid parts structure
    const normalizedHistory = (history || []).map((item) => {
      // Ensure parts is an array
      let parts = item.parts;
      if (!Array.isArray(parts)) {
        parts = typeof parts === 'string' ? [{ text: parts }] : [parts];
      }

      return {
        role: item.role || 'user',
        parts: parts,
      };
    });

    // Create chat session with @google/genai SDK
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction,
        temperature: 0.7,
      },
      history: normalizedHistory,
    });

    // sendMessage expects SendMessageParameters object with message property
    // message can be: string | Part | Part[]
    const response = await chat.sendMessage({ message });

    res.json({
      text: response.text || '',
      role: 'model'
    });
  } catch (error) {
    console.error('Chat Send Error:', error);
    // Log full error details for debugging
    if (error.response?.data) {
      console.error('API Error Details:', JSON.stringify(error.response.data, null, 2));
    }
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
  console.log(`🤖 Vertex AI (@google/genai): Project ${process.env.GCP_PROJECT || 'gen-lang-client-0491126700'}, Location global`);
});
