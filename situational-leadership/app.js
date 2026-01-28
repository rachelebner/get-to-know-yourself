// ═══════════════════════════════════════════════════════════════════════════
// שאלון ניהול מצבי - Situational Leadership Questionnaire
// Based on Hersey & Blanchard's Situational Leadership Theory
// ═══════════════════════════════════════════════════════════════════════════

// Leadership styles
const STYLES = {
  directing: {
    id: "directing",
    title: "מכוון",
    subtitle: "גבוה במשימה, נמוך באנשים",
    description: "נותן הוראות, מגדיר תפקידים, מפקח מקרוב",
    effective: "נראה כמי שיודע מה הוא רוצה, ולשם כך כופה את שיטותיו, אך מבלי לעורר דחייה.",
    ineffective: "נראה כמי שלא בוטח באחרים, אדם לא נעים, מעוניין רק בתוצאות מידיות.",
  },
  coaching: {
    id: "coaching",
    title: "מדריך",
    subtitle: "גבוה במשימה, גבוה באנשים",
    description: "מוכר, משכנע, מסביר החלטות",
    effective: "אדם המניע לעבודה, מציב סטנדרטים אישיים גבוהים, מתייחס לכל עובד בצורה הייחודית המתאימה לו, מעדיף לנהל את עובדיו כקבוצה מלוכדת.",
    ineffective: "מנסה להיות נחמד לכולם ולהשביע רצון כל אחד מעובדיו. כתוצאה מכך נאלץ לתמרן לכל הכיוונים כדי למנוע לחצים.",
  },
  supporting: {
    id: "supporting",
    title: "תומך",
    subtitle: "נמוך במשימה, גבוה באנשים",
    description: "משתף, מקשיב, מעודד",
    effective: "נראה כמי שיש לו אמון בסיסי באנשים. מתעניין בכישורים של עובדיו ומשתדל לפתח אותם.",
    ineffective: "רוצה שיחשבו עליו שהוא 'אדם טוב', חושש מאבדן קשר בינאישי עם כפיפיו, אפילו במחיר פגיעה במשימות.",
  },
  delegating: {
    id: "delegating",
    title: "מאציל",
    subtitle: "נמוך במשימה, נמוך באנשים",
    description: "מעביר אחריות, לא מתערב",
    effective: "נותן לכפיפיו להחליט כיצד תתנהל העבודה, ממלא תפקיד מסוים בקשרים החברתיים בניהם.",
    ineffective: "לא מעורב, פאסיבי, לא מגלה אכפתיות בנוגע למשימה או למעורבים בה.",
  },
};

