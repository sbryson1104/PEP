// ✅ Shared Variables
const variables = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
let timerInterval = null;
let score = 0;

// ✅ Utility Functions
function getRandomVar(exclude = []) {
  return variables.filter(v => !exclude.includes(v))[Math.floor(Math.random() * (variables.length - exclude.length))];
}

function normalizeInput(str) {
  return str
    .toLowerCase()
    .replace(/[*]/g, ' ')
    .replace(/[^a-z0-9 ]/gi, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .sort()
    .join('');
}

function toggleSettingsPanel(headerElement) {
  const settingsContainer = headerElement.parentElement;
  const settingsBody = settingsContainer.querySelector('.settings-body');
  console.log("TOGGLING:", settingsBody); // Check if this is null or correct
  if (settingsBody) {
    settingsBody.classList.toggle('show');
  }
}

//////////////////////////
////// MoveRule TAB //////
//////////////////////////
function renderProblems() {
  clearInterval(timerInterval);
  score = 0;

  const timerOn = document.getElementById("enable-timer-main").checked;
  const scoreOn = document.getElementById("enable-score-main").checked;
  const timerEl = document.getElementById("timer-main");
  const scoreEl = document.getElementById("score-main");
  let total = 1;
if (window.innerWidth > 768) {
  total = parseInt(document.getElementById("problem-count-main").value) || 4;
}
  const container = document.getElementById("main-problems");

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
    const solveFor = getRandomVar();
    const leftNum = [getRandomVar(), getRandomVar()];
    const leftDen = [getRandomVar(), getRandomVar()];
    const rightNum = [getRandomVar(), getRandomVar()];
    const rightDen = [getRandomVar(), getRandomVar()];

    const num = [...rightNum, ...leftDen].filter(x => x !== solveFor);
    const den = [...rightDen, ...leftNum].filter(x => x !== solveFor);

    const expectedNum = normalizeInput(num.join(" * "));
    const expectedDen = normalizeInput(den.join(" * "));

    const div = document.createElement("div");
    div.className = "problem";
    div.innerHTML = `
      <div><strong>Solve for ${solveFor}</strong></div>
      <div style="display:flex; justify-content:center;">
        <div class="fraction">
          <div class="numerator">${leftNum.join(" * ")}</div>
          <div class="denominator">${leftDen.join(" * ")}</div>
        </div>
        <div class="equal-sign">=</div>
        <div class="fraction">
          <div class="numerator">${rightNum.join(" * ")}</div>
          <div class="denominator">${rightDen.join(" * ")}</div>
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
        <div style='display:flex; align-items:center;'>
          ${solveFor} = 
          <div class="answer-fraction">
            <div class="numerator">${num.join(" * ")}</div>
            <div class="denominator">${den.join(" * ")}</div>
          </div>
        </div>
      </div>
    `;

    const showBtn = div.querySelector(".show-btn");
    const numInput = div.querySelector(".numerator-input");
    const denInput = div.querySelector(".denominator-input");
    const answerBox = div.querySelector(".answer-box");

    const check = () => {
      const isCorrect =
        normalizeInput(numInput.value) === expectedNum &&
        normalizeInput(denInput.value) === expectedDen;

      [numInput, denInput].forEach(input => {
        input.classList.remove("correct", "incorrect");
        input.classList.add(isCorrect ? "correct" : "incorrect");
      });

      if (isCorrect && scoreOn) {
        score++;
        scoreEl.textContent = `Score: ${score} / ${total}`;
      }

      answerBox.style.display = "block";
    };

    showBtn.addEventListener("click", check);
    [numInput, denInput].forEach(input => input.addEventListener("keydown", e => {
      if (e.key === "Enter") check();
    }));

    container.appendChild(div);
  }
}

function showAllAnswers() {
  const problems = document.querySelectorAll("#main-problems .problem");
  problems.forEach(problem => {
    const btn = problem.querySelector(".show-btn");
    if (btn) btn.click();
  });
}


////////////////////////////////
////// Surface/Volume TAB //////
////////////////////////////////
function renderGeometryTab() {
  clearInterval(timerInterval);
  score = 0;

  const timerOn = document.getElementById("enable-timer-geometry").checked;
  const scoreOn = document.getElementById("enable-score-geometry").checked;
  const timerEl = document.getElementById("timer-geometry");
  const scoreEl = document.getElementById("score-geometry");
  const total = parseInt(document.getElementById("problem-count-geometry").value) || 4;
  const container = document.getElementById("geometry-problems");

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

  const shapes = ["square", "rectangle", "circle", "triangle", "cube", "rectangularPrism", "cylinder", "sphere", "pyramid"];

  for (let i = 0; i < total; i++) {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const is3D = ["cube", "rectangularPrism", "cylinder", "sphere", "pyramid"].includes(shape);
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

    container.appendChild(problem);
  }
}

