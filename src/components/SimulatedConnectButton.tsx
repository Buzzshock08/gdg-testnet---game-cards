import React, { useState, useRef, useEffect } from 'react';
import { useSimulatedWallet } from '../context/SimulatedWalletContext';
import { shortenAddress } from '../services/contractService';
import {
  Wallet,
  ChevronDown,
  Check,
  LogOut,
  Users,
  Copy,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const SimulatedConnectButton: React.FC = () => {
  const {
    account,
    address,
    isConnected,
    accounts,
    switchAccount,
    connectWallet,
    disconnectWallet,
    balanceEth,
  } = useSimulatedWallet();

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isConnected) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <Wallet className="w-4 h-4" />
          <span>Connect Wallet</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in">
            <div className="px-2 py-1.5 mb-2 border-b border-slate-100">
              <span className="text-[11px] font-mono text-slate-500 uppercase font-semibold block">
                Select Simulated Account
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Instant connection without browser extension required
              </p>
            </div>

            <div className="space-y-1">
              {accounts.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => {
                    connectWallet(acc.id);
                    setIsOpen(false);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-orange-50/70 border border-transparent hover:border-orange-200 text-left transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-xs"
                      style={{ backgroundColor: acc.avatarColor }}
                    >
                      {acc.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#EA580C]">
                        {acc.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {shortenAddress(acc.address)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-xs font-bold text-slate-900">{acc.balanceEth} ETH</div>
                    <div className="text-[10px] text-emerald-600 font-medium">Ready</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-xs transition-all flex items-center gap-2 cursor-pointer group"
      >
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center text-white font-bold text-[11px] shadow-xs"
          style={{ backgroundColor: account.avatarColor }}
        >
          {account.name.charAt(0)}
        </div>

        <div className="text-left hidden sm:block leading-tight">
          <div className="text-[11px] font-bold text-slate-900 flex items-center gap-1">
            <span>{account.name.split(' ')[0]}</span>
            <span className="text-[10px] text-slate-400 font-mono font-normal">({shortenAddress(address)})</span>
          </div>
          <div className="text-[10px] font-mono font-semibold text-[#EA580C]">
            {balanceEth.toFixed(2)} ETH
          </div>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Account Switcher & Details Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in">
          {/* Header Status */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-700">Simulated Wallet Active</span>
            </div>
            <button
              onClick={disconnectWallet}
              className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
              title="Disconnect"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Disconnect</span>
            </button>
          </div>

          {/* Active Account Overview */}
          <div className="my-3 p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200/80 text-left">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                Current Active Account
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                Sepolia
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>{account.name}</span>
              <span className="text-[#EA580C] font-mono font-bold">{balanceEth.toFixed(4)} ETH</span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-orange-200/60 text-xs font-mono text-slate-600">
              <span>{shortenAddress(address)}</span>
              <button
                onClick={handleCopy}
                className="p-1 hover:text-[#EA580C] flex items-center gap-1 cursor-pointer"
                title="Copy Address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Switch Accounts List */}
          <div className="space-y-1 mt-3">
            <div className="px-1 py-1 flex items-center justify-between text-[11px] font-mono uppercase text-slate-400 font-semibold">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                Switch Account
              </span>
              <span className="text-[10px] text-slate-400 lowercase">click to switch</span>
            </div>

            {accounts.map((acc) => {
              const isActive = acc.id === account.id;
              return (
                <button
                  key={acc.id}
                  onClick={() => {
                    switchAccount(acc.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-orange-50/80 border-orange-300 shadow-xs'
                      : 'hover:bg-slate-50 border-transparent hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-xs"
                      style={{ backgroundColor: acc.avatarColor }}
                    >
                      {acc.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 flex items-center gap-1">
                        <span>{acc.name}</span>
                        {isActive && <Check className="w-3.5 h-3.5 text-[#EA580C]" />}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {shortenAddress(acc.address)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs font-bold text-slate-800">
                    {acc.balanceEth} ETH
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
