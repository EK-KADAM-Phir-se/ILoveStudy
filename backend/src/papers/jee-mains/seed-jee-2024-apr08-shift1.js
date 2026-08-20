const prisma = require('../../lib/prisma');
const fs = require('fs');
const path = require('path');

const rawQuestions = [
  // ── MATHEMATICS (Q1 - Q30) ──
  {
    subject: "Mathematics",
    questionText: "The value of $k \\in \\mathbb{N}$ for which the integral $I_n = \\int_0^1 (1 - x^k)^n dx, n \\in \\mathbb{N}$, satisfies $147 I_{20} = 148 I_{21}$ is :",
    imageUrl: null,
    optionA: "(1) 10",
    optionB: "(2) 8",
    optionC: "(3) 14",
    optionD: "(4) 7",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The sum of all the solutions of the equation $(8)^{2x} - 16 \\cdot (8)^x + 48 = 0$ is :",
    imageUrl: null,
    optionA: "(1) $1 + \\log_6(8)$",
    optionB: "(2) $\\log_8(6)$",
    optionC: "(3) $1 + \\log_8(6)$",
    optionD: "(4) $\\log_8(4)$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let the circles $C_1 : (x - \\alpha)^2 + (y - \\beta)^2 = r_1^2$ and $C_2 : (x - 8)^2 + (y - \\frac{15}{2})^2 = r_2^2$ touch each other externally at the point (6, 6). If the point (6, 6) divides the line segment joining the centres of the circles $C_1$ and $C_2$ internally in the ratio $2 : 1$, then $(\\alpha + \\beta) + 4(r_1^2 + r_2^2)$ equals",
    imageUrl: null,
    optionA: "(1) 110",
    optionB: "(2) 130",
    optionC: "(3) 125",
    optionD: "(4) 145",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let P(x, y, z) be a point in the first octant, whose projection in the xy-plane is the point Q. Let $OP = \\gamma$; the angle between OQ and the positive x-axis be $\\theta$; and the angle between OP and the positive z-axis be $\\phi$, where O is the origin. Then the distance of P from the x-axis is :",
    imageUrl: null,
    optionA: "(1) $\\gamma \\sqrt{1 - \\sin^2 \\phi \\cos^2 \\theta}$",
    optionB: "(2) $\\gamma \\sqrt{1 + \\cos^2 \\theta \\sin^2 \\phi}$",
    optionC: "(3) $\\gamma \\sqrt{1 - \\sin^2 \\theta \\cos^2 \\phi}$",
    optionD: "(4) $\\gamma \\sqrt{1 + \\cos^2 \\phi \\sin^2 \\theta}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The number of critical points of the function $f(x) = (x - 2)^{2/3} (2x + 1)$ is :",
    imageUrl: null,
    optionA: "(1) 2",
    optionB: "(2) 0",
    optionC: "(3) 1",
    optionD: "(4) 3",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let f(x) be a positive function such that the area bounded by $y = f(x), y = 0$ from $x = 0$ to $x = a > 0$ is $e^{-a} + 4a^2 + a - 1$. Then the differential equation, whose general solution is $y = c_1 f(x) + c_2$, where $c_1$ and $c_2$ are arbitrary constants, is :",
    imageUrl: null,
    optionA: "(1) $(8e^x - 1)\\frac{d^2y}{dx^2} + \\frac{dy}{dx} = 0$",
    optionB: "(2) $(8e^x + 1)\\frac{d^2y}{dx^2} - \\frac{dy}{dx} = 0$",
    optionC: "(3) $(8e^x + 1)\\frac{d^2y}{dx^2} + \\frac{dy}{dx} = 0$",
    optionD: "(4) $(8e^x - 1)\\frac{d^2y}{dx^2} - \\frac{dy}{dx} = 0$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $f(x) = 4\\cos^3 x + 3\\sqrt{3}\\cos^2 x - 10$. The number of points of local maxima of f in interval $(0, 2\\pi)$ is:",
    imageUrl: null,
    optionA: "(1) 1",
    optionB: "(2) 2",
    optionC: "(3) 3",
    optionD: "(4) 4",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $A = \\begin{bmatrix} 2 & a & 0 \\\\ 1 & 3 & 1 \\\\ 0 & 5 & b \\end{bmatrix}$. If $A^3 = 4A^2 - A - 21I$, where I is the identity matrix of order $3 \\times 3$, then $2a + 3b$ is equal to :",
    imageUrl: null,
    optionA: "(1) -10",
    optionB: "(2) -13",
    optionC: "(3) -9",
    optionD: "(4) -12",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If the shortest distance between the lines $L_1 : \\vec{r} = (2 + \\lambda)\\hat{i} + (1 - 3\\lambda)\\hat{j} + (3 + 4\\lambda)\\hat{k}, \\lambda \\in \\mathbb{R}$ and $L_2 : \\vec{r} = 2(1 + \\mu)\\hat{i} + 3(1 + \\mu)\\hat{j} + (5 + \\mu)\\hat{k}, \\mu \\in \\mathbb{R}$ is $\\frac{m}{\\sqrt{n}}$, where $\\text{gcd}(m, n) = 1$, then the value of $m + n$ equals.",
    imageUrl: null,
    optionA: "(1) 384",
    optionB: "(2) 387",
    optionC: "(3) 377",
    optionD: "(4) 390",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let the sum of two positive integers be 24. If the probability, that their product is not less than 3/4 times their greatest positive product, is $\\frac{m}{n}$, where $\\text{gcd}(m, n) = 1$, then $n - m$ equals :",
    imageUrl: null,
    optionA: "(1) 9",
    optionB: "(2) 11",
    optionC: "(3) 8",
    optionD: "(4) 10",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If $\\sin x = -\\frac{3}{5}$, where $\\pi < x < \\frac{3\\pi}{2}$, then $80(\\tan^2 x - \\cos x)$ is equal to :",
    imageUrl: null,
    optionA: "(1) 109",
    optionB: "(2) 108",
    optionC: "(3) 18",
    optionD: "(4) 19",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $I(x) = \\int \\frac{6}{\\sin^2 x(1-\\cot x)^2} dx$. If $I(0) = 3$, then $I(\\frac{\\pi}{12})$ is equal to :",
    imageUrl: null,
    optionA: "(1) $\\sqrt{3}$",
    optionB: "(2) $3\\sqrt{3}$",
    optionC: "(3) $6\\sqrt{3}$",
    optionD: "(4) $2\\sqrt{3}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The equations of two sides AB and AC of a triangle ABC are $4x + y = 14$ and $3x - 2y = 5$, respectively. The point $(2, -4/3)$ divides the third side BC internally in the ratio $2 : 1$. The equation of the side BC is :",
    imageUrl: null,
    optionA: "(1) $x - 6y - 10 = 0$",
    optionB: "(2) $x - 3y - 6 = 0$",
    optionC: "(3) $x + 3y + 2 = 0$",
    optionD: "(4) $x + 6y + 6 = 0$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let [t] be the greatest integer less than or equal to t. Let A be the set of all prime factors of 2310 and $f : A \\to \\mathbb{Z}$ be the function $f(x) = [\\log_2(x^2 + [x^3/5])]$. The number of one-to-one functions from A to the range of f is :",
    imageUrl: null,
    optionA: "(1) 20",
    optionB: "(2) 120",
    optionC: "(3) 25",
    optionD: "(4) 24",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let z be a complex number such that $|z + 2| = 1$ and $\\text{Im}(\\frac{z+1}{z+2}) = \\frac{1}{5}$. Then the value of $|\\text{Re}(\\bar{z + 2})|$ is :",
    imageUrl: null,
    optionA: "(1) $\\frac{\\sqrt{6}}{5}$",
    optionB: "(2) $\\frac{1+\\sqrt{6}}{5}$",
    optionC: "(3) $\\frac{24}{5}$",
    optionD: "(4) $\\frac{2\\sqrt{6}}{5}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If the set $R = \\{(a, b) ; a + 5b = 42, a, b \\in \\mathbb{N}\\}$ has m elements and $\\sum_{n=1}^m (1 - i^{n!}) = x + iy$, where $I = \\sqrt{-1}$, then the value of $m + x + y$ is :",
    imageUrl: null,
    optionA: "(1) 8",
    optionB: "(2) 12",
    optionC: "(3) 4",
    optionD: "(4) 5",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "For the function $f(x) = (\\cos x) - x + 1, x \\in \\mathbb{R}$, between the following two statements:\n(S1) $f(x) = 0$ for only one value of x is $[0, \\pi]$.\n(S2) $f(x)$ is decreasing in $[0, \\pi/2]$ and increasing in $[\\pi/2, \\pi]$.",
    imageUrl: null,
    optionA: "(1) Both (S1) and (S2) are correct",
    optionB: "(2) Only (S1) is correct",
    optionC: "(3) Both (S1) and (S2) are incorrect",
    optionD: "(4) Only (S2) is correct",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The set of all $\\alpha$, for which the vector $\\vec{a} = \\alpha t\\hat{i} + 6\\hat{j} - 3\\hat{k}$ and $\\vec{b} = t\\hat{i} - 2\\hat{j} - 2\\alpha t\\hat{k}$ are inclined at an obtuse angle for all $t \\in \\mathbb{R}$ is :",
    imageUrl: null,
    optionA: "(1) $[0, 1)$",
    optionB: "(2) $(-2, 0]$",
    optionC: "(3) $(-\\frac{4}{3}, 0]$",
    optionD: "(4) $(-\\frac{4}{3}, 1)$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $y = y(x)$ be the solution of the differential equation $(1 + y^2)e^{\\tan x}dx + \\cos^2 x(1 + e^{2\\tan x})dy = 0, y(0) = 1$. Then $y(\\frac{\\pi}{4})$ is equal to :",
    imageUrl: null,
    optionA: "(1) $2/e$",
    optionB: "(2) $1/e^2$",
    optionC: "(3) $1/e$",
    optionD: "(4) $2/e^2$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $H : \\frac{-x^2}{a^2} + \\frac{y^2}{b^2} = 1$ be the hyperbola, whose eccentricity is $\\sqrt{3}$ and the length of the latus rectum is $4\\sqrt{3}$. Suppose the point $(\\alpha, 6), \\alpha > 0$ lies on H. If $\\beta$ is the product of the focal distances of the point $(\\alpha, 6)$, then $\\alpha^2 + \\beta$ is equal to :",
    imageUrl: null,
    optionA: "(1) 170",
    optionB: "(2) 171",
    optionC: "(3) 169",
    optionD: "(4) 172",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $A = \\begin{bmatrix} 2 & -1 \\\\ 1 & 1 \\end{bmatrix}$. If the sum of the diagonal elements of $A^{13}$ is $3^n$, then n is equal to ______.",
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
    questionText: "If the orthocentre of the triangle formed by the lines $2x + 3y – 1 = 0, x + 2y – 1 = 0$ and $ax + by – 1 = 0$, is the centroid of another triangle, whose circumecentre and orthocentre respectively are (3, 4) and (–6, –8), then the value of $|a – b|$ is _____.",
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
    questionText: "Three balls are drawn at random from a bag containing 5 blue and 4 yellow balls. Let the random variables X and Y respectively denote the number of blue and Yellow balls. If $\\bar{X}$ and $\\bar{Y}$ are the means of X and Y respectively, then $7\\bar{X} + 4\\bar{Y}$ is equal to ______.",
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
    subject: "Mathematics",
    questionText: "The number of 3-digit numbers, formed using the digits 2, 3, 4, 5 and 7, when the repetition of digits is not allowed, and which are not divisible by 3, is equal to ______.",
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
    questionText: "If the $k^{\\text{th}}$ row contains exactly k numbers for every natural number k in triangular grid starting 1 on row 1, then the row in which the number 5310 will be, is ______.",
    imageUrl: null,
    optionA: "103",
    optionB: "103",
    optionC: "103",
    optionD: "103",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "If the range of $f(\\theta) = \\frac{\\sin^4\\theta + 3\\cos^2\\theta}{\\sin^4\\theta + \\cos^2\\theta}, \\theta \\in \\mathbb{R}$ is $[\\alpha, \\beta]$, then the sum of the infinite G.P., whose first term is 64 and the common ratio is $\\frac{\\alpha}{\\beta}$, is equal to ______.",
    imageUrl: null,
    optionA: "96",
    optionB: "96",
    optionC: "96",
    optionD: "96",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Let $\\alpha = \\sum_{r=0}^n (4r^2 + 2r + 1) {}^nC_r$ and $\\beta = \\sum_{r=0}^n \\frac{{}^nC_r}{r+1} + \\frac{1}{n+1}$. If $140 < \\frac{2\\alpha}{\\beta} < 281$, then the value of n is _________.",
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
    questionText: "Let $\\vec{a} = 9\\hat{i} - 13\\hat{j} + 25\\hat{k}, \\vec{b} = 3\\hat{i} + 7\\hat{j} - 13\\hat{k}$ and $\\vec{c} = 17\\hat{i} - 2\\hat{j} + \\hat{k}$ be three given vectors. If $\\vec{r}$ is a vector such that $\\vec{r} \\times \\vec{a} = (\\vec{b} + \\vec{c}) \\times \\vec{a}$ and $\\vec{r} \\cdot (\\vec{b} - \\vec{c}) = 0$, then $\\frac{|593\\vec{r} + 67\\vec{a}|^2}{(593)^2}$ is equal to __________.",
    imageUrl: null,
    optionA: "569",
    optionB: "569",
    optionC: "569",
    optionD: "569",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Let the area of the region enclosed by the curve $y = \\min\\{\\sin x, \\cos x\\}$ and the x-axis between $x = -\\pi$ to $x = \\pi$ be A. Then $A^2$ is equal to _______.",
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
    questionText: "The value of $\\lim_{x\\to 0} 2 \\left(\\frac{1-\\cos x \\sqrt{\\cos 2x} \\sqrt[3]{\\cos 3x} \\dots \\sqrt[10]{\\cos 10x}}{x^2}\\right)$ is ________.",
    imageUrl: null,
    optionA: "55",
    optionB: "55",
    optionC: "55",
    optionD: "55",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── CHEMISTRY (Q31 - Q60) ──
  {
    subject: "Chemistry",
    questionText: "Given below are two statements: Statement I : IUPAC name of Compound 4-chloro-1,3-dinitrobenzene is 4-chloro-1, 3-dinitrobenzene. Statement II: IUPAC name of 4-ethyl-2-methylaniline is 4-ethyl-2-methylaniline. In the light of the above statements, choose the correct answer from the options given below:",
    imageUrl: null,
    optionA: "(1) Both Statement I and Statement II are correct",
    optionB: "(2) Statement I is incorrect but Statement II is correct",
    optionC: "(3) Statement I is correct but Statement II is incorrect",
    optionD: "(4) Both Statement I and Statement II are incorrect",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which among the following compounds will undergo fastest $S_N2$ reaction.",
    imageUrl: null,
    optionA: "(1) 1-Bromo-1-methylcyclobutane",
    optionB: "(2) 1-Bromocyclobutane",
    optionC: "(3) Bromomethylcyclobutane",
    optionD: "(4) 2-Bromocyclobutane",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Combustion of glucose ($\\text{C}_6\\text{H}_{12}\\text{O}_6$) produces $\\text{CO}_2$ and water. The amount of oxygen (in g) required for the complete combustion of 900 g of glucose is: [Molar mass of glucose in $\\text{g mol}^{-1} = 180$]",
    imageUrl: null,
    optionA: "(1) 480",
    optionB: "(2) 960",
    optionC: "(3) 800",
    optionD: "(4) 32",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Identify the major products A and B respectively in the reaction: 1-Methylcyclohexanol $\\xrightarrow{\\text{Conc. H}_2\\text{SO}_4, \\Delta} A ; \\text{1-Methylcyclohexanol} \\xrightarrow{\\text{CH}_3\\text{COCl/Pyridine}} B$",
    imageUrl: null,
    optionA: "(1) A = 1-Methylcyclohexene and B = 1-Methylcyclohexyl acetate",
    optionB: "(2) A = 1-Methylcyclohexene and B = 1-Methylcyclohexanol",
    optionC: "(3) A = Methylenecyclohexane and B = 1-Methylcyclohexyl acetate",
    optionD: "(4) A = Methylenecyclohexane and B = 1-Methylcyclohexanol",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Given below are two statements : One is labelled as Assertion A and the other is labelled as Reason R:\nAssertion A : The stability order of +1 oxidation state of Ga, In and Tl is Ga < In < Tl.\nReason R : The inert pair effect stabilizes the lower oxidation state down the group.\nIn the light of the above statements, choose the correct answer from the options given below :",
    imageUrl: null,
    optionA: "(1) Both A and R are true and R is the correct explanation of A.",
    optionB: "(2) A is true but R is false.",
    optionC: "(3) Both A and R are true but R is NOT the correct explanation of A.",
    optionD: "(4) A is false but R is true.",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List I with List-II\nList I (Name of test): A. Borax bead test, B. Charcoal cavity test, C. Cobalt nitrate test, D. Flame test\nList II (Reaction sequence involved) [M is metal]:\nI. $\\text{MCO}_3 \\to \\text{MO} \\xrightarrow{\\text{Co(NO}_3)_2, +\\Delta} \\text{CoO.MO}$\nII. $\\text{MCO}_3 \\to \\text{MCl}_2 \\to \\text{M}^{2+}$\nIII. $\\text{MSO}_4 \\xrightarrow{\\text{Na}_2\\text{B}_4\\text{O}_7, \\Delta} \\text{M(BO}_2)_2 \\to \\text{MBO}_2 \\to \\text{M}$\nIV. $\\text{MSO}_4 \\xrightarrow{\\text{Na}_2\\text{CO}_3, \\Delta} \\text{MCO}_3 \\to \\text{MO} \\to \\text{M}$",
    imageUrl: null,
    optionA: "(1) A - III, B - I, C - IV, D - II",
    optionB: "(2) A - III, B - II, C - IV, D - I",
    optionC: "(3) A - III, B - I, C - II, D - IV",
    optionD: "(4) A - III, B - IV, C - I, D - II",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List I with List II\nList I (Molecule): A. $\\text{NH}_3$, B. $\\text{BrF}_5$, C. $\\text{PCl}_5$, D. $\\text{CH}_4$\nList II (Shape): I. Square pyramid, II. Tetrahedral, III. Trigonal pyramidal, IV. Trigonal bipyramidal",
    imageUrl: null,
    optionA: "(1) A - IV, B - III, C - I, D - II",
    optionB: "(2) A - II, B - IV, C - I, D - III",
    optionC: "(3) A - III, B - I, C - IV, D - II",
    optionD: "(4) A - III, B - IV, C - I, D - II",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "For the given hypothetical reactions, the equilibrium constants are as follows: $X \\rightleftharpoons Y ; K_1 = 1.0, Y \\rightleftharpoons Z ; K_2 = 2.0, Z \\rightleftharpoons W ; K_3 = 4.0$. The equilibrium constant for the reaction $X \\rightleftharpoons W$ is",
    imageUrl: null,
    optionA: "(1) 6.0",
    optionB: "(2) 12.0",
    optionC: "(3) 8.0",
    optionD: "(4) 7.0",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Thiosulphate reacts differently with iodine and bromine in the reaction given below : $2\\text{S}_2\\text{O}_3^{2-} + \\text{I}_2 \\to \\text{S}_4\\text{O}_6^{2-} + 2\\text{I}^-$ and $\\text{S}_2\\text{O}_3^{2-} + 5\\text{Br}_2 + 5\\text{H}_2\\text{O} \\to 2\\text{SO}_4^{2-} + 4\\text{Br}^- + 10\\text{H}^+$. Which statement justifies dual behaviour?",
    imageUrl: null,
    optionA: "(1) Bromine undergoes oxidation and iodine undergoes reduction by iodine in these reactions",
    optionB: "(2) Thiosulphate undergoes oxidation by bromine and reduction by iodine in these reaction",
    optionC: "(3) Bromine is a stronger oxidant than iodine",
    optionD: "(4) Bromine is a weaker oxidant than iodine",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "An octahedral complex with the formula $\\text{CoCl}_3 \\cdot n\\text{NH}_3$ upon reaction with excess of $\\text{AgNO}_3$ solution given 2 moles of AgCl. Consider the oxidation state of Co in the complex is 'x'. The value of \"$x + n$\" is _____.",
    imageUrl: null,
    optionA: "(1) 3",
    optionB: "(2) 6",
    optionC: "(3) 8",
    optionD: "(4) 5",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The incorrect statement regarding Glucose structure (open chain form) is:",
    imageUrl: null,
    optionA: "(1) Can be oxidized to a dicarboxylic acid with $\\text{Br}_2$ water",
    optionB: "(2) despite the presence of – CHO does not give Schiff's test",
    optionC: "(3) has 4-asymmetric carbon atom",
    optionD: "(4) will coexist in equilibrium with 2 other cyclic structure",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "In 2-methylbutane, the number of $2^\\circ$ carbon atom/s is _____.",
    imageUrl: null,
    optionA: "(1) Three",
    optionB: "(2) One",
    optionC: "(3) Two",
    optionD: "(4) Four",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following are aromatic? (A. Naphthalene, B. Toluene, C. Azulene, D. Cyclooctatetraene)",
    imageUrl: null,
    optionA: "(1) B and D only",
    optionB: "(2) A and C only",
    optionC: "(3) A and B only",
    optionD: "(4) C and D only",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Among the following halogens $\\text{F}_2, \\text{Cl}_2, \\text{Br}_2$ and $\\text{I}_2$. Which can undergo disproportionation reaction?",
    imageUrl: null,
    optionA: "(1) Only $\\text{I}_2$",
    optionB: "(2) $\\text{Cl}_2, \\text{Br}_2$ and $\\text{I}_2$",
    optionC: "(3) $\\text{F}_2, \\text{Cl}_2$ and $\\text{Br}_2$",
    optionD: "(4) $\\text{F}_2$ and $\\text{Cl}_2$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Given below are two statements: Statement I : $\\text{N(CH}_3)_3$ and $\\text{P(CH}_3)_3$ can act as ligands to form transition metal complexes. Statement II: As N and P are from same group, the nature of bonding of $\\text{N(CH}_3)_3$ and $\\text{P(CH}_3)_3$ is always same with transition metals.",
    imageUrl: null,
    optionA: "(1) Statement I is incorrect but Statement II is correct",
    optionB: "(2) Both Statement I and Statement II are correct",
    optionC: "(3) Statement I is correct but Statement II is incorrect",
    optionD: "(4) Both Statement I and Statement II are incorrect",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List I with List II\nList I (Elements): A. Cl, S, B. Ge, As, C. Fr, Ra, D. F, O\nList II (Properties): I. Elements with highest electronegativity, II. Elements with largest atomic size, III. Elements which show properties of both metals and non metal, IV. Elements with highest negative electron gain enthalpy",
    imageUrl: null,
    optionA: "(1) A - II, B - III, C - IV, D - I",
    optionB: "(2) A - III, B - II, C - I, D - IV",
    optionC: "(3) A - IV, B - III, C - II, D - I",
    optionD: "(4) A - II, B - I, C - IV, D - III",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Iron (III) catalyses the reaction between iodide and persulphate ions, in which\nA. $\\text{Fe}^{3+}$ oxidises the iodide ion\nB. $\\text{Fe}^{3+}$ oxidises the persulphate ion\nC. $\\text{Fe}^{2+}$ reduces the iodide ion\nD. $\\text{Fe}^{2+}$ reduces the persulphate ion\nChoose the most appropriate answer from the options given below:",
    imageUrl: null,
    optionA: "(1) B and C only",
    optionB: "(2) B only",
    optionC: "(3) A only",
    optionD: "(4) A and D only",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List I with List II\nList I: A. $\\text{Fe}_4[\\text{Fe(CN)}_6]_3 \\cdot x\\text{H}_2\\text{O}$, B. $[\\text{Fe(CN)}_5\\text{NOS}]^{4-}$, C. $[\\text{Fe(SCN)}]^{2+}$, D. $(\\text{NH}_4)_3\\text{PO}_4 \\cdot 12\\text{MoO}_3$\nList II: I. Violet, II. Blood Red, III. Prussian Blue, IV. Yellow",
    imageUrl: null,
    optionA: "(1) A - III, B - I, C - II, D - IV",
    optionB: "(2) A - IV, B - I, C - II, D - III",
    optionC: "(3) A - II, B - III, C - IV, D - I",
    optionD: "(4) A - I, B - II, C - III, D - IV",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Number of complexes with even number of electrons in $t_{2g}$ orbitals is - $[\\text{Fe}(\\text{H}_2\\text{O})_6]^{2+}, [\\text{Co}(\\text{H}_2\\text{O})_6]^{2+}, [\\text{Co}(\\text{H}_2\\text{O})_6]^{3+}, [\\text{Cu}(\\text{H}_2\\text{O})_6]^{2+}, [\\text{Cr}(\\text{H}_2\\text{O})_6]^{2+}$",
    imageUrl: null,
    optionA: "(1) 1",
    optionB: "(2) 3",
    optionC: "(3) 2",
    optionD: "(4) 5",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Identify the product (P) in Hell-Volhard-Zelinsky reaction of cyclopentanecarboxylic acid with $\\text{Br}_2 / \\text{Red P}$ followed by $\\text{H}_2\\text{O}$:",
    imageUrl: null,
    optionA: "(1) 1-Bromocyclopentanecarboxylic acid",
    optionB: "(2) Cyclopentanecarbonyl bromide",
    optionC: "(3) 1-Bromocyclopentanecarbaldehyde",
    optionD: "(4) 2-Bromocyclopentanecarboxylic acid",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "A hypothetical electromagnetic wave has frequency $x \\times 10^{19}\\text{ Hz}$ for wavelength 1.5 pm. x = nearest integer is ________.",
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
    questionText: "1 mol of an ideal gas is kept in a cylinder, fitted with a piston, at position A (10L), at $18^\\circ\\text{C}$. If piston is moved to position B (90L) at constant temperature, work done in reversible expansion is 'x' L atm. x = ________ L atm. (nearest integer). ($R = 0.08206\\text{ L atm mol}^{-1}\\text{K}^{-1}$)",
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
    subject: "Chemistry",
    questionText: "Number of amine compounds from the following giving solids which are soluble in NaOH upon reaction with Hinsberg's reagent is _____.",
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
    questionText: "The number of optical isomers in 1-bromo-2-methylcyclohexane is : _____.",
    imageUrl: null,
    optionA: "32",
    optionB: "32",
    optionC: "32",
    optionD: "32",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "The 'spin only' magnetic moment value of $MO_4^{2-}$ is ____ BM. (Where M is a metal having least metallic radii among Sc, Ti, V, Cr, Mn and Zn).",
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
    questionText: "Number of molecules from the following which are exceptions to octet rule is _____\\n$\\text{CO}_2, \\text{NO}_2, \\text{H}_2\\text{SO}_4, \\text{BF}_3, \\text{CH}_4, \\text{SiF}_4, \\text{ClO}_2, \\text{PCl}_5, \\text{BeF}_2, \\text{C}_2\\text{H}_6, \\text{CHCl}_3, \\text{CBr}_4$",
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
    questionText: "If 279 g of aniline is reacted with one equivalent of benzenediazonium chloride, the maximum amount of aniline yellow formed will be _____ g. (nearest integer)",
    imageUrl: null,
    optionA: "591",
    optionB: "591",
    optionC: "591",
    optionD: "591",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Reaction $A + B \\to C$. Time for A to become 1/4th initial concentration is twice time taken to become 1/2. Plot of [B] vs time gives straight line with negative slope. Overall order is ____.",
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
    questionText: "Ethylbenzene $\\xrightarrow{\\text{KMnO}_4-\\text{KOH}} A \\xrightarrow{\\text{HNO}_3/\\text{H}_2\\text{SO}_4} B$. Major product B has ____ $\\pi$-bond.",
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
    questionText: "A solution containing 10g of an electrolyte $AB_2$ in 100g of water boils at $100.52^\\circ\\text{C}$. The degree of ionization of the electrolyte ($\\alpha$) is _____ $\\times 10^{-1}$. ($M_{AB_2} = 200\\text{ g mol}^{-1}, K_b = 0.52\\text{ K kg mol}^{-1}$)",
    imageUrl: null,
    optionA: "5",
    optionB: "5",
    optionC: "5",
    optionD: "5",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── PHYSICS (Q61 - Q90) ──
  {
    subject: "Physics",
    questionText: "A cylindrical wire of mass $(0.4 \\pm 0.01)\\text{g}$ has length $(8 \\pm 0.04)\\text{ cm}$ and radius $(6 \\pm 0.03)\\text{ mm}$. The maximum error in its density will be:",
    imageUrl: null,
    optionA: "(1) 4%",
    optionB: "(2) 1%",
    optionC: "(3) 3.5%",
    optionD: "(4) 5%",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The engine of a train moving with speed $10\\text{ ms}^{-1}$ towards a platform sounds a whistle at frequency 400 Hz. The frequency heard by a passenger inside the train is : (neglect air speed. Speed of sound in air = $330\\text{ ms}^{-1}$)",
    imageUrl: null,
    optionA: "(1) 400 Hz",
    optionB: "(2) 388 Hz",
    optionC: "(3) 200 Hz",
    optionD: "(4) 412 Hz",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The weight of a body on the earth is 400 N. Then weight of the body when taken to a depth half of the radius of the earth will be:",
    imageUrl: null,
    optionA: "(1) 300 N",
    optionB: "(2) Zero",
    optionC: "(3) 100 N",
    optionD: "(4) 200 N",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A TV transmitting antenna is 98 m high and the receiving antenna is at the ground level. If the radius of the earth is 6400 km, the surface area covered by the transmitting antenna is approximately:",
    imageUrl: null,
    optionA: "(1) $120\\text{ km}^2$",
    optionB: "(2) $1549\\text{ km}^2$",
    optionC: "(3) $4868\\text{ km}^2$",
    optionD: "(4) $3942\\text{ km}^2$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Certain galvanometers have a fixed core made of non magnetic metallic material. The function of this metallic material is",
    imageUrl: null,
    optionA: "(1) To produce large deflecting torque on the coil",
    optionB: "(2) To bring the coil to rest quickly",
    optionC: "(3) To oscillate the coil in magnetic field for longer period of time",
    optionD: "(4) To make the magnetic field radial",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Dimension of $\\frac{1}{\\mu_0 \\epsilon_0}$ should be equal to",
    imageUrl: null,
    optionA: "(1) $\\frac{T}{L}$",
    optionB: "(2) $\\frac{T^2}{L^2}$",
    optionC: "(3) $\\frac{L}{T}$",
    optionD: "(4) $\\frac{L^2}{T^2}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Two projectiles A and B are thrown with initial velocities of 40 m/s and 60 m/s at angles $30^\\circ$ and $60^\\circ$ with the horizontal respectively. The ratio of their ranges respectively is ($g = 10\\text{ m/s}^2$)",
    imageUrl: null,
    optionA: "(1) $2 : \\sqrt{3}$",
    optionB: "(2) $\\sqrt{3} : 2$",
    optionC: "(3) 4 : 9",
    optionD: "(4) 1 : 1",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In this figure the resistance of the coil of galvanometer G is $2\\Omega$. The emf of the cell is 4 V. The ratio of potential difference across $C_1$ and $C_2$ is:",
    imageUrl: null,
    optionA: "(1) 5/4",
    optionB: "(2) 1",
    optionC: "(3) 4/5",
    optionD: "(4) 3/4",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A charge particle moving in magnetic field B, has the components of velocity along B as well as perpendicular to B. The path of the charge particle will be",
    imageUrl: null,
    optionA: "(1) Helical path with the axis along magnetic field B",
    optionB: "(2) Straight along the direction of magnetic field B",
    optionC: "(3) Helical path with the axis perpendicular to the direction of magnetic field B",
    optionD: "(4) Circular path",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Proton (P) and electron (e) will have same de-Broglie wavelength when the ratio of their momentum is (assume, $m_p = 1849 m_e$):",
    imageUrl: null,
    optionA: "(1) 1 : 43",
    optionB: "(2) 43 : 1",
    optionC: "(3) 1 : 1849",
    optionD: "(4) 1 : 1",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Graphical variation of electric field due to a uniformly charged insulating solid sphere of radius R, with distance r from the centre O is represented by:",
    imageUrl: null,
    optionA: "(1) Linear from 0 to R, then inverse square curve",
    optionB: "(2) Constant till R",
    optionC: "(3) Parabolic till R",
    optionD: "(4) Inverse linear curve",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "For a nucleus having mass number A and atomic number Z\\nA. The surface energy per nucleon $(b_s) = -a_1 A^{2/3}$.\\nB. The Coulomb contribution to the binding energy $b_c = -a_2 \\frac{Z(Z-1)}{A^{4/3}}$\\nC. The volume energy $b_v = a_3 A$\\nD. Decrease in the binding energy is proportional to surface area.\\nE. While estimating the surface energy, it is assumed that each nucleon interacts with 12 nucleons.\\nChoose the most appropriate answer from the options given below:",
    imageUrl: null,
    optionA: "(1) B, C only",
    optionB: "(2) A, B, C, D only",
    optionC: "(3) B, C, E only",
    optionD: "(4) C, D only",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "At any instant the velocity of a particle of mass 500 g is $(2t\\hat{i} + 3t^2\\hat{j})\\text{ ms}^{-1}$. If the force acting on the particle at $t = 1\\text{ s}$ is $(\\hat{i} + x\\hat{j})\\text{N}$. Then the value of x will be:",
    imageUrl: null,
    optionA: "(1) 2",
    optionB: "(2) 6",
    optionC: "(3) 3",
    optionD: "(4) 4",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Given below are two statements:\\nStatement I: If E be the total energy of a satellite moving around the earth, then its potential energy will be $E/2$\\nStatement II: The kinetic energy of a satellite revolving in an orbit is equal to the half the magnitude of total energy E.\\nIn the light of the above statements, choose the most appropriate answer from the options given below",
    imageUrl: null,
    optionA: "(1) Both Statement I and Statement II are incorrect",
    optionB: "(2) Statement I is incorrect but Statement II is correct",
    optionC: "(3) Statement I is correct but Statement II is incorrect",
    optionD: "(4) Both Statement I and Statement II are correct",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Two forces having magnitude A and A/2 are perpendicular to each other. The magnitude of their resultant is:",
    imageUrl: null,
    optionA: "(1) $\\frac{5A}{2}$",
    optionB: "(2) $\\frac{\\sqrt{5}A^2}{2}$",
    optionC: "(3) $\\frac{\\sqrt{5}A}{4}$",
    optionD: "(4) $\\frac{\\sqrt{5}A}{2}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "For the logic circuit shown with inputs A and B inverted feeding a NAND gate, the output waveform is low (0) when A=0, B=1 and high (1) when A=0, B=0. The output values for X and Y are:",
    imageUrl: null,
    optionA: "(1) 1, 1",
    optionB: "(2) 1, 0",
    optionC: "(3) 0, 1",
    optionD: "(4) 0, 0",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "$Y = 7.0 \\times 10^{10}\\text{ N/m}^2$ undergoes elastic strain of 0.04%. The energy per unit volume stored in the rod in SI unit is:",
    imageUrl: null,
    optionA: "(1) 5600",
    optionB: "(2) 2800",
    optionC: "(3) 11200",
    optionD: "(4) 8400",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Given below are two statements:\\nStatement I: If heat is added to a system, its temperature must increase.\\nStatement II: If positive work is done by a system in a thermodynamic process, its volume must increase.\\nIn the light of the above statements, choose the correct answer from the options given below",
    imageUrl: null,
    optionA: "(1) Both Statement I and Statement II are true",
    optionB: "(2) Both Statement I and Statement II are false",
    optionC: "(3) Statement I is true but Statement II is false",
    optionD: "(4) Statement I is false but Statement II is true",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "An air bubble of volume $1\\text{ cm}^3$ rises from the bottom of a lake 40 m deep to the surface at a temperature of $12^\\circ\\text{C}$. The atmospheric pressure is $1 \\times 10^5\\text{ Pa}$, density of water is $1000\\text{ kg/m}^3$ and $g = 10\\text{ m/s}^2$. There is no difference of temperature of water at depth of 40 m and on surface. The volume of air bubble when it reaches surface will be:",
    imageUrl: null,
    optionA: "(1) $3\\text{ cm}^3$",
    optionB: "(2) $4\\text{ cm}^3$",
    optionC: "(3) $2\\text{ cm}^3$",
    optionD: "(4) $5\\text{ cm}^3$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In a reflecting telescope, a secondary mirror is used to:",
    imageUrl: null,
    optionA: "(1) Make chromatic aberration zero",
    optionB: "(2) Reduce the problem of mechanical support",
    optionC: "(3) Move the eyepiece outside the telescopic tube",
    optionD: "(4) Remove spherical aberration",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The momentum of a body is increased by 50%. The percentage increase in the kinetic energy of the body is _________ %",
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
    questionText: "A nucleus with mass number 242 and binding energy per nucleon as 7.6 MeV breaks into two fragment each with mass number 121. If each fragment nucleus has binding energy per nucleon as 8.1 MeV, the total gain in binding energy is __________ MeV.",
    imageUrl: null,
    optionA: "121",
    optionB: "121",
    optionC: "121",
    optionD: "121",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "An electric dipole of dipole moment $6.0 \\times 10^{-6}\\text{ Cm}$ placed in a uniform electric field of $1.5 \\times 10^3\\text{ NC}^{-1}$ in such a way that dipole moment is along electric field. The work done in rotating dipole by $180^\\circ$ in this field will be __________ mJ.",
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
    subject: "Physics",
    questionText: "An organ pipe 40 cm long is open at both ends. The speed of sound in air is $360\\text{ ms}^{-1}$. The frequency of the second harmonic is __________ Hz.",
    imageUrl: null,
    optionA: "900",
    optionB: "900",
    optionC: "900",
    optionD: "900",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "The moment of inertia of a semicircular ring about an axis, passing through the center and perpendicular to the plane of ring, is $\\frac{1}{x}MR^2$, where R is the radius and M is the mass of the semicircular ring. The value of x will be __________.",
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
    questionText: "Two vertical parallel mirrors A and B are separated by 10 cm. A point object O is placed at a distance of 2 cm from mirror A. The distance of the second nearest image behind mirror A from the mirror A is _________ cm",
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
    subject: "Physics",
    questionText: "The magnetic intensity at the center of a long current carrying solenoid is found to be $1.6 \\times 10^3\\text{ Am}^{-1}$. If the number of turns is 8 per cm, then the current flowing through the solenoid is __________ A.",
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
    questionText: "A current of 2 A through a wire of cross-sectional area $25.0\\text{ mm}^2$. The number of free electrons in a cubic meter are $2.0 \\times 10^{28}$. The drift velocity of the electrons is ________ $\\times 10^{-6}\\text{ ms}^{-1}$ (given, charge on electron = $1.6 \\times 10^{-19}\\text{ C}$).",
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
    questionText: "An oscillating LC circuit consists of a 75 mH inductor and a $1.2\\mu\\text{F}$ capacitor. If the maximum charge to the capacitor is $2.7\\mu\\text{C}$. The maximum current in the circuit will be __________ mA.",
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
    questionText: "An air bubble of diameter 6 mm rises steadily through a solution of density $1750\\text{ kg/m}^3$ at the rate of 0.35 cm/s. The co-efficient of viscosity of the solution (neglect density of air) is __________ poise (given, $g = 10\\text{ ms}^{-2}$).",
    imageUrl: null,
    optionA: "10",
    optionB: "10",
    optionC: "10",
    optionD: "10",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  }
];

async function seedJee2024Apr08Shift1() {
  console.log(`🚀 Compiling JEE Main 2024 (08 Apr Shift 1) Paper with ${rawQuestions.length} questions...`);

  const paperData = {
    examName: "JEE Main",
    year: 2024,
    shiftName: "JEE Main 2024 (08 Apr Shift 1)",
    examDate: "2024-04-08T09:00:00Z",
    totalMarks: 300,
    totalQuestions: 90,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'JEE Main 2024 (08 Apr Shift 1).json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved paper JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding JEE Main 2024 (08 Apr Shift 1) into PostgreSQL via Prisma...`);
  
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
      name: "JEE Main 2024 (08 Apr Shift 1)"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "JEE Main 2024 (08 Apr Shift 1)",
      date: new Date("2024-04-08T09:00:00Z")
    }
  });
  console.log(`Created Shift "JEE Main 2024 (08 Apr Shift 1)" (ID: ${shift.id})`);

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

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for JEE Main 2024 (08 Apr Shift 1) into Database!`);
}

seedJee2024Apr08Shift1()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
