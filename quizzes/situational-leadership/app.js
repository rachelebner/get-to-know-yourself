// ═══════════════════════════════════════════════════════════════════════════
// שאלון ניהול מצבי - Situational Leadership Questionnaire
// Based on Hersey & Blanchard's Situational Leadership Theory
// ═══════════════════════════════════════════════════════════════════════════

import { isTestMode, insertTestModeIndicator, updateBackLinks } from '../../lib/testmode.js';
import { applyBackToHubLinks } from '../../lib/back-to-hub.js';
import { isMobile, copyAsMarkdown, copyAsRichText, shareNative, canShare } from '../../lib/share.js';

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
  applyBackToHubLinks();
  // Add test mode indicator if active
  if (isTestMode()) {
    insertTestModeIndicator();
    updateBackLinks();
  }

  // Populate intro instructions
  const instructionsList = document.querySelector("#intro .steps");
  if (instructionsList && CONTENT.intro.instructions) {
    instructionsList.innerHTML = CONTENT.intro.instructions
      .map((instruction) => `<li>${instruction}</li>`)
      .join("");
  }

  // If test mode is active, fill random answers and show results immediately
  if (isTestMode()) {
    CONTENT.questions.forEach((q) => {
      const randomOption = q.options[Math.floor(Math.random() * q.options.length)];
      answers[q.id] = randomOption.id;
    });
    showScreen('results');
    renderResults();
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

  let markdown = '';

  // Test mode warning at top
  if (isTestMode()) {
    markdown += "⚠️ **תוצאות בדיקה** - דוגמה על בסיס מילוי אקראי\n";
    markdown += "⚠️ **לא תוצאות אמיתיות**\n\n";
    markdown += "---\n\n";
  }

  markdown += `# ${exp.title}\n\n`;
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

  // Test mode Q&A table at end
  if (isTestMode()) {
    markdown += "---\n\n";
    markdown += "## פירוט התשובות (מילוי אקראי)\n";
    markdown += "| מספר מצב | תשובה שנבחרה |\n";
    markdown += "|----------|---------------|\n";
    CONTENT.questions.forEach((q) => {
      const answer = answers[q.id];
      markdown += `| ${q.id} | ${answer || '-'} |\n`;
    });
  }

  return markdown;
}

