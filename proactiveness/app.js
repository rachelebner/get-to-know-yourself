const questions = [
  {
    id: 1,
    right: "הצלחה בחיים היא בעיקר עניין של מזל והזדמנות שנקרתה בדרכי.",
    left: "הצלחה היא תוצאה ישירה של המאמץ והבחירות שאני עושה.",
  },
  {
    id: 2,
    right:
      "כשיש כישלון, אני בוחן קודם אילו סיבות חיצוניות מנעו את ההצלחה.",
    left: "כשיש כישלון, אני מחפש קודם מה אני יכולתי לעשות אחרת.",
  },
  {
    id: 3,
    right: "אני מאמין שיש לי יכולת מוגבלת לשנות את התרבות הארגונית סביבי.",
    left: "אני מאמין שההתנהגות הערכית שלי יכולה לעצב מחדש את הסביבה שלי.",
  },
  {
    id: 4,
    right: "אני מעדיף להשקיע את האנרגיה בפתרון מצוין של בעיות ההווה.",
    left: "אני מקדיש זמן קבוע לחשיבה על הצרכים והאתגרים של השנה הבאה.",
  },
  {
    id: 5,
    right: "תכנון מפורט מדי הוא בזבוז זמן כי המציאות ממילא משתנה.",
    left: "תכנון מוקדם הוא הדרך היחידה למנוע משברים עתידיים.",
  },
  {
    id: 6,
    right: "אני פועל הכי טוב בשטח-זמן קרוב שמכתיב לי את סדר העדיפויות.",
    left: "אני יוצר לעצמי משימות לטווח רחוק גם כשאין עליהן לחץ מיידי.",
  },
  {
    id: 7,
    right: "חשוב לי לא לעשות טעויות שיפגעו במוניטין או בתפקוד שלי.",
    left: "אני מוכן לטעות ולהיכשל כדי ללמוד ולנסות גישות חדשות.",
  },
  {
    id: 8,
    right: "אני זקוק לכל הנתונים והאישורים לפני שאני יוצא לדרך חדשה.",
    left: "אני מרגיש בנוח להתחיל לפעול גם כשהתמונה עדיין חלקית.",
  },
  {
    id: 9,
    right: "אני מעדיף שיטות עבודה מוכחות שעבדו היטב בעבר.",
    left: "אני נהנה לאתגר את הקיים ולנסות דרכים שטרם נוסו.",
  },
  {
    id: 10,
    right: "אני מעדיף לבצע משימות שבהן הכישורים שלי באים לידי ביטוי מובהק.",
    left: "אני בטוח ביכולתי להשתלט על תחומים חדשים לחלוטין.",
  },
  {
    id: 11,
    right: "במצבים מורכבים, אני מחפש הנחיה או מנהיגות של מישהו מנוסה.",
    left: "במצבים מורכבים, אני סומך על האינטואיציה והיכולת שלי להוביל.",
  },
  {
    id: 12,
    right: "קשה לי להאמין שהצלחה בודדת שלי תשנה מהלך אסטרטגי גדול.",
    left: "אני מאמין שיש לי את הכוח להניע שינויים משמעותיים בארגון.",
  },
  {
    id: 13,
    right: "אני ממוקד מאוד בביצוע איכותי של הגדרות התפקיד הנוכחיות שלי.",
    left: "אני כל הזמן סורק את הסביבה כדי למצוא הזדמנויות לשיפור.",
  },
  {
    id: 14,
    right: "אני מעדיף שאחרים יגדירו עבורי מהן הבעיות שדורשות פתרון.",
    left: "אני מזהה פערים וצרכים עוד לפני שהם עולים לדיון רשמי.",
  },
  {
    id: 15,
    right: "אני מתרכז בתחום המקצועי שלי ופחות במה שקורה במחלקות אחרות.",
    left: "אני מחפש באופן פעיל הקשרים וחיבורים בין תחומים שונים.",
  },
  {
    id: 16,
    right: "כשיש בעיה, חשוב לי קודם כל להבין לעומק למה היא קרתה.",
    left: "כשיש בעיה, הדחף הראשון שלי הוא לעשות משהו כדי לקדם פתרון.",
  },
  {
    id: 17,
    right: "אני נוטה להשקיע זמן רב בדיונים ושיח על הקשיים שבדרך.",
    left: "אני נוטה לחפש את \"הצעד הבא\" הקטן ביותר שאפשר לבצע מיד.",
  },
  {
    id: 18,
    right: "אני מעדיף להמתין עד שהפתרון האידיאלי יתגבש בראשי.",
    left: "אני מעדיף להתחיל עם פתרון חלקי ולשפר אותו תוך כדי תנועה.",
  },
];

