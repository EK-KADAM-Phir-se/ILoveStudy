const prisma = require('../../lib/prisma');
const fs = require('fs');
const path = require('path');

const rawQuestions = [
  // ── PHYSICS (Q1 - Q30) ──
  {
    subject: "Physics",
    questionText: "An expression for a dimensionless quantity P is given by $P = \\frac{\\alpha}{\\beta} \\log_e \\left(\\frac{kt}{\\beta x}\\right)$; where $\\alpha$ and $\\beta$ are constants, x is distance; k is Boltzmann constant and t is the temperature. Then the dimensions of $\\alpha$ will be",
    imageUrl: null,
    optionA: "(1) [M0 L-1 T0]",
    optionB: "(2) [M L0 T-2]",
    optionC: "(3) [M L T-2]",
    optionD: "(4) [M L2 T-2]",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A person is standing in an elevator. In which situation, he experiences weight loss?",
    imageUrl: null,
    optionA: "(1) When the elevator moves upward with constant acceleration",
    optionB: "(2) When the elevator moves downward with constant acceleration",
    optionC: "(3) When the elevator moves upward with uniform velocity",
    optionD: "(4) When the elevator moves downward with uniform velocity",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "An object is thrown vertically upwards. At its maximum height, which of the following quantity becomes zero?",
    imageUrl: null,
    optionA: "(1) Momentum",
    optionB: "(2) Potential Energy",
    optionC: "(3) Acceleration",
    optionD: "(4) Force",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A ball is released from rest from point P of a smooth semi-spherical vessel as shown in figure. The ratio of the centripetal force and normal reaction on the ball at point Q is A while angular position of point Q is $\\alpha$ with respect to point P. Which graph represents the correct relation between A and $\\alpha$ when ball goes from Q to R?",
    imageUrl: null,
    optionA: "(1) Decreasing non-linear curve",
    optionB: "(2) Increasing curve",
    optionC: "(3) Horizontal straight line",
    optionD: "(4) Parabolic curve",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A thin circular ring of mass M and radius R is rotating with a constant angular velocity $2\\text{ rad s}^{-1}$ in a horizontal plane about an axis vertical to its plane and passing through the center of the ring. If two objects each of mass m be attached gently to the opposite ends of a diameter of ring, the ring will then rotate with an angular velocity (in $\\text{rad s}^{-1}$):",
    imageUrl: null,
    optionA: "(1) $\\frac{M}{M+m}$",
    optionB: "(2) \\frac{M+2m}{2M}$",
    optionC: "(3) $\\frac{2M}{M+2m}$",
    optionD: "(4) \\frac{2(M+2m)}{M}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The variation of acceleration due to gravity (g) with distance (r) from the center of the earth is correctly represented by (where R = radius of earth):",
    imageUrl: null,
    optionA: "(1) Linear increase up to R, then inverse square decay for $r > R$",
    optionB: "(2) Constant up to R, then decay",
    optionC: "(3) Purely decaying curve",
    optionD: "(4) Sharp peak at center",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The efficiency of a Carnot’s engine, working between steam point ($100^\\circ\\text{C}$) and ice point ($0^\\circ\\text{C}$), will be:",
    imageUrl: null,
    optionA: "(1) 26.81%",
    optionB: "(2) 37.81%",
    optionC: "(3) 47.81%",
    optionD: "(4) 57.81%",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Time period of a simple pendulum in a stationary lift is ‘T’. If the lift accelerates with g/6 vertically upwards then the time period will be:",
    imageUrl: null,
    optionA: "(1) $\\sqrt{\\frac{6}{5}} T$",
    optionB: "(2) $\\sqrt{\\frac{5}{6}} T$",
    optionC: "(3) $\\sqrt{\\frac{6}{7}} T$",
    optionD: "(4) $\\sqrt{\\frac{7}{6}} T$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A thermally insulated vessel contains an ideal gas of molecular mass M and ratio of specific heats 1.4. Vessel is moving with speed v and is suddenly brought to rest. Assuming no heat is lost to the surrounding, the vessel temperature of the gas increases by:",
    imageUrl: null,
    optionA: "(1) $\\frac{Mv^2}{7R}$",
    optionB: "(2) $\\frac{Mv^2}{5R}$",
    optionC: "(3) $\\frac{2Mv^2}{7R}$",
    optionD: "(4) $\\frac{7Mv^2}{5R}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Two capacitors having capacitance $C_1$ and $C_2$ respectively are connected. Initially $C_1$ is charged to V volt by a battery. The battery is removed and $C_1$ is connected to uncharged $C_2$. The amount of charge on $C_2$ after equilibrium is:",
    imageUrl: null,
    optionA: "(1) $\\frac{C_1 C_2}{C_1 + C_2} V$",
    optionB: "(2) \\frac{C_1 + C_2}{C_1 C_2} V$",
    optionC: "(3) $(C_1 + C_2) V$",
    optionD: "(4) $(C_1 - C_2) V$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Assertion (A): Non-polar materials do not have any permanent dipole moment.\\nReason (R): When a non-polar material is placed in an electric field, the centre of positive charge distribution coincides with the centre of negative charge distribution.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both (A) and (R) are correct and (R) is the correct explanation of (A)",
    optionB: "(2) Both (A) and (R) are correct but (R) is NOT the correct explanation of (A)",
    optionC: "(3) (A) is correct but (R) is not correct",
    optionD: "(4) (A) is not correct but (R) is correct",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The magnetic flux through a coil perpendicular to its plane is varying according to $\\phi = 5t^3 + 4t^2 + 2t - 5$ Weber. If resistance of coil is $5\\Omega$, the induced current at $t = 2\\text{ s}$ will be:",
    imageUrl: null,
    optionA: "(1) 15.6 A",
    optionB: "(2) 16.6 A",
    optionC: "(3) 17.6 A",
    optionD: "(4) 18.6 A",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "An aluminium wire is stretched to make its length 0.4% larger. The percentage change in resistance is:",
    imageUrl: null,
    optionA: "(1) 0.4%",
    optionB: "(2) 0.2%",
    optionC: "(3) 0.8%",
    optionD: "(4) 0.6%",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A proton and an alpha particle of the same velocity enter in a uniform magnetic field acting perpendicular to their direction of motion. The ratio of radii of circular paths described by alpha particle and proton is:",
    imageUrl: null,
    optionA: "(1) 1 : 4",
    optionB: "(2) 4 : 1",
    optionC: "(3) 2 : 1",
    optionD: "(4) 1 : 2",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "If electric field intensity of a uniform plane EM wave is $E = -301.6 \\sin(kz - \\omega t)\\hat{a}_x + 452.4 \\sin(kz - \\omega t)\\hat{a}_y\\text{ V/m}$. Then magnetic intensity H of wave in $\\text{Am}^{-1}$ will be:",
    imageUrl: null,
    optionA: "(1) $+0.8 \\sin(kz - \\omega t)\\hat{a}_y + 0.8 \\sin(kz - \\omega t)\\hat{a}_x$",
    optionB: "(2) $+1.0 \\times 10^{-6} \\sin(kz - \\omega t)\\hat{a}_y + 1.5 \\times 10^{-6} \\sin(kz - \\omega t)\\hat{a}_x$",
    optionC: "(3) $-0.8 \\sin(kz - \\omega t)\\hat{a}_y - 1.2 \\sin(kz - \\omega t)\\hat{a}_x$",
    optionD: "(4) $-1.0 \\times 10^{-6} \\sin(kz - \\omega t)\\hat{a}_y - 1.5 \\times 10^{-6} \\sin(kz - \\omega t)\\hat{a}_x$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In free space, an electromagnetic wave of 3 GHz frequency strikes over the edge of an object of size $\\lambda/100$, where $\\lambda$ is wavelength in free space. The phenomenon happening there will be:",
    imageUrl: null,
    optionA: "(1) Reflection",
    optionB: "(2) Refraction",
    optionC: "(3) Diffraction",
    optionD: "(4) Scattering",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "An electron with speed v and a photon with speed c have same de-Broglie wavelength. If kinetic energy and momentum of electron are $E_e, p_e$ and of photon are $E_{ph}, p_{ph}$, then correct relation is:",
    imageUrl: null,
    optionA: "(1) $E_e / E_{ph} = 2c/v$",
    optionB: "(2) $E_e / E_{ph} = v/(2c)$",
    optionC: "(3) $p_e / p_{ph} = 2c/v$",
    optionD: "(4) $p_e / p_{ph} = v/(2c)$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "How many alpha and beta particles are emitted when Uranium ${}_{92}\\text{U}^{238}$ decays to lead ${}_{82}\\text{Pb}^{206}$?",
    imageUrl: null,
    optionA: "(1) 3 alpha and 5 beta",
    optionB: "(2) 6 alpha and 4 beta",
    optionC: "(3) 4 alpha and 5 beta",
    optionD: "(4) 8 alpha and 6 beta",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The I-V characteristics of a p-n junction diode in forward bias gives dynamic resistance at 2V and 4V. The ratio of dynamic resistance at 2V and 4V is:",
    imageUrl: null,
    optionA: "(1) 1 : 2",
    optionB: "(2) 5 : 1",
    optionC: "(3) 1 : 40",
    optionD: "(4) 20 : 1",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Choose the correct statement for amplitude modulation:",
    imageUrl: null,
    optionA: "(1) Amplitude of modulating signal is varied in accordance with information signal.",
    optionB: "(2) Amplitude of modulated signal is varied in accordance with information signal.",
    optionC: "(3) Amplitude of carrier signal is varied in accordance with information signal.",
    optionD: "(4) Amplitude of modulated signal is varied in accordance with modulating signal.",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A fighter jet is flying horizontally at speed $200\\text{ ms}^{-1}$. A bullet fired at angle $\\theta$ with horizontal hits the jet. Bullet speed is $400\\text{ m/s}$. The value of $\\theta$ is ______\\deg.",
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
    questionText: "A ball of mass 0.5 kg is dropped from height 10 m. The height at which magnitude of velocity becomes equal to acceleration due to gravity ($g = 10\\text{ m/s}^2$) is _____ m.",
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
    questionText: "Energy density for a linear strain of $5 \\times 10^{-4}$ is ____ $\\text{kJ/m}^3$ for stress-strain curve shown.",
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
    questionText: "Elongation of a wire on earth surface is $10^{-4}\\text{ m}$. Same wire elongated by $6 \\times 10^{-5}\\text{ m}$ on another planet. Acceleration due to gravity on planet is _____ $\\text{ms}^{-2}$. ($g_{\\text{earth}} = 10\\text{ ms}^{-2}$)",
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
    questionText: "A $10\\Omega, 20\\text{ mH}$ coil carrying constant current connected to 20V battery. Switch opened, current becomes 0 in $100\\mu\\text{s}$. Average induced emf is _____ V.",
    imageUrl: null,
    optionA: "400",
    optionB: "400",
    optionC: "400",
    optionD: "400",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Light ray incident on system of two mirrors inclined at $75^\\circ$. After reflection from $M_1$ it reflects back by $M_2$ at angle $30^\\circ$. Total deviation of ray is _____ degrees.",
    imageUrl: null,
    optionA: "210",
    optionB: "210",
    optionC: "210",
    optionD: "210",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "In Vernier Callipers, each cm on main scale divided into 20 equal parts. 10th Vernier scale division coincides with 9th main scale division. Value of Vernier constant is _____ $\\times 10^{-2}\\text{ mm}$.",
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
    questionText: "In bridge circuit with $6\\Omega, 6\\Omega, 6\\Omega, 2\\Omega, 10\\Omega$ and 10V battery, current through battery is _____ A.",
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
    questionText: "110 V, 50 Hz AC source connected in LC circuit with $55\\Omega$ resistor. Current through resistance at resonance is _____ A.",
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
    questionText: "Ideal fluid of density $800\\text{ kgm}^{-3}$ flows through bent pipe tapering from a to a/2. Pressure difference is 4100 Pa. Velocity at wider section is $\\frac{\\sqrt{x}}{2}\\text{ ms}^{-1}$. Value of x is _____.",
    imageUrl: null,
    optionA: "363",
    optionB: "363",
    optionC: "363",
    optionD: "363",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── CHEMISTRY (Q31 - Q60) ──
  {
    subject: "Chemistry",
    questionText: "Commercially sold conc. HCl is 35% HCl by mass, density $1.46\\text{ g/mL}$. Molarity of solution is (Molar mass: Cl = 35.5, H = 1):",
    imageUrl: null,
    optionA: "(1) 10.2 M",
    optionB: "(2) 12.5 M",
    optionC: "(3) 14.0 M",
    optionD: "(4) 18.2 M",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Evacuated glass vessel weighs 40.0 g empty, 135.0 g filled with liquid of density $0.95\\text{ g mL}^{-1}$, and 40.5 g filled with ideal gas at 0.82 atm, 250 K. Molar mass of gas in $\\text{g mol}^{-1}$ is:",
    imageUrl: null,
    optionA: "(1) 35",
    optionB: "(2) 50",
    optionC: "(3) 75",
    optionD: "(4) 175",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "If radius of 3rd Bohr orbit of H-atom is $r_3$ and 4th orbit is $r_4$, then $r_4$ is:",
    imageUrl: null,
    optionA: "(1) $\\frac{9}{16} r_3$",
    optionB: "(2) \\frac{16}{9} r_3$",
    optionC: "(3) $\\frac{3}{4} r_3$",
    optionD: "(4) \\frac{4}{3} r_3$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "For ions $\\text{O}_2^{2-}, \\text{O}_2^-, \\text{O}_2, \\text{O}_2^+$, correct increasing order of bond order is:",
    imageUrl: null,
    optionA: "(1) $\\text{O}_2^{2-} < \\text{O}_2^- < \\text{O}_2 < \\text{O}_2^+$",
    optionB: "(2) $\\text{O}_2^- < \\text{O}_2^{2-} < \\text{O}_2 < \\text{O}_2^+$",
    optionC: "(3) $\\text{O}_2^- < \\text{O}_2^{2-} < \\text{O}_2^+ < \\text{O}_2$",
    optionD: "(4) $\\text{O}_2^- < \\text{O}_2^+ < \\text{O}_2^{2-} < \\text{O}_2$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which half cell would be preferred as reference electrode based on temperature coefficient of emf?",
    imageUrl: null,
    optionA: "(1) A ($1 \\times 10^{-4}$)",
    optionB: "(2) B ($2 \\times 10^{-4}$)",
    optionC: "(3) C ($0.1 \\times 10^{-4}$)",
    optionD: "(4) D ($0.2 \\times 10^{-4}$)",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Choose the correct stability order of group 13 elements in their +1 oxidation state:",
    imageUrl: null,
    optionA: "(1) Al < Ga < In < Tl",
    optionB: "(2) Tl < In < Ga < Al",
    optionC: "(3) Al < Ga < Tl < In",
    optionD: "(4) Al < Tl < Ga < In",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: According to Ellingham diagram, metal oxide with higher $\\Delta G^0$ is more stable than lower $\\Delta G^0$.\\nStatement II: Metal involved in formation of oxide placed lower in Ellingham diagram can reduce oxide placed higher.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both Statement I and II are correct",
    optionB: "(2) Both Statement I and II are incorrect",
    optionC: "(3) Statement I is correct, II is incorrect",
    optionD: "(4) Statement I is incorrect, II is correct",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "$2\\text{HSO}_4^-(aq) \\xrightarrow[\\text{Hydrolysis}]{\\text{Electrolysis}} 2\\text{HSO}_4^- + 2\\text{H}^+ + A$. Dihedral angle in product A in solid phase at 110K is:",
    imageUrl: null,
    optionA: "(1) $104^\\circ$",
    optionB: "(2) $111.5^\\circ$",
    optionC: "(3) $90.2^\\circ$",
    optionD: "(4) $111.0^\\circ$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The correct order of melting point for alkaline earth metals is:",
    imageUrl: null,
    optionA: "(1) Be > Mg > Ca > Sr",
    optionB: "(2) Sr > Ca > Mg > Be",
    optionC: "(3) Be > Ca > Mg > Sr",
    optionD: "(4) Be > Ca > Sr > Mg",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The correct order of melting points of hydrides of group 16 elements is:",
    imageUrl: null,
    optionA: "(1) $\\text{H}_2\\text{S} < \\text{H}_2\\text{Se} < \\text{H}_2\\text{Te} < \\text{H}_2\\text{O}$",
    optionB: "(2) $\\text{H}_2\\text{O} < \\text{H}_2\\text{S} < \\text{H}_2\\text{Se} < \\text{H}_2\\text{Te}$",
    optionC: "(3) $\\text{H}_2\\text{S} < \\text{H}_2\\text{Te} < \\text{H}_2\\text{Se} < \\text{H}_2\\text{O}$",
    optionD: "(4) $\\text{H}_2\\text{Se} < \\text{H}_2\\text{S} < \\text{H}_2\\text{Te} < \\text{H}_2\\text{O}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "$A + \\text{alkali} \\to B \\text{ (Major Product)}$. If B is an oxoacid of phosphorus with no P-H bond, then A is:",
    imageUrl: null,
    optionA: "(1) White $P_4$",
    optionB: "(2) Red $P_4$",
    optionC: "(3) $P_2O_3$",
    optionD: "(4) $H_3PO_3$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Polar stratospheric clouds facilitate the formation of:",
    imageUrl: null,
    optionA: "(1) $\\text{ClONO}_2$",
    optionB: "(2) HOCl",
    optionC: "(3) ClO",
    optionD: "(4) $\\text{CH}_4$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: In Lassaigne’s Test, when both N and S are present, sodium thiocyanate is formed.\\nStatement II: Excess sodium decomposes sodium thiocyanate to NaCN and $\\text{Na}_2\\text{S}$.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both Statement I and II are correct",
    optionB: "(2) Both Statement I and II are incorrect",
    optionC: "(3) Statement I is correct, II is incorrect",
    optionD: "(4) Statement I is incorrect, II is correct",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "$(\\text{C}_7\\text{H}_5\\text{O}_2)_2 \\xrightarrow{h\\nu} [X] \\to 2\\text{C}_6\\text{H}_5 + 2\\text{CO}_2$. The intermediate X is benzoyloxy free radical $\\text{C}_6\\text{H}_5-\\text{COO}^\\bullet$ (Option 4).",
    imageUrl: null,
    optionA: "(1) Benzoyl cation",
    optionB: "(2) Phenyl radical",
    optionC: "(3) Benzoate anion",
    optionD: "(4) Benzoyloxy radical",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Grignard reagent addition on 1,3-diketone followed by hydrolysis gives major product B (cyclopentane-1,3-diol derivative Option 1).",
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
    questionText: "Which will have the highest enol content?",
    imageUrl: null,
    optionA: "(1) 1,2-cyclohexanedione",
    optionB: "(2) 1,3-cyclohexanedione",
    optionC: "(3) 1,3,5-cyclohexanetrione",
    optionD: "(4) 1,4-cyclohexanedione",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Among given structures, which will show the most stable enamine formation?",
    imageUrl: null,
    optionA: "(1) Structure 1",
    optionB: "(2) Structure 2",
    optionC: "(3) Structure 3",
    optionD: "(4) Structure 4",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following sets are correct regarding polymer?\\n(A) Copolymer : Buna-S, (B) Condensation polymer : Nylon-6, 6, (C) Fibres : Nylon-6, 6, (D) Thermosetting : Terylene, (E) Homopolymer : Buna-N",
    imageUrl: null,
    optionA: "(1) (A), (B) and (C) are correct",
    optionB: "(2) (B), (C) and (D) are correct",
    optionC: "(3) (A), (C) and (E) are correct",
    optionD: "(4) (A), (B) and (D) are correct",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "A chemical which stimulates the secretion of pepsin is:",
    imageUrl: null,
    optionA: "(1) Anti-histamine",
    optionB: "(2) Cimetidine",
    optionC: "(3) Histamine",
    optionD: "(4) Zantac",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which statement is NOT true with respect to nitrate ion test?",
    imageUrl: null,
    optionA: "(1) Dark brown ring formed at junction",
    optionB: "(2) Ring formed due to nitroferrous sulphate complex",
    optionC: "(3) Brown complex is $[Fe(H_2O)_5(NO)]SO_4$",
    optionD: "(4) Heating nitrate salt with conc. $H_2SO_4$, light brown fumes evolved",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "For complete combustion of methanol $\\text{CH}_3\\text{OH}(l) + \\frac{3}{2}\\text{O}_2(g) \\to \\text{CO}_2(g) + 2\\text{H}_2\\text{O}(l)$, heat produced is 726 kJ/mol at 27°C. Enthalpy of combustion is -x kJ/mol where x is _____.",
    imageUrl: null,
    optionA: "727",
    optionB: "727",
    optionC: "727",
    optionD: "727",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "0.5% KCl solution freezes at -0.24°C. Percentage dissociation of KCl is _____ % ($K_f = 1.80\\text{ K kg mol}^{-1}, M = 74.6$).",
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
    subject: "Chemistry",
    questionText: "50 mL of 0.1M $\\text{CH}_3\\text{COOH}$ titrated against 0.1M NaOH. When 25 mL NaOH added, pH is _____ $\\times 10^{-2}$ ($pK_a = 4.76$).",
    imageUrl: null,
    optionA: "476",
    optionB: "476",
    optionC: "476",
    optionD: "476",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Equal moles of A and B in flask. Half lives are 100s and 50s. Time for concentration of A to be 4 times B is _____ s.",
    imageUrl: null,
    optionA: "200",
    optionB: "200",
    optionC: "200",
    optionD: "200",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "2.0 g $H_2$ gas adsorbed on 2.5 g Pt powder at 300K, 1 bar. Volume of gas adsorbed per gram of adsorbent is _____ mL.",
    imageUrl: null,
    optionA: "9960",
    optionB: "9960",
    optionC: "9960",
    optionD: "9960",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Spin-only magnetic moment value of most basic oxide of vanadium among $V_2O_3, V_2O_4, V_2O_5$ is _____ BM.",
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
    questionText: "Spin-only magnetic moment of octahedral complex among $\\text{CoCl}_3 \\cdot 4\\text{NH}_3, \\text{NiCl}_2 \\cdot 6\\text{H}_2\\text{O}, \\text{PtCl}_4 \\cdot 2\\text{HCl}$ giving 2 mol AgCl with $\\text{AgNO}_3$ is _____ BM.",
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
    questionText: "0.30 g organic compound gave 0.20 g $\\text{CO}_2$ and 0.10 g $\\text{H}_2\\text{O}$. Percentage of carbon in compound is _____ %.",
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
    subject: "Chemistry",
    questionText: "Compound P on nitration with dil $\\text{HNO}_3$ gives isomers A (intramolecular H-bond) and B (intermolecular H-bond). P with conc $\\text{HNO}_3$ gives yellow compound C (picric acid). Number of oxygen atoms in C is _____.",
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
    subject: "Chemistry",
    questionText: "Number of oxygens present in a nucleotide formed from a base present only in RNA (uracil nucleotide) is _____.",
    imageUrl: null,
    optionA: "9",
    optionB: "9",
    optionC: "9",
    optionD: "9",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── MATHEMATICS (Q61 - Q90) ──
  {
    subject: "Mathematics",
    questionText: "Let $f(x) = \\frac{x-1}{x+1}, x \\in \\mathbb{R} - \\{0, -1, 1\\}$. If $f^{n+1}(x) = f(f^n(x))$ for all $n \\in \\mathbb{N}$, then $f^6(6) + f^7(7)$ is equal to:",
    imageUrl: null,
    optionA: "(1) 7/6",
    optionB: "(2) -3/2",
    optionC: "(3) 7/12",
    optionD: "(4) -11/12",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $A = \\{z \\in \\mathbb{C} : |\\frac{z+1}{z-1}| < 1\\}$ and $B = \\{z \\in \\mathbb{C} : \\arg(\\frac{z-1}{z+1}) = \\frac{2\\pi}{3}\\}$. Then $A \\cap B$ is:",
    imageUrl: null,
    optionA: "(1) A portion of circle centred at $(0, -1/\\sqrt{3})$ in 2nd and 3rd quadrants",
    optionB: "(2) A portion of circle centred at $(0, -1/\\sqrt{3})$ in 2nd quadrant only",
    optionC: "(3) An empty set",
    optionD: "(4) A portion of circle of radius $2/\\sqrt{3}$ in 3rd quadrant only",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let A be a $3 \\times 3$ invertible matrix. If $|\\text{adj}(24A)| = |\\text{adj}(3 \\text{adj}(2A))|$, then $|A|^2$ is equal to:",
    imageUrl: null,
    optionA: "(1) $6^6$",
    optionB: "(2) $2^{12}$",
    optionC: "(3) $2^6$",
    optionD: "(4) 1",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The ordered pair (a, b), for which the system $3x - 2y + z = b, 5x - 8y + 9z = 3, 2x + y + az = -1$ has no solution, is:",
    imageUrl: null,
    optionA: "(1) $(3, 1/3)$",
    optionB: "(2) $(-3, 1/3)$",
    optionC: "(3) $(-3, -1/3)$",
    optionD: "(4) $(3, -1/3)$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The remainder when $(2021)^{2023}$ is divided by 7 is:",
    imageUrl: null,
    optionA: "(1) 1",
    optionB: "(2) 2",
    optionC: "(3) 5",
    optionD: "(4) 6",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$\\lim_{x\\to 1/\\sqrt{2}} \\frac{\\sin(\\cos^{-1} x) - x}{1 - \\tan(\\cos^{-1} x)}$ is equal to:",
    imageUrl: null,
    optionA: "(1) $\\sqrt{2}$",
    optionB: "(2) $-\\sqrt{2}$",
    optionC: "(3) $1/\\sqrt{2}$",
    optionD: "(4) $-1/\\sqrt{2}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $f, g : \\mathbb{R} \\to \\mathbb{R}$ be defined as $f(x) = -|x+3|$ for $x < 0$, $e^x$ for $x \\ge 0$; and $g(x) = x^2+k_1 x$ for $x < 0$, $4x+k_2$ for $x \\ge 0$. If $(g \\circ f)$ is differentiable at $x = 0$, then $(g \\circ f)(-4) + (g \\circ f)(4)$ is equal to:",
    imageUrl: null,
    optionA: "(1) $4(e^4 + 1)$",
    optionB: "(2) $2(2e^4 + 1)$",
    optionC: "(3) $4e^4$",
    optionD: "(4) $2(2e^4 - 1)$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The sum of the absolute minimum and absolute maximum values of $f(x) = |3x - x^2 + 2| - x$ in $[-1, 2]$ is:",
    imageUrl: null,
    optionA: "(1) $\\frac{\\sqrt{17}+3}{2}$",
    optionB: "(2) \\frac{\\sqrt{17}+5}{2}$",
    optionC: "(3) 5",
    optionD: "(4) \\frac{9-\\sqrt{17}}{2}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let S be the set of natural numbers for which line $\\frac{x}{a} + \\frac{y}{b} = 2$ is tangent to curve $(\\frac{x}{a})^n + (\\frac{y}{b})^n = 2$ at (a, b). Then:",
    imageUrl: null,
    optionA: "(1) $S = \\phi$",
    optionB: "(2) $n(S) = 1$",
    optionC: "(3) $S = \\{2k : k \\in \\mathbb{N}\\}$",
    optionD: "(4) $S = \\mathbb{N}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The area bounded by the curve $y = |x^2 - 9|$ and line $y = 3$ is:",
    imageUrl: null,
    optionA: "(1) $4(2\\sqrt{3} + \\sqrt{6} - 4)$",
    optionB: "(2) $4(4\\sqrt{3} + \\sqrt{6} - 4)$",
    optionC: "(3) $8(4\\sqrt{3} + 3\\sqrt{6} - 9)$",
    optionD: "(4) $8(4\\sqrt{3} + \\sqrt{6} - 9)$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let R(3, 7) and P, Q be points on $x + y = 5$ such that PQR is equilateral. Area of $\\Delta PQR$ is:",
    imageUrl: null,
    optionA: "(1) $\\frac{25}{4\\sqrt{3}}$",
    optionB: "(2) \\frac{25\\sqrt{3}}{2}$",
    optionC: "(3) $\\frac{25}{\\sqrt{3}}$",
    optionD: "(4) \\frac{25}{2\\sqrt{3}}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Circle C passes through A(2, -1) and B(3, 4). Centre lies on $(x - 5)^2 + (y - 1)^2 = 13/2$. Then $r^2$ is:",
    imageUrl: null,
    optionA: "(1) 32",
    optionB: "(2) 65/2",
    optionC: "(3) 61/2",
    optionD: "(4) 30",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Normal at P on parabola $y^2 = 6x$ passes through (5, -8). Tangent at P intersects directrix at Q. Ordinate of Q is:",
    imageUrl: null,
    optionA: "(1) -3",
    optionB: "(2) -9/4",
    optionC: "(3) -5/2",
    optionD: "(4) -2",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If lines $l_1 : \\frac{x-2}{3} = \\frac{y+1}{-2}, z = 2$ and $l_2 : \\frac{x-1}{1} = \\frac{2y+3}{\\alpha} = \\frac{z+5}{2}$ are perpendicular, then angle between $l_2$ and $l_3 : \\frac{1-x}{3} = \\frac{2y-1}{-4} = \\frac{z}{4}$ is:",
    imageUrl: null,
    optionA: "(1) $\\cos^{-1}(29/4)$",
    optionB: "(2) $\\sec^{-1}(29/4)$",
    optionC: "(3) $\\cos^{-1}(2/29)$",
    optionD: "(4) $\\cos^{-1}(2/\\sqrt{29})$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Plane $2x + 3y + z + 20 = 0$ rotated right angle about intersection with $x - 3y + 5z = 8$. Mirror image of (2, -1/2, 2) in rotated plane is B(a, b, c). Then $a/8 = b/5 = c/k$ has $k = $:",
    imageUrl: null,
    optionA: "(1) -4",
    optionB: "(2) -2",
    optionC: "(3) 4",
    optionD: "(4) 2",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If $\\vec{a} \\cdot \\vec{b} = 1, \\vec{b} \\cdot \\vec{c} = 2, \\vec{c} \\cdot \\vec{a} = 3$, then $[\\vec{a} \\times (\\vec{b} \\times \\vec{c}), \\vec{b} \\times (\\vec{c} \\times \\vec{a}), \\vec{c} \\times (\\vec{b} \\times \\vec{a})]$ is:",
    imageUrl: null,
    optionA: "(1) 0",
    optionB: "(2) $-6 \\vec{a} \\cdot (\\vec{b} \\times \\vec{c})$",
    optionC: "(3) $12 \\vec{c} \\cdot (\\vec{a} \\times \\vec{b})$",
    optionD: "(4) $-12 \\vec{b} \\cdot (\\vec{c} \\times \\vec{a})$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Biased coin tossed 5 times. P(4 heads) = P(5 heads). Probability of getting at most two heads is:",
    imageUrl: null,
    optionA: "(1) 275/65",
    optionB: "(2) 36/54",
    optionC: "(3) 181/55",
    optionD: "(4) 46/64",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Mean of numbers a, b, 8, 5, 10 is 6 and variance is 6.8. If M is mean deviation about mean, then 25 M is:",
    imageUrl: null,
    optionA: "(1) 60",
    optionB: "(2) 55",
    optionC: "(3) 50",
    optionD: "(4) 45",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $f(x) = 2 \\cos^{-1} x + 4 \\cot^{-1} x - 3x^2 - 2x + 10, x \\in [-1, 1]$. Range is [a, b]. Then $4a - b$ is:",
    imageUrl: null,
    optionA: "(1) 11",
    optionB: "(2) $11 - \\pi$",
    optionC: "(3) $11 + \\pi$",
    optionD: "(4) $15 - \\pi$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If $p \\nabla q \\Rightarrow ((p \\Delta q) \\nabla r)$ is a tautology, then $(p \\nabla q) \\Delta r$ is equivalent to:",
    imageUrl: null,
    optionA: "(1) $(p \\Delta r) \\vee q$",
    optionB: "(2) $(p \\Delta r) \\wedge q$",
    optionC: "(3) $(p \\wedge r) \\Delta q$",
    optionD: "(4) $(p \\nabla r) \\wedge q$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Sum of cubes of all roots of $x^4 - 3x^3 - 2x^2 + 3x + 1 = 0$ is _____.",
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
    questionText: "10 boys $B_1 \\dots B_{10}$ and 5 girls $G_1 \\dots G_5$. Group of 3 boys & 3 girls. Ways if $B_1, B_2$ not together is _____.",
    imageUrl: null,
    optionA: "1120",
    optionB: "1120",
    optionC: "1120",
    optionD: "1120",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Common tangents to $4(x^2+y^2)=9$ and $y^2=4x$ intersect at Q. Ellipse centered at origin has semi-minor OQ and semi-major 6. $\\frac{l}{e^2} = \\text{_____}$.",
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
    questionText: "$f(x) = \\max\\{|x+1|, |x+2|, \\dots, |x+5|\\}$. $\\int_{-6}^0 f(x)dx = \\text{_____}$.",
    imageUrl: null,
    optionA: "21",
    optionB: "21",
    optionC: "21",
    optionD: "21",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Solution curve $(4+x^2)dy - 2x(x^2+3y+4)dx = 0$ through origin. $y(2) = \\text{_____}$.",
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
    questionText: "If $\\sin^2(10^\\circ) \\sin(20^\\circ) \\sin(40^\\circ) \\sin(50^\\circ) \\sin(70^\\circ) = \\alpha - \\frac{1}{16} \\sin(10^\\circ)$, then $16 + \\alpha^{-1} = \\text{_____}$.",
    imageUrl: null,
    optionA: "80",
    optionB: "80",
    optionC: "80",
    optionD: "80",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Set $A = \\{n \\in \\mathbb{N} : \\text{HCF}(n, 45) = 1\\}, B = \\{2k : k \\in \\{1 \\dots 100\\}\\}$. Sum of elements of $A \\cap B$ is _____.",
    imageUrl: null,
    optionA: "5264",
    optionB: "5264",
    optionC: "5264",
    optionD: "5264",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Integral $\\frac{48}{\\pi^4} \\int_0^\\pi (\\frac{3\\pi x^2}{2} - x^3) \\frac{\\sin x}{1 + \\cos^2 x} dx = \\text{_____}$.",
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
    questionText: "$A = \\sum_{i=1}^{10} \\sum_{j=1}^{10} \\min\\{i, j\\}, B = \\sum_{i=1}^{10} \\sum_{j=1}^{10} \\max\\{i, j\\}$. $A + B = \\text{_____}$.",
    imageUrl: null,
    optionA: "1100",
    optionB: "1100",
    optionC: "1100",
    optionD: "1100",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "$S = (0, 2\\pi) - \\{\\pi/2, 3\\pi/4, 3\\pi/2, 7\\pi/4\\}$. Solution curve $\\frac{dy}{dx} = \\frac{1}{1+\\sin 2x}, y(\\pi/4) = 1/2$. Sum of abscissas of intersection with $y = \\sqrt{2} \\sin x$ is $\\frac{k\\pi}{12}$. k is _____.",
    imageUrl: null,
    optionA: "42",
    optionB: "42",
    optionC: "42",
    optionD: "42",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  }
];

async function seedJee2022Jun26Shift1() {
  console.log(`🚀 Compiling JEE Main 2022 (26 Jun Shift 1) Paper with ${rawQuestions.length} questions...`);

  const paperData = {
    examName: "JEE Main",
    year: 2022,
    shiftName: "JEE Main 2022 (26 Jun Shift 1)",
    examDate: "2022-06-26T09:00:00Z",
    totalMarks: 300,
    totalQuestions: 90,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'JEE Main 2022 (26 Jun Shift 1).json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved paper JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding JEE Main 2022 (26 Jun Shift 1) into PostgreSQL via Prisma...`);
  
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
      name: "JEE Main 2022 (26 Jun Shift 1)"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "JEE Main 2022 (26 Jun Shift 1)",
      date: new Date("2022-06-26T09:00:00Z")
    }
  });
  console.log(`Created Shift "JEE Main 2022 (26 Jun Shift 1)" (ID: ${shift.id})`);

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

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for JEE Main 2022 (26 Jun Shift 1) into Database!`);
}

seedJee2022Jun26Shift1()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
