// ═══════════════════════════════════════════════════════════════════════════
// שאלון ניהול מצבי - Situational Leadership Questionnaire
// Based on Hersey & Blanchard's Situational Leadership Theory
// ═══════════════════════════════════════════════════════════════════════════

// Content loaded from JSON
let CONTENT = null;

// ═══════════════════════════════════════════════════════════════════════════
// State
// ═══════════════════════════════════════════════════════════════════════════

let currentQuestion = 0;
let answers = {}; // { questionId: optionId }

// ═══════════════════════════════════════════════════════════════════════════
// DOM Elements
// ═══════════════════════════════════════════════════════════════════════════

const screens = {
  intro: document.getElementById("intro"),
  question: document.getElementById("question-screen"),
  results: document.getElementById("results"),
  analysis: document.getElementById("analysis"),
};

const elements = {
  progressText: document.getElementById("progress-text"),
  progressFill: document.getElementById("progress-fill"),
  scenario: document.getElementById("scenario"),
  options: document.getElementById("options"),
  prevBtn: document.getElementById("prev"),
  nextBtn: document.getElementById("next"),
  resultsGrid: document.getElementById("results-grid"),
  resultsInterpretation: document.getElementById("results-interpretation"),
  analysisContent: document.getElementById("analysis-content"),
};

// ═══════════════════════════════════════════════════════════════════════════
// Content Loading
// ═══════════════════════════════════════════════════════════════════════════

async function loadContent() {
  try {
    const response = await fetch("content.json");
    CONTENT = await response.json();
    initializeApp();
  } catch (error) {
    console.error("Failed to load content:", error);
  }
}

function initializeApp() {
  // Populate intro instructions
  const instructionsList = document.querySelector("#intro .steps");
  if (instructionsList && CONTENT.intro.instructions) {
    instructionsList.innerHTML = CONTENT.intro.instructions
      .map((instruction) => `<li>${instruction}</li>`)
      .join("");
  }

  // Set up event listeners
  setupEventListeners();
}

// ═══════════════════════════════════════════════════════════════════════════
// Screen Navigation
// ═══════════════════════════════════════════════════════════════════════════

function showScreen(screenId) {
  Object.values(screens).forEach((screen) => {
    screen.classList.remove("screen--active");
  });
  screens[screenId].classList.add("screen--active");
}

// ═══════════════════════════════════════════════════════════════════════════
// Question Display
// ═══════════════════════════════════════════════════════════════════════════

function renderQuestion() {
  const questions = CONTENT.questions;
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const progressText = CONTENT.ui.scenarioOf
    .replace("{current}", currentQuestion + 1)
    .replace("{total}", questions.length);
  elements.progressText.textContent = progressText;
  elements.progressFill.style.width = `${progress}%`;

  elements.scenario.textContent = question.scenario;

  elements.options.innerHTML = question.options
    .map((option) => {
      const isSelected = answers[question.id] === option.id;
      return `
        <div class="option ${isSelected ? "option--selected" : ""}" data-id="${option.id}">
          <span class="option__letter">${option.id}</span>
          <span class="option__text">${option.text}</span>
        </div>
      `;
    })
    .join("");

  // Add click handlers
  elements.options.querySelectorAll(".option").forEach((optionEl) => {
    optionEl.addEventListener("click", () => selectOption(optionEl.dataset.id));
  });

  updateNavigationButtons();
}

function selectOption(optionId) {
  const question = CONTENT.questions[currentQuestion];
  answers[question.id] = optionId;
  renderQuestion();
}

function updateNavigationButtons() {
  const questions = CONTENT.questions;
  const question = questions[currentQuestion];
  const hasAnswer = answers[question.id] !== undefined;

  elements.prevBtn.disabled = false;
  if (currentQuestion === 0) {
    elements.prevBtn.textContent = CONTENT.ui.backToIntro;
  } else {
    elements.prevBtn.textContent = CONTENT.ui.prev;
  }
  elements.nextBtn.disabled = !hasAnswer;
  elements.nextBtn.textContent =
    currentQuestion === questions.length - 1
      ? CONTENT.ui.toResults
      : CONTENT.ui.next;
}