// ✅ Updated generateShape Function
function generateShape(shape, type) {
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const scaleRadius = (r) => Math.max(r * 8, 48); // 48px radius = 1 inch diameter
  const π = Math.PI;
  let svg = "", answer = 0, label = type === "area" ? "Surface Area" : "Volume";
  let formulaText = "", dims = [], unit = "in";
  const useDiameter = Math.random() < 0.5;

  const centerWrapper = (inner) => `<div style="display:flex;justify-content:center">${inner}</div>`;

  if (shape === "cube") {
    const s = rand(2, 6);
    answer = type === "area" ? 6 * s * s : s ** 3;
    formulaText = type === "area" ? `6 × ${s}²` : `${s}³`;
    dims = [`s = ${s} ${unit}`];

    svg = centerWrapper(`
      <svg width="140" height="140">
        <polygon points="30,30 90,30 110,50 50,50" stroke="cyan" fill="none" />
        <polygon points="30,30 30,90 50,110 50,50" stroke="cyan" fill="none" />
        <polygon points="90,30 90,90 110,110 110,50" stroke="cyan" fill="none" />
        <polygon points="30,90 90,90 110,110 50,110" stroke="cyan" fill="none" />
      </svg>`);
  }

  else if (shape === "rectangularPrism") {
    const l = rand(4, 8), w = rand(2, 6), h = rand(2, 6);
    answer = type === "area" ? 2 * (l * w + l * h + w * h) : l * w * h;
    formulaText = type === "area" ? `2(lw + lh + wh)` : `l × w × h`;
    dims = [`l = ${l} ${unit}`, `w = ${w} ${unit}`, `h = ${h} ${unit}`];

    svg = centerWrapper(`
      <svg width="160" height="140">
        <polygon points="30,40 30,90 80,90 80,40" stroke="cyan" fill="none"/>
        <polygon points="30,40 50,20 100,20 80,40" stroke="cyan" fill="none"/>
        <polygon points="80,40 80,90 100,70 100,20" stroke="cyan" fill="none"/>
      </svg>`);
  }

  else if (shape === "cylinder") {
    let r = rand(2, 5), h = rand(4, 10);
    let displayVal = r;
    if (useDiameter) {
      displayVal = r * 2;
      r = r / 2;
    }
    answer = type === "area" ? 2 * π * r * r + 2 * π * r * h : π * r * r * h;
    formulaText = type === "area" ? `2πr² + 2πrh` : `πr²h`;
    dims = [`${useDiameter ? "d" : "r"} = ${displayVal} ${unit}`, `h = ${h} ${unit}`];

    const radiusDraw = useDiameter ? displayVal / 2 : displayVal;
    svg = centerWrapper(`
      <svg width="160" height="160">
        <ellipse cx="80" cy="30" rx="${r * 8}" ry="10" stroke="cyan" fill="none"/>
        <ellipse cx="80" cy="${h * 10 + 30}" rx="${r * 8}" ry="10" stroke="cyan" fill="none"/>
        <line x1="${80 - r * 8}" y1="30" x2="${80 - r * 8}" y2="${h * 10 + 30}" stroke="cyan"/>
        <line x1="${80 + r * 8}" y1="30" x2="${80 + r * 8}" y2="${h * 10 + 30}" stroke="cyan"/>
    
        ${useDiameter
          ? `<line x1="${80 - r * 8}" y1="30" x2="${80 + r * 8}" y2="30" stroke="lime" stroke-dasharray="3"/>
             <text x="${80 + r * 8 + 5}" y="28" fill="white" font-size="10">d</text>`
          : `<line x1="80" y1="30" x2="${80 + r * 8}" y2="30" stroke="lime" stroke-dasharray="3"/>
             <text x="${80 + r * 8 + 5}" y="28" fill="white" font-size="10">r</text>`}
      </svg>
    `);
    
  }

  else if (shape === "sphere") {
    let r = rand(2, 6);
    let displayVal = r;
    if (useDiameter) {
      displayVal = r * 2;
      r = r / 2;
    }
    answer = type === "area" ? 4 * π * r * r : (4 / 3) * π * r ** 3;
    formulaText = type === "area" ? `4πr²` : `(4/3)πr³`;
    dims = [`${useDiameter ? "d" : "r"} = ${displayVal} ${unit}`];

    const scaledR = scaleRadius(r);

    svg = centerWrapper(`
      <svg width="160" height="160">
        <defs>
          <radialGradient id="grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="white" stop-opacity="0.2" />
            <stop offset="100%" stop-color="cyan" stop-opacity="0.05" />
          </radialGradient>
        </defs>
        <circle cx="80" cy="80" r="${scaledR}" stroke="cyan" fill="url(#grad)" />
        <ellipse cx="80" cy="80" rx="${scaledR}" ry="5" stroke="lightblue" fill="none" />
        ${useDiameter
          ? `<line x1="${80 - scaledR}" y1="80" x2="${80 + scaledR}" y2="80" stroke="lime" stroke-dasharray="3"/>
             <text x="${80 + scaledR + 4}" y="80" fill="white" font-size="10">d</text>`
          : `<line x1="80" y1="80" x2="${80 + scaledR}" y2="80" stroke="lime" stroke-dasharray="3"/>
             <text x="${80 + scaledR + 4}" y="80" fill="white" font-size="10">r</text>`}
      </svg>
    `);       
  }

  else if (shape === "pyramid") {
    const b = rand(3, 7), h = rand(3, 8);
    answer = (1 / 3) * b * b * h;
    formulaText = `(1/3) × b² × h`;
    dims = [`b = ${b} ${unit}`, `h = ${h} ${unit}`];

    svg = centerWrapper(`
      <svg width="180" height="160">
        <polygon points="90,30 40,120 140,120" stroke="cyan" fill="none" />
        <line x1="90" y1="30" x2="65" y2="90" stroke="cyan" />
        <line x1="90" y1="30" x2="115" y2="90" stroke="cyan" />
        <polygon points="65,90 115,90 140,120 40,120" stroke="cyan" fill="none" />
        <line x1="90" y1="30" x2="90" y2="120" stroke="lime" stroke-dasharray="3" />
        <text x="94" y="75" fill="white" font-size="10">h</text>
      </svg>
    `);
  }

  else if (shape === "triangle") {
    const b = rand(3, 10), h = rand(3, 10);
    answer = 0.5 * b * h;
    formulaText = `½ × b × h`;
    dims = [`b = ${b} ${unit}`, `h = ${h} ${unit}`];

    svg = centerWrapper(`
      <svg width="160" height="120">
        <polygon points="30,90 ${b * 10 + 30},90 ${b * 5 + 30},${90 - h * 6}" stroke="cyan" fill="none"/>
      </svg>`);
  }

  else if (shape === "rectangle") {
    const l = rand(5, 10), w = rand(3, l - 1);
    answer = l * w;
    formulaText = `l × w`;
    dims = [`l = ${l} ${unit}`, `w = ${w} ${unit}`];

    svg = centerWrapper(`
      <svg width="160" height="100">
        <rect x="10" y="10" width="${l * 10}" height="${w * 8}" stroke="cyan" fill="none"/>
      </svg>`);
  }

  else if (shape === "circle") {
    let r = rand(2, 8);
    let displayVal = r;
    if (useDiameter) {
      displayVal = r * 2;
      r = r / 2;
    }
    answer = π * r * r;
    formulaText = `πr²`;
    dims = [`${useDiameter ? "d" : "r"} = ${displayVal} ${unit}`];

    const scaledR = scaleRadius(r);

    svg = centerWrapper(`
      <svg width="160" height="120">
        <circle cx="80" cy="60" r="${scaledR}" stroke="cyan" fill="none"/>
        ${useDiameter
          ? `<line x1="${80 - scaledR}" y1="60" x2="${80 + scaledR}" y2="60" stroke="lime" stroke-dasharray="3"/>
             <text x="${80 + scaledR + 4}" y="60" fill="white" font-size="10">d</text>`
          : `<line x1="80" y1="60" x2="${80 + scaledR}" y2="60" stroke="lime" stroke-dasharray="3"/>
             <text x="${80 + scaledR + 4}" y="60" fill="white" font-size="10">r</text>`}
      </svg>
    `);    
  }

  else if (shape === "square") {
    const s = rand(2, 10);
    answer = s * s;
    formulaText = `s²`;
    dims = [`s = ${s} ${unit}`];

    svg = centerWrapper(`
      <svg width="140" height="140">
        <rect x="20" y="20" width="${s * 10}" height="${s * 10}" stroke="cyan" fill="none"/>
      </svg>`);
  }

  return {
    shape,
    mode: type,
    svg,
    answer: Math.round(answer * 100) / 100,
    label,
    formula: formulaText,
    dimensions: dims
  };
}

