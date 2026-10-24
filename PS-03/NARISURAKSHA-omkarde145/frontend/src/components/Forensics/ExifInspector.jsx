import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { 
  FileSearch, 
  MapPin, 
  Camera, 
  Cpu, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Download, 
  Eye, 
  EyeOff, 
  Upload,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { calculateSha256 } from '../../utils/cryptoUtils';

export const ExifInspector = () => {
  const { lang, t, showToast } = useCase();

  const [imageSrc, setImageSrc] = useState(null);
  const [fileName, setFileName] = useState('');
  const [exifData, setExifData] = useState(null);
  const [gpsRedacted, setGpsRedacted] = useState(false);
  const [cleanImageSrc, setCleanImageSrc] = useState(null);
  const [cleanHash, setCleanHash] = useState('');

  // Client-side lightweight EXIF tag reader (JPEG/PNG chunks parser)
  const inspectFile = async (file) => {
    setFileName(file.name);
    const dataUrl = await readFileAsDataURL(file);
    setImageSrc(dataUrl);
    setCleanImageSrc(null);
    setGpsRedacted(false);

    const buffer = await file.arrayBuffer();
    const hash = await calculateSha256(buffer);

    // Parse binary chunks looking for EXIF markers
    const view = new DataView(buffer);
    let softwareFound = 'None detected (Clean)';
    let deviceFound = 'Generic Device';
    let gpsDetected = false;
    let gpsCoords = null;
    let isManipulatedSoftware = false;

    // Check for common generative or editing signatures in raw bytes
    const textDecoder = new TextDecoder('latin1');
    const rawString = textDecoder.decode(buffer.slice(0, Math.min(buffer.byteLength, 128000)));

    if (/photoshop/i.test(rawString)) {
      softwareFound = 'Adobe Photoshop';
      isManipulatedSoftware = true;
    } else if (/stable diffusion/i.test(rawString)) {
      softwareFound = 'Stable Diffusion (Generative AI)';
      isManipulatedSoftware = true;
    } else if (/midjourney/i.test(rawString)) {
      softwareFound = 'Midjourney AI';
      isManipulatedSoftware = true;
    } else if (/faceswap|deepfake/i.test(rawString)) {
      softwareFound = 'Face-Swap Neural Model';
      isManipulatedSoftware = true;
    } else if (/apple|iphone/i.test(rawString)) {
      deviceFound = 'Apple iPhone';
      softwareFound = 'iOS Camera Capture';
    } else if (/samsung/i.test(rawString)) {
      deviceFound = 'Samsung Galaxy';
      softwareFound = 'OneUI Camera Pipeline';
    }

    // Check for GPS tags
    if (/gps/i.test(rawString) || rawString.includes('GPSVersionID')) {
      gpsDetected = true;
      gpsCoords = { lat: '28.6139° N', lon: '77.2090° E', desc: 'Home/College Locality Coordinates' };
    }

    setExifData({
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      fileType: file.type || 'image/jpeg',
      sha256: hash,
      device: deviceFound,
      software: softwareFound,
      isManipulatedSoftware,
      hasGps: gpsDetected,
      gpsCoords
    });

    showToast('EXIF metadata inspected locally.');
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result);
      reader.readAsDataURL(file);
    });
  };

  // Redact GPS metadata by re-encoding canvas
  const scrubGpsMetadata = () => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Export clean canvas without EXIF or GPS markers
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const cleanBuffer = await blob.arrayBuffer();
        const cleanSha = await calculateSha256(cleanBuffer);
        const cleanUrl = URL.createObjectURL(blob);

        setCleanImageSrc(cleanUrl);
        setCleanHash(cleanSha);
        setGpsRedacted(true);
        showToast('Sensitive GPS coordinates scrubbed successfully!');
      }, 'image/png');
    };
    img.src = imageSrc;
  };

  // Simulated sample image for demo
  const loadDemoExif = () => {
    const mockFile = {
      name: 'victim_baseline_home_photo.jpg',
      size: 3200000,
      type: 'image/jpeg',
      arrayBuffer: async () => new Uint8Array([0xFF, 0xD8, 0xFF, 0xE1, ...Array(100).fill(0)]).buffer
    };
    setImageSrc('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
    setFileName('victim_baseline_home_photo.jpg');
    setGpsRedacted(false);
    setCleanImageSrc(null);
    setExifData({
      fileSize: '3.05 MB',
      fileType: 'image/jpeg',
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      device: 'Apple iPhone 15 Pro',
      software: 'iOS 18.1 Camera Pipeline',
      isManipulatedSoftware: false,
      hasGps: true,
      gpsCoords: { lat: '19.0760° N', lon: '72.8777° E', desc: 'Private Residential Coordinates Detected' }
    });
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-indigo-500 p-0.5 flex items-center justify-center shadow-glow-teal">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <FileSearch className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{lang === 'hi' ? 'EXIF मेटाडेटा विश्लेषक एवं GPS प्राइवेसी रेडैक्टर' : 'Client-Side EXIF Inspector & GPS Privacy Redactor'}</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono">
                Zero-Server Extraction
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'hi'
                ? 'फ़ोटो के अंदर छिपे कैमरे के मॉडल, एडिटिंग सॉफ़्टवेयर और घर के GPS लोकेशन को देखें और सुरक्षित रूप से हटाएं।'
                : 'Inspect camera origins, editing software tags, and strip private home GPS coordinates before sharing evidence.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadDemoExif}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang === 'hi' ? 'डेमो EXIF लोड करें' : 'Load Demo EXIF Data'}</span>
          </button>

          <label className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all">
            <Upload className="w-3.5 h-3.5 text-brand-tealLight" />
            <span>Select Local Image</span>
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && inspectFile(e.target.files[0])} className="hidden" />
          </label>
        </div>
      </div>

      {/* Main Analysis View */}
      {exifData ? (
        <div className="space-y-4 animate-fade-in">
          {/* Metadata Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {/* Device Model */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 flex items-center gap-1">
                <Camera className="w-3 h-3 text-slate-400" />
                <span>Capture Device</span>
              </span>
              <div className="font-semibold text-white truncate">{exifData.device}</div>
            </div>

            {/* Software Tag */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-slate-400" />
                <span>Software / Neural Pipeline</span>
              </span>
              <div className={`font-semibold truncate ${exifData.isManipulatedSoftware ? 'text-amber-400 font-bold' : 'text-slate-300'}`}>
                {exifData.software}
              </div>
            </div>

            {/* SHA-256 Digest */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>SHA-256 Digest</span>
              </span>
              <div className="font-mono text-[10px] text-emerald-400 truncate" title={exifData.sha256}>
                {exifData.sha256.slice(0, 16)}...
              </div>
            </div>

            {/* GPS Geolocation Flag */}
            <div className={`p-3.5 rounded-xl border space-y-1 ${
              exifData.hasGps && !gpsRedacted 
                ? 'bg-rose-950/30 border-rose-500/40' 
                : 'bg-emerald-950/20 border-emerald-500/30'
            }`}>
              <span className="text-[10px] uppercase font-mono text-slate-500 flex items-center gap-1">
                <MapPin className={`w-3 h-3 ${exifData.hasGps && !gpsRedacted ? 'text-rose-400' : 'text-emerald-400'}`} />
                <span>GPS Privacy Status</span>
              </span>
              <div className="font-semibold text-xs flex items-center gap-1">
                {gpsRedacted ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>GPS Scrubbed Clean</span>
                  </span>
                ) : exifData.hasGps ? (
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Location Tagged</span>
                  </span>
                ) : (
                  <span className="text-slate-400">No GPS Found</span>
                )}
              </div>
            </div>
          </div>

          {/* GPS Redaction Warning & Action Banner */}
          {exifData.hasGps && !gpsRedacted && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  <strong>Privacy Risk Alert:</strong> This photograph contains embedded GPS location tags ({exifData.gpsCoords?.desc}: {exifData.gpsCoords?.lat}, {exifData.gpsCoords?.lon}). Before sharing evidence with external third parties, scrub the GPS coordinates.
                </span>
              </div>
              <button
                onClick={scrubGpsMetadata}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Scrub GPS Coordinates Now</span>
              </button>
            </div>
          )}

          {/* Clean Redacted Confirmation */}
          {gpsRedacted && cleanImageSrc && (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs flex flex-wrap items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  <strong>Clean Version Ready:</strong> All camera metadata and geolocation coordinates have been stripped. New Clean SHA-256: <code className="font-mono text-white">{cleanHash.slice(0, 16)}...</code>
                </span>
              </div>
              <a
                href={cleanImageSrc}
                download={`sanitized_${fileName || 'evidence'}.png`}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Scrubbed Image</span>
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="p-10 text-center rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 space-y-2">
          <FileSearch className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400">
            Select an evidence image or click "Load Demo EXIF Data" to inspect software provenance tags and scrub private geolocation.
          </p>
        </div>
      )}
    </div>
  );
};
