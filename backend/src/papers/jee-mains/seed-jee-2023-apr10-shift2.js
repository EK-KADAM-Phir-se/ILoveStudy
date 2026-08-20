const prisma = require('../../lib/prisma');
const fs = require('fs');
const path = require('path');

const rawQuestions = [
  // ── MATHEMATICS (Q1 - Q30) ──
  {
    subject: "Mathematics",
    questionText: "Let f be a continuous function satisfying $\\int_0^{t^2} (f(x) + x^2) dx = \\frac{4}{3} t^3, \\forall t > 0$. Then $f(\\frac{\\pi^2}{4})$ is equal to",
    imageUrl: null,
    optionA: "(1) $\\pi (1 - \\frac{\\pi^3}{16})$",
    optionB: "(2) $-\\pi^2 (1 + \\frac{\\pi^2}{16})$",
    optionC: "(3) $-\\pi (1 + \\frac{\\pi^3}{16})$",
    optionD: "(4) $\\pi^2 (1 - \\frac{\\pi^2}{16})$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Eight persons are to be transported from city A to city B in three cars of different makes. If each car can accommodate at most three persons, then the number of ways, in which they can be transported, is:",
    imageUrl: null,
    optionA: "(1) 3360",
    optionB: "(2) 1680",
    optionC: "(3) 560",
    optionD: "(4) 1120",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "For, $\\alpha, \\beta, \\gamma, \\delta \\in \\mathbb{N}$, if $\\int \\left((\\frac{x}{e})^{2x} + (\\frac{e}{x})^{2x}\\right) \\log_e x dx = \\frac{1}{\\alpha} (\\frac{x}{e})^{\\beta x} - \\frac{1}{\\gamma} (\\frac{e}{x})^{\\delta x} + C$ where $e = \\sum_{n=0}^\\infty \\frac{1}{n!}$ and C is constant of integration, then $\\alpha + 2\\beta + 3\\gamma - 4\\delta$ is equal to:",
    imageUrl: null,
    optionA: "(1) 1",
    optionB: "(2) -4",
    optionC: "(3) -8",
    optionD: "(4) 4",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let the image of the point P(1, 2, 6) in the plane passing through the points A(1, 2, 0), B(1, 4, 1) and C(0, 5, 1) be Q ($\\alpha, \\beta, \\gamma$). Then ($\\alpha^2 + \\beta^2 + \\gamma^2$) is equal to :",
    imageUrl: null,
    optionA: "(1) 65",
    optionB: "(2) 70",
    optionC: "(3) 76",
    optionD: "(4) 62",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $A = \\{2, 3, 4\\}$ and $B = \\{8, 9, 12\\}$. Then the number of elements in the relation $R = \\{((a_1, b_1), (a_2, b_2)) \\in (A \\times B, A \\times B) : a_1 \\text{ divides } b_2 \\text{ and } a_2 \\text{ divides } b_1\\}$ is :",
    imageUrl: null,
    optionA: "(1) 36",
    optionB: "(2) 12",
    optionC: "(3) 18",
    optionD: "(4) 24",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If $A = \\frac{1}{5!6!7!} \\begin{bmatrix} 5! & 6! & 7! \\\\ 6! & 7! & 8! \\\\ 7! & 8! & 9! \\end{bmatrix}$, then $|\\text{adj}(\\text{adj}(2A))|$ is equal to :",
    imageUrl: null,
    optionA: "(1) $2^8$",
    optionB: "(2) $2^{12}$",
    optionC: "(3) $2^{20}$",
    optionD: "(4) $2^{16}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let A be the point (1, 2) and B be any point on the curve $x^2 + y^2 = 16$. If the centre of the locus of the point P, which divides the line segment AB in the ratio $3 : 2$ is the point C ($\\alpha, \\beta$), then the length of the line segment AC is",
    imageUrl: null,
    optionA: "(1) $\\frac{6\\sqrt{5}}{5}$",
    optionB: "(2) $\\frac{4\\sqrt{5}}{5}$",
    optionC: "(3) $\\frac{2\\sqrt{5}}{5}$",
    optionD: "(4) $\\frac{3\\sqrt{5}}{5}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let a die be rolled n times. Let the probability of getting odd numbers seven times be equal to the probability of getting odd numbers nine times. If the probability of getting even numbers twice is $\\frac{k}{2^{15}}$, then k is equal to :",
    imageUrl: null,
    optionA: "(1) 30",
    optionB: "(2) 90",
    optionC: "(3) 15",
    optionD: "(4) 60",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $g(x) = f(x) + f(1 - x)$ and $f''(x) > 0, x \\in (0, 1)$. If g is decreasing in the interval $(0, \\alpha)$ and increasing in the interval $(\\alpha, 1)$, then $\\tan^{-1}(2\\alpha) + \\tan^{-1}(\\frac{1}{\\alpha}) + \\tan^{-1}(\\frac{\\alpha+1}{\\alpha})$ is equal to :",
    imageUrl: null,
    optionA: "(1) $\\frac{3\\pi}{2}$",
    optionB: "(2) $\\pi$",
    optionC: "(3) $\\frac{5\\pi}{4}$",
    optionD: "(4) $\\frac{3\\pi}{4}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let a circle of radius 4 be concentric to the ellipse $15x^2 + 19y^2 = 285$. Then the common tangents are inclined to the minor axis of the ellipse at the angle.",
    imageUrl: null,
    optionA: "(1) $\\pi/4$",
    optionB: "(2) $\\pi/3$",
    optionC: "(3) $\\pi/12$",
    optionD: "(4) $\\pi/6$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $\\vec{a} = 2\\hat{i} + 7\\hat{j} - \\hat{k}, \\vec{b} = 3\\hat{i} + 5\\hat{k}$ and $\\vec{c} = \\hat{i} - \\hat{j} + 2\\hat{k}$. Let $\\vec{d}$ be a vector which is perpendicular to both $\\vec{a}$ and $\\vec{b}$ and $\\vec{c} \\cdot \\vec{d} = 12$. Then $(-\\hat{i} + \\hat{j} - \\hat{k}) \\cdot (\\vec{c} \\times \\vec{d})$ is equal to",
    imageUrl: null,
    optionA: "(1) 48",
    optionB: "(2) 42",
    optionC: "(3) 44",
    optionD: "(4) 24",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If $S_n = 4 + 11 + 21 + 34 + 50 + \\dots$ to n terms, then $\\frac{1}{60}(S_{29} - S_9)$ is equal to",
    imageUrl: null,
    optionA: "(1) 226",
    optionB: "(2) 220",
    optionC: "(3) 223",
    optionD: "(4) 227",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If the points P and Q are respectively the circumcentre and the orthocentre of a $\\Delta ABC$, then $\\vec{PA} + \\vec{PB} + \\vec{PC}$ is equal to",
    imageUrl: null,
    optionA: "(1) $2\\vec{QP}$",
    optionB: "(2) $\\vec{QP}$",
    optionC: "(3) $2\\vec{PQ}$",
    optionD: "(4) $\\vec{PQ}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The statement $\\sim[p \\vee (\\sim(p \\wedge q))]$ is equivalent to",
    imageUrl: null,
    optionA: "(1) $(\\sim(p \\wedge q)) \\wedge q$",
    optionB: "(2) $\\sim(p \\wedge q)$",
    optionC: "(3) $\\sim(p \\vee q)$",
    optionD: "(4) $(p \\wedge q) \\wedge (\\sim p)$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $S = \\{x \\in (-\\frac{\\pi}{2}, \\frac{\\pi}{2}) : 9^{1-\\tan^2 x} + 9^{\\tan^2 x} = 10\\}$ and $\\beta = \\sum_{x \\in S} \\tan^2(\\frac{x}{3})$, then $\\frac{1}{6}(\\beta - 14^2)$ is equal to",
    imageUrl: null,
    optionA: "(1) 32",
    optionB: "(2) 8",
    optionC: "(3) 64",
    optionD: "(4) 16",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If the coefficients of x and $x^2$ in $(1 + x)^p (1 - x)^q$ are 4 and –5 respectively, then $2p + 3q$ is equal to",
    imageUrl: null,
    optionA: "(1) 63",
    optionB: "(2) 69",
    optionC: "(3) 66",
    optionD: "(4) 60",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let the line $\\frac{x}{1} = \\frac{6-y}{2} = \\frac{z+8}{5}$ intersect the lines $\\frac{x-5}{4} = \\frac{y-7}{3} = \\frac{z+2}{1}$ and $\\frac{x+3}{6} = \\frac{3-y}{3} = \\frac{z-6}{1}$ at the points A and B respectively. Then the distance of the mid-point of the line segment AB from the plane $2x - 2y + z = 14$ is",
    imageUrl: null,
    optionA: "(1) 4",
    optionB: "(2) 10/3",
    optionC: "(3) 3",
    optionD: "(4) 11/3",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $S = \\{z = x + iy : \\frac{2z-3i}{4z+2i} \\text{ is a real number}\\}$. Then which of the following is NOT correct?",
    imageUrl: null,
    optionA: "(1) $y + x^2 + y^2 \\neq -1/4$",
    optionB: "(2) $x = 0$",
    optionC: "(3) $(x, y) = (0, -1/2)$",
    optionD: "(4) $y \\in (-\\infty, -1/2) \\cup (-1/2, \\infty)$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let the number $(22)^{2022} + (2022)^{22}$ leave the remainder $\\alpha$ when divided by 3 and $\\beta$ when divided by 7. Then $(\\alpha^2 + \\beta^2)$ is equal to",
    imageUrl: null,
    optionA: "(1) 10",
    optionB: "(2) 5",
    optionC: "(3) 20",
    optionD: "(4) 13",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $\\mu$ be the mean and $\\sigma$ be the standard deviation of the distribution (x: 0, 1, 2, 3, 4, 5 with freq k+2, 2k, k^2-1, k^2-1, k^2+1, k-3) where $\\sum f_i = 62$. If [x] denotes greatest integer $\\le x$, then $[\\mu^2 + \\sigma^2]$ is equal to",
    imageUrl: null,
    optionA: "(1) 8",
    optionB: "(2) 7",
    optionC: "(3) 6",
    optionD: "(4) 9",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let the equations of two adjacent sides of a parallelogram ABCD be $2x - 3y = -23$ and $5x + 4y = 23$. If the equation of its one diagonal AC is $3x + 7y = 23$ and the distance of A from the other diagonal is d, then $50 d^2$ is equal to _______ .",
    imageUrl: null,
    optionA: "529",
    optionB: "529",
    optionC: "529",
    optionD: "529",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Let S be the set of values of $\\lambda$, for which the system of equations $6\\lambda x - 3y + 3z = 4\\lambda^2, 2x + 6\\lambda y + 4z = 1, 3x + 2y + 3\\lambda z = \\lambda$ has no solution. Then $12 \\sum_{\\lambda \\in S} |\\lambda|$ is equal to ________ .",
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
    questionText: "Let the foot of perpendicular from the point A(4, 3, 1) on the plane $P : x - y + 2z + 3 = 0$ be N. If $B(5, \\alpha, \\beta), \\alpha, \\beta \\in \\mathbb{Z}$ is a point on plane P such that the area of the triangle ABN in $3\\sqrt{2}$, then $\\alpha^2 + \\beta^2 + \\alpha\\beta$ is equal to ________ .",
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
    questionText: "Let quadratic curve passing through the point (–1, 0) and touching the line $y = x$ at (1, 1) be $y = f(x)$. Then the x-intercept of the normal to the curve at the point $(\\alpha, \\alpha + 1)$ in the first quadrant is _______ .",
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
    questionText: "Let the tangent at any point P on a curve passing through the points (1, 1) and $(1/10, 100)$, intersect positive x-axis and y-axis at the points A and B respectively. If $PA : PB = 1 : k$ and $y = y(x)$ is the solution of the differential equation $e^{\\frac{dy}{dx}} = kx + \\frac{k}{2}, y(0) = k$, then $4y(1) - 5\\log_e 3$ is equal to ______ .",
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
    questionText: "Suppose $a_1, a_2, 2, a_3, a_4$ be in an arithmetico geometric progression. If the common ratio of the corresponding geometric progression is 2 and the sum of all 5 terms of the arithmetico-geometric progression is 49/2, then $a_4$ is equal to ________ .",
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
    questionText: "If the domain of the function $f(x) = \\sec^{-1}(\\frac{2x}{5x+3})$ is $[\\alpha, \\beta) \\cup (\\gamma, \\delta]$, then $|3\\alpha + 10(\\beta + \\gamma) + 21\\delta|$ is equal to ________ .",
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
    questionText: "The sum of all the four-digit numbers that can be formed using all the digits 2, 1, 2, 3 is equal to _______ .",
    imageUrl: null,
    optionA: "26664",
    optionB: "26664",
    optionC: "26664",
    optionD: "26664",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "In the figure, $\\theta_1 + \\theta_2 = \\pi/2$ and $\\sqrt{3}(BE) = 4(AB)$. If the area of $\\Delta CAB$ is $2\\sqrt{3} - 3\\text{ unit}^2$, when $\\theta_2/\\theta_1$ is the largest, then the perimeter (in unit) of $\\Delta CED$ is equal to ___________.",
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
    questionText: "If the area of the region $\{(x, y) : |x^2 - 2| \\le y \\le x\}$ is A, then $6A + 16\\sqrt{2}$ is equal to _________ .",
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
    questionText: "Incorrect method of preparation for alcohols from the following is:",
    imageUrl: null,
    optionA: "(1) Ozonolysis of alkene.",
    optionB: "(2) Reaction of Ketone with RMgBr followed by hydrolysis.",
    optionC: "(3) Hydroboration–oxidation of alkene.",
    optionD: "(4) Reaction of alkyl halide with aqueous NaOH.",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Assertion A: The energy required to form $\\text{Mg}^{2+}$ from Mg is much higher than that required to produce $\\text{Mg}^+$.\nReason R: $\\text{Mg}^{2+}$ is small ion and carry more charge than $\\text{Mg}^+$.\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both A and R are true but R is NOT the correct explanation of A.",
    optionB: "(2) A is true but R is false.",
    optionC: "(3) A is false but R is true.",
    optionD: "(4) Both A and R are true and R is the correct explanation of A.",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "In Carius tube, an organic compound ‘X’ is treated with sodium peroxide to form a mineral acid ‘Y’. The solution of $\\text{BaCl}_2$ is added to ‘Y’ to form a precipitate ‘Z’. ‘Z’ is used for the quantitative estimation of an extra element. ‘X’ could be:",
    imageUrl: null,
    optionA: "(1) Cytosine",
    optionB: "(2) Chloroxylenol",
    optionC: "(3) A nucleotide",
    optionD: "(4) Methionine",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Assertion A: 3.1500g of hydrated oxalic acid dissolved in water to make 250.0 mL solution will result in 0.1 M oxalic acid solution.\nReason R: Molar mass of hydrated oxalic acid is $126\\text{ g mol}^{-1}$.\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) Both A and R are true but R is NOT the correct explanation of A.",
    optionB: "(2) A is false but R is true.",
    optionC: "(3) A is true but R is false.",
    optionD: "(4) Both A and R are true and R is the correct explanation of A.",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Buna–S can be represented as:",
    imageUrl: null,
    optionA: "(1) $[-\\text{CH}_2-\\text{CH}=\\text{CH}-\\text{CH}_2-\\text{CH}(\\text{C}_6\\text{H}_5)-\\text{CH}_2-]_n$",
    optionB: "(2) $[-\\text{CH}_2-\\text{CH}=\\text{CH}-\\text{CH}_2-\\text{CH}_2-\\text{CH}(\\text{C}_6\\text{H}_5)-]_n$",
    optionC: "(3) $[-\\text{CH}_2-\\text{CH}=\\text{C}(\\text{C}_6\\text{H}_5)-\\text{CH}=\\text{CH}-\\text{CH}_2-]_n$",
    optionD: "(4) $[-\\text{CH}_2-\\text{CH}=\\text{CH}-\\text{CH}=\\text{C}(\\text{C}_6\\text{H}_5)-\\text{CH}_2-]_n$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "In the reaction: 2,6-dimethyl-4-(methylene)heptan-3-one $\\xrightarrow{\\text{(i) LiAlH}_4, \\text{(ii) H}_3\\text{O}^+} X$. The product ‘X’ is:",
    imageUrl: null,
    optionA: "(1) 2,6-dimethyl-4-(methylene)heptan-3-ol",
    optionB: "(2) 2,4,6-trimethylheptan-3-ol",
    optionC: "(3) 2,6-dimethylheptan-3-ol",
    optionD: "(4) 2,6-dimethyl-4-methylenetheptanol",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Ferric chloride is applied to stop bleeding because:",
    imageUrl: null,
    optionA: "(1) $\\text{Cl}^-$ ions cause coagulation of blood.",
    optionB: "(2) Blood absorbs $\\text{FeCl}_3$ and forms a complex.",
    optionC: "(3) $\\text{Fe}^{3+}$ ions coagulate blood which is a negatively charged sol.",
    optionD: "(4) $\\text{FeCl}_3$ reacts with the constituents of blood which is a positively charged sol.",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The reaction used for preparation of soap from fat is:",
    imageUrl: null,
    optionA: "(1) reduction reaction",
    optionB: "(2) alkaline hydrolysis reaction",
    optionC: "(3) an addition reaction",
    optionD: "(4) an oxidation reaction",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The decreasing order of hydride affinity for following carbocations is:\\nA. $\\text{CH}_2=\\text{CH}-\\text{C}^+(\\text{CH}_3)_2$, B. $(\\text{C}_6\\text{H}_5)_3\\text{C}^+$, C. $(\\text{CH}_3)_3\\text{C}^+$, D. Cyclopropyl methyl carbocation",
    imageUrl: null,
    optionA: "(1) A, C, B, D",
    optionB: "(2) C, A, B, D",
    optionC: "(3) C, A, D, B",
    optionD: "(4) A, C, D, B",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The correct relationship between unit cell edge length ‘a’ and radius of sphere ‘r’ for face–centred and body centred cubic structures respectively are:",
    imageUrl: null,
    optionA: "(1) $r = 2\\sqrt{2}a$ and $\\sqrt{3}r = 4a$",
    optionB: "(2) $r = 2\\sqrt{2}a$ and $4r = \\sqrt{3}a$",
    optionC: "(3) $2\\sqrt{2}r = a$ and $4r = \\sqrt{3}a$",
    optionD: "(4) $2\\sqrt{2}r = a$ and $\\sqrt{3}r = 4a$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Number of water molecules in washing soda and soda ash respectively are:",
    imageUrl: null,
    optionA: "(1) 10 and 1",
    optionB: "(2) 1 and 10",
    optionC: "(3) 1 and 0",
    optionD: "(4) 10 and 0",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The delicate balance of $\\text{CO}_2$ and $\\text{O}_2$ is NOT disturbed by:",
    imageUrl: null,
    optionA: "(1) Burning of Coal",
    optionB: "(2) Deforestation",
    optionC: "(3) Burning of petroleum",
    optionD: "(4) Respiration",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The correct order of the number of unpaired electrons in the given complexes is\\nA. $[Fe(CN)_6]^{3-}$, B. $[FeF_6]^{3-}$, C. $[CoF_6]^{3-}$, D. $[Cr(oxalate)_3]^{3-}$, E. $[Ni(CO)_4]$",
    imageUrl: null,
    optionA: "(1) A < E < D < C < B",
    optionB: "(2) E < A < D < C < B",
    optionC: "(3) E < A < B < D < C",
    optionD: "(4) A < E < C < B < D",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The correct order for acidity of the following hydroxyl compound is:\nA. $\\text{CH}_3\\text{OH}$, B. $(\\text{CH}_3)_3\\text{COH}$, C. Phenol, D. p-Methoxyphenol, E. p-Nitrophenol",
    imageUrl: null,
    optionA: "(1) E > C > D > A > B",
    optionB: "(2) D > E > C > A > B",
    optionC: "(3) C > E > D > B > A",
    optionD: "(4) E > D > C > B > A",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The major product ‘P’ formed in Friedel-Crafts acylation/alkylation of 3-methoxynitrobenzene with 1-chloro-3-methylbutane is:",
    imageUrl: null,
    optionA: "(1) 4-Isoamyl-3-methoxynitrobenzene",
    optionB: "(2) 2-Isoamyl-3-methoxynitrobenzene",
    optionC: "(3) 5-Isoamyl-3-methoxynitrobenzene",
    optionD: "(4) 6-Isoamyl-3-methoxynitrobenzene",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List I with List II\nList-I (Complex): A. $[Ti(H_2O)_6]^{2+}$, B. $[V(H_2O)_6]^{2+}$, C. $[Mn(H_2O)_6]^{3+}$, D. $[Fe(H_2O)_6]^{3+}$\nList-II (Crystal Field splitting energy $\\Delta_0$): I. -1.2, II. -0.6, III. 0, IV. -0.8",
    imageUrl: null,
    optionA: "(1) A-II, B-IV, C-I, D-III",
    optionB: "(2) A-IV, B-I, C-II, D-III",
    optionC: "(3) A-IV, B-I, C-III, D-II",
    optionD: "(4) A-II, B-IV, C-III, D-I",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Statement A: Physical properties of isotopes of hydrogen are different.\nReason: Mass difference between isotopes of hydrogen is very large.\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) A is false but R is true.",
    optionB: "(2) Both A and R are true and R is the NOT the correct explanation of A.",
    optionC: "(3) A is true but R is false.",
    optionD: "(4) Both A and R are true and R is the correct explanation of A.",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List I with List II\nList-I: A. 16g of $\\text{CH}_4(g)$, B. 1g of $\\text{H}_2(g)$, C. 1 mole of $\\text{N}_2(g)$, D. 0.5 mol of $\\text{SO}_2(g)$\nList-II: I. Weighs 28 g, II. $60.2\\times 10^{23}$ electrons, III. Weighs 32g, IV. Occupies 11.4 L volume at STP",
    imageUrl: null,
    optionA: "(1) A–I, B–III, C–II, D–IV",
    optionB: "(2) A–II, B–III, C–IV, D–I",
    optionC: "(3) A–II, B–IV, C–III, D–I",
    optionD: "(4) A–II, B–IV, C–I, D–III",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The correct order of metallic character is:",
    imageUrl: null,
    optionA: "(1) Be > Ca > K",
    optionB: "(2) Ca > K > Be",
    optionC: "(3) K > Ca > Be",
    optionD: "(4) K > Be > Ca",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Gibbs energy vs T plot (Ellingham diagram) for the formation of oxides: For the given diagram, the correct statement is:",
    imageUrl: null,
    optionA: "(1) At $600^\\circ\\text{C}$, C can reduce ZnO",
    optionB: "(2) At $600^\\circ\\text{C}$, C can reduce FeO",
    optionC: "(3) At $600^\\circ\\text{C}$, CO cannot reduce FeO",
    optionD: "(4) At $600^\\circ\\text{C}$, CO can reduce ZnO",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "$A(g) \\rightleftharpoons 2B(g) + C(g)$. Initial pressure 450 mm Hg, total pressure at time t is 720 mm Hg. Fraction of A(g) decomposed is $x \\times 10^{-1}$. Value of x is ______.",
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
    questionText: "In alkaline medium, the reduction of permanganate anion involves a gain of ____________ electrons.",
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
    questionText: "The number of endothermic process/es from the following is _________\\nA. $\\text{I}_{2(g)} \\to 2\\text{I}_{(g)}$, B. $\\text{HCl}_{(g)} \\to \\text{H}_{(g)} + \\text{Cl}_{(g)}$, C. $\\text{H}_2\\text{O}_{(l)} \\to \\text{H}_2\\text{O}_{(g)}$, D. $\\text{C}_{(s)} + \\text{O}_{2(g)} \\to \\text{CO}_{2(g)}$, E. Dissolution of ammonium chloride in water",
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
    questionText: "The number of molecules from the following which contain only two lone pair of electrons is _________\\n$\\text{H}_2\\text{O}, \\text{N}_2, \\text{CO}, \\text{XeF}_4, \\text{NH}_3, \\text{NO}, \\text{CO}_2, \\text{F}_2$",
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
    questionText: "The difference in oxidation state of Xe between oxidised product of Xe formed on complete hydrolysis of $\\text{XeF}_4$ and $\\text{XeF}_4$ is ________",
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
    questionText: "300 $\\text{cm}^3$ aqueous solution contains 0.63 g protein. Osmotic pressure at 300 K is 1.29 mbar. Molar mass of protein is ___________ $\\text{g mol}^{-1}$ (Nearest integer).",
    imageUrl: null,
    optionA: "40535",
    optionB: "40535",
    optionC: "40535",
    optionD: "40535",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "For a metal ion, calculated magnetic moment is 4.90 BM. Number of unpaired electrons is __________.",
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
    questionText: "Electron in nth orbit of $\\text{Li}^{2+}$ is excited to $(n+1)$ orbit using radiation of energy $1.47 \\times 10^{-17}\\text{ J}$. Value of n is _______ . ($R_H = 2.18 \\times 10^{-18}\\text{ J}$)",
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
    questionText: "Specific conductance of 0.0025 M acetic acid is $5 \\times 10^{-5}\\text{ S cm}^{-1}$. Dissociation constant is _______ $\\times 10^{-7}$. (Limiting molar conductivity $= 400\\text{ S cm}^2\\text{mol}^{-1}$)",
    imageUrl: null,
    optionA: "66",
    optionB: "66",
    optionC: "66",
    optionD: "66",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Number of incorrect statements regarding reaction kinetics is _______\\nA. Half life of zero order decreases with time.\\nB. Reactant may not affect rate.\\nC. Order/molecularity can be fractional.\\nD. Units of rate constant.",
    imageUrl: null,
    optionA: "1",
    optionB: "1",
    optionC: "1",
    optionD: "1",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── PHYSICS (Q61 - Q90) ──
  {
    subject: "Physics",
    questionText: "A person travels x distance with velocity $v_1$ and then x distance with velocity $v_2$ in the same direction. The average velocity of the person is v, then the relation between v, $v_1$ and $v_2$ will be :",
    imageUrl: null,
    optionA: "(1) $v = v_1 + v_2$",
    optionB: "(2) $v = \\frac{v_1+v_2}{2}$",
    optionC: "(3) $\\frac{2}{v} = \\frac{1}{v_1} + \\frac{1}{v_2}$",
    optionD: "(4) $\\frac{1}{v} = \\frac{1}{v_1} + \\frac{1}{v_2}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The half-life of a radioactive substance is T. The time taken, for disintegrating 7/8 th part of its original mass will be :",
    imageUrl: null,
    optionA: "(1) 3T",
    optionB: "(2) 8T",
    optionC: "(3) T",
    optionD: "(4) 2T",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A gas mixture consists of 2 moles of oxygen and 4 moles of neon at temperature T. Neglecting all vibrational modes, the total internal energy of the system will be :",
    imageUrl: null,
    optionA: "(1) 8 RT",
    optionB: "(2) 16 RT",
    optionC: "(3) 4 RT",
    optionD: "(4) 11 RT",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In an experiment with Vernier callipers of least count 0.1 mm, when two jaws are joined together the zero of Vernier scale lies right to the zero of the main scale and 6th division of Vernier scale coincides with the main scale division. While measuring the diameter of a spherical bob, the zero of vernier scale lies in between 3.2 cm and 3.3 cm marks, and 4th division of vernier scale coincides with the main scale division. The diameter of bob is measured as :",
    imageUrl: null,
    optionA: "(1) 3.18 cm",
    optionB: "(2) 3.25 cm",
    optionC: "(3) 3.26 cm",
    optionD: "(4) 3.22 cm",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Given below are two statements:\\nStatement I: For diamagnetic substance $-1 \\le \\chi < 0$, where $\\chi$ is the magnetic susceptibility.\\nStatement II: Diamagnetic substances when placed in an external magnetic field, tend to move from stronger to weaker part of the field.\\nIn the light of the above statements, choose the correct answer from the options given below.",
    imageUrl: null,
    optionA: "(1) Both Statement I and Statement II are false.",
    optionB: "(2) Both Statement I and Statement II are true.",
    optionC: "(3) Statement I is incorrect but Statement II is true.",
    optionD: "(4) Statement I is correct but Statement II is false.",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The distance between two plates of a capacitor is d and its capacitance is $C_1$, when air is the medium between the plates. If a metal sheet of thickness $2d/3$ and of same area as plate is introduced between the plates, the capacitance of the capacitor becomes $C_2$. The ratio $C_2/C_1$ is:",
    imageUrl: null,
    optionA: "(1) 2 : 1",
    optionB: "(2) 4 : 1",
    optionC: "(3) 3 : 1",
    optionD: "(4) 1 : 1",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Given below are two statements:\\nStatement I: Rotation of the earth shows effect on the value of acceleration due to gravity (g).\\nStatement II: The effect of rotation of the earth on the value of ‘g’ at the equator is minimum and that at the pole is maximum.\\nIn the light of the above statements, choose the correct answer from the options given below.",
    imageUrl: null,
    optionA: "(1) Statement I is false but Statement II is true.",
    optionB: "(2) Statement I is true but Statement II are false.",
    optionC: "(3) Both Statement I and Statement II are true.",
    optionD: "(4) Both Statement I and Statement II are false.",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The time period of a satellite, revolving above earth’s surface at a height equal to R will be (Given $g = \\pi^2\\text{ m/s}^2$, R = radius of earth)",
    imageUrl: null,
    optionA: "(1) $\\sqrt{4R}$",
    optionB: "(2) $\\sqrt{8R}$",
    optionC: "(3) $\\sqrt{32R}$",
    optionD: "(4) $\\sqrt{2R}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Assertion A: An electric fan continues to rotate for some time after the current is switched off.\\nReason R: Fan continuous to rotate due to inertia of motion.\\nChoose correct option:",
    imageUrl: null,
    optionA: "(1) A is correct but R is not correct.",
    optionB: "(2) Both A and R are correct and R is the correct explanation of A.",
    optionC: "(3) A is not correct but R is correct.",
    optionD: "(4) Both A and R are correct but R is NOT the correct explanation of A.",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The amplitude of magnetic field in an electromagnetic wave propagating along y-axis is $6.0 \\times 10^{-7}\\text{ T}$. The maximum value of electric field in the electromagnetic wave is:",
    imageUrl: null,
    optionA: "(1) $5 \\times 10^{14}\\text{ Vm}^{-1}$",
    optionB: "(2) $180\\text{ Vm}^{-1}$",
    optionC: "(3) $2 \\times 10^{15}\\text{ Vm}^{-1}$",
    optionD: "(4) $6.0 \\times 10^{-7}\\text{ Vm}^{-1}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A gas is compressed adiabatically, which one of the following statement is NOT true.",
    imageUrl: null,
    optionA: "(1) There is no heat supplied to the system",
    optionB: "(2) The temperature of the gas increases",
    optionC: "(3) The change in the internal energy is equal to the work done on the gas.",
    optionD: "(4) There is no change in the internal energy",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The ratio of intensities at two points P and Q on the screen in a Young’s double slit experiment where phase difference between two wave of same amplitude are $\\pi/3$ and $\\pi/2$, respectively are",
    imageUrl: null,
    optionA: "(1) 1 : 3",
    optionB: "(2) 3 : 1",
    optionC: "(3) 3 : 2",
    optionD: "(4) 2 : 3",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The variation of stopping potential ($V_0$) as a function of frequency (v) for a metal shows zero threshold at $v = 5 \\times 10^{14}\\text{ Hz}$ and $V_0 = 3V$ at $v = 10 \\times 10^{14}\\text{ Hz}$. Work function is",
    imageUrl: null,
    optionA: "(1) 18.6 eV",
    optionB: "(2) 2.98 eV",
    optionC: "(3) 2.07 eV",
    optionD: "(4) 1.36 eV",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "For a periodic motion represented by the equation $Y = \\sin \\omega t + \\cos \\omega t$. The amplitude of the motion is",
    imageUrl: null,
    optionA: "(1) 0.5",
    optionB: "(2) $\\sqrt{2}$",
    optionC: "(3) 1",
    optionD: "(4) 2",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In a metallic conductor, under the effect of applied electric field, the free electrons of the conductor",
    imageUrl: null,
    optionA: "(1) drift from higher potential to lower potential.",
    optionB: "(2) move in the curved paths from lower potential to higher potential",
    optionC: "(3) move with the uniform velocity throughout from lower potential to higher potential",
    optionD: "(4) move in the straight line paths in the same direction",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Young’s moduli of the material of wires A and B are in the ratio of 1 : 4, while its area of cross sections are in the ratio of 1 : 3. If the same amount of load is applied to both the wires, the amount of elongation produced in the wires A and B will be in the ratio of [Assume length of wires A and B are same]",
    imageUrl: null,
    optionA: "(1) 36 : 1",
    optionB: "(2) 12 : 1",
    optionC: "(3) 1 : 36",
    optionD: "(4) 1 : 12",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Two projectiles are projected at $30^\\circ$ and $60^\\circ$ with the horizontal with the same speed. The ratio of the maximum height attained by the two projectiles respectively is:",
    imageUrl: null,
    optionA: "(1) $2 : \\sqrt{3}$",
    optionB: "(2) $\\sqrt{3} : 1$",
    optionC: "(3) 1 : 3",
    optionD: "(4) $1 : \\sqrt{3}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A message signal of frequency 3kHz is used to modulate a carrier signal of frequency 1.5 MHz. The bandwidth of the amplitude modulated wave is",
    imageUrl: null,
    optionA: "(1) 3 kHz",
    optionB: "(2) 6 MHz",
    optionC: "(3) 3 MHz",
    optionD: "(4) 6 kHz",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "In diode ladder circuit with forward resistance $25\\Omega$ and load $25\\Omega, 125\\Omega$, the correct current relation is:",
    imageUrl: null,
    optionA: "(1) $I_3 / I_4 = 1$",
    optionB: "(2) $I_2 / I_3 = 1$",
    optionC: "(3) $I_1 / I_2 = 1$",
    optionD: "(4) $I_1 / I_2 = 2$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A bar magnet is released from rest along the axis of a very long vertical copper tube. After some time the magnet will",
    imageUrl: null,
    optionA: "(1) Move down with almost constant speed",
    optionB: "(2) Oscillate inside the tube",
    optionC: "(3) Move down with an acceleration greater than g",
    optionD: "(4) Move down with an acceleration equal to g",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A square loop of side 2.0 cm is placed inside a long solenoid that has 50 turns per centimetre and carries a sinusoidally varying current of amplitude 2.5 A and angular frequency $700\\text{ rad s}^{-1}$. The amplitude of the emf induced in the loop is $x \\times 10^{-4}\\text{ V}$. Value of x is__________ (Take $\\pi = 22/7$)",
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
    questionText: "A rectangular block of mass 5 kg attached to a horizontal spiral spring executes simple harmonic motion of amplitude 1 m and time period 3.14 s. The maximum force exerted by spring on block is ______ N.",
    imageUrl: null,
    optionA: "20",
    optionB: "20",
    optionC: "20",
    optionD: "20",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "If 917 Å be the lowest wavelength of Lyman series then the lowest wavelength of Balmer series will be ________ Å.",
    imageUrl: null,
    optionA: "3668",
    optionB: "3668",
    optionC: "3668",
    optionD: "3668",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "Liquid pushed out of tube by piston of area $2.0\\text{ cm}^2$ at speed 4 cm/s through outlet of area $10\\text{ mm}^2$. Speed of outgoing fluid is _______ $\\text{cm s}^{-1}$.",
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
    subject: "Physics",
    questionText: "A straight wire carrying a current of 14 A is bent into a semicircular arc of radius 2.2 cm. The magnetic field produced by the current at the centre (O) of the arc is _______ $\\times 10^{-4}\\text{T}$.",
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
    questionText: "A point object, ‘O’ is placed in front of two thin symmetrical coaxial convex lenses $L_1$ and $L_2$ with focal length 24 cm and 9 cm respectively. The distance between two lenses is 10 cm and the object is placed 6 cm away from lens $L_1$. The distance between the object and the image formed by system is ______ cm.",
    imageUrl: null,
    optionA: "34",
    optionB: "34",
    optionC: "34",
    optionD: "34",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "A rectangular parallelopiped is measured as $1\\text{ cm} \\times 1\\text{ cm} \\times 100\\text{ cm}$. If its specific resistance is $3 \\times 10^{-7}\\Omega\\text{m}$, then the resistance between its two opposite rectangular faces will be ______ $\\times 10^{-7}\\Omega$.",
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
    questionText: "A force of $-P\\hat{k}$ acts on the origin of the coordinate system. The torque about the point (2, –3) is $P(a\\hat{i} + b\\hat{j})$, the ratio of $a/b$ is $x/2$. The value of x is",
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
    questionText: "If the maximum load carried by an elevator is 1400 kg (600 kg – Passenger + 800 kg – elevator), which is moving up with a uniform speed of $3\\text{ ms}^{-1}$ and the frictional force acting on it is 2000 N, then the maximum power used by the motor is ______ kW ($g = 10\\text{ m/s}^2$).",
    imageUrl: null,
    optionA: "48",
    optionB: "48",
    optionC: "48",
    optionD: "48",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "An electron revolves around an infinite cylindrical wire having uniform linear charge density $2 \\times 10^{-8}\\text{ Cm}^{-1}$ in circular path under the influence of attractive electrostatic field. The velocity of electron with which it is revolving is _________$\\times 10^6\\text{ ms}^{-1}$. ($m_e = 9 \\times 10^{-31}\\text{ kg}$)",
    imageUrl: null,
    optionA: "8",
    optionB: "8",
    optionC: "8",
    optionD: "8",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  }
];

async function seedJee2023Apr10Shift2() {
  console.log(`🚀 Compiling JEE Main 2023 (10 Apr Shift 2) Paper with ${rawQuestions.length} questions...`);

  const paperData = {
    examName: "JEE Main",
    year: 2023,
    shiftName: "JEE Main 2023 (10 Apr Shift 2)",
    examDate: "2023-04-10T15:00:00Z",
    totalMarks: 300,
    totalQuestions: 90,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'JEE Main 2023 (10 Apr Shift 2).json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved paper JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding JEE Main 2023 (10 Apr Shift 2) into PostgreSQL via Prisma...`);
  
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
      name: "JEE Main 2023 (10 Apr Shift 2)"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "JEE Main 2023 (10 Apr Shift 2)",
      date: new Date("2023-04-10T15:00:00Z")
    }
  });
  console.log(`Created Shift "JEE Main 2023 (10 Apr Shift 2)" (ID: ${shift.id})`);

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

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for JEE Main 2023 (10 Apr Shift 2) into Database!`);
}

seedJee2023Apr10Shift2()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
