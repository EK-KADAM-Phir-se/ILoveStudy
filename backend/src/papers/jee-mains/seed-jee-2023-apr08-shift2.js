const prisma = require('../../lib/prisma');
const fs = require('fs');
const path = require('path');

const rawQuestions = [
  // ── MATHEMATICS (Q1 - Q30) ──
  {
    subject: "Mathematics",
    questionText: "If the image of the point (-4, 5) in the line $x + 2y = 2$ lies on the circle $(x + 4)^2 + (y - 3)^2 = r^2$, then r is equal to :",
    imageUrl: null,
    optionA: "(1) 1",
    optionB: "(2) 2",
    optionC: "(3) 75",
    optionD: "(4) 3",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $\\vec{a} = \\hat{i} + 2\\hat{j} + 3\\hat{k}, \\vec{b} = 2\\hat{i} + 3\\hat{j} - 5\\hat{k}$ and $\\vec{c} = 3\\hat{i} - \\hat{j} + \\lambda\\hat{k}$ be three vectors. Let $\\vec{r}$ be a unit vector along $\\vec{b} + \\vec{c}$. If $\\vec{r} \\cdot \\vec{a} = 3$, then $3\\lambda$ is equal to:",
    imageUrl: null,
    optionA: "(1) 27",
    optionB: "(2) 25",
    optionC: "(3) 28",
    optionD: "(4) 21",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If $\\alpha \\neq a, \\beta \\neq b, \\gamma \\neq c$ and $\\begin{vmatrix} \\alpha & b & c \\\\ a & \\beta & c \\\\ a & b & \\gamma \\end{vmatrix} = 0$, then $\\frac{a}{\\alpha-a} + \\frac{b}{\\beta-b} + \\frac{\\gamma}{\\gamma-c}$ is equal to :",
    imageUrl: null,
    optionA: "(1) 2",
    optionB: "(2) 3",
    optionC: "(3) 0",
    optionD: "(4) 1",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "In an increasing geometric progression of positive terms, the sum of the second and sixth terms is 70/3 and the product of the third and fifth terms is 49. Then the sum of the $4^{\\text{th}}, 6^{\\text{th}}$ and $8^{\\text{th}}$ terms is :-",
    imageUrl: null,
    optionA: "(1) 96",
    optionB: "(2) 78",
    optionC: "(3) 91",
    optionD: "(4) 84",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The number of ways five alphabets can be chosen from the alphabets of the word MATHEMATICS, where the chosen alphabets are not necessarily distinct, is equal to :",
    imageUrl: null,
    optionA: "(1) 175",
    optionB: "(2) 181",
    optionC: "(3) 177",
    optionD: "(4) 179",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The sum of all possible values of $\\theta \\in [-\\pi, 2\\pi]$, for which $\\frac{1+i\\cos\\theta}{1-2i\\cos\\theta}$ is purely imaginary, is equal to",
    imageUrl: null,
    optionA: "(1) $2\\pi$",
    optionB: "(2) $3\\pi$",
    optionC: "(3) $5\\pi$",
    optionD: "(4) $4\\pi$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If the system of equations $x + 4y - z = \\lambda, 7x + 9y + \\mu z = -3, 5x + y + 2z = -1$ has infinitely many solutions, then $(2\\mu + 3\\lambda)$ is equal to :",
    imageUrl: null,
    optionA: "(1) 2",
    optionB: "(2) -3",
    optionC: "(3) 3",
    optionD: "(4) -2",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If the shortest distance between the lines $\\frac{x-\\lambda}{2} = \\frac{y-4}{3} = \\frac{z-3}{4}$ and $\\frac{x-2}{4} = \\frac{y-4}{6} = \\frac{z-7}{8}$ is $\\frac{13}{\\sqrt{29}}$, then a value of $\\lambda$ is :",
    imageUrl: null,
    optionA: "(1) $-13/25$",
    optionB: "(2) $13/25$",
    optionC: "(3) 1",
    optionD: "(4) -1",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If the value of $\\frac{3\\cos 36^\\circ + 5\\sin 18^\\circ}{5\\cos 36^\\circ - 3\\sin 18^\\circ}$ is $\\frac{a\\sqrt{5}-b}{c}$, where a, b, c are natural numbers and $\\text{gcd}(a, c) = 1$, then $a + b + c$ is equal to :",
    imageUrl: null,
    optionA: "(1) 50",
    optionB: "(2) 40",
    optionC: "(3) 52",
    optionD: "(4) 54",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $y = y(x)$ be the solution curve of the differential equation $\\sec y \\frac{dy}{dx} + 2x \\sin y = x^3 \\cos y, y(1) = 0$. Then $y(\\sqrt{3})$ is equal to :",
    imageUrl: null,
    optionA: "(1) $\\pi/3$",
    optionB: "(2) $\\pi/6$",
    optionC: "(3) $\\pi/4$",
    optionD: "(4) $\\pi/12$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The area of the region in the first quadrant inside the circle $x^2 + y^2 = 8$ and outside the parabola $y^2 = 2x$ is equal to :",
    imageUrl: null,
    optionA: "(1) $\\frac{\\pi}{2} - \\frac{1}{3}$",
    optionB: "(2) $\\pi - \\frac{2}{3}$",
    optionC: "(3) $\\frac{\\pi}{2} - \\frac{2}{3}$",
    optionD: "(4) $\\pi - \\frac{1}{3}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If the line segment joining the points (5, 2) and (2, a) subtends an angle $\\frac{\\pi}{4}$ at the origin, then the absolute value of the product of all possible values of a is :",
    imageUrl: null,
    optionA: "(1) 6",
    optionB: "(2) 8",
    optionC: "(3) 2",
    optionD: "(4) 4",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $\\vec{a} = 4\\hat{i} - \\hat{j} + \\hat{k}, \\vec{b} = 11\\hat{i} - \\hat{j} + \\hat{k}$ and $\\vec{c}$ be a vector such that $(\\vec{a} + \\vec{b}) \\times \\vec{c} = \\vec{c} \\times (-2\\vec{a} + 3\\vec{b})$. If $(2\\vec{a} + 3\\vec{b}) \\cdot \\vec{c} = 1670$, then $|\\vec{c}|^2$ is equal to :",
    imageUrl: null,
    optionA: "(1) 1627",
    optionB: "(2) 1618",
    optionC: "(3) 1600",
    optionD: "(4) 1609",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If the function $f(x) = 2x^3 – 9ax^2 + 12a^2x + 1, a > 0$ has a local maximum at $x = \\alpha$ and a local minimum $x = \\alpha^2$, then $\\alpha$ and $\\alpha^2$ are the roots of the equation :",
    imageUrl: null,
    optionA: "(1) $x^2 - 6x + 8 = 0$",
    optionB: "(2) $8x^2 + 6x - 8 = 0$",
    optionC: "(3) $8x^2 - 6x + 1 = 0$",
    optionD: "(4) $x^2 + 6x + 8 = 0$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "There are three bags X, Y and Z. Bag X contains 5 one-rupee coins and 4 five-rupee coins; Bag Y contains 4 one-rupee coins and 5 five-rupee coins and Bag Z contains 3 one-rupee coins and 6 five rupee coins. A bag is selected at random and a coin drawn from it at random is found to be a one-rupee coin. Then the probability, that it came from bag Y, is :",
    imageUrl: null,
    optionA: "(1) 1/3",
    optionB: "(2) 1/2",
    optionC: "(3) 1/4",
    optionD: "(4) 5/12",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $\\int_{\\alpha}^{\\log_e 4} \\frac{dx}{\\sqrt{e^x-1}} = \\frac{\\pi}{6}$. Then $e^{\\alpha}$ and $e^{-\\alpha}$ are the roots of the equation :",
    imageUrl: null,
    optionA: "(1) $2x^2 - 5x + 2 = 0$",
    optionB: "(2) $x^2 - 2x - 8 = 0$",
    optionC: "(3) $2x^2 - 5x - 2 = 0$",
    optionD: "(4) $x^2 + 2x - 8 = 0$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $f(x) = \\begin{cases} -a, & -a \\le x \\le 0 \\\\ x+a, & 0 < x \\le a \\end{cases}$ where $a > 0$ and $g(x) = (f(|x|) - |f(x)|)/2$. Then the function $g : [-a, a] \\to [-a, a]$ is",
    imageUrl: null,
    optionA: "(1) neither one-one nor onto.",
    optionB: "(2) both one-one and onto.",
    optionC: "(3) one-one.",
    optionD: "(4) onto.",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $A = \\{2, 3, 6, 8, 9, 11\\}$ and $B = \\{1, 4, 5, 10, 15\\}$. Let R be a relation on $A \\times B$ defined by $(a, b)R(c, d)$ if and only if $3ad – 7bc$ is an even integer. Then the relation R is",
    imageUrl: null,
    optionA: "(1) reflexive but not symmetric.",
    optionB: "(2) transitive but not symmetric.",
    optionC: "(3) reflexive and symmetric but not transitive.",
    optionD: "(4) an equivalence relation.",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "For $a, b > 0$, let $f(x) = \\begin{cases} \\frac{\\tan((a+1)x)+b\\tan x}{x}, & x < 0 \\\\ 3, & x = 0 \\\\ \\frac{\\sqrt{ax+b^2x^2}-\\sqrt{ax}}{b\\sqrt{a}x\\sqrt{x}}, & x > 0 \\end{cases}$ be a continuous function at $x = 0$. Then $\\frac{b}{a}$ is equal to",
    imageUrl: null,
    optionA: "(1) 5",
    optionB: "(2) 4",
    optionC: "(3) 8",
    optionD: "(4) 6",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If the term independent of x in the expansion of $(\\sqrt{ax^2} + \\frac{1}{2x^3})^{10}$ is 105, then $a^2$ is equal to :",
    imageUrl: null,
    optionA: "(1) 4",
    optionB: "(2) 9",
    optionC: "(3) 6",
    optionD: "(4) 2",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let A be the region enclosed by the parabola $y^2 = 2x$ and the line $x = 24$. Then the maximum area of the rectangle inscribed in the region A is _________ .",
    imageUrl: null,
    optionA: "128",
    optionB: "128",
    optionC: "128",
    optionD: "128",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "If $\\alpha = \\lim_{x\\to 0^+} (\\frac{e^{\\sqrt{\\tan x}}-e^{\\sqrt{x}}}{\\sqrt{\\tan x}-\\sqrt{x}})$ and $\\beta = \\lim_{x\\to 0} (1 + \\sin x)^{\\frac{1}{2}\\cot x}$ are the roots of the quadratic equation $ax^2 + bx - \\sqrt{e} = 0$, then $12\\log_e(a + b)$ is equal to _________ .",
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
    questionText: "Let S be the focus of the hyperbola $\\frac{x^2}{3} - \\frac{y^2}{5} = 1$, on the positive x-axis. Let C be the circle with its centre at $A(\\sqrt{6}, \\sqrt{5})$ and passing through the point S. if O is the origin and SAB is a diameter of C then the square of the area of the triangle OSB is equal to -",
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
    subject: "Mathematics",
    questionText: "Let $P(\\alpha, \\beta, \\gamma)$ be the image of the point Q(1, 6, 4) in the line $\\frac{x}{1} = \\frac{y-1}{2} = \\frac{z-2}{3}$. Then $2\\alpha + \\beta + \\gamma$ is equal to _______ .",
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
    questionText: "An arithmetic progression is written with rows: Row 1: 2; Row 2: 5, 8; Row 3: 11, 14, 17; Row 4: 20, 23, 26, 29... The sum of all the terms of the $10^{\\text{th}}$ row is ______ .",
    imageUrl: null,
    optionA: "1505",
    optionB: "1505",
    optionC: "1505",
    optionD: "1505",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "The number of distinct real roots of the equation $|x + 1||x + 3| - 4|x + 2| + 5 = 0$, is ________ .",
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
    questionText: "Let a ray of light passing through the point (3, 10) reflects on the line $2x + y = 6$ and the reflected ray passes through the point (7, 2). If the equation of the incident ray is $ax + by + 1 = 0$, then $a^2 + b^2 + 3ab$ is equal to_.",
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
    questionText: "Let $a, b, c \\in \\mathbb{N}$ and $a < b < c$. Let the mean, the mean deviation about the mean and the variance of the 5 observations 9, 25, a, b, c be 18, 4 and $\\frac{136}{5}$, respectively. Then $2a + b - c$ is equal to _______ .",
    imageUrl: null,
    optionA: "33",
    optionB: "33",
    optionC: "33",
    optionD: "33",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Let $\\alpha|x| = |y|e^{xy-\\beta}, \\alpha, \\beta \\in \\mathbb{N}$ be the solution of the differential equation $xdy - ydx + xy(xdy + ydx) = 0, y(1) = 2$. Then $\\alpha + \\beta$ is equal to _",
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
    questionText: "If $\\int \\frac{1}{\\sqrt[5]{(x-1)^4(x+3)^6}} dx = A\\left(\\frac{\\alpha x - 1}{\\beta x + 3}\\right)^B + C$, where C is the constant of integration, then the value of $\\alpha + \\beta + 20AB$ is _______ .",
    imageUrl: null,
    optionA: "7",
    optionB: "7",
    optionC: "7",
    optionD: "7",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── CHEMISTRY (Q31 - Q60) ──
  {
    subject: "Chemistry",
    questionText: "The statement/s which are true about antagonists from the following is/are :\nA. They bind to the receptor site\nB. Get transferred inside the cell for their action\nC. Inhibit the natural communication of the body\nD. Mimic the natural messenger.",
    imageUrl: null,
    optionA: "(1) A and B",
    optionB: "(2) A and C",
    optionC: "(3) A, C and D",
    optionD: "(4) B only",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The correct reaction profile diagram for a positive catalyst reaction has a lower activation energy peak than the uncatalyzed path. Which curve correctly depicts it?",
    imageUrl: null,
    optionA: "(1) Curve 1",
    optionB: "(2) Curve 2",
    optionC: "(3) Curve 3",
    optionD: "(4) Curve 4 (Lower EA barrier for catalyzed route)",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Assertion A: Sodium is about 30 times as abundant as potassium in the oceans.\nReason R: Potassium is bigger in size than sodium.\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both A and R are true but R is NOT the correct explanation of A",
    optionB: "(2) A is true but R is false",
    optionC: "(3) A is false but R is true",
    optionD: "(4) Both A and R are true and R is the correct explanation of A",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which of these reactions is not a part of breakdowns of ozone in stratosphere?",
    imageUrl: null,
    optionA: "(1) $\\text{CF}_2\\text{Cl}_2(g) \\xrightarrow{uv} \\dot{\\text{C}}\\text{l}(g) + \\dot{\\text{C}}\\text{F}_2\\text{Cl}(g)$",
    optionB: "(2) $\\dot{\\text{C}}\\text{l}(g) + \\text{O}_3(g) \\to \\text{Cl}\\dot{\\text{O}}(g) + \\text{O}_2(g)$",
    optionC: "(3) $2\\text{Cl}\\dot{\\text{O}} \\to \\text{ClO}_2(g) + \\dot{\\text{C}}\\text{l}(g)$",
    optionD: "(4) $\\text{Cl}\\dot{\\text{O}}(g) + \\text{O}(g) \\to \\dot{\\text{C}}\\text{l}(g) + \\text{O}_2(g)$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The correct IUPAC nomenclature for 5-methyl-2-oxohexanoic acid is:",
    imageUrl: null,
    optionA: "(1) 2-Methyl-5-oxohexanoic acid",
    optionB: "(2) 2-Formyl-5-methylhexan-6-oic acid",
    optionC: "(3) 5-Formyl-2-methylhexanoic acid",
    optionD: "(4) 5-Methyl-2-oxohexan-6-oic acid",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Henry Moseley studied characteristic X-ray spectra of elements. The graph which represents his observation correctly is $\\sqrt{\\nu}$ vs z (linear).",
    imageUrl: null,
    optionA: "(1) $\\nu$ vs z",
    optionB: "(2) $\\sqrt{\\nu}$ vs z (Linear graph passing near origin)",
    optionC: "(3) $\\sqrt{z}$ vs $\\nu$",
    optionD: "(4) $\\nu^2$ vs z",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match list I with list II\nList I (Coordination complex): A. $[Cr(CN)_6]^{3-}$, B. $[Fe(H_2O)_6]^{2+}$, C. $[Co(NH_3)_6]^{3+}$, D. $[Ni(NH_3)_6]^{2+}$\nList II (Number of unpaired electrons): I. 0, II. 3, III. 2, IV. 4",
    imageUrl: null,
    optionA: "(1) A - II, B - IV, C - I, D - III",
    optionB: "(2) A - IV, B - III, C - II, D - I",
    optionC: "(3) A - II, B - I, C - IV, D - III",
    optionD: "(4) A - III, B - IV, C - I, D - II",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Major product ‘P’ formed in intramolecular halolactonization of pent-4-enoic acid with $\\text{Br}_2 / \\text{NaHCO}_3$ is:",
    imageUrl: null,
    optionA: "(1) 5-(bromomethyl)dihydrofuran-2(3H)-one",
    optionB: "(2) 5-bromotetrahydropyran-2-one",
    optionC: "(3) 5-(bromomethyl)dihydrofuran-2-one (5-membered lactone)",
    optionD: "(4) 4,5-dibromopentanoic acid",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "For a good quality cement, the ratio of lime to the total of the oxides of Si, Al and Fe should be as close as to",
    imageUrl: null,
    optionA: "(1) 2",
    optionB: "(2) 1",
    optionC: "(3) 3",
    optionD: "(4) 4",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match list I with list II\nList I (Natural amino acid): A. Glutamic acid, B. Glutamine, C. Tyrosine, D. Tryptophan\nList II (One letter code): I. Q, II. W, III. E, IV. Y",
    imageUrl: null,
    optionA: "(1) A - III, B - I, C - IV, D - II",
    optionB: "(2) A - IV, B - III, C - I, D - II",
    optionC: "(3) A - II, B - I, C - IV, D - III",
    optionD: "(4) A - III, B - IV, C - I, D - II",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following have same number of significant figures?\nA. 0.00253, B. 1.0003, C. 15.0, D. 163\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) B and C only",
    optionB: "(2) A, B and C only",
    optionC: "(3) A, C and D only",
    optionD: "(4) C and D only",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: Methyl orange is a weak acid.\nStatement II: The benzenoid form of methyl orange is more intense/deeply coloured than the quinonoid form.\nIn the light of the above statement, choose the most appropriate answer:",
    imageUrl: null,
    optionA: "(1) Both statement I and Statement II are incorrect",
    optionB: "(2) Both statement I and Statement II are correct",
    optionC: "(3) Statement I is correct but statement II is incorrect",
    optionD: "(4) Statement I is incorrect but statement II is correct",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The descending order of acidity for the following carboxylic acid is:\nA. $\\text{CH}_3\\text{COOH}$, B. $\\text{F}_3\\text{C-COOH}$, C. $\\text{ClCH}_2\\text{-COOH}$, D. $\\text{FCH}_2\\text{-COOH}$, E. $\\text{Br-CH}_2\\text{COOH}$",
    imageUrl: null,
    optionA: "(1) D > B > A > E > C",
    optionB: "(2) B > D > C > E > A",
    optionC: "(3) E > D > B > A > C",
    optionD: "(4) B > C > D < E > A",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "In Hall-Heroult process, the following is used for reducing $\\text{Al}_2\\text{O}_3$ :",
    imageUrl: null,
    optionA: "(1) Magnesium",
    optionB: "(2) Graphite",
    optionC: "(3) $\\text{Na}_3\\text{AlF}_6$",
    optionD: "(4) $\\text{CaF}_2$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Arrange the following gases in increasing order of van der waals constant ‘a’:\nA. Ar, B. $\\text{CH}_4$, C. $\\text{H}_2\\text{O}$, D. $\\text{C}_6\\text{H}_6$",
    imageUrl: null,
    optionA: "(1) A, B, C and D",
    optionB: "(2) B, C, D and A",
    optionC: "(3) C, D, B and A",
    optionD: "(4) D, C, B and A",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement I: In redox titration, the indicators used are sensitive to change in pH of the solution.\nStatement II: In acid-base titration, the indicators used are sensitive to change in oxidation potential.\nIn the light of the above statement, choose the most appropriate answer",
    imageUrl: null,
    optionA: "(1) Both statement I and Statement II are incorrect",
    optionB: "(2) Statement I is incorrect but Statement II is correct",
    optionC: "(3) Statement I is correct but Statement II is incorrect",
    optionD: "(4) Both Statement I and Statement II are correct",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following can reduce decomposition of $\\text{H}_2\\text{O}_2$ on exposure to light",
    imageUrl: null,
    optionA: "(1) Dust",
    optionB: "(2) Urea",
    optionC: "(3) Glass containers",
    optionD: "(4) Alkali",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The correct order of reactivity of following haloarenes towards nucleophilic substitution with aqueous NaOH is D (2,4-dinitrochlorobenzene) > B (4-nitrochlorobenzene) > A (chlorobenzene) > C (4-methoxychlorobenzene):",
    imageUrl: null,
    optionA: "(1) D > B > A > C",
    optionB: "(2) A > B > D > C",
    optionC: "(3) C > A > D > B",
    optionD: "(4) D > C > B > A",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "A compound ‘X’ (phenol) when treated with phthalic anhydride in presence of concentrated $\\text{H}_2\\text{SO}_4$ yields ‘Y’ (phenolphthalein). ‘Y’ is used as an acid/base indicator. ‘X’ and ‘Y’ are respectively.",
    imageUrl: null,
    optionA: "(1) Anisole, methyl orange",
    optionB: "(2) Toluidine, Phenolphthalein",
    optionC: "(3) Carbolic acid, Phenolphthalein",
    optionD: "(4) Salicylaldehyde, Phenolphthalein",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Product (P) formed in reaction 4-methyl-2-nitroaniline $\\xrightarrow{\\text{(i) Br}_2, \\text{(ii) H}_2/\\text{Pd}, \\text{(iii) NaNO}_2/\\text{HCl}, \\text{(iv) H}_3\\text{PO}_2}$ is:",
    imageUrl: null,
    optionA: "(1) 3-bromo-4-methylphenol",
    optionB: "(2) 2-bromotoluene",
    optionC: "(3) 3-bromotoluene",
    optionD: "(4) 2-bromo-4-methylaniline",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The number of given statement/s which is/are correct is______\\n1) The stronger the temperature dependence of the rate constant, the higher is the activation energy.\\n2) If a reaction has zero activation energy, its rate is independent of temperature.\\n3) The stronger the temperature dependence of the rate constant, the smaller is the activation energy\\n4) If there is no correlation between the temperature and the rate constant then it means that the reaction has negative activation energy.",
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
    questionText: "The number of following factors which affect the percent covalent character of the ionic bond is_____\\n1) Polarising power of cation\\n2) Extent of distortion of anion\\n3) Polarisability of the anion\\n4) Polarising power of anion",
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
    questionText: "The boiling point of the solvent from vapour pressure curve is ______$^\\circ\\text{C}$",
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
    questionText: "Titration curve of weak acid vs strong base with phenolphthalein ($K_{ph} = 4 \\times 10^{-10}$). Correct statement count is__________.",
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
    questionText: "The number of following statements which is/are incorrect is_________\\n1) Line emission spectra are used to study electronic structure.\\n2) Emission spectra of gas phase atoms show continuous spread.",
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
    questionText: "For a nucleus having mass number A and atomic number Z\\nA. The surface energy per nucleon $(b_s) = -a_1 A^{2/3}$.\\nB. The Coulomb contribution to the binding energy $b_c = -a_2 \\frac{Z(Z-1)}{A^{4/3}}$\\nC. The volume energy $b_v = a_3 A$\\nD. Decrease in the binding energy is proportional to surface area.\\nE. While estimating the surface energy, it is assumed that each nucleon interacts with 12 nucleons.\\nChoose the most appropriate answer:",
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
    questionText: "Given below are two statements:\\nStatement I: If E be the total energy of a satellite moving around the earth, then its potential energy will be $E/2$\\nStatement II: The kinetic energy of a satellite revolving in an orbit is equal to the half the magnitude of total energy E.",
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

async function seedJee2023Apr08Shift2() {
  console.log(`🚀 Compiling JEE Main 2023 (08 Apr Shift 2) Paper with ${rawQuestions.length} questions...`);

  const paperData = {
    examName: "JEE Main",
    year: 2023,
    shiftName: "JEE Main 2023 (08 Apr Shift 2)",
    examDate: "2023-04-08T15:00:00Z",
    totalMarks: 300,
    totalQuestions: 90,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'JEE Main 2023 (08 Apr Shift 2).json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved paper JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding JEE Main 2023 (08 Apr Shift 2) into PostgreSQL via Prisma...`);
  
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
      name: "JEE Main 2023 (08 Apr Shift 2)"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "JEE Main 2023 (08 Apr Shift 2)",
      date: new Date("2023-04-08T15:00:00Z")
    }
  });
  console.log(`Created Shift "JEE Main 2023 (08 Apr Shift 2)" (ID: ${shift.id})`);

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

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for JEE Main 2023 (08 Apr Shift 2) into Database!`);
}

seedJee2023Apr08Shift2()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
