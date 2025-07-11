import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Carrega variáveis do .env
dotenv.config();

const app = express();
app.use(express.json());

// Variáveis de ambiente
const API_KEY = process.env.X_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Inicializa Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Endpoint principal
app.post("/api/gemini", async (req, res) => {
  const userKey = req.headers["x-api-key"];

  // Verifica a chave
  if (userKey !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(message);
    const response = result.response;
    const answer = response.text();

    return res.json({ response: answer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Gemini API error" });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API rodando na porta ${PORT}`);
});
