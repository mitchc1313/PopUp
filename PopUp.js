
// ===== Globals (kept the same names) =====
let MFLPlayerPopupCurrentPID;
let MFLPlayerPopupTracker = [];
let MFLPlayerPopupTeamNames = [];
let MFLPlayerPopupOnloadContent = [];
let MFLPlayerPopupStart = Date.now();

const MFLPlayerPopupValidNFLAbbrev = ["FA","ARI","ATL","BAL","BUF","CAR","CHI","CIN","CLE","DAL","DEN","DET","GBP","HOU","IND","JAC","KCC","LAC","LAR","MIA","MIN","NEP","NOS","NYG","NYJ","OAK","PHI","PIT","SEA","SFO","TBB","TEN","WAS","RAM","LVR","STL","SDC"];
const MFLPlayerPopupValidPosition = ["Coach","QB","TMQB","RB","TMRB","FB","WR","TMWR","TE","TMTE","KR","PK","TMPK","PN","TMPN","DE","DT","TMDL","LB","TMLB","CB","S","TMDB","Off","Def","ST"];
const MFLPlayerPopupExtraTitles = {
  salary: "Salary",
  contractyear: "Contract Year",
  contractstatus: "Contract Status",
  contractinfo: "Contract Information",
  drafted: "Drafted",
};

// ===== Feature flags (respect existing globals if present) =====
window.MFLPopupEnablePlayerNews ??= true;
window.MFLPopupEnableArticle ??= true;
window.MFLPopupOmitLinks ??= false;
window.MFLPopupOmitStatus ??= false;
window.MFLPopupEnableAutoNotification ??= false;
window.MFLPopupEnableTrade ??= true;
window.MFLPopupEnableTradePoll ??= true;
window.MFLPopupEnableReminders ??= true;
window.MFLPopupEnableMessages ??= true;
window.MFLPopupEnableCommishMessage ??= false;
window.MFLPopupCommishMessage ??= "";
window.MFLPlayerPopupIncludeNFLLogo ??= true;
window.ShowMFLsearch ??= false;
window.MFLFranchisePopup ??= false;
window.MFLScoreDetailsPopup ??= false;
window.includeBiologo ??= false;
if (MFLFranchisePopup) MFLScoreDetailsPopup = true;
window.includeBiologoAsset ??= false;
window.ShowMFLlogin ??= false;
window.LoginSearchMobileCSS ??= false;

// Icons / images
window.MFLPopupWelcomeFontAwesome ??= '<i class="fa-sharp fa-regular fa-lock-keyhole MFLPopupFontAwesome MFLPopupFontAwesomeMenu MFLPopupWelcome" aria-hidden="true"></i>';
window.MFLPopupSearchFontAwesome ??= '<i class="fa-regular fa-magnifying-glass MFLPopupFontAwesome MFLPopupFontAwesomeMenu MFLPopupSearch" aria-hidden="true"></i>';
window.MFLPopupNotifyFontAwesome ??= '<i class="fa-regular fa-circle-exclamation MFLPopupFontAwesome MFLPopupFontAwesomeMenu MFLPopupNotify" aria-hidden="true"></i>';
window.MFLPopupNewNewsFontAwesome ??= '<i class="fa-regular fa-file-lines MFLPopupFontAwesome MFLPopupFontAwesomeNews MFLPopupNewNews" aria-hidden="true"></i>';
window.MFLPopupOldNewsFontAwesome ??= '<i class="fa-regular fa-file-lines MFLPopupFontAwesome MFLPopupFontAwesomeNews MFLPopupOldNews" aria-hidden="true"></i>';
window.MFLPopupNoNewsFontAwesome ??= '<i class="fa-regular fa-file MFLPopupFontAwesome MFLPopupFontAwesomeNews MFLPopupNoNews" aria-hidden="true"></i>';
window.MFLPopupArticleFontAwesome ??= '<i class="fa-regular fa-newspaper MFLPopupFontAwesome MFLPopupFontAwesomeArticle MFLPopupArticle" aria-hidden="true"></i>';
window.MFLPlayerPopupNewsNone ??= "https://www.mflscripts.com/ImageDirectory/script-images/newsNone.svg";
window.MFLPlayerPopupNewsOld ??= "https://www.mflscripts.com/ImageDirectory/script-images/newsOld.svg";
window.MFLPlayerPopupNewsNew ??= "https://www.mflscripts.com/ImageDirectory/script-images/newsNew.svg";
window.MFLPlayerPopupIncludeProjections ??= true;

// ===== Small helpers =====
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

function appendHTML(parent, html) {
  const tpl = document.createElement('template');
  tpl.innerHTML = html.trim();
  parent.appendChild(tpl.content);
}

function addStyle(css) {
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
}

function on(parent, event, selector, handler) {
  parent.addEventListener(event, e => {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) handler(e, target);
  });
}

// ===== Menu icons injection (initial jQuery line) =====
(function injectMenuIcons(){
  const firstLi = document.querySelector('.myfantasyleague_menu ul li:nth-child(1)');
  if (!firstLi || !firstLi.parentElement) return;
  const p = firstLi.parentElement;
  const html = `
    <div id="icon-wrapper" style="float:left;display:none">
      <li onclick="toggleLogin()" class="notification-icon-login" style="display:none">${MFLPopupWelcomeFontAwesome}</li>
      <div class="toggle_module_login" style="display:none;">
        <table class="toggle_login_content report" style="white-space:initial">
          <tbody>
            <tr><th>Welcome</th></tr>
            <tr class="oddtablerow"></tr>
          </tbody>
        </table>
      </div>
      <li onclick="toggleSearch()" class="notification-icon-search" title="Player Search" style="display:none">${MFLPopupSearchFontAwesome}</li>
      <div class="toggle_module_search" style="display:none">
        <table class="toggle_search_content report" style="white-space:initial">
          <tbody>
            <tr><th>Find A Player</th></tr>
            <tr class="oddtablerow">
              <td>
                <form method="get" action="${baseURLDynamic}/${year}/player_search">
                  <input name="L" value="${league_id}" type="hidden">
                  <input name="NAME" size="15" type="text">
                  <input value="Search" type="submit">
                </form>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <li class="notification-icon-popup" title="Notifications" style="display:none">
        <span onclick="MFLPlayerPopupPopulateOnload(true)">${MFLPopupNotifyFontAwesome}</span>
      </li>
      <li style="display:none" onclick="location.href='${baseURLDynamic}/${year}/mb/message_list.pl?bid=${year}${league_id}'" class="notification-icon-new-mb-private-message addon-icons" title="New Private Message!"><i class="fa-regular fa-inbox fa-beat MFLPopupFontAwesomeMenu"></i></li>
      <li style="display:none" onclick="location.href='${baseURLDynamic}/${year}/options?L=${league_id}&O=28'" class="notification-icon-new-mb-message addon-icons" title="New Message Board Post!"><i class="fa-regular fa-comments fa-beat MFLPopupFontAwesomeMenu"></i></li>
      <li style="display:none" onclick="location.href='${baseURLDynamic}/${year}/options?L=${league_id}&O=69'" class="notification-icon-new-poll addon-icons" title="Vote Required!"><i class="fa-regular fa-check-to-slot fa-beat MFLPopupFontAwesomeMenu"></i></li>
      <li style="display:none" onclick="location.href='${baseURLDynamic}/${year}/csetup?L=${league_id}&C=REVTRAD'" class="notification-pending-trade addon-icons" title="Pending Trade to Approve!"><i class="fa-regular fa-triangle-exclamation fa-beat MFLPopupFontAwesomeMenu"></i></li>
      <li style="display:none" onclick="alert('You have ${leagueAttributes?.PendingTradesAwaitingCommishApproval ?? 0} trade(s) awaiting Commissioner Approval!')" class="notification-awaiting-approval addon-icons" title="Trade(s) Awaiting Commissioner Approval!"><i class="fa-regular fa-hourglass-half fa-beat MFLPopupFontAwesomeMenu"></i></li>
      <li style="display:none" onclick="location.href='${baseURLDynamic}/${year}/options?L=${league_id}&O=05'" class="notification-outstandings-offers-received addon-icons" title="You have been offered a trade!"><i class="fa-regular fa-handshake fa-beat MFLPopupFontAwesomeMenu"></i></li>
    </div>
  `;
  appendHTML(p, html);
})();

// ===== DOM Ready work (image swap + styles) =====
document.addEventListener('DOMContentLoaded', () => {
  // Player page headshot swaps
  if (document.getElementById('body_player')) {
    const pid = new URL(window.location.href).searchParams.get('P');
    const pref = `https://www.mflscripts.com/playerImages_80x107/mfl_${pid}.png`;

    document.body.classList.add('espn_body_player');
    addStyle(`
      .espn_body_player td.player_photo img{box-sizing:unset;background:#fff}
      .espn_body_player td.player_photo{text-align:center}
    `);

    $$('#body_player td.player_photo img').forEach(img => {
      const try1 = pref;
      const try2 = `//www.myfantasyleague.com/player_photos_2014/${pid}_thumb.jpg`;
      const try3 = `https://www.mflscripts.com/playerImages_80x107/free_agent.png`;
      const fallback = `https://www63.myfantasyleague.com/player_photos_2010/no_photo_available.jpg`;

      img.onerror = () => {
        img.onerror = () => {
          img.onerror = () => {
            img.src = fallback;
            document.body.classList.remove('espn_body_player');
          };
          img.src = try3;
          document.body.classList.add('espn_body_player');
        };
        img.src = try2;
        document.body.classList.remove('espn_body_player');
      };
      img.src = try1;
    });
  }

  // Article thumbs -> MFL scripts images
  addStyle(`
    .espnImg .articlepicture[src*="playerImages"]{box-sizing:unset;background:#fff;width:auto!important}
    .espnImg td{display:table;margin:0 auto!important}
  `);

  $$('#body_options_185,#options_177,#options_207,#fantasy_articles,#fantasy_recap,#fantasy_preview')
    .forEach(root => {
      $$('img.articlepicture[src*="_thumb"]', root).forEach(img => {
        const m = img.getAttribute('src').match(/\/(\d+).*\.jpg$/) || [];
        const id = m[1];
        if (!id) return;
        const target = `https://www.mflscripts.com/playerImages_80x107/mfl_${id}.png`;
        img.closest('.articlepicturetable')?.classList.add('espnImg');

        const try1 = target;
        const try2 = `//www.myfantasyleague.com/player_photos_2014/${id}_thumb.jpg`;
        const try3 = `https://www.mflscripts.com/playerImages_80x107/free_agent.png`;
        const fallback = `https://www63.myfantasyleague.com/player_photos_2010/no_photo_available.jpg`;

        img.onerror = () => {
          img.onerror = () => {
            img.onerror = () => {
              img.src = fallback;
              img.closest('.articlepicturetable')?.classList.remove('espnImg');
            };
            img.src = try3;
            img.closest('.articlepicturetable')?.classList.add('espnImg');
          };
          img.src = try2;
          img.closest('.articlepicturetable')?.classList.remove('espnImg');
        };
        img.src = try1;
      });
    });
});

// ===== Static styles that were appended with jQuery =====
addStyle(`
#MFLPlayerPopupHeader > table > tbody > tr:nth-child(4) br,
#MFLPlayerPopupBio > table > tbody > tr:nth-child(4) br{display:none}
#MFLPlayerPopupHeader > table > tbody > tr:nth-child(4) td:nth-child(1),
#MFLPlayerPopupBio > table > tbody > tr:nth-child(4) td:nth-child(1){
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:6.25rem
}
.playerPopupIcon[src*=".svg"],
.playerPopupIcon[src*=".svg"][src*="newsNew"]{
  height:0.875rem!important;padding-left:0!important;margin-top:-0.188rem!important;vertical-align:middle!important
}
#MFLPlayerPopupOverlay[style*="display: block"] + #MFLPlayerPopupContainer{display:block!important}
.MFLPlayerPopupNFLTeamLogo{right:0.375rem;left:auto;top:0.188rem;max-width:1.375rem;max-height:1.375rem}
#MFLPlayerPopupHeader .popreport td,#MFLPlayerPopupBio .popreport td.pop-photo{padding-right:0.313rem}
.MFLPopupFontAwesomeMenu{font-size:1.5rem;float:right;padding-left:0.5rem;padding-top:0.375rem}
.MFLPopupNotify2{float:initial;font-size:1.25rem}
.MFLPopupFontAwesomeCaption{font-size:1.125rem}
.MFLPlayerPopupHeaderCaption .MFLPopupFontAwesomeMenu{float:none;padding:0;font-size:100%}
#body_options_08 td.points.tot img,#body_top table td.points.tot img{display:none}
@media only screen and (max-width: 26.25em){.pt-hide{display:none}}
`);
if (MFLPlayerPopupIncludeProjections) {
  addStyle(`#MFLPlayerPopupProjections{position:relative;height:17.5rem;overflow:auto;-webkit-overflow-scrolling:touch}`);
}

// ===== CameraTag guard (kept) =====
try { CameraTag.jQueryPreInstalled = true; } catch(e){}

// ===== Cookies =====
function setCookie(name, value, days){
  const d = new Date();
  d.setTime(d.getTime() + (days*24*60*60*1000));
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
}
function getCookie(name){
  const key = name + '=';
  return document.cookie.split(';').map(s=>s.trim()).find(s=>s.startsWith(key))?.slice(key.length) ?? '';
}

