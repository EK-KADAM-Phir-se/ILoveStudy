const prisma = require('../../lib/prisma');
const fs = require('fs');
const path = require('path');

const rawQuestions = [
  // ── PHYSICS (Q1 - Q30) ──
  {
    subject: "Physics",
    questionText: "Block of mass 10 kg placed on rough inclined plane $\\theta = 30^\\circ$. $\\mu_s = 0.5, \\mu_k = 0.4$. Force parallel to incline needed to move block up at constant speed is ($g = 10\\text{ m/s}^2$):",
    imageUrl: null,
    optionA: "(1) 84.6 N",
    optionB: "(2) 93.3 N",
    optionC: "(3) 43.3 N",
    optionD: "(4) 50.0 N",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Work done in stretching spring by length x is $W_1$. Work done in stretching further by length x is $W_2$. Ratio $W_1 / W_2$ is:",
    imageUrl: null,
    optionA: "(1) 1 : 3",
    optionB: "(2) 1 : 2",
    optionC: "(3) 1 : 4",
    optionD: "(4) 1 : 1",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Angular momentum of earth about its axis of rotation is of order of:",
    imageUrl: null,
    optionA: "(1) $10^{33}\\text{ J s}$",
    optionB: "(2) $10^{37}\\text{ J s}$",
    optionC: "(3) $10^{29}\\text{ J s}$",
    optionD: "(4) $10^{25}\\text{ J s}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Planet radius R, acceleration due to gravity on surface g. Escape velocity from height h = R is:",
    imageUrl: null,
    optionA: "(1) $\\sqrt{gR}$",
    optionB: "(2) $\\sqrt{2gR}$",
    optionC: "(3) $\\sqrt{gR/2}$",
    optionD: "(4) $2\\sqrt{gR}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Water drop radius 1 mm breaks into 1000 identical droplets. Surface tension T. Change in surface energy is:",
    imageUrl: null,
    optionA: "(1) $36\\pi T \\times 10^{-6}\\text{ J}$",
    optionB: "(2) $3.6\\pi T \\times 10^{-6}\\text{ J}$",
    optionC: "(3) $0.36\\pi T \\times 10^{-6}\\text{ J}$",
    optionD: "(4) $360\\pi T \\times 10^{-6}\\text{ J}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Carnot engine efficiency 40% when sink temp 300 K. Source temp increased by 100 K, efficiency becomes:",
    imageUrl: null,
    optionA: "(1) 50%",
    optionB: "(2) 45%",
    optionC: "(3) 60%",
    optionD: "(4) 55%",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Molar heat capacity of monoatomic gas undergoing process $P = c V$ is:",
    imageUrl: null,
    optionA: "(1) 2R",
    optionB: "(2) 5R/2",
    optionC: "(3) 3R",
    optionD: "(4) 3R/2",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Wave equation $y = 5 \\sin \\pi(4t - 0.02x)$. Wave speed in m/s is:",
    imageUrl: null,
    optionA: "(1) 200",
    optionB: "(2) 100",
    optionC: "(3) 50",
    optionD: "(4) 400",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Charge $+q$ at (a, 0, 0) and $-q$ at (-a, 0, 0). Electric flux through sphere radius 2a centred at origin is:",
    imageUrl: null,
    optionA: "(1) 0",
    optionB: "(2) $q/\\epsilon_0$",
    optionC: "(3) $2q/\\epsilon_0$",
    optionD: "(4) $-q/\\epsilon_0$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Potentiometer wire length 10 m, resistance $20\\Omega$ in series with $480\\Omega$ across 5 V cell. Balancing length for 10 mV is:",
    imageUrl: null,
    optionA: "(1) 50 cm",
    optionB: "(2) 100 cm",
    optionC: "(3) 200 cm",
    optionD: "(4) 400 cm",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Circular loop radius R carries current I. Magnetic field at centre is $B_0$. Field at distance $x = R$ on axis is:",
    imageUrl: null,
    optionA: "(1) $B_0 / (2\\sqrt{2})$",
    optionB: "(2) $B_0 / 2$",
    optionC: "(3) $B_0 / 4$",
    optionD: "(4) $B_0 / 8$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Self-inductance of solenoid length L, cross-section area A, N turns is proportional to:",
    imageUrl: null,
    optionA: "(1) $N^2 A / L$",
    optionB: "(2) $N A / L$",
    optionC: "(3) $N^2 A L$",
    optionD: "(4) $N A^2 / L$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In series LCR circuit at resonance: (a) $V_L = V_C$, (b) Current max, (c) Power factor 1, (d) Impedance min. Correct options:",
    imageUrl: null,
    optionA: "(1) All (a), (b), (c), (d)",
    optionB: "(2) (a) and (b) only",
    optionC: "(3) (b) and (c) only",
    optionD: "(4) (a) and (d) only",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Displacement current $I_d$ in capacitor with changing electric field $E$ area A is:",
    imageUrl: null,
    optionA: "(1) $\\epsilon_0 A \\frac{dE}{dt}$",
    optionB: "(2) $\\frac{1}{\\epsilon_0} A \\frac{dE}{dt}$",
    optionC: "(3) $\\epsilon_0 \\frac{dA}{dt} E$",
    optionD: "(4) $\\mu_0 A \\frac{dE}{dt}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Convex lens focal length 20 cm in air immersed in water ($\\mu_w = 4/3$). Focal length in water is:",
    imageUrl: null,
    optionA: "(1) 80 cm",
    optionB: "(2) 40 cm",
    optionC: "(3) 10 cm",
    optionD: "(4) 60 cm",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "YDSE slit separation 0.2 mm, screen distance 1 m, $\\lambda = 600\\text{ nm}$. Fringe width is:",
    imageUrl: null,
    optionA: "(1) 3 mm",
    optionB: "(2) 1.5 mm",
    optionC: "(3) 6 mm",
    optionD: "(4) 0.3 mm",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Work function of metal 4.0 eV. Cut-off wavelength for photoelectric emission is ($hc = 1240\\text{ eV nm}$):",
    imageUrl: null,
    optionA: "(1) 310 nm",
    optionB: "(2) 620 nm",
    optionC: "(3) 155 nm",
    optionD: "(4) 400 nm",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Bohr orbit radius of hydrogen atom in ground state $r_0$. Radius of $n=3$ orbit is:",
    imageUrl: null,
    optionA: "(1) $9 r_0$",
    optionB: "(2) $3 r_0$",
    optionC: "(3) $27 r_0$",
    optionD: "(4) $r_0 / 9$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Half life of radioactive isotope is 10 days. Fraction remaining after 30 days is:",
    imageUrl: null,
    optionA: "(1) 1/8",
    optionB: "(2) 1/4",
    optionC: "(3) 1/16",
    optionD: "(4) 1/32",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Zener diode used as:",
    imageUrl: null,
    optionA: "(1) Voltage regulator",
    optionB: "(2) Rectifier",
    optionC: "(3) Amplifier",
    optionD: "(4) Oscillator",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Body mass 2 kg moving at $5\\text{ m/s}$ accelerates at $2\\text{ m/s}^2$ for 4 s. Work done is _____ J.",
    imageUrl: null,
    optionA: "144",
    optionB: "144",
    optionC: "144",
    optionD: "144",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Solid sphere mass 5 kg, radius 0.2 m rolls without slipping at $4\\text{ m/s}$. Total KE is _____ J.",
    imageUrl: null,
    optionA: "56",
    optionB: "56",
    optionC: "56",
    optionD: "56",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Steel wire length 2 m, area $1\\text{ mm}^2$ stretched by 1 mm. Force is _____ N. ($Y = 2 \\times 10^{11}\\text{ N/m}^2$).",
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
    questionText: "Organ pipe open at both ends fundamental frequency 300 Hz. Length of pipe is _____ cm. ($v = 330\\text{ m/s}$).",
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
    subject: "Physics",
    questionText: "Point charge $4\\mu\\text{C}$ at origin. Work done moving $1\\mu\\text{C}$ from (3, 0) to (0, 3) is _____ J.",
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
    questionText: "Two resistors $10\\Omega$ and $20\\Omega$ in parallel across 12 V battery. Current from battery is _____ A.",
    imageUrl: null,
    optionA: "1.8",
    optionB: "1.8",
    optionC: "1.8",
    optionD: "1.8",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Proton speed $2 \\times 10^6\\text{ m/s}$ enters 0.5 T magnetic field at $90^\\circ$. Force is _____ $\\times 10^{-13}\\text{ N}$.",
    imageUrl: null,
    optionA: "1.6",
    optionB: "1.6",
    optionC: "1.6",
    optionD: "1.6",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Light wavelength 500 nm falls on single slit width 0.1 mm. Angular width of central max is _____ $\\times 10^{-3}\\text{ rad}$.",
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
    questionText: "Photon energy 10.2 eV absorbed by H atom in ground state. Excited state quantum number n is _____.",
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
    questionText: "AND gate input A=1, B=1 output Y is _____.",
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
    questionText: "Which set of quantum numbers is NOT allowed?",
    imageUrl: null,
    optionA: "(1) $n=3, l=2, m_l=-2, m_s=+1/2$",
    optionB: "(2) $n=3, l=3, m_l=0, m_s=-1/2$",
    optionC: "(3) $n=4, l=0, m_l=0, m_s=+1/2$",
    optionD: "(4) $n=2, l=1, m_l=-1, m_s=-1/2$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Correct order of ionic radii of $\\text{N}^{3-}, \\text{O}^{2-}, \\text{F}^-, \\text{Na}^+, \\text{Mg}^{2+}$ is:",
    imageUrl: null,
    optionA: "(1) $\\text{N}^{3-} > \\text{O}^{2-} > \\text{F}^- > \\text{Na}^+ > \\text{Mg}^{2+}$",
    optionB: "(2) $\\text{Mg}^{2+} > \\text{Na}^+ > \\text{F}^- > \\text{O}^{2-} > \\text{N}^{3-}$",
    optionC: "(3) $\\text{N}^{3-} > \\text{F}^- > \\text{O}^{2-} > \\text{Na}^+ > \\text{Mg}^{2+}$",
    optionD: "(4) $\\text{O}^{2-} > \\text{N}^{3-} > \\text{F}^- > \\text{Na}^+ > \\text{Mg}^{2+}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Hybridization of central atom in $\\text{PCl}_5, \\text{SF}_6, \\text{IF}_7, \\text{BF}_3$ respectively are:",
    imageUrl: null,
    optionA: "(1) $sp^3d, sp^3d^2, sp^3d^3, sp^2$",
    optionB: "(2) $sp^3d^2, sp^3d, sp^3d^3, sp^2$",
    optionC: "(3) $sp^3, sp^3d, sp^3d^2, sp^2$",
    optionD: "(4) $sp^3d, sp^3d^3, sp^3d^2, sp^3$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which gas law states that volume is directly proportional to temperature at constant pressure?",
    imageUrl: null,
    optionA: "(1) Charles's law",
    optionB: "(2) Boyle's law",
    optionC: "(3) Gay-Lussac's law",
    optionD: "(4) Avogadro's law",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Enthalpy of formation of element in its standard state is:",
    imageUrl: null,
    optionA: "(1) Zero",
    optionB: "(2) Positive",
    optionC: "(3) Negative",
    optionD: "(4) Infinite",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "For reaction $\\text{N}_2 + 3\\text{H}_2 \\rightleftharpoons 2\\text{NH}_3$, relationship between $K_p$ and $K_c$ is:",
    imageUrl: null,
    optionA: "(1) $K_p = K_c (RT)^{-2}$",
    optionB: "(2) $K_p = K_c (RT)^2$",
    optionC: "(3) $K_p = K_c (RT)^{-1}$",
    optionD: "(4) $K_p = K_c$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "pH of $10^{-3}\\text{ M HCl}$ solution is:",
    imageUrl: null,
    optionA: "(1) 3",
    optionB: "(2) 11",
    optionC: "(3) 7",
    optionD: "(4) 4",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Oxidation state of Cr in $\\text{K}_2\\text{Cr}_2\\text{O}_7$ is:",
    imageUrl: null,
    optionA: "(1) +6",
    optionB: "(2) +3",
    optionC: "(3) +7",
    optionD: "(4) +4",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Temporary hardness of water is due to presence of:",
    imageUrl: null,
    optionA: "(1) $\\text{Ca(HCO}_3)_2$",
    optionB: "(2) $\\text{CaCl}_2$",
    optionC: "(3) $\\text{CaSO}_4$",
    optionD: "(4) $\\text{MgCl}_2$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which alkali metal ion has highest hydration enthalpy?",
    imageUrl: null,
    optionA: "(1) $\\text{Li}^+$",
    optionB: "(2) $\\text{Na}^+$",
    optionC: "(3) $\\text{K}^+$",
    optionD: "(4) $\\text{Cs}^+$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Diborane ($\\text{B}_2\\text{H}_6$) has:",
    imageUrl: null,
    optionA: "(1) Four 2-centre 2-electron and two 3-centre 2-electron bonds",
    optionB: "(2) Six 2-centre 2-electron bonds",
    optionC: "(3) Two 2-centre 2-electron and four 3-centre 2-electron bonds",
    optionD: "(4) Four 3-centre 2-electron bonds",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which carbon allotrope has fullerenes structure like soccer ball?",
    imageUrl: null,
    optionA: "(1) $C_{60}$",
    optionB: "(2) Diamond",
    optionC: "(3) Graphite",
    optionD: "(4) Carbon nanotubes",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "IUPAC name of $\\text{CH}_3-\\text{CH(OH)}-\\text{CH}_2-\\text{COOH}$ is:",
    imageUrl: null,
    optionA: "(1) 3-hydroxybutanoic acid",
    optionB: "(2) 2-hydroxybutanoic acid",
    optionC: "(3) 3-hydroxybutanal",
    optionD: "(4) 4-hydroxybutanoic acid",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Major product of reaction of propene with HBr in presence of peroxide is:",
    imageUrl: null,
    optionA: "(1) 1-bromopropane",
    optionB: "(2) 2-bromopropane",
    optionC: "(3) 1,2-dibromopropane",
    optionD: "(4) Propane",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Electrophile involved in nitration of benzene is:",
    imageUrl: null,
    optionA: "(1) $\\text{NO}_2^+$",
    optionB: "(2) $\\text{NO}^+$",
    optionC: "(3) $\\text{NO}_3^-$",
    optionD: "(4) $\\text{NO}_2^-$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which halide undergoes $S_N1$ reaction fastest?",
    imageUrl: null,
    optionA: "(1) t-butyl chloride",
    optionB: "(2) isopropyl chloride",
    optionC: "(3) ethyl chloride",
    optionD: "(4) methyl chloride",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Phenol reacts with $\\text{CHCl}_3 + \\text{NaOH}$ to give salicylaldehyde. Reaction is known as:",
    imageUrl: null,
    optionA: "(1) Reimer-Tiemann reaction",
    optionB: "(2) Kolbe's reaction",
    optionC: "(3) Friedel-Crafts reaction",
    optionD: "(4) Cannizzaro reaction",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Aldehydes with no $\\alpha$-hydrogen undergo self oxidation-reduction with conc. alkali. Reaction is:",
    imageUrl: null,
    optionA: "(1) Cannizzaro reaction",
    optionB: "(2) Aldol condensation",
    optionC: "(3) Perkin reaction",
    optionD: "(4) Haloform reaction",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Aniline on treatment with $\\text{NaNO}_2 + \\text{HCl}$ at $0-5^\\circ\\text{C}$ gives:",
    imageUrl: null,
    optionA: "(1) Benzene diazonium chloride",
    optionB: "(2) Nitrobenzene",
    optionC: "(3) Chlorobenzene",
    optionD: "(4) Phenol",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Deficiency of Vitamin C causes:",
    imageUrl: null,
    optionA: "(1) Scurvy",
    optionB: "(2) Beri-beri",
    optionC: "(3) Rickets",
    optionD: "(4) Night blindness",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Number of atoms per unit cell in FCC lattice is _____.",
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
    questionText: "0.1 M glucose solution relative lowering of vapour pressure is _____ $\\times 10^{-3}$.",
    imageUrl: null,
    optionA: "1.8",
    optionB: "1.8",
    optionC: "1.8",
    optionD: "1.8",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "First order reaction half life 20 min. Time required for 75% completion is _____ min.",
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
    subject: "Chemistry",
    questionText: "Gold number of gelatin is 0.005 - 0.01. Minimum amount in mg to protect 10 mL gold sol is _____.",
    imageUrl: null,
    optionA: "0.01",
    optionB: "0.01",
    optionC: "0.01",
    optionD: "0.01",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Number of unpaired electrons in $[Fe(H_2O)_6]^{2+}$ is _____.",
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
    questionText: "Oxidation state of Fe in $[Fe(CN)_6]^{3-}$ is _____.",
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
    questionText: "Molar mass of acetic acid monomer 60. In benzene dimerizes 100%. Observed molar mass is _____ $\\text{g mol}^{-1}$.",
    imageUrl: null,
    optionA: "120",
    optionB: "120",
    optionC: "120",
    optionD: "120",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Number of chiral carbon atoms in glucose is _____.",
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
    questionText: "Number of lone pairs on central atom of $XeF_4$ is _____.",
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
    questionText: "Mass of NaOH in grams needed to prepare 250 mL of 0.1 M solution is _____ g.",
    imageUrl: null,
    optionA: "1",
    optionB: "1",
    optionC: "1",
    optionD: "1",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── MATHEMATICS (Q61 - Q90) ──
  {
    subject: "Mathematics",
    questionText: "If $\\alpha, \\beta$ are roots of $x^2 - p(x+1) - c = 0$, then $(\\alpha+1)(\\beta+1) = $:",
    imageUrl: null,
    optionA: "(1) $1-c$",
    optionB: "(2) $1+c$",
    optionC: "(3) c",
    optionD: "(4) 1-p",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Sum of n terms of G.P. $2, 6, 18, 54 \\dots$ is 728. Value of n is:",
    imageUrl: null,
    optionA: "(1) 6",
    optionB: "(2) 5",
    optionC: "(3) 7",
    optionD: "(4) 8",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Coefficient of $x^4$ in expansion of $(1 + x + x^2 + x^3)^6$ is:",
    imageUrl: null,
    optionA: "(1) 50",
    optionB: "(2) 45",
    optionC: "(3) 60",
    optionD: "(4) 30",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If $\\det\\begin{pmatrix} x & 2 & 3 \\\\ 4 & x & 1 \\\\ 5 & 2 & x \\end{pmatrix} = 0$, then roots x are:",
    imageUrl: null,
    optionA: "(1) Real and distinct",
    optionB: "(2) Complex",
    optionC: "(3) All equal",
    optionD: "(4) Two equal",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$\\lim_{x \\to 0} \\frac{\\sin x - x}{x^3} = $:",
    imageUrl: null,
    optionA: "(1) -1/6",
    optionB: "(2) 1/6",
    optionC: "(3) 1/3",
    optionD: "(4) -1/3",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Derivative of $\\tan^{-1}\\left(\\frac{2x}{1-x^2}\\right)$ w.r.t. $\\sin^{-1}\\left(\\frac{2x}{1+x^2}\\right)$ is:",
    imageUrl: null,
    optionA: "(1) 1",
    optionB: "(2) -1",
    optionC: "(3) 1/2",
    optionD: "(4) 2",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Equation of tangent to $y = x^2 - 2x + 7$ parallel to $2x - y + 9 = 0$ is:",
    imageUrl: null,
    optionA: "(1) $2x - y + 3 = 0$",
    optionB: "(2) $2x - y - 3 = 0$",
    optionC: "(3) $2x + y + 3 = 0$",
    optionD: "(4) $x - 2y + 3 = 0$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$\\int \\frac{1}{x(x^4-1)} dx = $:",
    imageUrl: null,
    optionA: "(1) $\\frac{1}{4} \\log_e \\left| \\frac{x^4-1}{x^4} \\right| + C$",
    optionB: "(2) $\\frac{1}{4} \\log_e \\left| \\frac{x^4}{x^4-1} \\right| + C$",
    optionC: "(3) $\\frac{1}{2} \\log_e \\left| \\frac{x^2-1}{x^2} \\right| + C$",
    optionD: "(4) $\\log_e \\left| \\frac{x^4-1}{x} \\right| + C$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Area enclosed by parabola $y^2 = 4x$ and line $y = 2x$ is:",
    imageUrl: null,
    optionA: "(1) 1/3",
    optionB: "(2) 2/3",
    optionC: "(3) 1/6",
    optionD: "(4) 4/3",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Solution of differential equation $\\frac{dy}{dx} + y \\tan x = \\sec x$ with $y(0) = 0$ is:",
    imageUrl: null,
    optionA: "(1) $y = \\sin x$",
    optionB: "(2) $y = \\cos x$",
    optionC: "(3) $y = \\tan x$",
    optionD: "(4) $y = x \\sec x$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Distance of point (1, -2, 3) from plane $x - y + z = 5$ measured parallel to line $\\frac{x}{2} = \\frac{y}{3} = \\frac{z}{-6}$ is:",
    imageUrl: null,
    optionA: "(1) 1",
    optionB: "(2) 2",
    optionC: "(3) 3",
    optionD: "(4) 7",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Angle between vectors $\\vec{a} = \\hat{i} + \\hat{j} - \\hat{k}$ and $\\vec{b} = \\hat{i} - \\hat{j} + \\hat{k}$ is:",
    imageUrl: null,
    optionA: "(1) $\\cos^{-1}(-1/3)$",
    optionB: "(2) $\\cos^{-1}(1/3)$",
    optionC: "(3) $\\pi/3$",
    optionD: "(4) $\\pi/2$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Probability of getting sum 9 in single throw of two dice is:",
    imageUrl: null,
    optionA: "(1) 1/9",
    optionB: "(2) 1/6",
    optionC: "(3) 1/4",
    optionD: "(4) 5/36",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Negation of statement $p \\Rightarrow (q \\vee r)$ is:",
    imageUrl: null,
    optionA: "(1) $p \\wedge \\sim q \\wedge \\sim r$",
    optionB: "(2) $\\sim p \\wedge (q \\vee r)$",
    optionC: "(3) $p \\vee \\sim q \\vee \\sim r$",
    optionD: "(4) $\\sim p \\Rightarrow (\\sim q \\wedge \\sim r)$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Shortest distance between lines $\\frac{x-1}{2} = \\frac{y-2}{3} = \\frac{z-3}{4}$ and $\\frac{x-2}{3} = \\frac{y-4}{4} = \\frac{z-5}{5}$ is:",
    imageUrl: null,
    optionA: "(1) $1/\\sqrt{6}$",
    optionB: "(2) $2/\\sqrt{6}$",
    optionC: "(3) $1/\\sqrt{3}$",
    optionD: "(4) 0",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Focus of parabola $y^2 - 4y - 8x + 4 = 0$ is:",
    imageUrl: null,
    optionA: "(1) (2, 2)",
    optionB: "(2) (0, 2)",
    optionC: "(3) (2, 0)",
    optionD: "(4) (4, 2)",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Eccentricity of ellipse $\\frac{x^2}{25} + \\frac{y^2}{9} = 1$ is:",
    imageUrl: null,
    optionA: "(1) 4/5",
    optionB: "(2) 3/5",
    optionC: "(3) 16/25",
    optionD: "(4) 9/25",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Asymptotes of hyperbola $xy = c^2$ are:",
    imageUrl: null,
    optionA: "(1) $x = 0$ and $y = 0$",
    optionB: "(2) $x = y$ and $x = -y$",
    optionC: "(3) $x = c$ and $y = c$",
    optionD: "(4) $x + y = 0$ and $x - y = 0$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Value of $\\tan(15^\\circ)$ is:",
    imageUrl: null,
    optionA: "(1) $2 - \\sqrt{3}$",
    optionB: "(2) $2 + \\sqrt{3}$",
    optionC: "(3) $\\sqrt{3} - 1$",
    optionD: "(4) $\\sqrt{3} + 1$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "General solution of $\\sin x + \\cos x = 1$ is:",
    imageUrl: null,
    optionA: "(1) $2n\\pi$ or $2n\\pi + \\pi/2$",
    optionB: "(2) $n\\pi + \\pi/4$",
    optionC: "(3) $2n\\pi - \\pi/2$",
    optionD: "(4) $n\\pi$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Number of 4-digit numbers formed using digits 1, 2, 3, 4, 5 without repetition is _____.",
    imageUrl: null,
    optionA: "120",
    optionB: "120",
    optionC: "120",
    optionD: "120",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Sum of roots of $x^2 - 5x + 6 = 0$ is _____.",
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
    questionText: "Variance of first 10 natural numbers is _____ (ratio numerator/denominator rounded).",
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
    questionText: "Radius of circle $x^2 + y^2 - 4x - 6y - 12 = 0$ is _____.",
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
    questionText: "Limit $\\lim_{x \\to 0} \\frac{e^x - 1}{x} = \\text{_____}$.",
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
    questionText: "Integral $\\int_0^{\\pi/2} \\sin x dx = \\text{_____}$.",
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
    questionText: "If $\\vec{a} = 2\\hat{i} + \\hat{j} + 3\\hat{k}$ and $\\vec{b} = \\hat{i} - 2\\hat{j} + \\hat{k}$, dot product $\\vec{a} \\cdot \\vec{b} = \\text{_____}$.",
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
    questionText: "Modulus of complex number $z = 3 + 4i$ is _____.",
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
    questionText: "Order of differential equation $\\frac{d^2y}{dx^2} + (\\frac{dy}{dx})^3 + y = 0$ is _____.",
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
    questionText: "Value of $\\sin^2 30^\\circ + \\cos^2 30^\\circ$ is _____.",
    imageUrl: null,
    optionA: "1",
    optionB: "1",
    optionC: "1",
    optionD: "1",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  }
];

async function seedJee2021Aug27Shift2() {
  console.log(`🚀 Compiling JEE Main 2021 (27 Aug Shift 2) Paper with ${rawQuestions.length} questions...`);

  const paperData = {
    examName: "JEE Main",
    year: 2021,
    shiftName: "JEE Main 2021 (27 Aug Shift 2)",
    examDate: "2021-08-27T15:00:00Z",
    totalMarks: 300,
    totalQuestions: 90,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'JEE Main 2021 (27 Aug Shift 2).json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved paper JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding JEE Main 2021 (27 Aug Shift 2) into PostgreSQL via Prisma...`);
  
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
      name: "JEE Main 2021 (27 Aug Shift 2)"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "JEE Main 2021 (27 Aug Shift 2)",
      date: new Date("2021-08-27T15:00:00Z")
    }
  });
  console.log(`Created Shift "JEE Main 2021 (27 Aug Shift 2)" (ID: ${shift.id})`);

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

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for JEE Main 2021 (27 Aug Shift 2) into Database!`);
}

seedJee2021Aug27Shift2()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
