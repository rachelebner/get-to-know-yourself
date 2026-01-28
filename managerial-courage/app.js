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
const fillRandomButton = document.getElementById("fill-random");
const backToQuestionsButton = document.getElementById("back-to-questions");
const restartButton = document.getElementById("restart");
const resultsGrid = document.getElementById("results-grid");
const analysisGrid = document.getElementById("analysis-grid");
const toAnalysisButton = document.getElementById("to-analysis");
const copyResultsButton = document.getElementById("copy-results");
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
    resultsGrid.appendChild(card);
  });
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
};

const buildResultsMarkdown = () => {
  const scores = getCategoryScores();
  const sorted = [...scores].sort((a, b) => b.sum - a.sum);
  const dominant = getDominantDrivers(scores);
  
  const lines = [
    `# ${content.markdown.title}`,
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

const initApp = async () => {
  content = await fetch("./content.json").then((r) => r.json());
  answers = new Array(content.questions.length).fill(null);
  
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
};

initApp();
