let content = null;

const introScreen = document.getElementById("intro");
const questionScreen = document.getElementById("question-screen");
const resultsScreen = document.getElementById("results");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const statementRight = document.getElementById("statement-right");
const statementLeft = document.getElementById("statement-left");
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");
const startButton = document.getElementById("start");
const fillRandomButton = document.getElementById("fill-random");
const backToQuestionsButton = document.getElementById("back-to-questions");
const restartButton = document.getElementById("restart");
const resultsGrid = document.getElementById("results-grid");
const analysisScreen = document.getElementById("analysis");
const analysisSummary = document.getElementById("analysis-summary");
const analysisGrid = document.getElementById("analysis-grid");
const insightsScreen = document.getElementById("insights");
const insightsGrid = document.getElementById("insights-grid");
const insightsSummary = document.getElementById("insights-summary");
const toAnalysisButton = document.getElementById("to-analysis");
const toInsightsButton = document.getElementById("to-insights");
const copyResultsButton = document.getElementById("copy-results");
const backToResultsButton = document.getElementById("back-to-results");
const backToQuestionsAnalysisButton = document.getElementById(
  "back-to-questions-analysis"
);
const backToAnalysisButton = document.getElementById("back-to-analysis");
const backToQuestionsInsightsButton = document.getElementById(
  "back-to-questions-insights"
);
const scoreInputs = Array.from(document.querySelectorAll("input[name='score']"));

let currentIndex = 0;
let answers = [];

const updateScreen = (screen) => {
  [
    introScreen,
    questionScreen,
    resultsScreen,
    analysisScreen,
    insightsScreen,
  ].forEach((section) => {
    section.classList.toggle("screen--active", section === screen);
  });
};

const updateQuestion = () => {
  const question = content.questions[currentIndex];
  statementRight.textContent = question.right;
  statementLeft.textContent = question.left;
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
    const [start, end] = category.range;
    const scores = answers.slice(start - 1, end);
    return {
      ...category,
      sum: scores.reduce((total, score) => total + score, 0),
    };
  });

const showResults = () => {
  resultsGrid.innerHTML = "";
  getCategoryScores().forEach((category) => {
    const card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `
      <div class="result-card__title">${category.title}</div>
      <div class="result-card__score">${category.sum}</div>
    `;
    resultsGrid.appendChild(card);
  });
};

const getAnalysisLabel = (score) => {
  if (score <= 6) {
    return { label: content.analysisLabels.reactive, tone: "reactive" };
  }
  if (score >= 11) {
    return { label: content.analysisLabels.proactive, tone: "proactive" };
  }
  return { label: content.analysisLabels.mixed, tone: "mixed" };
};

const showAnalysis = () => {
  const scores = getCategoryScores();
  analysisGrid.innerHTML = "";

  const reactiveCount = scores.filter((category) => category.sum <= 6).length;
  const proactiveCount = scores.filter((category) => category.sum >= 11).length;
  const reactiveRate = Math.round((reactiveCount / scores.length) * 100);

  analysisSummary.innerHTML = `
    <div class="analysis-summary__item">
      ${content.analysisSummary.extremeParams
        .replace("{reactive}", reactiveCount)
        .replace("{proactive}", proactiveCount)}
    </div>
    <div class="analysis-summary__item">
      ${content.analysisSummary.middleScores}
    </div>
    <div class="analysis-summary__item">
      ${content.analysisSummary.reactiveRate.replace("{rate}", reactiveRate)}
    </div>
  `;

  scores.forEach((category) => {
    const { label, tone } = getAnalysisLabel(category.sum);
    const card = document.createElement("div");
    card.className = `analysis-card analysis-card--${tone}`;
    card.innerHTML = `
      <div class="analysis-card__header">
        <div class="analysis-card__title">${category.title}</div>
        <div class="analysis-card__score">${category.sum}</div>
      </div>
      <div class="analysis-card__label">${label}</div>
      <p class="analysis-card__text">
        ${
          tone === "reactive"
            ? category.analysis.reactive
            : tone === "proactive"
              ? category.analysis.proactive
              : content.analysisLabels.mixedAnalysis
        }
      </p>
    `;
    analysisGrid.appendChild(card);
  });
};

