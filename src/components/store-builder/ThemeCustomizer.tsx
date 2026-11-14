"use client";

import React, { useState } from "react";
import { Check, Loader2, Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { THEME_PRESETS } from "@/services/store.service";
import type { ProfileTheme } from "@/types";

interface ThemeCustomizerProps {
  currentTheme: ProfileTheme;
  onUpdateTheme: (theme: Partial<ProfileTheme>) => Promise<void>;
}

export function ThemeCustomizer({ currentTheme, onUpdateTheme }: ThemeCustomizerProps) {
  const [theme, setTheme] = useState<ProfileTheme>(currentTheme);
  const [isSaving, setIsSaving] = useState(false);

  function handleSelectPreset(presetId: string) {
    const found = THEME_PRESETS.find((p) => p.id === presetId);
    if (!found) return;

    const updated: ProfileTheme = {
      preset: found.id,
      primaryColor: found.primaryColor,
      backgroundColor: found.backgroundColor,
      font: found.font,
      buttonRadius: found.buttonRadius,
      cardStyle: found.buttonStyle === "glass" ? "glass" : "solid",
    };

    setTheme(updated);
    onUpdateTheme(updated);
  }

  async function handleSaveCustom() {
    setIsSaving(true);
    try {
      await onUpdateTheme(theme);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* 6 Theme Presets Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-text">
            Ready-Made Presets (6 Available)
          </label>
          <span className="text-[11px] text-slate-muted">Click to instantly apply</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {THEME_PRESETS.map((p) => {
            const isSelected = theme.preset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p.id)}
                className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? "border-brand-violet ring-2 ring-brand-violet/20 shadow-md bg-card"
                    : "border-slate-border hover:border-slate-300 dark:hover:border-slate-700 bg-card"
                }`}
              >
                {/* Mini Preview Swatch */}
                <div
                  className="h-10 rounded-xl mb-2.5 flex items-center justify-center p-2 relative shadow-inner"
                  style={{ backgroundColor: p.backgroundColor }}
                >
                  <div
                    className="w-full h-4 rounded-md shadow-xs flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ backgroundColor: p.primaryColor }}
                  >
                    Button
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-violet text-white flex items-center justify-center shadow-xs">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                <div className="text-xs font-bold text-slate-text truncate">
                  {p.name}
                </div>
                <div className="text-[10px] text-slate-muted truncate mt-0.5">
                  {p.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fine-Tuning Controls */}
      <Card className="p-4 sm:p-5 border-slate-border space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-text pb-2 border-b border-slate-border">
          Fine-Tune Brand Colors & Style
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-text uppercase mb-1.5">
              Primary Brand Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.primaryColor || "#6D28D9"}
                onChange={(e) => {
                  const updated = { ...theme, primaryColor: e.target.value, preset: "custom" };
                  setTheme(updated);
                  onUpdateTheme(updated);
                }}
                className="w-10 h-10 rounded-xl border border-slate-border cursor-pointer p-0.5 bg-transparent"
              />
              <Input
                value={theme.primaryColor || "#6D28D9"}
                onChange={(e) => {
                  const updated = { ...theme, primaryColor: e.target.value, preset: "custom" };
                  setTheme(updated);
                }}
                className="font-mono text-xs uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-text uppercase mb-1.5">
              Canvas Background
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.backgroundColor || "#FAFAFB"}
                onChange={(e) => {
                  const updated = { ...theme, backgroundColor: e.target.value, preset: "custom" };
                  setTheme(updated);
                  onUpdateTheme(updated);
                }}
                className="w-10 h-10 rounded-xl border border-slate-border cursor-pointer p-0.5 bg-transparent"
              />
              <Input
                value={theme.backgroundColor || "#FAFAFB"}
                onChange={(e) => {
                  const updated = { ...theme, backgroundColor: e.target.value, preset: "custom" };
                  setTheme(updated);
                }}
                className="font-mono text-xs uppercase"
              />
            </div>
          </div>
        </div>

        {/* Button Radius Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-text uppercase mb-2">
            Button Corner Radius
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "rounded-md", label: "Sharp" },
              { id: "rounded-xl", label: "Rounded" },
              { id: "rounded-2xl", label: "Smooth" },
              { id: "rounded-full", label: "Pill" },
            ].map((r) => {
              const isSelected = theme.buttonRadius === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    const updated = { ...theme, buttonRadius: r.id, preset: "custom" };
                    setTheme(updated);
                    onUpdateTheme(updated);
                  }}
                  className={`py-2 text-xs font-bold transition-all border ${
                    isSelected
                      ? "border-brand-violet bg-brand-violet text-white shadow-xs"
                      : "border-slate-border bg-card text-slate-text hover:border-slate-300"
                  } ${r.id}`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Family Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-text uppercase mb-2">
            Typography Font
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "Inter", label: "Inter (Modern UI)", sample: "Sans-Serif" },
              { id: "Plus Jakarta Sans", label: "Plus Jakarta Sans", sample: "Geometric Display" },
            ].map((f) => {
              const isSelected = theme.font === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    const updated = { ...theme, font: f.id, preset: "custom" };
                    setTheme(updated);
                    onUpdateTheme(updated);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-brand-violet bg-brand-violet/10 text-brand-violet"
                      : "border-slate-border bg-card text-slate-text hover:border-slate-300"
                  }`}
                >
                  <div className="text-xs font-bold">{f.label}</div>
                  <div className="text-[10px] text-slate-muted mt-0.5">{f.sample}</div>
                </button>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
