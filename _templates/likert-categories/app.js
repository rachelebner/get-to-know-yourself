// ═══════════════════════════════════════════════════════════════════════════
// Likert + Categories Questionnaire Template
// Config-driven app.js - all Hebrew text loaded from content.json
// ═══════════════════════════════════════════════════════════════════════════

let content = null;
let config = null;
let currentIndex = 0;
let answers = [];

// ═══════════════════════════════════════════════════════════════════════════
// DOM Elements
// ═══════════════════════════════════════════════════════════════════════════

const introScreen = document.getElementById("intro");
const questionScreen = document.getElementById("question-screen");
const resultsScreen = document.getElementById("results");
const analysisScreen = document.getElementById("analysis");

const introTitle = document.getElementById("intro-title");
const introInstructions = document.getElementById("intro-instructions");
const introNote = document.getElementById("intro-note");
const scaleLabels = document.getElementById("scale-labels");

const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const questionText = document.getElementById("question-text");

const scoreInputs = Array.from(document.querySelectorAll("input[name='score']"));
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");
const startButton = document.getElementById("start");
const fillRandomButton = document.getElementById("fill-random");
const restartButton = document.getElementById("restart");
const backToQuestionsButton = document.getElementById("back-to-questions");
const copyResultsButton = document.getElementById("copy-results");
const toAnalysisButton = document.getElementById("to-analysis");
const backToResultsButton = document.getElementById("back-to-results");
const backToQuestionsAnalysisButton = document.getElementById("back-to-questions-analysis");

const resultsTitle = document.getElementById("results-title");
const resultsSubtitle = document.getElementById("results-subtitle");
const resultsGrid = document.getElementById("results-grid");
const resultsInterpretation = document.getElementById("results-interpretation");
const analysisGrid = document.getElementById("analysis-grid");

// ═══════════════════════════════════════════════════════════════════════════
// Screen Management
// ═══════════════════════════════════════════════════════════════════════════

const getScreens = () => {
  const screens = [introScreen, questionScreen, resultsScreen];
  if (config?.hasAnalysisScreen && analysisScreen) {
    screens.push(analysisScreen);
  }
  return screens;
};

const updateScreen = (screen) => {
  getScreens().forEach((s) => {
    if (s) s.classList.toggle("screen--active", s === screen);
  });
};

// ═══════════════════════════════════════════════════════════════════════════
// Initialization
// ═══════════════════════════════════════════════════════════════════════════

const initApp = async () => {
  try {
    const response = await fetch("./content.json");
    content = await response.json();
    config = content.config || {};
    answers = new Array(content.questions.length).fill(null);
    populateUI();
    setupEventListeners();
  } catch (error) {
    console.error("Failed to load content:", error);
  }
};

