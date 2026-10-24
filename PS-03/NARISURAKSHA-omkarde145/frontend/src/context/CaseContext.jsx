import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../data/translations';
import { demoCaseData } from '../data/demoCaseData';
import { calculateSha256 } from '../utils/cryptoUtils';

const CaseContext = createContext(null);

export const CaseProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('intake');
  const [toastMessage, setToastMessage] = useState(null);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const [simulatedSubmission, setSimulatedSubmission] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Intake Wizard State
  const [intakeData, setIntakeData] = useState({
    category: 'morphedNudity',
    severity: 'critical',
    platforms: ['Instagram'],
    otherPlatform: '',
    perpetratorHandle: '',
    profileUrl: '',
    contactMethod: 'Instagram Direct Message',
    extortionDemand: '',
    narrative: '',
    completed: false
  });

  // Checklist State
  const [checklist, setChecklist] = useState({
    clock: false,
    url: false,
    baseline: false,
    dmThread: false,
    noPayment: true // Default safest advice
  });

  // Evidence Vault State (strictly client-side in-memory)
  const [evidenceFiles, setEvidenceFiles] = useState([]);

  // Timeline Events State
  const [timelineEvents, setTimelineEvents] = useState([]);

  // Current translation object
  const t = translations[lang] || translations.en;

  // Show temporary toast notification
  const showToast = useCallback((msg, duration = 3500) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, duration);
  }, []);

  // Emergency Quick Exit Handler
  const executeQuickExit = useCallback(() => {
    try {
      // 1. Clear session and local storage
      sessionStorage.clear();
      localStorage.clear();

      // 2. Revoke any memory object URLs created for previews
      evidenceFiles.forEach(file => {
        if (file.previewUrl && file.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
    } catch (e) {
      console.warn("Storage cleanup error:", e);
    }

    // 3. Instant hard redirect to an innocuous trusted news site
    window.location.replace("https://news.google.com");
  }, [evidenceFiles]);

  // Global listener for ESC key for instant quick exit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        executeQuickExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executeQuickExit]);

  // Intake State updater
  const updateIntakeData = (fields) => {
    setIntakeData(prev => ({ ...prev, ...fields }));
  };

  // Checklist toggle
  const toggleChecklistItem = (id) => {
    setChecklist(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Add real file with client-side SHA-256 calculation
  const addEvidenceFile = async (file, metadata = {}) => {
    try {
      showToast(lang === 'hi' ? 'SHA-256 हैश की गणना की जा रही है...' : 'Computing SHA-256 digest in local browser sandbox...');
      
      const hash = await calculateSha256(file);
      const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;

      const newEvidence = {
        id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        platform: metadata.platform || (intakeData.platforms[0] || 'Unknown Platform'),
        tag: metadata.tag || 'morphedTag',
        timestamp: new Date().toISOString(),
        hash: hash,
        previewUrl: previewUrl,
        description: metadata.description || 'Locally indexed digital screenshot / evidence record.',
        isSimulated: false
      };

      setEvidenceFiles(prev => [newEvidence, ...prev]);
      showToast(lang === 'hi' ? 'साक्ष्य सफलतापूर्वक हैश किया गया!' : 'Evidence file cryptographically digested and added.');
      return newEvidence;
    } catch (err) {
      console.error('Error computing file hash:', err);
      showToast(lang === 'hi' ? 'फ़ाइल हैशिंग में त्रुटि हुई।' : 'Error computing cryptographic hash.');
      return null;
    }
  };

  // Remove evidence file
  const removeEvidenceFile = (id) => {
    setEvidenceFiles(prev => {
      const target = prev.find(f => f.id === id);
      if (target && target.previewUrl && target.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  // Timeline events helpers
  const addTimelineEvent = (eventData) => {
    const newEvent = {
      id: `tl-${Date.now()}`,
      date: eventData.date || new Date().toLocaleString('en-IN'),
      title: eventData.title,
      description: eventData.description,
      evidenceHash: eventData.evidenceHash || ''
    };
    setTimelineEvents(prev => [...prev, newEvent]);
  };

  const removeTimelineEvent = (id) => {
    setTimelineEvents(prev => prev.filter(ev => ev.id !== id));
  };

  // Load Simulated Demo Case
  const loadDemoCase = () => {
    setIntakeData({
      ...demoCaseData.intake,
      completed: true
    });
    setChecklist({ ...demoCaseData.checklist });
    setEvidenceFiles([...demoCaseData.evidenceFiles]);
    setTimelineEvents([...demoCaseData.timelineEvents]);
    setSimulatedSubmission({
      trackingId: demoCaseData.trackingId,
      receivedAt: demoCaseData.createdDate,
      simulated: true
    });
    showToast(t.demoLoadedNotice || 'Simulated demo case loaded successfully for judging/review.');
  };

  // Submit simulated report metadata to backend
  const submitSimulatedReport = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        category: intakeData.category,
        platforms: intakeData.platforms,
        hashList: evidenceFiles.map(e => ({
          name: e.name,
          hash: e.hash,
          size: e.size,
          platform: e.platform
        })),
        incidentSummary: intakeData.narrative.substring(0, 500),
        jurisdiction: "Cyber Crime Unit / cybercrime.gov.in"
      };

      const res = await fetch('/api/simulated-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Network response error');

      const data = await res.json();
      setSimulatedSubmission(data);
      showToast(lang === 'hi' ? `सिम्युलेटेड संदर्भ ID: ${data.trackingId}` : `Simulated Reference ID Generated: ${data.trackingId}`);
      return data;
    } catch (err) {
      console.warn('Backend call failed, using client fallback:', err);
      // Client-side fallback if backend service is unreachable
      const fallbackId = `NCR-2026-F${Math.floor(1000 + Math.random() * 9000)}`;
      const fallbackData = {
        trackingId: fallbackId,
        simulated: true,
        receivedAt: new Date().toISOString()
      };
      setSimulatedSubmission(fallbackData);
      showToast(`Simulated Reference ID Generated: ${fallbackId}`);
      return fallbackData;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CaseContext.Provider
      value={{
        lang,
        setLang,
        t,
        activeTab,
        setActiveTab,
        intakeData,
        updateIntakeData,
        checklist,
        toggleChecklistItem,
        evidenceFiles,
        addEvidenceFile,
        removeEvidenceFile,
        timelineEvents,
        addTimelineEvent,
        removeTimelineEvent,
        loadDemoCase,
        executeQuickExit,
        isDossierModalOpen,
        setIsDossierModalOpen,
        simulatedSubmission,
        submitSimulatedReport,
        isSubmitting,
        toastMessage,
        showToast
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};

export const useCase = () => {
  const context = useContext(CaseContext);
  if (!context) throw new Error('useCase must be used within a CaseProvider');
  return context;
};
