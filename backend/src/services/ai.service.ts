import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const generatePreVisitSummary = async (symptoms: string) => {
  try {
    const prompt = `Analyse these symptoms and return: urgency level (Low / Medium / High), chief complaint, and three suggested questions for the doctor. Symptoms: ${symptoms}`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    // Parse the response to extract urgency level if needed, for simplicity we return text
    const summary = response.text || '';
    
    let urgencyLevel: 'Low' | 'Medium' | 'High' = 'Medium';
    if (summary.toLowerCase().includes('urgency level: high')) urgencyLevel = 'High';
    if (summary.toLowerCase().includes('urgency level: low')) urgencyLevel = 'Low';

    return { summary, urgencyLevel };
  } catch (error) {
    console.error('AI Pre-visit error:', error);
    // Graceful failure
    return {
      summary: `Failed to generate AI summary. Patient reported symptoms: ${symptoms}`,
      urgencyLevel: 'Medium' as const,
    };
  }
};

export const generatePostVisitSummary = async (notes: string) => {
  try {
    const prompt = `Convert these clinical notes into a patient-friendly summary with medication schedule and follow-up steps: ${notes}`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || 'No summary generated.';
  } catch (error) {
    console.error('AI Post-visit error:', error);
    // Graceful failure
    return `Doctor's Notes: ${notes}`;
  }
};
