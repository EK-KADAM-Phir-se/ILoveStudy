const prisma = require('../../lib/prisma');
const fs = require('fs');
const path = require('path');

const rawQuestions = [
  // ── PHYSICS (Q1 - Q30) ──
  {
    subject: "Physics",
    questionText: "Assertion A : Product of Pressure (P) and time (t) has the same dimension as that of coefficient of viscosity.\\nReason R : Coefficient of viscosity = $\\frac{\\text{Force}}{\\text{Velocity gradient}}$.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both A and R true, and R is correct explanation of A",
    optionB: "(2) Both A and R are true but R is NOT correct explanation",
    optionC: "(3) A is true but R is false",
    optionD: "(4) A is false but R is true",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A particle of mass m moving in circular path of radius r has centripetal acceleration $a = k^2 r t^2$. Power delivered to particle is:",
    imageUrl: null,
    optionA: "(1) Zero",
    optionB: "(2) $m k^2 r^2 t^2$",
    optionC: "(3) $m k^2 r^2 t$",
    optionD: "(4) $m k^2 r t$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Motion of particle in x-y plane is $x = 4 \\sin(\\frac{\\pi}{2} - \\omega t)\\text{m}, y = 4 \\sin(\\omega t)\\text{m}$. Path of particle is:",
    imageUrl: null,
    optionA: "(1) Circular",
    optionB: "(2) Helical",
    optionC: "(3) Parabolic",
    optionD: "(4) Elliptical",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Match MOI of bodies of radius R:\\nA. Solid sphere about tangent -> I. $\\frac{7}{5} M R^2$\\nB. Hollow sphere about tangent -> II. $\\frac{5}{3} M R^2$\\nC. Ring about diameter -> III. $\\frac{1}{2} M R^2$\\nD. Disc about diameter -> IV. $\\frac{1}{4} M R^2$",
    imageUrl: null,
    optionA: "(1) A - I, B - II, C - IV, D - III",
    optionB: "(2) A - I, B - II, C - III, D - IV",
    optionC: "(3) A - II, B - I, C - III, D - IV",
    optionD: "(4) A - II, B - I, C - IV, D - III",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Two planets A and B of equal mass have periods $T_A = 2 T_B$. Orbit radii $r_A, r_B$. Correct relationship is:",
    imageUrl: null,
    optionA: "(1) $2 r_A^2 = r_B^3$",
    optionB: "(2) $r_A^3 = 2 r_B^3$",
    optionC: "(3) $r_A^3 = 4 r_B^3$",
    optionD: "(4) $T_A^2 - T_B^2 = \\frac{\\pi^2}{GM}(r_B^3 - 4 r_A^3)$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A water drop of diameter 2 cm broken into 64 equal droplets. Surface tension $= 0.075\\text{ N/m}$. Gain in surface energy is:",
    imageUrl: null,
    optionA: "(1) $2.8 \\times 10^{-4}\\text{ J}$",
    optionB: "(2) $1.5 \\times 10^{-3}\\text{ J}$",
    optionC: "(3) $1.9 \\times 10^{-4}\\text{ J}$",
    optionD: "(4) $9.4 \\times 10^{-5}\\text{ J}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Statement I: When $\\mu$ gas undergoes adiabatic change $(P_1, V_1, T_1) \\to (P_2, V_2, T_2)$, work done is $W = \\frac{\\mu R(T_2 - T_1)}{1-\\gamma}$.\\nStatement II: When work done on gas, temperature of gas rises.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both I and II true",
    optionB: "(2) Both I and II false",
    optionC: "(3) Statement I true, II false",
    optionD: "(4) Statement I false, II true",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Statement I: Point charge in electric field. Field near charge may increase if charge is positive.\\nStatement II: Electric dipole in non-uniform field. Net electric force will not be zero.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both I and II true",
    optionB: "(2) Both I and II false",
    optionC: "(3) Statement I true, II false",
    optionD: "(4) Statement I false, II true",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Three charges q/2, q, q/2 at corners A, B, C of square of side a. Electric field at corner D is:",
    imageUrl: null,
    optionA: "(1) $\\frac{q}{4\\pi\\epsilon_0 a^2} (\\frac{1}{\\sqrt{2}} + \\frac{1}{2})$",
    optionB: "(2) \\frac{q}{4\\pi\\epsilon_0 a^2} (1 + \\frac{1}{\\sqrt{2}})$",
    optionC: "(3) $\\frac{q}{4\\pi\\epsilon_0 a^2} (1 - \\frac{1}{\\sqrt{2}})$",
    optionD: "(4) \\frac{q}{4\\pi\\epsilon_0 a^2} (\\frac{1}{\\sqrt{2}} - \\frac{1}{2})$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "An infinitely long hollow conducting cylinder with radius R carries uniform current. Magnetic field (B) as function of radial distance (r) is zero for $r < R$ and decays as $1/r$ for $r > R$ (Option 4).",
    imageUrl: null,
    optionA: "(1) Linear increase then constant",
    optionB: "(2) Linear increase then decay",
    optionC: "(3) Constant then decay",
    optionD: "(4) Zero for $r < R$, then $1/r$ decay",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Radar sends EM signal $E_0 = 2.25\\text{ V/m}, B_0 = 1.5 \\times 10^{-8}\\text{ T}$ towards target at distance 3 km in medium. Echo reaches radar after time:",
    imageUrl: null,
    optionA: "(1) $2.0 \\times 10^{-5}\\text{ s}$",
    optionB: "(2) $4.0 \\times 10^{-5}\\text{ s}$",
    optionC: "(3) $1.0 \\times 10^{-5}\\text{ s}$",
    optionD: "(4) $8.0 \\times 10^{-5}\\text{ s}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Refracting angle of prism is A, refractive index is $\\cot(A/2)$. Angle of minimum deviation is:",
    imageUrl: null,
    optionA: "(1) $180^\\circ - 2A$",
    optionB: "(2) $90^\\circ - A$",
    optionC: "(3) $180^\\circ + 2A$",
    optionD: "(4) $180^\\circ - 3A$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Aperture of objective is 24.4 cm. Resolving power of telescope for $\\lambda = 2440 Å$ is:",
    imageUrl: null,
    optionA: "(1) $8.1 \\times 10^6$",
    optionB: "(2) $10.0 \\times 10^7$",
    optionC: "(3) $8.2 \\times 10^5$",
    optionD: "(4) $1.0 \\times 10^{-8}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "De Broglie wavelengths for electron $\\lambda_e$ and photon $\\lambda_p$ for same KE. Correct relation is:",
    imageUrl: null,
    optionA: "(1) $\\lambda_p \\propto \\lambda_e^2$",
    optionB: "(2) $\\lambda_p \\propto \\lambda_e$",
    optionC: "(3) $\\lambda_p \\propto \\sqrt{\\lambda_e}$",
    optionD: "(4) $\\lambda_p \\propto 1/\\sqrt{\\lambda_e}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Q-value of nuclear reaction and kinetic energy of projectile $K_p$ are related as:",
    imageUrl: null,
    optionA: "(1) $Q = K_p$",
    optionB: "(2) $(K_p + Q) < 0$",
    optionC: "(3) $Q < K_p$",
    optionD: "(4) $(K_p + Q) > 0$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Circuit with D1, D2 diodes and NPN transistor. Output $Y = \\bar{A B}$ (NAND gate, Option 3).",
    imageUrl: null,
    optionA: "(1) Y = AB",
    optionB: "(2) Y = A + B",
    optionC: "(3) $Y = \\overline{AB}$",
    optionD: "(4) $Y = \\overline{A+B}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "For using multimeter to identify diode from components, correct statement is:",
    imageUrl: null,
    optionA: "(1) Two terminal device conducting both directions",
    optionB: "(2) Two terminal device conducting in one direction only",
    optionC: "(3) Does not conduct, gives initial deflection decay to zero",
    optionD: "(4) Three terminal device",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Assertion A: n-p-n transistor permits more current than p-n-p.\\nReason R: Electrons have greater mobility as charge carrier.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both A and R true, R is correct explanation",
    optionB: "(2) Both A and R true, R NOT correct explanation",
    optionC: "(3) A true, R false",
    optionD: "(4) A false, R true",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Match signals with frequency bandwidth:\\nA. Television signal -> IV. 06 MHz\\nB. Radio signal -> III. 02 MHz\\nC. High Quality Music -> II. 20 KHz\\nD. Human speech -> I. 03 KHz",
    imageUrl: null,
    optionA: "(1) A - I, B - II, C - III, D - IV",
    optionB: "(2) A - IV, B - III, C - I, D - II",
    optionC: "(3) A - IV, B - III, C - II, D - I",
    optionD: "(4) A - I, B - II, C - IV, D - III",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Velocity of sound in gas where wavelengths 4.08 m and 4.16 m produce 40 beats in 12 s is:",
    imageUrl: null,
    optionA: "(1) $282.8\\text{ ms}^{-1}$",
    optionB: "(2) $175.5\\text{ ms}^{-1}$",
    optionC: "(3) $353.6\\text{ ms}^{-1}$",
    optionD: "(4) $707.2\\text{ ms}^{-1}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Pendulum string 250 cm, mass 200 g pulled $60^\\circ$ with vertical. Max velocity attained by bob is _____ $\\text{ms}^{-1}$. ($g = 10\\text{ m/s}^2$)",
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
    subject: "Physics",
    questionText: "Meter bridge setup with $15\\Omega$ resistor. Null deflection at 43 cm mark. End correction for end A is 2 cm. Determined value of R is _____ $\\Omega$.",
    imageUrl: null,
    optionA: "19",
    optionB: "19",
    optionC: "19",
    optionD: "19",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Ammeter A reading when no current flows through $10\\Omega$ resistor in Wheatstone bridge is _____ A.",
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
    questionText: "AC source connected to $100\\text{ mH}, 100\\mu\\text{F}, 120\\Omega$. Time in which $120\\Omega$ resistor (thermal capacity $2\\text{ J/}^\\circ\\text{C}$) heated by $16^\\circ\\text{C}$ is _____ s.",
    imageUrl: null,
    optionA: "15",
    optionB: "15",
    optionC: "15",
    optionD: "15",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Position vector of 1 kg object is $\\vec{r} = (3\\hat{i} - \\hat{j})\\text{m}$, velocity $\\vec{v} = (3\\hat{j} + \\hat{k})\\text{ms}^{-1}$. Angular momentum magnitude is $\\sqrt{x}\\text{ Nm}$. x is _____.",
    imageUrl: null,
    optionA: "91",
    optionB: "91",
    optionC: "91",
    optionD: "91",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "60 kg man jumps into stationary trolley car of mass 120 kg. Trolley moves at $2\\text{ms}^{-1}$. Velocity of running man before jump was _____ $\\text{ms}^{-1}$.",
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
    subject: "Physics",
    questionText: "Hanging mass M connected to 4M on ice-slab pulled by 2Mg force. Tension in string is $x/5\\text{ Mg}$. Value of x is _____.",
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
    subject: "Physics",
    questionText: "Total internal energy of 2 mole monoatomic gas at 300 K is _____ J. ($R = 8.31$)",
    imageUrl: null,
    optionA: "7479",
    optionB: "7479",
    optionC: "7479",
    optionD: "7479",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Singly ionized Mg atom (A = 24) accelerated to KE 5keV projected perpendicular into B = 0.5 T. Radius of path is _____ cm.",
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
    questionText: "Telegraph line length 100 km, capacity $0.01\\mu\\text{F/km}$, 0.5 kHz AC. Minimum impedance series inductance required is _____ mH.",
    imageUrl: null,
    optionA: "100",
    optionB: "100",
    optionC: "100",
    optionD: "100",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── CHEMISTRY (Q31 - Q60) ──
  {
    subject: "Chemistry",
    questionText: "Incorrect statement about imperfections in solids is:",
    imageUrl: null,
    optionA: "(1) Schottky defect decreases density",
    optionB: "(2) Interstitial defect increases density",
    optionC: "(3) Frenkel defect does not alter density",
    optionD: "(4) Vacancy defect increases density of substance",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Zeta potential is related to which property of colloids?",
    imageUrl: null,
    optionA: "(1) Colour",
    optionB: "(2) Tyndall effect",
    optionC: "(3) Charge on surface of colloidal particles",
    optionD: "(4) Brownian movement",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Element E belongs to period 4, group 16. Valence shell electron configuration of element just above E in group is:",
    imageUrl: null,
    optionA: "(1) $3s^2, 3p^4$",
    optionB: "(2) $3d^{10}, 4s^2, 4p^4$",
    optionC: "(3) $4d^{10}, 5s^2, 5p^4$",
    optionD: "(4) $2s^2, 2p^4$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Assertion A: Mg can reduce $\\text{Al}_2\\text{O}_3$ below $1350^\\circ\\text{C}$, while above $1350^\\circ\\text{C}$ Al can reduce MgO.\\nReason R: MP and BP of Mg are lower than Al.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both A and R correct, R is correct explanation of A",
    optionB: "(2) Both A and R correct, R NOT correct explanation",
    optionC: "(3) A correct, R incorrect",
    optionD: "(4) A incorrect, R correct",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Dihydrogen reacts with CuO to give:",
    imageUrl: null,
    optionA: "(1) $\\text{CuH}_2$",
    optionB: "(2) Cu",
    optionC: "(3) $\\text{Cu}_2\\text{O}$",
    optionD: "(4) $\\text{Cu(OH)}_2$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Nitrogen gas is obtained by thermal decomposition of:",
    imageUrl: null,
    optionA: "(1) $\\text{Ba(NO}_3)_2$",
    optionB: "(2) $\\text{Ba(N}_3)_2$",
    optionC: "(3) $\\text{NaNO}_2$",
    optionD: "(4) $\\text{NaNO}_3$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: Pentavalent oxide of group 15 element $E_2 O_5$ is less acidic than trivalent oxide $E_2 O_3$.\\nStatement II: Acidic character of trivalent oxide decreases down the group.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both I and II true",
    optionB: "(2) Both I and II false",
    optionC: "(3) Statement I true, II false",
    optionD: "(4) Statement I false, II true",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which lanthanoid is most stable in divalent form?",
    imageUrl: null,
    optionA: "(1) Ce (Z=58)",
    optionB: "(2) Sm (Z=62)",
    optionC: "(3) Eu (Z=63)",
    optionD: "(4) Yb (Z=70)",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: $[Ni(CN)_4]^{2-}$ is square planar, diamagnetic with $dsp^2$, but $[Ni(CO)_4]$ is tetrahedral, paramagnetic with $sp^3$.\\nStatement II: $[NiCl_4]^{2-}$ and $[Ni(CO)_4]$ both have same d-electron config, same geometry, paramagnetic.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both I and II true",
    optionB: "(2) Both I and II false",
    optionC: "(3) Statement I true, II false",
    optionD: "(4) Statement I false, II true",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which amongst the following is NOT a pesticide?",
    imageUrl: null,
    optionA: "(1) DDT",
    optionB: "(2) Organophosphates",
    optionC: "(3) Dieldrin",
    optionD: "(4) Sodium arsenite",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Technique NOT used to spot components separated on thin layer chromatographic plate is:",
    imageUrl: null,
    optionA: "(1) $I_2$ Solid",
    optionB: "(2) U.V. Light",
    optionC: "(3) Visualisation agent as component of mobile phase",
    optionD: "(4) Spraying appropriate reagent",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following structures are aromatic in nature? (Cyclopropenyl cation A and Tropylium cation B - Option 2).",
    imageUrl: null,
    optionA: "(1) A, B, C and D",
    optionB: "(2) Only A and B",
    optionC: "(3) Only A and C",
    optionD: "(4) Only B, C and D",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Major product P of $\\text{PhCH}=\\text{CH}-\\text{CH}_2\\text{Br} + \\text{HBr} \\to P$ is $\\text{PhCH(Br)}-\\text{CH}_2-\\text{CH}_2\\text{Br}$ (Option 3).",
    imageUrl: null,
    optionA: "(1) Product 1",
    optionB: "(2) Product 2",
    optionC: "(3) 1,3-dibromo-1-phenylpropane",
    optionD: "(4) Product 4",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Reaction of benzaldehyde with $\\text{Ph-CHO} \\xrightarrow[in D_2O]{NaOD} A + \\text{Ph-C-O}^-$. Product A is $\\text{Ph-CH}_2-\\text{OD}$ (Option 1).",
    imageUrl: null,
    optionA: "(1) $\\text{Ph-CH}_2\\text{OD}$",
    optionB: "(2) $\\text{Ph-CH}_2\\text{OH}$",
    optionC: "(3) $\\text{Ph-CHD-OD}$",
    optionD: "(4) $\\text{Ph-CD}_2\\text{OD}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which compound is inactive towards $S_N 1$ reaction? (Bicyclo[2.2.1]hept-2-yl chloride / bridgehead chloride - Option 3).",
    imageUrl: null,
    optionA: "(1) t-Butyl chloride",
    optionB: "(2) Allyl chloride",
    optionC: "(3) Bridgehead chloride",
    optionD: "(4) Benzyl chloride",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Major product of Aniline $\\xrightarrow{\\text{(1) } Br_2/H_2O} \\xrightarrow{\\text{(2) } NaNO_2/HCl} \\xrightarrow{\\text{(3) } H_3PO_2}$ is 1,3,5-tribromobenzene (Option 3).",
    imageUrl: null,
    optionA: "(1) Monobromobenzene",
    optionB: "(2) Dibromobenzene",
    optionC: "(3) 1,3,5-tribromobenzene",
    optionD: "(4) 2,4,6-tribromophenol",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Primary aliphatic amine on reaction with nitrous acid in cold (273 K) and then raising temperature to 298 K gives:",
    imageUrl: null,
    optionA: "(1) Nitrile",
    optionB: "(2) Alcohol",
    optionC: "(3) Diazonium salt",
    optionD: "(4) Secondary amine",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which one of the following is NOT a copolymer?",
    imageUrl: null,
    optionA: "(1) Buna-S",
    optionB: "(2) Neoprene",
    optionC: "(3) PHBV",
    optionD: "(4) Butadiene-styrene",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Stability of $\\alpha$-Helix structure of proteins depends upon:",
    imageUrl: null,
    optionA: "(1) Dipolar interaction",
    optionB: "(2) H-bonding interaction",
    optionC: "(3) van der Waals forces",
    optionD: "(4) $\\pi$-stacking interaction",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Formula of purple colour formed in Lassaigne's test for sulphur using sodium nitroprusside is:",
    imageUrl: null,
    optionA: "(1) $NaFe[Fe(CN)_6]$",
    optionB: "(2) $Na[Cr(NH_3)_2(NCS)_4]$",
    optionC: "(3) $Na_2[Fe(CN)_5(NO)]$",
    optionD: "(4) $Na_4[Fe(CN)_5(NOS)]$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "2.0 g sample containing $\\text{MnO}_2$ treated with HCl liberating $\\text{Cl}_2$. Passed into KI, 60.0 mL of 0.1 M $\\text{Na}_2\\text{S}_2\\text{O}_3$ required. % of $\\text{MnO}_2$ is _____ %.",
    imageUrl: null,
    optionA: "13",
    optionB: "13",
    optionC: "13",
    optionD: "13",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Work function of metal is $6.63 \\times 10^{-19}\\text{ J}$. Max wavelength of photon required to remove photoelectron is _____ nm.",
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
    subject: "Chemistry",
    questionText: "Hybridization of P in $\\text{PF}_5$ is $sp_x d_y$. Value of y is _____.",
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
    questionText: "4.0 L ideal gas expanded isothermally into vacuum to 20 L. Amount of heat absorbed is _____ L atm.",
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
    subject: "Chemistry",
    questionText: "Vapour pressures of A and B at 25°C are 50 Torr and 100 Torr. Mixture contains 0.3 mole fraction of A. Mole fraction of B in vapour phase is x/17. Value of x is _____.",
    imageUrl: null,
    optionA: "14",
    optionB: "14",
    optionC: "14",
    optionD: "14",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Solubility product of $A_2 X_3$ is $1.1 \\times 10^{-23}$. Specific conductance $3 \\times 10^{-5}\\text{ S m}^{-1}$. Limiting molar conductivity $x \\times 10^{-3}\\text{ S m}^2\\text{ mol}^{-1}$. Value of x is _____.",
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
    questionText: "Faraday electricity needed to reduce 1 mol of $\\text{Cr}_2\\text{O}_7^{2-}$ to $\\text{Cr}^{3+}$ is _____ F.",
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
    subject: "Chemistry",
    questionText: "First order reaction $A \\to B, k = 5.5 \\times 10^{-14}\\text{ s}^{-1}$. Time for 67% completion is $x \\times 10^{-1}$ times half life. x is _____.",
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
    questionText: "Number of complexes exhibiting synergic bonding amongst $[Cr(CO)_6], [Mn(CO)_5], [Mn_2(CO)_{10}]$ is _____.",
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
    questionText: "Estimation of bromine: 0.5 g organic compound gave 0.40 g AgBr. Percentage of bromine is _____ %.",
    imageUrl: null,
    optionA: "34",
    optionB: "34",
    optionC: "34",
    optionD: "34",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── MATHEMATICS (Q61 - Q90) ──
  {
    subject: "Mathematics",
    questionText: "If $\\sum_{k=1}^{31} ({}^{31}C_k)({}^{31}C_{k-1}) - \\sum_{k=1}^{30} ({}^{30}C_k)({}^{30}C_{k-1}) = \\frac{\\alpha 60!}{(30!)(31!)}$, then $16\\alpha = $:",
    imageUrl: null,
    optionA: "(1) 1411",
    optionB: "(2) 1320",
    optionC: "(3) 1615",
    optionD: "(4) 1855",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $f : \\mathbb{N} \\to \\mathbb{N}$ defined by $f(n) = 2n$ for even, $n-1$ for $n=3, 7, 11\\dots$, $\\frac{n+1}{2}$ for $n=1, 5, 9\\dots$. Then f is:",
    imageUrl: null,
    optionA: "(1) One-one but not onto",
    optionB: "(2) Onto but not one-one",
    optionC: "(3) Neither one-one nor onto",
    optionD: "(4) One-one and onto",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If system $2x + 3y - z = -2, x + y + z = 4, x - y + |\\lambda| z = 4\\lambda - 4$ has no solution, then:",
    imageUrl: null,
    optionA: "(1) $\\lambda = 7$",
    optionB: "(2) $\\lambda = -7$",
    optionC: "(3) $\\lambda = 8$",
    optionD: "(4) $\\lambda^2 = 1$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Matrix A of $3 \\times 3$ and $\\det(A) = 2$. $\\det(\\det(A) \\text{adj}(5 \\text{adj}(A^3))) = $:",
    imageUrl: null,
    optionA: "(1) $512 \\times 10^6$",
    optionB: "(2) $256 \\times 10^6$",
    optionC: "(3) $1024 \\times 10^6$",
    optionD: "(4) $256 \\times 10^{11}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Total number of 5-digit numbers formed using digits 1, 2, 3, 5, 6, 7 without repetition which are multiple of 6 is:",
    imageUrl: null,
    optionA: "(1) 36",
    optionB: "(2) 48",
    optionC: "(3) 60",
    optionD: "(4) 72",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "G.P. $A_1, A_2 \\dots$ with $A_1 A_3 A_5 A_7 = 1/1296, A_2 + A_4 = 7/36$. $A_6 + A_8 + A_{10} = $:",
    imageUrl: null,
    optionA: "(1) 33",
    optionB: "(2) 37",
    optionC: "(3) 43",
    optionD: "(4) 47",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Integral $\\int_0^1 [-8x^2 + 6x - 1] dx = $:",
    imageUrl: null,
    optionA: "(1) -1",
    optionB: "(2) -5/4",
    optionC: "(3) $\\frac{\\sqrt{17}-13}{8}$",
    optionD: "(4) \\frac{\\sqrt{17}-16}{8}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Function $f(x)$ defined piecewise. Statement true if f is discontinuous at exactly one point: $a + b + c \\neq 1$ (Option 3).",
    imageUrl: null,
    optionA: "(1) Continuous on $\\mathbb{R}$",
    optionB: "(2) $a + b + c = 1$",
    optionC: "(3) Discontinuous at 1 point, $a + b + c \\neq 1$",
    optionD: "(4) Discontinuous at 2 points",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Area of region $\{(x, y) : y^2 \\le 8x, y \\ge \\sqrt{2}x, x \\ge 1\}$ is:",
    imageUrl: null,
    optionA: "(1) $13\\sqrt{2}/6$",
    optionB: "(2) $11\\sqrt{2}/6$",
    optionC: "(3) $5\\sqrt{2}/6$",
    optionD: "(4) $19\\sqrt{2}/6$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Solution curve $x [\\frac{x}{\\sqrt{x^2-y^2}} + e^{y/x}] dy = [\\frac{x}{\\sqrt{x^2-y^2}} + e^{y/x}] x dx$ passes through (1, 0) and $(2\\alpha, \\alpha)$. $\\alpha$ is:",
    imageUrl: null,
    optionA: "(1) $\\frac{1}{2} \\exp(\\frac{\\pi}{6} + \\sqrt{e} - 1)$",
    optionB: "(2) $\\frac{1}{2} \\exp(\\frac{\\pi}{3} + e - 1)$",
    optionC: "(3) $\\exp(\\frac{\\pi}{6} + \\sqrt{e} + 1)$",
    optionD: "(4) $2 \\exp(\\frac{\\pi}{3} + \\sqrt{e} - 1)$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Solution curve $x(1-x^2)\\frac{dy}{dx} + (3x^2 y - y - 4x^3) = 0, x > 1$ with $y(2) = -2$. $y(3) = $:",
    imageUrl: null,
    optionA: "(1) -18",
    optionB: "(2) -12",
    optionC: "(3) -6",
    optionD: "(4) -3",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Number of real solutions of $x^7 + 5x^3 + 3x + 1 = 0$ is:",
    imageUrl: null,
    optionA: "(1) 0",
    optionB: "(2) 1",
    optionC: "(3) 3",
    optionD: "(4) 5",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Hyperbola $H : \\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$ with latus rectum $6\\sqrt{2}, e = \\sqrt{5/2}$. Tangent $y = 2x + c$. $c^2 = $:",
    imageUrl: null,
    optionA: "(1) 18",
    optionB: "(2) 20",
    optionC: "(3) 24",
    optionD: "(4) 32",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Tangents at O(0, 0) and $P(1+\\sqrt{5}, 2)$ on $x^2 + y^2 - 2x - 4y = 0$ intersect at Q. Area of $\\Delta OPQ$ is:",
    imageUrl: null,
    optionA: "(1) $\\frac{3+\\sqrt{5}}{2}$",
    optionB: "(2) \\frac{4+2\\sqrt{5}}{2}$",
    optionC: "(3) $\\frac{5+3\\sqrt{5}}{2}$",
    optionD: "(4) \\frac{7+3\\sqrt{5}}{2}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Distinct points Q, R on line of intersection of $-x + 2y - z = 0$ and $3x - 5y + 2z = 0$ with $PQ = PR = \\sqrt{18}, P(1, -2, 3)$. Area of $\\Delta PQR$ is:",
    imageUrl: null,
    optionA: "(1) $\\frac{2}{3}\\sqrt{38}$",
    optionB: "(2) \\frac{4}{3}\\sqrt{38}$",
    optionC: "(3) $\\frac{8}{3}\\sqrt{38}$",
    optionD: "(4) \\sqrt{152/3}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Acute angle between planes $P_1$ and $P_2$ passing through intersection of $5x + 8y + 13z - 29 = 0$ and $8x - 7y + z - 20 = 0$ and points (2, 1, 3) and (0, 1, 2) is:",
    imageUrl: null,
    optionA: "(1) $\\pi/3$",
    optionB: "(2) $\\pi/4$",
    optionC: "(3) $\\pi/6$",
    optionD: "(4) $\\pi/12$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Plane $P : \\vec{r} \\cdot \\vec{a} = d$ contains intersection of $\\vec{r} \\cdot (\\hat{i} + 3\\hat{j} - \\hat{k}) = 6$ and $\\vec{r} \\cdot (-6\\hat{i} + 5\\hat{j} - \\hat{k}) = 7$. Passes through (2, 3, 1/2). $\\frac{|13\\vec{a}|^2}{d^2} = $:",
    imageUrl: null,
    optionA: "(1) 90",
    optionB: "(2) 93",
    optionC: "(3) 95",
    optionD: "(4) 97",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Probability that in a randomly selected 3-digit number at least two digits are odd is:",
    imageUrl: null,
    optionA: "(1) 19/36",
    optionB: "(2) 15/36",
    optionC: "(3) 13/36",
    optionD: "(4) 23/36",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Vertical poles AB, PQ 160m apart. C mid of feet B, Q. Elevation $\\pi/8, \\theta$. Height of PQ twice AB. $\\tan^2 \\theta = $:",
    imageUrl: null,
    optionA: "(1) $\\frac{3-2\\sqrt{2}}{2}$",
    optionB: "(2) \\frac{3+\\sqrt{2}}{2}$",
    optionC: "(3) $\\frac{3-2\\sqrt{2}}{4}$",
    optionD: "(4) \\frac{3-\\sqrt{2}}{4}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$S_1 : ((\\sim p) \\vee q) \\vee ((\\sim p) \\vee r), S_2 : p \\to (q \\vee r)$. Which statement is NOT true?",
    imageUrl: null,
    optionA: "(1) If $S_2$ True, $S_1$ True",
    optionB: "(2) If $S_2$ False, $S_1$ False",
    optionC: "(3) If $S_2$ False, $S_1$ True",
    optionD: "(4) If $S_1$ False, $S_2$ False",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$R_1 = \\{(p, p^n) : p \\text{ prime}, n \\ge 0\\}, R_2 = \\{(p, p^n) : p \\text{ prime}, n = 0, 1\\}$ on $\{1 \\dots 50\}$. Number of elements in $R_1 - R_2$ is _____.",
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
    subject: "Mathematics",
    questionText: "Number of real solutions of equation is _____.",
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
    questionText: "Mean & SD of 15 observations are 8 and 3. 20 misread as 5. Correct variance is _____.",
    imageUrl: null,
    optionA: "17",
    optionB: "17",
    optionC: "17",
    optionD: "17",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Vectors $\\vec{a} = 2\\hat{i} + \\hat{j} + 3\\hat{k}, \\vec{b} = 3\\hat{i} + 3\\hat{j} + \\hat{k}, \\vec{c} = c_1\\hat{i} + c_2\\hat{j} + c_3\\hat{k}$ coplanar, $\\vec{a} \\cdot \\vec{c} = 5, \\vec{b} \\perp \\vec{c}$. $122(c_1 + c_2 + c_3) = \\text{_____}$.",
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
    subject: "Mathematics",
    questionText: "Ray P(2, 3) reflects on x-axis at A to Q(5, 4). R divides AQ in 2:1. Foot of perpendicular M from R on bisector of $\\angle PAQ$ is $(\\alpha, \\beta)$. $7\\alpha + 3\\beta = \\text{_____}$.",
    imageUrl: null,
    optionA: "31",
    optionB: "31",
    optionC: "31",
    optionD: "31",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Line l normal to $y = 2x^2 + x + 2$ at P. Q(6, 4) on l, O origin. Area of $\\Delta OPQ = \\text{_____}$.",
    imageUrl: null,
    optionA: "13",
    optionB: "13",
    optionC: "13",
    optionD: "13",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "$A = \\{1, a_1 \\dots a_{18}, 77\\}$. $A + A$ has 39 elements. $a_1 + a_2 + \\dots + a_{18} = \\text{_____}$.",
    imageUrl: null,
    optionA: "702",
    optionB: "702",
    optionC: "702",
    optionD: "702",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Number of positive integers k such that constant term in expansion of $(2x^3 + 3/x^k)^{12}$ is $2^8 l$ ($l$ odd) is _____.",
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
    questionText: "Number of elements in set $\{z = a + ib \\in \\mathbb{C} : a, b \\in \\mathbb{Z}, 1 < |z - 3 + 2i| < 4\}$ is _____.",
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
    subject: "Mathematics",
    questionText: "Lines $y + 2x = \\sqrt{11} + 7\\sqrt{7}$ and $2y + x = 2\\sqrt{11} + 6\\sqrt{7}$ normal to circle $(x-h)^2 + (y-k)^2 = r^2$. Tangent line $\\sqrt{11}y - 3x = \\frac{5\\sqrt{17}}{3} + 11$. $(5h - 8k)^2 + 5r^2 = \\text{_____}$.",
    imageUrl: null,
    optionA: "816",
    optionB: "816",
    optionC: "816",
    optionD: "816",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  }
];

async function seedJee2022Jun28Shift1() {
  console.log(`🚀 Compiling JEE Main 2022 (28 Jun Shift 1) Paper with ${rawQuestions.length} questions...`);

  const paperData = {
    examName: "JEE Main",
    year: 2022,
    shiftName: "JEE Main 2022 (28 Jun Shift 1)",
    examDate: "2022-06-28T09:00:00Z",
    totalMarks: 300,
    totalQuestions: 90,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'JEE Main 2022 (28 Jun Shift 1).json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved paper JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding JEE Main 2022 (28 Jun Shift 1) into PostgreSQL via Prisma...`);
  
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
      name: "JEE Main 2022 (28 Jun Shift 1)"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "JEE Main 2022 (28 Jun Shift 1)",
      date: new Date("2022-06-28T09:00:00Z")
    }
  });
  console.log(`Created Shift "JEE Main 2022 (28 Jun Shift 1)" (ID: ${shift.id})`);

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

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for JEE Main 2022 (28 Jun Shift 1) into Database!`);
}

seedJee2022Jun28Shift1()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
