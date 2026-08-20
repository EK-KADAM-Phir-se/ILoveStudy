"use client";

import React, { useState, useEffect } from 'react';
import { 
  Volume2, VolumeX, Type, Eye, Sparkles, Check, X, 
  HelpCircle, Keyboard, RefreshCw, ZoomIn
} from 'lucide-react';

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'xlarge';
  highContrast: 'default' | 'yellow-on-black' | 'high-contrast-light';
  dyslexicFont: boolean;
  highFocusOutline: boolean;
}

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  onSpeakQuestion?: () => void;
  onStopSpeaking?: () => void;
  isSpeaking?: boolean;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onSpeakQuestion,
  onStopSpeaking,
  isSpeaking = false,
}) => {
  const [activeTab, setActiveTab] = useState<'display' | 'speech' | 'shortcuts'>('display');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900/40 via-slate-900 to-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl font-bold">
              ♿
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                NTA Accessibility &amp; Inclusive Mode
              </h3>
              <p className="text-xs text-slate-400">
                Adjust visual styling, font sizes, screen reading, and contrast for maximum legibility.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast alert indicator */}
        {toastMsg && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 text-xs px-6 py-2 flex items-center justify-between font-semibold animate-pulse">
            <span>{toastMsg}</span>
            <Check className="w-4 h-4" />
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('display')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'display'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Type className="w-4 h-4" /> Visual &amp; Fonts
          </button>
          <button
            onClick={() => setActiveTab('speech')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'speech'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Volume2 className="w-4 h-4" /> Screen Reader (TTS)
          </button>
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'shortcuts'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Keyboard className="w-4 h-4" /> Keyboard Shortcuts
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-sm">
          {activeTab === 'display' && (
            <div className="space-y-6">
              {/* Font Size Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Text Font Scaling
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'normal', label: 'Standard (100%)', desc: 'Default NTA text size' },
                    { key: 'large', label: 'Large (120%)', desc: 'Enhanced legibility' },
                    { key: 'xlarge', label: 'Extra Large (140%)', desc: 'Maximum font scale' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        onUpdateSettings({ fontSize: item.key as any });
                        showToast(`Font scale set to ${item.label}`);
                      }}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        settings.fontSize === item.key
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm flex items-center justify-between">
                          <span>{item.label}</span>
                          {settings.fontSize === item.key && <Check className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* High Contrast Themes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  High Contrast Theme Modes
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { 
                      key: 'default', 
                      name: 'Standard Dark', 
                      bg: 'bg-slate-900 text-slate-100 border-slate-700',
                      badge: 'Default NTA UI'
                    },
                    { 
                      key: 'yellow-on-black', 
                      name: 'Yellow on Black', 
                      bg: 'bg-black text-yellow-300 border-yellow-500',
                      badge: 'NTA High Contrast'
                    },
                    { 
                      key: 'high-contrast-light', 
                      name: 'Pure White Mode', 
                      bg: 'bg-white text-black border-slate-300',
                      badge: 'High Brightness'
                    },
                  ].map((mode) => (
                    <button
                      key={mode.key}
                      onClick={() => {
                        onUpdateSettings({ highContrast: mode.key as any });
                        showToast(`Contrast theme set to ${mode.name}`);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${mode.bg} ${
                        settings.highContrast === mode.key
                          ? 'ring-2 ring-emerald-500 font-bold scale-[1.02]'
                          : 'opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{mode.name}</span>
                        {settings.highContrast === mode.key && <Check className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <span className="text-[10px] opacity-75 mt-1 block">{mode.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Extra Accessibility Toggles */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <div>
                    <h4 className="font-bold text-xs text-slate-200">Dyslexia-Friendly Line Spacing</h4>
                    <p className="text-[11px] text-slate-400">Increases letter-spacing and line-height for dyslexic reading ease.</p>
                  </div>
                  <button
                    onClick={() => {
                      const updated = !settings.dyslexicFont;
                      onUpdateSettings({ dyslexicFont: updated });
                      showToast(updated ? "Dyslexic spacing enabled" : "Dyslexic spacing disabled");
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settings.dyslexicFont ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <span className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                      settings.dyslexicFont ? 'left-6' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <div>
                    <h4 className="font-bold text-xs text-slate-200">High Visibility Focus Indicators</h4>
                    <p className="text-[11px] text-slate-400">Highlights option buttons and controls with bright borders on focus.</p>
                  </div>
                  <button
                    onClick={() => {
                      const updated = !settings.highFocusOutline;
                      onUpdateSettings({ highFocusOutline: updated });
                      showToast(updated ? "Focus outline enabled" : "Focus outline disabled");
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settings.highFocusOutline ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <span className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                      settings.highFocusOutline ? 'left-6' : 'left-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'speech' && (
            <div className="space-y-6">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
                <Volume2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-emerald-300">Text-To-Speech Assistance</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Listen to the question statement and options read aloud by your browser&apos;s speech engine.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={onSpeakQuestion}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                    isSpeaking
                      ? 'bg-emerald-500 text-slate-950 animate-pulse shadow-lg shadow-emerald-500/20'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  {isSpeaking ? 'Speaking Question...' : '🔊 Read Question Aloud'}
                </button>

                <button
                  onClick={onStopSpeaking}
                  disabled={!isSpeaking}
                  className="py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 flex items-center gap-2 transition cursor-pointer"
                >
                  <VolumeX className="w-4 h-4" /> Stop
                </button>
              </div>

              <div className="text-xs text-slate-400 bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <h5 className="font-semibold text-slate-300">Note for Visually Impaired Candidates:</h5>
                <p>
                  Text-to-Speech uses your device&apos;s built-in Web Speech API. You can also use standard system screen readers like NVDA or JAWS during practice sessions.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="space-y-4">
              <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider">
                Keyboard Navigation Shortcuts
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { key: 'Alt + N', label: 'Save & Next Question' },
                  { key: 'Alt + P', label: 'Previous Question' },
                  { key: 'Alt + M', label: 'Mark for Review & Next' },
                  { key: 'Alt + C', label: 'Clear Selected Response' },
                  { key: 'Alt + A', label: 'Toggle Accessibility Panel' },
                  { key: 'Alt + Z', label: 'Toggle Screen Magnifier' },
                  { key: '1 / 2 / 3 / 4', label: 'Select Option A / B / C / D' },
                ].map((sc) => (
                  <div key={sc.key} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">{sc.key}</span>
                    <span className="text-slate-300 text-right">{sc.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              onUpdateSettings({
                fontSize: 'normal',
                highContrast: 'default',
                dyslexicFont: false,
                highFocusOutline: false,
              });
              showToast("Reset all settings to default");
            }}
            className="text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Defaults
          </button>

          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl transition cursor-pointer shadow-md"
          >
            Apply &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
