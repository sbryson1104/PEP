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

// ✅ Move Rule Problem Renderer
function renderProblems() {
  clearInterval(timerInterval);
  score = 0;

  const timerOn = document.getElementById("enable-timer-main").checked;
  const scoreOn = document.getElementById("enable-score-main").checked;
  const timerEl = document.getElementById("timer-main");
  const scoreEl = document.getElementById("score-main");
  const total = parseInt(document.getElementById("problem-count-main").value) || 4;
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


// 🔁 Continue with Part 2 (Surface Area / Volume + Event Hooks)?
// ✅ Surface Area / Volume Renderer
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


