import { useState, useCallback } from 'react';
import { 
  createWalletClient, 
  createPublicClient, 
  custom, 
  http, 
  type Address,
  type Hash
} from 'viem';
import { sepolia } from 'viem/chains';
import { CONTRACT_ADDRESS, INFURA_URL, MINT_ABI } from '../constants';
import { 
  getPublicClient, 
  getWalletClient, 
  switchChain, 
  fetchNextTokenId as fetchNextId,
  fetchMintHistory as fetchHistory
} from '../services/blockchain';

export const useBlockchain = () => {
  const [account, setAccount] = useState<Address | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [nextTokenId, setNextTokenId] = useState<bigint>(0n);
  const [mintedAssets, setMintedAssets] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const checkWalletConnection = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const walletClient = createWalletClient({
          chain: sepolia,
          transport: custom(window.ethereum)
        });
        const [address] = await walletClient.getAddresses();
        if (address) setAccount(address);
      } catch (e) {
        console.error("Wallet check failed", e);
      }
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (isConnecting) return;
    if (typeof window.ethereum === 'undefined') {
      alert("Please install Metamask!");
      return;
    }
    setIsConnecting(true);
    try {
      const walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum)
      });
      const [address] = await walletClient.requestAddresses();
      await switchChain(walletClient);
      setAccount(address);
    } catch (e: any) {
      console.error("Connection failed", e);
      throw e;
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting]);

  const updateNextTokenId = useCallback(async () => {
    const id = await fetchNextId();
    setNextTokenId(id);
  }, []);

  const updateMintHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    const history = await fetchHistory();
    setMintedAssets(history);
    setIsLoadingHistory(false);
  }, []);

  return {
    account,
    setAccount,
    isConnecting,
    connectWallet,
    checkWalletConnection,
    nextTokenId,
    updateNextTokenId,
    mintedAssets,
    updateMintHistory,
    isLoadingHistory
  };
};