const categories = [
  {
    id: "control",
    title: "מיקוד שליטה",
    range: [1, 3],
    analysis: {
      reactive:
        "מיקוד חיצוני: את/ה נוטה להרגיש שהנסיבות, המזל או החלטות של אחרים מעצבים את התוצאות שלך. זה עשוי להפחית יוזמה ולהגביר תחושת חוסר שליטה.",
      proactive:
        "מיקוד פנימי: את/ה מאמין/ה שההחלטות והפעולות שלך משפיעות ישירות על המציאות. גם כשקשה, את/ה שואל/ת \"מה האחריות שלי בזה?\" ומניע/ה שינוי.",
    },
  },
  {
    id: "future",
    title: "אוריינטציית עתיד",
    range: [4, 6],
    analysis: {
      reactive:
        "מיקוד בהווה: את/ה ממוקד/ת במשימות הקרובות ונמנע/ת מהסתכלות ארוכת טווח. זה עוזר להתכנס לביצוע, אך עלול לצמצם יוזמה קדימה.",
      proactive:
        "חשיבה עתידית: את/ה יוזם/ת תכנון קדימה ומניע/ה פעולות בהווה כדי לממש מטרות עתידיות. ההסתכלות הרחבה מחזקת בחירה מודעת.",
    },
  },
  {
    id: "risk",
    title: "נכונות לסיכון",
    range: [7, 9],
    analysis: {
      reactive:
        "שאיפה לביטחון: את/ה מעדיף/ה להסתמך על שיטות מוכחות ולמזער טעויות. המחיר עלול להיות איטיות בחדשנות.",
      proactive:
        "תעוזה מחושבת: את/ה מוכן/ה לפעול גם בתנאי אי־ודאות ולהתנסות. הנכונות לקחת סיכונים מאפשרת פריצות דרך.",
    },
  },
  {
    id: "efficacy",
    title: "תחושת מסוגלות",
    range: [10, 12],
    analysis: {
      reactive:
        "הסתמכות על הקיים: את/ה נוטה לפעול בגבולות המוכר והבטוח. זה תורם לביצוע יציב, אבל יכול לצמצם צמיחה.",
      proactive:
        "אמונה ביכולת השפעה: את/ה מאמין/ה ביכולתך ללמוד מהר ולהוביל שינוי. הגישה הזו מאפשרת ליזום מהלכים גדולים יותר.",
    },
  },
  {
    id: "environment",
    title: "הקשבה סביבתית",
    range: [13, 15],
    analysis: {
      reactive:
        "מיקוד ביצוע: את/ה מתרכז/ת במשימות הישירות ופחות בקשרים רוחביים. לפעמים זה מפספס הזדמנויות חיבור.",
      proactive:
        "סריקה פעילה: את/ה שם/ה לב למגמות, קשרים ופערים בין תחומים. זה מאפשר לזהות הזדמנויות לפני אחרים.",
    },
  },
  {
    id: "action",
    title: "הנעה לפעולה",
    range: [16, 18],
    analysis: {
      reactive:
        "ניתוח לפני תנועה: את/ה נוטה לעכב פעולה עד להבנה מלאה. זה מספק עומק, אך יכול להאט התקדמות.",
      proactive:
        "דחיפה לביצוע: את/ה נוטה להתחיל צעד קטן ומהיר כדי להתקדם, גם אם הפתרון עדיין לא מושלם.",
    },
  },
];

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
const answers = new Array(questions.length).fill(null);

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
  const question = questions[currentIndex];
  statementRight.textContent = question.right;
  statementLeft.textContent = question.left;
  progressText.textContent = `שאלה ${question.id} מתוך ${questions.length}`;
  const progress = ((currentIndex + 1) / questions.length) * 100;
  progressFill.style.width = `${progress}%`;
  prevButton.disabled = currentIndex === 0;
  nextButton.textContent = currentIndex === questions.length - 1 ? "סיום" : "הבא";
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
  categories.map((category) => {
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
    return { label: "ציון תגובתי (3-6)", tone: "reactive" };
  }
  if (score >= 11) {
    return { label: "ציון פרואקטיבי (11-15)", tone: "proactive" };
  }
  return { label: "ציון מעורב (7-10)", tone: "mixed" };
};

