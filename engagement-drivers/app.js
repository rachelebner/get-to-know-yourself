// ═══════════════════════════════════════════════════════════════════════════
// שאלון מנועי המחוברות - Application Logic
// All Hebrew text loaded from content.json
// ═══════════════════════════════════════════════════════════════════════════

let content = null;
let currentIndex = 0;
let answers = [];

// DOM Elements
const introScreen = document.getElementById("intro");
const questionScreen = document.getElementById("question-screen");
const resultsScreen = document.getElementById("results");

const introTitle = document.getElementById("intro-title");
const introInstructions = document.getElementById("intro-instructions");
const introScaleExplanation = document.getElementById("intro-scale-explanation");
const scaleLabels = document.getElementById("scale-labels");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const questionText = document.getElementById("question-text");
const scaleHint = document.getElementById("scale-hint");

const scoreInputs = Array.from(document.querySelectorAll("input[name='score']"));
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");
const startButton = document.getElementById("start");
const fillRandomButton = document.getElementById("fill-random");
const restartButton = document.getElementById("restart");
const backToQuestionsButton = document.getElementById("back-to-questions");
const copyResultsButton = document.getElementById("copy-results");

const resultsTitle = document.getElementById("results-title");
const resultsSubtitle = document.getElementById("results-subtitle");
const resultsGrid = document.getElementById("results-grid");
const resultsInterpretation = document.getElementById("results-interpretation");

// ═══════════════════════════════════════════════════════════════════════════
// Initialization
// ═══════════════════════════════════════════════════════════════════════════

const updateScreen = (screen) => {
  [introScreen, questionScreen, resultsScreen].forEach((section) => {
    section.classList.toggle("screen--active", section === screen);
  });
};

const initApp = async () => {
  try {
    const response = await fetch("./content.json");
    content = await response.json();
    answers = new Array(content.questions.length).fill(null);
    populateUI();
    setupEventListeners();
  } catch (error) {
    console.error("Failed to load content:", error);
  }
};

const populateUI = () => {
  // Intro screen
  introTitle.textContent = content.intro.title;
  introInstructions.textContent = content.intro.instructions;
  introScaleExplanation.textContent = content.intro.scaleExplanation;

  // Scale labels
  scaleLabels.innerHTML = Object.entries(content.intro.scaleLabels)
    .map(
      ([num, label]) => `
      <div class="scale-labels__item">
        <span>${label}</span>
        <span class="scale-labels__number">${num}</span>
      </div>
    `
    )
    .join("");

  // Button labels
  startButton.textContent = content.ui.start;
  fillRandomButton.textContent = content.ui.fillRandom;
  restartButton.textContent = content.ui.restart;
  copyResultsButton.textContent = content.ui.copyResults;

  // Results screen
  resultsTitle.textContent = content.results.title;
  resultsSubtitle.textContent = content.results.subtitle;
};

// ═══════════════════════════════════════════════════════════════════════════
// Question Flow
// ═══════════════════════════════════════════════════════════════════════════

const updateQuestion = () => {
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

  // Scale hint
  scaleHint.textContent = `1 = ${content.intro.scaleLabels["1"]}, 5 = ${content.intro.scaleLabels["5"]}`;

  // Answer state
  scoreInputs.forEach((input) => {
    input.checked = Number(input.value) === answers[currentIndex];
  });
  nextButton.disabled = answers[currentIndex] === null;
};

const setAnswer = (value) => {
  answers[currentIndex] = value;
  nextButton.disabled = false;
};

