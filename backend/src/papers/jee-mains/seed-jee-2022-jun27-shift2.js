const prisma = require('../../lib/prisma');
const fs = require('fs');
const path = require('path');

const rawQuestions = [
  // ── PHYSICS (Q1 - Q30) ──
  {
    subject: "Physics",
    questionText: "The SI unit of a physical quantity is pascal-second. The dimensional formula of this quantity will be:",
    imageUrl: null,
    optionA: "(1) [ML-1 T-1]",
    optionB: "(2) [ML-1 T-2]",
    optionC: "(3) [ML2 T-1]",
    optionD: "(4) [M-1 L3 T0]",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The distance of the Sun from Earth is $1.5 \\times 10^{11}\\text{ m}$, and its angular diameter is (2000) s when observed from the earth. The diameter of the Sun will be:",
    imageUrl: null,
    optionA: "(1) $2.45 \\times 10^{10}\\text{ m}$",
    optionB: "(2) $1.45 \\times 10^{10}\\text{ m}$",
    optionC: "(3) $1.45 \\times 10^9\\text{ m}$",
    optionD: "(4) $0.14 \\times 10^9\\text{ m}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "When a ball is dropped into a lake from a height 4.9 m above the water level, it hits the water with velocity v and then sinks to the bottom with constant velocity v. It reaches bottom 4.0 s after being dropped. Approximate depth of lake is:",
    imageUrl: null,
    optionA: "(1) 19.6 m",
    optionB: "(2) 29.4 m",
    optionC: "(3) 39.2 m",
    optionD: "(4) 73.5 m",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "One end of a massless spring of spring constant k and natural length $l_0$ is fixed while the other end is connected to mass m on frictionless table. Rotating at angular velocity $\\omega$, elongation of spring will be:",
    imageUrl: null,
    optionA: "(1) $\\frac{k - m\\omega^2}{m\\omega^2} l_0$",
    optionB: "(2) \\frac{m\\omega^2 l_0}{k + m\\omega^2}$",
    optionC: "(3) $\\frac{m\\omega^2 l_0}{k - m\\omega^2}$",
    optionD: "(4) \\frac{k + m\\omega^2 l_0}{m\\omega^2}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A stone tied to string of length L is whirled in vertical circle. At lowest position, speed is u. Magnitude of change in velocity when string is horizontal is $\\sqrt{x(u^2 - gL)}$. The value of x is:",
    imageUrl: null,
    optionA: "(1) 3",
    optionB: "(2) 2",
    optionC: "(3) 1",
    optionD: "(4) 5",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Four spheres of mass m form a square of side d. A fifth sphere of mass M is at centre. Total gravitational potential energy of system is:",
    imageUrl: null,
    optionA: "(1) $-\\frac{Gm}{d} [(4+\\sqrt{2})m + 4\\sqrt{2}M]$",
    optionB: "(2) -\\frac{Gm}{d} [(4+\\sqrt{2})M + 4\\sqrt{2}m]$",
    optionC: "(3) $-\\frac{Gm}{d} [3m^2 + 4\\sqrt{2}M]$",
    optionD: "(4) -\\frac{Gm}{d} [6m^2 + 4\\sqrt{2}M]$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "For a perfect gas, V vs T lines for two pressures $P_1$ and $P_2$ with slopes $P_2 > P_1$ show:",
    imageUrl: null,
    optionA: "(1) $P_1 > P_2$",
    optionB: "(2) $P_1 < P_2$",
    optionC: "(3) $P_1 = P_2$",
    optionD: "(4) Insufficient data",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "According to kinetic theory of gases:\\nA. Motion of gas molecules freezes at $0^\\circ\\text{C}$\\nB. Mean free path decreases if density increases\\nC. Mean free path increases if temperature increases at constant pressure\\nD. Average KE per degree of freedom is $\\frac{3}{2} k_B T$\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) A and C only",
    optionB: "(2) B and C only",
    optionC: "(3) A and B only",
    optionD: "(4) C and D only",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A lead bullet penetrates solid object and melts. 40% of its KE is used to heat it. Initial speed of bullet is (Initial T = $127^\\circ\\text{C}$, MP = $327^\\circ\\text{C}$, Latent heat $= 2.5 \\times 10^4\\text{ J/kg}$, $c = 125\\text{ J/kg K}$):",
    imageUrl: null,
    optionA: "(1) $125\\text{ ms}^{-1}$",
    optionB: "(2) $500\\text{ ms}^{-1}$",
    optionC: "(3) $250\\text{ ms}^{-1}$",
    optionD: "(4) $600\\text{ ms}^{-1}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The equation of SHM is $x = \\sin \\pi(t + 1/3)\\text{ m}$. At $t = 1\\text{ s}$, speed of particle is:",
    imageUrl: null,
    optionA: "(1) $0\\text{ cm s}^{-1}$",
    optionB: "(2) $157\\text{ cm s}^{-1}$",
    optionC: "(3) $272\\text{ cm s}^{-1}$",
    optionD: "(4) $314\\text{ cm s}^{-1}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "If charge q is placed at centre of closed hemispherical non-conducting surface, total flux through flat surface is:",
    imageUrl: null,
    optionA: "(1) $\\frac{q}{\\epsilon_0}$",
    optionB: "(2) \\frac{q}{2\\epsilon_0}$",
    optionC: "(3) $\\frac{q}{4\\epsilon_0}$",
    optionD: "(4) \\frac{q}{2\\pi\\epsilon_0}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Three identical charges 2 C suspended from common point P by silk threads of 2m forming equilateral triangle of side 1m. Ratio of net force on a ball to force between two balls is:",
    imageUrl: null,
    optionA: "(1) 1 : 1",
    optionB: "(2) 1 : 4",
    optionC: "(3) $\\sqrt{3} : 2$",
    optionD: "(4) $\\sqrt{3} : 1$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Two long parallel conductors $S_1$ and $S_2$ separated by 10 cm carry 4A and 2A. Charge $3\\pi\\text{ C}$ moving at $\\vec{v} = (2\\hat{i} + 3\\hat{j})\\text{m/s}$ passes P. Force is $4\\pi \\times 10^{-5}(-x\\hat{i} + 2\\hat{j})\\text{N}$. Value of x is:",
    imageUrl: null,
    optionA: "(1) 2",
    optionB: "(2) 1",
    optionC: "(3) 3",
    optionD: "(4) -3",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "If L, C, R are self-inductance, capacitance, resistance, which does not have dimension of time?",
    imageUrl: null,
    optionA: "(1) RC",
    optionB: "(2) L/R",
    optionC: "(3) $\\sqrt{LC}$",
    optionD: "(4) L/C",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Statement I: Time varying electric field is source of changing magnetic field and vice versa.\\nStatement II: EM wave travels in medium with speed $v = \\frac{1}{\\sqrt{\\mu_0 \\epsilon_0}}$.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both I and II are true",
    optionB: "(2) Both I and II are false",
    optionC: "(3) Statement I is correct, II is false",
    optionD: "(4) Statement I is incorrect, II is true",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Convex lens of power P cut into two halves along principal axis, then one piece cut perpendicular. Incorrect power for pieces $L_1, L_2, L_3$ is:",
    imageUrl: null,
    optionA: "(1) Power of $L_1 = P$",
    optionB: "(2) Power of $L_2 = P/2$",
    optionC: "(3) Power of $L_3 = P/2$",
    optionD: "(4) Power of $L_1 = P/2$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "If wave gets refracted into denser medium, which is true?",
    imageUrl: null,
    optionA: "(1) Wavelength, speed and frequency decrease",
    optionB: "(2) Wavelength increases, speed decreases, frequency constant",
    optionC: "(3) Wavelength and speed decrease, frequency constant",
    optionD: "(4) Wavelength, speed and frequency increase",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Statement I: In H-atom, frequency emitted when electron jumps $E_1 \\to E_2$ is $hf = E_1 - E_2$.\\nStatement II: Jump from $E_2 \\to E_1$ gives $f = (E_2 - E_1)/h$ (Bohr frequency condition).\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both I and II true",
    optionB: "(2) Both I and II false",
    optionC: "(3) Statement I true, II false",
    optionD: "(4) Statement I incorrect, II true",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "For transistor to act as switch, it must be operated in:",
    imageUrl: null,
    optionA: "(1) Active region",
    optionB: "(2) Saturation state only",
    optionC: "(3) Cut-off state only",
    optionD: "(4) Saturation and cut-off state",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "We do not transmit low frequency signal to long distance because: (a) antenna size unreal, (b) radiated power low, (c) avoid signal mixing. Most suitable option:",
    imageUrl: null,
    optionA: "(1) All statements true",
    optionB: "(2) (a), (b), (c) true only",
    optionC: "(3) (a), (c), (d) true only",
    optionD: "(4) (b), (c), (d) true only",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Mass 10 kg suspended by 5m rope. Force 30N applied at middle horizontally. Angle of upper half with vertical is $\\theta = \\tan^{-1}(x \\times 10^{-1})$. Value of x is _____.",
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
    subject: "Physics",
    questionText: "Rolling wheel 12 kg on inclined plane connected to 3 kg. Velocity at bottom Q is $\\frac{1}{2} \\sqrt{x g h}\\text{ m/s}$. Value of x is _____.",
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
    subject: "Physics",
    questionText: "Diatomic gas ($\\gamma = 1.4$) does 400 J work isobarically. Heat given to gas is _____ J.",
    imageUrl: null,
    optionA: "1400",
    optionB: "1400",
    optionC: "1400",
    optionD: "1400",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Particle executes SHM with amplitude 8 cm, period 6 s. Time to travel from max displacement to half amplitude is _____ s.",
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
    questionText: "Parallel plate capacitor stair structure plate area A, wire length b. Capacitance $\\frac{x}{15} \\frac{\\epsilon_0 A}{b}$. Value of x is _____.",
    imageUrl: null,
    optionA: "23",
    optionB: "23",
    optionC: "23",
    optionD: "23",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Cylindrical wire radius $r = 4.0\\text{ mm}$, current density $J = 1.0 \\times 10^6\\text{ A/m}^2$. Current between $r/2$ and r is $x\\pi\\text{ A}$. Value of x is _____.",
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
    subject: "Physics",
    questionText: "Circuit equivalent resistance minimum when $m = \\sqrt{x/2}$. Value of x is _____.",
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
    subject: "Physics",
    questionText: "Deuteron and proton moving with equal KE enter uniform magnetic field. $r_d / r_p = \\sqrt{x} : 1$. Value of x is _____.",
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
    questionText: "Metal rod length 20 cm moved at 20 m/s East. Earth magnetic field $4 \\times 10^{-3}\\text{ T}$, dip $45^\\circ$. Induced emf is _____ mV.",
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
    subject: "Physics",
    questionText: "Cut-off voltage of diodes in forward bias 0.6 V. Current through $40\\Omega$ resistor is _____ mA.",
    imageUrl: null,
    optionA: "4",
    optionB: "4",
    optionC: "4",
    optionD: "4",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── CHEMISTRY (Q31 - Q60) ──
  {
    subject: "Chemistry",
    questionText: "Correct plot for pressure (p) vs density (d) for ideal gas at $T_3 > T_2 > T_1$ is straight lines through origin with higher T having higher slope (Option 2).",
    imageUrl: null,
    optionA: "(1) Hyperbolic curves",
    optionB: "(2) Straight lines from origin, slope $T_3 > T_2 > T_1$",
    optionC: "(3) Straight lines from origin, slope $T_1 > T_2 > T_3$",
    optionD: "(4) Parabolic curves",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Identify incorrect statement for $\\text{PCl}_5$:",
    imageUrl: null,
    optionA: "(1) Orbitals undergo $sp^3d$ hybridization",
    optionB: "(2) Geometry is trigonal bipyramidal",
    optionC: "(3) Two axial bonds stronger than three equatorial bonds",
    optionD: "(4) Three equatorial bonds lie in a plane",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: Leaching of gold with cyanide ion in absence of air/$\\text{O}_2$ leads to cyano complex of Au(III).\\nStatement II: Zinc is oxidized during displacement reaction carried out for gold extraction.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both I and II correct",
    optionB: "(2) Both I and II incorrect",
    optionC: "(3) Statement I correct, II incorrect",
    optionD: "(4) Statement I incorrect, II correct",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The correct order of increasing intermolecular hydrogen bond strength is:",
    imageUrl: null,
    optionA: "(1) $\\text{HCN} < \\text{H}_2\\text{O} < \\text{NH}_3$",
    optionB: "(2) $\\text{HCN} < \\text{CH}_4 < \\text{NH}_3$",
    optionC: "(3) $\\text{CH}_4 < \\text{HCN} < \\text{NH}_3$",
    optionD: "(4) $\\text{CH}_4 < \\text{NH}_3 < \\text{HCN}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The correct order of increasing ionic radii is:",
    imageUrl: null,
    optionA: "(1) $\\text{Mg}^{2+} < \\text{Na}^+ < \\text{F}^- < \\text{O}^{2-} < \\text{N}^{3-}$",
    optionB: "(2) $\\text{N}^{3-} < \\text{O}^{2-} < \\text{F}^- < \\text{Na}^+ < \\text{Mg}^{2+}$",
    optionC: "(3) $\\text{F}^- < \\text{Na}^+ < \\text{O}^{2-} < \\text{Mg}^{2+} < \\text{N}^{3-}$",
    optionD: "(4) $\\text{Na}^+ < \\text{F}^- < \\text{Mg}^{2+} < \\text{O}^{2-} < \\text{N}^{3-}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The gas produced by treating aqueous solution of ammonium chloride with sodium nitrite is:",
    imageUrl: null,
    optionA: "(1) $\\text{NH}_3$",
    optionB: "(2) $\\text{N}_2$",
    optionC: "(3) $\\text{N}_2\\text{O}$",
    optionD: "(4) $\\text{Cl}_2$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Assertion A: Fluorine forms one oxoacid.\\nReason R: Fluorine has smallest size amongst all halogens and is highly electronegative.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both A and R correct, R is correct explanation of A",
    optionB: "(2) Both A and R correct, R is NOT correct explanation",
    optionC: "(3) A correct, R incorrect",
    optionD: "(4) A incorrect, R correct",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "In 3d series, the metal having highest $\\text{M}^{2+}/\\text{M}$ standard electrode potential is:",
    imageUrl: null,
    optionA: "(1) Cr",
    optionB: "(2) Fe",
    optionC: "(3) Cu",
    optionD: "(4) Zn",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The 'f' orbitals are half and completely filled respectively in lanthanide ions:",
    imageUrl: null,
    optionA: "(1) $\\text{Eu}^{2+}$ and $\\text{Tm}^{2+}$",
    optionB: "(2) $\\text{Sm}^{2+}$ and $\\text{Tm}^{3+}$",
    optionC: "(3) $\\text{Tb}^{4+}$ and $\\text{Yb}^{2+}$",
    optionD: "(4) $\\text{Dy}^{3+}$ and $\\text{Yb}^{3+}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Arrange coordination compounds in increasing order of magnetic moments:\\n(1) $[FeF_6]^{3-}$, (2) $[Fe(CN)_6]^{3-}$, (3) $[MnCl_6]^{3-}$ (high spin), (4) $[Mn(CN)_6]^{3-}$",
    imageUrl: null,
    optionA: "(1) 1 < 2 < 4 < 3",
    optionB: "(2) 2 < 4 < 3 < 1",
    optionC: "(3) 1 < 3 < 4 < 2",
    optionD: "(4) 2 < 4 < 1 < 3",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "On surface of polar stratospheric clouds, hydrolysis of chlorine nitrate gives A and B, while reaction with HCl produces B and C. A, B, C are:",
    imageUrl: null,
    optionA: "(1) $\\text{HOCl}, \\text{HNO}_3, \\text{Cl}_2$",
    optionB: "(2) $\\text{Cl}_2, \\text{HNO}_3, \\text{HOCl}$",
    optionC: "(3) $\\text{HClO}_2, \\text{HNO}_2, \\text{HOCl}$",
    optionD: "(4) $\\text{HOCl}, \\text{HNO}_2, \\text{Cl}_2\\text{O}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which cation is most stable? (Cyclopropenyl cation with + charge on ring carbon - Option 4).",
    imageUrl: null,
    optionA: "(1) Cation 1",
    optionB: "(2) Cation 2",
    optionC: "(3) Cation 3",
    optionD: "(4) Cyclopropenyl cation",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Major product of sequence: $n-\\text{Bu}-\\text{C}\\equiv\\text{C}-\\text{H} \\xrightarrow{\\text{(i) } n-\\text{BuLi}, n-\\text{C}_5\\text{H}_{11}\\text{Cl}} \\xrightarrow{\\text{(ii) Lindlar catalyst, } H_2}$ is cis-alkene (Option 3).",
    imageUrl: null,
    optionA: "(1) Trans product",
    optionB: "(2) Branched product",
    optionC: "(3) cis-alkene product",
    optionD: "(4) Alkane product",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Product 'A' of Ethylbenzene $\\xrightarrow{(a) Br_2, Fe} \\xrightarrow{(b) Cl_2, \\Delta} \\xrightarrow{(c) alc. KOH}$ is 4-bromostyrene (Option 4).",
    imageUrl: null,
    optionA: "(1) Product 1",
    optionB: "(2) Product 2",
    optionC: "(3) Product 3",
    optionD: "(4) 4-bromostyrene",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List I with List II for phenol reactions:\\nA. Phenol + $Br_2$ in $CS_2 \\to$ I. Reimer-Tiemann\\nB. Phenol + $\\text{Na}_2\\text{Cr}_2\\text{O}_7/\\text{H}_2\\text{SO}_4 \\to$ II. Oxidation\\nC. Phenol + Zn $\\to$ III. Reduction\\nD. Phenol + $\\text{CHCl}_3/\\text{NaOH} \\to$ IV. Bromination",
    imageUrl: null,
    optionA: "(1) A - IV, B - III, C - II, D - I",
    optionB: "(2) A - IV, B - III, C - I, D - II",
    optionC: "(3) A - II, B - III, C - I, D - IV",
    optionD: "(4) A - IV, B - II, C - III, D - I",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Decarboxylation of all six possible forms of diaminobenzoic acid $\\text{C}_6\\text{H}_3(\\text{NH}_2)_2\\text{COOH}$ yields 3 products A, B, C. MP of product C (symmetrical 1,3,5-triaminobenzene) is:",
    imageUrl: null,
    optionA: "(1) $63^\\circ\\text{C}$",
    optionB: "(2) $90^\\circ\\text{C}$",
    optionC: "(3) $104^\\circ\\text{C}$",
    optionD: "(4) $142^\\circ\\text{C}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which is true about Buna-N?",
    imageUrl: null,
    optionA: "(1) Linear polymer of 1,3-butadiene",
    optionB: "(2) Copolymer of 1,3-butadiene and styrene",
    optionC: "(3) Copolymer of 1,3-butadiene and acrylonitrile",
    optionD: "(4) N stands for natural occurrence",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: Maltose has two $\\alpha$-D-glucose units linked at $C_1$ and $C_4$ and is reducing sugar.\\nStatement II: Maltose has $\\alpha$-D-glucose and $\\beta$-D-glucose at $C_1$ and $C_6$ and non-reducing.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both I and II true",
    optionB: "(2) Both I and II false",
    optionC: "(3) Statement I true, II false",
    optionD: "(4) Statement I false, II true",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List I with List II:\\nA. Antipyretic -> III. Reduces fever\\nB. Analgesic -> I. Reduces pain\\nC. Tranquilizer -> II. Reduces stress\\nD. Antacid -> IV. Reduces acidity",
    imageUrl: null,
    optionA: "(1) A - III, B - I, C - II, D - IV",
    optionB: "(2) A - III, B - I, C - IV, D - II",
    optionC: "(3) A - I, B - IV, C - II, D - III",
    optionD: "(4) A - I, B - III, C - II, D - IV",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match anion with gas evolved on reaction with dil $\\text{H}_2\\text{SO}_4$:\\n$\\text{CO}_3^{2-} \\to$ Lime water milky\\n$\\text{S}^{2-} \\to$ Lead acetate paper black\\n$\\text{SO}_3^{2-} \\to$ Acidified dichromate green\\n$\\text{NO}_2^- \\to$ Brown fumes",
    imageUrl: null,
    optionA: "(1) A - III, B - I, C - II, D - IV",
    optionB: "(2) A - II, B - I, C - IV, D - III",
    optionC: "(3) A - IV, B - I, C - III, D - II",
    optionD: "(4) A - IV, B - I, C - II, D - III",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "116 g of substance yields 7.5 g H, 60 g O, 48.5 g C. Data agrees with how many formulae of $\\text{CH}_3\\text{COOH}, \\text{HCHO}, \\text{CH}_3\\text{OOCH}_3, \\text{CH}_3\\text{CHO}$? Value is _____.",
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
    questionText: "Set of quantum numbers $(n, l, m_l)$: A. 3, 3, -3; B. 3, 2, -2; C. 2, 1, +1; D. 2, 2, +2. Number of correct sets is _____.",
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
    questionText: "BeO reacts with HF in presence of ammonia to give [A] which on thermal decomposition produces [B] and ammonium fluoride. Oxidation state of Be in [A] is _____.",
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
    questionText: "5 moles He gas expand isothermally reversibly at 300 K from 10 L to 20 L. Work obtained is _____ J ($R = 8.3, \\log 2 = 0.3010$).",
    imageUrl: null,
    optionA: "8630",
    optionB: "8630",
    optionC: "8630",
    optionD: "8630",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Solution containing $2.5 \\times 10^{-3}\\text{ kg}$ solute in $75 \\times 10^{-3}\\text{ kg}$ water boils at 373.535 K. Molar mass of solute is _____ $\\text{g mol}^{-1}$ ($K_b = 0.52$).",
    imageUrl: null,
    optionA: "45",
    optionB: "45",
    optionC: "45",
    optionD: "45",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "pH value of 0.001 M NaOH solution is _____.",
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
    subject: "Chemistry",
    questionText: "Cell $Pt(s)|H_2(g)|H^+(aq)||Ag^+(aq)|Ag(s)$ has $E^0 = +0.5332\text{V}$. $\\Delta_f G$ is _____ $\\text{kJ mol}^{-1}$.",
    imageUrl: null,
    optionA: "51",
    optionB: "51",
    optionC: "51",
    optionD: "51",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Reaction rate constant doubles with rise in T by 9 K at 300 K. Activation energy is _____ $\\text{kJ mol}^{-1}$ ($\\ln 10 = 2.3, R = 8.3, \\log 2 = 0.30$).",
    imageUrl: null,
    optionA: "59",
    optionB: "59",
    optionC: "59",
    optionD: "59",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Initial pressure of gas 0.03 atm, mass of gas absorbed per gram of adsorbent is _____ $\\times 10^{-2}\\text{g}$.",
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
    subject: "Chemistry",
    questionText: "0.25 g organic compound containing chlorine gave 0.40 g AgCl in Carius estimation. Percentage of chlorine in compound is _____ %.",
    imageUrl: null,
    optionA: "40",
    optionB: "40",
    optionC: "40",
    optionD: "40",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── MATHEMATICS (Q61 - Q90) ──
  {
    subject: "Mathematics",
    questionText: "Number of intersection points of $|z - (4+3i)| = 2$ and $|z| + |z-4| = 6, z \\in \\mathbb{C}$ is:",
    imageUrl: null,
    optionA: "(1) 0",
    optionB: "(2) 1",
    optionC: "(3) 2",
    optionD: "(4) 3",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Determinant $f(x) = \\begin{vmatrix} a & -1 & 0 \\\\ ax & a & -1 \\\\ ax^2 & ax & a \\end{vmatrix}$. Sum of square of values of a for which $2f'(10) - f'(5) + 100 = 0$ is:",
    imageUrl: null,
    optionA: "(1) 117",
    optionB: "(2) 106",
    optionC: "(3) 125",
    optionD: "(4) 136",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If system $4ix + (1+i)y = 0$ and $8(\\cos\\frac{2\\pi}{3} + i \\sin\\frac{2\\pi}{3})x + \\bar{a} y = 0$ has more than one solution, then $\\alpha/\\beta$ ($a = \\alpha - i\\beta$) is:",
    imageUrl: null,
    optionA: "(1) $-2 + \\sqrt{3}$",
    optionB: "(2) $2 - \\sqrt{3}$",
    optionC: "(3) $2 + \\sqrt{3}$",
    optionD: "(4) $-2 - \\sqrt{3}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Matrices A and B of $3 \\times 3$ such that $AB = I$ and $|A| = 1/8$. $|\\text{adj}(B \\text{adj}(2A))|$ is:",
    imageUrl: null,
    optionA: "(1) 16",
    optionB: "(2) 32",
    optionC: "(3) 64",
    optionD: "(4) 128",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $S = 2 + \\frac{6}{7} + \\frac{12}{7^2} + \\frac{20}{7^3} + \\dots$. Then $4S$ is equal to:",
    imageUrl: null,
    optionA: "(1) $(7/3)^2$",
    optionB: "(2) $(7^3/3^2)$",
    optionC: "(3) $(7/3)^3$",
    optionD: "(4) $(7^2/3^3)$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If $a_1, a_2 \\dots$ and $b_1, b_2 \\dots$ are A.P.s with $a_1=2, a_{10}=3, a_1 b_1 = 1 = a_{10} b_{10}$, then $a_4 b_4$ is:",
    imageUrl: null,
    optionA: "(1) 35/27",
    optionB: "(2) 1",
    optionC: "(3) 27/28",
    optionD: "(4) 28/27",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Function $f(x) = \\int_0^{x^2} \\frac{t^2-5t+4}{2+e^t} dt$. Ordered pair (m, n) of local max and local min points is:",
    imageUrl: null,
    optionA: "(1) (3, 2)",
    optionB: "(2) (2, 3)",
    optionC: "(3) (2, 2)",
    optionD: "(4) (3, 4)",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If $\\int_{\\cos x}^1 t^2 f(t) dt = \\sin^3 x + \\cos x$, then $\\frac{1}{\\sqrt{3}} f'(\\frac{1}{\\sqrt{3}})$ is:",
    imageUrl: null,
    optionA: "(1) $6 - 9\\sqrt{2}$",
    optionB: "(2) $6 - 9/\\sqrt{2}$",
    optionC: "(3) $9/2 - 6\\sqrt{2}$",
    optionD: "(4) $9/\\sqrt{2} - 6$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Integral $\\int_0^1 \\frac{1}{7^{[1/x]}} dx$ ([.] denotes GIF) is equal to:",
    imageUrl: null,
    optionA: "(1) $1 + 6 \\log_e(6/7)$",
    optionB: "(2) $1 - 6 \\log_e(6/7)$",
    optionC: "(3) $\\log_e(7/6)$",
    optionD: "(4) $1 - 7 \\log_e(6/7)$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Solution curve $((\\tan^{-1} y) - x)dy = (1+y^2)dx$ passes through (1, 0). Abscissa of point with ordinate $\\tan(1)$ is:",
    imageUrl: null,
    optionA: "(1) 2e",
    optionB: "(2) 2/e",
    optionC: "(3) 1",
    optionD: "(4) 1/e",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Parabola vertex (5, 4), directrix $3x + y - 29 = 0$ is $x^2 + ay^2 + bxy + cx + dy + k = 0$. $a + b + c + d + k = $:",
    imageUrl: null,
    optionA: "(1) 575",
    optionB: "(2) -575",
    optionC: "(3) 576",
    optionD: "(4) -576",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Values of k for which circle $4x^2 + 4y^2 - 12x + 8y + k = 0$ lies in 4th quadrant and $(1, -1/3)$ lies on/inside C is:",
    imageUrl: null,
    optionA: "(1) Empty set",
    optionB: "(2) $(6, 65/9]$",
    optionC: "(3) $(80/9, 10]$",
    optionD: "(4) $(9, 92/9]$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Foot of perpendicular from (1, 2, 4) on $\\frac{x+2}{4} = \\frac{y-1}{2} = \\frac{z+1}{3}$ is P. Distance of P from $3x + 4y + 12z + 23 = 0$ is:",
    imageUrl: null,
    optionA: "(1) 5",
    optionB: "(2) 50/13",
    optionC: "(3) 4",
    optionD: "(4) 63/13",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Shortest distance between lines $\\frac{x-3}{2} = \\frac{y-2}{3} = \\frac{z-1}{-1}$ and $\\frac{x+3}{2} = \\frac{y-6}{1} = \\frac{z-5}{3}$ is:",
    imageUrl: null,
    optionA: "(1) $18/\\sqrt{5}$",
    optionB: "(2) $22/(3\\sqrt{5})$",
    optionC: "(3) $46/(3\\sqrt{5})$",
    optionD: "(4) $6\\sqrt{3}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Diagonals of parallelogram $\\vec{a}, \\vec{b}$ have area $2\\sqrt{2}$. Angle acute, $|\\vec{a}|=1, |\\vec{a} \\cdot \\vec{b}| = |\\vec{a} \\times \\vec{b}|$. If $\\vec{c} = 2\\sqrt{2}(\\vec{a} \\times \\vec{b}) - 2\\vec{b}$, angle between $\\vec{b}$ and $\\vec{c}$ is:",
    imageUrl: null,
    optionA: "(1) $\\pi/4$",
    optionB: "(2) $-\\pi/4$",
    optionC: "(3) $5\\pi/6$",
    optionD: "(4) $3\\pi/4$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Mean and variance of 4, 5, 6, 6, 7, 8, x, y ($x < y$) are 6 and 9/4. Then $x^4 + y^2 = $:",
    imageUrl: null,
    optionA: "(1) 162",
    optionB: "(2) 320",
    optionC: "(3) 674",
    optionD: "(4) 420",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If point A(x, y) lies in region bounded by y-axis, $2y + x = 6, 5x - 6y = 30$, probability that $y < 1$ is:",
    imageUrl: null,
    optionA: "(1) 1/6",
    optionB: "(2) 5/6",
    optionC: "(3) 2/3",
    optionD: "(4) 6/7",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Value of $\\cot\\left(\\sum_{n=1}^{50} \\tan^{-1}\\left(\\frac{1}{1+n+n^2}\\right)\\right)$ is:",
    imageUrl: null,
    optionA: "(1) 26/25",
    optionB: "(2) 25/26",
    optionC: "(3) 50/51",
    optionD: "(4) 52/51",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$\\alpha = \\sin 36^\\circ$ is a root of which equation?",
    imageUrl: null,
    optionA: "(1) $16x^4 - 10x^2 - 5 = 0$",
    optionB: "(2) $16x^4 + 20x^2 - 5 = 0$",
    optionC: "(3) $16x^4 - 20x^2 + 5 = 0$",
    optionD: "(4) $16x^4 - 10x^2 + 5 = 0$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Which of the following statement is a tautology?",
    imageUrl: null,
    optionA: "(1) ((~q) ^ p) ^ q",
    optionB: "(2) ((~q) ^ p) ^ (p ^ (~p))",
    optionC: "(3) ((~q) ^ p) v (p v (~p))",
    optionD: "(4) (p ^ q) ^ (~(p ^ q))",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Function $f(n) = 2n$ for $n=1..5$, $2n-11$ for $n=6..10$. $fog(n) = n+1$ for n odd, $n-1$ for n even. $g(10)(g(1)+g(2)+g(3)+g(4)+g(5)) = \\text{_____}$.",
    imageUrl: null,
    optionA: "190",
    optionB: "190",
    optionC: "190",
    optionD: "190",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "$\\alpha, \\beta$ roots of $x^2 - 4\\lambda x + 5 = 0$; $\\alpha, \\gamma$ roots of $x^2 - (3\\sqrt{2} + 2\\sqrt{3})x + 7 + 3\\lambda\\sqrt{3} = 0$. $\\beta + \\gamma = 3\\sqrt{2}$. $(\\alpha + 2\\beta + \\gamma)^2 = \\text{_____}$.",
    imageUrl: null,
    optionA: "98",
    optionB: "98",
    optionC: "98",
    optionD: "98",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "$2 \\times 2$ matrix entries from $\{0, 1, 3, 4, 5\}$. Sum of entries prime $p \\in (2, 8)$. Number of such matrices is _____.",
    imageUrl: null,
    optionA: "180",
    optionB: "180",
    optionC: "180",
    optionD: "180",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Sum of coefficients of all positive powers of x in expansion of $(x^n + 2/x^5)^7$ is 939. Sum of integral values of n is _____.",
    imageUrl: null,
    optionA: "57",
    optionB: "57",
    optionC: "57",
    optionD: "57",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Integral value of $\\alpha$ for which LHL of $f(x) = [1+x] + \\frac{\\alpha^{2[x]+\\{x\\}} + [x] - 1}{2[x]+\\{x\\}}$ at $x=0$ is $\\alpha - 4/3$ is _____.",
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
    subject: "Mathematics",
    questionText: "If $y(x) = (x^x)^x, x > 0$, then $\\frac{d^2 x}{dy^2} + 20$ at $x=1$ is _____.",
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
    subject: "Mathematics",
    questionText: "Area of region $\{(x, y) : x^{2/3} + y^{2/3} \\le 1, x+y \\ge 0, y \\ge 0\}$ is A. $256A/\\pi = \\text{_____}$.",
    imageUrl: null,
    optionA: "36",
    optionB: "36",
    optionC: "36",
    optionD: "36",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Solution curve $(1-x^2)dy = (xy + (x^3+2)\\sqrt{1-x^2})dx, y(0)=0$. $\\int_{-1/2}^{1/2} \\sqrt{1-x^2} y(x)dx = k$. $k^{-1} = \\text{_____}$.",
    imageUrl: null,
    optionA: "320",
    optionB: "320",
    optionC: "320",
    optionD: "320",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Circle C radius 5 below x-axis. $L_1 : 4x + 3y + 2 = 0$ through centre P intersects $L_2 : 3x - 4y - 11 = 0$ at Q. $L_2$ touches C at Q. Distance of P from $5x - 12y + 51 = 0$ is _____.",
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
    questionText: "Sample space $S = \\{E_1 \\dots E_8\\}, P(E_n) = n/36$. Number of elements in $\{A \\subseteq S : P(A) \\ge 4/5\}$ is _____.",
    imageUrl: null,
    optionA: "19",
    optionB: "19",
    optionC: "19",
    optionD: "19",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  }
];

async function seedJee2022Jun27Shift2() {
  console.log(`🚀 Compiling JEE Main 2022 (27 Jun Shift 2) Paper with ${rawQuestions.length} questions...`);

  const paperData = {
    examName: "JEE Main",
    year: 2022,
    shiftName: "JEE Main 2022 (27 Jun Shift 2)",
    examDate: "2022-06-27T15:00:00Z",
    totalMarks: 300,
    totalQuestions: 90,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'JEE Main 2022 (27 Jun Shift 2).json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved paper JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding JEE Main 2022 (27 Jun Shift 2) into PostgreSQL via Prisma...`);
  
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
      name: "JEE Main 2022 (27 Jun Shift 2)"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "JEE Main 2022 (27 Jun Shift 2)",
      date: new Date("2022-06-27T15:00:00Z")
    }
  });
  console.log(`Created Shift "JEE Main 2022 (27 Jun Shift 2)" (ID: ${shift.id})`);

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

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for JEE Main 2022 (27 Jun Shift 2) into Database!`);
}

seedJee2022Jun27Shift2()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
