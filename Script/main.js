/////Section 1: Shared Setup & Move Rule Tab/////
const variables = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
let timerInterval = null;
let score = 0;

function getRandomVar(exclude = []) {
  const filtered = variables.filter(v => !exclude.includes(v));
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function normalizeInput(str) {
  return str.toLowerCase().replace(/[*]/g, ' ').replace(/[^a-z0-9 ]/gi, '').trim().split(/\s+/).filter(Boolean).sort().join('');
}

function toggleSettingsPanel(headerElement) {
  const settingsBody = headerElement.nextElementSibling;
  if (settingsBody) settingsBody.classList.toggle("show");
}

// ✅ PROBLEM RENDERING LOGIC
function renderProblems(tabId, problemFn, timerId, scoreId, countId, containerId) {
  clearInterval(timerInterval);
  score = 0;

  const timerOn = document.getElementById(timerId).checked;
  const scoreOn = document.getElementById(scoreId).checked;
  const timerEl = document.getElementById(`timer-${tabId}`);
  const scoreEl = document.getElementById(`score-${tabId}`);
  const container = document.getElementById(containerId);

  let total = parseInt(document.getElementById(countId).value, 10) || 4;
  if (tabId === "main" && window.innerWidth <= 768) total = 1;

  container.innerHTML = "";
  timerEl.style.display = timerOn ? "block" : "none";
  scoreEl.style.display = scoreOn ? "block" : "none";
  scoreEl.textContent = `Score: 0 / ${total}`;

  if (timerOn) {
    let time = 0;
    timerEl.textContent = "Time: 0s";
    timerInterval = setInterval(() => {
      time++;
      timerEl.textContent = `Time: ${time}s`;
    }, 1000);
  }

  for (let i = 0; i < total; i++) {
    const problem = problemFn(scoreOn, total, scoreEl);
    container.appendChild(problem);
  }
}

function showAllAnswers(containerId) {
  const problems = document.querySelectorAll(`#${containerId} .problem`);
  problems.forEach(p => p.querySelector(".show-btn")?.click());
}

// ✅ MOVE RULE PROBLEM
function createMoveRuleProblem(scoreOn, total, scoreEl) {
  const solveFor = getRandomVar();
  const [ln1, ln2, ld1, ld2, rn1, rn2, rd1, rd2] = Array(8).fill(null).map(() => getRandomVar());
  const num = [rn1, rn2, ld1, ld2].filter(x => x !== solveFor);
  const den = [rd1, rd2, ln1, ln2].filter(x => x !== solveFor);
  const expectedNum = normalizeInput(num.join(" * "));
  const expectedDen = normalizeInput(den.join(" * "));

  const div = document.createElement("div");
  div.className = "problem";
  div.innerHTML = `
    <div><strong>Solve for ${solveFor}</strong></div>
    <div class="fraction-pair">
      <div class="fraction">
        <div class="numerator">${ln1} * ${ln2}</div>
        <div class="denominator">${ld1} * ${ld2}</div>
      </div>
      <div class="equal-sign">=</div>
      <div class="fraction">
        <div class="numerator">${rn1} * ${rn2}</div>
        <div class="denominator">${rd1} * ${rd2}</div>
      </div>
    </div>
    <div class="answer-input-wrapper">
      <div class="fraction-centered-wrapper">
        <span class="answer-label">${solveFor} =</span>
        <div class="fraction-input">
          <input class="numerator-input" placeholder="Top part">
          <div class="line"></div>
          <input class="denominator-input" placeholder="Bottom part">
        </div>
      </div>
    </div>
    <div class="button-wrapper">
      <button class="show-btn">Show Answer</button>
    </div>
    <div class="answer-box" style="display:none;">
      ${solveFor} = <div class="answer-fraction">
        <div class="numerator">${num.join(" * ")}</div>
        <div class="denominator">${den.join(" * ")}</div>
      </div>
    </div>
  `;

  const showBtn = div.querySelector(".show-btn");
  const numInput = div.querySelector(".numerator-input");
  const denInput = div.querySelector(".denominator-input");
  const answerBox = div.querySelector(".answer-box");

  function checkAnswer() {
    const correct = normalizeInput(numInput.value) === expectedNum && normalizeInput(denInput.value) === expectedDen;
    [numInput, denInput].forEach(i => {
      i.classList.remove("correct", "incorrect");
      i.classList.add(correct ? "correct" : "incorrect");
    });
    if (correct && scoreOn) {
      score++;
      scoreEl.textContent = `Score: ${score} / ${total}`;
    }
    answerBox.style.display = "block";
  }

  showBtn.addEventListener("click", checkAnswer);
  [numInput, denInput].forEach(i => i.addEventListener("keydown", e => e.key === "Enter" && checkAnswer()));

  return div;
}
/////Section 2: Geometry (Surface Area / Volume) Tab/////
// ✅ Generate and render complex 3D geometry problems
function generateShape(shape, mode) {
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const π = Math.PI;
  const useDiameter = Math.random() < 0.5;

  let svg = "", answer = 0, label = "", formula = "", dimensions = [];

  const centerWrapper = (inner, width = 200, height = 200) => `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      ${inner}
    </svg>
  `;

  if (shape === "square") {
    const s = rand(20, 60);
    answer = s * s;
    label = "Area";
    formula = "A = s²";
    dimensions = [`s = ${s}`];
    const offset = (200 - s) / 2;
    svg = centerWrapper(`<rect x="${offset}" y="${offset}" width="${s}" height="${s}" fill="none" stroke="white" stroke-width="2"/>`);
  }

  else if (shape === "rectangle") {
    const w = rand(40, 100), h = rand(30, 80);
    answer = w * h;
    label = "Area";
    formula = "A = w × h";
    dimensions = [`w = ${w}`, `h = ${h}`];
    const x = (200 - w) / 2, y = (200 - h) / 2;
    svg = centerWrapper(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="white" stroke-width="2"/>`);
  }

  else if (shape === "circle") {
    const r = rand(20, 40);
    const cx = 100, cy = 100;
    const d = r * 2;
    answer = π * r * r;
    label = "Area";
    formula = "A = πr²";
    dimensions = useDiameter ? [`d = ${d}`] : [`r = ${r}`];

    const diameterLine = useDiameter
      ? `<line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="yellow" stroke-dasharray="4" />`
      : `<line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="yellow" stroke-dasharray="4" />`;

    svg = centerWrapper(`
      <circle cx="${cx}" cy="${cy}" r="${r}" stroke="white" stroke-width="2" fill="none" />
      ${diameterLine}
    `);
  }

else if (shape === "cube") {
  const s = rand(30, 60);
  const f = 0.5 * s;
  const x = 60, y = 60;

  label = mode === "area" ? "Surface Area" : "Volume";
  formula = mode === "area" ? "A = 6s²" : "V = s³";
  answer = mode === "area" ? 6 * s * s : s * s * s;
  dimensions = [`s = ${s}`];

  const face = `
    <!-- Front face -->
    <rect x="${x}" y="${y}" width="${s}" height="${s}" fill="#444" stroke="white"/>
    <!-- Top face -->
    <polygon points="${x},${y} ${x + f},${y - f} ${x + s + f},${y - f} ${x + s},${y}" fill="#555" stroke="white"/>
    <!-- Side face -->
    <polygon points="${x + s},${y} ${x + s + f},${y - f} ${x + s + f},${y + s - f} ${x + s},${y + s}" fill="#666" stroke="white"/>
  `;

  const dottedLines = `
    <!-- Dotted back edges -->
    <line x1="${x + f}" y1="${y - f}" x2="${x + f}" y2="${y + s - f}" stroke="white" stroke-dasharray="4"/>
    <line x1="${x + f}" y1="${y + s - f}" x2="${x + s + f}" y2="${y + s - f}" stroke="white" stroke-dasharray="4"/>
    <line x1="${x + s + f}" y1="${y + s - f}" x2="${x + s}" y2="${y + s}" stroke="white" stroke-dasharray="4"/>
  `;

  svg = centerWrapper(face + dottedLines);
}


  else if (shape === "triangle") {
  const b = rand(40, 80), h = rand(40, 60);
  label = "Area";
  formula = "A = ½bh";
  answer = 0.5 * b * h;
  dimensions = [`b = ${b}`, `h = ${h}`];

  const x1 = 100 - b / 2;
  const x2 = 100 + b / 2;
  const y1 = 140;
  const yTop = y1 - h;

  const tri = `<polygon points="${x1},${y1} ${x2},${y1} 100,${yTop}" fill="none" stroke="white" />`;
  const hLine = `<line x1="100" y1="${yTop}" x2="100" y2="${y1}" stroke="yellow" stroke-dasharray="4"/>`;

  svg = centerWrapper(tri + hLine);
}

else if (shape === "rectangularPrism") {
  const w = rand(60, 100);  // wider
  const h = rand(60, 90);   // taller
  const d = rand(20, 30);   // shallower
  const f = 0.5 * d;
  const x = 50, y = 50;

  label = mode === "area" ? "Surface Area" : "Volume";
  formula = mode === "area" ? "A = 2(lw + lh + wh)" : "V = l × w × h";
  answer = mode === "area" ? 2 * (w * d + w * h + d * h) : w * d * h;
  dimensions = [`w = ${w}`, `d = ${d}`, `h = ${h}`];

  const front = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#444" stroke="white" />`;
  const top = `
    <polygon points="${x},${y} ${x + f},${y - f} ${x + w + f},${y - f} ${x + w},${y}"
             fill="#555" stroke="white"/>
  `;
  const side = `
    <polygon points="${x + w},${y} ${x + w + f},${y - f} ${x + w + f},${y + h - f} ${x + w},${y + h}"
             fill="#666" stroke="white"/>
  `;

  const dottedBack = `
    <line x1="${x + f}" y1="${y - f}" x2="${x + f}" y2="${y + h - f}" stroke="white" stroke-dasharray="4"/>
    <line x1="${x + f}" y1="${y + h - f}" x2="${x + w + f}" y2="${y + h - f}" stroke="white" stroke-dasharray="4"/>
    <line x1="${x + w + f}" y1="${y + h - f}" x2="${x + w}" y2="${y + h}" stroke="white" stroke-dasharray="4"/>
  `;

  svg = centerWrapper(front + top + side + dottedBack);
}

else if (shape === "cylinder") {
  const r = rand(20, 40);
  const h = rand(40, 80);
  const d = 2 * r;
  const cx = 100, cy = 70;
  label = mode === "area" ? "Surface Area" : "Volume";
  formula = mode === "area" ? "A = 2πr² + 2πrh" : "V = πr²h";
  answer = mode === "area" ? 2 * π * r * r + 2 * π * r * h : π * r * r * h;
  dimensions = useDiameter ? [`d = ${d}`, `h = ${h}`] : [`r = ${r}`, `h = ${h}`];

  const ellipseTop = `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.4}" fill="none" stroke="white" stroke-width="2"/>`;
  const ellipseBottom = `<ellipse cx="${cx}" cy="${cy + h}" rx="${r}" ry="${r * 0.4}" fill="none" stroke="white" stroke-width="2" stroke-dasharray="3"/>`;
  const sides = `
    <line x1="${cx - r}" y1="${cy}" x2="${cx - r}" y2="${cy + h}" stroke="white" />
    <line x1="${cx + r}" y1="${cy}" x2="${cx + r}" y2="${cy + h}" stroke="white" />
  `;
  const radiusLine = useDiameter
    ? `<line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="yellow" stroke-dasharray="4"/>`
    : `<line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="yellow" stroke-dasharray="4"/>`;

  svg = centerWrapper(ellipseTop + ellipseBottom + sides + radiusLine);
}

else if (shape === "sphere") {
  const r = rand(30, 50);
  const d = r * 2;
  const cx = 100, cy = 100;
  label = mode === "area" ? "Surface Area" : "Volume";
  formula = mode === "area" ? "A = 4πr²" : "V = ⁴⁄₃πr³";
  answer = mode === "area" ? 4 * π * r * r : (4 / 3) * π * r * r * r;
  dimensions = useDiameter ? [`d = ${d}`] : [`r = ${r}`];

  const ellipse = `
    <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.6}" stroke="white" stroke-width="2" fill="none" />
    <circle cx="${cx}" cy="${cy}" r="${r}" stroke="white" stroke-width="2" fill="none" opacity="0.2"/>
  `;
  const radLine = useDiameter
    ? `<line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="yellow" stroke-dasharray="4" />`
    : `<line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="yellow" stroke-dasharray="4" />`;

  svg = centerWrapper(ellipse + radLine);
}

else if (shape === "pyramid") {
  const b = rand(60, 100);      // base width
  const h = rand(60, 100);      // height
  const cx = 120;               // center x (was 100)
  const baseY = 170;            // lowered due to bigger viewbox
  const topY = baseY - h;

  label = mode === "area" ? "Surface Area" : "Volume";
  formula = mode === "area" ? "A = B + ½Pl" : "V = ⅓Bh";
  answer = mode === "area"
    ? (b * b) + (2 * b * Math.sqrt((b / 2) ** 2 + h ** 2))
    : (1 / 3) * (b * b) * h;
  dimensions = [`b = ${b}`, `h = ${h}`];

  const halfB = b / 2;
  const leftBase = cx - halfB;
  const rightBase = cx + halfB;

  const frontFace = `
    <polygon points="${leftBase},${baseY} ${rightBase},${baseY} ${cx},${topY}" fill="#444" stroke="white" />
  `;
  const leftFace = `
    <polygon points="${leftBase},${baseY} ${cx},${topY} ${cx - halfB * 0.5},${baseY}" fill="#555" stroke="white" />
  `;
  const rightFace = `
    <polygon points="${rightBase},${baseY} ${cx},${topY} ${cx + halfB * 0.5},${baseY}" fill="#666" stroke="white" />
  `;
  const dottedBackEdge = `
    <line x1="${cx}" y1="${topY}" x2="${cx}" y2="${baseY}" stroke="white" stroke-dasharray="4"/>
  `;

  svg = centerWrapper(frontFace + leftFace + rightFace + dottedBackEdge, 240, 240);
}

  else {
    svg = centerWrapper(`<text x="40" y="100" fill="red">Shape not built yet</text>`);
    label = "Unknown";
    formula = "-";
    dimensions = [];
    answer = 0;
  }

  return {
    svg,
    answer: parseFloat(answer.toFixed(2)),
    label,
    formula,
    dimensions
  };
}

// ✅ Build a geometry problem with interactive scoring
function createGeometryProblem(scoreOn, total, scoreEl) {
  const shapes = ["square", "rectangle", "circle", "triangle", "cube", "rectangularPrism", "cylinder", "sphere", "pyramid"];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const is3D = ["cube"].includes(shape);
  const mode = is3D ? (Math.random() < 0.5 ? "volume" : "area") : "area";

  const { svg, answer, label, formula, dimensions } = generateShape(shape, mode);

  const problem = document.createElement("div");
  problem.className = "problem";
  problem.innerHTML = `
    <div><strong>${label} of a ${shape.charAt(0).toUpperCase() + shape.slice(1)}</strong></div>
    <div class="shape-diagram centered">${svg}</div>
    <div class="dim-labels">${dimensions.map(d => `<div>${d}</div>`).join("")}</div>
    <div style="margin: 5px 0; font-size: 0.9rem; color: #5ee0ff;">Formula: ${formula}</div>
    <div class="answer-input-wrapper">
      <input type="number" class="user-answer" placeholder="Your answer">
      <button class="show-btn">Show Answer</button>
      <div class="answer-box" style="display:none;">Correct ${label}: ${answer}</div>
    </div>
  `;

  const input = problem.querySelector(".user-answer");
  const btn = problem.querySelector(".show-btn");
  const box = problem.querySelector(".answer-box");

  btn.addEventListener("click", () => {
    const val = parseFloat(input.value);
    const correct = Math.round(answer * 100) / 100;
    const isCorrect = Math.abs(val - correct) < 0.1;

    input.classList.remove("correct", "incorrect");
    input.classList.add(isCorrect ? "correct" : "incorrect");

    if (isCorrect && scoreOn) {
      score++;
      scoreEl.textContent = `Score: ${score} / ${total}`;
    }

    box.style.display = "block";
  });

  return problem;
}

// ✅ Called from HTML via onclick="renderGeometryTab()"
function renderGeometryTab() {
  renderProblems(
    "geometry",
    createGeometryProblem,
    "enable-timer-geometry",
    "enable-score-geometry",
    "problem-count-geometry",
    "geometry-problems"
  );
}

///// Section 3: Ohm’s Law Tab/////
function createOhmProblem(scoreOn, total, scoreEl) {
  const types = ["V", "I", "R", "P"];
  const solveFor = types[Math.floor(Math.random() * types.length)];

  let V = Math.floor(Math.random() * 20) + 5;
  let I = parseFloat((Math.random() * 5 + 0.5).toFixed(2));
  let R = parseFloat((V / I).toFixed(2));
  let P = parseFloat((V * I).toFixed(2));

  const label = (symbol, value, unit) =>
    solveFor === symbol ? `${symbol} = ?` : `${symbol} = ${value} ${unit}`;

  const voltageLabel = label("V", V.toFixed(2), "V");
  const currentLabel = label("I", I.toFixed(2), "A");
  const resistanceLabel = label("R", R.toFixed(2), "Ω");
  const powerLabel = label("P", P.toFixed(2), "W");

  const answer = {
    V: `${(I * R).toFixed(2)} V`,
    I: `${(V / R).toFixed(2)} A`,
    R: `${(V / I).toFixed(2)} Ω`,
    P: `${(V * I).toFixed(2)} W`
  }[solveFor];

  const svg = `
    <svg width="300" height="160" viewBox="0 0 300 160">
      <rect x="30" y="30" width="240" height="100" rx="15" ry="15" fill="none" stroke="white" stroke-width="2"/>
      <line x1="30" y1="80" x2="50" y2="80" stroke="white" stroke-width="2" />
      <line x1="50" y1="65" x2="50" y2="95" stroke="white" stroke-width="3" />
      <line x1="55" y1="70" x2="55" y2="90" stroke="white" stroke-width="1" />
      <path d="M230 55 l5 10 l-10 10 l10 10 l-10 10 l10 10 l-10 10 l10 10"
            stroke="lime" stroke-width="2" fill="none" />
      <text x="40" y="60" fill="white" font-size="13">${voltageLabel}</text>
      <text x="120" y="45" fill="deepskyblue" font-size="13">${currentLabel}</text>
      <text x="245" y="60" fill="lime" font-size="13">${resistanceLabel}</text>
      ${solveFor === "P" ? `<text x="120" y="145" fill="gold" font-size="13">${powerLabel}</text>` : ""}
    </svg>
  `;

  const problem = document.createElement("div");
  problem.className = "problem";
  problem.innerHTML = `
    <div class="shape-diagram centered">${svg}</div>
    <div class="dim-labels"><strong>Solve for ${solveFor}</strong></div>
    <div class="answer-input-wrapper">
      <input class="user-answer" placeholder="Your answer (unit optional)">
      <button class="show-btn">Show Answer</button>
      <div class="answer-box" style="display:none;">Correct ${solveFor}: ${answer}</div>
    </div>
  `;

  const input = problem.querySelector(".user-answer");
  const btn = problem.querySelector(".show-btn");
  const box = problem.querySelector(".answer-box");

  btn.addEventListener("click", () => {
    const raw = input.value.toLowerCase().replace(/[^0-9.]/g, "");
    const correct = parseFloat(answer);
    const isCorrect = Math.abs(parseFloat(raw) - correct) < 0.1;

    input.classList.remove("correct", "incorrect");
    input.classList.add(isCorrect ? "correct" : "incorrect");

    if (isCorrect && scoreOn) {
      score++;
      scoreEl.textContent = `Score: ${score} / ${total}`;
    }

    box.style.display = "block";
  });

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") btn.click();
  });

  return problem;
}
/////Section 4: Faraday’s Law Tab/////
const faradayMetals = [
  { name: "Nickel", valence: 2, constant: 18.7, mass: 58.69, notes: "Common corrosion protection" },
  { name: "Copper", valence: 2, constant: 15.7, mass: 63.55, notes: "Conductive, fast build-up" },
  { name: "Silver", valence: 1, constant: 19.3, mass: 107.87, notes: "Decorative, conductive" },
  { name: "Gold", valence: 1, constant: 20.0, mass: 196.97, notes: "Tarnish-proof, electronics" },
  { name: "Cobalt", valence: 2, constant: 20.7, mass: 58.93, notes: "Hard, durable finish" },
  { name: "Lead", valence: 2, constant: 10.5, mass: 207.2, notes: "Soft, protective" },
  { name: "Palladium", valence: 2, constant: 22.0, mass: 106.42, notes: "Electronics, anti-corrosive" },
  { name: "Chromium", valence: 6, constant: 40.0, mass: 51.996, notes: "Hard chrome, low efficiency" },
  { name: "Zinc", valence: 2, constant: 11.5, mass: 65.38, notes: "Rust protection" },
  { name: "Tin", valence: 2, constant: 12.0, mass: 118.71, notes: "Food-safe, solder-friendly" },
  { name: "Rhodium", valence: 3, constant: 24.0, mass: 102.91, notes: "Jewelry, brilliant finish" },
  { name: "Platinum", valence: 2, constant: 25.0, mass: 195.08, notes: "High-end electrical" },
  { name: "Cadmium", valence: 2, constant: 13.0, mass: 112.41, notes: "Aerospace use" },
  { name: "Iron", valence: 2, constant: 10.0, mass: 55.85, notes: "Rarely plated alone" }
];

