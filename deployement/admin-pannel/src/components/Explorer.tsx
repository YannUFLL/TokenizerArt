import React from 'react';
import { Search, X, Loader2, Send, Database, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { ExplorerResult } from '../types';

interface ExplorerProps {
  show: boolean;
  onClose: () => void;
  explorerTokenId: string;
  setExplorerTokenId: (val: string) => void;
  explorerAddress: string;
  setExplorerAddress: (val: string) => void;
  isExplorerLoading: boolean;
  explorerResult: ExplorerResult | null;
  onQuery: (type: 'ownerOf' | 'balanceOf' | 'getApproved' | 'tokenURI') => void;
  // Admin props
  baseUriInput: string;
  setBaseUriInput: (val: string) => void;
  handleSetBaseURI: () => void;
  isSettingBaseUri: boolean;
}

export const Explorer: React.FC<ExplorerProps> = ({
  show,
  onClose,
  explorerTokenId,
  setExplorerTokenId,
  explorerAddress,
  setExplorerAddress,
  isExplorerLoading,
  explorerResult,
  onQuery,
  baseUriInput,
  setBaseUriInput,
  handleSetBaseURI,
  isSettingBaseUri
}) => {
  const [activeTab, setActiveTab] = React.useState<'lookup' | 'admin'>('lookup');

  if (!show) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute inset-x-6 top-0 z-50 bg-[#E4E3E0] border border-[#141414] shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] p-6"
    >
      <div className="flex justify-between items-center mb-6 border-b border-[#141414] pb-4">
        <div className="flex items-center gap-6">
          <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <Search className="w-4 h-4" /> Protocol_Explorer.exe
          </h2>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('lookup')}
              className={`text-[10px] font-bold uppercase tracking-tighter pb-1 border-b-2 transition-all ${activeTab === 'lookup' ? 'border-[#141414] opacity-100' : 'border-transparent opacity-30 hover:opacity-100'}`}
            >
              Data Lookup
            </button>
            <button 
              onClick={() => setActiveTab('admin')}
              className={`text-[10px] font-bold uppercase tracking-tighter pb-1 border-b-2 transition-all ${activeTab === 'admin' ? 'border-[#141414] opacity-100' : 'border-transparent opacity-30 hover:opacity-100'}`}
            >
              Protocol Settings
            </button>
          </div>
        </div>
        <button onClick={onClose} className="hover:rotate-90 transition-transform">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {activeTab === 'lookup' ? (
            <>
              <div className="space-y-2">
                <label className="text-[10px] uppercase opacity-50 font-bold">Token ID Lookup</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={explorerTokenId}
                    onChange={(e) => setExplorerTokenId(e.target.value)}
                    placeholder="ID (e.g. 42)"
                    className="flex-1 bg-white border border-[#141414] px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#141414]"
                  />
                  <button 
                    onClick={() => onQuery('ownerOf')}
                    disabled={isExplorerLoading || !explorerTokenId}
                    className="bg-[#141414] text-[#E4E3E0] px-4 py-2 text-[10px] uppercase font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  >
                    OwnerOf
                  </button>
                  <button 
                    onClick={() => onQuery('getApproved')}
                    disabled={isExplorerLoading || !explorerTokenId}
                    className="bg-[#141414] text-[#E4E3E0] px-4 py-2 text-[10px] uppercase font-bold hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    Approved
                  </button>
                  <button 
                    onClick={() => onQuery('tokenURI')}
                    disabled={isExplorerLoading || !explorerTokenId}
                    className="bg-[#141414] text-[#E4E3E0] px-4 py-2 text-[10px] uppercase font-bold hover:bg-amber-600 transition-colors disabled:opacity-50"
                  >
                    Get CID
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase opacity-50 font-bold">Address Lookup</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={explorerAddress}
                    onChange={(e) => setExplorerAddress(e.target.value)}
                    placeholder="0x..."
                    className="flex-1 bg-white border border-[#141414] px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#141414]"
                  />
                  <button 
                    onClick={() => onQuery('balanceOf')}
                    disabled={isExplorerLoading || !explorerAddress}
                    className="bg-[#141414] text-[#E4E3E0] px-4 py-2 text-[10px] uppercase font-bold hover:bg-purple-600 transition-colors disabled:opacity-50"
                  >
                    BalanceOf
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase opacity-50 font-bold">Base URI Configuration</label>
                <p className="text-[9px] opacity-60 italic mb-2">Update the global metadata prefix for all tokens. Requires Owner permissions.</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={baseUriInput}
                    onChange={(e) => setBaseUriInput(e.target.value)}
                    placeholder="ipfs://CID/ or https://api.com/"
                    className="flex-1 bg-white border border-[#141414] px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#141414]"
                  />
                  <button 
                    onClick={handleSetBaseURI}
                    disabled={isSettingBaseUri || !baseUriInput}
                    className="bg-[#141414] text-[#E4E3E0] px-4 py-2 text-[10px] uppercase font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSettingBaseUri ? <Loader2 className="w-3 h-3 animate-spin" /> : <Globe className="w-3 h-3" />}
                    Set URI
                  </button>
                </div>
              </div>
              <div className="p-4 border border-[#141414]/10 bg-[#141414]/5">
                <p className="text-[9px] uppercase font-bold opacity-50 mb-1">Security Warning</p>
                <p className="text-[9px] leading-relaxed">Changes to the Base URI affect all existing and future tokens. Ensure the new endpoint is stable and accessible.</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#141414] p-6 flex flex-col justify-center items-center text-center min-h-[200px]">
          {isExplorerLoading ? (
            <Loader2 className="w-8 h-8 animate-spin text-[#E4E3E0]" />
          ) : explorerResult ? (
            <div className="space-y-2 w-full">
              <p className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest">{explorerResult.label}</p>
              <p className="text-white font-mono text-xs break-all border border-white/20 p-3 bg-white/5">
                {explorerResult.value}
              </p>
            </div>
          ) : (
            <div className="opacity-30 space-y-2">
              <Database className="w-8 h-8 mx-auto text-[#E4E3E0]" />
              <p className="text-[10px] text-[#E4E3E0] uppercase font-bold">Awaiting Query Parameters</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
