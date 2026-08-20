const prisma = require('../../lib/prisma');
const fs = require('fs');
const path = require('path');

const rawQuestions = [
  // ── MATHEMATICS (Q1 - Q30) ──
  {
    subject: "Mathematics",
    questionText: "$\\lim_{x\\to 0} \\frac{e - (1 + 2x)^{1/(2x)}}{x}$ is equal to :",
    imageUrl: null,
    optionA: "(1) e",
    optionB: "(2) $-2/e$",
    optionC: "(3) 0",
    optionD: "(4) $e - e^2$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Consider the line L passing through the points (1, 2, 3) and (2, 3, 5). The distance of the point $(\\frac{11}{3}, \\frac{11}{3}, \\frac{19}{3})$ from the line L along the line $\\frac{3x-11}{2} = \\frac{3y-11}{1} = \\frac{3z-19}{2}$ is equal to :",
    imageUrl: null,
    optionA: "(1) 3",
    optionB: "(2) 5",
    optionC: "(3) 4",
    optionD: "(4) 6",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $\\int_0^x \\sqrt{1-(y'(t))^2} dt = \\int_0^x y(t) dt, 0 \\le x \\le 3, y \\ge 0, y(0) = 0$. Then at $x = 2, y'' + y + 1$ is equal to :",
    imageUrl: null,
    optionA: "(1) 1",
    optionB: "(2) 2",
    optionC: "(3) $\\sqrt{2}$",
    optionD: "(4) 1/2",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let z be a complex number such that the real part of $\\frac{z-2i}{z+2i}$ is zero. Then, the maximum value of $|z - (6 + 8i)|$ is equal to :",
    imageUrl: null,
    optionA: "(1) 12",
    optionB: "(2) $\\infty$",
    optionC: "(3) 10",
    optionD: "(4) 8",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The area (in square units) of the region enclosed by the ellipse $x^2 + 3y^2 = 18$ in the first quadrant below the line $y = x$ is :",
    imageUrl: null,
    optionA: "(1) $\\sqrt{3}\\pi + 3/4$",
    optionB: "(2) $\\sqrt{3}\\pi$",
    optionC: "(3) $\\sqrt{3}\\pi - 3/4$",
    optionD: "(4) $\\sqrt{3}\\pi + 1$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let the foci of a hyperbola H coincide with the foci of the ellipse $E : \\frac{(x-1)^2}{100} + \\frac{(y-1)^2}{75} = 1$ and the eccentricity of the hyperbola H be the reciprocal of the eccentricity of the ellipse E. If the length of the transverse axis of H is $\\alpha$ and the length of its conjugate axis is $\\beta$, then $3\\alpha^2 + 2\\beta^2$ is equal to :",
    imageUrl: null,
    optionA: "(1) 242",
    optionB: "(2) 225",
    optionC: "(3) 237",
    optionD: "(4) 205",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Two vertices of a triangle ABC are A(3, –1) and B (–2, 3), and its orthocentre is P(1, 1). If the coordinates of the point C are $(\\alpha, \\beta)$ and the centre of the circle circumscribing the triangle PAB is $(h, k)$, then the value of $(\\alpha + \\beta) + 2(h + k)$ equals :",
    imageUrl: null,
    optionA: "(1) 51",
    optionB: "(2) 81",
    optionC: "(3) 5",
    optionD: "(4) 15",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If the variance of the frequency distribution (x: c, 2c, 3c, 4c, 5c, 6c with f: 2, 1, 1, 1, 1, 1) is 160, then the value of $c \\in \\mathbb{N}$ is",
    imageUrl: null,
    optionA: "(1) 5",
    optionB: "(2) 8",
    optionC: "(3) 7",
    optionD: "(4) 6",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let the range of the function $f(x) = \\frac{1}{2+\\sin 3x + \\cos 3x}, x \\in \\mathbb{R}$ be $[a, b]$. If $\\alpha$ and $\\beta$ are respectively the A.M. and the G.M. of a and b, then $\\frac{\\alpha}{\\beta}$ is equal to :",
    imageUrl: null,
    optionA: "(1) $\\sqrt{2}$",
    optionB: "(2) 2",
    optionC: "(3) $\\sqrt{\\pi}$",
    optionD: "(4) $\\pi$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Statement - I : Let $\\vec{a} = \\hat{i} + 2\\hat{j} - 3\\hat{k}$ and $\\vec{b} = 2\\hat{i} + \\hat{j} - \\hat{k}$. Then the vector $\\vec{r}$ satisfying $\\vec{a} \\times \\vec{r} = \\vec{a} \\times \\vec{b}$ and $\\vec{a} \\cdot \\vec{r} = 0$ is of magnitude $\\sqrt{10}$.\\nStatement - II : In a triangle ABC, $\\cos 2A + \\cos 2B + \\cos 2C \\ge -3/2$.",
    imageUrl: null,
    optionA: "(1) Both Statement-I and Statement-II are incorrect",
    optionB: "(2) Statement-I is incorrect but Statement-II is correct",
    optionC: "(3) Both Statement-I and Statement-II are correct",
    optionD: "(4) Statement-I is correct but Statement-II is incorrect",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$\\lim_{x\\to \\pi/2} \\frac{\\int_{x^3}^{(\\pi/2)^3} (\\sin(2t^{1/3}) + \\cos(t^{1/3})) dt}{(x - \\pi/2)^2}$ is equal to :",
    imageUrl: null,
    optionA: "(1) $\\frac{9\\pi^2}{8}$",
    optionB: "(2) $\\frac{11\\pi^2}{10}$",
    optionC: "(3) $\\frac{3\\pi^2}{2}$",
    optionD: "(4) $\\frac{5\\pi^2}{9}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The sum of the coefficient of $x^{2/3}$ and $x^{-2/5}$ in the binomial expansion of $(x^{2/3} + \\frac{1}{2}x^{-2/5})^9$ is :",
    imageUrl: null,
    optionA: "(1) 21/4",
    optionB: "(2) 69/16",
    optionC: "(3) 63/16",
    optionD: "(4) 19/4",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $B = \\begin{bmatrix} 1 & 3 \\\\ 1 & 5 \\end{bmatrix}$ and A be a $2 \\times 2$ matrix such that $AB^{-1} = A^{-1}$. If $BCB^{-1} = A$ and $C^4 + \\alpha C^2 + \\beta I = O$, then $2\\beta - \\alpha$ is equal to :",
    imageUrl: null,
    optionA: "(1) 16",
    optionB: "(2) 2",
    optionC: "(3) 8",
    optionD: "(4) 10",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If $\\log_e y = 3 \\sin^{-1} x$, then $(1 - x^2) y'' - xy'$ at $x = 1/2$ is equal to :",
    imageUrl: null,
    optionA: "(1) $9e^{\\pi/6}$",
    optionB: "(2) $3e^{\\pi/6}$",
    optionC: "(3) $3e^{\\pi/2}$",
    optionD: "(4) $9e^{\\pi/2}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The integral $\\int_{1/4}^{3/4} \\cos(2\\cot^{-1}\\sqrt{\\frac{1-x}{1+x}}) dx$ is equal to:",
    imageUrl: null,
    optionA: "(1) –1/2",
    optionB: "(2) 1/4",
    optionC: "(3) 1/2",
    optionD: "(4) –1/4",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $a, ar, ar^2, \\dots$ be an infinite G.P. If $\\sum_{n=0}^\\infty a r^n = 57$ and $\\sum_{n=0}^\\infty a^3 r^{3n} = 9747$, then $a + 18r$ is equal to :",
    imageUrl: null,
    optionA: "(1) 27",
    optionB: "(2) 46",
    optionC: "(3) 38",
    optionD: "(4) 31",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If an unbiased dice is rolled thrice, then the probability of getting a greater number in the $i^{\\text{th}}$ roll than the number obtained in the $(i - 1)^{\\text{th}}$ roll, $i = 2, 3$, is equal to :",
    imageUrl: null,
    optionA: "(1) 3/54",
    optionB: "(2) 2/54",
    optionC: "(3) 5/54",
    optionD: "(4) 1/54",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The value of the integral $\\int_{-1}^2 \\log_e(x + \\sqrt{x^2 + 1}) dx$ is :",
    imageUrl: null,
    optionA: "(1) $\\sqrt{5} - \\sqrt{2} + \\log_e(\\frac{9+4\\sqrt{5}}{1+\\sqrt{2}})$",
    optionB: "(2) $\\sqrt{2} - \\sqrt{5} + \\log_e(\\frac{9+4\\sqrt{5}}{1+\\sqrt{2}})$",
    optionC: "(3) $\\sqrt{5} - \\sqrt{2} + \\log_e(\\frac{7+4\\sqrt{5}}{1+\\sqrt{2}})$",
    optionD: "(4) $\\sqrt{2} - \\sqrt{5} + \\log_e(\\frac{7+4\\sqrt{5}}{1+\\sqrt{2}})$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $\\alpha, \\beta; \\alpha > \\beta$, be the roots of the equation $x^2 - \\sqrt{2}x - \\sqrt{3} = 0$. Let $P_n = \\alpha^n - \\beta^n, n \\in \\mathbb{N}$. Then $(11\\sqrt{3} - 10\\sqrt{2}) P_{10} + (11\\sqrt{2} + 10) P_{11} - 11P_{12}$ is equal to :",
    imageUrl: null,
    optionA: "(1) $10\\sqrt{2}P_9$",
    optionB: "(2) $10\\sqrt{3}P_9$",
    optionC: "(3) $11\\sqrt{2}P_9$",
    optionD: "(4) $11\\sqrt{3}P_9$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $\\vec{a} = 2\\hat{i} + \\alpha\\hat{j} + \\hat{k}, \\vec{b} = -\\hat{i} + \\hat{k}, \\vec{c} = \\beta\\hat{j} - \\hat{k}$, where $\\alpha$ and $\\beta$ are integers and $\\alpha\\beta = -6$. Let the values of the ordered pair $(\\alpha, \\beta)$ for which the area of the parallelogram of diagonals $\\vec{a} + \\vec{b}$ and $\\vec{b} + \\vec{c}$ is $\\frac{\\sqrt{21}}{2}$, be $(\\alpha_1, \\beta_1)$ and $(\\alpha_2, \\beta_2)$. Then $\\alpha_1^2 + \\beta_1^2 - \\alpha_2\\beta_2$ is equal to",
    imageUrl: null,
    optionA: "(1) 17",
    optionB: "(2) 24",
    optionC: "(3) 21",
    optionD: "(4) 19",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Consider the circle $C : x^2 + y^2 = 4$ and the parabola $P : y^2 = 8x$. If the set of all values of $\\alpha$, for which three chords of the circle C on three distinct lines passing through the point $(\\alpha, 0)$ are bisected by the parabola P is the interval (p, q), then $(2q - p)^2$ is equal to _______.",
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
    questionText: "Let the set of all values of p, for which $f(x) = (p^2 - 6p + 8) (\\sin^2 2x - \\cos^2 2x) + 2(2 - p)x + 7$ does not have any critical point, be the interval (a, b). Then 16ab is equal to _______.",
    imageUrl: null,
    optionA: "252",
    optionB: "252",
    optionC: "252",
    optionD: "252",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "For a differentiable function $f : \\mathbb{R} \\to \\mathbb{R}$, suppose $f'(x) = 3f(x) + \\alpha$, where $\\alpha \\in \\mathbb{R}, f(0) = 1$ and $\\lim_{x\\to-\\infty} f(x) = 7$. Then $9f(-\\log_e 3)$ is equal to ________.",
    imageUrl: null,
    optionA: "61",
    optionB: "61",
    optionC: "61",
    optionD: "61",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "The number of integers, between 100 and 1000 having the sum of their digits equals to 14, is ______.",
    imageUrl: null,
    optionA: "70",
    optionB: "70",
    optionC: "70",
    optionD: "70",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Let $A = \\{(x, y) : 2x + 3y = 23, x, y \\in \\mathbb{N}\\}$ and $B = \\{x : (x, y) \\in A\\}$. Then the number of one-one functions from A to B is equal to _______.",
    imageUrl: null,
    optionA: "24",
    optionB: "24",
    optionC: "24",
    optionD: "24",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Let A, B and C be three points on the parabola $y^2 = 6x$ and let the line segment AB meet the line L through C parallel to the x-axis at the point D. Let M and N respectively be the feet of the perpendiculars from A and B on L. Then $(\\frac{AM \\cdot BN}{CD})^2$ is equal to _______.",
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
    questionText: "The square of the distance of the image of the point (6, 1, 5) in the line $\\frac{x-1}{3} = \\frac{y}{2} = \\frac{z-2}{4}$, from the origin is ______.",
    imageUrl: null,
    optionA: "62",
    optionB: "62",
    optionC: "62",
    optionD: "62",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "If $(\\frac{1}{\\alpha+1} + \\frac{1}{\\alpha+2} + \\dots + \\frac{1}{\\alpha+1012}) - (\\frac{1}{2.1} + \\frac{1}{4.3} + \\frac{1}{6.5} + \\dots + \\frac{1}{2024.2023}) = \\frac{1}{2024}$, then $\\alpha$ is equal to-",
    imageUrl: null,
    optionA: "1011",
    optionB: "1011",
    optionC: "1011",
    optionD: "1011",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Let the inverse trigonometric functions take principal values. The number of real solutions of the equation $2\\sin^{-1} x + 3\\cos^{-1} x = \\frac{2\\pi}{5}$, is ______.",
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
    subject: "Mathematics",
    questionText: "Consider the matrices : $A = \\begin{bmatrix} 2 & -5 \\\\ 3 & m \\end{bmatrix}, B = \\begin{bmatrix} 20 \\\\ m \\end{bmatrix}$ and $X = \\begin{bmatrix} x \\\\ y \\end{bmatrix}$. Let the set of all m, for which the system of equations AX = B has a negative solution (i.e., $x < 0$ and $y < 0$), be the interval (a, b). Then $8 \\int_a^b |A| dm$ is equal to ________.",
    imageUrl: null,
    optionA: "450",
    optionB: "450",
    optionC: "450",
    optionD: "450",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── CHEMISTRY (Q31 - Q60) ──
  {
    subject: "Chemistry",
    questionText: "The candela is the luminous intensity, in a given direction, of a source that emits monochromatic radiation of frequency 'A' $\\times 10^{12}$ hertz and that has a radiant intensity in that direction of 1/'B' watt per steradian. 'A' and 'B' are respectively",
    imageUrl: null,
    optionA: "(1) 540 and 1/683",
    optionB: "(2) 540 and 683",
    optionC: "(3) 450 and 1/683",
    optionD: "(4) 450 and 683",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The correct stability order of resonance structures of $\\text{CH}_3-\\text{CH}=\\text{CH}-\\text{CHO}$ is:",
    imageUrl: null,
    optionA: "(1) II > III > I",
    optionB: "(2) III > II > I",
    optionC: "(3) I > II > III",
    optionD: "(4) II > I > III",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Total number of stereo isomers possible for 1,4-dibromoocta-2,5-diene is:",
    imageUrl: null,
    optionA: "(1) 8",
    optionB: "(2) 2",
    optionC: "(3) 4",
    optionD: "(4) 3",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The correct increasing order for bond angles among $\\text{BF}_3, \\text{PF}_3$ and $\\text{ClF}_3$ is :",
    imageUrl: null,
    optionA: "(1) $\\text{PF}_3 < \\text{BF}_3 < \\text{ClF}_3$",
    optionB: "(2) $\\text{BF}_3 < \\text{PF}_3 < \\text{ClF}_3$",
    optionC: "(3) $\\text{ClF}_3 < \\text{PF}_3 < \\text{BF}_3$",
    optionD: "(4) $\\text{BF}_3 = \\text{PF}_3 < \\text{ClF}_3$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List I with List II.\nList - I (Test): A. $\\text{Br}_2$ water test, B. Ceric ammonium nitrate test, C. Ferric chloride test, D. 2, 4-DNP test\nList - II (Observation): I. Yellow orange or orange red precipitate formed, II. Reddish orange colour disappears, III. Red colour appears, IV. Blue, Green, Violet or Red colour appear",
    imageUrl: null,
    optionA: "(1) A - I, B - II, C - III, D - IV",
    optionB: "(2) A - II, B - III, C - IV, D - I",
    optionC: "(3) A - III, B - IV, C - I, D - II",
    optionD: "(4) A - IV, B - I, C - II, D - III",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List I with List II.\nList - I (Cell): A. Leclanche cell, B. Ni-Cd cell, C. Fuel cell, D. Mercury cell\nList - II (Use/Property/Reaction): I. Converts energy of combustion into electrical energy, II. Does not involve any ion in solution and is used in hearing aids, III. Rechargeable, IV. Reaction at anode $\\text{Zn} \\to \\text{Zn}^{2+} + 2e^-$",
    imageUrl: null,
    optionA: "(1) A - I, B - II, C - III, D - IV",
    optionB: "(2) A - III, B - I, C - IV, D - II",
    optionC: "(3) A - IV, B - III, C - I, D - II",
    optionD: "(4) A - II, B - III, C - IV, D - I",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List I with List II.\nList - I: A. $K_2[Ni(CN)_4]$, B. $[Ni(CO)_4]$, C. $[Co(NH_3)_6]Cl_3$, D. $Na_3[CoF_6]$\nList - II: I. $sp^3$, II. $sp^3d^2$, III. $dsp^2$, IV. $d^2sp^3$",
    imageUrl: null,
    optionA: "(1) A - III, B - I, C - II, D - IV",
    optionB: "(2) A - III, B - II, C - IV, D - I",
    optionC: "(3) A - I, B - III, C - II, D - IV",
    optionD: "(4) A - III, B - I, C - IV, D - II",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The coordination environment of $\\text{Ca}^{2+}$ ion in its complex with $\\text{EDTA}^{4-}$ is :",
    imageUrl: null,
    optionA: "(1) tetrahedral",
    optionB: "(2) octahedral",
    optionC: "(3) square planar",
    optionD: "(4) trigonal prismatic",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The incorrect statement about Glucose is :",
    imageUrl: null,
    optionA: "(1) Glucose is soluble in water because of having aldehyde functional group",
    optionB: "(2) Glucose remains in multiple isomeric form in its aqueous solution",
    optionC: "(3) Glucose is an aldohexose",
    optionD: "(4) Glucose is one of the monomer unit in sucrose",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "1-(Bromomethyl)-4-methoxybenzene $\\xrightarrow{\\text{KCN (alc), } \\Delta} \\text{Major Product 'P'}$. Product 'P' is:",
    imageUrl: null,
    optionA: "(1) 2-(4-Methoxyphenyl)acetonitrile",
    optionB: "(2) 4-Methoxyphenylacetonitrile",
    optionC: "(3) 4-(Cyanomethyl)phenol",
    optionD: "(4) 1-(Cyanomethyl)-4-methoxybenzene",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following compound can give positive iodoform test when treated with aqueous KOH solution followed by potassium hypoiodite.",
    imageUrl: null,
    optionA: "(1) Pentan-3-one",
    optionB: "(2) 2,2-Dichloropropane",
    optionC: "(3) Butanal",
    optionD: "(4) Ethloxirane",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "For a sparingly soluble salt $AB_2$, the equilibrium concentrations of $A^{2+}$ ions and $B^-$ ions are $1.2 \\times 10^{-4}\\text{ M}$ and $0.24 \\times 10^{-3}\\text{ M}$, respectively. The solubility product of $AB_2$ is :",
    imageUrl: null,
    optionA: "(1) $0.069 \\times 10^{-12}$",
    optionB: "(2) $6.91 \\times 10^{-12}$",
    optionC: "(3) $0.276 \\times 10^{-12}$",
    optionD: "(4) $27.65 \\times 10^{-12}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "4-cyanophenyl acetate $\\xrightarrow{\\text{(i) CH}_3\\text{MgBr(excess), (ii) H}_3\\text{O}^+} \\text{Major product}$. Major product is:",
    imageUrl: null,
    optionA: "(1) 4-(2-hydroxypropan-2-yl)benzonitrile",
    optionB: "(2) 1-(4-hydroxyphenyl)ethan-1-one",
    optionC: "(3) 4-(2-hydroxypropan-2-yl)phenyl acetate",
    optionD: "(4) 4-acetylbenzonitrile",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Given below are two statements :\nStatement I : The higher oxidation states are more stable down the group among transition elements unlike p-block elements.\nStatement II : Copper can not liberate hydrogen from weak acids.\nIn the light of the above statements, choose the correct answer from the options given below :",
    imageUrl: null,
    optionA: "(1) Both Statement I and Statement II are false",
    optionB: "(2) Statement I is false but Statement II is true",
    optionC: "(3) Both Statement I and Statement II are true",
    optionD: "(4) Statement I is true but Statement II is false",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The incorrect statement regarding ethyne is",
    imageUrl: null,
    optionA: "(1) The C–C bonds in ethyne is shorter than that in ethene",
    optionB: "(2) Both carbons are sp hybridised",
    optionC: "(3) Ethyne is linear",
    optionD: "(4) The carbon-carbon bonds in ethyne is weaker than that in ethene",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List I with List II.\nList I (Element): A. N, B. S, C. Br, D. Kr\nList II (Electronic Configuration): I. $[Ar]3d^{10}4s^2 4p^5$, II. $[Ne]3s^2 3p^4$, III. $[He]2s^2 2p^3$, IV. $[Ar]3d^{10} 4s^2 4p^6$",
    imageUrl: null,
    optionA: "(1) A - IV, B - III, C - II, D - I",
    optionB: "(2) A - III, B - II, C - I, D - IV",
    optionC: "(3) A - I, B - IV, C - III, D - II",
    optionD: "(4) A - II, B - I, C - IV, D - III",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List I with List II.\nList I: A. Melting point [K], B. Ionic Radius $[M^{+3}/\\text{pm}]$, C. $\\Delta_i H_1 [\\text{kJ mol}^{-1}]$, D. Atomic Radius [pm]\nList II: I. $\\text{Tl} > \\text{In} > \\text{Ga} > \\text{Al} > \\text{B}$, II. $\\text{B} > \\text{Tl} > \\text{Al} \\approx \\text{Ga} > \\text{In}$, III. $\\text{Tl} > \\text{In} > \\text{Al} > \\text{Ga} > \\text{B}$, IV. $\\text{B} > \\text{Al} > \\text{Tl} > \\text{In} > \\text{Ga}$",
    imageUrl: null,
    optionA: "(1) A - III, B - IV, C - I, D - II",
    optionB: "(2) A - II, B - III, C - IV, D - I",
    optionC: "(3) A - IV, B - I, C - II, D - III",
    optionD: "(4) A - I, B - II, C - III, D - IV",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following compounds will give silver mirror with ammoniacal silver nitrate?\n(A) Formic acid, (B) Formaldehyde, (C) Benzaldehyde, (D) Acetone\nChoose the correct answer from the options given below :",
    imageUrl: null,
    optionA: "(1) C and D only",
    optionB: "(2) A, B and C only",
    optionC: "(3) A only",
    optionD: "(4) B and C only",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which out of the following is a correct equation to show change in molar conductivity with respect to concentration for a weak electrolyte, if the symbols carry their usual meaning :",
    imageUrl: null,
    optionA: "(1) $\\Lambda_m^2 C - K_a \\Lambda_m^{\\circ 2} + K_a \\Lambda_m \\Lambda_m^\\circ = 0$",
    optionB: "(2) $\\Lambda_m - \\Lambda_m^\\circ + A C^{1/2} = 0$",
    optionC: "(3) $\\Lambda_m - \\Lambda_m^\\circ - A C^{1/2} = 0$",
    optionD: "(4) $\\Lambda_m^2 C + K_a \\Lambda_m^{\\circ 2} - K_a \\Lambda_m \\Lambda_m^\\circ = 0$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The electronic configuration of Einsteinium is : (Given atomic number of Einsteinium = 99)",
    imageUrl: null,
    optionA: "(1) $[Rn] 5f^{12} 6d^0 7s^2$",
    optionB: "(2) $[Rn] 5f^{11} 6d^0 7s^2$",
    optionC: "(3) $[Rn] 5f^{13} 6d^0 7s^2$",
    optionD: "(4) $[Rn] 5f^{10} 6d^0 7s^2$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The number of oxygen atoms present in the chemical formula of fuming sulphuric acid is _______.",
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
    questionText: "A transition metal 'M' among Sc, Ti, V , Cr, Mn and Fe has the highest second ionisation enthalpy. The spin only magnetic moment value of $M^+$ ion is ______ BM (Near integer). (Sc : 21, Ti : 22, V : 23, Cr : 24, Mn : 25, Fe : 26)",
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
    questionText: "The vapour pressure of pure benzene and methyl benzene at $27^\\circ\\text{C}$ is given as 80 Torr and 24 Torr, respectively. The mole fraction of methyl benzene in vapour phase, in equilibrium with an equimolar mixture of those two liquids (ideal solution) at the same temperature is _______ $\\times 10^{-2}$ (nearest integer)",
    imageUrl: null,
    optionA: "23",
    optionB: "23",
    optionC: "23",
    optionD: "23",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "$M^{2+} + \\text{H}_2\\text{S} \\to A \\text{ (Black ppt.)}$. $A + \\text{aqua regia} \\to B + \\text{NOCl} + S + \\text{H}_2\\text{O}$. $B + \\text{KNO}_2 + \\text{CH}_3\\text{COOH} \\to C$. The spin only magnetic moment value of the metal complex C is ________ BM. (Nearest integer)",
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
    questionText: "Gas phase reaction $A_{(g)} \\to 2B_{(g)} + C_{(g)}$. Total pressure is 200 torr after 23 sec and 300 torr upon complete decomposition of A. Rate constant is ______ $\\times 10^{-2}\\text{ s}^{-1}$ (nearest integer).",
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
    questionText: "In TLC, distance of spot A & B are 5 cm & 7 cm from bottom of plate (10 cm total). $R_f$ value of B is $x \\times 10^{-1}$ times more than A. Value of x is _______.",
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
    questionText: "Uncertainty in velocity of electron within atomic nucleus of diameter $10^{-15}\\text{ m}$ is ______ $\\times 10^9\\text{ ms}^{-1}$ (nearest integer). ($m_e = 9.1 \\times 10^{-31}\\text{ kg}, h = 6.626 \\times 10^{-34}\\text{ J.s}$)",
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
    questionText: "Number of compounds from the following which cannot undergo Friedel-Crafts reactions is : _______ toluene, nitrobenzene, xylene, cumene, aniline, chlorobenzene, m-nitroaniline, m-dinitrobenzene",
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
    questionText: "Total number of electron present in $(\\pi^*)$ molecular orbitals of $\\text{O}_2, \\text{O}_2^+$ and $\\text{O}_2^-$ is _________.",
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
    questionText: "When $\\Delta H_{\\text{vap}} = 30\\text{ kJ/mol}$ and $\\Delta S_{\\text{vap}} = 75\\text{ J mol}^{-1}\\text{K}^{-1}$, then the temperature of vapour, at one atmosphere is ________ K.",
    imageUrl: null,
    optionA: "400",
    optionB: "400",
    optionC: "400",
    optionD: "400",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── PHYSICS (Q61 - Q90) ──
  {
    subject: "Physics",
    questionText: "A nucleus at rest disintegrates into two smaller nuclei with their masses in the ratio of 2 : 1. After disintegration they will move :-",
    imageUrl: null,
    optionA: "(1) In opposite directions with speed in the ratio of 1 : 2 respectively",
    optionB: "(2) In opposite directions with speed in the ratio of 2 : 1 respectively",
    optionC: "(3) In the same direction with same speed.",
    optionD: "(4) In opposite directions with the same speed.",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Two biconvex lenses $L_1$ and $L_2$ having focal length 10 cm and 15 cm respectively. The distance between $L_1$ & $L_2$ for parallel rays entering $L_1$ to emerge as parallel rays from $L_2$ is :",
    imageUrl: null,
    optionA: "(1) 10 cm",
    optionB: "(2) 15 cm",
    optionC: "(3) 25 cm",
    optionD: "(4) 35 cm",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The temperature of a gas is $-78^\\circ\\text{C}$ and the average translational kinetic energy of its molecules is K. The temperature at which the average translational kinetic energy of the molecules of the same gas becomes 2K is :",
    imageUrl: null,
    optionA: "(1) $-39^\\circ\\text{C}$",
    optionB: "(2) $117^\\circ\\text{C}$",
    optionC: "(3) $127^\\circ\\text{C}$",
    optionD: "(4) $-78^\\circ\\text{C}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A hydrogen atom in ground state is given an energy of 10.2 eV. How many spectral lines will be emitted due to transition of electrons ?",
    imageUrl: null,
    optionA: "(1) 6",
    optionB: "(2) 3",
    optionC: "(3) 10",
    optionD: "(4) 1",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The magnetic field in a plane electromagnetic wave is $B_y = (3.5 \\times 10^{-7}) \\sin (1.5 \\times 10^3 x + 0.5 \\times 10^{11} t)\\text{T}$. The corresponding electric field will be",
    imageUrl: null,
    optionA: "(1) $E_y = 1.17 \\sin (1.5 \\times 10^3 x + 0.5 \\times 10^{11} t)\\text{Vm}^{-1}$",
    optionB: "(2) $E_z = 105 \\sin (1.5 \\times 10^3 x + 0.5 \\times 10^{11} t)\\text{Vm}^{-1}$",
    optionC: "(3) $E_z = 1.17 \\sin (1.5 \\times 10^3 x + 0.5 \\times 10^{11} t)\\text{Vm}^{-1}$",
    optionD: "(4) $E_y = 10.5 \\sin (1.5 \\times 10^3 x + 0.5 \\times 10^{11} t)\\text{Vm}^{-1}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A square loop of side 15 cm being moved towards right at a constant speed of 2 cm/s as shown in figure. The front edge enters the 50 cm wide magnetic field at t = 0. The value of induced emf in the loop at t = 10 s will be :",
    imageUrl: null,
    optionA: "(1) 0.3 mV",
    optionB: "(2) 4.5 mV",
    optionC: "(3) zero",
    optionD: "(4) 3 mV",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Two cars are travelling towards each other at speed of $20\\text{ ms}^{-1}$ each. When the cars are 300 m apart, both the drivers apply brakes and the cars retard at the rate of $2\\text{ ms}^{-2}$. The distance between them when they come to rest is :",
    imageUrl: null,
    optionA: "(1) 200 m",
    optionB: "(2) 50 m",
    optionC: "(3) 100 m",
    optionD: "(4) 25 m",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The I-V characteristics of an electronic device shows breakdown at -5V and $5\\mu\\text{A}$. The device is :",
    imageUrl: null,
    optionA: "(1) a solar cell",
    optionB: "(2) a transistor which can be used as an amplifier",
    optionC: "(3) a zener diode which can be used as voltage regulator",
    optionD: "(4) a diode which can be used as a rectifier",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The excess pressure inside a soap bubble is thrice the excess pressure inside a second soap bubble. The ratio between the volume of the first and the second bubble is :",
    imageUrl: null,
    optionA: "(1) 1 : 9",
    optionB: "(2) 1 : 3",
    optionC: "(3) 1 : 81",
    optionD: "(4) 1 : 27",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The de-Broglie wavelength associated with a particle of mass m and energy E is $h/\\sqrt{2mE}$. The dimensional formula for Planck's constant is :",
    imageUrl: null,
    optionA: "(1) $[ML^{-1}T^{-2}]$",
    optionB: "(2) $[ML^2T^{-1}]$",
    optionC: "(3) $[MLT^{-2}]$",
    optionD: "(4) $[M^2L^2T^{-2}]$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A satellite of $10^3\\text{ kg}$ mass is revolving in circular orbit of radius 2R. If $\\frac{10^4 R}{6}\\text{ J}$ energy is supplied to the satellite, it would revolve in a new circular orbit of radius : (use $g = 10\\text{ m/s}^2$, R = radius of earth)",
    imageUrl: null,
    optionA: "(1) 2.5 R",
    optionB: "(2) 3 R",
    optionC: "(3) 4 R",
    optionD: "(4) 6 R",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The effective resistance between A and B, if the resistance of each resistor in bridge is R, will be",
    imageUrl: null,
    optionA: "(1) $\\frac{2}{3}R$",
    optionB: "(2) $\\frac{8R}{3}$",
    optionC: "(3) $\\frac{5R}{3}$",
    optionD: "(4) $\\frac{4R}{3}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Five charges +q, +5q, –2q, +3q and –4q are situated. The electric flux due to this configuration through the surface S containing +5q, -2q, +3q, -4q is :",
    imageUrl: null,
    optionA: "(1) $\\frac{5q}{\\epsilon_0}$",
    optionB: "(2) $\\frac{4q}{\\epsilon_0}$",
    optionC: "(3) $\\frac{3q}{\\epsilon_0}$",
    optionD: "(4) $\\frac{q}{\\epsilon_0}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A proton and a deutron (q = +e, m = 2.0u) having same kinetic energies enter a region of uniform magnetic field \\vec{B}, moving perpendicular to \\vec{B}. The ratio of the radius $r_d$ of deutron path to the radius $r_p$ of the proton path is :",
    imageUrl: null,
    optionA: "(1) 1 : 1",
    optionB: "(2) $1 : \\sqrt{2}$",
    optionC: "(3) $\\sqrt{2} : 1$",
    optionD: "(4) 1 : 2",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "UV light of 4.13 eV is incident on a photosensitive metal surface having work function 3.13 eV. The maximum kinetic energy of ejected photoelectrons will be :",
    imageUrl: null,
    optionA: "(1) 4.13 eV",
    optionB: "(2) 1 eV",
    optionC: "(3) 3.13 eV",
    optionD: "(4) 7.26 eV",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The energy released in the fusion of 2 kg of hydrogen deep in the sun is $E_H$ and the energy released in the fission of 2 kg of $^{235}U$ is $E_U$. The ratio $\\frac{E_H}{E_U}$ is approximately :",
    imageUrl: null,
    optionA: "(1) 9.13",
    optionB: "(2) 15.04",
    optionC: "(3) 7.62",
    optionD: "(4) 25.6",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A real gas within a closed chamber at $27^\\circ\\text{C}$ undergoes the cyclic process. The gas obeys $PV^3 = RT$ equation for path A to B. The net work done in the complete cycle is (assuming R = 8J/molK):",
    imageUrl: null,
    optionA: "(1) 225 J",
    optionB: "(2) 205 J",
    optionC: "(3) 20 J",
    optionD: "(4) –20 J",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A 1 kg mass is suspended from the ceiling by a rope of length 4m. A horizontal force 'F' is applied at the mid point of the rope so that the rope makes an angle of $45^\\circ$ with respect to the vertical axis. The magnitude of F is :",
    imageUrl: null,
    optionA: "(1) $\\frac{10}{\\sqrt{2}}\\text{ N}$",
    optionB: "(2) 1 N",
    optionC: "(3) $\\frac{1}{10\\sqrt{2}}\\text{ N}$",
    optionD: "(4) 10 N",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A spherical ball of radius $1 \\times 10^{-4}\\text{ m}$ and density $10^5\\text{ kg/m}^3$ falls freely under gravity through a distance h before entering a tank of water. If after entering in water the velocity of the ball does not change, then the value of h is approximately : (The coefficient of viscosity of water is $9.8 \\times 10^{-6}\\text{ N s/m}^2$)",
    imageUrl: null,
    optionA: "(1) 2296 m",
    optionB: "(2) 2249 m",
    optionC: "(3) 2518 m",
    optionD: "(4) 2396 m",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In the truth table of the logic circuit (NOR and AND combination), the value of X (for A=0, B=1) and Y (for A=1, B=0) are :",
    imageUrl: null,
    optionA: "(1) 1, 1",
    optionB: "(2) 1, 0",
    optionC: "(3) 0, 1",
    optionD: "(4) 0, 0",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A straight magnetic strip has a magnetic moment of $44\\text{ Am}^2$. If the strip is bent in a semicircular shape, its magnetic moment will be _______ $\\text{Am}^2$. (Given $\\pi = 22/7$)",
    imageUrl: null,
    optionA: "28",
    optionB: "28",
    optionC: "28",
    optionD: "28",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "A particle of mass 0.50 kg executes simple harmonic motion under force $F = -50(\\text{Nm}^{-1})x$. The time period of oscillation is $\\frac{x}{35}\\text{ s}$. The value of x is _______. (Given $\\pi = 22/7$)",
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
    questionText: "A capacitor of reactance $4\\sqrt{3}\\Omega$ and a resistor of resistance $4\\Omega$ are connected in series with an ac source of peak value $8\\sqrt{2}\\text{ V}$. The power dissipation in the circuit is ________ W.",
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
    questionText: "An electric field $\\vec{E} = (2x\\hat{i})\\text{NC}^{-1}$ exists in space. A cube of side 2m is placed in the space as per figure. The electric flux through the cube is ________ $\\text{Nm}^2/\\text{C}$.",
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
    subject: "Physics",
    questionText: "A circular disc reaches from top to bottom of an inclined plane of length l. When it slips down the plane, it takes t s. When it rolls down the plane then it takes $(\\frac{\\alpha}{2})^{1/2} t\\text{ s}$, where $\\alpha$ is ________.",
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
    questionText: "To determine the resistance (R) of a wire, a circuit is designed. A voltmeter of $10\\text{ k}\\Omega$ is connected in parallel with R and ammeter in series. V-I characteristic gives slope of $2.5\\text{ V/mA}$. The value of R is ________ $\\Omega$.",
    imageUrl: null,
    optionA: "2500",
    optionB: "2500",
    optionC: "2500",
    optionD: "2500",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "The resultant of two vectors $\\vec{A}$ and $\\vec{B}$ is perpendicular to $\\vec{A}$ and its magnitude is half that of $\\vec{B}$. The angle between vectors $\\vec{A}$ and $\\vec{B}$ is _______.",
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
    questionText: "Monochromatic light of wavelength 500 nm is used in Young's double slit experiment. An interference pattern is obtained on a screen When one of the slits is covered with a very thin glass plate (refractive index = 1.5), the central maximum is shifted to a position previously occupied by the $4^{\\text{th}}$ bright fringe. The thickness of the glass plate is ______ $\\mu\\text{m}$.",
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
    questionText: "A force $(3x^2 + 2x - 5)\\text{ N}$ displaces a body from $x = 2\\text{ m}$ to $x = 4\\text{m}$. Work done by this force is _______ J.",
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
    subject: "Physics",
    questionText: "At room temperature ($27^\\circ\\text{C}$), the resistance of a heating element is $50\\Omega$. The temperature coefficient of the material is $2.4 \\times 10^{-4} {}^\\circ\\text{C}^{-1}$. The temperature of the element, when its resistance is $62\\Omega$, is _______ ${}^\\circ\\text{C}$.",
    imageUrl: null,
    optionA: "1027",
    optionB: "1027",
    optionC: "1027",
    optionD: "1027",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  }
];

async function seedJee2024Apr09Shift2() {
  console.log(`🚀 Compiling JEE Main 2024 (09 Apr Shift 2) Paper with ${rawQuestions.length} questions...`);

  const paperData = {
    examName: "JEE Main",
    year: 2024,
    shiftName: "JEE Main 2024 (09 Apr Shift 2)",
    examDate: "2024-04-09T15:00:00Z",
    totalMarks: 300,
    totalQuestions: 90,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'JEE Main 2024 (09 Apr Shift 2).json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved paper JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding JEE Main 2024 (09 Apr Shift 2) into PostgreSQL via Prisma...`);
  
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
      name: "JEE Main 2024 (09 Apr Shift 2)"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "JEE Main 2024 (09 Apr Shift 2)",
      date: new Date("2024-04-09T15:00:00Z")
    }
  });
  console.log(`Created Shift "JEE Main 2024 (09 Apr Shift 2)" (ID: ${shift.id})`);

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

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for JEE Main 2024 (09 Apr Shift 2) into Database!`);
}

seedJee2024Apr09Shift2()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
