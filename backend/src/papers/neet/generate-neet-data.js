const fs = require('fs');
const path = require('path');

const backendImgDir = path.join(__dirname, 'neetimages');
const frontendImgDir = path.join(__dirname, '../../../../frontend/public/neetimages');

[backendImgDir, frontendImgDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function saveSvg(filename, svgContent) {
  fs.writeFileSync(path.join(backendImgDir, filename), svgContent.trim());
  fs.writeFileSync(path.join(frontendImgDir, filename), svgContent.trim());
}

// ---------------------------------------------------------------------
// 1. Generate Crisp Vector SVGs for all questions with diagrams
// ---------------------------------------------------------------------

// Q8: Galvanometer circuit
saveSvg('neet_2023_q8.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 240" width="100%" height="220">
  <rect width="500" height="240" fill="#0f172a" rx="16"/>
  <!-- Top branch -->
  <line x1="120" y1="80" x2="160" y2="80" stroke="#94a3b8" stroke-width="2.5"/>
  <!-- 400 ohm resistor -->
  <path d="M160 80 L168 68 L180 92 L192 68 L204 92 L216 68 L228 92 L236 80" fill="none" stroke="#38bdf8" stroke-width="3"/>
  <text x="198" y="55" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle">400 Ω</text>
  <line x1="236" y1="80" x2="280" y2="80" stroke="#94a3b8" stroke-width="2.5"/>
  <!-- Galvanometer circle -->
  <circle cx="310" cy="80" r="18" fill="#1e293b" stroke="#f59e0b" stroke-width="2.5"/>
  <text x="310" y="86" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle">G</text>
  <line x1="328" y1="80" x2="380" y2="80" stroke="#94a3b8" stroke-width="2.5"/>

  <!-- Left battery 10V -->
  <line x1="120" y1="80" x2="120" y2="105" stroke="#94a3b8" stroke-width="2.5"/>
  <line x1="105" y1="105" x2="135" y2="105" stroke="#10b981" stroke-width="3"/>
  <line x1="112" y1="117" x2="128" y2="117" stroke="#94a3b8" stroke-width="2.5"/>
  <text x="75" y="115" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="14">+ 10 V -</text>
  <line x1="120" y1="117" x2="120" y2="180" stroke="#94a3b8" stroke-width="2.5"/>

  <!-- Middle resistor R -->
  <line x1="260" y1="80" x2="260" y2="105" stroke="#94a3b8" stroke-width="2.5"/>
  <path d="M260 105 L248 113 L272 125 L248 137 L272 149 L260 157" fill="none" stroke="#a855f7" stroke-width="3"/>
  <text x="235" y="135" fill="#a855f7" font-family="sans-serif" font-weight="bold" font-size="15">R</text>
  <line x1="260" y1="157" x2="260" y2="180" stroke="#94a3b8" stroke-width="2.5"/>

  <!-- Right battery 2V -->
  <line x1="380" y1="80" x2="380" y2="105" stroke="#94a3b8" stroke-width="2.5"/>
  <line x1="365" y1="105" x2="395" y2="105" stroke="#38bdf8" stroke-width="3"/>
  <line x1="372" y1="117" x2="388" y2="117" stroke="#94a3b8" stroke-width="2.5"/>
  <text x="410" y="115" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="14">+ 2 V -</text>
  <line x1="380" y1="117" x2="380" y2="180" stroke="#94a3b8" stroke-width="2.5"/>

  <!-- Bottom wire -->
  <line x1="120" y1="180" x2="380" y2="180" stroke="#94a3b8" stroke-width="2.5"/>
  <!-- Current arrow -->
  <path d="M210 180 L200 174 L200 186 Z" fill="#94a3b8"/>
</svg>`);

// Q14: Suspended wire
saveSvg('neet_2023_q14.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240" width="100%" height="200">
  <rect width="300" height="240" fill="#0f172a" rx="16"/>
  <!-- Ceiling -->
  <line x1="80" y1="40" x2="220" y2="40" stroke="#94a3b8" stroke-width="4"/>
  <path d="M90 40 L80 30 M110 40 L100 30 M130 40 L120 30 M150 40 L140 30 M170 40 L160 30 M190 40 L180 30 M210 40 L200 30" stroke="#64748b" stroke-width="2.5"/>
  <!-- Wire -->
  <line x1="150" y1="40" x2="150" y2="140" stroke="#38bdf8" stroke-width="3"/>
  <text x="165" y="90" fill="#94a3b8" font-family="sans-serif" font-size="13">Area A</text>
  <!-- Weight block W -->
  <rect x="120" y="140" width="60" height="50" fill="#1e293b" stroke="#e2e8f0" stroke-width="2.5" rx="6"/>
  <text x="150" y="172" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="20" text-anchor="middle">W</text>
</svg>`);

// Q22: Capacitors network
saveSvg('neet_2023_q22.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 200" width="100%" height="180">
  <rect width="440" height="200" fill="#0f172a" rx="16"/>
  <!-- Point A -->
  <circle cx="50" cy="100" r="5" fill="#38bdf8"/>
  <text x="35" y="105" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="16">A</text>
  <line x1="55" y1="100" x2="110" y2="100" stroke="#94a3b8" stroke-width="2.5"/>
  <!-- 3 uF Capacitor -->
  <line x1="110" y1="75" x2="110" y2="125" stroke="#38bdf8" stroke-width="3.5"/>
  <line x1="122" y1="75" x2="122" y2="125" stroke="#38bdf8" stroke-width="3.5"/>
  <text x="116" y="65" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle">3 μF</text>
  <line x1="122" y1="100" x2="180" y2="100" stroke="#94a3b8" stroke-width="2.5"/>

  <!-- Parallel fork -->
  <line x1="180" y1="50" x2="180" y2="150" stroke="#94a3b8" stroke-width="2.5"/>
  <!-- Top 3uF -->
  <line x1="180" y1="50" x2="220" y2="50" stroke="#94a3b8" stroke-width="2.5"/>
  <line x1="220" y1="35" x2="220" y2="65" stroke="#a855f7" stroke-width="3.5"/>
  <line x1="232" y1="35" x2="232" y2="65" stroke="#a855f7" stroke-width="3.5"/>
  <text x="226" y="25" fill="#a855f7" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle">3 μF</text>
  <line x1="232" y1="50" x2="270" y2="50" stroke="#94a3b8" stroke-width="2.5"/>

  <!-- Bottom 3uF -->
  <line x1="180" y1="150" x2="220" y2="150" stroke="#94a3b8" stroke-width="2.5"/>
  <line x1="220" y1="135" x2="220" y2="165" stroke="#a855f7" stroke-width="3.5"/>
  <line x1="232" y1="135" x2="232" y2="165" stroke="#a855f7" stroke-width="3.5"/>
  <text x="226" y="185" fill="#a855f7" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle">3 μF</text>
  <line x1="232" y1="150" x2="270" y2="150" stroke="#94a3b8" stroke-width="2.5"/>

  <line x1="270" y1="50" x2="270" y2="150" stroke="#94a3b8" stroke-width="2.5"/>
  <line x1="270" y1="100" x2="380" y2="100" stroke="#94a3b8" stroke-width="2.5"/>
  <!-- Point B -->
  <circle cx="380" cy="100" r="5" fill="#38bdf8"/>
  <text x="395" y="105" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="16">B</text>
</svg>`);

// Q23: Gravitational potential
saveSvg('neet_2023_q23.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 140" width="100%" height="130">
  <rect width="460" height="140" fill="#0f172a" rx="16"/>
  <!-- Line -->
  <line x1="70" y1="60" x2="390" y2="60" stroke="#94a3b8" stroke-width="3"/>
  <!-- Mass M -->
  <circle cx="70" cy="60" r="14" fill="#38bdf8"/>
  <text x="70" y="35" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle">M</text>
  <!-- Mass 9M -->
  <circle cx="390" cy="60" r="18" fill="#a855f7"/>
  <text x="390" y="32" fill="#a855f7" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle">9M</text>
  <!-- Point P -->
  <circle cx="150" cy="60" r="6" fill="#f59e0b"/>
  <text x="150" y="85" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle">P</text>
  <!-- Distance arrows -->
  <text x="110" y="110" fill="#e2e8f0" font-family="sans-serif" font-size="13" text-anchor="middle">x</text>
  <text x="270" y="110" fill="#e2e8f0" font-family="sans-serif" font-size="13" text-anchor="middle">(R - x)</text>
  <text x="230" y="25" fill="#94a3b8" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle">Total Distance R</text>
</svg>`);

// Q26: Compass vectors
saveSvg('neet_2023_q26.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 220" width="100%" height="190">
  <rect width="260" height="220" fill="#0f172a" rx="16"/>
  <!-- Axes -->
  <line x1="130" y1="20" x2="130" y2="200" stroke="#64748b" stroke-width="2"/>
  <line x1="30" y1="110" x2="230" y2="110" stroke="#64748b" stroke-width="2"/>
  <text x="130" y="18" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle">N (ĵ)</text>
  <text x="130" y="215" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle">S (-ĵ)</text>
  <text x="240" y="114" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="14">E (î)</text>
  <text x="15" y="114" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="14">W (-î)</text>
  <!-- Vector turning arrow -->
  <line x1="130" y1="110" x2="190" y2="50" stroke="#10b981" stroke-width="3"/>
  <polygon points="190,50 178,55 185,62" fill="#10b981"/>
  <text x="200" y="45" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="13">F (N-E)</text>
</svg>`);

// Q31: KVL Circuit
saveSvg('neet_2023_q31.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 220" width="100%" height="200">
  <rect width="460" height="220" fill="#0f172a" rx="16"/>
  <!-- Nodes A, B, C, D -->
  <text x="65" y="65" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="15">A</text>
  <text x="390" y="65" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="15">B</text>
  <text x="390" y="175" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="15">C</text>
  <text x="65" y="175" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="15">D</text>

  <!-- Top branch with 2Ω, 10V, 5V, 1Ω -->
  <line x1="85" y1="60" x2="115" y2="60" stroke="#94a3b8" stroke-width="2.5"/>
  <path d="M115 60 L122 50 L134 70 L146 50 L158 70 L165 60" fill="none" stroke="#38bdf8" stroke-width="3"/>
  <text x="140" y="42" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle">2 Ω</text>
  <line x1="165" y1="60" x2="190" y2="60" stroke="#94a3b8" stroke-width="2.5"/>

  <!-- Battery 10V -->
  <line x1="190" y1="48" x2="190" y2="72" stroke="#10b981" stroke-width="3"/>
  <line x1="198" y1="54" x2="198" y2="66" stroke="#94a3b8" stroke-width="2.5"/>
  <text x="194" y="90" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="11" text-anchor="middle">10V</text>
  <line x1="198" y1="60" x2="225" y2="60" stroke="#94a3b8" stroke-width="2.5"/>
  <text x="225" y="90" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="13">E</text>

  <!-- Battery 5V -->
  <line x1="240" y1="48" x2="240" y2="72" stroke="#10b981" stroke-width="3"/>
  <line x1="248" y1="54" x2="248" y2="66" stroke="#94a3b8" stroke-width="2.5"/>
  <text x="244" y="90" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="11" text-anchor="middle">5V</text>
  <line x1="248" y1="60" x2="280" y2="60" stroke="#94a3b8" stroke-width="2.5"/>

  <!-- Resistor 1Ω -->
  <path d="M280 60 L287 50 L299 70 L311 50 L323 70 L330 60" fill="none" stroke="#38bdf8" stroke-width="3"/>
  <text x="305" y="42" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle">1 Ω</text>
  <line x1="330" y1="60" x2="380" y2="60" stroke="#94a3b8" stroke-width="2.5"/>

  <!-- Right branch -->
  <line x1="380" y1="60" x2="380" y2="170" stroke="#94a3b8" stroke-width="2.5"/>

  <!-- Bottom branch 7Ω -->
  <line x1="380" y1="170" x2="260" y2="170" stroke="#94a3b8" stroke-width="2.5"/>
  <path d="M260 170 L253 160 L241 180 L229 160 L217 180 L210 170" fill="none" stroke="#a855f7" stroke-width="3"/>
  <text x="235" y="198" fill="#a855f7" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle">7 Ω</text>
  <line x1="210" y1="170" x2="85" y2="170" stroke="#94a3b8" stroke-width="2.5"/>

  <!-- Left branch -->
  <line x1="85" y1="170" x2="85" y2="60" stroke="#94a3b8" stroke-width="2.5"/>
</svg>`);

// Q39: AC LCR circuit
saveSvg('neet_2023_q39.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 220" width="100%" height="190">
  <rect width="460" height="220" fill="#0f172a" rx="16"/>
  <!-- Top loop: Inductor, Capacitor, Resistor -->
  <line x1="80" y1="60" x2="110" y2="60" stroke="#94a3b8" stroke-width="2.5"/>
  <!-- Inductor coils -->
  <path d="M110 60 Q120 40 130 60 Q140 40 150 60 Q160 40 170 60" fill="none" stroke="#38bdf8" stroke-width="3"/>
  <text x="140" y="85" fill="#38bdf8" font-family="sans-serif" font-size="12" text-anchor="middle">50/π mH</text>

  <!-- Capacitor -->
  <line x1="170" y1="60" x2="220" y2="60" stroke="#94a3b8" stroke-width="2.5"/>
  <line x1="220" y1="42" x2="220" y2="78" stroke="#a855f7" stroke-width="3.5"/>
  <line x1="232" y1="42" x2="232" y2="78" stroke="#a855f7" stroke-width="3.5"/>
  <text x="226" y="98" fill="#a855f7" font-family="sans-serif" font-size="12" text-anchor="middle">10³/π μF</text>

  <!-- Resistor 10Ω -->
  <line x1="232" y1="60" x2="280" y2="60" stroke="#94a3b8" stroke-width="2.5"/>
  <path d="M280 60 L287 48 L299 72 L311 48 L323 72 L330 60" fill="none" stroke="#10b981" stroke-width="3"/>
  <text x="305" y="42" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle">10 Ω</text>
  <line x1="330" y1="60" x2="380" y2="60" stroke="#94a3b8" stroke-width="2.5"/>

  <!-- Right, bottom, AC source -->
  <line x1="380" y1="60" x2="380" y2="160" stroke="#94a3b8" stroke-width="2.5"/>
  <line x1="380" y1="160" x2="250" y2="160" stroke="#94a3b8" stroke-width="2.5"/>
  <circle cx="230" cy="160" r="18" fill="#1e293b" stroke="#f59e0b" stroke-width="2.5"/>
  <path d="M220 160 Q225 152 230 160 Q235 168 240 160" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
  <text x="230" y="200" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle">220 V, 50 Hz</text>
  <line x1="210" y1="160" x2="80" y2="160" stroke="#94a3b8" stroke-width="2.5"/>
  <line x1="80" y1="160" x2="80" y2="60" stroke="#94a3b8" stroke-width="2.5"/>
</svg>`);

// Q40: x-t SHM graph
saveSvg('neet_2023_q40.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 200" width="100%" height="180">
  <rect width="460" height="200" fill="#0f172a" rx="16"/>
  <!-- Axes -->
  <line x1="50" y1="100" x2="420" y2="100" stroke="#64748b" stroke-width="2.5"/>
  <line x1="80" y1="20" x2="80" y2="180" stroke="#64748b" stroke-width="2.5"/>
  <text x="430" y="105" fill="#f8fafc" font-family="sans-serif" font-size="13">t (s)</text>
  <text x="45" y="30" fill="#f8fafc" font-family="sans-serif" font-size="13">x (m)</text>

  <text x="65" y="55" fill="#94a3b8" font-family="sans-serif" font-size="13">1</text>
  <text x="65" y="105" fill="#94a3b8" font-family="sans-serif" font-size="13">0</text>
  <text x="60" y="155" fill="#94a3b8" font-family="sans-serif" font-size="13">-1</text>

  <!-- Sine wave curve -->
  <path d="M80 100 Q120 0 160 100 Q200 200 240 100 Q280 0 320 100" fill="none" stroke="#38bdf8" stroke-width="3.5"/>
  <text x="120" y="120" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle">2</text>
  <text x="160" y="120" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle">4</text>
  <text x="200" y="120" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle">6</text>
  <text x="240" y="120" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle">8</text>
</svg>`);

// Q41: Lens combination
saveSvg('neet_2023_q41.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 240" width="100%" height="200">
  <rect width="340" height="240" fill="#0f172a" rx="16"/>
  <!-- Outer liquid box -->
  <rect x="70" y="30" width="200" height="180" fill="#1e293b" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 4" rx="8"/>
  <text x="80" y="25" fill="#38bdf8" font-family="sans-serif" font-size="12">n₁ = 1.5</text>
  <!-- Middle convex lens -->
  <path d="M170 30 Q130 120 170 210 Q210 120 170 30 Z" fill="#334155" stroke="#a855f7" stroke-width="3"/>
  <text x="170" y="125" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="13" text-anchor="middle">n₂ = 1.6</text>
  <text x="275" y="120" fill="#94a3b8" font-family="sans-serif" font-size="12">R₁ = R₂ = 20 cm</text>
</svg>`);

// Q46: Logic circuit
saveSvg('neet_2023_q46.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160" width="100%" height="150">
  <rect width="400" height="160" fill="#0f172a" rx="16"/>
  <!-- Input A -->
  <text x="30" y="55" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="15">A</text>
  <line x1="50" y1="50" x2="80" y2="50" stroke="#94a3b8" stroke-width="2.5"/>
  <!-- NOT gate 1 -->
  <polygon points="80,35 120,50 80,65" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  <circle cx="125" cy="50" r="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
  <line x1="130" y1="50" x2="200" y2="50" stroke="#94a3b8" stroke-width="2.5"/>

  <!-- Input B -->
  <text x="30" y="115" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="15">B</text>
  <line x1="50" y1="110" x2="80" y2="110" stroke="#94a3b8" stroke-width="2.5"/>
  <!-- NOT gate 2 -->
  <polygon points="80,95 120,110 80,125" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  <circle cx="125" cy="110" r="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
  <line x1="130" y1="110" x2="200" y2="110" stroke="#94a3b8" stroke-width="2.5"/>

  <!-- NAND gate -->
  <path d="M200 35 L230 35 Q270 80 230 125 L200 125 Z" fill="#1e293b" stroke="#a855f7" stroke-width="2.5"/>
  <circle cx="265" cy="80" r="5" fill="#0f172a" stroke="#a855f7" stroke-width="2"/>
  <line x1="270" y1="80" x2="330" y2="80" stroke="#94a3b8" stroke-width="2.5"/>
  <text x="345" y="85" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="16">Y</text>
</svg>`);

// Q185: Pedigree symbols
saveSvg('neet_2023_q185.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 140" width="100%" height="130">
  <rect width="380" height="140" fill="#0f172a" rx="16"/>
  <!-- Consanguineous Mating (Double line between relatives) -->
  <rect x="80" y="45" width="40" height="40" fill="#1e293b" stroke="#38bdf8" stroke-width="3" rx="4"/>
  <line x1="120" y1="60" x2="220" y2="60" stroke="#f59e0b" stroke-width="3.5"/>
  <line x1="120" y1="70" x2="220" y2="70" stroke="#f59e0b" stroke-width="3.5"/>
  <circle cx="240" cy="65" r="20" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
  <text x="190" y="115" fill="#94a3b8" font-family="sans-serif" font-size="12" text-anchor="middle">Mating between relatives (Consanguineous)</text>
</svg>`);

console.log("Vector SVGs generated successfully in backend and frontend!");