function createFaradayProblem(scoreOn, total, scoreEl) {
  const metal = faradayMetals[Math.floor(Math.random() * faradayMetals.length)];
  const I = Math.floor(Math.random() * 91 + 10);
  const t = Math.floor(Math.random() * 5 + 1);
  const A = Math.floor(Math.random() * 6 + 1);
  const e = 1.0;
  const solveType = Math.random() < 0.2 ? "mass" : ["thickness", "ampHours", "area"][Math.floor(Math.random() * 3)];

  let question = "", answer = 0, formula = "";

  if (solveType === "mass") {
    const tSec = t * 3600;
    answer = (I * tSec * metal.mass) / (metal.valence * 96485);
    question = `
      <div style="text-align:center;"><strong>Metal: ${metal.name}</strong></div>
      <div style="margin-top:8px;">I = ${I} A t = ${t} hr M = ${metal.mass} g/mol n = ${metal.valence}</div>
      <div><strong>Solve for mass (g)</strong></div>
      <div class="formula">m = (I × t × M) / (n × F)</div>
    `;
  } else {
    const T = Math.random() * 5 + 0.5;
    switch (solveType) {
      case "thickness":
        answer = (I * t * e) / (metal.constant * A);
        formula = `T = (I × t × e) / (F × A)`;
        question = `
          <div style="text-align:center;"><strong>Metal: ${metal.name}</strong></div>
          <div style="margin-top:8px;">I = ${I} A t = ${t} hr e = ${e} A = ${A} ft² T = ?</div>
          <div class="formula">${formula}</div>
          <div><strong>Solve for thickness (mils)</strong></div>
        `;
        break;
      case "ampHours":
        answer = (T * metal.constant * A) / (e * t);
        formula = `I = (T × F × A) / (e × t)`;
        question = `
          <div style="text-align:center;"><strong>Metal: ${metal.name}</strong></div>
          <div style="margin-top:8px;">T = ${T.toFixed(2)} mils t = ${t} hr e = ${e} A = ${A} ft² I = ?</div>
          <div class="formula">${formula}</div>
          <div><strong>Solve for current (amps)</strong></div>
        `;
        break;
      case "area":
        answer = (I * t * e) / (metal.constant * T);
        formula = `A = (I × t × e) / (F × T)`;
        question = `
          <div style="text-align:center;"><strong>Metal: ${metal.name}</strong></div>
          <div style="margin-top:8px;">I = ${I} A t = ${t} hr e = ${e} T = ${T.toFixed(2)} mils A = ?</div>
          <div class="formula">${formula}</div>
          <div><strong>Solve for area (ft²)</strong></div>
        `;
        break;
    }
  }

  const problem = document.createElement("div");
  problem.className = "problem";
  problem.innerHTML = `
    ${question}
    <div class="answer-input-wrapper">
      <input type="number" class="user-answer" placeholder="Your answer">
      <button class="show-btn">Show Answer</button>
      <div class="answer-box" style="display:none;">Correct Answer: ${answer.toFixed(2)}</div>
    </div>
  `;

  const btn = problem.querySelector(".show-btn");
  const input = problem.querySelector(".user-answer");
  const box = problem.querySelector(".answer-box");

  btn.addEventListener("click", () => {
    const userVal = parseFloat(input.value);
    const isCorrect = Math.abs(userVal - answer) < 0.05;

    input.classList.remove("correct", "incorrect");
    input.classList.add(isCorrect ? "correct" : "incorrect");

    if (isCorrect && scoreOn) {
      score++;
      scoreEl.textContent = `Score: ${score} / ${total}`;
    }

    box.style.display = "block";
  });

  return problem;
}
/////Section 5: Quizzes Tab Logic/////
const quizScoreHistory = {
  quiz2: []
};

