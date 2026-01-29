import { isTestMode, insertTestModeIndicator, updateBackLinks } from '../../lib/testmode.js';
import { isMobile, copyAsMarkdown, copyAsRichText, shareNative, canShare } from '../../lib/share.js';

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
const backToQuestionsButton = document.getElementById("back-to-questions");
const backToQuestionsDetailsButton = document.getElementById("back-to-questions-details");
const restartButton = document.getElementById("restart");
const resultsGrid = document.getElementById("results-grid");
const detailsGrid = document.getElementById("details-grid");
const toDetailsButton = document.getElementById("to-details");
const backToResultsButton = document.getElementById("back-to-results");
const shareButtonsContainer = document.getElementById("share-buttons-container");
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
    `# ${content.markdown.title}`,
    "",
    `## ${content.markdown.circleScores}`,
    ...circleLines,
    "",
    `## ${content.markdown.subCategoryScores}`,
    ...detailsLines
  );

  // Test mode Q&A table at end
  if (isTestMode()) {
    lines.push("---");
    lines.push("");
    lines.push("## פירוט התשובות (מילוי אקראי)");
    lines.push("| מספר שאלה | תשובה שנבחרה |");
    lines.push("|-----------|--------------|");
    answers.forEach((answer, index) => {
      lines.push(`| ${index + 1} | ${answer} |`);
    });
  }

  return lines.join("\n");
};

const buildResultsRichText = () => {
  const circleScores = getCircleScores();
  const subCategoryScores = getSubCategoryScores();
  
  const circleItems = circleScores.map(
    (circle) => `<li><strong>${circle.title}</strong> (${circle.subtitle}): ${circle.sum} / ${circle.maxScore}</li>`
  ).join('');
  
  const detailsSections = [];
  content.circles.forEach((circle) => {
    const circleSubCategories = subCategoryScores.filter(
      (sub) => sub.circleId === circle.id
    );
    const subCategoryItems = circleSubCategories.map((sub) => 
      `<li><strong>${sub.title}</strong> (${sub.description}): ${sub.sum} / ${sub.maxScore}</li>`
    ).join('');
    
    detailsSections.push(`
      <div style="margin-bottom: 24px;">
        <h3 style="margin-bottom: 12px;">${circle.title} (${circle.subtitle})</h3>
        <ul style="margin: 0; padding-right: 20px;">${subCategoryItems}</ul>
      </div>
    `);
  });

  // Test mode warning
  const testModeWarning = isTestMode() ? `
    <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
      <div style="font-weight: bold; color: #856404;">⚠️ תוצאות בדיקה - דוגמה על בסיס מילוי אקראי</div>
      <div style="font-weight: bold; color: #856404;">⚠️ לא תוצאות אמיתיות</div>
    </div>
  ` : '';

  // Test mode Q&A table
  const testModeTable = isTestMode() ? `
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
        ${answers.map((answer, index) => `
          <tr>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${index + 1}</td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${answer}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : '';
  
  return `
    ${testModeWarning}
    <h1>${content.markdown.title}</h1>
    <h2>${content.markdown.circleScores}</h2>
    <ul>${circleItems}</ul>
    <h2>${content.markdown.subCategoryScores}</h2>
    ${detailsSections.join('')}
    ${testModeTable}
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
    setupShareButtons();
    updateScreen(detailsScreen);
  });

  backToResultsButton.addEventListener("click", () => {
    showResults();
    updateScreen(resultsScreen);
  });
};

initApp();
