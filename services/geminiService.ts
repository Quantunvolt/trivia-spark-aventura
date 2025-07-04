import { GoogleGenAI } from "@google/genai";
import { Question } from '../types';

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateTriviaQuestions = async (topic: string, count: number): Promise<Question[]> => {
  const prompt = `
    Genera ${count} preguntas de trivia únicas sobre el tema "${topic}".
    Cada pregunta debe tener 4 opciones de respuesta. Una de las opciones debe ser la respuesta correcta.
    Formatea la salida como un array de objetos JSON. No incluyas comas al final del último elemento en objetos o arrays.
    Cada objeto debe seguir esta estructura exacta:
    {
      "question": "Texto de la pregunta",
      "options": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
      "correctAnswer": "Texto de la respuesta correcta que coincide exactamente con una de las opciones"
    }
    El resultado final debe ser un único array JSON válido, sin texto introductorio, explicaciones ni bloques de código markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5,
      },
    });
    
    let jsonStr = response.text.trim();
    // Although we ask not to, sometimes the model still wraps the response.
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr);

    if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData.every(item => 'question' in item && 'options' in item && 'correctAnswer' in item)) {
      return parsedData as Question[];
    } else {
      console.error("Parsed data is not in the expected format or is empty:", parsedData);
      throw new Error("No se pudieron analizar las preguntas en el formato esperado o se recibió una lista vacía.");
    }

  } catch (error) {
    console.error("Error generating trivia questions:", error);
    // As a fallback, we can return some hardcoded questions or throw to be handled by the UI
    throw new Error("No se pudieron generar las preguntas de trivia.");
  }
};