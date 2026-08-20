const prisma = require('../../lib/prisma');
const fs = require('fs');
const path = require('path');

const rawQuestions = [
  // ── MATHEMATICS (Q1 - Q30) ──
  {
    subject: "Mathematics",
    questionText: "Considering only the principal values of inverse trigonometric functions, the number of positive real values of x satisfying $\\tan^{-1}(x) + \\tan^{-1}(2x) = \\frac{\\pi}{4}$ is :",
    imageUrl: null,
    optionA: "(1) More than 2",
    optionB: "(2) 1",
    optionC: "(3) 2",
    optionD: "(4) 0",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Consider the function $f:(0,2) \\to \\mathbb{R}$ defined by $f(x) = \\frac{x}{2} + \\frac{2}{x}$ and the function $g(x)$ defined by $g(x) = \\begin{cases} \\min\\{f(t)\\}; 0 < t \\le x \\text{ and } 0 < x \\le 1 \\\\ \\frac{3}{2} + x; 1 < x < 2 \\end{cases}$. Then",
    imageUrl: null,
    optionA: "(1) g is continuous but not differentiable at x = 1",
    optionB: "(2) g is not continuous for all x \\in (0,2)",
    optionC: "(3) g is neither continuous nor differentiable at x = 1",
    optionD: "(4) g is continuous and differentiable for all x \\in (0,2)",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let the image of the point $(1, 0, 7)$ in the line $\\frac{x}{1} = \\frac{y-1}{2} = \\frac{z-2}{3}$ be the point $(\\alpha, \\beta, \\gamma)$. Then which one of the following points lies on the line passing through $(\\alpha, \\beta, \\gamma)$ and making angles $\\frac{2\\pi}{3}$ and $\\frac{3\\pi}{4}$ with y-axis and z-axis respectively and an acute angle with x-axis ?",
    imageUrl: null,
    optionA: "(1) $(1, -2, 1 + \\sqrt{2})$",
    optionB: "(2) $(1, 2, 1 - \\sqrt{2})$",
    optionC: "(3) $(3, 4, 3 - 2\\sqrt{2})$",
    optionD: "(4) $(3, -4, 3 + 2\\sqrt{2})$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let R be the interior region between the lines $3x - y + 1 = 0$ and $x + 2y - 5 = 0$ containing the origin. The set of all values of a, for which the points $(a^2, a + 1)$ lie in R, is:",
    imageUrl: null,
    optionA: "(1) $(-3, -1) \\cup (-\\frac{1}{3}, 1)$",
    optionB: "(2) $(-3, 0) \\cup (\\frac{1}{3}, 1)$",
    optionC: "(3) $(-3, 0) \\cup (\\frac{2}{3}, 1)$",
    optionD: "(4) $(-3, -1) \\cup (\\frac{1}{3}, 1)$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The 20th term from the end of the progression $20, 19\\frac{1}{4}, 18\\frac{1}{2}, 17\\frac{3}{4}, \\dots, -129\\frac{1}{4}$ is :-",
    imageUrl: null,
    optionA: "(1) -118",
    optionB: "(2) -110",
    optionC: "(3) -115",
    optionD: "(4) -100",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $f : \\mathbb{R} - \\{-\\frac{1}{2}\\} \\to \\mathbb{R}$ and $g : \\mathbb{R} - \\{-\\frac{5}{2}\\} \\to \\mathbb{R}$ be defined as $f(x) = \\frac{2x+3}{2x+1}$ and $g(x) = \\frac{|x|+1}{2x+5}$. Then the domain of the function $f \\circ g$ is:",
    imageUrl: null,
    optionA: "(1) $\\mathbb{R} - \\{-\\frac{5}{2}\\}$",
    optionB: "(2) $\\mathbb{R}$",
    optionC: "(3) $\\mathbb{R} - \\{-\\frac{7}{4}\\}$",
    optionD: "(4) $\\mathbb{R} - \\{-\\frac{5}{2}, -\\frac{7}{4}\\}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "For $0 < a < 1$, the value of the integral $\\int_0^\\pi \\frac{dx}{1-2a\\cos x + a^2}$ is:",
    imageUrl: null,
    optionA: "(1) $\\frac{\\pi^2}{\\pi+a^2}$",
    optionB: "(2) $\\frac{\\pi^2}{\\pi-a^2}$",
    optionC: "(3) $\\frac{\\pi}{1-a^2}$",
    optionD: "(4) $\\frac{\\pi}{1+a^2}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $g(x) = 3f(x/3) + f(3 - x)$ and $f''(x) > 0$ for all $x \\in (0,3)$. If g is decreasing in $(0, \\alpha)$ and increasing in $(\\alpha, 3)$, then $8\\alpha$ is",
    imageUrl: null,
    optionA: "(1) 24",
    optionB: "(2) 0",
    optionC: "(3) 18",
    optionD: "(4) 20",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If $\\lim_{x\\to 0} \\frac{3+\\alpha \\sin x + \\beta \\cos x + \\log_e(1-x)}{3\\tan^2 x} = \\frac{1}{3}$, then $2\\alpha - \\beta$ is equal to:",
    imageUrl: null,
    optionA: "(1) 2",
    optionB: "(2) 7",
    optionC: "(3) 5",
    optionD: "(4) 1",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If $\\alpha, \\beta$ are the roots of the equation $x^2 - x - 1 = 0$ and $S_n = 2023\\alpha^n + 2024\\beta^n$, then",
    imageUrl: null,
    optionA: "(1) $2S_{12} = S_{11} + S_{10}$",
    optionB: "(2) $S_{12} = S_{11} + S_{10}$",
    optionC: "(3) $2S_{11} = S_{12} + S_{10}$",
    optionD: "(4) $S_{11} = S_{10} + S_{12}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let A and B be two finite sets with m and n elements respectively. The total number of subsets of the set A is 56 more than the total number of subsets of B. Then the distance of the point P(m, n) from the point Q(-2, -3) is",
    imageUrl: null,
    optionA: "(1) 10",
    optionB: "(2) 6",
    optionC: "(3) 4",
    optionD: "(4) 8",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The values of $\\alpha$, for which $\\begin{vmatrix} 1 & \\frac{3}{2} & \\alpha+\\frac{3}{2} \\\\ 1 & \\frac{1}{3} & \\alpha+\\frac{1}{3} \\\\ 2\\alpha+3 & 3\\alpha+1 & 0 \\end{vmatrix} = 0$, lies in the interval",
    imageUrl: null,
    optionA: "(1) $(-2, 1)$",
    optionB: "(2) $(-3, 0)$",
    optionC: "(3) $(-\\frac{3}{2}, \\frac{3}{2})$",
    optionD: "(4) $(0, 3)$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "An urn contains 6 white and 9 black balls. Two successive draws of 4 balls are made without replacement. The probability, that the first draw gives all white balls and the second draw gives all black balls, is:",
    imageUrl: null,
    optionA: "(1) $\\frac{5}{256}$",
    optionB: "(2) $\\frac{5}{715}$",
    optionC: "(3) $\\frac{3}{715}$",
    optionD: "(4) $\\frac{3}{256}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The integral $\\int \\frac{(x^8 - x^2)dx}{(x^{12} + 3x^6 + 1)\\tan^{-1}(x^3 + \\frac{1}{x^3})}$ is equal to:",
    imageUrl: null,
    optionA: "(1) $\\log_e(|\\tan^{-1}(x^3 + \\frac{1}{x^3})|)^{1/3} + C$",
    optionB: "(2) $\\log_e(|\\tan^{-1}(x^3 + \\frac{1}{x^3})|)^{1/2} + C$",
    optionC: "(3) $\\log_e(|\\tan^{-1}(x^3 + \\frac{1}{x^3})|) + C$",
    optionD: "(4) $\\log_e(|\\tan^{-1}(x^3 + \\frac{1}{x^3})|)^3 + C$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If $2\\tan^2\\theta - 5\\sec\\theta = 1$ has exactly 7 solutions in the interval $[0, \\frac{n\\pi}{2}]$, for the least value of $n \\in \\mathbb{N}$ then $\\sum_{k=1}^n \\frac{k}{2^k}$ is equal to :",
    imageUrl: null,
    optionA: "(1) $\\frac{1}{2^{15}}(2^{14} - 14)$",
    optionB: "(2) $\\frac{1}{2^{14}}(2^{15} - 15)$",
    optionC: "(3) $1 - \\frac{15}{2^{13}}$",
    optionD: "(4) $\\frac{1}{2^{13}}(2^{14} - 15)$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The position vectors of the vertices A, B and C of a triangle are $2\\hat{i} - 3\\hat{j} + 3\\hat{k}$, $2\\hat{i} + 2\\hat{j} + 3\\hat{k}$ and $-\\hat{i} + \\hat{j} + 3\\hat{k}$ respectively. Let l denotes the length of the angle bisector AD of $\\angle BAC$ where D is on the line segment BC, then $2l^2$ equals:",
    imageUrl: null,
    optionA: "(1) 49",
    optionB: "(2) 42",
    optionC: "(3) 50",
    optionD: "(4) 45",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "If $y = y(x)$ is the solution curve of the differential equation $(x^2 - 4)dy - (y^2 - 3y)dx = 0, x > 2, y(4) = \\frac{3}{2}$ and the slope of the curve is never zero, then the value of $y(10)$ equals:",
    imageUrl: null,
    optionA: "(1) $\\frac{3}{1+(8)^{1/4}}$",
    optionB: "(2) $\\frac{3}{1+2\\sqrt{2}}$",
    optionC: "(3) $\\frac{3}{1-2\\sqrt{2}}$",
    optionD: "(4) $\\frac{3}{1-(8)^{1/4}}$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $e_1$ be the eccentricity of the hyperbola $\\frac{x^2}{16} - \\frac{y^2}{9} = 1$ and $e_2$ be the eccentricity of the ellipse $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1, a > b$, which passes through the foci of the hyperbola. If $e_1 e_2 = 1$, then the length of the chord of the ellipse parallel to the x-axis and passing through $(0, 2)$ is :",
    imageUrl: null,
    optionA: "(1) $4\\sqrt{5}$",
    optionB: "(2) $\\frac{8\\sqrt{5}}{3}$",
    optionC: "(3) $\\frac{10\\sqrt{5}}{3}$",
    optionD: "(4) $3\\sqrt{5}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let $\\alpha = \\frac{(4!)!}{(4!)^{3!}}$ and $\\beta = \\frac{(5!)!}{(5!)^{4!}}$. Then:",
    imageUrl: null,
    optionA: "(1) $\\alpha \\in \\mathbb{N}$ and $\\beta \\notin \\mathbb{N}$",
    optionB: "(2) $\\alpha \\notin \\mathbb{N}$ and $\\beta \\in \\mathbb{N}$",
    optionC: "(3) $\\alpha \\in \\mathbb{N}$ and $\\beta \\in \\mathbb{N}$",
    optionD: "(4) $\\alpha \\notin \\mathbb{N}$ and $\\beta \\notin \\mathbb{N}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "Let the position vectors of the vertices A, B and C of a triangle be $2\\hat{i} + 2\\hat{j} + \\hat{k}$, $\\hat{i} + 2\\hat{j} + 2\\hat{k}$ and $2\\hat{i} + \\hat{j} + 2\\hat{k}$ respectively. Let $\\ell_1, \\ell_2$, and $\\ell_3$ be the lengths of perpendiculars drawn from the orthocenter of the triangle on the sides AB, BC and CA respectively, then $\\ell_1^2 + \\ell_2^2 + \\ell_3^2$ equals :",
    imageUrl: null,
    optionA: "(1) $\\frac{1}{5}$",
    optionB: "(2) $\\frac{1}{2}$",
    optionC: "(3) $\\frac{1}{4}$",
    optionD: "(4) $\\frac{1}{3}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Mathematics",
    questionText: "The mean and standard deviation of 15 observations were found to be 12 and 3 respectively. On rechecking it was found that an observation was read as 10 in place of 12. If $\\mu$ and $\\sigma^2$ denote the mean and variance of the correct observations respectively, then $15(\\mu + \\mu^2 + \\sigma^2)$ is equal to ____",
    imageUrl: null,
    optionA: "2521",
    optionB: "2521",
    optionC: "2521",
    optionD: "2521",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "If the area of the region $\{(x, y): 0 \\le y \\le \\min\\{2x, 6x - x^2\\}\}$ is A, then $12 A$ is equal to ____",
    imageUrl: null,
    optionA: "304",
    optionB: "304",
    optionC: "304",
    optionD: "304",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Let A be a $2 \\times 2$ real matrix and I be the identity matrix of order 2. If the roots of the equation $|A - xI| = 0$ be -1 and 3, then the sum of the diagonal elements of the matrix $A^2$ is ____",
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
    questionText: "If the sum of squares of all real values of $\\alpha$, for which the lines $2x - y + 3 = 0, 6x + 3y + 1 = 0$ and $\\alpha x + 2y - 2 = 0$ do not form a triangle is p, then the greatest integer less than or equal to p is ___",
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
    subject: "Mathematics",
    questionText: "The coefficient of $x^{2012}$ in the expansion of $(1 - x)^{2008} (1 + x + x^2)^{2007}$ is equal to",
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
    questionText: "If the solution curve, of the differential equation $\\frac{dy}{dx} = \\frac{x+y-2}{x-y}$ passing through the point $(2, 1)$ is $\\tan^{-1}\\left(\\frac{y-1}{x-1}\\right) - \\frac{1}{\\beta}\\log_e\\left(\\alpha + \\left(\\frac{y-1}{x-1}\\right)^2\\right) = \\log_e |x - 1|$, then $5\\beta + \\alpha$ is equal to",
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
    questionText: "Let $f(x) = \\int_0^x g(t) \\log_e\\left(\\frac{1-t}{1+t}\\right) dt$, where g is a continuous odd function. If $\\int_{-\\pi/2}^{\\pi/2} \\left(f(x) + \\frac{x^2 \\cos x}{1+e^x}\\right) dx = \\left(\\frac{\\pi}{\\alpha}\\right)^2 - \\alpha$, then $\\alpha$ is equal to ____",
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
    questionText: "Consider a circle $(x - \\alpha)^2 + (y - \\beta)^2 = 50$, where $\\alpha, \\beta > 0$. If the circle touches the line $y + x = 0$ at the point P, whose distance from the origin is $4\\sqrt{2}$, then $(\\alpha + \\beta)^2$ is equal to ____",
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
    subject: "Mathematics",
    questionText: "The lines $\\frac{x-2}{2} = \\frac{y}{-2} = \\frac{z-7}{16}$ and $\\frac{x+3}{4} = \\frac{y+2}{3} = \\frac{z+2}{1}$ intersect at the point P. If the distance of P from the line $\\frac{x+1}{2} = \\frac{y-1}{3} = \\frac{z-1}{1}$ is l, then $14l^2$ is equal to ____.",
    imageUrl: null,
    optionA: "108",
    optionB: "108",
    optionC: "108",
    optionD: "108",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Mathematics",
    questionText: "Let the complex numbers $\\alpha$ and $\\frac{1}{\\bar{\\alpha}}$ lie on the circles $|z - z_0|^2 = 4$ and $|z - z_0|^2 = 16$ respectively, where $z_0 = 1 + i$. Then, the value of $100|\\alpha|^2$ is ____",
    imageUrl: null,
    optionA: "20",
    optionB: "20",
    optionC: "20",
    optionD: "20",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },

  // ── CHEMISTRY (Q31 - Q60) ──
  {
    subject: "Chemistry",
    questionText: "The order of relative stability of the contributing structure is:\nI. $\\text{CH}_2=\\text{CH}-\\text{C}=\\text{H}$\nII. $\\text{CH}_2^+-\\text{CH}=\\text{C}-\\text{H}^-$\nIII. $\\text{CH}_2^--\\text{CH}=\\text{C}^+-\\text{H}$\nChoose the correct answer from the options given below:",
    imageUrl: null,
    optionA: "(1) I > II > III",
    optionB: "(2) II > I > III",
    optionC: "(3) I = II = III",
    optionD: "(4) III > II > I",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which among the following halide/s will not show $S_N1$ reaction:\nA. $\\text{H}_2\\text{C}=\\text{CH}-\\text{CH}_2\\text{Cl}$\nB. $\\text{CH}_3-\\text{CH}=\\text{CH}-\\text{Cl}$\nC. Benzyl chloride\nD. 1-Chloro-1-methylcyclohexane",
    imageUrl: null,
    optionA: "(1) A, B and D only",
    optionB: "(2) A and B only",
    optionC: "(3) B and C only",
    optionD: "(4) B only",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following statements is not correct about rusting of iron?",
    imageUrl: null,
    optionA: "(1) Coating of iron surface by tin prevents rusting, even if the tin coating is peeling off.",
    optionB: "(2) When pH lies above 9 or 10, rusting of iron does not take place.",
    optionC: "(3) Dissolved acidic oxides $\\text{SO}_2, \\text{NO}_2$ in water act as catalyst in the process of rusting.",
    optionD: "(4) Rusting of iron is envisaged as setting up of electrochemical cell on the surface of iron object.",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Given below are two statements:\nStatement (I): In the Lanthanoids, the formation of $\\text{Ce}^{+4}$ is favoured by its noble gas configuration.\nStatement (II): $\\text{Ce}^{+4}$ is a strong oxidant reverting to the common +3 state.\nIn the light of the above statements, choose the most appropriate answer from the options given below:",
    imageUrl: null,
    optionA: "(1) Statement I is false but Statement II is true",
    optionB: "(2) Both Statement I and Statement II are true",
    optionC: "(3) Statement I is true but Statement II is false",
    optionD: "(4) Both Statement I and Statement II are false",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Choose the correct option having all the elements with $d^{10}$ electronic configuration from the following:",
    imageUrl: null,
    optionA: "(1) ${}_{27}\\text{Co}, {}_{28}\\text{Ni}, {}_{26}\\text{Fe}, {}_{24}\\text{Cr}$",
    optionB: "(2) ${}_{29}\\text{Cu}, {}_{30}\\text{Zn}, {}_{48}\\text{Cd}, {}_{47}\\text{Ag}$",
    optionC: "(3) ${}_{46}\\text{Pd}, {}_{28}\\text{Ni}, {}_{26}\\text{Fe}, {}_{24}\\text{Cr}$",
    optionD: "(4) ${}_{28}\\text{Ni}, {}_{24}\\text{Cr}, {}_{26}\\text{Fe}, {}_{29}\\text{Cu}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Phenolic group can be identified by a positive:",
    imageUrl: null,
    optionA: "(1) Phthalein dye test",
    optionB: "(2) Lucas test",
    optionC: "(3) Tollen's test",
    optionD: "(4) Carbylamine test",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The molecular formula of second homologue in the homologous series of mono carboxylic acids is _________.",
    imageUrl: null,
    optionA: "(1) $\\text{C}_3\\text{H}_6\\text{O}_2$",
    optionB: "(2) $\\text{C}_2\\text{H}_4\\text{O}_2$",
    optionC: "(3) $\\text{CH}_2\\text{O}$",
    optionD: "(4) $\\text{C}_2\\text{H}_2\\text{O}_2$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The technique used for purification of steam volatile water immiscible substance is:",
    imageUrl: null,
    optionA: "(1) Fractional distillation",
    optionB: "(2) Fractional distillation under reduced pressure",
    optionC: "(3) Distillation",
    optionD: "(4) Steam distillation",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The final product A, formed in the following reaction sequence is:\n$\\text{PhCH}=\\text{CH}_2 \\xrightarrow{(i) \\text{BH}_3, (ii) \\text{H}_2\\text{O}_2/\\text{OH}^-, (iii) \\text{HBr}, (iv) \\text{Mg, ether, then HCHO/H}_3\\text{O}^+} A$",
    imageUrl: null,
    optionA: "(1) $\\text{Ph}-\\text{CH}_2-\\text{CH}_2-\\text{CH}_2-\\text{CH}_3$",
    optionB: "(2) $\\text{Ph}-\\text{CH}(\\text{CH}_3)_2$",
    optionC: "(3) $\\text{Ph}-\\text{CH}(\\text{CH}_3)\\text{CH}_2\\text{OH}$",
    optionD: "(4) $\\text{Ph}-\\text{CH}_2-\\text{CH}_2-\\text{CH}_2-\\text{OH}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Match List - I with List - II.\nList I (Reaction):\nA. Phenol -> Salicylic acid\nB. Phenol -> Salicylaldehyde\nC. Phenol -> p-Benzoquinone\nD. Phenol -> Anisole\nChoose the correct answer:",
    imageUrl: null,
    optionA: "(1) A - IV, B - I, C - III, D - II",
    optionB: "(2) A - II, B - III, C - I, D - IV",
    optionC: "(3) A - II, B - I, C - III, D - IV",
    optionD: "(4) A - IV, B - III, C - I, D - II",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Major product formed in the reaction of 1-methoxy-1-methylcyclohexane with HI is a mixture of:",
    imageUrl: null,
    optionA: "(1) 1-Iodocyclohexane and $(\\text{CH}_3)_3\\text{CCl}$",
    optionB: "(2) 1-Iodocyclohexane and $(\\text{CH}_3)_3\\text{COH}$",
    optionC: "(3) 1-Methylcyclohexanol and $(\\text{CH}_3)_3\\text{COH}$",
    optionD: "(4) 1-Methylcyclohexanol and $(\\text{CH}_3)_3\\text{C-I}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Bond line formula of $\\text{HOCH}(\\text{CN})_2$ is:",
    imageUrl: null,
    optionA: "(1) $\\text{HO}-\\text{CH}(\\text{CN})_2$",
    optionB: "(2) $\\text{HO}-\\text{CH}=\\text{C}=\\text{N}$",
    optionC: "(3) $\\text{HO}-\\text{CH}_2-\\text{CN}$",
    optionD: "(4) $\\text{HO}-\\text{CH}(\\text{C}\\equiv\\text{N})_2$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Given below are two statements:\nStatement (I): Oxygen being the first member of group 16 exhibits only -2 oxidation state.\nStatement (II): Down the group 16 stability of +4 oxidation state decreases and +6 oxidation state increases.\nIn the light of the above statements, choose the most appropriate answer from the options given below:",
    imageUrl: null,
    optionA: "(1) Statement I is correct but Statement II is incorrect",
    optionB: "(2) Both Statement I and Statement II are correct",
    optionC: "(3) Both Statement I and Statement II are incorrect",
    optionD: "(4) Statement I is incorrect but Statement II is correct",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Identify from the following species in which $d^2sp^3$ hybridization is shown by central atom:",
    imageUrl: null,
    optionA: "(1) $[\\text{Co}(\\text{NH}_3)_6]^{3+}$",
    optionB: "(2) $\\text{BrF}_5$",
    optionC: "(3) $[\\text{Pt}(\\text{Cl})_4]^{2-}$",
    optionD: "(4) $\\text{SF}_6$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Identify B formed in the reaction:\\n$\\text{Cl}-(\\text{CH}_2)_4-\\text{Cl} \\xrightarrow{\\text{reagents}} A \\xrightarrow{\\text{NaCl}} B + \\text{H}_2\\text{O} + \\text{NaCl}$",
    imageUrl: null,
    optionA: "(1) Pyrrole",
    optionB: "(2) $\\text{H}_2\\text{N}-(\\text{CH}_2)_4-\\text{NH}_2$",
    optionC: "(3) Pyrrolidine",
    optionD: "(4) Succinimide",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The quantity which changes with temperature is:",
    imageUrl: null,
    optionA: "(1) Molarity",
    optionB: "(2) Mass percentage",
    optionC: "(3) Molality",
    optionD: "(4) Mole fraction",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which structure of protein remains intact after coagulation of egg white on boiling?",
    imageUrl: null,
    optionA: "(1) Primary",
    optionB: "(2) Tertiary",
    optionC: "(3) Secondary",
    optionD: "(4) Quaternary",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Which of the following cannot function as an oxidising agent?",
    imageUrl: null,
    optionA: "(1) $\\text{N}^{3-}$",
    optionB: "(2) $\\text{SO}_4^{2-}$",
    optionC: "(3) $\\text{BrO}_3^-$",
    optionD: "(4) $\\text{MnO}_4^-$",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "The incorrect statement regarding conformations of ethane is:",
    imageUrl: null,
    optionA: "(1) Ethane has infinite number of conformations",
    optionB: "(2) The dihedral angle in staggered conformation is $60^\\circ$",
    optionC: "(3) Eclipsed conformation is the most stable conformation.",
    optionD: "(4) The conformations of ethane are interconvertible to one-another.",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Identity the incorrect pair from the following:",
    imageUrl: null,
    optionA: "(1) Photography - AgBr",
    optionB: "(2) Polythene preparation – $\\text{TiCl}_4, \\text{Al}(\\text{CH}_3)_3$",
    optionC: "(3) Haber process - Iron",
    optionD: "(4) Wacker process – $\\text{PtCl}_2$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Chemistry",
    questionText: "Total number of ions from the following with noble gas configuration is _________.\\n$\\text{Sr}^{2+}(Z=38), \\text{Cs}^+(Z=55), \\text{La}^{2+}(Z=57), \\text{Pb}^{2+}(Z=82), \\text{Yb}^{2+}(Z=70), \\text{Fe}^{2+}(Z=26)$",
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
    questionText: "The number of non-polar molecules from the following is ___________\\n$\\text{HF}, \\text{H}_2\\text{O}, \\text{SO}_2, \\text{H}_2, \\text{CO}_2, \\text{CH}_4, \\text{NH}_3, \\text{HCl}, \\text{CHCl}_3, \\text{BF}_3$",
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
    questionText: "Time required for completion of 99.9% of a First order reaction is ________ times of half life ($t_{1/2}$) of the reaction.",
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
    subject: "Chemistry",
    questionText: "The Spin only magnetic moment value of square planar complex $[\\text{Pt}(\\text{NH}_3)_2\\text{Cl}(\\text{NH}_2\\text{CH}_3)]\\text{Cl}$ is ________ B.M. (Nearest integer)",
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
    questionText: "For a certain thermochemical reaction $\\text{M} \\to \\text{N}$ at $T = 400\\text{ K}, \\Delta H^\\circ = 77.2\\text{ kJ mol}^{-1}, \\Delta S = 122\\text{ JK}^{-1}$, log equilibrium constant $(\\log K)$ is $-\\text{______} \\times 10^{-1}$.",
    imageUrl: null,
    optionA: "37",
    optionB: "37",
    optionC: "37",
    optionD: "37",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Volume of 3 M $\\text{NaOH}$ (formula weight $40\\text{ g mol}^{-1}$) which can be prepared from 84 g of $\\text{NaOH}$ is ________ $\\times 10^{-1}\\text{ dm}^3$.",
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
    questionText: "1 mole of $\\text{PbS}$ is oxidised by “X” moles of $\\text{O}_3$ to get “Y” moles of $\\text{O}_2$. X + Y = __________",
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
    questionText: "The hydrogen electrode is dipped in a solution of pH = 3 at $25^\\circ\\text{C}$. The potential of the electrode will be $-\\text{______} \\times 10^{-2}\\text{ V}$. (Given $\\frac{2.303RT}{F} = 0.059\\text{ V}$)",
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
    questionText: "9.3 g of aniline is subjected to reaction with excess of acetic anhydride to prepare acetanilide. The mass of acetanilide produced if the reaction is 100% completed is ________ $\\times 10^{-1}\\text{ g}$.",
    imageUrl: null,
    optionA: "135",
    optionB: "135",
    optionC: "135",
    optionD: "135",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Chemistry",
    questionText: "Total number of compounds with Chiral carbon atoms from following is ________.\\n$\\text{CH}_3-\\text{CH}_2-\\text{CH}(\\text{NO}_2)-\\text{COOH}$\\n$\\text{CH}_3-\\text{CH}_2-\\text{CHBr}-\\text{CH}_2-\\text{CH}_3$\\n$\\text{CH}_3-\\text{CH}(\\text{I})-\\text{CH}_2-\\text{NO}_2$\\n$\\text{CH}_3-\\text{CH}_2-\\text{CH}(\\text{OH})-\\text{CH}_2\\text{OH}$\\n$\\text{CH}_3-\\text{CH}(\\text{I})-\\text{C}_2\\text{H}_5$",
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
    questionText: "The equation of state of a real gas is given by $(P + \\frac{a}{V^2})(V - b) = RT$, where P, V and T are pressure, volume and temperature respectively and R is the universal gas constant. The dimensions of $\\frac{a}{b^2}$ is similar to that of:",
    imageUrl: null,
    optionA: "(1) PV",
    optionB: "(2) P",
    optionC: "(3) RT",
    optionD: "(4) R",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Wheatstone bridge principle is used to measure the specific resistance ($S_1$) of given wire, having length L, radius r. If X is the resistance of wire, then specific resistance is : $S_1 = X \\left(\\frac{\\pi r^2}{L}\\right)$. If the length of the wire gets doubled then the value of the specific resistance will be:",
    imageUrl: null,
    optionA: "(1) $\\frac{S_1}{4}$",
    optionB: "(2) $2S_1$",
    optionC: "(3) $\\frac{S_1}{2}$",
    optionD: "(4) $S_1$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Given below are two statements: one is labeled as Assertion (A) and the other is labeled as Reason (R).\\nAssertion (A): The angular speed of the moon in its orbit about the earth is more than the angular speed of the earth in its orbit about the sun.\\nReason (R): The moon takes less time to move around the earth than the time taken by the earth to move around the sun.\\nIn the light of the above statements, choose the most appropriate answer from the options given below:",
    imageUrl: null,
    optionA: "(1) (A) is correct but (R) is not correct",
    optionB: "(2) Both (A) and (R) are correct and (R) is the correct explanation of (A)",
    optionC: "(3) Both (A) and (R) are correct but (R) is not the correct explanation of (A)",
    optionD: "(4) (A) is not correct but (R) is correct",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Given below are two statements:\\nStatement (I): The limiting force of static friction depends on the area of contact and independent of materials.\\nStatement (II): The limiting force of kinetic friction is independent of the area of contact and depends on materials.\\nIn the light of the above statements, choose the most appropriate answer from the options given below:",
    imageUrl: null,
    optionA: "(1) Statement I is correct but Statement II is incorrect",
    optionB: "(2) Statement I is incorrect but Statement II is correct",
    optionC: "(3) Both Statement I and Statement II are incorrect",
    optionD: "(4) Both Statement I and Statement II are correct",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The truth table of the given logic circuit diagram with inputs A, B and output Y is:",
    imageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 160' width='300' height='160'><rect x='10' y='10' width='280' height='140' fill='%23f8fafc' stroke='%23cbd5e1' rx='8'/><text x='20' y='35' font-family='sans-serif' font-weight='bold' font-size='14' fill='%230f172a'>Option 2 Truth Table</text><text x='20' y='65' font-family='sans-serif' font-size='12' fill='%230284c7'>A=0, B=0 =&gt; Y=0</text><text x='20' y='85' font-family='sans-serif' font-size='12' fill='%230284c7'>A=0, B=1 =&gt; Y=1</text><text x='20' y='105' font-family='sans-serif' font-size='12' fill='%230284c7'>A=1, B=0 =&gt; Y=1</text><text x='20' y='125' font-family='sans-serif' font-size='12' fill='%230284c7'>A=1, B=1 =&gt; Y=0</text></svg>",
    optionA: "(1) A=0,B=0=>1; A=0,B=1=>0",
    optionB: "(2) A=0,B=0=>0; A=0,B=1=>1; A=1,B=0=>1; A=1,B=1=>0",
    optionC: "(3) A=0,B=0=>0; A=1,B=1=>1",
    optionD: "(4) A=0,B=0=>1; A=1,B=1=>0",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A current of $200\\mu\\text{A}$ deflects the coil of a moving coil galvanometer through $60^\\circ$. The current to cause deflection through $\\frac{\\pi}{10}\\text{ radian}$ is:",
    imageUrl: null,
    optionA: "(1) $30\\mu\\text{A}$",
    optionB: "(2) $120\\mu\\text{A}$",
    optionC: "(3) $60\\mu\\text{A}$",
    optionD: "(4) $180\\mu\\text{A}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The atomic mass of ${}_6\\text{C}^{12}$ is 12.000000 u and that of ${}_6\\text{C}^{13}$ is 13.003354 u. The required energy to remove a neutron from ${}_6\\text{C}^{13}$, if mass of neutron is 1.008665 u, will be:",
    imageUrl: null,
    optionA: "(1) 62.5 MeV",
    optionB: "(2) 6.25 MeV",
    optionC: "(3) 4.95 MeV",
    optionD: "(4) 49.5 MeV",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A ball suspended by a thread swings in a vertical plane so that its magnitude of acceleration in the extreme position and lowest position are equal. The angle $(\\theta)$ of thread deflection in the extreme position will be:",
    imageUrl: null,
    optionA: "(1) $\\tan^{-1}(\\sqrt{2})$",
    optionB: "(2) $2\\tan^{-1}\\left(\\frac{1}{2}\\right)$",
    optionC: "(3) $\\tan^{-1}\\left(\\frac{1}{2}\\right)$",
    optionD: "(4) $2\\tan^{-1}\\left(\\frac{1}{\\sqrt{5}}\\right)$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Three voltmeters, all having different internal resistances are joined in parallel and series circuit across A and B. When potential difference is applied across A and B, their readings are $V_1, V_2$ and $V_3$. Choose the correct option.",
    imageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 120' width='240' height='120'><rect x='10' y='10' width='220' height='100' fill='%23f8fafc' stroke='%23cbd5e1' rx='8'/><text x='30' y='40' font-family='sans-serif' font-size='12' fill='%230f172a'>Voltmeter Network</text><text x='30' y='75' font-family='sans-serif' font-weight='bold' font-size='13' fill='%232563eb'>V1 + V2 = V3</text></svg>",
    optionA: "(1) $V_1 = V_2$",
    optionB: "(2) $V_1 \\neq V_3 - V_2$",
    optionC: "(3) $V_1 + V_2 > V_3$",
    optionD: "(4) $V_1 + V_2 = V_3$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The total kinetic energy of 1 mole of oxygen at $27^\\circ\\text{C}$ is: [Use universal gas constant $(R) = 8.31\\text{ J/mole K}$]",
    imageUrl: null,
    optionA: "(1) 6845.5 J",
    optionB: "(2) 5942.0 J",
    optionC: "(3) 6232.5 J",
    optionD: "(4) 5670.5 J",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Given below are two statements: one is labelled as Assertion(A) and the other is labelled as Reason (R).\\nAssertion (A): In Vernier calliper if positive zero error exists, then while taking measurements, the reading taken will be more than the actual reading.\\nReason (R): The zero error in Vernier Calliper might have happened due to manufacturing defect or due to rough handling.\\nIn the light of the above statements, choose the correct answer from the options given below:",
    imageUrl: null,
    optionA: "(1) Both (A) and (R) are correct and (R) is the correct explanation of (A)",
    optionB: "(2) Both (A) and (R) are correct but (R) is not the correct explanation of (A)",
    optionC: "(3) (A) is true but (R) is false",
    optionD: "(4) (A) is false but (R) is true",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Primary side of a transformer is connected to 230 V, 50 Hz supply. Turns ratio of primary to secondary winding is $10 : 1$. Load resistance connected to secondary side is $46\\Omega$. The power consumed in it is:",
    imageUrl: null,
    optionA: "(1) 12.5 W",
    optionB: "(2) 10.0 W",
    optionC: "(3) 11.5 W",
    optionD: "(4) 12.0 W",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "During an adiabatic process, the pressure of a gas is found to be proportional to the cube of its absolute temperature. The ratio of $\\frac{C_p}{C_v}$ for the gas is :",
    imageUrl: null,
    optionA: "(1) $\\frac{5}{3}$",
    optionB: "(2) $\\frac{3}{2}$",
    optionC: "(3) $\\frac{7}{5}$",
    optionD: "(4) $\\frac{9}{7}$",
    correctOption: "B",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The threshold frequency of a metal with work function 6.63 eV is:",
    imageUrl: null,
    optionA: "(1) $16 \\times 10^{15}\\text{ Hz}$",
    optionB: "(2) $16 \\times 10^{12}\\text{ Hz}$",
    optionC: "(3) $1.6 \\times 10^{12}\\text{ Hz}$",
    optionD: "(4) $1.6 \\times 10^{15}\\text{ Hz}$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Given below are two statements: one is labelled as Assertion (A) and the other is labelled as Reason (R)\\nAssertion (A): The property of body, by virtue of which it tends to regain its original shape when the external force is removed, is Elasticity.\\nReason (R): The restoring force depends upon the bonded inter atomic and inter molecular force of solid.\\nIn the light of the above statements, choose the correct answer from the options given below:",
    imageUrl: null,
    optionA: "(1) (A) is false but (R) is true",
    optionB: "(2) (A) is true but (R) is false",
    optionC: "(3) Both (A) and (R) are true and (R) is the correct explanation (A)",
    optionD: "(4) Both (A) and (R) are true but (R) is not the correct explanation of (A)",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "When a polaroid sheet is rotated between two crossed polaroids then the transmitted light intensity will be maximum for a rotation of:",
    imageUrl: null,
    optionA: "(1) $60^\\circ$",
    optionB: "(2) $30^\\circ$",
    optionC: "(3) $90^\\circ$",
    optionD: "(4) $45^\\circ$",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "An object is placed in a medium of refractive index 3. An electromagnetic wave of intensity $6 \\times 10^8\\text{ W/m}^2$ falls normally on the object and it is absorbed completely. The radiation pressure on the object would be (speed of light in free space $= 3 \\times 10^8\\text{ m/s}$):",
    imageUrl: null,
    optionA: "(1) $36\\text{ Nm}^{-2}$",
    optionB: "(2) $18\\text{ Nm}^{-2}$",
    optionC: "(3) $6\\text{ Nm}^{-2}$",
    optionD: "(4) $2\\text{ Nm}^{-2}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "Given below are two statements : one is labelled a Assertion (A) and the other is labelled as Reason(R)\\nAssertion (A): Work done by electric field on moving a positive charge on an equipotential surface is always zero.\\nReason (R): Electric lines of forces are always perpendicular to equipotential surfaces.\\nIn the light of the above statements, choose the most appropriate answer from the options given below:",
    imageUrl: null,
    optionA: "(1) Both (A) and (R) are correct but (R) is not the correct explanation of (A)",
    optionB: "(2) (A) is correct but (R) is not correct",
    optionC: "(3) (A) is not correct but (R) is correct",
    optionD: "(4) Both (A) and (R) are correct and (R) is the correct explanation of (A)",
    correctOption: "D",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A heavy iron bar of weight 12 kg is having its one end on the ground and the other on the shoulder of a man. The rod makes an angle $60^\\circ$ with the horizontal, the weight experienced by the man is:",
    imageUrl: null,
    optionA: "(1) 6 kg",
    optionB: "(2) 12 kg",
    optionC: "(3) 3 kg",
    optionD: "(4) $6\\sqrt{3}\\text{ kg}$",
    correctOption: "C",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "A bullet is fired into a fixed target looses one third of its velocity after travelling 4 cm. It penetrates further $D \\times 10^{-3}\\text{ m}$ before coming to rest. The value of D is:",
    imageUrl: null,
    optionA: "(1) 3.2",
    optionB: "(2) 5",
    optionC: "(3) 3",
    optionD: "(4) 4",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: -1
  },
  {
    subject: "Physics",
    questionText: "The magnetic field at the centre of a wire loop formed by two semicircular wires of radii $R_1 = 2\\pi\\text{ m}$ and $R_2 = 4\\pi\\text{ m}$ carrying current $I = 4\\text{A}$ as per figure is $\\alpha \\times 10^{-7}\\text{ T}$. The value of $\\alpha$ is ______. (Centre O is common for all segments)",
    imageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 180' width='240' height='180'><path d='M 20 90 A 100 100 0 0 1 220 90 M 60 90 A 60 60 0 0 1 180 90' fill='none' stroke='%230284c7' stroke-width='3'/><line x1='20' y1='90' x2='60' y2='90' stroke='%230284c7' stroke-width='3'/><line x1='180' y1='90' x2='220' y2='90' stroke='%230284c7' stroke-width='3'/><circle cx='120' cy='90' r='4' fill='%23dc2626'/><text x='115' y='110' font-family='sans-serif' font-weight='bold' font-size='14' fill='%23dc2626'>O</text></svg>",
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
    questionText: "Two charges of $-4\\mu\\text{C}$ and $+4\\mu\\text{C}$ are placed at the points $A(1, 0, 4)\\text{m}$ and $B(2, -1, 5)\\text{ m}$ located in an electric field $\\vec{E} = 0.20\\hat{i}\\text{ V/cm}$. The magnitude of the torque acting on the dipole is $8\\sqrt{\\alpha} \\times 10^{-5}\\text{ Nm}$, Where $\\alpha = \\text{______}$.",
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
    questionText: "A closed organ pipe 150 cm long gives 7 beats per second with an open organ pipe of length 350 cm, both vibrating in fundamental mode. The velocity of sound is ________ m/s.",
    imageUrl: null,
    optionA: "294",
    optionB: "294",
    optionC: "294",
    optionD: "294",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "A body falling under gravity covers two points A and B separated by 80 m in 2s. The distance of upper point A from the starting point is ________ m (use $g = 10\\text{ ms}^{-2}$)",
    imageUrl: null,
    optionA: "45",
    optionB: "45",
    optionC: "45",
    optionD: "45",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "The reading of pressure metre attached with a closed pipe is $4.5 \\times 10^4\\text{ N/m}^2$. On opening the valve, water starts flowing and the reading of pressure metre falls to $2.0 \\times 10^4\\text{ N/m}^2$. The velocity of water is found to be $\\sqrt{V}\\text{ m/s}$. The value of V is ________",
    imageUrl: null,
    optionA: "50",
    optionB: "50",
    optionC: "50",
    optionD: "50",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "A ring and a solid sphere roll down the same inclined plane without slipping. They start from rest. The radii of both bodies are identical and the ratio of their kinetic energies is $\\frac{7}{x}$ where x is ________.",
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
    subject: "Physics",
    questionText: "A parallel beam of monochromatic light of wavelength 5000 Å is incident normally on a single narrow slit of width 0.001 mm. The light is focused by convex lens on screen, placed on its focal plane. The first minima will be formed for the angle of diffraction of ________ (degree).",
    imageUrl: null,
    optionA: "30",
    optionB: "30",
    optionC: "30",
    optionD: "30",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "The electric potential at the surface of an atomic nucleus ($z = 50$) of radius $9 \\times 10^{-13}\\text{ cm}$ is ________ $\\times 10^6\\text{V}$",
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
    subject: "Physics",
    questionText: "If Rydberg’s constant is R, the longest wavelength of radiation in Paschen series will be $\\frac{\\alpha}{7R}$, where $\\alpha = \\text{________}$.",
    imageUrl: null,
    optionA: "144",
    optionB: "144",
    optionC: "144",
    optionD: "144",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  },
  {
    subject: "Physics",
    questionText: "A series LCR circuit with $L = \\frac{100}{\\pi}\\text{ mH}, C = \\frac{10^{-3}}{\\pi}\\text{F}$ and $R = 10\\Omega$, is connected across an ac source of 220 V, 50 Hz supply. The power factor of the circuit would be ________.",
    imageUrl: null,
    optionA: "1",
    optionB: "1",
    optionC: "1",
    optionD: "1",
    correctOption: "A",
    positiveMarks: 4,
    negativeMarks: 0
  }
];

