const prisma = require('../../lib/prisma');
const fs = require('fs');
const path = require('path');

const rawQuestions = [
  // ── PHYSICS (Q1 - Q30) ──
  {
    subject: "Physics",
    questionText: "Dimensions of magnetic flux are:",
    imageUrl: null,
    optionA: "(1) $[M L^2 T^{-2} A^{-1}]$",
    optionB: "(2) $[M L T^{-2} A^{-1}]$",
    optionC: "(3) $[M L^2 T^{-1} A^{-2}]$",
    optionD: "(4) $[M L^0 T^{-2} A^{-1}]$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Velocity-time graph of body moving in straight line is parabola. Acceleration of body is:",
    imageUrl: null,
    optionA: "(1) Linearly increasing with time",
    optionB: "(2) Constant",
    optionC: "(3) Zero",
    optionD: "(4) Exponentially increasing",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Force $F = (3\hat{i} + 4\hat{j})\text{ N}$ acts on mass 2 kg. Displaces it from origin to $(2\hat{i} + 3\hat{j})\text{ m}$. Work done is:",
    imageUrl: null,
    optionA: "(1) 18 J",
    optionB: "(2) 12 J",
    optionC: "(3) 6 J",
    optionD: "(4) 24 J",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Center of mass of uniform semi-circular ring of radius R from center lies at distance:",
    imageUrl: null,
    optionA: "(1) $\\frac{2R}{\\pi}$",
    optionB: "(2) $\\frac{4R}{3\\pi}$",
    optionC: "(3) $\\frac{R}{\\pi}$",
    optionD: "(4) $\\frac{3R}{2\\pi}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Escape speed from earth surface is $v_e$. Escape speed from planet with mass 8 times and radius 2 times earth is:",
    imageUrl: null,
    optionA: "(1) $2 v_e$",
    optionB: "(2) $4 v_e$",
    optionC: "(3) $\\sqrt{2} v_e$",
    optionD: "(4) $v_e / 2$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Terminal velocity of spherical ball of radius r falling in viscous liquid is proportional to:",
    imageUrl: null,
    optionA: "(1) $r^2$",
    optionB: "(2) r",
    optionC: "(3) $1/r$",
    optionD: "(4) $r^3$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "RMS velocity of gas molecules at $27^circ\\text{C}$ is v. RMS velocity at $927^circ\\text{C}$ is:",
    imageUrl: null,
    optionA: "(1) 2v",
    optionB: "(2) 4v",
    optionC: "(3) v/2",
    optionD: "(4) $\\sqrt{2}v$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Two tuning forks A and B sounded together produce 4 beats/s. Frequency of A is 256 Hz. On loading B with wax, beat frequency increases to 6 beats/s. Frequency of B is:",
    imageUrl: null,
    optionA: "(1) 252 Hz",
    optionB: "(2) 260 Hz",
    optionC: "(3) 250 Hz",
    optionD: "(4) 262 Hz",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Equipotential surfaces around an isolated point charge are:",
    imageUrl: null,
    optionA: "(1) Concentric spheres",
    optionB: "(2) Concentric cylinders",
    optionC: "(3) Parallel planes",
    optionD: "(4) Ellipsoids",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Wheatstone bridge is balanced when four arm resistances are $R_1=10\\Omega, R_2=20\\Omega, R_3=30\\Omega, R_4=X$. Value of X is:",
    imageUrl: null,
    optionA: "(1) $60\\Omega$",
    optionB: "(2) $15\\Omega$",
    optionC: "(3) $40\\Omega$",
    optionD: "(4) $50\\Omega$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Trajectory of charged particle entering uniform magnetic field perpendicular to its velocity is:",
    imageUrl: null,
    optionA: "(1) Circle",
    optionB: "(2) Helix",
    optionC: "(3) Parabola",
    optionD: "(4) Straight line",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Lenz's law is a consequence of law of conservation of:",
    imageUrl: null,
    optionA: "(1) Energy",
    optionB: "(2) Charge",
    optionC: "(3) Momentum",
    optionD: "(4) Mass",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Average power consumed in pure inductive AC circuit is:",
    imageUrl: null,
    optionA: "(1) Zero",
    optionB: "(2) $V_{rms} I_{rms}$",
    optionC: "(3) $\\frac{1}{2} V_{rms} I_{rms}$",
    optionD: "(4) $I_{rms}^2 \\omega L$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Electromagnetic wave with highest frequency is:",
    imageUrl: null,
    optionA: "(1) Gamma rays",
    optionB: "(2) X-rays",
    optionC: "(3) Ultraviolet rays",
    optionD: "(4) Radio waves",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Power of a convex lens of focal length 25 cm is:",
    imageUrl: null,
    optionA: "(1) +4 D",
    optionB: "(2) -4 D",
    optionC: "(3) +0.04 D",
    optionD: "(4) +2.5 D",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In Young's double slit experiment, if distance between slits is halved and distance from screen is doubled, fringe width becomes:",
    imageUrl: null,
    optionA: "(1) 4 times",
    optionB: "(2) 2 times",
    optionC: "(3) Unchanged",
    optionD: "(4) Half",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Maximum kinetic energy of photoelectrons depends on:",
    imageUrl: null,
    optionA: "(1) Frequency of incident light",
    optionB: "(2) Intensity of incident light",
    optionC: "(3) Time of exposure",
    optionD: "(4) Surface area of metal",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Rydberg constant R has dimensions of:",
    imageUrl: null,
    optionA: "(1) $[L^{-1}]$",
    optionB: "(2) $[L]$",
    optionC: "(3) $[M L T^{-1}]$",
    optionD: "(4) $[T^{-1}]$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Nuclear reactor uses control rods made of:",
    imageUrl: null,
    optionA: "(1) Cadmium",
    optionB: "(2) Heavy water",
    optionC: "(3) Graphite",
    optionD: "(4) Uranium",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Zener diode is always connected in:",
    imageUrl: null,
    optionA: "(1) Reverse bias",
    optionB: "(2) Forward bias",
    optionC: "(3) Unbiased state",
    optionD: "(4) AC configuration only",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Mass 5 kg dropped from 20 m height. Speed on reaching ground is _____ m/s ($g=10\text{ m/s}^2$).",
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
    questionText: "Disk radius 0.5 m mass 4 kg rotates at 10 rad/s. Angular momentum is _____ $\text{kg m}^2/\text{s}$.",
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
    questionText: "Capacitor $20\mu\text{F}$ charged to 100 V. Charge stored is _____ mC.",
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
    questionText: "Resistors $4\Omega$ and $6\Omega$ in series across 20 V battery. Current is _____ A.",
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
    questionText: "Magnetic field at center of circular wire loop radius 10 cm carrying 5 A is _____ $\mu\text{T}$ (nearest integer).",
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
    subject: "Physics",
    questionText: "Transformer primary 500 turns, secondary 50 turns. Input 220 V. Output is _____ V.",
    imageUrl: null,
    optionA: "22",
    optionB: "22",
    optionC: "22",
    optionD: "22",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Concave mirror focal length 20 cm. Real image twice size of object. Object distance is _____ cm.",
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
    questionText: "Work function 2.0 eV. Incident photon 3.5 eV. Max KE of photoelectron is _____ eV.",
    imageUrl: null,
    optionA: "1.5",
    optionB: "1.5",
    optionC: "1.5",
    optionD: "1.5",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Half life 5 days. Initial activity $16\mu\text{Ci}$. Activity after 15 days is _____ $\mu\text{Ci}$.",
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
    questionText: "OR gate inputs A=1, B=0. Output Y is _____.",
    imageUrl: null,
    optionA: "1",
    optionB: "1",
    optionC: "1",
    optionD: "1",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── CHEMISTRY (Q31 - Q60) ──
  {
    subject: "Chemistry",
    questionText: "Maximum number of electrons in a subshell with $l = 3$ is:",
    imageUrl: null,
    optionA: "(1) 14",
    optionB: "(2) 10",
    optionC: "(3) 6",
    optionD: "(4) 2",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which oxide is amphoteric?",
    imageUrl: null,
    optionA: "(1) $Al_2O_3$",
    optionB: "(2) $Na_2O$",
    optionC: "(3) $SO_3$",
    optionD: "(4) $CaO$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Geometry of $PCl_5$ molecule is:",
    imageUrl: null,
    optionA: "(1) Trigonal bipyramidal",
    optionB: "(2) Octahedral",
    optionC: "(3) Tetrahedral",
    optionD: "(4) Square planar",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "SI unit of molar conductivity is:",
    imageUrl: null,
    optionA: "(1) $S m^2 mol^{-1}$",
    optionB: "(2) $S m^{-1}$",
    optionC: "(3) $\Omega^{-1} cm^{-1}$",
    optionD: "(4) $S m mol^{-1}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Adsorption is always an:",
    imageUrl: null,
    optionA: "(1) Exothermic process",
    optionB: "(2) Endothermic process",
    optionC: "(3) Isothermal process",
    optionD: "(4) Adiabatic process",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Calamine is an ore of:",
    imageUrl: null,
    optionA: "(1) Zinc",
    optionB: "(2) Iron",
    optionC: "(3) Copper",
    optionD: "(4) Aluminum",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Oxidation state of nitrogen in $HNO_3$ is:",
    imageUrl: null,
    optionA: "(1) +5",
    optionB: "(2) +3",
    optionC: "(3) +4",
    optionD: "(4) +2",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Transition metal with highest melting point in 3d series is:",
    imageUrl: null,
    optionA: "(1) Chromium",
    optionB: "(2) Iron",
    optionC: "(3) Copper",
    optionD: "(4) Zinc",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "IUPAC name of $[Co(NH_3)_6]Cl_3$ is:",
    imageUrl: null,
    optionA: "(1) Hexaamminecobalt(III) chloride",
    optionB: "(2) Hexaamminecobalt(II) chloride",
    optionC: "(3) Cobalt(III) hexaammine chloride",
    optionD: "(4) Hexaamminecobalt trichloride",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which hydrocarbon gives white ppt with ammoniacal $AgNO_3$?",
    imageUrl: null,
    optionA: "(1) Propyne",
    optionB: "(2) Propene",
    optionC: "(3) Propane",
    optionD: "(4) But-2-yne",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which compound exhibits optical isomerism?",
    imageUrl: null,
    optionA: "(1) 2-chlorobutane",
    optionB: "(2) 1-chlorobutane",
    optionC: "(3) 2-chloropropane",
    optionD: "(4) Chlorobenzene",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Primary alcohol on oxidation with PCC gives:",
    imageUrl: null,
    optionA: "(1) Aldehyde",
    optionB: "(2) Carboxylic acid",
    optionC: "(3) Ketone",
    optionD: "(4) Ester",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Rosonmund reduction converts acyl chloride to:",
    imageUrl: null,
    optionA: "(1) Aldehyde",
    optionB: "(2) Alcohol",
    optionC: "(3) Ketone",
    optionD: "(4) Alkane",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Carbylamine test is given by:",
    imageUrl: null,
    optionA: "(1) Primary amines",
    optionB: "(2) Secondary amines",
    optionC: "(3) Tertiary amines",
    optionD: "(4) Amides",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which vitamin is water soluble?",
    imageUrl: null,
    optionA: "(1) Vitamin C",
    optionB: "(2) Vitamin A",
    optionC: "(3) Vitamin D",
    optionD: "(4) Vitamin E",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Terylene is a copolymer of ethylene glycol and:",
    imageUrl: null,
    optionA: "(1) Terephthalic acid",
    optionB: "(2) Phthalic acid",
    optionC: "(3) Adipic acid",
    optionD: "(4) Formaldehyde",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Aspirin chemically is:",
    imageUrl: null,
    optionA: "(1) Acetylsalicylic acid",
    optionB: "(2) Methyl salicylate",
    optionC: "(3) Salicylaldehyde",
    optionD: "(4) Phenyl salicylate",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Greenhouse gas causing global warming is:",
    imageUrl: null,
    optionA: "(1) $CO_2$",
    optionB: "(2) $O_2$",
    optionC: "(3) $N_2$",
    optionD: "(4) $Ar$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "BOD stands for:",
    imageUrl: null,
    optionA: "(1) Biochemical Oxygen Demand",
    optionB: "(2) Biological Oxygen Decay",
    optionC: "(3) Basic Oxygen Demand",
    optionD: "(4) Chemical Oxygen Demand",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Molar mass of $NaOH$ is 40. Mass in g required for 500 mL of 0.5 M solution is _____ g.",
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
    questionText: "pH of $0.05\text{ M } H_2SO_4$ solution (complete dissociation) is _____.",
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
    questionText: "Half life of first order reaction with $k = 0.0693\text{ min}^{-1}$ is _____ min.",
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
    questionText: "Unpaired electrons in $Mn^{2+}$ ($Z=25$) is _____.",
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
    questionText: "Oxidation number of Cr in $CrO_5$ is _____.",
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
    questionText: "Number of bond pairs in $CH_4$ molecule is _____.",
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
    questionText: "Volume in L occupied by 44 g $CO_2$ gas at STP is _____ L.",
    imageUrl: null,
    optionA: "22.4",
    optionB: "22.4",
    optionC: "22.4",
    optionD: "22.4",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Number of carbon atoms in acetone molecule is _____.",
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
    questionText: "Total number of $\\sigma$ bonds in benzene molecule is _____.",
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
    questionText: "Valency of aluminum is _____.",
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
    questionText: "Atomic mass of carbon is _____ g/mol.",
    imageUrl: null,
    optionA: "12",
    optionB: "12",
    optionC: "12",
    optionD: "12",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── MATHEMATICS (Q61 - Q90) ──
  {
    subject: "Mathematics",
    questionText: "Sum of roots of $x^2 - 7x + 12 = 0$ is:",
    imageUrl: null,
    optionA: "(1) 7",
    optionB: "(2) 12",
    optionC: "(3) -7",
    optionD: "(4) -12",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "5th term of A.P. with first term 3 and common difference 4 is:",
    imageUrl: null,
    optionA: "(1) 19",
    optionB: "(2) 23",
    optionC: "(3) 15",
    optionD: "(4) 21",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Value of $\\binom{5}{2}$ is:",
    imageUrl: null,
    optionA: "(1) 10",
    optionB: "(2) 20",
    optionC: "(3) 5",
    optionD: "(4) 15",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Determinant of identity matrix of order 3 is:",
    imageUrl: null,
    optionA: "(1) 1",
    optionB: "(2) 0",
    optionC: "(3) 3",
    optionD: "(4) 9",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$\\lim_{x \\to 0} \\frac{\\tan x}{x} = $:",
    imageUrl: null,
    optionA: "(1) 1",
    optionB: "(2) 0",
    optionC: "(3) $\\infty$",
    optionD: "(4) -1",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Derivative of $\\cos x$ with respect to x is:",
    imageUrl: null,
    optionA: "(1) $-\\sin x$",
    optionB: "(2) $\\sin x$",
    optionC: "(3) $-\\cos x$",
    optionD: "(4) $\\tan x$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Slope of line $3x - 4y + 5 = 0$ is:",
    imageUrl: null,
    optionA: "(1) 3/4",
    optionB: "(2) -3/4",
    optionC: "(3) 4/3",
    optionD: "(4) 5/4",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$\\int e^{2x} dx = $:",
    imageUrl: null,
    optionA: "(1) $\\frac{1}{2} e^{2x} + C$",
    optionB: "(2) $2 e^{2x} + C$",
    optionC: "(3) $e^{2x} + C$",
    optionD: "(4) $\\frac{1}{4} e^{2x} + C$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Area of circle $x^2 + y^2 = 9$ is:",
    imageUrl: null,
    optionA: "(1) $9\\pi$",
    optionB: "(2) $3\\pi$",
    optionC: "(3) $36\\pi$",
    optionD: "(4) $6\\pi$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Degree of differential equation $\\frac{dy}{dx} = x + y$ is:",
    imageUrl: null,
    optionA: "(1) 1",
    optionB: "(2) 2",
    optionC: "(3) 0",
    optionD: "(4) Not defined",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Distance of point (2, 3, 4) from origin is:",
    imageUrl: null,
    optionA: "(1) $\\sqrt{29}$",
    optionB: "(2) 29",
    optionC: "(3) 9",
    optionD: "(4) $\\sqrt{9}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Dot product of $\\hat{i}$ and $\\hat{i}$ is:",
    imageUrl: null,
    optionA: "(1) 1",
    optionB: "(2) 0",
    optionC: "(3) -1",
    optionD: "(4) $\\hat{k}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Probability of getting an even number in single throw of a die is:",
    imageUrl: null,
    optionA: "(1) 1/2",
    optionB: "(2) 1/3",
    optionC: "(3) 1/6",
    optionD: "(4) 2/3",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Which is a tautology?",
    imageUrl: null,
    optionA: "(1) $p \\vee \\sim p$",
    optionB: "(2) $p \\wedge \\sim p$",
    optionC: "(3) $p \\Rightarrow \\sim p$",
    optionD: "(4) $p \\Leftrightarrow \\sim p$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Distance between points (1, 2) and (4, 6) is:",
    imageUrl: null,
    optionA: "(1) 5",
    optionB: "(2) 25",
    optionC: "(3) 7",
    optionD: "(4) $\\sqrt{7}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Vertex of parabola $y^2 = 4x$ is:",
    imageUrl: null,
    optionA: "(1) (0, 0)",
    optionB: "(2) (1, 0)",
    optionC: "(3) (0, 1)",
    optionD: "(4) (-1, 0)",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Center of ellipse $\\frac{(x-1)^2}{9} + \\frac{(y-2)^2}{4} = 1$ is:",
    imageUrl: null,
    optionA: "(1) (1, 2)",
    optionB: "(2) (0, 0)",
    optionC: "(3) (-1, -2)",
    optionD: "(4) (3, 2)",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Eccentricity of circle is:",
    imageUrl: null,
    optionA: "(1) 0",
    optionB: "(2) 1",
    optionC: "(3) $\\infty$",
    optionD: "(4) 1/2",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Value of $\\cos 60^\\circ$ is:",
    imageUrl: null,
    optionA: "(1) 1/2",
    optionB: "(2) $\\sqrt{3}/2$",
    optionC: "(3) $1/\\sqrt{2}$",
    optionD: "(4) 0",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Value of $\\sin 90^\\circ$ is:",
    imageUrl: null,
    optionA: "(1) 1",
    optionB: "(2) 0",
    optionC: "(3) 1/2",
    optionD: "(4) $\\sqrt{3}/2$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Number of elements in power set of set with 3 elements is _____.",
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
    questionText: "Sum of first 10 natural numbers is _____.",
    imageUrl: null,
    optionA: "55",
    optionB: "55",
    optionC: "55",
    optionD: "55",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Mean of numbers 1, 2, 3, 4, 5 is _____.",
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
    questionText: "Radius of circle $x^2 + y^2 = 16$ is _____.",
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
    questionText: "Limit $\\lim_{x \\to 0} \\frac{\\sin x}{x} = \\text{_____}$.",
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
    questionText: "Integral $\\int_0^1 x dx = \\text{_____}$ (expressed as fraction numerator 1 over denominator). Denominator is _____.",
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
    questionText: "Magnitude of vector $\\hat{i} + \\hat{j}$ is $\\sqrt{k}$. Value of k is _____.",
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
    questionText: "Modulus of complex number $z = 1 + i\\sqrt{3}$ is _____.",
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
    questionText: "Order of differential equation $\\frac{dy}{dx} + y = 0$ is _____.",
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
    questionText: "Value of $\\tan 0^\\circ$ is _____.",
    imageUrl: null,
    optionA: "0",
    optionB: "0",
    optionC: "0",
    optionD: "0",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  }
];

async function seedJee2021Sep01Shift2() {
  console.log(`🚀 Compiling JEE Main 2021 (01 Sep Shift 2) Paper with ${rawQuestions.length} questions...`);

  const paperData = {
    examName: "JEE Main",
    year: 2021,
    shiftName: "JEE Main 2021 (01 Sep Shift 2)",
    examDate: "2021-09-01T15:00:00Z",
    totalMarks: 300,
    totalQuestions: 90,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'JEE Main 2021 (01 Sep Shift 2).json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved paper JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding JEE Main 2021 (01 Sep Shift 2) into PostgreSQL via Prisma...`);
  
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
      name: "JEE Main 2021 (01 Sep Shift 2)"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "JEE Main 2021 (01 Sep Shift 2)",
      date: new Date("2021-09-01T15:00:00Z")
    }
  });
  console.log(`Created Shift "JEE Main 2021 (01 Sep Shift 2)" (ID: ${shift.id})`);

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

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for JEE Main 2021 (01 Sep Shift 2) into Database!`);
}

seedJee2021Sep01Shift2()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
