"use client";

import { useState, useMemo } from "react";
import {
  ShoppingCart,
  LayoutDashboard,
  Utensils,
  Settings,
} from "lucide-react";

const PRESETS = [
  { name: "Modern Blue", h: 250, c: 0.1, l: 0.5, surfaceC: 0.01 },
  { name: "Forest Eco", h: 150, c: 0.08, l: 0.45, surfaceC: 0.02 },
  { name: "Classic Gold", h: 52, c: 0.09, l: 0.7, surfaceC: 0.01 },
  { name: "Cyber Pink", h: 330, c: 0.15, l: 0.55, surfaceC: 0.03 },
  { name: "Calm Lavender", h: 270, c: 0.07, l: 0.5, surfaceC: 0.015 },
  { name: "Sunny Yellow", h: 60, c: 0.12, l: 0.6, surfaceC: 0.02 },

  { name: "Sunset Clay", h: 35, c: 0.08, l: 0.55, surfaceC: 0.015 },
  { name: "Deep Midnight", h: 260, c: 0.04, l: 0.35, surfaceC: 0.01 },
  { name: "Matcha Latte", h: 125, c: 0.06, l: 0.52, surfaceC: 0.02 },
  { name: "Nordic Slate", h: 220, c: 0.02, l: 0.45, surfaceC: 0.005 },
  { name: "Rose Quartz", h: 15, c: 0.04, l: 0.6, surfaceC: 0.015 },
  { name: "Electric Neon", h: 190, c: 0.18, l: 0.5, surfaceC: 0.04 },
];

function ThemePlayground() {
  const [config, setConfig] = useState({
    l: 0.45,
    c: 0.12,
    h: 250,
    surfaceC: 0.012,
  });

  const themeStyles = useMemo(() => {
    const { l, c, h, surfaceC } = config;

    return {
      "--primary": `oklch(${l} ${c} ${h})`,
      "--primary-foreground":
        l < 0.6 ? "oklch(0.99 0.01 250)" : "oklch(0.2 0.02 250)",

      "--background": `oklch(0.99 ${surfaceC} ${h})`,
      "--foreground": `oklch(0.15 0.02 ${h})`,

      "--muted": `oklch(0.95 ${surfaceC} ${h})`,
      "--muted-foreground": `oklch(0.45 0.03 ${h})`,
      "--border": `oklch(0.91 ${surfaceC} ${h})`,

      "--card": `oklch(1 ${surfaceC * 0.5} ${h})`,

      padding: "2rem",
      borderRadius: "1.5rem",
      transition: "all 0.3s ease",
    } as React.CSSProperties;
  }, [config]);

  return (
    <div className="min-h-0 p-2 md:p-6 font-sans bg-zinc-50/50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 flex flex-col bg-card rounded-2xl shadow-sm border overflow-hidden h-fit">
          <div className="p-6 border-b flex justify-between items-start">
            <div>
              <h1 className="text-lg font-bold tracking-tight text-zinc-900">
                Cấu hình Store
              </h1>
              <p className="text-[11px] text-muted-foreground font-medium">
                Kéo hoặc nhập số để đổi vibe
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-full shadow-inner border-2 border-white transition-colors duration-300"
              style={{
                backgroundColor: `oklch(${config.l} ${config.c} ${config.h})`,
              }}
            />
          </div>

          <div className="p-2 space-y-1">
            <CustomSlider
              label="Màu sắc (Hue)"
              value={config.h}
              min={0}
              max={360}
              step={0.1}
              onChange={(v: number) => setConfig((prev) => ({ ...prev, h: v }))}
            />
            <CustomSlider
              label="Độ tươi (Chroma)"
              value={config.c}
              min={0}
              max={0.3}
              step={0.001}
              onChange={(v: number) => setConfig((prev) => ({ ...prev, c: v }))}
            />
            <CustomSlider
              label="Độ sáng (Lightness)"
              value={config.l}
              min={0.2}
              max={0.9}
              step={0.01}
              onChange={(v: number) => setConfig((prev) => ({ ...prev, l: v }))}
            />
            <div className="pt-2 mt-2 border-t border-zinc-100">
              <CustomSlider
                label="Độ ám nền"
                value={config.surfaceC}
                min={0}
                max={0.08}
                step={0.001}
                onChange={(v: number) =>
                  setConfig((prev) => ({ ...prev, surfaceC: v }))
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-1 p-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setConfig(preset)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors"
              >
                <div
                  className="w-6 h-6 rounded-full border border-zinc-200"
                  style={{
                    backgroundColor: `oklch(${preset.l} ${preset.c} ${preset.h})`,
                  }}
                />
                <span className="text-xs font-medium">{preset.name}</span>
              </button>
            ))}
          </div>

          <div className="p-4 bg-zinc-50/50 border-t">
            <button
              onClick={() =>
                setConfig({ h: 250, c: 0.1, l: 0.5, surfaceC: 0.01 })
              }
              className="text-[10px] font-bold text-primary uppercase hover:underline w-full text-left"
            >
              Đặt lại mặc định
            </button>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div
            style={themeStyles}
            className="bg-background text-foreground border-border border min-h-125 rounded-3xl shadow-2xl relative overflow-hidden p-8"
          >
            {/* Header POS */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary" />
                <span className="font-bold uppercase tracking-widest text-sm text-zinc-800">
                  Gemini POS
                </span>
              </div>
              <div className="flex gap-4 text-muted-foreground">
                <LayoutDashboard size={18} />
                <Utensils size={18} />
                <Settings size={18} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <h3 className="font-bold mb-4">Bàn số 05</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Phở đặc biệt x1
                    </span>
                    <span className="font-medium">75k</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Trà đá x1</span>
                    <span className="font-medium">5k</span>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between font-bold">
                    <span>Tổng</span>
                    <span className="text-primary">80k</span>
                  </div>
                </div>
                <button className="w-full mt-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-(--primary)/20">
                  <ShoppingCart size={18} /> Thanh toán
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-muted border border-border">
                  <p className="text-xs uppercase font-bold text-muted-foreground mb-1">
                    Doanh thu ca
                  </p>
                  <p className="text-2xl font-black text-primary">2.450.000đ</p>
                </div>
                <div className="p-4 rounded-2xl border border-border border-dashed flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <p className="text-sm italic">Lịch sử trống</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomSlider({ label, value, min, max, step = 1, onChange }: any) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseFloat(e.target.value);
    if (isNaN(val)) return;

    if (val < min) val = min;
    if (val > max) val = max;

    onChange(val);
  };

  return (
    <div className="group space-y-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors">
      <div className="flex justify-between items-center">
        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
          {label}
        </label>

        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleInputChange}
            className="w-16 text-right text-xs font-mono bg-white border border-zinc-200 px-1.5 py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="relative flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900 hover:accent-primary transition-all"
        />
      </div>
    </div>
  );
}

export default ThemePlayground;
