import React, { useState, useEffect } from 'react';
import { X, KeyRound, ExternalLink, CheckCircle, Database } from 'lucide-react';
import { getPinataJWT, setPinataJWT } from '../services/pinata';

interface PinataSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PinataSettingsModal: React.FC<PinataSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [jwt, setJwt] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setJwt(getPinataJWT());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPinataJWT(jwt);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#EA580C]">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold">IPFS Pinata Configuration</h3>
            <p className="text-xs text-slate-500">Decentralized Image & Metadata Storage</p>
          </div>
        </div>

        {/* Explainer Box */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 leading-relaxed">
          <div className="flex items-center gap-2 text-[#EA580C] font-semibold">
            <Database className="w-4 h-4" />
            <span>Real IPFS Upload Pipeline</span>
          </div>
          <p>
            When minting, the card artwork and metadata JSON are pinned directly to IPFS via Pinata.
            The smart contract then stores the resulting <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[#EA580C]">ipfs://CID</code> URI.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Pinata JWT Token (Optional)
            </label>
            <textarea
              rows={3}
              value={jwt}
              onChange={(e) => setJwt(e.target.value)}
              placeholder="Paste your Pinata API JWT token here (Bearer eyJhbGciOi...)"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-orange-500/10 transition-all resize-none"
            />
            <p className="mt-1.5 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Saved in local session. Leave empty to use fallback IPFS resolver.</span>
              <a
                href="https://app.pinata.cloud/developers/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-[#EA580C] hover:underline flex items-center gap-1 font-medium"
              >
                Get Pinata Key <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-white" />
                  Saved!
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
