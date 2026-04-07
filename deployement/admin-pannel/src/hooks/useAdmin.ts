import { useState, useCallback } from 'react';
import { type Address } from 'viem';
import { CONTRACT_ADDRESS, MINT_ABI } from '../constants';
import { getWalletClient, switchChain } from '../services/blockchain';
import { sepolia } from 'viem/chains';

export const useAdmin = (account: Address | null, connectWallet: () => Promise<void>, onHistoryUpdate: () => void) => {
  const [baseUriInput, setBaseUriInput] = useState('');
  const [adminMintAddress, setAdminMintAddress] = useState('');
  const [adminMintUri, setAdminMintUri] = useState('');
  const [isSettingBaseUri, setIsSettingBaseUri] = useState(false);
  const [isAdminMinting, setIsAdminMinting] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  const handleSetBaseURI = useCallback(async () => {
    if (!account) {
      await connectWallet();
      return;
    }
    if (!baseUriInput) return;

    setIsSettingBaseUri(true);
    setAdminError(null);
    try {
      const walletClient = getWalletClient(account);
      await switchChain(walletClient);

      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: MINT_ABI,
        functionName: 'setBaseURI',
        args: [baseUriInput],
        chain: sepolia,
        account: account!,
      });

      alert(`Base URI update transaction sent: ${hash}`);
      setBaseUriInput('');
    } catch (err: any) {
      console.error("SetBaseURI error:", err);
      setAdminError(err.message || "Failed to update Base URI. Are you the owner?");
    } finally {
      setIsSettingBaseUri(false);
    }
  }, [account, baseUriInput, connectWallet]);

  const handleAdminMint = useCallback(async () => {
    if (!account) {
      await connectWallet();
      return;
    }
    if (!adminMintAddress || !adminMintUri) return;

    setIsAdminMinting(true);
    setAdminError(null);
    try {
      const walletClient = getWalletClient(account);
      await switchChain(walletClient);

      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: MINT_ABI,
        functionName: 'mint',
        args: [adminMintAddress as Address, adminMintUri],
        chain: sepolia,
        account: account!,
      });

      alert(`Admin manual mint transaction sent: ${hash}`);
      setAdminMintAddress('');
      setAdminMintUri('');
      onHistoryUpdate();
    } catch (err: any) {
      console.error("AdminMint error:", err);
      setAdminError(err.message || "Failed to mint. Check address and URI.");
    } finally {
      setIsAdminMinting(false);
    }
  }, [account, adminMintAddress, adminMintUri, connectWallet, onHistoryUpdate]);

  return {
    baseUriInput,
    setBaseUriInput,
    adminMintAddress,
    setAdminMintAddress,
    adminMintUri,
    setAdminMintUri,
    isSettingBaseUri,
    isAdminMinting,
    adminError,
    setAdminError,
    handleSetBaseURI,
    handleAdminMint
  };
};
