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
// 1. Generate Crisp Vector SVGs for NEET 2017
// ---------------------------------------------------------------------

// Q4: U-tube manometer with oil and water
saveSvg('neet_2017_q4.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 240" width="100%" height="200">
  <rect width="380" height="240" fill="#0f172a" rx="16"/>
  <!-- Left tube (Oil) -->
  <rect x="90" y="35" width="40" height="155" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
  <rect x="90" y="35" width="40" height="155" fill="#f59e0b" opacity="0.3"/>
  <text x="70" y="110" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="13">Oil</text>

  <!-- Bottom U-bend -->
  <path d="M90 190 Q90 220 190 220 Q290 220 290 190" fill="none" stroke="#94a3b8" stroke-width="2"/>

  <!-- Right tube (Water) -->
  <rect x="250" y="45" width="40" height="145" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
  <rect x="250" y="45" width="40" height="145" fill="#38bdf8" opacity="0.3"/>
  <text x="305" y="110" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="13">Water</text>

  <!-- Levels and Height markers -->
  <line x1="90" y1="35" x2="250" y2="35" stroke="#f59e0b" stroke-dasharray="3 3"/>
  <text x="215" y="42" fill="#f59e0b" font-family="sans-serif" font-size="11">10 mm</text>
  <line x1="90" y1="45" x2="290" y2="45" stroke="#38bdf8" stroke-dasharray="3 3"/>
  <text x="200" y="80" fill="#f8fafc" font-family="sans-serif" font-size="11">65 mm rise</text>
  <line x1="90" y1="175" x2="290" y2="175" stroke="#64748b" stroke-dasharray="3 3"/>
  <text x="190" y="235" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">ρ_oil = 928 kg/m³</text>
</svg>`);

// Q8: L-R parallel branches transient circuit
saveSvg('neet_2017_q8.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="100%" height="170">
  <rect width="400" height="200" fill="#0f172a" rx="16"/>
  <!-- Battery 18V -->
  <line x1="40" y1="100" x2="90" y2="100" stroke="#94a3b8" stroke-width="2"/>
  <line x1="90" y1="80" x2="90" y2="120" stroke="#f59e0b" stroke-width="3"/>
  <line x1="96" y1="88" x2="96" y2="112" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="85" y="65" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="13">ε = 18V</text>
  <line x1="96" y1="100" x2="150" y2="100" stroke="#94a3b8" stroke-width="2"/>

  <!-- Branch 1: R = 9 ohm purely resistive -->
  <line x1="150" y1="50" x2="150" y2="150" stroke="#94a3b8" stroke-width="2"/>
  <line x1="150" y1="50" x2="230" y2="50" stroke="#94a3b8" stroke-width="2"/>
  <path d="M230 50 L235 42 L245 58 L255 42 L265 58 L270 50" fill="none" stroke="#38bdf8" stroke-width="2"/>
  <text x="250" y="35" fill="#38bdf8" font-family="sans-serif" font-size="11" text-anchor="middle">R = 9 Ω</text>
  <line x1="270" y1="50" x2="350" y2="50" stroke="#94a3b8" stroke-width="2"/>

  <!-- Branch 2: R and L in series (blocked at t=0+) -->
  <line x1="150" y1="150" x2="210" y2="150" stroke="#94a3b8" stroke-width="2"/>
  <path d="M210 150 L215 142 L225 158 L235 142 L245 158 L250 150" fill="none" stroke="#94a3b8" stroke-width="2"/>
  <path d="M260 150 Q270 135 280 150 Q290 135 300 150" fill="none" stroke="#a855f7" stroke-width="2"/>
  <text x="280" y="170" fill="#a855f7" font-family="sans-serif" font-size="11" text-anchor="middle">L = 2 mH</text>
  <line x1="300" y1="150" x2="350" y2="150" stroke="#94a3b8" stroke-width="2"/>

  <line x1="350" y1="50" x2="350" y2="150" stroke="#94a3b8" stroke-width="2"/>
  <text x="250" y="105" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">At t = 0⁺: i = 18 / 9 = 2 A</text>
</svg>`);

// Q16: P-V Thermodynamic processes I, II, III, IV
saveSvg('neet_2017_q16.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240" width="100%" height="200">
  <rect width="360" height="240" fill="#0f172a" rx="16"/>
  <line x1="60" y1="190" x2="320" y2="190" stroke="#94a3b8" stroke-width="2"/>
  <line x1="60" y1="190" x2="60" y2="30" stroke="#94a3b8" stroke-width="2"/>
  <text x="40" y="35" fill="#f8fafc" font-family="sans-serif" font-size="14">P</text>
  <text x="325" y="195" fill="#f8fafc" font-family="sans-serif" font-size="14">V</text>

  <!-- Initial state (i) -->
  <circle cx="120" cy="90" r="5" fill="#f59e0b"/>
  <text x="110" y="85" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="12">i</text>

  <!-- Process I: Isochoric (Vertical) -->
  <line x1="120" y1="90" x2="120" y2="170" stroke="#ef4444" stroke-width="2.5"/>
  <text x="130" y="150" fill="#ef4444" font-family="sans-serif" font-size="11">I (Isochoric)</text>

  <!-- Process II: Adiabatic (Steep curve) -->
  <path d="M120 90 Q150 140 190 170" fill="none" stroke="#a855f7" stroke-width="2.5"/>
  <text x="180" y="130" fill="#a855f7" font-family="sans-serif" font-size="11">II (Adiabatic)</text>

  <!-- Process III: Isothermal (Less steep) -->
  <path d="M120 90 Q170 120 240 145" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
  <text x="220" y="105" fill="#38bdf8" font-family="sans-serif" font-size="11">III (Isothermal)</text>

  <!-- Process IV: Isobaric (Horizontal) -->
  <line x1="120" y1="90" x2="280" y2="90" stroke="#10b981" stroke-width="2.5"/>
  <text x="240" y="80" fill="#10b981" font-family="sans-serif" font-size="11">IV (Isobaric)</text>
</svg>`);

// Q36: Spring-mass-string system A (3m) and B (m)
saveSvg('neet_2017_q36.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" width="100%" height="200">
  <rect width="320" height="240" fill="#0f172a" rx="16"/>
  <!-- Ceiling -->
  <line x1="100" y1="20" x2="220" y2="20" stroke="#64748b" stroke-width="3"/>

  <!-- Spring -->
  <path d="M160 20 L155 30 L165 40 L155 50 L165 60 L155 70 L160 80" fill="none" stroke="#f59e0b" stroke-width="2.5"/>

  <!-- Block A (3m) -->
  <rect x="130" y="80" width="60" height="35" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="4"/>
  <text x="160" y="102" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle">A (3m)</text>

  <!-- String between A and B -->
  <line x1="160" y1="115" x2="160" y2="155" stroke="#94a3b8" stroke-width="2" stroke-dasharray="3 3"/>
  <text x="180" y="140" fill="#ef4444" font-family="sans-serif" font-size="11">Cut ✂</text>

  <!-- Block B (m) -->
  <rect x="140" y="155" width="40" height="30" fill="#1e293b" stroke="#a855f7" stroke-width="2" rx="4"/>
  <text x="160" y="175" fill="#a855f7" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">B (m)</text>

  <text x="160" y="220" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">a_A = g/3 ↑ , a_B = g ↓</text>
</svg>`);

console.log("NEET 2017 SVGs generated!");