const fillRandomAnswers = () => {
  for (let i = 0; i < answers.length; i++) {
    answers[i] = Math.floor(Math.random() * 5) + 1;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// Scoring
// ═══════════════════════════════════════════════════════════════════════════

const getCategoryScores = () => {
  return content.categories.map((category) => {
    const categoryAnswers = category.questions.map((qId) => answers[qId - 1]);
    const sum = categoryAnswers.reduce((total, score) => total + (score || 0), 0);
    return {
      ...category,
      sum,
    };
  });
};

const getHighestDriver = (scores) => {
  const sorted = [...scores].sort((a, b) => b.sum - a.sum);
  const highest = sorted[0];
  const isTie = sorted[0].sum === sorted[1]?.sum;
  return { highest, isTie, sorted };
};

const allScoresBelow12 = (scores) => {
  return scores.every((category) => category.sum < 12);
};

// ═══════════════════════════════════════════════════════════════════════════
// Results Display
// ═══════════════════════════════════════════════════════════════════════════

const showResults = () => {
  const scores = getCategoryScores();
  const { highest, isTie, sorted } = getHighestDriver(scores);
  const allLow = allScoresBelow12(scores);

  // Clear previous results
  resultsGrid.innerHTML = "";
  resultsInterpretation.innerHTML = "";

  // Display scores
  scores.forEach((category) => {
    const isHighest = category.id === highest.id;
    const card = document.createElement("div");
    card.className = `result-card ${isHighest ? "result-card--highest" : ""}`;
    card.innerHTML = `
      <div class="result-card__title">${category.title}</div>
      <div class="result-card__score">${category.sum}</div>
      ${isHighest && !isTie ? '<span class="result-card__badge">מנוע המחוברות שלך</span>' : ""}
    `;
    resultsGrid.appendChild(card);
  });

  // Interpretation
  const interpretationDiv = document.createElement("div");
  interpretationDiv.className = "results-interpretation";

  if (allLow) {
    interpretationDiv.innerHTML = `
      <div class="results-interpretation__title">${content.results.lowScores}</div>
      <div class="results-interpretation__text">${content.results.lowScoresAction}</div>
      <div class="results-interpretation__text results-interpretation__text--highlight">${content.results.worthIt}</div>
    `;
  } else if (isTie) {
    const tiedCategories = sorted.filter((c) => c.sum === highest.sum).map((c) => c.title).join(", ");
    interpretationDiv.innerHTML = `
      <div class="results-interpretation__title">${content.results.multipleDrivers}</div>
      <div class="results-interpretation__text">המנועים שקיבלו את הציון הגבוה: ${tiedCategories}</div>
      <div class="results-interpretation__text">${content.results.highestDriverNote}</div>
      <div class="results-interpretation__text">${content.results.sharedResponsibility}</div>
      <div class="results-interpretation__text">${content.results.actionPlan}</div>
      <div class="results-interpretation__text results-interpretation__text--highlight">${content.results.worthIt}</div>
    `;
  } else {
    interpretationDiv.innerHTML = `
      <div class="results-interpretation__title">${content.results.highestDriver}</div>
      <div class="results-interpretation__text results-interpretation__text--highlight">${highest.title}</div>
      <div class="results-interpretation__text">${highest.description}</div>
      <div class="results-interpretation__text">${content.results.highestDriverNote}</div>
      <div class="results-interpretation__text">${content.results.sharedResponsibility}</div>
      <div class="results-interpretation__text">${content.results.actionPlan}</div>
      <div class="results-interpretation__text results-interpretation__text--highlight">${content.results.worthIt}</div>
    `;
  }

  resultsInterpretation.appendChild(interpretationDiv);
};

// ═══════════════════════════════════════════════════════════════════════════
// Export Results
// ═══════════════════════════════════════════════════════════════════════════

const buildResultsMarkdown = () => {
  const scores = getCategoryScores();
  const { highest, isTie, sorted } = getHighestDriver(scores);
  const allLow = allScoresBelow12(scores);

  const lines = [`# ${content.markdown.title}`, "", `## ${content.markdown.categoryScores}`];

  scores.forEach((category) => {
    lines.push(`- **${category.title}**: ${category.sum}`);
  });

  lines.push("");
  lines.push("---");
  lines.push("");

  if (allLow) {
    lines.push(`## ${content.results.lowScores}`);
    lines.push("");
    lines.push(content.results.lowScoresAction);
    lines.push("");
    lines.push(content.results.worthIt);
  } else if (isTie) {
    const tiedCategories = sorted.filter((c) => c.sum === highest.sum).map((c) => c.title).join(", ");
    lines.push(`## ${content.results.multipleDrivers}`);
    lines.push("");
    lines.push(`המנועים שקיבלו את הציון הגבוה: ${tiedCategories}`);
    lines.push("");
    lines.push(content.results.highestDriverNote);
    lines.push("");
    lines.push(content.results.sharedResponsibility);
    lines.push("");
    lines.push(content.results.actionPlan);
    lines.push("");
    lines.push(content.results.worthIt);
  } else {
    lines.push(`## ${content.markdown.yourDriver}`);
    lines.push("");
    lines.push(`**${highest.title}**`);
    lines.push("");
    lines.push(highest.description);
    lines.push("");
    lines.push(content.results.highestDriverNote);
    lines.push("");
    lines.push(content.results.sharedResponsibility);
    lines.push("");
    lines.push(content.results.actionPlan);
    lines.push("");
    lines.push(content.results.worthIt);
  }

  return lines.join("\n");
};

const copyResultsToClipboard = async () => {
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
};

// ═══════════════════════════════════════════════════════════════════════════
// Event Listeners
// ═══════════════════════════════════════════════════════════════════════════

const setupEventListeners = () => {
  // Score inputs
  scoreInputs.forEach((input) => {
    input.addEventListener("change", (event) => {
      setAnswer(Number(event.target.value));
    });
  });

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
    scoreInputs.forEach((input) => {
      input.checked = false;
    });
    updateScreen(introScreen);
  });

  // Back to questions
  backToQuestionsButton.addEventListener("click", () => {
    updateQuestion();
    updateScreen(questionScreen);
  });

  // Copy results
  copyResultsButton.addEventListener("click", () => {
    copyResultsToClipboard();
  });
};

// ═══════════════════════════════════════════════════════════════════════════
// Start
// ═══════════════════════════════════════════════════════════════════════════

initApp();
