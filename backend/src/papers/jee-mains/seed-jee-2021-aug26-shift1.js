const prisma = require('../../lib/prisma');
const fs = require('fs');
const path = require('path');

const rawQuestions = [
  // ── MATHEMATICS / PHYSICS / CHEMISTRY (Q1 - Q90) ──
  // ── PHYSICS ──
  {
    subject: "Physics",
    questionText: "The magnitude of vectors $\\vec{OA}, \\vec{OB}$ and $\\vec{OC}$ in the given figure are equal. The direction of $\\vec{OA} + \\vec{OB} - \\vec{OC}$ with x-axis will be:",
    imageUrl: null,
    optionA: "(1) $\\tan^{-1} \\left(\\frac{\\sqrt{3}-1+\\sqrt{2}}{1+\\sqrt{3}-\\sqrt{2}}\\right)$",
    optionB: "(2) $\\tan^{-1} \\left(\\frac{1-\\sqrt{3}-\\sqrt{2}}{1+\\sqrt{3}+\\sqrt{2}}\\right)$",
    optionC: "(3) $\\tan^{-1} \\left(\\frac{\\sqrt{3}-1+\\sqrt{2}}{1-\\sqrt{3}+\\sqrt{2}}\\right)$",
    optionD: "(4) $\\tan^{-1} \\left(\\frac{1+\\sqrt{3}-\\sqrt{2}}{1-\\sqrt{3}-\\sqrt{2}}\\right)$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "If E, L, M and G denote energy, angular momentum, mass and constant of gravitation respectively, then dimensions of P in $P = E L^2 M^{-5} G^{-2}$ are:",
    imageUrl: null,
    optionA: "(1) [M1 L1 T-2]",
    optionB: "(2) [M0 L1 T0]",
    optionC: "(3) [M-1 L-1 T2]",
    optionD: "(4) [M0 L0 T0]",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Initial mass of rocket is 1000 kg. Rate of fuel burn for acceleration of $20\\text{ ms}^{-2}$ with exhaust speed $500\\text{ ms}^{-1}$ is ($g = 10\\text{ ms}^{-2}$):",
    imageUrl: null,
    optionA: "(1) $10\\text{ kg s}^{-1}$",
    optionB: "(2) $60\\text{ kg s}^{-1}$",
    optionC: "(3) $500\\text{ kg s}^{-1}$",
    optionD: "(4) $6.0 \\times 10^2\\text{ kg s}^{-1}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Inside a uniform spherical shell:\\n(a) Gravitational field is zero\\n(b) Gravitational potential is zero\\n(c) Gravitational field is same everywhere\\n(d) Gravitational potential is same everywhere\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) (a), (c) and (d) only",
    optionB: "(2) (a), (b) and (c) only",
    optionC: "(3) (b), (c) and (d) only",
    optionD: "(4) (e) only",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Two narrow bores of diameter 5.0 mm and 8.0 mm form U-tube. Surface tension $T = 7.3 \\times 10^{-2}\\text{ N/m}$, contact angle $0^\\circ$. Level difference in limbs is:",
    imageUrl: null,
    optionA: "(1) 5.34 mm",
    optionB: "(2) 3.62 mm",
    optionC: "(3) 2.19 mm",
    optionD: "(4) 4.97 mm",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Electric appliance supplies $6000\\text{ J min}^{-1}$ heat. If system delivers 90 W power, time to increase internal energy by $2.5 \\times 10^3\\text{ J}$ is:",
    imageUrl: null,
    optionA: "(1) $2.5 \\times 10^1\\text{ s}$",
    optionB: "(2) $2.5 \\times 10^2\\text{ s}$",
    optionC: "(3) $2.4 \\times 10^3\\text{ s}$",
    optionD: "(4) $4.1 \\times 10^1\\text{ s}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "RMS speeds of Hydrogen ($v_H$), Oxygen ($v_O$), Carbon dioxide ($v_C$) at same temperature are related as:",
    imageUrl: null,
    optionA: "(1) $v_C > v_O > v_H$",
    optionB: "(2) $v_H = v_O > v_C$",
    optionC: "(3) $v_H > v_O > v_C$",
    optionD: "(4) $v_H = v_O = v_C$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Solid metal sphere radius R charge q enclosed in shell inner radius a, outer b. Variation of electric field E with distance r is zero for $r < R$ and $a < r < b$, $1/r^2$ decay elsewhere (Option 3).",
    imageUrl: null,
    optionA: "(1) Graph 1",
    optionB: "(2) Graph 2",
    optionC: "(3) Graph 3",
    optionD: "(4) Graph 4",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Material between parallel plate capacitor has resistivity $200\\Omega\\text{m}$, capacitance 2 pF, voltage 40 V, relative permittivity 50. Leakage current is:",
    imageUrl: null,
    optionA: "(1) $0.9\\text{ mA}$",
    optionB: "(2) $9.0\\text{ mA}$",
    optionC: "(3) $9.0\\mu\\text{A}$",
    optionD: "(4) $0.9\\mu\\text{A}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In circuit cell emf 2.2 V, internal resistance $0.6\\Omega$ with $4\\Omega, 2\\Omega, 8\\Omega, 8\\Omega$ resistors. Power dissipated in whole circuit is:",
    imageUrl: null,
    optionA: "(1) 1.32 W",
    optionB: "(2) 4.4 W",
    optionC: "(3) 0.65 W",
    optionD: "(4) 2.2 W",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Equal length of iron wire ($12\\mu\\Omega\\text{cm}$) and Cu-Ni alloy wire ($51\\mu\\Omega\\text{cm}$) 2mm diameter parallel to give equivalent resistance $3\\Omega$. Length is:",
    imageUrl: null,
    optionA: "(1) 97 m",
    optionB: "(2) 110 m",
    optionC: "(3) 90 m",
    optionD: "(4) 82 m",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Fractional change in magnetic field intensity at distance r from centre of current carrying coil of radius a to centre is ($r < a$):",
    imageUrl: null,
    optionA: "(1) $\\frac{2}{3} \\frac{a^2}{r^2}$",
    optionB: "(2) \\frac{3}{2} \\frac{a^2}{r^2}$",
    optionC: "(3) $\\frac{3}{2} \\frac{r^2}{a^2}$",
    optionD: "(4) \\frac{2}{3} \\frac{r^2}{a^2}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Series LCR driven by 300 V, 50 Hz. $R = 3\\text{ k}\\Omega, X_L = 250\\Omega$. Capacitance to maximize average power is ($\\pi^2 = 10$):",
    imageUrl: null,
    optionA: "(1) $400\\mu\\text{F}$",
    optionB: "(2) $4\\mu\\text{F}$",
    optionC: "(3) $40\\mu\\text{F}$",
    optionD: "(4) $25\\mu\\text{F}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Inductor coil stores 64 J magnetic energy, dissipates 640 W at 8 A. Joined across ideal battery, time constant is:",
    imageUrl: null,
    optionA: "(1) 0.4 s",
    optionB: "(2) 0.2 s",
    optionC: "(3) 0.125 s",
    optionD: "(4) 0.8 s",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Car B overtakes car A at relative speed $40\\text{ m/s}$. Speed of image of B in mirror of focal length 10 cm on A when B is 1.9 m away is:",
    imageUrl: null,
    optionA: "(1) $0.1\\text{ m/s}$",
    optionB: "(2) $0.2\\text{ m/s}$",
    optionC: "(3) $40\\text{ m/s}$",
    optionD: "(4) $4\\text{ m/s}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Photoelectric exp: UV light 280 nm, work function 2.5 eV. Switched to 400 nm, change in stopping potential is:",
    imageUrl: null,
    optionA: "(1) 1.1 V",
    optionB: "(2) 0.6 V",
    optionC: "(3) 1.3 V",
    optionD: "(4) 1.9 V",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Hydrogen-like ion emits frequency $2.92 \\times 10^{15}\\text{ Hz}$ for $n=3 \\to 1$. Frequency for $n=2 \\to 1$ is:",
    imageUrl: null,
    optionA: "(1) $6.57 \\times 10^{15}\\text{ Hz}$",
    optionB: "(2) $2.46 \\times 10^{15}\\text{ Hz}$",
    optionC: "(3) $0.44 \\times 10^{15}\\text{ Hz}$",
    optionD: "(4) $4.38 \\times 10^{15}\\text{ Hz}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Four NOR gates connected in cascade with feedback. Truth table corresponds to NOR gate (Option 4).",
    imageUrl: null,
    optionA: "(1) OR",
    optionB: "(2) AND",
    optionC: "(3) NAND",
    optionD: "(4) NOR",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Statement I: Doping silicon with pentavalent material increases electron density.\\nStatement II: n-type semiconductor has net negative charge.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both I and II false",
    optionB: "(2) Statement I true, II false",
    optionC: "(3) Statement I false, II true",
    optionD: "(4) Both I and II true",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Screw Gauge: 5th division coincides at zero. 100 divisions, main scale moves 0.5 mm per rotation. Main scale reading 5 mm, 20th division coincides. True reading is:",
    imageUrl: null,
    optionA: "(1) 5.20 mm",
    optionB: "(2) 5.00 mm",
    optionC: "(3) 5.15 mm",
    optionD: "(4) 5.25 mm",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Two balls radius 5 cm thrown upwards along same vertical line at interval with $v = 35\\text{ m/s}$. Collide at height _____ m.",
    imageUrl: null,
    optionA: "50",
    optionB: "50",
    optionC: "50",
    optionD: "50",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Uniform chain length 3m mass 3kg overhangs smooth table with 2m on table. KE as it completely slips off is _____ J.",
    imageUrl: null,
    optionA: "40",
    optionB: "40",
    optionC: "40",
    optionD: "40",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Badminton racket length $6r, 2r$. MOI about axis perpendicular to handle at $r/2$ distance from end A is _____ $M r^2$.",
    imageUrl: null,
    optionA: "52",
    optionB: "52",
    optionC: "52",
    optionD: "52",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Soap bubble radius 3 cm formed inside another bubble radius 6 cm. Equivalent soap bubble radius is _____ cm.",
    imageUrl: null,
    optionA: "2",
    optionB: "2",
    optionC: "2",
    optionD: "2",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Standing wave $y = 1.0 \\cos(1.57 x) \\sin(78.5 t)$. Node closest to origin in $x > 0$ region at $x = \\text{_____ cm}$.",
    imageUrl: null,
    optionA: "1",
    optionB: "1",
    optionC: "1",
    optionD: "1",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Source & detector move away at $20\\text{ m/s}$. Detector detects 1800 Hz. Original frequency ($v = 340\\text{ m/s}$) is _____ Hz.",
    imageUrl: null,
    optionA: "2025",
    optionB: "2025",
    optionC: "2025",
    optionD: "2025",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Two short magnetic dipoles magnetic moment $1\\text{ A m}^2$ at O and P ($OP = 1\\text{ m}$). Torque on $m_2$ is $x \\times 10^{-7}\\text{ N m}$. Value of x is _____.",
    imageUrl: null,
    optionA: "1",
    optionB: "1",
    optionC: "1",
    optionD: "1",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Plane EM wave $E = 200 \\cos((0.5 \\times 10^3)x - (1.5 \\times 10^{11})t)\\hat{j}\\text{ Vm}^{-1}$ falls on $100\\text{ cm}^2$ surface. Radiation pressure is $\\frac{k}{10^9}\\text{ Nm}^{-2}$. k is _____.",
    imageUrl: null,
    optionA: "354",
    optionB: "354",
    optionC: "354",
    optionD: "354",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "White light YDSE screen 1.5 m, slit separation 0.3 mm. First violet and red fringes 2.0 mm and 3.5 mm. Wavelength difference is _____ nm.",
    imageUrl: null,
    optionA: "300",
    optionB: "300",
    optionC: "300",
    optionD: "300",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "AM wave $C_m(t) = 10(1 + 0.2 \\cos 12560t) \\sin(111 \\times 10^4 t)\\text{ V}$. Modulating frequency in kHz is _____.",
    imageUrl: null,
    optionA: "2",
    optionB: "2",
    optionC: "2",
    optionD: "2",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── CHEMISTRY ──
  {
    subject: "Chemistry",
    questionText: "Statement I: Velocity of electron increases with decrease in nuclear charge.\\nStatement II: Velocity of electron increases with decrease in principal quantum number n.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Statement I false, II true",
    optionB: "(2) Statement I true, II false",
    optionC: "(3) Both I and II false",
    optionD: "(4) Both I and II true",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: Titration of strong acid with weak base uses methyl orange.\\nStatement II: Acetic acid with NaOH uses phenolphthalein (not suitable in statement).\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Statement I false, II true",
    optionB: "(2) Both I and II true",
    optionC: "(3) Both I and II false",
    optionD: "(4) Statement I true, II false",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which method is most suitable for preparing deionized water?",
    imageUrl: null,
    optionA: "(1) Synthetic resin method",
    optionB: "(2) Calgon's method",
    optionC: "(3) Clark's method",
    optionD: "(4) Permutit method",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Products formed in sequence when excess $\\text{CO}_2$ is passed in slaked lime:",
    imageUrl: null,
    optionA: "(1) $\\text{CaO}, \\text{CaCO}_3$",
    optionB: "(2) $\\text{Ca(HCO}_3)_2, \\text{CaCO}_3$",
    optionC: "(3) $\\text{CaCO}_3, \\text{Ca(HCO}_3)_2$",
    optionD: "(4) $\\text{CaO}, \\text{Ca(HCO}_3)_2$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Major product of addition of HBr (excess) to 2-methylbut-2-ene is 2,3-dibromo-2-methylbutane (Option 3).",
    imageUrl: null,
    optionA: "(1) Monobromo derivative",
    optionB: "(2) Rearranged product",
    optionC: "(3) 2,3-dibromo-2-methylbutane",
    optionD: "(4) 1,2-dibromo derivative",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Excess of isobutane with $\\text{Br}_2$ in presence of light at $125^\\circ\\text{C}$ gives major product t-butyl bromide (Option 4).",
    imageUrl: null,
    optionA: "(1) Isobutyl bromide",
    optionB: "(2) 1,2-dibromoisobutane",
    optionC: "(3) n-Butyl bromide",
    optionD: "(4) t-Butyl bromide",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which compound forms yellow ppt on reacting sequentially with (i) NaOH, (ii) dil $\\text{HNO}_3$, (iii) $\\text{AgNO}_3$?",
    imageUrl: null,
    optionA: "(1) III",
    optionB: "(2) II",
    optionC: "(3) I",
    optionD: "(4) IV (Iodo-derivative)",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Conversion of hydroxyapatite occurs due to presence of $\\text{F}^-$ ions in water. Correct formula of hydroxyapatite is:",
    imageUrl: null,
    optionA: "(1) $[\\text{Ca}_3(\\text{PO}_4)_2 \\cdot \\text{CaF}_2]$",
    optionB: "(2) $[3\\text{Ca}_3(\\text{PO}_4)_2 \\cdot \\text{Ca(OH)}_2]$",
    optionC: "(3) $[3\\text{Ca}_3(\\text{PO}_4)_2 \\cdot \\text{CaF}_2]$",
    optionD: "(4) $[3\\text{Ca(OH)}_2 \\cdot \\text{CaF}_2]$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: Frenkel defects are vacancy as well as interstitial defects.\\nStatement II: Frenkel defect leads to colour in ionic solids due to F-centres.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Statement I false, II true",
    optionB: "(2) Both I and II false",
    optionC: "(3) Statement I true, II false",
    optionD: "(4) Both I and II true",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: Limiting molar conductivity of KCl is higher than $\\text{CH}_3\\text{COOH}$.\\nStatement II: Molar conductivity decreases with decrease in concentration.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Statement I false, II true",
    optionB: "(2) Both I and II true",
    optionC: "(3) Statement I true, II false",
    optionD: "(4) Both I and II false",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which is correct for adsorption of gas at given temperature on solid surface?",
    imageUrl: null,
    optionA: "(1) $\\Delta H > 0, \\Delta S > 0$",
    optionB: "(2) $\\Delta H < 0, \\Delta S > 0$",
    optionC: "(3) $\\Delta H > 0, \\Delta S < 0$",
    optionD: "(4) $\\Delta H < 0, \\Delta S < 0$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: Choice of reducing agents for metals extraction using Ellingham diagram.\\nStatement II: $\\Delta S$ increases left to right in Ellingham diagram.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Statement I false, II true",
    optionB: "(2) Both I and II true",
    optionC: "(3) Statement I true, II false",
    optionD: "(4) Both I and II false",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The incorrect statement is:",
    imageUrl: null,
    optionA: "(1) $F_2$ stronger oxidizing agent than $Cl_2$ aqueous",
    optionB: "(2) Hydrolysis of ClF forms HOCl and HF",
    optionC: "(3) $Cl_2$ more reactive than ClF",
    optionD: "(4) $F_2$ more reactive than ClF",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which when dissolved in water gives coloured solution in nitrogen atmosphere?",
    imageUrl: null,
    optionA: "(1) $\\text{Cu}_2\\text{Cl}_2$",
    optionB: "(2) $\\text{ZnCl}_2$",
    optionC: "(3) $\\text{CuCl}_2$",
    optionD: "(4) AgCl",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which complex is violet in colour?",
    imageUrl: null,
    optionA: "(1) $Fe_4[Fe(CN)_6]_3 \\cdot H_2O$",
    optionB: "(2) $[Fe(CN)_5 NOS]^{4-}$",
    optionC: "(3) $[Fe(SCN)_6]^{4-}$",
    optionD: "(4) $[Fe(CN)_6]^{4-}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Reaction of phenol with $Br_2$(Excess)/$H_2O \\to A$, phenol with $Br_2/CS_2, < 5^\\circ\\text{C} \\to B$. Products A and B are 2,4,6-tribromophenol and 4-bromophenol (Option 4).",
    imageUrl: null,
    optionA: "(1) Product 1",
    optionB: "(2) Product 2",
    optionC: "(3) Product 3",
    optionD: "(4) 2,4,6-tribromophenol and 4-bromophenol",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Major product A and B in reaction sequence of 1-(4-hydroxyphenyl)propan-1-one: A is brominated product, B is CHBr3 (Option 1).",
    imageUrl: null,
    optionA: "(1) Product A and $CHBr_3$",
    optionB: "(2) Product 2",
    optionC: "(3) Product 3",
    optionD: "(4) Product 4",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Reaction of 4-hydroxy-3-amino-benzoate with $(CH_3 CO)_2 O, SOCn_2, CH_3 OH \\to$ Major product P is amide-ester derivative (Option 2).",
    imageUrl: null,
    optionA: "(1) Product 1",
    optionB: "(2) Amide-ester derivative",
    optionC: "(3) Product 3",
    optionD: "(4) Product 4",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Correct sequential addition of reagents for 3-nitrobenzoic acid from benzene is:",
    imageUrl: null,
    optionA: "(1) $Br_2/AlBr_3, HNO_3/H_2SO_4, Mg/ether, CO_2, H_3O^+$",
    optionB: "(2) $Br_2/AlBr_3, NaCN, H_3O^+, HNO_3/H_2SO_4$",
    optionC: "(3) $Br_2/AlBr_3, HNO_3/H_2SO_4, NaCN, H_3O^+$",
    optionD: "(4) $HNO_3/H_2SO_4, Br_2/AlBr_3, Mg/ether, CO_2, H_3O^+$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Polymer formed on heating Novolac with formaldehyde is:",
    imageUrl: null,
    optionA: "(1) Polyester",
    optionB: "(2) Bakelite",
    optionC: "(3) Nylon-6, 6",
    optionD: "(4) Melamine",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "100 mL $\\text{Na}_3\\text{PO}_4$ contains 3.45 g sodium. Molarity is _____ $\\times 10^{-2}\\text{ mol L}^{-1}$.",
    imageUrl: null,
    optionA: "50",
    optionB: "50",
    optionC: "50",
    optionD: "50",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "For water $\\Delta_{vap} H = 41\\text{ kJ mol}^{-1}$ at 373 K, 1 bar. Internal energy change during evaporation is _____ $\\text{kJ mol}^{-1}$.",
    imageUrl: null,
    optionA: "38",
    optionB: "38",
    optionC: "38",
    optionD: "38",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Equilibrium constant $K_c = 100$ for $A+B \\rightleftharpoons C+D$. Equimolar 1M initial. Equilibrium concentration of D is _____ $\\times 10^{-2}\\text{ M}$.",
    imageUrl: null,
    optionA: "182",
    optionB: "182",
    optionC: "182",
    optionD: "182",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Sulphur estimation: 0.471 g organic compound gave 1.44 g barium sulfate. Percentage of sulphur is _____ %.",
    imageUrl: null,
    optionA: "42",
    optionB: "42",
    optionC: "42",
    optionD: "42",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Rate constant for $[PtCl_4]^{2-} + H_2O \\rightleftharpoons [Pt(H_2O)Cl_3]^- + Cl^-$. $K_c = X$. Value of $1/X$ is _____.",
    imageUrl: null,
    optionA: "50",
    optionB: "50",
    optionC: "50",
    optionD: "50",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Chloro compound A forms aldehydes on ozonolysis. 1.53 g A gives 448 mL vapour at STP. Number of carbon atoms in A is _____.",
    imageUrl: null,
    optionA: "3",
    optionB: "3",
    optionC: "3",
    optionD: "3",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "83.6 g ethylene glycol dissolved in 625 g water. Freezing point of solution is _____ K. ($K_f = 1.86$).",
    imageUrl: null,
    optionA: "269",
    optionB: "269",
    optionC: "269",
    optionD: "269",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Galvanic cell $\\text{Zn}|\\text{Zn}^{2+}(0.04M)|\\text{Cu}^{2+}(0.02M)|\\text{Cu}$. $E_{cell} = \\text{_____} \\times 10^{-2}\\text{ V}$.",
    imageUrl: null,
    optionA: "109",
    optionB: "109",
    optionC: "109",
    optionD: "109",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Overall stability constant of $[Cu(NH_3)_4]^{2+}$ is $2.1 \\times 10^{13}$. Overall dissociation constant is $y \\times 10^{-14}$. y is _____.",
    imageUrl: null,
    optionA: "5",
    optionB: "5",
    optionC: "5",
    optionD: "5",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Metal surface exposed to 500 nm. Threshold frequency $4.3 \\times 10^{14}\\text{ Hz}$. Velocity of ejected electron is _____ $\\times 10^5\\text{ ms}^{-1}$.",
    imageUrl: null,
    optionA: "5",
    optionB: "5",
    optionC: "5",
    optionD: "5",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── MATHEMATICS ──
  {
    subject: "Mathematics",
    questionText: "If $(\\sqrt{3} + i)^{100} = 2^{99}(p + iq)$, then p and q are roots of equation:",
    imageUrl: null,
    optionA: "(1) $x^2 - (\\sqrt{3}+1)x + \\sqrt{3} = 0$",
    optionB: "(2) $x^2 + (\\sqrt{3}+1)x + \\sqrt{3} = 0$",
    optionC: "(3) $x^2 + (\\sqrt{3}-1)x - \\sqrt{3} = 0$",
    optionD: "(4) $x^2 - (\\sqrt{3}-1)x - \\sqrt{3} = 0$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Pencil AB length 10 inches, mid C. Eraser P with $PC = \\sqrt{5}$, $\\angle PCB = \\tan^{-1}(2)$. Acute angle to rotate pencil about C so distance between eraser and pencil is 1 inch:",
    imageUrl: null,
    optionA: "(1) $\\tan^{-1}(3/4)$",
    optionB: "(2) $\\tan^{-1}(1/2)$",
    optionC: "(3) $\\tan^{-1}(4/3)$",
    optionD: "(4) $\\tan^{-1}(1)$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Value of $2 \\sin(\\frac{\\pi}{8}) \\sin(\\frac{2\\pi}{8}) \\sin(\\frac{3\\pi}{8}) \\sin(\\frac{5\\pi}{8}) \\sin(\\frac{6\\pi}{8}) \\sin(\\frac{7\\pi}{8})$ is:",
    imageUrl: null,
    optionA: "(1) $\\frac{1}{4\\sqrt{2}}$",
    optionB: "(2) $\\frac{1}{8}$",
    optionC: "(3) $\\frac{1}{8\\sqrt{2}}$",
    optionD: "(4) $\\frac{1}{4}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Circle C touches $x = 2y$ at (2, 1) and intersects $C_1 : x^2 + y^2 + 2y - 5 = 0$ at P and Q (PQ diameter of $C_1$). Diameter of C is:",
    imageUrl: null,
    optionA: "(1) $4\\sqrt{15}$",
    optionB: "(2) $\\sqrt{285}$",
    optionC: "(3) 15",
    optionD: "(4) $7\\sqrt{5}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Point $P(-2\\sqrt{6}, \\sqrt{3})$ lies on $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$ eccentricity $\\sqrt{5}/2$. Tangent & normal at P intersect conjugate axis at Q & R. QR is:",
    imageUrl: null,
    optionA: "(1) $4\\sqrt{3}$",
    optionB: "(2) 6",
    optionC: "(3) $3\\sqrt{6}$",
    optionD: "(4) $6\\sqrt{3}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Locus of mid points of chords of hyperbola $x^2 - y^2 = 4$ which touch parabola $y^2 = 8x$ is:",
    imageUrl: null,
    optionA: "(1) $y^2(x-2) = x^3$",
    optionB: "(2) $x^3(x-2) = y^2$",
    optionC: "(3) $x^2(x-2) = y^3$",
    optionD: "(4) $y^3(x-2) = x^2$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$\\lim_{x \\to 2} \\sum_{n=1}^9 \\frac{x}{n(n+1)x^2 + 2(2n+1)x + 4}$ is:",
    imageUrl: null,
    optionA: "(1) 5/24",
    optionB: "(2) 7/36",
    optionC: "(3) 1/5",
    optionD: "(4) 9/44",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "(S1): $(p \\to q) \\vee (\\sim q \\to p)$ tautology. (S2): $(p \\wedge \\sim q) \\wedge (\\sim p \\vee q)$ fallacy. Option:",
    imageUrl: null,
    optionA: "(1) Only S1 true",
    optionB: "(2) Both S1 and S2 false",
    optionC: "(3) Only S2 true",
    optionD: "(4) Both S1 and S2 true",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Matrix $A = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 1 \\\\ 1 & 0 & 0 \\end{bmatrix}$. $A^{2025} - A^{2020} = $:",
    imageUrl: null,
    optionA: "(1) $A^6 - A$",
    optionB: "(2) $A^6$",
    optionC: "(3) $A^5$",
    optionD: "(4) $A^5 - A$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Linear system $x+y+z=5, x+2y+3z=\\mu, x+3y+\\lambda z = 1$. p is prob of unique sol, q is prob of no sol. Option:",
    imageUrl: null,
    optionA: "(1) $p = 1/6, q = 5/36$",
    optionB: "(2) $p = 5/6, q = 1/36$",
    optionC: "(3) $p = 1/6, q = 1/36$",
    optionD: "(4) $p = 5/6, q = 5/36$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$\\sum_{r=1}^{50} \\tan^{-1}\\left(\\frac{1}{2r^2}\\right) = p$. Value of $\\tan p$ is:",
    imageUrl: null,
    optionA: "(1) 100",
    optionB: "(2) 51/50",
    optionC: "(3) 50/51",
    optionD: "(4) 101/102",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Domain of $f(x) = \\csc^{-1}\\left(\\frac{1+x}{x}\\right)$ is:",
    imageUrl: null,
    optionA: "(1) $[-1/2, \\infty) - \\{0\\}$",
    optionB: "(2) $(-1, -1/2] \\cup (0, \\infty)$",
    optionC: "(3) $[-1/2, 0) \\cup [1, \\infty)$",
    optionD: "(4) $(-1/2, \\infty) - \\{0\\}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$f(x) = x - [x], g(x) = 1 - x + [x], h(x) = \\min\\{f(x), g(x)\\}$ for $x \\in [-2, 2]$. h is:",
    imageUrl: null,
    optionA: "(1) Continuous in [-2, 2] but not diff at more than 4 points in (-2, 2)",
    optionB: "(2) Continuous in [-2, 2] but not diff at 3 points",
    optionC: "(3) Not continuous at 4 points",
    optionD: "(4) Not continuous at 3 points",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Local maximum value of $f(x) = (2/3)^{x^2}, x > 0$ is:",
    imageUrl: null,
    optionA: "(1) 1",
    optionB: "(2) $(4/\\sqrt{e})^{e/4}$",
    optionC: "(3) $e^{2/e}$",
    optionD: "(4) $(\\sqrt{e}/e)^{1/e}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$\\int_{-\\pi/3}^{\\pi/3} \\frac{1+\\sin x}{1+\\cos^2 x} dx = $:",
    imageUrl: null,
    optionA: "(1) $\\pi/2$",
    optionB: "(2) $5\\pi/2$",
    optionC: "(3) $3\\pi/2$",
    optionD: "(4) $3\\pi/4$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$\\int_0^5 \\frac{x+[x]}{e^{x-[x]}} dx = \\alpha e^{-1} + \\beta$. $5\\alpha + 6\\beta = 0$. $(\\alpha + \\beta)^2 = $:",
    imageUrl: null,
    optionA: "(1) 25",
    optionB: "(2) 100",
    optionC: "(3) 36",
    optionD: "(4) 16",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Solution curve $2x^2 dy + (e^y - 2x)dx = 0, y(e) = 1$. $y(1) = $:",
    imageUrl: null,
    optionA: "(1) $\\log_e(2e)$",
    optionB: "(2) $\\log_e 2$",
    optionC: "(3) 2",
    optionD: "(4) 0",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Square floor 10m x 10m. Angle GPH between diagonals is $\\cos^{-1}(1/5)$. Height of hall in meters is:",
    imageUrl: null,
    optionA: "(1) $5\\sqrt{2}$",
    optionB: "(2) $5\\sqrt{3}$",
    optionC: "(3) $5\\sqrt{10}$",
    optionD: "(4) 5",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Plane through (1, 2, 3) and line of intersection of $\\vec{r} \\cdot (\\hat{i}+\\hat{j}+4\\hat{k}) = 16$ and $\\vec{r} \\cdot (-\\hat{i}+\\hat{j}+\\hat{k}) = 6$. Point NOT lying on P is:",
    imageUrl: null,
    optionA: "(1) (4, 2, 2)",
    optionB: "(2) (6, -6, 2)",
    optionC: "(3) (-8, 8, 6)",
    optionD: "(4) (3, 3, 2)",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Fair die tossed until 6. X is number of tosses. Conditional prob $P(X \\ge 5 | X > 2) = $:",
    imageUrl: null,
    optionA: "(1) 25/36",
    optionB: "(2) 5/6",
    optionC: "(3) 11/36",
    optionD: "(4) 125/216",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Roots of $x^2 - x + 2\\lambda = 0$ are $\\alpha, \\beta$; roots of $3x^2 - 10x + 27\\lambda = 0$ are $\\alpha, \\gamma$. $\\beta/\\gamma = \\text{_____}$.",
    imageUrl: null,
    optionA: "18",
    optionB: "18",
    optionC: "18",
    optionD: "18",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Least positive integer n such that $\\frac{(2i)^n}{(1-i)^{n-2}}$ is positive integer is _____.",
    imageUrl: null,
    optionA: "6",
    optionB: "6",
    optionC: "6",
    optionD: "6",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Sum of 3-digit numbers $\\le 500$ formed without digit 1 which are multiples of 11 is _____.",
    imageUrl: null,
    optionA: "7744",
    optionB: "7744",
    optionC: "7744",
    optionD: "7744",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "A.P. $a_1 \\dots a_{10}$ diff -3, G.P. $b_1 \\dots b_{10}$ ratio 2. $c_k = a_k + b_k$. $c_2 = 12, c_3 = 13$. $\\sum_{k=1}^{10} c_k = \\text{_____}$.",
    imageUrl: null,
    optionA: "2021",
    optionB: "2021",
    optionC: "2021",
    optionD: "2021",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "$A_k = \\sum_{i=0}^9 \\binom{12}{12-k+i} + \\sum_{i=0}^8 \\binom{13}{13-k+i}$. $A_4 = A_3 = 190p$. Value of p is _____.",
    imageUrl: null,
    optionA: "49",
    optionB: "49",
    optionC: "49",
    optionD: "49",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Mean and variance of 3, 7, x, y ($x > y$) are 5 and 10. Mean of 3+2x, 7+2y, x+y, x-y is _____.",
    imageUrl: null,
    optionA: "12",
    optionB: "12",
    optionC: "12",
    optionD: "12",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Matrix A of $3 \\times 3$. $\\det(2 \\text{Adj}(2 \\text{Adj}(\\text{Adj}(2A)))) = 2^{41}$. $\\det(A^2) = \\text{_____}$.",
    imageUrl: null,
    optionA: "4",
    optionB: "4",
    optionC: "4",
    optionD: "4",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Local max and min of $f(x) = 2x^3 - 3x^2 - 12x$ at a and b. Total area between $y = f(x)$, x-axis, $x=a, x=b$ is A. $4A = \\text{_____}$.",
    imageUrl: null,
    optionA: "114",
    optionB: "114",
    optionC: "114",
    optionD: "114",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Projection of $\\hat{i} + 2\\hat{j} + \\hat{k}$ on sum of $(2\\hat{i} + 4\\hat{j} - 5\\hat{k})$ and $(-\\lambda\\hat{i} + 2\\hat{j} + 3\\hat{k})$ is 1. $\\lambda = \\text{_____}$.",
    imageUrl: null,
    optionA: "5",
    optionB: "5",
    optionC: "5",
    optionD: "5",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Foot of perpendicular from P(7, -2, 13) on plane containing $\\frac{x+1}{6} = \\frac{y-1}{7} = \\frac{z-3}{8}$ and $\\frac{x-1}{3} = \\frac{y-2}{5} = \\frac{z-3}{7}$ is Q. $(PQ)^2 = \\text{_____}$.",
    imageUrl: null,
    optionA: "96",
    optionB: "96",
    optionC: "96",
    optionD: "96",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  }
];

async function seedJee2021Aug26Shift1() {
  console.log(`🚀 Compiling JEE Main 2021 (26 Aug Shift 1) Paper with ${rawQuestions.length} questions...`);

  const paperData = {
    examName: "JEE Main",
    year: 2021,
    shiftName: "JEE Main 2021 (26 Aug Shift 1)",
    examDate: "2021-08-26T09:00:00Z",
    totalMarks: 300,
    totalQuestions: 90,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'JEE Main 2021 (26 Aug Shift 1).json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved paper JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding JEE Main 2021 (26 Aug Shift 1) into PostgreSQL via Prisma...`);
  
  let exam = await prisma.exam.findFirst({
    where: { name: "JEE Main" }
  });

  if (!exam) {
    exam = await prisma.exam.create({
      data: { name: "JEE Main" }
    });
  }

  const existingShift = await prisma.shift.findFirst({
    where: {
      examId: exam.id,
      name: "JEE Main 2021 (26 Aug Shift 1)"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "JEE Main 2021 (26 Aug Shift 1)",
      date: new Date("2021-08-26T09:00:00Z")
    }
  });
  console.log(`Created Shift "JEE Main 2021 (26 Aug Shift 1)" (ID: ${shift.id})`);

  console.log(`Inserting ${rawQuestions.length} questions into DB...`);
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
        positiveMarks: q.positiveMarks,
        negativeMarks: q.negativeMarks
      }
    });
  }

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for JEE Main 2021 (26 Aug Shift 1) into Database!`);
}

seedJee2021Aug26Shift1()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
