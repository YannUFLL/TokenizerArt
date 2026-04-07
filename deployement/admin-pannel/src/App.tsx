/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Palette,
  Layers, 
  Zap,
  Info,
  Star,
  ExternalLink,
  Loader2,
  Car,
  Wallet,
  CheckCircle2,
  FileJson,
  CloudUpload,
  ShieldCheck,
  Globe,
  Settings,
  Search,
  X,
  Database,
  Send,
  Dices
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Internal Imports ---
import { TwingoNFT } from './types';
import { resolveIpfs } from './utils/ipfs';

// --- Hooks ---
import { useBlockchain } from './hooks/useBlockchain';
import { useMintFlow } from './hooks/useMintFlow';
import { useExplorer } from './hooks/useExplorer';
import { useAdmin } from './hooks/useAdmin';
import { useNFTGeneration } from './hooks/useNFTGeneration';
import { useManualMint } from './hooks/useManualMint';
import { useApiKey } from './hooks/useApiKey';

// --- Components ---
import { Explorer } from './components/Explorer';
import { ManualMintForm, MetadataEditor } from './components/ManualMintForm';
import { CollectionHistory } from './components/CollectionHistory';

export default function App() {
  // --- State & Hooks ---
  const {
    account,
    isConnecting,
    connectWallet,
    checkWalletConnection,
    nextTokenId,
    updateNextTokenId,
    mintedAssets,
    updateMintHistory,
    isLoadingHistory
  } = useBlockchain();

  const {
    isGenerating,
    currentNFT,
    setCurrentNFT,
    generationMode,
    setGenerationMode,
    error: genError,
    setError: setGenError,
    hasApiKey,
    setHasApiKey,
    generateNFT
  } = useNFTGeneration(nextTokenId);

  const {
    manualData,
    setManualData,
    handleImageDrop,
    handleImageSelect,
    resetManualData
  } = useManualMint();

  const {
    mintStep,
    setMintStep,
    mintTxHash,
    mintedTokenId,
    retryMetadataCid,
    error: mintError,
    setError: setMintError,
    handleMintFlow
  } = useMintFlow(account, nextTokenId, () => {
    updateNextTokenId();
    updateMintHistory();
    resetManualData();
  }, connectWallet);

  const {
    explorerTokenId,
    setExplorerTokenId,
    explorerAddress,
    setExplorerAddress,
    isTransferring,
    explorerResult,
    isExplorerLoading,
    error: explorerError,
    setError: setExplorerError,
    queryContract,
    handleTransfer
  } = useExplorer(account, connectWallet, updateMintHistory);

  const {
    baseUriInput,
    setBaseUriInput,
    adminMintAddress,
    setAdminMintAddress,
    adminMintUri,
    setAdminMintUri,
    isSettingBaseUri,
    isAdminMinting,
    adminError,
    handleSetBaseURI,
    handleAdminMint
  } = useAdmin(account, connectWallet, updateMintHistory);

  const {
    hasApiKey: globalHasApiKey,
    handleOpenKeySelector
  } = useApiKey();

  const [mintMode, setMintMode] = useState<'ai' | 'manual' | 'direct'>('ai');
  const [showContractExplorer, setShowContractExplorer] = useState(false);

  // --- Effects ---
  useEffect(() => {
    checkWalletConnection();
    updateNextTokenId();
    updateMintHistory();
  }, [checkWalletConnection, updateNextTokenId, updateMintHistory]);

  // Sync local hasApiKey with global hook if needed
  useEffect(() => {
    if (globalHasApiKey !== null) {
      setHasApiKey(globalHasApiKey);
    }
  }, [globalHasApiKey, setHasApiKey]);

  const activeError = genError || mintError || explorerError;
  const clearErrors = () => {
    setGenError(null);
    setMintError(null);
    setExplorerError(null);
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-mono selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Header */}
      <header className="border-b border-[#141414] p-6 flex justify-between items-center sticky top-0 bg-[#E4E3E0] z-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#141414] p-2 rounded-sm">
            <Cpu className="text-[#E4E3E0] w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter uppercase flex items-center gap-2">
              42 Twingos
              <span className="bg-emerald-600 text-white text-[8px] px-1.5 py-0.5 rounded-full tracking-normal normal-case font-normal">
                Admin Panel
              </span>
            </h1>
            <p className="text-[10px] opacity-50 uppercase tracking-widest">42 Twingo Gen-Engine v1.0.42</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowContractExplorer(!showContractExplorer)}
            className={`flex items-center gap-2 border border-[#141414] px-3 py-1.5 transition-colors ${showContractExplorer ? 'bg-[#141414] text-[#E4E3E0]' : 'hover:bg-[#141414] hover:text-[#E4E3E0]'}`}
          >
            <Search className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Explorer</span>
          </button>
          {account ? (
            <div className="flex items-center gap-2 bg-[#141414] text-[#E4E3E0] px-3 py-1.5 rounded-sm border border-[#141414]">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            </div>
          ) : (
            <button 
              onClick={connectWallet}
              disabled={isConnecting}
              className="flex items-center gap-2 border border-[#141414] px-3 py-1.5 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wallet className="w-4 h-4" />
              )}
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </span>
            </button>
          )}
          <div className="text-right hidden sm:block">
            <p className="text-[10px] opacity-50 uppercase">Network Status</p>
            <p className="text-xs font-bold text-blue-600 uppercase flex items-center gap-1 justify-end">
              <Globe className="w-3 h-3" /> Sepolia Testnet
            </p>
          </div>
        </div>
      </header>

      {/* Admin Notice */}
      <div className="bg-[#141414] text-[#E4E3E0] px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Authorized Access: Contract Creator Administration Panel
          </span>
        </div>
        <div className="text-[9px] opacity-50 uppercase hidden md:block">
          System Secure • Restricted to Owner
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        {/* Contract Explorer Overlay */}
        <AnimatePresence>
          {showContractExplorer && (
            <Explorer 
              show={showContractExplorer}
              onClose={() => setShowContractExplorer(false)}
              explorerTokenId={explorerTokenId}
              setExplorerTokenId={setExplorerTokenId}
              explorerAddress={explorerAddress}
              setExplorerAddress={setExplorerAddress}
              isExplorerLoading={isExplorerLoading}
              explorerResult={explorerResult}
              onQuery={queryContract}
              baseUriInput={baseUriInput}
              setBaseUriInput={setBaseUriInput}
              handleSetBaseURI={handleSetBaseURI}
              isSettingBaseUri={isSettingBaseUri}
            />
          )}
        </AnimatePresence>

        {/* API Key Overlay */}
        <AnimatePresence>
          {hasApiKey === false && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-[#E4E3E0]/90 backdrop-blur-sm flex items-center justify-center p-6"
            >
              <div className="max-w-md w-full border-2 border-[#141414] bg-white p-8 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] space-y-6">
                <div className="flex items-center gap-3 text-amber-600">
                  <Zap className="w-8 h-8 fill-current" />
                  <h2 className="text-2xl font-bold uppercase tracking-tighter">System Connection Required</h2>
                </div>
                <p className="text-sm leading-relaxed">
                  The <span className="font-bold">gemini-3.1-flash-image-preview</span> model requires a user-provided API key from a paid Google Cloud project to generate high-fidelity assets.
                </p>
                <div className="bg-[#f0f0f0] p-4 border border-[#141414]/10 space-y-2">
                  <p className="text-[10px] uppercase font-bold opacity-50">Setup Instructions</p>
                  <ol className="text-[10px] space-y-1 list-decimal list-inside">
                    <li>Ensure you have a paid billing account.</li>
                    <li>Select a key from a paid project in the dialog.</li>
                    <li>Refer to <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline">billing docs</a> for more info.</li>
                  </ol>
                </div>
                <button 
                  onClick={handleOpenKeySelector}
                  className="w-full bg-[#141414] text-[#E4E3E0] py-4 font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> Connect API Key
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Left Column: Generator */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mode Switcher */}
          <div className="flex border border-[#141414] bg-white shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
            <button 
              onClick={() => setMintMode('ai')}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${mintMode === 'ai' ? 'bg-[#141414] text-white' : 'hover:bg-[#f0f0f0]'}`}
            >
              AI Generation
            </button>
            <button 
              onClick={() => setMintMode('manual')}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${mintMode === 'manual' ? 'bg-[#141414] text-white' : 'hover:bg-[#f0f0f0]'}`}
            >
              Manual Upload
            </button>
            <button 
              onClick={() => setMintMode('direct')}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${mintMode === 'direct' ? 'bg-[#141414] text-white' : 'hover:bg-[#f0f0f0]'}`}
            >
              Direct Mint
            </button>
          </div>

          {/* Minting Progress Overlay */}
          <AnimatePresence>
            {mintStep !== 'idle' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-40 bg-[#E4E3E0]/95 backdrop-blur-md flex items-center justify-center p-6"
              >
                <div className="max-w-md w-full border-2 border-[#141414] bg-white p-8 shadow-[12px_12px_0px_0px_rgba(20,20,20,1)] space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold uppercase tracking-tighter">Minting Sequence</h2>
                    <button onClick={() => setMintStep('idle')} className="text-xs opacity-50 hover:opacity-100 uppercase">Cancel</button>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-500 text-white p-1 rounded-full">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold uppercase">1. Asset Generation</p>
                        <p className="text-[10px] opacity-50">Visual data compiled successfully</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={`${mintStep === 'metadata' ? 'bg-[#141414] text-white animate-pulse' : mintStep !== 'idle' && mintStep !== 'metadata' ? 'bg-emerald-500 text-white' : 'bg-[#f0f0f0] text-[#141414]'} p-1 rounded-full`}>
                        {mintStep !== 'idle' && mintStep !== 'metadata' ? <CheckCircle2 className="w-5 h-5" /> : <FileJson className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-bold uppercase ${mintStep === 'metadata' ? 'text-[#141414]' : 'opacity-50'}`}>2. Metadata Construction</p>
                        <p className="text-[10px] opacity-50">Structuring JSON attributes</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={`${mintStep === 'uploading' ? 'bg-[#141414] text-white animate-pulse' : mintStep === 'minting' || mintStep === 'confirmed' ? 'bg-emerald-500 text-white' : 'bg-[#f0f0f0] text-[#141414]'} p-1 rounded-full`}>
                        {mintStep === 'minting' || mintStep === 'confirmed' ? <CheckCircle2 className="w-5 h-5" /> : <CloudUpload className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-bold uppercase ${mintStep === 'uploading' ? 'text-[#141414]' : 'opacity-50'}`}>3. IPFS Synchronization</p>
                        <p className="text-[10px] opacity-50">Uploading to Pinata Gateway</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={`${mintStep === 'minting' ? 'bg-[#141414] text-white animate-pulse' : mintStep === 'confirmed' ? 'bg-emerald-500 text-white' : 'bg-[#f0f0f0] text-[#141414]'} p-1 rounded-full`}>
                        {mintStep === 'confirmed' ? <CheckCircle2 className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-bold uppercase ${mintStep === 'minting' ? 'text-[#141414]' : 'opacity-50'}`}>4. Smart Contract Execution</p>
                        <p className="text-[10px] opacity-50">Broadcasting to Sepolia Network</p>
                      </div>
                    </div>
                  </div>

                  {mintStep === 'confirmed' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-emerald-50 p-4 border border-emerald-200 space-y-3"
                    >
                      <div className="flex items-center gap-2 text-emerald-700">
                        <Zap className="w-4 h-4 fill-current" />
                        <p className="text-xs font-bold uppercase">Minting Successful</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[8px] uppercase opacity-50">Token ID</p>
                          <p className="text-sm font-bold">#{mintedTokenId || '???'}</p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase opacity-50">Transaction</p>
                          <a 
                            href={`https://sepolia.etherscan.io/tx/${mintTxHash}`} 
                            target="_blank" 
                            className="text-[10px] font-bold underline flex items-center gap-1"
                          >
                            View Hash <ExternalLink className="w-2 h-2" />
                          </a>
                        </div>
                      </div>
                      <button 
                        onClick={() => setMintStep('idle')}
                        className="w-full bg-emerald-600 text-white py-2 text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 transition-colors"
                      >
                        Complete Sequence
                      </button>
                    </motion.div>
                  )}

                  {mintStep !== 'confirmed' && (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <Loader2 className="w-8 h-8 animate-spin text-[#141414]" />
                      <p className="text-[10px] uppercase tracking-widest animate-pulse">Processing Transaction...</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="border border-[#141414] bg-white overflow-hidden shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
            <div className="border-b border-[#141414] p-3 flex justify-between items-center bg-[#141414] text-[#E4E3E0]">
              <span className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                <Palette className="w-3 h-3" /> {mintMode === 'manual' ? 'Manual_Upload.exe' : mintMode === 'direct' ? 'Direct_Mint.exe' : 'Preview_Viewport.exe'}
              </span>
              <span className="text-[10px] opacity-50">{mintMode === 'manual' ? 'IPFS_READY' : mintMode === 'direct' ? 'ADMIN_MODE' : '1024x1024_PX'}</span>
            </div>
            
            <div className="aspect-square relative flex items-center justify-center bg-[#f0f0f0]">
              {mintMode === 'manual' ? (
                <ManualMintForm 
                  manualData={manualData}
                  setManualData={setManualData}
                  onImageSelect={handleImageSelect}
                  onImageDrop={handleImageDrop}
                />
              ) : mintMode === 'direct' ? (
                <div className="w-full p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="bg-[#141414] text-white p-4 flex items-center gap-3">
                      <ShieldCheck className="w-6 h-6 text-emerald-500" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest">Direct Mint Protocol</p>
                        <p className="text-[9px] opacity-60">Bypass generation and mint directly to any address.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold opacity-50">Recipient Address</label>
                        <input 
                          type="text"
                          value={adminMintAddress}
                          onChange={(e) => setAdminMintAddress(e.target.value)}
                          placeholder="0x..."
                          className="w-full bg-white border border-[#141414] px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#141414]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold opacity-50">Token URI (CID)</label>
                        <input 
                          type="text"
                          value={adminMintUri}
                          onChange={(e) => setAdminMintUri(e.target.value)}
                          placeholder="ipfs://..."
                          className="w-full bg-white border border-[#141414] px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#141414]"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={handleAdminMint}
                      disabled={isAdminMinting || !adminMintAddress || !adminMintUri || !account}
                      className="w-full bg-emerald-600 text-white py-4 font-bold uppercase tracking-widest hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isAdminMinting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                      Execute Direct Mint
                    </button>
                    
                    <p className="text-[9px] opacity-40 italic text-center">
                      Note: This function is restricted to the contract owner.
                    </p>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <Loader2 className="w-12 h-12 animate-spin text-[#141414]" />
                      <p className="text-xs animate-pulse uppercase tracking-widest">
                        Compiling Layers...
                      </p>
                    </motion.div>
                  ) : (currentNFT && currentNFT.image) ? (
                    <motion.img 
                      key={currentNFT.image}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      src={resolveIpfs(currentNFT.image) || undefined} 
                      alt="Generated Twingo"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="text-center p-12 space-y-4 opacity-20">
                      <Car className="w-24 h-24 mx-auto" />
                      <p className="text-sm uppercase tracking-widest">No Asset Loaded</p>
                    </div>
                  )}
                </AnimatePresence>
              )}

              {activeError && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 p-8 text-center z-50">
                  <div className="space-y-4">
                    <p className="text-red-600 font-bold uppercase tracking-tighter">Error: {activeError}</p>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => { clearErrors(); generateNFT(); }}
                        className="px-4 py-2 border border-[#141414] hover:bg-[#141414] hover:text-white transition-colors uppercase text-xs font-bold"
                      >
                        Retry Generation
                      </button>
                      {retryMetadataCid && (
                        <button 
                          onClick={() => handleMintFlow(currentNFT, manualData, mintMode === 'manual', retryMetadataCid)}
                          className="px-4 py-2 bg-emerald-600 text-white border border-[#141414] hover:bg-emerald-700 transition-colors uppercase text-xs font-bold flex items-center justify-center gap-2"
                        >
                          <Zap className="w-3 h-3" />
                          Retry Mint (Skip IPFS)
                        </button>
                      )}
                      <button 
                        onClick={clearErrors}
                        className="px-4 py-2 border border-[#141414] hover:bg-gray-100 transition-colors uppercase text-xs font-bold"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
            {mintMode === 'ai' ? (
              <>
                <div className="lg:col-span-8 flex border border-[#141414] bg-white overflow-hidden">
                  <button 
                    onClick={() => setGenerationMode('common')}
                    className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${generationMode === 'common' ? 'bg-[#141414] text-white' : 'hover:bg-[#f0f0f0]'}`}
                  >
                    <Zap className={`w-3 h-3 ${generationMode === 'common' ? 'fill-current' : ''}`} /> Common Mode
                  </button>
                  <button 
                    onClick={() => setGenerationMode('legendary')}
                    className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${generationMode === 'legendary' ? 'bg-yellow-400 text-[#141414]' : 'hover:bg-[#f0f0f0]'}`}
                  >
                    <Star className={`w-3 h-3 ${generationMode === 'legendary' ? 'fill-current' : ''}`} /> Legendary Mode
                  </button>
                </div>

                <button 
                  onClick={() => generateNFT()}
                  disabled={isGenerating}
                  className="lg:col-span-4 group relative border border-[#141414] bg-[#141414] text-[#E4E3E0] p-4 shadow-[4px_4px_0px_0px_rgba(20,20,20,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Dices className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Generate Asset</span>
                  </div>
                </button>

                {currentNFT && (
                  <button 
                    onClick={() => handleMintFlow(currentNFT, manualData, false)}
                    disabled={isGenerating || isConnecting || !account}
                    className={`lg:col-span-12 group relative border border-[#141414] ${account ? 'bg-emerald-600' : 'bg-white'} ${account ? 'text-white' : 'text-[#141414]'} p-6 shadow-[4px_4px_0px_0px_rgba(20,20,20,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      {isConnecting ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <ShieldCheck className="w-6 h-6" />
                      )}
                      <span className="text-sm font-bold uppercase tracking-tighter">
                        {isConnecting ? 'Connecting...' : !account ? 'Connect Wallet to Mint' : 'Mint this Twingo to Blockchain'}
                      </span>
                    </div>
                  </button>
                )}
              </>
            ) : mintMode === 'manual' ? (
              <>
                <div className="lg:col-span-8 border border-[#141414] bg-white p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase opacity-50">Manual Mode Active</p>
                    <p className="text-xs">Fill metadata and upload image to proceed.</p>
                  </div>
                  <Globe className="w-5 h-5 opacity-20" />
                </div>

                <button 
                  onClick={() => handleMintFlow(currentNFT, manualData, true)}
                  disabled={isGenerating || isConnecting || !manualData.imageFile || !account}
                  className={`lg:col-span-4 group relative border border-[#141414] ${account ? 'bg-blue-600' : 'bg-white'} ${account ? 'text-white' : 'text-[#141414]'} p-6 shadow-[4px_4px_0px_0px_rgba(20,20,20,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    {isConnecting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : account ? (
                      <ShieldCheck className="w-6 h-6" />
                    ) : (
                      <Wallet className="w-6 h-6" />
                    )}
                    <span className="text-sm font-bold uppercase tracking-tighter">
                      {isConnecting ? 'Connecting...' : !account ? 'Connect to Mint' : 'Mint to Blockchain'}
                    </span>
                  </div>
                </button>
              </>
            ) : (
              <div className="lg:col-span-12 border border-[#141414] bg-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Direct Mint Mode Active</span>
                </div>
                {!account && (
                  <button 
                    onClick={connectWallet}
                    className="text-[10px] font-bold uppercase underline"
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            )}

            {!account && mintMode !== 'direct' && (
              <button 
                onClick={connectWallet}
                disabled={isConnecting}
                className="lg:col-span-12 border border-[#141414] bg-white p-4 flex items-center justify-center gap-3 hover:bg-[#f0f0f0] transition-colors"
              >
                <Wallet className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Metadata & Collection */}
        <div className="lg:col-span-5 space-y-6">
          {/* Current Metadata */}
          <div className="border border-[#141414] bg-white shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
            <div className="border-b border-[#141414] p-3 bg-[#f0f0f0] flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                <Info className="w-3 h-3" /> {mintMode === 'manual' ? 'Metadata_Editor' : 'Metadata_Inspector'}
              </span>
              <span className="text-[10px] font-bold">{mintMode === 'manual' ? 'MANUAL_ENTRY' : (currentNFT?.name || currentNFT?.id || 'ID_PENDING')}</span>
            </div>
            <div className="p-6 space-y-4">
              {mintMode === 'manual' ? (
                <MetadataEditor manualData={manualData} setManualData={setManualData} />
              ) : mintMode === 'direct' ? (
                <div className="space-y-4 py-8 text-center opacity-40">
                  <Database className="w-12 h-12 mx-auto" />
                  <p className="text-xs uppercase tracking-widest">Direct Mint Mode Active</p>
                  <p className="text-[10px]">Metadata is provided via Token URI in the main viewport.</p>
                </div>
              ) : currentNFT ? (
                <div className="space-y-4">
                  <div className="border-b border-[#141414]/10 pb-2">
                    <p className="text-[10px] opacity-50 uppercase">Protocol Description</p>
                    <p className="text-[10px] font-bold italic leading-relaxed">
                      {currentNFT.description || "Experimental Twingo units deployed via the 42 Twingos Protocol. Each vehicle is a unique digital asset merging 90s French automotive soul with cyberpunk aesthetics..."}
                    </p>
                  </div>
                  {currentNFT.traits.map((trait, i) => (
                    <div key={i} className="flex justify-between items-end border-b border-[#141414]/10 pb-2">
                      <div>
                        <p className="text-[10px] opacity-50 uppercase">{trait.name}</p>
                        <p className="text-sm font-bold">{trait.value}</p>
                      </div>
                      <span className={`text-[8px] px-1.5 py-0.5 border border-[#141414] font-bold uppercase ${
                        trait.rarity === 'Legendary' ? 'bg-yellow-400' :
                        trait.rarity === 'Rare' ? 'bg-purple-400' :
                        trait.rarity === 'Uncommon' ? 'bg-blue-400' : 'bg-white'
                      }`}>
                        {trait.rarity}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs opacity-40 italic py-12 text-center uppercase tracking-widest">
                  Awaiting generation sequence...
                </p>
              )}
            </div>
          </div>

          {/* Collection History */}
          <CollectionHistory 
            mintedAssets={mintedAssets}
            isLoadingHistory={isLoadingHistory}
            onRefresh={updateMintHistory}
            onSelectNFT={setCurrentNFT}
            currentAccount={account}
            onTransfer={handleTransfer}
            isTransferring={isTransferring}
          />
        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-7xl mx-auto p-6 mt-12 border-t border-[#141414]/10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest">Art Direction: 42 Twingos</h3>
            <p className="text-[11px] leading-relaxed opacity-70">
              The 42 Twingos collection leverages a unique, procedurally generated art style. 
              Our goal was to create a recognizable visual identity that bridges modern web3 culture 
              with technical, "42-style" computer science aesthetics.
            </p>
          </div>
          <div className="flex gap-12">
            <div>
              <h4 className="text-[10px] font-bold uppercase opacity-40 mb-3">Protocol</h4>
              <ul className="text-[10px] space-y-2 font-bold uppercase">
                <li><a href="#" className="hover:underline">Whitepaper</a></li>
                <li><a href="#" className="hover:underline">Contract</a></li>
                <li><a href="#" className="hover:underline">Governance</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase opacity-40 mb-3">Social</h4>
              <ul className="text-[10px] space-y-2 font-bold uppercase">
                <li><a href="#" className="hover:underline">Discord</a></li>
                <li><a href="#" className="hover:underline">Twitter</a></li>
                <li><a href="#" className="hover:underline">OpenSea</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 flex justify-between items-center opacity-30 text-[9px] uppercase tracking-[0.2em]">
          <span>© 2026 42 Twingos Protocol</span>
          <span>Built for the Sepolia Network</span>
        </div>
      </footer>
    </div>
  );
}