const showAnalysis = () => {
  const scores = getCategoryScores();
  analysisGrid.innerHTML = "";

  const reactiveCount = scores.filter((category) => category.sum <= 6).length;
  const proactiveCount = scores.filter((category) => category.sum >= 11).length;
  const mixedCount = scores.length - reactiveCount - proactiveCount;
  const reactiveRate = Math.round((reactiveCount / scores.length) * 100);

  analysisSummary.innerHTML = `
    <div class="analysis-summary__item">
      הפרמטרים הבולטים שקיבלו ציון קיצוני: ${reactiveCount} תגובתיים, ${proactiveCount}
      פרואקטיביים.
    </div>
    <div class="analysis-summary__item">
      ציוני הביניים מצביעים על דפוס התנהלות תלוי סיטואציה בפרמטר הרלוונטי.
    </div>
    <div class="analysis-summary__item">
      מדד תגובתיות: ${reactiveRate}% מהפרמטרים נמצאים בטווח 3-6.
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
              : "הציון מצביע על שילוב בין תגובתיות לפרואקטיביות. מומלץ לבדוק אילו מצבים מוציאים ממך יוזמה גבוהה יותר, ולחזק אותם."
        }
      </p>
    `;
    analysisGrid.appendChild(card);
  });
};

const insightsContent = {
  control: {
    title: "חיזוק מיקוד השליטה (מעבר מ״מקורבן״ ל״משפיע״)",
    insight:
      "אם הציון שלך נמוך, ייתכן שאת/ה מרגיש/ה שהנסיבות גדולות ממך.",
    action:
      "בכל פעם שאת/ה נתקע/ת, שאל/י את עצמך מה הדבר האחד שנמצא בשליטה שלך, והעבר/י אותו מ״מעגל ההשפעה״ ל״מעגל הדאגה״.",
  },
  future: {
    title: "פיתוח אוריינטציית עתיד (מעבר מ״כיבוי שריפות״ ל״תכנון״)",
    insight:
      "ציון נמוך מעיד על עבודה במצב תגובתי וניהול משברים בלתי פוסק.",
    action:
      "הקדש/י 15 דקות בבוקר או שעה בסוף שבוע לסימון ״בעיית עתיד״ אחת ולנסח פעולה קטנה שתקדם אותה בשבוע הקרוב.",
  },
  risk: {
    title: "העפת סיכונים מחושבים (מעבר מ״קיפאון״ ל״ניסוי״)",
    insight:
      "ציון נמוך נובע לרוב מחשש מטעויות או מרצון בביטחון מוחלט.",
    action:
      "במקום להחליט על פרויקט ענק ומפחיד, בצע/י ״ניסויים קטנים״ (Safe-to-fail) שמאפשרים ללמוד בלי סיכון אישי.",
  },
  efficacy: {
    title: "העלאת תחושת מסוגלות (מעבר מ״היסוס״ ל״אמונה״)",
    insight:
      "אם הציון נמוך, ייתכן שאת/ה ממעיט/ה בערך היכולת שלך להניע שינוי.",
    action:
      "תעד/י מקרים שבהם פתרת בעיה או למדת משהו חדש. בנוסף, מצא/י ״מודל לחיקוי״ – אדם שדומה לך והצליח, ולמד/י מה הצעד הראשון שהוא עשה.",
  },
  environment: {
    title: "הרחבת הקשבה סביבתית (מעבר מ״מיקוד צר״ ל״ראיית הקשר״)",
    insight:
      "ציון נמוך מצביע על כך שאת/ה ממוקד/ת מאוד במשימה שלך ומפספס/ת הזדמנויות מסביב.",
    action:
      "פעם בשבוע קבע/י ״קפה״ עם קולגה ממחלקה אחרת, והקשב/י לאתגרים של לקוחות או של צוותים אחרים. שאל/י את עצמך: מה חסר כאן שאיש עדיין לא שם לב?",
  },
  action: {
    title: "מעבר ממיקוד בבעיה לפעולה (מעבר מ״ניתוח״ ל״יישום״)",
    insight:
      "ציון נמוך מעיד על נטייה להיתקע בשלב הסבירות או בניתוח המעמיק (Analysis Paralysis).",
    action:
      "מצא/י את ״חוק 5 הדקות״: ברגע שעולה בעיה, הקצב/י 5 דקות לפעולה הראשונה. אל תחפשי/י את הפתרון המושלם – חפש/י את ה‑MVP (Minimum Viable Product) – הפעולה הקטנה ביותר שתתחיל תנועה.",
  },
};