async function seedJee2024Shift2() {
  console.log(`🚀 Compiling JEE Main 2024 (27 Jan Shift 2) Paper with ${rawQuestions.length} questions...`);

  const paperData = {
    examName: "JEE Main",
    year: 2024,
    shiftName: "JEE Main 2024 (27 Jan Shift 2)",
    examDate: "2024-01-27T15:00:00Z",
    totalMarks: 300,
    totalQuestions: 90,
    durationMinutes: 180,
    positiveMarks: 4,
    negativeMarks: -1,
    questions: rawQuestions
  };

  const jsonOutputPath = path.join(__dirname, 'JEE Main 2024 (27 Jan Shift 2).json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(paperData, null, 2));
  console.log(`✅ Saved paper JSON to: ${jsonOutputPath}`);

  console.log(`🌱 Seeding JEE Main 2024 (27 Jan Shift 2) into PostgreSQL via Prisma...`);
  
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
      name: "JEE Main 2024 (27 Jan Shift 2)"
    }
  });

  if (existingShift) {
    console.log(`Removing old shift ${existingShift.id}...`);
    await prisma.shift.delete({ where: { id: existingShift.id } });
  }

  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: "JEE Main 2024 (27 Jan Shift 2)",
      date: new Date("2024-01-27T15:00:00Z")
    }
  });
  console.log(`Created Shift "JEE Main 2024 (27 Jan Shift 2)" (ID: ${shift.id})`);

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

  console.log(`🎉 Successfully seeded ${rawQuestions.length} questions for JEE Main 2024 (27 Jan Shift 2) into Database!`);
}

seedJee2024Shift2()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
