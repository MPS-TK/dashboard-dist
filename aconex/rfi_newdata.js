/* MPS GROUP — Aconex RFI/TQ register: robust new-item pickup (additive layer).
 * The RFI module's list is frozen (it never re-enumerates). This layer runs whenever the
 * RFIs/TQs module is loaded: it enumerates ALL RFIs/TQs via a cap-safe docno-prefix search,
 * finds any not already in the register, and injects them as new rows. Existing rows and
 * overrides are UNTOUCHED. Built rows are cached for fast repeat loads; the module's own
 * Cross-check attributes correspondence (auto-fired once when brand-new refs appear) and its
 * results persist via the module's xdata cache, from which this layer restores attribution. */
(function(){
  var RTYPES={'Request For Information':'RFI','Technical Query':'TQ'};
  function dp(s){return (s||'').slice(0,10);}
  function tg(el,t){var e=el.getElementsByTagName(t)[0];return e?e.textContent:'';}
  function api(pid){return 'https://'+location.hostname+'/api/projects/'+pid;}
  function xdataKey(){for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(/^mps_aconex_rfi_xdata_/.test(k))return k;}return null;}
  async function pickup(M){
    var S=M._state, pid=(S.allRows[0]||{})._refPid; if(!pid) return;
    var own={},cp={};
    S.allRows.forEach(function(r){var m=/^([A-Za-z0-9]+)-([A-Za-z]+)-\d+$/.exec(r.aconexRef||'');if(m){var p=m[1]+'-'+m[2];if(r._refMailbox===5)own[p]=1;else if(r._refMailbox===4)cp[p]=1;}});
    var jobs=[]; Object.keys(own).forEach(function(p){jobs.push(['sentbox',p]);}); Object.keys(cp).forEach(function(p){jobs.push(['inbox',p]);});
    if(!jobs.length) return;
    var found={};
    for(var i=0;i<jobs.length;i++){
      var box=jobs[i][0], pfx=jobs[i][1];
      var url=api(pid)+'/mail?mail_box='+box+'&page_size=250&page_number=1&search_query='+encodeURIComponent('docno:'+pfx+'*')+'&return_fields=docno,corrtypeid';
      var r; try{ r=await fetch(url,{headers:{Accept:'application/xml'},cache:'no-store'}); }catch(e){ continue; }
      if(!r.ok) continue;
      var t=await r.text(), doc=new DOMParser().parseFromString(t,'application/xml'), ms=doc.getElementsByTagName('Mail');
      for(var j=0;j<ms.length;j++){var m=ms[j],ty=(m.getElementsByTagName('CorrespondenceType')[0]||{}).textContent||'';if(RTYPES[ty]){var dn=(m.getElementsByTagName('MailNo')[0]||{}).textContent||'';if(dn&&!found[dn])found[dn]={id:m.getAttribute('MailId'),box:box,type:RTYPES[ty]};}}
    }
    var have={}; S.allRows.forEach(function(r){have[r.aconexRef]=1;});
    var missing=Object.keys(found).filter(function(d){return !have[d];}).sort();
    if(!missing.length) return;
    var CK='mps_rfi_add_'+pid, cache={}; try{cache=JSON.parse(localStorage.getItem(CK)||'{}');}catch(e){}
    var xk=xdataKey(), xd={}; if(xk){try{xd=JSON.parse(localStorage.getItem(xk)||'{}');}catch(e){}}
    var maxNo=Math.max.apply(null,S.allRows.map(function(r){return r.rfiNo||0;}));
    for(var k=0;k<missing.length;k++){
      var ref=missing[k], mm=found[ref], base=cache[ref];
      if(!base){
        try{
          var rr=await fetch(api(pid)+'/mail/'+mm.id,{headers:{Accept:'application/xml'},cache:'no-store'});
          var tt=await rr.text(), d2=new DOMParser().parseFromString(tt,'application/xml'), root=d2.documentElement;
          var rq=root.getElementsByTagName('ResponseRequired')[0];
          base={aconexRef:ref,mailNo:ref,sender:(mm.box==='sentbox'?'MPS':'BHP'),type:mm.type,dateSent:dp(tg(root,'SentDate')),dateRespReq:(rq?dp(tg(rq,'ResponseRequiredDate')):''),description:tg(root,'Subject'),closed:(/closed/i.test(tg(root,'Status'))?'Closed':'Open'),_refMailId:mm.id,_refMailbox:(mm.box==='sentbox'?5:4),_refPid:pid};
          cache[ref]=base;
        }catch(e){ continue; }
      }
      if(have[ref]) continue;
      var a=xd[ref]||{};
      S.allRows.push({rfiNo:++maxNo,aconexRef:base.aconexRef,mailNo:base.mailNo,sender:base.sender,type:base.type,dateSent:base.dateSent,dateRespReq:base.dateRespReq,followUp1:'',followUp2:'',dateRespRecd:'',dateClosed:'',closed:base.closed,description:base.description,comments:'',respMailNo:'',eot:'No',costVar:'No',_mpsMails:(a.mps||[]),_bhpMails:(a.bhp||[]),_corr:(a.corr||[]),_autoFu1:(a.fu1||''),_autoFu2:(a.fu2||''),_refMailId:base._refMailId,_refMailbox:base._refMailbox,_refPid:pid,__mpsAdded:true});
      have[ref]=1;
    }
    try{localStorage.setItem(CK,JSON.stringify(cache));}catch(e){}
    try{M.boot();}catch(e){}
    var KK='mps_rfi_known_'+pid, known={}; try{known=JSON.parse(localStorage.getItem(KK)||'{}');}catch(e){}
    var brand=missing.filter(function(x){return !known[x];});
    if(brand.length){ missing.forEach(function(x){known[x]=1;}); try{localStorage.setItem(KK,JSON.stringify(known));}catch(e){} try{if(M.crosscheck)M.crosscheck();}catch(e){} }
  }
  if(!window.__mpsRfiPickupIv){
    window.__mpsRfiPickupIv=setInterval(function(){
      var M=window.__MPS_ACONEX_RFI;
      if(M&&M.__live&&M._state&&M._state.allRows&&M._state.allRows.length&&!M.__mpsPickupDone){
        M.__mpsPickupDone=true;
        Promise.resolve().then(function(){return pickup(M);}).catch(function(){});
      }
    },1500);
  }
})();