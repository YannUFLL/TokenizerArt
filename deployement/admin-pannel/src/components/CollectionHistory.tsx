import React from 'react';
import { Layers, Loader2, Globe, Car, ExternalLink, Send } from 'lucide-react';
import { CONTRACT_ADDRESS } from '../constants';
import { resolveIpfs } from '../utils/ipfs';
import { TwingoNFT } from '../types';

interface CollectionHistoryProps {
  mintedAssets: any[];
  isLoadingHistory: boolean;
  onRefresh: () => void;
  onSelectNFT: (nft: TwingoNFT) => void;
  currentAccount: string | null;
  onTransfer: (tokenId: string, to: string) => void;
  isTransferring: boolean;
}

export const CollectionHistory: React.FC<CollectionHistoryProps> = ({
  mintedAssets,
  isLoadingHistory,
  onRefresh,
  onSelectNFT,
  currentAccount,
  onTransfer,
  isTransferring
}) => {
  const [transferringId, setTransferringId] = React.useState<string | null>(null);
  const [transferTo, setTransferTo] = React.useState('');

  return (
    <div className="border border-[#141414] bg-white shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
      <div className="border-b border-[#141414] p-3 bg-[#f0f0f0] flex justify-between items-center">
        <span className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
          <Layers className="w-3 h-3" /> Collection_History
        </span>
        <button 
          onClick={onRefresh}
          disabled={isLoadingHistory}
          className="text-[9px] font-bold uppercase hover:underline flex items-center gap-1"
        >
          {isLoadingHistory ? <Loader2 className="w-2 h-2 animate-spin" /> : <Globe className="w-2 h-2" />}
          Refresh
        </button>
      </div>
      <div className="p-4 max-h-[400px] overflow-y-auto space-y-3">
        {mintedAssets.length > 0 ? (
          mintedAssets.map((nft) => {
            const isOwner = currentAccount && nft.owner.toLowerCase() === currentAccount.toLowerCase();
            
            return (
              <div key={nft.id} className="space-y-2">
                <div 
                  className="flex gap-4 p-2 border border-[#141414] hover:bg-[#f0f0f0] transition-colors cursor-pointer group"
                  onClick={() => {
                    onSelectNFT({
                      id: `Twingo #${nft.id}`,
                      image: nft.image,
                      traits: [{ name: 'Owner', value: `${nft.owner.slice(0,6)}...${nft.owner.slice(-4)}`, rarity: 'Common' }],
                      descriptionKeyword: 'Minted',
                      timestamp: nft.timestamp
                    });
                  }}
                >
                  <div className="w-16 h-16 bg-[#f0f0f0] border border-[#141414] flex items-center justify-center overflow-hidden">
                    {nft.image ? (
                      <img 
                        src={resolveIpfs(nft.image) || undefined} 
                        className="w-full h-full object-cover" 
                        alt="" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Car className="w-6 h-6 opacity-20" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-xs font-bold">#{nft.id}</p>
                    <p className="text-[9px] opacity-50 font-mono truncate max-w-[120px]">{nft.owner}</p>
                  </div>
                  <div className="flex flex-col gap-1 justify-center">
                    <a 
                      href={`https://sepolia.etherscan.io/token/${CONTRACT_ADDRESS}?a=${nft.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#141414] hover:text-white border border-transparent hover:border-[#141414]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    {isOwner && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTransferringId(transferringId === nft.id ? null : nft.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-orange-600 hover:text-white border border-transparent hover:border-orange-600"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {transferringId === nft.id && (
                  <div className="p-3 border border-orange-600 bg-orange-50 space-y-2 animate-in slide-in-from-top-2 duration-200">
                    <p className="text-[9px] font-bold uppercase text-orange-800">Safe Transfer Protocol</p>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={transferTo}
                        onChange={(e) => setTransferTo(e.target.value)}
                        placeholder="Recipient Address (0x...)"
                        className="flex-1 border border-orange-600 px-2 py-1 text-[10px] focus:outline-none bg-white"
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          onTransfer(nft.id, transferTo);
                          setTransferringId(null);
                          setTransferTo('');
                        }}
                        disabled={isTransferring || !transferTo}
                        className="bg-orange-600 text-white px-3 py-1 text-[9px] font-bold uppercase hover:bg-orange-700 disabled:opacity-50"
                      >
                        {isTransferring ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Send'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : isLoadingHistory ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 opacity-40">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-[10px] uppercase font-bold tracking-widest">Syncing with blockchain...</p>
          </div>
        ) : (
          <p className="text-[10px] opacity-40 text-center py-8 uppercase tracking-widest">
            No assets found on-chain
          </p>
        )}
      </div>
    </div>
  );
};
