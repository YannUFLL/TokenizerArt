import { useState, useCallback, useEffect } from 'react';

export const useApiKey = () => {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  const checkApiKey = useCallback(async () => {
    if (window.aistudio?.hasSelectedApiKey) {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(selected);
    } else {
      setHasApiKey(true);
    }
  }, []);

  const handleOpenKeySelector = useCallback(async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  return {
    hasApiKey,
    setHasApiKey,
    handleOpenKeySelector
  };
};
