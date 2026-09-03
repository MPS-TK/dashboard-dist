/* =====================================================================
 * MPS GROUP — Aconex Register Dashboard (RFI / TQ module) v1
 * Mirrors the Doc. Registers (ITP) tab: same shell, toolbar, sliders,
 * dropdowns, per-column filters, colour pills, colour-scheme palettes,
 * Fonts/Dark Mode, GitHub team sync and native .xlsx export.
 * Tailored to the MPS RFI/TQ Register: RFI/TQ No. (manual designated
 * number), Aconex Reference No, Sender, Date Sent, Date Response
 * Required, Follow up 1/2, Date Response Received, Extension of Time,
 * Description, Cost Variation, Closed, Comments — plus auto Days Since
 * Submission / Days Since Last Response and a single Open vs Closed chart.
 * Aconex-derived fields are cross-checked against the Request For
 * Information, Technical Query, Response to RFI and Response to
 * Technical Query mail types.
 * ===================================================================== */
(function () {
  'use strict';
  if (window.__MPS_ACONEX_RFI && window.__MPS_ACONEX_RFI.__live) { window.__MPS_ACONEX_RFI.boot(); return; }

  var NAVY='#0B2A4A', NAVY2='#123a63', ACCENT='#F26522', LINE='#dfe4ea', INK='#1f2d3d';
  var VERSION='v12.11', BUILD_DATE='4 Sep 2026';
  var UI_FONTS=['Segoe UI','Arial','Calibri','Helvetica','Roboto','Verdana','Tahoma','Trebuchet MS','Georgia','Times New Roman','Courier New','system-ui'];
  var DEF_FONT='"Segoe UI",Arial,sans-serif', DEF_BASEPX=13;
  function fontStack(f){return f?('"'+f+'","Segoe UI",Arial,sans-serif'):DEF_FONT;}
  // Status workflow — drives the Status column dropdown and the CHART. Add more via the 🎨 palette or the dropdown.
  var STATUS_WORKFLOW=['Draft','Open','Response','MPS to Review','Response2','MPS to Review2','Response3','Closed'];
  var CLOSED_COLORS={'draft':'#ffffff','open':'#fade00','response':'#e0a800','mps to review':'#39d55e','response2':'#e05a1c','mps to review2':'#1a6f2e','response3':'#d93025','closed':'#1855cc','yes':'#1e7e34','no':ACCENT};
  var CLOSED_DISPLAY={'yes':'Closed','no':'Open'};
  // Yes/No columns (Extension of Time, Cost Variation): Yes = red, No = grey.
  var YESNO_COLORS={'yes':'#c0392b','no':'#8a939b'};var COSTVAR_COLORS={'yes':'#f26522','no':'#8a939b'};
  // Sender pill colours.
  var SENDER_COLORS={'mps':NAVY,'bhp':ACCENT};
  var YESNO_OPTS=['','Yes','No'];

  var CFG={projectId:detectProjectId(),projectName:'Olympic Dam Airport Upgrade',mpsProjectNo:'73409',workPackage:'9100079251'};
  function detectProjectId(){try{var m=(document.documentElement.innerHTML||'').match(/projectId["'=:\s]+(\d{10,})/);if(m)return m[1];}catch(e){}return '';}
  // Default Aconex project to cross-check against (CNPI CUSA — where the MPSBE-RFI / BHPCSAMP-RFI mails live).
  var DEFAULT_XPID='2013294019', DEFAULT_XNAME='Construction Non Process Infrastructure Cu SA Growth Prgm';

  // ---- seed register (from the MPS RFI/TQ Register workbook) ----
  var SEED=[{"rfiNo":1,"aconexRef":"MPSBE-RFI-000006","sender":"MPS","dateSent":"2026-04-03","dateRespReq":"2026-04-08","followUp1":"2026-04-16","followUp2":"2026-04-21","dateRespRecd":"2026-04-21","eot":"No","description":"IFC drawings and DWG files for fabrication","costVar":"No","closed":"Yes","comments":""},{"rfiNo":2,"aconexRef":"MPSBE-RFI-000007","sender":"MPS","dateSent":"2026-04-07","dateRespReq":"2026-04-12","followUp1":"2026-04-16","followUp2":"","dateRespRecd":"2026-05-15","eot":"No","description":"Site Facilities (Carpark 4) DB","costVar":"No","closed":"Yes","comments":""},{"rfiNo":3,"aconexRef":"MPSBE-RFI-000008","sender":"MPS","dateSent":"2026-04-07","dateRespReq":"2026-04-08","followUp1":"","followUp2":"","dateRespRecd":"2026-04-09","eot":"No","description":"LUP Number","costVar":"No","closed":"Yes","comments":""},{"rfiNo":4,"aconexRef":"BHPCSAMP-RFI-000168","sender":"BHP","dateSent":"2026-04-08","dateRespReq":"2026-04-14","followUp1":"2026-04-14","followUp2":"2026-04-20","dateRespRecd":"2026-04-30","eot":"No","description":"Structural Design Change (T14/TM-TL)","costVar":"No","closed":"Yes","comments":""},{"rfiNo":5,"aconexRef":"MPSBE-RFI-000009","sender":"MPS","dateSent":"2026-04-10","dateRespReq":"2026-04-14","followUp1":"","followUp2":"","dateRespRecd":"2026-04-15","eot":"No","description":"Electrical cable size TQ","costVar":"No","closed":"Yes","comments":""},{"rfiNo":6,"aconexRef":"MPSBE-RFI-000010","sender":"MPS","dateSent":"2026-04-15","dateRespReq":"2026-04-22","followUp1":"","followUp2":"","dateRespRecd":"2026-04-29","eot":"No","description":"Phase 1 Drawings Conflicts/Omissions","costVar":"No","closed":"Yes","comments":""},{"rfiNo":7,"aconexRef":"MPSBE-RFI-000011","sender":"MPS","dateSent":"2026-04-19","dateRespReq":"2026-04-22","followUp1":"","followUp2":"","dateRespRecd":"2026-04-20","eot":"No","description":"Asset List for CCMS Upload Template & Ordering Purposes","costVar":"No","closed":"Yes","comments":""},{"rfiNo":8,"aconexRef":"MPSBE-RFI-000012","sender":"MPS","dateSent":"2026-04-20","dateRespReq":"2026-04-23","followUp1":"2026-04-29","followUp2":"","dateRespRecd":"2026-04-30","eot":"No","description":"Asset List for CCMS Upload Template & Ordering Purposes","costVar":"No","closed":"Yes","comments":""},{"rfiNo":9,"aconexRef":"MPSBE-RFI-000014","sender":"MPS","dateSent":"2026-04-22","dateRespReq":"2026-04-27","followUp1":"","followUp2":"","dateRespRecd":"2026-06-02","eot":"No","description":"Submission of ITPs for Phases 1,2 and 3-","costVar":"No","closed":"Yes","comments":"LH replied 17/6 to amend"},{"rfiNo":10,"aconexRef":"MPSBE-TECHQ-000010","sender":"MPS","dateSent":"2026-04-29","dateRespReq":"2026-05-06","followUp1":"","followUp2":"","dateRespRecd":"2026-04-30","eot":"No","description":"RFI Phase 2/3 Drawings Conflicts/Omissions","costVar":"No","closed":"Yes","comments":""},{"rfiNo":11,"aconexRef":"BHPCSAMP-RFI-000193","sender":"BHP","dateSent":"2026-04-30","dateRespReq":"2026-05-01","followUp1":"","followUp2":"","dateRespRecd":"2026-05-08","eot":"No","description":"MPS Deliverables Register","costVar":"No","closed":"Yes","comments":""},{"rfiNo":12,"aconexRef":"BHPCSAMP-RFI-000196","sender":"BHP","dateSent":"2026-05-04","dateRespReq":"2026-05-04","followUp1":"","followUp2":"","dateRespRecd":"2026-05-30","eot":"No","description":"Temporary Baggage Reclaim Area - Surface Prep","costVar":"No","closed":"Yes","comments":""},{"rfiNo":13,"aconexRef":"MPSBE-RFI-000017","sender":"MPS","dateSent":"2026-05-08","dateRespReq":"2026-05-15","followUp1":"","followUp2":"","dateRespRecd":"2026-05-15","eot":"No","description":"Phase 1 Compaction Testing Frequency","costVar":"No","closed":"Yes","comments":""},{"rfiNo":14,"aconexRef":"MPSBE-RFI-000018","sender":"MPS","dateSent":"2026-05-08","dateRespReq":"2026-05-15","followUp1":"","followUp2":"","dateRespRecd":"2026-05-13","eot":"No","description":"Bollard Fixings","costVar":"No","closed":"Yes","comments":""},{"rfiNo":15,"aconexRef":"MPSBE-RFI-000019","sender":"MPS","dateSent":"2026-05-08","dateRespReq":"2026-05-15","followUp1":"","followUp2":"","dateRespRecd":"2026-05-18","eot":"No","description":"Existing Stormwater Pit RL","costVar":"No","closed":"Yes","comments":""},{"rfiNo":16,"aconexRef":"BHPCSAMP-RFI-000206","sender":"BHP","dateSent":"2026-05-08","dateRespReq":"2026-05-11","followUp1":"","followUp2":"","dateRespRecd":"2026-05-12","eot":"No","description":"Airport Conveyor","costVar":"No","closed":"Yes","comments":""},{"rfiNo":17,"aconexRef":"MPSBE-RFI-000020","sender":"MPS","dateSent":"2026-05-11","dateRespReq":"2026-05-18","followUp1":"","followUp2":"","dateRespRecd":"2026-05-15","eot":"No","description":"Concrete Finish Requirements","costVar":"No","closed":"Yes","comments":""},{"rfiNo":18,"aconexRef":"MPSBE-RFI-000022","sender":"MPS","dateSent":"2026-05-14","dateRespReq":"2026-05-21","followUp1":"","followUp2":"","dateRespRecd":"2026-05-19","eot":"No","description":"Electrical Drawing Clarifications","costVar":"","closed":"Yes","comments":""},{"rfiNo":19,"aconexRef":"MPSBE-RFI-000024","sender":"MPS","dateSent":"2026-05-15","dateRespReq":"2026-05-15","followUp1":"","followUp2":"","dateRespRecd":"2026-05-15","eot":"No","description":"Electrical Scope - AS/NZS 3000","costVar":"No","closed":"Yes","comments":""},{"rfiNo":20,"aconexRef":"MPSBE-RFI-000025","sender":"MPS","dateSent":"2026-05-15","dateRespReq":"2026-05-20","followUp1":"","followUp2":"","dateRespRecd":"2026-05-15","eot":"No","description":"3150DB0037 General Arrangement","costVar":"","closed":"Yes","comments":""},{"rfiNo":21,"aconexRef":"BHPCSAMP-RFI-000228","sender":"BHP","dateSent":"2026-05-19","dateRespReq":"2026-05-26","followUp1":"","followUp2":"","dateRespRecd":"N/A","eot":"No","description":"Stage 2 Building Rules Consent - Modular Buildings","costVar":"No","closed":"Yes","comments":"Will be receivied once IFC confirmed"},{"rfiNo":22,"aconexRef":"MPSBE-RFI-000026","sender":"MPS","dateSent":"2026-05-22","dateRespReq":"2026-05-26","followUp1":"","followUp2":"","dateRespRecd":"2026-06-02","eot":"","description":"Phase 1 - Services Not Shown on Drawings","costVar":"Yes","closed":"Yes","comments":"RFI#32 (BHPCSAMP-RFI-000269) to supersede"},{"rfiNo":23,"aconexRef":"MPSBE-RFI-000027","sender":"MPS","dateSent":"2026-05-25","dateRespReq":"2026-05-31","followUp1":"","followUp2":"","dateRespRecd":"2026-05-26","eot":"No","description":"Modular Buildings - Finished Flooring Colours","costVar":"No","closed":"Yes","comments":""},{"rfiNo":24,"aconexRef":"MPSBE-RFI-000028","sender":"MPS","dateSent":"2026-05-25","dateRespReq":"2026-05-31","followUp1":"","followUp2":"","dateRespRecd":"2026-06-09","eot":"No","description":"CDRL Line items","costVar":"No","closed":"Yes","comments":""},{"rfiNo":25,"aconexRef":"MPSBE-RFI-000031","sender":"MPS","dateSent":"2026-05-28","dateRespReq":"2026-06-04","followUp1":"","followUp2":"","dateRespRecd":"2026-06-02","eot":"No","description":"Wall Bracing (RB30) Fixing Position","costVar":"No","closed":"Yes","comments":""},{"rfiNo":26,"aconexRef":"MPSBE-RFI-000030","sender":"MPS","dateSent":"2026-05-28","dateRespReq":"2026-06-04","followUp1":"","followUp2":"","dateRespRecd":"2026-06-04","eot":"No","description":"Structural Footing Baseplate Fixings","costVar":"","closed":"Yes","comments":""},{"rfiNo":27,"aconexRef":"BHPCSAMP-RFI-000247","sender":"BHP","dateSent":"2026-06-02","dateRespReq":"2026-06-02","followUp1":"","followUp2":"","dateRespRecd":"2026-06-08","eot":"No","description":"Phase 1 Hoarding Arrangement","costVar":"No","closed":"Yes","comments":"BHP to close out if answer accepted"},{"rfiNo":28,"aconexRef":"MPSBE-RFI-000032","sender":"MPS","dateSent":"2026-06-04","dateRespReq":"2026-06-05","followUp1":"","followUp2":"","dateRespRecd":"2026-06-05","eot":"No","description":"Structural Steel Shop Drawings (Drawing Reference & RL Check)","costVar":"No","closed":"Yes","comments":""},{"rfiNo":29,"aconexRef":"MPSBE-RFI-000034","sender":"MPS","dateSent":"2026-06-04","dateRespReq":"2026-06-10","followUp1":"","followUp2":"","dateRespRecd":"2026-06-05","eot":"No","description":"Pad Footing Blinding Thickness","costVar":"No","closed":"Yes","comments":""},{"rfiNo":30,"aconexRef":"MPSBE-RFI-000035","sender":"MPS","dateSent":"2026-06-04","dateRespReq":"2026-06-11","followUp1":"","followUp2":"","dateRespRecd":"2026-06-05","eot":"No","description":"STK-310-01 & SOG Reinforcement Interface","costVar":"No","closed":"Yes","comments":""},{"rfiNo":31,"aconexRef":"MPSBE-RFI-000037","sender":"MPS","dateSent":"2026-06-08","dateRespReq":"2026-06-12","followUp1":"","followUp2":"","dateRespRecd":"2026-06-08","eot":"No","description":"Missing ODE3150-8-0065 Drawing","costVar":"No","closed":"Yes","comments":""},{"rfiNo":32,"aconexRef":"BHPCSAMP-RFI-000269","sender":"BHP","dateSent":"2026-06-09","dateRespReq":"2026-06-12","followUp1":"","followUp2":"","dateRespRecd":"2026-06-12","eot":"","description":"Services under new slab","costVar":"","closed":"Yes","comments":"BHP to review MPS' proposal and provide acceptance/comments"},{"rfiNo":33,"aconexRef":"MPSBE-RFI-000038","sender":"MPS","dateSent":"2026-06-09","dateRespReq":"2026-06-16","followUp1":"","followUp2":"","dateRespRecd":"2026-06-12","eot":"No","description":"Concrete Placement, Formwork Strip & Subbase Compaction Timing","costVar":"","closed":"Yes","comments":""},{"rfiNo":34,"aconexRef":"MPSBE-RFI-000039","sender":"MPS","dateSent":"2026-06-10","dateRespReq":"2026-06-12","followUp1":"","followUp2":"","dateRespRecd":"2026-06-12","eot":"","description":"Lift Pad Footings","costVar":"","closed":"Yes","comments":""},{"rfiNo":35,"aconexRef":"MPSBE-RFI-000040","sender":"MPS","dateSent":"2026-06-11","dateRespReq":"2026-06-15","followUp1":"","followUp2":"","dateRespRecd":"2026-06-17","eot":"","description":"Sliding Door Structural Clash & Slab Fall","costVar":"","closed":"Yes","comments":""},{"rfiNo":36,"aconexRef":"MPSBE-RFI-000041","sender":"MPS","dateSent":"2026-06-16","dateRespReq":"2026-06-23","followUp1":"","followUp2":"","dateRespRecd":"2026-06-22","eot":"","description":"Gridline TM and TL Concrete Cut Position","costVar":"","closed":"Yes","comments":""},{"rfiNo":37,"aconexRef":"MPSBE-RFI-000042","sender":"MPS","dateSent":"2026-06-17","dateRespReq":"2026-06-24","followUp1":"","followUp2":"","dateRespRecd":"2026-06-22","eot":"","description":"Material Testing & Trench Backfill Detail","costVar":"","closed":"Yes","comments":""},{"rfiNo":38,"aconexRef":"MPSBE-RFI-000043","sender":"MPS","dateSent":"2026-06-22","dateRespReq":"2026-06-26","followUp1":"","followUp2":"","dateRespRecd":"2026-07-07","eot":"No","description":"Blinding Thickness for other areas","costVar":"Yes","closed":"Yes","comments":"MPS replied back for clarification on bearing pressure testing. Refer RFI-000048"},{"rfiNo":39,"aconexRef":"MPSBE-RFI-000044","sender":"MPS","dateSent":"2026-06-22","dateRespReq":"2026-06-24","followUp1":"","followUp2":"","dateRespRecd":"2026-06-23","eot":"","description":"Grid T14-TS - MV & Existing Footing Clash","costVar":"","closed":"Yes","comments":""},{"rfiNo":40,"aconexRef":"MPSBE-RFI-000045","sender":"MPS","dateSent":"2026-06-22","dateRespReq":"2026-06-26","followUp1":"","followUp2":"","dateRespRecd":"2026-06-30","eot":"","description":"300 Drain PF5 Clash","costVar":"","closed":"Yes","comments":""},{"rfiNo":41,"aconexRef":"MPSBE-RFI-000046","sender":"MPS","dateSent":"2026-06-23","dateRespReq":"2026-06-26","followUp1":"","followUp2":"","dateRespRecd":"2026-06-25","eot":"","description":"SOG125 Downpipe Interface","costVar":"","closed":"Yes","comments":""},{"rfiNo":42,"aconexRef":"MPSBE-RFI-000047","sender":"MPS","dateSent":"2026-06-23","dateRespReq":"2026-06-26","followUp1":"","followUp2":"","dateRespRecd":"2026-06-30","eot":"","description":"Ausco Design Clarifications/Discrepancies","costVar":"","closed":"Yes","comments":""},{"rfiNo":43,"aconexRef":"MPSBE-RFI-000048","sender":"MPS","dateSent":"2026-06-23","dateRespReq":"2026-06-26","followUp1":"","followUp2":"","dateRespRecd":"2026-07-09","eot":"","description":"Blinding Thickness for other areas","costVar":"","closed":"Yes","comments":"Continuation from RFI-000043"},{"rfiNo":44,"aconexRef":"MPSBE-RFI-000049","sender":"MPS","dateSent":"2026-06-24","dateRespReq":"2026-06-26","followUp1":"","followUp2":"","dateRespRecd":"2026-06-25","eot":"","description":"Structural Paint Code and Specification","costVar":"","closed":"Yes","comments":""},{"rfiNo":45,"aconexRef":"MPSBE-RFI-000050","sender":"MPS","dateSent":"2026-06-30","dateRespReq":"2026-07-03","followUp1":"","followUp2":"","dateRespRecd":"2026-07-09","eot":"","description":"North Under Slab Downpipe Position","costVar":"","closed":"Yes","comments":""},{"rfiNo":46,"aconexRef":"MPSBE-RFI-000051","sender":"MPS","dateSent":"2026-06-30","dateRespReq":"2026-07-03","followUp1":"","followUp2":"","dateRespRecd":"2026-07-02","eot":"","description":"New Precast JP - Position & Backfill","costVar":"","closed":"Yes","comments":""},{"rfiNo":47,"aconexRef":"MPSBE-RFI-000052","sender":"MPS","dateSent":"2026-07-01","dateRespReq":"2026-07-06","followUp1":"","followUp2":"","dateRespRecd":"2026-07-09","eot":"","description":"Phase 1 - Column Cutout Sizing","costVar":"redline","closed":"Yes","comments":""},{"rfiNo":48,"aconexRef":"MPSBE-RFI-000053","sender":"MPS","dateSent":"2026-07-02","dateRespReq":"2026-07-08","followUp1":"","followUp2":"","dateRespRecd":"2026-07-21","eot":"","description":"Electrical Precast Pit Riser Methodology","costVar":"","closed":"Yes","comments":"Initial response 15/7"},{"rfiNo":49,"aconexRef":"MPSBE-RFI-000054","sender":"MPS","dateSent":"2026-07-03","dateRespReq":"2026-07-08","followUp1":"","followUp2":"","dateRespRecd":"2026-07-07","eot":"","description":"South Departures Raked Ceiling Lighting","costVar":"","closed":"Yes","comments":""},{"rfiNo":50,"aconexRef":"MPSBE-RFI-000055","sender":"MPS","dateSent":"2026-07-03","dateRespReq":"2026-07-08","followUp1":"","followUp2":"","dateRespRecd":"2026-07-07","eot":"","description":"South Departures Bulkhead","costVar":"","closed":"Yes","comments":""},{"rfiNo":51,"aconexRef":"MPSBE-RFI-000056","sender":"MPS","dateSent":"2026-07-09","dateRespReq":"2026-07-14","followUp1":"","followUp2":"","dateRespRecd":"2026-07-10","eot":"","description":"Retaining Wall Depth","costVar":"","closed":"Yes","comments":""},{"rfiNo":52,"aconexRef":"MPSBE-RFI-000057","sender":"MPS","dateSent":"2026-07-09","dateRespReq":"2026-07-14","followUp1":"","followUp2":"","dateRespRecd":"2026-07-13","eot":"","description":"Amenities Walkway Retaining Wall Position","costVar":"","closed":"Yes","comments":""},{"rfiNo":53,"aconexRef":"MPSBE-RFI-000058","sender":"MPS","dateSent":"2026-07-09","dateRespReq":"2026-07-14","followUp1":"","followUp2":"","dateRespRecd":"2026-07-10","eot":"","description":"Phase 2 Concrete Demolition Extent","costVar":"","closed":"Yes","comments":""},{"rfiNo":54,"aconexRef":"MPSBE-RFI-000059","sender":"MPS","dateSent":"2026-07-10","dateRespReq":"2026-07-13","followUp1":"","followUp2":"","dateRespRecd":"2026-07-14","eot":"","description":"Phase 2 Sth Departures DP UG Connection","costVar":"","closed":"Yes","comments":""},{"rfiNo":55,"aconexRef":"MPSBE-RFI-000060","sender":"MPS","dateSent":"2026-07-14","dateRespReq":"2026-07-17","followUp1":"","followUp2":"","dateRespRecd":"2026-07-16","eot":"","description":"Arrivals Door Frame Material","costVar":"","closed":"Yes","comments":""},{"rfiNo":56,"aconexRef":"MPSBE-RFI-000061","sender":"MPS","dateSent":"2026-07-15","dateRespReq":"2026-07-20","followUp1":"","followUp2":"","dateRespRecd":"2026-07-16","eot":"","description":"Phase 1 Mechanical - EVC-01 model","costVar":"","closed":"Yes","comments":""},{"rfiNo":57,"aconexRef":"MPSBE-RFI-000062","sender":"MPS","dateSent":"2026-07-15","dateRespReq":"2026-07-20","followUp1":"","followUp2":"","dateRespRecd":"2026-07-15","eot":"","description":"C10 Welding for Fittting & Tack Welds","costVar":"","closed":"Yes","comments":""},{"rfiNo":58,"aconexRef":"MPSBE-RFI-000063","sender":"MPS","dateSent":"2026-07-16","dateRespReq":"2026-07-21","followUp1":"","followUp2":"","dateRespRecd":"2026-07-23","eot":"","description":"Onsite Welding Hold Points","costVar":"","closed":"Yes","comments":""},{"rfiNo":59,"aconexRef":"MPSBE-RFI-000064","sender":"MPS","dateSent":"2026-07-17","dateRespReq":"2026-07-20","followUp1":"","followUp2":"","dateRespRecd":"2026-07-23","eot":"","description":"Re: Onsite Welding Hold Points","costVar":"","closed":"Yes","comments":"Additional detail provided from MPSBE-RFI-000063 regarding surveillance plan"},{"rfiNo":60,"aconexRef":"BHPCSAMP-RFI-000386","sender":"BHP","dateSent":"2026-07-21","dateRespReq":"2026-07-22","followUp1":"","followUp2":"","dateRespRecd":"2026-07-21","eot":"","description":"Re: Weekly Progress Report Update (17-Jul-26)","costVar":"","closed":"Yes","comments":""},{"rfiNo":61,"aconexRef":"MPSBE-RFI-000065","sender":"MPS","dateSent":"2026-07-17","dateRespReq":"2026-07-21","followUp1":"","followUp2":"","dateRespRecd":"2026-07-21","eot":"","description":"Existing Hearing Loop Details","costVar":"","closed":"Yes","comments":""},{"rfiNo":62,"aconexRef":"MPSBE-RFI-000066","sender":"MPS","dateSent":"2026-07-22","dateRespReq":"2026-07-27","followUp1":"","followUp2":"","dateRespRecd":"","eot":"","description":"Amenities Walkway Column Anchoring","costVar":"","closed":"No","comments":""},{"rfiNo":63,"aconexRef":"MPSBE-RFI-000067","sender":"MPS","dateSent":"2026-07-23","dateRespReq":"2026-07-27","followUp1":"","followUp2":"","dateRespRecd":"2026-07-28","eot":"","description":"Re: Modular Buildings - Finished Flooring Colours","costVar":"","closed":"Yes","comments":"Continuation from MPSBE-RFI-000027"},{"rfiNo":64,"aconexRef":"BHPCSAMP-RFI-000393","sender":"BHP","dateSent":"2026-07-24","dateRespReq":"2026-07-31","followUp1":"","followUp2":"","dateRespRecd":"2026-07-31","eot":"","description":"Airport Upgrade Comms Matrix - Updated","costVar":"","closed":"No","comments":"MPS provided, BHP to close"},{"rfiNo":65,"aconexRef":"BHPCSAMP-RFI-000395","sender":"BHP","dateSent":"2026-07-25","dateRespReq":"2026-08-03","followUp1":"","followUp2":"","dateRespRecd":"","eot":"","description":"Ceiling Access Hatches","costVar":"","closed":"No","comments":"Queried 28/07"},{"rfiNo":66,"aconexRef":"MPSBE-RFI-000068","sender":"MPS","dateSent":"2026-07-28","dateRespReq":"2026-08-03","followUp1":"","followUp2":"","dateRespRecd":"2026-07-30","eot":"","description":"Clarification of Demo Scope for Existing Isolators and Socket Outlets Adjacent to Module 16","costVar":"","closed":"Yes","comments":""},{"rfiNo":67,"aconexRef":"MPSBE-RFI-000069","sender":"MPS","dateSent":"2026-07-28","dateRespReq":"2026-08-03","followUp1":"","followUp2":"","dateRespRecd":"2026-07-29","eot":"","description":"Clarification of Cable Installation Schedule","costVar":"","closed":"No","comments":""},{"rfiNo":68,"aconexRef":"MPSBE-RFI-000070","sender":"MPS","dateSent":"2026-07-28","dateRespReq":"2026-08-06","followUp1":"","followUp2":"","dateRespRecd":"2026-07-30","eot":"","description":"Re: Site Instruction 0002 - Rectification works for services clash with footings (Arrivals)","costVar":"","closed":"Yes","comments":"Agreed isolation date of 01/08 confirmed verbally"},{"rfiNo":69,"aconexRef":"BHPCSAMP-RFI-000402","sender":"BHP","dateSent":"2026-07-29","dateRespReq":"2026-08-01","followUp1":"","followUp2":"","dateRespRecd":"","eot":"","description":"Outstanding BRC documentation","costVar":"","closed":"No","comments":"Continuation from BHPCSAMP-RFI-000228 #21"},{"rfiNo":70,"aconexRef":"MPSBE-RFI-000071","sender":"MPS","dateSent":"2026-07-30","dateRespReq":"2026-08-04","followUp1":"","followUp2":"","dateRespRecd":"2026-07-30","eot":"","description":"Ausco - New Toilet Signage Heights","costVar":"","closed":"Yes","comments":""},{"rfiNo":71,"aconexRef":"MPSBE-RFI-000072","sender":"MPS","dateSent":"2026-07-30","dateRespReq":"2026-07-31","followUp1":"","followUp2":"","dateRespRecd":"2026-07-30","eot":"","description":"Clarification of Edge requrement Radius","costVar":"","closed":"Yes","comments":""},{"rfiNo":72,"aconexRef":"MPSBE-RFI-000073","sender":"MPS","dateSent":"2026-07-30","dateRespReq":"2026-08-05","followUp1":"","followUp2":"","dateRespRecd":"2026-07-30","eot":"","description":"Proposed Revised Connection Route \u2013 Water & Fire Protection Services","costVar":"","closed":"Yes","comments":""},{"rfiNo":73,"aconexRef":"MPSBE-RFI-000074","sender":"MPS","dateSent":"2026-07-30","dateRespReq":"2026-07-31","followUp1":"","followUp2":"","dateRespRecd":"2026-07-30","eot":"","description":"Batch Plant Concrete Testing","costVar":"","closed":"Yes","comments":"Approval granted for Holcim, Barhnum pending"},{"rfiNo":74,"aconexRef":"MPSBE-RFI-000075","sender":"MPS","dateSent":"2026-07-30","dateRespReq":"2026-08-04","followUp1":"","followUp2":"","dateRespRecd":"2026-08-03","eot":"","description":"Phase 2 UG Stormwater Demo","costVar":"","closed":"No","comments":"MPS further queried 4/8"},{"rfiNo":75,"aconexRef":"MPSBE-RFI-000076","sender":"MPS","dateSent":"2026-07-30","dateRespReq":"2026-08-05","followUp1":"","followUp2":"","dateRespRecd":"2026-08-03","eot":"","description":"Ausco Lumen Level Approval","costVar":"","closed":"No","comments":"MPS to review"},{"rfiNo":76,"aconexRef":"MPSBE-RFI-000077","sender":"MPS","dateSent":"2026-08-03","dateRespReq":"2026-08-06","followUp1":"","followUp2":"","dateRespRecd":"2026-08-04","eot":"","description":"Arrivals SOG125 East Extent","costVar":"","closed":"Yes","comments":""},{"rfiNo":77,"aconexRef":"MPSBE-RFI-000078","sender":"MPS","dateSent":"2026-08-04","dateRespReq":"2026-08-07","followUp1":"","followUp2":"","dateRespRecd":"","eot":"","description":"Landside Fire Hydrant Orientation","costVar":"","closed":"No","comments":""},{"rfiNo":78,"aconexRef":"MPSBE-RFI-000079","sender":"MPS","dateSent":"2026-08-04","dateRespReq":"2026-08-07","followUp1":"","followUp2":"","dateRespRecd":"","eot":"","description":"Fire Wall Foundation & Hob Scabble","costVar":"","closed":"No","comments":""},{"rfiNo":79,"aconexRef":"MPSBE-RFI-000080","sender":"MPS","dateSent":"2026-08-04","dateRespReq":"2026-08-06","followUp1":"","followUp2":"","dateRespRecd":"","eot":"","description":"SOG125 SW Pit Collar","costVar":"","closed":"No","comments":""}];/*__SEED_MARKER__*/

  // Column catalogue (label, default width, edit type, source tooltip). src=true => Aconex-derived.
  var COLDEF={
    rfiNo:{label:'RFI/TQ No.',w:100,edit:'text',tip:'MPS-designated RFI/TQ number. Manual entry — this is the register’s own sequential number, NOT held in Aconex.'},
    bhpFlag:{label:'\u2691',w:46,auto:true,tip:'Flag \u2014 more than 2 BHP responses on this RFI/TQ. Shows \u2691 and the BHP response count when greater than 2. Populated by the Aconex mail cross-check.'},
    aconexRef:{label:'Aconex Reference No',w:180,dfilter:true,tip:'SOURCE: Aconex › Mail › No. of the Request For Information / Technical Query. Used to match this row to the Aconex mail. Manual entry where no mail exists yet.'},
    sender:{label:'Sender',w:80,dfilter:true,tip:'SOURCE: Aconex › Mail › From (sending organisation) of the RFI/TQ.'},
    dateSent:{label:'Date Sent',w:105,type:'date',tip:'SOURCE: Aconex › Mail › Sent Date of the Request For Information / Technical Query.'},
    daysSinceSub:{label:'Days Since Submission',w:105,nosort:false,auto:true,tip:'AUTO — calendar days from Date Sent to today. Not entered; recalculated each time the register loads.'},
    daysToClose:{label:'Days to Close',w:95,auto:true,tip:'AUTO — calendar days from Date Sent to Date Closed (or today if still open). Closed RFIs/TQs freeze at their Date Closed.'},
    dateRespReq:{label:'Date Response Required',w:120,edit:'date',tip:'Response-required date. Taken from the RFI/TQ mail where Aconex holds one, otherwise manual entry.'},
    followUp1:{label:'Follow up Sent Date 1',w:120,edit:'date',tip:'Auto-filled from the 1st MPS follow-up correspondence sent after the RFI/TQ was issued — the earliest MPS mail in the conversation after the original. Editable to override. Click the ▾ to list the correspondence on this date.'},
    followUp2:{label:'Follow up Sent Date 2',w:120,edit:'date',tip:'Auto-filled from the 2nd MPS follow-up correspondence sent after the RFI/TQ was issued — the second MPS mail after the original. Editable to override. Click the ▾ to list the correspondence on this date.'},
    dateRespRecd:{label:'Date of Last Response',w:120,type:'date',tip:'SOURCE: Aconex › Mail › Sent Date of the matching Response to RFI / Response to Technical Query. Manual entry where no response mail exists.'},
    daysSinceResp:{label:'Days Since Last Response',w:110,auto:true,tip:'AUTO — calendar days from Date Response Received to today ( — if no response received yet). Recalculated each load.'},
    eot:{label:'E.O.T. (Y/N)',w:80,edit:'yesno',dfilter:true,tip:'Manual entry — Extension of Time (E.O.T.): does this RFI/TQ carry a claim to extend the contract completion date? Y/N. Not held in Aconex.'},
    description:{label:'Description',w:280,edit:'text',tip:'SOURCE: Aconex › Mail › Subject of the RFI/TQ (editable — refine the wording as needed).'},
    costVar:{label:'Cost Variation Y/N',w:90,edit:'yesno',dfilter:true,tip:'Manual entry — does this RFI/TQ carry a cost variation? Not held in Aconex.'},
    closed:{label:'Status',w:120,edit:'status',dfilter:true,tip:'RFI/TQ workflow status (Draft → Open → Response → MPS to Review → Response2 → MPS to Review2 → Response3 → Closed). Drives the chart. Add more statuses via the dropdown or the 🎨 palette. Not held in Aconex.'},
    dateClosed:{label:'Date Closed',w:110,edit:'date',tip:'Manual entry — date the RFI/TQ was closed out. Used with Date Sent to compute Days Open. Not held in Aconex.'},
    comments:{label:'Comments',w:240,edit:'text',tip:'Manual entry — free-text comment / tracking note. Not held in Aconex.'},
    mpsCorr:{label:'MPS Corres.',w:80,auto:true,tip:'AUTO — count of MPS mails in this RFI/TQ conversation; click to list the mail numbers. From the Aconex mail cross-check.'},
    bhpCorr:{label:'BHP Corres.',w:80,auto:true,tip:'AUTO — count of BHP mails in this RFI/TQ conversation; click to list the mail numbers. From the Aconex mail cross-check.'},
    totalCorr:{label:'Total Corres.',w:78,auto:true,tip:'AUTO — total correspondences = MPS Corres. + BHP Corres.'},
    // extras (hidden by default)
    type:{label:'Type',w:70,dfilter:true,tip:'Derived from the Aconex Reference No — RFI or TQ (Technical Query).'},
    mailNo:{label:'Aconex Mail No',w:170,tip:'SOURCE: Aconex › Mail › No. of the matched RFI/TQ mail (as found during cross-check).'},
    respMailNo:{label:'Response Mail No',w:170,tip:'SOURCE: Aconex › Mail › No. of the matched Response to RFI / Response to Technical Query.'}
  };
  var FACTORY_ORDER=['rfiNo','bhpFlag','aconexRef','type','sender','dateSent','daysSinceSub','daysToClose','dateRespReq','followUp1','followUp2','dateRespRecd','daysSinceResp','eot','description','costVar','closed','dateClosed','mpsCorr','bhpCorr','totalCorr','comments','mailNo','respMailNo'];
  var FACTORY_SHOW={rfiNo:1,bhpFlag:1,aconexRef:1,sender:1,dateSent:1,daysSinceSub:1,daysToClose:1,dateRespReq:1,followUp1:1,followUp2:1,dateRespRecd:1,daysSinceResp:1,eot:1,description:1,costVar:1,closed:1,dateClosed:1,mpsCorr:1,bhpCorr:1,totalCorr:1,comments:1,mailNo:1,respMailNo:1};
  // which fields the Aconex mail cross-check may populate (won't overwrite a manual override)
  var ACONEX_FIELDS=['aconexRef','sender','dateSent','dateRespReq','description','dateRespRecd','mailNo','respMailNo'];
  // manual-editable fields persisted as overrides / team-synced
  var MANUAL_FIELDS=['rfiNo','aconexRef','sender','dateSent','dateRespReq','followUp1','followUp2','dateRespRecd','eot','description','costVar','closed','dateClosed','comments'];

  function factoryCfg(){
    var cols={}; FACTORY_ORDER.forEach(function(k){cols[k]={show:!!FACTORY_SHOW[k],w:COLDEF[k].w};});
    return {order:FACTORY_ORDER.slice(),cols:cols,fontSize:12,rowPad:4,wrap:false,chartType:'donut',selFilters:{},chartScale:1,colorSchemes:{closed:{},sender:{},eot:{},costVar:{}},fontFamily:'',baseFont:DEF_BASEPX,darkMode:false,collapsed:{},fontScale:100,padScale:100,hpadScale:100,hdrFontSize:null,hdrMaxLines:2,statusSel:'__ALL__',typeSel:null,xProjectId:'',xProjectName:'',colPri:{},colDefW:{},colNames:{},statusList:STATUS_WORKFLOW.slice(),doScale:1,doStat:'daysOpen',doHideClosed:false,chartAutoFit:true};
  }
  var LKEY='mps_aconex_rfi_cfg_'+CFG.mpsProjectNo, DKEY='mps_aconex_rfi_defcfg_'+CFG.mpsProjectNo;
  function loadCfg(){
    try{var live=localStorage.getItem(LKEY);if(live)return mergeCfg(JSON.parse(live));}catch(e){}
    try{var d=localStorage.getItem(DKEY);if(d)return mergeCfg(JSON.parse(d));}catch(e){}
    return factoryCfg();
  }
  function mergeCfg(saved){var f=factoryCfg();var o=(saved.order||f.order).filter(function(k){return COLDEF[k];});FACTORY_ORDER.forEach(function(k){if(o.indexOf(k)<0){var fi=FACTORY_ORDER.indexOf(k),pv=fi>0?FACTORY_ORDER[fi-1]:null,pi=pv?o.indexOf(pv):-1;if(pi>=0)o.splice(pi+1,0,k);else o.push(k);}});var cols={};o.forEach(function(k){var s=(saved.cols||{})[k]||{};cols[k]={show:s.show!=null?!!s.show:!!FACTORY_SHOW[k],w:s.w||COLDEF[k].w};});return {order:o,cols:cols,fontSize:saved.fontSize||12,rowPad:(saved.rowPad!=null?saved.rowPad:4),wrap:!!saved.wrap,chartType:saved.chartType||'donut',selFilters:saved.selFilters||{},chartScale:saved.chartScale||1,colorSchemes:normSchemes(saved.colorSchemes),fontFamily:saved.fontFamily||'',baseFont:saved.baseFont||DEF_BASEPX,darkMode:!!saved.darkMode,collapsed:saved.collapsed||{},fontScale:saved.fontScale||100,padScale:saved.padScale||100,hpadScale:saved.hpadScale||100,hdrFontSize:(saved.hdrFontSize!=null?saved.hdrFontSize:null),hdrMaxLines:saved.hdrMaxLines||2,statusSel:saved.statusSel||'__ALL__',typeSel:(saved.typeSel!=null?saved.typeSel:null),xProjectId:saved.xProjectId||'',xProjectName:saved.xProjectName||'',colPri:saved.colPri||{},colDefW:saved.colDefW||{},colNames:saved.colNames||{},statusList:(saved.statusList&&saved.statusList.length?saved.statusList:STATUS_WORKFLOW.slice()),doScale:saved.doScale||1,doStat:saved.doStat||'daysOpen',doHideClosed:!!saved.doHideClosed,chartAutoFit:saved.chartAutoFit!==false};}
  function normSchemes(cs){cs=cs||{};return {closed:cs.closed||{},sender:cs.sender||{},eot:cs.eot||{},costVar:cs.costVar||{}};}
  function saveCfg(){try{localStorage.setItem(LKEY,JSON.stringify({order:S.order,cols:S.cols,fontSize:S.fontSize,rowPad:S.rowPad,wrap:S.wrap,chartType:S.chartType,selFilters:S.selFilters,chartScale:S.chartScale,colorSchemes:S.colorSchemes,fontFamily:S.fontFamily,baseFont:S.baseFont,darkMode:S.darkMode,collapsed:S.collapsed,fontScale:S.fontScale,padScale:S.padScale,hpadScale:S.hpadScale,hdrFontSize:S.hdrFontSize,hdrMaxLines:S.hdrMaxLines,statusSel:S.statusSel,typeSel:S.typeSel,xProjectId:S.xProjectId,xProjectName:S.xProjectName,colPri:S.colPri,colDefW:S.colDefW,colNames:S.colNames,statusList:S.statusList,doScale:S.doScale,doStat:S.doStat,doHideClosed:S.doHideClosed,chartAutoFit:S.chartAutoFit}));}catch(e){}}

  var C=loadCfg();
  var S={allRows:[],rows:[],filtered:[],loading:false,error:'',
         globalSearch:'',colFilters:{},sortKey:'',sortDir:1,
         order:C.order,cols:C.cols,fontSize:C.fontSize,rowPad:C.rowPad,wrap:C.wrap,
         chartType:C.chartType,selFilters:C.selFilters,chartScale:C.chartScale,colorSchemes:C.colorSchemes,
         fontFamily:C.fontFamily,baseFont:C.baseFont,darkMode:C.darkMode,collapsed:C.collapsed,fontScale:C.fontScale,padScale:C.padScale,hpadScale:C.hpadScale||100,hdrFontSize:C.hdrFontSize,hdrMaxLines:C.hdrMaxLines||2,
         statusSel:C.statusSel,typeSel:C.typeSel,colNames:C.colNames||{},statusList:(C.statusList&&C.statusList.length?C.statusList:STATUS_WORKFLOW.slice()),doScale:C.doScale||1,doStat:C.doStat||'daysOpen',doHideClosed:!!C.doHideClosed,chartAutoFit:C.chartAutoFit!==false,
         xProjectId:(C.xProjectId||detectProjectId()||DEFAULT_XPID),
         xProjectName:(C.xProjectName||((C.xProjectId&&C.xProjectId!==DEFAULT_XPID)?'':DEFAULT_XNAME)),
         projects:null,
         overrides:loadOverrides()};
  function ovKey(){return 'mps_aconex_rfi_ov_'+CFG.mpsProjectNo;}
  function loadOverrides(){try{return JSON.parse(localStorage.getItem(ovKey())||'{}');}catch(e){return {};}}
  function saveOverrides(){try{localStorage.setItem(ovKey(),JSON.stringify(S.overrides));}catch(e){}}

  // ---- GitHub team sync (shares manual edits like the ITP module) ----
  var GH={repo:'MPS-TK/ITR-Dashboard',branch:'main',path:'aconex/rfi_overrides_'+CFG.mpsProjectNo+'.json',sha:null,timer:null,state:''};
  function ghToken(){try{return localStorage.getItem('mps_gh_token')||localStorage.getItem('__itr_gh_token__')||'';}catch(e){return '';}}
  function ghHeaders(){return {Authorization:'token '+ghToken(),Accept:'application/vnd.github+json'};}
  function rowKey(r){return String(r.rfiNo||r.aconexRef||'');}
  function applyOverridesToRows(){S.allRows.forEach(function(r){var o=S.overrides[rowKey(r)]||{};MANUAL_FIELDS.forEach(function(k){if(o[k]!=null)r[k]=o[k];});});}
  function ghLoad(){if(!ghToken())return Promise.resolve(false);setSync('sync');return fetch('https://api.github.com/repos/'+GH.repo+'/contents/'+GH.path+'?ref='+GH.branch,{headers:ghHeaders()}).then(function(r){if(r.status===404){GH.sha=null;return null;}if(!r.ok)throw 0;return r.json();}).then(function(j){if(j){GH.sha=j.sha;var rem={};try{rem=JSON.parse(decodeURIComponent(escape(atob((j.content||'').replace(/\n/g,'')))));}catch(e){}S.overrides=Object.assign({},rem,S.overrides);saveOverrides();applyOverridesToRows();recomputeAuto();}setSync('ok');return true;}).catch(function(){setSync('err');return false;});}
  function ghPush(){if(!ghToken())return;setSync('save');clearTimeout(GH.timer);GH.timer=setTimeout(function(){var content=btoa(unescape(encodeURIComponent(JSON.stringify(S.overrides))));var body={message:'Aconex RFI/TQ overrides ('+CFG.projectName+')',content:content,branch:GH.branch};if(GH.sha)body.sha=GH.sha;fetch('https://api.github.com/repos/'+GH.repo+'/contents/'+GH.path,{method:'PUT',headers:ghHeaders(),body:JSON.stringify(body)}).then(function(r){return r.json();}).then(function(j){if(j&&j.content)GH.sha=j.content.sha;setSync(j&&j.content?'ok':'err');}).catch(function(){setSync('err');});},1200);}
  function setSync(st){GH.state=st;var b=root&&root.getElementById('syncbtn');if(b)b.textContent=syncLabel();}
  function syncLabel(){if(!ghToken())return '🔒 Connect Sync';return ({sync:'⟳ Syncing…',save:'⟳ Saving…',ok:'✓ Synced',err:'⚠ Sync Error'})[GH.state]||'✓ Team Sync';}
  function openSyncPanel(){var ex=root.getElementById('syncpanel');if(ex){ex.remove();return;}var panel=el('div',{id:'syncpanel',class:'panel',style:'right:12px;top:44px;min-width:250px'},[el('h4',{},[ghToken()?'Team sync connected':'Connect team sync']),el('div',{class:'muted',style:'font-size:11px;margin-bottom:6px;max-width:240px'},['Paste a GitHub token (repo scope) to share edits with your team. Stored only in this browser, on the Aconex site.'])]);var inp=el('input',{type:'password',placeholder:'ghp_…',style:'width:230px;border:1px solid #cfd8e3;border-radius:5px;padding:5px 8px'});var save=el('button',{class:'btn primary',style:'margin-top:8px',onclick:function(){var v=inp.value.trim();if(v){try{localStorage.setItem('mps_gh_token',v);}catch(e){}}panel.remove();ghLoad().then(function(){renderAll();});}},['Save & Connect']);panel.appendChild(inp);var row=el('div',{},[save]);if(ghToken())row.appendChild(el('button',{class:'btn',style:'margin-left:6px',onclick:function(){try{localStorage.removeItem('mps_gh_token');}catch(e){}panel.remove();renderAll();}},['Disconnect']));panel.appendChild(row);collapsiblePanel(panel);root.getElementById('wrap').appendChild(panel);}

  // ---- rows: build from seed + overrides, then compute auto columns ----
  function refType(ref){var s=(ref||'').toUpperCase();if(/TECHQ|-TQ-|\bTQ\b|TECHNICAL/.test(s))return 'TQ';if(/RFI/.test(s))return 'RFI';return '';}
  function restoreXData(){try{var m=JSON.parse(localStorage.getItem('mps_aconex_rfi_xdata_73409')||'null');if(!m)return;delete m.__full;S.allRows.forEach(function(r){var d=m[normRef(r.aconexRef)];if(!d)return;r._mpsMails=d.mps||[];r._bhpMails=d.bhp||[];r._autoFu1=d.fu1||'';r._autoFu2=d.fu2||'';r._refMailId=d.rid||'';r._refMailbox=d.rbox||'';r._refPid=d.pid||'';if(d.p&&!r.mailNo)r.mailNo=d.p;if(d.q&&!r.respMailNo)r.respMailNo=d.q;});}catch(e){}}
  function initRows(){
    S.allRows=SEED.map(function(d){var r={};MANUAL_FIELDS.forEach(function(k){r[k]=(d[k]!=null?d[k]:'');});r.mailNo='';r.respMailNo='';r.type=refType(r.aconexRef);return r;});
    // migrate seed Closed Y/N -> workflow Status (Yes->Closed, No/blank->Open)
    S.allRows.forEach(function(r){var c=String(r.closed||'').toLowerCase();if(c==='yes')r.closed='Closed';else if(c==='no'||c==='')r.closed='Open';});
    applyOverridesToRows();S.allRows.forEach(function(r){['eot','costVar'].forEach(function(k){var v=String(r[k]||'').trim().toLowerCase();if(v!==''&&v!=='yes'&&v!=='no')r[k]='';});});restoreXData();recomputeAuto();backfillClosedDates();
  }
  function daysBetween(iso){var t=parseISODay(iso);if(t==null)return null;return Math.round((todayDay()-t)/86400000);}
  // Days Open = calendar days from Date Sent to Date Closed (or today if still open). Same-day open/close counts as 0 (best possible response time).
  function computeDaysOpen(r){var s=parseISODay(r.dateSent);if(s==null)return null;var end;if(isClosed(r)){var c=parseISODay(r.dateClosed);if(c==null)c=parseISODay(r.dateRespRecd);end=(c==null?todayDay():c);}else{end=todayDay();}var d=Math.round((end-s)/86400000);if(d<0)d=0;return d;}
  function num(v){var n=parseFloat(v);return isNaN(n)?0:n;}
  function recomputeAuto(){S.allRows.forEach(function(r){r.type=r.type||refType(r.aconexRef);var a=daysBetween(r.dateSent);r.daysSinceSub=(a==null?'':String(a));var b=daysBetween(r.dateRespRecd);r.daysSinceRespNum=(b==null?0:b);r.daysSinceResp=(b==null?'—':(isClosed(r)?('Closed ('+b+')'):String(b)));r.daysOpen=computeDaysOpen(r);r.daysToClose=(r.daysOpen==null?'':String(r.daysOpen));var mc=(r._mpsMails?r._mpsMails.length:0),bc=(r._bhpMails?r._bhpMails.length:0);r.totalCorr=String(mc+bc);});}
  // One-time (per project) backfill: set every closed RFI/TQ's Date Closed to its Date Response Received (last response). Item 1a.
  function backfillClosedDates(){
    var KEY='rfi_closedBackfill_'+CFG.mpsProjectNo;
    try{if(localStorage.getItem(KEY))return;}catch(e){}
    var changed=false;
    S.allRows.forEach(function(r){if(isClosed(r)&&r.dateRespRecd&&r.dateClosed!==r.dateRespRecd){r.dateClosed=r.dateRespRecd;var o=S.overrides[rowKey(r)]||(S.overrides[rowKey(r)]={});o.dateClosed=r.dateRespRecd;changed=true;}});
    try{localStorage.setItem(KEY,'1');}catch(e){}
    if(changed){saveOverrides();ghPush();recomputeAuto();}
  }
  function isClosed(r){return String(r.closed||'').toLowerCase()==='closed';}
  function statusOptions(){var out=(S.statusList&&S.statusList.length?S.statusList.slice():STATUS_WORKFLOW.slice());return out;}
  function addStatus(name){name=String(name||'').trim();if(!name)return false;if(!S.statusList)S.statusList=STATUS_WORKFLOW.slice();var low=name.toLowerCase();for(var i=0;i<S.statusList.length;i++)if(S.statusList[i].toLowerCase()===low)return false;S.statusList.push(name);saveCfg();return true;}
  function colLabel(k){return (S.colNames&&S.colNames[k])||(COLDEF[k]&&COLDEF[k].label)||k;}

  function fmtDate(v){if(!v)return '';var m=String(v).match(/^(\d{4})-(\d{2})-(\d{2})/);if(m)return m[3]+'/'+m[2]+'/'+m[1];var d=new Date(v);if(isNaN(d))return v;return ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear();}
  function parseISODay(s){var m=String(s).match(/^(\d{4})-(\d{2})-(\d{2})/);if(!m)return null;return new Date(+m[1],+m[2]-1,+m[3]).getTime();}
  function todayDay(){var d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime();}
  function cellVal(row,key){if(key==='bhpFlag'){var bn=(row._bhpMails?row._bhpMails.length:0);return bn>2?('\u2691 '+bn):'';}if(key==='followUp1')return fmtDate(row.followUp1||row._autoFu1);if(key==='followUp2')return fmtDate(row.followUp2||row._autoFu2);var v=row[key];if(COLDEF[key]&&COLDEF[key].type==='date')return fmtDate(v);return v==null?'':String(v);}

  function applyScope(){
    S.rows=S.allRows.filter(function(r){
      if(S.statusSel==='__OPEN__'&&isClosed(r))return false;
      if(S.statusSel==='__CLOSED__'&&!isClosed(r))return false;
      if(S.typeSel&&S.typeSel.length&&S.typeSel.indexOf(r.type||'')<0)return false;
      return true;
    });
    applyFilters();
  }
  function applyFilters(){var g=S.globalSearch.toLowerCase();S.filtered=S.rows.filter(function(row){if(g){if(S.order.map(function(k){return cellVal(row,k);}).join(' ').toLowerCase().indexOf(g)<0)return false;}for(var k in S.colFilters){var f=(S.colFilters[k]||'').toLowerCase();if(!f)continue;if(cellVal(row,k).toLowerCase().indexOf(f)<0)return false;}for(var sk in S.selFilters){var arr=S.selFilters[sk];if(!arr)continue;if(arr.indexOf(cellVal(row,sk))<0)return false;}return true;});if(S.sortKey){var nk=(S.sortKey==='daysSinceSub'||S.sortKey==='daysSinceResp'||S.sortKey==='rfiNo'||S.sortKey==='daysToClose');S.filtered.sort(function(a,b){var x=cellVal(a,S.sortKey),y=cellVal(b,S.sortKey);if(nk){var nx=parseFloat(x),ny=parseFloat(y);if(!isNaN(nx)||!isNaN(ny)){nx=isNaN(nx)?-Infinity:nx;ny=isNaN(ny)?-Infinity:ny;return (nx-ny)*S.sortDir;}}return x<y?-S.sortDir:x>y?S.sortDir:0;});}}

  // ---- Aconex mail cross-check (item 3) ----
  var XKEY='mps_aconex_rfi_xchk_'+CFG.mpsProjectNo, __xSyncing=false;
  function loadXCache(){try{return JSON.parse(localStorage.getItem(XKEY)||'null');}catch(e){return null;}}
  function saveXCache(o){try{localStorage.setItem(XKEY,JSON.stringify(o));}catch(e){}}
  function lastXText(){var c=loadXCache();if(!c||!c.ts)return 'Mail: not cross-checked';var h=(Date.now()-c.ts)/3600000;if(h<0)h=0;return 'Cross-checked '+h.toFixed(1)+'h ago';}
  var RFI_TYPES={'request for information':'rfi','technical query':'tq'};
  var RESP_TYPES={'response to rfi':'rfi','response to technical query':'tq'};
  function normRef(s){return String(s||'').replace(/\s+/g,'').toUpperCase();}
  function refTokens(s){return (String(s||'').toUpperCase().match(/[A-Z]+-[A-Z]+-\d{3,}/g)||[]);}
  function crosscheckMail(btn){
    if(__xSyncing)return;__xSyncing=true;
    var pid=S.xProjectId||detectProjectId()||DEFAULT_XPID, orig=btn?btn.textContent:'⟳ Cross-check Aconex Mail';
    function setb(t){if(btn)btn.textContent=t;}
    (async function(){
      try{
        if(!pid){toast('Cross-check needs the Aconex project id — open this on the Aconex project first.');__xSyncing=false;setb(orig);return;}
        var rfiByRef={}, responses=[], allMails=[], done=0;
        function listUrl(box,cutoff){return '/api/projects/'+pid+'/mail?mail_box='+box+'&page_size=250&search_query='+encodeURIComponent('sentdate:[* TO '+cutoff+']');}
        async function detail(id){var rr=await fetch('/api/projects/'+pid+'/mail/'+id,{headers:{Accept:'application/xml'},credentials:'include'});var dd=new DOMParser().parseFromString(await rr.text(),'text/xml');return dd.documentElement;}
        function tx(node,sel){var n=node.querySelector(sel);return n?(n.textContent||'').trim():'';}
        async function crawl(ids){
          var idx=0,CONC=10,minDate=null;
          async function worker(){
            while(idx<ids.length){var id=ids[idx++];
              try{var rt=await detail(id);
                var sd=tx(rt,'SentDate');if(sd&&(minDate===null||sd<minDate))minDate=sd;
                var ctype=(tx(rt,'CorrespondenceType')||tx(rt,'MailType')).toLowerCase();
                var mno=tx(rt,'MailNo'), subj=tx(rt,'Subject');
                var from=tx(rt,'From Organization')||tx(rt,'SentBy Organization')||tx(rt,'From')||'';
                allMails.push({id:id,mno:mno,inref:tx(rt,'InRefToMailId'),sd:sd,subj:subj,org:(/^BHP/i.test(mno)?'BHP':/^MPS/i.test(mno)?'MPS':orgShort(from))});
                if(RFI_TYPES[ctype]||/[A-Z]+-(RFI|TECHQ|TQ)-\d/.test(normRef(mno))){
                  var key=normRef(mno);
                  if(key&&(!rfiByRef[key]||sd>rfiByRef[key].sd))rfiByRef[key]={mailNo:mno,sd:sd,subj:subj,from:orgShort(from),respReq:tx(rt,'ResponseDate')||tx(rt,'RequiredResponseDate')||''};
                } else if(RESP_TYPES[ctype]||/^RE:|response/i.test(subj)){
                  responses.push({mailNo:mno,sd:sd,subj:subj,refs:refTokens(subj).concat(refTokens(mno))});
                }
              }catch(e){}
              done++;if(done%5===0)setb('Cross-checking… '+done);
            }
          }
          var ws=[];for(var w=0;w<CONC;w++)ws.push(worker());await Promise.all(ws);
          return minDate;
        }
        setb('Cross-checking…');
        var seen={},boxes=['sentbox','inbox'];
        for(var bi=0;bi<boxes.length;bi++){var cutoff='2099-01-01';
          for(var iter=0;iter<12;iter++){
            var r=await fetch(listUrl(boxes[bi],cutoff),{headers:{Accept:'application/xml'},credentials:'include'});
            var dd=new DOMParser().parseFromString(await r.text(),'text/xml');
            var ids=Array.prototype.map.call(dd.querySelectorAll('Mail'),function(m){return m.getAttribute('MailId');}).filter(function(id){return !seen[id];});
            if(!ids.length)break;ids.forEach(function(id){seen[id]=1;});
            var minD=await crawl(ids);if(!minD)break;cutoff=minD.slice(0,10);
          }
        }
        // map each response to the latest matching RFI ref → Date Response Received
        function nsub(s){s=String(s||'').toLowerCase().trim();while(true){if(s.slice(0,3)==='re:'){s=s.slice(3).trim();continue;}if(s.slice(0,3)==='fw:'){s=s.slice(3).trim();continue;}if(s.slice(0,4)==='fwd:'){s=s.slice(4).trim();continue;}break;}return s.split(' ').filter(Boolean).join(' ');}
        var byId={},byRef={},bySubj={},kids={};
        allMails.forEach(function(m){byId[m.id]=m;var rk=normRef(m.mno);if(rk)byRef[rk]=m;var ns=nsub(m.subj);(bySubj[ns]=bySubj[ns]||[]).push(m);if(m.inref){(kids[m.inref]=kids[m.inref]||[]).push(m);}});
        function threadOf(rid){var out=[],st=[rid],vis={};while(st.length){var id2=st.pop();if(vis[id2])continue;vis[id2]=1;if(byId[id2])out.push(byId[id2]);(kids[id2]||[]).forEach(function(c){st.push(c.id);});}return out;}
        var respByRef={};
        responses.forEach(function(rp){rp.refs.forEach(function(rf){var k=normRef(rf);if(!respByRef[k]||rp.sd>respByRef[k].sd)respByRef[k]={sd:rp.sd,mailNo:rp.mailNo};});});
        // apply to rows (fill Aconex fields; never clobber an existing manual override)
        var applied=0,xData={};
        S.allRows.forEach(function(row){
          var key=normRef(row.aconexRef), ov=S.overrides[rowKey(row)]||{};
          var rfi=rfiByRef[key];
          function fill(field,val){if(val==null||val==='')return;if(ov[field]!=null&&ov[field]!=='')return;if(row[field]===val)return;row[field]=val;applied++;}
          if(rfi){fill('dateSent',(rfi.sd||'').slice(0,10));fill('description',rfi.subj);if(rfi.from)fill('sender',rfi.from);if(rfi.respReq)fill('dateRespReq',(rfi.respReq||'').slice(0,10));}
          var origin=byRef[key];
          if(origin){var seen2={},grp=[];threadOf(origin.id).forEach(function(m){if(!seen2[m.id]){seen2[m.id]=1;grp.push(m);}});(bySubj[nsub(origin.subj)]||[]).forEach(function(m){if(!seen2[m.id]){seen2[m.id]=1;grp.push(m);}});var srt=function(a,b){return a.sd<b.sd?-1:a.sd>b.sd?1:0;};var mpsAll=grp.filter(function(m){return m.org==='MPS';}).sort(srt);var bhpAll=grp.filter(function(m){return m.org==='BHP';}).sort(srt);row._mpsMails=mpsAll.map(function(m){return m.mno;});row._bhpMails=bhpAll.map(function(m){return m.mno;});var lm=mpsAll.length?mpsAll[mpsAll.length-1]:null,lb=bhpAll.length?bhpAll[bhpAll.length-1]:null;if(lm)fill('mailNo',lm.mno);if(lb)fill('respMailNo',lb.mno);var mpsResp=mpsAll.filter(function(m){return m.id!==origin.id;});row._autoFu1=mpsResp[0]?(mpsResp[0].sd||'').slice(0,10):'';row._autoFu2=mpsResp[1]?(mpsResp[1].sd||'').slice(0,10):'';row._refMailId=origin.id;row._refMailbox=(origin.org==='MPS'?5:4);row._refPid=pid;xData[key]={p:row.mailNo||'',q:row.respMailNo||'',mps:row._mpsMails,bhp:row._bhpMails,fu1:row._autoFu1,fu2:row._autoFu2,rid:row._refMailId,rbox:row._refMailbox,pid:row._refPid};try{var _cx=JSON.parse(localStorage.getItem('mps_aconex_rfi_xdata_73409')||'{}');for(var _k in xData)_cx[_k]=Object.assign(_cx[_k]||{},xData[_k]);localStorage.setItem('mps_aconex_rfi_xdata_73409',JSON.stringify(_cx));}catch(e){}}
          var rp=respByRef[key];
          if(rp){fill('dateRespRecd',(rp.sd||'').slice(0,10));}
        });
        recomputeAuto();saveXCache({ts:Date.now(),rfis:Object.keys(rfiByRef).length,resps:responses.length});
        applyScope();renderAll();
        toast('Cross-check complete — '+done+' mails scanned, '+Object.keys(rfiByRef).length+' RFI/TQ + '+responses.length+' responses, '+applied+' field(s) updated');
      }catch(e){toast('Cross-check failed: '+(e&&e.message||e));}
      __xSyncing=false;setb(orig);var lbl=root.getElementById('xsync');if(lbl)lbl.textContent=lastXText();
    })();
  }
  function orgShort(s){s=String(s||'').trim();if(/mps/i.test(s))return 'MPS';if(/bhp/i.test(s))return 'BHP';return s;}

  // ---- Aconex project selector (choose which project the cross-check queries) ----
  function fetchProjects(){
    return fetch('/api/projects',{headers:{Accept:'application/xml'},credentials:'include'}).then(function(r){return r.text();}).then(function(t){
      var d=new DOMParser().parseFromString(t,'text/xml');
      return [].slice.call(d.querySelectorAll('Project')).map(function(p){return {id:(p.getAttribute('ProjectId')||(p.querySelector('ProjectId')||{}).textContent||'').trim(),name:((p.querySelector('ProjectName')||{}).textContent||'').trim()};}).filter(function(p){return p.id;});
    });
  }
  function projectLabel(){var n=S.xProjectName||'';if(!n){if(S.xProjectId===DEFAULT_XPID)n=DEFAULT_XNAME;else n=S.xProjectId||'(none)';}return n.length>34?n.slice(0,33)+'…':n;}
  function setXProject(id,name){S.xProjectId=id;S.xProjectName=name||'';saveCfg();var lbl=root&&root.getElementById('projlbl');if(lbl)lbl.textContent=projectLabel();var x=root&&root.getElementById('xsync');if(x)x.textContent=lastXText();}
  function openProjectPanel(anchor){
    var wrapEl=root.getElementById('wrap');
    var ex=root.getElementById('projpanel');if(ex){ex.remove();return;}
    var panel=el('div',{id:'projpanel',class:'mfpanel',style:'min-width:320px;max-width:460px'});
    panel.appendChild(el('div',{class:'mfhd'},[el('span',{style:'font-weight:700;color:'+NAVY+';font-size:11px'},['Cross-check project']),el('a',{title:'Close',style:'margin-left:auto',onclick:function(){var p=root.getElementById('projpanel');if(p)p.remove();}},['✕'])]));
    panel.appendChild(el('div',{class:'muted',style:'font-size:10.5px;padding:2px 4px 4px'},['Pick the Aconex project whose RFI / TQ mails this register cross-checks against.']));
    var listWrap=el('div',{});panel.appendChild(listWrap);
    function render(list){listWrap.innerHTML='';(list||[]).forEach(function(p){
      var row=el('label',{class:'mfrow',title:p.id});
      var dot=el('span',{style:'width:9px;height:9px;border-radius:50%;flex:0 0 auto;display:inline-block;background:'+(p.id===S.xProjectId?ACCENT:'#cfd8e3')});
      row.appendChild(dot);row.appendChild(el('span',{style:'flex:1'},[p.name||p.id]));
      row.onclick=function(){setXProject(p.id,p.name);var p2=root.getElementById('projpanel');if(p2)p2.remove();toast('Cross-check project set to '+(p.name||p.id));};
      listWrap.appendChild(row);
    });}
    if(S.projects){render(S.projects);}else{listWrap.appendChild(el('div',{class:'muted',style:'font-size:11px;padding:4px'},['Loading projects…']));fetchProjects().then(function(list){S.projects=list;render(list);}).catch(function(e){listWrap.innerHTML='';listWrap.appendChild(el('div',{class:'err',style:'font-size:11px;padding:4px'},['Could not load projects: '+(e&&e.message||e)]));});}
    wrapEl.appendChild(panel);
    var ar=anchor.getBoundingClientRect(),wr=wrapEl.getBoundingClientRect();
    panel.style.left=Math.min(Math.max(4,wr.width-470),Math.max(4,ar.left-wr.left))+'px';panel.style.top=(ar.bottom-wr.top+4)+'px';
  }

  // ---- dom helpers ----
  var host,root;
  function el(tag,attrs,kids){var e=document.createElement(tag);if(attrs)for(var a in attrs){if(a==='style')e.setAttribute('style',attrs[a]);else if(a.slice(0,2)==='on')e[a]=attrs[a];else if(a==='title'||a==='draggable')e.setAttribute(a,attrs[a]);else e.setAttribute(a,attrs[a]);}(kids||[]).forEach(function(k){if(k==null)return;e.appendChild(typeof k==='string'?document.createTextNode(k):k);});return e;}
  function svgEl(t,a){var e=document.createElementNS('http://www.w3.org/2000/svg',t);for(var k in a)e.setAttribute(k,a[k]);return e;}
  function schemeGet(kind,key){var m=S.colorSchemes&&S.colorSchemes[kind];return (m&&m[key])?m[key]:null;}
  function lumFg(hex){hex=(hex||'').replace('#','');if(hex.length===3)hex=hex.replace(/(.)/g,'$1$1');var r=parseInt(hex.slice(0,2),16),g=parseInt(hex.slice(2,4),16),b=parseInt(hex.slice(4,6),16);return (0.299*r+0.587*g+0.114*b)>150?'#1f2d3d':'#ffffff';}
  function toHex6(h){h=(h||'').trim();if(/^#[0-9a-fA-F]{6}$/.test(h))return h.toLowerCase();if(/^#[0-9a-fA-F]{3}$/.test(h))return '#'+h.slice(1).replace(/(.)/g,'$1$1').toLowerCase();return '#ffffff';}
  function closedColor(v){var k=(v||'').toLowerCase();return schemeGet('closed',k)||CLOSED_COLORS[k]||'';}
  function closedDisp(v){var k=(v||'').toLowerCase();return CLOSED_DISPLAY[k]||(v||'');}
  function senderColor(v){var k=(v||'').toLowerCase();return schemeGet('sender',k)||SENDER_COLORS[k]||'#8a939b';}
  function yesnoColor(kind,v){var k=(v||'').toLowerCase();return schemeGet(kind,k)||(kind==='costVar'&&COSTVAR_COLORS[k])||YESNO_COLORS[k]||'';}
  function btn(label,tip,onclick,cls){return el('button',{class:'btn'+(cls?' '+cls:''),title:tip,onclick:onclick},[label]);}
  function colAlpha(i){var s='';i++;while(i>0){var m=(i-1)%26;s=String.fromCharCode(65+m)+s;i=Math.floor((i-1)/26);}return s;}
  function txtWidth(t,fs){var c=txtWidth._c||(txtWidth._c=document.createElement('canvas').getContext('2d'));c.font=fs+'px '+fontStack(S.fontFamily);return c.measureText(t).width;}
  function hdrHasPal(k){return k==='closed'||k==='sender'||k==='eot'||k==='costVar';}
  // Header font size — user-set (Header Settings) or the default of body+2.
  function hdrFont(){return (S.hdrFontSize!=null?S.hdrFontSize:(S.fontSize+2));}
  function hdrMaxLines(){var n=S.hdrMaxLines||2;return (n<1?1:(n>3?3:n));}
  // Minimum column width so the header (label words + a wrappable sort/palette icon-cluster) fits within the
  // configured max number of lines (1–3). The icon-cluster is one unbreakable unit that may wrap onto its own
  // line, so single-word palette columns can shrink to the word width. Binary-search the narrowest line width
  // that greedily packs all units into ≤K lines.
  function minHW(k){
    var hfs=hdrFont();
    var label=colLabel(k);
    var iconW=(COLDEF[k]&&!COLDEF[k].nosort?13:0)+(hdrHasPal(k)?17:0);
    var space=txtWidth(' ',hfs);
    var units=String(label).split(/\s+/).filter(Boolean).map(function(w){return txtWidth(w,hfs);});
    if(iconW)units.push(iconW);
    if(!units.length)units.push(iconW||10);
    var maxUnit=0,total=0;units.forEach(function(u,i){if(u>maxUnit)maxUnit=u;total+=u+(i>0?space:0);});
    var K=hdrMaxLines();
    function fits(W){var lines=1,cur=0;for(var i=0;i<units.length;i++){var u=units[i];if(u>W+0.5)return false;var add=(cur>0?space:0)+u;if(cur+add<=W+0.5){cur+=add;}else{lines++;cur=u;if(lines>K)return false;}}return true;}
    var lo=Math.ceil(maxUnit),hi=Math.ceil(total),best=hi;
    while(lo<=hi){var mid=(lo+hi)>>1;if(fits(mid)){best=mid;hi=mid-1;}else lo=mid+1;}
    return best+5;
  }
  function visKeys(){return S.order.filter(function(k){return S.cols[k]&&S.cols[k].show;});}
  // Make the STATS and CHART panel title bars (.cpanelhd) the same height — use the taller one (item 5).
  function equalizePanelHeaders(){
    var row=root&&root.querySelector('.cgrow');if(!row)return;
    var hds=[];for(var i=0;i<row.children.length;i++){var p=row.children[i];var h=p.querySelector('.cpanelhd');if(!h)continue;h.style.minHeight='';if(!p.classList.contains('coll'))hds.push(h);}
    requestAnimationFrame(function(){var mx=0;hds.forEach(function(h){if(h.offsetHeight>mx)mx=h.offsetHeight;});if(mx>0)hds.forEach(function(h){h.style.minHeight=mx+'px';});});
  }

  function ensureShell(){if(root)return;host=document.createElement('div');host.id='mps-aconex-rfi-host';host.setAttribute('style','all:initial;position:fixed;inset:0;z-index:2147483000;');document.documentElement.appendChild(host);root=host.attachShadow({mode:'open'});var st=document.createElement('style');st.textContent=CSS();root.appendChild(el('div',{id:'wrap'}));root.insertBefore(st,root.firstChild);installOutsideClose();try{window.addEventListener('resize',function(){fitRegisterHeight();equalizePanelHeaders();autoSizeChart();});}catch(e){}}
  function installOutsideClose(){
    root.addEventListener('mousedown',function(e){
      var open=Array.prototype.slice.call(root.querySelectorAll('#colpanel,#hdrpanel,#mfpanel,#cspanel,#fontpanel,#syncpanel,#typepanel,#projpanel,#enumdd,#corrdd'));
      if(!open.length)return;
      var path=e.composedPath?e.composedPath():[e.target];
      for(var i=0;i<open.length;i++){if(path.indexOf(open[i])>=0)return;}
      for(var j=0;j<path.length;j++){var el2=path[j];if(el2&&el2.classList&&(el2.classList.contains('pnltrig')||el2.classList.contains('mfbtn')||el2.classList.contains('pkgbtn')||el2.classList.contains('pal')||el2.classList.contains('enumtrig')||el2.classList.contains('corrtrig'))){return;}}
      open.forEach(function(p){p.remove();});
    },true);
  }
  function fitRegisterHeight(){
    if(!root)return;var content=root.querySelector('.content'),tw=root.querySelector('.tablewrap');if(!content||!tw)return;
    var cp=tw.parentNode;while(cp&&!(cp.classList&&cp.classList.contains('cpanel')))cp=cp.parentNode;
    if(!cp||cp.classList.contains('coll')){tw.style.height='';tw.style.maxHeight='';return;}
    var hd=cp.querySelector('.cpanelhd'),tb=cp.querySelector('.toolbar');
    var chrome=(hd?hd.offsetHeight:0)+(tb?tb.offsetHeight:0);
    var h=Math.max(180,content.clientHeight-chrome-18);
    tw.style.maxHeight='none';tw.style.height=h+'px';
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
    +'#colpanel .crow .cpri{flex:0 0 auto;width:38px;text-align:center;font-size:11px;padding:2px 3px;border:1px solid #cfd8e3;border-radius:4px;box-sizing:border-box}'+'#colpanel .crow .cwid{flex:0 0 auto;width:52px;text-align:center;font-size:11px;padding:2px 3px;border:1px solid #cfd8e3;border-radius:4px;box-sizing:border-box}'+'#colpanel .crow .cwid:disabled{opacity:.5}'+'#colpanel .crow.chead{font-size:9px;font-weight:700;letter-spacing:.4px;color:#8a939b;padding-bottom:2px;border-bottom:1px solid #eef1f4;margin-bottom:2px}'+'#colpanel .crow.chead .chl{border:0;background:none;text-align:center}'+'.dark #colpanel .crow .cpri,.dark #colpanel .crow .cwid{background:#0e1621;color:#dfe7f0;border-color:#37485e}';}

  // ---- collapsible panels ----
  function makeCPanel(id,titleText,ctlEl,bodyEl,tip,shortTitle){
    var coll=!!(S.collapsed&&S.collapsed[id]);
    var chev=el('span',{class:'cpchev',title:coll?'Expand this panel':'Roll up this panel'},[coll?'▸':'▾']);
    var ttl=el('span',{class:'cptitle',style:'cursor:pointer',title:tip||'Click to roll this panel up or down'},[coll&&shortTitle?shortTitle:titleText]);
    var hd=el('div',{class:'cpanelhd'},[chev,ttl]);
    if(ctlEl)hd.appendChild(ctlEl);
    bodyEl.classList.add('cpbody');
    var panel=el('div',{class:'cpanel'+(coll?' coll':'')},[hd,bodyEl]);
    function toggle(){var c=!panel.classList.contains('coll');panel.classList.toggle('coll',c);chev.textContent=c?'▸':'▾';chev.setAttribute('title',c?'Expand this panel':'Roll up this panel');if(shortTitle)ttl.textContent=c?shortTitle:titleText;S.collapsed=S.collapsed||{};S.collapsed[id]=c;saveCfg();fitRegisterHeight();}
    chev.onclick=toggle;ttl.onclick=toggle;
    return panel;
  }
  function collapsiblePanel(panel){var h=panel.querySelector('h4');if(!h)return panel;if(!h.querySelector('.pchev')){var chev=el('span',{class:'pchev'},['▾']);h.insertBefore(chev,h.firstChild);h.onclick=function(ev){if(ev&&ev.target&&ev.target!==h&&ev.target!==chev)return;var c=!panel.classList.contains('coll');panel.classList.toggle('coll',c);chev.textContent=c?'▸':'▾';};}return panel;}
  function applyTheme(){var w=root&&root.getElementById('wrap');if(!w)return;w.classList.toggle('dark',!!S.darkMode);w.style.fontFamily=fontStack(S.fontFamily);w.style.fontSize=(DEF_BASEPX*(S.fontScale||100)/100).toFixed(2)+'px';w.style.setProperty('--ps',String((S.padScale||100)/100));w.style.setProperty('--hp',String((S.hpadScale||100)/100));}

  function toggleFontPanel(anchor){var ex=root.getElementById('fontpanel');if(ex){ex.remove();return;}
    var wrapEl=root.getElementById('wrap');
    var panel=el('div',{id:'fontpanel',class:'panel',style:'min-width:250px'},[el('h4',{style:'cursor:default'},['Fonts'])]);
    var fam=el('select',{title:'Font family for all dashboard elements'});
    var cur=S.fontFamily||'';var oDef=el('option',{value:''},['System default']);if(!cur)oDef.selected=true;fam.appendChild(oDef);
    UI_FONTS.forEach(function(f){if(f==='Segoe UI')return;var o=el('option',{value:f},[f]);o.style.fontFamily=f;if(cur===f)o.selected=true;fam.appendChild(o);});
    fam.onchange=function(){S.fontFamily=fam.value;saveCfg();applyTheme();renderTable();};
    function sldRow(label,tip,get,set,min,max){
      var pct=el('span',{class:'fpct'},[Math.round(get())+'%']);
      var rng=el('input',{type:'range',min:String(min),max:String(max),step:'2.5',value:String(get()),class:'rng',title:tip});
      function upd(v){v=Math.round(v/2.5)*2.5;if(v<min)v=min;if(v>max)v=max;rng.value=String(v);pct.textContent=Math.round(v)+'%';set(v);}
      rng.oninput=function(){upd(+rng.value);};
      var minus=el('button',{class:'btn sq',title:'− 2.5%',onclick:function(){upd(get()-2.5);}},['−']);
      var plus=el('button',{class:'btn sq',title:'+ 2.5%',onclick:function(){upd(get()+2.5);}},['+']);
      return el('div',{class:'fontrow'},[el('label',{title:tip},[label]),el('span',{class:'sldgrp'},[minus,rng,plus]),pct]);
    }
    panel.appendChild(el('div',{class:'fontrow'},[el('label',{},['Font']),fam]));
    panel.appendChild(sldRow('Size','Font size for the whole dashboard (± 2.5%)',function(){return S.fontScale||100;},function(v){S.fontScale=v;saveCfg();applyTheme();renderTable();},60,160));
    panel.appendChild(sldRow('Padding','Vertical spacing only — row height and top/bottom padding of the panels (± 2.5%; down to 20%). Does not change left/right padding.',function(){return S.padScale||100;},function(v){S.padScale=v;saveCfg();applyTheme();renderTable();},20,200));
    panel.appendChild(sldRow('Side Padding','Left/right padding of the panels — the whitespace at the sides of the STATS / CHART / register panels (± 2.5%; down to 0%).',function(){return S.hpadScale||100;},function(v){S.hpadScale=v;saveCfg();applyTheme();renderTable();},0,200));
    panel.appendChild(el('div',{style:'margin-top:8px;display:flex;gap:6px'},[
      el('button',{class:'btn',title:'Restore default font, size and padding',onclick:function(){S.fontFamily='';S.fontScale=100;S.padScale=100;S.hpadScale=100;saveCfg();applyTheme();renderTable();var fp=root.getElementById('fontpanel');if(fp)fp.remove();toggleFontPanel(anchor);}},['Restore Default']),
      el('button',{class:'btn',title:'Save the current fonts, size, padding and view as your default',onclick:function(){setAsDefault();}},['★ Set As Default'])
    ]));
    wrapEl.appendChild(panel);
    if(anchor){var ar=anchor.getBoundingClientRect(),wr=wrapEl.getBoundingClientRect();panel.style.left=Math.min(Math.max(4,wr.width-panel.offsetWidth-8),Math.max(4,ar.left-wr.left))+'px';panel.style.top=(ar.bottom-wr.top+4)+'px';}else{panel.style.right='12px';panel.style.top='44px';}
  }

  // ---- tab cross-launch ----
  function gotoITP(){try{if(window.__MPS_ACONEX){close();window.__MPS_ACONEX.boot();return;}}catch(e){}toast('Doc. Registers module not loaded on this page.');}
  // Variations tab — lazy-loads the Variations module from the public dist (token-free);
  // falls back to the private repo with a token if the public fetch is blocked.
  function gotoVAR(){
    try{if(window.__MPS_ACONEX_VAR){close();window.__MPS_ACONEX_VAR.boot();return;}}catch(e){}
    var PUB='https://raw.githubusercontent.com/MPS-TK/dashboard-dist/main/aconex/aconex_var_dashboard.js?_='+Date.now();
    function run(s){(0,eval)(s);close();if(window.__MPS_ACONEX_VAR)window.__MPS_ACONEX_VAR.boot();}
    fetch(PUB,{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.text();}).then(run)
      .catch(function(){
        var u='https://api.github.com/repos/MPS-TK/ITR-Dashboard/contents/aconex/aconex_var_dashboard.js?ref=main';
        var h={Accept:'application/vnd.github.raw'};
        var t=(function(){try{return localStorage.getItem('mps_gh_token')||localStorage.getItem('__itr_gh_token__')||'';}catch(e){return '';}})();
        if(t)h.Authorization='token '+t;
        fetch(u,{headers:h}).then(function(r){return r.text();}).then(run)
          .catch(function(e){alert('Could not load the Variations module: '+e);});
      });
  }

  function renderAll(){
    ensureShell();var wrap=root.getElementById('wrap');wrap.innerHTML='';
    wrap.appendChild(el('div',{class:'top'},[
      (function(){var b=el('div',{class:'brand'});b.innerHTML='MPS <span>GROUP</span>';return b;})(),
      el('div',{class:'title',title:'MPS live RFI/TQ register dashboard on the Aconex platform'},['Aconex RFI / TQ Register']),
      el('div',{class:'vbadge',title:'Dashboard version · build date'},[VERSION+' · '+BUILD_DATE]),
      el('div',{class:'muted'},['· '+CFG.projectName+' · MPS '+CFG.mpsProjectNo+' · '+(S.rows.length+' of '+S.allRows.length+' entries')]),
      btn('↻ Reload','Reload the register from its saved data and recalculate the day counts',function(){initRows();applyScope();renderAll();}),
      btn('Fonts','Choose the dashboard font and base size for all elements',function(ev){toggleFontPanel(ev&&ev.currentTarget);},'pnltrig'),
      btn((S.darkMode?'☀ Light Mode':'☾ Dark Mode'),'Toggle dark mode',function(){S.darkMode=!S.darkMode;saveCfg();renderAll();}),
      (function(){selBtnEl=el('button',{class:'btn mps-open',onclick:openSelected},['🔗 Open Selected']);selBtnEl.setAttribute('disabled','disabled');selBtnEl.setAttribute('title','Tick one or more rows in the left-hand column to enable this');return selBtnEl;})(),
      btn('⟳ Cross-check Aconex Mail','Scan the Request For Information, Technical Query, Response to RFI and Response to Technical Query mails in the selected Aconex project and auto-fill the Aconex-sourced columns (matched on Aconex Reference No)',function(ev){fullScan();}),
      (function(){var b=el('button',{class:'btn pnltrig',id:'projbtn',title:'Choose which Aconex project the cross-check queries',onclick:function(){openProjectPanel(b);}},[el('span',{style:'opacity:.7'},['Project: ']),el('span',{id:'projlbl',style:'font-weight:700'},[projectLabel()]),el('span',{style:'margin-left:5px'},['▾'])]);return b;})(),
      el('span',{class:'muted',id:'xsync',style:'font-size:11px',title:'When the Aconex-sourced columns were last cross-checked against the mail module'},[lastXText()]),
      el('div',{class:'spacer'}),
      el('div',{class:'badge',title:'This dashboard is running on the Aconex platform'},['ACONEX']),
      el('button',{class:'btn pnltrig',id:'syncbtn',title:'Team sync via GitHub — share edits with the team',onclick:openSyncPanel},[syncLabel()]),
      btn('⤓ Export Excel','Download the current view as a formatted native .xlsx',exportExcel,'primary'),
      el('button',{class:'btn ghost',title:'Close the dashboard',onclick:close},['✕'])
    ]));
    // tabs — Doc. Registers links back to the ITP module; RFIs is the active tab
    wrap.appendChild(el('div',{class:'tabs'},[
      el('div',{class:'tab link',title:'Switch to the Document (ITP) registers',onclick:gotoITP},['Doc. Registers']),
      el('div',{class:'tab active',title:'RFI / TQ register'},['RFIs/TQs']),
      el('div',{class:'tab link',title:'Switch to the Variation register',onclick:gotoVAR},['Variations']),
      el('div',{class:'tab disabled',title:'Coming soon'},['Drawings'])
    ]));
    // toolbar
    var search=el('input',{type:'search',class:'search',title:'Search across all columns',placeholder:'⌕ Search RFIs / TQs…',value:S.globalSearch});search.oninput=function(){S.globalSearch=search.value;applyFilters();renderBody();renderChart();};
    var ssel=el('select',{class:'dtsel',title:'Filter the whole register by Open / Closed status'});[['__ALL__','All Statuses'],['__OPEN__','Open only'],['__CLOSED__','Closed only']].forEach(function(p){var o=el('option',{value:p[0]},[p[1]]);if(S.statusSel===p[0])o.selected=true;ssel.appendChild(o);});ssel.onchange=function(){S.statusSel=ssel.value;applyScope();renderAll();};
    var rng=el('input',{type:'range',min:'0',max:'12',value:String(S.rowPad),class:'rng',title:'Row height — drag left to pack rows tightly together'});rng.oninput=function(){S.rowPad=+rng.value;saveCfg();renderBody();};
    var fontGroup=el('span',{style:'display:inline-flex;align-items:center;gap:3px',title:'Table font size'},[
      btn('−','Decrease font size',function(){S.fontSize=Math.max(8,S.fontSize-1);saveCfg();renderTable();},'sq'),
      btn('+','Increase font size',function(){S.fontSize=Math.min(20,S.fontSize+1);saveCfg();renderTable();},'sq'),
      el('span',{class:'muted',title:'Current font size',id:'fontlbl'},[S.fontSize+'px'])
    ]);
    var toolbar=el('div',{class:'toolbar'},[
      btn('⚙ Columns','Show, hide and reorder columns',function(){toggleColPanel();},'alt pnltrig'),
      btn('⚙ Header Settings','Adjust the header font size and how many lines (1–3) the headers may use',function(ev){toggleHdrPanel(ev&&ev.currentTarget);},'alt pnltrig'),
      btn('Reset Cols','Restore columns to the saved default (or factory) order, widths and visibility',function(){resetCols();}),
      btn('★ Set As Default','Save the current columns, order, widths, font and density as your default',function(){setAsDefault();}),
      btn('Expand All','Comfortable rows with word-wrap — show full cell content',function(){S.wrap=true;S.rowPad=6;saveCfg();renderTable();}),
      btn('Collapse All','Pack rows as tightly as possible',function(){S.wrap=false;S.rowPad=0;saveCfg();renderTable();}),
      btn('Optimise Widths','Auto-size every visible column to fit its content',function(){optimiseWidths();}),
      btn('Fit to 1 Page','Shrink every visible column so they all fit across the page width (still keeping headers to max 2 lines)',function(){fitOnePage();}),
      (function(){return btn((S.wrap?'☑':'☐')+' Wrap Text','Toggle word-wrapping of cell text',function(){S.wrap=!S.wrap;saveCfg();renderTable();});})(),
      fontGroup,
      el('span',{class:'muted',title:'Row height — drag the slider to pack rows tighter or looser'},['Row Density']),rng,
      el('span',{class:'dtlbl',style:'color:#0a84ff',title:'Filter by RFI or Technical Query'},['TYPE']),
      (function(){var ps=el('span',{id:'pksum'},[typeSummary()]);var b=el('button',{class:'btn pkgbtn',title:'Show only RFIs, only Technical Queries, or both',onclick:function(){openTypePanel(b);}},[ps,el('span',{style:'margin-left:5px;color:#0a84ff'},['▾'])]);return b;})(),
      el('span',{class:'dtlbl',style:'color:'+ACCENT,title:'Filter the whole register by Open / Closed status'},['STATUS']),ssel,
      search
    ]);
    var content=el('div',{class:'content'});
    // STATS (left) + CHART (right) on the same level
    var statsBody=el('div',{},[el('div',{class:'statsrow',id:'stats'}),el('div',{class:'doopen',id:'daysopen'})]);
    var statsPanel=makeCPanel('stats','STATS',null,statsBody,'Summary counts + the RFI/TQ Days Open bar chart. Click the title to roll this panel up.');
    statsPanel.classList.add('cpc');
    var chartsPanel=makeCPanel('chart','CHART',el('div',{class:'chartctl',id:'chartctl'}),el('div',{class:'charts',id:'chart'}),'Status breakdown of the current view (all statuses). Click the title to roll this panel up.','CHART');
    chartsPanel.classList.add('cpt');
    content.appendChild(el('div',{class:'cgrow'},[statsPanel,chartsPanel]));
    var regCount=el('span',{class:'ccount',id:'countlbl',style:'margin-left:auto',title:'Rows shown of the total'},[S.filtered.length+' of '+S.rows.length]);
    var regBody=el('div',{class:'regbody'},[toolbar,el('div',{class:'tablewrap'},[])]);
    content.appendChild(makeCPanel('register','REGISTER · RFI / TQ',regCount,regBody,'The register: column controls, filters, buttons and the full data grid. Click the title to roll this panel up.'));
    wrap.appendChild(content);
    applyTheme();renderStats();renderDaysOpen();renderChart();renderTable();fitRegisterHeight();equalizePanelHeaders();autoSizeChart();
  }

  function renderStats(){
    var box=root.getElementById('stats');if(!box)return;box.innerHTML='';
    var rows=S.rows,total=rows.length;
    function cnt(fn){var c=0;rows.forEach(function(r){if(fn(r))c++;});return c;}
    var closed=cnt(isClosed), open=total-closed;
    var overdue=cnt(function(r){if(isClosed(r))return false;var t=parseISODay(r.dateRespReq);return t!=null&&t<todayDay();});
    var awaiting=cnt(function(r){return !isClosed(r)&&!r.dateRespRecd;});
    var eot=cnt(function(r){return String(r.eot||'').toLowerCase()==='yes';});
    var cost=cnt(function(r){return String(r.costVar||'').toLowerCase()==='yes';});
    var pct=total?Math.round(closed/total*100):0;
    function tile(num,label,color,tip){return el('div',{class:'tile',title:tip||label},[el('b',{style:color?'color:'+color:''},[String(num)]),el('small',{},[label])]);}
    var dk=!!S.darkMode;function CC(l,d){return dk?d:l;}
    [tile(total,'Total',CC('','#eaf1f8'),'Total RFI/TQ entries in the current view'),
     tile(open,'Open',CC(ACCENT,'#f2794a'),'Status ≠ Closed'),
     tile(closed,'Closed ('+pct+'%)',CC('#1e7e34','#3ecf6a'),'Status = Closed'),
     tile(overdue,'Overdue',CC('#c0392b','#f2794a'),'Open and past the Date Response Required'),
     tile(awaiting,'Awaiting Response',CC('#e0a800','#f0c040'),'Open with no Date Response Received yet'),
     tile(eot,'E.O.T. Claims',CC('#8a5db0','#c9a3e6'),'Extension of Time = Yes'),
     tile(cost,'Cost Variations',CC('#e05a1c','#f2794a'),'Cost Variation = Yes')
    ].forEach(function(t){box.appendChild(t);});
  }
  // ---- STATS bar chart — cycles between stat types (Days Open / Days Since Last Response / Total Corres.) ----
  var STAT_DEFS=[
    {key:'daysOpen',  label:'RFI/TQ Days to Close',          unit:'day',            val:function(r){return r.daysOpen==null?0:r.daysOpen;}},
    {key:'daysSinceSub', label:'Days Since Submission', unit:'day', val:function(r){return num(r.daysSinceSub);}},
    {key:'daysResp',  label:'Days Since Last Response',  unit:'day',            val:function(r){return r.daysSinceRespNum||0;}},
    {key:'totalCorr', label:'Total Correspondences',     unit:'correspondence', val:function(r){return num(r.totalCorr);}}
  ];
  function statDef(){for(var i=0;i<STAT_DEFS.length;i++)if(STAT_DEFS[i].key===S.doStat)return STAT_DEFS[i];return STAT_DEFS[0];}
  function statExplain(k){return ({daysOpen:'Calendar days from Date Sent to Date Closed (or today if still open). Closed RFIs/TQs are grey; open ones use their Status colour.',daysSinceSub:'Calendar days from Date Sent to today, whatever the status.',daysResp:'Calendar days from Date Response Received to today (0 if no response received yet).',totalCorr:'Total correspondences on the RFI/TQ = MPS Corres. + BHP Corres.'})[k]||'';}
  // Autofit: size the bars so every item fits the panel width without a horizontal scroll.
  function autofitBars(){
    var box=root.getElementById('daysopen'),scroll=box&&box.querySelector('#doscroll');
    var avail=Math.max(200,(scroll?scroll.clientWidth:640)-6);
    var n=Math.max(1,(box&&box.__rows?box.__rows.length:S.filtered.length));
    var sc=(avail-40)/(10+26*n);                 // W ≈ 38 + sc*(10+26n); solve W≤avail
    sc=Math.max(0.2,Math.min(2.4,sc));
    S.doScale=sc;saveCfg();
    var rng=root.querySelector('.dohd input[type=range]');if(rng)rng.value=String(Math.round(sc*100));
    drawDaysOpen();
  }
  function renderDaysOpen(){
    var box=root.getElementById('daysopen');if(!box)return;box.innerHTML='';
    var rows=S.filtered.filter(function(r){return !(S.doHideClosed&&isClosed(r));}).sort(function(a,b){var x=parseFloat(a.rfiNo),y=parseFloat(b.rfiNo);if(!isNaN(x)&&!isNaN(y))return x-y;return String(a.rfiNo)<String(b.rfiNo)?-1:1;});
    var def=statDef();
    var btns=el('span',{style:'display:inline-flex;gap:5px;flex-wrap:wrap'});
    STAT_DEFS.forEach(function(sd){btns.appendChild(el('button',{class:'chip'+(S.doStat===sd.key?' active':''),title:'Show '+sd.label,onclick:function(){S.doStat=sd.key;saveCfg();renderDaysOpen();}},[sd.label]));});
    var sz=el('input',{type:'range',min:'20',max:'240',value:String(Math.round((S.doScale||1)*100)),class:'rng',style:'width:150px',title:'Resize the bars (useful when there are many RFIs/TQs)'});sz.oninput=function(){S.doScale=(+sz.value)/100;saveCfg();drawDaysOpen();};
    var hideBtn=el('button',{class:'chip'+(S.doHideClosed?' active':''),title:'Hide the closed RFIs/TQs from this chart (does not change the bar size)',onclick:function(){S.doHideClosed=!S.doHideClosed;saveCfg();renderDaysOpen();}},['Hide Closed']);var afBtn=el('button',{class:'btn sq',title:'Autofit — size the bars so every item fits the panel width',onclick:function(){autofitBars();}},['Autofit']);
    var hd=el('div',{class:'dohd'},[el('span',{class:'dotitle'},[def.label]),el('span',{class:'muted',style:'font-size:11px'},[rows.length+' item'+(rows.length===1?'':'s')]),btns,el('span',{style:'margin-left:auto;display:inline-flex;align-items:center;gap:6px'},[hideBtn,afBtn,el('span',{class:'muted',style:'font-size:11px'},['Bar Size']),sz])]);
    box.appendChild(hd);
    var exp=statExplain(def.key);if(exp)box.appendChild(el('div',{class:'muted',style:'font-size:11px;margin:0 0 5px'},['\u24d8 '+exp]));
    var scroll=el('div',{class:'doscroll',id:'doscroll'});box.appendChild(scroll);
    box.__rows=rows;
    drawDaysOpen();
  }
  function drawDaysOpen(){
    var box=root.getElementById('daysopen');if(!box)return;var scroll=box.querySelector('#doscroll');if(!scroll)return;scroll.innerHTML='';
    var rows=box.__rows||[];var dark=!!S.darkMode;var sc=S.doScale||1;var def=statDef();
    if(!rows.length){scroll.appendChild(el('div',{class:'muted',style:'font-size:11px;padding:6px'},['No RFIs/TQs in the current view.']));return;}
    var bw=Math.max(4,Math.round(16*sc)),gap=Math.max(3,Math.round(10*sc)),mL=30,mR=8,topPad=16,plotH=Math.round(150*Math.max(0.6,Math.min(1.4,sc))),botPad=64;
    var n=rows.length,W=mL+n*(bw+gap)+gap+mR,H=topPad+plotH+botPad,baseY=topPad+plotH,x0=mL+gap;
    var maxv=1;rows.forEach(function(r){var d=def.val(r);if(d>maxv)maxv=d;});
    var step=Math.max(1,Math.ceil(maxv/4));var top=step*4;var ticks=[0,step,step*2,step*3,top];
    var ink=dark?'#dfe7f0':NAVY,grid=dark?'#22303f':'#e6ebf0',axis=dark?'#3a4d64':'#cfd8e3',ylab=dark?'#8fa0b4':'#8a939b';
    var openBar=ACCENT, closedBar='#c2c9d2', openLab=dark?'#9aa8bb':'#5b6b7b', closedLab='#8a939b';
    var svg=svgEl('svg',{width:W,height:H,viewBox:'0 0 '+W+' '+H,style:'display:block'});
    ticks.forEach(function(t){var y=baseY-(t/top)*plotH;svg.appendChild(svgEl('line',{x1:mL,x2:W-mR,y1:y,y2:y,stroke:grid}));var tl=svgEl('text',{x:mL-5,y:y+3,'text-anchor':'end','font-size':'9',fill:ylab});tl.textContent=String(t);svg.appendChild(tl);});
    svg.appendChild(svgEl('line',{x1:mL,x2:mL,y1:topPad,y2:baseY,stroke:axis}));
    rows.forEach(function(r,i){
      var d=def.val(r);var h=Math.round((d/top)*plotH);var x=x0+i*(bw+gap),cx=x+bw/2;var cl=isClosed(r);
      var rect=svgEl('rect',{x:x,y:baseY-h,width:bw,height:h,rx:2,fill:cl?closedBar:(closedColor(r.closed)||openBar)});rect.style.cursor='default';
      var tt=svgEl('title',{});tt.textContent=((String(r.sender||'').toUpperCase().indexOf('BHP')>=0)?'BHP ':'')+(r.type||'RFI')+' ('+r.rfiNo+')'+' — '+d+' '+def.unit+(d===1?'':'s')+(cl?' (closed)':'')+(r.description?' · '+r.description:'');rect.appendChild(tt);svg.appendChild(rect);
      if(h>10&&bw>=12){var vl=svgEl('text',{x:cx,y:baseY-h-3,'text-anchor':'middle','font-size':Math.max(6,Math.min(10,bw)-1)+'','font-weight':'700',fill:ink});vl.textContent=String(d);svg.appendChild(vl);}
      var isB=(String(r.sender||'').toUpperCase().indexOf('BHP')>=0)||/^BHP/i.test(r.aconexRef||'');var lab=(isB?'BHP ':'')+(r.type||'RFI')+' ('+r.rfiNo+')';var fs=Math.max(7,Math.min(10,bw+2));var xl=svgEl('text',{x:cx,y:baseY+11,'text-anchor':'end','font-size':fs.toFixed(1),fill:cl?closedLab:openLab,transform:'rotate(-55 '+cx+' '+(baseY+11)+')'});if(isB){var t1b=svgEl('tspan',{fill:ACCENT,'font-weight':'700'});t1b.textContent='BHP ';xl.appendChild(t1b);var t2b=svgEl('tspan',{});t2b.textContent=lab.trim().slice(4);xl.appendChild(t2b);}else{xl.textContent=lab.trim();}if(cl)xl.setAttribute('font-weight','600');svg.appendChild(xl);
    });
    svg.appendChild(svgEl('line',{x1:mL,x2:W-mR,y1:baseY,y2:baseY,stroke:axis}));
    scroll.appendChild(svg);
  }

  // ---- the ONLY chart: Open vs Closed ----
  var CT_NEXT={donut:'bar',bar:'pie',pie:'donut'};
  var CT_LABEL={donut:'Bars',bar:'Pie Chart',pie:'Donut'};
  function renderChart(){
    var ctl=root.getElementById('chartctl');
    if(ctl){ctl.innerHTML='';
      ctl.appendChild(el('span',{class:'ccount',title:'Entries in the current view'},[String(S.rows.length)+' · RFI / TQ']));
      var nextLbl=CT_LABEL[S.chartType]||'Bars';
      ctl.appendChild(btn(nextLbl,'Switch the chart to '+nextLbl+' (cycles Donut → Bars → Pie)',function(){S.chartType=CT_NEXT[S.chartType]||'donut';saveCfg();renderChart();},'chart'));
      ctl.appendChild(el('span',{class:'muted',style:'font-size:11px;margin-left:4px'},['Size']));
      var sz=el('input',{type:'range',min:'70',max:'240',value:String(Math.round((S.chartScale||1)*100)),class:'rng',title:'Increase or decrease the chart size'});sz.oninput=function(){S.chartScale=(+sz.value)/100;saveCfg();renderChartBody();};
      ctl.appendChild(sz);
    }
    renderChartBody();
  }
  function statusRank(v){var i=(S.statusList||STATUS_WORKFLOW).map(function(s){return s.toLowerCase();}).indexOf(String(v||'').toLowerCase());return i<0?999:i;}
  function scCounts(){var c={};S.filtered.forEach(function(r){var k=r.closed||'—';c[k]=(c[k]||0)+1;});return c;}
  function scKeys(counts){return Object.keys(counts).sort(function(a,b){var ra=statusRank(a),rb=statusRank(b);return ra!==rb?ra-rb:(a<b?-1:a>b?1:0);});}
  function ocColor(k){return closedColor(k)||'#8a939b';}
  function autoSizeChart(){
    if(!root)return;
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      try{
        if(S._lastType===undefined){S._lastType=S.chartType;}else if(S._lastType!==S.chartType){S.chartAutoFit=true;S._lastType=S.chartType;S._afScale=null;}
        var slider=root.querySelector('.cgrow .cpt input[type=range]');
        if(S.chartAutoFit&&S._afScale!=null&&Math.abs((S.chartScale||1)-S._afScale)>0.002){S.chartAutoFit=false;saveCfg();}
        if(!S.chartAutoFit)return;
        var stats=root.querySelector('.cgrow .cpc'),cp=root.querySelector('.cgrow .cpt');
        if(!stats||!cp)return;var box=root.getElementById('chart');if(!box)return;if(cp.classList.contains('coll'))return;
        var hd=cp.querySelector('.cpanelhd');
        var sBody=stats.querySelector('.cpbody');var avail=(sBody?sBody.offsetHeight:stats.offsetHeight-(hd?hd.offsetHeight:0))-8;if(avail<90)avail=90;
        var rows=box.querySelectorAll('.chartsrow');if(!rows.length)return;var per=avail/rows.length;var as={fs:null};
        Array.prototype.forEach.call(rows,function(rw){var pc=rw.querySelector('.pchart');if(!pc)return;var title=pc.querySelector('.pctitle'),lg=pc.querySelector('.plegend'),svg=pc.querySelector('svg');if(!svg)return;var extra=(title?title.offsetHeight:0)+(lg?lg.offsetHeight:0)+14;var svgH=Math.max(70,Math.floor(per-extra));svg.removeAttribute('width');svg.removeAttribute('height');svg.style.height=svgH+'px';svg.style.width='auto';svg.style.maxWidth='100%';if(as.fs==null)as.fs=svgH/120;});
        if(as.fs!=null){S.chartScale=as.fs;S._afScale=as.fs;if(slider){var pct=Math.round(as.fs*100),mn=+slider.min||70,mx=+slider.max||220;slider.value=String(Math.max(mn,Math.min(mx,pct)));}}
      }catch(e){}
    });});
  }
  function ocChartOC(){var openN=0,closedN=0;S.filtered.forEach(function(r){if(isClosed(r))closedN++;else openN++;});var counts={},keys=[];if(openN){counts['Open']=openN;keys.push('Open');}if(closedN){counts['Closed']=closedN;keys.push('Closed');}return ocChart(counts,keys,'Open vs Closed ('+(openN+closedN)+')',toggleScopeStatus);}
  function toggleScopeStatus(k){var want=(String(k).toLowerCase()==='closed')?'__CLOSED__':'__OPEN__';S.statusSel=(S.statusSel===want)?'__ALL__':want;applyScope();renderAll();}
  function renderChartBody(){
    var box=root.getElementById('chart');if(!box)return;box.innerHTML='';
    box.appendChild(el('div',{class:'chartsrow'},[ocChart()]));
    var extra=false;S.filtered.forEach(function(r){var st=(r.closed||'').toLowerCase();if(st&&st!=='open'&&st!=='closed')extra=true;});
    if(extra){box.appendChild(el('div',{class:'chartsrow',style:'margin-top:12px;padding-top:10px;border-top:1px solid '+LINE},[ocChartOC()]));}
    autoSizeChart();
  }
  function toggleClosedFilter(v){var cur=S.selFilters.closed;if(cur&&cur.length===1&&cur[0]===v){S.selFilters.closed=null;}else{S.selFilters.closed=[v];}applyFilters();renderChart();renderTable();saveCfg();}
  function ocChart(counts,keys,titleText,clickFn){
    counts=counts||scCounts();keys=keys||scKeys(counts);clickFn=clickFn||toggleClosedFilter;var total=0;keys.forEach(function(k){total+=counts[k];});
    var wrap=el('div',{class:'pchart',title:'Status breakdown — '+total+' entr'+(total===1?'y':'ies')});
    wrap.appendChild(el('div',{class:'pctitle',style:'color:'+NAVY},[titleText||('Status ('+total+')')]));
    var sc=S.chartScale||1, dark=!!S.darkMode;
    if(S.chartType==='donut'||S.chartType==='pie'){
      var pie=S.chartType==='pie', ringBg=dark?'#111b28':'#eef2f7', ctrInk=dark?'#dfe7f0':NAVY;
      var vb=120,r=42,cx=60,cy=60,sw=10,CCirc=2*Math.PI*r,off=0;
      var svg=svgEl('svg',{width:Math.round(120*sc),height:Math.round(120*sc),viewBox:'0 0 '+vb+' '+vb});
      if(!pie){
        var gap=(total>0)?4:0;
        svg.appendChild(svgEl('circle',{cx:cx,cy:cy,r:r,fill:'none',stroke:ringBg,'stroke-width':sw}));
        keys.forEach(function(k){var frac=total?counts[k]/total:0;if(frac<=0)return;var seg=svgEl('circle',{cx:cx,cy:cy,r:r,fill:'none',stroke:ocColor(k),'stroke-width':sw,'stroke-dasharray':Math.max(0.01,frac*CCirc-gap)+' '+CCirc,transform:'rotate(-90 '+cx+' '+cy+')','stroke-dashoffset':CCirc});seg.style.transition='stroke-dashoffset 1s ease';seg.style.cursor='pointer';var tt=svgEl('title',{});tt.textContent=k+': '+counts[k];seg.appendChild(tt);seg.onclick=function(){clickFn(k);};svg.appendChild(seg);(function(so,o){requestAnimationFrame(function(){requestAnimationFrame(function(){so.setAttribute('stroke-dashoffset',(-o*CCirc));});});})(seg,off);off+=frac;});
        var lt=svgEl('text',{x:cx,y:cy+5,'text-anchor':'middle','font-size':'18','font-weight':'600',fill:ctrInk});lt.textContent=String(total);svg.appendChild(lt);
      } else {
        var pr=48,a0=-Math.PI/2;
        keys.forEach(function(k){var frac=total?counts[k]/total:0;if(frac<=0)return;var a1=a0+frac*2*Math.PI;var sh;
          if(frac>=0.9999){sh=svgEl('circle',{cx:cx,cy:cy,r:pr,fill:ocColor(k),stroke:'#fff','stroke-width':'1'});}
          else{var x1=cx+pr*Math.cos(a0),y1=cy+pr*Math.sin(a0),x2=cx+pr*Math.cos(a1),y2=cy+pr*Math.sin(a1),large=(a1-a0)>Math.PI?1:0;sh=svgEl('path',{d:'M'+cx+' '+cy+' L'+x1.toFixed(2)+' '+y1.toFixed(2)+' A'+pr+' '+pr+' 0 '+large+' 1 '+x2.toFixed(2)+' '+y2.toFixed(2)+' Z',fill:ocColor(k),stroke:'#fff','stroke-width':'1'});}
          sh.style.cursor='pointer';var tt=svgEl('title',{});tt.textContent=k+': '+counts[k];sh.appendChild(tt);sh.onclick=function(){clickFn(k);};svg.appendChild(sh);a0=a1;});
      }
      wrap.appendChild(svg);
      var lg=el('div',{class:'plegend'});
      keys.forEach(function(k){var d=el('div',{title:'Filter to '+k,onclick:function(){clickFn(k);}});var i=el('i');i.style.background=ocColor(k);d.appendChild(i);d.appendChild(document.createTextNode(k));d.appendChild(el('b',{},[String(counts[k])]));lg.appendChild(d);});
      wrap.appendChild(lg);
    } else {
      var n=Math.max(1,keys.length),bw=36,gap=26,mL=30,mR=14,topPad=18,plotH=150,botPad=70;
      var W=mL+n*(bw+gap)+gap+mR,H=topPad+plotH+botPad,baseY=topPad+plotH,x0=mL+gap;
      var bInk=dark?'#dfe7f0':NAVY,bGrid=dark?'#22303f':'#e6ebf0',bAxis=dark?'#3a4d64':'#cfd8e3',bY=dark?'#8fa0b4':'#8a939b',bX=dark?'#9aa8bb':'#5b6b7b';
      var maxv=1;keys.forEach(function(k){if(counts[k]>maxv)maxv=counts[k];});
      var top=(maxv%2===0)?maxv:maxv+1;if(top<2)top=2;var mid=top/2;
      var svg=svgEl('svg',{width:Math.round(W*sc),height:Math.round(H*sc),viewBox:'0 0 '+W+' '+H});
      [[top,topPad],[mid,baseY-plotH*(mid/top)],[0,baseY]].forEach(function(t){svg.appendChild(svgEl('line',{x1:mL,x2:W-mR,y1:t[1],y2:t[1],stroke:bGrid}));var tl=svgEl('text',{x:mL-6,y:t[1]+3,'text-anchor':'end','font-size':'10',fill:bY});tl.textContent=String(t[0]);svg.appendChild(tl);});
      svg.appendChild(svgEl('line',{x1:mL,x2:mL,y1:topPad,y2:baseY,stroke:bAxis}));
      keys.forEach(function(k,i){var h=Math.round((counts[k]/top)*plotH);var x=x0+i*(bw+gap),cxb=x+bw/2;var rect=svgEl('rect',{x:x,width:bw,rx:3,fill:ocColor(k),y:baseY,height:0});rect.style.transition='height 1s ease, y 1s ease';rect.style.cursor='pointer';var tt=svgEl('title',{});tt.textContent=k+': '+counts[k];rect.appendChild(tt);rect.onclick=function(){clickFn(k);};svg.appendChild(rect);var vl=svgEl('text',{x:cxb,y:baseY-h-6,'text-anchor':'middle','font-size':'12','font-weight':'700',fill:bInk});vl.textContent=String(counts[k]);svg.appendChild(vl);var xl=svgEl('text',{x:cxb,y:baseY+13,'text-anchor':'end','font-size':'10',fill:bX,transform:'rotate(-40 '+cxb+' '+(baseY+13)+')'});xl.textContent=(k==='—'?'(blank)':k);svg.appendChild(xl);(function(rc,hh,vlab){requestAnimationFrame(function(){requestAnimationFrame(function(){rc.setAttribute('y',baseY-hh);rc.setAttribute('height',hh);vlab.setAttribute('y',baseY-hh-6);});});})(rect,h,vl);});
      svg.appendChild(svgEl('line',{x1:mL,x2:W-mR,y1:baseY,y2:baseY,stroke:bAxis}));
      wrap.appendChild(svg);
    }
    return wrap;
  }

  // ---- multi-select persistent column filters (dfilter columns) ----
  function distinctVals(k){var vals={};S.rows.forEach(function(r){var vv=cellVal(r,k);if(vv!=='')vals[vv]=1;});return Object.keys(vals).sort();}
  function selSummary(k){var d=distinctVals(k);var sel=S.selFilters[k];if(sel==null)return 'All';if(sel.length===0)return 'None';if(sel.length>=d.length)return 'All';return sel.length+'/'+d.length;}
  function multiFilterBtn(k){var b=el('div',{class:'mfbtn',title:'Filter '+COLDEF[k].label+' — tick the values to show (persists between sessions)'},[el('span',{class:'cv'},[selSummary(k)]),el('span',{},['▾'])]);b.onclick=function(e){e.stopPropagation();openMultiFilter(k,b);};return b;}
  function openMultiFilter(k,anchor){
    var wrapEl=root.getElementById('wrap');
    var ex=root.getElementById('mfpanel');var sameK=ex&&ex.getAttribute('data-k')===k;if(ex)ex.remove();if(sameK)return;
    var d=distinctVals(k);
    var panel=el('div',{id:'mfpanel',class:'mfpanel','data-k':k});
    function curSel(){var s=S.selFilters[k];return s==null?d.slice():s.slice();}
    function setSel(arr){S.selFilters[k]=(arr.length>=d.length)?null:arr;applyFilters();renderBody();renderChart();saveCfg();var cv=anchor.querySelector('.cv');if(cv)cv.textContent=selSummary(k);}
    var listWrap=el('div',{});
    function rebuild(){listWrap.innerHTML='';var sel=curSel();d.forEach(function(v){var cb=el('input',{type:'checkbox'});cb.checked=sel.indexOf(v)>=0;cb.onchange=function(){var s=curSel();var i=s.indexOf(v);if(cb.checked){if(i<0)s.push(v);}else if(i>=0)s.splice(i,1);setSel(s);};listWrap.appendChild(el('label',{class:'mfrow'},[cb,el('span',{},[v])]));});}
    panel.appendChild(el('div',{class:'mfhd'},[
      el('a',{title:'Select all',onclick:function(){setSel(d.slice());rebuild();}},['(All)']),
      el('a',{title:'Select none',onclick:function(){setSel([]);rebuild();}},['(None)']),
      el('a',{title:'Close',style:'margin-left:auto',onclick:function(){var p=root.getElementById('mfpanel');if(p)p.remove();}},['✕'])
    ]));
    rebuild();panel.appendChild(listWrap);wrapEl.appendChild(panel);
    var ar=anchor.getBoundingClientRect(),wr=wrapEl.getBoundingClientRect();
    panel.style.left=Math.max(4,ar.left-wr.left)+'px';panel.style.top=(ar.bottom-wr.top+2)+'px';
  }
  // ---- Type (RFI / TQ) selector ----
  function distinctTypes(){var m={};S.allRows.forEach(function(r){if(r.type)m[r.type]=1;});return Object.keys(m).sort();}
  function typeSummary(){var d=distinctTypes();var sel=S.typeSel;if(sel==null||sel.length>=d.length)return 'All ('+d.length+')';if(sel.length===0)return 'None';return sel.length+' of '+d.length;}
  function openTypePanel(anchor){
    var wrapEl=root.getElementById('wrap');
    var ex=root.getElementById('typepanel');if(ex){ex.remove();return;}
    var d=distinctTypes();
    var panel=el('div',{id:'typepanel',class:'mfpanel',style:'min-width:180px'});
    function curSel(){var s=S.typeSel;return s==null?d.slice():s.slice();}
    function refreshOutputs(){applyScope();saveCfg();renderStats();renderChart();renderBody();var cl=root.getElementById('countlbl');if(cl)cl.textContent=S.filtered.length+' of '+S.rows.length;var ps=root.getElementById('pksum');if(ps)ps.textContent=typeSummary();}
    function setSel(arr){S.typeSel=(arr.length>=d.length)?null:arr;refreshOutputs();}
    var listWrap=el('div',{});
    function rebuild(){listWrap.innerHTML='';if(!d.length){listWrap.appendChild(el('div',{class:'muted',style:'font-size:11px;padding:4px'},['No RFI/TQ types detected.']));return;}var sel=curSel();d.forEach(function(v){var cb=el('input',{type:'checkbox',title:'Show '+v});cb.checked=sel.indexOf(v)>=0;cb.onchange=function(){var s=curSel();var i=s.indexOf(v);if(cb.checked){if(i<0)s.push(v);}else if(i>=0)s.splice(i,1);setSel(s);};listWrap.appendChild(el('label',{class:'mfrow'},[cb,el('span',{},[v==='TQ'?'TQ (Technical Query)':v])]));});}
    panel.appendChild(el('div',{class:'mfhd'},[el('span',{style:'font-weight:700;color:'+NAVY+';font-size:11px'},['Type']),el('a',{title:'Select all',style:'margin-left:auto',onclick:function(){setSel(d.slice());rebuild();}},['(All)']),el('a',{title:'Select none',onclick:function(){setSel([]);rebuild();}},['(None)']),el('a',{title:'Close',onclick:function(){var p=root.getElementById('typepanel');if(p)p.remove();}},['✕'])]));
    rebuild();panel.appendChild(listWrap);wrapEl.appendChild(panel);
    var ar=anchor.getBoundingClientRect(),wr=wrapEl.getBoundingClientRect();panel.style.left=Math.max(4,ar.left-wr.left)+'px';panel.style.top=(ar.bottom-wr.top+2)+'px';
  }

  // ---- per-column colour scheme editor ----
  function schemeItems(kind){
    if(kind==='closed')return statusOptions().map(function(s){return {key:s.toLowerCase(),label:s,hex:closedColor(s)||'#8a939b'};});
    return distinctVals(kind).map(function(v){var lk=v.toLowerCase();var hex=(kind==='sender'?senderColor(v):yesnoColor(kind,v)||'#8a939b');return {key:lk,label:v,hex:hex};});
  }
  function colorSchemePanel(kind,anchor){
    var wrapEl=root.getElementById('wrap');
    var ex=root.getElementById('cspanel');var same=ex&&ex.getAttribute('data-k')===kind;if(ex)ex.remove();if(same)return;
    var title=kind==='closed'?'Status':kind==='sender'?'Sender':kind==='eot'?'Extension of Time':'Cost Variation';
    var panel=el('div',{id:'cspanel',class:'mfpanel','data-k':kind,style:'min-width:210px'});
    var bodyEl=el('div',{});
    function build(){bodyEl.innerHTML='';var items=schemeItems(kind);
      if(!items.length){bodyEl.appendChild(el('div',{class:'muted',style:'font-size:11px;padding:4px'},['No values in view yet.']));}
      items.forEach(function(it){var sw=el('input',{type:'color',value:toHex6(it.hex),style:'width:28px;height:20px;border:1px solid #cfd8e3;border-radius:3px;background:none;cursor:pointer;padding:0'});sw.onchange=function(){S.colorSchemes[kind][it.key]=sw.value;saveCfg();renderBody();renderChart();};bodyEl.appendChild(el('label',{class:'mfrow'},[sw,el('span',{style:'flex:1'},[it.label])]));});
      if(kind==='closed'){
        var nc=el('input',{type:'color',value:'#1f6feb',style:'width:28px;height:20px;border:1px solid #cfd8e3;border-radius:3px;background:none;cursor:pointer;padding:0'});
        var nv=el('input',{type:'text',placeholder:'add a status…',style:'flex:1;min-width:70px;font-size:11px;padding:2px 5px;border:1px solid #cfd8e3;border-radius:4px'});
        var addB=el('a',{title:'Add this status (and colour) to the workflow',style:'font-weight:700;color:'+NAVY,onclick:function(ev){ev.preventDefault();var v=(nv.value||'').trim();if(!v)return;if(addStatus(v)){S.colorSchemes.closed[v.toLowerCase()]=nc.value;saveCfg();}renderBody();renderChart();renderTable();build();}},['+ Add']);
        bodyEl.appendChild(el('div',{class:'mfrow',style:'border-top:1px solid #e3e9f0;margin-top:4px;padding-top:5px'},[nc,nv,addB]));
      }
    }
    panel.appendChild(el('div',{class:'mfhd'},[el('span',{style:'font-weight:700;color:'+NAVY+';font-size:11px'},['Colours — '+title]),el('a',{title:'Reset to default colours',style:'margin-left:auto',onclick:function(){S.colorSchemes[kind]={};saveCfg();renderBody();renderChart();build();}},['Reset']),el('a',{title:'Close',onclick:function(){var p=root.getElementById('cspanel');if(p)p.remove();}},['✕'])]));
    build();panel.appendChild(bodyEl);wrapEl.appendChild(panel);
    var ar=anchor.getBoundingClientRect(),wr=wrapEl.getBoundingClientRect();panel.style.left=Math.min(Math.max(4,wr.width-220),Math.max(4,ar.left-wr.left))+'px';panel.style.top=(ar.bottom-wr.top+2)+'px';
  }

  // ---- row selection (left-hand tick column) + "Open Selected" (opens each in its own tab) ----
  var SELW=16, selBtnEl=null;
  function isRowSel(r){return !!(S.rowSel&&S.rowSel[rowKey(r)]);}
  function setRowSel(r,v){S.rowSel=S.rowSel||{};if(v)S.rowSel[rowKey(r)]=1;else delete S.rowSel[rowKey(r)];}
  function selRows(){return S.filtered.filter(isRowSel);}   // register order = current sort/filter order
  // Rows whose tab has already been opened this session. Ticks are NEVER cleared by
  // opening — the user wants to see afterwards what they opened — so "already opened"
  // is tracked separately and shown as a green tick. Untick a row and the mark clears,
  // so re-ticking makes it openable again.
  function isRowOpened(r){return !!(S.rowOpened&&S.rowOpened[rowKey(r)]);}
  function setRowOpened(r,v){S.rowOpened=S.rowOpened||{};if(v)S.rowOpened[rowKey(r)]=1;else delete S.rowOpened[rowKey(r)];}
  function pendingRows(){return selRows().filter(function(r){return !isRowOpened(r);});}
  function updateSelBtn(){
    var sel=selRows(), n=sel.length, pend=pendingRows().length;
    if(selBtnEl){
      selBtnEl.textContent='🔗 Open Selected'+(pend?' ('+pend+')':(n?' ✓':''));
      if(pend){selBtnEl.removeAttribute('disabled');selBtnEl.setAttribute('title','Open the '+pend+' selected RFI/TQ'+(pend===1?'':'s')+' not yet opened — each in its own new tab, in the order they appear in the register');}
      else if(n){selBtnEl.setAttribute('disabled','disabled');selBtnEl.setAttribute('title','All '+n+' selected row'+(n===1?' is':'s are')+' already open (green ticks). Untick and re-tick a row to open it again.');}
      else{selBtnEl.setAttribute('disabled','disabled');selBtnEl.setAttribute('title','Tick one or more rows in the left-hand column to enable this');}
    }
    var m=root&&root.getElementById('mps-selall');
    if(m){var t=S.filtered.length;m.checked=(t>0&&n===t);m.indeterminate=(n>0&&n<t);}
  }
  // Chrome allows only ONE new tab per click — the pop-up blocker consumes the
  // page's user activation on the first open — so a multi-select can only open in a
  // single press once pop-ups are allowed for this site. Open as many as the browser
  // permits, untick the ones that actually opened, and say plainly how to get the
  // rest; pressing again continues down the list, so every selected item does end up
  // in its own tab either way.
  function openSelected(){
    var rows=pendingRows();if(!rows.length)return;
    var todo=[],nolink=0;
    rows.forEach(function(r){var u=selLink(r);if(u)todo.push({r:r,u:u});else nolink++;});
    var got=[],blocked=0;
    for(var i=0;i<todo.length;i++){
      var w=null;try{w=window.open(todo[i].u,'_blank');}catch(e){}
      if(w){got.push(todo[i].r);}else{blocked=todo.length-i;break;}
    }
    // Mark what opened WITHOUT unticking it — the selection stays visible so the user can
    // see on return exactly what they opened. The green tick is the "already open" mark and
    // is what keeps a second press from duplicating tabs.
    if(got.length){got.forEach(function(r){setRowOpened(r,true);});renderBody();}
    var msg='Opened '+got.length+' of '+rows.length+' in new tabs.';
    if(got.length)msg+=' They stay ticked — a green tick marks each one now open.';
    if(nolink)msg+=' '+nolink+' had no Aconex link.';
    openNotice(msg,blocked);
  }
  // A toast is the little dark message that slides up at the bottom of the dashboard and
  // vanishes after ~2s. It is the wrong tool here: Chrome moves focus to the tab it just
  // opened, so the user is looking at another tab while it times out. This notice stays on
  // the dashboard until it is dismissed or the next press replaces it — so it is still
  // there when they come back.
  function openNotice(msg,n){
    var wrapEl=root.getElementById('wrap');if(!wrapEl)return;
    var ex=root.getElementById('mps-popuphelp');if(ex)ex.remove();
    var kids=[el('b',{},[msg+(n?(' Chrome blocked '+n+' pop-up'+(n===1?'':'s')+'.'):'')])];
    if(n){
      kids.push(el('span',{},[' It only lets a page open one tab per click. To open every selected item in one press: click the blocked-pop-up icon at the right of the address bar, choose “Always allow pop-ups and redirects from this site”, then press Open Selected again.']));
      kids.push(el('span',{},[' Until then, press Open Selected again for the next one. Nothing gets unticked — the green ticks are the ones already open.']));
    }
    kids.push(el('a',{title:'Dismiss this notice',onclick:function(){var b=root.getElementById('mps-popuphelp');if(b)b.remove();}},['✕']));
    wrapEl.appendChild(el('div',{id:'mps-popuphelp',class:'mps-pophelp'+(n?'':' ok')},kids));
  }
  function selLink(r){return r._refMailId?refUrl(r):'';}
  function selCellTd(row,pad){
    var open=isRowOpened(row);
    var cb=el('input',{type:'checkbox',title:open?'Already opened in a new tab — still selected. Untick to clear the mark.':'Select this RFI/TQ for “Open Selected”'});
    cb.checked=isRowSel(row);
    if(open&&cb.checked)cb.classList.add('mps-opened');
    var td=el('td',{class:'mps-selcell',style:'padding:'+pad+'px 4px'},[cb]);
    cb.onclick=function(e){e.stopPropagation();};
    cb.onchange=function(){
      setRowSel(row,cb.checked);
      if(!cb.checked){setRowOpened(row,false);cb.classList.remove('mps-opened');cb.setAttribute('title','Select this RFI/TQ for “Open Selected”');}
      var tr=td.parentNode;if(tr)tr.classList.toggle('mps-selrow',cb.checked);
      updateSelBtn();
    };
    return td;
  }
  var dragKey=null;
  function renderTable(){
    var tw=root.querySelector('.tablewrap');if(!tw)return;tw.innerHTML='';
    var fl=root.getElementById('fontlbl');if(fl)fl.textContent=S.fontSize+'px';
    if(S.error){tw.appendChild(el('div',{class:'err'},['Could not load: '+S.error]));return;}
    var table=el('table');table.style.fontSize=S.fontSize+'px';
    var thead=el('thead'),htr=el('tr',{class:'hdr'}),letr=el('tr',{class:'colletrow'});
    letr.appendChild(el('th',{class:'colc mps-selcell',title:'Selection column — tick rows here, then press “Open Selected”'},['☑']));
    (function(){var m=el('input',{type:'checkbox',id:'mps-selall',title:'Select / clear every row currently shown'});m.onchange=function(){var v=m.checked;S.filtered.forEach(function(r){setRowSel(r,v);});renderBody();};htr.appendChild(el('th',{class:'mps-selcell',style:'padding:1px 2px'},[m]));})();
    visKeys().forEach(function(k,vi){
      var cd=COLDEF[k],w=S.cols[k].w,lab=colLabel(k);
      letr.appendChild(el('th',{class:'colc',style:'width:'+w+'px;min-width:'+w+'px',title:'Column '+colAlpha(vi)+' · '+lab},[colAlpha(vi)]));
      var lbl=el('span',{class:'lbl',draggable:'true',title:cd.tip},[lab]);
      lbl.ondragstart=function(e){dragKey=k;try{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',k);}catch(_){}} ;
      lbl.ondragend=function(){dragKey=null;};
      var thKids=[lbl];var hicons=[];
      if(!cd.nosort){var srt=el('span',{class:'srt',title:'Sort by '+lab},[S.sortKey===k?(S.sortDir>0?'▲':'▼'):'↕']);srt.onclick=function(ev){ev.stopPropagation();if(S.sortKey===k)S.sortDir*=-1;else{S.sortKey=k;S.sortDir=1;}applyFilters();renderTable();};hicons.push(srt);}
      if(hdrHasPal(k)){var pal=el('span',{class:'pal',title:'Change the '+lab+' colour scheme'},['🎨']);pal.onclick=function(ev){ev.stopPropagation();colorSchemePanel(k,pal);};hicons.push(pal);}
      if(hicons.length){thKids.push(el('span',{class:'hicons'},hicons));}
      var th=el('th',{style:'width:'+w+'px;min-width:'+Math.max(w,minHW(k))+'px;padding:1px 2px;font-size:'+hdrFont()+'px;line-height:1.15',class:(COLDEF[k].edit?'mps-h':''),title:cd.tip},thKids);
      th.ondragover=function(e){if(dragKey&&dragKey!==k){e.preventDefault();th.classList.add('drop');}};
      th.ondragleave=function(){th.classList.remove('drop');};
      th.ondrop=function(e){e.preventDefault();th.classList.remove('drop');if(dragKey&&dragKey!==k){reorder(dragKey,k);}};
      var rez=el('div',{class:'rez',title:'Drag to resize this column'});makeResizable(rez,th,k);th.appendChild(rez);
      htr.appendChild(th);
    });
    thead.appendChild(letr);thead.appendChild(htr);
    var ftr=el('tr',{class:'f'});ftr.appendChild(el('td',{class:'mps-selcell'},[]));
    visKeys().forEach(function(k){
      var cell;
      if(COLDEF[k].dfilter){cell=el('td',{style:'width:'+S.cols[k].w+'px'},[multiFilterBtn(k)]);}
      else{var inp=el('input',{type:'text',title:'Filter '+COLDEF[k].label,placeholder:'⌕',value:S.colFilters[k]||''});inp.oninput=function(){S.colFilters[k]=inp.value;applyFilters();renderBody();renderChart();};cell=el('td',{style:'width:'+S.cols[k].w+'px'},[inp]);}
      ftr.appendChild(cell);
    });
    // Filler column: `table{width:max-content;min-width:100%}` means that whenever the
    // table is narrower than the panel the browser hands the surplus to EVERY column,
    // ignoring max-width — which stretched the tick column to 45-56px after Optimise
    // Widths. This empty auto-width column absorbs all of that surplus instead, so the
    // tick column stays exactly 16px whatever the width tools do.
    letr.appendChild(el('th',{class:'colc mps-fill'},[]));
    htr.appendChild(el('th',{class:'mps-fill'},[]));
    ftr.appendChild(el('td',{class:'mps-fill'},[]));
    thead.appendChild(ftr);
    table.appendChild(thead);table.appendChild(el('tbody',{id:'tbody'}));tw.appendChild(table);
    renderBody();
    var letRow=table.querySelector('tr.colletrow'),hRow=table.querySelector('tr.hdr'),frow=table.querySelector('tr.f');
    var letH=letRow?letRow.offsetHeight:0;
    if(hRow){hRow.querySelectorAll('th').forEach(function(th){th.style.top=letH+'px';});}
    var hH=hRow?hRow.offsetHeight:0;
    if(frow){frow.querySelectorAll('td').forEach(function(td){td.style.top=(letH+hH)+'px';});}
  }
  function corrCell(row,k,base){
    var list=(k==='mpsCorr'?row._mpsMails:row._bhpMails)||[];
    if(!list.length)return el('td',{style:base+';text-align:center;color:#c2c9d2',title:'No '+(k==='mpsCorr'?'MPS':'BHP')+' correspondence found for this RFI/TQ'},['0']);
    var td=el('td',{style:base});
    var trig=el('div',{class:'corrtrig',title:'Click to list the '+(k==='mpsCorr'?'MPS':'BHP')+' mail numbers for this RFI/TQ'},[el('b',{},[String(list.length)]),el('span',{class:'enumcar'},['\u25be'])]);
    trig.onclick=function(e){e.stopPropagation();openCorr(row,k,list,trig);};
    td.appendChild(trig);return td;
  }
  function openCorr(row,k,list,anchor){
    var wrapEl=root.getElementById('wrap');var ex=root.getElementById('corrdd');var same=ex&&ex.__k===k&&ex.__row===row;if(ex)ex.remove();if(same)return;
    var panel=el('div',{id:'corrdd',class:'mfpanel',style:'min-width:180px;max-height:280px'});panel.__k=k;panel.__row=row;
    panel.appendChild(el('div',{class:'mfhd'},[el('span',{style:'font-weight:700;color:'+NAVY+';font-size:11px'},[(k==='mpsCorr'?'MPS':'BHP')+' mails ('+list.length+')']),el('a',{title:'Close',style:'margin-left:auto',onclick:function(){panel.remove();}},['\u2715'])]));
    list.forEach(function(no){panel.appendChild(el('div',{class:'mfrow',style:'font-size:11px;white-space:nowrap'},[no]));});
    wrapEl.appendChild(panel);
    var ar=anchor.getBoundingClientRect(),wr=wrapEl.getBoundingClientRect();panel.style.left=Math.max(4,Math.min(ar.left-wr.left,wr.width-190))+'px';panel.style.top=(ar.bottom-wr.top+2)+'px';
  }
  function refUrl(row){return 'https://au1.aconex.com/ViewCorrespondence?Correspondence_ID='+row._refMailId+'&CORRESPONDENCE_MAILBOX='+row._refMailbox+'&PROJECT_ID='+row._refPid;}
  function saveXDataMerge(updates){try{var m=JSON.parse(localStorage.getItem('mps_aconex_rfi_xdata_73409')||'{}');for(var k in updates){m[k]=Object.assign(m[k]||{},updates[k]);}localStorage.setItem('mps_aconex_rfi_xdata_73409',JSON.stringify(m));}catch(e){}}
  async function resolveRefLinks(){
    if(S._resolvingLinks)return;var todo=S.allRows.filter(function(r){return r.aconexRef&&!r._refMailId;});if(!todo.length)return;S._resolvingLinks=true;
    try{var pid=S.xProjectId||detectProjectId()||'2013294019';
      function tx2(n,sel){var e=n.querySelector(sel);return e?(e.textContent||'').trim():'';}
      async function det(id){var rr=await fetch('/api/projects/'+pid+'/mail/'+id,{headers:{Accept:'application/xml'},credentials:'include'});return new DOMParser().parseFromString(await rr.text(),'text/xml').documentElement;}
      async function srch(box,q){var rr=await fetch('/api/projects/'+pid+'/mail?mail_box='+box+'&page_size=25&search_query='+encodeURIComponent(q),{headers:{Accept:'application/xml'},credentials:'include'});var d=new DOMParser().parseFromString(await rr.text(),'text/xml');return Array.prototype.map.call(d.querySelectorAll('Mail'),function(m){return m.getAttribute('MailId');});}
      var idByNo={},seenId={};S.allRows.forEach(function(r){if(r._refMailId)idByNo[normRef(r.aconexRef)]=r._refMailId;});
      var i=0,CONC=5;
      async function worker(){while(i<todo.length){var r=todo[i++];var key=normRef(r.aconexRef);if(idByNo[key])continue;var box=/^BHP/i.test(r.aconexRef)?'inbox':'sentbox';try{var hits=await srch(box,r.aconexRef);for(var h=0;h<hits.length&&!idByNo[key];h++){var id=hits[h];if(seenId[id])continue;seenId[id]=1;try{var d=await det(id);var mno=normRef(tx2(d,'MailNo'));if(mno)idByNo[mno]=id;}catch(e){}}}catch(e){}}}
      await Promise.all(Array.from({length:CONC},worker));
      var updates={},changed=0;S.allRows.forEach(function(r){var key=normRef(r.aconexRef);if(!r._refMailId&&idByNo[key]){r._refMailId=idByNo[key];r._refMailbox=(/^BHP/i.test(r.aconexRef)?4:5);r._refPid=pid;updates[key]={rid:r._refMailId,rbox:r._refMailbox,pid:r._refPid};changed++;}});
      if(changed){saveXDataMerge(updates);try{renderBody();}catch(e){}}
    }catch(e){}
    S._resolvingLinks=false;
  }
  function maybeResolveLinks(){try{if(typeof __xSyncing!=='undefined'&&__xSyncing){setTimeout(maybeResolveLinks,3000);return;}var todo=S.allRows.filter(function(r){return r.aconexRef&&!r._refMailId;});if(todo.length)setTimeout(resolveRefLinks,800);}catch(e){}}
  
/* ===== MPS RFI v11: per-RFI thread attribution (flag fix) + I/J date dropdowns + H/I/J tooltips ===== */
function mpsPidGuess(){try{return (S&&S.xProjectId)||detectProjectId()||'2013294019';}catch(e){return '2013294019';}}
function mpsDay(d){d=String(d||'');var m=d.match(/(\d{4})-(\d{2})-(\d{2})/);if(m)return m[1]+'-'+m[2]+'-'+m[3];m=d.match(/(\d{2})\/(\d{2})\/(\d{4})/);if(m)return m[3]+'-'+m[2]+'-'+m[1];return '';}
var __mpsOwnPfx='MPSBE',__mpsCtrPfx='BHPCSAMP';function mpsDetectPfxFromRows(){try{var rows=(S&&S.allRows)||[];for(var i=0;i<rows.length;i++){var no=String(rows[i].aconexRef||''),p=no.split('-')[0];if(rows[i]._refMailbox===5&&p){__mpsOwnPfx=p;break;}}for(var j=0;j<rows.length;j++){var n2=String(rows[j].aconexRef||''),q=n2.split('-')[0];if(rows[j]._refMailbox===4&&q){__mpsCtrPfx=q;break;}}}catch(e){}}function mpsOrg(no){no=String(no||'');var p=no.split('-')[0];if(p&&p===__mpsOwnPfx)return 'MPS';if(p&&p===__mpsCtrPfx)return 'BHP';if(/^MPS/.test(no))return 'MPS';if(/^BHP/.test(no))return 'BHP';return '';}
function mpsIsRFIroot(no){no=String(no||'');return /(^|[^A-Z])RFI-[0-9]+$/.test(no);}
async function mpsMailXml(pid,id){try{var r=await fetch('/api/projects/'+pid+'/mail/'+id,{headers:{'Accept':'application/xml'},credentials:'include'});if(!r.ok)return null;var t=await r.text();return new DOMParser().parseFromString(t,'application/xml');}catch(e){return null;}}
function mpsTxt(d,t){var e=d&&d.querySelector(t);return e?e.textContent.trim():'';}
async function mpsMailSearch(pid,box,q){try{var u='/api/projects/'+pid+'/mail?mail_box='+box+'&page_size=250&search_query='+encodeURIComponent(q);var r=await fetch(u,{headers:{'Accept':'application/xml'},credentials:'include'});if(!r.ok)return [];var t=await r.text();var d=new DOMParser().parseFromString(t,'application/xml');return Array.prototype.map.call(d.querySelectorAll('Mail'),function(m){return m.getAttribute('MailId')||m.getAttribute('mailId');}).filter(Boolean);}catch(e){return [];}}
async function mpsPool(items,worker,conc){var i=0;async function nx(){if(i>=items.length)return;var idx=i++;try{await worker(items[idx]);}catch(e){}return nx();}var st=[];for(var c=0;c<Math.min(conc,items.length);c++)st.push(nx());await Promise.all(st);}
async function mpsRfiThread(pid,originId,cache){cache=cache||{};var od=await mpsMailXml(pid,originId);if(!od)return null;var ns=mpsTxt(od,'Subject').replace(/^(\s*(re|fw|fwd)\s*:\s*)+/i,'').trim();var det=cache[ns];if(!det){det={};var ids={};ids[originId]=1;(await mpsMailSearch(pid,'sentbox',ns)).forEach(function(x){ids[x]=1;});(await mpsMailSearch(pid,'inbox',ns)).forEach(function(x){ids[x]=1;});var arr=Object.keys(ids).slice(0,150);await mpsPool(arr,async function(id){var d=await mpsMailXml(pid,id);if(d)det[id]={no:mpsTxt(d,'MailNo'),inref:mpsTxt(d,'InRefToMailId'),date:(mpsTxt(d,'SentDate')||'').slice(0,10)};},6);cache[ns]=det;}if(!det[originId])det[originId]={no:mpsTxt(od,'MailNo'),inref:mpsTxt(od,'InRefToMailId'),date:(mpsTxt(od,'SentDate')||'').slice(0,10)};function ownerOf(id){var cur=id,g=0,seen={};while(cur&&det[cur]&&g<30){if(mpsIsRFIroot(det[cur].no))return cur;var nx2=det[cur].inref;if(!nx2||seen[nx2]||!det[nx2])break;seen[nx2]=1;cur=nx2;g++;}return null;}var mine=Object.keys(det).filter(function(id){return ownerOf(id)===originId;});if(mine.indexOf(originId)<0)mine.push(originId);mine.sort(function(a,b){return (det[a].date||'').localeCompare(det[b].date||'');});var corr=mine.map(function(id){return {n:det[id].no,d:det[id].date,o:mpsOrg(det[id].no),id:id};}).filter(function(c){return c.n;});var mps=corr.filter(function(c){return c.o==='MPS';});var bhp=corr.filter(function(c){return c.o==='BHP';});var oNo=det[originId].no;var mpsAfter=mps.filter(function(c){return c.n!==oNo;});return {mps:mps.map(function(c){return c.n;}),bhp:bhp.map(function(c){return c.n;}),corr:corr,fu1:(mpsAfter[0]?mpsAfter[0].d:''),fu2:(mpsAfter[1]?mpsAfter[1].d:'')};}
function mpsRfiApplyCorr(xd){try{var rows=(S&&S.allRows)||[];for(var i=0;i<rows.length;i++){var row=rows[i];var k=normRef(row.aconexRef);var e=xd[k];if(!e)continue;if(e.corr)row._corr=e.corr;if(e.mps)row._mpsMails=e.mps;if(e.bhp)row._bhpMails=e.bhp;if(e.mps&&e.bhp)row.totalCorr=e.mps.length+e.bhp.length;}try{recomputeAuto();}catch(e){}try{renderBody();}catch(e){}}catch(e){}}
async function mpsRfiCorrectAll(force){try{if(mpsRfiCorrectAll._busy)return;var rows=(S&&S.allRows)||[];if(!rows.length)return;var XK='mps_aconex_rfi_xdata_73409';var xd={};try{xd=JSON.parse(localStorage.getItem(XK)||'{}')||{};}catch(e){}var pid=mpsPidGuess();if(!force&&xd.__corr&&xd.__corr.ver>=11&&(!xd.__corr.pid||xd.__corr.pid===pid)){mpsRfiApplyCorr(xd);return;}mpsRfiCorrectAll._busy=1;if(typeof resolveRefLinks==='function'){try{await resolveRefLinks();}catch(e){}}mpsDetectPfxFromRows();var cache={};var updates={};for(var i=0;i<rows.length;i++){var row=rows[i];var oid=row._refMailId;if(!oid)continue;var res=null;try{res=await mpsRfiThread(pid,String(oid),cache);}catch(e){}if(!res)continue;var key=normRef(row.aconexRef);var ex=xd[key]||{};updates[key]=Object.assign({},ex,{mps:res.mps,bhp:res.bhp,corr:res.corr,fu1:res.fu1||ex.fu1,fu2:res.fu2||ex.fu2});row._mpsMails=res.mps;row._bhpMails=res.bhp;row._corr=res.corr;if(res.fu1)row._autoFu1=res.fu1;if(res.fu2)row._autoFu2=res.fu2;row.totalCorr=res.mps.length+res.bhp.length;}updates.__corr={ver:11,ts:Date.now(),pid:pid};try{if(typeof saveXDataMerge==='function'){saveXDataMerge(updates);}else{Object.keys(updates).forEach(function(k){xd[k]=updates[k];});localStorage.setItem(XK,JSON.stringify(xd));}}catch(e){try{Object.keys(updates).forEach(function(k){xd[k]=updates[k];});localStorage.setItem(XK,JSON.stringify(xd));}catch(_){}}try{recomputeAuto();}catch(e){}try{renderStats();}catch(e){}try{renderChart();}catch(e){}try{renderDaysOpen();}catch(e){}try{renderBody();}catch(e){}mpsRfiCorrectAll._busy=0;}catch(e){mpsRfiCorrectAll._busy=0;}}
function mpsRfiSR(){var els=document.querySelectorAll('*');for(var i=0;i<els.length;i++){var sr=els[i].shadowRoot;if(sr){var tc=sr.textContent||'';if(sr.querySelector('th')&&tc.indexOf('Aconex Reference No')>=0&&tc.indexOf('Follow up Sent Date')>=0)return sr;}}return null;}
function mpsRfiPop(anchor,corr,pid){try{var old=document.getElementById('mps-ij-pop');if(old)old.remove();var box=document.createElement('div');box.id='mps-ij-pop';box.style.cssText='position:fixed;z-index:2147483647;background:#fff;border:1px solid #cfd6dd;border-radius:4px;box-shadow:0 4px 14px rgba(0,0,0,.18);padding:4px 0;font:12px/1.5 Arial,Helvetica,sans-serif;color:#1f2d3d;min-width:170px;max-height:260px;overflow:auto;';corr.forEach(function(c){var a=document.createElement('a');a.textContent=c.n;a.title=c.o+' \u2022 '+(c.d||'');a.href=(c.id?('https://au1.aconex.com/ViewCorrespondence?Correspondence_ID='+c.id+'&CORRESPONDENCE_MAILBOX='+(c.o==='MPS'?'5':'4')+'&PROJECT_ID='+pid):'#');a.target='_blank';a.rel='noopener';a.style.cssText='display:block;padding:3px 12px;text-decoration:none;color:'+(c.o==='BHP'?'#b8541a':'#1f6fb2')+';white-space:nowrap;';a.addEventListener('mouseenter',function(){a.style.background='#f0f4f8';});a.addEventListener('mouseleave',function(){a.style.background='';});box.appendChild(a);});document.body.appendChild(box);var rc=anchor.getBoundingClientRect();box.style.left=Math.max(4,Math.min(rc.left,window.innerWidth-box.offsetWidth-8))+'px';box.style.top=(rc.bottom+2)+'px';setTimeout(function(){document.addEventListener('click',function h(){var b=document.getElementById('mps-ij-pop');if(b)b.remove();document.removeEventListener('click',h);});},0);}catch(e){}}
function mpsRfiIJ(td,row,dateVal,pid){try{if(!td||td.getAttribute('data-mps-ij'))return;var day=mpsDay(dateVal);if(!day)return;var corr=(row._corr||[]).filter(function(c){return mpsDay(c.d)===day;});if(!corr.length)return;td.setAttribute('data-mps-ij','1');td.style.position='relative';var car=document.createElement('span');car.textContent=' \u25be';car.title=corr.length+' correspondence on this date';car.style.cssText='cursor:pointer;color:#8a939b;font-size:10px;margin-left:2px;user-select:none;';car.addEventListener('click',function(ev){ev.stopPropagation();mpsRfiPop(car,corr,pid);});td.appendChild(car);}catch(e){}}
function mpsRfiEnhance(){try{var sr=mpsRfiSR();if(!sr)return;var tips={'Date Response Required':'H \u2014 Date Response Required: the response-due date carried on the RFI/TQ in Aconex (the originating mail\'s \u201cRespond by\u201d date). Taken from the register, not calculated.','Follow up Sent Date 1':'I \u2014 Follow up Sent Date 1: auto-filled from the date of the 1st MPS follow-up correspondence sent after the RFI/TQ was issued (earliest MPS mail in the conversation after the original). Editable. Click the \u25be to list the correspondence on this date.','Follow up Sent Date 2':'J \u2014 Follow up Sent Date 2: auto-filled from the date of the 2nd MPS follow-up correspondence sent after the RFI/TQ was issued. Editable. Click the \u25be to list the correspondence on this date.'};var ths=sr.querySelectorAll('th');for(var i=0;i<ths.length;i++){var t=(ths[i].textContent||'').replace(/[\u21d5\ud83c\udfa8]/g,'').trim();if(tips[t]){ths[i].title=tips[t];ths[i].style.cursor='help';}}var rows=(S&&S.filtered&&S.filtered.length?S.filtered:(S&&S.allRows))||[];var byRef={};for(var r=0;r<rows.length;r++){byRef[String(rows[r].aconexRef).toUpperCase()]=rows[r];}var pid=mpsPidGuess();var trs=sr.querySelectorAll('tbody tr');for(var k=0;k<trs.length;k++){var tds=trs[k].querySelectorAll('td');var off=(tds[0]&&tds[0].classList&&tds[0].classList.contains('mps-selcell'))?1:0;if(tds.length<10+off)continue;var refTxt=(tds[1+off].textContent||'').trim().toUpperCase();var row=byRef[refTxt];if(!row)continue;mpsRfiIJ(tds[8+off],row,row.followUp1||row._autoFu1,pid);mpsRfiIJ(tds[9+off],row,row.followUp2||row._autoFu2,pid);}}catch(e){}}
try{var __mpsOrigRB=renderBody;renderBody=function(){var _r=__mpsOrigRB.apply(this,arguments);try{mpsRfiEnhance();}catch(e){}return _r;};}catch(e){}
try{(function(){var t=0;function tick(){t++;try{if(S&&S.allRows&&S.allRows.length){mpsRfiCorrectAll(false);return;}}catch(e){}if(t<60)setTimeout(tick,1000);}setTimeout(tick,1800);})();}catch(e){}

async function fullScan(){
    if(S._fullScanning)return;S._fullScanning=true;
    try{ await resolveRefLinks();
      var pid=S.xProjectId||detectProjectId()||'2013294019';
      function tx2(n,sel){var e=n.querySelector(sel);return e?(e.textContent||'').trim():'';}
      function org2(mno){return /^BHP/i.test(mno)?'BHP':/^MPS/i.test(mno)?'MPS':'MPS';}
      function nsub2(x){x=String(x||'').toLowerCase().trim();while(true){if(x.slice(0,3)==='re:'){x=x.slice(3).trim();continue;}if(x.slice(0,3)==='fw:'){x=x.slice(3).trim();continue;}if(x.slice(0,4)==='fwd:'){x=x.slice(4).trim();continue;}break;}return x.split(' ').filter(Boolean).join(' ');}
      async function det(id){for(var a=0;a<3;a++){try{var rr=await fetch('/api/projects/'+pid+'/mail/'+id,{headers:{Accept:'application/xml'},credentials:'include'});if(rr.status===200)return new DOMParser().parseFromString(await rr.text(),'text/xml').documentElement;}catch(e){}await new Promise(function(z){setTimeout(z,250);});}return null;}
      async function srch(box,q){try{var rr=await fetch('/api/projects/'+pid+'/mail?mail_box='+box+'&page_size=50&search_query='+encodeURIComponent(q),{headers:{Accept:'application/xml'},credentials:'include'});var d=new DOMParser().parseFromString(await rr.text(),'text/xml');return Array.prototype.map.call(d.querySelectorAll('Mail'),function(m){return m.getAttribute('MailId');});}catch(e){return [];}}
      var cache={};
      async function getMail(id){if(cache[id])return cache[id];var d=await det(id);if(!d)return null;var mno=tx2(d,'MailNo');var m={id:id,mno:mno,tid:tx2(d,'ThreadId'),sd:tx2(d,'SentDate'),org:org2(mno),subj:tx2(d,'Subject')};cache[id]=m;return m;}
      var rows=S.allRows.filter(function(r){return r._refMailId;});
      var oi=0;async function ow(){while(oi<rows.length){var r=rows[oi++];r.__o=await getMail(r._refMailId);}}
      await Promise.all([ow(),ow(),ow(),ow()]);
      var subjMem={},subs=[];rows.forEach(function(r){if(r.__o){var ns=nsub2(r.__o.subj);if(subjMem[ns]===undefined){subjMem[ns]=null;subs.push({ns:ns,subj:r.__o.subj});}}});
      var si=0;async function sw(){while(si<subs.length){var so=subs[si++];var ids={};for(var bi=0;bi<2;bi++){var box=bi?'inbox':'sentbox';(await srch(box,so.subj)).forEach(function(id){ids[id]=1;});}var mem=[];var kk=Object.keys(ids);for(var z=0;z<kk.length;z++){var mm=await getMail(kk[z]);if(mm)mem.push(mm);}subjMem[so.ns]=mem;}}
      await Promise.all([sw(),sw(),sw(),sw(),sw()]);
      var updates={};
      rows.forEach(function(r){if(!r.__o)return;var ns=nsub2(r.__o.subj);var mem=(subjMem[ns]||[]).filter(function(m){return m.tid===r.__o.tid||nsub2(m.subj)===ns;});var have={};mem.forEach(function(m){have[m.id]=1;});if(!have[r.__o.id])mem.push(r.__o);
        var mps=mem.filter(function(m){return m.org==='MPS';}).sort(function(a,b){return a.sd<b.sd?-1:a.sd>b.sd?1:0;});
        var bhp=mem.filter(function(m){return m.org==='BHP';}).sort(function(a,b){return a.sd<b.sd?-1:a.sd>b.sd?1:0;});
        r._mpsMails=mps.map(function(m){return m.mno;});r._bhpMails=bhp.map(function(m){return m.mno;});
        var ov=S.overrides[rowKey(r)]||{};
        if(mps.length&&(ov.mailNo==null||ov.mailNo===''))r.mailNo=mps[mps.length-1].mno;
        if(bhp.length&&(ov.respMailNo==null||ov.respMailNo===''))r.respMailNo=bhp[bhp.length-1].mno;
        var mpsResp=mps.filter(function(m){return m.id!==r.__o.id;});
        r._autoFu1=mpsResp[0]?(mpsResp[0].sd||'').slice(0,10):'';r._autoFu2=mpsResp[1]?(mpsResp[1].sd||'').slice(0,10):'';
        updates[normRef(r.aconexRef)]={p:r.mailNo||'',q:r.respMailNo||'',mps:r._mpsMails,bhp:r._bhpMails,fu1:r._autoFu1,fu2:r._autoFu2,rid:r._refMailId,rbox:r._refMailbox,pid:r._refPid};
      });
      updates.__full={ver:10,ts:Date.now()};
      saveXDataMerge(updates);
      try{recomputeAuto();renderStats();renderChart();renderDaysOpen();renderBody();}catch(e){}
    }catch(e){}
    S._fullScanning=false;
  }
  function maybeFullScan(){try{var xd=null;try{xd=JSON.parse(localStorage.getItem('mps_aconex_rfi_xdata_73409')||'null');}catch(e){}if(xd&&xd.__full&&xd.__full.ver>=10)return;var todo=S.allRows.filter(function(r){return r.aconexRef;});if(todo.length)setTimeout(fullScan,1200);}catch(e){}}
  function renderBody(){
    var tb=root.getElementById('tbody');if(!tb)return;tb.innerHTML='';
    var cl=root.getElementById('countlbl');if(cl)cl.textContent=S.filtered.length+' of '+S.rows.length;
    var pad=Math.max(0,Math.round(S.rowPad*(S.padScale||100)/100)),ws=S.wrap?'normal':'nowrap',ov=S.wrap?'visible':'hidden';
    S.filtered.forEach(function(row){
      var tr=el('tr');
      if(isRowSel(row))tr.classList.add('mps-selrow');
      tr.appendChild(selCellTd(row,pad));
      visKeys().forEach(function(k){
        var td,w=S.cols[k].w;
        var base='width:'+w+'px;max-width:'+w+'px;padding:'+pad+'px 6px;white-space:'+ws+';overflow:'+ov+';text-overflow:ellipsis';
        if(COLDEF[k].edit){td=editCell(row,k,base);}
        else if(k==='closed'){var cv=row.closed||'';td=el('td',{style:base,title:cv},[cv?el('span',{class:'pill',style:'background:'+closedColor(cv)+';color:'+lumFg(closedColor(cv))},[closedDisp(cv)]):cv]);}
        else if(k==='sender'){var sv=row.sender||'';td=el('td',{style:base,title:sv},[sv?el('span',{class:'pill',style:'background:'+senderColor(sv)+';color:#fff'},[sv]):sv]);}
        else if(k==='eot'||k==='costVar'){var yv=row[k]||'';var yc=yesnoColor(k,yv);td=el('td',{style:base,title:yv},[yv?el('span',{class:'pill',style:'background:'+(yc||'#8a939b')+';color:#fff'},[yv]):yv]);}
        else if(k==='aconexRef'){var av=cellVal(row,k);if(row._refMailId){td=el('td',{style:base,title:'Open '+av+' in Aconex mail'},[el('a',{class:'doclink',href:refUrl(row),target:'_blank',rel:'noopener'},[av])]);}else{td=el('td',{style:base,title:av},[av]);}}else if(k==='bhpFlag'){var bn=(row._bhpMails?row._bhpMails.length:0);td=el('td',{style:base+';text-align:center'},bn>2?[el('span',{class:'bhpflag',title:bn+' BHP responses on this RFI/TQ \u2014 more than 2'},['\u2691 '+bn])]:[]);}else if(k==='mpsCorr'||k==='bhpCorr'){td=corrCell(row,k,base);}else if(k==='totalCorr'){var tn=String(row.totalCorr||'0');td=el('td',{style:base+';text-align:center'+((tn==='0'||tn==='')?';color:#c2c9d2':'')},[tn||'0']);}else if(k==='daysSinceSub'||k==='daysSinceResp'){var dv=cellVal(row,k);var clc=(k==='daysSinceResp'&&isClosed(row));var late=(k==='daysSinceResp'&&!isClosed(row)&&dv!=='—'&&(+dv)>=7);td=el('td',{style:base+(clc?';color:#8a939b':(late?';color:#c0392b;font-weight:700':'')),title:cd0(k,row)},[dv]);}
        else if(k==='description'){td=el('td',{style:base,title:cellVal(row,k)},[cellVal(row,k)]);}
        else{td=el('td',{style:base,title:cellVal(row,k)},[cellVal(row,k)]);}
        tr.appendChild(td);
      });
      tr.appendChild(el('td',{class:'mps-fill'},[]));
      tb.appendChild(tr);
    });
    updateSelBtn();
  }
  function cd0(k,row){if(k==='daysSinceSub')return 'Calendar days since Date Sent ('+cellVal(row,'dateSent')+')';return 'Calendar days since Date Response Received ('+cellVal(row,'dateRespRecd')+')';}
  // Custom editable dropdown (Status / Yes-No) with a left "×" to delete an option.
  function enumDropdown(row,k,td,base){
    var isStatus=(COLDEF[k].edit==='status');
    function stdOpts(){return isStatus?statusOptions():['Yes','No'];}
    function allOpts(){var seen={},out=[];stdOpts().forEach(function(o){var lk=String(o).toLowerCase();if(!seen[lk]){seen[lk]=1;out.push(o);}});S.allRows.forEach(function(r){var v=r[k];if(v!=null&&v!==''){var lk=String(v).toLowerCase();if(!seen[lk]){seen[lk]=1;out.push(v);}}});return out;}
    function colourOf(v){return isStatus?closedColor(v):yesnoColor(k,v);}
    var trig=el('div',{class:'enumtrig',title:COLDEF[k].tip});
    function paintTrig(){var v=row[k]||'',c=colourOf(v);trig.innerHTML='';trig.appendChild(el('span',{class:'enumval'+(v&&c?' set':''),style:(v&&c?('background:'+c+';color:'+lumFg(c)):'')},[v?String(v):'—']));trig.appendChild(el('span',{class:'enumcar'},['▾']));}
    paintTrig();
    trig.onclick=function(e){e.stopPropagation();openPanel();};
    td.appendChild(trig);
    function pick(v){setOverride(row,k,v);paintTrig();var p=root.getElementById('enumdd');if(p)p.remove();if(isStatus){recomputeAuto();renderStats();renderChart();renderDaysOpen();}renderBody();}
    function deleteOpt(o){var lk=String(o).toLowerCase();S.allRows.forEach(function(r){if(String(r[k]||'').toLowerCase()===lk){r[k]='';var ov=S.overrides[rowKey(r)]||(S.overrides[rowKey(r)]={});ov[k]='';}});if(isStatus){S.statusList=(S.statusList||[]).filter(function(sx){return sx.toLowerCase()!==lk;});}saveOverrides();ghPush();saveCfg();applyScope();recomputeAuto();renderStats();renderChart();renderDaysOpen();renderBody();var p=root.getElementById('enumdd');if(p&&p.__rebuild)p.__rebuild();}
    function openPanel(){var wrapEl=root.getElementById('wrap');var ex=root.getElementById('enumdd');var same=ex&&ex.__k===k&&ex.__row===row;if(ex)ex.remove();if(same)return;
      var panel=el('div',{id:'enumdd',class:'mfpanel',style:'min-width:150px'});panel.__k=k;panel.__row=row;
      function rebuild(){panel.innerHTML='';panel.appendChild(el('div',{class:'mfhd'},[el('span',{style:'font-weight:700;color:'+NAVY+';font-size:11px'},[colLabel(k)]),el('a',{title:'Close',style:'margin-left:auto',onclick:function(){panel.remove();}},['✕'])]));
        panel.appendChild(el('div',{class:'mfrow',title:'Clear this cell',onclick:function(){pick('');}},[el('span',{style:'width:13px;flex:0 0 auto'}),el('span',{style:'flex:1;color:#8a939b'},['—'])]));
        allOpts().forEach(function(o){var c=colourOf(o);var del=el('span',{class:'enumdel',title:'Delete "'+o+'" from this dropdown and clear it from every row',onclick:function(ev){ev.stopPropagation();deleteOpt(o);}},['×']);var kids=[del];if(c){var dot=el('i');dot.style.cssText='width:10px;height:10px;border-radius:2px;background:'+c+';display:inline-block;flex:0 0 auto';kids.push(dot);}kids.push(el('span',{style:'flex:1'},[String(o)]));panel.appendChild(el('div',{class:'mfrow',title:'Set to '+o,onclick:function(){pick(o);}},kids));});
        if(isStatus){var nv=el('input',{type:'text',placeholder:'add a status…',style:'flex:1;min-width:70px;font-size:11px;padding:2px 5px;border:1px solid #cfd8e3;border-radius:4px'});nv.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();var v=(nv.value||'').trim();if(v){addStatus(v);pick(v);}}};var addB=el('a',{style:'font-weight:700;color:'+NAVY,title:'Add a new status',onclick:function(ev){ev.preventDefault();var v=(nv.value||'').trim();if(v){addStatus(v);pick(v);}}},['+ Add']);panel.appendChild(el('div',{class:'mfrow',style:'border-top:1px solid #e3e9f0;margin-top:4px;padding-top:5px'},[nv,addB]));}
      }
      panel.__rebuild=rebuild;rebuild();wrapEl.appendChild(panel);
      var ar=trig.getBoundingClientRect(),wr=wrapEl.getBoundingClientRect();panel.style.left=Math.max(4,Math.min(ar.left-wr.left,wr.width-160))+'px';panel.style.top=(ar.bottom-wr.top+2)+'px';
    }
  }
  function fuCell(row,k,td){
    var accKey=(k==='followUp1'?'fu1Acc':'fu2Acc');
    var auto=(k==='followUp1'?row._autoFu1:row._autoFu2)||'';
    function manual(){return row[k]||'';}
    function accepted(){return (S.overrides[rowKey(row)]||{})[accKey]||'';}
    function mism(){var m=manual();return !!(m&&auto&&m!==auto&&m!==accepted());}
    var input=el('input',{type:'date',title:(COLDEF[k].tip||'')+(auto?(' \u00b7 Auto ('+(k==='followUp1'?'1st':'2nd')+' MPS response): '+fmtDate(auto)):''),value:(manual()||auto)});
    var accBtn=el('span',{class:'fuaccept',title:'Accept this entry \u2014 stops the red flag until the date is changed again',onclick:function(e){e.stopPropagation();var o=S.overrides[rowKey(row)]||(S.overrides[rowKey(row)]={});o[accKey]=manual();saveOverrides();ghPush();paint();}},['Accept Entry']);
    function paint(){input.classList.remove('dtempty','dtauto','dtmismatch');if(accBtn.parentNode===td)td.removeChild(accBtn);if(mism()){input.classList.add('dtmismatch');td.appendChild(accBtn);}else if(!input.value){input.classList.add('dtempty');}}
    paint();
    input.onchange=function(){setOverride(row,k,input.value);paint();recomputeAuto();renderStats();renderChart();renderDaysOpen();};
    td.appendChild(input);
  }
  function editCell(row,k,base){
    var td=el('td',{class:'edit',style:base});
    if(COLDEF[k].edit==='yesno'||COLDEF[k].edit==='status'){enumDropdown(row,k,td,base);return td;}
    if(k==='followUp1'||k==='followUp2'){fuCell(row,k,td);return td;}
    if(COLDEF[k].edit==='yesno'){var sel=el('select',{class:'mps-sel',title:COLDEF[k].tip});YESNO_OPTS.forEach(function(p){var o=el('option',{value:p});o.textContent=p||'—';if((row[k]||'')===p)o.selected=true;sel.appendChild(o);});
      function paintY(v){var c=yesnoColor(k,v);if(v&&c){td.style.background=c;sel.style.backgroundColor=c;sel.style.color='#fff';sel.style.fontWeight='700';sel.classList.add('set');}else{td.style.background='';sel.style.backgroundColor='';sel.style.color='';sel.style.fontWeight='';sel.classList.remove('set');}}
      paintY(row[k]);sel.onchange=function(){setOverride(row,k,sel.value);paintY(sel.value);try{sel.blur();}catch(e){}};td.appendChild(sel);}
    else if(COLDEF[k].edit==='status'){
      var sel=el('select',{class:'mps-sel',title:COLDEF[k].tip});
      function fillS(){sel.innerHTML='';var o0=el('option',{value:''});o0.textContent='—';sel.appendChild(o0);statusOptions().forEach(function(s){var o=el('option',{value:s});o.textContent=s;if((row.closed||'')===s)o.selected=true;sel.appendChild(o);});var add=el('option',{value:'__ADD__'});add.textContent='➕ Add status…';sel.appendChild(add);}
      function paintS(v){var c=closedColor(v);if(v&&c){td.style.background=c;sel.style.backgroundColor=c;sel.style.color=lumFg(c);sel.style.fontWeight='700';sel.classList.add('set');}else{td.style.background='';sel.style.backgroundColor='';sel.style.color='';sel.style.fontWeight='';sel.classList.remove('set');}}
      fillS();paintS(row.closed);
      sel.onchange=function(){
        if(sel.value==='__ADD__'){var nm=(typeof window.prompt==='function'?window.prompt('New status name:'):'')||'';nm=String(nm).trim();if(nm){addStatus(nm);setOverride(row,'closed',nm);}fillS();sel.value=row.closed||'';paintS(row.closed);renderStats();renderChart();renderDaysOpen();renderBody();return;}
        setOverride(row,'closed',sel.value);paintS(sel.value);try{sel.blur();}catch(e){}recomputeAuto();renderStats();renderChart();renderDaysOpen();renderBody();
      };td.appendChild(sel);}
    else{var isdate=COLDEF[k].edit==='date';var inp=el('input',{type:isdate?'date':'text',title:COLDEF[k].tip,value:row[k]||''});if(isdate){function paintDt(){inp.classList.toggle('dtempty',!inp.value);}paintDt();inp.addEventListener('input',paintDt);}inp.onchange=function(){setOverride(row,k,inp.value);if(isdate)inp.classList.toggle('dtempty',!inp.value);if(isdate||k==='mpsCorr'||k==='bhpCorr'){recomputeAuto();renderStats();renderChart();renderDaysOpen();renderBody();}};td.appendChild(inp);}
    return td;
  }
  function setOverride(row,key,val){row[key]=val;var o=S.overrides[rowKey(row)]||(S.overrides[rowKey(row)]={});o[key]=val;saveOverrides();ghPush();if(key==='closed'||key==='dateClosed')applyScope();}

  // ---- column ops ----
  function reorder(from,to){var o=S.order.slice();var fi=o.indexOf(from),ti=o.indexOf(to);if(fi<0||ti<0)return;o.splice(fi,1);ti=o.indexOf(to);o.splice(ti,0,from);S.order=o;saveCfg();renderTable();if(root.getElementById('colpanel'))renderColPanel();}
  function toggleColPanel(){var ex=root.getElementById('colpanel');if(ex){ex.remove();return;}renderColPanel();}
  function moveCol(k,dir){var o=S.order.slice();var i=o.indexOf(k),j=i+dir;if(j<0||j>=o.length)return;var t=o[i];o[i]=o[j];o[j]=t;S.order=o;saveCfg();renderTable();renderColPanel();}
  var pDrag=null;
  function renderColPanel(){
    var old=root.getElementById('colpanel');var sc=old?(old.querySelector('.clist')||{}).scrollTop:0;if(old)old.remove();
    var panel=el('div',{id:'colpanel',class:'panel',style:'left:12px;top:100px;max-height:calc(100vh - 128px);overflow:hidden'},[el('h4',{style:'white-space:normal'},['Columns']),el('div',{class:'muted',style:'font-size:11px;margin-bottom:6px;white-space:normal'},['Tick to show/hide. ▲▼ reorder. Rename a header in its box (blank restores the default). PRI is the Fit to 1 Page priority — 1 is served first, blanks rank equally. DEF and NOW are the default and current widths in px.']),el('div',{class:'crow chead'},[el('span',{style:'flex:0 0 auto;width:46px'}),el('span',{style:'flex:0 0 auto;width:13px'}),el('span',{class:'cpri chl'},['PRI']),el('span',{style:'flex:1;text-align:center'},['HEADER']),el('span',{class:'cwid chl'},['DEF']),el('span',{class:'cwid chl'},['NOW'])])]);
    var list=el('div',{class:'clist',style:'flex:1 1 auto;overflow:auto;min-height:40px'});
    // width of the longest DEFAULT column name (all rename boxes take this width)
    var probe=document.createElement('span');probe.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;font:'+(S.baseFont||DEF_BASEPX)+'px '+fontStack(S.fontFamily);root.appendChild(probe);
    var nameW=60;S.order.forEach(function(k){probe.textContent=COLDEF[k].label;if(probe.offsetWidth>nameW)nameW=probe.offsetWidth;});probe.remove();
    nameW=Math.min(230,Math.round(nameW)+24);
    S.order.forEach(function(k,idx){
      var up=el('button',{class:'mini',title:'Move up',onclick:function(){moveCol(k,-1);}},['▲']);var dn=el('button',{class:'mini',title:'Move down',onclick:function(){moveCol(k,1);}},['▼']);
      if(idx===0)up.disabled=true;if(idx===S.order.length-1)dn.disabled=true;
      var arrows=el('span',{style:'flex:0 0 auto;display:inline-flex;gap:3px'},[up,dn]);
      var cb=el('input',{type:'checkbox',title:'Show / hide '+colLabel(k),style:'flex:0 0 auto'});cb.checked=S.cols[k].show;cb.onchange=function(){S.cols[k].show=cb.checked;saveCfg();renderTable();};
      var inp=el('input',{type:'text',title:'Rename the '+COLDEF[k].label+' column header (blank = default: '+COLDEF[k].label+')',value:colLabel(k),style:'flex:0 0 auto;width:'+nameW+'px;margin:0 auto;text-align:center;font-size:12px;padding:2px 5px;border:1px solid #cfd8e3;border-radius:4px;box-sizing:border-box'});
      inp.onchange=function(){var v=(inp.value||'').trim();if(v&&v!==COLDEF[k].label){S.colNames[k]=v;}else{delete S.colNames[k];inp.value=COLDEF[k].label;}saveCfg();renderTable();};
      inp.onkeydown=function(e){if(e.key==='Enter')inp.blur();};
      /* item d: Fit priority (1 = first), default width and current width */
      var pri=el('input',{type:'number',min:'1',step:'1',title:'Fit to 1 Page priority for '+colLabel(k)+' — 1 is served first. Leave blank to rank equally with the other blanks.',value:(colPri(k)==null?'':String(colPri(k))),class:'cpri'});
      pri.onchange=function(){setColPri(k,pri.value);pri.value=(colPri(k)==null?'':String(colPri(k)));};
      var dw=el('input',{type:'number',min:'8',step:'1',title:'Default width of '+colLabel(k)+' in px — what Reset Col Widths restores it to'+(isDateCol(k)?'. Date columns ignore this and use the measured width of the date control.':'.'),value:String(isDateCol(k)?dateColW():colDefW(k)),class:'cwid'});
      dw.disabled=isDateCol(k);
      dw.onchange=function(){setColDefW(k,dw.value);dw.value=String(colDefW(k));};
      var cw=el('input',{type:'number',min:'8',step:'1',title:'Current width of '+colLabel(k)+' in px',value:String(S.cols[k].w),class:'cwid'});
      cw.onchange=function(){var v=parseInt(cw.value,10);if(isNaN(v)||v<8){cw.value=String(S.cols[k].w);return;}S.cols[k].w=v;S.cols[k].userW=true;saveCfg();renderTable();};
      list.appendChild(el('div',{class:'crow'},[arrows,cb,pri,inp,dw,cw]));
    });
    panel.appendChild(list);
    panel.appendChild(el('div',{style:'margin-top:8px;display:flex;gap:6px;flex:0 0 auto'},[el('button',{class:'btn',title:'Restore every column setting — order, visibility, names, widths, default widths and Fit priorities',onclick:function(){resetCols();}},['Reset Defaults']),el('button',{class:'btn',title:'Reset ONLY the column widths back to their default widths. Order, visibility, names and Fit priorities are left alone.',onclick:function(){resetColWidths();}},['Reset Col Widths']),el('button',{class:'btn',title:'Close',onclick:function(){var p=root.getElementById('colpanel');if(p)p.remove();}},['Close'])]));
    panel.style.width=Math.min(520,nameW+260)+'px';
    collapsiblePanel(panel);
    root.getElementById('wrap').appendChild(panel);var l=panel.querySelector('.clist');if(l)l.scrollTop=sc;
  }
  // Header Settings dropdown (item 1): header font size + how many lines (1–3) headers may take.
  function toggleHdrPanel(anchor){
    var ex=root.getElementById('hdrpanel');if(ex){ex.remove();return;}
    var wrapEl=root.getElementById('wrap');
    var panel=el('div',{id:'hdrpanel',class:'panel',style:'min-width:236px'},[el('h4',{style:'cursor:default'},['Header Settings']),el('div',{class:'muted',style:'font-size:11px;margin-bottom:8px;white-space:normal'},['Adjust the column header row. Saved to your default when you press ★ Set As Default.'])]);
    var szval=el('span',{class:'fpct'},[hdrFont()+'px']);
    var rng=el('input',{type:'range',min:'8',max:'22',value:String(hdrFont()),class:'rng',title:'Header font size'});
    function setFs(v){v=Math.max(8,Math.min(22,Math.round(v)));S.hdrFontSize=v;szval.textContent=v+'px';rng.value=String(v);saveCfg();renderTable();equalizePanelHeaders();}
    rng.oninput=function(){setFs(+rng.value);};
    var minus=el('button',{class:'btn sq',title:'Smaller header font',onclick:function(){setFs(hdrFont()-1);}},['−']);
    var plus=el('button',{class:'btn sq',title:'Larger header font',onclick:function(){setFs(hdrFont()+1);}},['+']);
    panel.appendChild(el('div',{class:'fontrow'},[el('label',{},['Font size']),el('span',{class:'sldgrp'},[minus,rng,plus]),szval]));
    var linesWrap=el('span',{style:'display:inline-flex;gap:5px'});
    function refreshLines(){Array.prototype.forEach.call(linesWrap.children,function(b){b.classList.toggle('active',(+b.getAttribute('data-n'))===hdrMaxLines());});}
    [1,2,3].forEach(function(nn){linesWrap.appendChild(el('button',{class:'chip','data-n':String(nn),title:'Allow headers to use up to '+nn+' line'+(nn>1?'s':''),onclick:function(){S.hdrMaxLines=nn;saveCfg();renderTable();refreshLines();equalizePanelHeaders();}},[String(nn)]));});
    panel.appendChild(el('div',{class:'fontrow'},[el('label',{title:'Maximum number of text lines a header may wrap to'},['Max lines']),linesWrap]));
    refreshLines();
    panel.appendChild(el('div',{style:'margin-top:10px;display:flex;gap:6px'},[
      el('button',{class:'btn',title:'Restore the default header size and 2 lines',onclick:function(){S.hdrFontSize=null;S.hdrMaxLines=2;saveCfg();renderTable();equalizePanelHeaders();var p=root.getElementById('hdrpanel');if(p)p.remove();toggleHdrPanel(anchor);}},['Reset']),
      el('button',{class:'btn',title:'Close',onclick:function(){var p=root.getElementById('hdrpanel');if(p)p.remove();}},['Close'])
    ]));
    wrapEl.appendChild(panel);
    if(anchor){var ar=anchor.getBoundingClientRect(),wr=wrapEl.getBoundingClientRect();panel.style.left=Math.min(Math.max(4,wr.width-panel.offsetWidth-8),Math.max(4,ar.left-wr.left))+'px';panel.style.top=(ar.bottom-wr.top+4)+'px';}else{panel.style.left='12px';panel.style.top='120px';}
  }
  // Excel-style: double-click the divider on a header's right edge to autofit the column to its left to its content.
  function autofitCol(k){var probe=document.createElement('span');probe.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;font:'+S.fontSize+'px "Segoe UI",Arial';root.appendChild(probe);var w=isDateCol(k)?dateColW():Math.min(460,Math.max(minHW(k),dataMinW(k,probe)));probe.remove();S.cols[k].w=w;if(isDateCol(k))delete S.cols[k].userW;else S.cols[k].userW=true;saveCfg();renderTable();}
  function makeResizable(handle,th,k){handle.onmousedown=function(e){e.preventDefault();e.stopPropagation();var sx=e.clientX,sw=th.offsetWidth;function mv(ev){var w=Math.max(minHW(k),sw+(ev.clientX-sx));S.cols[k].w=w;th.style.width=w+'px';th.style.minWidth=w+'px';}function up(){document.removeEventListener('mousemove',mv);document.removeEventListener('mouseup',up);S.cols[k].userW=true;saveCfg();renderBody();var frow=root.querySelector('tr.f');if(frow){var i=visKeys().indexOf(k);var td=frow.querySelectorAll('td')[i];if(td)td.style.width=S.cols[k].w+'px';}}document.addEventListener('mousemove',mv);document.addEventListener('mouseup',up);};handle.ondblclick=function(e){e.preventDefault();e.stopPropagation();autofitCol(k);};handle.title='Drag to resize · double-click to autofit to contents';}
  // Width the DATA cell needs (widget-aware): editable date pickers and selects need room for their control,
  // read-only/text cells only need their measured text. Header minimum is handled separately by minHW.

  /* ---- item b: date columns are measured, never negotiated ----------------
     A `width` on a td is the CONTENT box, so the cell padding sits outside it.
     dateColW() measures a real date input at the current font and uses exactly
     that, so the full date and its picker fit with no slack. */
  function isDateCol(k){return !!(COLDEF[k]&&COLDEF[k].edit==='date');}
  function dateColW(){
    var key=S.fontSize+'|'+(S.fontFamily||'');
    if(dateColW._k===key&&dateColW._v)return dateColW._v;
    var w=0;
    try{
      var probe=document.createElement('input');probe.type='date';probe.value='2026-12-31';
      probe.setAttribute('style','position:absolute;left:-9999px;top:0;visibility:hidden;width:auto;box-sizing:border-box;font:'+S.fontSize+'px '+fontStack(S.fontFamily)+';padding:0 3px;border:1px solid #000');
      root.appendChild(probe);w=Math.ceil(probe.getBoundingClientRect().width);probe.remove();
    }catch(e){}
    var v=Math.max(80,w||110);dateColW._k=key;dateColW._v=v;return v;
  }
  /* ---- item d: per-column Fit-to-width priority and default width ---- */
  function colPri(k){var v=(S.colPri||{})[k];v=parseInt(v,10);return isNaN(v)?null:v;}
  function setColPri(k,v){S.colPri=S.colPri||{};v=parseInt(v,10);if(isNaN(v)||v<1)delete S.colPri[k];else S.colPri[k]=v;saveCfg();}
  function colDefW(k){var v=(S.colDefW||{})[k];v=parseInt(v,10);return (isNaN(v)||v<8)?(COLDEF[k]?COLDEF[k].w:80):v;}
  function setColDefW(k,v){S.colDefW=S.colDefW||{};v=parseInt(v,10);if(isNaN(v)||v===(COLDEF[k]?COLDEF[k].w:80))delete S.colDefW[k];else S.colDefW[k]=Math.max(8,v);saveCfg();}
  function resetColWidths(){visKeys().forEach(function(k){delete S.cols[k].userW;S.cols[k].w=isDateCol(k)?dateColW():colDefW(k);});S.order.forEach(function(k){if(!S.cols[k].show){delete S.cols[k].userW;S.cols[k].w=isDateCol(k)?dateColW():colDefW(k);}});saveCfg();renderTable();if(root.getElementById('colpanel'))renderColPanel();}
  function dataMinW(k,probe){
    var ed=COLDEF[k]&&COLDEF[k].edit;
    if(ed==='date')return dateColW();                               // native date-picker widget
    var pad=(ed==='yesno'||ed==='status')?34:14;             // select arrow allowance vs plain text
    var mw=0;
    if(ed==='status'){statusOptions().forEach(function(o){probe.textContent=o;if(probe.offsetWidth>mw)mw=probe.offsetWidth;});}
    else if(ed==='yesno'){['Yes','No'].forEach(function(o){probe.textContent=o;if(probe.offsetWidth>mw)mw=probe.offsetWidth;});}
    S.filtered.slice(0,300).forEach(function(row){probe.textContent=cellVal(row,k);if(probe.offsetWidth>mw)mw=probe.offsetWidth;});
    return mw+pad;
  }
  // Optimise = each column hugs the greater of its 2-line header minimum and its (widget-aware) content width.
  /* Date columns hold their measured width; every other column hugs its content. */
  function optimiseWidths(){
    var probe=document.createElement('span');probe.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;font:'+S.fontSize+'px "Segoe UI",Arial';root.appendChild(probe);
    visKeys().forEach(function(k){
      if(isDateCol(k)){delete S.cols[k].userW;S.cols[k].w=dateColW();return;}
      S.cols[k].w=Math.min(460,Math.max(minHW(k),dataMinW(k,probe)));
    });
    probe.remove();saveCfg();renderTable();
  }

  function contentW(k,probe){return dataMinW(k,probe);}
  /* Fit to 1 Page. Date columns are pinned at their measured width and take no
     part in the fit; everything else shares what is left, and a column given a
     Fit priority in the Columns panel is topped up to its content width first,
     lowest number first. Blank priorities rank equally, after the numbered ones. */
  function fitOnePage(){
    var tw=root.querySelector('.tablewrap');if(!tw)return;
    var keys=visKeys();if(!keys.length)return;
    var PAD_OH=13;
    var avail=Math.max(240,tw.clientWidth-18-(typeof SELW==='number'?SELW:0)-keys.length*PAD_OH);
    var fixed=keys.filter(isDateCol),flex=keys.filter(function(k){return !isDateCol(k);});
    fixed.forEach(function(k){delete S.cols[k].userW;S.cols[k].w=dateColW();avail-=dateColW();});
    if(!flex.length){saveCfg();renderTable();return;}
    avail=Math.max(120,avail);
    var probe=document.createElement('span');probe.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;font:'+S.fontSize+'px "Segoe UI",Arial';root.appendChild(probe);
    var floorMin={},floorData={},desired={},sumMinH=0,sumData=0;
    flex.forEach(function(k){
      var fm=Math.ceil(minHW(k)),fd=Math.ceil(Math.max(fm,Math.min(dataMinW(k,probe),160)));
      floorMin[k]=fm;floorData[k]=fd;desired[k]=Math.max(fd,Math.min(460,dataMinW(k,probe)));
      sumMinH+=fm;sumData+=fd;
    });
    probe.remove();
    var noClip=(sumData<=avail),mins=noClip?floorData:floorMin,sumMin=noClip?sumData:sumMinH;
    flex.forEach(function(k){S.cols[k].w=mins[k];});
    var leftover=avail-sumMin;
    var pri=flex.filter(function(k){return colPri(k)!=null;}).sort(function(a,b){return colPri(a)-colPri(b);});
    var rest0=flex.filter(function(k){return colPri(k)==null;});
    /* When there is nothing spare, a priority still has to mean something: squeeze
       the unprioritised columns to a tight floor and hand what that frees to the
       prioritised ones. Their headers clip; that is the point of setting a priority. */
    if(leftover<=0&&pri.length&&rest0.length){
      var freed=0;
      rest0.forEach(function(k){var t=Math.min(mins[k],34);freed+=mins[k]-t;S.cols[k].w=t;});
      leftover+=freed;
    }
    if(leftover<=0){saveCfg();renderTable();return;}
    pri.forEach(function(k){
      if(leftover<=0)return;
      var want=Math.max(0,desired[k]-mins[k]);
      var give=Math.min(want,leftover);
      S.cols[k].w=mins[k]+give;leftover-=give;
    });
    var rest=rest0;
    if(leftover>0&&rest.length){
      var sumExtra=0;rest.forEach(function(k){sumExtra+=Math.max(0,desired[k]-mins[k]);});
      if(sumExtra>0){rest.forEach(function(k){var extra=Math.max(0,desired[k]-mins[k]);S.cols[k].w=Math.round(mins[k]+leftover*(extra/sumExtra));});}
      else{var per=Math.floor(leftover/rest.length);rest.forEach(function(k){S.cols[k].w=mins[k]+per;});}
    }
    saveCfg();renderTable();
  }

  function resetCols(){var b;try{var d=localStorage.getItem(DKEY);if(d)b=mergeCfg(JSON.parse(d));}catch(e){}if(!b)b=factoryCfg();S.order=b.order;S.cols=b.cols;S.colPri=b.colPri||{};S.colDefW=b.colDefW||{};S.fontSize=b.fontSize;S.rowPad=b.rowPad;S.wrap=b.wrap;S.chartType=b.chartType;if(b.selFilters)S.selFilters=b.selFilters;S.chartScale=b.chartScale||1;if(b.colorSchemes)S.colorSchemes=normSchemes(b.colorSchemes);if(b.collapsed)S.collapsed=b.collapsed;S.fontScale=b.fontScale||100;S.padScale=b.padScale||100;S.statusSel=b.statusSel||'__ALL__';S.typeSel=(b.typeSel!=null?b.typeSel:null);S.colNames=b.colNames||{};S.statusList=(b.statusList&&b.statusList.length?b.statusList:STATUS_WORKFLOW.slice());S.doScale=b.doScale||1;S.doHideClosed=!!b.doHideClosed;S.chartAutoFit=b.chartAutoFit!==false;applyScope();saveCfg();renderAll();}
  function setAsDefault(){try{localStorage.setItem(DKEY,JSON.stringify({order:S.order,cols:S.cols,fontSize:S.fontSize,rowPad:S.rowPad,wrap:S.wrap,chartType:S.chartType,selFilters:S.selFilters,chartScale:S.chartScale,colorSchemes:S.colorSchemes,fontFamily:S.fontFamily,baseFont:S.baseFont,darkMode:S.darkMode,collapsed:S.collapsed,fontScale:S.fontScale,padScale:S.padScale,hpadScale:S.hpadScale,hdrFontSize:S.hdrFontSize,hdrMaxLines:S.hdrMaxLines,statusSel:S.statusSel,typeSel:S.typeSel,colPri:S.colPri,colDefW:S.colDefW,colNames:S.colNames,statusList:S.statusList,doScale:S.doScale,doStat:S.doStat,doHideClosed:S.doHideClosed,chartAutoFit:S.chartAutoFit}));}catch(e){}toast('Saved as your default view');}
  // Toast: stays 10s, can be dismissed with the x, and pauses while the pointer is over
  // it so a long message can actually be read. Only one at a time — a second message
  // replaces the first instead of stacking on the same spot. If the persistent Open
  // Selected notice is on screen the toast sits above it rather than over it.
  function toast(msg){
    var w=root.getElementById('wrap'); if(!w)return;
    var old=root.getElementById('mps-toast'); if(old){clearTimeout(old.__tm);old.remove();}
    var hp=root.getElementById('mps-popuphelp');
    var bottom=hp?(Math.round(hp.getBoundingClientRect().height)+26):16;
    var t=el('div',{id:'mps-toast',style:'position:absolute;bottom:'+bottom+'px;left:50%;transform:translateX(-50%);background:'+NAVY+';color:#fff;padding:8px 34px 8px 16px;border-radius:6px;font-size:12px;line-height:1.45;max-width:72%;z-index:21;box-shadow:0 4px 16px rgba(0,0,0,.25)'},[msg]);
    var x=el('a',{title:'Dismiss this message',style:'position:absolute;top:3px;right:8px;cursor:pointer;font-weight:700;color:#9fb6d0;text-decoration:none;font-size:13px'},['✕']);
    x.onmouseenter=function(){x.style.color='#fff';};
    x.onmouseleave=function(){x.style.color='#9fb6d0';};
    x.onclick=function(){clearTimeout(t.__tm);t.remove();};
    t.appendChild(x);
    function arm(ms){clearTimeout(t.__tm);t.__tm=setTimeout(function(){t.remove();},ms);}
    t.onmouseenter=function(){clearTimeout(t.__tm);};
    t.onmouseleave=function(){arm(2500);};
    w.appendChild(t); arm(10000);
  }

  // ---- XLSX export (self-contained) ----
  var CRC=(function(){var c,t=[];for(var n=0;n<256;n++){c=n;for(var k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
  function crc32(b){var c=0xFFFFFFFF;for(var i=0;i<b.length;i++)c=CRC[(c^b[i])&0xFF]^(c>>>8);return (c^0xFFFFFFFF)>>>0;}
  function u8(s){return new TextEncoder().encode(s);}function numB(n,l){var a=new Uint8Array(l);for(var i=0;i<l;i++){a[i]=n&0xFF;n=Math.floor(n/256);}return a;}
  function zipStore(files){var ch=[],cen=[],off=0;function push(a){ch.push(a);off+=a.length;}files.forEach(function(f){var nm=u8(f.name),crc=crc32(f.data),st=off;push(new Uint8Array([80,75,3,4]));push(numB(20,2));push(numB(0,2));push(numB(0,2));push(numB(0,2));push(numB(0,2));push(numB(crc,4));push(numB(f.data.length,4));push(numB(f.data.length,4));push(numB(nm.length,2));push(numB(0,2));push(nm);push(f.data);cen.push({nm:nm,crc:crc,sz:f.data.length,off:st});});var cs=off;cen.forEach(function(c){push(new Uint8Array([80,75,1,2]));push(numB(20,2));push(numB(20,2));push(numB(0,2));push(numB(0,2));push(numB(0,2));push(numB(0,2));push(numB(c.crc,4));push(numB(c.sz,4));push(numB(c.sz,4));push(numB(c.nm.length,2));push(numB(0,2));push(numB(0,2));push(numB(0,2));push(numB(0,2));push(numB(0,4));push(numB(c.off,4));push(c.nm);});var ce=off;push(new Uint8Array([80,75,5,6]));push(numB(0,2));push(numB(0,2));push(numB(cen.length,2));push(numB(cen.length,2));push(numB(ce-cs,4));push(numB(cs,4));push(numB(0,2));var tot=0;ch.forEach(function(c){tot+=c.length;});var out=new Uint8Array(tot),p=0;ch.forEach(function(c){out.set(c,p);p+=c.length;});return out;}
  function xesc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function colLetter(i){var s='';i++;while(i>0){var m=(i-1)%26;s=String.fromCharCode(65+m)+s;i=Math.floor((i-1)/26);}return s;}
  function argb(h){return 'FF'+String(h||'#8a939b').replace('#','').toUpperCase();}
  function buildXlsx(keys,rows){
    var fills=['<fill><patternFill patternType="none"/></fill>','<fill><patternFill patternType="gray125"/></fill>','<fill><patternFill patternType="solid"><fgColor rgb="'+argb(NAVY)+'"/></patternFill></fill>'];
    var fillMap={};function fillFor(hex){var a=argb(hex);if(fillMap[a]!=null)return fillMap[a];fillMap[a]=fills.length;fills.push('<fill><patternFill patternType="solid"><fgColor rgb="'+a+'"/></patternFill></fill>');return fillMap[a];}
    var swatches=[closedColor('yes'),closedColor('no'),senderColor('MPS'),senderColor('BHP'),YESNO_COLORS.yes,YESNO_COLORS.no];swatches.forEach(fillFor);
    var fonts=['<font><sz val="11"/><name val="Calibri"/></font>','<font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Calibri"/></font>'];
    var xfs=['<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>','<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center"/></xf>'];
    var xfMap={};function xfFor(hex){var f=fillFor(hex);if(xfMap[f]!=null)return xfMap[f];xfMap[f]=xfs.length;xfs.push('<xf numFmtId="0" fontId="1" fillId="'+f+'" borderId="0" xfId="0" applyFont="1" applyFill="1"/>');return xfMap[f];}
    function styleFor(k,row){var v=row[k];if(k==='closed'&&v)return xfFor(closedColor(v));if(k==='sender'&&v)return xfFor(senderColor(v));if((k==='eot'||k==='costVar')&&v){var c=yesnoColor(k,v);if(c)return xfFor(c);}return 0;}
    var styles='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="'+fonts.length+'">'+fonts.join('')+'</fonts><fills count="'+fills.length+'">'+fills.join('')+'</fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="'+xfs.length+'">'+xfs.join('')+'</cellXfs></styleSheet>';
    var colsXml='<cols>'+keys.map(function(k,i){return '<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+Math.max(8,Math.round(S.cols[k].w/7))+'" customWidth="1"/>';}).join('')+'</cols>';
    var rowsXml='<row r="1">'+keys.map(function(k,i){return '<c r="'+colLetter(i)+'1" t="inlineStr" s="1"><is><t xml:space="preserve">'+xesc(colLabel(k))+'</t></is></c>';}).join('')+'</row>';
    rows.forEach(function(row,ri){var r=ri+2;rowsXml+='<row r="'+r+'">'+keys.map(function(k,i){var v=cellVal(row,k),s=styleFor(k,row);return '<c r="'+colLetter(i)+r+'" t="inlineStr" s="'+s+'"><is><t xml:space="preserve">'+xesc(v)+'</t></is></c>';}).join('')+'</row>';});
    var lastCol=colLetter(keys.length-1),lastRow=rows.length+1;
    var sheet='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="15"/>'+colsXml+'<sheetData>'+rowsXml+'</sheetData><autoFilter ref="A1:'+lastCol+lastRow+'"/></worksheet>';
    var wb='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="RFITQ Register" sheetId="1" r:id="rId1"/></sheets></workbook>';
    var wbRels='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>';
    var rels='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
    var ct='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>';
    return zipStore([{name:'[Content_Types].xml',data:u8(ct)},{name:'_rels/.rels',data:u8(rels)},{name:'xl/workbook.xml',data:u8(wb)},{name:'xl/_rels/workbook.xml.rels',data:u8(wbRels)},{name:'xl/styles.xml',data:u8(styles)},{name:'xl/worksheets/sheet1.xml',data:u8(sheet)}]);
  }
  function exportExcel(){try{var keys=visKeys(),data=buildXlsx(keys,S.filtered);var blob=new Blob([data],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Aconex_RFITQ_Register_'+CFG.mpsProjectNo+'_'+new Date().toISOString().slice(0,10)+'.xlsx';document.documentElement.appendChild(a);a.click();a.remove();}catch(e){alert('Export failed: '+e);}}

  function boot(){ensureShell();host.style.display='block';if(!S.allRows.length){initRows();if(ghToken())ghLoad();}applyScope();renderAll();maybeFullScan();}
  function maybeAutoCrosscheck(){try{if(__xSyncing)return;var pid=S.xProjectId||detectProjectId();if(!pid)return;var c=loadXCache();var hasX=false;try{hasX=!!localStorage.getItem('mps_aconex_rfi_xdata_73409');}catch(e){}if(hasX&&c&&c.ts&&(Date.now()-c.ts)<7200000)return;setTimeout(function(){crosscheckMail(null);},700);}catch(e){}}
  function close(){if(host)host.style.display='none';}
  window.__MPS_ACONEX_RFI={__live:true,boot:boot,close:close,_state:S,_cfg:CFG,buildXlsx:buildXlsx,crosscheck:crosscheckMail};
  boot();
})();
