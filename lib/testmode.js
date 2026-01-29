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
 * @returns {string} - HTML string for the indicator (uses .test-mode-indicator class from shared.css)
 */
export function getTestModeIndicator() {
  if (!isTestMode()) {
    return '';
  }
  
  // Uses .test-mode-indicator class from shared.css
  return `<div class="test-mode-indicator">מצב בדיקה</div>`;
}

/**
 * Insert test mode indicator into the header area
 * Wraps badge and indicator in a .badge-row flex container for alignment
 */
export function insertTestModeIndicator() {
  if (!isTestMode()) {
    return;
  }
  
  // Try to find the header badge or header element
  const badge = document.querySelector('.app__badge');
  const header = document.querySelector('.app__header');
  
  if (badge) {
    // Wrap badge and indicator in a badge-row for flex alignment
    const badgeRow = document.createElement('div');
    badgeRow.className = 'badge-row';
    badge.parentNode.insertBefore(badgeRow, badge);
    badgeRow.appendChild(badge);
    badgeRow.insertAdjacentHTML('beforeend', getTestModeIndicator());
  } else if (header) {
    // Insert at the end of header in a badge-row
    header.insertAdjacentHTML('beforeend', `<div class="badge-row">${getTestModeIndicator()}</div>`);
  } else {
    // Fallback: insert at start of body
    document.body.insertAdjacentHTML('afterbegin', `<div class="badge-row" style="justify-content: center; padding: 8px;">${getTestModeIndicator()}</div>`);
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
