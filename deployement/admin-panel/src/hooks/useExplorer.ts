import { useState, useCallback } from 'react';
import { type Address } from 'viem';
import { CONTRACT_ADDRESS, MINT_ABI } from '../constants';
import { getPublicClient, getWalletClient, switchChain } from '../services/blockchain';
import { ExplorerResult } from '../types';
import { sepolia } from 'viem/chains';

export const useExplorer = (account: Address | null, connectWallet: () => Promise<void>, onHistoryUpdate: () => void) => {
  const [explorerTokenId, setExplorerTokenId] = useState('');
  const [explorerAddress, setExplorerAddress] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferTokenId, setTransferTokenId] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [explorerResult, setExplorerResult] = useState<ExplorerResult | null>(null);
  const [isExplorerLoading, setIsExplorerLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryContract = useCallback(async (type: 'ownerOf' | 'balanceOf' | 'getApproved' | 'tokenURI') => {
    if (!account) {
      await connectWallet();
      return;
    }
    setIsExplorerLoading(true);
    setExplorerResult(null);
    try {
      const publicClient = getPublicClient();

      let result: any;
      if (type === 'ownerOf') {
        if (!explorerTokenId) throw new Error("Token ID required");
        result = await (publicClient as any).readContract({
          address: CONTRACT_ADDRESS,
          abi: MINT_ABI,
          functionName: 'ownerOf',
          args: [BigInt(explorerTokenId)]
        });
        setExplorerResult({ label: `Owner of #${explorerTokenId}`, value: result as string });
      } else if (type === 'balanceOf') {
        if (!explorerAddress) throw new Error("Address required");
        result = await (publicClient as any).readContract({
          address: CONTRACT_ADDRESS,
          abi: MINT_ABI,
          functionName: 'balanceOf',
          args: [explorerAddress as Address]
        });
        setExplorerResult({ label: `Balance of ${explorerAddress.slice(0,6)}...`, value: `${result.toString()} Twingos` });
      } else if (type === 'getApproved') {
        if (!explorerTokenId) throw new Error("Token ID required");
        result = await (publicClient as any).readContract({
          address: CONTRACT_ADDRESS,
          abi: MINT_ABI,
          functionName: 'getApproved',
          args: [BigInt(explorerTokenId)]
        });
        setExplorerResult({ label: `Approved for #${explorerTokenId}`, value: result as string });
      } else if (type === 'tokenURI') {
        if (!explorerTokenId) throw new Error("Token ID required");
        result = await (publicClient as any).readContract({
          address: CONTRACT_ADDRESS,
          abi: MINT_ABI,
          functionName: 'tokenURI',
          args: [BigInt(explorerTokenId)]
        });
        
        let displayValue = result as string;
        let label = `Metadata URI for #${explorerTokenId}`;
        
        if (displayValue.startsWith('ipfs://')) {
          const cid = displayValue.replace('ipfs://', '');
          label = `IPFS CID for #${explorerTokenId}`;
          displayValue = cid;
        }
        
        setExplorerResult({ label, value: displayValue });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Query failed");
    } finally {
      setIsExplorerLoading(false);
    }
  }, [account, explorerTokenId, explorerAddress, connectWallet]);

  const handleTransfer = useCallback(async (tokenId?: string, to?: string) => {
    if (!account) {
      await connectWallet();
      return;
    }
    
    const finalTokenId = tokenId || transferTokenId;
    const finalTo = to || transferTo;

    if (!finalTo || !finalTokenId) return;
    setIsTransferring(true);
    try {
      const walletClient = getWalletClient(account);
      await switchChain(walletClient);

      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: MINT_ABI,
        functionName: 'safeTransferFrom',
        args: [account, finalTo as Address, BigInt(finalTokenId)],
        chain: sepolia,
        account: account!,
      });

      setExplorerResult({ label: "Transfer Initiated", value: `TX Hash: ${hash}` });
      
      const publicClient = getPublicClient();
      await publicClient.waitForTransactionReceipt({ hash });
      setExplorerResult({ label: "Transfer Confirmed", value: `Token #${finalTokenId} sent to ${finalTo}` });
      onHistoryUpdate();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Transfer failed");
    } finally {
      setIsTransferring(false);
    }
  }, [account, transferTo, transferTokenId, connectWallet, onHistoryUpdate]);

  return {
    explorerTokenId,
    setExplorerTokenId,
    explorerAddress,
    setExplorerAddress,
    transferTo,
    setTransferTo,
    transferTokenId,
    setTransferTokenId,
    isTransferring,
    explorerResult,
    setExplorerResult,
    isExplorerLoading,
    error,
    setError,
    queryContract,
    handleTransfer
  };
};
