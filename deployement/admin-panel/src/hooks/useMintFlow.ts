import { useState, useCallback } from 'react';
import { type Address, type Hash } from 'viem';
import { MintStep, TwingoNFT, ManualNFTData } from '../types';
import { CONTRACT_ADDRESS, MINT_ABI } from '../constants';
import { uploadToPinata } from '../services/pinata';
import { getPublicClient, getWalletClient, switchChain } from '../services/blockchain';
import { sepolia } from 'viem/chains';

export const useMintFlow = (
  account: Address | null, 
  nextTokenId: bigint, 
  onSuccess: () => void,
  connectWallet: () => Promise<void>
) => {
  const [mintStep, setMintStep] = useState<MintStep>('idle');
  const [mintTxHash, setMintTxHash] = useState<Hash | null>(null);
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null);
  const [retryMetadataCid, setRetryMetadataCid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ipfsCid, setIpfsCid] = useState<string | null>(null);

  const handleMintFlow = useCallback(async (
    currentNFT: TwingoNFT | null, 
    manualData: ManualNFTData, 
    showManualMint: boolean,
    existingCid?: string
  ) => {
    const actualCid = typeof existingCid === 'string' ? existingCid : undefined;

    if (!account) {
      await connectWallet();
      return;
    }

    if (!showManualMint && !currentNFT && !actualCid) return;
    if (showManualMint && !manualData.imageFile && !actualCid) {
      alert("Please select an image for manual mint.");
      return;
    }

    try {
      setMintStep('metadata');
      setError(null);

      let metadataCid = actualCid || '';

      if (!actualCid) {
        const nftName = `42 Twingo #${nextTokenId.toString().padStart(3, '0')}`;
        const description = "Experimental Twingo units deployed via the 42 Twingos Protocol. Each vehicle is a unique digital asset merging 90s French automotive soul with cyberpunk aesthetics. Verified and minted on the Sepolia testnet";

        const metadata = {
          name: nftName,
          description: description,
          artist: "ydumaine",
          image: "", 
          attributes: showManualMint 
            ? [
                { trait_type: 'Background', value: manualData.background || 'None' },
                { trait_type: 'Decals', value: manualData.decals || 'None' },
                { trait_type: 'Accessories', value: manualData.accessories || 'None' },
                { trait_type: 'Easter Egg', value: manualData.easterEgg || 'None' }
              ]
            : currentNFT!.traits.map(t => ({
                trait_type: t.name,
                value: t.value
              }))
        };

        setMintStep('uploading');
        
        let imageCid = '';
        if (showManualMint) {
          imageCid = await uploadToPinata(manualData.imageFile!, `${nextTokenId}.png`);
        } else {
          const imageBlob = await (await fetch(currentNFT!.image)).blob();
          imageCid = await uploadToPinata(imageBlob, `${nextTokenId}.png`);
        }
        metadata.image = `ipfs://${imageCid}`;

        const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
        metadataCid = await uploadToPinata(metadataBlob, `${nextTokenId}.json`);
      }

      setIpfsCid(metadataCid);
      setRetryMetadataCid(metadataCid);
      setMintStep('minting');

      console.log("Final metadata CID:", metadataCid);
      if (typeof metadataCid !== 'string') {
        console.error("CID is not a string!", metadataCid);
        throw new Error(`Invalid CID generated: ${JSON.stringify(metadataCid)}`);
      }

      const walletClient = getWalletClient(account);
      await switchChain(walletClient);

      const publicClient = getPublicClient();

      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: MINT_ABI,
        functionName: 'mint',
        args: [account, `ipfs://${metadataCid}`],
        chain: sepolia,
        account: account!,
      });

      setMintTxHash(hash);

      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      const transferLog = receipt.logs.find(log => 
        log.address.toLowerCase() === CONTRACT_ADDRESS.toLowerCase()
      ) as any;
      
      if (transferLog && transferLog.topics) {
        const tokenId = BigInt(transferLog.topics[3] || '0').toString();
        setMintedTokenId(tokenId);
      }

      setMintStep('confirmed');
      setRetryMetadataCid(null);
      onSuccess();
    } catch (err: any) {
      console.error("Minting flow failed", err);
      setError(err.message || "Minting failed. Please try again.");
      setMintStep('idle');
    }
  }, [account, nextTokenId, connectWallet, onSuccess]);

  return {
    mintStep,
    setMintStep,
    mintTxHash,
    mintedTokenId,
    retryMetadataCid,
    error,
    setError,
    ipfsCid,
    handleMintFlow
  };
};
