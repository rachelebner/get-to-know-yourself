/**
 * Back-to-hub link behavior (no token awareness).
 * Show "חזרה למרכז השאלונים" only when the user came from the main page (index).
 * Link target = document.referrer so they return to the exact URL they left.
 */

/**
 * True if the previous page was the site root (/) or index.html.
 * @returns {boolean}
 */
export function cameFromMainPage() {
  if (!document.referrer) return false;
  try {
    const r = new URL(document.referrer);
    const root = r.origin === location.origin;
    const mainPath = r.pathname === '/' || r.pathname === '/index.html';
    return root && mainPath;
  } catch {
    return false;
  }
}

/**
 * Show back-to-hub links only when referrer is main page; set href to referrer.
 * Otherwise hide those links and add a class to the header so layout can be adjusted.
 * Call after DOM is ready.
 */
export function applyBackToHubLinks() {
  const fromMain = cameFromMainPage();
  const links = document.querySelectorAll('a[href="../../"], a[href="../../index.html"], a.back-link');
  const header = document.querySelector('.app__header');

  links.forEach((link) => {
    if (fromMain) {
      link.href = document.referrer;
      link.style.display = '';
    } else {
      link.style.display = 'none';
    }
  });

  if (header) {
    header.classList.toggle('app__header--no-back-link', !fromMain);
  }
}
