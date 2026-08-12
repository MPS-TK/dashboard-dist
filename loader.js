/* =====================================================================
 * MPS GROUP — Dashboard public loader (token-free code loading)
 * Served from the PUBLIC repo: MPS-TK/dashboard-dist
 * One bookmarklet -> this file -> the right dashboard for the site.
 *
 *  • ACONEX  : all client code is fetched from this public repo with NO
 *              GitHub token. A missing/expired token can never drop a
 *              user onto a stale cached copy again. Team-sync DATA
 *              (overrides / xdata) still reads & writes the PRIVATE repo
 *              using the token when present — so a user with no token
 *              still gets the CURRENT live dashboard, just without the
 *              shared annotations.
 *  • PROCORE : unchanged — loads the existing private procore_loader.js
 *              with the token, exactly as before.
 *
 * Freshness: every fetch is cache:'no-store' + a cache-busting query, so
 * a push to this repo reaches everyone on their next click.
 * ===================================================================== */
(function () {
  var DIST = 'https://raw.githubusercontent.com/MPS-TK/dashboard-dist/main/';
  function pub(p) {
    return fetch(DIST + p + '?_=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error(p + ' HTTP ' + r.status); return r.text(); });
  }

  // Keep the token available for the modules' team-sync DATA calls (private repo).
  try { if (!window.__tok) { var t = localStorage.getItem('__itr_gh_token__'); if (t) window.__tok = t; } } catch (e) {}

  var host = location.hostname || '';

  if (/aconex\.com$/i.test(host)) {
    // ---- ACONEX : fully token-free code loading ----------------------
    // Force-replace any modules already on the page (kills stale versions).
    try { delete window.__MPS_ACONEX; } catch (e) {}
    try { delete window.__MPS_ACONEX_RFI; } catch (e) {}
    ['mps-aconex-host', 'mps-aconex-rfi-host'].forEach(function (id) {
      var el = document.getElementById(id); if (el && el.parentNode) el.parentNode.removeChild(el);
    });

    // Redirect the ONE remaining in-module CODE fetch (the RFI module, pulled
    // on tab-click) away from the private repo to this public repo, so opening
    // the RFIs/TQs tab needs no token either. DATA fetches (.json overrides /
    // xdata) are left completely untouched — they still use the token.
    if (!window.__mpsFetchShim) {
      window.__mpsFetchShim = true;
      var _f = window.fetch.bind(window);
      window.fetch = function (u, o) {
        try {
          var url = (typeof u === 'string') ? u : (u && u.url) || '';
          if (/ITR-Dashboard\/contents\/[^?]*aconex_rfi_dashboard\.js/.test(url)) {
            return _f(DIST + 'aconex/aconex_rfi_dashboard.js?_=' + Date.now(), { cache: 'no-store' });
          }
        } catch (e) {}
        return _f(u, o);
      };
    }

    pub('aconex/aconex_itp_dashboard.js')
      .then(function (c) { (0, eval)(c); return pub('aconex/mps_ui_tweaks.js'); })
      .then(function (c) { (0, eval)(c); return pub('aconex/rfi_newdata.js'); })
      .then(function (c) { (0, eval)(c); })
      .catch(function (e) { console.error('[MPS] Aconex dashboard load failed:', e); alert('MPS Dashboard: could not load the latest version.\n' + e.message); });

  } else {
    // ---- PROCORE : unchanged token-based path -------------------------
    var tok = window.__tok || (function () { try { return localStorage.getItem('__itr_gh_token__'); } catch (e) { return null; } })();
    if (!tok) { alert('MPS Dashboard: no GitHub token saved on this browser.\nRun the one-line setup on a Procore page first (see the Setup Guide).'); return; }
    fetch('https://api.github.com/repos/MPS-TK/ITR-Dashboard/contents/procore_loader.js?ref=main',
      { headers: { Authorization: 'token ' + tok, Accept: 'application/vnd.github.v3.raw' }, cache: 'no-store' })
      .then(function (r) { return r.text(); })
      .then(function (c) { (0, eval)(c.replace(/^\s*javascript:/i, '')); })
      .catch(function (e) { console.error('[MPS] Procore dashboard load failed:', e); });
  }
})();
