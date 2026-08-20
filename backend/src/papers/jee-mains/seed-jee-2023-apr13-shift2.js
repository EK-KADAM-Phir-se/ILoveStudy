const prisma = require('../../lib/prisma');
const fs = require('fs');
const path = require('path');

const rawQuestions = [
  // ── MATHEMATICS (Q1 - Q30) ──
  {
    subject: "Mathematics",
    questionText: "If the system of equations $2x + y - z = 5, 2x - 5y + \\lambda z = \\mu, x + 2y - 5z = 7$ has infinitely many solutions, then $(\\lambda + \\mu)^2 + (\\lambda - \\mu)^2$ is equal to",
    imageUrl: null,
    optionA: "(1) 916",
    optionB: "(2) 912",
    optionC: "(3) 920",
    optionD: "(4) 904",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The coefficient of $x^5$ in the expansion of $(2x^3 - \\frac{1}{3x^2})^5$ is",
    imageUrl: null,
    optionA: "(1) 8",
    optionB: "(2) 9",
    optionC: "(3) 80/9",
    optionD: "(4) 26/3",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The plane, passing through the points (0, –1, 2) and (–1, 2, 1) and parallel to the line passing through (5, 1, –7) and (1, –1, –1), also passes through the point.",
    imageUrl: null,
    optionA: "(1) (1, –2, 1)",
    optionB: "(2) (0, 5, –2)",
    optionC: "(3) (–2, 5, 0)",
    optionD: "(4) (2, 0, 1)",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $\\alpha, \\beta$ be the roots of the equation $x^2 - \\sqrt{2} x + 2 = 0$. Then $\\alpha^{14} + \\beta^{14}$ is equal to",
    imageUrl: null,
    optionA: "(1) $-64\\sqrt{2}$",
    optionB: "(2) $-128\\sqrt{2}$",
    optionC: "(3) -64",
    optionD: "(4) -128",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $a_1, a_2, a_3, \\dots$ be a G.P. of increasing positive numbers. Let the sum of its 6th and 8th terms be 2 and the product of its 3rd and 5th terms be 1/9. Then $6(a_2 + a_4)(a_4 + a_6)$ is equal to",
    imageUrl: null,
    optionA: "(1) $2\\sqrt{2}$",
    optionB: "(2) 2",
    optionC: "(3) $3\\sqrt{3}$",
    optionD: "(4) 3",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $(\\alpha, \\beta)$ be the centroid of the triangle formed by the lines $15x - y = 82, 6x - 5y = -4$ and $9x + 4y = 17$. Then $\\alpha + 2\\beta$ and $2\\alpha - \\beta$ are the roots of the equation",
    imageUrl: null,
    optionA: "(1) $x^2 - 7x + 12 = 0$",
    optionB: "(2) $x^2 - 13x + 42 = 0$",
    optionC: "(3) $x^2 - 14x + 48 = 0$",
    optionD: "(4) $x^2 - 10x + 25 = 0$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $|\\vec{a}| = 2, |\\vec{b}| = 3$ and the angle between the vectors $\\vec{a}$ and $\\vec{b}$ be $\\pi/4$. Then $|(\\vec{a} + 2\\vec{b}) \\times (2\\vec{a} - 3\\vec{b})|^2$ is equal to",
    imageUrl: null,
    optionA: "(1) 482",
    optionB: "(2) 441",
    optionC: "(3) 841",
    optionD: "(4) 882",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let N be the foot of perpendicular from the point P (1, –2, 3) on the line passing through the points (4, 5, 8) and (1, –7, 5). Then the distance of N from the plane $2x - 2y + z + 5 = 0$ is",
    imageUrl: null,
    optionA: "(1) 6",
    optionB: "(2) 9",
    optionC: "(3) 7",
    optionD: "(4) 8",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If $\\lim_{x\\to 0} \\frac{e^{ax} - \\cos(bx) - \\frac{cxe^{-cx}}{2}}{1 - \\cos(2x)} = 17$, then $5a^2 + b^2$ is equal to",
    imageUrl: null,
    optionA: "(1) 72",
    optionB: "(2) 76",
    optionC: "(3) 68",
    optionD: "(4) 64",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let the centre of a circle C be $(\\alpha, \\beta)$ and its radius $r < 8$. Let $3x + 4y = 24$ and $3x - 4y = 32$ be two tangents and $4x + 3y = 1$ be a normal to C. Then $(\\alpha - \\beta + r)$ is equal to",
    imageUrl: null,
    optionA: "(1) 7",
    optionB: "(2) 9",
    optionC: "(3) 5",
    optionD: "(4) 6",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "All words, with or without meaning, are made using all the letters of the word MONDAY. These words are written as in a dictionary with serial numbers. The serial number of the word MONDAY is",
    imageUrl: null,
    optionA: "(1) 327",
    optionB: "(2) 326",
    optionC: "(3) 328",
    optionD: "(4) 324",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The range of $f(x) = 4 \\sin^{-1}(\\frac{x^2}{x^2+1})$ is",
    imageUrl: null,
    optionA: "(1) $[0, \\pi]$",
    optionB: "(2) $[0, 2\\pi)$",
    optionC: "(3) $[0, \\pi)$",
    optionD: "(4) $[0, 2\\pi]$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The statement $(p \\wedge (\\sim q)) \\vee (({\\sim p}) \\wedge q) \\vee (({\\sim p}) \\wedge (\\sim q))$ is equivalent to",
    imageUrl: null,
    optionA: "(1) $(\\sim p) \\vee (\\sim q)$",
    optionB: "(2) $p \\vee (\\sim q)$",
    optionC: "(3) $(\\sim p) \\vee q$",
    optionD: "(4) $p \\vee q$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The random valuable X follows binomial distribution B (n, p) for which the difference of the mean and the variance is 1. If $2P(X = 2) = 3P(X = 1)$, then $n^2 P(X > 1)$ is equal to",
    imageUrl: null,
    optionA: "(1) 12",
    optionB: "(2) 15",
    optionC: "(3) 11",
    optionD: "(4) 16",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $A = \\begin{bmatrix} 1 & 2 & 3 \\\\ a & 3 & 1 \\\\ 1 & 1 & 2 \\end{bmatrix}, |A| = 2$. If $|2\\text{adj}(2\\text{adj}(2A))| = 32^n$, then $3n + a$ is equal to",
    imageUrl: null,
    optionA: "(1) 10",
    optionB: "(2) 9",
    optionC: "(3) 12",
    optionD: "(4) 11",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $S = \\{Z \\in \\mathbb{C} : \\bar{z} = i(z^2 + \\text{Re}(\\bar{z}))\\}$. Then $\\sum_{z \\in S} |z|^2$ is equal to",
    imageUrl: null,
    optionA: "(1) 7/2",
    optionB: "(2) 4",
    optionC: "(3) 5/2",
    optionD: "(4) 3",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The area of the region $\{(x, y) : x^2 \\le y \\le |x^2 - 4|, y \\ge 1\}$ is",
    imageUrl: null,
    optionA: "(1) $\\frac{3}{4}(4\\sqrt{2} - 1)$",
    optionB: "(2) $\\frac{4}{3}(4\\sqrt{2} - 1)$",
    optionC: "(3) $\\frac{4}{3}(4\\sqrt{2} + 1)$",
    optionD: "(4) $\\frac{3}{4}(4\\sqrt{2} + 1)$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let for a triangle ABC, $\\vec{AB} = -2\\hat{i} + \\hat{j} + 3\\hat{k}, \\vec{CB} = \\alpha\\hat{i} + \\beta\\hat{j} + \\gamma\\hat{k}$ and $\\vec{CA} = 4\\hat{i} + 3\\hat{j} + \\delta\\hat{k}$. If $\\delta > 0$ and the area of the triangle ABC is $5\\sqrt{6}$, then $\\vec{CB} \\cdot \\vec{CA}$ is equal to",
    imageUrl: null,
    optionA: "(1) 60",
    optionB: "(2) 120",
    optionC: "(3) 108",
    optionD: "(4) 54",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The line, that is coplanar to the line $\\frac{x+3}{-3} = \\frac{y-1}{1} = \\frac{z-5}{5}$, is",
    imageUrl: null,
    optionA: "(1) $\\frac{x+1}{1} = \\frac{y-2}{2} = \\frac{z-5}{5}$",
    optionB: "(2) $\\frac{x+1}{-1} = \\frac{y-2}{2} = \\frac{z-5}{5}$",
    optionC: "(3) $\\frac{x+1}{-1} = \\frac{y-2}{2} = \\frac{z-5}{4}$",
    optionD: "(4) $\\frac{x-1}{-1} = \\frac{y-2}{2} = \\frac{z-5}{5}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The value of $\\frac{e^{\\pi/4} \\int_0^{\\pi/4} e^{-x} \\tan^{50} x dx}{\\int_0^{\\pi/4} e^{-x}(\\tan^{49} x + \\tan^{51} x)dx}$ is",
    imageUrl: null,
    optionA: "(1) 50",
    optionB: "(2) 49",
    optionC: "(3) 51",
    optionD: "(4) 25",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The mean and standard deviation of the marks of 10 students were found to be 50 and 12 respectively. Later, it was observed that two marks 20 and 25 were wrongly read as 45 and 50 respectively. Then the correct variance is _______.",
    imageUrl: null,
    optionA: "269",
    optionB: "269",
    optionC: "269",
    optionD: "269",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Let $A = \\{-4, -3, -2, 0, 1, 3, 4\\}$ and $R = \\{(a, b) \\in A \\times A : b = |a| \\text{ or } b^2 = a + 1\\}$ be a relation on A. Then the minimum number of elements, that must be added to the relation R so that it becomes reflexive and symmetric, is _______.",
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
    questionText: "Let $f(x) = \\sum_{k=1}^{10} k x^k, x \\in \\mathbb{R}$. If $2f(2) + f'(2) = 119(2)^n + 1$ then n is equal to ______.",
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
    subject: "Mathematics",
    questionText: "Total numbers of 3-digit numbers that are divisible by 6 and can be formed by using the digits 1, 2, 3, 4, 5 with repetition, is ________.",
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
    questionText: "Let [\\alpha] denote the greatest integer $\\le \\alpha$. Then $[\\sqrt{1}] + [\\sqrt{2}] + [\\sqrt{3}] + \\dots + [\\sqrt{120}]$ is equal to.",
    imageUrl: null,
    optionA: "825",
    optionB: "825",
    optionC: "825",
    optionD: "825",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "For $x \\in (-1, 1]$, the number of solutions of the equation $\\sin^{-1} x = 2\\tan^{-1} x$ is equal to",
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
    questionText: "If $y = y(x)$ is the solution of the differential equation $\\frac{dy}{dx} + \\frac{4x}{(x^2-1)}y = \\frac{x+2}{(x^2-1)^{5/2}}, x > 1$ such that $y(2) = \\frac{2}{9}\\log_e(2 + \\sqrt{3})$ and $y(\\sqrt{2}) = \\alpha \\log_e(\\sqrt{\\alpha}+\\beta) + \\beta - \\sqrt{\\gamma}, \\alpha, \\beta, \\gamma \\in \\mathbb{N}$, then $\\alpha\\beta\\gamma$ is",
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
    questionText: "The foci of a hyperbola are $(\\pm 2, 0)$ and its eccentricity is 3/2. A tangent, perpendicular to the line $2x + 3y = 6$, is drawn at a point in the first quadrant on the hyperbola. If the intercepts made by the tangent on the x - and y - axes are a and b respectively, then $|6a| + |5b|$ is equal to_____.",
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
    questionText: "Let $f_n = \\int_0^{\\pi/2} \\left(\\sum_{k=1}^n \\sin^{k-1} x\\right) \\left(\\sum_{k=1}^n (2k - 1) \\sin^{k-1} x\\right) \\cos x dx, n \\in \\mathbb{N}$. Then $f_{21} - f_{20}$ is equal to____.",
    imageUrl: null,
    optionA: "41",
    optionB: "41",
    optionC: "41",
    optionD: "41",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "The remainder, when $7^{103}$ is divided by 17 is ______.",
    imageUrl: null,
    optionA: "12",
    optionB: "12",
    optionC: "12",
    optionD: "12",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── CHEMISTRY (Q31 - Q60) ──
  {
    subject: "Chemistry",
    questionText: "In the wet tests for detection of various cations by precipitation, $\\text{Ba}^{2+}$ cations are detected by obtaining precipitate of",
    imageUrl: null,
    optionA: "(1) Ba(ox) : Barium oxalate",
    optionB: "(2) $\\text{BaCO}_3$",
    optionC: "(3) $\\text{Ba(OAc)}_2$",
    optionD: "(4) $\\text{BaSO}_4$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The naturally occurring amino acid that contains only one basic functional group in its chemical structure is",
    imageUrl: null,
    optionA: "(1) arginine",
    optionB: "(2) lysine",
    optionC: "(3) asparagine",
    optionD: "(4) histidine",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Given below are two statements related to Ellingham diagram:\nStatement-I : Ellingham diagrams can be constructed for formation of oxides, sulfides and halides of metals.\nStatement-II : It consists of plots of $\\Delta_f H^0$ vs T for formation of oxides of elements.\nIn the light of the above statements, choose the most appropriate answer:",
    imageUrl: null,
    optionA: "(1) Both Statement I and Statement II are incorrect",
    optionB: "(2) Statement I is incorrect but Statement II is. correct",
    optionC: "(3) Both Statement I and Statement II are correct",
    optionD: "(4) Statement I is correct but Statement II is incorrect",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Assertion A : The diameter of colloidal particles in solution should not be much smaller than wavelength of light to show Tyndall effect.\nReason R : The light scatters in all directions when the size of particles is large enough.\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) A is true but R is false",
    optionB: "(2) A is false but R is true",
    optionC: "(3) Both A and R are correct and R is the correct explanation of A",
    optionD: "(4) Both A and R are correct but R is NOT the correct explanation of A",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The total number of stereoisomers for the complex $[Cr(ox)_2 ClBr]^{3-}$ (where ox = oxalate) is:",
    imageUrl: null,
    optionA: "(1) 2",
    optionB: "(2) 3",
    optionC: "(3) 1",
    optionD: "(4) 4",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Better method for preparation of $\\text{BeF}_2$, among the following is",
    imageUrl: null,
    optionA: "(1) $(\\text{NH}_4)_2\\text{BeF}_4 \\xrightarrow{\\Delta} \\text{BeF}_2 + 2\\text{NH}_4\\text{F}$",
    optionB: "(2) $\\text{BeH}_2 + \\text{F}_2 \\xrightarrow{\\Delta} \\text{BeF}_2 + \\text{H}_2$",
    optionC: "(3) $\\text{Be} + \\text{F}_2 \\xrightarrow{\\Delta} \\text{BeF}_2$",
    optionD: "(4) $\\text{BeO} + \\text{C} + \\text{F}_2 \\xrightarrow{\\Delta} \\text{BeF}_2 + \\text{CO}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Assertion A : Isotopes of hydrogen have almost same chemical properties, but difference in their rates of reaction.\nReason R : Isotopes of hydrogen have different enthalpy of bond dissociation.\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both A and R are correct but R is NOT the correct explanation of A",
    optionB: "(2) Both A and R are correct and R is the correct explanation of A",
    optionC: "(3) A is not correct but R is correct",
    optionD: "(4) A is correct but R is not correct",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: Tropolone is an aromatic compound and has $8\\pi$ electrons.\nStatement II: $\\pi$ electrons of $>C = O$ group in tropolone is involved in aromaticity.\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both Statement I and Statement II are true",
    optionB: "(2) Statement I is true but Statement II is false",
    optionC: "(3) Statement I is false but Statement II is true",
    optionD: "(4) Both Statement I and Statement II are false",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Aniline $\\xrightarrow{\\text{Br}_2,\\text{CS}_2, 0-5^\\circ\\text{C}} B \\xrightarrow{\\text{NaNO}_2/\\text{HCl}} C \\xrightarrow[\\Delta]{\\text{H}_3\\text{PO}_2} 1,3,5-\\text{tribromobenzene}$. Compound A from the reaction sequence is:",
    imageUrl: null,
    optionA: "(1) Benzoic Acid",
    optionB: "(2) Phenol",
    optionC: "(3) Salicylic Acid",
    optionD: "(4) Aniline",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The major product for the addition of 2-mercaptoethanol to acrylonitrile in presence of base is:",
    imageUrl: null,
    optionA: "(1) 3-((2-hydroxyethyl)thio)propanenitrile",
    optionB: "(2) 3-((2-mercaptoethyl)oxy)propanenitrile",
    optionC: "(3) Thioamide derivative",
    optionD: "(4) Oxime derivative",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following are the Green house gases?\nA. Water vapour, B. Ozone, C. $I_2$, D. Molecular hydrogen\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) B and C only",
    optionB: "(2) C and D only",
    optionC: "(3) A and D only",
    optionD: "(4) A and B only",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List I with List II\nList I: A. Weak intermolecular forces of attraction, B. Hydrogen bonding, C. Heavily branched polymer, D. High density polymer\nList II: I. Hexamethylenediamine + adipic acid, II. $\\text{AlEt}_3 + \\text{TiCl}_4$, III. 2–chloro–1, 3-butadiene, IV. Phenol + formaldehyde",
    imageUrl: null,
    optionA: "(1) A - II, B - IV, C - I, D - III",
    optionB: "(2) A - III, B - I, C - IV, D - II",
    optionC: "(3) A - IV, B - I, C - III, D - II",
    optionD: "(4) A - IV, B - II, C - III, D - I",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: $\\text{SO}_2$ and $\\text{H}_2\\text{O}$ both possess V-shaped structure.\nStatement II: The bond angle of $\\text{SO}_2$ is less than that of $\\text{H}_2\\text{O}$.\nIn the light of the above statements, choose the most appropriate answer:",
    imageUrl: null,
    optionA: "(1) Both Statement I and Statement II are correct",
    optionB: "(2) Statement I is correct but Statement II is incorrect",
    optionC: "(3) Both Statement I and Statement II are incorrect",
    optionD: "(4) Statement I is incorrect but Statement II is correct",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The correct group of halide ions which can be oxidised by oxygen in acidic medium is",
    imageUrl: null,
    optionA: "(1) $\\text{Br}^-$ only",
    optionB: "(2) $\\text{Cl}^-, \\text{Br}^-$ and $\\text{I}^-$ only",
    optionC: "(3) $\\text{Br}^-$ and $\\text{I}^-$ only",
    optionD: "(4) $\\text{I}^-$ only",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "What happens when methane undergoes combustion in adiabatic system A and diathermic container system B respectively?",
    imageUrl: null,
    optionA: "(1) System A: Temperature rises ; System B: Temperature remains same",
    optionB: "(2) System A: Temperature falls ; System B: Temperature rises",
    optionC: "(3) System A: Temperature falls ; System B: Temperature remains same",
    optionD: "(4) System A: Temperature remains same ; System B: Temperature rises",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Assertion A : Order of acidic nature of the following compounds is A (2-chlorophenol) > B (4-fluorophenol) > C (3-methylphenol).\nReason R : Fluoro is a stronger electron withdrawing group than Chloro group.\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) A is false but R is true",
    optionB: "(2) Both A and R are correct and R is the correct explanation of A",
    optionC: "(3) Both A and R are correct but R is NOT the correct explanation of A",
    optionD: "(4) A is true but R is false",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Identify the correct order of standard enthalpy of formation of sodium halides.",
    imageUrl: null,
    optionA: "(1) NaI < NaBr < NaCl < NaF",
    optionB: "(2) NaF < NaCl < NaBr < NaI",
    optionC: "(3) NaCl < NaF < NaBr < NaI",
    optionD: "(4) NaI < NaBr < NaF < NaCl",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List I (Reagent) with List II (Product) for 1 - Bromopropane:\nA. KOH (alc) -> I. Nitrile\nB. KCN (alc) -> II. Ester\nC. $\\text{AgNO}_2$ -> III. Alkene\nD. $\\text{H}_3\\text{CCOOAg}$ -> IV. Nitroalkane",
    imageUrl: null,
    optionA: "(1) A - IV, B - III, C - II, D - I",
    optionB: "(2) A - III, B - I, C - IV, D - II",
    optionC: "(3) A - I, B - II, C - III, D - IV",
    optionD: "(4) A - I, B - III, C - IV, D - II",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The covalency and oxidation state respectively of boron in $[BF_4]^-$ are",
    imageUrl: null,
    optionA: "(1) 4 and 3",
    optionB: "(2) 4 and 4",
    optionC: "(3) 3 and 4",
    optionD: "(4) 3 and 5",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following complexes will exhibit maximum attraction to an applied magnetic field?",
    imageUrl: null,
    optionA: "(1) $[Zn(H_2O)_6]^{2+}$",
    optionB: "(2) $[Co(H_2O)_6]^{2+}$",
    optionC: "(3) $[Co(en)_3]^{3+}$",
    optionD: "(4) $[Ni(H_2O)_6]^{2+}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "0.400 g of an organic compound (X) gave 0.376 g of AgBr in Carius method for estimation of bromine. % of bromine in the compound (X) is_____.",
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
    questionText: "1g of a carbonate ($\\text{M}_2\\text{CO}_3$) on treatment with excess HCl produces 0.01 mol of $\\text{CO}_2$. The molar mass of $\\text{M}_2\\text{CO}_3$ is _______ $\\text{g mol}^{-1}$. (Nearest integer)",
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
    subject: "Chemistry",
    questionText: "In dichromate oxidation: $\\text{Cr}_2\\text{O}_7^{2-} + X\\text{H}^+ + 6\\text{Fe}^{2+} \\to Y\\text{Cr}^{3+} + 6\\text{Fe}^{3+} + Z\\text{H}_2\\text{O}$. The sum of X, Y and Z is _______.",
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
    questionText: "If the formula of Borax is $\\text{Na}_2\\text{B}_4\\text{O}_x(\\text{OH})_y \\cdot z\\text{H}_2\\text{O}$, then $x + y + z = \\text{_________}$.",
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
    subject: "Chemistry",
    questionText: "At 298 K, the standard reduction potential for $\\text{Cu}^{2+}/\\text{Cu}$ electrode is 0.34 V. Given $K_{sp} \\text{ Cu(OH)}_2 = 1 \\times 10^{-20}$. The reduction potential at pH = 14 for above couple is $(-)x \\times 10^{-2}\\text{ V}$. Value of x is _______.",
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
    subject: "Chemistry",
    questionText: "20 mL of 0.1 M NaOH is added to 50 mL of 0.1 M acetic acid solution. The pH of the resulting solution is ________ $\\times 10^{-2}$ (Nearest integer). ($pKa = 4.76, \\log 2 = 0.30, \\log 3 = 0.48$)",
    imageUrl: null,
    optionA: "448",
    optionB: "448",
    optionC: "448",
    optionD: "448",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "$A(g) \\to 2B(g) + C(g)$ is first order reaction. Initial pressure 800 mm Hg, 1600 mm Hg after 10 min. Total pressure after 30 min is _____ mm Hg.",
    imageUrl: null,
    optionA: "2200",
    optionB: "2200",
    optionC: "2200",
    optionD: "2200",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "The orbital angular momentum of an electron in 3s orbital is $\\frac{x h}{2\\pi}$. The value of x is",
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
    questionText: "Sodium metal crystallizes in BCC lattice with unit cell edge length 4 Å. Radius of sodium atom is ________ $\\times 10^{-1}Å$.",
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
    subject: "Chemistry",
    questionText: "Sea water contains 29.25% NaCl and 19% $\\text{MgCl}_2$ by weight. Boiling point of sea water is _____$^\\circ\\text{C}$ (Nearest integer). ($K_b = 0.52\\text{ K kg mol}^{-1}$)",
    imageUrl: null,
    optionA: "116",
    optionB: "116",
    optionC: "116",
    optionD: "116",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── PHYSICS (Q61 - Q90) ──
  {
    subject: "Physics",
    questionText: "Assertion A : The binding energy per nucleon is practically independent of the atomic number for nuclei of mass number in the range 30 to 170.\nReason R : Nuclear force is short ranged.\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both A and R are true but R is NOT the correct explanation of A",
    optionB: "(2) A is true but R is false",
    optionC: "(3) A is false but R is true",
    optionD: "(4) Both A and R are true and R is the correct explanation of A",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The output waveform from a NAND gate having inputs A and B (A: 1 0 1 0..., B: 1 0 0 1...) is high (1) whenever both inputs are not 1. Output waveform corresponds to Option 1.",
    imageUrl: null,
    optionA: "(1) Waveform 1",
    optionB: "(2) Waveform 2",
    optionC: "(3) Waveform 3",
    optionD: "(4) Waveform 4",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In parallel circuit with $4\\mu\\text{F}$ capacitor connected across $6\\Omega$ and $6\\Omega$ parallel branch with 3V source, charge accumulated in capacitor in steady state is:",
    imageUrl: null,
    optionA: "(1) $7.2\\mu\\text{C}$",
    optionB: "(2) $4.8\\mu\\text{C}$",
    optionC: "(3) $10.3\\mu\\text{C}$",
    optionD: "(4) $12\\mu\\text{C}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Statement I: For a planet, if the ratio of mass of the planet to its radius increases, the escape velocity from the planet also increases.\nStatement II: Escape velocity is independent of the radius of the planet.",
    imageUrl: null,
    optionA: "(1) Both Statement I and Statement II are incorrect",
    optionB: "(2) Statement I is correct but statement II is incorrect",
    optionC: "(3) Statement I is incorrect but statement II is correct",
    optionD: "(4) Both Statement I and Statement II are correct",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A particle executes SHM of amplitude A. The distance from the mean position when its's kinetic energy becomes equal to its potential energy is :",
    imageUrl: null,
    optionA: "(1) $\\sqrt{2}A$",
    optionB: "(2) 2A",
    optionC: "(3) $\\frac{1}{\\sqrt{2}}A$",
    optionD: "(4) $\\frac{1}{2}A$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A passenger sitting in a train A moving at 90 km/h observes another train B moving in the opposite direction for 8 s. If the velocity of the train B is 54 km/h, then length of train B is :",
    imageUrl: null,
    optionA: "(1) 80 m",
    optionB: "(2) 200 m",
    optionC: "(3) 120 m",
    optionD: "(4) 320 m",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The initial pressure and volume of an ideal gas are $P_0$ and $V_0$. The final pressure of the gas when the gas is suddenly compressed to volume $V_0/4$ will be :",
    imageUrl: null,
    optionA: "(1) $P_0 (4)^{1/\\gamma}$",
    optionB: "(2) $P_0 (4)^\\gamma$",
    optionC: "(3) $P_0$",
    optionD: "(4) $4 P_0$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Assertion A : A spherical body of radius $(5 \\pm 0.1)\\text{ mm}$ having a particular density is falling through a liquid of constant density. The percentage error in the calculation of its terminal velocity is 4%.\nReason R : The terminal velocity of the spherical body falling through the liquid is inversely proportional to its radius.\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both A and R are true but R is NOT the correct explanation of A",
    optionB: "(2) Both A and R are true and R is the correct explanation of A",
    optionC: "(3) A is false but R is true",
    optionD: "(4) A is true but R is false",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In an electromagnetic wave, at an instant and at a particular position, the electric field is along the negative z-axis and magnetic field is along the positive x-axis. Then the direction of propagation of electromagnetic wave is :",
    imageUrl: null,
    optionA: "(1) at 45º angle from positive y-axis",
    optionB: "(2) negative y-axis",
    optionC: "(3) positive z-axis",
    optionD: "(4) positive y-axis",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The distance travelled by an object in time t is given by $s = (2.5)t^2$. The instantaneous speed of the object at $t = 5\\text{ s}$ will be :",
    imageUrl: null,
    optionA: "(1) $12.5\\text{ ms}^{-1}$",
    optionB: "(2) $62.5\\text{ ms}^{-1}$",
    optionC: "(3) $5\\text{ ms}^{-1}$",
    optionD: "(4) $25\\text{ ms}^{-1}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "An electron is moving along the positive x-axis. If the uniform magnetic field is applied parallel to the negative z-axis. then\nA. The electron will experience magnetic force along positive y-axis\nB. The electron will experience magnetic force along negative y-axis\nC. The electron will not experience any force in magnetic field\nD. The electron will continue to move along the positive x-axis\nE. The electron will move along circular path in magnetic field\nChoose the correct answer:",
    imageUrl: null,
    optionA: "(1) B and E only",
    optionB: "(2) A and E only",
    optionC: "(3) C and D only",
    optionD: "(4) B and D only",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Two planets A and B of radii R and 1.5 R have densities $\\rho$ and $\\rho/2$ respectively. The ratio of acceleration due to gravity at the surface of B to A is :",
    imageUrl: null,
    optionA: "(1) 2 : 3",
    optionB: "(2) 2 : 1",
    optionC: "(3) 3 : 4",
    optionD: "(4) 4 : 3",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Statement I : An AC circuit undergoes electrical resonance if it contains either a capacitor or an inductor.\nStatement II : An AC circuit containing a pure capacitor or a pure inductor consumes high power due to its non-zero power factor.",
    imageUrl: null,
    optionA: "(1) Both Statement I and Statement II are false",
    optionB: "(2) Statement I is true but Statement II is false",
    optionC: "(3) Both Statement I and Statement II are true",
    optionD: "(4) Statement I is false but Statement II is true",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A vehicle of mass 200 kg is moving along a levelled curved road of radius 70 m with angular velocity of 0.2 rad/s. The centripetal force acting on the vehicle is :",
    imageUrl: null,
    optionA: "(1) 560 N",
    optionB: "(2) 2800 N",
    optionC: "(3) 14 N",
    optionD: "(4) 2240 N",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "To radiate EM signal of wavelength $\\lambda$ with high efficiency, the antennas should have a minimum size equal to :",
    imageUrl: null,
    optionA: "(1) $\\lambda/2$",
    optionB: "(2) $\\lambda/4$",
    optionC: "(3) $2\\lambda$",
    optionD: "(4) $\\lambda$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Statement I : Out of microwaves, infrared rays and ultraviolet rays, ultraviolet rays are the most effective for the emission of electrons from a metallic surface.\nStatement II : Above the threshold frequency, the maximum kinetic energy of photoelectrons is inversely proportional to the frequency of the incident light.",
    imageUrl: null,
    optionA: "(1) Statement I is true but Statement II is false",
    optionB: "(2) Both Statement I and Statement II are true",
    optionC: "(3) Statement I is false but Statement II is true",
    optionD: "(4) Both Statement I and Statement II are false",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A $10\\mu\\text{C}$ charge is divided into two parts and placed at 1 cm distance so that the repulsive force between them is maximum. The charges of the two parts are :",
    imageUrl: null,
    optionA: "(1) $9\\mu\\text{C}, 1\\mu\\text{C}$",
    optionB: "(2) $5\\mu\\text{C}, 5\\mu\\text{C}$",
    optionC: "(3) $7\\mu\\text{C}, 3\\mu\\text{C}$",
    optionD: "(4) $8\\mu\\text{C}, 2\\mu\\text{C}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In van der Waals equation $[X + \\frac{a}{Y^2}][Y - b] = RT$, $X$ is pressure, $Y$ is volume. Physical quantity equivalent to ratio $a/b$ is:",
    imageUrl: null,
    optionA: "(1) Energy",
    optionB: "(2) Impulse",
    optionC: "(3) Pressure gradient",
    optionD: "(4) Coefficient of viscosity",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In a Young's double slits experiment, the ratio of amplitude of light coming from slits is 2 : 1. The ratio of the maximum to minimum intensity in the interference pattern is :",
    imageUrl: null,
    optionA: "(1) 9 : 4",
    optionB: "(2) 9 : 1",
    optionC: "(3) 2 : 1",
    optionD: "(4) 25 : 9",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The mean free path of molecules of a certain gas at STP is 1500d, where d is the diameter of the gas molecules. While maintaining the standard pressure, the mean free path of the molecules at 373K is approximately :",
    imageUrl: null,
    optionA: "(1) 1098d",
    optionB: "(2) 2049d",
    optionC: "(3) 750d",
    optionD: "(4) 1500d",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A bi convex lens of focal length 10 cm is cut in two identical parts along a plane perpendicular to the principal axis. The power of each lens after cut is _________ D.",
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
    questionText: "An atom absorbs a photon of wavelength 500 nm and emits another photon of wavelength 600 nm. The net energy absorbed by the atom in this process is $n \\times 10^{-4}\\text{eV}$. The value of n is _______.",
    imageUrl: null,
    optionA: "4125",
    optionB: "4125",
    optionC: "4125",
    optionD: "4125",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Three point charges $q, -2q$ and $2q$ are placed on x-axis at $x = 0, x = \\frac{3}{4}R$ and $x = R$. If $q = 2 \\times 10^{-6}\\text{ C}$ and $R = 2\\text{ cm}$, magnitude of net force on $-2q$ is _________ N.",
    imageUrl: null,
    optionA: "5440",
    optionB: "5440",
    optionC: "5440",
    optionD: "5440",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "In the bridge circuit with $3\\Omega, 4\\Omega, 9\\Omega, 2\\Omega$ and $6\\mu\\text{F}$ capacitor across 12V source, energy stored in capacitor is n $\\mu\\text{J}$. Value of n is _________.",
    imageUrl: null,
    optionA: "75",
    optionB: "75",
    optionC: "75",
    optionD: "75",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "An insulated copper wire of 100 turns is wrapped around a wooden cylindrical core of area $24\\text{ cm}^2$. Total resistance is $12\\Omega$. If magnetic field changes from 1.5 T in one direction to 1.5 T in opposite, charge flowing is ____________ mC.",
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
    questionText: "In a sonometer when 180 g mass is attached, fundamental frequency is 30 Hz. When mass m is attached, fundamental frequency is 50 Hz. Value of m is ________g.",
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
    questionText: "A light rope is wound around a hollow cylinder of mass 5 kg and radius 70 cm. The rope is pulled with a force of 52.5 N. The angular acceleration of the cylinder will be ____________ $\\text{rad s}^{-2}$.",
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
    subject: "Physics",
    questionText: "A car accelerates from rest to u m/s. Energy spent is E J. Energy required to accelerate car from u m/s to 2u m/s is nE J. Value of n is __________.",
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
    questionText: "Two plates A and B have thermal conductivities $84\\text{ Wm}^{-1}\\text{K}^{-1}$ and $126\\text{ Wm}^{-1}\\text{K}^{-1}$ respectively. Same surface area and thickness. Outer surfaces kept at $100^\\circ\\text{C}$ and $0^\\circ\\text{C}$. Temperature of contact surface in steady state is ________$^\\circ\\text{C}$.",
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
    subject: "Physics",
    questionText: "Straight wire AB of mass 40 g and length 50 cm is suspended by flexible leads in uniform magnetic field $B = 0.40\\text{ T}$. Magnitude of current to remove tension is ________A. ($g = 10\\text{ ms}^{-2}$)",
    imageUrl: null,
    optionA: "2",
    optionB: "2",
    optionC: "2",
    optionD: "2",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  }
];

async function seedJee2023Apr13Shift2() {
  console.log(`🚀 Compiling JEE Main 2023 (13 Apr Shift 2) Paper with ${rawQuestions.length} questions...`);

  const paperData = {
    examName: "JEE Main",
    year: 2023,
    shiftName: "JEE Main 2023 (13 Apr Shift 2)",
    examDate: "2023-04-13T15:00:00Z",
    totalMarks: 300,
    totalQuestions: 90,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'JEE Main 2023 (13 Apr Shift 2).json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved paper JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding JEE Main 2023 (13 Apr Shift 2) into PostgreSQL via Prisma...`);
  
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
      name: "JEE Main 2023 (13 Apr Shift 2)"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "JEE Main 2023 (13 Apr Shift 2)",
      date: new Date("2023-04-13T15:00:00Z")
    }
  });
  console.log(`Created Shift "JEE Main 2023 (13 Apr Shift 2)" (ID: ${shift.id})`);

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

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for JEE Main 2023 (13 Apr Shift 2) into Database!`);
}

seedJee2023Apr13Shift2()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
