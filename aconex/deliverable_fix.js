/* =====================================================================
 * MPS GROUP — Deliverable-type capture fix (Aconex Doc. Registers/ITP tab)
 *
 * Problem: the dashboard initialises the SUBSYSTEM whitelist to all ITP
 * subsystems (e.g. 3150-xx) by default and applies it to EVERY deliverable
 * type. Only Inspection & Test Plans carry those subsystems, so selecting
 * any other deliverable type (Register, Report, Plan, Certificate, ...)
 * filters the whole view to zero — the items are captured in the data but
 * hidden.
 *
 * Fix: whenever the DELIVERABLE TYPE changes to a non-ITP type, clear the
 * subsystem whitelist so every doc of that type is shown (including docs
 * with a blank subsystem). The ITP subsystem selection is saved and
 * restored when switching back to the ITP view, so nothing is lost.
 *
 * IMPORTANT: this only acts on an actual deliverable-type CHANGE event — it
 * never runs on a timer and never touches the filter while you are working,
 * so a subsystem filter you apply on the column (col D) persists normally.
 * The interval below ONLY re-binds the change listener after re-renders.
 *
 * Self-contained external layer — no edit to the module source. Loaded by
 * loader.js after the ITP module builds. Idempotent.
 * ===================================================================== */
(function () {
  var HOST = 'mps-aconex-host', G = '__MPS_ACONEX', ITP = 'Inspection and Test Plan';

  function host() { var h = document.getElementById(HOST); return h && h.shadowRoot; }

  // Act on an actual deliverable-type change only.
  function onType(t) {
    var M = window[G]; if (!M || !M.__live) return;
    var S = M._state; if (!S || !S.selFilters) return;
    var sub = S.selFilters.subsystem, hasSub = Array.isArray(sub) && sub.length > 0;
    if (t !== ITP) {
      if (hasSub) { M.__mpsSavedSub = sub.slice(); }
      S.selFilters.subsystem = null;   // show all docs of this type (incl. blank subsystem)
    } else {
      if (M.__mpsSavedSub) { S.selFilters.subsystem = M.__mpsSavedSub; M.__mpsSavedSub = null; }
    }
  }

  // Re-bind a CAPTURE-phase change listener on the deliverable-type dropdown
  // (the dropdown is recreated on each render, so this runs periodically).
  function attach() {
    var root = host(); if (!root) return;
    var sel = root.querySelector('select.dtsel');
    if (sel && !sel.__mpsCapHook) {
      sel.__mpsCapHook = true;
      // capture phase runs BEFORE the module's own change handler → no flash
      sel.addEventListener('change', function (e) { try { onType(e.target.value); } catch (_) {} }, true);
    }
  }

  // One-time on load: if we come up already on a non-ITP view with the stale
  // ITP whitelist applied, correct it once (not repeated).
  if (!window.__mpsDelivInit) {
    window.__mpsDelivInit = true;
    try {
      var root = host(), sel = root && root.querySelector('select.dtsel');
      if (sel && sel.value !== ITP) { onType(sel.value); sel.dispatchEvent(new Event('change', { bubbles: true })); }
    } catch (e) {}
  }

  if (!window.__mpsDelivFixIv) { window.__mpsDelivFixIv = setInterval(attach, 800); }
  try { attach(); } catch (e) {}
})();