function exportResultsRichText() {
  const results = calculateResults();
  const styles = CONTENT.styles;
  const exp = CONTENT.export;
  const headers = exp.tableHeaders;

  // Find dominant
  const maxCount = Math.max(...Object.values(results).map((r) => r.count));
  const dominantStyles = Object.entries(results)
    .filter(([, data]) => data.count === maxCount)
    .map(([styleId]) => styles[styleId].title);

  // Test mode warning
  let html = isTestMode() ? `
    <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
      <div style="font-weight: bold; color: #856404;">⚠️ תוצאות בדיקה - דוגמה על בסיס מילוי אקראי</div>
      <div style="font-weight: bold; color: #856404;">⚠️ לא תוצאות אמיתיות</div>
    </div>
  ` : '';

  html += `<h1>${exp.title}</h1>`;
  html += `<h2>${exp.profileTitle}</h2>`;
  html += `<table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">`;
  html += `<thead><tr style="background: #f5f5f5;">`;
  html += `<th style="padding: 8px; text-align: right; border: 1px solid #ddd;">${headers.style}</th>`;
  html += `<th style="padding: 8px; text-align: center; border: 1px solid #ddd;">${headers.choices}</th>`;
  html += `<th style="padding: 8px; text-align: center; border: 1px solid #ddd;">${headers.effectiveness}</th>`;
  html += `<th style="padding: 8px; text-align: right; border: 1px solid #ddd;">${headers.interpretation}</th>`;
  html += `</tr></thead><tbody>`;

  Object.entries(styles).forEach(([styleId, style]) => {
    const data = results[styleId];
    const eff = getEffectivenessLabel(data.effectiveness);
    const prefix = data.effectiveness > 0 ? "+" : "";
    html += `<tr>`;
    html += `<td style="padding: 8px; border: 1px solid #ddd;"><strong>${style.title}</strong></td>`;
    html += `<td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${data.count}</td>`;
    html += `<td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${prefix}${data.effectiveness}</td>`;
    html += `<td style="padding: 8px; border: 1px solid #ddd;">${eff.label}</td>`;
    html += `</tr>`;
  });

  html += `</tbody></table>`;

  html += `<h2>${exp.dominantTitle}</h2>`;
  html += `<p><strong>${dominantStyles.join(", ")}</strong> (${maxCount} בחירות)</p>`;

  html += `<h2>${exp.detailsTitle}</h2>`;

  Object.entries(styles).forEach(([styleId, style]) => {
    const data = results[styleId];
    const eff = getEffectivenessLabel(data.effectiveness);
    html += `<div style="margin-bottom: 20px;">`;
    html += `<h3>${style.title}</h3>`;
    html += `<p><strong>${style.subtitle}</strong> — ${style.description}</p>`;
    html += `<p>בחירות: ${data.count}, יעילות: ${data.effectiveness > 0 ? "+" : ""}${data.effectiveness} (${eff.label})</p>`;
    html += `<p>${data.effectiveness >= 0 ? style.effective : style.ineffective}</p>`;
    html += `</div>`;
  });

  // Test mode Q&A table
  if (isTestMode()) {
    html += `
      <hr style="margin: 24px 0;">
      <h2>פירוט התשובות (מילוי אקראי)</h2>
      <table style="border-collapse: collapse; width: 100%; margin-top: 12px;">
        <thead>
          <tr style="background: #f5f5f5;">
            <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">מספר מצב</th>
            <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">תשובה שנבחרה</th>
          </tr>
        </thead>
        <tbody>
          ${CONTENT.questions.map((q) => {
            const answer = answers[q.id];
            return `
              <tr>
                <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${q.id}</td>
                <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${answer || '-'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }

  return html;
}

// ═══════════════════════════════════════════════════════════════════════════
// Share Buttons Setup
// ═══════════════════════════════════════════════════════════════════════════

function setupShareButtons() {
  const shareButtonsContainer = document.getElementById("share-buttons-container");
  if (!shareButtonsContainer) return;

  const mobile = isMobile();
  const markdown = exportResults();
  const richText = exportResultsRichText();

  if (mobile) {
    // Mobile: Show separate buttons
    shareButtonsContainer.innerHTML = `
      <button class="share-btn share-btn-markdown" data-action="copy-markdown" style="
        width: 100%;
        padding: 12px 24px;
        background: var(--primary, #4c66ff);
        color: white;
        border: none;
        border-radius: var(--radius-pill, 999px);
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        font-family: var(--font-stack, 'Heebo', 'Assistant', 'Segoe UI', sans-serif);
        transition: opacity 0.2s;
        margin-bottom: 12px;
      ">העתק כטקסט</button>
      <button class="share-btn share-btn-richtext" data-action="copy-richtext" style="
        width: 100%;
        padding: 12px 24px;
        background: var(--primary, #4c66ff);
        color: white;
        border: none;
        border-radius: var(--radius-pill, 999px);
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        font-family: var(--font-stack, 'Heebo', 'Assistant', 'Segoe UI', sans-serif);
        transition: opacity 0.2s;
        margin-bottom: 12px;
      ">העתק מעוצב</button>
      ${canShare() ? `
      <button class="share-btn share-btn-native" data-action="share-native" style="
        width: 100%;
        padding: 12px 24px;
        background: var(--primary, #4c66ff);
        color: white;
        border: none;
        border-radius: var(--radius-pill, 999px);
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        font-family: var(--font-stack, 'Heebo', 'Assistant', 'Segoe UI', sans-serif);
        transition: opacity 0.2s;
      ">שתף</button>
      ` : ''}
    `;

    // Wire up mobile button handlers
    shareButtonsContainer.querySelector('[data-action="copy-markdown"]')?.addEventListener('click', async () => {
      await copyAsMarkdown(markdown);
    });

    shareButtonsContainer.querySelector('[data-action="copy-richtext"]')?.addEventListener('click', async () => {
      await copyAsRichText(richText);
    });

    if (canShare()) {
      shareButtonsContainer.querySelector('[data-action="share-native"]')?.addEventListener('click', async () => {
        try {
          await shareNative(CONTENT.export.title, markdown);
        } catch (error) {
          // User cancelled or error - silently fail
        }
      });
    }
  } else {
    // Desktop: Single button (current behavior)
    shareButtonsContainer.innerHTML = `
      <button class="share-btn share-btn-desktop" data-action="copy-markdown" style="
        padding: 12px 24px;
        background: var(--primary, #4c66ff);
        color: white;
        border: none;
        border-radius: var(--radius-pill, 999px);
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        font-family: var(--font-stack, 'Heebo', 'Assistant', 'Segoe UI', sans-serif);
        transition: opacity 0.2s;
      ">העתק תוצאות</button>
    `;

    shareButtonsContainer.querySelector('[data-action="copy-markdown"]')?.addEventListener('click', async () => {
      await copyAsRichText(richText);
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Event Listeners
// ═══════════════════════════════════════════════════════════════════════════

function setupEventListeners() {
  document.getElementById("start").addEventListener("click", () => {
    showScreen("question");
    renderQuestion();
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
    setupShareButtons(); // Update share buttons when showing analysis screen
  });

  document.getElementById("restart").addEventListener("click", () => {
    answers = {};
    currentQuestion = 0;
    showScreen("intro");
  });

  document.getElementById("back-to-results").addEventListener("click", () => {
    showScreen("results");
  });

  // Share buttons setup (replaces copy-results button)
  setupShareButtons();

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
