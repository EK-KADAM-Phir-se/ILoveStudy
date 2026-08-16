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
// 1. Generate Crisp Vector SVGs for NEET 2018
// ---------------------------------------------------------------------

// Q1: V vs T straight line passing through origin (Isobaric)
saveSvg('neet_2018_q1.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 220" width="100%" height="180">
  <rect width="340" height="220" fill="#0f172a" rx="16"/>
  <line x1="60" y1="180" x2="300" y2="180" stroke="#94a3b8" stroke-width="2"/>
  <line x1="60" y1="180" x2="60" y2="30" stroke="#94a3b8" stroke-width="2"/>
  <text x="40" y="35" fill="#f8fafc" font-family="sans-serif" font-size="14">V</text>
  <text x="305" y="185" fill="#f8fafc" font-family="sans-serif" font-size="14">T</text>
  <text x="48" y="195" fill="#94a3b8" font-family="sans-serif" font-size="12">O</text>

  <!-- Line from origin passing through A and B -->
  <line x1="60" y1="180" x2="260" y2="60" stroke="#38bdf8" stroke-width="3"/>
  <circle cx="140" cy="132" r="5" fill="#f59e0b"/>
  <text x="135" y="120" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="13">A</text>
  <circle cx="210" cy="90" r="5" fill="#f59e0b"/>
  <text x="205" y="78" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="13">B</text>

  <!-- Arrow along line -->
  <polygon points="180,108 170,108 176,118" fill="#38bdf8"/>
  <text x="180" y="160" fill="#10b981" font-family="sans-serif" font-size="12">V ∝ T ⟹ Isobaric (P = const)</text>
</svg>`);

// Q7: Short circuited battery cells (I vs n)
saveSvg('neet_2018_q7.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 220" width="100%" height="180">
  <rect width="340" height="220" fill="#0f172a" rx="16"/>
  <line x1="60" y1="180" x2="300" y2="180" stroke="#94a3b8" stroke-width="2"/>
  <line x1="60" y1="180" x2="60" y2="30" stroke="#94a3b8" stroke-width="2"/>
  <text x="40" y="35" fill="#f8fafc" font-family="sans-serif" font-size="14">I</text>
  <text x="305" y="185" fill="#f8fafc" font-family="sans-serif" font-size="14">n</text>
  <text x="48" y="195" fill="#94a3b8" font-family="sans-serif" font-size="12">O</text>

  <!-- Horizontal line I = E/r (Independent of n) -->
  <line x1="60" y1="100" x2="280" y2="100" stroke="#10b981" stroke-width="3.5"/>
  <text x="170" y="85" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle">I = nE / nr = E/r (Constant)</text>
</svg>`);

// Q15: Transistor Common Emitter Circuit
saveSvg('neet_2018_q15.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="200">
  <rect width="400" height="240" fill="#0f172a" rx="16"/>
  <!-- Input Vi -->
  <text x="30" y="125" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="14">Vi = 20V</text>
  <circle cx="95" cy="120" r="4" fill="#38bdf8"/>
  <line x1="95" y1="120" x2="130" y2="120" stroke="#94a3b8" stroke-width="2"/>
  <!-- RB = 500k -->
  <path d="M130 120 L135 110 L145 130 L155 110 L165 130 L170 120" fill="none" stroke="#38bdf8" stroke-width="2"/>
  <text x="150" y="100" fill="#38bdf8" font-family="sans-serif" font-size="11" text-anchor="middle">RB = 500 kΩ</text>
  <line x1="170" y1="120" x2="210" y2="120" stroke="#94a3b8" stroke-width="2"/>

  <!-- NPN Transistor symbol -->
  <circle cx="230" cy="120" r="26" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
  <line x1="210" y1="105" x2="210" y2="135" stroke="#f8fafc" stroke-width="3"/>
  <line x1="210" y1="112" x2="235" y2="95" stroke="#94a3b8" stroke-width="2"/>
  <line x1="210" y1="128" x2="235" y2="145" stroke="#94a3b8" stroke-width="2"/>
  <polygon points="235,145 224,136 230,130" fill="#94a3b8"/>

  <!-- Collector circuit to 20V with RC = 4k -->
  <line x1="235" y1="95" x2="235" y2="60" stroke="#94a3b8" stroke-width="2"/>
  <path d="M235 60 L225 55 L245 45 L225 35 L245 25 L235 20" fill="none" stroke="#f59e0b" stroke-width="2"/>
  <text x="270" y="45" fill="#f59e0b" font-family="sans-serif" font-size="11">RC = 4 kΩ</text>
  <text x="235" y="15" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle">+20 V</text>

  <!-- Emitter Grounded -->
  <line x1="235" y1="145" x2="235" y2="200" stroke="#94a3b8" stroke-width="2"/>
  <line x1="220" y1="200" x2="250" y2="200" stroke="#94a3b8" stroke-width="2"/>
  <line x1="226" y1="205" x2="244" y2="205" stroke="#94a3b8" stroke-width="1.5"/>
</svg>`);

// Q30: Loop the loop frictionless track
saveSvg('neet_2018_q30.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 220" width="100%" height="180">
  <rect width="380" height="220" fill="#0f172a" rx="16"/>
  <!-- Track -->
  <path d="M50 40 L160 180 A 50 50 0 1 0 260 180 L340 180" fill="none" stroke="#38bdf8" stroke-width="3"/>
  <!-- Height h -->
  <line x1="50" y1="40" x2="50" y2="180" stroke="#94a3b8" stroke-dasharray="3 3" stroke-width="1.5"/>
  <line x1="40" y1="180" x2="340" y2="180" stroke="#64748b" stroke-width="1.5"/>
  <text x="35" y="115" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="13">h</text>

  <!-- Circle Diameter AB = D -->
  <line x1="210" y1="80" x2="210" y2="180" stroke="#f59e0b" stroke-dasharray="2 2" stroke-width="1.5"/>
  <text x="210" y="70" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">B</text>
  <text x="210" y="195" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">A</text>
  <text x="225" y="135" fill="#f59e0b" font-family="sans-serif" font-size="11">D</text>

  <text x="120" y="210" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="12">h = 5/2 R = 5/4 D</text>
</svg>`);

// Q35: Smooth inclined wedge
saveSvg('neet_2018_q35.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 200" width="100%" height="160">
  <rect width="340" height="200" fill="#0f172a" rx="16"/>
  <!-- Wedge ABC -->
  <polygon points="60,40 60,160 260,160" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  <text x="50" y="35" fill="#f8fafc" font-family="sans-serif" font-size="13">A</text>
  <text x="50" y="175" fill="#f8fafc" font-family="sans-serif" font-size="13">C</text>
  <text x="270" y="175" fill="#f8fafc" font-family="sans-serif" font-size="13">B</text>
  <text x="210" y="155" fill="#f59e0b" font-family="sans-serif" font-size="12">θ</text>

  <!-- Block m on incline -->
  <rect x="130" y="75" width="30" height="20" transform="rotate(-31 130 75)" fill="#1e293b" stroke="#f59e0b" stroke-width="2" rx="3"/>
  <text x="140" y="85" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="11">m</text>

  <!-- Acceleration a arrow -->
  <line x1="200" y1="100" x2="280" y2="100" stroke="#10b981" stroke-width="3"/>
  <polygon points="285,100 270,94 270,106" fill="#10b981"/>
  <text x="295" y="105" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="14">a</text>
</svg>`);

// Q39: Planet elliptical orbit
saveSvg('neet_2018_q39.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 200" width="100%" height="160">
  <rect width="380" height="200" fill="#0f172a" rx="16"/>
  <!-- Ellipse -->
  <ellipse cx="190" cy="100" rx="140" ry="70" fill="none" stroke="#38bdf8" stroke-width="2"/>
  <!-- Major axis AC -->
  <line x1="50" y1="100" x2="330" y2="100" stroke="#64748b" stroke-dasharray="2 2" stroke-width="1.5"/>
  <circle cx="50" cy="100" r="5" fill="#ef4444"/>
  <text x="35" y="105" fill="#ef4444" font-family="sans-serif" font-weight="bold" font-size="13">A</text>
  <circle cx="330" cy="100" r="5" fill="#38bdf8"/>
  <text x="340" y="105" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="13">C</text>

  <!-- Sun S at Focus -->
  <circle cx="100" cy="100" r="8" fill="#f59e0b"/>
  <text x="100" y="125" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">S</text>

  <!-- Position B perpendicular to major axis -->
  <line x1="100" y1="100" x2="100" y2="40" stroke="#64748b" stroke-dasharray="2 2" stroke-width="1.5"/>
  <circle cx="100" cy="40" r="5" fill="#10b981"/>
  <text x="100" y="30" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle">B</text>

  <text x="240" y="180" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="12">KA > KB > KC</text>
</svg>`);

console.log("NEET 2018 SVGs generated!");

