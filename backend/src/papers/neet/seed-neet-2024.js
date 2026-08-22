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
// 1. Generate Crisp Vector SVGs for NEET 2024
// ---------------------------------------------------------------------

// Q3: P-V Cyclic Thermodynamic Process abcda
saveSvg('neet_2024_q3.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240" width="100%" height="200">
  <rect width="360" height="240" fill="#0f172a" rx="16"/>
  <!-- Axes -->
  <line x1="60" y1="190" x2="320" y2="190" stroke="#94a3b8" stroke-width="2"/>
  <line x1="60" y1="190" x2="60" y2="30" stroke="#94a3b8" stroke-width="2"/>
  <text x="35" y="35" fill="#f8fafc" font-family="sans-serif" font-size="14">P</text>
  <text x="325" y="195" fill="#f8fafc" font-family="sans-serif" font-size="14">V</text>

  <!-- P values -->
  <line x1="55" y1="150" x2="65" y2="150" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="10" y="155" fill="#94a3b8" font-family="sans-serif" font-size="11">100 kPa</text>
  <line x1="55" y1="70" x2="65" y2="70" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="10" y="75" fill="#94a3b8" font-family="sans-serif" font-size="11">300 kPa</text>

  <!-- V values -->
  <line x1="120" y1="185" x2="120" y2="195" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="95" y="210" fill="#94a3b8" font-family="sans-serif" font-size="11">100 cm³</text>
  <line x1="260" y1="185" x2="260" y2="195" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="235" y="210" fill="#94a3b8" font-family="sans-serif" font-size="11">400 cm³</text>

  <!-- Cycle abcda -->
  <polygon points="120,150 260,150 260,70 120,70" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  <text x="105" y="155" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="13">a</text>
  <text x="270" y="155" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="13">b</text>
  <text x="270" y="75" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="13">c</text>
  <text x="105" y="75" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="13">d</text>

  <text x="190" y="115" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">Path bc: Isothermal/Isochoric (ΔV = 0) ⟹ W_bc = 0</text>
</svg>`);

// Q8: Right angled prism ray optics
saveSvg('neet_2024_q8.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 220" width="100%" height="180">
  <rect width="340" height="220" fill="#0f172a" rx="16"/>
  <!-- Right angled Prism ABC -->
  <polygon points="60,180 260,180 60,40" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  <text x="45" y="45" fill="#f8fafc" font-family="sans-serif" font-size="13">A</text>
  <text x="45" y="195" fill="#f8fafc" font-family="sans-serif" font-size="13">B</text>
  <text x="270" y="195" fill="#f8fafc" font-family="sans-serif" font-size="13">C</text>
  <!-- 30 deg at A -->
  <text x="75" y="75" fill="#f59e0b" font-family="sans-serif" font-size="11">30°</text>

  <!-- Incident ray at P -->
  <line x1="20" y1="130" x2="60" y2="110" stroke="#f59e0b" stroke-width="2"/>
  <text x="65" y="105" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="12">P</text>
  <!-- Ray parallel to base inside -->
  <line x1="60" y1="110" x2="160" y2="110" stroke="#f59e0b" stroke-width="2"/>
  <!-- Emergent ray along AC -->
  <line x1="160" y1="110" x2="210" y2="75" stroke="#f59e0b" stroke-width="2"/>
  <text x="180" y="210" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">μ = √5 / 2</text>
</svg>`);

// Q16: Rolling wheel with P (top) and Q (bottom)
saveSvg('neet_2024_q16.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 220" width="100%" height="180">
  <rect width="340" height="220" fill="#0f172a" rx="16"/>
  <!-- Road -->
  <line x1="30" y1="180" x2="310" y2="180" stroke="#64748b" stroke-width="3"/>
  <!-- Wheel Circle -->
  <circle cx="170" cy="115" r="65" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
  <line x1="170" y1="50" x2="170" y2="180" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="105" y1="115" x2="235" y2="115" stroke="#94a3b8" stroke-width="1.5"/>

  <!-- Highest point P (v_P = 2v) -->
  <circle cx="170" cy="50" r="5" fill="#ef4444"/>
  <text x="170" y="40" fill="#ef4444" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle">P (v_P = 2v)</text>

  <!-- Lowest point Q (v_Q = 0) -->
  <circle cx="170" cy="180" r="5" fill="#10b981"/>
  <text x="170" y="205" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle">Q (v_Q = 0, instantaneous rest)</text>

  <text x="250" y="110" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="12">v_CM = v →</text>
</svg>`);

// Q24: Connected blocks A (2kg) and B (3kg) with F = 10N
saveSvg('neet_2024_q24.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 180" width="100%" height="150">
  <rect width="360" height="180" fill="#0f172a" rx="16"/>
  <!-- Table -->
  <line x1="30" y1="140" x2="330" y2="140" stroke="#64748b" stroke-width="2.5"/>

  <!-- Force F = 10N -->
  <line x1="50" y1="95" x2="120" y2="95" stroke="#38bdf8" stroke-width="3"/>
  <polygon points="125,95 110,88 110,102" fill="#38bdf8"/>
  <text x="75" y="80" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="13">F = 10 N</text>

  <!-- Block A (2 kg) -->
  <rect x="125" y="60" width="60" height="80" fill="#1e293b" stroke="#f59e0b" stroke-width="2" rx="4"/>
  <text x="155" y="95" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle">A</text>
  <text x="155" y="115" fill="#f8fafc" font-family="sans-serif" font-size="11" text-anchor="middle">2 kg</text>

  <!-- Block B (3 kg) -->
  <rect x="185" y="50" width="80" height="90" fill="#1e293b" stroke="#a855f7" stroke-width="2" rx="4"/>
  <text x="225" y="95" fill="#a855f7" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle">B</text>
  <text x="225" y="115" fill="#f8fafc" font-family="sans-serif" font-size="11" text-anchor="middle">3 kg</text>

  <text x="180" y="165" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">Force on B: N = m_B × a = 3 × 2 = 6 N</text>
</svg>`);

// Q31: Capacitor Bridge
saveSvg('neet_2024_q31.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 200" width="100%" height="160">
  <rect width="380" height="200" fill="#0f172a" rx="16"/>
  <!-- Node A -->
  <circle cx="50" cy="100" r="5" fill="#38bdf8"/>
  <text x="30" y="105" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="14">A</text>
  <line x1="50" y1="100" x2="100" y2="100" stroke="#94a3b8" stroke-width="2"/>

  <!-- Upper branch (2uF, 2uF) -->
  <line x1="100" y1="100" x2="100" y2="50" stroke="#94a3b8" stroke-width="2"/>
  <line x1="100" y1="50" x2="165" y2="50" stroke="#94a3b8" stroke-width="2"/>
  <line x1="165" y1="40" x2="165" y2="60" stroke="#38bdf8" stroke-width="2.5"/>
  <line x1="175" y1="40" x2="175" y2="60" stroke="#38bdf8" stroke-width="2.5"/>
  <text x="170" y="30" fill="#38bdf8" font-family="sans-serif" font-size="11" text-anchor="middle">2 μF</text>
  <line x1="175" y1="50" x2="225" y2="50" stroke="#94a3b8" stroke-width="2"/>
  <line x1="225" y1="40" x2="225" y2="60" stroke="#38bdf8" stroke-width="2.5"/>
  <line x1="235" y1="40" x2="235" y2="60" stroke="#38bdf8" stroke-width="2.5"/>
  <text x="230" y="30" fill="#38bdf8" font-family="sans-serif" font-size="11" text-anchor="middle">2 μF</text>
  <line x1="235" y1="50" x2="300" y2="50" stroke="#94a3b8" stroke-width="2"/>

  <!-- Bridge 2uF -->
  <line x1="200" y1="50" x2="200" y2="85" stroke="#94a3b8" stroke-width="2"/>
  <line x1="190" y1="85" x2="210" y2="85" stroke="#f59e0b" stroke-width="2.5"/>
  <line x1="190" y1="95" x2="210" y2="95" stroke="#f59e0b" stroke-width="2.5"/>
  <text x="235" y="93" fill="#f59e0b" font-family="sans-serif" font-size="11">2 μF</text>
  <line x1="200" y1="95" x2="200" y2="150" stroke="#94a3b8" stroke-width="2"/>

  <!-- Lower branch (2uF, 2uF) -->
  <line x1="100" y1="100" x2="100" y2="150" stroke="#94a3b8" stroke-width="2"/>
  <line x1="100" y1="150" x2="165" y2="150" stroke="#94a3b8" stroke-width="2"/>
  <line x1="165" y1="140" x2="165" y2="160" stroke="#38bdf8" stroke-width="2.5"/>
  <line x1="175" y1="140" x2="175" y2="160" stroke="#38bdf8" stroke-width="2.5"/>
  <text x="170" y="180" fill="#38bdf8" font-family="sans-serif" font-size="11" text-anchor="middle">2 μF</text>
  <line x1="175" y1="150" x2="225" y2="150" stroke="#94a3b8" stroke-width="2"/>
  <line x1="225" y1="140" x2="225" y2="160" stroke="#38bdf8" stroke-width="2.5"/>
  <line x1="235" y1="140" x2="235" y2="160" stroke="#38bdf8" stroke-width="2.5"/>
  <text x="230" y="180" fill="#38bdf8" font-family="sans-serif" font-size="11" text-anchor="middle">2 μF</text>
  <line x1="235" y1="150" x2="300" y2="150" stroke="#94a3b8" stroke-width="2"/>

  <!-- Node B -->
  <line x1="300" y1="50" x2="300" y2="150" stroke="#94a3b8" stroke-width="2"/>
  <line x1="300" y1="100" x2="335" y2="100" stroke="#94a3b8" stroke-width="2"/>
  <circle cx="335" cy="100" r="5" fill="#38bdf8"/>
  <text x="345" y="105" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="14">B</text>
  <text x="200" y="195" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">Balanced Bridge ⟹ C_AB = 2 μF</text>
</svg>`);

// Q168: pBR322 plasmid restriction map
saveSvg('neet_2024_q168.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 300" width="100%" height="220">
  <rect width="360" height="300" fill="#0f172a" rx="16"/>
  <!-- Circular plasmid ring -->
  <circle cx="180" cy="150" r="90" fill="#1e293b" stroke="#38bdf8" stroke-width="4"/>
  <text x="180" y="145" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle">pBR322</text>

  <!-- EcoRI, ClaI, HindIII at top -->
  <text x="180" y="45" fill="#a855f7" font-family="sans-serif" font-size="11" text-anchor="middle">EcoRI, ClaI, HindIII</text>
  <!-- BamHI, SalI on right (tetR) -->
  <text x="295" y="125" fill="#f59e0b" font-family="sans-serif" font-size="11">BamHI, SalI</text>
  <text x="295" y="145" fill="#f59e0b" font-family="sans-serif" font-size="10">(tet^R)</text>

  <!-- PstI, PvuI on left (ampR) -->
  <text x="20" y="125" fill="#10b981" font-family="sans-serif" font-size="11">PstI, PvuI</text>
  <text x="20" y="145" fill="#10b981" font-family="sans-serif" font-size="10">(amp^R)</text>

  <!-- rop gene (Y) and ori (X) at bottom -->
  <text x="140" y="270" fill="#ef4444" font-family="sans-serif" font-weight="bold" font-size="12">ori (X)</text>
  <text x="210" y="270" fill="#ef4444" font-family="sans-serif" font-weight="bold" font-size="12">rop (Y)</text>
  <text x="180" y="290" fill="#10b981" font-family="sans-serif" font-size="11" text-anchor="middle">X: Copy number control / Replication | Y: rop protein</text>
</svg>`);

console.log("NEET 2024 SVGs generated!");

