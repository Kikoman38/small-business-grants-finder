import { GoogleGenAI } from "@google/genai";
import { Grant, Article } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


export async function fetchGrants(state: string): Promise<{ grants: Grant[]; sources: Article[] }> {
    const prompt = `
      Your task is to act as a research assistant for a small business owner in ${state}, USA.
      Find currently active small business grants. You must include:
      1. Federal grants available nationwide.
      2. Grants specific to the state of ${state}.
      
      Return your findings as a JSON array of objects. Each object must represent a distinct grant program.
      The JSON structure for each object is:
      {
        "name": "The official name of the grant.",
        "description": "A brief, one to two sentence summary of the grant's purpose.",
        "type": "Must be one of: 'Federal', 'State', 'Corporate', 'Other'. Classify correctly based on the funding source.",
        "awardAmount": "The award amount or range, if specified (e.g., '$10,000').",
        "eligibility": "A concise summary of key eligibility requirements.",
        "deadline": "The application deadline, if specified (e.g., 'October 31, 2024' or 'Varies').",
        "website": "A direct URL to the grant application or information page."
      }
      
      IMPORTANT RULES:
      - Base your information on up-to-date search results.
      - Do NOT include expired grants or programs that are no longer accepting applications.
      - Ensure the 'website' URL is a direct and valid link.
      - Provide ONLY the raw JSON array in your response. Do not include any other text, markdown formatting (like \`\`\`json), or explanations.
    `;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
  
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const sources: Article[] = [];
      if (groundingChunks) {
          const uniqueUrls = new Set<string>();
          groundingChunks.forEach(chunk => {
            if (chunk.web && chunk.web.uri && chunk.web.title) {
                if (!uniqueUrls.has(chunk.web.uri)) {
                    uniqueUrls.add(chunk.web.uri);
                    sources.push({ url: chunk.web.uri, title: chunk.web.title });
                }
            }
          });
      }
  
      let jsonText = response.text.trim();
      if (!jsonText) {
        console.error("Gemini API returned an empty response.");
        return { grants: [], sources: [] };
      }
      
      // Defensively remove markdown code block in case the model includes it
      jsonText = jsonText.replace(/^```json\s*|```$/g, '');
  
      const grants = JSON.parse(jsonText);
      return { grants: grants as Grant[], sources };
  
    } catch (error) {
      console.error("Error fetching or parsing grants from Gemini API:", error);
      throw new Error("Failed to process data from the Gemini API. The response may not be valid JSON.");
    }
  }

export async function fetchStateNews(state: string): Promise<Article[]> {
  const prompt = `
    Find recent news articles about small business grants, funding opportunities, or economic programs in ${state}.
    Focus on official announcements, reputable news sources, and new program launches from the last month.
    Provide a list of these web pages.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    if (!groundingChunks || groundingChunks.length === 0) {
      console.warn(`Gemini API returned no grounding chunks for ${state} news query.`);
      return [];
    }

    const uniqueArticles = new Map<string, string>();
    groundingChunks.forEach(chunk => {
      if (chunk.web && chunk.web.uri && chunk.web.title) {
          if (!uniqueArticles.has(chunk.web.uri)) {
              uniqueArticles.set(chunk.web.uri, chunk.web.title);
          }
      }
    });

    const articles: Article[] = Array.from(uniqueArticles.entries()).map(([url, title]) => ({
      url,
      title,
    }));

    return articles.slice(0, 5); // Return up to 5 articles for the feed
  } catch (error) {
    console.error(`Error fetching ${state} news from Gemini API:`, error);
    throw new Error(`Failed to fetch ${state} news using the Gemini API.`);
  }
}
