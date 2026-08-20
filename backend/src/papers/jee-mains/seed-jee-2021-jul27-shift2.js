const prisma = require('../../lib/prisma');
const fs = require('fs');
const path = require('path');

const rawQuestions = [
  // ── CHEMISTRY (Q1 - Q30) ──
  {
    subject: "Chemistry",
    questionText: "Set of elements detected using sodium fusion extract (Lassaigne's test):",
    imageUrl: null,
    optionA: "(1) Sulfur, Nitrogen, Phosphorous, Halogens",
    optionB: "(2) Phosphorous, Oxygen, Nitrogen, Halogens",
    optionC: "(3) Nitrogen, Phosphorous, Carbon, Sulfur",
    optionD: "(4) Halogens, Nitrogen, Oxygen, Sulfur",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Reaction of 3-hydroxybutanoic acid methyl ester with Conc. HBr gives major product P: 3-bromobutanoic acid methyl ester (Option 3).",
    imageUrl: null,
    optionA: "(1) Product 1",
    optionB: "(2) Product 2",
    optionC: "(3) 3-bromobutanoic acid methyl ester",
    optionD: "(4) Product 4",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Number of neutrons and electrons respectively present in radioactive isotope of hydrogen (Tritium) is:",
    imageUrl: null,
    optionA: "(1) 1 and 1",
    optionB: "(2) 3 and 1",
    optionC: "(3) 2 and 1",
    optionD: "(4) 2 and 2",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List I with List II:\\n(a) Li -> (v) bearings for motor engines\\n(b) Na -> (iii) coolant in fast breeder nuclear reactor\\n(c) K -> (ii) absorbent of $CO_2$\\n(d) Cs -> (i) photoelectric cell",
    imageUrl: null,
    optionA: "(1) a-v, b-i, c-ii, d-iv",
    optionB: "(2) a-v, b-ii, c-iv, d-i",
    optionC: "(3) a-iv, b-iii, c-i, d-ii",
    optionD: "(4) a-v, b-iii, c-ii, d-i",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Assertion A: $SO_2(g)$ is adsorbed to large extent than $H_2(g)$ on activated charcoal.\\nReason R: $SO_2(g)$ has higher critical temperature than $H_2(g)$.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both A and R correct, R NOT correct explanation",
    optionB: "(2) Both A and R correct, R is correct explanation",
    optionC: "(3) A not correct, R correct",
    optionD: "(4) A correct, R not correct",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The CORRECT order of first ionisation enthalpy is:",
    imageUrl: null,
    optionA: "(1) Mg < S < Al < P",
    optionB: "(2) Mg < Al < S < P",
    optionC: "(3) Al < Mg < S < P",
    optionD: "(4) Mg < Al < P < S",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: Hyperconjugation is a permanent effect.\\nStatement II: Hyperconjugation in ethyl cation involves overlapping of $C_{sp^2}-H_{1s}$ bond with empty 2p orbital.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both I and II false",
    optionB: "(2) Statement I incorrect, II true",
    optionC: "(3) Statement I correct, II false",
    optionD: "(4) Both I and II true",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: $[Mn(CN)_6]^{3-}, [Fe(CN)_6]^{3-}, [Co(C_2O_4)_3]^{3-}$ are $d^2sp^3$ hybridised.\\nStatement II: $[MnCl_6]^{3-}$ and $[FeF_6]^{3-}$ are paramagnetic with 4 and 5 unpaired electrons.\\nOption 4.",
    imageUrl: null,
    optionA: "(1) Statement I correct, II false",
    optionB: "(2) Both I and II false",
    optionC: "(3) Statement I incorrect, II true",
    optionD: "(4) Both I and II true",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Cations precipitated in aqueous solution containing $Al^{3+}, Zn^{2+}, Ca^{2+}, Fe^{3+}, Ni^{2+}, Ba^{2+}, Cu^{2+}$ by conc. HCl followed by $H_2S$ is:",
    imageUrl: null,
    optionA: "(1) 1 ($Cu^{2+}$)",
    optionB: "(2) 3",
    optionC: "(3) 4",
    optionD: "(4) 2",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: Penicillin is bacteriostatic antibiotic.\\nStatement II: General structure contains $\\beta$-lactam ring.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both I and II false",
    optionB: "(2) Statement I incorrect, II true",
    optionC: "(3) Both I and II true",
    optionD: "(4) Statement I correct, II false",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Compound A gives D-Galactose and D-Glucose on hydrolysis. Compound A is:",
    imageUrl: null,
    optionA: "(1) Amylose",
    optionB: "(2) Sucrose",
    optionC: "(3) Maltose",
    optionD: "(4) Lactose",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "$R-CN \\xrightarrow{(i) DIBAL-H, (ii) H_2O} R-Y$. Compound Y is:",
    imageUrl: null,
    optionA: "(1) $-CH_2 NH_2$",
    optionB: "(2) $-CONH_2$",
    optionC: "(3) $-CHO$",
    optionD: "(4) $-COOH$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Dehydration of 2-phenylpropan-1-ol with conc $H_2SO_4, \\Delta \\to A + B$. Compound A (trans-1-phenylprop-1-ene) is major product (Option 3).",
    imageUrl: null,
    optionA: "(1) Reaction not possible",
    optionB: "(2) Both A and B formed equally",
    optionC: "(3) Compound A will be major product",
    optionD: "(4) Compound B will be major product",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List I with List II:\\n(a) Carbon monoxide -> (iii) Haemoglobin\\n(b) Sulphur dioxide -> (iv) Stiffness of flower buds\\n(c) Polychlorinated biphenyls -> (i) Carcinogenic\\n(d) Oxides of Nitrogen -> (ii) Metabolized by pyrus plants",
    imageUrl: null,
    optionA: "(1) a-iii, b-iv, c-i, d-ii",
    optionB: "(2) a-iv, b-i, c-iii, d-ii",
    optionC: "(3) a-i, b-ii, c-iii, d-iv",
    optionD: "(4) a-iii, b-iv, c-ii, d-i",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "If Thomson model of atom was correct, result of Rutherford gold foil experiment would have been:",
    imageUrl: null,
    optionA: "(1) All $\\alpha$-particles pass without decrease in speed",
    optionB: "(2) $\\alpha$-particles deflected over wide range",
    optionC: "(3) All $\\alpha$-particles bounce back by $180^\\circ$",
    optionD: "(4) $\\alpha$-particles pass deflected by small angles with reduced speed",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Number of $Cl=O$ bonds in chlorous acid, chloric acid and perchloric acid respectively are:",
    imageUrl: null,
    optionA: "(1) 3, 1 and 1",
    optionB: "(2) 4, 1 and 0",
    optionC: "(3) 1, 2 and 3",
    optionD: "(4) 1, 2 and 3 (Option 3)",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Select correct statements: (A) Crystalline long range order, (C) Amorphous pseudo solids, (D) Amorphous soften over temperature range. Option 4.",
    imageUrl: null,
    optionA: "(1) (A), (B), (E) only",
    optionB: "(2) (B), (D) only",
    optionC: "(3) (C), (D) only",
    optionD: "(4) (A), (C), (D) only",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Gabriel phthalimide synthesis of benzylamine: Reagent (i) benzyl bromide, (ii) $OH^-/H_2O \\to$ Benzylamine (Option 4).",
    imageUrl: null,
    optionA: "(1) Product 1",
    optionB: "(2) Product 2",
    optionC: "(3) Product 3",
    optionD: "(4) Benzylamine",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Transformation of 1-nitrobenzene to 3-chlorophenol sequence: (i) $Cl_2/FeCl_3$, (ii) $Fe/HCl$, (iii) $NaNO_2/HCl, 0^\\circ C$, (iv) $H_2O/H^+$ (Option 3).",
    imageUrl: null,
    optionA: "(1) Sequence 1",
    optionB: "(2) Sequence 2",
    optionC: "(3) Chlorination, reduction, diazotization, hydrolysis",
    optionD: "(4) Sequence 4",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Addition of silica during extraction of copper from sulphide ore converts iron oxide into iron silicate (Option 2).",
    imageUrl: null,
    optionA: "(1) Converts copper sulphide into copper silicate",
    optionB: "(2) Converts iron oxide into iron silicate",
    optionC: "(3) Reduces copper sulphide into metallic copper",
    optionD: "(4) Reduces melting point of mixture",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Equilibrium constant $K_p = 4$ for $A(s) \\rightleftharpoons M(s) + 1/2 O_2(g)$. Partial pressure of $O_2$ is _____ atm.",
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
    questionText: "400 mL 0.2M $H_2 SO_4$ mixed with 600 mL 0.1M NaOH. Temp increase is _____ $\\times 10^{-2}\\text{ K}$.",
    imageUrl: null,
    optionA: "82",
    optionB: "82",
    optionC: "82",
    optionD: "82",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "$2SO_2(g) + O_2(g) \\to 2SO_3(g)$. Initial $P_{SO_2} = 250\\text{ mbar}, P_{O_2} = 750\\text{ mbar}$. Total pressure at completion is _____ mbar.",
    imageUrl: null,
    optionA: "875",
    optionB: "875",
    optionC: "875",
    optionD: "875",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "10.0 mL 0.05M $KMnO_4$ consumed with 10.0 mL oxalic acid dihydrate. Strength is _____ $\\times 10^{-2}\\text{ g/L}$.",
    imageUrl: null,
    optionA: "1575",
    optionB: "1575",
    optionC: "1575",
    optionD: "1575",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Total number of electrons in all bonding molecular orbitals of $O_2^{2-}$ is _____.",
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
    subject: "Chemistry",
    questionText: "3 moles of $Co(en)_2 Cl_3$ gives 3 moles AgCl with excess $AgNO_3$. Secondary valency of Co is _____.",
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
    questionText: "In solvent 50% acid HA dimerizes, rest dissociates. Van't Hoff factor is _____ $\\times 10^{-2}$.",
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
    subject: "Chemistry",
    questionText: "Dihedral angle in staggered Newman projection of 1,1,1-trichloroethane is _____ degrees.",
    imageUrl: null,
    optionA: "60",
    optionB: "60",
    optionC: "60",
    optionD: "60",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "First order $A \\to 2B$. 1 mol A gives 0.2 mol B after 100 min. Half life is _____ min.",
    imageUrl: null,
    optionA: "650",
    optionB: "650",
    optionC: "650",
    optionD: "650",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "$Cu|Cu^{2+}(0.1M)||Ag^+(0.01M)|Ag$ cell potential $E_1 = 0.3095\\text{V}$. For $Cu|Cu^{2+}(0.01M)||Ag^+(0.001M)|Ag$, $E_2 = \\text{_____} \\times 10^{-2}\\text{V}$.",
    imageUrl: null,
    optionA: "28",
    optionB: "28",
    optionC: "28",
    optionD: "28",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── PHYSICS (Q31 - Q60) ──
  {
    subject: "Physics",
    questionText: "Electron approaches proton with 3 eV, forms H atom in n=3 state. Photon hits metal threshold 4000Å. Max KE emitted is:",
    imageUrl: null,
    optionA: "(1) 7.61 eV",
    optionB: "(2) 1.41 eV",
    optionC: "(3) 3.3 eV",
    optionD: "(4) No photoelectron",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Variation of angle of deviation $\\delta$ with angle of incidence i in prism is U-shaped curve peaking down (Option 2).",
    imageUrl: null,
    optionA: "(1) Graph 1",
    optionB: "(2) U-shaped curve",
    optionC: "(3) Graph 3",
    optionD: "(4) Graph 4",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Raindrop $R = 0.2\\text{ mm}$ falls from 2000m. $\\rho_w = 1000, \\rho_a = 1.2, \\eta = 1.8 \\times 10^{-5}$. Terminal speed is:",
    imageUrl: null,
    optionA: "(1) $250.6\\text{ m/s}$",
    optionB: "(2) $43.56\\text{ m/s}$",
    optionC: "(3) $4.94\\text{ m/s}$",
    optionD: "(4) $14.4\\text{ m/s}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "1 mol ideal polyatomic gas 4 vibrational modes adiabatic process $27^\\circ C \\to 37^\\circ C$. Work done on gas is close to 582 J (Option 2).",
    imageUrl: null,
    optionA: "(1) Work done by gas close to 332 J",
    optionB: "(2) Work done on gas close to 582 J",
    optionC: "(3) Work done by gas close to 582 J",
    optionD: "(4) Work done on gas close to 332 J",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Mass 0.5 kg SHM amplitude 5 cm, period 0.2 s. Potential energy at $t = T/4$ from mean position is:",
    imageUrl: null,
    optionA: "(1) 0.62 J",
    optionB: "(2) $6.2 \\times 10^{-3}\\text{ J}$",
    optionC: "(3) $1.2 \\times 10^3\\text{ J}$",
    optionD: "(4) $6.2 \\times 10^3\\text{ J}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Match List I with List II:\\na. Capacitance C -> iii. $M^{-1} L^{-2} T^4 A^2$\\nb. Permittivity $\\epsilon_0$ -> ii. $M^{-1} L^{-3} T^4 A^2$\\nc. Permeability $\\mu_0$ -> iv. $M^1 L^1 T^{-2} A^{-2}$\\nd. Electric field E -> i. $M^1 L^1 T^{-3} A^{-1}$",
    imageUrl: null,
    optionA: "(1) a-iii, b-ii, c-iv, d-i",
    optionB: "(2) a-iii, b-iv, c-ii, d-i",
    optionC: "(3) a-iv, b-ii, c-iii, d-i",
    optionD: "(4) a-iv, b-iii, c-ii, d-i",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "PE function $U(x)$ plot, $E_{mech} = 8\\text{ J}$. INCORRECT statement: at $x < x_1$, KE is smallest and particle slowest (Option 2).",
    imageUrl: null,
    optionA: "(1) at $x > x_4$, KE constant",
    optionB: "(2) at $x < x_1$, KE smallest and slowest",
    optionC: "(3) at $x = x_2$, KE greatest and fastest",
    optionD: "(4) at $x = x_3$, KE = 4 J",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "100 $\\Omega, 0.1\\mu\\text{F}$ capacitor and inductor in series across 250V. Resonant frequency 60 Hz. Inductance is:",
    imageUrl: null,
    optionA: "(1) 0.70 H",
    optionB: "(2) 70.3 mH",
    optionC: "(3) $7.03 \\times 10^{-5}\\text{ H}$",
    optionD: "(4) 70.3 H",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Pendulum mass m length l charge +q in electric field between parallel plates. Deflection angle expression is Option 3.",
    imageUrl: null,
    optionA: "(1) Option 1",
    optionB: "(2) Option 2",
    optionC: "(3) $\\tan^{-1}[\\frac{q}{mg} \\frac{C_2(V_1+V_2)}{(C_1+C_2)(d-t)}]$",
    optionD: "(4) Option 4",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Carnot engine A absorbs $T_1$ rejects T. Engine B absorbs T/2 rejects $T_3$. Work done equal. Value of T is:",
    imageUrl: null,
    optionA: "(1) $\\frac{2}{3} T_1 + \\frac{3}{2} T_3$",
    optionB: "(2) $\\frac{1}{3} T_1 + \\frac{2}{3} T_3$",
    optionC: "(3) $\\frac{3}{2} T_1 + \\frac{1}{3} T_3$",
    optionD: "(4) $\\frac{2}{3} T_1 + \\frac{1}{3} T_3$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Truth table for gate logic Y with inputs A and B is NOR gate (Option 2).",
    imageUrl: null,
    optionA: "(1) Table 1",
    optionB: "(2) NOR truth table",
    optionC: "(3) Table 3",
    optionD: "(4) Table 4",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Two long straight wires circular cross-section a and b ($a < b$). Field B variation with r is graph 3 (Option 3).",
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
    questionText: "Two identical 1 kg particles move in circle radius R under mutual gravity. Angular speed is:",
    imageUrl: null,
    optionA: "(1) $\\sqrt{G/2R^3}$",
    optionB: "(2) $\\frac{1}{2} \\sqrt{G/R^3}$",
    optionC: "(3) $\\frac{1}{2R} \\sqrt{1/G}$",
    optionD: "(4) $\\sqrt{2G/R^3}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Statements: A. Characteristic spectrum, B. Bohr stationary orbit, E. Radioactivity instability. Correct: A, B and E only (Option 2).",
    imageUrl: null,
    optionA: "(1) A, B, C, D and E",
    optionB: "(2) A, B and E only",
    optionC: "(3) B and D only",
    optionD: "(4) A, C and E only",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Magnitude of electric field at center O of square grid charges is:",
    imageUrl: null,
    optionA: "(1) $\\frac{1}{4\\pi\\epsilon_0} \\frac{q}{l^2}$",
    optionB: "(2) $\\frac{1}{4\\pi\\epsilon_0} \\frac{q}{2l^2} (2\\sqrt{2}-1)$",
    optionC: "(3) $\\frac{q}{4\\pi\\epsilon_0 (2l)^2}$",
    optionD: "(4) $\\frac{1}{4\\pi\\epsilon_0} \\frac{2q}{2l^2}\\sqrt{2}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Quantity $y = m^2 r^{-4} g^x l^{-3/2}$. Errors y, m, r, l, g are 18, 1, 0.5, 4, p. Values of x and p are:",
    imageUrl: null,
    optionA: "(1) 5 and $\\pm 2$",
    optionB: "(2) 4 and $\\pm 3$",
    optionC: "(3) 16/3 and $\\pm 3/2$",
    optionD: "(4) 8 and $\\pm 2$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Automobile mass m accelerates from rest with constant power P. Position as function of time is:",
    imageUrl: null,
    optionA: "(1) $(\\frac{9P}{8m})^{1/2} t^{3/2}$",
    optionB: "(2) $(\\frac{8P}{9m})^{1/2} t^{2/3}$",
    optionC: "(3) $(\\frac{9m}{8P})^{1/2} t^{3/2}$",
    optionD: "(4) $(\\frac{8P}{9m})^{1/2} t^{3/2}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Mars moons: period 7h 30m, radius $9.0 \\times 10^3\\text{ km}$. Mass of Mars is ($4\\pi^2/G = 6 \\times 10^{11}$):",
    imageUrl: null,
    optionA: "(1) $5.96 \\times 10^{19}\\text{ kg}$",
    optionB: "(2) $3.25 \\times 10^{21}\\text{ kg}$",
    optionC: "(3) $7.02 \\times 10^{25}\\text{ kg}$",
    optionD: "(4) $6.00 \\times 10^{23}\\text{ kg}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Force $F = F_0(1 - (t-T)/T)^2$ for time 2T. Velocity after 2T is:",
    imageUrl: null,
    optionA: "(1) $2 F_0 T / M$",
    optionB: "(2) $F_0 T / 2M$",
    optionC: "(3) $4 F_0 T / 3M$",
    optionD: "(4) $F_0 T / 3M$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Resistance $16\\Omega$ at $15^\\circ C$ and $20\\Omega$ at $100^\\circ C$. Temperature coefficient is:",
    imageUrl: null,
    optionA: "(1) $0.010^\\circ C^{-1}$",
    optionB: "(2) $0.033^\\circ C^{-1}$",
    optionC: "(3) $0.003^\\circ C^{-1}$",
    optionD: "(4) $0.042^\\circ C^{-1}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Wheels P and Q connected by belt. Radius P 3 times Q. Same rotational KE, ratio $I_1/I_2$ is x:1. Value of x is _____.",
    imageUrl: null,
    optionA: "9",
    optionB: "9",
    optionC: "9",
    optionD: "9",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Difference in number of waves for yellow light in air and vacuum column of same thickness is 1. Thickness is _____ mm.",
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
    questionText: "AM max amplitude 12 V, min 3 V. Modulation index 0.6 x. Value of x is _____.",
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
    questionText: "Flux $\\phi_B(t) = 10t^2 + 20t\\text{ mWb}$. Current through $2\\Omega$ resistor at $t = 5\\text{ s}$ is _____ mA.",
    imageUrl: null,
    optionA: "60",
    optionB: "60",
    optionC: "60",
    optionD: "60",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "SHM $x(t) = A \\sin(\\omega t + \\phi)$. Position 2 cm, velocity $2\\omega\\text{ cm/s}$ at $t=0$. Amplitude $x\\sqrt{2}\\text{ cm}$. Value of x is _____.",
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
    questionText: "Swimmer crosses river AB at $30^\\circ$ to flow. Speed equals river speed. Angle $\\theta$ with AB is _____ degrees.",
    imageUrl: null,
    optionA: "30",
    optionB: "30",
    optionC: "30",
    optionD: "30",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Circuit current at time $t = 3.2\\text{ s}$ is _____ A.",
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
    questionText: "Small block slides down hemisphere radius $R = 3\\text{ m}$. Height h where it loses contact is _____ m.",
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
    questionText: "$K_\\alpha$ X-ray Mo 0.071 nm. K electron knocked 27.5 keV. Energy when L electron knocked is _____ keV.",
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
    questionText: "Water filled 12 m tank. Depth h for emerging stream to strike ground at max range is _____ m.",
    imageUrl: null,
    optionA: "6",
    optionB: "6",
    optionC: "6",
    optionD: "6",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── MATHEMATICS (Q61 - Q90) ──
  {
    subject: "Mathematics",
    questionText: "P(a, b) reflected about $y=x$, translated 2 units +x, rotated $\\pi/4$ anti-clockwise. Final position $(-1/\\sqrt{2}, 7/\\sqrt{2})$. $2a+b = $:",
    imageUrl: null,
    optionA: "(1) 13",
    optionB: "(2) 9",
    optionC: "(3) 5",
    optionD: "(4) 7",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Value of x for 9th term in $(3^{\\log_3 \\sqrt{25^{x-1}+7}} + 3^{-\\frac{1}{8} \\log_3(5^{x-1}+1)})^{10}$ equals 180 is:",
    imageUrl: null,
    optionA: "(1) 0",
    optionB: "(2) -1",
    optionC: "(3) 2",
    optionD: "(4) 1",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Intersection of $\\frac{x-\\alpha}{1} = \\frac{y-1}{2} = \\frac{z-1}{3}$ and $\\frac{x-4}{\\beta} = \\frac{y-6}{3} = \\frac{z-7}{3}$ lies on $x+2y-z=8$. $\\alpha - \\beta = $:",
    imageUrl: null,
    optionA: "(1) 5",
    optionB: "(2) 9",
    optionC: "(3) 3",
    optionD: "(4) 7",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$f(x+y)+f(x-y) = 2f(x)f(y), f(1/2) = -1$. $\\sum_{k=1}^{20} \\frac{1}{\\sin k \\sin(k+f(k))} = $:",
    imageUrl: null,
    optionA: "(1) $\\text{cosec}^2(21) \\cos(20) \\cos(2)$",
    optionB: "(2) $\\sec^2(1) \\sec(21) \\cos(20)$",
    optionC: "(3) $\\text{cosec}^2(1) \\text{cosec}(21) \\sin(20)$",
    optionD: "(4) $\\sec^2(21) \\sin(20) \\sin(2)$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$S_1 = \\{|z-2| \\le 1\\}, S_2 = \\{z(1+i)+\\bar{z}(1-i) \\ge 4\\}$. Max $|z - 5/2|^2$ for $z \\in S_1 \\cap S_2$ is:",
    imageUrl: null,
    optionA: "(1) $\\frac{3+2\\sqrt{2}}{4}$",
    optionB: "(2) $\\frac{5+2\\sqrt{2}}{2}$",
    optionC: "(3) $\\frac{3+2\\sqrt{2}}{2}$",
    optionD: "(4) $\\frac{5+2\\sqrt{2}}{4}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Student 8 true-false questions. Smallest n for prob at least n correct $< 1/2$ is:",
    imageUrl: null,
    optionA: "(1) 5",
    optionB: "(2) 6",
    optionC: "(3) 3",
    optionD: "(4) 4",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If $\\tan(\\pi/9), x, \\tan(7\\pi/18)$ in A.P. and $\\tan(\\pi/9), y, \\tan(5\\pi/18)$ in A.P., then $|x - 2y| = $:",
    imageUrl: null,
    optionA: "(1) 4",
    optionB: "(2) 3",
    optionC: "(3) 0",
    optionD: "(4) 1",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Distribution $x_1=2, x_2=6, x_3=8, x_4=9; f_1=4, f_2=4, f_3=\\alpha, f_4=\\beta$ mean 6, var 6.8. If $x_3$ changes 8 to 7, new mean is:",
    imageUrl: null,
    optionA: "(1) 4",
    optionB: "(2) 5",
    optionC: "(3) 17/3",
    optionD: "(4) 16/3",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Area of region bounded by $y - x = 2$ and $x^2 = y$ is:",
    imageUrl: null,
    optionA: "(1) 16/3",
    optionB: "(2) 2/3",
    optionC: "(3) 9/2",
    optionD: "(4) 4/3",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Solution $(x-x^3) dy = (y + y x^2 - 3x^4) dx, y(3)=3$. $y(4) = $:",
    imageUrl: null,
    optionA: "(1) 4",
    optionB: "(2) 12",
    optionC: "(3) 8",
    optionD: "(4) 16",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$\\lim_{x \\to 0} \\frac{x}{\\sqrt[8]{1-\\sin x} - \\sqrt[8]{1+\\sin x}} = $:",
    imageUrl: null,
    optionA: "(1) 0",
    optionB: "(2) 4",
    optionC: "(3) -4",
    optionD: "(4) -1",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Sides of parallelogram along $4x+5y=0, 7x+2y=0$. Diagonal $11x+7y=9$. Other diagonal passes through:",
    imageUrl: null,
    optionA: "(1) (1, 2)",
    optionB: "(2) (2, 2)",
    optionC: "(3) (2, 1)",
    optionD: "(4) (1, 3)",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$\\alpha = \\max_{x \\in \\mathbb{R}} \\{8^{2\\sin 3x} \\cdot 4^{4\\cos 3x}\\}, \\beta = \\min_{x \\in \\mathbb{R}} \\{\\dots\\}$. Roots of $8x^2+bx+c=0$ are $\\alpha^{1/5}, \\beta^{1/5}$. $c-b = $:",
    imageUrl: null,
    optionA: "(1) 42",
    optionB: "(2) 47",
    optionC: "(3) 43",
    optionD: "(4) 50",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$f(x) = \\max \\{\\sin t : 0 \\le t \\le x\\}$ for $0 \\le x \\le \\pi$; $2+\\cos x$ for $x > \\pi$. Option:",
    imageUrl: null,
    optionA: "(1) f continuous everywhere but not diff at 1 point",
    optionB: "(2) f differentiable everywhere in $(0, \\infty)$",
    optionC: "(3) f not continuous at 2 points",
    optionD: "(4) f continuous everywhere but not diff at 2 points",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$R = \\{(x, y) \\in \\mathbb{N} \\times \\mathbb{N} : x^3 - 3x^2 y - x y^2 + 3y^3 = 0\\}$. Relation R is:",
    imageUrl: null,
    optionA: "(1) Symmetric but neither reflexive nor transitive",
    optionB: "(2) Reflexive but neither symmetric nor transitive",
    optionC: "(3) Reflexive and symmetric, not transitive",
    optionD: "(4) An equivalence relation",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Negation of \"for all $M > 0$, there exists $x \\in S$ such that $x \\ge M$\":",
    imageUrl: null,
    optionA: "(1) there exists $M > 0$ such that $x < M$ for all $x \\in S$",
    optionB: "(2) Option 2",
    optionC: "(3) Option 3",
    optionD: "(4) Option 4",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Circle C touches y-axis at (0, 6) and cuts off intercept $6\\sqrt{5}$ on x-axis. Radius of circle C is:",
    imageUrl: null,
    optionA: "(1) $\\sqrt{53}$",
    optionB: "(2) 9",
    optionC: "(3) 8",
    optionD: "(4) $\\sqrt{82}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$\\vec{a} = \\vec{b} \\times (\\vec{b} \\times \\vec{c})$. Magnitudes $\\sqrt{2}, 1, 2$. Angle between $\\vec{b}$ and $\\vec{c}$ is $\\theta \\in (0, \\pi/2)$. $1+\\tan \\theta = $:",
    imageUrl: null,
    optionA: "(1) $\\sqrt{3}+1$",
    optionB: "(2) 2",
    optionC: "(3) 1",
    optionD: "(4) $\\frac{\\sqrt{3}+1}{\\sqrt{3}}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Matrices A, B of $3 \\times 3$. $A^2 - B^2$ invertible, $A^5 = B^5, A^3 B^2 = A^2 B^3$. $\\det(A^3 + B^3) = $:",
    imageUrl: null,
    optionA: "(1) 2",
    optionB: "(2) 4",
    optionC: "(3) 1",
    optionD: "(4) 0",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$f(x) = \\int_a^x g(t)dt$. $f(x)=0$ has 5 distinct roots in (a, b). $g(x)g'(x)=0$ has at least:",
    imageUrl: null,
    optionA: "(1) Twelve roots",
    optionB: "(2) Five roots",
    optionC: "(3) Seven roots",
    optionD: "(4) Three roots",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$\\vec{a} = \\hat{i} - \\alpha\\hat{j} + \\beta\\hat{k}, \\vec{b} = 3\\hat{i} + \\beta\\hat{j} - \\alpha\\hat{k}, \\vec{c} = -\\alpha\\hat{i} - 2\\hat{j} + \\hat{k}$. $\\vec{a} \\cdot \\vec{b} = -1, \\vec{b} \\cdot \\vec{c} = 10$. $(\\vec{a} \\times \\vec{b}) \\cdot \\vec{c} = \\text{_____}$.",
    imageUrl: null,
    optionA: "9",
    optionB: "9",
    optionC: "9",
    optionD: "9",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Distance of P(3, 4, 4) from line joining Q(3, -4, -5) and R(2, -3, 1) and plane $2x+y+z=7$ is _____.",
    imageUrl: null,
    optionA: "7",
    optionB: "7",
    optionC: "7",
    optionD: "7",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Real part of $z = \\frac{3+2i\\cos\\theta}{1-3i\\cos\\theta}$ is 0 ($\\theta \\in (0, \\pi/2)$). $\\sin^2 3\\theta + \\cos^2 \\theta = \\text{_____}$.",
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
    questionText: "Ellipse center (3, -4), focus (4, -4), vertex (5, -4). Tangent $mx-y=4 (m>0)$. Value of $5m^2$ is _____.",
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
    questionText: "$\\int_0^\\pi \\sin^3 x e^{-\\sin^2 x} dx = \\alpha - \\frac{\\beta}{e} \\int_0^1 \\sqrt{t} e^t dt$. $\\alpha + \\beta = \\text{_____}$.",
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
    questionText: "Real roots of equation $e^{4x} - e^{3x} - 4e^{2x} - e^x + 1 = 0$ is _____.",
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
    questionText: "Differential equation $dy = e^{\\alpha x + y} dx$. $y(\\log_e 2) = \\log_e 2, y(0) = \\log_e(1/2)$. Value of $\\alpha$ is _____.",
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
    questionText: "Divisors of form $4n+1$ of $(10)^{10} \\cdot (11)^{11} \\cdot (13)^{13}$ is _____.",
    imageUrl: null,
    optionA: "924",
    optionB: "924",
    optionC: "924",
    optionD: "924",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "$A = \\{n^2 \\le n+10000\\}, B = \\{3k+1\\}, C = \\{2k\\}$. Sum of elements in $A \\cap (B-C)$ is _____.",
    imageUrl: null,
    optionA: "832",
    optionB: "832",
    optionC: "832",
    optionD: "832",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Matrix $A = \\begin{pmatrix} 1 & 1 & 1 \\\\ 0 & 1 & 1 \\\\ 0 & 0 & 1 \\end{pmatrix}, M = A + A^2 + \\dots + A^{20}$. Sum of elements of M is _____.",
    imageUrl: null,
    optionA: "2020",
    optionB: "2020",
    optionC: "2020",
    optionD: "2020",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  }
];

async function seedJee2021Jul27Shift2() {
  console.log(`🚀 Compiling JEE Main 2021 (27 Jul Shift 2) Paper with ${rawQuestions.length} questions...`);

  const paperData = {
    examName: "JEE Main",
    year: 2021,
    shiftName: "JEE Main 2021 (27 Jul Shift 2)",
    examDate: "2021-07-27T15:00:00Z",
    totalMarks: 300,
    totalQuestions: 90,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'JEE Main 2021 (27 Jul Shift 2).json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved paper JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding JEE Main 2021 (27 Jul Shift 2) into PostgreSQL via Prisma...`);
  
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
      name: "JEE Main 2021 (27 Jul Shift 2)"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "JEE Main 2021 (27 Jul Shift 2)",
      date: new Date("2021-07-27T15:00:00Z")
    }
  });
  console.log(`Created Shift "JEE Main 2021 (27 Jul Shift 2)" (ID: ${shift.id})`);

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

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for JEE Main 2021 (27 Jul Shift 2) into Database!`);
}

seedJee2021Jul27Shift2()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
