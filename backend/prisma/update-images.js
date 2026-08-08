const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'src', 'papers', 'SSC CGL Tier-I 2024 (9 Sep Shift 1).json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// SVG helper generator
const makeMirrorSvg = (text) => {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60"><rect width="200" height="60" fill="%230f172a" rx="8"/><text x="100" y="38" font-family="serif" font-size="24" font-weight="bold" fill="%2338bdf8" text-anchor="middle">${text}</text></svg>`;
};

// Update Question 10 (Mirror image of 'y T f r 9 3 n')
// Correct option B is the exact flipped string: 'n Ɛ ୧ r ɟ T ʎ'
data.questions[9].optionA = makeMirrorSvg("r 9 3 n y");
data.questions[9].optionB = makeMirrorSvg("n Ɛ ୧ r ɟ T ʎ");
data.questions[9].optionC = makeMirrorSvg("9 3 T f r y");
data.questions[9].optionD = makeMirrorSvg("9 3 T f y r");

// Update Question 13 (Mirror image of 'b c F g I')
// Correct option A is the exact flipped string: 'I ƃ Ⅎ ɔ d'
data.questions[12].optionA = makeMirrorSvg("I ƃ Ⅎ ɔ d");
data.questions[12].optionB = makeMirrorSvg("I c b F g");
data.questions[12].optionC = makeMirrorSvg("I g F c b");
data.questions[12].optionD = makeMirrorSvg("I g F o b");

// Update Question 14 (Option figures for series completion)
const makeBoxSvg = (symbol, isCorrect = false) => {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="90" height="90" x="5" y="5" fill="%230f172a" stroke="%2338bdf8" stroke-width="2" rx="8"/><text x="50" y="58" font-size="32" font-weight="bold" fill="${isCorrect ? '%2334d399' : '%23fb7185'}" text-anchor="middle">${symbol}</text></svg>`;
};

data.questions[13].optionA = makeBoxSvg("↑ Circle Left");
data.questions[13].optionB = makeBoxSvg("→ Triangle Top", true);
data.questions[13].optionC = makeBoxSvg("← Circle Right");
data.questions[13].optionD = makeBoxSvg("↓ Square Bottom");

// Update Question 17 (Matrix pattern option figures)
data.questions[16].optionA = makeMirrorSvg("B  E  A  D  C");
data.questions[16].optionB = makeMirrorSvg("C  D  A  B  E");
data.questions[16].optionC = makeMirrorSvg("D  C  A  B  E");
data.questions[16].optionD = makeMirrorSvg("E  A  B  C  D");

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated option images in JSON file!');