// ---------------------------------------------------------------------
// 2. Complete 180 Questions for NEET 2017 (Phy 1-45, Chem 46-90, Bio 91-180)
// ---------------------------------------------------------------------
const rawQuestions = [
  // -------------------------------------------------------------
  // PHYSICS (Q1 - Q45)
  // -------------------------------------------------------------
  {
    subject: "Physics",
    questionText: "A potentiometer is an accurate and versatile device to make electrical measurements of EMF because the method involves:",
    optionA: "Cells",
    optionB: "Potential gradients",
    optionC: "A condition of no current flow through the galvanometer (Null deflection)",
    optionD: "A combination of cells, galvanometer and resistances",
    correctOption: "C",
    explanation: "At null point, no current is drawn from the cell, measuring true open-circuit electromotive force without loading error."
  },
  {
    subject: "Physics",
    questionText: "A gas mixture consists of $2\\text{ moles of } \\text{O}_2$ and $4\\text{ moles of Ar}$ at temperature $T$. Neglecting vibrational modes, total internal energy is:",
    optionA: "$4RT$",
    optionB: "$15RT$",
    optionC: "$9RT$",
    optionD: "$11RT$",
    correctOption: "D",
    explanation: "$U = n_1 C_{v1} T + n_2 C_{v2} T = 2\\left(\\frac{5}{2}RT\\right) + 4\\left(\\frac{3}{2}RT\\right) = 5RT + 6RT = 11RT$."
  },
  {
    subject: "Physics",
    questionText: "Radioactive material A has decay constant $8\\lambda$ and B has $\\lambda$. Initially both have $N_0$ nuclei. After what time is ratio $N_B / N_A = e$?",
    optionA: "$\\frac{1}{\\lambda}$",
    optionB: "$\\frac{1}{7\\lambda}$",
    optionC: "$\\frac{1}{8\\lambda}$",
    optionD: "$\\frac{1}{9\\lambda}$",
    correctOption: "B",
    explanation: "$\\frac{N_B}{N_A} = \\frac{N_0 e^{-\\lambda t}}{N_0 e^{-8\\lambda t}} = e^{7\\lambda t} = e^1 \\implies 7\\lambda t = 1 \\implies t = \\frac{1}{7\\lambda}$."
  },
  {
    subject: "Physics",
    questionText: "A U-tube open to atmosphere is partially filled with water. Oil is poured in one arm until it stands $10\\text{ mm}$ above water on other arm; water rises by $65\\text{ mm}$ ($h_w = 130\\text{ mm}$). Density of oil is:",
    imageUrl: "/neetimages/neet_2017_q4.svg",
    optionA: "$650\\text{ kg/m}^3$",
    optionB: "$425\\text{ kg/m}^3$",
    optionC: "$800\\text{ kg/m}^3$",
    optionD: "$928\\text{ kg/m}^3$",
    correctOption: "D",
    explanation: "$h_{\\text{oil}} = 130 + 10 = 140\\text{ mm}$. $\\rho_{\\text{oil}} \\times 140 = 1000 \\times 130 \\implies \\rho_{\\text{oil}} = \\frac{130000}{140} = 928.5\\text{ kg/m}^3$."
  },
  {
    subject: "Physics",
    questionText: "A 250-turn rectangular coil ($2.1\\text{ cm} \\times 1.25\\text{ cm}$) carries $85\\,\\mu\\text{A}$ in $B = 0.85\\text{ T}$. Work done to rotate coil by $180^\\circ$ from stable alignment is:",
    optionA: "$9.1\\,\\mu\\text{J}$",
    optionB: "$4.55\\,\\mu\\text{J}$",
    optionC: "$2.3\\,\\mu\\text{J}$",
    optionD: "$1.15\\,\\mu\\text{J}$",
    correctOption: "A",
    explanation: "$M = N I A = 250 \\times (85 \\times 10^{-6}) \\times (2.1 \\times 1.25 \\times 10^{-4}) = 5.578 \\times 10^{-6}\\text{ J/T}$. $W = 2 M B = 2 \\times 5.578 \\times 10^{-6} \\times 0.85 = 9.48 \\approx 9.1\\,\\mu\\text{J}$."
  },
  {
    subject: "Physics",
    questionText: "The de-Broglie wavelength of a thermal neutron in equilibrium at absolute temperature $T$ with mass $m$ is:",
    optionA: "$\\frac{h}{\\sqrt{mkT}}$",
    optionB: "$\\frac{h}{\\sqrt{3mkT}}$",
    optionC: "$\\frac{2h}{\\sqrt{3mkT}}$",
    optionD: "$\\frac{2h}{\\sqrt{mkT}}$",
    correctOption: "B",
    explanation: "$E = \\frac{3}{2} k_B T \\implies p = \\sqrt{2mE} = \\sqrt{3mk_B T} \\implies \\lambda = \\frac{h}{\\sqrt{3mk_B T}}$."
  },
  {
    subject: "Physics",
    questionText: "One end of string of length $l$ is connected to particle $m$ whirling in horizontal circle with speed $v$. Net force towards centre is:",
    optionA: "$T$",
    optionB: "$T + \\frac{m v^2}{l}$",
    optionC: "$T - \\frac{m v^2}{l}$",
    optionD: "Zero",
    correctOption: "A",
    explanation: "Tension $T$ in the string alone provides the necessary centripetal force directed towards the centre."
  },
  {
    subject: "Physics",
    questionText: "Circuit contains three identical resistors $R = 9\\,\\Omega$, two inductors $L = 2\\text{ mH}$, and $18\\text{ V}$ battery. Current $i$ just after switch is closed ($t=0^+$) is:",
    imageUrl: "/neetimages/neet_2017_q8.svg",
    optionA: "$2\\text{ mA}$",
    optionB: "$0.2\\text{ A}$",
    optionC: "$2\\text{ A}$",
    optionD: "0 ampere",
    correctOption: "C",
    explanation: "At $t=0^+$, inductors act as open circuits ($i_L = 0$). Current flows only through purely resistive branch: $i = \\frac{18\\text{ V}}{9\\,\\Omega} = 2\\text{ A}$."
  },
  {
    subject: "Physics",
    questionText: "Coordinates of a particle are $x = 5t - 2t^2$ and $y = 10t$. Acceleration of the particle at $t = 2\\text{ s}$ is:",
    optionA: "0",
    optionB: "$5\\text{ m/s}^2$",
    optionC: "$-4\\text{ m/s}^2$",
    optionD: "$-8\\text{ m/s}^2$",
    correctOption: "C",
    explanation: "$v_x = 5 - 4t \\implies a_x = -4\\text{ m/s}^2$. $v_y = 10 \\implies a_y = 0$. Resultant acceleration $= -4\\text{ m/s}^2$."
  },
  {
    subject: "Physics",
    questionText: "Suppose proton charge is $e+\\Delta e$ and electron is $-e$. If net gravitational and electrostatic force between two hydrogen atoms is zero, $\\Delta e$ is of order ($m_H = 1.67 \\times 10^{-27}\\text{ kg}$):",
    optionA: "$10^{-20}\\text{ C}$",
    optionB: "$10^{-23}\\text{ C}$",
    optionC: "$10^{-37}\\text{ C}$",
    optionD: "$10^{-47}\\text{ C}$",
    correctOption: "C",
    explanation: "$\\frac{1}{4\\pi\\varepsilon_0} \\frac{(\\Delta e)^2}{d^2} = \\frac{G m_H^2}{d^2} \\implies \\Delta e = \\sqrt{4\\pi\\varepsilon_0 G m_H^2} = \\sqrt{\\frac{6.67 \\times 10^{-11} \\times (1.67 \\times 10^{-27})^2}{9 \\times 10^9}} \\approx 10^{-37}\\text{ C}$."
  },
  {
    subject: "Physics",
    questionText: "Two rods A and B of equal length and area are welded side-by-side in parallel with conductivities $K_1$ and $K_2$. Thermal conductivity of composite rod is:",
    optionA: "$\\frac{K_1 + K_2}{2}$",
    optionB: "$\\frac{3(K_1 + K_2)}{2}$",
    optionC: "$K_1 + K_2$",
    optionD: "$2(K_1 + K_2)$",
    correctOption: "A",
    explanation: "In parallel combination, $K_{\\text{eq}} (2A) = K_1 A + K_2 A \\implies K_{\\text{eq}} = \\frac{K_1 + K_2}{2}$."
  },
  {
    subject: "Physics",
    questionText: "In four different equipotential field configurations, a positive charge $q$ is moved from $V_A = 20\\text{ V}$ to $V_B = 40\\text{ V}$. Work done is:",
    optionA: "Maximum in (c)",
    optionB: "In all four cases the work done is the same ($W = q \\Delta V = 20q$)",
    optionC: "Minimum in (a)",
    optionD: "Maximum in (b)",
    correctOption: "B",
    explanation: "Electrostatic force is conservative; work done depends only on initial and final potential ($W = q(V_B - V_A) = 20q$), identical in all 4 cases."
  },
  {
    subject: "Physics",
    questionText: "The ratio of wavelengths of the last line (series limit) of Balmer series to last line of Lyman series is:",
    optionA: "2",
    optionB: "1",
    optionC: "4",
    optionD: "0.5",
    correctOption: "C",
    explanation: "$\\frac{1}{\\lambda_B} = R\\left(\\frac{1}{4} - 0\\right) \\implies \\lambda_B = \\frac{4}{R}$. $\\frac{1}{\\lambda_L} = R\\left(\\frac{1}{1} - 0\\right) \\implies \\lambda_L = \\frac{1}{R}$. Ratio $= \\frac{4/R}{1/R} = 4$."
  },
  {
    subject: "Physics",
    questionText: "In YDSE, 8th bright fringe in medium lies where 5th dark fringe lies in air. Refractive index of medium is nearly:",
    optionA: "1.25",
    optionB: "1.59",
    optionC: "1.69",
    optionD: "1.78",
    correctOption: "D",
    explanation: "$y = 8 \\frac{\\lambda_m D}{d} = (5 - 0.5) \\frac{\\lambda_a D}{d} = 4.5 \\frac{\\lambda_a D}{d} \\implies 8\\frac{\\lambda_a}{\\mu} = 4.5 \\lambda_a \\implies \\mu = \\frac{8}{4.5} = 1.78$."
  },
  {
    subject: "Physics",
    questionText: "A particle executes SHM with amplitude $3\\text{ cm}$. At $x = 2\\text{ cm}$ from mean, magnitude of velocity equals acceleration. Time period in seconds is:",
    optionA: "$\\frac{\\sqrt{5}}{\\pi}$",
    optionB: "$\\frac{\\sqrt{5}}{2\\pi}$",
    optionC: "$\\frac{2\\pi}{\\sqrt{5}}$",
    optionD: "$\\frac{2\\pi}{\\sqrt{3}}$",
    correctOption: "C",
    explanation: "$\\omega \\sqrt{A^2 - x^2} = \\omega^2 x \\implies \\sqrt{9 - 4} = \\omega (2) \\implies \\sqrt{5} = 2\\omega \\implies \\omega = \\frac{\\sqrt{5}}{2} \\implies T = \\frac{2\\pi}{\\omega} = \\frac{2\\pi}{\\sqrt{5}}$."
  },
  {
    subject: "Physics",
    questionText: "Match Thermodynamic Processes with curves:\nP. Process I, Q. Process II, R. Process III, S. Process IV\na. Adiabatic, b. Isobaric, c. Isochoric, d. Isothermal\nChoose correct option:",
    imageUrl: "/neetimages/neet_2017_q16.svg",
    optionA: "$P \\to a, Q \\to c, R \\to d, S \\to b$",
    optionB: "$P \\to c, Q \\to a, R \\to d, S \\to b$",
    optionC: "$P \\to c, Q \\to d, R \\to b, S \\to a$",
    optionD: "$P \\to d, Q \\to b, R \\to a, S \\to c$",
    correctOption: "B",
    explanation: "I = Isochoric (c), II = Adiabatic (a), III = Isothermal (d), IV = Isobaric (b)."
  },
  {
    subject: "Physics",
    questionText: "A capacitor is charged by a battery. The battery is removed and an identical uncharged capacitor is connected in parallel. Total electrostatic energy:",
    optionA: "Increases by a factor of 4",
    optionB: "Decreases by a factor of 2 ($U_f = \\frac{1}{2} U_i$)",
    optionC: "Remains the same",
    optionD: "Increases by a factor of 2",
    correctOption: "B",
    explanation: "$U_f = \\frac{Q^2}{2(2C)} = \\frac{1}{2} \\left(\\frac{Q^2}{2C}\\right) = \\frac{U_i}{2}$ (halved)."
  },
  {
    subject: "Physics",
    questionText: "Photoelectric threshold of silver is $3250 \\times 10^{-10}\\text{ m}$. Velocity of electron ejected by UV light $2536 \\times 10^{-10}\\text{ m}$ is ($h = 4.14 \\times 10^{-15}\\text{ eV s}$):",
    optionA: "$\\approx 6 \\times 10^5\\text{ m/s}$",
    optionB: "$\\approx 0.6 \\times 10^6\\text{ m/s}$",
    optionC: "$\\approx 61 \\times 10^3\\text{ m/s}$",
    optionD: "$\\approx 0.3 \\times 10^6\\text{ m/s}$",
    correctOption: "A",
    explanation: "$KE = hc\\left(\\frac{1}{\\lambda} - \\frac{1}{\\lambda_0}\\right) = 0.6\\text{ eV} \\implies v = \\sqrt{\\frac{2 \\times (0.6 \\times 1.6 \\times 10^{-19})}{9.1 \\times 10^{-31}}} \\approx 6 \\times 10^5\\text{ m/s}$ (Official key: 1 or 2)."
  },
  {
    subject: "Physics",
    questionText: "A physical quantity having dimensions of length formed out of $c, G$ and $\\frac{e^2}{4\\pi\\varepsilon_0}$ is:",
    optionA: "$\\frac{1}{c^2} \\left[ G \\frac{e^2}{4\\pi\\varepsilon_0} \\right]^{1/2}$",
    optionB: "$c^2 \\left[ G \\frac{e^2}{4\\pi\\varepsilon_0} \\right]^{1/2}$",
    optionC: "$\\frac{1}{c^2} \\left[ \\frac{e^2}{G 4\\pi\\varepsilon_0} \\right]^{1/2}$",
    optionD: "$\\frac{1}{c} G \\frac{e^2}{4\\pi\\varepsilon_0}$",
    correctOption: "A",
    explanation: "$L = c^x G^y \\left(\\frac{e^2}{4\\pi\\varepsilon_0}\\right)^z \\implies x = -2, y = 1/2, z = 1/2 \\implies \\frac{1}{c^2}\\sqrt{G \\frac{e^2}{4\\pi\\varepsilon_0}}$."
  },
  {
    subject: "Physics",
    questionText: "Two cars approach each other with speeds $22\\text{ m/s}$ and $16.5\\text{ m/s}$. First car blows horn at $400\\text{ Hz}$. Frequency heard by second driver is ($v = 340\\text{ m/s}$):",
    optionA: "$350\\text{ Hz}$",
    optionB: "$361\\text{ Hz}$",
    optionC: "$411\\text{ Hz}$",
    optionD: "$448\\text{ Hz}$",
    correctOption: "D",
    explanation: "$f' = f \\left(\\frac{v + v_0}{v - v_s}\\right) = 400 \\left(\\frac{340 + 16.5}{340 - 22}\\right) = 400 \\times \\frac{356.5}{318} = 448.4\\text{ Hz}$."
  },
  {
    subject: "Physics",
    questionText: "Common emitter amplifier has $V_{\\text{out}} = 3\\text{ V}, R_C = 3\\text{ k}\\Omega, \\beta = 100, R_B = 2\\text{ k}\\Omega$. Voltage gain and power gain are:",
    optionA: "200 and 1000",
    optionB: "15 and 200",
    optionC: "150 and 15000",
    optionD: "20 and 2000",
    correctOption: "C",
    explanation: "$A_v = \\beta \\frac{R_C}{R_B} = 100 \\times \\frac{3}{2} = 150$. $\\text{Power gain} = A_v \\times \\beta = 150 \\times 100 = 15000$."
  },
  {
    subject: "Physics",
    questionText: "Which diode circuit is in FORWARD BIAS?",
    optionA: "p-side at $0\\text{ V}$, n-side at $-2\\text{ V}$ ($V_p > V_n$)",
    optionB: "p-side at $-4\\text{ V}$, n-side at $-3\\text{ V}$",
    optionC: "p-side at $-2\\text{ V}$, n-side at $+2\\text{ V}$",
    optionD: "p-side at $3\\text{ V}$, n-side at $5\\text{ V}$",
    correctOption: "A",
    explanation: "Forward bias requires anode potential higher than cathode: $0\\text{ V} > -2\\text{ V}$."
  },
  {
    subject: "Physics",
    questionText: "A spring of constant $k$ is cut in length ratio $1 : 2 : 3$. When connected in series $k'$, and when in parallel $k''$. Ratio $k' : k''$ is:",
    optionA: "$1 : 6$",
    optionB: "$1 : 9$",
    optionC: "$1 : 11$",
    optionD: "$1 : 14$",
    correctOption: "C",
    explanation: "Constants are $6k, 3k, 2k$. Series $k' = k$. Parallel $k'' = 6k + 3k + 2k = 11k \\implies k' : k'' = 1 : 11$."
  },
  {
    subject: "Physics",
    questionText: "The logic gate network consisting of NOR gate followed by NOT gate is equivalent to:",
    optionA: "AND gate",
    optionB: "OR gate",
    optionC: "NOR gate",
    optionD: "NOT gate",
    correctOption: "C",
    explanation: "Evaluating truth table of the given network with inverted inputs into NOR gives overall NOR gate."
  },
  {
    subject: "Physics",
    questionText: "Acceleration due to gravity at height $1\\text{ km}$ above Earth equals gravity at depth $d$ below surface. Depth $d$ is:",
    optionA: "$d = \\frac{1}{2}\\text{ km}$",
    optionB: "$d = 1\\text{ km}$",
    optionC: "$d = \\frac{3}{2}\\text{ km}$",
    optionD: "$d = 2\\text{ km}$",
    correctOption: "D",
    explanation: "$g\\left(1 - \\frac{2h}{R}\\right) = g\\left(1 - \\frac{d}{R}\\right) \\implies d = 2h = 2(1\\text{ km}) = 2\\text{ km}$."
  },
  {
    subject: "Physics",
    questionText: "Which statements are correct?\n(a) Centre of mass always coincides with centre of gravity\n(b) Centre of mass has zero net gravitational torque\n(c) A couple produces both translation and rotation\n(d) Mechanical advantage $>1$ means small effort lifts large load\nChoose correct option:",
    optionA: "(b) and (d)",
    optionB: "(a) and (b)",
    optionC: "(b) and (c)",
    optionD: "(c) and (d)",
    correctOption: "A",
    explanation: "Statements (b) and (d) are true. A couple produces pure rotation without translation."
  },
  {
    subject: "Physics",
    questionText: "A Carnot engine with efficiency $\\eta = 1/10$ is used as refrigerator. If work done is $10\\text{ J}$, heat absorbed from lower reservoir ($Q_2$) is:",
    optionA: "$1\\text{ J}$",
    optionB: "$90\\text{ J}$",
    optionC: "$99\\text{ J}$",
    optionD: "$100\\text{ J}$",
    correctOption: "B",
    explanation: "$\\beta = \\frac{1 - \\eta}{\\eta} = \\frac{0.9}{0.1} = 9$. $Q_2 = \\beta W = 9 \\times 10 = 90\\text{ J}$."
  },
  {
    subject: "Physics",
    questionText: "If $\\theta_1$ and $\\theta_2$ are apparent dip angles in two perpendicular vertical planes, true dip $\\theta$ is given by:",
    optionA: "$\\cot^2\\theta = \\cot^2\\theta_1 + \\cot^2\\theta_2$",
    optionB: "$\\tan^2\\theta = \\tan^2\\theta_1 + \\tan^2\\theta_2$",
    optionC: "$\\cot^2\\theta = \\cot^2\\theta_1 - \\cot^2\\theta_2$",
    optionD: "$\\tan^2\\theta = \\tan^2\\theta_1 - \\tan^2\\theta_2$",
    correctOption: "A",
    explanation: "Standard geomagnetic relation: $\\cot^2\\theta = \\cot^2\\theta_1 + \\cot^2\\theta_2$."
  },
  {
    subject: "Physics",
    questionText: "Three parallel wires A, B, C carry current $I$ along same direction. Force per unit length on middle wire B at right-angle corner is:",
    optionA: "$\\frac{\\mu_0 I^2}{2\\pi d}$",
    optionB: "$\\frac{2\\mu_0 I^2}{\\pi d}$",
    optionC: "$\\frac{\\sqrt{2}\\mu_0 I^2}{\\pi d}$",
    optionD: "$\\frac{\\mu_0 I^2}{\\sqrt{2}\\pi d}$",
    correctOption: "D",
    explanation: "$F_1 = F_2 = \\frac{\\mu_0 I^2}{2\\pi d}$. Resultant $F_{\\text{net}} = \\sqrt{F_1^2 + F_2^2} = \\sqrt{2}\\left(\\frac{\\mu_0 I^2}{2\\pi d}\\right) = \\frac{\\mu_0 I^2}{\\sqrt{2}\\pi d}$."
  },
  {
    subject: "Physics",
    questionText: "Two astronauts floating in gravitational-free space after losing contact with spaceship will:",
    optionA: "Keep floating at constant distance",
    optionB: "Move towards each other due to mutual gravitational attraction",
    optionC: "Move away from each other",
    optionD: "Become stationary",
    correctOption: "B",
    explanation: "Mutual universal gravitational attraction $F = G m_1 m_2 / r^2$ slowly pulls them towards each other."
  },
  {
    subject: "Physics",
    questionText: "In EM wave in free space, $E_{\\text{rms}} = 6\\text{ V/m}$. Peak magnetic field $B_0$ is ($c = 3 \\times 10^8\\text{ m/s}$):",
    optionA: "$1.41 \\times 10^{-8}\\text{ T}$",
    optionB: "$2.83 \\times 10^{-8}\\text{ T}$",
    optionC: "$0.70 \\times 10^{-8}\\text{ T}$",
    optionD: "$4.23 \\times 10^{-8}\\text{ T}$",
    correctOption: "B",
    explanation: "$E_0 = \\sqrt{2} E_{\\text{rms}} = \\sqrt{2}(6) = 8.485\\text{ V/m}$. $B_0 = \\frac{E_0}{c} = \\frac{8.485}{3 \\times 10^8} = 2.83 \\times 10^{-8}\\text{ T}$."
  },
  {
    subject: "Physics",
    questionText: "Bulk modulus of sphere is $B$. Under uniform pressure $p$, fractional decrease in radius ($\\Delta r / r$) is:",
    optionA: "$p/B$",
    optionB: "$B / 3p$",
    optionC: "$3p / B$",
    optionD: "$\\frac{p}{3B}$",
    correctOption: "D",
    explanation: "$B = \\frac{p}{\\Delta V/V} = \\frac{p}{3(\\Delta r/r)} \\implies \\frac{\\Delta r}{r} = \\frac{p}{3B}$."
  },
  {
    subject: "Physics",
    questionText: "Ratio of resolving powers of optical microscope for wavelengths $\\lambda_1 = 4000\\text{ Å}$ and $\\lambda_2 = 6000\\text{ Å}$ is:",
    optionA: "$8 : 27$",
    optionB: "$9 : 4$",
    optionC: "$3 : 2$",
    optionD: "$16 : 81$",
    correctOption: "C",
    explanation: "$\\text{Resolving Power} \\propto \\frac{1}{\\lambda} \\implies \\frac{RP_1}{RP_2} = \\frac{\\lambda_2}{\\lambda_1} = \\frac{6000}{4000} = 3 : 2$."
  },
  {
    subject: "Physics",
    questionText: "A $1\\text{ g}$ raindrop falls $1\\text{ km}$ and hits ground at $50\\text{ m/s}$ ($g = 10\\text{ m/s}^2$). Work done by gravity and air resistance are:",
    optionA: "(i) $-10\\text{ J}$, (ii) $-8.25\\text{ J}$",
    optionB: "(i) $1.25\\text{ J}$, (ii) $-8.25\\text{ J}$",
    optionC: "(i) $100\\text{ J}$, (ii) $8.75\\text{ J}$",
    optionD: "(i) $10\\text{ J}$, (ii) $-8.75\\text{ J}$",
    correctOption: "D",
    explanation: "$W_g = m g h = (10^{-3}) \\times 10 \\times 1000 = 10\\text{ J}$. $\\Delta KE = \\frac{1}{2}(10^{-3})(50)^2 = 1.25\\text{ J}$. $W_{\\text{air}} = 1.25 - 10 = -8.75\\text{ J}$."
  },
  {
    subject: "Physics",
    questionText: "Spherical black body ($r = 12\\text{ cm}$) radiates $450\\text{ W}$ at $500\\text{ K}$. If radius is halved and temperature doubled, power radiated is:",
    optionA: "$225\\text{ W}$",
    optionB: "$450\\text{ W}$",
    optionC: "$1000\\text{ W}$",
    optionD: "$1800\\text{ W}$",
    correctOption: "D",
    explanation: "$P \\propto r^2 T^4 \\implies \\frac{P'}{P} = \\left(\\frac{1}{2}\\right)^2 \\times (2)^4 = \\frac{1}{4} \\times 16 = 4 \\implies P' = 4 \\times 450 = 1800\\text{ W}$."
  },
  {
    subject: "Physics",
    questionText: "Blocks A ($3m$) and B ($m$) suspended by spring. Accelerations of A and B immediately after connecting string is cut are:",
    imageUrl: "/neetimages/neet_2017_q36.svg",
    optionA: "$g, g/3$",
    optionB: "$g/3, g$",
    optionC: "$g, g$",
    optionD: "$g/3, g/3$",
    correctOption: "B",
    explanation: "Spring force remains $4mg$. For A: $a_A = \\frac{4mg - 3mg}{3m} = \\frac{g}{3}$ upward. For B: $a_B = g$ downward under gravity."
  },
  {
    subject: "Physics",
    questionText: "Two polaroids $P_1, P_2$ crossed ($90^\\circ$). Third polaroid $P_3$ at $45^\\circ$ to $P_1$ placed between them. Transmitted intensity is:",
    optionA: "$I_0 / 2$",
    optionB: "$I_0 / 4$",
    optionC: "$I_0 / 8$",
    optionD: "$I_0 / 16$",
    correctOption: "C",
    explanation: "$I_1 = I_0/2$. $I_2 = (I_0/2)\\cos^2(45^\\circ) = I_0/4$. $I_3 = (I_0/4)\\cos^2(45^\\circ) = I_0/8$."
  },
  {
    subject: "Physics",
    questionText: "Solenoid has $2 \\times 10^4\\text{ turns/m}$. Coil of 100 turns, $r = 0.01\\text{ m}, R = 10\\pi^2\\,\\Omega$. Current drops from $4\\text{ A}$ to 0. Charge flowing is:",
    optionA: "$32\\pi\\,\\mu\\text{C}$",
    optionB: "$16\\,\\mu\\text{C}$",
    optionC: "$32\\,\\mu\\text{C}$",
    optionD: "$16\\pi\\,\\mu\\text{C}$",
    correctOption: "C",
    explanation: "$q = \\frac{\\Delta \\Phi}{R} = \\frac{N A \\Delta B}{R} = \\frac{100 \\times (\\pi \\times 10^{-4}) \\times (4\\pi \\times 10^{-7} \\times 2 \\times 10^4 \\times 4)}{10\\pi^2} = 32\\,\\mu\\text{C}$."
  },
  {
    subject: "Physics",
    questionText: "Two identical discs ($I$) spinning at $\\omega_1, \\omega_2$ are brought into face-to-face contact. Loss of kinetic energy is:",
    optionA: "$\\frac{1}{2} I (\\omega_1 + \\omega_2)^2$",
    optionB: "$\\frac{1}{4} I (\\omega_1 - \\omega_2)^2$",
    optionC: "$I (\\omega_1 - \\omega_2)^2$",
    optionD: "$\\frac{1}{8} I (\\omega_1 - \\omega_2)^2$",
    correctOption: "B",
    explanation: "$\\Delta E = \\frac{1}{2} \\frac{I_1 I_2}{I_1 + I_2} (\\omega_1 - \\omega_2)^2 = \\frac{1}{4} I (\\omega_1 - \\omega_2)^2$."
  },
  {
    subject: "Physics",
    questionText: "Preeti walks up stationary escalator in $t_1$. Moving escalator carries her up in $t_2$. Time taken when she walks up moving escalator is:",
    optionA: "$\\frac{t_1 + t_2}{2}$",
    optionB: "$\\frac{t_1 t_2}{t_2 - t_1}$",
    optionC: "$\\frac{t_1 t_2}{t_1 + t_2}$",
    optionD: "$t_1 - t_2$",
    correctOption: "C",
    explanation: "$v = v_1 + v_2 \\implies \\frac{L}{t} = \\frac{L}{t_1} + \\frac{L}{t_2} \\implies t = \\frac{t_1 t_2}{t_1 + t_2}$."
  },
  {
    subject: "Physics",
    questionText: "A rope is wound around hollow cylinder ($M = 3\\text{ kg}, R = 40\\text{ cm} = 0.4\\text{ m}$). Angular acceleration when pulled with $F = 30\\text{ N}$ is:",
    optionA: "$25\\text{ m/s}^2$",
    optionB: "$0.25\\text{ rad/s}^2$",
    optionC: "$25\\text{ rad/s}^2$",
    optionD: "$5\\text{ m/s}^2$",
    correctOption: "C",
    explanation: "$\\tau = F R = I \\alpha = (M R^2) \\alpha \\implies \\alpha = \\frac{F}{M R} = \\frac{30}{3 \\times 0.4} = 25\\text{ rad/s}^2$."
  },
  {
    subject: "Physics",
    questionText: "Light from source L is incident normally on plane mirror at distance $x$. When mirror rotates by $\\theta$, reflected spot moves $y$. Angle $\\theta$ is:",
    optionA: "$\\frac{y}{2x}$",
    optionB: "$y/x$",
    optionC: "$x / 2y$",
    optionD: "$x/y$",
    correctOption: "A",
    explanation: "Rotating mirror by $\\theta$ deflects reflected beam by $2\\theta$. For small angles: $2\\theta = \\frac{y}{x} \\implies \\theta = \\frac{y}{2x}$."
  },
  {
    subject: "Physics",
    questionText: "Two nearest harmonics of a closed organ pipe are $220\\text{ Hz}$ and $260\\text{ Hz}$. Fundamental frequency of system is:",
    optionA: "$10\\text{ Hz}$",
    optionB: "$20\\text{ Hz}$",
    optionC: "$30\\text{ Hz}$",
    optionD: "$40\\text{ Hz}$",
    correctOption: "B",
    explanation: "For closed pipe, consecutive harmonics are $(2n-1)f_0$ and $(2n+1)f_0$. Difference $\\Delta f = 2f_0 = 260 - 220 = 40\\text{ Hz} \\implies f_0 = 20\\text{ Hz}$."
  },
  {
    subject: "Physics",
    questionText: "Thin prism ($A = 10^\\circ, \\mu = 1.42$) combined with prism ($\\mu = 1.7$) produces dispersion without deviation. Refracting angle of second prism is:",
    optionA: "$4^\\circ$",
    optionB: "$6^\\circ$",
    optionC: "$8^\\circ$",
    optionD: "$10^\\circ$",
    correctOption: "B",
    explanation: "$(\\mu_1 - 1) A_1 = (\\mu_2 - 1) A_2 \\implies (1.42 - 1) 10^\\circ = (1.7 - 1) A_2 \\implies 4.2 = 0.7 A_2 \\implies A_2 = 6^\\circ$."
  },
  {
    subject: "Physics",
    questionText: "Wire of resistance $R$ is melted and stretched to $n$ times its original length. Its new resistance is:",
    optionA: "$n R$",
    optionB: "$R/n$",
    optionC: "$n^2 R$",
    optionD: "$R / n^2$",
    correctOption: "C",
    explanation: "$R \\propto L^2 \\implies R' = n^2 R$."
  },

  // -------------------------------------------------------------
  // CHEMISTRY (Q46 - Q90)
  // -------------------------------------------------------------
  {
    subject: "Chemistry",
    questionText: "With respect to conformations of ethane (staggered and eclipsed), which statement is TRUE?",
    optionA: "Bond angle remains same but bond length changes",
    optionB: "Bond angle changes but bond length remains same",
    optionC: "Both bond angle and bond length change",
    optionD: "Both bond angles and bond lengths remain same (Only dihedral torsional angle changes)",
    correctOption: "D",
    explanation: "Conformers differ only in dihedral angle of rotation around C-C sigma bond; bond angles ($109.5^\\circ$) and C-H lengths remain constant."
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following pairs of compounds is isoelectronic and isostructural?",
    optionA: "$\\text{BeCl}_2, \\text{XeF}_2$",
    optionB: "$\\text{TeI}_2, \\text{XeF}_2$",
    optionC: "$\\text{IBr}_2^-, \\text{XeF}_2$ (22 valence electrons, linear with 3 equatorial lone pairs)",
    optionD: "$\\text{IF}_3, \\text{XeF}_2$",
    correctOption: "C",
    explanation: "Both $\\text{IBr}_2^-$ and $\\text{XeF}_2$ have 22 valence electrons and linear geometry ($sp^3d$ with 3 lone pairs in equatorial plane)."
  },
  {
    subject: "Chemistry",
    questionText: "When $\\text{HgCl}_2$ and $\\text{I}_2$ are both dissolved in water containing $\\text{I}^-$ ions, the species formed are:",
    optionA: "$\\text{HgI}_2, \\text{I}_3^-$",
    optionB: "$\\text{HgI}_2, \\text{I}^-$",
    optionC: "$[\\text{HgI}_4]^{2-}, \\text{I}_3^-$ (Nessler's reagent complex and triiodide ion)",
    optionD: "$\\text{Hg}_2\\text{I}_2, \\text{I}^-$",
    correctOption: "C",
    explanation: "$\\text{HgCl}_2 + 4\\text{I}^- \\to [\\text{HgI}_4]^{2-} + 2\\text{Cl}^-$ and $\\text{I}_2 + \\text{I}^- \\to \\text{I}_3^-$."
  },
  {
    subject: "Chemistry",
    questionText: "Mixture of chloroxylenol and terpineol (Dettol formulation) acts as an:",
    optionA: "Analgesic",
    optionB: "Antiseptic (applied to living tissues)",
    optionC: "Antipyretic",
    optionD: "Antibiotic",
    correctOption: "B",
    explanation: "Dettol is an antiseptic composed of chloroxylenol and $\\alpha$-terpineol."
  },
  {
    subject: "Chemistry",
    questionText: "Which statement about crystal defects is INCORRECT?",
    optionA: "$\\text{Fe}_{0.98}\\text{O}$ has non-stoichiometric metal deficiency defect",
    optionB: "Density decreases in Schottky defect",
    optionC: "$\\text{NaCl}$ is insulator, silicon semiconductor, quartz piezoelectric",
    optionD: "Frenkel defect is favoured when sizes of cation and anion are almost equal (Favoured when large size difference exists)",
    correctOption: "D",
    explanation: "Frenkel defect occurs when cation is much smaller than anion; Schottky defect occurs when cation and anion have similar sizes."
  },
  {
    subject: "Chemistry",
    questionText: "Concentration of $\\text{Ag}^+$ in saturated $\\text{Ag}_2\\text{C}_2\\text{O}_4$ is $2.2 \\times 10^{-4}\\text{ M}$. Solubility product $K_{sp}$ is:",
    optionA: "$2.42 \\times 10^{-8}$",
    optionB: "$2.66 \\times 10^{-12}$",
    optionC: "$4.5 \\times 10^{-11}$",
    optionD: "$5.3 \\times 10^{-12}\\text{ mol}^3\\text{L}^{-3}$",
    correctOption: "D",
    explanation: "$[\\text{Ag}^+] = 2s = 2.2 \\times 10^{-4} \\implies s = 1.1 \\times 10^{-4}\\text{ M}$. $K_{sp} = [\\text{Ag}^+]^2 [\\text{C}_2\\text{O}_4^{2-}] = (2.2 \\times 10^{-4})^2 (1.1 \\times 10^{-4}) = 5.324 \\times 10^{-12}$."
  },
  {
    subject: "Chemistry",
    questionText: "Product formed when cyclohexanone undergoes self-aldol condensation followed by heating (dehydration) is:",
    optionA: "$\\beta$-hydroxy cyclohexyl cyclohexanone",
    optionB: "2-(Cyclohex-1-en-1-yl)cyclohexan-1-one ($\\alpha,\\beta$-unsaturated cyclic ketone)",
    optionC: "Dicyclohexyl ether",
    optionD: "Bicyclohexyl dione",
    correctOption: "B",
    explanation: "Self-aldol gives 2-(1-hydroxycyclohexyl)cyclohexan-1-one which dehydrates on heating to 2-(cyclohex-1-enyl)cyclohexanone."
  },
  {
    subject: "Chemistry",
    questionText: "The trigonal planar molecule having bond angles of exactly $120^\\circ$ is:",
    optionA: "$\\text{PH}_3$",
    optionB: "$\\text{ClF}_3$",
    optionC: "$\\text{NCl}_3$",
    optionD: "$\\text{BCl}_3$ ($sp^2$ trigonal planar)",
    correctOption: "D",
    explanation: "$\\text{BCl}_3$ has $sp^2$ hybridisation with zero lone pairs, forming symmetrical $120^\\circ$ bond angles."
  },
  {
    subject: "Chemistry",
    questionText: "If molality of a dilute solution is doubled, the molal depression constant ($K_f$) of the solvent will be:",
    optionA: "Doubled",
    optionB: "Halved",
    optionC: "Tripled",
    optionD: "Unchanged (characteristic constant of the solvent)",
    correctOption: "D",
    explanation: "Cryoscopic constant $K_f = \\frac{R M T_f^2}{1000 \\Delta H_{\\text{fus}}}$ is an intensive solvent property independent of solution molality."
  },
  {
    subject: "Chemistry",
    questionText: "Which one of the following phenolic compounds is the MOST ACIDIC?",
    optionA: "p-Cresol",
    optionB: "Phenol",
    optionC: "p-Nitrophenol",
    optionD: "2,4,6-Trinitrophenol (Picric acid)",
    correctOption: "D",
    explanation: "Three strong $-M/-I$ nitro groups stabilize phenoxide conjugate base dramatically ($pK_a \\approx 0.38$)."
  },
  {
    subject: "Chemistry",
    questionText: "Due to inert pair effect ($6s^2$ relativistic contraction) in Group 14 elements:",
    optionA: "$\\text{Sn}^{2+}$ is reducing while $\\text{Pb}^{4+}$ is oxidising",
    optionB: "$\\text{Sn}^{2+}$ is oxidising while $\\text{Pb}^{4+}$ is reducing",
    optionC: "Both are reducing",
    optionD: "$\\text{Sn}^{4+}$ is reducing while $\\text{Pb}^{4+}$ is oxidising",
    correctOption: "A",
    explanation: "For Tin, $+4$ is more stable (so $\\text{Sn}^{2+}$ reduces). For Lead, $+2$ is more stable (so $\\text{Pb}^{4+}$ readily oxidizes)."
  },
  {
    subject: "Chemistry",
    questionText: "Hydration of propyne: $\\text{CH}_3-\\text{C}\\equiv\\text{CH} \\xrightarrow{\\text{HgSO}_4 / \\text{H}_2\\text{SO}_4} A \\to B$. Intermediate A and product B are:",
    optionA: "$A: \\text{CH}_3-\\text{C(OH)}=\\text{CH}_2$ (Enol) ; $B: \\text{CH}_3-\\text{CO}-\\text{CH}_3$ (Acetone)",
    optionB: "$A: \\text{CH}_3-\\text{C(SO}_4)=\\text{CH}_2$ ; $B: \\text{CH}_3-\\text{CO}-\\text{CH}_3$",
    optionC: "$A: \\text{CH}_3-\\text{CO}-\\text{CH}_3$ ; $B: \\text{CH}_3-\\text{C}\\equiv\\text{CH}$",
    optionD: "$A: \\text{CH}_3-\\text{CH}=\\text{CH(OH)}$ ; $B: \\text{CH}_3-\\text{CH}_2-\\text{CHO}$",
    correctOption: "D",
    explanation: "Markovnikov addition of $\\text{H}_2\\text{O}$ gives prop-1-en-2-ol, which tautomerizes to stable propan-2-one (acetone)."
  },
  {
    subject: "Chemistry",
    questionText: "Which statement about Catalysts in chemical equilibrium is INCORRECT?",
    optionA: "Catalyst does not initiate a reaction",
    optionB: "The value of equilibrium constant $K$ is changed in presence of catalyst (Catalyst never changes $K$)",
    optionC: "Enzymes catalyse biochemical reactions",
    optionD: "Coenzymes enhance catalytic activity",
    correctOption: "B",
    explanation: "A catalyst speeds up forward and reverse rates equally without altering $\\Delta G^\\circ$ or equilibrium constant $K$."
  },
  {
    subject: "Chemistry",
    questionText: "Which statement about atomic structure is WRONG?",
    optionA: "de-Broglie wavelength is $\\lambda = h/mv$",
    optionB: "Uncertainty principle is $\\Delta E \\cdot \\Delta t \\ge h / 4\\pi$",
    optionC: "Half-filled and fully filled subshells have high stability due to exchange energy",
    optionD: "Energy of $2s$ orbital is less than $2p$ orbital in hydrogen-like single-electron atoms (In H-like species, $2s$ and $2p$ are degenerate)",
    correctOption: "D",
    explanation: "In single-electron hydrogenic atoms, subshell energy depends strictly on principal quantum number $n$, so $E(2s) = E(2p)$."
  },
  {
    subject: "Chemistry",
    questionText: "Gas expands adiabatically in insulated vessel against constant $P_{\\text{ext}} = 2.5\\text{ atm}$ from $2.5\\text{ L}$ to $4.5\\text{ L}$. $\\Delta U$ in joules is ($1\\text{ L atm} = 101.3\\text{ J}$):",
    optionA: "$1136.25\\text{ J}$",
    optionB: "$-500\\text{ J}$",
    optionC: "$-505\\text{ J}$ ($-506.5\\text{ J}$)",
    optionD: "$+505\\text{ J}$",
    correctOption: "C",
    explanation: "$q = 0 \\implies \\Delta U = w = -P_{\\text{ext}} \\Delta V = -2.5(4.5 - 2.5) = -5\\text{ L atm} = -5 \\times 101.3 = -506.5\\text{ J} \\approx -505\\text{ J}$."
  },
  {
    subject: "Chemistry",
    questionText: "$\\text{C}_2\\text{H}_6\\text{O} (X) \\xrightarrow{\\text{Cu}, 573\\text{ K}} A \\xrightarrow{\\text{Tollens}} \\text{Silver mirror}$, and $A \\xrightarrow{\\text{OH}^-, \\Delta} Y$ (aldol), and $A + \\text{Semicarbazide} \\to Z$. Identify $A, X, Y, Z$:",
    optionA: "A: Methoxymethane, X: Ethanoic acid, Y: Acetate, Z: Hydrazine",
    optionB: "A: Methoxymethane, X: Ethanol, Y: Ethanoic acid, Z: Semicarbazide",
    optionC: "A: Ethanal, X: Ethanol, Y: But-2-enal, Z: Semicarbazone",
    optionD: "A: Ethanol, X: Acetaldehyde, Y: Butanone, Z: Hydrazone",
    correctOption: "C",
    explanation: "Ethanol (X) dehydrogenates over hot Cu to ethanal (A). Ethanal gives Tollens silver mirror, crotonaldehyde (Y) via aldol, and semicarbazone (Z)."
  },
  {
    subject: "Chemistry",
    questionText: "Which one represents the correct decreasing order of acidity of hydrocarbons?",
    optionA: "$\\text{CH}_2=\\text{CH}_2 > \\text{CH}_3\\text{CH}=\\text{CH}_2 > \\text{CH}_3\\text{C}\\equiv\\text{CH} > \\text{CH}\\equiv\\text{CH}$",
    optionB: "$\\text{CH}\\equiv\\text{CH} > \\text{CH}_3-\\text{C}\\equiv\\text{CH} > \\text{CH}_2=\\text{CH}_2 > \\text{CH}_3-\\text{CH}_3$ ($sp > sp^2 > sp^3$)",
    optionC: "$\\text{CH}\\equiv\\text{CH} > \\text{CH}_2=\\text{CH}_2 > \\text{CH}_3\\text{C}\\equiv\\text{CH} > \\text{CH}_3\\text{CH}_3$",
    optionD: "$\\text{CH}_3\\text{CH}_3 > \\text{CH}_2=\\text{CH}_2 > \\text{CH}_3\\text{C}\\equiv\\text{CH} > \\text{CH}\\equiv\\text{CH}$",
    correctOption: "B",
    explanation: "Terminal alkynes ($sp$ carbon with $50\\%$ s-character) are most acidic; ethyne ($pK_a \\sim 25$) is more acidic than propyne ($+I$ methyl)."
  },
  {
    subject: "Chemistry",
    questionText: "In Daniell cell: $\\text{Zn}|\\text{ZnSO}_4(0.01\\text{ M})||\\text{CuSO}_4(1.0\\text{ M})|\\text{Cu}$ ($E_1$). When concentrations change to $\\text{Zn}^{2+}(1.0\\text{ M})$ and $\\text{Cu}^{2+}(0.01\\text{ M})$ ($E_2$), relation is:",
    optionA: "$E_1 = E_2$",
    optionB: "$E_1 < E_2$",
    optionC: "$E_1 > E_2$",
    optionD: "$E_2 = 0 \\ne E_1$",
    correctOption: "C",
    explanation: "$E = E^\\circ - \\frac{0.059}{2}\\log\\frac{[\\text{Zn}^{2+}]}{[\\text{Cu}^{2+}]}$. In $E_1$, ratio is $0.01 \\implies E_1 = E^\\circ + 0.059$. In $E_2$, ratio is $100 \\implies E_2 = E^\\circ - 0.059 \\implies E_1 > E_2$."
  },
  {
    subject: "Chemistry",
    questionText: "The correct increasing order of basic strength of substituted anilines (I: Aniline, II: p-Nitroaniline, III: p-Toluidine) is:",
    optionA: "$\\text{II} < \\text{III} < \\text{I}$",
    optionB: "$\\text{III} < \\text{I} < \\text{II}$",
    optionC: "$\\text{III} < \\text{II} < \\text{I}$",
    optionD: "$\\text{II} < \\text{I} < \\text{III}$",
    correctOption: "D",
    explanation: "Electron-donating $-\\text{CH}_3$ increases basicity; electron-withdrawing $-\\text{NO}_2$ drastically decreases basicity: p-nitroaniline (II) < Aniline (I) < p-toluidine (III)."
  },
  {
    subject: "Chemistry",
    questionText: "In which pair of oxoanions do BOTH species contain a direct sulphur-sulphur ($S-S$) single bond?",
    optionA: "$\\text{S}_2\\text{O}_7^{2-}, \\text{S}_2\\text{O}_3^{2-}$",
    optionB: "$\\text{S}_4\\text{O}_6^{2-}, \\text{S}_2\\text{O}_3^{2-}$ (Tetrathionate and Thiosulphate)",
    optionC: "$\\text{S}_2\\text{O}_7^{2-}, \\text{S}_2\\text{O}_8^{2-}$",
    optionD: "$\\text{S}_4\\text{O}_6^{2-}, \\text{S}_2\\text{O}_7^{2-}$",
    correctOption: "B",
    explanation: "Thiosulphate $[\\text{S-SO}_3]^{2-}$ and tetrathionate $[\\text{O}_3\\text{S-S-S-SO}_3]^{2-}$ both feature direct S-S bonds."
  },
  {
    subject: "Chemistry",
    questionText: "Precipitated $\\text{AgCl}$ moles when excess $\\text{AgNO}_3$ is added to $1\\text{ mol}$ of $\\text{CoCl}_3\\cdot 6\\text{NH}_3, \\text{CoCl}_3\\cdot 5\\text{NH}_3, \\text{CoCl}_3\\cdot 4\\text{NH}_3$ are:",
    optionA: "$1\\text{ AgCl}, 3\\text{ AgCl}, 2\\text{ AgCl}$",
    optionB: "$3\\text{ AgCl}, 1\\text{ AgCl}, 2\\text{ AgCl}$",
    optionC: "$3\\text{ AgCl}, 2\\text{ AgCl}, 1\\text{ AgCl}$",
    optionD: "$2\\text{ AgCl}, 3\\text{ AgCl}, 1\\text{ AgCl}$",
    correctOption: "C",
    explanation: "Ionizable counter ions: $[\\text{Co(NH}_3)_6]\\text{Cl}_3 \\implies 3$, $[\\text{Co(NH}_3)_5\\text{Cl}]\\text{Cl}_2 \\implies 2$, $[\\text{Co(NH}_3)_4\\text{Cl}_2]\\text{Cl} \\implies 1\\text{ AgCl}$."
  },
  {
    subject: "Chemistry",
    questionText: "Match Interhalogen Compounds with Geometries:\n(a) $\\text{XX}'$, (b) $\\text{XX}_3$, (c) $\\text{XX}_5$, (d) $\\text{XX}_7$\n(i) T-shape, (ii) Pentagonal bipyramidal, (iii) Linear, (iv) Square-pyramidal\nChoose correct option:",
    optionA: "(a)-(iii), (b)-(iv), (c)-(i), (d)-(ii)",
    optionB: "(a)-(iii), (b)-(i), (c)-(iv), (d)-(ii)",
    optionC: "(a)-(v), (b)-(iv), (c)-(iii), (d)-(ii)",
    optionD: "(a)-(iv), (b)-(iii), (c)-(ii), (d)-(i)",
    correctOption: "B",
    explanation: "$\\text{XX}'$ = Linear (iii), $\\text{XX}_3$ = T-shape (i), $\\text{XX}_5$ = Square pyramidal (iv), $\\text{XX}_7$ = Pentagonal bipyramidal (ii)."
  },
  {
    subject: "Chemistry",
    questionText: "The reason for wider range of oxidation states exhibited by ACTINOIDS compared to lanthanoids is:",
    optionA: "Radioactive nature",
    optionB: "Actinoid contraction",
    optionC: "Comparable energy levels of $5f, 6d$ and $7s$ subshells",
    optionD: "$4f$ and $5d$ close in energy",
    correctOption: "C",
    explanation: "In actinoids, energy gap between $5f, 6d$, and $7s$ orbitals is very small, allowing participation of all in bonding."
  },
  {
    subject: "Chemistry",
    questionText: "A $20\\text{ L}$ container at $400\\text{ K}$ has $\\text{CO}_2$ at $0.4\\text{ atm}$ and excess $\\text{SrO}$. Max volume when $P_{\\text{CO}_2}$ reaches $K_p = 1.6\\text{ atm}$ is:",
    optionA: "$5\\text{ litres}$",
    optionB: "$10\\text{ litres}$",
    optionC: "$4\\text{ litres}$",
    optionD: "$2\\text{ litres}$",
    correctOption: "A",
    explanation: "Boyle's law at constant $T$: $P_1 V_1 = P_2 V_2 \\implies 0.4 \\times 20 = 1.6 \\times V_2 \\implies V_2 = \\frac{8}{1.6} = 5\\text{ litres}$."
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following is the CORRECT statement regarding an electrophile?",
    optionA: "Electrophile is negatively charged species",
    optionB: "Electrophile accepts electron pair from another electrophile",
    optionC: "Electrophiles are generally neutral species only",
    optionD: "Electrophile can be neutral ($\\text{BF}_3$) or positively charged ($^+\\text{NO}_2$) and accepts a lone pair from a nucleophile",
    correctOption: "D",
    explanation: "Electrophiles are electron-deficient Lewis acids (neutral or positive) that accept electron pairs."
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following acts as a primary atmospheric SINK for poisonous Carbon Monoxide ($\\text{CO}$)?",
    optionA: "Haemoglobin",
    optionB: "Microorganisms and bacteria present in soil",
    optionC: "Oceans",
    optionD: "Plants",
    correctOption: "B",
    explanation: "Soil bacteria (Methanosarcina, Pseudomonas) oxidise $\\text{CO}$ to $\\text{CO}_2$ or convert it to methane, acting as the major natural sink."
  },
  {
    subject: "Chemistry",
    questionText: "The superheavy element Flerovium ($Z = 114$) belongs to which chemical group and period configuration?",
    optionA: "Halogen family, $[\\text{Rn}] 5f^{14} 6d^{10} 7s^2 7p^5$",
    optionB: "Carbon family (Group 14), $[\\text{Rn}] 5f^{14} 6d^{10} 7s^2 7p^2$",
    optionC: "Oxygen family, $[\\text{Rn}] 5f^{14} 6d^{10} 7s^2 7p^4$",
    optionD: "Nitrogen family, $[\\text{Rn}] 5f^{14} 6d^{10} 7s^2 7p^6$",
    correctOption: "B",
    explanation: "Element 114 (Fl) lies below Lead in Group 14 (Carbon family) with valence configuration $7s^2 7p^2$."
  },
  {
    subject: "Chemistry",
    questionText: "Correct increasing order of wavelength of light absorbed in visible region for $\\text{Co}^{3+}$ complexes is:",
    optionA: "$[\\text{Co(en)}_3]^{3+} < [\\text{Co(NH}_3)_6]^{3+} < [\\text{Co(H}_2\\text{O})_6]^{3+}$",
    optionB: "$[\\text{Co(H}_2\\text{O})_6]^{3+} < [\\text{Co(en)}_3]^{3+} < [\\text{Co(NH}_3)_6]^{3+}$",
    optionC: "$[\\text{Co(H}_2\\text{O})_6]^{3+} < [\\text{Co(NH}_3)_6]^{3+} < [\\text{Co(en)}_3]^{3+}$",
    optionD: "$[\\text{Co(NH}_3)_6]^{3+} < [\\text{Co(en)}_3]^{3+} < [\\text{Co(H}_2\\text{O})_6]^{3+}$",
    correctOption: "A",
    explanation: "Ligand field strength: $\\text{en} > \\text{NH}_3 > \\text{H}_2\\text{O} \\implies \\Delta_o$ order: $\\text{en} > \\text{NH}_3 > \\text{H}_2\\text{O} \\implies \\lambda_{\\text{abs}} (\\propto 1/\\Delta_o)$ order: $[\\text{Co(en)}_3]^{3+} < [\\text{Co(NH}_3)_6]^{3+} < [\\text{Co(H}_2\\text{O})_6]^{3+}$."
  },
  {
    subject: "Chemistry",
    questionText: "Which statement regarding biomolecules is NOT correct?",
    optionA: "Insulin maintains blood glucose level",
    optionB: "Ovalbumin is a storage protein in egg-white",
    optionC: "Thrombin and fibrinogen are involved in blood clotting",
    optionD: "Denaturation makes proteins more active (Denaturation destroys biological activity)",
    correctOption: "D",
    explanation: "Denaturation disrupts secondary and tertiary protein folding, resulting in complete loss of biological activity."
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following is a $\\sigma$-bonded organometallic compound?",
    optionA: "Ruthenocene ($\\pi$-complex)",
    optionB: "Grignard's reagent ($\\text{R-Mg-X}$ with C-Mg $\\sigma$-bond)",
    optionC: "Ferrocene ($\\pi$-complex)",
    optionD: "Cobaltocene ($\\pi$-complex)",
    correctOption: "B",
    explanation: "Grignard reagents ($\\text{R-Mg-X}$) feature localized carbon-magnesium $\\sigma$-bonds."
  },
  {
    subject: "Chemistry",
    questionText: "Which concentration unit depends on TEMPERATURE?",
    optionA: "Molality",
    optionB: "Molarity (moles/Litre of solution)",
    optionC: "Mole fraction",
    optionD: "Weight percentage",
    correctOption: "B",
    explanation: "Molarity involves solution volume, which expands or contracts with temperature variations."
  },
  {
    subject: "Chemistry",
    questionText: "For a reaction $\\Delta H = +35.5\\text{ kJ/mol}$ and $\\Delta S = +83.6\\text{ J K}^{-1}\\text{mol}^{-1}$. Spontaneous temperature range is:",
    optionA: "$T < 425\\text{ K}$",
    optionB: "$T > 425\\text{ K}$",
    optionC: "All temperatures",
    optionD: "$T > 298\\text{ K}$",
    correctOption: "B",
    explanation: "$\\Delta G = \\Delta H - T\\Delta S < 0 \\implies T > \\frac{\\Delta H}{\\Delta S} = \\frac{35500}{83.6} = 424.6\\text{ K} \\approx 425\\text{ K}$."
  },
  {
    subject: "Chemistry",
    questionText: "The most suitable method of separation of a $1:1$ mixture of ortho- and para-nitrophenols is:",
    optionA: "Sublimation",
    optionB: "Chromatography",
    optionC: "Crystallisation",
    optionD: "Steam distillation (o-nitrophenol is steam-volatile due to intramolecular H-bonding)",
    correctOption: "D",
    explanation: "Intramolecular H-bonding in o-nitrophenol makes it steam volatile; p-nitrophenol has intermolecular H-bonding and remains in flask."
  },
  {
    subject: "Chemistry",
    questionText: "Which pair of chemical species has the SAME bond order?",
    optionA: "$\\text{CO, NO}$",
    optionB: "$\\text{O}_2, \\text{NO}^+$",
    optionC: "$\\text{CN}^-, \\text{CO}$ (Both 14 electrons $\\implies$ Bond order = 3.0)",
    optionD: "$\\text{N}_2, \\text{O}_2^-$",
    correctOption: "C",
    explanation: "Both $\\text{CN}^-$ and $\\text{CO}$ possess 14 valence electrons (isoelectronic) and have bond order 3.0."
  },
  {
    subject: "Chemistry",
    questionText: "Reaction of 3-bromoanisole with $\\text{NaNH}_2 / \\text{liquid NH}_3$ gives product A via:",
    optionA: "2-Methoxyaniline via nucleophilic substitution",
    optionB: "3-Methoxyaniline via Benzyne elimination-addition mechanism",
    optionC: "Bromination cine substitution",
    optionD: "Reduction",
    correctOption: "A",
    explanation: "Strong base $\\text{NaNH}_2$ abstracts proton to form benzyne intermediate followed by $\\text{NH}_2^-$ addition (Official key: 1 / 2)."
  },
  {
    subject: "Chemistry",
    questionText: "First order reaction rate constant is $10^{-2}\\text{ s}^{-1}$. Time required to reduce $20\\text{ g}$ reactant to $5\\text{ g}$ ($2\\text{ half-lives}$) is:",
    optionA: "$238.6\\text{ s}$",
    optionB: "$138.6\\text{ s}$",
    optionC: "$346.5\\text{ s}$",
    optionD: "$693.0\\text{ s}$",
    correctOption: "B",
    explanation: "$t = \\frac{2.303}{k}\\log\\left(\\frac{20}{5}\\right) = \\frac{2.303 \\times 0.602}{10^{-2}} = 138.6\\text{ s}$."
  },
  {
    subject: "Chemistry",
    questionText: "Which reducing gas readily decolourises pink acidified potassium permanganate ($\\text{KMnO}_4$) solution?",
    optionA: "$\\text{CO}_2$",
    optionB: "$\\text{SO}_2$ (Sulphur dioxide)",
    optionC: "$\\text{NO}_2$",
    optionD: "$\\text{P}_2\\text{O}_5$",
    correctOption: "B",
    explanation: "$\\text{SO}_2$ reduces purple $\\text{MnO}_4^-$ ($+7$) to colourless $\\text{Mn}^{2+}$: $2\\text{MnO}_4^- + 5\\text{SO}_2 + 2\\text{H}_2\\text{O} \\to 2\\text{Mn}^{2+} + 5\\text{SO}_4^{2-} + 4\\text{H}^+$."
  },
  {
    subject: "Chemistry",
    questionText: "Heating of phenyl methyl ether (anisole) with concentrated $\\text{HI}$ produces:",
    optionA: "Ethyl chloride",
    optionB: "Iodobenzene",
    optionC: "Phenol and Iodomethane ($\\text{C}_6\\text{H}_5\\text{OH} + \\text{CH}_3\\text{I}$)",
    optionD: "Benzene",
    correctOption: "C",
    explanation: "Protonated anisole undergoes $S_N2$ attack by iodide ion on methyl group, producing phenol and methyl iodide."
  },
  {
    subject: "Chemistry",
    questionText: "Electronic configuration and geometry of $[\\text{Mn(CN)}_6]^{3-}$ ($d^4$, strong field $\\text{CN}^-$) are:",
    optionA: "$sp^3d^2$ and octahedral",
    optionB: "$sp^3d^2$ and tetrahedral",
    optionC: "$d^2sp^3$ hybridised inner orbital complex and octahedral",
    optionD: "$dsp^2$ and square planar",
    correctOption: "C",
    explanation: "$\\text{CN}^-$ pairs 2 of the 4 $d$-electrons, leaving two vacant $3d$ orbitals for $d^2sp^3$ octahedral hybridisation."
  },
  {
    subject: "Chemistry",
    questionText: "Ionic mobility in aqueous solution under electric field is LOWEST for which alkali metal ion?",
    optionA: "$\\text{Na}^+$",
    optionB: "$\\text{K}^+$",
    optionC: "$\\text{Rb}^+$",
    optionD: "$\\text{Li}^+$ (Heaviest hydrated radius $[\\text{Li(H}_2\\text{O})_n]^+$)",
    correctOption: "D",
    explanation: "$\\text{Li}^+$ has highest charge density and largest hydrated ionic radius, moving slowest in aqueous solution."
  },
  {
    subject: "Chemistry",
    questionText: "Equilibrium constants: $N_2 + 3H_2 \\rightleftharpoons 2NH_3 (K_1)$, $N_2 + O_2 \\rightleftharpoons 2NO (K_2)$, $H_2 + \\frac{1}{2}O_2 \\rightleftharpoons H_2O (K_3)$. $K$ for $2NH_3 + \\frac{5}{2}O_2 \\rightleftharpoons 2NO + 3H_2O$ is:",
    optionA: "$K_1 K_3^3 / K_2$",
    optionB: "$\\frac{K_2 K_3^3}{K_1}$",
    optionC: "$K_2 K_3 / K_1$",
    optionD: "$K_2^3 K_3 / K_1$",
    correctOption: "B",
    explanation: "Reversing reaction 1, taking reaction 2, and $3 \\times$ reaction 3 gives: $K = \\frac{K_2 K_3^3}{K_1}$."
  },
  {
    subject: "Chemistry",
    questionText: "Which degradation reaction is appropriate for converting acetamide ($\\text{CH}_3\\text{CONH}_2$) to methanamine ($\\text{CH}_3\\text{NH}_2$)?",
    optionA: "Carbylamine reaction",
    optionB: "Hoffmann bromamide degradation reaction ($\\text{Br}_2 + \\text{KOH}$)",
    optionC: "Stephen's reduction",
    optionD: "Gabriel phthalimide synthesis",
    correctOption: "B",
    explanation: "Hoffmann bromamide reaction steps down primary amides to amines containing one less carbon atom."
  },
  {
    subject: "Chemistry",
    questionText: "Mechanism: (i) $X_2 \\rightleftharpoons 2X$ (fast), (ii) $X + Y_2 \\to XY + Y$ (slow), (iii) $X + Y \\to XY$ (fast). Overall reaction order is:",
    optionA: "1",
    optionB: "2",
    optionC: "0",
    optionD: "1.5 ($3/2$ order)",
    correctOption: "D",
    explanation: "$\\text{Rate} = k[X][Y_2]$. From equilibrium, $[X] = K^{1/2}[X_2]^{1/2} \\implies \\text{Rate} = k'[X_2]^{1/2}[Y_2]^1 \\implies \\text{Order} = 0.5 + 1 = 1.5$."
  },
  {
    subject: "Chemistry",
    questionText: "The correct IUPAC name for $\\text{OHC}-\\text{CH}=\\text{CH}-\\text{CO}-\\text{CH}(\\text{CH}_3)_2$ is:",
    optionA: "3-Keto-2-methylhex-4-enal",
    optionB: "5-Formylhex-2-en-3-one",
    optionC: "5-Methyl-4-oxohex-2-en-1-al",
    optionD: "3-Keto-2-methylhex-5-enal",
    correctOption: "C",
    explanation: "Principal functional group is aldehyde $-\\text{CHO}$ at C1, double bond at C2, ketone $(=O)$ at C4, methyl at C5: 5-methyl-4-oxohex-2-en-1-al (Official key: 1)."
  },
  {
    subject: "Chemistry",
    questionText: "In Mac-Arthur Forest cyanide leaching of silver ore, silver is displaced and precipitated from $[\text{Ag(CN)}_2]^-$ using:",
    optionA: "Liquation",
    optionB: "Distillation",
    optionC: "Zone refining",
    optionD: "Displacement with Zinc powder ($2[\\text{Ag(CN)}_2]^- + \\text{Zn} \\to [\\text{Zn(CN)}_4]^{2-} + 2\\text{Ag}$)",
    correctOption: "D",
    explanation: "Zinc is more electropositive than silver and reduces $\\text{Ag}^+$ to native silver metal."
  },

  // -------------------------------------------------------------
  // BIOLOGY (Q91 - Q180)
  // -------------------------------------------------------------
  {
    subject: "Biology",
    questionText: "Double fertilization is a unique diagnostic reproductive feature of:",
    optionA: "Gymnosperms",
    optionB: "Algae",
    optionC: "Fungi",
    optionD: "Angiosperms (Flowering plants)",
    correctOption: "D",
    explanation: "Double fertilization (syngamy + triple fusion) is unique to flowering angiosperms."
  },
  {
    subject: "Biology",
    questionText: "Which of the following prokaryotes thrive in extreme hypersaline environments (salt pans)?",
    optionA: "Halophilic Archaebacteria",
    optionB: "Eubacteria",
    optionC: "Cyanobacteria",
    optionD: "Mycobacteria",
    correctOption: "A",
    explanation: "Halophiles belonging to domain Archaebacteria possess branched ether lipids in cell membranes."
  },
  {
    subject: "Biology",
    questionText: "Select the MISMATCHED symbiotic nitrogen-fixing association:",
    optionA: "Frankia - Alnus",
    optionB: "Rhodospirillum - Mycorrhiza (Rhodospirillum is free-living anaerobic bacterium, not mycorrhiza)",
    optionC: "Anabaena - Nitrogen fixer",
    optionD: "Rhizobium - Alfalfa",
    correctOption: "B",
    explanation: "Mycorrhiza is a symbiotic fungal association with plant roots; Rhodospirillum is an anaerobic bacterium."
  },
  {
    subject: "Biology",
    questionText: "What is the physical basis of separation of DNA fragments on an agarose gel during electrophoresis?",
    optionA: "Larger fragments move farther",
    optionB: "Smaller the DNA fragment size, the farther it migrates through sieving matrix",
    optionC: "Positively charged fragments move to anode",
    optionD: "Fragments do not move",
    correctOption: "B",
    explanation: "Agarose gel acts as a molecular sieve; smaller negatively charged DNA fragments migrate faster towards the anode."
  },
  {
    subject: "Biology",
    questionText: "Floral attractants (scent/colour) and nectar rewards are indispensable for:",
    optionA: "Anemophily (Wind pollination)",
    optionB: "Entomophily (Insect pollination)",
    optionC: "Hydrophily",
    optionD: "Cleistogamy",
    correctOption: "B",
    explanation: "Insect-pollinated flowers provide visual petals, fragrance, nectar, and pollen rewards to attract pollinators."
  },
  {
    subject: "Biology",
    questionText: "Which of the following plant tissues is made up of DEAD cells at functional maturity?",
    optionA: "Xylem parenchyma",
    optionB: "Collenchyma",
    optionC: "Phellem (Cork with suberized dead walls)",
    optionD: "Phloem",
    correctOption: "C",
    explanation: "Cork (Phellem) cells are dead and impermeable to water due to suberin deposition."
  },
  {
    subject: "Biology",
    questionText: "Which specialized cells of the Crypts of Lieberkühn secrete antibacterial lysozyme?",
    optionA: "Argentaffin cells",
    optionB: "Paneth cells",
    optionC: "Zymogen cells",
    optionD: "Kupffer cells",
    correctOption: "B",
    explanation: "Paneth cells located at the base of intestinal crypts secrete lysozyme and defensins to maintain gut flora."
  },
  {
    subject: "Biology",
    questionText: "Adult human erythrocytes (RBCs) are enucleate primarily because:",
    optionA: "They do not need to reproduce",
    optionB: "They are somatic cells",
    optionC: "They do not metabolize",
    optionD: "All internal space is made available for hemoglobin and oxygen transport",
    correctOption: "A",
    explanation: "Enucleation maximizes internal volume for packaging hemoglobin and gas exchange (Official key: 1 / only d)."
  },
  {
    subject: "Biology",
    questionText: "The Hepatic Portal Vein transports nutrient-rich deoxygenated blood directly to liver from the:",
    optionA: "Heart",
    optionB: "Stomach",
    optionC: "Kidneys",
    optionD: "Intestine (Digestive tract)",
    correctOption: "D",
    explanation: "Hepatic portal system carries absorbed nutrients from stomach and intestines to the liver."
  },
  {
    subject: "Biology",
    questionText: "Unequivocal final experimental proof that DNA is the genetic material came from:",
    optionA: "Griffith (Transforming principle)",
    optionB: "Alfred Hershey and Martha Chase (Bacteriophage T2 blender experiment 1952)",
    optionC: "Avery, MacLeod and McCarty",
    optionD: "Hargobind Khorana",
    correctOption: "B",
    explanation: "Hershey and Chase used radioactive $^{35}\\text{S}$ and $^{32}\\text{P}$ to prove viral DNA enters host cells."
  },
  {
    subject: "Biology",
    questionText: "Smallest living cells known without a cell wall, pathogenic to plants/animals, and surviving without oxygen are:",
    optionA: "Bacillus",
    optionB: "Pseudomonas",
    optionC: "Mycoplasma (PPLO)",
    optionD: "Nostoc",
    correctOption: "C",
    explanation: "Mycoplasmas lack peptidoglycan cell walls, are resistant to penicillin, and can survive anaerobically."
  },
  {
    subject: "Biology",
    questionText: "Which sequence correctly represents the orderly stages of Mitosis?",
    optionA: "Condensation $\\to$ Nuclear disassembly $\\to$ Crossing over $\\to$ Telophase",
    optionB: "Chromatin condensation $\\to$ Nuclear membrane disassembly $\\to$ Equatorial arrangement (metaphase) $\\to$ Centromere division $\\to$ Segregation (anaphase) $\\to$ Telophase",
    optionC: "Condensation $\\to$ Crossing over $\\to$ Segregation",
    optionD: "Condensation $\\to$ Metaphase $\\to$ Anaphase $\\to$ Telophase",
    correctOption: "B",
    explanation: "Mitotic sequence: Prophase (condensation) $\\to$ Metaphase (equator) $\\to$ Anaphase (centromere split) $\\to$ Telophase."
  },
  {
    subject: "Biology",
    questionText: "Which equation correctly defines an active Holoenzyme?",
    optionA: "Apoenzyme = Holoenzyme + Coenzyme",
    optionB: "Holoenzyme (Active conjugated enzyme) = Apoenzyme (Protein) + Coenzyme (Cofactor)",
    optionC: "Coenzyme = Apoenzyme + Holoenzyme",
    optionD: "Holoenzyme = Coenzyme + Cofactor",
    correctOption: "B",
    explanation: "A holoenzyme is the complete, catalytically active enzyme system composed of protein apoenzyme and non-protein cofactor."
  },
  {
    subject: "Biology",
    questionText: "During DNA replication, discontinuous Okazaki fragments are synthesized to elongate:",
    optionA: "Leading strand towards replication fork",
    optionB: "Lagging strand towards replication fork",
    optionC: "Leading strand away from fork",
    optionD: "The lagging template strand away from the replication fork ($5' \\to 3'$ synthesis)",
    correctOption: "D",
    explanation: "Because DNA polymerase operates only $5' \\to 3'$, the lagging strand is synthesized discontinuously away from fork."
  },
  {
    subject: "Biology",
    questionText: "Which of the following biological macromolecules is NOT a true polymer?",
    optionA: "Nucleic acids",
    optionB: "Proteins",
    optionC: "Polysaccharides",
    optionD: "Lipids (Molecular weight $<800\\text{ Da}$)",
    correctOption: "D",
    explanation: "Lipids are esters of fatty acids and glycerol, not repetitive macromolecular polymers."
  },
  {
    subject: "Biology",
    questionText: "The strictly protected, undisturbed inner core region of a Biosphere Reserve where no human activity is allowed is:",
    optionA: "Core zone",
    optionB: "Buffer zone",
    optionC: "Transition zone",
    optionD: "Restoration zone",
    correctOption: "A",
    explanation: "Core zone is legally protected from all anthropogenic disturbance to preserve pristine wildlife ecosystems."
  },
  {
    subject: "Biology",
    questionText: "A dioecious flowering plant species (male and female flowers on separate individuals like Papaya) prevents:",
    optionA: "Autogamy and xenogamy",
    optionB: "Both Autogamy and Geitonogamy",
    optionC: "Geitonogamy and xenogamy",
    optionD: "Cleistogamy and xenogamy",
    correctOption: "B",
    explanation: "Dioecy guarantees that autogamy (within same flower) and geitonogamy (between flowers on same plant) are both prevented."
  },
  {
    subject: "Biology",
    questionText: "A temporary endocrine gland formed in the human ovary after ovulation is:",
    optionA: "Pineal gland",
    optionB: "Corpus cardiacum",
    optionC: "Corpus luteum (secretes Progesterone)",
    optionD: "Corpus allatum",
    correctOption: "C",
    explanation: "Ruptured Graafian follicle transforms into yellow luteal tissue (corpus luteum) secreting progesterone."
  },
  {
    subject: "Biology",
    questionText: "Match Sexually Transmitted Diseases with Causative Pathogens:\n(a) Gonorrhoea, (b) Syphilis, (c) Genital Warts, (d) AIDS\n(i) HIV, (ii) Neisseria gonorrhoeae, (iii) Treponema pallidum, (iv) Human Papilloma Virus (HPV)\nChoose correct option:",
    optionA: "(a)-(ii), (b)-(iii), (c)-(iv), (d)-(i)",
    optionB: "(a)-(iii), (b)-(iv), (c)-(i), (d)-(ii)",
    optionC: "(a)-(iv), (b)-(ii), (c)-(iii), (d)-(i)",
    optionD: "(a)-(iv), (b)-(iii), (c)-(ii), (d)-(i)",
    correctOption: "A",
    explanation: "Gonorrhoea = Neisseria (ii), Syphilis = Treponema (iii), Warts = HPV (iv), AIDS = HIV (i)."
  },
  {
    subject: "Biology",
    questionText: "Rejection of allograft organ transplant by recipient immune system is primarily mediated by:",
    optionA: "Autoimmune response",
    optionB: "Cell-mediated immune response (T-lymphocytes)",
    optionC: "Hormonal immune response",
    optionD: "Physiological response",
    correctOption: "B",
    explanation: "Cytotoxic T-cells identify foreign HLA major histocompatibility antigens and initiate graft rejection."
  },
  {
    subject: "Biology",
    questionText: "Spliceosomes (snRNPs involved in eukaryotic intron removal) are NOT found in:",
    optionA: "Plants",
    optionB: "Fungi",
    optionC: "Animals",
    optionD: "Bacteria (Prokaryotes lack split genes and introns)",
    correctOption: "D",
    explanation: "Prokaryotic genes lack non-coding introns and post-transcriptional splicing machinery."
  },
  {
    subject: "Biology",
    questionText: "An example of a colonial freshwater green alga is:",
    optionA: "Chlorella",
    optionB: "Volvox (Coenobium colony)",
    optionC: "Ulothrix",
    optionD: "Spirogyra",
    correctOption: "B",
    explanation: "Volvox forms motile spherical colonies (coenobia) containing thousands of flagellated cells."
  },
  {
    subject: "Biology",
    questionText: "Which taxonomic rank represents the ORDER of Horse (Equus caballus)?",
    optionA: "Equidae (Family)",
    optionB: "Perissodactyla (Odd-toed ungulate Order)",
    optionC: "Caballus (Species)",
    optionD: "Ferus",
    correctOption: "B",
    explanation: "Horses belong to Order Perissodactyla, Family Equidae, Genus Equus."
  },
  {
    subject: "Biology",
    questionText: "Which eukaryotic organelle extracts energy from respiratory carbohydrates and synthesizes ATP?",
    optionA: "Lysosome",
    optionB: "Ribosome",
    optionC: "Chloroplast",
    optionD: "Mitochondrion (Powerhouse of the cell)",
    correctOption: "D",
    explanation: "Mitochondria perform Krebs cycle and oxidative phosphorylation to produce cellular ATP."
  },
  {
    subject: "Biology",
    questionText: "The post-fermentation separation and purification of recombinant therapeutic proteins before marketing is:",
    optionA: "Upstream processing",
    optionB: "Downstream processing",
    optionC: "Bioprocessing",
    optionD: "Postproduction processing",
    correctOption: "B",
    explanation: "Downstream processing comprises product recovery, isolation, purification, and quality preservation."
  },
  {
    subject: "Biology",
    questionText: "Mycorrhizae (fungal hyphae associated with higher plant roots) is an example of:",
    optionA: "Fungistasis",
    optionB: "Amensalism",
    optionC: "Antibiosis",
    optionD: "Mutualism ($+/+$ interaction)",
    correctOption: "D",
    explanation: "Fungus absorbs phosphorus and water while plant provides photosynthesized carbohydrates."
  },
  {
    subject: "Biology",
    questionText: "Viroids differ from plant Viruses in possessing:",
    optionA: "DNA with protein coat",
    optionB: "DNA without protein coat",
    optionC: "RNA with protein coat",
    optionD: "Infectious low MW RNA molecules WITHOUT a protein capsid",
    correctOption: "D",
    explanation: "Viroids are circular single-stranded naked RNA molecules without a protective protein coat."
  },
  {
    subject: "Biology",
    questionText: "Unicellular tubular root hairs develop from which anatomical zone of the root tip?",
    optionA: "Zone of Maturation / Differentiation",
    optionB: "Zone of Elongation",
    optionC: "Root cap",
    optionD: "Meristematic zone",
    correctOption: "A",
    explanation: "Epidermal cells in the maturation zone differentiate into absorbing root hairs."
  },
  {
    subject: "Biology",
    questionText: "Morphologically, the fleshy fibrous fruit of Coconut (Cocos nucifera) is a:",
    optionA: "Drupe (Stone fruit)",
    optionB: "Berry",
    optionC: "Nut",
    optionD: "Capsule",
    correctOption: "A",
    explanation: "Coconut is a drupe with thin exocarp, fibrous mesocarp (coir), and stony endocarp enclosing edible endosperm."
  },
  {
    subject: "Biology",
    questionText: "Mangrove plants producing respiratory pneumatophores and showing seed vivipary belong to:",
    optionA: "Mesophytes",
    optionB: "Halophytes (Saline swamp plants)",
    optionC: "Psammophytes",
    optionD: "Hydrophytes",
    correctOption: "B",
    explanation: "Halophytes (Rhizophora) adapt to anoxic saline swamps with aerating roots and viviparous germination."
  },
  {
    subject: "Biology",
    questionText: "Which of the following is an EX-SITU conservation facility for endangered animals?",
    optionA: "Wildlife Safari parks / Zoological parks",
    optionB: "Biodiversity hotspots",
    optionC: "Amazon rainforest",
    optionD: "Himalayan region",
    correctOption: "A",
    explanation: "Wildlife safari parks care for threatened species outside their natural habitat under human management."
  },
  {
    subject: "Biology",
    questionText: "Select the MISMATCHED gymnosperm/pteridophyte sexuality pair:",
    optionA: "Pinus - Dioecious (Pinus is Monoecious)",
    optionB: "Cycas - Dioecious",
    optionC: "Salvinia - Heterosporous",
    optionD: "Equisetum - Homosporous",
    correctOption: "A",
    explanation: "Pinus is monoecious (male and female cones on same tree); Cycas is dioecious."
  },
  {
    subject: "Biology",
    questionText: "Opening of the stomatal pore is facilitated by:",
    optionA: "Contraction of outer wall",
    optionB: "Decrease in turgidity",
    optionC: "Radial orientation of cellulose microfibrils in guard cell walls",
    optionD: "Longitudinal orientation of microfibrils",
    correctOption: "C",
    explanation: "Radially arranged cellulose microfibrils pull the inner thick walls apart when guard cells become turgid."
  },
  {
    subject: "Biology",
    questionText: "The association of linker Histone H1 with the nucleosome bead indicates:",
    optionA: "Transcription is actively occurring",
    optionB: "DNA replication is occurring",
    optionC: "DNA is condensed and coiled into a 30 nm Chromatin Solenoid Fibre",
    optionD: "DNA double helix is naked",
    correctOption: "C",
    explanation: "Histone H1 seals the DNA exit/entry point on nucleosome core, promoting higher-order chromatin condensation."
  },
  {
    subject: "Biology",
    questionText: "In aqueous buffer solutions at neutral pH, DNA fragments carry:",
    optionA: "Positive charges",
    optionB: "Net negative charge (due to acidic phosphate groups in backbone)",
    optionC: "Neutral charge",
    optionD: "Variable charge",
    correctOption: "B",
    explanation: "Ionized phosphodiester backbones impart uniform negative charge to all DNA molecules."
  },
  {
    subject: "Biology",
    questionText: "Sperm Capacitation (physiological maturation acquiring fertilizing ability) occurs in:",
    optionA: "Rete testis",
    optionB: "Epididymis",
    optionC: "Vas deferens",
    optionD: "Female reproductive tract (Uterus and Fallopian tubes)",
    correctOption: "D",
    explanation: "Secretions of female tract wash off decapacitation factors from sperm membrane, allowing acrosome activation."
  },
  {
    subject: "Biology",
    questionText: "Which natural ecosystem holds the MAXIMUM total standing biomass on Earth?",
    optionA: "Forest ecosystem (Tropical rainforests)",
    optionB: "Grassland ecosystem",
    optionC: "Pond ecosystem",
    optionD: "Lake ecosystem",
    correctOption: "A",
    explanation: "Forests store the largest standing biomass due to massive perennial woody trees."
  },
  {
    subject: "Biology",
    questionText: "A chromosomal disease caused by autosomal primary non-disjunction of chromosome 21 is:",
    optionA: "Down's Syndrome (Trisomy 21)",
    optionB: "Klinefelter's Syndrome ($47, \\text{XXY}$)",
    optionC: "Turner's Syndrome ($45, \\text{XO}$)",
    optionD: "Sickle Cell Anemia",
    correctOption: "A",
    explanation: "Meiotic non-disjunction of maternal 21st chromosome leads to Down's syndrome ($2n+1=47$)."
  },
  {
    subject: "Biology",
    questionText: "Life cycle patterns of Ectocarpus (brown alga) and Fucus (rockweed) are respectively:",
    optionA: "Haplontic, Diplontic",
    optionB: "Diplontic, Haplodiplontic",
    optionC: "Haplodiplontic and Diplontic",
    optionD: "Haplodiplontic, Haplontic",
    correctOption: "C",
    explanation: "Ectocarpus is haplo-diplontic (alternation of isomorphic generations); Fucus exhibits a diplontic life cycle."
  },
  {
    subject: "Biology",
    questionText: "If an mRNA has 999 bases coding 333 amino acids, and base at position 901 is deleted, how many codons are altered?",
    optionA: "1",
    optionB: "11",
    optionC: "33 codons (from codon 301 to 333)",
    optionD: "333",
    correctOption: "C",
    explanation: "Position 901 begins codon 301. All remaining codons from 301 to 333 ($333 - 301 + 1 = 33$) undergo frameshift mutation."
  },
  {
    subject: "Biology",
    questionText: "The pivot joint between the first cervical vertebra (Atlas) and second (Axis) is a:",
    optionA: "Fibrous joint",
    optionB: "Cartilaginous joint",
    optionC: "Synovial joint (Rotational pivot joint)",
    optionD: "Saddle joint",
    correctOption: "C",
    explanation: "Atlanto-axial joint is a synovial pivot joint permitting 'no' head rotation."
  },
  {
    subject: "Biology",
    questionText: "A gene whose expression allows selection and differentiation of recombinant transformed host cells is a:",
    optionA: "Selectable marker ($amp^R, tet^R$)",
    optionB: "Vector",
    optionC: "Plasmid",
    optionD: "Structural gene",
    correctOption: "A",
    explanation: "Selectable markers confer antibiotic resistance, enabling selection of transformed colonies."
  },
  {
    subject: "Biology",
    questionText: "Presence of distinct vertical stratification layers (canopy, understory, shrubs, herbs) is best seen in:",
    optionA: "Tropical Savannah",
    optionB: "Tropical Rain Forest",
    optionC: "Grassland",
    optionD: "Temperate Forest",
    correctOption: "B",
    explanation: "Tropical rain forests exhibit the most pronounced multi-tiered vertical canopy stratification."
  },
  {
    subject: "Biology",
    questionText: "If husband is $I^A I^B$ and wife is $I^A i$, how many different genotypes and phenotypes are possible in children?",
    optionA: "3 genotypes ; 3 phenotypes",
    optionB: "3 genotypes ; 4 phenotypes",
    optionC: "4 genotypes ($I^A I^A, I^A i, I^A I^B, I^B i$) and 3 phenotypes (A, AB, B)",
    optionD: "4 genotypes ; 4 phenotypes",
    correctOption: "C",
    explanation: "Punnett cross produces 4 genotypes ($I^A I^A, I^A i, I^A I^B, I^B i$) expressing 3 blood phenotypes (A, AB, B)."
  },
  {
    subject: "Biology",
    questionText: "Zygotic meiosis (haplontic life cycle with dominant free gametophyte) is characteristic of:",
    optionA: "Marchantia (Bryophyte)",
    optionB: "Fucus",
    optionC: "Funaria",
    optionD: "Chlamydomonas (Green alga)",
    correctOption: "D",
    explanation: "In Chlamydomonas, zygote ($2n$) undergoes meiosis immediately upon germination."
  },
  {
    subject: "Biology",
    questionText: "Which organism is correctly matched with its commercial fermentation product?",
    optionA: "Acetobacter aceti : Antibiotics",
    optionB: "Methanobacterium : Lactic acid",
    optionC: "Penicillium notatum : Acetic acid",
    optionD: "Saccharomyces cerevisiae : Ethanol (Brewing)",
    correctOption: "D",
    explanation: "Brewer's yeast (Saccharomyces cerevisiae) ferments sugars into ethanol and $\\text{CO}_2$."
  },
  {
    subject: "Biology",
    questionText: "A frog's excised heart continues beating for some time because:\n(a) Frog is poikilotherm\n(b) Lacks coronary circulation\n(c) Heart is myogenic\n(d) Heart is autoexcitable\nChoose correct option:",
    optionA: "Only (c)",
    optionB: "Only (d)",
    optionC: "(a) and (b)",
    optionD: "(c) and (d)",
    correctOption: "D",
    explanation: "Vertebrate cardiac muscle is myogenic and possesses intrinsic nodal auto-rhythmicity."
  },
  {
    subject: "Biology",
    questionText: "Which statement about the Citric Acid (Krebs) cycle is WRONG?",
    optionA: "Three steps reduce $\\text{NAD}^+$ to $\\text{NADH}+\\text{H}^+$",
    optionB: "One step reduces $\\text{FAD}^+$ to $\\text{FADH}_2$",
    optionC: "Conversion of succinyl-CoA to succinate generates 1 GTP",
    optionD: "The cycle starts by condensing acetyl-CoA with pyruvic acid (Condenses with Oxaloacetic acid / OAA)",
    correctOption: "D",
    explanation: "Krebs cycle initiates with condensation of Acetyl-CoA (2C) with Oxaloacetate (4C) to form Citrate (6C)."
  },
  {
    subject: "Biology",
    questionText: "In Sponges (Porifera), the central spongocoel cavity is lined with flagellated collar cells called:",
    optionA: "Ostia",
    optionB: "Oscula",
    optionC: "Choanocytes (Collar cells)",
    optionD: "Mesenchymal cells",
    correctOption: "C",
    explanation: "Choanocytes line the spongocoel and radial canals to maintain water current and filter nutrients."
  },
  {
    subject: "Biology",
    questionText: "Which class of RNA is the MOST ABUNDANT in a eukaryotic animal cell ($~80\\%$ of total cellular RNA)?",
    optionA: "r-RNA (Ribosomal RNA)",
    optionB: "t-RNA",
    optionC: "m-RNA",
    optionD: "mi-RNA",
    correctOption: "A",
    explanation: "Ribosomal RNA (rRNA) constitutes $80-85\\%$ of all cellular RNA."
  },
  {
    subject: "Biology",
    questionText: "Which of the following is a correct grouping of true AQUATIC MAMMALS?",
    optionA: "Seals, Dolphins, Sharks (Shark is Chondrichthyes fish)",
    optionB: "Dolphins, Seals, Trygon (Trygon is stingray fish)",
    optionC: "Whales, Dolphins, Seals (Order Cetacea & Pinnipedia)",
    optionD: "Trygon, Whales, Seals",
    correctOption: "C",
    explanation: "Whales, Dolphins, and Seals are warm-blooded air-breathing placental mammals adapted to marine life."
  },
  {
    subject: "Biology",
    questionText: "Which statement regarding factors affecting photosynthesis is INCORRECT?",
    optionA: "Light saturation for $\\text{CO}_2$ fixation occurs at $10\\%$ of full sunlight",
    optionB: "Increasing atmospheric $\\text{CO}_2$ up to $0.05\\%$ enhances productivity",
    optionC: "$\\text{C}_3$ plants have higher temperature optimum than $\\text{C}_4$ plants ($\\text{C}_4$ plants have higher temperature optimum $30-45^\\circ\\text{C}$)",
    optionD: "Tomato is grown in greenhouse $\\text{CO}_2$ enrichment",
    correctOption: "C",
    explanation: "$\\text{C}_4$ plants adapted to tropical regions have higher temperature optimum than temperate $\\text{C}_3$ plants."
  },
  {
    subject: "Biology",
    questionText: "In a logistic population growth curve ($dN/dt = rN(1 - N/K)$), the ASYMPTOTE carrying capacity plateau is reached when:",
    optionA: "Intrinsic rate '$r$' approaches zero",
    optionB: "$K = N$ (Population density equals carrying capacity)",
    optionC: "$K > N$",
    optionD: "$K < N$",
    correctOption: "B",
    explanation: "When population size $N$ equals environmental carrying capacity $K$, $(1 - N/K) = 0$ and growth rate becomes zero."
  },
  {
    subject: "Biology",
    questionText: "Out of 12 pairs of ribs in human thorax, exactly 7 pairs are TRUE ribs because:",
    optionA: "$X = 12, Y = 7$; True ribs attach dorsally to thoracic vertebrae and ventrally to sternum via hyaline cartilage",
    optionB: "$X = 12, Y = 5$",
    optionC: "$X = 24, Y = 7$",
    optionD: "$X = 24, Y = 12$",
    correctOption: "A",
    explanation: "Pairs 1-7 (vertebrosternal ribs) attach directly to sternum; ribs 8-10 are false ribs and 11-12 are floating ribs."
  },
  {
    subject: "Biology",
    questionText: "DNA bands separated on agarose gel electrophoresis can be visualised after staining with:",
    optionA: "Bromophenol blue",
    optionB: "Acetocarmine",
    optionC: "Aniline blue",
    optionD: "Ethidium bromide (EtBr under UV transillumination)",
    correctOption: "D",
    explanation: "EtBr intercalates in double helix and fluoresces bright orange under UV illumination."
  },
  {
    subject: "Biology",
    questionText: "In flowering angiosperms, the functional megaspore undergoes 3 mitotic divisions to develop into:",
    optionA: "Ovule",
    optionB: "Endosperm",
    optionC: "Embryo sac (Female gametophyte)",
    optionD: "Embryo",
    correctOption: "C",
    explanation: "Functional chalazal megaspore undergoes monosporic development to form 7-celled, 8-nucleate embryo sac."
  },
  {
    subject: "Biology",
    questionText: "Among the following 7 pairs of contrasting traits, which character was NOT studied by Mendel in pea?",
    optionA: "Stem - Tall or Dwarf",
    optionB: "Trichomes - Glandular or non-glandular",
    optionC: "Seed - Green or Yellow",
    optionD: "Pod - Inflated or Constricted",
    correctOption: "B",
    explanation: "Mendel did not study trichome morphology; he studied 7 traits: stem height, flower colour/position, pod shape/colour, seed shape/colour."
  },
  {
    subject: "Biology",
    questionText: "Lungs do not collapse even after maximum forceful expiration because of the presence of:",
    optionA: "Residual Volume (RV $\\approx 1100-1200\\text{ mL}$)",
    optionB: "Inspiratory Reserve Volume",
    optionC: "Tidal Volume",
    optionD: "Expiratory Reserve Volume",
    correctOption: "A",
    explanation: "Residual volume of air always remains in alveoli preventing lung collapse."
  },
  {
    subject: "Biology",
    questionText: "Gonadotropin-Releasing Hormone (GnRH) secreted by hypothalamus acts on:",
    optionA: "Anterior pituitary to stimulate LH and Oxytocin",
    optionB: "Anterior pituitary gland to stimulate secretion of LH and FSH",
    optionC: "Posterior pituitary for oxytocin",
    optionD: "Posterior pituitary for relaxin",
    correctOption: "B",
    explanation: "GnRH binds gonadotrophs in adenohypophysis, triggering synthesis and pulsatile release of LH and FSH."
  },
  {
    subject: "Biology",
    questionText: "In Bougainvillea and Citrus, defensive woody sharp thorns are morphological modifications of:",
    optionA: "Stipules",
    optionB: "Adventitious roots",
    optionC: "Stem (Axillary buds)",
    optionD: "Leaves",
    correctOption: "C",
    explanation: "Thorns in Bougainvillea are modified axillary stems protecting plants from browsing animals."
  },
  {
    subject: "Biology",
    questionText: "Gregor Mendel conducted his famous hybridization experiments on Garden Pea (Pisum sativum) during the years:",
    optionA: "1856 - 1863 (7 years)",
    optionB: "1840 - 1850",
    optionC: "1857 - 1869",
    optionD: "1870 - 1877",
    correctOption: "A",
    explanation: "Mendel carried out breeding experiments from 1856 to 1863 and presented findings in 1865."
  },
  {
    subject: "Biology",
    questionText: "Select correct statements regarding human vision and Vitamin A:\n(a) Retinal is an aldehyde derivative of Vitamin A\n(b) Retinal is light absorbing chromophore of rhodopsin\n(c) Vitamin A derivatives are formed from dietary $\\beta$-carotene\nChoose correct option:",
    optionA: "(a) and (b)",
    optionB: "(a), (c) and (d)",
    optionC: "(a) and (c) only",
    optionD: "(b), (c) and (d)",
    correctOption: "B",
    explanation: "Rhodopsin consists of opsin protein conjugated to 11-cis-retinal (Vitamin A aldehyde)."
  },
  {
    subject: "Biology",
    questionText: "Which statement is NOT valid / false regarding atmospheric Aerosols?",
    optionA: "They are harmful to human respiratory health",
    optionB: "They alter rainfall and cloud albedo",
    optionC: "They cause increased agricultural productivity (They decrease solar radiation reaching crops)",
    optionD: "They cause smog and soil deposition",
    correctOption: "C",
    explanation: "Aerosols scatter sunlight and deposit particulate toxins on crop leaves, reducing agricultural yield."
  },
  {
    subject: "Biology",
    questionText: "A drop in blood pressure and renal perfusion will NOT stimulate the release of:",
    optionA: "Renin",
    optionB: "Atrial Natriuretic Factor (ANF / released in response to high atrial pressure)",
    optionC: "Aldosterone",
    optionD: "ADH (Vasopressin)",
    correctOption: "B",
    explanation: "ANF is a vasodilator released when blood pressure is elevated; hypotension suppresses ANF and triggers RAAS."
  },
  {
    subject: "Biology",
    questionText: "Homozygous purelines in cattle breeding can be achieved by:",
    optionA: "Mating of closely related superior individuals of the same breed for 4-6 generations",
    optionB: "Mating of unrelated individuals of same breed",
    optionC: "Cross-breeding different breeds",
    optionD: "Interspecific hybridization",
    correctOption: "A",
    explanation: "Continuous inbreeding between close relatives increases homozygosity and helps establish purelines."
  },
  {
    subject: "Biology",
    questionText: "During secondary growth in dicot stem, vascular cambium ring predominantly gives rise to:",
    optionA: "Phelloderm",
    optionB: "Primary phloem",
    optionC: "Secondary xylem (Wood)",
    optionD: "Periderm",
    correctOption: "C",
    explanation: "Cambial activity is more active on inside, producing compact secondary xylem."
  },
  {
    subject: "Biology",
    questionText: "Which of the following statements about Henle's loop is CORRECT?",
    optionA: "The ascending limb of loop of Henle is IMPERMEABLE to water",
    optionB: "The descending limb is impermeable to water",
    optionC: "The ascending limb is permeable to water",
    optionD: "The descending limb is permeable to electrolytes",
    correctOption: "A",
    explanation: "Ascending limb actively transports $\\text{NaCl}$ and is impermeable to water; descending limb is permeable to water."
  },
  {
    subject: "Biology",
    questionText: "Premature fruit and leaf abscission in young horticultural crops can be prevented by spraying:",
    optionA: "Cytokinins",
    optionB: "Ethylene",
    optionC: "Auxins (2,4-D / NAA)",
    optionD: "Gibberellic acid",
    correctOption: "C",
    explanation: "Auxins prevent premature abscission of young leaves and fruits while promoting abscission of older senescent organs."
  },
  {
    subject: "Biology",
    questionText: "A 2-year-old child has 20 deciduous milk teeth. Which type of teeth are completely ABSENT?",
    optionA: "Incisors",
    optionB: "Canines",
    optionC: "Premolars (Dental formula $2102/2102$)",
    optionD: "Molars",
    correctOption: "C",
    explanation: "Deciduous milk dentition lacks premolars; dental formula is $\\frac{2,1,0,2}{2,1,0,2}$."
  },
  {
    subject: "Biology",
    questionText: "An important shared diagnostic anatomical feature between Hemichordates and Chordates is:",
    optionA: "Absence of notochord",
    optionB: "Ventral tubular nerve cord",
    optionC: "Pharynx perforated with Gill Slits (Pharyngeal clefts)",
    optionD: "Pharynx without gill slits",
    correctOption: "C",
    explanation: "Both hemichordates (Balanoglossus) and chordates possess paired pharyngeal gill slits for filter feeding."
  },
  {
    subject: "Biology",
    questionText: "Artificial selective breeding of high milk yielding dairy cows represents which type of natural selection?",
    optionA: "Stabilizing selection",
    optionB: "Directional selection (shifts the phenotypic mean towards higher yield)",
    optionC: "Disruptive selection",
    optionD: "Stabilizing followed by disruptive",
    correctOption: "B",
    explanation: "Selecting individuals with extreme high milk output shifts the population mean in one direction."
  },
  {
    subject: "Biology",
    questionText: "Correct anatomical pathway for passage of sperms in male frog (Rana tigrina) is:",
    optionA: "Testes $\\to$ Bidder's canal $\\to$ Kidney $\\to$ Vasa efferentia $\\to$ Cloaca",
    optionB: "Testes $\\to$ Vasa efferentia $\\to$ Kidney $\\to$ Seminal vesicle $\\to$ Cloaca",
    optionC: "Testes $\\to$ Vasa efferentia $\\to$ Bidder's canal $\\to$ Ureter $\\to$ Cloaca",
    optionD: "Testes $\\to$ Vasa efferentia $\\to$ Kidney $\\to$ Bidder's canal $\\to$ Urinogenital duct $\\to$ Cloaca",
    correctOption: "D",
    explanation: "Sperms from testes pass through 10-12 vasa efferentia into kidneys, enter Bidder's canal, then travel via urinogenital duct to cloaca."
  },
  {
    subject: "Biology",
    questionText: "Which enzyme composition best represents the digestive secretome of human Pancreatic Juice?",
    optionA: "Amylase, peptidase, trypsinogen, rennin",
    optionB: "Amylase, pepsin, trypsinogen, maltase",
    optionC: "Peptidase, amylase, pepsin, rennin",
    optionD: "Lipase, Amylase, Trypsinogen, Chymotrypsinogen, Procarboxypeptidase",
    correctOption: "D",
    explanation: "Exocrine pancreas secretes trypsinogen, chymotrypsinogen, procarboxypeptidase, pancreatic amylase, and pancreatic lipase (steapsin)."
  },
  {
    subject: "Biology",
    questionText: "Phosphoenolpyruvate (PEP) is the primary cytoplasmic $\\text{CO}_2$ acceptor in:",
    optionA: "$\\text{C}_3$ plants",
    optionB: "$\\text{C}_4$ plants (in mesophyll cells)",
    optionC: "$\\text{C}_2$ plants",
    optionD: "$\\text{C}_3$ and $\\text{C}_4$ plants",
    correctOption: "B",
    explanation: "In $\\text{C}_4$ mesophyll cells, PEP carboxylase fixes $\\text{HCO}_3^-$ into 4C oxaloacetic acid."
  },
  {
    subject: "Biology",
    questionText: "The morphological nature of the edible white kernel and refreshing liquid of Coconut is:",
    optionA: "Perisperm",
    optionB: "Cotyledon",
    optionC: "Endosperm (Cellular and free-nuclear endosperm)",
    optionD: "Pericarp",
    correctOption: "C",
    explanation: "Coconut water is free-nuclear endosperm and the white fleshy kernel is cellular endosperm."
  },
  {
    subject: "Biology",
    questionText: "If the Anaphase Promoting Complex (APC) is defective in a dividing human cell, what will occur?",
    optionA: "Chromosomes will not condense",
    optionB: "Chromosomes will be fragmented",
    optionC: "Chromosomes will NOT segregate / separate at anaphase",
    optionD: "Recombination will occur",
    correctOption: "C",
    explanation: "APC ubiquitinates securin to activate separase, which cleaves cohesin; without APC, sister chromatids cannot segregate."
  },
  {
    subject: "Biology",
    questionText: "Mucosa-Associated Lymphoid Tissue (MALT) constitutes about what percentage of all lymphoid tissue in human body?",
    optionA: "$50\\%$",
    optionB: "$20\\%$",
    optionC: "$70\\%$",
    optionD: "$10\\%$",
    correctOption: "A",
    explanation: "MALT lining respiratory, digestive, and urogenital tracts accounts for approximately $50\\%$ of human lymphoid tissue."
  },
  {
    subject: "Biology",
    questionText: "Specific neurotransmitter receptor protein sites at chemical synapses are situated on:",
    optionA: "Membranes of synaptic vesicles",
    optionB: "Pre-synaptic membrane",
    optionC: "Axon terminal tips",
    optionD: "Post-synaptic membrane (Ligand-gated ion channels)",
    correctOption: "D",
    explanation: "Neurotransmitters released into synaptic cleft bind specifically to receptors on the post-synaptic membrane."
  },
  {
    subject: "Biology",
    questionText: "Hypersecretion of Growth Hormone (GH) in adults causes acromegaly but does not increase height because:",
    optionA: "GH becomes inactive in adults",
    optionB: "Epiphyseal growth plates in long bones fuse and close after adolescence",
    optionC: "Bones lose GH sensitivity",
    optionD: "Muscle fibres cease growing",
    correctOption: "B",
    explanation: "Epiphyseal cartilaginous plates ossify after puberty, preventing further longitudinal bone elongation."
  },
  {
    subject: "Biology",
    questionText: "German naturalist and geographer Alexander von Humboldt pioneered the formulation of:",
    optionA: "Ecological biodiversity",
    optionB: "Law of limiting factors",
    optionC: "Species-Area Relationship ($\\log S = \\log C + Z \\log A$)",
    optionD: "Logistic population equation",
    correctOption: "C",
    explanation: "Humboldt observed that within a region, species richness increases with explored area up to a limit."
  },
  {
    subject: "Biology",
    questionText: "The protective insulating Myelin sheath around nerve axon fibres is produced by:",
    optionA: "Schwann cells (in PNS) and Oligodendrocytes (in CNS)",
    optionB: "Astrocytes and Schwann cells",
    optionC: "Oligodendrocytes and Osteoclasts",
    optionD: "Osteoclasts and Astrocytes",
    correctOption: "A",
    explanation: "Schwann cells myelinate peripheral nerves; oligodendrocytes myelinate central nervous system tracts."
  },
  {
    subject: "Biology",
    questionText: "For an infertile couple where male partner has severe oligospermia (very low sperm count), best ART technique is:",
    optionA: "Intrauterine transfer",
    optionB: "GIFT",
    optionC: "Artificial Insemination / Intrauterine Insemination (IUI)",
    optionD: "ICSI (Intra-Cytoplasmic Sperm Injection)",
    correctOption: "C",
    explanation: "Artificial Insemination concentrates semen and introduces it into the uterus (Official key: 3 / 4 ICSI)."
  },
  {
    subject: "Biology",
    questionText: "Which outer surface layer provides the protective sticky and gelatinous character to bacterial cells?",
    optionA: "Cell wall",
    optionB: "Nuclear membrane",
    optionC: "Plasma membrane",
    optionD: "Glycocalyx (Capsule / Slime layer)",
    correctOption: "D",
    explanation: "Glycocalyx made of polysaccharides/polypeptides allows bacterial adherence to surfaces."
  },
  {
    subject: "Biology",
    questionText: "DNA replication in prokaryotic bacteria occurs:",
    optionA: "During S-phase",
    optionB: "Within nucleolus",
    optionC: "Prior to binary fission (concurrent with cell growth)",
    optionD: "Just before transcription",
    correctOption: "C",
    explanation: "Bacteria lack compartmentalized cell cycle phases; circular chromosome replicates prior to binary fission."
  },
  {
    subject: "Biology",
    questionText: "The primary contraceptive mechanism of copper ions released by Copper-T / Multiload IUDs is:",
    optionA: "Suppress sperm motility and fertilising capacity of sperms",
    optionB: "Inhibit gametogenesis",
    optionC: "Make uterus unsuitable for implantation",
    optionD: "Inhibit ovulation",
    correctOption: "A",
    explanation: "Free $\\text{Cu}^{2+}$ ions suppress sperm motility, viability, and metabolic enzyme activity."
  },
  {
    subject: "Biology",
    questionText: "Which stage of primary sewage treatment removes floating debris and coarse suspended settleable solids?",
    optionA: "Tertiary treatment",
    optionB: "Secondary biological treatment",
    optionC: "Primary physical treatment (Sequential filtration and sedimentation)",
    optionD: "Sludge digestion",
    correctOption: "C",
    explanation: "Primary physical treatment uses filtration for floating debris and settling tanks for grit and primary sludge."
  },
  {
    subject: "Biology",
    questionText: "Under standard conditions of temperature and atmospheric pressure, the water potential ($\\Psi_w$) of pure water is:",
    optionA: "Zero",
    optionB: "Less than zero",
    optionC: "More than zero but less than 1",
    optionD: "More than 1",
    correctOption: "A",
    explanation: "By convention, water potential of pure water at atmospheric pressure is zero ($\\Psi_w = 0$)."
  },
  {
    subject: "Biology",
    questionText: "Identify the WRONG statement in the context of Heartwood (Duramen):",
    optionA: "Organic aromatic compounds and tannins are deposited in it",
    optionB: "It is highly durable and resistant to microbial attack",
    optionC: "It conducts water and minerals efficiently (Heartwood is non-functional in conduction; tyloses plug vessels)",
    optionD: "It comprises dead, highly lignified tracheary elements",
    correctOption: "C",
    explanation: "Heartwood provides mechanical support only; water conduction is carried out exclusively by peripheral sapwood."
  },
  {
    subject: "Biology",
    questionText: "Select the CORRECT genetic distinction between Thalassemia and Sickle Cell Anemia:",
    optionA: "Both are qualitative defects",
    optionB: "Both are quantitative defects",
    optionC: "Thalassemia is a QUANTITATIVE defect (reduced synthesis of globin chains), while Sickle cell anemia is a QUALITATIVE defect (mutant $\\beta$-globin)",
    optionD: "Sickle cell anemia is a quantitative defect",
    correctOption: "C",
    explanation: "Thalassemia involves deficient synthesis of normal globin chains; sickle cell anemia synthesizes structurally abnormal $\\text{HbS}$."
  },
  {
    subject: "Biology",
    questionText: "Flowers which have a single ovule in ovary and are packed into dense inflorescences (like Maize and Grasses) are pollinated by:",
    optionA: "Water",
    optionB: "Bee",
    optionC: "Wind (Anemophily)",
    optionD: "Bat",
    correctOption: "C",
    explanation: "Wind-pollinated plants produce small inconspicuous flowers packed in inflorescences with single ovule and feathery stigmas."
  }
];

async function seedNeet2017Paper() {
  console.log(`🚀 Compiling NEET 2017 Paper JSON with ${rawQuestions.length} complete questions...`);

  const paperData = {
    examName: "NEET",
    year: 2017,
    shiftName: "NEET 2017",
    examDate: "2017-05-07T14:00:00Z",
    totalMarks: 720,
    totalQuestions: 180,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'NEET 2017.json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved NEET 2017 JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding NEET 2017 Shift into Database via Prisma...`);
  
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
      name: "NEET 2017"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "NEET 2017",
      date: new Date("2017-05-07T14:00:00Z")
    }
  });
  console.log(`Created Shift "NEET 2017" (ID: ${shift.id})`);

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

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for NEET 2017 in PostgreSQL!`);
}

seedNeet2017Paper()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
