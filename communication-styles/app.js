// ═══════════════════════════════════════════════════════════════════════════
// שאלון סגנונות תקשורת - Application Logic
// All Hebrew text loaded from content.json
// ═══════════════════════════════════════════════════════════════════════════

let content = null;
let currentIndex = 0;
let answers = [];

// Type configuration (IDs and question mappings only - text in content.json)
const typeIds = ["supportive", "analytical", "expressive", "driver"];

// DOM Elements
const introScreen = document.getElementById("intro");
const questionScreen = document.getElementById("question-screen");
const resultsScreen = document.getElementById("results");
const analysisScreen = document.getElementById("analysis");

const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const questionText = document.getElementById("question-text");

const answerYes = document.getElementById("answer-yes");
const answerNo = document.getElementById("answer-no");
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");
const startButton = document.getElementById("start");
const fillRandomButton = document.getElementById("fill-random");

const restartButton = document.getElementById("restart");
const backToQuestionsButton = document.getElementById("back-to-questions");
const toAnalysisButton = document.getElementById("to-analysis");
const copyResultsButton = document.getElementById("copy-results");
const backToResultsButton = document.getElementById("back-to-results");
const backToQuestionsAnalysisButton = document.getElementById("back-to-questions-analysis");

// ═══════════════════════════════════════════════════════════════════════════
// Initialization
// ═══════════════════════════════════════════════════════════════════════════

async function init() {
  try {
    const response = await fetch("./content.json");
    content = await response.json();
    answers = new Array(content.questions.length).fill(null);
    populateUI();
    setupEventListeners();
  } catch (error) {
    console.error("Failed to load content:", error);
  }
}

function populateUI() {
  // Intro screen
  document.getElementById("intro-instructions").textContent = content.intro.instructions;
  document.getElementById("intro-note").textContent = content.intro.note;

  // Button labels
  startButton.textContent = content.ui.start;
  fillRandomButton.textContent = content.ui.fillRandom;
  answerYes.textContent = content.ui.yes;
  answerNo.textContent = content.ui.no;
  restartButton.textContent = content.ui.restart;
  toAnalysisButton.textContent = content.ui.toAnalysis;
  copyResultsButton.textContent = content.ui.copyResults;

  // Results screen
  document.getElementById("results-title").textContent = content.results.title;
  document.getElementById("results-subtitle").textContent = content.results.chartTitle;
  document.getElementById("blend-note").textContent = content.results.blendNote;

  // Chart labels
  const chartLabels = document.getElementById("chart-labels");
  chartLabels.innerHTML = typeIds
    .map((id) => `<span>${content.types[id].shortTitle}</span>`)
    .join("");

  // Analysis screen
  document.getElementById("analysis-title").textContent = content.analysis.title;
  document.getElementById("analysis-subtitle").textContent = content.analysis.subtitle;
  document.querySelector(".minor-types__title").textContent = content.analysis.minorTypesTitle;
}

// ═══════════════════════════════════════════════════════════════════════════
// Screen Management
// ═══════════════════════════════════════════════════════════════════════════