function renderQuiz2() {
  const questions = [
    { q: "Molecules are made of a combination of", a: "atoms", options: ["electrons", "protons", "neutrons", "atoms"] },
    { q: "The lightest of the three basic parts of an atom is the", a: "electron", options: ["electron", "proton", "neutrons", "none of the above"] },
    { q: "True or False: An unfilled vacancy in the electron structure of an atom makes it non-reactive.", a: "False", options: ["True", "False"] },
    { q: "When nickel atoms are converted to ions in a chemical reaction, they always change to a valence of:", a: "none of the above", options: ["-2", "+3", "+6", "none of the above"] },
    { q: "An electroplating cell converts metal ions to the atomic state by:", a: "returning electrons lost when the metal became an ion", options: ["diffusion", "returning electrons lost when the metal became an ion", "subtraction electrons from the atomic structure", "none of the above"] },
    { q: "Current density is calculated by dividing the current by:", a: "the surface area", options: ["2", "3", "the surface area", "none of the above"] },
    { q: "If the current density on a plated part is too high the plated deposit might show:", a: "a 'burned' finish", options: ["a 'burned' finish", "a bright finish", "a smooth finish", "none of the above"] },
    { q: "Using 18.7 for the Faraday factor, calculate the plating time required to deposit 1 mil when plating at 50 amperes per square foot. Assume 100% current efficiency. (Answer in hours)", a: "0.374", input: true },
    { q: "True or False: Tank anodes should be longer than the longest part in the plating tank.", a: "False", options: ["True", "False"] },
    { q: "Anode baskets:", a: "All of the above", options: ["Maintain a constant anode surface area", "Need to remain full at all times", "Assure the correct anode current density", "All of the above"] },
  ];

  const container = document.getElementById("quizzes-problems");
  container.innerHTML = "";
  const quizWrapper = document.createElement("div");
  quizWrapper.className = "quiz-wrapper";
  container.appendChild(quizWrapper);

  questions.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "problem";
    div.innerHTML = `
      <div class="question"><strong>${i + 1}. ${q.q}</strong></div>
      <div class="answer-input-wrapper">
        ${q.input
          ? `<input type="text" data-answer="${q.a}" class="user-answer" placeholder="Your answer">`
          : q.options.map(opt => `
              <label>
                <input type="radio" name="q${i}" value="${opt}" data-answer="${q.a}">
                ${opt}
              </label>
            `).join("<br>")}
      </div>
    `;
    quizWrapper.appendChild(div);
  });

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Submit Quiz";
  submitBtn.className = "glow-btn";
  submitBtn.style.marginTop = "30px";

  submitBtn.addEventListener("click", () => {
    const problems = document.querySelectorAll("#quizzes-problems .problem");
    let score = 0;

    problems.forEach(problem => {
      let isCorrect = false;
      const input = problem.querySelector("input[type='text']");

      if (input) {
        const correct = input.dataset.answer;
        const val = input.value.trim();
        isCorrect = Math.abs(parseFloat(val) - parseFloat(correct)) < 0.01;
        input.classList.remove("correct", "incorrect");
        input.classList.add(isCorrect ? "correct" : "incorrect");
      } else {
        const selected = problem.querySelector("input[type='radio']:checked");
        const correct = selected?.dataset.answer;
        const all = problem.querySelectorAll("input[type='radio']");
        all.forEach(radio => {
          radio.classList.remove("correct", "incorrect");
          if (radio.checked) {
            isCorrect = radio.value === correct;
            radio.classList.add(isCorrect ? "correct" : "incorrect");
          }
        });
      }

      if (isCorrect) score++;
      problem.classList.remove("correct", "incorrect");
      problem.classList.add(isCorrect ? "correct" : "incorrect");
    });

    const percent = Math.round((score / questions.length) * 100);
    document.getElementById("quiz-score-display").textContent = `Score: ${score}/${questions.length} (${percent}%)`;
    quizScoreHistory.quiz2.unshift({ score, outOf: questions.length, percent });
    if (quizScoreHistory.quiz2.length > 10) quizScoreHistory.quiz2.pop();
  });

  quizWrapper.appendChild(submitBtn);
}
/////Section 6: Tools Tab Logic/////
// ✅ Unit Converter
const conversionTypeSelect = document.getElementById("conversion-type");
const inputUnit = document.getElementById("input-unit");
const outputUnit = document.getElementById("output-unit");
const inputValue = document.getElementById("input-value");
const outputValue = document.getElementById("output-value");

