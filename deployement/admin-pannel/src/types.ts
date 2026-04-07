import { Address } from 'viem';

export type MintStep = 'idle' | 'generating' | 'metadata' | 'uploading' | 'minting' | 'confirmed';

export interface ManualNFTData {
  background: string;
  decals: string;
  accessories: string;
  easterEgg: string;
  imageFile: File | null;
  imagePreview: string | null;
}

export interface Trait {
  name: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
  value: string;
}

export interface TwingoNFT {
  id: string;
  name?: string;
  image: string | null;
  traits: Trait[];
  description?: string;
  descriptionKeyword: string;
  timestamp: number;
}

export interface ExplorerResult {
  label: string;
  value: string;
}

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey?: () => Promise<boolean>;
      openSelectKey?: () => Promise<void>;
    };
    ethereum?: any;
  }

  interface ImportMetaEnv {
    readonly VITE_CONTRACT_ADDRESS: string;
    readonly VITE_INFURA_URL: string;
    readonly VITE_PINATA_JWT: string;
    readonly VITE_PINATA_GATEWAY: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
