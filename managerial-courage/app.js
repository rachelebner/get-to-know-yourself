import { isTestMode, insertTestModeIndicator, updateBackLinks } from '../lib/testmode.js';
import { isMobile, copyAsMarkdown, copyAsRichText, shareNative, canShare } from '../lib/share.js';

let content = null;

const introScreen = document.getElementById("intro");
const questionScreen = document.getElementById("question-screen");
const resultsScreen = document.getElementById("results");
const analysisScreen = document.getElementById("analysis");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const questionText = document.getElementById("question-text");
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");
const startButton = document.getElementById("start");
const backToQuestionsButton = document.getElementById("back-to-questions");
const restartButton = document.getElementById("restart");
const resultsGrid = document.getElementById("results-grid");
const analysisGrid = document.getElementById("analysis-grid");
const toAnalysisButton = document.getElementById("to-analysis");
const shareButtonsContainer = document.getElementById("share-buttons-container");
const backToResultsButton = document.getElementById("back-to-results");
const backToQuestionsAnalysisButton = document.getElementById("back-to-questions-analysis");
const scoreInputs = Array.from(document.querySelectorAll("input[name='score']"));
const introInstructions = document.getElementById("intro-instructions");
const introNote = document.getElementById("intro-note");
const scaleLabels = document.getElementById("scale-labels");

let currentIndex = 0;
let answers = [];

const updateScreen = (screen) => {
  [
    introScreen,
    questionScreen,
    resultsScreen,
    analysisScreen,
  ].forEach((section) => {
    section.classList.toggle("screen--active", section === screen);
  });
};

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

const getCategoryScores = () =>
  content.categories.map((category) => {
    const categoryAnswers = category.questions.map((qNum) => answers[qNum - 1]);
    const sum = categoryAnswers.reduce((total, score) => {
      return total + (score || 0);
    }, 0);
    return {
      ...category,
      sum,
    };
  });

const getDominantDrivers = (scores) => {
  const maxScore = Math.max(...scores.map((c) => c.sum));
  return scores.filter((c) => c.sum === maxScore);
};

const showResults = () => {
  resultsGrid.innerHTML = "";
  const scores = getCategoryScores();
  const dominant = getDominantDrivers(scores);
  
  // Add model context at the top
  const contextDiv = document.createElement("div");
  contextDiv.className = "results-context";
  contextDiv.innerHTML = `<p>${content.results.modelContext}</p>`;
  resultsGrid.appendChild(contextDiv);
  
  // Create cards container
  const cardsContainer = document.createElement("div");
  cardsContainer.className = "results-cards";
  
  scores.forEach((category) => {
    const isDominant = dominant.some((d) => d.id === category.id);
    const card = document.createElement("div");
    card.className = `result-card ${isDominant ? "result-card--dominant" : ""}`;
    card.innerHTML = `
      <div class="result-card__title">${category.title}</div>
      <div class="result-card__description">${category.description}</div>
      <div class="result-card__score">${category.sum}</div>
      <div class="result-card__range">${category.scoreRange[0]}-${category.scoreRange[1]}</div>
    `;
    cardsContainer.appendChild(card);
  });
  
  resultsGrid.appendChild(cardsContainer);
};

const getInterpretation = (score, category) => {
  const [min, max] = category.scoreRange;
  const range = max - min;
  const third = range / 3;
  
  if (score <= min + third) {
    return category.interpretation.low;
  } else if (score <= min + (third * 2)) {
    return category.interpretation.medium;
  } else {
    return category.interpretation.high;
  }
};