// ===== Popup Container (vanilla) =====
function MFLPlayerPopupCreateContainer(){
  appendHTML(document.body, `
    <div id="isMediaContainer" style="display:none"><div class="isMedia"></div></div>
    <div id="MFLPlayerPopupOverlay"></div>
    <div id="MFLPlayerPopupContainer" style="left:0!important;right:0!important;top:0!important;bottom:0!important;margin:auto">
      <caption class="MFLPlayerPopupHeaderCaption"><span id="MFLPlayerPopupName"></span></caption>
      <span id="MFLPlayerPopupClose">X</span>
      <div id="MFLPlayerPopupLoading"><center>Loading Content . . .<br><br><div class="MFLPlayerPopupLoader"></div></center></div>
      <div id="MFLPlayerPopupArticleLoaded"></div>
      <div id="MFLPlayerPopupLoaded">
        <div id="MFLPlayerPopupHeader"></div>
        <div class="MFLPopTabWrap">
          <ul class="MFLPlayerPopupTab"></ul>
        </div>
        <div id="MFLPlayerPopupLinks"></div>
        <div id="MFLPlayerPopupNews" class="MFLPlayerPopupTabContent"></div>
        <div id="MFLPlayerPopupBio" class="MFLPlayerPopupTabContent">Bio Table</div>
        <div id="MFLPlayerPopupStatsHistory" class="MFLPlayerPopupTabContent">Stats History Table</div>
        <div id="MFLPlayerPopupStats" class="MFLPlayerPopupTabContent">Stats Table</div>
        ${MFLPlayerPopupIncludeProjections ? `
          <div id="MFLPlayerPopupProjections" class="MFLPlayerPopupTabContent">
            <div id="MFLPlayerPopupLoading"><center>Loading Content . . .<br><br><div class="MFLPlayerPopupLoader"></div></center></div>
          </div>` : ``}
        <div id="MFLPlayerPopupTrades" class="MFLPlayerPopupTabContent">No Data</div>
        <div id="MFLPlayerPopupCommishMessage" class="MFLPlayerPopupTabContent">No Data</div>
        <div id="MFLPlayerPopupReminders" class="MFLPlayerPopupTabContent">No Data</div>
        <div id="MFLPlayerPopupMessages" class="MFLPlayerPopupTabContent">No Data</div>
      </div>
    </div>
  `);

  // build tabs (outside #TeamDetails)
  const tabs = document.querySelectorAll('.MFLPlayerPopupTab:not(#TeamDetails .MFLPlayerPopupTab)');
  tabs.forEach(ul => {
    appendHTML(ul, `
      <li class="MFLPlayerPopupPlayerTabs"><a href="javascript:void(0)" class="MFLPlayerPopupTabLinks" id="MFLPlayerPopupTabLinksNews" data-target="MFLPlayerPopupNews"><span class="pt-hide">Player</span> News</a></li>
      <li class="MFLPlayerPopupPlayerTabs" id="MFLPlayerPopupBioTab"><a href="javascript:void(0)" class="MFLPlayerPopupTabLinks" data-target="MFLPlayerPopupBio">Bio</a></li>
      <li class="MFLPlayerPopupPlayerTabs"><a href="javascript:void(0)" class="MFLPlayerPopupTabLinks" data-target="MFLPlayerPopupStats"><span class="pt-hide">${year}</span> Stats</a></li>
      ${MFLPlayerPopupIncludeProjections ? `<li class="MFLPlayerPopupPlayerTabs"><a href="javascript:void(0)" class="MFLPlayerPopupTabLinks" data-target="MFLPlayerPopupProjections">Proj.</a></li>`:''}
      <li class="MFLPlayerPopupPlayerTabs"><a href="javascript:void(0)" class="MFLPlayerPopupTabLinks" data-target="MFLPlayerPopupStatsHistory">Career <span class="pt-hide">Stats</span></a></li>
      ${ (MFLPopupEnableTrade || MFLPopupEnableTradePoll) ? `<li class="MFLPlayerPopupNotificationTabs"><a href="javascript:void(0)" class="MFLPlayerPopupTabLinks" id="MFLPlayerPopupTabLinksTrades" data-target="MFLPlayerPopupTrades">Trades</a></li>` : '' }
      ${ (MFLPopupEnableCommishMessage && MFLPopupCommishMessage !== "") ? `<li class="MFLPlayerPopupNotificationTabs"><a href="javascript:void(0)" class="MFLPlayerPopupTabLinks" id="MFLPlayerPopupTabLinksCommishMessage" data-target="MFLPlayerPopupCommishMessage">Commish Msg</a></li>` : '' }
      ${ MFLPopupEnableReminders ? `<li class="MFLPlayerPopupNotificationTabs"><a href="javascript:void(0)" class="MFLPlayerPopupTabLinks" id="MFLPlayerPopupTabLinksReminders" data-target="MFLPlayerPopupReminders">Reminders</a></li>` : '' }
      ${ MFLPopupEnableMessages ? `<li class="MFLPlayerPopupNotificationTabs"><a href="javascript:void(0)" class="MFLPlayerPopupTabLinks" id="MFLPlayerPopupTabLinksMessages" data-target="MFLPlayerPopupMessages">Messages</a></li>` : '' }
    `);
  });

  // close overlay
  $('#MFLPlayerPopupOverlay')?.addEventListener('click', () => MFLPlayerPopupClose());

  // tab switching (vanilla)
  on(document, 'click', '.MFLPlayerPopupTabLinks', (e, el) => {
    e.preventDefault();
    const targetId = el.dataset.target;
    if (!targetId) return;
    $$('.MFLPlayerPopupTabContent').forEach(div => (div.style.display = 'none'));
    $$('.MFLPlayerPopupTabLinks').forEach(a => a.classList.remove('active'));
    el.classList.add('active');
    const target = document.getElementById(targetId);
    if (target) {
      target.style.display = 'block';
      target.classList.add('active_div_tab_scroll');
      try { bodyScrollLock?.disableBodyScroll(target); } catch(_) {}
      if (targetId === 'MFLPlayerPopupProjections') {
        setTimeout(() => { try { MFLPlayerPopupPopulateProjections?.(); } catch(_){} }, 5);
      }
    }
  });
}

function MFLPlayerPopupClose(){
  $('#MFLPlayerPopupOverlay')?.setAttribute('style','display:none');
  $('#MFLPlayerPopupContainer')?.setAttribute('style','display:none');
  $$('.MFLPlayerPopupTabContent').forEach(d => d.style.display = 'none');
  $('#MFLPlayerPopupContainer')?.classList.remove('MFLPlayerPopupArticleContainer','MFLPlayerPopupNotificationContainer');
  try { bodyScrollLock?.clearAllBodyScrollLocks(); } catch(e){}
  $$('.MFLPlayerPopupTabContent').forEach(d => d.classList.remove('active_div_tab_scroll'));
  $$('.MFLPlayerPopupPlayerTabs a,.MFLPlayerPopupNotificationTabs a')
    .filter(a => !a.closest('#TeamDetails .MFLPlayerPopupPlayerTabs'))
    .forEach(a => a.classList.remove('active'));
}

// (kept but simplified) index check
function includes(arr, item){ return Array.isArray(arr) ? arr.includes(item) : false; }

// Build Team name dictionary
function MFLPlayerPopupSetupTeamNames(){
  for (const k in franchiseDatabase){
    if (k !== 'fid_0000' && Object.prototype.hasOwnProperty.call(franchiseDatabase, k)){
      const f = franchiseDatabase[k];
      MFLPlayerPopupTeamNames[f.name] = { id: f.id, abbrev: f.abbrev };
    }
  }
}

// Expand “…More” news
async function MFLPlayerPopupMoreNews(path, targetId){
  try{
    const res = await fetch(`${baseURLDynamic}/${year}/${path}`);
    const html = await res.text();
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const rows = temp.querySelectorAll('.report tr');
    let i = 0, content = '';
    rows.forEach(tr => {
      if (i === 1){
        // remove links but keep text
        tr.querySelectorAll('td a').forEach(a => {
          const span = document.createElement('span');
          span.innerHTML = a.innerHTML;
          a.replaceWith(span);
        });
        let inner = tr.querySelector('td')?.innerHTML ?? '';
        const idx1 = inner.indexOf('Article Link');
        if (idx1 > 0) inner = inner.substring(0, idx1 - 2);
        const idx2 = inner.indexOf('Roto Pass from');
        if (idx2 > 0) inner = inner.substring(0, idx2 - 3);
        content = inner;
      }
      i++;
    });
    if (content) {
      const tgt = document.getElementById(targetId);
      if (tgt) tgt.innerHTML = content;
    }
  }catch(err){
    console.error('MoreNews error:', err);
  }
}

// expose needed fns to window (to match old inline onclick usage)
window.MFLPlayerPopupCreateContainer = MFLPlayerPopupCreateContainer;
window.MFLPlayerPopupClose = MFLPlayerPopupClose;
window.MFLPlayerPopupMoreNews = MFLPlayerPopupMoreNews;
window.MFLPlayerPopupSetupTeamNames = MFLPlayerPopupSetupTeamNames;


// --- tiny helpers (safe if you already defined them elsewhere) ---
function setHTML(el, html){ if (el) el.innerHTML = html; }
function show(el){ if (el) el.style.display = ''; }
function hide(el){ if (el) el.style.display = 'none'; }
function parseHTML(html){
  const t = document.createElement('template');
  t.innerHTML = html;
  return t.content;
}
function fetchText(url){ return fetch(url).then(r => { if(!r.ok) throw new Error(`${r.status} ${r.statusText}`); return r.text(); }); }
function fetchJSON(url){ return fetch(url).then(r => { if(!r.ok) throw new Error(`${r.status} ${r.statusText}`); return r.json(); }); }

// --- expose used globals if missing (kept names) ---
window.MFLPlayerPopupCurrentPID ??= null;
window.MFLPlayerPopupTracker ??= [];
window.MFLPlayerPopupOnloadContent ??= [];
window.MFLPlayerPopupTeamNames ??= [];
window.MFLPopupOmitLinks ??= false;
window.MFLPopupOmitStatus ??= false;
window.MFLPlayerPopupIncludeProjections ??= true;

// ===============================
//  Popup Setup (vanilla)
// ===============================
function MFLPlayerPopupSetup(pid, fallbackText){
  // scroll lock on news tab
  const newsEl = $("#MFLPlayerPopupNews");
  newsEl?.classList.add("active_div_tab_scroll");
  try { bodyScrollLock?.disableBodyScroll(newsEl); } catch(_) {}

  let pos = "", team = "", fullname = "", first = "", last = "", headerName = "";
  MFLPlayerPopupCurrentPID = pid;

  if (playerDatabase?.hasOwnProperty("pid_" + pid)) {
    pos = playerDatabase["pid_" + pid].position;
    team = playerDatabase["pid_" + pid].team;
    fullname = playerDatabase["pid_" + pid].name; // "Last, First"
    last = fullname.split(",")[0].trim();
    first = fullname.split(",")[1].trim();
    headerName = `${last}, ${first} ${team} ${pos}`;
  } else {
    // fallback from link text
    const parts = fallbackText.split(" ");
    pos  = parts[parts.length - 1];
    team = parts[parts.length - 2];
    first = parts[0].slice(0, -1); // remove trailing comma
    last  = parts.slice(1, parts.length - 2).join(" ");
    fullname = `${last} ${first}`;
    headerName = `${first}, ${last} ${team} ${pos}`;
  }

  // If pos/team look suspicious, try export players JSON to correct them
  if (!(MFLPlayerPopupValidPosition?.includes(pos) && MFLPlayerPopupValidNFLAbbrev?.includes(team))) {
    try {
      const url = `${baseURLDynamic}/${year}/export?TYPE=players&PLAYERS=${pid}&JSON=1`;
      fetchJSON(url).then(j => {
        try {
          fullname = j.players.player.name;
          team     = j.players.player.team;
          pos      = j.players.player.position;
          headerName = `${fullname} ${team} ${pos}`;
          setHTML($("#MFLPlayerPopupName"), headerName);
        } catch { console.log("FAILED PLAYER ID:", pid); }
      });
    } catch {}
  }

  // Mirror the old UI updates
  show($("#MFLPlayerPopupOverlay"));
  show($("#MFLPlayerPopupContainer #MFLPlayerPopupLoading"));
  $$(".MFLPlayerPopupPlayerTabs:not(#TeamDetails .MFLPlayerPopupPlayerTabs)").forEach(li => li.style.display = "table-cell");
  $("#MFLPlayerPopupBioTab")?.removeAttribute("style");
  $$(".MFLPlayerPopupNotificationTabs").forEach(li => li.style.display = "none");
  if (MFLPopupOmitLinks) hide($("#MFLPlayerPopupLinks")); else show($("#MFLPlayerPopupLinks"));
  hide($("#MFLPlayerPopupLoaded"));
  hide($("#MFLPlayerPopupArticleLoaded"));
  setHTML($("#MFLPlayerPopupName"), headerName);
  show($("#MFLPlayerPopupContainer"));

  // kick off content population a tick later
  setTimeout(() => MFLPlayerPopupPopulate(pid, fullname, team, pos), 200);

  // hide other overlays/cleanup
  hide($(".teamdetailsWrap"));  hide($("#TeamDetails"));
  setHTML($("#leftTeam"), ""); setHTML($("#rightTeam"), ""); setHTML($("#ScoreDetails tbody"), "");
  $$("#teamToggles input").forEach(i => i.value = "");
  $("#fullSeasonPts")?.remove();
  hide($(".scoredetailsWrap")); hide($("#ScoreDetails")); hide($("#ScoreNFLDetails"));
  $("#ScoreNFLDetails table")?.classList.remove("box_details_table");
  const sd = $("#ScoreDetails table");
  sd?.classList.remove("scoring_details_table"); sd?.classList.remove("overview_details_table");
  $$("a").forEach(a => a.classList?.remove?.("dblClicks"));
}

// ===============================
//  Article popup
// ===============================
function MFLPlayerPopupArticleSetup(html, ageText, source){
  $("#MFLPlayerPopupContainer")?.classList.add("MFLPlayerPopupArticleContainer");
  show($("#MFLPlayerPopupOverlay"));
  show($("#MFLPlayerPopupContainer #MFLPlayerPopupLoading"));
  hide($("#MFLPlayerPopupLoaded"));
  hide($("#MFLPlayerPopupArticleLoaded"));
  setHTML($("#MFLPlayerPopupName"), `Article Posted ${ageText} Ago`);
  show($("#MFLPlayerPopupContainer"));
  setTimeout(() => MFLPlayerPopupArticlePopulate?.(html, ageText, source), 200);
  hide($(".teamdetailsWrap")); hide($("#TeamDetails"));

  const art = $("#MFLPlayerPopupArticleLoaded");
  try { bodyScrollLock?.disableBodyScroll(art); } catch(_) {}
}

// ===============================
//  Notification pre-setup
// ===============================
function MFLPlayerPopupNotificationPreSetup(){
  $("#MFLPlayerPopupContainer")?.classList.add("MFLPlayerPopupNotificationContainer");
  show($("#MFLPlayerPopupOverlay"));
  show($("#MFLPlayerPopupContainer #MFLPlayerPopupLoading"));

  $$(".MFLPlayerPopupPlayerTabs:not(#TeamDetails .MFLPlayerPopupPlayerTabs)").forEach(li => li.style.display = "none");
  $("#MFLPlayerPopupBioTab")?.setAttribute("style","display:none!important");
  $$(".MFLPlayerPopupNotificationTabs").forEach(li => li.style.display = "table-cell");
  hide($("#MFLPlayerPopupLinks"));
  hide($("#MFLPlayerPopupLoaded"));
  hide($("#MFLPlayerPopupArticleLoaded"));

  // choose default visible tab based on available content (mirrors original logic)
  const hasTrades = !!(MFLPlayerPopupOnloadContent[0] || MFLPlayerPopupOnloadContent[1]);
  const tabOrder = [
    { ok: hasTrades, id: "MFLPlayerPopupTrades", link: "#MFLPlayerPopupTabLinksTrades" },
    { ok: MFLPopupEnableCommishMessage && MFLPlayerPopupOnloadContent[4] !== "", id: "MFLPlayerPopupCommishMessage", link: "#MFLPlayerPopupTabLinksCommishMessage" },
    { ok: MFLPopupEnableReminders && MFLPlayerPopupOnloadContent[2] !== "", id: "MFLPlayerPopupReminders", link: "#MFLPlayerPopupTabLinksReminders" },
    { ok: MFLPopupEnableMessages && MFLPlayerPopupOnloadContent[3] !== "", id: "MFLPlayerPopupMessages", link: "#MFLPlayerPopupTabLinksMessages" }
  ];
  let chosen = tabOrder.find(t => t.ok);
  if (!chosen){
    // fallback: prefer Trades -> Commish -> Reminders -> Messages by feature flags
    chosen = [
      {flag: MFLPopupEnableTrade, id:"MFLPlayerPopupTrades", link:"#MFLPlayerPopupTabLinksTrades"},
      {flag: MFLPopupEnableCommishMessage, id:"MFLPlayerPopupCommishMessage", link:"#MFLPlayerPopupTabLinksCommishMessage"},
      {flag: MFLPopupEnableReminders, id:"MFLPlayerPopupReminders", link:"#MFLPlayerPopupTabLinksReminders"},
      {flag: MFLPopupEnableMessages, id:"MFLPlayerPopupMessages", link:"#MFLPlayerPopupTabLinksMessages"},
    ].find(x => x.flag);
  }
  if (chosen){
    const pane = $("#" + chosen.id);
    pane?.classList.add("active_div_tab_scroll");
    show(pane);
    $(chosen.link)?.classList.add("active");
  } else {
    // nothing—show "no notifications"
    const hdr = "<table class='popreport'><tbody><tr><th>You Have No Notifications!</th></tr><tr class='oddtablerow'><td>There are currently no active notifications.</td></tr></tbody></table>";
    $("#MFLPlayerPopupHeader")?.parentElement?.classList.add("noHide");
    setHTML($("#MFLPlayerPopupHeader"), hdr);
    $("#MFLPlayerPopupMessages")?.classList.add("active_div_tab_scroll");
    show($("#MFLPlayerPopupMessages"));
  }

  const act = $(".active_div_tab_scroll");
  try { bodyScrollLock?.disableBodyScroll(act); } catch(_) {}

  setHTML($("#MFLPlayerPopupName"),
    `League Notifications <span class='MFLPopupLeagueNotification' style='padding:0;background:none' title='Notifications'>${MFLPopupNotifyFontAwesome}</span>`
  );
  show($("#MFLPlayerPopupContainer"));
}

