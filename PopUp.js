// ===== Globals (kept the same names) =====
let MFLPlayerPopupCurrentPID;
let MFLPlayerPopupTracker = [];
let MFLPlayerPopupTeamNames = [];
let MFLPlayerPopupOnloadContent = [];
let MFLPlayerPopupStart = Date.now();

const MFLPlayerPopupValidNFLAbbrev = ["FA", "ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET", "GBP", "HOU", "IND", "JAC", "KCC", "LAC", "LAR", "MIA", "MIN", "NEP", "NOS", "NYG", "NYJ", "OAK", "PHI", "PIT", "SEA", "SFO", "TBB", "TEN", "WAS", "RAM", "LVR", "STL", "SDC"];
const MFLPlayerPopupValidPosition = ["Coach", "QB", "TMQB", "RB", "TMRB", "FB", "WR", "TMWR", "TE", "TMTE", "KR", "PK", "TMPK", "PN", "TMPN", "DE", "DT", "TMDL", "LB", "TMLB", "CB", "S", "TMDB", "Off", "Def", "ST"];
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

// Safe, vanilla helpers (drop these once at the top)
const qs  = (sel, root=document) => root.querySelector(sel);
const qsa = (sel, root=document) => Array.from(root.querySelectorAll(sel));

function setHTML(el, html){ if (el) el.innerHTML = html; }
function show(el){ if (el) el.style.display = ''; }
function hide(el){ if (el) el.style.display = 'none'; }
function parseHTML(html){ const t=document.createElement('template'); t.innerHTML = html; return t.content; }
function fetchText(url){ return fetch(url).then(r => { if(!r.ok) throw new Error(`${r.status} ${r.statusText}`); return r.text(); }); }
function fetchJSON(url){ return fetch(url).then(r => { if(!r.ok) throw new Error(`${r.status} ${r.statusText}`); return r.json(); }); }
const addStyle = css => { const s=document.createElement('style'); s.textContent=css; document.head.appendChild(s); };
function unwrapAll(anchors){
  anchors.forEach(a => { const frag=document.createDocumentFragment(); while(a.firstChild) frag.appendChild(a.firstChild); a.replaceWith(frag); });
}
function replaceAllIn(el, sel, replacer){ qsa(sel, el).forEach(node => replacer(node)); }


function appendHTML(parent, html) {
    const tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    parent.appendChild(tpl.content);
}

function on(parent, event, selector, handler) {
    parent.addEventListener(event, e => {
        const target = e.target.closest(selector);
        if (target && parent.contains(target)) handler(e, target);
    });
}