const showAnalysis = () => {
  const scores = getCategoryScores();
  const sorted = [...scores].sort((a, b) => b.sum - a.sum);
  const dominant = getDominantDrivers(scores);
  
  analysisGrid.innerHTML = "";
  
  sorted.forEach((category) => {
    const isDominant = dominant.some((d) => d.id === category.id);
    const interpretation = getInterpretation(category.sum, category);
    const card = document.createElement("div");
    card.className = `analysis-card ${isDominant ? "analysis-card--dominant" : ""}`;
    card.innerHTML = `
      <div class="analysis-card__header">
        <div>
          <div class="analysis-card__title">${category.title}</div>
          <div class="analysis-card__description">${category.description}</div>
        </div>
        <div class="analysis-card__score">${category.sum}</div>
      </div>
      <p class="analysis-card__interpretation">${interpretation}</p>
    `;
    analysisGrid.appendChild(card);
  });
  
  // Add reflection questions section
  const reflectionSection = document.createElement("div");
  reflectionSection.className = "reflection-section";
  const questionsHtml = content.analysis.reflectionQuestions
    .map((q) => `<li>${q}</li>`)
    .join("");
  reflectionSection.innerHTML = `
    <h3 class="reflection-section__title">${content.analysis.reflectionTitle}</h3>
    <ul class="reflection-section__questions">${questionsHtml}</ul>
  `;
  analysisGrid.appendChild(reflectionSection);
};

const buildResultsMarkdown = () => {
  const scores = getCategoryScores();
  const sorted = [...scores].sort((a, b) => b.sum - a.sum);
  const dominant = getDominantDrivers(scores);
  
  const lines = [
    `# ${content.markdown.title}`,
    "",
    `> ${content.results.modelContext}`,
    "",
    `## ${content.markdown.categoryScores}`,
  ];
  
  sorted.forEach((category) => {
    const isDominant = dominant.some((d) => d.id === category.id);
    const marker = isDominant ? " ⭐ (דומיננטי)" : "";
    lines.push(`- **${category.title}**: ${category.sum}${marker}`);
  });
  
  lines.push("");
  lines.push(`## ${content.markdown.dominantDrivers}`);
  dominant.forEach((category) => {
    lines.push("");
    lines.push(`### ${category.title} (${category.sum})`);
    lines.push(`- ${content.markdown.descriptionLabel}: ${category.description}`);
    lines.push(`- ${getInterpretation(category.sum, category)}`);
  });
  
  const developmentAreas = sorted.filter((c) => {
    const [min, max] = c.scoreRange;
    const range = max - min;
    const third = range / 3;
    return c.sum <= min + third;
  });
  
  if (developmentAreas.length > 0) {
    lines.push("");
    lines.push(`## ${content.markdown.developmentAreas}`);
    developmentAreas.forEach((category) => {
      lines.push("");
      lines.push(`### ${category.title} (${category.sum})`);
      lines.push(`- ${category.description}`);
      lines.push(`- ${category.interpretation.low}`);
    });
  }
  
  // Add reflection questions
  lines.push("");
  lines.push(`## ${content.analysis.reflectionTitle}`);
  content.analysis.reflectionQuestions.forEach((q) => {
    lines.push(`- ${q}`);
  });
  
  return lines.join("\n");
};

