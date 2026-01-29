/**
 * Test Mode Library
 * 
 * Provides utilities for enabling test mode across questionnaires.
 * Test mode is activated via URL parameter ?testmode=1
 */

/**
 * Check if test mode is active (looks for ?testmode=1 in URL)
 * @returns {boolean}
 */
export function isTestMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get('testmode') === '1';
}

/**
 * Append testmode param to a URL
 * @param {string} baseUrl - The URL to modify
 * @returns {string} - URL with ?testmode=1 appended
 */
export function getTestModeUrl(baseUrl) {
  try {
    const url = new URL(baseUrl, window.location.origin);
    url.searchParams.set('testmode', '1');
    return url.toString();
  } catch (e) {
    // If baseUrl is relative, handle it manually
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}testmode=1`;
  }
}

/**
 * Toggle test mode - adds or removes the param and reloads
 */
export function toggleTestMode() {
  const url = new URL(window.location.href);
  
  if (isTestMode()) {
    // Remove testmode param
    url.searchParams.delete('testmode');
  } else {
    // Add testmode param
    url.searchParams.set('testmode', '1');
  }
  
  // Reload with new URL
  window.location.href = url.toString();
}

/**
 * Get test mode indicator HTML for displaying in questionnaires
 * @returns {string} - HTML string for the indicator
 */
export function getTestModeIndicator() {
  if (!isTestMode()) {
    return '';
  }
  
  // Returns HTML to be inserted in the header area (scrolls with content)
  // Matches .app__badge styling but with solid background
  return `
    <div class="test-mode-indicator" style="
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--primary, #4c66ff);
      color: white;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 600;
      margin: 8px auto;
      line-height: 1.2;
      font-family: var(--font-stack, 'Heebo', 'Assistant', 'Segoe UI', sans-serif);
    ">
      <span style="
        display: inline-block;
        width: 6px;
        height: 6px;
        background: white;
        border-radius: 50%;
        animation: testModePulse 2s ease-in-out infinite;
      "></span>
      מצב בדיקה
    </div>
    <style>
      @keyframes testModePulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    </style>
  `;
}

/**
 * Insert test mode indicator into the header area
 * This should be called instead of document.body.insertAdjacentHTML
 */
export function insertTestModeIndicator() {
  if (!isTestMode()) {
    return;
  }
  
  // Try to find the header badge or header element
  const badge = document.querySelector('.app__badge');
  const header = document.querySelector('.app__header');
  
  if (badge) {
    // Insert after the badge
    badge.insertAdjacentHTML('afterend', getTestModeIndicator());
  } else if (header) {
    // Insert at the end of header
    header.insertAdjacentHTML('beforeend', `<div style="text-align: center;">${getTestModeIndicator()}</div>`);
  } else {
    // Fallback: insert at start of body (not ideal)
    document.body.insertAdjacentHTML('afterbegin', `<div style="text-align: center; padding: 8px;">${getTestModeIndicator()}</div>`);
  }
}

/**
 * Update all back-to-hub links to preserve test mode
 */
export function updateBackLinks() {
  if (!isTestMode()) {
    return;
  }
  
  // Find all links back to hub (../ or links with "חזרה למרכז")
  const backLinks = document.querySelectorAll('a[href="../"], a[href="../index.html"], .back-link');
  
  backLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.includes('testmode=1')) {
      link.href = getTestModeUrl(href);
    }
  });
}
