/* =====================================================================
 * MPS GROUP — Aconex Register Dashboard (VARIATIONS module)
 * Third tab of the Aconex Dashboard. Same shell, toolbar, sliders,
 * per-column filters, colour pills, palettes, Fonts / Dark Mode,
 * GitHub team sync and native .xlsx export as the RFI/TQ register.
 *
 * Replaces the "Variation Assessments" workbook:
 *   • VARIATION REGISTER  — one row per VO, columns of the source file
 *     with "Variation" written as "VO", plus Revision and CONCAT Name
 *     (both hidden by default, both selectable in ⚙ Columns).
 *   • ASSESSMENT SHEETS   — the workbook's numbered sheets 1..N, shown
 *     as Excel-style tabs in their own panel BELOW the register.
 *   • Export writes a real multi-sheet .xlsx with LIVE formulas and
 *     cross-sheet references, so the file behaves like the original.
 *
 * Status workflow: Draft → Open → Closed, plus Declined and Disputed.
 * Colours match the RFI/TQ register where the status corresponds.
 * ===================================================================== */
(function () {
  'use strict';
  if (window.__MPS_ACONEX_VAR && window.__MPS_ACONEX_VAR.__live) { window.__MPS_ACONEX_VAR.boot(); return; }

  var NAVY = '#0B2A4A', NAVY2 = '#123a63', ACCENT = '#F26522', LINE = '#dfe4ea', INK = '#1f2d3d';
  var VERSION = 'v12.8', BUILD_DATE = '3 Sep 2026';
  var UI_FONTS = ['Segoe UI', 'Arial', 'Calibri', 'Helvetica', 'Roboto', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Georgia', 'Times New Roman', 'Courier New', 'system-ui'];
  var DEF_FONT = '"Segoe UI",Arial,sans-serif', DEF_BASEPX = 13;
  function fontStack(f) { return f ? ('"' + f + '","Segoe UI",Arial,sans-serif') : DEF_FONT; }

  /* Status workflow — drives the Status dropdown and the chart.
     Draft / Open / Closed keep the RFI/TQ register's colours; Declined and
     Disputed are new to this register. Add more via the dropdown or 🎨. */
  var STATUS_WORKFLOW = ['Draft', 'Open', 'Closed', 'Declined', 'Disputed'];
  var STATUS_COLORS = { 'draft': '#ffffff', 'open': '#fade00', 'closed': '#1855cc', 'declined': '#d93025', 'disputed': '#8a5db0' };
  var TYPE_COLORS = { 'labour': '#0B2A4A', 'equipment': '#2b6cb0', 'materials': '#1a6f2e', 'subcontract': '#8a5db0', 'other': '#8a939b' };
  var ITEM_TYPES = ['Labour', 'Equipment', 'Materials', 'Subcontract', 'Other'];
  var UNITS = ['Hours', 'Days', 'Each', 'Units', 'Bulk', 'Lump Sum', 'm', 'm2', 'm3', 't', 'km'];

  var CFG = { projectId: detectProjectId(), projectName: 'Olympic Dam Airport Upgrade', mpsProjectNo: '73409', workPackage: '9100079251' };
  function detectProjectId() { try { var m = (document.documentElement.innerHTML || '').match(/projectId["'=:\s]+(\d{10,})/); if (m) return m[1]; } catch (e) { } return ''; }
  var DEFAULT_XPID = '2013294019', DEFAULT_XNAME = 'Construction Non Process Infrastructure Cu SA Growth Prgm';

  /* ---- seed register + assessment sheets (from the Variation Assessments workbook) ---- */
var SEED_REG=[{"voNo":1,"dateSub":"2026-05-27","siRef":"","bhpVd":"1","rev":0,"desc":"Technology Installation","claim":574959.63,"assessed":574959.63,"status":"Closed","comments":"","corrRef":[],"sheetNo":""},{"voNo":2,"dateSub":"2026-05-10","siRef":"","bhpVd":"2","rev":0,"desc":"Alternative Baggage Reclaim Concrete Pad","claim":25296.22,"assessed":25296.22,"status":"Closed","comments":"","corrRef":[],"sheetNo":""},{"voNo":3,"dateSub":"2026-06-04","siRef":"","bhpVd":"N/A","rev":0,"desc":"Airport Bus Transport","claim":21995.81,"assessed":0,"status":"Closed","comments":"Included in Contract Scope of Work. MPS responsbile for transportation from ODV and ODS.","corrRef":[],"sheetNo":""},{"voNo":4,"dateSub":"2026-06-26","siRef":"","bhpVd":"3","rev":0,"desc":"DM09 Conc Slab Thickness Exceedance","claim":47972.38,"assessed":47972.38,"status":"Closed","comments":"","corrRef":[],"sheetNo":""},{"voNo":5,"dateSub":"2026-06-18","siRef":"001","bhpVd":"3","rev":0,"desc":"SI001 - Baggage Make up camera relocation","claim":1292.96,"assessed":1292.96,"status":"Closed","comments":"","corrRef":[],"sheetNo":""},{"voNo":6,"dateSub":"2026-08-05","siRef":"","bhpVd":"3","rev":0,"desc":"Additional Compaction Testing near PF1-T13","claim":634.77,"assessed":634.77,"status":"Closed","comments":"","corrRef":[],"sheetNo":""},{"voNo":7,"dateSub":"2026-08-13","siRef":"","bhpVd":"4","rev":0,"desc":"Phase 1 Services Not Shown / Hydrovac Investigation","claim":28372.52,"assessed":16738.85,"status":"Closed","comments":"MPS Assessed & Accepted","corrRef":[],"sheetNo":"1"},{"voNo":8,"dateSub":"2026-08-13","siRef":"002","bhpVd":"4","rev":0,"desc":"Temporary LV Camera GPO Power Relocation","claim":22268.32,"assessed":10546.1,"status":"Closed","comments":"MPS Assessed & Accepted","corrRef":[],"sheetNo":"2"},{"voNo":9,"dateSub":"2026-08-13","siRef":"002","bhpVd":"4","rev":0,"desc":"Relocate Power Supply to Fit Test Building","claim":47453.0,"assessed":29297.12,"status":"Closed","comments":"MPS Assessed & Accepted","corrRef":[],"sheetNo":"3"},{"voNo":10,"dateSub":"2026-08-13","siRef":"","bhpVd":"4","rev":0,"desc":"Install New Electrical Conduits at T11-T14 PF2","claim":9797.69,"assessed":5407,"status":"Closed","comments":"MPS Assessed & Accepted","corrRef":[],"sheetNo":"4"},{"voNo":11,"dateSub":"2026-08-13","siRef":"","bhpVd":"4","rev":0,"desc":"Additional Concrete TS-T14 PF2","claim":3490.36,"assessed":2950.81,"status":"Closed","comments":"MPS Assessed & Accepted","corrRef":[],"sheetNo":"5"},{"voNo":12,"dateSub":"2026-08-27","siRef":"","bhpVd":"4","rev":0,"desc":"Fire Wall 1 & 2 Hydrovac Support","claim":11406.25,"assessed":8174,"status":"Closed","comments":"MPS Assessed & Accepted","corrRef":[],"sheetNo":"6"},{"voNo":13,"dateSub":"2026-08-27","siRef":"","bhpVd":"4","rev":0,"desc":"TS-T14 PF2 Rock Breaker / Stabilised Sand","claim":9244.18,"assessed":6492.81,"status":"Closed","comments":"MPS Assessed & Accepted","corrRef":[],"sheetNo":"7"},{"voNo":14,"dateSub":"2026-08-27","siRef":"","bhpVd":"4","rev":0,"desc":"HVAC Evap Unit Security Camera Relocation","claim":1944.37,"assessed":1301.84,"status":"Closed","comments":"MPS Assessed & Accepted","corrRef":[],"sheetNo":"8"},{"voNo":15,"dateSub":"2026-08-27","siRef":"","bhpVd":"4","rev":0,"desc":"Airport Apron Floodlight Adjustment","claim":4815.05,"assessed":4815.05,"status":"Closed","comments":"Completed by separate MPS BaU team - price pre-agreed with BHP before commencing. ","corrRef":[],"sheetNo":"9"},{"voNo":16,"dateSub":"2026-09-03","siRef":"003","bhpVd":"4","rev":0,"desc":"SI003 - PLC Modifications","claim":6652.08,"assessed":6652.08,"status":"Closed","comments":"SI-003 issued by BHP for pre-agreed fixed price.","corrRef":[],"sheetNo":""},{"voNo":17,"dateSub":"2026-05-16","siRef":"","bhpVd":"4","rev":0,"desc":"Missed Flights - Backcharge to MPS","claim":-200,"assessed":-200,"status":"Closed","comments":"Credit accepted by BHP","corrRef":[],"sheetNo":""},{"voNo":18,"dateSub":"2026-08-27","siRef":"","bhpVd":"4","rev":0,"desc":"Headwall & PF5_Credit","claim":-7575.71,"assessed":-7575.71,"status":"Closed","comments":"Credit accepted by BHP","corrRef":[],"sheetNo":""},{"voNo":19,"dateSub":"2026-08-13","siRef":"","bhpVd":"4","rev":0,"desc":"Reuse of relocated fire hydrant","claim":7111.63,"assessed":3802.63,"status":"Closed","comments":"Per feedback from Lucy McEwen (BHPCSAMP-GCOR-003105), Franna and operator costs approved; plumbing and other unapproved costs excluded. ","corrRef":[],"sheetNo":"10"},{"voNo":20,"dateSub":"2026-08-31","siRef":"","bhpVd":"4","rev":0,"desc":"Phase 2 - Relocate PA Gate for Airside Access","claim":2702.91,"assessed":1833.85,"status":"Closed","comments":"Pending BHP assessment of contractor variation proposal.","corrRef":["MPS-VAR-021"],"sheetNo":"11"}];
var SEED_SHEETS={"1":{"no":"1","title":"Phase 1 Services Not Shown / Hydrovac Investigation","items":[{"desc":"Operator-CNPI-Day","type":"Labour","qty":32.5,"unit":"Hours","rate":98.9,"aQty":32.5,"aRate":98.9,"bhpComments":"Substantiated by invoices."},{"desc":"Truck Driver-CNPI-Day","type":"Labour","qty":24,"unit":"Hours","rate":98.9,"aQty":24,"aRate":98.9,"bhpComments":"Substantiated by invoices."},{"desc":"Manager - Construction/ Site/ Project-CNPI-Day","type":"Labour","qty":2.5,"unit":"Hours","rate":189.46,"aQty":0,"aRate":189.46,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Supervisor-BHP","type":"Labour","qty":32,"unit":"Hours","rate":148.28,"aQty":0,"aRate":148.28,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"HSEC Advisor","type":"Labour","qty":32,"unit":"Hours","rate":148.28,"aQty":0,"aRate":148.28,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Project Engineer-CNPI-Day","type":"Labour","qty":10,"unit":"Hours","rate":156.51,"aQty":0,"aRate":156.51,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Vacuum Truck 8000L","type":"Equipment","qty":3,"unit":"Days","rate":3500,"aQty":3,"aRate":3465,"bhpComments":"As per provided invoice. Daily rate of $3,300 + 5% Contractor mark-up."},{"desc":"Consumables / PPE","type":"Materials","qty":3,"unit":"Each","rate":252,"aQty":3,"aRate":252,"bhpComments":"Substantiated by invoices."}]},"2":{"no":"2","title":"Temporary LV Camera GPO Power Relocation","items":[{"desc":"Manager - Construction/ Site/ Project-CNPI-Day","type":"Labour","qty":5,"unit":"Hours","rate":189.46,"aQty":0,"aRate":189.46,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Supervisor-BHP","type":"Labour","qty":30,"unit":"Hours","rate":148.28,"aQty":0,"aRate":148.28,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Electrician","type":"Labour","qty":60,"unit":"Hours","rate":136.48,"aQty":60,"aRate":136.48,"bhpComments":"HV works completed but HV accredited electrician/supervision required for works. Hours applicable across variations."},{"desc":"HSEC Advisor","type":"Labour","qty":30,"unit":"Hours","rate":148.28,"aQty":0,"aRate":148.28,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Project Engineer-CNPI-Day","type":"Labour","qty":12,"unit":"Hours","rate":156.51,"aQty":0,"aRate":156.51,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Ute Surface 4X4-CNPI","type":"Equipment","qty":3,"unit":"Days","rate":107.1,"aQty":3,"aRate":107.1,"bhpComments":"Additional ute mobilised by electrical crew."},{"desc":"EWP","type":"Equipment","qty":2,"unit":"Days","rate":419,"aQty":2,"aRate":419,"bhpComments":"Accepted as part of assessment."},{"desc":"Materials & Consumables - Electrical Materials","type":"Materials","qty":1,"unit":"Each","rate":1198,"aQty":1,"aRate":1198,"bhpComments":"Supported by Invoice from Rexel."}]},"3":{"no":"3","title":"Relocate Power Supply to Fit Test Building","items":[{"desc":"Electrician-HV-CNPI-Day","type":"Labour","qty":128,"unit":"Hours","rate":136.48,"aQty":128,"aRate":136.48,"bhpComments":"Accepted. Hours applicable across variations."},{"desc":"Electrician-CNPI-Day","type":"Labour","qty":41.5,"unit":"Hours","rate":107.65,"aQty":41.5,"aRate":107.65,"bhpComments":"Accepted. Hours applicable across variations."},{"desc":"Manager - Construction/ Site/ Project-CNPI-Day","type":"Labour","qty":4,"unit":"Hours","rate":189.46,"aQty":0,"aRate":189.46,"bhpComments":"Preliminary resources already covered under existing Contract Price. "},{"desc":"Supervisor-BHP","type":"Labour","qty":48,"unit":"Hours","rate":148.28,"aQty":0,"aRate":148.28,"bhpComments":"Preliminary resources already covered under existing Contract Price. "},{"desc":"HSEC Advisor","type":"Labour","qty":48,"unit":"Hours","rate":148.28,"aQty":0,"aRate":148.28,"bhpComments":"Preliminary resources already covered under existing Contract Price. "},{"desc":"Project/ Site Administration - CNPI-Day","type":"Labour","qty":3,"unit":"Hours","rate":115.33,"aQty":0,"aRate":115.33,"bhpComments":"Preliminary resources already covered under existing Contract Price. "},{"desc":"Project Engineer-CNPI-Day","type":"Labour","qty":18,"unit":"Hours","rate":156.51,"aQty":0,"aRate":156.51,"bhpComments":"Preliminary resources already covered under existing Contract Price. "},{"desc":"4X4 Utility Surface Day Rate-Day Rate-CNPI","type":"Equipment","qty":12,"unit":"Days","rate":107.1,"aQty":12,"aRate":107.1,"bhpComments":"Additional ute mobilised by electrical crew."},{"desc":"EWP-CNPI","type":"Equipment","qty":1,"unit":"Days","rate":420,"aQty":1,"aRate":420,"bhpComments":"Accepted as part of assessment."},{"desc":"Fluke-OTDRCNPI","type":"Equipment","qty":2,"unit":"Days","rate":150,"aQty":2,"aRate":150,"bhpComments":"Accepted as part of assessment."},{"desc":"Electrican Van-CNPI","type":"Equipment","qty":1,"unit":"Days","rate":180,"aQty":1,"aRate":180,"bhpComments":"Accepted as part of assessment."},{"desc":"Materials & Consumables Electrical Materials","type":"Materials","qty":1,"unit":"Each","rate":5175,"aQty":1,"aRate":5175,"bhpComments":"Supported by Invoice from Rexel."}]},"4":{"no":"4","title":"Install New Electrical Conduits at T11-T14 PF2","items":[{"desc":"Manager - Construction/ Site/ Project-CNPI-Day","type":"Labour","qty":1.5,"unit":"Hours","rate":189.46,"aQty":0,"aRate":189.46,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Supervisor-BHP","type":"Labour","qty":25,"unit":"Hours","rate":148.28,"aQty":25,"aRate":148.28,"bhpComments":"Additional supervision/management resources required for variation works."},{"desc":"HSEC Advisor","type":"Labour","qty":24,"unit":"Hours","rate":148.28,"aQty":0,"aRate":148.28,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Project Engineer-CNPI-Day","type":"Labour","qty":3.5,"unit":"Hours","rate":156.51,"aQty":0,"aRate":156.51,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Jack Hammer-Day Rate-CNPI","type":"Equipment","qty":1,"unit":"Days","rate":200,"aQty":1,"aRate":200,"bhpComments":"Invoices provided."},{"desc":"Materials & Consumables (Electrical Materials)","type":"Materials","qty":1,"unit":"Each","rate":1500,"aQty":1,"aRate":1500,"bhpComments":"Supported by Invoice from Rexel."}]},"5":{"no":"5","title":"Additional Concrete TS-T14 PF2","items":[{"desc":"Concreter-CNPI-Day","type":"Labour","qty":1.5,"unit":"Hours","rate":100.54,"aQty":1.5,"aRate":100.54,"bhpComments":"Accepted as part of assessment."},{"desc":"Project Engineer-CNPI-Day","type":"Labour","qty":1.5,"unit":"Hours","rate":156.51,"aQty":0,"aRate":156.51,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"HSEC-CNPI-Day","type":"Labour","qty":1,"unit":"Hours","rate":148.28,"aQty":0,"aRate":148.28,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Supervisor-CNPI-Day","type":"Labour","qty":1,"unit":"Hours","rate":156.51,"aQty":0,"aRate":156.51,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Materials & Consumables Concrete","type":"Materials","qty":4,"unit":"M3","rate":700,"aQty":4,"aRate":700,"bhpComments":"Accepted as part of assessment. Concrete quantities and concrete supply rate to be substantiated by MPS."}]},"6":{"no":"6","title":"Fire Wall 1 & 2 Hydrovac Support","items":[{"desc":"Operator-CNPI-Day","type":"Labour","qty":12,"unit":"Hours","rate":98.9,"aQty":12,"aRate":98.9,"bhpComments":"Substantiated and assessed consistently with the comparable hydrovac variation."},{"desc":"Truck Driver/Spotter-CNPI-Day","type":"Labour","qty":13,"unit":"Hours","rate":98.9,"aQty":13,"aRate":98.9,"bhpComments":"Substantiated and assessed consistently with the comparable hydrovac variation."},{"desc":"Manager - Construction/ Site/ Project-CNPI-Day","type":"Labour","qty":1,"unit":"Hours","rate":189.46,"aQty":0,"aRate":189.46,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Supervisor-BHP","type":"Labour","qty":8.5,"unit":"Hours","rate":148.28,"aQty":0,"aRate":148.28,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"HSEC Advisor","type":"Labour","qty":8.5,"unit":"Hours","rate":148.28,"aQty":0,"aRate":148.28,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Project Engineer-CNPI-Day","type":"Labour","qty":3,"unit":"Hours","rate":156.51,"aQty":0,"aRate":156.51,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Vacuum Truck 8000L-Day Rate-CNPI","type":"Equipment","qty":1.5,"unit":"Days","rate":3500,"aQty":1.5,"aRate":3465,"bhpComments":"Assessed consistently with the comparable hydrovac variation: $3,300 daily rate plus 5% Contractor mark-up."},{"desc":"Materials & Consumables","type":"Materials","qty":2,"unit":"Units","rate":252,"aQty":2,"aRate":252,"bhpComments":"Substantiated by invoices."}]},"7":{"no":"7","title":"TS-T14 PF2 Rock Breaker / Stabilised Sand","items":[{"desc":"Carpenter-CNPI-Day","type":"Labour","qty":9,"unit":"Hours","rate":98.9,"aQty":9,"aRate":98.9,"bhpComments":"Accepted as a direct labour cost for the rock breaker / stabilised sand works."},{"desc":"Manager - Construction/ Site/ Project-CNPI-Day","type":"Labour","qty":1,"unit":"Hours","rate":189.46,"aQty":0,"aRate":189.46,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Supervisor-BHP","type":"Labour","qty":27,"unit":"Hours","rate":148.28,"aQty":27,"aRate":148.28,"bhpComments":"Additional supervision/management resources mobilised for variation works."},{"desc":"HSEC Advisor","type":"Labour","qty":12,"unit":"Hours","rate":148.28,"aQty":0,"aRate":148.28,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Project Engineer-CNPI-Day","type":"Labour","qty":5,"unit":"Hours","rate":156.51,"aQty":0,"aRate":156.51,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Rock Breaker-Day Rate-CNPI","type":"Equipment","qty":2,"unit":"Days","rate":799.58,"aQty":2,"aRate":799.58,"bhpComments":"Accepted as a direct equipment cost in accordance with the submitted breakdown."},{"desc":"Materials & Consumables","type":"Materials","qty":0,"unit":"T","rate":0,"aQty":0,"aRate":0,"bhpComments":""}]},"8":{"no":"8","title":"HVAC Evap Unit Security Camera Relocation","items":[{"desc":"Manager - Construction/ Site/ Project-CNPI-Day","type":"Labour","qty":1,"unit":"Hours","rate":189.46,"aQty":0,"aRate":189.46,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Supervisor-BHP","type":"Labour","qty":1,"unit":"Hours","rate":148.28,"aQty":0,"aRate":148.28,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Electrician","type":"Labour","qty":8,"unit":"Hours","rate":136.48,"aQty":8,"aRate":136.48,"bhpComments":"Although no HV works completed, HV accredited supervision was requied for installation. "},{"desc":"HSEC Advisor","type":"Labour","qty":1,"unit":"Hours","rate":148.28,"aQty":0,"aRate":148.28,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Project Engineer-CNPI-Day","type":"Labour","qty":1,"unit":"Hours","rate":156.51,"aQty":0,"aRate":156.51,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"EWP","type":"Equipment","qty":1,"unit":"Hours","rate":210,"aQty":1,"aRate":210,"bhpComments":"Accepted as a direct equipment cost for the security camera relocation."},{"desc":"Materials & Consumables - Electrical Materials","type":"Materials","qty":0,"unit":"Units","rate":200,"aQty":0,"aRate":200,"bhpComments":""}]},"9":{"no":"9","title":"Airport Apron Floodlight Adjustment ","items":[{"desc":"Manager Construction/ Site/ Project-CNPI-Day","type":"Labour","qty":1.5,"unit":"Hours","rate":189.46,"aQty":1.5,"aRate":189.46,"bhpComments":"Fixed Price of $4,815.05 pre agreed prior to commecing. Prelim resources associated with this Variation are from MPS BaU team."},{"desc":"HSEC Manager-CNPI-Day","type":"Labour","qty":2,"unit":"Hours","rate":181.23,"aQty":2,"aRate":181.23,"bhpComments":"Fixed Price of $4,815.05 pre agreed prior to commecing. Prelim resources associated with this Variation are from MPS BaU team."},{"desc":"Project Engineer-CNPI-Day","type":"Labour","qty":2,"unit":"Hours","rate":156.51,"aQty":2,"aRate":156.51,"bhpComments":"Fixed Price of $4,815.05 pre agreed prior to commecing. Prelim resources associated with this Variation are from MPS BaU team."},{"desc":"Supervisor-CNPI-Day","type":"Labour","qty":6,"unit":"Hours","rate":148.28,"aQty":6,"aRate":148.28,"bhpComments":"Fixed Price of $4,815.05 pre agreed prior to commecing. Prelim resources associated with this Variation are from MPS BaU team."},{"desc":"Electrician-CNPI-Day","type":"Labour","qty":24,"unit":"Hours","rate":107.65,"aQty":24,"aRate":107.65,"bhpComments":"Fixed Price of $4,815.05 pre agreed prior to commecing. Prelim resources associated with this Variation are from MPS BaU team."},{"desc":"Ute - Surface 4x4-Day Rate-CNPI","type":"Equipment","qty":1,"unit":"Days","rate":107.1,"aQty":1,"aRate":107.1,"bhpComments":"Fixed Price of $4,815.05 pre agreed prior to commecing. Prelim resources associated with this Variation are from MPS BaU team."},{"desc":"Misc Hand Tool Allowance-Day Rate-CNPI","type":"Equipment","qty":1,"unit":"Days","rate":95,"aQty":1,"aRate":95,"bhpComments":"Fixed Price of $4,815.05 pre agreed prior to commecing. Prelim resources associated with this Variation are from MPS BaU team."},{"desc":"Materials & Consumables","type":"Materials","qty":"","unit":"Bulk","rate":180,"aQty":1,"aRate":180,"bhpComments":"Fixed Price of $4,815.05 pre agreed prior to commecing. Prelim resources associated with this Variation are from MPS BaU team."}]},"10":{"no":"10","title":"Reuse of relocated fire hydrant","items":[{"desc":"Crane Operator / Driver / Dogman / Rigger-CNPI-Day","type":"Labour","qty":12,"unit":"Hours","rate":107.65,"aQty":12,"aRate":107.65,"bhpComments":"Approved per feedback recorded in Summary (BHPCSAMP-GCOR-003105)."},{"desc":"Plumber-CNPI-Day","type":"Labour","qty":24,"unit":"Hours","rate":128.75,"aQty":0,"aRate":128.75,"bhpComments":"Not approved per the feedback in BHPCSAMP-GCOR-003105."},{"desc":"4x4 Utility Surface-Day Rate-BHP","type":"Equipment","qty":2,"unit":"Days","rate":109.5,"aQty":0,"aRate":109.5,"bhpComments":"Not approved per the feedback in BHPCSAMP-GCOR-003105."},{"desc":"Franna Crane-Day Rate-BHP","type":"Equipment","qty":1,"unit":"Days","rate":912.49,"aQty":1,"aRate":912.49,"bhpComments":"Approved per feedback recorded in Summary (BHPCSAMP-GCOR-003105)."},{"desc":"Fire Hydrant and landing valves","type":"Materials","qty":1,"unit":"Bulk","rate":1598.34,"aQty":1,"aRate":1598.34,"bhpComments":""}]},"11":{"no":"11","title":"Phase 2 - Relocate PA Gate for Airside Access","items":[{"desc":"Manager - Construction/ Site/ Project-CNPI-Day","type":"Labour","qty":1,"unit":"Hours","rate":189.46,"aQty":0,"aRate":189.46,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Supervisor-BHP","type":"Labour","qty":2,"unit":"Hours","rate":148.28,"aQty":0,"aRate":148.28,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Operator-CNPI-BHP","type":"Labour","qty":5,"unit":"Hours","rate":98.9,"aQty":5,"aRate":98.9,"bhpComments":""},{"desc":"Carpenter-CNPI-BHP","type":"Labour","qty":4,"unit":"Hours","rate":98.9,"aQty":4,"aRate":98.9,"bhpComments":""},{"desc":"Welder-CNPI-BHP","type":"Labour","qty":5,"unit":"Hours","rate":128.75,"aQty":5,"aRate":128.75,"bhpComments":""},{"desc":"HSEC Advisor","type":"Labour","qty":1,"unit":"Hours","rate":148.28,"aQty":0,"aRate":148.28,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Project Engineer-CNPI-Day","type":"Labour","qty":1.5,"unit":"Hours","rate":156.51,"aQty":0,"aRate":156.51,"bhpComments":"Preliminary resources already covered under existing Contract Price."},{"desc":"Misc Handtools-Day Rate-CNPI","type":"Equipment","qty":2,"unit":"Units","rate":95,"aQty":2,"aRate":95,"bhpComments":""},{"desc":"Materials & Consumables - Welding Wire Materials","type":"Materials","qty":1,"unit":"Units","rate":110,"aQty":1,"aRate":110,"bhpComments":""}]}};
var RATE_LIB=[{"desc":"Project Engineer-CNPI-Day","type":"Labour","unit":"Hours","rate":156.51},{"desc":"HSEC Advisor","type":"Labour","unit":"Hours","rate":148.28},{"desc":"Manager - Construction/ Site/ Project-CNPI-Day","type":"Labour","unit":"Hours","rate":189.46},{"desc":"Supervisor-BHP","type":"Labour","unit":"Hours","rate":148.28},{"desc":"Materials & Consumables","type":"Materials","unit":"Units","rate":252},{"desc":"EWP","type":"Equipment","unit":"Days","rate":419},{"desc":"Electrician","type":"Labour","unit":"Hours","rate":136.48},{"desc":"Electrician-CNPI-Day","type":"Labour","unit":"Hours","rate":107.65},{"desc":"Materials & Consumables - Electrical Materials","type":"Materials","unit":"Each","rate":1198},{"desc":"Operator-CNPI-Day","type":"Labour","unit":"Hours","rate":98.9},{"desc":"Supervisor-CNPI-Day","type":"Labour","unit":"Hours","rate":156.51},{"desc":"4X4 Utility Surface Day Rate-Day Rate-CNPI","type":"Equipment","unit":"Days","rate":107.1},{"desc":"4x4 Utility Surface-Day Rate-BHP","type":"Equipment","unit":"Days","rate":109.5},{"desc":"Carpenter-CNPI-BHP","type":"Labour","unit":"Hours","rate":98.9},{"desc":"Carpenter-CNPI-Day","type":"Labour","unit":"Hours","rate":98.9},{"desc":"Concreter-CNPI-Day","type":"Labour","unit":"Hours","rate":100.54},{"desc":"Consumables / PPE","type":"Materials","unit":"Each","rate":252},{"desc":"Crane Operator / Driver / Dogman / Rigger-CNPI-Day","type":"Labour","unit":"Hours","rate":107.65},{"desc":"EWP-CNPI","type":"Equipment","unit":"Days","rate":420},{"desc":"Electrican Van-CNPI","type":"Equipment","unit":"Days","rate":180},{"desc":"Electrician-HV-CNPI-Day","type":"Labour","unit":"Hours","rate":136.48},{"desc":"Fire Hydrant and landing valves","type":"Materials","unit":"Bulk","rate":1598.34},{"desc":"Fluke-OTDRCNPI","type":"Equipment","unit":"Days","rate":150},{"desc":"Franna Crane-Day Rate-BHP","type":"Equipment","unit":"Days","rate":912.49},{"desc":"HSEC Manager-CNPI-Day","type":"Labour","unit":"Hours","rate":181.23},{"desc":"HSEC-CNPI-Day","type":"Labour","unit":"Hours","rate":148.28},{"desc":"Jack Hammer-Day Rate-CNPI","type":"Equipment","unit":"Days","rate":200},{"desc":"Manager Construction/ Site/ Project-CNPI-Day","type":"Labour","unit":"Hours","rate":189.46},{"desc":"Materials & Consumables (Electrical Materials)","type":"Materials","unit":"Each","rate":1500},{"desc":"Materials & Consumables - Welding Wire Materials","type":"Materials","unit":"Units","rate":110},{"desc":"Materials & Consumables Concrete","type":"Materials","unit":"M3","rate":700},{"desc":"Materials & Consumables Electrical Materials","type":"Materials","unit":"Each","rate":5175},{"desc":"Misc Hand Tool Allowance-Day Rate-CNPI","type":"Equipment","unit":"Days","rate":95},{"desc":"Misc Handtools-Day Rate-CNPI","type":"Equipment","unit":"Units","rate":95},{"desc":"Operator-CNPI-BHP","type":"Labour","unit":"Hours","rate":98.9},{"desc":"Plumber-CNPI-Day","type":"Labour","unit":"Hours","rate":128.75},{"desc":"Project/ Site Administration - CNPI-Day","type":"Labour","unit":"Hours","rate":115.33},{"desc":"Rock Breaker-Day Rate-CNPI","type":"Equipment","unit":"Days","rate":799.58},{"desc":"Truck Driver-CNPI-Day","type":"Labour","unit":"Hours","rate":98.9},{"desc":"Truck Driver/Spotter-CNPI-Day","type":"Labour","unit":"Hours","rate":98.9},{"desc":"Ute - Surface 4x4-Day Rate-CNPI","type":"Equipment","unit":"Days","rate":107.1},{"desc":"Ute Surface 4X4-CNPI","type":"Equipment","unit":"Days","rate":107.1},{"desc":"Vacuum Truck 8000L","type":"Equipment","unit":"Days","rate":3500},{"desc":"Vacuum Truck 8000L-Day Rate-CNPI","type":"Equipment","unit":"Days","rate":3500},{"desc":"Welder-CNPI-BHP","type":"Labour","unit":"Hours","rate":128.75}];

  /* ---------------------------------------------------------------------
   * Column catalogue. Every column except the three marked AUTO accepts
   * manual entry. "Variation" is written "VO" in every header.
   * ------------------------------------------------------------------- */
  var COLDEF = {
    voNo: { label: 'MPS VO No.', w: 92, edit: 'text', tip: 'Manual entry — the MPS-designated variation number. Feeds XX in the CONCAT Name (VAR-XX).' },
    dateSub: { label: 'Date Submitted', w: 118, edit: 'date', tip: 'Manual entry — date the VO claim / proposal was submitted to BHP.' },
    siRef: { label: 'Site Instruction Ref', w: 128, edit: 'text', dfilter: true, tip: 'Manual entry — BHP Site Instruction reference (e.g. 001). Feeds YY in the CONCAT Name (SI-YY). Blank shows as NA in the CONCAT Name.' },
    bhpVd: { label: 'BHP VO Direction No.', w: 132, edit: 'text', dfilter: true, tip: 'Manual entry — BHP Variation Direction number. Feeds ZZ in the CONCAT Name (VD-ZZ). Blank shows as NA.' },
    rev: { label: 'Revision', w: 82, edit: 'text', tip: 'Manual entry — revision number of this VO. Defaults to 0 and feeds the REV suffix of the CONCAT Name. Hidden by default; tick it in ⚙ Columns to show it.' },
    desc: { label: 'VO Description', w: 300, edit: 'text', tip: 'Manual entry — description of the variation. Feeds the middle of the CONCAT Name. Rows with an assessment sheet show a ⧉ link to that sheet.' },
    concat: { label: 'CONCAT Name', w: 340, edit: 'text', auto: true, tip: 'AUTO — the default document naming convention VAR-XX_SI-YY_VD-ZZ VO Description_REVn, built from MPS VO No., Site Instruction Ref, BHP VO Direction No., VO Description and Revision. Type over it to override; clear the cell to go back to the built name. Hidden by default; tick it in ⚙ Columns to show it.' },
    claim: { label: 'MPS VO Claim/Proposal Amount', w: 148, edit: 'money', tip: 'MPS claimed / proposed amount. Manual entry, EXCEPT where the VO has an assessment sheet — then it is the sheet’s Total Claimed and is read-only (ƒ).' },
    assessed: { label: 'BHP Assessed/Approved Amount', w: 148, edit: 'money', tip: 'BHP assessed / approved amount. Manual entry, EXCEPT where the VO has an assessment sheet — then it is the sheet’s Total Assessed and is read-only (ƒ).' },
    diff: { label: 'Difference', w: 118, auto: true, tip: 'AUTO (ƒ) — MPS VO Claim/Proposal Amount less BHP Assessed/Approved Amount. Exports as a live formula.' },
    status: { label: 'Status', w: 112, edit: 'status', dfilter: true, tip: 'VO workflow status: Draft → Open → Closed, plus Declined and Disputed. Drives the chart and the status colours. Add more statuses via the dropdown or the 🎨 palette.' },
    comments: { label: 'Comments', w: 260, edit: 'text', tip: 'Manual entry — free-text comment / tracking note.' },
    corrRef: { label: 'RFI/Correspondence Ref', w: 200, edit: 'corr', tip: 'Pick one or more RFIs / correspondences from Aconex. The list is built from YOUR Aconex login, so it includes any confidential correspondence you can see. Once selected, the reference is stored in the register and shown to every dashboard user. One line per reference; turn Wrap Text off to collapse to a single line.' },
    sheetNo: { label: 'Assessment Sheet', w: 120, edit: 'text', dfilter: true, tip: 'Manual entry — the assessment sheet number that backs this VO (the numbered tabs below). Set it and the Claim / Assessed amounts roll up from that sheet. Hidden by default; tick it in ⚙ Columns to show it.' }
  };
  /* export column order is fixed (formulas depend on it) and matches this order */
  var FACTORY_ORDER = ['voNo', 'dateSub', 'siRef', 'bhpVd', 'rev', 'desc', 'concat', 'claim', 'assessed', 'diff', 'status', 'comments', 'corrRef', 'sheetNo'];
  /* Revision, CONCAT Name and Assessment Sheet are hidden by default, selectable in ⚙ Columns */
  var FACTORY_SHOW = { voNo: 1, dateSub: 1, siRef: 1, bhpVd: 1, desc: 1, claim: 1, assessed: 1, diff: 1, status: 1, comments: 1, corrRef: 1 };
  var MANUAL_FIELDS = ['voNo', 'dateSub', 'siRef', 'bhpVd', 'rev', 'desc', 'concat', 'claim', 'assessed', 'status', 'comments', 'corrRef', 'sheetNo'];
  var MONEY_FIELDS = ['claim', 'assessed'];

  /* assessment-sheet line item columns */
  var ICOLDEF = {
    desc: { label: 'Description', w: 300, edit: 'text', tip: 'Manual entry — the resource, plant or material being claimed.' },
    type: { label: 'Type', w: 106, edit: 'enum', opts: ITEM_TYPES, dfilter: true, tip: 'Manual entry — Labour / Equipment / Materials / Subcontract / Other.' },
    qty: { label: 'MPS Quantity Claimed', w: 104, edit: 'num', tip: 'Manual entry — quantity claimed by MPS. Leave blank for a lump sum (the Rate is then the whole claim).' },
    unit: { label: 'Unit', w: 88, edit: 'enum', opts: UNITS, tip: 'Manual entry — unit of the quantity (Hours, Days, Each…).' },
    rate: { label: 'Rate', w: 104, edit: 'money', tip: 'Manual entry — MPS rate. Pick a resource from the rate library when adding a line to fill this automatically.' },
    claimTotal: { label: 'MPS Claimed Total', w: 118, auto: true, tip: 'AUTO (ƒ) — MPS Quantity Claimed × Rate (or just the Rate where the quantity is blank). Exports as a live formula.' },
    aQty: { label: 'BHP Assessed Quantity', w: 104, edit: 'num', tip: 'Manual entry — quantity BHP assessed.' },
    aRate: { label: 'BHP Assessed Rate', w: 104, edit: 'money', tip: 'Manual entry — rate BHP assessed.' },
    aTotal: { label: 'BHP Assessed Total', w: 118, auto: true, tip: 'AUTO (ƒ) — BHP Assessed Quantity × BHP Assessed Rate. Exports as a live formula.' },
    lineDiff: { label: 'Difference', w: 106, auto: true, tip: 'AUTO (ƒ) — MPS Claimed Total less BHP Assessed Total. Exports as a live formula.' },
    bhpComments: { label: 'BHP Comments', w: 260, edit: 'text', tip: 'Manual entry — BHP’s assessment comment for this line.' }
  };
  var IORDER = ['desc', 'type', 'qty', 'unit', 'rate', 'claimTotal', 'aQty', 'aRate', 'aTotal', 'lineDiff', 'bhpComments'];

  /* ---- view config ---- */
  function factoryCfg() {
    var cols = {}; FACTORY_ORDER.forEach(function (k) { cols[k] = { show: !!FACTORY_SHOW[k], w: COLDEF[k].w }; });
    var icols = {}; IORDER.forEach(function (k) { icols[k] = { show: true, w: ICOLDEF[k].w }; });
    return {
      order: FACTORY_ORDER.slice(), cols: cols, icols: icols, fontSize: 12, rowPad: 4, wrap: true, chartType: 'donut',
      selFilters: {}, selKnown: {}, chartScale: 1, colorSchemes: { status: {}, type: {} }, fontFamily: '', baseFont: DEF_BASEPX,
      darkMode: false, collapsed: {}, fontScale: 100, padScale: 100, hpadScale: 100, hdrFontSize: null, hdrMaxLines: 2,
      statusSel: '__ALL__', xProjectId: '', xProjectName: '', colNames: {}, statusList: STATUS_WORKFLOW.slice(),
      activeSheet: '', barStat: 'diff', barScale: 1
    };
  }
  var LKEY = 'mps_aconex_var_cfg_' + CFG.mpsProjectNo, DKEY = 'mps_aconex_var_defcfg_' + CFG.mpsProjectNo;
  function loadCfg() {
    try { var live = localStorage.getItem(LKEY); if (live) return mergeCfg(JSON.parse(live)); } catch (e) { }
    try { var d = localStorage.getItem(DKEY); if (d) return mergeCfg(JSON.parse(d)); } catch (e) { }
    return factoryCfg();
  }
  function mergeCfg(saved) {
    var f = factoryCfg();
    var o = (saved.order || f.order).filter(function (k) { return COLDEF[k]; });
    FACTORY_ORDER.forEach(function (k) { if (o.indexOf(k) < 0) o.push(k); });
    var cols = {}; o.forEach(function (k) { var s = (saved.cols || {})[k] || {}; cols[k] = { show: s.show != null ? !!s.show : !!FACTORY_SHOW[k], w: s.w || COLDEF[k].w }; });
    var icols = {}; IORDER.forEach(function (k) { var s = (saved.icols || {})[k] || {}; icols[k] = { show: s.show != null ? !!s.show : true, w: s.w || ICOLDEF[k].w }; });
    var out = f;
    out.order = o; out.cols = cols; out.icols = icols;
    ['fontSize', 'rowPad', 'chartType', 'chartScale', 'fontFamily', 'baseFont', 'fontScale', 'padScale', 'hpadScale',
      'hdrMaxLines', 'statusSel', 'xProjectId', 'xProjectName', 'activeSheet', 'barStat', 'barScale'].forEach(function (k) {
        if (saved[k] != null) out[k] = saved[k];
      });
    out.wrap = (saved.wrap != null ? !!saved.wrap : true);
    out.darkMode = !!saved.darkMode;
    out.hdrFontSize = (saved.hdrFontSize != null ? saved.hdrFontSize : null);
    out.selFilters = saved.selFilters || {};
    out.selKnown = saved.selKnown || {};
    out.collapsed = saved.collapsed || {};
    out.colNames = saved.colNames || {};
    out.colorSchemes = { status: (saved.colorSchemes || {}).status || {}, type: (saved.colorSchemes || {}).type || {} };
    out.statusList = (saved.statusList && saved.statusList.length ? saved.statusList : STATUS_WORKFLOW.slice());
    return out;
  }
  var CFGKEYS = ['order', 'cols', 'icols', 'fontSize', 'rowPad', 'wrap', 'chartType', 'selFilters', 'selKnown', 'chartScale', 'colorSchemes',
    'fontFamily', 'baseFont', 'darkMode', 'collapsed', 'fontScale', 'padScale', 'hpadScale', 'hdrFontSize', 'hdrMaxLines',
    'statusSel', 'xProjectId', 'xProjectName', 'colNames', 'statusList', 'activeSheet', 'barStat', 'barScale'];
  function snapCfg() { var o = {}; CFGKEYS.forEach(function (k) { o[k] = S[k]; }); return o; }
  function saveCfg() { try { localStorage.setItem(LKEY, JSON.stringify(snapCfg())); } catch (e) { } }
  function setAsDefault() { try { localStorage.setItem(DKEY, JSON.stringify(snapCfg())); } catch (e) { } toast('Saved as your default view'); }

  /* ---- state ---- */
  var C = loadCfg();
  var S = { allRows: [], rows: [], filtered: [], sheets: {}, loading: false, error: '',
            globalSearch: '', colFilters: {}, sortKey: '', sortDir: 1, iSort: {}, dirty: false };
  CFGKEYS.forEach(function (k) { S[k] = C[k]; });
  S.xProjectId = (C.xProjectId || detectProjectId() || DEFAULT_XPID);
  S.xProjectName = (C.xProjectName || ((C.xProjectId && C.xProjectId !== DEFAULT_XPID) ? '' : DEFAULT_XNAME));
  S.projects = null;

  /* ---- local persistence of the register itself (not just overrides — this
         register is authored here, so the whole thing is the record) ---- */
  function dataKey() { return 'mps_aconex_var_data_' + CFG.mpsProjectNo; }
  function loadLocal() { try { return JSON.parse(localStorage.getItem(dataKey()) || 'null'); } catch (e) { return null; } }
  function saveLocal() { try { localStorage.setItem(dataKey(), JSON.stringify(payload())); } catch (e) { } }
  function payload() { return { v: 1, ts: Date.now(), register: S.allRows.map(cleanRow), sheets: cleanSheets() }; }
  function cleanRow(r) { var o = {}; MANUAL_FIELDS.forEach(function (k) { if (r[k] !== '' && r[k] != null) o[k] = r[k]; }); o.id = r.id; return o; }
  function cleanSheets() {
    var out = {};
    Object.keys(S.sheets).forEach(function (sn) {
      var sh = S.sheets[sn];
      out[sn] = { no: sn, title: sh.title || '', items: (sh.items || []).map(function (it) {
        var o = {}; IORDER.forEach(function (k) { if (!ICOLDEF[k].auto && it[k] !== '' && it[k] != null) o[k] = it[k]; }); return o;
      }) };
    });
    return out;
  }

  /* ---- GitHub team sync — ONE file, private repo (data stays private) ---- */
  var GH = { repo: 'MPS-TK/ITR-Dashboard', branch: 'main', path: 'aconex/variations_' + CFG.mpsProjectNo + '.json', sha: null, timer: null, state: '', remoteTs: 0 };
  function ghToken() { try { return localStorage.getItem('mps_gh_token') || localStorage.getItem('__itr_gh_token__') || ''; } catch (e) { return ''; } }
  function ghHeaders() { return { Authorization: 'token ' + ghToken(), Accept: 'application/vnd.github+json' }; }
  function setSync(st) { GH.state = st; var b = root && root.getElementById('syncbtn'); if (b) b.textContent = syncLabel(); }
  function syncLabel() { if (!ghToken()) return '🔒 Connect Sync'; return ({ sync: '⟳ Syncing…', save: '⟳ Saving…', ok: '✓ Synced', err: '⚠ Sync Error', conflict: '⚠ Reloaded' })[GH.state] || '✓ Team Sync'; }
  function b64dec(s) { try { return decodeURIComponent(escape(atob(String(s || '').replace(/\n/g, '')))); } catch (e) { return ''; } }
  function b64enc(s) { return btoa(unescape(encodeURIComponent(s))); }

  function ghLoad() {
    if (!ghToken()) return Promise.resolve(false);
    setSync('sync');
    return fetch('https://api.github.com/repos/' + GH.repo + '/contents/' + GH.path + '?ref=' + GH.branch + '&_=' + Date.now(), { headers: ghHeaders(), cache: 'no-store' })
      .then(function (r) { if (r.status === 404) { GH.sha = null; return null; } if (!r.ok) throw 0; return r.json(); })
      .then(function (j) {
        if (j) {
          GH.sha = j.sha;
          var rem = null; try { rem = JSON.parse(b64dec(j.content)); } catch (e) { }
          if (rem && rem.register) { GH.remoteTs = rem.ts || 0; adopt(rem); }
        }
        setSync('ok'); return true;
      })
      .catch(function () { setSync('err'); return false; });
  }
  function ghPush() {
    if (!ghToken()) { saveLocal(); return; }
    saveLocal(); setSync('save'); clearTimeout(GH.timer);
    GH.timer = setTimeout(function () {
      var body = { message: 'Variation register (' + CFG.projectName + ')', content: b64enc(JSON.stringify(payload())), branch: GH.branch };
      if (GH.sha) body.sha = GH.sha;
      fetch('https://api.github.com/repos/' + GH.repo + '/contents/' + GH.path, { method: 'PUT', headers: ghHeaders(), body: JSON.stringify(body) })
        .then(function (r) { if (r.status === 409 || r.status === 422) { return { __conflict: 1 }; } return r.json(); })
        .then(function (j) {
          if (j && j.__conflict) {
            /* someone else saved since we loaded — take theirs, then re-apply and retry once */
            setSync('conflict');
            return fetch('https://api.github.com/repos/' + GH.repo + '/contents/' + GH.path + '?ref=' + GH.branch + '&_=' + Date.now(), { headers: ghHeaders(), cache: 'no-store' })
              .then(function (r) { return r.json(); })
              .then(function (rj) {
                GH.sha = rj.sha;
                var body2 = { message: 'Variation register (' + CFG.projectName + ') — retry after conflict', content: b64enc(JSON.stringify(payload())), branch: GH.branch, sha: GH.sha };
                toast('Someone else saved the register at the same time — your copy has been written over theirs. Check the GitHub history if anything looks missing.');
                return fetch('https://api.github.com/repos/' + GH.repo + '/contents/' + GH.path, { method: 'PUT', headers: ghHeaders(), body: JSON.stringify(body2) }).then(function (r) { return r.json(); });
              });
          }
          return j;
        })
        .then(function (j) { if (j && j.content) GH.sha = j.content.sha; setSync(j && j.content ? 'ok' : 'err'); })
        .catch(function () { setSync('err'); });
    }, 1200);
  }
  function openSyncPanel() {
    var ex = root.getElementById('syncpanel'); if (ex) { ex.remove(); return; }
    var panel = el('div', { id: 'syncpanel', class: 'panel', style: 'right:12px;top:44px;min-width:260px' }, [
      el('h4', {}, [ghToken() ? 'Team sync connected' : 'Connect team sync']),
      el('div', { class: 'muted', style: 'font-size:11px;margin-bottom:6px;max-width:250px;white-space:normal' },
        ['Paste a GitHub token (repo scope) to share the variation register with your team. It is stored only in this browser. The register is held in the PRIVATE repo ' + GH.repo + ' as ' + GH.path + '.'])
    ]);
    var inp = el('input', { type: 'password', placeholder: 'ghp_…', style: 'width:240px;border:1px solid #cfd8e3;border-radius:5px;padding:5px 8px' });
    var save = el('button', { class: 'btn primary', style: 'margin-top:8px', onclick: function () { var v = inp.value.trim(); if (v) { try { localStorage.setItem('mps_gh_token', v); } catch (e) { } } panel.remove(); ghLoad().then(function () { applyScope(); renderAll(); }); } }, ['Save & Connect']);
    panel.appendChild(inp);
    var rowEl = el('div', {}, [save]);
    if (ghToken()) rowEl.appendChild(el('button', { class: 'btn', style: 'margin-left:6px', onclick: function () { try { localStorage.removeItem('mps_gh_token'); } catch (e) { } panel.remove(); renderAll(); } }, ['Disconnect']));
    panel.appendChild(rowEl);
    collapsiblePanel(panel);
    root.getElementById('wrap').appendChild(panel);
  }

  /* ---- rows ---- */
  var __idSeq = 1;
  function newId() { return 'v' + (Date.now().toString(36)) + '-' + (__idSeq++); }
  function blankRow() { var r = { id: newId() }; MANUAL_FIELDS.forEach(function (k) { r[k] = ''; }); r.rev = 0; r.corrRef = []; r.status = 'Draft'; return r; }
  function normRow(d) {
    var r = { id: d.id || newId() };
    MANUAL_FIELDS.forEach(function (k) { r[k] = (d[k] != null ? d[k] : ''); });
    if (r.rev === '' || r.rev == null) r.rev = 0;
    if (!r.corrRef) r.corrRef = [];
    if (typeof r.corrRef === 'string') r.corrRef = r.corrRef ? r.corrRef.split(/[\n,;]+/).map(function (s) { return s.trim(); }).filter(Boolean) : [];
    return r;
  }
  function adopt(d) {
    S.allRows = (d.register || []).map(normRow);
    S.sheets = {};
    var src = d.sheets || {};
    Object.keys(src).forEach(function (sn) {
      var sh = src[sn] || {};
      S.sheets[String(sn)] = { no: String(sn), title: sh.title || '', items: (sh.items || []).map(normItem) };
    });
    recomputeAuto();
  }
  function normItem(it) { var o = {}; IORDER.forEach(function (k) { if (!ICOLDEF[k].auto) o[k] = (it[k] != null ? it[k] : ''); }); return o; }
  function initRows() {
    var local = loadLocal();
    if (local && local.register && local.register.length) adopt(local);
    else adopt({ register: SEED_REG, sheets: SEED_SHEETS });
    if (!S.activeSheet || !S.sheets[S.activeSheet]) S.activeSheet = sheetOrder()[0] || '';
  }
  function sheetOrder() { return Object.keys(S.sheets).sort(function (a, b) { return (parseFloat(a) || 0) - (parseFloat(b) || 0); }); }
  function nextSheetNo() { var mx = 0; sheetOrder().forEach(function (sn) { var n = parseFloat(sn); if (!isNaN(n) && n > mx) mx = n; }); return String(mx + 1); }

  /* ---- numbers, dates, money ---- */
  function num(v) { if (v === '' || v == null) return null; var n = parseFloat(String(v).replace(/[$,\s]/g, '')); return isNaN(n) ? null : n; }
  function money(v) { var n = num(v); if (n == null) return ''; var s = Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); return (n < 0 ? '-$' : '$') + s; }
  function fmtDate(v) { if (!v) return ''; var m = String(v).match(/^(\d{4})-(\d{2})-(\d{2})/); if (m) return m[3] + '/' + m[2] + '/' + m[1]; return String(v); }
  function parseISODay(s) { var m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})/); if (!m) return null; return new Date(+m[1], +m[2] - 1, +m[3]).getTime(); }
  function todayDay() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); }
  /* accepts dd/mm/yyyy, d/m/yy, yyyy-mm-dd, d-mmm-yy */
  function parseAnyDate(s) {
    s = String(s == null ? '' : s).trim(); if (!s) return '';
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
    if (m) return m[1] + '-' + p2(m[2]) + '-' + p2(m[3]);
    m = /^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/.exec(s);
    if (m) { var y = +m[3]; if (y < 100) y += (y > 60 ? 1900 : 2000); return y + '-' + p2(m[2]) + '-' + p2(m[1]); }
    var d = new Date(s); if (!isNaN(d)) return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate());
    return '';
  }
  function p2(n) { n = String(n); return n.length < 2 ? '0' + n : n; }
  function pad2(v) { var x = parseFloat(v); return isNaN(x) ? String(v == null ? '' : v).trim() : (x >= 0 && x < 10 ? '0' + x : String(x)); }

  /* ---- computed fields ---- */
  function lineTot(qty, rate) { var r = num(rate); if (r == null) return 0; var q = num(qty); return q == null ? r : q * r; }
  function sheetTotals(sn) {
    var sh = S.sheets[String(sn)]; if (!sh) return null;
    var c = 0, a = 0;
    (sh.items || []).forEach(function (it) { c += lineTot(it.qty, it.rate); a += lineTot(it.aQty, it.aRate); });
    /* not rounded here — money() rounds for display and Excel sums the raw products,
       so the dashboard and the exported file agree to the cent */
    return { claim: c, assessed: a, diff: c - a, n: (sh.items || []).length };
  }
  function round2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }
  function linkedSheet(r) { var sn = String(r.sheetNo || '').trim(); return (sn && S.sheets[sn]) ? sn : ''; }
  function concatName(r) {
    var vo = pad2(r.voNo) || 'NA';
    var si = String(r.siRef == null ? '' : r.siRef).trim() || 'NA';
    var vdRaw = String(r.bhpVd == null ? '' : r.bhpVd).trim();
    var vd = vdRaw ? pad2(vdRaw) : 'NA';
    var rev = (r.rev === '' || r.rev == null) ? 0 : r.rev;
    return 'VAR-' + vo + '_SI-' + si + '_VD-' + vd + ' ' + String(r.desc || '') + '_REV' + rev;
  }
  function recomputeAuto() {
    S.allRows.forEach(function (r) {
      var sn = linkedSheet(r);
      r._sheet = sn;
      if (sn) { var t = sheetTotals(sn); r._claim = t.claim; r._assessed = t.assessed; }
      else { r._claim = num(r.claim); r._assessed = num(r.assessed); }
      r._diff = (r._claim || 0) - (r._assessed || 0);
      r._concat = concatName(r);
      r.concatShown = (String(r.concat || '').trim() ? r.concat : r._concat);
    });
  }
  function statusOptions() { return (S.statusList && S.statusList.length ? S.statusList.slice() : STATUS_WORKFLOW.slice()); }
  function addStatus(name) {
    name = String(name || '').trim(); if (!name) return false;
    if (!S.statusList) S.statusList = STATUS_WORKFLOW.slice();
    var low = name.toLowerCase();
    for (var i = 0; i < S.statusList.length; i++) if (S.statusList[i].toLowerCase() === low) return false;
    S.statusList.push(name); saveCfg(); return true;
  }
  function isClosedish(r) { var s = String(r.status || '').toLowerCase(); return s === 'closed'; }
  function colLabel(k) { return (S.colNames && S.colNames[k]) || (COLDEF[k] && COLDEF[k].label) || k; }

  function cellVal(row, key) {
    switch (key) {
      case 'dateSub': return fmtDate(row.dateSub);
      case 'claim': return row._claim == null ? '' : money(row._claim);
      case 'assessed': return row._assessed == null ? '' : money(row._assessed);
      case 'diff': return row._diff == null ? '' : money(row._diff);
      case 'concat': return row.concatShown || '';
      case 'corrRef': return (row.corrRef || []).join(', ');
      default: return row[key] == null ? '' : String(row[key]);
    }
  }
  function iCellVal(it, key) {
    switch (key) {
      case 'rate': case 'aRate': return num(it[key]) == null ? '' : money(it[key]);
      case 'claimTotal': return money(lineTot(it.qty, it.rate));
      case 'aTotal': return money(lineTot(it.aQty, it.aRate));
      case 'lineDiff': return money(lineTot(it.qty, it.rate) - lineTot(it.aQty, it.aRate));
      default: return it[key] == null ? '' : String(it[key]);
    }
  }

  /* ---- scope / filters ---- */
  /* A saved multi-select filter is an INCLUSION list, so any value that turns up
     later would be silently hidden — the filter quietly becomes a deny-list for new
     data. (This bit the ITP register; see aconex-open-selected-deploy-log.md v12.5.)
     S.selKnown records the values that existed when a filter was last edited by hand:
     genuinely new values are admitted automatically, deliberate unticks survive, and a
     whitelist that covers everything collapses to null (= All). */
  function distinctAll(k) { var vals = {}; S.allRows.forEach(function (r) { var vv = cellVal(r, k); if (vv !== '') vals[vv] = 1; }); return Object.keys(vals).sort(); }
  function sameSet(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    var m = {}; a.forEach(function (x) { m[x] = 1; });
    for (var i = 0; i < b.length; i++) if (!m[b[i]]) return false;
    return true;
  }
  function reconcileSelKnown() {
    if (!S.allRows || !S.allRows.length) return;
    S.selKnown = S.selKnown || {};
    var changed = false;
    Object.keys(COLDEF).forEach(function (k) {
      if (!COLDEF[k].dfilter) return;
      var now = distinctAll(k), wl = S.selFilters[k];
      if (!Array.isArray(wl)) {                    /* null = "All": nothing can be hidden */
        if (!sameSet(S.selKnown[k], now)) { S.selKnown[k] = now; changed = true; }
        return;
      }
      var known = Array.isArray(S.selKnown[k]) ? S.selKnown[k] : wl;
      var added = now.filter(function (v) { return known.indexOf(v) < 0 && wl.indexOf(v) < 0; });
      if (added.length) { wl = wl.concat(added); S.selFilters[k] = (wl.length >= now.length) ? null : wl; changed = true; }
      if (!sameSet(S.selKnown[k], now)) { S.selKnown[k] = now; changed = true; }
    });
    if (changed) saveCfg();
  }
  function applyScope() {
    reconcileSelKnown();
    S.rows = S.allRows.filter(function (r) {
      if (S.statusSel === '__OPEN__' && isClosedish(r)) return false;
      if (S.statusSel === '__CLOSED__' && !isClosedish(r)) return false;
      return true;
    });
    applyFilters();
  }
  function applyFilters() {
    var g = S.globalSearch.toLowerCase();
    S.filtered = S.rows.filter(function (row) {
      if (g) { if (FACTORY_ORDER.map(function (k) { return cellVal(row, k); }).join(' ').toLowerCase().indexOf(g) < 0) return false; }
      for (var k in S.colFilters) { var f = (S.colFilters[k] || '').toLowerCase(); if (!f) continue; if (cellVal(row, k).toLowerCase().indexOf(f) < 0) return false; }
      for (var sk in S.selFilters) { var arr = S.selFilters[sk]; if (!arr) continue; if (arr.indexOf(cellVal(row, sk)) < 0) return false; }
      return true;
    });
    if (S.sortKey) {
      var numeric = { voNo: 1, rev: 1, claim: 1, assessed: 1, diff: 1 }[S.sortKey];
      S.filtered.sort(function (a, b) {
        if (numeric) {
          var nx = (S.sortKey === 'claim' ? a._claim : S.sortKey === 'assessed' ? a._assessed : S.sortKey === 'diff' ? a._diff : num(a[S.sortKey]));
          var ny = (S.sortKey === 'claim' ? b._claim : S.sortKey === 'assessed' ? b._assessed : S.sortKey === 'diff' ? b._diff : num(b[S.sortKey]));
          nx = (nx == null ? -Infinity : nx); ny = (ny == null ? -Infinity : ny);
          return (nx - ny) * S.sortDir;
        }
        var x = cellVal(a, S.sortKey), y = cellVal(b, S.sortKey);
        return x < y ? -S.sortDir : x > y ? S.sortDir : 0;
      });
    }
  }
  function distinctVals(k) { var vals = {}; S.rows.forEach(function (r) { var vv = cellVal(r, k); if (vv !== '') vals[vv] = 1; }); return Object.keys(vals).sort(); }

  /* ---- writes ---- */
  function setField(row, key, val) {
    row[key] = val;
    if (key === 'sheetNo' || key === 'claim' || key === 'assessed' || key === 'voNo' || key === 'siRef' || key === 'bhpVd' || key === 'desc' || key === 'rev' || key === 'concat') recomputeAuto();
    S.dirty = true; ghPush();
    if (key === 'status' || key === 'sheetNo') applyScope();
  }
  function setItem(sn, idx, key, val) {
    var sh = S.sheets[String(sn)]; if (!sh || !sh.items[idx]) return;
    sh.items[idx][key] = val;
    recomputeAuto(); S.dirty = true; ghPush();
  }

  /* ---------------------------------------------------------------------
   * RFI / Correspondence reference picker.
   * The list is enumerated from the Aconex mail module using the CURRENT
   * user's own session, so whatever that user is entitled to see — including
   * confidential correspondence — is what they can pick from. A picked
   * reference is stored in the register and therefore shown to every user
   * of the dashboard, whether or not they can open it in Aconex; those
   * users see the reference tagged "not in your Aconex list".
   * ------------------------------------------------------------------- */
  var REF_PREFIXES = ['MPSBE-RFI', 'MPSBE-TECHQ', 'BHPCSAMP-RFI', 'BHPCSAMP-TECHQ', 'MPSBE-CORR', 'BHPCSAMP-CORR',
                      'MPSBE-GCOR', 'BHPCSAMP-GCOR', 'MPSBE-LTR', 'BHPCSAMP-LTR', 'MPSBE-NOT', 'BHPCSAMP-NOT'];
  function refListKey() { return 'mps_aconex_var_reflist_' + (S.xProjectId || 'x'); }
  function loadRefList() { try { return JSON.parse(localStorage.getItem(refListKey()) || 'null'); } catch (e) { return null; } }
  function saveRefList(o) { try { localStorage.setItem(refListKey(), JSON.stringify(o)); } catch (e) { } }
  function refKind(no, ctype) {
    var s = String(no || '').toUpperCase(), t = String(ctype || '').toLowerCase();
    if (/request for information|technical query/.test(t) || /-RFI-|-TECHQ-|-TQ-/.test(s)) return 'RFI';
    return 'Correspondence';
  }
  function refListText() {
    var c = loadRefList();
    if (!c || !c.ts) return 'Reference list: not loaded';
    var h = (Date.now() - c.ts) / 3600000; if (h < 0) h = 0;
    return (c.items || []).length + ' refs · ' + h.toFixed(1) + 'h ago';
  }
  var __refSyncing = false;
  function fetchRefList(cb, btn) {
    if (__refSyncing) return; __refSyncing = true;
    var pid = S.xProjectId || detectProjectId() || DEFAULT_XPID;
    var orig = btn ? btn.textContent : '';
    function setb(t) { if (btn) btn.textContent = t; }
    (async function () {
      try {
        if (!pid) { toast('Loading the reference list needs the Aconex project id — open this on the Aconex project first.'); return; }
        /* prefixes: whatever the register already uses, plus the known families */
        var pfx = {};
        REF_PREFIXES.forEach(function (p) { pfx[p] = 1; });
        S.allRows.forEach(function (r) {
          (r.corrRef || []).forEach(function (x) { var m = /^([A-Za-z0-9]+)-([A-Za-z]+)-/.exec(String(x)); if (m) pfx[m[1] + '-' + m[2]] = 1; });
        });
        var jobs = [];
        Object.keys(pfx).forEach(function (p) { jobs.push(['sentbox', p]); jobs.push(['inbox', p]); });
        var found = {}, done = 0, withSubject = true;
        async function one(box, p) {
          var fields = withSubject ? 'docno,corrtypeid,sentdate,subject' : 'docno,corrtypeid,sentdate';
          var url = '/api/projects/' + pid + '/mail?mail_box=' + box + '&page_size=250&search_query='
            + encodeURIComponent('docno:' + p + '*') + '&return_fields=' + fields + '&sort_field=sentDate&sort_direction=DESC';
          var r = await fetch(url, { headers: { Accept: 'application/xml' }, credentials: 'include', cache: 'no-store' });
          if (r.status === 400 && withSubject) { withSubject = false; return one(box, p); }
          if (!r.ok) return;
          var d = new DOMParser().parseFromString(await r.text(), 'text/xml');
          Array.prototype.forEach.call(d.querySelectorAll('Mail'), function (m) {
            function tx(t) { var e = m.getElementsByTagName(t)[0]; return e ? (e.textContent || '').trim() : ''; }
            var no = tx('MailNo'); if (!no) return;
            var ct = tx('CorrespondenceType'), sd = tx('SentDate'), sj = tx('Subject');
            if (!found[no] || (sd && sd > found[no].date)) found[no] = { no: no, kind: refKind(no, ct), ctype: ct, date: (sd || '').slice(0, 10), subj: sj, box: box };
          });
        }
        var i = 0, CONC = 6;
        async function worker() { while (i < jobs.length) { var j = jobs[i++]; try { await one(j[0], j[1]); } catch (e) { } done++; if (done % 4 === 0) setb('Loading refs… ' + done + '/' + jobs.length); } }
        setb('Loading refs…');
        await Promise.all(Array.from({ length: CONC }, worker));
        var items = Object.keys(found).map(function (k) { return found[k]; }).sort(function (a, b) {
          if (a.kind !== b.kind) return a.kind === 'RFI' ? -1 : 1;
          return a.no < b.no ? -1 : a.no > b.no ? 1 : 0;
        });
        saveRefList({ ts: Date.now(), items: items });
        var lbl = root && root.getElementById('reflbl'); if (lbl) lbl.textContent = refListText();
        toast('Reference list loaded — ' + items.length + ' RFIs / correspondences you can see in Aconex');
        if (cb) cb(items);
      } catch (e) { toast('Could not load the reference list: ' + (e && e.message || e)); }
      __refSyncing = false; if (btn) setb(orig);
    })();
  }
  function accessibleRefs() { var c = loadRefList(); return (c && c.items) ? c.items : []; }
  function accessibleMap() { var m = {}; accessibleRefs().forEach(function (it) { m[it.no] = it; }); return m; }

  /* the cell: one line per reference (or a single line when Wrap Text is off) */
  function corrCell(row, base) {
    var list = row.corrRef || [], amap = accessibleMap();
    var td = el('td', { class: 'edit', style: base });
    var box = el('div', { class: 'corrbox' + (S.wrap ? '' : ' oneline'), title: COLDEF.corrRef.tip });
    if (!list.length) {
      box.appendChild(el('span', { class: 'corrnone' }, ['— pick refs —']));
    } else if (S.wrap) {
      list.forEach(function (no) {
        var known = !!amap[no];
        box.appendChild(el('div', { class: 'corrln' + (known ? '' : ' unk'), title: known ? ((amap[no].subj || '') + (amap[no].date ? ' · ' + fmtDate(amap[no].date) : '')) : (no + ' — not in your Aconex list (you may not have access to it)') }, [no]));
      });
    } else {
      box.appendChild(el('span', { class: 'corrln1', title: list.join(', ') }, [list.join(', ')]));
    }
    box.appendChild(el('span', { class: 'enumcar' }, ['▾']));
    box.onclick = function (e) { e.stopPropagation(); openCorrPicker(row, box); };
    td.appendChild(box);
    return td;
  }
  function openCorrPicker(row, anchor) {
    var wrapEl = root.getElementById('wrap');
    var ex = root.getElementById('corrdd'); var same = ex && ex.__row === row; if (ex) ex.remove(); if (same) return;
    var panel = el('div', { id: 'corrdd', class: 'mfpanel', style: 'min-width:340px;max-width:460px;max-height:340px' });
    panel.__row = row;
    var q = '';
    var listWrap = el('div', {});
    function sel() { return (row.corrRef || []).slice(); }
    function setSel(arr) {
      var seen = {}, out = [];
      arr.forEach(function (x) { x = String(x).trim(); if (x && !seen[x]) { seen[x] = 1; out.push(x); } });
      /* RFIs first, then correspondence — one line each, per the register convention */
      var amap = accessibleMap();
      out.sort(function (a, b) {
        var ka = (amap[a] ? amap[a].kind : refKind(a, '')), kb = (amap[b] ? amap[b].kind : refKind(b, ''));
        if (ka !== kb) return ka === 'RFI' ? -1 : 1;
        return a < b ? -1 : a > b ? 1 : 0;
      });
      setField(row, 'corrRef', out);
      renderBody();
    }
    function build() {
      listWrap.innerHTML = '';
      var items = accessibleRefs(), chosen = sel(), chosenMap = {}; chosen.forEach(function (x) { chosenMap[x] = 1; });
      var amap = accessibleMap();
      /* refs already on the row that this user cannot see — kept, shown, never silently dropped */
      var orphan = chosen.filter(function (x) { return !amap[x]; });
      if (orphan.length) {
        listWrap.appendChild(el('div', { class: 'mfsec' }, ['On this VO, not in your Aconex list']));
        orphan.forEach(function (no) {
          var cb = el('input', { type: 'checkbox' }); cb.checked = true;
          cb.onchange = function () { setSel(sel().filter(function (x) { return x !== no; })); build(); };
          listWrap.appendChild(el('label', { class: 'mfrow', title: 'Selected by another user. You may not have access to this correspondence in Aconex.' },
            [cb, el('span', { style: 'flex:1' }, [no]), el('span', { class: 'corrtag' }, ['no access'])]));
        });
      }
      if (!items.length) {
        listWrap.appendChild(el('div', { class: 'muted', style: 'font-size:11px;padding:6px;white-space:normal' },
          ['No reference list loaded yet. Press ⟳ Load refs to read the RFIs and correspondence your Aconex login can see.']));
      }
      ['RFI', 'Correspondence'].forEach(function (kind) {
        var grp = items.filter(function (it) {
          if (it.kind !== kind) return false;
          if (!q) return true;
          return (it.no + ' ' + (it.subj || '')).toLowerCase().indexOf(q) >= 0;
        });
        if (!grp.length) return;
        listWrap.appendChild(el('div', { class: 'mfsec' }, [kind === 'RFI' ? 'RFIs / Technical Queries (' + grp.length + ')' : 'Correspondence (' + grp.length + ')']));
        grp.slice(0, 400).forEach(function (it) {
          var cb = el('input', { type: 'checkbox' }); cb.checked = !!chosenMap[it.no];
          cb.onchange = function () { var s = sel(); if (cb.checked) s.push(it.no); else s = s.filter(function (x) { return x !== it.no; }); setSel(s); build(); };
          listWrap.appendChild(el('label', { class: 'mfrow', title: (it.subj || '') + (it.date ? ' · ' + fmtDate(it.date) : '') },
            [cb, el('span', { style: 'flex:0 0 auto;font-weight:600' }, [it.no]),
             el('span', { class: 'corrsub' }, [it.subj || ''])]));
        });
        if (grp.length > 400) listWrap.appendChild(el('div', { class: 'muted', style: 'font-size:10.5px;padding:2px 6px' }, ['…' + (grp.length - 400) + ' more — narrow with the search box']));
      });
    }
    var srch = el('input', { type: 'search', placeholder: '⌕ search refs / subjects…', style: 'flex:1;min-width:120px;font-size:11px;padding:3px 6px;border:1px solid #cfd8e3;border-radius:4px' });
    srch.oninput = function () { q = srch.value.toLowerCase(); build(); };
    var manual = el('input', { type: 'text', placeholder: 'add a ref by hand…', style: 'flex:1;min-width:110px;font-size:11px;padding:3px 6px;border:1px solid #cfd8e3;border-radius:4px' });
    function addManual() { var v = (manual.value || '').trim(); if (!v) return; setSel(sel().concat([v])); manual.value = ''; build(); }
    manual.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); addManual(); } };
    panel.appendChild(el('div', { class: 'mfhd' }, [
      el('span', { style: 'font-weight:700;color:' + NAVY + ';font-size:11px' }, ['RFI / Correspondence']),
      el('a', { title: 'Clear every reference on this VO', style: 'margin-left:auto', onclick: function () { setSel([]); build(); } }, ['(None)']),
      el('a', { title: 'Read the RFIs and correspondence your Aconex login can see', onclick: function (ev) { fetchRefList(function () { build(); }, ev && ev.currentTarget); } }, ['⟳ Load refs']),
      el('a', { title: 'Close', onclick: function () { panel.remove(); } }, ['✕'])
    ]));
    panel.appendChild(el('div', { class: 'mfrow', style: 'gap:5px' }, [srch]));
    build(); panel.appendChild(listWrap);
    panel.appendChild(el('div', { class: 'mfrow', style: 'border-top:1px solid #e3e9f0;margin-top:4px;padding-top:5px;gap:5px' },
      [manual, el('a', { style: 'font-weight:700;color:' + NAVY, title: 'Add this reference', onclick: function (ev) { ev.preventDefault(); addManual(); } }, ['+ Add'])]));
    wrapEl.appendChild(panel);
    var ar = anchor.getBoundingClientRect(), wr = wrapEl.getBoundingClientRect();
    panel.style.left = Math.max(4, Math.min(ar.left - wr.left, wr.width - 470)) + 'px';
    panel.style.top = (ar.bottom - wr.top + 2) + 'px';
  }

  /* ---- dom helpers ---- */
  var host, root;
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) for (var a in attrs) { if (a === 'style') e.setAttribute('style', attrs[a]); else if (a.slice(0, 2) === 'on') e[a] = attrs[a]; else e.setAttribute(a, attrs[a]); }
    (kids || []).forEach(function (k) { if (k == null) return; e.appendChild(typeof k === 'string' ? document.createTextNode(k) : k); });
    return e;
  }
  function svgEl(t, a) { var e = document.createElementNS('http://www.w3.org/2000/svg', t); for (var k in a) e.setAttribute(k, a[k]); return e; }
  function btn(label, tip, onclick, cls) { return el('button', { class: 'btn' + (cls ? ' ' + cls : ''), title: tip, onclick: onclick }, [label]); }
  function lumFg(hex) { hex = (hex || '').replace('#', ''); if (hex.length === 3) hex = hex.replace(/(.)/g, '$1$1'); var r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16); return (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? '#1f2d3d' : '#ffffff'; }
  function toHex6(h) { h = (h || '').trim(); if (/^#[0-9a-fA-F]{6}$/.test(h)) return h.toLowerCase(); if (/^#[0-9a-fA-F]{3}$/.test(h)) return '#' + h.slice(1).replace(/(.)/g, '$1$1').toLowerCase(); return '#ffffff'; }
  function schemeGet(kind, key) { var m = S.colorSchemes && S.colorSchemes[kind]; return (m && m[key]) ? m[key] : null; }
  function statusColor(v) { var k = (v || '').toLowerCase(); return schemeGet('status', k) || STATUS_COLORS[k] || '#8a939b'; }
  function typeColor(v) { var k = (v || '').toLowerCase(); return schemeGet('type', k) || TYPE_COLORS[k] || '#8a939b'; }
  function colAlpha(i) { var s = ''; i++; while (i > 0) { var m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; }
  function txtWidth(t, fs) { var c = txtWidth._c || (txtWidth._c = document.createElement('canvas').getContext('2d')); c.font = fs + 'px ' + fontStack(S.fontFamily); return c.measureText(t).width; }
  function hdrHasPal(k) { return k === 'status'; }
  function hdrFont() { return (S.hdrFontSize != null ? S.hdrFontSize : (S.fontSize + 2)); }
  function hdrMaxLines() { var n = S.hdrMaxLines || 2; return (n < 1 ? 1 : (n > 3 ? 3 : n)); }
  function minHW(k, def) {
    def = def || COLDEF;
    var hfs = hdrFont(), label = (def === COLDEF ? colLabel(k) : def[k].label);
    var iconW = (def[k].nosort ? 0 : 13) + (def === COLDEF && hdrHasPal(k) ? 17 : 0);
    var space = txtWidth(' ', hfs);
    var units = String(label).split(/\s+/).filter(Boolean).map(function (w) { return txtWidth(w, hfs); });
    if (iconW) units.push(iconW);
    if (!units.length) units.push(iconW || 10);
    var maxUnit = 0, total = 0; units.forEach(function (u, i) { if (u > maxUnit) maxUnit = u; total += u + (i > 0 ? space : 0); });
    var K = hdrMaxLines();
    function fits(W) { var lines = 1, cur = 0; for (var i = 0; i < units.length; i++) { var u = units[i]; if (u > W + 0.5) return false; var add = (cur > 0 ? space : 0) + u; if (cur + add <= W + 0.5) cur += add; else { lines++; cur = u; if (lines > K) return false; } } return true; }
    var lo = Math.ceil(maxUnit), hi = Math.ceil(total), best = hi;
    while (lo <= hi) { var mid = (lo + hi) >> 1; if (fits(mid)) { best = mid; hi = mid - 1; } else lo = mid + 1; }
    return best + 5;
  }
  function visKeys() { return S.order.filter(function (k) { return S.cols[k] && S.cols[k].show; }); }
  function iVisKeys() { return IORDER.filter(function (k) { return S.icols[k] && S.icols[k].show; }); }

  function ensureShell() {
    if (root) return;
    host = document.createElement('div'); host.id = 'mps-aconex-var-host';
    host.setAttribute('style', 'all:initial;position:fixed;inset:0;z-index:2147483000;');
    document.documentElement.appendChild(host);
    root = host.attachShadow({ mode: 'open' });
    var st = document.createElement('style'); st.textContent = CSS(); root.appendChild(st);
    root.appendChild(el('div', { id: 'wrap' }));
    root.insertBefore(st, root.firstChild);
    installOutsideClose();
    try { window.addEventListener('resize', function () { fitRegisterHeight(); equalizePanelHeaders(); }); } catch (e) { }
  }
  function installOutsideClose() {
    root.addEventListener('mousedown', function (e) {
      var open = Array.prototype.slice.call(root.querySelectorAll('#colpanel,#hdrpanel,#mfpanel,#cspanel,#fontpanel,#syncpanel,#projpanel,#corrdd,#enumdd,#ratedd,#pastepanel'));
      if (!open.length) return;
      var path = e.composedPath ? e.composedPath() : [e.target];
      for (var i = 0; i < open.length; i++) { if (path.indexOf(open[i]) >= 0) return; }
      for (var j = 0; j < path.length; j++) { var e2 = path[j]; if (e2 && e2.classList && (e2.classList.contains('pnltrig') || e2.classList.contains('mfbtn') || e2.classList.contains('pkgbtn') || e2.classList.contains('pal') || e2.classList.contains('corrbox') || e2.classList.contains('enumtrig'))) return; }
      open.forEach(function (p) { p.remove(); });
    }, true);
  }
  function fitRegisterHeight() {
    if (!root) return;
    var content = root.querySelector('.content'), tw = root.querySelector('#regwrap');
    if (!content || !tw) return;
    var cp = tw.parentNode; while (cp && !(cp.classList && cp.classList.contains('cpanel'))) cp = cp.parentNode;
    if (!cp || cp.classList.contains('coll')) { tw.style.height = ''; tw.style.maxHeight = ''; return; }
    tw.style.maxHeight = '46vh';
  }
  function equalizePanelHeaders() {
    var rowEl = root && root.querySelector('.cgrow'); if (!rowEl) return;
    var hds = [];
    for (var i = 0; i < rowEl.children.length; i++) { var p = rowEl.children[i]; var h = p.querySelector('.cpanelhd'); if (!h) continue; h.style.minHeight = ''; if (!p.classList.contains('coll')) hds.push(h); }
    requestAnimationFrame(function () { var mx = 0; hds.forEach(function (h) { if (h.offsetHeight > mx) mx = h.offsetHeight; }); if (mx > 0) hds.forEach(function (h) { h.style.minHeight = mx + 'px'; }); });
  }

  function CSS(){return '#wrap{position:fixed;inset:0;background:#f4f6f8;color:'+INK+';font:13px/1.4 "Segoe UI",Arial,sans-serif;display:flex;flex-direction:column}'
    +'.content{flex:1;overflow:auto;padding-bottom:10px}'
    +'.regbody{display:flex;flex-direction:column}.regbody .toolbar{border-top:1px solid '+LINE+'}'
    +'.top{display:flex;align-items:center;gap:10px;background:'+NAVY+';color:#fff;padding:calc(7px*var(--ps,1)) 12px}'
    +'.brand{font-weight:800;letter-spacing:.5px}.brand span{color:'+ACCENT+'}.title{font-weight:600}.muted{opacity:.72;font-size:12px}.spacer{flex:1}'
    +'.btn{background:#fff;color:'+NAVY+';border:1px solid #cfd8e3;border-radius:5px;padding:4px 9px;font-size:12px;cursor:pointer;font-weight:600}.btn:hover{background:#eef3f8}'
    +'.btn.primary{background:'+ACCENT+';color:#fff;border-color:'+ACCENT+'}.btn.ghost{background:transparent;color:#fff;border-color:rgba(255,255,255,.4)}.btn.sq{padding:4px 8px;font-weight:700}'
    +'.btn.alt{background:'+NAVY+';color:#fff;border-color:'+NAVY+'}.btn.alt:hover{background:'+NAVY2+'}'
    +'.badge{background:'+ACCENT+';color:#fff;border-radius:12px;padding:2px 9px;font-size:11px;font-weight:700}'
    +'.tabs{display:flex;gap:4px;background:'+NAVY2+';padding:0 10px}.tab{padding:calc(7px*var(--ps,1)) 15px;color:#cdd8e6;font-weight:600;cursor:pointer;border-bottom:3px solid transparent;font-size:12px}.tab.active{color:#fff;border-color:'+ACCENT+'}.tab.disabled{opacity:.4;cursor:not-allowed}.tab.link:hover{color:#fff;background:rgba(255,255,255,.06)}'
    +'.toolbar{display:flex;align-items:center;gap:calc(7px*var(--ps,1));padding:calc(6px*var(--ps,1)) calc(12px*var(--hp,1));background:#fff;border-bottom:1px solid '+LINE+';flex-wrap:wrap}'
    +'.toolbar input[type=search],.toolbar select{border:1px solid #cfd8e3;border-radius:5px;padding:4px 8px;font-size:12px}.search{width:220px}'
    +'.cpanel{margin:calc(8px*var(--ps,1)) calc(12px*var(--hp,1)) 0;border:1px solid '+LINE+';border-radius:8px;background:#fff;overflow:hidden}'
    +'.cpanelhd{display:flex;align-items:center;gap:10px;background:#eef2f7;padding:calc(4px*var(--ps,1)) calc(12px*var(--hp,1));border-bottom:1px solid '+LINE+'}.cptitle{color:#55637a;font-weight:700;letter-spacing:.5px;font-size:11px;text-transform:uppercase}'
    +'.cpchev{cursor:pointer;color:#8894a6;font-size:11px;line-height:1;user-select:none;width:12px;text-align:center;flex:0 0 auto}.cpchev:hover{color:'+NAVY+'}'
    +'.cpanel.coll .cpbody{display:none}'
    +'.charts{padding:calc(10px*var(--ps,1)) calc(12px*var(--hp,1));background:#fff}'
    +'.cgrow{display:flex;gap:12px;align-items:stretch;margin:calc(8px*var(--ps,1)) calc(12px*var(--hp,1)) 0;flex-wrap:wrap}.cgrow>.cpanel{margin:0}.cgrow .cpt{flex:0 0 auto;width:auto;max-width:460px}.cgrow .cpc{flex:1 1 340px;min-width:0}.cgrow>.cpanel.coll{align-self:flex-start}'
    +'.chartctl{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-left:auto}.ccount{font-size:12px;font-weight:700;color:'+NAVY+';background:#fff;border:1px solid '+LINE+';border-radius:5px;padding:3px 9px;white-space:nowrap}'
    +'.chartsrow{display:flex;justify-content:space-around;align-items:flex-start;gap:10px;width:100%}'
    +'.btn.chart{background:#123a63;color:#fff;border-color:#123a63}.btn.chart:hover{background:#0B2A4A}'
    +'.pchart{flex:1 1 0;min-width:120px;max-width:340px;text-align:center;position:relative;display:flex;flex-direction:column;align-items:center}.pchart svg{overflow:visible}.pctitle{font-size:11px;font-weight:700;margin-bottom:4px;white-space:nowrap}'
    +'.plegend{display:flex;flex-flow:row wrap;justify-content:center;gap:1px 10px;font-size:11px;margin-top:6px;max-width:260px}.plegend div{display:flex;align-items:center;gap:4px;cursor:pointer;white-space:nowrap}.plegend i{width:10px;height:10px;border-radius:2px;flex:0 0 auto;display:inline-block;border:1px solid rgba(0,0,0,.18)}.plegend b{font-weight:700;margin-left:2px}'
    +'.pal{cursor:pointer;margin-left:3px;font-size:11px;opacity:.85;white-space:nowrap;display:inline-block}.pal:hover{opacity:1}'
    +'.mfbtn{display:flex;align-items:center;justify-content:space-between;gap:4px;width:100%;box-sizing:border-box;border:1px solid #d7dee6;border-radius:4px;padding:1px 4px;font-size:11px;background:#fff;cursor:pointer;color:'+INK+';overflow:hidden;white-space:nowrap}.mfbtn:hover{background:#eef3f8}.mfbtn .cv{overflow:hidden;text-overflow:ellipsis}'
    +'.mfpanel{position:absolute;background:#fff;border:1px solid #cfd8e3;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.18);padding:6px;z-index:15;max-height:300px;overflow:auto;min-width:170px}.mfpanel .mfrow{display:flex;align-items:center;gap:6px;padding:2px 3px;font-size:12px;white-space:nowrap;cursor:pointer;border-radius:3px}.mfpanel .mfrow:hover{background:#eef3f8}.mfpanel .mfhd{display:flex;gap:6px;padding:2px 3px 5px;border-bottom:1px solid '+LINE+';margin-bottom:4px}.mfpanel .mfhd a{font-size:11px;color:'+NAVY+';cursor:pointer;font-weight:700;text-decoration:underline}'
    +'.tile{border:1px solid '+LINE+';border-radius:7px;padding:calc(5px*var(--ps,1)) 11px;min-width:66px}.tile b{display:block;font-size:17px;color:'+NAVY+'}.tile small{color:#6b7b8c;font-size:11px}'
    +'.chip{border:1px solid #cfd8e3;border-radius:14px;padding:2px 9px;font-size:11px;cursor:pointer;background:#fff}.chip.active{background:'+NAVY+';color:#fff;border-color:'+NAVY+'}'
    +'.tablewrap{overflow:auto;background:#fff;max-height:70vh}table{border-collapse:separate;border-spacing:0;width:max-content;min-width:100%}'
    +'.dark .regbody .tablewrap{background:#0e1621}'
    +'th,td{border-bottom:1px solid '+LINE+';border-right:1px solid #eef1f4;text-align:left;vertical-align:top}'
    +'thead th{position:sticky;top:0;background:'+NAVY+';color:#fff;font-weight:600;z-index:2;user-select:none;padding:4px 6px;text-align:center;vertical-align:middle}'
    +'.statsrow{display:flex;gap:calc(12px*var(--ps,1));padding:calc(10px*var(--ps,1)) calc(12px*var(--hp,1));flex-wrap:wrap}'
    +'.doopen{padding:calc(4px*var(--ps,1)) calc(12px*var(--hp,1)) 10px;background:#fff;border-top:1px solid '+LINE+'}.doopen .dohd{display:flex;align-items:center;gap:10px;margin:2px 0 4px}.doopen .dotitle{font-size:11px;font-weight:700;color:'+NAVY+';letter-spacing:.4px;text-transform:uppercase}.doopen .doscroll{overflow-x:auto;overflow-y:hidden;width:100%}.dark .doopen{background:#111b28;border-top-color:#28374a}.dark .doopen .dotitle{color:#9fb0c4}'
    +'.dtlbl{font-weight:700;color:'+NAVY+'}.toolbar select.dtsel{font-weight:700;color:'+NAVY+';border:2px solid '+ACCENT+';background:#fff7f2;padding:4px 10px}'
    +'.toolbar button.pkgbtn{font-weight:700;color:#0a58c2;border:2px solid #0a84ff;background:#eaf3ff;padding:4px 10px;box-shadow:0 0 0 2px rgba(10,132,255,.12)}.toolbar button.pkgbtn:hover{background:#dcebff;border-color:#0070e0}.dark .toolbar button.pkgbtn{color:#8ec5ff;background:#0e2438;border-color:#2f8bff}'
    +'th .lbl{cursor:grab;display:inline;white-space:normal;overflow-wrap:break-word;word-break:normal;vertical-align:middle}'
    +'th .srt{cursor:pointer;opacity:.6;font-size:10px;margin-left:2px;white-space:nowrap;display:inline-block}th .srt:hover{opacity:1}'
    +'th .hicons{white-space:nowrap;display:inline-block;vertical-align:middle}'
    +'th.drop{outline:2px dashed '+ACCENT+';outline-offset:-2px}th{position:relative}.rez{position:absolute;right:0;top:0;width:6px;height:100%;cursor:col-resize}'
    +'tr.f td{background:#fbfcfe;position:sticky;z-index:1;padding:2px 4px}tr.f input,tr.f .mfbtn{width:100%;box-sizing:border-box;border:1px solid #d7dee6;border-radius:4px;padding:0 6px;font-size:11px;height:24px;line-height:22px}'
    +'tbody tr:hover td{background:#f2f7fd}td.edit{background:#fffdf5}td.edit input,td.edit select{width:100%;box-sizing:border-box;border:1px solid #e3e0cf;border-radius:3px;padding:0 3px;font-size:inherit;background:transparent}'
    +'.pill{display:inline-block;padding:0 7px;border-radius:10px;color:#fff;font-weight:600;border:1px solid rgba(0,0,0,.15)}.mps-h{background:#0e335a!important}'
    +'.panel{position:absolute;right:12px;top:120px;background:#fff;border:1px solid #cfd8e3;border-radius:8px;box-shadow:0 8px 30px rgba(0,0,0,.18);padding:10px;max-height:60vh;overflow:auto;z-index:9;min-width:0;width:max-content;max-width:340px}.panel h4{margin:2px 0 8px;color:#55637a;font-weight:700;letter-spacing:.5px;font-size:11px;text-transform:uppercase;display:flex;align-items:center;gap:6px;cursor:pointer}.panel h4 .pchev{color:#8894a6;font-size:11px;flex:0 0 auto}.panel.coll>*:not(h4){display:none}'
    +'.sldgrp{margin-left:auto;display:inline-flex;align-items:center;gap:4px}.sldgrp .rng{width:120px}.fpct{min-width:40px;text-align:right;font-weight:600;color:'+NAVY+';font-size:12px}.dark .fpct{color:#9fb0c4}#fontpanel .fontrow{display:flex;align-items:center;gap:8px;margin-bottom:6px}#fontpanel .fontrow>label{min-width:52px}#fontpanel select{flex:1}'
    +'.colletrow th.colc{background:#eef3f9;color:#7a8aa0;font-size:9px;font-weight:700;letter-spacing:.5px;padding:1px 4px;text-align:center;border-bottom:1px solid '+LINE+';top:0}.dark .colletrow th.colc{background:#0a1a2c;color:#7f92aa;border-bottom-color:#28374a}'
    +'td.edit select.mps-sel{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-repeat:no-repeat;background-position:right 3px center;background-size:8px 6px;padding-right:15px;background-image:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%278%27 height=%276%27%3E%3Cpath d=%27M0 0l4 5 4-5z%27 fill=%27%23888888%27/%3E%3C/svg%3E")}'
    +'td.edit select.mps-sel.set{background-image:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%278%27 height=%276%27%3E%3Cpath d=%27M0 0l4 5 4-5z%27 fill=%27%23ffffff%27/%3E%3C/svg%3E")}'
    +'td.edit input.dtempty{color:#9aa8bb}.dark td.edit input.dtempty{color:#6b7b8c}td.edit input.dtauto{color:#9aa8bb;font-style:italic}td.edit input.dtmismatch{color:#c0392b;font-weight:700;background:#fdecea;border-color:#e6a5a0}.fuaccept{display:block;margin-top:2px;font-size:9px;font-weight:700;color:#fff;background:#c0392b;border-radius:3px;padding:1px 4px;text-align:center;cursor:pointer;white-space:nowrap}.fuaccept:hover{background:#e74c3c}.bhpflag{display:inline-block;background:#F26522;color:#fff;font-size:9px;font-weight:700;border-radius:8px;padding:0 6px;white-space:nowrap}.corrtrig{display:flex;align-items:center;gap:4px;cursor:pointer;justify-content:center}.corrtrig b{font-weight:700;color:#0B2A4A}.dark .corrtrig b{color:#7db3ff}.enumtrig{display:flex;align-items:center;gap:3px;cursor:pointer;width:100%;overflow:hidden}.enumval{display:inline-block;padding:0 6px;border-radius:10px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}.enumval:not(.set){color:#8a939b;font-weight:400;padding-left:2px}.enumcar{margin-left:auto;color:#8a939b;font-size:10px;flex:0 0 auto}.enumdel{color:#c0392b;font-weight:700;cursor:pointer;width:13px;text-align:center;flex:0 0 auto;border-radius:3px}.enumdel:hover{background:#fdecea}.dark .enumval:not(.set){color:#9aa8bb}.doclink{color:#1565c0;text-decoration:none;cursor:pointer}.doclink:hover{color:#0d47a1}.dark .doclink{color:#5aa9ff}.dark .doclink:hover{color:#8ec5ff}'
    +'#colpanel{min-width:0;width:max-content;max-width:340px;display:flex;flex-direction:column}#colpanel .clist{overflow:auto}#colpanel .crow{padding:2px 10px;gap:8px}#colpanel .crow .cn{flex:0 1 auto;white-space:nowrap}'
    +'.crow{display:flex;align-items:center;gap:6px;padding:2px 0;font-size:12px}.crow .cn{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:grab}.crow.drop{outline:2px dashed '+ACCENT+';outline-offset:-2px}.mini{border:1px solid #cfd8e3;background:#fff;border-radius:3px;cursor:pointer;font-size:10px;padding:1px 5px;line-height:1;color:'+NAVY+'}.mini:hover{background:#eef3f8}.mini:disabled{opacity:.3;cursor:default}'
    +'#wrap table tr>th:first-child,#wrap table tr>td:first-child{padding-left:16px!important}#wrap table tr>th:last-child,#wrap table tr>td:last-child{padding-right:16px!important}'
    +'.loading{padding:40px;text-align:center;color:#6b7b8c}.err{padding:16px;color:#c0392b}.rng{vertical-align:middle;accent-color:#8fa6c0}'
    +'.vbadge{background:rgba(255,255,255,.14);color:#dfe7f0;border-radius:10px;padding:2px 9px;font-size:11px;font-weight:600;letter-spacing:.3px;white-space:nowrap}'
    +'.fontrow{display:flex;align-items:center;gap:8px;margin:6px 0;font-size:12px}.fontrow label{min-width:70px;color:#55637a;font-weight:600}.fontrow select{flex:1;border:1px solid #cfd8e3;border-radius:5px;padding:4px 8px;font-size:12px}'
    +'#wrap.dark{background:#0e1621;color:#dfe7f0}'
    +'.dark .toolbar{background:#16202e;border-bottom-color:#28374a}'
    +'.dark .btn{background:#1e2a3a;color:#cfe0f2;border-color:#37485e}.dark .btn:hover{background:#28394f}'
    +'.dark .btn.alt{background:#13273f;color:#fff;border-color:#26456b}'
    +'.dark .btn.primary,.dark .btn.chart{color:#fff}'
    +'.dark .cpanel{background:#111b28;border-color:#28374a}.dark .cpanelhd{background:#16202e;border-bottom-color:#28374a}.dark .cptitle{color:#9fb0c4}.dark .cpchev{color:#8296ad}.dark .cpchev:hover{color:#dfe7f0}'
    +'.dark .charts{background:#111b28}.dark .tablewrap{background:#0e1621}'
    +'.dark th,.dark td{border-bottom-color:#22303f;border-right-color:#1a2635}'
    +'.dark thead th{background:#0a2035;color:#eaf1f8}'
    +'.dark tbody tr:hover td{background:#182838}.dark td.edit{background:#1b2432}'
    +'.dark tr.f td{background:#131c28}.dark tr.f input,.dark td.edit input,.dark td.edit select{background:#0e1621;color:#dfe7f0;border-color:#37485e}'
    +'.dark .toolbar input,.dark .toolbar select,.dark .search{background:#0e1621;color:#dfe7f0;border-color:#37485e}'
    +'.dark .panel{background:#16202e;border-color:#2f4359;color:#dfe7f0}.dark .panel h4{color:#9fb0c4}.dark .panel input{background:#0e1621;color:#dfe7f0;border-color:#37485e}'
    +'.dark .fontrow label{color:#9fb0c4}.dark .fontrow select{background:#0e1621;color:#dfe7f0;border-color:#37485e}'
    +'.dark .mfpanel{background:#16202e;border-color:#2f4359;color:#dfe7f0}.dark .mfpanel .mfrow:hover{background:#28394f}.dark .mfpanel .mfhd a{color:#8fb6e6}'
    +'.dark .mfbtn{background:#0e1621;color:#dfe7f0;border-color:#37485e}.dark .mfbtn:hover{background:#28394f}'
    +'.dark .tile{border-color:#2f4359;background:#131c28}.dark .tile b{color:#7db3ff}.dark .tile small{color:#9aa8bb}'
    +'.dark .muted{color:#9aa8bb;opacity:1}.dark .ccount{background:#0e1621;color:#9fb0c4;border-color:#37485e}'
    +'.dark .dtlbl{color:#9fb0c4}.dark .toolbar select.dtsel{background:#2a1d12;color:#ffd7bf;border-color:'+ACCENT+'}'
    +'.dark .chip{background:#1e2a3a;color:#cfe0f2;border-color:#37485e}.dark .mini{background:#1e2a3a;color:#cfe0f2;border-color:#37485e}'
    +'.dark .rng{accent-color:'+ACCENT+'}'
    +'#wrap table th.mps-selcell,#wrap table td.mps-selcell{width:13px;min-width:13px;max-width:13px;text-align:center;vertical-align:middle}'
    +'#wrap table tr>th.mps-selcell:first-child,#wrap table tr>td.mps-selcell:first-child{padding-left:1px!important;padding-right:1px!important}'
    +'.mps-selcell input[type=checkbox]{margin:0;cursor:pointer;width:13px;height:13px;vertical-align:middle;accent-color:'+ACCENT+'}'
    +'.mps-selcell input.mps-opened{accent-color:#1e7e34;box-shadow:0 0 0 2px rgba(30,126,52,.5);border-radius:2px}'
    +'.mps-pophelp{position:absolute;left:50%;transform:translateX(-50%);bottom:14px;max-width:760px;background:#fff8e6;border:2px solid '+ACCENT+';border-radius:8px;padding:10px 34px 10px 12px;font-size:12px;line-height:1.45;color:'+INK+';box-shadow:0 6px 24px rgba(0,0,0,.22);z-index:30}'
    +'.mps-pophelp b{color:#b3400f}.mps-pophelp a{position:absolute;top:5px;right:9px;cursor:pointer;font-weight:700;color:#8a939b;text-decoration:none}.mps-pophelp a:hover{color:'+INK+'}'
    +'.dark .mps-pophelp{background:#2a1d12;color:#ffe9d6;border-color:'+ACCENT+'}.dark .mps-pophelp b{color:#ffb37a}'
    +'.mps-pophelp.ok{background:#eefaf0;border-color:#1e7e34}.mps-pophelp.ok b{color:#14682b}'
    +'.dark .mps-pophelp.ok{background:#10251a;color:#d7f5e0;border-color:#1e7e34}.dark .mps-pophelp.ok b{color:#6fdc92}'
    +'#wrap table th.mps-fill,#wrap table td.mps-fill{width:auto;min-width:0;max-width:none;border-right:0}'
    +'#wrap table tr>th.mps-fill:last-child,#wrap table tr>td.mps-fill:last-child{padding:0!important}'
    +'.btn.mps-open{font-weight:700;color:#0a58c2;border:2px solid #0a84ff;background:#eaf3ff}.btn.mps-open:hover{background:#dcebff;border-color:#0070e0}'
    +'.dark .btn.mps-open{color:#8ec5ff;background:#0e2438;border-color:#2f8bff}'
    +'.btn[disabled]{opacity:.45;cursor:not-allowed}.btn[disabled]:hover{background:#eaf3ff}.dark .btn[disabled]:hover{background:#0e2438}'
    +'th.rowact,td.rowact{width:22px;min-width:22px;max-width:22px;text-align:center;padding:0 2px!important;background:#f7f9fb}'
    +'#wrap table tr>th.rowact:first-child,#wrap table tr>td.rowact:first-child{padding-left:2px!important}'
    +'.dark th.rowact,.dark td.rowact{background:#101a26}'
    +'.rowdel{cursor:pointer;color:#c9d2dc;font-size:11px;font-weight:700;line-height:1;user-select:none}.rowdel:hover{color:#c0392b}'
    +'.fx{color:#9bb4d0;font-size:9px;font-weight:700;margin-right:3px;font-style:italic}'
    +'.tile.wide{min-width:120px}'
    +'td.edit input.moneyin,td.edit input.numin{text-align:right}'
    +'.corrbox{display:flex;flex-direction:column;gap:1px;cursor:pointer;min-height:16px;position:relative;padding-right:12px}'
    +'.corrbox.oneline{flex-direction:row;align-items:center}'
    +'.corrbox .enumcar{position:absolute;right:0;top:0;font-size:9px;color:#8a939b}'
    +'.corrln{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-variant-numeric:tabular-nums}'
    +'.corrln.unk{color:#a0803a;font-style:italic}.dark .corrln.unk{color:#e0b356}'
    +'.corrln1{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1}'
    +'.corrnone{color:#c2c9d2;font-style:italic}'
    +'.corrsub{flex:1;overflow:hidden;text-overflow:ellipsis;color:#7a8797;font-size:10.5px}'
    +'.corrtag{flex:0 0 auto;font-size:9.5px;font-weight:700;color:#a0803a;background:#fff5df;border:1px solid #e8d9ae;border-radius:8px;padding:0 5px}'
    +'.mfsec{font-size:10px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;color:#7a8aa0;padding:5px 4px 2px;border-bottom:1px solid #eef1f4;margin-bottom:2px}'
    +'.dark .mfsec{color:#8fa0b4;border-bottom-color:#22303f}'
    +'.shbody{display:flex;flex-direction:column}'
    +'.shtoolbar{display:flex;align-items:center;gap:calc(7px*var(--ps,1));padding:calc(6px*var(--ps,1)) calc(12px*var(--hp,1));background:#fff;border-bottom:1px solid ' + LINE + ';flex-wrap:wrap}'
    +'.dark .shtoolbar{background:#16202e;border-bottom-color:#28374a}'
    +'.shtitle{flex:1 1 260px;min-width:180px;border:1px solid #cfd8e3;border-radius:5px;padding:4px 8px;font-size:12px;font-weight:600;color:' + NAVY + '}'
    +'.dark .shtitle{background:#0e1621;color:#dfe7f0;border-color:#37485e}'
    +'.shvo{font-size:11px;font-weight:700;color:#1565c0;background:#eaf3ff;border:1px solid #cfe0f5;border-radius:10px;padding:2px 8px;cursor:pointer;white-space:nowrap}'
    +'.shvo.warn{color:#a0803a;background:#fff5df;border-color:#e8d9ae;cursor:default}'
    +'.dark .shvo{background:#0e2438;border-color:#26456b;color:#8ec5ff}'
    +'.shtabs{display:flex;align-items:center;gap:2px;padding:4px calc(12px*var(--hp,1));background:#eef2f7;border-top:1px solid ' + LINE + ';flex-wrap:wrap}'
    +'.dark .shtabs{background:#131c28;border-top-color:#28374a}'
    +'.shtab{position:relative;min-width:26px;text-align:center;padding:3px 10px;font-size:11.5px;font-weight:700;color:#55637a;background:#fff;border:1px solid #cfd8e3;border-bottom:none;border-radius:5px 5px 0 0;cursor:pointer;user-select:none}'
    +'.shtab:hover{background:#e7eef7}'
    +'.shtab.active{color:#fff;background:' + NAVY + ';border-color:' + NAVY + '}'
    +'.shtab.add{color:#0a58c2;border-color:#0a84ff;background:#eaf3ff}.shtab.add:hover{background:#dcebff}'
    +'.dark .shtab{background:#1e2a3a;color:#cfe0f2;border-color:#37485e}.dark .shtab:hover{background:#28394f}.dark .shtab.active{background:#0a2035;border-color:#2f8bff;color:#fff}'
    +'.shdot{position:absolute;top:2px;right:2px;width:5px;height:5px;border-radius:50%;background:' + ACCENT + '}'
    +'.shhint{margin-left:8px;font-size:10.5px;color:#8a939b}.dark .shhint{color:#7f8fa3}'
    +'tfoot tr.shtot td{background:#f4f7fb;border-top:1px solid #cfd8e3;font-size:11.5px;position:sticky;bottom:0}'
    +'.dark tfoot tr.shtot td{background:#131c28;border-top-color:#2f4359}'
    +'.shlink{margin-left:4px;font-size:10px;font-weight:700;color:#1565c0;cursor:pointer;white-space:nowrap}.shlink:hover{text-decoration:underline}'
    +'.dark .shlink{color:#8ec5ff}'
    +'.panel.paste{max-width:none;width:min(920px,94vw);display:flex;flex-direction:column;overflow:auto}'
    +'.specwrap{overflow-x:auto;border:1px solid #cfd8e3;border-radius:6px}'
    +'.spectbl{border-collapse:collapse;width:max-content;min-width:100%;font-size:10.5px}'
    +'.spectbl th{background:' + NAVY + ';color:#fff;font-weight:700;padding:4px 8px;text-align:left;white-space:nowrap;border-right:1px solid rgba(255,255,255,.15)}'
    +'.spectbl td{padding:3px 8px;white-space:nowrap;color:#7a8797;border-right:1px solid #eef1f4;font-style:italic}'
    +'.dark .specwrap{border-color:#2f4359}.dark .spectbl td{color:#93a3b7;border-right-color:#22303f}'
    +'textarea.pastebox{width:100%;box-sizing:border-box;font:11.5px/1.35 Consolas,"Courier New",monospace;border:1px solid #cfd8e3;border-radius:6px;padding:6px 8px;resize:vertical;min-height:90px}'
    +'.dark textarea.pastebox{background:#0e1621;color:#dfe7f0;border-color:#37485e}'
    +'.prevwrap{margin-top:4px}.prevscroll{overflow:auto;max-height:32vh;border:1px solid #cfd8e3;border-radius:6px}'
    +'.dark .prevscroll{border-color:#2f4359}'
    +'.prevtbl{border-collapse:collapse;width:max-content;min-width:100%;font-size:11px}'
    +'.prevtbl th{position:sticky;top:0;background:#eef2f7;color:#55637a;font-weight:700;padding:3px 7px;text-align:left;white-space:nowrap;border-bottom:1px solid #cfd8e3}'
    +'.prevtbl td{padding:2px 7px;white-space:nowrap;border-bottom:1px solid #eef1f4;max-width:220px;overflow:hidden;text-overflow:ellipsis}'
    +'.prevtbl tr.bad td{background:#fff3f2}.prevtbl td.errcell{color:#c0392b;font-size:10.5px;white-space:normal;max-width:280px}'
    +'.dark .prevtbl th{background:#16202e;color:#9fb0c4;border-bottom-color:#2f4359}.dark .prevtbl td{border-bottom-color:#22303f}.dark .prevtbl tr.bad td{background:#2a1618}';}


  /* ---- collapsible panels ---- */
  function makeCPanel(id, titleText, ctlEl, bodyEl, tip, shortTitle) {
    var coll = !!(S.collapsed && S.collapsed[id]);
    var chev = el('span', { class: 'cpchev', title: coll ? 'Expand this panel' : 'Roll up this panel' }, [coll ? '▸' : '▾']);
    var ttl = el('span', { class: 'cptitle', style: 'cursor:pointer', title: tip || 'Click to roll this panel up or down' }, [coll && shortTitle ? shortTitle : titleText]);
    var hd = el('div', { class: 'cpanelhd' }, [chev, ttl]);
    if (ctlEl) hd.appendChild(ctlEl);
    bodyEl.classList.add('cpbody');
    var panel = el('div', { class: 'cpanel' + (coll ? ' coll' : '') }, [hd, bodyEl]);
    function toggle() {
      var c = !panel.classList.contains('coll');
      panel.classList.toggle('coll', c); chev.textContent = c ? '▸' : '▾';
      chev.setAttribute('title', c ? 'Expand this panel' : 'Roll up this panel');
      if (shortTitle) ttl.textContent = c ? shortTitle : titleText;
      S.collapsed = S.collapsed || {}; S.collapsed[id] = c; saveCfg(); fitRegisterHeight();
    }
    chev.onclick = toggle; ttl.onclick = toggle;
    return panel;
  }
  function collapsiblePanel(panel) {
    var h = panel.querySelector('h4'); if (!h) return panel;
    if (!h.querySelector('.pchev')) {
      var chev = el('span', { class: 'pchev' }, ['▾']); h.insertBefore(chev, h.firstChild);
      h.onclick = function (ev) { if (ev && ev.target && ev.target !== h && ev.target !== chev) return; var c = !panel.classList.contains('coll'); panel.classList.toggle('coll', c); chev.textContent = c ? '▸' : '▾'; };
    }
    return panel;
  }
  function applyTheme() {
    var w = root && root.getElementById('wrap'); if (!w) return;
    w.classList.toggle('dark', !!S.darkMode);
    w.style.fontFamily = fontStack(S.fontFamily);
    w.style.fontSize = (DEF_BASEPX * (S.fontScale || 100) / 100).toFixed(2) + 'px';
    w.style.setProperty('--ps', String((S.padScale || 100) / 100));
    w.style.setProperty('--hp', String((S.hpadScale || 100) / 100));
  }
  function toast(msg) {
    if (!root) return;
    var t = el('div', { style: 'position:absolute;bottom:16px;left:50%;transform:translateX(-50%);background:' + NAVY + ';color:#fff;padding:8px 16px;border-radius:6px;font-size:12px;z-index:30;box-shadow:0 4px 16px rgba(0,0,0,.25);max-width:70%;text-align:center' }, [msg]);
    root.getElementById('wrap').appendChild(t); setTimeout(function () { t.remove(); }, 3200);
  }

  function toggleFontPanel(anchor) {
    var ex = root.getElementById('fontpanel'); if (ex) { ex.remove(); return; }
    var wrapEl = root.getElementById('wrap');
    var panel = el('div', { id: 'fontpanel', class: 'panel', style: 'min-width:250px' }, [el('h4', { style: 'cursor:default' }, ['Fonts'])]);
    var fam = el('select', { title: 'Font family for all dashboard elements' });
    var cur = S.fontFamily || ''; var oDef = el('option', { value: '' }, ['System default']); if (!cur) oDef.selected = true; fam.appendChild(oDef);
    UI_FONTS.forEach(function (f) { if (f === 'Segoe UI') return; var o = el('option', { value: f }, [f]); o.style.fontFamily = f; if (cur === f) o.selected = true; fam.appendChild(o); });
    fam.onchange = function () { S.fontFamily = fam.value; saveCfg(); applyTheme(); renderTable(); renderSheetGrid(); };
    function sldRow(label, tip, get, set, min, max) {
      var pct = el('span', { class: 'fpct' }, [Math.round(get()) + '%']);
      var rng = el('input', { type: 'range', min: String(min), max: String(max), step: '2.5', value: String(get()), class: 'rng', title: tip });
      function upd(v) { v = Math.round(v / 2.5) * 2.5; if (v < min) v = min; if (v > max) v = max; rng.value = String(v); pct.textContent = Math.round(v) + '%'; set(v); }
      rng.oninput = function () { upd(+rng.value); };
      return el('div', { class: 'fontrow' }, [el('label', { title: tip }, [label]),
        el('span', { class: 'sldgrp' }, [el('button', { class: 'btn sq', title: '− 2.5%', onclick: function () { upd(get() - 2.5); } }, ['−']), rng, el('button', { class: 'btn sq', title: '+ 2.5%', onclick: function () { upd(get() + 2.5); } }, ['+'])]), pct]);
    }
    panel.appendChild(el('div', { class: 'fontrow' }, [el('label', {}, ['Font']), fam]));
    panel.appendChild(sldRow('Size', 'Font size for the whole dashboard (± 2.5%)', function () { return S.fontScale || 100; }, function (v) { S.fontScale = v; saveCfg(); applyTheme(); renderTable(); renderSheetGrid(); }, 60, 160));
    panel.appendChild(sldRow('Padding', 'Vertical spacing only — row height and top/bottom padding of the panels.', function () { return S.padScale || 100; }, function (v) { S.padScale = v; saveCfg(); applyTheme(); renderTable(); renderSheetGrid(); }, 20, 200));
    panel.appendChild(sldRow('Side Padding', 'Left/right padding of the panels.', function () { return S.hpadScale || 100; }, function (v) { S.hpadScale = v; saveCfg(); applyTheme(); renderTable(); renderSheetGrid(); }, 0, 200));
    panel.appendChild(el('div', { style: 'margin-top:8px;display:flex;gap:6px' }, [
      el('button', { class: 'btn', title: 'Restore default font, size and padding', onclick: function () { S.fontFamily = ''; S.fontScale = 100; S.padScale = 100; S.hpadScale = 100; saveCfg(); applyTheme(); renderTable(); renderSheetGrid(); var fp = root.getElementById('fontpanel'); if (fp) fp.remove(); toggleFontPanel(anchor); } }, ['Restore Default']),
      el('button', { class: 'btn', title: 'Save the current fonts, size, padding and view as your default', onclick: function () { setAsDefault(); } }, ['★ Set As Default'])
    ]));
    wrapEl.appendChild(panel);
    if (anchor) { var ar = anchor.getBoundingClientRect(), wr = wrapEl.getBoundingClientRect(); panel.style.left = Math.min(Math.max(4, wr.width - panel.offsetWidth - 8), Math.max(4, ar.left - wr.left)) + 'px'; panel.style.top = (ar.bottom - wr.top + 4) + 'px'; }
    else { panel.style.right = '12px'; panel.style.top = '44px'; }
  }
  function toggleHdrPanel(anchor) {
    var ex = root.getElementById('hdrpanel'); if (ex) { ex.remove(); return; }
    var wrapEl = root.getElementById('wrap');
    var panel = el('div', { id: 'hdrpanel', class: 'panel', style: 'min-width:236px' }, [el('h4', { style: 'cursor:default' }, ['Header Settings']),
      el('div', { class: 'muted', style: 'font-size:11px;margin-bottom:8px;white-space:normal' }, ['Adjust the column header row. Saved to your default when you press ★ Set As Default.'])]);
    var szval = el('span', { class: 'fpct' }, [hdrFont() + 'px']);
    var rng = el('input', { type: 'range', min: '8', max: '22', value: String(hdrFont()), class: 'rng', title: 'Header font size' });
    function setFs(v) { v = Math.max(8, Math.min(22, Math.round(v))); S.hdrFontSize = v; szval.textContent = v + 'px'; rng.value = String(v); saveCfg(); renderTable(); renderSheetGrid(); equalizePanelHeaders(); }
    rng.oninput = function () { setFs(+rng.value); };
    panel.appendChild(el('div', { class: 'fontrow' }, [el('label', {}, ['Font size']),
      el('span', { class: 'sldgrp' }, [el('button', { class: 'btn sq', onclick: function () { setFs(hdrFont() - 1); } }, ['−']), rng, el('button', { class: 'btn sq', onclick: function () { setFs(hdrFont() + 1); } }, ['+'])]), szval]));
    var linesWrap = el('span', { style: 'display:inline-flex;gap:5px' });
    function refreshLines() { Array.prototype.forEach.call(linesWrap.children, function (b) { b.classList.toggle('active', (+b.getAttribute('data-n')) === hdrMaxLines()); }); }
    [1, 2, 3].forEach(function (nn) { linesWrap.appendChild(el('button', { class: 'chip', 'data-n': String(nn), title: 'Allow headers to use up to ' + nn + ' line' + (nn > 1 ? 's' : ''), onclick: function () { S.hdrMaxLines = nn; saveCfg(); renderTable(); renderSheetGrid(); refreshLines(); equalizePanelHeaders(); } }, [String(nn)])); });
    panel.appendChild(el('div', { class: 'fontrow' }, [el('label', {}, ['Max lines']), linesWrap]));
    refreshLines();
    panel.appendChild(el('div', { style: 'margin-top:10px;display:flex;gap:6px' }, [
      el('button', { class: 'btn', onclick: function () { S.hdrFontSize = null; S.hdrMaxLines = 2; saveCfg(); renderTable(); renderSheetGrid(); var p = root.getElementById('hdrpanel'); if (p) p.remove(); toggleHdrPanel(anchor); } }, ['Reset']),
      el('button', { class: 'btn', onclick: function () { var p = root.getElementById('hdrpanel'); if (p) p.remove(); } }, ['Close'])
    ]));
    wrapEl.appendChild(panel);
    if (anchor) { var ar = anchor.getBoundingClientRect(), wr = wrapEl.getBoundingClientRect(); panel.style.left = Math.min(Math.max(4, wr.width - panel.offsetWidth - 8), Math.max(4, ar.left - wr.left)) + 'px'; panel.style.top = (ar.bottom - wr.top + 4) + 'px'; }
  }

  /* ---- Aconex project selector (which project the reference list reads) ---- */
  function fetchProjects() {
    return fetch('/api/projects', { headers: { Accept: 'application/xml' }, credentials: 'include' }).then(function (r) { return r.text(); }).then(function (t) {
      var d = new DOMParser().parseFromString(t, 'text/xml');
      return [].slice.call(d.querySelectorAll('Project')).map(function (p) {
        return { id: (p.getAttribute('ProjectId') || (p.querySelector('ProjectId') || {}).textContent || '').trim(), name: ((p.querySelector('ProjectName') || {}).textContent || '').trim() };
      }).filter(function (p) { return p.id; });
    });
  }
  function projectLabel() { var n = S.xProjectName || ''; if (!n) { n = (S.xProjectId === DEFAULT_XPID) ? DEFAULT_XNAME : (S.xProjectId || '(none)'); } return n.length > 34 ? n.slice(0, 33) + '…' : n; }
  function setXProject(id, name) { S.xProjectId = id; S.xProjectName = name || ''; saveCfg(); var l = root && root.getElementById('projlbl'); if (l) l.textContent = projectLabel(); var rl = root && root.getElementById('reflbl'); if (rl) rl.textContent = refListText(); }
  function openProjectPanel(anchor) {
    var wrapEl = root.getElementById('wrap');
    var ex = root.getElementById('projpanel'); if (ex) { ex.remove(); return; }
    var panel = el('div', { id: 'projpanel', class: 'mfpanel', style: 'min-width:320px;max-width:460px' });
    panel.appendChild(el('div', { class: 'mfhd' }, [el('span', { style: 'font-weight:700;color:' + NAVY + ';font-size:11px' }, ['Reference-list project']), el('a', { title: 'Close', style: 'margin-left:auto', onclick: function () { panel.remove(); } }, ['✕'])]));
    panel.appendChild(el('div', { class: 'muted', style: 'font-size:10.5px;padding:2px 4px 4px;white-space:normal' }, ['Pick the Aconex project whose RFIs and correspondence fill the RFI/Correspondence Ref dropdown.']));
    var listWrap = el('div', {}); panel.appendChild(listWrap);
    function render(list) {
      listWrap.innerHTML = '';
      (list || []).forEach(function (p) {
        var rowEl = el('label', { class: 'mfrow', title: p.id });
        rowEl.appendChild(el('span', { style: 'width:9px;height:9px;border-radius:50%;flex:0 0 auto;display:inline-block;background:' + (p.id === S.xProjectId ? ACCENT : '#cfd8e3') }));
        rowEl.appendChild(el('span', { style: 'flex:1' }, [p.name || p.id]));
        rowEl.onclick = function () { setXProject(p.id, p.name); panel.remove(); toast('Reference list will read ' + (p.name || p.id)); };
        listWrap.appendChild(rowEl);
      });
    }
    if (S.projects) render(S.projects);
    else { listWrap.appendChild(el('div', { class: 'muted', style: 'font-size:11px;padding:4px' }, ['Loading projects…'])); fetchProjects().then(function (l) { S.projects = l; render(l); }).catch(function (e) { listWrap.innerHTML = ''; listWrap.appendChild(el('div', { class: 'err', style: 'font-size:11px;padding:4px' }, ['Could not load projects: ' + (e && e.message || e)])); }); }
    wrapEl.appendChild(panel);
    var ar = anchor.getBoundingClientRect(), wr = wrapEl.getBoundingClientRect();
    panel.style.left = Math.min(Math.max(4, wr.width - 470), Math.max(4, ar.left - wr.left)) + 'px';
    panel.style.top = (ar.bottom - wr.top + 4) + 'px';
  }

  /* ---- tab cross-launch ---- */
  var DIST = 'https://raw.githubusercontent.com/MPS-TK/dashboard-dist/main/';
  function gotoITP() { try { if (window.__MPS_ACONEX) { close(); window.__MPS_ACONEX.boot(); return; } } catch (e) { } toast('Doc. Registers module not loaded on this page.'); }
  function gotoRFI() {
    try { if (window.__MPS_ACONEX_RFI) { close(); window.__MPS_ACONEX_RFI.boot(); return; } } catch (e) { }
    fetch(DIST + 'aconex/aconex_rfi_dashboard.js?_=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.text(); })
      .then(function (s) { (0, eval)(s); close(); if (window.__MPS_ACONEX_RFI) window.__MPS_ACONEX_RFI.boot(); })
      .catch(function (e) { toast('Could not load the RFI/TQ module: ' + (e && e.message || e)); });
  }

  /* ---------------------------------------------------------------------
   * shell
   * ------------------------------------------------------------------- */
  function renderAll() {
    ensureShell();
    var wrap = root.getElementById('wrap'); wrap.innerHTML = '';
    wrap.appendChild(el('div', { class: 'top' }, [
      (function () { var b = el('div', { class: 'brand' }); b.innerHTML = 'MPS <span>GROUP</span>'; return b; })(),
      el('div', { class: 'title', title: 'MPS live variation register on the Aconex platform' }, ['Aconex Variation Register']),
      el('div', { class: 'vbadge', title: 'Dashboard version · build date' }, [VERSION + ' · ' + BUILD_DATE]),
      el('div', { class: 'muted' }, ['· ' + CFG.projectName + ' · MPS ' + CFG.mpsProjectNo + ' · ' + S.allRows.length + ' VOs · ' + sheetOrder().length + ' assessment sheets']),
      btn('↻ Reload', 'Reload the register from the team-synced copy and recalculate the totals', function () { initRows(); ghLoad().then(function () { applyScope(); renderAll(); }); applyScope(); renderAll(); }),
      btn('Fonts', 'Choose the dashboard font and base size for all elements', function (ev) { toggleFontPanel(ev && ev.currentTarget); }, 'pnltrig'),
      btn((S.darkMode ? '☀ Light Mode' : '☾ Dark Mode'), 'Toggle dark mode', function () { S.darkMode = !S.darkMode; saveCfg(); renderAll(); }),
      btn('⟳ Load Refs', 'Read the RFIs and correspondence your Aconex login can see, so they appear in the RFI/Correspondence Ref dropdown', function (ev) { fetchRefList(null, ev && ev.currentTarget); }),
      (function () { var b = el('button', { class: 'btn pnltrig', id: 'projbtn', title: 'Choose which Aconex project the reference list reads', onclick: function () { openProjectPanel(b); } }, [el('span', { style: 'opacity:.7' }, ['Project: ']), el('span', { id: 'projlbl', style: 'font-weight:700' }, [projectLabel()]), el('span', { style: 'margin-left:5px' }, ['▾'])]); return b; })(),
      el('span', { class: 'muted', id: 'reflbl', style: 'font-size:11px', title: 'How many RFIs / correspondences are cached for the dropdown, and when they were read' }, [refListText()]),
      el('div', { class: 'spacer' }),
      el('div', { class: 'badge', title: 'This dashboard is running on the Aconex platform' }, ['ACONEX']),
      el('button', { class: 'btn pnltrig', id: 'syncbtn', title: 'Team sync via GitHub — shares the whole variation register with your team', onclick: openSyncPanel }, [syncLabel()]),
      btn('⤓ Export Excel', 'Download the register and every assessment sheet as one formatted .xlsx with live formulas', exportExcel, 'primary'),
      el('button', { class: 'btn ghost', title: 'Close the dashboard', onclick: close }, ['✕'])
    ]));
    wrap.appendChild(el('div', { class: 'tabs' }, [
      el('div', { class: 'tab link', title: 'Switch to the Document (ITP) registers', onclick: gotoITP }, ['Doc. Registers']),
      el('div', { class: 'tab link', title: 'Switch to the RFI / TQ register', onclick: gotoRFI }, ['RFIs/TQs']),
      el('div', { class: 'tab active', title: 'Variation register' }, ['Variations']),
      el('div', { class: 'tab disabled', title: 'Coming soon' }, ['Drawings'])
    ]));

    var content = el('div', { class: 'content' });

    /* STATS + CHART */
    var statsBody = el('div', {}, [el('div', { class: 'statsrow', id: 'stats' }), el('div', { class: 'doopen', id: 'varbar' })]);
    var statsPanel = makeCPanel('stats', 'STATS', null, statsBody, 'Counts and money totals for the current view, plus the per-VO bar chart.');
    statsPanel.classList.add('cpc');
    var chartsPanel = makeCPanel('chart', 'CHART', el('div', { class: 'chartctl', id: 'chartctl' }), el('div', { class: 'charts', id: 'chart' }), 'Status breakdown of the current view.', 'CHART');
    chartsPanel.classList.add('cpt');
    content.appendChild(el('div', { class: 'cgrow' }, [statsPanel, chartsPanel]));

    /* REGISTER */
    var regCount = el('span', { class: 'ccount', id: 'countlbl', style: 'margin-left:auto', title: 'Rows shown of the total' }, [S.filtered.length + ' of ' + S.rows.length]);
    var regBody = el('div', { class: 'regbody' }, [regToolbar(), el('div', { class: 'tablewrap', id: 'regwrap' }, [])]);
    content.appendChild(makeCPanel('register', 'REGISTER · VARIATIONS', regCount, regBody, 'The variation register: column controls, filters and the data grid.'));

    /* ASSESSMENT SHEETS — their own panel below the register, tabs along the bottom */
    var shBody = el('div', { class: 'shbody' }, [
      el('div', { class: 'shtoolbar', id: 'shtoolbar' }),
      el('div', { class: 'tablewrap', id: 'shwrap' }, []),
      el('div', { class: 'shtabs', id: 'shtabs' }, [])
    ]);
    var shCount = el('span', { class: 'ccount', id: 'shcount', style: 'margin-left:auto' }, ['']);
    content.appendChild(makeCPanel('sheets', 'ASSESSMENT SHEETS', shCount, shBody, 'The workbook’s numbered assessment sheets. Pick a sheet from the tabs along the bottom; each one exports as its own Excel sheet and feeds its VO’s Claim / Assessed amounts.'));

    wrap.appendChild(content);
    applyTheme(); renderStats(); renderVarBar(); renderChart(); renderTable(); renderSheetPanel(); fitRegisterHeight(); equalizePanelHeaders();
  }

  function regToolbar() {
    var search = el('input', { type: 'search', class: 'search', title: 'Search across all columns', placeholder: '⌕ Search VOs…', value: S.globalSearch });
    search.oninput = function () { S.globalSearch = search.value; applyFilters(); renderBody(); renderStats(); renderVarBar(); renderChart(); };
    var ssel = el('select', { class: 'dtsel', title: 'Filter the whole register by Open / Closed status' });
    [['__ALL__', 'All Statuses'], ['__OPEN__', 'Not closed'], ['__CLOSED__', 'Closed only']].forEach(function (p) { var o = el('option', { value: p[0] }, [p[1]]); if (S.statusSel === p[0]) o.selected = true; ssel.appendChild(o); });
    ssel.onchange = function () { S.statusSel = ssel.value; applyScope(); renderAll(); };
    var rng = el('input', { type: 'range', min: '0', max: '12', value: String(S.rowPad), class: 'rng', title: 'Row height — drag left to pack rows tightly together' });
    rng.oninput = function () { S.rowPad = +rng.value; saveCfg(); renderBody(); };
    var fontGroup = el('span', { style: 'display:inline-flex;align-items:center;gap:3px', title: 'Table font size' }, [
      btn('−', 'Decrease font size', function () { S.fontSize = Math.max(8, S.fontSize - 1); saveCfg(); renderTable(); renderSheetGrid(); }, 'sq'),
      btn('+', 'Increase font size', function () { S.fontSize = Math.min(20, S.fontSize + 1); saveCfg(); renderTable(); renderSheetGrid(); }, 'sq'),
      el('span', { class: 'muted', id: 'fontlbl' }, [S.fontSize + 'px'])
    ]);
    return el('div', { class: 'toolbar' }, [
      btn('＋ Add VO', 'Add an empty VO row at the bottom of the register', function () { addVO(); }, 'primary'),
      btn('⊞ Paste VOs', 'Paste a block of VO rows straight from Excel — the panel lists the exact columns and their order', function (ev) { openPastePanel('register', ev && ev.currentTarget); }, 'pkgbtn pnltrig'),
      btn('⚙ Columns', 'Show, hide and reorder columns (Revision, CONCAT Name and Assessment Sheet are hidden by default)', function () { toggleColPanel(); }, 'alt pnltrig'),
      btn('⚙ Header Settings', 'Adjust the header font size and how many lines (1–3) the headers may use', function (ev) { toggleHdrPanel(ev && ev.currentTarget); }, 'alt pnltrig'),
      btn('Reset Cols', 'Restore columns to the saved default (or factory) order, widths and visibility', function () { resetCols(); }),
      btn('★ Set As Default', 'Save the current columns, order, widths, font and density as your default', function () { setAsDefault(); }),
      btn('Expand All', 'Comfortable rows with word-wrap — show full cell content', function () { S.wrap = true; S.rowPad = 6; saveCfg(); renderTable(); renderSheetGrid(); }),
      btn('Collapse All', 'Pack rows as tightly as possible', function () { S.wrap = false; S.rowPad = 0; saveCfg(); renderTable(); renderSheetGrid(); }),
      btn('Optimise Widths', 'Auto-size every visible column to fit its content', function () { optimiseWidths(); }),
      btn('Fit to 1 Page', 'Shrink every visible column so they all fit across the page width', function () { fitOnePage(); }),
      (function () { return btn((S.wrap ? '☑' : '☐') + ' Wrap Text', 'Toggle word-wrapping of cell text. With wrap ON the RFI/Correspondence Ref column gives each reference its own line; with it OFF each cell collapses to a single line.', function () { S.wrap = !S.wrap; saveCfg(); renderTable(); renderSheetGrid(); }); })(),
      fontGroup,
      el('span', { class: 'muted', title: 'Row height' }, ['Row Density']), rng,
      el('span', { class: 'dtlbl', style: 'color:' + ACCENT, title: 'Filter the whole register by status' }, ['STATUS']), ssel,
      search
    ]);
  }

  /* ---- STATS ---- */
  function renderStats() {
    var box = root.getElementById('stats'); if (!box) return; box.innerHTML = '';
    var rows = S.filtered, total = rows.length;
    function cnt(fn) { var c = 0; rows.forEach(function (r) { if (fn(r)) c++; }); return c; }
    var claim = 0, assessed = 0;
    rows.forEach(function (r) { claim += (r._claim || 0); assessed += (r._assessed || 0); });
    var dk = !!S.darkMode; function CC(l, d) { return dk ? d : l; }
    function tile(numTxt, label, color, tip) { return el('div', { class: 'tile', title: tip || label }, [el('b', { style: color ? 'color:' + color : '' }, [String(numTxt)]), el('small', {}, [label])]); }
    function moneyTile(v, label, color, tip) { return el('div', { class: 'tile wide', title: tip || label }, [el('b', { style: 'font-size:15px' + (color ? ';color:' + color : '') }, [money(round2(v))]), el('small', {}, [label])]); }
    box.appendChild(tile(total, 'VOs', CC('', '#eaf1f8'), 'Variations in the current view'));
    statusOptions().forEach(function (st) {
      var n = cnt(function (r) { return String(r.status || '').toLowerCase() === st.toLowerCase(); });
      if (!n) return;
      var c = statusColor(st);
      box.appendChild(tile(n, st, (c === '#ffffff' ? CC('#55637a', '#dfe7f0') : c), 'Status = ' + st));
    });
    box.appendChild(moneyTile(claim, 'MPS Claimed', CC('#0B2A4A', '#7db3ff'), 'Sum of MPS VO Claim/Proposal Amount across the current view'));
    box.appendChild(moneyTile(assessed, 'BHP Assessed', CC('#1e7e34', '#3ecf6a'), 'Sum of BHP Assessed/Approved Amount across the current view'));
    box.appendChild(moneyTile(claim - assessed, 'Net Difference', CC('#c0392b', '#f2794a'), 'Claimed less Assessed across the current view'));
  }

  /* ---- per-VO bar chart ---- */
  var BAR_DEFS = [
    { key: 'diff', label: 'Difference per VO', val: function (r) { return r._diff || 0; } },
    { key: 'claim', label: 'MPS Claimed per VO', val: function (r) { return r._claim || 0; } },
    { key: 'assessed', label: 'BHP Assessed per VO', val: function (r) { return r._assessed || 0; } }
  ];
  function barDef() { for (var i = 0; i < BAR_DEFS.length; i++) if (BAR_DEFS[i].key === S.barStat) return BAR_DEFS[i]; return BAR_DEFS[0]; }
  function renderVarBar() {
    var box = root.getElementById('varbar'); if (!box) return; box.innerHTML = '';
    var rows = S.filtered.slice().sort(function (a, b) { var x = num(a.voNo), y = num(b.voNo); if (x != null && y != null) return x - y; return String(a.voNo) < String(b.voNo) ? -1 : 1; });
    var def = barDef();
    var btns = el('span', { style: 'display:inline-flex;gap:5px;flex-wrap:wrap' });
    BAR_DEFS.forEach(function (sd) { btns.appendChild(el('button', { class: 'chip' + (S.barStat === sd.key ? ' active' : ''), title: 'Show ' + sd.label, onclick: function () { S.barStat = sd.key; saveCfg(); renderVarBar(); } }, [sd.label])); });
    var sz = el('input', { type: 'range', min: '20', max: '240', value: String(Math.round((S.barScale || 1) * 100)), class: 'rng', style: 'width:150px', title: 'Resize the bars' });
    sz.oninput = function () { S.barScale = (+sz.value) / 100; saveCfg(); drawVarBar(); };
    var af = el('button', { class: 'btn sq', title: 'Autofit — size the bars so every VO fits the panel width', onclick: function () { autofitBars(); } }, ['Autofit']);
    box.appendChild(el('div', { class: 'dohd' }, [el('span', { class: 'dotitle' }, [def.label]), el('span', { class: 'muted', style: 'font-size:11px' }, [rows.length + ' VO' + (rows.length === 1 ? '' : 's')]), btns,
      el('span', { style: 'margin-left:auto;display:inline-flex;align-items:center;gap:6px' }, [af, el('span', { class: 'muted', style: 'font-size:11px' }, ['Bar Size']), sz])]));
    var scroll = el('div', { class: 'doscroll', id: 'doscroll' }); box.appendChild(scroll);
    box.__rows = rows; drawVarBar();
  }
  function autofitBars() {
    var box = root.getElementById('varbar'), scroll = box && box.querySelector('#doscroll');
    var avail = Math.max(200, (scroll ? scroll.clientWidth : 640) - 6);
    var n = Math.max(1, (box && box.__rows ? box.__rows.length : S.filtered.length));
    var sc = (avail - 46) / (10 + 26 * n); sc = Math.max(0.2, Math.min(2.4, sc));
    S.barScale = sc; saveCfg();
    var rng = root.querySelector('.dohd input[type=range]'); if (rng) rng.value = String(Math.round(sc * 100));
    drawVarBar();
  }
  function drawVarBar() {
    var box = root.getElementById('varbar'); if (!box) return;
    var scroll = box.querySelector('#doscroll'); if (!scroll) return; scroll.innerHTML = '';
    var rows = box.__rows || [], dark = !!S.darkMode, sc = S.barScale || 1, def = barDef();
    if (!rows.length) { scroll.appendChild(el('div', { class: 'muted', style: 'font-size:11px;padding:6px' }, ['No VOs in the current view.'])); return; }
    var bw = Math.max(4, Math.round(16 * sc)), gap = Math.max(3, Math.round(10 * sc)), mL = 62, mR = 8, topPad = 16;
    var plotH = Math.round(150 * Math.max(0.6, Math.min(1.4, sc))), botPad = 64;
    var n = rows.length, W = mL + n * (bw + gap) + gap + mR, H = topPad + plotH + botPad, x0 = mL + gap;
    var maxv = 1, minv = 0;
    rows.forEach(function (r) { var d = def.val(r); if (d > maxv) maxv = d; if (d < minv) minv = d; });
    var span = maxv - minv || 1, zeroY = topPad + plotH * (maxv / span);
    var ink = dark ? '#dfe7f0' : NAVY, grid = dark ? '#22303f' : '#e6ebf0', axis = dark ? '#3a4d64' : '#cfd8e3', ylab = dark ? '#8fa0b4' : '#8a939b';
    var svg = svgEl('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, style: 'display:block' });
    for (var t = 0; t <= 4; t++) {
      var v = minv + (span * t / 4), y = topPad + plotH - (plotH * t / 4);
      svg.appendChild(svgEl('line', { x1: mL, x2: W - mR, y1: y, y2: y, stroke: grid }));
      var tl = svgEl('text', { x: mL - 5, y: y + 3, 'text-anchor': 'end', 'font-size': '9', fill: ylab }); tl.textContent = shortMoney(v); svg.appendChild(tl);
    }
    svg.appendChild(svgEl('line', { x1: mL, x2: mL, y1: topPad, y2: topPad + plotH, stroke: axis }));
    rows.forEach(function (r, i) {
      var d = def.val(r), h = Math.abs(d) / span * plotH, x = x0 + i * (bw + gap), cx = x + bw / 2;
      var y = d >= 0 ? (zeroY - h) : zeroY;
      var col = (def.key === 'diff') ? (d > 0 ? ACCENT : (d < 0 ? '#1e7e34' : '#c2c9d2')) : statusColor(r.status);
      if (col === '#ffffff') col = '#c2c9d2';
      var rect = svgEl('rect', { x: x, y: y, width: bw, height: Math.max(1, h), rx: 2, fill: col });
      var tt = svgEl('title', {}); tt.textContent = 'VO ' + r.voNo + ' — ' + money(d) + (r.desc ? ' · ' + r.desc : ''); rect.appendChild(tt); svg.appendChild(rect);
      var fs = Math.max(7, Math.min(10, bw + 2));
      var xl = svgEl('text', { x: cx, y: topPad + plotH + 11, 'text-anchor': 'end', 'font-size': fs.toFixed(1), fill: dark ? '#9aa8bb' : '#5b6b7b', transform: 'rotate(-55 ' + cx + ' ' + (topPad + plotH + 11) + ')' });
      xl.textContent = 'VO ' + r.voNo + (r._sheet ? ' (s' + r._sheet + ')' : ''); svg.appendChild(xl);
    });
    svg.appendChild(svgEl('line', { x1: mL, x2: W - mR, y1: zeroY, y2: zeroY, stroke: axis }));
    scroll.appendChild(svg);
  }
  function shortMoney(v) { var a = Math.abs(v); var s = a >= 1000000 ? (a / 1000000).toFixed(1) + 'm' : a >= 1000 ? Math.round(a / 1000) + 'k' : Math.round(a); return (v < 0 ? '-$' : '$') + s; }

  /* ---- status chart ---- */
  var CT_NEXT = { donut: 'bar', bar: 'pie', pie: 'donut' }, CT_LABEL = { donut: 'Bars', bar: 'Pie Chart', pie: 'Donut' };
  function renderChart() {
    var ctl = root.getElementById('chartctl');
    if (ctl) {
      ctl.innerHTML = '';
      ctl.appendChild(el('span', { class: 'ccount', title: 'VOs in the current view' }, [String(S.rows.length) + ' · VOs']));
      var nextLbl = CT_LABEL[S.chartType] || 'Bars';
      ctl.appendChild(btn(nextLbl, 'Switch the chart to ' + nextLbl + ' (cycles Donut → Bars → Pie)', function () { S.chartType = CT_NEXT[S.chartType] || 'donut'; saveCfg(); renderChart(); }, 'chart'));
      ctl.appendChild(el('span', { class: 'muted', style: 'font-size:11px;margin-left:4px' }, ['Size']));
      var sz = el('input', { type: 'range', min: '70', max: '240', value: String(Math.round((S.chartScale || 1) * 100)), class: 'rng', title: 'Chart size' });
      sz.oninput = function () { S.chartScale = (+sz.value) / 100; saveCfg(); renderChartBody(); };
      ctl.appendChild(sz);
    }
    renderChartBody();
  }
  function statusRank(v) { return (S.statusList || STATUS_WORKFLOW).map(function (s) { return s.toLowerCase(); }).indexOf(String(v || '').toLowerCase()); }
  function scCounts() { var c = {}; S.filtered.forEach(function (r) { var k = r.status || '—'; c[k] = (c[k] || 0) + 1; }); return c; }
  function scKeys(counts) { return Object.keys(counts).sort(function (a, b) { var ra = statusRank(a), rb = statusRank(b); ra = ra < 0 ? 999 : ra; rb = rb < 0 ? 999 : rb; return ra !== rb ? ra - rb : (a < b ? -1 : 1); }); }
  function toggleStatusFilter(v) { var cur = S.selFilters.status; if (cur && cur.length === 1 && cur[0] === v) S.selFilters.status = null; else S.selFilters.status = [v]; applyFilters(); renderChart(); renderStats(); renderVarBar(); renderBody(); saveCfg(); }
  function renderChartBody() {
    var box = root.getElementById('chart'); if (!box) return; box.innerHTML = '';
    box.appendChild(el('div', { class: 'chartsrow' }, [ocChart()]));
  }
  function ocChart() {
    var counts = scCounts(), keys = scKeys(counts), total = 0; keys.forEach(function (k) { total += counts[k]; });
    var wrapEl = el('div', { class: 'pchart', title: 'Status breakdown — ' + total + ' VO' + (total === 1 ? '' : 's') });
    var sc = S.chartScale || 1, dark = !!S.darkMode;
    wrapEl.appendChild(el('div', { class: 'pctitle', style: 'color:' + (dark ? '#dfe7f0' : NAVY) }, ['Status (' + total + ')']));
    function colFor(k) { var c = statusColor(k); return (c === '#ffffff' && dark) ? '#dfe7f0' : c; }
    if (S.chartType === 'donut' || S.chartType === 'pie') {
      var pie = S.chartType === 'pie', ringBg = dark ? '#111b28' : '#eef2f7', ctrInk = dark ? '#dfe7f0' : NAVY;
      var vb = 120, r = 42, cx = 60, cy = 60, sw = 18, CC2 = 2 * Math.PI * r, off = 0;
      var svg = svgEl('svg', { width: Math.round(120 * sc), height: Math.round(120 * sc), viewBox: '0 0 ' + vb + ' ' + vb });
      if (!pie) {
        var gap = (total > 0) ? 4 : 0;
        svg.appendChild(svgEl('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: ringBg, 'stroke-width': sw }));
        keys.forEach(function (k) {
          var frac = total ? counts[k] / total : 0; if (frac <= 0) return;
          var seg = svgEl('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: colFor(k), 'stroke-width': sw, 'stroke-dasharray': Math.max(0.01, frac * CC2 - gap) + ' ' + CC2, transform: 'rotate(-90 ' + cx + ' ' + cy + ')', 'stroke-dashoffset': CC2 });
          seg.style.transition = 'stroke-dashoffset 1s ease'; seg.style.cursor = 'pointer';
          var tt = svgEl('title', {}); tt.textContent = k + ': ' + counts[k]; seg.appendChild(tt);
          seg.onclick = function () { toggleStatusFilter(k); }; svg.appendChild(seg);
          (function (so, o) { requestAnimationFrame(function () { requestAnimationFrame(function () { so.setAttribute('stroke-dashoffset', (-o * CC2)); }); }); })(seg, off);
          off += frac;
        });
        var lt = svgEl('text', { x: cx, y: cy + 6, 'text-anchor': 'middle', 'font-size': '22', 'font-weight': '700', fill: ctrInk }); lt.textContent = String(total); svg.appendChild(lt);
      } else {
        var pr = 48, a0 = -Math.PI / 2;
        keys.forEach(function (k) {
          var frac = total ? counts[k] / total : 0; if (frac <= 0) return;
          var a1 = a0 + frac * 2 * Math.PI, sh;
          if (frac >= 0.9999) sh = svgEl('circle', { cx: cx, cy: cy, r: pr, fill: colFor(k), stroke: '#fff', 'stroke-width': '1' });
          else { var x1 = cx + pr * Math.cos(a0), y1 = cy + pr * Math.sin(a0), x2 = cx + pr * Math.cos(a1), y2 = cy + pr * Math.sin(a1), large = (a1 - a0) > Math.PI ? 1 : 0; sh = svgEl('path', { d: 'M' + cx + ' ' + cy + ' L' + x1.toFixed(2) + ' ' + y1.toFixed(2) + ' A' + pr + ' ' + pr + ' 0 ' + large + ' 1 ' + x2.toFixed(2) + ' ' + y2.toFixed(2) + ' Z', fill: colFor(k), stroke: '#fff', 'stroke-width': '1' }); }
          sh.style.cursor = 'pointer'; var tt = svgEl('title', {}); tt.textContent = k + ': ' + counts[k]; sh.appendChild(tt); sh.onclick = function () { toggleStatusFilter(k); }; svg.appendChild(sh); a0 = a1;
        });
      }
      wrapEl.appendChild(svg);
      var lg = el('div', { class: 'plegend' });
      keys.forEach(function (k) { var d = el('div', { title: 'Filter to ' + k, onclick: function () { toggleStatusFilter(k); } }); var i = el('i'); i.style.background = colFor(k); d.appendChild(i); d.appendChild(document.createTextNode(k)); d.appendChild(el('b', {}, [String(counts[k])])); lg.appendChild(d); });
      wrapEl.appendChild(lg);
    } else {
      var nn = Math.max(1, keys.length), bw = 36, gp = 26, mL = 30, mR = 14, topPad = 18, plotH = 150, botPad = 70;
      var W = mL + nn * (bw + gp) + gp + mR, H = topPad + plotH + botPad, baseY = topPad + plotH, x0 = mL + gp;
      var bInk = dark ? '#dfe7f0' : NAVY, bGrid = dark ? '#22303f' : '#e6ebf0', bAxis = dark ? '#3a4d64' : '#cfd8e3', bY = dark ? '#8fa0b4' : '#8a939b', bX = dark ? '#9aa8bb' : '#5b6b7b';
      var maxv = 1; keys.forEach(function (k) { if (counts[k] > maxv) maxv = counts[k]; });
      var top = (maxv % 2 === 0) ? maxv : maxv + 1; if (top < 2) top = 2; var mid = top / 2;
      var svg2 = svgEl('svg', { width: Math.round(W * sc), height: Math.round(H * sc), viewBox: '0 0 ' + W + ' ' + H });
      [[top, topPad], [mid, baseY - plotH * (mid / top)], [0, baseY]].forEach(function (t) {
        svg2.appendChild(svgEl('line', { x1: mL, x2: W - mR, y1: t[1], y2: t[1], stroke: bGrid }));
        var tl = svgEl('text', { x: mL - 6, y: t[1] + 3, 'text-anchor': 'end', 'font-size': '10', fill: bY }); tl.textContent = String(t[0]); svg2.appendChild(tl);
      });
      svg2.appendChild(svgEl('line', { x1: mL, x2: mL, y1: topPad, y2: baseY, stroke: bAxis }));
      keys.forEach(function (k, i) {
        var h = Math.round((counts[k] / top) * plotH), x = x0 + i * (bw + gp), cxb = x + bw / 2;
        var rect = svgEl('rect', { x: x, width: bw, rx: 3, fill: colFor(k), y: baseY, height: 0 });
        rect.style.transition = 'height 1s ease, y 1s ease'; rect.style.cursor = 'pointer';
        var tt = svgEl('title', {}); tt.textContent = k + ': ' + counts[k]; rect.appendChild(tt); rect.onclick = function () { toggleStatusFilter(k); }; svg2.appendChild(rect);
        var vl = svgEl('text', { x: cxb, y: baseY - h - 6, 'text-anchor': 'middle', 'font-size': '12', 'font-weight': '700', fill: bInk }); vl.textContent = String(counts[k]); svg2.appendChild(vl);
        var xl = svgEl('text', { x: cxb, y: baseY + 13, 'text-anchor': 'end', 'font-size': '10', fill: bX, transform: 'rotate(-40 ' + cxb + ' ' + (baseY + 13) + ')' }); xl.textContent = (k === '—' ? '(blank)' : k); svg2.appendChild(xl);
        (function (rc, hh, vlab) { requestAnimationFrame(function () { requestAnimationFrame(function () { rc.setAttribute('y', baseY - hh); rc.setAttribute('height', hh); vlab.setAttribute('y', baseY - hh - 6); }); }); })(rect, h, vl);
      });
      svg2.appendChild(svgEl('line', { x1: mL, x2: W - mR, y1: baseY, y2: baseY, stroke: bAxis }));
      wrapEl.appendChild(svg2);
    }
    return wrapEl;
  }

  /* ---------------------------------------------------------------------
   * register grid
   * ------------------------------------------------------------------- */
  var dragKey = null;
  function renderTable() {
    var tw = root.getElementById('regwrap'); if (!tw) return; tw.innerHTML = '';
    var fl = root.getElementById('fontlbl'); if (fl) fl.textContent = S.fontSize + 'px';
    if (S.error) { tw.appendChild(el('div', { class: 'err' }, ['Could not load: ' + S.error])); return; }
    var table = el('table'); table.style.fontSize = S.fontSize + 'px';
    var thead = el('thead'), htr = el('tr', { class: 'hdr' }), letr = el('tr', { class: 'colletrow' });
    letr.appendChild(el('th', { class: 'colc rowact', title: 'Row actions' }, ['']));
    htr.appendChild(el('th', { class: 'rowact', style: 'padding:1px 2px', title: 'Delete a VO row' }, ['']));
    visKeys().forEach(function (k, vi) {
      var cd = COLDEF[k], w = S.cols[k].w, lab = colLabel(k);
      letr.appendChild(el('th', { class: 'colc', style: 'width:' + w + 'px;min-width:' + w + 'px', title: 'Column ' + colAlpha(vi) + ' · ' + lab }, [colAlpha(vi)]));
      var lbl = el('span', { class: 'lbl', draggable: 'true', title: cd.tip }, [lab + (cd.auto ? ' ƒ' : '')]);
      lbl.ondragstart = function (e) { dragKey = k; try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', k); } catch (_) { } };
      lbl.ondragend = function () { dragKey = null; };
      var thKids = [lbl], hicons = [];
      if (!cd.nosort) { var srt = el('span', { class: 'srt', title: 'Sort by ' + lab }, [S.sortKey === k ? (S.sortDir > 0 ? '▲' : '▼') : '↕']); srt.onclick = function (ev) { ev.stopPropagation(); if (S.sortKey === k) S.sortDir *= -1; else { S.sortKey = k; S.sortDir = 1; } applyFilters(); renderTable(); }; hicons.push(srt); }
      if (hdrHasPal(k)) { var pal = el('span', { class: 'pal', title: 'Change the ' + lab + ' colour scheme' }, ['🎨']); pal.onclick = function (ev) { ev.stopPropagation(); colorSchemePanel('status', pal); }; hicons.push(pal); }
      if (hicons.length) thKids.push(el('span', { class: 'hicons' }, hicons));
      var th = el('th', { style: 'width:' + w + 'px;min-width:' + Math.max(w, minHW(k)) + 'px;padding:1px 2px;font-size:' + hdrFont() + 'px;line-height:1.15', class: (cd.edit ? 'mps-h' : ''), title: cd.tip }, thKids);
      th.ondragover = function (e) { if (dragKey && dragKey !== k) { e.preventDefault(); th.classList.add('drop'); } };
      th.ondragleave = function () { th.classList.remove('drop'); };
      th.ondrop = function (e) { e.preventDefault(); th.classList.remove('drop'); if (dragKey && dragKey !== k) reorder(dragKey, k); };
      var rez = el('div', { class: 'rez', title: 'Drag to resize · double-click to autofit' }); makeResizable(rez, th, k); th.appendChild(rez);
      htr.appendChild(th);
    });
    thead.appendChild(letr); thead.appendChild(htr);
    var ftr = el('tr', { class: 'f' });
    ftr.appendChild(el('td', { class: 'rowact' }, ['']));
    visKeys().forEach(function (k) {
      var cell;
      if (COLDEF[k].dfilter) cell = el('td', { style: 'width:' + S.cols[k].w + 'px' }, [multiFilterBtn(k)]);
      else { var inp = el('input', { type: 'text', title: 'Filter ' + colLabel(k), placeholder: '⌕', value: S.colFilters[k] || '' }); inp.oninput = function () { S.colFilters[k] = inp.value; applyFilters(); renderBody(); renderStats(); renderVarBar(); renderChart(); }; cell = el('td', { style: 'width:' + S.cols[k].w + 'px' }, [inp]); }
      ftr.appendChild(cell);
    });
    thead.appendChild(ftr);
    table.appendChild(thead); table.appendChild(el('tbody', { id: 'tbody' })); tw.appendChild(table);
    renderBody();
    var letRow = table.querySelector('tr.colletrow'), hRow = table.querySelector('tr.hdr'), frow = table.querySelector('tr.f');
    var letH = letRow ? letRow.offsetHeight : 0;
    if (hRow) hRow.querySelectorAll('th').forEach(function (th) { th.style.top = letH + 'px'; });
    var hH = hRow ? hRow.offsetHeight : 0;
    if (frow) frow.querySelectorAll('td').forEach(function (td) { td.style.top = (letH + hH) + 'px'; });
  }
  function renderBody() {
    var tb = root.getElementById('tbody'); if (!tb) return; tb.innerHTML = '';
    var cl = root.getElementById('countlbl'); if (cl) cl.textContent = S.filtered.length + ' of ' + S.rows.length;
    var pad = Math.max(0, Math.round(S.rowPad * (S.padScale || 100) / 100)), ws = S.wrap ? 'normal' : 'nowrap', ov = S.wrap ? 'visible' : 'hidden';
    S.filtered.forEach(function (row) {
      var tr = el('tr');
      var del = el('span', { class: 'rowdel', title: 'Delete VO ' + (row.voNo || '') + ' from the register', onclick: function (e) { e.stopPropagation(); deleteVO(row); } }, ['✕']);
      tr.appendChild(el('td', { class: 'rowact', style: 'padding:' + pad + 'px 2px' }, [del]));
      visKeys().forEach(function (k) {
        var td, w = S.cols[k].w;
        var base = 'width:' + w + 'px;max-width:' + w + 'px;padding:' + pad + 'px 6px;white-space:' + ws + ';overflow:' + ov + ';text-overflow:ellipsis';
        if (k === 'corrRef') td = corrCell(row, base);
        else if (k === 'status') td = editCell(row, k, base);
        else if (k === 'diff') {
          var d = row._diff;
          td = el('td', { style: base + ';text-align:right' + (d > 0 ? ';color:#c0392b;font-weight:700' : (d < 0 ? ';color:#1e7e34;font-weight:700' : ';color:#8a939b')), title: COLDEF.diff.tip }, [cellVal(row, k)]);
        }
        else if ((k === 'claim' || k === 'assessed') && row._sheet) {
          td = el('td', { style: base + ';text-align:right;color:#1565c0', title: 'From assessment sheet ' + row._sheet + ' (' + (k === 'claim' ? 'Total Claimed' : 'Total Assessed') + '). Clear the Assessment Sheet column to type an amount here instead.' },
            [el('span', { class: 'fx' }, ['ƒ']), cellVal(row, k)]);
        }
        else if (k === 'desc') {
          td = el('td', { class: 'edit', style: base });
          var inp = el('input', { type: 'text', title: COLDEF.desc.tip, value: row.desc || '' });
          inp.onchange = function () { setField(row, 'desc', inp.value); renderBody(); };
          td.appendChild(inp);
          if (row._sheet) {
            var lk = el('span', { class: 'shlink', title: 'Open assessment sheet ' + row._sheet, onclick: function (e) { e.stopPropagation(); gotoSheet(row._sheet); } }, ['⧉' + row._sheet]);
            td.appendChild(lk);
          }
        }
        else if (COLDEF[k].auto) td = el('td', { style: base, title: COLDEF[k].tip }, [cellVal(row, k)]);
        else td = editCell(row, k, base);
        tr.appendChild(td);
      });
      tb.appendChild(tr);
    });
    if (!S.filtered.length) {
      var tr0 = el('tr'); tr0.appendChild(el('td', { colspan: String(visKeys().length + 1), style: 'padding:18px;text-align:center;color:#8a939b' }, ['No VOs match the current filters.'])); tb.appendChild(tr0);
    }
  }

  function editCell(row, k, base) {
    var td = el('td', { class: 'edit', style: base });
    var ed = COLDEF[k].edit;
    if (ed === 'status') { enumDropdown(row, k, td); return td; }
    if (ed === 'money') { moneyInput(td, function () { return row[k]; }, function (v) { setField(row, k, v); renderStats(); renderVarBar(); renderBody(); }, COLDEF[k].tip); return td; }
    if (ed === 'date') {
      var dinp = el('input', { type: 'date', title: COLDEF[k].tip, value: row[k] || '' });
      function paintDt() { dinp.classList.toggle('dtempty', !dinp.value); } paintDt();
      dinp.addEventListener('input', paintDt);
      dinp.onchange = function () { setField(row, k, dinp.value); paintDt(); };
      td.appendChild(dinp); return td;
    }
    var inp = el('input', { type: 'text', title: COLDEF[k].tip, value: (k === 'concat' ? (row.concat || '') : (row[k] == null ? '' : String(row[k]))) });
    if (k === 'concat') { inp.placeholder = row._concat; inp.title = COLDEF.concat.tip; }
    inp.onchange = function () { setField(row, k, inp.value); if (k === 'concat') inp.placeholder = row._concat; renderBody(); };
    td.appendChild(inp);
    return td;
  }
  /* money cell — shows $#,##0.00, edits as a plain number */
  function moneyInput(td, get, set, tip) {
    var inp = el('input', { type: 'text', title: tip, class: 'moneyin', value: (num(get()) == null ? '' : money(get())) });
    inp.onfocus = function () { var n = num(get()); inp.value = (n == null ? '' : String(n)); inp.select(); };
    inp.onblur = function () { var n = num(inp.value); inp.value = (n == null ? '' : money(n)); };
    inp.onchange = function () { var n = num(inp.value); set(n == null ? '' : n); };
    td.appendChild(inp);
  }
  /* status / enum dropdown with a left "×" to remove an option */
  function enumDropdown(row, k, td) {
    var isStatus = (COLDEF[k] && COLDEF[k].edit === 'status');
    function stdOpts() { return isStatus ? statusOptions() : (COLDEF[k].opts || []); }
    function allOpts() {
      var seen = {}, out = [];
      stdOpts().forEach(function (o) { var lk = String(o).toLowerCase(); if (!seen[lk]) { seen[lk] = 1; out.push(o); } });
      S.allRows.forEach(function (r) { var v = r[k]; if (v != null && v !== '') { var lk = String(v).toLowerCase(); if (!seen[lk]) { seen[lk] = 1; out.push(v); } } });
      return out;
    }
    function colourOf(v) { return isStatus ? statusColor(v) : ''; }
    var trig = el('div', { class: 'enumtrig', title: COLDEF[k].tip });
    function paintTrig() {
      var v = row[k] || '', c = colourOf(v); trig.innerHTML = '';
      trig.appendChild(el('span', { class: 'enumval' + (v && c ? ' set' : ''), style: (v && c ? ('background:' + c + ';color:' + lumFg(c) + ';border:1px solid rgba(0,0,0,.18)') : '') }, [v ? String(v) : '—']));
      trig.appendChild(el('span', { class: 'enumcar' }, ['▾']));
    }
    paintTrig();
    trig.onclick = function (e) { e.stopPropagation(); openPanel(); };
    td.appendChild(trig);
    function pick(v) {
      setField(row, k, v); paintTrig();
      var p = root.getElementById('enumdd'); if (p) p.remove();
      applyScope(); renderStats(); renderChart(); renderVarBar(); renderBody();
    }
    function deleteOpt(o) {
      var lk = String(o).toLowerCase();
      S.allRows.forEach(function (r) { if (String(r[k] || '').toLowerCase() === lk) r[k] = ''; });
      if (isStatus) S.statusList = (S.statusList || []).filter(function (sx) { return sx.toLowerCase() !== lk; });
      saveCfg(); ghPush(); applyScope(); renderStats(); renderChart(); renderVarBar(); renderBody();
      var p = root.getElementById('enumdd'); if (p && p.__rebuild) p.__rebuild();
    }
    function openPanel() {
      var wrapEl = root.getElementById('wrap');
      var ex = root.getElementById('enumdd'); var same = ex && ex.__k === k && ex.__row === row; if (ex) ex.remove(); if (same) return;
      var panel = el('div', { id: 'enumdd', class: 'mfpanel', style: 'min-width:160px' }); panel.__k = k; panel.__row = row;
      function rebuild() {
        panel.innerHTML = '';
        panel.appendChild(el('div', { class: 'mfhd' }, [el('span', { style: 'font-weight:700;color:' + NAVY + ';font-size:11px' }, [colLabel(k)]), el('a', { title: 'Close', style: 'margin-left:auto', onclick: function () { panel.remove(); } }, ['✕'])]));
        panel.appendChild(el('div', { class: 'mfrow', title: 'Clear this cell', onclick: function () { pick(''); } }, [el('span', { style: 'width:13px;flex:0 0 auto' }), el('span', { style: 'flex:1;color:#8a939b' }, ['—'])]));
        allOpts().forEach(function (o) {
          var c = colourOf(o);
          var del = el('span', { class: 'enumdel', title: 'Remove "' + o + '" from this dropdown and clear it from every row', onclick: function (ev) { ev.stopPropagation(); deleteOpt(o); } }, ['×']);
          var kids = [del];
          if (c) { var dot = el('i'); dot.style.cssText = 'width:10px;height:10px;border-radius:2px;background:' + c + ';display:inline-block;flex:0 0 auto;border:1px solid rgba(0,0,0,.2)'; kids.push(dot); }
          kids.push(el('span', { style: 'flex:1' }, [String(o)]));
          panel.appendChild(el('div', { class: 'mfrow', title: 'Set to ' + o, onclick: function () { pick(o); } }, kids));
        });
        var nv = el('input', { type: 'text', placeholder: isStatus ? 'add a status…' : 'add a value…', style: 'flex:1;min-width:70px;font-size:11px;padding:2px 5px;border:1px solid #cfd8e3;border-radius:4px' });
        nv.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); var v = (nv.value || '').trim(); if (v) { if (isStatus) addStatus(v); pick(v); } } };
        var addB = el('a', { style: 'font-weight:700;color:' + NAVY, title: 'Add this value', onclick: function (ev) { ev.preventDefault(); var v = (nv.value || '').trim(); if (v) { if (isStatus) addStatus(v); pick(v); } } }, ['+ Add']);
        panel.appendChild(el('div', { class: 'mfrow', style: 'border-top:1px solid #e3e9f0;margin-top:4px;padding-top:5px' }, [nv, addB]));
      }
      panel.__rebuild = rebuild; rebuild(); wrapEl.appendChild(panel);
      var ar = trig.getBoundingClientRect(), wr = wrapEl.getBoundingClientRect();
      panel.style.left = Math.max(4, Math.min(ar.left - wr.left, wr.width - 175)) + 'px';
      panel.style.top = (ar.bottom - wr.top + 2) + 'px';
    }
  }

  /* ---- multi-select column filters ---- */
  function selSummary(k) { var d = distinctVals(k), sel = S.selFilters[k]; if (sel == null) return 'All'; if (sel.length === 0) return 'None'; if (sel.length >= d.length) return 'All'; return sel.length + '/' + d.length; }
  function multiFilterBtn(k) {
    var b = el('div', { class: 'mfbtn', title: 'Filter ' + colLabel(k) + ' — tick the values to show (persists between sessions)' }, [el('span', { class: 'cv' }, [selSummary(k)]), el('span', {}, ['▾'])]);
    b.onclick = function (e) { e.stopPropagation(); openMultiFilter(k, b); };
    return b;
  }
  function openMultiFilter(k, anchor) {
    var wrapEl = root.getElementById('wrap');
    var ex = root.getElementById('mfpanel'); var sameK = ex && ex.getAttribute('data-k') === k; if (ex) ex.remove(); if (sameK) return;
    var d = distinctVals(k);
    var panel = el('div', { id: 'mfpanel', class: 'mfpanel', 'data-k': k });
    function curSel() { var s = S.selFilters[k]; return s == null ? d.slice() : s.slice(); }
    function setSel(arr) { S.selFilters[k] = (arr.length >= d.length) ? null : arr; S.selKnown = S.selKnown || {}; S.selKnown[k] = distinctAll(k); applyFilters(); renderBody(); renderStats(); renderVarBar(); renderChart(); saveCfg(); var cv = anchor.querySelector('.cv'); if (cv) cv.textContent = selSummary(k); }
    var listWrap = el('div', {});
    function rebuild() {
      listWrap.innerHTML = '';
      var sel = curSel();
      if (!d.length) listWrap.appendChild(el('div', { class: 'muted', style: 'font-size:11px;padding:4px' }, ['No values yet.']));
      d.forEach(function (v) { var cb = el('input', { type: 'checkbox' }); cb.checked = sel.indexOf(v) >= 0; cb.onchange = function () { var s = curSel(); var i = s.indexOf(v); if (cb.checked) { if (i < 0) s.push(v); } else if (i >= 0) s.splice(i, 1); setSel(s); }; listWrap.appendChild(el('label', { class: 'mfrow' }, [cb, el('span', {}, [v])])); });
    }
    panel.appendChild(el('div', { class: 'mfhd' }, [
      el('a', { title: 'Select all', onclick: function () { setSel(d.slice()); rebuild(); } }, ['(All)']),
      el('a', { title: 'Select none', onclick: function () { setSel([]); rebuild(); } }, ['(None)']),
      el('a', { title: 'Close', style: 'margin-left:auto', onclick: function () { panel.remove(); } }, ['✕'])
    ]));
    rebuild(); panel.appendChild(listWrap); wrapEl.appendChild(panel);
    var ar = anchor.getBoundingClientRect(), wr = wrapEl.getBoundingClientRect();
    panel.style.left = Math.max(4, ar.left - wr.left) + 'px'; panel.style.top = (ar.bottom - wr.top + 2) + 'px';
  }

  /* ---- colour scheme editor ---- */
  function colorSchemePanel(kind, anchor) {
    var wrapEl = root.getElementById('wrap');
    var ex = root.getElementById('cspanel'); var same = ex && ex.getAttribute('data-k') === kind; if (ex) ex.remove(); if (same) return;
    var title = kind === 'status' ? 'Status' : 'Type';
    var panel = el('div', { id: 'cspanel', class: 'mfpanel', 'data-k': kind, style: 'min-width:230px' });
    var bodyEl = el('div', {});
    function items() {
      if (kind === 'status') return statusOptions().map(function (s) { return { key: s.toLowerCase(), label: s, hex: statusColor(s) }; });
      return ITEM_TYPES.map(function (s) { return { key: s.toLowerCase(), label: s, hex: typeColor(s) }; });
    }
    function build() {
      bodyEl.innerHTML = '';
      items().forEach(function (it) {
        var sw = el('input', { type: 'color', value: toHex6(it.hex), style: 'width:28px;height:20px;border:1px solid #cfd8e3;border-radius:3px;background:none;cursor:pointer;padding:0' });
        sw.onchange = function () { S.colorSchemes[kind][it.key] = sw.value; saveCfg(); renderBody(); renderStats(); renderChart(); renderVarBar(); renderSheetGrid(); };
        bodyEl.appendChild(el('label', { class: 'mfrow' }, [sw, el('span', { style: 'flex:1' }, [it.label])]));
      });
      if (kind === 'status') {
        var nc = el('input', { type: 'color', value: '#1f6feb', style: 'width:28px;height:20px;border:1px solid #cfd8e3;border-radius:3px;background:none;cursor:pointer;padding:0' });
        var nv = el('input', { type: 'text', placeholder: 'add a status…', style: 'flex:1;min-width:70px;font-size:11px;padding:2px 5px;border:1px solid #cfd8e3;border-radius:4px' });
        var addB = el('a', { title: 'Add this status (and colour) to the workflow', style: 'font-weight:700;color:' + NAVY, onclick: function (ev) { ev.preventDefault(); var v = (nv.value || '').trim(); if (!v) return; if (addStatus(v)) { S.colorSchemes.status[v.toLowerCase()] = nc.value; saveCfg(); } renderBody(); renderChart(); renderStats(); build(); } }, ['+ Add']);
        bodyEl.appendChild(el('div', { class: 'mfrow', style: 'border-top:1px solid #e3e9f0;margin-top:4px;padding-top:5px' }, [nc, nv, addB]));
      }
    }
    panel.appendChild(el('div', { class: 'mfhd' }, [
      el('span', { style: 'font-weight:700;color:' + NAVY + ';font-size:11px' }, ['Colours — ' + title]),
      el('a', { title: 'Reset to default colours', style: 'margin-left:auto', onclick: function () { S.colorSchemes[kind] = {}; saveCfg(); renderBody(); renderStats(); renderChart(); renderVarBar(); renderSheetGrid(); build(); } }, ['Reset']),
      el('a', { title: 'Close', onclick: function () { panel.remove(); } }, ['✕'])
    ]));
    build(); panel.appendChild(bodyEl); wrapEl.appendChild(panel);
    var ar = anchor.getBoundingClientRect(), wr = wrapEl.getBoundingClientRect();
    panel.style.left = Math.min(Math.max(4, wr.width - 240), Math.max(4, ar.left - wr.left)) + 'px';
    panel.style.top = (ar.bottom - wr.top + 2) + 'px';
  }

  /* ---- column ops ---- */
  function reorder(from, to) { var o = S.order.slice(), fi = o.indexOf(from), ti = o.indexOf(to); if (fi < 0 || ti < 0) return; o.splice(fi, 1); ti = o.indexOf(to); o.splice(ti, 0, from); S.order = o; saveCfg(); renderTable(); if (root.getElementById('colpanel')) renderColPanel(); }
  function toggleColPanel() { var ex = root.getElementById('colpanel'); if (ex) { ex.remove(); return; } renderColPanel(); }
  function moveCol(k, dir) { var o = S.order.slice(), i = o.indexOf(k), j = i + dir; if (j < 0 || j >= o.length) return; var t = o[i]; o[i] = o[j]; o[j] = t; S.order = o; saveCfg(); renderTable(); renderColPanel(); }
  function renderColPanel() {
    var old = root.getElementById('colpanel'); var sc = old ? (old.querySelector('.clist') || {}).scrollTop : 0; if (old) old.remove();
    var panel = el('div', { id: 'colpanel', class: 'panel', style: 'left:12px;top:100px;max-height:calc(100vh - 128px);overflow:hidden' }, [
      el('h4', { style: 'white-space:normal' }, ['Columns']),
      el('div', { class: 'muted', style: 'font-size:11px;margin-bottom:6px;white-space:normal' }, ['Tick to show/hide. ▲▼ reorder. Type in a box to rename that header (blank restores the default). Revision, CONCAT Name and Assessment Sheet start hidden. Hidden columns are still written to the Excel export — just hidden there too.'])
    ]);
    var list = el('div', { class: 'clist', style: 'flex:1 1 auto;overflow:auto;min-height:40px' });
    var probe = document.createElement('span'); probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font:' + (S.baseFont || DEF_BASEPX) + 'px ' + fontStack(S.fontFamily); root.appendChild(probe);
    var nameW = 60; S.order.forEach(function (k) { probe.textContent = COLDEF[k].label; if (probe.offsetWidth > nameW) nameW = probe.offsetWidth; }); probe.remove();
    nameW = Math.min(250, Math.round(nameW) + 24);
    S.order.forEach(function (k, idx) {
      var up = el('button', { class: 'mini', title: 'Move up', onclick: function () { moveCol(k, -1); } }, ['▲']);
      var dn = el('button', { class: 'mini', title: 'Move down', onclick: function () { moveCol(k, 1); } }, ['▼']);
      if (idx === 0) up.disabled = true; if (idx === S.order.length - 1) dn.disabled = true;
      var cb = el('input', { type: 'checkbox', title: 'Show / hide ' + colLabel(k), style: 'flex:0 0 auto' });
      cb.checked = S.cols[k].show; cb.onchange = function () { S.cols[k].show = cb.checked; saveCfg(); renderTable(); };
      var inp = el('input', { type: 'text', title: 'Rename the ' + COLDEF[k].label + ' column header (blank = default)', value: colLabel(k), style: 'flex:0 0 auto;width:' + nameW + 'px;margin:0 auto;text-align:center;font-size:12px;padding:2px 5px;border:1px solid #cfd8e3;border-radius:4px;box-sizing:border-box' });
      inp.onchange = function () { var v = (inp.value || '').trim(); if (v && v !== COLDEF[k].label) S.colNames[k] = v; else { delete S.colNames[k]; inp.value = COLDEF[k].label; } saveCfg(); renderTable(); };
      inp.onkeydown = function (e) { if (e.key === 'Enter') inp.blur(); };
      list.appendChild(el('div', { class: 'crow' }, [el('span', { style: 'flex:0 0 auto;display:inline-flex;gap:3px' }, [up, dn]), cb, inp]));
    });
    panel.appendChild(list);
    panel.appendChild(el('div', { style: 'margin-top:8px;display:flex;gap:6px;flex:0 0 auto' }, [
      el('button', { class: 'btn', title: 'Restore default columns & names', onclick: function () { resetCols(); } }, ['Reset']),
      el('button', { class: 'btn', title: 'Close', onclick: function () { var p = root.getElementById('colpanel'); if (p) p.remove(); } }, ['Close'])
    ]));
    panel.style.width = Math.min(430, nameW + 118) + 'px';
    collapsiblePanel(panel);
    root.getElementById('wrap').appendChild(panel);
    var l = panel.querySelector('.clist'); if (l) l.scrollTop = sc;
  }
  function makeResizable(handle, th, k) {
    handle.onmousedown = function (e) {
      e.preventDefault(); e.stopPropagation();
      var sx = e.clientX, sw = th.offsetWidth;
      function mv(ev) { var w = Math.max(minHW(k), sw + (ev.clientX - sx)); S.cols[k].w = w; th.style.width = w + 'px'; th.style.minWidth = w + 'px'; }
      function up() { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); saveCfg(); renderTable(); }
      document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up);
    };
    handle.ondblclick = function (e) { e.preventDefault(); e.stopPropagation(); autofitCol(k); };
  }
  function dataMinW(k, probe) {
    var ed = COLDEF[k].edit;
    if (ed === 'date') return 124;
    var pad = (ed === 'status' || ed === 'corr') ? 40 : 16, mw = 0;
    if (ed === 'status') statusOptions().forEach(function (o) { probe.textContent = o; if (probe.offsetWidth > mw) mw = probe.offsetWidth; });
    S.filtered.slice(0, 300).forEach(function (row) {
      if (k === 'corrRef') { (row.corrRef || []).forEach(function (x) { probe.textContent = x; if (probe.offsetWidth > mw) mw = probe.offsetWidth; }); }
      else { probe.textContent = cellVal(row, k); if (probe.offsetWidth > mw) mw = probe.offsetWidth; }
    });
    return mw + pad;
  }
  function autofitCol(k) { var probe = mkProbe(); var w = Math.min(460, Math.max(minHW(k), dataMinW(k, probe))); probe.remove(); S.cols[k].w = w; saveCfg(); renderTable(); }
  function mkProbe() { var probe = document.createElement('span'); probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font:' + S.fontSize + 'px ' + fontStack(S.fontFamily); root.appendChild(probe); return probe; }
  function optimiseWidths() { var probe = mkProbe(); visKeys().forEach(function (k) { S.cols[k].w = Math.min(460, Math.max(minHW(k), dataMinW(k, probe))); }); probe.remove(); saveCfg(); renderTable(); }
  function fitOnePage() {
    var tw = root.getElementById('regwrap'); if (!tw) return;
    var keys = visKeys(); if (!keys.length) return;
    var PAD_OH = 13, avail = Math.max(240, tw.clientWidth - 40 - keys.length * PAD_OH);
    var probe = mkProbe();
    var floorMin = {}, floorData = {}, desired = {}, sumMinH = 0, sumData = 0;
    keys.forEach(function (k) {
      var fm = Math.ceil(minHW(k)), fd = Math.ceil(Math.max(fm, Math.min(dataMinW(k, probe), 160)));
      floorMin[k] = fm; floorData[k] = fd; desired[k] = Math.max(fd, Math.min(460, dataMinW(k, probe)));
      sumMinH += fm; sumData += fd;
    });
    probe.remove();
    var noClip = (sumData <= avail), mins = noClip ? floorData : floorMin, sumMin = noClip ? sumData : sumMinH, sumExtra = 0;
    keys.forEach(function (k) { sumExtra += Math.max(0, desired[k] - mins[k]); });
    keys.forEach(function (k) { S.cols[k].w = mins[k]; });
    var leftover = avail - sumMin;
    if (leftover > 0) {
      if (sumExtra > 0) keys.forEach(function (k) { var extra = Math.max(0, desired[k] - mins[k]); S.cols[k].w = Math.round(mins[k] + leftover * (extra / sumExtra)); });
      else { var per = Math.floor(leftover / keys.length); keys.forEach(function (k) { S.cols[k].w = mins[k] + per; }); }
    }
    saveCfg(); renderTable();
  }
  function resetCols() {
    var b; try { var d = localStorage.getItem(DKEY); if (d) b = mergeCfg(JSON.parse(d)); } catch (e) { }
    if (!b) b = factoryCfg();
    CFGKEYS.forEach(function (k) { if (b[k] != null) S[k] = b[k]; });
    applyScope(); saveCfg(); renderAll();
  }

  /* ---- row add / delete ---- */
  function addVO() {
    var mx = 0; S.allRows.forEach(function (r) { var n = num(r.voNo); if (n != null && n > mx) mx = n; });
    var r = blankRow(); r.voNo = mx + 1; r.dateSub = new Date().toISOString().slice(0, 10);
    S.allRows.push(r); recomputeAuto(); ghPush(); applyScope();
    S.sortKey = ''; renderAll();
    toast('VO ' + r.voNo + ' added — fill in the row, and set Assessment Sheet if it needs a breakdown');
  }
  function deleteVO(row) {
    var lbl = 'VO ' + (row.voNo || '') + (row.desc ? ' — ' + row.desc : '');
    if (!window.confirm('Delete ' + lbl + ' from the register?\n\nThis is shared with the team. Its assessment sheet (if any) is kept.')) return;
    S.allRows = S.allRows.filter(function (r) { return r !== row; });
    recomputeAuto(); ghPush(); applyScope(); renderAll(); toast('Deleted ' + lbl);
  }

  /* ---------------------------------------------------------------------
   * assessment sheets — Excel-style tabs along the bottom of their panel
   * ------------------------------------------------------------------- */
  function gotoSheet(sn) {
    sn = String(sn);
    if (!S.sheets[sn]) return;
    S.activeSheet = sn; saveCfg(); renderSheetPanel();
    var p = root.querySelector('#shwrap'); if (p) p.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  function voForSheet(sn) { for (var i = 0; i < S.allRows.length; i++) if (String(S.allRows[i].sheetNo || '') === String(sn)) return S.allRows[i]; return null; }

  function renderSheetPanel() {
    renderSheetToolbar(); renderSheetGrid(); renderSheetTabs();
  }
  function renderSheetToolbar() {
    var box = root.getElementById('shtoolbar'); if (!box) return; box.innerHTML = '';
    var sn = S.activeSheet, sh = S.sheets[sn];
    if (!sh) {
      box.appendChild(el('span', { class: 'muted' }, ['No assessment sheets yet.']));
      box.appendChild(btn('＋ New sheet', 'Create the first assessment sheet', function () { newSheet(); }, 'primary'));
      return;
    }
    var vo = voForSheet(sn);
    var ttl = el('input', { type: 'text', class: 'shtitle', title: 'Sheet title — appears in cell B2 of this sheet in the Excel export', value: sh.title || '' });
    ttl.onchange = function () { sh.title = ttl.value; ghPush(); renderSheetTabs(); };
    box.appendChild(el('span', { class: 'dtlbl' }, ['SHEET ' + sn]));
    box.appendChild(ttl);
    box.appendChild(vo
      ? el('span', { class: 'shvo', title: 'This sheet feeds VO ' + vo.voNo + '’s Claim and Assessed amounts. Click to highlight that row.', onclick: function () { S.globalSearch = String(vo.desc || vo.voNo); applyFilters(); renderTable(); toast('Filtered the register to VO ' + vo.voNo); } }, ['→ VO ' + vo.voNo])
      : el('span', { class: 'shvo warn', title: 'No VO in the register points at this sheet. Show the Assessment Sheet column (⚙ Columns) and type ' + sn + ' on the VO this sheet belongs to.' }, ['⚠ not linked to a VO']));
    box.appendChild(el('div', { class: 'spacer' }));
    box.appendChild(btn('＋ Add line', 'Add an empty line item to this sheet', function () { addLine(sn); }, 'primary'));
    box.appendChild(btn('⌂ Rate library', 'Insert a line from the rates already used across the assessment sheets', function (ev) { openRatePanel(sn, ev && ev.currentTarget); }, 'pnltrig'));
    box.appendChild(btn('⊞ Paste lines', 'Paste line items straight from Excel — the panel lists the exact columns and their order', function (ev) { openPastePanel('sheet', ev && ev.currentTarget); }, 'pkgbtn pnltrig'));
    box.appendChild(btn('＋ New sheet', 'Create the next assessment sheet (' + nextSheetNo() + ')', function () { newSheet(); }));
    box.appendChild(btn('✕ Delete sheet', 'Delete assessment sheet ' + sn + ' and all of its line items', function () { deleteSheet(sn); }));
  }

  function renderSheetGrid() {
    var tw = root.getElementById('shwrap'); if (!tw) return; tw.innerHTML = '';
    var sn = S.activeSheet, sh = S.sheets[sn];
    var cnt = root.getElementById('shcount');
    if (!sh) { tw.appendChild(el('div', { class: 'muted', style: 'padding:18px;text-align:center' }, ['Create a sheet to record a VO’s claimed and assessed line items.'])); if (cnt) cnt.textContent = ''; return; }
    var items = sh.items || [], t = sheetTotals(sn);
    if (cnt) cnt.textContent = items.length + ' line' + (items.length === 1 ? '' : 's') + ' · claimed ' + money(t.claim) + ' · assessed ' + money(t.assessed) + ' · diff ' + money(t.diff);
    var table = el('table'); table.style.fontSize = S.fontSize + 'px';
    var thead = el('thead'), htr = el('tr', { class: 'hdr' }), letr = el('tr', { class: 'colletrow' });
    letr.appendChild(el('th', { class: 'colc rowact' }, ['']));
    htr.appendChild(el('th', { class: 'rowact', style: 'padding:1px 2px' }, ['']));
    iVisKeys().forEach(function (k, vi) {
      var cd = ICOLDEF[k], w = S.icols[k].w;
      letr.appendChild(el('th', { class: 'colc', style: 'width:' + w + 'px;min-width:' + w + 'px', title: 'Column ' + colAlpha(vi + 1) + ' · ' + cd.label }, [colAlpha(vi + 1)]));
      var thKids = [el('span', { class: 'lbl', title: cd.tip }, [cd.label + (cd.auto ? ' ƒ' : '')])];
      var srt = el('span', { class: 'srt', title: 'Sort this sheet by ' + cd.label }, [S.iSort.key === k ? (S.iSort.dir > 0 ? '▲' : '▼') : '↕']);
      srt.onclick = function (ev) { ev.stopPropagation(); if (S.iSort.key === k) S.iSort.dir = -(S.iSort.dir || 1); else S.iSort = { key: k, dir: 1 }; sortSheet(sn); renderSheetGrid(); };
      thKids.push(el('span', { class: 'hicons' }, [srt]));
      if (k === 'type') { var pal = el('span', { class: 'pal', title: 'Change the Type colour scheme' }, ['🎨']); pal.onclick = function (ev) { ev.stopPropagation(); colorSchemePanel('type', pal); }; thKids[1].appendChild(pal); }
      var th = el('th', { style: 'width:' + w + 'px;min-width:' + Math.max(w, minHW(k, ICOLDEF)) + 'px;padding:1px 2px;font-size:' + hdrFont() + 'px;line-height:1.15', class: (cd.edit ? 'mps-h' : ''), title: cd.tip }, thKids);
      var rez = el('div', { class: 'rez', title: 'Drag to resize this column' });
      rez.onmousedown = function (e) {
        e.preventDefault(); e.stopPropagation();
        var sx = e.clientX, sw = th.offsetWidth;
        function mv(ev) { var w2 = Math.max(minHW(k, ICOLDEF), sw + (ev.clientX - sx)); S.icols[k].w = w2; th.style.width = w2 + 'px'; th.style.minWidth = w2 + 'px'; }
        function up() { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); saveCfg(); renderSheetGrid(); }
        document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up);
      };
      th.appendChild(rez);
      htr.appendChild(th);
    });
    thead.appendChild(letr); thead.appendChild(htr); table.appendChild(thead);
    var tb = el('tbody');
    var pad = Math.max(0, Math.round(S.rowPad * (S.padScale || 100) / 100)), ws = S.wrap ? 'normal' : 'nowrap', ov = S.wrap ? 'visible' : 'hidden';
    items.forEach(function (it, idx) {
      var tr = el('tr');
      tr.appendChild(el('td', { class: 'rowact', style: 'padding:' + pad + 'px 2px' },
        [el('span', { class: 'rowdel', title: 'Delete this line', onclick: function (e) { e.stopPropagation(); delLine(sn, idx); } }, ['✕'])]));
      iVisKeys().forEach(function (k) {
        var w = S.icols[k].w, cd = ICOLDEF[k];
        var base = 'width:' + w + 'px;max-width:' + w + 'px;padding:' + pad + 'px 6px;white-space:' + ws + ';overflow:' + ov + ';text-overflow:ellipsis';
        var td;
        if (cd.auto) {
          var v = iCellVal(it, k);
          var extra = (k === 'lineDiff') ? (lineTot(it.qty, it.rate) - lineTot(it.aQty, it.aRate)) : 0;
          td = el('td', { style: base + ';text-align:right' + (k === 'lineDiff' ? (extra > 0 ? ';color:#c0392b;font-weight:700' : (extra < 0 ? ';color:#1e7e34;font-weight:700' : ';color:#8a939b')) : ';color:#1565c0'), title: cd.tip }, [el('span', { class: 'fx' }, ['ƒ']), v]);
        } else if (cd.edit === 'enum') {
          td = el('td', { class: 'edit', style: base });
          iEnum(it, k, td, sn, idx);
        } else if (cd.edit === 'money') {
          td = el('td', { class: 'edit', style: base });
          moneyInput(td, function () { return it[k]; }, function (v) { setItem(sn, idx, k, v); renderSheetGrid(); renderStats(); renderVarBar(); renderBody(); }, cd.tip);
        } else if (cd.edit === 'num') {
          td = el('td', { class: 'edit', style: base });
          var ninp = el('input', { type: 'text', class: 'numin', title: cd.tip, value: (it[k] == null ? '' : String(it[k])) });
          ninp.onchange = function () { var n = num(ninp.value); setItem(sn, idx, k, n == null ? '' : n); renderSheetGrid(); renderStats(); renderVarBar(); renderBody(); };
          td.appendChild(ninp);
        } else {
          td = el('td', { class: 'edit', style: base });
          var inp = el('input', { type: 'text', title: cd.tip, value: (it[k] == null ? '' : String(it[k])) });
          inp.onchange = function () { setItem(sn, idx, k, inp.value); };
          td.appendChild(inp);
        }
        tr.appendChild(td);
      });
      tb.appendChild(tr);
    });
    if (!items.length) { var tr0 = el('tr'); tr0.appendChild(el('td', { colspan: String(iVisKeys().length + 1), style: 'padding:16px;text-align:center;color:#8a939b' }, ['No line items yet — press ＋ Add line, ⌂ Rate library or ⊞ Paste lines.'])); tb.appendChild(tr0); }
    table.appendChild(tb);
    /* totals — label in the Rate column, value in MPS Claimed Total, exactly like the workbook */
    var tf = el('tfoot');
    var vis = iVisKeys();
    var vi = vis.indexOf('rate'), vv = vis.indexOf('claimTotal');
    if (vv < 0) vv = vis.length - 1;
    if (vi < 0 || vi >= vv) vi = Math.max(0, vv - 1);
    [['Total Claimed', t.claim, ''], ['Total Assessed', t.assessed, ''], ['Total Difference', t.diff, 'd']].forEach(function (p) {
      var tr = el('tr', { class: 'shtot' });
      tr.appendChild(el('td', { class: 'rowact' }, ['']));
      if (vi > 0) tr.appendChild(el('td', { colspan: String(vi) }, ['']));
      tr.appendChild(el('td', { style: 'text-align:right;font-weight:700;padding:3px 8px;white-space:nowrap' }, [p[0]]));
      tr.appendChild(el('td', { style: 'text-align:right;font-weight:700;padding:3px 8px;white-space:nowrap' + (p[2] === 'd' ? (p[1] > 0 ? ';color:#c0392b' : (p[1] < 0 ? ';color:#1e7e34' : '')) : '') }, [money(p[1])]));
      var restN = vis.length - vv - 1;
      if (restN > 0) tr.appendChild(el('td', { colspan: String(restN) }, ['']));
      tf.appendChild(tr);
    });
    table.appendChild(tf);
    tw.appendChild(table);
    var letRow = table.querySelector('tr.colletrow'), hRow = table.querySelector('tr.hdr');
    var letH = letRow ? letRow.offsetHeight : 0;
    if (hRow) hRow.querySelectorAll('th').forEach(function (th) { th.style.top = letH + 'px'; });
  }
  function iEnum(it, k, td, sn, idx) {
    var opts = ICOLDEF[k].opts || [];
    var trig = el('div', { class: 'enumtrig', title: ICOLDEF[k].tip });
    function paint() {
      var v = it[k] || '', c = (k === 'type' ? typeColor(v) : '');
      trig.innerHTML = '';
      trig.appendChild(el('span', { class: 'enumval' + (v && c ? ' set' : ''), style: (v && c ? ('background:' + c + ';color:' + lumFg(c) + ';border:1px solid rgba(0,0,0,.18)') : '') }, [v ? String(v) : '—']));
      trig.appendChild(el('span', { class: 'enumcar' }, ['▾']));
    }
    paint();
    trig.onclick = function (e) {
      e.stopPropagation();
      var wrapEl = root.getElementById('wrap');
      var ex = root.getElementById('enumdd'); var same = ex && ex.__it === it && ex.__k === k; if (ex) ex.remove(); if (same) return;
      var panel = el('div', { id: 'enumdd', class: 'mfpanel', style: 'min-width:150px' }); panel.__it = it; panel.__k = k;
      panel.appendChild(el('div', { class: 'mfhd' }, [el('span', { style: 'font-weight:700;color:' + NAVY + ';font-size:11px' }, [ICOLDEF[k].label]), el('a', { title: 'Close', style: 'margin-left:auto', onclick: function () { panel.remove(); } }, ['✕'])]));
      panel.appendChild(el('div', { class: 'mfrow', onclick: function () { setItem(sn, idx, k, ''); paint(); panel.remove(); renderSheetGrid(); } }, [el('span', { style: 'flex:1;color:#8a939b' }, ['—'])]));
      var seen = {}, list = opts.slice();
      Object.keys(S.sheets).forEach(function (s2) { (S.sheets[s2].items || []).forEach(function (i2) { var v = i2[k]; if (v && list.indexOf(v) < 0 && !seen[v]) { seen[v] = 1; list.push(v); } }); });
      list.forEach(function (o) {
        var kids = [];
        if (k === 'type') { var dot = el('i'); dot.style.cssText = 'width:10px;height:10px;border-radius:2px;background:' + typeColor(o) + ';display:inline-block;flex:0 0 auto'; kids.push(dot); }
        kids.push(el('span', { style: 'flex:1' }, [o]));
        panel.appendChild(el('div', { class: 'mfrow', onclick: function () { setItem(sn, idx, k, o); paint(); panel.remove(); renderSheetGrid(); } }, kids));
      });
      var nv = el('input', { type: 'text', placeholder: 'add a value…', style: 'flex:1;min-width:70px;font-size:11px;padding:2px 5px;border:1px solid #cfd8e3;border-radius:4px' });
      nv.onkeydown = function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); var v = (nv.value || '').trim(); if (v) { setItem(sn, idx, k, v); paint(); panel.remove(); renderSheetGrid(); } } };
      panel.appendChild(el('div', { class: 'mfrow', style: 'border-top:1px solid #e3e9f0;margin-top:4px;padding-top:5px' }, [nv]));
      wrapEl.appendChild(panel);
      var ar = trig.getBoundingClientRect(), wr = wrapEl.getBoundingClientRect();
      panel.style.left = Math.max(4, Math.min(ar.left - wr.left, wr.width - 165)) + 'px';
      panel.style.top = (ar.bottom - wr.top + 2) + 'px';
    };
    td.appendChild(trig);
  }
  function sortSheet(sn) {
    var sh = S.sheets[sn]; if (!sh) return;
    var k = S.iSort.key, dir = S.iSort.dir || 1;
    if (!k) return;
    var numeric = { qty: 1, rate: 1, aQty: 1, aRate: 1, claimTotal: 1, aTotal: 1, lineDiff: 1 }[k];
    sh.items.sort(function (a, b) {
      if (numeric) {
        function v(x) { return k === 'claimTotal' ? lineTot(x.qty, x.rate) : k === 'aTotal' ? lineTot(x.aQty, x.aRate) : k === 'lineDiff' ? (lineTot(x.qty, x.rate) - lineTot(x.aQty, x.aRate)) : (num(x[k]) == null ? -Infinity : num(x[k])); }
        return (v(a) - v(b)) * dir;
      }
      var x = String(a[k] || ''), y = String(b[k] || '');
      return x < y ? -dir : x > y ? dir : 0;
    });
    ghPush();
  }

  function renderSheetTabs() {
    var box = root.getElementById('shtabs'); if (!box) return; box.innerHTML = '';
    var order = sheetOrder();
    order.forEach(function (sn) {
      var vo = voForSheet(sn), t = sheetTotals(sn);
      var tab = el('div', { class: 'shtab' + (sn === S.activeSheet ? ' active' : ''), title: (S.sheets[sn].title || '') + (vo ? '  ·  VO ' + vo.voNo : '  ·  not linked to a VO') + '  ·  claimed ' + money(t.claim) + ', assessed ' + money(t.assessed), onclick: function () { gotoSheet(sn); } }, [sn]);
      if (t.diff > 0) tab.appendChild(el('i', { class: 'shdot' }));
      box.appendChild(tab);
    });
    box.appendChild(el('div', { class: 'shtab add', title: 'Create assessment sheet ' + nextSheetNo(), onclick: function () { newSheet(); } }, ['＋']));
    if (order.length) box.appendChild(el('span', { class: 'shhint' }, ['sheets export as their own Excel tabs, exactly like the workbook']));
  }

  function newSheet() {
    var sn = nextSheetNo();
    S.sheets[sn] = { no: sn, title: '', items: [] };
    S.activeSheet = sn; saveCfg(); ghPush(); recomputeAuto(); renderAll();
    toast('Sheet ' + sn + ' created. Give it a title, then type ' + sn + ' in the Assessment Sheet column of its VO (⚙ Columns to show it) so the amounts roll up.');
  }
  function deleteSheet(sn) {
    var vo = voForSheet(sn);
    if (!window.confirm('Delete assessment sheet ' + sn + ' and its ' + ((S.sheets[sn].items || []).length) + ' line item(s)?' + (vo ? '\n\nVO ' + vo.voNo + ' points at this sheet; its Claim / Assessed amounts will go back to manual entry.' : ''))) return;
    delete S.sheets[sn];
    S.activeSheet = sheetOrder()[0] || '';
    saveCfg(); recomputeAuto(); ghPush(); renderAll(); toast('Sheet ' + sn + ' deleted');
  }
  function addLine(sn, seed) {
    var sh = S.sheets[sn]; if (!sh) return;
    var it = {}; IORDER.forEach(function (k) { if (!ICOLDEF[k].auto) it[k] = ''; });
    if (seed) { it.desc = seed.desc || ''; it.type = seed.type || ''; it.unit = seed.unit || ''; it.rate = (seed.rate == null ? '' : seed.rate); it.aRate = (seed.rate == null ? '' : seed.rate); }
    sh.items.push(it); recomputeAuto(); ghPush(); renderSheetGrid(); renderStats(); renderVarBar(); renderBody(); renderSheetTabs();
  }
  function delLine(sn, idx) {
    var sh = S.sheets[sn]; if (!sh) return;
    sh.items.splice(idx, 1); recomputeAuto(); ghPush(); renderSheetGrid(); renderStats(); renderVarBar(); renderBody(); renderSheetTabs();
  }

  /* ---- rate library (the rates already used across the sheets) ---- */
  function rateLibrary() {
    var m = {};
    RATE_LIB.forEach(function (r) { m[r.desc] = { desc: r.desc, type: r.type, unit: r.unit, rate: r.rate, n: 0 }; });
    Object.keys(S.sheets).forEach(function (sn) {
      (S.sheets[sn].items || []).forEach(function (it) {
        var d = String(it.desc || '').trim(); if (!d) return;
        var rt = num(it.rate); if (rt == null) return;
        if (!m[d]) m[d] = { desc: d, type: it.type || '', unit: it.unit || '', rate: rt, n: 0 };
        m[d].n++; m[d].rate = rt; if (it.type) m[d].type = it.type; if (it.unit) m[d].unit = it.unit;
      });
    });
    return Object.keys(m).map(function (k) { return m[k]; }).sort(function (a, b) { return (b.n - a.n) || (a.desc < b.desc ? -1 : 1); });
  }
  function openRatePanel(sn, anchor) {
    var wrapEl = root.getElementById('wrap');
    var ex = root.getElementById('ratedd'); if (ex) { ex.remove(); return; }
    var panel = el('div', { id: 'ratedd', class: 'mfpanel', style: 'min-width:400px;max-width:520px;max-height:330px' });
    var lib = rateLibrary(), q = '';
    var listWrap = el('div', {});
    function build() {
      listWrap.innerHTML = '';
      var l = lib.filter(function (r) { return !q || (r.desc + ' ' + r.type).toLowerCase().indexOf(q) >= 0; });
      if (!l.length) listWrap.appendChild(el('div', { class: 'muted', style: 'font-size:11px;padding:6px' }, ['Nothing matches.']));
      l.slice(0, 300).forEach(function (r) {
        listWrap.appendChild(el('div', { class: 'mfrow', title: 'Add a line for ' + r.desc + ' at ' + money(r.rate) + ' / ' + (r.unit || 'unit'), onclick: function () { addLine(sn, r); panel.remove(); toast('Added ' + r.desc + ' at ' + money(r.rate)); } }, [
          el('i', { style: 'width:10px;height:10px;border-radius:2px;flex:0 0 auto;background:' + typeColor(r.type) }),
          el('span', { style: 'flex:1' }, [r.desc]),
          el('span', { class: 'muted', style: 'font-size:10.5px;flex:0 0 auto' }, [(r.type || '') + ' · ' + (r.unit || '')]),
          el('span', { style: 'font-weight:700;flex:0 0 auto' }, [money(r.rate)])
        ]));
      });
    }
    var srch = el('input', { type: 'search', placeholder: '⌕ search resources / plant / materials…', style: 'flex:1;font-size:11px;padding:3px 6px;border:1px solid #cfd8e3;border-radius:4px' });
    srch.oninput = function () { q = srch.value.toLowerCase(); build(); };
    panel.appendChild(el('div', { class: 'mfhd' }, [el('span', { style: 'font-weight:700;color:' + NAVY + ';font-size:11px' }, ['Rate library — sheet ' + sn]), el('a', { title: 'Close', style: 'margin-left:auto', onclick: function () { panel.remove(); } }, ['✕'])]));
    panel.appendChild(el('div', { class: 'mfrow' }, [srch]));
    build(); panel.appendChild(listWrap);
    panel.appendChild(el('div', { class: 'muted', style: 'font-size:10.5px;padding:4px 6px;white-space:normal' }, ['Rates come from every assessment sheet in this register — the most-used first. The BHP Assessed Rate is pre-filled to match; change it when BHP assesses differently.']));
    wrapEl.appendChild(panel);
    var ar = anchor.getBoundingClientRect(), wr = wrapEl.getBoundingClientRect();
    panel.style.left = Math.max(4, Math.min(ar.left - wr.left, wr.width - 530)) + 'px';
    panel.style.top = (ar.bottom - wr.top + 4) + 'px';
  }

  /* ---------------------------------------------------------------------
   * paste import — the column list is shown, in order, before you paste
   * ------------------------------------------------------------------- */
  var PASTE_REG = [
    { k: 'voNo', label: 'MPS VO No.', eg: '21', req: 1 },
    { k: 'dateSub', label: 'Date Submitted', eg: '03/09/2026' },
    { k: 'siRef', label: 'Site Instruction Ref', eg: '004' },
    { k: 'bhpVd', label: 'BHP VO Direction No.', eg: '4' },
    { k: 'rev', label: 'Revision', eg: '0' },
    { k: 'desc', label: 'VO Description', eg: 'Apron line marking', req: 1 },
    { k: 'claim', label: 'MPS VO Claim/Proposal Amount', eg: '12500.00' },
    { k: 'assessed', label: 'BHP Assessed/Approved Amount', eg: '11000' },
    { k: 'status', label: 'Status', eg: 'Open' },
    { k: 'comments', label: 'Comments', eg: 'Submitted with backup' },
    { k: 'corrRef', label: 'RFI/Correspondence Ref', eg: 'MPSBE-RFI-000081' },
    { k: 'sheetNo', label: 'Assessment Sheet', eg: '12' }
  ];
  var PASTE_ITEM = [
    { k: 'desc', label: 'Description', eg: 'Operator-CNPI-Day', req: 1 },
    { k: 'type', label: 'Type', eg: 'Labour' },
    { k: 'qty', label: 'MPS Quantity Claimed', eg: '32.5' },
    { k: 'unit', label: 'Unit', eg: 'Hours' },
    { k: 'rate', label: 'Rate', eg: '98.90' },
    { k: 'aQty', label: 'BHP Assessed Quantity', eg: '32.5' },
    { k: 'aRate', label: 'BHP Assessed Rate', eg: '98.90' },
    { k: 'bhpComments', label: 'BHP Comments', eg: 'Substantiated by invoices' }
  ];
  function splitRows(txt) {
    return String(txt || '').replace(/\r/g, '').split('\n').filter(function (l) { return l.trim() !== ''; })
      .map(function (l) { return (l.indexOf('\t') >= 0 ? l.split('\t') : splitCsv(l)).map(function (c) { return String(c).trim().replace(/^"|"$/g, ''); }); });
  }
  function splitCsv(l) {
    var out = [], cur = '', q = false;
    for (var i = 0; i < l.length; i++) {
      var c = l[i];
      if (c === '"') { if (q && l[i + 1] === '"') { cur += '"'; i++; } else q = !q; }
      else if (c === ',' && !q) { out.push(cur); cur = ''; }
      else cur += c;
    }
    out.push(cur); return out;
  }
  function looksLikeHeader(cells, spec) {
    var joined = cells.join(' ').toLowerCase();
    return spec.slice(0, 3).some(function (c) { return joined.indexOf(c.label.toLowerCase().split(' ')[0]) >= 0; })
      && !/^\d/.test(String(cells[0] || ''));
  }
  function openPastePanel(mode, anchor) {
    var wrapEl = root.getElementById('wrap');
    var ex = root.getElementById('pastepanel'); if (ex) { ex.remove(); return; }
    var spec = (mode === 'register') ? PASTE_REG : PASTE_ITEM;
    var sn = S.activeSheet;
    if (mode === 'sheet' && !S.sheets[sn]) { toast('Create a sheet first (＋ New sheet).'); return; }
    var panel = el('div', { id: 'pastepanel', class: 'panel paste', style: 'left:50%;top:70px;transform:translateX(-50%);width:min(920px,94vw);max-height:calc(100vh - 110px)' });
    panel.appendChild(el('h4', { style: 'cursor:default' }, [mode === 'register' ? 'Paste VO rows into the register' : 'Paste line items into assessment sheet ' + sn]));
    panel.appendChild(el('div', { class: 'muted', style: 'font-size:11.5px;margin-bottom:8px;white-space:normal' }, [
      'Copy the block of cells from Excel and paste it below. Columns must be in THIS order, left to right — a header row is detected and skipped. Leave a cell empty to leave the field blank; '
      + (mode === 'register' ? 'Difference and CONCAT Name are formulas and are NOT pasted (they are calculated).' : 'MPS Claimed Total, BHP Assessed Total and Difference are formulas and are NOT pasted (they are calculated).')
    ]));
    /* the required column list, in order */
    var specTbl = el('table', { class: 'spectbl' });
    var hr = el('tr'), er = el('tr');
    spec.forEach(function (c, i) {
      hr.appendChild(el('th', {}, [colAlpha(i) + '  ' + c.label + (c.req ? ' *' : '')]));
      er.appendChild(el('td', {}, [c.eg]));
    });
    specTbl.appendChild(el('thead', {}, [hr])); specTbl.appendChild(el('tbody', {}, [er]));
    panel.appendChild(el('div', { class: 'specwrap' }, [specTbl]));
    panel.appendChild(el('div', { class: 'muted', style: 'font-size:10.5px;margin:2px 0 8px' }, ['* required. Dates accept 03/09/2026, 3/9/26 or 2026-09-03. Amounts may include $ and commas.'
      + (mode === 'register' ? ' Several references go in one cell separated by commas or semicolons.' : ' Leave MPS Quantity Claimed blank for a lump sum — the Rate is then the whole claim.')]));
    var ta = el('textarea', { class: 'pastebox', placeholder: 'Paste here (Ctrl+V)…', rows: '6' });
    panel.appendChild(ta);
    var prev = el('div', { class: 'prevwrap' });
    panel.appendChild(prev);
    var parsed = [];
    function parse() {
      var rowsIn = splitRows(ta.value), skipped = 0;
      if (rowsIn.length && looksLikeHeader(rowsIn[0], spec)) { rowsIn = rowsIn.slice(1); skipped = 1; }
      parsed = rowsIn.map(function (cells) {
        var o = { __err: [] };
        spec.forEach(function (c, i) {
          var raw = (cells[i] == null ? '' : String(cells[i]).trim());
          if (c.k === 'dateSub') { o[c.k] = raw ? parseAnyDate(raw) : ''; if (raw && !o[c.k]) o.__err.push('date "' + raw + '" not understood'); }
          else if (c.k === 'claim' || c.k === 'assessed' || c.k === 'rate' || c.k === 'aRate' || c.k === 'qty' || c.k === 'aQty' || c.k === 'rev') {
            if (raw === '') o[c.k] = (c.k === 'rev' ? 0 : '');
            else { var n = num(raw); if (n == null) { o.__err.push(c.label + ' "' + raw + '" is not a number'); o[c.k] = ''; } else o[c.k] = n; }
          }
          else if (c.k === 'corrRef') o[c.k] = raw ? raw.split(/[,;\n]+/).map(function (s) { return s.trim(); }).filter(Boolean) : [];
          else o[c.k] = raw;
          if (c.req && (o[c.k] === '' || o[c.k] == null)) o.__err.push(c.label + ' is required');
        });
        if (mode === 'register' && o.status) {
          var match = statusOptions().filter(function (s) { return s.toLowerCase() === String(o.status).toLowerCase(); })[0];
          if (match) o.status = match; else o.__err.push('status "' + o.status + '" is not in the workflow (Draft, Open, Closed, Declined, Disputed) — it will be added');
        }
        if (mode === 'register' && !o.status) o.status = 'Draft';
        return o;
      });
      renderPrev(skipped);
    }
    function renderPrev(skipped) {
      prev.innerHTML = '';
      if (!parsed.length) { prev.appendChild(el('div', { class: 'muted', style: 'font-size:11px;padding:6px' }, ['Nothing pasted yet.'])); paintBtns(); return; }
      var bad = parsed.filter(function (p) { return p.__err.length; }).length;
      prev.appendChild(el('div', { style: 'font-size:11.5px;margin:6px 0 4px;font-weight:700;color:' + (bad ? '#c0392b' : '#1e7e34') },
        [parsed.length + ' row' + (parsed.length === 1 ? '' : 's') + ' read' + (skipped ? ' (header row skipped)' : '') + (bad ? ' · ' + bad + ' with problems' : ' · all look fine')]));
      var t = el('table', { class: 'prevtbl' });
      var hr2 = el('tr'); hr2.appendChild(el('th', {}, ['#']));
      spec.forEach(function (c) { hr2.appendChild(el('th', {}, [c.label])); });
      hr2.appendChild(el('th', {}, ['Checks']));
      t.appendChild(el('thead', {}, [hr2]));
      var tb2 = el('tbody');
      parsed.slice(0, 60).forEach(function (p, i) {
        var tr = el('tr', { class: p.__err.length ? 'bad' : '' });
        tr.appendChild(el('td', {}, [String(i + 1)]));
        spec.forEach(function (c) {
          var v = p[c.k];
          if (c.k === 'dateSub') v = fmtDate(v);
          else if (Object.prototype.toString.call(v) === '[object Array]') v = v.join(', ');
          tr.appendChild(el('td', {}, [v === '' || v == null ? '' : String(v)]));
        });
        tr.appendChild(el('td', { class: 'errcell' }, [p.__err.length ? p.__err.join('; ') : '✓']));
        tb2.appendChild(tr);
      });
      t.appendChild(tb2); prev.appendChild(el('div', { class: 'prevscroll' }, [t]));
      if (parsed.length > 60) prev.appendChild(el('div', { class: 'muted', style: 'font-size:10.5px' }, ['…' + (parsed.length - 60) + ' more rows not previewed']));
      paintBtns();
    }
    ta.oninput = parse; ta.onpaste = function () { setTimeout(parse, 0); };
    var addBtn = el('button', { class: 'btn primary', onclick: function () { commit(false); } }, ['Append rows']);
    var repBtn = el('button', { class: 'btn', onclick: function () { commit(true); } }, [mode === 'register' ? 'Replace whole register' : 'Replace this sheet’s lines']);
    function paintBtns() {
      var ok = parsed.filter(function (p) { return !p.__err.filter(function (e) { return !/will be added/.test(e); }).length; }).length;
      addBtn.disabled = !ok; repBtn.disabled = !ok;
      addBtn.textContent = ok ? ('Append ' + ok + ' row' + (ok === 1 ? '' : 's')) : 'Append rows';
    }
    function commit(replace) {
      var good = parsed.filter(function (p) { return !p.__err.filter(function (e) { return !/will be added/.test(e); }).length; });
      if (!good.length) return;
      if (replace && !window.confirm('Replace ' + (mode === 'register' ? 'every row in the register' : 'every line on sheet ' + sn) + ' with the ' + good.length + ' pasted row(s)?')) return;
      if (mode === 'register') {
        var made = good.map(function (p) { var r = blankRow(); PASTE_REG.forEach(function (c) { r[c.k] = p[c.k]; }); if (p.status) addStatus(p.status); return r; });
        S.allRows = replace ? made : S.allRows.concat(made);
      } else {
        var items = good.map(function (p) { var it = {}; PASTE_ITEM.forEach(function (c) { it[c.k] = p[c.k]; }); return it; });
        S.sheets[sn].items = replace ? items : (S.sheets[sn].items || []).concat(items);
      }
      recomputeAuto(); ghPush(); applyScope(); panel.remove(); renderAll();
      toast((replace ? 'Replaced with ' : 'Added ') + good.length + ' row' + (good.length === 1 ? '' : 's'));
    }
    panel.appendChild(el('div', { style: 'margin-top:8px;display:flex;gap:6px;align-items:center' }, [
      addBtn, repBtn,
      el('button', { class: 'btn', onclick: function () { ta.value = ''; parse(); } }, ['Clear']),
      el('div', { class: 'spacer' }),
      el('button', { class: 'btn', onclick: function () { panel.remove(); } }, ['Close'])
    ]));
    parse();
    wrapEl.appendChild(panel);
  }

  /* =====================================================================
   * .xlsx export — multi-sheet, live formulas, hidden columns preserved.
   * Geometry mirrors the source workbook:
   *   "Variation Register"  header row 3, data from row 4, TOTALS 2 rows below
   *   "1".."N"              title B2, header rows 5-6, data from row 7,
   *                         Total Claimed / Assessed / Difference below
   * Columns the dashboard is hiding are still written, and hidden in Excel,
   * so the Difference / CONCAT formulas keep working.
   * ===================================================================== */
  var X_CUR = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-';
  var X_DATE = 'dd/mm/yyyy';
  var HDRBLUE = '#1F4E79';

  var CRC = (function () { var c, t = []; for (var n = 0; n < 256; n++) { c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function crc32(b) { var c = 0xFFFFFFFF; for (var i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function u8(s) { return new TextEncoder().encode(s); }
  function numB(n, l) { var a = new Uint8Array(l); for (var i = 0; i < l; i++) { a[i] = n & 0xFF; n = Math.floor(n / 256); } return a; }
  function zipStore(files) {
    var ch = [], cen = [], off = 0;
    function push(a) { ch.push(a); off += a.length; }
    files.forEach(function (f) {
      var nm = u8(f.name), crc = crc32(f.data), st = off;
      push(new Uint8Array([80, 75, 3, 4])); push(numB(20, 2)); push(numB(0, 2)); push(numB(0, 2)); push(numB(0, 2)); push(numB(0, 2));
      push(numB(crc, 4)); push(numB(f.data.length, 4)); push(numB(f.data.length, 4)); push(numB(nm.length, 2)); push(numB(0, 2));
      push(nm); push(f.data);
      cen.push({ nm: nm, crc: crc, sz: f.data.length, off: st });
    });
    var cs = off;
    cen.forEach(function (c) {
      push(new Uint8Array([80, 75, 1, 2])); push(numB(20, 2)); push(numB(20, 2)); push(numB(0, 2)); push(numB(0, 2)); push(numB(0, 2)); push(numB(0, 2));
      push(numB(c.crc, 4)); push(numB(c.sz, 4)); push(numB(c.sz, 4)); push(numB(c.nm.length, 2)); push(numB(0, 2)); push(numB(0, 2)); push(numB(0, 2)); push(numB(0, 2));
      push(numB(0, 4)); push(numB(c.off, 4)); push(c.nm);
    });
    var ce = off;
    push(new Uint8Array([80, 75, 5, 6])); push(numB(0, 2)); push(numB(0, 2)); push(numB(cen.length, 2)); push(numB(cen.length, 2)); push(numB(ce - cs, 4)); push(numB(cs, 4)); push(numB(0, 2));
    var tot = 0; ch.forEach(function (c) { tot += c.length; });
    var out = new Uint8Array(tot), p = 0; ch.forEach(function (c) { out.set(c, p); p += c.length; });
    return out;
  }
  function xesc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function XL(i) { var s = ''; i++; while (i > 0) { var m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; }
  function argb(h) { h = String(h || '').replace('#', ''); if (h.length === 3) h = h.replace(/(.)/g, '$1$1'); return 'FF' + h.toUpperCase(); }
  function excelDate(iso) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || '')); if (!m) return null; return Math.round(Date.UTC(+m[1], +m[2] - 1, +m[3]) / 86400000) + 25569; }
  function qq(s) { return String(s == null ? '' : s).replace(/"/g, '""'); }

  function buildWorkbook(spec) {
    var sheets = spec.sheets || [];
    var numFmts = [], numFmtMap = {};
    function nfId(code) { if (!code) return 0; if (numFmtMap[code] != null) return numFmtMap[code]; var id = 164 + numFmts.length; numFmtMap[code] = id; numFmts.push('<numFmt numFmtId="' + id + '" formatCode="' + xesc(code) + '"/>'); return id; }
    var fonts = ['<font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/></font>'], fontMap = {};
    function fontId(bold, color, sz) {
      var key = (bold ? 'b' : '') + '|' + (color || '') + '|' + (sz || 11);
      if (fontMap[key] != null) return fontMap[key];
      var id = fonts.length; fontMap[key] = id;
      fonts.push('<font>' + (bold ? '<b/>' : '') + '<sz val="' + (sz || 11) + '"/>' + (color ? '<color rgb="' + argb(color) + '"/>' : '<color theme="1"/>') + '<name val="Calibri"/><family val="2"/></font>');
      return id;
    }
    var fills = ['<fill><patternFill patternType="none"/></fill>', '<fill><patternFill patternType="gray125"/></fill>'], fillMap = {};
    function fillId(hex) { if (!hex) return 0; var a = argb(hex); if (fillMap[a] != null) return fillMap[a]; var id = fills.length; fillMap[a] = id; fills.push('<fill><patternFill patternType="solid"><fgColor rgb="' + a + '"/><bgColor indexed="64"/></patternFill></fill>'); return id; }
    var borders = ['<border><left/><right/><top/><bottom/><diagonal/></border>',
      '<border><left style="thin"><color rgb="FFBFBFBF"/></left><right style="thin"><color rgb="FFBFBFBF"/></right><top style="thin"><color rgb="FFBFBFBF"/></top><bottom style="thin"><color rgb="FFBFBFBF"/></bottom><diagonal/></border>'];
    var xfs = ['<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'], xfMap = {};
    function styleId(st) {
      if (!st) return 0;
      var key = JSON.stringify([st.nf || '', st.fill || '', !!st.bold, st.color || '', !!st.wrap, st.hal || '', st.val || '', !!st.border, st.sz || 0]);
      if (xfMap[key] != null) return xfMap[key];
      var nf = nfId(st.nf), fo = fontId(st.bold, st.color, st.sz), fi = fillId(st.fill), bo = st.border ? 1 : 0, al = '';
      if (st.wrap || st.hal || st.val) al = '<alignment' + (st.hal ? ' horizontal="' + st.hal + '"' : '') + (st.val ? ' vertical="' + st.val + '"' : '') + (st.wrap ? ' wrapText="1"' : '') + '/>';
      var id = xfs.length; xfMap[key] = id;
      xfs.push('<xf numFmtId="' + nf + '" fontId="' + fo + '" fillId="' + fi + '" borderId="' + bo + '" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"' + (al ? ' applyAlignment="1"' : '') + '>' + al + '</xf>');
      return id;
    }
    var sheetXml = sheets.map(function (sh) {
      var colsXml = '';
      if (sh.cols && sh.cols.length) {
        colsXml = '<cols>' + sh.cols.map(function (c, i) { if (!c) return ''; return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + (c.w || 10).toFixed(2) + '" customWidth="1"' + (c.hidden ? ' hidden="1"' : '') + '/>'; }).join('') + '</cols>';
      }
      var rowKeys = Object.keys(sh.rows || {}).map(Number).sort(function (a, b) { return a - b; });
      var rowsXml = rowKeys.map(function (rn) {
        var cells = sh.rows[rn] || [];
        var body = cells.map(function (c, i) {
          if (c == null) return '';
          var ref = XL(i) + rn, s = styleId(c.st);
          if (c.f != null) return '<c r="' + ref + '" s="' + s + '"><f>' + xesc(String(c.f).replace(/^=/, '')) + '</f></c>';
          if (c.v == null || c.v === '') return '<c r="' + ref + '" s="' + s + '"/>';
          if (typeof c.v === 'number') return '<c r="' + ref + '" s="' + s + '"><v>' + c.v + '</v></c>';
          return '<c r="' + ref + '" s="' + s + '" t="inlineStr"><is><t xml:space="preserve">' + xesc(c.v) + '</t></is></c>';
        }).join('');
        return '<row r="' + rn + '"' + (sh.rowH && sh.rowH[rn] ? ' ht="' + sh.rowH[rn] + '" customHeight="1"' : '') + '>' + body + '</row>';
      }).join('');
      var pane = '';
      if (sh.freeze && (sh.freeze.row || sh.freeze.col)) {
        var tl = XL(sh.freeze.col || 0) + ((sh.freeze.row || 0) + 1);
        pane = '<pane' + (sh.freeze.col ? ' xSplit="' + sh.freeze.col + '"' : '') + (sh.freeze.row ? ' ySplit="' + sh.freeze.row + '"' : '') + ' topLeftCell="' + tl + '" activePane="bottomRight" state="frozen"/>';
      }
      var merges = (sh.merges && sh.merges.length) ? '<mergeCells count="' + sh.merges.length + '">' + sh.merges.map(function (m) { return '<mergeCell ref="' + m + '"/>'; }).join('') + '</mergeCells>' : '';
      var af = sh.autoFilter ? '<autoFilter ref="' + sh.autoFilter + '"/>' : '';
      var dv = (sh.dv && sh.dv.length) ? '<dataValidations count="' + sh.dv.length + '">' + sh.dv.map(function (v) { return '<dataValidation type="list" allowBlank="1" showInputMessage="1" showErrorMessage="1" sqref="' + v.sqref + '"><formula1>"' + xesc(v.list) + '"</formula1></dataValidation>'; }).join('') + '</dataValidations>' : '';
      return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        + '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
        + '<sheetPr><outlinePr summaryBelow="1" summaryRight="1"/></sheetPr>'
        + '<sheetViews><sheetView' + (sh.tabSelected ? ' tabSelected="1"' : '') + ' workbookViewId="0">' + pane + '</sheetView></sheetViews>'
        + '<sheetFormatPr defaultRowHeight="15"/>' + colsXml + '<sheetData>' + rowsXml + '</sheetData>' + af + merges + dv + '</worksheet>';
    });
    var styles = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
      + (numFmts.length ? '<numFmts count="' + numFmts.length + '">' + numFmts.join('') + '</numFmts>' : '')
      + '<fonts count="' + fonts.length + '">' + fonts.join('') + '</fonts>'
      + '<fills count="' + fills.length + '">' + fills.join('') + '</fills>'
      + '<borders count="' + borders.length + '">' + borders.join('') + '</borders>'
      + '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
      + '<cellXfs count="' + xfs.length + '">' + xfs.join('') + '</cellXfs>'
      + '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
    var wb = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'
      + sheets.map(function (sh, i) { return '<sheet name="' + xesc(sh.name) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>'; }).join('')
      + '</sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>';
    var wbRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
      + sheets.map(function (sh, i) { return '<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>'; }).join('')
      + '<Relationship Id="rId' + (sheets.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>';
    var rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
    var ct = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
      + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>'
      + '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
      + sheets.map(function (sh, i) { return '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'; }).join('')
      + '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>';
    var files = [{ name: '[Content_Types].xml', data: u8(ct) }, { name: '_rels/.rels', data: u8(rels) },
      { name: 'xl/workbook.xml', data: u8(wb) }, { name: 'xl/_rels/workbook.xml.rels', data: u8(wbRels) }, { name: 'xl/styles.xml', data: u8(styles) }];
    sheetXml.forEach(function (x, i) { files.push({ name: 'xl/worksheets/sheet' + (i + 1) + '.xml', data: u8(x) }); });
    return zipStore(files);
  }

  /* export column geometry — fixed order, so the formulas are stable */
  var XREG = [
    { k: 'voNo', nf: '0', bold: 1, hal: 'center' },
    { k: 'dateSub', nf: X_DATE, hal: 'center' },
    { k: 'siRef', hal: 'center' },
    { k: 'bhpVd', hal: 'center' },
    { k: 'rev', nf: '0', hal: 'center' },
    { k: 'desc', wrap: 1 },
    { k: 'concat' },
    { k: 'claim', nf: X_CUR },
    { k: 'assessed', nf: X_CUR },
    { k: 'diff', nf: X_CUR },
    { k: 'status', hal: 'center' },
    { k: 'comments', wrap: 1 },
    { k: 'corrRef', wrap: 1 },
    { k: 'sheetNo', hal: 'center' }
  ];
  var XCOL = {}; XREG.forEach(function (c, i) { XCOL[c.k] = i; });
  var XITEM = [null, { k: 'desc', wrap: 1 }, { k: 'type', hal: 'center' }, { k: 'qty', hal: 'center' }, { k: 'unit', hal: 'center' },
    { k: 'rate', nf: X_CUR }, { k: 'claimTotal', nf: X_CUR }, { k: 'aQty', hal: 'center' }, { k: 'aRate', nf: X_CUR },
    { k: 'aTotal', nf: X_CUR }, { k: 'lineDiff', nf: X_CUR }, { k: 'bhpComments', wrap: 1 }];

  function buildVarSpec() {
    var reg = S.filtered.length ? S.filtered : S.allRows;
    var order = sheetOrder();
    var geo = {};
    order.forEach(function (sn) {
      var items = (S.sheets[sn].items || []), first = 7, last = first + Math.max(items.length, 1) - 1;
      geo[sn] = { first: first, last: last, tClaim: last + 2, tAssess: last + 3, tDiff: last + 4 };
    });

    var rows = {}, dataFirst = 4, r = dataFirst;
    rows[1] = [{ v: 'MPS GROUP  ·  VARIATION REGISTER', st: { bold: 1, sz: 14, color: NAVY } }];
    rows[2] = [{ v: CFG.projectName + '   ·   MPS ' + CFG.mpsProjectNo + '   ·   WP ' + CFG.workPackage + '   ·   exported ' + fmtDate(new Date().toISOString().slice(0, 10)), st: { color: '#55637A' } }];
    rows[3] = XREG.map(function (c) { return { v: colLabel(c.k), st: { bold: 1, color: '#FFFFFF', fill: HDRBLUE, wrap: 1, hal: 'center', val: 'center', border: 1 } }; });

    reg.forEach(function (row) {
      var cells = new Array(XREG.length).fill(null);
      function st(k, extra) {
        var c = XREG[XCOL[k]], o = { border: 1 };
        if (c.nf) o.nf = c.nf; if (c.wrap) o.wrap = 1; if (c.hal) o.hal = c.hal; if (c.bold) o.bold = 1;
        if (extra) for (var x in extra) o[x] = extra[x];
        return o;
      }
      function put(k, cell) { cells[XCOL[k]] = cell; }
      var sn = String(row.sheetNo || '').trim(), g = (sn && geo[sn]) ? geo[sn] : null;

      var vn = num(row.voNo);
      put('voNo', vn != null ? { v: vn, st: st('voNo') } : { v: String(row.voNo || ''), st: st('voNo') });
      var ed = excelDate(row.dateSub);
      put('dateSub', { v: (ed != null ? ed : ''), st: st('dateSub') });
      put('siRef', { v: String(row.siRef == null ? '' : row.siRef), st: st('siRef') });
      var vdTxt = String(row.bhpVd == null ? '' : row.bhpVd).trim();
      put('bhpVd', /^-?\d+(\.\d+)?$/.test(vdTxt) ? { v: parseFloat(vdTxt), st: st('bhpVd') } : { v: vdTxt, st: st('bhpVd') });
      put('rev', { v: (row.rev === '' || row.rev == null) ? 0 : (num(row.rev) == null ? 0 : num(row.rev)), st: st('rev') });

      if (g) put('desc', { f: 'HYPERLINK("#\'' + sn + '\'!B2","' + qq(row.desc) + '")', st: st('desc', { color: '#1565C0' }) });
      else put('desc', { v: String(row.desc || ''), st: st('desc') });

      if (String(row.concat || '').trim()) put('concat', { v: String(row.concat), st: st('concat') });
      else put('concat', {
        f: '"VAR-"&TEXT($' + XL(XCOL.voNo) + r + ',"00")&"_SI-"&IF($' + XL(XCOL.siRef) + r + '="","NA",$' + XL(XCOL.siRef) + r + ')'
          + '&"_VD-"&IF($' + XL(XCOL.bhpVd) + r + '="","NA",IF(ISNUMBER($' + XL(XCOL.bhpVd) + r + '),TEXT($' + XL(XCOL.bhpVd) + r + ',"00"),$' + XL(XCOL.bhpVd) + r + '))'
          + '&" "&$' + XL(XCOL.desc) + r + '&"_REV"&$' + XL(XCOL.rev) + r, st: st('concat')
      });

      if (g) {
        put('claim', { f: "'" + sn + "'!G" + g.tClaim, st: st('claim') });
        put('assessed', { f: "'" + sn + "'!G" + g.tAssess, st: st('assessed') });
      } else {
        put('claim', { v: num(row.claim), st: st('claim') });
        put('assessed', { v: num(row.assessed), st: st('assessed') });
      }
      put('diff', { f: XL(XCOL.claim) + r + '-' + XL(XCOL.assessed) + r, st: st('diff') });

      var sv = String(row.status || ''), sf = sv ? statusColor(sv) : '';
      put('status', { v: sv, st: st('status', sf ? { fill: sf, bold: 1, color: lumFg(sf).toUpperCase() } : null) });
      put('comments', { v: String(row.comments || ''), st: st('comments') });
      put('corrRef', { v: (row.corrRef || []).join('\n'), st: st('corrRef') });
      put('sheetNo', { v: sn, st: st('sheetNo') });
      rows[r] = cells; r++;
    });

    var lastData = r - 1, totRow = lastData + 2;
    if (reg.length) {
      var tc = new Array(XREG.length).fill(null);
      tc[XCOL.desc] = { v: 'TOTALS', st: { bold: 1, hal: 'right' } };
      ['claim', 'assessed', 'diff'].forEach(function (k) { tc[XCOL[k]] = { f: 'SUM(' + XL(XCOL[k]) + dataFirst + ':' + XL(XCOL[k]) + lastData + ')', st: { nf: X_CUR, bold: 1, border: 1 } }; });
      rows[totRow] = tc;
    }

    var regSheet = {
      name: 'Variation Register', tabSelected: true,
      cols: XREG.map(function (c) { return { w: Math.max(6, (S.cols[c.k] ? S.cols[c.k].w : COLDEF[c.k].w) / 6.6), hidden: !(S.cols[c.k] && S.cols[c.k].show) }; }),
      freeze: { row: 3, col: 1 },
      autoFilter: reg.length ? ('A3:' + XL(XREG.length - 1) + lastData) : null,
      dv: [{ sqref: XL(XCOL.status) + dataFirst + ':' + XL(XCOL.status) + (lastData + 40), list: statusOptions().join(',') }],
      rows: rows, rowH: { 3: 32 }
    };

    var itemSheets = order.map(function (sn) {
      var sh = S.sheets[sn], items = sh.items || [], g = geo[sn], ir = {};
      var hdrSt = { bold: 1, color: '#FFFFFF', fill: HDRBLUE, wrap: 1, hal: 'center', val: 'center', border: 1 };
      var vo = voForSheet(sn);
      ir[2] = [null, { v: (sh.title || (vo ? String(vo.desc || '') : '') || ('Variation ' + sn)), st: { bold: 1, sz: 12, color: NAVY } }];
      var h = new Array(XITEM.length).fill(null);
      XITEM.forEach(function (c, i) { if (c) h[i] = { v: (c.k === 'qty' ? 'MPS Quantity' : ICOLDEF[c.k].label), st: hdrSt }; });
      ir[5] = h;
      var h2 = new Array(XITEM.length).fill(null); h2[3] = { v: 'Claimed', st: hdrSt }; ir[6] = h2;
      items.forEach(function (it, i) {
        var rr = g.first + i, cells = new Array(XITEM.length).fill(null);
        function ist(idx, extra) {
          var c = XITEM[idx], o = { border: 1 };
          if (c.nf) o.nf = c.nf; if (c.wrap) o.wrap = 1; if (c.hal) o.hal = c.hal;
          if (extra) for (var x in extra) o[x] = extra[x];
          return o;
        }
        cells[1] = { v: String(it.desc || ''), st: ist(1) };
        var tv = String(it.type || ''), tf = tv ? typeColor(tv) : '';
        cells[2] = { v: tv, st: ist(2, tf ? { fill: tf, bold: 1, color: lumFg(tf).toUpperCase() } : null) };
        cells[3] = { v: num(it.qty), st: ist(3) };
        cells[4] = { v: String(it.unit || ''), st: ist(4) };
        cells[5] = { v: num(it.rate), st: ist(5) };
        cells[6] = { f: 'IF(F' + rr + '="",0,IF(D' + rr + '="",F' + rr + ',D' + rr + '*F' + rr + '))', st: ist(6) };
        cells[7] = { v: num(it.aQty), st: ist(7) };
        cells[8] = { v: num(it.aRate), st: ist(8) };
        cells[9] = { f: 'IF(I' + rr + '="",0,IF(H' + rr + '="",I' + rr + ',H' + rr + '*I' + rr + '))', st: ist(9) };
        cells[10] = { f: 'G' + rr + '-J' + rr, st: ist(10) };
        cells[11] = { v: String(it.bhpComments || ''), st: ist(11) };
        ir[rr] = cells;
      });
      var lastItem = items.length ? g.last : g.first;
      function totCells(label, col) {
        var c = new Array(XITEM.length).fill(null);
        c[5] = { v: label, st: { bold: 1, hal: 'right' } };
        c[6] = { f: 'SUM(' + col + g.first + ':' + col + lastItem + ')', st: { nf: X_CUR, bold: 1, border: 1 } };
        return c;
      }
      ir[g.tClaim] = totCells('Total Claimed', 'G');
      ir[g.tAssess] = totCells('Total Assessed', 'J');
      ir[g.tDiff] = totCells('Total Difference', 'K');
      return {
        name: sn,
        cols: XITEM.map(function (c) { return c ? { w: Math.max(6, (S.icols[c.k] ? S.icols[c.k].w : ICOLDEF[c.k].w) / 6.6), hidden: !!(c && S.icols[c.k] && !S.icols[c.k].show) } : { w: 2.5 }; }),
        merges: ['B2:L2', 'B5:B6', 'C5:C6', 'E5:E6', 'F5:F6', 'G5:G6', 'H5:H6', 'I5:I6', 'J5:J6', 'K5:K6', 'L5:L6'],
        freeze: { row: 6, col: 2 },
        rows: ir, rowH: { 5: 30 }
      };
    });

    return { sheets: [regSheet].concat(itemSheets), geo: geo };
  }

  function exportExcel() {
    try {
      var data = buildWorkbook(buildVarSpec());
      var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'Variation_Register_' + CFG.mpsProjectNo + '_' + new Date().toISOString().slice(0, 10) + '.xlsx';
      document.documentElement.appendChild(a); a.click(); a.remove();
      toast('Exported ' + (S.filtered.length ? S.filtered.length : S.allRows.length) + ' VOs and ' + sheetOrder().length + ' assessment sheet(s) with live formulas');
    } catch (e) { alert('Export failed: ' + e); }
  }

  /* ---- boot ---- */
  function boot() {
    ensureShell(); host.style.display = 'block';
    if (!S.allRows.length) { initRows(); if (ghToken()) ghLoad().then(function () { if (!S.activeSheet || !S.sheets[S.activeSheet]) S.activeSheet = sheetOrder()[0] || ''; applyScope(); renderAll(); }); }
    applyScope(); renderAll();
  }
  function close() { if (host) host.style.display = 'none'; }
  window.__MPS_ACONEX_VAR = { __live: true, boot: boot, close: close, _state: S, _cfg: CFG,
    buildWorkbook: buildWorkbook, buildVarSpec: buildVarSpec, exportExcel: exportExcel, fetchRefList: fetchRefList };
  boot();
})();
