let content = null;

const introScreen = document.getElementById("intro");
const questionScreen = document.getElementById("question-screen");
const resultsScreen = document.getElementById("results");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const questionText = document.getElementById("question-text");
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");
const startButton = document.getElementById("start");
const fillRandomButton = document.getElementById("fill-random");
const backToQuestionsButton = document.getElementById("back-to-questions");
const restartButton = document.getElementById("restart");
const copyResultsButton = document.getElementById("copy-results");
const totalScoreEl = document.getElementById("total-score");
const percentageScoreEl = document.getElementById("percentage-score");
const interpretationTitle = document.getElementById("interpretation-title");
const interpretationText = document.getElementById("interpretation-text");
const scoreInputs = Array.from(document.querySelectorAll("input[name='score']"));

let currentIndex = 0;
let answers = [];

const updateScreen = (screen) => {
  [introScreen, questionScreen, resultsScreen].forEach((section) => {
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

const showResults = () => {
  const { total, percentage } = calculateScores();
  const interpretation = getInterpretation(percentage);

  totalScoreEl.textContent = total;
  percentageScoreEl.textContent = percentage;
  interpretationTitle.textContent = interpretation.title;
  interpretationText.textContent = interpretation.description;
};

const buildResultsMarkdown = () => {
  const { total, percentage } = calculateScores();
  const interpretation = getInterpretation(percentage);

  return [
    `# ${content.markdown.title}`,
    "",
    `## ${content.markdown.totalScore}`,
    `${total} מתוך 100`,
    "",
    `## ${content.markdown.percentageScore}`,
    `${percentage}%`,
    "",
    `## ${content.markdown.interpretation}`,
    `**${interpretation.title}**`,
    "",
    interpretation.description,
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

  copyResultsButton.addEventListener("click", () => {
    copyResultsToClipboard();
  });
};

initApp();