// ===== Menu icons injection (initial jQuery line) =====
(function injectMenuIcons() {
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

        qsa('#body_player td.player_photo img').forEach(img => {
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

    qsa('#body_options_185,#options_177,#options_207,#fantasy_articles,#fantasy_recap,#fantasy_preview')
        .forEach(root => {
            qsa('img.articlepicture[src*="_thumb"]', root).forEach(img => {
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
try { CameraTag.jQueryPreInstalled = true; } catch (e) { }

// ===== Cookies =====
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
}
function getCookie(name) {
    const key = name + '=';
    return document.cookie.split(';').map(s => s.trim()).find(s => s.startsWith(key))?.slice(key.length) ?? '';
}

function MFLPlayerPopupCreateContainer() {
    appendHTML(document.body, `
      <div id="isMediaContainer" style="display:none"><div class="isMedia"></div></div>
      <div id="MFLPlayerPopupOverlay"></div>
      <div id="MFLPlayerPopupContainer" style="left:0!important;right:0!important;top:0!important;bottom:0!important;margin:auto">
        <div class="MFLPlayerPopupHeaderCaption"><span id="MFLPlayerPopupName"></span></div>
        <span id="MFLPlayerPopupClose" role="button" aria-label="Close">X</span>
  
        <div id="MFLPlayerPopupLoading" class="MFLPlayerPopupLoading"
             style="display:flex;align-items:center;justify-content:center;flex-direction:column">
          Loading Content . . .<br><br><div class="MFLPlayerPopupLoader"></div>
        </div>
  
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
              <div id="MFLPlayerPopupLoadingProjections" class="MFLPlayerPopupLoading"
                   style="display:flex;align-items:center;justify-content:center;flex-direction:column">
                Loading Content . . .<br><br><div class="MFLPlayerPopupLoader"></div>
              </div>
            </div>` : ``}
  
          <div id="MFLPlayerPopupTrades" class="MFLPlayerPopupTabContent">No Data</div>
          <div id="MFLPlayerPopupCommishMessage" class="MFLPlayerPopupTabContent">No Data</div>
          <div id="MFLPlayerPopupReminders" class="MFLPlayerPopupTabContent">No Data</div>
          <div id="MFLPlayerPopupMessages" class="MFLPlayerPopupTabContent">No Data</div>
        </div>
      </div>
    `);
  
  

   // build tabs (outside #TeamDetails)
{
    const allTabs = qsa('.MFLPlayerPopupTab');
    const tabs = allTabs.filter(ul => !ul.closest('#TeamDetails'));
    tabs.forEach(ul => {
      appendHTML(ul, `
        <li class="MFLPlayerPopupPlayerTabs">
          <a href="javascript:void(0)" class="MFLPlayerPopupTabLinks" id="MFLPlayerPopupTabLinksNews" data-target="MFLPlayerPopupNews">
            <span class="pt-hide">Player</span> News
          </a>
        </li>
        <li class="MFLPlayerPopupPlayerTabs" id="MFLPlayerPopupBioTab">
          <a href="javascript:void(0)" class="MFLPlayerPopupTabLinks" data-target="MFLPlayerPopupBio">Bio</a>
        </li>
        <li class="MFLPlayerPopupPlayerTabs">
          <a href="javascript:void(0)" class="MFLPlayerPopupTabLinks" data-target="MFLPlayerPopupStats">
            <span class="pt-hide">${year}</span> Stats
          </a>
        </li>
        ${MFLPlayerPopupIncludeProjections ? `
          <li class="MFLPlayerPopupPlayerTabs">
            <a href="javascript:void(0)" class="MFLPlayerPopupTabLinks" data-target="MFLPlayerPopupProjections">Proj.</a>
          </li>` : ''}
        <li class="MFLPlayerPopupPlayerTabs">
          <a href="javascript:void(0)" class="MFLPlayerPopupTabLinks" data-target="MFLPlayerPopupStatsHistory">Career <span class="pt-hide">Stats</span></a>
        </li>
        ${(MFLPopupEnableTrade || MFLPopupEnableTradePoll) ? `
          <li class="MFLPlayerPopupNotificationTabs">
            <a href="javascript:void(0)" class="MFLPlayerPopupTabLinks" id="MFLPlayerPopupTabLinksTrades" data-target="MFLPlayerPopupTrades">Trades</a>
          </li>` : ''}
        ${(MFLPopupEnableCommishMessage && MFLPopupCommishMessage !== "") ? `
          <li class="MFLPlayerPopupNotificationTabs">
            <a href="javascript:void(0)" class="MFLPlayerPopupTabLinks" id="MFLPlayerPopupTabLinksCommishMessage" data-target="MFLPlayerPopupCommishMessage">Commish Msg</a>
          </li>` : ''}
        ${MFLPopupEnableReminders ? `
          <li class="MFLPlayerPopupNotificationTabs">
            <a href="javascript:void(0)" class="MFLPlayerPopupTabLinks" id="MFLPlayerPopupTabLinksReminders" data-target="MFLPlayerPopupReminders">Reminders</a>
          </li>` : ''}
        ${MFLPopupEnableMessages ? `
          <li class="MFLPlayerPopupNotificationTabs">
            <a href="javascript:void(0)" class="MFLPlayerPopupTabLinks" id="MFLPlayerPopupTabLinksMessages" data-target="MFLPlayerPopupMessages">Messages</a>
          </li>` : ''}
      `);
    });
  }
  
  // close overlay
  qs('#MFLPlayerPopupOverlay')?.addEventListener('click', () => MFLPlayerPopupClose());
  
  // tab switching (vanilla)
  on(document, 'click', '.MFLPlayerPopupTabLinks', (e, el) => {
    e.preventDefault();
    const targetId = el.dataset.target;
    if (!targetId) return;
  
    // replace $$ with qsa
    qsa('.MFLPlayerPopupTabContent').forEach(div => (div.style.display = 'none'));
    qsa('.MFLPlayerPopupTabLinks').forEach(a => a.classList.remove('active'));
  
    el.classList.add('active');
  
    const target = document.getElementById(targetId);
    if (target) {
      target.style.display = 'block';
      target.classList.add('active_div_tab_scroll');
      try { bodyScrollLock?.disableBodyScroll(target); } catch (_) { /* noop */ }
  
      if (targetId === 'MFLPlayerPopupProjections') {
        setTimeout(() => { try { MFLPlayerPopupPopulateProjections?.(); } catch (_) {} }, 5);
      }
    }
  });
  
}

function MFLPlayerPopupClose() {
    const overlay   = qs('#MFLPlayerPopupOverlay');
    const container = qs('#MFLPlayerPopupContainer');
  
    if (overlay)   overlay.style.display = 'none';
    if (container) container.style.display = 'none';
  
    qsa('.MFLPlayerPopupTabContent').forEach(d => {
      d.style.display = 'none';
      d.classList.remove('active_div_tab_scroll');
    });
  
    container?.classList.remove('MFLPlayerPopupArticleContainer', 'MFLPlayerPopupNotificationContainer');
  
    try { bodyScrollLock?.clearAllBodyScrollLocks(); } catch (_) {}
  
    // remove 'active' from tabs outside #TeamDetails
    qsa('.MFLPlayerPopupPlayerTabs a, .MFLPlayerPopupNotificationTabs a')
      .filter(a => !a.closest('#TeamDetails .MFLPlayerPopupPlayerTabs'))
      .forEach(a => a.classList.remove('active'));
  }
  
  // (kept but simplified) index check
  function includes(arr, item) { return Array.isArray(arr) ? arr.includes(item) : false; }
  
  // Build Team name dictionary
  function MFLPlayerPopupSetupTeamNames() {
    for (const k in franchiseDatabase) {
      if (k !== 'fid_0000' && Object.prototype.hasOwnProperty.call(franchiseDatabase, k)) {
        const f = franchiseDatabase[k];
        MFLPlayerPopupTeamNames[f.name] = { id: f.id, abbrev: f.abbrev };
      }
    }
  }
  
  // Expand “…More” news
  async function MFLPlayerPopupMoreNews(path, targetId) {
    try {
      const res  = await fetch(`${baseURLDynamic}/${year}/${path}`);
      const html = await res.text();
  
      const temp = document.createElement('div');
      temp.innerHTML = html;
  
      const rows = temp.querySelectorAll('.report tr');
      let i = 0, content = '';
  
      rows.forEach(tr => {
        if (i === 1) {
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
    } catch (err) {
      console.error('MoreNews error:', err);
    }
  }
  

// expose needed fns to window (to match old inline onclick usage)
window.MFLPlayerPopupCreateContainer = MFLPlayerPopupCreateContainer;
window.MFLPlayerPopupClose = MFLPlayerPopupClose;
window.MFLPlayerPopupMoreNews = MFLPlayerPopupMoreNews;
window.MFLPlayerPopupSetupTeamNames = MFLPlayerPopupSetupTeamNames;


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
function MFLPlayerPopupSetup(pid, fallbackText) {
    // scroll lock on news tab
    const newsEl = qs("#MFLPlayerPopupNews");
    newsEl?.classList.add("active_div_tab_scroll");
    try { bodyScrollLock?.disableBodyScroll(newsEl); } catch (_) { }

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
        pos = parts[parts.length - 1];
        team = parts[parts.length - 2];
        first = parts[0].slice(0, -1); // remove trailing comma
        last = parts.slice(1, parts.length - 2).join(" ");
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
                    team = j.players.player.team;
                    pos = j.players.player.position;
                    headerName = `${fullname} ${team} ${pos}`;
                    setHTML(qs("#MFLPlayerPopupName"), headerName);
                } catch { console.log("FAILED PLAYER ID:", pid); }
            });
        } catch { }
    }

   // Mirror the old UI updates
show(qs("#MFLPlayerPopupOverlay"));
show(qs("#MFLPlayerPopupContainer #MFLPlayerPopupLoading"));

// Select all tabs, then exclude those inside #TeamDetails
qsa(".MFLPlayerPopupPlayerTabs")
  .filter(li => !li.closest("#TeamDetails"))
  .forEach(li => { li.style.display = "table-cell"; });

qs("#MFLPlayerPopupBioTab")?.removeAttribute("style");

qsa(".MFLPlayerPopupNotificationTabs").forEach(li => { li.style.display = "none"; });

if (MFLPopupOmitLinks) hide(qs("#MFLPlayerPopupLinks"));
else show(qs("#MFLPlayerPopupLinks"));

hide(qs("#MFLPlayerPopupLoaded"));
hide(qs("#MFLPlayerPopupArticleLoaded"));
setHTML(qs("#MFLPlayerPopupName"), headerName);
show(qs("#MFLPlayerPopupContainer"));

// kick off content population a tick later
setTimeout(() => MFLPlayerPopupPopulate(pid, fullname, team, pos), 200);

// hide other overlays/cleanup
hide(qs(".teamdetailsWrap"));
hide(qs("#TeamDetails"));

setHTML(qs("#leftTeam"), "");
setHTML(qs("#rightTeam"), "");
setHTML(qs("#ScoreDetails tbody"), "");

// clear team toggles
qsa("#teamToggles input").forEach(i => { i.value = ""; });

qs("#fullSeasonPts")?.remove();

hide(qs(".scoredetailsWrap"));
hide(qs("#ScoreDetails"));
hide(qs("#ScoreNFLDetails"));

qs("#ScoreNFLDetails table")?.classList.remove("box_details_table");
const sd = qs("#ScoreDetails table");
sd?.classList.remove("scoring_details_table");
sd?.classList.remove("overview_details_table");

// remove dblClicks from all anchors
qsa("a").forEach(a => a.classList?.remove?.("dblClicks"));


// ===============================
//  Article popup
// ===============================
function MFLPlayerPopupArticleSetup(html, ageText, source) {
  qs("#MFLPlayerPopupContainer")?.classList.add("MFLPlayerPopupArticleContainer");
  show(qs("#MFLPlayerPopupOverlay"));
  show(qs("#MFLPlayerPopupContainer #MFLPlayerPopupLoading"));
  hide(qs("#MFLPlayerPopupLoaded"));
  hide(qs("#MFLPlayerPopupArticleLoaded"));
  setHTML(qs("#MFLPlayerPopupName"), `Article Posted ${ageText} Ago`);
  show(qs("#MFLPlayerPopupContainer"));
  setTimeout(() => MFLPlayerPopupArticlePopulate?.(html, ageText, source), 200);
  hide(qs(".teamdetailsWrap"));
  hide(qs("#TeamDetails"));

  const art = qs("#MFLPlayerPopupArticleLoaded");
  try { bodyScrollLock?.disableBodyScroll(art); } catch (_) { /* noop */ }
}
}

// ===============================
//  Notification pre-setup
// ===============================
function MFLPlayerPopupNotificationPreSetup() {
    qs("#MFLPlayerPopupContainer")?.classList.add("MFLPlayerPopupNotificationContainer");
    show(qs("#MFLPlayerPopupOverlay"));
    show(qs("#MFLPlayerPopupContainer #MFLPlayerPopupLoading"));
  
    // Hide player tabs inside/outside TeamDetails appropriately
    qsa(".MFLPlayerPopupPlayerTabs")
      .filter(li => !li.closest("#TeamDetails"))
      .forEach(li => { li.style.display = "none"; });
  
    qs("#MFLPlayerPopupBioTab")?.setAttribute("style", "display:none!important");
  
    qsa(".MFLPlayerPopupNotificationTabs").forEach(li => { li.style.display = "table-cell"; });
  
    hide(qs("#MFLPlayerPopupLinks"));
    hide(qs("#MFLPlayerPopupLoaded"));
    hide(qs("#MFLPlayerPopupArticleLoaded"));
  
    // choose default visible tab based on available content
    const hasTrades = !!(MFLPlayerPopupOnloadContent[0] || MFLPlayerPopupOnloadContent[1]);
    const tabOrder = [
      { ok: hasTrades, id: "MFLPlayerPopupTrades",            link: "#MFLPlayerPopupTabLinksTrades" },
      { ok: MFLPopupEnableCommishMessage && MFLPlayerPopupOnloadContent[4] !== "", id: "MFLPlayerPopupCommishMessage", link: "#MFLPlayerPopupTabLinksCommishMessage" },
      { ok: MFLPopupEnableReminders && MFLPlayerPopupOnloadContent[2] !== "",      id: "MFLPlayerPopupReminders",      link: "#MFLPlayerPopupTabLinksReminders" },
      { ok: MFLPopupEnableMessages && MFLPlayerPopupOnloadContent[3] !== "",       id: "MFLPlayerPopupMessages",       link: "#MFLPlayerPopupTabLinksMessages" }
    ];
  
    let chosen = tabOrder.find(t => t.ok);
    if (!chosen) {
      chosen = [
        { flag: MFLPopupEnableTrade,           id: "MFLPlayerPopupTrades",           link: "#MFLPlayerPopupTabLinksTrades" },
        { flag: MFLPopupEnableCommishMessage,  id: "MFLPlayerPopupCommishMessage",   link: "#MFLPlayerPopupTabLinksCommishMessage" },
        { flag: MFLPopupEnableReminders,       id: "MFLPlayerPopupReminders",        link: "#MFLPlayerPopupTabLinksReminders" },
        { flag: MFLPopupEnableMessages,        id: "MFLPlayerPopupMessages",         link: "#MFLPlayerPopupTabLinksMessages" },
      ].find(x => x.flag);
    }
  
    if (chosen) {
      const pane = qs("#" + chosen.id);
      pane?.classList.add("active_div_tab_scroll");
      show(pane);
      qs(chosen.link)?.classList.add("active");
    } else {
      // nothing—show "no notifications"
      const hdr = "<table class='popreport'><tbody><tr><th>You Have No Notifications!</th></tr><tr class='oddtablerow'><td>There are currently no active notifications.</td></tr></tbody></table>";
      qs("#MFLPlayerPopupHeader")?.parentElement?.classList.add("noHide");
      setHTML(qs("#MFLPlayerPopupHeader"), hdr);
      qs("#MFLPlayerPopupMessages")?.classList.add("active_div_tab_scroll");
      show(qs("#MFLPlayerPopupMessages"));
    }
  
    const act = qs(".active_div_tab_scroll");
    try { bodyScrollLock?.disableBodyScroll(act); } catch (_) { }
  
    setHTML(qs("#MFLPlayerPopupName"),
      `League Notifications <span class='MFLPopupLeagueNotification' style='padding:0;background:none' title='Notifications'>${MFLPopupNotifyFontAwesome}</span>`
    );
    show(qs("#MFLPlayerPopupContainer"));
  }
  

// ===============================
//  Notification setup (after content loaded)
// ===============================
function MFLPlayerPopupNotificationSetup(fromAuto) {
    const ready  = [0, 1, 2, 3, 4].every(i => MFLPlayerPopupTracker[i] === 1);
    const hasAny = MFLPlayerPopupOnloadContent.some(x => x && x !== "");
  
    if (!ready) return;
  
    if (!fromAuto || hasAny) {
      if (!fromAuto) MFLPlayerPopupNotificationPreSetup();
  
      const none = MFLPlayerPopupOnloadContent.every(x => x === "");
      if (none) {
        const hdr = "<table class='popreport'><tbody><tr><th>You Have No Notifications!</th></tr><tr class='oddtablerow'><td>There are currently no active notifications.</td></tr></tbody></table>";
        qs("#MFLPlayerPopupHeader")?.parentElement?.classList.add("noHide");
        setHTML(qs("#MFLPlayerPopupHeader"), hdr);
      } else {
        const autoText = MFLPopupEnableAutoNotification
          ? "<table class='popreport'><tbody><tr><th>You Have Notifications!</th></tr><tr class='oddtablerow'><td>There are one or more active notifications that have been set to automatically display once per browser session.<br><br>After closing this popup you can re-open notifications by either closing and re-opening the browser or clicking on the notification icon in the menu.</td></tr></tbody></table>"
          : "<table class='popreport'><tbody><tr><th>You Have Notifications!</th></tr><tr class='oddtablerow'><td>There are one or more active notifications. Check the tabs below to view them.</td></tr></tbody></table>";
        setHTML(qs("#MFLPlayerPopupHeader"), autoText);
      }
  
      // fill tabs
      const trades = (MFLPlayerPopupOnloadContent[0] || "") + (MFLPlayerPopupOnloadContent[1] || "");
      setHTML(qs("#MFLPlayerPopupTrades"),
        trades
          ? trades.replace(/report/g, "popreport").replace("<caption><span>Pending Trades</span></caption>", "").replace("<caption><span></span></caption>", "")
          : "<br /><center><i>No Current Trade Notifications</i></center>"
      );
  
      setHTML(qs("#MFLPlayerPopupReminders"),
        MFLPlayerPopupOnloadContent[2]
          ? MFLPlayerPopupOnloadContent[2].replace(/report/g, "popreport")
          : `<br /><center><i>No Active League Reminders<br/><br/>OR<br/><br/>League Reminders are Disabled in <a href='${baseURLDynamic}/${year}/csetup?L=${league_id}&C=FCUSTOM&F=${franchise_id}'>Franchise Customization</a> Settings</i></center>`
      );
  
      setHTML(qs("#MFLPlayerPopupMessages"),
        MFLPlayerPopupOnloadContent[3]
          ? MFLPlayerPopupOnloadContent[3].replace(/report/g, "popreport")
          : "<br /><center><i>No Active Messages from MyFantasyLeague</i></center>"
      );
  
      setHTML(qs("#MFLPlayerPopupCommishMessage"),
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
  function MFLPlayerPopupPopulateProjections() {
    // If you applied the earlier HTML fix, use the new loader ID:
    show(qs("#MFLPlayerPopupLoadingProjections"));
  
    setTimeout(() => {
      // if content still the loader, fetch
      if ((qs("#MFLPlayerPopupProjections")?.textContent || "").includes("Loading Content")) {
        const url = `${baseURLDynamic}/${year}/player?L=${league_id}&P=${MFLPlayerPopupCurrentPID}&YEAR=${year}&DISPLAY_TYPE=projections`;
        fetchText(url).then(html => {
          const doc  = parseHTML(html); // DocumentFragment
          const rows = qsa("#player_stats_table tr", doc);
  
          let i = 0, out = "<table class='popreport'><tbody>";
          rows.forEach(tr => {
            if (qs("form", tr)) return; // skip rows with forms
  
            if (tr.querySelectorAll("th").length > 0) {
              // header: remove last col to go from 4 to 3 if present
              const ths = tr.querySelectorAll("th");
              if (parseInt(ths[0]?.getAttribute("colspan") || "0", 10) === 4) {
                ths[0].setAttribute("colspan", "3");
              } else {
                ths[3]?.remove();
              }
              out += `<tr>${tr.innerHTML}</tr>`;
            } else if (tr.querySelectorAll("td").length > 1) {
              tr.querySelectorAll("td:nth-child(4)").forEach(td => td.remove());
              out += (i++ % 2 ? "<tr class='eventablerow'>" : "<tr class='oddtablerow'>") + tr.innerHTML + "</tr>";
            }
          });
          out += "</tbody></table>";
          setHTML(qs("#MFLPlayerPopupProjections"), out);
        }).catch(err => console.error("Error:", err));
      }
    }, 1000);
  }
  

// ===============================
//  Populate all tabs for a player
// ===============================
function MFLPlayerPopupPopulate(pid, name, team, pos) {
    MFLPlayerPopupTracker = [];
    show(qs("#MFLPlayerPopupContainer #MFLPlayerPopupLoading"));
    hide(qs("#MFLPlayerPopupLoaded"));
    hide(qs("#MFLPlayerPopupArticleLoaded"));
  
    // 1) playerStatus
    const statusURL = `${baseURLDynamic}/${year}/export?TYPE=playerStatus&L=${league_id}&P=${pid}&JSON=1`;
    fetchJSON(statusURL)
      .then(json => {
        let status = "";
        try { status = MFLPopupCustomRule?.("pStatus", null, null, pid, name, team, pos, json, null, null) ?? ""; }
        catch { try { status = json.playerStatus.status; } catch { } }
        // 2) player page
        const profURL = `${baseURLDynamic}/${year}/player?L=${league_id}&P=${pid}`;
        return fetchText(profURL).then(html => ({ html, status }));
      })
      .then(({ html, status }) => {
        const doc = parseHTML(html);
  
        // build header (photo + bio)
        const photoCell = qs(".player_photo img", doc);
        let photoHTML;
        if (photoCell) {
          photoCell.setAttribute("src", `https://www.mflscripts.com/playerImages_80x107/mfl_${pid}.png`);
          photoHTML = photoCell.parentElement?.innerHTML ?? "";
        }
        let hasPhoto = true;
        if (!photoHTML) {
          photoHTML = `<img src='https://www.mflscripts.com/ImageDirectory/script-images/nflTeamsvg_2/${team}.svg' alt='${team}' title='${team}' align='middle' />`;
          hasPhoto = false;
        } else {
          const repl = photoHTML.substring(photoHTML.indexOf("this.src=") + 10, photoHTML.indexOf("no_photo_available.jpg") + 22);
          photoHTML = photoHTML.replace(repl, "https://www.mflscripts.com/playerImages_80x107/free_agent.png");
        }
        photoHTML = photoHTML.replace("<img ", "<img class='articlepicture' ");
  
        // quick links row (hidden if MFLPopupOmitLinks)
        if (!MFLPopupOmitLinks) {
          let links = "<table class='popreport'><tbody><tr class='oddtablerow'>";
          links += `<td style='text-align:center; text-indent:0;'><a href='${baseURLDynamic}/${year}/player?L=${league_id}&P=${pid}'>Full Profile</a></td>`;
  
          // Fantasy Sharks link (if present)
          let fs = "";
          qsa("#h3 a, h3 a", doc).forEach(a => {
            if (a.textContent.trim() === "FantasySharks Profile") {
              fs = `<a href='${a.getAttribute("href")}' title='Fantasy Sharks Profile' target='_blank'>Fantasy Sharks</a>`;
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
                    ? `<a href='${baseURLDynamic}/${year}/options?L=${league_id}&O=05&FRANCHISE=${franchise_id},${fid.substring(0, 4)}&P=${pid}'>Propose Trade</a>`
                    : `<a href='${baseURLDynamic}/${year}/add_drop?L=${league_id}'>Drop Player</a>`;
              }
            } catch { }
            links += `<td style='text-align:center; text-indent:0;'>${addDrop}</td>`;
  
            // watchlist add/remove
            let wl = `<a href='${baseURLDynamic}/${year}/options?L=${league_id}&O=178&PID=${pid}'>Watchlist</a>`;
            qsa("#h3 a, h3 a", doc).some(a => {
              const txt = a.textContent || "";
              if (txt.includes("Remove")) { wl = `<a href='${baseURLDynamic}/${year}/options?L=${league_id}&O=178&PID=${pid}&ACTION=delete'>Watchlist Remove</a>`; return true; }
              if (txt.includes("Add"))    { wl = `<a href='${baseURLDynamic}/${year}/options?L=${league_id}&O=178&PID=${pid}&ACTION=add'>Watchlist Add</a>`; return true; }
              return false;
            });
            links += `<td style='text-align:center; text-indent:0;'>${wl}</td>`;
          }
          links += `<td style='text-align:center; text-indent:0;'><a href='${baseURLDynamic}/${year}/player_history?L=${league_id}&PLAYERS=${pid}'>Trans. History</a></td>`;
          links += "</tr></tbody></table>";
          setHTML(qs("#MFLPlayerPopupLinks"), links);
        }
  
        // parse bio table (biography.report)
        const bioRows = qsa(".biography.report tr", doc);
        const bio = {
          ht: "--", wt: "--", dob: "--", age: "--", college: "---",
          draftYear: "n/a", draftTeam: "", round: "", pick: "",
          jersey: "--", experience: "", experienceInt: 0, acquired: "", photo: photoHTML
        };
  
        // extras array (salary/contract/etc.)
        const extras = [];
        bioRows.forEach(tr => {
          const th = qs('th', tr)?.innerHTML?.trim() || "";
          const td = qs('td', tr)?.innerHTML?.trim() || "";
          switch (th) {
            case "Height/Weight:":
              bio.ht = td.slice(0, td.indexOf("/") - 1);
              bio.wt = td.slice(td.indexOf("/") + 2);
              break;
            case "DOB/Age:":
              bio.dob = td.slice(0, td.indexOf("/") - 1);
              bio.age = td.slice(td.indexOf("/") + 2);
              break;
            case "Jersey Num:":
              bio.jersey = parseInt(td) || "--";
              break;
            case "College:":
              bio.college = td || "---";
              break;
            case "Drafted:":
              if (td === "Undrafted") {
                bio.draftYear = "?"; bio.draftTeam = "FA"; bio.round = "n/a"; bio.pick = "n/a";
              } else {
                bio.draftYear = td.substring(0, td.indexOf("/") - 1);
                bio.draftTeam = td.substring(td.indexOf("/") + 2, td.indexOf("Round") - 3);
                bio.round = parseInt(td.substring(td.indexOf("Round") + 6)) || "";
                bio.pick  = parseInt(td.substring(td.indexOf("Pick") + 5))  || "";
              }
              break;
            case "Experience:":
              if (isNaN(parseInt(td))) { bio.experience = "(Exp.: Rookie)"; bio.experienceInt = 1; }
              else { bio.experience = `(Exp.: ${parseInt(td)} years)`; bio.experienceInt = parseInt(td); }
              break;
            case "Acquired:":
              bio.acquired = td;
              break;
            case "Salary:":
              try { extras.push(MFLPopupCustomRule?.("salary", "Salary", td, pid, name, team, pos, statusData, status, bio) ?? { title: "Salary", info: td }); }
              catch { extras.push({ title: "Salary", info: td }); }
              break;
            case "Contract Year:":
              try { extras.push(MFLPopupCustomRule?.("contract_year", "Contract Year", td, pid, name, team, pos, statusData, status, bio) ?? { title: "Contract Year", info: td }); }
              catch { extras.push({ title: "Contract Year", info: td }); }
              break;
            case "Contract Status:":
              try { extras.push(MFLPopupCustomRule?.("contract_status", "Contract Status", td, pid, name, team, pos, statusData, status, bio) ?? { title: "Contract Status", info: td }); }
              catch { extras.push({ title: "Contract Status", info: td }); }
              break;
            case "Contract Info:":
              try { extras.push(MFLPopupCustomRule?.("contract_info", "Contract Information", td, pid, name, team, pos, statusData, status, bio) ?? { title: "Contract Information", info: td }); }
              catch { extras.push({ title: "Contract Information", info: td }); }
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
        if (!MFLPopupOmitStatus) {
          hdr += `<tr class='eventablerow rows-${headerRows}'><td><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold'>Status:</span> ${status || ""}</td><td><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold'>Acquired:</span> ${bio.acquired}</td></tr>`;
          oddEvenA = "odd"; oddEvenB = "even";
        }
  
        if (extras.length === 1) {
          hdr += `<tr class='${oddEvenA}tablerow rows-${headerRows}'><td colspan='2'><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold' id='extras-0-title'>${extras[0].title}:</span> ${extras[0].info}</td></tr>`;
          if (!MFLPopupOmitStatus) hdr += `<tr class='${oddEvenB}tablerow rows-${headerRows}'><td colspan='2'> </td></tr>`;
        } else if (extras.length === 2) {
          hdr += `<tr class='${oddEvenA}tablerow rows-${headerRows}'><td colspan='2'><span class='MFLPlayerPopupHeaderTitle extras-0-title' style='font-weight:bold'>${extras[0].title}:</span> ${extras[0].info}</td></tr>`;
          hdr += `<tr class='${oddEvenB}tablerow rows-${headerRows}'><td colspan='2'><span class='MFLPlayerPopupHeaderTitle extras-1-title' style='font-weight:bold'>${extras[1].title}:</span> ${extras[1].info}</td></tr>`;
        } else if (extras.length === 3) {
          hdr += `<tr class='${oddEvenA}tablerow rows-${headerRows}'><td><span class='MFLPlayerPopupHeaderTitle extras-0-title' style='font-weight:bold'>${extras[0].title}:</span> ${extras[0].info}</td><td><span class='MFLPlayerPopupHeaderTitle extras-1-title' style='font-weight:bold'>${extras[1].title}:</span> ${extras[1].info}</td></tr>`;
          hdr += `<tr class='${oddEvenB}tablerow rows-${headerRows}'><td colspan='2'><span class='MFLPlayerPopupHeaderTitle extras-2-title' style='font-weight:bold'>${extras[2].title}:</span> ${extras[2].info}</td></tr>`;
        } else if (extras.length === 4) {
          hdr += `<tr class='${oddEvenA}tablerow rows-${headerRows}'><td><span class='MFLPlayerPopupHeaderTitle extras-0-title' style='font-weight:bold'>${extras[0].title}:</span> ${extras[0].info}</td><td><span class='MFLPlayerPopupHeaderTitle extras-1-title' style='font-weight:bold'>${extras[1].title}:</span> ${extras[1].info}</td></tr>`;
          hdr += `<tr class='${oddEvenB}tablerow rows-${headerRows}'><td><span class='MFLPlayerPopupHeaderTitle extras-2-title' style='font-weight:bold'>${extras[2].title}:</span> ${extras[2].info}</td><td><span class='MFLPlayerPopupHeaderTitle extras-3-title' style='font-weight:bold'>${extras[3].title}:</span> ${extras[3].info}</td></tr>`;
        }
        hdr += "</tbody></table>";
  
        setHTML(qs("#MFLPlayerPopupHeader"), hdr);
        setHTML(qs("#MFLPlayerPopupBio"), hdr);
  
        // stats history table
        let histOut = "<table class='popreport'><tbody>";
        let k = 0;
        qsa(".biohistory.report tr", doc).forEach(tr => {
          if (qs("form", tr)) return;
          if (tr.querySelectorAll("th").length > 0) histOut += `<tr>${tr.innerHTML}</tr>`;
          else if (tr.querySelectorAll("td").length > 0) {
            tr.querySelectorAll("td a").forEach(a => {
              const span = document.createElement("span"); span.innerHTML = a.innerHTML; a.replaceWith(span);
            });
            histOut += (k++ % 2 ? "<tr class='eventablerow'>" : "<tr class='oddtablerow'>") + tr.innerHTML + "</tr>";
          }
        });
        histOut += "</tbody></table>";
        setHTML(qs("#MFLPlayerPopupStatsHistory"), histOut);
  
        // season stats
        let statsOut = "<table class='popreport'><tbody>";
        let idx = 0, reduced = false;
        const statRows = qsa("#player_stats_table tr", doc);
        statRows.forEach(tr => {
          if (qs('form', tr)) return;
          if (tr.querySelectorAll('th').length > 0) {
            const ths = tr.querySelectorAll('th');
            if (parseInt(ths[0]?.getAttribute('colspan') || '0', 10) === 6) { ths[0].setAttribute('colspan', '4'); reduced = true; }
            else if (reduced) { ths[3]?.remove(); ths[3]?.remove(); }
            statsOut += `<tr>${tr.innerHTML}</tr>`;
          } else if (tr.querySelectorAll('td').length > 1) {
            tr.querySelectorAll('td a').forEach(a => { const s = document.createElement('span'); s.innerHTML = a.innerHTML; a.replaceWith(s); });
            // team name to abbrev if known
            const teamCell = tr.querySelector('td:nth-child(6)');
            if (teamCell) {
              const txt = teamCell.innerHTML;
              const teamName = txt.substring(0, txt.indexOf(" - "));
              if (teamName && MFLPlayerPopupTeamNames?.hasOwnProperty(teamName) && MFLPlayerPopupTeamNames[teamName].abbrev) {
                teamCell.innerHTML = txt.replace(teamName, `<span title='${teamName}'>${MFLPlayerPopupTeamNames[teamName].abbrev}</span>`);
              }
            }
            if (reduced) { tr.querySelector('td:nth-child(4)')?.remove(); tr.querySelector('td:nth-child(4)')?.remove(); }
            statsOut += (idx++ % 2 ? "<tr class='eventablerow'>" : "<tr class='oddtablerow'>") + tr.innerHTML + "</tr>";
          }
        });
        statsOut += "</tbody></table>";
        setHTML(qs("#MFLPlayerPopupStats"), statsOut);
  
        if (MFLPlayerPopupIncludeProjections) {
          setHTML(qs("#MFLPlayerPopupProjections"),
            "<div id='MFLPlayerPopupLoadingProjections' class='MFLPlayerPopupLoading' style='display:flex;align-items:center;justify-content:center;flex-direction:column'>Loading Content . . .<br><br><div class='MFLPlayerPopupLoader'></div></div>"
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
      .catch(()   => ({ playerTxt: txt, teamTxt: "" }));
  })
  .then(({ playerTxt, teamTxt }) => {
    // parse both, choose player or fallback to team
    let useHTML = playerTxt, warn = "";
    const playerDoc = parseHTML(playerTxt);
    const rows = qsa(".report tr", playerDoc);
    if (rows.length < 2 && teamTxt) {
      useHTML = teamTxt;
      warn = `<h3 class='warning'>No News for Player - Showing Recent News for ${team}</h3>`;
    }

    const doc = parseHTML(useHTML);
    let out = `<table class='popreport'>${warn}<tbody>`;
    let line = 0;

    qsa(".report tr", doc).forEach(tr => {
      if (line > 0) {
        const link = qs("td:nth-child(2) a", tr)?.getAttribute("href") || "";
        const id = `${pid}_${line}`;

        // unwrap all anchors
        tr.querySelectorAll("td a").forEach(a => {
          const span = document.createElement("span");
          span.innerHTML = a.innerHTML;
          a.replaceWith(span);
        });

        // body + "(More)" -> clickable
        let body = qs("td:nth-child(3)", tr)?.innerHTML || "";
        body = body.replace("Analysis:", "<br><br><b>Analysis:</b>");
        body = body.replace("(More)", `(<span class='MFLPlayerPopupMoreNews warning' onclick='MFLPlayerPopupMoreNews("${link}","${id}")'>More</span>)`);

        const headline = qs("td:nth-child(2)", tr)?.innerHTML || "";
        const ageAgo   = qs("td:nth-child(4)", tr)?.innerHTML || "";

        out += `<tr class='oddtablerow headline'><th>${headline}<span>${ageAgo} ago</span></th></tr>`;
        out += `<tr class='eventablerow article'><td id='${id}' style='position:relative'>${body}</td></tr>`;
      }
      line++;
    });
    out += "</tbody></table>";
    setHTML(qs("#MFLPlayerPopupNews"), out);
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





// ===============================
// Article → Populate
// ===============================
function MFLPlayerPopupArticlePopulate(headlineHTML, ageText, articleId) {
    show(qs("#MFLPlayerPopupContainer #MFLPlayerPopupLoading"));
    hide(qs("#MFLPlayerPopupLoaded"));
    hide(qs("#MFLPlayerPopupArticleLoaded"));
  
    const url = `${baseURLDynamic}/${year}/view_news_article?ID=${articleId}`;
    fetchText(url)
      .then(txt => {
        const doc = parseHTML(txt);
        // second row of .report is the article content (unwrapped)
        let i = 0, body = "";
        qsa(".report tr", doc).forEach(tr => {
          if (i === 1) {
            tr.querySelectorAll("td a").forEach(a => {
              const s = document.createElement("span");
              s.innerHTML = a.innerHTML;
              a.replaceWith(s);
            });
            body = qs("td", tr)?.innerHTML ?? "";
            if (body.includes("Article Link"))    body = body.substring(0, body.indexOf("Article Link") - 2);
            if (body.includes("Roto Pass from"))  body = body.substring(0, body.indexOf("Roto Pass from") - 3);
          }
          i++;
        });
  
        const out =
          "<table class='popreport'><tbody>" +
          `<tr class='oddtablerow headline'><th>${headlineHTML}</th></tr>` +
          `<tr class='eventablerow article'><td>${body}</td></tr>` +
          "</tbody></table>";
  
        setHTML(qs("#MFLPlayerPopupArticleLoaded"), out);
        MFLPlayerPopupInitiate(1);
      })
      .catch(err => console.error("Error fetching articleData:", err));
  }
  

// ===============================
// Notifications: entrypoint
// ===============================
function MFLPlayerPopupPopulateOnload(openImmediately) {
    if (openImmediately) {
        MFLPlayerPopupNotificationPreSetup();
        setTimeout(() => MFLPlayerPopupPopulateNotification(true), 200);
    } else {
        MFLPlayerPopupPopulateNotification(false);
    }
    hide(qs(".toggle_module_login"));
    hide(qs(".toggle_module_search"));
    hide(qs(".skinSelectorContainer"));
}

// ===============================
// Notifications: gather all sources
// ===============================
function MFLPlayerPopupPopulateNotification(openedViaIcon) {
    // reset
    MFLPlayerPopupTracker = [];
    MFLPlayerPopupOnloadContent[0] = "";
    MFLPlayerPopupOnloadContent[1] = "";
    MFLPlayerPopupOnloadContent[2] = "";
    MFLPlayerPopupOnloadContent[3] = "";
    MFLPlayerPopupOnloadContent[4] = "";

    show(qs("#MFLPlayerPopupContainer #MFLPlayerPopupLoading"));
    hide(qs("#MFLPlayerPopupLoaded"));
    hide(qs("#MFLPlayerPopupArticleLoaded"));

    // Trades
    const finishTrades = () => {
        MFLPlayerPopupTracker[0] = 1;
        MFLPlayerPopupNotificationSetup(openedViaIcon);
    };

    if (MFLPopupEnableTrade) {
        const url = `${baseURLDynamic}/${year}/home/${league_id}?MODULE=TRADES`;
        fetchText(url)
            .then(txt => {
                const doc = parseHTML(txt);
                const container = qs("#trades", doc);
                if (container) {
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
    } else {
        finishTrades();
    }

// Trade Polls
const finishPolls = () => { 
    MFLPlayerPopupTracker[1] = 1; 
    MFLPlayerPopupNotificationSetup(openedViaIcon); 
  };
  if (MFLPopupEnableTradePoll) {
    const url = `${baseURLDynamic}/${year}/options?L=${league_id}&O=69`;
    fetchText(url)
      .then(txt => {
        const doc = parseHTML(txt);
        qsa('.report[id^="poll_"]', doc).forEach(tbl => {
          const th0 = qs("th", tbl);
          if (th0 && th0.textContent.includes("gave up")) {
            MFLPlayerPopupOnloadContent[1] += 
              (tbl.parentElement?.parentElement?.outerHTML ?? tbl.outerHTML);
          }
        });
        finishPolls();
      })
      .catch(err => { 
        console.error("Error fetching pollData:", err); 
        finishPolls(); 
      });
  } else { 
    finishPolls(); 
  }
  
  // Reminders & Messages
  const finishRemMsg = () => { 
    MFLPlayerPopupNotificationSetup(openedViaIcon); 
  };
  const markRem = () => { MFLPlayerPopupTracker[2] = 1; };
  const markMsg = () => { MFLPlayerPopupTracker[3] = 1; };
  
  if (MFLPopupEnableReminders || MFLPopupEnableMessages) {
    const url = `${baseURLDynamic}/${year}/home/${league_id}`;
    fetchText(url)
      .then(txt => {
        const doc = parseHTML(txt);
  
        if (MFLPopupEnableReminders) {
          const r = qs("#league_reminders", doc);
          if (r) {
            MFLPlayerPopupOnloadContent[2] =
              `<table align='center' cellspacing='1' class='homepagemodule report'>${r.innerHTML}</table>`;
          }
          markRem();
        } else { 
          markRem(); 
        }
  
        if (MFLPopupEnableMessages) {
          qsa(".homepagemessage:not(#league_reminders)", doc).forEach(div => {
            MFLPlayerPopupOnloadContent[3] +=
              `<table align='center' cellspacing='1' class='homepagemodule report'>${div.innerHTML}</table>`;
          });
          markMsg();
        } else { 
          markMsg(); 
        }
  
        finishRemMsg();
      })
      .catch(err => { 
        console.log("Error:", err); 
        markRem(); 
        markMsg(); 
        finishRemMsg(); 
      });
  } else { 
    markRem(); 
    markMsg(); 
    finishRemMsg(); 
  }
  

// Commish Message
if (MFLPopupEnableCommishMessage && MFLPopupCommishMessage !== "") {
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
function MFLPlayerPopupNewsIcon() {
    // mark roster cells as player cells (kept from original intent)
    qsa('#body_lineup table.report tr a[href*="player?L="][href*="P="]').forEach(a => {
      a.closest('td')?.classList.add('player');
    });
  
    qsa('a[href*="player?L="][href*="P="]').forEach(a => {
      // exclude popup internal/known areas
      if (a.closest('#MFLPlayerPopupLinks') || a.closest('#player_stats_table') || a.closest('.biohistory')) return;
  
      const href = a.getAttribute('href') || "";
      const pid  = href.slice(href.indexOf("P=") + 2);
      let alt = "news", icon = MFLPlayerPopupNewsOld, style = "";
  
      if (typeof newsBreaker === "undefined") {
        alt = "no news"; icon = MFLPlayerPopupNewsNone; style = "cursor:pointer;pointer-events:all;";
      } else if (newsBreaker["pid_" + pid] === 0) {
        alt = "new news"; icon = MFLPlayerPopupNewsNew; style = "cursor:pointer;pointer-events:all;";
      } else if (newsBreaker["pid_" + pid] > 0) {
        alt = "recent news"; icon = MFLPlayerPopupNewsOld; style = "cursor:pointer;pointer-events:all;";
      }
  
      if (!a.querySelector(".playerPopupIcon")) {
        const img = document.createElement('img');
        img.src = icon; img.alt = alt; img.title = alt; img.className = "playerPopupIcon"; img.style = style;
        img.addEventListener('click', ev => { ev.preventDefault(); MFLPlayerPopupSetup(pid, a.innerHTML); });
        a.appendChild(img);
  
        // also click on the anchor opens popup
        a.addEventListener('click', ev => { ev.preventDefault(); MFLPlayerPopupSetup(pid, a.innerHTML); });
      }
    });
  }
  

// ===============================
// Article icons on headlines
// ===============================
function MFLPlayerPopupArticleIcon() {
    qsa("td.headline a").forEach(a => {
      const headline = a.innerHTML
        .replace(/[\\"']/g, "\\$&")   // escape quotes
        .replace(/\u0000/g, "\\0");   // escape null chars
  
      const timestamp = a.closest("tr")?.querySelector("td.timestamp")?.innerHTML || "";
      const href = a.getAttribute("href") || "";
      const id   = href.slice(href.indexOf("ID=") + 3);
  
      if (!a.parentElement.querySelector(".playerPopupIcon")) {
        const img = document.createElement("img");
        img.src = MFLPlayerPopupNewsOld;
        img.className = "playerPopupIcon";
        img.style = "cursor:pointer;pointer-events:all;";
        img.addEventListener("click", () => MFLPlayerPopupArticleSetup(headline, timestamp, id));
        a.after(img);
  
        a.addEventListener("click", ev => {
          ev.preventDefault();
          MFLPlayerPopupArticleSetup(a.innerHTML, timestamp, id);
        });
      }
    });
  }
  


// ===============================
// Popup state machine
// ===============================
function MFLPlayerPopupInitiate(mode) {
    if (mode === 0 && MFLPlayerPopupTracker[0] === 1 && MFLPlayerPopupTracker[1] === 1) {
        show(qs("#MFLPlayerPopupNews"));
        qs("#MFLPlayerPopupTabLinksNews")?.classList.add("active");
        hide(qs("#MFLPlayerPopupContainer #MFLPlayerPopupLoading"));
        hide(qs("#MFLPlayerPopupArticleLoaded"));
        show(qs("#MFLPlayerPopupLoaded"));
        ["#MFLPlayerPopupNews", "#MFLPlayerPopupBio", "#MFLPlayerPopupStats", "#MFLPlayerPopupProjections", "#MFLPlayerPopupStatsHistory"]
            .forEach(sel => { const el = qs(sel); if (el) el.scrollTop = 0; });
        qs("#MFLPlayerPopupNews")?.classList.add("active_div_tab_scroll");
    }
    if (mode === 1) {
        hide(qs("#MFLPlayerPopupContainer #MFLPlayerPopupLoading"));
        hide(qs("#MFLPlayerPopupLoaded"));
        show(qs("#MFLPlayerPopupArticleLoaded"));
    }
    if (mode === 2) {
        hide(qs("#MFLPlayerPopupContainer #MFLPlayerPopupLoading"));
        show(qs("#MFLPlayerPopupLoaded"));
        hide(qs("#MFLPlayerPopupArticleLoaded"));
        setCookie(`MFLPlayerPopup_${year}_${league_id}_${franchise_id}`, "1", 1);
    }
}

// ===============================
// Bootstrapping icons
// ===============================
function addNewsIcon(attempt) {
    if (typeof newsBreaker !== "undefined") {
        if (MFLPopupEnablePlayerNews) MFLPlayerPopupNewsIcon();
        if (MFLPopupEnableArticle) MFLPlayerPopupArticleIcon();
    } else if (attempt < 5) {
        setTimeout(() => addNewsIcon(attempt + 1), 100);
    }
}

// delegated click on roster links (replaces jQ .on)
document.addEventListener("click", e => {
    const a = e.target.closest('#roster_column_middle a[href*="player?L="][href*="P="]');
    if (!a) return;
    e.preventDefault();
    const pid = (a.getAttribute('href') || "").slice((a.getAttribute('href') || "").indexOf("P=") + 2);
    MFLPlayerPopupSetup(pid, a.innerHTML.replace(/[\\"']/g, "\\").replace(/\u0000/g, "\\0"));
});

// kick off icons (match original)
setTimeout(() => addNewsIcon(5), 100);
document.addEventListener("DOMContentLoaded", () => addNewsIcon(0));

// optional style tweak if omit status
if (window.MFLPopupOmitStatus) {
    const st = document.createElement('style');
    st.textContent = "#MFLPlayerPopupStats th:nth-child(4), #MFLPlayerPopupStats td:nth-child(4) {display:none}";
    document.head.appendChild(st);
}


// ===============================
// Login / Search toggles (vanilla)
// ===============================
if (window.ShowMFLlogin) {
    window.toggleLogin = function () {
      hide(qs(".skinSelectorContainer"));
      const box = qs(".toggle_module_login");
      const other = qs(".toggle_module_search");
      if (!box) return;
      if (getComputedStyle(box).display === "none") { show(box); hide(other); } else hide(box);
    };
    const css = document.createElement('style');
    css.textContent = `.pageheader .welcome{display:none}.toggle_login_content td b{display:block}.toggle_login_content td{text-align:center;font-size:90%}.toggle_module_login{position:absolute;z-index:999999;width:18.75rem;margin-top:.313rem;margin-left:-5.938rem;}`;
    document.head.appendChild(css);
    const css2 = document.createElement('style');
    css2.textContent = "li.notification-icon-login{display:inline-block!important}";
    document.head.appendChild(css2);
    qs("#icon-wrapper-mobile")?.style.setProperty('display', '');
    qs("#icon-wrapper")?.style.setProperty('display', '');
    const welcome = document.querySelector(".pageheader .welcome");
    if (welcome) {
      const target = qs(".toggle_login_content .oddtablerow");
      if (target) target.appendChild(welcome);
      qsa(".toggle_login_content .welcome small").forEach(n => n.remove()); // $$ → qsa
      welcome.removeAttribute("class");
    }
  }
  
  if (window.ShowMFLsearch) {
    window.toggleSearch = function () {
      hide(qs(".skinSelectorContainer"));
      const box = qs(".toggle_module_search");
      const other = qs(".toggle_module_login");
      if (!box) return;
      if (getComputedStyle(box).display === "none") { show(box); hide(other); } else hide(box);
    };
    const css = document.createElement('style');
    css.textContent = `.toggle_search_content td{text-align:center;font-size:90%}.toggle_search_content input[type='submit']{margin:0 .313rem;border-radius:.188rem;padding:.188rem}.toggle_search_content input{position:relative;display:inline}.toggle_module_search{position:absolute;z-index:999999;width:18.75rem;margin-top:.313rem;margin-left:-8.125rem}.toggle_search_content td,.toggle_search_content form,.toggle_search_content input{vertical-align:middle;}`;
    document.head.appendChild(css);
    const css2 = document.createElement('style');
    css2.textContent = "li.notification-icon-search{display:inline-block!important}";
    document.head.appendChild(css2);
    qs("#icon-wrapper-mobile")?.style.setProperty('display', '');
    qs("#icon-wrapper")?.style.setProperty('display', '');
  }
  

// ===============================
// Trigger (runs once when ready)
// ===============================
function triggerPlayerPopup() {
    window.triggerPlayerPopup_ran = true;
  
    if (MFLPopupEnableReminders) qsa("#body_home .homepagemessage").forEach(el => hide(el)); // $$ → qsa
    if (MFLPopupEnableMessages) { const el = qs("#league_reminders"); if (el) hide(el); }
  
    MFLPlayerPopupSetupTeamNames?.();
  
    if (!qs("#MFLPlayerPopupContainer")) MFLPlayerPopupCreateContainer?.();
  
    // auto notifications (only once per session via cookie)
    if (typeof franchise_id !== "undefined" &&
        (MFLPopupEnableTrade || MFLPopupEnableTradePoll || MFLPopupEnableReminders || MFLPopupEnableMessages || (MFLPopupEnableCommishMessage && MFLPopupCommishMessage !== "")) &&
        MFLPopupEnableAutoNotification &&
        !getCookie(`MFLPlayerPopup_${year}_${league_id}_${franchise_id}`)
    ) {
      MFLPlayerPopupPopulateOnload(false);
    }
  
    // Update extra titles by scraping roster module
    const url = `${baseURLDynamic}/${year}/home/${league_id}?MODULE=ROSTER`;
    fetchText(url)
      .then(txt => {
        const doc = parseHTML(txt);
        for (const key in MFLPlayerPopupExtraTitles) {
          if (!Object.prototype.hasOwnProperty.call(MFLPlayerPopupExtraTitles, key)) continue;
          const th = qs(`th.${key}`, doc);
          if (th) MFLPlayerPopupExtraTitles[key] = th.textContent.trim();
        }
      })
      .catch(err => console.error("Error fetching extrasTitleData:", err));
  }
  





// ---------- boot/sentinels ----------
function playerPopupListenerCheck() {
    triggerPlayerPopup_count++;
    if (typeof reportFiveMinuteFullyLoaded !== "undefined" && reportFiveMinuteFullyLoaded) {
      clearInterval(playerPopupListener);
      if (!triggerPlayerPopup_ran) triggerPlayerPopup();
    }
    if (triggerPlayerPopup_count > 50) {
      clearInterval(playerPopupListener);
      console.log("Stop trying Player Popup after 5 seconds");
    }
  }
  if (typeof triggerPlayerPopup_ran === "undefined") window.triggerPlayerPopup_ran = false;
  if (typeof triggerPlayerPopup_count === "undefined") window.triggerPlayerPopup_count = 0;
  if (typeof playerPopupListener === "undefined") window.playerPopupListener = setInterval(playerPopupListenerCheck, 100);
  
  // ---------- mobile centering + notify icon ----------
  if (LoginSearchMobileCSS && window.innerWidth < 768) {
    const toggle_center = (els) => {
      els.forEach(el => {
        el.style.position = "absolute";
        const left = Math.max(0, (window.innerWidth - el.offsetWidth) / 2 + window.scrollX);
        el.style.left = `${left}px`;
      });
    };
    toggle_center(qsa('.toggle_module_search,.toggle_module_login'));
    addStyle(`.toggle_module_search,.toggle_module_login{margin-left:-8.125rem;margin-top:0.875rem}#skinSelectorContainer{margin-top:0.875rem}`);
  }
  if (typeof franchise_id !== "undefined" &&
      (MFLPopupEnableTrade || MFLPopupEnableTradePoll || MFLPopupEnableReminders || MFLPopupEnableMessages || (MFLPopupEnableCommishMessage && MFLPopupCommishMessage !== ""))) {
    addStyle(`li.notification-icon-popup{display:inline-block!important}`);
    qs("#icon-wrapper-mobile") && (qs("#icon-wrapper-mobile").style.display = "");
    qs("#icon-wrapper") && (qs("#icon-wrapper").style.display = "");
  }
  
  // ---------- Score Details / NFL Details scaffolding ----------
  if (MFLScoreDetailsPopup) {
    if (typeof detailsOverlay === "undefined") window.detailsOverlay = "rgba(0,0,0,.7)";
    if (typeof detailsWrapBG === "undefined") window.detailsWrapBG = "#fff";
    if (typeof detailsWrapBorder === "undefined") window.detailsWrapBorder = "#000";
    if (typeof detailsWrapBorWidh === "undefined") window.detailsWrapBorWidh = "0";
    if (typeof detailsWrapBoxShdw === "undefined") window.detailsWrapBoxShdw = "0 0 0.188rem 0.188rem rgba(0,0,0,.1)";
    if (typeof detailsWrapPadding === "undefined") window.detailsWrapPadding = "0.625rem";
    if (typeof detailsWrapRadius === "undefined") window.detailsWrapRadius = "0.188rem";
  
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
      const toUnwrap = qsa('#body_options_08 td.points.tot a[href*="player?L"][href*="P="], #body_top td.points.tot a[href*="player?L"][href*="P="]');
      unwrapAll(toUnwrap);
    });
  
    // close when overlay clicked
    document.body.addEventListener('click', (ev) => {
      if (!ev.target.classList.contains('scoredetailsWrap')) return;
      setHTML(qs("#ScoreDetails tbody"), "");
      setHTML(qs("#leftTeam"), "");
      setHTML(qs("#rightTeam"), "");
      hide(qs(".scoredetailsWrap"));
      hide(qs("#ScoreDetails"));
      hide(qs("#ScoreNFLDetails"));
      const tt = qsa("#teamToggles input"); tt.forEach(i => i.value = "");
      const fs = qs("#fullSeasonPts"); fs && fs.remove();
      qs("#ScoreNFLDetails table")?.classList.remove("box_details_table");
      qs("#ScoreDetails table")?.classList.remove("scoring_details_table", "overview_details_table");
      qsa("a").forEach(a => a.classList.remove("dblClicks"));
      try { bodyScrollLock.clearAllBodyScrollLocks(); } catch (_) { }
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
  
      qsa(".detailsReportWrap table").forEach(t => t.classList.add("report"));
      const href = a.getAttribute('href');
      const sub = href.substring(href.indexOf("detailed?") - 1);
      const url = `${baseURLDynamic}/${year}/${sub}&PRINTER=1`;
      const isPastYear = (href.substring(href.indexOf("YEAR=") + 5) < year);
  
      try {
        const html = await fetchText(url);
        const doc = parseHTML(html);
        const tbody = qs(".report tbody", doc);
        qs("#ScoreDetails caption span").textContent = "Scoring Breakdown";
        const full = qs("#fullSeasonPts"); full && full.remove();
        qs("#ScoreDetails tbody").replaceWith(tbody);
        qs("#ScoreNFLDetails table")?.classList.remove("box_details_table");
        const sdTable = qs("#ScoreDetails table");
        sdTable?.classList.remove("overview_details_table");
        sdTable?.classList.add("scoring_details_table");
  
        if (isPastYear) {
          qsa('a[href*="&MATCHUP="]', qs("#ScoreDetails")).forEach(el => el.remove());
          const hideCell = qs("#ScoreDetails tr.oddtablerow:nth-child(2) td:nth-child(1)");
          if (hideCell) {
            hideCell.style.visibility = "hidden";
            const b = hideCell.querySelector('b'); b && (b.style.visibility = "visible");
          }
        }
        // strip PRINTER from position links
        replaceAllIn(qs("#ScoreDetails"),
          '#ScoreDetails td b a[class*="position_"]',
          (node) => node.setAttribute('href', node.getAttribute('href').replace('&PRINTER=1', '')));
  
        qsa('a[href*="&MATCHUP=%2CFA"],a[href*="MATCHUP=FA%2C"]', qs("#ScoreDetails")).forEach(el => el.remove());
  
        try { MFLPlayerPopupNewsIcon("ScoreDetails"); } catch (_) { }
        show(qs(".scoredetailsWrap")); show(qs("#ScoreDetails"));
        try { bodyScrollLock.disableBodyScroll(qs("#ScoreDetails")); } catch (_) { }
        setHTML(qs("#leftTeam"), ""); setHTML(qs("#rightTeam"), "");
        qsa("#teamToggles input").forEach(i => i.value = "");
        hide(qs("#ScoreNFLDetails"));
  
        // close button
        const closeBtn = qs("#ScoreDetails #MFLPlayerPopupClose");
        if (closeBtn) {
          closeBtn.onclick = () => {
            setHTML(qs("#ScoreDetails tbody"), "");
            hide(qs(".scoredetailsWrap")); hide(qs("#ScoreDetails"));
            try { bodyScrollLock.clearAllBodyScrollLocks(); } catch (_) { }
            qs("#ScoreNFLDetails table")?.classList.remove("box_details_table");
            qs("#ScoreDetails table")?.classList.remove("scoring_details_table", "overview_details_table");
            qsa("a").forEach(a => a.classList.remove("dblClicks"));
          };
        }
      } catch (err) { console.error("Error:", err); }
    });
    



// ---------- open matchup (two-column) breakdown ----------
document.body.addEventListener('click', async (ev) => {
    const a = ev.target.closest('.report a[href*="MATCHUP"]');
    if (!a) return;
    ev.preventDefault();
  
    const fs = qs("#fullSeasonPts"); fs && fs.remove();
    qsa(".detailsReportWrap table").forEach(t => t.classList.add("report")); // $$ → qsa
    const url = `${a.getAttribute('href')}&PRINTER=1`;
    qs("#ScoreNFLDetails caption span").textContent = "Detailed Results";
  
    try {
      const html = await fetchText(url);
      const doc = parseHTML(html);
  
      const left    = qsa("td.two_column_layout:nth-of-type(1) .report tbody:nth-child(2)", doc)?.[0]?.childNodes || [];
      const right   = qsa("td.two_column_layout:nth-of-type(2) .report tbody:nth-child(2)", doc)?.[0]?.childNodes || [];
      const leftCap = qs("td.two_column_layout:nth-of-type(1) .report caption:nth-child(1) span", doc)?.textContent || "";
      const rightCap= qs("td.two_column_layout:nth-of-type(2) .report caption:nth-child(1) span", doc)?.textContent || "";
  
      qs("#ScoreDetails table")?.classList.remove("scoring_details_table", "overview_details_table");
      qs("#ScoreNFLDetails table")?.classList.add("box_details_table");
  
      setHTML(qs("#leftTeam"), ""); 
      setHTML(qs("#rightTeam"), "");
      qs("#leftTeam")?.append(...left);
      qs("#rightTeam")?.append(...right);
  
      // strip PRINTER
      replaceAllIn(qs("#ScoreNFLDetails"),
        '#ScoreNFLDetails td a[class*="position_"]',
        (node) => node.setAttribute('href', node.getAttribute('href').replace('&PRINTER=1', ''))
      );
  
      qs("#teamToggles .leftT input").value  = leftCap;
      qs("#teamToggles .rightT input").value = rightCap;
  
      qsa('a[href*="&MATCHUP=%2CFA"],a[href*="MATCHUP=FA%2C"]', qs("#ScoreNFLDetails")).forEach(el => el.remove()); // $$ → qsa
  
      setHTML(qs("#ScoreDetails tbody"), "");
      hide(qs("#ScoreDetails")); 
      show(qs(".scoredetailsWrap")); 
      show(qs("#ScoreNFLDetails"));
      try { bodyScrollLock.disableBodyScroll(qs("#ScoreNFLDetails")); } catch (_) {}
  
      qs(".leftT")?.addEventListener('click', () => {
        qs(".leftT").style.opacity = "1"; 
        qs(".rightT").style.opacity = ".5";
        show(qs("#leftTeam")); 
        hide(qs("#rightTeam"));
      });
      qs(".rightT")?.addEventListener('click', () => {
        qs(".rightT").style.opacity = "1"; 
        qs(".leftT").style.opacity = ".5";
        show(qs("#rightTeam")); 
        hide(qs("#leftTeam"));
      });
  
      const closeBtn = qs("#ScoreNFLDetails #MFLPlayerPopupClose");
      if (closeBtn) {
        closeBtn.onclick = () => {
          setHTML(qs("#leftTeam"), ""); 
          setHTML(qs("#rightTeam"), "");
          qsa("#teamToggles input").forEach(i => i.value = ""); // $$ → qsa
          hide(qs(".scoredetailsWrap")); 
          hide(qs("#ScoreNFLDetails"));
          try { bodyScrollLock.clearAllBodyScrollLocks(); } catch (_) {}
          qs("#ScoreNFLDetails table")?.classList.remove("box_details_table");
          qs("#ScoreDetails table")?.classList.remove("scoring_details_table", "overview_details_table");
          qsa("a").forEach(a => a.classList.remove("dblClicks")); // $$ → qsa
        };
      }
  
      try {
        MFLPlayerPopupNewsIcon("ScoreDetails");
        MFLPlayerPopupNewsIcon("ScoreNFLDetails");
      } catch (_) {}
    } catch (err) { console.error("Error:", err); }
  });
  
  
  // ---------- Points summary from Options O=08 ----------
  document.body.addEventListener('click', async (ev) => {
    const a = ev.target.closest('.report a[href*="options?L="][href*="O=08"][href*="PLAYER_ID="]:not(#body_options_08 a):not([class*="dblClicks"])');
    if (!a) return;
    ev.preventDefault();
  
    a.classList.add("dblClicks");
    const fs = qs("#fullSeasonPts"); fs && fs.remove();
    qsa(".detailsReportWrap table").forEach(t => t.classList.add("report")); // $$ → qsa
    qs("#ScoreDetails tbody").insertAdjacentHTML('afterend',
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
  
      qs("#ScoreDetails caption span").innerHTML = qs(".report tbody td.player a", doc)?.innerHTML || "";
  
      // move totals/avg
      const ytd = qs(".report td.points.tot", doc); 
      if (ytd) qs(".dYTDpoints")?.append(ytd.cloneNode(true).childNodes[0] || "");
      const avg = qs(".report td.points.avg", doc); 
      if (avg) qs(".dAVGpoints")?.append(avg.cloneNode(true).childNodes[0] || "");
  
      // build weekly rows
      const headerLink = qs('table.report tr:nth-child(2) th:nth-child(5) a', doc);
      let aHtml = "";
      const thLinks   = qsa('.report tbody th a[href*="SORT"]:not([href*="SORT=NAME"]):not([href*="SORT=TOT"]):not([href*="SORT=AVG"]):not([href*="SORT=SALARY"]):not([href*="SORT=YEAR"])', doc);
      const tlen      = thLinks.length;
      const href      = headerLink?.getAttribute('href') || "";
      const startSort = parseInt(href.slice(href.indexOf("SORT=") + 5, href.indexOf("SORT=") + 7)) || 0;
  
      for (let i = 5; i < tlen + 5; i++) {
        if (i % 2 === 1) aHtml += `<tr class="dRow">`;
        const weekNum  = (startSort + i - 5);
        const cellHTML = qs(`table.report td:nth-child(${i})`, doc)?.innerHTML ?? "";
        aHtml += `<td style="text-align:right!important">Week ${weekNum}:</td>`;
        aHtml += `<td style="text-align:left!important">${cellHTML}</td>`;
        if (i % 2 === 0) aHtml += `</tr>`;
      }
      qs("#fullSeasonPts").insertAdjacentHTML('beforeend', aHtml);
  
      // cleanup table styles
      qsa(`#ScoreDetails th a`).forEach(x => x.removeAttribute('href'));
      qsa('a[href*="&MATCHUP=%2CFA"],a[href*="MATCHUP=FA%2C"]', qs("#ScoreDetails")).forEach(x => x.remove()); // $$ → qsa
      qs("#ScoreNFLDetails table")?.classList.remove("box_details_table");
      const sdt = qs("#ScoreDetails table");
      sdt?.classList.remove("scoring_details_table");
      sdt?.classList.add("overview_details_table");
  
      try { MFLPlayerPopupNewsIcon("ScoreDetails"); } catch (_) {}
  
      // unwrap YTD/AVG anchors
      qsa(`#ScoreDetails td.dYTDpoints a, #ScoreDetails td.dAVGpoints a`).forEach(anchor => {
        const frag = document.createDocumentFragment();
        while (anchor.firstChild) frag.appendChild(anchor.firstChild);
        anchor.replaceWith(frag);
      });
  
      show(qs(".scoredetailsWrap")); show(qs("#ScoreDetails"));
      setHTML(qs("#leftTeam"), ""); setHTML(qs("#rightTeam"), "");
      qsa("#teamToggles input").forEach(i => i.value = "");
      hide(qs("#ScoreNFLDetails")); hide(qs("#TeamDetails")); hide(qs(".teamdetailsWrap"));
  
      try { bodyScrollLock.disableBodyScroll(qs("#ScoreDetails")); } catch (_) {}
  
      const closeBtn = qs("#ScoreDetails #MFLPlayerPopupClose");
      if (closeBtn) {
        closeBtn.onclick = () => {
          const fs2 = qs("#fullSeasonPts"); fs2 && fs2.remove();
          setHTML(qs("#ScoreDetails tbody"), "");
          hide(qs(".scoredetailsWrap")); hide(qs("#ScoreDetails"));
          try { bodyScrollLock.clearAllBodyScrollLocks(); } catch (_) {}
          qs("#ScoreNFLDetails table")?.classList.remove("box_details_table");
          qs("#ScoreDetails table")?.classList.remove("scoring_details_table", "overview_details_table");
          qsa("a").forEach(a => a.classList.remove("dblClicks"));
        };
      }
  
      // text replacements
      qsa("#fullSeasonPts td").forEach(td => {
        td.innerHTML = td.innerHTML.replace(/&nbsp;/g, "0").replace(/B/g, "Bye");
      });
  
      // strip images from YTD
      qsa("td.dYTDpoints img").forEach(img => img.remove());
  
      // zebra rows + fill last row
      qsa("#fullSeasonPts tr.dRow").forEach((tr, idx) => tr.classList.add(idx % 2 ? "oddtablerow" : "eventablerow"));
      const last = qs("#fullSeasonPts tr:last-child");
      if (last && last.children.length < 3) { last.insertAdjacentHTML('beforeend', "<td></td><td></td>"); }
  
    } catch (err) { console.error("Error:", err); }
  });
  }  




if (MFLFranchisePopup) {
    // defaults
    if (typeof load_playerIcons === "undefined") window.load_playerIcons = false;
    if (typeof removeSchedule === "undefined") window.removeSchedule = false;
    if (typeof removeWatchlist === "undefined") window.removeWatchlist = false;
    if (typeof removeLineup === "undefined") window.removeLineup = false;
    if (typeof hideLinks === "undefined") window.hideLinks = false;
    if (typeof commishTeam === "undefined") window.commishTeam = "0001";

    // ------- Weather popup (no jQuery) -------
    window.lu_popup_weatherPopup = function (teamAbbrev, wxUrl) {
        if (typeof weather === "undefined") { alert("Weather for this game is not defined"); return false; }
        if (!weather[teamAbbrev] || !weather[teamAbbrev].location) { alert("Weather for this game is not defined"); return false; }

        addStyle(`
          /* styles unchanged */
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
          <!-- current + kickoff conditions markup (unchanged) -->
          <div class="weather-more-link"><a onclick="window.open('${wxUrl}', '_blank')">More at Weather.com</a></div>
        </div>`;

        modal.innerHTML = html;
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        try { bodyScrollLock.disableBodyScroll(overlay); } catch (_) { }

        const teamWrap = qs(".teamdetailsWrap");
        const teamPanel = qs("#TeamDetails");
        if (teamWrap) hide(teamWrap);
        if (teamPanel) hide(teamPanel);

        overlay.addEventListener("click", (ev) => {
            if (ev.target === overlay || ev.target.classList.contains("as_close_btn")) {
                overlay.remove();
                qsa(".modal").forEach(m => m.style.display = "none");
                qsa(".modal-content").forEach(m => m.style.display = "none");
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

// --- Remove tabs based on flags (fix IDs) ---
if (removeSchedule) {
    qs("#franchiseScheduleTab")?.remove();
    qsa(".team_schedule_table").forEach(el => el.remove());
  }
  if (removeWatchlist) {
    qs("#franchiseWatchTab")?.remove();
    qsa(".team_watch_table").forEach(el => el.remove());
  }
  if (removeLineup) {
    qs("#franchiseLineupTab")?.remove();
    qsa(".team_lineup_table").forEach(el => el.remove());
  }
if (hideLinks) {
qs("#teamLinks #propose_trade_link")?.remove();
qs("#teamLinks #trade_bait_link")?.remove();
qs("#teamLinks #transactions_link")?.remove();
}

// --- Overlay close (remove both dblClick variants) ---
document.body.addEventListener('click', (ev) => {
    if (!ev.target.classList.contains('teamdetailsWrap')) return;
    qsa("#TeamDetails .TeamData").forEach(t => t.innerHTML = "");
    hide(qs(".teamdetailsWrap"));
    hide(qs("#TeamDetails"));
    qs("#MFLPlayerPopupContainer #MFLPlayerPopupClose")?.classList.remove("teamdetails_activated");
    qs("#MFLPlayerPopupOverlay")?.classList.remove("teamdetails_activated");
    qs("#ScoreDetails #MFLPlayerPopupClose")?.classList.remove("scoredetails_activated");
    qs("#ScoreNFLDetails #MFLPlayerPopupClose")?.classList.remove("scoredetails_activated");
    qs(".scoredetailsWrap")?.classList.remove("scoredetails_activated");
    qsa("a").forEach(a => { a.classList.remove("dblClick"); a.classList.remove("dblClicks"); });
    try { bodyScrollLock.clearAllBodyScrollLocks(); } catch (_) { }
  });
  

   // Open overlay if already flagged active
document.body.addEventListener('click', (ev) => {
    if (!ev.target.closest('.teamdetails_activated, .scoredetails_activated')) return;
    show(qs("#TeamDetails"));
    show(qs(".teamdetailsWrap"));
    try { bodyScrollLock.disableBodyScroll(qs("#TeamDetails")); } catch (_) { }
  });
  
 // --- Tab switching inside TeamDetails (fix IDs) ---
document.body.addEventListener('click', (ev) => {
    if (ev.target.closest('#TeamDetails li#franchiseRostersTab')) {
      switchTab(".team_roster_table");
      qs("#TeamDetails li#franchiseRostersTab a")?.classList.add("active");
    }
  });
  document.body.addEventListener('click', (ev) => {
    if (ev.target.closest('#TeamDetails li#franchiseBioTab')) {
      switchTab(".team_bio_table");
      qs("#TeamDetails li#franchiseBioTab a")?.classList.add("active");
    }
  });
  document.body.addEventListener('click', (ev) => {
    if (ev.target.closest('#TeamDetails li#franchiseScheduleTab')) {
      switchTab(".team_schedule_table");
      qs("#TeamDetails li#franchiseScheduleTab a")?.classList.add("active");
    }
  });
  document.body.addEventListener('click', (ev) => {
    if (ev.target.closest('#TeamDetails li#franchiseAwardsTab')) {
      switchTab(".team_awards_table");
      qs("#TeamDetails li#franchiseAwardsTab a")?.classList.add("active");
    }
  });
  
 // --- Close X (remove both dblClick variants) ---
document.body.addEventListener('click', (ev) => {
    if (ev.target.id !== "MFLPlayerPopupClose") return;
    qsa("#TeamDetails .TeamData").forEach(t => t.innerHTML = "");
    hide(qs(".teamdetailsWrap"));
    hide(qs("#TeamDetails"));
    try { bodyScrollLock.clearAllBodyScrollLocks(); } catch (_) { }
    qs("#MFLPlayerPopupContainer #MFLPlayerPopupClose")?.classList.remove("teamdetails_activated");
    qs("#MFLPlayerPopupOverlay")?.classList.remove("teamdetails_activated");
    qs("#ScoreDetails #MFLPlayerPopupClose")?.classList.remove("scoredetails_activated");
    qs("#ScoreNFLDetails #MFLPlayerPopupClose")?.classList.remove("scoredetails_activated");
    qs(".scoredetailsWrap")?.classList.remove("scoredetails_activated");
    qsa("a").forEach(a => { a.classList.remove("dblClick"); a.classList.remove("dblClicks"); });
  });
  
  // --- Default active tab (fix ID) ---
  qsa("#TeamDetails li.MFLPlayerPopupPlayerTabs a").forEach(a => a.classList.remove("active"));
  qs("#TeamDetails #franchiseBioTab a")?.classList.add("active");
  
  // --- Lineup tab click (fix ID) ---
  document.body.addEventListener('click', (ev) => {
    if (!ev.target.closest('#TeamDetails li#franchiseLineupTab')) return;
    switchTab(".team_lineup_table");
    qs("#TeamDetails li#franchiseLineupTab a")?.classList.add("active");
    // (rest unchanged)
  });
  
  
  // ------------------ OPEN FRANCHISE POPUP (main entry) ------------------
  function openFranchisePopup(hrefEl) {
    // mark activated (so overlay clicks reopen)
    qs("#MFLPlayerPopupContainer #MFLPlayerPopupClose")?.classList.add("teamdetails_activated");
    qs("#MFLPlayerPopupOverlay")?.classList.add("teamdetails_activated");
    qs("#ScoreDetails #MFLPlayerPopupClose")?.classList.add("scoredetails_activated");
    qs("#ScoreNFLDetails #MFLPlayerPopupClose")?.classList.add("scoredetails_activated");
  
    const href = hrefEl.getAttribute('href');
    let fid = href.slice(href.indexOf("F=") + 2);
    fid = fid.includes("&") ? fid.slice(0, fid.indexOf("&")) : fid;
  
    // owner tab visibility + links
    const parentHref = hrefEl.parentElement?.querySelector("a")?.getAttribute("href") || href;
    const ownerFid = parentHref.slice(parentHref.indexOf("F=") + 2, parentHref.indexOf("F=") + 6);
  
    if (typeof franchise_id === "undefined") {
      hide(qs("#ownerTabview"));
      qs("#teamLinks #propose_trade_link")?.remove();
      qs("#teamLinks #trade_bait_link")?.remove();
    } else if (ownerFid === franchise_id || (franchise_id === "0000" && ownerFid === commishTeam)) {
      qs("#ownerTabview")?.setAttribute("style", "display:table-row-group!important");
      qs("#teamLinks #propose_trade_link").innerHTML =
        `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=05">Propose A Trade</a>`;
    } else if (franchise_id === "0000") {
      qs("#ownerTabview")?.setAttribute("style", "display:table-row-group!important");
      qs("#teamLinks #propose_trade_link").innerHTML =
        `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&FRANCHISE=${commishTeam}&OPTION=05&FRANCHISE=${fid}">Offer A Trade</a>`;
    } else {
      qs("#ownerTabview")?.setAttribute("style", "display:none!important");
      qs("#teamLinks #propose_trade_link").innerHTML =
        `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&FRANCHISE=${franchise_id}&OPTION=05&FRANCHISE=${fid}">Offer A Trade</a>`;
    }
  
    qs("#teamLinks #full_profile_link").innerHTML =
      `<a class="pop_profile" href="${baseURLDynamic}/${year}/options?L=${league_id}&F=${fid}&O=01">Full Profile</a>`;
    qs("#teamLinks #trade_bait_link").innerHTML =
      `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=133">Trade Bait</a>`;
    qs("#teamLinks #transactions_link").innerHTML =
      `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=03&F=${fid}">Transactions</a>`;
  
    // caption (name/logo)
    qs("#TeamDetails caption span").innerHTML = hrefEl.innerHTML;
    const linkInCap = qs("#TeamDetails caption span a");
    if (linkInCap) linkInCap.replaceWith(...linkInCap.childNodes);
  
    // default active tab = Bio
    qsa("#TeamDetails li.MFLPlayerPopupPlayerTabs a").forEach(a => a.classList.remove("active"));
    qs("#TeamDetails #frachiseBioTab a")?.classList.add("active");
  
    // ---- Fetch & populate: ROSTER (O=07&PRINTER=1) ----
    const rosterURL = `${baseURLDynamic}/${year}/options?L=${league_id}&O=07&F=${fid}&PRINTER=1`;
    fetchText(rosterURL).then(html => {
      const frag = parseHTML(html);
      const tbody = qs(".report tbody", frag);
      qs(".team_roster_table").innerHTML = "";
      if (tbody) qs(".team_roster_table").append(...tbody.childNodes);
  
      // (your reformatting)
      qsa("#TeamDetails .team_roster_table td.player").forEach(cell => {
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
      replaceAllIn(qs("#TeamDetails"), '#TeamDetails td a[class*="position_"]',
        (node) => node.setAttribute('href', node.getAttribute('href').replace('&PRINTER=1', ''))
      );
  
      try { MFLPlayerPopupNewsIcon(); } catch (_) { }
      const ptsTh = qs(".team_roster_table th.points");
      if (ptsTh) ptsTh.textContent = "Pts";
    }).catch(err => console.error("Roster fetch error:", err));
  
    // ---- Fetch & populate: BIO (O=01&PRINTER=1) ----
    const bioURL = `${baseURLDynamic}/${year}/options?L=${league_id}&F=${fid}&O=01&PRINTER=1`;
    fetchText(bioURL).then(html => {
      const frag = parseHTML(html);
      const rows = qsa(".report tr.emailaddress,.report tr.ownername,.report tr.daytimephone,.report tr.cellnumber,.report tr.mailingaddress,.report tr.lastvisit,.report tr.conference,.report tr.division,.report tr.accounting,.report tr.bbidtotalspent,.report tr.h2hrecord,.report tr.ytdpoints", frag);
      const bioT = qs(".team_bio_table");
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
      qsa(".TeamData").forEach(t => hide(t));
      show(qs(".team_bio_table"));
      show(qs(".teamdetailsWrap"));
      show(qs("#TeamDetails"));
      try { bodyScrollLock.disableBodyScroll(qs("#TeamDetails")); } catch (_) { }
    }).catch(err => console.error("Bio fetch error:", err));
  
    // ---- Fetch & populate: SCHEDULE (O=16&PRINTER=1) ----
    const schedURL = `${baseURLDynamic}/${year}/options?L=${league_id}&O=16&F=${fid}&PRINTER=1`;
    fetchText(schedURL).then(html => {
      const frag = parseHTML(html);
      const body = qs(".report tbody", frag);
      const sched = qs(".team_schedule_table");
      sched.innerHTML = "";
      if (body) sched.append(...body.childNodes);
  
      // optional franchise icons
      if (load_playerIcons) {
        qsa(".team_schedule_table a[class*='franchise_']").forEach(a => {
          const cls = a.getAttribute("class") || "";
          const code = cls.slice(cls.indexOf("franchise_") + 10, cls.indexOf("franchise_") + 14);
          try {
            a.parentElement.style.whiteSpace = "nowrap";
            a.parentElement.insertAdjacentHTML('afterbegin', `<div class="franTeam_${code}" title="${franchiseDatabase["fid_" + code].name}"></div>`);
            setTimeout(() => { qsa(".team_schedule_table a").forEach(x => x.replaceWith(...x.childNodes)); }, 1000);
          } catch (_) { }
        });
      } else {
        qsa(".team_schedule_table a").forEach(x => x.replaceWith(...x.childNodes));
      }
    }).catch(err => console.error("Schedule fetch error:", err));
  
    // ---- Fetch & populate: AWARDS (O=202&PRINTER=1) ----
    const awardsURL = `${baseURLDynamic}/${year}/options?L=${league_id}&O=202&FID=${fid}&PRINTER=1`;
    fetchText(awardsURL).then(html => {
      const frag = parseHTML(html);
      const body = qs(".report tbody", frag);
      const tgt = qs(".team_awards_table");
      tgt.innerHTML = "";
      if (body) tgt.append(...body.childNodes);
      const footer = qs("#TeamDetails .team_awards_table td.reportfooter");
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
    qs("#TeamDetails table")?.classList.add("report");
    openFranchisePopup(a);
  });
  
  // Lineup tab click: show table (weather link rewire)
  document.body.addEventListener('click', (ev) => {
    if (!ev.target.closest('#TeamDetails li#frachiseLineupTab')) return;
    switchTab(".team_lineup_table");
    qs("#TeamDetails li#frachiseLineupTab a")?.classList.add("active");
  
    // Rewire "Weather" links in lineup once visible
    qsa("#TeamDetails td.weekly-opp").forEach(td => {
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
  
  // --- Other tabs (Options / News / Watch) (fix IDs) ---
document.body.addEventListener('click', (ev) => {
    if (ev.target.closest('#TeamDetails li#franchiseOptionsTab')) {
      switchTab(".team_options_table");
      qs("#TeamDetails li#franchiseOptionsTab a")?.classList.add("active");
    }
  });
  document.body.addEventListener('click', (ev) => {
    if (ev.target.closest('#TeamDetails li#franchiseNewsTab')) {
      switchTab(".team_news_table");
      qs("#TeamDetails li#franchiseNewsTab a")?.classList.add("active");
    }
  });
  document.body.addEventListener('click', (ev) => {
    if (ev.target.closest('#TeamDetails li#franchiseWatchTab')) {
      switchTab(".team_watch_table");
      qs("#TeamDetails li#franchiseWatchTab a")?.classList.add("active");
    }
  });
}
