const prisma = require('../../lib/prisma');
const fs = require('fs');
const path = require('path');

const rawQuestions = [
  // ── MATHEMATICS (Q1 - Q30) ──
  {
    subject: "Mathematics",
    questionText: "If $f(x) = x^3 - x^2 f'(1) + x f''(2) - f'''(3), x \\in \\mathbb{R}$, then",
    imageUrl: null,
    optionA: "(1) $f(1) + f(2) + f(3) = f(0)$",
    optionB: "(2) $2f(0) - f(1) + f(3) = f(2)$",
    optionC: "(3) $3f(1) + f(2) = f(3)$",
    optionD: "(4) $f(3) - f(2) = f(1)$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If the system of equations $x + 2y + 3z = 3, 4x + 3y - 4z = 4, 8x + 4y - \\lambda z = 9 + \\mu$ has infinitely many solutions, then the ordered pair $(\\lambda, \\mu)$ is equal to:",
    imageUrl: null,
    optionA: "(1) $(-\\frac{72}{5}, \\frac{21}{5})$",
    optionB: "(2) $(-\\frac{72}{5}, -\\frac{21}{5})$",
    optionC: "(3) $(\\frac{72}{5}, -\\frac{21}{5})$",
    optionD: "(4) $(\\frac{72}{5}, \\frac{21}{5})$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If $f(x) = \\frac{2^{2x}}{2^{2x}+2}, x \\in \\mathbb{R}$, then $f(\\frac{1}{2023}) + f(\\frac{2}{2023}) + \\dots + f(\\frac{2022}{2023})$ is equal to",
    imageUrl: null,
    optionA: "(1) 1011",
    optionB: "(2) 2010",
    optionC: "(3) 1010",
    optionD: "(4) 2011",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $\\vec{\\alpha} = 4\\hat{i} + 3\\hat{j} + 5\\hat{k}$ and $\\vec{\\beta} = \\hat{i} + 2\\hat{j} - 4\\hat{k}$. Let $\\vec{\\beta}_1$ be parallel to $\\vec{\\alpha}$ and $\\vec{\\beta}_2$ be perpendicular to $\\vec{\\alpha}$. If $\\vec{\\beta} = \\vec{\\beta}_1 + \\vec{\\beta}_2$, then the value of $5\\vec{\\beta}_2 \\cdot (\\hat{i} + \\hat{j} + \\hat{k})$ is",
    imageUrl: null,
    optionA: "(1) 7",
    optionB: "(2) 9",
    optionC: "(3) 6",
    optionD: "(4) 11",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $y = y(x)$ be the solution of the differential equation $(x^2 - 3y^2)dx + 3xydy = 0, y(1) = 1$. Then $6y^2(e)$ is equal to",
    imageUrl: null,
    optionA: "(1) $2e^2$",
    optionB: "(2) $3e^2$",
    optionC: "(3) $e^2$",
    optionD: "(4) $\\frac{3}{2}e^2$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The locus of the mid points of the chords of the circle $C_1 : (x - 4)^2 + (y - 5)^2 = 4$ which subtend an angle $\\theta_1$ at the centre of the circle $C_1$, is a circle of radius $r_i$. If $\\theta_1 = \\frac{\\pi}{3}, \\theta_3 = \\frac{2\\pi}{3}$ and $r_1^2 = r_2^2 + r_3^2$, then $\\theta_2$ is equal to",
    imageUrl: null,
    optionA: "(1) $\\pi/4$",
    optionB: "(2) $\\pi/2$",
    optionC: "(3) $\\pi/6$",
    optionD: "(4) $3\\pi/4$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The number of real solutions of the equation $3(x^2 + \\frac{1}{x^2}) - 2(x + \\frac{1}{x}) + 5 = 0$, is",
    imageUrl: null,
    optionA: "(1) 0",
    optionB: "(2) 3",
    optionC: "(3) 4",
    optionD: "(4) 2",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let A be a $3 \\times 3$ matrix such that $|\\text{adj}(\\text{adj}(\\text{adj} A))| = 12^4$. Then $|A^{-1} \\text{adj} A|$ is equal to",
    imageUrl: null,
    optionA: "(1) $\\sqrt{6}$",
    optionB: "(2) $2\\sqrt{3}$",
    optionC: "(3) 12",
    optionD: "(4) 1",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "$\\int_{\\frac{3\\sqrt{2}}{4}}^{\\frac{3\\sqrt{3}}{4}} \\frac{48}{\\sqrt{9-4x^2}} dx$ is equal to",
    imageUrl: null,
    optionA: "(1) $2\\pi$",
    optionB: "(2) $\\pi/6$",
    optionC: "(3) $\\pi/3$",
    optionD: "(4) $\\pi/2$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The number of square matrices of order 5 with entries from the set $\{0, 1\}$, such that the sum of all the elements in each row is 1 and the sum of all the elements in each column is also 1, is",
    imageUrl: null,
    optionA: "(1) 125",
    optionB: "(2) 225",
    optionC: "(3) 150",
    optionD: "(4) 120",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If $({}^{30}C_1)^2 + 2 ({}^{30}C_2)^2 + 3 ({}^{30}C_3)^2 + \\dots + 30 ({}^{30}C_{30})^2 = \\frac{\\alpha 60!}{(30!)^2}$, then $\\alpha$ is equal to:",
    imageUrl: null,
    optionA: "(1) 30",
    optionB: "(2) 10",
    optionC: "(3) 60",
    optionD: "(4) 15",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let the plane containing the line of intersection of the planes $P_1 : x + (\\lambda + 4)y + z = 1$ and $P_2 : 2x + y + z = 2$ pass through the points (0, 1, 0) and (1, 0, 1). Then the distance of the point $(2\\lambda, \\lambda, -\\lambda)$ from the plane $P_2$ is",
    imageUrl: null,
    optionA: "(1) $4\\sqrt{6}$",
    optionB: "(2) $3\\sqrt{6}$",
    optionC: "(3) $5\\sqrt{6}$",
    optionD: "(4) $2\\sqrt{6}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let f(x) be a function such that $f(x + y) = f(x) \\cdot f(y)$ for all $x, y \\in \\mathbb{N}$. If $f(1) = 3$ and $\\sum_{k=1}^n f(k) = 3279$, then the value of n is",
    imageUrl: null,
    optionA: "(1) 9",
    optionB: "(2) 6",
    optionC: "(3) 8",
    optionD: "(4) 7",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let the six numbers $a_1, a_2, a_3, a_4, a_5, a_6$ be in A.P. and $a_1 + a_3 = 10$. If the mean of these six numbers is 19/2 and their variance is $\\sigma^2$, then $8\\sigma^2$ is equal to:",
    imageUrl: null,
    optionA: "(1) 210",
    optionB: "(2) 220",
    optionC: "(3) 200",
    optionD: "(4) 105",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The equations of the sides AB and AC of a triangle ABC are $(\\lambda + 1)x + \\lambda y = 4$ and $\\lambda x + (1 - \\lambda) y + \\lambda = 0$ respectively. Its vertex A is on the y-axis and its orthocentre is (1, 2). The length of the tangent from the point C to the part of the parabola $y^2 = 6x$ in the first quadrant is :",
    imageUrl: null,
    optionA: "(1) 4",
    optionB: "(2) 2",
    optionC: "(3) $\\sqrt{6}$",
    optionD: "(4) $2\\sqrt{2}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let p and q be two statements. Then $\\sim (p \\wedge (p \\Rightarrow \\sim q))$ is equivalent to",
    imageUrl: null,
    optionA: "(1) $p \\vee (p \\wedge q)$",
    optionB: "(2) $p \\vee (p \\wedge (\\sim q))$",
    optionC: "(3) $(\\sim p) \\vee q$",
    optionD: "(4) $p \\vee ((\\sim p) \\wedge q)$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The set of all values of a for which $\\lim_{x\\to a} ([x - 5] - [2x + 2]) = 0$, where [\\alpha] denotes the greatest integer less than or equal to $\\alpha$ is equal to",
    imageUrl: null,
    optionA: "(1) $[-7.5, -6.5)$",
    optionB: "(2) $[-7.5, -6.5]$",
    optionC: "(3) $(-7.5, -6.5]$",
    optionD: "(4) $(-7.5, -6.5)$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If the foot of the perpendicular drawn from (1, 9, 7) to the line passing through the point (3, 2, 1) and parallel to the planes $x + 2y + z = 0$ and $3y - z = 3$ is $(\\alpha, \\beta, \\gamma)$, then $\\alpha + \\beta + \\gamma$ is equal to",
    imageUrl: null,
    optionA: "(1) 3",
    optionB: "(2) 1",
    optionC: "(3) -1",
    optionD: "(4) 5",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The number of integers, greater than 7000 that can be formed, using the digits 3, 5, 6, 7, 8 without repetition, is",
    imageUrl: null,
    optionA: "(1) 168",
    optionB: "(2) 220",
    optionC: "(3) 120",
    optionD: "(4) 48",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The value of $\\left(\\frac{1+\\sin\\frac{2\\pi}{9} + i \\cos\\frac{2\\pi}{9}}{1+\\sin\\frac{2\\pi}{9} - i \\cos\\frac{2\\pi}{9}}\\right)^3$ is",
    imageUrl: null,
    optionA: "(1) $-\\frac{1}{2}(\\sqrt{3} - i)$",
    optionB: "(2) $-\\frac{1}{2}(1 - i\\sqrt{3})$",
    optionC: "(3) $\\frac{1}{2}(1 - i\\sqrt{3})$",
    optionD: "(4) $\\frac{1}{2}(\\sqrt{3} + i)$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If the shortest distance between the lines $\\frac{x+\\sqrt{6}}{2} = \\frac{y-\\sqrt{6}}{3} = \\frac{z-\\sqrt{6}}{4}$ and $\\frac{x-\\lambda}{3} = \\frac{y-2\\sqrt{6}}{4} = \\frac{z+2\\sqrt{6}}{5}$ is 6, then the square of sum of all possible values of $\\lambda$ is",
    imageUrl: null,
    optionA: "384",
    optionB: "384",
    optionC: "384",
    optionD: "384",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Three urns A, B and C contain 4 red, 6 black; 5 red, 5 black; and $\\lambda$ red, 4 black balls respectively. One of the urns is selected at random and a ball is drawn. If the ball drawn is red and the probability that it is drawn from urn C is 0.4 then the square of the length of the side of the largest equilateral triangle, inscribed in the parabola $y^2 = \\lambda x$ with one vertex at the vertex of the parabola, is",
    imageUrl: null,
    optionA: "432",
    optionB: "432",
    optionC: "432",
    optionD: "432",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Let $S = \\{\\theta \\in [0, 2\\pi) : \\tan(\\pi \\cos \\theta) + \\tan(\\pi \\sin \\theta) = 0\\}$. Then $\\sum_{\\theta \\in S} \\sin^2(\\theta + \\frac{\\pi}{4})$ is equal to",
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
    questionText: "If $\\frac{1^3+2^3+3^3+\\dots \\text{ up to n terms}}{1.3+2.5+3.7+\\dots \\text{ up to n terms}} = \\frac{9}{5}$, then the value of n is",
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
    questionText: "Let the sum of the coefficients of the first three terms in the expansion of $(x - \\frac{3}{x^2})^n, x \\neq 0, n \\in \\mathbb{N}$, be 376. Then the coefficient of $x^4$ is",
    imageUrl: null,
    optionA: "405",
    optionB: "405",
    optionC: "405",
    optionD: "405",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "The equations of the sides AB, BC and CA of a triangle ABC are : $2x + y = 0, x + py = 21a, (a \\neq 0)$ and $x - y = 3$ respectively. Let P(2, a) be the centroid of $\\Delta ABC$. Then $(BC)^2$ is equal to",
    imageUrl: null,
    optionA: "122",
    optionB: "122",
    optionC: "122",
    optionD: "122",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Let $\\vec{a} = \\hat{i} + 2\\hat{j} + \\lambda\\hat{k}, \\vec{b} = 3\\hat{i} - 5\\hat{j} - \\lambda\\hat{k}, \\vec{a} \\cdot \\vec{c} = 7, 2\\vec{b} \\cdot \\vec{c} + 43 = 0, \\vec{a} \\times \\vec{c} = \\vec{b} \\times \\vec{c}$. Then $|\\vec{a} \\cdot \\vec{b}|$ is equal to",
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
    questionText: "The minimum number of elements that must be added to the relation $R = \\{(a, b), (b, c), (b, d)\\}$ on the set $\{a, b, c, d\}$ so that it is an equivalence relation, is",
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
    questionText: "If the area of the region bounded by the curves $y^2 - 2y = -x, x + y = 0$ is A, then 8 A is equal to",
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
    questionText: "Lef f be a differentiable function defined on $[0, \\pi/2]$ such that $f(x) > 0$ and $f(x) + \\int_0^x f(t)\\sqrt{1 - (\\log_e f(t))^2} dt = e, \\forall x \\in [0, \\pi/2]$. Then $(6 \\log_e f(\\pi/6))^2$ is equal to",
    imageUrl: null,
    optionA: "27",
    optionB: "27",
    optionC: "27",
    optionD: "27",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── CHEMISTRY (Q31 - Q60) ──
  {
    subject: "Chemistry",
    questionText: "Identify the correct statements about alkali metals.\nA. The order of standard reduction potential ($M^+ | M$) for alkali metal ions is Na > Rb > Li.\nB. CsI is highly soluble in water.\nC. Lithium carbonate is highly stable to heat.\nD. Potassium dissolved in concentrated liquid ammonia is blue in colour and paramagnetic.\nE. All the alkali metal hydrides are ionic solids.\nChoose correct answer:",
    imageUrl: null,
    optionA: "(1) C and E only",
    optionB: "(2) A, B and E only",
    optionC: "(3) A, B, D only",
    optionD: "(4) A and E only",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Assertion A: Beryllium has less negative value of reduction potential compared to the other alkaline earth metals.\nReason: Beryllium has large hydration energy due to small size of $\\text{Be}^{2+}$ but relatively large value of atomization enthalpy\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) A is not correct but R is correct",
    optionB: "(2) A is correct but R is not correct",
    optionC: "(3) Both A and R are correct and R is the correct explanation of A",
    optionD: "(4) Both A and R are correct but R is NOT the correct explanation of A",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "A student has studied the decomposition of a gas $\\text{AB}_3$ at $25^\\circ\\text{C}$. Data: p(mmHg): 50, 100, 200, 400 with relative $t_{1/2}(s)$: 4, 2, 1, 0.5. The order of the reaction is",
    imageUrl: null,
    optionA: "(1) 0 (zero)",
    optionB: "(2) 0.5",
    optionC: "(3) 1",
    optionD: "(4) 2",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "$\\text{K}_2\\text{Cr}_2\\text{O}_7$ paper acidified with dilute $\\text{H}_2\\text{SO}_4$ turns green when exposed to",
    imageUrl: null,
    optionA: "(1) Carbon dioxide",
    optionB: "(2) Sulphur trioxide",
    optionC: "(3) Sulphur dioxide",
    optionD: "(4) Hydrogen sulphide",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which will undergo deprotonation most readily in basic medium? (Active methylene compound containing 1,3-dicarbonyl vs ester vs beta-keto ester)",
    imageUrl: null,
    optionA: "(1) c only",
    optionB: "(2) a only",
    optionC: "(3) Both a and c",
    optionD: "(4) b only",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The hybridization and magnetic behaviour of cobalt ion in $[Co(NH_3)_6]^{3+}$ complex, respectively is",
    imageUrl: null,
    optionA: "(1) $d^2sp^3$ and paramagnetic",
    optionB: "(2) $sp^3d^2$ and diamagnetic",
    optionC: "(3) $d^2sp^3$ and diamagnetic",
    optionD: "(4) $sp^3d^2$ and paramagnetic",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement 1: 3-amino-N-(4-chlorophenyl)propanamide under Clemmensen reduction conditions gives 3-amino-N-(4-chlorophenyl)propan-1-amine.\nStatement 2: 3-amino-N-(4-chlorophenyl)propanamide under Wolff-Kishner reduction condition gives 3-amino-N-(4-chlorophenyl)propan-1-amine.\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Statement I is false but Statement II is true",
    optionB: "(2) Statement I is true but Statement II is false",
    optionC: "(3) Both Statement I and Statement II are true",
    optionD: "(4) Both Statement I and Statement II are false",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following cannot be explained by crystal field theory?",
    imageUrl: null,
    optionA: "(1) The order of spectrochemical series",
    optionB: "(2) Stability of metal complexes",
    optionC: "(3) Magnetic properties of transition metal complexes",
    optionD: "(4) Colour of metal complexes",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The number of s-electrons present in an ion with 55 protons in its unipositive state ($\\text{Cs}^+$) is",
    imageUrl: null,
    optionA: "(1) 8",
    optionB: "(2) 10",
    optionC: "(3) 9",
    optionD: "(4) 12",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which one amongst the following are good oxidizing agents?\n(A) $\\text{Sm}^{2+}$, (B) $\\text{Ce}^{2+}$, (C) $\\text{Ce}^{4+}$, (D) $\\text{Tb}^{4+}$\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) D only",
    optionB: "(2) C only",
    optionC: "(3) C and D only",
    optionD: "(4) A and B only",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Choose the correct representation of conductometric titration of benzoic acid vs sodium hydroxide.",
    imageUrl: null,
    optionA: "(1) Initial slight decrease then rise then steep rise after end point",
    optionB: "(2) Flat line then rise",
    optionC: "(3) V-shape curve",
    optionD: "(4) Inverted V-shape curve",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List I with List II\nList-I Type: (A) Antifertility drug, (B) Tranquilizer, (C) Antihistamine, (D) Antibiotic\nList-II Name: (I) Norethindrone, (II) Meprobamate, (III) Seldane, (IV) Ampicillin",
    imageUrl: null,
    optionA: "(1) A - I, B - III, C - II, D - IV",
    optionB: "(2) A - IV, B - III, C - II, D - I",
    optionC: "(3) A - I, B - II, C - III, D - IV",
    optionD: "(4) A - II, B - I, C - III, D - IV",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Find out the major products from oxymercuration-demercuration and hydroboration-oxidation of 2-methylbut-2-ene:",
    imageUrl: null,
    optionA: "(1) A = 2-methylbutan-1-ol, B = 2-methylbutan-2-ol",
    optionB: "(2) A = 3-methylbutan-2-ol, B = 2-methylbutan-2-ol",
    optionC: "(3) A = 2-methylbutan-2-ol, B = 3-methylbutan-2-ol",
    optionD: "(4) A = 3-methylbutan-2-ol, B = 2-methylbutan-1-ol",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Assertion : Benzene is more stable than hypothetical cyclohexatriene\nReason : The delocalized $\\pi$ electron cloud is attracted more strongly by nuclei of carbon atoms.\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both A and R are correct and R is the correct explanation of A",
    optionB: "(2) Both A and R are correct but R is NOT the correct explanation of A",
    optionC: "(3) A is false but R is true",
    optionD: "(4) A is true but R is false",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "In which of the following reactions the hydrogen peroxide acts as a reducing agent?",
    imageUrl: null,
    optionA: "(1) $\\text{PbS} + 4\\text{H}_2\\text{O}_2 \\to \\text{PbSO}_4 + 4\\text{H}_2\\text{O}$",
    optionB: "(2) \\text{Mn}^{2+} + \\text{H}_2\\text{O}_2 \\to \\text{Mn}^{4+} + 2\\text{OH}^-",
    optionC: "(3) \\text{HOCl} + \\text{H}_2\\text{O}_2 \\to \\text{H}_3\\text{O}^+ + \\text{Cl}^- + \\text{O}_2",
    optionD: "(4) $2\\text{Fe}^{2+} + \\text{H}_2\\text{O}_2 \\to 2\\text{Fe}^{3+} + 2\\text{OH}^-$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement I : Pure Aniline and other arylamines are usually colourless.\nStatement II : Arylamines get coloured on storage due to atmospheric reduction\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both Statement I and Statement II are incorrect",
    optionB: "(2) Statement I is incorrect but Statement II is correct",
    optionC: "(3) Statement I is correct but Statement II is incorrect",
    optionD: "(4) Both Statement I and Statement II are correct",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Correct statement is:",
    imageUrl: null,
    optionA: "(1) An average human being consumes nearly 15 times more air than food",
    optionB: "(2) An average human being consumes 100 times more air than food",
    optionC: "(3) An average human being consumes equal amount of food and air",
    optionD: "(4) An average human being consumes more food than air",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "What is the number of unpaired electron(s) in the highest occupied molecular orbital of the following species : $\\text{N}_2, \\text{N}_2^+, \\text{O}_2, \\text{O}_2^+$ ?",
    imageUrl: null,
    optionA: "(1) 2, 1, 0, 1",
    optionB: "(2) 0, 1, 2, 1",
    optionC: "(3) 0, 1, 0, 1",
    optionD: "(4) 2, 1, 2, 1",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The metal which is extracted by oxidation and subsequent reduction from its ore is:",
    imageUrl: null,
    optionA: "(1) Ag",
    optionB: "(2) Fe",
    optionC: "(3) Cu",
    optionD: "(4) Al",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Choose the correct colour of the product for the coupling reaction of diazotized sulfanilic acid with 1-naphthylamine:",
    imageUrl: null,
    optionA: "(1) White",
    optionB: "(2) Red",
    optionC: "(3) Blue",
    optionD: "(4) Yellow",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Following figure shows spectrum of an ideal black body at four different temperatures. The number of correct statement/s from the following is\nA. $T_4 > T_3 > T_2 > T_1$\nB. The black body consists of particles performing simple harmonic motion.\nC. Peak shifts to shorter wavelength as T increases.\nD. $T_1/v_1 = T_2/v_2 \\neq \\text{constant}$.\nE. Quantisation of energy.",
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
    questionText: "The number of units, which are used to express concentration of solutions from the following is______ Mass percent, Mole, Mole fraction, Molarity, ppm, Molality",
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
    questionText: "The number of statement/s which are the characteristics of physisorption is ___________\nA. It is highly specific in nature\nB. Enthalpy of adsorption is high\nC. It decreases with increase in temperature\nD. It results into unimolecular layer\nE. No activation energy is needed",
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
    questionText: "Sum of $\\pi$ - bonds present in peroxodisulphuric acid and pyrosulphuric acid is:",
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
    subject: "Chemistry",
    questionText: "If the pKa of lactic acid is 5, then the pH of 0.005M calcium lactate solution at $25^\\circ\\text{C}$ is ______ $\\times 10^{-1}$ (Nearest integer)",
    imageUrl: null,
    optionA: "85",
    optionB: "85",
    optionC: "85",
    optionD: "85",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "The total pressure observed by mixing two liquids A and B is 350 mmHg when their mole fractions are 0.7 and 0.3 respectively. Total pressure becomes 410 mmHg if mole fractions are 0.2 and 0.8. Vapour pressure of pure A is________ mm Hg. (Nearest integer)",
    imageUrl: null,
    optionA: "314",
    optionB: "314",
    optionC: "314",
    optionD: "314",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "The number of statement/s, which are correct with respect to the compression of carbon dioxide from point (a) in the Andrews isotherm is_____________.",
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
    questionText: "Maximum number of isomeric monochloro derivatives which can be obtained from 2, 2, 5, 5 tetramethylhexane by chlorination is ____________.",
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
    questionText: "Total number of tripeptides possible by mixing of valine and proline is____________",
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
    subject: "Chemistry",
    questionText: "One mole of an ideal monoatomic gas is subjected to changes from (1 bar, 20 L) to (0.5 bar, 40 L). Magnitude of work done is_________ J (nearest integer).",
    imageUrl: null,
    optionA: "620",
    optionB: "620",
    optionC: "620",
    optionD: "620",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── PHYSICS (Q61 - Q90) ──
  {
    subject: "Physics",
    questionText: "Assertion: A pendulum clock when taken to Mount Everest becomes fast.\nReason: The value of g (acceleration due to gravity) is less at Mount Everest than its value on the surface of earth.\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both A and R are correct but R is NOT the correct explanation of A",
    optionB: "(2) A is correct but R is not correct",
    optionC: "(3) Both A and R are correct and R is the correct explanation of A",
    optionD: "(4) A is not correct but R is correct",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The frequency ($\\nu$) of an oscillating liquid drop may depend upon radius (r) of the drop, density ($\\rho$) of liquid and the surface tension (s) of the liquid as : $\\nu = r^a \\rho^b s^c$. The values of a, b and c respectively are",
    imageUrl: null,
    optionA: "(1) $(-\\frac{3}{2}, \\frac{1}{2}, \\frac{1}{2})$",
    optionB: "(2) $(\\frac{3}{2}, -\\frac{1}{2}, \\frac{1}{2})$",
    optionC: "(3) $(-\\frac{3}{2}, -\\frac{1}{2}, \\frac{1}{2})$",
    optionD: "(4) $(\\frac{3}{2}, \\frac{1}{2}, -\\frac{1}{2})$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Statement I : Acceleration due to earth’s gravity decreases as you go ‘up’ or ‘down’ from earth’s surface.\nStatement II : Acceleration due to earth’s gravity is same at a height ‘h’ and depth ‘d’ from earth’s surface, if $h = d$.\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both Statement I and Statement II are incorrect",
    optionB: "(2) Statement I is incorrect but statement II is correct",
    optionC: "(3) Both Statements I and II are correct",
    optionD: "(4) Statement I is correct but statement II is incorrect",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A long solenoid is formed by winding 70 turns $\\text{cm}^{-1}$. If 2.0 A current flows, then the magnetic field produced inside the solenoid is [$\\mu_0 = 4\\pi \\times 10^{-7}\\text{ TmA}^{-1}$]",
    imageUrl: null,
    optionA: "(1) $88 \\times 10^{-4}\\text{ T}$",
    optionB: "(2) $352 \\times 10^{-4}\\text{ T}$",
    optionC: "(3) $176 \\times 10^{-4}\\text{ T}$",
    optionD: "(4) $1232 \\times 10^{-4}\\text{ T}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The electric potential at the centre of two concentric half rings of radii $R_1$ and $R_2$, having same linear charge density $\\lambda$ is :",
    imageUrl: null,
    optionA: "(1) $\\frac{\\lambda}{2\\epsilon_0}$",
    optionB: "(2) $\\frac{\\lambda}{4\\epsilon_0}$",
    optionC: "(3) $\\frac{2\\lambda}{\\epsilon_0}$",
    optionD: "(4) $\\frac{\\lambda}{\\epsilon_0}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "If the distance of the earth from Sun is $1.5 \\times 10^6\\text{ km}$. Then the distance of an imaginary planet from Sun, if its period of revolution is 2.83 years is :",
    imageUrl: null,
    optionA: "(1) $6 \\times 10^6\\text{ km}$",
    optionB: "(2) $3 \\times 10^6\\text{ km}$",
    optionC: "(3) $3 \\times 10^7\\text{ km}$",
    optionD: "(4) $6 \\times 10^7\\text{ km}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A photon is emitted in transition from $n = 4$ to $n = 1$ level in hydrogen atom. The corresponding wavelength for this transition is (given, $h = 4 \\times 10^{-15}\\text{eVs}$ ) :",
    imageUrl: null,
    optionA: "(1) 99.3 nm",
    optionB: "(2) 941 nm",
    optionC: "(3) 974 nm",
    optionD: "(4) 94.1 nm",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A cell of emf 90 V is connected across series combination of two resistors each of $100\\Omega$ resistance. A voltmeter of resistance $400\\Omega$ is used to measure the potential difference across each resistor. The reading of the voltmeter will be:",
    imageUrl: null,
    optionA: "(1) 90 V",
    optionB: "(2) 45 V",
    optionC: "(3) 80 V",
    optionD: "(4) 40 V",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "If two vectors $\\vec{P} = \\hat{i} + 2m\\hat{j} + m\\hat{k}$ and $\\vec{Q} = 4\\hat{i} - 2\\hat{j} + m\\hat{k}$ are perpendicular to each other. Then, the value of m will be:",
    imageUrl: null,
    optionA: "(1) -1",
    optionB: "(2) 3",
    optionC: "(3) 2",
    optionD: "(4) 1",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The electric field and magnetic field components of an electromagnetic wave going through vacuum is described by $E_x = E_0 \\sin(kz - \\omega t), B_y = B_0 \\sin(kz - \\omega t)$. Then the correct relation between $E_0$ and $B_0$ is given by",
    imageUrl: null,
    optionA: "(1) $E_0 B_0 = \\omega k$",
    optionB: "(2) $E_0 = k B_0$",
    optionC: "(3) $k E_0 = \\omega B_0$",
    optionD: "(4) $\\omega E_0 = k B_0$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The logic gate equivalent to the circuit diagram (two parallel switches across relay/lamp) is :",
    imageUrl: null,
    optionA: "(1) NAND",
    optionB: "(2) OR",
    optionC: "(3) AND",
    optionD: "(4) NOR",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Let $\\gamma_1$ be the ratio of molar specific heat at constant pressure and molar specific heat at constant volume of a monoatomic gas and $\\gamma_2$ be the similar ratio of diatomic gas. Considering the diatomic gas molecule as a rigid rotator, the ratio $\\frac{\\gamma_1}{\\gamma_2}$ is:",
    imageUrl: null,
    optionA: "(1) 25/21",
    optionB: "(2) 35/27",
    optionC: "(3) 21/25",
    optionD: "(4) 27/35",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "When a beam of white light is allowed to pass through convex lens parallel to principal axis, the different colours of light converge at different point on the principle axis after refraction. This is called:",
    imageUrl: null,
    optionA: "(1) Spherical aberration",
    optionB: "(2) Polarisation",
    optionC: "(3) Chromatic aberration",
    optionD: "(4) Scattering",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A metallic rod of length ‘L' is rotated with an angular speed of ‘$\\omega$' normal to a uniform magnetic field ‘B' about an axis passing through one end of rod. The induced emf will be:",
    imageUrl: null,
    optionA: "(1) $\\frac{1}{4} B L^2 \\omega$",
    optionB: "(2) \\frac{1}{2} B^2 L^2 \\omega$",
    optionC: "(3) $\\frac{1}{4} B^2 L \\omega$",
    optionD: "(4) $\\frac{1}{2} B L^2 \\omega$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "An $\\alpha$-particle, a proton and an electron have the same kinetic energy. Which one of the following is correct in case of their de-Broglie wavelength:",
    imageUrl: null,
    optionA: "(1) $\\lambda_a < \\lambda_p < \\lambda_e$",
    optionB: "(2) $\\lambda_a = \\lambda_p = \\lambda_e$",
    optionC: "(3) $\\lambda_a > \\lambda_p > \\lambda_e$",
    optionD: "(4) $\\lambda_a > \\lambda_p < \\lambda_e$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Assertion A : Steel is used in the construction of buildings and bridges.\\nReason R : Steel is more elastic and its elastic limit is high.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both A and R are correct and R is the correct explanation of A",
    optionB: "(2) Both A and R are correct but R is NOT the correct explanation of A",
    optionC: "(3) A is correct but R is not correct",
    optionD: "(4) A is not correct but R is correct",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In an Isothermal change, the change in pressure and volume of a gas for $T_3 > T_2 > T_1$ is correctly represented by hyperbolic curves where higher temperature lies above lower temperature (Curve 3).",
    imageUrl: null,
    optionA: "(1) Curve 1",
    optionB: "(2) Curve 2",
    optionC: "(3) Curve 3",
    optionD: "(4) Curve 4",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Match List I with List II\nList-I: (A) AM Broadcast, (B) FM Broadcast, (C) Television, (D) Satellite Communication\nList-II: (I) 88 − 108MHz, (II) 540 − 1600kHz, (III) 3.7 − 4.2GHz, (IV) 54MHz − 890MHz",
    imageUrl: null,
    optionA: "(1) A - II, B - I, C - IV, D - III",
    optionB: "(2) A - I, B - III, C - II, D - IV",
    optionC: "(3) A - IV, B - III, C - I, D - II",
    optionD: "(4) A - II, B - III, C - I, D - IV",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A body of mass 200 g is tied to a spring of spring constant 12.5 N/m, while the other end of spring is fixed at point O. If the body moves about O in a circular path on a smooth horizontal surface with constant angular speed 5rad/s. Then the ratio of extension in the spring to its natural length will be :",
    imageUrl: null,
    optionA: "(1) 2 : 5",
    optionB: "(2) 1 : 1",
    optionC: "(3) 2 : 3",
    optionD: "(4) 1 : 2",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The velocity time graph of a body moving in a straight line shows v=8 to t=2, v=-4 to t=4, v=4 to t=8, v=-6 to t=10. The ratio of displacement to distance traveled by the body in time 0 to 10 s is :",
    imageUrl: null,
    optionA: "(1) 1 : 1",
    optionB: "(2) 1 : 2",
    optionC: "(3) 1 : 3",
    optionD: "(4) 1 : 4",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A body of mass 1 kg begins to move under the action of a time dependent force, $\\vec{F} = (t\\hat{i} + 3t^2\\hat{j})\\text{N}$. Power developed at $t = 2\\text{s}$ is _________ W.",
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
    questionText: "A convex lens of refractive index 1.5 and focal length 18 cm in air is immersed in water ($\\mu = 4/3$). The change in focal length of the lens will be ________ cm",
    imageUrl: null,
    optionA: "54",
    optionB: "54",
    optionC: "54",
    optionD: "54",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Energy released per fission of $^{240}X$ is 200MeV. Energy released if all atoms in 120 g of pure $^{240}X$ undergo fission is ______ $\\times 10^{25}\\text{MeV}$. ($N_A = 6 \\times 10^{23}$)",
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
    questionText: "A uniform solid cylinder (R, L) has MOI $I_1$. Concentric cylinder ($R' = R/2, L' = L/2$) is carved out with MOI $I_2$. $\\frac{I_1}{I_2} = \\text{__________}$.",
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
    subject: "Physics",
    questionText: "A parallel plate capacitor with air has capacitance 15pF. Distance doubled and filled with dielectric 3.5. New capacitance is $\\frac{x}{4}\\text{ pF}$. Value of x is _________",
    imageUrl: null,
    optionA: "105",
    optionB: "105",
    optionC: "105",
    optionD: "105",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Single turn right triangle loop (5 cm, 12 cm, 13 cm) carries 2 A current in uniform magnetic field 0.75 T parallel to 13 cm side. Magnetic force on 5 cm side is $\\frac{x}{130}\\text{ N}$. Value of x is __________",
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
    questionText: "Mass m attached to spring executes SHM with period 1 s. If mass increased by 3 kg, period increases by 1 s. Value of mass m is _____ kg.",
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
    questionText: "If a copper wire is stretched to increase its length by 20%. The percentage increase in resistance of the wire is _________ %",
    imageUrl: null,
    optionA: "44",
    optionB: "44",
    optionC: "44",
    optionD: "44",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Three identical resistors $R = 12\\Omega$ and two inductors $L = 5\\text{mH}$ connected across 12 V battery in parallel branches. Current long after switch closed is _______ A.",
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
    questionText: "Spherical ball (r = 1 mm, density = 10.5 g/cc) dropped in glycerine (viscosity = 9.8 poise, density = 1.5 g/cc). Viscous force at constant velocity is $3696 \\times 10^{-x}\\text{ N}$. Value of x is (Given $g = 9.8\\text{ m/s}^2, \\pi = 22/7$).",
    imageUrl: null,
    optionA: "7",
    optionB: "7",
    optionC: "7",
    optionD: "7",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  }
];

async function seedJee2023Jan24Shift2() {
  console.log(`🚀 Compiling JEE Main 2023 (24 Jan Shift 2) Paper with ${rawQuestions.length} questions...`);

  const paperData = {
    examName: "JEE Main",
    year: 2023,
    shiftName: "JEE Main 2023 (24 Jan Shift 2)",
    examDate: "2023-01-24T15:00:00Z",
    totalMarks: 300,
    totalQuestions: 90,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'JEE Main 2023 (24 Jan Shift 2).json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved paper JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding JEE Main 2023 (24 Jan Shift 2) into PostgreSQL via Prisma...`);
  
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
      name: "JEE Main 2023 (24 Jan Shift 2)"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "JEE Main 2023 (24 Jan Shift 2)",
      date: new Date("2023-01-24T15:00:00Z")
    }
  });
  console.log(`Created Shift "JEE Main 2023 (24 Jan Shift 2)" (ID: ${shift.id})`);

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

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for JEE Main 2023 (24 Jan Shift 2) into Database!`);
}

seedJee2023Jan24Shift2()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