const getSummaryBlock = (scores) => {
  const reactiveCount = scores.filter((category) => category.sum <= 6).length;
  const proactiveCount = scores.filter((category) => category.sum >= 11).length;
  const mixedCount = scores.length - reactiveCount - proactiveCount;

  if (proactiveCount > reactiveCount && proactiveCount > mixedCount) {
    return {
      title: content.summaryBlocks.proactive.title,
      items: [content.summaryBlocks.proactive.message],
    };
  }

  if (reactiveCount > proactiveCount && reactiveCount > mixedCount) {
    return {
      title: content.summaryBlocks.reactive.title,
      items: [content.summaryBlocks.reactive.message],
    };
  }

  return {
    title: content.summaryBlocks.mixed.title,
    items: [content.summaryBlocks.mixed.message],
  };
};

const showInsights = () => {
  const scores = getCategoryScores();
  insightsGrid.innerHTML = "";

  const relevantScores = scores.filter((category) => category.sum <= 10);
  if (relevantScores.length === 0) {
    insightsGrid.innerHTML = `
      <div class="insights__block">
        <h3>${content.insightsAllHigh.title}</h3>
        <p>${content.insightsAllHigh.message}</p>
      </div>
    `;
  } else {
    relevantScores.forEach((category) => {
      const insightData = content.insights[category.id];
      const label =
        category.sum <= 6
          ? content.insightsLabels.reactive
          : content.insightsLabels.mixed;
      const block = document.createElement("div");
      block.className = "insights__block";
      block.innerHTML = `
        <h3>${insightData.title}</h3>
        <div class="insights__score">${content.markdown.scoreLabel}: ${category.sum} (${label})</div>
        <ul>
          <li><strong>${content.markdown.insightLabel}:</strong> ${insightData.insight}</li>
          <li><strong>${content.markdown.actionLabel}:</strong> ${insightData.action}</li>
        </ul>
      `;
      insightsGrid.appendChild(block);
    });
  }

  const summary = getSummaryBlock(scores);
  insightsSummary.innerHTML = `
    <h3>${summary.title}</h3>
    <ul>
      ${summary.items.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  `;
};

const buildResultsMarkdown = () => {
  const scores = getCategoryScores();
  const summary = getSummaryBlock(scores);
  const analysisLines = scores.map((category) => {
    const { label } = getAnalysisLabel(category.sum);
    return `- **${category.title}**: ${category.sum} (${label})`;
  });

  const insightLines = scores
    .filter((category) => category.sum <= 10)
    .map((category) => {
      const insightData = content.insights[category.id];
      const label =
        category.sum <= 6
          ? content.insightsLabels.reactive
          : content.insightsLabels.mixed;
      return [
        `### ${insightData.title}`,
        `- ${content.markdown.scoreLabel}: ${category.sum} (${label})`,
        `- ${content.markdown.insightLabel}: ${insightData.insight}`,
        `- ${content.markdown.actionLabel}: ${insightData.action}`,
      ].join("\n");
    });

  const summaryBlock = summary.items.map((item) => `- ${item}`).join("\n");
  const insightsSection =
    insightLines.length > 0
      ? insightLines.join("\n\n")
      : content.markdown.allHighMessage;

  return [
    `# ${content.markdown.title}`,
    "",
    `## ${content.markdown.categoryScores}`,
    ...analysisLines,
    "",
    `## ${content.markdown.personalInsights}`,
    insightsSection,
    "",
    `## ${content.markdown.personalSummary}`,
    summaryBlock,
  ].join("\n");
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

const initApp = async () => {
  content = await fetch("./content.json").then((r) => r.json());
  answers = new Array(content.questions.length).fill(null);

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

  fillRandomButton.addEventListener("click", () => {
    fillRandomAnswers();
    showResults();
    updateScreen(resultsScreen);
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
    updateScreen(analysisScreen);
  });

  toInsightsButton.addEventListener("click", () => {
    showInsights();
    updateScreen(insightsScreen);
  });

  copyResultsButton.addEventListener("click", () => {
    copyResultsToClipboard();
  });

  backToResultsButton.addEventListener("click", () => {
    showResults();
    updateScreen(resultsScreen);
  });

  backToQuestionsAnalysisButton.addEventListener("click", () => {
    updateQuestion();
    updateScreen(questionScreen);
  });

  backToAnalysisButton.addEventListener("click", () => {
    showAnalysis();
    updateScreen(analysisScreen);
  });

  backToQuestionsInsightsButton.addEventListener("click", () => {
    updateQuestion();
    updateScreen(questionScreen);
  });
};

initApp();
