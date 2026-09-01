/* =====================================================================
 * MPS GROUP — Aconex Register Dashboard (ITP module) v10
 * v10 adds: fit-width Columns dropdown, Row Density label, title-case
 * buttons, collapsible panels, Pie chart mode, CCMS panel-header font,
 * Fonts selector, auto/expandable bar graph, Dark Mode, version badge.
 * Earlier: font +/-, ultra-tight row density, CCMS-style column system,
 * CHARTS panel with Procore-style per-phase bar charts (value labels,
 * Y-axis ticks, X-axis labels) and donuts with per-chart legends,
 * multi-select persistent filters (Subsystem/Lifecycle/Status),
 * column toolbar sits directly above the headers, +2pt header font,
 * BHP report manual pre-fill (Phase, To Action, Date Required, Comment).
 * Live data via Aconex REST API.
 * ===================================================================== */
(function () {
  'use strict';
  if (window.__MPS_ACONEX && window.__MPS_ACONEX.__live) { window.__MPS_ACONEX.boot(); return; }

  var NAVY='#0B2A4A', NAVY2='#123a63', ACCENT='#F26522', LINE='#dfe4ea', INK='#1f2d3d';
  var VERSION='v12.3', BUILD_DATE='1 Sep 2026';
  var UI_FONTS=['Segoe UI','Arial','Calibri','Helvetica','Roboto','Verdana','Tahoma','Trebuchet MS','Georgia','Times New Roman','Courier New','system-ui'];
  var DEF_FONT='"Segoe UI",Arial,sans-serif', DEF_BASEPX=13;
  function fontStack(f){return f?('"'+f+'","Segoe UI",Arial,sans-serif'):DEF_FONT;}
  // Status background colours (lowercase key). Text colour + fallbacks handled in statusFg().
  var STATUS_COLORS={'reviewed':'#2b6cb0','submitted':'#1e7e34','reviewed with comments':'#e0a800','revise and resubmit':'#e05a1c','superseded':'#8a939b','obsolete':'#39424d','information only':'#ffffff'};
  // Logical workflow order for charts/legends (unknowns sort to the end).
  var STATUS_ORDER=['information only','submitted','under review','reviewed with comments','revise and resubmit','reviewed','approved','for review','for approval','superseded','obsolete'];
  // Shortened display labels to save column width.
  var STATUS_DISPLAY={'revise and resubmit':'Revise & Resubmit','reviewed with comments':'Reviewed w/Comment'};
  // Lifecycle Status (Aconex Attribute2) colours + logical workflow order.
  // Workflow: For Review (orange) > For Approval (green) > For Use (blue).
  var LIFECYCLE_COLORS={'for information':'#ffffff','for review':'#e05a1c','for approval':'#1e7e34','for use':'#2b6cb0','for construction':'#2b6cb0','superseded':'#8a939b','obsolete':'#39424d','void':'#39424d'};
  var LIFECYCLE_ORDER=['for information','for review','for approval','for use','for construction','superseded','obsolete','void'];
  // To Action colours (editable text column). Default: Approved = blue.
  var TOACTION_COLORS={'approved':'#2b6cb0'};
  var PRIORITIES=['','Very Low','Low','Medium','High','Urgent','Critical'];
  var PRIORITY_COLORS={'Very Low':'#8a939b','Low':'#1e7e34','Medium':'#e0a800','High':'#e08e0b','Urgent':'#e05a1c','Critical':'#c0392b'};
  var PHASE_PALETTE=['#2b6cb0','#1e7e34','#e0a800','#8a5db0','#e05a1c','#00897b','#c0392b','#5a4bc4'];
  var DEFAULT_PHASES=[{id:'1',label:'Phase 1'},{id:'2',label:'Phase 2'},{id:'3',label:'Phase 3'},{id:'Generic',label:'Generic'}];
  function phaseLabel(id){for(var i=0;i<S.phases.length;i++)if(S.phases[i].id===id)return S.phases[i].label;return id||'';}
  function phaseColor(id){var cs=schemeGet('phase',id);if(cs)return cs;for(var i=0;i<S.phases.length;i++)if(S.phases[i].id===id)return PHASE_PALETTE[i%PHASE_PALETTE.length];return '#c2c9d2';}
  // ---- BHP Report phase pre-fill (DocumentNumber -> Phase) ----
  var BHP_PHASE={
    'MPSBE-1202158-ITP-0017':'1','MPSBE-1202158-ITP-0018':'1','MPSBE-1202158-ITP-0020':'1','MPSBE-1202158-ITP-0021':'1',
    'MPSBE-1202158-ITP-0022':'1','MPSBE-1202158-ITP-0023':'1','MPSBE-1202158-ITP-0024':'1','MPSBE-1202158-ITP-0025':'1',
    'MPSBE-1202158-ITP-0026':'1','MPSBE-1202158-ITP-0027':'Generic','MPSBE-1202158-ITP-0029':'2','MPSBE-1202158-ITP-0030':'2',
    'MPSBE-1202158-ITP-0031':'2','MPSBE-1202158-ITP-0032':'2','MPSBE-1202158-ITP-0033':'2','MPSBE-1202158-ITP-0034':'2',
    'MPSBE-1202158-ITP-0035':'2','MPSBE-1202158-ITP-0036':'2','MPSBE-1202158-ITP-0037':'2','MPSBE-1202158-ITP-0038':'2',
    'MPSBE-1202158-ITP-0039':'2','MPSBE-1202158-ITP-0040':'1','MPSBE-1202158-ITP-0041':'Generic','MPSBE-1202158-ITP-0042':'2',
    'MPSBE-1202158-ITP-0043':'3'
  };
  // ---- BHP Report manual pre-fill (DocumentNumber -> {toAction,dateRequired,comment}) — editable defaults ----
  var BHP_MANUAL={
    'MPSBE-1202158-ITP-0017':{toAction:"Approved"},
    'MPSBE-1202158-ITP-0018':{toAction:"Approved"},
    'MPSBE-1202158-ITP-0020':{toAction:"BHP"},
    'MPSBE-1202158-ITP-0021':{toAction:"Approved"},
    'MPSBE-1202158-ITP-0022':{toAction:"Approved"},
    'MPSBE-1202158-ITP-0023':{toAction:"BHP"},
    'MPSBE-1202158-ITP-0024':{toAction:"Approved"},
    'MPSBE-1202158-ITP-0025':{toAction:"Approved"},
    'MPSBE-1202158-ITP-0026':{toAction:"BHP"},
    'MPSBE-1202158-ITP-0027':{toAction:"Approved",dateRequired:"2026-05-29",comment:"Generic ITP for all phases, change doc title"},
    'MPSBE-1202158-ITP-0029':{toAction:"BHP",dateRequired:"2026-08-10"},
    'MPSBE-1202158-ITP-0030':{toAction:"MPS",dateRequired:"2026-08-10",comment:"Needs subsytem updated in title"},
    'MPSBE-1202158-ITP-0031':{toAction:"MPS",dateRequired:"2026-08-10",comment:"Needs subsytem updated in title"},
    'MPSBE-1202158-ITP-0032':{toAction:"MPS",dateRequired:"2026-08-10"},
    'MPSBE-1202158-ITP-0033':{dateRequired:"2026-08-10",comment:"Needs subsytem updated in title"},
    'MPSBE-1202158-ITP-0034':{toAction:"BHP",dateRequired:"2026-08-10"},
    'MPSBE-1202158-ITP-0035':{toAction:"MPS",dateRequired:"2026-08-10",comment:"Needs subsytem updated in title"},
    'MPSBE-1202158-ITP-0036':{toAction:"BHP",dateRequired:"2026-08-10"},
    'MPSBE-1202158-ITP-0037':{dateRequired:"2026-08-10",comment:"Needs subsytem updated in title"},
    'MPSBE-1202158-ITP-0038':{toAction:"BHP",dateRequired:"2026-08-10",comment:"Needs subsytem updated in title"},
    'MPSBE-1202158-ITP-0039':{toAction:"BHP",dateRequired:"2026-08-10"},
    'MPSBE-1202158-ITP-0040':{toAction:"BHP",dateRequired:"2026-08-10",comment:"Needs subsytem updated in title"},
    'MPSBE-1202158-ITP-0041':{dateRequired:"2026-08-10"},
    'MPSBE-1202158-ITP-0042':{toAction:"BHP",dateRequired:"2026-08-10"},
    'MPSBE-1202158-ITP-0043':{toAction:"BHP",dateRequired:"2026-09-10",comment:"Needs subsytem updated in title"}
  };

  var CFG={projectId:detectProjectId(),projectName:'CNPI CUSA',docScope:'MPSBE-1202158-*',defaultDeliverable:'Inspection and Test Plan'};
  function detectProjectId(){try{var m=(document.documentElement.innerHTML||'').match(/projectId["'=:\s]+(\d{10,})/);if(m)return m[1];}catch(e){}return '2013294019';}

  // Column catalogue (label, group, default width, edit type, tooltip). Order below = BHP Report default order, then extras.
  var COLDEF={
    rowNo:{label:'Count',w:80,nosort:true,tip:'Row count in the current view. 🗎 opens the file/PDF; ✎ opens the document to update — both for the Document No in this row.'},
    docNo:{label:'Document No',w:170,tip:'Aconex document number'},
    title:{label:'Title',w:300,tip:'Document title in Aconex'},
    subsystem:{label:'Subsystem',w:95,dfilter:true,tip:'Subsystem code parsed from the title (e.g. 3150-02-01)'},
    subsystemName:{label:'Subsystem Name',w:140,tip:'Subsystem description parsed from the title'},
    revision:{label:'REV',w:60,tip:'Current revision'},
    status:{label:'Status',w:150,dfilter:true,tip:'Aconex document status'},
    dateModified:{label:'Date Modified',w:110,type:'date',tip:'Date the current version was last modified in Aconex'},
    lifecycleStatus:{label:'Lifecycle Status',w:120,dfilter:true,tip:'Aconex lifecycle status (e.g. For Use)'},
    phase:{label:'Phase',w:95,edit:'phase',tip:'Project phase — not held in Aconex; select manually. Pre-filled from the BHP report.'},
    toAction:{label:'To Action',w:120,edit:'text',dfilter:true,tip:'MPS tracking: who the document is with / next action'},
    dateRequired:{label:'Date Required',w:120,edit:'date',tip:'MPS tracking: date the outcome is required'},
    comment:{label:'Comment',w:240,edit:'text',tip:'MPS tracking: free-text comment'},
    // extras (hidden by default)
    fileType:{label:'File',w:48,tip:'File type of the current version'},
    transmittalNo:{label:'Transmittal No',w:120,edit:'text',tip:'MPS tracking: transmittal number'},
    priority:{label:'Priority',w:110,edit:'priority',tip:'MPS tracking: priority (colour-coded)'},
    dateResub1:{label:'Date Resubmitted 1',w:130,edit:'date',tip:'MPS tracking: first resubmission date'},
    dateResub2:{label:'Date Resubmitted 2',w:130,edit:'date',tip:'MPS tracking: second resubmission date'},
    discipline:{label:'Discipline / Function',w:150,tip:'Aconex discipline / function'},
    type:{label:'Type',w:150,tip:'Aconex document type'},
    packageNo:{label:'Package No',w:180,tip:'Aconex package number'},
    deliverableType:{label:'Deliverable Type',w:150,tip:'Aconex deliverable type (SelectList1)'},
    deliverableName:{label:'Deliverable Name (EIM)',w:170,tip:'Aconex deliverable name (SelectList2)'},
    createdBy:{label:'Created By',w:160,tip:'Author organisation'},
    dateCreated:{label:'Date Created',w:110,type:'date',tip:'Date the document was created in Aconex'},
    versionNumber:{label:'Version',w:60,tip:'Aconex version number'},
    reviewStatus:{label:'Review Status',w:110,tip:'Aconex review status'},
    comments:{label:'Aconex Comments',w:200,tip:'Comments held in Aconex'},
    trackingId:{label:'Tracking ID',w:100,tip:'Aconex tracking id'}
  };
  var FACTORY_ORDER=['rowNo','docNo','title','subsystem','subsystemName','revision','status','dateModified','lifecycleStatus','phase','toAction','dateRequired','comment','fileType','transmittalNo','priority','dateResub1','dateResub2','discipline','type','packageNo','deliverableType','deliverableName','createdBy','dateCreated','versionNumber','reviewStatus','comments','trackingId'];
  var FACTORY_SHOW={rowNo:1,docNo:1,title:1,subsystem:1,subsystemName:1,revision:1,status:1,dateModified:1,lifecycleStatus:1,phase:1,toAction:1,dateRequired:1,comment:1};

  function factoryCfg(){
    var cols={}; FACTORY_ORDER.forEach(function(k){cols[k]={show:!!FACTORY_SHOW[k],w:COLDEF[k].w};});
    return {order:FACTORY_ORDER.slice(),cols:cols,fontSize:12,rowPad:4,wrap:false,phases:DEFAULT_PHASES.map(function(p){return {id:p.id,label:p.label};}),chartType:'donut',hiddenDonuts:[],selFilters:{},chartScale:1,colorSchemes:{status:{},lifecycleStatus:{},phase:{},toAction:{},dateRequired:{}},fontFamily:'',baseFont:DEF_BASEPX,darkMode:false,collapsed:{},barExpanded:false,chartDataField:'status',fontScale:100,padScale:100,hpadScale:100,hdrFontSize:null,hdrMaxLines:2,colNames:{},packageSel:null,packageText:{}};
  }
  var LKEY='mps_aconex_cfg_'+CFG.projectId, DKEY='mps_aconex_defcfg_'+CFG.projectId;
  function loadCfg(){
    try{var live=localStorage.getItem(LKEY);if(live)return mergeCfg(JSON.parse(live));}catch(e){}
    try{var d=localStorage.getItem(DKEY);if(d)return mergeCfg(JSON.parse(d));}catch(e){}
    return factoryCfg();
  }
  function mergeCfg(saved){var f=factoryCfg();var o=(saved.order||f.order).filter(function(k){return COLDEF[k];});FACTORY_ORDER.forEach(function(k){if(o.indexOf(k)<0)o.push(k);});o=o.filter(function(k){return k!=='rowNo';});o.unshift('rowNo');var cols={};o.forEach(function(k){var s=(saved.cols||{})[k]||{};cols[k]={show:s.show!=null?!!s.show:!!FACTORY_SHOW[k],w:s.w||COLDEF[k].w};});if(cols.rowNo&&cols.rowNo.w<80)cols.rowNo.w=80;return {order:o,cols:cols,fontSize:saved.fontSize||12,rowPad:(saved.rowPad!=null?saved.rowPad:4),wrap:!!saved.wrap,phases:(saved.phases&&saved.phases.length?saved.phases:f.phases),chartType:saved.chartType||'donut',hiddenDonuts:saved.hiddenDonuts||[],selFilters:saved.selFilters||{},chartScale:saved.chartScale||1,colorSchemes:normSchemes(saved.colorSchemes),fontFamily:saved.fontFamily||'',baseFont:saved.baseFont||DEF_BASEPX,darkMode:!!saved.darkMode,collapsed:saved.collapsed||{},barExpanded:!!saved.barExpanded,chartDataField:saved.chartDataField||'status',fontScale:saved.fontScale||(saved.baseFont?Math.round(saved.baseFont/DEF_BASEPX*100):100),padScale:saved.padScale||100,hpadScale:saved.hpadScale||100,hdrFontSize:(saved.hdrFontSize!=null?saved.hdrFontSize:null),hdrMaxLines:saved.hdrMaxLines||2,colNames:saved.colNames||{},packageSel:(saved.packageSel!=null?saved.packageSel:null),packageText:saved.packageText||{}};}
  function normSchemes(cs){cs=cs||{};return {status:cs.status||{},lifecycleStatus:cs.lifecycleStatus||{},phase:cs.phase||{},toAction:cs.toAction||{},dateRequired:cs.dateRequired||{}};}
  function saveCfg(){try{localStorage.setItem(LKEY,JSON.stringify({order:S.order,cols:S.cols,fontSize:S.fontSize,rowPad:S.rowPad,wrap:S.wrap,phases:S.phases,chartType:S.chartType,hiddenDonuts:S.hiddenDonuts,selFilters:S.selFilters,chartScale:S.chartScale,colorSchemes:S.colorSchemes,fontFamily:S.fontFamily,baseFont:S.baseFont,darkMode:S.darkMode,collapsed:S.collapsed,barExpanded:S.barExpanded,chartDataField:S.chartDataField,fontScale:S.fontScale,padScale:S.padScale,hpadScale:S.hpadScale,hdrFontSize:S.hdrFontSize,hdrMaxLines:S.hdrMaxLines,colNames:S.colNames,packageSel:S.packageSel,packageText:S.packageText}));}catch(e){}}

  var C=loadCfg();
  var S={allRows:[],rows:[],filtered:[],loading:false,error:'',deliverableType:CFG.defaultDeliverable,deliverableTypes:[],
         globalSearch:'',colFilters:{},sortKey:'',sortDir:1,
         order:C.order,cols:C.cols,fontSize:C.fontSize,rowPad:C.rowPad,wrap:C.wrap,
         phases:C.phases,chartType:C.chartType,hiddenDonuts:C.hiddenDonuts,selFilters:C.selFilters,chartScale:C.chartScale,colorSchemes:C.colorSchemes,
         fontFamily:C.fontFamily,baseFont:C.baseFont,darkMode:C.darkMode,collapsed:C.collapsed,barExpanded:C.barExpanded,chartDataField:C.chartDataField,fontScale:C.fontScale,padScale:C.padScale,hpadScale:C.hpadScale||100,hdrFontSize:C.hdrFontSize,hdrMaxLines:C.hdrMaxLines||2,colNames:C.colNames||{},
         packageSel:C.packageSel,packageText:C.packageText||{},
         overrides:loadOverrides()};
  function loadOverrides(){try{return JSON.parse(localStorage.getItem('mps_aconex_itp_'+CFG.projectId)||'{}');}catch(e){return {};}}
  function saveOverrides(){try{localStorage.setItem('mps_aconex_itp_'+CFG.projectId,JSON.stringify(S.overrides));}catch(e){}}
  // ---- Aconex document deep-links (view / file / update all land on the Document Properties page) ----
  // The viewer lives at /rsrc/{buildVersion}/en_AU_DOC/document/view/index.html and the build version
  // changes with Aconex releases, so detect it at runtime (cached) with a sane fallback.
  var RSRC_KEY='mps_aconex_rsrc';
  var RSRC=(function(){try{var c=JSON.parse(localStorage.getItem(RSRC_KEY)||'null');return (c&&c.v)?c.v:'20260714.1352';}catch(e){return '20260714.1352';}})();
  function refreshRsrc(){try{fetch('/SearchControlledDoc?SEARCH_ACTION=DOCUMENT_SEARCH_INITIAL&moduleKey=controlledDoc&projectId='+CFG.projectId,{credentials:'include'}).then(function(r){return r.text();}).then(function(t){var m=t.match(/\/rsrc\/([0-9.]+)\//);if(m){var v=m[1];try{localStorage.setItem(RSRC_KEY,JSON.stringify({v:v,t:0}));}catch(e){}if(v!==RSRC){RSRC=v;var tw=root&&root.querySelector('.tablewrap table');if(tw)renderTable();}}}).catch(function(){});}catch(e){}}
  function docUrl(docId){return 'https://au1.aconex.com/hub/index.html?mainTarget='+encodeURIComponent('/rsrc/'+RSRC+'/en_AU_DOC/document/view/index.html?ControlledDocument_ID='+docId+'&ControlledDocument_projectID='+CFG.projectId);}
  // direct file download (Content-Disposition: attachment, .pdf) — needs only docId + pid
  function fileUrl(docId){return 'https://au1.aconex.com/api/projects/'+CFG.projectId+'/register/'+docId+'/markedup';}
  // ---- Transmittal auto-sync (item 6): crawl sent transmittals, map each doc to its latest transmittal ----
  var TXKEY='mps_aconex_tx_'+CFG.projectId, __txSyncing=false;
  function loadTxCache(){try{return JSON.parse(localStorage.getItem(TXKEY)||'null');}catch(e){return null;}}
  function saveTxCache(o){try{localStorage.setItem(TXKEY,JSON.stringify(o));}catch(e){}}
  function lastSyncText(){var c=loadTxCache();if(!c||!c.ts)return 'Transmittals: not synced';var h=(Date.now()-c.ts)/3600000;if(h<0)h=0;return 'Last Sync '+h.toFixed(1)+'h ago';}
  function syncTransmittals(btn){
    if(__txSyncing)return;__txSyncing=true;
    var pid=CFG.projectId, orig=btn?btn.textContent:'⟳ Sync Transmittals';
    function setb(t){if(btn)btn.textContent=t;}
    (async function(){
      try{
        // Full coverage: crawl BOTH boxes; the mail API caps each list at 250, so we page
        // backward by sentdate window. A transmittal number can be in the MailNo (Transmittal
        // type) OR in the Subject (Workflow Transmittal etc.), so match either.
        var map={},seen={},done=0;
        function listUrl(box,cutoff){return '/api/projects/'+pid+'/mail?mail_box='+box+'&page_size=250&search_query='+encodeURIComponent('sentdate:[* TO '+cutoff+']');}
        async function crawl(ids){
          var idx=0,CONC=10,minDate=null;
          async function worker(){
            while(idx<ids.length){var id=ids[idx++];
              try{var rr=await fetch('/api/projects/'+pid+'/mail/'+id,{headers:{Accept:'application/xml'},credentials:'include'});
                var dd=new DOMParser().parseFromString(await rr.text(),'text/xml'),rt=dd.documentElement;
                var sd=(rt.querySelector('SentDate')||{}).textContent||'';if(sd&&(minDate===null||sd<minDate))minDate=sd;
                var mno=(rt.querySelector('MailNo')||{}).textContent||'', subj=(rt.querySelector('Subject')||{}).textContent||'';
                var tx=(mno.match(/MPSBE-TRANSMIT-\d+/)||[])[0]||(subj.match(/MPSBE-TRANSMIT-\d+/)||[])[0]||null;
                if(tx){var ts=Date.parse(sd)||0;
                  Array.prototype.forEach.call(rt.querySelectorAll('RegisteredDocumentAttachment'),function(a){var dnEl=a.querySelector('DocumentNo');if(!dnEl)return;var k=dnEl.textContent;if(!map[k]||ts>map[k].ts)map[k]={no:tx,ts:ts};});
                }
              }catch(e){}
              done++;if(done%5===0)setb('Syncing… '+done);
            }
          }
          var ws=[];for(var w=0;w<CONC;w++)ws.push(worker());await Promise.all(ws);
          return minDate;
        }
        setb('Syncing…');
        var boxes=['sentbox','inbox'];
        for(var bi=0;bi<boxes.length;bi++){var cutoff='2099-01-01';
          for(var iter=0;iter<12;iter++){
            var r=await fetch(listUrl(boxes[bi],cutoff),{headers:{Accept:'application/xml'},credentials:'include'});
            var dd=new DOMParser().parseFromString(await r.text(),'text/xml');
            var ids=Array.prototype.map.call(dd.querySelectorAll('Mail'),function(m){return m.getAttribute('MailId');}).filter(function(id){return !seen[id];});
            if(!ids.length)break;
            ids.forEach(function(id){seen[id]=1;});
            var minD=await crawl(ids);
            if(!minD)break;
            cutoff=minD.slice(0,10);
          }
        }
        var applied=0;
        S.allRows.forEach(function(row){var m=map[row.docNo];if(m&&m.no&&row.transmittalNo!==m.no){row.transmittalNo=m.no;var o=S.overrides[row.docNo]||(S.overrides[row.docNo]={});o.transmittalNo=m.no;applied++;}});
        if(applied){saveOverrides();ghPush();}
        saveTxCache({ts:Date.now(),docs:Object.keys(map).length});
        applyScope();renderBody();
        toast('Transmittals synced — '+done+' mails scanned, '+Object.keys(map).length+' doc(s) mapped, '+applied+' updated');
      }catch(e){toast('Transmittal sync failed: '+(e&&e.message||e));}
      __txSyncing=false;setb(orig||'⟳ Sync Transmittals');
      var lbl=root.getElementById('txsync');if(lbl)lbl.textContent=lastSyncText();
    })();
  }

  // ---- GitHub team sync ----
  var GH={repo:'MPS-TK/ITR-Dashboard',branch:'main',path:'aconex/overrides_'+CFG.projectId+'.json',sha:null,timer:null,state:''};
  function ghToken(){try{return localStorage.getItem('mps_gh_token')||localStorage.getItem('__itr_gh_token__')||'';}catch(e){return '';}}
  function ghHeaders(){return {Authorization:'token '+ghToken(),Accept:'application/vnd.github+json'};}
  function applyOverridesToRows(){var keys=['phase','transmittalNo','priority','toAction','dateRequired','dateResub1','dateResub2','comment'];S.allRows.forEach(function(r){var o=S.overrides[r.docNo]||{};keys.forEach(function(k){if(o[k]!=null)r[k]=o[k];});});}
  function ghLoad(){if(!ghToken())return Promise.resolve(false);setSync('sync');return fetch('https://api.github.com/repos/'+GH.repo+'/contents/'+GH.path+'?ref='+GH.branch,{headers:ghHeaders()}).then(function(r){if(r.status===404){GH.sha=null;return null;}if(!r.ok)throw 0;return r.json();}).then(function(j){if(j){GH.sha=j.sha;var rem={};try{rem=JSON.parse(decodeURIComponent(escape(atob((j.content||'').replace(/\n/g,'')))));}catch(e){}S.overrides=Object.assign({},rem,S.overrides);saveOverrides();applyOverridesToRows();}setSync('ok');return true;}).catch(function(){setSync('err');return false;});}
  function ghPush(){if(!ghToken())return;setSync('save');clearTimeout(GH.timer);GH.timer=setTimeout(function(){var content=btoa(unescape(encodeURIComponent(JSON.stringify(S.overrides))));var body={message:'Aconex ITP overrides ('+CFG.projectName+')',content:content,branch:GH.branch};if(GH.sha)body.sha=GH.sha;fetch('https://api.github.com/repos/'+GH.repo+'/contents/'+GH.path,{method:'PUT',headers:ghHeaders(),body:JSON.stringify(body)}).then(function(r){return r.json();}).then(function(j){if(j&&j.content)GH.sha=j.content.sha;setSync(j&&j.content?'ok':'err');}).catch(function(){setSync('err');});},1200);}
  function setSync(st){GH.state=st;var b=root&&root.getElementById('syncbtn');if(b)b.textContent=syncLabel();}
  function syncLabel(){if(!ghToken())return '🔒 Connect Sync';return ({sync:'⟳ Syncing…',save:'⟳ Saving…',ok:'✓ Synced',err:'⚠ Sync Error'})[GH.state]||'✓ Team Sync';}
  function openSyncPanel(){var ex=root.getElementById('syncpanel');if(ex){ex.remove();return;}var panel=el('div',{id:'syncpanel',class:'panel',style:'right:12px;top:44px;min-width:250px'},[el('h4',{},[ghToken()?'Team sync connected':'Connect team sync']),el('div',{class:'muted',style:'font-size:11px;margin-bottom:6px;max-width:240px'},['Paste a GitHub token (repo scope) to share edits with your team. Stored only in this browser, on the Aconex site.'])]);var inp=el('input',{type:'password',placeholder:'ghp_…',style:'width:230px;border:1px solid #cfd8e3;border-radius:5px;padding:5px 8px'});var save=el('button',{class:'btn primary',style:'margin-top:8px',onclick:function(){var v=inp.value.trim();if(v){try{localStorage.setItem('mps_gh_token',v);}catch(e){}}panel.remove();ghLoad().then(function(){renderAll();});}},['Save & Connect']);panel.appendChild(inp);var row=el('div',{},[save]);if(ghToken())row.appendChild(el('button',{class:'btn',style:'margin-left:6px',onclick:function(){try{localStorage.removeItem('mps_gh_token');}catch(e){}panel.remove();renderAll();}},['Disconnect']));panel.appendChild(row);collapsiblePanel(panel);root.getElementById('wrap').appendChild(panel);}

  // ---- data ----
  function apiUrl(){var rf=['docno','title','revision','statusid','discipline','doctype','packageNumber','filetype','author','current','versionNumber','reviewStatus','comments','confidential','category','attribute1','attribute2','attribute3','attribute4','registered','revisionDate','milestoneDate','received','filename','trackingId','contractDeliverable','selectList1','selectList2','vdrCode'].join(',');return '/api/projects/'+CFG.projectId+'/register?search_query='+encodeURIComponent('docno:'+CFG.docScope)+'&page_size=500&return_fields='+rf;}
  function txt(el,sel){var n=el.querySelector(sel);return n?(n.textContent||'').trim():'';}
  function parseTitle(t){var out={subsystem:'',subsystemName:''};var after=(t||'').replace(/^.*?ITP[\s\-_]*/i,'');var m=after.match(/(\d{3,4}(?:[-_]\d{2}){1,3})[-_\s]*([^-_]*)/);if(m){out.subsystem=m[1].replace(/_/g,'-');out.subsystemName=(m[2]||'').trim().slice(0,40);}return out;}
  function fetchData(){S.loading=true;S.error='';renderAll();return fetch(apiUrl(),{headers:{Accept:'application/xml'},credentials:'include'}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.text();}).then(function(body){
      var xml=new DOMParser().parseFromString(body,'application/xml');
      S.allRows=[].slice.call(xml.querySelectorAll('Document')).map(function(el){
        var title=txt(el,'Title'),docNo=txt(el,'DocumentNumber'),d=parseTitle(title),ov=S.overrides[docNo]||{};
        var phase=(ov.phase!=null&&ov.phase!=='')?ov.phase:(BHP_PHASE[docNo]||'');
        var bm=BHP_MANUAL[docNo]||{};function pre(key){return (ov[key]!=null)?ov[key]:(bm[key]||'');}
        return {documentId:el.getAttribute('DocumentId'),fileType:txt(el,'FileType'),docNo:docNo,title:title,subsystem:d.subsystem,subsystemName:d.subsystemName,phase:phase,revision:txt(el,'Revision'),status:txt(el,'DocumentStatus'),lifecycleStatus:txt(el,'Attribute2 AttributeTypeNames'),dateModified:txt(el,'DateModified'),dateCreated:txt(el,'DateCreated'),discipline:txt(el,'Discipline'),type:txt(el,'DocumentType'),packageNo:txt(el,'PackageNumber'),deliverableType:txt(el,'SelectList1'),deliverableName:txt(el,'SelectList2'),createdBy:txt(el,'Author'),versionNumber:txt(el,'VersionNumber'),reviewStatus:txt(el,'ReviewStatus'),comments:txt(el,'Comments'),trackingId:txt(el,'TrackingId'),transmittalNo:ov.transmittalNo||'',priority:ov.priority||'',toAction:pre('toAction'),dateRequired:pre('dateRequired'),dateResub1:ov.dateResub1||'',dateResub2:ov.dateResub2||''  ,comment:pre('comment')};
      });
      var set={};S.allRows.forEach(function(r){if(r.deliverableType)set[r.deliverableType]=1;});S.deliverableTypes=Object.keys(set).sort();
      if(S.deliverableTypes.indexOf(S.deliverableType)<0&&S.deliverableTypes.length){if(S.deliverableTypes.indexOf(CFG.defaultDeliverable)<0)S.deliverableType='__ALL__';}
      S.loading=false;applyScope();renderAll();
      if(ghToken())ghLoad().then(function(ok){if(ok){applyScope();renderAll();}});
    }).catch(function(e){S.loading=false;S.error=String(e.message||e);renderAll();});}
  function applyScope(){S.rows=(S.deliverableType==='__ALL__')?S.allRows.slice():S.allRows.filter(function(r){return r.deliverableType===S.deliverableType;});if(S.packageSel&&S.packageSel.length){S.rows=S.rows.filter(function(r){return S.packageSel.indexOf(r.packageNo||'')>=0;});}applyFilters();}
  function distinctPackages(){var m={};S.allRows.forEach(function(r){var p=(S.deliverableType==='__ALL__'||r.deliverableType===S.deliverableType)?(r.packageNo||''):null;if(p!=null&&p!=='')m[p]=1;});return Object.keys(m).sort();}

  function fmtDate(v){if(!v)return '';var m=String(v).match(/^(\d{4})-(\d{2})-(\d{2})/);if(m)return m[3]+'/'+m[2]+'/'+m[1];var d=new Date(v);if(isNaN(d))return v;return ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear();}
  function parseISODay(s){var m=String(s).match(/^(\d{4})-(\d{2})-(\d{2})/);if(!m)return null;return new Date(+m[1],+m[2]-1,+m[3]).getTime();}
  function todayDay(){var d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime();}
  function styleDateInput(inp,k,val){
    inp.style.color='';inp.style.background='';inp.style.fontWeight='';
    if(!val){inp.style.color='#b6bdc7';return;} // light-grey dd/mm/yyyy placeholder
    if(k==='dateRequired'){var t=parseISODay(val);if(t==null)return;var diff=Math.round((todayDay()-t)/86400000);
      if(diff===0){inp.style.color=dateReqColor('today');inp.style.fontWeight='700';}
      else if(diff>=1&&diff<=6){inp.style.color=dateReqColor('recent');inp.style.fontWeight='700';}
      else if(diff>=7){var lc=dateReqColor('late');inp.style.background=lc;inp.style.color=lumFg(lc);inp.style.fontWeight='700';}
    }
  }
  function cellVal(row,key){var v=row[key];if(COLDEF[key]&&COLDEF[key].type==='date')return fmtDate(v);if(key==='phase')return v?phaseLabel(v):'';if(key==='packageNo'){var b=v==null?'':String(v);var ct=(b&&S.packageText)?S.packageText[b]:'';return ct?b+' — '+ct:b;}return v==null?'':String(v);}
  function applyFilters(){var g=S.globalSearch.toLowerCase();S.filtered=S.rows.filter(function(row){if(g){if(S.order.map(function(k){return cellVal(row,k);}).join(' ').toLowerCase().indexOf(g)<0)return false;}for(var k in S.colFilters){var f=(S.colFilters[k]||'').toLowerCase();if(!f)continue;if(cellVal(row,k).toLowerCase().indexOf(f)<0)return false;}for(var sk in S.selFilters){var arr=S.selFilters[sk];if(!arr)continue;if(arr.indexOf(cellVal(row,sk))<0)return false;}return true;});if(S.sortKey){S.filtered.sort(function(a,b){var x=cellVal(a,S.sortKey),y=cellVal(b,S.sortKey);return x<y?-S.sortDir:x>y?S.sortDir:0;});}}

  // ---- dom helpers ----
  var host,root;
  function el(tag,attrs,kids){var e=document.createElement(tag);if(attrs)for(var a in attrs){if(a==='style')e.setAttribute('style',attrs[a]);else if(a.slice(0,2)==='on')e[a]=attrs[a];else if(a==='title'||a==='draggable')e.setAttribute(a,attrs[a]);else e.setAttribute(a,attrs[a]);}(kids||[]).forEach(function(k){if(k==null)return;e.appendChild(typeof k==='string'?document.createTextNode(k):k);});return e;}
  function schemeGet(kind,key){var m=S.colorSchemes&&S.colorSchemes[kind];return (m&&m[key])?m[key]:null;}
  function lumFg(hex){hex=(hex||'').replace('#','');if(hex.length===3)hex=hex.replace(/(.)/g,'$1$1');var r=parseInt(hex.slice(0,2),16),g=parseInt(hex.slice(2,4),16),b=parseInt(hex.slice(4,6),16);return (0.299*r+0.587*g+0.114*b)>150?'#1f2d3d':'#ffffff';}
  function toHex6(h){h=(h||'').trim();if(/^#[0-9a-fA-F]{6}$/.test(h))return h.toLowerCase();if(/^#[0-9a-fA-F]{3}$/.test(h))return '#'+h.slice(1).replace(/(.)/g,'$1$1').toLowerCase();return '#ffffff';}
  function statusColor(v){var k=(v||'').toLowerCase();return schemeGet('status',k)||STATUS_COLORS[k]||'#ffffff';}
  function statusFg(v){var k=(v||'').toLowerCase();var c=schemeGet('status',k);if(c)return lumFg(c);if(k==='information only')return '#1e7e34';if(STATUS_COLORS[k])return '#ffffff';return '#c0392b';}
  function statusDisp(v){var k=(v||'').toLowerCase();return STATUS_DISPLAY[k]||(v||'');}
  function statusRank(v){var i=STATUS_ORDER.indexOf((v||'').toLowerCase());return i<0?99:i;}
  function statusKeySort(a,b){var ra=statusRank(a),rb=statusRank(b);return ra!==rb?ra-rb:(a<b?-1:a>b?1:0);}
  function lifeColor(v){var k=(v||'').toLowerCase();return schemeGet('lifecycleStatus',k)||LIFECYCLE_COLORS[k]||'#ffffff';}
  function lifeFg(v){var k=(v||'').toLowerCase();var c=schemeGet('lifecycleStatus',k);if(c)return lumFg(c);if(k==='for information')return '#1e7e34';if(LIFECYCLE_COLORS[k])return '#ffffff';return '#c0392b';}
  function toActionColor(v){var k=(v||'').toLowerCase();return schemeGet('toAction',k)||TOACTION_COLORS[k]||'';}
  function pluralize(w){if(!w)return w;if(/[sxz]$/i.test(w)||/(ch|sh)$/i.test(w))return w+'es';if(/[^aeiou]y$/i.test(w))return w.slice(0,-1)+'ies';return w+'s';}
  function delivDisp(s){if(!s||s==='__ALL__')return 'All Deliverable Types';var t=s.replace(/\band\b/gi,'&').split(' ');t[t.length-1]=pluralize(t[t.length-1]);return t.join(' ');}
  function btn(label,tip,onclick,cls){return el('button',{class:'btn'+(cls?' '+cls:''),title:tip,onclick:onclick},[label]);}

  function ensureShell(){if(root)return;host=document.createElement('div');host.id='mps-aconex-host';host.setAttribute('style','all:initial;position:fixed;inset:0;z-index:2147483000;');document.documentElement.appendChild(host);root=host.attachShadow({mode:'open'});var st=document.createElement('style');st.textContent=CSS();root.appendChild(st);root.appendChild(el('div',{id:'wrap'}));installOutsideClose();try{window.addEventListener('resize',function(){equalizeChartHeaders();fitRegisterHeight();});}catch(e){}}
  // Close any open dropdown/panel when the user clicks away from it (unless the click is on its trigger, which toggles it).
  function installOutsideClose(){
    root.addEventListener('mousedown',function(e){
      var open=Array.prototype.slice.call(root.querySelectorAll('#colpanel,#hdrpanel,#mfpanel,#cspanel,#pkpanel,#fontpanel,#syncpanel,#donutpanel'));
      if(!open.length)return;
      var path=e.composedPath?e.composedPath():[e.target];
      for(var i=0;i<open.length;i++){if(path.indexOf(open[i])>=0)return;}
      for(var j=0;j<path.length;j++){var el2=path[j];if(el2&&el2.classList&&(el2.classList.contains('pnltrig')||el2.classList.contains('mfbtn')||el2.classList.contains('pkgbtn')||el2.classList.contains('pal'))){return;}}
      open.forEach(function(p){p.remove();});
    },true);
  }
  // size the REGISTER grid to fill the viewport so the outer scroll can push STATS+CHARTS fully off,
  // leaving only the register (bottom) panel visible; the grid keeps its own inner scrollbars
  function fitRegisterHeight(){
    if(!root)return;var content=root.querySelector('.content'),tw=root.querySelector('.tablewrap');if(!content||!tw)return;
    var cp=tw.parentNode;while(cp&&!(cp.classList&&cp.classList.contains('cpanel')))cp=cp.parentNode;
    if(!cp||cp.classList.contains('coll')){tw.style.height='';tw.style.maxHeight='';return;}
    var hd=cp.querySelector('.cpanelhd'),tb=cp.querySelector('.toolbar');
    var chrome=(hd?hd.offsetHeight:0)+(tb?tb.offsetHeight:0);
    var h=Math.max(180,content.clientHeight-chrome-18); // leave a small gap so the panel's top border shows below the tabs bar
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
    +'.tabs{display:flex;gap:4px;background:'+NAVY2+';padding:0 10px}.tab{padding:calc(7px*var(--ps,1)) 15px;color:#cdd8e6;font-weight:600;cursor:pointer;border-bottom:3px solid transparent;font-size:12px}.tab.active{color:#fff;border-color:'+ACCENT+'}.tab.disabled{opacity:.4;cursor:not-allowed}'
    +'.toolbar{display:flex;align-items:center;gap:calc(7px*var(--ps,1));padding:calc(6px*var(--ps,1)) calc(12px*var(--hp,1));background:#fff;border-bottom:1px solid '+LINE+';flex-wrap:wrap}'
    +'.toolbar input[type=search],.toolbar select{border:1px solid #cfd8e3;border-radius:5px;padding:4px 8px;font-size:12px}.search{width:220px}'
    +'.colrow{display:flex;align-items:center;gap:12px;padding:5px 12px;background:#fbfcfe;border-bottom:1px solid '+LINE+';flex-wrap:wrap;font-size:12px}'
    +'.colrow label{display:inline-flex;align-items:center;gap:4px;cursor:pointer;white-space:nowrap}.colrow .lead{font-weight:700;color:'+NAVY+';letter-spacing:.4px}'
    +'.cpanel{margin:calc(8px*var(--ps,1)) calc(12px*var(--hp,1)) 0;border:1px solid '+LINE+';border-radius:8px;background:#fff;overflow:hidden}'
    +'.cpanelhd{display:flex;align-items:center;gap:10px;background:#eef2f7;padding:calc(4px*var(--ps,1)) calc(12px*var(--hp,1));border-bottom:1px solid '+LINE+'}.cptitle{color:#55637a;font-weight:700;letter-spacing:.5px;font-size:11px;text-transform:uppercase}'
    +'.cpchev{cursor:pointer;color:#8894a6;font-size:11px;line-height:1;user-select:none;width:12px;text-align:center;flex:0 0 auto}.cpchev:hover{color:'+NAVY+'}'
    +'.cpanel.coll .cpbody{display:none}'
    +'.charts{padding:calc(10px*var(--ps,1)) calc(12px*var(--hp,1));background:#fff}'
    +'.chartctl{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-left:auto}.ccount{font-size:12px;font-weight:700;color:'+NAVY+';background:#fff;border:1px solid '+LINE+';border-radius:5px;padding:3px 9px;white-space:nowrap}'
    +'.chartsrow{display:flex;justify-content:space-around;align-items:flex-start;gap:10px;width:100%}'
    +'.cgrow{display:flex;gap:12px;align-items:stretch;margin:calc(8px*var(--ps,1)) calc(12px*var(--hp,1)) 0}.cgrow>.cpanel{margin:0}.cgrow .cpt{flex:0 0 auto;width:auto;max-width:470px}.cgrow .cpc{flex:1 1 auto;min-width:0}.cgrow>.cpanel.coll{align-self:flex-start}'
    +'.cpt .pchart{max-width:none}.cpt .plegend{max-width:360px}'
    +'.pkrow{display:flex;align-items:center;gap:6px}.pkrow .pkno{min-width:120px;flex:0 0 auto;font-weight:600}.pkrow .pktext{flex:1 1 auto;min-width:80px;font-size:11px;padding:2px 5px;border:1px solid #cfd8e3;border-radius:4px}.dark .pkrow .pktext{background:#0e1621;border-color:#28374a;color:#dfe7f0}'
    +'.btn.chart{background:#6b46c1;color:#fff;border-color:#6b46c1}.btn.chart:hover{background:#5a3aa8}'
    +'.btn.chorange{background:'+ACCENT+';color:#fff;border-color:'+ACCENT+'}.btn.chorange:hover{background:#d9591b}'
    +'.pchart{flex:1 1 0;min-width:120px;max-width:300px;text-align:center;position:relative;display:flex;flex-direction:column;align-items:center}.pchart svg{overflow:visible}.pctitle{font-size:11px;font-weight:700;margin-bottom:4px;white-space:nowrap}.pchart .xh{position:absolute;top:-2px;right:-2px;cursor:pointer;color:#9aa6b2;font-size:11px;display:none}.pchart:hover .xh{display:block}'
    +'.plegend{display:flex;flex-flow:row wrap;justify-content:center;gap:1px 10px;font-size:10px;margin-top:6px;max-width:210px}.plegend div{display:flex;align-items:center;gap:4px;cursor:pointer;white-space:nowrap}.plegend i{width:9px;height:9px;border-radius:2px;flex:0 0 auto;display:inline-block;border:1px solid rgba(0,0,0,.18)}.plegend b{font-weight:700;margin-left:2px}'
    +'.pal{cursor:pointer;margin-left:3px;font-size:11px;opacity:.85;white-space:nowrap;display:inline-block}.pal:hover{opacity:1}'
    +'.slegend{display:flex;flex-wrap:wrap;gap:3px 10px;font-size:11px;max-width:360px}.slegend div{display:flex;align-items:center;gap:4px;cursor:pointer}.slegend i{width:9px;height:9px;border-radius:2px;display:inline-block}'
    +'.mfbtn{display:flex;align-items:center;justify-content:space-between;gap:4px;width:100%;box-sizing:border-box;border:1px solid #d7dee6;border-radius:4px;padding:1px 4px;font-size:11px;background:#fff;cursor:pointer;color:'+INK+';overflow:hidden;white-space:nowrap}.mfbtn:hover{background:#eef3f8}.mfbtn .cv{overflow:hidden;text-overflow:ellipsis}'
    +'.mfpanel{position:absolute;background:#fff;border:1px solid #cfd8e3;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.18);padding:6px;z-index:15;max-height:300px;overflow:auto;min-width:170px}.mfpanel .mfrow{display:flex;align-items:center;gap:6px;padding:2px 3px;font-size:12px;white-space:nowrap;cursor:pointer;border-radius:3px}.mfpanel .mfrow:hover{background:#eef3f8}.mfpanel .mfhd{display:flex;gap:6px;padding:2px 3px 5px;border-bottom:1px solid '+LINE+';margin-bottom:4px}.mfpanel .mfhd a{font-size:11px;color:'+NAVY+';cursor:pointer;font-weight:700;text-decoration:underline}'
    +'.tile{border:1px solid '+LINE+';border-radius:7px;padding:calc(5px*var(--ps,1)) 11px;min-width:66px}.tile b{display:block;font-size:17px;color:'+NAVY+'}.tile small{color:#6b7b8c;font-size:11px}'
    +'.legend{display:flex;flex-direction:column;gap:2px;font-size:11px}.legend div{display:flex;align-items:center;gap:5px;cursor:pointer}.legend i{width:9px;height:9px;border-radius:2px;display:inline-block}'
    +'.chip{border:1px solid #cfd8e3;border-radius:14px;padding:2px 9px;font-size:11px;cursor:pointer;background:#fff}.chip.active{background:'+NAVY+';color:#fff;border-color:'+NAVY+'}'
    +'.tablewrap{overflow:auto;background:#fff;max-height:70vh}table{border-collapse:separate;border-spacing:0;width:max-content;min-width:100%}'
    +'.dark .regbody .tablewrap{background:#0e1621}'
    +'th,td{border-bottom:1px solid '+LINE+';border-right:1px solid #eef1f4;text-align:left;vertical-align:top}'
    +'thead th{position:sticky;top:0;background:'+NAVY+';color:#fff;font-weight:600;z-index:2;user-select:none;padding:4px 6px;text-align:center;vertical-align:middle}'
    +'.statsrow{display:flex;gap:calc(12px*var(--ps,1));padding:calc(10px*var(--ps,1)) calc(12px*var(--hp,1));flex-wrap:wrap}'
    +'.dtlbl{font-weight:700;color:'+NAVY+'}.toolbar select.dtsel{font-weight:700;color:'+NAVY+';border:2px solid '+ACCENT+';background:#fff7f2;padding:4px 10px}'
    +'.toolbar button.pkgbtn{font-weight:700;color:#0a58c2;border:2px solid #0a84ff;background:#eaf3ff;padding:4px 10px;box-shadow:0 0 0 2px rgba(10,132,255,.12)}.toolbar button.pkgbtn:hover{background:#dcebff;border-color:#0070e0}.dark .toolbar button.pkgbtn{color:#8ec5ff;background:#0e2438;border-color:#2f8bff}'
    +'th .lbl{cursor:grab;display:inline;white-space:normal;overflow-wrap:break-word;word-break:normal;vertical-align:middle}'
    +'th .srt{cursor:pointer;opacity:.6;font-size:10px;margin-left:2px;white-space:nowrap;display:inline-block}th .srt:hover{opacity:1}th .hicons{white-space:nowrap;display:inline-block;vertical-align:middle}'
    +'th.drop{outline:2px dashed '+ACCENT+';outline-offset:-2px}th{position:relative}.rez{position:absolute;right:0;top:0;width:6px;height:100%;cursor:col-resize}'
    +'tr.f td{background:#fbfcfe;position:sticky;z-index:1;padding:2px 4px}tr.f input,tr.f .mfbtn{width:100%;box-sizing:border-box;border:1px solid #d7dee6;border-radius:4px;padding:0 6px;font-size:11px;height:24px;line-height:22px}'
    +'tbody tr:hover td{background:#f2f7fd}td.edit{background:#fffdf5}td.edit input,td.edit select{width:100%;box-sizing:border-box;border:1px solid #e3e0cf;border-radius:3px;padding:0 3px;font-size:inherit;background:transparent}'
    +'.pill{display:inline-block;padding:0 7px;border-radius:10px;color:#fff;font-weight:600;border:1px solid rgba(0,0,0,.15)}.mps-h{background:#0e335a!important}'
    +'.panel{position:absolute;right:12px;top:120px;background:#fff;border:1px solid #cfd8e3;border-radius:8px;box-shadow:0 8px 30px rgba(0,0,0,.18);padding:10px;max-height:60vh;overflow:auto;z-index:9;min-width:0;width:max-content;max-width:340px}.panel h4{margin:2px 0 8px;color:#55637a;font-weight:700;letter-spacing:.5px;font-size:11px;text-transform:uppercase;display:flex;align-items:center;gap:6px;cursor:pointer}.panel h4 .pchev{color:#8894a6;font-size:11px;flex:0 0 auto}.panel.coll>*:not(h4){display:none}'
    +'#donutpanel .crow .cn,#phasepanel .crow .cn{flex:0 1 auto;white-space:nowrap}#syncpanel,#fontpanel{width:auto;min-width:250px}'
    +'.sldgrp{margin-left:auto;display:inline-flex;align-items:center;gap:4px}.sldgrp .rng{width:120px}.fpct{min-width:40px;text-align:right;font-weight:600;color:'+NAVY+';font-size:12px}.dark .fpct{color:#9fb0c4}#fontpanel .fontrow{display:flex;align-items:center;gap:8px;margin-bottom:6px}#fontpanel .fontrow>label{min-width:52px}#fontpanel select{flex:1}'
    +'.colletrow th.colc{background:#eef3f9;color:#7a8aa0;font-size:9px;font-weight:700;letter-spacing:.5px;padding:1px 4px;text-align:center;border-bottom:1px solid '+LINE+';top:0}.dark .colletrow th.colc{background:#0a1a2c;color:#7f92aa;border-bottom-color:#28374a}'
    +'td.edit select.mps-sel{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-repeat:no-repeat;background-position:right 3px center;background-size:8px 6px;padding-right:15px;background-image:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%278%27 height=%276%27%3E%3Cpath d=%27M0 0l4 5 4-5z%27 fill=%27%23888888%27/%3E%3C/svg%3E")}'
    +'td.edit select.mps-sel.set{background-image:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%278%27 height=%276%27%3E%3Cpath d=%27M0 0l4 5 4-5z%27 fill=%27%23ffffff%27/%3E%3C/svg%3E")}'
    +'.doclink{color:#1565c0;text-decoration:none;cursor:pointer}.doclink:hover{color:#0d47a1}.dark .doclink{color:#5aa9ff}.dark .doclink:hover{color:#8ec5ff}'
    +'td .cico{text-decoration:none;cursor:pointer;font-size:12px;opacity:1}td .cpdf{color:#c0392b;margin-right:3px}td .cedit{color:#0a58c2;margin-left:3px}.dark td .cedit{color:#7cbcff}td .cnum{color:#33415a;font-weight:600}.dark td .cnum{color:#dfe7f0}'
    +'#colpanel{min-width:0;width:max-content;max-width:340px;display:flex;flex-direction:column}#colpanel .clist{overflow:auto}#colpanel .crow{padding:2px 10px;gap:8px}#colpanel .crow .cn{flex:0 1 auto;white-space:nowrap}'
    +'.crow{display:flex;align-items:center;gap:6px;padding:2px 0;font-size:12px}.crow .cn{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:grab}.crow.drop{outline:2px dashed '+ACCENT+';outline-offset:-2px}.mini{border:1px solid #cfd8e3;background:#fff;border-radius:3px;cursor:pointer;font-size:10px;padding:1px 5px;line-height:1;color:'+NAVY+'}.mini:hover{background:#eef3f8}.mini:disabled{opacity:.3;cursor:default}'
    +'#wrap table tr>th:first-child,#wrap table tr>td:first-child{padding-left:16px!important}#wrap table tr>th:last-child,#wrap table tr>td:last-child{padding-right:16px!important}'
    +'.loading{padding:40px;text-align:center;color:#6b7b8c}.err{padding:16px;color:#c0392b}.rng{vertical-align:middle;accent-color:#8fa6c0}'
    +'.vbadge{background:rgba(255,255,255,.14);color:#dfe7f0;border-radius:10px;padding:2px 9px;font-size:11px;font-weight:600;letter-spacing:.3px;white-space:nowrap}'
    +'.fontrow{display:flex;align-items:center;gap:8px;margin:6px 0;font-size:12px}.fontrow label{min-width:70px;color:#55637a;font-weight:600}.fontrow select{flex:1;border:1px solid #cfd8e3;border-radius:5px;padding:4px 8px;font-size:12px}'
    /* ---- DARK MODE ---- */
    +'#wrap.dark{background:#0e1621;color:#dfe7f0}'
    +'.dark .toolbar{background:#16202e;border-bottom-color:#28374a}'
    +'.dark .colrow{background:#131c28;border-bottom-color:#28374a}'
    +'.dark .btn{background:#1e2a3a;color:#cfe0f2;border-color:#37485e}.dark .btn:hover{background:#28394f}'
    +'.dark .btn.alt{background:#13273f;color:#fff;border-color:#26456b}'
    +'.dark .btn.primary,.dark .btn.chart,.dark .btn.chorange{color:#fff}'
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
    +'.dark .colrow .lead{color:#9fb0c4}.dark .rng{accent-color:'+ACCENT+'}'
    +'#wrap table th.mps-selcell,#wrap table td.mps-selcell{width:13px;min-width:13px;max-width:13px;text-align:center;vertical-align:middle}'
    +'#wrap table tr>th.mps-selcell:first-child,#wrap table tr>td.mps-selcell:first-child{padding-left:1px!important;padding-right:1px!important}'
    +'.mps-selcell input[type=checkbox]{margin:0;cursor:pointer;width:13px;height:13px;vertical-align:middle;accent-color:'+ACCENT+'}'
    +'.mps-pophelp{position:absolute;left:50%;transform:translateX(-50%);bottom:14px;max-width:760px;background:#fff8e6;border:2px solid '+ACCENT+';border-radius:8px;padding:10px 34px 10px 12px;font-size:12px;line-height:1.45;color:'+INK+';box-shadow:0 6px 24px rgba(0,0,0,.22);z-index:30}'
    +'.mps-pophelp b{color:#b3400f}.mps-pophelp a{position:absolute;top:5px;right:9px;cursor:pointer;font-weight:700;color:#8a939b;text-decoration:none}.mps-pophelp a:hover{color:'+INK+'}'
    +'.dark .mps-pophelp{background:#2a1d12;color:#ffe9d6;border-color:'+ACCENT+'}.dark .mps-pophelp b{color:#ffb37a}'
    +'.mps-pophelp.ok{background:#eefaf0;border-color:#1e7e34}.mps-pophelp.ok b{color:#14682b}'
    +'.dark .mps-pophelp.ok{background:#10251a;color:#d7f5e0;border-color:#1e7e34}.dark .mps-pophelp.ok b{color:#6fdc92}'
    +'#wrap table th.mps-fill,#wrap table td.mps-fill{width:auto;min-width:0;max-width:none;border-right:0}'
    +'#wrap table tr>th.mps-fill:last-child,#wrap table tr>td.mps-fill:last-child{padding:0!important}'
    +'.btn.mps-open{font-weight:700;color:#0a58c2;border:2px solid #0a84ff;background:#eaf3ff}.btn.mps-open:hover{background:#dcebff;border-color:#0070e0}'
    +'.dark .btn.mps-open{color:#8ec5ff;background:#0e2438;border-color:#2f8bff}'
    +'.btn[disabled]{opacity:.45;cursor:not-allowed}.btn[disabled]:hover{background:#eaf3ff}.dark .btn[disabled]:hover{background:#0e2438}';}

  function colLabel(k){var n=S.colNames&&S.colNames[k];return (n!=null&&n!=='')?n:((COLDEF[k]&&COLDEF[k].label)||'');}
  function visKeys(){return S.order.filter(function(k){return S.cols[k]&&S.cols[k].show;});}

  // ---- collapsible panels (roll-up like the Procore dashboard) ----
  function makeCPanel(id,titleText,ctlEl,bodyEl,tip,shortTitle){
    var coll=!!(S.collapsed&&S.collapsed[id]);
    var chev=el('span',{class:'cpchev',title:coll?'Expand this panel':'Roll up this panel'},[coll?'▸':'▾']);
    var ttl=el('span',{class:'cptitle',style:'cursor:pointer',title:tip||'Click to roll this panel up or down'},[coll&&shortTitle?shortTitle:titleText]);
    var hd=el('div',{class:'cpanelhd'},[chev,ttl]);
    if(ctlEl)hd.appendChild(ctlEl);
    bodyEl.classList.add('cpbody');
    var panel=el('div',{class:'cpanel'+(coll?' coll':'')},[hd,bodyEl]);
    function toggle(){var c=!panel.classList.contains('coll');panel.classList.toggle('coll',c);chev.textContent=c?'▸':'▾';chev.setAttribute('title',c?'Expand this panel':'Roll up this panel');if(shortTitle)ttl.textContent=c?shortTitle:titleText;S.collapsed=S.collapsed||{};S.collapsed[id]=c;saveCfg();equalizeChartHeaders();fitRegisterHeight();}
    chev.onclick=toggle;ttl.onclick=toggle;
    return panel;
  }
  // make the TOTAL and CHARTS panel headers equal height so their chart elements top-align (skips rolled-up panels)
  function equalizeChartHeaders(){
    var row=root&&root.querySelector('.cgrow');if(!row)return;
    var hds=[];
    for(var i=0;i<row.children.length;i++){var p=row.children[i];var h=p.querySelector('.cpanelhd');if(!h)continue;h.style.minHeight='';if(!p.classList.contains('coll'))hds.push(h);}
    requestAnimationFrame(function(){var mx=0;hds.forEach(function(h){if(h.offsetHeight>mx)mx=h.offsetHeight;});if(mx>0)hds.forEach(function(h){h.style.minHeight=mx+'px';});});
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
    panel.appendChild(sldRow('Padding','Vertical spacing only — row height and top/bottom padding (± 2.5%; down to 20%). Does not change left/right padding.',function(){return S.padScale||100;},function(v){S.padScale=v;saveCfg();applyTheme();renderTable();},20,200));
    panel.appendChild(sldRow('Side Padding','Left/right padding of the panels — whitespace at the sides of the STATS / CHARTS / register panels (± 2.5%; down to 0%).',function(){return S.hpadScale||100;},function(v){S.hpadScale=v;saveCfg();applyTheme();renderTable();},0,200));
    panel.appendChild(el('div',{style:'margin-top:8px;display:flex;gap:6px'},[
      el('button',{class:'btn',title:'Restore default font, size and padding',onclick:function(){S.fontFamily='';S.fontScale=100;S.padScale=100;S.hpadScale=100;saveCfg();applyTheme();renderTable();var fp=root.getElementById('fontpanel');if(fp)fp.remove();toggleFontPanel(anchor);}},['Restore Default']),
      el('button',{class:'btn',title:'Save the current fonts, size, padding and view as your default',onclick:function(){setAsDefault();}},['★ Set As Default'])
    ]));
    wrapEl.appendChild(panel);
    if(anchor){var ar=anchor.getBoundingClientRect(),wr=wrapEl.getBoundingClientRect();panel.style.left=Math.min(Math.max(4,wr.width-panel.offsetWidth-8),Math.max(4,ar.left-wr.left))+'px';panel.style.top=(ar.bottom-wr.top+4)+'px';}else{panel.style.right='12px';panel.style.top='44px';}
  }


  function renderAll(){
    ensureShell();var wrap=root.getElementById('wrap');wrap.innerHTML='';
    // top bar
    wrap.appendChild(el('div',{class:'top'},[
      (function(){var b=el('div',{class:'brand'});b.innerHTML='MPS <span>GROUP</span>';return b;})(),
      el('div',{class:'title',title:'MPS live register dashboard, reading straight from the Aconex REST API'},['Aconex Register']),
      el('div',{class:'vbadge',title:'Dashboard version · build date'},[VERSION+' · '+BUILD_DATE]),
      el('div',{class:'muted'},['· '+CFG.projectName+' · '+(S.loading?'loading…':(S.rows.length+' of '+S.allRows.length+' docs'))]),
      btn('↻ Refresh','Re-pull the latest data live from Aconex',function(){fetchData();}),
      btn('Fonts','Choose the dashboard font and base size for all elements',function(ev){toggleFontPanel(ev&&ev.currentTarget);},'pnltrig'),
      btn((S.darkMode?'☀ Light Mode':'☾ Dark Mode'),'Toggle dark mode',function(){S.darkMode=!S.darkMode;saveCfg();renderAll();}),
      (function(){selBtnEl=el('button',{class:'btn mps-open',onclick:openSelected},['🔗 Open Selected']);selBtnEl.setAttribute('disabled','disabled');selBtnEl.setAttribute('title','Tick one or more rows in the left-hand column to enable this');return selBtnEl;})(),
      btn('⟳ Sync Transmittals','Crawl the sent transmittals in Aconex and auto-fill the Transmittal No column with each document’s latest transmittal number',function(ev){syncTransmittals(ev&&ev.currentTarget);}),
      el('span',{class:'muted',id:'txsync',style:'font-size:11px',title:'When the Transmittal No column was last synced from Aconex transmittals (hours ago)'},[lastSyncText()]),
      el('div',{class:'spacer'}),
      el('div',{class:'badge',title:'This dashboard is running on the Aconex platform'},['ACONEX']),
      el('button',{class:'btn pnltrig',id:'syncbtn',title:'Team sync via GitHub — share edits with the team',onclick:openSyncPanel},[syncLabel()]),
      btn('⤓ Export Excel','Download the current view as a formatted native .xlsx',exportExcel,'primary'),
      el('button',{class:'btn ghost',title:'Close the dashboard',onclick:close},['✕'])
    ]));
    // tabs
    wrap.appendChild(el('div',{class:'tabs'},[el('div',{class:'tab active',title:'Document registers'},['Doc. Registers']),el('div',{class:'tab',title:'RFI / TQ register',onclick:gotoRFI},['RFIs/TQs']),el('div',{class:'tab disabled',title:'Coming soon'},['Drawings']),el('div',{class:'tab disabled',title:'Coming soon'},['Transmittals'])]));
    // toolbar
    var search=el('input',{type:'search',class:'search',title:'Search across all columns',placeholder:'⌕ Search ITPs…',value:S.globalSearch});search.oninput=function(){S.globalSearch=search.value;applyFilters();renderBody();renderCharts();};
    var dsel=el('select',{class:'dtsel',title:'Filter by Aconex Deliverable Type'});var oa=el('option',{value:'__ALL__'},['All Deliverable Types']);if(S.deliverableType==='__ALL__')oa.selected=true;dsel.appendChild(oa);S.deliverableTypes.forEach(function(dt){var o=el('option',{value:dt},[delivDisp(dt)]);if(dt===S.deliverableType)o.selected=true;dsel.appendChild(o);});dsel.onchange=function(){S.deliverableType=dsel.value;applyScope();renderAll();};
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
      btn('Fit to 1 Page','Shrink every column so the whole register fits one page width (keeping headers to 2 lines)',function(){fitOnePage();}),
      (function(){var b=btn((S.wrap?'☑':'☐')+' Wrap Text','Toggle word-wrapping of cell text',function(){S.wrap=!S.wrap;saveCfg();renderTable();});return b;})(),
      fontGroup,
      el('span',{class:'muted',title:'Row height — drag the slider to pack rows tighter or looser'},['Row Density']),rng,
      el('span',{class:'dtlbl',style:'color:#0a84ff',title:'Filter the register by Aconex Package Number'},['PACKAGE NO']),
      (function(){var ps=el('span',{id:'pksum'},[packageSummary()]);var b=el('button',{class:'btn pkgbtn',title:'Select one or more Package Numbers to filter the register; add a custom label per package',onclick:function(){openPackagePanel(b);}},[ps,el('span',{style:'margin-left:5px;color:#0a84ff'},['▾'])]);return b;})(),
      el('span',{class:'dtlbl',style:'color:'+ACCENT,title:'Filter the whole register by Aconex Deliverable Type'},['DELIVERABLE TYPE']),dsel,
      search
    ]);
    // scrolling content region — provides the OUTER scrollbar; each section is its own collapsible panel
    var content=el('div',{class:'content'});
    // STATS panel — summary for the whole selected Deliverable Type (collapsible)
    content.appendChild(makeCPanel('stats','STATS',null,el('div',{class:'statsrow',id:'stats'}),'Summary counts across the whole selected Deliverable Type. Click the title to roll this panel up.'));
    // TOTAL (left) + CHARTS (right) laid side-by-side in one row to minimise lost vertical space
    var totalPanel=makeCPanel('total','TOTAL: '+delivDisp(S.deliverableType),null,el('div',{class:'charts',id:'totalchart'}),'A single chart totalling all rows currently displayed. Click the title to roll this panel up.','TOTAL');
    totalPanel.classList.add('cpt');
    var chartsPanel=makeCPanel('charts','CHARTS',el('div',{class:'chartctl',id:'chartctl'}),el('div',{class:'charts',id:'charts'}),'Per-phase status charts plus the overall Status Breakdown bar graph. Click the title to roll this panel up.');
    chartsPanel.classList.add('cpc');
    content.appendChild(el('div',{class:'cgrow'},[totalPanel,chartsPanel]));
    // REGISTER panel — column controls, filters, buttons AND the data grid together (collapsible).
    // The grid has an INNER scrollbar; the content region above is the OUTER scrollbar.
    var regCount=el('span',{class:'ccount',id:'countlbl',style:'margin-left:auto',title:'Rows shown of the total in this Deliverable Type'},[S.filtered.length+' of '+S.rows.length]);
    var regBody=el('div',{class:'regbody'},[toolbar,el('div',{class:'tablewrap'},[])]);
    content.appendChild(makeCPanel('register','REGISTER: '+delivDisp(S.deliverableType),regCount,regBody,'The register: column controls, filters, buttons and the full data grid. Click the title to roll this panel up.'));
    wrap.appendChild(content);
    applyTheme();renderStats();renderCharts();renderTable();equalizeChartHeaders();fitRegisterHeight();
  }
  function renderStats(){
    var box=root.getElementById('stats');if(!box)return;box.innerHTML='';
    var rows=S.rows,total=rows.length;
    function cnt(fn){var c=0;rows.forEach(function(r){if(fn(r))c++;});return c;}
    var forUse=cnt(function(r){return (r.lifecycleStatus||'').toLowerCase()==='for use';});
    var reviewed=cnt(function(r){return (r.status||'').toLowerCase()==='reviewed';});
    var awaiting=cnt(function(r){var s=(r.status||'').toLowerCase();return s==='submitted'||s==='under review'||s==='for review'||s==='for approval';});
    var revise=cnt(function(r){return (r.status||'').toLowerCase()==='revise and resubmit';});
    var supObs=cnt(function(r){var s=(r.status||'').toLowerCase(),l=(r.lifecycleStatus||'').toLowerCase();return s==='superseded'||s==='obsolete'||l==='superseded'||l==='obsolete';});
    var pct=total?Math.round(forUse/total*100):0;
    function tile(num,label,color,tip){return el('div',{class:'tile',title:tip||label},[el('b',{style:color?'color:'+color:''},[String(num)]),el('small',{},[label])]);}
    var dk=!!S.darkMode;function C(l,d){return dk?d:l;}
    [tile(total,'Total',C('','#eaf1f8'),'Total documents in the selected Deliverable Type: '+delivDisp(S.deliverableType)),
     tile(forUse,'For Use ('+pct+'%)',C('#1e7e34','#3ecf6a'),'Lifecycle = For Use'),
     tile(reviewed,'Reviewed',C('#2b6cb0','#5aa2e0'),'Status = Reviewed'),
     tile(awaiting,'Awaiting Review',C('#e0a800','#f0c040'),'Submitted / Under Review / For Review / For Approval'),
     tile(revise,'Revise & Resubmit',C('#e05a1c','#f2794a'),'Status = Revise and Resubmit'),
     tile(supObs,'Superseded / Obsolete',C('#39424d','#aeb8c4'),'Superseded or Obsolete (status or lifecycle)')
    ].forEach(function(t){box.appendChild(t);});
  }

  function statusKeys(rows){var c={};rows.forEach(function(r){var k=r.status||'—';c[k]=(c[k]||0)+1;});return c;}
  // chart data field: break the charts down by Status or Lifecycle Status
  function chartField(){return S.chartDataField==='lifecycleStatus'?'lifecycleStatus':'status';}
  function groupCounts(rows){var f=chartField(),c={};rows.forEach(function(r){var k=r[f]||'—';c[k]=(c[k]||0)+1;});return c;}
  function fieldColor(k){return chartField()==='lifecycleStatus'?lifeColor(k):statusColor(k);}
  function fieldDisp(k){return chartField()==='lifecycleStatus'?(k||'—'):(statusDisp(k)||'—');}
  var CHART_GREEN='#1e7e34';
  // Information Only / For Information render white in charts — flag them so they get a thin green border
  function isInfoWhite(k){var c=(fieldColor(k)||'').toLowerCase();return c==='#ffffff'||c==='#fff'||c==='white';}
  // Excel-style column letter from a 0-based visible position (A, B, … Z, AA, …)
  function colAlpha(i){var s='';i++;while(i>0){var m=(i-1)%26;s=String.fromCharCode(65+m)+s;i=Math.floor((i-1)/26);}return s;}
  function lifeRank(v){var i=LIFECYCLE_ORDER.indexOf((v||'').toLowerCase());return i<0?99:i;}
  function chartKeySort(a,b){if(chartField()==='lifecycleStatus'){var ra=lifeRank(a),rb=lifeRank(b);return ra!==rb?ra-rb:(a<b?-1:a>b?1:0);}return statusKeySort(a,b);}
  function toggleFieldFilter(k){var f=chartField(),v=(k==='—'?'':k);var cur=S.selFilters[f];if(cur&&cur.length===1&&cur[0]===v){S.selFilters[f]=null;}else{S.selFilters[f]=[v];}applyFilters();renderCharts();renderTable();saveCfg();}
  var CT_NEXT={donut:'bar',bar:'pie',pie:'donut'};
  var CT_LABEL={donut:'Bars',bar:'Pie Charts',pie:'Donuts'};
  function renderCharts(){
    var ctl=root.getElementById('chartctl');
    if(ctl){ctl.innerHTML='';
      ctl.appendChild(el('span',{class:'ccount',title:'Documents in the current Deliverable Type view'},[String(S.rows.length)+' · '+delivDisp(S.deliverableType)]));
      ctl.appendChild(btn(S.chartDataField==='lifecycleStatus'?'By Lifecycle':'By Status','Toggle whether the phase charts break down by Status or by Lifecycle Status',function(){S.chartDataField=(S.chartDataField==='lifecycleStatus'?'status':'lifecycleStatus');saveCfg();renderCharts();},'chart'));
      var nextLbl=CT_LABEL[S.chartType]||'Bars';
      ctl.appendChild(btn(nextLbl,'Switch the phase charts to '+nextLbl+' (cycles Donuts → Bars → Pie Charts)', function(){S.chartType=CT_NEXT[S.chartType]||'donut';saveCfg();renderCharts();},'chart'));
      ctl.appendChild(btn('Charts','Show or hide individual phase charts', function(){toggleDonutPanel();},'chart pnltrig'));
      ctl.appendChild(btn(S.barExpanded?'Show Phase Charts':'Show Bar Graph', S.barExpanded?'Return to the phase charts':'Hide the phase charts and expand the status bar graph to fill the space', function(){S.barExpanded=!S.barExpanded;saveCfg();renderChartsBody();renderCharts();},'chart'));
      ctl.appendChild(btn('✎ Phases','Rename or add project phases (reflected in the Phase column and charts)', function(){togglePhasePanel();},'chorange'));
      ctl.appendChild(el('span',{class:'muted',style:'font-size:11px;margin-left:4px'},['Size']));
      var sz=el('input',{type:'range',min:'70',max:'220',value:String(Math.round((S.chartScale||1)*100)),class:'rng',title:'Increase or decrease the donut / bar chart size'});sz.oninput=function(){S.chartScale=(+sz.value)/100;saveCfg();renderChartsBody();};
      ctl.appendChild(sz);
    }
    renderChartsBody();
  }
  function renderChartsBody(){
    var box=root.getElementById('charts');if(!box)return;box.innerHTML='';
    if(!S.barExpanded){
      var row=el('div',{class:'chartsrow'});var shown=0;
      S.phases.forEach(function(p){if(S.hiddenDonuts.indexOf(p.id)>=0)return;var prows=S.filtered.filter(function(r){return r.phase===p.id;});if(!prows.length)return;shown++;row.appendChild(phaseChart(p,groupCounts(prows),prows.length));});
      if(!shown)row.appendChild(el('div',{class:'muted',style:'padding:6px'},['No phase data in view — set the Phase column to populate these charts.']));
      box.appendChild(row);
    } else {
      // expanded: only the aggregate status bar graph, filling the width
      box.appendChild(aggBarGraph(true));
    }
    renderTotalChart();
  }
  // TOTAL chart — a single chart totalling all rows currently displayed (its own panel)
  function renderTotalChart(){
    var box=root.getElementById('totalchart');if(!box)return;box.innerHTML='';
    var rows=S.filtered;
    // same container (.chartsrow) as the phase charts so the title + chart render and align identically
    var row=el('div',{class:'chartsrow'});
    row.appendChild(phaseChart({id:'__total',label:'Total'},groupCounts(rows),rows.length));
    box.appendChild(row);
  }
  function aggBarGraph(expanded){
    var fieldLbl=chartField()==='lifecycleStatus'?'Lifecycle Status':'Status';
    var counts=groupCounts(S.filtered);
    var keys=Object.keys(counts).sort(chartKeySort);
    var dark=!!S.darkMode;
    var wrap=el('div',{style:'width:100%;'+(expanded?'':'margin-top:14px;border-top:1px solid '+(dark?'#22303f':LINE)+';padding-top:10px')});
    wrap.appendChild(el('div',{class:'pctitle',style:'text-align:left;color:'+(dark?'#9fb0c4':NAVY)+';margin-bottom:4px',title:'Count of ITPs by '+fieldLbl+' across the current view — click any bar to filter'},[fieldLbl+' Breakdown · '+S.filtered.length+' ITP(s)']));
    if(!keys.length){wrap.appendChild(el('div',{class:'muted',style:'padding:6px'},['No data in view.']));return wrap;}
    var chInk=dark?'#dfe7f0':NAVY, axis=dark?'#3a4d64':'#cfd8e3', grid=dark?'#22303f':'#e6ebf0', xink=dark?'#9aa8bb':'#5b6b7b', sep=dark?'#111b28':'#ffffff';
    var n=keys.length, bw=52,gap=34,mL=36,mR=18,topPad=20,plotH=expanded?240:118,botPad=58;
    var W=mL+n*(bw+gap)+gap+mR, H=topPad+plotH+botPad, baseY=topPad+plotH, x0=mL+gap;
    var maxv=1;keys.forEach(function(k){if(counts[k]>maxv)maxv=counts[k];});
    var top=(maxv%2===0)?maxv:maxv+1;if(top<2)top=2;var mid=top/2;
    var svg=svgEl('svg',{viewBox:'0 0 '+W+' '+H,preserveAspectRatio:'xMidYMid meet',width:'100%',height:'auto',style:'display:block;max-height:'+(expanded?'420':'220')+'px'});
    [[top,topPad],[mid,baseY-plotH*(mid/top)],[0,baseY]].forEach(function(t){
      svg.appendChild(svgEl('line',{x1:mL,x2:W-mR,y1:t[1],y2:t[1],stroke:grid}));
      var tl=svgEl('text',{x:mL-6,y:t[1]+3,'text-anchor':'end','font-size':'9',fill:xink});tl.textContent=String(t[0]);svg.appendChild(tl);
    });
    svg.appendChild(svgEl('line',{x1:mL,x2:mL,y1:topPad,y2:baseY,stroke:axis}));
    keys.forEach(function(k,i){
      var h=Math.round((counts[k]/top)*plotH);var x=x0+i*(bw+gap),cxb=x+bw/2;
      var rect=svgEl('rect',{x:x,width:bw,rx:2,fill:fieldColor(k),stroke:sep,'stroke-width':'1',y:baseY,height:0});rect.style.transition='height .9s ease, y .9s ease';rect.style.cursor='pointer';
      var tt=svgEl('title',{});tt.textContent=k+': '+counts[k];rect.appendChild(tt);rect.onclick=function(){toggleFieldFilter(k);};svg.appendChild(rect);
      var vl=svgEl('text',{x:cxb,y:baseY-h-5,'text-anchor':'middle','font-size':'11','font-weight':'700',fill:chInk});vl.textContent=String(counts[k]);svg.appendChild(vl);
      var xlab=fieldDisp(k);var xfs=fitFs(xlab,10,(bw+gap)*1.5,6);var xl=svgEl('text',{x:cxb,y:baseY+13,'text-anchor':'end','font-size':xfs.toFixed(1),fill:xink,transform:'rotate(-30 '+cxb+' '+(baseY+13)+')'});xl.textContent=xlab;var xtt=svgEl('title',{});xtt.textContent=k;xl.appendChild(xtt);svg.appendChild(xl);
      (function(rc,hh,vlab){requestAnimationFrame(function(){requestAnimationFrame(function(){rc.setAttribute('y',baseY-hh);rc.setAttribute('height',hh);vlab.setAttribute('y',baseY-hh-5);});});})(rect,h,vl);
    });
    svg.appendChild(svgEl('line',{x1:mL,x2:W-mR,y1:baseY,y2:baseY,stroke:axis}));
    wrap.appendChild(svg);
    return wrap;
  }
  function pcolor(p){return p.id==='__un'?'#9aa6b2':p.id==='__total'?NAVY:phaseColor(p.id);}
  function abbrStatus(s){s=statusDisp(s)||'—';return s.length>11?s.slice(0,10)+'…':s;}
  function svgEl(t,a){var e=document.createElementNS('http://www.w3.org/2000/svg',t);for(var k in a)e.setAttribute(k,a[k]);return e;}
  // measure text width (canvas, no DOM insert) so bar-chart X labels shrink to fit instead of truncating
  function txtWidth(t,fs){var c=txtWidth._c||(txtWidth._c=document.createElement('canvas').getContext('2d'));c.font=fs+'px '+fontStack(S.fontFamily);return c.measureText(t).width;}
  function fitFs(t,baseFs,maxPx,minFs){var w=txtWidth(t,baseFs);if(w<=maxPx||w<=0)return baseFs;return Math.max(minFs||5,baseFs*maxPx/w);}
  function hdrHasPal(k){return k==='status'||k==='lifecycleStatus'||k==='phase'||k==='toAction'||k==='dateRequired';}
  // Minimum column width so the header (label + sort + 🎨) never wraps past 2 lines, with tight (1–2px) padding.
  function hdrFont(){return (S.hdrFontSize!=null?S.hdrFontSize:(S.fontSize+2));}
  function hdrMaxLines(){var n=S.hdrMaxLines||2;return (n<1?1:(n>3?3:n));}
  function minHW(k){var hfs=hdrFont();var label=colLabel(k);var iconW=(COLDEF[k]&&COLDEF[k].nosort?0:13)+(hdrHasPal(k)?17:0);var space=txtWidth(' ',hfs);var units=String(label).split(/\s+/).filter(Boolean).map(function(w){return txtWidth(w,hfs);});if(iconW)units.push(iconW);if(!units.length)units.push(iconW||10);var maxUnit=0,total=0;units.forEach(function(u,i){if(u>maxUnit)maxUnit=u;total+=u+(i>0?space:0);});var K=hdrMaxLines();function fits(W){var lines=1,cur=0;for(var i=0;i<units.length;i++){var u=units[i];if(u>W+0.5)return false;var add=(cur>0?space:0)+u;if(cur+add<=W+0.5){cur+=add;}else{lines++;cur=u;if(lines>K)return false;}}return true;}var lo=Math.ceil(maxUnit),hi=Math.ceil(total),best=hi;while(lo<=hi){var mid=(lo+hi)>>1;if(fits(mid)){best=mid;hi=mid-1;}else lo=mid+1;}return best+5;}
  function phaseChart(p,counts,total){
    var fieldLbl=chartField()==='lifecycleStatus'?'Lifecycle Status':'Status';
    var wrap=el('div',{class:'pchart',title:p.label+' — '+total+' ITP(s) by '+fieldLbl});
    wrap.appendChild(el('span',{class:'xh',title:'Hide this chart',onclick:function(){if(S.hiddenDonuts.indexOf(p.id)<0)S.hiddenDonuts.push(p.id);saveCfg();renderCharts();}},['✕']));
    var keys=Object.keys(counts).sort(chartKeySort);
    var ptitle=(p.id!=='__total'&&keys.length<=1)?p.label:(p.label+' ('+total+'x)');
    wrap.appendChild(el('div',{class:'pctitle',style:'color:'+pcolor(p)},[ptitle]));
    var sc=S.chartScale||1;
    var dark=!!S.darkMode;
    if(S.chartType==='donut'||S.chartType==='pie'){
      var pie=S.chartType==='pie';
      var ringBg=dark?'#111b28':'#ffffff', ctrInk=dark?'#dfe7f0':NAVY;
      var r=24,cx=30,cy=30,sw=9,CC=2*Math.PI*r,off=0;
      var svg=svgEl('svg',{width:Math.round(62*sc),height:Math.round(62*sc),viewBox:'0 0 60 60'});
      if(!pie){
        var gap=(total>0&&keys.length>1)?3:0;
        svg.appendChild(svgEl('circle',{cx:cx,cy:cy,r:r,fill:'none',stroke:ringBg,'stroke-width':sw}));
        keys.forEach(function(k){var frac=total?counts[k]/total:0;var seg=svgEl('circle',{cx:cx,cy:cy,r:r,fill:'none',stroke:fieldColor(k),'stroke-width':sw,'stroke-dasharray':Math.max(0.01,frac*CC-gap)+' '+CC,transform:'rotate(-90 '+cx+' '+cy+')','stroke-dashoffset':CC});seg.style.transition='stroke-dashoffset 1s ease';seg.style.cursor='pointer';var tt=svgEl('title',{});tt.textContent=k+': '+counts[k];seg.appendChild(tt);seg.onclick=function(){toggleFieldFilter(k);};svg.appendChild(seg);if(isInfoWhite(k)){[r+sw/2-0.5,r-sw/2+0.5].forEach(function(rr){var CE=2*Math.PI*rr;svg.appendChild(svgEl('circle',{cx:cx,cy:cy,r:rr,fill:'none',stroke:CHART_GREEN,'stroke-width':'0.9','stroke-dasharray':Math.max(0.01,frac*CE-gap)+' '+CE,transform:'rotate(-90 '+cx+' '+cy+')','stroke-dashoffset':(-off*CE)}));});}(function(so,o){requestAnimationFrame(function(){requestAnimationFrame(function(){so.setAttribute('stroke-dashoffset',(-o*CC));});});})(seg,off);off+=frac;});
        var lt=svgEl('text',{x:cx,y:cy+4,'text-anchor':'middle','font-size':'13','font-weight':'700',fill:ctrInk});lt.textContent=String(total);svg.appendChild(lt);
      } else {
        // filled pie slices — no centre total number
        var pr=27, a0=-Math.PI/2;
        keys.forEach(function(k){var frac=total?counts[k]/total:0;if(frac<=0)return;var a1=a0+frac*2*Math.PI;var sh;
          var wst=isInfoWhite(k)?CHART_GREEN:ringBg, wsw=isInfoWhite(k)?'1.2':'1';
          if(frac>=0.9999){sh=svgEl('circle',{cx:cx,cy:cy,r:pr,fill:fieldColor(k),stroke:wst,'stroke-width':wsw});}
          else{var x1=cx+pr*Math.cos(a0),y1=cy+pr*Math.sin(a0),x2=cx+pr*Math.cos(a1),y2=cy+pr*Math.sin(a1),large=(a1-a0)>Math.PI?1:0;sh=svgEl('path',{d:'M'+cx+' '+cy+' L'+x1.toFixed(2)+' '+y1.toFixed(2)+' A'+pr+' '+pr+' 0 '+large+' 1 '+x2.toFixed(2)+' '+y2.toFixed(2)+' Z',fill:fieldColor(k),stroke:wst,'stroke-width':wsw});}
          sh.style.cursor='pointer';var tt=svgEl('title',{});tt.textContent=k+': '+counts[k];sh.appendChild(tt);sh.onclick=function(){toggleFieldFilter(k);};svg.appendChild(sh);a0=a1;});
        // 1px outer border so an all-white (e.g. Information Only) pie stays visible
        svg.appendChild(svgEl('circle',{cx:cx,cy:cy,r:pr,fill:'none',stroke:(keys.every(isInfoWhite)?CHART_GREEN:(dark?'#c9d3df':'#111111')),'stroke-width':'1'}));
      }
      wrap.appendChild(svg);
      // per-chart legend with counts adjacent
      var lg=el('div',{class:'plegend'});
      keys.forEach(function(k){var d=el('div',{title:'Filter '+fieldLbl+' = '+k,onclick:function(){toggleFieldFilter(k);}});var i=el('i');i.style.background=fieldColor(k);d.appendChild(i);d.appendChild(document.createTextNode(fieldDisp(k)));d.appendChild(el('b',{},[String(counts[k])]));lg.appendChild(d);});
      wrap.appendChild(lg);
    } else {
      // compact bars — sized to take about the same vertical space as the donut/pie views
      var n=Math.max(1,keys.length);
      var bw=16,gap=12,mL=22,mR=8,topPad=10,plotH=50,botPad=30;
      var W=mL+n*(bw+gap)+gap+mR, H=topPad+plotH+botPad, baseY=topPad+plotH, x0=mL+gap;
      var bInk=dark?'#dfe7f0':NAVY, bGrid=dark?'#22303f':'#e6ebf0', bAxis=dark?'#3a4d64':'#cfd8e3', bY=dark?'#8fa0b4':'#8a939b', bX=dark?'#9aa8bb':'#5b6b7b', bSep=dark?'#111b28':'#c7ced6';
      var maxv=1;keys.forEach(function(k){if(counts[k]>maxv)maxv=counts[k];});
      var top=(maxv%2===0)?maxv:maxv+1;if(top<2)top=2;var mid=top/2;
      var svg=svgEl('svg',{width:Math.round(W*sc),height:Math.round(H*sc),viewBox:'0 0 '+W+' '+H});
      [[top,topPad],[mid,baseY-plotH*(mid/top)],[0,baseY]].forEach(function(t){
        svg.appendChild(svgEl('line',{x1:mL,x2:W-mR,y1:t[1],y2:t[1],stroke:bGrid}));
        var tl=svgEl('text',{x:mL-5,y:t[1]+3,'text-anchor':'end','font-size':'8',fill:bY});tl.textContent=String(t[0]);svg.appendChild(tl);
      });
      svg.appendChild(svgEl('line',{x1:mL,x2:mL,y1:topPad,y2:baseY,stroke:bAxis}));
      keys.forEach(function(k,i){
        var h=Math.round((counts[k]/top)*plotH);var x=x0+i*(bw+gap),cxb=x+bw/2;
        var rect=svgEl('rect',{x:x,width:bw,rx:2,fill:fieldColor(k),stroke:(isInfoWhite(k)?CHART_GREEN:bSep),'stroke-width':(isInfoWhite(k)?'1':'0.75'),y:baseY,height:0});rect.style.transition='height 1s ease, y 1s ease';rect.style.cursor='pointer';
        var tt=svgEl('title',{});tt.textContent=k+': '+counts[k];rect.appendChild(tt);rect.onclick=function(){toggleFieldFilter(k);};svg.appendChild(rect);
        var vl=svgEl('text',{x:cxb,y:baseY-h-4,'text-anchor':'middle','font-size':'9','font-weight':'700',fill:bInk});vl.textContent=String(counts[k]);svg.appendChild(vl);
        var xlab=fieldDisp(k);var xfs=fitFs(xlab,8,(bw+gap)*1.6,4.5);var xl=svgEl('text',{x:cxb,y:baseY+10,'text-anchor':'end','font-size':xfs.toFixed(1),fill:bX,transform:'rotate(-35 '+cxb+' '+(baseY+10)+')'});xl.textContent=xlab;var xtt=svgEl('title',{});xtt.textContent=k;xl.appendChild(xtt);svg.appendChild(xl);
        (function(rc,hh,vlab){requestAnimationFrame(function(){requestAnimationFrame(function(){rc.setAttribute('y',baseY-hh);rc.setAttribute('height',hh);vlab.setAttribute('y',baseY-hh-4);});});})(rect,h,vl);
      });
      svg.appendChild(svgEl('line',{x1:mL,x2:W-mR,y1:baseY,y2:baseY,stroke:bAxis}));
      wrap.appendChild(svg);
    }
    return wrap;
  }
  function statusLegend(){var counts={};S.rows.forEach(function(r){var k=r.status||'—';counts[k]=(counts[k]||0)+1;});var keys=Object.keys(counts).sort();var lg=el('div',{class:'slegend',title:'Status colours (click to filter)'});keys.forEach(function(k){var d=el('div',{title:'Filter Status = '+k,onclick:function(){toggleStatusFilter(k);}});var i=el('i');i.style.background=statusColor(k);d.appendChild(i);d.appendChild(document.createTextNode(k+' '+counts[k]));lg.appendChild(d);});return lg;}
  function toggleStatusFilter(k){var v=(k==='—'?'':k);var cur=S.selFilters.status;if(cur&&cur.length===1&&cur[0]===v){S.selFilters.status=null;}else{S.selFilters.status=[v];}applyFilters();renderCharts();renderTable();saveCfg();}
  function toggleDonutPanel(){var ex=root.getElementById('donutpanel');if(ex){ex.remove();return;}var panel=el('div',{id:'donutpanel',class:'panel',style:'left:12px;top:150px'},[el('h4',{},['Show / Hide Phase Charts'])]);
    var mk=function(id,label){var cb=el('input',{type:'checkbox'});cb.checked=S.hiddenDonuts.indexOf(id)<0;cb.onchange=function(){var i=S.hiddenDonuts.indexOf(id);if(cb.checked){if(i>=0)S.hiddenDonuts.splice(i,1);}else if(i<0)S.hiddenDonuts.push(id);saveCfg();renderCharts();};panel.appendChild(el('label',{class:'crow'},[cb,el('span',{class:'cn'},[label])]));};
    S.phases.forEach(function(p){mk(p.id,p.label);});mk('__un','Unassigned');
    panel.appendChild(el('div',{style:'margin-top:8px'},[el('button',{class:'btn',onclick:function(){root.getElementById('donutpanel').remove();}},['Close'])]));
    collapsiblePanel(panel);root.getElementById('wrap').appendChild(panel);
  }
  function togglePhasePanel(){var ex=root.getElementById('phasepanel');if(ex){ex.remove();return;}renderPhasePanel();}
  function renderPhasePanel(){
    var old=root.getElementById('phasepanel');if(old)old.remove();
    var panel=el('div',{id:'phasepanel',class:'panel',style:'left:12px;top:150px;min-width:250px'},[el('h4',{},['Phases — rename & add']),el('div',{class:'muted',style:'font-size:11px;margin-bottom:6px'},['Rename how each phase appears in the Phase column and charts, or add a new one.'])]);
    S.phases.forEach(function(p){var sw=el('i',{style:'width:10px;height:10px;border-radius:2px;display:inline-block;background:'+phaseColor(p.id)});var i=el('input',{type:'text',value:p.label,style:'flex:1;border:1px solid #cfd8e3;border-radius:4px;padding:2px 6px;font-size:12px'});i.onchange=function(){p.label=i.value||p.id;saveCfg();renderTable();renderCharts();};var rm=el('button',{class:'mini',title:'Remove this phase',onclick:function(){S.phases=S.phases.filter(function(x){return x.id!==p.id;});saveCfg();renderTable();renderCharts();renderPhasePanel();}},['✕']);panel.appendChild(el('div',{class:'crow'},[sw,i,rm]));});
    var addv=el('input',{type:'text',placeholder:'New phase name…',style:'flex:1;border:1px solid #cfd8e3;border-radius:4px;padding:2px 6px;font-size:12px'});
    var add=el('button',{class:'btn',onclick:function(){var nm=addv.value.trim();if(!nm)return;var id='p_'+Date.now().toString(36)+'_'+S.phases.length;S.phases.push({id:id,label:nm});saveCfg();renderTable();renderCharts();renderPhasePanel();}},['Add']);
    panel.appendChild(el('div',{class:'crow',style:'margin-top:6px'},[addv,add]));
    panel.appendChild(el('div',{style:'margin-top:8px'},[el('button',{class:'btn',onclick:function(){root.getElementById('phasepanel').remove();}},['Close'])]));
    collapsiblePanel(panel);root.getElementById('wrap').appendChild(panel);
  }

  // ---- multi-select persistent column filters (dfilter columns) ----
  function distinctVals(k){var vals={};S.rows.forEach(function(r){var vv=cellVal(r,k);if(vv!=='')vals[vv]=1;});return Object.keys(vals).sort();}
  function selSummary(k){var d=distinctVals(k);var sel=S.selFilters[k];if(sel==null)return 'All';if(sel.length===0)return 'None';if(sel.length>=d.length)return 'All';return sel.length+'/'+d.length;}
  function multiFilterBtn(k){
    var b=el('div',{class:'mfbtn',title:'Filter '+COLDEF[k].label+' — tick the values to show (persists between sessions)'},[el('span',{class:'cv'},[selSummary(k)]),el('span',{},['▾'])]);
    b.onclick=function(e){e.stopPropagation();openMultiFilter(k,b);};
    return b;
  }
  function openMultiFilter(k,anchor){
    var wrapEl=root.getElementById('wrap');
    var ex=root.getElementById('mfpanel');var sameK=ex&&ex.getAttribute('data-k')===k;if(ex)ex.remove();if(sameK)return;
    var d=distinctVals(k);
    var panel=el('div',{id:'mfpanel',class:'mfpanel','data-k':k});
    function curSel(){var s=S.selFilters[k];return s==null?d.slice():s.slice();}
    function setSel(arr){S.selFilters[k]=(arr.length>=d.length)?null:arr;applyFilters();renderBody();renderCharts();saveCfg();var cv=anchor.querySelector('.cv');if(cv)cv.textContent=selSummary(k);}
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
  // ---- Package No multi-select (item 9) ----
  function packageSummary(){var d=distinctPackages();var sel=S.packageSel;if(sel==null||sel.length>=d.length)return 'All ('+d.length+')';if(sel.length===0)return 'None';return sel.length+' of '+d.length;}
  function openPackagePanel(anchor){
    var wrapEl=root.getElementById('wrap');
    var ex=root.getElementById('pkpanel');if(ex){ex.remove();return;}
    var d=distinctPackages();
    var panel=el('div',{id:'pkpanel',class:'mfpanel',style:'min-width:320px;max-width:440px'});
    function curSel(){var s=S.packageSel;return s==null?d.slice():s.slice();}
    function refreshOutputs(){applyScope();saveCfg();renderStats();renderCharts();renderBody();var cl=root.getElementById('countlbl');if(cl)cl.textContent=S.filtered.length+' of '+S.rows.length;var ps=root.getElementById('pksum');if(ps)ps.textContent=packageSummary();}
    function setSel(arr){S.packageSel=(arr.length>=d.length)?null:arr;refreshOutputs();}
    var listWrap=el('div',{});
    function rebuild(){listWrap.innerHTML='';if(!d.length){listWrap.appendChild(el('div',{class:'muted',style:'font-size:11px;padding:4px'},['No Package Numbers in this Deliverable Type.']));return;}var sel=curSel();d.forEach(function(v){var cb=el('input',{type:'checkbox',title:'Show rows in package '+v});cb.checked=sel.indexOf(v)>=0;cb.onchange=function(){var s=curSel();var i=s.indexOf(v);if(cb.checked){if(i<0)s.push(v);}else if(i>=0)s.splice(i,1);setSel(s);};
      var txt=el('input',{type:'text',class:'pktext',title:'Custom label shown beside package '+v+' in the register',placeholder:'add label…',value:(S.packageText&&S.packageText[v])||''});txt.oninput=function(){S.packageText=S.packageText||{};if(txt.value)S.packageText[v]=txt.value;else delete S.packageText[v];saveCfg();renderBody();};
      listWrap.appendChild(el('label',{class:'mfrow pkrow'},[cb,el('span',{class:'pkno'},[v]),txt]));});}
    panel.appendChild(el('div',{class:'mfhd'},[
      el('span',{style:'font-weight:700;color:'+NAVY+';font-size:11px'},['Package No']),
      el('a',{title:'Select all',style:'margin-left:auto',onclick:function(){setSel(d.slice());rebuild();}},['(All)']),
      el('a',{title:'Select none',onclick:function(){setSel([]);rebuild();}},['(None)']),
      el('a',{title:'Save the current selection & labels as your default',onclick:function(){setAsDefault();}},['★ Set Defaults']),
      el('a',{title:'Close',onclick:function(){var p=root.getElementById('pkpanel');if(p)p.remove();}},['✕'])
    ]));
    panel.appendChild(el('div',{class:'muted',style:'font-size:10.5px;padding:2px 4px 4px'},['Tick packages to filter the register. Type a label to show beside a package number.']));
    rebuild();panel.appendChild(listWrap);wrapEl.appendChild(panel);
    var ar=anchor.getBoundingClientRect(),wr=wrapEl.getBoundingClientRect();
    panel.style.left=Math.min(Math.max(4,wr.width-450),Math.max(4,ar.left-wr.left))+'px';panel.style.top=(ar.bottom-wr.top+2)+'px';
  }

  // ---- per-column colour scheme editor (Status / Lifecycle / Phase) ----
  var DATEREQ_STATES=[{key:'today',label:'Due today',def:'#1e7e34'},{key:'recent',label:'Overdue 1–6 days',def:'#c0392b'},{key:'late',label:'Overdue 7+ days',def:'#c0392b'}];
  function dateReqColor(key){return schemeGet('dateRequired',key)||(DATEREQ_STATES.filter(function(s){return s.key===key;})[0]||{}).def;}
  function schemeItems(kind){
    if(kind==='phase')return S.phases.map(function(p){return {key:p.id,label:p.label,hex:phaseColor(p.id)};});
    if(kind==='dateRequired')return DATEREQ_STATES.map(function(s){return {key:s.key,label:s.label,hex:dateReqColor(s.key)};});
    return distinctVals(kind).map(function(v){return {key:v.toLowerCase(),label:v,hex:(kind==='status'?statusColor(v):kind==='toAction'?(toActionColor(v)||'#1f2d3d'):lifeColor(v))};});
  }
  // kinds where the user can pre-add a value + colour that isn't in the data yet ("add to the list")
  function canAddScheme(kind){return kind==='status'||kind==='lifecycleStatus'||kind==='toAction';}
  function colorSchemePanel(kind,anchor){
    var wrapEl=root.getElementById('wrap');
    var ex=root.getElementById('cspanel');var same=ex&&ex.getAttribute('data-k')===kind;if(ex)ex.remove();if(same)return;
    var title=kind==='lifecycleStatus'?'Lifecycle Status':kind==='phase'?'Phase':kind==='toAction'?'To Action':kind==='dateRequired'?'Date Required':'Status';
    var panel=el('div',{id:'cspanel',class:'mfpanel','data-k':kind,style:'min-width:230px'});
    var bodyEl=el('div',{});
    function build(){bodyEl.innerHTML='';var items=schemeItems(kind);
      // custom-added values (not present in current data) so they persist in the list
      if(canAddScheme(kind)){var have={};items.forEach(function(it){have[it.key]=1;});Object.keys(S.colorSchemes[kind]||{}).forEach(function(key){if(!have[key])items.push({key:key,label:key,hex:S.colorSchemes[kind][key]});});}
      if(!items.length){bodyEl.appendChild(el('div',{class:'muted',style:'font-size:11px;padding:4px'},['No values in view yet — add one below.']));}
      items.forEach(function(it){var sw=el('input',{type:'color',value:toHex6(it.hex),style:'width:28px;height:20px;border:1px solid #cfd8e3;border-radius:3px;background:none;cursor:pointer;padding:0'});sw.onchange=function(){S.colorSchemes[kind][it.key]=sw.value;saveCfg();renderBody();renderCharts();};
        var row=[sw,el('span',{style:'flex:1'},[it.label])];
        if(canAddScheme(kind)&&S.colorSchemes[kind]&&S.colorSchemes[kind][it.key]!=null){row.push(el('a',{title:'Remove this value/colour',style:'color:#c0392b;font-size:12px;text-decoration:none',onclick:function(ev){ev.preventDefault();delete S.colorSchemes[kind][it.key];saveCfg();renderBody();renderCharts();build();}},['✕']));}
        bodyEl.appendChild(el('label',{class:'mfrow'},row));});
      if(kind==='dateRequired'){bodyEl.appendChild(el('div',{class:'muted',style:'font-size:10.5px;padding:2px 4px'},['Colours the Date Required cells by how overdue they are.']));}
      if(canAddScheme(kind)){var nv=el('input',{type:'text',placeholder:'add a value…',style:'flex:1;min-width:70px;font-size:11px;padding:2px 5px;border:1px solid #cfd8e3;border-radius:4px'});var nc=el('input',{type:'color',value:'#1f6feb',style:'width:28px;height:20px;border:1px solid #cfd8e3;border-radius:3px;background:none;cursor:pointer;padding:0'});
        var addBtn=el('a',{title:'Add this value and colour to the list',style:'font-weight:700;color:'+NAVY,onclick:function(ev){ev.preventDefault();var v=(nv.value||'').trim();if(!v)return;S.colorSchemes[kind][v.toLowerCase()]=nc.value;saveCfg();renderBody();renderCharts();build();}},['+ Add']);
        bodyEl.appendChild(el('div',{class:'mfrow',style:'border-top:1px solid #e3e9f0;margin-top:4px;padding-top:5px'},[nc,nv,addBtn]));}
    }
    panel.appendChild(el('div',{class:'mfhd'},[
      el('span',{style:'font-weight:700;color:'+NAVY+';font-size:11px'},['Colours — '+title]),
      el('a',{title:'Reset to default colours',style:'margin-left:auto',onclick:function(){S.colorSchemes[kind]={};saveCfg();renderBody();renderCharts();build();}},['Reset']),
      el('a',{title:'Close',onclick:function(){var p=root.getElementById('cspanel');if(p)p.remove();}},['✕'])
    ]));
    build();panel.appendChild(bodyEl);wrapEl.appendChild(panel);
    var ar=anchor.getBoundingClientRect(),wr=wrapEl.getBoundingClientRect();
    panel.style.left=Math.min(Math.max(4,wr.width-230),Math.max(4,ar.left-wr.left))+'px';panel.style.top=(ar.bottom-wr.top+2)+'px';
  }

  // ---- row selection (left-hand tick column) + "Open Selected" (opens each in its own tab) ----
  var SELW=16, selBtnEl=null;
  function selKeyOf(r){return String(r.documentId||r.docNo||'');}
  function isRowSel(r){return !!(S.rowSel&&S.rowSel[selKeyOf(r)]);}
  function setRowSel(r,v){S.rowSel=S.rowSel||{};if(v)S.rowSel[selKeyOf(r)]=1;else delete S.rowSel[selKeyOf(r)];}
  function selRows(){return (S.filtered||[]).filter(isRowSel);}   // register order = current sort/filter order
  function updateSelBtn(){
    var n=selRows().length;
    if(selBtnEl){
      selBtnEl.textContent='🔗 Open Selected'+(n?' ('+n+')':'');
      if(n){selBtnEl.removeAttribute('disabled');selBtnEl.setAttribute('title','Open the '+n+' selected document'+(n===1?'':'s')+' in Aconex — each in its own new tab, in the order they appear in the register');}
      else{selBtnEl.setAttribute('disabled','disabled');selBtnEl.setAttribute('title','Tick one or more rows in the left-hand column to enable this');}
    }
    var m=root&&root.getElementById('mps-selall');
    if(m){var t=(S.filtered||[]).length;m.checked=(t>0&&n===t);m.indeterminate=(n>0&&n<t);}
  }
  // Chrome allows only ONE new tab per click — the pop-up blocker consumes the
  // page's user activation on the first open — so a multi-select can only open in a
  // single press once pop-ups are allowed for this site. Open as many as the browser
  // permits, untick the ones that actually opened, and say plainly how to get the
  // rest; pressing again continues down the list, so every selected item does end up
  // in its own tab either way.
  function openSelected(){
    var rows=selRows();if(!rows.length)return;
    var todo=[],nolink=0;
    rows.forEach(function(r){var u=selLink(r);if(u)todo.push({r:r,u:u});else nolink++;});
    var got=[],blocked=0;
    for(var i=0;i<todo.length;i++){
      var w=null;try{w=window.open(todo[i].u,'_blank');}catch(e){}
      if(w){got.push(todo[i].r);}else{blocked=todo.length-i;break;}
    }
    // Untick whatever actually opened, so the count always reads "still to open",
    // reaches 0, and pressing again can never re-open a tab you already have.
    if(got.length){got.forEach(function(r){setRowSel(r,false);});renderBody();}
    var msg='Opened '+got.length+' of '+rows.length+' selected in new tabs';
    if(nolink)msg+=' · '+nolink+' with no Aconex link';
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
    var kids=[el('b',{},[msg+(n?(' — this browser blocked '+n+' pop-up'+(n===1?'':'s')+'.'):'.')])];
    if(n){
      kids.push(el('span',{},[' Chrome lets a page open only one tab per click. To open every selected item in one press: click the blocked-pop-up icon at the right of the address bar, choose “Always allow pop-ups and redirects from this site”, then press Open Selected again.']));
      kids.push(el('span',{},[' Until then, press Open Selected again for the next one — the ones already open have been unticked.']));
    }
    kids.push(el('a',{title:'Dismiss this notice',onclick:function(){var b=root.getElementById('mps-popuphelp');if(b)b.remove();}},['✕']));
    wrapEl.appendChild(el('div',{id:'mps-popuphelp',class:'mps-pophelp'+(n?'':' ok')},kids));
  }
  function selLink(r){return r.documentId?docUrl(r.documentId):'';}
  function selCellTd(row,pad){
    var cb=el('input',{type:'checkbox',title:'Select this document for “Open Selected”'});
    cb.checked=isRowSel(row);
    var td=el('td',{class:'mps-selcell',style:'padding:'+pad+'px 4px'},[cb]);
    cb.onclick=function(e){e.stopPropagation();};
    cb.onchange=function(){setRowSel(row,cb.checked);var tr=td.parentNode;if(tr)tr.classList.toggle('mps-selrow',cb.checked);updateSelBtn();};
    return td;
  }
  var dragKey=null;
  function renderTable(){
    var tw=root.querySelector('.tablewrap');if(!tw)return;tw.innerHTML='';
    var fl=root.getElementById('fontlbl');if(fl)fl.textContent=S.fontSize+'px';
    if(S.loading){tw.appendChild(el('div',{class:'loading'},['Loading live data from Aconex…']));return;}
    if(S.error){tw.appendChild(el('div',{class:'err'},['Could not load: '+S.error]));return;}
    var table=el('table');table.style.fontSize=S.fontSize+'px';
    var thead=el('thead'),htr=el('tr',{class:'hdr'}),letr=el('tr',{class:'colletrow'});
    letr.appendChild(el('th',{class:'colc mps-selcell',title:'Selection column — tick rows here, then press “Open Selected”'},['☑']));
    (function(){var m=el('input',{type:'checkbox',id:'mps-selall',title:'Select / clear every row currently shown'});m.onchange=function(){var v=m.checked;(S.filtered||[]).forEach(function(r){setRowSel(r,v);});renderBody();};htr.appendChild(el('th',{class:'mps-selcell',style:'padding:1px 2px'},[m]));})();
    visKeys().forEach(function(k,vi){
      var cd=COLDEF[k],w=S.cols[k].w;
      letr.appendChild(el('th',{class:'colc',style:'width:'+w+'px;min-width:'+w+'px',title:'Column '+colAlpha(vi)+' · '+cd.label},[colAlpha(vi)]));
      var lbl=el('span',{class:'lbl',draggable:'true',title:cd.tip},[colLabel(k)]);
      lbl.ondragstart=function(e){dragKey=k;try{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',k);}catch(_){}} ;
      lbl.ondragend=function(){dragKey=null;};
      var thKids=[lbl];var hicons=[];
      if(!cd.nosort){var srt=el('span',{class:'srt',title:'Sort by '+cd.label},[S.sortKey===k?(S.sortDir>0?'▲':'▼'):'↕']);srt.onclick=function(ev){ev.stopPropagation();if(S.sortKey===k)S.sortDir*=-1;else{S.sortKey=k;S.sortDir=1;}applyFilters();renderTable();};hicons.push(srt);}
      if(k==='status'||k==='lifecycleStatus'||k==='phase'||k==='toAction'||k==='dateRequired'){var pal=el('span',{class:'pal',title:'Change the '+cd.label+' colour scheme'},['🎨']);pal.onclick=function(ev){ev.stopPropagation();colorSchemePanel(k,pal);};hicons.push(pal);}if(hicons.length){thKids.push(el('span',{class:'hicons'},hicons));}
      var th=el('th',{style:'width:'+w+'px;min-width:'+Math.max(w,minHW(k))+'px;padding:'+Math.max(2,Math.round((S.rowPad-1)*(S.padScale||100)/100))+'px 2px;font-size:'+hdrFont()+'px',class:(COLDEF[k].edit?'mps-h':''),title:cd.tip},thKids);
      th.ondragover=function(e){if(dragKey&&dragKey!==k){e.preventDefault();th.classList.add('drop');}};
      th.ondragleave=function(){th.classList.remove('drop');};
      th.ondrop=function(e){e.preventDefault();th.classList.remove('drop');if(dragKey&&dragKey!==k){reorder(dragKey,k);}};
      var rez=el('div',{class:'rez',title:'Drag to resize this column'});makeResizable(rez,th,k);th.appendChild(rez);
      htr.appendChild(th);
    });
    thead.appendChild(letr);
    thead.appendChild(htr);
    // filter row
    var ftr=el('tr',{class:'f'});ftr.appendChild(el('td',{class:'mps-selcell'},[]));var ftop=(S.fontSize+2*S.rowPad+8);
    visKeys().forEach(function(k){
      var cell;
      if(k==='rowNo'){
        cell=el('td',{style:'width:'+S.cols[k].w+'px'},[]);
      } else if(COLDEF[k].dfilter){
        cell=el('td',{style:'width:'+S.cols[k].w+'px'},[multiFilterBtn(k)]);
      } else {
        var inp=el('input',{type:'text',title:'Filter '+COLDEF[k].label,placeholder:'⌕',value:S.colFilters[k]||''});inp.oninput=function(){S.colFilters[k]=inp.value;applyFilters();renderBody();renderCharts();};
        cell=el('td',{style:'width:'+S.cols[k].w+'px'},[inp]);
      }
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
    // sticky stacking: column-letter row (top:0) → header row → filter row
    renderBody();
    var letRow=table.querySelector('tr.colletrow'), hRow=table.querySelector('tr.hdr'), frow=table.querySelector('tr.f');
    var letH=letRow?letRow.offsetHeight:0;
    if(hRow){hRow.querySelectorAll('th').forEach(function(th){th.style.top=letH+'px';});}
    var hH=hRow?hRow.offsetHeight:0;
    if(frow){frow.querySelectorAll('td').forEach(function(td){td.style.top=(letH+hH)+'px';});}
  }
  function renderBody(){
    var tb=root.getElementById('tbody');if(!tb)return;tb.innerHTML='';
    var cl=root.getElementById('countlbl');if(cl)cl.textContent=S.filtered.length+' of '+S.rows.length;
    var pad=Math.max(0,Math.round(S.rowPad*(S.padScale||100)/100)), ws=S.wrap?'normal':'nowrap', ov=S.wrap?'visible':'hidden';
    S.filtered.forEach(function(row,ri){
      var tr=el('tr');
      if(isRowSel(row))tr.classList.add('mps-selrow');
      tr.appendChild(selCellTd(row,pad));
      visKeys().forEach(function(k){
        var td,w=S.cols[k].w;
        var base='width:'+w+'px;max-width:'+w+'px;padding:'+pad+'px 6px;white-space:'+ws+';overflow:'+ov+';text-overflow:ellipsis';
        if(k==='rowNo'){
          var du=docUrl(row.documentId);
          var pdf=el('a',{class:'cico cpdf',href:fileUrl(row.documentId),target:'_blank',rel:'noopener',title:'Download the PDF for '+row.docNo},['🗎']);
          var num=el('span',{class:'cnum'},[String(ri+1)]);
          var edit=el('a',{class:'cico cedit',href:du,target:'_blank',rel:'noopener',title:'Open '+row.docNo+' in Aconex to update it (Update Document)'},['✎']);
          td=el('td',{style:base+';text-align:center;white-space:nowrap'},[pdf,num,edit]);
        }
        else if(COLDEF[k].edit){td=editCell(row,k,base);}
        else if(k==='title'){var a=el('a',{class:'doclink',href:docUrl(row.documentId),target:'_blank',rel:'noopener',title:'Open '+row.docNo+' in Aconex'},[cellVal(row,k)]);td=el('td',{style:base,title:cellVal(row,k)},[a]);}
        else if(k==='status'){td=el('td',{style:base},[el('span',{class:'pill',style:'background:'+statusColor(row.status)+';color:'+statusFg(row.status),title:row.status||''},[statusDisp(row.status)])]);}
        else if(k==='lifecycleStatus'){var lv=row.lifecycleStatus||'';td=el('td',{style:base,title:lv},[lv?el('span',{class:'pill',style:'background:'+lifeColor(lv)+';color:'+lifeFg(lv)},[lv]):lv]);}
        else{td=el('td',{style:base,title:cellVal(row,k)},[cellVal(row,k)]);}
        tr.appendChild(td);
      });
      tr.appendChild(el('td',{class:'mps-fill'},[]));
      tb.appendChild(tr);
    });
    updateSelBtn();
  }
  function editCell(row,k,base){
    var td=el('td',{class:'edit',style:base});
    if(k==='priority'){var sel=el('select',{class:'mps-sel',title:'Set priority'});PRIORITIES.forEach(function(p){var o=el('option',{value:p});o.textContent=p||'—';if(row.priority===p)o.selected=true;sel.appendChild(o);});function paintPr(v){var c=v?(PRIORITY_COLORS[v]||'#fffdf5'):'';if(v){td.style.background=c;sel.style.backgroundColor=c;sel.style.color='#fff';sel.style.fontWeight='700';sel.classList.add('set');}else{td.style.background='';sel.style.backgroundColor='';sel.style.color='';sel.style.fontWeight='';sel.classList.remove('set');}}paintPr(row.priority);sel.onchange=function(){setOverride(row,'priority',sel.value);paintPr(sel.value);};td.appendChild(sel);}
    else if(k==='phase'){var sel=el('select',{class:'mps-sel',title:'Select project phase (not held in Aconex)'});var o0=el('option',{value:''});o0.textContent='—';if(!row.phase)o0.selected=true;sel.appendChild(o0);S.phases.forEach(function(p){var o=el('option',{value:p.id});o.textContent=p.label;if((row.phase||'')===p.id)o.selected=true;sel.appendChild(o);});function paintPh(v){if(v){td.style.background=phaseColor(v);sel.style.backgroundColor=phaseColor(v);sel.style.color='#fff';sel.style.fontWeight='700';sel.classList.add('set');}else{td.style.background='';sel.style.backgroundColor='';sel.style.color='';sel.style.fontWeight='';sel.classList.remove('set');}}paintPh(row.phase);sel.onchange=function(){setOverride(row,'phase',sel.value);paintPh(sel.value);try{sel.blur();}catch(e){}renderCharts();renderStats();};td.appendChild(sel);}
    else{var inp=el('input',{type:COLDEF[k].edit==='date'?'date':'text',title:COLDEF[k].tip,value:row[k]||''});if(k==='toAction'){var ap=function(){var tc=toActionColor(inp.value);inp.style.color=tc||'';inp.style.fontWeight=tc?'700':'';};ap();inp.oninput=ap;}if(COLDEF[k].edit==='date'){styleDateInput(inp,k,inp.value);}inp.onchange=function(){setOverride(row,k,inp.value);if(COLDEF[k].edit==='date')styleDateInput(inp,k,inp.value);};td.appendChild(inp);}
    return td;
  }
  function setOverride(row,key,val){row[key]=val;var o=S.overrides[row.docNo]||(S.overrides[row.docNo]={});o[key]=val;saveOverrides();ghPush();}

  // ---- column ops ----
  function reorder(from,to){var o=S.order.slice();var fi=o.indexOf(from),ti=o.indexOf(to);if(fi<0||ti<0)return;o.splice(fi,1);ti=o.indexOf(to);o.splice(ti,0,from);S.order=o;saveCfg();renderTable();if(root.getElementById('colpanel'))renderColPanel();}
  function toggleColPanel(){var ex=root.getElementById('colpanel');if(ex){ex.remove();return;}renderColPanel();}
  function moveCol(k,dir){var o=S.order.slice();var i=o.indexOf(k),j=i+dir;if(j<0||j>=o.length)return;var t=o[i];o[i]=o[j];o[j]=t;S.order=o;saveCfg();renderTable();renderColPanel();}
  var pDrag=null;
  function renderColPanel(){
    var old=root.getElementById('colpanel');var sc=old?(old.querySelector('.clist')||{}).scrollTop:0;if(old)old.remove();
    var panel=el('div',{id:'colpanel',class:'panel',style:'left:12px;top:100px;max-height:calc(100vh - 128px);overflow:hidden'},[el('h4',{style:'white-space:normal'},['Columns']),el('div',{class:'muted',style:'font-size:11px;margin-bottom:6px;white-space:normal'},['Tick to show/hide. ▲▼ reorder. Type in a box to rename that header (blank = default).'])]);
    var list=el('div',{class:'clist',style:'flex:1 1 auto;overflow:auto;min-height:40px'});var __pb=document.createElement('span');__pb.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;font:'+(S.baseFont||DEF_BASEPX)+'px '+fontStack(S.fontFamily);root.appendChild(__pb);var nameW=60;S.order.forEach(function(k){__pb.textContent=COLDEF[k].label;if(__pb.offsetWidth>nameW)nameW=__pb.offsetWidth;});__pb.remove();nameW=Math.min(230,Math.round(nameW)+24);
    S.order.forEach(function(k,idx){
      var cb=el('input',{type:'checkbox',title:'Show / hide '+COLDEF[k].label});cb.checked=S.cols[k].show;cb.onchange=function(){S.cols[k].show=cb.checked;saveCfg();renderTable();};
      var nm=el('input',{type:'text',title:'Rename the '+COLDEF[k].label+' column header (blank = default: '+COLDEF[k].label+')',value:colLabel(k),style:'flex:0 0 auto;width:'+nameW+'px;margin:0 auto;text-align:center;font-size:12px;padding:2px 5px;border:1px solid #cfd8e3;border-radius:4px;box-sizing:border-box'});nm.onchange=function(){var v=(nm.value||'').trim();if(v&&v!==COLDEF[k].label){S.colNames[k]=v;}else{delete S.colNames[k];nm.value=COLDEF[k].label;}saveCfg();renderTable();};nm.onkeydown=function(e){if(e.key==='Enter')nm.blur();};
      var up=el('button',{class:'mini',title:'Move up',onclick:function(){moveCol(k,-1);}},['▲']);var dn=el('button',{class:'mini',title:'Move down',onclick:function(){moveCol(k,1);}},['▼']);
      if(idx===0)up.disabled=true;if(idx===S.order.length-1)dn.disabled=true;
      var arrows=el('span',{style:'flex:0 0 auto;display:inline-flex;gap:3px'},[up,dn]);var rowEl=el('div',{class:'crow'},[arrows,cb,nm]);
      rowEl.ondragover=function(e){if(pDrag&&pDrag!==k){e.preventDefault();rowEl.classList.add('drop');}};
      rowEl.ondragleave=function(){rowEl.classList.remove('drop');};
      rowEl.ondrop=function(e){e.preventDefault();rowEl.classList.remove('drop');if(pDrag&&pDrag!==k)reorder(pDrag,k);};
      list.appendChild(rowEl);
    });
    panel.appendChild(list);
    panel.appendChild(el('div',{style:'margin-top:8px;display:flex;gap:6px;flex:0 0 auto'},[el('button',{class:'btn',title:'Restore default columns',onclick:function(){resetCols();}},['Reset']),el('button',{class:'btn',title:'Close',onclick:function(){var p=root.getElementById('colpanel');if(p)p.remove();}},['Close'])]));
    // width = widest column title + controls + mirrored padding (A1)
    var probe=document.createElement('span');probe.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;font:'+(S.baseFont||DEF_BASEPX)+'px '+fontStack(S.fontFamily);root.appendChild(probe);
    var maxw=54;S.order.forEach(function(k){probe.textContent=COLDEF[k].label;if(probe.offsetWidth>maxw)maxw=probe.offsetWidth;});probe.remove();
    panel.style.width=Math.min(360,Math.round(maxw)+18+8+48+20+20)+'px';
    collapsiblePanel(panel);
    root.getElementById('wrap').appendChild(panel);var l=panel.querySelector('.clist');if(l)l.scrollTop=sc;
  }
  function toggleHdrPanel(anchor){var ex=root.getElementById('hdrpanel');if(ex){ex.remove();return;}var wrapEl=root.getElementById('wrap');var panel=el('div',{id:'hdrpanel',class:'panel',style:'min-width:236px'},[el('h4',{style:'cursor:default'},['Header Settings']),el('div',{class:'muted',style:'font-size:11px;margin-bottom:8px;white-space:normal'},['Adjust the column header row. Saved to your default when you press ★ Set As Default.'])]);var szval=el('span',{class:'fpct'},[hdrFont()+'px']);var rng=el('input',{type:'range',min:'8',max:'22',value:String(hdrFont()),class:'rng',title:'Header font size'});function setFs(v){v=Math.max(8,Math.min(22,Math.round(v)));S.hdrFontSize=v;szval.textContent=v+'px';rng.value=String(v);saveCfg();renderTable();equalizeChartHeaders();}rng.oninput=function(){setFs(+rng.value);};var minus=el('button',{class:'btn sq',title:'Smaller header font',onclick:function(){setFs(hdrFont()-1);}},['−']);var plus=el('button',{class:'btn sq',title:'Larger header font',onclick:function(){setFs(hdrFont()+1);}},['+']);panel.appendChild(el('div',{class:'fontrow'},[el('label',{},['Font size']),el('span',{class:'sldgrp'},[minus,rng,plus]),szval]));var linesWrap=el('span',{style:'display:inline-flex;gap:5px'});function refreshLines(){Array.prototype.forEach.call(linesWrap.children,function(b){b.classList.toggle('active',(+b.getAttribute('data-n'))===hdrMaxLines());});}[1,2,3].forEach(function(nn){linesWrap.appendChild(el('button',{class:'chip','data-n':String(nn),title:'Allow headers to use up to '+nn+' line'+(nn>1?'s':''),onclick:function(){S.hdrMaxLines=nn;saveCfg();renderTable();refreshLines();equalizeChartHeaders();}},[String(nn)]));});panel.appendChild(el('div',{class:'fontrow'},[el('label',{title:'Maximum number of text lines a header may wrap to'},['Max lines']),linesWrap]));refreshLines();panel.appendChild(el('div',{style:'margin-top:10px;display:flex;gap:6px'},[el('button',{class:'btn',title:'Restore the default header size and 2 lines',onclick:function(){S.hdrFontSize=null;S.hdrMaxLines=2;saveCfg();renderTable();equalizeChartHeaders();var p=root.getElementById('hdrpanel');if(p)p.remove();toggleHdrPanel(anchor);}},['Reset']),el('button',{class:'btn',title:'Close',onclick:function(){var p=root.getElementById('hdrpanel');if(p)p.remove();}},['Close'])]));wrapEl.appendChild(panel);if(anchor){var ar=anchor.getBoundingClientRect(),wr=wrapEl.getBoundingClientRect();panel.style.left=Math.min(Math.max(4,wr.width-panel.offsetWidth-8),Math.max(4,ar.left-wr.left))+'px';panel.style.top=(ar.bottom-wr.top+4)+'px';}else{panel.style.left='12px';panel.style.top='120px';}}
  function autofitCol(k){var probe=document.createElement('span');probe.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;font:'+S.fontSize+'px "Segoe UI",Arial';root.appendChild(probe);var w=Math.min(460,Math.max(minHW(k),dataMinW(k,probe)));probe.remove();S.cols[k].w=w;saveCfg();renderTable();}
  function makeResizable(handle,th,k){handle.onmousedown=function(e){e.preventDefault();e.stopPropagation();var sx=e.clientX,sw=th.offsetWidth;function mv(ev){var w=Math.max(minHW(k),sw+(ev.clientX-sx));S.cols[k].w=w;th.style.width=w+'px';th.style.minWidth=w+'px';}function up(){document.removeEventListener('mousemove',mv);document.removeEventListener('mouseup',up);saveCfg();renderBody();var frow=root.querySelector('tr.f');if(frow){var i=visKeys().indexOf(k);var td=frow.querySelectorAll('td')[i];if(td)td.style.width=S.cols[k].w+'px';}}document.addEventListener('mousemove',mv);document.addEventListener('mouseup',up);};handle.ondblclick=function(e){e.preventDefault();e.stopPropagation();autofitCol(k);};handle.title='Drag to resize · double-click to autofit to contents';}
  function dataMinW(k,probe){var ed=COLDEF[k]&&COLDEF[k].edit;if(ed==='date')return 124;var pad=(ed==='phase'||ed==='priority')?34:14;var mw=0;if(ed==='phase'){S.phases.forEach(function(p){probe.textContent=p.label;if(probe.offsetWidth>mw)mw=probe.offsetWidth;});}else if(ed==='priority'){PRIORITIES.forEach(function(p){probe.textContent=p||'—';if(probe.offsetWidth>mw)mw=probe.offsetWidth;});}S.filtered.slice(0,300).forEach(function(row){probe.textContent=cellVal(row,k);if(probe.offsetWidth>mw)mw=probe.offsetWidth;});return mw+pad;}
function optimiseWidths(){var probe=document.createElement('span');probe.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;font:'+S.fontSize+'px "Segoe UI",Arial';root.appendChild(probe);visKeys().forEach(function(k){S.cols[k].w=Math.min(460,Math.max(minHW(k),dataMinW(k,probe)));});probe.remove();saveCfg();renderTable();}
  function fitOnePage(){var tw=root.querySelector('.tablewrap');if(!tw)return;var keys=visKeys();if(!keys.length)return;var PAD_OH=13;var avail=Math.max(240,tw.clientWidth-18-SELW-keys.length*PAD_OH);var probe=document.createElement('span');probe.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;font:'+S.fontSize+'px "Segoe UI",Arial';root.appendChild(probe);var floorMin={},floorData={},desired={},sumMinH=0,sumData=0;keys.forEach(function(k){var fm=Math.ceil(minHW(k));var fd=Math.ceil(Math.max(fm,Math.min(dataMinW(k,probe),160)));floorMin[k]=fm;floorData[k]=fd;desired[k]=Math.max(fd,Math.min(460,dataMinW(k,probe)));sumMinH+=fm;sumData+=fd;});probe.remove();var noClip=(sumData<=avail);var mins=noClip?floorData:floorMin,sumMin=noClip?sumData:sumMinH,sumExtra=0;keys.forEach(function(k){sumExtra+=Math.max(0,desired[k]-mins[k]);});keys.forEach(function(k){S.cols[k].w=mins[k];});var leftover=avail-sumMin;if(leftover>0){if(sumExtra>0){keys.forEach(function(k){var extra=Math.max(0,desired[k]-mins[k]);S.cols[k].w=Math.round(mins[k]+leftover*(extra/sumExtra));});}else{var per=Math.floor(leftover/keys.length);keys.forEach(function(k){S.cols[k].w=mins[k]+per;});}}saveCfg();renderTable();}
  function resetCols(){var b;try{var d=localStorage.getItem(DKEY);if(d)b=mergeCfg(JSON.parse(d));}catch(e){}if(!b)b=factoryCfg();S.order=b.order;S.cols=b.cols;S.fontSize=b.fontSize;S.rowPad=b.rowPad;S.wrap=b.wrap;S.phases=b.phases;S.chartType=b.chartType;S.hiddenDonuts=b.hiddenDonuts;if(b.selFilters)S.selFilters=b.selFilters;S.chartScale=b.chartScale||1;if(b.colorSchemes)S.colorSchemes=normSchemes(b.colorSchemes);if(b.collapsed)S.collapsed=b.collapsed;S.barExpanded=!!b.barExpanded;S.chartDataField=b.chartDataField||'status';S.fontScale=b.fontScale||100;S.padScale=b.padScale||100;S.hpadScale=b.hpadScale||100;S.hdrFontSize=(b.hdrFontSize!=null?b.hdrFontSize:null);S.hdrMaxLines=b.hdrMaxLines||2;S.colNames=b.colNames||{};S.packageSel=(b.packageSel!=null?b.packageSel:null);S.packageText=b.packageText||{};applyScope();saveCfg();renderAll();}
  function setAsDefault(){try{localStorage.setItem(DKEY,JSON.stringify({order:S.order,cols:S.cols,fontSize:S.fontSize,rowPad:S.rowPad,wrap:S.wrap,phases:S.phases,chartType:S.chartType,hiddenDonuts:S.hiddenDonuts,selFilters:S.selFilters,chartScale:S.chartScale,colorSchemes:S.colorSchemes,fontFamily:S.fontFamily,baseFont:S.baseFont,darkMode:S.darkMode,collapsed:S.collapsed,barExpanded:S.barExpanded,chartDataField:S.chartDataField,fontScale:S.fontScale,padScale:S.padScale,hpadScale:S.hpadScale,hdrFontSize:S.hdrFontSize,hdrMaxLines:S.hdrMaxLines,colNames:S.colNames,packageSel:S.packageSel,packageText:S.packageText}));}catch(e){}toast('Saved as your default view');}
  function toast(msg){var t=el('div',{style:'position:absolute;bottom:16px;left:50%;transform:translateX(-50%);background:'+NAVY+';color:#fff;padding:8px 16px;border-radius:6px;font-size:12px;z-index:20;box-shadow:0 4px 16px rgba(0,0,0,.25)'},[msg]);root.getElementById('wrap').appendChild(t);setTimeout(function(){t.remove();},1800);}

  // ---- XLSX export (self-contained; visible cols in current order) ----
  var CRC=(function(){var c,t=[];for(var n=0;n<256;n++){c=n;for(var k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
  function crc32(b){var c=0xFFFFFFFF;for(var i=0;i<b.length;i++)c=CRC[(c^b[i])&0xFF]^(c>>>8);return (c^0xFFFFFFFF)>>>0;}
  function u8(s){return new TextEncoder().encode(s);}function num(n,l){var a=new Uint8Array(l);for(var i=0;i<l;i++){a[i]=n&0xFF;n=Math.floor(n/256);}return a;}
  function zipStore(files){var ch=[],cen=[],off=0;function push(a){ch.push(a);off+=a.length;}files.forEach(function(f){var nm=u8(f.name),crc=crc32(f.data),st=off;push(new Uint8Array([80,75,3,4]));push(num(20,2));push(num(0,2));push(num(0,2));push(num(0,2));push(num(0,2));push(num(crc,4));push(num(f.data.length,4));push(num(f.data.length,4));push(num(nm.length,2));push(num(0,2));push(nm);push(f.data);cen.push({nm:nm,crc:crc,sz:f.data.length,off:st});});var cs=off;cen.forEach(function(c){push(new Uint8Array([80,75,1,2]));push(num(20,2));push(num(20,2));push(num(0,2));push(num(0,2));push(num(0,2));push(num(0,2));push(num(c.crc,4));push(num(c.sz,4));push(num(c.sz,4));push(num(c.nm.length,2));push(num(0,2));push(num(0,2));push(num(0,2));push(num(0,2));push(num(0,4));push(num(c.off,4));push(c.nm);});var ce=off;push(new Uint8Array([80,75,5,6]));push(num(0,2));push(num(0,2));push(num(cen.length,2));push(num(cen.length,2));push(num(ce-cs,4));push(num(cs,4));push(num(0,2));var tot=0;ch.forEach(function(c){tot+=c.length;});var out=new Uint8Array(tot),p=0;ch.forEach(function(c){out.set(c,p);p+=c.length;});return out;}
  function xesc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function colLetter(i){var s='';i++;while(i>0){var m=(i-1)%26;s=String.fromCharCode(65+m)+s;i=Math.floor((i-1)/26);}return s;}
  function argb(h){return 'FF'+h.replace('#','').toUpperCase();}
  function buildXlsx(keys,rows){
    var fonts=['<font><sz val="11"/><name val="Calibri"/></font>','<font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Calibri"/></font>'];
    var sF={},sC={};Object.keys(STATUS_COLORS).forEach(function(k){sC[STATUS_COLORS[k]]=1;});Object.keys(sC).forEach(function(h){sF[h]=fonts.length;fonts.push('<font><b/><color rgb="'+argb(h)+'"/><sz val="11"/><name val="Calibri"/></font>');});
    var fills=['<fill><patternFill patternType="none"/></fill>','<fill><patternFill patternType="gray125"/></fill>','<fill><patternFill patternType="solid"><fgColor rgb="'+argb(NAVY)+'"/></patternFill></fill>'];
    var pF={};Object.keys(PRIORITY_COLORS).forEach(function(p){pF[p]=fills.length;fills.push('<fill><patternFill patternType="solid"><fgColor rgb="'+argb(PRIORITY_COLORS[p])+'"/></patternFill></fill>');});
    var phF={};S.phases.forEach(function(p){phF[p.id]=fills.length;fills.push('<fill><patternFill patternType="solid"><fgColor rgb="'+argb(phaseColor(p.id))+'"/></patternFill></fill>');});
    var xfs=['<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>','<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center"/></xf>'];
    var sX={};Object.keys(sC).forEach(function(h){sX[h]=xfs.length;xfs.push('<xf numFmtId="0" fontId="'+sF[h]+'" fillId="0" borderId="0" xfId="0" applyFont="1"/>');});
    var pX={};Object.keys(PRIORITY_COLORS).forEach(function(p){pX[p]=xfs.length;xfs.push('<xf numFmtId="0" fontId="1" fillId="'+pF[p]+'" borderId="0" xfId="0" applyFont="1" applyFill="1"/>');});
    var phX={};S.phases.forEach(function(p){phX[p.id]=xfs.length;xfs.push('<xf numFmtId="0" fontId="1" fillId="'+phF[p.id]+'" borderId="0" xfId="0" applyFont="1" applyFill="1"/>');});
    var styles='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="'+fonts.length+'">'+fonts.join('')+'</fonts><fills count="'+fills.length+'">'+fills.join('')+'</fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="'+xfs.length+'">'+xfs.join('')+'</cellXfs></styleSheet>';
    var colsXml='<cols>'+keys.map(function(k,i){return '<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+Math.max(8,Math.round(S.cols[k].w/7))+'" customWidth="1"/>';}).join('')+'</cols>';
    var rowsXml='<row r="1">'+keys.map(function(k,i){return '<c r="'+colLetter(i)+'1" t="inlineStr" s="1"><is><t xml:space="preserve">'+xesc(colLabel(k))+'</t></is></c>';}).join('')+'</row>';
    rows.forEach(function(row,ri){var r=ri+2;rowsXml+='<row r="'+r+'">'+keys.map(function(k,i){var v=cellVal(row,k),s=0;if(k==='status'){var h=STATUS_COLORS[(row.status||'').toLowerCase()];if(h&&sX[h]!=null)s=sX[h];}if(k==='priority'&&row.priority&&pX[row.priority]!=null)s=pX[row.priority];if(k==='phase'&&row.phase&&phX[row.phase]!=null)s=phX[row.phase];return '<c r="'+colLetter(i)+r+'" t="inlineStr" s="'+s+'"><is><t xml:space="preserve">'+xesc(v)+'</t></is></c>';}).join('')+'</row>';});
    var lastCol=colLetter(keys.length-1),lastRow=rows.length+1;
    var sheet='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="15"/>'+colsXml+'<sheetData>'+rowsXml+'</sheetData><autoFilter ref="A1:'+lastCol+lastRow+'"/></worksheet>';
    var wb='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Aconex ITP Register" sheetId="1" r:id="rId1"/></sheets></workbook>';
    var wbRels='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>';
    var rels='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
    var ct='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>';
    return zipStore([{name:'[Content_Types].xml',data:u8(ct)},{name:'_rels/.rels',data:u8(rels)},{name:'xl/workbook.xml',data:u8(wb)},{name:'xl/_rels/workbook.xml.rels',data:u8(wbRels)},{name:'xl/styles.xml',data:u8(styles)},{name:'xl/worksheets/sheet1.xml',data:u8(sheet)}]);
  }
  function exportExcel(){try{var keys=visKeys(),data=buildXlsx(keys,S.filtered);var blob=new Blob([data],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Aconex_ITP_Register_'+CFG.projectName.replace(/\s+/g,'')+'_'+new Date().toISOString().slice(0,10)+'.xlsx';document.documentElement.appendChild(a);a.click();a.remove();}catch(e){alert('Export failed: '+e);}}

  function gotoRFI(){try{if(window.__MPS_ACONEX_RFI){close();window.__MPS_ACONEX_RFI.boot();return;}var u='https://api.github.com/repos/MPS-TK/ITR-Dashboard/contents/aconex/aconex_rfi_dashboard.js?ref=main';var h={Accept:'application/vnd.github.raw'};var t=(function(){try{return localStorage.getItem('mps_gh_token')||localStorage.getItem('__itr_gh_token__')||'';}catch(e){return '';}})();if(t)h.Authorization='token '+t;fetch(u,{headers:h}).then(function(r){return r.text();}).then(function(s){(0,eval)(s);close();if(window.__MPS_ACONEX_RFI)window.__MPS_ACONEX_RFI.boot();}).catch(function(e){alert('Could not load the RFI module: '+e);});}catch(e){}}
  function boot(){ensureShell();host.style.display='block';refreshRsrc();if(!S.allRows.length&&!S.loading)fetchData();else renderAll();}
  function close(){if(host)host.style.display='none';}
  window.__MPS_ACONEX={__live:true,boot:boot,close:close,_state:S,_cfg:CFG,buildXlsx:buildXlsx};
  boot();
})();