// ===============================
//  Notification setup (after content loaded)
// ===============================
function MFLPlayerPopupNotificationSetup(fromAuto){
  // wait until 5 trackers set to "1"
  const ready = [0,1,2,3,4].every(i => MFLPlayerPopupTracker[i] === 1);
  const hasAny = MFLPlayerPopupOnloadContent.some(x => x && x !== "");

  if (!ready) return;
  if (!fromAuto || hasAny){
    if (!fromAuto) MFLPlayerPopupNotificationPreSetup();
    const none = MFLPlayerPopupOnloadContent.every(x => x === "");
    if (none){
      const hdr = "<table class='popreport'><tbody><tr><th>You Have No Notifications!</th></tr><tr class='oddtablerow'><td>There are currently no active notifications.</td></tr></tbody></table>";
      $("#MFLPlayerPopupHeader")?.parentElement?.classList.add("noHide");
      setHTML($("#MFLPlayerPopupHeader"), hdr);
    } else {
      const autoText = MFLPopupEnableAutoNotification
        ? "<table class='popreport'><tbody><tr><th>You Have Notifications!</th></tr><tr class='oddtablerow'><td>There are one or more active notifications that have been set to automatically display once per browser session.<br><br>After closing this popup you can re-open notifications by either closing and re-opening the browser or clicking on the notification icon in the menu.</td></tr></tbody></table>"
        : "<table class='popreport'><tbody><tr><th>You Have Notifications!</th></tr><tr class='oddtablerow'><td>There are one or more active notifications. Check the tabs below to view them.</td></tr></tbody></table>";
      setHTML($("#MFLPlayerPopupHeader"), autoText);
    }

    // fill tabs
    const trades = (MFLPlayerPopupOnloadContent[0] || "") + (MFLPlayerPopupOnloadContent[1] || "");
    setHTML($("#MFLPlayerPopupTrades"),
      trades
        ? trades.replace(/report/g, "popreport").replace("<caption><span>Pending Trades</span></caption>", "").replace("<caption><span></span></caption>","")
        : "<br /><center><i>No Current Trade Notifications</i></center>"
    );

    setHTML($("#MFLPlayerPopupReminders"),
      MFLPlayerPopupOnloadContent[2]
        ? MFLPlayerPopupOnloadContent[2].replace(/report/g, "popreport")
        : `<br /><center><i>No Active League Reminders<br/><br/>OR<br/><br/>League Reminders are Disabled in <a href='${baseURLDynamic}/${year}/csetup?L=${league_id}&C=FCUSTOM&F=${franchise_id}'>Franchise Customization</a> Settings</i></center>`
    );

    setHTML($("#MFLPlayerPopupMessages"),
      MFLPlayerPopupOnloadContent[3]
        ? MFLPlayerPopupOnloadContent[3].replace(/report/g, "popreport")
        : "<br /><center><i>No Active Messages from MyFantasyLeague</i></center>"
    );

    setHTML($("#MFLPlayerPopupCommishMessage"),
      MFLPlayerPopupOnloadContent[4]
        ? MFLPlayerPopupOnloadContent[4].replace(/report/g, "popreport")
        : "<br /><center><i>No Active Messages from Commissioner</i></center>"
    );

    setTimeout(() => MFLPlayerPopupInitiate?.(2), 1000);
  }
}

// ===============================
//  Projections tab (lazy load)
// ===============================
function MFLPlayerPopupPopulateProjections(){
  show($("#MFLPlayerPopupProjections #MFLPlayerPopupLoading"));
  setTimeout(() => {
    // if content still the loader, fetch
    if (($("#MFLPlayerPopupProjections")?.textContent || "").includes("Loading Content")) {
      const url = `${baseURLDynamic}/${year}/player?L=${league_id}&P=${MFLPlayerPopupCurrentPID}&YEAR=${year}&DISPLAY_TYPE=projections`;
      fetchText(url).then(html => {
        const doc = parseHTML(html);
        const rows = $$("#player_stats_table tr", doc);
        let i = 0, out = "<table class='popreport'><tbody>";
        rows.forEach(tr => {
          if ($('form', tr)) return; // skip rows with forms
          if (tr.querySelectorAll('th').length > 0) {
            // header: remove last col to go from 4 to 3 if present
            const ths = tr.querySelectorAll('th');
            if (parseInt(ths[0]?.getAttribute('colspan') || '0') === 4) {
              ths[0].setAttribute('colspan', '3');
            } else {
              ths[3]?.remove();
            }
            out += `<tr>${tr.innerHTML}</tr>`;
          } else if (tr.querySelectorAll('td').length > 1) {
            tr.querySelectorAll('td:nth-child(4)')?.forEach(td => td.remove());
            out += (i++ % 2 ? "<tr class='eventablerow'>" : "<tr class='oddtablerow'>") + tr.innerHTML + "</tr>";
          }
        });
        out += "</tbody></table>";
        setHTML($("#MFLPlayerPopupProjections"), out);
      }).catch(err => console.error("Error:", err));
    }
  }, 1000);
}

