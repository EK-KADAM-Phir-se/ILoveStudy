const prisma = require('../../lib/prisma');
const fs = require('fs');
const path = require('path');

const rawQuestions = [
  // ── PHYSICS (Q1 - Q30) ──
  {
    subject: "Physics",
    questionText: "Two vectors $\\vec{X}$ and $\\vec{Y}$ equal magnitude. $|\\vec{X}-\\vec{Y}| = n |\\vec{X}+\\vec{Y}|$. Angle between $\\vec{X}$ and $\\vec{Y}$ is:",
    imageUrl: null,
    optionA: "(1) $\\cos^{-1}\\left(\\frac{-n^2-1}{n^2-1}\\right)$",
    optionB: "(2) \\cos^{-1}\\left(\\frac{n^2-1}{-n^2-1}\\right)$",
    optionC: "(3) $\\cos^{-1}\\left(\\frac{n^2+1}{-n^2-1}\\right)$",
    optionD: "(4) \\cos^{-1}\\left(\\frac{n^2+1}{n^2-1}\\right)$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Force $F = A \\cos Bx + C \\sin Dt$. Dimensional formula of $AD/B$ is:",
    imageUrl: null,
    optionA: "(1) $[M^0 L T^{-1}]$",
    optionB: "(2) $[M L^2 T^{-3}]$",
    optionC: "(3) $[M^1 L^1 T^{-2}]$",
    optionD: "(4) $[M^2 L^2 T^{-3}]$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Time t and distance x relation $t = m x^2 + n x$. Retardation of motion is:",
    imageUrl: null,
    optionA: "(1) $2m v^3$",
    optionB: "(2) $2mn v^3$",
    optionC: "(3) $2n v^3$",
    optionD: "(4) $2n^2 v^3$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Balloon moving upwards at $10\\text{ m/s}$. Object dropped from 75 m height. Height of balloon when object strikes ground ($g=10\\text{ m/s}^2$) is:",
    imageUrl: null,
    optionA: "(1) 300 m",
    optionB: "(2) 200 m",
    optionC: "(3) 125 m",
    optionD: "(4) 250 m",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Instantaneous velocity $v = \\alpha t + \\beta t^2$. Distance travelled between 1 s and 2 s is:",
    imageUrl: null,
    optionA: "(1) $3\\alpha + 7\\beta$",
    optionB: "(2) \\frac{3}{2}\\alpha + \\frac{7}{3}\\beta$",
    optionC: "(3) $\\frac{\\alpha}{2} + \\frac{\\beta}{3}$",
    optionD: "(4) $\\frac{3}{2}\\alpha + \\frac{7}{2}\\beta$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Force $\\vec{F} = (40\\hat{i} + 10\\hat{j})\\text{ N}$ acts on mass 5 kg from rest. Position vector $\\vec{r}$ at $t = 10\\text{ s}$ is:",
    imageUrl: null,
    optionA: "(1) $(100\\hat{i} + 400\\hat{j})\\text{ m}$",
    optionB: "(2) $(100\\hat{i} + 100\\hat{j})\\text{ m}$",
    optionC: "(3) $(400\\hat{i} + 100\\hat{j})\\text{ m}$",
    optionD: "(4) $(400\\hat{i} + 400\\hat{j})\\text{ m}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Planet mass double earth, density equal to earth. Weight of object on that planet is:",
    imageUrl: null,
    optionA: "(1) 2W",
    optionB: "(2) W",
    optionC: "(3) $2^{1/3} W$",
    optionD: "(4) $\\sqrt{2} W$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Heat engine efficiency 1/6. Sink temp reduced by $62^\\circ\\text{C}$, efficiency doubled. Temp of source is:",
    imageUrl: null,
    optionA: "(1) $124^\\circ\\text{C}$",
    optionB: "(2) $37^\\circ\\text{C}$",
    optionC: "(3) $62^\\circ\\text{C}$",
    optionD: "(4) $99^\\circ\\text{C}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Two soap bubbles $r_1$ and $r_2$ in vacuum combine under isothermal conditions. Resulting radius is:",
    imageUrl: null,
    optionA: "(1) $\\frac{r_1 r_2}{r_1 + r_2}$",
    optionB: "(2) $\\sqrt{r_1 r_2}$",
    optionC: "(3) $\\sqrt{r_1^2 + r_2^2}$",
    optionD: "(4) $\\frac{r_1+r_2}{2}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In SHM, fraction of total mechanical energy in kinetic energy when particle is midway between mean and extreme position is:",
    imageUrl: null,
    optionA: "(1) 1/2",
    optionB: "(2) 3/4",
    optionC: "(3) 1/3",
    optionD: "(4) 1/4",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Two electric dipoles $p_1$ and $p_2$. Resultant field makes angle $37^\\circ$ with axis of A. Ratio $p_1 / p_2$ is ($\\sin 37^\\circ = 3/5$):",
    imageUrl: null,
    optionA: "(1) 3/8",
    optionB: "(2) 3/2",
    optionC: "(3) 2/3",
    optionD: "(4) 4/3",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Capacitor free charge $q_f$, dielectric K. Bound charge $q_b$ is:",
    imageUrl: null,
    optionA: "(1) $q_b = q_f(1 - 1/\\sqrt{k})$",
    optionB: "(2) $q_b = q_f(1 - 1/k)$",
    optionC: "(3) $q_b = q_f(1 + 1/\\sqrt{k})$",
    optionD: "(4) $q_b = q_f(1 + 1/k)$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Potentiometer AC length 250 cm. Shifted to point (2) length 400 cm. Ratio of emf of two cells $\\epsilon_1 / \\epsilon_2$ is:",
    imageUrl: null,
    optionA: "(1) 5/3",
    optionB: "(2) 8/5",
    optionC: "(3) 4/3",
    optionD: "(4) 3/2",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Potentiometer wire $10\\Omega$. Sliding contact in middle, potential drop across $2\\Omega$ resistor connected to 20 V battery is:",
    imageUrl: null,
    optionA: "(1) 10 V",
    optionB: "(2) 5 V",
    optionC: "(3) 40/9 V",
    optionD: "(4) 40/11 V",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Two ions same mass charges 1:2 projected in field speeds 2:3. Ratio of radii is:",
    imageUrl: null,
    optionA: "(1) 1 : 4",
    optionB: "(2) 4 : 3",
    optionC: "(3) 3 : 1",
    optionD: "(4) 2 : 3",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "$10\\Omega$ resistor across 220V, 50Hz. Time for current to change from max to rms value is:",
    imageUrl: null,
    optionA: "(1) 2.5 ms",
    optionB: "(2) 1.5 ms",
    optionC: "(3) 3.0 ms",
    optionD: "(4) 4.5 ms",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Prism index $\\mu$ angle A. Minimum deviation angle also A. Relation is:",
    imageUrl: null,
    optionA: "(1) $A = 2 \\cos^{-1}(\\mu/2)$",
    optionB: "(2) $A = \\sin^{-1}(\\mu/2)$",
    optionC: "(3) $A = \\sin^{-1}(\\sqrt{\\frac{\\mu-1}{2}})$",
    optionD: "(4) $A = \\cos^{-1}(\\mu/2)$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Light entering air to medium $\\mu = 4/3$ suffers TIR at adjacent surface. Max value of angle $\\theta$ is:",
    imageUrl: null,
    optionA: "(1) $\\sin^{-1}(\\sqrt{7}/3)$",
    optionB: "(2) $\\sin^{-1}(\\sqrt{5}/4)$",
    optionC: "(3) $\\sin^{-1}(\\sqrt{7}/4)$",
    optionD: "(4) $\\sin^{-1}(\\sqrt{5}/3)$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Electron speed v and photon speed c have same De-Broglie wavelength. Ratio of KE electron to photon is:",
    imageUrl: null,
    optionA: "(1) 3c/v",
    optionB: "(2) v/3c",
    optionC: "(3) v/2c",
    optionD: "(4) 2c/v",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Stopping potential 4.8 V for $\\lambda$. Doubled wavelength stopping potential 1.6 V. Threshold wavelength is:",
    imageUrl: null,
    optionA: "(1) $2\\lambda$",
    optionB: "(2) $4\\lambda$",
    optionC: "(3) $8\\lambda$",
    optionD: "(4) $6\\lambda$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Force $F = (5y + 20)\\hat{j}\\text{ N}$ acts on particle. Work done from $y = 0$ to $y = 10\\text{ m}$ is _____ J.",
    imageUrl: null,
    optionA: "450",
    optionB: "450",
    optionC: "450",
    optionD: "450",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Solid disc radius 20 cm mass 10 kg rotates 600 rpm. Retarding torque to bring to rest in 10 s is _____ $\\pi \\times 10^{-1}\\text{ Nm}$.",
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
    questionText: "Gas A and B number density $2 \\times 10^{25}\\text{ m}^{-3}$, diameter 10Å and 5Å. Ratio of mean free path A to B is _____ $\\times 10^{-2}$.",
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
    questionText: "16 $\\Omega$ wire bent into square loop. 9V supply internal $1\\Omega$. Potential drop across diagonals is _____ $\\times 10^{-1}\\text{ V}$.",
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
    subject: "Physics",
    questionText: "Frequency for equal average power dissipated in $5\\Omega, 40\\mu\\text{F}, 0.1\\text{ H}$ circuit is _____ $\\text{rad s}^{-1}$.",
    imageUrl: null,
    optionA: "500",
    optionB: "500",
    optionC: "500",
    optionD: "500",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Light 500 nm, work function 1.25 eV. Max KE electrons bent in circle radius 30 cm. B is _____ $\\times 10^{-7}\\text{ T}$.",
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
    subject: "Physics",
    questionText: "Energy required to break nucleus of ${}^{27}_{13}Al$ is _____ $\\times 10^{-3}\\text{ J}$.",
    imageUrl: null,
    optionA: "27",
    optionB: "27",
    optionC: "27",
    optionD: "27",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Nuclear activity becomes (1/8)th of initial value in 30 years. Half life is _____ years.",
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
    questionText: "Intrinsic charge carriers $1.5 \\times 10^{16}\\text{ m}^{-3}$. Hole density $4.5 \\times 10^{22}\\text{ m}^{-3}$. Electron density is _____ $\\times 10^9\\text{ m}^{-3}$.",
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
    questionText: "Message signal 20 kHz, 20 V modulates carrier 1 MHz, 20 V. Modulation index is _____.",
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
    questionText: "Spin only magnetic moments for free $Ti^{3+}, V^{2+}, Sc^{3+}$ ions are:",
    imageUrl: null,
    optionA: "(1) 3.87, 1.73, 0",
    optionB: "(2) 1.73, 3.87, 0",
    optionC: "(3) 1.73, 0, 3.87",
    optionD: "(4) 0, 3.87, 1.73",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Ionic radii $F^-$ (1.33Å) and $O^{2-}$ (1.4Å), covalent N (0.74Å). Correct statement for ionic radius $N^{3-}$:",
    imageUrl: null,
    optionA: "(1) Smaller than $F^-$ and N",
    optionB: "(2) Bigger than $O^{2-}$ and $F^-$",
    optionC: "(3) Bigger than $F^-$ and N, smaller than $O^{2-}$",
    optionD: "(4) Smaller than $O^{2-}$ and $F^-$, bigger than N",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Correct bond order sequence is:",
    imageUrl: null,
    optionA: "(1) $O_2^{2-} > O_2^+ > O_2^- > O_2$",
    optionB: "(2) $O_2^+ > O_2^- > O_2^{2-} > O_2$",
    optionC: "(3) $O_2^+ > O_2 > O_2^- > O_2^{2-}$",
    optionD: "(4) $O_2 > O_2^- > O_2^{2-} > O_2^+$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Species having one $\\pi$-bond and maximum canonical forms:",
    imageUrl: null,
    optionA: "(1) $SO_3$",
    optionB: "(2) $O_2$",
    optionC: "(3) $SO_2$",
    optionD: "(4) $CO_3^{2-}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Process in which change in oxidation state is five:",
    imageUrl: null,
    optionA: "(1) $Cr_2 O_7^{2-} \\to 2Cr^{3+}$",
    optionB: "(2) $MnO_4^- \\to Mn^{2+}$",
    optionC: "(3) $CrO_4^{2-} \\to Cr^{3+}$",
    optionD: "(4) $C_2 O_4^{2-} \\to 2CO_2$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which metal forms interstitial hydride easily?",
    imageUrl: null,
    optionA: "(1) Cr",
    optionB: "(2) Fe",
    optionC: "(3) Mn",
    optionD: "(4) Co",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match Elements with Properties:\\na. Li -> iv. Carbonate decomposes easily\\nb. Na -> iii. Bicarbonate in fire extinguisher\\nc. K -> ii. Most abundant in cell fluid\\nd. Cs -> i. Poor water solubility of I- salt",
    imageUrl: null,
    optionA: "(1) a-iv, b-iii, c-ii, d-i",
    optionB: "(2) a-i, b-iii, c-ii, d-iv",
    optionC: "(3) a-iv, b-ii, c-iii, d-i",
    optionD: "(4) a-i, b-ii, c-iii, d-iv",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Correct decreasing order of densities of chloro-bromobenzenes (D: 1-bromo-4-chlorobenzene, C: 1,4-dichlorobenzene, B: chlorobenzene, A: benzene) is:",
    imageUrl: null,
    optionA: "(1) D > C > B > A",
    optionB: "(2) C > D > A > B",
    optionC: "(3) C > B > A > D",
    optionD: "(4) A > B > C > D",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which is the strongest acid?",
    imageUrl: null,
    optionA: "(1) Butane",
    optionB: "(2) Cyclopropane",
    optionC: "(3) Cyclopentadiene derivative",
    optionD: "(4) Cyclopentadiene (Option 4)",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: CFCs breakdown by visible radiation releasing Cl.\\nStatement II: Atmospheric ozone reacts with NO to give $N_2$ and $O_2$.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Statement I incorrect, II true",
    optionB: "(2) Both Statement I and II false",
    optionC: "(3) Statement I correct, II false",
    optionD: "(4) Both Statement I and II correct",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match Colloids with Classification:\\na. Cheese -> iv. liquid in solid\\nb. Pumice stone -> iii. gas in solid\\nc. Hair cream -> i. liquid in liquid\\nd. Cloud -> ii. liquid in gas",
    imageUrl: null,
    optionA: "(1) a-iv, b-iii, c-ii, d-i",
    optionB: "(2) a-iv, b-i, c-iii, d-ii",
    optionC: "(3) a-iii, b-iv, c-i, d-ii",
    optionD: "(4) a-iv, b-iii, c-i, d-ii",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match Metallurgical terms:\\na. Concentration of Ag ore -> iii. Leaching with dilute NaCN\\nb. Blast furnace -> ii. Pig iron\\nc. Blister copper -> i. Reverberatory furnace\\nd. Froth floatation -> iv. Sulfide ores",
    imageUrl: null,
    optionA: "(1) a-iii, b-ii, c-i, d-iv",
    optionB: "(2) a-iii, b-iv, c-i, d-ii",
    optionC: "(3) a-iv, b-i, c-iii, d-ii",
    optionD: "(4) a-iv, b-iii, c-ii, d-i",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which metal complex is most stable?",
    imageUrl: null,
    optionA: "(1) $[Co(en)(NH_3)_4]Cl_2$",
    optionB: "(2) $[Co(en)_3]Cl_2$",
    optionC: "(3) $[Co(en)_2(NH_3)_2]Cl_2$",
    optionD: "(4) $[Co(NH_3)_6]Cl_2$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Product A (acetal) and Product B (alkene) formed from 4-bromobutanal with excess EtOH/HCl then $t-BuOK$ is Option 1.",
    imageUrl: null,
    optionA: "(1) Acetal and alkene derivatives",
    optionB: "(2) Option 2",
    optionC: "(3) Option 3",
    optionD: "(4) Option 4",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Major product P of diazotization-coupling of 1-methylcyclohexanamine is 1-methylcyclohexanol (Option 4).",
    imageUrl: null,
    optionA: "(1) Product 1",
    optionB: "(2) Product 2",
    optionC: "(3) Product 3",
    optionD: "(4) 1-methylcyclohexanol",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Maleic anhydride can be prepared by:",
    imageUrl: null,
    optionA: "(1) Heating trans-but-2-enedioic acid",
    optionB: "(2) Heating cis-but-2-enedioic acid",
    optionC: "(3) Treating cis-but-2-enedioic acid with alcohol",
    optionD: "(4) Treating trans-but-2-enedioic acid with alcohol",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Reaction of nitrobenzene $\\xrightarrow{Sn+HCl} A \\xrightarrow{C_6 H_5 N_2^+ Cl^-} P$. Product P (yellow dye) is 4-(phenyldiazenyl)aniline (Option 2).",
    imageUrl: null,
    optionA: "(1) Product 1",
    optionB: "(2) 4-(phenyldiazenyl)aniline",
    optionC: "(3) Product 3",
    optionD: "(4) Product 4",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Benzonitrile with 1 eq $CH_3 MgBr$ followed by hydrolysis gives yellow liquid P. P gives positive:",
    imageUrl: null,
    optionA: "(1) Iodoform test",
    optionB: "(2) Schiff's test",
    optionC: "(3) Ninhydrin test",
    optionD: "(4) Tollen's test",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "A biodegradable polyamide can be made from:",
    imageUrl: null,
    optionA: "(1) Glycine and isoprene",
    optionB: "(2) Hexamethylene diamine and adipic acid",
    optionC: "(3) Glycine and aminocaproic acid",
    optionD: "(4) Styrene and caproic acid",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Correct structure of Cytosine is Option 3.",
    imageUrl: null,
    optionA: "(1) Structure 1",
    optionB: "(2) Structure 2",
    optionC: "(3) Cytosine structure",
    optionD: "(4) Structure 4",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Number of significant figures in 0.00340 is _____.",
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
    questionText: "Accelerated electron speed $5 \\times 10^6\\text{ m/s}$ uncertainty 0.02%. Uncertainty in location is $x \\times 10^{-9}\\text{ m}$. x is _____.",
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
    subject: "Chemistry",
    questionText: "LPG cylinder 300 kPa at $27^\\circ\\text{C}$ withstands $1.2 \\times 10^6\\text{ Pa}$. Min bursting temp is _____ $^\\circ\\text{C}$.",
    imageUrl: null,
    optionA: "927",
    optionB: "927",
    optionC: "927",
    optionD: "927",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "System does 200 J work and absorbs 150 J heat. Change in internal energy is _____ J.",
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
    questionText: "$Ba(OH)_2$ 0.005M solution $[H_3 O^+]$ is _____ $\\times 10^{-12}\\text{ mol L}^{-1}$.",
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
    questionText: "0.8 g organic compound Kjeldahl 42% nitrogen. Neutralized by _____ mL of 1M $H_2 SO_4$.",
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
    questionText: "Reaction of 2,3-dimethylbut-2-ene with $Br_2/CCl_4$. Total stereoisomers for Product P is _____.",
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
    questionText: "3.00 g substance X in 100 g $CCl_4$ raises boiling point 0.60 K. Molar mass of X is _____ $\\text{g mol}^{-1}$. ($K_b = 5.0$).",
    imageUrl: null,
    optionA: "250",
    optionB: "250",
    optionC: "250",
    optionD: "250",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "$A \\to B$ concentration of B increased 0.2 mol/L in 30 min. Rate is _____ $\\times 10^{-1}\\text{ mol L}^{-1}\\text{h}^{-1}$.",
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
    questionText: "Number of electrons in 4f orbital of $Ho^{3+}$ ($Z=67$) is _____.",
    imageUrl: null,
    optionA: "10",
    optionB: "10",
    optionC: "10",
    optionD: "10",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── MATHEMATICS (Q61 - Q90) ──
  {
    subject: "Mathematics",
    questionText: "Number of real solutions of equation $x^2 - |x| - 12 = 0$ is:",
    imageUrl: null,
    optionA: "(1) 2",
    optionB: "(2) 3",
    optionC: "(3) 1",
    optionD: "(4) 4",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Sum of all rational numbers in expansion of $(2^{1/3} + 3^{1/4})^{12}$ is:",
    imageUrl: null,
    optionA: "(1) 89",
    optionB: "(2) 27",
    optionC: "(3) 35",
    optionD: "(4) 43",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Greatest value of term independent of x in $(x \\sin \\alpha + a \\frac{\\cos \\alpha}{x})^{10}$ is $\\frac{10!}{(5!)^2}$. Value of a is:",
    imageUrl: null,
    optionA: "(1) -1",
    optionB: "(2) 1",
    optionC: "(3) -2",
    optionD: "(4) 2",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Lowest integer greater than $(1 + \\frac{1}{10^{100}})^{10^{100}}$ is:",
    imageUrl: null,
    optionA: "(1) 3",
    optionB: "(2) 4",
    optionC: "(3) 2",
    optionD: "(4) 1",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If $\\binom{n}{r+1} = \\binom{n}{r}$ and $\\binom{n}{r} = \\binom{n}{r-1}$, value of r is:",
    imageUrl: null,
    optionA: "(1) 1",
    optionB: "(2) 4",
    optionC: "(3) 2",
    optionD: "(4) 3",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Value of $\\cot(\\pi/24)$ is:",
    imageUrl: null,
    optionA: "(1) $\\sqrt{2} + \\sqrt{3} + 2 - \\sqrt{6}$",
    optionB: "(2) $\\sqrt{2} + \\sqrt{3} + 2 + \\sqrt{6}$",
    optionC: "(3) $\\sqrt{2} - \\sqrt{3} - 2 + \\sqrt{6}$",
    optionD: "(4) $3\\sqrt{2} - \\sqrt{3} - \\sqrt{6}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Number of distinct real roots of $\\det\\begin{pmatrix} \\sin x & \\cos x & \\cos x \\\\ \\cos x & \\sin x & \\cos x \\\\ \\cos x & \\cos x & \\sin x \\end{pmatrix} = 0$ in $[-\\pi/4, \\pi/4]$ is:",
    imageUrl: null,
    optionA: "(1) 4",
    optionB: "(2) 1",
    optionC: "(3) 2",
    optionD: "(4) 3",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Pair of lines $y=px, y=qx$ written as $(y-px)(y-qx)=0$. Pair of angle bisectors of $x^2 - 4xy - 5y^2 = 0$ is:",
    imageUrl: null,
    optionA: "(1) $x^2 - 3xy + y^2 = 0$",
    optionB: "(2) $x^2 + 4xy - y^2 = 0$",
    optionC: "(3) $x^2 + 3xy - y^2 = 0$",
    optionD: "(4) $x^2 - 3xy - y^2 = 0$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Tangent to $x^2 + 4y^2 = 4$ meets tangents at extremities of major axis at B and C. Circle with BC as diameter passes through:",
    imageUrl: null,
    optionA: "(1) $(\\sqrt{3}, 0)$",
    optionB: "(2) $(\\sqrt{2}, 0)$",
    optionC: "(3) (1, 1)",
    optionD: "(4) (-1, 1)",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Negation of \"Match played only if weather good and ground not wet\":",
    imageUrl: null,
    optionA: "(1) Match not played and weather not good and ground wet",
    optionB: "(2) If match not played, weather not good or ground wet",
    optionC: "(3) Match will be played and weather is not good or ground is wet",
    optionD: "(4) Match not played or weather good and ground not wet",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Sample 1: 100 items mean 15 SD 3. Whole group: 250 items mean 15.6 SD $\\sqrt{13.44}$. SD of second sample is:",
    imageUrl: null,
    optionA: "(1) 8",
    optionB: "(2) 6",
    optionC: "(3) 4",
    optionD: "(4) 5",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If $P = \\begin{bmatrix} 1 & 0 \\\\ 1/2 & 1 \\end{bmatrix}$, then $P^{50} = $:",
    imageUrl: null,
    optionA: "(1) $\\begin{bmatrix} 1 & 0 \\\\ 25 & 1 \\end{bmatrix}$",
    optionB: "(2) $\\begin{bmatrix} 1 & 50 \\\\ 0 & 1 \\end{bmatrix}$",
    optionC: "(3) $\\begin{bmatrix} 1 & 25 \\\\ 0 & 1 \\end{bmatrix}$",
    optionD: "(4) $\\begin{bmatrix} 1 & 0 \\\\ 50 & 1 \\end{bmatrix}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$\\sum_{n=8}^{100} \\left[ \\frac{(-1)^n n}{2} \\right] = $:",
    imageUrl: null,
    optionA: "(1) 0",
    optionB: "(2) 4",
    optionC: "(3) -2",
    optionD: "(4) 2",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Functions $f: A \\to B$ and $g: B \\to C$. If $(g \\circ f)^{-1}$ exists, then:",
    imageUrl: null,
    optionA: "(1) f and g both one-one",
    optionB: "(2) f and g both onto",
    optionC: "(3) f is one-one and g is onto",
    optionD: "(4) f is onto and g is one-one",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$f(x) = \\int_0^x (5+|1-t|)dt$ for $x > 2$; $5x+1$ for $x \\le 2$. Then:",
    imageUrl: null,
    optionA: "(1) f not continuous at x=2",
    optionB: "(2) f everywhere differentiable",
    optionC: "(3) f continuous but not differentiable at x=2",
    optionD: "(4) f not differentiable at x=1",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$\\int_{-1}^1 \\log(x + \\sqrt{x^2+1}) dx = $:",
    imageUrl: null,
    optionA: "(1) 2",
    optionB: "(2) 0",
    optionC: "(3) -1",
    optionD: "(4) 1",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Solution of $x dy = (y + x^3 \\cos x) dx, y(\\pi) = 0$. $y(\\pi/2) = $:",
    imageUrl: null,
    optionA: "(1) $\\frac{\\pi^2}{4} + \\frac{\\pi}{2}$",
    optionB: "(2) $\\frac{\\pi^2}{2} + \\frac{\\pi}{4}$",
    optionC: "(3) $\\frac{\\pi^2}{2} - \\frac{\\pi}{4}$",
    optionD: "(4) $\\frac{\\pi^2}{4} - \\frac{\\pi}{2}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Vectors $a\\hat{i}+a\\hat{j}+c\\hat{k}, \\hat{i}+\\hat{k}, c\\hat{i}+c\\hat{j}+b\\hat{k}$ co-planar. c is equal to:",
    imageUrl: null,
    optionA: "(1) $\\frac{2}{1/a + 1/b}$",
    optionB: "(2) $\\frac{a+b}{2}$",
    optionC: "(3) $\\frac{1}{a} + \\frac{1}{b}$",
    optionD: "(4) $\\sqrt{ab}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If |\\vec{a}| = 2, |\\vec{b}| = 5, |\\vec{a} \\times \\vec{b}| = 8$, then $|\\vec{a} \\cdot \\vec{b}| = $:",
    imageUrl: null,
    optionA: "(1) 6",
    optionB: "(2) 4",
    optionC: "(3) 3",
    optionD: "(4) 5",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Random variable X with $P(X=0) = 1/2, P(X=j) = 1/3^j$. Mean and $P(X \\text{ positive and even})$ are:",
    imageUrl: null,
    optionA: "(1) 3/8 and 1/8",
    optionB: "(2) 3/4 and 1/8",
    optionC: "(3) 3/4 and 1/9",
    optionD: "(4) 3/4 and 1/16",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If $a+b+c = 1, ab+bc+ca = 2, abc = 3$, value of $a^4+b^4+c^4 = \\text{_____}$.",
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
    questionText: "Circle $\\text{Re}(z^2) + 2(\\text{Im}(z))^2 + 2 \\text{Re}(z) = 0$. Line through center and vertex of $x^2-6x-y+13=0$ has y-intercept _____.",
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
    questionText: "Sum of $(n+1)$ terms of $\\binom{n}{0}, 3\\binom{n}{1}, 5\\binom{n}{2} \\dots = 2^{100} \\cdot 101$. $2[\\frac{n-1}{2}] = \\text{_____}$.",
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
    questionText: "Coefficients of $x^7$ and $x^8$ in expansion of $(2 + x/3)^n$ equal. Value of n is _____.",
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
    questionText: "$f(x) = \\frac{P(x)}{\\sin(x-2)}$ for $x \\neq 2$, $f(2)=7$. $P''(x)$ constant, $P(3)=9$. $P(5) = \\text{_____}$.",
    imageUrl: null,
    optionA: "39",
    optionB: "39",
    optionC: "39",
    optionD: "39",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Rectangle inscribed in equilateral triangle side $2\\sqrt{2}$. Square of largest area is _____.",
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
    questionText: "Curve $y = f(x)$ passes through $(2, (\\log_e 2)^2)$ slope $\\frac{2y}{x \\log_e x}$. $f(e) = \\text{_____}$.",
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
    questionText: "$\\vec{a}, \\vec{b}$ unit vectors. $(\\vec{a}+3\\vec{b}) \\perp (7\\vec{a}-5\\vec{b})$ and $(\\vec{a}-4\\vec{b}) \\perp (7\\vec{a}-2\\vec{b})$. Angle between $\\vec{a}, \\vec{b}$ in degrees is _____.",
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
    subject: "Mathematics",
    questionText: "Lines $\\frac{x-k}{1} = \\frac{y-2}{2} = \\frac{z-3}{3}$ and $\\frac{x+1}{3} = \\frac{y+2}{2} = \\frac{z+3}{1}$ co-planar. Value of k is _____.",
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
    questionText: "Fair coin tossed n-times so prob at least one head $\\ge 0.9$. Minimum n is _____.",
    imageUrl: null,
    optionA: "4",
    optionB: "4",
    optionC: "4",
    optionD: "4",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  }
];

async function seedJee2021Jul25Shift2() {
  console.log(`🚀 Compiling JEE Main 2021 (25 Jul Shift 2) Paper with ${rawQuestions.length} questions...`);

  const paperData = {
    examName: "JEE Main",
    year: 2021,
    shiftName: "JEE Main 2021 (25 Jul Shift 2)",
    examDate: "2021-07-25T15:00:00Z",
    totalMarks: 300,
    totalQuestions: 90,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'JEE Main 2021 (25 Jul Shift 2).json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved paper JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding JEE Main 2021 (25 Jul Shift 2) into PostgreSQL via Prisma...`);
  
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
      name: "JEE Main 2021 (25 Jul Shift 2)"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "JEE Main 2021 (25 Jul Shift 2)",
      date: new Date("2021-07-25T15:00:00Z")
    }
  });
  console.log(`Created Shift "JEE Main 2021 (25 Jul Shift 2)" (ID: ${shift.id})`);

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

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for JEE Main 2021 (25 Jul Shift 2) into Database!`);
}

seedJee2021Jul25Shift2()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
