import { GoogleGenAI } from "@google/genai";
import { Monster, SkillType } from "../types";

const extractUuid = (url: string): string | null => {
  // Matches standard UUIDv4 format
  const match = url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  return match ? match[0] : null;
};

interface MonsterGenParams {
  url1: string;
  title1: string;
  theme1: string;
  cover1: string;
  lyrics1: string;
  url2: string;
  title2: string;
  theme2: string;
  cover2: string;
  lyrics2: string;
}

export const generateMonsters = async (params: MonsterGenParams): Promise<Monster[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey });

  const id1 = extractUuid(params.url1);
  const id2 = extractUuid(params.url2);

  // Pre-calculate CDN links for fallbacks
  const cdnAudio1 = id1 ? `https://cdn1.suno.ai/${id1}.mp3` : '';
  const cdnImage1 = id1 ? `https://cdn1.suno.ai/image_${id1}.png` : '';
  
  const cdnAudio2 = id2 ? `https://cdn1.suno.ai/${id2}.mp3` : '';
  const cdnImage2 = id2 ? `https://cdn1.suno.ai/image_${id2}.png` : '';

  const prompt = `
    You are a Metadata Extractor and RPG Game Master.
    I have two Suno.com song links. I need you to create two RPG Monsters.

    --- INPUTS ---
    
    MONSTER 1:
    - URL: ${params.url1}
    - Manual Title: "${params.title1}"
    - Manual Theme: "${params.theme1}"
    - Manual Cover URL: "${params.cover1}"
    - Manual Lyrics: "${params.lyrics1 ? params.lyrics1.substring(0, 800).replace(/\n/g, ' ') : ''}..."
    - Detected UUID: ${id1 || 'None'}

    MONSTER 2:
    - URL: ${params.url2}
    - Manual Title: "${params.title2}"
    - Manual Theme: "${params.theme2}"
    - Manual Cover URL: "${params.cover2}"
    - Manual Lyrics: "${params.lyrics2 ? params.lyrics2.substring(0, 800).replace(/\n/g, ' ') : ''}..."
    - Detected UUID: ${id2 || 'None'}

    --- TASKS ---

    1. **Resolve Titles**: 
       - If "Manual Title" is provided, USE IT.
       - If not, perform a Google Search for the URL. 
       - If the URL is a short link (suno.com/s/...), the search result should reveal the full 'suno.com/song/UUID' link and the page title.
       - The Page Title usually looks like "Song Name by @Artist | Suno". Extract ONLY the "Song Name".
       - Example: "[SWK/EN] Locality (Get Ghosted) by @user | Suno" -> Name: "[SWK/EN] Locality (Get Ghosted)"

    2. **Resolve Covers**:
       - If "Manual Cover URL" is provided, USE IT.
       - If not, use the Google Search to see if a specific Image or Video URL appears in the snippets.
       - If the URL contains a UUID, the default cover is often 'https://cdn1.suno.ai/image_{UUID}.png'. Use this as a fallback.

    3. **Create Skills**:
       - Based on the Title, Theme, and especially the **Manual Lyrics** (if provided), create 3 skills (Attack, Defense, Ultimate).
       - If Lyrics are provided, quote or reference specific lines in the skill names or descriptions.
       - Make them thematic. If the song is "Requiem in Scarlet", skills might be "Blood Chorus" or "Crimson Note".
       - Ensure the skills reflect the "vibe" (e.g., Aggressive song = High Attack, Melancholy song = Life drain or Debuffs).

    4. **Generate Stats**:
       - HP (800-1500), Attack (60-150), Defense (40-120), Agility (10-100).
       - Total stats sum between the two monsters should be within 10% of each other.

    --- OUTPUT FORMAT (JSON) ---
    {
      "monsters": [
        {
          "name": "Final Song Title",
          "coverUrl": "Valid URL for Image or Video",
          "audioUrl": "Valid URL for MP3 (use https://cdn1.suno.ai/{UUID}.mp3 if UUID found)",
          "hp": 1000,
          "attack": 100,
          "defense": 100,
          "agility": 100,
          "skills": [
            {
              "name": "Skill Name",
              "type": "ATTACK",
              "description": "Short description",
              "power": 50,
              "effect": "fire",
              "cooldown": 2
            }
          ]
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    let text = response.text;
    if (!text) throw new Error("No response from Gemini");

    text = text.trim();
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const data = JSON.parse(text);
    
    return data.monsters.map((m: any, index: number) => {
      const existingId = index === 0 ? id1 : id2;
      const cdnImage = index === 0 ? cdnImage1 : cdnImage2;
      const cdnAudio = index === 0 ? cdnAudio1 : cdnAudio2;
      const manualCover = index === 0 ? params.cover1 : params.cover2;

      // Logic: Manual Cover > AI Found Cover > CDN Fallback > Placeholder
      let finalCover = manualCover;
      
      if (!finalCover && m.coverUrl && m.coverUrl.length > 10) {
        finalCover = m.coverUrl;
      }
      
      if (!finalCover && existingId) {
        finalCover = cdnImage;
      }

      let finalAudio = m.audioUrl;
      if ((!finalAudio || finalAudio.length < 10) && existingId) {
        finalAudio = cdnAudio;
      }

      return {
        id: `monster-${index}-${Date.now()}`,
        name: m.name || `Subject ${existingId?.substring(0,6) || 'Unknown'}`,
        songUrl: index === 0 ? params.url1 : params.url2,
        coverUrl: finalCover || '',
        audioUrl: finalAudio || '',
        maxHp: m.hp || 1000,
        currentHp: m.hp || 1000,
        attack: m.attack || 100,
        defense: m.defense || 50,
        agility: m.agility || 50,
        isDead: false,
        skills: m.skills.map((s: any) => ({
          ...s,
          currentCooldown: 0
        }))
      };
    });

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Failed to generate monsters. Please check the links or try again.");
  }
};