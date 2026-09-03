/* MPS GROUP — Aconex Register UI tweaks (both tabs). Self-contained enhancement layer loaded by launcher.js. */
(function () {
  /* Single dashboard version — the Aconex Dashboard is ONE updatable element.
     Both tabs (Doc. Registers + RFIs/TQs) display this exact string; bump it here in one place. */
  var AC_VER = 'v12.6 \u00B7 1 Sep 2026';

  var MODS = [
    { host: 'mps-aconex-host',     g: '__MPS_ACONEX' },
    { host: 'mps-aconex-rfi-host', g: '__MPS_ACONEX_RFI' }
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
        + '.mps-fit-on{background:#16c60c !important;border-color:#0ea60a !important;color:#04360a !important;font-weight:700 !important}';
      Array.prototype.forEach.call(root.querySelectorAll('td.edit input[type=date]'), function (inp) { inp.classList.toggle('mps-empty-date', !inp.value); });
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