// ═══════════════════════════════════════════════════════════════════════════
// Scoring
// ═══════════════════════════════════════════════════════════════════════════

function calculateResults() {
  const results = {
    directing: { count: 0, effectiveness: 0 },
    coaching: { count: 0, effectiveness: 0 },
    supporting: { count: 0, effectiveness: 0 },
    delegating: { count: 0, effectiveness: 0 },
  };

  CONTENT.questions.forEach((question) => {
    const answer = answers[question.id];
    if (answer) {
      const mapping = question.mapping[answer];
      results[mapping.style].count++;
      results[mapping.style].effectiveness += mapping.score;
    }
  });

  return results;
}

function getEffectivenessLabel(score) {
  const labels = CONTENT.results.effectivenessLabels;
  if (score >= 1) return { label: labels.effective, class: "effective" };
  if (score <= -1) return { label: labels.ineffective, class: "ineffective" };
  return { label: labels.adequate, class: "adequate" };
}

// ═══════════════════════════════════════════════════════════════════════════
// Results Display
// ═══════════════════════════════════════════════════════════════════════════

function renderResults() {
  const results = calculateResults();
  const styles = CONTENT.styles;

  // Find dominant style(s)
  const maxCount = Math.max(...Object.values(results).map((r) => r.count));
  const dominantStyles = Object.entries(results)
    .filter(([, data]) => data.count === maxCount)
    .map(([styleId]) => styles[styleId].title);

  // Render style cards
  elements.resultsGrid.innerHTML = Object.entries(styles)
    .map(([styleId, style]) => {
      const data = results[styleId];
      const eff = getEffectivenessLabel(data.effectiveness);
      const scoreClass =
        data.effectiveness > 0
          ? "positive"
          : data.effectiveness < 0
          ? "negative"
          : "neutral";
      const scorePrefix = data.effectiveness > 0 ? "+" : "";

      return `
        <div class="style-card">
          <div class="style-card__header">
            <span class="style-card__title">${style.title}</span>
            <span class="style-card__count">${data.count}</span>
          </div>
          <div class="style-card__desc">${style.subtitle}</div>
          <div class="style-card__effectiveness">
            <span class="style-card__eff-label">${CONTENT.ui.effectiveness}:</span>
            <span class="style-card__eff-score style-card__eff-score--${scoreClass}">
              ${scorePrefix}${data.effectiveness} (${eff.label})
            </span>
          </div>
        </div>
      `;
    })
    .join("");

  // Render interpretation
  let interpretation = `<h3>${CONTENT.results.dominantStyleTitle}</h3>`;

  if (dominantStyles.length === 4) {
    interpretation += `<p>${CONTENT.results.balancedProfile}</p>`;
  } else if (dominantStyles.length > 1) {
    interpretation += `<p>${CONTENT.results.dominantStylesPlural
      .replace("{styles}", `<strong>${dominantStyles.join(", ")}</strong>`)
      .replace("{count}", maxCount)}</p>`;
  } else {
    interpretation += `<p>${CONTENT.results.dominantStyleSingular
      .replace("{style}", `<strong>${dominantStyles[0]}</strong>`)
      .replace("{count}", maxCount)}</p>`;
  }

  interpretation += `<p>${CONTENT.results.idealExplanation}</p>`;

  elements.resultsInterpretation.innerHTML = interpretation;
}

// ═══════════════════════════════════════════════════════════════════════════
// Analysis Display
// ═══════════════════════════════════════════════════════════════════════════

function renderAnalysis() {
  const results = calculateResults();
  const styles = CONTENT.styles;

  let html = "";

  Object.entries(styles).forEach(([styleId, style]) => {
    const data = results[styleId];
    const eff = getEffectivenessLabel(data.effectiveness);

    html += `
      <div class="analysis-card analysis-card--${styleId}">
        <div class="analysis-card__header">
          <span class="analysis-card__title">${style.title} (${data.count} בחירות)</span>
          <span class="analysis-card__badge analysis-card__badge--${eff.class}">${eff.label}</span>
        </div>
        <p class="analysis-card__text">
          <strong>${style.subtitle}</strong> — ${style.description}
        </p>
        <p class="analysis-card__text" style="margin-top: 12px;">
          ${data.effectiveness >= 0 ? style.effective : style.ineffective}
        </p>
      </div>
    `;
  });

  elements.analysisContent.innerHTML = html;
}

