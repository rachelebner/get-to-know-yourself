// ═══════════════════════════════════════════════════════════════════════════
// שאלון דומייני מנהיגות - Application Logic
// Multiple-choice quiz where each answer maps to a leadership domain
// ═══════════════════════════════════════════════════════════════════════════

import { isTestMode, insertTestModeIndicator, updateBackLinks } from '../../lib/testmode.js';
import { applyBackToHubLinks } from '../../lib/back-to-hub.js';
import { isMobile, copyAsMarkdown, copyAsRichText, shareNative, canShare, createShareButtons } from '../../lib/share.js';

let content = null;
let currentIndex = 0;
let answers = [];

// Domain IDs (order matters for display)
const domainIds = ["people", "process", "thinking", "influence"];

// DOM Elements
const introScreen = document.getElementById("intro");
const questionScreen = document.getElementById("question-screen");
const resultsScreen = document.getElementById("results");

const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");

const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");
const startButton = document.getElementById("start");

const restartButton = document.getElementById("restart");
const backToQuestionsButton = document.getElementById("back-to-questions");

// ═══════════════════════════════════════════════════════════════════════════
// Initialization
// ═══════════════════════════════════════════════════════════════════════════

async function init() {
  applyBackToHubLinks();
  try {
    const response = await fetch("./content.json");
    content = await response.json();
    answers = new Array(content.questions.length).fill(null);
    populateUI();
    setupEventListeners();

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
}

function populateUI() {
  // Intro screen
  document.getElementById("intro-instructions").textContent = content.intro.instructions;
  document.getElementById("intro-note").textContent = content.intro.note;

  // Button labels
  startButton.textContent = content.ui.start;
  restartButton.textContent = content.ui.restart;
  
  // Setup share buttons
  setupShareButtons();

  // Results screen static text
  document.getElementById("results-title").textContent = content.results.title;
  document.getElementById("results-subtitle").textContent = content.results.subtitle;
  document.getElementById("dominant-title").textContent = content.results.dominantTitle;
  document.getElementById("all-domains-title").textContent = content.results.allDomainsTitle;
  document.getElementById("blend-note").textContent = content.results.blendNote;
  document.getElementById("reflection-prompt").textContent = content.results.reflectionPrompt;
}

// ═══════════════════════════════════════════════════════════════════════════
// Screen Management
// ═══════════════════════════════════════════════════════════════════════════

function updateScreen(screen) {
  [introScreen, questionScreen, resultsScreen].forEach((s) => {
    s.classList.toggle("screen--active", s === screen);
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// Question Flow
// ═══════════════════════════════════════════════════════════════════════════

function updateQuestion() {
  const question = content.questions[currentIndex];
  questionText.textContent = question.text;

  // Progress
  const progressTemplate = content.ui.questionOf
    .replace("{current}", question.id)
    .replace("{total}", content.questions.length);
  progressText.textContent = progressTemplate;
  const progress = ((currentIndex + 1) / content.questions.length) * 100;
  progressFill.style.width = `${progress}%`;

  // Navigation
  prevButton.disabled = false;
  if (currentIndex === 0) {
    prevButton.textContent = content.ui.backToIntro;
  } else {
    prevButton.textContent = content.ui.prev;
  }
  nextButton.textContent =
    currentIndex === content.questions.length - 1 ? content.ui.finish : content.ui.next;

  // Render options
  renderOptions(question);
  nextButton.disabled = answers[currentIndex] === null;
}

function renderOptions(question) {
  optionsContainer.innerHTML = question.options
    .map((option) => {
      const isSelected = answers[currentIndex] === option.id;
      const domain = content.domains[option.id];
      return `
        <button 
          class="option-btn ${isSelected ? 'selected' : ''}" 
          data-domain="${option.id}"
          style="${isSelected ? `border-color: ${domain.color}; background-color: ${domain.color}15;` : ''}"
        >
          ${option.text}
        </button>
      `;
    })
    .join("");

  // Add click handlers
  optionsContainer.querySelectorAll(".option-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const domainId = btn.getAttribute("data-domain");
      setAnswer(domainId);
    });
  });
}

function setAnswer(domainId) {
  answers[currentIndex] = domainId;
  renderOptions(content.questions[currentIndex]);
  nextButton.disabled = false;
}

function fillRandomAnswers() {
  for (let i = 0; i < answers.length; i++) {
    const randomIndex = Math.floor(Math.random() * domainIds.length);
    answers[i] = domainIds[randomIndex];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Scoring
// ═══════════════════════════════════════════════════════════════════════════

function getDomainScores() {
  const scores = {};
  domainIds.forEach((domainId) => {
    scores[domainId] = answers.filter((a) => a === domainId).length;
  });
  return scores;
}

function getSortedDomains(scores) {
  return domainIds
    .map((domainId) => ({
      id: domainId,
      score: scores[domainId],
      ...content.domains[domainId],
    }))
    .sort((a, b) => b.score - a.score);
}

function getDominantDomains(sorted) {
  const maxScore = sorted[0].score;
  return sorted.filter((d) => d.score === maxScore);
}

// ═══════════════════════════════════════════════════════════════════════════
// Results Display
// ═══════════════════════════════════════════════════════════════════════════

function showResults() {
  const scores = getDomainScores();
  const sorted = getSortedDomains(scores);
  const dominant = getDominantDomains(sorted);

  // Render dominant domain(s)
  const dominantContainer = document.getElementById("dominant-domains");
  dominantContainer.innerHTML = dominant
    .map((domain) => renderDomainCard(domain, true))
    .join("");

  // Render all domains (non-dominant ones)
  const nonDominant = sorted.filter((d) => !dominant.includes(d));
  const allDomainsContainer = document.getElementById("all-domains");
  allDomainsContainer.innerHTML = nonDominant
    .map((domain) => renderDomainCard(domain, false))
    .join("");
}

function renderDomainCard(domain, isDominant) {
  const strengthsTitle = content.results.strengthsTitle;
  const challengesTitle = content.results.challengesTitle;
  
  const strengths = domain.description.strengths
    .map((s) => `<li>${s}</li>`)
    .join("");
  
  const challenges = domain.description.challenges
    .map((c) => `<li>${c}</li>`)
    .join("");

  return `
    <div class="domain-card ${isDominant ? 'domain-card--dominant' : ''}" style="border-color: ${domain.color}">
      <div class="domain-card__header">
        <div class="domain-card__title-group">
          <span class="domain-card__title" style="color: ${domain.color}">${domain.title}</span>
          <span class="domain-card__subtitle">${domain.subtitle}</span>
        </div>
        <span class="domain-card__score" style="background-color: ${domain.color}">${domain.score}/10</span>
      </div>
      <p class="domain-card__summary">${domain.description.summary}</p>
      <div class="domain-card__details">
        <div class="domain-card__section">
          <h4 class="domain-card__section-title">${strengthsTitle}</h4>
          <ul class="domain-card__list domain-card__list--strengths">${strengths}</ul>
        </div>
        <div class="domain-card__section">
          <h4 class="domain-card__section-title">${challengesTitle}</h4>
          <ul class="domain-card__list domain-card__list--challenges">${challenges}</ul>
        </div>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════════════════
// Export Results
// ═══════════════════════════════════════════════════════════════════════════

function buildResultsMarkdown() {
  const scores = getDomainScores();
  const sorted = getSortedDomains(scores);
  const dominant = getDominantDomains(sorted);

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
    `## ${content.markdown.domainScores}`
  );

  // All scores
  sorted.forEach((domain) => {
    const isDominant = dominant.some((d) => d.id === domain.id);
    const marker = isDominant ? " ⭐" : "";
    lines.push(`- **${domain.title}**: ${domain.score}/10${marker}`);
  });

  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(`## ${content.markdown.yourDomain}`);

  // Dominant domain(s) with full details
  dominant.forEach((domain) => {
    lines.push("");
    lines.push(`### ${domain.title} (${domain.score}/10)`);
    lines.push(`*${domain.subtitle}*`);
    lines.push("");
    lines.push(domain.description.summary);
    lines.push("");
    lines.push(`**${content.results.strengthsTitle}:**`);
    domain.description.strengths.forEach((s) => {
      lines.push(`- ${s}`);
    });
    lines.push("");
    lines.push(`**${content.results.challengesTitle}:**`);
    domain.description.challenges.forEach((c) => {
      lines.push(`- ${c}`);
    });
  });

  // Non-dominant domains
  const nonDominant = sorted.filter((d) => !dominant.some((dom) => dom.id === d.id));
  if (nonDominant.length > 0) {
    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push("## דומיינים נוספים");
    nonDominant.forEach((domain) => {
      lines.push("");
      lines.push(`### ${domain.title} (${domain.score}/10)`);
      lines.push(`*${domain.subtitle}*`);
      lines.push("");
      lines.push(domain.description.summary);
    });
  }

  // Reflection
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(`> ${content.results.reflectionPrompt}`);

  // Test mode Q&A table at end
  if (isTestMode()) {
    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push("## פירוט התשובות (מילוי אקראי)");
    lines.push("| מספר שאלה | תשובה שנבחרה |");
    lines.push("|-----------|--------------|");
    answers.forEach((answer, index) => {
      const domain = content.domains[answer];
      lines.push(`| ${index + 1} | ${domain.shortTitle} |`);
    });
  }

  return lines.join("\n");
}

function buildResultsHTML() {
  const scores = getDomainScores();
  const sorted = getSortedDomains(scores);
  const dominant = getDominantDomains(sorted);

  // Test mode warning
  let html = isTestMode() ? `
    <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
      <div style="font-weight: bold; color: #856404;">⚠️ תוצאות בדיקה - דוגמה על בסיס מילוי אקראי</div>
      <div style="font-weight: bold; color: #856404;">⚠️ לא תוצאות אמיתיות</div>
    </div>
  ` : '';

  html += `<h1>${content.markdown.title}</h1>`;
  html += `<h2>${content.markdown.domainScores}</h2>`;
  html += '<ul>';
  sorted.forEach((domain) => {
    const isDominant = dominant.some((d) => d.id === domain.id);
    const marker = isDominant ? " ⭐" : "";
    html += `<li><strong>${domain.title}</strong>: ${domain.score}/10${marker}</li>`;
  });
  html += '</ul>';
  
  html += '<hr>';
  html += `<h2>${content.markdown.yourDomain}</h2>`;
  
  dominant.forEach((domain) => {
    html += `<h3>${domain.title} (${domain.score}/10)</h3>`;
    html += `<p><em>${domain.subtitle}</em></p>`;
    html += `<p>${domain.description.summary}</p>`;
    html += `<h4>${content.results.strengthsTitle}:</h4>`;
    html += '<ul>';
    domain.description.strengths.forEach((s) => {
      html += `<li>${s}</li>`;
    });
    html += '</ul>';
    html += `<h4>${content.results.challengesTitle}:</h4>`;
    html += '<ul>';
    domain.description.challenges.forEach((c) => {
      html += `<li>${c}</li>`;
    });
    html += '</ul>';
  });

  // Non-dominant domains
  const nonDominant = sorted.filter((d) => !dominant.some((dom) => dom.id === d.id));
  if (nonDominant.length > 0) {
    html += '<hr>';
    html += '<h2>דומיינים נוספים</h2>';
    nonDominant.forEach((domain) => {
      html += `<h3>${domain.title} (${domain.score}/10)</h3>`;
      html += `<p><em>${domain.subtitle}</em></p>`;
      html += `<p>${domain.description.summary}</p>`;
    });
  }

  // Reflection
  html += '<hr>';
  html += `<blockquote>${content.results.reflectionPrompt}</blockquote>`;

  // Test mode Q&A table
  if (isTestMode()) {
    html += `
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
          ${answers.map((answer, index) => {
            const domain = content.domains[answer];
            return `
              <tr>
                <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${index + 1}</td>
                <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${domain.shortTitle}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }
  
  return html;
}

function setupShareButtons() {
  const resultsActions = document.querySelector('#results .results-actions');
  
  if (!resultsActions) return;
  
  // Create share buttons HTML
  const shareButtonsHTML = createShareButtons({
    copyMarkdown: "העתק כטקסט",
    copyRichText: "העתק מעוצב",
    share: "שתף",
    copyResults: content.ui.copyResults || "העתק תוצאות"
  });
  
  // Insert share buttons before restart button
  const shareContainer = document.createElement('div');
  shareContainer.className = 'share-buttons-container';
  shareContainer.innerHTML = shareButtonsHTML;
  
  const restartBtn = resultsActions.querySelector('#restart');
  if (restartBtn) {
    resultsActions.insertBefore(shareContainer, restartBtn);
  }
  
  // Setup event listeners for share buttons
  setupShareEventListeners();
}

function setupShareEventListeners() {
  // Use event delegation for dynamically created buttons
  document.addEventListener('click', async (e) => {
    const action = e.target.closest('[data-action]')?.getAttribute('data-action');
    if (!action) return;
    
    const markdown = buildResultsMarkdown();
    const html = buildResultsHTML();
    
    try {
      if (action === 'copy-markdown') {
        await copyAsMarkdown(markdown);
      } else if (action === 'copy-richtext') {
        await copyAsRichText(html);
      } else if (action === 'share-native') {
        await shareNative(
          content.meta?.title || 'תוצאות שאלון דומייני מנהיגות',
          markdown.replace(/#{1,3}\s/g, '').replace(/\*\*/g, '').substring(0, 200) + '...'
        );
      }
    } catch (error) {
      console.error('Share action failed:', error);
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// Event Listeners
// ═══════════════════════════════════════════════════════════════════════════

function setupEventListeners() {
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
    updateScreen(introScreen);
  });

  // Back to questions
  backToQuestionsButton.addEventListener("click", () => {
    updateQuestion();
    updateScreen(questionScreen);
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// Start
// ═══════════════════════════════════════════════════════════════════════════

init();
