import { GoogleGenAI } from "@google/genai";
import { Trait } from "../types";
import { BACKGROUNDS, DECALS, ACCESSORIES, EASTER_EGGS } from "../constants";

const getRandomTrait = (list: any[]) => {
  return list[Math.floor(Math.random() * list.length)];
};

export const generateTraits = (mode: 'common' | 'legendary') => {
  const traits: Trait[] = [
    { name: 'Background', ...getRandomTrait(BACKGROUNDS) },
    { name: 'Decals', ...getRandomTrait(DECALS) },
    { name: 'Accessories', ...getRandomTrait(ACCESSORIES) },
  ];

  if (mode === 'legendary') {
    traits.push({ name: 'Easter Egg', ...getRandomTrait(EASTER_EGGS) });
  } else {
    traits.push({ name: 'Easter Egg', value: 'None', rarity: 'Common' });
  }

  return traits;
};

export const generateNFTWithAI = async (traits: Trait[], mode: 'common' | 'legendary') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY });
  
  const traitDescription = traits
    .filter(t => mode === 'legendary' || t.name !== 'Easter Egg')
    .map(t => `${t.name}: ${t.value}`)
    .join(', ');

  // 1. Get a descriptive keyword from Gemini
  const keywordResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: [{ text: `Based on these traits for a 42 Twingo NFT: ${traitDescription}, provide a single, cool, technical-sounding adjective or keyword (like 'Stealth', 'Overclocked', 'Glitch', 'Cyber', 'Neon') that summarizes the vibe. Return ONLY the word.` }] }],
  });
  const descriptionKeyword = keywordResponse.text?.trim().replace(/[\[\]]/g, '') || 'Standard';

  let prompt = '';
  if (mode === 'common') {
    prompt = `
      A procedurally generated Renault Twingo 1. Low-angle front three-quarters view, oriented towards the front-right. The car's smiling front face and headlights are prominent, with the body receding into perspective towards the back-left.
      The car has a smooth, factory-clean body that serves as a canvas. It keeps its iconic playful "cartoon" pudgy form and bold line weights.
      The number '42' is subtly and cleanly integrated as a technical decal on the side of the car.
      Applied Traits: ${traitDescription}.
      Vibe: ${descriptionKeyword}.
      Art style: High-quality Flat Vector Art with technical depth. Focus on clean execution where each trait is clearly visible against the solid bodywork. The image should look like a premium, polished NFT asset.
    `;
  } else {
    prompt = `
      A procedurally generated Renault Twingo 1. Low-angle front three-quarters view, oriented towards the front-right. The car's smiling front face and headlights are prominent, with the body receding into perspective towards the back-left.
      This is a ONE-OF-A-KIND LEGENDARY EDITION, a unique masterpiece of the collection. It keeps its iconic playful "cartoon" pudgy form, but the entire design is elevated to an epic level.
      The number '42' is featured prominently and artistically, integrated into the theme (e.g., glowing neon, metallic engraving, holographic display)
      Applied Traits: ${traitDescription}.
      Vibe: ${descriptionKeyword}.
      Art style: High-quality Flat Vector Art. The visual execution must fully embrace and amplify the specific theme of the EASTER EGG trait. The entire vibe of the car, its colors, and its lighting must revolve around this rare element (e.g., a Firefighter Easter Egg triggers a cinematic emergency-service aesthetic). Focus on extraordinary detail, vibrant lighting, and superior polish. The image should look like the most prestigious and rare asset of the entire protocol.
    `;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: "1K"
      }
    }
  });

  let imageUrl = '';
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  if (!imageUrl) throw new Error("No image data received");

  return { imageUrl, descriptionKeyword };
};