function showAllSurfaceAnswers() {
  const problems = document.querySelectorAll("#geometry-problems .problem");
  problems.forEach(problem => {
    const btn = problem.querySelector(".show-btn");
    if (btn) btn.click();
  });
}
//////////////////////
////// OHMS TAB //////
//////////////////////
function renderOhmTab() {
  clearInterval(timerInterval);
  score = 0;

  const timerOn = document.getElementById("enable-timer-ohm").checked;
  const scoreOn = document.getElementById("enable-score-ohm").checked;
  const timerEl = document.getElementById("timer-ohm");
  const scoreEl = document.getElementById("score-ohm");
  const total = parseInt(document.getElementById("problem-count-ohm").value) || 4;
  const container = document.getElementById("ohm-problems");

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

  const types = ["V", "I", "R", "P"];
  for (let i = 0; i < total; i++) {
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

    let answer = {
      V: `${(I * R).toFixed(2)} V`,
      I: `${(V / R).toFixed(2)} A`,
      R: `${(V / I).toFixed(2)} Ω`,
      P: `${(V * I).toFixed(2)} W`
    }[solveFor];

    const svg = `
      <svg width="300" height="160" viewBox="0 0 300 160">
        <!-- Circuit outline -->
        <rect x="30" y="30" width="240" height="100" rx="15" ry="15" fill="none" stroke="white" stroke-width="2"/>

        <!-- Battery -->
        <line x1="30" y1="80" x2="50" y2="80" stroke="white" stroke-width="2" />
        <line x1="50" y1="65" x2="50" y2="95" stroke="white" stroke-width="3" />
        <line x1="55" y1="70" x2="55" y2="90" stroke="white" stroke-width="1" />

        <!-- Resistor squiggle -->
        <path d="M230 55
                 l5 10 l-10 10 l10 10 l-10 10 l10 10 l-10 10
                 l10 10" 
              stroke="lime" stroke-width="2" fill="none" />

        <!-- Text labels -->
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

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") btn.click();
    });

    container.appendChild(problem);
  }
}

// 🔍 Show All Ohm Answers
function showAllOhmAnswers() {
  const problems = document.querySelectorAll("#ohm-problems .problem");
  problems.forEach(problem => {
    const btn = problem.querySelector(".show-btn");
    if (btn) btn.click();
  });
}

//////////////////////////////
////// Faradays law TAB //////
//////////////////////////////
function renderFaradayTab() {
  const container = document.getElementById("faraday-problems");
  container.innerHTML = "";

  clearInterval(timerInterval);
  score = 0;

  const count = parseInt(document.getElementById("problem-count-faraday").value, 10) || 4;

  const timerOn = document.getElementById("enable-timer-faraday").checked;
  const scoreOn = document.getElementById("enable-score-faraday").checked;
  const timerEl = document.getElementById("timer-faraday");
  const scoreEl = document.getElementById("score-faraday");

  timerEl.style.display = timerOn ? "block" : "none";
  scoreEl.style.display = scoreOn ? "block" : "none";
  scoreEl.textContent = `Score: 0 / ${count}`;

  if (timerOn) {
    let time = 0;
    timerEl.textContent = "Time: 0s";
    timerInterval = setInterval(() => {
      time++;
      timerEl.textContent = `Time: ${time}s`;
    }, 1000);
  }

  for (let i = 0; i < count; i++) {
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
      if (solveType === "thickness") {
        answer = (I * t * e) / (metal.constant * A);
        formula = `F = I·t·e / T·A = ?`;
        question = `
          <div style="text-align:center;"><strong>Metal: ${metal.name}</strong></div>
          <div style="margin-top:8px;">I = ${I} A t = ${t} hr e = ${e} A = ${A} ft² T = ?</div>
          <div class="formula">${formula}</div>
          <div><strong>Solve for thickness (mils)</strong></div>
        `;
      } else if (solveType === "ampHours") {
        const T = Math.random() * 5 + 0.5;
        answer = (T * metal.constant * A) / (e * t);
        formula = `F = I·t·e / T·A = ?`;
        question = `
          <div style="text-align:center;"><strong>Metal: ${metal.name}</strong></div>
          <div style="margin-top:8px;">T = ${T.toFixed(2)} mils t = ${t} hr e = ${e} A = ${A} ft² I = ?</div>
          <div class="formula">${formula}</div>
          <div><strong>Solve for current (amps)</strong></div>
        `;
      } else if (solveType === "area") {
        const T = Math.random() * 5 + 0.5;
        answer = (I * t * e) / (metal.constant * T);
        formula = `F = I·t·e / T·A = ?`;
        question = `
          <div style="text-align:center;"><strong>Metal: ${metal.name}</strong></div>
          <div style="margin-top:8px;">I = ${I} A t = ${t} hr e = ${e} T = ${T.toFixed(2)} mils A = ?</div>
          <div class="formula">${formula}</div>
          <div><strong>Solve for area (ft²)</strong></div>
        `;
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
        scoreEl.textContent = `Score: ${score} / ${count}`;
      }

      box.style.display = "block";
    });

    container.appendChild(problem);
  }
}

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

function buildMetalChart() {
  const chart = document.getElementById("metal-chart");
  chart.innerHTML = "";

  const dropdown = document.createElement("select");
  dropdown.className = "metal-selector";
  dropdown.innerHTML = faradayMetals.map(m =>
    `<option value="${m.name}">${m.name}</option>`
  ).join("");

  const infoBox = document.createElement("div");
  const chartBox = document.createElement("div");
  chartBox.className = "chart-box";
  chartBox.innerHTML = `<label for="metal-dropdown">Select Metal:</label>`;
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

// Zoom state
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

const toggleBtn = document.getElementById("toggle-metal-content");
const chartWrapper = document.querySelector(".metal-chart-wrapper");

if (toggleBtn && chartWrapper) {
  toggleBtn.addEventListener("click", () => {
    const isVisible = chartWrapper.style.display === "block";
    chartWrapper.style.display = isVisible ? "none" : "block";
    toggleBtn.textContent = isVisible ? "🧪 Show Metal Content" : "✖️ Hide Metal Content";
  });
}

// ✅ VIMEO PLAYER LOGIC
document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById("vimeo-player");
  if (!iframe) return;

  const videoSelect = document.getElementById("video-select");
  const playBtn = document.getElementById("play-pause");
  const seekBar = document.getElementById("seek-bar");
  const muteBtn = document.getElementById("mute-btn");
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const pipBtn = document.getElementById("pip-btn");
  const currentTimeText = document.getElementById("current-time");
  const blocker = document.querySelector(".video-blocker");

  const player = new Vimeo.Player(iframe);

  player.on("loaded", () => {
    blocker.style.display = "none";
  });

  player.on("play", () => {
    blocker.style.display = "none";
    playBtn.textContent = "⏸️";
  });

  player.on("pause", () => {
    playBtn.textContent = "▶️";
  });

  player.on("timeupdate", ({ seconds, duration }) => {
    seekBar.value = (seconds / duration) * 100;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    currentTimeText.textContent = `${mins}:${secs}`;
  });

  playBtn.addEventListener("click", () => {
    player.getPaused().then(paused => {
      if (paused) {
        player.play();
      } else {
        player.pause();
      }
    });
  });

  muteBtn.addEventListener("click", () => {
    player.getVolume().then(vol => {
      if (vol > 0) {
        player.setVolume(0);
        muteBtn.textContent = "🔇";
      } else {
        player.setVolume(1);
        muteBtn.textContent = "🔈";
      }
    });
  });

  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      iframe.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  pipBtn.addEventListener("click", async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await iframe.requestPictureInPicture();
      }
    } catch (err) {
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
      player.loadVideo(videoId).catch(err => {
        console.error("Video load error:", err);
      });
    }
  });
});

// ✅ quiz logic

const quizScoreHistory = {
  quiz2: []
};

// Create score tracker UI
const scoreWrapper = document.createElement("div");
scoreWrapper.id = "quiz-score-bar";
scoreWrapper.style.cssText = `
  position: fixed;
  top: 0;
  right: 0;
  height: 50px;
  display: none;
  align-items: center;
  padding: 0 15px;
  gap: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: #a0d8ff;
  font-weight: bold;
  font-family: Orbitron, sans-serif;
  z-index: 2000;
`;
scoreWrapper.innerHTML = `
  <span id="quiz-score-display">Score: 0/0 (0%)</span>
`;
document.body.appendChild(scoreWrapper);

// Show/hide score bar based on top-level tab
const topTabButtons = document.querySelectorAll(".tab-button");
topTabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const isQuizzesTab = btn.dataset.tab === "quizzes";
    scoreWrapper.style.display = isQuizzesTab ? "flex" : "none";
  });
});

document.getElementById("quiz-select").addEventListener("change", function () {
  const selected = this.value;
  const quizWrapper = document.createElement("div");
  quizWrapper.className = "quiz-wrapper";
  const container = document.getElementById("quizzes-problems");
  container.innerHTML = "";
  container.appendChild(quizWrapper);

  // Show or hide score bar only for valid quiz selection
  scoreWrapper.style.display = selected === "quiz2" ? "flex" : "none";
  document.getElementById("quiz-score-display").textContent = "Score: 0/0 (0%)";

  if (selected === "quiz2") {
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
  } else {
    scoreWrapper.style.display = "none";
  }
});


























document.addEventListener("keydown", (e) => {
  const activeTab = document.querySelector(".tab-wrapper.active");
  if (!activeTab) return;

  const countInput = activeTab.querySelector("input[type='number']");
  const renderBtn = Array.from(activeTab.querySelectorAll("button")).find(btn =>
    btn.textContent.toLowerCase().includes("set problem")
  );

  if (!countInput || !renderBtn) return;

  let count = parseInt(countInput.value) || 1;

  if (e.key === "ArrowLeft") {
    count = Math.max(1, count - 1);
    countInput.value = count;
  } else if (e.key === "ArrowRight") {
    count = Math.min(15, count + 1);
    countInput.value = count;
  } else if (e.key === "F9") {
    renderBtn.click(); // Trigger the Set Problems button
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("count-btn")) {
    const wrapper = e.target.closest(".problem-count-wrapper");
    const input = wrapper.querySelector("input[type='number']");
    let value = parseInt(input.value) || 1;

    if (e.target.classList.contains("plus")) {
      value = Math.min(15, value + 1);
    } else if (e.target.classList.contains("minus")) {
      value = Math.max(1, value - 1);
    }

    input.value = value;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  buildMetalChart();

  const mobileToggle = document.getElementById("mobileToggle");
  const topTabs = document.querySelector(".top-tabs");

  if (mobileToggle && topTabs) {
    // Toggle menu open/closed when ☰ is clicked
    mobileToggle.addEventListener("click", () => {
      const isOpen = topTabs.classList.toggle("mobile-tabs-shown");
      mobileToggle.classList.toggle("active", isOpen);
    });

    // Close menu when any tab is clicked
    document.querySelectorAll(".tab-button").forEach(btn => {
      btn.addEventListener("click", () => {
        topTabs.classList.remove("mobile-tabs-shown");
        mobileToggle.classList.remove("active");
      });
    });
  }

  // Your existing tab switching logic
  const buttons = document.querySelectorAll(".tab-button");
  const tabWrappers = {
    main: document.getElementById("main-tab-wrapper"),
    geometry: document.getElementById("geometry-tab-wrapper"),
    ohm: document.getElementById("ohm-tab-wrapper"),
    faraday: document.getElementById("faraday-tab-wrapper"),
    videos: document.getElementById("videos-tab-wrapper"),
    quizzes: document.getElementById("quizzes-tab-wrapper") // ✅ include this if you added quizzes
  };

    // 🔬 Periodic Table overlay logic
    const openOverlayBtn = document.querySelector('.periodic-table-btn');
    const closeOverlayBtn = document.querySelector('.close-overlay');
    const overlay = document.getElementById('periodic-overlay');
  
    if (openOverlayBtn && closeOverlayBtn && overlay) {
      openOverlayBtn.addEventListener('click', () => {
        overlay.style.display = 'flex';
      });
  
      closeOverlayBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
      });
    }  

  const chartContainer = document.getElementById("chart-container");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab");

      Object.values(tabWrappers).forEach(w => w.classList.remove("active"));
      tabWrappers[tab].classList.add("active");

      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      chartContainer.style.display = tab === "faraday" ? "block" : "none";
      if (tab === "faraday") buildMetalChart();
    });
  });
});





