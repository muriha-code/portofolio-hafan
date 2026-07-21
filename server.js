import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize Google Gen AI
// Try to get API key from GEMINI_API_KEY or VITE_GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

let ai;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn("WARNING: Gemini API Key is missing. Chatbot will not function correctly.");
}

// Middleware
app.use(cors());
app.use(express.json());

// Rate Limiter: Max 50 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 50,
  message: { error: "Terlalu banyak permintaan, silakan coba lagi nanti." }
});
app.use('/api/chat', limiter);

app.post('/api/chat', async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({ error: "API Key Gemini belum dikonfigurasi di server." });
    }

    const { messages, contextData, settings } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format." });
    }

    if (!settings || !settings.enabled) {
      return res.status(403).json({ error: "Chatbot saat ini dinonaktifkan." });
    }

    // Construct the System Instruction
    let systemInstruction = settings.systemPrompt || "Anda adalah AI Assistant.";
    
    // Append context data
    systemInstruction += "\n\n=== KONTEKS DATA PORTFOLIO ===";
    systemInstruction += "\nGunakan data berikut untuk menjawab pertanyaan yang berkaitan dengan portfolio. Jangan pernah berasumsi jika data tidak ada di sini.\n";
    if (contextData) {
      if (contextData.currentTime) {
        systemInstruction += `\nWaktu Sistem Saat Ini: ${contextData.currentTime}`;
      }
      if (contextData.profile) systemInstruction += `\nProfil: ${JSON.stringify(contextData.profile)}`;
      if (contextData.skills) systemInstruction += `\nSkills: ${JSON.stringify(contextData.skills)}`;
      if (contextData.projects) systemInstruction += `\nProyek: ${JSON.stringify(contextData.projects)}`;
      if (contextData.experiences) systemInstruction += `\nPengalaman: ${JSON.stringify(contextData.experiences)}`;
      if (contextData.certificates) systemInstruction += `\nSertifikasi: ${JSON.stringify(contextData.certificates)}`;
      if (contextData.settings) systemInstruction += `\nKontak & Info: ${JSON.stringify(contextData.settings)}`;
    }

    // Append FAQs
    if (settings.faq && settings.faq.length > 0) {
      systemInstruction += "\n\n=== FAQ (Pertanyaan yang Sering Diajukan) ===";
      settings.faq.forEach((f) => {
        systemInstruction += `\nTanya: ${f.question}\nJawab: ${f.answer}\n`;
      });
    }

    // Append Blocked Topics strict instructions
    if (settings.blockedTopics && settings.blockedTopics.length > 0) {
      systemInstruction += "\n\n=== BATASAN & TOPIK TERLARANG ===";
      systemInstruction += "\nANDA DILARANG KERAS memberikan jawaban, instruksi, atau informasi apa pun yang berkaitan dengan topik-topik berikut:\n";
      settings.blockedTopics.forEach((topic) => {
        systemInstruction += `- ${topic}\n`;
      });
      systemInstruction += "\nJika pengguna menanyakan hal-hal di atas, tolak dengan sopan menggunakan pesan seperti 'Maaf, saya tidak dapat membantu permintaan tersebut. Silakan ajukan pertanyaan lain yang aman dan sesuai.' Jangan berikan penjelasan atau alasan lebih lanjut.";
    }

    // Convert messages to Gemini format
    // Gemini SDK expects { role: 'user' | 'model', parts: [{text: '...'}] }
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Start a chat session or generate content
    // We will use generateContent to pass history explicitly since we want to control system instructions easily
    const currentMessage = formattedMessages.pop();

    if (!currentMessage) {
       return res.status(400).json({ error: "Pesan kosong." });
    }

    let requestedModel = settings.model || 'gemini-3.1-flash-lite';
    if (requestedModel === 'gemini-1.5-flash' || requestedModel === 'gemini-1.5-pro') {
      requestedModel = 'gemini-3.1-flash-lite';
    }

    const response = await ai.models.generateContent({
      model: requestedModel,
      contents: [...formattedMessages, currentMessage],
      config: {
        systemInstruction: systemInstruction,
        temperature: settings.temperature !== undefined ? settings.temperature : 0.7,
        maxOutputTokens: settings.maxTokens || 800,
      }
    });

    if (response.text) {
      return res.json({ text: response.text });
    } else {
      return res.status(500).json({ error: "Gagal mendapatkan respons dari model." });
    }

  } catch (error) {
    console.error("\n=== [Chat API Error] ===");
    console.error("HTTP Status:", error.status || 500);
    console.error("Error Message:", error.message || error);
    if (error.details) console.error("Error Details:", JSON.stringify(error.details, null, 2));
    console.error("Stack Trace:", error.stack);
    console.error("========================\n");

    return res.status(error.status || 500).json({ 
      error: "Terjadi kesalahan internal pada server chat.",
      detail: {
        status: error.status || 500,
        message: error.message || String(error),
        name: error.name
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Backend API Server running on port ${port}`);
});
