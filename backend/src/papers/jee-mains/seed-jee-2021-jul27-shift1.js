const prisma = require('../../lib/prisma');
const fs = require('fs');
const path = require('path');

const rawQuestions = [
  // ── CHEMISTRY (Q1 - Q30) ──
  {
    subject: "Chemistry",
    questionText: "Which compound will give orange precipitate when treated with 2,4-dinitrophenyl hydrazine?",
    imageUrl: null,
    optionA: "(1) Ester derivative",
    optionB: "(2) Acid derivative",
    optionC: "(3) Phenolic ester",
    optionD: "(4) Acetophenone derivative (Option 4)",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Product obtained from electrolytic oxidation of acidified sulphate solutions is:",
    imageUrl: null,
    optionA: "(1) $\\text{HSO}_4^-$",
    optionB: "(2) $\\text{HO}_3\\text{SOOSO}_3\\text{H}$ (Peroxodisulphuric acid)",
    optionC: "(3) $\\text{HO}_2\\text{SOSO}_2\\text{H}$",
    optionD: "(4) $\\text{HO}_3\\text{SOSO}_3\\text{H}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Unit cell parameters $a=2.5, b=3.0, c=4.0; \\alpha=90^\\circ, \\beta=120^\\circ, \\gamma=90^\\circ$. Crystal system is:",
    imageUrl: null,
    optionA: "(1) Hexagonal",
    optionB: "(2) Orthorhombic",
    optionC: "(3) Monoclinic",
    optionD: "(4) Triclinic",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Oxidation states of P in $\\text{H}_4\\text{P}_2\\text{O}_7, \\text{H}_4\\text{P}_2\\text{O}_5, \\text{H}_4\\text{P}_2\\text{O}_6$ are:",
    imageUrl: null,
    optionA: "(1) 7, 5 and 6",
    optionB: "(2) 5, 4 and 3",
    optionC: "(3) 5, 3 and 4",
    optionD: "(4) 6, 4 and 5",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "For nth order reaction, unit of rate constant is:",
    imageUrl: null,
    optionA: "(1) $\\text{mol}^{1-n} \\text{L}^{1-n} \\text{s}$",
    optionB: "(2) $\\text{mol}^{1-n} \\text{L}^{2n} \\text{s}^{-1}$",
    optionC: "(3) $\\text{mol}^{1-n} \\text{L}^{n-1} \\text{s}^{-1}$",
    optionD: "(4) $\\text{mol}^{1-n} \\text{L}^{1-n} \\text{s}^{-1}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: Aniline is less basic than acetamide.\\nStatement II: In aniline, lone pair on N is delocalised over benzene ring.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Statement I true, II false",
    optionB: "(2) Statement I false, II true",
    optionC: "(3) Both I and II true",
    optionD: "(4) Both I and II false",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Hybridisation and magnetic property of $[MnCl_6]^{3-}$ are:",
    imageUrl: null,
    optionA: "(1) $sp^3d^2$ and diamagnetic",
    optionB: "(2) $d^2sp^3$ and diamagnetic",
    optionC: "(3) $d^2sp^3$ and paramagnetic",
    optionD: "(4) $sp^3d^2$ and paramagnetic",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Number of geometrical isomers in $[PtCl_2(NH_3)_2], [Ni(CO)_4], [Ru(H_2O)_3 Cl_3], [CoCl_2(NH_3)_4]^+$:",
    imageUrl: null,
    optionA: "(1) 1, 1, 1, 1",
    optionB: "(2) 2, 1, 2, 2",
    optionC: "(3) 2, 0, 2, 2",
    optionD: "(4) 2, 1, 2, 1",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which statement is NOT correct?",
    imageUrl: null,
    optionA: "(1) Eutrophication indicates water body is polluted",
    optionB: "(2) Dissolved oxygen below 6 ppm inhibits fish growth",
    optionC: "(3) Eutrophication leads to increase in oxygen level in water",
    optionD: "(4) Eutrophication leads to anaerobic conditions",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: Rutherford gold foil cannot explain line spectrum of H atom.\\nStatement II: Bohr model contradicts Heisenberg uncertainty principle.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Statement I false, II true",
    optionB: "(2) Statement I true, II false",
    optionC: "(3) Both I and II false",
    optionD: "(4) Both I and II true",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Presence of which reagent affects reversibility of $\\text{CH}_4 + \\text{I}_2 \\xrightleftharpoons{h\\nu} \\text{CH}_3\\text{I} + \\text{HI}$:",
    imageUrl: null,
    optionA: "(1) HOCl",
    optionB: "(2) dilute $\\text{HNO}_2$",
    optionC: "(3) Liquid $\\text{NH}_3$",
    optionD: "(4) Concentrated $\\text{HIO}_3$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which chemical test is used to distinguish monosaccharide from disaccharide?",
    imageUrl: null,
    optionA: "(1) Seliwanoff's test",
    optionB: "(2) Iodine test",
    optionC: "(3) Barfoed test",
    optionD: "(4) Tollen's test",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List I with List II:\\n(a) Furacin -> (iii) Antiseptic\\n(b) Arsphenamine -> (i) Antibiotic\\n(c) Dimetane -> (iv) Synthetic antihistamines\\n(d) Valium -> (ii) Tranquilizers",
    imageUrl: null,
    optionA: "(1) a-i, b-iii, c-iv, d-ii",
    optionB: "(2) a-iii, b-iv, c-ii, d-i",
    optionC: "(3) a-ii, b-i, c-iii, d-iv",
    optionD: "(4) a-iii, b-i, c-iv, d-ii",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "INCORRECT statement about Ellingham diagram:",
    imageUrl: null,
    optionA: "(1) Provides idea about reaction rate",
    optionB: "(2) Provides idea about free energy change",
    optionC: "(3) Provides idea about phase changes",
    optionD: "(4) Provides idea about reduction of metal oxide",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Reaction of 1-methylcyclohexanol $\\xrightarrow{H_3 PO_4, 120^\\circ C} A \\xrightarrow{(BH_3)_2, H_2 O_2/OH^-} P$. Product P is 2-methylcyclohexanol (Option 4).",
    imageUrl: null,
    optionA: "(1) Product 1",
    optionB: "(2) Product 2",
    optionC: "(3) Product 3",
    optionD: "(4) 2-methylcyclohexanol",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Thymine structure (A) is complementary base of Adenine in DNA (Option 3).",
    imageUrl: null,
    optionA: "(1) Uracil",
    optionB: "(2) Guanine",
    optionC: "(3) Adenine",
    optionD: "(4) Cytosine",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Staggered and eclipsed conformers of ethane are:",
    imageUrl: null,
    optionA: "(1) Polymers",
    optionB: "(2) Rotamers",
    optionC: "(3) Enantiomers",
    optionD: "(4) Mirror images",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List I with List II:\\n(a) NaOH -> (ii) Basic\\n(b) Be(OH)2 -> (iii) Amphoteric\\n(c) Ca(OH)2 -> (ii) Basic\\n(d) B(OH)3 -> (i) Acidic",
    imageUrl: null,
    optionA: "(1) a-ii, b-ii, c-iii, d-ii",
    optionB: "(2) a-ii, b-iii, c-ii, d-i",
    optionC: "(3) a-ii, b-ii, c-iii, d-i",
    optionD: "(4) a-ii, b-i, c-ii, d-iii",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Carbocations: $A : \\overset{+}{C}H_2, B : CH_2=\\overset{+}{C}H, C : CH_3-\\overset{+}{C}H_2, D : HC\\equiv\\overset{+}{C}$. Stability order is:",
    imageUrl: null,
    optionA: "(1) A > C > B > D",
    optionB: "(2) D > B > C > A",
    optionC: "(3) D > B > A > C",
    optionD: "(4) C > A > D > B",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Assertion A: Lithium halides are somewhat covalent.\\nReason R: Lithium possesses high polarisation capability.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) A true, R false",
    optionB: "(2) A false, R true",
    optionC: "(3) Both A and R true, R NOT correct explanation",
    optionD: "(4) Both A and R true, R is correct explanation",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Density of NaOH solution $1.2\\text{ g cm}^{-3}$. Molality of solution is _____ m.",
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
    questionText: "Freundlich isotherm: mass adsorbed becomes 64 times when pressure doubled. Value of n is _____ $\\times 10^{-2}$.",
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
    subject: "Chemistry",
    questionText: "Conductivity of weak acid HA ($0.001\\text{ M}$) is $2.0 \\times 10^{-5}\\text{ S cm}^{-1}$. $\\Lambda^0 = 190$. $K_a = \\text{_____} \\times 10^{-6}$.",
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
    subject: "Chemistry",
    questionText: "1.46 g biopolymer in 100 mL water at 300 K, osmotic pressure $2.42 \\times 10^{-3}\\text{ bar}$. Molar mass is _____ $\\times 10^4\\text{ g mol}^{-1}$.",
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
    subject: "Chemistry",
    questionText: "0.5 g compound A gives 0.3849 g AgCl. Percentage of chlorine in A is _____ %.",
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
    subject: "Chemistry",
    questionText: "Geometrical isomers in $[Co(NH_3)_3(NO_2)_3]$ is X and $[Cr(C_2 O_4)_3]^{3-}$ is Y. Value of $X + Y$ is _____.",
    imageUrl: null,
    optionA: "108",
    optionB: "108",
    optionC: "108",
    optionD: "108",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "In gaseous triethyl amine, '-C-N-C-' bond angle is _____ degrees.",
    imageUrl: null,
    optionA: "108",
    optionB: "108",
    optionC: "108",
    optionD: "108",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "For water at $100^\\circ\\text{C}, 1\\text{ bar}$, $\\Delta_{vap} H - \\Delta_{vap} U = \\text{_____} \\times 10^2\\text{ J mol}^{-1}$.",
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
    subject: "Chemistry",
    questionText: "3.0 moles $PCl_5$ in 1L vessel at 380 K ($K_c = 1.844$). Moles of $PCl_5$ at equilibrium is _____ $\\times 10^{-3}$.",
    imageUrl: null,
    optionA: "1396",
    optionB: "1396",
    optionC: "1396",
    optionD: "1396",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Difference between bond orders of CO and $NO^+$ is $x/2$. Value of x is _____.",
    imageUrl: null,
    optionA: "0",
    optionB: "0",
    optionC: "0",
    optionD: "0",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── PHYSICS (Q31 - Q60) ──
  {
    subject: "Physics",
    questionText: "Battery E connected across conductor PQ length l, radii $r_1, r_2 (r_2 < r_1)$. From P to Q, electron drift velocity increases (Option 1).",
    imageUrl: null,
    optionA: "(1) Drift velocity of electron increases",
    optionB: "(2) Electric field decreases",
    optionC: "(3) Electron current decreases",
    optionD: "(4) All of these",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Number of molecules in 1L ideal gas at 300 K, 2 atm with mean KE $2 \\times 10^{-9}\\text{ J}$ is:",
    imageUrl: null,
    optionA: "(1) $0.75 \\times 10^{11}$",
    optionB: "(2) $3 \\times 10^{11}$",
    optionC: "(3) $1.5 \\times 10^{11}$",
    optionD: "(4) $6 \\times 10^{11}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Relative permittivity of water 81. Speed of light in water is:",
    imageUrl: null,
    optionA: "(1) $4.33 \\times 10^7\\text{ m/s}$",
    optionB: "(2) $2.33 \\times 10^7\\text{ m/s}$",
    optionC: "(3) $3.33 \\times 10^7\\text{ m/s}$",
    optionD: "(4) $5.33 \\times 10^7\\text{ m/s}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Match List I with List II (Moment of Inertia):\\na. Length L, mass M about midpoint -> iii. $M L^2 / 12$\\nb. Length L, mass 2M about end -> iv. $2 M L^2 / 3$\\nc. Length 2L, mass M about midpoint -> ii. $M L^2 / 3$\\nd. Length 2L, mass 2M about end -> i. $8 M L^2 / 3$",
    imageUrl: null,
    optionA: "(1) a-ii, b-iii, c-i, d-iv",
    optionB: "(2) a-ii, b-i, c-iii, d-iv",
    optionC: "(3) a-iii, b-iv, c-ii, d-i",
    optionD: "(4) a-iii, b-iv, c-i, d-ii",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Three objects A (m), B (2m), C (2m) in straight line. A moves at 9 m/s, elastic collision with B. B inelastic with C. Final speed of C is:",
    imageUrl: null,
    optionA: "(1) 6 m/s",
    optionB: "(2) 9 m/s",
    optionC: "(3) 4 m/s",
    optionD: "(4) 3 m/s",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Capacitor $C = 1\\mu\\text{F}$ connected to 100V through $R = 100\\Omega$. Time to reach 50V is ($\\ln 2 = 0.69$):",
    imageUrl: null,
    optionA: "(1) $1.44 \\times 10^{-4}\\text{ s}$",
    optionB: "(2) $3.33 \\times 10^{-4}\\text{ s}$",
    optionC: "(3) $0.69 \\times 10^{-4}\\text{ s}$",
    optionD: "(4) $0.30 \\times 10^{-4}\\text{ s}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Parallel plate capacitor with dielectric slabs K (thickness d), 3K (2d), 5K (3d). Capacity is:",
    imageUrl: null,
    optionA: "(1) $\\frac{15 K \\epsilon_0 A}{34 d}$",
    optionB: "(2) $\\frac{15 K \\epsilon_0 A}{6 d}$",
    optionC: "(3) $\\frac{25 K \\epsilon_0 A}{6 d}$",
    optionD: "(4) $\\frac{9 K \\epsilon_0 A}{6 d}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Ratio of MI of bigger disc (radius R) around central axis perpendicular to plane to smaller disc (radius r) around diameter is:",
    imageUrl: null,
    optionA: "(1) $R^2 : r^2$",
    optionB: "(2) $2r^4 : R^4$",
    optionC: "(3) $2R^2 : r^2$",
    optionD: "(4) $2R^4 : r^4$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In YDSE, if light changes from orange to blue, distance between consecutive fringes will decrease (Option 2).",
    imageUrl: null,
    optionA: "(1) Central bright fringe dark",
    optionB: "(2) Distance between consecutive fringes decrease",
    optionC: "(3) Distance between consecutive fringes increase",
    optionD: "(4) Intensity of minima increase",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Cyclic process ABCDA 1 mol diatomic gas. Work done relation for adiabatic BC and DA is $W_{AD} = W_{BC}$ (Option 2).",
    imageUrl: null,
    optionA: "(1) $W_{AB} = W_{DC}$",
    optionB: "(2) $W_{AD} = W_{BC}$",
    optionC: "(3) $W_{BC} + W_{DA} > 0$",
    optionD: "(4) $W_{AB} < W_{CD}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Semi-circular arc A, B, C, D center O, $|AB|=|BC|=|CD|$. $\\vec{AB}+\\vec{BC}+\\vec{CD}+\\vec{AD} = 2\\vec{AO}$ (Reason R). Option 4.",
    imageUrl: null,
    optionA: "(1) A correct, R incorrect",
    optionB: "(2) A incorrect, R correct",
    optionC: "(3) Both A and R correct, R is explanation",
    optionD: "(4) Both A and R correct, R NOT explanation",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Light vessel base area A, hole area a. Minimum coefficient of friction to prevent sliding due to impact force of emerging liquid is:",
    imageUrl: null,
    optionA: "(1) A / 2a",
    optionB: "(2) None of these",
    optionC: "(3) 2a / A",
    optionD: "(4) a / A",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "SHM amplitude a, total energy E. When KE is 3E/4, displacement y is:",
    imageUrl: null,
    optionA: "(1) y = a",
    optionB: "(2) $y = a/\\sqrt{2}$",
    optionC: "(3) $y = a\\sqrt{3}/2$",
    optionD: "(4) y = a/2",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Decayed nuclei ratio f, rate of change of f with respect to time is $\\lambda e^{-\\lambda t}$ (Option 3).",
    imageUrl: null,
    optionA: "(1) $-\\lambda(1-e^{-\\lambda t})$",
    optionB: "(2) $\\lambda(1-e^{-\\lambda t})$",
    optionC: "(3) $\\lambda e^{-\\lambda t}$",
    optionD: "(4) $-\\lambda e^{-\\lambda t}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Capacitors 2C and C parallel charged to V. Medium K filled in C. Potential difference is:",
    imageUrl: null,
    optionA: "(1) V/(K+2)",
    optionB: "(2) V/K",
    optionC: "(3) 3V/(K+2)",
    optionD: "(4) 3V/K",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Ball thrown up reaches height h. Ratio of two times reaching h/3 in both directions is:",
    imageUrl: null,
    optionA: "(1) $\\frac{\\sqrt{2}-1}{\\sqrt{2}+1}$",
    optionB: "(2) 1/3",
    optionC: "(3) $\\frac{\\sqrt{3}-\\sqrt{2}}{\\sqrt{3}+\\sqrt{2}}$",
    optionD: "(4) $\\frac{\\sqrt{3}-1}{\\sqrt{3}+1}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "0.07 H inductor and $12\\Omega$ resistor in series across 220V, 50Hz. Current and phase angle are:",
    imageUrl: null,
    optionA: "(1) 8.8 A and $\\tan^{-1}(11/6)$",
    optionB: "(2) 88 A and $\\tan^{-1}(11/6)$",
    optionC: "(3) 0.88 A and $\\tan^{-1}(11/6)$",
    optionD: "(4) 8.8 A and $\\tan^{-1}(6/11)$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Tennis balls mass m charge q suspended by threads length l making small angle $\\theta$. Equilibrium separation is:",
    imageUrl: null,
    optionA: "(1) $(q^2 l / 2\\pi\\epsilon_0 m g)^{1/2}$",
    optionB: "(2) $(q^2 l / 2\\pi\\epsilon_0 m g)^{1/3}$",
    optionC: "(3) $(q^2 l^2 / 2\\pi\\epsilon_0 m^2 g)^{1/3}$",
    optionD: "(4) $(q^2 l^2 / 2\\pi\\epsilon_0 m^2 g^2)^{1/3}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Assertion A: 5 rotations 5 mm main scale, 50 circular divisions $\\to$ least count 0.001 cm.\\nReason R: Least count = Pitch / Total divisions.\\nOption 1.",
    imageUrl: null,
    optionA: "(1) A not correct but R correct",
    optionB: "(2) Both A and R correct, R is explanation",
    optionC: "(3) A correct, R not correct",
    optionD: "(4) Both A and R correct, R NOT explanation",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "4 min to cool from $61^\\circ\\text{C}$ to $59^\\circ\\text{C}$ in $30^\\circ\\text{C}$ surroundings. Time to cool from $51^\\circ\\text{C}$ to $49^\\circ\\text{C}$ is:",
    imageUrl: null,
    optionA: "(1) 4 min",
    optionB: "(2) 3 min",
    optionC: "(3) 8 min",
    optionD: "(4) 6 min",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Circuit switch $S$. Potential drop across $r = 3\\Omega$ resistor after $T_1$ connected to $T_3$ is _____ V.",
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
    questionText: "Planets radii R, 2R, mass M, 9M, separation 8R. Minimum speed v to reach second planet is $\\sqrt{\\frac{a}{7} \\frac{GM}{R}}$. Value of a is _____.",
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
    questionText: "Bohr orbit radius 0.5Å, speed $2.2 \\times 10^6\\text{ m/s}$. Current is _____ $\\times 10^{-2}\\text{ mA}$.",
    imageUrl: null,
    optionA: "112",
    optionB: "112",
    optionC: "112",
    optionD: "112",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Radioactive sample average life 30 ms. Capacitor $200\\mu\\text{F}$ resistor R. Ratio charge to activity fixed. Value of R is _____ $\\Omega$.",
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
    questionText: "Particle mass $9.1 \\times 10^{-31}\\text{ kg}$ speed $10^6\\text{ m/s}$, photon momentum $10^{-27}\\text{ kg m/s}$. Photon wavelength is _____ times particle.",
    imageUrl: null,
    optionA: "910",
    optionB: "910",
    optionC: "910",
    optionD: "910",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Prisms $n_1 = 1.2 + \\frac{10.8 \\times 10^{-14}}{\\lambda^2}$ and $n_2 = 1.45 + \\frac{1.8 \\times 10^{-14}}{\\lambda^2}$. Wavelength passing without bending is _____ nm.",
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
    subject: "Physics",
    questionText: "Stone 20g catapult 0.1m, area $10^{-6}\\text{ m}^2$, stretched 0.04m. Velocity is _____ m/s ($Y = 0.5 \\times 10^9\\text{ N/m}^2$).",
    imageUrl: null,
    optionA: "20",
    optionB: "20",
    optionC: "20",
    optionD: "20",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "CE transistor voltage 10V, collector resistor $1000\\Omega$ voltage drop 0.6V. $\\beta = 24$. Base current is _____ $\\mu\\text{A}$.",
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
    subject: "Physics",
    questionText: "AM wave sideband amplitudes $a/10\\text{ V}$ and $b/10\\text{ V}$ for carrier 15V modulated by 7.7 kHz 5V. Value of $a/b$ is _____.",
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
    questionText: "Magnetic needle moment $9.85 \\times 10^{-2}\\text{ A m}^2$, MOI $5 \\times 10^{-6}\\text{ kg m}^2$. 10 oscillations in 5 s. Field is _____ mT.",
    imageUrl: null,
    optionA: "8",
    optionB: "8",
    optionC: "8",
    optionD: "8",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── MATHEMATICS (Q61 - Q90) ──
  {
    subject: "Mathematics",
    questionText: "Mean and variance of 6, 10, 7, 13, a, 12, b, 12 are 9 and 37/4. Value of $(a-b)^2$ is:",
    imageUrl: null,
    optionA: "(1) 24",
    optionB: "(2) 12",
    optionC: "(3) 32",
    optionD: "(4) 16",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$\\lim_{n \\to \\infty} \\frac{1}{n} \\sum_{j=1}^n \\frac{(2j-1)+8n}{(2j-1)+4n} = $:",
    imageUrl: null,
    optionA: "(1) $5 + \\log_e(3/2)$",
    optionB: "(2) $2 - \\log_e(2/3)$",
    optionC: "(3) $3 + 2\\log_e(2/3)$",
    optionD: "(4) $1 + 2\\log_e(3/2)$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$\\vec{a} = \\hat{i}+\\hat{j}+2\\hat{k}, \\vec{b} = -\\hat{i}+2\\hat{j}+3\\hat{k}$. Vector product $(\\vec{a}+\\vec{b}) \\times (((\\vec{a} \\times ((\\vec{a}-\\vec{b}) \\times \\vec{b})) \\times \\vec{b})) = $:",
    imageUrl: null,
    optionA: "(1) $5(34\\hat{i} - 5\\hat{j} + 3\\hat{k})$",
    optionB: "(2) $7(34\\hat{i} - 5\\hat{j} + 3\\hat{k})$",
    optionC: "(3) $7(30\\hat{i} - 5\\hat{j} + 7\\hat{k})$",
    optionD: "(4) $5(30\\hat{i} - 5\\hat{j} + 7\\hat{k})$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$\\int_{-\\pi/4}^{\\pi/4} \\frac{dx}{(1+e^{x \\cos x})(\\sin^4 x + \\cos^4 x)} = $:",
    imageUrl: null,
    optionA: "(1) $-\\pi/2$",
    optionB: "(2) $\\pi / 2\\sqrt{2}$",
    optionC: "(3) $-\\pi/4$",
    optionD: "(4) $\\pi/\\sqrt{2}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$S_1 = \\{z \\in \\mathbb{C} : |z-3-2i| = 8\\}, S_2 = \\{\\dots\\}, S_3 = \\{\\dots\\}$. $|S_1 \\cap S_2 \\cap S_3| = $:",
    imageUrl: null,
    optionA: "(1) 1",
    optionB: "(2) 0",
    optionC: "(3) 2",
    optionD: "(4) Infinite",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Bounded region $R = \\{(x, y) : \\max(0, \\log_e x) \\le y \\le 2^x, 1/2 \\le x \\le 2\\}$ area $\\alpha (\\log_e 2)^{-1} + \\beta (\\log_e 2) + \\gamma$. $(\\alpha+\\beta-2\\gamma)^2 = $:",
    imageUrl: null,
    optionA: "(1) 8",
    optionB: "(2) 2",
    optionC: "(3) 4",
    optionD: "(4) 1",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Reflected ray on y-axis passes (5, 3). Directrix of ellipse $e = 1/3$ nearer focus distance $8/\\sqrt{53}$. Other directrix equation:",
    imageUrl: null,
    optionA: "(1) $11x + 7y + 8 = 0$ or $11x + 7y - 15 = 0$",
    optionB: "(2) $11x - 7y - 8 = 0$ or $11x + 7y + 15 = 0$",
    optionC: "(3) $2x - 7y + 29 = 0$ or $2x - 7y - 7 = 0$",
    optionD: "(4) $2x - 7y - 39 = 0$ or $2x - 7y - 7 = 0$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Coefficients of $x^7$ in $(x^2 + 1/bx)^{11}$ and $x^{-7}$ in $(x^2 + 1/bx)^{11}$ equal ($b \\neq 0$). Value of b is:",
    imageUrl: null,
    optionA: "(1) 2",
    optionB: "(2) -1",
    optionC: "(3) 1",
    optionD: "(4) -2",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Compound statement $(P \\vee Q) \\wedge (\\sim P) \\Rightarrow Q$ is equivalent to:",
    imageUrl: null,
    optionA: "(1) $p \\vee Q$",
    optionB: "(2) $P \\wedge \\sim Q$",
    optionC: "(3) $\\sim (P \\Rightarrow Q)$",
    optionD: "(4) Tautology (Option 4)",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If $\\sin \\theta + \\cos \\theta = 1/2$, then $16(\\sin 2\\theta + \\cos 4\\theta + \\sin 6\\theta) = $:",
    imageUrl: null,
    optionA: "(1) 23",
    optionB: "(2) -27",
    optionC: "(3) -23",
    optionD: "(4) 27",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Matrix $A = \\begin{pmatrix} 1 & 2 \\\\ -1 & 4 \\end{pmatrix}$. $A^{-1} = \\alpha I + \\beta A$. $4(\\alpha - \\beta) = $:",
    imageUrl: null,
    optionA: "(1) 5",
    optionB: "(2) 8/3",
    optionC: "(3) 2",
    optionD: "(4) 4",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$f(x) = (1+|\\sin x|)^{3a/|\\sin x|}$ for $-\\pi/4 < x < 0$; b for $x=0$; $e^{\\cot 4x / \\cot 2x}$ for $0 < x < \\pi/4$. Continuous at $x=0$. $6a+b^2 = $:",
    imageUrl: null,
    optionA: "(1) $1-e$",
    optionB: "(2) $e-1$",
    optionC: "(3) $1+e$",
    optionD: "(4) e",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Solution $\\log_e(dy/dx) = 3x+4y, y(0)=0$. $y(\\frac{2}{3} \\log_e 2) = \\alpha \\log_e 2$. $\\alpha = $:",
    imageUrl: null,
    optionA: "(1) -1/4",
    optionB: "(2) 1/4",
    optionC: "(3) 2",
    optionD: "(4) -1/2",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Plane through (-1, 0, -2) perpendicular to $2x+y-z=2$ and $x-y-z=3$ is $ax+by+cz+8=0$. $a+b+c = $:",
    imageUrl: null,
    optionA: "(1) 3",
    optionB: "(2) 8",
    optionC: "(3) 5",
    optionD: "(4) 4",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Tangents P(-1, 1) to $x^2+y^2-2x-6y+6=0$ at A, B. D on circle $AB=AD$. Area of $\\Delta ABD$ is:",
    imageUrl: null,
    optionA: "(1) 2",
    optionB: "(2) $3\\sqrt{2}+2$",
    optionC: "(3) 4",
    optionD: "(4) $3\\sqrt{2}-2$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$f(2)=4, f'(2)=1$. $\\lim_{x \\to 2} \\frac{x^2 f(2) - 4 f(x)}{x-2} = $:",
    imageUrl: null,
    optionA: "(1) 4",
    optionB: "(2) 8",
    optionC: "(3) 16",
    optionD: "(4) 12",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "P, Q on circle center C(2, 3) through O(0, 0). OC perpendicular to CP and CQ. Set {P, Q} is:",
    imageUrl: null,
    optionA: "(1) {(4,0), (0,6)}",
    optionB: "(2) Option 2",
    optionC: "(3) Option 3",
    optionD: "(4) {(-1,5), (5,1)}",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Roots of $x^2 + (20)^{1/4} x + (5)^{1/2} = 0$ are $\\alpha, \\beta$. $\\alpha^8 + \\beta^8 = $:",
    imageUrl: null,
    optionA: "(1) 10",
    optionB: "(2) 100",
    optionC: "(3) 50",
    optionD: "(4) 160",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Probability 2-digit number in $\{n \\in \\mathbb{N} : (2^n-2) \\text{ multiple of 3}\}$ is:",
    imageUrl: null,
    optionA: "(1) 1/6",
    optionB: "(2) 2/3",
    optionC: "(3) 1/2",
    optionD: "(4) 1/3",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$A = \\{2x^2+2y^2-2x-2y=1\\}, B = \\{4x^2+4y^2-16x+7=0\\}, C = \\{x^2+y^2-4x-2y+5 \\le r^2\\}$. Min $|r|$ for $A \\cup B \\subseteq C$ is:",
    imageUrl: null,
    optionA: "(1) $\\frac{3+\\sqrt{10}}{2}$",
    optionB: "(2) $\\frac{2+\\sqrt{10}}{2}$",
    optionC: "(3) $\\frac{3+2\\sqrt{5}}{2}$",
    optionD: "(4) $1+\\sqrt{5}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Linear system $x+y-z=2, x+2y+\\alpha z=1, 2x-y+z=\\beta$ infinite solutions. $\\alpha + \\beta = \\text{_____}$.",
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
    questionText: "Vectors $\\vec{a}=\\hat{i}+\\hat{j}+\\hat{k}, \\vec{b}=\\hat{i}-\\hat{j}-\\hat{k}, \\vec{c}=\\hat{j}-\\hat{k}$. $\\vec{a} \\times \\vec{b} = \\vec{c}, \\vec{a} \\cdot \\vec{b} = 1$. $\\vec{a} \\times \\vec{c} = \\vec{l}$. $3 l^2 = \\text{_____}$.",
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
    questionText: "$\\log_3 2, \\log_3(2^x-5), \\log_3(2^x - 7/2)$ in A.P. Value of x is _____.",
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
    questionText: "Domain $(a, b)$ of $f(x) = \\log_4(\\log_5(\\log_3(18x^2-77)))$. Integral $\\int_a^b \\frac{\\sin^3 x}{\\sin^3 x + \\sin^3(a+b-x)} dx = \\text{_____}$.",
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
    subject: "Mathematics",
    questionText: "Max value of determinant $f(x) = \\det\\begin{pmatrix} \\sin^2 x & -2+\\cos^2 x & \\cos 2x \\\\ 2+\\sin^2 x & \\cos^2 x & \\cos 2x \\\\ \\sin^2 x & \\cos^2 x & 1+\\cos 2x \\end{pmatrix}$ in $[0, \\pi]$ is _____.",
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
    questionText: "$F(x) = e^{-x} \\int_3^x (3t^2+2t+4F'(t))dt$. $F'(4) = \\alpha e^\\beta - 224$. $\\alpha + \\beta = \\text{_____}$.",
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
    questionText: "Plane P through (3, 7, -7) contains line $\\frac{x-2}{-3} = \\frac{y-3}{2} = \\frac{z+2}{1}$. Distance from origin d. $d^2 = \\text{_____}$.",
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
    questionText: "$S = \\{1, 2, 3, 4, 5, 6, 7\\}$. Functions $f : S \\to S$ with $f(m \\cdot n) = f(m) \\cdot f(n)$ is _____.",
    imageUrl: null,
    optionA: "490",
    optionB: "490",
    optionC: "490",
    optionD: "490",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Solution $\\sec y \\frac{dy}{dx} - \\sin(x+y) - \\sin(x-y) = 0, y(0)=0$. $5 y'(\\pi/2) = \\text{_____}$.",
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
    questionText: "$f(x) = \\min\\{x-[x], 1+[x]-x\\}$. P discontinuous set, Q non-diff set in $[0, 3]$. $|P| + |Q| = \\text{_____}$.",
    imageUrl: null,
    optionA: "5",
    optionB: "5",
    optionC: "5",
    optionD: "5",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  }
];

async function seedJee2021Jul27Shift1() {
  console.log(`🚀 Compiling JEE Main 2021 (27 Jul Shift 1) Paper with ${rawQuestions.length} questions...`);

  const paperData = {
    examName: "JEE Main",
    year: 2021,
    shiftName: "JEE Main 2021 (27 Jul Shift 1)",
    examDate: "2021-07-27T09:00:00Z",
    totalMarks: 300,
    totalQuestions: 90,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'JEE Main 2021 (27 Jul Shift 1).json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved paper JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding JEE Main 2021 (27 Jul Shift 1) into PostgreSQL via Prisma...`);
  
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
      name: "JEE Main 2021 (27 Jul Shift 1)"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "JEE Main 2021 (27 Jul Shift 1)",
      date: new Date("2021-07-27T09:00:00Z")
    }
  });
  console.log(`Created Shift "JEE Main 2021 (27 Jul Shift 1)" (ID: ${shift.id})`);

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

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for JEE Main 2021 (27 Jul Shift 1) into Database!`);
}

seedJee2021Jul27Shift1()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