const unitConversions = {
  length: {
    "in": { "cm": 2.54, "ft": 1 / 12 },
    "cm": { "in": 1 / 2.54, "m": 0.01 },
    "ft": { "in": 12, "m": 0.3048 },
    "m": { "ft": 3.281, "cm": 100 }
  },
  mass: {
    "lb": { "kg": 0.4536, "oz": 16 },
    "kg": { "lb": 2.2046, "g": 1000 },
    "oz": { "g": 28.3495, "lb": 1 / 16 },
    "g": { "oz": 1 / 28.3495, "kg": 0.001 }
  },
  temperature: {
    "C": "F",
    "F": "C"
  }
};

function populateUnitOptions(type) {
  inputUnit.innerHTML = "";
  outputUnit.innerHTML = "";

  if (type === "temperature") {
    inputUnit.innerHTML = `<option value="C">Celsius</option><option value="F">Fahrenheit</option>`;
    outputUnit.innerHTML = inputUnit.innerHTML;
  } else {
    const units = Object.keys(unitConversions[type]);
    units.forEach(u => {
      inputUnit.innerHTML += `<option value="${u}">${u}</option>`;
      outputUnit.innerHTML += `<option value="${u}">${u}</option>`;
    });
  }
}

function convertValue() {
  const type = conversionTypeSelect.value;
  const from = inputUnit.value;
  const to = outputUnit.value;
  const val = parseFloat(inputValue.value);

  if (isNaN(val)) {
    outputValue.value = "";
    return;
  }

  if (type === "temperature") {
    if (from === "C" && to === "F") {
      outputValue.value = ((val * 9 / 5) + 32).toFixed(2);
    } else if (from === "F" && to === "C") {
      outputValue.value = ((val - 32) * 5 / 9).toFixed(2);
    } else {
      outputValue.value = val;
    }
  } else {
    if (from === to) {
      outputValue.value = val;
    } else {
      const conversion = unitConversions[type][from]?.[to];
      outputValue.value = conversion ? (val * conversion).toFixed(4) : "N/A";
    }
  }

}

