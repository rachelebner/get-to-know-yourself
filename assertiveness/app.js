// ═══════════════════════════════════════════════════════════════════════════
// שאלון אסרטיביות - Application Logic
// All Hebrew text loaded from content.json
// ═══════════════════════════════════════════════════════════════════════════

import { isTestMode, insertTestModeIndicator, updateBackLinks } from '../lib/testmode.js';
import { copyAsMarkdown, copyAsRichText, shareNative, createShareButtons } from '../lib/share.js';

let content = null;
let currentIndex = 0;
let answers = [];

// DOM Elements
const introScreen = document.getElementById("intro");
const questionScreen = document.getElementById("question-screen");
const resultsScreen = document.getElementById("results");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const questionText = document.getElementById("question-text");
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");
const startButton = document.getElementById("start");
const backToQuestionsButton = document.getElementById("back-to-questions");
const restartButton = document.getElementById("restart");
const totalScoreEl = document.getElementById("total-score");
const interpretationTitle = document.getElementById("interpretation-title");
const interpretationText = document.getElementById("interpretation-text");
const scoreInputs = Array.from(document.querySelectorAll("input[name='score']"));

// ═══════════════════════════════════════════════════════════════════════════
// Screen Management
// ═══════════════════════════════════════════════════════════════════════════

const updateScreen = (screen) => {
  [introScreen, questionScreen, resultsScreen].forEach((section) => {
    section.classList.toggle("screen--active", section === screen);
  });
};

// ═══════════════════════════════════════════════════════════════════════════
// Question Flow
// ═══════════════════════════════════════════════════════════════════════════

const updateQuestion = () => {
  const question = content.questions[currentIndex];
  questionText.textContent = question.text;
  progressText.textContent = content.ui.questionOf
    .replace("{current}", question.id)
    .replace("{total}", content.questions.length);
  const progress = ((currentIndex + 1) / content.questions.length) * 100;
  progressFill.style.width = `${progress}%`;
  prevButton.disabled = false;
  if (currentIndex === 0) {
    prevButton.textContent = content.ui.backToIntro;
  } else {
    prevButton.textContent = content.ui.prev;
  }
  nextButton.textContent =
    currentIndex === content.questions.length - 1
      ? content.ui.finish
      : content.ui.next;
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
  for (let i = 0; i < answers.length; i += 1) {
    answers[i] = Math.floor(Math.random() * 5) + 1;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// Scoring
// ═══════════════════════════════════════════════════════════════════════════

const calculateScores = () => {
  const total = answers.reduce((sum, score) => sum + score, 0);
  const percentage = total * content.scoring.calculation.totalMultiplier;
  return { total, percentage };
};

const getInterpretation = (percentage) => {
  const range = content.scoreRanges.find(
    (r) => percentage >= r.min && percentage <= r.max
  );
  return range || content.scoreRanges[content.scoreRanges.length - 1];
};

// ═══════════════════════════════════════════════════════════════════════════
// Results Display
// ═══════════════════════════════════════════════════════════════════════════

const showResults = () => {
  const { total, percentage } = calculateScores();
  const interpretation = getInterpretation(percentage);

  totalScoreEl.textContent = total;
  interpretationTitle.textContent = interpretation.title;
  interpretationText.textContent = interpretation.description;
};

// ═══════════════════════════════════════════════════════════════════════════
// Export Results
// ═══════════════════════════════════════════════════════════════════════════

const buildResultsMarkdown = () => {
  const { total, percentage } = calculateScores();
  const interpretation = getInterpretation(percentage);

  return [
    `# ${content.markdown.title}`,
    "",
    `## ${content.markdown.totalScore}`,
    `${total} מתוך 100`,
    "",
    `## ${content.markdown.interpretation}`,
    `**${interpretation.title}**`,
    "",
    interpretation.description,
  ].join("\n");
};

const buildResultsRichText = () => {
  const { total, percentage } = calculateScores();
  const interpretation = getInterpretation(percentage);

  let html = `<h1>${content.markdown.title}</h1>`;
  html += `<h2>${content.markdown.totalScore}</h2>`;
  html += `<p><strong>${total}</strong> מתוך 100</p>`;
  html += `<h2>${content.markdown.interpretation}</h2>`;
  html += `<h3>${interpretation.title}</h3>`;
  html += `<p>${interpretation.description}</p>`;

  return html;
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
};

// ═══════════════════════════════════════════════════════════════════════════
// Share Buttons Setup
// ═══════════════════════════════════════════════════════════════════════════

const setupShareButtons = () => {
  const resultsActions = document.querySelector('#results .results-actions');
  if (!resultsActions) return;

  // Create share buttons HTML
  const shareButtonsHTML = createShareButtons({
    copyMarkdown: "העתק כטקסט",
    copyRichText: "העתק מעוצב",
    share: "שתף",
    copyResults: content.ui.copyResults || "העתק תוצאות"
  });

  // Replace copy-results button with share buttons container
  const copyResultsBtn = resultsActions.querySelector('#copy-results');
  if (copyResultsBtn) {
    const shareContainer = document.createElement('div');
    shareContainer.className = 'share-buttons-container';
    shareContainer.innerHTML = shareButtonsHTML;
    copyResultsBtn.replaceWith(shareContainer);
  } else {
    // If button doesn't exist, add before restart button
    const restartBtn = resultsActions.querySelector('#restart');
    if (restartBtn) {
      const shareContainer = document.createElement('div');
      shareContainer.className = 'share-buttons-container';
      shareContainer.innerHTML = shareButtonsHTML;
      resultsActions.insertBefore(shareContainer, restartBtn);
    }
  }

  // Setup event listeners for share buttons
  setupShareEventListeners();
};

const setupShareEventListeners = () => {
  // Use event delegation for dynamically created buttons
  document.addEventListener('click', async (e) => {
    const action = e.target.closest('[data-action]')?.getAttribute('data-action');
    if (!action) return;

    const markdown = buildResultsMarkdown();
    const html = buildResultsRichText();

    try {
      if (action === 'copy-markdown') {
        await copyAsMarkdown(markdown);
      } else if (action === 'copy-richtext') {
        await copyAsRichText(html);
      } else if (action === 'share-native') {
        await shareNative(
          content.meta?.title || 'תוצאות שאלון אסרטיביות',
          markdown.replace(/#{1,3}\s/g, '').replace(/\*\*/g, '').substring(0, 200) + '...'
        );
      }
    } catch (error) {
      console.error('Share action failed:', error);
    }
  });
};

// ═══════════════════════════════════════════════════════════════════════════
// Initialization
// ═══════════════════════════════════════════════════════════════════════════

const initApp = async () => {
  try {
    const response = await fetch("./content.json");
    content = await response.json();
    answers = new Array(content.questions.length).fill(null);
    setupEventListeners();
    setupShareButtons();

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
};

initApp();
