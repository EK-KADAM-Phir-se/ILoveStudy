"use client";

import React, { useState } from "react";
import { X, HelpCircle } from "lucide-react";

interface GateScientificCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GateScientificCalculator: React.FC<GateScientificCalculatorProps> = ({
  isOpen,
  onClose,
}) => {
  const [display, setDisplay] = useState<string>("0");
  const [angleMode, setAngleMode] = useState<"deg" | "rad">("deg");
  const [memory, setMemory] = useState<number>(0);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleNum = (val: string) => {
    if (display === "0" || display === "Error") {
      setDisplay(val);
    } else {
      setDisplay((prev) => prev + val);
    }
  };

  const handleClear = () => {
    setDisplay("0");
  };

  const handleBackspace = () => {
    if (display.length <= 1 || display === "Error") {
      setDisplay("0");
    } else {
      setDisplay((prev) => prev.slice(0, -1));
    }
  };

  const handleToggleSign = () => {
    try {
      const num = parseFloat(display);
      if (!isNaN(num)) {
        setDisplay(String(-num));
      }
    } catch (e) {
      setDisplay("Error");
    }
  };

  const handleOp = (op: string) => {
    if (display === "Error") return;
    const lastChar = display.slice(-1);
    if (["+", "-", "*", "/", "%", "^"].includes(lastChar)) {
      setDisplay((prev) => prev.slice(0, -1) + op);
    } else {
      setDisplay((prev) => prev + op);
    }
  };

  const handleFunc = (funcName: string) => {
    try {
      const val = evalMath(display);
      let res = 0;
      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const toDeg = (rad: number) => (rad * 180) / Math.PI;

      switch (funcName) {
        case "sin":
          res = Math.sin(angleMode === "deg" ? toRad(val) : val);
          break;
        case "cos":
          res = Math.cos(angleMode === "deg" ? toRad(val) : val);
          break;
        case "tan":
          res = Math.tan(angleMode === "deg" ? toRad(val) : val);
          break;
        case "asin":
          res = Math.asin(val);
          if (angleMode === "deg") res = toDeg(res);
          break;
        case "acos":
          res = Math.acos(val);
          if (angleMode === "deg") res = toDeg(res);
          break;
        case "atan":
          res = Math.atan(val);
          if (angleMode === "deg") res = toDeg(res);
          break;
        case "sinh":
          res = Math.sinh(val);
          break;
        case "cosh":
          res = Math.cosh(val);
          break;
        case "tanh":
          res = Math.tanh(val);
          break;
        case "asinh":
          res = Math.asinh(val);
          break;
        case "acosh":
          res = Math.acosh(val);
          break;
        case "atanh":
          res = Math.atanh(val);
          break;
        case "ln":
          res = Math.log(val);
          break;
        case "log":
          res = Math.log10(val);
          break;
        case "exp":
          res = Math.exp(val);
          break;
        case "10x":
          res = Math.pow(10, val);
          break;
        case "sqrt":
          res = Math.sqrt(val);
          break;
        case "cbrt":
          res = Math.cbrt(val);
          break;
        case "sqr":
          res = Math.pow(val, 2);
          break;
        case "cube":
          res = Math.pow(val, 3);
          break;
        case "inv":
          res = 1 / val;
          break;
        case "abs":
          res = Math.abs(val);
          break;
        case "fact":
          res = factorial(Math.floor(val));
          break;
        default:
          return;
      }

      if (isNaN(res) || !isFinite(res)) {
        setDisplay("Error");
      } else {
        setDisplay(String(Number(res.toFixed(10))));
      }
    } catch (e) {
      setDisplay("Error");
    }
  };

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let acc = 1;
    for (let i = 2; i <= n; i++) acc *= i;
    return acc;
  };

  const evalMath = (expr: string): number => {
    try {
      const clean = expr
        .replace(/π/g, String(Math.PI))
        .replace(/e/g, String(Math.E))
        .replace(/mod/g, "%");
      // eslint-disable-next-line no-eval
      const num = Function(`"use strict"; return (${clean})`)();
      return typeof num === "number" ? num : NaN;
    } catch (e) {
      return NaN;
    }
  };

  const handleEquals = () => {
    const res = evalMath(display);
    if (isNaN(res) || !isFinite(res)) {
      setDisplay("Error");
    } else {
      setDisplay(String(Number(res.toFixed(10))));
    }
  };

  const handleMemory = (op: string) => {
    const val = evalMath(display);
    if (isNaN(val)) return;
    if (op === "MC") setMemory(0);
    if (op === "MR") setDisplay(String(memory));
    if (op === "MS") setMemory(val);
    if (op === "M+") setMemory((prev) => prev + val);
    if (op === "M-") setMemory((prev) => prev - val);
  };

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] bg-[#e5e7eb] border-2 border-[#3b82f6] rounded-t-lg rounded-b-md shadow-2xl w-[460px] text-slate-800 font-sans select-none overflow-hidden">
      
      {/* Title Bar */}
      <div className="bg-[#3b82f6] text-white px-3 py-1.5 flex items-center justify-between font-bold text-xs">
        <span>Scientific Calculator</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="hover:underline flex items-center gap-0.5 text-[11px] cursor-pointer"
          >
            <HelpCircle size={13} />
            <span>Help</span>
          </button>
          <button
            onClick={onClose}
            className="hover:bg-blue-700 rounded px-1 text-sm font-black cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      {showHelp && (
        <div className="p-3 bg-yellow-50 border-b border-yellow-200 text-[11px] text-yellow-900 leading-relaxed">
          <strong>Official GATE Calculator Guide:</strong>
          <ul className="list-disc list-inside mt-1 space-y-0.5">
            <li>Use Deg/Rad radio to toggle angle mode for trig operations.</li>
            <li>Use C to clear display, ⇦ for backspace, +/- to change sign.</li>
            <li>Operations follow standard mathematical precedence.</li>
          </ul>
        </div>
      )}

      <div className="p-3 space-y-2.5 bg-[#f3f4f6]">
        
        {/* Expression / Result Display Box */}
        <div className="bg-white border border-slate-300 rounded px-3 py-2 text-right shadow-inner">
          <div className="text-[11px] text-slate-400 font-mono h-4 overflow-hidden">
            {display}
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 tracking-wide overflow-x-auto whitespace-nowrap">
            {display}
          </div>
        </div>

        {/* Mode Toggle & Memory Bar */}
        <div className="flex items-center justify-between text-[11px] font-semibold pt-0.5">
          <div className="flex items-center gap-3 bg-white px-2.5 py-1 rounded border border-slate-300">
            <button
              onClick={() => handleFunc("mod")}
              className="text-blue-700 font-bold hover:underline"
            >
              mod
            </button>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="angleMode"
                checked={angleMode === "deg"}
                onChange={() => setAngleMode("deg")}
                className="accent-blue-600 h-3 w-3"
              />
              <span>Deg</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="angleMode"
                checked={angleMode === "rad"}
                onChange={() => setAngleMode("rad")}
                className="accent-blue-600 h-3 w-3"
              />
              <span>Rad</span>
            </label>
          </div>

          <div className="flex items-center gap-1">
            {["MC", "MR", "MS", "M+", "M-"].map((m) => (
              <button
                key={m}
                onClick={() => handleMemory(m)}
                className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[10px] font-bold text-slate-700 shadow-xs"
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Keypad */}
        <div className="grid grid-cols-11 gap-1 text-[11px] font-bold">
          
          {/* Row 1 */}
          <button onClick={() => handleFunc("sinh")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700">sinh</button>
          <button onClick={() => handleFunc("cosh")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700">cosh</button>
          <button onClick={() => handleFunc("tanh")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700">tanh</button>
          <button onClick={() => handleFunc("exp")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700">Exp</button>
          <button onClick={() => handleNum("(")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700">(</button>
          <button onClick={() => handleNum(")")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700">)</button>
          <button onClick={handleBackspace} className="col-span-1 p-1.5 bg-[#ef4444] hover:bg-red-600 text-white rounded text-xs">⇦</button>
          <button onClick={handleClear} className="col-span-1 p-1.5 bg-[#ef4444] hover:bg-red-600 text-white rounded text-xs">C</button>
          <button onClick={handleToggleSign} className="col-span-1 p-1.5 bg-[#ef4444] hover:bg-red-600 text-white rounded text-xs">+/-</button>
          <button onClick={() => handleFunc("sqrt")} className="col-span-2 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700">√</button>

          {/* Row 2 */}
          <button onClick={() => handleFunc("asinh")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[10px] text-slate-700">sinh⁻¹</button>
          <button onClick={() => handleFunc("acosh")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[10px] text-slate-700">cosh⁻¹</button>
          <button onClick={() => handleFunc("atanh")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[10px] text-slate-700">tanh⁻¹</button>
          <button onClick={() => handleNum("log2")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[10px] text-slate-700">log₂x</button>
          <button onClick={() => handleFunc("ln")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700">ln</button>
          <button onClick={() => handleFunc("log")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700">log</button>
          <button onClick={() => handleNum("7")} className="col-span-1 p-1.5 bg-white hover:bg-blue-50 border border-slate-300 rounded text-slate-900 text-sm font-extrabold">7</button>
          <button onClick={() => handleNum("8")} className="col-span-1 p-1.5 bg-white hover:bg-blue-50 border border-slate-300 rounded text-slate-900 text-sm font-extrabold">8</button>
          <button onClick={() => handleNum("9")} className="col-span-1 p-1.5 bg-white hover:bg-blue-50 border border-slate-300 rounded text-slate-900 text-sm font-extrabold">9</button>
          <button onClick={() => handleOp("/")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-800">/</button>
          <button onClick={() => handleOp("%")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-800">%</button>

          {/* Row 3 */}
          <button onClick={() => handleNum("π")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700">π</button>
          <button onClick={() => handleNum("e")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700">e</button>
          <button onClick={() => handleFunc("fact")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700">n!</button>
          <button onClick={() => handleOp("^")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[10px] text-slate-700">logyx</button>
          <button onClick={() => handleFunc("exp")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700">eˣ</button>
          <button onClick={() => handleFunc("10x")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700">10ˣ</button>
          <button onClick={() => handleNum("4")} className="col-span-1 p-1.5 bg-white hover:bg-blue-50 border border-slate-300 rounded text-slate-900 text-sm font-extrabold">4</button>
          <button onClick={() => handleNum("5")} className="col-span-1 p-1.5 bg-white hover:bg-blue-50 border border-slate-300 rounded text-slate-900 text-sm font-extrabold">5</button>
          <button onClick={() => handleNum("6")} className="col-span-1 p-1.5 bg-white hover:bg-blue-50 border border-slate-300 rounded text-slate-900 text-sm font-extrabold">6</button>
          <button onClick={() => handleOp("*")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-800">*</button>
          <button onClick={() => handleFunc("inv")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[10px] text-slate-700">1/x</button>

          {/* Row 4 */}
          <button onClick={() => handleFunc("sin")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700">sin</button>
          <button onClick={() => handleFunc("cos")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700">cos</button>
          <button onClick={() => handleFunc("tan")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700">tan</button>
          <button onClick={() => handleOp("^")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700">xʸ</button>
          <button onClick={() => handleFunc("cube")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700">x³</button>
          <button onClick={() => handleFunc("sqr")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700">x²</button>
          <button onClick={() => handleNum("1")} className="col-span-1 p-1.5 bg-white hover:bg-blue-50 border border-slate-300 rounded text-slate-900 text-sm font-extrabold">1</button>
          <button onClick={() => handleNum("2")} className="col-span-1 p-1.5 bg-white hover:bg-blue-50 border border-slate-300 rounded text-slate-900 text-sm font-extrabold">2</button>
          <button onClick={() => handleNum("3")} className="col-span-1 p-1.5 bg-white hover:bg-blue-50 border border-slate-300 rounded text-slate-900 text-sm font-extrabold">3</button>
          <button onClick={() => handleOp("-")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-800">-</button>
          <button onClick={handleEquals} className="col-span-1 row-span-2 bg-[#22c55e] hover:bg-emerald-600 text-white rounded font-black text-lg flex items-center justify-center cursor-pointer shadow">=</button>

          {/* Row 5 */}
          <button onClick={() => handleFunc("asin")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[10px] text-slate-700">sin⁻¹</button>
          <button onClick={() => handleFunc("acos")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[10px] text-slate-700">cos⁻¹</button>
          <button onClick={() => handleFunc("atan")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[10px] text-slate-700">tan⁻¹</button>
          <button onClick={() => handleFunc("sqrt")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[10px] text-slate-700">ʸ√x</button>
          <button onClick={() => handleFunc("cbrt")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[10px] text-slate-700">³√x</button>
          <button onClick={() => handleFunc("abs")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700">|x|</button>
          <button onClick={() => handleNum("0")} className="col-span-2 p-1.5 bg-white hover:bg-blue-50 border border-slate-300 rounded text-slate-900 text-sm font-extrabold">0</button>
          <button onClick={() => handleNum(".")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-900 font-bold">.</button>
          <button onClick={() => handleOp("+")} className="col-span-1 p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-800">+</button>

        </div>
      </div>
    </div>
  );
};
