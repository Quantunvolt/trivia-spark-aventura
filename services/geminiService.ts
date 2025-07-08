import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Question } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // Las directrices indican que la API_KEY siempre estará disponible.
  // Si no lo está, un error claro aquí ayuda a diagnosticar problemas de configuración.
  console.error("La variable de entorno API_KEY de Gemini no está configurada.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
const model = 'gemini-2.5-flash';

export const generateTriviaQuestions = async (topic: string, count: number): Promise<Question[]> => {
    const prompt = `
    Genera ${count} preguntas de trivia sobre "${topic}".
    Las preguntas deben estar en español. La dificultad debe ser media.
    La respuesta debe ser un array JSON válido de objetos. No incluyas texto, frases introductorias o marcadores de markdown como \`\`\`json\`\`\` fuera del array JSON. La salida debe ser directamente parseable como JSON.

    Cada objeto en el array debe tener estas propiedades:
    - "question": Un string con el texto de la pregunta.
    - "options": Un array de exactamente 4 strings con las posibles respuestas.
    - "correctAnswer": Un string que sea una coincidencia exacta con una de las opciones.

    Ejemplo de un array con una pregunta:
    [
      {
        "question": "¿Cuál es la capital de Francia?",
        "options": ["Berlín", "Madrid", "París", "Roma"],
        "correctAnswer": "París"
      }
    ]
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                temperature: 0.7,
            },
        });

        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
          jsonStr = match[2].trim();
        }

        const parsedData = JSON.parse(jsonStr);

        if (!Array.isArray(parsedData) || parsedData.length === 0 || typeof parsedData[0].question !== 'string') {
            throw new Error('La API devolvió datos con una estructura inválida.');
        }

        return parsedData as Question[];

    } catch (e) {
        console.error("Fallo al generar o parsear las preguntas de trivia:", e);
        if (e instanceof Error && e.message.includes('API key not valid')) {
             throw new Error("La clave de API de Gemini no es válida. Revisa la configuración.");
        }
        if (e instanceof SyntaxError) {
             throw new Error("El modelo generó una respuesta JSON inválida. Por favor, intenta de nuevo.");
        }
        throw new Error("No se pudieron generar las preguntas. Inténtalo de nuevo más tarde.");
    }
};