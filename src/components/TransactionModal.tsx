import React from 'react';
import { TransactionState } from '../types/card';
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  X,
  Sparkles,
  Cpu,
} from 'lucide-react';
import { useSimulatedWallet } from '../context/SimulatedWalletContext';

interface TransactionModalProps {
  state: TransactionState;
  onClose: () => void;
  onViewMintedCard?: (tokenId: number) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  state,
  onClose,
  onViewMintedCard,
}) => {
  const { account } = useSimulatedWallet();

  if (state.status === 'idle') return null;

  const isPending =
    state.status === 'uploading_image' ||
    state.status === 'uploading_metadata' ||
    state.status === 'waiting_wallet' ||
    state.status === 'confirming';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-900 text-center">
        
        {/* Close Button when not actively processing */}
        {!isPending && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Status Graphic / Spinner */}
        <div className="flex justify-center mb-5">
          {isPending && (
            <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#EA580C] relative">
              <Loader2 className="w-8 h-8 animate-spin text-[#EA580C]" />
            </div>
          )}

          {state.status === 'success' && (
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-9 h-9" />
            </div>
          )}

          {state.status === 'error' && (
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <AlertCircle className="w-9 h-9" />
            </div>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="font-heading text-xl font-bold mb-2 text-slate-900">
          {state.status === 'uploading_image' && 'Uploading Artwork to IPFS'}
          {state.status === 'uploading_metadata' && 'Pinning Metadata to IPFS'}
          {state.status === 'waiting_wallet' && 'Simulating Wallet Signature'}
          {state.status === 'confirming' && 'Confirming on Simulated Blockchain'}
          {state.status === 'success' && 'Transaction Confirmed!'}
          {state.status === 'error' && 'Transaction Failed'}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
          {state.message || state.error || 'Processing your request on the simulated decentralized network...'}
        </p>

        {/* Flow Step Progress Indicators */}
        {isPending && (
          <div className="space-y-2 mb-6 text-left bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
            <div
              className={`flex items-center gap-2 ${
                state.status === 'uploading_image'
                  ? 'text-[#EA580C] font-semibold'
                  : 'text-slate-500'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  state.status === 'uploading_image'
                    ? 'bg-[#EA580C] animate-pulse'
                    : 'bg-slate-300'
                }`}
              />
              <span>1. Upload image to Pinata IPFS</span>
            </div>

            <div
              className={`flex items-center gap-2 ${
                state.status === 'uploading_metadata'
                  ? 'text-[#EA580C] font-semibold'
                  : 'text-slate-500'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  state.status === 'uploading_metadata'
                    ? 'bg-[#EA580C] animate-pulse'
                    : 'bg-slate-300'
                }`}
              />
              <span>2. Generate & pin metadata JSON</span>
            </div>

            <div
              className={`flex items-center gap-2 ${
                state.status === 'waiting_wallet' || state.status === 'confirming'
                  ? 'text-[#EA580C] font-semibold'
                  : 'text-slate-500'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  state.status === 'waiting_wallet' || state.status === 'confirming'
                    ? 'bg-[#EA580C] animate-pulse'
                    : 'bg-slate-300'
                }`}
              />
              <span>3. Simulated blockchain state transition</span>
            </div>
          </div>
        )}

        {/* Tx Hash / Explorer Link */}
        {state.txHash && (
          <div className="mb-6 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                Simulated Transaction Hash
              </span>
              <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                Sepolia EVM
              </span>
            </div>
            <div className="font-mono text-[11px] text-slate-800 break-all mb-2 select-all bg-white p-2 rounded-lg border border-slate-200/80">
              {state.txHash}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Account: {account.name}</span>
              <span className="text-emerald-700 font-semibold">Status: Success (Instant)</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        {!isPending && (
          <div className="flex gap-3">
            {state.status === 'success' && state.tokenId && onViewMintedCard && (
              <button
                onClick={() => {
                  onClose();
                  onViewMintedCard(state.tokenId!);
                }}
                className="flex-1 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-300 text-xs font-semibold text-[#EA580C] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-[#EA580C]" />
                View Vehicle
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