conversionTypeSelect.addEventListener("change", () => populateUnitOptions(conversionTypeSelect.value));
inputValue.addEventListener("input", convertValue);
inputUnit.addEventListener("change", convertValue);
outputUnit.addEventListener("change", convertValue);

// ✅ Metal Chart (reuses faradayMetals array)
function buildMetalChart() {
  const chart = document.getElementById("metal-chart");
  chart.innerHTML = "";

  const dropdown = document.createElement("select");
  dropdown.className = "metal-selector";
  dropdown.innerHTML = faradayMetals.map(m =>
    `<option value="${m.name}">${m.name}</option>`).join("");

  const infoBox = document.createElement("div");
  const chartBox = document.createElement("div");
  chartBox.className = "chart-box";
  chartBox.innerHTML = ""; // or remove that line entirely
  chartBox.appendChild(dropdown);
  chartBox.appendChild(infoBox);
  chart.appendChild(chartBox);

  const showTableBtn = document.createElement("button");
  showTableBtn.textContent = "Show Periodic Table";
  showTableBtn.className = "periodic-table-btn";
  showTableBtn.addEventListener("click", () => {
    document.getElementById("periodic-overlay").style.display = "flex";
  });
  chartBox.appendChild(showTableBtn);

  function updateChart(selected) {
    const metal = faradayMetals.find(m => m.name === selected);
    infoBox.innerHTML = `
      <div><strong>Constant (F):</strong> ${metal.constant}</div>
      <div><strong>Valence:</strong> ${metal.valence}</div>
      <div><strong>Molar Mass:</strong> ${metal.mass} g/mol</div>
      <div><strong>Notes:</strong> ${metal.notes}</div>
    `;
  }

  dropdown.addEventListener("change", () => updateChart(dropdown.value));
  updateChart(dropdown.value);
}
///// Section 7: Periodic Table Overlay, Vimeo Controls & DOM Ready Hooks/////
// ✅ Periodic Table Zoom Overlay Logic
let zoomLevel = 1;

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("periodic-overlay");
  const closeBtn = document.querySelector(".close-overlay");
  const image = document.getElementById("periodic-image");

  closeBtn.addEventListener("click", () => {
    overlay.style.display = "none";
    zoomLevel = 1;
    image.style.transform = `scale(1)`;
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      overlay.style.display = "none";
      zoomLevel = 1;
      image.style.transform = `scale(1)`;
    }
  });

  overlay.addEventListener("wheel", (e) => {
    e.preventDefault();
    zoomLevel += e.deltaY < 0 ? 0.1 : -0.1;
    zoomLevel = Math.max(0.5, Math.min(zoomLevel, 5));
    image.style.transform = `scale(${zoomLevel})`;
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById("vimeo-player");
  if (!iframe) return;

  const player = new Vimeo.Player(iframe);

  const videoSelect = document.getElementById("video-select");
  const playBtn = document.getElementById("play-pause");
  const seekBar = document.getElementById("seek-bar");
  const muteBtn = document.getElementById("mute-btn");
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const pipBtn = document.getElementById("pip-btn");
  const currentTimeText = document.getElementById("current-time");
  const blocker = document.querySelector(".video-blocker");

  player.on("loaded", () => blocker.style.display = "none");

  player.on("play", () => {
    blocker.style.display = "none";
    playBtn.textContent = "⏸️";
  });

  player.on("pause", () => playBtn.textContent = "▶️");

  player.on("timeupdate", ({ seconds, duration }) => {
    seekBar.value = (seconds / duration) * 100;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    currentTimeText.textContent = `${mins}:${secs}`;
  });

  playBtn.addEventListener("click", () => {
    player.getPaused().then(paused => paused ? player.play() : player.pause());
  });

  muteBtn.addEventListener("click", () => {
    player.getVolume().then(vol => {
      player.setVolume(vol > 0 ? 0 : 1);
      muteBtn.textContent = vol > 0 ? "🔇" : "🔈";
    });
  });

  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) iframe.requestFullscreen();
    else document.exitFullscreen();
  });

  pipBtn.addEventListener("click", async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await iframe.requestPictureInPicture();
      }
    } catch {
      alert("Your browser doesn't support Picture-in-Picture for iframes.");
    }
  });

  seekBar.addEventListener("input", () => {
    player.getDuration().then(duration => {
      const newTime = (seekBar.value / 100) * duration;
      player.setCurrentTime(newTime);
    });
  });

  videoSelect.addEventListener("change", () => {
    const videoId = videoSelect.value;
    if (videoId) {
      blocker.style.display = "block";
      player.loadVideo(videoId).catch(err => console.error("Video load error:", err));
    }
  });
});