const buildResultsRichText = () => {
  const scores = getCategoryScores();
  const sorted = [...scores].sort((a, b) => b.sum - a.sum);
  const dominant = getDominantDrivers(scores);
  
  const categoryItems = sorted.map((category) => {
    const isDominant = dominant.some((d) => d.id === category.id);
    const dominantMarker = isDominant ? ' <strong style="color: #4c66ff;">⭐ (דומיננטי)</strong>' : '';
    return `<li><strong>${category.title}</strong>: ${category.sum}${dominantMarker}</li>`;
  }).join('');
  
  const dominantItems = dominant.map((category) => {
    const interpretation = getInterpretation(category.sum, category);
    return `
      <div style="margin-bottom: 20px; padding: 16px; background: #f5f7ff; border-radius: 8px; border-right: 4px solid #4c66ff;">
        <h3 style="margin: 0 0 8px 0; color: #4c66ff;">${category.title} (${category.sum})</h3>
        <p style="margin: 0 0 8px 0;"><strong>${content.markdown.descriptionLabel}:</strong> ${category.description}</p>
        <p style="margin: 0;">${interpretation}</p>
      </div>
    `;
  }).join('');
  
  const developmentAreas = sorted.filter((c) => {
    const [min, max] = c.scoreRange;
    const range = max - min;
    const third = range / 3;
    return c.sum <= min + third;
  });
  
  const developmentItems = developmentAreas.length > 0
    ? developmentAreas.map((category) => {
        return `
          <div style="margin-bottom: 20px; padding: 16px; background: #fff5f5; border-radius: 8px; border-right: 4px solid #ff6b6b;">
            <h3 style="margin: 0 0 8px 0; color: #ff6b6b;">${category.title} (${category.sum})</h3>
            <p style="margin: 0 0 8px 0;">${category.description}</p>
            <p style="margin: 0;">${category.interpretation.low}</p>
          </div>
        `;
      }).join('')
    : '';
  
  const reflectionItems = content.analysis.reflectionQuestions
    .map((q) => `<li style="margin-bottom: 8px;">${q}</li>`)
    .join('');
  
  return `
    <h1 style="margin-bottom: 16px;">${content.markdown.title}</h1>
    <blockquote style="margin: 16px 0; padding: 12px 16px; background: #f5f7ff; border-right: 4px solid #4c66ff; border-radius: 4px;">
      ${content.results.modelContext}
    </blockquote>
    <h2 style="margin-top: 24px; margin-bottom: 12px;">${content.markdown.categoryScores}</h2>
    <ul style="margin: 0; padding-right: 20px;">${categoryItems}</ul>
    <h2 style="margin-top: 24px; margin-bottom: 12px;">${content.markdown.dominantDrivers}</h2>
    ${dominantItems}
    ${developmentAreas.length > 0 ? `
    <h2 style="margin-top: 24px; margin-bottom: 12px;">${content.markdown.developmentAreas}</h2>
    ${developmentItems}
    ` : ''}
    <h2 style="margin-top: 24px; margin-bottom: 12px;">${content.analysis.reflectionTitle}</h2>
    <ul style="margin: 0; padding-right: 20px;">${reflectionItems}</ul>
  `;
};

const setupShareButtons = () => {
  if (!shareButtonsContainer) return;
  
  const mobile = isMobile();
  const markdown = buildResultsMarkdown();
  const richText = buildResultsRichText();
  
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
          await shareNative(content.markdown.title, markdown);
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
      await copyAsMarkdown(markdown);
    });
  }
};

const initApp = async () => {
  // Add test mode indicator if active
  if (isTestMode()) {
    insertTestModeIndicator();
    updateBackLinks();
  }
  
  content = await fetch("./content.json").then((r) => r.json());
  answers = new Array(content.questions.length).fill(null);
  
  // If test mode is active, fill random answers and show results immediately
  if (isTestMode()) {
    fillRandomAnswers();
    showResults();
    updateScreen(resultsScreen);
  }
  
  // Populate intro screen
  introInstructions.textContent = content.intro.instructions;
  introNote.textContent = content.intro.note;
  
  // Populate scale labels
  scaleLabels.innerHTML = Object.entries(content.intro.scaleLabels)
    .map(([value, label]) => {
      return `
        <div class="scale-labels__item">
          <strong>${value}</strong>
          <span>${label}</span>
        </div>
      `;
    })
    .join("");
  
  scoreInputs.forEach((input) => {
    input.addEventListener("change", (event) => {
      setAnswer(Number(event.target.value));
    });
  });
  
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
  
  startButton.addEventListener("click", () => {
    currentIndex = 0;
    updateQuestion();
    updateScreen(questionScreen);
  });
  
  restartButton.addEventListener("click", () => {
    answers.fill(null);
    scoreInputs.forEach((input) => {
      input.checked = false;
    });
    updateScreen(introScreen);
  });
  
  backToQuestionsButton.addEventListener("click", () => {
    updateQuestion();
    updateScreen(questionScreen);
  });
  
  toAnalysisButton.addEventListener("click", () => {
    showAnalysis();
    setupShareButtons();
    updateScreen(analysisScreen);
  });
  
  backToResultsButton.addEventListener("click", () => {
    showResults();
    updateScreen(resultsScreen);
  });
  
  backToQuestionsAnalysisButton.addEventListener("click", () => {
    updateQuestion();
    updateScreen(questionScreen);
  });
};

initApp();