function updateScreen(screen) {
  [introScreen, questionScreen, resultsScreen, analysisScreen].forEach((s) => {
    s.classList.toggle("screen--active", s === screen);
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// Question Flow
// ═══════════════════════════════════════════════════════════════════════════

function updateQuestion() {
  const question = content.questions[currentIndex];
  questionText.textContent = question.text;

  // Progress
  const progressTemplate = content.ui.questionOf
    .replace("{current}", question.id)
    .replace("{total}", content.questions.length);
  progressText.textContent = progressTemplate;
  const progress = ((currentIndex + 1) / content.questions.length) * 100;
  progressFill.style.width = `${progress}%`;

  // Navigation
  prevButton.disabled = false;
  if (currentIndex === 0) {
    prevButton.textContent = content.ui.backToIntro;
  } else {
    prevButton.textContent = content.ui.prev;
  }
  nextButton.textContent =
    currentIndex === content.questions.length - 1 ? content.ui.finish : content.ui.next;

  // Answer state
  updateAnswerButtons();
  nextButton.disabled = answers[currentIndex] === null;
}

function updateAnswerButtons() {
  const currentAnswer = answers[currentIndex];
  answerYes.classList.toggle("selected", currentAnswer === "yes");
  answerNo.classList.toggle("selected", currentAnswer === "no");
}

function setAnswer(value) {
  answers[currentIndex] = value;
  updateAnswerButtons();
  nextButton.disabled = false;
}

function fillRandomAnswers() {
  for (let i = 0; i < answers.length; i++) {
    answers[i] = Math.random() > 0.5 ? "yes" : "no";
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Scoring
// ═══════════════════════════════════════════════════════════════════════════

function getTypeScores() {
  const scores = {};
  typeIds.forEach((typeId) => {
    const type = content.types[typeId];
    const yesCount = type.questions.filter((qNum) => answers[qNum - 1] === "yes").length;
    scores[typeId] = yesCount;
  });
  return scores;
}

function getSortedTypes(scores) {
  return typeIds
    .map((typeId) => ({
      id: typeId,
      score: scores[typeId],
      ...content.types[typeId],
    }))
    .sort((a, b) => b.score - a.score);
}

// ═══════════════════════════════════════════════════════════════════════════
// Results Display
// ═══════════════════════════════════════════════════════════════════════════

function showResults() {
  const scores = getTypeScores();

  typeIds.forEach((typeId) => {
    const bar = document.getElementById(`bar-${typeId}`);
    const fill = bar.querySelector(".chart__fill");
    const scoreEl = bar.querySelector(".chart__score");

    const score = scores[typeId];
    const heightPercent = (score / 10) * 100;

    fill.style.height = `${heightPercent}%`;
    scoreEl.textContent = score;
  });
}

function showAnalysis() {
  const scores = getTypeScores();
  const sorted = getSortedTypes(scores);

  // Top 2 dominant types
  const dominantTypes = sorted.slice(0, 2);
  const dominantContainer = document.getElementById("dominant-types");
  dominantContainer.innerHTML = dominantTypes
    .map((type, index) => {
      const rank = index + 1;
      const traits = type.description.traits
        .map((trait) => `<li>${trait}</li>`)
        .join("");
      return `
        <div class="type-card type-card--rank-${rank}" style="border-color: ${type.color}">
          <div class="type-card__header">
            <div class="type-card__header-main">
              <span class="type-card__rank">${rank}</span>
              <span class="type-card__title" style="color: ${type.color}">${type.title}</span>
            </div>
            <span class="type-card__score" style="color: ${type.color}">${type.score}/10</span>
          </div>
          <p class="type-card__summary">${type.description.summary}</p>
          <h4>${content.analysis.characteristics}</h4>
          <ul class="type-card__traits">${traits}</ul>
        </div>
      `;
    })
    .join("");

  // Bottom 2 minor types
  const minorTypes = sorted.slice(2, 4);
  const minorContainer = document.getElementById("minor-types");
  minorContainer.innerHTML = minorTypes
    .map((type) => {
      return `
        <div class="minor-card">
          <span class="minor-card__title">${type.shortTitle}</span>
          <span class="minor-card__score">${type.score}/10</span>
        </div>
      `;
    })
    .join("");
}

// ═══════════════════════════════════════════════════════════════════════════
// Export Results
// ═══════════════════════════════════════════════════════════════════════════

function buildResultsMarkdown() {
  const scores = getTypeScores();
  const sorted = getSortedTypes(scores);

  const dominantTypes = sorted.slice(0, 2);
  const minorTypes = sorted.slice(2, 4);

  const lines = [
    "# תוצאות שאלון סגנונות תקשורת",
    "",
    "## ציונים לפי סגנון",
  ];

  // All scores
  sorted.forEach((type) => {
    lines.push(`- **${type.title}**: ${type.score}/10`);
  });

  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## הסגנונות הדומיננטיים שלך");

  // Top 2 with full details
  dominantTypes.forEach((type, index) => {
    lines.push("");
    lines.push(`### ${index + 1}. ${type.title} (${type.score}/10)`);
    lines.push("");
    lines.push(type.description.summary);
    lines.push("");
    lines.push("**מאפיינים עיקריים:**");
    type.description.traits.forEach((trait) => {
      lines.push(`- ${trait}`);
    });
  });

  // Bottom 2 as FYI
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## סגנונות משניים");
  minorTypes.forEach((type) => {
    lines.push(`- **${type.title}**: ${type.score}/10`);
  });

  return lines.join("\n");
}

async function copyResultsToClipboard() {
  const markdown = buildResultsMarkdown();
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(markdown);
      return;
    }
  } catch (error) {
    console.warn("Clipboard API failed, falling back to execCommand.", error);
  }
  const textarea = document.createElement("textarea");
  textarea.value = markdown;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

// ═══════════════════════════════════════════════════════════════════════════
// Event Listeners
// ═══════════════════════════════════════════════════════════════════════════

function setupEventListeners() {
  // Answer buttons
  answerYes.addEventListener("click", () => setAnswer("yes"));
  answerNo.addEventListener("click", () => setAnswer("no"));

  // Navigation
  nextButton.addEventListener("click", () => {
    if (currentIndex < content.questions.length - 1) {
      currentIndex += 1;
      updateQuestion();
      return;
    }
    showResults();
    updateScreen(resultsScreen);
  });

  prevButton.addEventListener("click", () => {
    if (currentIndex === 0) {
      updateScreen(introScreen);
    } else {
      currentIndex -= 1;
      updateQuestion();
    }
  });

  // Start
  startButton.addEventListener("click", () => {
    currentIndex = 0;
    updateQuestion();
    updateScreen(questionScreen);
  });

  // Debug fill
  fillRandomButton.addEventListener("click", () => {
    fillRandomAnswers();
    showResults();
    updateScreen(resultsScreen);
  });

  // Restart
  restartButton.addEventListener("click", () => {
    answers.fill(null);
    updateScreen(introScreen);
  });

  // Back to questions
  backToQuestionsButton.addEventListener("click", () => {
    updateQuestion();
    updateScreen(questionScreen);
  });

  backToQuestionsAnalysisButton.addEventListener("click", () => {
    updateQuestion();
    updateScreen(questionScreen);
  });

  // To analysis
  toAnalysisButton.addEventListener("click", () => {
    showAnalysis();
    updateScreen(analysisScreen);
  });

  // Back to results
  backToResultsButton.addEventListener("click", () => {
    showResults();
    updateScreen(resultsScreen);
  });

  // Copy results
  copyResultsButton.addEventListener("click", () => {
    copyResultsToClipboard();
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// Start
// ═══════════════════════════════════════════════════════════════════════════

init();