/////Event Listeners *ON BOTTOM*/////
document.addEventListener("DOMContentLoaded", () => {
  const mobileToggle = document.getElementById("mobileToggle");
  const topTabs = document.querySelector(".top-tabs");
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabWrappers = {
    main: document.getElementById("main-tab-wrapper"),
    geometry: document.getElementById("geometry-tab-wrapper"),
    ohm: document.getElementById("ohm-tab-wrapper"),
    faraday: document.getElementById("faraday-tab-wrapper"),
    quizzes: document.getElementById("quizzes-tab-wrapper"),
    videos: document.getElementById("videos-tab-wrapper"),
    tools: document.getElementById("tools-tab-wrapper")
  };

  buildMetalChart();


  // ☰ Toggle logic (works on all screens now)
  if (mobileToggle && topTabs) {
    mobileToggle.addEventListener("click", () => {
      topTabs.classList.toggle("mobile-tabs-shown");
      mobileToggle.classList.toggle("active");
    });
  }

    // Tool tab button (🧰)
  document.getElementById("tools-tab-button")?.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    Object.values(tabWrappers).forEach(w => w.classList.remove("active"));
    document.getElementById("tools-tab-wrapper")?.classList.add("active");
  });

  // Tab switching logic
  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");
      if (targetTab && tabWrappers[targetTab]) {
        Object.values(tabWrappers).forEach(wrapper => wrapper.classList.remove("active"));
        tabWrappers[targetTab].classList.add("active");
        tabButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        // Close sidebar after selecting a tab
        topTabs.classList.remove("mobile-tabs-shown");
        mobileToggle.classList.remove("active");
      }
    });
  });

  // ✅ Make draggable
  makeDraggable("tool-convert", "convert-drag-handle");
  makeDraggable("tool-metal", "metal-drag-handle");
});

