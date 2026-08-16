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
// 1. Generate Crisp Vector SVGs for NEET 2016
// ---------------------------------------------------------------------

// Q12: Logic circuit (OR followed by AND with input C)
saveSvg('neet_2016_q12.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 180" width="100%" height="150">
  <rect width="360" height="180" fill="#0f172a" rx="16"/>
  <!-- Inputs A, B -->
  <text x="30" y="55" fill="#f8fafc" font-family="sans-serif" font-size="14">A</text>
  <circle cx="50" cy="50" r="3" fill="#38bdf8"/>
  <line x1="50" y1="50" x2="100" y2="50" stroke="#94a3b8" stroke-width="2"/>

  <text x="30" y="85" fill="#f8fafc" font-family="sans-serif" font-size="14">B</text>
  <circle cx="50" cy="80" r="3" fill="#38bdf8"/>
  <line x1="50" y1="80" x2="100" y2="80" stroke="#94a3b8" stroke-width="2"/>

  <!-- OR Gate -->
  <path d="M100 40 Q120 65 100 90 Q140 90 160 65 Q140 40 100 40 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <line x1="160" y1="65" x2="220" y2="65" stroke="#94a3b8" stroke-width="2"/>

  <!-- Input C -->
  <text x="30" y="125" fill="#f8fafc" font-family="sans-serif" font-size="14">C</text>
  <circle cx="50" cy="120" r="3" fill="#38bdf8"/>
  <line x1="50" y1="120" x2="220" y2="120" stroke="#94a3b8" stroke-width="2"/>

  <!-- AND Gate -->
  <path d="M220 50 L250 50 A35 35 0 0 1 250 135 L220 135 Z" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
  <line x1="285" y1="92.5" x2="330" y2="92.5" stroke="#94a3b8" stroke-width="2"/>
  <text x="335" y="97" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="14">Y</text>
</svg>`);

// Q25: Capacitor charging / switch position
saveSvg('neet_2016_q25.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 200" width="100%" height="160">
  <rect width="380" height="200" fill="#0f172a" rx="16"/>
  <line x1="50" y1="100" x2="90" y2="100" stroke="#94a3b8" stroke-width="2"/>
  <line x1="90" y1="70" x2="90" y2="130" stroke="#f59e0b" stroke-width="3"/>
  <line x1="96" y1="80" x2="96" y2="120" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="60" y="105" fill="#f59e0b" font-family="sans-serif" font-size="13">V</text>
  <line x1="96" y1="100" x2="130" y2="100" stroke="#94a3b8" stroke-width="2"/>

  <!-- Switch S to pos 1 or 2 -->
  <circle cx="150" cy="50" r="4" fill="#38bdf8"/>
  <text x="145" y="40" fill="#38bdf8" font-family="sans-serif" font-size="12">1</text>
  <circle cx="210" cy="50" r="4" fill="#38bdf8"/>
  <text x="215" y="40" fill="#38bdf8" font-family="sans-serif" font-size="12">2</text>

  <circle cx="180" cy="80" r="4" fill="#f8fafc"/>
  <text x="175" y="98" fill="#f8fafc" font-family="sans-serif" font-size="12">S</text>

  <!-- 2 uF capacitor -->
  <line x1="180" y1="80" x2="180" y2="120" stroke="#94a3b8" stroke-width="2"/>
  <line x1="165" y1="120" x2="195" y2="120" stroke="#38bdf8" stroke-width="2.5"/>
  <line x1="165" y1="128" x2="195" y2="128" stroke="#38bdf8" stroke-width="2.5"/>
  <text x="125" y="128" fill="#38bdf8" font-family="sans-serif" font-size="11">2 μF</text>
  <line x1="180" y1="128" x2="180" y2="170" stroke="#94a3b8" stroke-width="2"/>

  <!-- 8 uF capacitor -->
  <line x1="210" y1="50" x2="280" y2="50" stroke="#94a3b8" stroke-width="2"/>
  <line x1="280" y1="50" x2="280" y2="120" stroke="#94a3b8" stroke-width="2"/>
  <line x1="265" y1="120" x2="295" y2="120" stroke="#a855f7" stroke-width="2.5"/>
  <line x1="265" y1="128" x2="295" y2="128" stroke="#a855f7" stroke-width="2.5"/>
  <text x="305" y="128" fill="#a855f7" font-family="sans-serif" font-size="11">8 μF</text>
  <line x1="280" y1="128" x2="280" y2="170" stroke="#94a3b8" stroke-width="2"/>

  <line x1="180" y1="170" x2="280" y2="170" stroke="#94a3b8" stroke-width="2"/>
  <line x1="130" y1="170" x2="180" y2="170" stroke="#94a3b8" stroke-width="2"/>
  <line x1="130" y1="100" x2="130" y2="170" stroke="#94a3b8" stroke-width="2"/>
</svg>`);

// Q31: Ideal Diode Circuit (+4V to -6V)
saveSvg('neet_2016_q31.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 160" width="100%" height="130">
  <rect width="380" height="160" fill="#0f172a" rx="16"/>
  <!-- Node A -->
  <circle cx="50" cy="80" r="5" fill="#38bdf8"/>
  <text x="45" y="60" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="13">A (+4V)</text>
  <line x1="50" y1="80" x2="110" y2="80" stroke="#94a3b8" stroke-width="2"/>

  <!-- Diode symbol pointing right -->
  <polygon points="110,65 140,80 110,95" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <line x1="140" y1="65" x2="140" y2="95" stroke="#38bdf8" stroke-width="3"/>
  <line x1="140" y1="80" x2="190" y2="80" stroke="#94a3b8" stroke-width="2"/>

  <!-- Resistor 1k -->
  <path d="M190 80 L195 70 L205 90 L215 70 L225 90 L230 80" fill="none" stroke="#f59e0b" stroke-width="2"/>
  <text x="210" y="60" fill="#f59e0b" font-family="sans-serif" font-size="12" text-anchor="middle">1 kΩ</text>
  <line x1="230" y1="80" x2="310" y2="80" stroke="#94a3b8" stroke-width="2"/>

  <!-- Node B -->
  <circle cx="310" cy="80" r="5" fill="#ef4444"/>
  <text x="305" y="60" fill="#ef4444" font-family="sans-serif" font-weight="bold" font-size="13">B (-6V)</text>

  <text x="180" y="135" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle">I = [4 - (-6)] / 1000 = 10 mA = 10⁻² A</text>
</svg>`);

// Q35: Square loop carrying current near long wire
saveSvg('neet_2016_q35.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="100%" height="180">
  <rect width="360" height="220" fill="#0f172a" rx="16"/>
  <!-- Straight wire XY carrying I -->
  <line x1="60" y1="20" x2="60" y2="200" stroke="#38bdf8" stroke-width="3.5"/>
  <polygon points="60,20 54,35 66,35" fill="#38bdf8"/>
  <text x="40" y="30" fill="#38bdf8" font-family="sans-serif" font-size="14">Y</text>
  <text x="40" y="195" fill="#38bdf8" font-family="sans-serif" font-size="14">X</text>
  <text x="40" y="110" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="14">I</text>

  <!-- Distance L/2 -->
  <line x1="60" y1="180" x2="130" y2="180" stroke="#64748b" stroke-dasharray="2 2"/>
  <text x="95" y="175" fill="#64748b" font-family="sans-serif" font-size="11" text-anchor="middle">L/2</text>

  <!-- Square loop ABCD -->
  <rect x="130" y="50" width="100" height="100" fill="#1e293b" stroke="#f59e0b" stroke-width="2.5"/>
  <text x="120" y="45" fill="#f8fafc" font-family="sans-serif" font-size="12">B</text>
  <text x="235" y="45" fill="#f8fafc" font-family="sans-serif" font-size="12">C</text>
  <text x="120" y="165" fill="#f8fafc" font-family="sans-serif" font-size="12">A</text>
  <text x="235" y="165" fill="#f8fafc" font-family="sans-serif" font-size="12">D</text>

  <!-- Counter-clockwise current i in loop -->
  <text x="180" y="105" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle">↺ i</text>
  <text x="180" y="205" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">F_net = 2 μ₀ I i / 3π (Attraction)</text>
</svg>`);

console.log("NEET 2016 SVGs generated!");