// ---------------------------------------------------------------------
// 2. Complete 200 Questions for NEET 2024 (Physics 1-50, Chemistry 51-100, Biology 101-200)
// ---------------------------------------------------------------------
const rawQuestions = [
  // -------------------------------------------------------------
  // PHYSICS (Q1 - Q50)
  // -------------------------------------------------------------
  {
    subject: "Physics",
    questionText: "Moment of inertia of a thin rod of mass $400\\text{ g}$ about an axis passing through its midpoint perpendicular to length is $2400\\text{ g cm}^2$. Length of rod is nearly:",
    optionA: "$20.7\\text{ cm}$",
    optionB: "$72.0\\text{ cm}$",
    optionC: "$8.5\\text{ cm}$",
    optionD: "$17.5\\text{ cm}$",
    correctOption: "C",
    explanation: "$I = \\frac{M L^2}{12} \\implies 2400 = \\frac{400 \\times L^2}{12} \\implies L^2 = 72 \\implies L = \\sqrt{72} = 8.485\\text{ cm} \\approx 8.5\\text{ cm}$."
  },
  {
    subject: "Physics",
    questionText: "A bob is whirled in a horizontal plane with initial speed $\\omega\\text{ rpm}$ and tension $T$. If speed becomes $2\\omega$ at same radius, new tension is:",
    optionA: "$T/4$",
    optionB: "$2\\sqrt{2}T$",
    optionC: "$T$",
    optionD: "$4T$",
    correctOption: "D",
    explanation: "$T = m \\omega^2 r \\implies T' = m (2\\omega)^2 r = 4 m \\omega^2 r = 4T$."
  },
  {
    subject: "Physics",
    questionText: "In thermodynamic cycle $abcda$, work done by gas along the path $bc$ (isochoric cooling at $V = 400\\text{ cm}^3$) is:",
    imageUrl: "/neetimages/neet_2024_q3.svg",
    optionA: "$-90\\text{ J}$",
    optionB: "$-60\\text{ J}$",
    optionC: "Zero",
    optionD: "$30\\text{ J}$",
    correctOption: "C",
    explanation: "Along path $bc$, volume is constant ($dV = 0$), hence work done $W_{bc} = \\int P dV = 0$."
  },
  {
    subject: "Physics",
    questionText: "In nuclear decay: $^{290}_{82}\\text{X} \\xrightarrow{\\alpha} \\text{Y} \\xrightarrow{\\beta^+} \\text{Z} \\xrightarrow{\\beta^-} \\text{P} \\xrightarrow{\\beta^-} \\text{Q}$. Mass and atomic numbers of Q are:",
    optionA: "288, 82",
    optionB: "286, 81",
    optionC: "280, 81",
    optionD: "286, 80",
    correctOption: "B",
    explanation: "$\\alpha$: (286, 80) $\\to \\beta^+$: (286, 79) $\\to \\beta^-$: (286, 80) $\\to \\beta^-$: (286, 81)."
  },
  {
    subject: "Physics",
    questionText: "An unpolarised light beam strikes a glass surface at Brewster's angle $\\theta_p$. Then:",
    optionA: "Both reflected and refracted are completely polarised",
    optionB: "Reflected light is completely polarised while refracted light is partially polarised",
    optionC: "Reflected light is partially polarised",
    optionD: "Refracted light is completely polarised",
    correctOption: "B",
    explanation: "At Brewster's angle, reflected beam is $100\\%$ linearly polarised perpendicular to plane of incidence; transmitted refracted beam is partially polarised."
  },
  {
    subject: "Physics",
    questionText: "Which statements about photons are correct?\n(A) Energy $E = h\\nu$\n(B) Velocity in vacuum is $c$\n(C) Momentum $p = h\\nu/c$\n(D) In photon-electron collision, total energy and momentum are conserved\n(E) Photon has positive charge",
    optionA: "A, C and D only",
    optionB: "A, B, D and E only",
    optionC: "A and B only",
    optionD: "A, B, C and D only",
    correctOption: "D",
    explanation: "Photons are electrically neutral (charge $= 0$), making E false while A, B, C, D are correct."
  },
  {
    subject: "Physics",
    questionText: "Two bodies A and B of same mass $m$ undergo completely inelastic collision. Body A has initial velocity $v_1$, B is at rest. Final common velocity is $v_2$. Ratio $v_1 : v_2$ is:",
    optionA: "$4 : 1$",
    optionB: "$1 : 4$",
    optionC: "$1 : 2$",
    optionD: "$2 : 1$",
    correctOption: "D",
    explanation: "$m v_1 = (m + m) v_2 = 2m v_2 \\implies v_1 / v_2 = 2 : 1$."
  },
  {
    subject: "Physics",
    questionText: "Light enters right-angled prism ($A = 30^\\circ$) with incidence angle $30^\\circ$, travels parallel to base BC, and grazes along AC ($r_2 = C$). Refractive index $\\mu$ is:",
    imageUrl: "/neetimages/neet_2024_q8.svg",
    optionA: "$\\sqrt{3}/4$",
    optionB: "$\\sqrt{3}/2$",
    optionC: "$\\sqrt{5}/4$",
    optionD: "$\\frac{\\sqrt{5}}{2}$",
    correctOption: "D",
    explanation: "From Snell's law at entrance and critical grazing exit: $\\mu = \\frac{\\sqrt{5}}{2}$."
  },
  {
    subject: "Physics",
    questionText: "If $x = 5\\sin(\\pi t + \\pi/3)\\text{ m}$ represents SHM, amplitude and time period are:",
    optionA: "$5\\text{ cm}, 1\\text{ s}$",
    optionB: "$5\\text{ m}, 1\\text{ s}$",
    optionC: "$5\\text{ cm}, 2\\text{ s}$",
    optionD: "$5\\text{ m}, 2\\text{ s}$",
    correctOption: "D",
    explanation: "$A = 5\\text{ m}$. $\\omega = \\pi\\text{ rad/s} \\implies T = \\frac{2\\pi}{\\omega} = \\frac{2\\pi}{\\pi} = 2\\text{ s}$."
  },
  {
    subject: "Physics",
    questionText: "Displacement of particle is $s = 2t - 1$ under constant force $F = 5\\text{ N}$. Instantaneous power developed is:",
    optionA: "7",
    optionB: "6",
    optionC: "10 W",
    optionD: "5",
    correctOption: "C",
    explanation: "$v = \\frac{ds}{dt} = 2\\text{ m/s} \\implies P = F \\cdot v = 5 \\times 2 = 10\\text{ W}$."
  },
  {
    subject: "Physics",
    questionText: "Tightly wound coil of 100 turns ($r = 10\\text{ cm} = 0.1\\text{ m}$) carries $7\\text{ A}$. Magnetic field at centre is ($\\mu_0 = 4\\pi \\times 10^{-7}$):",
    optionA: "$4.4\\text{ mT}$",
    optionB: "$44\\text{ T}$",
    optionC: "$44\\text{ mT}$",
    optionD: "$4.4\\text{ T}$",
    correctOption: "A",
    explanation: "$B = \\frac{\\mu_0 N I}{2 R} = \\frac{(4\\pi \\times 10^{-7}) \\times 100 \\times 7}{2 \\times 0.1} = 4.4 \\times 10^{-3}\\text{ T} = 4.4\\text{ mT}$."
  },
  {
    subject: "Physics",
    questionText: "A particle moving with uniform speed in a circular path maintains:",
    optionA: "Constant velocity but varying acceleration",
    optionB: "Varying velocity and varying acceleration (Direction of both continuously changes)",
    optionC: "Constant velocity",
    optionD: "Constant acceleration",
    correctOption: "B",
    explanation: "In uniform circular motion, magnitude of velocity and acceleration are constant, but their directions continuously rotate."
  },
  {
    subject: "Physics",
    questionText: "Truth table gives $Y=1$ for $(0,0), (1,0)$ and $Y=0$ for $(0,1), (1,1)$. Output boolean expression is:",
    optionA: "$\\overline{B}$",
    optionB: "$B$",
    optionC: "$A \\cdot B + \\overline{A}$",
    optionD: "$A \\cdot B + \\overline{A}$",
    correctOption: "A",
    explanation: "Output $Y$ depends solely on $B$: $Y = 1$ when $B=0$ and $Y=0$ when $B=1 \\implies Y = \\overline{B}$."
  },
  {
    subject: "Physics",
    questionText: "Statement A: For a solar cell, I-V characteristics lie in the IV quadrant.\nStatement B: In reverse biased p-n diode, current in $\\mu\\text{A}$ is due to majority carriers.",
    optionA: "Both A and B are correct",
    optionB: "Both A and B are incorrect",
    optionC: "A is correct but B is incorrect",
    optionD: "A is incorrect but B is correct",
    correctOption: "C",
    explanation: "Solar cell generates power in 4th quadrant ($V > 0, I < 0$). Reverse saturation current is due to minority carriers."
  },
  {
    subject: "Physics",
    questionText: "In an ideal step-up transformer, turns ratio $N_p / N_s = 1/2$. The voltage ratio $V_s : V_p$ is:",
    optionA: "$1 : 1$",
    optionB: "$1 : 4$",
    optionC: "$1 : 2$",
    optionD: "$2 : 1$",
    correctOption: "D",
    explanation: "$\\frac{V_s}{V_p} = \\frac{N_s}{N_p} = \\frac{2}{1} = 2 : 1$."
  },
  {
    subject: "Physics",
    questionText: "A wheel of radius $R$ rolls without slipping with centre velocity $v$. Top point P and contact point Q have speeds:",
    imageUrl: "/neetimages/neet_2024_q16.svg",
    optionA: "Both move with equal speed",
    optionB: "Point P has zero speed",
    optionC: "Point P moves slower than Q",
    optionD: "Point P moves faster than point Q ($v_P = 2v, v_Q = 0$)",
    correctOption: "D",
    explanation: "Top point $v_P = v_{\\text{cm}} + \\omega R = 2v$; bottom point of contact $v_Q = v_{\\text{cm}} - \\omega R = 0$."
  },
  {
    subject: "Physics",
    questionText: "If monochromatic light in YDSE is replaced by white light:",
    optionA: "Central bright white fringe surrounded by a few coloured fringes",
    optionB: "All bright fringes equal width",
    optionC: "Interference disappears",
    optionD: "Central dark fringe",
    correctOption: "A",
    explanation: "At central point path difference is zero for all wavelengths (white); adjacent fringes overlap with blue appearing first."
  },
  {
    subject: "Physics",
    questionText: "A bar magnet (N towards Solenoid 1, S towards Solenoid 2) moves right towards Solenoid 2. Induced currents flow through:",
    optionA: "AB and CD",
    optionB: "BA and DC",
    optionC: "AB and DC",
    optionD: "BA and CD",
    correctOption: "C",
    explanation: "By Lenz's law, Solenoid 1 attracts receding N pole (S pole facing right $\\implies$ current AB) and Solenoid 2 repels approaching S pole (current DC)."
  },
  {
    subject: "Physics",
    questionText: "In a vernier caliper, $(N+1)$ VSD $= N$ MSD. If $1\\text{ MSD} = 0.1\\text{ mm} = 0.01\\text{ cm}$, the vernier constant in cm is:",
    optionA: "$100 N$",
    optionB: "$10(N+1)$",
    optionC: "$\\frac{1}{10N}$",
    optionD: "$\\frac{1}{100(N+1)}$",
    correctOption: "D",
    explanation: "$\\text{VC} = 1\\text{ MSD} - 1\\text{ VSD} = 1\\text{ MSD}\\left(1 - \\frac{N}{N+1}\\right) = \\frac{0.01\\text{ cm}}{N+1} = \\frac{1}{100(N+1)}$."
  },
  {
    subject: "Physics",
    questionText: "A NOR gate with both inputs tied together acts as an inverter, which followed by another inverter produces output of:",
    optionA: "OR gate",
    optionB: "AND gate",
    optionC: "NAND gate",
    optionD: "NOR gate",
    correctOption: "B",
    explanation: "De Morgan analysis shows the equivalent logic behavior matches an AND gate."
  },
  {
    subject: "Physics",
    questionText: "Assertion (A): Electric potential on axis at $r = 2\\text{ m}$ for dipole $p = 4 \\times 10^{-6}\\text{ C m}$ is $\\pm 9 \\times 10^3\\text{ V}$.\nReason (R): $V = \\pm \\frac{2p}{4\\pi\\varepsilon_0 r^2}$.",
    optionA: "A is true but R is false ($V = \\pm \\frac{p}{4\\pi\\varepsilon_0 r^2}$)",
    optionB: "A is false but R is true",
    optionC: "Both A and R true",
    optionD: "Both true, R not explanation",
    correctOption: "A",
    explanation: "$V = \\frac{9 \\times 10^9 \\times (4 \\times 10^{-6})}{2^2} = 9 \\times 10^3\\text{ V}$. Reason gives incorrect factor of 2 in formula."
  },
  {
    subject: "Physics",
    questionText: "In $B = 0.049\\text{ T}$, magnetic needle ($I = 9.8 \\times 10^{-6}\\text{ kg m}^2$) makes 20 oscillations in $5\\text{ s}$ ($T = 0.25\\text{ s}$). Magnetic moment is $x \\times 10^{-5}\\text{ A m}^2$. Value of $x$ is:",
    optionA: "$50\\pi^2$",
    optionB: "$1280\\pi^2$",
    optionC: "$5\\pi^2$",
    optionD: "$128\\pi^2$",
    correctOption: "B",
    explanation: "$T = 2\\pi\\sqrt{\\frac{I}{M B}} \\implies M = \\frac{4\\pi^2 I}{T^2 B} = \\frac{4\\pi^2 (9.8 \\times 10^{-6})}{(1/16)(0.049)} = 1280\\pi^2 \\times 10^{-5} \\implies x = 1280\\pi^2$."
  },
  {
    subject: "Physics",
    questionText: "Match Magnetic Materials with Susceptibility ($\\chi$):\nA. Diamagnetic, B. Ferromagnetic, C. Paramagnetic, D. Non-magnetic\nI. $\\chi = 0$, II. $-1 \\le \\chi < 0$, III. $\\chi \\gg 1$, IV. $0 < \\chi < \\varepsilon$\nChoose correct code:",
    optionA: "A-III, B-II, C-I, D-IV",
    optionB: "A-IV, B-III, C-II, D-I",
    optionC: "A-II, B-III, C-IV, D-I",
    optionD: "A-II, B-I, C-III, D-IV",
    correctOption: "C",
    explanation: "Diamagnetic = negative (II), Ferromagnetic = large positive (III), Paramagnetic = small positive (IV), Non-magnetic = zero (I)."
  },
  {
    subject: "Physics",
    questionText: "Horizontal force $F = 10\\text{ N}$ pushes blocks A ($2\\text{ kg}$) and B ($3\\text{ kg}$) on frictionless table. Force exerted by A on B is:",
    imageUrl: "/neetimages/neet_2024_q24.svg",
    optionA: "$6\\text{ N}$",
    optionB: "$10\\text{ N}$",
    optionC: "Zero",
    optionD: "$4\\text{ N}$",
    correctOption: "A",
    explanation: "$a = \\frac{10}{2+3} = 2\\text{ m/s}^2$. Normal contact force on B $= m_B \\times a = 3 \\times 2 = 6\\text{ N}$."
  },
  {
    subject: "Physics",
    questionText: "Statement I: Atoms are electrically neutral with equal numbers of protons and electrons.\nStatement II: Atoms of each element are stable and emit characteristic spectra.",
    optionA: "Statement I is correct but Statement II is incorrect (Radioactive atoms are unstable)",
    optionB: "Statement I is incorrect but II is correct",
    optionC: "Both correct",
    optionD: "Both incorrect",
    correctOption: "A",
    explanation: "Statement I is true. Statement II is false because atoms of radioactive elements are inherently unstable."
  },
  {
    subject: "Physics",
    questionText: "Battery ($10\\text{ V}, 1\\,\\Omega$) connected across external load $4\\,\\Omega$. Terminal voltage across battery is:",
    optionA: "$8\\text{ V}$",
    optionB: "$10\\text{ V}$",
    optionC: "$4\\text{ V}$",
    optionD: "$6\\text{ V}$",
    correctOption: "A",
    explanation: "$I = \\frac{10}{4+1} = 2\\text{ A}$. $V = E - I r = 10 - 2(1) = 8\\text{ V}$."
  },
  {
    subject: "Physics",
    questionText: "Wire of $100\\,\\Omega$ cut into 10 equal parts of $10\\,\\Omega$ each. First 5 in series ($50\\,\\Omega$), next 5 in parallel ($2\\,\\Omega$), connected in series. Total resistance is:",
    optionA: "$55\\,\\Omega$",
    optionB: "$60\\,\\Omega$",
    optionC: "$26\\,\\Omega$",
    optionD: "$52\\,\\Omega$",
    correctOption: "D",
    explanation: "$R_{\\text{total}} = (5 \\times 10) + (10 / 5) = 50 + 2 = 52\\,\\Omega$."
  },
  {
    subject: "Physics",
    questionText: "Elastic limit of steel is $8 \\times 10^8\\text{ N/m}^2$ and $Y = 2 \\times 10^{11}\\text{ N/m}^2$. Maximum elongation of $1\\text{ m}$ wire before plastic deformation is:",
    optionA: "$40\\text{ mm}$",
    optionB: "$8\\text{ mm}$",
    optionC: "$4\\text{ mm}$",
    optionD: "$0.4\\text{ mm}$",
    correctOption: "C",
    explanation: "$\\Delta L = \\frac{\\text{Stress}}{Y} L = \\frac{8 \\times 10^8}{2 \\times 10^{11}} \\times 1 = 4 \\times 10^{-3}\\text{ m} = 4\\text{ mm}$."
  },
  {
    subject: "Physics",
    questionText: "Thin circular disc of radius $4.5\\text{ cm}$ lies on water ($T = 0.07\\text{ N/m}$). Excess upward force to lift it is:",
    optionA: "$1.98\\text{ mN}$",
    optionB: "$99\\text{ N}$",
    optionC: "$19.8\\text{ mN}$",
    optionD: "$198\\text{ N}$",
    correctOption: "C",
    explanation: "$F = T \\times (2\\pi r) = 0.07 \\times (2 \\times \\frac{22}{7} \\times 0.045) = 0.0198\\text{ N} = 19.8\\text{ mN}$."
  },
  {
    subject: "Physics",
    questionText: "Match Balmer Spectral Lines with Wavelengths:\nA. $3 \\to 2$, B. $4 \\to 2$, C. $5 \\to 2$, D. $6 \\to 2$\nI. $410.2\\text{ nm}$, II. $434.1\\text{ nm}$, III. $656.3\\text{ nm}$, IV. $486.1\\text{ nm}$",
    optionA: "A-IV, B-III, C-I, D-II",
    optionB: "A-I, B-II, C-III, D-IV",
    optionC: "A-II, B-I, C-IV, D-III",
    optionD: "A-III, B-IV, C-II, D-I",
    correctOption: "D",
    explanation: "$H_\\alpha (3\\to 2) = 656.3\\text{ nm}$, $H_\\beta (4\\to 2) = 486.1\\text{ nm}$, $H_\\gamma (5\\to 2) = 434.1\\text{ nm}$, $H_\\delta (6\\to 2) = 410.2\\text{ nm}$."
  },
  {
    subject: "Physics",
    questionText: "Equivalent capacitance of bridge network with five identical $2\\,\\mu\\text{F}$ capacitors between A and B is:",
    imageUrl: "/neetimages/neet_2024_q31.svg",
    optionA: "$0.5\\,\\mu\\text{F}$",
    optionB: "$4\\,\\mu\\text{F}$",
    optionC: "$2\\,\\mu\\text{F}$",
    optionD: "$1\\,\\mu\\text{F}$",
    correctOption: "C",
    explanation: "Balanced bridge: central $2\\,\\mu\\text{F}$ capacitor is inactive. Upper series $= 1\\,\\mu\\text{F}$, lower series $= 1\\,\\mu\\text{F} \\implies C_{\\text{eq}} = 1 + 1 = 2\\,\\mu\\text{F}$."
  },
  {
    subject: "Physics",
    questionText: "Planet mass is $1/10$ of Earth and diameter is $1/2$ of Earth. Acceleration due to gravity on planet is ($g_E = 9.8\\text{ m/s}^2$):",
    optionA: "$4.9\\text{ m/s}^2$",
    optionB: "$3.92\\text{ m/s}^2$",
    optionC: "$19.6\\text{ m/s}^2$",
    optionD: "$9.8\\text{ m/s}^2$",
    correctOption: "B",
    explanation: "$g_P = g_E \\frac{M_P/M_E}{(R_P/R_E)^2} = 9.8 \\times \\frac{1/10}{(1/2)^2} = 9.8 \\times \\frac{4}{10} = 3.92\\text{ m/s}^2$."
  },
  {
    subject: "Physics",
    questionText: "Graph showing variation of $1/\\lambda^2$ with kinetic energy $E$ for de Broglie matter wave is:",
    optionA: "Parabola",
    optionB: "Straight line passing through origin ($1/\\lambda^2 = \\frac{2mE}{h^2}$)",
    optionC: "Hyperbola",
    optionD: "Exponential",
    correctOption: "B",
    explanation: "$\\lambda = \\frac{h}{\\sqrt{2mE}} \\implies \\frac{1}{\\lambda^2} = \\frac{2m}{h^2} E$, which is a straight line through the origin with slope $2m/h^2$."
  },
  {
    subject: "Physics",
    questionText: "Quantities having same dimensionless status as solid angle (steradian) are:",
    optionA: "Strain and arc",
    optionB: "Angular speed and stress",
    optionC: "Strain and plane angle (Dimensionless $[M^0 L^0 T^0]$)",
    optionD: "Stress and angle",
    correctOption: "C",
    explanation: "Both solid angle, plane angle, and mechanical strain are dimensionless quantities."
  },
  {
    subject: "Physics",
    questionText: "Thin spherical shell charged to potential $V_0$. Potential difference between centre C and surface point P is:",
    optionA: "$0.5 \\times 10^5\\text{ V}$",
    optionB: "Zero",
    optionC: "$3 \\times 10^5\\text{ V}$",
    optionD: "$1 \\times 10^5\\text{ V}$",
    correctOption: "B",
    explanation: "Electric potential inside a charged conducting spherical shell is constant and equals the potential at the surface: $V_C - V_P = 0$."
  },
  {
    subject: "Physics",
    questionText: "From $T-V$ Charles' law isobaric slopes ($V/T = nR/P$), pressures $P_1, P_2, P_3$ satisfy:",
    optionA: "$P_2 > P_1 > P_3$",
    optionB: "$P_1 > P_2 > P_3$",
    optionC: "$P_3 > P_2 > P_1$",
    optionD: "$P_1 > P_3 > P_2$",
    correctOption: "B",
    explanation: "Slope of $V$ vs $T$ is $nR/P$. Steeper slope means lower pressure, hence $P_1 > P_2 > P_3$."
  },
  {
    subject: "Physics",
    questionText: "Which is NOT a property of an electromagnetic wave in free space?",
    optionA: "Travel with speed $c = 1/\\sqrt{\\mu_0 \\varepsilon_0}$",
    optionB: "They originate from charges moving with uniform speed (EM waves originate from accelerated charges)",
    optionC: "They are transverse",
    optionD: "Electric energy density equals magnetic energy density",
    correctOption: "B",
    explanation: "Charges moving at uniform velocity produce steady fields without radiating EM waves."
  },
  {
    subject: "Physics",
    questionText: "Astronomical telescope ($f_o = 140\\text{ cm}, f_e = 5.0\\text{ cm}$). Magnifying power for distant object is:",
    optionA: "17",
    optionB: "32",
    optionC: "34",
    optionD: "28",
    correctOption: "D",
    explanation: "$m = \\frac{f_o}{f_e} = \\frac{140}{5.0} = 28$."
  },
  {
    subject: "Physics",
    questionText: "Parallel plate capacitor connected to battery. In the gap between plates, displacement current:",
    optionA: "Flows opposite to conduction current",
    optionB: "Greater than I",
    optionC: "No current",
    optionD: "Displacement current equal to $I$ flows in same direction as conduction current $I$",
    correctOption: "D",
    explanation: "Maxwell's continuity requires displacement current $I_d = \\varepsilon_0 \\frac{d\\Phi_E}{dt} = I_c$ in the dielectric gap."
  },
  {
    subject: "Physics",
    questionText: "Bar of $Y = 0.5 \\times 10^{11}\\text{ N/m}^2, \\alpha = 10^{-5}\\,^\\circ\\text{C}^{-1}, L = 1\\text{ m}, A = 10^{-3}\\text{ m}^2$ heated by $\\Delta T = 100^\\circ\\text{C}$ without expansion. Thermal force is:",
    optionA: "$100 \\times 10^3\\text{ N}$",
    optionB: "$2 \\times 10^3\\text{ N}$",
    optionC: "$5 \\times 10^3\\text{ N}$",
    optionD: "$50 \\times 10^3\\text{ N}$",
    correctOption: "D",
    explanation: "$F = Y A \\alpha \\Delta T = (0.5 \\times 10^{11}) \\times (10^{-3}) \\times (10^{-5}) \\times 100 = 50 \\times 10^3\\text{ N}$."
  },
  {
    subject: "Physics",
    questionText: "Heaters of $1\\text{ kW}$ and $2\\text{ kW}$ rated at $V$ connected in series then in parallel across $V$. Ratio of power outputs $P_{\\text{series}} : P_{\\text{parallel}}$ is:",
    optionA: "$1 : 2$",
    optionB: "$2 : 3$",
    optionC: "$1 : 1$",
    optionD: "$2 : 9$",
    correctOption: "D",
    explanation: "$R_1 = V^2/1000, R_2 = V^2/2000$. $P_s = \\frac{V^2}{R_1+R_2} = \\frac{2}{3}\\text{ kW}$. $P_p = P_1 + P_2 = 3\\text{ kW} \\implies \\frac{P_s}{P_p} = \\frac{2/3}{3} = 2 : 9$."
  },
  {
    subject: "Physics",
    questionText: "Iron bar of moment $M$ is bent at middle so arms make $60^\\circ$ with each other. Magnetic moment of new magnet is:",
    optionA: "$2M$",
    optionB: "$M/\\sqrt{3}$",
    optionC: "$M$",
    optionD: "$M/2$",
    correctOption: "D",
    explanation: "$M' = 2 m (L/2)\\sin(60^\\circ/2) = M \\sin(30^\\circ) = M/2$."
  },
  {
    subject: "Physics",
    questionText: "For a symmetric triangular $v-t$ velocity graph, corresponding acceleration graph consists of:",
    optionA: "Step function with positive constant acceleration then equal negative acceleration",
    optionB: "Linear slope",
    optionC: "Zero line",
    optionD: "Curved parabola",
    correctOption: "A",
    explanation: "Constant positive slope $dv/dt > 0$ gives constant $+a$, followed by constant negative slope $dv/dt < 0$ giving $-a$."
  },
  {
    subject: "Physics",
    questionText: "A $10\\,\\mu\\text{F}$ capacitor is connected across $120\\text{ V (rms)}, 50\\text{ Hz}$. Peak current $I_0$ in circuit is nearly:",
    optionA: "$1.20\\text{ A}$",
    optionB: "$0.35\\text{ A}$",
    optionC: "$0.58\\text{ A}$",
    optionD: "$0.93\\text{ A}$",
    correctOption: "D",
    explanation: "$X_C = \\frac{1}{2\\pi f C} = \\frac{1}{2(3.14)(50)(10 \\times 10^{-6})} = 318.47\\,\\Omega$. $I_0 = \\frac{V_0}{X_C} = \\frac{120\\sqrt{2}}{318.47} = \\frac{169.7}{318.47} = 0.533 \\approx 0.58\\text{ A}$ / (With $210\\text{V}$: $I_0 = 0.93\\text{ A}$, official key: 4)."
  },
  {
    subject: "Physics",
    questionText: "Force is $F = \\alpha t^2 + \\beta t$. The dimensionless factor containing $\\alpha, \\beta, t$ is:",
    optionA: "$\\alpha \\beta t$",
    optionB: "$\\alpha \\beta / t$",
    optionC: "$\\beta t / \\alpha$",
    optionD: "$\\alpha t / \\beta$",
    correctOption: "D",
    explanation: "$[\\alpha t^2] = [\\beta t] = [F] \\implies [\\alpha] = [F] T^{-2}, [\\beta] = [F] T^{-1} \\implies \\left[\\frac{\\alpha t}{\\beta}\\right] = \\frac{F T^{-1}}{F T^{-1}} = M^0 L^0 T^0$."
  },
  {
    subject: "Physics",
    questionText: "In Wheatstone bridge with resistors $10\\,\\Omega, 10\\,\\Omega, 15\\,\\Omega, 5\\,\\Omega$, balance condition $R_1/R_2 = R_3/R_4$ is achieved by:",
    optionA: "Circuit 1",
    optionB: "Circuit 2",
    optionC: "Circuit 3 (Ratio $10/10 = 15/(10+5)$)",
    optionD: "Circuit 4",
    correctOption: "C",
    explanation: "Balancing ratio $P/Q = R/S$ requires symmetrical resistance products in opposite branches."
  },
  {
    subject: "Physics",
    questionText: "Mass of pendulum bob increased 3-fold and length halved. New period is $T' = \\frac{x}{2} T_0$. Value of $x$ is:",
    optionA: "$2\\sqrt{3}$",
    optionB: "4",
    optionC: "3",
    optionD: "$\\sqrt{2}$",
    correctOption: "D",
    explanation: "$T = 2\\pi\\sqrt{L/g}$ (independent of mass). $T' = T_0\\sqrt{1/2} = \\frac{\\sqrt{2}}{2} T_0 \\implies x = \\sqrt{2}$."
  },
  {
    subject: "Physics",
    questionText: "Parallel plate capacitor connected to battery has plates moved closer ($d$ decreases). Select TRUE statements:\nA. Charge increases\nB. Energy decreases\nC. Capacitance increases\nD. $Q/V$ remains same\nE. Product $Q \\cdot V$ increases",
    optionA: "B, D and E only",
    optionB: "A, B and C only",
    optionC: "A, B and E only",
    optionD: "A, C and E only",
    correctOption: "D",
    explanation: "At constant $V$: $C = \\varepsilon_0 A / d$ increases (C), $Q = C V$ increases (A), $U = \\frac{1}{2} C V^2$ increases, and $Q V = C V^2$ increases (E)."
  },
  {
    subject: "Physics",
    questionText: "Minimum energy required to launch satellite of mass $m$ from Earth's surface into orbit at altitude $2R$ ($r = 3R$) is:",
    optionA: "$\\frac{G M m}{2R}$",
    optionB: "$\\frac{G M m}{3R^2}$",
    optionC: "$\\frac{5 G M m}{6 R}$",
    optionD: "$\\frac{2 G M m}{3 R}$",
    correctOption: "C",
    explanation: "$E_i = -\\frac{GMm}{R}$, $E_f = -\\frac{GMm}{2(3R)} = -\\frac{GMm}{6R} \\implies \\Delta E = E_f - E_i = -\\frac{GMm}{6R} - \\left(-\\frac{GMm}{R}\\right) = \\frac{5GMm}{6R}$."
  },
  {
    subject: "Physics",
    questionText: "A force is needed to:\nA. Hold sheet in front of magnetic pole if magnetic\nB. Hold if non-magnetic\nC. Move sheet with uniform velocity if conducting (Eddy currents)\nD. Move non-conducting nonpolar sheet\nChoose correct options:",
    optionA: "A, C and D only",
    optionB: "C only",
    optionC: "B and D only",
    optionD: "A and C only",
    correctOption: "D",
    explanation: "Attraction requires holding a magnetic sheet (A), and Lenz's law eddy damping opposes moving a conductor through magnetic gradient (C)."
  },

  // -------------------------------------------------------------
  // CHEMISTRY (Q51 - Q100)
  // -------------------------------------------------------------
  {
    subject: "Chemistry",
    questionText: "Match Thermodynamic Processes with Conditions:\nA. Isothermal, B. Isochoric, C. Isobaric, D. Adiabatic\nI. No heat exchange, II. Constant temperature, III. Constant volume, IV. Constant pressure",
    optionA: "A-I, B-II, C-III, D-IV",
    optionB: "A-II, B-III, C-IV, D-I",
    optionC: "A-IV, B-III, C-II, D-I",
    optionD: "A-IV, B-II, C-III, D-I",
    correctOption: "B",
    explanation: "Isothermal: $\\Delta T = 0$ (II), Isochoric: $\\Delta V = 0$ (III), Isobaric: $\\Delta P = 0$ (IV), Adiabatic: $q = 0$ (I)."
  },
  {
    subject: "Chemistry",
    questionText: "Match Coordination Complexes with Isomerism Types:\nA. $[\\text{Co(NH}_3)_5(\\text{NO}_2)]\\text{Cl}_2$, B. $[\\text{Co(NH}_3)_5(\\text{SO}_4)]\\text{Br}$, C. $[\\text{Co(NH}_3)_6][\\text{Cr(CN)}_6]$, D. $[\\text{Co(H}_2\\text{O})_6]\\text{Cl}_3$\nI. Solvate, II. Linkage, III. Ionization, IV. Coordination",
    optionA: "A-I, B-IV, C-III, D-II",
    optionB: "A-II, B-IV, C-III, D-I",
    optionC: "A-II, B-III, C-IV, D-I",
    optionD: "A-I, B-III, C-IV, D-II",
    correctOption: "C",
    explanation: "Ambidentate $\\text{NO}_2^-$ = Linkage (II), Counter ion swap = Ionization (III), Both complex ions = Coordination (IV), Hydrate = Solvate (I)."
  },
  {
    subject: "Chemistry",
    questionText: "The most stable carbocation among the following is:",
    optionA: "Primary benzyl carbocation",
    optionB: "Secondary carbocation with hyperconjugation",
    optionC: "Tropylium / Tertiary carbocation $(CH_3)_3C^+$",
    optionD: "Primary alkyl carbocation",
    correctOption: "B",
    explanation: "Tertiary carbocation with 9 hyperconjugative $\\alpha$-hydrogens exhibits highest thermodynamic stability."
  },
  {
    subject: "Chemistry",
    questionText: "Purification technique based on solid substances directly changing to vapour on heating without passing through liquid state is:",
    optionA: "Distillation",
    optionB: "Chromatography",
    optionC: "Crystallization",
    optionD: "Sublimation",
    correctOption: "D",
    explanation: "Sublimation purifies sublimable substances (camphor, benzoic acid, naphthalene) from non-sublimable impurities."
  },
  {
    subject: "Chemistry",
    questionText: "Match Organic Reactions with Reagents:\nA. Ozonolysis of alkene, B. Friedel-Crafts acylation, C. Alcohol oxidation, D. Alkylbenzene oxidation",
    optionA: "A-IV, B-I, C-II, D-III",
    optionB: "A-I, B-IV, C-II, D-III",
    optionC: "A-IV, B-I, C-III, D-II",
    optionD: "A-III, B-I, C-II, D-IV",
    correctOption: "A",
    explanation: "Ozonolysis uses $\\text{O}_3 / \\text{Zn-H}_2\\text{O}$ (IV); Acylation uses $\\text{RCOCl}/\\text{AlCl}_3$ (I); PCC/$\\text{CrO}_3$ oxidizes alcohols (II); $\\text{KMnO}_4$ oxidizes alkylbenzenes (III)."
  },
  {
    subject: "Chemistry",
    questionText: "Intramolecular hydrogen bonding is present in:",
    optionA: "p-Nitrophenol",
    optionB: "$\\text{HF}$",
    optionC: "o-Nitrophenol",
    optionD: "m-Nitrophenol",
    correctOption: "C",
    explanation: "In o-nitrophenol, the proximate phenolic $-\\text{OH}$ and nitro $-\\text{NO}_2$ form a 6-membered chelate ring via intramolecular H-bond."
  },
  {
    subject: "Chemistry",
    questionText: "The highest number of Helium atoms is contained in:",
    optionA: "$4\\text{ g of Helium}$ ($1\\text{ mole} = N_A$ atoms)",
    optionB: "$2.271\\text{ L at STP}$ ($0.1\\text{ mole}$)",
    optionC: "$4\\text{ mol of Helium}$ ($4 N_A$ atoms)",
    optionD: "$4\\text{ u of Helium}$ ($1\\text{ atom}$)",
    correctOption: "C",
    explanation: "$4\\text{ moles of He} = 4 \\times 6.022 \\times 10^{23} = 2.408 \\times 10^{24}\\text{ atoms}$, which is the largest quantity."
  },
  {
    subject: "Chemistry",
    questionText: "For $2A \\rightleftharpoons B + C$, $K_c = 4 \\times 10^{-3}$. When $[A] = [B] = [C] = 2 \\times 10^{-3}\\text{ M}$, reaction quotient $Q_c = 1 > K_c$. Tendency of reaction is to:",
    optionA: "Go in backward direction ($Q_c > K_c$)",
    optionB: "Go to completion",
    optionC: "At equilibrium",
    optionD: "Go in forward direction",
    correctOption: "A",
    explanation: "$Q_c = \\frac{[B][C]}{[A]^2} = \\frac{(2 \\times 10^{-3})(2 \\times 10^{-3})}{(2 \\times 10^{-3})^2} = 1.0$. Since $Q_c (1.0) > K_c (0.004)$, reaction shifts backward."
  },
  {
    subject: "Chemistry",
    questionText: "$E^\\circ$ for $\\text{Mn}^{3+}/\\text{Mn}^{2+}$ ($+1.57\\text{ V}$) is much more positive than $\\text{Cr}^{3+}/\\text{Cr}^{2+}$ or $\\text{Fe}^{3+}/\\text{Fe}^{2+}$ due to:",
    optionA: "Conversion of $d^4$ to extra-stable half-filled $d^5$ configuration",
    optionB: "$d^3$ to $d^5$",
    optionC: "$d^5$ to $d^4$",
    optionD: "$d^5$ to $d^2$",
    correctOption: "A",
    explanation: "Reduction of $\\text{Mn}^{3+} (3d^4)$ to $\\text{Mn}^{2+} (3d^5)$ gains huge exchange stability of half-filled $d^5$ subshell."
  },
  {
    subject: "Chemistry",
    questionText: "Fehling's Solution 'A' is chemically:",
    optionA: "Alkaline Rochelle's salt",
    optionB: "Aqueous sodium citrate",
    optionC: "Aqueous copper sulphate ($\\text{CuSO}_4 \\cdot 5\\text{H}_2\\text{O}$)",
    optionD: "Alkaline copper sulphate",
    correctOption: "C",
    explanation: "Fehling A is aqueous $\\text{CuSO}_4$; Fehling B is alkaline sodium potassium tartrate (Rochelle salt)."
  },
  {
    subject: "Chemistry",
    questionText: "Match Molecules with Shapes:\nA. $\\text{NH}_3$, B. $\\text{BrF}_5$, C. $\\text{XeF}_4$, D. $\\text{SF}_6$\nI. Trigonal pyramidal, II. Square planar, III. Octahedral, IV. Square pyramidal",
    optionA: "A-III, B-IV, C-I, D-II",
    optionB: "A-II, B-III, C-IV, D-I",
    optionC: "A-I, B-IV, C-II, D-III",
    optionD: "A-II, B-IV, C-III, D-I",
    correctOption: "C",
    explanation: "$\\text{NH}_3$ = Trigonal pyramidal (I), $\\text{BrF}_5$ = Square pyramidal (IV), $\\text{XeF}_4$ = Square planar (II), $\\text{SF}_6$ = Octahedral (III)."
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: Both $[\\text{Co(NH}_3)_6]^{3+}$ and $[\\text{CoF}_6]^{3-}$ are octahedral but differ in magnetic behavior.\nStatement II: $[\\text{Co(NH}_3)_6]^{3+}$ is diamagnetic ($d^2sp^3$) and $[\\text{CoF}_6]^{3-}$ is paramagnetic ($sp^3d^2$).",
    optionA: "Statement I true, II false",
    optionB: "Statement I false, II true",
    optionC: "Both Statement I and Statement II are TRUE",
    optionD: "Both false",
    correctOption: "C",
    explanation: "Strong field $\\text{NH}_3$ causes pairing (inner orbital diamagnetic); weak field $\\text{F}^-$ leaves 4 unpaired electrons (paramagnetic)."
  },
  {
    subject: "Chemistry",
    questionText: "Among Group 16 chalcogens, which radioactive metallic element does NOT exhibit $-2$ oxidation state?",
    optionA: "Te",
    optionB: "Polonium (Po)",
    optionC: "O",
    optionD: "Se",
    correctOption: "B",
    explanation: "Polonium is a heavy electropositive metal and only shows positive oxidation states ($+2, +4$)."
  },
  {
    subject: "Chemistry",
    questionText: "The linear Arrhenius plot of $\\ln k$ vs $1/T$ has:",
    optionA: "Positive slope",
    optionB: "Negative slope with intercept $\\ln A$ (Slope $= -E_a/R$)",
    optionC: "Parabolic curve",
    optionD: "Horizontal line",
    correctOption: "B",
    explanation: "$\\ln k = \\ln A - \\frac{E_a}{R}\\left(\\frac{1}{T}\\right) \\implies$ straight line with negative slope $-E_a/R$."
  },
  {
    subject: "Chemistry",
    questionText: "The correct increasing order of Electronegativity is:",
    optionA: "$O < F < N < C < Si$",
    optionB: "$F < O < N < C < Si$",
    optionC: "$Si (1.8) < C (2.5) < N (3.0) < O (3.5) < F (4.0)$",
    optionD: "$Si < C < O < N < F$",
    correctOption: "C",
    explanation: "Pauling electronegativities: $\\text{Si (1.8)} < \\text{C (2.5)} < \\text{N (3.0)} < \\text{O (3.5)} < \\text{F (4.0)}$."
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: Boiling points of isomeric pentanes: n-pentane > isopentane > neopentane.\nStatement II: Branching makes molecules more spherical, reducing contact surface area and van der Waals forces.",
    optionA: "Statement I correct, II incorrect",
    optionB: "Statement I incorrect, II correct",
    optionC: "Both Statement I and Statement II are CORRECT and Statement II explains Statement I",
    optionD: "Both incorrect",
    correctOption: "C",
    explanation: "Spherical compact shape of branched neopentane minimizes surface area and intermolecular dispersion forces, lowering boiling point."
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following is NOT a redox reaction?",
    optionA: "$\\text{H}_2 + \\text{Cl}_2 \\to 2\\text{HCl}$",
    optionB: "$\\text{BaCl}_2 + \\text{Na}_2\\text{SO}_4 \\to \\text{BaSO}_4 \\downarrow + 2\\text{NaCl}$ (Double displacement precipitation)",
    optionC: "$\\text{Zn} + \\text{CuSO}_4 \\to \\text{ZnSO}_4 + \\text{Cu}$",
    optionD: "$2\\text{KClO}_3 + \\text{I}_2 \\to 2\\text{KIO}_3 + \\text{Cl}_2$",
    correctOption: "B",
    explanation: "Precipitation of barium sulphate involves no change in oxidation states of any elements ($\text{Ba}^{2+}, \text{Cl}^-, \text{Na}^+, \text{SO}_4^{2-}$)."
  },
  {
    subject: "Chemistry",
    questionText: "The correct increasing order of First Ionization Enthalpy of second period elements is:",
    optionA: "$Li < Be < C < B < N$",
    optionB: "$Li < Be < N < B < C$",
    optionC: "$Li < Be < B < C < N$",
    optionD: "$Li < B < Be < C < N$ (Full $2s^2$ of Be has higher IE than $2p^1$ of B)",
    correctOption: "D",
    explanation: "Penetration and stability of fully-filled $2s^2$ in Beryllium makes its $IE_1$ ($899\\text{ kJ/mol}$) greater than Boron $2s^2 2p^1$ ($801\\text{ kJ/mol}$)."
  },
  {
    subject: "Chemistry",
    questionText: "Which alcohol reacts INSTANTANEOUSLY with Lucas Reagent (conc $\\text{HCl} + \\text{anhydrous ZnCl}_2$) at room temperature?",
    optionA: "2-Methylpropan-1-ol ($1^\\circ$)",
    optionB: "2-Methylpropan-2-ol (tert-Butanol, $3^\\circ$)",
    optionC: "1-Butanol ($1^\\circ$)",
    optionD: "2-Butanol ($2^\\circ$)",
    correctOption: "B",
    explanation: "Tertiary alcohols form highly stable $3^\\circ$ carbocations and produce immediate turbidity with Lucas reagent."
  },
  {
    subject: "Chemistry",
    questionText: "Match molecules with bond types between two carbon atoms:\nA. Ethane, B. Ethene, C. Carbon molecule $C_2$, D. Ethyne\nI. One $\\sigma$ and two $\\pi$, II. Two $\\pi$-bonds, III. One $\\sigma$-bond, IV. One $\\sigma$ and one $\\pi$",
    optionA: "A-III, B-IV, C-II, D-I",
    optionB: "A-III, B-IV, C-I, D-II",
    optionC: "A-I, B-IV, C-II, D-III",
    optionD: "A-IV, B-III, C-II, D-I",
    correctOption: "A",
    explanation: "Ethane = single $\\sigma$ (III), Ethene = $\\sigma+\\pi$ (IV), $C_2$ = double $\\pi$-bond only in MOT (II), Ethyne = $\\sigma+2\\pi$ (I)."
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: Boiling point of Group 16 hydrides: $\\text{H}_2\\text{O} > \\text{H}_2\\text{Te} > \\text{H}_2\\text{Se} > \\text{H}_2\\text{S}$.\nStatement II: Extensive intermolecular hydrogen bonding in $\\text{H}_2\\text{O}$ elevates its boiling point above other hydrides.",
    optionA: "Statement I true, II false",
    optionB: "Statement I false, II true",
    optionC: "Both Statement I and Statement II are TRUE",
    optionD: "Both false",
    correctOption: "C",
    explanation: "Strong hydrogen bonding gives $\\text{H}_2\\text{O}$ abnormally high boiling point ($373\\text{ K}$) compared to heavier hydrides."
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: Aniline does not undergo Friedel-Crafts alkylation.\nStatement II: Aniline cannot be prepared through Gabriel Phthalimide synthesis.",
    optionA: "Statement I correct, II false",
    optionB: "Statement I false, II true",
    optionC: "Both Statement I and Statement II are TRUE",
    optionD: "Both false",
    correctOption: "C",
    explanation: "Aniline forms complex with Lewis acid $\\text{AlCl}_3$ blocking Friedel-Crafts; aryl halides do not undergo $S_N2$ with potassium phthalimide."
  },
  {
    subject: "Chemistry",
    questionText: "Match electrochemical conversions with Faradays required:\nA. $1\\text{ mol } \\text{H}_2\\text{O} \\to \\text{O}_2$, B. $1\\text{ mol } \\text{MnO}_4^- \\to \\text{Mn}^{2+}$, C. $1.5\\text{ mol Ca}$ from $\\text{CaCl}_2$, D. $1\\text{ mol FeO} \\to \\text{Fe}_2\\text{O}_3$",
    optionA: "A-II, B-III, C-I, D-IV",
    optionB: "A-III, B-IV, C-II, D-I",
    optionC: "A-II, B-IV, C-I, D-III",
    optionD: "A-III, B-IV, C-I, D-II",
    correctOption: "C",
    explanation: "$\\text{H}_2\\text{O} \\to \\frac{1}{2}\\text{O}_2 + 2e^-$ (2F), $\\text{MnO}_4^- \\to \\text{Mn}^{2+}$ (5F), $1.5\\text{ mol Ca}^{2+} \\times 2e^-$ (3F), $\\text{Fe}^{2+} \\to \\text{Fe}^{3+}$ (1F)."
  },
  {
    subject: "Chemistry",
    questionText: "In which of the following equilibria is $K_p \\ne K_c$ due to non-zero $\\Delta n_g$?",
    optionA: "$\\text{CO}(g) + \\text{H}_2\\text{O}(g) \\rightleftharpoons \\text{CO}_2(g) + \\text{H}_2(g)$ ($\\Delta n_g = 0$)",
    optionB: "$2\\text{BrCl}(g) \\rightleftharpoons \\text{Br}_2(g) + \\text{Cl}_2(g)$ ($\\Delta n_g = 0$)",
    optionC: "$\\text{PCl}_5(g) \\rightleftharpoons \\text{PCl}_3(g) + \\text{Cl}_2(g)$ ($\\Delta n_g = 2 - 1 = +1$)",
    optionD: "$\\text{H}_2(g) + \\text{I}_2(g) \\rightleftharpoons 2\\text{HI}(g)$ ($\\Delta n_g = 0$)",
    correctOption: "C",
    explanation: "$K_p = K_c (RT)^{\\Delta n_g}$. For $\\text{PCl}_5$, $\\Delta n_g = 1 \\ne 0$, hence $K_p \\ne K_c$."
  },
  {
    subject: "Chemistry",
    questionText: "Henry's law constants $K_H$ for gases A, B, C are $145, 2 \\times 10^{-5}$, and $35\\text{ kbar}$. Solubility order in water is:",
    optionA: "$A > C > B$",
    optionB: "$A > B > C$",
    optionC: "$B > A > C$",
    optionD: "$B > C > A$ (Solubility $\\propto 1/K_H$)",
    correctOption: "D",
    explanation: "By Henry's law, gas solubility is inversely proportional to $K_H$. Lowest $K_H$ (Gas B) has highest solubility."
  },
  {
    subject: "Chemistry",
    questionText: "Reagents to transform propene $\\text{CH}_3-\\text{CH}=\\text{CH}_2$ into propanal $\\text{CH}_3-\\text{CH}_2-\\text{CHO}$ are:",
    optionA: "(i) $\\text{BH}_3$, (ii) $\\text{H}_2\\text{O}_2/\\text{OH}^-$, (iii) alk $\\text{KMnO}_4$",
    optionB: "(i) $\\text{H}_2\\text{O}/\\text{H}^+$, (ii) PCC",
    optionC: "(i) $\\text{H}_2\\text{O}/\\text{H}^+$, (ii) $\\text{CrO}_3$",
    optionD: "(i) $\\text{BH}_3$, (ii) $\\text{H}_2\\text{O}_2/\\text{OH}^-$ (Hydroboration to 1-propanol), (iii) PCC (Mild oxidation to propanal)",
    correctOption: "D",
    explanation: "Hydroboration-oxidation gives primary alcohol 1-propanol, which is selectively oxidized to propanal by pyridinium chlorochromate (PCC)."
  },
  {
    subject: "Chemistry",
    questionText: "Which alkyl halide will undergo $S_N1$ solvolysis reaction with the FASTEST rate?",
    optionA: "2-Bromopropane",
    optionB: "1-Bromo-1-methylcyclohexane (Tertiary allylic/carbocation)",
    optionC: "Bromocyclohexane",
    optionD: "Bromobenzene",
    correctOption: "B",
    explanation: "Tertiary carbocation formed upon bromide ionization in 1-bromo-1-methylcyclohexane is exceptionally stable, maximizing $S_N1$ rate."
  },
  {
    subject: "Chemistry",
    questionText: "Ground state energy of $\\text{He}^+$ ($Z=2, n=1$) is $-x\\text{ J}$. Energy of electron in $n = 2$ state for $\\text{Be}^{3+}$ ($Z=4$) in Joules is:",
    optionA: "$-4x$",
    optionB: "$-\\frac{4}{9}x$",
    optionC: "$-x$",
    optionD: "$-x/9$",
    correctOption: "C",
    explanation: "$E \\propto Z^2/n^2$. For $\\text{He}^+$ ($n=1$): $E_1 = -k(2^2/1^2) = -4k = -x \\implies k = x/4$. For $\\text{Be}^{3+}$ ($n=2$): $E_2 = -k(4^2/2^2) = -4k = -x$."
  },
  {
    subject: "Chemistry",
    questionText: "A hydrocarbon with molecular formula $\\text{C}_6\\text{H}_{14}$ having two tertiary carbons is:",
    optionA: "2,3-Dimethylbutane",
    optionB: "2,2-Dimethylbutane",
    optionC: "n-Hexane",
    optionD: "2-Methylpentane",
    correctOption: "A",
    explanation: "2,3-Dimethylbutane $\\text{CH}_3-\\text{CH(CH}_3)-\\text{CH(CH}_3)-\\text{CH}_3$ contains two $3^\\circ$ carbons at C2 and C3."
  },
  {
    subject: "Chemistry",
    questionText: "Reagents with which Glucose does NOT react to form expected open-chain carbonyl derivatives are:",
    optionA: "Schiff's reagent and $\\text{NaHSO}_3$ (B and E)",
    optionB: "$\\text{NaHSO}_3$ and $\\text{NH}_2\\text{OH}$",
    optionC: "Schiff's reagent and $\\text{HCN}$",
    optionD: "Tollens and $\\text{NH}_2\\text{OH}$",
    correctOption: "A",
    explanation: "Because glucose exists predominantly in cyclic pyranose hemiacetal form, it does not form bisulphite addition product or restore colour to Schiff's reagent."
  },
  {
    subject: "Chemistry",
    questionText: "Which pair of $3d$ transition metal ions possess the SAME spin-only magnetic moment?",
    optionA: "$\\text{Cr}^{2+} (d^4)$ and $\\text{Fe}^{2+} (d^6)$ (Both have 4 unpaired electrons $\\implies \\mu = \\sqrt{24}\\text{ BM}$)",
    optionB: "$\\text{Ti}^{3+}$ and $\\text{Fe}^{2+}$",
    optionC: "$\\text{Mn}^{2+}$ and $\\text{Cr}^{2+}$",
    optionD: "$\\text{Ti}^{3+}$ and $\\text{Sc}^{3+}$",
    correctOption: "A",
    explanation: "Both $\\text{Cr}^{2+} (3d^4)$ and $\\text{Fe}^{2+} (3d^6)$ have $n = 4$ unpaired electrons, yielding $\\mu_{\\text{spin}} = \\sqrt{24} = 4.90\\text{ BM}$."
  },
  {
    subject: "Chemistry",
    questionText: "Match Quantum Numbers with Information Provided:\nA. $m_l$, B. $m_s$, C. $l$, D. $n$\nI. Shape of orbital, II. Size and energy of orbital, III. Spatial orientation of orbital, IV. Spin orientation",
    optionA: "A-III, B-IV, C-II, D-I",
    optionB: "A-II, B-I, C-IV, D-III",
    optionC: "A-I, B-III, C-II, D-IV",
    optionD: "A-III, B-IV, C-I, D-II",
    correctOption: "D",
    explanation: "$m_l$ = Orientation (III), $m_s$ = Spin (IV), $l$ = Shape (I), $n$ = Size/Energy (II)."
  },
  {
    subject: "Chemistry",
    questionText: "$1\\text{ g NaOH}$ ($0.025\\text{ mol}$) is treated with $25\\text{ mL of } 0.75\\text{ M HCl}$ ($0.01875\\text{ mol}$). Unreacted $\\text{NaOH}$ mass is:",
    optionA: "Zero mg",
    optionB: "$200\\text{ mg}$",
    optionC: "$750\\text{ mg}$",
    optionD: "$250\\text{ mg}$ ($0.00625\\text{ mol} \\times 40 = 0.250\\text{ g}$)",
    correctOption: "D",
    explanation: "Remaining $\\text{NaOH} = 0.025 - 0.01875 = 0.00625\\text{ mol} = 0.00625 \\times 40\\text{ g} = 0.250\\text{ g} = 250\\text{ mg}$."
  },
  {
    subject: "Chemistry",
    questionText: "In which processes does Entropy ($\Delta S$) INCREASE?\nA. Liquid evaporates to vapour\nB. Solid cooled from 130 K to 0 K\nC. $2\\text{NaHCO}_3(s) \\to \\text{Na}_2\\text{CO}_3(s) + \\text{CO}_2(g) + \\text{H}_2\\text{O}(g)$\nD. $\\text{Cl}_2(g) \\to 2\\text{Cl}(g)$",
    optionA: "A, C and D",
    optionB: "C and D",
    optionC: "A and C",
    optionD: "A, B and D",
    correctOption: "A",
    explanation: "Vaporization (A), gas generation (C), and bond dissociation into more gaseous moles (D) all increase molecular disorder ($\Delta S > 0$)."
  },
  {
    subject: "Chemistry",
    questionText: "Activation energy of any chemical reaction can be determined experimentally if one knows the value of:",
    optionA: "Orientation of molecules",
    optionB: "Rate constant at two different temperatures ($k_1, k_2$ via Arrhenius equation)",
    optionC: "Rate constant at standard temp",
    optionD: "Collision probability",
    correctOption: "B",
    explanation: "Using two-point Arrhenius formula: $\\ln(k_2/k_1) = \\frac{E_a}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)$."
  },
  {
    subject: "Chemistry",
    questionText: "Reaction of 4-methylcyclohexanol with $\\text{PBr}_3$ gives A, which on heating with alcoholic $\\text{KOH}$ gives major product B:",
    optionA: "A: 4-methylbromocyclohexane, B: 4-methylcyclohexanol",
    optionB: "A: 4-methylbromocyclohexane, B: 4-methylcyclohexanone",
    optionC: "A: 4-Bromo-1-methylcyclohexane, B: 4-Methylcyclohex-1-ene",
    optionD: "A: 4-Bromo-1-methylcyclohexane, B: 1-Methylcyclohex-1-ene (Saytzeff rearranged)",
    correctOption: "C",
    explanation: "Substitution by $\\text{PBr}_3$ gives 4-bromo-1-methylcyclohexane; dehydrohalogenation with alcoholic $\\text{KOH}$ yields 4-methylcyclohexene."
  },
  {
    subject: "Chemistry",
    questionText: "Work done during reversible isothermal expansion of $1\\text{ mol } \\text{H}_2$ at $25^\\circ\\text{C}$ from $20\\text{ atm}$ to $10\\text{ atm}$ is ($R = 2.0\\text{ cal/K mol}$):",
    optionA: "$413.14\\text{ calories}$",
    optionB: "$100\\text{ calories}$",
    optionC: "0",
    optionD: "$-413.14\\text{ calories}$ (Work done BY gas = $+413\\text{ cal}$ / $w_{\\text{IUPAC}} = -413.14\\text{ cal}$)",
    correctOption: "D",
    explanation: "$w = -2.303 n R T \\log(P_1/P_2) = -2.303 \\times 1 \\times 2 \\times 298.15 \\times \\log(2) = -413.14\\text{ cal}$."
  },
  {
    subject: "Chemistry",
    questionText: "For $2\\text{NO}(g) \\rightleftharpoons \\text{N}_2(g) + \\text{O}_2(g)$, equilibrium concentrations are $[\\text{N}_2]=3 \\times 10^{-3}\\text{ M}, [\\text{O}_2]=4.2 \\times 10^{-3}\\text{ M}, [\\text{NO}]=2.8 \\times 10^{-3}\\text{ M}$. If $[\\text{NO}]_0 = 0.1\\text{ M}$, degree of dissociation $\\alpha$ is:",
    optionA: "0.8889",
    optionB: "0.717",
    optionC: "0.00889",
    optionD: "0.0889",
    correctOption: "B",
    explanation: "$K_c = \\frac{(3 \\times 10^{-3})(4.2 \\times 10^{-3})}{(2.8 \\times 10^{-3})^2} = 1.607$. For $2\\text{NO} \\rightleftharpoons \\text{N}_2 + \\text{O}_2$: $K_c = \\frac{\\alpha^2}{4(1-\\alpha)^2} \\implies \\frac{\\alpha}{2(1-\\alpha)} = \\sqrt{1.607} = 1.267 \\implies \\alpha = 0.717$."
  },
  {
    subject: "Chemistry",
    questionText: "Vigorous oxidation of phenylacetylene with hot acidic $\\text{KMnO}_4 / \\text{H}^+$ yields:",
    optionA: "1,2-Diol",
    optionB: "1,2-Dione",
    optionC: "Benzaldehyde",
    optionD: "Benzoic acid ($\\text{C}_6\\text{H}_5\\text{COOH} + \\text{CO}_2$)",
    correctOption: "D",
    explanation: "Oxidative cleavage of terminal alkyne $-\\text{C}\\equiv\\text{CH}$ produces benzoic acid and carbon dioxide."
  },
  {
    subject: "Chemistry",
    questionText: "Which pair of lanthanoid ions is DIAMAGNETIC with completely filled or empty $f$-subshells?",
    optionA: "$\\text{Gd}^{3+}$ and $\\text{Eu}^{3+}$",
    optionB: "$\\text{Pm}^{3+}$ and $\\text{Sm}^{3+}$",
    optionC: "$\\text{Ce}^{4+} (4f^0)$ and $\\text{Yb}^{2+} (4f^{14})$",
    optionD: "$\\text{Ce}^{3+}$ and $\\text{Eu}^{2+}$",
    correctOption: "C",
    explanation: "$\\text{Ce}^{4+}$ has empty $4f^0$ and $\\text{Yb}^{2+}$ has completely filled $4f^{14}$, both having zero unpaired electrons (diamagnetic)."
  },
  {
    subject: "Chemistry",
    questionText: "$\\text{CH}_3\\text{CH}_2\\text{CH}_2\\text{I} \\xrightarrow{\\text{NaCN}} A \\xrightarrow{\\text{partial hydrolysis}} B \\xrightarrow{\\text{Br}_2 / \\text{NaOH}} C$. Product C is:",
    optionA: "Butanamide",
    optionB: "$\\alpha$-Bromobutanoic acid",
    optionC: "Propylamine ($\\text{CH}_3\\text{CH}_2\\text{CH}_2\\text{NH}_2$)",
    optionD: "Butylamine",
    correctOption: "C",
    explanation: "Butanenitrile ($A$) partially hydrolyzes to butanamide ($B$), which undergoes Hoffmann bromamide degradation to propylamine ($C$)."
  },
  {
    subject: "Chemistry",
    questionText: "Products A and B from: (i) $3\\text{ROH} + \\text{PCl}_3 \\to 3\\text{RCl} + A$, and (ii) $\\text{ROH} + \\text{PCl}_5 \\to \\text{RCl} + \\text{HCl} + B$ are:",
    optionA: "$\\text{H}_3\\text{PO}_4$ and $\\text{POCl}_3$",
    optionB: "$\\text{H}_3\\text{PO}_3$ (Phosphorous acid) and $\\text{POCl}_3$ (Phosphorus oxychloride)",
    optionC: "$\\text{POCl}_3$ and $\\text{H}_3\\text{PO}_3$",
    optionD: "$\\text{POCl}_3$ and $\\text{H}_3\\text{PO}_4$",
    correctOption: "B",
    explanation: "Reaction with $\\text{PCl}_3$ gives phosphorous acid $\\text{H}_3\\text{PO}_3$; reaction with $\\text{PCl}_5$ gives phosphorus oxychloride $\\text{POCl}_3$."
  },
  {
    subject: "Chemistry",
    questionText: "Arrange cations in increasing qualitative analytical group order (Group 0 to VI): A. $\\text{Al}^{3+}$, B. $\\text{Cu}^{2+}$, C. $\\text{Ba}^{2+}$, D. $\\text{Co}^{2+}$, E. $\\text{Mg}^{2+}$",
    optionA: "E, C, D, B, A",
    optionB: "E, A, B, C, D",
    optionC: "B (II) < A (III) < D (IV) < C (V) < E (VI)",
    optionD: "B, C, A, D, E",
    correctOption: "C",
    explanation: "$\\text{Cu}^{2+}$ is Group II, $\\text{Al}^{3+}$ is Group III, $\\text{Co}^{2+}$ is Group IV, $\\text{Ba}^{2+}$ is Group V, $\\text{Mg}^{2+}$ is Group VI."
  },
  {
    subject: "Chemistry",
    questionText: "Compound X contains $32\\%\\text{ A } (M=64)$, $20\\%\\text{ B } (M=40)$, and $48\\%\\text{ C } (M=32)$. Empirical formula is:",
    optionA: "$\\text{AB}_2\\text{C}_2$",
    optionB: "$\\text{ABC}_4$",
    optionC: "$\\text{A}_2\\text{BC}_2$",
    optionD: "$\\text{ABC}_3$",
    correctOption: "D",
    explanation: "Moles: $A = 32/64 = 0.5$, $B = 20/40 = 0.5$, $C = 48/32 = 1.5 \\implies$ ratio $1 : 1 : 3 \\implies \\text{ABC}_3$."
  },
  {
    subject: "Chemistry",
    questionText: "Rate quadruples when temperature rises from $27^\\circ\\text{C} (300\\text{ K})$ to $57^\\circ\\text{C} (330\\text{ K})$. Activation energy $E_a$ is ($R = 8.314\\text{ J/K mol}$):",
    optionA: "$3.80\\text{ kJ/mol}$",
    optionB: "$3804\\text{ kJ/mol}$",
    optionC: "$38.04\\text{ kJ/mol}$",
    optionD: "$380.4\\text{ kJ/mol}$",
    correctOption: "C",
    explanation: "$\\log 4 = 0.6021 = \\frac{E_a}{2.303 \\times 8.314}\\left(\\frac{30}{300 \\times 330}\\right) \\implies E_a = 38042\\text{ J/mol} = 38.04\\text{ kJ/mol}$."
  },
  {
    subject: "Chemistry",
    questionText: "Plot of osmotic pressure $\\pi$ vs concentration $C$ has slope $25.73\\text{ L bar mol}^{-1}$. Temperature of measurement is ($R = 0.083\\text{ L bar/K mol}$):",
    optionA: "$25.73^\\circ\\text{C}$",
    optionB: "$12.05^\\circ\\text{C}$",
    optionC: "$37^\\circ\\text{C} = 310\\text{ K}$",
    optionD: "$310^\\circ\\text{C}$",
    correctOption: "C",
    explanation: "$\\pi = C R T \\implies \\text{Slope} = R T = 25.73 \\implies T = \\frac{25.73}{0.083} = 310\\text{ K} = 37^\\circ\\text{C}$."
  },
  {
    subject: "Chemistry",
    questionText: "In preparing Mohr's salt solution, which acid is added to prevent hydrolysis of $\\text{Fe}^{2+}$ ion?",
    optionA: "Dilute nitric acid",
    optionB: "Dilute sulphuric acid ($\\text{H}_2\\text{SO}_4$)",
    optionC: "Dilute hydrochloric acid",
    optionD: "Concentrated sulphuric acid",
    correctOption: "B",
    explanation: "Dilute $\\text{H}_2\\text{SO}_4$ maintains low pH preventing oxidation and precipitation of ferrous hydroxide."
  },
  {
    subject: "Chemistry",
    questionText: "Mass of copper deposited by $9.6487\\text{ A}$ passed for $100\\text{ s}$ through $\\text{CuSO}_4$ is ($M = 63.5\\text{ g/mol}, 1F = 96487\\text{ C}$):",
    optionA: "$31.5\\text{ g}$",
    optionB: "$0.0315\\text{ g}$",
    optionC: "$3.15\\text{ g}$",
    optionD: "$0.315\\text{ g}$",
    correctOption: "D",
    explanation: "$m = \\frac{E I t}{F} = \\frac{(63/2) \\times 9.6487 \\times 100}{96487} = \\frac{31.5 \\times 964.87}{96487} = 0.315\\text{ g}$."
  },
  {
    subject: "Chemistry",
    questionText: "Select the CORRECT chemical statement:",
    optionA: "Dipole moment of $\\text{NF}_3$ is greater than $\\text{NH}_3$",
    optionB: "Three equivalent resonance canonical forms can be drawn for Carbonate ion ($\\text{CO}_3^{2-}$)",
    optionC: "Three resonance structures for ozone",
    optionD: "$\\text{BF}_3$ has non-zero dipole moment",
    correctOption: "B",
    explanation: "Carbonate ion $\\text{CO}_3^{2-}$ exhibits 3 equivalent canonical resonance structures with $C-O$ bond order $4/3$."
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: $[\\text{Co(NH}_3)_6]^{3+}$ is a homoleptic complex whereas $[\\text{Co(NH}_3)_4\\text{Cl}_2]^+$ is a heteroleptic complex.\nStatement II: $[\\text{Co(NH}_3)_6]^{3+}$ has only one kind of ligand while $[\\text{Co(NH}_3)_4\\text{Cl}_2]^+$ has two kinds of ligands.",
    optionA: "Statement I true, II false",
    optionB: "Statement I false, II true",
    optionC: "Both Statement I and Statement II are TRUE and II explains I",
    optionD: "Both false",
    correctOption: "C",
    explanation: "Homoleptic complexes bind only one ligand type; heteroleptic complexes bind multiple ligand species."
  },

  // -------------------------------------------------------------
  // BIOLOGY (Q101 - Q200)
  // -------------------------------------------------------------
  {
    subject: "Biology",
    questionText: "In stomatal guard cells, which component features thin elastic outer walls and highly thickened inner walls?",
    optionA: "Epidermal cell",
    optionB: "Subsidiary cell",
    optionC: "Guard cell inner wall facing aperture",
    optionD: "Chloroplast",
    correctOption: "C",
    explanation: "Guard cells have thin outer convex walls and thick inelastic inner concave walls facing the stomatal pore."
  },
  {
    subject: "Biology",
    questionText: "A transcription unit in DNA is defined by three functional regions from upstream to downstream:",
    optionA: "Inducer, Repressor, Structural gene",
    optionB: "Promoter (upstream $5'$), Structural gene, Terminator (downstream $3'$)",
    optionC: "Repressor, Operator, Structural gene",
    optionD: "Structural gene, Transposon, Operator",
    correctOption: "B",
    explanation: "A transcription unit consists of a Promoter at $5'$ end, Structural gene, and Terminator at $3'$ end."
  },
  {
    subject: "Biology",
    questionText: "In Verhulst-Pearl logistic equation $dN/dt = rN\\left(\\frac{K-N}{K}\\right)$, parameter '$K$' represents:",
    optionA: "Carrying capacity (Maximum sustainable population size)",
    optionB: "Population density",
    optionC: "Intrinsic rate of increase",
    optionD: "Biotic potential",
    correctOption: "A",
    explanation: "$K$ is the carrying capacity of the environment beyond which resources become limiting."
  },
  {
    subject: "Biology",
    questionText: "In a dicot seed embryo, which part is destined to form the root system upon germination?",
    optionA: "Radicle (Embryonic root)",
    optionB: "Plumule",
    optionC: "Cotyledon",
    optionD: "Epicotyl",
    correctOption: "A",
    explanation: "The embryonic radicle elongates and differentiates into the primary taproot."
  },
  {
    subject: "Biology",
    questionText: "Inhibition of Succinate Dehydrogenase enzyme by competitive structural analogue Malonate is a classical example of:",
    optionA: "Competitive inhibition",
    optionB: "Enzyme activation",
    optionC: "Cofactor inhibition",
    optionD: "Feedback allosteric inhibition",
    correctOption: "A",
    explanation: "Malonate closely resembles succinate substrate and competes for binding at active catalytic site."
  },
  {
    subject: "Biology",
    questionText: "When pink Snapdragon ($Rr$) is crossed with red Snapdragon ($RR$), the expected phenotypic ratio in progeny is:",
    optionA: "Only pink flowered plants",
    optionB: "Red, Pink and White plants",
    optionC: "Only red flowered plants",
    optionD: "Red flowered ($50\\%$) and Pink flowered ($50\\%$) plants ($1:1$)",
    correctOption: "D",
    explanation: "Cross $RR \\times Rr \\to 1\\,RR\\text{ (Red)} : 1\\,Rr\\text{ (Pink)}$ due to incomplete dominance."
  },
  {
    subject: "Biology",
    questionText: "Conservation where threatened species are taken out of natural habitats and kept in zoological/botanical settings is:",
    optionA: "Semi-conservative",
    optionB: "Sustainable development",
    optionC: "In-situ conservation",
    optionD: "Ex-situ conservation",
    correctOption: "D",
    explanation: "Ex-situ conservation preserves endangered organisms in human-controlled settings (zoos, gene banks, botanical gardens)."
  },
  {
    subject: "Biology",
    questionText: "The major drivers of biodiversity loss (The Evil Quartet) include:\nA. Over-exploitation\nB. Co-extinction\nC. Mutation\nD. Habitat loss and fragmentation\nE. Migration",
    optionA: "A, B and E only",
    optionB: "A, B and D only",
    optionC: "A, C and D only",
    optionD: "A, B, C and D only",
    correctOption: "B",
    explanation: "The Evil Quartet comprises Habitat loss/fragmentation, Over-exploitation, Alien species invasions, and Co-extinctions."
  },
  {
    subject: "Biology",
    questionText: "Which of the following biochemical components are directly required for Dark Reactions (Calvin cycle) of photosynthesis?\nA. Light, B. Chlorophyll, C. $\\text{CO}_2$, D. ATP, E. NADPH",
    optionA: "C, D and E only",
    optionB: "D and E only",
    optionC: "A, B and C only",
    optionD: "B, C and D only",
    correctOption: "A",
    explanation: "Calvin cycle assimilates $\\text{CO}_2$ using assimilatory power (ATP and NADPH) generated in light reaction."
  },
  {
    subject: "Biology",
    questionText: "Large, empty, colourless Bulliform cells in grass epidermis are responsible for:",
    optionA: "Increased photosynthesis",
    optionB: "Sugar storage",
    optionC: "Inward curling and rolling of leaves during water stress to minimize transpiration",
    optionD: "Salt stress protection",
    correctOption: "C",
    explanation: "When flaccid under drought stress, bulliform cells make leaves roll inwards to minimize water loss."
  },
  {
    subject: "Biology",
    questionText: "Flowers with half-inferior ovary surrounded by cup-shaped thalamus (Rose, Peach, Plum) are:",
    optionA: "Perigynous and Epigynous",
    optionB: "Perigynous flowers (Half-inferior ovary)",
    optionC: "Epigynous and Hypogynous",
    optionD: "Hypogynous and Epigynous",
    correctOption: "B",
    explanation: "In perigynous flowers, gynoecium is situated in the centre and other parts lie on the rim of thalamus at same level."
  },
  {
    subject: "Biology",
    questionText: "Which of the following is NOT a taxonomic criterion used in fungal classification?",
    optionA: "Mode of spore formation",
    optionB: "Fruiting bodies",
    optionC: "Morphology of mycelium",
    optionD: "Mode of nutrition (All fungi are heterotrophic absorptive saprophytes/parasites)",
    correctOption: "D",
    explanation: "Fungi are classified into Phycomycetes, Ascomycetes, Basidiomycetes based on mycelium septation, spores, and fruiting bodies."
  },
  {
    subject: "Biology",
    questionText: "Restriction endonuclease Hind II recognizes and cuts double-stranded DNA at a specific palindromic sequence of:",
    optionA: "4 bp",
    optionB: "10 bp",
    optionC: "8 bp",
    optionD: "6 base pairs (6 bp)",
    correctOption: "D",
    explanation: "Hind II recognizes a specific 6 base-pair recognition sequence ($5'-\\text{GTPyPuAC}-3'$)."
  },
  {
    subject: "Biology",
    questionText: "Synthetic auxin 2,4-D is sprayed to eradicate weeds from lawns without harming grass turf because auxin:",
    optionA: "Does not affect mature monocotyledonous plants while killing broad-leaved dicot weeds",
    optionB: "Stimulates grass division",
    optionC: "Promotes apical dominance",
    optionD: "Promotes leaf abscission only",
    correctOption: "A",
    explanation: "2,4-D selectively destroys broad-leaved dicot weeds without affecting mature monocotyledonous grasses."
  },
  {
    subject: "Biology",
    questionText: "Match Genetic Terms:\nA. Alternative forms of gene, B. Cross of $F_1$ with homozygous recessive parent, C. Cross of $F_1$ with any parent, D. Number of chromosome sets\nI. Back cross, II. Ploidy, III. Allele, IV. Test cross",
    optionA: "A-III, B-IV, C-I, D-II",
    optionB: "A-IV, B-III, C-II, D-I",
    optionC: "A-I, B-II, C-III, D-IV",
    optionD: "A-II, B-I, C-III, D-IV",
    correctOption: "A",
    explanation: "Allele (III), Test cross (IV), Back cross (I), Ploidy (II)."
  },
  {
    subject: "Biology",
    questionText: "During cell division, mitotic spindle fibres attach to kinetochores of chromosomes during:",
    optionA: "Anaphase",
    optionB: "Telophase",
    optionC: "Prophase",
    optionD: "Metaphase (Congression at equatorial plate)",
    correctOption: "D",
    explanation: "Spindle fibres attach to kinetochores and align chromosomes at the equatorial metaphase plate."
  },
  {
    subject: "Biology",
    questionText: "Match Microbes with Commercial Bio-Products:\nA. Clostridium butylicum, B. Saccharomyces cerevisiae, C. Trichoderma polysporum, D. Streptococcus sp.\nI. Ethanol, II. Streptokinase, III. Butyric acid, IV. Cyclosporin-A",
    optionA: "A-III, B-I, C-IV, D-II",
    optionB: "A-IV, B-I, C-III, D-II",
    optionC: "A-III, B-I, C-II, D-IV",
    optionD: "A-II, B-IV, C-III, D-I",
    correctOption: "A",
    explanation: "Clostridium = Butyric acid (III), Yeast = Ethanol (I), Trichoderma = Cyclosporin A (IV), Streptococcus = Streptokinase (II)."
  },
  {
    subject: "Biology",
    questionText: "Which statements explain Mendel's Law of Dominance?\nA. In pair of factors one is dominant and other recessive\nB. Alleles blend in $F_2$\nC. Factors occur in pairs in diploids\nD. Discrete controlling unit is factor\nE. Expression of only one parental trait in monohybrid $F_1$",
    optionA: "B, C and D only",
    optionB: "A, B, C, D and E",
    optionC: "A, B and C only",
    optionD: "A, C, D and E only",
    correctOption: "D",
    explanation: "Law of dominance states characters are controlled by discrete paired factors, one dominant and one recessive (Statement B contradicts non-blending)."
  },
  {
    subject: "Biology",
    questionText: "When an isolated piece of recombinant DNA carrying gene of interest is transferred into an alien host without origin of replication (ori):",
    optionA: "It fails to replicate unless integrated into recipient host chromosome (B and C only)",
    optionB: "Multiplies independently",
    optionC: "Directly translates",
    optionD: "Degrades immediately",
    correctOption: "A",
    explanation: "Without an origin of replication (ori), foreign DNA cannot autonomously replicate unless integrated into the host genome."
  },
  {
    subject: "Biology",
    questionText: "How many molecules of ATP and NADPH are consumed for every molecule of $\\text{CO}_2$ fixed in the Calvin cycle?",
    optionA: "3 ATP and 3 NADPH",
    optionB: "3 molecules of ATP and 2 molecules of NADPH",
    optionC: "2 ATP and 3 NADPH",
    optionD: "2 ATP and 2 NADPH",
    correctOption: "B",
    explanation: "Fixation of $1\\text{ CO}_2$ requires 2 ATP + 2 NADPH in reduction step and 1 ATP in RuBP regeneration step ($3\\text{ ATP} + 2\\text{ NADPH}$ total)."
  },
  {
    subject: "Biology",
    questionText: "To determine whether a dominant black-seeded plant is homozygous ($BB$) or heterozygous ($Bb$), it must be testcrossed with:",
    optionA: "$Bb$",
    optionB: "$BB/Bb$",
    optionC: "$BB$",
    optionD: "$bb$ (Homozygous recessive white-seeded parent)",
    correctOption: "D",
    explanation: "A test cross mates an unknown dominant individual with a homozygous recessive ($bb$) tester."
  },
  {
    subject: "Biology",
    questionText: "Lecithin (Phosphatidylcholine) found abundantly in cell plasma membranes is a:",
    optionA: "Glyceride",
    optionB: "Carbohydrate",
    optionC: "Amino acid",
    optionD: "Phospholipid (Glycerol + 2 fatty acids + phosphate + choline)",
    correctOption: "D",
    explanation: "Lecithin is a major structural membrane phospholipid containing choline and phosphate."
  },
  {
    subject: "Biology",
    questionText: "Match Fungi with Common Names:\nA. Rhizopus, B. Ustilago, C. Puccinia, D. Agaricus\nI. Mushroom, II. Smut fungus, III. Bread mould, IV. Rust fungus",
    optionA: "A-III, B-II, C-I, D-IV",
    optionB: "A-IV, B-III, C-II, D-I",
    optionC: "A-III, B-II, C-IV, D-I",
    optionD: "A-I, B-III, C-II, D-IV",
    correctOption: "C",
    explanation: "Rhizopus = Bread mould (III), Ustilago = Smut (II), Puccinia = Rust (IV), Agaricus = Mushroom (I)."
  },
  {
    subject: "Biology",
    questionText: "Tropical regions exhibit greatest biodiversity because:\nA. Long undisturbed evolutionary time\nB. More seasonal\nC. More solar energy\nD. Constant environments promote niche specialization\nE. Predictable environments",
    optionA: "A, B and E only",
    optionB: "A, B and D only",
    optionC: "A, C, D and E only",
    optionD: "A and B only",
    correctOption: "C",
    explanation: "Tropics are less seasonal, more constant, receive abundant solar insolation, and remained glaciated-free."
  },
  {
    subject: "Biology",
    questionText: "Match Organelles with Functions:\nA. Nucleolus, B. Centriole, C. Leucoplasts, D. Golgi apparatus\nI. Glycolipid synthesis, II. Cartwheel $9+0$ structure, III. rRNA synthesis, IV. Nutrient storage",
    optionA: "A-III, B-IV, C-II, D-I",
    optionB: "A-I, B-II, C-III, D-IV",
    optionC: "A-III, B-II, C-IV, D-I",
    optionD: "A-II, B-III, C-I, D-IV",
    correctOption: "C",
    explanation: "Nucleolus = rRNA (III), Centriole = Cartwheel (II), Leucoplast = Storage (IV), Golgi = Glycolipid/glycoprotein formation (I)."
  },
  {
    subject: "Biology",
    questionText: "In the lac operon of E. coli, lactose entry across the bacterial cell membrane is transported by:",
    optionA: "Permease (encoded by lac Y gene)",
    optionB: "Polymerase",
    optionC: "$\\beta$-Galactosidase",
    optionD: "Transacetylase",
    correctOption: "A",
    explanation: "Permease increases cellular permeability to $\\beta$-galactosides (lactose)."
  },
  {
    subject: "Biology",
    questionText: "Statement I: Chromosomes become gradually visible under light microscope during leptotene.\nStatement II: Diplotene is recognized by the dissolution of synaptonemal complex and formation of chiasmata.",
    optionA: "Statement I true, II false",
    optionB: "Statement I false, II true",
    optionC: "Both Statement I and Statement II are TRUE",
    optionD: "Both false",
    correctOption: "C",
    explanation: "Chromatin compaction begins in leptotene; diplotene dissolution of synaptonemal complex unmasks X-shaped chiasmata."
  },
  {
    subject: "Biology",
    questionText: "Formation of interfascicular cambium from differentiated permanent parenchyma cells is an example of:",
    optionA: "Dedifferentiation",
    optionB: "Maturation",
    optionC: "Differentiation",
    optionD: "Redifferentiation",
    correctOption: "A",
    explanation: "Dedifferentiation is the process wherein differentiated living parenchymal cells regain mitotic division capacity."
  },
  {
    subject: "Biology",
    questionText: "Statement I: Parenchyma is living but collenchyma is dead tissue.\nStatement II: Gymnosperms lack xylem vessels while presence of vessels is characteristic of angiosperms.",
    optionA: "Statement I true, II false",
    optionB: "Statement I is false (Collenchyma is living) but Statement II is true",
    optionC: "Both true",
    optionD: "Both false",
    correctOption: "B",
    explanation: "Collenchyma consists of living cells with pectin-thickened corners. Gymnosperms conduct via tracheids without vessels."
  },
  {
    subject: "Biology",
    questionText: "Select correct hydrophyte pollination statements:\nA. Vallisneria colorful with nectar\nB. Waterlily pollinated by insects, not water\nC. Pollen protected by mucilage\nD. Hydrophyte pollen long and ribbon-like (Zostera)\nE. Pollen carried passively inside water",
    optionA: "A, C, D and E only",
    optionB: "B, C, D and E only",
    optionC: "C, D and E only",
    optionD: "A, B, C and D only",
    correctOption: "B",
    explanation: "Vallisneria flowers are small and nectarless (A is false); Waterlily is entomophilous (B), and submerged hydrophytes have ribbon-like mucilage-coated pollen."
  },
  {
    subject: "Biology",
    questionText: "Which of the following plants produces radially symmetrical ACTINOMORPHIC flowers?",
    optionA: "Pisum (Zygomorphic)",
    optionB: "Sesbania (Zygomorphic)",
    optionC: "Datura (Solanaceae / Actinomorphic)",
    optionD: "Cassia (Zygomorphic)",
    correctOption: "C",
    explanation: "Mustard, Datura, and Chilli have actinomorphic (radially symmetrical) flowers."
  },
  {
    subject: "Biology",
    questionText: "The cellular capacity of an explant cell to regenerate into a whole complete plant is termed:",
    optionA: "Differentiation",
    optionB: "Somatic hybridization",
    optionC: "Totipotency",
    optionD: "Micropropagation",
    correctOption: "C",
    explanation: "Totipotency is the inherent genetic potential of a single plant cell to divide and differentiate into a complete plant."
  },
  {
    subject: "Biology",
    questionText: "Statement I: Bt toxins are insect group specific and coded by gene cry IAc.\nStatement II: Inactive Bt protoxin is converted into active toxin in insect gut due to alkaline pH.",
    optionA: "Statement I is true but Statement II is false (Converts due to alkaline pH, statement claimed acidic)",
    optionB: "Statement I false, II true",
    optionC: "Both true",
    optionD: "Both false",
    correctOption: "A",
    explanation: "Bt protoxin solubilizes and activates in ALKALINE pH of insect midgut (Statement II falsely stated acidic pH)."
  },
  {
    subject: "Biology",
    questionText: "The authoritative Red List of Threatened and Endangered Species is compiled and published by:",
    optionA: "FOAM",
    optionB: "IUCN (International Union for Conservation of Nature)",
    optionC: "GEAC",
    optionD: "WWF",
    correctOption: "B",
    explanation: "IUCN maintains the Red Data Book assessing global conservation status of biological species."
  },
  {
    subject: "Biology",
    questionText: "The essential non-protein divalent mineral cofactor required for Carboxypeptidase proteolytic activity is:",
    optionA: "Flavin",
    optionB: "Haem",
    optionC: "Zinc ($\\text{Zn}^{2+}$)",
    optionD: "Niacin",
    correctOption: "C",
    explanation: "Zinc is the required catalytic metal cofactor for carboxypeptidase and carbonic anhydrase."
  },
  {
    subject: "Biology",
    questionText: "Match Respiratory Stages with Cellular Locations:\nA. Citric acid cycle, B. Glycolysis, C. Electron Transport System, D. Proton gradient\nI. Cytoplasm, II. Mitochondrial matrix, III. Intermembrane space, IV. Inner mitochondrial membrane",
    optionA: "A-III, B-IV, C-I, D-II",
    optionB: "A-IV, B-III, C-II, D-I",
    optionC: "A-I, B-II, C-III, D-IV",
    optionD: "A-II, B-I, C-IV, D-III",
    correctOption: "D",
    explanation: "Krebs = Matrix (II), Glycolysis = Cytoplasm (I), ETS = Inner membrane (IV), Proton accumulation = Intermembrane space (III)."
  },
  {
    subject: "Biology",
    questionText: "In E. coli DNA replication, DNA-dependent DNA polymerase catalyzes phosphodiester synthesis strictly in:",
    optionA: "$5' \\to 3'$ and $3' \\to 5'$",
    optionB: "$5' \\to 3'$ direction only",
    optionC: "$3' \\to 5'$ only",
    optionD: "Variable direction",
    correctOption: "B",
    explanation: "DNA polymerase III adds deoxynucleotides exclusively to $3'-\\text{OH}$ of growing chain, polymerizing in $5' \\to 3'$ direction."
  },
  {
    subject: "Biology",
    questionText: "Match Ecologists with Concepts:\nA. Robert May, B. Alexander von Humboldt, C. Paul Ehrlich, D. David Tilman\nI. Species-Area relationship, II. Long-term outdoor plot experiments, III. Global diversity ~7 million, IV. Rivet popper hypothesis",
    optionA: "A-I, B-III, C-II, D-IV",
    optionB: "A-III, B-IV, C-II, D-I",
    optionC: "A-II, B-III, C-I, D-IV",
    optionD: "A-III, B-I, C-IV, D-II",
    correctOption: "D",
    explanation: "May = 7 million estimate (III), Humboldt = Species-Area (I), Ehrlich = Rivet popper (IV), Tilman = Plot diversity stability (II)."
  },
  {
    subject: "Biology",
    questionText: "Tassels of corn cob with exposed feathery stigmas and versatile anthers are an adaptation for:",
    optionA: "Cleistogamy",
    optionB: "Autogamy",
    optionC: "Wind pollination (Anemophily)",
    optionD: "Water pollination",
    correctOption: "C",
    explanation: "Corn cob tassels wave in the wind to trap airborne pollen grains."
  },
  {
    subject: "Biology",
    questionText: "Which substrate-level phosphorylation step in Krebs cycle does NOT involve substrate oxidation?",
    optionA: "Succinyl-CoA $\\to$ Succinate (coupled to GTP synthesis)",
    optionB: "Isocitrate $\\to \\alpha$-ketoglutarate",
    optionC: "Malate $\\to$ Oxaloacetate",
    optionD: "Succinate $\\to$ Fumarate",
    correctOption: "A",
    explanation: "Conversion of Succinyl-CoA to succinic acid is substrate-level phosphorylation producing GTP without dehydrogenation/oxidation."
  },
  {
    subject: "Biology",
    questionText: "Statement I: In $\\text{C}_3$ plants, $\\text{O}_2$ binds RuBisCO causing photorespiratory loss.\nStatement II: In $\\text{C}_4$ plants, high $\\text{CO}_2$ concentration around bundle sheath RuBisCO prevents photorespiration.",
    optionA: "Statement I is true but Statement II is false",
    optionB: "Statement I false, II true",
    optionC: "Both Statement I and Statement II are TRUE",
    optionD: "Both false",
    correctOption: "A",
    explanation: "Statement I is true. In $\\text{C}_4$ plants, mesophyll cells lack RuBisCO and bundle sheath cells maintain elevated $\\text{CO}_2$, so photorespiration is completely absent in both (Statement II claimed mesophyll shows photorespiration)."
  },
  {
    subject: "Biology",
    questionText: "If NPP of 1st trophic level (producers) is $100x\\text{ kcal m}^{-2}\\text{yr}^{-1}$, GPP/energy available at 3rd trophic level (10% law) is:",
    optionA: "$10x\\text{ kcal m}^{-2}\\text{yr}^{-1}$",
    optionB: "$\\frac{100}{3}x$",
    optionC: "$x/10$",
    optionD: "$x\\text{ kcal m}^{-2}\\text{yr}^{-1}$",
    correctOption: "A",
    explanation: "Following Lindeman's 10% trophic efficiency law: Level 1 ($100x$) $\\to$ Level 2 ($10x$) $\\to$ Level 3 ($1x / 10x$). Official key: 1 ($10x$)."
  },
  {
    subject: "Biology",
    questionText: "Match Bio-Proteins with Roles:\nA. GLUT-4, B. Insulin, C. Trypsin, D. Collagen\nI. Peptide hormone, II. Proteolytic enzyme, III. Intercellular ground substance, IV. Glucose transport across cell membrane",
    optionA: "A-II, B-III, C-IV, D-I",
    optionB: "A-III, B-IV, C-I, D-II",
    optionC: "A-IV, B-I, C-II, D-III",
    optionD: "A-I, B-II, C-III, D-IV",
    correctOption: "C",
    explanation: "GLUT-4 = Glucose transport (IV), Insulin = Hormone (I), Trypsin = Enzyme (II), Collagen = Ground substance (III)."
  },
  {
    subject: "Biology",
    questionText: "Match Molecular Biologists with Discoveries:\nA. Frederick Griffith, B. Jacob & Monod, C. H.G. Khorana, D. Meselson & Stahl\nI. Genetic code triplet codons, II. Semiconservative replication, III. Bacterial transformation, IV. Lac operon",
    optionA: "A-II, B-III, C-IV, D-I",
    optionB: "A-IV, B-I, C-II, D-III",
    optionC: "A-III, B-II, C-I, D-IV",
    optionD: "A-III, B-IV, C-I, D-II",
    correctOption: "D",
    explanation: "Griffith = Transformation (III), Jacob & Monod = Lac operon (IV), Khorana = Genetic code synthesis (I), Meselson & Stahl = Semiconservative replication (II)."
  },
  {
    subject: "Biology",
    questionText: "The extranuclear genome present inside plant Chloroplasts is:",
    optionA: "Linear single stranded",
    optionB: "Circular single stranded",
    optionC: "Linear double stranded",
    optionD: "Circular double stranded DNA (cpDNA)",
    correctOption: "D",
    explanation: "Chloroplasts contain prokaryotic-like naked, circular double-stranded DNA molecules."
  },
  {
    subject: "Biology",
    questionText: "Spraying sugarcane plantations with which phytohormone elongates internodes and boosts yield by up to 20 tonnes/acre?",
    optionA: "Cytokinin",
    optionB: "Abscisic acid",
    optionC: "Auxin",
    optionD: "Gibberellin ($\\text{GA}_3$)",
    correctOption: "D",
    explanation: "Gibberellins stimulate stem internode elongation in sugarcane, significantly increasing harvestable sugar yield."
  },
  {
    subject: "Biology",
    questionText: "Select correct statements for Brown Algae (Phaeophyceae):\nA. Biflagellate pear-shaped zoospores with unequal lateral flagella\nB. Oogamous only\nC. Food stored as mannitol or laminarin\nD. Chlorophyll a, c, fucoxanthin\nE. Algin gelatinous coating on cell wall",
    optionA: "A, C, D and E only",
    optionB: "A, B, C and E only",
    optionC: "A, B, C and D only",
    optionD: "B, C, D and E only",
    correctOption: "A",
    explanation: "Sexual reproduction can be isogamous, anisogamous, or oogamous (B is false); storage carbohydrates are mannitol/laminarin."
  },
  {
    subject: "Biology",
    questionText: "In somatic hybridization (e.g. Pomato), which cellular structures of two plant varieties are enzymatic ally isolated and fused?",
    optionA: "Naked Protoplasts (using pectinase and cellulase)",
    optionB: "Pollens",
    optionC: "Callus",
    optionD: "Somatic embryos",
    correctOption: "A",
    explanation: "Protoplasts isolated by enzymatic wall digestion are fused using PEG (polyethylene glycol) or electrofusion."
  },
  {
    subject: "Biology",
    questionText: "Match Floral Traits:\nA. Rose, B. Pea, C. Cotton, D. Mango\nI. Twisted aestivation, II. Perigynous flower, III. Drupe fruit, IV. Marginal placentation",
    optionA: "A-IV, B-III, C-II, D-I",
    optionB: "A-II, B-III, C-IV, D-I",
    optionC: "A-II, B-IV, C-I, D-III",
    optionD: "A-I, B-II, C-III, D-IV",
    correctOption: "C",
    explanation: "Rose = Perigynous (II), Pea = Marginal placentation (IV), Cotton = Twisted aestivation (I), Mango = Drupe (III)."
  },
  {
    subject: "Biology",
    questionText: "Match Stamen Cohesion Types:\nA. Monadelphous, B. Diadelphous, C. Polyadelphous, D. Epiphyllous\nI. Citrus, II. Pea, III. Lily, IV. China-rose",
    optionA: "A-I, B-II, C-IV, D-III",
    optionB: "A-III, B-I, C-IV, D-II",
    optionC: "A-IV, B-II, C-I, D-III",
    optionD: "A-IV, B-I, C-II, D-III",
    correctOption: "C",
    explanation: "China-rose = Monadelphous (IV), Pea = Diadelphous (II), Citrus = Polyadelphous (I), Lily = Epiphyllous (III)."
  },
  {
    subject: "Biology",
    questionText: "Match Infectious Diseases with Diagnostic/Pathogenic Features:\nA. Common Cold, B. Haemozoin, C. Widal test, D. Allergy\nI. Plasmodium, II. Typhoid, III. Rhinoviruses, IV. Dust mites",
    optionA: "A-III, B-I, C-II, D-IV",
    optionB: "A-IV, B-II, C-III, D-I",
    optionC: "A-II, B-IV, C-III, D-I",
    optionD: "A-I, B-III, C-II, D-IV",
    correctOption: "A",
    explanation: "Common cold = Rhinovirus (III), Haemozoin = Plasmodium (I), Widal = Typhoid (II), Allergy = Dust mites (IV)."
  },
  {
    subject: "Biology",
    questionText: "Flippers of oceanic Penguins (birds) and marine Dolphins (mammals) are an evolutionary example of:",
    optionA: "Convergent evolution (Analogous adaptations for swimming)",
    optionB: "Divergent evolution",
    optionC: "Adaptive radiation",
    optionD: "Natural selection",
    correctOption: "A",
    explanation: "Similar hydrodynamic adaptations evolving in unrelated bird and mammal lineages represent convergent evolution."
  },
  {
    subject: "Biology",
    questionText: "Arrange human hominid evolution from past to most recent: A. Homo habilis, B. Homo sapiens, C. Homo neanderthalensis, D. Homo erectus",
    optionA: "C-B-D-A",
    optionB: "A (Habilis) $\\to$ D (Erectus) $\\to$ C (Neanderthal) $\\to$ B (Sapiens)",
    optionC: "D-A-C-B",
    optionD: "B-A-D-C",
    correctOption: "B",
    explanation: "Homo habilis ($650-800\\text{ cc}$) $\\to$ Homo erectus ($900\\text{ cc}$) $\\to$ Neanderthal ($1400\\text{ cc}$) $\\to$ Homo sapiens."
  },
  {
    subject: "Biology",
    questionText: "Which factor will NOT perturb or disrupt Hardy-Weinberg genetic equilibrium in a population?",
    optionA: "Gene migrations",
    optionB: "Constant large gene pool without selection or mutation",
    optionC: "Genetic recombination",
    optionD: "Genetic drift",
    correctOption: "B",
    explanation: "A stable, constant gene pool in a large random-mating population maintains constant allele frequencies."
  },
  {
    subject: "Biology",
    questionText: "Which alveolar physiological factors are favourable for the binding of oxygen with hemoglobin to form Oxyhemoglobin?",
    optionA: "Low $p\\text{CO}_2$ and High $[\\text{H}^+]$",
    optionB: "Low $p\\text{CO}_2$ and High temperature",
    optionC: "High $p\\text{O}_2$ and High $p\\text{CO}_2$",
    optionD: "High $p\\text{O}_2$, low $p\\text{CO}_2$, lesser $[\\text{H}^+]$ (alkaline pH), and lower temperature",
    correctOption: "D",
    explanation: "In pulmonary alveoli, high $pO_2$, low $pCO_2$, low $[H^+]$, and lower temperature promote oxygen loading onto hemoglobin."
  },
  {
    subject: "Biology",
    questionText: "Which of the following is a barrier method and NOT a natural/traditional contraceptive method?",
    optionA: "Lactational amenorrhea",
    optionB: "Vaginal Vaults (Barrier method)",
    optionC: "Coitus interruptus",
    optionD: "Periodic abstinence",
    correctOption: "B",
    explanation: "Vaults, diaphragms, and cervical caps are reusable rubber barrier contraceptives."
  },
  {
    subject: "Biology",
    questionText: "Match Brain Regions with Functions:\nA. Pons, B. Hypothalamus, C. Medulla, D. Cerebellum\nI. Posture/balance, II. Respiration/gastric reflexes, III. Connects brain regions (Pneumotaxic centre), IV. Neurosecretory cells",
    optionA: "A-I, B-III, C-II, D-IV",
    optionB: "A-II, B-I, C-III, D-IV",
    optionC: "A-II, B-III, C-I, D-IV",
    optionD: "A-III, B-IV, C-II, D-I",
    correctOption: "D",
    explanation: "Pons = Fiber tracts (III), Hypothalamus = Neurosecretory (IV), Medulla = Respiration/cardiac (II), Cerebellum = Balance (I)."
  },
  {
    subject: "Biology",
    questionText: "Statement I: Presence or absence of hymen is not a reliable indicator of virginity.\nStatement II: Hymen can tear during sports, cycling, horseback riding, or sudden fall.",
    optionA: "Statement I is true but Statement II is false",
    optionB: "Statement I is false but Statement II is true",
    optionC: "Both Statement I and Statement II are TRUE",
    optionD: "Both false",
    correctOption: "A",
    explanation: "Statement I is true. Statement II as printed ('hymen is torn during first coitus only') is false because physical activities can also rupture it."
  },
  {
    subject: "Biology",
    questionText: "Match Subcellular Structures:\nA. Axoneme, B. Cartwheel pattern, C. Crista, D. Satellite\nI. Centriole, II. Cilia and flagella, III. Chromosome secondary constriction, IV. Mitochondria",
    optionA: "A-II, B-IV, C-I, D-III",
    optionB: "A-II, B-I, C-IV, D-III",
    optionC: "A-IV, B-III, C-II, D-I",
    optionD: "A-IV, B-II, C-III, D-I",
    correctOption: "B",
    explanation: "Axoneme = Cilia ($9+2$) (II), Cartwheel = Centriole (I), Cristae = Mitochondria (IV), Satellite = Chromosome (III)."
  },
  {
    subject: "Biology",
    questionText: "Match Pathogens with Disease Types:\nA. Typhoid, B. Leishmaniasis, C. Ringworm, D. Filariasis\nI. Fungus (Microsporum), II. Nematode (Wuchereria), III. Protozoa (Leishmania), IV. Bacteria (Salmonella)",
    optionA: "A-III, B-I, C-IV, D-II",
    optionB: "A-II, B-IV, C-III, D-I",
    optionC: "A-I, B-III, C-II, D-IV",
    optionD: "A-IV, B-III, C-I, D-II",
    correctOption: "D",
    explanation: "Typhoid = Salmonella (IV), Leishmaniasis = Leishmania (III), Ringworm = Trichophyton/Microsporum (I), Filariasis = Wuchereria (II)."
  },
  {
    subject: "Biology",
    questionText: "Statement I: In nephron, descending limb of loop of Henle is permeable to water and impermeable to electrolytes.\nStatement II: PCT is lined by simple cuboidal brush border epithelium increasing surface area.",
    optionA: "Statement I is true but Statement II is false",
    optionB: "Statement I is false but Statement II is true",
    optionC: "Both true",
    optionD: "Both Statement I and Statement II are FALSE (Statement I reversed permeability; Statement II said columnar instead of cuboidal)",
    correctOption: "D",
    explanation: "Descending limb is permeable to water (Statement I said impermeable); PCT has cuboidal epithelium (Statement II falsely claimed columnar)."
  },
  {
    subject: "Biology",
    questionText: "Match Biotechnology Applications:\nA. $\\alpha-1$ antitrypsin, B. Cry IAb, C. Cry IAc, D. ADA enzyme replacement therapy\nI. Cotton bollworm, II. SCID deficiency, III. Emphysema, IV. Corn borer",
    optionA: "A-III, B-IV, C-I, D-II",
    optionB: "A-II, B-IV, C-I, D-III",
    optionC: "A-II, B-I, C-IV, D-III",
    optionD: "A-III, B-I, C-II, D-IV",
    correctOption: "A",
    explanation: "$\\alpha-1$ antitrypsin treats emphysema (III), Cry IAb controls corn borer (IV), Cry IAc controls cotton bollworm (I), ADA is for SCID (II)."
  },
  {
    subject: "Biology",
    questionText: "Match IUD Types:\nA. Non-medicated IUD, B. Copper releasing IUD, C. Hormone releasing IUD, D. Subdermal Implants\nI. Multiload 375, II. Progestogens, III. Lippes loop, IV. LNG-20",
    optionA: "A-IV, B-I, C-II, D-III",
    optionB: "A-III, B-I, C-IV, D-II",
    optionC: "A-III, B-I, C-II, D-IV",
    optionD: "A-I, B-III, C-IV, D-II",
    correctOption: "B",
    explanation: "Non-medicated = Lippes loop (III), Cu IUD = Multiload 375 (I), Hormone IUD = LNG-20 (IV), Implants = Progestogen capsules (II)."
  },
  {
    subject: "Biology",
    questionText: "Consider coelom classification in animals:\nA. Annelids are true coelomates (Schizocoelom)\nB. Poriferans are pseudocoelomates\nC. Aschelminthes are acoelomates\nD. Platyhelminthes are pseudocoelomates\nSelect correct statement:",
    optionA: "C only",
    optionB: "D only",
    optionC: "B only",
    optionD: "A only (Annelids possess a true body cavity lined by mesoderm)",
    correctOption: "D",
    explanation: "Annelids are true coelomates; Platyhelminthes are acoelomates; Aschelminthes are pseudocoelomates."
  },
  {
    subject: "Biology",
    questionText: "Match Genetic Disorders with Chromosomal Locations:\nA. Down's syndrome, B. $\\alpha$-Thalassemia, C. $\\beta$-Thalassemia, D. Klinefelter's syndrome\nI. Chromosome 11, II. 'X' chromosome ($47,\\text{XXY}$), III. Chromosome 21 (Trisomy 21), IV. Chromosome 16 (HBA1/HBA2)",
    optionA: "A-III, B-IV, C-I, D-II",
    optionB: "A-IV, B-I, C-II, D-III",
    optionC: "A-I, B-II, C-III, D-IV",
    optionD: "A-II, B-III, C-IV, D-I",
    correctOption: "A",
    explanation: "Down = 21 (III), $\\alpha$-Thal = 16 (IV), $\\beta$-Thal = 11 (I), Klinefelter = XXY (II)."
  },
  {
    subject: "Biology",
    questionText: "Correct sequential pathway of cardiac action potential conduction is:",
    optionA: "B-D-E-C-A",
    optionB: "E-A-D-B-C",
    optionC: "SA node (E) $\\to$ AV node (C) $\\to$ AV bundle of His (A) $\\to$ Bundle branches (D) $\\to$ Purkinje fibres (B)",
    optionD: "A-E-C-B-D",
    correctOption: "C",
    explanation: "Conduction sequence: SA node $\\to$ Internodal tracts $\\to$ AV node $\\to$ AV bundle $\\to$ Bundle branches $\\to$ Purkinje fibres."
  },
  {
    subject: "Biology",
    questionText: "Match Digestive Enzymes with Cleaved Chemical Bonds:\nA. Lipase, B. Nuclease, C. Protease, D. Amylase\nI. Peptide bond, II. Ester bond, III. Glycosidic bond, IV. Phosphodiester bond",
    optionA: "A-II, B-IV, C-I, D-III",
    optionB: "A-IV, B-I, C-III, D-II",
    optionC: "A-IV, B-II, C-III, D-I",
    optionD: "A-III, B-II, C-I, D-IV",
    correctOption: "A",
    explanation: "Lipase = Ester bond (II), Nuclease = Phosphodiester bond (IV), Protease = Peptide bond (I), Amylase = $\\alpha$-glycosidic bond (III)."
  },
  {
    subject: "Biology",
    questionText: "In cloning vector pBR322, identify roles of 'X' (ori) and 'Y' (rop):\n(1) X for replication protein, Y for antibiotics\n(2) X recognition, Y resistance\n(3) X resistance, Y replication\n(4) X controls copy number of linked DNA (ori) and Y codes for proteins involved in plasmid replication (rop)",
    imageUrl: "/neetimages/neet_2024_q168.svg",
    optionA: "Role 1",
    optionB: "Role 2",
    optionC: "Role 3",
    optionD: "The gene 'X' (ori) controls copy number of linked DNA and 'Y' (rop) codes for protein involved in replication of plasmid",
    correctOption: "D",
    explanation: "Origin of replication (ori, X) initiates replication and controls copy number; rop gene (Y) codes for repressor of primer."
  },
  {
    subject: "Biology",
    questionText: "The 'Ti plasmid' derived from crown gall soil bacterium Agrobacterium tumefaciens stands for:",
    optionA: "Tumor inducing plasmid",
    optionB: "Temperature independent plasmid",
    optionC: "Tumour inhibiting plasmid",
    optionD: "Tumor independent plasmid",
    correctOption: "A",
    explanation: "Ti plasmid stands for Tumor-inducing plasmid, used as a natural genetic engineer in dicot plants."
  },
  {
    subject: "Biology",
    questionText: "Match Animal Structures:\nA. Pleurobrachia, B. Radula, C. Stomochord, D. Air bladder\nI. Mollusca, II. Ctenophora, III. Osteichthyes, IV. Hemichordata",
    optionA: "A-II, B-IV, C-I, D-III",
    optionB: "A-IV, B-III, C-II, D-I",
    optionC: "A-IV, B-II, C-III, D-I",
    optionD: "A-II, B-I, C-IV, D-III",
    correctOption: "D",
    explanation: "Pleurobrachia = Ctenophore comb jelly (II), Radula = Rasping organ in Mollusca (I), Stomochord = Hemichordata (IV), Air bladder = Bony fish (III)."
  },
  {
    subject: "Biology",
    questionText: "Which statement regarding industrial Bio-reactors is INCORRECT?",
    optionA: "Bio-reactors are used to produce small scale bacterial cultures (They process large volumes 100-1000 litres for mass production)",
    optionB: "Bio-reactors have agitator, oxygen and foam control systems",
    optionC: "Provides optimal growth conditions (pH, temperature, nutrients)",
    optionD: "Most common are sparged stirred-tank bioreactors",
    correctOption: "A",
    explanation: "Bioreactors are large vessels designed for mass production of biological products in large volumes ($100-1000\\text{ L}$)."
  },
  {
    subject: "Biology",
    questionText: "If template strand is $3'-\\text{TACATGGCAAATATCCATTCA}-5'$, the synthesized mRNA transcript ($5' \\to 3'$) is:",
    optionA: "$5'-\\text{AUGUACCGUUUAUAGGGAAGU}-3'$",
    optionB: "$5'-\\text{ATGTACCGTTTATAGGTAAGT}-3'$",
    optionC: "$5'-\\text{AUGUACCGUUUAUAGGUAAGU}-3'$",
    optionD: "$5'-\\text{AUGUAAAGUUUAUAGGUAAGU}-3'$",
    correctOption: "C",
    explanation: "Complementary base pairing ($T \\to A, A \\to U, C \\to G, G \\to C$) gives $5'-\\text{AUGUACCGUUUAUAGGUAAGU}-3'$."
  },
  {
    subject: "Biology",
    questionText: "Match Drugs with Plant Sources/Effects:\nA. Cocaine, B. Heroin (Diacetylmorphine), C. Morphine, D. Marijuana (Cannabinoids)\nI. Potent surgical analgesic/sedative, II. Cannabis sativa, III. Erythroxylum coca, IV. Papaver somniferum latex",
    optionA: "A-II, B-I, C-III, D-IV",
    optionB: "A-III, B-IV, C-I, D-II",
    optionC: "A-IV, B-III, C-I, D-II",
    optionD: "A-I, B-III, C-II, D-IV",
    correctOption: "B",
    explanation: "Cocaine = Erythroxylum coca (III), Heroin = Papaver somniferum (IV), Morphine = Surgical sedative (I), Marijuana = Cannabis sativa (II)."
  },
  {
    subject: "Biology",
    questionText: "Match Prophase-I Subphases with Events:\nA. Diakinesis, B. Pachytene, C. Zygotene, D. Leptotene\nI. Synapsis / Synaptonemal complex, II. Terminalisation of chiasmata, III. Thread-like thin chromosomes, IV. Recombination nodules",
    optionA: "A-II, B-IV, C-I, D-III",
    optionB: "A-IV, B-III, C-II, D-I",
    optionC: "A-IV, B-II, C-III, D-I",
    optionD: "A-I, B-II, C-IV, D-III",
    correctOption: "A",
    explanation: "Diakinesis = Terminalisation (II), Pachytene = Recombination nodules (IV), Zygotene = Synapsis (I), Leptotene = Thin threads (III)."
  },
  {
    subject: "Biology",
    questionText: "In cockroaches, paired jointed filamentous sensory anal cerci are located on:",
    optionA: "8th and 9th segments",
    optionB: "11th segment",
    optionC: "5th segment",
    optionD: "10th abdominal tergum (in both male and female sexes)",
    correctOption: "D",
    explanation: "Anal cerci are 15-segmented paired sensory appendages attached to 10th tergum in both sexes."
  },
  {
    subject: "Biology",
    questionText: "Assertion (A): Breastfeeding is strongly recommended during initial infancy.\nReason (R): Yellowish colostrum milk is rich in secretory IgA antibodies providing passive immunity.",
    optionA: "A correct, R incorrect",
    optionB: "A incorrect, R correct",
    optionC: "Both A and R are TRUE and Reason is the correct explanation of Assertion",
    optionD: "Both true, not explanation",
    correctOption: "C",
    explanation: "Colostrum contains maternal IgA antibodies protecting newborn's gastrointestinal tract from pathogens."
  },
  {
    subject: "Biology",
    questionText: "Match Marine/Freshwater Fishes:\nA. Pterophyllum, B. Myxine, C. Pristis, D. Exocoetus\nI. Hagfish (Cyclostome), II. Sawfish (Chondrichthyes), III. Angelfish (Aquarium teleost), IV. Flying fish (Marine teleost)",
    optionA: "A-IV, B-I, C-II, D-III",
    optionB: "A-III, B-II, C-I, D-IV",
    optionC: "A-II, B-I, C-III, D-IV",
    optionD: "A-III, B-I, C-II, D-IV",
    correctOption: "D",
    explanation: "Pterophyllum = Angelfish (III), Myxine = Hagfish (I), Pristis = Sawfish (II), Exocoetus = Flying fish (IV)."
  },
  {
    subject: "Biology",
    questionText: "Match Muscle Types with Histology and Locations:\n(a) Skeletal muscle with striations, (b) Smooth spindle-shaped visceral muscle, (c) Cardiac muscle with intercalated discs",
    optionA: "Skeletal - Biceps, Involuntary - Intestine, Smooth - Heart",
    optionB: "Involuntary - Nose, Skeletal - Bone, Cardiac - Heart",
    optionC: "Smooth - Toes, Skeletal - Legs, Cardiac - Heart",
    optionD: "(a) Skeletal striated - Triceps/Biceps; (b) Smooth non-striated - Stomach/Intestine; (c) Cardiac branching - Heart myocardium",
    correctOption: "D",
    explanation: "Striated somatic = Triceps/Biceps (a); Unstriated visceral = Stomach wall (b); Branching intercalated = Myocardium (c)."
  },
  {
    subject: "Biology",
    questionText: "Which of the following is a PEPTIDE hormone and NOT a steroid hormone?",
    optionA: "Progesterone (Steroid)",
    optionB: "Glucagon (29 amino acid linear peptide hormone secreted by $\\alpha$-islet cells)",
    optionC: "Cortisol (Steroid)",
    optionD: "Testosterone (Steroid)",
    correctOption: "B",
    explanation: "Glucagon is a polypeptide hormone synthesized by pancreatic alpha cells; cortisol, progesterone, and testosterone are steroids."
  },
  {
    subject: "Biology",
    questionText: "Match Joints with Examples:\nA. Fibrous joint, B. Cartilaginous joint, C. Hinge joint, D. Ball and socket joint\nI. Intervertebral discs, II. Shoulder / Hip girdle, III. Skull sutures (Synarthrosis), IV. Knee / Elbow joint",
    optionA: "A-II, B-III, C-I, D-IV",
    optionB: "A-III, B-I, C-IV, D-II",
    optionC: "A-IV, B-II, C-III, D-I",
    optionD: "A-I, B-III, C-II, D-IV",
    correctOption: "B",
    explanation: "Skull sutures = Fibrous (III), Vertebral discs = Cartilaginous (I), Knee = Hinge (IV), Shoulder = Ball & socket (II)."
  },
  {
    subject: "Biology",
    questionText: "Assertion (A): FSH acts upon ovarian follicles in female and Leydig cells in male.\nReason (R): Ovarian follicles secrete estrogen, while interstitial Leydig cells secrete androgens.",
    optionA: "A is true, R false",
    optionB: "Assertion (A) is FALSE (FSH acts on Sertoli cells in males, LH acts on Leydig cells) while Reason (R) is TRUE",
    optionC: "Both true",
    optionD: "Both false",
    correctOption: "B",
    explanation: "In males, LH/ICSH acts on Leydig cells to stimulate testosterone, while FSH acts on Sertoli cells."
  },
  {
    subject: "Biology",
    questionText: "Match Respiratory Capacities:\nA. Expiratory capacity, B. Functional residual capacity (FRC), C. Vital capacity (VC), D. Inspiratory capacity (IC)\nI. $ERV + TV + IRV$, II. $TV + ERV$, III. $TV + IRV$, IV. $ERV + RV$",
    optionA: "A-II, B-I, C-IV, D-III",
    optionB: "A-I, B-III, C-II, D-IV",
    optionC: "A-II, B-IV, C-I, D-III",
    optionD: "A-III, B-II, C-IV, D-I",
    correctOption: "C",
    explanation: "$EC = TV + ERV$ (II), $FRC = ERV + RV$ (IV), $VC = ERV + TV + IRV$ (I), $IC = TV + IRV$ (III)."
  },
  {
    subject: "Biology",
    questionText: "Correct sequence of cell cycle phases is:\nA. $G_2$ phase, B. Cytokinesis, C. S phase, D. Karyokinesis, E. $G_1$ phase",
    optionA: "B-D-E-A-C",
    optionB: "$G_1$ (E) $\\to$ S (C) $\\to G_2$ (A) $\\to$ Karyokinesis (D) $\\to$ Cytokinesis (B)",
    optionC: "C-E-D-A-B",
    optionD: "E-B-D-A-C",
    correctOption: "B",
    explanation: "Interphase progression: $G_1 \\to S \\to G_2$ followed by M-phase (Karyokinesis $\\to$ Cytokinesis)."
  },
  {
    subject: "Biology",
    questionText: "Which of the following are recognized AUTOIMMUNE disorders?\nA. Myasthenia gravis\nB. Rheumatoid arthritis\nC. Gout\nD. Muscular dystrophy\nE. Systemic Lupus Erythematosus (SLE)",
    optionA: "B, C & E only",
    optionB: "C, D & E only",
    optionC: "A, B & D only",
    optionD: "A, B & E only (Myasthenia gravis, Rheumatoid arthritis, and SLE)",
    correctOption: "D",
    explanation: "Myasthenia gravis (anti-AChR), Rheumatoid arthritis (anti-IgG RF), and SLE (anti-dsDNA) are autoimmune disorders."
  },
  {
    subject: "Biology",
    questionText: "Which anatomical structure is NOT a part of the human Fallopian Tube (Oviduct)?",
    optionA: "Infundibulum with fimbriae",
    optionB: "Ampulla",
    optionC: "Uterine Fundus (Dome-shaped superior region of uterus)",
    optionD: "Isthmus",
    correctOption: "C",
    explanation: "Fallopian tube consists of infundibulum, ampulla, and isthmus; fundus is the dome of the uterus."
  },
  {
    subject: "Biology",
    questionText: "If father is $B^+$, mother $A^+$, and child is $O^+$, the parental genotypes MUST be:",
    optionA: "$I^B i$ (Father), $I^A i$ (Mother), $ii$ (Child) (A only)",
    optionB: "$I^B I^B, I^A I^A, ii$",
    optionC: "$I^A I^B, i I^A, I^B i$",
    optionD: "$I^A i, I^B i, I^A i$",
    correctOption: "A",
    explanation: "For an O-group ($ii$) child, each heterozygous parent must contribute one recessive '$i$' allele: Father $I^B i$ and Mother $I^A i$."
  },
  {
    subject: "Biology",
    questionText: "Match Endocrine Disorders with Features:\nA. Exophthalmic goitre (Graves' disease), B. Acromegaly, C. Cushing's syndrome, D. Cretinism\nI. Hypercortisolemia / moon face, II. Congenital hypothyroidism / stunted growth, III. Hyperthyroidism / protruding eyes, IV. Adult excess growth hormone",
    optionA: "A-III, B-IV, C-II, D-I",
    optionB: "A-III, B-IV, C-I, D-II",
    optionC: "A-I, B-III, C-II, D-IV",
    optionD: "A-IV, B-II, C-I, D-III",
    correctOption: "B",
    explanation: "Graves = Hyperthyroid/protruding eyes (III), Acromegaly = Adult GH (IV), Cushing = Cortisol excess (I), Cretinism = Infantile hypothyroidism (II)."
  },
  {
    subject: "Biology",
    questionText: "Match Geological Eras with Dominant Fauna:\nA. Mesozoic Era, B. Proterozoic Era, C. Cenozoic Era, D. Paleozoic Era\nI. Invertebrates/primitive life, II. Fishes & Amphibians, III. Age of Reptiles & Dinosaurs, IV. Age of Mammals & Birds",
    optionA: "A-I, B-II, C-IV, D-III",
    optionB: "A-III, B-I, C-IV, D-II",
    optionC: "A-II, B-I, C-III, D-IV",
    optionD: "A-III, B-I, C-II, D-IV",
    correctOption: "B",
    explanation: "Mesozoic = Reptiles (III), Proterozoic = Early invertebrates (I), Cenozoic = Mammals (IV), Paleozoic = Fishes & Amphibia (II)."
  },
  {
    subject: "Biology",
    questionText: "Which anatomical statements are TRUE for NON-CHORDATES?\nA. Pharyngeal gill slits present\nB. Notochord is absent\nC. CNS is dorsal\nD. Heart is dorsal (if present)\nE. Post-anal tail is absent",
    optionA: "B, D & E only",
    optionB: "B, C & D only",
    optionC: "A & C only",
    optionD: "A, B & D only",
    correctOption: "A",
    explanation: "Non-chordates lack notochord (B), possess a ventral nerve cord, dorsal heart (D), and lack post-anal tail (E)."
  },
  {
    subject: "Biology",
    questionText: "Statement I: Cerebral hemispheres are interconnected by transverse axon tract corpus callosum.\nStatement II: Brainstem consists of midbrain, pons, and medulla oblongata (cerebrum is forebrain).",
    optionA: "Statement I is correct but Statement II is incorrect (Brainstem includes Midbrain, Pons, Medulla; cerebrum is forebrain)",
    optionB: "Statement I incorrect, II correct",
    optionC: "Both correct",
    optionD: "Both incorrect",
    correctOption: "A",
    explanation: "Statement I is true. Statement II is false because brainstem consists of midbrain, pons, and medulla oblongata, excluding cerebrum."
  },
  {
    subject: "Biology",
    questionText: "Match Glandular Epithelia with Examples:\nA. Unicellular glandular, B. Compound stratified, C. Multicellular glandular, D. Endocrine glandular\nI. Salivary glands, II. Pancreas islets / Thyroid, III. Goblet cells of intestine, IV. Moist buccal mucosa",
    optionA: "A-III, B-IV, C-I, D-II",
    optionB: "A-II, B-I, C-IV, D-III",
    optionC: "A-II, B-I, C-III, D-IV",
    optionD: "A-IV, B-III, C-I, D-II",
    correctOption: "A",
    explanation: "Unicellular = Goblet cells (III), Compound = Buccal mucosa (IV), Multicellular = Salivary glands (I), Endocrine = Pancreas islets (II)."
  },
  {
    subject: "Biology",
    questionText: "Match ECG Waves with Cardiac Events:\nA. P wave, B. QRS complex, C. T wave, D. T-P interval\nI. Electrical diastole, II. Depolarisation of ventricles, III. Depolarisation of atria, IV. Repolarisation of ventricles",
    optionA: "A-II, B-III, C-I, D-IV",
    optionB: "A-IV, B-II, C-I, D-III",
    optionC: "A-I, B-III, C-IV, D-II",
    optionD: "A-III, B-II, C-IV, D-I",
    correctOption: "D",
    explanation: "P = Atrial depolarisation (III), QRS = Ventricular depolarisation (II), T = Ventricular repolarisation (IV), T-P = Diastole (I)."
  },
  {
    subject: "Biology",
    questionText: "Statement I: Mitochondria and chloroplasts are both double-membrane bound organelles.\nStatement II: Inner mitochondrial membrane has very low permeability compared to outer membrane due to cardiolipin.",
    optionA: "Statement I is correct but Statement II is incorrect",
    optionB: "Statement I incorrect, II correct",
    optionC: "Both Statement I and Statement II are TRUE",
    optionD: "Both incorrect",
    correctOption: "A",
    explanation: "Statement I is true. Statement II (comparing inner membrane of chloroplast) is considered incorrect in official key; key 1 accepted."
  },
  {
    subject: "Biology",
    questionText: "Match Cockroach Anatomy:\nA. Food storage crop, B. 6-8 Hepatic caeca at foregut-midgut, C. 100-150 yellow Malpighian tubules at midgut-hindgut, D. Gizzard proventriculus with chitinous teeth for grinding",
    optionA: "A-IV, B-III, C-II, D-I",
    optionB: "A-III, B-II, C-IV, D-I",
    optionC: "A-IV, B-II, C-III, D-I",
    optionD: "A-I, B-II, C-III, D-IV",
    correctOption: "C",
    explanation: "Crop = Storage (IV), Hepatic caeca = Enzyme secretion (II), Malpighian tubules = Excretion (III), Gizzard = Grinding (I)."
  },
  {
    subject: "Biology",
    questionText: "Match Molecular Components with Functions in Gene Expression:\nA. RNA polymerase III, B. Transcription termination, C. Spliceosome snRNPs, D. TATA box (Pribnow/Goldberg-Hogness)\nI. Splicing of pre-mRNA introns, II. Core promoter sequence, III. Rho factor termination, IV. Synthesizes tRNA, 5S rRNA, snRNA",
    optionA: "A-III, B-IV, C-I, D-II",
    optionB: "A-IV, B-III, C-I, D-II",
    optionC: "A-II, B-IV, C-I, D-III",
    optionD: "A-III, B-II, C-IV, D-I",
    correctOption: "B",
    explanation: "RNA Pol III = tRNA/5S rRNA (IV), Rho = Termination (III), snRNPs = Splicing (I), TATA box = Promoter (II)."
  },
  {
    subject: "Biology",
    questionText: "In spermatogenesis regulation: GnRH acts on anterior pituitary to release LH (acting on B: Leydig cells to secrete androgens) and A: FSH (acting on C: Sertoli cells to stimulate factor for D: spermiogenesis):",
    optionA: "FSH, Sertoli Cells, Leydig cells, spermatogenesis",
    optionB: "ICSH, Leydig Cells, Sertoli cells, spermatogenesis",
    optionC: "(A) FSH, (B) Leydig cells, (C) Sertoli cells, (D) Spermiogenesis",
    optionD: "ICSH, Interstitial cells, Leydig cells, spermiogenesis",
    correctOption: "C",
    explanation: "FSH binds Sertoli cells stimulating ABP and factors necessary for spermiogenesis; LH triggers Leydig cell testosterone secretion."
  },
  {
    subject: "Biology",
    questionText: "Which statement is CORRECT regarding Juxtamedullary Nephrons (~15% of all nephrons)?",
    optionA: "Loop of Henle of juxtamedullary nephron is very long and runs deep into inner renal medulla",
    optionB: "Juxtamedullary nephrons outnumber cortical nephrons",
    optionC: "Located in columns of Bertini",
    optionD: "Renal corpuscle lies in medulla",
    correctOption: "A",
    explanation: "Juxtamedullary nephrons have glomeruli near corticomedullary junction and long loops of Henle plunging deep into inner medulla for countercurrent concentration."
  },
  {
    subject: "Biology",
    questionText: "Statement I: Gause's principle states two species competing for identical limiting resources cannot coexist indefinitely.\nStatement II: According to Gause, competitively inferior species will be eliminated under limiting resources.",
    optionA: "Statement I true, II false",
    optionB: "Statement I false, II true",
    optionC: "Both Statement I and Statement II are TRUE",
    optionD: "Both false",
    correctOption: "C",
    explanation: "Gause's competitive exclusion principle holds that two species competing for the same limiting resources cannot sustainably coexist."
  },
  {
    subject: "Biology",
    questionText: "Statement I: Bone marrow is the primary lymphoid organ where all blood cells including B and T lymphocytes are generated.\nStatement II: Both bone marrow and thymus provide specialized microenvironments for lymphocyte maturation.",
    optionA: "Statement I correct, II incorrect",
    optionB: "Statement I incorrect, II correct",
    optionC: "Both Statement I and Statement II are TRUE",
    optionD: "Both incorrect",
    correctOption: "C",
    explanation: "Primary lymphoid organs (bone marrow and thymus) generate and educate lymphocytes into antigen-sensitive immunocompetent cells."
  },
  {
    subject: "Biology",
    questionText: "Select the correct sequential steps in the catalytic cycle of an enzyme action:\nA. Substrate-enzyme complex formation\nB. Free enzyme ready to bind another substrate\nC. Product release\nD. Transition state chemical bond transformation\nE. Substrate binding to active site",
    optionA: "B, A, C, D, E",
    optionB: "E, D, C, B, A",
    optionC: "E (Binding) $\\to$ A (Complex) $\\to$ D (Bond breakage/making) $\\to$ C (Product release) $\\to$ B (Free enzyme recycled)",
    optionD: "A, E, B, D, C",
    correctOption: "C",
    explanation: "Catalytic cycle: Substrate binds active site (E) $\\to$ ES complex forms (A) $\\to$ Catalysis of bonds (D) $\\to$ Products released (C) $\\to$ Free enzyme ready (B)."
  }
];

async function seedNeet2024Paper() {
  console.log(`🚀 Compiling NEET 2024 Paper JSON with ${rawQuestions.length} complete questions...`);

  const paperData = {
    examName: "NEET",
    year: 2024,
    shiftName: "NEET 2024",
    examDate: "2024-05-05T14:00:00Z",
    totalMarks: 720,
    totalQuestions: 200,
    durationMinutes: 200,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'NEET 2024.json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved NEET 2024 JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding NEET 2024 Shift into Database via Prisma...`);
  
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
      name: "NEET 2024"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "NEET 2024",
      date: new Date("2024-05-05T14:00:00Z")
    }
  });
  console.log(`Created Shift "NEET 2024" (ID: ${shift.id})`);

  console.log(`Inserting ${rawQuestions.length} questions in exact 1..200 sequence...`);
  for (let i = 0; i < rawQuestions.length; i++) {
    const q = rawQuestions[i];
    const cleanImg = q.imageUrl ? path.basename(q.imageUrl) : null;
    await prisma.question.create({
      data: {
        shiftId: shift.id,
        subject: q.subject,
        questionText: q.questionText,
        imageUrl: cleanImg,
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

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for NEET 2024 in PostgreSQL!`);
}

seedNeet2024Paper()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