// ===============================
//  Populate all tabs for a player
// ===============================
function MFLPlayerPopupPopulate(pid, name, team, pos){
  MFLPlayerPopupTracker = [];
  show($("#MFLPlayerPopupContainer #MFLPlayerPopupLoading"));
  hide($("#MFLPlayerPopupLoaded"));
  hide($("#MFLPlayerPopupArticleLoaded"));

  // 1) playerStatus
  const statusURL = `${baseURLDynamic}/${year}/export?TYPE=playerStatus&L=${league_id}&P=${pid}&JSON=1`;
  fetchJSON(statusURL)
    .then(json => {
      let status = "";
      try { status = MFLPopupCustomRule?.("pStatus", null, null, pid, name, team, pos, json, null, null) ?? ""; }
      catch { try { status = json.playerStatus.status; } catch{} }
      // 2) player page
      const profURL = `${baseURLDynamic}/${year}/player?L=${league_id}&P=${pid}`;
      return fetchText(profURL).then(html => ({html, status}));
    })
    .then(({html, status}) => {
      const doc = parseHTML(html);

      // build header (photo + bio)
      const photoCell = $('.player_photo img', doc);
      let photoHTML;
      if (photoCell){
        // force src chain fallback like original
        photoCell.setAttribute('src', `https://www.mflscripts.com/playerImages_80x107/mfl_${pid}.png`);
        photoHTML = photoCell.parentElement?.innerHTML ?? "";
      }
      let hasPhoto = true;
      if (!photoHTML){
        photoHTML = `<img src='https://www.mflscripts.com/ImageDirectory/script-images/nflTeamsvg_2/${team}.svg' alt='${team}' title='${team}' align='middle' />`;
        hasPhoto = false;
      } else {
        const repl = photoHTML.substring(photoHTML.indexOf("this.src=")+10, photoHTML.indexOf("no_photo_available.jpg")+22);
        photoHTML = photoHTML.replace(repl, "https://www.mflscripts.com/playerImages_80x107/free_agent.png");
      }
      photoHTML = photoHTML.replace("<img ", "<img class='articlepicture' ");

      // quick links row (hidden if MFLPopupOmitLinks)
      if (!MFLPopupOmitLinks){
        let links = "<table class='popreport'><tbody><tr class='oddtablerow'>";
        links += `<td style='text-align:center; text-indent:0;'><a href='${baseURLDynamic}/${year}/player?L=${league_id}&P=${pid}'>Full Profile</a></td>`;

        // Fantasy Sharks link (if present)
        let fs = "";
        $$("#h3 a, h3 a", doc).forEach(a => {
          if (a.textContent.trim() === "FantasySharks Profile") {
            fs = `<a href='${a.getAttribute('href')}' title='Fantasy Sharks Profile' target='_blank'>Fantasy Sharks</a>`;
          }
        });
        if (fs) links += `<td class='screen-hide' style='text-align:center; text-indent:0;'>${fs}</td>`;

        if (typeof franchise_id !== "undefined" && franchise_id !== "0000") {
          let addDrop = `<a href='${baseURLDynamic}/${year}/add_drop?L=${league_id}&P=${pid}'>Add Player</a>`;
          try {
            const fid = playerDatabase["pid_" + pid]?.fid;
            if (fid !== undefined) {
              addDrop =
                fid.indexOf(franchise_id) === -1
                  ? `<a href='${baseURLDynamic}/${year}/options?L=${league_id}&O=05&FRANCHISE=${franchise_id},${fid.substring(0,4)}&P=${pid}'>Propose Trade</a>`
                  : `<a href='${baseURLDynamic}/${year}/add_drop?L=${league_id}'>Drop Player</a>`;
            }
          } catch {}
          links += `<td style='text-align:center; text-indent:0;'>${addDrop}</td>`;

          // watchlist add/remove
          let wl = `<a href='${baseURLDynamic}/${year}/options?L=${league_id}&O=178&PID=${pid}'>Watchlist</a>`;
          $$("#h3 a, h3 a", doc).some(a => {
            const txt = a.textContent || "";
            if (txt.includes("Remove")) { wl = `<a href='${baseURLDynamic}/${year}/options?L=${league_id}&O=178&PID=${pid}&ACTION=delete'>Watchlist Remove</a>`; return true; }
            if (txt.includes("Add"))    { wl = `<a href='${baseURLDynamic}/${year}/options?L=${league_id}&O=178&PID=${pid}&ACTION=add'>Watchlist Add</a>`; return true; }
            return false;
          });
          links += `<td style='text-align:center; text-indent:0;'>${wl}</td>`;
        }
        links += `<td style='text-align:center; text-indent:0;'><a href='${baseURLDynamic}/${year}/player_history?L=${league_id}&PLAYERS=${pid}'>Trans. History</a></td>`;
        links += "</tr></tbody></table>";
        setHTML($("#MFLPlayerPopupLinks"), links);
      }

      // parse bio table (biography.report)
      const bioRows = $$(".biography.report tr", doc);
      const bio = {
        ht:"--", wt:"--", dob:"--", age:"--", college:"---",
        draftYear:"n/a", draftTeam:"", round:"", pick:"",
        jersey:"--", experience:"", experienceInt: 0, acquired:"", photo: photoHTML
      };

      // extras array (salary/contract/etc.)
      const extras = [];
      bioRows.forEach(tr => {
        const th = $('th', tr)?.innerHTML?.trim() || "";
        const td = $('td', tr)?.innerHTML?.trim() || "";
        switch(th){
          case "Height/Weight:":
            bio.ht = td.slice(0, td.indexOf("/")-1);
            bio.wt = td.slice(td.indexOf("/")+2);
            break;
          case "DOB/Age:":
            bio.dob = td.slice(0, td.indexOf("/")-1);
            bio.age = td.slice(td.indexOf("/")+2);
            break;
          case "Jersey Num:":
            bio.jersey = parseInt(td) || "--";
            break;
          case "College:":
            bio.college = td || "---";
            break;
          case "Drafted:":
            if (td === "Undrafted"){
              bio.draftYear = "?"; bio.draftTeam = "FA"; bio.round = "n/a"; bio.pick = "n/a";
            } else {
              bio.draftYear = td.substring(0, td.indexOf("/") - 1);
              bio.draftTeam = td.substring(td.indexOf("/") + 2, td.indexOf("Round") - 3);
              bio.round = parseInt(td.substring(td.indexOf("Round") + 6)) || "";
              bio.pick  = parseInt(td.substring(td.indexOf("Pick")  + 5)) || "";
            }
            break;
          case "Experience:":
            if (isNaN(parseInt(td))) { bio.experience="(Exp.: Rookie)"; bio.experienceInt=1; }
            else { bio.experience=`(Exp.: ${parseInt(td)} years)`; bio.experienceInt=parseInt(td); }
            break;
          case "Acquired:":
            bio.acquired = td;
            break;
          case "Salary:":
            try { extras.push(MFLPopupCustomRule?.("salary", "Salary", td, pid, name, team, pos, statusData, status, bio) ?? {title:"Salary",info:td}); }
            catch { extras.push({title:"Salary",info:td}); }
            break;
          case "Contract Year:":
            try { extras.push(MFLPopupCustomRule?.("contract_year", "Contract Year", td, pid, name, team, pos, statusData, status, bio) ?? {title:"Contract Year",info:td}); }
            catch { extras.push({title:"Contract Year",info:td}); }
            break;
          case "Contract Status:":
            try { extras.push(MFLPopupCustomRule?.("contract_status", "Contract Status", td, pid, name, team, pos, statusData, status, bio) ?? {title:"Contract Status",info:td}); }
            catch { extras.push({title:"Contract Status",info:td}); }
            break;
          case "Contract Info:":
            try { extras.push(MFLPopupCustomRule?.("contract_info", "Contract Information", td, pid, name, team, pos, statusData, status, bio) ?? {title:"Contract Information",info:td}); }
            catch { extras.push({title:"Contract Information",info:td}); }
            break;
        }
      });

      let headerRows = extras.length > 0 ? 6 : 4;
      if (MFLPopupOmitStatus && extras.length === 1) headerRows = 4;

      const nflLogo = (team && MFLPlayerPopupIncludeNFLLogo)
        ? `<img src='https://www.mflscripts.com/ImageDirectory/script-images/nflTeamsvg_2/${team}.svg' class='MFLPlayerPopupNFLTeamLogo' />`
        : "";

      const jerseyBadge = (bio.jersey === "--") ? "" : `<span class='MFLPlayerPopupJersey'><span>${bio.jersey}</span></span>`;

      // Draft text
      let draftTxt;
      if (bio.draftTeam === "FA") {
        draftTxt = `${year - bio.experienceInt + 1} Undrafted ${bio.experience}`;
      } else if (bio.round === "") {
        draftTxt = `${bio.draftYear} ${bio.experience}`;
      } else {
        draftTxt = `${bio.draftYear} #${bio.round}.${bio.pick} ${bio.draftTeam} <span class='screen-hide'>${bio.experience}</span>`;
      }

      // Build header/bio table
      let hdr = "<table class='popreport'><tbody>";
      hdr += `<tr class='oddtablerow rows-${headerRows}'><td class='pop-photo' rowspan='${headerRows}'>${bio.photo}${nflLogo}${jerseyBadge}</td><td><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold'>Ht:</span> ${bio.ht}</td><td><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold'>Wt:</span> ${bio.wt}</td></tr>`;
      hdr += `<tr class='eventablerow rows-${headerRows}'><td><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold'>Born:</span> ${bio.dob} <span class='screen-hide'>(${bio.age})</span></td><td><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold'>College:</span> ${bio.college}</td></tr>`;
      hdr += `<tr class='oddtablerow rows-${headerRows}'><td colspan='2'><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold'>Draft:</span> ${draftTxt}</td></tr>`;

      let oddEvenA = "even", oddEvenB = "odd";
      if (!MFLPopupOmitStatus){
        hdr += `<tr class='eventablerow rows-${headerRows}'><td><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold'>Status:</span> ${status || ""}</td><td><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold'>Acquired:</span> ${bio.acquired}</td></tr>`;
        oddEvenA = "odd"; oddEvenB = "even";
      }

      if (extras.length === 1){
        hdr += `<tr class='${oddEvenA}tablerow rows-${headerRows}'><td colspan='2'><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold' id='extras-0-title'>${extras[0].title}:</span> ${extras[0].info}</td></tr>`;
        if (!MFLPopupOmitStatus) hdr += `<tr class='${oddEvenB}tablerow rows-${headerRows}'><td colspan='2'> </td></tr>`;
      } else if (extras.length === 2){
        hdr += `<tr class='${oddEvenA}tablerow rows-${headerRows}'><td colspan='2'><span class='MFLPlayerPopupHeaderTitle extras-0-title' style='font-weight:bold'>${extras[0].title}:</span> ${extras[0].info}</td></tr>`;
        hdr += `<tr class='${oddEvenB}tablerow rows-${headerRows}'><td colspan='2'><span class='MFLPlayerPopupHeaderTitle extras-1-title' style='font-weight:bold'>${extras[1].title}:</span> ${extras[1].info}</td></tr>`;
      } else if (extras.length === 3){
        hdr += `<tr class='${oddEvenA}tablerow rows-${headerRows}'><td><span class='MFLPlayerPopupHeaderTitle extras-0-title' style='font-weight:bold'>${extras[0].title}:</span> ${extras[0].info}</td><td><span class='MFLPlayerPopupHeaderTitle extras-1-title' style='font-weight:bold'>${extras[1].title}:</span> ${extras[1].info}</td></tr>`;
        hdr += `<tr class='${oddEvenB}tablerow rows-${headerRows}'><td colspan='2'><span class='MFLPlayerPopupHeaderTitle extras-2-title' style='font-weight:bold'>${extras[2].title}:</span> ${extras[2].info}</td></tr>`;
      } else if (extras.length === 4){
        hdr += `<tr class='${oddEvenA}tablerow rows-${headerRows}'><td><span class='MFLPlayerPopupHeaderTitle extras-0-title' style='font-weight:bold'>${extras[0].title}:</span> ${extras[0].info}</td><td><span class='MFLPlayerPopupHeaderTitle extras-1-title' style='font-weight:bold'>${extras[1].title}:</span> ${extras[1].info}</td></tr>`;
        hdr += `<tr class='${oddEvenB}tablerow rows-${headerRows}'><td><span class='MFLPlayerPopupHeaderTitle extras-2-title' style='font-weight:bold'>${extras[2].title}:</span> ${extras[2].info}</td><td><span class='MFLPlayerPopupHeaderTitle extras-3-title' style='font-weight:bold'>${extras[3].title}:</span> ${extras[3].info}</td></tr>`;
      }
      hdr += "</tbody></table>";

      setHTML($("#MFLPlayerPopupHeader"), hdr);
      setHTML($("#MFLPlayerPopupBio"), hdr);

      // stats history table
      let histOut = "<table class='popreport'><tbody>";
      let k = 0;
      $$(".biohistory.report tr", doc).forEach(tr => {
        if ($('form', tr)) return;
        if (tr.querySelectorAll('th').length > 0) histOut += `<tr>${tr.innerHTML}</tr>`;
        else if (tr.querySelectorAll('td').length > 0){
          // unwrap anchors
          tr.querySelectorAll('td a').forEach(a => {
            const span = document.createElement('span'); span.innerHTML = a.innerHTML; a.replaceWith(span);
          });
          histOut += (k++ % 2 ? "<tr class='eventablerow'>" : "<tr class='oddtablerow'>") + tr.innerHTML + "</tr>";
        }
      });
      histOut += "</tbody></table>";
      setHTML($("#MFLPlayerPopupStatsHistory"), histOut);

      // season stats
      let statsOut = "<table class='popreport'><tbody>";
      let idx = 0, reduced = false;
      const statRows = $$("#player_stats_table tr", doc);
      statRows.forEach(tr => {
        if ($('form', tr)) return;
        if (tr.querySelectorAll('th').length > 0){
          const ths = tr.querySelectorAll('th');
          if (parseInt(ths[0]?.getAttribute('colspan')||'0') === 6){ ths[0].setAttribute('colspan','4'); reduced = true; }
          else if (reduced){ ths[3]?.remove(); ths[3]?.remove(); }
          statsOut += `<tr>${tr.innerHTML}</tr>`;
        } else if (tr.querySelectorAll('td').length > 1){
          tr.querySelectorAll('td a').forEach(a => { const s = document.createElement('span'); s.innerHTML = a.innerHTML; a.replaceWith(s); });
          // team name to abbrev if known
          const teamCell = tr.querySelector('td:nth-child(6)');
          if (teamCell){
            const txt = teamCell.innerHTML;
            const teamName = txt.substring(0, txt.indexOf(" - "));
            if (teamName && MFLPlayerPopupTeamNames?.hasOwnProperty(teamName) && MFLPlayerPopupTeamNames[teamName].abbrev){
              teamCell.innerHTML = txt.replace(teamName, `<span title='${teamName}'>${MFLPlayerPopupTeamNames[teamName].abbrev}</span>`);
            }
          }
          if (reduced){ tr.querySelector('td:nth-child(4)')?.remove(); tr.querySelector('td:nth-child(4)')?.remove(); }
          statsOut += (idx++ % 2 ? "<tr class='eventablerow'>" : "<tr class='oddtablerow'>") + tr.innerHTML + "</tr>";
        }
      });
      statsOut += "</tbody></table>";
      setHTML($("#MFLPlayerPopupStats"), statsOut);

      if (MFLPlayerPopupIncludeProjections){
        setHTML($("#MFLPlayerPopupProjections"),
          "<div id='MFLPlayerPopupLoading'><center>Loading Content . . .<br><br><div class='MFLPlayerPopupLoader'></div></center></div>"
        );
      }

      MFLPlayerPopupTracker[0] = 1;
      MFLPlayerPopupInitiate?.(0);
    })
    .catch(err => console.error("Error:", err));

  // 3) News: player first, fallback to TEAM Rotowire
  const newsPlayerURL = `${baseURLDynamic}/${year}/news_articles?PLAYERS=${pid}&DAYS=30`;
  fetchText(newsPlayerURL)
    .then(txt => {
      const teamNewsURL = `${baseURLDynamic}/${year}/news_articles?TEAM=${team}&SOURCE=RotoWire&DAYS=30`;
      return fetchText(teamNewsURL)
        .then(txt2 => ({ playerTxt: txt, teamTxt: txt2 }))
        .catch(() => ({ playerTxt: txt, teamTxt: "" }));
    })
    .then(({playerTxt, teamTxt}) => {
      // parse both, choose player or fallback to team
      let useHTML = playerTxt, warn = "";
      const playerDoc = parseHTML(playerTxt);
      const rows = $$(".report tr", playerDoc);
      if (rows.length < 2 && teamTxt){
        useHTML = teamTxt;
        warn = `<h3 class='warning'>No News for Player - Showing Recent News for ${team}</h3>`;
      }

      const doc = parseHTML(useHTML);
      let out = `<table class='popreport'>${warn}<tbody>`;
      let line = 0;

      $$(".report tr", doc).forEach(tr => {
        if (line > 0){
          const link = $('td:nth-child(2) a', tr)?.getAttribute('href') || "";
          const id = `${pid}_${line}`;
          // unwrap all anchors
          tr.querySelectorAll("td a").forEach(a => {
            const span = document.createElement('span');
            span.innerHTML = a.innerHTML;
            a.replaceWith(span);
          });
          // body + "(More)" -> clickable
          let body = $('td:nth-child(3)', tr)?.innerHTML || "";
          body = body.replace("Analysis:", "<br><br><b>Analysis:</b>");
          body = body.replace("(More)", `(<span class='MFLPlayerPopupMoreNews warning' onclick='MFLPlayerPopupMoreNews("${link}","${id}")'>More</span>)`);

          const headline = $('td:nth-child(2)', tr)?.innerHTML || "";
          const ageAgo   = $('td:nth-child(4)', tr)?.innerHTML || "";

          out += `<tr class='oddtablerow headline'><th>${headline}<span>${ageAgo} ago</span></th></tr>`;
          out += `<tr class='eventablerow article'><td id='${id}' style='position:relative'>${body}</td></tr>`;
        }
        line++;
      });
      out += "</tbody></table>";
      setHTML($("#MFLPlayerPopupNews"), out);
    })
    .catch(err => console.error("Error fetching newsData:", err));

  MFLPlayerPopupTracker[1] = 1;
  MFLPlayerPopupInitiate?.(0);
}

// expose
window.MFLPlayerPopupSetup = MFLPlayerPopupSetup;
window.MFLPlayerPopupArticleSetup = MFLPlayerPopupArticleSetup;
window.MFLPlayerPopupNotificationPreSetup = MFLPlayerPopupNotificationPreSetup;
window.MFLPlayerPopupNotificationSetup = MFLPlayerPopupNotificationSetup;
window.MFLPlayerPopupPopulateProjections = MFLPlayerPopupPopulateProjections;
window.MFLPlayerPopupPopulate = MFLPlayerPopupPopulate;


// --- tiny helpers (safe if already defined) ---

function setHTML(el, html){ if (el) el.innerHTML = html; }
function show(el){ if (el) el.style.display = ''; }
function hide(el){ if (el) el.style.display = 'none'; }
function parseHTML(html){ const t=document.createElement('template'); t.innerHTML=html; return t.content; }
function fetchText(url){ return fetch(url).then(r => { if(!r.ok) throw new Error(`${r.status} ${r.statusText}`); return r.text(); }); }
function fetchJSON(url){ return fetch(url).then(r => { if(!r.ok) throw new Error(`${r.status} ${r.statusText}`); return r.json(); }); }

// Cookie helpers (same semantics as your originals)
function setCookie(name, value="1", days=1){
  const d = new Date(); d.setTime(d.getTime() + days*24*60*60*1000);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
}
function getCookie(name){
  const n = name + "=";
  return document.cookie.split(";").map(c=>c.trim()).find(c=>c.startsWith(n))?.slice(n.length) ?? "";
}

// ===============================
// Article → Populate
// ===============================
function MFLPlayerPopupArticlePopulate(headlineHTML, ageText, articleId){
  show($("#MFLPlayerPopupContainer #MFLPlayerPopupLoading"));
  hide($("#MFLPlayerPopupLoaded"));
  hide($("#MFLPlayerPopupArticleLoaded"));

  const url = `${baseURLDynamic}/${year}/view_news_article?ID=${articleId}`;
  fetchText(url)
    .then(txt => {
      const doc = parseHTML(txt);
      // second row of .report is the article content (unwrapped)
      let i = 0, body = "";
      $$(".report tr", doc).forEach(tr => {
        if (i === 1) {
          tr.querySelectorAll("td a").forEach(a => { const s=document.createElement('span'); s.innerHTML = a.innerHTML; a.replaceWith(s); });
          body = $('td', tr)?.innerHTML ?? "";
          if (body.includes("Article Link")) body = body.substring(0, body.indexOf("Article Link") - 2);
          if (body.includes("Roto Pass from")) body = body.substring(0, body.indexOf("Roto Pass from") - 3);
        }
        i++;
      });

      const out =
        "<table class='popreport'><tbody>" +
        `<tr class='oddtablerow headline'><th>${headlineHTML}</th></tr>` +
        `<tr class='eventablerow article'><td>${body}</td></tr>` +
        "</tbody></table>";

      setHTML($("#MFLPlayerPopupArticleLoaded"), out);
      MFLPlayerPopupInitiate(1);
    })
    .catch(err => console.error("Error fetching articleData:", err));
}

// ===============================
// Notifications: entrypoint
// ===============================
function MFLPlayerPopupPopulateOnload(openImmediately){
  if (openImmediately){
    MFLPlayerPopupNotificationPreSetup();
    setTimeout(() => MFLPlayerPopupPopulateNotification(true), 200);
  } else {
    MFLPlayerPopupPopulateNotification(false);
  }
  hide($(".toggle_module_login"));
  hide($(".toggle_module_search"));
  hide($(".skinSelectorContainer"));
}

