const fs = require('fs');
const path = require('path');
const prisma = require('../../lib/prisma');

// Run SVG generation first
require('./generate-neet-data.js');

const rawQuestions = [
  // -------------------------------------------------------------
  // PHYSICS (Q1 - Q50)
  // -------------------------------------------------------------
  {
    subject: "Physics",
    questionText: "The minimum wavelength of X-rays produced by an electron accelerated through a potential difference of $V$ volts is proportional to:",
    optionA: "$\\sqrt{V}$",
    optionB: "$\\frac{1}{V}$",
    optionC: "$\\frac{1}{\\sqrt{V}}$",
    optionD: "$V^2$",
    correctOption: "B",
    explanation: "Cut-off wavelength $\\lambda_{\\min} = \\frac{hc}{eV} \\propto \\frac{1}{V}$."
  },
  {
    subject: "Physics",
    questionText: "A carnot engine has an efficiency of $50\\%$ when its source is at a temperature $327^\\circ\\text{C}$. The temperature of the sink is:",
    optionA: "$27^\\circ\\text{C}$",
    optionB: "$15^\\circ\\text{C}$",
    optionC: "$100^\\circ\\text{C}$",
    optionD: "$200^\\circ\\text{C}$",
    correctOption: "A",
    explanation: "$\\eta = 1 - \\frac{T_{\\text{sink}}}{T_{\\text{source}}} \\implies 0.5 = 1 - \\frac{T_{\\text{sink}}}{600\\text{ K}} \\implies T_{\\text{sink}} = 300\\text{ K} = 27^\\circ\\text{C}$."
  },
  {
    subject: "Physics",
    questionText: "A bullet is fired from a gun at the speed of $280\\text{ m s}^{-1}$ in the direction $30^\\circ$ above the horizontal. The maximum height attained by the bullet is ($g = 9.8\\text{ m s}^{-2}, \\sin 30^\\circ = 0.5$):",
    optionA: "$2800\\text{ m}$",
    optionB: "$2000\\text{ m}$",
    optionC: "$1000\\text{ m}$",
    optionD: "$3000\\text{ m}$",
    correctOption: "C",
    explanation: "$H = \\frac{u^2 \\sin^2 \\theta}{2g} = \\frac{280 \\times 280 \\times (0.5)^2}{2 \\times 9.8} = 1000\\text{ m}$."
  },
  {
    subject: "Physics",
    questionText: "In a series LCR circuit, the inductance $L$ is $10\\text{ mH}$, capacitance $C$ is $1\\mu\\text{F}$ and resistance $R$ is $100\\,\\Omega$. The frequency at which resonance occurs is:",
    optionA: "$15.9\\text{ rad/s}$",
    optionB: "$15.9\\text{ kHz}$",
    optionC: "$1.59\\text{ rad/s}$",
    optionD: "$1.59\\text{ kHz}$",
    correctOption: "D",
    explanation: "$f = \\frac{1}{2\\pi \\sqrt{LC}} = \\frac{1}{2\\pi \\sqrt{10 \\times 10^{-3} \\times 10^{-6}}} = \\frac{10^4}{2\\pi} \\approx 1.59\\text{ kHz}$."
  },
  {
    subject: "Physics",
    questionText: "Given below are two statements:\nStatement I: Photovoltaic devices can convert optical radiation into electricity.\nStatement II: Zener diode is designed to operate under reverse bias in breakdown region.\nIn the light of the above statements, choose the most appropriate answer from the options given below:",
    optionA: "Both Statement I and Statement II are correct.",
    optionB: "Both Statement I and Statement II are incorrect.",
    optionC: "Statement I is correct but Statement II is incorrect.",
    optionD: "Statement I is incorrect but Statement II is correct.",
    correctOption: "A",
    explanation: "Both statements are correct. Photovoltaic cells convert light into electrical energy, and Zener diodes are heavily doped to operate stably in reverse breakdown."
  },
  {
    subject: "Physics",
    questionText: "Light travels a distance $x$ in time $t_1$ in air and $10x$ in time $t_2$ in another denser medium. What is the critical angle for this medium?",
    optionA: "$\\sin^{-1}\\left(\\frac{t_2}{t_1}\\right)$",
    optionB: "$\\sin^{-1}\\left(\\frac{10t_2}{t_1}\\right)$",
    optionC: "$\\sin^{-1}\\left(\\frac{t_1}{10t_2}\\right)$",
    optionD: "$\\sin^{-1}\\left(\\frac{10t_1}{t_2}\\right)$",
    correctOption: "D",
    explanation: "$v_{\\text{air}} = \\frac{x}{t_1}$, $v_{\\text{med}} = \\frac{10x}{t_2}$. Critical angle $\\sin C = \\frac{v_{\\text{med}}}{v_{\\text{air}}} = \\frac{10x/t_2}{x/t_1} = \\frac{10t_1}{t_2} \\implies C = \\sin^{-1}\\left(\\frac{10t_1}{t_2}\\right)$."
  },
  {
    subject: "Physics",
    questionText: "In hydrogen spectrum, the shortest wavelength in the Balmer series is $\\lambda$. The shortest wavelength in the Brackett series is:",
    optionA: "$2\\lambda$",
    optionB: "$4\\lambda$",
    optionC: "$9\\lambda$",
    optionD: "$16\\lambda$",
    correctOption: "B",
    explanation: "Balmer series shortest wavelength: $\\frac{1}{\\lambda} = R\\left(\\frac{1}{2^2} - 0\\right) = \\frac{R}{4}$. Brackett series shortest wavelength: $\\frac{1}{\\lambda'} = R\\left(\\frac{1}{4^2} - 0\\right) = \\frac{R}{16}$. Thus $\\lambda' = 4\\lambda$."
  },
  {
    subject: "Physics",
    questionText: "If the galvanometer G does not show any deflection in the circuit shown, the value of $R$ is given by:",
    imageUrl: "/neetimages/neet_2023_q8.svg",
    optionA: "$200\\,\\Omega$",
    optionB: "$50\\,\\Omega$",
    optionC: "$100\\,\\Omega$",
    optionD: "$400\\,\\Omega$",
    correctOption: "C",
    explanation: "Current through $400\\,\\Omega$ resistor is $I = \\frac{10 - 2}{400} = \\frac{8}{400} = \\frac{1}{50}\\text{ A}$. Since no current flows into galvanometer, potential difference across $R$ is $2\\text{ V} \\implies I \\cdot R = 2 \\implies R = 2 \\times 50 = 100\\,\\Omega$."
  },
  {
    subject: "Physics",
    questionText: "The amount of energy required to form a soap bubble of radius $2\\text{ cm}$ from a soap solution is nearly: (Surface tension of soap solution $= 0.03\\text{ N m}^{-1}$)",
    optionA: "$30.16 \\times 10^{-4}\\text{ J}$",
    optionB: "$5.06 \\times 10^{-4}\\text{ J}$",
    optionC: "$3.01 \\times 10^{-4}\\text{ J}$",
    optionD: "$50.1 \\times 10^{-4}\\text{ J}$",
    correctOption: "C",
    explanation: "$W = 2 \\times T \\times (4\\pi r^2) = 2 \\times 0.03 \\times 4\\pi (2 \\times 10^{-2})^2 \\approx 3.01 \\times 10^{-4}\\text{ J}$."
  },
  {
    subject: "Physics",
    questionText: "The magnetic energy stored in an inductor of inductance $4\\,\\mu\\text{H}$ carrying a current of $2\\text{ A}$ is:",
    optionA: "$4\\,\\mu\\text{J}$",
    optionB: "$4\\text{ mJ}$",
    optionC: "$8\\text{ mJ}$",
    optionD: "$8\\,\\mu\\text{J}$",
    correctOption: "D",
    explanation: "$U = \\frac{1}{2} L I^2 = \\frac{1}{2} \\times (4 \\times 10^{-6}) \\times (2)^2 = 8\\,\\mu\\text{J}$."
  },
  {
    subject: "Physics",
    questionText: "A $12\\text{ V}, 60\\text{ W}$ lamp is connected to secondary of step down transformer, whose primary is connected to ac mains of $220\\text{ V}$. Assuming the transformer to be ideal, what is the current in the primary winding?",
    optionA: "$0.27\\text{ A}$",
    optionB: "$2.7\\text{ A}$",
    optionC: "$3.7\\text{ A}$",
    optionD: "$0.37\\text{ A}$",
    correctOption: "A",
    explanation: "$P_{\\text{in}} = P_{\\text{out}} = 60\\text{ W} \\implies V_p I_p = 60 \\implies 220 \\times I_p = 60 \\implies I_p = \\frac{60}{220} \\approx 0.27\\text{ A}$."
  },
  {
    subject: "Physics",
    questionText: "An electric dipole is placed at an angle of $30^\\circ$ with an electric field of intensity $2 \\times 10^5\\text{ N C}^{-1}$. It experiences a torque equal to $4\\text{ N m}$. Calculate the magnitude of charge on the dipole, if the dipole length is $2\\text{ cm}$:",
    optionA: "$8\\text{ mC}$",
    optionB: "$6\\text{ mC}$",
    optionC: "$4\\text{ mC}$",
    optionD: "$2\\text{ mC}$",
    correctOption: "D",
    explanation: "$\\tau = p E \\sin \\theta = (q \\cdot 2a) E \\sin 30^\\circ \\implies 4 = q \\times (0.02) \\times (2 \\times 10^5) \\times 0.5 \\implies q = 2\\text{ mC}$."
  },
  {
    subject: "Physics",
    questionText: "A vehicle travels half the distance with speed $v$ and the remaining distance with speed $2v$. Its average speed is:",
    optionA: "$\\frac{v}{3}$",
    optionB: "$\\frac{2v}{3}$",
    optionC: "$\\frac{4v}{3}$",
    optionD: "$\\frac{3v}{4}$",
    correctOption: "C",
    explanation: "$v_{\\text{avg}} = \\frac{2 v_1 v_2}{v_1 + v_2} = \\frac{2 \\times v \\times 2v}{v + 2v} = \\frac{4v}{3}$."
  },
  {
    subject: "Physics",
    questionText: "Let a wire be suspended from the ceiling (rigid support) and stretched by a weight $W$ attached at its free end. The longitudinal stress at any point of cross-sectional area $A$ of the wire is:",
    imageUrl: "/neetimages/neet_2023_q14.svg",
    optionA: "$\\frac{2W}{A}$",
    optionB: "$\\frac{W}{A}$",
    optionC: "$\\frac{W}{2A}$",
    optionD: "Zero",
    correctOption: "B",
    explanation: "Longitudinal stress is defined as Force / Area $= \\frac{W}{A}$."
  },
  {
    subject: "Physics",
    questionText: "If $\\oint_S \\vec{E} \\cdot d\\vec{S} = 0$ over a surface, then:",
    optionA: "The number of flux lines entering the surface must be equal to the number of flux lines leaving it.",
    optionB: "The magnitude of electric field on the surface is constant.",
    optionC: "All the charges must necessarily be inside the surface.",
    optionD: "The electric field inside the surface is necessarily uniform.",
    correctOption: "A",
    explanation: "Net flux through closed surface is zero $\\implies$ total lines entering equals total lines leaving."
  },
  {
    subject: "Physics",
    questionText: "The work functions of Caesium (Cs), Potassium (K) and Sodium (Na) are $2.14\\text{ eV}, 2.30\\text{ eV}$ and $2.75\\text{ eV}$ respectively. If incident electromagnetic radiation has an incident energy of $2.20\\text{ eV}$, which of these photosensitive surfaces may emit photoelectrons?",
    optionA: "Cs only",
    optionB: "Both Na and K",
    optionC: "K only",
    optionD: "Na only",
    correctOption: "A",
    explanation: "Photoelectric emission occurs only when $E_{\\text{incident}} \\ge W_0$. Since $2.20\\text{ eV} > 2.14\\text{ eV}$ (Cs), only Caesium emits photoelectrons."
  },
  {
    subject: "Physics",
    questionText: "The temperature of gas is $-50^\\circ\\text{C}$. To what temperature the gas should be heated so that the rms speed is increased by 3 times?",
    optionA: "$669^\\circ\\text{C}$",
    optionB: "$3295^\\circ\\text{C}$",
    optionC: "$3097\\text{ K}$",
    optionD: "$223\\text{ K}$",
    correctOption: "B",
    explanation: "$T_1 = 223\\text{ K}$. New speed $v_2 = v_1 + 3v_1 = 4v_1 \\implies T_2 = 4^2 T_1 = 16 \\times 223\\text{ K} = 3568\\text{ K} = 3295^\\circ\\text{C}$."
  },
  {
    subject: "Physics",
    questionText: "The ratio of frequencies of fundamental harmonic produced by an open pipe to that of closed pipe having the same length is:",
    optionA: "1 : 2",
    optionB: "2 : 1",
    optionC: "1 : 3",
    optionD: "3 : 1",
    correctOption: "B",
    explanation: "Fundamental frequency of open pipe $f_o = \\frac{v}{2L}$, closed pipe $f_c = \\frac{v}{4L}$. Ratio $f_o : f_c = 2 : 1$."
  },
  {
    subject: "Physics",
    questionText: "Resistance of a carbon resistor determined from colour codes is $(22000 \\pm 5\\%)\\,\\Omega$. The colour of third band must be:",
    optionA: "Red",
    optionB: "Green",
    optionC: "Orange",
    optionD: "Yellow",
    correctOption: "C",
    explanation: "$22000 = 22 \\times 10^3$. Third band represents multiplier $10^3$, which corresponds to Orange."
  },
  {
    subject: "Physics",
    questionText: "For Young's double slit experiment, two statements are given below:\nStatement I: If screen is moved away from the plane of slits, angular separation of the fringes remains constant.\nStatement II: If the monochromatic source is replaced by another monochromatic source of larger wavelength, the angular separation of fringes decreases.\nIn the light of the above statements, choose answer from the options given below:",
    optionA: "Both Statement I and Statement II are true.",
    optionB: "Both Statement I and Statement II are false.",
    optionC: "Statement I is true but Statement II is false.",
    optionD: "Statement I is false but Statement II is true.",
    correctOption: "C",
    explanation: "Angular fringe width $\\theta = \\frac{\\lambda}{d}$ is independent of $D$ (Statement I true). Increasing $\\lambda$ increases $\\theta$ (Statement II false)."
  },
  {
    subject: "Physics",
    questionText: "A metal wire has mass $(0.4 \\pm 0.002)\\text{ g}$, radius $(0.3 \\pm 0.001)\\text{ mm}$ and length $(5 \\pm 0.02)\\text{ cm}$. The maximum possible percentage error in the measurement of density will nearly be:",
    optionA: "$1.2\\%$",
    optionB: "$1.3\\%$",
    optionC: "$1.6\\%$",
    optionD: "$1.4\\%$",
    correctOption: "C",
    explanation: "$\\frac{\\Delta \\rho}{\\rho} = \\frac{\\Delta m}{m} + 2\\frac{\\Delta r}{r} + \\frac{\\Delta l}{l} = \\frac{0.002}{0.4} + 2\\frac{0.001}{0.3} + \\frac{0.02}{5} = 0.005 + 0.0067 + 0.004 \\approx 1.56\\% \\approx 1.6\\%$."
  },
  {
    subject: "Physics",
    questionText: "The equivalent capacitance of the system shown in the following circuit is:",
    imageUrl: "/neetimages/neet_2023_q22.svg",
    optionA: "$2\\,\\mu\\text{F}$",
    optionB: "$3\\,\\mu\\text{F}$",
    optionC: "$6\\,\\mu\\text{F}$",
    optionD: "$9\\,\\mu\\text{F}$",
    correctOption: "A",
    explanation: "Parallel combination of $3\\,\\mu\\text{F} + 3\\,\\mu\\text{F} = 6\\,\\mu\\text{F}$. In series with $3\\,\\mu\\text{F}: C_{\\text{eq}} = \\frac{3 \\times 6}{3 + 6} = 2\\,\\mu\\text{F}$."
  },
  {
    subject: "Physics",
    questionText: "Two bodies of mass $m$ and $9m$ are placed at a distance $R$. The gravitational potential on the line joining the bodies where the gravitational field equals zero, will be ($G = \\text{gravitational constant}$):",
    imageUrl: "/neetimages/neet_2023_q23.svg",
    optionA: "$-\\frac{8Gm}{R}$",
    optionB: "$-\\frac{12Gm}{R}$",
    optionC: "$-\\frac{16Gm}{R}$",
    optionD: "$-\\frac{20Gm}{R}$",
    correctOption: "C",
    explanation: "Null point where field is zero: $\\frac{Gm}{x^2} = \\frac{G(9m)}{(R-x)^2} \\implies x = \\frac{R}{4}$. Potential $V = -\\frac{Gm}{R/4} - \\frac{G(9m)}{3R/4} = -\\frac{4Gm}{R} - \\frac{12Gm}{R} = -\\frac{16Gm}{R}$."
  },
  {
    subject: "Physics",
    questionText: "The venturi-meter works on:",
    optionA: "Huygens’s principle",
    optionB: "Bernoulli’s principle",
    optionC: "The principle of parallel axes",
    optionD: "The principle of perpendicular axes",
    correctOption: "B",
    explanation: "Venturi-meter measures flow speed of incompressible fluids based on Bernoulli's principle."
  },
  {
    subject: "Physics",
    questionText: "The half life of a radioactive substance is $20\\text{ minutes}$. In how much time, the activity of substance drops to $\\left(\\frac{1}{16}\\right)^{\\text{th}}$ of its initial value?",
    optionA: "$20\\text{ minutes}$",
    optionB: "$40\\text{ minutes}$",
    optionC: "$60\\text{ minutes}$",
    optionD: "$80\\text{ minutes}$",
    correctOption: "D",
    explanation: "$\\frac{N}{N_0} = \\left(\\frac{1}{2}\\right)^n = \\frac{1}{16} \\implies n = 4$ half-lives. Total time $t = 4 \\times 20 = 80\\text{ minutes}$."
  },
  {
    subject: "Physics",
    questionText: "A football player is moving southward and suddenly turns eastward with the same speed to avoid an opponent. The force that acts on the player while turning is:",
    imageUrl: "/neetimages/neet_2023_q26.svg",
    optionA: "Along Eastward",
    optionB: "Along Northward",
    optionC: "Along North-East",
    optionD: "Along South-West",
    correctOption: "C",
    explanation: "$\\vec{p}_i = -p\\hat{j}$, $\\vec{p}_f = p\\hat{i}$. $\\Delta \\vec{p} = \\vec{p}_f - \\vec{p}_i = p\\hat{i} + p\\hat{j}$ (North-East direction)."
  },
  {
    subject: "Physics",
    questionText: "The errors in the measurement which arise due to unpredictable fluctuations in temperature and voltage supply are:",
    optionA: "Instrumental errors",
    optionB: "Personal errors",
    optionC: "Least count errors",
    optionD: "Random errors",
    correctOption: "D",
    explanation: "Unpredictable fluctuations in environmental conditions cause random errors."
  },
  {
    subject: "Physics",
    questionText: "The angular acceleration of a body, moving along the circumference of a circle, is:",
    optionA: "Along the radius, away from centre",
    optionB: "Along the radius towards the centre",
    optionC: "Along the tangent to its position",
    optionD: "Along the axis of rotation",
    correctOption: "D",
    explanation: "Angular acceleration is an axial vector pointing along the axis of rotation."
  },
  {
    subject: "Physics",
    questionText: "A full wave rectifier circuit consists of two p-n junction diodes, a centre-tapped transformer, capacitor and a load resistance. Which of these components remove the ac ripple from the rectified output?",
    optionA: "A centre-tapped transformer",
    optionB: "p-n junction diodes",
    optionC: "Capacitor",
    optionD: "Load resistance",
    correctOption: "C",
    explanation: "Capacitor acts as a filter to smooth out ac ripples from the rectified output."
  },
  {
    subject: "Physics",
    questionText: "The ratio of radius of gyration of a solid sphere of mass M and radius R about its own axis to the radius of gyration of the thin hollow sphere of same mass and radius about its axis is:",
    optionA: "3 : 5",
    optionB: "5 : 3",
    optionC: "$\\sqrt{3} : \\sqrt{5}$",
    optionD: "5 : 2",
    correctOption: "C",
    explanation: "$k_1^2 = \\frac{2}{5}R^2$, $k_2^2 = \\frac{2}{3}R^2 \\implies \\frac{k_1}{k_2} = \\sqrt{\\frac{3}{5}}$."
  },
  {
    subject: "Physics",
    questionText: "The magnitude and direction of the current in the following circuit is:",
    imageUrl: "/neetimages/neet_2023_q31.svg",
    optionA: "$0.2\\text{ A}$ from B to A through E",
    optionB: "$0.5\\text{ A}$ from A to B through E",
    optionC: "$\\frac{5}{9}\\text{ A}$ from A to B through E",
    optionD: "$1.5\\text{ A}$ from B to A through E",
    correctOption: "B",
    explanation: "Net EMF $= 10 - 5 = 5\\text{ V}$. Total resistance $= 2 + 1 + 7 = 10\\,\\Omega$. Current $I = \\frac{5}{10} = 0.5\\text{ A}$ clockwise (A to B through E)."
  },
  {
    subject: "Physics",
    questionText: "An ac source is connected to a capacitor C. Due to decrease in its operating frequency:",
    optionA: "Capacitive reactance decreases",
    optionB: "Displacement current increases",
    optionC: "Displacement current decreases",
    optionD: "Capacitive reactance remains constant",
    correctOption: "C",
    explanation: "$I_D = \\frac{E}{X_C} = E \\omega C = E(2\\pi f)C$. When frequency $f$ decreases, displacement current $I_D$ decreases."
  },
  {
    subject: "Physics",
    questionText: "The net magnetic flux through any closed surface is:",
    optionA: "Zero",
    optionB: "Positive",
    optionC: "Infinity",
    optionD: "Negative",
    correctOption: "A",
    explanation: "Gauss's law for magnetism states $\\oint \\vec{B} \\cdot d\\vec{A} = 0$ as magnetic monopoles do not exist."
  },
  {
    subject: "Physics",
    questionText: "In a plane electromagnetic wave travelling in free space, the electric field component oscillates sinusoidally at a frequency of $2.0 \\times 10^{10}\\text{ Hz}$ and amplitude $48\\text{ V m}^{-1}$. Then the amplitude of oscillating magnetic field is: (Speed of light $c = 3 \\times 10^8\\text{ m s}^{-1}$)",
    optionA: "$1.6 \\times 10^{-9}\\text{ T}$",
    optionB: "$1.6 \\times 10^{-8}\\text{ T}$",
    optionC: "$1.6 \\times 10^{-7}\\text{ T}$",
    optionD: "$1.6 \\times 10^{-6}\\text{ T}$",
    correctOption: "C",
    explanation: "$B_0 = \\frac{E_0}{c} = \\frac{48}{3 \\times 10^8} = 1.6 \\times 10^{-7}\\text{ T}$."
  },
  {
    subject: "Physics",
    questionText: "The potential energy of a long spring when stretched by $2\\text{ cm}$ is $U$. If the spring is stretched by $8\\text{ cm}$, potential energy stored in it will be:",
    optionA: "$2U$",
    optionB: "$4U$",
    optionC: "$8U$",
    optionD: "$16U$",
    correctOption: "D",
    explanation: "$U \\propto x^2 \\implies \\frac{U_2}{U_1} = \\left(\\frac{8}{2}\\right)^2 = 16 \\implies U_2 = 16U$."
  },
  {
    subject: "Physics",
    questionText: "A bullet from a gun is fired on a rectangular wooden block with velocity $u$. When bullet travels $24\\text{ cm}$ through the block along its length horizontally, velocity of bullet becomes $\\frac{u}{3}$. Then it further penetrates into the block in the same direction before coming to rest exactly at the other end of the block. The total length of the block is:",
    optionA: "$27\\text{ cm}$",
    optionB: "$24\\text{ cm}$",
    optionC: "$28\\text{ cm}$",
    optionD: "$30\\text{ cm}$",
    correctOption: "A",
    explanation: "$v^2 = u^2 - 2as \\implies (u/3)^2 = u^2 - 2a(24) \\implies a = \\frac{u^2}{54}$. Distance to rest from $u/3$: $0 = (u/3)^2 - 2a s_2 \\implies s_2 = 3\\text{ cm}$. Total length $= 24 + 3 = 27\\text{ cm}$."
  },
  {
    subject: "Physics",
    questionText: "A satellite is orbiting just above the surface of the earth with period $T$. If $d$ is the density of the earth and $G$ is the universal constant of gravitation, the quantity $\\frac{3\\pi}{Gd}$ represents:",
    optionA: "$T$",
    optionB: "$T^2$",
    optionC: "$T^3$",
    optionD: "$\\sqrt{T}$",
    correctOption: "B",
    explanation: "$T = 2\\pi \\sqrt{\\frac{R^3}{G M}} = 2\\pi \\sqrt{\\frac{R^3}{G \\cdot d \\cdot \\frac{4}{3}\\pi R^3}} = \\sqrt{\\frac{3\\pi}{G d}} \\implies T^2 = \\frac{3\\pi}{Gd}$."
  },
  {
    subject: "Physics",
    questionText: "The radius of innermost orbit of hydrogen atom is $5.3 \\times 10^{-11}\\text{ m}$. What is the radius of third allowed orbit of hydrogen atom?",
    optionA: "$0.53\\text{ Å}$",
    optionB: "$1.06\\text{ Å}$",
    optionC: "$1.59\\text{ Å}$",
    optionD: "$4.77\\text{ Å}$",
    correctOption: "D",
    explanation: "$r_n = n^2 r_1 = 3^2 \\times 5.3 \\times 10^{-11}\\text{ m} = 4.77 \\times 10^{-10}\\text{ m} = 4.77\\text{ Å}$."
  },
  {
    subject: "Physics",
    questionText: "The net impedance of circuit shown with inductor $50/\\pi\\text{ mH}$, capacitor $10^3/\\pi\\,\\mu\\text{F}$, resistor $10\\,\\Omega$ at $50\\text{ Hz}$ will be:",
    imageUrl: "/neetimages/neet_2023_q39.svg",
    optionA: "$10\\sqrt{2}\\,\\Omega$",
    optionB: "$15\\,\\Omega$",
    optionC: "$5\\sqrt{5}\\,\\Omega$",
    optionD: "$20\\,\\Omega$",
    correctOption: "C",
    explanation: "$X_L = 2\\pi (50)(50/\\pi \\times 10^{-3}) = 5\\,\\Omega$. $X_C = \\frac{1}{2\\pi (50)(1000/\\pi \\times 10^{-6})} = 10\\,\\Omega$. $Z = \\sqrt{R^2 + (X_C - X_L)^2} = \\sqrt{10^2 + 5^2} = \\sqrt{125} = 5\\sqrt{5}\\,\\Omega$."
  },
  {
    subject: "Physics",
    questionText: "The $x-t$ graph of a particle performing simple harmonic motion is shown in the figure. The acceleration of the particle at $t = 2\\text{ s}$ is:",
    imageUrl: "/neetimages/neet_2023_q40.svg",
    optionA: "$\\frac{\\pi^2}{8}\\text{ m s}^{-2}$",
    optionB: "$-\\frac{\\pi^2}{8}\\text{ m s}^{-2}$",
    optionC: "$\\frac{\\pi^2}{16}\\text{ m s}^{-2}$",
    optionD: "$-\\frac{\\pi^2}{16}\\text{ m s}^{-2}$",
    correctOption: "D",
    explanation: "$T = 8\\text{ s} \\implies \\omega = \\frac{2\\pi}{8} = \\frac{\\pi}{4}$. $x(t) = \\sin(\\omega t)$. Acceleration $a = -\\omega^2 x = -\\left(\\frac{\\pi}{4}\\right)^2 \\sin\\left(\\frac{\\pi}{4} \\times 2\\right) = -\\frac{\\pi^2}{16}\\text{ m s}^{-2}$."
  },
  {
    subject: "Physics",
    questionText: "In the figure shown here, what is the equivalent focal length of the combination of lenses ($n_1 = 1.5, n_2 = 1.6, R_1 = R_2 = 20\\text{ cm}$)?",
    imageUrl: "/neetimages/neet_2023_q41.svg",
    optionA: "$40\\text{ cm}$",
    optionB: "$-40\\text{ cm}$",
    optionC: "$-100\\text{ cm}$",
    optionD: "$-50\\text{ cm}$",
    correctOption: "C",
    explanation: "$\\frac{1}{F} = \\frac{1}{f_1} + \\frac{1}{f_2} + \\frac{1}{f_3} = \\frac{-0.3}{10} + \\frac{0.5}{10} + \\frac{-0.3}{10} = -\\frac{0.1}{10} = -\\frac{1}{100} \\implies F = -100\\text{ cm}$."
  },
  {
    subject: "Physics",
    questionText: "An electric dipole with charges $-q$ and $+q$ separated by $6\\text{ cm}$ is placed along the axis. The electric potential (in $10^2\\text{ V}$) at point P ($5\\text{ cm}$ from origin) due to the dipole is ($K = \\frac{1}{4\\pi \\varepsilon_0}$):",
    optionA: "$\\frac{3}{8} q K \\times 10^2$",
    optionB: "$\\frac{5}{8} q K \\times 10^2$",
    optionC: "$\\frac{8}{5} q K \\times 10^2$",
    optionD: "$\\frac{8}{3} q K \\times 10^2$",
    correctOption: "A",
    explanation: "$V_P = \\frac{Kq}{2 \\times 10^{-2}} - \\frac{Kq}{8 \\times 10^{-2}} = Kq \\times 10^2 \\left(\\frac{1}{2} - \\frac{1}{8}\\right) = \\frac{3}{8} q K \\times 10^2\\text{ V}$."
  },
  {
    subject: "Physics",
    questionText: "A horizontal bridge is built across a river. A student standing on the bridge throws a small ball vertically upwards with a velocity $4\\text{ m s}^{-1}$. The ball strikes the water surface after $4\\text{ s}$. The height of bridge above water surface is (Take $g = 10\\text{ m s}^{-2}$):",
    optionA: "$56\\text{ m}$",
    optionB: "$60\\text{ m}$",
    optionC: "$64\\text{ m}$",
    optionD: "$68\\text{ m}$",
    correctOption: "C",
    explanation: "$-H = ut - \\frac{1}{2} g t^2 = 4(4) - \\frac{1}{2}(10)(16) = 16 - 80 = -64 \\implies H = 64\\text{ m}$."
  },
  {
    subject: "Physics",
    questionText: "Calculate the maximum acceleration of a moving car so that a body lying on the floor of the car remains stationary. The coefficient of static friction is $\\mu_s = 0.15$ ($g = 10\\text{ m s}^{-2}$):",
    optionA: "$1.2\\text{ m s}^{-2}$",
    optionB: "$150\\text{ m s}^{-2}$",
    optionC: "$1.5\\text{ m s}^{-2}$",
    optionD: "$50\\text{ m s}^{-2}$",
    correctOption: "C",
    explanation: "$a_{\\max} = \\mu_s g = 0.15 \\times 10 = 1.5\\text{ m s}^{-2}$."
  },
  {
    subject: "Physics",
    questionText: "10 resistors, each of resistance $R$ are connected in series to a battery of emf $E$ and negligible internal resistance. Then those are connected in parallel to the same battery, the current is increased $n$ times. The value of $n$ is:",
    optionA: "10",
    optionB: "100",
    optionC: "1",
    optionD: "1000",
    correctOption: "B",
    explanation: "$I_1 = \\frac{E}{10R}$, $I_2 = \\frac{E}{R/10} = \\frac{10E}{R} \\implies \\frac{I_2}{I_1} = 100 \\implies n = 100$."
  },
  {
    subject: "Physics",
    questionText: "For the given logic circuit (inputs A and B passed through NOT gates into a NAND gate), the truth table corresponds to:",
    imageUrl: "/neetimages/neet_2023_q46.svg",
    optionA: "A:0,B:0->1; A:0,B:1->1; A:1,B:0->1; A:1,B:1->0",
    optionB: "A:0,B:0->0; A:0,B:1->1; A:1,B:0->1; A:1,B:1->1 (OR Gate)",
    optionC: "A:0,B:0->1; A:0,B:1->0; A:1,B:0->1; A:1,B:1->0",
    optionD: "A:0,B:0->0; A:0,B:1->0; A:1,B:0->0; A:1,B:1->1 (AND Gate)",
    correctOption: "B",
    explanation: "$Y = \\overline{\\bar{A} \\cdot \\bar{B}} = \\bar{\\bar{A}} + \\bar{\\bar{B}} = A + B$ (OR Gate)."
  },
  {
    subject: "Physics",
    questionText: "A very long conducting wire is bent in a semi-circular shape from A to B of radius $R$. The magnetic field at centre point P for steady current $i$ is given by:",
    optionA: "$\\frac{\\mu_0 i}{4R}$ pointed into the page",
    optionB: "$\\frac{\\mu_0 i}{4R}$ pointed away from the page",
    optionC: "$\\frac{\\mu_0 i}{4R}\\left[1 - \\frac{2}{\\pi}\\right]$ pointed away from the page",
    optionD: "$\\frac{\\mu_0 i}{4R}\\left[1 - \\frac{2}{\\pi}\\right]$ pointed into the page",
    correctOption: "C",
    explanation: "$B = B_{\\text{semicircle}} - 2 B_{\\text{straight}} = \\frac{\\mu_0 i}{4R} - \\frac{\\mu_0 i}{2\\pi R} = \\frac{\\mu_0 i}{4R}\\left(1 - \\frac{2}{\\pi}\\right)$ directed outward."
  },
  {
    subject: "Physics",
    questionText: "The resistance of platinum wire at $0^\\circ\\text{C}$ is $2\\,\\Omega$ and $6.8\\,\\Omega$ at $80^\\circ\\text{C}$. The temperature coefficient of resistance of the wire is:",
    optionA: "$3 \\times 10^{-4\\;\\circ}\\text{C}^{-1}$",
    optionB: "$3 \\times 10^{-3\\;\\circ}\\text{C}^{-1}$",
    optionC: "$3 \\times 10^{-2\\;\\circ}\\text{C}^{-1}$",
    optionD: "$3 \\times 10^{-1\\;\\circ}\\text{C}^{-1}$",
    correctOption: "C",
    explanation: "$\\alpha = \\frac{R - R_0}{R_0 \\Delta T} = \\frac{6.8 - 2}{2 \\times 80} = \\frac{4.8}{160} = 3 \\times 10^{-2\\;\\circ}\\text{C}^{-1}$."
  },
  {
    subject: "Physics",
    questionText: "A wire carrying a current $I$ along the positive x-axis has length $L$. It is kept in a magnetic field $\\vec{B} = (2\\hat{i} + 3\\hat{j} - 4\\hat{k})\\text{ T}$. The magnitude of the magnetic force acting on the wire is:",
    optionA: "$3IL$",
    optionB: "$\\sqrt{5}IL$",
    optionC: "$5IL$",
    optionD: "$\\sqrt{3}IL$",
    correctOption: "C",
    explanation: "$\\vec{F} = I(\\vec{L} \\times \\vec{B}) = I(L\\hat{i} \\times (2\\hat{i} + 3\\hat{j} - 4\\hat{k})) = IL(3\\hat{k} + 4\\hat{j}) \\implies |\\vec{F}| = IL\\sqrt{3^2 + 4^2} = 5IL$."
  },
  {
    subject: "Physics",
    questionText: "Two thin lenses are of same focal lengths ($f$), but one is convex and the other one is concave. When they are placed in contact with each other, the equivalent focal length of the combination will be:",
    optionA: "Zero",
    optionB: "$\\frac{f}{4}$",
    optionC: "$\\frac{f}{2}$",
    optionD: "Infinite",
    correctOption: "D",
    explanation: "$\\frac{1}{F} = \\frac{1}{f} + \\frac{1}{-f} = 0 \\implies F = \\infty$."
  },

  // -------------------------------------------------------------
  // CHEMISTRY (Q51 - Q100)
  // -------------------------------------------------------------
  {
    subject: "Chemistry",
    questionText: "Select the correct statements from the following:\nA. Atoms of all elements are composed of two fundamental particles.\nB. The mass of the electron is $9.10939 \\times 10^{-31}\\text{ kg}$.\nC. All the isotopes of a given element show same chemical properties.\nD. Protons and electrons are, collectively known as nucleons.\nE. Dalton's atomic theory, regarded the atom as an ultimate particle of matter.\nChoose the correct answer from the options given below:",
    optionA: "A, B and C only",
    optionB: "C, D and E only",
    optionC: "A and E only",
    optionD: "B, C and E only",
    correctOption: "D",
    explanation: "Statements B, C, and E are correct. A is false (3 fundamental particles), D is false (protons and neutrons are nucleons)."
  },
  {
    subject: "Chemistry",
    questionText: "Given below are two statements: one is labelled as Assertion A and the other is labelled as Reason R:\nAssertion A: A reaction can have zero activation energy.\nReason R: The minimum extra amount of energy absorbed by reactant molecules so that their energy becomes equal to threshold value, is called activation energy.\nIn the light of the above statements, choose the correct answer from the options given below:",
    optionA: "Both A and R are true and R is the correct explanation of A.",
    optionB: "Both A and R are true and R is not the correct explanation of A.",
    optionC: "A is true but R is false.",
    optionD: "A is false but R is true.",
    correctOption: "B",
    explanation: "Both statements are factually correct, but Reason is the definition of activation energy and does not explain why activation energy can be zero for radical recombinations."
  },
  {
    subject: "Chemistry",
    questionText: "A compound is formed by two elements A and B. The element B forms cubic close packed structure and atoms of A occupy $1/3$ of tetrahedral voids. If the formula of the compound is $\\text{A}_x\\text{B}_y$, then the value of $x + y$ is:",
    optionA: "5",
    optionB: "4",
    optionC: "3",
    optionD: "2",
    correctOption: "A",
    explanation: "For ccp: $B = 4$, Tetrahedral voids $= 8$. $A = \\frac{1}{3} \\times 8 = \\frac{8}{3}$. Formula is $A_{8/3} B_4 \\implies A_2 B_3 \\implies x + y = 2 + 3 = 5$."
  },
  {
    subject: "Chemistry",
    questionText: "Given below are two statements:\nAssertion A: Metallic sodium dissolves in liquid ammonia giving a deep blue solution which is paramagnetic.\nReason R: The deep blue solution is due to the formation of amide.\nIn the light of the above statements, choose the correct answer:",
    optionA: "Both A and R are true and R is the correct explanation of A.",
    optionB: "Both A and R are true but R is NOT the correct explanation of A.",
    optionC: "A is true but R is false.",
    optionD: "A is false but R is true.",
    correctOption: "C",
    explanation: "Deep blue color is due to ammoniated electrons $[e(\\text{NH}_3)_y]^-$, not amide formation. Hence Assertion is true, Reason is false."
  },
  {
    subject: "Chemistry",
    questionText: "Amongst the following, the total number of species NOT having eight electrons around central atom in its outer most shell, is: $\\text{NH}_3, \\text{AlCl}_3, \\text{BeCl}_2, \\text{CCl}_4, \\text{PCl}_5$",
    optionA: "3",
    optionB: "2",
    optionC: "4",
    optionD: "1",
    correctOption: "A",
    explanation: "$\\text{AlCl}_3$ (6e, hypovalent), $\\text{BeCl}_2$ (4e, hypovalent), and $\\text{PCl}_5$ (10e, hypervalent) do not have 8 electrons. Total $= 3$."
  },
  {
    subject: "Chemistry",
    questionText: "Which amongst the following molecules on polymerization produces neoprene?",
    optionA: "$\\text{H}_2\\text{C}=\\text{CH}-\\text{CH}=\\text{CH}_2$",
    optionB: "$\\text{H}_2\\text{C}=\\text{C}(\\text{Cl})-\\text{CH}=\\text{CH}_2$ (Chloroprene)",
    optionC: "$\\text{H}_2\\text{C}=\\text{CH}-\\text{C}\\equiv\\text{CH}$",
    optionD: "$\\text{H}_2\\text{C}=\\text{C}(\\text{CH}_3)-\\text{CH}=\\text{CH}_2$ (Isoprene)",
    correctOption: "B",
    explanation: "Polymerization of chloroprene (2-chlorobuta-1,3-diene) produces neoprene."
  },
  {
    subject: "Chemistry",
    questionText: "In Lassaigne’s extract of an organic compound, both nitrogen and sulphur are present, which gives blood red colour with $\\text{Fe}^{3+}$ due to the formation of:",
    optionA: "$\\text{Fe}_4[\\text{Fe}(\\text{CN})_6]_3 \\cdot x\\text{H}_2\\text{O}$",
    optionB: "$\\text{NaSCN}$",
    optionC: "$[\\text{Fe}(\\text{CN})_5\\text{NOS}]^{4-}$",
    optionD: "$[\\text{Fe}(\\text{SCN})]^{2+}$",
    correctOption: "D",
    explanation: "$\\text{Fe}^{3+} + \\text{SCN}^- \\to [\\text{Fe}(\\text{SCN})]^{2+}$ (blood red complex)."
  },
  {
    subject: "Chemistry",
    questionText: "Weight (g) of two moles of the organic compound, which is obtained by heating sodium ethanoate with sodium hydroxide in presence of calcium oxide is:",
    optionA: "$16\\text{ g}$",
    optionB: "$32\\text{ g}$",
    optionC: "$30\\text{ g}$",
    optionD: "$18\\text{ g}$",
    correctOption: "B",
    explanation: "Decarboxylation: $\\text{CH}_3\\text{COONa} + \\text{NaOH} \\xrightarrow{\\text{CaO}} \\text{CH}_4 + \\text{Na}_2\\text{CO}_3$. Organic product is methane $\\text{CH}_4$ (Molar mass $= 16\\text{ g/mol}$). For 2 moles, mass $= 2 \\times 16 = 32\\text{ g}$."
  },
  {
    subject: "Chemistry",
    questionText: "Some tranquilizers are listed below. Which one from the following belongs to barbiturates?",
    optionA: "Chlordiazepoxide",
    optionB: "Meprobamate",
    optionC: "Valium",
    optionD: "Veronal",
    correctOption: "D",
    explanation: "Veronal, Luminal, Seconal, and Amytal are derivative of barbituric acid (barbiturates)."
  },
  {
    subject: "Chemistry",
    questionText: "The conductivity of centimolar solution of $\\text{KCl}$ at $25^\\circ\\text{C}$ is $0.0210\\text{ ohm}^{-1}\\text{ cm}^{-1}$ and the resistance of the cell containing the solution at $25^\\circ\\text{C}$ is $60\\,\\Omega$. The value of cell constant is:",
    optionA: "$1.34\\text{ cm}^{-1}$",
    optionB: "$3.28\\text{ cm}^{-1}$",
    optionC: "$1.26\\text{ cm}^{-1}$",
    optionD: "$3.34\\text{ cm}^{-1}$",
    correctOption: "C",
    explanation: "Cell constant $G^* = \\kappa \\times R = 0.0210 \\times 60 = 1.26\\text{ cm}^{-1}$."
  },
  {
    subject: "Chemistry",
    questionText: "Cyclohexanone reacts with $\\text{HCN}$ to form intermediate [B], which upon heating with concentrated $\\text{H}_2\\text{SO}_4$ gives product [C]. Product [C] is:",
    optionA: "Cyclohexanol",
    optionB: "Cyclohexanecarboxylic acid",
    optionC: "Cyclohexanecarbaldehyde",
    optionD: "Cyclohex-1-enecarboxylic acid",
    correctOption: "D",
    explanation: "Addition of HCN gives cyanohydrin. Acidic dehydration and nitrile hydrolysis yields $\\alpha,\\beta$-unsaturated acid (cyclohex-1-enecarboxylic acid)."
  },
  {
    subject: "Chemistry",
    questionText: "Homoleptic complex from the following complexes is:",
    optionA: "Potassium trioxalatoaluminate (III) - $\\text{K}_3[\\text{Al}(\\text{ox})_3]$",
    optionB: "Diamminechloridonitrito-N-platinum (II)",
    optionC: "Pentaamminecarbonatocobalt (III) chloride",
    optionD: "Triamminetriaquachromium (III) chloride",
    correctOption: "A",
    explanation: "A homoleptic complex has only one type of ligand. $\\text{K}_3[\\text{Al}(\\text{ox})_3]$ contains only oxalate ligands."
  },
  {
    subject: "Chemistry",
    questionText: "The relation between $n_m$ ($n_m = $ number of permissible values of magnetic quantum number $m$) for a given value of azimuthal quantum number ($l$), is:",
    optionA: "$l = \\frac{n_m - 1}{2}$",
    optionB: "$l = 2n_m + 1$",
    optionC: "$n_m = 2l^2 + 1$",
    optionD: "$n_m = l + 2$",
    correctOption: "A",
    explanation: "$n_m = 2l + 1 \\implies l = \\frac{n_m - 1}{2}$."
  },
  {
    subject: "Chemistry",
    questionText: "The stability of $\\text{Cu}^{2+}$ is more than $\\text{Cu}^+$ salts in aqueous solution due to:",
    optionA: "First ionisation enthalpy",
    optionB: "Enthalpy of atomization",
    optionC: "Hydration energy",
    optionD: "Second ionisation enthalpy",
    correctOption: "C",
    explanation: "High negative hydration enthalpy of $\\text{Cu}^{2+}$ compensates for second ionization enthalpy."
  },
  {
    subject: "Chemistry",
    questionText: "Taking stability as the factor, which one of the following represents correct relationship?",
    optionA: "$\\text{TlCl}_3 > \\text{TlCl}$",
    optionB: "$\\text{InI}_3 > \\text{InI}$",
    optionC: "$\\text{AlCl} > \\text{AlCl}_3$",
    optionD: "$\\text{TlI} > \\text{TlI}_3$",
    correctOption: "D",
    explanation: "Due to inert pair effect, $+1$ oxidation state is more stable than $+3$ for Thallium (Tl)."
  },
  {
    subject: "Chemistry",
    questionText: "Which one is an example of heterogeneous catalysis?",
    optionA: "Oxidation of sulphur dioxide into sulphur trioxide in presence of oxides of nitrogen",
    optionB: "Hydrolysis of sugar catalysed by $\\text{H}^+$ ions",
    optionC: "Decomposition of ozone in presence of nitrogen monoxide",
    optionD: "Combination between dinitrogen and dihydrogen to form ammonia in presence of finely divided iron (Haber's Process)",
    correctOption: "D",
    explanation: "Reactants are gaseous ($\text{N}_2, \\text{H}_2$) while catalyst is solid ($\text{Fe}$), representing heterogeneous catalysis."
  },
  {
    subject: "Chemistry",
    questionText: "The number of $\\sigma$ bonds, $\\pi$ bonds and lone pair of electrons in pyridine, respectively are:",
    optionA: "11, 2, 0",
    optionB: "12, 3, 0",
    optionC: "11, 3, 1",
    optionD: "12, 2, 1",
    correctOption: "C",
    explanation: "Pyridine ($\text{C}_5\\text{H}_5\\text{N}$): $5\\text{ C-H} + 5\\text{ C-C} + 1\\text{ C-N} = 11\\,\\sigma$ bonds, $3\\,\\pi$ bonds, and $1$ lone pair on N."
  },
  {
    subject: "Chemistry",
    questionText: "The correct order of energies of molecular orbitals of $\\text{N}_2$ molecule, is:",
    optionA: "$\\sigma 1s < \\sigma^* 1s < \\sigma 2s < \\sigma^* 2s < (\\pi 2p_x = \\pi 2p_y) < \\sigma 2p_z < (\\pi^* 2p_x = \\pi^* 2p_y) < \\sigma^* 2p_z$",
    optionB: "$\\sigma 1s < \\sigma^* 1s < \\sigma 2s < \\sigma^* 2s < \\sigma 2p_z < (\\pi 2p_x = \\pi 2p_y) < (\\pi^* 2p_x = \\pi^* 2p_y) < \\pi^* 2p_z$",
    optionC: "$\\sigma 1s < \\sigma^* 1s < \\sigma 2s < \\sigma^* 2s < \\sigma 2p_z < \\sigma^* 2p_z < (\\pi 2p_x = \\pi 2p_y) < (\\pi^* 2p_x = \\pi^* 2p_y)$",
    optionD: "$\\sigma 1s < \\sigma^* 1s < \\sigma 2s < \\sigma^* 2s < (\\pi 2p_x = \\pi 2p_y) < (\\pi^* 2p_x = \\pi^* 2p_y) < \\sigma 2p_z < \\sigma^* 2p_z$",
    correctOption: "A",
    explanation: "For homonuclear diatomic molecules with $\\le 14$ electrons, $\\pi 2p$ orbitals are lower in energy than $\\sigma 2p_z$."
  },
  {
    subject: "Chemistry",
    questionText: "Given below are two statements:\nAssertion A: Helium is used to dilute oxygen in diving apparatus.\nReason R: Helium has high solubility in $\\text{O}_2$.\nChoose the correct option:",
    optionA: "Both A and R are true and R is correct explanation of A.",
    optionB: "Both A and R are true and R is NOT the correct explanation of A.",
    optionC: "A is true but R is false.",
    optionD: "A is false but R is true.",
    correctOption: "B",
    explanation: "Both statements are true. Helium has low solubility in blood (which prevents the bends) and high solubility in gas mixtures."
  },
  {
    subject: "Chemistry",
    questionText: "For a certain reaction, the rate $= k[\\text{A}]^2[\\text{B}]$, when the initial concentration of A is tripled keeping concentration of B constant, the initial rate would:",
    optionA: "Decrease by a factor of nine",
    optionB: "Increase by a factor of six",
    optionC: "Increase by a factor of nine",
    optionD: "Increase by a factor of three",
    correctOption: "C",
    explanation: "$\\text{Rate}' = k(3[\\text{A}])^2[\\text{B}] = 9k[\\text{A}]^2[\\text{B}] = 9 \\times \\text{Rate}$."
  },
  {
    subject: "Chemistry",
    questionText: "Reduction of 1-(3-propionylphenyl)propan-1-one with $\\text{Zn-Hg} / \\text{conc. HCl}$ (Clemmensen reduction) yields:",
    optionA: "1,3-dipropylbenzene",
    optionB: "1,3-bis(1-hydroxypropyl)benzene",
    optionC: "1-propyl-3-ethylbenzene",
    optionD: "1,3-dimethylbenzene",
    correctOption: "A",
    explanation: "Clemmensen reduction converts carbonyl groups ($>\\text{C}=\\text{O}$) into methylene groups ($-\\text{CH}_2-$), giving 1,3-dipropylbenzene."
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following reactions will NOT give primary amine as the product?",
    optionA: "$\\text{CH}_3\\text{CONH}_2 \\xrightarrow{\\text{Br}_2 / \\text{KOH}} \\text{Product}$",
    optionB: "$\\text{CH}_3\\text{CN} \\xrightarrow{\\text{LiAlH}_4} \\text{Product}$",
    optionC: "$\\text{CH}_3\\text{NC} \\xrightarrow{\\text{LiAlH}_4} \\text{Product}$",
    optionD: "$\\text{CH}_3\\text{CONH}_2 \\xrightarrow{\\text{LiAlH}_4} \\text{Product}$",
    correctOption: "C",
    explanation: "Reduction of isocyanide ($\\text{CH}_3\\text{NC}$) with $\\text{LiAlH}_4$ gives secondary amine ($\\text{CH}_3\\text{NHCH}_3$)."
  },
  {
    subject: "Chemistry",
    questionText: "Which amongst the following options is the correct graphical representation of Boyle’s Law?",
    optionA: "$P$ vs $V$ (Straight lines with positive slopes)",
    optionB: "$P$ vs $1/V$ (Straight lines passing through origin with slopes $T_3 > T_2 > T_1$)",
    optionC: "$P$ vs $1/V$ (Hyperbolas)",
    optionD: "$P$ vs $T$ (At constant $V$)",
    correctOption: "B",
    explanation: "$P = \\frac{nRT}{V} = (nRT) \\cdot \\frac{1}{V}$. Graph of $P$ vs $\\frac{1}{V}$ is a straight line through origin with slope $\\propto T$."
  },
  {
    subject: "Chemistry",
    questionText: "Amongst the given options which of the following molecules/ion acts as a Lewis acid?",
    optionA: "$\\text{NH}_3$",
    optionB: "$\\text{H}_2\\text{O}$",
    optionC: "$\\text{BF}_3$",
    optionD: "$\\text{OH}^-$",
    correctOption: "C",
    explanation: "$\\text{BF}_3$ has an electron deficient boron atom (sextet of valence electrons) and acts as an electron pair acceptor (Lewis acid)."
  },
  {
    subject: "Chemistry",
    questionText: "The element expected to form largest ion to achieve the nearest noble gas configuration is:",
    optionA: "O",
    optionB: "F",
    optionC: "N",
    optionD: "Na",
    correctOption: "C",
    explanation: "Among isoelectronic species $\\text{N}^{3-}, \\text{O}^{2-}, \\text{F}^-, \\text{Na}^+$, size decreases as nuclear charge $Z$ increases. $\\text{N}^{3-}$ ($Z=7$) has the largest radius."
  },
  {
    subject: "Chemistry",
    questionText: "The compound $\\text{C}_6\\text{H}_5-\\text{CH}=\\text{CH}-\\text{CH}(\\text{X})-\\text{CH}_2\\text{CH}_3$ is an example of:",
    optionA: "Benzylic halide",
    optionB: "Aryl halide",
    optionC: "Allylic halide",
    optionD: "Vinylic halide",
    correctOption: "C",
    explanation: "Halogen atom is bonded to $sp^3$-hybridized carbon atom adjacent to a carbon-carbon double bond (allylic position)."
  },
  {
    subject: "Chemistry",
    questionText: "Given below are two statements:\nStatement I: A unit formed by the attachment of a base to 1’ position of sugar is known as nucleoside.\nStatement II: When nucleoside is linked to phosphorous acid at 5’ -position of sugar moiety, we get nucleotide.\nChoose the correct option:",
    optionA: "Both Statement I and Statement II are true",
    optionB: "Both Statement I and Statement II are false",
    optionC: "Statement I is true but Statement II is false",
    optionD: "Statement I is false but Statement II is true",
    correctOption: "C",
    explanation: "Statement I is true. Statement II is false because nucleotide is formed by esterification with phosphoric acid (not phosphorous acid)."
  },
  {
    subject: "Chemistry",
    questionText: "Intermolecular forces are forces of attraction and repulsion between interacting particles that will include:\nA. dipole - dipole forces\nB. dipole - induced dipole forces\nC. hydrogen bonding\nD. covalent bonding\nE. dispersion forces\nChoose the most appropriate answer:",
    optionA: "B, C, D, E are correct",
    optionB: "A, B, C, D are correct",
    optionC: "A, B, C, E are correct",
    optionD: "A, C, D, E are correct",
    correctOption: "C",
    explanation: "Covalent bonding (D) is an intramolecular (primary chemical) bond. A, B, C, E are intermolecular forces."
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following statements are NOT correct?\nA. Hydrogen is used to reduce heavy metal oxides to metals.\nB. Heavy water is used to study reaction mechanism.\nC. Hydrogen is used to make saturated fats from oils.\nD. The H-H bond dissociation enthalpy is lowest as compared to a single bond between two atoms of any elements.\nE. Hydrogen reduces oxides of metals that are more active than iron.\nChoose the option containing incorrect statements:",
    optionA: "B, D only",
    optionB: "D, E only",
    optionC: "A, B, C only",
    optionD: "B, C, D, E only",
    correctOption: "B",
    explanation: "Statements D and E are incorrect. H-H bond dissociation enthalpy is the highest for a single bond, and hydrogen cannot reduce oxides of metals more active than iron."
  },
  {
    subject: "Chemistry",
    questionText: "Which one of the following statements is correct?",
    optionA: "The bone in human body is an inert and unchanging substance.",
    optionB: "Mg plays roles in neuromuscular function and interneuronal transmission.",
    optionC: "The daily requirement of Mg and Ca in the human body is estimated to be $0.2-0.3\\text{ g}$.",
    optionD: "All enzymes that utilise ATP in phosphate transfer require Ca as the cofactor.",
    correctOption: "C",
    explanation: "Daily requirement of Mg and Ca is $0.2-0.3\\text{ g}$ ($200-300\\text{ mg}$). ATP enzymes require $\\text{Mg}^{2+}$ (not $\\text{Ca}^{2+}$)."
  },
  {
    subject: "Chemistry",
    questionText: "Match List-I with List-II:\nList-I:\nA. Coke, B. Diamond, C. Fullerene, D. Graphite\nList-II:\nI. Carbon atoms are $sp^3$ hybridised, II. Used as a dry lubricant, III. Used as a reducing agent, IV. Cage like molecules\nChoose the correct answer:",
    optionA: "A-II, B-IV, C-I, D-III",
    optionB: "A-IV, B-I, C-II, D-III",
    optionC: "A-III, B-I, C-IV, D-II",
    optionD: "A-III, B-IV, C-I, D-II",
    correctOption: "C",
    explanation: "Coke = reducing agent (III), Diamond = $sp^3$ (I), Fullerene = cage molecules (IV), Graphite = dry lubricant (II)."
  },
  {
    subject: "Chemistry",
    questionText: "The right option for the mass of $\\text{CO}_2$ produced by heating $20\\text{ g}$ of $20\\%$ pure limestone is (Atomic mass of $\\text{Ca} = 40$) [$\\text{CaCO}_3 \\xrightarrow{1200\\text{K}} \\text{CaO} + \\text{CO}_2$]:",
    optionA: "$1.76\\text{ g}$",
    optionB: "$2.64\\text{ g}$",
    optionC: "$1.32\\text{ g}$",
    optionD: "$1.12\\text{ g}$",
    correctOption: "A",
    explanation: "Pure $\\text{CaCO}_3 = 20 \\times 0.20 = 4\\text{ g}$. Moles $= 4/100 = 0.04\\text{ mol}$. Mass of $\\text{CO}_2 = 0.04 \\times 44 = 1.76\\text{ g}$."
  },
  {
    subject: "Chemistry",
    questionText: "Reaction of benzenediazonium chloride with (i) $\\text{Cu}_2\\text{Br}_2/\\text{HBr}$, (ii) $\\text{Mg}/\\text{dry ether}$, (iii) $\\text{H}_2\\text{O}$ yields:",
    optionA: "Phenol",
    optionB: "Benzene",
    optionC: "Phenylmagnesium bromide",
    optionD: "Bromobenzene",
    correctOption: "B",
    explanation: "Sandmeyer reaction gives bromobenzene. Reaction with Mg gives Grignard reagent, which upon hydrolysis with $\\text{H}_2\\text{O}$ yields Benzene."
  },
  {
    subject: "Chemistry",
    questionText: "Given below are two statements:\nAssertion A: In equation $\\Delta_r G = -nFE_{\\text{cell}}$, value of $\\Delta_r G$ depends on $n$.\nReason R: $E_{\\text{cell}}$ is an intensive property and $\\Delta_r G$ is an extensive property.\nChoose the correct answer:",
    optionA: "Both A and R are true and R is the correct explanation of A.",
    optionB: "Both A and R are true and R is NOT the correct explanation of A.",
    optionC: "A is true but R is false.",
    optionD: "A is false but R is true.",
    correctOption: "B",
    explanation: "Both statements are true. $\\Delta_r G$ is extensive and depends on stoichiometric coefficient $n$, while $E_{\\text{cell}}$ is intensive."
  },
  {
    subject: "Chemistry",
    questionText: "3-Methylbutan-2-ol reacts with $\\text{HBr}$ to form product (P). Product (P) is:",
    optionA: "2-Bromo-2-methylbutane",
    optionB: "2-Methylbut-2-ene",
    optionC: "2-Bromo-3-methylbutane",
    optionD: "1-Bromo-2,2-dimethylpropane",
    correctOption: "A",
    explanation: "Protonation of -OH followed by loss of water forms a $2^\\circ$ carbocation, which undergoes $1,2$-hydride shift to form a more stable $3^\\circ$ carbocation, giving 2-bromo-2-methylbutane."
  },
  {
    subject: "Chemistry",
    questionText: "Among naphthalene, cyclopentadienyl anion, cyclobutadiene, cyclopropenyl anion, cyclopropenyl cation, cyclooctatetraene, and anthracene, the number of species which obey Huckel’s rule ($4n+2\\,\\pi$ electrons) is:",
    optionA: "4",
    optionB: "6",
    optionC: "2",
    optionD: "5",
    correctOption: "A",
    explanation: "Naphthalene ($10\\pi$), Cyclopentadienyl anion ($6\\pi$), Cyclopropenyl cation ($2\\pi$), and Anthracene ($14\\pi$) obey Huckel's rule. Total $= 4$."
  },
  {
    subject: "Chemistry",
    questionText: "Reaction of 2-acetylbenzaldehyde with Tollen's reagent $[\\text{Ag}(\\text{NH}_3)_2]^+ / \\text{OH}^-$ selectively oxidizes the aldehyde group to give:",
    optionA: "2-(1-hydroxyethyl)benzyl alcohol",
    optionB: "2-acetylbenzyl alcohol",
    optionC: "2-acetylbenzoate ion",
    optionD: "2-(1-hydroxyethyl)benzoate ion",
    correctOption: "C",
    explanation: "Tollen's reagent is a mild oxidizing agent that selectively oxidizes aliphatic and aromatic aldehydes to carboxylate without affecting ketone groups."
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following statements are INCORRECT?\nA. All transition metals except scandium form MO oxides which are ionic.\nB. The highest oxidation number corresponding to group number in transition metal oxides is attained in $\\text{Sc}_2\\text{O}_3$ to $\\text{Mn}_2\\text{O}_7$.\nC. Basic character increases from $\\text{V}_2\\text{O}_3$ to $\\text{V}_2\\text{O}_4$ to $\\text{V}_2\\text{O}_5$.\nD. $\\text{V}_2\\text{O}_4$ dissolves in acids to give $\\text{VO}_4^{3-}$ salts.\nE. $\\text{CrO}$ is basic but $\\text{Cr}_2\\text{O}_3$ is amphoteric.\nChoose the correct option:",
    optionA: "A and E only",
    optionB: "B and D only",
    optionC: "C and D only",
    optionD: "B and C only",
    correctOption: "C",
    explanation: "As oxidation state increases, acidic character increases (C is wrong). $\\text{V}_2\\text{O}_4$ dissolves in acids to give $\\text{VO}^{2+}$ salts (D is wrong)."
  },
  {
    subject: "Chemistry",
    questionText: "Which amongst the following will be most readily dehydrated under acidic conditions?",
    optionA: "3-nitrobutan-2-ol",
    optionB: "4-nitrobutan-2-ol",
    optionC: "1-(4-nitrophenyl)propan-1-ol",
    optionD: "4-(4-nitrophenyl)butan-2-ol",
    correctOption: "D",
    explanation: "Dehydration occurs via carbocation intermediate. When $-\\text{NO}_2$ is farther from the carbocation, its destabilizing $-I$ effect is minimal, making dehydration fastest."
  },
  {
    subject: "Chemistry",
    questionText: "Cleavage of benzyl phenyl ether ($\\text{C}_6\\text{H}_5\\text{CH}_2-\\text{O}-\\text{C}_6\\text{H}_5$) with $\\text{HI}$ upon heating yields products A and B:",
    optionA: "$\\text{A} = \\text{Toluene}, \\text{B} = \\text{Phenol}$",
    optionB: "$\\text{A} = \\text{Benzyl alcohol}, \\text{B} = \\text{Iodobenzene}$",
    optionC: "$\\text{A} = \\text{Benzyl iodide}, \\text{B} = \\text{Phenol}$",
    optionD: "$\\text{A} = \\text{Toluene}, \\text{B} = \\text{Iodobenzene}$",
    correctOption: "C",
    explanation: "The phenyl-oxygen bond has partial double bond character due to resonance and does not cleave. The benzyl-oxygen bond cleaves via $S_N1/S_N2$ to give benzyl iodide and phenol."
  },
  {
    subject: "Chemistry",
    questionText: "The reaction that does NOT take place in a blast furnace between $900\\text{ K}$ to $1500\\text{ K}$ temperature range during extraction of iron is:",
    optionA: "$\\text{Fe}_2\\text{O}_3 + \\text{CO} \\to 2\\text{FeO} + \\text{CO}_2$",
    optionB: "$\\text{FeO} + \\text{CO} \\to \\text{Fe} + \\text{CO}_2$",
    optionC: "$\\text{C} + \\text{CO}_2 \\to 2\\text{CO}$",
    optionD: "$\\text{CaO} + \\text{SiO}_2 \\to \\text{CaSiO}_3$",
    correctOption: "A",
    explanation: "Reduction of $\\text{Fe}_2\\text{O}_3$ to $\\text{Fe}_3\\text{O}_4$ and $\\text{FeO}$ takes place in the lower temperature range ($500-800\\text{ K}$)."
  },
  {
    subject: "Chemistry",
    questionText: "Which amongst the following options is the correct relation between change in enthalpy and change in internal energy?",
    optionA: "$\\Delta H = \\Delta U - \\Delta n_g RT$",
    optionB: "$\\Delta H = \\Delta U + \\Delta n_g RT$",
    optionC: "$\\Delta H - \\Delta U = -\\Delta n RT$",
    optionD: "$\\Delta H + \\Delta U = \\Delta n R$",
    correctOption: "B",
    explanation: "$\\Delta H = \\Delta U + \\Delta n_g RT$."
  },
  {
    subject: "Chemistry",
    questionText: "On balancing the redox reaction in acidic medium: $a\\,\\text{Cr}_2\\text{O}_7^{2-} + b\\,\\text{SO}_3^{2-} + c\\,\\text{H}^+ \\to 2a\\,\\text{Cr}^{3+} + b\\,\\text{SO}_4^{2-} + \\frac{c}{2}\\,\\text{H}_2\\text{O}$, the coefficients $a, b, c$ are:",
    optionA: "1, 3, 8",
    optionB: "3, 8, 1",
    optionC: "1, 8, 3",
    optionD: "8, 1, 3",
    correctOption: "A",
    explanation: "Balanced equation: $\\text{Cr}_2\\text{O}_7^{2-} + 3\\text{SO}_3^{2-} + 8\\text{H}^+ \\to 2\\text{Cr}^{3+} + 3\\text{SO}_4^{2-} + 4\\text{H}_2\\text{O}$."
  },
  {
    subject: "Chemistry",
    questionText: "What fraction of one edge centred octahedral void lies in one unit cell of fcc?",
    optionA: "$1/2$",
    optionB: "$1/3$",
    optionC: "$1/4$",
    optionD: "$1/12$",
    correctOption: "C",
    explanation: "Each edge is shared by 4 unit cells, so contribution of an edge-centred void to one unit cell is $1/4$."
  },
  {
    subject: "Chemistry",
    questionText: "Given below are two statements:\nStatement I: The nutrient deficient water bodies lead to eutrophication.\nStatement II: Eutrophication leads to decrease in the level of oxygen in the water bodies.\nChoose the correct option:",
    optionA: "Both Statement I and Statement II are true",
    optionB: "Both Statement I and Statement II are false",
    optionC: "Statement I is correct but Statement II is false",
    optionD: "Statement I is incorrect but Statement II is true",
    correctOption: "D",
    explanation: "Nutrient-enriched (not deficient) water bodies lead to algal blooms and eutrophication, which depletes dissolved oxygen."
  },
  {
    subject: "Chemistry",
    questionText: "The equilibrium concentrations for $\\text{A} + \\text{B} \\rightleftharpoons \\text{C} + \\text{D}$ are $[\\text{A}]=2, [\\text{B}]=3, [\\text{C}]=10, [\\text{D}]=6\\text{ mol L}^{-1}$ at $300\\text{ K}$. $\\Delta G^\\circ$ is ($R = 2\\text{ cal/mol K}$):",
    optionA: "$1372.60\\text{ cal}$",
    optionB: "$-137.26\\text{ cal}$",
    optionC: "$-1381.80\\text{ cal}$",
    optionD: "$-13.73\\text{ cal}$",
    correctOption: "C",
    explanation: "$K = \\frac{10 \\times 6}{2 \\times 3} = 10$. $\\Delta G^\\circ = -2.303 R T \\log_{10} K = -2.303 \\times 2 \\times 300 \\times 1 = -1381.8\\text{ cal}$."
  },
  {
    subject: "Chemistry",
    questionText: "Which complex compound is most stable?",
    optionA: "$[\\text{Co}(\\text{NH}_3)_4(\\text{H}_2\\text{O})\\text{Br}](\\text{NO}_3)_2$",
    optionB: "$[\\text{Co}(\\text{NH}_3)_3(\\text{NO}_3)_3]$",
    optionC: "$[\\text{CoCl}_2(\\text{en})_2]\\text{NO}_3$",
    optionD: "$[\\text{Co}(\\text{NH}_3)_6]_2(\\text{SO}_4)_3$",
    correctOption: "C",
    explanation: "Due to the chelate effect, complexes with bidentate chelating ligands like ethylenediamine (en) have higher stability."
  },
  {
    subject: "Chemistry",
    questionText: "Match List-I (Oxoacids of Sulphur) with List-II (Bonds):\nList-I:\nA. Peroxodisulphuric acid, B. Sulphuric acid, C. Pyrosulphuric acid, D. Sulphurous acid\nList-II:\nI. Two S-OH, One S=O; II. Two S-OH, Two S=O; III. Two S-OH, Four S=O, One S-O-O-S; IV. Two S-OH, Four S=O, One S-O-S\nChoose the correct option:",
    optionA: "A-I, B-III, C-II, D-IV",
    optionB: "A-III, B-IV, C-I, D-II",
    optionC: "A-III, B-II, C-IV, D-I",
    optionD: "A-II, B-IV, C-I, D-III",
    correctOption: "C",
    explanation: "Peroxodisulphuric acid ($\\text{H}_2\\text{S}_2\\text{O}_8$) has peroxy linkage S-O-O-S (III). Sulphuric acid ($\\text{H}_2\\text{SO}_4$) has 2 S-OH, 2 S=O (II). Pyrosulphuric acid ($\\text{H}_2\\text{S}_2\\text{O}_7$) has S-O-S linkage (IV). Sulphurous acid ($\\text{H}_2\\text{SO}_3$) has 2 S-OH, 1 S=O (I)."
  },
  {
    subject: "Chemistry",
    questionText: "Pumice stone is an example of:",
    optionA: "Sol",
    optionB: "Gel",
    optionC: "Solid sol",
    optionD: "Foam",
    correctOption: "C",
    explanation: "Pumice stone is a colloidal system where gas is dispersed in a solid medium (Solid sol / solid foam)."
  },
  {
    subject: "Chemistry",
    questionText: "Identify the final product [D] in the sequence: $\\text{CH}_3\\text{CHO} \\xrightarrow{\\text{LiAlH}_4} [\\text{A}] \\xrightarrow{\\text{H}_2\\text{SO}_4 / \\Delta} [\\text{B}] \\xrightarrow{\\text{HBr}} [\\text{C}] \\xrightarrow{\\text{Ph-Br / Na, ether}} [\\text{D}]$:",
    optionA: "Ethylbenzene ($\\text{C}_6\\text{H}_5\\text{CH}_2\\text{CH}_3$)",
    optionB: "Biphenyl ($\\text{C}_6\\text{H}_5-\\text{C}_6\\text{H}_5$)",
    optionC: "Butane ($\\text{C}_4\\text{H}_{10}$)",
    optionD: "Styrene",
    correctOption: "A",
    explanation: "$\\text{CH}_3\\text{CHO} \\to \\text{CH}_3\\text{CH}_2\\text{OH} \\to \\text{CH}_2=\\text{CH}_2 \\to \\text{CH}_3\\text{CH}_2\\text{Br}$. Wurtz-Fittig reaction with $\\text{Ph-Br} + \\text{Na}$ gives Ethylbenzene."
  },

  // -------------------------------------------------------------
  // BIOLOGY (Q101 - Q200)
  // -------------------------------------------------------------
  {
    subject: "Biology",
    questionText: "Given below are two statements:\nStatement I: The forces generated by transpiration can lift a xylem-sized column of water over 130 meters height.\nStatement II: Transpiration cools leaf surfaces sometimes 10 to 15 degrees, by evaporative cooling.\nChoose the most appropriate answer:",
    optionA: "Both Statement I and Statement II are correct.",
    optionB: "Both Statement I and Statement II are not correct.",
    optionC: "Statement I is correct but Statement II is incorrect.",
    optionD: "Statement I is incorrect but Statement II is correct.",
    correctOption: "A",
    explanation: "Transpiration pull can create suction pressure to lift water up to 130 meters, and evaporative cooling cools leaf surfaces by 10 to 15°C."
  },
  {
    subject: "Biology",
    questionText: "In gene gun method used to introduce alien DNA into host cells, microparticles of _______ metal are used.",
    optionA: "Copper",
    optionB: "Zinc",
    optionC: "Tungsten or gold",
    optionD: "Silver",
    correctOption: "C",
    explanation: "Biolistics or gene gun coats microscopic particles of gold or tungsten with DNA to shoot into plant cells."
  },
  {
    subject: "Biology",
    questionText: "Given below are two statements:\nAssertion A: The first stage of gametophyte in the life cycle of moss is protonema stage.\nReason R: Protonema develops directly from spores produced in capsule.\nChoose the correct option:",
    optionA: "Both A and R are correct and R is the correct explanation of A.",
    optionB: "Both A and R are correct but R is NOT the correct explanation of A.",
    optionC: "A is correct but R is not correct.",
    optionD: "A is not correct but R is correct.",
    correctOption: "A",
    explanation: "The juvenile stage of moss gametophyte is protonema, which develops directly from a spore."
  },
  {
    subject: "Biology",
    questionText: "Unequivocal proof that DNA is the genetic material was first proposed by:",
    optionA: "Frederick Griffith",
    optionB: "Alfred Hershey and Martha Chase",
    optionC: "Avery, MacLeod and McCarty",
    optionD: "Wilkins and Franklin",
    correctOption: "B",
    explanation: "Hershey-Chase bacteriophage blender experiment (1952) provided unequivocal proof that DNA is genetic material."
  },
  {
    subject: "Biology",
    questionText: "The thickness of ozone in a column of air in the atmosphere is measured in terms of:",
    optionA: "Dobson units",
    optionB: "Decibels",
    optionC: "Decameter",
    optionD: "Kilobase",
    correctOption: "A",
    explanation: "Ozone thickness is measured in Dobson Units (DU)."
  },
  {
    subject: "Biology",
    questionText: "In tissue experiments, leaf mesophyll cells are put in a culture medium to form callus. This phenomenon is called:",
    optionA: "Differentiation",
    optionB: "Dedifferentiation",
    optionC: "Redifferentiation",
    optionD: "Senescence",
    correctOption: "B",
    explanation: "Loss of specialization in living differentiated cells to regain cell division capacity is dedifferentiation."
  },
  {
    subject: "Biology",
    questionText: "Large, colourful, fragrant flowers with nectar are seen in:",
    optionA: "Insect pollinated plants (Entomophilous)",
    optionB: "Bird pollinated plants",
    optionC: "Bat pollinated plants",
    optionD: "Wind pollinated plants",
    correctOption: "A",
    explanation: "Entomophilous flowers are large, colourful, fragrant, and rich in nectar to attract insect pollinators."
  },
  {
    subject: "Biology",
    questionText: "Frequency of recombination between gene pairs on same chromosome as a measure of distance between genes was used for the first time by:",
    optionA: "Thomas Hunt Morgan",
    optionB: "Sutton and Boveri",
    optionC: "Alfred Sturtevant",
    optionD: "Henking",
    correctOption: "C",
    explanation: "Alfred Sturtevant (Morgan's student) constructed the first genetic linkage map."
  },
  {
    subject: "Biology",
    questionText: "Which of the following stages of meiosis involves division of centromere?",
    optionA: "Metaphase I",
    optionB: "Metaphase II",
    optionC: "Anaphase II",
    optionD: "Telophase I",
    correctOption: "C",
    explanation: "Centromeres split and sister chromatids separate during Anaphase II of meiosis."
  },
  {
    subject: "Biology",
    questionText: "What is the role of RNA polymerase III in the process of transcription in Eukaryotes?",
    optionA: "Transcription of rRNAs (28S, 18S and 5.8S)",
    optionB: "Transcription of tRNA, 5S rRNA and snRNA",
    optionC: "Transcription of precursor of mRNA (hnRNA)",
    optionD: "Transcription of only snRNAs",
    correctOption: "B",
    explanation: "RNA Polymerase III transcribes tRNA, 5S rRNA, and snRNAs."
  },
  {
    subject: "Biology",
    questionText: "Among ‘The Evil Quartet’ which one is considered the most important cause driving extinction of species?",
    optionA: "Habitat loss and fragmentation",
    optionB: "Over exploitation for economic gain",
    optionC: "Alien species invasions",
    optionD: "Co-extinctions",
    correctOption: "A",
    explanation: "Habitat loss and fragmentation is the single most important driver of biodiversity extinction."
  },
  {
    subject: "Biology",
    questionText: "Given below are two statements:\nStatement I: Endarch and exarch are terms used for describing position of secondary xylem.\nStatement II: Exarch condition is the most common feature of the root system.\nChoose the correct option:",
    optionA: "Both Statement I and Statement II are true.",
    optionB: "Both Statement I and Statement II are not false.",
    optionC: "Statement I is correct but Statement II is false.",
    optionD: "Statement I is incorrect but Statement II is true.",
    correctOption: "D",
    explanation: "Endarch and exarch refer to primary xylem (not secondary xylem). Exarch protoxylem towards periphery is characteristic of roots."
  },
  {
    subject: "Biology",
    questionText: "Axile placentation is observed in:",
    optionA: "Mustard, Cucumber and Primrose",
    optionB: "China rose, Beans and Lupin",
    optionC: "Tomato, Dianthus and Pea",
    optionD: "China rose, Petunia and Lemon",
    correctOption: "D",
    explanation: "In axile placentation, placenta is axial and ovules are attached in a multilocular ovary (e.g. China rose, Tomato, Lemon, Petunia)."
  },
  {
    subject: "Biology",
    questionText: "Expressed Sequence Tags (ESTs) refers to:",
    optionA: "All genes that are expressed as RNA.",
    optionB: "All genes that are expressed as proteins.",
    optionC: "All genes whether expressed or unexpressed.",
    optionD: "Certain important expressed genes.",
    correctOption: "A",
    explanation: "ESTs approach identifies all genes that are transcribed into RNA."
  },
  {
    subject: "Biology",
    questionText: "What is the function of tassels in the corn cob?",
    optionA: "To attract insects",
    optionB: "To trap pollen grains",
    optionC: "To disperse pollen grains",
    optionD: "To protect seeds",
    correctOption: "B",
    explanation: "Tassels are stigma and style which wave in the wind to trap airborne pollen grains."
  },
  {
    subject: "Biology",
    questionText: "Spraying of which phytohormone on juvenile conifers helps in hastening maturity period for early seed production?",
    optionA: "Indole-3-butyric Acid",
    optionB: "Gibberellic Acid ($GA_3$)",
    optionC: "Zeatin",
    optionD: "Abscisic Acid",
    correctOption: "B",
    explanation: "Gibberellins hasten maturity in juvenile conifers and promote early seed production."
  },
  {
    subject: "Biology",
    questionText: "In the productivity equation $GPP - R = NPP$, $R$ represents:",
    optionA: "Photosynthetically active radiation",
    optionB: "Respiratory quotient",
    optionC: "Respiration loss",
    optionD: "Reproductive allocation",
    correctOption: "C",
    explanation: "$GPP - R = NPP$, where $R$ is respiration loss by plants."
  },
  {
    subject: "Biology",
    questionText: "With respect to stamens, pick out the characteristics specific to family Fabaceae but not found in Solanaceae or Liliaceae:",
    optionA: "Diadelphous and Dithecous anthers",
    optionB: "Polyadelphous and epipetalous stamens",
    optionC: "Monoadelphous and Monothecous anthers",
    optionD: "Epiphyllous and Dithecous anthers",
    correctOption: "A",
    explanation: "Fabaceae stamens are diadelphous (10 stamens in $9 + 1$ arrangement) and dithecous."
  },
  {
    subject: "Biology",
    questionText: "In angiosperms, the haploid, diploid and triploid structures of a fertilized embryo sac sequentially are:",
    optionA: "Synergids, Primary endosperm nucleus and zygote",
    optionB: "Antipodals, synergids, and primary endosperm nucleus",
    optionC: "Synergids ($n$), Zygote ($2n$) and Primary endosperm nucleus ($3n$)",
    optionD: "Synergids, antipodals and Polar nuclei",
    correctOption: "C",
    explanation: "Synergids are haploid ($n$), zygote is diploid ($2n$), and primary endosperm nucleus (PEN) is triploid ($3n$)."
  },
  {
    subject: "Biology",
    questionText: "Which hormone promotes internode/petiole elongation in deep water rice?",
    optionA: "$\\text{GA}_3$",
    optionB: "Kinetin",
    optionC: "Ethylene",
    optionD: "2,4-D",
    correctOption: "C",
    explanation: "Ethylene promotes rapid internode/petiole elongation in deep water rice plants."
  },
  {
    subject: "Biology",
    questionText: "Given below are two statements:\nAssertion A: Late wood has fewer xylary elements with narrow vessels.\nReason R: Cambium is less active in winters.\nChoose the correct option:",
    optionA: "Both A and R are true and R is the correct explanation of A.",
    optionB: "Both A and R are true but R is NOT the correct explanation of A.",
    optionC: "A is true but R is not false.",
    optionD: "A is not false but R is true.",
    correctOption: "A",
    explanation: "In winter, cambium is less active and forms autumn wood (late wood) with narrow vessels."
  },
  {
    subject: "Biology",
    questionText: "Given below are two statements:\nAssertion A: ATP is used at two steps in glycolysis.\nReason R: First ATP is used in converting glucose into glucose-6-phosphate and second ATP in conversion of fructose-6-phosphate into fructose-1,6-bisphosphate.\nChoose the correct option:",
    optionA: "Both A and R are true and R is the correct explanation of A.",
    optionB: "Both A and R are true but R is NOT the correct explanation of A.",
    optionC: "A is true but R is false.",
    optionD: "A is false but R is true.",
    correctOption: "A",
    explanation: "Two ATPs are invested in the preparatory phase of glycolysis by hexokinase and phosphofructokinase."
  },
  {
    subject: "Biology",
    questionText: "Identify the correct statements regarding decomposition:\nA. Detritivores perform fragmentation.\nB. The humus is further degraded by some microbes during mineralization.\nC. Water soluble inorganic nutrients go down into the soil and get precipitated by leaching.\nD. The detritus food chain begins with living organisms.\nE. Earthworms break down detritus into smaller particles by a process called catabolism.\nChoose the correct option:",
    optionA: "A, B, C only",
    optionB: "B, C, D only",
    optionC: "C, D, E only",
    optionD: "D, E, A only",
    correctOption: "A",
    explanation: "Statements A, B, C are correct. D is false (DFC starts with dead matter), E is false (fragmentation, not catabolism)."
  },
  {
    subject: "Biology",
    questionText: "The process of appearance of recombination nodules occurs at which sub-stage of prophase I in meiosis?",
    optionA: "Zygotene",
    optionB: "Pachytene",
    optionC: "Diplotene",
    optionD: "Diakinesis",
    correctOption: "B",
    explanation: "Recombination nodules appear and crossing over occurs during Pachytene stage."
  },
  {
    subject: "Biology",
    questionText: "How many ATP and $\\text{NADPH}_2$ are required for the synthesis of one molecule of Glucose during Calvin cycle?",
    optionA: "$12\\text{ ATP and } 12\\text{ NADPH}_2$",
    optionB: "$18\\text{ ATP and } 12\\text{ NADPH}_2$",
    optionC: "$12\\text{ ATP and } 16\\text{ NADPH}_2$",
    optionD: "$18\\text{ ATP and } 16\\text{ NADPH}_2$",
    correctOption: "B",
    explanation: "For each $\\text{CO}_2$ fixed, 3 ATP and $2\\text{ NADPH}$ are consumed. For 6 $\\text{CO}_2$ (1 glucose), $18\\text{ ATP}$ and $12\\text{ NADPH}_2$ are required."
  },
  {
    subject: "Biology",
    questionText: "The phenomenon of pleiotropism refers to:",
    optionA: "Presence of several alleles of a single gene controlling a single crossover.",
    optionB: "Presence of two alleles, each of the two genes controlling a single trait.",
    optionC: "A single gene affecting multiple phenotypic expressions.",
    optionD: "More than two genes affecting a single character.",
    correctOption: "C",
    explanation: "Pleiotropy is the ability of a single gene to exhibit multiple phenotypic expressions (e.g. Phenylketonuria)."
  },
  {
    subject: "Biology",
    questionText: "Upon exposure to UV radiation, DNA stained with ethidium bromide will show:",
    optionA: "Bright red colour",
    optionB: "Bright blue colour",
    optionC: "Bright yellow colour",
    optionD: "Bright orange colour",
    correctOption: "D",
    explanation: "Ethidium bromide intercalates into DNA and fluoresces bright orange under UV light."
  },
  {
    subject: "Biology",
    questionText: "The reaction centre in Photosystem II (PS II) has an absorption maxima at:",
    optionA: "$680\\text{ nm}$",
    optionB: "$700\\text{ nm}$",
    optionC: "$660\\text{ nm}$",
    optionD: "$780\\text{ nm}$",
    correctOption: "A",
    explanation: "Reaction centre of PS II is P680 ($680\\text{ nm}$), while PS I is P700."
  },
  {
    subject: "Biology",
    questionText: "During the purification process for recombinant DNA technology, addition of chilled ethanol precipitates out:",
    optionA: "RNA",
    optionB: "DNA",
    optionC: "Histones",
    optionD: "Polysaccharides",
    correctOption: "B",
    explanation: "Chilled ethanol precipitates pure purified DNA threads (spooling)."
  },
  {
    subject: "Biology",
    questionText: "Which micronutrient is required for splitting of water molecule (photolysis) during photosynthesis?",
    optionA: "Manganese (Mn)",
    optionB: "Molybdenum",
    optionC: "Magnesium",
    optionD: "Copper",
    correctOption: "A",
    explanation: "Manganese and Chloride ions are essential for photolysis of water in the oxygen-evolving complex."
  },
  {
    subject: "Biology",
    questionText: "Movement and accumulation of ions across a membrane against their concentration gradient can be explained by:",
    optionA: "Osmosis",
    optionB: "Facilitated Diffusion",
    optionC: "Passive Transport",
    optionD: "Active transport",
    correctOption: "D",
    explanation: "Uphill transport against concentration gradient requiring ATP is active transport."
  },
  {
    subject: "Biology",
    questionText: "Among eukaryotes, replication of nuclear DNA takes place in:",
    optionA: "M phase",
    optionB: "S phase (Synthesis phase)",
    optionC: "G1 phase",
    optionD: "G2 phase",
    correctOption: "B",
    explanation: "DNA replication and centriole duplication occur during S-phase of interphase."
  },
  {
    subject: "Biology",
    questionText: "Cellulose does not form blue colour with Iodine because:",
    optionA: "It is a disaccharide.",
    optionB: "It is a branched helical molecule.",
    optionC: "It does not contain complex helices and hence cannot hold iodine molecules.",
    optionD: "It breaks down when iodine reacts with it.",
    correctOption: "C",
    explanation: "Cellulose forms unbranched linear $\\beta(1\\to 4)$ chains without helical secondary structure to trap $I_2$ molecules."
  },
  {
    subject: "Biology",
    questionText: "The historic Convention on Biological Diversity, ‘The Earth Summit’ was held in Rio de Janeiro in the year:",
    optionA: "1985",
    optionB: "1992",
    optionC: "1986",
    optionD: "2002",
    correctOption: "B",
    explanation: "The Earth Summit in Rio de Janeiro was held in 1992."
  },
  {
    subject: "Biology",
    questionText: "Identify the pair of heterosporous pteridophytes among the following:",
    optionA: "Lycopodium and Selaginella",
    optionB: "Selaginella and Salvinia",
    optionC: "Psilotum and Salvinia",
    optionD: "Equisetum and Salvinia",
    correctOption: "B",
    explanation: "Selaginella and Salvinia produce two types of spores (microspores and megaspores)."
  },
  {
    subject: "Biology",
    questionText: "Match List I with List II (Cell Cycle):\nList I:\nA. M Phase, B. G2 Phase, C. G1 Phase, D. G0 Phase\nList II:\nI. Proteins are synthesized, II. Inactive quiescent phase, III. Interval between mitosis and DNA replication, IV. Equational division\nChoose the correct option:",
    optionA: "A-III, B-II, C-IV, D-I",
    optionB: "A-IV, B-II, C-I, D-III",
    optionC: "A-IV, B-I, C-III, D-II",
    optionD: "A-II, B-IV, C-I, D-III",
    correctOption: "C",
    explanation: "M phase = equational division (IV), G2 = protein synthesis for mitosis (I), G1 = interval before replication (III), G0 = quiescent stage (II)."
  },
  {
    subject: "Biology",
    questionText: "Match List I with List II (Plant Minerals):\nList I:\nA. Iron, B. Zinc, C. Boron, D. Molybdenum\nList II:\nI. Synthesis of auxin, II. Component of nitrate reductase, III. Activation of catalase, IV. Cell elongation, pollen germination\nChoose the correct option:",
    optionA: "A-III, B-II, C-I, D-IV",
    optionB: "A-II, B-III, C-IV, D-I",
    optionC: "A-III, B-I, C-IV, D-II",
    optionD: "A-II, B-IV, C-I, D-III",
    correctOption: "C",
    explanation: "Iron activates catalase (III), Zinc synthesizes auxin (I), Boron facilitates pollen germination (IV), Molybdenum is in nitrate reductase (II)."
  },
  {
    subject: "Biology",
    questionText: "Match List I with List II (Water relations):\nList I:\nA. Cohesion, B. Adhesion, C. Surface tension, D. Guttation\nList II:\nI. More attraction in liquid phase, II. Mutual attraction among water molecules, III. Water loss in liquid phase, IV. Attraction towards polar surfaces\nChoose the correct option:",
    optionA: "A-II, B-IV, C-I, D-III",
    optionB: "A-IV, B-III, C-II, D-I",
    optionC: "A-III, B-I, C-IV, D-II",
    optionD: "A-II, B-I, C-IV, D-III",
    correctOption: "A",
    explanation: "Cohesion = mutual attraction (II), Adhesion = attraction to polar tracheary walls (IV), Surface tension = liquid phase attraction (I), Guttation = liquid loss from hydathodes (III)."
  },
  {
    subject: "Biology",
    questionText: "How many different proteins does the eukaryotic ribosome consist of?",
    optionA: "80",
    optionB: "60",
    optionC: "40",
    optionD: "20",
    correctOption: "A",
    explanation: "A eukaryotic 80S ribosome consists of approximately 80 different proteins."
  },
  {
    subject: "Biology",
    questionText: "Match List I with List II (Respiration):\nList I:\nA. Oxidative decarboxylation, B. Glycolysis, C. Oxidative phosphorylation, D. Tricarboxylic acid cycle\nList II:\nI. Citrate synthase, II. Pyruvate dehydrogenase, III. Electron transport system, IV. EMP pathway\nChoose the correct option:",
    optionA: "A-III, B-IV, C-II, D-I",
    optionB: "A-II, B-IV, C-I, D-III",
    optionC: "A-III, B-I, C-II, D-IV",
    optionD: "A-II, B-IV, C-III, D-I",
    correctOption: "D",
    explanation: "Oxidative decarboxylation = Pyruvate dehydrogenase (II), Glycolysis = EMP pathway (IV), Oxidative phosphorylation = ETS (III), TCA cycle = Citrate synthase (I)."
  },
  {
    subject: "Biology",
    questionText: "Match List I with List II (Population Interactions):\nList I:\nA. Mutualism, B. Commensalism, C. Amensalism, D. Parasitism\nList II:\nI. +(A), 0(B); II. -(A), 0(B); III. +(A), -(B); IV. +(A), +(B)\nChoose the correct option:",
    optionA: "A-IV, B-II, C-I, D-III",
    optionB: "A-IV, B-I, C-II, D-III",
    optionC: "A-IV, B-III, C-I, D-II",
    optionD: "A-III, B-I, C-IV, D-II",
    correctOption: "B",
    explanation: "Mutualism (+, +), Commensalism (+, 0), Amensalism (-, 0), Parasitism (+, -)."
  },
  {
    subject: "Biology",
    questionText: "Main steps in the formation of Recombinant DNA in correct sequential order are:\nA. Insertion of recombinant DNA into host cell\nB. Cutting of DNA at specific location by restriction enzyme\nC. Isolation of desired DNA fragment\nD. Amplification of gene of interest using PCR\nChoose the correct sequence:",
    optionA: "B, C, D, A",
    optionB: "C, A, B, D",
    optionC: "C, B, D, A",
    optionD: "B, D, A, C",
    correctOption: "A",
    explanation: "Steps: Restriction cutting (B) $\\to$ Isolation of fragment (C) $\\to$ PCR amplification (D) $\\to$ Host insertion (A)."
  },
  {
    subject: "Biology",
    questionText: "Given below are two statements:\nStatement I: Gause’s ‘Competitive Exclusion Principle’ states that two closely related species competing for the same resources cannot co-exist indefinitely.\nStatement II: In general, carnivores are more adversely affected by competition than herbivores.\nChoose the correct answer:",
    optionA: "Both Statement I and Statement II are true.",
    optionB: "Both Statement I and Statement II are false.",
    optionC: "Statement I is correct but Statement II is false.",
    optionD: "Statement I is incorrect but Statement II is true.",
    correctOption: "C",
    explanation: "Statement I is true. Statement II is false because herbivores and plants are more adversely affected by competition than carnivores."
  },
  {
    subject: "Biology",
    questionText: "Given below are two statements:\nAssertion A: A flower is defined as modified shoot wherein shoot apical meristem changes to floral meristem.\nReason R: Internode of the shoot gets condensed to produce different floral appendages laterally at successive nodes.\nChoose the correct option:",
    optionA: "Both A and R are true and R is the correct explanation of A.",
    optionB: "Both A and R are true but R is NOT the correct explanation of A.",
    optionC: "A is true but R is not false.",
    optionD: "A is not false but R is true.",
    correctOption: "A",
    explanation: "Flower is a condensed modified reproductive shoot with floral appendages borne at condensed nodes."
  },
  {
    subject: "Biology",
    questionText: "Which of the following statements are correct about Klinefelter’s Syndrome?\nA. This disorder was first described by Langdon Down (1866).\nB. Such an individual has overall masculine development, however feminine development (gynaecomastia) is also expressed.\nC. The affected individual is short statured.\nD. Physical, psychomotor and mental development is retarded.\nE. Such individuals are sterile.\nChoose the correct answer:",
    optionA: "A and B only",
    optionB: "C and D only",
    optionC: "B and E only",
    optionD: "A and E only",
    correctOption: "C",
    explanation: "Klinefelter's (47, XXY) has overall masculine development with gynaecomastia (B) and sterile individuals (E). A, C, D describe Down's syndrome."
  },
  {
    subject: "Biology",
    questionText: "Malonate inhibits the growth of pathogenic bacteria by competitive inhibition of:",
    optionA: "Succinic dehydrogenase",
    optionB: "Amylase",
    optionC: "Lipase",
    optionD: "Dinitrogenase",
    correctOption: "A",
    explanation: "Malonate closely resembles succinate and competitively inhibits succinic dehydrogenase in the Krebs cycle."
  },
  {
    subject: "Biology",
    questionText: "Which one of the following statements is NOT correct?",
    optionA: "The micro-organisms involved in biodegradation of organic matter in sewage water consume a lot of oxygen causing death of aquatic organisms.",
    optionB: "Algal blooms caused by excess of organic matter in water improve water quality and promote fisheries.",
    optionC: "Water hyacinth grows abundantly in eutrophic water bodies and leads to ecosystem imbalance.",
    optionD: "Toxic substances of industrial waste increase in concentration at successive trophic levels (biomagnification).",
    correctOption: "B",
    explanation: "Algal blooms deteriorate water quality, release toxins, and lead to extensive fish mortality."
  },
  {
    subject: "Biology",
    questionText: "Which of the following combinations is required for chemiosmosis?",
    optionA: "Membrane, proton pump, proton gradient, ATP synthase",
    optionB: "Membrane, proton pump, proton gradient, NADP synthase",
    optionC: "Proton pump, electron gradient, ATP synthase",
    optionD: "Proton pump, electron gradient, NADP synthase",
    correctOption: "A",
    explanation: "Chemiosmosis requires a membrane, a proton pump, a proton gradient across the membrane, and ATP synthase enzyme."
  },
  {
    subject: "Biology",
    questionText: "Identify the correct statements regarding secondary growth in dicot stem:\nA. Lenticels are lens-shaped openings permitting exchange of gases.\nB. Bark formed early in the season is called hard bark.\nC. Bark is a technical term that refers to all tissues exterior to vascular cambium.\nD. Bark refers to periderm and secondary phloem.\nE. Phellogen is single-layered in thickness.\nChoose the correct option:",
    optionA: "B, C and E only",
    optionB: "A and D only",
    optionC: "A, B and D only",
    optionD: "B and C only",
    correctOption: "B",
    explanation: "Statements A and D are correct. B is false (early bark is soft bark), C is non-technical term, E is a couple of layers thick."
  },
  {
    subject: "Biology",
    questionText: "Given below are two statements:\nAssertion A: In gymnosperms the pollen grains are released from the microsporangium and carried by air currents.\nReason R: Air currents carry pollen grains directly to the mouth of archegonia where gametes are discharged and pollen tube is not formed.\nChoose the correct option:",
    optionA: "Both A and R are true and R is the correct explanation of A.",
    optionB: "Both A and R are true but R is NOT the correct explanation of A.",
    optionC: "A is true but R is false.",
    optionD: "A is false but R is true.",
    correctOption: "C",
    explanation: "Assertion is true. Reason is false because pollen tubes are formed (siphonogamy) in gymnosperms."
  },
  {
    subject: "Biology",
    questionText: "Which of the following is NOT a cloning vector?",
    optionA: "BAC (Bacterial Artificial Chromosome)",
    optionB: "YAC (Yeast Artificial Chromosome)",
    optionC: "pBR322",
    optionD: "Probe",
    correctOption: "D",
    explanation: "A probe is a single-stranded radioactive DNA/RNA tag used in hybridization, not a cloning vector."
  },
  {
    subject: "Biology",
    questionText: "Broad palm with a single palm crease (Simian crease) is visible in a person suffering from:",
    optionA: "Down’s syndrome (Trisomy 21)",
    optionB: "Turner’s syndrome",
    optionC: "Klinefelter’s syndrome",
    optionD: "Thalassemia",
    correctOption: "A",
    explanation: "Down's syndrome features flat back of head, broad palm with characteristic single palm crease, and furrowed tongue."
  },
  {
    subject: "Biology",
    questionText: "Which of the following are NOT considered as part of the endomembrane system?\nA. Mitochondria, B. Endoplasmic Reticulum, C. Chloroplasts, D. Golgi complex, E. Peroxisomes\nChoose the most appropriate option:",
    optionA: "B and D only",
    optionB: "A, C and E only",
    optionC: "A and D only",
    optionD: "A, D and E only",
    correctOption: "B",
    explanation: "Endomembrane system includes ER, Golgi, Lysosomes, and Vacuoles. Mitochondria, Chloroplasts, and Peroxisomes are not part of it."
  },
  {
    subject: "Biology",
    questionText: "Match List I with List II (Excretory structures):\nList I:\nA. Taenia, B. Paramoecium, C. Periplaneta, D. Pheretima\nList II:\nI. Nephridia, II. Contractile vacuole, III. Flame cells (Protonephridia), IV. Urecose gland / Malpighian tubules\nChoose the correct option:",
    optionA: "A-I, B-II, C-III, D-IV",
    optionB: "A-I, B-II, C-IV, D-III",
    optionC: "A-III, B-II, C-IV, D-I",
    optionD: "A-II, B-I, C-IV, D-III",
    correctOption: "C",
    explanation: "Taenia = Flame cells (III), Paramoecium = Contractile vacuole (II), Periplaneta = Urecose gland (IV), Pheretima = Nephridia (I)."
  },
  {
    subject: "Biology",
    questionText: "Given below are two statements:\nAssertion A: Amniocentesis for sex determination is one of the strategies of Reproductive and Child Health Care programme.\nReason R: Statutory ban on amniocentesis checks increasing menace of female foeticide.\nChoose the correct option:",
    optionA: "Both A and R are true and R is the correct explanation of A.",
    optionB: "Both A and R are true but R is NOT the correct explanation of A.",
    optionC: "A is true but R is not false.",
    optionD: "A is false but R is true.",
    correctOption: "D",
    explanation: "Amniocentesis for sex determination is illegal and not a strategy of RCH. Ban on it prevents female foeticide."
  },
  {
    subject: "Biology",
    questionText: "Given below are two statements:\nStatement I: Ligaments are dense irregular tissue.\nStatement II: Cartilage is dense regular tissue.\nChoose the correct answer:",
    optionA: "Both Statements I and II are true",
    optionB: "Both Statements I and II are false",
    optionC: "Statement I is true but Statement II is false",
    optionD: "Statement I is false, but Statement II is true",
    correctOption: "B",
    explanation: "Ligaments and tendons are dense regular connective tissues. Cartilage and bone are specialised connective tissues."
  },
  {
    subject: "Biology",
    questionText: "Match List I with List II (ECG):\nList I:\nA. P-wave, B. Q-wave, C. QRS complex, D. T-wave\nList II:\nI. Beginning of systole, II. Repolarisation of ventricles, III. Depolarisation of atria, IV. Depolarisation of ventricles\nChoose the correct option:",
    optionA: "A-III, B-I, C-IV, D-II",
    optionB: "A-IV, B-III, C-II, D-I",
    optionC: "A-II, B-IV, C-I, D-III",
    optionD: "A-I, B-II, C-III, D-IV",
    correctOption: "A",
    explanation: "P-wave = Atrial depolarisation (III), Q-wave = Beginning of ventricular systole (I), QRS = Ventricular depolarisation (IV), T-wave = Ventricular repolarisation (II)."
  },
  {
    subject: "Biology",
    questionText: "Match List I with List II (Digestive Secretions):\nList I:\nA. Peptic cells, B. Goblet cells, C. Oxyntic cells, D. Hepatic cells\nList II:\nI. Mucus, II. Bile juice, III. Proenzyme pepsinogen, IV. HCl and intrinsic factor\nChoose the correct option:",
    optionA: "A-IV, B-III, C-I, D-II",
    optionB: "A-II, B-I, C-III, D-IV",
    optionC: "A-III, B-I, C-IV, D-II",
    optionD: "A-II, B-IV, C-I, D-III",
    correctOption: "C",
    explanation: "Peptic/Chief cells = Pepsinogen (III), Goblet cells = Mucus (I), Oxyntic/Parietal = HCl & intrinsic factor (IV), Hepatic cells = Bile (II)."
  },
  {
    subject: "Biology",
    questionText: "Match List I with List II (Contraceptive Methods):\nList I:\nA. Vasectomy, B. Coitus interruptus, C. Cervical caps, D. Saheli\nList II:\nI. Oral method (Non-steroidal), II. Barrier method, III. Surgical method, IV. Natural method\nChoose the correct option:",
    optionA: "A-III, B-I, C-IV, D-II",
    optionB: "A-III, B-IV, C-II, D-I",
    optionC: "A-II, B-III, C-I, D-IV",
    optionD: "A-IV, B-II, C-I, D-III",
    correctOption: "B",
    explanation: "Vasectomy = Surgical (III), Coitus interruptus = Natural (IV), Cervical caps = Barrier (II), Saheli = Oral pill (I)."
  },
  {
    subject: "Biology",
    questionText: "Given below are two statements:\nStatement I: Vas deferens receives a duct from seminal vesicle and opens into urethra as the ejaculatory duct.\nStatement II: The cavity of the cervix is called cervical canal which along with vagina forms birth canal.\nChoose the correct option:",
    optionA: "Both Statements I and II are true.",
    optionB: "Both statements I and II are false.",
    optionC: "Statement I is true but Statement II is false.",
    optionD: "Statement I is false, but Statement II is true.",
    correctOption: "A",
    explanation: "Both statements are factually correct NCERT descriptions."
  },
  {
    subject: "Biology",
    questionText: "Given below are two statements:\nAssertion A: Nephrons are of two types: Cortical & Juxtamedullary, based on relative position in cortex and medulla.\nReason R: Juxtamedullary nephrons have short loop of Henle whereas cortical nephrons have longer loop of Henle.\nChoose the correct option:",
    optionA: "Both A and R are true and R is the correct explanation of A.",
    optionB: "Both A and R are true but R is NOT the correct explanation of A.",
    optionC: "A is true but R is false.",
    optionD: "A is not false but R is true.",
    correctOption: "C",
    explanation: "Assertion is true. Reason is false because Juxtamedullary nephrons have very long loops of Henle running deep into the medulla."
  },
  {
    subject: "Biology",
    questionText: "Given below are two statements:\nStatement I: Low temperature preserves enzyme in temporarily inactive state whereas high temperature denatures proteins.\nStatement II: When inhibitor closely resembles substrate in molecular structure and inhibits enzyme activity, it is a competitive inhibitor.\nChoose the correct option:",
    optionA: "Both Statements I and II are true.",
    optionB: "Both statements I and II are false.",
    optionC: "Statement I is true but Statement II is false.",
    optionD: "Statement I is false, but Statement II is true.",
    correctOption: "A",
    explanation: "Both statements accurately define enzyme kinetics and competitive inhibition."
  },
  {
    subject: "Biology",
    questionText: "Match List I with List II (Lac Operon):\nList I:\nA. Gene ‘a’, B. Gene ‘y’, C. Gene ‘i’, D. Gene ‘z’\nList II:\nI. $\\beta$-galactosidase, II. Transacetylase, III. Permease, IV. Repressor protein\nChoose the correct option:",
    optionA: "A-II, B-I, C-IV, D-III",
    optionB: "A-II, B-III, C-IV, D-I",
    optionC: "A-III, B-IV, C-I, D-II",
    optionD: "A-III, B-I, C-IV, D-II",
    correctOption: "B",
    explanation: "Gene a = Transacetylase (II), Gene y = Permease (III), Gene i = Repressor (IV), Gene z = $\\beta$-galactosidase (I)."
  },
  {
    subject: "Biology",
    questionText: "Match List I with List II (Human Diseases):\nList I:\nA. Ringworm, B. Filariasis, C. Malaria, D. Pneumonia\nList II:\nI. Haemophilus influenzae, II. Trichophyton, III. Wuchereria bancrofti, IV. Plasmodium vivax\nChoose the correct option:",
    optionA: "A-II, B-III, C-IV, D-I",
    optionB: "A-II, B-III, C-I, D-IV",
    optionC: "A-III, B-II, C-I, D-IV",
    optionD: "A-III, B-II, C-IV, D-I",
    correctOption: "A",
    explanation: "Ringworm = Trichophyton (II), Filariasis = Wuchereria (III), Malaria = Plasmodium (IV), Pneumonia = Haemophilus influenzae (I)."
  },
  {
    subject: "Biology",
    questionText: "Which of the following functions is carried out by cytoskeleton in a cell?",
    optionA: "Nuclear division",
    optionB: "Protein synthesis",
    optionC: "Motility and mechanical support",
    optionD: "Transportation",
    correctOption: "C",
    explanation: "Cytoskeleton (microfilaments, microtubules, intermediate filaments) provides mechanical support, motility, and cell shape."
  },
  {
    subject: "Biology",
    questionText: "Which of the following statements is correct?",
    optionA: "Eutrophication refers to increase in domestic sewage and waste water in lakes.",
    optionB: "Biomagnification refers to increase in concentration of the toxicant at successive trophic levels.",
    optionC: "Presence of large amount of nutrients in water restricts ‘Algal Bloom’.",
    optionD: "Algal Bloom decreases fish mortality.",
    correctOption: "B",
    explanation: "Biomagnification is the progressive accumulation of non-biodegradable toxicants (like DDT, mercury) along the food chain."
  },
  {
    subject: "Biology",
    questionText: "Match List I with List II (Drugs):\nList I:\nA. Heroin, B. Marijuana, C. Cocaine, D. Morphine\nList II:\nI. Effect on cardiovascular system, II. Slows down body function (depressant), III. Painkiller, IV. Interferes with transport of dopamine\nChoose the correct option:",
    optionA: "A-II, B-I, C-IV, D-III",
    optionB: "A-I, B-II, C-III, D-IV",
    optionC: "A-IV, B-III, C-II, D-I",
    optionD: "A-III, B-IV, C-I, D-II",
    correctOption: "A",
    explanation: "Heroin = Depressant (II), Cannabinoids/Marijuana = Cardiovascular effects (I), Cocaine = Dopamine interference (IV), Morphine = Potent analgesic/painkiller (III)."
  },
  {
    subject: "Biology",
    questionText: "Radial symmetry is NOT found in adults of phylum:",
    optionA: "Ctenophora",
    optionB: "Hemichordata",
    optionC: "Coelenterata",
    optionD: "Echinodermata",
    correctOption: "B",
    explanation: "Hemichordates have bilateral symmetry. Adult echinoderms, ctenophores, and coelenterates have radial symmetry."
  },
  {
    subject: "Biology",
    questionText: "Given below are two statements:\nStatement I: In prokaryotes, positively charged DNA is held with negatively charged proteins in nucleoid.\nStatement II: In eukaryotes, negatively charged DNA is wrapped around positively charged histone octamer to form nucleosome.\nChoose the correct option:",
    optionA: "Both Statements I and II are true.",
    optionB: "Both statements I and II are false.",
    optionC: "Statement I is correct but Statement II is false.",
    optionD: "Statement I is incorrect but Statement II is true.",
    correctOption: "D",
    explanation: "DNA is negatively charged (due to phosphate groups). In prokaryotes, negatively charged DNA is held with positively charged non-histone proteins."
  },
  {
    subject: "Biology",
    questionText: "Which of the following statements are correct regarding female reproductive cycle?\nA. In non-primate mammals cyclical changes during reproduction are called oestrus cycle.\nB. First menstrual cycle begins at puberty and is called menopause.\nC. Lack of menstruation may be indicative of pregnancy.\nD. Cyclic menstruation extends between menarche and menopause.\nChoose the most appropriate answer:",
    optionA: "A and D only",
    optionB: "A and B only",
    optionC: "A, B and C only",
    optionD: "A, C and D only",
    correctOption: "D",
    explanation: "Statements A, C, and D are correct. First menstruation is called menarche (not menopause)."
  },
  {
    subject: "Biology",
    questionText: "Select the correct set of Australian Marsupials exhibiting adaptive radiation:",
    optionA: "Tasmanian wolf, Bobcat, Marsupial mole",
    optionB: "Numbat, Spotted cuscus, Flying phalanger",
    optionC: "Mole, Flying squirrel, Tasmanian tiger cat",
    optionD: "Lemur, Anteater, Wolf",
    correctOption: "B",
    explanation: "Numbat, Spotted cuscus, and Flying phalanger are all Australian marsupials."
  },
  {
    subject: "Biology",
    questionText: "Which one of the following techniques does not serve the purpose of early diagnosis of a disease for its early treatment?",
    optionA: "Recombinant DNA Technology",
    optionB: "Serum and Urine analysis (Conventional methods)",
    optionC: "Polymerase Chain Reaction (PCR) technique",
    optionD: "Enzyme Linked Immuno-Sorbent Assay (ELISA) technique",
    correctOption: "B",
    explanation: "Conventional serum and urine analysis detect pathogens only after disease symptoms appear and concentration is high."
  },
  {
    subject: "Biology",
    questionText: "Match List I with List II (Joints):\nList I:\nA. Cartilaginous Joint, B. Ball and Socket Joint, C. Fibrous Joint, D. Saddle Joint\nList II:\nI. Between flat skull bones (Sutures), II. Between adjacent vertebrae in vertebral column, III. Between carpal and metacarpal of thumb, IV. Between Humerus and Pectoral Girdle\nChoose the correct option:",
    optionA: "A-III, B-I, C-II, D-IV",
    optionB: "A-II, B-IV, C-I, D-III",
    optionC: "A-I, B-IV, C-III, D-II",
    optionD: "A-II, B-IV, C-III, D-I",
    correctOption: "B",
    explanation: "Cartilaginous = Vertebrae (II), Ball & Socket = Humerus & pectoral girdle (IV), Fibrous = Skull sutures (I), Saddle = Carpal & metacarpal of thumb (III)."
  },
  {
    subject: "Biology",
    questionText: "Match List I with List II (Ecological Interactions):\nList I:\nA. Leopard and Lion in forest, B. Cuckoo laying egg in Crow’s nest, C. Fungi and root of higher plant in Mycorrhizae, D. Cattle egret and Cattle in field\nList II:\nI. Competition, II. Brood parasitism, III. Mutualism, IV. Commensalism\nChoose the correct option:",
    optionA: "A-I, B-II, C-III, D-IV",
    optionB: "A-I, B-II, C-IV, D-III",
    optionC: "A-III, B-IV, C-I, D-II",
    optionD: "A-II, B-III, C-I, D-IV",
    correctOption: "A",
    explanation: "Leopard & Lion = Competition (I), Cuckoo & Crow = Brood parasitism (II), Mycorrhizae = Mutualism (III), Egret & Cattle = Commensalism (IV)."
  },
  {
    subject: "Biology",
    questionText: "Vital capacity of lung (VC) is equal to:",
    optionA: "IRV + ERV",
    optionB: "IRV + ERV + TV + RV",
    optionC: "IRV + ERV + TV - RV",
    optionD: "IRV + ERV + TV",
    correctOption: "D",
    explanation: "Vital Capacity $VC = ERV + TV + IRV$."
  },
  {
    subject: "Biology",
    questionText: "Match List I with List II (Eye Anatomy):\nList I:\nA. Fovea, B. Iris, C. Blind spot, D. Sclera\nList II:\nI. Visible coloured portion that regulates pupil diameter, II. External dense connective tissue layer, III. Point of greatest visual acuity, IV. Optic nerve exit point with no photoreceptors\nChoose the correct option:",
    optionA: "A-III, B-I, C-IV, D-II",
    optionB: "A-IV, B-III, C-II, D-I",
    optionC: "A-I, B-IV, C-III, D-II",
    optionD: "A-II, B-I, C-III, D-IV",
    correctOption: "A",
    explanation: "Fovea = Maximum visual acuity (III), Iris = Coloured diaphragm (I), Blind spot = Optic disc devoid of photoreceptors (IV), Sclera = External white fibrous coat (II)."
  },
  {
    subject: "Biology",
    questionText: "Once undigested and unabsorbed substances enter the caecum, their backflow into ileum is prevented by:",
    optionA: "Sphincter of Oddi",
    optionB: "Ileo-Caecal valve",
    optionC: "Gastro-Oesophageal sphincter",
    optionD: "Pyloric sphincter",
    correctOption: "B",
    explanation: "Ileo-caecal valve prevents backflow of faecal matter from caecum back into ileum."
  },
  {
    subject: "Biology",
    questionText: "Which of the following sexually transmitted infections (STIs) is completely curable when detected early and treated properly?",
    optionA: "Genital herpes",
    optionB: "Gonorrhoea",
    optionC: "Hepatitis-B",
    optionD: "HIV Infection",
    correctOption: "B",
    explanation: "Bacterial STIs like Gonorrhoea, Syphilis, and Chlamydiasis are completely curable with antibiotics. Hepatitis-B, Genital Herpes, and HIV are incurable."
  },
  {
    subject: "Biology",
    questionText: "Given below are two statements:\nStatement I: A protein is imagined as a line, left end represented by first amino acid (C-terminal) and right end by last amino acid (N-terminal).\nStatement II: Adult human haemoglobin consists of 4 subunits (two $\\alpha$ type and two $\\beta$ type).\nChoose the correct option:",
    optionA: "Both Statement I and Statement II are true.",
    optionB: "Both statement I and Statement II are false.",
    optionC: "Statement I is correct but Statement II is false.",
    optionD: "Statement I is incorrect but Statement II is true.",
    correctOption: "D",
    explanation: "Statement I is false because first amino acid at left is N-terminal and last amino acid at right is C-terminal. Statement II is true ($2\\alpha, 2\\beta$ subunits)."
  },
  {
    subject: "Biology",
    questionText: "Given below are two statements:\nStatement I: Electrostatic precipitator is most widely used in thermal power plants.\nStatement II: Electrostatic precipitator in thermal power plant removes ionising radiations.\nChoose the most appropriate option:",
    optionA: "Both Statement I and Statement II are true.",
    optionB: "Both statement I and Statement II are false.",
    optionC: "Statement I is correct but Statement II is false.",
    optionD: "Statement I is incorrect but Statement II is true.",
    correctOption: "C",
    explanation: "Electrostatic precipitators remove $>99\\%$ of particulate matter (dust and smoke), not ionizing radiation."
  },
  {
    subject: "Biology",
    questionText: "In which blood corpuscles/cells does HIV undergo replication and produce progeny viruses?",
    optionA: "T_H cells (Helper T lymphocytes)",
    optionB: "B-lymphocytes",
    optionC: "Basophils",
    optionD: "Eosinophils",
    correctOption: "A",
    explanation: "HIV enters Helper T-lymphocytes ($T_H$ cells) and macrophages, replicating via reverse transcriptase."
  },
  {
    subject: "Biology",
    questionText: "Given below are two statements:\nStatement I: RNA mutates at a faster rate.\nStatement II: Viruses having RNA genome and shorter life span mutate and evolve faster.\nChoose the correct option:",
    optionA: "Both Statements 1 and 2 are true",
    optionB: "Both statements 1 and 2 are false",
    optionC: "Statement 1 is true, but Statement 2 is false",
    optionD: "Statement 1 is false, but Statement 2 is true",
    correctOption: "A",
    explanation: "2'-OH in RNA makes it chemically reactive and unstable, allowing RNA viruses to mutate and evolve rapidly."
  },
  {
    subject: "Biology",
    questionText: "Given below are two statements:\nAssertion A: Endometrium is necessary for implantation of blastocyst.\nReason R: In the absence of fertilization, the corpus luteum degenerates that causes disintegration of endometrium.\nChoose the correct option:",
    optionA: "Both A and R are true and R is the correct explanation of A.",
    optionB: "Both A and R are true but R is NOT the correct explanation of A.",
    optionC: "A is true but R is false.",
    optionD: "A is false but R is true.",
    correctOption: "B",
    explanation: "Both statements are true. Corpus luteum regression causes progesterone drop and menstruation."
  },
  {
    subject: "Biology",
    questionText: "Match List I with List II (Gastrointestinal & Renal Hormones):\nList I:\nA. CCK, B. GIP, C. ANF, D. ADH\nList II:\nI. Kidney, II. Heart (Atrial wall), III. Gastric gland, IV. Pancreas & Gall bladder\nChoose the correct option:",
    optionA: "A-IV, B-III, C-II, D-I",
    optionB: "A-III, B-II, C-IV, D-I",
    optionC: "A-II, B-IV, C-I, D-III",
    optionD: "A-IV, B-II, C-III, D-I",
    correctOption: "A",
    explanation: "CCK acts on pancreas and gall bladder (IV), GIP inhibits gastric secretion (III), ANF is from heart atria (II), ADH acts on DCT/collecting duct of kidney (I)."
  },
  {
    subject: "Biology",
    questionText: "Which of the following pedigree symbols represents mating between relatives (consanguineous mating) in human pedigree analysis?",
    imageUrl: "/neetimages/neet_2023_q185.svg",
    optionA: "Single line connecting square and circle",
    optionB: "Double line connecting square and circle",
    optionC: "Square and circle with parents above and children below",
    optionD: "Solid shaded square and circle",
    correctOption: "B",
    explanation: "In pedigree analysis, a double horizontal line between male (square) and female (circle) represents consanguineous mating."
  },
  {
    subject: "Biology",
    questionText: "The unique mammalian characteristics are:",
    optionA: "Hairs, lymphatic membrane and mammary gland",
    optionB: "Hairs, pinna (external ears) and mammary glands",
    optionC: "Hairs, pinna and indirect development",
    optionD: "Pinna, monocondylic skull and mammary glands",
    correctOption: "B",
    explanation: "Presence of hair, external ears (pinna), and milk-producing mammary glands are unique diagnostic features of Class Mammalia."
  },
  {
    subject: "Biology",
    questionText: "Which of the following statements are correct regarding Basophils?\nA. Basophils are most abundant cells of the total WBCs.\nB. Basophils secrete histamine, serotonin and heparin.\nC. Basophils are involved in inflammatory response.\nD. Basophils have kidney shaped nucleus.\nE. Basophils are agranulocytes.\nChoose the correct option:",
    optionA: "D and E only",
    optionB: "C and E only",
    optionC: "B and C only",
    optionD: "A and B only",
    correctOption: "C",
    explanation: "Basophils constitute 0.5-1% of WBCs (least abundant), contain granules (granulocytes), and secrete histamine, serotonin, heparin in inflammation."
  },
  {
    subject: "Biology",
    questionText: "Select the correct statements with reference to chordates:\nA. Presence of a mid-dorsal, solid and double nerve cord.\nB. Presence of closed circulatory system.\nC. Presence of paired pharyngeal gill slits.\nD. Presence of dorsal heart.\nE. Triploblastic pseudocoelomate animals.\nChoose the correct option:",
    optionA: "A, C and D only",
    optionB: "B and C only",
    optionC: "B, D and E only",
    optionD: "C, D and E only",
    correctOption: "B",
    explanation: "Chordates have a dorsal, hollow, single nerve cord, ventral heart, closed circulation (B), paired pharyngeal gill slits (C), and are coelomate."
  },
  {
    subject: "Biology",
    questionText: "Which of the following are NOT under the control of thyroid hormone?\nA. Maintenance of water and electrolyte balance\nB. Regulation of basal metabolic rate\nC. Normal rhythm of sleep-wake cycle\nD. Development of immune system\nE. Support the process of R.B.Cs formation\nChoose the correct option:",
    optionA: "A and D only",
    optionB: "B and C only",
    optionC: "C and D only",
    optionD: "D and E only",
    correctOption: "C",
    explanation: "Sleep-wake cycle is regulated by Melatonin (Pineal gland, C) and immune development by Thymosin (Thymus gland, D)."
  },
  {
    subject: "Biology",
    questionText: "In cockroach, excretion is brought about by:\nA. Phallic gland\nB. Urecose gland\nC. Nephrocytes\nD. Fat body\nE. Collaterial glands\nChoose the correct option:",
    optionA: "A and E only",
    optionB: "A, B and E only",
    optionC: "B, C and D only",
    optionD: "B and D only",
    correctOption: "C",
    explanation: "Malpighian tubules, Urecose glands, Nephrocytes, and Fat body assist in excretion in cockroaches."
  },
  {
    subject: "Biology",
    questionText: "The parts of human brain that help in regulation of sexual behaviour, expression of excitement, pleasure, rage, fear etc. are:",
    optionA: "Limbic system & hypothalamus",
    optionB: "Corpora quadrigemina & hippocampus",
    optionC: "Brain stem & epithalamus",
    optionD: "Corpus callosum and thalamus",
    correctOption: "A",
    explanation: "Limbic system along with hypothalamus regulates emotional reactions (excitement, pleasure, rage, fear) and sexual behaviour."
  },
  {
    subject: "Biology",
    questionText: "Match List 1 with List 2 (Animal Tissues):\nList 1:\nA. Mast cells, B. Inner surface of bronchiole, C. Blood, D. Tubular parts of nephron\nList 2:\nI. Ciliated epithelium, II. Areolar connective tissue, III. Cuboidal epithelium, IV. Specialised fluid connective tissue\nChoose the correct option:",
    optionA: "A-I, B-II, C-IV, D-III",
    optionB: "A-II, B-III, C-I, D-IV",
    optionC: "A-II, B-I, C-IV, D-III",
    optionD: "A-III, B-IV, C-II, D-I",
    correctOption: "C",
    explanation: "Mast cells = Areolar tissue (II), Bronchiole lining = Ciliated epithelium (I), Blood = Fluid connective tissue (IV), Nephron tubules = Cuboidal epithelium (III)."
  },
  {
    subject: "Biology",
    questionText: "Match List 1 with List 2 (Population Ecology):\nList 1:\nA. Logistic growth, B. Exponential growth, C. Expanding age pyramid, D. Stable age pyramid\nList 2:\nI. Unlimited resource availability, II. Limited resource availability, III. Percent of pre-reproductive is largest, IV. Percent of pre-reproductive and reproductive are same\nChoose the correct option:",
    optionA: "A-II, B-I, C-III, D-IV",
    optionB: "A-II, B-III, C-I, D-IV",
    optionC: "A-II, B-IV, C-I, D-III",
    optionD: "A-II, B-IV, C-III, D-I",
    correctOption: "A",
    explanation: "Logistic = Limited resources (II), Exponential = Unlimited resources (I), Expanding = Broad base with maximum pre-reproductives (III), Stable = Bell-shaped (IV)."
  },
  {
    subject: "Biology",
    questionText: "Which of the following statements are correct regarding regulation of kidney function?\nA. Excessive loss of body fluid switches off osmoreceptors.\nB. ADH facilitates water reabsorption to prevent diuresis.\nC. ANF causes vasodilation.\nD. ADH causes increase in blood pressure.\nE. ADH is responsible for decrease in GFR.\nChoose the correct option:",
    optionA: "B, C and D only",
    optionB: "A and B only",
    optionC: "A, B and E only",
    optionD: "C, D and E only",
    correctOption: "A",
    explanation: "ADH prevents diuresis (B), constricts vessels to raise BP and GFR (D). ANF dilates vessels (C)."
  },
  {
    subject: "Biology",
    questionText: "Given below are two statements:\nStatement 1: During $G_0$ phase of cell cycle, the cell is metabolically inactive.\nStatement 2: The centrosome undergoes duplication during S phase of interphase.\nChoose the correct option:",
    optionA: "Both Statements 1 and 2 are correct",
    optionB: "Both statements 1 and 2 are incorrect",
    optionC: "Statement 1 is correct, but Statement 2 is incorrect",
    optionD: "Statement 1 is incorrect, but Statement 2 is correct",
    correctOption: "D",
    explanation: "Cells in $G_0$ are metabolically active but quiescent (do not proliferate). Centrosome duplicates in cytoplasm during S phase."
  },
  {
    subject: "Biology",
    questionText: "Select the correct statements regarding meiosis:\nA. Tetrad formation is seen during Leptotene.\nB. During Anaphase, centromeres split and chromatids separate.\nC. Terminalization takes place during Pachytene.\nD. Nucleolus, Golgi complex and ER are reformed during Telophase.\nE. Crossing over takes place between sister chromatids of homologous chromosome.\nChoose the correct option:",
    optionA: "A and C only",
    optionB: "B and D only",
    optionC: "A, C and E only",
    optionD: "B and E only",
    correctOption: "B",
    explanation: "Centromeres split in Anaphase II (B), organelles reform in Telophase (D). Crossing over is between non-sister chromatids, tetrads in Zygotene, terminalisation in Diakinesis."
  },
  {
    subject: "Biology",
    questionText: "Which one of the following is NOT an advantage of inbreeding?",
    optionA: "It decreases homozygosity.",
    optionB: "It exposes harmful recessive genes that are eliminated by selection.",
    optionC: "Elimination of less desirable genes and accumulation of superior genes takes place due to it.",
    optionD: "It increases homozygosity for purelines.",
    correctOption: "A",
    explanation: "Inbreeding increases homozygosity (does not decrease it)."
  },
  {
    subject: "Biology",
    questionText: "Which of the following is characteristic feature of male cockroach regarding sexual dimorphism?",
    optionA: "Dark brown body colour and anal cerci",
    optionB: "Presence of anal styles (caudal styles) on 9th sternite",
    optionC: "Presence of sclerites",
    optionD: "Boat shaped 7th sternum",
    correctOption: "B",
    explanation: "Male cockroaches possess a pair of short, thread-like anal styles on the 9th sternite, absent in females."
  },
  {
    subject: "Biology",
    questionText: "If the sequence on mRNA formed is $5'\\text{-AUCGAUCGAUCGAUCGAUCG AUCG AUCG-3'}$, what is the sequence on corresponding coding strand (sense strand)?",
    optionA: "$5'\\text{-UAGCUAGCUAGCUAGCUA GCUAGC UAGC-3'}$",
    optionB: "$3'\\text{-UAGCUAGCUAGCUAGCUA GCUAGCUAGC-5'}$",
    optionC: "$5'\\text{-ATCGATCGATCGATCGATCG ATCGATCG-3'}$",
    optionD: "$3'\\text{-ATCGATCGATCGATCGATCG ATCGATCG-5'}$",
    correctOption: "C",
    explanation: "The coding strand sequence is identical to mRNA in the $5'\\to 3'$ direction with Thymine (T) in place of Uracil (U)."
  },
  {
    subject: "Biology",
    questionText: "Which of the following statements are correct regarding skeletal muscle?\nA. Muscle bundles are held together by collagenous connective tissue layer called fascicle.\nB. Sarcoplasmic reticulum of muscle fibre is a store house of calcium ions.\nC. Striated appearance of skeletal muscle fibre is due to distribution pattern of actin and myosin proteins.\nD. M line is considered as functional unit of contraction called sarcomere.\nChoose the correct option:",
    optionA: "B and C only",
    optionB: "A, B and C only",
    optionC: "A, C and D only",
    optionD: "C and D only",
    correctOption: "A",
    explanation: "Sarcoplasmic reticulum stores $\\text{Ca}^{2+}$ (B), striations are from alternate actin and myosin bands (C). Sarcomere (between two Z-lines) is the functional unit."
  }
];