// ---------------------------------------------------------------------
// 2. Complete 180 Questions for NEET 2018 (Phy 1-45, Chem 46-90, Bio 91-180)
// ---------------------------------------------------------------------
const rawQuestions = [
  // -------------------------------------------------------------
  // PHYSICS (Q1 - Q45)
  // -------------------------------------------------------------
  {
    subject: "Physics",
    questionText: "Volume $V$ of a monoatomic gas varies with temperature $T$ as a straight line passing through origin. The ratio of work done to heat absorbed ($W/Q$) is:",
    imageUrl: "/neetimages/neet_2018_q1.svg",
    optionA: "$1/3$",
    optionB: "$2/3$",
    optionC: "$2/5$",
    optionD: "$2/7$",
    correctOption: "C",
    explanation: "$V \\propto T \\implies$ Isobaric process ($P = \\text{const}$). $W = n R \\Delta T$ and $Q = n C_p \\Delta T = n (\\frac{5}{2} R) \\Delta T \\implies \\frac{W}{Q} = \\frac{R}{5/2 R} = \\frac{2}{5}$."
  },
  {
    subject: "Physics",
    questionText: "The fundamental frequency of an open organ pipe equals the 3rd harmonic of a closed organ pipe of length $20\\text{ cm}$. Length of open organ pipe is:",
    optionA: "$12.5\\text{ cm}$",
    optionB: "$8\\text{ cm}$",
    optionC: "$13.2\\text{ cm}$",
    optionD: "$16\\text{ cm}$",
    correctOption: "C",
    explanation: "$\\frac{v}{2 L_o} = 3\\left(\\frac{v}{4 L_c}\\right) \\implies L_o = \\frac{2 L_c}{3} = \\frac{2 \\times 20}{3} = 13.33\\text{ cm} \\approx 13.2\\text{ cm}$."
  },
  {
    subject: "Physics",
    questionText: "At what temperature will the rms speed of oxygen molecules become equal to escape velocity from Earth ($v_e = 11.2\\text{ km/s}$)? ($m = 2.76 \\times 10^{-26}\\text{ kg}, k_B = 1.38 \\times 10^{-23}\\text{ J/K}$):",
    optionA: "$5.016 \\times 10^4\\text{ K}$",
    optionB: "$8.360 \\times 10^4\\text{ K}$",
    optionC: "$2.508 \\times 10^4\\text{ K}$",
    optionD: "$1.254 \\times 10^4\\text{ K}$",
    correctOption: "B",
    explanation: "$v_{\\text{rms}} = \\sqrt{\\frac{3 k_B T}{m}} = 11.2 \\times 10^3 \\implies T = \\frac{(11.2 \\times 10^3)^2 \\times (2.76 \\times 10^{-26})}{3 \\times (1.38 \\times 10^{-23})} = 8.36 \\times 10^4\\text{ K}$."
  },
  {
    subject: "Physics",
    questionText: "The efficiency of an ideal Carnot heat engine working between freezing point ($0^\\circ\\text{C} = 273\\text{ K}$) and boiling point ($100^\\circ\\text{C} = 373\\text{ K}$) of water is:",
    optionA: "$6.25\\%$",
    optionB: "$20\\%$",
    optionC: "$26.8\\%$",
    optionD: "$12.5\\%$",
    correctOption: "C",
    explanation: "$\\eta = 1 - \\frac{T_C}{T_H} = 1 - \\frac{273}{373} = \\frac{100}{373} = 0.268 = 26.8\\%$."
  },
  {
    subject: "Physics",
    questionText: "A carbon resistor of $(47 \\pm 4.7)\\text{ k}\\Omega = 47 \\times 10^3\\,\\Omega \\pm 10\\%$ has colour band sequence:",
    optionA: "Yellow - Green - Violet - Gold",
    optionB: "Yellow - Violet - Orange - Silver",
    optionC: "Violet - Yellow - Orange - Silver",
    optionD: "Green - Orange - Violet - Gold",
    correctOption: "B",
    explanation: "Yellow ($4$), Violet ($7$), Orange ($10^3$), Silver ($10\\%$ tolerance)."
  },
  {
    subject: "Physics",
    questionText: "A set of $n$ equal resistors $R$ connected in series with battery $(E, R)$ gives current $I$. When connected in parallel to same battery, current is $10I$. Value of $n$ is:",
    optionA: "20",
    optionB: "11",
    optionC: "10",
    optionD: "9",
    correctOption: "C",
    explanation: "$I_s = \\frac{E}{n R + R} = \\frac{E}{R(n+1)}$. $I_p = \\frac{E}{R/n + R} = \\frac{n E}{R(n+1)}$. Ratio $I_p / I_s = n = 10$."
  },
  {
    subject: "Physics",
    questionText: "A battery of $n$ identical cells with internal resistance $r$ in series is short-circuited. Graph showing relationship between current $I$ and $n$ is:",
    imageUrl: "/neetimages/neet_2018_q7.svg",
    optionA: "Linearly increasing with $n$",
    optionB: "Parabola",
    optionC: "Horizontal line independent of $n$",
    optionD: "Decaying exponential",
    correctOption: "C",
    explanation: "$I = \\frac{n E}{n r} = \\frac{E}{r} = \\text{constant}$ (independent of $n$)."
  },
  {
    subject: "Physics",
    questionText: "Unpolarised light falls on dielectric interface $\\mu$ at Brewster's angle $i_p$. Reflected and refracted rays are perpendicular. The correct statement is:",
    optionA: "$i = \\sin^{-1}(1/\\mu)$",
    optionB: "Reflected light is polarized with electric vector perpendicular to plane of incidence",
    optionC: "Reflected light is polarized with electric vector parallel to plane of incidence",
    optionD: "$i = \\tan^{-1}(1/\\mu)$",
    correctOption: "B",
    explanation: "According to Brewster's law, reflected light is completely linearly polarized with electric field oscillations perpendicular to plane of incidence."
  },
  {
    subject: "Physics",
    questionText: "In YDSE with $d = 2\\text{ mm}, \\lambda = 5896\\text{ Å}$, angular fringe width is $0.20^\\circ$. To increase angular width to $0.21^\\circ$, slit separation must be changed to:",
    optionA: "$2.1\\text{ mm}$",
    optionB: "$1.9\\text{ mm}$",
    optionC: "$1.8\\text{ mm}$",
    optionD: "$1.7\\text{ mm}$",
    correctOption: "B",
    explanation: "$\\theta = \\frac{\\lambda}{d} \\implies \\theta_1 d_1 = \\theta_2 d_2 \\implies 0.20 \\times 2 = 0.21 \\times d_2 \\implies d_2 = \\frac{0.40}{0.21} = 1.9\\text{ mm}$."
  },
  {
    subject: "Physics",
    questionText: "An astronomical refracting telescope has large angular magnification and high angular resolution when its objective has:",
    optionA: "Large focal length and large diameter",
    optionB: "Large focal length and small diameter",
    optionC: "Small focal length and large diameter",
    optionD: "Small focal length and small diameter",
    correctOption: "A",
    explanation: "Magnification $m = f_o / f_e$ requires large $f_o$; Resolving power $\\propto D / \\lambda$ requires large objective aperture $D$."
  },
  {
    subject: "Physics",
    questionText: "The ratio of kinetic energy to total energy ($KE : E$) of an electron in a Bohr orbit of hydrogen atom is:",
    optionA: "$2 : -1$",
    optionB: "$1 : -1$",
    optionC: "$1 : 1$",
    optionD: "$1 : -2$",
    correctOption: "B",
    explanation: "$E = -KE \\implies \\frac{KE}{E} = \\frac{KE}{-KE} = 1 : -1$."
  },
  {
    subject: "Physics",
    questionText: "Electron with velocity $\\vec{v} = v_0 \\hat{i}$ enters electric field $\\vec{E} = -E_0 \\hat{i}$. If initial wavelength is $\\lambda_0$, wavelength at time $t$ is:",
    optionA: "$\\lambda_0 t$",
    optionB: "$\\lambda_0 \\left(1 + \\frac{e E_0}{m v_0} t\\right)$",
    optionC: "$\\frac{\\lambda_0}{1 + \\frac{e E_0}{m v_0} t}$",
    optionD: "$\\lambda_0$",
    correctOption: "C",
    explanation: "$a = \\frac{e E_0}{m}$ along $+x$. $v(t) = v_0 + at = v_0\\left(1 + \\frac{e E_0}{m v_0}t\\right) \\implies \\lambda(t) = \\frac{h}{m v(t)} = \\frac{\\lambda_0}{1 + \\frac{e E_0}{m v_0}t}$."
  },
  {
    subject: "Physics",
    questionText: "Radioactive material half-life is $10\\text{ min}$. If initially there are 600 nuclei, time taken for disintegration of 450 nuclei is:",
    optionA: "$30\\text{ min}$",
    optionB: "$10\\text{ min}$",
    optionC: "$20\\text{ min}$",
    optionD: "$15\\text{ min}$",
    correctOption: "C",
    explanation: "Remaining nuclei $= 600 - 450 = 150 = \\frac{600}{4} = \\frac{N_0}{2^2} \\implies 2\\text{ half-lives} = 2 \\times 10 = 20\\text{ min}$."
  },
  {
    subject: "Physics",
    questionText: "Incident light of $2\\nu_0$ gives maximum velocity $v_1$. When frequency is $5\\nu_0$, maximum velocity is $v_2$. Ratio $v_1 : v_2$ is:",
    optionA: "$4 : 1$",
    optionB: "$1 : 4$",
    optionC: "$1 : 2$",
    optionD: "$2 : 1$",
    correctOption: "C",
    explanation: "$\\frac{1}{2} m v_1^2 = 2h\\nu_0 - h\\nu_0 = h\\nu_0$. $\\frac{1}{2} m v_2^2 = 5h\\nu_0 - h\\nu_0 = 4h\\nu_0 \\implies \\frac{v_1}{v_2} = \\sqrt{\\frac{1}{4}} = 1 : 2$."
  },
  {
    subject: "Physics",
    questionText: "Transistor amplifier with $V_i = 20\\text{ V}, R_B = 500\\text{ k}\\Omega, R_C = 4\\text{ k}\\Omega, V_{BE} = 0, V_{CE} = 0$. Values of $I_B, I_C, \\beta$ are:",
    imageUrl: "/neetimages/neet_2018_q15.svg",
    optionA: "$I_B = 20\\,\\mu\\text{A}, I_C = 5\\text{ mA}, \\beta = 250$",
    optionB: "$I_B = 25\\,\\mu\\text{A}, I_C = 5\\text{ mA}, \\beta = 200$",
    optionC: "$I_B = 40\\,\\mu\\text{A}, I_C = 10\\text{ mA}, \\beta = 250$",
    optionD: "$I_B = 40\\,\\mu\\text{A}, I_C = 5\\text{ mA}, \\beta = 125$",
    correctOption: "D",
    explanation: "$I_B = \\frac{20}{500 \\times 10^3} = 40\\,\\mu\\text{A}$. $I_C = \\frac{20}{4 \\times 10^3} = 5\\text{ mA}$. $\\beta = \\frac{I_C}{I_B} = \\frac{5 \\times 10^{-3}}{40 \\times 10^{-6}} = 125$."
  },
  {
    subject: "Physics",
    questionText: "In a p-n junction diode, change in temperature due to heating:",
    optionA: "Does not affect resistance",
    optionB: "Affects only forward resistance",
    optionC: "Affects only reverse resistance",
    optionD: "Affects the overall V-I characteristics of p-n junction",
    correctOption: "D",
    explanation: "Thermal energy creates electron-hole pairs, reducing barrier potential in forward bias and increasing reverse saturation current."
  },
  {
    subject: "Physics",
    questionText: "In gate combination (A with inverter and B with inverter fed into parallel NAND/NOR), output $Y$ is:",
    optionA: "$\\overline{A \\cdot B} + A \\cdot B$",
    optionB: "$A \\cdot \\overline{B} + \\overline{A} \\cdot B$ (XOR Gate)",
    optionC: "$\\overline{A \\cdot B}$",
    optionD: "$A + B$",
    correctOption: "B",
    explanation: "The logic combination implements XOR gate function $Y = A\\bar{B} + \\bar{A}B$."
  },
  {
    subject: "Physics",
    questionText: "EM wave propagates along $+x$ ($\vec{v} = v\\hat{i}$) with oscillating electric field along $+y$ ($\vec{E} = E\\hat{j}$). Magnetic field oscillates along:",
    optionA: "$-y$ direction",
    optionB: "$+z$ direction",
    optionC: "$-z$ direction",
    optionD: "$-x$ direction",
    correctOption: "B",
    explanation: "Poynting vector $\\vec{S} \\propto \\vec{E} \\times \\vec{B}$. Since $\\hat{j} \\times \\hat{k} = \\hat{i}$, magnetic field oscillates along $+z$ direction."
  },
  {
    subject: "Physics",
    questionText: "Prism of $\\mu = \\sqrt{2}$ has angle $A = 30^\\circ$. One face is silvered. Light retraces its path after normal reflection at silvered face if incident angle $i$ is:",
    optionA: "$30^\\circ$",
    optionB: "$45^\\circ$",
    optionC: "$60^\\circ$",
    optionD: "Zero",
    correctOption: "B",
    explanation: "To retrace path, $r_2 = 0 \\implies r_1 = A = 30^\\circ$. $\\sin i = \\mu \\sin r_1 = \\sqrt{2} \\sin 30^\\circ = \\frac{\\sqrt{2}}{2} = \\frac{1}{\\sqrt{2}} \\implies i = 45^\\circ$."
  },
  {
    subject: "Physics",
    questionText: "Object is at $40\\text{ cm}$ from concave mirror ($f = 15\\text{ cm}$). When displaced $20\\text{ cm}$ towards mirror ($u' = 20\\text{ cm}$), displacement of image is:",
    optionA: "$30\\text{ cm}$ towards mirror",
    optionB: "$36\\text{ cm}$ away from mirror",
    optionC: "$30\\text{ cm}$ away from mirror",
    optionD: "$36\\text{ cm}$ towards mirror",
    correctOption: "B",
    explanation: "$v_1 = \\frac{-40 \\times -15}{-40 - (-15)} = -24\\text{ cm}$. $v_2 = \\frac{-20 \\times -15}{-20 - (-15)} = -60\\text{ cm}$. Displacement $= 60 - 24 = 36\\text{ cm}$ away from mirror."
  },
  {
    subject: "Physics",
    questionText: "Magnetic energy stored in inductor is $25\\text{ mJ}$ when current is $60\\text{ mA}$. Inductance $L$ is:",
    optionA: "$1.389\\text{ H}$",
    optionB: "$138.88\\text{ H}$",
    optionC: "$0.138\\text{ H}$",
    optionD: "$13.89\\text{ H}$",
    correctOption: "D",
    explanation: "$U = \\frac{1}{2} L I^2 \\implies 25 \\times 10^{-3} = \\frac{1}{2} L (60 \\times 10^{-3})^2 \\implies L = \\frac{50 \\times 10^{-3}}{3600 \\times 10^{-6}} = 13.89\\text{ H}$."
  },
  {
    subject: "Physics",
    questionText: "Electron falls from rest through height $h$ in uniform field $E$. If field is reversed, proton falls through $h$. Time of fall of electron compared to proton is:",
    optionA: "10 times greater",
    optionB: "5 times greater",
    optionC: "Smaller ($t \\propto \\sqrt{m}$)",
    optionD: "Equal",
    correctOption: "C",
    explanation: "$t = \\sqrt{\\frac{2mh}{qE}}$. Since $m_e \\ll m_p$, time of fall for electron is much smaller."
  },
  {
    subject: "Physics",
    questionText: "Electrostatic force between plates of an isolated parallel plate capacitor having charge $Q$ and area $A$ is:",
    optionA: "Proportional to square root of distance",
    optionB: "Linearly proportional to distance",
    optionC: "Independent of distance between plates ($F = \\frac{Q^2}{2 A \\varepsilon_0}$)",
    optionD: "Inversely proportional to distance",
    correctOption: "C",
    explanation: "$F = Q E_{\\text{plate}} = Q \\left(\\frac{Q}{2 A \\varepsilon_0}\\right) = \\frac{Q^2}{2 A \\varepsilon_0}$, which is independent of plate separation $d$."
  },
  {
    subject: "Physics",
    questionText: "Resonance tube with tuning fork ($320\\text{ Hz}$) gives successive resonances at $l_1 = 20\\text{ cm}$ and $l_2 = 73\\text{ cm}$. Speed of sound in air is:",
    optionA: "$350\\text{ m/s}$",
    optionB: "$339\\text{ m/s}$",
    optionC: "$330\\text{ m/s}$",
    optionD: "$300\\text{ m/s}$",
    correctOption: "B",
    explanation: "$v = 2 f (l_2 - l_1) = 2 \\times 320 \\times (0.73 - 0.20) = 640 \\times 0.53 = 339.2\\text{ m/s}$."
  },
  {
    subject: "Physics",
    questionText: "Pendulum bob has acceleration $20\\text{ m/s}^2$ at distance $5\\text{ m}$ from mean position. Time period of oscillation is:",
    optionA: "$2\\text{ s}$",
    optionB: "$\\pi\\text{ s}$",
    optionC: "$2\\pi\\text{ s}$",
    optionD: "$1\\text{ s}$",
    correctOption: "B",
    explanation: "$\\omega^2 y = a \\implies \\omega^2 (5) = 20 \\implies \\omega = 2\\text{ rad/s}$. $T = \\frac{2\\pi}{\\omega} = \\frac{2\\pi}{2} = \\pi\\text{ s}$."
  },
  {
    subject: "Physics",
    questionText: "Metallic rod of mass per unit length $0.5\\text{ kg/m}$ on smooth $30^\\circ$ incline is kept stationary by vertical $B = 0.25\\text{ T}$. Current $I$ is ($g = 9.8\\text{ m/s}^2$):",
    optionA: "$14.76\\text{ A}$",
    optionB: "$5.98\\text{ A}$",
    optionC: "$7.14\\text{ A}$",
    optionD: "$11.32\\text{ A}$",
    correctOption: "D",
    explanation: "$m g \\sin 30^\\circ = I L B \\cos 30^\\circ \\implies I = \\frac{m}{L} \\frac{g \\tan 30^\\circ}{B} = \\frac{0.5 \\times 9.8 \\times (1/\\sqrt{3})}{0.25} = 11.32\\text{ A}$."
  },
  {
    subject: "Physics",
    questionText: "A diamagnetic rod is pushed up out of magnetic field gaining gravitational potential energy. The work required comes from:",
    optionA: "Lattice structure of rod",
    optionB: "Magnetic field",
    optionC: "The current source supplying the electromagnet",
    optionD: "Induced electric field",
    correctOption: "C",
    explanation: "The external battery / power supply powering the electromagnet does work against induced back-EMF."
  },
  {
    subject: "Physics",
    questionText: "Series LCR with $L = 20\\text{ mH}, C = 100\\,\\mu\\text{F}, R = 50\\,\\Omega$ connected across $V = 10\\sin(314t)$. Power loss in circuit is:",
    optionA: "$2.74\\text{ W}$",
    optionB: "$0.43\\text{ W}$",
    optionC: "$0.79\\text{ W}$",
    optionD: "$1.13\\text{ W}$",
    correctOption: "C",
    explanation: "$X_L = 314 \\times 0.02 = 6.28\\,\\Omega$. $X_C = \\frac{1}{314 \\times 10^{-4}} = 31.85\\,\\Omega$. $Z = \\sqrt{50^2 + (25.57)^2} = 56.16\\,\\Omega$. $P = I_{\\text{rms}}^2 R = \\left(\\frac{10/\\sqrt{2}}{56.16}\\right)^2 \\times 50 = 0.79\\text{ W}$."
  },
  {
    subject: "Physics",
    questionText: "Current sensitivity of galvanometer is $5\\text{ div/mA}$ and voltage sensitivity is $20\\text{ div/V}$. Resistance of galvanometer is:",
    optionA: "$250\\,\\Omega$",
    optionB: "$25\\,\\Omega$",
    optionC: "$40\\,\\Omega$",
    optionD: "$500\\,\\Omega$",
    correctOption: "A",
    explanation: "$R = \\frac{\\text{Current sensitivity}}{\\text{Voltage sensitivity}} = \\frac{5 \\times 10^3\\text{ div/A}}{20\\text{ div/V}} = 250\\,\\Omega$."
  },
  {
    subject: "Physics",
    questionText: "A body sliding from height $h$ on frictionless track just completes vertical circle of diameter $D$. Height $h$ is:",
    imageUrl: "/neetimages/neet_2018_q30.svg",
    optionA: "$\\frac{7}{5} D$",
    optionB: "$D$",
    optionC: "$\\frac{3}{2} D$",
    optionD: "$\\frac{5}{4} D$",
    correctOption: "D",
    explanation: "$m g h = \\frac{1}{2} m v_{\\text{bottom}}^2 = \\frac{1}{2} m (5 g R) = \\frac{5}{2} m g R = \\frac{5}{4} m g D \\implies h = \\frac{5}{4} D$."
  },
  {
    subject: "Physics",
    questionText: "Solid sphere (A), circular disk (B), and ring (C) of same mass $M$, radius $R$ spin at same $\\omega$. Work to stop them satisfies:",
    optionA: "$W_B > W_A > W_C$",
    optionB: "$W_A > W_B > W_C$",
    optionC: "$W_C > W_B > W_A$",
    optionD: "$W_A > W_C > W_B$",
    correctOption: "C",
    explanation: "$W = \\frac{1}{2} I \\omega^2$. Since $I_{\\text{ring}} (M R^2) > I_{\\text{disk}} (0.5 M R^2) > I_{\\text{sphere}} (0.4 M R^2)$, $W_C > W_B > W_A$."
  },
  {
    subject: "Physics",
    questionText: "Moving block $m$ collides with stationary block $4m$ and comes to rest. Coefficient of restitution $e$ is:",
    optionA: "0.8",
    optionB: "0.25",
    optionC: "0.5",
    optionD: "0.4",
    correctOption: "B",
    explanation: "Momentum: $m v = 4m v_2 \\implies v_2 = v/4$. Coefficient $e = \\frac{v_2 - 0}{v - 0} = \\frac{v/4}{v} = 0.25$."
  },
  {
    subject: "Physics",
    questionText: "Which of the following statements about friction is INCORRECT?",
    optionA: "Frictional force opposes relative motion",
    optionB: "Limiting static friction is proportional to normal reaction",
    optionC: "Rolling friction is smaller than sliding friction",
    optionD: "Coefficient of sliding friction has dimensions of length (It is dimensionless)",
    correctOption: "D",
    explanation: "Coefficient of friction $\\mu = F/N$ is a dimensionless ratio of two forces."
  },
  {
    subject: "Physics",
    questionText: "Charged toy car in field $E$ accelerates from 0 to $6\\text{ m/s}$ in $1\\text{ s}$, then field reverses for $2\\text{ s}$. Average velocity and speed over $3\\text{ s}$ are:",
    optionA: "$1\\text{ m/s}, 3.5\\text{ m/s}$",
    optionB: "$1\\text{ m/s}, 3\\text{ m/s}$",
    optionC: "$2\\text{ m/s}, 4\\text{ m/s}$",
    optionD: "$1.5\\text{ m/s}, 3\\text{ m/s}$",
    correctOption: "B",
    explanation: "Displacement: $s_1 = 3\\text{ m}$, $s_2 = 3\\text{ m}$, $s_3 = -3\\text{ m} \\implies s_{\\text{net}} = 3\\text{ m} \\implies v_{\\text{avg}} = 1\\text{ m/s}$. Total distance $= 9\\text{ m} \\implies \\text{speed}_{\\text{avg}} = 3\\text{ m/s}$."
  },
  {
    subject: "Physics",
    questionText: "Block $m$ on smooth wedge of inclination $\\theta$ is accelerated right with $a$. For block to remain stationary on wedge:",
    imageUrl: "/neetimages/neet_2018_q35.svg",
    optionA: "$a = g \\cos\\theta$",
    optionB: "$a = g / \\sin\\theta$",
    optionC: "$a = g / \\text{cosec}\\theta$",
    optionD: "$a = g \\tan\\theta$",
    correctOption: "D",
    explanation: "Pseudo force balance: $m a \\cos\\theta = m g \\sin\\theta \\implies a = g \\tan\\theta$."
  },
  {
    subject: "Physics",
    questionText: "Torque of force $\\vec{F} = 4\\hat{i} + 5\\hat{j} - 6\\hat{k}$ at $(2, 0, -3)$ about point $(2, -2, -2)$ is:",
    optionA: "$-7\\hat{i} - 8\\hat{j} - 4\\hat{k}$",
    optionB: "$-4\\hat{i} - \\hat{j} - 8\\hat{k}$",
    optionC: "$-8\\hat{i} - 4\\hat{j} - 7\\hat{k}$",
    optionD: "$-7\\hat{i} - 4\\hat{j} - 8\\hat{k}$",
    correctOption: "D",
    explanation: "$\\vec{r} = (2-2)\\hat{i} + (0 - (-2))\\hat{j} + (-3 - (-2))\\hat{k} = 2\\hat{j} - \\hat{k}$. $\\vec{\\tau} = \\vec{r} \\times \\vec{F} = -7\\hat{i} - 4\\hat{j} - 8\\hat{k}$."
  },
  {
    subject: "Physics",
    questionText: "Screw gauge has $\\text{LC} = 0.001\\text{ cm}, \\text{MSR} = 5\\text{ mm} = 0.5\\text{ cm}, \\text{CSR} = 25$, zero error $= -0.004\\text{ cm}$. Correct diameter is:",
    optionA: "$0.053\\text{ cm}$",
    optionB: "$0.525\\text{ cm}$",
    optionC: "$0.521\\text{ cm}$",
    optionD: "$0.529\\text{ cm}$",
    correctOption: "D",
    explanation: "$\\text{Observed} = 0.5 + 25(0.001) = 0.525\\text{ cm}$. $\\text{Correct} = 0.525 - (-0.004) = 0.529\\text{ cm}$."
  },
  {
    subject: "Physics",
    questionText: "A solid sphere is rotating freely in space. If its radius expands keeping mass constant, which quantity remains constant?",
    optionA: "Rotational kinetic energy",
    optionB: "Moment of inertia",
    optionC: "Angular velocity",
    optionD: "Angular momentum ($L = I\\omega = \\text{const}$)",
    correctOption: "D",
    explanation: "In absence of external torque ($\\tau_{\\text{ext}} = 0$), angular momentum $L$ is strictly conserved."
  },
  {
    subject: "Physics",
    questionText: "For planet in elliptical orbit with Sun at focus S, kinetic energies at A (perihelion), B, and C (aphelion) satisfy:",
    imageUrl: "/neetimages/neet_2018_q39.svg",
    optionA: "$K_B < K_A < K_C$",
    optionB: "$K_A > K_B > K_C$",
    optionC: "$K_A < K_B < K_C$",
    optionD: "$K_B > K_A > K_C$",
    correctOption: "B",
    explanation: "By conservation of angular momentum $m v r = \\text{const}$, orbital speed is highest at perihelion A ($r_A$ minimum) $\\implies K_A > K_B > K_C$."
  },
  {
    subject: "Physics",
    questionText: "If mass of Sun were 10 times smaller and $G$ were 10 times larger, which statement is NOT correct?",
    optionA: "Time period of pendulum on Earth would decrease",
    optionB: "Walking on ground would become more difficult",
    optionC: "Raindrops will fall faster",
    optionD: "'g' on Earth will not change ($g = G M_E / R^2$ would increase 10 times)",
    correctOption: "D",
    explanation: "Since $G$ increases 10 times, surface gravity $g$ on Earth increases 10-fold."
  },
  {
    subject: "Physics",
    questionText: "For a rolling solid sphere, ratio of translational kinetic energy to total kinetic energy ($K_t : K_{\\text{total}}$) is:",
    optionA: "$10 : 7$",
    optionB: "$5 : 7$",
    optionC: "$7 : 10$",
    optionD: "$2 : 5$",
    correctOption: "B",
    explanation: "$K_t = \\frac{1}{2} M v^2$. $K_r = \\frac{1}{2} (\\frac{2}{5} M R^2) \\omega^2 = \\frac{1}{5} M v^2$. $K_{\\text{total}} = \\frac{7}{10} M v^2 \\implies \\frac{K_t}{K_{\\text{total}}} = \\frac{1/2}{7/10} = 5 : 7$."
  },
  {
    subject: "Physics",
    questionText: "A small sphere of radius $r$ falls in viscous liquid at terminal velocity. Rate of heat production ($dQ/dt = F_v \\cdot v_t$) is proportional to:",
    optionA: "$r^5$",
    optionB: "$r^2$",
    optionC: "$r^3$",
    optionD: "$r^4$",
    correctOption: "A",
    explanation: "Terminal velocity $v_t \\propto r^2$. Viscous force $F_v = 6\\pi\\eta r v_t \\propto r^3$. Power dissipation $P = F_v v_t \\propto r^3 \\cdot r^2 = r^5$."
  },
  {
    subject: "Physics",
    questionText: "Black body power is $P$ at $\\lambda_0$. When temperature changes so maximum emission is at $\\frac{3}{4}\\lambda_0$, radiated power becomes $n P$. Value of $n$ is:",
    optionA: "$81 / 256$",
    optionB: "$4 / 3$",
    optionC: "$3 / 4$",
    optionD: "$256 / 81$",
    correctOption: "D",
    explanation: "Wien's law: $T \\propto 1/\\lambda \\implies T' = \\frac{4}{3}T$. Stefan-Boltzmann law: $P \\propto T^4 \\implies n = (4/3)^4 = 256/81$."
  },
  {
    subject: "Physics",
    questionText: "Two wires of same material and volume have areas $A$ and $3A$. If wire 1 stretches by $\\Delta l$ under force $F$, force to stretch wire 2 by $\\Delta l$ is:",
    optionA: "$4 F$",
    optionB: "$6 F$",
    optionC: "$9 F$",
    optionD: "$F$",
    correctOption: "C",
    explanation: "Since volume $V = A L$ is constant, $L_2 = L_1/3$. $F = Y A \\frac{\\Delta l}{L} \\propto \\frac{A}{L} \\propto A^2 \\implies F_2 = (3)^2 F_1 = 9 F$."
  },
  {
    subject: "Physics",
    questionText: "$0.1\\text{ g}$ water at $100^\\circ\\text{C}$ requires $54\\text{ cal} = 225.7\\text{ J}$ to form $167.1\\text{ cc}$ steam against $1.013 \\times 10^5\\text{ N/m}^2$. $\\Delta U$ is:",
    optionA: "$42.2\\text{ J}$",
    optionB: "$208.7\\text{ J}$",
    optionC: "$104.3\\text{ J}$",
    optionD: "$84.5\\text{ J}$",
    correctOption: "B",
    explanation: "$W = P \\Delta V = (1.013 \\times 10^5) \\times (167.1 - 0.1) \\times 10^{-6} = 16.92\\text{ J}$. $\\Delta U = Q - W = 225.72 - 16.92 = 208.8\\text{ J} \\approx 208.7\\text{ J}$."
  },

  // -------------------------------------------------------------
  // CHEMISTRY (Q46 - Q90)
  // -------------------------------------------------------------
  {
    subject: "Chemistry",
    questionText: "The correct decreasing order of oxidation states of nitrogen in the given compounds is:",
    optionA: "$\\text{HNO}_3 (+5), \\text{NH}_4\\text{Cl} (-3), \\text{NO} (+2), \\text{N}_2 (0)$",
    optionB: "$\\text{HNO}_3, \\text{NO}, \\text{NH}_4\\text{Cl}, \\text{N}_2$",
    optionC: "$\\text{HNO}_3 (+5) > \\text{NO} (+2) > \\text{N}_2 (0) > \\text{NH}_4\\text{Cl} (-3)$",
    optionD: "$\\text{NH}_4\\text{Cl}, \\text{N}_2, \\text{NO}, \\text{HNO}_3$",
    correctOption: "C",
    explanation: "Oxidation states: $\\text{HNO}_3 (+5) > \\text{NO} (+2) > \\text{N}_2 (0) > \\text{NH}_4\\text{Cl} (-3)$."
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following Group 13 elements is UNABLE to form $[\text{MF}_6]^{3-}$ ion due to absence of $d$-orbitals?",
    optionA: "B (Boron)",
    optionB: "Al",
    optionC: "Ga",
    optionD: "In",
    correctOption: "A",
    explanation: "Boron has maximum covalency of 4 in valence shell ($2s, 2p$) due to lack of vacant $d$-orbitals."
  },
  {
    subject: "Chemistry",
    questionText: "Considering the Ellingham diagram, which metal can be used to reduce alumina ($\\text{Al}_2\\text{O}_3$) below $1350^\\circ\\text{C}$?",
    optionA: "Mg (Magnesium)",
    optionB: "Zn",
    optionC: "Fe",
    optionD: "Cu",
    correctOption: "A",
    explanation: "The $\\text{Mg} \\to \\text{MgO}$ line lies below the $\\text{Al} \\to \\text{Al}_2\\text{O}_3$ line below $1350^\\circ\\text{C}$ in Ellingham diagram."
  },
  {
    subject: "Chemistry",
    questionText: "The correct anomalous order of atomic radii in Group 13 elements due to $d$-electron shielding is:",
    optionA: "$\\text{B} < \\text{Ga} < \\text{Al} < \\text{Tl} < \\text{In}$",
    optionB: "$\\text{B} < \\text{Al} < \\text{Ga} < \\text{In} < \\text{Tl}$",
    optionC: "$\\text{B} < \\text{Al} < \\text{In} < \\text{Ga} < \\text{Tl}$",
    optionD: "$\\text{B} < \\text{Ga} < \\text{Al} < \\text{In} < \\text{Tl}$",
    correctOption: "D",
    explanation: "Poor shielding of $3d^{10}$ electrons in Gallium contracts its size below Aluminium: $\\text{B} (88\\text{ pm}) < \\text{Ga} (135\\text{ pm}) < \\text{Al} (143\\text{ pm}) < \\text{In} (167\\text{ pm}) < \\text{Tl} (170\\text{ pm})$."
  },
  {
    subject: "Chemistry",
    questionText: "Which statement is NOT true for halogens?",
    optionA: "All but fluorine show positive oxidation states",
    optionB: "All are oxidizing agents",
    optionC: "All form monobasic oxyacids",
    optionD: "Chlorine has the highest electron-gain enthalpy",
    correctOption: "A",
    explanation: "Fluorine is the most electronegative element and never exhibits positive oxidation states (Statement 1 is actually true, key 1/3 accepted)."
  },
  {
    subject: "Chemistry",
    questionText: "In the T-shaped structure of $\\text{ClF}_3$ ($sp^3d$), the number of lone pairs on central chlorine atom is:",
    optionA: "Four",
    optionB: "Two (occupying equatorial positions)",
    optionC: "One",
    optionD: "Three",
    correctOption: "B",
    explanation: "$\\text{ClF}_3$ has 3 bond pairs and 2 lone pairs in equatorial positions minimizing repulsion."
  },
  {
    subject: "Chemistry",
    questionText: "Benzene $+ \\text{CH}_3\\text{CH}_2\\text{CH}_2\\text{Cl} \\xrightarrow{\\text{AlCl}_3} P \\xrightarrow{\\text{O}_2, \\text{H}_3\\text{O}^+} Q + R$. Major products are:",
    optionA: "Cumene, Phenol, 2-Propanol",
    optionB: "n-Propylbenzene, Benzaldehyde, Benzoic acid",
    optionC: "n-Propylbenzene, Benzaldehyde, Ethanol",
    optionD: "Cumene (P), Phenol (Q), Acetone (R)",
    correctOption: "D",
    explanation: "Friedel-Crafts alkylation rearranges propyl carbocation to isopropylbenzene (cumene), which oxidizes to phenol and acetone."
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following compounds can form a dipolar Zwitterion?",
    optionA: "Benzoic acid",
    optionB: "Acetanilide",
    optionC: "Aniline",
    optionD: "Glycine ($^+\\text{NH}_3-\\text{CH}_2-\\text{COO}^-$)",
    correctOption: "D",
    explanation: "Amino acid glycine has acidic $-\\text{COOH}$ and basic $-\\text{NH}_2$ forming internal zwitterion."
  },
  {
    subject: "Chemistry",
    questionText: "Regarding cross-linked/network polymers, which statement is INCORRECT?",
    optionA: "Examples are bakelite and melamine",
    optionB: "Formed from bi- and tri-functional monomers",
    optionC: "Contain covalent bonds between linear polymer chains",
    optionD: "Contain only weak van der Waals bonds between chains",
    correctOption: "D",
    explanation: "Cross-linked polymers contain strong covalent cross-links joining polymeric chains."
  },
  {
    subject: "Chemistry",
    questionText: "Nitration of aniline in strong acidic medium ($\text{HNO}_3/\text{H}_2\text{SO}_4$) yields $47\\%$ m-nitroaniline because:",
    optionA: "Nitro group always goes to meta position",
    optionB: "Amino group is meta directive",
    optionC: "Steric crowding at ortho",
    optionD: "In strongly acidic medium, aniline is protonated to meta-directing anilinium ion ($-\\text{NH}_3^+$)",
    correctOption: "D",
    explanation: "Anilinium ion ($-\\text{NH}_3^+$) is strongly deactivating and meta-directing."
  },
  {
    subject: "Chemistry",
    questionText: "The key structural difference between amylose and amylopectin in starch is:",
    optionA: "Amylopectin has $1 \\to 4\\,\\alpha$ and $1 \\to 6\\,\\beta$ linkages",
    optionB: "Amylose has $1 \\to 4\\,\\alpha$ and $1 \\to 6\\,\\beta$ linkages",
    optionC: "Amylopectin has linear $1 \\to 4\\,\\alpha$-linkage and branching $1 \\to 6\\,\\alpha$-linkage",
    optionD: "Amylose is made of glucose and galactose",
    correctOption: "C",
    explanation: "Amylose is unbranched with $\\alpha-1,4$ bonds; amylopectin is branched with $\\alpha-1,4$ and $\\alpha-1,6$ glycosidic bonds."
  },
  {
    subject: "Chemistry",
    questionText: "Mixture of $2.3\\text{ g}$ formic acid ($0.05\\text{ mol}$) and $4.5\\text{ g}$ oxalic acid ($0.05\\text{ mol}$) with conc $\\text{H}_2\\text{SO}_4$. Gas passed through $\\text{KOH}$. Remaining gas weight is:",
    optionA: "$2.8\\text{ g}$",
    optionB: "$3.0\\text{ g}$",
    optionC: "$1.4\\text{ g}$",
    optionD: "$4.4\\text{ g}$",
    correctOption: "A",
    explanation: "$\\text{HCOOH} \\to \\text{CO} + \\text{H}_2\\text{O}$ ($0.05\\text{ mol CO}$). $(\\text{COOH})_2 \\to \\text{CO} + \\text{CO}_2 + \\text{H}_2\\text{O}$ ($0.05\\text{ mol CO} + 0.05\\text{ mol CO}_2$). $\\text{KOH}$ absorbs $\\text{CO}_2$. Remaining $\\text{CO} = 0.1\\text{ mol} \\times 28 = 2.8\\text{ g}$."
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following alkaline earth metal oxides is most AMPHOTERIC / acidic in nature?",
    optionA: "$\\text{BaO}$",
    optionB: "$\\text{BeO}$",
    optionC: "$\\text{MgO}$",
    optionD: "$\\text{CaO}$",
    correctOption: "B",
    explanation: "$\\text{BeO}$ is amphoteric while oxides of other alkaline earth metals are basic."
  },
  {
    subject: "Chemistry",
    questionText: "Which oxide of nitrogen is NOT a common atmospheric pollutant from fuel combustion?",
    optionA: "$\\text{N}_2\\text{O}$",
    optionB: "$\\text{NO}_2$",
    optionC: "$\\text{N}_2\\text{O}_5$",
    optionD: "$\\text{NO}$",
    correctOption: "C",
    explanation: "$\\text{N}_2\\text{O}_5$ is an unstable solid anhydride, not a standard emitted pollutant."
  },
  {
    subject: "Chemistry",
    questionText: "Compound A $+ \\text{Na} \\to B$, and A $+ \\text{PCl}_5 \\to C$. B and C react to give diethyl ether. A, B, C are:",
    optionA: "$\\text{C}_2\\text{H}_5\\text{Cl}, \\text{C}_2\\text{H}_6, \\text{C}_2\\text{H}_5\\text{OH}$",
    optionB: "$\\text{C}_2\\text{H}_5\\text{OH}, \\text{C}_2\\text{H}_5\\text{Cl}, \\text{C}_2\\text{H}_5\\text{ONa}$",
    optionC: "$\\text{C}_2\\text{H}_5\\text{OH}, \\text{C}_2\\text{H}_6, \\text{C}_2\\text{H}_5\\text{Cl}$",
    optionD: "$\\text{C}_2\\text{H}_5\\text{OH} (A), \\text{C}_2\\text{H}_5\\text{ONa} (B), \\text{C}_2\\text{H}_5\\text{Cl} (C)$",
    correctOption: "D",
    explanation: "Williamson ether synthesis: $\\text{C}_2\\text{H}_5\\text{ONa} + \\text{C}_2\\text{H}_5\\text{Cl} \\to \\text{C}_2\\text{H}_5\\text{OC}_2\\text{H}_5$."
  },
  {
    subject: "Chemistry",
    questionText: "Toluene $\\xrightarrow{3\\text{Cl}_2/\\Delta} A \\xrightarrow{\\text{Br}_2/\\text{Fe}} B \\xrightarrow{\\text{Zn/HCl}} C$. Product C is:",
    optionA: "3-Bromo-2,4,6-trichlorotoluene",
    optionB: "o-Bromotoluene",
    optionC: "m-Bromotoluene",
    optionD: "p-Bromotoluene",
    correctOption: "C",
    explanation: "$-\\text{CCl}_3$ group is meta-directing. Bromination yields meta-isomer; $\\text{Zn/HCl}$ reduces $-\\text{CCl}_3$ back to $-\\text{CH}_3$, giving m-bromotoluene."
  },
  {
    subject: "Chemistry",
    questionText: "Hydrocarbon A reacts with $\\text{Br}_2$ to give alkyl bromide which under Wurtz reaction forms ethane ($<4$ carbons). Hydrocarbon A is:",
    optionA: "$\\text{CH}_3-\\text{CH}_3$",
    optionB: "$\\text{CH}_2=\\text{CH}_2$",
    optionC: "$\\text{CH}\\equiv\\text{CH}$",
    optionD: "$\\text{CH}_4$ (Methane)",
    correctOption: "D",
    explanation: "$\\text{CH}_4 + \\text{Br}_2 \\xrightarrow{h\\nu} \\text{CH}_3\\text{Br} \\xrightarrow{\\text{Na/ether}} \\text{CH}_3-\\text{CH}_3$ (ethane)."
  },
  {
    subject: "Chemistry",
    questionText: "Which molecule has hybridization sequence $sp^2, sp^2, sp, sp$ from left to right carbons?",
    optionA: "$\\text{CH}_2=\\text{CH}-\\text{CH}=\\text{CH}_2$",
    optionB: "$\\text{CH}_2=\\text{CH}-\\text{C}\\equiv\\text{CH}$",
    optionC: "$\\text{HC}\\equiv\\text{C}-\\text{C}\\equiv\\text{CH}$",
    optionD: "$\\text{CH}_3-\\text{CH}=\\text{CH}-\\text{CH}_3$",
    correctOption: "B",
    explanation: "In $\\text{H}_2\\text{C}=\\text{CH}-\\text{C}\\equiv\\text{CH}$, C1 and C2 are $sp^2$; C3 and C4 are $sp$."
  },
  {
    subject: "Chemistry",
    questionText: "Which carbocation intermediate is expected to be most stable during electrophilic addition?",
    optionA: "Carbocation with positive charge at ortho position to nitro",
    optionB: "Carbocation adjacent to electron withdrawing group",
    optionC: "Carbocation with maximum hyperconjugation and resonance separation",
    optionD: "Secondary allylic carbocation",
    correctOption: "A",
    explanation: "Structure where positive charge is furthest from strongly deactivating $-\\text{NO}_2$ group is most stable."
  },
  {
    subject: "Chemistry",
    questionText: "The correct increasing order of $-I$ electron-withdrawing inductive effect of substituents is:",
    optionA: "$-\\text{NH}_2 > -\\text{OR} > -\\text{F}$",
    optionB: "$-\\text{NR}_2 < -\\text{OR} < -\\text{F}$",
    optionC: "$-\\text{NH}_2 < -\\text{OR} < -\\text{F}$",
    optionD: "$-\\text{NR}_2 > -\\text{OR} > -\\text{F}$",
    correctOption: "C",
    explanation: "Inductive $-I$ strength follows electronegativity: $-\\text{F} > -\\text{OR} > -\\text{NH}_2$ (Official key: 3)."
  },
  {
    subject: "Chemistry",
    questionText: "In Reimer-Tiemann formylation of phenol with $\\text{CHCl}_3 + \\text{NaOH}$, the active electrophile is:",
    optionA: "Dichloromethyl anion ($^-\\text{CHCl}_2$)",
    optionB: "Formyl cation ($^+\\text{CHO}$)",
    optionC: "Dichloromethyl cation ($^+\\text{CHCl}_2$)",
    optionD: "Dichlorocarbene ($:\\text{CCl}_2$)",
    correctOption: "D",
    explanation: "$\\alpha$-elimination of $\\text{HCl}$ from chloroform generates neutral singlet dichlorocarbene ($:\\text{CCl}_2$)."
  },
  {
    subject: "Chemistry",
    questionText: "Carboxylic acids have higher boiling points than alcohols and carbonyls of similar molecular mass due to:",
    optionA: "Extensive van der Waals dispersion forces",
    optionB: "Formation of carboxylate ions",
    optionC: "Intramolecular H-bonding",
    optionD: "Intermolecular hydrogen bonding forming stable cyclic dimers",
    correctOption: "D",
    explanation: "Carboxylic acids form strong intermolecular hydrogen-bonded cyclic dimers in both liquid and vapour states."
  },
  {
    subject: "Chemistry",
    questionText: "Compound A ($\text{C}_8\text{H}_{10}\text{O}$) reacts with $\text{NaOI}$ ($\text{I}_2 + \text{NaOH}$) to give yellow iodoform precipitate. Compound A is:",
    optionA: "1-Phenylethanol ($\\text{C}_6\\text{H}_5-\\text{CH(OH)}-\\text{CH}_3$)",
    optionB: "2-Phenylethanol ($\\text{C}_6\\text{H}_5-\\text{CH}_2\\text{CH}_2\\text{OH}$)",
    optionC: "p-Methylbenzyl alcohol",
    optionD: "2,4-Dimethylphenol",
    correctOption: "A",
    explanation: "1-Phenylethanol contains the $-\\text{CH(OH)}\\text{CH}_3$ group that oxidizes to methyl ketone and gives positive haloform test."
  },
  {
    subject: "Chemistry",
    questionText: "Match Metal Ions with Spin-only Magnetic Moments:\n(a) $\\text{Co}^{3+} (d^6)$, (b) $\\text{Cr}^{3+} (d^3)$, (c) $\\text{Fe}^{3+} (d^5)$, (d) $\\text{Ni}^{2+} (d^8)$\n(i) $\\sqrt{8}\\text{ BM}$, (ii) $\\sqrt{35}\\text{ BM}$, (iii) $\\sqrt{3}\\text{ BM}$, (iv) $\\sqrt{24}\\text{ BM}$, (v) $\\sqrt{15}\\text{ BM}$\nChoose correct option:",
    optionA: "(a)-(iv), (b)-(i), (c)-(ii), (d)-(iii)",
    optionB: "(a)-(i), (b)-(ii), (c)-(iii), (d)-(iv)",
    optionC: "(a)-(iv), (b)-(v), (c)-(ii), (d)-(i)",
    optionD: "(a)-(iii), (b)-(v), (c)-(i), (d)-(ii)",
    correctOption: "C",
    explanation: "$\\text{Co}^{3+} (4\\text{ unp} = \\sqrt{24})$, $\\text{Cr}^{3+} (3\\text{ unp} = \\sqrt{15})$, $\\text{Fe}^{3+} (5\\text{ unp} = \\sqrt{35})$, $\\text{Ni}^{2+} (2\\text{ unp} = \\sqrt{8})$."
  },
  {
    subject: "Chemistry",
    questionText: "Which ion exhibits BOTH $d-d$ electronic transition and paramagnetism?",
    optionA: "$\\text{MnO}_4^-$ ($d^0$ / diamagnetic)",
    optionB: "$\\text{Cr}_2\\text{O}_7^{2-}$ ($d^0$ / diamagnetic)",
    optionC: "$\\text{CrO}_4^{2-}$ ($d^0$ / diamagnetic)",
    optionD: "$\\text{MnO}_4^{2-}$ ($d^1$ / paramagnetic)",
    correctOption: "D",
    explanation: "Manganate ion $\\text{MnO}_4^{2-}$ contains $\\text{Mn}^{6+}$ with $3d^1$ configuration showing paramagnetism and $d-d$ transition."
  },
  {
    subject: "Chemistry",
    questionText: "Iron pentacarbonyl $\\text{Fe(CO)}_5$ is classified as a:",
    optionA: "Trinuclear complex",
    optionB: "Mononuclear complex",
    optionC: "Tetranuclear complex",
    optionD: "Dinuclear complex",
    correctOption: "B",
    explanation: "$\\text{Fe(CO)}_5$ contains a single central iron atom (mononuclear)."
  },
  {
    subject: "Chemistry",
    questionText: "The complex $[\\text{CoCl}_2(\\text{en})_2]^+$ exhibits:",
    optionA: "Ionization isomerism",
    optionB: "Coordination isomerism",
    optionC: "Geometrical isomerism (cis and trans isomers)",
    optionD: "Linkage isomerism",
    correctOption: "C",
    explanation: "Octahedral complex $[\text{CoCl}_2(\text{en})_2]^+$ exists as cis- and trans- geometrical isomers (cis is optically active)."
  },
  {
    subject: "Chemistry",
    questionText: "The geometry and magnetic behaviour of nickel tetracarbonyl $[\\text{Ni(CO)}_4]$ ($sp^3$) are:",
    optionA: "Square planar and paramagnetic",
    optionB: "Tetrahedral geometry and diamagnetic ($\\mu = 0$)",
    optionC: "Square planar and diamagnetic",
    optionD: "Tetrahedral and paramagnetic",
    correctOption: "B",
    explanation: "Strong CO ligand forces $4s$ electrons into $3d$, giving $3d^{10} 4s^0 4p^0$ with $sp^3$ tetrahedral diamagnetic configuration."
  },
  {
    subject: "Chemistry",
    questionText: "Which mixture of $\\text{HCl}$ and $\\text{NaOH}$ solutions will result in $\\text{pH} = 1$ ($[\\text{H}^+] = 0.1\\text{ M}$)?",
    optionA: "$100\\text{ mL } \\text{M}/10\\text{ HCl} + 100\\text{ mL } \\text{M}/10\\text{ NaOH}$",
    optionB: "$60\\text{ mL } \\text{M}/10\\text{ HCl} + 40\\text{ mL } \\text{M}/10\\text{ NaOH}$",
    optionC: "$55\\text{ mL } \\text{M}/10\\text{ HCl} + 45\\text{ mL } \\text{M}/10\\text{ NaOH}$",
    optionD: "$75\\text{ mL } \\text{M}/5\\text{ HCl} + 25\\text{ mL } \\text{M}/5\\text{ NaOH}$",
    correctOption: "D",
    explanation: "Millimoles $\\text{HCl} = 15$, $\\text{NaOH} = 5$. Excess $\\text{H}^+ = 10\\text{ mmol}$ in $100\\text{ mL} \\implies [\\text{H}^+] = 0.1\\text{ M} \\implies \\text{pH} = 1$."
  },
  {
    subject: "Chemistry",
    questionText: "According to Hardy-Schulze rule, coagulating power of an active flocculating ion depends on:",
    optionA: "Both magnitude and sign of charge on the ion",
    optionB: "Size of ion alone",
    optionC: "Magnitude of charge alone",
    optionD: "Sign of charge alone",
    correctOption: "A",
    explanation: "Opposite sign causes coagulation and higher valency/magnitude exponentially increases coagulating power."
  },
  {
    subject: "Chemistry",
    questionText: "Van der Waals constants '$a$' for $\\text{NH}_3 (4.17), \\text{H}_2 (0.244), \\text{O}_2 (1.36), \\text{CO}_2 (3.59)$. Most easily liquefied gas is:",
    optionA: "$\\text{O}_2$",
    optionB: "$\\text{H}_2$",
    optionC: "$\\text{NH}_3$ (Highest '$a$' value)",
    optionD: "$\\text{CO}_2$",
    correctOption: "C",
    explanation: "Higher van der Waals constant '$a$' indicates stronger intermolecular attraction and easiest liquefaction."
  },
  {
    subject: "Chemistry",
    questionText: "Solubility of $\\text{BaSO}_4$ is $2.42 \\times 10^{-3}\\text{ g/L}$ ($M = 233\\text{ g/mol}$). Value of $K_{sp}$ is:",
    optionA: "$1.08 \\times 10^{-14}$",
    optionB: "$1.08 \\times 10^{-12}$",
    optionC: "$1.08 \\times 10^{-10}\\text{ mol}^2\\text{L}^{-2}$",
    optionD: "$1.08 \\times 10^{-8}$",
    correctOption: "C",
    explanation: "$s = \\frac{2.42 \\times 10^{-3}}{233} = 1.038 \\times 10^{-5}\\text{ M}$. $K_{sp} = s^2 = (1.038 \\times 10^{-5})^2 = 1.08 \\times 10^{-10}\\text{ mol}^2\\text{L}^{-2}$."
  },
  {
    subject: "Chemistry",
    questionText: "In which case is the number of water molecules MAXIMUM?",
    optionA: "$0.00224\\text{ L}$ vapour at STP",
    optionB: "$0.18\\text{ g}$ water",
    optionC: "$18\\text{ mL}$ of liquid water ($1\\text{ mole} = 6.022 \\times 10^{23}\\text{ molecules}$)",
    optionD: "$10^{-3}\\text{ mol}$ water",
    correctOption: "C",
    explanation: "$18\\text{ mL liquid water} = 18\\text{ g} = 1\\text{ mole} = N_A$ molecules."
  },
  {
    subject: "Chemistry",
    questionText: "The fundamental difference between first-order and second-order chemical reactions is:",
    optionA: "First order can be catalyzed; second order cannot",
    optionB: "Half-life of first-order does not depend on $[A]_0$; half-life of second-order does depend on $[A]_0$ ($t_{1/2} \\propto 1/[A]_0$)",
    optionC: "First order rate is independent of concentration",
    optionD: "First order depends on $[A]^2$",
    correctOption: "B",
    explanation: "For 1st order, $t_{1/2} = 0.693/k$; for 2nd order, $t_{1/2} = 1/(k[A]_0)$."
  },
  {
    subject: "Chemistry",
    questionText: "Among $\\text{CaH}_2, \\text{BeH}_2, \\text{BaH}_2$, the correct increasing order of ionic character is:",
    optionA: "$\\text{BeH}_2 < \\text{BaH}_2 < \\text{CaH}_2$",
    optionB: "$\\text{CaH}_2 < \\text{BeH}_2 < \\text{BaH}_2$",
    optionC: "$\\text{BeH}_2 < \\text{CaH}_2 < \\text{BaH}_2$",
    optionD: "$\\text{BaH}_2 < \\text{BeH}_2 < \\text{CaH}_2$",
    correctOption: "C",
    explanation: "Electropositive character and atomic radius increase down Group 2: $\\text{Be} < \\text{Ca} < \\text{Ba} \\implies$ ionic character $\\text{BeH}_2 < \\text{CaH}_2 < \\text{BaH}_2$."
  },
  {
    subject: "Chemistry",
    questionText: "In Latimer diagram: $\\text{BrO}_4^- \\xrightarrow{1.82\\text{ V}} \\text{BrO}_3^- \\xrightarrow{1.50\\text{ V}} \\text{HBrO} \\xrightarrow{1.595\\text{ V}} \\text{Br}_2 \\xrightarrow{1.0652\\text{ V}} \\text{Br}^-$. Disproportionating species is:",
    optionA: "$\\text{Br}_2$",
    optionB: "$\\text{BrO}_4^-$",
    optionC: "$\\text{BrO}_3^-$",
    optionD: "$\\text{HBrO}$ ($E^\\circ_{\\text{right}} = 1.595\\text{ V} > E^\\circ_{\\text{left}} = 1.50\\text{ V}$)",
    correctOption: "D",
    explanation: "Disproportionation is spontaneous when reduction potential to right ($1.595\\text{ V}$) exceeds potential to left ($1.50\\text{ V}$)."
  },
  {
    subject: "Chemistry",
    questionText: "Balanced redox reaction: $a\\,\\text{MnO}_4^- + b\\,\\text{C}_2\\text{O}_4^{2-} + c\\,\\text{H}^+ \\to 2\\text{Mn}^{2+} + 10\\text{CO}_2 + 8\\text{H}_2\\text{O}$. Coefficients $a, b, c$ are:",
    optionA: "2, 16, 5",
    optionB: "2, 5, 16",
    optionC: "16, 5, 2",
    optionD: "5, 16, 2",
    correctOption: "B",
    explanation: "$2\\text{MnO}_4^- + 5\\text{C}_2\\text{O}_4^{2-} + 16\\text{H}^+ \\to 2\\text{Mn}^{2+} + 10\\text{CO}_2 + 8\\text{H}_2\\text{O}$."
  },
  {
    subject: "Chemistry",
    questionText: "For exothermic gas reaction $A_2(g) + B_2(g) \\rightleftharpoons X_2(g)$ ($\\Delta H < 0$), conditions favouring forward yield are:",
    optionA: "High temperature and high pressure",
    optionB: "Low temperature and low pressure",
    optionC: "Low temperature and high pressure",
    optionD: "High temperature and low pressure",
    correctOption: "C",
    explanation: "By Le Chatelier's principle, lowering temperature favours exothermic direction and higher pressure shifts equilibrium towards fewer moles."
  },
  {
    subject: "Chemistry",
    questionText: "When initial concentration of reactant is doubled, half-life of a ZERO-ORDER reaction ($t_{1/2} = [A]_0 / 2k$):",
    optionA: "Is tripled",
    optionB: "Is doubled",
    optionC: "Is halved",
    optionD: "Remains unchanged",
    correctOption: "B",
    explanation: "For zero order reaction, $t_{1/2} \\propto [A]_0$, so doubling $[A]_0$ doubles half-life."
  },
  {
    subject: "Chemistry",
    questionText: "Bond energies $X_2, Y_2, XY$ are in ratio $1 : 0.5 : 1$. If $\\Delta H_f(XY) = -200\\text{ kJ/mol}$, bond dissociation energy of $X_2$ is:",
    optionA: "$800\\text{ kJ/mol}$",
    optionB: "$100\\text{ kJ/mol}$",
    optionC: "$200\\text{ kJ/mol}$",
    optionD: "$400\\text{ kJ/mol}$",
    correctOption: "A",
    explanation: "$\\Delta H = \\frac{1}{2} x + \\frac{1}{2}(0.5x) - x = -200 \\implies -0.25x = -200 \\implies x = 800\\text{ kJ/mol}$."
  },
  {
    subject: "Chemistry",
    questionText: "The correction factor '$a$' in van der Waals equation $(P + an^2/V^2)(V - nb) = nRT$ accounts for:",
    optionA: "Electric field between molecules",
    optionB: "Volume of gas molecules",
    optionC: "Density of molecules",
    optionD: "Intermolecular forces of attraction between gas molecules",
    correctOption: "D",
    explanation: "Constant '$a$' accounts for attractive intermolecular forces and '$b$' accounts for finite molecular volume."
  },
  {
    subject: "Chemistry",
    questionText: "Among $\\text{CN}^+, \\text{CN}^-, \\text{NO}$ and $\\text{CN}$, which species has the HIGHEST bond order?",
    optionA: "$\\text{CN}^+$ (Bond order = 2)",
    optionB: "$\\text{CN}^-$ (14 electrons $\\implies$ Bond order = 3.0)",
    optionC: "$\\text{NO}$ (15 electrons $\\implies$ Bond order = 2.5)",
    optionD: "$\\text{CN}$ (13 electrons $\\implies$ Bond order = 2.5)",
    correctOption: "B",
    explanation: "$\\text{CN}^-$ is isoelectronic with $\\text{N}_2$ (14 electrons) having maximum bond order of 3.0."
  },
  {
    subject: "Chemistry",
    questionText: "Magnesium reacts with element X ($1s^2 2s^2 2p^3$ / Nitrogen). Simplest ionic formula is:",
    optionA: "$\\text{Mg}_2\\text{X}$",
    optionB: "$\\text{MgX}_2$",
    optionC: "$\\text{Mg}_2\\text{X}_3$",
    optionD: "$\\text{Mg}_3\\text{X}_2$ (Magnesium nitride)",
    correctOption: "D",
    explanation: "$\\text{Mg}^{2+}$ combines with $\\text{N}^{3-}$ to form $\\text{Mg}_3\\text{N}_2$ ($\text{Mg}_3\text{X}_2$)."
  },
  {
    subject: "Chemistry",
    questionText: "Iron is BCC at room temp and transforms to FCC above $900^\\circ\\text{C}$. Ratio of density $\\rho_{\\text{BCC}} / \\rho_{\\text{FCC}}$ is:",
    optionA: "$\\frac{3\\sqrt{3}}{4\\sqrt{2}}$",
    optionB: "$\\frac{4\\sqrt{3}}{3\\sqrt{2}}$",
    optionC: "$\\frac{\\sqrt{3}}{\\sqrt{2}}$",
    optionD: "$1/2$",
    correctOption: "A",
    explanation: "$\\frac{\\rho_{\\text{BCC}}}{\\rho_{\\text{FCC}}} = \\frac{2 / a_{\\text{BCC}}^3}{4 / a_{\\text{FCC}}^3} = \\frac{3\\sqrt{3}}{4\\sqrt{2}}$."
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following quantum mechanical statements is INCORRECT / WRONG?",
    optionA: "Nitrogen ground state configuration has paired $2p$ electrons violating Hund's rule",
    optionB: "An orbital is designated by 3 quantum numbers ($n, l, m$)",
    optionC: "Total orbital angular momentum for s-orbital ($l=0$) is zero",
    optionD: "Magnetic quantum number $m$ for $d_{z^2}$ is zero",
    correctOption: "A",
    explanation: "Nitrogen ground state follows Hund's rule with 3 unpaired parallel electrons in $2p_x^1 2p_y^1 2p_z^1$."
  },

  // -------------------------------------------------------------
  // BIOLOGY (Q91 - Q180)
  // -------------------------------------------------------------
  {
    subject: "Biology",
    questionText: "Oxygen is NOT produced during photosynthesis by which organism?",
    optionA: "Cycas",
    optionB: "Nostoc",
    optionC: "Green sulphur bacteria (Anoxygenic photosynthesis using $\\text{H}_2\\text{S}$)",
    optionD: "Chara",
    correctOption: "C",
    explanation: "Green sulphur bacteria use $\\text{H}_2\\text{S}$ as electron donor and release sulphur instead of oxygen."
  },
  {
    subject: "Biology",
    questionText: "Double fertilization in angiosperms is defined as:",
    optionA: "Fusion of two male gametes with one egg",
    optionB: "Fusion of one male gamete with two polar nuclei",
    optionC: "Fusion of two male gametes with two different eggs",
    optionD: "Syngamy (egg fertilization) and Triple fusion (central cell polar nuclei)",
    correctOption: "D",
    explanation: "Double fertilization consists of syngamy ($n+n=2n$) and triple fusion ($n+2n=3n$)."
  },
  {
    subject: "Biology",
    questionText: "Which plant exhibits obligate mutualism with Pronuba moth where neither can complete its life cycle alone?",
    optionA: "Banana",
    optionB: "Yucca plant",
    optionC: "Hydrilla",
    optionD: "Viola",
    correctOption: "B",
    explanation: "Yucca flower is pollinated by Pronuba moth which deposits its eggs within the locule of ovary."
  },
  {
    subject: "Biology",
    questionText: "Pollen grains can be cryopreserved for years in liquid nitrogen at temperature of:",
    optionA: "$-196^\\circ\\text{C}$",
    optionB: "$-80^\\circ\\text{C}$",
    optionC: "$-120^\\circ\\text{C}$",
    optionD: "$-160^\\circ\\text{C}$",
    correctOption: "A",
    explanation: "Cryopreservation uses liquid nitrogen at $-196^\\circ\\text{C}$ ($77\\text{ K}$)."
  },
  {
    subject: "Biology",
    questionText: "Which essential mineral element is responsible for opening and closing of stomata and cell turgor?",
    optionA: "Potassium ($\\text{K}^+$)",
    optionB: "Sodium",
    optionC: "Magnesium",
    optionD: "Calcium",
    correctOption: "A",
    explanation: "$\\text{K}^+$ influx into guard cells causes osmotic water entry and turgidity."
  },
  {
    subject: "Biology",
    questionText: "What is the primary biochemical role of $\\text{NAD}^+$ in cellular respiration?",
    optionA: "Nucleotide source for ATP",
    optionB: "Functions as a coenzyme electron/hydrogen carrier",
    optionC: "Functions as an enzyme",
    optionD: "Final electron acceptor",
    correctOption: "B",
    explanation: "$\\text{NAD}^+$ accepts electrons and protons during dehydrogenation reactions, reducing to $\\text{NADH}+\\text{H}^+$."
  },
  {
    subject: "Biology",
    questionText: "In which chemical form is iron predominantly absorbed by plant roots from soil?",
    optionA: "Free elemental iron",
    optionB: "Ferrous ion ($\\text{Fe}^{2+}$)",
    optionC: "Ferric ion ($\\text{Fe}^{3+}$)",
    optionD: "Both ferric and ferrous",
    correctOption: "C",
    explanation: "Plants absorb iron primarily in oxidized ferric form ($\\text{Fe}^{3+}$)."
  },
  {
    subject: "Biology",
    questionText: "Which viral vector is commonly used for gene therapy in human lymphocytes for ADA deficiency?",
    optionA: "$\\lambda$ phage",
    optionB: "Ti plasmid",
    optionC: "Disarmed Retrovirus",
    optionD: "pBR322",
    correctOption: "C",
    explanation: "Retroviral vectors efficiently integrate therapeutic functional cDNA into human T-lymphocytes."
  },
  {
    subject: "Biology",
    questionText: "Unauthorized commercial exploitation of bioresources and indigenous traditional knowledge is:",
    optionA: "Biodegradation",
    optionB: "Biopiracy",
    optionC: "Bio-infringement",
    optionD: "Bioexploitation",
    correctOption: "B",
    explanation: "Biopiracy is patenting or using bioresources without compensatory authorization."
  },
  {
    subject: "Biology",
    questionText: "The statutory Indian body for assessing biosafety and public release of Genetically Modified Organisms is:",
    optionA: "RCGM",
    optionB: "CSIR",
    optionC: "ICMR",
    optionD: "GEAC (Genetic Engineering Appraisal Committee)",
    correctOption: "D",
    explanation: "GEAC under Ministry of Environment evaluates GM crop research and environmental safety."
  },
  {
    subject: "Biology",
    questionText: "The correct sequence of thermal cycling steps in PCR is:",
    optionA: "Denaturation, Extension, Annealing",
    optionB: "Annealing, Extension, Denaturation",
    optionC: "Extension, Denaturation, Annealing",
    optionD: "Denaturation ($94^\\circ\\text{C}$), Annealing ($54^\\circ\\text{C}$), Extension ($72^\\circ\\text{C}$)",
    correctOption: "D",
    explanation: "Standard PCR cycle consists of strand denaturation $\\to$ primer annealing $\\to$ enzymatic extension."
  },
  {
    subject: "Biology",
    questionText: "Select the CORRECT biomolecular match:",
    optionA: "T.H. Morgan - Transduction",
    optionB: "$F_2 \\times$ Recessive parent - Dihybrid cross",
    optionC: "Ribozyme - Catalytic Nucleic acid (RNA)",
    optionD: "G. Mendel - Transformation",
    correctOption: "C",
    explanation: "Ribozymes (like 23S rRNA peptidyl transferase) are catalytic RNA molecules."
  },
  {
    subject: "Biology",
    questionText: "Which indigenous Indian aromatic rice variety was controversially patented by a Texas company in 1997?",
    optionA: "Lerma Rojo",
    optionB: "Sharbati Sonora",
    optionC: "Co-667",
    optionD: "Basmati rice",
    correctOption: "D",
    explanation: "RiceTec patented Basmati rice lines, triggering international biopiracy litigation."
  },
  {
    subject: "Biology",
    questionText: "Which pair is WRONGLY matched?",
    optionA: "XO type sex determination - Grasshopper",
    optionB: "ABO blood grouping - Co-dominance",
    optionC: "Starch synthesis in pea - Multiple alleles (Governed by pleiotropic gene B/b)",
    optionD: "T.H. Morgan - Linkage",
    correctOption: "C",
    explanation: "Starch branching enzyme gene ($B/b$) in pea shows incomplete dominance for seed size and pleiotropy, not multiple allelism."
  },
  {
    subject: "Biology",
    questionText: "Select the CORRECT genetics statement:",
    optionA: "Spliceosomes take part in translation",
    optionB: "Punnett square was developed by a British geneticist (Reginald C. Punnett)",
    optionC: "Franklin Stahl coined the term linkage",
    optionD: "Transduction was discovered by Altman",
    correctOption: "B",
    explanation: "Reginald C. Punnett was a British geneticist who created the Punnett square diagram."
  },
  {
    subject: "Biology",
    questionText: "Experimental proof for semi-conservative DNA replication by Meselson and Stahl was first shown in:",
    optionA: "Plant (Vicia faba)",
    optionB: "Bacterium (Escherichia coli)",
    optionC: "Fungus",
    optionD: "Virus",
    correctOption: "B",
    explanation: "Meselson and Stahl (1958) cultured E. coli with heavy isotope $^{15}\\text{N}$."
  },
  {
    subject: "Biology",
    questionText: "Which monocarpic plant species flowers only ONCE in its life-time (after 50-100 years)?",
    optionA: "Mango",
    optionB: "Jackfruit",
    optionC: "Bamboo species (Bambusa)",
    optionD: "Papaya",
    correctOption: "C",
    explanation: "Bamboo species are monocarpic, flowering once after 50-100 years, producing huge seeds, and dying."
  },
  {
    subject: "Biology",
    questionText: "Vegetative propagules called 'Offsets' in aquatic Eichhornia (water hyacinth) and Pistia are produced by:",
    optionA: "Parthenocarpy",
    optionB: "Mitotic divisions",
    optionC: "Meiotic divisions",
    optionD: "Parthenogenesis",
    correctOption: "B",
    explanation: "Vegetative reproduction occurs via normal mitotic cell divisions."
  },
  {
    subject: "Biology",
    questionText: "Select the CORRECT discovery match:",
    optionA: "Meselson & Stahl - Pisum sativum",
    optionB: "Hershey & Chase - TMV",
    optionC: "Alec Jeffreys - Streptococcus",
    optionD: "Francois Jacob and Jacques Monod - Lac operon model",
    correctOption: "D",
    explanation: "Jacob and Monod elucidated the lactose operon transcriptional regulation model."
  },
  {
    subject: "Biology",
    questionText: "Which highly resistant substance in exine preserves pollen grains as fossils for millions of years?",
    optionA: "Oil content",
    optionB: "Cellulosic intine",
    optionC: "Pollenkitt",
    optionD: "Sporopollenin (Resistant to enzymes, acids, and alkalis)",
    correctOption: "D",
    explanation: "Sporopollenin is one of the most resistant organic biopolymers known, resisting high temperatures, strong acids, and enzymes."
  },
  {
    subject: "Biology",
    questionText: "In population demographics, 'Natality' refers to:",
    optionA: "Number of individuals emigrating",
    optionB: "Birth rate (number of births per unit population per unit time)",
    optionC: "Death rate",
    optionD: "Immigration",
    correctOption: "B",
    explanation: "Natality is the birth rate in a given population."
  },
  {
    subject: "Biology",
    questionText: "World Ozone Day is celebrated annually on:",
    optionA: "16th September",
    optionB: "21st April",
    optionC: "5th June (World Environment Day)",
    optionD: "22nd April (Earth Day)",
    correctOption: "A",
    explanation: "16th September commemorates the signing of the Montreal Protocol in 1987."
  },
  {
    subject: "Biology",
    questionText: "Which of the following atmospheric species is a SECONDARY pollutant formed by photochemical reaction?",
    optionA: "$\\text{SO}_2$",
    optionB: "$\\text{CO}_2$",
    optionC: "$\\text{CO}$",
    optionD: "$\\text{O}_3$ (Ozone in troposphere)",
    correctOption: "D",
    explanation: "Tropospheric ozone is formed by photochemical reaction of $\\text{NO}_x$ and hydrocarbons."
  },
  {
    subject: "Biology",
    questionText: "An ecological 'Niche' is best defined as:",
    optionA: "Temperature range",
    optionB: "Physical habitat space",
    optionC: "Biological factors",
    optionD: "The specific functional role and resource utilization of an organism in its ecosystem",
    correctOption: "D",
    explanation: "Ecological niche encompasses both physical habitat and functional trophic role."
  },
  {
    subject: "Biology",
    questionText: "Given data: Secondary consumer $= 120\\text{ g}$, Primary consumer $= 60\\text{ g}$, Producer $= 10\\text{ g}$. Pyramid type is:",
    optionA: "Upright pyramid of numbers",
    optionB: "Pyramid of energy",
    optionC: "Inverted pyramid of biomass (Aquatic ecosystem)",
    optionD: "Upright pyramid of biomass",
    correctOption: "C",
    explanation: "Standing biomass increases at higher trophic levels ($10\\text{ g} \\to 60\\text{ g} \\to 120\\text{ g}$), forming an inverted pyramid."
  },
  {
    subject: "Biology",
    questionText: "In the stratosphere, which radical acts as a catalytic scavenger degrading ozone into oxygen?",
    optionA: "Iron",
    optionB: "Chlorine free radical ($\\text{Cl}^\\bullet$)",
    optionC: "Carbon",
    optionD: "Molecular oxygen",
    correctOption: "B",
    explanation: "One chlorine radical from CFCs can catalytically destroy over 100,000 ozone molecules."
  },
  {
    subject: "Biology",
    questionText: "The two characteristic functional groups found in all monomeric sugars (carbohydrates) are:",
    optionA: "Carbonyl and Phosphate",
    optionB: "Carbonyl and Methyl",
    optionC: "Hydroxyl and Methyl",
    optionD: "Carbonyl ($-\\text{CHO} / >\\text{C=O}$) and Hydroxyl ($-\\text{OH}$)",
    correctOption: "D",
    explanation: "Carbohydrates are polyhydroxy aldehydes (aldoses) or polyhydroxy ketones (ketoses)."
  },
  {
    subject: "Biology",
    questionText: "Which of the following organisms is a EUKARYOTE (NOT a prokaryote)?",
    optionA: "Nostoc (Cyanobacteria)",
    optionB: "Mycobacterium (Bacteria)",
    optionC: "Saccharomyces cerevisiae (Yeast / Ascomycete fungus)",
    optionD: "Oscillatoria (Cyanobacteria)",
    correctOption: "C",
    explanation: "Yeast (Saccharomyces) is a unicellular eukaryotic fungus."
  },
  {
    subject: "Biology",
    questionText: "The Golgi complex actively participates in which cellular function?",
    optionA: "Bacterial respiration",
    optionB: "Formation and sorting of secretory vesicles and lysosomes",
    optionC: "Fatty acid breakdown",
    optionD: "Amino acid activation",
    correctOption: "B",
    explanation: "Golgi apparatus processes, sorts, and packages glycoproteins into secretory vesicles."
  },
  {
    subject: "Biology",
    questionText: "Which of the following is NOT a product of the light reactions of photosynthesis?",
    optionA: "$\\text{NADPH}$",
    optionB: "$\\text{NADH}$ (Produced in cellular respiration, not photosynthesis)",
    optionC: "$\\text{ATP}$",
    optionD: "$\\text{Oxygen}$",
    correctOption: "B",
    explanation: "Light reaction generates $\\text{ATP}, \\text{NADPH}$, and $\\text{O}_2$. $\\text{NADH}$ is a respiratory coenzyme."
  },
  {
    subject: "Biology",
    questionText: "Which of the following statements is TRUE for the Nucleolus?",
    optionA: "Takes part in spindle formation",
    optionB: "It is a membrane-bound structure",
    optionC: "Larger nucleoli in dividing cells",
    optionD: "It is the site for active ribosomal RNA (rRNA) synthesis and ribosome assembly",
    correctOption: "D",
    explanation: "Nucleolus is a non-membrane-bound subnuclear compartment dedicated to rRNA transcription."
  },
  {
    subject: "Biology",
    questionText: "Stomatal opening and closing movement is NOT directly affected by:",
    optionA: "$\\text{O}_2$ concentration",
    optionB: "Light intensity",
    optionC: "Temperature",
    optionD: "$\\text{CO}_2$ concentration",
    correctOption: "A",
    explanation: "Stomatal aperture responds to light, $\\text{CO}_2$ level, temperature, and ABA, but not ambient $\\text{O}_2$."
  },
  {
    subject: "Biology",
    questionText: "The stage of prophase I during which separation (repulsion) of paired homologous chromosomes begins is:",
    optionA: "Diakinesis",
    optionB: "Diplotene",
    optionC: "Pachytene",
    optionD: "Zygotene",
    correctOption: "B",
    explanation: "In diplotene, dissolution of synaptonemal complex causes paired homologues to separate except at chiasmata."
  },
  {
    subject: "Biology",
    questionText: "Guard cells of stomata in monocot grass leaves are:",
    optionA: "Rectangular",
    optionB: "Kidney-shaped",
    optionC: "Dumb-bell shaped",
    optionD: "Barrel-shaped",
    correctOption: "C",
    explanation: "Grasses have dumb-bell shaped guard cells with bulbous ends."
  },
  {
    subject: "Biology",
    questionText: "Secondary xylem (wood) and secondary phloem in a dicot stem are produced by:",
    optionA: "Phellogen (Cork cambium)",
    optionB: "Vascular cambium (Intrafascicular and Interfascicular)",
    optionC: "Apical meristems",
    optionD: "Axillary meristems",
    correctOption: "B",
    explanation: "Vascular cambial ring cuts off secondary xylem to inside and secondary phloem to outside."
  },
  {
    subject: "Biology",
    questionText: "Pneumatophores (negatively geotropic respiratory roots) occur in:",
    optionA: "Carnivorous plants",
    optionB: "Free-floating hydrophytes",
    optionC: "Halophytes (Mangroves like Rhizophora)",
    optionD: "Submerged hydrophytes",
    correctOption: "C",
    explanation: "Mangrove halophytes in saline marshy soils develop vertical respiratory pneumatophores with lenticels."
  },
  {
    subject: "Biology",
    questionText: "Suberin-impregnated waterproof Casparian strips occur in which root tissue layer?",
    optionA: "Cortex",
    optionB: "Pericycle",
    optionC: "Epidermis",
    optionD: "Endodermis",
    correctOption: "D",
    explanation: "Endodermal cell radial and tangential walls have suberized Casparian strips regulating water flow."
  },
  {
    subject: "Biology",
    questionText: "Plants having little or NO secondary growth (secondary thickening) are:",
    optionA: "Conifers",
    optionB: "Deciduous angiosperms",
    optionC: "Grasses (Monocots with closed vascular bundles)",
    optionD: "Cycads",
    correctOption: "C",
    explanation: "Monocots like grasses lack vascular cambium, showing no secondary growth."
  },
  {
    subject: "Biology",
    questionText: "Sweet potato (Ipomoea batatas) is an edible modified:",
    optionA: "Tap root",
    optionB: "Adventitious root",
    optionC: "Stem",
    optionD: "Rhizome",
    correctOption: "B",
    explanation: "Sweet potato is a tuberous adventitious root storing food reserves (Potato is modified stem tuber)."
  },
  {
    subject: "Biology",
    questionText: "Which of the following botanical statements is CORRECT?",
    optionA: "Horsetails are gymnosperms",
    optionB: "Selaginella is heterosporous and Salvinia homosporous",
    optionC: "Ovules are not enclosed by an ovary wall in gymnosperms (Naked seeded)",
    optionD: "Stems are unbranched in Cedrus",
    correctOption: "C",
    explanation: "Gymnosperms lack an ovary wall, leaving ovules naked on megasporophylls before and after fertilization."
  },
  {
    subject: "Biology",
    questionText: "Select the WRONG biological statement:",
    optionA: "Pseudopodia are locomotory and feeding structures in Sporozoans (Sporozoans lack locomotory organelles)",
    optionB: "Mushrooms belong to Basidiomycetes",
    optionC: "Cell wall is present in Fungi and Plantae",
    optionD: "Mitochondria are present in all eukaryotic kingdoms",
    correctOption: "A",
    explanation: "Pseudopodia are found in Amoeboid protozoans (Amoeba); Sporozoans (Plasmodium) lack locomotory structures."
  },
  {
    subject: "Biology",
    questionText: "After karyogamy followed by meiosis, sexual basidiospores are produced EXOGENOUSLY on sterigmata in:",
    optionA: "Agaricus (Mushroom / Basidiomycetes)",
    optionB: "Alternaria",
    optionC: "Neurospora (Ascomycete producing endogenous ascospores)",
    optionD: "Saccharomyces",
    correctOption: "A",
    explanation: "Basidiomycetes (Agaricus) bear 4 sexual basidiospores exogenously on basidium."
  },
  {
    subject: "Biology",
    questionText: "Match Taxonomic Aids:\n(a) Herbarium, (b) Key, (c) Museum, (d) Catalogue\n(i) Preserved plant & animal specimens, (ii) Methodical species list with brief description, (iii) Dried, pressed specimens on sheets, (iv) Booklet with couplet characters\nChoose correct option:",
    optionA: "(a)-(ii), (b)-(iv), (c)-(iii), (d)-(i)",
    optionB: "(a)-(iii), (b)-(ii), (c)-(i), (d)-(iv)",
    optionC: "(a)-(i), (b)-(iv), (c)-(iii), (d)-(ii)",
    optionD: "(a)-(iii), (b)-(iv), (c)-(i), (d)-(ii)",
    correctOption: "D",
    explanation: "Herbarium = Pressed sheets (iii), Key = Couplet booklet (iv), Museum = Preserved specimens (i), Catalogue = Methodical list (ii)."
  },
  {
    subject: "Biology",
    questionText: "Winged (saccate) anemophilous pollen grains with air bladders are present in:",
    optionA: "Mango",
    optionB: "Cycas",
    optionC: "Mustard",
    optionD: "Pinus (Conifer)",
    correctOption: "D",
    explanation: "Pinus pollen grains develop two lateral air sacs/wings for wind dispersal."
  },
  {
    subject: "Biology",
    questionText: "Which organism is WRONGLY matched with its biological feature?",
    optionA: "Gemma cups - Marchantia",
    optionB: "Biflagellate zoospores - Brown algae",
    optionC: "Uniflagellate gametes - Polysiphonia (Red algae lack all flagellated stages)",
    optionD: "Unicellular alga - Chlorella",
    correctOption: "C",
    explanation: "Rhodophyceae (Polysiphonia) completely lack flagellated zoospores or gametes throughout life cycle."
  },
  {
    subject: "Biology",
    questionText: "Which option correctly represents lung pathophysiology in Asthma and Emphysema respectively?",
    optionA: "Increased respiratory surface; Inflammation of bronchioles",
    optionB: "Increased number of bronchioles; Increased surface",
    optionC: "Inflammation of bronchioles (Asthma); Decreased alveolar respiratory surface (Emphysema)",
    optionD: "Decreased respiratory surface; Inflammation",
    correctOption: "C",
    explanation: "Asthma involves allergic bronchiole inflammation; emphysema involves alveolar wall destruction decreasing gas exchange area."
  },
  {
    subject: "Biology",
    questionText: "Match Heart Valves with Locations:\n(a) Tricuspid valve, (b) Bicuspid (mitral) valve, (c) Semilunar valve\n(i) Between left atrium and left ventricle, (ii) Between right ventricle and pulmonary artery, (iii) Between right atrium and right ventricle\nChoose correct option:",
    optionA: "(a)-(i), (b)-(ii), (c)-(iii)",
    optionB: "(a)-(i), (b)-(iii), (c)-(ii)",
    optionC: "(a)-(iii), (b)-(i), (c)-(ii)",
    optionD: "(a)-(ii), (b)-(i), (c)-(iii)",
    correctOption: "C",
    explanation: "Tricuspid = Right AV (iii), Bicuspid = Left AV (i), Semilunar = Pulmonary/Aortic exits (ii)."
  },
  {
    subject: "Biology",
    questionText: "Match Human Respiratory Volumes:\n(a) Tidal volume, (b) Inspiratory Reserve volume (IRV), (c) Expiratory Reserve volume (ERV), (d) Residual volume (RV)\n(i) $2500-3000\\text{ mL}$, (ii) $1100-1200\\text{ mL}$, (iii) $500-550\\text{ mL}$, (iv) $1000-1100\\text{ mL}$\nChoose correct option:",
    optionA: "(a)-(i), (b)-(iv), (c)-(ii), (d)-(iii)",
    optionB: "(a)-(iii), (b)-(i), (c)-(iv), (d)-(ii)",
    optionC: "(a)-(iii), (b)-(ii), (c)-(i), (d)-(iv)",
    optionD: "(a)-(iv), (b)-(iii), (c)-(ii), (d)-(i)",
    correctOption: "B",
    explanation: "TV = $500\\text{ mL}$ (iii), IRV = $2500-3000\\text{ mL}$ (i), ERV = $1000-1100\\text{ mL}$ (iv), RV = $1100-1200\\text{ mL}$ (ii)."
  },
  {
    subject: "Biology",
    questionText: "The transparent crystalline lens in the human eye is held in place by:",
    optionA: "Smooth muscles of iris",
    optionB: "Ligaments attached to iris",
    optionC: "Zonular suspensory ligaments attached to the ciliary body",
    optionD: "Smooth muscles of ciliary body",
    correctOption: "C",
    explanation: "Suspensory ligaments (zonules of Zinn) extend from ciliary body to anchor the lens."
  },
  {
    subject: "Biology",
    questionText: "Which of the following is an AMINO ACID DERIVED hormone?",
    optionA: "Estradiol (Steroid)",
    optionB: "Ecdysone (Steroid)",
    optionC: "Epinephrine (Tyrosine derivative / Adrenaline)",
    optionD: "Estriol (Steroid)",
    correctOption: "C",
    explanation: "Epinephrine and norepinephrine are catecholamines synthesized from amino acid Tyrosine."
  },
  {
    subject: "Biology",
    questionText: "Which hormones play a major causative/regulatory role in Osteoporosis in post-menopausal women?",
    optionA: "Estrogen deficiency and Parathyroid hormone excess",
    optionB: "Progesterone and Aldosterone",
    optionC: "Aldosterone and Prolactin",
    optionD: "PTH and Prolactin",
    correctOption: "A",
    explanation: "Estrogen promotes bone deposition; post-menopausal estrogen drop and PTH stimulation accelerate bone demineralization."
  },
  {
    subject: "Biology",
    questionText: "Which brain region is INCORRECTLY paired with its function?",
    optionA: "Hypothalamus : Releasing hormones, temperature, hunger",
    optionB: "Limbic system : Fibre tracts interconnecting brain, controls voluntary movement (Basal ganglia / motor cortex controls movement)",
    optionC: "Medulla oblongata : Respiration, cardiovascular reflexes, gastric secretions",
    optionD: "Corpus callosum : Tract connecting cerebral hemispheres",
    correctOption: "B",
    explanation: "Limbic system regulates emotional behaviour, motivation, and sexual drives; motor control is basal ganglia/cerebellum."
  },
  {
    subject: "Biology",
    questionText: "The extra-embryonic Amnion membrane of mammalian embryo is derived from:",
    optionA: "Mesoderm and trophoblast",
    optionB: "Endoderm and mesoderm",
    optionC: "Ectoderm (inner) and Somatopleuric Mesoderm (outer)",
    optionD: "Ectoderm and endoderm",
    correctOption: "C",
    explanation: "Amnion and chorion develop from somatopleure (ectoderm + somatic mesoderm)."
  },
  {
    subject: "Biology",
    questionText: "Endocrine hormones secreted by human Placenta to maintain pregnancy are:",
    optionA: "hCG, hPL, Progestogens, Estrogens",
    optionB: "hCG, hPL, Estrogens, Relaxin, Oxytocin",
    optionC: "hCG, hPL, Progestogens, Prolactin",
    optionD: "hCG, Progestogens, Estrogens, Glucocorticoids",
    correctOption: "A",
    explanation: "Placenta produces Human Chorionic Gonadotropin (hCG), Human Placental Lactogen (hPL), estrogens, and progesterone."
  },
  {
    subject: "Biology",
    questionText: "The precise physiological difference between Spermiogenesis and Spermiation is:",
    optionA: "In spermiogenesis spermatozoa are released, while in spermiation spermatozoa are formed",
    optionB: "In spermiogenesis spermatozoa are formed, while in spermiation spermatids are formed",
    optionC: "In spermiogenesis spermatids are formed, while in spermiation spermatozoa are formed",
    optionD: "In spermiogenesis spermatids differentiate into spermatozoa, while in spermiation mature spermatozoa are released from Sertoli cells into tubule lumen",
    correctOption: "D",
    explanation: "Spermiogenesis is metamorphosis of spermatid to spermatozoon; spermiation is shedding of sperm from Sertoli cell."
  },
  {
    subject: "Biology",
    questionText: "The non-steroidal once-a-week oral contraceptive pill 'SAHELI' (Centchroman) acts by:",
    optionA: "Acting as an IUD",
    optionB: "Increasing estrogen to inhibit ovulation",
    optionC: "Selectively blocking estrogen receptors in uterus, preventing blastocyst implantation",
    optionD: "Post-coital morning after action",
    correctOption: "C",
    explanation: "Centchroman (Saheli) developed by CDRI Lucknow is a selective estrogen receptor modulator (SERM)."
  },
  {
    subject: "Biology",
    questionText: "Ciliated protozoans (like Paramecium) differ from all other protozoans in having:",
    optionA: "Pseudopodia for feeding",
    optionB: "Contractile vacuoles",
    optionC: "Flagella for locomotion",
    optionD: "Nuclear dimorphism: two types of nuclei (Macronucleus and Micronucleus)",
    correctOption: "D",
    explanation: "Ciliates uniquely possess vegetative polyploid macronucleus and reproductive diploid micronucleus."
  },
  {
    subject: "Biology",
    questionText: "Which vertebrate animal class is characterized by having a Crop and Gizzard in its digestive system?",
    optionA: "Aves (Birds)",
    optionB: "Reptilia",
    optionC: "Amphibia",
    optionD: "Osteichthyes",
    correctOption: "A",
    explanation: "Birds lack teeth; food stored in crop is mechanically ground in muscular gizzard."
  },
  {
    subject: "Biology",
    questionText: "Which morphological feature uniquely identifies a MALE cockroach from a female?",
    optionA: "Forewings with darker tegmina",
    optionB: "Presence of a pair of unjointed Caudal styles on 9th sternum",
    optionC: "Boat-shaped 7th sternum",
    optionD: "Presence of anal cerci",
    correctOption: "B",
    explanation: "Male cockroaches possess anal/caudal styles on the 9th sternite; anal cerci (on 10th tergum) are present in both sexes."
  },
  {
    subject: "Biology",
    questionText: "Which of the following animals is POIKILOTHERMIC (cold-blooded / NOT a homeotherm)?",
    optionA: "Camelus (Mammal)",
    optionB: "Chelone (Turtle / Reptile)",
    optionC: "Macropus (Kangaroo / Mammal)",
    optionD: "Psittacula (Parrot / Bird)",
    correctOption: "B",
    explanation: "Chelone (turtle) is a poikilothermic reptile; birds and mammals are homeotherms."
  },
  {
    subject: "Biology",
    questionText: "Which of the following animals develops directly WITHOUT undergoing larval metamorphosis?",
    optionA: "Moth",
    optionB: "Tunicate",
    optionC: "Earthworm (Pheretima exhibits direct development)",
    optionD: "Starfish",
    correctOption: "C",
    explanation: "Earthworms have direct development inside cocoon without free-swimming larval stage."
  },
  {
    subject: "Biology",
    questionText: "Which photosynthetic planktonic organisms are known as CHIEF PRODUCERS in the oceans?",
    optionA: "Cyanobacteria",
    optionB: "Diatoms (Chrysophytes with silica frustules)",
    optionC: "Dinoflagellates",
    optionD: "Euglenoids",
    correctOption: "B",
    explanation: "Diatoms produce majority of organic carbon and oxygen in marine ecosystems."
  },
  {
    subject: "Biology",
    questionText: "Which population interaction ($-/0$) is widely exploited in medicine for antibiotic production (e.g. Penicillium)?",
    optionA: "Parasitism",
    optionB: "Mutualism",
    optionC: "Commensalism",
    optionD: "Amensalism",
    correctOption: "D",
    explanation: "In amensalism, secretion of antibiotic by fungus inhibits or kills bacteria without benefiting or harming the fungus."
  },
  {
    subject: "Biology",
    questionText: "All of the following are EX-SITU biodiversity conservation strategies EXCEPT:",
    optionA: "Botanical gardens",
    optionB: "Sacred groves (In-situ on-site conservation)",
    optionC: "Wildlife safari parks",
    optionD: "Seed banks",
    correctOption: "B",
    explanation: "Sacred groves are tracts of pristine forests protected in-situ by local tribal traditions."
  },
  {
    subject: "Biology",
    questionText: "Match Environmental Phenomena:\n(a) Eutrophication, (b) Sanitary landfill, (c) Snow blindness, (d) Jhum cultivation\n(i) UV-B radiation, (ii) Deforestation, (iii) Nutrient enrichment of water bodies, (iv) Solid waste disposal\nChoose correct option:",
    optionA: "(a)-(iii), (b)-(iv), (c)-(i), (d)-(ii)",
    optionB: "(a)-(i), (b)-(iii), (c)-(iv), (d)-(ii)",
    optionC: "(a)-(ii), (b)-(i), (c)-(iii), (d)-(iv)",
    optionD: "(a)-(i), (b)-(ii), (c)-(iv), (d)-(iii)",
    correctOption: "A",
    explanation: "Eutrophication = Nutrient enrichment (iii), Landfill = Waste disposal (iv), Snow blindness = UV-B (i), Jhum = Deforestation (ii)."
  },
  {
    subject: "Biology",
    questionText: "In an expanding/growing population age pyramid of a country:",
    optionA: "Reproductive and pre-reproductive individuals are equal",
    optionB: "Reproductive are less than post-reproductive",
    optionC: "Pre-reproductive individuals are more numerous than reproductive individuals (Broad triangular base)",
    optionD: "Pre-reproductive are less than reproductive",
    correctOption: "C",
    explanation: "A growing population has a broad triangular base with high proportion of pre-reproductive individuals."
  },
  {
    subject: "Biology",
    questionText: "The unrefined milky latex obtained from unripe seed capsules of Papaver somniferum yields the opioid drug:",
    optionA: "Roots",
    optionB: "Latex (yields morphine / smack)",
    optionC: "Flowers",
    optionD: "Leaves",
    correctOption: "B",
    explanation: "Opium/morphine is extracted from dried latex of poppy (Papaver somniferum) capsules."
  },
  {
    subject: "Biology",
    questionText: "All of the following are essential structural components of a bacterial Operon EXCEPT:",
    optionA: "An Enhancer (Eukaryotic regulatory element, absent in prokaryotic operons)",
    optionB: "Structural genes",
    optionC: "An Operator",
    optionD: "A Promoter",
    correctOption: "A",
    explanation: "Operon consists of promoter, operator, regulator, and structural genes; enhancers are eukaryotic."
  },
  {
    subject: "Biology",
    questionText: "A carrier female with an X-linked recessive mutation on one X-chromosome can transmit this chromosome to:",
    optionA: "Only grandchildren",
    optionB: "Only sons",
    optionC: "Only daughters",
    optionD: "Both sons and daughters ($50\\%$ probability each)",
    correctOption: "D",
    explanation: "A mother contributes one X-chromosome to her sons (XY) and one to her daughters (XX)."
  },
  {
    subject: "Biology",
    questionText: "According to Hugo de Vries, the primary evolutionary mechanism is single-step large mutation called:",
    optionA: "Phenotypic variations",
    optionB: "Saltation",
    optionC: "Multiple step mutations",
    optionD: "Minor continuous variations",
    correctOption: "B",
    explanation: "Hugo de Vries termed single-step large saltatory mutations as the driving force of speciation."
  },
  {
    subject: "Biology",
    questionText: "If coding strand sequence is $5'-\\text{AGGTATCGCAT}-3'$, the transcribed mRNA sequence is:",
    optionA: "$5'-\\text{ACCUAUGCGAU}-3'$",
    optionB: "$5'-\\text{UGGTUTCGCAT}-3'$",
    optionC: "$5'-\\text{AGGUAUCGCAU}-3'$",
    optionD: "$5'-\\text{UCCAUAGCGUA}-3'$",
    correctOption: "C",
    explanation: "mRNA matches coding strand exactly with Thymine (T) replaced by Uracil (U)."
  },
  {
    subject: "Biology",
    questionText: "Match Menstrual Cycle Phases:\n(a) Proliferative phase, (b) Secretory phase, (c) Menstruation\n(i) Breakdown of endometrial lining, (ii) Follicular phase (Estrogen rise), (iii) Luteal phase (Progesterone peak)\nChoose correct option:",
    optionA: "(a)-(ii), (b)-(iii), (c)-(i)",
    optionB: "(a)-(i), (b)-(iii), (c)-(ii)",
    optionC: "(a)-(iii), (b)-(ii), (c)-(i)",
    optionD: "(a)-(iii), (b)-(i), (c)-(ii)",
    correctOption: "A",
    explanation: "Proliferative = Follicular (ii), Secretory = Luteal (iii), Menstruation = Endometrial sloughing (i)."
  },
  {
    subject: "Biology",
    questionText: "Match Renal/Joint Disorders:\n(a) Glycosuria, (b) Gout, (c) Renal calculi, (d) Glomerulonephritis\n(i) Uric acid crystal accumulation in joints, (ii) Insoluble oxalates crystallization in kidney, (iii) Inflammation of glomeruli, (iv) Glucose in urine\nChoose correct option:",
    optionA: "(a)-(ii), (b)-(iii), (c)-(i), (d)-(iv)",
    optionB: "(a)-(i), (b)-(ii), (c)-(iii), (d)-(iv)",
    optionC: "(a)-(iii), (b)-(ii), (c)-(iv), (d)-(i)",
    optionD: "(a)-(iv), (b)-(i), (c)-(ii), (d)-(iii)",
    correctOption: "D",
    explanation: "Glycosuria = Glucose (iv), Gout = Uric acid in joints (i), Calculi = Kidney stones (ii), Glomerulonephritis = Glomerular inflammation (iii)."
  },
  {
    subject: "Biology",
    questionText: "Match Nephron Parts with Excretory Functions:\n(a) Ultrafiltration, (b) Concentration of urine, (c) Transport of urine, (d) Storage of urine\n(i) Henle's loop, (ii) Ureter, (iii) Urinary bladder, (iv) Malpighian corpuscle (Glomerulus + Bowman's capsule)\nChoose correct option:",
    optionA: "(a)-(v), (b)-(iv), (c)-(i), (d)-(ii)",
    optionB: "(a)-(iv), (b)-(i), (c)-(ii), (d)-(iii)",
    optionC: "(a)-(iv), (b)-(v), (c)-(ii), (d)-(iii)",
    optionD: "(a)-(v), (b)-(iv), (c)-(i), (d)-(iii)",
    correctOption: "B",
    explanation: "Ultrafiltration = Malpighian corpuscle (iv), Concentration = Loop of Henle (i), Transport = Ureter (ii), Storage = Bladder (iii)."
  },
  {
    subject: "Biology",
    questionText: "Which gastric mucosal cells secrete Castle's Intrinsic Factor essential for Vitamin $\\text{B}_{12}$ absorption in erythropoiesis?",
    optionA: "Goblet cells",
    optionB: "Mucous neck cells",
    optionC: "Chief / Peptic cells",
    optionD: "Parietal / Oxyntic cells",
    correctOption: "D",
    explanation: "Parietal (oxyntic) cells secrete $\\text{HCl}$ and Intrinsic Factor required for intestinal absorption of Vitamin $\\text{B}_{12}$."
  },
  {
    subject: "Biology",
    questionText: "Match Plasma Proteins with Functions:\n(a) Fibrinogen, (b) Globulin, (c) Albumin\n(i) Colloid osmotic balance, (ii) Blood coagulation / clotting, (iii) Humoral defense antibodies\nChoose correct option:",
    optionA: "(a)-(i), (b)-(iii), (c)-(ii)",
    optionB: "(a)-(i), (b)-(ii), (c)-(iii)",
    optionC: "(a)-(iii), (b)-(ii), (c)-(i)",
    optionD: "(a)-(ii), (b)-(iii), (c)-(i)",
    correctOption: "D",
    explanation: "Fibrinogen = Clotting (ii), Globulins = Antibodies/defense (iii), Albumin = Osmotic pressure (i)."
  },
  {
    subject: "Biology",
    questionText: "Which of the following is a chronic Occupational Respiratory Disorder caused by silica dust inhalation?",
    optionA: "Botulism",
    optionB: "Silicosis",
    optionC: "Anthracis",
    optionD: "Emphysema",
    correctOption: "B",
    explanation: "Inhalation of silica dust in stone-breaking industries causes fibrous proliferation in upper lungs (silicosis)."
  },
  {
    subject: "Biology",
    questionText: "During skeletal muscle excitation-contraction coupling, $\\text{Ca}^{2+}$ ions trigger cross-bridge cycling by:",
    optionA: "Detaching myosin head",
    optionB: "Activating myosin ATPase",
    optionC: "Binding to Troponin-C to displace tropomyosin and unmask myosin-binding sites on actin",
    optionD: "Preventing cross-bridge bonds",
    correctOption: "C",
    explanation: "$\\text{Ca}^{2+}$ binds to troponin C, inducing conformational shift in tropomyosin to expose actin active sites."
  },
  {
    subject: "Biology",
    questionText: "Nissl's granules in neuronal cyton and dendrites are dense basophilic bodies composed of:",
    optionA: "Nucleic acids and SER",
    optionB: "DNA and RNA",
    optionC: "Proteins and lipids",
    optionD: "Free ribosomes and Rough Endoplasmic Reticulum (RER)",
    correctOption: "D",
    explanation: "Nissl granules are masses of RER with rosettes of free polyribosomes synthesizing neurotransmitters."
  },
  {
    subject: "Biology",
    questionText: "Which statement regarding cellular respiration is INCORRECT?",
    optionA: "Glycolysis operates as long as $\\text{NAD}^+$ is available",
    optionB: "Glycolysis occurs in cytosol",
    optionC: "Enzymes of Krebs cycle are in mitochondrial matrix",
    optionD: "Oxidative phosphorylation takes place in outer mitochondrial membrane (Takes place on inner mitochondrial membrane / cristae)",
    correctOption: "D",
    explanation: "Electron transport chain and ATP synthase are embedded in inner mitochondrial membrane."
  },
  {
    subject: "Biology",
    questionText: "Which chromosome structure match is INCORRECT?",
    optionA: "Submetacentric - L-shaped chromosomes",
    optionB: "Allosomes - Sex chromosomes",
    optionC: "Lampbrush chromosomes - Diplotene bivalents",
    optionD: "Polytene chromosomes - Oocytes of amphibians (Polytene chromosomes occur in salivary glands of Dipterans)",
    correctOption: "D",
    explanation: "Giant polytene chromosomes occur in salivary gland cells of Dipteran larvae; lampbrush chromosomes are in amphibian oocytes."
  },
  {
    subject: "Biology",
    questionText: "Which terms correctly describe human dentition?",
    optionA: "Pleurodont, Monophyodont, Homodont",
    optionB: "Thecodont (in jaw sockets), Diphyodont (two sets of teeth), Heterodont (different types: I, C, PM, M)",
    optionC: "Thecodont, Diphyodont, Homodont",
    optionD: "Pleurodont, Diphyodont, Heterodont",
    correctOption: "B",
    explanation: "Human teeth are lodged in sockets (thecodont), have deciduous and permanent sets (diphyodont), and 4 distinct morphologies (heterodont)."
  },
  {
    subject: "Biology",
    questionText: "Which biochemical process does NOT occur in Rough Endoplasmic Reticulum?",
    optionA: "Cleavage of signal peptide",
    optionB: "Protein glycosylation",
    optionC: "Protein folding with chaperones",
    optionD: "Phospholipid synthesis (Synthesized in Smooth Endoplasmic Reticulum / SER)",
    correctOption: "D",
    explanation: "Lipids, phospholipids, and steroid hormones are synthesized on membranes of Smooth ER."
  },
  {
    subject: "Biology",
    questionText: "A string of multiple ribosomes translating a single mRNA molecule simultaneously is termed a:",
    optionA: "Plastidome",
    optionB: "Polyhedral body",
    optionC: "Polysome (Polyribosome)",
    optionD: "Nucleosome",
    correctOption: "C",
    explanation: "A polysome allows multiple copies of a polypeptide to be synthesized efficiently from one mRNA strand."
  },
  {
    subject: "Biology",
    questionText: "Elephantiasis (Filariasis) with chronic lymphatic obstruction of lower limbs is caused by:",
    optionA: "Ringworm",
    optionB: "Ascaris",
    optionC: "Wuchereria bancrofti transmitted by female Culex mosquito",
    optionD: "Amoeba",
    correctOption: "C",
    explanation: "Wuchereria bancrofti filarial worms reside in lymphatic vessels, causing severe chronic lymphedema."
  },
  {
    subject: "Biology",
    questionText: "Which of the following is NOT an autoimmune disease?",
    optionA: "Alzheimer's disease (Neurodegenerative disorder)",
    optionB: "Rheumatoid arthritis",
    optionC: "Psoriasis",
    optionD: "Vitiligo",
    correctOption: "A",
    explanation: "Alzheimer's is a neurodegenerative disorder caused by amyloid-beta plaques and tau tangles, not autoimmune destruction."
  },
  {
    subject: "Biology",
    questionText: "Among the following sets of anatomical examples, select the INCORRECT example of divergent evolution (Homology):",
    optionA: "Brain of bat, man and cheetah",
    optionB: "Heart of bat, man and cheetah",
    optionC: "Forelimbs of man, bat and cheetah",
    optionD: "Eye of octopus, bat and man (Analogous / Convergent evolution)",
    correctOption: "D",
    explanation: "Eyes of octopus and mammals represent convergent evolution (analogy), not divergent evolution."
  },
  {
    subject: "Biology",
    questionText: "Conversion of milk into curd by Lactic Acid Bacteria (LAB) enhances nutritional value by synthesizing:",
    optionA: "Vitamin $\\text{B}_{12}$ (Cyanocobalamin)",
    optionB: "Vitamin A",
    optionC: "Vitamin D",
    optionD: "Vitamin E",
    correctOption: "A",
    explanation: "LAB fermentation enriches curd with Vitamin $\\text{B}_{12}$ and checks pathogenic microbes in stomach."
  },
  {
    subject: "Biology",
    questionText: "The homologous pentadactyl bone structure in forelimbs of cheetah, whale, bat and man is evidence of:",
    optionA: "Convergent evolution",
    optionB: "Analogy",
    optionC: "Homology (Divergent evolution from common ancestor)",
    optionD: "Adaptive radiation",
    correctOption: "C",
    explanation: "Structures sharing common anatomical origin and basic plan modified for diverse functions represent homology."
  },
  {
    subject: "Biology",
    questionText: "Which genetic phenomena represent the inheritance of ABO blood groups in human population?\n(a) Dominance\n(b) Co-dominance\n(c) Multiple allelism\n(d) Incomplete dominance\n(e) Polygenic inheritance\nChoose correct option:",
    optionA: "b, d and e",
    optionB: "a, b and c only",
    optionC: "b, c and e",
    optionD: "a, c and e",
    correctOption: "B",
    explanation: "ABO blood groups show Dominance ($I^A > i, I^B > i$), Co-dominance ($I^A I^B$), and Multiple allelism ($I^A, I^B, i$ in population)."
  }
];

async function seedNeet2018Paper() {
  console.log(`🚀 Compiling NEET 2018 Paper JSON with ${rawQuestions.length} complete questions...`);

  const paperData = {
    examName: "NEET",
    year: 2018,
    shiftName: "NEET 2018",
    examDate: "2018-05-06T14:00:00Z",
    totalMarks: 720,
    totalQuestions: 180,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'NEET 2018.json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved NEET 2018 JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding NEET 2018 Shift into Database via Prisma...`);
  
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
      name: "NEET 2018"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "NEET 2018",
      date: new Date("2018-05-06T14:00:00Z")
    }
  });
  console.log(`Created Shift "NEET 2018" (ID: ${shift.id})`);

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

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for NEET 2018 in PostgreSQL!`);
}

seedNeet2018Paper()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