// ===============================
// Notifications: gather all sources
// ===============================
function MFLPlayerPopupPopulateNotification(openedViaIcon){
  // reset
  MFLPlayerPopupTracker = [];
  MFLPlayerPopupOnloadContent[0] = "";
  MFLPlayerPopupOnloadContent[1] = "";
  MFLPlayerPopupOnloadContent[2] = "";
  MFLPlayerPopupOnloadContent[3] = "";
  MFLPlayerPopupOnloadContent[4] = "";

  show($("#MFLPlayerPopupContainer #MFLPlayerPopupLoading"));
  hide($("#MFLPlayerPopupLoaded"));
  hide($("#MFLPlayerPopupArticleLoaded"));

  // Trades
  const finishTrades = () => { MFLPlayerPopupTracker[0] = 1; MFLPlayerPopupNotificationSetup(openedViaIcon); };
  if (MFLPopupEnableTrade){
    const url = `${baseURLDynamic}/${year}/home/${league_id}?MODULE=TRADES`;
    fetchText(url)
      .then(txt => {
        const doc = parseHTML(txt);
        const container = $("#trades", doc);
        if (container){
          const str = container.textContent || "";
          const has =
            str.includes("proposed by me") ||
            str.includes("proposed by others") ||
            str.includes("awaiting your review") ||
            str.includes("pending commissioner review");
          if (has) {
            // parent().html() equivalent:
            const tbl = container.closest("table");
            if (tbl) MFLPlayerPopupOnloadContent[0] = tbl.outerHTML;
          }
        }
        finishTrades();
      })
      .catch(err => { console.error("Error fetching tradeData:", err); finishTrades(); });
  } else { finishTrades(); }

  // Trade Polls
  const finishPolls = () => { MFLPlayerPopupTracker[1] = 1; MFLPlayerPopupNotificationSetup(openedViaIcon); };
  if (MFLPopupEnableTradePoll){
    const url = `${baseURLDynamic}/${year}/options?L=${league_id}&O=69`;
    fetchText(url)
      .then(txt => {
        const doc = parseHTML(txt);
        $$('.report[id^="poll_"]', doc).forEach(tbl => {
          const th0 = $('th', tbl);
          if (th0 && th0.textContent.includes("gave up")){
            MFLPlayerPopupOnloadContent[1] += tbl.parentElement?.parentElement?.outerHTML ?? tbl.outerHTML;
          }
        });
        finishPolls();
      })
      .catch(err => { console.error("Error fetching pollData:", err); finishPolls(); });
  } else { finishPolls(); }

  // Reminders & Messages
  const finishRemMsg = () => { MFLPlayerPopupNotificationSetup(openedViaIcon); };
  const markRem = () => { MFLPlayerPopupTracker[2] = 1; };
  const markMsg = () => { MFLPlayerPopupTracker[3] = 1; };

  if (MFLPopupEnableReminders || MFLPopupEnableMessages){
    const url = `${baseURLDynamic}/${year}/home/${league_id}`;
    fetchText(url)
      .then(txt => {
        const doc = parseHTML(txt);
        if (MFLPopupEnableReminders){
          const r = $("#league_reminders", doc);
          if (r){
            MFLPlayerPopupOnloadContent[2] =
              `<table align='center' cellspacing='1' class='homepagemodule report'>${r.innerHTML}</table>`;
          }
          markRem();
        } else { markRem(); }

        if (MFLPopupEnableMessages){
          $$(".homepagemessage:not(#league_reminders)", doc).forEach(div => {
            MFLPlayerPopupOnloadContent[3] +=
              `<table align='center' cellspacing='1' class='homepagemodule report'>${div.innerHTML}</table>`;
          });
          markMsg();
        } else { markMsg(); }

        finishRemMsg();
      })
      .catch(err => { console.log("Error:", err); markRem(); markMsg(); finishRemMsg(); });
  } else { markRem(); markMsg(); finishRemMsg(); }

  // Commish Message
  if (MFLPopupEnableCommishMessage && MFLPopupCommishMessage !== ""){
    MFLPlayerPopupOnloadContent[4] =
      `<table align='center' cellspacing='1' class='homepagemodule report'><tr><th>From the Commissioner's Desk</th></tr><tr class='oddtablerow'><td>${MFLPopupCommishMessage}</td></tr></table>`;
    MFLPlayerPopupTracker[4] = 1;
    MFLPlayerPopupNotificationSetup(openedViaIcon);
  } else {
    MFLPlayerPopupTracker[4] = 1;
    MFLPlayerPopupNotificationSetup(openedViaIcon);
  }
}

// ===============================
// News icons on player links
// ===============================
function MFLPlayerPopupNewsIcon(){
  // mark roster cells as player cells (kept from original intent)
  $$('#body_lineup table.report tr a[href*="player?L="][href*="P="]').forEach(a => {
    a.closest('td')?.classList.add('player');
  });

  $$('a[href*="player?L="][href*="P="]').forEach(a => {
    // exclude popup internal/known areas
    if (a.closest('#MFLPlayerPopupLinks') || a.closest('#player_stats_table') || a.closest('.biohistory')) return;

    const href = a.getAttribute('href') || "";
    const pid = href.slice(href.indexOf("P=")+2);
    let alt = "news", icon = MFLPlayerPopupNewsOld, style = "";

    if (typeof newsBreaker === "undefined") {
      alt = "no news"; icon = MFLPlayerPopupNewsNone; style = "cursor:pointer;pointer-events:all;";
    } else if (newsBreaker["pid_" + pid] === 0) {
      alt = "new news"; icon = MFLPlayerPopupNewsNew; style = "cursor:pointer;pointer-events:all;";
    } else if (newsBreaker["pid_" + pid] > 0) {
      alt = "recent news"; icon = MFLPlayerPopupNewsOld; style = "cursor:pointer;pointer-events:all;";
    }

    if (!a.querySelector(".playerPopupIcon")){
      const img = document.createElement('img');
      img.src = icon; img.alt = alt; img.title = alt; img.className = "playerPopupIcon"; img.style = style;
      img.addEventListener('click', ev => { ev.preventDefault(); MFLPlayerPopupSetup(pid, a.innerHTML); });
      a.appendChild(img);

      // also click on the anchor opens popup (matches jQ)
      a.addEventListener('click', ev => { ev.preventDefault(); MFLPlayerPopupSetup(pid, a.innerHTML); });
    }
  });
}

