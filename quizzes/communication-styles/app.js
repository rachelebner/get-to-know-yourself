// ═══════════════════════════════════════════════════════════════════════════
// שאלון סגנונות תקשורת - Application Logic
// All Hebrew text loaded from content.json
// ═══════════════════════════════════════════════════════════════════════════

import { isTestMode, insertTestModeIndicator, updateBackLinks } from '../../lib/testmode.js';
import { applyBackToHubLinks } from '../../lib/back-to-hub.js';
import { isMobile, copyAsMarkdown, copyAsRichText, shareNative, canShare, createShareButtons } from '../../lib/share.js';

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

const restartButton = document.getElementById("restart");
const backToQuestionsButton = document.getElementById("back-to-questions");
const toAnalysisButton = document.getElementById("to-analysis");
const backToResultsButton = document.getElementById("back-to-results");
const backToQuestionsAnalysisButton = document.getElementById("back-to-questions-analysis");

// ═══════════════════════════════════════════════════════════════════════════
// Initialization
// ═══════════════════════════════════════════════════════════════════════════

async function init() {
  applyBackToHubLinks();
  try {
    const response = await fetch("./content.json");
    content = await response.json();
    answers = new Array(content.questions.length).fill(null);
    populateUI();
    setupEventListeners();

    // Test mode integration
    if (isTestMode()) {
      insertTestModeIndicator();
      updateBackLinks();
      fillRandomAnswers();
      showResults();
      updateScreen(resultsScreen);
    }
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
  answerYes.textContent = content.ui.yes;
  answerNo.textContent = content.ui.no;
  restartButton.textContent = content.ui.restart;
  toAnalysisButton.textContent = content.ui.toAnalysis;
  
  // Setup share buttons
  setupShareButtons();

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

  const lines = [];

  // Test mode warning at top
  if (isTestMode()) {
    lines.push("⚠️ **תוצאות בדיקה** - דוגמה על בסיס מילוי אקראי");
    lines.push("⚠️ **לא תוצאות אמיתיות**");
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  lines.push(
    "# תוצאות שאלון סגנונות תקשורת",
    "",
    "## ציונים לפי סגנון"
  );

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

  // Test mode Q&A table at end
  if (isTestMode()) {
    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push("## פירוט התשובות (מילוי אקראי)");
    lines.push("| מספר שאלה | תשובה שנבחרה |");
    lines.push("|-----------|--------------|");
    answers.forEach((answer, index) => {
      const hebrewAnswer = answer === "yes" ? "כן" : "לא";
      lines.push(`| ${index + 1} | ${hebrewAnswer} |`);
    });
  }

  return lines.join("\n");
}

function buildResultsHTML() {
  const scores = getTypeScores();
  const sorted = getSortedTypes(scores);
  const dominantTypes = sorted.slice(0, 2);
  const minorTypes = sorted.slice(2, 4);

  // Test mode warning
  let html = isTestMode() ? `
    <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
      <div style="font-weight: bold; color: #856404;">⚠️ תוצאות בדיקה - דוגמה על בסיס מילוי אקראי</div>
      <div style="font-weight: bold; color: #856404;">⚠️ לא תוצאות אמיתיות</div>
    </div>
  ` : '';

  html += '<h1>תוצאות שאלון סגנונות תקשורת</h1>';
  html += '<h2>ציונים לפי סגנון</h2>';
  html += '<ul>';
  sorted.forEach((type) => {
    html += `<li><strong>${type.title}</strong>: ${type.score}/10</li>`;
  });
  html += '</ul>';
  
  html += '<hr>';
  html += '<h2>הסגנונות הדומיננטיים שלך</h2>';
  
  dominantTypes.forEach((type, index) => {
    html += `<h3>${index + 1}. ${type.title} (${type.score}/10)</h3>`;
    html += `<p>${type.description.summary}</p>`;
    html += '<h4>מאפיינים עיקריים:</h4>';
    html += '<ul>';
    type.description.traits.forEach((trait) => {
      html += `<li>${trait}</li>`;
    });
    html += '</ul>';
  });
  
  html += '<hr>';
  html += '<h2>סגנונות משניים</h2>';
  html += '<ul>';
  minorTypes.forEach((type) => {
    html += `<li><strong>${type.title}</strong>: ${type.score}/10</li>`;
  });
  html += '</ul>';

  // Test mode Q&A table
  if (isTestMode()) {
    html += `
      <hr style="margin: 24px 0;">
      <h2>פירוט התשובות (מילוי אקראי)</h2>
      <table style="border-collapse: collapse; width: 100%; margin-top: 12px;">
        <thead>
          <tr style="background: #f5f5f5;">
            <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">מספר שאלה</th>
            <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">תשובה שנבחרה</th>
          </tr>
        </thead>
        <tbody>
          ${answers.map((answer, index) => {
            const hebrewAnswer = answer === "yes" ? "כן" : "לא";
            return `
              <tr>
                <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${index + 1}</td>
                <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${hebrewAnswer}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }
  
  return html;
}

function setupShareButtons() {
  // Only add share buttons to the analysis screen (not results screen)
  const analysisActions = document.querySelector('#analysis .results-actions');
  
  if (!analysisActions) return;
  
  // Create share buttons HTML
  const shareButtonsHTML = createShareButtons({
    copyMarkdown: "העתק כטקסט",
    copyRichText: "העתק מעוצב",
    share: "שתף",
    copyResults: content.ui.copyResults || "העתק תוצאות"
  });
  
  // Add share buttons to analysis screen (replace copy-results button)
  const analysisCopyBtn = analysisActions.querySelector('#copy-results');
  if (analysisCopyBtn) {
    const shareContainer = document.createElement('div');
    shareContainer.className = 'share-buttons-container';
    shareContainer.innerHTML = shareButtonsHTML;
    analysisCopyBtn.replaceWith(shareContainer);
  }
  
  // Setup event listeners for share buttons
  setupShareEventListeners();
}

function setupShareEventListeners() {
  // Use event delegation for dynamically created buttons
  document.addEventListener('click', async (e) => {
    const action = e.target.closest('[data-action]')?.getAttribute('data-action');
    if (!action) return;
    
    const markdown = buildResultsMarkdown();
    const html = buildResultsHTML();
    
    try {
      if (action === 'copy-markdown') {
        await (isMobile() ? copyAsMarkdown(markdown) : copyAsRichText(html));
      } else if (action === 'copy-richtext') {
        await copyAsRichText(html);
      } else if (action === 'share-native') {
        await shareNative(
          content.meta?.title || 'תוצאות שאלון סגנונות תקשורת',
          markdown.replace(/#{1,3}\s/g, '').replace(/\*\*/g, '').substring(0, 200) + '...'
        );
      }
    } catch (error) {
      console.error('Share action failed:', error);
    }
  });
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
}

// ═══════════════════════════════════════════════════════════════════════════
// Start
// ═══════════════════════════════════════════════════════════════════════════

init();