// Questions data - each question has scenario, options (א-ד), and mapping to styles + scores
const QUESTIONS = [
  {
    id: 1,
    scenario: "כפיפיך אינם נענים ליחס החברי שאתה מפגין כלפיהם. תפקודם הולך ויורד.",
    options: [
      { id: "א", text: "הדגש את הצורך בשמירה על נהלים ובביצוע המשימות." },
      { id: "ב", text: "הצע לקיים שיחה אך אל תלחץ יותר מדי." },
      { id: "ג", text: "שוחח איתם ואז קבע יעדים." },
      { id: "ד", text: "אל תתערב." },
    ],
    mapping: {
      "א": { style: "directing", score: 2 },
      "ב": { style: "supporting", score: -1 },
      "ג": { style: "coaching", score: 1 },
      "ד": { style: "delegating", score: -2 },
    },
  },
  {
    id: 2,
    scenario: "תפקוד הצוות שלך בעליה. וידאת שכל חברי הצוות מודעים לתחומי אחריותם ולרמת הביצוע הנדרשת מהם.",
    options: [
      { id: "א", text: "השתדל לפתח יחס אישי וידידותי כלפי כפיפיך, אך המשך לוודא שהם מודעים למוטל עליהם." },
      { id: "ב", text: "אל תעשה כלום." },
      { id: "ג", text: "עשה ככל שתוכל להקנות לצוות הרגשת חשיבות ומעורבות." },
      { id: "ד", text: "הדגש בפניהם את חשיבות השמירה על מילוי משימות ועמידה בלוח זמנים." },
    ],
    mapping: {
      "א": { style: "coaching", score: 2 },
      "ב": { style: "delegating", score: -2 },
      "ג": { style: "supporting", score: 1 },
      "ד": { style: "directing", score: -1 },
    },
  },
  {
    id: 3,
    scenario: "הצוות שלך לא מצליח לפתור בעיה מסוימת. עד כה נהגת לא להתעמת ולאפשר להם לפתור דברים בעצמם. התפקוד הקבוצתי והיחסים הבינאישיים בצוות טובים.",
    options: [
      { id: "א", text: "עבוד יחד עם הצוות על פתרון הבעיה." },
      { id: "ב", text: "תן לצוות למצוא פתרון בעצמו." },
      { id: "ג", text: "פעל במהירות ובתקיפות כדי לתקן ולכוון מחדש." },
      { id: "ד", text: "עודד את כפיפיך לטפל בעיה ותן חיזוקים למאמציהם." },
    ],
    mapping: {
      "א": { style: "coaching", score: 1 },
      "ב": { style: "delegating", score: -1 },
      "ג": { style: "directing", score: -2 },
      "ד": { style: "supporting", score: 2 },
    },
  },
  {
    id: 4,
    scenario: "אתה שוקל עריכת שינוי משמעותי בתהליכי העבודה. לכפיפיך מסורת של הישגים יפים. הם ערים לצורך בשינוי.",
    options: [
      { id: "א", text: "נסה ליצור מעורבות קבוצתית בגיבוש השינוי, אבל אל תכוון יותר מדי." },
      { id: "ב", text: "הודע על השינויים, הקפד על הכנסתם תוך בקרה צמודה וודא את יישומם." },
      { id: "ג", text: "תן לצוות לגבש בעצמו את הכיוון העתידי." },
      { id: "ד", text: "שקול את ההמלצות העולות מהצוות אבל כוון בעצמך את השינוי." },
    ],
    mapping: {
      "א": { style: "supporting", score: 1 },
      "ב": { style: "directing", score: -2 },
      "ג": { style: "delegating", score: 2 },
      "ד": { style: "coaching", score: -1 },
    },
  },
  {
    id: 5,
    scenario: "תפקוד הצוות התדרדר במשך החודשים האחרונים. חברים בצוות מגלים חוסר אכפתיות. בעבר הצלחת להביא לשקט יחסי על ידי הגדרה מחודשת של תפקידים ותחומי אחריות. חברי הצוות נזקקו בתכיפות לתזכורות לגבי עמידה בלוח הזמנים.",
    options: [
      { id: "א", text: "תן לחברי הקבוצה אפשרות לגבש את הכיוון שלהם." },
      { id: "ב", text: "שקול המלצות הקבוצה אך ודא כי היעדים אכן מושגים." },
      { id: "ג", text: "הגדר תפקידים ומשימות מחדש ופקח מקרוב על הביצוע." },
      { id: "ד", text: "שתף את הצוות בהגדרת תפקידיהם ותחומי האחריות, אך אל תכוון יותר מדי." },
    ],
    mapping: {
      "א": { style: "delegating", score: -2 },
      "ב": { style: "coaching", score: 1 },
      "ג": { style: "directing", score: 2 },
      "ד": { style: "supporting", score: -1 },
    },
  },
  {
    id: 6,
    scenario: "הגעת כמנהל חדש לפרויקט המתנהל ביעילות כאשר מנהלו הקודם שלט בו בתקיפות. אתה רוצה לשמור על רמת ביצוע אך גם להתחיל ביצירת יחסים חבריים יותר.",
    options: [
      { id: "א", text: "השתדל להקנות לצוות הרגשת חשיבות ומעורבות." },
      { id: "ב", text: "הדגש את החשיבות שאתה רואה במילוי כל המשימות המוטלות על הצוות תוך עמידה בלוח הזמנים." },
      { id: "ג", text: "אל תתערב." },
      { id: "ד", text: "שתף את הצוות בתהליכי קבלת ההחלטות שלך ובמקביל הקפד על כך שהמשימות יבוצעו." },
    ],
    mapping: {
      "א": { style: "supporting", score: -1 },
      "ב": { style: "directing", score: 1 },
      "ג": { style: "delegating", score: -2 },
      "ד": { style: "coaching", score: 2 },
    },
  },
  {
    id: 7,
    scenario: "אתה עומד בפני יישום המלצה בדבר מעבר למבנה ארגוני חדש. בדיון שערכת עם כפיפיך הועלו מספר הצעות. הצוות בדרך כלל יעיל ומגלה גמישות בתפקידו.",
    options: [
      { id: "א", text: "קבע את השינוי ופקח על החדרתו." },
      { id: "ב", text: "שתף את הקבוצה בגיבוש השינוי והרשה להם לארגן את יישומו." },
      { id: "ג", text: "גלה נכונות להצעות הצוות בדבר השינוי, אך עמוד על המשמר בזמן היישום." },
      { id: "ד", text: "הנח לכפיפיך לעבד בעצמם את השינויים העתידיים. אל תיכנס איתם לעימות." },
    ],
    mapping: {
      "א": { style: "directing", score: -2 },
      "ב": { style: "supporting", score: 2 },
      "ג": { style: "coaching", score: -1 },
      "ד": { style: "delegating", score: 1 },
    },
  },
  {
    id: 8,
    scenario: "התפקוד הקבוצתי והיחסים הבינאישיים בצוות טובים. אתה חש קצת אי נוחות משום שלהרגשתך אינך מכוון מספיק את כפיפיך.",
    options: [
      { id: "א", text: "הנח להם." },
      { id: "ב", text: "קיים עם הצוות שיחה על המצב והצע שינויים." },
      { id: "ג", text: "התחל לכוון את כפיפיך. הצמד אליהם יותר." },
      { id: "ד", text: "זמן שיחה קבוצתית עם הצוות, אמור להם את דעתך, תן להם חיזוקים, סמן להם כיוון." },
    ],
    mapping: {
      "א": { style: "delegating", score: 2 },
      "ב": { style: "coaching", score: 1 },
      "ג": { style: "directing", score: -2 },
      "ד": { style: "supporting", score: -1 },
    },
  },
  {
    id: 9,
    scenario: "מונית להיות מנהל פרויקט חדשני, אך הצוות אינו עומד בלוח הזמנים שהוקצב לו. לצוות לא ברורים היעדים, ההשתתפות במפגשים דלה, הישיבות הפכו למפגשים חברתיים. לחברי הצוות יש את הכישורים לקדם את הפרויקט.",
    options: [
      { id: "א", text: "הנח לחברי הצוות להבחין בבעיה בעצמם." },
      { id: "ב", text: "שקול את המלצת הצוות, תוך הקפדה על כך שיעדיו אכן מושגים." },
      { id: "ג", text: "הגדר יעדים מחדש ופקח על העמידה בהם." },
      { id: "ד", text: "שתף את חברי הצוות בניסיון לקבוע יעדים, אך אל תלחץ עליהם יותר מדי." },
    ],
    mapping: {
      "א": { style: "delegating", score: -2 },
      "ב": { style: "coaching", score: 1 },
      "ג": { style: "directing", score: 2 },
      "ד": { style: "supporting", score: -1 },
    },
  },
  {
    id: 10,
    scenario: "הכפיפים שלך מסוגלים בדרך כלל לקבל אחריות, אבל עכשיו אינם נענים לתביעותיך האחרונות לגבי הגדרת נורמות של ביצוע.",
    options: [
      { id: "א", text: "דון עם הקבוצה בהגדרה מחודשת של נורמות הביצוע, אך אל תהיה יותר מדי דומיננטי בדיון." },
      { id: "ב", text: "הגדר מחדש את הנורמות ופקח על ביצוען." },
      { id: "ג", text: "עדיף לא להיכנס לעימות. אל תלחץ, הנח למצב כפי שהוא." },
      { id: "ד", text: "קבל את דעת כפיפיך בדבר הנורמות החדשות, אך ודא שהן אכן מושגות." },
    ],
    mapping: {
      "א": { style: "supporting", score: 1 },
      "ב": { style: "directing", score: -2 },
      "ג": { style: "delegating", score: -1 },
      "ד": { style: "coaching", score: 2 },
    },
  },
  {
    id: 11,
    scenario: "קודמת והגעת כמנהל חדש לפרויקט שמנהלו הקודם לא היה מעורב במתרחש. הצוות תפקד כהלכה, התקשורת הבינאישית בתוכו טובה.",
    options: [
      { id: "א", text: "התחל לכוון את פעילות כפיפיך בעבודתם." },
      { id: "ב", text: "שתף את הצוות בתהליכי קבלת ההחלטות שלך ועודד הצעות טובות הבאות מהם." },
      { id: "ג", text: "שוחח עם אנשי הצוות על התפקוד בעבר ובחן את הצורך בנהלי עבודה חדשים." },
      { id: "ד", text: "המשך להניח לצוות לפעול לבדו, בקצב הטבעי שלו." },
    ],
    mapping: {
      "א": { style: "directing", score: -2 },
      "ב": { style: "supporting", score: 2 },
      "ג": { style: "coaching", score: -1 },
      "ד": { style: "delegating", score: 1 },
    },
  },
  {
    id: 12,
    scenario: "מידע שקיבלת רומז כי קיימים קשיים בצוות. הצוות תפקד מצוין בעבר, השיג את יעדיו ועבד היטב בשנה האחרונה. לכולם כישורים טובים.",
    options: [
      { id: "א", text: "בחן עם כפיפיך את הצורך בנהלים חדשים." },
      { id: "ב", text: "אם אכן קיימים קשיים, הנח לכפיפיך להתמודד עם הבעיה בעצמם." },
      { id: "ג", text: "פעל במהירות ובתקיפות לשפר את הטעון שיפור ולכוון את הצוות מחדש." },
      { id: "ד", text: "תן לכפיפיך תמיכה. נסה לעזור להם בזמנים של קושי." },
    ],
    mapping: {
      "א": { style: "coaching", score: -1 },
      "ב": { style: "delegating", score: 1 },
      "ג": { style: "directing", score: -2 },
      "ד": { style: "supporting", score: 2 },
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// State
// ═══════════════════════════════════════════════════════════════════════════

let currentQuestion = 0;
let answers = {}; // { questionId: optionId }

// ═══════════════════════════════════════════════════════════════════════════
// DOM Elements
// ═══════════════════════════════════════════════════════════════════════════

const screens = {
  intro: document.getElementById("intro"),
  question: document.getElementById("question-screen"),
  results: document.getElementById("results"),
  analysis: document.getElementById("analysis"),
};

const elements = {
  progressText: document.getElementById("progress-text"),
  progressFill: document.getElementById("progress-fill"),
  scenario: document.getElementById("scenario"),
  options: document.getElementById("options"),
  prevBtn: document.getElementById("prev"),
  nextBtn: document.getElementById("next"),
  resultsGrid: document.getElementById("results-grid"),
  resultsInterpretation: document.getElementById("results-interpretation"),
  analysisContent: document.getElementById("analysis-content"),
};

// ═══════════════════════════════════════════════════════════════════════════
// Screen Navigation
// ═══════════════════════════════════════════════════════════════════════════

function showScreen(screenId) {
  Object.values(screens).forEach((screen) => {
    screen.classList.remove("screen--active");
  });
  screens[screenId].classList.add("screen--active");
}

// ═══════════════════════════════════════════════════════════════════════════
// Question Display
// ═══════════════════════════════════════════════════════════════════════════

function renderQuestion() {
  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  elements.progressText.textContent = `מצב ${currentQuestion + 1} מתוך ${QUESTIONS.length}`;
  elements.progressFill.style.width = `${progress}%`;

  elements.scenario.textContent = question.scenario;

  elements.options.innerHTML = question.options
    .map((option) => {
      const isSelected = answers[question.id] === option.id;
      return `
        <div class="option ${isSelected ? "option--selected" : ""}" data-id="${option.id}">
          <span class="option__letter">${option.id}</span>
          <span class="option__text">${option.text}</span>
        </div>
      `;
    })
    .join("");

  // Add click handlers
  elements.options.querySelectorAll(".option").forEach((optionEl) => {
    optionEl.addEventListener("click", () => selectOption(optionEl.dataset.id));
  });

  updateNavigationButtons();
}

function selectOption(optionId) {
  const question = QUESTIONS[currentQuestion];
  answers[question.id] = optionId;
  renderQuestion();
}

function updateNavigationButtons() {
  const question = QUESTIONS[currentQuestion];
  const hasAnswer = answers[question.id] !== undefined;

  elements.prevBtn.disabled = currentQuestion === 0;
  elements.nextBtn.disabled = !hasAnswer;
  elements.nextBtn.textContent =
    currentQuestion === QUESTIONS.length - 1 ? "לתוצאות" : "הבא";
}

// ═══════════════════════════════════════════════════════════════════════════
// Scoring
// ═══════════════════════════════════════════════════════════════════════════

function calculateResults() {
  const results = {
    directing: { count: 0, effectiveness: 0 },
    coaching: { count: 0, effectiveness: 0 },
    supporting: { count: 0, effectiveness: 0 },
    delegating: { count: 0, effectiveness: 0 },
  };

  QUESTIONS.forEach((question) => {
    const answer = answers[question.id];
    if (answer) {
      const mapping = question.mapping[answer];
      results[mapping.style].count++;
      results[mapping.style].effectiveness += mapping.score;
    }
  });

  return results;
}

function getEffectivenessLabel(score) {
  if (score >= 1) return { label: "יעיל", class: "effective" };
  if (score <= -1) return { label: "לא יעיל", class: "ineffective" };
  return { label: "סביר", class: "adequate" };
}

// ═══════════════════════════════════════════════════════════════════════════
// Results Display
// ═══════════════════════════════════════════════════════════════════════════

function renderResults() {
  const results = calculateResults();

  // Find dominant style(s)
  const maxCount = Math.max(...Object.values(results).map((r) => r.count));
  const dominantStyles = Object.entries(results)
    .filter(([, data]) => data.count === maxCount)
    .map(([styleId]) => STYLES[styleId].title);

  // Render style cards
  elements.resultsGrid.innerHTML = Object.entries(STYLES)
    .map(([styleId, style]) => {
      const data = results[styleId];
      const eff = getEffectivenessLabel(data.effectiveness);
      const scoreClass =
        data.effectiveness > 0
          ? "positive"
          : data.effectiveness < 0
          ? "negative"
          : "neutral";
      const scorePrefix = data.effectiveness > 0 ? "+" : "";

      return `
        <div class="style-card">
          <div class="style-card__header">
            <span class="style-card__title">${style.title}</span>
            <span class="style-card__count">${data.count}</span>
          </div>
          <div class="style-card__desc">${style.subtitle}</div>
          <div class="style-card__effectiveness">
            <span class="style-card__eff-label">יעילות:</span>
            <span class="style-card__eff-score style-card__eff-score--${scoreClass}">
              ${scorePrefix}${data.effectiveness} (${eff.label})
            </span>
          </div>
        </div>
      `;
    })
    .join("");

  // Render interpretation
  const idealProfile =
    Object.values(results).every((r) => r.count === 3) &&
    Object.values(results).every((r) => r.effectiveness === 6);

  let interpretation = `<h3>הסגנון הדומיננטי שלך</h3>`;

  if (dominantStyles.length === 4) {
    interpretation += `<p>יש לך פרופיל מאוזן! בחרת בכל הסגנונות באופן שווה.</p>`;
  } else if (dominantStyles.length > 1) {
    interpretation += `<p>הסגנונות הדומיננטיים שלך הם: <strong>${dominantStyles.join(", ")}</strong> (${maxCount} בחירות כל אחד).</p>`;
  } else {
    interpretation += `<p>הסגנון הדומיננטי שלך הוא: <strong>${dominantStyles[0]}</strong> (${maxCount} בחירות מתוך 12).</p>`;
  }

  interpretation += `
    <p>לפי תיאוריית הניהול המצבי, למנהל טוב יש באמתחתו מאגר של התנהגויות הולמות למצבים שונים. 
    התוצאה האידיאלית היא פיזור שווה בין כל הסגנונות (3 בחירות בכל סגנון) עם יעילות גבוהה (+6 בכל סגנון).</p>
  `;

  elements.resultsInterpretation.innerHTML = interpretation;
}

// ═══════════════════════════════════════════════════════════════════════════
// Analysis Display
// ═══════════════════════════════════════════════════════════════════════════

function renderAnalysis() {
  const results = calculateResults();

  let html = "";

  Object.entries(STYLES).forEach(([styleId, style]) => {
    const data = results[styleId];
    const eff = getEffectivenessLabel(data.effectiveness);

    html += `
      <div class="analysis-card analysis-card--${styleId}">
        <div class="analysis-card__header">
          <span class="analysis-card__title">${style.title} (${data.count} בחירות)</span>
          <span class="analysis-card__badge analysis-card__badge--${eff.class}">${eff.label}</span>
        </div>
        <p class="analysis-card__text">
          <strong>${style.subtitle}</strong> — ${style.description}
        </p>
        <p class="analysis-card__text" style="margin-top: 12px;">
          ${data.effectiveness >= 0 ? style.effective : style.ineffective}
        </p>
      </div>
    `;
  });

  elements.analysisContent.innerHTML = html;
}

// ═══════════════════════════════════════════════════════════════════════════
// Export Results
// ═══════════════════════════════════════════════════════════════════════════

function exportResults() {
  const results = calculateResults();

  let markdown = `# תוצאות שאלון ניהול מצבי\n\n`;
  markdown += `## פרופיל הסגנונות שלי\n\n`;
  markdown += `| סגנון | מספר בחירות | ציון יעילות | פירוש |\n`;
  markdown += `|-------|-------------|-------------|-------|\n`;

  Object.entries(STYLES).forEach(([styleId, style]) => {
    const data = results[styleId];
    const eff = getEffectivenessLabel(data.effectiveness);
    const prefix = data.effectiveness > 0 ? "+" : "";
    markdown += `| ${style.title} | ${data.count} | ${prefix}${data.effectiveness} | ${eff.label} |\n`;
  });

  // Find dominant
  const maxCount = Math.max(...Object.values(results).map((r) => r.count));
  const dominantStyles = Object.entries(results)
    .filter(([, data]) => data.count === maxCount)
    .map(([styleId]) => STYLES[styleId].title);

  markdown += `\n## סגנון דומיננטי\n`;
  markdown += `${dominantStyles.join(", ")} (${maxCount} בחירות)\n\n`;

  markdown += `## פירוט הסגנונות\n\n`;

  Object.entries(STYLES).forEach(([styleId, style]) => {
    const data = results[styleId];
    const eff = getEffectivenessLabel(data.effectiveness);
    markdown += `### ${style.title}\n`;
    markdown += `- **${style.subtitle}** — ${style.description}\n`;
    markdown += `- בחירות: ${data.count}, יעילות: ${data.effectiveness > 0 ? "+" : ""}${data.effectiveness} (${eff.label})\n`;
    markdown += `- ${data.effectiveness >= 0 ? style.effective : style.ineffective}\n\n`;
  });

  return markdown;
}

// ═══════════════════════════════════════════════════════════════════════════
// Event Listeners
// ═══════════════════════════════════════════════════════════════════════════

document.getElementById("start").addEventListener("click", () => {
  showScreen("question");
  renderQuestion();
});

document.getElementById("fill-random").addEventListener("click", () => {
  QUESTIONS.forEach((q) => {
    const randomOption = q.options[Math.floor(Math.random() * q.options.length)];
    answers[q.id] = randomOption.id;
  });
  showScreen("results");
  renderResults();
});

elements.prevBtn.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
});

elements.nextBtn.addEventListener("click", () => {
  if (currentQuestion < QUESTIONS.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    showScreen("results");
    renderResults();
  }
});

document.getElementById("back-to-questions").addEventListener("click", () => {
  showScreen("question");
});

document.getElementById("to-analysis").addEventListener("click", () => {
  showScreen("analysis");
  renderAnalysis();
});

document.getElementById("restart").addEventListener("click", () => {
  answers = {};
  currentQuestion = 0;
  showScreen("intro");
});

document.getElementById("back-to-results").addEventListener("click", () => {
  showScreen("results");
});

document.getElementById("copy-results").addEventListener("click", () => {
  const markdown = exportResults();
  navigator.clipboard.writeText(markdown).then(() => {
    const btn = document.getElementById("copy-results");
    const originalText = btn.textContent;
    btn.textContent = "הועתק!";
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  });
});

document.getElementById("back-to-questions-analysis").addEventListener("click", () => {
  showScreen("question");
});
