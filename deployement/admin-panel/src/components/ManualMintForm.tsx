import React from 'react';
import { CloudUpload } from 'lucide-react';
import { ManualNFTData } from '../types';

interface ManualMintFormProps {
  manualData: ManualNFTData;
  setManualData: React.Dispatch<React.SetStateAction<ManualNFTData>>;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageDrop: (e: React.DragEvent) => void;
}

export const ManualMintForm: React.FC<ManualMintFormProps> = ({
  manualData,
  setManualData,
  onImageSelect,
  onImageDrop
}) => {
  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#141414]/20 m-4 bg-white/50"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onImageDrop}
    >
      {manualData.imagePreview ? (
        <div className="relative w-full h-full group">
          <img 
            src={manualData.imagePreview} 
            className="w-full h-full object-contain" 
            alt="Preview" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <label className="cursor-pointer bg-white text-[#141414] px-4 py-2 text-[10px] font-bold uppercase">
              Change Image
              <input type="file" className="hidden" accept="image/*" onChange={onImageSelect} />
            </label>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <CloudUpload className="w-16 h-16 mx-auto opacity-20" />
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase">Drag & Drop Asset</p>
            <p className="text-[10px] opacity-50">OR</p>
            <label className="inline-block cursor-pointer bg-[#141414] text-white px-4 py-2 text-[10px] font-bold uppercase hover:bg-emerald-600 transition-colors">
              Browse Files
              <input type="file" className="hidden" accept="image/*" onChange={onImageSelect} />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export const MetadataEditor: React.FC<{
  manualData: ManualNFTData;
  setManualData: React.Dispatch<React.SetStateAction<ManualNFTData>>;
}> = ({ manualData, setManualData }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-[10px] uppercase font-bold opacity-50">Basis Attributes</label>
          <span className="text-[8px] opacity-40 uppercase italic">Empty = "None"</span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {[
            { label: 'Background', key: 'background' },
            { label: 'Decals', key: 'decals' },
            { label: 'Accessories', key: 'accessories' },
            { label: 'Easter Egg', key: 'easterEgg' },
          ].map((attr) => (
            <div key={attr.key} className="flex items-center gap-2">
              <span className="w-24 text-[10px] font-bold uppercase opacity-50">{attr.label}</span>
              <input 
                type="text" 
                value={(manualData as any)[attr.key]}
                onChange={(e) => setManualData(prev => ({ ...prev, [attr.key]: e.target.value }))}
                className="flex-1 border border-[#141414] p-1.5 text-[10px] focus:bg-[#f0f0f0] outline-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
