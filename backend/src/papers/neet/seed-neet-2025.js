const fs = require('fs');
const path = require('path');
const prisma = require('../../lib/prisma');

const backendImgDir = path.join(__dirname, 'neetimages');
const frontendImgDir = path.join(__dirname, '../../../../frontend/public/neetimages');

[backendImgDir, frontendImgDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function saveSvg(filename, svgContent) {
  fs.writeFileSync(path.join(backendImgDir, filename), svgContent.trim());
  fs.writeFileSync(path.join(frontendImgDir, filename), svgContent.trim());
}

// ---------------------------------------------------------------------
// 1. Generate Crisp Vector SVGs for NEET 2025
// ---------------------------------------------------------------------

// Q1: Circuit with balanced Wheatstone bridge and resistors
saveSvg('neet_2025_q1.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 260" width="100%" height="220">
  <rect width="380" height="260" fill="#0f172a" rx="16"/>
  <!-- Top resistor 1.5 ohm -->
  <line x1="80" y1="40" x2="160" y2="40" stroke="#94a3b8" stroke-width="2"/>
  <path d="M160 40 L165 30 L175 50 L185 30 L195 50 L200 40" fill="none" stroke="#38bdf8" stroke-width="2"/>
  <text x="180" y="25" fill="#38bdf8" font-family="sans-serif" font-size="11" text-anchor="middle">1.5 Ω</text>
  <line x1="200" y1="40" x2="280" y2="40" stroke="#94a3b8" stroke-width="2"/>
  <line x1="280" y1="40" x2="280" y2="100" stroke="#94a3b8" stroke-width="2"/>

  <!-- Right resistor 5.5 ohm -->
  <path d="M280 100 L270 105 L290 115 L270 125 L290 135 L280 140" fill="none" stroke="#f59e0b" stroke-width="2"/>
  <text x="310" y="125" fill="#f59e0b" font-family="sans-serif" font-size="11">5.5 Ω</text>
  <line x1="280" y1="140" x2="280" y2="210" stroke="#94a3b8" stroke-width="2"/>

  <!-- Bottom battery 5V and (1/3) ohm -->
  <line x1="80" y1="210" x2="150" y2="210" stroke="#94a3b8" stroke-width="2"/>
  <path d="M150 210 L155 200 L165 220 L175 200 L185 220 L190 210" fill="none" stroke="#a855f7" stroke-width="2"/>
  <text x="170" y="235" fill="#a855f7" font-family="sans-serif" font-size="11" text-anchor="middle">1/3 Ω</text>
  <line x1="190" y1="210" x2="220" y2="210" stroke="#94a3b8" stroke-width="2"/>
  <!-- Battery 5V -->
  <line x1="220" y1="195" x2="220" y2="225" stroke="#10b981" stroke-width="3"/>
  <line x1="226" y1="202" x2="226" y2="218" stroke="#10b981" stroke-width="1.5"/>
  <text x="223" y="185" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">5 V</text>
  <line x1="226" y1="210" x2="280" y2="210" stroke="#94a3b8" stroke-width="2"/>

  <!-- Wheatstone Bridge diamond in middle -->
  <line x1="80" y1="40" x2="80" y2="210" stroke="#94a3b8" stroke-width="2"/>
  <polygon points="80,120 140,75 200,120 140,165" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="100" y="90" fill="#f8fafc" font-family="sans-serif" font-size="10">5Ω</text>
  <text x="165" y="90" fill="#f8fafc" font-family="sans-serif" font-size="10">2.5Ω</text>
  <text x="100" y="155" fill="#f8fafc" font-family="sans-serif" font-size="10">3Ω</text>
  <text x="165" y="155" fill="#f8fafc" font-family="sans-serif" font-size="10">1.5Ω</text>
  <line x1="140" y1="75" x2="140" y2="165" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="2 2"/>
  <text x="145" y="125" fill="#ef4444" font-family="sans-serif" font-size="10">6Ω</text>
  <text x="200" y="245" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">R_eq = 10 Ω ⟹ i = 5V / 10Ω = 0.5 A</text>
</svg>`);

// Q7: Bridge circuit 50V across AB
saveSvg('neet_2025_q7.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 220" width="100%" height="180">
  <rect width="380" height="220" fill="#0f172a" rx="16"/>
  <!-- Node A -->
  <circle cx="50" cy="80" r="5" fill="#38bdf8"/>
  <text x="35" y="85" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="14">A</text>
  <line x1="50" y1="80" x2="100" y2="80" stroke="#94a3b8" stroke-width="2"/>

  <!-- Upper branch: 1 ohm, Node C, 2 ohm -->
  <line x1="100" y1="80" x2="100" y2="40" stroke="#94a3b8" stroke-width="2"/>
  <path d="M100 40 L120 40 L125 30 L135 50 L145 30 L155 50 L160 40 L180 40" fill="none" stroke="#38bdf8" stroke-width="2"/>
  <text x="140" y="25" fill="#38bdf8" font-family="sans-serif" font-size="11" text-anchor="middle">1 Ω</text>
  <circle cx="180" cy="40" r="4" fill="#f59e0b"/>
  <text x="180" y="25" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">C</text>
  <path d="M180 40 L200 40 L205 30 L215 50 L225 30 L235 50 L240 40 L260 40" fill="none" stroke="#38bdf8" stroke-width="2"/>
  <text x="220" y="25" fill="#38bdf8" font-family="sans-serif" font-size="11" text-anchor="middle">2 Ω</text>
  <line x1="260" y1="40" x2="260" y2="80" stroke="#94a3b8" stroke-width="2"/>

  <!-- Bridge Branch CD -->
  <line x1="180" y1="40" x2="180" y2="120" stroke="#ef4444" stroke-width="2.5"/>
  <polygon points="180,85 175,75 185,75" fill="#ef4444"/>
  <text x="195" y="85" fill="#ef4444" font-family="sans-serif" font-weight="bold" font-size="12">I_CD</text>

  <!-- Lower branch: 3 ohm, Node D, 4 ohm -->
  <line x1="100" y1="80" x2="100" y2="120" stroke="#94a3b8" stroke-width="2"/>
  <path d="M100 120 L120 120 L125 110 L135 130 L145 110 L155 130 L160 120 L180 120" fill="none" stroke="#a855f7" stroke-width="2"/>
  <text x="140" y="145" fill="#a855f7" font-family="sans-serif" font-size="11" text-anchor="middle">3 Ω</text>
  <circle cx="180" cy="120" r="4" fill="#f59e0b"/>
  <text x="180" y="145" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">D</text>
  <path d="M180 120 L200 120 L205 110 L215 130 L225 110 L235 130 L240 120 L260 120" fill="none" stroke="#a855f7" stroke-width="2"/>
  <text x="220" y="145" fill="#a855f7" font-family="sans-serif" font-size="11" text-anchor="middle">4 Ω</text>
  <line x1="260" y1="120" x2="260" y2="80" stroke="#94a3b8" stroke-width="2"/>

  <!-- Node B -->
  <line x1="260" y1="80" x2="310" y2="80" stroke="#94a3b8" stroke-width="2"/>
  <circle cx="310" cy="80" r="5" fill="#38bdf8"/>
  <text x="325" y="85" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="14">B</text>

  <!-- 50V Battery at bottom -->
  <line x1="50" y1="80" x2="50" y2="180" stroke="#94a3b8" stroke-width="2"/>
  <line x1="50" y1="180" x2="160" y2="180" stroke="#94a3b8" stroke-width="2"/>
  <line x1="160" y1="165" x2="160" y2="195" stroke="#10b981" stroke-width="3"/>
  <line x1="166" y1="172" x2="166" y2="188" stroke="#10b981" stroke-width="1.5"/>
  <text x="163" y="155" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">50 V</text>
  <line x1="166" y1="180" x2="310" y2="180" stroke="#94a3b8" stroke-width="2"/>
  <line x1="310" y1="80" x2="310" y2="180" stroke="#94a3b8" stroke-width="2"/>

  <text x="180" y="210" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">I_CD = 18 A - 16 A = 2.0 A (C to D)</text>
</svg>`);

// Q45: Spherical Cavity of Radius R inside 2R Solid Sphere
saveSvg('neet_2025_q45.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 240" width="100%" height="200">
  <rect width="340" height="240" fill="#0f172a" rx="16"/>
  <!-- Y-axis -->
  <line x1="170" y1="20" x2="170" y2="220" stroke="#64748b" stroke-width="2"/>
  <text x="180" y="30" fill="#64748b" font-family="sans-serif" font-size="13">Y</text>

  <!-- Large sphere of radius 2R -->
  <circle cx="170" cy="120" r="90" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="130" y="125" fill="#38bdf8" font-family="sans-serif" font-size="12">2R</text>

  <!-- Cut small sphere of radius R -->
  <circle cx="215" cy="120" r="45" fill="#0f172a" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="3 3"/>
  <text x="215" y="125" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">R</text>

  <text x="170" y="230" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">I_small / I_remaining = 7 / 57</text>
</svg>`);

console.log("NEET 2025 SVGs generated!");

// ---------------------------------------------------------------------
// 2. Complete 180 Questions for NEET 2025 (Physics 1-45, Chemistry 46-90, Biology 91-180)
// ---------------------------------------------------------------------
const rawQuestions = [
  // -------------------------------------------------------------
  // PHYSICS (Q1 - Q45)
  // -------------------------------------------------------------
  {
    subject: "Physics",
    questionText: "The current passing through the $5\\text{ V}$ battery in the circuit containing balanced bridge ($R' = 8/3\\,\\Omega, R_{\\text{eq}} = 10\\,\\Omega$) is:",
    imageUrl: "/neetimages/neet_2025_q1.svg",
    optionA: "$1.5\\text{ A}$",
    optionB: "$2.0\\text{ A}$",
    optionC: "$0.5\\text{ A}$",
    optionD: "$2.5\\text{ A}$",
    correctOption: "C",
    explanation: "$R_{\\text{bridge}} = \\frac{4 \\times 8}{12} = \\frac{8}{3}\\,\\Omega$. $R_{\\text{eq}} = \\frac{8}{3} + \\frac{1}{3} + 1.5 + 5.5 = 10\\,\\Omega \\implies I = \\frac{5\\text{ V}}{10\\,\\Omega} = 0.5\\text{ A}$."
  },
  {
    subject: "Physics",
    questionText: "Electric field is $E_z = 60\\cos(5x + 1.5 \\times 10^9 t)\\text{ V/m}$. Corresponding magnetic field expression is ($c = 3 \\times 10^8\\text{ m/s}$):",
    optionA: "$B_y = 60\\sin(5x + 1.5 \\times 10^9 t)\\text{ T}$",
    optionB: "$B_y = 2 \\times 10^{-7}\\cos(5x + 1.5 \\times 10^9 t)\\text{ T}$",
    optionC: "$B_x = 2 \\times 10^{-7}\\cos(5x + 1.5 \\times 10^9 t)\\text{ T}$",
    optionD: "$B_z = 60\\cos(5x + 1.5 \\times 10^9 t)\\text{ T}$",
    correctOption: "B",
    explanation: "$B_0 = \\frac{E_0}{c} = \\frac{60}{3 \\times 10^8} = 2 \\times 10^{-7}\\text{ T}$. Since wave propagates along $-x$ with $\\vec{E}$ along $\\hat{k}$, $\\vec{B}$ oscillates along $\\hat{j}$."
  },
  {
    subject: "Physics",
    questionText: "An open organ pipe of fundamental frequency $f$ is dipped vertically into water to half its length. Fundamental frequency of resulting air column is:",
    optionA: "$2f$",
    optionB: "$f/2$",
    optionC: "$f$",
    optionD: "$3f/2$",
    correctOption: "C",
    explanation: "Open pipe: $f = \\frac{v}{2L}$. When dipped by half, it becomes closed pipe of length $L/2$: $f' = \\frac{v}{4(L/2)} = \\frac{v}{2L} = f$."
  },
  {
    subject: "Physics",
    questionText: "An electron moving with speed $c/100$ enters $B = 9 \\times 10^{-4}\\text{ T}$. Magnitude and direction of electric field $\\vec{E}$ to prevent deflection is ($c = 3 \\times 10^8\\text{ m/s}$):",
    optionA: "$\\vec{E} \\parallel \\vec{B}$ and $27 \\times 10^4\\text{ V/m}$",
    optionB: "$\\vec{E} \\perp \\vec{B}$ and $27 \\times 10^4\\text{ V/m}$",
    optionC: "$\\vec{E} \\perp \\vec{B}$ and $27 \\times 10^2\\text{ V/m}$",
    optionD: "$\\vec{E} \\parallel \\vec{B}$ and $27 \\times 10^2\\text{ V/m}$",
    correctOption: "C",
    explanation: "$E = v B = \\left(\\frac{3 \\times 10^8}{100}\\right)(9 \\times 10^{-4}) = 27 \\times 10^2\\text{ V/m}$ and $\\vec{E} \\perp \\vec{B}$ for velocity selector balance."
  },
  {
    subject: "Physics",
    questionText: "Four identical thin convex lenses of power $p$ and magnification $m$ are placed axially in contact. Total power and magnification are:",
    optionA: "$p^4$ and $m^4$",
    optionB: "$4p$ and $4m$",
    optionC: "$p^4$ and $4m$",
    optionD: "$4p$ and $m^4$",
    correctOption: "D",
    explanation: "Powers add linearly ($P_{\\text{eff}} = 4p$) while lateral magnifications multiply ($M_{\\text{eff}} = m^4$)."
  },
  {
    subject: "Physics",
    questionText: "A $2\\text{ A}$ current flows through two circular coils of radii ratio $1 : 2$. The ratio of their magnetic moments $M_1 : M_2$ is:",
    optionA: "$4 : 1$",
    optionB: "$1 : 4$",
    optionC: "$1 : 2$",
    optionD: "$2 : 1$",
    correctOption: "B",
    explanation: "$M = I A = I (\\pi r^2) \\propto r^2 \\implies \\frac{M_1}{M_2} = \\left(\\frac{r_1}{r_2}\\right)^2 = \\left(\\frac{1}{2}\\right)^2 = 1 : 4$."
  },
  {
    subject: "Physics",
    questionText: "A constant voltage $50\\text{ V}$ is applied across bridge network between A and B. Current through central branch CD is:",
    imageUrl: "/neetimages/neet_2025_q7.svg",
    optionA: "$3.0\\text{ A}$",
    optionB: "$1.5\\text{ A}$",
    optionC: "$2.0\\text{ A}$",
    optionD: "$2.5\\text{ A}$",
    correctOption: "C",
    explanation: "$I_{\\text{total}} = 24\\text{ A}$. $I_{1\\Omega} = 18\\text{ A}, I_{2\\Omega} = 16\\text{ A} \\implies I_{CD} = 18 - 16 = 2.0\\text{ A}$ (from C to D)."
  },
  {
    subject: "Physics",
    questionText: "Gases A and B at same pressure undergo equal heat absorption $\\Delta Q$ and same $\\Delta U$. Displacements are $16\\text{ cm}$ and $9\\text{ cm}$. Ratio of piston radii $r_A / r_B$ is:",
    optionA: "$\\sqrt{3}/2$",
    optionB: "$4/3$",
    optionC: "$3/4$",
    optionD: "$2/\\sqrt{3}$",
    correctOption: "C",
    explanation: "$W_A = W_B \\implies P(\\pi r_A^2 d_A) = P(\\pi r_B^2 d_B) \\implies \\frac{r_A}{r_B} = \\sqrt{\\frac{d_B}{d_A}} = \\sqrt{\\frac{9}{16}} = \\frac{3}{4}$."
  },
  {
    subject: "Physics",
    questionText: "Two chambers ($V_1 = 2\\text{ L}, P_1 = 1\\text{ atm}$ and $V_2 = 3\\text{ L}, P_2 = 2\\text{ atm}$) mix when partition is removed. Equilibrium pressure is:",
    optionA: "$1.8\\text{ atm}$",
    optionB: "$1.3\\text{ atm}$",
    optionC: "$1.6\\text{ atm}$",
    optionD: "$1.4\\text{ atm}$",
    correctOption: "C",
    explanation: "$P(V_1 + V_2) = P_1 V_1 + P_2 V_2 \\implies P(5) = 1(2) + 2(3) = 8 \\implies P = 1.6\\text{ atm}$."
  },
  {
    subject: "Physics",
    questionText: "Martian orbit radius is 4 times Mercury. If Martian year is 687 days, length of 1 year on Mercury by Kepler's 3rd law is:",
    optionA: "$124\\text{ days}$",
    optionB: "$88\\text{ days}$ ($85.88\\text{ days}$)",
    optionC: "$225\\text{ days}$",
    optionD: "$172\\text{ days}$",
    correctOption: "B",
    explanation: "$T_M / T_{\\text{Merc}} = (R_M / R_{\\text{Merc}})^{3/2} = 4^{3/2} = 8 \\implies T_{\\text{Merc}} = 687 / 8 = 85.88 \\approx 88\\text{ Earth days}$."
  },
  {
    subject: "Physics",
    questionText: "Series LCR with $V = 220\\text{ V}, 50\\text{ Hz}, R = 20\\,\\Omega, X_C = 25\\,\\Omega, X_L = 45\\,\\Omega$. Current and phase angle $\\phi$ are:",
    optionA: "$15.6\\text{ A and } 45^\\circ$",
    optionB: "$7.8\\text{ A and } 30^\\circ$",
    optionC: "$7.8\\text{ A and } 45^\\circ$",
    optionD: "$15.6\\text{ A and } 30^\\circ$",
    correctOption: "C",
    explanation: "$Z = \\sqrt{20^2 + (45-25)^2} = 20\\sqrt{2} = 28.28\\,\\Omega$. $I = \\frac{220}{20\\sqrt{2}} = 7.78\\text{ A} \\approx 7.8\\text{ A}$. $\\tan\\phi = \\frac{20}{20} = 1 \\implies \\phi = 45^\\circ$."
  },
  {
    subject: "Physics",
    questionText: "Wire of resistance $R$ cut into 8 equal parts. Two sets of 4 pieces in parallel are connected in series. Net resistance is:",
    optionA: "$R/8$",
    optionB: "$R/64$",
    optionC: "$R/32$",
    optionD: "$R/16$",
    correctOption: "D",
    explanation: "$R_{\\text{piece}} = R/8$. Parallel set $= (R/8)/4 = R/32$. Two sets in series $= R/32 + R/32 = R/16$."
  },
  {
    subject: "Physics",
    questionText: "The Boolean logic implementation of $Y_1 = \\overline{A+B}$ and $Y_2 = \\overline{A \\cdot B}$ combined into output is equivalent to an/a:",
    optionA: "NOR gate",
    optionB: "AND gate",
    optionC: "NAND gate",
    optionD: "OR gate",
    correctOption: "A",
    explanation: "Tracing the logic gives $Y = \\overline{A+B}$, which corresponds to a NOR gate."
  },
  {
    subject: "Physics",
    questionText: "Spheres A and B ($q$) repel with force $F$. Uncharged sphere C touches A then B and is removed. New force between A and B is:",
    optionA: "$\\frac{3}{8} F$",
    optionB: "$\\frac{3}{5} F$",
    optionC: "$\\frac{2}{3} F$",
    optionD: "$F/2$",
    correctOption: "A",
    explanation: "After touching A: $q_A = q/2, q_C = q/2$. After touching B: $q_B = (q + q/2)/2 = 3q/4$. New force $F' = \\frac{k(q/2)(3q/4)}{r^2} = \\frac{3}{8} F$."
  },
  {
    subject: "Physics",
    questionText: "Vernier caliper: $10\\text{ VSD} = 9\\text{ MSD} (1\\text{ MSD} = 0.1\\text{ cm})$. Zero error $= +0.1\\text{ cm}$. MSR $= 5\\text{ cm}$, VSR $= 8$. Correct diameter is:",
    optionA: "$5.00\\text{ cm}$",
    optionB: "$5.18\\text{ cm}$",
    optionC: "$5.08\\text{ cm}$",
    optionD: "$4.98\\text{ cm}$",
    correctOption: "D",
    explanation: "$\\text{Observed} = 5 + 8(0.01) = 5.08\\text{ cm}$. $\\text{Corrected} = 5.08 - (+0.1) = 4.98\\text{ cm}$."
  },
  {
    subject: "Physics",
    questionText: "Position-time relation is $t = x^2 + x$. Acceleration of the particle is:",
    optionA: "$\\frac{2}{2x+1}$",
    optionB: "$-\\frac{2}{(x+2)^3}$",
    optionC: "$-\\frac{2}{(2x+1)^3}$",
    optionD: "$\\frac{2}{(x+1)^3}$",
    correctOption: "C",
    explanation: "$v = \\frac{1}{2x+1} \\implies a = v \\frac{dv}{dx} = \\frac{1}{2x+1}\\left( -\\frac{2}{(2x+1)^2} \\right) = -\\frac{2}{(2x+1)^3}$."
  },
  {
    subject: "Physics",
    questionText: "Which graph correctly represents the variation of photoelectric saturation current with INTENSITY of incident light?",
    optionA: "Graph B and D",
    optionB: "Graph A only (Linear straight line passing through origin)",
    optionC: "Graph A and C",
    optionD: "Graph A and D",
    correctOption: "B",
    explanation: "Photoelectric current is directly proportional to the intensity of incident light above threshold frequency."
  },
  {
    subject: "Physics",
    questionText: "A particle of mass $m$ moves under constant central force $F$. By Bohr quantization ($L = m v r = nh/2\\pi$), radius $r$ and speed $v$ depend on $n$ as:",
    optionA: "$r \\propto n^{4/3}; v \\propto n^{-1/3}$",
    optionB: "$r \\propto n^{1/3}; v \\propto n^{1/3}$",
    optionC: "$r \\propto n^{1/3}; v \\propto n^{2/3}$",
    optionD: "$r \\propto n^{2/3}; v \\propto n^{1/3}$",
    correctOption: "D",
    explanation: "$F = \\frac{m v^2}{r} = \\text{const} \\implies r \\propto v^2$. Combining with $m v r \\propto n \\implies v^3 \\propto n \\implies v \\propto n^{1/3}, r \\propto n^{2/3}$."
  },
  {
    subject: "Physics",
    questionText: "Bob with horizontal speed $v_0$ has string slack at angle $\\theta$ from horizontal ($mg\\sin\\theta = mv^2/l$). Ratio $v / v_0$ is:",
    optionA: "$\\left(\\frac{\\sin\\theta}{2 + 3\\sin\\theta}\\right)^{1/2}$",
    optionB: "$(\\sin\\theta)^{1/2}$",
    optionC: "$\\left(\\frac{1}{2 + 3\\sin\\theta}\\right)^{1/2}$",
    optionD: "$\\left(\\frac{\\cos\\theta}{2 + 3\\sin\\theta}\\right)^{1/2}$",
    correctOption: "A",
    explanation: "Energy conservation: $\\frac{1}{2}mv_0^2 = \\frac{1}{2}mv^2 + mgl(1+\\sin\\theta)$. Using $gl = v^2/\\sin\\theta \\implies v/v_0 = \\sqrt{\\frac{\\sin\\theta}{2 + 3\\sin\\theta}}$."
  },
  {
    subject: "Physics",
    questionText: "In full wave rectifier with $V_{\\text{in}} = 220\\sin(100\\pi t)$, at $t = 15\\text{ ms}$ ($3T/4$, negative half cycle), biasing states are:",
    optionA: "$D_1$ and $D_2$ both reverse biased",
    optionB: "$D_1$ forward biased, $D_2$ reverse biased",
    optionC: "$D_1$ is reverse biased, $D_2$ is forward biased",
    optionD: "$D_1$ and $D_2$ both forward biased",
    correctOption: "C",
    explanation: "At $t = 15\\text{ ms} = \\frac{3}{4}T$, input is in negative peak, forward-biasing $D_2$ and reverse-biasing $D_1$."
  },
  {
    subject: "Physics",
    questionText: "Deflating balloon time $T \\propto S^\\alpha A^\\beta \\rho^\\gamma R^\\delta$. Dimensional analysis yields powers:",
    optionA: "$a = 1/2, \\alpha = 1/2, \\beta = -1/2, \\gamma = -1/2, \\delta = 7/2$",
    optionB: "$a = 1/2, \\alpha = 1/2, \\beta = -1, \\gamma = +1, \\delta = 3/2$",
    optionC: "$a = -1/2, \\alpha = -1/2, \\beta = -1, \\gamma = -1/2, \\delta = 5/2$",
    optionD: "$a = -1/2, \\alpha = -1/2, \\beta = -1, \\gamma = 1/2, \\delta = 7/2$",
    correctOption: "D",
    explanation: "Equating dimensions $[M^0 L^0 T^1] = (M T^{-2})^\\alpha (L^2)^\\beta (M L^{-3})^\\gamma L^\\delta \\implies \\alpha = -1/2, \\gamma = 1/2, \\beta = -1, \\delta = 7/2$."
  },
  {
    subject: "Physics",
    questionText: "Microscope has $f_o = 2\\text{ cm}, f_e = 4\\text{ cm}, L = 40\\text{ cm}, D = 25\\text{ cm}$. Total magnification $m$ is:",
    optionA: "250",
    optionB: "100",
    optionC: "125",
    optionD: "150",
    correctOption: "C",
    explanation: "$m = \\frac{L}{f_o} \\times \\frac{D}{f_e} = \\frac{40}{2} \\times \\frac{25}{4} = 20 \\times 6.25 = 125$."
  },
  {
    subject: "Physics",
    questionText: "Two identical masses oscillate vertically on springs $k_1, k_2$ with same maximum speed ($v_{\\text{max}} = A\\omega$). Ratio of amplitudes $A_Q / A_P$ is:",
    optionA: "$\\sqrt{\\frac{k_1}{k_2}}$",
    optionB: "$\\frac{k_2}{k_1}$",
    optionC: "$\\frac{k_1}{k_2}$",
    optionD: "$\\sqrt{\\frac{k_2}{k_1}}$",
    correctOption: "A",
    explanation: "$A_P \\sqrt{k_1/m} = A_Q \\sqrt{k_2/m} \\implies \\frac{A_Q}{A_P} = \\sqrt{\\frac{k_1}{k_2}}$."
  },
  {
    subject: "Physics",
    questionText: "Charging circular capacitor with constant $d\\sigma/dt$. Magnetic field due to displacement current is:",
    optionA: "Zero between plates and non-zero outside",
    optionB: "Zero at all places",
    optionC: "Constant between plates",
    optionD: "Non-zero everywhere with maximum at the imaginary cylindrical boundary connecting plate peripheries ($B \\propto r$ inside, $1/r$ outside)",
    correctOption: "D",
    explanation: "$B(r) = \\frac{\\mu_0 I_d r}{2\\pi R^2}$ for $r \\le R$, peaking at rim $r = R$ and decaying as $\\frac{\\mu_0 I_d}{2\\pi r}$ outside."
  },
  {
    subject: "Physics",
    questionText: "Electric dipole $p = 5 \\times 10^{-6}\\text{ C m}$ rotated by $60^\\circ$ in $E = 4 \\times 10^5\\text{ N/C}$. Change in potential energy $\\Delta U$ is:",
    optionA: "$1.5\\text{ J}$",
    optionB: "$0.8\\text{ J}$",
    optionC: "$1.0\\text{ J}$",
    optionD: "$1.2\\text{ J}$",
    correctOption: "C",
    explanation: "$\\Delta U = p E (\\cos 0^\\circ - \\cos 60^\\circ) = (5 \\times 10^{-6})(4 \\times 10^5)(1 - 0.5) = 2.0 \\times 0.5 = 1.0\\text{ J}$."
  },
  {
    subject: "Physics",
    questionText: "Body takes 2 times longer to slide down rough $45^\\circ$ incline than smooth. Kinetic friction $\\mu_k$ is:",
    optionA: "$0.75$",
    optionB: "$0.25$",
    optionC: "$0.40$",
    optionD: "$0.50$",
    correctOption: "A",
    explanation: "$\\mu_k = \\tan\\theta\\left(1 - \\frac{1}{n^2}\\right) = \\tan 45^\\circ\\left(1 - \\frac{1}{4}\\right) = 0.75$."
  },
  {
    subject: "Physics",
    questionText: "de-Broglie wavelength of electron in $n = 2$ state of Hydrogen atom ($a_0 = 0.052\\text{ nm}$) is close to:",
    optionA: "$2.67\\text{ nm}$",
    optionB: "$0.067\\text{ nm}$",
    optionC: "$0.67\\text{ nm}$ ($0.653\\text{ nm}$)",
    optionD: "$1.67\\text{ nm}$",
    correctOption: "C",
    explanation: "$2\\pi r_2 = 2 \\lambda \\implies \\lambda = \\pi r_2 = \\pi (4 a_0) = 4(3.14)(0.052\\text{ nm}) = 0.653\\text{ nm} \\approx 0.67\\text{ nm}$."
  },
  {
    subject: "Physics",
    questionText: "Sun rotates in 27 days. If radius doubles without external torque, new period of revolution $T'$ is:",
    optionA: "$108\\text{ days}$",
    optionB: "$100\\text{ days}$",
    optionC: "$105\\text{ days}$",
    optionD: "$115\\text{ days}$",
    correctOption: "A",
    explanation: "$I_1 \\omega_1 = I_2 \\omega_2 \\implies R^2 / T = (2R)^2 / T' \\implies T' = 4 T = 4 \\times 27 = 108\\text{ days}$."
  },
  {
    subject: "Physics",
    questionText: "$P = a^3 b^2 / (c \\sqrt{d})$. Errors in $a, b, c, d$ are $1\\%, 3\\%, 2\\%, 4\\%$. Maximum percentage error in $P$ is:",
    optionA: "$15\\%$",
    optionB: "$10\\%$",
    optionC: "$2\\%$",
    optionD: "$13\\%$",
    correctOption: "D",
    explanation: "$\\frac{\\Delta P}{P} = 3(1\\%) + 2(3\\%) + 1(2\\%) + \\frac{1}{2}(4\\%) = 3 + 6 + 2 + 2 = 13\\%$."
  },
  {
    subject: "Physics",
    questionText: "Capacitor has dielectric slabs $t_1 = 3d/8 (K_1)$ and $t_2 = d/2 (K_2)$. $C_{\\text{eq}} = 2C_0$. If $K_1 = 1.25 K_2$, value of $K_1$ is:",
    optionA: "$1.33$",
    optionB: "$2.66$",
    optionC: "$2.33$",
    optionD: "$1.60$",
    correctOption: "B",
    explanation: "$\\frac{d}{2} = \\frac{3d/8}{K_1} + \\frac{d/2}{K_1/1.25} + \\frac{d/8}{1} \\implies \\frac{1}{2} - \\frac{1}{8} = \\frac{3}{8K_1} + \\frac{5}{8K_1} = \\frac{1}{K_1} \\implies K_1 = \\frac{8}{3} = 2.66$."
  },
  {
    subject: "Physics",
    questionText: "Ball ($0.5\\text{ kg}$) dropped from $40\\text{ m}$ rebounds to $10\\text{ m}$ ($g = 9.8\\text{ m/s}^2$). Impulse imparted is:",
    optionA: "$84\\text{ N s}$",
    optionB: "$21\\text{ N s}$",
    optionC: "$7\\text{ N s}$",
    optionD: "0",
    correctOption: "B",
    explanation: "$v_1 = \\sqrt{2(9.8)(40)} = 28\\text{ m/s} \\downarrow, v_2 = \\sqrt{2(9.8)(10)} = 14\\text{ m/s} \\uparrow$. Impulse $= m(v_2 - (-v_1)) = 0.5(14+28) = 21\\text{ N s}$."
  },
  {
    subject: "Physics",
    questionText: "Girl riding scooty at $60\\text{ km/h}$ sees bus every $30\\text{ min}$ in same direction and every $10\\text{ min}$ in opposite direction. Bus speed and interval $T$ are:",
    optionA: "$15\\text{ min}, 120\\text{ km/h}$",
    optionB: "$9\\text{ min}, 40\\text{ km/h}$",
    optionC: "$25\\text{ min}, 100\\text{ km/h}$",
    optionD: "$10\\text{ min}, 90\\text{ km/h}$",
    correctOption: "A",
    explanation: "$(v-60)30 = (v+60)10 \\implies 3v - 180 = v + 60 \\implies 2v = 240 \\implies v = 120\\text{ km/h}$. $T = \\frac{(120-60)30}{120} = 15\\text{ min}$."
  },
  {
    subject: "Physics",
    questionText: "$30\\text{ L}$ tank has $18.2\\text{ mol } \\text{O}_2$. Gauge pressure drops to $11\\text{ atm}$ ($P_{\\text{abs}} = 12\\text{ atm}$) at $27^\\circ\\text{C}$. Mass of oxygen withdrawn is ($M = 32$):",
    optionA: "$0.156\\text{ kg}$",
    optionB: "$0.125\\text{ kg}$",
    optionC: "$0.144\\text{ kg}$",
    optionD: "$0.116\\text{ kg}$",
    correctOption: "D",
    explanation: "$n_{\\text{left}} = \\frac{12 \\times 1.01 \\times 10^5 \\times 0.030}{(100/12) \\times 300} = 14.54\\text{ mol}$. Removed $= 18.2 - 14.54 = 3.656\\text{ mol} \\times 32 = 117\\text{ g} = 0.116\\text{ kg}$."
  },
  {
    subject: "Physics",
    questionText: "In circuit with $1\\text{ H}$ inductor, $5\\text{ V}$ battery, and $2\\,\\Omega$ resistor carrying $i = 2\\text{ A}$ increasing at $1\\text{ A/s}$, potential difference $V_A - V_B$ is:",
    optionA: "$10\\text{ V}$",
    optionB: "$5\\text{ V}$",
    optionC: "$6\\text{ V}$",
    optionD: "$9\\text{ V}$",
    correctOption: "A",
    explanation: "$V_A - L \\frac{di}{dt} - 5 - i R = V_B \\implies V_A - 1(1) - 5 - 2(2) = V_B \\implies V_A - V_B = 10\\text{ V}$."
  },
  {
    subject: "Physics",
    questionText: "Spring-mass system leaks sand slowly. Schematically, average frequency $\\omega(t)$ and amplitude $A(t)$ with time:",
    optionA: "Both decrease",
    optionB: "Both increase",
    optionC: "Frequency $\\omega(t)$ increases and amplitude $A(t)$ decreases",
    optionD: "Both constant",
    correctOption: "C",
    explanation: "$\\omega = \\sqrt{k/m}$ increases as mass leaks, while equilibrium extension and potential energy decrease, reducing amplitude."
  },
  {
    subject: "Physics",
    questionText: "Quantized magnetic flux through orbit is $\\Phi = n(h/e)$. In lowest energy state ($n=1$), electron magnetic moment is:",
    optionA: "$\\frac{h e B}{2\\pi m}$",
    optionB: "$\\frac{h e}{\\pi m}$",
    optionC: "$\\frac{h e}{2\\pi m}$ (Bohr magneton $\\mu_B$)",
    optionD: "$\\frac{h e B}{\\pi m}$",
    correctOption: "C",
    explanation: "$\\mu = I A = \\frac{e}{T} \\pi r^2 = \\frac{e v r}{2} = \\frac{e (n h / 2\\pi)}{2 m} = \\frac{n h e}{2\\pi m} \\implies \\frac{h e}{2\\pi m}$ for $n=1$."
  },
  {
    subject: "Physics",
    questionText: "Body weighs $48\\text{ N}$ on Earth's surface. Weight at height $h = R/3$ above surface is:",
    optionA: "$36\\text{ N}$",
    optionB: "$16\\text{ N}$",
    optionC: "$27\\text{ N}$",
    optionD: "$32\\text{ N}$",
    correctOption: "C",
    explanation: "$W_h = W \\left(\\frac{R}{R + R/3}\\right)^2 = 48 \\left(\\frac{3}{4}\\right)^2 = 48 \\times \\frac{9}{16} = 27\\text{ N}$."
  },
  {
    subject: "Physics",
    questionText: "Differential equation for meniscus surface profile $y(x)$ with surface tension $S$ and density $\\rho$ under gravity $g$ is:",
    optionA: "$\\frac{dy}{dx} = \\frac{\\rho g}{S} x$",
    optionB: "$\\frac{d^2 y}{dx^2} = \\frac{\\rho g}{S} x$",
    optionC: "$\\frac{d^2 y}{dx^2} = \\frac{\\rho g}{S} y$",
    optionD: "$\\frac{d^2 y}{dx^2} = \\sqrt{\\frac{\\rho g}{S}}$",
    correctOption: "C",
    explanation: "Laplace pressure: $\\Delta P = \\rho g y = S \\times \\text{Curvature} = S \\frac{d^2 y}{dx^2} \\implies \\frac{d^2 y}{dx^2} = \\frac{\\rho g}{S} y$."
  },
  {
    subject: "Physics",
    questionText: "Polaroid sheet placed between crossed polaroids at $22.5^\\circ$. Transmitted intensity is:",
    optionA: "$I_0 / 16$",
    optionB: "$I_0 / 2$",
    optionC: "$I_0 / 4$",
    optionD: "$I_0 / 8$",
    correctOption: "D",
    explanation: "$I = I_0 \\cos^2(22.5^\\circ) \\sin^2(22.5^\\circ) = \\frac{I_0}{4} \\sin^2(45^\\circ) = \\frac{I_0}{4} \\times \\frac{1}{2} = \\frac{I_0}{8}$."
  },
  {
    subject: "Physics",
    questionText: "A photon and electron have same energy $E$. Ratio $\\lambda_{\\text{photon}} / \\lambda_{\\text{electron}}$ is:",
    optionA: "$\\frac{1}{c}\\sqrt{\\frac{E}{2m}}$",
    optionB: "$\\sqrt{\\frac{E}{2m}}$",
    optionC: "$c\\sqrt{2mE}$",
    optionD: "$c\\sqrt{\\frac{2m}{E}}$",
    correctOption: "D",
    explanation: "$\\lambda_{\\text{ph}} = \\frac{hc}{E}, \\lambda_e = \\frac{h}{\\sqrt{2mE}} \\implies \\frac{\\lambda_{\\text{ph}}}{\\lambda_e} = \\frac{hc}{E} \\frac{\\sqrt{2mE}}{h} = c\\sqrt{\\frac{2m}{E}}$."
  },
  {
    subject: "Physics",
    questionText: "Unpolarized beam in air strikes medium with $\\mu = 1.73 = \\sqrt{3}$ at Brewster's angle $\\theta_p = 60^\\circ$. Then:",
    optionA: "Transmitted light is completely polarized with $r = 30^\\circ$",
    optionB: "Reflected light is completely polarized and angle of reflection is $60^\\circ$",
    optionC: "Reflected light is partially polarized",
    optionD: "Both completely polarized",
    correctOption: "B",
    explanation: "By Brewster's law $\\tan\\theta_p = \\sqrt{3} \\implies \\theta_p = 60^\\circ$; reflected beam is completely linearly polarized."
  },
  {
    subject: "Physics",
    questionText: "Uniform rod ($M = 20\\text{ kg}, L = 5\\text{ m}$) leans against smooth wall at $60^\\circ$ to vertical ($30^\\circ$ to floor). Friction from floor is ($g = 10\\text{ m/s}^2$):",
    optionA: "$200\\sqrt{3}\\text{ N}$",
    optionB: "$100\\text{ N}$",
    optionC: "$100\\sqrt{3}\\text{ N}$",
    optionD: "$200\\text{ N}$",
    correctOption: "C",
    explanation: "Torque about base: $M g \\frac{L}{2}\\cos 30^\\circ = N_{\\text{wall}} L \\sin 30^\\circ \\implies f = N_{\\text{wall}} = \\frac{M g}{2}\\cot 30^\\circ = \\frac{200}{2}\\sqrt{3} = 100\\sqrt{3}\\text{ N}$."
  },
  {
    subject: "Physics",
    questionText: "Three rods of conductivities $2K, K, 2K$ in series with ends at $3T$ and $T$. Junction temperatures $T_1, T_2$ have ratio $T_1 / T_2$ equal to:",
    optionA: "$5/4$",
    optionB: "$3/2$",
    optionC: "$4/3$",
    optionD: "$5/3$",
    correctOption: "D",
    explanation: "$R_{\\text{total}} = \\frac{l}{2KA} + \\frac{l}{KA} + \\frac{l}{2KA} = \\frac{2l}{KA}$. Heat current $H = \\frac{2T}{2l/KA} = \\frac{T KA}{l}$. $T_1 = 3T - H R_1 = 2.5T$, $T_2 = T + H R_3 = 1.5T \\implies T_1 / T_2 = 2.5 / 1.5 = 5/3$."
  },
  {
    subject: "Physics",
    questionText: "Cars A and B ($KE = 100\\text{ J}, 225\\text{ J}$) stop after $1000\\text{ m}$ and $1500\\text{ m}$. Ratio of braking forces $F_A / F_B$ is:",
    optionA: "$1/2$",
    optionB: "$3/2$",
    optionC: "$2/3$",
    optionD: "$1/3$",
    correctOption: "C",
    explanation: "$F_A S_A = KE_A, F_B S_B = KE_B \\implies \\frac{F_A}{F_B} = \\frac{100}{225} \\times \\frac{1500}{1000} = \\frac{4}{9} \\times \\frac{3}{2} = \\frac{2}{3}$."
  },
  {
    subject: "Physics",
    questionText: "Sphere of radius $R$ cut from solid sphere of radius $2R$. Ratio of moment of inertia of smaller sphere to rest of sphere about Y-axis is:",
    imageUrl: "/neetimages/neet_2025_q45.svg",
    optionA: "$7/64$",
    optionB: "$7/8$",
    optionC: "$7/40$",
    optionD: "$7/57$",
    correctOption: "D",
    explanation: "$I_{\\text{whole}} = \\frac{2}{5}M(2R)^2 = \\frac{8}{5}MR^2 = \\frac{64}{40}MR^2$. $I_{\\text{small}} = \\frac{2}{5}(M/8)R^2 + (M/8)R^2 = \\frac{7}{40}MR^2 \\implies \\frac{I_{\\text{small}}}{I_{\\text{rem}}} = \\frac{7}{64-7} = \\frac{7}{57}$."
  },

  // -------------------------------------------------------------
  // CHEMISTRY (Q46 - Q90)
  // -------------------------------------------------------------
  {
    subject: "Chemistry",
    questionText: "Molar conductivity $\\Lambda_m$ of $0.050\\text{ M}$ weak acid is $90\\text{ S cm}^2\\text{mol}^{-1}$. If $\\Lambda_m^\\circ = 349.6 + 50.4 = 400$, degree of dissociation $\\alpha$ is:",
    optionA: "0.215",
    optionB: "0.115",
    optionC: "0.125",
    optionD: "0.225",
    correctOption: "D",
    explanation: "$\\alpha = \\frac{\\Lambda_m}{\\Lambda_m^\\circ} = \\frac{90}{400} = 0.225$."
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: A diatomic molecule with bond order zero is quite stable.\nStatement II: As bond order increases, bond length increases.",
    optionA: "Statement I false, II true",
    optionB: "Both true",
    optionC: "Both Statement I and Statement II are FALSE",
    optionD: "Statement I true, II false",
    correctOption: "C",
    explanation: "Zero bond order means molecule cannot exist (unstable); higher bond order shortens bond length."
  },
  {
    subject: "Chemistry",
    questionText: "Ratio of wavelengths absorbed by Hydrogen atom for $n = 2 \\to 3$ and $n = 4 \\to 6$ transitions is:",
    optionA: "$1/4$",
    optionB: "$1/36$",
    optionC: "$1/16$",
    optionD: "$1/9$",
    correctOption: "A",
    explanation: "$\\frac{1}{\\lambda_{2\\to 3}} = R_H\\left(\\frac{1}{4}-\\frac{1}{9}\\right) = \\frac{5R_H}{36}$. $\\frac{1}{\\lambda_{4\\to 6}} = R_H\\left(\\frac{1}{16}-\\frac{1}{36}\\right) = \\frac{5R_H}{144} \\implies \\frac{\\lambda_{2\\to 3}}{\\lambda_{4\\to 6}} = \\frac{36/5}{144/5} = \\frac{1}{4}$."
  },
  {
    subject: "Chemistry",
    questionText: "Correct increasing order of wavelength of light absorbed for: A. $[\\text{Co(NH}_3)_6]^{3+}$, B. $[\\text{Co(CN)}_6]^{3-}$, C. $[\\text{Cu(H}_2\\text{O})_4]^{2+}$, D. $[\\text{Ti(H}_2\\text{O})_6]^{3+}$ is:",
    optionA: "$C < A < D < B$",
    optionB: "$B < D < A < C$",
    optionC: "$B (310\\text{ nm}) < A (475\\text{ nm}) < D (498\\text{ nm}) < C (600\\text{ nm})$",
    optionD: "$C < D < A < B$",
    correctOption: "C",
    explanation: "$\\lambda_{\\text{abs}} \\propto 1/\\Delta_o$. Stronger ligands give higher crystal field splitting and absorb shorter wavelengths: $\\text{CN}^- (B) < \\text{NH}_3 (A) < \\text{H}_2\\text{O in Ti}^{3+} (D) < \\text{Cu}^{2+} (C)$."
  },
  {
    subject: "Chemistry",
    questionText: "If rate constant is $k = 0.03\\text{ s}^{-1}$, time taken for concentration to reduce from $7.2\\text{ M}$ to $0.9\\text{ M}$ ($3\\text{ half-lives}$) is:",
    optionA: "$21.0\\text{ s}$",
    optionB: "$69.3\\text{ s}$",
    optionC: "$23.1\\text{ s}$",
    optionD: "$210\\text{ s}$",
    correctOption: "B",
    explanation: "$t = \\frac{2.303}{0.03}\\log(7.2/0.9) = \\frac{2.303 \\times 3\\log 2}{0.03} = 69.3\\text{ s}$."
  },
  {
    subject: "Chemistry",
    questionText: "Match Mixtures with Separation Methods:\nA. $\\text{CHCl}_3 + \\text{C}_6\\text{H}_5\\text{NH}_2$, B. Crude petroleum, C. Glycerol from spent-lye, D. Aniline - water\nI. Vacuum distillation, II. Steam distillation, III. Fractional distillation, IV. Simple distillation",
    optionA: "A-III, B-IV, C-II, D-I",
    optionB: "A-IV, B-III, C-I, D-II",
    optionC: "A-IV, B-III, C-II, D-I",
    optionD: "A-III, B-IV, C-I, D-II",
    correctOption: "B",
    explanation: "Chloroform+Aniline = Simple distillation (IV), Petroleum = Fractional (III), Glycerol = Vacuum distillation (I), Aniline+Water = Steam distillation (II)."
  },
  {
    subject: "Chemistry",
    questionText: "Product of 4-benzoylbutyronitrile with excess $\\text{CH}_3\\text{MgBr}$ followed by $\\text{H}_3\\text{O}^+$ hydrolysis is:",
    optionA: "Ketone with acid",
    optionB: "Alcohol with nitrile",
    optionC: "Tertiary alcohol with methyl ketone ($\\,\\text{Ph-C(Me)(OH)}-(\\text{CH}_2)_2-\\text{CO-Me}\\, $)",
    optionD: "Diol",
    correctOption: "C",
    explanation: "Grignard attacks ketone to give tertiary alcohol and attacks nitrile to yield methyl ketone upon acidic workup."
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following compounds exhibits geometrical Cis-Trans isomerism?",
    optionA: "1,2-Dimethylcyclohexane (Cis-trans stereoisomers)",
    optionB: "Pent-1-ene",
    optionC: "2-Methylhex-2-ene",
    optionD: "1,1-Dimethylcyclopropane",
    correctOption: "A",
    explanation: "1,2-Dimethylcyclohexane possesses two stereocenters with restricted ring rotation, existing as cis and trans diastereomers."
  },
  {
    subject: "Chemistry",
    questionText: "Choose the samples with equal total number of atoms:\nA. $212\\text{ g } \\text{Na}_2\\text{CO}_3$, B. $248\\text{ g } \\text{Na}_2\\text{O}$, C. $240\\text{ g } \\text{NaOH}$, D. $12\\text{ g } \\text{H}_2$, E. $220\\text{ g } \\text{CO}_2$",
    optionA: "B, D and E only",
    optionB: "A, B and C only",
    optionC: "A, B and D only (All contain $12 N_A$ atoms)",
    optionD: "B, C and D only",
    correctOption: "C",
    explanation: "$A: 2 \\times 6 N_A = 12 N_A$, $B: 4 \\times 3 N_A = 12 N_A$, $D: 6 \\times 2 N_A = 12 N_A$."
  },
  {
    subject: "Chemistry",
    questionText: "Correct decreasing order of $C-H$ bond dissociation energy for $sp, sp^2, sp^3$ hybridized carbons is:",
    optionA: "$\\text{II} > \\text{III} > \\text{I}$",
    optionB: "$\\text{II } (sp) > \\text{I } (sp^2) > \\text{III } (sp^3)$",
    optionC: "$\\text{I} > \\text{II} > \\text{III}$",
    optionD: "$\\text{III} > \\text{II} > \\text{I}$",
    correctOption: "B",
    explanation: "Higher s-character increases orbital electronegativity and bond strength: $sp (50\\%) > sp^2 (33\\%) > sp^3 (25\\%)$."
  },
  {
    subject: "Chemistry",
    questionText: "Standard heat of formation of $\\text{Ba}^{2+}(aq)$ in $\\text{kcal/mol}$ from Born-Haber cycle data is:",
    optionA: "$+220.5$",
    optionB: "$-128.5\\text{ kcal/mol}$",
    optionC: "$-133.0$",
    optionD: "$+133.0$",
    correctOption: "B",
    explanation: "$\\Delta H_f^\\circ(\\text{Ba}^{2+}) = -349 - (-4.5) - (-216) = -128.5\\text{ kcal/mol}$."
  },
  {
    subject: "Chemistry",
    questionText: "Oxidation states of underlined elements in $\\text{KO}_2, \\text{H}_2\\text{O}_2, \\text{H}_2\\text{SO}_4$ are respectively:",
    optionA: "$+4, -4, +6$",
    optionB: "$+1\\text{ (in } \\text{KO}_2\\text{)}, -1\\text{ (in } \\text{H}_2\\text{O}_2\\text{)}, +6\\text{ (in } \\text{H}_2\\text{SO}_4\\text{)}$",
    optionC: "$+2, -2, +6$",
    optionD: "$+1, -2, +4$",
    correctOption: "B",
    explanation: "$\\text{K}$ in superoxide is $+1$, oxygen in peroxide is $-1$, and sulphur in sulphuric acid is $+6$."
  },
  {
    subject: "Chemistry",
    questionText: "Which coordination complex has the MINIMUM electrical conductance in aqueous solution?",
    optionA: "$[\\text{Co(NH}_3)_5\\text{Cl}]\\text{Cl}$",
    optionB: "$[\\text{Co(NH}_3)_3\\text{Cl}_3]$ (Neutral non-electrolyte / zero ions)",
    optionC: "$[\\text{Co(NH}_3)_4\\text{Cl}_2]$",
    optionD: "$[\\text{Co(NH}_3)_6]\\text{Cl}_3$",
    correctOption: "B",
    explanation: "Neutral complex $[\\text{Co(NH}_3)_3\\text{Cl}_3]$ does not ionize in solution, exhibiting zero/minimum conductance."
  },
  {
    subject: "Chemistry",
    questionText: "Which reaction does NOT produce Benzene?",
    optionA: "Benzenediazonium chloride $+ \\text{H}_2\\text{O} / \\text{warm}$ (Yields Phenol)",
    optionB: "Sodium benzoate $+ \\text{sodalime}/\\Delta$",
    optionC: "n-Hexane $+ \\text{Mo}_2\\text{O}_3 / 773\\text{ K}$",
    optionD: "Acetylene through red hot iron tube at $873\\text{ K}$",
    correctOption: "A",
    explanation: "Hydrolysis of benzenediazonium chloride with warm water yields Phenol, not benzene."
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following complexes are PARAMAGNETIC?\nA. $[\\text{NiCl}_4]^{2-}$, B. $\\text{Ni(CO)}_4$, C. $[\\text{Ni(CN)}_4]^{2-}$, D. $[\\text{Ni(H}_2\\text{O})_6]^{2+}$, E. $\\text{Ni(PPh}_3)_4$",
    optionA: "A, D and E only",
    optionB: "A and C only",
    optionC: "B and E only",
    optionD: "A and D only (Both have 2 unpaired electrons)",
    correctOption: "D",
    explanation: "$[\\text{NiCl}_4]^{2-} (sp^3)$ and $[\\text{Ni(H}_2\\text{O})_6]^{2+} (sp^3d^2)$ contain weak field ligands with 2 unpaired electrons."
  },
  {
    subject: "Chemistry",
    questionText: "Which organic compound does NOT decolourize bromine water ($\text{Br}_2 / \\text{CCl}_4$)?",
    optionA: "Aniline",
    optionB: "Cyclohexane (Saturated alkane without active activation)",
    optionC: "Phenol",
    optionD: "Styrene",
    correctOption: "B",
    explanation: "Cyclohexane is a saturated alkane that does not react with bromine water in the dark."
  },
  {
    subject: "Chemistry",
    questionText: "Match Catalysts with Chemical Processes:\nA. Haber process, B. Wacker oxidation, C. Wilkinson catalyst, D. Ziegler-Natta catalyst\nI. Fe catalyst, II. $\\text{PdCl}_2$, III. $[(\\text{PPh}_3)_3\\text{RhCl}]$, IV. $\\text{TiCl}_4 + \\text{Al(CH}_3)_3$",
    optionA: "A-I, B-IV, C-III, D-II",
    optionB: "A-I, B-II, C-IV, D-III",
    optionC: "A-II, B-III, C-I, D-IV",
    optionD: "A-I, B-II, C-III, D-IV",
    correctOption: "D",
    explanation: "Haber = Fe (I), Wacker = $\\text{PdCl}_2$ (II), Wilkinson = Rhodium complex (III), Ziegler = $\\text{TiCl}_4$ (IV)."
  },
  {
    subject: "Chemistry",
    questionText: "Match Vitamins with Deficiency Diseases:\nA. Vitamin $\\text{B}_{12}$, B. Vitamin D, C. Vitamin $\\text{B}_2$, D. Vitamin $\\text{B}_6$\nI. Cheilosis, II. Convulsions, III. Rickets, IV. Pernicious anaemia",
    optionA: "A-IV, B-III, C-II, D-I",
    optionB: "A-I, B-III, C-II, D-IV",
    optionC: "A-IV, B-III, C-I, D-II",
    optionD: "A-II, B-III, C-I, D-IV",
    correctOption: "C",
    explanation: "$\\text{B}_{12}$ = Pernicious anaemia (IV), D = Rickets (III), $\\text{B}_2$ = Cheilosis (I), $\\text{B}_6$ = Convulsions (II)."
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: Ferromagnetism is considered an extreme form of paramagnetism.\nStatement II: Unpaired electrons in $\\text{Cr}^{2+} (n=4)$ equals $\\text{Nd}^{3+} (n=3)$.",
    optionA: "Statement I false, II true",
    optionB: "Both true",
    optionC: "Both false",
    optionD: "Statement I is TRUE but Statement II is FALSE",
    correctOption: "D",
    explanation: "$\\text{Cr}^{2+} (3d^4)$ has 4 unpaired electrons while $\\text{Nd}^{3+} (4f^3)$ has 3 unpaired electrons."
  },
  {
    subject: "Chemistry",
    questionText: "If half-life $t_{1/2} = 1\\text{ minute}$ for first order reaction, time for $99.9\\%$ completion ($10 t_{1/2}$) is:",
    optionA: "10 minutes",
    optionB: "2 minutes",
    optionC: "4 minutes",
    optionD: "5 minutes",
    correctOption: "A",
    explanation: "$t_{99.9\\%} = \\frac{2.303}{k}\\log(1000) = 3 \\times \\frac{2.303 \\times 0.301}{k} \\times 3.32 \\approx 10 t_{1/2} = 10\\text{ minutes}$."
  },
  {
    subject: "Chemistry",
    questionText: "Correct decreasing basicity order of amines in aqueous solution is:",
    optionA: "Benzenamine > ethanamine > N-methylaniline > N-ethylethanamine",
    optionB: "N-methylaniline > benzenamine > ethanamine > N-ethylethanamine",
    optionC: "N-ethylethanamine > ethanamine > benzenamine > N-methylaniline",
    optionD: "N-Ethylethanamine ($2^\\circ$) > Ethanamine ($1^\\circ$) > N-Methylaniline > Benzenamine",
    correctOption: "D",
    explanation: "Aliphatic $2^\\circ > 1^\\circ >$ aromatic secondary > aromatic primary (aniline)."
  },
  {
    subject: "Chemistry",
    questionText: "Match Cations with Qualitative Analysis Groups:\nA. $\\text{Co}^{2+}$, B. $\\text{Mg}^{2+}$, C. $\\text{Pb}^{2+}$, D. $\\text{Al}^{3+}$\nI. Group I, II. Group III, III. Group IV, IV. Group VI",
    optionA: "A-III, B-II, C-I, D-IV",
    optionB: "A-III, B-IV, C-II, D-I",
    optionC: "A-III, B-IV, C-I, D-II",
    optionD: "A-III, B-II, C-IV, D-I",
    correctOption: "C",
    explanation: "$\\text{Co}^{2+}$ = Group IV (III), $\\text{Mg}^{2+}$ = Group VI (IV), $\\text{Pb}^{2+}$ = Group I (I), $\\text{Al}^{3+}$ = Group III (II)."
  },
  {
    subject: "Chemistry",
    questionText: "For stepwise dissociation of polyprotic acid $\\text{H}_3\\text{PO}_4$ ($K_{a1}, K_{a2}, K_{a3}$):\nA. $\\log K = \\log K_{a1} + \\log K_{a2} + \\log K_{a3}$\nB. $\\text{H}_3\\text{PO}_4$ is stronger acid than $\\text{H}_2\\text{PO}_4^-$ and $\\text{HPO}_4^{2-}$\nC. $K_{a1} > K_{a2} > K_{a3}$",
    optionA: "A, B and C only",
    optionB: "A and B only",
    optionC: "A and C only",
    optionD: "B, C and D only",
    correctOption: "A",
    explanation: "First ionization constant is always much larger than successive steps as losing proton from negative ion is harder."
  },
  {
    subject: "Chemistry",
    questionText: "Select the TRUE periodic properties statements:\nA. Ga and Cs low melting points\nB. N and Cl same Pauling electronegativity (3.0)\nC. $\\text{Ar, K}^+, \\text{Cl}^-, \\text{Ca}^{2+}, \\text{S}^{2-}$ are isoelectronic (18 electrons)\nD. First IE: $\\text{Si} > \\text{Mg} > \\text{Al} > \\text{Na}$\nE. Atomic radius $\\text{Cs} > \\text{Rb} > \\text{Li}$",
    optionA: "A, C, and E only",
    optionB: "A, B, and E only",
    optionC: "C and E only",
    optionD: "C and D only",
    correctOption: "C",
    explanation: "Statements C (18-electron isoelectronic series) and E (Cs largest in alkali metals) are unequivocally true."
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: Nitrogen forms ammonia ($\\text{NH}_3$) and arsenic forms arsine ($\\text{AsH}_3$).\nStatement II: Antimony cannot form pentoxide ($\\text{Sb}_2\\text{O}_5$).",
    optionA: "Statement I incorrect, II correct",
    optionB: "Both correct",
    optionC: "Both incorrect",
    optionD: "Statement I is correct but Statement II is incorrect (Sb forms stable $\\text{Sb}_2\\text{O}_5$)",
    correctOption: "D",
    explanation: "Group 15 elements form pentoxides $\\text{E}_2\\text{O}_5$, including antimony pentoxide $\\text{Sb}_2\\text{O}_5$."
  },
  {
    subject: "Chemistry",
    questionText: "Which aqueous solution exhibits the HIGHEST boiling point elevation ($i \\times m$)?",
    optionA: "$0.015\\text{ M Glucose} (i \\times m = 0.015)$",
    optionB: "$0.01\\text{ M Urea} (i \\times m = 0.01)$",
    optionC: "$0.01\\text{ M } \\text{KNO}_3 (i \\times m = 0.02)$",
    optionD: "$0.01\\text{ M } \\text{Na}_2\\text{SO}_4 (i \\times m = 3 \\times 0.01 = 0.03)$",
    correctOption: "D",
    explanation: "$\\text{Na}_2\\text{SO}_4$ dissociates into 3 ions ($i=3$), giving highest colligative effective molality $i \\times m = 0.03\\text{ M}$."
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: Benzenediazonium salt prepared at $273-278\\text{ K}$ decomposes easily when dry.\nStatement II: Iodobenzene is synthesized by reacting diazonium salt with aqueous $\\text{KI}$.",
    optionA: "Statement I incorrect, II correct",
    optionB: "Both Statement I and Statement II are TRUE",
    optionC: "Both incorrect",
    optionD: "Statement I correct, II incorrect",
    correctOption: "B",
    explanation: "Diazonium salts explode when dry; direct iodination of benzene is reversible so $\\text{ArN}_2^+ + \\text{KI} \\to \\text{ArI} + \\text{N}_2$ is preferred."
  },
  {
    subject: "Chemistry",
    questionText: "Suitable reagent for converting ester $\\text{Ph-CO-OCH}_3$ into aldehyde $\\text{Ph-CHO}$ is:",
    optionA: "$\\text{H}_2 / \\text{Pd-BaSO}_4$",
    optionB: "$\\text{LiAlH}_4$",
    optionC: "(i) $\\text{DIBAL-H } [\\text{AlH(iBu)}_2]$, (ii) $\\text{H}_2\\text{O}$",
    optionD: "$\\text{NaBH}_4$",
    correctOption: "C",
    explanation: "Diisobutylaluminium hydride (DIBAL-H) at $-78^\\circ\\text{C}$ selectively reduces esters to aldehydes."
  },
  {
    subject: "Chemistry",
    questionText: "Assertion (A): 1-Iodopropane undergoes $S_N2$ faster than 1-chloropropane.\nReason (R): Iodide ion is a superior leaving group due to larger size and stable charge dispersion.",
    optionA: "A false, R true",
    optionB: "Both A and R are TRUE and Reason is the correct explanation of Assertion",
    optionC: "Both true, not explanation",
    optionD: "A true, R false",
    correctOption: "B",
    explanation: "Weaker C-I bond and high polarizability of large $I^-$ make it an excellent leaving group in $S_N2$ displacements."
  },
  {
    subject: "Chemistry",
    questionText: "The correct decreasing order of acidity of carboxylic acids is:",
    optionA: "$\\text{HCOOH} > (\\text{CH}_3)_3\\text{CCOOH} > (\\text{CH}_3)_2\\text{CHCOOH} > \\text{CH}_3\\text{COOH}$",
    optionB: "$(\\text{CH}_3)_3\\text{CCOOH} > (\\text{CH}_3)_2\\text{CHCOOH} > \\text{CH}_3\\text{COOH} > \\text{HCOOH}$",
    optionC: "$\\text{CH}_3\\text{COOH} > (\\text{CH}_3)_2\\text{CHCOOH} > (\\text{CH}_3)_3\\text{CCOOH} > \\text{HCOOH}$",
    optionD: "$\\text{HCOOH} > \\text{CH}_3\\text{COOH} > (\\text{CH}_3)_2\\text{CHCOOH} > (\\text{CH}_3)_3\\text{CCOOH}$",
    correctOption: "D",
    explanation: "Inductive $+I$ electron-donating alkyl groups destabilize carboxylate anion, reducing acid strength."
  },
  {
    subject: "Chemistry",
    questionText: "Which reaction does NOT belong to Lassaigne's elemental sodium fusion test?",
    optionA: "$2\\text{CuO} + \\text{C} \\xrightarrow{\\Delta} 2\\text{Cu} + \\text{CO}_2$ (Copper oxide test for carbon/hydrogen)",
    optionB: "$\\text{Na} + \\text{C} + \\text{N} \\to \\text{NaCN}$",
    optionC: "$2\\text{Na} + \\text{S} \\to \\text{Na}_2\\text{S}$",
    optionD: "$\\text{Na} + \\text{X} \\to \\text{NaX}$",
    correctOption: "A",
    explanation: "Copper oxide combustion tests for carbon and hydrogen; Lassaigne's test detects N, S, P, and halogens via sodium fusion."
  },
  {
    subject: "Chemistry",
    questionText: "Total number of possible monochlorinated isomers (including stereoisomers) of 2-methylbutane is:",
    optionA: "6 (Four structural, two yielding enantiomers $\\implies$ total 6)",
    optionB: "2",
    optionC: "3",
    optionD: "5",
    correctOption: "A",
    explanation: "1-chloro-2-methylbutane ($2\\text{ isomers, chiral}$), 2-chloro-2-methylbutane ($1$), 2-chloro-3-methylbutane ($2\\text{ isomers, chiral}$), 1-chloro-3-methylbutane ($1$) $\\implies$ Total 6 isomers."
  },
  {
    subject: "Chemistry",
    questionText: "Sugar 'X' is found in honey, is a keto-sugar, exists in $\\alpha/\\beta$ furanose anomeric forms, and is laevorotatory ($-92.4^\\circ$). Sugar X is:",
    optionA: "Sucrose",
    optionB: "D-Glucose",
    optionC: "D-Fructose",
    optionD: "Maltose",
    correctOption: "C",
    explanation: "D-Fructose is a ketohexose that is strongly laevorotatory, hence named laevulose."
  },
  {
    subject: "Chemistry",
    questionText: "Dalton's Atomic Theory failed to explain:",
    optionA: "Gay-Lussac's Law of Gaseous Volumes",
    optionB: "Law of conservation of mass",
    optionC: "Law of constant proportion",
    optionD: "Law of multiple proportion",
    correctOption: "A",
    explanation: "Dalton's theory did not differentiate between atoms and molecules, failing to account for Gay-Lussac's combining volumes of gases."
  },
  {
    subject: "Chemistry",
    questionText: "Higher yield of $\\text{NO}$ in endothermic $N_2(g) + O_2(g) \\rightleftharpoons 2\\text{NO}(g)$ ($\\Delta H = +180.7\\text{ kJ/mol}$) is favoured by:",
    optionA: "Higher temperature, higher $[N_2]$, higher $[O_2]$ (A, C, D only)",
    optionB: "A, D only",
    optionC: "B, C only",
    optionD: "B, C, D only",
    correctOption: "A",
    explanation: "By Le Chatelier's principle, elevating temperature shifts endothermic reaction forward; increasing reactant concentrations pushes yield."
  },
  {
    subject: "Chemistry",
    questionText: "Match Xenon Compounds with Hybridisation and Shapes:\nA. $\\text{XeO}_3$, B. $\\text{XeF}_2$, C. $\\text{XeOF}_4$, D. $\\text{XeF}_6$\nI. $sp^3d$, linear; II. $sp^3$, pyramidal; III. $sp^3d^3$, distorted octahedral; IV. $sp^3d^2$, square pyramidal",
    optionA: "A-IV, B-II, C-I, D-III",
    optionB: "A-II, B-I, C-IV, D-III",
    optionC: "A-II, B-I, C-III, D-IV",
    optionD: "A-IV, B-II, C-III, D-I",
    correctOption: "B",
    explanation: "$\\text{XeO}_3 = sp^3\\text{ pyramidal (II)}$, $\\text{XeF}_2 = sp^3d\\text{ linear (I)}$, $\\text{XeOF}_4 = sp^3d^2\\text{ square pyramidal (IV)}$, $\\text{XeF}_6 = sp^3d^3\\text{ distorted octahedral (III)}$."
  },
  {
    subject: "Chemistry",
    questionText: "Match Solutions with Types:\nA. Humidity, B. Alloys (Brass), C. Amalgams (Sodium amalgam), D. Smoke\nI. Solid in solid, II. Liquid in gas, III. Solid in gas, IV. Liquid in solid",
    optionA: "A-III, B-II, C-I, D-IV",
    optionB: "A-II, B-IV, C-I, D-III",
    optionC: "A-II, B-I, C-IV, D-III",
    optionD: "A-III, B-I, C-IV, D-II",
    correctOption: "C",
    explanation: "Humidity = Liquid in gas (II), Alloys = Solid in solid (I), Amalgam = Liquid in solid (IV), Smoke = Solid in gas (III)."
  },
  {
    subject: "Chemistry",
    questionText: "First Bohr orbit energy and radius for $\\text{He}^+ (Z=2)$ and $\\text{Li}^{2+} (Z=3)$ are ($R_H = 2.18 \\times 10^{-18}\\text{ J}, a_0 = 52.9\\text{ pm}$):",
    optionA: "$E(\\text{Li}^{2+}) = -8.72 \\times 10^{-16}\\text{ J}$",
    optionB: "$E(\\text{Li}^{2+}) = -19.62 \\times 10^{-18}\\text{ J}, r(\\text{Li}^{2+}) = 17.6\\text{ pm}; E(\\text{He}^+) = -8.72 \\times 10^{-18}\\text{ J}, r(\\text{He}^+) = 26.4\\text{ pm}$",
    optionC: "$E(\\text{Li}^{2+}) = -8.72 \\times 10^{-18}\\text{ J}$",
    optionD: "$E(\\text{Li}^{2+}) = -19.62 \\times 10^{-16}\\text{ J}$",
    correctOption: "B",
    explanation: "$E_1 = -2.18 \\times 10^{-18} Z^2 \\implies \\text{He}^+: -8.72 \\times 10^{-18}\\text{ J}, \\text{Li}^{2+}: -19.62 \\times 10^{-18}\\text{ J}$. Radii $= 52.9/Z \\implies 26.45\\text{ pm, } 17.63\\text{ pm}$."
  },
  {
    subject: "Chemistry",
    questionText: "Which electronic configurations belong to MAIN GROUP (s-block and p-block) elements?\nA. $[\\text{Ne}]3s^1$, B. $[\\text{Ar}]3d^3 4s^2$, C. $[\\text{Kr}]4d^{10} 5s^2 5p^5$, D. $[\\text{Ar}]3d^{10} 4s^1$, E. $[\\text{Rn}]5f^0 6d^2 7s^2$",
    optionA: "A, C and D only",
    optionB: "B and E only",
    optionC: "A and C only (Na in s-block and I in p-block)",
    optionD: "D and E only",
    correctOption: "C",
    explanation: "Main group elements comprise s-block ($[\\text{Ne}]3s^1$) and p-block ($[\\text{Kr}]4d^{10} 5s^2 5p^5$)."
  },
  {
    subject: "Chemistry",
    questionText: "For exothermic methane formation $\\text{C}(s) + 2\\text{H}_2(g) \\to \\text{CH}_4(g)$ ($\\Delta H = -74.8\\text{ kJ/mol}$), the reaction progress profile shows:",
    optionA: "Products higher than reactants",
    optionB: "Products energy level lower than reactants by $74.8\\text{ kJ/mol}$",
    optionC: "Symmetric hill",
    optionD: "Zero activation barrier",
    correctOption: "B",
    explanation: "Exothermic reactions release heat, with product enthalpy $H_P$ lying below reactant enthalpy $H_R$ by $-\\Delta H$."
  },
  {
    subject: "Chemistry",
    questionText: "1-Methylcyclopentene $\\xrightarrow{\\text{HBr, peroxide}} \\text{Bromide} \\xrightarrow{\\text{KCN}} \\text{Nitrile} \\xrightarrow{\\text{Na(Hg)/EtOH}} P$. Major product P is:",
    optionA: "1-Methylcyclopentyl isocyanide",
    optionB: "(2-Methylcyclopentyl)methanamine ($\\text{C}_5\\text{H}_8(\\text{CH}_3)-\\text{CH}_2\\text{NH}_2$)",
    optionC: "Cyclohexylamine",
    optionD: "Cyclopentyl ethanamine",
    correctOption: "B",
    explanation: "Anti-Markovnikov addition gives 2-bromo-1-methylcyclopentane, cyanide substitution gives nitrile, which reduces to primary amine."
  },
  {
    subject: "Chemistry",
    questionText: "Identify correct statements against properties:\nA. $\\text{H}_2\\text{O} (1.85\\text{ D}) > \\text{NH}_3 (1.47\\text{ D}) > \\text{CHCl}_3 (1.04\\text{ D})$ - dipole moment\nB. $\\text{XeF}_4 > \\text{XeO}_3 > \\text{XeF}_2$ - lone pairs\nC. $O-H > C-H > N-O$ - bond length\nD. $\\text{N}_2 (\\text{BO=3}) > \\text{O}_2 (\\text{BO=2}) > \\text{H}_2 (\\text{BO=1})$ - bond enthalpy",
    optionA: "B, C only",
    optionB: "A, D only",
    optionC: "B, D only",
    optionD: "A, C only",
    correctOption: "B",
    explanation: "Statements A (dipole moments) and D (triple bond $\\text{N}_2$ has highest bond enthalpy) are correct."
  },
  {
    subject: "Chemistry",
    questionText: "Total number of possible isomers (structural and stereoisomers) of cyclic ethers of molecular formula $\\text{C}_4\\text{H}_8\\text{O}$ is:",
    optionA: "11",
    optionB: "6",
    optionC: "8",
    optionD: "10",
    correctOption: "D",
    explanation: "Oxetane derivatives ($2$), oxolane/THF ($1$), 2-methyloxetane ($2$), 3-methyloxetane ($1$), 2,2-dimethyloxirane ($1$), 2,3-dimethyloxirane (cis-meso + trans pair = $3$) $\\implies$ Total 10 isomers."
  },
  {
    subject: "Chemistry",
    questionText: "For $A(g) \\rightleftharpoons 2B(g)$, $k_b / k_f = 2500$ at $1000\\text{ K}$. $K_p$ for the reaction is ($R = 0.0831\\text{ L atm/K mol}$):",
    optionA: "0.021",
    optionB: "83.1",
    optionC: "$2.077 \\times 10^5$",
    optionD: "0.033",
    correctOption: "D",
    explanation: "$K_c = k_f / k_b = 1/2500$. $K_p = K_c (R T)^{\\Delta n_g} = \\frac{1}{2500} \\times 0.0831 \\times 1000 = \\frac{83.1}{2500} = 0.03324$."
  },
  {
    subject: "Chemistry",
    questionText: "Solution of $5\\text{ mol X } (P_X^\\circ = 63\\text{ torr})$ and $10\\text{ mol Y } (P_Y^\\circ = 78\\text{ torr})$ has observed $P_{\\text{total}} = 70\\text{ torr}$. The solution shows:",
    optionA: "Volume expansion",
    optionB: "Positive deviation",
    optionC: "Negative deviation from Raoult's law ($P_{\\text{obs}} < P_{\\text{calc}} = 73\\text{ torr}$)",
    optionD: "Ideal solution",
    correctOption: "C",
    explanation: "$P_{\\text{calc}} = \\frac{5}{15}(63) + \\frac{10}{15}(78) = 21 + 52 = 73\\text{ torr}$. Since $P_{\\text{obs}} (70\\text{ torr}) < P_{\\text{calc}}$, solution exhibits negative deviation."
  },

  // -------------------------------------------------------------
  // BIOLOGY (Q91 - Q180)
  // -------------------------------------------------------------
  {
    subject: "Biology",
    questionText: "Which of the following is the standard ecological unit of Productivity of an ecosystem?",
    optionA: "$(\\text{kcal m}^{-2})\\text{yr}^{-1}$ or $\\text{g m}^{-2}\\text{yr}^{-1}$",
    optionB: "$\\text{g m}^{-2}$",
    optionC: "$\\text{kcal m}^{-2}$",
    optionD: "$\\text{kcal m}^{-3}$",
    correctOption: "A",
    explanation: "Productivity is biomass/energy fixed per unit area per unit time: $(\\text{kcal m}^{-2})\\text{yr}^{-1}$."
  },
  {
    subject: "Biology",
    questionText: "The first onset of menstruation at puberty in human females is termed:",
    optionA: "Ovulation",
    optionB: "Menopause",
    optionC: "Menarche",
    optionD: "Diapause",
    correctOption: "C",
    explanation: "Menarche marks the initiation of reproductive cycles in adolescent females."
  },
  {
    subject: "Biology",
    questionText: "Assertion (A): All vertebrates are chordates but all chordates are not vertebrates.\nReason (R): In vertebrates, embryonic notochord is replaced by cartilaginous or bony vertebral column in adults.",
    optionA: "A false, R true",
    optionB: "Both (A) and (R) are TRUE and (R) is the correct explanation of (A)",
    optionC: "Both true, not explanation",
    optionD: "A true, R false",
    correctOption: "B",
    explanation: "Protochordates retain primitive notochord without forming a vertebral column, while vertebrates replace it with vertebrae."
  },
  {
    subject: "Biology",
    questionText: "In a Mendelian dihybrid cross ($RRYY \\times rryy$), the phenotypic ratio observed in the $F_2$ generation is:",
    optionA: "9 : 7",
    optionB: "1 : 2 : 1",
    optionC: "3 : 1",
    optionD: "9 : 3 : 3 : 1 (Round-Yellow : Round-Green : Wrinkled-Yellow : Wrinkled-Green)",
    correctOption: "D",
    explanation: "Independent assortment of two gene pairs produces classic $9:3:3:1$ dihybrid phenotypic ratio."
  },
  {
    subject: "Biology",
    questionText: "Statement I: DNA fragments extracted from agarose gel can be cloned into recombinant vectors.\nStatement II: Smaller DNA fragments migrate farther towards the anode while larger fragments remain near the wells.",
    optionA: "Statement I incorrect, II correct",
    optionB: "Both Statement I and Statement II are TRUE",
    optionC: "Both incorrect",
    optionD: "Statement I correct, II incorrect",
    correctOption: "B",
    explanation: "Gel elution recovers purified DNA fragments; smaller negatively charged DNA fragments move faster towards positive anode."
  },
  {
    subject: "Biology",
    questionText: "What is the primary mechanical function of mitotic spindle fibres during cell division?",
    optionA: "Regulate cell growth",
    optionB: "Separate and segregate sister chromatid chromosomes to opposite poles",
    optionC: "Synthesize new DNA",
    optionD: "Repair DNA",
    correctOption: "B",
    explanation: "Spindle fibres pull sister chromatids apart during anaphase toward opposite spindle poles."
  },
  {
    subject: "Biology",
    questionText: "How many meiotic and mitotic divisions occur to produce a mature 7-celled embryo sac from Megaspore Mother Cell (MMC)?",
    optionA: "No meiosis and 2 mitosis",
    optionB: "2 meiosis and 3 mitosis",
    optionC: "1 meiosis and 2 mitosis",
    optionD: "1 Meiosis (produces functional megaspore) and 3 Mitotic nuclear divisions",
    correctOption: "D",
    explanation: "MMC undergoes 1 meiosis to form functional megaspore, which undergoes 3 rounds of free-nuclear mitosis to form 8-nucleate embryo sac."
  },
  {
    subject: "Biology",
    questionText: "Identify the INCORRECT statement regarding Antibody structure:",
    optionA: "Constant regions of heavy/light chains located at C-terminus",
    optionB: "Composed of two light and two heavy chains ($H_2L_2$)",
    optionC: "Chains joined by interchain disulphide bonds",
    optionD: "Antigen binding site (Fab) is located at C-terminal region (Located at variable N-terminal region)",
    correctOption: "D",
    explanation: "The antigen-binding paratope is formed by hypervariable domains at the N-terminus of light and heavy chains."
  },
  {
    subject: "Biology",
    questionText: "Select correct gametogenesis statements:\nA. Female meiosis begins during embryonic fetal stage\nB. Gap between meiosis I and II is shorter in males\nC. First polar body forms during primary oocyte\nD. LH surge disintegrates endometrium",
    optionA: "B and C are true",
    optionB: "A and B are TRUE",
    optionC: "A and C are true",
    optionD: "B and D are true",
    correctOption: "B",
    explanation: "Oogenesis initiates in fetal ovary (A); spermatogenesis proceeds continuously in puberty without long dictyotene arrests (B)."
  },
  {
    subject: "Biology",
    questionText: "Assertion (A): Tapetal cells possess dense cytoplasm and are multinucleate.\nReason (R): Multinucleate state increases metabolic efficiency for nourishing developing microspores.",
    optionA: "A false, R true",
    optionB: "Both A and R true, R correct explanation",
    optionC: "Both true, not explanation",
    optionD: "A is true but Reason (R) is false / not full explanation",
    correctOption: "D",
    explanation: "Tapetum is multinucleate due to endomitosis, nourishing microspores (Official key: 4)."
  },
  {
    subject: "Biology",
    questionText: "In Blue-White screening of recombinant plasmids:\nStatement I: Blue colonies contain foreign DNA insert.\nStatement II: White colonies contain DNA insert due to insertional inactivation of $\\beta$-galactosidase gene.",
    optionA: "Statement I is INCORRECT but Statement II is CORRECT",
    optionB: "Both correct",
    optionC: "Both incorrect",
    optionD: "Statement I correct, II incorrect",
    correctOption: "A",
    explanation: "Insertional inactivation of lacZ prevents X-gal cleavage, producing white recombinant colonies."
  },
  {
    subject: "Biology",
    questionText: "In liverwort Bryophytes (Marchantia), green multicellular Gemmae function in:",
    optionA: "Gaseous exchange",
    optionB: "Sexual reproduction",
    optionC: "Asexual vegetative reproduction",
    optionD: "Nutrient absorption",
    correctOption: "C",
    explanation: "Gemmae are specialized asexual vegetative reproductive buds borne in gemma cups."
  },
  {
    subject: "Biology",
    questionText: "Match Biomolecules with Classifications:\nA. Adenosine, B. Adenylic acid, C. Adenine, D. Alanine\nI. Nitrogenous purine base, II. Nucleotide, III. Ribonucleoside, IV. Amino acid",
    optionA: "A-II, B-III, C-I, D-IV",
    optionB: "A-III, B-IV, C-II, D-I",
    optionC: "A-III, B-II, C-IV, D-I",
    optionD: "A-III, B-II, C-I, D-IV",
    correctOption: "D",
    explanation: "Adenosine = Nucleoside (III), Adenylic acid = Nucleotide (II), Adenine = Nitrogen base (I), Alanine = Amino acid (IV)."
  },
  {
    subject: "Biology",
    questionText: "In pedigree cross between carrier female ($X^c X$) and affected male ($X^c Y$), probability of unaffected carrier child is:",
    optionA: "Zero",
    optionB: "$1/4$ ($25\\%$ carrier female $X^c X$)",
    optionC: "$1/2$",
    optionD: "$1/8$",
    correctOption: "B",
    explanation: "Offspring: $1\\,X^c X^c\\text{ (affected female)}, 1\\,X^c X\\text{ (carrier female)}, 1\\,X^c Y\\text{ (affected male)}, 1\\,XY\\text{ (normal male)} \\implies 1/4$ carrier."
  },
  {
    subject: "Biology",
    questionText: "Which statements are TRUE for Adrenal Medullary hormones (Epinephrine & Norepinephrine)?\nA. Pupillary constriction (Causes dilation)\nB. Hyperglycemic hormone\nC. Piloerection\nD. Increases heart contraction strength",
    optionA: "D only",
    optionB: "C and D only",
    optionC: "B, C and D only",
    optionD: "A, C and D only",
    correctOption: "C",
    explanation: "Emergency hormones stimulate glycogenolysis (hyperglycemia), piloerection (goosebumps), tachycardia, and pupillary dilation."
  },
  {
    subject: "Biology",
    questionText: "Which of the following plants produces bilaterally symmetrical ZYGOMORPHIC flowers?",
    optionA: "Chilli (Actinomorphic)",
    optionB: "Petunia (Actinomorphic)",
    optionC: "Datura (Actinomorphic)",
    optionD: "Pea (Pisum sativum / Zygomorphic)",
    correctOption: "D",
    explanation: "Pea, Gulmohar, Bean, and Cassia possess zygomorphic flowers displaying bilateral symmetry."
  },
  {
    subject: "Biology",
    questionText: "Who originally postulated that the genetic code must be a TRIPLET of three nitrogenous bases to code 20 amino acids?",
    optionA: "Franklin Stahl",
    optionB: "George Gamow (Physicist who proposed 3-letter triplet codon)",
    optionC: "Francis Crick",
    optionD: "Jacques Monod",
    correctOption: "B",
    explanation: "George Gamow mathematically argued that a triplet code ($4^3 = 64$ combinations) is required to code for 20 amino acids."
  },
  {
    subject: "Biology",
    questionText: "Statement I: In ecosystems, energy flows unidirectionally from sun to producers to consumers.\nStatement II: Ecosystems are exempted from second law of thermodynamics.",
    optionA: "Statement I incorrect, II correct",
    optionB: "Both true",
    optionC: "Both incorrect",
    optionD: "Statement I is CORRECT but Statement II is INCORRECT (Ecosystems obey 2nd law)",
    correctOption: "D",
    explanation: "Solar energy flows unidirectionally. Ecosystems strictly obey the 2nd law of thermodynamics, requiring continuous energy input to counteract entropy."
  },
  {
    subject: "Biology",
    questionText: "Sweet potato (root modification) and potato (stem modification) represent:",
    optionA: "Analogy, divergent",
    optionB: "Analogy and Convergent evolution (Similar function with different anatomical origin)",
    optionC: "Homology, divergent",
    optionD: "Homology, convergent",
    correctOption: "B",
    explanation: "Both store starch as underground reserves but originate from root vs stem, illustrating analogy through convergent evolution."
  },
  {
    subject: "Biology",
    questionText: "All living members of the jawless vertebrate Class Cyclostomata (Lampreys, Hagfishes) are:",
    optionA: "Ectoparasites on fishes",
    optionB: "Free living",
    optionC: "Endoparasites",
    optionD: "Symbiotic",
    correctOption: "A",
    explanation: "Cyclostomes have suctorial circular jawless mouths with rasping teeth used as ectoparasites on marine fishes."
  },
  {
    subject: "Biology",
    questionText: "Basic histone proteins in eukaryotic nucleosome octamers are rich in positively charged amino acids:",
    optionA: "Phenylalanine & Arginine",
    optionB: "Lysine & Arginine",
    optionC: "Leucine & Lysine",
    optionD: "Phenylalanine & Leucine",
    correctOption: "B",
    explanation: "Histones are enriched in basic amino acids Lysine and Arginine carrying positive charges that bind negative DNA backbones."
  },
  {
    subject: "Biology",
    questionText: "Which differential equation correctly represents Verhulst-Pearl Logistic Growth of a population?",
    optionA: "$\\frac{dN}{dt} = N\\left(\\frac{r-K}{K}\\right)$",
    optionB: "$\\frac{dN}{dt} = r\\left(\\frac{K-N}{K}\\right)$",
    optionC: "$\\frac{dN}{dt} = r N \\left(\\frac{K-N}{K}\\right)$",
    optionD: "$\\frac{dN}{dt} = r N \\left(\\frac{N-K}{N}\\right)$",
    correctOption: "C",
    explanation: "Standard logistic growth equation is $\\frac{dN}{dt} = r N \\left(\\frac{K-N}{K}\\right)$."
  },
  {
    subject: "Biology",
    questionText: "Assertion (A): Golgi apparatus packages ER materials and targets them inside/outside cell.\nReason (R): Transport vesicles from ER fuse with cis face of Golgi and exit from trans face.",
    optionA: "A false, R true",
    optionB: "Both true, R correct explanation",
    optionC: "Both Assertion and Reason are TRUE but Reason is not the complete explanation of Assertion",
    optionD: "A true, R false",
    correctOption: "C",
    explanation: "Both statements are correct cytological facts (vesicular cis-to-trans transit and packaging)."
  },
  {
    subject: "Biology",
    questionText: "Which statement regarding photosynthetic enzyme RuBisCO is TRUE?",
    optionA: "It catalyzes the primary carboxylation of RuBP in Calvin cycle",
    optionB: "Active only in dark",
    optionC: "Higher affinity for oxygen",
    optionD: "Involved in water photolysis",
    correctOption: "A",
    explanation: "RuBisCO fixes $\\text{CO}_2$ onto Ribulose-1,5-bisphosphate forming 3-phosphoglycerate (3-PGA)."
  },
  {
    subject: "Biology",
    questionText: "Match Hormones with Secretory Tissues:\nA. Progesterone, B. Relaxin, C. MSH, D. Catecholamines\nI. Pars intermedia, II. Ovary, III. Adrenal medulla, IV. Corpus luteum",
    optionA: "A-III, B-II, C-IV, D-I",
    optionB: "A-IV, B-II, C-I, D-III",
    optionC: "A-IV, B-II, C-III, D-I",
    optionD: "A-II, B-IV, C-I, D-III",
    correctOption: "B",
    explanation: "Progesterone = Corpus luteum (IV), Relaxin = Ovary (II), MSH = Pars intermedia (I), Catecholamines = Adrenal medulla (III)."
  },
  {
    subject: "Biology",
    questionText: "The non-protein enzyme component is cofactor; the protein portion of a conjugated enzyme is termed:",
    optionA: "Prosthetic group",
    optionB: "Cofactor",
    optionC: "Coenzyme",
    optionD: "Apoenzyme",
    correctOption: "D",
    explanation: "Apoenzyme is the inactive protein part of an enzyme that requires a cofactor/coenzyme to become an active holoenzyme."
  },
  {
    subject: "Biology",
    questionText: "Which enzymes are NOT essential in standard recombinant gene cloning?\nA. Restriction enzymes, B. DNA ligase, C. DNA mutase, D. DNA recombinase, E. DNA polymerase",
    optionA: "B and C only",
    optionB: "C and D only (DNA mutase and recombinase)",
    optionC: "A and B only",
    optionD: "D and E only",
    correctOption: "B",
    explanation: "Core recombinant cloning enzymes are restriction endonucleases, DNA ligase, and DNA polymerase; mutase/recombinase are not required."
  },
  {
    subject: "Biology",
    questionText: "Non-specific innate defense present from birth conferring broad barrier protection is:",
    optionA: "Humoral Immunity",
    optionB: "Acquired Immunity",
    optionC: "Innate Immunity (Physical, physiological, cellular, and cytokine barriers)",
    optionD: "Cell-mediated Immunity",
    correctOption: "C",
    explanation: "Innate immunity provides inborn, non-specific barrier defenses against general pathogen entry."
  },
  {
    subject: "Biology",
    questionText: "In bacterial transcription, termination of RNA synthesis requires transient binding of:",
    optionA: "$\\gamma$ (gamma)",
    optionB: "$\\alpha$ (alpha)",
    optionC: "$\\sigma$ (sigma / Initiation)",
    optionD: "$\\rho$ (Rho termination factor)",
    correctOption: "D",
    explanation: "Sigma ($\\sigma$) factor initiates transcription; Rho ($\\rho$) factor terminates elongation."
  },
  {
    subject: "Biology",
    questionText: "Which hormone released from posterior pituitary is actually synthesized in the hypothalamus?",
    optionA: "ACTH",
    optionB: "LH",
    optionC: "Anti-Diuretic Hormone (ADH / Vasopressin)",
    optionD: "FSH",
    correctOption: "C",
    explanation: "Hypothalamic supraoptic and paraventricular nuclei synthesize ADH and oxytocin, transported axonally to neurohypophysis."
  },
  {
    subject: "Biology",
    questionText: "Which microbes are NOT typically used in the preparation of household food products?\nA. Aspergillus niger, B. Lactobacillus, C. Trichoderma polysporum, D. Saccharomyces, E. Propionibacterium",
    optionA: "C and E only",
    optionB: "A and B only",
    optionC: "A and C only (Aspergillus produces industrial citric acid; Trichoderma produces cyclosporin A)",
    optionD: "C and D only",
    correctOption: "C",
    explanation: "Lactobacillus (curd), Saccharomyces (toddy/bread), and Propionibacterium (Swiss cheese) are household microbes; Aspergillus and Trichoderma are industrial."
  },
  {
    subject: "Biology",
    questionText: "Statement I: Fig fruit is non-vegetarian as it has enclosed wasps.\nStatement II: Fig wasp and fig tree exhibit mutualism as wasp completes life cycle in fig inflorescence and pollinates it.",
    optionA: "Statement I incorrect, II correct",
    optionB: "Both correct",
    optionC: "Both Statement I and Statement II are INCORRECT / FALSE",
    optionD: "Statement I correct, II incorrect",
    correctOption: "C",
    explanation: "Fig is a botanical syconus fruit; wasp pollinates hypanthodium inflorescence (Official key: 3)."
  },
  {
    subject: "Biology",
    questionText: "Key physiological functions of the Water Vascular (Ambulacral) System in Echinoderms are:\nA. Respiration and Locomotion\nB. Excretion\nC. Capture and transport of food",
    optionA: "B, D and E only",
    optionB: "A and B only",
    optionC: "A and C only (Locomotion, food capture/transport, and respiration)",
    optionD: "B and C only",
    correctOption: "C",
    explanation: "Water vascular system with tube feet operates in locomotion, food capture, and gas exchange; excretory system is absent."
  },
  {
    subject: "Biology",
    questionText: "After differentiating in bone marrow and thymus, immunocompetent lymphocytes migrate to secondary lymphoid organs:\nA. Thymus, B. Bone marrow, C. Spleen, D. Lymph nodes, E. Peyer's patches",
    optionA: "C, D, E only (Spleen, Lymph nodes, Peyer's patches)",
    optionB: "B, C, D only",
    optionC: "A, B, C only",
    optionD: "E, A, B only",
    correctOption: "A",
    explanation: "Thymus and bone marrow are primary lymphoid organs; spleen, lymph nodes, and Peyer's patches are secondary lymphoid tissues."
  },
  {
    subject: "Biology",
    questionText: "Match Biodiversity Concepts:\nA. The Evil Quartet, B. Ex-situ conservation, C. Lantana camara, D. Dodo\nI. Cryopreservation, II. Invasive alien species, III. Major causes of biodiversity loss, IV. Extinct species",
    optionA: "A-III, B-II, C-IV, D-I",
    optionB: "A-III, B-II, C-I, D-IV",
    optionC: "A-III, B-I, C-II, D-IV",
    optionD: "A-III, B-IV, C-II, D-I",
    correctOption: "C",
    explanation: "Evil Quartet = Biodiversity loss causes (III), Ex-situ = Cryopreservation (I), Lantana = Alien species (II), Dodo = Extinction (IV)."
  },
  {
    subject: "Biology",
    questionText: "Select the correct plant growth statements:\nA. Auxins induce parthenocarpy in tomatoes\nB. Plant growth regulators promote or inhibit growth\nC. Dedifferentiation is prerequisite for redifferentiation\nD. ABA is growth promoter (Inhibitor)\nE. Apical dominance promotes lateral buds (Inhibits lateral buds)",
    optionA: "B, D, E only",
    optionB: "A, B, C only",
    optionC: "A, C, E only",
    optionD: "A, D, E only",
    correctOption: "B",
    explanation: "Statements A, B, C are true. ABA is a growth inhibitor (D false); apical dominance suppresses lateral buds (E false)."
  },
  {
    subject: "Biology",
    questionText: "Match Plant Groups with Genera:\nA. Pteridophyte, B. Bryophyte, C. Angiosperm, D. Gymnosperm\nI. Salvia, II. Ginkgo, III. Polytrichum, IV. Salvinia",
    optionA: "A-IV, B-III, C-II, D-I",
    optionB: "A-III, B-IV, C-II, D-I",
    optionC: "A-IV, B-III, C-I, D-II",
    optionD: "A-III, B-IV, C-I, D-II",
    correctOption: "C",
    explanation: "Pteridophyte = Salvinia (IV), Bryophyte = Polytrichum (III), Angiosperm = Salvia (I), Gymnosperm = Ginkgo biloba (II)."
  },
  {
    subject: "Biology",
    questionText: "Why can Insulin NOT be administered orally to diabetic patients?",
    optionA: "Bioavailability increases",
    optionB: "Immune destruction",
    optionC: "As a polypeptide protein, it is enzymatically digested and degraded by proteases in the GI tract",
    optionD: "Structural variation",
    correctOption: "C",
    explanation: "Gastric pepsin and pancreatic proteases hydrolyze peptide bonds of insulin in the digestive tract, rendering it inactive."
  },
  {
    subject: "Biology",
    questionText: "The defining morphological characteristic feature of Gymnosperms is:",
    optionA: "Flowers for reproduction",
    optionB: "Seeds enclosed in fruits",
    optionC: "Seeds are NAKED (Ovules not enclosed within ovary wall)",
    optionD: "Seeds absent",
    correctOption: "C",
    explanation: "Gymnosperms lack an ovary wall, leaving ovules and developing seeds naked and exposed."
  },
  {
    subject: "Biology",
    questionText: "Respiratory organs in frogs during aquatic and terrestrial phases:\nStatement: In water by skin & buccal cavity, on land by skin, buccal cavity & lungs.",
    optionA: "False for both",
    optionB: "True for water, false land",
    optionC: "True for both",
    optionD: "The statement is FALSE for water (Cutaneous only) but TRUE for land",
    correctOption: "D",
    explanation: "In water, frogs respire exclusively through moist skin (cutaneous); on land, they use buccopharyngeal, cutaneous, and pulmonary respiration."
  },
  {
    subject: "Biology",
    questionText: "Post-transcriptional gene silencing via RNA Interference (RNAi) operates by:",
    optionA: "Non-complementary ssRNA",
    optionB: "Complementary double-stranded RNA (dsRNA) triggering RISC mRNA degradation",
    optionC: "Inhibitory ssRNA",
    optionD: "Complementary tRNA",
    correctOption: "B",
    explanation: "Dicer cuts dsRNA into siRNAs that guide RISC complex to cleave and silence target complementary mRNA."
  },
  {
    subject: "Biology",
    questionText: "Twins born to a family consist of one boy and one girl. Which statement MUST be true?",
    optionA: "75% identical genes",
    optionB: "Monozygotic twins",
    optionC: "They are Dizygotic / Fraternal twins derived from two separate fertilized ova",
    optionD: "Conceived via IVF",
    correctOption: "C",
    explanation: "Opposite-sex twins are always fraternal (dizygotic), resulting from two distinct eggs fertilized by separate sperms."
  },
  {
    subject: "Biology",
    questionText: "Match Seed Parts with Botanical Definitions:\nA. Scutellum, B. Non-albuminous seed, C. Epiblast, D. Perisperm\nI. Persistent nucellus (Black pepper), II. Monocot cotyledon, III. Groundnut / Pea, IV. Rudimentary 2nd cotyledon",
    optionA: "A-II, B-IV, C-III, D-I",
    optionB: "A-II, B-III, C-IV, D-I",
    optionC: "A-IV, B-III, C-II, D-I",
    optionD: "A-IV, B-III, C-I, D-II",
    correctOption: "B",
    explanation: "Scutellum = Monocot cotyledon (II), Non-albuminous = Groundnut (III), Epiblast = Rudimentary cotyledon (IV), Perisperm = Nucellus (I)."
  },
  {
    subject: "Biology",
    questionText: "In frogs, the Renal Portal System is a specialized venous network connecting:",
    optionA: "Kidneys and lower parts of body (Hind limbs)",
    optionB: "Liver and intestine",
    optionC: "Liver and kidney",
    optionD: "Kidney and intestine",
    correctOption: "A",
    explanation: "Renal portal vein collects blood from hind limbs and carries it to the kidneys before returning to the heart."
  },
  {
    subject: "Biology",
    questionText: "Match Endocrine Glands with Hormones:\nA. Heart, B. Kidney, C. Gastro-intestinal tract, D. Adrenal Cortex\nI. Erythropoietin, II. Aldosterone, III. Atrial Natriuretic Factor (ANF), IV. Secretin",
    optionA: "A-III, B-I, C-IV, D-II",
    optionB: "A-II, B-I, C-III, D-IV",
    optionC: "A-IV, B-III, C-II, D-I",
    optionD: "A-I, B-III, C-IV, D-II",
    correctOption: "A",
    explanation: "Heart atrium = ANF (III), Kidney JG cells = Erythropoietin (I), GI tract = Secretin (IV), Adrenal cortex = Aldosterone (II)."
  },
  {
    subject: "Biology",
    questionText: "Intrinsic and extrinsic regulation of cardiac activity in human heart involves:\nA. Nodal myogenic tissue (SA/AV node)\nB. Medulla oblongata cardiac centre via ANS\nC. Adrenal medullary hormones (Epinephrine)\nD. Adrenal cortex",
    optionA: "A, B and D Only",
    optionB: "A, B and C Only (Nodal tissue, Medulla ANS, and Adrenal Medulla)",
    optionC: "A, B, C and D",
    optionD: "A, C and D Only",
    correctOption: "B",
    explanation: "Cardiac activity is auto-regulated by nodal tissue and moderated by medulla vasomotor centers and adrenaline."
  },
  {
    subject: "Biology",
    questionText: "Streptokinase enzyme produced by genetically modified Streptococcus bacterium is used therapeutically as a:",
    optionA: "Clot-buster to dissolve intravascular blood clots in myocardial infarction",
    optionB: "Curd production",
    optionC: "Ethanol fermentation",
    optionD: "Liver disease treatment",
    correctOption: "A",
    explanation: "Streptokinase is a clinical thrombolytic 'clot buster' used to clear coronary thrombi following heart attack."
  },
  {
    subject: "Biology",
    questionText: "Professor Ramdeo Misra is nationally celebrated as the:",
    optionA: "Birbal Sahni",
    optionB: "S.R. Kashyap",
    optionC: "Father of Ecology in India",
    optionD: "Ram Udar",
    correctOption: "C",
    explanation: "Ramdeo Misra established postgraduate ecology education and research at Banaras Hindu University."
  },
  {
    subject: "Biology",
    questionText: "Assertion (A): Mature unfertilised angiosperm embryo sac is 8-nucleate and 7-celled.\nReason (R): The egg apparatus contains 2 polar nuclei.",
    optionA: "A is false, R is true",
    optionB: "Both A and R true, R correct explanation",
    optionC: "Both true, not explanation",
    optionD: "Assertion (A) is TRUE but Reason (R) is FALSE (Polar nuclei are in central cell)",
    correctOption: "D",
    explanation: "Egg apparatus consists of 1 egg cell + 2 synergids at micropyle; the 2 polar nuclei reside in large central cell."
  },
  {
    subject: "Biology",
    questionText: "Neoplastic characteristics of malignant cancerous cells include:\nA. Uncontrolled proliferating cell mass\nB. Rapid cellular growth\nC. Infiltration, invasion and metastasis into surrounding normal tissues\nD. Confined to original site (Benign)",
    optionA: "B, C, D only",
    optionB: "A, B only",
    optionC: "A, B, C only",
    optionD: "A, B, D only",
    correctOption: "C",
    explanation: "Malignant neoplasms exhibit rapid proliferation, invasion of surrounding tissues, and metastasis (benign tumors remain confined)."
  },
  {
    subject: "Biology",
    questionText: "Arrange Pteridophyte life cycle events in chronological sequence:\nA. Prothallus stage, B. Meiosis in spore mother cells, C. Fertilisation, D. Gametophyte sex organs, E. Antherozoids in water",
    optionA: "E, D, C, B, A",
    optionB: "Meiosis (B) $\\to$ Prothallus (A) $\\to$ Archegonia/Antheridia (D) $\\to$ Water transfer (E) $\\to$ Fertilisation (C)",
    optionC: "B, A, E, C, D",
    optionD: "D, E, C, A, B",
    correctOption: "B",
    explanation: "Sporophyte spore mother cells undergo meiosis $\\to$ spores form prothallus $\\to$ sex organs develop $\\to$ flagellated antherozoids swim in water $\\to$ fertilisation."
  },
  {
    subject: "Biology",
    questionText: "Assertion (A): Wind and water pollinated flowers lack bright colours and nectar.\nReason (R): Wind and water pollinated flowers produce enormous quantities of lightweight pollen.",
    optionA: "A false, R true",
    optionB: "Both true, R correct explanation",
    optionC: "Both Assertion and Reason are TRUE but Reason is not the correct explanation of Assertion",
    optionD: "A true, R false",
    correctOption: "C",
    explanation: "Both statements are correct biological facts regarding abiotic pollination adaptations."
  },
  {
    subject: "Biology",
    questionText: "Which of the following enzymes contains 'Haem' (Iron porphyrin) as its prosthetic group?",
    optionA: "Catalase and Peroxidase",
    optionB: "RuBisCO",
    optionC: "Carbonic anhydrase (Zinc cofactor)",
    optionD: "Succinate dehydrogenase",
    correctOption: "A",
    explanation: "Catalase and peroxidase possess haem prosthetic group at catalytic active site for decomposing $\\text{H}_2\\text{O}_2$."
  },
  {
    subject: "Biology",
    questionText: "Match Clinical Pathologies:\nA. Emphysema, B. Angina Pectoris, C. Glomerulonephritis, D. Tetany\nI. Rapid muscle spasms in low $\\text{Ca}^{2+}$, II. Alveolar damage and reduced surface, III. Acute chest ischemia pain, IV. Kidney glomeruli inflammation",
    optionA: "A-II, B-III, C-IV, D-I",
    optionB: "A-III, B-I, C-IV, D-II",
    optionC: "A-III, B-I, C-II, D-IV",
    optionD: "A-II, B-IV, C-III, D-I",
    correctOption: "A",
    explanation: "Emphysema = Alveolar damage (II), Angina = Chest ischemia (III), Glomerulonephritis = Glomerular inflammation (IV), Tetany = Low calcium spasms (I)."
  },
  {
    subject: "Biology",
    questionText: "Which anatomical statement is INCORRECT regarding monocot stems (e.g. Grass, Maize)?",
    optionA: "Phloem parenchyma is absent",
    optionB: "Hypodermis is parenchymatous (Monocot hypodermis is sclerenchymatous)",
    optionC: "Vascular bundles are scattered throughout ground tissue",
    optionD: "Vascular bundles are conjoint and closed",
    correctOption: "B",
    explanation: "In monocot stems, hypodermis is composed of thick-walled sclerenchyma cells providing mechanical strength."
  },
  {
    subject: "Biology",
    questionText: "In male frogs (Rana tigrina), the specialized copulatory (nuptial) amplexus pad is located on:",
    optionA: "First digit of the forelimb",
    optionB: "First and second digits",
    optionC: "First digit of hindlimb",
    optionD: "Second digit of forelimb",
    correctOption: "A",
    explanation: "Male frogs develop copulatory nuptial pads on first digit of forelimbs during breeding season for gripping female."
  },
  {
    subject: "Biology",
    questionText: "Statement I: Primary energy source in ecosystem is solar radiation.\nStatement II: Total organic matter synthesized during photosynthesis is Net Primary Productivity (NPP).",
    optionA: "Statement I incorrect, II correct",
    optionB: "Both true",
    optionC: "Both incorrect",
    optionD: "Statement I is CORRECT but Statement II is INCORRECT (Total matter is Gross Primary Productivity / GPP)",
    correctOption: "D",
    explanation: "Statement I is true. Total organic matter synthesized is Gross Primary Productivity (GPP); $\\text{NPP} = \\text{GPP} - R$."
  },
  {
    subject: "Biology",
    questionText: "In a stirred-tank bioreactor, the designated overhead foam breaker assembly is:",
    optionA: "Part C (Foam breaker impeller blades)",
    optionB: "Part A (Flat bladed impeller)",
    optionC: "Part B (Motor)",
    optionD: "Part D (Sterile air sparger)",
    correctOption: "A",
    explanation: "Foam breaker blades (labeled C) near the top of the vessel disperse foam formed during vigorous aeration."
  },
  {
    subject: "Biology",
    questionText: "In PCR DNA amplification, the number of synthesized DNA duplex fragments after $n$ thermal cycles is given by:",
    optionA: "$2 N^2$",
    optionB: "$N^2$",
    optionC: "$2^n$ (Exponential geometric amplification)",
    optionD: "$2n + 1$",
    correctOption: "C",
    explanation: "Each thermal PCR cycle doubles target DNA quantity, producing $2^n$ copies after $n$ cycles."
  },
  {
    subject: "Biology",
    questionText: "Match Sperm Anatomy with Functions:\nA. Head, B. Middle piece, C. Acrosome, D. Tail\nI. Proteolytic enzymes (Hyaluronidase), II. Motility, III. Mitochondrial energy (ATP), IV. Genetic nucleus",
    optionA: "A-III, B-II, C-I, D-IV",
    optionB: "A-IV, B-III, C-I, D-II",
    optionC: "A-IV, B-III, C-II, D-I",
    optionD: "A-III, B-IV, C-II, D-I",
    correctOption: "B",
    explanation: "Head = Nucleus/DNA (IV), Middle piece = Mitochondria/ATP (III), Acrosome = Lytic enzymes (I), Tail = Flagellar propulsion (II)."
  },
  {
    subject: "Biology",
    questionText: "In floral diagrams: $\\oplus$ indicates actinomorphic symmetry and $\\underline{\\text{G}}$ indicates:",
    optionA: "Statement I incorrect but Statement II is correct ($\\oplus$ is actinomorphic, $\\underline{\\text{G}}$ is superior ovary)",
    optionB: "Both correct",
    optionC: "Both incorrect",
    optionD: "Statement I correct, II incorrect",
    correctOption: "A",
    explanation: "Symbol $\\oplus$ denotes actinomorphic (radial) flower; $\\underline{\\text{G}}$ indicates superior hypogynous ovary."
  },
  {
    subject: "Biology",
    questionText: "Select correct statements regarding Ribosomes:\nA. Eukaryotes 80S, prokaryotes 70S\nB. Each has 2 subunits\nC. 80S subunits are 60S and 40S; 70S subunits are 50S and 30S",
    optionA: "B, D, E are true",
    optionB: "A, B, C are TRUE",
    optionC: "A, B, D are true",
    optionD: "A, B, E are true",
    correctOption: "B",
    explanation: "Eukaryotic 80S ribosomes dissociate into 60S and 40S subunits; prokaryotic 70S dissociate into 50S and 30S."
  },
  {
    subject: "Biology",
    questionText: "Arrange Whittaker's 5 Kingdoms in increasing order of morphological body complexity:\nA. Fungi, B. Animalia, C. Monera, D. Plantae, E. Protista",
    optionA: "C, E, A, B, D",
    optionB: "A, C, E, B, D",
    optionC: "Monera (C) $\\to$ Protista (E) $\\to$ Fungi (A) $\\to$ Plantae (D) $\\to$ Animalia (B)",
    optionD: "A, C, E, D, B",
    correctOption: "C",
    explanation: "Complexity advances from unicellular prokaryotes (Monera) $\\to$ unicellular eukaryotes (Protista) $\\to$ mycelial fungi $\\to$ tissue plants $\\to$ organ system animals."
  },
  {
    subject: "Biology",
    questionText: "Arrange chronological sequence in life cycle of Bryophytes:\nA. Prothallus/Gametophyte, B. Meiosis in capsule, C. Syngamy, D. Sporophyte development, E. Flagellated antherozoids in water",
    optionA: "D, E, A, B, C",
    optionB: "D, E, A, C, B",
    optionC: "B, E, A, C, D",
    optionD: "Gametophyte (B) $\\to$ Sperm release (E) $\\to$ Syngamy (A) $\\to$ Sporophyte (D) $\\to$ Meiotic spores (C)",
    correctOption: "D",
    explanation: "Gametophyte releases antherozoids $\\to$ fertilization in archegonium $\\to$ sporophyte embryo $\\to$ meiotic spore production."
  },
  {
    subject: "Biology",
    questionText: "Select correct clinical statements on Cancer diagnostics and therapy:\nA. CT and MRI detect internal organ tumors\nB. Chemotherapy kills non-cancerous cells\nC. $\\alpha$-Interferon activates immune system against tumor\nD. Chemotherapy are biological response modifiers\nE. Leukemia decreases WBCs",
    optionA: "A and C only",
    optionB: "B and D only",
    optionC: "D and E only",
    optionD: "C and D only",
    correctOption: "A",
    explanation: "CT/MRI provide 3D diagnostic imaging of tumors; $\\alpha$-interferons act as biological response modifiers stimulating immune attack."
  },
  {
    subject: "Biology",
    questionText: "Enzymes that catalyze the transfer of a functional group $G$ (other than hydrogen) between substrates ($S-G + S' \\to S + S'-G$) are:",
    optionA: "Ligase",
    optionB: "Hydrolase",
    optionC: "Lyase",
    optionD: "Transferase (Class 2 enzymes)",
    correctOption: "D",
    explanation: "Transferases (e.g. transaminases, kinases) catalyze transfer of functional groups between donor and acceptor molecules."
  },
  {
    subject: "Biology",
    questionText: "Select correct human embryological gestational milestones:\nA. Major organ systems formed by end of 12 weeks (1st trimester)\nC. Heart formed and beats after 1 month\nD. Limbs and digits form by end of 2nd month\nE. First movement and head hair appear in 5th month",
    optionA: "A, C, D and E only",
    optionB: "A and E only",
    optionC: "B and C only",
    optionD: "B, C, D and E only",
    correctOption: "A",
    explanation: "Heart forms in month 1; limbs/digits in month 2; organ systems in month 3 (week 12); quickening/hair in month 5."
  },
  {
    subject: "Biology",
    questionText: "Which of the following is a non-distilled alcoholic beverage produced directly by yeast fermentation?",
    optionA: "Rum (Distilled)",
    optionB: "Whisky (Distilled)",
    optionC: "Brandy (Distilled)",
    optionD: "Beer and Wine (Non-distilled)",
    correctOption: "D",
    explanation: "Beer and wine are produced without distillation; whisky, brandy, and rum are concentrated by distillation."
  },
  {
    subject: "Biology",
    questionText: "Statement I: RNA was the first primordial genetic material and catalyst.\nStatement II: Double-stranded DNA evolved from RNA with repair mechanisms, providing chemical and structural stability.",
    optionA: "Statement I incorrect, II correct",
    optionB: "Both Statement I and Statement II are TRUE",
    optionC: "Both incorrect",
    optionD: "Statement I correct, II incorrect",
    correctOption: "B",
    explanation: "RNA world hypothesis posits RNA as first self-replicating genetic catalyst; DNA subsequently evolved with superior stability and repair capacity."
  },
  {
    subject: "Biology",
    questionText: "Statement I: tRNAs and rRNAs do not interact with mRNA during protein translation.\nStatement II: RNA interference (RNAi) is a conserved eukaryotic gene-silencing defense against viral pathogens.",
    optionA: "Statement I is INCORRECT (tRNA and rRNA actively bind mRNA) but Statement II is CORRECT",
    optionB: "Both correct",
    optionC: "Both incorrect",
    optionD: "Statement I correct, II incorrect",
    correctOption: "A",
    explanation: "tRNA anticodons and rRNA ribosomal binding sites interact directly with mRNA codons during translation."
  },
  {
    subject: "Biology",
    questionText: "In the human nephron, tubular secretion and selective reabsorption in Proximal (P) and Distal (D) tubules involve:",
    optionA: "P reabsorbs nothing",
    optionB: "D secretes nothing",
    optionC: "PCT: reabsorption of $\\text{HCO}_3^-, \\text{NaCl}, \\text{H}_2\\text{O}$ and secretion of $\\text{H}^+, \\text{NH}_3$; DCT: reabsorption of $\\text{HCO}_3^-$ and secretion of $\\text{K}^+, \\text{H}^+$",
    optionD: "Opposite polarity",
    correctOption: "C",
    explanation: "PCT reabsorbs nutrients and $\\text{HCO}_3^-$ while secreting $\\text{H}^+, \\text{NH}_3$; DCT regulates electrolyte and acid-base balance."
  },
  {
    subject: "Biology",
    questionText: "Continuous variation in human height and skin pigmentation controlled by multiple additive genes exhibits:",
    optionA: "X-linked recessive",
    optionB: "Mendelian inheritance",
    optionC: "Non-Mendelian Polygenic Inheritance (Quantitative bell-shaped trait)",
    optionD: "Autosomal dominant",
    correctOption: "C",
    explanation: "Polygenic traits are controlled by three or more genes with cumulative additive phenotypic effects (Non-Mendelian)."
  },
  {
    subject: "Biology",
    questionText: "In monocot cereal seeds (Maize, Wheat), the outer protein-rich layer surrounding starchy endosperm is the:",
    optionA: "Aleurone layer",
    optionB: "Coleoptile",
    optionC: "Coleorhiza",
    optionD: "Integument",
    correctOption: "A",
    explanation: "The aleurone layer is a specialized triploid proteinaceous tissue encasing monocot endosperm."
  },
  {
    subject: "Biology",
    questionText: "Match Chromatographic Leaf Pigments with Colors:\nA. Chlorophyll a, B. Chlorophyll b, C. Xanthophylls, D. Carotenoids\nI. Yellow-green, II. Yellow, III. Bright / Blue-green, IV. Yellow to Yellow-orange",
    optionA: "A-I, B-IV, C-III, D-II",
    optionB: "A-III, B-IV, C-II, D-I",
    optionC: "A-III, B-I, C-II, D-IV",
    optionD: "A-I, B-II, C-IV, D-III",
    correctOption: "C",
    explanation: "Chl a = Blue-green (III), Chl b = Yellow-green (I), Xanthophylls = Yellow (II), Carotenoids = Yellow-orange (IV)."
  },
  {
    subject: "Biology",
    questionText: "Which host organism was genetically engineered by Eli Lilly in 1983 to produce commercial recombinant Human Insulin (Humulin)?",
    optionA: "Bacteriophage",
    optionB: "Bacterium (Escherichia coli)",
    optionC: "Yeast",
    optionD: "Virus",
    correctOption: "B",
    explanation: "Eli Lilly cloned human A and B chain cDNA into separate E. coli plasmid expression vectors and joined chains with disulphide bonds."
  },
  {
    subject: "Biology",
    questionText: "Post-transcriptional processing events of primary hnRNA in eukaryotic nuclei include:\nB. Intron splicing and exon ligation\nC. 5' 7-methylguanosine capping\nD. 3' Poly-A tailing",
    optionA: "C, D, E only",
    optionB: "A, B, C only",
    optionC: "B, C, D only (Splicing, Capping, Tailing)",
    optionD: "B, C, E only",
    correctOption: "C",
    explanation: "Eukaryotic pre-mRNA matures via $5'$ capping with methylguanosine, $3'$ polyadenylation, and spliceosomal intron excision."
  },
  {
    subject: "Biology",
    questionText: "Match Cell Structures with Roles:\nA. Centromere, B. Cilium, C. Cristae, D. Cell membrane\nI. Mitochondrion ETS surface, II. Chromosome segregation in cell division, III. Cell movement, IV. Phospholipid bilayer",
    optionA: "A-II, B-III, C-I, D-IV",
    optionB: "A-I, B-II, C-III, D-IV",
    optionC: "A-II, B-I, C-IV, D-III",
    optionD: "A-IV, B-II, C-III, D-I",
    correctOption: "A",
    explanation: "Centromere = Cell division (II), Cilium = Movement (III), Cristae = Mitochondria (I), Membrane = Phospholipid bilayer (IV)."
  },
  {
    subject: "Biology",
    questionText: "Match Historic Genetics Experiments:\nA. Hershey & Chase, B. Euchromatin, C. Frederick Griffith, D. Heterochromatin\nI. Streptococcus pneumoniae transformation, II. Densely packed dark-staining inactive chromatin, III. Loosely packed light-staining active chromatin, IV. Confirmed DNA as genetic material",
    optionA: "A-III, B-II, C-IV, D-I",
    optionB: "A-II, B-IV, C-I, D-III",
    optionC: "A-IV, B-II, C-I, D-III",
    optionD: "A-IV, B-III, C-I, D-II",
    correctOption: "D",
    explanation: "Hershey & Chase = DNA proof (IV), Euchromatin = Light/loose (III), Griffith = Transformation (I), Heterochromatin = Dark/dense (II)."
  },
  {
    subject: "Biology",
    questionText: "Which human chromosome contains the HIGHEST number of annotated genes (2,968 genes)?",
    optionA: "Chromosome 10",
    optionB: "Chromosome X",
    optionC: "Chromosome Y (Fewest genes: 231)",
    optionD: "Chromosome 1",
    correctOption: "D",
    explanation: "Human Chromosome 1 has 2,968 genes (highest), whereas the Y chromosome has the fewest (231 genes)."
  },
  {
    subject: "Biology",
    questionText: "Potential socio-medical limitations and drawbacks in adoption of In-Vitro Fertilization (IVF) include:\nB. Expensive instruments, incubators, and hormonal drugs\nD. Decreased adoption of orphan children\nF. Risk of early embryonic arrest and failure to implant",
    optionA: "A, B, C, E, F only",
    optionB: "B, D, F only",
    optionC: "A, C, D, F only",
    optionD: "A, B, C, D only",
    correctOption: "B",
    explanation: "High financial costs, failure of early embryos to implant, and societal neglect of orphan adoption are recognized drawbacks of ART."
  },
  {
    subject: "Biology",
    questionText: "Which of the following is an EX-SITU biodiversity conservation facility?",
    optionA: "Protected areas",
    optionB: "National Parks",
    optionC: "Wildlife Sanctuaries",
    optionD: "Zoological parks and Botanical gardens (Ex-situ off-site care)",
    correctOption: "D",
    explanation: "Zoos, botanical gardens, and seed banks conserve species outside natural habitats under human management."
  },
  {
    subject: "Biology",
    questionText: "Specialized infolding of prokaryotic plasma membrane involved in respiration, DNA replication, and cell wall synthesis is the:",
    optionA: "Endoplasmic Reticulum",
    optionB: "Mesosome",
    optionC: "Chromatophore",
    optionD: "Cristae",
    correctOption: "B",
    explanation: "Bacterial mesosomes increase respiratory surface area and participate in septum formation and chromosome segregation."
  },
  {
    subject: "Biology",
    questionText: "When an alien gene is inserted at the EcoRI restriction site within the $\\beta$-galactosidase (lacZ) gene of a cloning vector, transformants are identified as:",
    optionA: "Blue colonies on ampicillin plates",
    optionB: "Tetracycline resistant only",
    optionC: "Blue colonies",
    optionD: "White colonies (Insertional inactivation of lacZ prevents blue chromogenic X-gal hydrolysis)",
    correctOption: "D",
    explanation: "Insertion within $\\beta$-galactosidase gene disrupts enzyme function, yielding white recombinant colonies on X-gal plates."
  },
  {
    subject: "Biology",
    questionText: "Which major vein returns deoxygenated systemic venous blood from body organs directly to Sinus Venosus in frog heart?",
    optionA: "Vena Cava (Precaval and Postcaval veins)",
    optionB: "Aorta",
    optionC: "Pulmonary artery",
    optionD: "Pulmonary vein",
    correctOption: "A",
    explanation: "Two precavals and one postcaval vena cava carry deoxygenated blood from body into Sinus Venosus of frog heart."
  },
  {
    subject: "Biology",
    questionText: "Which of the following photosynthetic organisms CANNOT fix atmospheric nitrogen?",
    optionA: "Azotobacter",
    optionB: "Oscillatoria",
    optionC: "Anabaena",
    optionD: "Volvox (Green colonial alga without diazotrophic nitrogenase)",
    correctOption: "C",
    explanation: "Volvox is a photosynthetic eukaryotic green alga lacking nitrogenase enzymes (Official key: 3 / Volvox)."
  },
  {
    subject: "Biology",
    questionText: "An animal histology section shows a body cavity lined by mesoderm only on the outer body wall and not over the gut. The coelom is:",
    optionA: "Spongocoelomate",
    optionB: "Acoelomate",
    optionC: "Pseudocoelomate (e.g. Aschelminthes / Roundworms)",
    optionD: "Schizocoelomate",
    correctOption: "C",
    explanation: "In pseudocoelomates (Nematoda), mesoderm is present as scattered pouches along body wall without lining gut."
  },
  {
    subject: "Biology",
    questionText: "The scientific philosophy of studying living organisms by analyzing their underlying physico-chemical molecular processes is called:",
    optionA: "Behavioral Biology",
    optionB: "Reductionist Biology",
    optionC: "Physiological approach",
    optionD: "Chemical taxonomy",
    correctOption: "B",
    explanation: "Reductionist biology seeks to explain complex biological phenomena through constituent physical and chemical interactions."
  },
  {
    subject: "Biology",
    questionText: "An epiphytic orchid (Vanda) growing on the bark of a mango tree without drawing nutrition or harming it is an example of:",
    optionA: "Amensalism",
    optionB: "Commensalism ($+/0$ interaction)",
    optionC: "Mutualism",
    optionD: "Predation",
    correctOption: "B",
    explanation: "In commensalism, epiphyte gains support and canopy sunlight while host tree is neither harmed nor benefited."
  },
  {
    subject: "Biology",
    questionText: "Which phytohormone promotes nutrient mobilization and prevents chlorophyll breakdown, delaying leaf senescence (Richmond-Lang effect)?",
    optionA: "Cytokinin",
    optionB: "Ethylene",
    optionC: "Abscisic acid",
    optionD: "Gibberellin",
    correctOption: "A",
    explanation: "Cytokinins mobilize nutrients to developing organs, thereby delaying leaf senescence and abscission."
  },
  {
    subject: "Biology",
    questionText: "Complex II of the mitochondrial electron transport chain embedded in inner membrane is:",
    optionA: "NADH dehydrogenase (Complex I)",
    optionB: "Cytochrome $bc_1$ (Complex III)",
    optionC: "Succinate Dehydrogenase / Succinate-Q oxidoreductase (Complex II)",
    optionD: "Cytochrome c oxidase (Complex IV)",
    correctOption: "C",
    explanation: "Complex II oxidizes succinate to fumarate and transfers electrons via $\\text{FADH}_2$ to ubiquinone."
  }
];

async function seedNeet2025Paper() {
  console.log(`🚀 Compiling NEET 2025 Paper JSON with ${rawQuestions.length} complete questions...`);

  const paperData = {
    examName: "NEET",
    year: 2025,
    shiftName: "NEET 2025",
    examDate: "2025-05-04T14:00:00Z",
    totalMarks: 720,
    totalQuestions: 180,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'NEET 2025.json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved NEET 2025 JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding NEET 2025 Shift into Database via Prisma...`);
  
  let exam = await prisma.exam.findFirst({
    where: { name: "NEET" }
  });

  if (!exam) {
    exam = await prisma.exam.create({
      data: { name: "NEET" }
    });
  }

  const existingShift = await prisma.shift.findFirst({
    where: {
      examId: exam.id,
      name: "NEET 2025"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "NEET 2025",
      date: new Date("2025-05-04T14:00:00Z")
    }
  });
  console.log(`Created Shift "NEET 2025" (ID: ${shift.id})`);

  console.log(`Inserting ${rawQuestions.length} questions in exact 1..180 sequence...`);
  for (let i = 0; i < rawQuestions.length; i++) {
    const q = rawQuestions[i];
    await prisma.question.create({
      data: {
        shiftId: shift.id,
        subject: q.subject,
        questionText: q.questionText,
        imageUrl: q.imageUrl || null,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctOption: q.correctOption,
        positiveMarks: 4,
        negativeMarks: -1
      }
    });
  }

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for NEET 2025 in PostgreSQL!`);
}

seedNeet2025Paper()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
