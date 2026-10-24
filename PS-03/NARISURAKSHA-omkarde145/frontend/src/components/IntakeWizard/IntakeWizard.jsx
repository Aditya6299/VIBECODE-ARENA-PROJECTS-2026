import React, { useState, useRef } from 'react';
import { useCase } from '../../context/CaseContext';
import { 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Layers, 
  Globe, 
  UserX, 
  FileEdit,
  Wand2,
  Send,
  Mic
} from 'lucide-react';

export const IntakeWizard = () => {
  const { 
    t, 
    lang, 
    intakeData, 
    updateIntakeData, 
    setActiveTab, 
    submitSimulatedReport, 
    simulatedSubmission, 
    isSubmitting,
    showToast
  } = useCase();

  const [currentStep, setCurrentStep] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const availablePlatforms = [
    'Instagram',
    'Telegram',
    'WhatsApp',
    'X (Twitter)',
    'Facebook',
    'Snapchat',
    'Reddit',
    'Discord',
    'LinkedIn',
    'Dating Apps (Tinder/Bumble)',
    'Adult / Forum Websites'
  ];

  // Calculate Progress
  const calculateProgress = () => {
    let score = 0;
    if (intakeData.category) score += 25;
    if (intakeData.platforms.length > 0) score += 25;
    if (intakeData.perpetratorHandle || intakeData.profileUrl) score += 25;
    if (intakeData.narrative && intakeData.narrative.trim().length > 30) score += 25;
    return score;
  };

  const progress = calculateProgress();

  const handlePlatformToggle = (platform) => {
    const exists = intakeData.platforms.includes(platform);
    if (exists) {
      updateIntakeData({
        platforms: intakeData.platforms.filter(p => p !== platform)
      });
    } else {
      updateIntakeData({
        platforms: [...intakeData.platforms, platform]
      });
    }
  };

  const generateTemplateNarrative = () => {
    const platformStr = intakeData.platforms.join(', ') || 'online social media platforms';
    const handleStr = intakeData.perpetratorHandle || 'an unidentified individual';
    const demandStr = intakeData.extortionDemand || 'non-consensual dissemination threats';

    const templateEn = `I am submitting this formal evidence dossier regarding non-consensual morphed deepfake imagery and harassment occurring on ${platformStr}.

The perpetrator operating under username/handle '${handleStr}' has generated and possessed altered sexually explicit imagery depicting my likeness without my knowledge or consent. The altered material was manufactured by transposing facial features from my legitimate public photographs onto explicit bodies.

On or about recent dates, the perpetrator initiated contact demanding '${demandStr}' and threatening viral dissemination across contacts, public channels, and educational/workplace peers.

I explicitly affirm that I have never consented to the creation, distribution, or transmission of any such imagery. I have preserved full uninterrupted chat logs, baseline comparison media, and cryptographic SHA-256 evidence digests attached in this dossier under Section 65B of the Indian Evidence Act / BSA.`;

    const templateHi = `मैं ${platformStr} पर घटित बिना-सहमति मॉर्फ्ड डीपफ़ेक तस्वीरों और उत्पीड़न के संबंध में यह औपचारिक साक्ष्य डॉसियर प्रस्तुत कर रही हूँ।

यूज़रनेम/हैंडल '${handleStr}' के तहत काम करने वाले अज्ञात व्यक्ति ने मेरी वास्तविक तस्वीरों से चेहरे के फीचर्स चुराकर मेरी सहमति के बिना यौन रूप से स्पष्ट मॉर्फ्ड तस्वीरें तैयार की हैं।

अपराधी द्वारा '${demandStr}' की मांग करते हुए इन तस्वीरों को परिजनों और सोशल मीडिया ग्रुप्स में वायरल करने की धमकी दी गई है।

मैं स्पष्ट रूप से पुष्टि करती हूँ कि मैंने ऐसी किसी भी सामग्री के निर्माण या प्रसार हेतु कभी सहमति नहीं दी है। मैंने सभी चैट रिकॉर्ड, तुलना हेतु मूल तस्वीरें और SHA-256 चेकसम सुरक्षित कर लिए हैं।`;

    updateIntakeData({
      narrative: lang === 'hi' ? templateHi : templateEn
    });
    showToast(lang === 'hi' ? 'औपचारिक पुलिस विवरण प्रारूप जनरेट हो गया!' : 'Structured complaint narrative generated.');
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast(lang === 'hi' ? 'आपका ब्राउज़र वॉइस इनपुट का समर्थन नहीं करता।' : 'Your browser does not support voice input. Try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.onresult = (e) => {
        const transcript = Array.from(e.results).map(r => r[0].transcript).join(' ');
        updateIntakeData({ narrative: (intakeData.narrative ? intakeData.narrative + ' ' : '') + transcript });
      };
      recognition.onerror = () => { setIsListening(false); };
      recognition.onend = () => { setIsListening(false); };
      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
      showToast(lang === 'hi' ? '🎙️ बोलना शुरू करें...' : '🎙️ Listening... speak now in ' + (lang === 'hi' ? 'Hindi' : 'English'));
    } catch (err) {
      setIsListening(false);
      showToast(lang === 'hi' ? 'माइक्रोफ़ोन एक्सेस में त्रुटि।' : 'Microphone access error.');
    }
  };

  const wordCount = intakeData.narrative.trim() ? intakeData.narrative.trim().split(/\s+/).length : 0;

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl">
      {/* Wizard Header & Progress Bar */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-tealLight" />
              <span>{lang === 'hi' ? 'चरणबद्ध शिकायत intake फ़ॉर्म' : 'Guided Incident Intake Form'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'hi' ? 'जांच अधिकारियों हेतु सटीक एवं कानूनी रूप से सशक्त विवरण तैयार करें' : 'Structured intake pipeline conforming to National Cyber Crime Reporting standards'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-300">
              {progress}% {lang === 'hi' ? 'पूर्ण' : 'Completed'}
            </span>
            {simulatedSubmission && (
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
                Ref: {simulatedSubmission.trackingId}
              </span>
            )}
          </div>
        </div>

        {/* Progress Track */}
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-brand-teal to-emerald-400 rounded-full transition-all duration-500 ease-out shadow-glow-teal"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-4 gap-2 mt-4 text-center text-xs">
          {[
            { step: 1, label: t.intake.step1Title, icon: ShieldCheck },
            { step: 2, label: t.intake.step2Title, icon: Globe },
            { step: 3, label: t.intake.step3Title, icon: UserX },
            { step: 4, label: t.intake.step4Title, icon: FileEdit }
          ].map(s => {
            const isDone = currentStep > s.step;
            const isCurr = currentStep === s.step;
            return (
              <button
                key={s.step}
                onClick={() => setCurrentStep(s.step)}
                className={`py-2 px-1.5 rounded-lg border text-[11px] font-medium transition-all flex flex-col items-center justify-center gap-1 ${
                  isCurr 
                    ? 'bg-slate-800 border-brand-teal text-white shadow-sm' 
                    : isDone 
                      ? 'bg-slate-900/60 border-emerald-500/40 text-emerald-400' 
                      : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span>Step {s.step}</span>
                  {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                </div>
                <span className="truncate max-w-[130px] hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 1: Abuse Classification */}
      {currentStep === 1 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              {t.intake.categoryLabel} *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {Object.entries(t.intake.categories).map(([catKey, catLabel]) => {
                const isSelected = intakeData.category === catKey;
                return (
                  <div
                    key={catKey}
                    onClick={() => updateIntakeData({ category: catKey })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-brand-teal/10 border-brand-teal text-white shadow-glow-teal'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-semibold">{catLabel}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${
                        isSelected ? 'border-brand-teal bg-brand-teal text-slate-950' : 'border-slate-600'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              {t.intake.severityLabel} *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {[
                { key: 'critical', label: t.intake.severityOptions.critical, color: 'border-rose-500/40 text-rose-300 bg-rose-950/20' },
                { key: 'high', label: t.intake.severityOptions.high, color: 'border-amber-500/40 text-amber-300 bg-amber-950/20' },
                { key: 'medium', label: t.intake.severityOptions.medium, color: 'border-sky-500/40 text-sky-300 bg-sky-950/20' }
              ].map(sev => {
                const isSel = intakeData.severity === sev.key;
                return (
                  <button
                    type="button"
                    key={sev.key}
                    onClick={() => updateIntakeData({ severity: sev.key })}
                    className={`p-3 text-left rounded-xl border text-xs transition-all ${
                      isSel 
                        ? `${sev.color} ring-1 ring-white/20 font-semibold shadow-md` 
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                    }`}
                  >
                    {sev.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Targeted Platforms */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              {t.intake.platformsLabel}
            </label>
            <p className="text-xs text-slate-400 mb-3">
              {t.intake.step2Desc}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {availablePlatforms.map(platform => {
                const isSelected = intakeData.platforms.includes(platform);
                return (
                  <button
                    type="button"
                    key={platform}
                    onClick={() => handlePlatformToggle(platform)}
                    className={`p-3 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-brand-teal/15 border-brand-teal text-white shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{platform}</span>
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                      isSelected ? 'bg-brand-teal border-brand-teal text-slate-950' : 'border-slate-600'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3 h-3 text-slate-950" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t.intake.platformOther}
            </label>
            <input
              type="text"
              value={intakeData.otherPlatform}
              onChange={(e) => updateIntakeData({ otherPlatform: e.target.value })}
              placeholder="e.g. Omegle clone, private file host, anonymous message board"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal transition-colors"
            />
          </div>
        </div>
      )}

      {/* Step 3: Perpetrator Footprint Tracker */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-xs text-slate-400">
            {t.intake.step3Desc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.intake.perpetratorHandle} *
              </label>
              <input
                type="text"
                value={intakeData.perpetratorHandle}
                onChange={(e) => updateIntakeData({ perpetratorHandle: e.target.value })}
                placeholder={t.intake.perpetratorHandlePlaceholder}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.intake.contactMethod}
              </label>
              <input
                type="text"
                value={intakeData.contactMethod}
                onChange={(e) => updateIntakeData({ contactMethod: e.target.value })}
                placeholder="e.g. Instagram DM, WhatsApp anonymous number, Telegram PM"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t.intake.profileUrl}
            </label>
            <input
              type="text"
              value={intakeData.profileUrl}
              onChange={(e) => updateIntakeData({ profileUrl: e.target.value })}
              placeholder={t.intake.profileUrlPlaceholder}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal transition-colors font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t.intake.extortionDemand}
            </label>
            <textarea
              rows={2}
              value={intakeData.extortionDemand}
              onChange={(e) => updateIntakeData({ extortionDemand: e.target.value })}
              placeholder={t.intake.extortionDemandPlaceholder}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal transition-colors resize-none"
            />
          </div>
        </div>
      )}

      {/* Step 4: Incident Narrative */}
      {currentStep === 4 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {t.intake.narrativeLabel} *
              </label>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {t.intake.step4Desc}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                  isListening
                    ? 'bg-rose-600/30 border-rose-500/50 text-rose-300 animate-pulse'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                <Mic className={`w-3.5 h-3.5 ${isListening ? 'text-rose-400' : 'text-slate-400'}`} />
                <span>{isListening ? (lang === 'hi' ? 'रोकें' : 'Stop') : (lang === 'hi' ? 'बोलकर दर्ज करें' : 'Voice Input')}</span>
              </button>

              <button
                type="button"
                onClick={generateTemplateNarrative}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition-all hover:scale-[1.02]"
              >
                <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t.intake.generateAiSummary}</span>
              </button>
            </div>
          </div>

          <textarea
            rows={7}
            value={intakeData.narrative}
            onChange={(e) => updateIntakeData({ narrative: e.target.value })}
            placeholder={t.intake.narrativePlaceholder}
            className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-teal transition-colors leading-relaxed font-sans"
          />

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>
              {wordCount} {t.intake.wordCount}
            </span>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {lang === 'hi' ? 'भारतीय साक्ष्य अधिनियम / BSA धारा 65B अनुरूपता' : 'Ready for Section 65B Electronic Evidence Annexure'}
            </span>
          </div>

          {/* Simulated API Report Submission Trigger */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">
                {lang === 'hi' ? 'बैकएंड साक्ष्य इंडेक्सिंग (सिम्युलेटेड)' : 'Simulated Technical Reference Registration'}
              </span>
              <span className="text-[11px] text-slate-400">
                {lang === 'hi' ? 'शून्य-ज्ञान पुष्टि: केवल मेटाडेटा एवं हैश सूची दर्ज होती है, कोई मीडिया नहीं भेजा जाता।' : 'Generates a tracking ID like NCR-2026-XXXXX for reference packaging without uploading any files.'}
              </span>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={submitSimulatedReport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-tealLight border border-brand-teal/30 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? (lang === 'hi' ? 'पंजीकृत हो रहा है...' : 'Generating...') : (simulatedSubmission ? (lang === 'hi' ? 'संदर्भ पुनः जनरेट करें' : 'Regenerate Ref ID') : (lang === 'hi' ? 'सिम्युलेटेड संदर्भ ID बनाएं' : 'Generate Simulated Ref ID'))}</span>
            </button>
          </div>
        </div>
      )}

      {/* Wizard Bottom Controls */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <button
          type="button"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800/70 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.intake.buttons.back}</span>
        </button>

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-teal hover:bg-teal-500 text-slate-950 font-bold text-xs transition-all shadow-glow-teal hover:scale-[1.02]"
          >
            <span>{t.intake.buttons.next}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              updateIntakeData({ completed: true });
              showToast(lang === 'hi' ? 'शिकायत विवरण सहेजा गया! अब साक्ष्य चेकलिस्ट देखें।' : 'Intake form complete! Proceed to Evidence Checklist.');
              setActiveTab('checklist');
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-glow-teal hover:scale-[1.02]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.intake.buttons.complete}</span>
          </button>
        )}
      </div>
    </div>
  );
};