// ---------------------------------------------------------------------
// 2. Complete 180 Questions for NEET 2016 (Phy 1-45, Chem 46-90, Bio 91-180)
// ---------------------------------------------------------------------
const rawQuestions = [
  // -------------------------------------------------------------
  // PHYSICS (Q1 - Q45)
  // -------------------------------------------------------------
  {
    subject: "Physics",
    questionText: "A siren emitting $800\\text{ Hz}$ moves at $15\\text{ m/s}$ towards a cliff away from observer. Frequency of reflected echo heard by observer is ($v = 330\\text{ m/s}$):",
    optionA: "$838\\text{ Hz}$",
    optionB: "$885\\text{ Hz}$",
    optionC: "$765\\text{ Hz}$",
    optionD: "$800\\text{ Hz}$",
    correctOption: "A",
    explanation: "$f' = f \\left(\\frac{v}{v - v_s}\\right) = 800 \\left(\\frac{330}{330 - 15}\\right) = 800 \\times \\frac{330}{315} = 838.1\\text{ Hz}$."
  },
  {
    subject: "Physics",
    questionText: "Which of the following can be used to produce a propagating electromagnetic wave?",
    optionA: "A chargeless particle",
    optionB: "An accelerating charge",
    optionC: "A charge moving at constant velocity",
    optionD: "A stationary charge",
    correctOption: "B",
    explanation: "Accelerating charges radiate time-varying electric and magnetic fields that propagate as EM waves."
  },
  {
    subject: "Physics",
    questionText: "An inductor $20\\text{ mH}$, capacitor $50\\,\\mu\\text{F}$, and resistor $40\\,\\Omega$ are in series across $V = 10\\sin(340t)$. Power loss in circuit is:",
    optionA: "$0.76\\text{ W}$",
    optionB: "$0.89\\text{ W}$",
    optionC: "$0.51\\text{ W}$",
    optionD: "$0.67\\text{ W}$",
    correctOption: "C",
    explanation: "$X_L = 340 \\times 0.02 = 6.8\\,\\Omega$. $X_C = \\frac{1}{340 \\times 50 \\times 10^{-6}} = 58.82\\,\\Omega$. $Z = \\sqrt{40^2 + (52.02)^2} = 65.6\\,\\Omega$. $P = \\left(\\frac{10/\\sqrt{2}}{65.6}\\right)^2 \\times 40 = 0.51\\text{ W}$."
  },
  {
    subject: "Physics",
    questionText: "Match magnification $m$ with mirror nature:\n(A) $m = -2$, (B) $m = -1/2$, (C) $m = +2$, (D) $m = +1/2$\n(a) Convex mirror, (b) Concave mirror, (c) Real image, (d) Virtual image\nChoose correct option:",
    optionA: "A $\\to$ a,d; B $\\to$ b,c; C $\\to$ b,d; D $\\to$ b,c",
    optionB: "A $\\to$ c,d; B $\\to$ b,d; C $\\to$ b,c; D $\\to$ a,d",
    optionC: "A $\\to$ b,c; B $\\to$ b,c; C $\\to$ b,d; D $\\to$ a,d",
    optionD: "A $\\to$ a,c; B $\\to$ a,d; C $\\to$ a,b; D $\\to$ c,d",
    correctOption: "C",
    explanation: "Negative $m \\implies$ Real image in concave mirror. $m = +2 \\implies$ Magnified virtual image in concave mirror. $m = +1/2 \\implies$ Diminished virtual image in convex mirror."
  },
  {
    subject: "Physics",
    questionText: "If $(l_2 - l_1)$ is maintained constant at all temperatures for brass and steel rods ($\\alpha_1, \\alpha_2$), the correct relation is:",
    optionA: "$\\alpha_1^2 l_2 = \\alpha_2^2 l_1$",
    optionB: "$\\alpha_1 l_1 = \\alpha_2 l_2$",
    optionC: "$\\alpha_1 l_2 = \\alpha_2 l_1$",
    optionD: "$\\alpha_1 l_1^2 = \\alpha_2 l_2^2$",
    correctOption: "B",
    explanation: "$\\Delta l_2 - \\Delta l_1 = 0 \\implies l_2 \\alpha_2 \\Delta T - l_1 \\alpha_1 \\Delta T = 0 \\implies \\alpha_1 l_1 = \\alpha_2 l_2$."
  },
  {
    subject: "Physics",
    questionText: "At what height $h$ from Earth's surface are $V = -5.4 \\times 10^7\\text{ J/kg}$ and $g = 6.0\\text{ m/s}^2$? ($R = 6400\\text{ km}$):",
    optionA: "$1400\\text{ km}$",
    optionB: "$2000\\text{ km}$",
    optionC: "$2600\\text{ km}$",
    optionD: "$1600\\text{ km}$",
    correctOption: "C",
    explanation: "$|V| = \\frac{GM}{R+h}$ and $g = \\frac{GM}{(R+h)^2} \\implies R + h = \\frac{|V|}{g} = \\frac{5.4 \\times 10^7}{6.0} = 9000\\text{ km} \\implies h = 9000 - 6400 = 2600\\text{ km}$."
  },
  {
    subject: "Physics",
    questionText: "Ice falls from height $h$ such that $1/4$th of heat produced melts it completely. ($L = 3.4 \\times 10^5\\text{ J/kg}, g = 10\\text{ N/kg}$). Height $h$ is:",
    optionA: "$136\\text{ km}$",
    optionB: "$68\\text{ km}$",
    optionC: "$34\\text{ km}$",
    optionD: "$544\\text{ km}$",
    correctOption: "A",
    explanation: "$\\frac{1}{4}(m g h) = m L \\implies h = \\frac{4L}{g} = \\frac{4 \\times 3.4 \\times 10^5}{10} = 1.36 \\times 10^5\\text{ m} = 136\\text{ km}$."
  },
  {
    subject: "Physics",
    questionText: "In single slit diffraction ($5000\\text{ Å}$), 1st minimum is at $30^\\circ$. Angle for 1st secondary maximum is:",
    optionA: "$\\sin^{-1}(1/2)$",
    optionB: "$\\sin^{-1}(3/4)$",
    optionC: "$\\sin^{-1}(1/4)$",
    optionD: "$\\sin^{-1}(2/3)$",
    correctOption: "B",
    explanation: "$a \\sin 30^\\circ = \\lambda \\implies a = 2\\lambda$. 1st secondary maximum: $a \\sin\\theta = \\frac{3}{2}\\lambda \\implies \\sin\\theta = \\frac{3\\lambda}{2(2\\lambda)} = \\frac{3}{4} \\implies \\theta = \\sin^{-1}(3/4)$."
  },
  {
    subject: "Physics",
    questionText: "Two cells in series give balance lengths $50\\text{ cm}$ (assisting) and $10\\text{ cm}$ (opposing). Ratio of EMFs $E_1 : E_2$ is:",
    optionA: "$3 : 4$",
    optionB: "$3 : 2$",
    optionC: "$5 : 1$",
    optionD: "$5 : 4$",
    correctOption: "B",
    explanation: "$\\frac{E_1 + E_2}{E_1 - E_2} = \\frac{50}{10} = 5 \\implies E_1 + E_2 = 5E_1 - 5E_2 \\implies 4E_1 = 6E_2 \\implies \\frac{E_1}{E_2} = \\frac{3}{2}$."
  },
  {
    subject: "Physics",
    questionText: "Particle of mass $10\\text{ g}$ in circle ($r = 6.4\\text{ cm}$) reaches $KE = 8 \\times 10^{-4}\\text{ J}$ at end of 2nd revolution from rest. Tangential acceleration is:",
    optionA: "$0.18\\text{ m/s}^2$",
    optionB: "$0.2\\text{ m/s}^2$",
    optionC: "$0.1\\text{ m/s}^2$",
    optionD: "$0.15\\text{ m/s}^2$",
    correctOption: "C",
    explanation: "$KE = \\frac{1}{2} m v^2 = 8 \\times 10^{-4} \\implies v^2 = 0.16\\text{ m}^2/\\text{s}^2$. $s = 2(2\\pi r) = 4\\pi(0.064) = 0.804\\text{ m} \\implies a_t = \\frac{v^2}{2s} = \\frac{0.16}{2 \\times 4\\pi \\times 0.064} = 0.1\\text{ m/s}^2$."
  },
  {
    subject: "Physics",
    questionText: "Closed organ pipe fundamental resonating length is $50\\text{ cm}$. Next resonating length for same tuning fork is:",
    optionA: "$150\\text{ cm}$",
    optionB: "$200\\text{ cm}$",
    optionC: "$66.7\\text{ cm}$",
    optionD: "$100\\text{ cm}$",
    correctOption: "A",
    explanation: "Closed pipe resonates at odd multiples: $l_1 = \\lambda/4 = 50\\text{ cm} \\implies l_2 = 3\\lambda/4 = 3(50) = 150\\text{ cm}$."
  },
  {
    subject: "Physics",
    questionText: "To get output $Y = 1$ in the logic circuit (OR gate of A, B feeding into AND gate with C), input choice is:",
    imageUrl: "/neetimages/neet_2016_q12.svg",
    optionA: "$A=1, B=1, C=0$",
    optionB: "$A=1, B=0, C=1$",
    optionC: "$A=0, B=1, C=0$",
    optionD: "$A=1, B=0, C=0$",
    correctOption: "B",
    explanation: "$Y = (A+B) \\cdot C$. For $Y=1$, $C$ must be 1 and $(A+B)$ must be 1. Thus $A=1, B=0, C=1$."
  },
  {
    subject: "Physics",
    questionText: "A gas is compressed to half volume isothermally and separately adiabatically. Then:",
    optionA: "Both require same work",
    optionB: "Depends on atomicity",
    optionC: "Isothermal requires more work",
    optionD: "Compressing through adiabatic process requires more work to be done",
    correctOption: "D",
    explanation: "Adiabatic curve is steeper ($P \\propto V^{-\\gamma}$); area under adiabatic $P-V$ curve during compression is larger."
  },
  {
    subject: "Physics",
    questionText: "In YDSE with $d = 5\\lambda, D = 10d$, intensity in front of one slit ($y = d/2$) on screen is:",
    optionA: "$\\frac{3}{4} I_0$",
    optionB: "$I_0 / 2$",
    optionC: "$I_0$",
    optionD: "$I_0 / 4$",
    correctOption: "B",
    explanation: "$\\Delta x = \\frac{y d}{D} = \\frac{(d/2)d}{10d} = \\frac{d}{20} = \\frac{5\\lambda}{20} = \\frac{\\lambda}{4} \\implies \\phi = \\frac{\\pi}{2} \\implies I = I_0 \\cos^2(\\pi/4) = \\frac{I_0}{2}$."
  },
  {
    subject: "Physics",
    questionText: "Maximum safe speed on a rough banked road of radius $R$, angle $\\theta$, and friction coefficient $\\mu_s$ is:",
    optionA: "$\\sqrt{\\frac{g}{R} \\frac{\\mu_s + \\tan\\theta}{1 - \\mu_s\\tan\\theta}}$",
    optionB: "$\\sqrt{\\frac{g}{R^2} \\frac{\\mu_s + \\tan\\theta}{1 - \\mu_s\\tan\\theta}}$",
    optionC: "$\\sqrt{g R^2 \\frac{\\mu_s + \\tan\\theta}{1 - \\mu_s\\tan\\theta}}$",
    optionD: "$\\sqrt{g R \\frac{\\mu_s + \\tan\\theta}{1 - \\mu_s\\tan\\theta}}$",
    correctOption: "D",
    explanation: "Standard banked friction formula: $v_{\\text{max}} = \\sqrt{g R \\left(\\frac{\\mu_s + \\tan\\theta}{1 - \\mu_s\\tan\\theta}\\right)}$."
  },
  {
    subject: "Physics",
    questionText: "An electron ($m$) and a photon have same energy $E$. The ratio of de-Broglie wavelengths $\\lambda_e / \\lambda_{\\text{ph}}$ is:",
    optionA: "$c(2mE)^{1/2}$",
    optionB: "$\\frac{1}{c} \\left(\\frac{2m}{E}\\right)^{1/2}$",
    optionC: "$\\frac{1}{c} \\left(\\frac{E}{2m}\\right)^{1/2}$",
    optionD: "$\\left(\\frac{E}{2m}\\right)^{1/2}$",
    correctOption: "C",
    explanation: "$\\lambda_e = \\frac{h}{\\sqrt{2mE}}$, $\\lambda_{\\text{ph}} = \\frac{hc}{E} \\implies \\frac{\\lambda_e}{\\lambda_{\\text{ph}}} = \\frac{h}{\\sqrt{2mE}} \\frac{E}{hc} = \\frac{1}{c}\\sqrt{\\frac{E}{2m}}$."
  },
  {
    subject: "Physics",
    questionText: "Black body at $5760\\text{ K}$ has Wien constant $b = 2.88 \\times 10^6\\text{ nm K}$. Emitted energies at $250\\text{ nm} (U_1)$ and $500\\text{ nm} (U_2)$ satisfy:",
    optionA: "$U_1 > U_2$",
    optionB: "$U_2 > U_1$ (Peak $\\lambda_m = 500\\text{ nm}$)",
    optionC: "$U_1 = 0$",
    optionD: "$U_3 = 0$",
    correctOption: "A",
    explanation: "$\\lambda_{\\text{max}} = \\frac{2.88 \\times 10^6}{5760} = 500\\text{ nm} \\implies$ maximum spectral radiance $U_2$ at $500\\text{ nm} \\implies U_2 > U_1$ (Official key: 1 / 2)."
  },
  {
    subject: "Physics",
    questionText: "For Rydberg constant $R = 10^7\\text{ m}^{-1}$, wavenumber $\\bar{\\nu}$ of last line of Balmer series is:",
    optionA: "$0.25 \\times 10^7\\text{ m}^{-1}$",
    optionB: "$2.5 \\times 10^7\\text{ m}^{-1}$",
    optionC: "$0.025 \\times 10^4\\text{ m}^{-1}$",
    optionD: "$0.5 \\times 10^7\\text{ m}^{-1}$",
    correctOption: "A",
    explanation: "$\\bar{\\nu} = R\\left(\\frac{1}{2^2} - \\frac{1}{\\infty^2}\\right) = \\frac{R}{4} = 0.25 \\times 10^7\\text{ m}^{-1}$."
  },
  {
    subject: "Physics",
    questionText: "NPN transistor CE amplifier has $R_L = 800\\,\\Omega, V_L = 0.8\\text{ V}, \\beta = 0.96, R_{\\text{in}} = 192\\,\\Omega$. Voltage gain and power gain are:",
    optionA: "$4, 4$",
    optionB: "$4, 3.69$",
    optionC: "$4, 3.84$",
    optionD: "$3.69, 3.84$",
    correctOption: "C",
    explanation: "$A_v = \\beta \\frac{R_L}{R_{\\text{in}}} = 0.96 \\times \\frac{800}{192} = 4$. $\\text{Power gain} = A_v \\times \\beta = 4 \\times 0.96 = 3.84$."
  },
  {
    subject: "Physics",
    questionText: "Two liquids of densities $\\rho$ and $n\\rho$ in container have height $h$. Solid cylinder ($L, d$) floats with $pL$ in denser liquid. Density $d$ is:",
    optionA: "$\\{2 + (n-1)p\\}\\rho$",
    optionB: "$\\{1 + (n-1)p\\}\\rho$",
    optionC: "$\\{1 + (n+1)p\\}\\rho$",
    optionD: "$\\{2 + (n+1)p\\}\\rho$",
    correctOption: "B",
    explanation: "$A L d g = A(pL)(n\\rho)g + A(L - pL)\\rho g \\implies d = n p\\rho + (1-p)\\rho = \\{1 + (n-1)p\\}\\rho$."
  },
  {
    subject: "Physics",
    questionText: "If velocity is $v = A t + B t^2$, distance travelled between $t = 1\\text{ s}$ and $t = 2\\text{ s}$ is:",
    optionA: "$\\frac{3}{2} A + \\frac{7}{3} B$",
    optionB: "$\\frac{A}{2} + \\frac{B}{3}$",
    optionC: "$\\frac{3}{2} A + 4B$",
    optionD: "$3A + 7B$",
    correctOption: "A",
    explanation: "$s = \\int_1^2 (A t + B t^2) dt = \\left[ \\frac{A t^2}{2} + \\frac{B t^3}{3} \\right]_1^2 = \\frac{3}{2} A + \\frac{7}{3} B$."
  },
  {
    subject: "Physics",
    questionText: "Astronomical telescope ($f_o = 40\\text{ cm}, f_e = 4\\text{ cm}$). To view object $200\\text{ cm}$ from objective, lens separation is:",
    optionA: "$50.0\\text{ cm}$",
    optionB: "$54.0\\text{ cm}$",
    optionC: "$37.3\\text{ cm}$",
    optionD: "$46.0\\text{ cm}$",
    correctOption: "B",
    explanation: "$v_o = \\frac{u_o f_o}{u_o + f_o} = \\frac{-200 \\times 40}{-200 + 40} = 50\\text{ cm}$. Separation $L = v_o + f_e = 50 + 4 = 54.0\\text{ cm}$."
  },
  {
    subject: "Physics",
    questionText: "Ratio of escape velocity at Earth to planet whose radius and density are twice of Earth is:",
    optionA: "$1 : 4$",
    optionB: "$1 : \\sqrt{2}$",
    optionC: "$1 : 2$",
    optionD: "$1 : 2\\sqrt{2}$",
    correctOption: "D",
    explanation: "$v_e = R\\sqrt{\\frac{8}{3}\\pi G \\rho} \\propto R\\sqrt{\\rho} \\implies \\frac{v_E}{v_P} = \\frac{1}{2\\sqrt{2}} = 1 : 2\\sqrt{2}$."
  },
  {
    subject: "Physics",
    questionText: "Long wire of radius $a$ carries steady $I$. Ratio of $B$ at radial distances $a/2$ and $2a$ is:",
    optionA: "1",
    optionB: "4",
    optionC: "$1/4$",
    optionD: "$1/2$",
    correctOption: "A",
    explanation: "$B(a/2) = \\frac{\\mu_0 I (a/2)}{2\\pi a^2} = \\frac{\\mu_0 I}{4\\pi a}$. $B(2a) = \\frac{\\mu_0 I}{2\\pi(2a)} = \\frac{\\mu_0 I}{4\\pi a} \\implies \\text{Ratio} = 1$."
  },
  {
    subject: "Physics",
    questionText: "A $2\\,\\mu\\text{F}$ capacitor charged to $V$ is switched in parallel with uncharged $8\\,\\mu\\text{F}$ capacitor. Percentage of energy dissipated is:",
    imageUrl: "/neetimages/neet_2016_q25.svg",
    optionA: "$75\\%$",
    optionB: "$80\\%$",
    optionC: "$0\\%$",
    optionD: "$20\\%$",
    correctOption: "B",
    explanation: "$\\text{Fraction lost} = \\frac{C_2}{C_1 + C_2} = \\frac{8}{2+8} = 0.80 = 80\\%$."
  },
  {
    subject: "Physics",
    questionText: "Stopping potential is $V$ at $\\lambda$ and $V/4$ at $2\\lambda$. Threshold wavelength $\\lambda_0$ is:",
    optionA: "$\\frac{5}{2}\\lambda$",
    optionB: "$3\\lambda$",
    optionC: "$4\\lambda$",
    optionD: "$5\\lambda$",
    correctOption: "B",
    explanation: "$e V = \\frac{hc}{\\lambda} - \\frac{hc}{\\lambda_0}$ and $\\frac{eV}{4} = \\frac{hc}{2\\lambda} - \\frac{hc}{\\lambda_0} \\implies \\frac{hc}{\\lambda} - \\frac{hc}{\\lambda_0} = 4\\left(\\frac{hc}{2\\lambda} - \\frac{hc}{\\lambda_0}\\right) \\implies \\frac{3hc}{\\lambda_0} = \\frac{hc}{\\lambda} \\implies \\lambda_0 = 3\\lambda$."
  },
  {
    subject: "Physics",
    questionText: "If magnitude of sum of two vectors equals magnitude of difference ($|\\vec{A}+\\vec{B}| = |\\vec{A}-\\vec{B}|$), angle between vectors is:",
    optionA: "$45^\\circ$",
    optionB: "$180^\\circ$",
    optionC: "$0^\\circ$",
    optionD: "$90^\\circ$",
    correctOption: "D",
    explanation: "$A^2 + B^2 + 2AB\\cos\\theta = A^2 + B^2 - 2AB\\cos\\theta \\implies 4AB\\cos\\theta = 0 \\implies \\theta = 90^\\circ$."
  },
  {
    subject: "Physics",
    questionText: "Body of $1\\text{ kg}$ starts from rest under force $\\vec{F} = (2t\\hat{i} + 3t^2\\hat{j})\\text{ N}$. Power developed at time $t$ is:",
    optionA: "$(2t^3 + 3t^4)\\text{ W}$",
    optionB: "$(2t^3 + 3t^5)\\text{ W}$",
    optionC: "$(2t^2 + 3t^3)\\text{ W}$",
    optionD: "$(2t^2 + 4t^4)\\text{ W}$",
    correctOption: "B",
    explanation: "$\\vec{v} = \\int \\vec{a} dt = t^2\\hat{i} + t^3\\hat{j}$. $P = \\vec{F} \\cdot \\vec{v} = (2t)(t^2) + (3t^2)(t^3) = 2t^3 + 3t^5\\text{ W}$."
  },
  {
    subject: "Physics",
    questionText: "Prism of $A = 60^\\circ$ with incidence angle $i = 45^\\circ$ undergoes minimum deviation. Angle $\\delta_m$ and refractive index $\\mu$ are:",
    optionA: "$45^\\circ; \\sqrt{2}$",
    optionB: "$30^\\circ; 1/\\sqrt{2}$",
    optionC: "$45^\\circ; 1/\\sqrt{2}$",
    optionD: "$30^\\circ; \\sqrt{2}$",
    correctOption: "D",
    explanation: "$\\delta_m = 2i - A = 2(45^\\circ) - 60^\\circ = 30^\\circ$. $\\mu = \\frac{\\sin(45^\\circ)}{\\sin(30^\\circ)} = \\frac{1/\\sqrt{2}}{1/2} = \\sqrt{2}$."
  },
  {
    subject: "Physics",
    questionText: "Position vector is $\\vec{r} = \\cos(\\omega t)\\hat{x} + \\sin(\\omega t)\\hat{y}$. Which statement is TRUE?",
    optionA: "Velocity is perpendicular to $\\vec{r}$ and acceleration is directed towards origin",
    optionB: "Velocity perpendicular to $\\vec{r}$ and acceleration away from origin",
    optionC: "Both perpendicular",
    optionD: "Both parallel",
    correctOption: "A",
    explanation: "$\\vec{v} \\cdot \\vec{r} = 0$ (perpendicular). $\\vec{a} = -\\omega^2 \\vec{r}$ (directed centripetally towards origin)."
  },
  {
    subject: "Physics",
    questionText: "In circuit with ideal diode, $+4\\text{ V}$ at A and $-6\\text{ V}$ at B through $1\\text{ k}\\Omega$. Current is:",
    imageUrl: "/neetimages/neet_2016_q31.svg",
    optionA: "$10^{-1}\\text{ A}$",
    optionB: "$10^{-3}\\text{ A}$",
    optionC: "$0\\text{ A}$",
    optionD: "$10^{-2}\\text{ A}$",
    correctOption: "D",
    explanation: "Diode is forward biased: $I = \\frac{4 - (-6)}{1000} = \\frac{10}{1000} = 10^{-2}\\text{ A}$."
  },
  {
    subject: "Physics",
    questionText: "Two charged spheres leak charge at constant rate and approach each other with speed $v$. $v$ varies with distance $x$ as:",
    optionA: "$v \\propto x^{-1/2}$",
    optionB: "$v \\propto x^{-1}$",
    optionC: "$v \\propto x^{1/2}$",
    optionD: "$v \\propto x$",
    correctOption: "A",
    explanation: "$\\frac{q^2}{x^2} \\propto x \\implies q \\propto x^{3/2} \\implies \\frac{dq}{dt} \\propto x^{1/2} \\frac{dx}{dt} = \\text{const} \\implies v \\propto x^{-1/2}$."
  },
  {
    subject: "Physics",
    questionText: "A small signal voltage $V(t) = V_0 \\sin\\omega t$ is applied across an ideal capacitor $C$:",
    optionA: "Current in phase with voltage",
    optionB: "Current leads voltage by $180^\\circ$",
    optionC: "Current lags voltage by $90^\\circ$",
    optionD: "Over a full cycle the capacitor does not consume any energy from voltage source",
    correctOption: "D",
    explanation: "In purely capacitive circuit, power factor $\\cos\\phi = \\cos(90^\\circ) = 0$, so average power consumed per cycle is zero."
  },
  {
    subject: "Physics",
    questionText: "Magnetic susceptibility $\\chi_m$ is negative for:",
    optionA: "Ferromagnetic material only",
    optionB: "Paramagnetic and ferromagnetic",
    optionC: "Diamagnetic material only ($\\,\\chi_m < 0\\,$)",
    optionD: "Paramagnetic only",
    correctOption: "C",
    explanation: "Diamagnetic materials develop weak magnetization opposing applied field, giving $\\chi_m < 0$."
  },
  {
    subject: "Physics",
    questionText: "Square loop $ABCD$ carrying $i$ is coplanar with long straight wire carrying $I$ at distance $L/2$. Net force on loop is:",
    imageUrl: "/neetimages/neet_2016_q35.svg",
    optionA: "$\\frac{2\\mu_0 I i L}{3\\pi}$",
    optionB: "$\\frac{\\mu_0 I i L}{2\\pi}$",
    optionC: "$\\frac{2\\mu_0 I i}{3\\pi}$",
    optionD: "$\\frac{\\mu_0 I i}{2\\pi}$",
    correctOption: "C",
    explanation: "$F = \\frac{\\mu_0 I i L}{2\\pi(L/2)} - \\frac{\\mu_0 I i L}{2\\pi(3L/2)} = \\frac{\\mu_0 I i}{\\pi} - \\frac{\\mu_0 I i}{3\\pi} = \\frac{2\\mu_0 I i}{3\\pi}$."
  },
  {
    subject: "Physics",
    questionText: "Rope of mass $m_1$, length $L$ has block $m_2$ attached. Pulse wavelength is $\\lambda_1$ at bottom and $\\lambda_2$ at top. Ratio $\\lambda_2 / \\lambda_1$ is:",
    optionA: "$\\sqrt{\\frac{m_2}{m_1}}$",
    optionB: "$\\sqrt{\\frac{m_1 + m_2}{m_1}}$",
    optionC: "$\\sqrt{\\frac{m_1}{m_2}}$",
    optionD: "$\\sqrt{\\frac{m_1 + m_2}{m_2}}$",
    correctOption: "D",
    explanation: "$\\lambda \\propto v \\propto \\sqrt{T} \\implies \\frac{\\lambda_2}{\\lambda_1} = \\sqrt{\\frac{T_{\\text{top}}}{T_{\\text{bottom}}}} = \\sqrt{\\frac{(m_1 + m_2)g}{m_2 g}} = \\sqrt{\\frac{m_1+m_2}{m_2}}$."
  },
  {
    subject: "Physics",
    questionText: "Distance of closest approach $r_0$ of $\\alpha$-particle ($m, v$) bombarding heavy nucleus ($Ze$) depends on $m$ as:",
    optionA: "$1/m^2$",
    optionB: "$m$",
    optionC: "$1/m$",
    optionD: "$1/\\sqrt{m}$",
    correctOption: "C",
    explanation: "$\\frac{1}{2} m v^2 = \\frac{1}{4\\pi\\varepsilon_0} \\frac{(2e)(Ze)}{r_0} \\implies r_0 \\propto \\frac{1}{m}$."
  },
  {
    subject: "Physics",
    questionText: "A disk and sphere of same radius roll down identical inclined planes from rest. Which reaches bottom first?",
    optionA: "Both reach at same time",
    optionB: "Depends on mass",
    optionC: "Disk",
    optionD: "Sphere ($a = \\frac{g\\sin\\theta}{1 + I/MR^2} = \\frac{5}{7}g\\sin\\theta > \\frac{2}{3}g\\sin\\theta$)",
    correctOption: "D",
    explanation: "Sphere has smaller $I/MR^2 = 2/5$ than disk ($1/2$), so its linear acceleration is higher and it reaches first."
  },
  {
    subject: "Physics",
    questionText: "From disc of radius $R$ and mass $M$, circular hole of diameter $R$ touching rim and centre is cut. Moment of inertia of remaining part is:",
    optionA: "$11 M R^2 / 32$",
    optionB: "$9 M R^2 / 32$",
    optionC: "$15 M R^2 / 32$",
    optionD: "$13 M R^2 / 32$",
    correctOption: "D",
    explanation: "$I_{\\text{rem}} = \\frac{1}{2} M R^2 - \\left[ \\frac{1}{2}(M/4)(R/2)^2 + (M/4)(R/2)^2 \\right] = \\frac{M R^2}{2} - \\frac{3 M R^2}{32} = \\frac{13}{32} M R^2$."
  },
  {
    subject: "Physics",
    questionText: "Solenoid has 1000 turns. Current $4\\text{ A}$ produces flux $4 \\times 10^{-3}\\text{ Wb}$ per turn. Self-inductance is:",
    optionA: "$2\\text{ H}$",
    optionB: "$1\\text{ H}$",
    optionC: "$4\\text{ H}$",
    optionD: "$3\\text{ H}$",
    correctOption: "B",
    explanation: "$L = \\frac{N \\Phi}{I} = \\frac{1000 \\times (4 \\times 10^{-3})}{4} = 1\\text{ H}$."
  },
  {
    subject: "Physics",
    questionText: "Minimum velocity with which a body must enter bottom of a vertical loop of radius $R$ to complete the circle is:",
    optionA: "$\\sqrt{3gR}$",
    optionB: "$\\sqrt{5gR}$",
    optionC: "$\\sqrt{gR}$",
    optionD: "$\\sqrt{2gR}$",
    correctOption: "B",
    explanation: "At highest point $v_{\\text{top}} = \\sqrt{gR} \\implies v_{\\text{bottom}} = \\sqrt{gR + 4gR} = \\sqrt{5gR}$."
  },
  {
    subject: "Physics",
    questionText: "RMS velocity of gas is $200\\text{ m/s}$ at $27^\\circ\\text{C}$ and $10^5\\text{ N/m}^2$. At $127^\\circ\\text{C}$ and $0.05 \\times 10^5\\text{ N/m}^2$, RMS velocity is:",
    optionA: "$\\frac{100\\sqrt{2}}{3}$",
    optionB: "$100/3$",
    optionC: "$100\\sqrt{2}$",
    optionD: "$\\frac{400}{\\sqrt{3}}\\text{ m/s}$",
    correctOption: "D",
    explanation: "$v_{\\text{rms}} \\propto \\sqrt{T} \\implies v' = 200\\sqrt{\\frac{400}{300}} = \\frac{400}{\\sqrt{3}}\\text{ m/s}$."
  },
  {
    subject: "Physics",
    questionText: "Charge through resistor $R$ varies as $Q = a t - b t^2$ until current ceases at $t = a/2b$. Total heat produced is:",
    optionA: "$\\frac{a^3 R}{2b}$",
    optionB: "$\\frac{a^3 R}{b}$",
    optionC: "$\\frac{a^3 R}{6b}$",
    optionD: "$\\frac{a^3 R}{3b}$",
    correctOption: "C",
    explanation: "$I = a - 2bt$. $H = \\int_0^{a/2b} (a - 2bt)^2 R dt = R \\left[ a^2 t - 2abt^2 + \\frac{4b^2 t^3}{3} \\right]_0^{a/2b} = \\frac{a^3 R}{6b}$."
  },
  {
    subject: "Physics",
    questionText: "Refrigerator working between $4^\\circ\\text{C} (277\\text{ K})$ and $30^\\circ\\text{C} (303\\text{ K})$ removes $600\\text{ cal/s} = 2520\\text{ W}$. Power required is:",
    optionA: "$236.5\\text{ W}$",
    optionB: "$2365\\text{ W}$",
    optionC: "$2.365\\text{ W}$",
    optionD: "$23.65\\text{ W}$",
    correctOption: "A",
    explanation: "$\\text{COP} = \\frac{T_2}{T_1 - T_2} = \\frac{277}{26} = 10.65$. $P = \\frac{2520\\text{ W}}{10.65} = 236.5\\text{ W}$."
  },
  {
    subject: "Physics",
    questionText: "Disc ($R = 50\\text{ cm} = 0.5\\text{ m}$) accelerates at $\\alpha = 2.0\\text{ rad/s}^2$ from rest. Net acceleration at $t = 2.0\\text{ s}$ is:",
    optionA: "$6.0\\text{ m/s}^2$",
    optionB: "$3.0\\text{ m/s}^2$",
    optionC: "$8.0\\text{ m/s}^2$",
    optionD: "$7.0\\text{ m/s}^2$",
    correctOption: "C",
    explanation: "$a_t = \\alpha R = 2(0.5) = 1.0\\text{ m/s}^2$. $\\omega = 4\\text{ rad/s} \\implies a_c = \\omega^2 R = 16(0.5) = 8.0\\text{ m/s}^2 \\implies a_{\\text{net}} = \\sqrt{1^2 + 8^2} \\approx 8.0\\text{ m/s}^2$."
  },

  // -------------------------------------------------------------
  // CHEMISTRY (Q46 - Q90) - Corresponding to Q136-Q180 in booklet
  // -------------------------------------------------------------
  {
    subject: "Chemistry",
    questionText: "Vapour pressure of ideal $1:1$ molar mixture of benzene ($P_B^\\circ = 12.8\\text{ kPa}$) and toluene ($P_T^\\circ = 3.85\\text{ kPa}$) will contain:",
    optionA: "Equal amounts of benzene and toluene",
    optionB: "Not enough information",
    optionC: "A higher percentage of benzene in vapour phase ($y_B > y_T$)",
    optionD: "Higher percentage of toluene",
    correctOption: "C",
    explanation: "Since benzene has higher vapour pressure, it vaporizes more readily, making vapour richer in benzene ($y_B = \\frac{12.8}{12.8+3.85} = 76.9\\%$)."
  },
  {
    subject: "Chemistry",
    questionText: "Match Xenon Compounds with Shapes:\n(a) $\\text{XeF}_6$, (b) $\\text{XeO}_3$, (c) $\\text{XeOF}_4$, (d) $\\text{XeF}_4$\n(i) Distorted octahedral, (ii) Square planar, (iii) Pyramidal, (iv) Square pyramidal\nChoose correct code:",
    optionA: "(a)-(iv), (b)-(iii), (c)-(i), (d)-(ii)",
    optionB: "(a)-(iv), (b)-(i), (c)-(ii), (d)-(iii)",
    optionC: "(a)-(i), (b)-(iii), (c)-(iv), (d)-(ii)",
    optionD: "(a)-(i), (b)-(ii), (c)-(iv), (d)-(iii)",
    correctOption: "C",
    explanation: "$\\text{XeF}_6$ = Distorted octahedral (i), $\\text{XeO}_3$ = Pyramidal (iii), $\\text{XeOF}_4$ = Square pyramidal (iv), $\\text{XeF}_4$ = Square planar (ii)."
  },
  {
    subject: "Chemistry",
    questionText: "Comparing staggered and eclipsed conformations of ethane, the correct statement is:",
    optionA: "Eclipsed is more stable",
    optionB: "Staggered conformation is more stable because it has minimum torsional strain and steric hindrance",
    optionC: "Staggered is less stable",
    optionD: "Eclipsed has no torsional strain",
    correctOption: "B",
    explanation: "In staggered conformation, C-H electron clouds are maximally separated ($60^\\circ$ dihedral angle), giving minimum torsional repulsion."
  },
  {
    subject: "Chemistry",
    questionText: "Colloidally, Fog is classified as an aerosol dispersion of:",
    optionA: "Solid in gas",
    optionB: "Gas in gas",
    optionC: "Liquid dispersed in gas",
    optionD: "Gas in liquid",
    correctOption: "C",
    explanation: "Fog consists of condensed liquid water droplets suspended in air (liquid in gas aerosol)."
  },
  {
    subject: "Chemistry",
    questionText: "Match Metallurgical Processes:\n(a) Cyanide process, (b) Froth floatation, (c) Electrolytic reduction, (d) Zone refining\n(i) Ultrapure Ge, (ii) Dressing of $\\text{ZnS}$, (iii) Extraction of Al, (iv) Extraction of Au\nChoose correct code:",
    optionA: "(a)-(i), (b)-(ii), (c)-(iii), (d)-(iv)",
    optionB: "(a)-(iii), (b)-(iv), (c)-(v), (d)-(i)",
    optionC: "(a)-(iv), (b)-(ii), (c)-(iii), (d)-(i)",
    optionD: "(a)-(ii), (b)-(iii), (c)-(i), (d)-(v)",
    correctOption: "C",
    explanation: "Cyanide = Gold (iv), Froth floatation = Zinc blende (ii), Electrolytic = Aluminium (iii), Zone refining = Germanium (i)."
  },
  {
    subject: "Chemistry",
    questionText: "Which statement is correct for phosphinic acid ($\\text{H}_3\\text{PO}_2$) and phosphonic acid ($\\text{H}_3\\text{PO}_3$)?",
    optionA: "Phosphinic acid is monoprotic while phosphonic acid is diprotic",
    optionB: "Phosphinic is diprotic, phosphonic monoprotic",
    optionC: "Both diprotic",
    optionD: "Both triprotic",
    correctOption: "A",
    explanation: "$\\text{H}_3\\text{PO}_2$ has one $-\\text{OH}$ (monoprotic); $\\text{H}_3\\text{PO}_3$ has two $-\\text{OH}$ groups (diprotic)."
  },
  {
    subject: "Chemistry",
    questionText: "Thermodynamic conditions for a reaction to be spontaneous at ALL temperatures are:",
    optionA: "$\\Delta H < 0$ and $\\Delta S > 0$ (Exothermic with increasing entropy)",
    optionB: "$\\Delta H < 0$ and $\\Delta S < 0$",
    optionC: "$\\Delta H < 0$ and $\\Delta S = 0$",
    optionD: "$\\Delta H > 0$ and $\\Delta S < 0$",
    correctOption: "A",
    explanation: "$\\Delta G = \\Delta H - T\\Delta S$. When $\\Delta H < 0$ and $\\Delta S > 0$, $\\Delta G$ is negative at every temperature."
  },
  {
    subject: "Chemistry",
    questionText: "When $\\text{SO}_2$ gas is bubbled through acidified $\\text{K}_2\\text{Cr}_2\\text{O}_7$ solution:",
    optionA: "$\\text{SO}_2$ is reduced",
    optionB: "Green $\\text{Cr}_2(\\text{SO}_4)_3$ is formed",
    optionC: "Turns blue",
    optionD: "Decolourized",
    correctOption: "B",
    explanation: "$\\text{SO}_2$ reduces orange $\\text{Cr}_2\\text{O}_7^{2-}$ to green chromium sulphate $\\text{Cr}^{3+}$."
  },
  {
    subject: "Chemistry",
    questionText: "The sugar components present in RNA and DNA nucleotides respectively are:",
    optionA: "Arabinose and Ribose",
    optionB: "2'-Deoxyribose and Arabinose",
    optionC: "Arabinose and 2'-Deoxyribose",
    optionD: "D-Ribose and 2'-Deoxy-D-ribose",
    correctOption: "D",
    explanation: "RNA contains D-ribose and DNA contains 2'-deoxyribose (lacking $2'-\\text{OH}$)."
  },
  {
    subject: "Chemistry",
    questionText: "Which reagent distinguishes cis-cyclopentane-1,2-diol from trans-isomer by forming a cyclic ketal?",
    optionA: "$\\text{MnO}_2$",
    optionB: "Aluminium isopropoxide",
    optionC: "Acetone (in presence of dry $\\text{HCl}$)",
    optionD: "Ozone",
    correctOption: "C",
    explanation: "Cis-diol reacts with acetone to form a 5-membered cyclic isopropylidene ketal; trans-diol cannot due to geometry."
  },
  {
    subject: "Chemistry",
    questionText: "Carbonyl compound with $\\alpha$-hydrogen rapidly equilibrates with its corresponding enol in a process known as:",
    optionA: "Carbonylation",
    optionB: "Keto-enol tautomerism",
    optionC: "Never equilibrates",
    optionD: "Aldehyde-ketone equilibration",
    correctOption: "B",
    explanation: "Proton migration from $\\alpha$-carbon to carbonyl oxygen establishes keto-enol tautomeric equilibrium."
  },
  {
    subject: "Chemistry",
    questionText: "At $100^\\circ\\text{C}$, vapour pressure of solution of $6.5\\text{ g}$ solute in $100\\text{ g}$ water is $732\\text{ mm Hg}$ ($K_b = 0.52$). Boiling point is:",
    optionA: "$102^\\circ\\text{C}$",
    optionB: "$103^\\circ\\text{C}$",
    optionC: "$101^\\circ\\text{C}$",
    optionD: "$100^\\circ\\text{C}$",
    correctOption: "C",
    explanation: "$\\frac{760 - 732}{760} = \\frac{n}{100/18} \\implies n = 0.204\\text{ mol} \\implies m = 2.04\\text{ m}$. $\\Delta T_b = 0.52 \\times 2.04 = 1.06^\\circ\\text{C} \\implies T_b = 101.06^\\circ\\text{C} \\approx 101^\\circ\\text{C}$."
  },
  {
    subject: "Chemistry",
    questionText: "In nitration of benzene with conc $\\text{H}_2\\text{SO}_4 + \\text{HNO}_3$, adding large amount of $\\text{KHSO}_4$ makes rate:",
    optionA: "Unchanged",
    optionB: "Doubled",
    optionC: "Faster",
    optionD: "Slower (Common ion $\\text{HSO}_4^-$ suppresses $^+\\text{NO}_2$ formation)",
    correctOption: "D",
    explanation: "Excess $\\text{HSO}_4^-$ shifts $\\text{HNO}_3 + 2\\text{H}_2\\text{SO}_4 \\rightleftharpoons \\text{NO}_2^+ + \\text{H}_3\\text{O}^+ + 2\\text{HSO}_4^-$ backward, reducing nitronium concentration."
  },
  {
    subject: "Chemistry",
    questionText: "Pressure of $\\text{H}_2$ required to make potential of hydrogen electrode zero in pure water ($[\\text{H}^+] = 10^{-7}\\text{ M}$) at $298\\text{ K}$ is:",
    optionA: "$10^{-10}\\text{ atm}$",
    optionB: "$10^{-4}\\text{ atm}$",
    optionC: "$10^{-14}\\text{ atm}$",
    optionD: "$10^{-12}\\text{ atm}$",
    correctOption: "C",
    explanation: "$E = 0 - \\frac{0.059}{2}\\log\\left(\\frac{P_{\\text{H}_2}}{[\\text{H}^+]^2}\\right) = 0 \\implies P_{\\text{H}_2} = [\\text{H}^+]^2 = (10^{-7})^2 = 10^{-14}\\text{ atm}$."
  },
  {
    subject: "Chemistry",
    questionText: "Basicity of arylamines (aniline) compared to alkylamines is:",
    optionA: "Arylamines more basic",
    optionB: "Arylamines sp-hybridized",
    optionC: "Arylamines are generally less basic because nitrogen lone pair is delocalized into aromatic ring $\\pi$-system",
    optionD: "Not delocalized",
    correctOption: "C",
    explanation: "Resonance delocalizes nitrogen lone pair into benzene ring, diminishing proton-accepting ability."
  },
  {
    subject: "Chemistry",
    questionText: "In a polypeptide protein molecule, individual amino acids are joined together by:",
    optionA: "Peptide amide bonds ($-CO-NH-$)",
    optionB: "Dative bond",
    optionC: "$\\alpha$-glycosidic bond",
    optionD: "$\\beta$-glycosidic bond",
    correctOption: "A",
    explanation: "Amino acids condense via peptide bonds formed between carboxyl and amino groups."
  },
  {
    subject: "Chemistry",
    questionText: "Comparing $\\text{CH}_4 (109.5^\\circ), \\text{NH}_3 (107^\\circ), \\text{H}_2\\text{O} (104.5^\\circ)$, which statement is FALSE?",
    optionA: "$\\text{H-O-H}$ angle is smaller than $\\text{H-N-H}$",
    optionB: "$\\text{H-C-H}$ angle is larger than $\\text{H-N-H}$",
    optionC: "All angles are greater than $90^\\circ$",
    optionD: "$\\text{H-O-H}$ bond angle in $\\text{H}_2\\text{O}$ is larger than $\\text{H-C-H}$ in $\\text{CH}_4$",
    correctOption: "D",
    explanation: "Water angle ($104.5^\\circ$) is smaller than methane ($109.5^\\circ$) due to 2 lone pairs repelling bond pairs."
  },
  {
    subject: "Chemistry",
    questionText: "Which statement about essential biological metal ions is FALSE?",
    optionA: "$\\text{Ca}^{2+}$ ions are not important in maintaining regular heart beat (False, vital for cardiac contraction)",
    optionB: "$\\text{Mg}^{2+}$ ions are central to chlorophyll in plants",
    optionC: "$\\text{Mg}^{2+}$ forms complexes with ATP",
    optionD: "$\\text{Ca}^{2+}$ is essential in blood clotting cascade",
    correctOption: "A",
    explanation: "$\\text{Ca}^{2+}$ ions play a crucial role in maintaining regular heartbeat rhythm and excitation-contraction."
  },
  {
    subject: "Chemistry",
    questionText: "The correct order of bond dissociation enthalpy of halogen molecules is:",
    optionA: "$\\text{Br}_2 > \\text{I}_2 > \\text{F}_2 > \\text{Cl}_2$",
    optionB: "$\\text{F}_2 > \\text{Cl}_2 > \\text{Br}_2 > \\text{I}_2$",
    optionC: "$\\text{I}_2 > \\text{Br}_2 > \\text{Cl}_2 > \\text{F}_2$",
    optionD: "$\\text{Cl}_2 > \\text{Br}_2 > \\text{F}_2 > \\text{I}_2$",
    correctOption: "D",
    explanation: "Strong lone pair-lone pair repulsion in compact $F-F$ weakens its bond: $\\text{Cl}_2 (242.6) > \\text{Br}_2 (192.8) > \\text{F}_2 (158.8) > \\text{I}_2 (151.1\\text{ kJ/mol})$."
  },
  {
    subject: "Chemistry",
    questionText: "First-order reaction rate is $0.04\\text{ M/s}$ at $10\\text{ s}$ and $0.03\\text{ M/s}$ at $20\\text{ s}$. Half-life period is:",
    optionA: "$44.1\\text{ s}$",
    optionB: "$54.1\\text{ s}$",
    optionC: "$24.1\\text{ s}$",
    optionD: "$34.1\\text{ s}$",
    correctOption: "C",
    explanation: "$k = \\frac{2.303}{20-10}\\log\\left(\\frac{0.04}{0.03}\\right) = 0.0287\\text{ s}^{-1} \\implies t_{1/2} = \\frac{0.693}{0.0287} = 24.1\\text{ s}$."
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following carbohydrates is a NON-REDUCING sugar?",
    optionA: "Glucose",
    optionB: "Sucrose (Invert sugar lacking free hemiacetal)",
    optionC: "Maltose",
    optionD: "Lactose",
    correctOption: "B",
    explanation: "In sucrose, both anomeric carbons of glucose and fructose are tied up in $\\alpha-1,\\beta-2$ glycosidic linkage."
  },
  {
    subject: "Chemistry",
    questionText: "Thermodynamic characteristics associated with spontaneous gas ADSORPTION on solid surface are:",
    optionA: "$\\Delta G, \\Delta H < 0, \\Delta S > 0$",
    optionB: "$\\Delta G, \\Delta S < 0, \\Delta H > 0$",
    optionC: "$\\Delta G < 0, \\Delta H, \\Delta S > 0$",
    optionD: "$\\Delta G, \\Delta H$, and $\\Delta S$ are all NEGATIVE",
    correctOption: "D",
    explanation: "Adsorption is exothermic ($\\Delta H < 0$), decreases gas freedom ($\\Delta S < 0$), and is spontaneous ($\\Delta G < 0$)."
  },
  {
    subject: "Chemistry",
    questionText: "Two electrons occupying the same orbital are distinguished by their:",
    optionA: "Azimuthal quantum number",
    optionB: "Spin quantum number ($s = +1/2, -1/2$)",
    optionC: "Principal quantum number",
    optionD: "Magnetic quantum number",
    correctOption: "B",
    explanation: "By Pauli's exclusion principle, two electrons in same orbital share $n, l, m$ and differ only in spin $m_s$."
  },
  {
    subject: "Chemistry",
    questionText: "Lithium is BCC ($Z=2$) with density $530\\text{ kg/m}^3$ and $M = 6.94\\text{ g/mol}$. Unit cell edge length is:",
    optionA: "$527\\text{ pm}$",
    optionB: "$264\\text{ pm}$",
    optionC: "$154\\text{ pm}$",
    optionD: "$352\\text{ pm}$",
    correctOption: "D",
    explanation: "$a^3 = \\frac{2 \\times 6.94}{530 \\times 10^3 \\times 6.022 \\times 10^{23}} = 4.35 \\times 10^{-29}\\text{ m}^3 \\implies a = 3.52 \\times 10^{-10}\\text{ m} = 352\\text{ pm}$."
  },
  {
    subject: "Chemistry",
    questionText: "The electron pair in carbanion $\\text{CH}_3-\\text{C}\\equiv\\text{C}^-$ resides in which hybridized orbital?",
    optionA: "$sp^2$",
    optionB: "$sp$ (50% s-character)",
    optionC: "$2p$",
    optionD: "$sp^3$",
    correctOption: "B",
    explanation: "Terminal carbon with one sigma bond and one lone pair is $sp$ hybridized."
  },
  {
    subject: "Chemistry",
    questionText: "Product obtained by reaction of Calcium Carbide with dinitrogen at $1100^\\circ\\text{C}$ is:",
    optionA: "$\\text{CaCN}_3$",
    optionB: "$\\text{Ca}_2\\text{CN}$",
    optionC: "$\\text{CaCN}_2$ (Nitrolim fertilizer)",
    optionD: "$\\text{CaCN}$",
    correctOption: "C",
    explanation: "$\\text{CaC}_2 + \\text{N}_2 \\to \\text{CaCN}_2 + \\text{C}$ (Nitrolim mixture)."
  },
  {
    subject: "Chemistry",
    questionText: "Acetylene $\\text{HC}\\equiv\\text{CH} \\xrightarrow{\\text{NaNH}_2/\\text{EtBr}} X \\xrightarrow{\\text{NaNH}_2/\\text{EtBr}} Y$. Products X and Y are:",
    optionA: "$X = \\text{2-Butyne}, Y = \\text{2-Hexyne}$",
    optionB: "$X = \\text{1-Butyne}, Y = \\text{2-Hexyne}$",
    optionC: "$X = \\text{1-Butyne}, Y = \\text{3-Hexyne}$",
    optionD: "$X = \\text{2-Butyne}, Y = \\text{3-Hexyne}$",
    correctOption: "C",
    explanation: "Step 1 yields ethylacetylene (1-butyne); Step 2 alkylates other terminal hydrogen to give 3-hexyne (diethylacetylene)."
  },
  {
    subject: "Chemistry",
    questionText: "Insoluble salts $MY$ and $NY_3$ have same $K_{sp} = 6.2 \\times 10^{-13}$. Which statement is true regarding molar solubilities?",
    optionA: "More soluble in $0.5\\text{ M } KY$",
    optionB: "Adding $KY$ has no effect",
    optionC: "Molar solubilities are identical",
    optionD: "Molar solubility of $MY$ is less than $NY_3$",
    correctOption: "D",
    explanation: "For $MY$: $s_1 = \\sqrt{K_{sp}} = 7.87 \\times 10^{-7}\\text{ M}$. For $NY_3$: $27 s_2^4 = K_{sp} \\implies s_2 = 3.89 \\times 10^{-4}\\text{ M}$. Thus $s(MY) < s(NY_3)$."
  },
  {
    subject: "Chemistry",
    questionText: "When copper is heated with concentrated $\\text{HNO}_3$, products include:",
    optionA: "$\\text{Cu(NO}_3)_2, \\text{NO}, \\text{NO}_2$",
    optionB: "$\\text{Cu(NO}_3)_2, \\text{N}_2\\text{O}$",
    optionC: "$\\text{Cu(NO}_3)_2$ and $\\text{NO}_2$ (Brown fumes)",
    optionD: "$\\text{Cu(NO}_3)_2, \\text{NO}$",
    correctOption: "C",
    explanation: "$\\text{Cu} + 4\\text{HNO}_3(\\text{conc}) \\to \\text{Cu(NO}_3)_2 + 2\\text{NO}_2 + 2\\text{H}_2\\text{O}$."
  },
  {
    subject: "Chemistry",
    questionText: "Reaction of an aldehyde with a primary amine ($\\text{R-CHO} + \\text{R}'-\\text{NH}_2$) yields an azomethine known as:",
    optionA: "Carboxylic acid",
    optionB: "Aromatic acid",
    optionC: "Schiff's base (Imine $\\text{R-CH=N-R}'$)",
    optionD: "Ketone",
    correctOption: "C",
    explanation: "Condensation of primary amine with carbonyl yields an azomethine / Schiff base."
  },
  {
    subject: "Chemistry",
    questionText: "Addition of a catalyst in a chemical reaction exclusively alters:",
    optionA: "Enthalpy",
    optionB: "Activation energy ($E_a$)",
    optionC: "Entropy",
    optionD: "Internal energy",
    correctOption: "B",
    explanation: "Catalyst provides alternate pathway with lower activation energy without altering thermodynamic parameters $\\Delta H, \\Delta S, \\Delta G$."
  },
  {
    subject: "Chemistry",
    questionText: "According to VSEPR theory, correct order of repulsive interactions is:",
    optionA: "$\\,\\text{bp-bp} > \\text{lp-bp} > \\text{lp-lp}\\,$",
    optionB: "$\\,\\text{lp-bp} > \\text{bp-bp} > \\text{lp-lp}\\,$",
    optionC: "Lone pair-lone pair > lone pair-bond pair > bond pair-bond pair",
    optionD: "$\\,\\text{lp-lp} > \\text{bp-bp} > \\text{lp-bp}\\,$",
    correctOption: "C",
    explanation: "Lone pairs occupy more spatial domain around central nucleus: $\\text{lp-lp} > \\text{lp-bp} > \\text{bp-bp}$."
  },
  {
    subject: "Chemistry",
    questionText: "For liquid-vapour equilibrium, the differential Clausius-Clapeyron equation is:",
    optionA: "$\\frac{d\\ln P}{d T^2} = -\\frac{\\Delta H_v}{T^2}$",
    optionB: "$\\frac{d\\ln P}{dT} = \\frac{\\Delta H_v}{R T^2}$",
    optionC: "$\\frac{d\\ln G}{dT^2} = \\frac{\\Delta H_v}{R T^2}$",
    optionD: "$\\frac{d\\ln P}{dT} = -\\frac{\\Delta H_v}{RT}$",
    correctOption: "B",
    explanation: "Standard Clausius-Clapeyron relation: $\\frac{d\\ln P}{dT} = \\frac{\\Delta H_{\\text{vap}}}{R T^2}$."
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following substituted biphenyls exhibits atropisomerism and is OPTICALLY ACTIVE?",
    optionA: "2,2'-Diiodobiphenyl",
    optionB: "2,2'-Dimethylbiphenyl",
    optionC: "2-Nitro-2'-iodobiphenyl",
    optionD: "2,2'-Dibromo-6,6'-diiodobiphenyl (Tetrasubstituted with bulky groups in perpendicular non-planar conformation)",
    correctOption: "D",
    explanation: "Bulky ortho substituents prevent C-C rotation, locking rings perpendicular without plane or centre of symmetry."
  },
  {
    subject: "Chemistry",
    questionText: "Which statement regarding Hydrogen is INCORRECT?",
    optionA: "Hydronium ion $\\text{H}_3\\text{O}^+$ exists freely in solution",
    optionB: "Dihydrogen does not act as reducing agent",
    optionC: "Tritium is most common isotope of hydrogen (Protium $^1\\text{H}$ is $99.98\\%$ abundant)",
    optionD: "Hydrogen never acts as cation in ionic salts",
    correctOption: "B",
    explanation: "Statement 2 is incorrect (dihydrogen readily acts as reducing agent) and statement 3 is also incorrect (Protium is most common); key 2 accepted."
  },
  {
    subject: "Chemistry",
    questionText: "Electronic configurations of $\\text{Eu} (63), \\text{Gd} (64)$, and $\\text{Tb} (65)$ are:",
    optionA: "$[\\text{Xe}] 4f^6 5d^1 6s^2, [\\text{Xe}] 4f^7 5d^1 6s^2, [\\text{Xe}] 4f^8 5d^1 6s^2$",
    optionB: "$[\\text{Xe}] 4f^7 6s^2, [\\text{Xe}] 4f^7 5d^1 6s^2, [\\text{Xe}] 4f^9 6s^2$",
    optionC: "$[\\text{Xe}] 4f^7 6s^2, [\\text{Xe}] 4f^8 6s^2, [\\text{Xe}] 4f^8 5d^1 6s^2$",
    optionD: "$[\\text{Xe}] 4f^6 5d^1 6s^2, [\\text{Xe}] 4f^7 5d^1 6s^2, [\\text{Xe}] 4f^9 6s^2$",
    correctOption: "B",
    explanation: "Eu ($4f^7 6s^2$, half filled), Gd ($4f^7 5d^1 6s^2$), Tb ($4f^9 6s^2$)."
  },
  {
    subject: "Chemistry",
    questionText: "Reaction: $\\text{Cyclopentanol} \\xrightarrow{\\text{NaH}} \\text{Alkoxide} \\xrightarrow{\\text{CH}_3\\text{I}} \\text{Cyclopentyl methyl ether}$ is classified as:",
    optionA: "Dehydration",
    optionB: "Williamson alcohol synthesis",
    optionC: "Williamson ether synthesis",
    optionD: "Alcohol formation",
    correctOption: "C",
    explanation: "Nucleophilic displacement of iodide by sodium alkoxide is Williamson ether synthesis."
  },
  {
    subject: "Chemistry",
    questionText: "Identify reaction types:\n(a) $\\text{PrBr} + \\text{KOH} \\to \\text{Propene} + \\text{KBr} + \\text{H}_2\\text{O}$\n(b) $\\text{t-BuBr} + \\text{KOH} \\to \\text{t-BuOH} + \\text{KBr}$\n(c) $\\text{Cyclohexene} + \\text{Br}_2 \\to \\text{1,2-Dibromocyclohexane}$\nChoose correct option:",
    optionA: "(a) is elimination, (b) and (c) substitution",
    optionB: "(a) substitution, (b) and (c) addition",
    optionC: "(a) and (b) elimination, (c) addition",
    optionD: "(a) is elimination, (b) is substitution, and (c) is addition reaction",
    correctOption: "D",
    explanation: "(a) is dehydrohalogenation elimination, (b) is nucleophilic substitution, (c) is electrophilic addition."
  },
  {
    subject: "Chemistry",
    questionText: "In which option does the order NOT agree with property indicated?",
    optionA: "$I < Br < Cl < F$ (Increasing electron gain enthalpy: $\\text{Cl} > \\text{F}$)",
    optionB: "$Li < Na < K < Rb$ (Metallic radius)",
    optionC: "$Al^{3+} < Mg^{2+} < Na^+ < F^-$ (Ionic radius)",
    optionD: "$B < C < N < O$ (Ionisation enthalpy: $N > O$)",
    correctOption: "A",
    explanation: "Chlorine has higher electron gain enthalpy than fluorine due to interelectronic repulsion in compact $2p$ shell of F (also $N > O$ in option D; official key 1 accepted)."
  },
  {
    subject: "Chemistry",
    questionText: "Equal moles of $\\text{H}_2$ and $\\text{O}_2$ effuse through pin-hole. Fraction of $\\text{O}_2$ escaping when half of $\\text{H}_2$ escapes is:",
    optionA: "$3/8$",
    optionB: "$1/2$",
    optionC: "$1/8$",
    optionD: "$1/4$",
    correctOption: "C",
    explanation: "$\\frac{n_{\\text{O}_2}}{n_{\\text{H}_2}} = \\sqrt{\\frac{M_{\\text{H}_2}}{M_{\\text{O}_2}}} = \\sqrt{\\frac{2}{32}} = \\frac{1}{4} \\implies n_{\\text{O}_2} = \\frac{1}{4}(1/2) = 1/8$."
  },
  {
    subject: "Chemistry",
    questionText: "The correct increasing order of acidic strength of oxoacids of chlorine is:",
    optionA: "$\\text{HClO}_2 < \\text{HClO} < \\text{HClO}_3 < \\text{HClO}_4$",
    optionB: "$\\text{HClO}_4 < \\text{HClO}_2 < \\text{HClO} < \\text{HClO}_3$",
    optionC: "$\\text{HClO}_3 < \\text{HClO}_4 < \\text{HClO}_2 < \\text{HClO}$",
    optionD: "$\\text{HClO} < \\text{HClO}_2 < \\text{HClO}_3 < \\text{HClO}_4$ ($+1 < +3 < +5 < +7$)",
    correctOption: "D",
    explanation: "Acidity increases with oxidation state of chlorine: $\\text{HClO} < \\text{HClO}_2 < \\text{HClO}_3 < \\text{HClO}_4$."
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following pharmaceutical compounds is an Analgesic (pain reliever)?",
    optionA: "Streptomycin",
    optionB: "Chloromycetin",
    optionC: "Novalgin (Analgin / Dipyrone)",
    optionD: "Penicillin",
    correctOption: "C",
    explanation: "Novalgin is a non-narcotic antipyretic-analgesic drug."
  },
  {
    subject: "Chemistry",
    questionText: "Natural rubber (polyisoprene) possesses:",
    optionA: "Alternate cis and trans",
    optionB: "Random cis and trans",
    optionC: "All cis-1,4-polyisoprene configuration",
    optionD: "All trans configuration (Gutta-percha)",
    correctOption: "C",
    explanation: "Natural rubber is cis-1,4-polyisoprene; gutta-percha is trans-1,4-polyisoprene."
  },
  {
    subject: "Chemistry",
    questionText: "Ionic radii of $A^+$ and $B^-$ are $0.98 \\times 10^{-10}\\text{ m}$ and $1.81 \\times 10^{-10}\\text{ m}$. Coordination number of each ion in $AB$ is:",
    optionA: "8",
    optionB: "2",
    optionC: "6 (NaCl type octahedral geometry)",
    optionD: "4",
    correctOption: "C",
    explanation: "Radius ratio $r^+/r^- = \\frac{0.98}{1.81} = 0.541$. Since $0.414 < 0.541 < 0.732$, coordination number is 6."
  },
  {
    subject: "Chemistry",
    questionText: "Which metal carbonyl complex has the LONGEST $C-O$ bond length due to maximum $\\pi$-backbonding?",
    optionA: "$[\\text{Fe(CO)}_4]^{2-}$ (Highest negative charge on metal)",
    optionB: "$[\\text{Mn(CO)}_6]^+$",
    optionC: "$\\text{Ni(CO)}_4$",
    optionD: "$[\\text{Co(CO)}_4]^-$",
    correctOption: "A",
    explanation: "Higher negative charge on central metal ($[\\text{Fe(CO)}_4]^{2-}$) promotes maximum $d\\pi-p\\pi^*$ back-donation, weakening and lengthening $C-O$ bond."
  },

  // -------------------------------------------------------------
  // BIOLOGY (Q91 - Q180) - Corresponding to Q46-Q135 in booklet
  // -------------------------------------------------------------
  {
    subject: "Biology",
    questionText: "Which organisms appear as pioneer species on bare rock surfaces during xerarch succession?",
    optionA: "Mosses",
    optionB: "Green algae",
    optionC: "Lichens (Crustose lichens)",
    optionD: "Liverworts",
    correctOption: "C",
    explanation: "Lichens secrete carbonic and organic acids that weather rock minerals into primitive soil."
  },
  {
    subject: "Biology",
    questionText: "Water vapour exits while $\\text{CO}_2$ enters through same stomatal pore because:",
    optionA: "Occurs only at night",
    optionB: "One by day, other night",
    optionC: "Cannot happen simultaneously",
    optionD: "Diffusion coefficients and concentration gradients of water vapour and $\\text{CO}_2$ are independent",
    correctOption: "D",
    explanation: "Diffusion of each gas depends independently on its own partial pressure gradient and diffusion coefficient."
  },
  {
    subject: "Biology",
    questionText: "Sustained involuntary muscle contraction without relaxation between successive stimuli is:",
    optionA: "Tetanus",
    optionB: "Tonus",
    optionC: "Spasm",
    optionD: "Fatigue",
    correctOption: "A",
    explanation: "High frequency summation of action potentials maintains elevated sarcoplasmic $\\text{Ca}^{2+}$, causing sustained tetanus."
  },
  {
    subject: "Biology",
    questionText: "Depletion of which stratospheric gas leads to increased incidence of melanoma skin cancers and cataracts?",
    optionA: "Ammonia",
    optionB: "Methane",
    optionC: "Nitrous oxide",
    optionD: "Ozone ($\\text{O}_3$ layer)",
    correctOption: "D",
    explanation: "Ozone absorbs harmful UV-B radiation; ozone depletion increases UV-B penetration causing DNA damage."
  },
  {
    subject: "Biology",
    questionText: "Which rule is CONTRARY / INVALID regarding binomial biological nomenclature?",
    optionA: "Names are Latinized and italicized",
    optionB: "Handwritten names are underlined separately",
    optionC: "Biological names can be written in any language (Must be Latin or Latinized)",
    optionD: "First word is Genus and second is specific epithet",
    correctOption: "C",
    explanation: "Scientific names must be in Latin or derived from Latin irrespective of origin."
  },
  {
    subject: "Biology",
    questionText: "If a plant cell completes mitosis without cell plate cytokinesis, it contains more chromosome sets, resulting in:",
    optionA: "Somaclonal variation",
    optionB: "Polyteny",
    optionC: "Aneuploidy",
    optionD: "Polyploidy ($3n, 4n$)",
    correctOption: "D",
    explanation: "Failure of cytokinesis following telophase replication leads to increase in entire genome sets (polyploidy)."
  },
  {
    subject: "Biology",
    questionText: "The two polypeptide chains (A and B) of active mature human insulin are linked together by:",
    optionA: "Covalent bonds",
    optionB: "Disulphide bridges (Two interchain and one intrachain $-S-S-$ bonds)",
    optionC: "Hydrogen bonds",
    optionD: "Phosphodiester bonds",
    correctOption: "B",
    explanation: "Disulphide bonds link cysteine residues between chains A and B of insulin."
  },
  {
    subject: "Biology",
    questionText: "A drop in blood pH (acidosis / Bohr effect) will cause:",
    optionA: "Decrease the affinity of hemoglobin with oxygen (Right shift of $\\text{Hb-O}_2$ curve)",
    optionB: "Release bicarbonate from liver",
    optionC: "Reduce heart rate",
    optionD: "Reduce brain perfusion",
    correctOption: "A",
    explanation: "Higher $[\\text{H}^+]$ promotes release of $\\text{O}_2$ from oxyhemoglobin (Bohr effect)."
  },
  {
    subject: "Biology",
    questionText: "In a chloroplast undergoing photosynthetic light reactions, highest proton concentration ($[\\text{H}^+]$) accumulates in:",
    optionA: "Intermembrane space",
    optionB: "Antennae complex",
    optionC: "Stroma",
    optionD: "Lumen of thylakoids (pH drops to ~4-5)",
    correctOption: "D",
    explanation: "Photolysis of water and proton pumping by cytochrome $b_6f$ build up high $[\\text{H}^+]$ in thylakoid lumen."
  },
  {
    subject: "Biology",
    questionText: "Which tissue is correctly matched with its anatomical location?",
    optionA: "Transitional epithelium - Tip of nose",
    optionB: "Cuboidal epithelium - Lining of stomach",
    optionC: "Smooth muscle - Wall of intestine (Involuntary visceral musculature)",
    optionD: "Areolar tissue - Tendons",
    correctOption: "C",
    explanation: "Visceral organs like stomach and intestinal walls possess involuntary non-striated smooth muscle."
  },
  {
    subject: "Biology",
    questionText: "Which of the following hormone pairs are NOT antagonistic in their physiological actions?",
    optionA: "Aldosterone - Atrial Natriuretic Factor",
    optionB: "Relaxin - Inhibin",
    optionC: "Parathormone - Calcitonin",
    optionD: "Insulin - Glucagon",
    correctOption: "B",
    explanation: "Relaxin dilates cervix and pelvic ligaments; inhibin suppresses FSH secretion (not an antagonistic pair)."
  },
  {
    subject: "Biology",
    questionText: "In mammals, which blood vessel normally carries the LARGEST concentration of urea?",
    optionA: "Hepatic Vein (carries blood away from liver where urea cycle occurs)",
    optionB: "Hepatic Portal Vein",
    optionC: "Renal Vein",
    optionD: "Dorsal Aorta",
    correctOption: "A",
    explanation: "Urea is synthesized in liver hepatocytes via ornithine cycle and exits via hepatic vein."
  },
  {
    subject: "Biology",
    questionText: "Select correct genetic statements:\n(a) Haemophilia is sex-linked recessive\n(b) Down's syndrome is due to aneuploidy\n(c) Phenylketonuria is autosomal recessive\n(d) Sickle cell is X-linked recessive (Autosomal recessive)\nChoose correct option:",
    optionA: "(a), (c) and (d)",
    optionB: "(a), (b) and (c) are correct",
    optionC: "(a) and (d)",
    optionD: "(b) and (d)",
    correctOption: "B",
    explanation: "Sickle cell anemia is an autosomal recessive mutation on chromosome 11, making (d) incorrect."
  },
  {
    subject: "Biology",
    questionText: "Which contraceptive method is INCORRECTLY described in its physiological action?",
    optionA: "Hormonal contraceptives - Prevent ovulation and fertilization",
    optionB: "Vasectomy - Prevents spermatogenesis (Spermatogenesis continues; blocks sperm transport in vas deferens)",
    optionC: "Barrier methods - Prevent fertilization",
    optionD: "IUDs - Phagocytosis and sperm motility suppression",
    correctOption: "B",
    explanation: "Vasectomy blocks sperm transport through severed vas deferens; spermatogenesis in testes continues normally."
  },
  {
    subject: "Biology",
    questionText: "Which anatomical/physiological characteristic is NOT shared by both birds (Aves) and mammals?",
    optionA: "Viviparity (Birds are strictly oviparous)",
    optionB: "Warm blooded nature (Homeothermy)",
    optionC: "Ossified bony endoskeleton",
    optionD: "Pulmonary lung respiration",
    correctOption: "A",
    explanation: "Birds lay hard calcareous shelled eggs (oviparous); mammals (except monotremes) give live birth (viviparous)."
  },
  {
    subject: "Biology",
    questionText: "Emerson's Enhancement Effect and Red Drop phenomenon provided evidence for:",
    optionA: "Cyclic electron transport",
    optionB: "Oxidative phosphorylation",
    optionC: "Non-cyclic electron transport",
    optionD: "Two distinct photosystems (PS-I and PS-II) operating simultaneously in series",
    correctOption: "D",
    explanation: "Simultaneous irradiation with short and long wavelengths increased photosynthetic yield beyond the sum of individual yields."
  },
  {
    subject: "Biology",
    questionText: "In which option are all three elements plant MACRONUTRIENTS ($>10\\text{ mmol/kg dry weight}$)?",
    optionA: "Molybdenum, magnesium, manganese",
    optionB: "Nitrogen, nickel, phosphorus",
    optionC: "Boron, zinc, manganese",
    optionD: "Potassium, Magnesium, Calcium",
    correctOption: "Bonus",
    explanation: "Macronutrients are C, H, O, N, P, K, Ca, Mg, S (Official key awarded Bonus / Option 2)."
  },
  {
    subject: "Biology",
    questionText: "In human females, changes in GnRH pulsatile release frequency from hypothalamus are modulated by:",
    optionA: "Progesterone only",
    optionB: "Progesterone and inhibin",
    optionC: "Estrogen and Progesterone feedback",
    optionD: "Estrogen and inhibin",
    correctOption: "C",
    explanation: "Circulating ovarian steroid hormones (estrogen and progesterone) exert negative and positive feedback on hypothalamic GnRH."
  },
  {
    subject: "Biology",
    questionText: "The fresh liquid water in a tender green coconut represents:",
    optionA: "Free nuclear proembryo",
    optionB: "Free nuclear endosperm (Multinucleate fluid)",
    optionC: "Endocarp",
    optionD: "Fleshy mesocarp",
    correctOption: "B",
    explanation: "Coconut water consists of thousands of free nuclei in liquid endosperm."
  },
  {
    subject: "Biology",
    questionText: "Which anatomical sphincter guards the opening of the common hepatopancreatic duct into duodenum?",
    optionA: "Pyloric sphincter",
    optionB: "Sphincter of Oddi",
    optionC: "Semilunar valve",
    optionD: "Ileocaecal valve",
    correctOption: "B",
    explanation: "Sphincter of Oddi regulates entry of bile and pancreatic secretions into descending duodenum."
  },
  {
    subject: "Biology",
    questionText: "Which codon functions as the universal translation START / INITIATOR codon for methionine?",
    optionA: "UAA (Stop)",
    optionB: "UAG (Stop)",
    optionC: "AUG (Codes for Formyl-Methionine / Methionine)",
    optionD: "UGA (Stop)",
    correctOption: "C",
    explanation: "AUG codon on mRNA specifies Methionine and serves as translation start signal."
  },
  {
    subject: "Biology",
    questionText: "During prometaphase and metaphase, spindle microtubule fibres attach to chromosomes at:",
    optionA: "Centromere",
    optionB: "Kinetosome",
    optionC: "Telomere",
    optionD: "Kinetochore disc-shaped protein complexes",
    correctOption: "D",
    explanation: "Trilaminar kinetochore protein assemblies at centromere bind spindle microtubules."
  },
  {
    subject: "Biology",
    questionText: "When $F_1$ tall pea plants ($Tt$) from $TT \\times tt$ cross are selfed, the resulting GENOTYPIC ratio in $F_2$ is:",
    optionA: "$3 : 1$ :: Tall : Dwarf",
    optionB: "$3 : 1$ :: Dwarf : Tall",
    optionC: "$1 : 2 : 1$ :: Tall homozygous ($TT$) : Tall heterozygous ($Tt$) : Dwarf ($tt$)",
    optionD: "$1 : 2 : 1$ :: Heterozygous : Homozygous : Dwarf",
    correctOption: "C",
    explanation: "Monohybrid $F_2$ genotypic ratio is $1\\,TT : 2\\,Tt : 1\\,tt$ ($1:2:1$)."
  },
  {
    subject: "Biology",
    questionText: "A typical neutral triglyceride fat molecule is chemically composed of:",
    optionA: "One glycerol and one fatty acid",
    optionB: "Three glycerol and three fatty acids",
    optionC: "Three glycerol and one fatty acid",
    optionD: "One glycerol and three fatty acid molecules (Esterified)",
    correctOption: "D",
    explanation: "Triesters of glycerol with 3 fatty acid chains form neutral fats (triglycerides)."
  },
  {
    subject: "Biology",
    questionText: "System of rotating arable crops with legume or grass pastures to restore soil nitrogen and humus is:",
    optionA: "Strip farming",
    optionB: "Shifting agriculture",
    optionC: "Ley farming",
    optionD: "Contour farming",
    correctOption: "C",
    explanation: "Ley farming alternates agricultural cereal crops with temporary grass/legume pasture."
  },
  {
    subject: "Biology",
    questionText: "Which of the following is NOT a modified stem structure?",
    optionA: "Tendrils of cucumber",
    optionB: "Flattened cladodes of Opuntia",
    optionC: "Pitcher of Nepenthes (Modified leaf lamina)",
    optionD: "Thorns of citrus",
    correctOption: "C",
    explanation: "Pitcher in carnivorous Nepenthes is a modified leaf blade/lamina."
  },
  {
    subject: "Biology",
    questionText: "Which embryological/anatomical feature is NOT present in cockroach (Periplaneta americana)?",
    optionA: "Chitinous exoskeleton of N-acetylglucosamine",
    optionB: "Metamerically segmented body",
    optionC: "Schizocoelom body cavity",
    optionD: "Indeterminate and radial cleavage (Arthropods show determinate spiral cleavage)",
    correctOption: "D",
    explanation: "Protostomes (Arthropoda) undergo spiral, determinate embryonic cleavage."
  },
  {
    subject: "Biology",
    questionText: "Chronic respiratory alveolar destruction primarily caused by cigarette smoking is:",
    optionA: "Respiratory acidosis",
    optionB: "Respiratory alkalosis",
    optionC: "Emphysema",
    optionD: "Asthma",
    correctOption: "C",
    explanation: "Cigarette smoke damages alveolar walls and reduces respiratory exchange area (emphysema)."
  },
  {
    subject: "Biology",
    questionText: "Which statement regarding pollen biology is NOT true?",
    optionA: "Pollen causes asthma/bronchitis allergies in many individuals",
    optionB: "Pollen stored in liquid nitrogen ($–196^\\circ\\text{C}$) is used in breeding banks",
    optionC: "Tapetum helps in dehiscence of anther (Endothecium helps in dehiscence; tapetum provides nutrition)",
    optionD: "Exine contains sporopollenin",
    correctOption: "C",
    explanation: "Anther dehiscence is facilitated by hygroscopic fibrous endothecium, while tapetum nourishes microspores."
  },
  {
    subject: "Biology",
    questionText: "Which molecule acts as the physiological inducer binding repressor to derepress Lac Operon?",
    optionA: "Lactose (and allolactose)",
    optionB: "Lactose and galactose",
    optionC: "Glucose",
    optionD: "Galactose",
    correctOption: "A",
    explanation: "Allolactose isomer binds the lac repressor, preventing it from binding the operator."
  },
  {
    subject: "Biology",
    questionText: "Regarding Mitochondria and Chloroplasts:\n(a) Semi-autonomous organelles\n(b) Contain DNA and 70S ribosomes synthesizing their own proteins\nSelect correct evaluation:",
    optionA: "(a) is true but (b) is false",
    optionB: "Both false",
    optionC: "Both (a) and (b) are correct",
    optionD: "(b) is true but (a) is false",
    correctOption: "A",
    explanation: "Mitochondria/chloroplasts contain DNA and protein synthesizing machinery; statement (b) claimed they lack machinery, making (b) false."
  },
  {
    subject: "Biology",
    questionText: "Smaller animals (shrews, hummingbirds) run uphill more easily than large animals because:",
    optionA: "Lower oxygen requirement",
    optionB: "Muscle efficiency differences",
    optionC: "Small weight",
    optionD: "Smaller animals have higher basal metabolic rate per unit body weight ($BMR/g$)",
    correctOption: "D",
    explanation: "High surface-to-volume ratio dictates elevated mass-specific metabolic rate in small mammals."
  },
  {
    subject: "Biology",
    questionText: "Production of viable seeds without fertilization (asexual seed development) in Asteraceae/grasses is:",
    optionA: "Somatic hybridization",
    optionB: "Apomixis",
    optionC: "Sporulation",
    optionD: "Budding",
    correctOption: "B",
    explanation: "Apomixis is a form of asexual reproduction that mimics sexual reproduction by forming seeds without fertilization."
  },
  {
    subject: "Biology",
    questionText: "The Avena coleoptile curvature test was designed by F.W. Went for quantitative bioassay of:",
    optionA: "IAA (Indole-3-acetic acid / Auxin)",
    optionB: "Ethylene",
    optionC: "ABA",
    optionD: "$\\text{GA}_3$",
    correctOption: "A",
    explanation: "Avena curvature bioassay quantifies auxin (IAA) concentration based on coleoptile phototropic-like bending."
  },
  {
    subject: "Biology",
    questionText: "A plant avoiding photorespiration with high water use efficiency and high photosynthetic rate at high temperatures belongs to:",
    optionA: "CAM",
    optionB: "Nitrogen fixer",
    optionC: "$\\text{C}_3$",
    optionD: "$\\text{C}_4$ plants (Kranz anatomy / Hatch-Slack pathway)",
    correctOption: "D",
    explanation: "$\\text{C}_4$ plants (maize, sugarcane) avoid photorespiratory $\\text{CO}_2$ loss and maintain superior nitrogen/water efficiency."
  },
  {
    subject: "Biology",
    questionText: "Which organism is declared as the National Aquatic Animal of India?",
    optionA: "Blue whale",
    optionB: "Sea-horse",
    optionC: "Gangetic shark",
    optionD: "Ganges River Dolphin (Platanista gangetica)",
    correctOption: "D",
    explanation: "The Gangetic river dolphin was declared India's National Aquatic Animal in 2009."
  },
  {
    subject: "Biology",
    questionText: "Which of the following is NOT a general structural feature of bacterial plasmids?",
    optionA: "Transferable via conjugation",
    optionB: "Single-stranded (Plasmids are double-stranded circular DNA molecules)",
    optionC: "Autonomous replication",
    optionD: "Circular supercoiled DNA",
    correctOption: "B",
    explanation: "Plasmids are double-stranded, covalently closed circular extrachromosomal DNA molecules."
  },
  {
    subject: "Biology",
    questionText: "The essential aromatic amino acid Tryptophan is the biosynthetic precursor for:",
    optionA: "Estrogen and progesterone",
    optionB: "Cortisol and cortisone",
    optionC: "Melatonin and Serotonin",
    optionD: "Thyroxine and T3",
    correctOption: "C",
    explanation: "Tryptophan is hydroxylated and decarboxylated to form neurotransmitter serotonin and pineal hormone melatonin."
  },
  {
    subject: "Biology",
    questionText: "The Joint Forest Management (JFM) concept of community participatory forest protection was introduced in India in:",
    optionA: "1980s",
    optionB: "1990s",
    optionC: "1960s",
    optionD: "1970s",
    correctOption: "A",
    explanation: "Government of India introduced the JFM program in 1980 to work collaboratively with local rural communities."
  },
  {
    subject: "Biology",
    questionText: "Water-soluble flavonoid pigments found dissolved in plant cell sap vacuoles are:",
    optionA: "Carotenoids",
    optionB: "Anthocyanins (Red, purple, and blue pigments in sap)",
    optionC: "Xanthophylls",
    optionD: "Chlorophylls",
    correctOption: "B",
    explanation: "Anthocyanins are water-soluble vacuolar pigments; chlorophylls and carotenoids are lipid-soluble in plastids."
  },
  {
    subject: "Biology",
    questionText: "Which of the following is a key characteristic ecological feature of a man-made Cropland Ecosystem?",
    optionA: "Absence of weeds",
    optionB: "Ecological succession",
    optionC: "Absence of soil organisms",
    optionD: "Least genetic diversity (Monoculture vulnerable to pests)",
    correctOption: "D",
    explanation: "Agroecosystems are managed monocultures characterized by minimal species and genetic diversity."
  },
  {
    subject: "Biology",
    questionText: "Which characteristic feature ALWAYS holds true without any exceptions for its animal group?",
    optionA: "Mouth with jaws - Chordata (Agnatha lack jaws)",
    optionB: "3-chambered heart - Reptilia (Crocodiles have 4 chambers)",
    optionC: "Cartilaginous endoskeleton - Chondrichthyes (Sharks, rays have persistent cartilaginous skeleton)",
    optionD: "Viviparous - Mammalia (Platypus is oviparous)",
    correctOption: "C",
    explanation: "All Chondrichthyes fishes possess completely cartilaginous endoskeletons without bony ossification."
  },
  {
    subject: "Biology",
    questionText: "Primitive anaerobic methanogenic archaebacteria responsible for biogas production from ruminant dung are:",
    optionA: "Methanogens (Methanobacterium)",
    optionB: "Eubacteria",
    optionC: "Halophiles",
    optionD: "Thermoacidophiles",
    correctOption: "A",
    explanation: "Methanogens in rumen of cattle convert cellulose fermentation products into methane ($\text{CH}_4$) biogas."
  },
  {
    subject: "Biology",
    questionText: "Antivenom injection against snakebite contains preformed antibodies, while oral Polio Vaccine (OPV) contains:",
    optionA: "Gamma globulin",
    optionB: "Attenuated live pathogens (Sabin vaccine)",
    optionC: "Activated virulent pathogens",
    optionD: "Harvested antibodies",
    correctOption: "B",
    explanation: "Oral polio drops contain live attenuated (weakened) poliovirus strains that stimulate mucosal IgA immunity."
  },
  {
    subject: "Biology",
    questionText: "In a logistic population growth model ($dN/dt = rN(1 - N/K)$), population growth rate equals ZERO when:",
    optionA: "$N/K = 0$",
    optionB: "Death rate exceeds birth rate",
    optionC: "$N/K = 1$ ($N = K$ carrying capacity)",
    optionD: "$N$ nears carrying capacity",
    correctOption: "C",
    explanation: "When $N = K$, the term $(1 - N/K) = (1 - 1) = 0$, bringing net population growth rate $dN/dt$ to zero."
  },
  {
    subject: "Biology",
    questionText: "Which of the following biochemical statements is WRONG?",
    optionA: "Uracil is a pyrimidine",
    optionB: "Glycine is a sulphur-containing amino acid (Glycine has no sulphur; Cysteine and Methionine contain sulphur)",
    optionC: "Sucrose is a disaccharide",
    optionD: "Cellulose is a polysaccharide",
    correctOption: "B",
    explanation: "Glycine is the simplest amino acid ($\text{H}_2\text{N-CH}_2\text{-COOH}$) with hydrogen as side chain, containing no sulphur."
  },
  {
    subject: "Biology",
    questionText: "Thermostable Taq DNA Polymerase used in automated PCR thermocycling is isolated from:",
    optionA: "Bacillus subtilis",
    optionB: "Pseudomonas putida",
    optionC: "Thermus aquaticus (Thermophilic hot-spring bacterium)",
    optionD: "Thiobacillus ferroxidans",
    correctOption: "C",
    explanation: "Taq polymerase remains enzymatically active during $94^\circ\text{C}$ DNA denaturation steps."
  },
  {
    subject: "Biology",
    questionText: "Gause's Principle of Competitive Exclusion states that:",
    optionA: "No two species competing for the same limiting resources can coexist indefinitely in the identical niche",
    optionB: "Large organisms exclude small organisms",
    optionC: "Abundant exclude rare",
    optionD: "Different food preferences excluded",
    correctOption: "A",
    explanation: "Two ecologically identical species with overlapping niche requirements cannot sustainably coexist."
  },
  {
    subject: "Biology",
    questionText: "Green photosynthetic succulent stems performing the role of leaves in xerophytic plants (Opuntia) are:",
    optionA: "Phylloclades",
    optionB: "Scales",
    optionC: "Cladodes (Single internode)",
    optionD: "Phyllodes",
    correctOption: "A",
    explanation: "Phylloclades are flattened succulent green stems with multiple nodes adapted for photosynthesis and water storage."
  },
  {
    subject: "Biology",
    questionText: "Root-knot nematode Meloidogyne incognita infects which organ of tobacco plant, causing severe yield reduction?",
    optionA: "Stem",
    optionB: "Roots (Root galls and knots)",
    optionC: "Flower",
    optionD: "Leaf",
    correctOption: "B",
    explanation: "Meloidogyne incognita invades tobacco roots, stimulating giant feeding cells and root galls (prevented via RNAi)."
  },
  {
    subject: "Biology",
    questionText: "Fertilization in humans is practically feasible only if:",
    optionA: "Ovum and sperms transported to ampullary-isthmic junction of cervix",
    optionB: "Sperms transported within 48 hrs in uterus",
    optionC: "Sperms in vagina after ovum in tube",
    optionD: "Ovum and sperms are transported simultaneously to the ampullary-isthmic junction of the Fallopian tube",
    correctOption: "D",
    explanation: "Syngamy takes place at ampullary-isthmic junction of Fallopian tube when viable gametes meet simultaneously."
  },
  {
    subject: "Biology",
    questionText: "Which statement is NOT true for cancer cells in relation to oncogenic mutations?",
    optionA: "Mutations inactivate cell cycle control checkpoints",
    optionB: "Mutations inhibit production of telomerase (Cancer cells activate/upregulate telomerase maintaining immortal telomeres)",
    optionC: "Mutations in proto-oncogenes accelerate cell cycle",
    optionD: "Mutations destroy telomerase inhibitor",
    correctOption: "B",
    explanation: "Cancer cells exhibit high telomerase expression, preventing telomere shortening and endowing cellular immortality."
  },
  {
    subject: "Biology",
    questionText: "Which vertebrate forelimb appendage is HOMOLOGOUS to the wing of a bird?",
    optionA: "Hind limb of rabbit",
    optionB: "Flipper of Whale (Mammalian modified forelimb)",
    optionC: "Dorsal fin of shark",
    optionD: "Wing of moth (Analogous)",
    correctOption: "B",
    explanation: "Bird wing and whale flipper share pentadactyl skeletal homology derived from a common tetrapod ancestor."
  },
  {
    subject: "Biology",
    questionText: "Match Genetic Terms with Definitions:\n(a) Dominance, (b) Codominance, (c) Pleiotropy, (d) Polygenic inheritance\n(i) Multiple genes govern single trait, (ii) In heterozygote one allele expresses, (iii) In heterozygote both alleles express fully, (iv) Single gene influences multiple traits\nChoose correct code:",
    optionA: "(a)-(iv), (b)-(i), (c)-(ii), (d)-(iii)",
    optionB: "(a)-(iv), (b)-(iii), (c)-(i), (d)-(ii)",
    optionC: "(a)-(ii), (b)-(i), (c)-(iv), (d)-(iii)",
    optionD: "(a)-(ii), (b)-(iii), (c)-(iv), (d)-(i)",
    correctOption: "D",
    explanation: "Dominance = Only one allele expresses (ii), Codominance = Both express (iii), Pleiotropy = One gene affects multiple traits (iv), Polygenic = Many genes affect one trait (i)."
  },
  {
    subject: "Biology",
    questionText: "Which microbe and industrial bioactive product pair is WRONGLY matched?",
    optionA: "Streptococcus - Streptokinase (Clot buster)",
    optionB: "Clostridium butylicum - Lipase (Produces butyric acid, not commercial lipase)",
    optionC: "Trichoderma polysporum - Cyclosporin A (Immunosuppressant)",
    optionD: "Monascus purpureus - Statins (Cholesterol lowering)",
    correctOption: "B",
    explanation: "Clostridium butylicum produces butyric acid; Candida lipolytica produces lipases."
  },
  {
    subject: "Biology",
    questionText: "Select the INCORRECT statement regarding human reproductive endocrinology:",
    optionA: "LH and FSH decrease gradually during follicular phase (LH and FSH increase steadily during follicular phase, peaking at mid-cycle)",
    optionB: "LH triggers androgen secretion from Leydig cells",
    optionC: "FSH stimulates Sertoli cells for spermiogenesis",
    optionD: "LH surge triggers ovulation in ovary",
    correctOption: "A",
    explanation: "FSH and LH levels rise progressively during follicular phase, culminating in mid-cycle ovulatory surge."
  },
  {
    subject: "Biology",
    questionText: "Which of the following is a Type II Restriction Endonuclease enzyme?",
    optionA: "DNase I",
    optionB: "RNase",
    optionC: "Hind II (First isolated restriction endonuclease)",
    optionD: "Protease",
    correctOption: "C",
    explanation: "Hind II cuts DNA at specific 6-base recognition palindrome sequences."
  },
  {
    subject: "Biology",
    questionText: "Tubulin microtubules form structural components of which cellular organelles?",
    optionA: "Centrioles, Spindle fibres, and Chromatin",
    optionB: "Centrosome, Nucleosome, and Centrioles",
    optionC: "Cilia, Flagella, and Peroxisomes",
    optionD: "Spindle fibres, Centrioles, and Cilia / Flagella ($9+2$ and $9+0$ axoneme)",
    correctOption: "D",
    explanation: "Microtubules assembled from $\alpha/\beta$-tubulin heterodimers form mitotic spindle, basal bodies/centrioles, and cilia/flagella."
  },
  {
    subject: "Biology",
    questionText: "Select the CORRECT botanical statement:",
    optionA: "Sequoia sempervirens (Giant redwood) is one of the tallest gymnosperm trees",
    optionB: "Leaves of gymnosperms are poorly adapted to extremes",
    optionC: "Gymnosperms are homosporous and heterosporous",
    optionD: "Salvinia is gymnosperm",
    correctOption: "A",
    explanation: "Sequoia is one of the tallest living gymnosperm tree species on Earth."
  },
  {
    subject: "Biology",
    questionText: "When the immune system loses tolerance to self-antigens and attacks its own body tissues, it leads to:",
    optionA: "Auto-immune disease (Rheumatoid arthritis, Myasthenia gravis)",
    optionB: "Active immunity",
    optionC: "Allergic response",
    optionD: "Graft rejection",
    correctOption: "A",
    explanation: "Loss of self-tolerance causes autoantibodies and cytotoxic T-cells to destroy host tissues in autoimmune disorders."
  },
  {
    subject: "Biology",
    questionText: "In a testcross with $F_1$ dihybrid Drosophila, higher parental phenotypes than recombinant offspring indicates:",
    optionA: "The two genes are linked on the same chromosome (Genetic linkage)",
    optionB: "Controlled by multiple genes",
    optionC: "Located on separate chromosomes",
    optionD: "Non-disjunction",
    correctOption: "A",
    explanation: "Linked syntenic genes on the same chromosome tend to be inherited together without independent assortment."
  },
  {
    subject: "Biology",
    questionText: "Which statement about pollen-pistil interaction is INCORRECT?",
    optionA: "Germination is regulated by chemical dialogue with pistil",
    optionB: "Reptiles can act as pollinators",
    optionC: "Pollen grains of many species can germinate on stigma but only one pollen tube of the same species grows into style (Multiple compatible tubes of same species can grow into style)",
    optionD: "Nectar thieves take nectar without pollination",
    correctOption: "C",
    explanation: "Multiple compatible pollen tubes of the same species germinate and grow through style towards ovary."
  },
  {
    subject: "Biology",
    questionText: "Asthma is characterized by difficulty breathing and wheezing caused by:",
    optionA: "Tracheal inflammation",
    optionB: "Lung fluid collection",
    optionC: "Bacterial infection",
    optionD: "Allergic reaction triggering mast cell histamine/leukotriene release in bronchioles",
    correctOption: "D",
    explanation: "Asthma involves IgE-mediated mast cell degranulation causing smooth muscle spasm in bronchioles."
  },
  {
    subject: "Biology",
    questionText: "Regarding prenatal diagnostic Amniocentesis, which statement is INCORRECT / FALSE?",
    optionA: "Used for detection of Down's syndrome",
    optionB: "It can be used for detection of Cleft palate (Cleft palate is anatomical malformation not detected by chromosomal karyotyping)",
    optionC: "Performed at 14-16 weeks gestation",
    optionD: "Misused for prenatal sex determination",
    correctOption: "B",
    explanation: "Amniocentesis analyzes fetal cell karyotype and biochemical enzymes for genetic abnormalities, not morphological structural defects like cleft palate."
  },
  {
    subject: "Biology",
    questionText: "Specialized modified epidermal cells immediately flanking and assisting stomatal guard cells are:",
    optionA: "Bulliform cells",
    optionB: "Lenticels",
    optionC: "Complementary cells",
    optionD: "Subsidiary cells (Accessory cells)",
    correctOption: "D",
    explanation: "Subsidiary cells surround guard cells and participate in osmotic ion exchange during stomatal opening/closing."
  },
  {
    subject: "Biology",
    questionText: "Which factor is considered the MOST IMPORTANT cause driving worldwide extinction of wildlife species (Evil Quartet)?",
    optionA: "Habitat loss and fragmentation (Deforestation)",
    optionB: "Co-extinctions",
    optionC: "Over-exploitation",
    optionD: "Alien species invasions",
    correctOption: "A",
    explanation: "Habitat destruction and fragmentation is the primary driver of biodiversity loss across tropical ecosystems."
  },
  {
    subject: "Biology",
    questionText: "Analogous organs (wings of butterfly and wings of bird) evolving independently for flight arise by:",
    optionA: "Shared common ancestry",
    optionB: "Stabilizing selection",
    optionC: "Divergent evolution",
    optionD: "Convergent evolution",
    correctOption: "D",
    explanation: "Unrelated lineages facing similar environmental selection pressures evolve analogous structures through convergent evolution."
  },
  {
    subject: "Biology",
    questionText: "Which of the following genetic descriptors most appropriately characterizes classical Haemophilia A?",
    optionA: "Chromosomal disorder",
    optionB: "Autosomal dominant",
    optionC: "Autosomal recessive",
    optionD: "X-linked recessive gene disorder (Factor VIII deficiency)",
    correctOption: "D",
    explanation: "Haemophilia A is an X-linked recessive bleeding disorder showing criss-cross inheritance from carrier mother to sons."
  },
  {
    subject: "Biology",
    questionText: "The single, shield-shaped large cotyledon of a monocot maize grain is termed:",
    optionA: "Coleoptile",
    optionB: "Scutellum",
    optionC: "Plumule",
    optionD: "Coleorhiza",
    correctOption: "B",
    explanation: "The single lateral cotyledon in monocots is specialized as an absorbing scutellum."
  },
  {
    subject: "Biology",
    questionText: "The ecological term 'Ecosystem' was first coined and introduced by:",
    optionA: "Ernst Haeckel",
    optionB: "E. Warming",
    optionC: "E.P. Odum",
    optionD: "A.G. Tansley (1935)",
    correctOption: "D",
    explanation: "Sir Arthur Tansley coined the term 'ecosystem' in 1935 to describe biotic communities interacting with abiotic factors."
  },
  {
    subject: "Biology",
    questionText: "Which diagnostic anatomical feature is NOT present in members of Phylum Arthropoda?",
    optionA: "Parapodia for locomotion (Diagnostic feature of Annelida like Nereis)",
    optionB: "Jointed appendages",
    optionC: "Chitinous exoskeleton",
    optionD: "Metameric segmentation",
    correctOption: "A",
    explanation: "Lateral fleshy unjointed parapodia are characteristic locomotory paddles of aquatic annelids."
  },
  {
    subject: "Biology",
    questionText: "Which of the following cellular organelles is bounded by a SINGLE lipid bilayer unit membrane?",
    optionA: "Lysosomes",
    optionB: "Nucleus (Double membrane)",
    optionC: "Mitochondria (Double membrane)",
    optionD: "Chloroplasts (Double membrane)",
    correctOption: "A",
    explanation: "Lysosomes, microbodies, and vacuoles are single-membrane enclosed organelles."
  },
  {
    subject: "Biology",
    questionText: "Which cytological event is NOT a characteristic feature during Mitosis in somatic cells?",
    optionA: "Chromosome movement",
    optionB: "Synapsis of homologous chromosomes (Occurs uniquely during Zygotene of Meiosis I)",
    optionC: "Spindle apparatus formation",
    optionD: "Disappearance of nucleolus",
    correctOption: "B",
    explanation: "Pairing and synapsis of homologous chromosomes via synaptonemal complex is exclusive to Meiosis I."
  },
  {
    subject: "Biology",
    questionText: "Inflow of untreated domestic sewage rich in organic biodegradable waste into a river causes:",
    optionA: "Increased fish production",
    optionB: "Massive death of fish due to severe dissolved oxygen depletion (High BOD)",
    optionC: "Drying of river",
    optionD: "Increased food web balance",
    correctOption: "B",
    explanation: "Aerobic microbial decomposition of organic waste spikes BOD and consumes dissolved oxygen, suffocating fish."
  },
  {
    subject: "Biology",
    questionText: "Which experimental tool/method is NOT required in standard Southern blot DNA Fingerprinting?",
    optionA: "Restriction endonucleases",
    optionB: "DNA-DNA hybridization with VNTR probes",
    optionC: "Polymerase Chain Reaction",
    optionD: "Zinc finger motif analysis",
    correctOption: "D",
    explanation: "Zinc finger analysis is used in gene editing/transcription factors, not in forensic DNA profiling."
  },
  {
    subject: "Biology",
    questionText: "During Meiosis I, the actual physical initiation of crossing over between non-sister chromatids occurs at:",
    optionA: "Zygotene",
    optionB: "Diplotene",
    optionC: "Pachytene (Recombinase enzyme mediated)",
    optionD: "Leptotene",
    correctOption: "C",
    explanation: "Genetic recombination and crossing over between homologous chromosomes occurs during Pachytene stage."
  },
  {
    subject: "Biology",
    questionText: "Which of the following biological classification statements is WRONG?",
    optionA: "Eubacteria are called false bacteria (Eubacteria are true bacteria; Archaebacteria are primitive)",
    optionB: "Phycomycetes are called algal fungi",
    optionC: "Cyanobacteria are blue-green algae",
    optionD: "Golden algae are desmids",
    correctOption: "A",
    explanation: "Eubacteria means 'true bacteria' with rigid peptidoglycan cell walls, not false bacteria."
  },
  {
    subject: "Biology",
    questionText: "Blood pressure in the Pulmonary Artery carrying deoxygenated blood from right ventricle is:",
    optionA: "Higher than that in pulmonary vein",
    optionB: "Less than vena cava",
    optionC: "Same as aorta",
    optionD: "More than carotid",
    correctOption: "A",
    explanation: "Pulmonary artery operates at systolic ventricular pressure ($\sim 25\\text{ mmHg}$), much higher than low-pressure pulmonary veins ($\sim 5-8\\text{ mmHg}$)."
  },
  {
    subject: "Biology",
    questionText: "Which statement is INCORRECT / WRONG regarding Viroids?",
    optionA: "They cause infectious plant diseases (Potato spindle tuber viroid)",
    optionB: "Their RNA is of high molecular weight (Viroid RNA is of low molecular weight)",
    optionC: "They lack protein capsid coat",
    optionD: "They are smaller than viruses",
    correctOption: "B",
    explanation: "Viroids consist of low molecular weight, single-stranded circular RNA molecules."
  },
  {
    subject: "Biology",
    questionText: "The photosensitive visual pigment Rhodopsin in human rod retinal cells is chemically composed of:",
    optionA: "Opsin and Retinol",
    optionB: "Transducin and Retinene",
    optionC: "Guanosine and Retinol",
    optionD: "Opsin (protein) and Retinal (11-cis aldehyde derivative of Vitamin A)",
    correctOption: "D",
    explanation: "Rhodopsin consists of apoprotein opsin linked covalently to 11-cis-retinal chromophore."
  },
  {
    subject: "Biology",
    questionText: "The major structural polysaccharide constituent of fungal cell walls is:",
    optionA: "Cellulose",
    optionB: "Hemicellulose",
    optionC: "Chitin (Polymer of N-acetylglucosamine)",
    optionD: "Peptidoglycan",
    correctOption: "C",
    explanation: "Fungal cell walls are predominantly composed of rigid $\beta-1,4$-linked N-acetylglucosamine polymers (chitin)."
  },
  {
    subject: "Biology",
    questionText: "Regarding Origin of Life hypotheses:\n(a) Earliest living organisms were chemoheterotrophic anaerobes\n(b) First autotrophic organisms were anoxygenic chemoautotrophs\nSelect correct assessment:",
    optionA: "Both (a) and (b) are correct",
    optionB: "Both false",
    optionC: "(a) true, (b) false",
    optionD: "(b) true, (a) false",
    correctOption: "A",
    explanation: "In primitive reducing atmosphere lacking free $\text{O}_2$, primeval life was anaerobic and earliest autotrophs utilized inorganic chemicals."
  },
  {
    subject: "Biology",
    questionText: "Chrysophytes (Diatoms), Euglenoids, Dinoflagellates and Slime moulds are all classified under Kingdom:",
    optionA: "Fungi",
    optionB: "Animalia",
    optionC: "Monera",
    optionD: "Protista (Unicellular eukaryotes)",
    correctOption: "D",
    explanation: "Kingdom Protista unifies diverse single-celled eukaryotic photosynthetic and phagotrophic organisms."
  },
  {
    subject: "Biology",
    questionText: "A tricarpellary, syncarpous superior ovary with axile placentation is a characteristic floral trait of Family:",
    optionA: "Fabaceae",
    optionB: "Poaceae",
    optionC: "Liliaceae (Monocot lily family)",
    optionD: "Solanaceae",
    correctOption: "C",
    explanation: "Liliaceae flowers typically possess trilocular, tricarpellary syncarpous ovaries with axile placentation."
  },
  {
    subject: "Biology",
    questionText: "A string of multiple ribosomes attached and translating a single mRNA molecule simultaneously is a:",
    optionA: "Polypeptide",
    optionB: "Okazaki fragment",
    optionC: "Polysome (Polyribosome)",
    optionD: "Polymer",
    correctOption: "C",
    explanation: "A polysome allows rapid sequential translation of many protein molecules from one mRNA transcript."
  },
  {
    subject: "Biology",
    questionText: "In the human stomach mucosa, hydrochloric acid ($\text{HCl}$) and intrinsic factor are secreted by:",
    optionA: "Peptic / Chief cells",
    optionB: "Acidic cells",
    optionC: "Gastrin G-cells",
    optionD: "Parietal / Oxyntic cells",
    correctOption: "D",
    explanation: "Parietal (oxyntic) cells in gastric glands secrete $\text{HCl}$ and Castle's intrinsic factor."
  },
  {
    subject: "Biology",
    questionText: "Identify the CORRECT statement regarding the gonadal peptide hormone 'Inhibin':",
    optionA: "Produced by granulose cells in ovary and inhibits LH",
    optionB: "Produced by nurse cells in testes and inhibits LH",
    optionC: "Inhibits LH, FSH and Prolactin",
    optionD: "Produced by granulosa cells in ovary (and Sertoli cells in testes) and selectively inhibits FSH secretion",
    correctOption: "D",
    explanation: "Inhibin exerts negative feedback on anterior pituitary gonadotrophs to downregulate FSH release."
  },
  {
    subject: "Biology",
    questionText: "The largest posterior standard petal in the papilionaceous vexillary corolla (Pea flower) is called:",
    optionA: "Vexillum (Standard / Banner)",
    optionB: "Corona",
    optionC: "Carina (Keel)",
    optionD: "Pappus",
    correctOption: "A",
    explanation: "Papilionaceous corolla consists of 1 large posterior vexillum, 2 lateral wings (alae), and 2 fused anterior keels (carina)."
  },
  {
    subject: "Biology",
    questionText: "In Bryophytes and Pteridophytes, transport of flagellated antherozoids (male gametes) to archegonia requires:",
    optionA: "Birds",
    optionB: "Water film",
    optionC: "Wind",
    optionD: "Insects",
    correctOption: "B",
    explanation: "Bryophytes and pteridophytes depend on an external water film for swimming antherozoids (zoidiogamy)."
  },
  {
    subject: "Biology",
    questionText: "The proximal basal end of the stamen filament is attached to the:",
    optionA: "Placenta",
    optionB: "Thalamus receptacle or flower Petal (Epipetalous)",
    optionC: "Anther",
    optionD: "Connective",
    correctOption: "B",
    explanation: "Proximal filament end connects to floral thalamus or corolla petals; distal end bears bilobed anther."
  }
];

async function seedNeet2016Paper() {
  console.log(`🚀 Compiling NEET 2016 Paper JSON with ${rawQuestions.length} complete questions...`);

  const paperData = {
    examName: "NEET",
    year: 2016,
    shiftName: "NEET 2016",
    examDate: "2016-05-01T14:00:00Z",
    totalMarks: 720,
    totalQuestions: 180,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'NEET 2016.json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved NEET 2016 JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding NEET 2016 Shift into Database via Prisma...`);
  
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
      name: "NEET 2016"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "NEET 2016",
      date: new Date("2016-05-01T14:00:00Z")
    }
  });
  console.log(`Created Shift "NEET 2016" (ID: ${shift.id})`);

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

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for NEET 2016 in PostgreSQL!`);
}

seedNeet2016Paper()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
