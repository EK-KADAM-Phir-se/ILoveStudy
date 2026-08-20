const prisma = require('../../lib/prisma');
const fs = require('fs');
const path = require('path');

const rawQuestions = [
  // ── PHYSICS (Q1 - Q30) ──
  {
    subject: "Physics",
    questionText: "If the length of the pendulum in pendulum clock increases by 0.1%, then the error in time per day is:",
    imageUrl: null,
    optionA: "(1) 43.2 s",
    optionB: "(2) 8.64 s",
    optionC: "(3) 86.4 s",
    optionD: "(4) 4.32 s",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The angle between vector $\\vec{A}$ and $(\\vec{A} - \\vec{B})$ in terms of A, B and $\\theta$ is:",
    imageUrl: null,
    optionA: "(1) $\\tan^{-1}\\left(\\frac{-B \\cos \\theta}{A - B \\sin \\theta}\\right)$",
    optionB: "(2) \\tan^{-1}\\left(\\frac{\\sqrt{3}B}{2A - B}\\right)$",
    optionC: "(3) $\\tan^{-1}\\left(\\frac{-B}{2A - B\\sqrt{3}}\\right)$",
    optionD: "(4) \\tan^{-1}\\left(\\frac{A}{0.7B}\\right)$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Match List I (Quantity) with List II (Dimension):\\na. Magnetic induction -> iii. $[M T^{-2} A^{-1}]$\\nb. Magnetic flux -> i. $[M L^2 T^{-2} A^{-1}]$\\nc. Magnetic permeability -> iv. $[M L T^{-2} A^{-2}]$\\nd. Magnetization -> ii. $[M^0 L^{-1} A]$",
    imageUrl: null,
    optionA: "(1) a-iii, b-ii, c-iv, d-i",
    optionB: "(2) a-iii, b-i, c-iv, d-ii",
    optionC: "(3) a-ii, b-iv, c-i, d-iii",
    optionD: "(4) a-ii, b-i, c-iv, d-iii",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A particle of mass m is suspended from ceiling through string of length L. Particle moves in horizontal circle of radius $r = L/\\sqrt{2}$. Speed of particle will be:",
    imageUrl: null,
    optionA: "(1) $\\sqrt{rg}$",
    optionB: "(2) $\\sqrt{2rg}$",
    optionC: "(3) $\\sqrt{rg/2}$",
    optionD: "(4) $2\\sqrt{rg}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A bomb is dropped by a fighter plane flying horizontally. To an observer sitting in the plane, trajectory of bomb is:",
    imageUrl: null,
    optionA: "(1) Straight line vertically down the plane",
    optionB: "(2) Parabola opposite to motion",
    optionC: "(3) Parabola in direction of motion",
    optionD: "(4) Hyperbola",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Solid cylinder length 80 cm, mass M, radius 20 cm. Moment of inertia about parallel axis CD is $2.7\\text{ kg m}^2$. Density of material is:",
    imageUrl: null,
    optionA: "(1) $1.49 \\times 10^2\\text{ kg m}^{-3}$",
    optionB: "(2) $7.5 \\times 10^1\\text{ kg m}^{-3}$",
    optionC: "(3) $14.9\\text{ kg m}^{-3}$",
    optionD: "(4) $7.5 \\times 10^2\\text{ kg m}^{-3}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Two blocks 3 kg and 5 kg over smooth pulley. Breaking stress of metal wire is $\\frac{24}{\\pi} \\times 10^2\\text{ N m}^{-2}$. Minimum radius of wire is ($g = 10\\text{ m/s}^2$):",
    imageUrl: null,
    optionA: "(1) 1250 cm",
    optionB: "(2) 1.25 cm",
    optionC: "(3) 125 cm",
    optionD: "(4) 12.5 cm",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Equal masses of 3 liquids x, y, z are at $10^\\circ\\text{C}, 20^\\circ\\text{C}, 30^\\circ\\text{C}$. x+y mixture is $16^\\circ\\text{C}$, y+z mixture is $26^\\circ\\text{C}$. Temperature when x+z mixed is:",
    imageUrl: null,
    optionA: "(1) $25.62^\\circ\\text{C}$",
    optionB: "(2) $20.28^\\circ\\text{C}$",
    optionC: "(3) $28.32^\\circ\\text{C}$",
    optionD: "(4) $23.84^\\circ\\text{C}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Refrigerator consumes 35 W power between $-10^\\circ\\text{C}$ and $25^\\circ\\text{C}$. Average heat transferred per second is:",
    imageUrl: null,
    optionA: "(1) $350\\text{ J s}^{-1}$",
    optionB: "(2) $298\\text{ J s}^{-1}$",
    optionC: "(3) $263\\text{ J s}^{-1}$",
    optionD: "(4) $35\\text{ J s}^{-1}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Cylindrical container $4.0 \\times 10^{-3}\\text{ m}^3$ contains 1 mol $H_2$ and 2 mol $CO_2$ at 400 K. Pressure of mixture is ($R = 8.3\\text{ J mol}^{-1}\\text{K}^{-1}$):",
    imageUrl: null,
    optionA: "(1) $24.9 \\times 10^3\\text{ Pa}$",
    optionB: "(2) $249 \\times 10^1\\text{ Pa}$",
    optionC: "(3) $24.9 \\times 10^5\\text{ Pa}$",
    optionD: "(4) 24.9 Pa",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Two thin coaxial rings radius a with charges $+Q, -Q$ separated by s. Potential difference between centres is:",
    imageUrl: null,
    optionA: "(1) $\\frac{Q}{2\\pi\\epsilon_0} [\\frac{1}{a} - \\frac{1}{\\sqrt{s^2+a^2}}]$",
    optionB: "(2) \\frac{Q}{4\\pi\\epsilon_0} [\\frac{1}{a} + \\frac{1}{\\sqrt{s^2+a^2}}]$",
    optionC: "(3) $\\frac{Q}{4\\pi\\epsilon_0} [\\frac{1}{a} + \\frac{1}{\\sqrt{s^2+a^2}}]$",
    optionD: "(4) \\frac{Q}{2\\pi\\epsilon_0} [\\frac{1}{a} + \\frac{1}{\\sqrt{s^2+a^2}}]$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Capacitor area A, separation d. Two dielectric slabs $K_1, K_2$ of area A/2 and thickness d/2 inserted. Capacitance is:",
    imageUrl: null,
    optionA: "(1) $\\epsilon_0 A [\\frac{1}{2} \\frac{K_1 K_2}{K_1 + K_2}]$",
    optionB: "(2) \\epsilon_0 A [\\frac{1}{2} + \\frac{2(K_1+K_2)}{K_1 K_2}]$",
    optionC: "(3) $\\epsilon_0 A [\\frac{1}{2} + \\frac{K_1+K_2}{K_1 K_2}]$",
    optionD: "(4) \\epsilon_0 A [\\frac{1}{2} + \\frac{K_1 K_2}{2(K_1+K_2)}]$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Electric bulb 500 W at 100 V in 200 V circuit. Resistance R in series so power delivered is 500 W is:",
    imageUrl: null,
    optionA: "(1) $30\\Omega$",
    optionB: "(2) $5\\Omega$",
    optionC: "(3) $20\\Omega$",
    optionD: "(4) $10\\Omega$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Resistances $2\\Omega, 4\\Omega, 6\\Omega, 8\\Omega$ connected to get equivalent resistance $\\frac{46}{3}\\Omega$:",
    imageUrl: null,
    optionA: "(1) $2\\Omega, 6\\Omega$ parallel with $4\\Omega, 8\\Omega$ series",
    optionB: "(2) $4\\Omega, 6\\Omega$ parallel with $2\\Omega, 8\\Omega$ series",
    optionC: "(3) $2\\Omega, 4\\Omega$ parallel with $6\\Omega, 8\\Omega$ series",
    optionD: "(4) $6\\Omega, 8\\Omega$ parallel with $2\\Omega, 4\\Omega$ series",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "AC source $100\\mu\\text{F}, 100\\Omega, 0.50\\text{ H}, 50\\Omega$ with $\\omega = 100\\text{ rad/s}, 200\\text{ V}$. Current I flowing is:",
    imageUrl: null,
    optionA: "(1) 5.9 A",
    optionB: "(2) 6 A",
    optionC: "(3) 0.94 A",
    optionD: "(4) 3.16 A",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Light beam $E = 800 \\sin \\omega(t - x/c)$. Electron moves normal at $3 \\times 10^7\\text{ m/s}$. Max magnetic force on electron is:",
    imageUrl: null,
    optionA: "(1) $1.28 \\times 10^{-21}\\text{ N}$",
    optionB: "(2) $12.8 \\times 10^{-18}\\text{ N}$",
    optionC: "(3) $1.28 \\times 10^{-18}\\text{ N}$",
    optionD: "(4) $12.8 \\times 10^{-17}\\text{ N}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "De-Broglie wavelength of particle with KE E is $\\lambda$. Extra energy given so wavelength reduces to 75% of initial value is:",
    imageUrl: null,
    optionA: "(1) E",
    optionB: "(2) 7E/9",
    optionC: "(3) 16E/9",
    optionD: "(4) E/9",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Radioactive decay $N_A(0) = 2 N_B(0)$, decay constant $\\lambda$. Evolution curve of $N_B(t)/N_B(0)$ vs t reaches max at $t = 1/\\lambda$ (Option 3).",
    imageUrl: null,
    optionA: "(1) Curve 1",
    optionB: "(2) Curve 2",
    optionC: "(3) Curve peaking at $1/\\lambda$",
    optionD: "(4) Curve 4",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Four NOR gates connected. Truth table corresponds to AND gate (Option 3).",
    imageUrl: null,
    optionA: "(1) Table 1",
    optionB: "(2) Table 2",
    optionC: "(3) AND gate truth table",
    optionD: "(4) Table 4",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Transmitting antenna height 50 m, receiving 80 m. Range of communication LOS mode is ($R = 6400\\text{ km}$):",
    imageUrl: null,
    optionA: "(1) 80.2 km",
    optionB: "(2) 144.1 km",
    optionC: "(3) 57.28 km",
    optionD: "(4) 45.5 km",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Gravity accuracy 4%, period T accuracy 3%. Accuracy of energy E estimate is _____ %.",
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
    subject: "Physics",
    questionText: "Coefficient of static friction between blocks 0.5. Max horizontal force to move blocks together ($1\\text{ kg}, 2\\text{ kg}$) is _____ N.",
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
    questionText: "SHMs $x_1 = 5 \\sin(2\\pi t + \\pi/4)$ and $x_2 = 5\\sqrt{2}(\\sin 2\\pi t + \\cos 2\\pi t)$. Amplitude of second motion is _____ times first.",
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
    questionText: "Two waves $y_1 = A_1 \\sin k(x - vt), y_2 = A_2 \\sin k(x - vt + x_0)$. $A_1 = 12\\text{ mm}, A_2 = 5\\text{ mm}, x_0 = 3.5\\text{ cm}, k = 6.28\\text{ cm}^{-1}$. Resulting amplitude is _____ mm.",
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
    subject: "Physics",
    questionText: "Cyclotron max accelerating potential 12 kV. Revolutions by proton to achieve 1/6 speed of light is _____.",
    imageUrl: null,
    optionA: "543",
    optionB: "543",
    optionC: "543",
    optionD: "543",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Equilateral triangle coil side 10 cm in vertical plane, magnetic field 20 mT. Torque at 0.2 A is $\\sqrt{x} \\times 10^{-5}\\text{ N m}$. Value of x is _____.",
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
    questionText: "Circular coil radius 8.0 cm, 20 turns rotated at $50\\text{ rad/s}$ in $3.0 \\times 10^{-2}\\text{ T}$ field. Max induced emf is _____ $\\times 10^{-2}\\text{ V}$.",
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
    questionText: "Object at 12 cm from convex lens, mirror focal length 15 cm at 8 cm on other side. Image coincides with object. Distance when mirror removed is _____ cm.",
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
    questionText: "Intensity on screen I. Two polaroids $P_1, P_2$. Intensity after $P_1$ is $I/2$. $P_2$ rotated so intensity becomes $3I/8$. Angle of rotation is _____ degrees.",
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
    questionText: "Zener diode circuit ($1\\text{ k}\\Omega, 10\\text{V}, 5\\text{ k}\\Omega, 24\\text{V}$). Power across zener diode is _____ mW.",
    imageUrl: null,
    optionA: "120",
    optionB: "120",
    optionC: "120",
    optionD: "120",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── CHEMISTRY ──
  {
    subject: "Chemistry",
    questionText: "Chlordiazepoxide belongs to which class of drug?",
    imageUrl: null,
    optionA: "(1) Analgesic",
    optionB: "(2) Tranquillizer",
    optionC: "(3) Antacid",
    optionD: "(4) Antibiotic",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Interaction energy of London forces proportional to $r^{-x}$. Value of x is:",
    imageUrl: null,
    optionA: "(1) 6",
    optionB: "(2) -6",
    optionC: "(3) 3",
    optionD: "(4) -3",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Bond order and magnetic behaviour of $\\text{O}_2^-$ ion are:",
    imageUrl: null,
    optionA: "(1) 1.5 and diamagnetic",
    optionB: "(2) 1.5 and paramagnetic",
    optionC: "(3) 2 and diamagnetic",
    optionD: "(4) 1 and paramagnetic",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Assertion (A): Heavy water used for study of reaction mechanism.\\nReason (R): O-H bond cleavage slower than O-D bond.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both A and R true, R is correct explanation",
    optionB: "(2) (A) is true but (R) is false",
    optionC: "(3) (A) is false but (R) is true",
    optionD: "(4) Both A and R true, R NOT correct explanation",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Assertion (A): Barium carbonate is insoluble in water and highly stable.\\nReason (R): Thermal stability of carbonates increases with increasing cationic size.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) (A) is true but (R) is false",
    optionB: "(2) Both A and R true",
    optionC: "(3) (A) is false but (R) is true",
    optionD: "(4) Both A and R false",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Friedel-Crafts acylation product of 4-bromo-1-methoxybenzene with $AlBr_3/(C_2 H_5)_2 O$ gives major product 1-(5-bromo-2-hydroxyphenyl)propan-1-one (Option 1).",
    imageUrl: null,
    optionA: "(1) Product 1",
    optionB: "(2) Product 2",
    optionC: "(3) Product 3",
    optionD: "(4) Product 4",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which compound is NOT aromatic?",
    imageUrl: null,
    optionA: "(1) Benzene",
    optionB: "(2) Cyclopentadienyl anion (or non-aromatic option 2)",
    optionC: "(3) Furan",
    optionD: "(4) Tropylium cation",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Reaction of aldehyde with HCN/$H_2 O \\to X \\xrightarrow{LiAlH_4/H_3 O^+} Y$. Products X and Y are cyanohydrin and 1-amino-2-hydroxy derivative (Option 1).",
    imageUrl: null,
    optionA: "(1) Cyanohydrin and amino-alcohol",
    optionB: "(2) Option 2",
    optionC: "(3) Option 3",
    optionD: "(4) Option 4",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Assertion (A): Photochemical smog causes cracking of rubber.\\nReason (R): Presence of ozone, nitric oxide, acrolein makes it oxidizing.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) (A) is false but (R) is true",
    optionB: "(2) Both A and R true, R NOT correct explanation",
    optionC: "(3) Both A and R true, R is correct explanation",
    optionD: "(4) (A) is true but (R) is false",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The sol given below with negatively charged colloidal particles is:",
    imageUrl: null,
    optionA: "(1) $\\text{AgNO}_3$ added to KI solution",
    optionB: "(2) KI added to $\\text{AgNO}_3$ solution",
    optionC: "(3) $\\text{Al}_2\\text{O}_3 \\cdot x\\text{H}_2\\text{O}$ in water",
    optionD: "(4) $\\text{FeCl}_3$ added to hot water",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: Sphalerite is sulphide ore of zinc and copper glance is sulphide ore of copper.\\nStatement II: Possible to separate two sulphide ores using depressants in froth flotation.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Statement I true, II false",
    optionB: "(2) Both I and II false",
    optionC: "(3) Both I and II true",
    optionD: "(4) Statement I false, II true",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Number of non-ionisable hydrogen atoms in final product obtained from hydrolysis of $\\text{PCl}_5$ is:",
    imageUrl: null,
    optionA: "(1) 0",
    optionB: "(2) 1",
    optionC: "(3) 2",
    optionD: "(4) 3",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Chalcogen group elements are:",
    imageUrl: null,
    optionA: "(1) Se, Te and Po",
    optionB: "(2) O, Ti and Po",
    optionC: "(3) Se, Tb and Pu",
    optionD: "(4) S, Te and Pm",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Arrange Cobalt complexes in order of increasing CFSE:\\n$[CoF_6]^{3-}, [Co(H_2O)_6]^{2+}, [Co(NH_3)_6]^{3+}, [Co(en)_3]^{3+}$",
    imageUrl: null,
    optionA: "(1) B < C < D < A",
    optionB: "(2) B < A < C < D",
    optionC: "(3) A < B < C < D",
    optionD: "(4) C < D < B < A",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Indicate complex/complex ion which did NOT show any geometrical isomerism:",
    imageUrl: null,
    optionA: "(1) $[Co(NH_3)_4 Cl_2]^+$",
    optionB: "(2) $[Co(NH_3)_3 (NO_2)_3]$",
    optionC: "(3) $[Co(CN)_5(NC)]^{3-}$",
    optionD: "(4) $[CoCl_2(en)_2]$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which phenol does NOT give colour when condensed with phthalic anhydride in presence of conc. $\\text{H}_2\\text{SO}_4$?",
    imageUrl: null,
    optionA: "(1) Phenol 1",
    optionB: "(2) Phenol 2",
    optionC: "(3) Phenol 3",
    optionD: "(4) p-cresol (Option 4)",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Number of stereoisomers possible for 1,2-dimethyl cyclopropane is:",
    imageUrl: null,
    optionA: "(1) Two",
    optionB: "(2) One",
    optionC: "(3) Four",
    optionD: "(4) Three",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match Chemical Reaction with Reagent used:\\na. $\\text{CH}_3\\text{COOCH}_2\\text{CH}_3 \\to \\text{CH}_3\\text{CH}_2\\text{OH} \\to$ ii. $\\text{H}_2\\text{SO}_4/\\text{H}_2\\text{O}$\\nb. $\\text{CH}_3\\text{COOCH}_3 \\to \\text{CH}_3\\text{CHO} \\to$ iii. DIBAL-H / $\\text{H}_2\\text{O}$\\nc. $\\text{CH}_3\\text{C}\\equiv\\text{N} \\to \\text{CH}_3\\text{CHO} \\to$ iv. $\\text{SnCl}_2, \\text{HCl} / \\text{H}_2\\text{O}$\\nd. Nitrile to ketone $\\to$ i. $\\text{CH}_3\\text{MgBr} / \\text{H}_3\\text{O}^+$",
    imageUrl: null,
    optionA: "(1) a-ii, b-iii, c-iv, d-i",
    optionB: "(2) a-ii, b-iv, c-iii, d-i",
    optionC: "(3) a-iii, b-ii, c-i, d-iv",
    optionD: "(4) a-iv, b-ii, c-iii, d-i",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Acetylation of 2-amino-N-phenylbenzamide gives major product Option 2.",
    imageUrl: null,
    optionA: "(1) Product 1",
    optionB: "(2) N-acetylated product",
    optionC: "(3) Product 3",
    optionD: "(4) Product 4",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Assertion (A): Sucrose is disaccharide and non-reducing sugar.\\nReason (R): Glycosidic linkage between $C_1$ of $\\beta$-glucose and $C_2$ of $\\alpha$-fructose.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both A and R true, R is correct explanation",
    optionB: "(2) (A) is true but (R) is false",
    optionC: "(3) (A) is false but (R) is true",
    optionD: "(4) Both A and R true, R NOT correct explanation",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "100 mL $\\text{Na}_3\\text{PO}_4$ solution contains 3.45 g sodium. Molarity is _____ $\\times 10^{-2}\\text{ mol L}^{-1}$.",
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
    questionText: "Water $\\Delta_{vap} H = 41\\text{ kJ mol}^{-1}$ at 373 K, 1 bar. Internal energy change during evaporation is _____ $\\text{kJ mol}^{-1}$.",
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
    questionText: "Equilibrium constant $K_c = 100$ for $A+B \\rightleftharpoons C+D$ starting 1M each. Equilibrium concentration of D is _____ $\\times 10^{-2}\\text{ M}$.",
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
    questionText: "0.471 g organic compound gave 1.44 g barium sulfate. Percentage of sulphur is _____ %.",
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
    questionText: "Rate constants $4.8 \\times 10^{-5}$ and $2.4 \\times 10^{-3}$. $K_c = X$. Value of $1/X$ is _____.",
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
    questionText: "Chloro compound A gives aldehydes on ozonolysis. 1.53 g A gives 448 mL vapour at STP. Carbon atoms in A is _____.",
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
    questionText: "83.6 g ethylene glycol in 625 g water. Freezing point is _____ K. ($K_f = 1.86$).",
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
    questionText: "Galvanic cell $E_{cell} = \\text{_____} \\times 10^{-2}\\text{ V}$.",
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
    questionText: "Overall stability constant of $[Cu(NH_3)_4]^{2+}$ is $2.1 \\times 10^{13}$. Dissociation constant is $y \\times 10^{-14}$. y is _____.",
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
    questionText: "Metal 500 nm radiation, threshold frequency $4.3 \\times 10^{14}\\text{ Hz}$. Velocity of photoelectron is _____ $\\times 10^5\\text{ ms}^{-1}$.",
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
    questionText: "If $(\\sqrt{3}+i)^{100} = 2^{99}(p+iq)$, p and q are roots of:",
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
    questionText: "Pencil 10 inches, PC = $\\sqrt{5}$, $\\angle PCB = \\tan^{-1}(2)$. Rotate pencil about C so distance is 1 inch:",
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
    questionText: "Circle C touches $x = 2y$ at (2, 1) and intersects $x^2+y^2+2y-5=0$ at P and Q (PQ diameter). Diameter of C is:",
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
    questionText: "Point $P(-2\\sqrt{6}, \\sqrt{3})$ on $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1, e = \\sqrt{5}/2$. Tangent & normal intersect conjugate axis at Q, R. QR is:",
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
    questionText: "Locus of mid points of chords of $x^2 - y^2 = 4$ touching $y^2 = 8x$ is:",
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
    questionText: "Local max of $f(x) = (2/3)^{x^2}, x > 0$ is:",
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
    questionText: "Matrix A of $3 \\times 3$. $\\det(2 \\text{Adj}(2 \\text{Adj}(\\text{Adj}(2A)))) = 241$. $\\det(A^2) = \\text{_____}$.",
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

async function seedJee2021Aug26Shift2() {
  console.log(`🚀 Compiling JEE Main 2021 (26 Aug Shift 2) Paper with ${rawQuestions.length} questions...`);

  const paperData = {
    examName: "JEE Main",
    year: 2021,
    shiftName: "JEE Main 2021 (26 Aug Shift 2)",
    examDate: "2021-08-26T15:00:00Z",
    totalMarks: 300,
    totalQuestions: 90,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'JEE Main 2021 (26 Aug Shift 2).json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved paper JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding JEE Main 2021 (26 Aug Shift 2) into PostgreSQL via Prisma...`);
  
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
      name: "JEE Main 2021 (26 Aug Shift 2)"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "JEE Main 2021 (26 Aug Shift 2)",
      date: new Date("2021-08-26T15:00:00Z")
    }
  });
  console.log(`Created Shift "JEE Main 2021 (26 Aug Shift 2)" (ID: ${shift.id})`);

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

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for JEE Main 2021 (26 Aug Shift 2) into Database!`);
}

seedJee2021Aug26Shift2()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
