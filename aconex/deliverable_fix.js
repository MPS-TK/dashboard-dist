/* =====================================================================
 * MPS GROUP — Deliverable-type capture fix (Aconex Doc. Registers/ITP tab)
 *
 * Problem: the dashboard initialises the SUBSYSTEM filter to all ITP
 * subsystems by default and applies it to EVERY deliverable type. Only
 * Inspection & Test Plans carry those subsystems, so selecting any other
 * deliverable type (Register, Report, Plan, Certificate, ...) filters the
 * whole view to zero — the items are captured in the data but hidden.
 *
 * Fix: the subsystem filter applies ONLY to "Inspection and Test Plan".
 * For every other deliverable type (and the "All" view) the subsystem
 * filter is not applied, so all deliverable types are always captured.
 * The ITP subsystem selection is saved and restored when toggling back to
 * the ITP view, so nothing is lost.
 *
 * Self-contained external layer — no edit to the module source. Loaded by
 * loader.js after the ITP module builds. Idempotent.
 * ===================================================================== */
(function () {
  var HOST = 'mps-aconex-host', G = '__MPS_ACONEX', ITP = 'Inspection and Test Plan';

  function host() { var h = document.getElementById(HOST); return h && h.shadowRoot; }

  function curType(M) {
    var root = host(), sel = root && root.querySelector('select.dtsel');
    if (sel) return sel.value;
    return M._state && M._state.deliverableType;
  }

  // Enforce the invariant on the given (or current) deliverable type.
  // Returns true if it changed the subsystem filter.
  function enforce(newType) {
    var M = window[G]; if (!M || !M.__live) return false;
    var S = M._state; if (!S || !S.selFilters) return false;
    var t = (newType != null) ? newType : curType(M);
    var sub = S.selFilters.subsystem;
    var hasSub = Array.isArray(sub) && sub.length > 0;
    if (t !== ITP) {
      // non-ITP view: subsystem filter must not apply
      if (hasSub) { M.__mpsSavedSub = sub.slice(); S.selFilters.subsystem = null; return true; }
    } else {
      // ITP view: restore the saved subsystem selection if we cleared it
      if (!hasSub && M.__mpsSavedSub) { S.selFilters.subsystem = M.__mpsSavedSub; M.__mpsSavedSub = null; return true; }
    }
    return false;
  }

  // Attach a CAPTURE-phase change listener on the deliverable-type dropdown,
  // so the subsystem state is corrected BEFORE the module re-renders → no flash.
  function attach() {
    var root = host(); if (!root) return;
    var sel = root.querySelector('select.dtsel');
    if (sel && !sel.__mpsCapHook) {
      sel.__mpsCapHook = true;
      sel.addEventListener('change', function (e) { try { enforce(e.target.value); } catch (_) {} }, true);
    }
  }

  // Safety net: catch programmatic type changes; if the invariant is violated,
  // fix it and re-render via the real path.
  function tick() {
    var M = window[G]; if (!M || !M.__live) return;
    attach();
    if (enforce(null)) {
      var root = host(), sel = root && root.querySelector('select.dtsel');
      if (sel) { sel.dispatchEvent(new Event('change', { bubbles: true })); }
      else { try { M.boot(); } catch (_) {} }
    }
  }

  if (!window.__mpsDelivFixIv) { window.__mpsDelivFixIv = setInterval(tick, 700); }
  try { attach(); tick(); } catch (e) {}
})();
