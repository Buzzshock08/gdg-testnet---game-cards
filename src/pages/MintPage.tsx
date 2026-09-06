import React, { useState, useRef } from 'react';
import { useSimulatedWallet } from '../context/SimulatedWalletContext';
import { CardRarity, CardAttribute, TransactionState } from '../types/card';
import { PRESET_CARDS } from '../data/placeholderCards';
import { LiveCardPreview } from '../components/LiveCardPreview';
import {
  Upload,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Car,
  CheckCircle,
} from 'lucide-react';

interface MintPageProps {
  onMint: (
    imageFile: File | Blob,
    metadata: {
      name: string;
      description: string;
      rarity: CardRarity;
      attributes: CardAttribute[];
    }
  ) => Promise<{ tokenId: number; txHash?: string; ipfsUri: string }>;
  txState: TransactionState;
}

export const MintPage: React.FC<MintPageProps> = ({ onMint, txState }) => {
  const { isConnected } = useSimulatedWallet();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State initialized with Car template
  const [name, setName] = useState(PRESET_CARDS[0].name);
  const [description, setDescription] = useState(PRESET_CARDS[0].description);
  const [rarity, setRarity] = useState<CardRarity>(PRESET_CARDS[0].rarity);
  const [attributes, setAttributes] = useState<CardAttribute[]>([
    ...PRESET_CARDS[0].attributes,
  ]);

  // Image upload state
  const [selectedFile, setSelectedFile] = useState<File | Blob | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(PRESET_CARDS[0].svgArt);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [formError, setFormError] = useState<string | null>(null);

  // Handle Preset selection
  const handleSelectPreset = (idx: number) => {
    const preset = PRESET_CARDS[idx];
    setSelectedPresetIndex(idx);
    setName(preset.name);
    setDescription(preset.description);
    setRarity(preset.rarity);
    setAttributes([...preset.attributes]);
    setImagePreviewUrl(preset.svgArt);

    // Convert SVG data URL to Blob for IPFS upload
    const svgBlob = new Blob([preset.svgArt], { type: 'image/svg+xml' });
    setSelectedFile(svgBlob);
  };

  // Handle File Input Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFormError('Please select a valid image file (PNG, JPG, SVG, WebP).');
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        setFormError('Image is too large (max 8MB). Try a smaller photo — it will still be compressed automatically before storage.');
        return;
      }
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreviewUrl(objectUrl);
      setSelectedPresetIndex(-1); // custom file selected
      setFormError(null);
    }
  };

  // Add attribute row
  const handleAddAttribute = () => {
    setAttributes([...attributes, { trait_type: '', value: '' }]);
  };

  // Remove attribute row
  const handleRemoveAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  // Update attribute
  const handleUpdateAttribute = (
    index: number,
    field: 'trait_type' | 'value',
    val: string
  ) => {
    const updated = [...attributes];
    updated[index][field] = val;
    setAttributes(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isConnected) {
      setFormError('Please connect your simulated wallet before minting.');
      return;
    }

    if (!name.trim()) {
      setFormError('Vehicle model name is required.');
      return;
    }

    let fileToUpload = selectedFile;
    if (!fileToUpload) {
      // Create blob from default preset SVG
      fileToUpload = new Blob([PRESET_CARDS[0].svgArt], { type: 'image/svg+xml' });
    }

    try {
      await onMint(fileToUpload, {
        name,
        description,
        rarity,
        attributes: attributes.filter((a) => a.trait_type.trim() !== ''),
      });
    } catch (err: any) {
      // Error handled by txState
    }
  };

  const isMinting =
    txState.status === 'uploading_image' ||
    txState.status === 'uploading_metadata' ||
    txState.status === 'waiting_wallet' ||
    txState.status === 'confirming';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <span className="text-xs font-mono uppercase tracking-wider text-[#EA580C] font-semibold flex items-center gap-1.5">
          <Car className="w-3.5 h-3.5" />
          <span>Vehicle Customization & Manufacturing</span>
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
          Mint Collectible Car NFT
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Configure vehicle specifications, tier ratings, and custom bodywork artwork. Minted directly to the simulated Ethereum ledger with ERC-721 compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Quick Presets Picker */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                1. Select Vehicle Template Preset (Or Upload Custom)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {PRESET_CARDS.map((preset, idx) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(idx)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      selectedPresetIndex === idx
                        ? 'border-[#EA580C] bg-orange-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-[#EA580C]">
                        {preset.rarity}
                      </span>
                      {selectedPresetIndex === idx && (
                        <CheckCircle className="w-3.5 h-3.5 text-[#EA580C]" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Custom Artwork Upload */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                2. Vehicle Artwork / Render File
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-orange-300 hover:bg-orange-50/30 rounded-2xl p-6 text-center transition-colors cursor-pointer"
              >
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <span className="text-xs font-semibold text-slate-700 block">
                  Click to select vehicle artwork image
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  PNG, JPG, SVG, WebP up to 8MB (Automatically pinned to IPFS)
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* 3. Name & Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  3. Vehicle Model Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Apex Vulcan Hyper-GT"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#EA580C] shadow-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Rarity Classification
                </label>
                <select
                  value={rarity}
                  onChange={(e) => setRarity(e.target.value as CardRarity)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#EA580C] shadow-xs cursor-pointer"
                >
                  <option value="Common">Common</option>
                  <option value="Uncommon">Uncommon</option>
                  <option value="Rare">Rare</option>
                  <option value="Epic">Epic</option>
                  <option value="Legendary">Legendary</option>
                  <option value="Mythic">Mythic</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                4. Vehicle Lore & Technical Overview
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe powertrain, aerodynamics, chassis, and racing heritage..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#EA580C] shadow-xs leading-relaxed"
              />
            </div>

            {/* 4. Custom Attributes & Traits */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  5. Engine & Track Performance Traits
                </label>
                <button
                  type="button"
                  onClick={handleAddAttribute}
                  className="text-xs text-[#EA580C] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Spec</span>
                </button>
              </div>

              <div className="space-y-2">
                {attributes.map((attr, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={attr.trait_type}
                      onChange={(e) =>
                        handleUpdateAttribute(index, 'trait_type', e.target.value)
                      }
                      placeholder="Spec (e.g. Top Speed, Horsepower)"
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#EA580C] shadow-xs"
                    />
                    <input
                      type="text"
                      value={attr.value}
                      onChange={(e) =>
                        handleUpdateAttribute(index, 'value', e.target.value)
                      }
                      placeholder="Value (e.g. 420 km/h, 1450)"
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#EA580C] shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAttribute(index)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove Trait"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Submit Mint Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isMinting}
                className="w-full py-4 rounded-2xl bg-[#EA580C] hover:bg-[#C2410C] disabled:opacity-50 text-white font-heading text-base font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isMinting ? (
                  <span>Minting in Progress...</span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Mint Car NFT to Blockchain</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Card Preview */}
        <div className="lg:col-span-5 sticky top-24">
          <LiveCardPreview
            name={name}
            description={description}
            rarity={rarity}
            attributes={attributes}
            imagePreviewUrl={imagePreviewUrl}
          />
        </div>
      </div>
    </div>
  );
};