// ═══════════════════════════════════════════════════════════════════════════
// Export Results
// ═══════════════════════════════════════════════════════════════════════════

function exportResults() {
  const results = calculateResults();
  const styles = CONTENT.styles;
  const exp = CONTENT.export;
  const headers = exp.tableHeaders;

  let markdown = `# ${exp.title}\n\n`;
  markdown += `## ${exp.profileTitle}\n\n`;
  markdown += `| ${headers.style} | ${headers.choices} | ${headers.effectiveness} | ${headers.interpretation} |\n`;
  markdown += `|-------|-------------|-------------|-------|\n`;

  Object.entries(styles).forEach(([styleId, style]) => {
    const data = results[styleId];
    const eff = getEffectivenessLabel(data.effectiveness);
    const prefix = data.effectiveness > 0 ? "+" : "";
    markdown += `| ${style.title} | ${data.count} | ${prefix}${data.effectiveness} | ${eff.label} |\n`;
  });

  // Find dominant
  const maxCount = Math.max(...Object.values(results).map((r) => r.count));
  const dominantStyles = Object.entries(results)
    .filter(([, data]) => data.count === maxCount)
    .map(([styleId]) => styles[styleId].title);

  markdown += `\n## ${exp.dominantTitle}\n`;
  markdown += `${dominantStyles.join(", ")} (${maxCount} בחירות)\n\n`;

  markdown += `## ${exp.detailsTitle}\n\n`;

  Object.entries(styles).forEach(([styleId, style]) => {
    const data = results[styleId];
    const eff = getEffectivenessLabel(data.effectiveness);
    markdown += `### ${style.title}\n`;
    markdown += `- **${style.subtitle}** — ${style.description}\n`;
    markdown += `- בחירות: ${data.count}, יעילות: ${data.effectiveness > 0 ? "+" : ""}${data.effectiveness} (${eff.label})\n`;
    markdown += `- ${data.effectiveness >= 0 ? style.effective : style.ineffective}\n\n`;
  });

  return markdown;
}

// ═══════════════════════════════════════════════════════════════════════════
// Event Listeners
// ═══════════════════════════════════════════════════════════════════════════

function setupEventListeners() {
  document.getElementById("start").addEventListener("click", () => {
    showScreen("question");
    renderQuestion();
  });

  document.getElementById("fill-random").addEventListener("click", () => {
    CONTENT.questions.forEach((q) => {
      const randomOption =
        q.options[Math.floor(Math.random() * q.options.length)];
      answers[q.id] = randomOption.id;
    });
    showScreen("results");
    renderResults();
  });

  elements.prevBtn.addEventListener("click", () => {
    if (currentQuestion === 0) {
      showScreen("intro");
    } else {
      currentQuestion -= 1;
      renderQuestion();
    }
  });

  elements.nextBtn.addEventListener("click", () => {
    if (currentQuestion < CONTENT.questions.length - 1) {
      currentQuestion++;
      renderQuestion();
    } else {
      showScreen("results");
      renderResults();
    }
  });

  document.getElementById("back-to-questions").addEventListener("click", () => {
    showScreen("question");
  });

  document.getElementById("to-analysis").addEventListener("click", () => {
    showScreen("analysis");
    renderAnalysis();
  });

  document.getElementById("restart").addEventListener("click", () => {
    answers = {};
    currentQuestion = 0;
    showScreen("intro");
  });

  document.getElementById("back-to-results").addEventListener("click", () => {
    showScreen("results");
  });

  document.getElementById("copy-results").addEventListener("click", () => {
    const markdown = exportResults();
    navigator.clipboard.writeText(markdown).then(() => {
      const btn = document.getElementById("copy-results");
      const originalText = btn.textContent;
      btn.textContent = CONTENT.ui.copied;
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    });
  });

  document
    .getElementById("back-to-questions-analysis")
    .addEventListener("click", () => {
      showScreen("question");
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// Initialize
// ═══════════════════════════════════════════════════════════════════════════

loadContent();