async function seedNeetPaper() {
  console.log(`🚀 Compiling NEET 2023 Paper JSON with ${rawQuestions.length} complete questions...`);

  const paperData = {
    examName: "NEET",
    year: 2023,
    shiftName: "NEET 2023",
    examDate: "2023-05-07T14:00:00Z",
    totalMarks: 720,
    totalQuestions: 180,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'NEET 2023.json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved NEET 2023 JSON to: ${jsonOutputPath}`);

  // Seed into Database
  console.log(`🌱 Seeding NEET Exam and Shift into Database via Prisma...`);
  
  let exam = await prisma.exam.findFirst({
    where: { name: "NEET" }
  });

  if (!exam) {
    exam = await prisma.exam.create({
      data: { name: "NEET" }
    });
    console.log(`Created new Exam "NEET" (ID: ${exam.id})`);
  } else {
    console.log(`Found existing Exam "NEET" (ID: ${exam.id})`);
  }

  // Delete existing shift if present to ensure fresh import
  const existingShift = await prisma.shift.findFirst({
    where: {
      examId: exam.id,
      name: "NEET 2023"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "NEET 2023",
      date: new Date("2023-05-07T14:00:00Z")
    }
  });
  console.log(`Created Shift "NEET 2023" (ID: ${shift.id})`);

  console.log(`Inserting ${rawQuestions.length} questions in exact 1..200 sequence...`);
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
        positiveMarks: 4,
        negativeMarks: -1
      }
    });
  }

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for NEET 2023 in PostgreSQL!`);
}

seedNeetPaper()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