const populateUI = () => {
  // Intro screen
  if (introTitle) introTitle.textContent = content.intro.title || "";
  if (introInstructions) introInstructions.textContent = content.intro.instructions || "";
  if (introNote) introNote.textContent = content.intro.note || "";

  // Scale labels in intro
  if (scaleLabels && content.intro.scaleLabels) {
    scaleLabels.innerHTML = Object.entries(content.intro.scaleLabels)
      .map(([value, label]) => `
        <div class="scale-labels__item">
          <strong>${value}</strong>
          <span>${label}</span>
        </div>
      `)
      .join("");
  }

  // Button labels
  if (startButton) startButton.textContent = content.ui.start || "התחל";
  if (fillRandomButton) fillRandomButton.textContent = content.ui.fillRandom || "מילוי אקראי";
  if (restartButton) restartButton.textContent = content.ui.restart || "התחל מחדש";
  if (copyResultsButton) copyResultsButton.textContent = content.ui.copyResults || "העתק תוצאות";

  // Results screen titles
  if (resultsTitle) resultsTitle.textContent = content.results?.title || "התוצאות שלך";
  if (resultsSubtitle) resultsSubtitle.textContent = content.results?.subtitle || "";

  // Hide/show analysis button based on config
  if (toAnalysisButton) {
    toAnalysisButton.style.display = config.hasAnalysisScreen ? "" : "none";
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// Question Flow
// ═══════════════════════════════════════════════════════════════════════════

const updateQuestion = () => {
  const question = content.questions[currentIndex];
  questionText.textContent = question.text;

  // Progress
  const progressTemplate = (content.ui.questionOf || "שאלה {current} מתוך {total}")
    .replace("{current}", question.id)
    .replace("{total}", content.questions.length);
  progressText.textContent = progressTemplate;
  const progress = ((currentIndex + 1) / content.questions.length) * 100;
  progressFill.style.width = `${progress}%`;

  // Navigation
  prevButton.disabled = false;
  if (currentIndex === 0) {
    prevButton.textContent = content.ui.backToIntro || "חזרה להנחיות";
  } else {
    prevButton.textContent = content.ui.prev || "חזרה";
  }
  nextButton.textContent =
    currentIndex === content.questions.length - 1
      ? (content.ui.finish || "סיום")
      : (content.ui.next || "הבא");

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

const getDominantCategories = (scores) => {
  const maxScore = Math.max(...scores.map((c) => c.sum));
  return scores.filter((c) => c.sum === maxScore);
};

const getTopCategories = (scores, count = 2) => {
  const sorted = [...scores].sort((a, b) => b.sum - a.sum);
  const top = [sorted[0]];
  
  // Include ties with second place
  if (sorted[1]) {
    top.push(sorted[1]);
    for (let i = 2; i < sorted.length; i++) {
      if (sorted[i].sum === sorted[1].sum) {
        top.push(sorted[i]);
      }
    }
  }
  
  return top;
};

const getInterpretation = (score, category) => {
  if (!category.interpretation || !category.scoreRange) {
    return category.description || "";
  }
  
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

// ═══════════════════════════════════════════════════════════════════════════
// Results Display
// ═══════════════════════════════════════════════════════════════════════════

const showResults = () => {
  const scores = getCategoryScores();
  const dominant = getDominantCategories(scores);
  const topCategories = getTopCategories(scores);

  resultsGrid.innerHTML = "";
  if (resultsInterpretation) resultsInterpretation.innerHTML = "";

  // Model context (if provided)
  if (content.results?.modelContext) {
    const contextDiv = document.createElement("div");
    contextDiv.className = "results-context";
    contextDiv.innerHTML = `<p>${content.results.modelContext}</p>`;
    resultsGrid.appendChild(contextDiv);
  }

  // Create cards container
  const cardsContainer = document.createElement("div");
  cardsContainer.className = "results-cards";

  scores.forEach((category) => {
    const isDominant = dominant.some((d) => d.id === category.id);
    const isTop = topCategories.some((t) => t.id === category.id);
    const card = document.createElement("div");
    
    // Use appropriate highlight class
    const highlightClass = isDominant ? "result-card--dominant" : 
                          (isTop ? "result-card--highlight" : "");
    card.className = `result-card ${highlightClass}`;
    
    // Score range display (if available)
    const rangeHtml = category.scoreRange 
      ? `<div class="result-card__range">${category.scoreRange[0]}-${category.scoreRange[1]}</div>`
      : "";
    
    // Description (if available)
    const descHtml = category.description
      ? `<div class="result-card__description">${category.description}</div>`
      : "";
    
    // Badge for dominant
    const badgeHtml = isDominant && content.results?.dominantBadge
      ? `<span class="result-card__badge">${content.results.dominantBadge}</span>`
      : "";

    card.innerHTML = `
      <div class="result-card__title">${category.title}</div>
      ${descHtml}
      <div class="result-card__score">${category.sum}</div>
      ${rangeHtml}
      ${badgeHtml}
    `;
    cardsContainer.appendChild(card);
  });

  resultsGrid.appendChild(cardsContainer);

  // Interpretation section (for simple mode without analysis screen)
  if (!config.hasAnalysisScreen && resultsInterpretation) {
    showResultsInterpretation(scores, topCategories);
  }
};

const showResultsInterpretation = (scores, topCategories) => {
  const interpretationDiv = document.createElement("div");
  interpretationDiv.className = "results-interpretation";

  // Check for all-low scores (if threshold defined)
  const allLowThreshold = content.results?.allLowThreshold;
  const allLow = allLowThreshold && scores.every((c) => c.sum < allLowThreshold);

  if (allLow && content.results?.lowScores) {
    interpretationDiv.innerHTML = `
      <div class="results-interpretation__title">${content.results.lowScores}</div>
      <div class="results-interpretation__text">${content.results.lowScoresAction || ""}</div>
      ${content.results.worthIt ? `<div class="results-interpretation__text results-interpretation__text--highlight">${content.results.worthIt}</div>` : ""}
    `;
  } else {
    // Show top categories with descriptions
    const topList = topCategories.map((d) => `<strong>${d.title}</strong> (${d.sum})`).join(", ");
    const topDescriptions = topCategories.map((d) => `
      <div class="results-interpretation__driver">
        <div class="results-interpretation__driver-title">${d.title}</div>
        <div class="results-interpretation__driver-description">${d.description || getInterpretation(d.sum, d)}</div>
      </div>
    `).join("");

    const titleText = content.results?.interpretationTitle || "הקטגוריות המובילות שלך:";
    
    interpretationDiv.innerHTML = `
      <div class="results-interpretation__title">${titleText}</div>
      <div class="results-interpretation__text">${topList}</div>
      ${topDescriptions}
      ${content.results?.note ? `<div class="results-interpretation__text">${content.results.note}</div>` : ""}
      ${content.results?.actionPlan ? `<div class="results-interpretation__text">${content.results.actionPlan}</div>` : ""}
      ${content.results?.worthIt ? `<div class="results-interpretation__text results-interpretation__text--highlight">${content.results.worthIt}</div>` : ""}
    `;
  }

  resultsInterpretation.appendChild(interpretationDiv);
};

// ═══════════════════════════════════════════════════════════════════════════
// Analysis Display (for tiered interpretation mode)
// ═══════════════════════════════════════════════════════════════════════════

const showAnalysis = () => {
  if (!analysisGrid) return;
  
  const scores = getCategoryScores();
  const sorted = [...scores].sort((a, b) => b.sum - a.sum);
  const dominant = getDominantCategories(scores);

  analysisGrid.innerHTML = "";

  sorted.forEach((category) => {
    const isDominant = dominant.some((d) => d.id === category.id);
    const interpretation = getInterpretation(category.sum, category);
    const card = document.createElement("div");
    card.className = `analysis-card ${isDominant ? "analysis-card--dominant" : ""}`;
    
    const descHtml = category.description
      ? `<div class="analysis-card__description">${category.description}</div>`
      : "";

    card.innerHTML = `
      <div class="analysis-card__header">
        <div>
          <div class="analysis-card__title">${category.title}</div>
          ${descHtml}
        </div>
        <div class="analysis-card__score">${category.sum}</div>
      </div>
      <p class="analysis-card__interpretation">${interpretation}</p>
    `;
    analysisGrid.appendChild(card);
  });

  // Reflection questions (if provided)
  if (content.analysis?.reflectionQuestions) {
    const reflectionSection = document.createElement("div");
    reflectionSection.className = "reflection-section";
    const questionsHtml = content.analysis.reflectionQuestions
      .map((q) => `<li>${q}</li>`)
      .join("");
    reflectionSection.innerHTML = `
      <h3 class="reflection-section__title">${content.analysis.reflectionTitle || "שאלות לרפלקציה"}</h3>
      <ul class="reflection-section__questions">${questionsHtml}</ul>
    `;
    analysisGrid.appendChild(reflectionSection);
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// Export Results
// ═══════════════════════════════════════════════════════════════════════════

const buildResultsMarkdown = () => {
  const scores = getCategoryScores();
  const sorted = [...scores].sort((a, b) => b.sum - a.sum);
  const dominant = getDominantCategories(scores);

  const lines = [
    `# ${content.markdown?.title || content.meta?.title || "תוצאות השאלון"}`,
    "",
  ];

  // Model context
  if (content.results?.modelContext) {
    lines.push(`> ${content.results.modelContext}`);
    lines.push("");
  }

  lines.push(`## ${content.markdown?.categoryScores || "ציונים לפי קטגוריה"}`);

  sorted.forEach((category) => {
    const isDominant = dominant.some((d) => d.id === category.id);
    const marker = isDominant ? " ⭐ (דומיננטי)" : "";
    lines.push(`- **${category.title}**: ${category.sum}${marker}`);
  });

  lines.push("");
  lines.push("---");
  lines.push("");

  // Dominant categories section
  lines.push(`## ${content.markdown?.dominantTitle || "הקטגוריות הדומיננטיות"}`);
  dominant.forEach((category) => {
    lines.push("");
    lines.push(`### ${category.title} (${category.sum})`);
    if (category.description) {
      lines.push(`- ${content.markdown?.descriptionLabel || "תיאור"}: ${category.description}`);
    }
    lines.push(`- ${getInterpretation(category.sum, category)}`);
  });

  // Development areas (low scores in tiered mode)
  if (config.interpretationMode === "tiered") {
    const developmentAreas = sorted.filter((c) => {
      if (!c.scoreRange) return false;
      const [min, max] = c.scoreRange;
      const range = max - min;
      const third = range / 3;
      return c.sum <= min + third;
    });

    if (developmentAreas.length > 0) {
      lines.push("");
      lines.push(`## ${content.markdown?.developmentAreas || "אזורי פיתוח"}`);
      developmentAreas.forEach((category) => {
        lines.push("");
        lines.push(`### ${category.title} (${category.sum})`);
        if (category.description) lines.push(`- ${category.description}`);
        if (category.interpretation?.low) lines.push(`- ${category.interpretation.low}`);
      });
    }
  }

  // Reflection questions
  if (content.analysis?.reflectionQuestions) {
    lines.push("");
    lines.push(`## ${content.analysis.reflectionTitle || "שאלות לרפלקציה"}`);
    content.analysis.reflectionQuestions.forEach((q) => {
      lines.push(`- ${q}`);
    });
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
  if (fillRandomButton) {
    fillRandomButton.addEventListener("click", () => {
      fillRandomAnswers();
      showResults();
      updateScreen(resultsScreen);
    });
  }

  // Restart
  if (restartButton) {
    restartButton.addEventListener("click", () => {
      answers.fill(null);
      scoreInputs.forEach((input) => {
        input.checked = false;
      });
      updateScreen(introScreen);
    });
  }

  // Back to questions
  if (backToQuestionsButton) {
    backToQuestionsButton.addEventListener("click", () => {
      updateQuestion();
      updateScreen(questionScreen);
    });
  }

  // Copy results
  if (copyResultsButton) {
    copyResultsButton.addEventListener("click", () => {
      copyResultsToClipboard();
    });
  }

  // Analysis screen navigation (if enabled)
  if (config.hasAnalysisScreen) {
    if (toAnalysisButton) {
      toAnalysisButton.addEventListener("click", () => {
        showAnalysis();
        updateScreen(analysisScreen);
      });
    }

    if (backToResultsButton) {
      backToResultsButton.addEventListener("click", () => {
        showResults();
        updateScreen(resultsScreen);
      });
    }

    if (backToQuestionsAnalysisButton) {
      backToQuestionsAnalysisButton.addEventListener("click", () => {
        updateQuestion();
        updateScreen(questionScreen);
      });
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// Start
// ═══════════════════════════════════════════════════════════════════════════

initApp();
