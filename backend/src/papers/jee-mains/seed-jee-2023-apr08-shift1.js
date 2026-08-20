const prisma = require('../../lib/prisma');
const fs = require('fs');
const path = require('path');

const rawQuestions = [
  // ── MATHEMATICS (Q1 - Q30) ──
  {
    subject: "Mathematics",
    questionText: "The area of the region $\{(x, y): x^2 \\le y \\le 8 - x^2, y \\le 7\}$ is",
    imageUrl: null,
    optionA: "(1) 24",
    optionB: "(2) 21",
    optionC: "(3) 20",
    optionD: "(4) 18",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $P = \\begin{bmatrix} \\frac{\\sqrt{3}}{2} & \\frac{1}{2} \\\\ -\\frac{1}{2} & \\frac{\\sqrt{3}}{2} \\end{bmatrix}$, $A = \\begin{bmatrix} 1 & 1 \\\\ 0 & 1 \\end{bmatrix}$ and $Q = P A P^T$. If $P^T Q^{2007} P = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$, then $2a + b - 3c - 4d$ equal to",
    imageUrl: null,
    optionA: "(1) 2004",
    optionB: "(2) 2007",
    optionC: "(3) 2005",
    optionD: "(4) 2006",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Negation of $(p \\to q) \\to (q \\to p)$ is",
    imageUrl: null,
    optionA: "(1) $(\\sim q) \\wedge p$",
    optionB: "(2) $p \\vee (\\sim q)$",
    optionC: "(3) $(\\sim p) \\vee q$",
    optionD: "(4) $q \\wedge (\\sim p)$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $C(\\alpha, \\beta)$ be the circumcenter of the triangle formed by the lines $4x + 3y = 69, 4y - 3x = 17$ and $x + 7y = 61$. Then $(\\alpha - \\beta)^2 + \\alpha + \\beta$ is equal to",
    imageUrl: null,
    optionA: "(1) 18",
    optionB: "(2) 15",
    optionC: "(3) 16",
    optionD: "(4) 17",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $\\alpha, \\beta, \\gamma$ be the three roots of the equation $x^3 + bx + c = 0$. If $\\beta\\gamma = 1 = -\\alpha$, then $b^3 + 2c^3 - 3\\alpha^3 - 6\\beta^3 - 8\\gamma^3$ is equal to",
    imageUrl: null,
    optionA: "(1) 155/8",
    optionB: "(2) 21",
    optionC: "(3) 19",
    optionD: "(4) 169/8",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let the number of elements in sets A and B be five and two respectively. Then the number of subsets of $A \\times B$ each having at least 3 and at most 6 elements is:",
    imageUrl: null,
    optionA: "(1) 752",
    optionB: "(2) 772",
    optionC: "(3) 782",
    optionD: "(4) 792",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If the coefficients of three consecutive terms in the expansion of $(1 + x)^n$ are in the ratio $1 : 5 : 20$, then the coefficient of the fourth term is",
    imageUrl: null,
    optionA: "(1) 5481",
    optionB: "(2) 3654",
    optionC: "(3) 2436",
    optionD: "(4) 1817",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let R be the focus of the parabola $y^2 = 20x$ and the line $y = mx + c$ intersect the parabola at two points P and Q. Let the point G(10, 10) be the centroid of the triangle PQR. If $c - m = 6$, then $(PQ)^2$ is",
    imageUrl: null,
    optionA: "(1) 325",
    optionB: "(2) 346",
    optionC: "(3) 296",
    optionD: "(4) 317",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $S_K = \\frac{1+2+\\dots+K}{K}$ and $\\sum_{j=1}^n S_j^2 = \\frac{n}{A}(B n^2 + C n + D)$, where $A, B, C, D \\in \\mathbb{N}$ and A has least value. Then",
    imageUrl: null,
    optionA: "(1) A + B is divisible by D",
    optionB: "(2) A + B = 5 (D – C)",
    optionC: "(3) A + C + D is not divisible by B",
    optionD: "(4) A + B + D is divisible by 5",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The shortest distance between the lines $\\frac{x-4}{4} = \\frac{y+2}{5} = \\frac{z+3}{3}$ and $\\frac{x-1}{3} = \\frac{y-3}{4} = \\frac{z-4}{2}$ is",
    imageUrl: null,
    optionA: "(1) $2\\sqrt{6}$",
    optionB: "(2) $3\\sqrt{6}$",
    optionC: "(3) $6\\sqrt{3}$",
    optionD: "(4) $6\\sqrt{2}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The number of arrangements of the letters of the word “INDEPENDENCE” in which all the vowels always occur together is.",
    imageUrl: null,
    optionA: "(1) 16800",
    optionB: "(2) 14800",
    optionC: "(3) 18000",
    optionD: "(4) 33600",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If the points with position vectors $\\alpha\\hat{i} + 10\\hat{j} + 13\\hat{k}, 6\\hat{i} + 11\\hat{j} + 11\\hat{k}, \\frac{9}{2}\\hat{i} + \\beta\\hat{j} - 8\\hat{k}$ are collinear, then $(19\\alpha - 6\\beta)^2$ is equal to",
    imageUrl: null,
    optionA: "(1) 49",
    optionB: "(2) 36",
    optionC: "(3) 25",
    optionD: "(4) 16",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "In a bolt factory, machines A, B and C manufacture respectively 20%, 30% and 50% of the total bolts. Of their output 3, 4 and 2 percent are respectively defective bolts. A bolt is drawn at random form the product. If the bolt drawn is found the defective, then the probability that it is manufactured by the machine C is.",
    imageUrl: null,
    optionA: "(1) 5/14",
    optionB: "(2) 3/7",
    optionC: "(3) 9/28",
    optionD: "(4) 2/7",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If for $z = \\alpha + i\\beta, |z + 2| = z + 4(1 + i)$, then $\\alpha + \\beta$ and $\\alpha\\beta$ are the roots of the equation",
    imageUrl: null,
    optionA: "(1) $x^2 + 3x - 4 = 0$",
    optionB: "(2) $x^2 + 7x + 12 = 0$",
    optionC: "(3) $x^2 + x - 12 = 0$",
    optionD: "(4) $x^2 + 2x - 3 = 0$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$\\lim_{x\\to 0} \\left(\\left(\\frac{1-\\cos^2(3x)}{\\cos^3(4x)}\\right) \\left(\\frac{\\sin^3(4x)}{(\\log_e(2x+1))^5}\\right)\\right)$ is equal to",
    imageUrl: null,
    optionA: "(1) 24",
    optionB: "(2) 9",
    optionC: "(3) 18",
    optionD: "(4) 15",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The number of ways, in which 5 girls and 7 boys can be seated at a round table so that no two girls sit together, is",
    imageUrl: null,
    optionA: "(1) $7(720)^2$",
    optionB: "(2) 720",
    optionC: "(3) $7(360)^2$",
    optionD: "(4) $126(5!)^2$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $f(x) = \\frac{\\sin x + \\cos x - \\sqrt{2}}{\\sin x - \\cos x}, x \\in [0, \\pi] - \\{\\frac{\\pi}{4}\\}$. Then $f(\\frac{7\\pi}{12}) f''(\\frac{7\\pi}{12})$ is equal to",
    imageUrl: null,
    optionA: "(1) -2/3",
    optionB: "(2) 2/9",
    optionC: "(3) $-1/(3\\sqrt{3})$",
    optionD: "(4) $2/(3\\sqrt{3})$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If the equation of the plane containing the line $x + 2y + 3z - 4 = 0 = 2x + y - z + 5$ and perpendicular to the plane $\\vec{r} = (\\hat{i} - \\hat{j}) + \\lambda(\\hat{i} + \\hat{j} + \\hat{k}) + \\mu(\\hat{i} - 2\\hat{j} + 3\\hat{k})$ is $ax + by + cz = 4$, then $(a - b + c)$ is equal to",
    imageUrl: null,
    optionA: "(1) 22",
    optionB: "(2) 24",
    optionC: "(3) 20",
    optionD: "(4) 18",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $A = \\begin{bmatrix} 2 & 1 & 0 \\\\ 1 & 2 & -1 \\\\ 0 & -1 & 2 \\end{bmatrix}$. If $|\\text{adj}(\\text{adj}(\\text{adj } 2A))| = (16)^n$, then n is equal to",
    imageUrl: null,
    optionA: "(1) 8",
    optionB: "(2) 9",
    optionC: "(3) 12",
    optionD: "(4) 10",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $I(x) = \\int \\frac{(x+1)}{x(1+xe^x)^2} dx, x > 0$. $\\lim_{x\\to\\infty} I(x) = 0$, then I(1) is equal to",
    imageUrl: null,
    optionA: "(1) $\\frac{e+1}{e+2} - \\log_e(e+1)$",
    optionB: "(2) $\\frac{e+2}{e+1} + \\log_e(e+1)$",
    optionC: "(3) $\\frac{e+2}{e+1} - \\log_e(e+1)$",
    optionD: "(4) $\\frac{e+1}{e+2} + \\log_e(e+1)$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $A = \\{0, 3, 4, 6, 7, 8, 9, 10\\}$ and R be the relation defined on A such that $R = \\{(x, y) \\in A \\times A: x - y \\text{ is odd positive integer or } x - y = 2\\}$. The minimum number of elements that must be added to the relation R, so that it is a symmetric relation, is equal to ______.",
    imageUrl: null,
    optionA: "19",
    optionB: "19",
    optionC: "19",
    optionD: "19",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Let [t] denote the greatest integer $\\le t$. If the constant term in the expansion of $(3x^2 - \\frac{1}{2x^5})^7$ is $\\alpha$, then $[\\alpha]$ is equal to _____.",
    imageUrl: null,
    optionA: "1275",
    optionB: "1275",
    optionC: "1275",
    optionD: "1275",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Let $\\lambda_1, \\lambda_2$ be the values of $\\lambda$ for which the points $(\\frac{5}{2}, 1, \\lambda)$ and (–2, 0, 1) are at equal distance from the plane $2x + 3y - 6z + 7 = 0$. If $\\lambda_1 > \\lambda_2$, then the distance of the point $(\\lambda_1 - \\lambda_2, \\lambda_2, \\lambda_1)$ from the line $\\frac{x-5}{1} = \\frac{y-1}{2} = \\frac{z+7}{2}$ is",
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
    questionText: "If the solution curve of the differential equation $(y - 2\\log_e x)dx + (x\\log_e x^2)dy = 0, x > 1$ passes through the points $(e, 4/3)$ and $(e^4, \\alpha)$, then $\\alpha$ is equal to ______.",
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
    questionText: "Let $\\vec{a} = 6\\hat{i} + 9\\hat{j} + 12\\hat{k}, \\vec{b} = \\alpha\\hat{i} + 11\\hat{j} - 2\\hat{k}$ and $\\vec{c}$ be vectors such that $\\vec{a} \\times \\vec{c} = \\vec{a} \\times \\vec{b}, \\vec{a} \\cdot \\vec{c} = -12, \\vec{c} \\cdot (\\hat{i} - 2\\hat{j} + \\hat{k}) = 5$ then $\\vec{c} \\cdot (\\hat{i} + \\hat{j} + \\hat{k})$ is equal to ________.",
    imageUrl: null,
    optionA: "11",
    optionB: "11",
    optionC: "11",
    optionD: "11",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "The largest natural number n such that $3^n$ divides $66!$ is ______.",
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
    subject: "Mathematics",
    questionText: "If $a_0$ is the greatest term in the sequence $a_n = \\frac{n^3}{n^4+147}, n = 1, 2, 3, \\dots$, then a is equal to _______________.",
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
    questionText: "Let the mean and variance of 8 numbers x, y, 10, 12, 6, 12, 4, 8 be 9 and 9.25 respectively. If $x > y$, then $3x - 2y$ is equal to _________.",
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
    subject: "Mathematics",
    questionText: "Consider a circle $C_1 : x^2 + y^2 - 4x - 2y = a - 5$. Let its mirror image in the line $y = 2x + 1$ be another circle $C_2 : 5x^2 + 5y^2 - 10fx - 10gy + 36 = 0$. Let r be the radius of $C_2$. Then $\\alpha + r$ is equal to _________.",
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
    questionText: "Let [t] denote the greatest integer $\\le t$. Then $\\frac{2}{\\pi}\\int_{\\pi/6}^{5\\pi/6} (8[\\csc x] - 5[\\cot x])dx$ is equal to ________.",
    imageUrl: null,
    optionA: "14",
    optionB: "14",
    optionC: "14",
    optionD: "14",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── CHEMISTRY (Q31 - Q60) ──
  {
    subject: "Chemistry",
    questionText: "The reaction $\\frac{1}{2}\\text{H}_{2(g)} + \\text{AgCl}_{(s)} \\rightleftharpoons \\text{H}^+_{(aq)} + \\text{Cl}^-_{(aq)} + \\text{Ag}_{(s)}$ occurs in which of the given galvanic cell.",
    imageUrl: null,
    optionA: "(1) $\\text{Pt} | \\text{H}_2(g) | \\text{HCl}(sol^n) | \\text{AgNO}_3(sol^n) | \\text{Ag}$",
    optionB: "(2) $\\text{Pt} | \\text{H}_2(g) | \\text{HCl}(sol^n) | \\text{AgCl}(s) | \\text{Ag}$",
    optionC: "(3) $\\text{Pt} | \\text{H}_2(g) | \\text{KCl}(sol^n) | \\text{AgCl}(s) | \\text{Ag}$",
    optionD: "(4) $\\text{Ag} | \\text{AgCl}(s) | \\text{KCl}(sol^n) | \\text{AgNO}_3 | \\text{Ag}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Sulphur (S) containing amino acids from the following are: (a) isoleucine, (b) cysteine, (c) lysine, (d) methionine, (e) glutamic acid",
    imageUrl: null,
    optionA: "(1) b, c, e",
    optionB: "(2) a, d",
    optionC: "(3) a, b, c",
    optionD: "(4) b, d",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following complex is octahedral, diamagnetic and the most stable?",
    imageUrl: null,
    optionA: "(1) $K_3[Co(CN)_6]$",
    optionB: "(2) $[Ni(NH_3)_6]Cl_2$",
    optionC: "(3) $[Co(H_2O)_6]Cl_2$",
    optionD: "(4) $Na_3[CoCl_6]$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following metals can be extracted through alkali leaching technique?",
    imageUrl: null,
    optionA: "(1) Cu",
    optionB: "(2) Au",
    optionC: "(3) Pb",
    optionD: "(4) Sn",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The correct order of spin only magnetic moments for the following complex ions is",
    imageUrl: null,
    optionA: "(1) $[CoF_6]^{3-} < [MnBr_4]^{2-} < [Fe(CN)_6]^{3-} < [Mn(CN)_6]^{3-}$",
    optionB: "(2) $[Fe(CN)_6]^{3-} < [CoF_6]^{3-} < [MnBr_4]^{2-} < [Mn(CN)_6]^{3-}$",
    optionC: "(3) $[MnBr_4]^{2-} < [CoF_6]^{3-} < [Fe(CN)_6]^{3-} < [Mn(CN)_6]^{3-}$",
    optionD: "(4) $[Fe(CN)_6]^{3-} < [Mn(CN)_6]^{3-} < [CoF_6]^{3-} < [MnBr_4]^{2-}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The water gas on reacting with cobalt as a catalyst forms",
    imageUrl: null,
    optionA: "(1) Methanoic acid",
    optionB: "(2) Methanal",
    optionC: "(3) Ethanol",
    optionD: "(4) Methanol",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: " $2\\text{IO}_3^- + x\\text{I}^- + 12\\text{H}^+ \\to 6\\text{I}_2 + 6\\text{H}_2\\text{O}$. What is the value of x?",
    imageUrl: null,
    optionA: "(1) 12",
    optionB: "(2) 10",
    optionC: "(3) 2",
    optionD: "(4) 6",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "What is the purpose of adding gypsum to cement?",
    imageUrl: null,
    optionA: "(1) To give a hard mass",
    optionB: "(2) To speed up the process of setting",
    optionC: "(3) To facilitate the hydration of cement",
    optionD: "(4) To slow down the process of setting",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Reduction of ethyl 4-phenylbutanoate with $\\text{LiBH}_4 / \\text{EtOH}$ gives major product:",
    imageUrl: null,
    optionA: "(1) 4-Phenylbutan-1-ol",
    optionB: "(2) 4-Phenylbutanoic acid",
    optionC: "(3) 4-Phenylbutane-1,2-diol",
    optionD: "(4) 4-Phenylbutanol",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match list I with list II:\nList I (species): A. $\\text{F}^-$, B. $\\text{SO}_4^{2-}$, C. $\\text{NO}_3^-$, D. Zn\nList II (Maximum allowed concentration in ppm in drinking water): I. <50 ppm, II. <5 ppm, III. <2 ppm, IV. <500 ppm",
    imageUrl: null,
    optionA: "(1) A - III, B - II, C - I, D - IV",
    optionB: "(2) A - II, B - I, C - III, D - IV",
    optionC: "(3) A - IV, B - III, C - II, D - I",
    optionD: "(4) A - I, B - II, C - III, D - IV",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "In chromyl chloride, the number of d-electrons present on chromium is same as in (Cr: 24, Ti: 22, V: 23, Mn: 25, Fe: 26)",
    imageUrl: null,
    optionA: "(1) Fe (III)",
    optionB: "(2) V (IV)",
    optionC: "(3) Ti (III)",
    optionD: "(4) Mn (VII)",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Assertion A: Butan-1-ol has higher boiling point than ethoxyethane.\nReason R: Extensive hydrogen bonding leads to stronger association of molecules.\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both A and R are true but R is not the correct explanation of A",
    optionB: "(2) Both A and R are true and R is the correct explanation of A",
    optionC: "(3) A is false but R is true",
    optionD: "(4) A is true but R is false",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List I (Reagents) with List II (Compound detected):\nA. Alkaline Fehling/Benedict solution -> I. Phenol\nB. Neutral $\\text{FeCl}_3$ -> II. Primary amine\nC. Alkaline chloroform -> III. Aldehyde\nD. $\\text{KI/NaOCl}$ -> IV. Methyl ketone",
    imageUrl: null,
    optionA: "(1) A - III, B - IV, C - II, D - I",
    optionB: "(2) A - II, B - IV, C - III, D - I",
    optionC: "(3) A - IV, B - I, C - II, D - III",
    optionD: "(4) A - III, B - IV, C - I, D - II",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Benzenediazonium chloride is reacted with reagents in List I to form products in List II.\nReagents: A. Aniline, B. $\\text{HBF}_4, \\Delta$, C. Cu, HCl, D. CuCN/KCN\nProducts: I. Fluorobenzene, II. Benzonitrile, III. p-Aminoazobenzene, IV. Chlorobenzene",
    imageUrl: null,
    optionA: "(1) A - I, B - III, C - IV, D - II",
    optionB: "(2) A - III, B - I, C - II, D - IV",
    optionC: "(3) A - III, B - I, C - IV, D - II",
    optionD: "(4) A - IV, B - III, C - II, D - I",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List I with List II:\nA. Saccharin -> I. High potency sweetener\nB. Aspartame -> II. First artificial sweetening agent\nC. Alitame -> III. Stable at cooking temperature\nD. Sucralose -> IV. Unstable at cooking temperature",
    imageUrl: null,
    optionA: "(1) A - II, B - III, C - IV, D - I",
    optionB: "(2) A - II, B - IV, C - I, D - III",
    optionC: "(3) A - IV, B - III, C - I, D - II",
    optionD: "(4) A - II, B - IV, C - III, D - I",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The correct order of electronegativity for given elements is:",
    imageUrl: null,
    optionA: "(1) P > Br > C > At",
    optionB: "(2) C > P > At > Br",
    optionC: "(3) Br > P > At > C",
    optionD: "(4) Br > C > At > P",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: Lithium and Magnesium do not form superoxide.\nStatement II: The ionic radius of $\\text{Li}^+$ is larger than ionic radius of $\\text{Mg}^{2+}$.\nIn the light of the above statements, choose the most appropriate answer:",
    imageUrl: null,
    optionA: "(1) Statement I is correct but Statement II is incorrect",
    optionB: "(2) Statement I is incorrect but Statement II is correct",
    optionC: "(3) Both statement I and Statement II are correct",
    optionD: "(4) Both statement I and Statement II are incorrect",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following represent the Freundlich adsorption isotherms?",
    imageUrl: null,
    optionA: "(1) x/m vs log p curve",
    optionB: "(2) log(x/m) vs log p linear graph",
    optionC: "(3) x/m vs c linear graph",
    optionD: "(4) x/m vs p^(1/n) linear graph",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which halogen is known to cause the reaction given below: $2\\text{Cu}^{2+} + 4X^- \\to \\text{Cu}_2X_{2(s)} + X_2$",
    imageUrl: null,
    optionA: "(1) All halogens",
    optionB: "(2) Only chlorine",
    optionC: "(3) Only Bromine",
    optionD: "(4) Only Iodine",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Choose the halogen position which is most reactive towards $S_N1$ reaction in given compounds:",
    imageUrl: null,
    optionA: "(1) A - Br(a); B - I(a); C - Br(b); D - Br(a)",
    optionB: "(2) A - Br(b); B - I(a); C - Br(a); D - Br(a)",
    optionC: "(3) A - Br(b); B - I(b); C - Br(b); D - Br(b)",
    optionD: "(4) A - Br(a); B - I(a); C - Br(a); D - Br(a)",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The number of given statement/s which is/are correct is______\n1) The stronger the temperature dependence of the rate constant, the higher is the activation energy.\n2) If a reaction has zero activation energy, its rate is independent of temperature.\n3) The stronger the temperature dependence of the rate constant, the smaller is the activation energy\n4) If there is no correlation between the temperature and the rate constant then it means that the reaction has negative activation energy.",
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
    questionText: "Three bulbs are filled with $\\text{CH}_4 (2\\text{atm, 2L}), \\text{CO}_2 (4\\text{atm, 3L})$ and $\\text{Ne} (3\\text{atm, 4L})$. When the stopcocks are opened, the pressure of the system is found to be________ atm. (Nearest integer)",
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
    questionText: "The number of following factors which affect the percent covalent character of the ionic bond is_____\n1) Polarising power of cation\n2) Extent of distortion of anion\n3) Polarisability of the anion\n4) Polarising power of anion",
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
    questionText: "0.5 g of an organic compound (X) with 60% carbon will produce______$\\times 10^{-1}\\text{ g of CO}_2$ on complete combustion.",
    imageUrl: null,
    optionA: "11",
    optionB: "11",
    optionC: "11",
    optionD: "11",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "The boiling point of pure water solvent on V.P. vs Temp curve at 1 atm is ______$^\\circ\\text{C}$",
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
    questionText: "When a 60 W electric heater is immersed in a gas for 100s in a constant volume container with adiabatic walls, the temperature of the gas rises by $5^\\circ\\text{C}$. The heat capacity of the given gas is _______$\\text{J K}^{-1}$ (Nearest integer).",
    imageUrl: null,
    optionA: "1200",
    optionB: "1200",
    optionC: "1200",
    optionD: "1200",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Titration curve of weak acid vs strong base with phenolphthalein ($K_p = 4 \\times 10^{-10}$). Correct statement count is__________\\n1. Used for weak acid weak base titration.\\n2. Color change at pH 8.4.\\n3. Weak organic base.\\n4. Colourless in acidic medium.",
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
    questionText: "Number of incorrect statements regarding emission & absorption spectra is _________.",
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
    questionText: "$\\text{XeF}_4$ reacts with $\\text{SbF}_5$ to form $[\\text{XeF}_m]^{n+}[\\text{SbF}_y]^{z-}$. $m + n + y + z = \\text{__________}$.",
    imageUrl: null,
    optionA: "11",
    optionB: "11",
    optionC: "11",
    optionD: "11",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Molar mass of hydrocarbon (X) which on ozonolysis consumes 1 mole of $\\text{O}_3$ and gives 1 mole ethanal and 1 mole propanone is ___________$\\text{g mol}^{-1}$.",
    imageUrl: null,
    optionA: "70",
    optionB: "70",
    optionC: "70",
    optionD: "70",
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
    questionText: "The engine of a train moving with speed $10\\text{ ms}^{-1}$ towards a platform sounds a whistle at frequency 400 Hz. The frequency heard by a passenger inside the train is :",
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
    questionText: "A TV transmitting antenna is 98 m high and the receiving antenna is at the ground level. If the radius of the earth is 6400 km, the surface area covered by transmitting antenna is:",
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
    questionText: "Dimension of $\\frac{1}{\\mu_0\\epsilon_0}$ should be equal to",
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
    questionText: "Two projectiles A and B are thrown with initial velocities of 40 m/s and 60 m/s at angles $30^\\circ$ and $60^\\circ$ with the horizontal respectively. The ratio of their ranges respectively is",
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
    questionText: "Given below are two statements:\\nStatement I: If E be the total energy of a satellite moving around the earth, then its potential energy will be $E/2$\\nStatement II: The kinetic energy of a satellite revolving in an orbit is equal to the half the magnitude of total energy E.\\nIn the light of the above statements, choose the most appropriate answer:",
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
    questionText: "Given below are two statements:\\nStatement I: If heat is added to a system, its temperature must increase.\\nStatement II: If positive work is done by a system in a thermodynamic process, its volume must increase.",
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
    questionText: "An air bubble of volume $1\\text{ cm}^3$ rises from the bottom of a lake 40 m deep to the surface at a temperature of $12^\\circ\\text{C}$. The atmospheric pressure is $1 \\times 10^5\\text{ Pa}$, density of water is $1000\\text{ kg/m}^3$ and $g = 10\\text{ m/s}^2$. The volume of air bubble when it reaches the surface will be:",
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

async function seedJee2023Apr08Shift1() {
  console.log(`🚀 Compiling JEE Main 2023 (08 Apr Shift 1) Paper with ${rawQuestions.length} questions...`);

  const paperData = {
    examName: "JEE Main",
    year: 2023,
    shiftName: "JEE Main 2023 (08 Apr Shift 1)",
    examDate: "2023-04-08T09:00:00Z",
    totalMarks: 300,
    totalQuestions: 90,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'JEE Main 2023 (08 Apr Shift 1).json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved paper JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding JEE Main 2023 (08 Apr Shift 1) into PostgreSQL via Prisma...`);
  
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
      name: "JEE Main 2023 (08 Apr Shift 1)"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "JEE Main 2023 (08 Apr Shift 1)",
      date: new Date("2023-04-08T09:00:00Z")
    }
  });
  console.log(`Created Shift "JEE Main 2023 (08 Apr Shift 1)" (ID: ${shift.id})`);

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

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for JEE Main 2023 (08 Apr Shift 1) into Database!`);
}

seedJee2023Apr08Shift1()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
