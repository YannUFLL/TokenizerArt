import React, { useState, useCallback } from 'react';
import { ManualNFTData } from '../types';

export const useManualMint = () => {
  const [manualData, setManualData] = useState<ManualNFTData>({
    background: '',
    decals: '',
    accessories: '',
    easterEgg: '',
    imageFile: null,
    imagePreview: null
  });

  const handleImageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setManualData(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setManualData(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const resetManualData = useCallback(() => {
    setManualData({
      background: '',
      decals: '',
      accessories: '',
      easterEgg: '',
      imageFile: null,
      imagePreview: null
    });
  }, []);

  return {
    manualData,
    setManualData,
    handleImageDrop,
    handleImageSelect,
    resetManualData
  };
};
