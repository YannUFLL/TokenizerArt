import { useState, useCallback } from 'react';
import { TwingoNFT, Trait } from '../types';
import { generateTraits as genTraits, generateNFTWithAI } from '../services/gemini';

export const useNFTGeneration = (nextTokenId: bigint) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentNFT, setCurrentNFT] = useState<TwingoNFT | null>(null);
  const [generationMode, setGenerationMode] = useState<'common' | 'legendary'>('common');
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  const generateNFT = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    const traits = genTraits(generationMode);

    try {
      const { imageUrl, descriptionKeyword } = await generateNFTWithAI(traits, generationMode);

      const newNFT: TwingoNFT = {
        id: `42 Twingo #${nextTokenId.toString().padStart(3, '0')}`,
        name: `42 Twingo #${nextTokenId.toString().padStart(3, '0')}`,
        image: imageUrl,
        traits,
        descriptionKeyword,
        timestamp: Date.now(),
      };

      setCurrentNFT(newNFT);
      return newNFT;
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found") || err.message?.includes("PERMISSION_DENIED")) {
        setHasApiKey(false);
        setError("API Key permission error. Please re-select a valid paid API key.");
      } else {
        setError("Failed to generate NFT. Please check your connection or try again.");
      }
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [generationMode, nextTokenId]);

  return {
    isGenerating,
    currentNFT,
    setCurrentNFT,
    generationMode,
    setGenerationMode,
    error,
    setError,
    hasApiKey,
    setHasApiKey,
    generateNFT
  };
};
