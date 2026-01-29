/**
 * Share Library
 * 
 * Provides multi-format share/copy utilities for questionnaire results.
 * Supports Markdown, Rich Text (HTML), and native Web Share API.
 */

/**
 * Show a brief feedback message after copy action
 * @param {string} message - The message to show
 */
export function showCopyFeedback(message = 'הועתק!') {
  // Remove any existing feedback
  const existingFeedback = document.querySelector('.copy-feedback');
  if (existingFeedback) {
    existingFeedback.remove();
  }
  
  // Create feedback element
  const feedback = document.createElement('div');
  feedback.className = 'copy-feedback';
  feedback.textContent = message;
  feedback.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(31, 36, 48, 0.9);
    color: white;
    padding: 12px 24px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
    z-index: 10000;
    font-family: var(--font-stack, 'Heebo', 'Assistant', 'Segoe UI', sans-serif);
    animation: copyFeedbackIn 0.3s ease-out;
  `;
  
  // Add animation keyframes if not exists
  if (!document.querySelector('#copy-feedback-styles')) {
    const style = document.createElement('style');
    style.id = 'copy-feedback-styles';
    style.textContent = `
      @keyframes copyFeedbackIn {
        from { opacity: 0; transform: translateX(-50%) translateY(10px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
      @keyframes copyFeedbackOut {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(10px); }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(feedback);
  
  // Remove after delay
  setTimeout(() => {
    feedback.style.animation = 'copyFeedbackOut 0.3s ease-in forwards';
    setTimeout(() => feedback.remove(), 300);
  }, 1500);
}

/**
 * Check if device is mobile (for showing different UI)
 * Uses window width and touch capability detection
 * @returns {boolean}
 */
export function isMobile() {
  // Check screen width (640px is a common mobile breakpoint)
  if (window.innerWidth < 640) {
    return true;
  }
  
  // Check for touch capability
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    return true;
  }
  
  // Check user agent for mobile devices
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  
  return mobileRegex.test(userAgent.toLowerCase());
}

/**
 * Copy plain text (Markdown) to clipboard
 * @param {string} text - The markdown text to copy
 * @returns {Promise<void>}
 */
export async function copyAsMarkdown(text) {
  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      showCopyFeedback('הועתק!');
      return;
    }
  } catch (error) {
    console.warn("Clipboard API failed, falling back to execCommand.", error);
  }
  
  // Fallback to execCommand for older browsers
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand("copy");
    showCopyFeedback('הועתק!');
  } finally {
    document.body.removeChild(textarea);
  }
}

/**
 * Copy as rich text (HTML) - pastes formatted in Word, Google Docs, etc.
 * @param {string} html - The HTML to copy
 * @returns {Promise<void>}
 */
export async function copyAsRichText(html) {
  try {
    // Try modern Clipboard API with ClipboardItem
    if (navigator.clipboard && navigator.clipboard.write) {
      const clipboardItem = new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([html.replace(/<[^>]*>/g, '')], { type: 'text/plain' })
      });
      await navigator.clipboard.write([clipboardItem]);
      showCopyFeedback('הועתק!');
      return;
    }
  } catch (error) {
    console.warn("ClipboardItem API failed, falling back to execCommand.", error);
  }
  
  // Fallback: Create a temporary div, set HTML, select, and copy
  const container = document.createElement("div");
  container.innerHTML = html;
  container.style.position = "absolute";
  container.style.left = "-9999px";
  document.body.appendChild(container);
  
  // Select the content
  const range = document.createRange();
  range.selectNodeContents(container);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  try {
    document.execCommand("copy");
    showCopyFeedback('הועתק!');
  } finally {
    selection.removeAllRanges();
    document.body.removeChild(container);
  }
}

/**
 * Use native Web Share API (mobile only)
 * @param {string} title - Share title
 * @param {string} text - Share text content
 * @returns {Promise<void>}
 */
export async function shareNative(title, text) {
  if (!canShare()) {
    throw new Error("Web Share API is not available");
  }
  
  try {
    await navigator.share({
      title: title,
      text: text
    });
  } catch (error) {
    // User cancelled or error occurred
    if (error.name !== 'AbortError') {
      console.error("Share failed:", error);
      throw error;
    }
  }
}

/**
 * Check if Web Share API is available
 * @returns {boolean}
 */
export function canShare() {
  return typeof navigator !== 'undefined' && 
         navigator.share !== undefined &&
         typeof navigator.share === 'function';
}

/**
 * Create share buttons HTML based on device type
 * @param {object} labels - Button labels object
 * @param {string} labels.copyMarkdown - Label for markdown copy button
 * @param {string} labels.copyRichText - Label for rich text copy button
 * @param {string} labels.share - Label for native share button
 * @param {string} labels.copyResults - Label for desktop fallback button
 * @returns {string} - HTML for buttons
 */
export function createShareButtons(labels = {}) {
  const defaultLabels = {
    copyMarkdown: "העתק כטקסט",
    copyRichText: "העתק מעוצב",
    share: "שתף",
    copyResults: "העתק תוצאות"
  };
  
  const finalLabels = { ...defaultLabels, ...labels };
  const mobile = isMobile();
  
  if (mobile) {
    // Mobile: Show separate buttons
    return `
      <div class="share-buttons-mobile" style="
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
      ">
        <button 
          class="share-btn share-btn-markdown" 
          data-action="copy-markdown"
          style="
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
          "
          onmouseover="this.style.opacity='0.9'"
          onmouseout="this.style.opacity='1'"
        >
          ${finalLabels.copyMarkdown}
        </button>
        <button 
          class="share-btn share-btn-richtext" 
          data-action="copy-richtext"
          style="
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
          "
          onmouseover="this.style.opacity='0.9'"
          onmouseout="this.style.opacity='1'"
        >
          ${finalLabels.copyRichText}
        </button>
        ${canShare() ? `
        <button 
          class="share-btn share-btn-native" 
          data-action="share-native"
          style="
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
          "
          onmouseover="this.style.opacity='0.9'"
          onmouseout="this.style.opacity='1'"
        >
          ${finalLabels.share}
        </button>
        ` : ''}
      </div>
    `;
  } else {
    // Desktop: Single button (current behavior)
    return `
      <button 
        class="share-btn share-btn-desktop" 
        data-action="copy-markdown"
        style="
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
        "
        onmouseover="this.style.opacity='0.9'"
        onmouseout="this.style.opacity='1'"
      >
        ${finalLabels.copyResults}
      </button>
    `;
  }
}
