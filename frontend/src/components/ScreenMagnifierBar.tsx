"use client";

import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, X, Search, Sparkles } from 'lucide-react';

interface ScreenMagnifierBarProps {
  zoomLevel: number; // 100, 115, 130, 150, 175, 200
  onZoomChange: (newZoom: number) => void;
  onClose: () => void;
}

export const ScreenMagnifierBar: React.FC<ScreenMagnifierBarProps> = ({
  zoomLevel,
  onZoomChange,
  onClose,
}) => {
  const zoomOptions = [100, 115, 130, 150, 175, 200];

  const handleZoomIn = () => {
    const next = zoomOptions.find(z => z > zoomLevel);
    if (next) onZoomChange(next);
  };

  const handleZoomOut = () => {
    const prev = [...zoomOptions].reverse().find(z => z < zoomLevel);
    if (prev) onZoomChange(prev);
  };

  return (
    <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs text-amber-200 shrink-0 shadow-lg animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-bold text-amber-400">
          <Search className="w-4 h-4 animate-pulse" />
          <span>Screen Magnifier Active</span>
        </div>
        <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold text-xs border border-amber-500/30">
          {zoomLevel}% Zoom Scale
        </span>
      </div>

      {/* Preset Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleZoomOut}
          disabled={zoomLevel <= 100}
          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 disabled:opacity-30 border border-amber-500/30 cursor-pointer transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
          {zoomOptions.map((z) => (
            <button
              key={z}
              onClick={() => onZoomChange(z)}
              className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold transition cursor-pointer ${
                zoomLevel === z
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {z}%
            </button>
          ))}
        </div>

        <button
          onClick={handleZoomIn}
          disabled={zoomLevel >= 200}
          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 disabled:opacity-30 border border-amber-500/30 cursor-pointer transition"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={() => onZoomChange(100)}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 cursor-pointer transition text-[11px] font-semibold border border-slate-700"
          title="Reset Zoom to 100%"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 cursor-pointer transition ml-2"
          title="Close Magnifier"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
