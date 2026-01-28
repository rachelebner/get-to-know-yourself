let content = null;

const introScreen = document.getElementById("intro");
const questionScreen = document.getElementById("question-screen");
const resultsScreen = document.getElementById("results");
const detailsScreen = document.getElementById("details");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const questionStatement = document.getElementById("question-statement");
const scaleLabel1 = document.getElementById("scale-label-1");
const scaleLabel2 = document.getElementById("scale-label-2");
const scaleLabel3 = document.getElementById("scale-label-3");
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");
const startButton = document.getElementById("start");
const fillRandomButton = document.getElementById("fill-random");
const backToQuestionsButton = document.getElementById("back-to-questions");
const backToQuestionsDetailsButton = document.getElementById("back-to-questions-details");
const restartButton = document.getElementById("restart");
const resultsGrid = document.getElementById("results-grid");
const detailsGrid = document.getElementById("details-grid");
const toDetailsButton = document.getElementById("to-details");
const backToResultsButton = document.getElementById("back-to-results");
const copyResultsButton = document.getElementById("copy-results");
const scoreInputs = Array.from(document.querySelectorAll("input[name='score']"));

let currentIndex = 0;
let answers = [];

const updateScreen = (screen) => {
  [introScreen, questionScreen, resultsScreen, detailsScreen].forEach((section) => {
    section.classList.toggle("screen--active", section === screen);
  });
};

const updateQuestion = () => {
  const question = content.questions[currentIndex];
  questionStatement.textContent = question.text;
  progressText.textContent = content.ui.questionOf
    .replace("{current}", question.id)
    .replace("{total}", content.questions.length);
  const progress = ((currentIndex + 1) / content.questions.length) * 100;
  progressFill.style.width = `${progress}%`;
  
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
    answers[i] = Math.floor(Math.random() * 3) + 1;
  }
};

const getCircleScores = () =>
  content.circles.map((circle) => {
    const questionIds = circle.subCategories.flatMap((sub) => sub.questionIds);
    const scores = questionIds.map((id) => answers[id - 1]).filter((s) => s !== null);
    const sum = scores.reduce((total, score) => total + score, 0);
    return {
      ...circle,
      sum,
      maxScore: questionIds.length * 3,
    };
  });

const getSubCategoryScores = () => {
  const allSubCategories = [];
  content.circles.forEach((circle) => {
    circle.subCategories.forEach((subCategory) => {
      const scores = subCategory.questionIds
        .map((id) => answers[id - 1])
        .filter((s) => s !== null);
      const sum = scores.reduce((total, score) => total + score, 0);
      allSubCategories.push({
        ...subCategory,
        circleId: circle.id,
        circleTitle: circle.title,
        circleSubtitle: circle.subtitle,
        sum,
        maxScore: subCategory.questionIds.length * 3,
      });
    });
  });
  return allSubCategories;
};

const showResults = () => {
  resultsGrid.innerHTML = "";
  getCircleScores().forEach((circle) => {
    const card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `
      <div class="result-card__title">${circle.title}</div>
      <div class="result-card__subtitle">${circle.subtitle}</div>
      <div class="result-card__score">${circle.sum}</div>
      <div class="result-card__max">${content.markdown.maxScore}: ${circle.maxScore}</div>
    `;
    resultsGrid.appendChild(card);
  });
};

const showDetails = () => {
  detailsGrid.innerHTML = "";
  const circleScores = getCircleScores();
  
  content.circles.forEach((circle) => {
    const circleScore = circleScores.find((c) => c.id === circle.id);
    const circleDiv = document.createElement("div");
    circleDiv.className = "details__circle";
    
    const subCategories = circle.subCategories.map((subCategory) => {
      const scores = subCategory.questionIds
        .map((id) => answers[id - 1])
        .filter((s) => s !== null);
      const sum = scores.reduce((total, score) => total + score, 0);
      return {
        ...subCategory,
        sum,
        maxScore: subCategory.questionIds.length * 3,
      };
    });
    
    const subCategoriesHtml = subCategories
      .map(
        (sub) => `
      <div class="details__subcategory">
        <div class="details__subcategory-title">${sub.title}</div>
        <div class="details__subcategory-description">${sub.description}</div>
        <div class="details__subcategory-score">${sub.sum} / ${sub.maxScore}</div>
      </div>
    `
      )
      .join("");
    
    circleDiv.innerHTML = `
      <div class="details__circle-header">
        <div class="details__circle-title">${circle.title}</div>
        <div class="details__circle-subtitle">${circle.subtitle}</div>
        <div class="details__circle-score">${circleScore.sum} / ${circleScore.maxScore}</div>
      </div>
      <div class="details__subcategories">
        ${subCategoriesHtml}
      </div>
    `;
    detailsGrid.appendChild(circleDiv);
  });
};

const buildResultsMarkdown = () => {
  const circleScores = getCircleScores();
  const subCategoryScores = getSubCategoryScores();
  
  const circleLines = circleScores.map(
    (circle) => `- **${circle.title}** (${circle.subtitle}): ${circle.sum} / ${circle.maxScore}`
  );
  
  const detailsLines = [];
  content.circles.forEach((circle) => {
    detailsLines.push(`### ${circle.title} (${circle.subtitle})`);
    const circleSubCategories = subCategoryScores.filter(
      (sub) => sub.circleId === circle.id
    );
    circleSubCategories.forEach((sub) => {
      detailsLines.push(
        `- **${sub.title}** (${sub.description}): ${sub.sum} / ${sub.maxScore}`
      );
    });
    detailsLines.push("");
  });
  
  return [
    `# ${content.markdown.title}`,
    "",
    `## ${content.markdown.circleScores}`,
    ...circleLines,
    "",
    `## ${content.markdown.subCategoryScores}`,
    ...detailsLines,
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
  
  scaleLabel1.textContent = content.intro.scaleLabels["1"];
  scaleLabel2.textContent = content.intro.scaleLabels["2"];
  scaleLabel3.textContent = content.intro.scaleLabels["3"];

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

  backToQuestionsDetailsButton.addEventListener("click", () => {
    updateQuestion();
    updateScreen(questionScreen);
  });

  toDetailsButton.addEventListener("click", () => {
    showDetails();
    updateScreen(detailsScreen);
  });

  backToResultsButton.addEventListener("click", () => {
    showResults();
    updateScreen(resultsScreen);
  });

  copyResultsButton.addEventListener("click", () => {
    copyResultsToClipboard();
  });
};

initApp();
