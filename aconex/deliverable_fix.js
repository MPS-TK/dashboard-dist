/* =====================================================================
 * MPS GROUP — Deliverable-type capture fix (Aconex Doc. Registers/ITP tab)
 *
 * Two fixes, so every deliverable type is fully captured and filterable:
 *
 * 1) SUBSYSTEM whitelist scoped to ITPs.
 *    The dashboard initialises the subsystem whitelist to all ITP
 *    subsystems (e.g. 3150-xx) and applied it to EVERY deliverable type.
 *    Only Inspection & Test Plans carry those subsystems, so selecting any
 *    other type (Register, Report, Plan, ...) filtered the view to zero —
 *    items were captured in the data but hidden. Now, when the DELIVERABLE
 *    TYPE changes to a non-ITP type, the subsystem whitelist is cleared so
 *    every doc of that type shows. The ITP subsystem selection is saved and
 *    restored when switching back to ITP. This acts ONLY on a deliverable-
 *    type CHANGE event — never on a timer — so a Subsystem (col D) filter
 *    you apply persists normally.
 *
 * 2) BLANK subsystem is filterable.
 *    Documents with no subsystem were omitted from the Subsystem filter, so
 *    they could not be isolated. Empty subsystems are normalised to the
 *    value "(Blank)", which makes "(Blank)" a first-class option in the
 *    Subsystem filter (and shows "(Blank)" in the column) — it filters via
 *    the module's own machinery, exactly like any other subsystem code.
 *
 * Self-contained external layer — no edit to the module source. Loaded by
 * loader.js after the ITP module builds. Idempotent.
 * ===================================================================== */
(function () {
  var HOST = 'mps-aconex-host', G = '__MPS_ACONEX', ITP = 'Inspection and Test Plan', BLANK = '(Blank)';

  function host() { var h = document.getElementById(HOST); return h && h.shadowRoot; }

  // ---- Fix 2: make blank subsystems a real, filterable value ----
  function normalizeBlanks() {
    var M = window[G]; if (!M || !M._state) return;
    var rows = M._state.allRows; if (!rows) return;
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      if (r && (r.subsystem == null || r.subsystem === '')) r.subsystem = BLANK;
    }
  }

  // ---- Fix 1: scope the subsystem whitelist to ITPs (on type change only) ----
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
    normalizeBlanks();
    var root = host(); if (!root) return;
    var sel = root.querySelector('select.dtsel');
    if (sel && !sel.__mpsCapHook) {
      sel.__mpsCapHook = true;
      sel.addEventListener('change', function (e) { try { onType(e.target.value); } catch (_) {} }, true);
    }
  }

  // One-time on load: if we come up already on a non-ITP view with the stale
  // ITP whitelist applied, correct it once (not repeated).
  if (!window.__mpsDelivInit) {
    window.__mpsDelivInit = true;
    try {
      normalizeBlanks();
      var root = host(), sel = root && root.querySelector('select.dtsel');
      if (sel && sel.value !== ITP) { onType(sel.value); sel.dispatchEvent(new Event('change', { bubbles: true })); }
    } catch (e) {}
  }

  if (!window.__mpsDelivFixIv) { window.__mpsDelivFixIv = setInterval(attach, 800); }
  try { attach(); } catch (e) {}
})();
