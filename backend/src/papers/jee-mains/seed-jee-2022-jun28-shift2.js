const prisma = require('../../lib/prisma');
const fs = require('fs');
const path = require('path');

const rawQuestions = [
  // ── PHYSICS (Q1 - Q30) ──
  {
    subject: "Physics",
    questionText: "Velocity (v) and acceleration (a) in two systems of units 1 and 2 are related as $v_2 = \\frac{n}{m^2} v_1$ and $a_2 = \\frac{a_1}{mn}$ respectively. Relations for distance and time in two systems respectively are:",
    imageUrl: null,
    optionA: "(1) $\\frac{n^3}{m^3} L_1 = L_2$ and $\\frac{n^2}{m} T_1 = T_2$",
    optionB: "(2) $L_1 = \\frac{n^4}{m^2} L_2$ and $T_1 = \\frac{n^2}{m} T_2$",
    optionC: "(3) $L_1 = \\frac{n^2}{m} L_2$ and $T_1 = \\frac{n^4}{m^2} T_2$",
    optionD: "(4) $\\frac{n^2}{m} L_1 = L_2$ and $\\frac{n^4}{m^2} T_1 = T_2$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A ball is spun with angular acceleration $\\alpha = 6t^2 - 2t$. At $t = 0$, ball has angular velocity $10\\text{ rad s}^{-1}$ and angular position 4 rad. Expression for angular position is:",
    imageUrl: null,
    optionA: "(1) $\\frac{3}{4} t^4 - t^2 + 10t$",
    optionB: "(2) \\frac{t^4}{2} - \\frac{t^3}{3} + 10t + 4$",
    optionC: "(3) $\\frac{2t^4}{3} - \\frac{t^3}{6} + 10t + 12$",
    optionD: "(4) $2t^4 - \\frac{t^3}{2} + 5t + 4$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A block of mass 2 kg moving on horizontal surface with speed $4\\text{ ms}^{-1}$ enters rough surface ranging $x = 0.5\\text{ m}$ to $x = 1.5\\text{ m}$. Retarding force $F = -kx$ where $k = 12\\text{ Nm}^{-1}$. Speed as it crosses rough surface is:",
    imageUrl: null,
    optionA: "(1) Zero",
    optionB: "(2) $1.5\\text{ ms}^{-1}$",
    optionC: "(3) $2.0\\text{ ms}^{-1}$",
    optionD: "(4) $2.5\\text{ ms}^{-1}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A $\\sqrt{34}\\text{ m}$ long ladder weighing 10 kg leans on frictionless wall. Feet rest 3 m away from wall. Ratio of reaction forces of wall to floor $F_w / F_f$ is:",
    imageUrl: null,
    optionA: "(1) $6/\\sqrt{110}$",
    optionB: "(2) $3/\\sqrt{113}$",
    optionC: "(3) $3/\\sqrt{109}$",
    optionD: "(4) $2/\\sqrt{109}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Water falls from 40 m high dam at rate $9 \\times 10^4\\text{ kg/h}$. 50% PE converted to electrical energy. Number of 100 W lamps that can be lit is:",
    imageUrl: null,
    optionA: "(1) 25",
    optionB: "(2) 50",
    optionC: "(3) 100",
    optionD: "(4) 18",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Two objects of equal masses placed at certain distance attract with force F. If 1/3 mass of one object is transferred to the other, new force will be:",
    imageUrl: null,
    optionA: "(1) $\\frac{2}{9} F$",
    optionB: "(2) \\frac{16}{9} F$",
    optionC: "(3) $\\frac{8}{9} F$",
    optionD: "(4) F",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Water drop radius $1\\mu\\text{m}$ falls in air (viscosity $1.8 \\times 10^{-5}\\text{ Nsm}^{-2}$). Terminal velocity is:",
    imageUrl: null,
    optionA: "(1) $145.4 \\times 10^{-6}\\text{ ms}^{-1}$",
    optionB: "(2) $118.0 \\times 10^{-6}\\text{ ms}^{-1}$",
    optionC: "(3) $132.6 \\times 10^{-6}\\text{ ms}^{-1}$",
    optionD: "(4) $123.4 \\times 10^{-6}\\text{ ms}^{-1}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Ideal gas in cyclic process ABCA absorbs 40 J during AB, no heat during BC, rejects 60 J during CA. Work 50 J done on gas during BC. Internal energy at A is 1560 J. Work done during CA is:",
    imageUrl: null,
    optionA: "(1) 20 J",
    optionB: "(2) 30 J",
    optionC: "(3) -30 J",
    optionD: "(4) -60 J",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Effect on RMS velocity of oxygen molecules if temperature is doubled and oxygen molecule dissociates into atomic oxygen:",
    imageUrl: null,
    optionA: "(1) Remains same",
    optionB: "(2) Doubles",
    optionC: "(3) Becomes half",
    optionD: "(4) Becomes four times",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Two point charges $+8 \\mu\\text{C}$ and $-8 \\mu\\text{C}$ at distance d. Electric field at mid point O is $6.4 \\times 10^4\\text{ NC}^{-1}$. Distance d is:",
    imageUrl: null,
    optionA: "(1) 2.0 m",
    optionB: "(2) 3.0 m",
    optionC: "(3) 1.0 m",
    optionD: "(4) 4.0 m",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Resistance of wire is $2\\Omega$ and $3\\Omega$ at $10^\\circ\\text{C}$ and $30^\\circ\\text{C}$. Temperature coefficient of resistance is:",
    imageUrl: null,
    optionA: "(1) $0.033^\\circ\\text{C}^{-1}$",
    optionB: "(2) $-0.033^\\circ\\text{C}^{-1}$",
    optionC: "(3) $0.011^\\circ\\text{C}^{-1}$",
    optionD: "(4) $0.055^\\circ\\text{C}^{-1}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Solenoid filled with magnetic material susceptibility $1.2 \\times 10^{-5}$. Fractional increase in magnetic field inside solenoid is:",
    imageUrl: null,
    optionA: "(1) $1.2 \\times 10^{-5}$",
    optionB: "(2) $1.2 \\times 10^{-3}$",
    optionC: "(3) $1.8 \\times 10^{-3}$",
    optionD: "(4) $2.4 \\times 10^{-5}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Two parallel long wires 0.20 m apart in vacuum carry current x A in same direction. Attractive force per meter is $2 \\times 10^{-6}\\text{ N}$. Value of x is:",
    imageUrl: null,
    optionA: "(1) 1",
    optionB: "(2) 2.4",
    optionC: "(3) 1.4",
    optionD: "(4) 2",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "If number of turns in coil halved and radius of wire doubled, electrical power dissipated due to induced current would be:",
    imageUrl: null,
    optionA: "(1) Halved",
    optionB: "(2) Quadrupled",
    optionC: "(3) The same",
    optionD: "(4) Doubled",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "EM wave propagating in x-direction wavelength 8 mm, max electric field $60\\text{ Vm}^{-1}$ in y-direction. Correct equations for $E_y$ and $B_z$ are Option 2.",
    imageUrl: null,
    optionA: "(1) Option 1",
    optionB: "(2) $E_y = 60 \\sin[\\frac{\\pi}{4} \\times 10^3 (x - 3 \\times 10^8 t)]\\hat{j}$, $B_z = 2 \\times 10^{-7} \\sin[\\dots]\\hat{k}$",
    optionC: "(3) Option 3",
    optionD: "(4) Option 4",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "YDSE with $\\lambda$, glass plate ($\\mu = 1.5$) thickness $x\\lambda$ introduced in one path. Intensity at central max position remains unchanged. Value of x is:",
    imageUrl: null,
    optionA: "(1) 3",
    optionB: "(2) 2",
    optionC: "(3) 1.5",
    optionD: "(4) 0.5",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Max KE of photo-electrons $K_1, K_2$ for $\\lambda_1, \\lambda_2$. If $\\lambda_1 = 3 \\lambda_2$, then:",
    imageUrl: null,
    optionA: "(1) $K_1 > K_2 / 3$",
    optionB: "(2) $K_1 < K_2 / 3$",
    optionC: "(3) $K_1 = K_2 / 3$",
    optionD: "(4) $K_2 = K_1 / 3$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Radioactivity statements: A. Random spontaneous process, B. Decays exponentially, C. Slope of $\\log_e(N)$ vs t is reciprocal of mean life, D. Product of $\\lambda$ and $T_{1/2}$ not constant. Correct options:",
    imageUrl: null,
    optionA: "(1) (A) and (B) only",
    optionB: "(2) (B) and (D) only",
    optionC: "(3) (B) and (C) only",
    optionD: "(4) (C) and (D) only",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Input voltage $V_{in}$ across anti-parallel diodes $D_1, D_2$ with cut-in 0.6V. Output waveform $V_0$ is clipped above 0.6V and below -0.6V (Option 4).",
    imageUrl: null,
    optionA: "(1) Waveform 1",
    optionB: "(2) Waveform 2",
    optionC: "(3) Waveform 3",
    optionD: "(4) Clipped waveform at $\\pm 0.6\\text{V}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "AM wave $V_{AM} = 10[1 + 0.4 \\cos(2\\pi \\times 10^4 t)] \\cos(2\\pi \\times 10^7 t)$. Total bandwidth is:",
    imageUrl: null,
    optionA: "(1) 10 kHz",
    optionB: "(2) 20 MHz",
    optionC: "(3) 20 kHz",
    optionD: "(4) 10 MHz",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Thickness of wire measured using screw gauge: 1.22mm, 1.23mm, 1.19mm, 1.20mm. Percentage error is $\\frac{x}{121} \\%$. Value of x is _____.",
    imageUrl: null,
    optionA: "150",
    optionB: "150",
    optionC: "150",
    optionD: "150",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Zener breakdown $V_Z = 8\\text{ V}$, max current $I_{ZM} = 10\\text{ mA}$, input $V_i = 10\\text{ V}$, $R = 100\\Omega$. Ratio of max to min value of load resistance $R_L$ is _____.",
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
    questionText: "YDSE fringe angular width $0.35^\\circ$ at 2m for $\\lambda = 450\\text{ nm}$. When immersed in medium $\\mu = 7/5$, angular width is $1/\\alpha$. Value of $\\alpha$ is _____.",
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
    subject: "Physics",
    questionText: "Circuit $V_L = V_C = 2 V_R, f = 50\\text{ Hz}$. Inductance $L = 1/(K\\pi)\\text{ mH}$. Value of K is _____.",
    imageUrl: null,
    optionA: "0",
    optionB: "0",
    optionC: "0",
    optionD: "0",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "All resistances $1\\Omega$. Current I is $(a/5)\\text{ A}$. Value of a is _____.",
    imageUrl: null,
    optionA: "8",
    optionB: "8",
    optionC: "8",
    optionD: "8",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Capacitor $C_1 = 5\\mu\\text{F}$ charged to 30 V, connected to uncharged $C_2 = 10\\mu\\text{F}$. Equilibrium charge on $C_2$ is _____ $\\mu\\text{C}$.",
    imageUrl: null,
    optionA: "100",
    optionB: "100",
    optionC: "100",
    optionD: "100",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Tuning fork 340 Hz resonates in fundamental mode with air column 125 cm in tube closed at one end. Minimum height of water to observe resonance again is _____ cm. ($v = 340\\text{ m/s}$)",
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
    questionText: "Liquid density $750\\text{ kgm}^{-3}$ flows through pipe tapering from $A_1 = 1.2 \\times 10^{-2}\\text{ m}^2$ to $A_2 = A_1 / 2$. Pressure diff 4500 Pa. Flow rate is $x \\times 10^{-3}\\text{ m}^3\\text{s}^{-1}$. x is _____.",
    imageUrl: null,
    optionA: "24",
    optionB: "24",
    optionC: "24",
    optionD: "24",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Uniform disc $M = 4\\text{ kg}, R = 10\\text{ cm}$. Block $m = 2\\text{ kg}$ hangs from cord. Tension in cord is _____ N. ($g = 10\\text{ m/s}^2$)",
    imageUrl: null,
    optionA: "10",
    optionB: "10",
    optionC: "10",
    optionD: "10",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Car covers distance in 3 equal parts with velocities $v_1, v_2, v_3$. If $v_3 = 3v_1, v_2 = 2v_1, v_1 = 11\\text{ ms}^{-1}$, average velocity is _____ $\\text{ms}^{-1}$.",
    imageUrl: null,
    optionA: "18",
    optionB: "18",
    optionC: "18",
    optionD: "18",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── CHEMISTRY (Q31 - Q60) ──
  {
    subject: "Chemistry",
    questionText: "Compound A contains 8.7% H, 74% C, 17.3% N. Molar mass 162. Molecular formula is:",
    imageUrl: null,
    optionA: "(1) $\\text{C}_4\\text{H}_6\\text{N}_2$",
    optionB: "(2) $\\text{C}_2\\text{H}_3\\text{N}$",
    optionC: "(3) $\\text{C}_5\\text{H}_7\\text{N}$",
    optionD: "(4) $\\text{C}_{10}\\text{H}_{14}\\text{N}_2$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statements: (A) Principal quantum number n positive integer, (B) Azimuthal l has values 0..n, (C) Magnetic $m_l$ has (2l+1) values, (D) Spin $\\pm 1/2$, (E) For l=5, total 9 orbitals. Correct options:",
    imageUrl: null,
    optionA: "(1) (A), (B) and (C)",
    optionB: "(2) (A), (C), (D) and (E)",
    optionC: "(3) (A), (C) and (D)",
    optionD: "(4) (A), (B), (C) and (D)",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "In structure of $\\text{SF}_4$, lone pair of electrons on S is in:",
    imageUrl: null,
    optionA: "(1) Equatorial position with two lone pair-bond pair repulsions at $90^\\circ$",
    optionB: "(2) Equatorial position with three lone pair-bond pair repulsions",
    optionC: "(3) Axial position with three lone pair-bond pair repulsion",
    optionD: "(4) Axial position with two lone pair-bond pair repulsion",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Buffer solution of propanoic acid and sodium salt with pH 4. Ratio $[\\text{CH}_3\\text{CH}_2\\text{COO}^-] / [\\text{CH}_3\\text{CH}_2\\text{COOH}]$ required is ($K_a = 1.3 \\times 10^{-5}$):",
    imageUrl: null,
    optionA: "(1) 0.03",
    optionB: "(2) 0.13",
    optionC: "(3) 0.23",
    optionD: "(4) 0.33",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List I with List II:\\nA. Negatively charged sol -> II. CdS sol\\nB. Macromolecular colloid -> III. Starch\\nC. Positively charged sol -> I. $\\text{Fe}_2\\text{O}_3 \\cdot x\\text{H}_2\\text{O}$\\nD. Cheese -> IV. A gel",
    imageUrl: null,
    optionA: "(1) A - II, B - III, C - IV, D - I",
    optionB: "(2) A - II, B - I, C - III, D - IV",
    optionC: "(3) A - II, B - III, C - I, D - IV",
    optionD: "(4) A - I, B - III, C - II, D - IV",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match oxide with nature:\\nA. $\\text{Cl}_2\\text{O}_7 \\to$ Acidic (IV)\\nB. $\\text{Na}_2\\text{O} \\to$ Basic (II)\\nC. $\\text{Al}_2\\text{O}_3 \\to$ Amphoteric (I)\\nD. $\\text{N}_2\\text{O} \\to$ Neutral (III)",
    imageUrl: null,
    optionA: "(1) A - IV, B - III, C - I, D - II",
    optionB: "(2) A - IV, B - II, C - I, D - III",
    optionC: "(3) A - II, B - IV, C - III, D - I",
    optionD: "(4) A - I, B - II, C - III, D - IV",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "In metallurgical extraction of copper: $\\text{FeO} + \\text{SiO}_2 \\to \\text{FeSiO}_3$. $\\text{FeO}$ and $\\text{FeSiO}_3$ are:",
    imageUrl: null,
    optionA: "(1) Gangue and flux",
    optionB: "(2) Flux and slag",
    optionC: "(3) Slag and flux",
    optionD: "(4) Gangue and slag",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Isotopes of hydrogen (${}^1\\text{H}, {}^2\\text{H}, {}^3\\text{H}$) differ in:",
    imageUrl: null,
    optionA: "(1) Number of protons",
    optionB: "(2) Atomic number",
    optionC: "(3) Electronic configuration",
    optionD: "(4) Atomic mass",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Among the following, basic oxide is:",
    imageUrl: null,
    optionA: "(1) $\\text{SO}_3$",
    optionB: "(2) $\\text{SiO}_2$",
    optionC: "(3) CaO",
    optionD: "(4) $\\text{Al}_2\\text{O}_3$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Among given oxides of nitrogen $\\text{N}_2\\text{O}, \\text{N}_2\\text{O}_3, \\text{N}_2\\text{O}_4, \\text{N}_2\\text{O}_5$, number of compounds having N-N bond is:",
    imageUrl: null,
    optionA: "(1) 1",
    optionB: "(2) 2",
    optionC: "(3) 3",
    optionD: "(4) 4",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Oxoacid of sulphur containing 'S' in two different oxidation states is:",
    imageUrl: null,
    optionA: "(1) $\\text{H}_2\\text{S}_2\\text{O}_3$",
    optionB: "(2) $\\text{H}_2\\text{S}_2\\text{O}_6$",
    optionC: "(3) $\\text{H}_2\\text{S}_2\\text{O}_7$",
    optionD: "(4) $\\text{H}_2\\text{S}_2\\text{O}_8$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Correct statement about photo-chemical smog is:",
    imageUrl: null,
    optionA: "(1) Occurs in humid climate",
    optionB: "(2) Mixture of smoke, fog and $\\text{SO}_2$",
    optionC: "(3) Reducing smog",
    optionD: "(4) Results from reaction of unsaturated hydrocarbons",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Correct IUPAC name of $\\text{O}_2\\text{N}-\\text{CH}_2-\\text{C(CH}_3)=\\text{CH}-\\text{CO}-\\text{CH}_2-\\text{CHO}$ is 4-methyl-6-nitro-3-oxohept-4-enal (Option 3).",
    imageUrl: null,
    optionA: "(1) 4-methyl-2-nitro-5-oxohept-3-enal",
    optionB: "(2) 4-methyl-5-oxo-2-nitrohept-3-enal",
    optionC: "(3) 4-methyl-6-nitro-3-oxohept-4-enal",
    optionD: "(4) 6-formyl-4-methyl-2-nitrohex-3-enal",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Major product P of pinacol-pinacolone rearrangement of 1,2-dimethylcyclohexane-1,2-diol is 2,2-dimethylcyclohexanone (Option 3).",
    imageUrl: null,
    optionA: "(1) Product 1",
    optionB: "(2) Product 2",
    optionC: "(3) 2,2-dimethylcyclohexanone",
    optionD: "(4) Product 4",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Product A of reaction sequence $\\text{4-bromophenol} \\xrightarrow{\\text{(i) } Cl_2, \\Delta} \\xrightarrow{\\text{(ii) } CN^-} \\xrightarrow{\\text{(iii) } H_2O/H^+}$ is 4-bromophenylacetic acid derivative (Option 3).",
    imageUrl: null,
    optionA: "(1) Product 1",
    optionB: "(2) Product 2",
    optionC: "(3) Product A derivative",
    optionD: "(4) Product 4",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Isobutyraldehyde on reaction with formaldehyde and $\\text{K}_2\\text{CO}_3$ gives A. A with KCN yields B, which on hydrolysis gives stable C. Compound C is 3-hydroxy-2,2-dimethylpropanal derivative (Option 3).",
    imageUrl: null,
    optionA: "(1) Product 1",
    optionB: "(2) Product 2",
    optionC: "(3) Lactone derivative",
    optionD: "(4) Product 4",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "With respect to nitration of aniline $\\text{Ph-NH}_2 + \\text{HNO}_3/\\text{H}_2\\text{SO}_4 \\to$ products: (A) o- and p-predominant, (B) p- and m-predominant, (C) $\\text{HNO}_3$ acts as acid, (D) $\\text{H}_2\\text{SO}_4$ acts as acid. Correct option:",
    imageUrl: null,
    optionA: "(1) (A) and (C)",
    optionB: "(2) (A) and (D)",
    optionC: "(3) (B) and (D)",
    optionD: "(4) (B) and (C)",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Assertion (A): Natural rubber is linear polymer of isoprene called cis-polyisoprene with elastic properties.\\nReason (R): Molecules consist of chains held together by strong polar interactions.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both A and R true, R is correct explanation",
    optionB: "(2) Both A and R true, R NOT correct explanation",
    optionC: "(3) A true, R false",
    optionD: "(4) A false, R true",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "When sugar 'X' is boiled with dilute $\\text{H}_2\\text{SO}_4$ in alcoholic solution, two isomers A and B formed. A on oxidation with $\\text{HNO}_3$ yields saccharic acid, B is laevorotatory. Compound X is:",
    imageUrl: null,
    optionA: "(1) Maltose",
    optionB: "(2) Sucrose",
    optionC: "(3) Lactose",
    optionD: "(4) Starch",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The drug Tagamet (cimetidine) structure is Option 3.",
    imageUrl: null,
    optionA: "(1) Structure 1",
    optionB: "(2) Structure 2",
    optionC: "(3) Cimetidine structure",
    optionD: "(4) Structure 4",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "100 g ideal gas in cylinder 416 L at 27°C, 1.5 bar. Molar mass of gas is _____ $\\text{g mol}^{-1}$. ($R = 0.083$)",
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
    subject: "Chemistry",
    questionText: "Combustion of 1 mol Mg in open container at 300K, 1 bar, $\\Delta_c H^0 = -601.70\\text{ kJ mol}^{-1}$. Internal energy change magnitude is _____ kJ.",
    imageUrl: null,
    optionA: "600",
    optionB: "600",
    optionC: "600",
    optionD: "600",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "2.5 g protein containing only glycine ($\\text{C}_2\\text{H}_5\\text{NO}_2$) dissolved in water to make 500 mL. Osmotic pressure at 300K is $5.03 \\times 10^{-3}\\text{ bar}$. Total glycine units in protein is _____.",
    imageUrl: null,
    optionA: "330",
    optionB: "330",
    optionC: "330",
    optionD: "330",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "For reactions $\\text{Sn}^{2+} + 2e^- \\to \\text{Sn} (E^0 = -0.140\\text{V})$ and $\\text{Sn}^{4+} + 4e^- \\to \\text{Sn} (E^0 = -0.010\\text{V})$. Electrode potential for $\\text{Sn}^{4+}/\\text{Sn}^{2+}$ is _____ $\\times 10^{-2}\\text{ V}$.",
    imageUrl: null,
    optionA: "16",
    optionB: "16",
    optionC: "16",
    optionD: "16",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Radioactive element half life 200 days. Percentage of original activity remaining after 83 days is _____ %.",
    imageUrl: null,
    optionA: "75",
    optionB: "75",
    optionC: "75",
    optionD: "75",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Among $[Fe(CN)_6]^{4-}, [Fe(CN)_6]^{3-}, [Ti(CN)_6]^{3-}, [Ni(CN)_4]^{2-}, [Co(CN)_6]^{3-}$, number of paramagnetic complexes is _____.",
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
    subject: "Chemistry",
    questionText: "Number of complex(es) existing in cis-trans form among (a) $\\text{CoCl}_3 \\cdot 4\\text{NH}_3$, (b) $\\text{CoCl}_3 \\cdot 5\\text{NH}_3$, (c) $\\text{CoCl}_3 \\cdot 6\\text{NH}_3$, (d) $\\text{CoCl(NO}_3)_2 \\cdot 5\\text{NH}_3$ is _____.",
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
    subject: "Chemistry",
    questionText: "Combustion of 0.492 g organic compound (C, H, O) gives 0.793 g $\\text{CO}_2$ and 0.442 g $\\text{H}_2\\text{O}$. Percentage of oxygen is _____ %.",
    imageUrl: null,
    optionA: "46",
    optionB: "46",
    optionC: "46",
    optionD: "46",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Major product of reaction of allylic alkene with $Br_2, h\\nu$ contains _____ bromine atom(s).",
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
    subject: "Chemistry",
    questionText: "0.01 M $\\text{KMnO}_4$ added to 20.0 mL of 0.05 M Mohr's salt. Volume of $\\text{KMnO}_4$ left in 50 mL burette is _____ mL.",
    imageUrl: null,
    optionA: "30",
    optionB: "30",
    optionC: "30",
    optionD: "30",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── MATHEMATICS (Q61 - Q90) ──
  {
    subject: "Mathematics",
    questionText: "$R_1 = \\{(a, b) \\in \\mathbb{N} \\times \\mathbb{N} : |a-b| \\le 13\\}$ and $R_2 = \\{(a, b) \\in \\mathbb{N} \\times \\mathbb{N} : |a-b| \\neq 13\\}$. Then on $\\mathbb{N}$:",
    imageUrl: null,
    optionA: "(1) Both $R_1, R_2$ equivalence",
    optionB: "(2) Neither $R_1$ nor $R_2$ equivalence",
    optionC: "(3) $R_1$ equivalence, $R_2$ not",
    optionD: "(4) $R_2$ equivalence, $R_1$ not",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Quadratic polynomial $f(x)$ with $f(-2) + f(3) = 0$. One root is -1. Sum of roots of $f(x) = 0$ is:",
    imageUrl: null,
    optionA: "(1) 11/3",
    optionB: "(2) 7/3",
    optionC: "(3) 13/3",
    optionD: "(4) 14/3",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Number of ways to distribute 30 identical candies among 4 children $C_1, C_2, C_3, C_4$ so $C_2 \\in [4, 7]$ and $C_3 \\in [2, 6]$ is:",
    imageUrl: null,
    optionA: "(1) 205",
    optionB: "(2) 615",
    optionC: "(3) 510",
    optionD: "(4) 430",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Term independent of x in expansion of $(1 - x^2 + 3x^3) (\\frac{5}{2} x^3 - \\frac{1}{5x^2})^{11}, x \\neq 0$ is:",
    imageUrl: null,
    optionA: "(1) 7/40",
    optionB: "(2) 33/200",
    optionC: "(3) 39/200",
    optionD: "(4) 11/50",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If n arithmetic means inserted between a and 100 such that ratio of first to last mean is 1:7 and $a + n = 33$, then n is:",
    imageUrl: null,
    optionA: "(1) 21",
    optionB: "(2) 22",
    optionC: "(3) 23",
    optionD: "(4) 24",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Functions $f(x) = [x]$ for $x < 0$, $|1-x|$ for $x \\ge 0$; $g(x) = e^x - x$ for $x < 0$, $(x-1)^2 - 1$ for $x \\ge 0$. Function $(f \\circ g)$ is discontinuous at exactly:",
    imageUrl: null,
    optionA: "(1) One point",
    optionB: "(2) Two points",
    optionC: "(3) Three points",
    optionD: "(4) Four points",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Function f with $f(\\pi/4) = \\sqrt{2}, f(\\pi/2) = 0, f'(\\pi/2) = 1$. $g(x) = \\int_x^{\\pi/4} (f'(t) \\sec t + \\tan t \\sec t f(t)) dt$. $\\lim_{x \\to (\\pi/2)^-} g(x) = $:",
    imageUrl: null,
    optionA: "(1) 2",
    optionB: "(2) 3",
    optionC: "(3) 4",
    optionD: "(4) -3",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Continuous function satisfying $f(x) + f(x+k) = n, \\forall x \\in \\mathbb{R}$. $I_1 = \\int_0^{4nk} f(x)dx, I_2 = \\int_{-k}^{3k} f(x)dx$. Then:",
    imageUrl: null,
    optionA: "(1) $I_1 + 2I_2 = 4nk$",
    optionB: "(2) $I_1 + 2I_2 = 2nk$",
    optionC: "(3) $I_1 + nI_2 = 4n^2 k$",
    optionD: "(4) $I_1 + nI_2 = 6n^2 k$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Area of region enclosed by curve $y = 3 - |x - 1/2| - |x + 1|$ and x-axis is:",
    imageUrl: null,
    optionA: "(1) 9/4",
    optionB: "(2) 45/16",
    optionC: "(3) 27/8",
    optionD: "(4) 63/16",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Solution curve $2y e^{x/y^2} dx + e^{x/y^2}(y^2 - 4x) dy = 0, x(1) = 0$. $x(e) = $:",
    imageUrl: null,
    optionA: "(1) $e \\log_e(2)$",
    optionB: "(2) $-e \\log_e(2)$",
    optionC: "(3) $e^2 \\log_e(2)$",
    optionD: "(4) $-e^2 \\log_e(2)$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Slope of tangent to $y = f(x)$ at (x, y) is $2 \\tan x(\\cos x - y)$. Passes through $(\\pi/4, 0)$. Value of $\\int_0^{\\pi/2} y dx$ is:",
    imageUrl: null,
    optionA: "(1) $(2-\\sqrt{2}) + \\pi/\\sqrt{2}$",
    optionB: "(2) $2 - \\pi/\\sqrt{2}$",
    optionC: "(3) $(2+\\sqrt{2}) + \\pi/\\sqrt{2}$",
    optionD: "(4) $2 + \\pi/\\sqrt{2}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Triangle bounded by $L_1 : 2x + 5y = 10; L_2 : -4x + 3y = 12$ and $L_3$ through P(2, 3) intersecting $L_2$ at A, $L_1$ at B. P divides AB in 1:3. Area of triangle is:",
    imageUrl: null,
    optionA: "(1) 110/13",
    optionB: "(2) 132/13",
    optionC: "(3) 142/13",
    optionD: "(4) 151/13",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Hyperbola $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$. Eccentricity e and latus rectum l of conjugate hyperbola $e', l'$. If $e^2 = 11/14$ and $(e')^2 = \\frac{11}{8} l'$, then $77a + 44b = $:",
    imageUrl: null,
    optionA: "(1) 100",
    optionB: "(2) 110",
    optionC: "(3) 120",
    optionD: "(4) 130",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Vectors $\\vec{a} = \\alpha\\hat{i} + 2\\hat{j} - \\hat{k}, \\vec{b} = -2\\hat{i} + \\alpha\\hat{j} + \\hat{k}$. Parallelogram area $\\sqrt{15(\\alpha^2+4)}$. $2|\\vec{a}|^2 + (\\vec{a} \\cdot \\vec{b})|\\vec{b}|^2 = $:",
    imageUrl: null,
    optionA: "(1) 10",
    optionB: "(2) 7",
    optionC: "(3) 9",
    optionD: "(4) 14",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Parabola vertex (2, -1), directrix $4x - 3y = 21$. Length of latus rectum is:",
    imageUrl: null,
    optionA: "(1) 2",
    optionB: "(2) 8",
    optionC: "(3) 12",
    optionD: "(4) 16",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Plane $ax + by + cz = d$ through (2, 3, -5) perpendicular to $2x + y - 5z = 10$ and $3x + 5y - 7z = 12$. $d > 0$, gcd(|a|, |b|, |c|, d) = 1. $a + 7b + c + 20d = $:",
    imageUrl: null,
    optionA: "(1) 18",
    optionB: "(2) 20",
    optionC: "(3) 24",
    optionD: "(4) 22",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Probability that a randomly chosen one-one function from $\{a, b, c, d\} \\to \\{1, 2, 3, 4, 5\\}$ satisfies $f(a) + 2f(b) - f(c) = f(d)$ is:",
    imageUrl: null,
    optionA: "(1) 1/24",
    optionB: "(2) 1/40",
    optionC: "(3) 1/30",
    optionD: "(4) 1/20",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Value of $\\lim_{n \\to \\infty} 6 \\tan\\left(\\sum_{r=1}^n \\tan^{-1}\\left(\\frac{1}{r^2+3r+3}\\right)\\right)$ is:",
    imageUrl: null,
    optionA: "(1) 1",
    optionB: "(2) 2",
    optionC: "(3) 3",
    optionD: "(4) 6",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Vector $\\vec{a}$ perpendicular to $3\\hat{i} + \\frac{1}{2}\\hat{j} + 2\\hat{k}$. $\\vec{a} \\times (2\\hat{i}+\\hat{k}) = 2\\hat{i} - 13\\hat{j} - 4\\hat{k}$. Projection of $\\vec{a}$ on $2\\hat{i}+2\\hat{j}+\\hat{k}$ is:",
    imageUrl: null,
    optionA: "(1) 1/3",
    optionB: "(2) 1",
    optionC: "(3) 5/3",
    optionD: "(4) 7/3",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If $\\cot \\alpha = 1, \\sec \\beta = -5/3$ with $\\pi < \\alpha < 3\\pi/2, \\pi/2 < \\beta < \\pi$, then $\\tan(\\alpha + \\beta)$ and quadrant of $\\alpha + \\beta$ are:",
    imageUrl: null,
    optionA: "(1) -1/7 and IVth quadrant",
    optionB: "(2) 7 and Ist quadrant",
    optionC: "(3) -7 and IVth quadrant",
    optionD: "(4) 1/7 and Ist quadrant",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Image of P(1, 2, 3) in line $\\frac{x-6}{3} = \\frac{y-1}{2} = \\frac{z-2}{3}$ is Q. R($\\alpha, \\beta, \\gamma$) divides PQ in 1:3. $22(\\alpha + \\beta + \\gamma) = \\text{_____}$.",
    imageUrl: null,
    optionA: "125",
    optionB: "125",
    optionC: "125",
    optionD: "125",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "7 students, average marks 62, variance 20. Fail if $< 50$ marks. Worst case, number of students that can fail is _____.",
    imageUrl: null,
    optionA: "0",
    optionB: "0",
    optionC: "0",
    optionD: "0",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Diameter of circle $x^2 + y^2 - 2\\sqrt{2}x - 6\\sqrt{2}y + 14 = 0$ is chord of $(x - 2\\sqrt{2})^2 + (y - 2\\sqrt{2})^2 = r^2$. $r^2 = \\text{_____}$.",
    imageUrl: null,
    optionA: "10",
    optionB: "10",
    optionC: "10",
    optionD: "10",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "If $\\lim_{x \\to 1} \\frac{\\sin(3x^2-4x+1) - x^2 + 1}{2x^3 - 7x^2 + ax + b} = -2$, then $a - b = \\text{_____}$.",
    imageUrl: null,
    optionA: "11",
    optionB: "11",
    optionC: "11",
    optionD: "11",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "G.P. sum $S_n$, first term $n^2$, common ratio $1/(n+1)^2$. $\\frac{1}{26} + \\sum_{n=1}^{50} (S_n + \\frac{2}{n+1} - n - 1) = \\text{_____}$.",
    imageUrl: null,
    optionA: "41651",
    optionB: "41651",
    optionC: "41651",
    optionD: "41651",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Linear system $2x - 3y = \\gamma + 5, \\alpha x + 5y = \\beta + 1$ has infinitely many solutions. $|9\\alpha + 3\\beta + 5\\gamma| = \\text{_____}$.",
    imageUrl: null,
    optionA: "58",
    optionB: "58",
    optionC: "58",
    optionD: "58",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Matrix $A = \\begin{pmatrix} 1+i & 1 \\\\ -i & 0 \\end{pmatrix}$. Number of elements in $\{n \\in \\{1 \\dots 100\\} : A^n = A\}$ is _____.",
    imageUrl: null,
    optionA: "25",
    optionB: "25",
    optionC: "25",
    optionD: "25",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Sum of squares of modulus of all complex numbers z satisfying $\\bar{z} = i z^2 + z^2 - z$ is _____.",
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
    subject: "Mathematics",
    questionText: "$S = \\{1, 2, 3, 4\\}$. Number of elements in $\{f : S \\times S \\to S : f \\text{ onto and } f(a, b) = f(b, a) \\ge a \\forall (a, b)\\}$ is _____.",
    imageUrl: null,
    optionA: "37",
    optionB: "37",
    optionC: "37",
    optionD: "37",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Propositions $p \\vee r \\vee s, p \\vee r \\vee \\sim s, p \\vee \\sim q \\vee s, \\sim p \\vee \\sim r \\vee s, \\dots$. Max propositions made simultaneously true is _____.",
    imageUrl: null,
    optionA: "9",
    optionB: "9",
    optionC: "9",
    optionD: "9",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  }
];

async function seedJee2022Jun28Shift2() {
  console.log(`🚀 Compiling JEE Main 2022 (28 Jun Shift 2) Paper with ${rawQuestions.length} questions...`);

  const paperData = {
    examName: "JEE Main",
    year: 2022,
    shiftName: "JEE Main 2022 (28 Jun Shift 2)",
    examDate: "2022-06-28T15:00:00Z",
    totalMarks: 300,
    totalQuestions: 90,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'JEE Main 2022 (28 Jun Shift 2).json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved paper JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding JEE Main 2022 (28 Jun Shift 2) into PostgreSQL via Prisma...`);
  
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
      name: "JEE Main 2022 (28 Jun Shift 2)"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "JEE Main 2022 (28 Jun Shift 2)",
      date: new Date("2022-06-28T15:00:00Z")
    }
  });
  console.log(`Created Shift "JEE Main 2022 (28 Jun Shift 2)" (ID: ${shift.id})`);

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

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for JEE Main 2022 (28 Jun Shift 2) into Database!`);
}

seedJee2022Jun28Shift2()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
