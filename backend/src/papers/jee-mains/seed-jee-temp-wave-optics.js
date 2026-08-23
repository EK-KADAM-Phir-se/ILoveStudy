require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const prisma = require('../../lib/prisma');

// ── 25 PHYSICS WAVE OPTICS QUESTIONS ──
const physicsQuestions = [
  // ── BYJU'S (Q1 - Q10) ──
  {
    subject: "Physics",
    questionText: "In Young’s double-slit experiment with slit separation 0.1 mm, one observes a bright fringe at angle 1/40 rad by using the light of wavelength $\\lambda_1$. When the light of wavelength $\\lambda_2$ is used a bright fringe is seen at the same angle in the same setup. Given that $\\lambda_1$ and $\\lambda_2$ are in the visible range (380 nm to 740 nm), their values are:\n\n**Solution & Detailed Explanation:**\nPath difference = $d \\sin\\theta \\approx d \\theta = (0.1\\text{ mm})(1/40) = 2.5 \\times 10^{-3}\\text{ mm} = 2500\\text{ nm}$.\nFor bright fringes: Path difference = $n \\lambda$.\nSo, $2500 = n \\lambda_1 = m \\lambda_2$.\nFor $n = 4, m = 5$:\n$\\lambda_1 = 2500 / 4 = 625\\text{ nm}$\n$\\lambda_2 = 2500 / 5 = 500\\text{ nm}$.\nCorrect Answer: (b) 625 nm, 500 nm.",
    imageUrl: null,
    optionA: "(a) 400 nm, 500 nm",
    optionB: "(b) 625 nm, 500 nm",
    optionC: "(c) 380 nm, 525 nm",
    optionD: "(d) 380 nm, 500 nm",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In Young’s double-slit experiment, the path difference, at a certain point on the screen, between two interfering waves is $(1/8)^{\\text{th}}$ of wavelength. The ratio of the intensity at this point to that at the centre of a bright fringe is close to:\n\n**Solution & Detailed Explanation:**\nPhase difference between two waves: $\\Delta\\phi = \\frac{2\\pi}{\\lambda} \\times \\Delta x = \\frac{2\\pi}{\\lambda} \\times \\frac{\\lambda}{8} = \\frac{\\pi}{4}$.\nIntensity $I = I_0 \\cos^2(\\Delta\\phi / 2) = I_0 \\cos^2(\\pi/8) = I_0 \\left[ \\frac{1 + \\cos(\\pi/4)}{2} \\right] = I_0 \\left[ \\frac{1 + 1/\\sqrt{2}}{2} \\right] \\approx 0.85 I_0$.\nCorrect Answer: (c) 0.85.",
    imageUrl: null,
    optionA: "(a) 0.80",
    optionB: "(b) 0.94",
    optionC: "(c) 0.85",
    optionD: "(d) 0.74",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In a double-slit experiment, green light (5303 Å) falls on a double slit having a separation of 19.44 m and a width of 4.05 m. The number of bright fringes between the first and the second diffraction minima is:\n\n**Solution & Detailed Explanation:**\n$\\lambda_g = 5303\\text{ Å}, d = 19.44\\text{ m}, a = 4.05\\text{ m}$.\nDiffraction minima positions: $y_1 = D\\lambda / a$, $y_2 = 2D\\lambda / a$.\nDistance between first and second minima: $y_2 - y_1 = D\\lambda / a$.\nFringe width $\\beta = D\\lambda / d$.\nNumber of bright fringes = $(y_2 - y_1) / \\beta = \\frac{D\\lambda / a}{D\\lambda / d} = \\frac{d}{a} = \\frac{19.44}{4.05} = 5$.\nCorrect Answer: (c) 05.",
    imageUrl: null,
    optionA: "(a) 10",
    optionB: "(b) 04",
    optionC: "(c) 05",
    optionD: "(d) 09",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In an interference experiment the ratio of amplitudes of coherent waves is $(a_1 / a_2) = (1/3)$. The ratio of maximum and minimum intensities of fringes will be:\n\n**Solution & Detailed Explanation:**\n$\\frac{a_1}{a_2} = \\frac{1}{3}$.\n$I_{\\text{max}} \\propto (a_1 + a_2)^2$, $I_{\\text{min}} \\propto (a_1 - a_2)^2$.\n$\\frac{I_{\\text{max}}}{I_{\\text{min}}} = \\frac{(a_1 + a_2)^2}{(a_1 - a_2)^2} = \\frac{(1 + 1/3)^2}{(1 - 1/3)^2} = \\frac{(4/3)^2}{(2/3)^2} = 4$.\nCorrect Answer: (a) 4.",
    imageUrl: null,
    optionA: "(a) 4",
    optionB: "(b) 9",
    optionC: "(c) 2",
    optionD: "(d) 18",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Calculate the limit of resolution of a telescope objective having a diameter of 200 cm, if it has to detect light of wavelength 500 nm coming from a star.\n\n**Solution & Detailed Explanation:**\nLimit of resolution $\\Delta\\theta = \\frac{1.22 \\lambda}{a} = \\frac{1.22 \\times 500 \\times 10^{-9}}{200 \\times 10^{-2}} = 3.05 \\times 10^{-7}\\text{ rad} = 305 \\times 10^{-9}\\text{ rad}$.\nCorrect Answer: (d) $305 \\times 10^{-9}\\text{ radian}$.",
    imageUrl: null,
    optionA: "(a) $610 \\times 10^{-9}\\text{ radian}$",
    optionB: "(b) $152.5 \\times 10^{-9}\\text{ radian}$",
    optionC: "(c) $457.5 \\times 10^{-9}\\text{ radian}$",
    optionD: "(d) $305 \\times 10^{-9}\\text{ radian}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In Young’s double-slit experiment, the ratio of the slit’s width is 4 : 1. The ratio of the intensity of maxima to minima, close to the central fringe on the screen, will be:\n\n**Solution & Detailed Explanation:**\nSlit width ratio $w_1 / w_2 = 4 : 1 \\implies I_1 / I_2 = 4 : 1 \\implies I_1 = 4I_0, I_2 = I_0$.\n$I_{\\text{max}} = (\\sqrt{I_1} + \\sqrt{I_2})^2 = (2\\sqrt{I_0} + \\sqrt{I_0})^2 = 9I_0$.\n$I_{\\text{min}} = (\\sqrt{I_1} - \\sqrt{I_2})^2 = (2\\sqrt{I_0} - \\sqrt{I_0})^2 = I_0$.\n$\\frac{I_{\\text{max}}}{I_{\\text{min}}} = \\frac{9}{1}$.\nCorrect Answer: (b) 9 : 1.",
    imageUrl: null,
    optionA: "(a) $(\\sqrt{3} + 1)^4 : 16$",
    optionB: "(b) 9 : 1",
    optionC: "(c) 25 : 9",
    optionD: "(d) 4 : 1",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In Young’s double-slit experiment, slits are separated by 0.5 mm and the screen is placed 150 cm away. A beam of light consisting of two wavelengths, 650 nm and 520 nm, is used to obtain interference fringes on the screen. The least distance from the common central maximum to the point where the bright fringes due to both the wavelengths coincide is:\n\n**Solution & Detailed Explanation:**\nCondition for coincidence: $m \\lambda_1 = n \\lambda_2 \\implies \\frac{m}{n} = \\frac{\\lambda_2}{\\lambda_1} = \\frac{520}{650} = \\frac{4}{5}$.\nSo $m = 4, n = 5$.\nDistance $y = \\frac{m \\lambda_1 D}{d} = \\frac{4 \\times 650 \\times 10^{-9} \\times 1.5}{0.5 \\times 10^{-3}} = 7.8 \\times 10^{-3}\\text{ m} = 7.8\\text{ mm}$.\nCorrect Answer: (b) 7.8 mm.",
    imageUrl: null,
    optionA: "(a) 1.56 mm",
    optionB: "(b) 7.8 mm",
    optionC: "(c) 9.75 mm",
    optionD: "(d) 15.6 mm",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A single slit of width b is illuminated by coherent monochromatic light of wavelength $\\lambda$. If the second and fourth minima in the diffraction pattern at a distance 1 m from the slit are at 3 cm and 6 cm, respectively from the central maximum, what is the width of the central maximum?\n\n**Solution & Detailed Explanation:**\nSingle slit diffraction minima: $b \\sin\\theta = n \\lambda \\implies b \\frac{y_n}{D} = n \\lambda$.\nFor $n = 2: b \\frac{y_1}{D} = 2\\lambda$.\nFor $n = 4: b \\frac{y_2}{D} = 4\\lambda$.\nSubtracting: $(y_2 - y_1) \\frac{b}{D} = 2\\lambda \\implies (6 - 3)\\text{ cm} \\frac{b}{D} = 2\\lambda \\implies \\frac{\\lambda D}{b} = 1.5\\text{ cm}$.\nWidth of central maximum = $2 \\frac{\\lambda D}{b} = 2 \\times 1.5\\text{ cm} = 3.0\\text{ cm}$.\nCorrect Answer: (d) 3.0 cm.",
    imageUrl: null,
    optionA: "(a) 6.0 cm",
    optionB: "(b) 1.5 cm",
    optionC: "(c) 4.5 cm",
    optionD: "(d) 3.0 cm",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Unpolarized light of intensity $I_0$ is incident on the surface of a block of glass at Brewster’s angle. In that case, which one of the following statements is true?\n\n**Solution & Detailed Explanation:**\nAt Brewster's angle $i = \\tan^{-1}(\\mu)$, reflected light is completely plane-polarized perpendicular to plane of incidence. Since only a fraction of s-polarized component is reflected, reflected light intensity is less than $I_0/2$.\nCorrect Answer: (c) The reflected light is completely polarized with intensity less than $I_0/2$.",
    imageUrl: null,
    optionA: "(a) Transmitted light is partially polarized with intensity $I_0/2$",
    optionB: "(b) Transmitted light is completely polarized with intensity less than $I_0/2$",
    optionC: "(c) The reflected light is completely polarized with intensity less than $I_0/2$",
    optionD: "(d) The reflected light is partially polarized with intensity $I_0/2$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A beam of unpolarized light of intensity $I_0$ is passed through a polaroid A and then through another polaroid B which is oriented so that its principal plane makes an angle of $45^\\circ$ relative to that of A. The intensity of the emergent light is:\n\n**Solution & Detailed Explanation:**\nAfter Polaroid A: $I_1 = I_0 / 2$.\nBy Malus Law, after Polaroid B: $I_2 = I_1 \\cos^2(45^\\circ) = (I_0 / 2) \\times \\left(\\frac{1}{\\sqrt{2}}\\right)^2 = \\frac{I_0}{4}$.\nCorrect Answer: (d) $I_0 / 4$.",
    imageUrl: null,
    optionA: "(a) $I_0 / 8$",
    optionB: "(b) $I_0$",
    optionC: "(c) $I_0 / 2$",
    optionD: "(d) $I_0 / 4$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },

  // ── 2021 MARCH (Q11 - Q13) ──
  {
    subject: "Physics",
    questionText: "A fringe width of 6 mm was produced for two slits separated by 1 mm apart. The screen is placed 10 m away. The wavelength of light used is 'x' nm. The value of 'x' to the nearest integer is ____\n\n**Solution & Detailed Explanation:**\nFringe width $\\beta = \\frac{\\lambda D}{d} \\implies 6 \\times 10^{-3} = \\frac{\\lambda \\times 10}{1 \\times 10^{-3}} \\implies \\lambda = 600 \\times 10^{-9}\\text{ m} = 600\\text{ nm}$.\nCorrect Answer: 600.",
    imageUrl: null,
    optionA: null,
    optionB: null,
    optionC: null,
    optionD: null,
    correctOption: "600",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "In Young's double slit arrangement, slits are separated by a gap of 0.5 mm, and the screen is placed at a distance of 0.5 m from them. The distance between the first and the third bright fringe formed when the slits are illuminated by a monochromatic light of 5890 Å is :-\n\n**Solution & Detailed Explanation:**\nDistance between 1st and 3rd bright fringe = $2 \\beta = 2 \\frac{\\lambda D}{d} = 2 \\frac{5890 \\times 10^{-10} \\times 0.5}{0.5 \\times 10^{-3}} = 1178 \\times 10^{-6}\\text{ m}$.\nCorrect Answer: (2) $1178 \\times 10^{-6}\\text{ m}$.",
    imageUrl: null,
    optionA: "(1) $1178 \\times 10^{-9}\\text{ m}$",
    optionB: "(2) $1178 \\times 10^{-6}\\text{ m}$",
    optionC: "(3) $1178 \\times 10^{-12}\\text{ m}$",
    optionD: "(4) $5890 \\times 10^{-7}\\text{ m}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The speed of electrons in a scanning electron microscope is $1 \\times 10^7\\text{ ms}^{-1}$. If the protons having the same speed are used instead of electrons, then the resolving power of scanning proton microscope will be changed by a factor of:\n\n**Solution & Detailed Explanation:**\nResolving power $\\text{RP} \\propto \\frac{1}{\\lambda} \\propto p = m v$.\nSince speed $v$ is constant, $\\text{RP} \\propto m$.\n$\\frac{\\text{RP}_p}{\\text{RP}_e} = \\frac{m_p}{m_e} = 1837$.\nCorrect Answer: (1) 1837.",
    imageUrl: null,
    optionA: "(1) 1837",
    optionB: "(2) $1 / 1837$",
    optionC: "(3) $\\sqrt{1837}$",
    optionD: "(4) $1 / \\sqrt{1837}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },

  // ── 2022 JULY (Q14 - Q18) ──
  {
    subject: "Physics",
    questionText: "In Young’s double slit experiment, the fringe width is 12mm. If the entire arrangement is placed in water of refractive index 4/3, then the fringe width becomes (in mm):\n\n**Solution & Detailed Explanation:**\nFringe width in medium: $\\beta_{\\text{med}} = \\frac{\\beta_{\\text{air}}}{\\mu} = \\frac{12}{4/3} = 9\\text{ mm}$.\nCorrect Answer: (B) 9.",
    imageUrl: null,
    optionA: "(A) 16",
    optionB: "(B) 9",
    optionC: "(C) 48",
    optionD: "(D) 12",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Two beams of light having intensities I and 4I interfere to produce a fringe pattern on a screen. The phase difference between the two beams are $\\pi/2$ and $\\pi/3$ at points A and B respectively. The difference between the resultant intensities at the two points is xI. The value of x will be _____\n\n**Solution & Detailed Explanation:**\nResultant intensity: $I_R = I_1 + I_2 + 2\\sqrt{I_1 I_2}\\cos\\phi = I + 4I + 4I\\cos\\phi = 5I + 4I\\cos\\phi$.\nAt point A ($\\phi = \\pi/2$): $I_A = 5I + 4I\\cos(\\pi/2) = 5I$.\nAt point B ($\\phi = \\pi/3$): $I_B = 5I + 4I\\cos(\\pi/3) = 5I + 4I(1/2) = 7I$.\nDifference: $I_B - I_A = 7I - 5I = 2I \\implies x = 2$.\nCorrect Answer: 2.",
    imageUrl: null,
    optionA: null,
    optionB: null,
    optionC: null,
    optionD: null,
    correctOption: "2",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Two coherent sources of light interfere. The intensity ratio of two sources is 1 : 4. For this interference pattern if the value of $\\frac{I_{\\text{max}} + I_{\\text{min}}}{I_{\\text{max}} - I_{\\text{min}}}$ is equal to $\\frac{2\\alpha + 1}{\\beta + 3}$, then $\\frac{\\alpha}{\\beta}$ will be:\n\n**Solution & Detailed Explanation:**\n$\\frac{I_1}{I_2} = \\frac{1}{4} \\implies \\sqrt{I_2} = 2\\sqrt{I_1}$.\n$I_{\\text{max}} = (\\sqrt{I_1} + \\sqrt{I_2})^2 = 9 I_1$.\n$I_{\\text{min}} = (\\sqrt{I_2} - \\sqrt{I_1})^2 = I_1$.\n$\\frac{I_{\\text{max}} + I_{\\text{min}}}{I_{\\text{max}} - I_{\\text{min}}} = \\frac{10I_1}{8I_1} = \\frac{5}{4} = \\frac{2(2) + 1}{1 + 3} \\implies \\alpha = 2, \\beta = 1$.\n$\\frac{\\alpha}{\\beta} = \\frac{2}{1} = 2$.\nCorrect Answer: (B) 2.",
    imageUrl: null,
    optionA: "(A) 1.5",
    optionB: "(B) 2",
    optionC: "(C) 0.5",
    optionD: "(D) 1",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In a Young’s double slit experiment, a laser light of 560 nm produces an interference pattern with consecutive bright fringes’ separation of 7.2 mm. Now another light is used to produce an interference pattern with consecutive bright fringes’ separation of 8.1 mm. The wavelength of second light is _____ nm.\n\n**Solution & Detailed Explanation:**\nFringe width $\\beta \\propto \\lambda \\implies \\frac{\\beta_2}{\\beta_1} = \\frac{\\lambda_2}{\\lambda_1} \\implies \\lambda_2 = 560 \\times \\frac{8.1}{7.2} = 560 \\times \\frac{9}{8} = 630\\text{ nm}$.\nCorrect Answer: 630.",
    imageUrl: null,
    optionA: null,
    optionB: null,
    optionC: null,
    optionD: null,
    correctOption: "630",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "An unpolarised light beam of intensity $2I_0$ is passed through a polaroid P and then through another polaroid Q which is oriented in such a way that its passing axis makes an angle of $30^\\circ$ relative to that of P. The intensity of the emergent light is:\n\n**Solution & Detailed Explanation:**\nAfter Polaroid P: $I_1 = \\frac{2I_0}{2} = I_0$.\nAfter Polaroid Q (Malus Law): $I_2 = I_1 \\cos^2(30^\\circ) = I_0 \\left(\\frac{\\sqrt{3}}{2}\\right)^2 = \\frac{3}{4} I_0$.\nCorrect Answer: (C) $3I_0 / 4$.",
    imageUrl: null,
    optionA: "(A) $I_0 / 4$",
    optionB: "(B) $I_0 / 2$",
    optionC: "(C) $3I_0 / 4$",
    optionD: "(D) $3I_0 / 2$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },

  // ── 2023 APRIL (Q19 - Q24) ──
  {
    subject: "Physics",
    questionText: "A beam of light consisting of two wavelengths 7000 Å and 5500 Å is used to obtain interference pattern in Young's double slit experiment. The distance between the slits is 2.5 mm and the distance between the plane of slits and the screen is 150 cm. The least distance from the central fringe, where the bright fringes due to both the wavelengths coincide, is $n \\times 10^{-5}\\text{ m}$. The value of n is _____.\n\n**Solution & Detailed Explanation:**\nPath difference $n \\lambda_1 = m \\lambda_2 \\implies 7000 n = 5500 m \\implies 14n = 11m \\implies n = 11, m = 14$.\nDistance $y = \\frac{n \\lambda_1 D}{d} = \\frac{11 \\times 7000 \\times 10^{-10} \\times 1.5}{2.5 \\times 10^{-3}} = 4.62 \\times 10^{-3}\\text{ m} = 462 \\times 10^{-5}\\text{ m}$.\nSo $n = 462$.\nCorrect Answer: 462.",
    imageUrl: null,
    optionA: null,
    optionB: null,
    optionC: null,
    optionD: null,
    correctOption: "462",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "The width of fringe is 2 mm on the screen in a double slit experiment for the light of wavelength of 400 nm. The width of the fringe for the light of wavelength 600 nm will be:\n\n**Solution & Detailed Explanation:**\nFringe width $\\beta \\propto \\lambda \\implies \\frac{\\beta'}{\\beta} = \\frac{\\lambda'}{\\lambda} \\implies \\beta' = 2 \\times \\frac{600}{400} = 3\\text{ mm}$.\nCorrect Answer: (4) 3 mm.",
    imageUrl: null,
    optionA: "(1) 4 mm",
    optionB: "(2) 2 mm",
    optionC: "(3) 1.33 mm",
    optionD: "(4) 3 mm",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Unpolarised light of intensity $32\\text{ W m}^{-2}$ passes through the combination of three polaroids such that the pass axis of the last polaroids is perpendicular to that of the pass axis of first polaroids. If intensity of emerging light is $3\\text{ W m}^{-2}$, then the angle between pass axis of first two polaroids is _____$^\\circ$.\n\n**Solution & Detailed Explanation:**\n$I_1 = 32 / 2 = 16\\text{ W m}^{-2}$.\n$I_3 = I_1 \\cos^2\\theta \\cos^2(90^\\circ - \\theta) = 16 \\cos^2\\theta \\sin^2\\theta = 4 \\sin^2(2\\theta)$.\nGiven $I_3 = 3 \\implies 4 \\sin^2(2\\theta) = 3 \\implies \\sin(2\\theta) = \\frac{\\sqrt{3}}{2} \\implies 2\\theta = 60^\\circ \\implies \\theta = 30^\\circ$.\nCorrect Answer: 30.",
    imageUrl: null,
    optionA: null,
    optionB: null,
    optionC: null,
    optionD: null,
    correctOption: "30",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "The ratio of intensities at two points P and Q on the screen in a Young's double slit experiment where phase difference between two waves of same amplitude are $\\pi/3$ and $\\pi/2$, respectively are:\n\n**Solution & Detailed Explanation:**\nIntensity $I = 4 I_0 \\cos^2(\\phi/2)$.\nAt P ($\\phi = \\pi/3$): $I_P = 4 I_0 \\cos^2(\\pi/6) = 4 I_0 (3/4) = 3 I_0$.\nAt Q ($\\phi = \\pi/2$): $I_Q = 4 I_0 \\cos^2(\\pi/4) = 4 I_0 (1/2) = 2 I_0$.\nRatio $I_P / I_Q = 3 / 2$.\nCorrect Answer: (4) 3 : 2.",
    imageUrl: null,
    optionA: "(1) 2 : 3",
    optionB: "(2) 1 : 3",
    optionC: "(3) 3 : 1",
    optionD: "(4) 3 : 2",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In a Young’s double slit experiment, the ratio of amplitude of light coming from slits is 2 : 1. The ratio of the maximum to minimum intensity in the interference pattern is:\n\n**Solution & Detailed Explanation:**\n$\\frac{A_1}{A_2} = \\frac{2}{1}$.\n$\\frac{I_{\\text{max}}}{I_{\\text{min}}} = \\frac{(A_1 + A_2)^2}{(A_1 - A_2)^2} = \\frac{(2 + 1)^2}{(2 - 1)^2} = \\frac{9}{1}$.\nCorrect Answer: (4) 9 : 1.",
    imageUrl: null,
    optionA: "(1) 9 : 4",
    optionB: "(2) 25 : 9",
    optionC: "(3) 2 : 1",
    optionD: "(4) 9 : 1",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A single slit of width a is illuminated by a monochromatic light of wavelength 600 nm. The value of a for which first minimum appears at $\\theta = 30^\\circ$ on the screen will be:\n\n**Solution & Detailed Explanation:**\nFirst diffraction minimum: $a \\sin\\theta = \\lambda \\implies a \\sin(30^\\circ) = 600\\text{ nm} \\implies a (0.5) = 600\\text{ nm} \\implies a = 1200\\text{ nm} = 1.2\\text{ }\\mu\\text{m}$.\nCorrect Answer: (1) $1.2\\text{ }\\mu\\text{m}$.",
    imageUrl: null,
    optionA: "(1) $1.2\\text{ }\\mu\\text{m}$",
    optionB: "(2) $3\\text{ }\\mu\\text{m}$",
    optionC: "(3) $1.8\\text{ }\\mu\\text{m}$",
    optionD: "(4) $0.6\\text{ }\\mu\\text{m}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In a Young's double slit experiment, the distance between the two identical slits is 6.1 times larger than the slit width. Then the number of intensity maxima observed within the central maximum of the single slit diffraction pattern is :\n\n**Solution & Detailed Explanation:**\nIn a double slit experiment, the bright spots (maxima) from interference are found where:\n$$d \\sin\\theta = m \\lambda$$\nwhere $m$ can be $0, \\pm 1, \\pm 2, \\dots$.\n\nThe dark spots (minima) from single slit diffraction appear at:\n$$a \\sin\\theta = \\pm \\lambda$$\n\nFor a bright interference fringe to be inside the central bright area of the single slit (central maximum), it must fall between these two first diffraction minima.\n\nThis means we need:\n$$-\\lambda < d \\sin\\theta < \\lambda \\implies -\\frac{d}{a} < m < \\frac{d}{a}$$\n\nGiven that $d = 6.1 a$, we get:\n$$-6.1 < m < 6.1$$\n\nThe integer values of $m$ are $m = \\pm 1, \\pm 2, \\pm 3, \\pm 4, \\pm 5, \\pm 6$.\nThis gives 6 bright spots on one side and 6 bright spots on the other side, making a total of 12 bright interference maxima within the central diffraction envelope.\n\nCorrect Answer: (C) 12.",
    imageUrl: null,
    optionA: "3",
    optionB: "6",
    optionC: "12",
    optionD: "24",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  }
];

// ── 30 CHEMISTRY ALDEHYDES, KETONES & CARBOXYLIC ACIDS QUESTIONS (With Diagrams) ──
const chemistryQuestions = [
  {
    subject: "Chemistry",
    questionText: "Oxidation of toluene to benzaldehyde can be easily carried out with which of the following reagents?\n\n**Solution & Detailed Explanation:**\nChromyl chloride (Etard reaction) or chromic anhydride in acetic anhydride followed by hydrolysis oxidizes toluene to benzaldehyde. $CrO_3 / \\text{acetic anhydride, } H_2O$ is used to convert toluene to benzaldehyde.\nCorrect Answer: (b).",
    imageUrl: null,
    optionA: "(a) $CrO_3 / \\text{acetic acid}, H_3O^+$",
    optionB: "(b) $CrO_3 / \\text{acetic anhydride}, H_2O$",
    optionC: "(c) $KMnO_4 / HCl, H_3O^+$",
    optionD: "(d) $CO / HCl, \\text{anhydrous } AlCl_3$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List-I with List-II:\n\n**Solution & Detailed Explanation:**\n(A) Benzoyl chloride to benzaldehyde with $H_2, Pd-BaSO_4$ is Rosenmund reaction (IV).\n(B) $CH_3CN \\to CH_3CHO$ with $SnCl_2/HCl$ is Stephen reaction (III).\n(C) Toluene to benzaldehyde with $CrO_2Cl_2$ is Etard reaction (II).\n(D) Benzene to benzaldehyde with $CO, HCl, AlCl_3$ is Gatterman-Koch reaction (I).\nMatching: (A)-(IV), (B)-(III), (C)-(II), (D)-(I).\nCorrect Answer: (a).",
    imageUrl: "/images/chemistry/q2.png",
    optionA: "(a) (A)-(IV), (B)-(III), (C)-(II), (D)-(I)",
    optionB: "(b) (A)-(I), (B)-(II), (C)-(III), (D)-(IV)",
    optionC: "(c) (A)-(II), (B)-(III), (C)-(IV), (D)-(I)",
    optionD: "(d) (A)-(III), (B)-(II), (C)-(I), (D)-(IV)",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following reactions will yield benzaldehyde as a product?\n\n**Solution & Detailed Explanation:**\nReaction (A) converts Benzoic acid to Benzoyl chloride via $SOCl_2$, which on Rosenmund reduction ($H_2/Pd/BaSO_4$) gives Benzaldehyde.\nReaction (D) oxidizes toluene using $CrO_3$ in acetic anhydride followed by acid hydrolysis to yield Benzaldehyde.\nHence, reactions (A) and (D) yield benzaldehyde.\nCorrect Answer: (c) (A) and (D).",
    imageUrl: "/images/chemistry/q3.png",
    optionA: "(a) (B) and (C)",
    optionB: "(b) (C) and (D)",
    optionC: "(c) (A) and (D)",
    optionD: "(d) (A) and (C)",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Consider the above reaction and predict the major product:\n\n**Solution & Detailed Explanation:**\nDIBAL-H selectively reduces ester groups to aldehydes at low temperature while keeping aldehyde group intact.\nHere DIBAL-H reduces ester to aldehyde, forming $OHC-CH_2-CH_2-CH_2-CH_2-CHO$.\nCorrect Answer: (a) $OHC-CH_2-CH_2-CH_2-CH_2-CHO$.",
    imageUrl: "/images/chemistry/q4.png",
    optionA: "(a) $OHC-CH_2-CH_2-CH_2-CH_2-CHO$",
    optionB: "(b) $EtO-C(=O)-CH_2-CH_2-CH_2-CH_2-CHO$",
    optionC: "(c) $EtO-C(=O)-CH_2-CH_2-CH_2-CH_2-COOH$",
    optionD: "(d) $OHC-CH_2-CH_2-CH_2-CH_2-COOH$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The product 'P' in the above reaction is:\n\n**Solution & Detailed Explanation:**\nDIBAL-H at -78°C reduces lactone ester to hemiacetal/hydroxy-aldehyde product.\nCorrect Answer: (d).",
    imageUrl: "/images/chemistry/q5.png",
    optionA: "(a) Compound with CHO",
    optionB: "(b) Compound with COOH",
    optionC: "(c) Compound with O-C(=O)H",
    optionD: "(d) Hydroxy aldehyde product",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The major product of the reaction: $CH_3CH_2CH=CH_2 \\xrightarrow{H_2 / CO, \\text{Rh catalyst}}$ is:\n\n**Solution & Detailed Explanation:**\nHydroformylation (oxo process) converts terminal alkene $CH_3CH_2CH=CH_2$ into pentanal $CH_3CH_2CH_2CH_2CHO$.\nCorrect Answer: (a) $CH_3CH_2CH_2CH_2CHO$.",
    imageUrl: null,
    optionA: "(a) $CH_3CH_2CH_2CH_2CHO$",
    optionB: "(b) $CH_3CH_2C(CHO)=CH_2$",
    optionC: "(c) $CH_3CH_2CH_2CHO$",
    optionD: "(d) $CH_3CH_2CH=CH-CHO$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List-I with List-II:\n\n**Solution & Detailed Explanation:**\nMatching: (A)-(II), (B)-(III), (C)-(IV), (D)-(I).\nCorrect Answer: (b).",
    imageUrl: "/images/chemistry/q7.png",
    optionA: "(a) (A)-(II), (B)-(IV), (C)-(III), (D)-(I)",
    optionB: "(b) (A)-(II), (B)-(III), (C)-(IV), (D)-(I)",
    optionC: "(c) (A)-(III), (B)-(II), (C)-(I), (D)-(IV)",
    optionD: "(d) (A)-(IV), (B)-(II), (C)-(III), (D)-(I)",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The major aromatic product C in the reaction sequence will be:\n\n**Solution & Detailed Explanation:**\nRing opening of epoxide by HBr gives bromohydrin A, elimination with alc. KOH gives conjugated diene B, ozonolysis of B yields ortho-hydroxybenzaldehyde (salicylaldehyde) C.\nCorrect Answer: (a).",
    imageUrl: "/images/chemistry/q8.png",
    optionA: "(a) Salicylaldehyde (o-hydroxybenzaldehyde)",
    optionB: "(b) 4-hydroxybenzoic acid",
    optionC: "(c) Bromobenzaldehyde",
    optionD: "(d) Salicylic acid",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The correct match between List-I (starting material) and List-II (reagent) for the preparation of benzaldehyde is:\n\n**Solution & Detailed Explanation:**\n(A) Benzene to benzaldehyde: $CO, HCl, AlCl_3$ (III) [Gatterman-Koch].\n(B) Benzonitrile to benzaldehyde: $SnCl_2, HCl$ (I) [Stephen].\n(C) Benzoyl chloride to benzaldehyde: $H_2, Pd-BaSO_4$ (II) [Rosenmund].\nMatching: (A)-(III), (B)-(I), (C)-(II).\nCorrect Answer: (a).",
    imageUrl: "/images/chemistry/q9.png",
    optionA: "(a) (A)-(III), (B)-(I), (C)-(II)",
    optionB: "(b) (A)-(I), (B)-(II), (C)-(III)",
    optionC: "(c) (A)-(II), (B)-(III), (C)-(I)",
    optionD: "(d) (A)-(III), (B)-(II), (C)-(I)",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Product 'A' in the given reaction is:\n\n**Solution & Detailed Explanation:**\nMg reacts with Br to form Grignard reagent, which attacks intramolecularly on carbonyl to form cyclic tertiary alcohol.\nCorrect Answer: (d).",
    imageUrl: "/images/chemistry/q10.png",
    optionA: "(a) Open chain Grignard",
    optionB: "(b) Diol product",
    optionC: "(c) MgBr adduct",
    optionD: "(d) Bicyclic tertiary alcohol product",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Given below are two statements: One is labelled Assertion (A) and the other is labelled Reason (R):\n\n**Solution & Detailed Explanation:**\nWolff-Kishner reduction uses strong base ($KOH/NH_2NH_2$), which causes elimination of base-sensitive groups like chlorine (chloro group undergoes elimination). So Wolff-Kishner cannot be used for halo-ketones.\nThus Assertion (A) is false, but Reason (R) is true.\nCorrect Answer: (c) (A) is false but (R) is true.",
    imageUrl: "/images/chemistry/q11.png",
    optionA: "(a) Both (A) and (R) are true and (R) is correct explanation",
    optionB: "(b) Both (A) and (R) are true but (R) is NOT correct explanation",
    optionC: "(c) (A) is false but (R) is true",
    optionD: "(d) (A) is true but (R) is false",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The product formed in the following multi-step reaction is:\n\n**Solution & Detailed Explanation:**\n(i)-(ii) Hydroboration-oxidation of propene gives propan-1-ol ($CH_3CH_2CH_2OH$).\n(iii) PCC oxidation gives propanal ($CH_3CH_2CHO$).\n(iv)-(v) Reaction of propanal with $CH_3MgBr$ followed by hydrolysis gives $CH_3-CH_2-CH(OH)-CH_3$ (butan-2-ol).\nCorrect Answer: (a) $CH_3-CH_2-CH(OH)-CH_3$.",
    imageUrl: "/images/chemistry/q12.png",
    optionA: "(a) $CH_3-CH_2-CH(OH)-CH_3$",
    optionB: "(b) $CH_3-CH_2-CH_2-CH_2-OH$",
    optionC: "(c) $CH_3-CH_2-C(=O)-OCH_3$",
    optionD: "(d) $CH_3-C(OH)(CH_3)-CH_3$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "'A' and 'B' in the below reactions are:\n\n**Solution & Detailed Explanation:**\nOxidative cleavage of double bond by $KMnO_4, \\Delta$ gives dicarboxylic acid / keto-acid A.\nWolff-Kishner reduction ($NH_2NH_2/KOH$) converts carbonyl group to $-CH_2-$, leaving carboxylic acid intact to give B ($R-CH_2-CH_2-CH_2-COOH$).\nCorrect Answer: (d).",
    imageUrl: "/images/chemistry/q13.png",
    optionA: "(a) $A = R-CHO, B = R-CH_3$",
    optionB: "(b) $A = R-CHO, B = R-COOH$",
    optionC: "(c) $A = R-COOH, B = R-CONH_2$",
    optionD: "(d) $A = R-(C=O)-...-COOH, B = R-CH_2-...-COOH$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Given below are two statements: One is labelled Assertion (A) and the other is labelled Reason (R):\n\n**Solution & Detailed Explanation:**\nClemmensen reduction uses strong acid ($HCl$), which causes dehydration of secondary/tertiary alcohols. Therefore acid-sensitive alcohols cannot be reduced by Clemmensen reduction.\nAssertion (A) is false, but Reason (R) is true.\nCorrect Answer: (a) (A) is false but (R) is true.",
    imageUrl: "/images/chemistry/q14.png",
    optionA: "(a) (A) is false but (R) is true",
    optionB: "(b) (A) is true but (R) is false",
    optionC: "(c) Both (A) and (R) are true",
    optionD: "(d) Both (A) and (R) are false",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Find out the major products from the following reaction sequence:\n\n**Solution & Detailed Explanation:**\nReaction of chloro-ketone with $NaCN$ followed by alcoholysis gives ester A. Reaction of ester with excess Grignard reagent ($MeMgBr$) yields tertiary diol B.\nCorrect Answer: (b).",
    imageUrl: "/images/chemistry/q15.png",
    optionA: "(a) Cyano-alcohol and ester",
    optionB: "(b) Ester A and tertiary diol B",
    optionC: "(c) Amino-alcohol",
    optionD: "(d) Dicarboxylic acid",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List-I with List-II:\n\n**Solution & Detailed Explanation:**\nMatching: (A)-(III), (B)-(IV), (C)-(II), (D)-(I).\nCorrect Answer: (d) (A)-(III), (B)-(IV), (C)-(II), (D)-(I).",
    imageUrl: "/images/chemistry/q16.png",
    optionA: "(a) (A)-(II), (B)-(IV), (C)-(III), (D)-(I)",
    optionB: "(b) (A)-(IV), (B)-(I), (C)-(II), (D)-(III)",
    optionC: "(c) (A)-(III), (B)-(IV), (C)-(I), (D)-(II)",
    optionD: "(d) (A)-(III), (B)-(IV), (C)-(II), (D)-(I)",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The structures of major products A, B and C in the following reaction sequence are:\n\n**Solution & Detailed Explanation:**\nNucleophilic addition of $NaCN$ to ketone gives cyanohydrin A. $LiAlH_4$ reduction of nitrile gives amino-alcohol B. Acid hydrolysis gives hydroxy-carboxylic acid C.\nCorrect Answer: (d).",
    imageUrl: "/images/chemistry/q17.png",
    optionA: "(a) Amino acid derivatives",
    optionB: "(b) Lactam product",
    optionC: "(c) Dicarboxylic acid",
    optionD: "(d) Cyanohydrin A, Amino-alcohol B, Hydroxy-acid C",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The correct sequence of reagents for the preparation of Q and R is:\n\n**Solution & Detailed Explanation:**\nn-heptane undergoes aromatization with $Cr_2O_3$ at 770 K to give toluene (P). Controlled oxidation of toluene with $CrO_3/(CH_3CO)_2O$ followed by hydrolysis gives benzaldehyde (Q). Cannizzaro reaction of benzaldehyde with $NaOH$ gives benzyl alcohol and sodium benzoate (R).\nCorrect Answer: (a).",
    imageUrl: "/images/chemistry/q18.png",
    optionA: "(a) (i) $Cr_2O_3, 770\\text{ K}, 20\\text{ atm}$; (ii) $CrO_3, (CH_3CO)_2O$; (iii) $NaOH$; (iv) $H_3O^+$",
    optionB: "(b) (i) $CrO_2Cl_2$; (ii) $Cr_2O_3$; (iii) $NaOH$",
    optionC: "(c) (i) $KMnO_4$; (ii) $MoO_3$; (iii) $NaOH$",
    optionD: "(d) (i) $MoO_3, \\Delta$; (ii) $CrO_2Cl_2$; (iii) $NaOH$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "'A' in the given reaction is:\n\n**Solution & Detailed Explanation:**\nElectrophilic attack of proton on carbonyl followed by intramolecular cyclization yields a bicyclic lactone.\nCorrect Answer: (b).",
    imageUrl: "/images/chemistry/q19.png",
    optionA: "(a) Monocyclic ester",
    optionB: "(b) Bicyclic lactone",
    optionC: "(c) Open chain keto-acid",
    optionD: "(d) Hydroxy acid",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Major Product 'A' in the above reaction is:\n\n**Solution & Detailed Explanation:**\nIntramolecular Claisen condensation / aldol condensation of keto-ester in base yields 5-membered cyclic enone (1-acetylcyclopentene).\nCorrect Answer: (c) 1-acetylcyclopentene derivative.",
    imageUrl: "/images/chemistry/q20.png",
    optionA: "(a) 6-membered cyclic ketone",
    optionB: "(b) Open chain unsaturated ester",
    optionC: "(c) 5-membered acetylcyclopentene enone",
    optionD: "(d) Cyclooctanone derivative",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The correct order of acid character of the following compounds is:\n\n**Solution & Detailed Explanation:**\nElectron-withdrawing nitro group ($-NO_2$) increases acidity ($II > I$). Electron-releasing methyl ($-CH_3$) and hydroxy ($-OH$) groups decrease acidity. Hyperconjugation of $-CH_3$ vs resonance of $-OH$ makes $-OH$ stronger releasing, so acidity order: $II > I > III > IV$.\nCorrect Answer: (b) $II > I > III > IV$.",
    imageUrl: "/images/chemistry/q21.png",
    optionA: "(a) $III > II > I > IV$",
    optionB: "(b) $II > I > III > IV$",
    optionC: "(c) $I > II > III > IV$",
    optionD: "(d) $IV > III > II > I$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The structure of A in the given reaction is:\n\n**Solution & Detailed Explanation:**\nBase-catalyzed intramolecular alkylation (enolate displaces Br) yields a cyclopropane/cyclobutane fused ring ketone.\nCorrect Answer: (c).",
    imageUrl: "/images/chemistry/q22.png",
    optionA: "(a) Open chain hydroxy-alkene",
    optionB: "(b) Alcohol product",
    optionC: "(c) Cyclized enone product",
    optionD: "(d) Carboxylic acid",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The products formed in the following reaction are:\n\n**Solution & Detailed Explanation:**\nTollens' reagent selectively oxidizes the aldehyde group to carboxylic acid $A$. Subsequent reduction with $NaBH_4$ reduces remaining carbonyl/ester to alcohol $B$, yielding hydroxy-acid.\nCorrect Answer: (c).",
    imageUrl: "/images/chemistry/q23.png",
    optionA: "(a) Diol",
    optionB: "(b) Dicarboxylic acid",
    optionC: "(c) Hydroxy-carboxylic acid product",
    optionD: "(d) Dialdehyde",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Choose the correct product(s) for the following set of reactions:\n\n**Solution & Detailed Explanation:**\nGrignard addition followed by acid dehydration gives alkene T. Catalytic hydrogenation followed by allylic bromination and elimination yields conjugated diene product.\nCorrect Answer: (b).",
    imageUrl: "/images/chemistry/q24.png",
    optionA: "(a) Product S",
    optionB: "(b) Conjugated alkene product U",
    optionC: "(c) Halogenated product",
    optionD: "(d) Alcohol product",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which one of the following reactions does NOT represent correct combination of substrate and product under given condition?\n\n**Solution & Detailed Explanation:**\nSodium dichromate ($Na_2Cr_2O_7 / H_2SO_4$) is a strong oxidizing agent that oxidizes toluene directly to **Benzoic Acid**, NOT benzaldehyde.\nThus combination (d) is incorrect.\nCorrect Answer: (d).",
    imageUrl: "/images/chemistry/q25.png",
    optionA: "(a) Benzoyl chloride $\\to$ Benzaldehyde",
    optionB: "(b) Benzonitrile $\\to$ Benzaldehyde",
    optionC: "(c) Ethyl benzoate $\\to$ Benzaldehyde",
    optionD: "(d) Toluene + $Na_2Cr_2O_7 / H_2SO_4 \\to$ Benzaldehyde (Incorrect)",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "In the following sequence of reaction a compound A with straight chain structure gives a carboxylic acid:\n\n**Solution & Detailed Explanation:**\n$LiAlH_4$ reduction of ethyl butanoate cleaves ester to give $CH_3-CH_2-CH_2-CH_2OH$ (butan-1-ol) and ethanol. Oxidation of butan-1-ol gives $CH_3-CH_2-CH_2-COOH$ (butanoic acid).\nCorrect Answer: (c) $CH_3-CH_2-CH_2-CH_2OH$.",
    imageUrl: "/images/chemistry/q26.png",
    optionA: "(a) $CH_3-COO-CH_2-CH_2-CH_3$",
    optionB: "(b) $CH_3-CH_2-CH(OH)-CH_3$",
    optionC: "(c) $CH_3-CH_2-CH_2-CH_2OH$",
    optionD: "(d) $CH_3-CH_2-CH_2-OH$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "In the following reaction sequence the major products A and B are:\n\n**Solution & Detailed Explanation:**\nFriedel-Crafts acylation of benzene with phthalic anhydride using $AlCl_3$ gives o-benzoylbenzoic acid (A). Clemmensen reduction ($Zn-Hg/HCl$) followed by acid cyclization ($H_3PO_4$) yields anthrone/anthracene derivative (B).\nCorrect Answer: (a).",
    imageUrl: "/images/chemistry/q27.png",
    optionA: "(a) o-benzoylbenzoic acid (A) and anthracene derivative (B)",
    optionB: "(b) Phthalic acid",
    optionC: "(c) Benzoic acid",
    optionD: "(d) Benzophenone",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The major product formed in the following reaction is:\n\n**Solution & Detailed Explanation:**\n$LiBH_4$ is a selective reducing agent that reduces ester to primary alcohol without affecting hindered/aromatic esters.\nCorrect Answer: (c).",
    imageUrl: "/images/chemistry/q28.png",
    optionA: "(a) Diol product",
    optionB: "(b) Dicarboxylic acid",
    optionC: "(c) Hydroxy-ester product",
    optionD: "(d) Lactone product",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Compound(s) which will liberate carbon dioxide with sodium bicarbonate solution is/are:\n\n**Solution & Detailed Explanation:**\nCarboxylic acids ($Ph-COOH$) and strongly acidic phenols like 2,4,6-trinitrophenol (Picric acid, $pKa \\approx 0.38$) are stronger acids than carbonic acid ($H_2CO_3$), so they react with $NaHCO_3$ to release $CO_2$.\nThus (A) and (C) liberate $CO_2$.\nCorrect Answer: (c) (A) and (C) only.",
    imageUrl: "/images/chemistry/q29.png",
    optionA: "(a) A and B only",
    optionB: "(b) B only",
    optionC: "(c) A and C only",
    optionD: "(d) C only",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Among the following, the number of compounds which will give positive iodoform reaction is:\n\n**Solution & Detailed Explanation:**\nIodoform test is given by compounds containing $CH_3-C(=O)-$ group or $CH_3-CH(OH)-$ group.\n1. 1-Phenylbutan-2-one ($Ph-CH_2-CO-CH_2-CH_3$): Negative.\n2. 2-Methylbutan-2-ol ($CH_3-C(OH)(CH_3)-CH_2CH_3$): Tertiary alcohol, Negative.\n3. 3-Methylbutan-2-ol ($CH_3-CH(CH_3)-CH(OH)-CH_3$): Has $CH_3-CH(OH)-$, Positive (1).\n4. 1-Phenylethanol ($Ph-CH(OH)-CH_3$): Has $CH_3-CH(OH)-$, Positive (2).\n5. 3,3-dimethylbutan-2-one ($CH_3-C(=O)-C(CH_3)_3$): Has $CH_3-C(=O)-$, Positive (3).\n6. 1-Phenylpropan-2-ol ($Ph-CH_2-CH(OH)-CH_3$): Has $CH_3-CH(OH)-$, Positive (4).\nTotal positive compounds = 4.\nCorrect Answer: 4.",
    imageUrl: "/images/chemistry/q30.png",
    optionA: null,
    optionB: null,
    optionC: null,
    optionD: null,
    correctOption: "4",
    positiveMarks: 4,
    negativeMarks: 0
  }
];

const allQuestions = [...physicsQuestions, ...chemistryQuestions];

async function seedTempMasterPaper() {
  console.log(`🌱 Seeding JEE Main Master Paper (${allQuestions.length} Questions: ${physicsQuestions.length} Physics + ${chemistryQuestions.length} Chemistry with high-res structure diagrams)...`);

  const exam = await prisma.exam.findFirst({
    where: { name: "JEE Main" }
  });

  if (!exam) {
    console.error("❌ Exam 'JEE Main' not found in database!");
    process.exit(1);
  }

  // Clean old wave/topic shifts
  const existingWaveShifts = await prisma.shift.findMany({
    where: {
      examId: exam.id,
      name: { contains: "Wave Optics" }
    }
  });

  for (const s of existingWaveShifts) {
    console.log(`Removing old shift "${s.name}" (${s.id})...`);
    await prisma.shift.delete({ where: { id: s.id } });
  }

  const masterPaperName = "Wave Optics Special - Complete Master Paper (55 Questions)";
  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: masterPaperName,
      date: new Date("2026-05-02T09:00:00Z")
    }
  });

  console.log(`Created Shift "${masterPaperName}" (ID: ${shift.id})`);

  for (const q of allQuestions) {
    await prisma.question.create({
      data: {
        shift: { connect: { id: shift.id } },
        subject: q.subject,
        questionText: q.questionText,
        imageUrl: q.imageUrl || null,
        optionA: q.optionA || "",
        optionB: q.optionB || "",
        optionC: q.optionC || "",
        optionD: q.optionD || "",
        correctOption: q.correctOption || "",
        positiveMarks: q.positiveMarks,
        negativeMarks: q.negativeMarks
      }
    });
  }

  console.log(`🎉 Successfully seeded all ${allQuestions.length} questions into "${masterPaperName}"!`);
}

seedTempMasterPaper()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
