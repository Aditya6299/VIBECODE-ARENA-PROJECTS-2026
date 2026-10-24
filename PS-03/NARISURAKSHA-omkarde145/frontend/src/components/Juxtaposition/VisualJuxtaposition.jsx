import React, { useState, useRef, useEffect } from 'react';
import { useCase } from '../../context/CaseContext';
import { 
  Split, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Upload, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  Eye, 
  CheckCircle2, 
  FileText,
  Sliders,
  Copy,
  Info
} from 'lucide-react';
import { calculateSha256 } from '../../utils/cryptoUtils';

export const VisualJuxtaposition = () => {
  const { lang, t, showToast } = useCase();

  // Images state (data URLs or SVGs)
  const [originalImage, setOriginalImage] = useState(null);
  const [morphedImage, setMorphedImage] = useState(null);
  const [originalHash, setOriginalHash] = useState('');
  const [morphedHash, setMorphedHash] = useState('');
  const [originalMeta, setOriginalMeta] = useState({ name: '', size: '', type: '' });
  const [morphedMeta, setMorphedMeta] = useState({ name: '', size: '', type: '' });

  // Slider controls
  const [sliderPos, setSliderPos] = useState(50); // 0 to 100%
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState('slider'); // 'slider' | 'side-by-side' | 'difference'
  const [zoomLevel, setZoomLevel] = useState(1);
  const containerRef = useRef(null);

  // Forensic observations checklist
  const [anomalies, setAnomalies] = useState({
    neckSeam: true,
    lightingMismatch: true,
    skinToneBoundary: true,
    pixelDistortion: true,
    earPositioning: false
  });

  // Pre-load simulated demo comparison images
  const loadDemoComparison = async () => {
    // Generate high-resolution SVG visual representations for demo
    const svgOriginal = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%231e293b"/>
          <stop offset="100%" stop-color="%230f172a"/>
        </linearGradient>
      </defs>
      <rect width="600" height="600" fill="url(%23bg)"/>
      <circle cx="300" cy="220" r="100" fill="%23fbcfe8" stroke="%23ec4899" stroke-width="4"/>
      <path d="M 230,340 C 230,280 370,280 370,340 L 420,520 L 180,520 Z" fill="%233b82f6"/>
      <text x="300" y="80" font-family="sans-serif" font-size="20" font-weight="bold" fill="%2338bdf8" text-anchor="middle">BASELINE ORIGINAL PHOTO</text>
      <text x="300" y="110" font-family="sans-serif" font-size="14" fill="%2394a3b8" text-anchor="middle">College Fest Portrait (Nov 2025)</text>
      <text x="300" y="225" font-family="sans-serif" font-size="16" fill="%230f172a" text-anchor="middle">Authentic Facial Symmetry</text>
      <rect x="220" y="440" width="160" height="30" rx="6" fill="%2310b981"/>
      <text x="300" y="460" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23ffffff" text-anchor="middle">Natural Lighting Vector: 45°</text>
    </svg>`;

    const svgMorphed = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <defs>
        <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%23450a0a"/>
          <stop offset="100%" stop-color="%2318181b"/>
        </linearGradient>
      </defs>
      <rect width="600" height="600" fill="url(%23bg2)"/>
      <!-- Distorted / Transposed Face -->
      <circle cx="300" cy="215" r="98" fill="%23fed7aa" stroke="%23ef4444" stroke-width="5" stroke-dasharray="8,4"/>
      <!-- Foreign Morphed Torso -->
      <path d="M 200,340 C 200,260 400,260 400,340 L 460,540 L 140,540 Z" fill="%23b91c1c"/>
      <text x="300" y="80" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23f87171" text-anchor="middle">MORPHED / DEEPFAKE EXPLICIT MEDIA</text>
      <text x="300" y="110" font-family="sans-serif" font-size="14" fill="%23fca5a5" text-anchor="middle">Transposed onto Non-Consensual Model</text>
      <!-- Boundary Anomaly Seam Line -->
      <line x1="220" y1="310" x2="380" y2="310" stroke="%23f59e0b" stroke-width="4" stroke-dasharray="4,4"/>
      <text x="300" y="300" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23fbbf24" text-anchor="middle">[!] NECK SEAM ARTIFACT (Face-Swap Boundary)</text>
      <rect x="200" y="440" width="200" height="30" rx="6" fill="%23dc2626"/>
      <text x="300" y="460" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23ffffff" text-anchor="middle">Lighting Conflict: Flash vs Ambient</text>
    </svg>`;

    setOriginalImage(svgOriginal);
    setMorphedImage(svgMorphed);
    setOriginalHash('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    setMorphedHash('8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4');
    setOriginalMeta({ name: 'priya_fest_original.jpg', size: '2.4 MB', type: 'image/jpeg' });
    setMorphedMeta({ name: 'morphed_threat_leak.png', size: '1.8 MB', type: 'image/png' });

    showToast(lang === 'hi' ? 'तुलना के लिए सिमुलेटेड डेमो केस लोड हो गया।' : 'Loaded simulated comparison case for deepfake analysis.');
  };

  // Handle local file uploads with Web Crypto SHA-256 calculation
  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result;
      const buffer = await file.arrayBuffer();
      const hash = await calculateSha256(buffer);

      if (type === 'original') {
        setOriginalImage(dataUrl);
        setOriginalHash(hash);
        setOriginalMeta({ name: file.name, size: `${(file.size / 1024 / 1024).toFixed(2)} MB`, type: file.type });
      } else {
        setMorphedImage(dataUrl);
        setMorphedHash(hash);
        setMorphedMeta({ name: file.name, size: `${(file.size / 1024 / 1024).toFixed(2)} MB`, type: file.type });
      }
    };
    reader.readAsDataURL(file);
  };

  // Dragging slider handle calculations
  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  };

  // Copy hash utility
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard`);
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-teal via-indigo-500 to-rose-400 p-0.5 flex items-center justify-center shadow-glow-teal">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Split className="w-6 h-6 text-brand-tealLight" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{lang === 'hi' ? 'विज़ुअल जुक्सटापोजिशन तुलना टूल' : 'Visual Juxtaposition Comparison Tool'}</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-brand-teal/20 text-brand-tealLight border border-brand-teal/40 text-[10px] font-mono">
                {lang === 'hi' ? 'ऑन-डिवाइस फोरेंसिक' : 'Client-Side Forensics'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'hi'
                ? 'मूल तस्वीर और मॉर्फ्ड तस्वीर की तुलना करके साबित करें कि चेहरा डिजिटल रूप से बदला गया है।'
                : 'Prove fabrication by visually overlaying your unaltered baseline photo directly over the manipulated media.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadDemoComparison}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang === 'hi' ? 'डेमो तुलना लोड करें' : 'Load Demo Comparison'}</span>
          </button>

          {/* Mode Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('slider')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                viewMode === 'slider' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              {lang === 'hi' ? 'स्प्लिट स्लाइडर' : 'Split Slider'}
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                viewMode === 'side-by-side' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              {lang === 'hi' ? 'आमने-सामने' : 'Side-by-Side'}
            </button>
          </div>
        </div>
      </div>

      {/* Upload Dropzones (If images not loaded) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Baseline Upload */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'hi' ? '1. मूल प्रामाणिक फ़ोटो (Baseline Photo)' : '1. Authentic Baseline Photograph'}</span>
            </span>
            <label className="cursor-pointer px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 flex items-center gap-1">
              <Upload className="w-3 h-3 text-brand-tealLight" />
              <span>{originalImage ? 'Change Photo' : 'Upload Original'}</span>
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'original')} className="hidden" />
            </label>
          </div>
          {originalMeta.name && (
            <div className="text-[11px] font-mono text-slate-400 truncate flex items-center justify-between">
              <span>{originalMeta.name} ({originalMeta.size})</span>
              <button 
                onClick={() => copyToClipboard(originalHash, 'Original SHA-256')} 
                className="text-brand-tealLight hover:underline ml-2 flex items-center gap-0.5 text-[10px]"
              >
                <Copy className="w-2.5 h-2.5" />
                <span>SHA-256: {originalHash.slice(0, 10)}...</span>
              </button>
            </div>
          )}
        </div>

        {/* Morphed Media Upload */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>{lang === 'hi' ? '2. मॉर्फ्ड / फ़ेक छवि (Morphed Media)' : '2. Morphed / Deepfake Abuse Media'}</span>
            </span>
            <label className="cursor-pointer px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 flex items-center gap-1">
              <Upload className="w-3 h-3 text-rose-400" />
              <span>{morphedImage ? 'Change Photo' : 'Upload Morphed'}</span>
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'morphed')} className="hidden" />
            </label>
          </div>
          {morphedMeta.name && (
            <div className="text-[11px] font-mono text-slate-400 truncate flex items-center justify-between">
              <span>{morphedMeta.name} ({morphedMeta.size})</span>
              <button 
                onClick={() => copyToClipboard(morphedHash, 'Morphed SHA-256')} 
                className="text-rose-400 hover:underline ml-2 flex items-center gap-0.5 text-[10px]"
              >
                <Copy className="w-2.5 h-2.5" />
                <span>SHA-256: {morphedHash.slice(0, 10)}...</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Comparison Stage */}
      {originalImage && morphedImage ? (
        <div className="space-y-4">
          {viewMode === 'slider' ? (
            /* Interactive Split-Screen Slider View */
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onTouchEnd={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              className="relative w-full h-[460px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 cursor-ew-resize select-none shadow-2xl"
            >
              {/* Morphed Image (Background full layer) */}
              <img
                src={morphedImage}
                alt="Morphed Deepfake"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                style={{ transform: `scale(${zoomLevel})` }}
              />

              {/* Original Image (Clipped overlay layer) */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none border-r-2 border-brand-teal shadow-[0_0_20px_rgba(20,184,166,0.5)]"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={originalImage}
                  alt="Original Baseline"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  style={{
                    width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                    maxWidth: 'none',
                    transform: `scale(${zoomLevel})`
                  }}
                />
                {/* Original Label Tag */}
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold tracking-wider uppercase">
                  Baseline Original (Genuine)
                </span>
              </div>

              {/* Morphed Label Tag */}
              <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-950/80 border border-rose-500/40 text-rose-300 text-[10px] font-mono font-bold tracking-wider uppercase">
                Manipulated Composite (Morphed)
              </span>

              {/* Draggable Divider Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-brand-teal cursor-ew-resize z-20 flex items-center justify-center"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-slate-950 border-2 border-brand-teal flex items-center justify-center shadow-glow-teal text-white text-xs font-mono font-bold">
                  ↔
                </div>
              </div>

              {/* Bottom Percentage Pill */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-300 pointer-events-none">
                Split Ratio: <span className="text-brand-tealLight font-bold">{sliderPos}%</span> Original / <span className="text-rose-400 font-bold">{100 - sliderPos}%</span> Morphed
              </div>
            </div>
          ) : (
            /* Side-by-Side Dual View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[440px]">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-2">
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">
                  Baseline Original
                </span>
                <img src={originalImage} alt="Original" className="max-h-full max-w-full object-contain" />
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-2">
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-rose-500/40 text-rose-300 text-[10px] font-mono font-bold">
                  Morphed Deepfake
                </span>
                <img src={morphedImage} alt="Morphed" className="max-h-full max-w-full object-contain" />
              </div>
            </div>
          )}

          {/* Zoom and Slider Reset Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-tealLight" />
              <span className="text-slate-400">Position:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="w-32 accent-brand-teal cursor-pointer"
              />
              <span className="font-mono text-brand-tealLight">{sliderPos}%</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.25))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-slate-400 text-[11px]">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(2.5, zoomLevel + 0.25))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setZoomLevel(1); setSliderPos(50); }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white ml-2"
                title="Reset Zoom & Slider"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State Prompt */
        <div className="p-12 text-center rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-tealLight">
            <Split className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">
              {lang === 'hi' ? 'तुलना शुरू करने के लिए दोनों तस्वीरें लोड करें' : 'Load Both Images to Start Juxtaposition Analysis'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {lang === 'hi'
                ? 'ऊपर "डेमो तुलना लोड करें" दबाएं या अपनी मूल तस्वीर और मॉर्फ्ड स्क्रीनशॉट अपलोड करें।'
                : 'Click "Load Demo Comparison" above or upload an authentic baseline photo alongside the suspected deepfake.'}
            </p>
          </div>
        </div>
      )}

      {/* Forensic Discrepancy Checklist */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-tealLight" />
            <span>{lang === 'hi' ? 'न्यायिक साक्ष्य विसंगति चेकलिस्ट' : 'Judicial Artifact & Discrepancy Manifest'}</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Section 65B Forensic Annexure</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {[
            { key: 'neckSeam', en: 'Neck / Torso Seam Boundary Mismatch', hi: 'गर्दन और धड़ की सीमा रेखा में असंगति' },
            { key: 'lightingMismatch', en: 'Lighting Angle Inconsistency (Face vs Body)', hi: 'प्रकाश कोण में अंतर (चेहरा बनाम शरीर)' },
            { key: 'skinToneBoundary', en: 'Skin Tone & Texture Discontinuity', hi: 'त्वचा के रंग और बनावट में विसंगति' },
            { key: 'pixelDistortion', en: 'Compression Artifacts on Facial Perimeter', hi: 'चेहरे की परिधि पर डिजिटल विकृति' },
            { key: 'earPositioning', en: 'Ear / Hairline Alignment Discrepancy', hi: 'कान और बालों की स्थिति में अंतर' }
          ].map(item => (
            <label
              key={item.key}
              className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-all ${
                anomalies[item.key]
                  ? 'bg-brand-teal/10 border-brand-teal/40 text-slate-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={anomalies[item.key]}
                onChange={(e) => setAnomalies({ ...anomalies, [item.key]: e.target.checked })}
                className="rounded accent-brand-teal"
              />
              <span className="text-[11px] font-medium leading-snug">{lang === 'hi' ? item.hi : item.en}</span>
            </label>
          ))}
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-800/80">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-brand-tealLight" />
            <span>{lang === 'hi' ? 'यह तुलना डॉसियर में पुलिस एवं कोर्ट हेतु संलग्न की जाती है।' : 'These observations are compiled into the official Section 65B court dossier.'}</span>
          </span>

          <button
            onClick={() => showToast(lang === 'hi' ? 'तुलना रिपोर्ट डॉसियर में जोड़ दी गई है।' : 'Juxtaposition proof saved to Section 65B Dossier.')}
            className="px-3 py-1.5 rounded-lg bg-brand-teal/20 hover:bg-brand-teal/30 border border-brand-teal/40 text-brand-tealLight text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'डॉसियर में साक्ष्य जोड़ें' : 'Attach Juxtaposition to Dossier'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