// ===============================
// Article icons on headlines
// ===============================
function MFLPlayerPopupArticleIcon(){
  $$("td.headline a").forEach(a => {
    const headline = a.innerHTML.replace(/[\\"']/g,"\\jQuery&").replace(/\u0000/g,"\\0");
    const timestamp = a.closest("tr")?.querySelector("td.timestamp")?.innerHTML || "";
    const href = a.getAttribute("href") || "";
    const id = href.slice(href.indexOf("ID=")+3);

    if (!a.parentElement.querySelector(".playerPopupIcon")){
      const img = document.createElement("img");
      img.src = MFLPlayerPopupNewsOld;
      img.className = "playerPopupIcon";
      img.style = "cursor:pointer;pointer-events:all;";
      img.addEventListener("click", () => MFLPlayerPopupArticleSetup(headline, timestamp, id));
      a.after(img);

      a.addEventListener("click", ev => { ev.preventDefault(); MFLPlayerPopupArticleSetup(a.innerHTML, timestamp, id); });
    }
  });
}

// ===============================
// Popup state machine
// ===============================
function MFLPlayerPopupInitiate(mode){
  if (mode === 0 && MFLPlayerPopupTracker[0] === 1 && MFLPlayerPopupTracker[1] === 1){
    show($("#MFLPlayerPopupNews"));
    $("#MFLPlayerPopupTabLinksNews")?.classList.add("active");
    hide($("#MFLPlayerPopupContainer #MFLPlayerPopupLoading"));
    hide($("#MFLPlayerPopupArticleLoaded"));
    show($("#MFLPlayerPopupLoaded"));
    ["#MFLPlayerPopupNews","#MFLPlayerPopupBio","#MFLPlayerPopupStats","#MFLPlayerPopupProjections","#MFLPlayerPopupStatsHistory"]
      .forEach(sel => { const el = $(sel); if (el) el.scrollTop = 0; });
    $("#MFLPlayerPopupNews")?.classList.add("active_div_tab_scroll");
  }
  if (mode === 1){
    hide($("#MFLPlayerPopupContainer #MFLPlayerPopupLoading"));
    hide($("#MFLPlayerPopupLoaded"));
    show($("#MFLPlayerPopupArticleLoaded"));
  }
  if (mode === 2){
    hide($("#MFLPlayerPopupContainer #MFLPlayerPopupLoading"));
    show($("#MFLPlayerPopupLoaded"));
    hide($("#MFLPlayerPopupArticleLoaded"));
    setCookie(`MFLPlayerPopup_${year}_${league_id}_${franchise_id}`, "1", 1);
  }
}

// ===============================
// Bootstrapping icons
// ===============================
function addNewsIcon(attempt){
  if (typeof newsBreaker !== "undefined"){
    if (MFLPopupEnablePlayerNews) MFLPlayerPopupNewsIcon();
    if (MFLPopupEnableArticle)    MFLPlayerPopupArticleIcon();
  } else if (attempt < 5){
    setTimeout(() => addNewsIcon(attempt + 1), 100);
  }
}

// delegated click on roster links (replaces jQ .on)
document.addEventListener("click", e => {
  const a = e.target.closest('#roster_column_middle a[href*="player?L="][href*="P="]');
  if (!a) return;
  e.preventDefault();
  const pid = (a.getAttribute('href')||"").slice((a.getAttribute('href')||"").indexOf("P=")+2);
  MFLPlayerPopupSetup(pid, a.innerHTML.replace(/[\\"']/g,"\\").replace(/\u0000/g,"\\0"));
});

// kick off icons (match original)
setTimeout(() => addNewsIcon(5), 100);
document.addEventListener("DOMContentLoaded", () => addNewsIcon(0));

// optional style tweak if omit status
if (window.MFLPopupOmitStatus){
  const st = document.createElement('style');
  st.textContent = "#MFLPlayerPopupStats th:nth-child(4), #MFLPlayerPopupStats td:nth-child(4) {display:none}";
  document.head.appendChild(st);
}

// ===============================
// Login / Search toggles (vanilla)
// ===============================
if (window.ShowMFLlogin){
  window.toggleLogin = function(){
    hide($(".skinSelectorContainer"));
    const box = $(".toggle_module_login");
    const other = $(".toggle_module_search");
    if (!box) return;
    if (getComputedStyle(box).display === "none"){ show(box); hide(other); } else hide(box);
  };
  const css = document.createElement('style');
  css.textContent = `.pageheader .welcome{display:none}.toggle_login_content td b{display:block}.toggle_login_content td{text-align:center;font-size:90%}.toggle_module_login{position:absolute;z-index:999999;width:18.75rem;margin-top:.313rem;margin-left:-5.938rem;}`;
  document.head.appendChild(css);
  const css2 = document.createElement('style');
  css2.textContent = "li.notification-icon-login{display:inline-block!important}";
  document.head.appendChild(css2);
  $("#icon-wrapper-mobile")?.style.setProperty('display','');
  $("#icon-wrapper")?.style.setProperty('display','');
  const welcome = document.querySelector(".pageheader .welcome");
  if (welcome) {
    const target = $(".toggle_login_content .oddtablerow");
    if (target) target.appendChild(welcome);
    $$(".toggle_login_content .welcome small").forEach(n => n.remove());
    welcome.removeAttribute("class");
  }
}

if (window.ShowMFLsearch){
  window.toggleSearch = function(){
    hide($(".skinSelectorContainer"));
    const box = $(".toggle_module_search");
    const other = $(".toggle_module_login");
    if (!box) return;
    if (getComputedStyle(box).display === "none"){ show(box); hide(other); } else hide(box);
  };
  const css = document.createElement('style');
  css.textContent = `.toggle_search_content td{text-align:center;font-size:90%}.toggle_search_content input[type='submit']{margin:0 .313rem;border-radius:.188rem;padding:.188rem}.toggle_search_content input{position:relative;display:inline}.toggle_module_search{position:absolute;z-index:999999;width:18.75rem;margin-top:.313rem;margin-left:-8.125rem}.toggle_search_content td,.toggle_search_content form,.toggle_search_content input{vertical-align:middle;}`;
  document.head.appendChild(css);
  const css2 = document.createElement('style');
  css2.textContent = "li.notification-icon-search{display:inline-block!important}";
  document.head.appendChild(css2);
  $("#icon-wrapper-mobile")?.style.setProperty('display','');
  $("#icon-wrapper")?.style.setProperty('display','');
}

// ===============================
// Trigger (runs once when ready)
// ===============================
function triggerPlayerPopup(){
  window.triggerPlayerPopup_ran = true;

  if (MFLPopupEnableReminders)  $$("#body_home .homepagemessage").forEach(el => hide(el));
  if (MFLPopupEnableMessages)   $("#league_reminders") && hide($("#league_reminders"));

  MFLPlayerPopupSetupTeamNames?.();

  if (!$("#MFLPlayerPopupContainer")) MFLPlayerPopupCreateContainer?.();

  // auto notifications (only once per session via cookie)
  if (typeof franchise_id !== "undefined" &&
      (MFLPopupEnableTrade || MFLPopupEnableTradePoll || MFLPopupEnableReminders || MFLPopupEnableMessages || (MFLPopupEnableCommishMessage && MFLPopupCommishMessage !== "")) &&
      MFLPopupEnableAutoNotification &&
      !getCookie(`MFLPlayerPopup_${year}_${league_id}_${franchise_id}`)
  ){
    MFLPlayerPopupPopulateOnload(false);
  }

  // Update extra titles by scraping roster module
  const url = `${baseURLDynamic}/${year}/home/${league_id}?MODULE=ROSTER`;
  fetchText(url)
    .then(txt => {
      const doc = parseHTML(txt);
      for (const key in MFLPlayerPopupExtraTitles){
        if (!Object.prototype.hasOwnProperty.call(MFLPlayerPopupExtraTitles, key)) continue;
        const th = $(`th.${key}`, doc);
        if (th) MFLPlayerPopupExtraTitles[key] = th.textContent.trim();
      }
    })
    .catch(err => console.error("Error fetching extrasTitleData:", err));
}


// ---------- tiny helpers ----------
const show = el => el && (el.style.display = '');
const hide = el => el && (el.style.display = 'none');
const addStyle = css => { const s=document.createElement('style'); s.textContent=css; document.head.appendChild(s); };
function parseHTML(html){ const t=document.createElement('template'); t.innerHTML=html; return t.content; }
function fetchText(url){ return fetch(url).then(r => { if(!r.ok) throw new Error(`${r.status} ${r.statusText}`); return r.text(); }); }
function unwrapAll(anchors){
  anchors.forEach(a => { const frag=document.createDocumentFragment(); while(a.firstChild) frag.appendChild(a.firstChild); a.replaceWith(frag); });
}
function replaceAllIn(el, sel, replacer){
  $$(sel, el).forEach(node => replacer(node));
}

// ---------- boot/sentinels ----------
function playerPopupListenerCheck(){
  triggerPlayerPopup_count++;
  if (typeof reportFiveMinuteFullyLoaded !== "undefined" && reportFiveMinuteFullyLoaded){
    clearInterval(playerPopupListener);
    if (!triggerPlayerPopup_ran) triggerPlayerPopup();
  }
  if (triggerPlayerPopup_count > 50){
    clearInterval(playerPopupListener);
    console.log("Stop trying Player Popup after 5 seconds");
  }
}
if (typeof triggerPlayerPopup_ran === "undefined") window.triggerPlayerPopup_ran = false;
if (typeof triggerPlayerPopup_count === "undefined") window.triggerPlayerPopup_count = 0;
if (typeof playerPopupListener === "undefined") window.playerPopupListener = setInterval(playerPopupListenerCheck, 100);

// ---------- mobile centering + notify icon ----------
if (LoginSearchMobileCSS && window.innerWidth < 768){
  const toggle_center = (els) => {
    els.forEach(el => {
      el.style.position = "absolute";
      const left = Math.max(0, (window.innerWidth - el.offsetWidth) / 2 + window.scrollX);
      el.style.left = `${left}px`;
    });
  };
  toggle_center($$('.toggle_module_search,.toggle_module_login'));
  addStyle(`.toggle_module_search,.toggle_module_login{margin-left:-8.125rem;margin-top:0.875rem}#skinSelectorContainer{margin-top:0.875rem}`);
}
if (typeof franchise_id !== "undefined" &&
    (MFLPopupEnableTrade || MFLPopupEnableTradePoll || MFLPopupEnableReminders || MFLPopupEnableMessages || (MFLPopupEnableCommishMessage && MFLPopupCommishMessage !== ""))){
  addStyle(`li.notification-icon-popup{display:inline-block!important}`);
  $("#icon-wrapper-mobile") && ($("#icon-wrapper-mobile").style.display = "");
  $("#icon-wrapper") && ($("#icon-wrapper").style.display = "");
}

// ---------- Score Details / NFL Details scaffolding ----------
if (MFLScoreDetailsPopup){
  if (typeof detailsOverlay === "undefined")  window.detailsOverlay  = "rgba(0,0,0,.7)";
  if (typeof detailsWrapBG === "undefined")   window.detailsWrapBG   = "#fff";
  if (typeof detailsWrapBorder === "undefined") window.detailsWrapBorder = "#000";
  if (typeof detailsWrapBorWidh === "undefined") window.detailsWrapBorWidh = "0";
  if (typeof detailsWrapBoxShdw === "undefined") window.detailsWrapBoxShdw = "0 0 0.188rem 0.188rem rgba(0,0,0,.1)";
  if (typeof detailsWrapPadding === "undefined") window.detailsWrapPadding = "0.625rem";
  if (typeof detailsWrapRadius === "undefined") window.detailsWrapRadius  = "0.188rem";

  document.body.insertAdjacentHTML('beforeend',
    `<div class="scoredetailsWrap" style="display:none;position:fixed;height:100%;width:100%;background:${detailsOverlay};left:0;top:0;z-index:999991"></div>
     <div id="ScoreDetails" class="detailsReportWrap" style="z-index:999991;display:none;max-width:31.25rem;width:96%;margin:auto;position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);background:${detailsWrapBG};border:${detailsWrapBorWidh} solid ${detailsWrapBorder};box-shadow:${detailsWrapBoxShdw};border-radius:${detailsWrapRadius};padding:${detailsWrapPadding};max-height:90%;overflow:auto">
       <table><caption><span></span></caption><span id="MFLPlayerPopupClose">X</span><tbody></tbody></table>
     </div>
     <div id="ScoreNFLDetails" class="detailsReportWrap" style="z-index:999991;display:none;max-width:31.25rem;width:96%;margin:auto;position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);background:${detailsWrapBG};border:${detailsWrapBorWidh} solid ${detailsWrapBorder};box-shadow:${detailsWrapBoxShdw};border-radius:${detailsWrapRadius};padding:${detailsWrapPadding};max-height:90%;overflow:auto">
       <table><caption><span></span></caption><span id="MFLPlayerPopupClose">X</span>
         <tbody><tr><td>
           <div id="teamToggles">
             <div class="leftT"  style="vertical-align:top;display:inline-block;width:50%;text-align:center"><input type="submit" value="" style="min-width:6.25rem;outline:none"></div>
             <div class="rightT" style="vertical-align:top;opacity:.5;display:inline-block;width:50%;text-align:center"><input type="submit" value="" style="min-width:6.25rem;outline:none"></div>
           </div>
         </td></tr></tbody>
         <tbody id="leftTeam"></tbody>
         <tbody id="rightTeam" style="display:none"></tbody>
       </table>
     </div>`
  );
  addStyle(`a[href*="&MATCHUP=%2CFA"],a[href*="MATCHUP=FA%2C"]{display:none}
    table.scoring_details_table td.points,table.box_details_table td,table.box_details_table th{text-align:center!important}
    table.scoring_details_table th,table.scoring_details_table td,table.box_details_table td:nth-child(1),table.box_details_table tr:nth-child(2) > th:nth-child(1){text-align:left!important}
    #body_ajax_ls td.ls_game_info{pointer-events:none}`);

  // unwrap player anchors inside totals on ready
  document.addEventListener('DOMContentLoaded', () => {
    const toUnwrap = $$('#body_options_08 td.points.tot a[href*="player?L"][href*="P="], #body_top td.points.tot a[href*="player?L"][href*="P="]');
    unwrapAll(toUnwrap);
  });

  // close when overlay clicked
  document.body.addEventListener('click', (ev) => {
    if (!ev.target.classList.contains('scoredetailsWrap')) return;
    setHTML($("#ScoreDetails tbody"), "");
    setHTML($("#leftTeam"), "");
    setHTML($("#rightTeam"), "");
    hide($(".scoredetailsWrap"));
    hide($("#ScoreDetails"));
    hide($("#ScoreNFLDetails"));
    const tt = $$("#teamToggles input"); tt.forEach(i => i.value = "");
    const fs = $("#fullSeasonPts"); fs && fs.remove();
    $("#ScoreNFLDetails table")?.classList.remove("box_details_table");
    $("#ScoreDetails table")?.classList.remove("scoring_details_table","overview_details_table");
    $$("a").forEach(a => a.classList.remove("dblClicks"));
    try { bodyScrollLock.clearAllBodyScrollLocks(); } catch(_) {}
  });

  // block double click links
  document.body.addEventListener('click', (ev) => {
    if (ev.target.closest('.dblClicks')) ev.preventDefault();
  });

  // open player scoring breakdown
  document.body.addEventListener('click', async (ev) => {
    const a = ev.target.closest('.report a[href*="detailed?L"][href*="P="]:not(#player_records a):not(#body_options_157 a)');
    if (!a) return;
    ev.preventDefault();

    $$(".detailsReportWrap table").forEach(t => t.classList.add("report"));
    const href = a.getAttribute('href');
    const sub = href.substring(href.indexOf("detailed?") - 1);
    const url = `${baseURLDynamic}/${year}/${sub}&PRINTER=1`;
    const isPastYear = (href.substring(href.indexOf("YEAR=") + 5) < year);

    try {
      const html = await fetchText(url);
      const doc  = parseHTML(html);
      const tbody = $(".report tbody", doc);
      $("#ScoreDetails caption span").textContent = "Scoring Breakdown";
      const full = $("#fullSeasonPts"); full && full.remove();
      $("#ScoreDetails tbody").replaceWith(tbody);
      $("#ScoreNFLDetails table")?.classList.remove("box_details_table");
      const sdTable = $("#ScoreDetails table");
      sdTable?.classList.remove("overview_details_table");
      sdTable?.classList.add("scoring_details_table");

      if (isPastYear){
        $$('a[href*="&MATCHUP="]', $("#ScoreDetails")).forEach(el => el.remove());
        const hideCell = $("#ScoreDetails tr.oddtablerow:nth-child(2) td:nth-child(1)");
        if (hideCell){
          hideCell.style.visibility="hidden";
          const b = hideCell.querySelector('b'); b && (b.style.visibility="visible");
        }
      }
      // strip PRINTER from position links
      replaceAllIn($("#ScoreDetails"),
        '#ScoreDetails td b a[class*="position_"]',
        (node) => node.setAttribute('href', node.getAttribute('href').replace('&PRINTER=1','')));

      $$('a[href*="&MATCHUP=%2CFA"],a[href*="MATCHUP=FA%2C"]', $("#ScoreDetails")).forEach(el => el.remove());

      try { MFLPlayerPopupNewsIcon("ScoreDetails"); } catch(_){}
      show($(".scoredetailsWrap")); show($("#ScoreDetails"));
      try { bodyScrollLock.disableBodyScroll($("#ScoreDetails")); } catch(_){}
      setHTML($("#leftTeam"), ""); setHTML($("#rightTeam"), "");
      $$("#teamToggles input").forEach(i => i.value = "");
      hide($("#ScoreNFLDetails"));

      // close button
      const closeBtn = $("#ScoreDetails #MFLPlayerPopupClose");
      if (closeBtn){
        closeBtn.onclick = () => {
          setHTML($("#ScoreDetails tbody"), "");
          hide($(".scoredetailsWrap")); hide($("#ScoreDetails"));
          try { bodyScrollLock.clearAllBodyScrollLocks(); } catch(_){}
          $("#ScoreNFLDetails table")?.classList.remove("box_details_table");
          $("#ScoreDetails table")?.classList.remove("scoring_details_table","overview_details_table");
          $$("a").forEach(a => a.classList.remove("dblClicks"));
        };
      }
    } catch(err){ console.error("Error:", err); }
  });

  // open matchup (two-column) breakdown
  document.body.addEventListener('click', async (ev) => {
    const a = ev.target.closest('.report a[href*="MATCHUP"]');
    if (!a) return;
    ev.preventDefault();

    const fs = $("#fullSeasonPts"); fs && fs.remove();
    $$(".detailsReportWrap table").forEach(t => t.classList.add("report"));
    const url = `${a.getAttribute('href')}&PRINTER=1`;
    $("#ScoreNFLDetails caption span").textContent = "Detailed Results";

    try {
      const html = await fetchText(url);
      const doc  = parseHTML(html);

      const left  = $("td.two_column_layout:nth-of-type(1) .report tbody:nth-child(2)",  doc)?.childNodes || [];
      const right = $("td.two_column_layout:nth-of-type(2) .report tbody:nth-child(2)",  doc)?.childNodes || [];
      const leftCap  = $("td.two_column_layout:nth-of-type(1) .report caption:nth-child(1) span", doc)?.textContent || "";
      const rightCap = $("td.two_column_layout:nth-of-type(2) .report caption:nth-child(1) span", doc)?.textContent || "";

      $("#ScoreDetails table")?.classList.remove("scoring_details_table","overview_details_table");
      $("#ScoreNFLDetails table")?.classList.add("box_details_table");

      setHTML($("#leftTeam"), ""); setHTML($("#rightTeam"), "");
      $("#leftTeam").append(...left);
      $("#rightTeam").append(...right);

      // strip PRINTER
      replaceAllIn($("#ScoreNFLDetails"),
        '#ScoreNFLDetails td a[class*="position_"]',
        (node) => node.setAttribute('href', node.getAttribute('href').replace('&PRINTER=1','')));

      $("#teamToggles .leftT input").value  = leftCap;
      $("#teamToggles .rightT input").value = rightCap;

      $$('a[href*="&MATCHUP=%2CFA"],a[href*="MATCHUP=FA%2C"]', $("#ScoreNFLDetails")).forEach(el => el.remove());

      setHTML($("#ScoreDetails tbody"), "");
      hide($("#ScoreDetails")); show($(".scoredetailsWrap")); show($("#ScoreNFLDetails"));
      try { bodyScrollLock.disableBodyScroll($("#ScoreNFLDetails")); } catch(_){}

      $(".leftT")?.addEventListener('click', () => {
        $(".leftT").style.opacity = "1"; $(".rightT").style.opacity = ".5";
        show($("#leftTeam")); hide($("#rightTeam"));
      });
      $(".rightT")?.addEventListener('click', () => {
        $(".rightT").style.opacity = "1"; $(".leftT").style.opacity = ".5";
        show($("#rightTeam")); hide($("#leftTeam"));
      });

      const closeBtn = $("#ScoreNFLDetails #MFLPlayerPopupClose");
      if (closeBtn){
        closeBtn.onclick = () => {
          setHTML($("#leftTeam"), ""); setHTML($("#rightTeam"), "");
          $$("#teamToggles input").forEach(i => i.value = "");
          hide($(".scoredetailsWrap")); hide($("#ScoreNFLDetails"));
          try { bodyScrollLock.clearAllBodyScrollLocks(); } catch(_){}
          $("#ScoreNFLDetails table")?.classList.remove("box_details_table");
          $("#ScoreDetails table")?.classList.remove("scoring_details_table","overview_details_table");
          $$("a").forEach(a => a.classList.remove("dblClicks"));
        };
      }

      try {
        MFLPlayerPopupNewsIcon("ScoreDetails");
        MFLPlayerPopupNewsIcon("ScoreNFLDetails");
      } catch(_){}
    } catch(err){ console.error("Error:", err); }
  });

  // Points summary from Options O=08
  document.body.addEventListener('click', async (ev) => {
    const a = ev.target.closest('.report a[href*="options?L="][href*="O=08"][href*="PLAYER_ID="]:not(#body_options_08 a):not([class*="dblClicks"])');
    if (!a) return;
    ev.preventDefault();

    a.classList.add("dblClicks");
    const fs = $("#fullSeasonPts"); fs && fs.remove();
    $$(".detailsReportWrap table").forEach(t => t.classList.add("report"));
    $("#ScoreDetails tbody").insertAdjacentHTML('afterend',
      `<tbody id="fullSeasonPts">
        <tr><th colspan="4" style="text-align:center!important">Points Summary</th></tr>
        <tr class="oddtablerow">
          <td style="text-align:right!important">YTD Pts:</td><td class="dYTDpoints" style="text-align:left!important"></td>
          <td style="text-align:right!important">Avg Pts:</td><td class="dAVGpoints" style="text-align:left!important"></td>
        </tr>
        <tr><th colspan="4" style="text-align:center!important">Weekly Point Totals</th></tr>
      </tbody>`
    );

    try {
      const html = await fetchText(`${a.getAttribute('href')}&PRINTER=1`);
      const doc  = parseHTML(html);

      $("#ScoreDetails caption span").innerHTML = $(" .report tbody td.player a", doc)?.innerHTML || "";

      // move totals/avg
      const ytd = $(".report td.points.tot", doc); if (ytd) $(".dYTDpoints").append(ytd.cloneNode(true).childNodes[0] || "");
      const avg = $(".report td.points.avg", doc); if (avg) $(".dAVGpoints").append(avg.cloneNode(true).childNodes[0] || "");

      // build weekly rows
      const headerLink = $('table.report tr:nth-child(2) th:nth-child(5) a', doc);
      let aHtml = "";
      const thLinks = $$('.report tbody th a[href*="SORT"]:not([href*="SORT=NAME"]):not([href*="SORT=TOT"]):not([href*="SORT=AVG"]):not([href*="SORT=SALARY"]):not([href*="SORT=YEAR"])', doc);
      const tlen = thLinks.length;
      const href = headerLink?.getAttribute('href') || "";
      const startSort = parseInt(href.slice(href.indexOf("SORT=")+5, href.indexOf("SORT=")+7)) || 0;

      for (let i=5; i<tlen+5; i++){
        if (i % 2 === 1) aHtml += `<tr class="dRow">`;
        const weekNum = (startSort + i - 5);
        const cellHTML = $(`table.report td:nth-child(${i})`, doc)?.innerHTML ?? "";
        aHtml += `<td style="text-align:right!important">Week ${weekNum}:</td>`;
        aHtml += `<td style="text-align:left!important">${cellHTML}</td>`;
        if (i % 2 === 0) aHtml += `</tr>`;
      }
      $("#fullSeasonPts").insertAdjacentHTML('beforeend', aHtml);

      // cleanup table styles
      $$(`#ScoreDetails th a`).forEach(x => x.removeAttribute('href'));
      $$('a[href*="&MATCHUP=%2CFA"],a[href*="MATCHUP=FA%2C"]', $("#ScoreDetails")).forEach(x => x.remove());
      $("#ScoreNFLDetails table")?.classList.remove("box_details_table");
      const sdt = $("#ScoreDetails table");
      sdt?.classList.remove("scoring_details_table");
      sdt?.classList.add("overview_details_table");

      try { MFLPlayerPopupNewsIcon("ScoreDetails"); } catch(_){}

      // unwrap YTD/AVG anchors
      $$(`#ScoreDetails td.dYTDpoints a, #ScoreDetails td.dAVGpoints a`).forEach(anchor => {
        const frag = document.createDocumentFragment();
        while(anchor.firstChild) frag.appendChild(anchor.firstChild);
        anchor.replaceWith(frag);
      });

      show($(".scoredetailsWrap")); show($("#ScoreDetails"));
      setHTML($("#leftTeam"), ""); setHTML($("#rightTeam"), "");
      $$("#teamToggles input").forEach(i => i.value = "");
      hide($("#ScoreNFLDetails")); hide($("#TeamDetails")); hide($(".teamdetailsWrap"));

      try { bodyScrollLock.disableBodyScroll($("#ScoreDetails")); } catch(_){}

      const closeBtn = $("#ScoreDetails #MFLPlayerPopupClose");
      if (closeBtn){
        closeBtn.onclick = () => {
          const fs2 = $("#fullSeasonPts"); fs2 && fs2.remove();
          setHTML($("#ScoreDetails tbody"), "");
          hide($(".scoredetailsWrap")); hide($("#ScoreDetails"));
          try { bodyScrollLock.clearAllBodyScrollLocks(); } catch(_){}
          $("#ScoreNFLDetails table")?.classList.remove("box_details_table");
          $("#ScoreDetails table")?.classList.remove("scoring_details_table","overview_details_table");
          $$("a").forEach(a => a.classList.remove("dblClicks"));
        };
      }

      // text replacements
      $$("#fullSeasonPts td").forEach(td => {
        td.innerHTML = td.innerHTML.replace(/&nbsp;/g, "0").replace(/B/g, "Bye");
      });

      // strip images from YTD
      $$("td.dYTDpoints img").forEach(img => img.remove());

      // zebra rows + fill last row
      $$("#fullSeasonPts tr.dRow").forEach((tr, idx) => tr.classList.add(idx%2 ? "oddtablerow" : "eventablerow"));
      const last = $("#fullSeasonPts tr:last-child");
      if (last && last.children.length < 3){ last.insertAdjacentHTML('beforeend', "<td></td><td></td>"); }

    } catch(err){ console.error("Error:", err); }
  });
}




if (MFLFranchisePopup) {
  // defaults
  if (typeof load_playerIcons === "undefined") window.load_playerIcons = false;
  if (typeof removeSchedule === "undefined")   window.removeSchedule = false;
  if (typeof removeWatchlist === "undefined")  window.removeWatchlist = false;
  if (typeof removeLineup === "undefined")     window.removeLineup = false;
  if (typeof hideLinks === "undefined")        window.hideLinks = false;
  if (typeof commishTeam === "undefined")      window.commishTeam = "0001";

  // ------- Weather popup (no jQuery) -------
  window.lu_popup_weatherPopup = function(teamAbbrev, wxUrl) {
    if (typeof weather === "undefined") { alert("Weather for this game is not defined"); return false; }
    if (!weather[teamAbbrev] || !weather[teamAbbrev].location) { alert("Weather for this game is not defined"); return false; }

    addStyle(`
      .current-conditions-wrapper{margin-bottom:0.625rem}
      .current-conditions-wrapper,.kickoff-conditions-wrapper{border:0.188rem solid #ccc;border-radius:0.313rem;padding:0.625rem}
      .current-conditions-text,.kickoff-conditions-text{font-size:1rem;font-weight:700}
      .current-conditions-localtime{display:block;font-size:0.688rem;font-style:italic}
      .current-conditions-temp,.kickoff-conditions-temp{font-size:2.25rem;display:inline-block;vertical-align:top;margin-top:0.25rem;font-weight:700}
      .current-conditions-extras-wrapper,.kickoff-conditions-extras-wrapper{display:inline-block;vertical-align:top;margin-top:0.625rem;margin-left:0.938rem}
      .current-conditions-wind-wrapper,.current-conditions-rain-wrapper,.current-conditions-snow-wrapper,.kickoff-conditions-wind-wrapper,.kickoff-conditions-rain-wrapper,.kickoff-conditions-snow-wrapper{display:block}
      .weather-more-link{text-align:center;margin-top:0.375rem;cursor:pointer}
      #popup-weather-wrapper.modal{width:100%;height:100%;position:fixed;left:0;top:0;z-index:111111111;background:rgba(0,0,0,.7);display:none}
      #popup-weather-container{background:#fff;z-index:99999;max-width:31.25rem;width:96%;margin:auto;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);border:0;box-shadow:#000 0 0 1.563rem;border-radius:0.188rem;padding:0.625rem;max-height:95%;overflow:auto}
      img.kickoff-conditions-icon,img.current-conditions-icon{height:3.125rem;width:auto}
      .weather_caption{line-height:1.875rem;height:1.875rem;position:relative;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%;padding-right:1.438rem}
      .current-conditions-place{font-size:1.25rem;font-weight:700;max-width:0}
      .as_close_btn{position:absolute;z-index:1;cursor:pointer;border-radius:0.188rem;text-align:center;border:0.125rem solid transparent;font-weight:700;background:red;color:#fff;right:0;height:1.375rem;width:1.375rem;line-height:1.4;top:50%;transform:translateY(-50%)}
      .as_close_btn:hover{background:#000;color:#fff}
    `);

    const overlay = document.createElement('div');
    overlay.id = "popup-weather-wrapper";
    overlay.className = "modal";
    overlay.style.display = "block";

    const modal = document.createElement('div');
    modal.id = "popup-weather-container";
    modal.className = "modal-content animate";
    modal.style.display = "block";

    const wx = weather[teamAbbrev];
    let html = '';
    html += `<div id="weather-wrapper">
      <div class="weather_caption">
        <span class="current-conditions-place">${wx.location.name}, ${wx.location.region}</span>
        <span class="as_close_btn">X</span>
      </div>

      <div class="current-conditions-wrapper">
        <div class="current-conditions-header">
          <span class="current-conditions-text">Current Conditions</span>
          <span class="current-conditions-localtime"> last updated ${wx.current.last_updated} local time</span>
        </div>
        <div class="current-conditions-detail">
          <span class="current-conditions-temp">${wx.current.temp_f}&degF</span>
          <span class="current-conditions-icon-wrapper"><img class="current-conditions-icon" src="${wx.current.condition.icon}" /></span>
          <span class="current-conditions-extras-wrapper">
            <span class="current-conditions-wind-wrapper">Wind: <span class="current-conditions-wind-speed">${wx.current.wind_mph}mph</span> <span class="current-conditions-wind-direction">${wx.current.wind_dir}</span></span>`;

    // pick nearest past hour for rain/snow chance
    for (let h = 0; h < wx.forecast.forecastday[0].hour.length; h++) {
      const cur = wx.forecast.forecastday[0].hour[h];
      const prev = h === 0 ? cur : wx.forecast.forecastday[0].hour[h - 1];
      if (cur.time_epoch >= currentServerTime) {
        if (prev.chance_of_rain > 0) html += `<span class="current-conditions-rain-wrapper">Rain: <span class="current-conditions-chance-of-rain">${prev.chance_of_rain}%</span></span>`;
        if (prev.chance_of_snow > 0) html += `<span class="current-conditions-snow-wrapper">Snow: <span class="current-conditions-chance-of-snow">${prev.chance_of_snow}%</span></span>`;
        break;
      }
    }

    html += `</span>
          <div class="current-conditions-text">${wx.current.condition.text}</div>
        </div>
      </div>

      <div class="kickoff-conditions-wrapper">
        <div class="kickoff-conditions-header"><span class="kickoff-conditions-text">Expected Conditions at Kickoff</span></div>`;

    try {
      html += `<div class="kickoff-conditions-detail">
          <span class="kickoff-conditions-temp">${wx.kickoff_weather.temp_f}&degF</span>
          <span class="kickoff-conditions-icon-wrapper"><img class="kickoff-conditions-icon" src="${wx.kickoff_weather.condition.icon}" /></span>
          <span class="kickoff-conditions-extras-wrapper">
            <span class="kickoff-conditions-wind-wrapper">Wind: <span class="kickoff-conditions-wind-speed">${wx.kickoff_weather.wind_mph}mph</span> <span class="kickoff-conditions-wind-direction">${wx.kickoff_weather.wind_dir}</span></span>
            ${wx.kickoff_weather.chance_of_rain > 0 ? `<span class="kickoff-conditions-rain-wrapper">Rain: <span class="kickoff-conditions-chance-of-rain">${wx.kickoff_weather.chance_of_rain}%</span></span>` : ``}
            ${wx.kickoff_weather.chance_of_snow > 0 ? `<span class="kickoff-conditions-snow-wrapper">Snow: <span class="kickoff-conditions-chance-of-snow">${wx.kickoff_weather.chance_of_snow}%</span></span>` : ``}
          </span>
          <div class="current-conditions-text">${wx.kickoff_weather.condition.text}</div>
        </div>`;
    } catch (_) {
      html += `<div class="kickoff-conditions-no-data-available" style="color:red">Future forecasts available 72 hours prior to kickoff</div>`;
    }

    html += `</div>
      <div class="weather-more-link"><a onclick="window.open('${wxUrl}', '_blank')">More at Weather.com</a></div>
    </div>`;

    modal.innerHTML = html;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    try { bodyScrollLock.disableBodyScroll(overlay); } catch(_){}

    const teamWrap = $(".teamdetailsWrap");
    const teamPanel = $("#TeamDetails");
    if (teamWrap) hide(teamWrap);
    if (teamPanel) hide(teamPanel);

    overlay.addEventListener("click", (ev) => {
      if (ev.target === overlay || ev.target.classList.contains("as_close_btn")) {
        overlay.remove();
        $$(".modal").forEach(m => m.style.display = "none");
        $$(".modal-content").forEach(m => m.style.display = "none");
        if (teamWrap) show(teamWrap);
        if (teamPanel) show(teamPanel);
      }
    });
  };

  // ------- container scaffolding -------
  document.body.insertAdjacentHTML('beforeend', `
    <div class="teamdetailsWrap" style="display:none;position:fixed;height:100%;width:100%;background:${detailsOverlay};left:0;top:0;z-index:99999"></div>
    <div id="TeamDetails" class="detailsReportWrap" style="z-index:99999;display:none;max-width:31.25rem;width:96%;margin:auto;position:fixed;top:3.125rem;left:50%;transform:translate(-50%,0%);background:${detailsWrapBG};border:${detailsWrapBorWidh} solid ${detailsWrapBorder};box-shadow:${detailsWrapBoxShdw};border-radius:${detailsWrapRadius};padding:${detailsWrapPadding};max-height: calc(90% - 3.125rem);overflow:auto">
      <table>
        <caption><span></span></caption>
        <span id="MFLPlayerPopupClose">X</span>
        <tbody id="allTabview">
          <tr><td colspan="100">
            <div class="MFLPopTabWrap" style="margin:0">
              <ul class="MFLPlayerPopupTab" style="padding:0">
                <li class="MFLPlayerPopupPlayerTabs" id="frachiseBioTab"><a class="MFLPlayerPopupTabLinks active">Bio</a></li>
                <li class="MFLPlayerPopupPlayerTabs" id="frachiseRostersTab"><a class="MFLPlayerPopupTabLinks">Roster</a></li>
                <li class="MFLPlayerPopupPlayerTabs" id="frachiseScheduleTab"><a class="MFLPlayerPopupTabLinks">Schedule</a></li>
                <li class="MFLPlayerPopupPlayerTabs" id="frachiseAwardsTab"><a class="MFLPlayerPopupTabLinks">Awards</a></li>
              </ul>
            </div>
          </td></tr>
        </tbody>
        <tbody id="ownerTabview">
          <tr><td colspan="100">
            <div class="MFLPopTabWrap" style="margin:0">
              <ul class="MFLPlayerPopupTab" style="padding:0">
                <li class="MFLPlayerPopupPlayerTabs" id="frachiseLineupTab"><a class="MFLPlayerPopupTabLinks">Lineup</a></li>
                <li class="MFLPlayerPopupPlayerTabs" id="frachiseOptionsTab"><a class="MFLPlayerPopupTabLinks">Options</a></li>
                <li class="MFLPlayerPopupPlayerTabs" id="frachiseNewsTab"><a class="MFLPlayerPopupTabLinks">News</a></li>
                <li class="MFLPlayerPopupPlayerTabs" id="frachiseWatchTab"><a class="MFLPlayerPopupTabLinks">WatchList</a></li>
              </ul>
            </div>
          </td></tr>
        </tbody>
        <tbody id="teamLinks">
          <tr><td colspan="100" style="text-align:center">
            <div><ul>
              <li id="full_profile_link"><a>Full Profile</a></li>
              <li id="propose_trade_link"><a>Propose Trade</a></li>
              <li id="trade_bait_link"><a>Trade Bait</a></li>
              <li id="transactions_link"><a>Transactions</a></li>
            </ul></div>
          </td></tr>
        </tbody>
        <tbody class="TeamData team_roster_table" style="display:none"></tbody>
        <tbody class="TeamData team_bio_table" style="display:none"></tbody>
        <tbody class="TeamData team_schedule_table" style="display:none"></tbody>
        <tbody class="TeamData team_awards_table" style="display:none"></tbody>
        <tbody class="TeamData team_lineup_table" style="display:none"></tbody>
        <tbody class="TeamData team_options_table" style="display:none"></tbody>
        <tbody class="TeamData team_news_table" style="display:none"></tbody>
        <tbody class="TeamData team_watch_table" style="display:none"></tbody>
      </table>
    </div>
  `);

  addStyle(`
    #TeamDetails caption span img{height:2.5rem;vertical-align:middle;width:auto}
    #TeamDetails ul.MFLPlayerPopupTab{display:flex;padding:0 .188rem}
    #TeamDetails li.MFLPlayerPopupPlayerTabs{flex:1;margin:0;cursor:pointer}
    #TeamDetails ul.MFLPlayerPopupTab li a:hover{text-decoration:none}
    #teamLinks ul{display:table;width:100%;margin:0;padding:.188rem 0}
    #teamLinks li{display:inline-block;padding:0 .313rem;margin:0;list-style:none;cursor:pointer;text-align:center}
    #teamLinks li a:hover,#teamLinks li a:visited,#teamLinks li a:link{text-decoration:none!important}
    .team_schedule_table .week,.team_schedule_table .points{text-align:center!important}
    .team_schedule_table th.matchup,.team_schedule_table td{text-align:left!important}
    .team_schedule_table img{width:auto;height:1.875rem}
  `);

  // Remove tabs based on flags
  if (removeSchedule) { $("#frachiseScheduleTab")?.remove(); $$(".team_schedule_table").forEach(el => el.remove()); }
  if (removeWatchlist){ $("#frachiseWatchTab")?.remove(); $$(".team_watch_table").forEach(el => el.remove()); }
  if (removeLineup)  { $("#frachiseLineupTab")?.remove(); $$(".team_lineup_table").forEach(el => el.remove()); }
  if (hideLinks){
    $("#teamLinks #propose_trade_link")?.remove();
    $("#teamLinks #trade_bait_link")?.remove();
    $("#teamLinks #transactions_link")?.remove();
  }

  // Overlay close
  document.body.addEventListener('click', (ev) => {
    if (!ev.target.classList.contains('teamdetailsWrap')) return;
    $$("#TeamDetails .TeamData").forEach(t => t.innerHTML = "");
    hide($(".teamdetailsWrap")); hide($("#TeamDetails"));
    $("#MFLPlayerPopupContainer #MFLPlayerPopupClose")?.classList.remove("teamdetails_activated");
    $("#MFLPlayerPopupOverlay")?.classList.remove("teamdetails_activated");
    $("#ScoreDetails #MFLPlayerPopupClose")?.classList.remove("scoredetails_activated");
    $("#ScoreNFLDetails #MFLPlayerPopupClose")?.classList.remove("scoredetails_activated");
    $(".scoredetailsWrap")?.classList.remove("scoredetails_activated");
    $$("a").forEach(a => a.classList.remove("dblClick"));
    try { bodyScrollLock.clearAllBodyScrollLocks(); } catch(_){}
  });

  // Open overlay if already flagged active
  document.body.addEventListener('click', (ev) => {
    if (!ev.target.closest('.teamdetails_activated, .scoredetails_activated')) return;
    show($("#TeamDetails")); show($(".teamdetailsWrap"));
    try { bodyScrollLock.disableBodyScroll($("#TeamDetails")); } catch(_){}
  });

  // Tab switching inside TeamDetails
  function switchTab(showSelector){
    $$("#TeamDetails li.MFLPlayerPopupPlayerTabs a").forEach(a => a.classList.remove("active"));
    $$(".TeamData").forEach(t => hide(t));
    show($(showSelector));
  }
  document.body.addEventListener('click', (ev) => {
    const el = ev.target.closest('#TeamDetails li#frachiseRostersTab');
    if (!el) return;
    switchTab(".team_roster_table");
    $("#TeamDetails li#frachiseRostersTab a")?.classList.add("active");
  });
  document.body.addEventListener('click', (ev) => {
    const el = ev.target.closest('#TeamDetails li#frachiseBioTab');
    if (!el) return;
    switchTab(".team_bio_table");
    $("#TeamDetails li#frachiseBioTab a")?.classList.add("active");
  });
  document.body.addEventListener('click', (ev) => {
    const el = ev.target.closest('#TeamDetails li#frachiseScheduleTab');
    if (!el) return;
    switchTab(".team_schedule_table");
    $("#TeamDetails li#frachiseScheduleTab a")?.classList.add("active");
  });
  document.body.addEventListener('click', (ev) => {
    const el = ev.target.closest('#TeamDetails li#frachiseAwardsTab');
    if (!el) return;
    switchTab(".team_awards_table");
    $("#TeamDetails li#frachiseAwardsTab a")?.classList.add("active");
  });

  // Close X
  document.body.addEventListener('click', (ev) => {
    if (ev.target.id !== "MFLPlayerPopupClose") return;
    $$("#TeamDetails .TeamData").forEach(t => t.innerHTML = "");
    hide($(".teamdetailsWrap")); hide($("#TeamDetails"));
    try { bodyScrollLock.clearAllBodyScrollLocks(); } catch(_){}
    $("#MFLPlayerPopupContainer #MFLPlayerPopupClose")?.classList.remove("teamdetails_activated");
    $("#MFLPlayerPopupOverlay")?.classList.remove("teamdetails_activated");
    $("#ScoreDetails #MFLPlayerPopupClose")?.classList.remove("scoredetails_activated");
    $("#ScoreNFLDetails #MFLPlayerPopupClose")?.classList.remove("scoredetails_activated");
    $(".scoredetailsWrap")?.classList.remove("scoredetails_activated");
    $$("a").forEach(a => a.classList.remove("dblClick"));
  });

  // ------------------ OPEN FRANCHISE POPUP (main entry) ------------------
  function openFranchisePopup(hrefEl){
    // mark activated (so overlay clicks reopen)
    $("#MFLPlayerPopupContainer #MFLPlayerPopupClose")?.classList.add("teamdetails_activated");
    $("#MFLPlayerPopupOverlay")?.classList.add("teamdetails_activated");
    $("#ScoreDetails #MFLPlayerPopupClose")?.classList.add("scoredetails_activated");
    $("#ScoreNFLDetails #MFLPlayerPopupClose")?.classList.add("scoredetails_activated");

    const href = hrefEl.getAttribute('href');
    let fid = href.slice(href.indexOf("F=") + 2);
    fid = fid.includes("&") ? fid.slice(0, fid.indexOf("&")) : fid;

    // owner tab visibility + links
    const parentHref = hrefEl.parentElement?.querySelector("a")?.getAttribute("href") || href;
    const ownerFid = parentHref.slice(parentHref.indexOf("F=") + 2, parentHref.indexOf("F=") + 6);

    if (typeof franchise_id === "undefined") {
      hide($("#ownerTabview"));
      $("#teamLinks #propose_trade_link")?.remove();
      $("#teamLinks #trade_bait_link")?.remove();
    } else if (ownerFid === franchise_id || (franchise_id === "0000" && ownerFid === commishTeam)) {
      $("#ownerTabview")?.setAttribute("style", "display:table-row-group!important");
      $("#teamLinks #propose_trade_link").innerHTML =
        `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=05">Propose A Trade</a>`;
    } else if (franchise_id === "0000") {
      $("#ownerTabview")?.setAttribute("style", "display:table-row-group!important");
      $("#teamLinks #propose_trade_link").innerHTML =
        `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&FRANCHISE=${commishTeam}&OPTION=05&FRANCHISE=${fid}">Offer A Trade</a>`;
    } else {
      $("#ownerTabview")?.setAttribute("style", "display:none!important");
      $("#teamLinks #propose_trade_link").innerHTML =
        `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&FRANCHISE=${franchise_id}&OPTION=05&FRANCHISE=${fid}">Offer A Trade</a>`;
    }

    $("#teamLinks #full_profile_link").innerHTML =
      `<a class="pop_profile" href="${baseURLDynamic}/${year}/options?L=${league_id}&F=${fid}&O=01">Full Profile</a>`;
    $("#teamLinks #trade_bait_link").innerHTML =
      `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=133">Trade Bait</a>`;
    $("#teamLinks #transactions_link").innerHTML =
      `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=03&F=${fid}">Transactions</a>`;

    // caption (name/logo)
    $("#TeamDetails caption span").innerHTML = hrefEl.innerHTML;
    const linkInCap = $("#TeamDetails caption span a");
    if (linkInCap) linkInCap.replaceWith(...linkInCap.childNodes);

    // default active tab = Bio
    $$("#TeamDetails li.MFLPlayerPopupPlayerTabs a").forEach(a => a.classList.remove("active"));
    $("#TeamDetails #frachiseBioTab a")?.classList.add("active");

    // ---- Fetch & populate: ROSTER (O=07&PRINTER=1) ----
    const rosterURL = `${baseURLDynamic}/${year}/options?L=${league_id}&O=07&F=${fid}&PRINTER=1`;
    fetchText(rosterURL).then(html => {
      const frag = parseHTML(html);
      const tbody = $(".report tbody", frag);
      $(".team_roster_table").innerHTML = "";
      if (tbody) $(".team_roster_table").append(...tbody.childNodes);

      // (your reformatting)
      $$("#TeamDetails .team_roster_table td.player").forEach(cell => {
        const link = cell.querySelector("a[href*='player?']");
        if (!link) return;
        const fullText = link.textContent.trim();
        const pidMatch = (link.getAttribute("href").match(/PLAYER_ID=(\d+)/) || [])[1] || "";
        const posMatch = fullText.match(/\b(QB|RB|WR|TE|K|DEF|FB|DL|LB|DB|DT|DE|CB|S|PK|PN|Off|Coach)\b/i);
        const pos = posMatch ? posMatch[1].toUpperCase() : "";
        const name = fullText.replace(/\b(QB|RB|WR|TE|K|DEF|FB|DL|LB|DB|DT|DE|CB|S|PK|PN|Off|Coach)\b/i, "").trim();
        const [firstName, ...rest] = name.split(" ");
        const lastName = rest.join(" ");
        const imgUrl = pidMatch ? `https://www.mflscripts.com/playerImages_96x96/mfl_${pidMatch}.png` : "";
        link.innerHTML = `
          <div class="player_wrapper">
            <div class="player_img"><img src="${imgUrl}" class="headshot" /></div>
            <div class="position_name_roster">${pos}</div>
            <div class="player_name">${firstName} ${lastName}</div>
          </div>`;
      });

      // strip &PRINTER=1 from position links
      replaceAllIn($("#TeamDetails"), '#TeamDetails td a[class*="position_"]', (node) => {
        node.setAttribute('href', node.getAttribute('href').replace('&PRINTER=1',''));
      });

      try { MFLPlayerPopupNewsIcon(); } catch(_) {}
      const ptsTh = $(".team_roster_table th.points"); if (ptsTh) ptsTh.textContent = "Pts";
    }).catch(err => console.error("Roster fetch error:", err));

    // ---- Fetch & populate: BIO (O=01&PRINTER=1) ----
    const bioURL = `${baseURLDynamic}/${year}/options?L=${league_id}&F=${fid}&O=01&PRINTER=1`;
    fetchText(bioURL).then(html => {
      const frag = parseHTML(html);
      const rows = $$(".report tr.emailaddress,.report tr.ownername,.report tr.daytimephone,.report tr.cellnumber,.report tr.mailingaddress,.report tr.lastvisit,.report tr.conference,.report tr.division,.report tr.accounting,.report tr.bbidtotalspent,.report tr.h2hrecord,.report tr.ytdpoints", frag);
      const bioT = $(".team_bio_table");
      bioT.innerHTML = "";

      // optional logo
      if (typeof includeBiologo !== "undefined" && includeBiologo) {
        const logo = (franchiseDatabase["fid_" + fid]?.logo) || "";
        if (logo) bioT.insertAdjacentHTML('beforeend',
          `<tr><td colspan="2" style="text-align:center!important;border:0;box-shadow:none;padding:0"><img style="max-width:100%;margin:0;width:100%" src="${logo}" class="franchiselogo pop_logo"/></td></tr>`
        );
      }

      bioT.insertAdjacentHTML('beforeend', `<tr><th colspan="2">Owner Information</th></tr>`);
      if (rows.length) rows.forEach(r => bioT.appendChild(r.cloneNode(true)));

      bioT.insertAdjacentHTML('beforeend',
        `<tr class="eventablerow reportfooter"><td colspan="2" style="text-align:center!important">
          <a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=208">Career Record</a> | 
          <a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=171&FID=${fid}">All-Time Series Records</a>
        </td></tr>`
      );

      // show Bio by default
      $$(".TeamData").forEach(t => hide(t));
      show($(".team_bio_table"));
      show($(".teamdetailsWrap")); show($("#TeamDetails"));
      try { bodyScrollLock.disableBodyScroll($("#TeamDetails")); } catch(_){}
    }).catch(err => console.error("Bio fetch error:", err));

    // ---- Fetch & populate: SCHEDULE (O=16&PRINTER=1) ----
    const schedURL = `${baseURLDynamic}/${year}/options?L=${league_id}&O=16&F=${fid}&PRINTER=1`;
    fetchText(schedURL).then(html => {
      const frag = parseHTML(html);
      const body = $(".report tbody", frag);
      const sched = $(".team_schedule_table");
      sched.innerHTML = "";
      if (body) sched.append(...body.childNodes);

      // optional franchise icons
      if (load_playerIcons) {
        $$(".team_schedule_table a[class*='franchise_']").forEach(a => {
          const cls = a.getAttribute("class") || "";
          const code = cls.slice(cls.indexOf("franchise_") + 10, cls.indexOf("franchise_") + 14);
          try {
            a.parentElement.style.whiteSpace = "nowrap";
            a.parentElement.insertAdjacentHTML('afterbegin', `<div class="franTeam_${code}" title="${franchiseDatabase["fid_" + code].name}"></div>`);
            setTimeout(() => { $$(".team_schedule_table a").forEach(x => x.replaceWith(...x.childNodes)); }, 1000);
          } catch(_){}
        });
      } else {
        $$(".team_schedule_table a").forEach(x => x.replaceWith(...x.childNodes));
      }
    }).catch(err => console.error("Schedule fetch error:", err));

    // ---- Fetch & populate: AWARDS (O=202&PRINTER=1) ----
    const awardsURL = `${baseURLDynamic}/${year}/options?L=${league_id}&O=202&FID=${fid}&PRINTER=1`;
    fetchText(awardsURL).then(html => {
      const frag = parseHTML(html);
      const body = $(".report tbody", frag);
      const tgt = $(".team_awards_table");
      tgt.innerHTML = "";
      if (body) tgt.append(...body.childNodes);
      const footer = $("#TeamDetails .team_awards_table td.reportfooter");
      if (footer) {
        footer.innerHTML =
          `<a href="${baseURLDynamic}/${year}/csetup?C=AWARDS&L=${league_id}">Create New Award</a> | 
           <a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=201">Edit League Awards</a>`;
      }
    }).catch(err => console.error("Awards fetch error:", err));
  }

  // Delegate clicks: open franchise panel
  document.body.addEventListener('click', (ev) => {
    const sel = '#LSscoringBox .franchise-icon a, #LSscoringBox .franchise-name a, .report a[href*="options?L="][href*="F="][href*="O=07"]:not([href*="F=0000"]):not([href*="api.myfantasyleague.com"]), .report a[href*="options?L="][href*="F="][href*="O=01"]:not([href*="F=0000"]):not([href*="api.myfantasyleague.com"]) , .report a[class*="franchise_"][href*="options?L="][href*="F="]:not([href*="F=0000"]):not([href*="api.myfantasyleague.com"])';
    const a = ev.target.closest(sel);
    if (!a) return;
    ev.preventDefault();
    a.classList.add("dblClick");
    $("#TeamDetails table")?.classList.add("report");
    openFranchisePopup(a);
  });

  // Lineup tab click: show table (weather link rewire)
  document.body.addEventListener('click', (ev) => {
    const el = ev.target.closest('#TeamDetails li#frachiseLineupTab');
    if (!el) return;
    switchTab(".team_lineup_table");
    $("#TeamDetails li#frachiseLineupTab a")?.classList.add("active");

    // Rewire "Weather" links in lineup once visible
    $$("#TeamDetails td.weekly-opp").forEach(td => {
      if (!td.textContent.includes("Weather")) return;
      let oppAbbrev;
      if (!td.textContent.includes("@")) {
        const pa = td.closest("tr")?.querySelector("td.player a");
        if (pa) {
          const parts = pa.textContent.trim().split(" ");
          oppAbbrev = parts[parts.length - 2];
        }
      } else {
        oppAbbrev = td.textContent.trim().slice(1, 4);
      }
      const a = td.querySelector("a");
      const href = a ? a.getAttribute("href") : "#";
      if (a) {
        a.removeAttribute("target");
        a.removeAttribute("href");
        a.setAttribute("title", "View Weather");
        a.onclick = () => lu_popup_weatherPopup(oppAbbrev, href);
      }
    });
  });

  // Other tabs (Options / News / Watch) – show their containers
  document.body.addEventListener('click', (ev) => {
    const el = ev.target.closest('#TeamDetails li#frachiseOptionsTab');
    if (!el) return;
    switchTab(".team_options_table");
    $("#TeamDetails li#frachiseOptionsTab a")?.classList.add("active");
  });
  document.body.addEventListener('click', (ev) => {
    const el = ev.target.closest('#TeamDetails li#frachiseNewsTab');
    if (!el) return;
    switchTab(".team_news_table");
    $("#TeamDetails li#frachiseNewsTab a")?.classList.add("active");
  });
  document.body.addEventListener('click', (ev) => {
    const el = ev.target.closest('#TeamDetails li#frachiseWatchTab');
    if (!el) return;
    switchTab(".team_watch_table");
    $("#TeamDetails li#frachiseWatchTab a")?.classList.add("active");
  });
}