function makeDraggable(panelId, handleId) {
  const panel = document.getElementById(panelId);
  const handle = document.getElementById(handleId);

  let offsetX = 0, offsetY = 0, isDragging = false;

  handle.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
    panel.style.position = "absolute";
    panel.style.zIndex = 9999;
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      panel.style.left = `${e.clientX - offsetX}px`;
      panel.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    document.body.style.userSelect = "";
  });
}

  // Tool dropdown: switch tool panel
document.getElementById("toggle-metal")?.addEventListener("click", () => {
  const panel = document.getElementById("tool-metal");
  panel.style.display = panel.style.display === "block" ? "none" : "block";
});

document.getElementById("toggle-convert")?.addEventListener("click", () => {
  const panel = document.getElementById("tool-convert");
  panel.style.display = panel.style.display === "block" ? "none" : "block";
});

  // Render buttons
  document.querySelector("button[onclick='renderProblems()']")?.addEventListener("click", () => {
    renderProblems("main", createMoveRuleProblem, "enable-timer-main", "enable-score-main", "problem-count-main", "main-problems");
  });

  document.querySelector("button[onclick='renderGeometryTab()']")?.addEventListener("click", () => {
    renderProblems("geometry", createGeometryProblem, "enable-timer-geometry", "enable-score-geometry", "problem-count-geometry", "geometry-problems");
  });

  document.querySelector("button[onclick='renderOhmTab()']")?.addEventListener("click", () => {
    renderProblems("ohm", createOhmProblem, "enable-timer-ohm", "enable-score-ohm", "problem-count-ohm", "ohm-problems");
  });

  document.querySelector("button[onclick='renderFaradayTab()']")?.addEventListener("click", () => {
    renderProblems("faraday", createFaradayProblem, "enable-timer-faraday", "enable-score-faraday", "problem-count-faraday", "faraday-problems");
  });

  document.getElementById("quiz-select")?.addEventListener("change", function () {
    if (this.value === "quiz2") {
      renderQuiz2();
    } else {
      document.getElementById("quizzes-problems").innerHTML = "";
      document.getElementById("quiz-score-bar")?.style.setProperty("display", "none");
    }
  });








