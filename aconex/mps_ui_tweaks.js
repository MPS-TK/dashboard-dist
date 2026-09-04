/* MPS GROUP — Aconex Register UI tweaks (both tabs). Self-contained enhancement layer loaded by launcher.js. */
(function () {
  /* Single dashboard version — the Aconex Dashboard is ONE updatable element.
     All tabs (Doc. Registers + RFIs/TQs + Variations) display this exact string; bump it here in one place. */
  var AC_VER = 'v12.20 \u00B7 4 Sep 2026';

  var MODS = [
    { host: 'mps-aconex-host',     g: '__MPS_ACONEX' },
    { host: 'mps-aconex-rfi-host', g: '__MPS_ACONEX_RFI' },
    { host: 'mps-aconex-var-host', g: '__MPS_ACONEX_VAR' }
  ];
  window.__mpsUiTweaks = function () {
    MODS.forEach(function (m) {
      var M = window[m.g]; if (!M || !M.__live) return;
      var host = document.getElementById(m.host); var root = host && host.shadowRoot; if (!root) return;
      var S = M._state; if (!S || !S.cols || !S.order) return;
      var FITKEY = 'mps_fit1_' + m.g;
      if (typeof M.__fit1 === 'undefined') { try { M.__fit1 = localStorage.getItem(FITKEY) === '1'; } catch (e) { M.__fit1 = false; } }

      /* unify the version badge across both tabs */
      var vb = root.querySelector('.vbadge');
      if (vb && vb.textContent !== AC_VER) vb.textContent = AC_VER;

      var st = root.getElementById('mps-ui-tweaks');
      if (!st) { st = document.createElement('style'); st.id = 'mps-ui-tweaks'; root.appendChild(st); }
      st.textContent =
        '.mps-empty-date,.mps-empty-date::-webkit-datetime-edit,.mps-empty-date::-webkit-datetime-edit-text,.mps-empty-date::-webkit-datetime-edit-day-field,.mps-empty-date::-webkit-datetime-edit-month-field,.mps-empty-date::-webkit-datetime-edit-year-field{color:#c7cdd7 !important}'
        + '#wrap.dark .mps-empty-date,#wrap.dark .mps-empty-date::-webkit-datetime-edit,#wrap.dark .mps-empty-date::-webkit-datetime-edit-text,#wrap.dark .mps-empty-date::-webkit-datetime-edit-day-field,#wrap.dark .mps-empty-date::-webkit-datetime-edit-month-field,#wrap.dark .mps-empty-date::-webkit-datetime-edit-year-field{color:#47566a !important}'
        + '#colpanel{max-width:none !important;width:max-content !important}'
        + '#colpanel .clist{overflow-y:auto !important}'
        + '.mps-fit-on{background:#16c60c !important;border-color:#0ea60a !important;color:#04360a !important;font-weight:700 !important}'
        /* item f: the manual-entry boxes carried the row height floor — strip their padding and line box */
        + '#wrap td.edit input,#wrap td.edit select{padding:0 2px !important;line-height:1 !important;height:auto !important}'
        + '#wrap td.edit input[type=date]{padding:0 1px !important;min-height:0 !important}'
        + '#wrap td.edit .enumval{padding:0 5px !important;line-height:1.15 !important}'
        + '#wrap .corrbox{min-height:0 !important}'
        /* v12.14 item b: below the row-density minimum the date picker comes off,
           which is what is holding the row at its floor (the native control is
           taller than every other cell). Pressing + puts it back. */
        + '#wrap.mps-nodate td.edit input[type=date]::-webkit-calendar-picker-indicator{display:none!important}'
        + '#wrap.mps-nodate td.edit input[type=date]{padding:0!important;min-height:0!important;height:14px!important}'
        /* the picker is what blocks the floor on Variations; on the other two tabs it is
           the cell line box and the coloured pills, so this mode flattens those as well.
           Everything here is undone the moment + is pressed. */
        + '#wrap.mps-nodate tbody td{line-height:1.1!important}'
        + '#wrap.mps-nodate tbody td span{padding-top:0!important;padding-bottom:0!important;line-height:1.1!important}'
        + '#wrap.mps-nodate tbody td.edit input,#wrap.mps-nodate tbody td.edit select{height:14px!important}'
        + '#wrap .mps-pm{display:inline-flex;align-items:center;gap:3px;margin-right:4px;vertical-align:middle}'
        + '#wrap #fontlbl{margin-left:2px}'
        /* item e: RFIs/TQs and Variations only — the chart fills its panel and sits
           centred, with 10px clear to every edge. Doc. Registers is left as it is. */
        + (m.g === '__MPS_ACONEX' ? '' :
            '.cgrow>.cpanel.cpt{display:flex;flex-direction:column}'
          + '.cgrow>.cpanel.cpt>.cpbody{flex:1 1 auto;display:flex;min-height:0}'
          + '.charts{flex:1 1 auto;display:flex;align-items:center;justify-content:center;padding:10px !important;box-sizing:border-box;min-height:0}'
          + '.chartsrow{align-items:center;justify-content:center;align-content:center;width:100%}');
      Array.prototype.forEach.call(root.querySelectorAll('td.edit input[type=date]'), function (inp) { inp.classList.toggle('mps-empty-date', !inp.value); });
      /* sub-minimum row density: the class is re-applied on every tick because the
         module rebuilds #wrap's contents on most renders */
      var NDKEY = 'mps_nodate_' + m.g;
      if (typeof M.__noDate === 'undefined') { try { M.__noDate = localStorage.getItem(NDKEY) === '1'; } catch (e) { M.__noDate = false; } }
      var wrapEl = root.getElementById('wrap');
      if (wrapEl) wrapEl.classList.toggle('mps-nodate', !!M.__noDate);
      function setNoDate(on) {
        M.__noDate = !!on;
        try { localStorage.setItem(NDKEY, on ? '1' : '0'); } catch (e) {}
        var w = root.getElementById('wrap'); if (w) w.classList.toggle('mps-nodate', !!on);
      }

      /* ---- item a: a full step either side of every chart / bar size slider ----
         The slider lives in the STATS panel on RFIs/TQs and Variations and in the
         Charts panel on Doc. Registers, so both containers are covered. Pressing a
         button sets the value and fires 'input', which is what the module's own
         handler listens to — no module change needed. */
      function pmGroup(slider, step, tipDown, tipUp, belowMin) {
        if (slider.__mpsPM) return; slider.__mpsPM = 1;
        function bump(dir) {
          var mn = +slider.min || 0, mx = +slider.max || 100, cur = +slider.value;
          var v = Math.max(mn, Math.min(mx, cur + dir * step));
          if (v === cur) { if (belowMin) belowMin(dir, cur, mn); return; }
          /* coming back up from a sub-minimum state: undo that first */
          if (dir > 0 && belowMin && belowMin(dir, cur, mn) === 'consumed') return;
          slider.value = String(v);
          slider.dispatchEvent(new Event('input', { bubbles: true }));
        }
        var grp = document.createElement('span'); grp.className = 'mps-pm';
        [['\u2212', tipDown, -1], ['+', tipUp, 1]].forEach(function (p) {
          var b = document.createElement('button');
          /* the module's own classes, so these are the same size and colour as the
             font-size steppers already in the toolbar, dark mode included */
          b.className = 'btn sq';
          b.textContent = p[0]; b.title = p[1]; b.type = 'button';
          b.onclick = function (e) { e.preventDefault(); e.stopPropagation(); bump(p[2]); };
          grp.appendChild(b);
        });
        if (slider.parentNode) slider.parentNode.insertBefore(grp, slider);
      }
      /* Move the font-size readout to the LEFT of its own \u2212/+ pair. It used to sit
         immediately before the words "Row Density", which read as "12px Row Density".
         Re-checked every tick because the toolbar is rebuilt on most renders. */
      var fl = root.getElementById('fontlbl');
      if (fl && fl.parentNode && fl.parentNode.firstChild !== fl) fl.parentNode.insertBefore(fl, fl.parentNode.firstChild);

      Array.prototype.forEach.call(root.querySelectorAll('#chartctl input[type=range], .dohd input[type=range]'), function (sl) {
        pmGroup(sl, 10, 'One size smaller', 'One size larger');
      });
      /* ---- item f: row density in 1px steps, without taking any more toolbar width ---- */
      Array.prototype.forEach.call(root.querySelectorAll('.toolbar input[type=range]'), function (sl) {
        if (!/row height/i.test(sl.title || '')) return;
        if (!sl.__mpsNarrow) { sl.__mpsNarrow = 1; sl.style.width = '74px'; }
        pmGroup(sl, 1, 'Tighter rows (1px) — at the minimum, the next press removes the date pickers so the rows can go tighter still',
          'Looser rows (1px) — puts the date pickers back first if they were removed', function (dir, cur, mn) {
            if (dir < 0) { if (cur <= mn && !M.__noDate) { setNoDate(true); } return; }
            if (dir > 0 && M.__noDate) { setNoDate(false); return 'consumed'; }
          });
      });
      var fitBtn = null, bs = root.querySelectorAll('button');
      for (var i = 0; i < bs.length; i++) { if ((bs[i].textContent || '').trim() === 'Fit to 1 Page') { fitBtn = bs[i]; break; } }
      if (fitBtn && !fitBtn.__mpsWrapped) {
        fitBtn.__mpsWrapped = true; var origFit = fitBtn.onclick;
        fitBtn.onclick = function (ev) {
          if (!M.__fit1) { M.__fit1 = true; try { localStorage.setItem(FITKEY, '1'); } catch (e) {} if (typeof origFit === 'function') { try { origFit.call(fitBtn, ev); } catch (e) {} } }
          else { M.__fit1 = false; try { localStorage.setItem(FITKEY, '0'); } catch (e) {} }
          paint();
        };
      }
      function paint() { var b = root.querySelectorAll('button'); for (var i = 0; i < b.length; i++) { if ((b[i].textContent || '').trim() === 'Fit to 1 Page') { b[i].classList.toggle('mps-fit-on', !!M.__fit1); } } }
      paint();
      if (!root.__mpsResizeHook) {
        root.__mpsResizeHook = true;
        root.addEventListener('mousedown', function (ev) {
          if (!M.__fit1) return;
          var path = ev.composedPath ? ev.composedPath() : [ev.target], handle = null;
          for (var i = 0; i < path.length; i++) { if (path[i].classList && path[i].classList.contains('rez')) { handle = path[i]; break; } }
          if (!handle) return;
          var vis = S.order.filter(function (k) { return S.cols[k] && S.cols[k].show; });
          var rezAll = Array.prototype.slice.call(root.querySelectorAll('.rez'));
          var idx = rezAll.indexOf(handle); if (idx < 0 || idx >= vis.length) return;
          var key = vis[idx], before = {}; vis.forEach(function (k) { before[k] = S.cols[k].w; });
          var total0 = vis.reduce(function (a, k) { return a + S.cols[k].w; }, 0), oldW = S.cols[key].w;
          var up = function () {
            document.removeEventListener('mouseup', up, true);
            setTimeout(function () {
              var wNew = S.cols[key].w; if (wNew === oldW) return;
              var others = vis.filter(function (k) { return k !== key; }); if (!others.length) return;
              var MIN = 40;
              var budget = total0 - wNew, minBudget = others.length * MIN;
              if (budget < minBudget) { budget = minBudget; wNew = total0 - budget; S.cols[key].w = wNew; }
              var sumB = others.reduce(function (a, k) { return a + before[k]; }, 0); if (sumB <= 0) return;
              var arr = [], acc = 0;
              others.forEach(function (k) { var w = Math.round(budget * before[k] / sumB); if (w < MIN) w = MIN; arr.push([k, w]); acc += w; });
              var fix = budget - acc;
              if (fix) { arr.sort(function (a, b) { return b[1] - a[1]; }); arr[0][1] = Math.max(MIN, arr[0][1] + fix); }
              arr.forEach(function (p) { S.cols[p[0]].w = p[1]; });
              try { M.boot(); } catch (e) {}
              setTimeout(function () { try { window.__mpsUiTweaks(); } catch (e) {} }, 30);
            }, 0);
          };
          document.addEventListener('mouseup', up, true);
        }, true);
      }
      if (!root.__mpsObs) {
        root.__mpsObs = new MutationObserver(function () { if (root.__mpsPend) return; root.__mpsPend = true; setTimeout(function () { root.__mpsPend = false; try { window.__mpsUiTweaks(); } catch (e) {} }, 80); });
        root.__mpsObs.observe(root, { childList: true, subtree: true });
      }
    });
  };
  if (!window.__mpsUiTweaksIv) { window.__mpsUiTweaksIv = setInterval(function () { try { window.__mpsUiTweaks(); } catch (e) {} }, 1500); }
  try { window.__mpsUiTweaks(); } catch (e) {}
})();