const getSummaryBlock = (scores) => {
  const reactiveCount = scores.filter((category) => category.sum <= 6).length;
  const proactiveCount = scores.filter((category) => category.sum >= 11).length;
  const mixedCount = scores.length - reactiveCount - proactiveCount;

  if (proactiveCount > reactiveCount && proactiveCount > mixedCount) {
    return {
      title: "סיכום אישי",
      items: [
        "את/ה אדם פרואקטיבי מאוד. האתגר שלך עשוי להיות סבלנות כלפי אחרים או עבודה בצוותים פחות יזמיים.",
      ],
    };
  }

  if (reactiveCount > proactiveCount && reactiveCount > mixedCount) {
    return {
      title: "סיכום אישי",
      items: [
        "הסגנון שלך מגיב ומחושב. כדי להגביר פרואקטיביות, נסה/י לבחור ״מנוף״ אחד (למשל: מעבר מבעיה לפעולה) ולהתאמן עליו בשבוע הקרוב.",
      ],
    };
  }

  return {
    title: "סיכום אישי",
    items: [
      "יש לך אזורים שבהם את/ה יוזמ/ת ואחרים שבהם את/ה נמנע/ת. הבנה של ״למה״ (למשל: ״אני מאמין בעצמי אבל מפחד מסיכון״) היא המפתח לצמיחה שלך.",
    ],
  };
};

const showInsights = () => {
  const scores = getCategoryScores();
  insightsGrid.innerHTML = "";

  const relevantScores = scores.filter((category) => category.sum <= 10);
  if (relevantScores.length === 0) {
    insightsGrid.innerHTML = `
      <div class="insights__block">
        <h3>נפלא! כל הציונים שלך גבוהים</h3>
        <p>המשיכ/י לשמר את ההרגלים הפרואקטיביים ולחזק אותם לאורך זמן.</p>
      </div>
    `;
  } else {
    relevantScores.forEach((category) => {
      const { title, insight, action } = insightsContent[category.id];
      const label = category.sum <= 6 ? "תגובתי" : "מעורב";
      const block = document.createElement("div");
      block.className = "insights__block";
      block.innerHTML = `
        <h3>${title}</h3>
        <div class="insights__score">ציון: ${category.sum} (${label})</div>
        <ul>
          <li><strong>התובנה:</strong> ${insight}</li>
          <li><strong>מה כדאי לעשות:</strong> ${action}</li>
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
      const { title, insight, action } = insightsContent[category.id];
      const label = category.sum <= 6 ? "תגובתי" : "מעורב";
      return [
        `### ${title}`,
        `- ציון: ${category.sum} (${label})`,
        `- תובנה: ${insight}`,
        `- מה כדאי לעשות: ${action}`,
      ].join("\n");
    });

  const summaryBlock = summary.items.map((item) => `- ${item}`).join("\n");
  const insightsSection =
    insightLines.length > 0
      ? insightLines.join("\n\n")
      : "כל הציונים גבוהים – המשך לשמר את ההרגלים הפרואקטיביים.";

  return [
    "# תוצאות אבחון עצמי",
    "",
    "## ציונים לפי קטגוריה",
    ...analysisLines,
    "",
    "## תובנות אישיות",
    insightsSection,
    "",
    "## סיכום אישי",
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

scoreInputs.forEach((input) => {
  input.addEventListener("change", (event) => {
    setAnswer(Number(event.target.value));
  });
});

nextButton.addEventListener("click", () => {
  if (currentIndex < questions.length - 1) {
    currentIndex += 1;
    updateQuestion();
    return;
  }
  showResults();
  updateScreen(resultsScreen);
});

prevButton.addEventListener("click", () => {
  if (currentIndex > 0) {
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
