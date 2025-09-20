var MFLPlayerPopupCurrentPID, MFLPlayerPopupTracker = new Array(),
MFLPlayerPopupTeamNames = new Array(),
MFLPlayerPopupOnloadContent = new Array(),
MFLPlayerPopupStart = new Date().getTime(),
MFLPlayerPopupValidNFLAbbrev = new Array("FA", "ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET", "GBP", "HOU", "IND", "JAC", "KCC", "LAC", "LAR", "MIA", "MIN", "NEP", "NOS", "NYG", "NYJ", "OAK", "PHI", "PIT", "SEA", "SFO", "TBB", "TEN", "WAS", "RAM", "LVR", "STL", "SDC", ),
MFLPlayerPopupValidPosition = new Array("Coach", "QB", "TMQB", "RB", "TMRB", "FB", "WR", "TMWR", "TE", "TMTE", "KR", "PK", "TMPK", "PN", "TMPN", "DE", "DT", "TMDL", "LB", "TMLB", "CB", "S", "TMDB", "Off", "Def", "ST", ),
MFLPlayerPopupExtraTitles = {
	salary: "Salary",
	contractyear: "Contract Year",
	contractstatus: "Contract Status",
	contractinfo: "Contract Information",
	drafted: "Drafted",
};
if (void 0 === MFLPopupEnablePlayerNews) var MFLPopupEnablePlayerNews = !0;
if (void 0 === MFLPopupEnableArticle) var MFLPopupEnableArticle = !0;
if (void 0 === MFLPopupOmitLinks) var MFLPopupOmitLinks = !1;
if (void 0 === MFLPopupOmitStatus) var MFLPopupOmitStatus = !1;
if (void 0 === MFLPopupEnableAutoNotification) var MFLPopupEnableAutoNotification = !1;
if (void 0 === MFLPopupEnableTrade) var MFLPopupEnableTrade = !0;
if (void 0 === MFLPopupEnableTradePoll) var MFLPopupEnableTradePoll = !0;
if (void 0 === MFLPopupEnableReminders) var MFLPopupEnableReminders = !0;
if (void 0 === MFLPopupEnableMessages) var MFLPopupEnableMessages = !0;
if (void 0 === MFLPopupEnableCommishMessage) var MFLPopupEnableCommishMessage = !1;
if (void 0 === MFLPopupCommishMessage) var MFLPopupCommishMessage = "";
if (void 0 === MFLPlayerPopupIncludeNFLLogo) var MFLPlayerPopupIncludeNFLLogo = !0;
if (void 0 === ShowMFLsearch) var ShowMFLsearch = !1;
if (void 0 === MFLFranchisePopup) var MFLFranchisePopup = !1;
if (void 0 === MFLScoreDetailsPopup) var MFLScoreDetailsPopup = !1;
if (void 0 === includeBiologo) var includeBiologo = !1;
if ((MFLFranchisePopup && (MFLScoreDetailsPopup = !0), void 0 === includeBiologoAsset)) var includeBiologoAsset = !1;
if (void 0 === ShowMFLlogin) var ShowMFLlogin = !1;
if (void 0 === LoginSearchMobileCSS) var LoginSearchMobileCSS = !1;
if (void 0 === MFLPopupWelcomeFontAwesome) var MFLPopupWelcomeFontAwesome = '<i class="fa-sharp fa-regular fa-lock-keyhole MFLPopupFontAwesome MFLPopupFontAwesomeMenu MFLPopupWelcome" aria-hidden="true"></i>';
if (void 0 === MFLPopupSearchFontAwesome) var MFLPopupSearchFontAwesome = '<i class="fa-regular fa-magnifying-glass MFLPopupFontAwesome MFLPopupFontAwesomeMenu MFLPopupSearch" aria-hidden="true"></i>';
if (void 0 === MFLPopupNotifyFontAwesome) var MFLPopupNotifyFontAwesome = '<i class="fa-regular fa-circle-exclamation MFLPopupFontAwesome MFLPopupFontAwesomeMenu MFLPopupNotify" aria-hidden="true"></i>';
if (void 0 === MFLPopupNewNewsFontAwesome) var MFLPopupNewNewsFontAwesome = '<i class="fa-regular fa-file-lines MFLPopupFontAwesome MFLPopupFontAwesomeNews MFLPopupNewNews" aria-hidden="true"></i>';
if (void 0 === MFLPopupOldNewsFontAwesome) var MFLPopupOldNewsFontAwesome = '<i class="fa-regular fa-file-lines MFLPopupFontAwesome MFLPopupFontAwesomeNews MFLPopupOldNews" aria-hidden="true"></i>';
if (void 0 === MFLPopupNoNewsFontAwesome) var MFLPopupNoNewsFontAwesome = '<i class="fa-regular fa-file MFLPopupFontAwesome MFLPopupFontAwesomeNews MFLPopupNoNews" aria-hidden="true"></i>';
if (void 0 === MFLPopupArticleFontAwesome) var MFLPopupArticleFontAwesome = '<i class="fa-regular fa-newspaper MFLPopupFontAwesome MFLPopupFontAwesomeArticle MFLPopupArticle" aria-hidden="true"></i>';
if (void 0 === MFLPlayerPopupNewsNone) var MFLPlayerPopupNewsNone = "https://www.mflscripts.com/ImageDirectory/script-images/newsNone.svg";
if (void 0 === MFLPlayerPopupNewsOld) var MFLPlayerPopupNewsOld = "https://www.mflscripts.com/ImageDirectory/script-images/newsOld.svg";
if (void 0 === MFLPlayerPopupNewsNew) var MFLPlayerPopupNewsNew = "https://www.mflscripts.com/ImageDirectory/script-images/newsNew.svg";
if (void 0 === MFLPlayerPopupIncludeProjections) var MFLPlayerPopupIncludeProjections = !0;
$(".myfantasyleague_menu ul li:eq(0)").parent().append('<div id="icon-wrapper" style="float:left;display:none"><li onclick="toggleLogin()" class="notification-icon-login" style="display:none">' + MFLPopupWelcomeFontAwesome + '</li><div class="toggle_module_login" style="display:none;"><table class="toggle_login_content report" style="white-space:initial"><tbody><tr><th>Welcome</th></tr><tr class="oddtablerow"></tr></tbody></table></div><li onclick="toggleSearch()" class="notification-icon-search" title="Player Search" style="display:none">' + MFLPopupSearchFontAwesome + '</li><div class="toggle_module_search" style="display:none"><table class="toggle_search_content report" style="white-space:initial"><tbody><tr><th>Find A Player</th></tr><tr class="oddtablerow"><td><form method="get" action="' + baseURLDynamic + "/" + year + '/player_search"><input name="L" value="' + league_id + '" type="hidden"><input name="NAME" size="15" type="text"><input value="Search" type="submit"></form></td></tr></tbody></table></div><li class="notification-icon-popup" title="Notifications" style="display:none"><span onclick="MFLPlayerPopupPopulateOnload(true)">' + MFLPopupNotifyFontAwesome + '</span></li><li style="display:none" onclick="location.href=\'' + baseURLDynamic + "/" + year + "/mb/message_list.pl?bid=" + year + league_id + '\'" class="notification-icon-new-mb-private-message addon-icons" title="New Private Message!"><i class="fa-regular fa-inbox fa-beat MFLPopupFontAwesomeMenu"></i></li><li style="display:none" onclick="location.href=\'' + baseURLDynamic + "/" + year + "/options?L=" + league_id + '&O=28\'" class="notification-icon-new-mb-message addon-icons" title="New Message Board Post!"><i class="fa-regular fa-comments fa-beat MFLPopupFontAwesomeMenu"></i></li><li style="display:none" onclick="location.href=\'' + baseURLDynamic + "/" + year + "/options?L=" + league_id + '&O=69\'" class="notification-icon-new-poll addon-icons" title="Vote Required!"><i class="fa-regular fa-check-to-slot fa-beat MFLPopupFontAwesomeMenu"></i></li><li style="display:none" onclick="location.href=\'' + baseURLDynamic + "/" + year + "/csetup?L=" + league_id + '&C=REVTRAD\'" class="notification-pending-trade addon-icons" title="Pending Trade to Approve!"><i class="fa-regular fa-triangle-exclamation fa-beat MFLPopupFontAwesomeMenu"></i></li><li style="display:none" onclick="alert(\'You have ' + leagueAttributes.PendingTradesAwaitingCommishApproval + ' trade(s) awaiting Commissioner Approval!\')" class="notification-awaiting-approval addon-icons" title="Trade(s) Awaiting Commissioner Approval!"><i class="fa-regular fa-hourglass-half fa-beat MFLPopupFontAwesomeMenu"></i></li><li style="display:none" onclick="location.href=\'' + baseURLDynamic + "/" + year + "/options?L=" + league_id + '&O=05\'" class="notification-outstandings-offers-received addon-icons" title="You have been offered a trade!"><i class="fa-regular fa-handshake fa-beat MFLPopupFontAwesomeMenu"></i></li></div>', ),
$(document).ready(function() {
	if (document.getElementById("body_player")) {
		const t = new URL(window.location.href).searchParams.get("P");
		var e = "https://www.mflscripts.com/playerImages_80x107/mfl_" + t + ".png";
		$("body").addClass("espn_body_player"),
		$("head").append("<style>.espn_body_player td.player_photo img{-webkit-box-sizing:unset;-moz-box-sizing:unset;box-sizing:unset;background:#fff}.espn_body_player td.player_photo{text-align:center}</style>", ),
		$("#body_player td.player_photo img").each(function(a, r) {
			var o; (o = $(this)).attr("src", e),
			o.one("error",
			function() {
				o.one("error",
				function() {
					o.one("error",
					function() {
						$(this).attr("src", "https://www63.myfantasyleague.com/player_photos_2010/no_photo_available.jpg", ),
						$("body").removeClass("espn_body_player");
					}),
					$(this).attr("src", "https://www.mflscripts.com/playerImages_80x107/free_agent.png", ),
					$("body").addClass("espn_body_player");
				}),
				$(this).attr("src", "//www.myfantasyleague.com/player_photos_2014/" + t + "_thumb.jpg", ),
				$("body").removeClass("espn_body_player");
			});
		});
	}
	$("head").append('<style>.espnImg .articlepicture[src*="playerImages"]{-webkit-box-sizing:unset;-moz-box-sizing:unset;box-sizing:unset;background:#fff;width:auto!important}.espnImg td{display:table;margin:0 auto!important}</style>', ),
	$("#body_options_185,#options_177,#options_207,#fantasy_articles,#fantasy_recap,#fantasy_preview", ).find('img.articlepicture[src*="_thumb"]').each(function() {
		var e = $(this).attr("src").match(/\/(\d+).*\.jpg$/ || ["", ""])[1],
		t = "https://www.mflscripts.com/playerImages_80x107/mfl_" + e + ".png";
		$(this).closest(".articlepicturetable").addClass("espnImg"),
		$(this).attr("src", t),
		$(this).each(function(a, r) {
			var o; (o = $(this)).attr("src", t),
			o.one("error",
			function() {
				o.one("error",
				function() {
					o.one("error",
					function() {
						$(this).attr("src", "https://www63.myfantasyleague.com/player_photos_2010/no_photo_available.jpg", ),
						$(this).closest(".articlepicturetable").removeClass("espnImg");
					}),
					$(this).attr("src", "https://www.mflscripts.com/playerImages_80x107/free_agent.png", ),
					$(this).closest(".articlepicturetable").addClass("espnImg");
				}),
				$(this).attr("src", "//www.myfantasyleague.com/player_photos_2014/" + e + "_thumb.jpg", ),
				$(this).closest(".articlepicturetable").removeClass("espnImg");
			});
		});
	});
}),
jQuery("head").append('<style>#MFLPlayerPopupHeader > table > tbody > tr:nth-child(4) br,#MFLPlayerPopupBio > table > tbody > tr:nth-child(4) br{display:none}#MFLPlayerPopupHeader > table > tbody > tr:nth-child(4) td:nth-child(1),#MFLPlayerPopupBio > table > tbody > tr:nth-child(4) td:nth-child(1){overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:6.25rem}.playerPopupIcon[src*=".svg"],.playerPopupIcon[src*=".svg"][src*="newsNew"]{height:0.875rem!important;padding-left:0!important;margin-top:-0.188rem!important;vertical-align: middle!important}#MFLPlayerPopupOverlay[style*="display: block"] + #MFLPlayerPopupContainer{display:block!important}.MFLPlayerPopupNFLTeamLogo{right:0.375rem;left:auto;top:0.188rem;max-width:1.375rem;max-height:1.375rem}#MFLPlayerPopupHeader .popreport td,#MFLPlayerPopupBio .popreport td.pop-photo{padding-right:0.313rem}.MFLPopupFontAwesomeMenu {font-size:1.5rem;float:right;padding-left:0.5rem;padding-top: 0.375rem;}.MFLPopupNotify2{float:initial;font-size:1.25rem}.MFLPopupFontAwesomeCaption {font-size: 1.125rem;}.MFLPlayerPopupHeaderCaption .MFLPopupFontAwesomeMenu{float:none;padding:0;font-size:100%}#body_options_08 td.points.tot img,#body_top table td.points.tot img{display:none}@media only screen and (max-width: 26.25em){.pt-hide{display:none}}</style>', ),
MFLPlayerPopupIncludeProjections && jQuery("head").append("<style>#MFLPlayerPopupProjections{position:relative;height:17.5rem;height:17.5rem;overflow:auto;-webkit-overflow-scrolling:touch}</style>", );
try {
	CameraTag.jQueryPreInstalled = !0;
} catch(e) {}
function setCookie(e, t, a) {
	var r = new Date();
	r.setTime(r.getTime() + 24 * a * 60 * 60 * 1e3);
	var o = "expires=" + r.toUTCString();
	document.cookie = e + "=" + t + ";" + o + ";path=/";
}
function getCookie(e) {
	for (var t = e + "=",
	a = document.cookie.split(";"), r = 0; r < a.length; r++) {
		for (var o = a[r];
		" " === o.charAt(0);) o = o.substring(1);
		if (0 === o.indexOf(t)) return o.substring(t.length, o.length);
	}
	return "";
}
function MFLPlayerPopupCreateContainer() {
	jQuery("body").append("<div id='isMediaContainer' style='display:none'>"),
	jQuery("#isMediaContainer").append("<div class='isMedia'>"),
	jQuery("body").append("<div id='MFLPlayerPopupOverlay'>"),
	jQuery("body").append("<div id='MFLPlayerPopupContainer' style='left:0!important;right:0!important;top:0!important;bottom:0!important;margin:auto'>", ),
	jQuery("#MFLPlayerPopupContainer").append("<caption class='MFLPlayerPopupHeaderCaption'><span id='MFLPlayerPopupName'></span></caption>", ),
	jQuery("#MFLPlayerPopupContainer").append("<span id='MFLPlayerPopupClose' onclick='MFLPlayerPopupClose()'>X</span>", ),
	jQuery("#MFLPlayerPopupContainer").append("<div id='MFLPlayerPopupLoading'><center>Loading Content . . .<br><br><div class='MFLPlayerPopupLoader'></div></center></div>", ),
	jQuery("#MFLPlayerPopupContainer").append("<div id='MFLPlayerPopupArticleLoaded'>", ),
	jQuery("#MFLPlayerPopupContainer").append("<div id='MFLPlayerPopupLoaded'>", ),
	jQuery("#MFLPlayerPopupLoaded").append("<div id='MFLPlayerPopupHeader'></div>", ),
	jQuery("#MFLPlayerPopupLoaded").append("<div class='MFLPopTabWrap'><ul class='MFLPlayerPopupTab'></ul></div><div id='MFLPlayerPopupLinks'></div>", ),
	jQuery(".MFLPlayerPopupTab:not(#TeamDetails .MFLPlayerPopupTab)").append("<li class='MFLPlayerPopupPlayerTabs'><a href='javascript:void(0)'  class='MFLPlayerPopupTabLinks' onclick=\"MFLPlayerPopupOpenTab(event, 'MFLPlayerPopupNews')\" id='MFLPlayerPopupTabLinksNews'><span class='pt-hide'>Player</span> News</a></li>", ),
	jQuery(".MFLPlayerPopupTab:not('#TeamDetails .MFLPlayerPopupTab')").append("<li class='MFLPlayerPopupPlayerTabs' id='MFLPlayerPopupBioTab'><a href='javascript:void(0)' class='MFLPlayerPopupTabLinks' onclick=\"MFLPlayerPopupOpenTab(event, 'MFLPlayerPopupBio')\">Bio</a></li>", ),
	jQuery(".MFLPlayerPopupTab:not(#TeamDetails .MFLPlayerPopupTab)").append("<li class='MFLPlayerPopupPlayerTabs'><a href='javascript:void(0)'  class='MFLPlayerPopupTabLinks' onclick=\"MFLPlayerPopupOpenTab(event, 'MFLPlayerPopupStats')\"><span class='pt-hide'>" + year + "</span> Stats</a></li>", ),
	MFLPlayerPopupIncludeProjections && jQuery(".MFLPlayerPopupTab:not(#TeamDetails .MFLPlayerPopupTab)").append("<li class='MFLPlayerPopupPlayerTabs'><a href='javascript:void(0)'  class='MFLPlayerPopupTabLinks' onclick=\"MFLPlayerPopupOpenTab(event, 'MFLPlayerPopupProjections')\">Proj.</a></li>", ),
	jQuery(".MFLPlayerPopupTab:not(#TeamDetails .MFLPlayerPopupTab)").append("<li class='MFLPlayerPopupPlayerTabs'><a href='javascript:void(0)'  class='MFLPlayerPopupTabLinks' onclick=\"MFLPlayerPopupOpenTab(event, 'MFLPlayerPopupStatsHistory')\">Career <span class='pt-hide'>Stats</span></a></li>", ),
	(MFLPopupEnableTrade || MFLPopupEnableTradePoll) && jQuery(".MFLPlayerPopupTab:not(#TeamDetails .MFLPlayerPopupTab)").append("<li class='MFLPlayerPopupNotificationTabs'><a href='javascript:void(0)'  class='MFLPlayerPopupTabLinks' onclick=\"MFLPlayerPopupOpenTab(event, 'MFLPlayerPopupTrades')\" id='MFLPlayerPopupTabLinksTrades'>Trades</a></li>", ),
	MFLPopupEnableCommishMessage && "" !== MFLPopupCommishMessage && jQuery(".MFLPlayerPopupTab:not(#TeamDetails .MFLPlayerPopupTab)").append("<li class='MFLPlayerPopupNotificationTabs'><a href='javascript:void(0)'  class='MFLPlayerPopupTabLinks' onclick=\"MFLPlayerPopupOpenTab(event, 'MFLPlayerPopupCommishMessage')\" id='MFLPlayerPopupTabLinksCommishMessage'>Commish Msg</a></li>", ),
	MFLPopupEnableReminders && jQuery(".MFLPlayerPopupTab:not(#TeamDetails .MFLPlayerPopupTab)").append("<li class='MFLPlayerPopupNotificationTabs'><a href='javascript:void(0)'  class='MFLPlayerPopupTabLinks' onclick=\"MFLPlayerPopupOpenTab(event, 'MFLPlayerPopupReminders')\" id='MFLPlayerPopupTabLinksReminders'>Reminders</a></li>", ),
	MFLPopupEnableMessages && jQuery(".MFLPlayerPopupTab:not(#TeamDetails .MFLPlayerPopupTab)").append("<li class='MFLPlayerPopupNotificationTabs'><a href='javascript:void(0)'  class='MFLPlayerPopupTabLinks' onclick=\"MFLPlayerPopupOpenTab(event, 'MFLPlayerPopupMessages')\" id='MFLPlayerPopupTabLinksMessages'>Messages</a></li>", ),
	jQuery("#MFLPlayerPopupLoaded").append("<div id='MFLPlayerPopupNews' class='MFLPlayerPopupTabContent'></div>", ),
	jQuery("#MFLPlayerPopupLoaded").append("<div id='MFLPlayerPopupBio' class='MFLPlayerPopupTabContent'>Bio Table</div>", ),
	jQuery("#MFLPlayerPopupLoaded").append("<div id='MFLPlayerPopupStatsHistory' class='MFLPlayerPopupTabContent'>Stats History Table</div>", ),
	jQuery("#MFLPlayerPopupLoaded").append("<div id='MFLPlayerPopupStats' class='MFLPlayerPopupTabContent'>Stats Table</div>", ),
	MFLPlayerPopupIncludeProjections && jQuery("#MFLPlayerPopupLoaded").append("<div id='MFLPlayerPopupProjections' class='MFLPlayerPopupTabContent'><div id='MFLPlayerPopupLoading'><center>Loading Content . . .<br><br><div class='MFLPlayerPopupLoader'></div></center></div></div>", ),
	jQuery("#MFLPlayerPopupLoaded").append("<div id='MFLPlayerPopupTrades' class='MFLPlayerPopupTabContent'>No Data</div>", ),
	jQuery("#MFLPlayerPopupLoaded").append("<div id='MFLPlayerPopupCommishMessage' class='MFLPlayerPopupTabContent'>No Data</div>", ),
	jQuery("#MFLPlayerPopupLoaded").append("<div id='MFLPlayerPopupReminders' class='MFLPlayerPopupTabContent'>No Data</div>", ),
	jQuery("#MFLPlayerPopupLoaded").append("<div id='MFLPlayerPopupMessages' class='MFLPlayerPopupTabContent'>No Data</div>", ),
	jQuery("#MFLPlayerPopupContainer").wrapInner("<div class='report'></div>"),
	jQuery("#MFLPlayerPopupOverlay").off().on("click",
	function() {
		MFLPlayerPopupClose();
	});
}
function MFLPlayerPopupClose() {
	jQuery("#MFLPlayerPopupOverlay").hide(),
	jQuery("#MFLPlayerPopupContainer").hide(),
	jQuery(".MFLPlayerPopupTabContent").hide(),
	jQuery("#MFLPlayerPopupContainer").removeClass("MFLPlayerPopupArticleContainer", ),
	jQuery("#MFLPlayerPopupContainer").removeClass("MFLPlayerPopupNotificationContainer", );
	try {
		bodyScrollLock.clearAllBodyScrollLocks();
	} catch(e) {}
	$(".MFLPlayerPopupTabContent").removeClass("active_div_tab_scroll"),
	$(".MFLPlayerPopupPlayerTabs a,.MFLPlayerPopupNotificationTabs a").not("#TeamDetails .MFLPlayerPopupPlayerTabs a").removeClass("active");
}
function MFLPlayerPopupOpenTab(e, t) {
	var a, r, o;
	for ($("#TeamDetails .MFLPlayerPopupTab a.active").addClass("dummyClass"), r = document.getElementsByClassName("MFLPlayerPopupTabContent"), a = 0; a < r.length; a++) r[a].style.display = "none";
	for (o = document.getElementsByClassName("MFLPlayerPopupTabLinks"), a = 0; a < o.length; a++) o[a].className = o[a].className.replace(" active", ""); (document.getElementById(t).style.display = "block"),
	(e.currentTarget.className += " active"),
	"MFLPlayerPopupProjections" === t && setTimeout("MFLPlayerPopupPopulateProjections()", 5),
	$("#TeamDetails .MFLPlayerPopupTab a.dummyClass").addClass("active"),
	$("#TeamDetails .MFLPlayerPopupTab a.dummyClass").removeClass("dummyClass"),
	$(".MFLPlayerPopupTabContent:visible").addClass("active_div_tab_scroll"),
	$(".MFLPlayerPopupTabContent:hidden").removeClass("active_div_tab_scroll");
	const i = document.querySelector(".active_div_tab_scroll");
	try {
		bodyScrollLock.disableBodyScroll(i);
	} catch(e) {}
}
function includes(e, t) {
	var a = !1;
	return e.indexOf(t) >= 0 && (a = !0),
	a;
}
function MFLPlayerPopupSetupTeamNames() {
	for (var e in franchiseDatabase)"fid_0000" !== e && franchiseDatabase.hasOwnProperty(e) && (MFLPlayerPopupTeamNames[franchiseDatabase[e].name] = {
		id: franchiseDatabase[e].id,
		abbrev: franchiseDatabase[e].abbrev,
	});
}
function MFLPlayerPopupMoreNews(e, t) {
	fetch(`$ {
		baseURLDynamic
	}
	/${year}/$ {
		e
	}`).then((e) = >e.text()).then((e) = >{
		var a = 0,
		r = "";
		jQuery(e).find(".report tr").each(function() {
			1 === a && (jQuery(this).find("td a").contents().unwrap(), (r = jQuery(this).find("td:eq(0)").html()).indexOf("Article Link") > 0 && (r = r.substring(0, r.indexOf("Article Link") - 2)), r.indexOf("Roto Pass from") > 0 && (r = r.substring(0, r.indexOf("Roto Pass from") - 3))),
			a++;
		}),
		"" !== r && jQuery("#" + t).html(r);
	});
}
function MFLPlayerPopupSetup(e, t) {
	$("#MFLPlayerPopupNews").addClass("active_div_tab_scroll");
	const a = document.querySelector(".active_div_tab_scroll");
	try {
		bodyScrollLock.disableBodyScroll(a);
	} catch(e) {}
	var r = "",
	o = "",
	i = "",
	l = "",
	s = "",
	n = "";
	if (((MFLPlayerPopupCurrentPID = e), playerDatabase.hasOwnProperty("pid_" + e)))(r = playerDatabase["pid_" + e].position),
	(o = playerDatabase["pid_" + e].team),
	(l = (i = playerDatabase["pid_" + e].name).split(",")[1].trim()),
	(s = i.split(",")[0]),
	(n = s + ", " + l + " " + o + " " + r);
	else {
		var p = t.split(" "); (r = p[p.length - 1]),
		(o = p[p.length - 2]);
		for (var d = 1; d < p.length - 2; d++) l += p[d] + " "; (s = p[0].substring(0, p[0].length - 1)),
		(n = s + ", " + l + " " + o + " " + r);
		for (d = 1; d < p.length - 2; d++) i += p[d] + " ";
		i += p[0].substring(0, p[0].length - 1);
	} (includes(MFLPlayerPopupValidPosition, r) && includes(MFLPlayerPopupValidNFLAbbrev, o)) || (dbDebug && (dbDebugDetail ? console.log("Api Call: players App:Player Popup") : console.log("Api Call")), fetch(`$ {
		baseURLDynamic
	}
	/${year}/export ? TYPE = players & PLAYERS = $ {
		e
	} & JSON = 1`).then((e) = >e.json()).then((t) = >{
		try { (i = t.players.player.name),
			(o = t.players.player.team),
			(r = t.players.player.position),
			(n = i + " " + o + " " + r);
		} catch(t) {
			console.log("FAILED PLAYER ID: " + e);
		}
	})),
	jQuery("#MFLPlayerPopupOverlay").show(),
	jQuery("#MFLPlayerPopupContainer #MFLPlayerPopupLoading").show(),
	jQuery(".MFLPlayerPopupPlayerTabs:not(#TeamDetails .MFLPlayerPopupPlayerTabs)", ).css("display", "table-cell"),
	jQuery("#MFLPlayerPopupBioTab").css("display", "none"),
	jQuery("#MFLPlayerPopupBioTab").removeAttr("style"),
	jQuery(".MFLPlayerPopupNotificationTabs").css("display", "none"),
	MFLPopupOmitLinks ? jQuery("#MFLPlayerPopupLinks").css("display", "none") : jQuery("#MFLPlayerPopupLinks").css("display", "block"),
	jQuery("#MFLPlayerPopupLoaded").hide(),
	jQuery("#MFLPlayerPopupArticleLoaded").hide(),
	jQuery("#MFLPlayerPopupName").html(n),
	jQuery("#MFLPlayerPopupContainer").show(),
	setTimeout("MFLPlayerPopupPopulate('" + e + "','" + i.replace(/[\\"']/g, "\\jQuery&").replace(/\u0000/g, "\\0") + "','" + o + "','" + r + "')", 200, ),
	$(".teamdetailsWrap,#TeamDetails").hide(),
	$("#leftTeam ,#rightTeam,#ScoreDetails tbody").html(""),
	$("#teamToggles input").val(""),
	$("#fullSeasonPts").remove(),
	$(".scoredetailsWrap,#ScoreDetails,.scoredetailsWrap,#ScoreNFLDetails", ).hide(),
	$("#ScoreNFLDetails table").removeClass("box_details_table"),
	$("#ScoreDetails table").removeClass("scoring_details_table overview_details_table", ),
	$("a").removeClass("dblClicks");
}
function MFLPlayerPopupArticleSetup(e, t, a) {
	jQuery("#MFLPlayerPopupContainer").addClass("MFLPlayerPopupArticleContainer"),
	jQuery("#MFLPlayerPopupOverlay").show(),
	jQuery("#MFLPlayerPopupContainer #MFLPlayerPopupLoading").show(),
	jQuery("#MFLPlayerPopupLoaded").hide(),
	jQuery("#MFLPlayerPopupArticleLoaded").hide(),
	jQuery("#MFLPlayerPopupName").html("Article Posted " + t + " Ago"),
	jQuery("#MFLPlayerPopupContainer").show(),
	setTimeout("MFLPlayerPopupArticlePopulate('" + e.replace(/[\\"']/g, "\\jQuery&").replace(/\u0000/g, "\\0") + "','" + t + "','" + a + "')", 200, ),
	$(".teamdetailsWrap,#TeamDetails").hide();
	const r = document.querySelector("#MFLPlayerPopupArticleLoaded");
	try {
		bodyScrollLock.disableBodyScroll(r);
	} catch(e) {}
}
function MFLPlayerPopupNotificationPreSetup() {
	jQuery("#MFLPlayerPopupContainer").addClass("MFLPlayerPopupNotificationContainer", ),
	jQuery("#MFLPlayerPopupOverlay").show(),
	jQuery("#MFLPlayerPopupContainer #MFLPlayerPopupLoading").show(),
	jQuery(".MFLPlayerPopupPlayerTabs:not(#TeamDetails .MFLPlayerPopupPlayerTabs)", ).css("display", "none"),
	jQuery("#MFLPlayerPopupBioTab").attr("style", "display:none!important"),
	jQuery(".MFLPlayerPopupNotificationTabs").css("display", "table-cell"),
	jQuery("#MFLPlayerPopupLinks").css("display", "none"),
	jQuery("#MFLPlayerPopupLoaded").hide(),
	jQuery("#MFLPlayerPopupArticleLoaded").hide(),
	!MFLPopupEnableTrade || ("" === MFLPlayerPopupOnloadContent[0] && "" === MFLPlayerPopupOnloadContent[1]) ? MFLPopupEnableCommishMessage && "" !== MFLPlayerPopupOnloadContent[4] ? ($("#MFLPlayerPopupCommishMessage").addClass("active_div_tab_scroll").show(), $("#MFLPlayerPopupTabLinksCommishMessage").addClass("active")) : MFLPopupEnableReminders && "" !== MFLPlayerPopupOnloadContent[2] ? ($("#MFLPlayerPopupReminders").addClass("active_div_tab_scroll").show(), $("#MFLPlayerPopupTabLinksReminders").addClass("active")) : MFLPopupEnableMessages && "" !== MFLPlayerPopupOnloadContent[3] ? ($("#MFLPlayerPopupMessages").addClass("active_div_tab_scroll").show(), $("#MFLPlayerPopupTabLinksMessages").addClass("active")) : MFLPopupEnableTrade ? ($("#MFLPlayerPopupTrades").addClass("active_div_tab_scroll").show(), $("#MFLPlayerPopupTabLinksTrades").addClass("active")) : MFLPopupEnableCommishMessage ? ($("#MFLPlayerPopupCommishMessage").addClass("active_div_tab_scroll").show(), $("#MFLPlayerPopupTabLinksCommishMessage").addClass("active")) : MFLPopupEnableReminders ? ($("#MFLPlayerPopupReminders").addClass("active_div_tab_scroll").show(), $("#MFLPlayerPopupTabLinksReminders").addClass("active")) : MFLPopupEnableMessages ? ($("#MFLPlayerPopupMessages").addClass("active_div_tab_scroll").show(), $("#MFLPlayerPopupTabLinksMessages").addClass("active")) : (jQuery("#MFLPlayerPopupHeader").html("<table class='popreport'><tbody><tr><th>You Have No Notifications!</th></tr><tr class='oddtablerow'><td>There are currently no active notifications.</td></tr></tbody></table>", ).parent().addClass("noHide"), $("#MFLPlayerPopupMessages").addClass("active_div_tab_scroll").show()) : ($("#MFLPlayerPopupTrades").addClass("active_div_tab_scroll").show(), $("#MFLPlayerPopupTabLinksTrades").addClass("active"));
	const e = document.querySelector(".active_div_tab_scroll");
	try {
		bodyScrollLock.disableBodyScroll(e);
	} catch(e) {}
	jQuery("#MFLPlayerPopupName").html("League Notifications <span class='MFLPopupLeagueNotification' style='padding:0;background:none' title='Notifications'>" + MFLPopupNotifyFontAwesome + "</span>", ),
	jQuery("#MFLPlayerPopupContainer").show();
}
function MFLPlayerPopupNotificationSetup(e) {
	1 === MFLPlayerPopupTracker[0] && 1 === MFLPlayerPopupTracker[1] && 1 === MFLPlayerPopupTracker[2] && 1 === MFLPlayerPopupTracker[3] && 1 === MFLPlayerPopupTracker[4] && (e || "" !== MFLPlayerPopupOnloadContent[0] || "" !== MFLPlayerPopupOnloadContent[1] || "" !== MFLPlayerPopupOnloadContent[2] || "" !== MFLPlayerPopupOnloadContent[3] || "" !== MFLPlayerPopupOnloadContent[4]) && (e || MFLPlayerPopupNotificationPreSetup(), "" === MFLPlayerPopupOnloadContent[0] && "" === MFLPlayerPopupOnloadContent[1] && "" === MFLPlayerPopupOnloadContent[2] && "" === MFLPlayerPopupOnloadContent[3] && "" === MFLPlayerPopupOnloadContent[4] ? jQuery("#MFLPlayerPopupHeader").html("<table class='popreport'><tbody><tr><th>You Have No Notifications!</th></tr><tr class='oddtablerow'><td>There are currently no active notifications.</td></tr></tbody></table>", ).parent().addClass("noHide") : MFLPopupEnableAutoNotification ? jQuery("#MFLPlayerPopupHeader").html("<table class='popreport'><tbody><tr><th>You Have Notifications!</th></tr><tr class='oddtablerow'><td>There are one or more active notifications that have been set to automatically display once per browser session.<br><br>After closing this popup you can re-open notifications by either closing and re-opening the browser or clicking on the notification icon in the menu.</td></tr></tbody></table>", ) : jQuery("#MFLPlayerPopupHeader").html("<table class='popreport'><tbody><tr><th>You Have Notifications!</th></tr><tr class='oddtablerow'><td>There are one or more active notifications. Check the tabs below to view them.</td></tr></tbody></table>", ), "" === MFLPlayerPopupOnloadContent[0] && "" === MFLPlayerPopupOnloadContent[1] ? jQuery("#MFLPlayerPopupTrades").html("<br /><center><i>No Current Trade Notifications</i></center>", ) : jQuery("#MFLPlayerPopupTrades").html(MFLPlayerPopupOnloadContent[0].replace(/report/g, "popreport").replace("<caption><span>Pending Trades</span></caption>", "") + MFLPlayerPopupOnloadContent[1].replace(/report/g, "popreport").replace("<caption><span></span></caption>", ""), ), "" === MFLPlayerPopupOnloadContent[2] ? jQuery("#MFLPlayerPopupReminders").html("<br /><center><i>No Active League Reminders<br/><br/>OR<br/><br/>League Reminders are Disabled in <a href='" + baseURLDynamic + "/" + year + "/csetup?L=" + league_id + "&C=FCUSTOM&F=" + franchise_id + "'>Franchise Customization</a> Settings</i></center>", ) : jQuery("#MFLPlayerPopupReminders").html(MFLPlayerPopupOnloadContent[2].replace(/report/g, "popreport"), ), "" === MFLPlayerPopupOnloadContent[3] ? jQuery("#MFLPlayerPopupMessages").html("<br /><center><i>No Active Messages from MyFantasyLeague</i></center>", ) : jQuery("#MFLPlayerPopupMessages").html(MFLPlayerPopupOnloadContent[3].replace(/report/g, "popreport"), ), "" === MFLPlayerPopupOnloadContent[4] ? jQuery("#MFLPlayerPopupCommishMessage").html("<br /><center><i>No Active Messages from Commissioner</i></center>", ) : jQuery("#MFLPlayerPopupCommishMessage").html(MFLPlayerPopupOnloadContent[4].replace(/report/g, "popreport"), ), setTimeout("MFLPlayerPopupInitiate(2)", 1e3));
}
function MFLPlayerPopupPopulateProjections() {
	jQuery("#MFLPlayerPopupProjections #MFLPlayerPopupLoading").show(),
	setTimeout(function() {
		"Loading Content . . ." === jQuery("#MFLPlayerPopupProjections").text() && fetch(`$ {
			baseURLDynamic
		}
		/${year}/player ? L = $ {
			league_id
		} & P = $ {
			MFLPlayerPopupCurrentPID
		} & YEAR = $ {
			year
		} & DISPLAY_TYPE = projections`, ).then(function(e) {
			if (e.ok) return e.text();
			throw new Error("Network response was not OK.");
		}).then(function(e) {
			var t = 0,
			a = "<table class='popreport'><tbody>";
			jQuery(e).find("#player_stats_table tr").each(function() {
				jQuery(this).find("form").length > 0 || (jQuery(this).find("th").length > 0 ? (4 === parseInt(jQuery(this).find("th:eq(0)").attr("colspan")) ? jQuery(this).find("th:eq(0)").attr("colspan", 3) : jQuery(this).find("th:eq(3)").remove(), (a += "<tr>" + jQuery(this).html() + "</tr>")) : jQuery(this).find("td").length > 1 && (jQuery(this).find("td:eq(3)").remove(), (a += t % 2 ? "<tr class='eventablerow'>" + jQuery(this).html() + "</tr>": "<tr class='oddtablerow'>" + jQuery(this).html() + "</tr>"), t++));
			}),
			(a += "</tbody></table>"),
			jQuery("#MFLPlayerPopupProjections").html(a);
		}).
		catch(function(e) {
			console.error("Error:", e);
		});
	},
	1e3);
}
function MFLPlayerPopupPopulate(e, t, a, r) {
	MFLPlayerPopupTracker = [];
	var o = "";
	jQuery("#MFLPlayerPopupContainer #MFLPlayerPopupLoading").show(),
	jQuery("#MFLPlayerPopupLoaded").hide(),
	jQuery("#MFLPlayerPopupArticleLoaded").hide(),
	dbDebug && (dbDebugDetail ? console.log("Api Call: playerStatus App:Player Popup") : console.log("Api Call")),
	fetch(`$ {
		baseURLDynamic
	}
	/${year}/export ? TYPE = playerStatus & L = $ {
		league_id
	} & P = $ {
		e
	} & JSON = 1`, ).then((e) = >e.json()).then((i) = >{
		try {
			o = MFLPopupCustomRule("pStatus", null, null, e, t, a, r, i, null, null, );
		} catch(e) {
			try {
				o = i.playerStatus.status;
			} catch(e) {}
		}
		const l = `$ {
			baseURLDynamic
		}
		/${year}/player ? L = $ {
			league_id
		} & P = $ {
			e
		}`;
		return fetch(l);
	}).then((e) = >e.text()).then((i) = >{
		var l = {
			ht: "--",
			wt: "--",
			dob: "--",
			age: "--",
			college: "---",
			draftYear: "n/a",
			draftTeam: "",
			round: "",
			pick: "",
			jersey: "--",
			experience: "",
			acquired: "",
			photo: jQuery(i).find(".player_photo img").each(function() {
				$(this).attr("src", "https://www.mflscripts.com/playerImages_80x107/mfl_" + e + ".png", );
			}).parent().html(),
		},
		s = !0;
		if (void 0 === l.photo)(l.photo = "<img src='https://www.mflscripts.com/ImageDirectory/script-images/nflTeamsvg_2/" + a + ".svg' alt='" + a + "' title='" + a + "' align='middle' />"),
		(s = !1);
		else {
			var n = l.photo.substring(l.photo.indexOf("this.src=") + 10, l.photo.indexOf("no_photo_available.jpg") + 22, );
			l.photo = l.photo.replace(n, "https://www.mflscripts.com/playerImages_80x107/free_agent.png", );
		}
		if (((l.photo = l.photo.replace("img", "img class='articlepicture'")), !MFLPopupOmitLinks)) {
			var p = "<table class='popreport'><tbody>"; (p += "<tr class='oddtablerow'>"),
			(p += "<td style='text-align:center; text-indent:0;'><a href='" + baseURLDynamic + "/" + year + "/player?L=" + league_id + "&P=" + e + "'>Full Profile</a></td>");
			var d = "";
			if ((jQuery(i).find("h3 a").each(function() {
				if ("FantasySharks Profile" === jQuery(this).text()) return ((d = "<a href='" + jQuery(this).attr("href") + "' title='Fantasy Sharks Profile' target='_blank'>Fantasy Sharks</a>"), !1);
			}), "" !== d && (p += "<td class='screen-hide' style='text-align:center; text-indent:0;'>" + d + "</td>"), "undefined" != typeof franchise_id && "0000" !== franchise_id)) {
				var c = "<a href='" + baseURLDynamic + "/" + year + "/add_drop?L=" + league_id + "&P=" + e + "'>Add Player</a>";
				try {
					void 0 !== playerDatabase["pid_" + e].fid && (c = -1 === playerDatabase["pid_" + e].fid.indexOf(franchise_id) ? "<a href='" + baseURLDynamic + "/" + year + "/options?L=" + league_id + "&O=05&FRANCHISE=" + franchise_id + "," + playerDatabase["pid_" + e].fid.substring(0, 4) + "&P=" + e + "'>Propose Trade</a>": "<a href='" + baseURLDynamic + "/" + year + "/add_drop?L=" + league_id + "'>Drop Player</a>");
				} catch(e) {}
				p += "<td style='text-align:center; text-indent:0;'>" + c + "</td>";
				var u = "<a href='" + baseURLDynamic + "/" + year + "/options?L=" + league_id + "&O=178&PID=" + e + "'>Watchlist</a>";
				jQuery(i).find("h3 a").each(function() {
					return jQuery(this).text().indexOf("Remove") > -1 ? ((u = "<a href='" + baseURLDynamic + "/" + year + "/options?L=" + league_id + "&O=178&PID=" + e + "&ACTION=delete'>Watchlist Remove</a>"), !1) : jQuery(this).text().indexOf("Add") > -1 ? ((u = "<a href='" + baseURLDynamic + "/" + year + "/options?L=" + league_id + "&O=178&PID=" + e + "&ACTION=add'>Watchlist Add</a>"), !1) : void 0;
				}),
				(p += "<td style='text-align:center; text-indent:0;'>" + u + "</td>");
			} (p += "<td style='text-align:center; text-indent:0;'><a href='" + baseURLDynamic + "/" + year + "/player_history?L=" + league_id + "&PLAYERS=" + e + "'>Trans. History</a></td>"),
			(p += "</tr></tbody></table>"),
			jQuery("#MFLPlayerPopupLinks").html(p);
		}
		var y = new Array();
		if ((jQuery(i).find(".biography.report tr").each(function() {
			var i = jQuery(this).find("th:eq(0)").html(),
			s = jQuery(this).find("td:eq(0)").html();
			switch (i) {
			case "Height/Weight:":
				(l.ht = s.substring(0, s.indexOf("/") - 1)),
				(l.wt = s.substring(s.indexOf("/") + 2, s.length));
				break;
			case "DOB/Age:":
				(l.dob = s.substring(0, s.indexOf("/") - 1)),
				(l.age = s.substring(s.indexOf("/") + 2, s.length));
				break;
			case "Jersey Num:":
				l.jersey = parseInt(s);
				break;
			case "College:":
				l.college = s;
				break;
			case "Drafted:":
				"Undrafted" === s ? ((l.draftYear = "?"), (l.draftTeam = "FA"), (l.round = "n/a"), (l.pick = "n/a")) : ((l.draftYear = s.substring(0, s.indexOf("/") - 1)), (l.draftTeam = s.substring(s.indexOf("/") + 2, s.indexOf("Round") - 3, )), (l.round = parseInt(s.substring(s.indexOf("Round") + 6, s.length), )), (l.pick = parseInt(s.substring(s.indexOf("Pick") + 5, s.length), )));
				break;
			case "Experience:":
				isNaN(parseInt(s)) ? ((l.experience = "(Exp.: Rookie)"), (l.experienceInt = 1)) : ((l.experience = "(Exp.: " + parseInt(s) + " years)"), (l.experienceInt = parseInt(s)));
				break;
			case "Acquired:":
				l.acquired = s;
				break;
			case "Salary:":
				try {
					y[y.length] = MFLPopupCustomRule("salary", MFLPlayerPopupExtraTitles.salary, s, e, t, a, r, statusData, o, l, );
				} catch(e) {
					y[y.length] = {
						title: MFLPlayerPopupExtraTitles.salary,
						info: s,
					};
				}
				break;
			case "Contract Year:":
				try {
					y[y.length] = MFLPopupCustomRule("contract_year", MFLPlayerPopupExtraTitles.contractyear, s, e, t, a, r, statusData, o, l, );
				} catch(e) {
					y[y.length] = {
						title: MFLPlayerPopupExtraTitles.contractyear,
						info: s,
					};
				}
				break;
			case "Contract Status:":
				try {
					y[y.length] = MFLPopupCustomRule("contract_status", MFLPlayerPopupExtraTitles.contractstatus, s, e, t, a, r, statusData, o, l, );
				} catch(e) {
					y[y.length] = {
						title: MFLPlayerPopupExtraTitles.contractstatus,
						info: s,
					};
				}
				break;
			case "Contract Info:":
				try {
					y[y.length] = MFLPopupCustomRule("contract_info", MFLPlayerPopupExtraTitles.contractinfo, s, e, t, a, r, statusData, o, l, );
				} catch(e) {
					y[y.length] = {
						title: MFLPlayerPopupExtraTitles.contractinfo,
						info: s,
					};
				}
			}
		}), y.length > 0)) var h = 6;
		else h = 4;
		if ((MFLPopupOmitStatus && 1 === y.length && (h = 4), s && MFLPlayerPopupIncludeNFLLogo)) var m = "<img src='https://www.mflscripts.com/ImageDirectory/script-images/nflTeamsvg_2/" + a + ".svg' class='MFLPlayerPopupNFLTeamLogo' />";
		else m = "";
		if ("--" === l.jersey) var P = "";
		else P = "<span class='MFLPlayerPopupJersey'><span>" + l.jersey + "</span></span>";
		var _ = "<table class='popreport'><tbody>";
		if (((_ += "<tr class='oddtablerow rows-" + h + "'><td class='pop-photo' rowspan='" + h + "'>" + l.photo + m + P + "</td><td><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold'>Ht:</span> " + l.ht + "</td><td><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold'>Wt:</span> " + l.wt + "</td></tr>"), (_ += "<tr class='eventablerow rows-" + h + "'><td><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold'>Born:</span> " + l.dob + " <span class='screen-hide'>(" + l.age + ")</span></td><td><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold'>College:</span> " + l.college + "</td></tr>"), "FA" === l.draftTeam)) var f = year - l.experienceInt + 1 + " Undrafted " + l.experience;
		else if ("" === l.round) f = l.draftYear + " " + l.experience;
		else f = l.draftYear + " #" + l.round + "." + l.pick + " " + l.draftTeam + " <span class='screen-hide'>" + l.experience + "</span>";
		if (((_ += "<tr class='oddtablerow rows-" + h + "'><td colspan='2'><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold'>Draft:</span> " + f + "</td></tr>"), MFLPopupOmitStatus)) var b = "even",
		g = "odd";
		else {
			_ += "<tr class='eventablerow rows-" + h + "'><td><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold'>Status:</span> " + o + "</td><td><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold'>Acquired:</span> " + l.acquired + "</td></tr>"; (b = "odd"),
			(g = "even");
		}
		switch (y.length) {
		case 1:
			(_ += "<tr class='" + b + "tablerow rows-" + h + "'><td colspan='2'><span class='MFLPlayerPopupHeaderTitle' style='font-weight:bold' id='extras-0-title'>" + y[0].title + ":</span> " + y[0].info + "</td></tr>"),
			MFLPopupOmitStatus || (_ += "<tr class='" + g + "tablerow rows-" + h + "'><td colspan='2'> </td></tr>");
			break;
		case 2:
			(_ += "<tr class='" + b + "tablerow rows-" + h + "'><td colspan='2'><span class='MFLPlayerPopupHeaderTitle extras-0-title'style='font-weight:bold'>" + y[0].title + ":</span> " + y[0].info + "</td></tr>"),
			(_ += "<tr class='" + g + "tablerow rows-" + h + "'><td colspan='2'><span class='MFLPlayerPopupHeaderTitle extras-1-title' style='font-weight:bold'>" + y[1].title + ":</span> " + y[1].info + "</td></tr>");
			break;
		case 3:
			(_ += "<tr class='" + b + "tablerow rows-" + h + "'><td><span class='MFLPlayerPopupHeaderTitle extras-0-title' style='font-weight:bold'>" + y[0].title + ":</span> " + y[0].info + "</td><td><span class='MFLPlayerPopupHeaderTitle extras-1-title' style='font-weight:bold'>" + y[1].title + ":</span> " + y[1].info + "</td></tr>"),
			(_ += "<tr class='" + g + "tablerow rows-" + h + "'><td colspan='2'><span class='MFLPlayerPopupHeaderTitle extras-2-title' style='font-weight:bold'>" + y[2].title + ":</span> " + y[2].info + "</td></tr>");
			break;
		case 4:
			(_ += "<tr class='" + b + "tablerow rows-" + h + "'><td><span class='MFLPlayerPopupHeaderTitle extras-0-title' style='font-weight:bold'>" + y[0].title + ":</span> " + y[0].info + "</td><td><span class='MFLPlayerPopupHeaderTitle extras-1-title' style='font-weight:bold'>" + y[1].title + ":</span> " + y[1].info + "</td></tr>"),
			(_ += "<tr class='" + g + "tablerow rows-" + h + "'><td><span class='MFLPlayerPopupHeaderTitle extras-2-title' style='font-weight:bold'>" + y[2].title + ":</span> " + y[2].info + "</td><td><span class='MFLPlayerPopupHeaderTitle extras-3-title' style='font-weight:bold'>" + y[3].title + ":</span> " + y[3].info + "</td></tr>");
		} (_ += "</tbody></table>"),
		jQuery("#MFLPlayerPopupHeader").html(_),
		jQuery("#MFLPlayerPopupBio").html(_);
		var L = 0,
		w = "<table class='popreport'><tbody>";
		jQuery(i).find(".biohistory.report tr").each(function() {
			jQuery(this).find("form").length > 0 || (jQuery(this).find("th").length > 0 ? (w += "<tr>" + jQuery(this).html() + "</tr>") : jQuery(this).find("td").length > 0 && (jQuery(this).find("td a").contents().unwrap(), jQuery(this).find("td a").remove(), (w += L % 2 ? "<tr class='eventablerow'>" + jQuery(this).html() + "</tr>": "<tr class='oddtablerow'>" + jQuery(this).html() + "</tr>"), L++));
		}),
		(w += "</tbody></table>"),
		jQuery("#MFLPlayerPopupStatsHistory").html(w);
		L = 0;
		var v = !1,
		F = "<table class='popreport'><tbody>";
		jQuery(i).find("#player_stats_table tr").each(function() {
			if (jQuery(this).find("form").length > 0);
			else if (jQuery(this).find("th").length > 0) 6 === parseInt(jQuery(this).find("th:eq(0)").attr("colspan")) ? (jQuery(this).find("th:eq(0)").attr("colspan", 4), (v = !0)) : v && (jQuery(this).find("th:eq(3)").remove(), jQuery(this).find("th:eq(3)").remove()),
			(F += "<tr>" + jQuery(this).html() + "</tr>");
			else if (jQuery(this).find("td").length > 1) {
				jQuery(this).find("td a").contents().unwrap(),
				jQuery(this).find("td a").remove();
				var e = jQuery(this).find("td:eq(5)").html().substring(0, jQuery(this).find("td:eq(5)").html().indexOf(" - "), );
				MFLPlayerPopupTeamNames.hasOwnProperty(e) && "" !== MFLPlayerPopupTeamNames[e].abbrev && jQuery(this).find("td:eq(5)").html(jQuery(this).find("td:eq(5)").html().replace(e, "<span title='" + e + "'>" + MFLPlayerPopupTeamNames[e].abbrev, ) + "</span>", ),
				v && (jQuery(this).find("td:eq(3)").remove(), jQuery(this).find("td:eq(3)").remove()),
				(F += L % 2 ? "<tr class='eventablerow'>" + jQuery(this).html() + "</tr>": "<tr class='oddtablerow'>" + jQuery(this).html() + "</tr>"),
				L++;
			}
		}),
		(F += "</tbody></table>"),
		jQuery("#MFLPlayerPopupStats").html(F),
		MFLPlayerPopupIncludeProjections && jQuery("#MFLPlayerPopupProjections").html("<div id='MFLPlayerPopupLoading'><center>Loading Content . . .<br><br><div class='MFLPlayerPopupLoader'></div></center></div>", ),
		(MFLPlayerPopupTracker[0] = 1),
		MFLPlayerPopupInitiate(0);
	}).
	catch((e) = >{
		console.error("Error:", e);
	}),
	fetch(`$ {
		baseURLDynamic
	}
	/${year}/news_articles ? PLAYERS = $ {
		e
	} & DAYS = 30`).then((e) = >{
		if (!e.ok) throw new Error(`Error: $ {
			e.status
		}
		$ {
			e.statusText
		}`);
		return e.text();
	}).then((t) = >{
		fetch(`$ {
			baseURLDynamic
		}
		/${year}/news_articles ? TEAM = $ {
			a
		} & SOURCE = RotoWire & DAYS = 30`, ).then((e) = >{
			if (!e.ok) throw new Error(`Error: $ {
				e.status
			}
			$ {
				e.statusText
			}`);
			return e.text();
		}).then((r) = >{
			var o = "";
			jQuery(t).find(".report tr").length < 2 && ((t = r), (o = "<h3 class='warning'>No News for Player - Showing Recent News for " + a + "</h3>"));
			var i = "<table class='popreport'>" + o + "<tbody>",
			l = 0;
			jQuery(t).find(".report tr").each(function() {
				if (l > 0) {
					var t = jQuery(this).find("td:eq(1) a").attr("href"),
					a = e + "_" + l;
					jQuery(this).find("td a").contents().unwrap();
					var r = jQuery(this).find("td:eq(2)").html(); (r = (r = r.replace("Analysis:", "<br><br><b>Analysis:</b>", )).replace("(More)", "(<span class='MFLPlayerPopupMoreNews warning' onclick='MFLPlayerPopupMoreNews(\"" + t + '","' + a + "\")'>More</span>)", )),
					(i += "<tr class='oddtablerow headline'><th>" + jQuery(this).find("td:eq(1)").html() + "<span>" + jQuery(this).find("td:eq(3)").html() + " ago</span></th></tr>"),
					(i += "<tr class='eventablerow article'><td id='" + a + "' style='position:relative'>" + r + "</td></tr>");
				}
				l++;
			}),
			(i += "</tbody></table>"),
			jQuery("#MFLPlayerPopupNews").html(i);
		}).
		catch((e) = >{
			console.error("Error fetching newsData2:", e);
		});
	}).
	catch((e) = >{
		console.error("Error fetching newsData:", e);
	}),
	(MFLPlayerPopupTracker[1] = 1),
	MFLPlayerPopupInitiate(0);
}
function MFLPlayerPopupArticlePopulate(e, t, a) {
	jQuery("#MFLPlayerPopupContainer #MFLPlayerPopupLoading").show(),
	jQuery("#MFLPlayerPopupLoaded").hide(),
	jQuery("#MFLPlayerPopupArticleLoaded").hide(),
	fetch(`$ {
		baseURLDynamic
	}
	/${year}/view_news_article ? ID = $ {
		a
	}`).then((e) = >{
		if (!e.ok) throw new Error(`Error: $ {
			e.status
		}
		$ {
			e.statusText
		}`);
		return e.text();
	}).then((t) = >{
		var a = 0,
		r = "";
		jQuery(t).find(".report tr").each(function() {
			1 === a && (jQuery(this).find("td a").contents().unwrap(), (r = jQuery(this).find("td:eq(0)").html()).indexOf("Article Link", ) > 0 && (r = r.substring(0, r.indexOf("Article Link") - 2)), r.indexOf("Roto Pass from") > 0 && (r = r.substring(0, r.indexOf("Roto Pass from") - 3))),
			a++;
		}),
		jQuery("#MFLPlayerPopupArticleLoaded").html("<table class='popreport'><tbody><tr class='oddtablerow headline'><th>" + e + "</th></tr><tr class='eventablerow article'><td>" + r + "</td></tr></tbody></table>", ),
		MFLPlayerPopupInitiate(1);
	}).
	catch((e) = >{
		console.error("Error fetching articleData:", e);
	});
}
function MFLPlayerPopupPopulateOnload(e) {
	e ? (MFLPlayerPopupNotificationPreSetup(), setTimeout("MFLPlayerPopupPopulateNotification(true)", 200)) : MFLPlayerPopupPopulateNotification(!1),
	jQuery(".toggle_module_login").hide(),
	jQuery(".toggle_module_search").hide(),
	jQuery(".skinSelectorContainer").hide();
}
function MFLPlayerPopupPopulateNotification(e) {
	if (((MFLPlayerPopupTracker = new Array()), (MFLPlayerPopupOnloadContent[0] = ""), (MFLPlayerPopupOnloadContent[1] = ""), (MFLPlayerPopupOnloadContent[2] = ""), (MFLPlayerPopupOnloadContent[3] = ""), (MFLPlayerPopupOnloadContent[4] = ""), jQuery("#MFLPlayerPopupContainer #MFLPlayerPopupLoading").show(), jQuery("#MFLPlayerPopupLoaded").hide(), jQuery("#MFLPlayerPopupArticleLoaded").hide(), MFLPopupEnableTrade ? fetch(`$ {
		baseURLDynamic
	}
	/${year}/home / $ {
		league_id
	} ? MODULE = TRADES`).then((e) = >{
		if (!e.ok) throw new Error(`Error: $ {
			e.status
		}
		$ {
			e.statusText
		}`);
		return e.text();
	}).then((t) = >{
		jQuery(t).find("#trades td").each(function() { - 1 !== jQuery(this).text().indexOf("proposed by me") && parseInt(jQuery(this).text()) > 0 && (MFLPlayerPopupOnloadContent[0] = jQuery(t).find("#trades").parent().html()),
			-1 !== jQuery(this).text().indexOf("proposed by others") && parseInt(jQuery(this).text()) > 0 && (MFLPlayerPopupOnloadContent[0] = jQuery(t).find("#trades").parent().html()),
			-1 !== jQuery(this).text().indexOf("awaiting your review") && parseInt(jQuery(this).text()) > 0 && (MFLPlayerPopupOnloadContent[0] = jQuery(t).find("#trades").parent().html()),
			-1 !== jQuery(this).text().indexOf("pending commissioner review") && parseInt(jQuery(this).text()) > 0 && (MFLPlayerPopupOnloadContent[0] = jQuery(t).find("#trades").parent().html());
		}),
		(MFLPlayerPopupTracker[0] = 1),
		MFLPlayerPopupNotificationSetup(e);
	}).
	catch((e) = >{
		console.error("Error fetching tradeData:", e);
	}) : ((MFLPlayerPopupTracker[0] = 1), MFLPlayerPopupNotificationSetup(e)), MFLPopupEnableTradePoll)) {
		fetch(`$ {
			baseURLDynamic
		}
		/${year}/options ? L = $ {
			league_id
		} & O = 69`).then((e) = >{
			if (!e.ok) throw new Error(`Error: $ {
				e.status
			}
			$ {
				e.statusText
			}`);
			return e.text();
		}).then((t) = >{
			jQuery(t).find('table.report[id^="poll_"]').each(function() { - 1 !== jQuery(this).find("th:eq(0)").text().indexOf("gave up") && (MFLPlayerPopupOnloadContent[1] += jQuery(this).parent().parent().html());
			}),
			(MFLPlayerPopupTracker[1] = 1),
			MFLPlayerPopupNotificationSetup(e);
		}).
		catch((e) = >{
			console.error("Error fetching pollData:", e);
		});
	} else(MFLPlayerPopupTracker[1] = 1),
	MFLPlayerPopupNotificationSetup(e);
	MFLPopupEnableReminders || MFLPopupEnableMessages ? fetch(`$ {
		baseURLDynamic
	}
	/${year}/home / $ {
		league_id
	}`).then(function(e) {
		if (e.ok) return e.text();
		throw new Error("Network response was not ok.");
	}).then(function(t) {
		MFLPopupEnableReminders && jQuery(t).find("#league_reminders").each(function() {
			MFLPlayerPopupOnloadContent[2] = "<table align='center' cellspacing='1' class='homepagemodule report'>" + jQuery(this).html() + "</table>";
		}),
		(MFLPlayerPopupTracker[2] = 1),
		MFLPopupEnableMessages && jQuery(t).find(".homepagemessage:not(#league_reminders)").each(function() {
			MFLPlayerPopupOnloadContent[3] += "<table align='center' cellspacing='1' class='homepagemodule report'>" + jQuery(this).html() + "</table>";
		}),
		(MFLPlayerPopupTracker[3] = 1),
		MFLPlayerPopupNotificationSetup(e);
	}).
	catch(function(e) {
		console.log("Error:", e);
	}) : ((MFLPlayerPopupTracker[2] = 1), (MFLPlayerPopupTracker[3] = 1), MFLPlayerPopupNotificationSetup(e)),
	MFLPopupEnableCommishMessage && "" !== MFLPopupCommishMessage ? ((MFLPlayerPopupOnloadContent[4] = "<table align='center' cellspacing='1' class='homepagemodule report'><tr><th>From the Commissioner's Desk</th></tr><tr class='oddtablerow'><td>" + MFLPopupCommishMessage + "</td></tr></table>"), (MFLPlayerPopupTracker[4] = 1), MFLPlayerPopupNotificationSetup(e)) : ((MFLPlayerPopupTracker[4] = 1), MFLPlayerPopupNotificationSetup(e));
}
function MFLPlayerPopupNewsIcon(e) {
	$('#body_lineup table.report tr a[href*="player?L="][href*="P="]').closest("td").addClass("player"),
	$("body").find('a[href*="player?L="][href*="P="]').each(function() {
		if (!$(this).parents().is("#MFLPlayerPopupLinks") && !$(this).parents().is("#player_stats_table") && !$(this).parents().is(".biohistory")) {
			var e = jQuery(this).attr("href").substring(jQuery(this).attr("href").indexOf("P=") + 2, jQuery(this).attr("href").length, );
			jQuery(this).html().replace(/[\\"']/g, "\\").replace(/\u0000/g, "\\0");
			if ("undefined" == typeof newsBreaker) var t = "news",
			a = MFLPlayerPopupNewsOld;
			else if (void 0 === newsBreaker["pid_" + e]) { (t = "no news"),
				(a = MFLPlayerPopupNewsNone);
				var r = "cursor:pointer;pointer-events:all;";
			} else if (0 === newsBreaker["pid_" + e])(t = "new news"),
			(a = MFLPlayerPopupNewsNew),
			(r = "cursor:pointer;pointer-events:all;");
			else(t = "recent news"),
			(a = MFLPlayerPopupNewsOld),
			(r = "cursor:pointer;pointer-events:all;");
			if (0 === $(this).children(".playerPopupIcon").length) {
				jQuery(this).attr("href").substring(jQuery(this).attr("href").indexOf("P=") + 2, jQuery(this).attr("href").length, ),
				jQuery(this).html().replace(/[\\"']/g, "\\").replace(/\u0000/g, "\\0");
				jQuery(this).append('<img src="' + a + '" alt="' + t + '"  style="' + r + '" title="' + t + '" class="playerPopupIcon" />', ),
				jQuery(this).off().on("click",
				function() {
					return MFLPlayerPopupSetup(e, jQuery(this).html()),
					!1;
				});
			}
		}
	});
}
function MFLPlayerPopupArticleIcon() {
	jQuery("body").find("td.headline a").each(function() {
		var e = jQuery(this).html().replace(/[\\"']/g, "\\jQuery&").replace(/\u0000/g, "\\0"),
		t = jQuery(this).closest("tr").find("td.timestamp").html(),
		a = jQuery(this).attr("href").substring(jQuery(this).attr("href").indexOf("ID=") + 3, jQuery(this).attr("href").length, );
		$(this).siblings(".playerPopupIcon").length || (jQuery(this).after('<img src="' + MFLPlayerPopupNewsOld + '"  style="cursor:pointer;pointer-events:all;"  onclick="MFLPlayerPopupArticleSetup(\'' + e + "','" + t + "','" + a + '\')" class="playerPopupIcon" />', ), jQuery(this).off().on("click",
		function() {
			return MFLPlayerPopupArticleSetup(jQuery(this).html(), t, a),
			!1;
		}));
	});
}
function MFLPlayerPopupInitiate(e) {
	0 === e && 1 === MFLPlayerPopupTracker[0] && 1 === MFLPlayerPopupTracker[1] && (jQuery("#MFLPlayerPopupNews").show(), jQuery("#MFLPlayerPopupTabLinksNews").addClass("active"), jQuery("#MFLPlayerPopupContainer #MFLPlayerPopupLoading").hide(), jQuery("#MFLPlayerPopupArticleLoaded").hide(), jQuery("#MFLPlayerPopupLoaded").show(), jQuery("#MFLPlayerPopupNews").scrollTop(0), jQuery("#MFLPlayerPopupBio").scrollTop(0), jQuery("#MFLPlayerPopupStats").scrollTop(0), jQuery("#MFLPlayerPopupProjections").scrollTop(0), jQuery("#MFLPlayerPopupStatsHistory").scrollTop(0), $("#MFLPlayerPopupNews").addClass("active_div_tab_scroll")),
	1 === e && (jQuery("#MFLPlayerPopupContainer #MFLPlayerPopupLoading").hide(), jQuery("#MFLPlayerPopupLoaded").hide(), jQuery("#MFLPlayerPopupArticleLoaded").show()),
	2 === e && (jQuery("#MFLPlayerPopupContainer #MFLPlayerPopupLoading").hide(), jQuery("#MFLPlayerPopupLoaded").show(), jQuery("#MFLPlayerPopupArticleLoaded").hide(), setCookie("MFLPlayerPopup_" + year + "_" + league_id + "_" + franchise_id, ));
}
function addNewsIcon(e) {
	"undefined" != typeof newsBreaker ? (MFLPopupEnablePlayerNews && MFLPlayerPopupNewsIcon("body"), MFLPopupEnableArticle && MFLPlayerPopupArticleIcon("body_home")) : e < 5 && setTimeout(function() {
		addNewsIcon(e + 1);
	},
	100);
}
if (($(document).on("click", '#roster_column_middle a[href*="player?L="][href*="P="]',
function(e) {
	return (e.preventDefault(), MFLPlayerPopupSetup(jQuery(this).attr("href").substring(jQuery(this).attr("href").indexOf("P=") + 2, jQuery(this).attr("href").length, ), jQuery(this).html().replace(/[\\"']/g, "\\").replace(/\u0000/g, "\\0"), ), !1);
},
), setTimeout(function() {
	addNewsIcon(5);
},
100), jQuery(document).ready(function() {
	addNewsIcon(0);
}), MFLPopupOmitStatus && jQuery("head").append("<style>#MFLPlayerPopupStats th:nth-child(4), #MFLPlayerPopupStats td:nth-child(4) {display:none}</style>", ), ShowMFLlogin)) {
	function toggleLogin() {
		jQuery(".skinSelectorContainer").fadeOut(700),
		"none" === jQuery(".toggle_module_login").css("display") ? (jQuery(".toggle_module_login").show(700), jQuery(".toggle_module_search").hide(700)) : jQuery(".toggle_module_login").hide(700);
	}
	jQuery("head").append("<style>.pageheader .welcome{display:none}.toggle_login_content td b{display:block}.toggle_login_content td{text-align:center;font-size:90%}.toggle_module_login{position:absolute;z-index:999999;width:18.75rem;width:18.750rem;margin-top:0.313rem;margin-top:0.313rem;margin-left:-5.938rem;}</style>", ),
	$("head").append("<style>li.notification-icon-login{display:inline-block!important}</style>", ),
	$("#icon-wrapper-mobile,#icon-wrapper").show(),
	jQuery(".pageheader .welcome").appendTo(".toggle_login_content .oddtablerow", ),
	jQuery(".toggle_login_content .welcome small").remove(),
	jQuery(".toggle_login_content .welcome").removeClass();
}
if (ShowMFLsearch) {
	function toggleSearch() {
		jQuery(".skinSelectorContainer").fadeOut(700),
		"none" === jQuery(".toggle_module_search").css("display") ? (jQuery(".toggle_module_search").show(700), jQuery(".toggle_module_login").hide(700)) : jQuery(".toggle_module_search").hide(700);
	}
	jQuery("head").append("<style>.toggle_search_content td{text-align:center;font-size:90%}.toggle_search_content input[type='submit']{margin:0 0.313rem;margin:0 0.313rem;border-radius:0.188rem;border-radius:0.188rem;padding:0.188rem;padding:0.188rem}.toggle_search_content input{position:relative;display:inline}.toggle_module_search{position:absolute;z-index:999999;width:18.75rem;margin-top:0.313rem;margin-left:-8.125rem;}.toggle_search_content td,.toggle_search_content form,.toggle_search_content input{vertical-align:middle;}</style>", ),
	$("head").append("<style>li.notification-icon-search{display:inline-block!important}</style>", ),
	$("#icon-wrapper-mobile,#icon-wrapper").show();
}
function triggerPlayerPopup() { (triggerPlayerPopup_ran = !0),
	MFLPopupEnableReminders && jQuery("#body_home .homepagemessage").css("display", "none"),
	MFLPopupEnableMessages && jQuery("#league_reminders").css("display", "none"),
	MFLPlayerPopupSetupTeamNames(),
	0 === jQuery("#MFLPlayerPopupContainer").length && MFLPlayerPopupCreateContainer(),
	"undefined" != typeof franchise_id && (MFLPopupEnableTrade || MFLPopupEnableTradePoll || MFLPopupEnableReminders || MFLPopupEnableMessages || (MFLPopupEnableCommishMessage && "" !== MFLPopupCommishMessage)) && MFLPopupEnableAutoNotification && !getCookie("MFLPlayerPopup_" + year + "_" + league_id + "_" + franchise_id, ) && MFLPlayerPopupPopulateOnload(!1),
	fetch(`$ {
		baseURLDynamic
	}
	/${year}/home / $ {
		league_id
	} ? MODULE = ROSTER`).then((e) = >{
		if (!e.ok) throw new Error(`Error: $ {
			e.status
		}
		$ {
			e.statusText
		}`);
		return e.text();
	}).then((e) = >{
		for (var t in MFLPlayerPopupExtraTitles) MFLPlayerPopupExtraTitles.hasOwnProperty(t) && jQuery(e).find('th[class="' + t + '"]').length > 0 && (MFLPlayerPopupExtraTitles[t] = jQuery(e).find('th[class="' + t + '"]').text());
	}).
	catch((e) = >{
		console.error("Error fetching extrasTitleData:", e);
	});
}
function playerPopupListenerCheck() {
	triggerPlayerPopup_count++,
	"undefined" != typeof reportFiveMinuteFullyLoaded && reportFiveMinuteFullyLoaded && (clearInterval(playerPopupListener), triggerPlayerPopup_ran || triggerPlayerPopup()),
	triggerPlayerPopup_count > 50 && (clearInterval(playerPopupListener), console.log("Stop trying Player Popup after 5 seconds"));
}
if ((LoginSearchMobileCSS && jQuery(window).width() < 768 && ((jQuery.fn.toggle_center = function() {
	return (this.css("position", "absolute"), this.css("left", Math.max(0, (jQuery(window).width() - jQuery(this).outerWidth()) / 2 + jQuery(window).scrollLeft(), ) + "px", ), this);
}), jQuery(".toggle_module_search,.toggle_module_login").toggle_center(), jQuery("head").append("<style>.toggle_module_search,.toggle_module_login{margin-left:-8.125rem;margin-top:0.875rem}#skinSelectorContainer{margin-top:0.875rem}</style>", )), "undefined" != typeof franchise_id && (MFLPopupEnableTrade || MFLPopupEnableTradePoll || MFLPopupEnableReminders || MFLPopupEnableMessages || (MFLPopupEnableCommishMessage && "" !== MFLPopupCommishMessage)) && ($("head").append("<style>li.notification-icon-popup{display:inline-block!important}</style>", ), $("#icon-wrapper-mobile,#icon-wrapper").show()), void 0 === triggerPlayerPopup_ran)) var triggerPlayerPopup_ran = !1;
if (void 0 === triggerPlayerPopup_count) var triggerPlayerPopup_count = 0;
if (void 0 === playerPopupListener) var playerPopupListener = setInterval("playerPopupListenerCheck()", 100);
if (MFLScoreDetailsPopup) {
	if (void 0 === detailsOverlay) var detailsOverlay = "rgba(0,0,0,.7)";
	if (void 0 === detailsWrapBG) var detailsWrapBG = "#fff";
	if (void 0 === detailsWrapBorder) var detailsWrapBorder = "#000";
	if (void 0 === detailsWrapBorWidh) var detailsWrapBorWidh = "0";
	if (void 0 === detailsWrapBoxShdw) var detailsWrapBoxShdw = "0 0 0.188rem 0.188rem rgba(0,0,0,.1)";
	if (void 0 === detailsWrapPadding) var detailsWrapPadding = "0.625rem";
	if (void 0 === detailsWrapRadius) var detailsWrapRadius = "0.188rem";
	$("body").append('<div class="scoredetailsWrap" style="display:none;position:fixed;height:100%;width:100%;background:' + detailsOverlay + ';left:0;top:0;z-index:999991"></div><div id="ScoreDetails" class="detailsReportWrap" style="z-index: 999991;display:none;max-width:31.25rem;width:96%;margin:auto;position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);background:' + detailsWrapBG + ";border:" + detailsWrapBorWidh + " solid " + detailsWrapBorder + ";box-shadow:" + detailsWrapBoxShdw + ";border-radius:" + detailsWrapRadius + ";padding:" + detailsWrapPadding + ';max-height: 90%;overflow:auto"><table><caption><span></span></caption><span id="MFLPlayerPopupClose">X</span><tbody></tbody></table></div><div id="ScoreNFLDetails" class="detailsReportWrap" style="z-index: 999991;display:none;max-width:31.25rem;width:96%;margin:auto;position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);background:' + detailsWrapBG + ";border:" + detailsWrapBorWidh + " solid " + detailsWrapBorder + ";box-shadow:" + detailsWrapBoxShdw + ";border-radius:" + detailsWrapRadius + ";padding:" + detailsWrapPadding + ';max-height:90%;overflow:auto"><table><caption><span></span></caption><span id="MFLPlayerPopupClose">X</span><tbody><tr><td><div id="teamToggles"><div class="leftT" style="vertical-align:top;display:inline-block;width:50%;text-align:center"><input type="submit" value="" style="min-width:6.25rem;outline:none"></div><div class="rightT" style="vertical-align:top;opacity:.5;display:inline-block;width:50%;text-align:center"><input type="submit" value="" style="min-width:6.25rem;outline:none"></div></div></td></tr></tbody><tbody id="leftTeam"></tbody><tbody id="rightTeam" style="display:none"></tbody></table></div><style>a[href*="&MATCHUP=%2CFA"],a[href*="MATCHUP=FA%2C"]{display:none}table.scoring_details_table td.points,table.box_details_table td,table.box_details_table th {text-align:center!important}table.scoring_details_table th,table.scoring_details_table td,table.box_details_table td:nth-child(1),table.box_details_table tr:nth-child(2) > th:nth-child(1){text-align:left!important}#body_ajax_ls td.ls_game_info{pointer-events:none}</style>', ),
	$(document).ready(function() {
		$('#body_options_08 td.points.tot a[href*="player?L"][href*="P="],#body_top td.points.tot a[href*="player?L"][href*="P="]', ).contents().unwrap();
	}),
	$("body").on("click", ".scoredetailsWrap",
	function() {
		$("#ScoreDetails tbody,#leftTeam ,#rightTeam").html(""),
		$(".scoredetailsWrap,#ScoreDetails,#ScoreNFLDetails").hide(),
		$("#teamToggles input").val(""),
		$("#fullSeasonPts").remove(),
		$("#ScoreNFLDetails table").removeClass("box_details_table"),
		$("#ScoreDetails table").removeClass("scoring_details_table overview_details_table", ),
		$("a").removeClass("dblClicks");
		try {
			bodyScrollLock.clearAllBodyScrollLocks();
		} catch(e) {}
	}),
	$("body").on("click", ".dblClicks",
	function(e) {
		e.preventDefault();
	}),
	$("body").on("click", '.report a[href*="detailed?L"][href*="P="]:not(#player_records a):not(#body_options_157 a)',
	function(e) {
		$(".detailsReportWrap table").addClass("report");
		var t = $(this).attr("href"),
		a = t.substring(t.indexOf("detailed?") - 1, t.length),
		r = `$ {
			baseURLDynamic
		}
		/${year}/$ {
			a
		} & PRINTER = 1`;
		if (this.href.substring(this.href.indexOf("YEAR=") + 5, this.href.length, ) < year) var o = !0;
		fetch(r).then((e) = >e.text()).then((e) = >{
			var t = $(e).find(".report tbody");
			$("#ScoreDetails caption span").html("Scoring Breakdown"),
			$("#fullSeasonPts").remove(),
			$("#ScoreDetails tbody").replaceWith(t),
			$("#ScoreNFLDetails table").removeClass("box_details_table"),
			$("#ScoreDetails table").removeClass("overview_details_table"),
			$("#ScoreDetails table").addClass("scoring_details_table"),
			o && ($('a[href*="&MATCHUP="]').remove(), $("#ScoreDetails tr.oddtablerow:nth-child(2) td:nth-child(1)", ).css("visibility", "hidden"), $("#ScoreDetails tr.oddtablerow:nth-child(2) td:nth-child(1) b", ).css("visibility", "visible")),
			$('#ScoreDetails td b a[class*="position_').attr("href",
			function(e, t) {
				return t.replace("&PRINTER=1", "");
			},
			),
			$('a[href*="&MATCHUP=%2CFA"],a[href*="MATCHUP=FA%2C"]').remove();
			try {
				MFLPlayerPopupNewsIcon("ScoreDetails");
			} catch(e) {}
			$(".scoredetailsWrap,#ScoreDetails").show();
			const a = document.querySelector("#ScoreDetails");
			try {
				bodyScrollLock.disableBodyScroll(a);
			} catch(e) {}
			$("#leftTeam ,#rightTeam").html(""),
			$("#teamToggles input").val(""),
			$("#ScoreNFLDetails").hide(),
			$("#ScoreDetails #MFLPlayerPopupClose").on("click",
			function() {
				$("#ScoreDetails tbody").html(""),
				$(".scoredetailsWrap,#ScoreDetails").hide();
				try {
					bodyScrollLock.clearAllBodyScrollLocks();
				} catch(e) {}
				$("#ScoreNFLDetails table").removeClass("box_details_table"),
				$("#ScoreDetails table").removeClass("scoring_details_table overview_details_table", ),
				$("a").removeClass("dblClicks");
			});
		}).
		catch((e) = >{
			console.error("Error:", e);
		}),
		e.preventDefault();
	},
	),
	$("body").on("click", '.report a[href*="MATCHUP"]',
	function(e) {
		$("#fullSeasonPts").remove(),
		$(".detailsReportWrap table").addClass("report");
		var t = `$ {
			$(this).attr("href")
		} & PRINTER = 1`;
		$("#ScoreNFLDetails caption span").html("Detailed Results"),
		fetch(t).then((e) = >e.text()).then((e) = >{
			var t = $(e).find("td.two_column_layout:nth-of-type(1) .report tbody:nth-child(2)", ).contents(),
			a = $(e).find("td.two_column_layout:nth-of-type(2) .report tbody:nth-child(2)", ).contents(),
			r = $(e).find("td.two_column_layout:nth-of-type(1) .report caption:nth-child(1) span", ).text(),
			o = $(e).find("td.two_column_layout:nth-of-type(2) .report caption:nth-child(1) span", ).text();
			$("#fullSeasonPts").remove(),
			$("#ScoreDetails table").removeClass("scoring_details_table overview_details_table", ),
			$("#ScoreNFLDetails table").addClass("box_details_table"),
			$("tbody#leftTeam").html(t),
			$("tbody#rightTeam").html(a),
			$('#ScoreNFLDetails td a[class*="position_').attr("href",
			function(e, t) {
				return t.replace("&PRINTER=1", "");
			},
			),
			$("#teamToggles .leftT input").val(r),
			$("#teamToggles .rightT input").val(o),
			$('a[href*="&MATCHUP=%2CFA"],a[href*="MATCHUP=FA%2C"]').remove(),
			$("#ScoreDetails tbody").html(""),
			$("#ScoreDetails").hide(),
			$(".scoredetailsWrap,#ScoreNFLDetails").show();
			const i = document.querySelector("#ScoreNFLDetails");
			try {
				bodyScrollLock.disableBodyScroll(i);
			} catch(e) {}
			$(".leftT").click(function() {
				$(this).css("opacity", "1"),
				$(".rightT").css("opacity", ".5"),
				$("#leftTeam").show(),
				$("#rightTeam").hide();
			}),
			$(".rightT").click(function() {
				$(this).css("opacity", "1"),
				$(".leftT").css("opacity", ".5"),
				$("#leftTeam").hide(),
				$("#rightTeam").show();
			}),
			$("#ScoreNFLDetails #MFLPlayerPopupClose").on("click",
			function() {
				$("#leftTeam ,#rightTeam").html(""),
				$("#teamToggles input").val(""),
				$(".scoredetailsWrap,#ScoreNFLDetails").hide();
				try {
					bodyScrollLock.clearAllBodyScrollLocks();
				} catch(e) {}
				$("#ScoreNFLDetails table").removeClass("box_details_table"),
				$("#ScoreDetails table").removeClass("scoring_details_table overview_details_table", ),
				$("a").removeClass("dblClicks");
			},
			),
			$('.box_details_table a[href*="player?"]').length ? ($("#teamToggles").show(), $(".no_detail_data").remove()) : $(".no_detail_data").length < 1 && ($("#teamToggles").hide(), $("#teamToggles").after('<div class="no_detail_data"><h3 class="warning">Game Not Started</h3></div>', ));
			try {
				MFLPlayerPopupNewsIcon("ScoreDetails"),
				MFLPlayerPopupNewsIcon("ScoreNFLDetails");
			} catch(e) {}
		}).
		catch((e) = >{
			console.error("Error:", e);
		}),
		e.preventDefault();
	}),
	$("body").on("click", '.report a[href*="options?L="][href*="O=08"][href*="PLAYER_ID="]:not(#body_options_08 a):not([class*="dblClicks"])',
	function(e) {
		$(this).addClass("dblClicks"),
		$("#fullSeasonPts").remove(),
		$(".detailsReportWrap table").addClass("report"),
		$('<tbody id="fullSeasonPts"><tr><th colspan="4" style="text-align:center!important">Points Summary</th></tr><tr class="oddtablerow"><td style="text-align:right!important">YTD Pts:</td><td class="dYTDpoints" style="text-align:left!important"></td><td style="text-align:right!important">Avg Pts:</td><td class="dAVGpoints" style="text-align:left!important"></td></tr><tr><th colspan="4" style="text-align:center!important">Weekly Point Totals</th></tr></tbody>', ).insertAfter("#ScoreDetails tbody");
		var t = $(this).attr("href");
		fetch(t + "&PRINTER=1").then((e) = >e.text()).then((e) = >{
			$("#ScoreDetails caption span").html($(e).find(".report tbody td.player a").contents(), ),
			$(e).find(".report td.points.tot").contents().appendTo("td.dYTDpoints"),
			$(e).find(".report td.points.avg").contents().appendTo("td.dAVGpoints");
			for (var t = $(e).find('.report tbody th a[href*="SORT="]:not([href*="SORT=NAME"]):not([href*="SORT=TOT"]):not([href*="SORT=AVG"]):not([href*="SORT=SALARY"]):not([href*="SORT=YEAR"])', ).length, a = "", r = $(e).find("table.report tr:nth-child(2) th:nth-child(5) a").attr("href"), o = parseInt(r.substr(r.indexOf("SORT=") + 5, 2)), i = 5; i < t + 5; i++) i % 2 && (a += '<tr class="dRow">'),
			(a += '<td style="text-align:right!important">Week ' + (o + i - 5) + ":</td>"),
			(a += '<td style="text-align:left!important"> ' + $(e).find("table.report td:nth-child(" + i + ")").html() + "</td>"),
			!i % 2 && (a += "</tr>"); ! t % 2 && (a += "</tr>"),
			$("#fullSeasonPts").append(a),
			$("#ScoreDetails th a").removeAttr("href"),
			$('a[href*="&MATCHUP=%2CFA"],a[href*="MATCHUP=FA%2C"]').remove(),
			$("#ScoreNFLDetails table").removeClass("box_details_table"),
			$("#ScoreDetails table").removeClass("scoring_details_table"),
			$("#ScoreDetails table").addClass("overview_details_table");
			try {
				MFLPlayerPopupNewsIcon("ScoreDetails");
			} catch(e) {}
			$("#ScoreDetails td.dYTDpoints a,#ScoreDetails td.dAVGpoints a").contents().unwrap(),
			$(".scoredetailsWrap,#ScoreDetails").show(),
			$("#leftTeam ,#rightTeam").html(""),
			$("#teamToggles input").val(""),
			$("#ScoreNFLDetails,#TeamDetails,.teamdetailsWrap").hide();
			const l = document.querySelector("#ScoreDetails");
			try {
				bodyScrollLock.disableBodyScroll(l);
			} catch(e) {}
			$("#ScoreDetails #MFLPlayerPopupClose").on("click",
			function() {
				$("#fullSeasonPts").remove(),
				$("#ScoreDetails tbody").html(""),
				$(".scoredetailsWrap,#ScoreDetails").hide();
				try {
					bodyScrollLock.clearAllBodyScrollLocks();
				} catch(e) {}
				$("#ScoreNFLDetails table").removeClass("box_details_table"),
				$("#ScoreDetails table").removeClass("scoring_details_table overview_details_table", ),
				$("a").removeClass("dblClicks");
			}),
			$("#fullSeasonPts td").html(function(e, t) {
				return t.replace(/&nbsp;/g, "0");
			}),
			$("#fullSeasonPts td").html(function(e, t) {
				return t.replace(/B/g, "Bye");
			}),
			$("#fullSeasonPts tr.dRow:odd").addClass("oddtablerow"),
			$("#fullSeasonPts tr.dRow:even").addClass("eventablerow"),
			$("#fullSeasonPts tr:last").children().length < 3 && $("#fullSeasonPts tr:last").append("<td></td><td></td>"),
			$("td.dYTDpoints img").remove();
		}).
		catch((e) = >{
			console.error("Error:", e);
		}),
		e.preventDefault();
	},
	);
}
if (MFLFranchisePopup) {
	if (void 0 === load_playerIcons) var load_playerIcons = !1;
	if (((window.lu_popup_weatherPopup = function(e, t) {
		if ("undefined" == typeof weather) return alert("Weather for this game is not defined"),
		!1;
		if (weather.hasOwnProperty(e) && weather[e].location) {
			var a = document.createElement("style"); (a.innerHTML = ".current-conditions-wrapper{margin-bottom:0.625rem}.current-conditions-wrapper,.kickoff-conditions-wrapper{border:0.188rem solid #ccc;border-radius:0.313rem;padding:0.625rem}.current-conditions-text,.kickoff-conditions-text{font-size:1rem;font-weight:700}.current-conditions-localtime{display:block;font-size:0.688rem;font-style:italic}.current-conditions-temp,.kickoff-conditions-temp{font-size:2.25rem;display:inline-block;vertical-align:top;margin-top:0.25rem;font-weight:700}.current-conditions-extras-wrapper,.kickoff-conditions-extras-wrapper{display:inline-block;vertical-align:top;margin-top:0.625rem;margin-left:0.938rem}.current-conditions-wind-wrapper,.current-conditions-rain-wrapper,.current-conditions-snow-wrapper,.kickoff-conditions-wind-wrapper,.kickoff-conditions-rain-wrapper,.kickoff-conditions-snow-wrapper{display:block}.weather-more-link{text-align:center;margin-top:0.375rem;cursor:pointer}#popup-weather-wrapper.modal{width:100%;height:100%;position:fixed;left:0;top:0;z-index:111111111;background:rgba(0,0,0,.7);display:none}#popup-weather-container{background:#fff;z-index:99999;max-width:31.25rem;width:96%;margin:auto;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);border:0 solid #000;box-shadow:#000 0 0 1.563rem;border-radius:0.188rem;padding:0.625rem;max-height:95%;overflow:auto}img.kickoff-conditions-icon,img.current-conditions-icon{height:3.125rem;width:auto}.weather_caption{line-height:1.875rem;height:1.875rem;position:relative;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%;padding-right:1.438rem}.current-conditions-place{font-size:1.25rem;font-weight:700;max-width:0}.as_close_btn{position:absolute;z-index:1;cursor:pointer;border-radius:0.188rem;text-align:center;border:0.125rem solid transparent;font-weight:700;background:red;color:#fff;right:0;height:1.375rem;width:1.375rem;line-height:1.4;top:50%;transform:translateY(-50%)}.as_close_btn:hover{background:#000;color:#fff}"),
			document.head.appendChild(a);
			let r = document.querySelector("body"),
			o = document.createElement("div"); (o.id = "popup-weather-wrapper"),
			(o.className = "modal"),
			(o.style.display = "none");
			let i = document.createElement("div"); (i.id = "popup-weather-container"),
			(i.className = "modal-content animate"),
			(i.style.display = "none"),
			o.appendChild(i),
			r.appendChild(o);
			let l = ""; (l += '<div id="weather-wrapper">'),
			(l += '<div class="weather_caption"><span class="current-conditions-place">' + weather[e].location.name + ", " + weather[e].location.region + '</span><span class="as_close_btn">X</span></div>'),
			(l += '<div class="current-conditions-wrapper">'),
			(l += '<div class="current-conditions-header"><span class="current-conditions-text">Current Conditions</span><span class="current-conditions-localtime"> last updated ' + weather[e].current.last_updated + " local time</span></div>"),
			(l += '<div class="current-conditions-detail">'),
			(l += '<span class="current-conditions-temp">' + weather[e].current.temp_f + '&degF</span><span class="current-conditions-icon-wrapper"><img class="current-conditions-icon" src="' + weather[e].current.condition.icon + '" /></span>'),
			(l += '<span class="current-conditions-extras-wrapper">'),
			(l += '<span class="current-conditions-wind-wrapper">Wind: <span class="current-conditions-wind-speed">' + weather[e].current.wind_mph + 'mph</span> <span class="current-conditions-wind-direction">' + weather[e].current.wind_dir + "</span></span>");
			for (let t = 0; t < weather[e].forecast.forecastday[0].hour.length; t++) {
				const a = weather[e].forecast.forecastday[0].hour[t],
				r = 0 === t ? a: weather[e].forecast.forecastday[0].hour[t - 1];
				if (a.time_epoch >= currentServerTime) {
					r.chance_of_rain > 0 && (l += '<span class="current-conditions-rain-wrapper">Rain: <span class="current-conditions-chance-of-rain">' + r.chance_of_rain + "%</span></span>"),
					r.chance_of_snow > 0 && (l += '<span class="current-conditions-snow-wrapper">Snow: <span class="current-conditions-chance-of-snow">' + r.chance_of_snow + "%</span></span>");
					break;
				}
			} (l += "</span>"),
			(l += '<div class="current-conditions-text">' + weather[e].current.condition.text + "</div>"),
			(l += "</div>"),
			(l += "</div>"),
			(l += '<div class="kickoff-conditions-wrapper">'),
			(l += '<div class="kickoff-conditions-header"><span class="kickoff-conditions-text">Expected Conditions at Kickoff</span></div>');
			try { (l += '<div class="kickoff-conditions-detail">'),
				(l += '<span class="kickoff-conditions-temp">' + weather[e].kickoff_weather.temp_f + '&degF</span><span class="kickoff-conditions-icon-wrapper"><img class="kickoff-conditions-icon" src="' + weather[e].kickoff_weather.condition.icon + '" /></span>'),
				(l += '<span class="kickoff-conditions-extras-wrapper">'),
				(l += '<span class="kickoff-conditions-wind-wrapper">Wind: <span class="kickoff-conditions-wind-speed">' + weather[e].kickoff_weather.wind_mph + 'mph</span> <span class="kickoff-conditions-wind-direction">' + weather[e].kickoff_weather.wind_dir + "</span></span>"),
				weather[e].kickoff_weather.chance_of_rain > 0 && (l += '<span class="kickoff-conditions-rain-wrapper">Rain: <span class="kickoff-conditions-chance-of-rain">' + weather[e].kickoff_weather.chance_of_rain + "%</span></span>"),
				weather[e].kickoff_weather.chance_of_snow > 0 && (l += '<span class="kickoff-conditions-snow-wrapper">Snow: <span class="kickoff-conditions-chance-of-snow">' + weather[e].kickoff_weather.chance_of_snow + "%</span></span>"),
				(l += "</span>"),
				(l += '<div class="current-conditions-text">' + weather[e].kickoff_weather.condition.text + "</div>");
			} catch(e) {
				l += '<div class="kickoff-conditions-no-data-available" style="color:red">Future forecasts available 72 hours prior to kickoff</div>';
			} (l += "</div>"),
			(l += "</div>"),
			(l += '<div class="weather-more-link"><a onclick="window.open(\'' + t + "', '_blank')\">More at Weather.com</a></div>"),
			(l += "</div>"),
			(i.innerHTML = l),
			(o.style.display = "block"),
			(i.style.display = "block");
			try {
				bodyScrollLock.disableBodyScroll(o);
			} catch(e) {}
			let s = document.querySelector(".teamdetailsWrap"),
			n = document.querySelector("#TeamDetails");
			s && (s.style.display = "none"),
			n && (n.style.display = "none"),
			o.addEventListener("click",
			function(e) {
				e.target === e.currentTarget || e.target.classList.contains("as_close_btn") ? (o.remove(), document.querySelectorAll(".modal").forEach((e) = >(e.style.display = "none")), document.querySelectorAll(".modal-content").forEach((e) = >(e.style.display = "none")), s && (s.style.display = "block"), n && (n.style.display = "block")) : (s && (s.style.display = "block"), n && (n.style.display = "block"));
			});
		} else alert("Weather for this game is not defined");
	}), $("body").append('<div class="teamdetailsWrap" style="display:none;position:fixed;height:100%;width:100%;background:' + detailsOverlay + ';left:0;top:0;z-index:99999"></div><div id="TeamDetails" class="detailsReportWrap" style="z-index:99999;display:none;max-width:31.25rem;width:96%;margin:auto;position:fixed;top:3.125rem;left:50%;transform:translate(-50%, 0%);background:' + detailsWrapBG + ";border:" + detailsWrapBorWidh + " solid " + detailsWrapBorder + ";box-shadow:" + detailsWrapBoxShdw + ";border-radius:" + detailsWrapRadius + ";padding:" + detailsWrapPadding + ';max-height: calc(90% - 3.125rem);overflow:auto"><table><caption><span></span></caption><span id="MFLPlayerPopupClose">X</span><tbody id="allTabview"><tr><td colspan="100"><div class="MFLPopTabWrap" style="margin:0"><ul class="MFLPlayerPopupTab" style="padding:0"><li class="MFLPlayerPopupPlayerTabs" id="frachiseBioTab"><a class="MFLPlayerPopupTabLinks active">Bio</a></li><li class="MFLPlayerPopupPlayerTabs" id="frachiseRostersTab"><a class="MFLPlayerPopupTabLinks">Roster</a></li><li class="MFLPlayerPopupPlayerTabs" id="frachiseScheduleTab"><a class="MFLPlayerPopupTabLinks">Schedule</a></li><li class="MFLPlayerPopupPlayerTabs" id="frachiseAwardsTab"><a class="MFLPlayerPopupTabLinks">Awards</a></li></ul></div></td></tr></tbody><tbody id="ownerTabview"><tr><td colspan="100"><div class="MFLPopTabWrap" style="margin:0"><ul class="MFLPlayerPopupTab" style="padding:0"><li class="MFLPlayerPopupPlayerTabs" id="frachiseLineupTab"><a class="MFLPlayerPopupTabLinks">Lineup</a></li><li class="MFLPlayerPopupPlayerTabs" id="frachiseOptionsTab"><a class="MFLPlayerPopupTabLinks">Options</a></li><li class="MFLPlayerPopupPlayerTabs" id="frachiseNewsTab"><a class="MFLPlayerPopupTabLinks">News</a></li><li class="MFLPlayerPopupPlayerTabs" id="frachiseWatchTab"><a class="MFLPlayerPopupTabLinks">WatchList</a></li></ul></div></td></tr></tbody><tbody id="teamLinks"><tr><td colspan="100" style="text-align:center"><div><ul><li id="full_profile_link"><a>Full Profile</a></li><li id="propose_trade_link"><a>Propose Trade</a></li><li id="trade_bait_link"><a>Trade Bait</a></li><li id="transactions_link"><a>Transactions</a></li></ul></div></td></tr></tbody><tbody class="TeamData team_roster_table" style="display:none"></tbody><tbody class="TeamData team_bio_table" style="display:none"></tbody><tbody class="TeamData team_schedule_table" style="display:none"></tbody><tbody class="TeamData team_awards_table" style="display:none"></tbody><tbody class="TeamData team_lineup_table" style="display:none"></tbody><tbody class="TeamData team_options_table" style="display:none"></tbody><tbody class="TeamData team_news_table" style="display:none"></tbody><tbody class="TeamData team_watch_table" style="display:none"></tbody></table></div><style>#TeamDetails caption span img{height:2.5rem;vertical-align:middle;width:auto}#TeamDetails ul.MFLPlayerPopupTab{display:flex;padding:0 0.188rem;}#TeamDetails li.MFLPlayerPopupPlayerTabs{flex:1;margin:0;cursor:pointer}#TeamDetails ul.MFLPlayerPopupTab li a:hover{text-decoration:none}#teamLinks ul{display:table;width:100%;margin:0;padding:0.188rem 0}#teamLinks li{display:inline-block;padding:0 0.313rem;margin:0;list-style:none;cursor:pointer;text-align:center}#teamLinks li a:hover,#teamLinks li a:visited, #teamLinks li a:link{text-decoration:none!important}#ownerTabview td div ul{margin-top:0.25rem}.TeamData.team_roster_table td,.TeamData.team_roster_table th{text-align:center!important}.TeamData.team_roster_table td.player,.TeamData.team_roster_table th.player{text-align:left!important}.team_schedule_table .week,.team_schedule_table .points{text-align:center!important}.team_schedule_table th.matchup,.team_schedule_table td{text-align:left!important}.team_schedule_table img{width:auto;height:1.875rem}.team_awards_table td,.team_awards_table th{text-align:center!important}.team_awards_table td.awardtitle,.team_awards_table th.awardtitle{text-align:left!important}.team_awards_table .franchisename,.team_awards_table .comments{display:none}.team_options_table td{text-align:left!important}.team_bio_table td[class="inputlabel"]{text-align:right!important;white-space:nowrap}.team_bio_table td{text-align:left!important}.team_news_table td,.team_news_table th{text-align:center!important}.team_news_table td.headline,.team_news_table th.headline{text-align:left!important}.team_watch_table td,.team_watch_table th{text-align:center!important}.team_watch_table td.player+td,.team_watch_table td.player,.team_watch_table th:nth-child(1){text-align:left!important}.TeamData.team_roster_table th[colspan="3"]{text-align:right!important}.team_roster_table th:nth-child(9),.team_roster_table td:nth-child(9),.team_roster_table th:nth-child(8),.team_roster_table td:nth-child(8),.team_roster_table th:nth-child(7),.team_roster_table td:nth-child(7),.team_roster_table th:nth-child(6),.team_roster_table td:nth-child(6),.team_roster_table th:nth-child(5),.team_roster_table td:nth-child(5),.team_roster_table th[colspan="3"] + th + th,.team_roster_table th[colspan="3"] + th + th + th,.team_roster_table th[colspan="3"] + th + th + th + th,.team_roster_table td[colspan="3"] + td + td,.team_roster_table td[colspan="3"] + td + td + td,.team_roster_table td[colspan="3"] + td + td + td + td{display:none}.current-conditions-wrapper{margin-bottom:0.625rem}.current-conditions-wrapper,.kickoff-conditions-wrapper{border:0.188rem solid #ccc;border-radius:0.313rem;padding:0.625rem}.current-conditions-text,.kickoff-conditions-text{font-size:1rem;font-weight:700}.current-conditions-localtime{display:block;font-size:0.688rem;font-style:italic}.current-conditions-temp,.kickoff-conditions-temp{font-size:2.25rem;display:inline-block;vertical-align:top;margin-top:0.25rem;font-weight:700}.current-conditions-extras-wrapper,.kickoff-conditions-extras-wrapper{display:inline-block;vertical-align:top;margin-top:0.625rem;margin-left:0.938rem}.current-conditions-wind-wrapper,.current-conditions-rain-wrapper,.current-conditions-snow-wrapper,.kickoff-conditions-wind-wrapper,.kickoff-conditions-rain-wrapper,.kickoff-conditions-snow-wrapper{display:block}.team_lineup_table .reportnavigation{display:none}.weather-more-link{text-align:center;margin-top:0.375rem;cursor:pointer}#popup-weather-wrapper.modal{width:100%;height:100%;position:fixed;left:0;top:0;z-index:111111111;background:rgba(0,0,0,.7);display:none}#popup-weather-container{background:#fff;z-index:99999;max-width:31.25rem;width:96%;margin:auto;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);border:0 solid #000;box-shadow:#000 0 0 1.563rem;border-radius:0.188rem;padding:0.625rem;max-height:95%;overflow:auto}img.kickoff-conditions-icon,img.current-conditions-icon{height:3.125rem;width:auto}.weather_caption{line-height:1.875rem;height:1.875rem;position:relative;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%;padding-right:1.438rem}.current-conditions-place{font-size:1.25rem;font-weight:700;max-width:0}.as_close_btn{position:absolute;z-index:1;cursor:pointer;border-radius:0.188rem;text-align:center;border:0.125rem solid transparent;font-weight:700;background:red;color:#fff;right:0;height:1.375rem;width:1.375rem;line-height:1.4;top:50%;transform:translateY(-50%)}.as_close_btn:hover{background:#000;color:#fff}td.pphoto img{image-rendering:-webkit-optimize-contrast;image-rendering: optimize-contrast}.lineup_player_row td.weekly-opp .warning:before{content:"Player\\00a0"}.lineup_player_row td.weekly-opp .warning:after{content:"\\00a0Week"}.lineup_player_row td.weekly-opp .warning{font-weight:400}.lineup_head{padding:0.125rem 0.313rem;font-size:1rem;font-weight:bold;display:block;text-align:left}.target_report tr.lineup_player_row{position:relative;display:block;height:3.75rem}.target_report .lineup_player_row.eventablerow td,.target_report .lineup_player_row.oddtablerow td,.target_report tr.lineup_player_row td{border:0!important;box-shadow:none!important;padding: 0!important;text-align:left!important;background:none!important}.target_report tr.starters_pos_row + tr.lineup_player_row{border-top:0}.target_report tr.lineup_player_row:after{font-family:"Font Awesome 6 Pro";position:absolute;z-index:1;right:0;top:50%;transform:translateY(-50%);width:2.063rem;font-size:1.6rem}.target_report tr.current_starters_row:after{content: "\\f046"}.target_report tr.current_bench_row:after{content:"\\f096"}.target_report tr.lineup_player_row.locked_starter:after,.target_report tr.lineup_player_row.locked_bench::after{content:"\\f30d"}.target_report tr.lineup_player_row:hover{cursor:pointer}.target_report{width:100%}.target_report tr.lineup_player_row input{display:none}.target_report .tie_breakers_row select,.target_report textarea{width:100%;margin:0 auto;}.target_report tr.lineup_player_row input{display:none}.target_report tr.lineup_player_row .weekly-opp a{text-decoration:none}.target_report .headshot{height: 100%;width: 100%;border-radius: 50%}.target_report .headshot[src*="player_photos_"]{object-fit:contain}.target_report td.pphoto {text-align: center!important;border-radius: 50%;width: 3.125rem;height: 3.125rem;position: absolute;left: 0;top: 50%;transform: translateY(-50%);}.target_report tr.lineup_player_row td.pos-rank {font-size: 0.625rem;position: absolute;text-align: center!important;width: 3rem;z-index: 1;pointer-events: none;text-decoration: none;left: 0.188rem;bottom: 0.125rem;border-radius: 0.313rem}.target_report{width:100%}.target_report tr.previous_starter td.pphoto:before{content:"\\f05d";font-family:"Font Awesome 6 Pro";position:absolute;top:0;z-index:1;font-size:1rem;left:0;cursor:default;height:0.75rem;width:0.75rem;background:none}.target_report tr.lineup_player_row td.pos-rank:before{content:attr(data-content) "\\00a0#";display:inline;padding-bottom:0.313rem;margin-top:-1.25rem;text-transform:uppercase}.target_report tr.lineup_player_row td.pos-rank:empty:before{content:attr(data-content) "\\00a0#0";display:inline;padding-bottom:0.313rem;margin-top:-1.25rem;text-transform:uppercase}.target_report tr.lineup_player_row.last_row td.pos-rank{bottom:0.188rem}.target_report tr.lineup_player_row td.inj{text-align:center!important}.target_report tr.lineup_player_row td.player{position:absolute;top:0.188rem;left:3.75rem;font-size:1rem;white-space:nowrap}.target_report td.pphoto img[src*="nflTeamsvg_lineup"]{object-fit: cover;object-position: 50% -0.188rem}.target_report td.pphoto img[src*="svg"]{padding: 0.25rem}.target_report tr.lineup_player_row td.player a{font-weight:700;text-decoration:none}.target_report tr.lineup_player_row td.weekly-opp{position:absolute;top:1.375rem;left:4.063rem;font-size:0.875rem;white-space:nowrap}.target_report td.inj b.warning{font-size:0.625rem;font-weight:400;border-radius:50%;width:1rem;height:1rem;line-height:1rem;display:block;top:2.125rem;left:2.5rem;position:absolute;z-index:2}.target_report tr.lineup_player_row td.bye,.target_report tr.lineup_player_row td.pass-rank,.target_report tr.lineup_player_row td.rush-rank,.target_report tr.lineup_player_row td[class*="-start"]{display:none}tr.lineup_player_row{border-top:0.188rem solid #182a4a}tr.lineup_player_row.last_row{border-bottom:0.188rem solid #182a4a}tr.lineup_player_row.current_bench_row:after{color:red}tr.lineup_player_row.locked_bench:after{color:red}tr.lineup_player_row td.inj b.warning{color:#fff;background:red}tr.lineup_player_row.current_starters_row:after{color:green}tr.lineup_player_row.locked_starter:after{color:green}tr.previous_starter td.pphoto:before{color:green}tr.lineup_player_row td.pos-rank{background:#182a4a;color:#fff}tr.lineup_player_row td.weekly-opp{color:#cd2122}.target_report span.points_row{position:absolute;top:2.5rem;left:4.063rem}.target_report span.points_row span.ytd-pts,.target_report span.points_row span.proj-pts{margin-left:0.625rem}.target_report span.points_row span span{margin-left:0.188rem}.target_report span.points_row span.avg-pts,.target_report span.points_row span.ytd-pts,.target_report span.points_row span.proj-pts{font-size:0.813rem}.target_report span.points_row span.avg-pts span:empty:after{content:"0.0"}.target_report span.points_row span.ytd-pts span:empty:after{content:"0.0"}.target_report span.points_row span.proj-pts span:empty:after{content:"0.0"}tr.lineup_player_row span.points_row span.proj-pts{color:green}@media only screen and (max-width: 28em){.target_report tr.lineup_player_row td.player{font-size:0.875rem}.target_report tr.lineup_player_row td.weekly-opp{font-size:0.75rem}.target_report tr.lineup_player_row td.player{left:3.125rem;font-size:0.875rem}.target_report tr.lineup_player_row td.weekly-opp{left:3.438rem;font-size:0.75rem}.target_report span.points_row{left:3.75rem}.target_report span.points_row span.avg-pts,.target_report span.points_row span.proj-pts,.target_report span.points_row span.ytd-pts{font-size:0.688rem}}</style>', ), void 0 === removeSchedule)) var removeSchedule = !1;
	if (void 0 === removeWatchlist) var removeWatchlist = !1;
	if (void 0 === removeLineup) var removeLineup = !1;
	if (void 0 === hideLinks) var hideLinks = !1;
	if (void 0 === commishTeam) var commishTeam = "0001";
	removeSchedule && $("#frachiseScheduleTab,.team_schedule_table").remove(),
	removeWatchlist && $("#frachiseWatchTab,.team_watch_table").remove(),
	removeLineup && $("#frachiseLineupTab,.team_lineup_table").remove(),
	hideLinks && $("#teamLinks #propose_trade_link,#teamLinks #trade_bait_link,#teamLinks #transactions_link", ).remove(),
	$("body").on("click", ".teamdetailsWrap",
	function() {
		$("#TeamDetails .TeamData").html(""),
		$(".teamdetailsWrap,#TeamDetails").hide(),
		$("#MFLPlayerPopupContainer #MFLPlayerPopupClose,#MFLPlayerPopupOverlay", ).removeClass("teamdetails_activated"),
		$("#ScoreDetails #MFLPlayerPopupClose,#ScoreNFLDetails #MFLPlayerPopupClose,.scoredetailsWrap", ).removeClass("scoredetails_activated"),
		$("a").removeClass("dblClick");
		try {
			bodyScrollLock.clearAllBodyScrollLocks();
		} catch(e) {}
	}),
	$("body").on("click", ".teamdetails_activated , .scoredetails_activated",
	function() {
		$("#TeamDetails,.teamdetailsWrap").show();
		const e = document.querySelector("#TeamDetails");
		try {
			bodyScrollLock.disableBodyScroll(e);
		} catch(e) {}
	},
	),
	$("body").on("click", "#TeamDetails li.MFLPlayerPopupPlayerTabs a",
	function() {
		$("#TeamDetails li.MFLPlayerPopupPlayerTabs a").removeClass("active"),
		$(this).addClass("active");
	},
	),
	$("body").on("click", "#TeamDetails li#frachiseRostersTab",
	function() {
		$(".TeamData").hide(),
		$(".team_roster_table").show();
	}),
	$("body").on("click", "#TeamDetails li#frachiseBioTab",
	function() {
		$(".TeamData").hide(),
		$(".team_bio_table").show();
	}),
	$("body").on("click", "#TeamDetails li#frachiseScheduleTab",
	function() {
		$(".TeamData").hide(),
		$(".team_schedule_table").show();
	}),
	$("body").on("click", "#TeamDetails li#frachiseAwardsTab",
	function() {
		$(".TeamData").hide(),
		$(".team_awards_table").show();
	}),
	$("body").on("click", "#TeamDetails li#frachiseLineupTab",
	function() {
		$(".TeamData").hide(),
		$(".team_lineup_table").show(),
		$("td.weekly-opp:contains('Weather')").each(function() {
			var e;
			if ( - 1 === $(this).text().indexOf("@")) {
				var t = $(this).closest("tr").find("td.player a");
				if (t.length) {
					var a = t.text().split(" ");
					e = a[a.length - 2];
				}
			} else e = $(this).text().substr(1, 3);
			var r = $(this).find("a"),
			o = r.length ? r.attr("href") : "#";
			r.attr("onclick", `lu_popup_weatherPopup("${e}", "${o}")`).attr("title", "View Weather").removeAttr("target").removeAttr("href");
		});
	}),
	$("body").on("click", "#TeamDetails li#frachiseOptionsTab",
	function() {
		$(".TeamData").hide(),
		$(".team_options_table").show();
	}),
	$("body").on("click", "#TeamDetails li#frachiseNewsTab",
	function() {
		$(".TeamData").hide(),
		$(".team_news_table").show();
	}),
	$("body").on("click", "#TeamDetails li#frachiseWatchTab",
	function() {
		$(".TeamData").hide(),
		$(".team_watch_table").show();
	}),
	$("body").on("click", ".dblClick",
	function(e) {
		e.preventDefault();
	}),
	$("body").on("click", "#TeamDetails #MFLPlayerPopupClose",
	function() {
		$("#TeamDetails .TeamData").html(""),
		$(".teamdetailsWrap,#TeamDetails").hide();
		try {
			bodyScrollLock.clearAllBodyScrollLocks();
		} catch(e) {}
		$("#MFLPlayerPopupContainer #MFLPlayerPopupClose,#MFLPlayerPopupOverlay", ).removeClass("teamdetails_activated"),
		$("#ScoreDetails #MFLPlayerPopupClose,#ScoreNFLDetails #MFLPlayerPopupClose,.scoredetailsWrap", ).removeClass("scoredetails_activated"),
		$("a").removeClass("dblClick");
	}),
	$("body").on("click", '#LSscoringBox .franchise-icon a , #LSscoringBox .franchise-name a , .report a[href*="options?L="][href*="F="][href*="O=07"]:not([class*="dblClick"]):not([href*="F=0000"]):not([href*="api.myfantasyleague.com"]),.report a[href*="options?L="][href*="F="][href*="O=01"]:not([class*="dblClick"]):not([class*="pop_profile"]):not([href*="F=0000"]):not([href*="api.myfantasyleague.com"]),.report a[class*="franchise_"][href*="options?L="][href*="F="]:not([class*="dblClick"]):not([href*="F=0000"]):not([href*="api.myfantasyleague.com"])',
	function(e) {
		$(this).addClass("dblClick"),
		$("#TeamDetails table").addClass("report"),
		$("#MFLPlayerPopupContainer #MFLPlayerPopupClose,#MFLPlayerPopupOverlay", ).addClass("teamdetails_activated"),
		$("#ScoreDetails #MFLPlayerPopupClose,#ScoreNFLDetails #MFLPlayerPopupClose,.scoredetailsWrap", ).addClass("scoredetails_activated");
		var t = $(this).attr("href"),
		a = t.substring(t.indexOf("F=") + 2, t.length);
		a = a.substring(0, a.indexOf("&"));
		var r = $(this).parent().find("a").attr("href"),
		o = r.substr(r.indexOf("F=") + 2, 4);
		if ("undefined" == typeof franchise_id) $("#ownerTabview,#teamLinks #propose_trade_link,#teamLinks #trade_bait_link", ).remove();
		else if (o === franchise_id) {
			$("#ownerTabview").attr("style", "display:table-row-group!important"),
			$("#teamLinks #propose_trade_link").html('<a href="' + baseURLDynamic + "/" + year + "/options?L=" + league_id + '&O=05">Propose A Trade</a>', );
			var i = !0;
		} else if ("0000" === franchise_id && o === commishTeam) {
			$("#ownerTabview").attr("style", "display:table-row-group!important"),
			$("#teamLinks #propose_trade_link").html('<a href="' + baseURLDynamic + "/" + year + "/options?L=" + league_id + '&O=05">Propose A Trade</a>', );
			i = !0;
		} else if ("0000" === franchise_id) {
			$("#ownerTabview").attr("style", "display:table-row-group!important"),
			$("#teamLinks #propose_trade_link").html('<a href="' + baseURLDynamic + "/" + year + "/options?L=" + league_id + "&FRANCHISE=" + commishTeam + "&OPTION=05&FRANCHISE=" + a + '">Offer A Trade</a>', );
			i = !0;
		} else {
			$("#ownerTabview").attr("style", "display:none!important"),
			$("#teamLinks #propose_trade_link").html('<a href="' + baseURLDynamic + "/" + year + "/options?L=" + league_id + "&FRANCHISE=" + franchise_id + "&OPTION=05&FRANCHISE=" + a + '">Offer A Trade</a>', );
			i = !0;
		}
		if (($("#teamLinks #full_profile_link").html('<a class="pop_profile" href="' + baseURLDynamic + "/" + year + "/options?L=" + league_id + "&F=" + a + '&O=01">Full Profile</a>', ), $("#teamLinks #trade_bait_link").html('<a href="' + baseURLDynamic + "/" + year + "/options?L=" + league_id + '&O=133">Trade Bait</a>', ), $("#teamLinks #transactions_link").html('<a href="' + baseURLDynamic + "/" + year + "/options?L=" + league_id + "&O=03&F=" + a + '">Transactions</a>', ), $("#TeamDetails caption span").html($(this).html()), load_playerIcons)) {
			var l = $(this).attr("class").substr($(this).attr("class").indexOf("franchise_") + 10, 4);
			try {
				$("#TeamDetails caption span").css("white-space", "nowrap"),
				$("#TeamDetails caption span").prepend("<div class='franTeam_" + l + "' title='" + franchiseDatabase["fid_" + l].name + "'></div>", );
			} catch(e) {}
		}
		$("#TeamDetails caption span a").contents().unwrap(),
		$("#TeamDetails li.MFLPlayerPopupPlayerTabs a").removeClass("active"),
		$("#TeamDetails #frachiseBioTab a").addClass("active");
		var s = `$ {
			baseURLDynamic
		}
		/${year}/options ? L = $ {
			league_id
		} & O = 07 & F = $ {
			a
		} & PRINTER = 1`;
		fetch(s).then((e) = >e.text()).then((e) = >{
			var t = $(e).find(".report tbody").contents();
			$("#TeamDetails .team_roster_table").html(t),
// ✅ Your reformatting script goes here
$("#TeamDetails .team_roster_table td.player").each(function () {
	const $playerCell = $(this);
	const $link = $playerCell.find("a[href*='player?']");
	if (!$link.length) return;

	const fullText = $link.text().trim();
	const playerID = $link.attr("href").match(/PLAYER_ID=(\d+)/)?.[1] || "";
	const positionMatch = fullText.match(/\b(QB|RB|WR|TE|K|DEF|FB|DL|LB|DB|DT|DE|CB|S|PK|PN|Off|Coach)\b/i);
	const position = positionMatch ? positionMatch[1].toUpperCase() : "";
	const name = fullText.replace(/\b(QB|RB|WR|TE|K|DEF|FB|DL|LB|DB|DT|DE|CB|S|PK|PN|Off|Coach)\b/i, "").trim();

	const team = $playerCell.text().split(" ")[0];
	const firstName = name.split(" ")[0];
	const lastName = name.split(" ").slice(1).join(" ");

	const imgUrl = playerID
		? `https://www.mflscripts.com/playerImages_96x96/mfl_${playerID}.png`
		: "";

	$link.html(`
		<div class="player_wrapper">
			<div class="player_img"><img src="${imgUrl}" class="headshot" /></div>
			<div class="position_name_roster">${position}</div>
			<div class="player_name">${firstName} ${lastName}</div>
		</div>
	`);
});
			$('#TeamDetails td a[class*="position_').attr("href",
			function(e, t) {
				return t.replace("&PRINTER=1", "");
			},
			);
			try {
				MFLPlayerPopupNewsIcon();
			} catch(e) {}
			$(".team_roster_table th.points").text("Pts");
		}).
		catch((e) = >{
			console.error("Error:", e);
		});
		var n = `$ {
			baseURLDynamic
		}
		/${year}/options ? L = $ {
			league_id
		} & F = $ {
			a
		} & O = 01 & PRINTER = 1`,
		p = '<tr><td colspan="2" style="text-align:center!important;border:0;box-shadow:none;padding:0"><img style="max-width:100%;margin:0;width:100%" src="' + franchiseDatabase["fid_" + a].logo + '" class="franchiselogo pop_logo"/></td></tr>';
		fetch(n).then((e) = >e.text()).then((e) = >{
			includeBiologo && $("#TeamDetails .team_bio_table").append(p),
			$("#TeamDetails .team_bio_table").append('<tr><th colspan="2">Owner Information</th></tr>', );
			var t = $(e).find(".report tr.emailaddress,.report tr.ownername,.report tr.daytimephone,.report tr.cellnumber,.report tr.mailingaddress,.report tr.lastvisit,.report tr.conference,.report tr.division,.report tr.accounting,.report tr.bbidtotalspent,.report tr.h2hrecord,.report tr.ytdpoints", );
			if (($("#TeamDetails .team_bio_table").append(t), $("#TeamDetails .team_bio_table").append('<tr class="eventablerow reportfooter"><td colspan="2" style="text-align:center!important"><a href="' + baseURLDynamic + "/" + year + "/options?L=" + league_id + '&O=208">Career Record</a> |  <a href="' + baseURLDynamic + "/" + year + "/options?L=" + league_id + "&O=171&FID=" + a + '">All-Time Series Records</a></td></tr>', ), jQuery("#TeamDetails .h2hrecord td:nth-child(2)").text(jQuery(".h2hrecord td:nth-child(2)").text().substr(0, jQuery(".h2hrecord td:nth-child(2)").text().indexOf("("), ), ), $(".TeamData").hide(), includeBiologoAsset && i)) {
				if ("0000" === franchise_id) var r = `$ {
					baseURLDynamic
				}
				/${year}/options ? L = $ {
					league_id
				} & FRANCHISE = $ {
					commishTeam
				} & OPTION = 05 & FRANCHISE = $ {
					a
				} & PRINTER = 1`;
				else r = `$ {
					baseURLDynamic
				}
				/${year}/options ? L = $ {
					league_id
				} & FRANCHISE = $ {
					franchise_id
				} & OPTION = 05 & FRANCHISE = $ {
					a
				} & PRINTER = 1`;
				fetch(r).then((e) = >e.text()).then((e) = >{
					$("#TeamDetails .team_bio_table").append('<tr><th colspan="2">Owner Assets</th></tr>', );
					var t = $(e).find('form table tr td:nth-child(2) table tr:contains("Draft Pick")', ).addClass("alter_td"),
					a = $(e).find('form table tr td:nth-child(2) table tr:contains("Blind Bidding Dollars")', ).addClass("alter_td");
					$("#TeamDetails .team_bio_table").append(t),
					$("#TeamDetails .team_bio_table").append(a),
					$(".alter_td td:nth-child(1)").remove(),
					$(".alter_td td").attr("colspan", "2"),
					$(".alter_td td").attr("style", "text-align:center!important", ),
					$("#TeamDetails .team_bio_table tr.alter_td").length > 0 || ("0000" === franchise_id ? $("#TeamDetails .team_bio_table").append('<tr class="oddtablerow"><td colspan="2" class="warning" style="text-align:center!important">Commish Abilities Do Not Permit Access To Trades Data</th></tr>', ) : $("#TeamDetails .team_bio_table").append('<tr class="oddtablerow"><td colspan="2" class="warning" style="text-align:center!important">If Trades Disabled, No Assets Will Be Displayed</th></tr>', )),
					$(".team_bio_table").show(),
					$(".teamdetailsWrap,#TeamDetails").show();
					const r = document.querySelector("#TeamDetails");
					try {
						bodyScrollLock.disableBodyScroll(r);
					} catch(e) {}
				}).
				catch((e) = >{
					console.error("Error fetching biodata asset:", e);
				});
			} else {
				$(".team_bio_table").show(),
				$(".teamdetailsWrap,#TeamDetails").show();
				const e = document.querySelector("#TeamDetails");
				try {
					bodyScrollLock.disableBodyScroll(e);
				} catch(e) {}
			}
		}).
		catch((e) = >{
			console.error("Error fetching biodata:", e);
		});
// --- NEW: Build schedule from JSON instead of scraping PRINTER HTML ---
async function buildFranchiseSchedule(frId) {
  // Utility: safe fetch JSON
  async function getJSON(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`Fetch failed ${r.status} ${r.statusText}`);
    return r.json();
  }

  // 1) Pull full weekly results (scores + matchups) and schedule scaffolding
  // weeklyResults gives played games; schedule gives matchups even before they’re played.
  const weeklyResultsURL = `${baseURLDynamic}/${year}/export?TYPE=weeklyResults&L=${league_id}&JSON=1`;
  const scheduleURL      = `${baseURLDynamic}/${year}/export?TYPE=schedule&L=${league_id}&JSON=1`;
  const franchisesURL    = `${baseURLDynamic}/${year}/export?TYPE=league&L=${league_id}&JSON=1`;

  let [resultsJson, scheduleJson, leagueJson] = await Promise.all([
    getJSON(weeklyResultsURL).catch(()=>({})),
    getJSON(scheduleURL).catch(()=>({})),
    getJSON(franchisesURL).catch(()=>({}))
  ]);

  // Build quick maps
  const fid = String(frId);
  const franchiseMap = {};
  try {
    (leagueJson?.league?.franchises?.franchise || []).forEach(f=>{
      franchiseMap[f.id] = f;
    });
  } catch(_) {}

  // Flatten schedule into list of entries for this franchise
  const rows = [];
  try {
    const weeks = scheduleJson?.schedule?.weeklySchedule?.week || [];
    weeks.forEach(weekObj=>{
      const week = Number(weekObj.week);
      (weekObj.matchup || []).forEach(m=>{
        const { franchise: pair } = m;
        if (!pair || pair.length < 2) return;

        const f1 = pair[0]; const f2 = pair[1];
        const home = (m.home || "");
        let host = f1.id, guest = f2.id;

        // MFL marks home team by id string
        if (home && home === f2.id) { host = f2.id; guest = f1.id; }

        const isHome = host === fid;
        if (f1.id !== fid && f2.id !== fid) return;

        const oppId = (f1.id === fid) ? f2.id : f1.id;

        rows.push({
          week,
          isHome,
          oppId,
          // fill in later once we merge scores
          pf: null,
          pa: null,
          result: null,
          boxscoreUrl: `${baseURLDynamic}/${year}/home/${league_id}?MODULE=LS&W=${week}` // lightweight link into live scoring / box
        });
      });
    });
  } catch(_) {}

  // Merge in results (PF/PA + W/L/T)
  try {
    const allWeeks = resultsJson?.weeklyResults?.matchup || [];
    allWeeks.forEach(m=>{
      const week = Number(m.week);
      const f1 = m.franchise?.[0]; const f2 = m.franchise?.[1];
      if (!f1 || !f2) return;

      const g = {
        week,
        a: { id: f1.id, pf: Number(f1.score) || 0 },
        b: { id: f2.id, pf: Number(f2.score) || 0 }
      };

      // See if our team is in this game
      let idx = rows.findIndex(r => r.week === week && (r.oppId === g.a.id || r.oppId === g.b.id));
      if (idx === -1) return;

      const r = rows[idx];
      const myScore  = (g.a.id === fid) ? g.a.pf : g.b.pf;
      const oppScore = (g.a.id === fid) ? g.b.pf : g.a.pf;

      r.pf = myScore;
      r.pa = oppScore;

      r.result = (myScore > oppScore) ? "W" : (myScore < oppScore) ? "L" : "T";
    });
  } catch(_) {}

  // Sort by week
  rows.sort((a,b)=>a.week-b.week);

  // 2) Render table
  const $tbody = $(`
    <tr>
      <th class="week">Week</th>
      <th class="matchup">Opponent</th>
      <th class="ha">H/A</th>
      <th class="result">Result</th>
      <th class="pf">PF</th>
      <th class="pa">PA</th>
      <th class="tools">Links</th>
    </tr>
  `);

  // helper to opponent cell with optional logo + weather
  function opponentCell(oppId) {
    const opp = franchiseMap[oppId];
    const oppName = (opp?.name) ? opp.name : (`Franchise ${oppId}`);
    let html = `<div class="oppCell" style="display:flex;align-items:center;gap:.5rem">`;

    if (load_playerIcons) {
      // reuse your .franTeam_<id> icon CSS
      html += `<div class="franTeam_${oppId}" title="${oppName}" style="flex:0 0 auto"></div>`;
    }

    html += `<div class="oppInfo" style="display:flex;align-items:center;gap:.5rem">
               <span class="oppName">${oppName}</span>
               <button type="button" class="wxBtn" data-opp="${oppId}" title="View Weather" style="font-size:.8rem;padding:.15rem .4rem">Weather</button>
             </div>`;
    html += `</div>`;
    return html;
  }

  // Create rows
  rows.forEach((r,i)=>{
    const trClass = (i%2) ? "eventablerow" : "oddtablerow";
    const resultBadge = r.result ? `<span class="${r.result==='W'?'success':r.result==='L'?'warning':''}">${r.result}</span>` : "<i>—</i>";
    const pf = (r.pf==null) ? "—" : r.pf.toFixed(2).replace(/\.00$/,'');
    const pa = (r.pa==null) ? "—" : r.pa.toFixed(2).replace(/\.00$/,'');

    $tbody.append(`
      <tr class="${trClass}">
        <td class="week"      style="text-align:center!important">${r.week}</td>
        <td class="matchup">  ${opponentCell(r.oppId)}</td>
        <td class="ha"        style="text-align:center!important">${r.isHome ? "Home" : "Away"}</td>
        <td class="result"    style="text-align:center!important">${resultBadge}</td>
        <td class="pf"        style="text-align:center!important">${pf}</td>
        <td class="pa"        style="text-align:center!important">${pa}</td>
        <td class="tools"     style="text-align:center!important">
          <a href="${r.boxscoreUrl}" target="_blank">Box</a>
        </td>
      </tr>
    `);
  });

  // Handle teams with no schedule found (byes/empty leagues)
  if (!rows.length) {
    $tbody.append(`<tr class="oddtablerow"><td colspan="7" style="text-align:center!important"><i>No scheduled games</i></td></tr>`);
  }

  // Inject into the popup
  $("#TeamDetails .team_schedule_table").html($tbody);

  // Hook up Weather buttons (uses your existing lu_popup_weatherPopup)
  // We try to infer opponent NFL abbreviation from the franchise abbrev if available; if not, we pass the franchise id.
  $("#TeamDetails .team_schedule_table .wxBtn").off("click").on("click", function(){
    const oppId = $(this).data("opp");
    // Try a best-effort abbrev guess from franchiseDatabase if you have one, else fall back to oppId.
    let nflAbbrev = "";
    try { nflAbbrev = (franchiseDatabase?.[`fid_${oppId}`]?.abbrev || "").toUpperCase(); } catch(_) {}
    if (!nflAbbrev || nflAbbrev.length>3) nflAbbrev = String(oppId); // fallback
    const weatherLink = "https://weather.com"; // Placeholder; your lu_popup_weatherPopup takes (siteKey, url)
    lu_popup_weatherPopup(nflAbbrev, weatherLink);
  });

  // Optional: strip anchors to plain text if icons are rendered later
  if (!load_playerIcons) {
    $(".team_schedule_table a").each(function(){ /* keep links (boxscore), so do nothing */ });
  }
}

// call it where you previously fetched O=16
buildFranchiseSchedule(a).catch(err=>{
  console.error("Schedule builder failed, falling back to PRINTER HTML:", err);
  // Fallback to your original behavior if JSON fails for any reason
  const d = `${baseURLDynamic}/${year}/options?L=${league_id}&O=16&F=${a}&PRINTER=1`;
  fetch(d).then(r=>r.text()).then(e=>{
    const t = $(e).find(".report tbody").contents();
    $("#TeamDetails .team_schedule_table").html(t);
    if (load_playerIcons) {
      $("body").find('.team_schedule_table a[class*="franchise_"]').each(function(){
        const e = $(this).attr("class").substr($(this).attr("class").indexOf("franchise_")+10,4);
        try {
          $(this).parent().css("white-space","nowrap");
          $(this).parent().prepend("<div class='franTeam_"+e+"' title='"+franchiseDatabase["fid_"+e].name+"'></div>");
          setTimeout(function(){ $(".team_schedule_table a").contents().unwrap(); }, 1000);
        } catch(e){}
      });
    } else {
      $(".team_schedule_table a").contents().unwrap();
    }
  }).catch(e=>console.error("Fallback schedule fetch failed:", e));
});

		var c = `$ {
			baseURLDynamic
		}
		/${year}/options ? L = $ {
			league_id
		} & O = 202 & FID = $ {
			a
		} & PRINTER = 1`;
		if ((fetch(c).then((e) = >e.text()).then((e) = >{
			var t = $(e).find(".report tbody").contents();
			$("#TeamDetails .team_awards_table").html(t),
			$("#TeamDetails .team_awards_table td.reportfooter").html('<a href="' + baseURLDynamic + "/" + year + "/csetup?C=AWARDS&L=" + league_id + '">Create New Award</a> |  <a href="' + baseURLDynamic + "/" + year + "/options?L=" + league_id + '&O=201">Edit League Awards</a>', );
		}).
		catch((e) = >{
			console.error("Error:", e);
		}), completedWeek >= endWeek)) var u = `$ {
			baseURLDynamic
		}
		/${year}/lineup ? L = $ {
			league_id
		} & FRANCHISE = $ {
			a
		} & WEEK = $ {
			endWeek
		} & PRINTER = 1`;
		else u = `$ {
			baseURLDynamic
		}
		/${year}/lineup ? L = $ {
			league_id
		} & FRANCHISE = $ {
			a
		} & PRINTER = 1`;
		fetch(u).then((e) = >e.text()).then((e) = >{
			var t = $(e).find(".mobile-wrap form"),
			a = $(e).find("h3.warning");
			$("#TeamDetails .team_lineup_table").append(a),
			$("#TeamDetails .team_lineup_table h3.warning a").contents().unwrap(),
			$("#TeamDetails .team_lineup_table").append(t),
			$(".team_lineup_table form").wrap("<tr><td>"),
			$(".team_lineup_table table.report caption a").remove(),
			$(".team_lineup_table table.report caption").contents().unwrap().prependTo(".team_lineup_table").addClass("lineup_head"),
			$(".team_lineup_table .lineup_head").append('<div class="lineup_filter" style="float:right;font-size:1.375rem"><div style="padding:0;text-indent:0;display:inline;margin-right:0.625rem;cursor:pointer" id="LineupResetRow" title="Reset Starting Lineup"><i class="fa-regular fa-arrows-rotate" aria-hidden="true"></i></div><div style="padding:0;text-indent:0;display:inline;cursor:pointer" id="LineupClearRow" title="Clear Starting Lineup"><i class="fa-regular fa-eraser" aria-hidden="true"></i></div></div>', ),
			$(".team_lineup_table table.report").removeClass("report").addClass("target_report");
			var r = new Array();
			$(".target_report tr:eq(0) th").each(function() {
				var e = $(this).text().toLowerCase().replace(/ /g, "-"); ("rush" !== e && "pass" !== e) || (e += "-rank"),
				"opp-avgvs-pos" === e && (e = "pass-rank"),
				"opp-rankvs-pos" === e && (e = "rush-rank"),
				-1 !== e.indexOf("select-a") && (e = "select-total-starters"),
				-1 !== e.indexOf("week-") && (e = "weekly-opp"),
				$(this).addClass(e),
				r.push(e);
			});
			$(".target_report tr").each(function() {
				var e = 0;
				$(this).find("td").each(function() {
					$(this).addClass(r[e + 1]),
					e++;
				});
			}),
			$(".target_report tr:has(select)").addClass("tie_breakers_row"),
			$(".target_report .nfl-news,.target_report table .pass-rank", ).remove(),
			$('.target_report tr th:contains("Select"):contains(":")', ).addClass("starters_pos_th"),
			$(".target_report .starters_pos_th").parent("tr").before('<tr class="starters_pos_row"></tr>'),
			$(".target_report .starters_pos_th").each(function() {
				$(this).attr("colspan", "100"),
				$(this).parent("tr").prev(".starters_pos_row").append(this);
			}),
			$('.target_report tr th:contains("Select"):contains("A"):contains("Total"):contains("Of")', ).addClass("starters_count_th"),
			$(".target_report .starters_count_th").parent("tr").before('<tr class="starters_count_row"></tr>'),
			$(".target_report .starters_count_th").each(function() {
				$(this).attr("colspan", "100"),
				$(this).parent("tr").prev(".starters_count_row").append(this);
			}),
			$('.target_report tr th:contains("Optional"):contains("Message")', ).addClass("message_th"),
			$(".target_report .message_th").parent("tr").before('<tr class="message_row"></tr>'),
			$(".target_report .message_th").each(function() {
				$(this).attr("colspan", "100"),
				$(this).parent("tr").prev(".message_row").append(this);
			}),
			$(".target_report th:not(.starters_pos_th):not(.starters_count_th):not(.message_th)", ).remove(),
			$(".target_report tr td.player").not(':has(a[href*="player?"])').removeClass("player"),
			$(".team_lineup_table td.pass-rank a,.team_lineup_table td.rush-rank a,.team_lineup_table td.ytd-pts a", ).contents().unwrap(),
			$(".team_lineup_table td.pass-rank a:empty,.team_lineup_table td.rush-rank a:empty,.team_lineup_table td.ytd-pts a:empty", ).remove(),
			$(".team_lineup_table tr").removeClass("newposition"),
			$('.target_report td a[class*="position_').attr("href",
			function(e, t) {
				return t.replace("&PRINTER=1", "");
			},
			),
			jQuery(".target_report td.player a").each(function() {
				jQuery(this).closest("tr").addClass("lineup_player_row");
			}),
			$(".target_report tr.lineup_player_row td.player input").closest("tr").addClass("current_bench_row"),
			$('.target_report tr.lineup_player_row td.player input[checked="checked"]', ).closest("tr").removeClass("current_bench_row").addClass("current_starters_row previous_starter"),
			$('.target_report tr.lineup_player_row td.player input[checked="checked"][disabled="disabled"]', ).closest("tr").removeClass("current_bench_row current_starters_row").addClass("locked_starter"),
			$('.target_report tr.lineup_player_row td.player input[disabled="disabled"]', ).not('input[checked="checked"]').closest("tr").removeClass("current_bench_row locked_starter").addClass("locked_bench"),
			jQuery(".starters_pos_row").each(function() {
				$(this).nextUntil(".starters_pos_row").addBack().wrapAll("<tbody>");
			}),
			$(document).on("click", ".target_report tr.current_starters_row",
			function() {
				$(this).nextAll(".locked_bench").length && $(this).nextAll(".current_bench_row").length < 1 ? $(this).nextAll(".locked_bench:first").before(this) : ($(this).nextAll(".locked_bench").length && $(this).nextAll(".current_bench_row").length > 0) || $(this).nextAll(".current_bench_row").length ? $(this).nextAll(".current_bench_row:first").before(this) : $(this).nextAll(".current_starters_row").length && $(this).nextAll(".current_starters_row:last").after(this),
				$(this).not(".locked_starter").not(".locked_bench").find(":checkbox").prop("checked", !1).change(),
				$(this).not(".locked_starter").not(".locked_bench").removeClass("current_starters_row").addClass("current_bench_row"),
				$(this).not(".locked_starter").not(".locked_bench").attr("title", "Move To Starting Lineup"),
				$(".target_report .lineup_player_row:odd").removeClass("oddtablerow eventablerow").addClass("eventablerow"),
				$(".target_report .lineup_player_row:even").removeClass("oddtablerow eventablerow").addClass("oddtablerow"),
				$(".target_report tr.lineup_player_row").removeClass("last_row").last().addClass("last_row");
			},
			),
			$(document).on("click", ".target_report tr.current_bench_row",
			function() {
				$(this).prevAll(".locked_starter").length && $(this).prevAll(".current_starters_row").length < 1 ? $(this).prevAll(".locked_starter:first").after(this) : $(this).prevAll(".current_starters_row").length ? $(this).prevAll(".current_starters_row:first").after(this) : $(this).prevAll(".starters_pos_row").length && $(this).prevAll(".starters_pos_row:first").after(this),
				$(this).not(".locked_starter").not(".locked_bench").find(":checkbox").prop("checked", !0).change(),
				$(this).not(".locked_starter").not(".locked_bench").removeClass("current_bench_row").addClass("current_starters_row"),
				$(this).not(".locked_starter").not(".locked_bench").attr("title", "Move To Bench"),
				$(".target_report .lineup_player_row:odd").removeClass("oddtablerow eventablerow").addClass("eventablerow"),
				$(".target_report .lineup_player_row:even").removeClass("oddtablerow eventablerow").addClass("oddtablerow"),
				$(".target_report tr.lineup_player_row").removeClass("last_row").last().addClass("last_row");
			},
			),
			$(document).on("click", ".target_report tr.lineup_player_row.previous_starter.cleared",
			function() {
				$(this).prevAll(".locked_starter").length && $(this).prevAll(".current_starters_row").length < 1 ? $(this).prevAll(".locked_starter:first").after(this) : $(this).prevAll(".current_starters_row").length ? $(this).prevAll(".current_starters_row:first").after(this) : $(this).prevAll(".starters_pos_row").length && $(this).prevAll(".starters_pos_row:first").after(this),
				$(this).not(".current_starter").find(":checkbox").prop("checked", !0).change(),
				$(this).removeClass("current_bench_row").addClass("current_starters_row"),
				$(this).not(".locked_starter").attr("title", "Move To Bench"),
				$(".target_report .lineup_player_row:odd").removeClass("oddtablerow eventablerow").addClass("eventablerow"),
				$(".target_report .lineup_player_row:even").removeClass("oddtablerow eventablerow").addClass("oddtablerow"),
				$(".target_report tr.lineup_player_row").removeClass("last_row").last().addClass("last_row"),
				$(".target_report tr.lineup_player_row.previous_starter.cleared", ).removeClass("cleared");
			},
			),
			$(document).on("click", "#LineupClearRow",
			function() {
				$(".target_report tr.lineup_player_row").not("tr.locked_starter").not("tr.locked_bench").find("input").prop("checked", !1).change(),
				$(".target_report tr.lineup_player_row").not("tr.locked_starter").not("tr.locked_bench").removeClass("current_starters_row").addClass("current_bench_row"),
				$(".target_report tr.lineup_player_row").not("tr.locked_starter").not("tr.locked_bench").attr("title", "Move To Starting Lineup");
			}),
			$(document).on("click", "#LineupResetRow",
			function() {
				$(".target_report tr.lineup_player_row.previous_starter").not("tr.locked_starter").addClass("cleared"),
				$(".target_report tr.lineup_player_row").not("tr.locked_starter").not("tr.locked_bench").find("input").prop("checked", !1).change(),
				$(".target_report tr.lineup_player_row").not("tr.locked_starter").not("tr.locked_bench").removeClass("current_starters_row").addClass("current_bench_row"),
				$(".target_report tr.lineup_player_row.previous_starter.cleared", ).trigger("click");
			}),
			$(".target_report tr.lineup_player_row td.weekly-opp,.target_report tr.lineup_player_row td.player", ).click(function(e) {
				e.stopPropagation();
			}),
			$(".team_lineup_table tr.current_bench_row").not(".locked_bench").attr("title", "Move To Starting Lineup"),
			$(".team_lineup_table tr.current_starters_row").not(".locked_starter").attr("title", "Move To Bench"),
			$(".team_lineup_table tr.locked_starter,.team_lineup_table tr.locked_bench", ).attr("title", "Game Has Started - Player Locked"),
			$(".target_report tr.lineup_player_row").each(function() {
				$(".target_report td.points,.target_report td.ytd,.target_report td.avg", ).hide();
				var e = $(this).find("td.proj-pts").html(),
				t = $(this).find("td.ytd-pts").html(),
				a = $(this).find("td.avg-pts").html();
				void 0 === a && (a = 0),
				void 0 === e && (e = 0),
				void 0 === t && (t = 0),
				$(this).append('<span class="points_row"><span class="avg-pts">Avg:<span>' + a + '</span></span><span class="ytd-pts">YTD:<span>' + t + '</span></span><span class="proj-pts">Proj:<span>' + e + "</span></span></span>", ),
				setTimeout(function() {
					$(".target_report td.points,.target_report td.ytd,.target_report td.avg", ).remove();
				},
				1e3);
			}),
			$(".target_report tr.tie_breakers_row").before('<tr><th class="tiebreaker_th" colspan="100" valign="top">Select Tie-Breakers</th></tr>', );
			var o = {
				Coach: !0,
				QB: !1,
				TMQB: !0,
				TMRB: !0,
				RB: !1,
				FB: !1,
				WR: !1,
				TMWR: !0,
				TE: !1,
				TMTE: !0,
				KR: !1,
				PK: !1,
				TMPK: !0,
				PN: !1,
				TMPN: !0,
				Off: !0,
				DT: !1,
				DE: !1,
				TMDL: !0,
				LB: !1,
				TMLB: !0,
				CB: !1,
				S: !1,
				TMDB: !0,
				Def: !0,
				ST: !0,
			};
			"undefined" != typeof franchise_id &&
			function() {
				var e, t, a; (e = function(e) {
					var t, a, r, o;
					if ( - 1 !== e.indexOf("launch_player_modal")) return (a = e.split(","))[1].replace(/'/g, "").replace(");", "");
					for (r = 0, o = (a = e.split("?")[1].split("&")).length; r < o; r++) if ("P" === (t = a[r].split("="))[0]) return t[1];
				}),
				(t = function(e) {
					var t;
					return (t = e.split(" "))[t.length - 1];
				}),
				(a = function(e) {
					var t;
					return (t = e.split(" "))[t.length - 2];
				}),
				$(function() {
					var r;
					if ((r = $(".team_lineup_table")).length) return ($('a[class^="position"]').each(function(r, i) {
						var l, s, n, p, d;
						return ((l = $(i)), (n = e(l.attr("href"))), (p = t(l.text())), (d = a(l.text())), (s = o[p] ? "https://www.mflscripts.com/ImageDirectory/script-images/nflTeamsvg_lineup/" + d + ".svg": "https://www.mflscripts.com/playerImages_96x96/mfl_" + n + ".png"), l.parentsUntil(".team_lineup_table tr", ".team_lineup_table td", ).before('<td class="pphoto"><img class="headshot" data-player-img-url="' + s + '" /></td>', ).find("img"));
					}), r.find("img").each(function(t, a) {
						var r;
						return ((r = $(this)).one("error",
						function() {
							return (r.one("error",
							function() {
								return (r.one("error",
								function() {
									return $(this).attr("src", "https://www.mflscripts.com/playerImages_96x96/free_agent.png", );
								}), ($el1 = $(this)), $el1.attr("src", $el1.attr("src").replace("2014", String(year)), ));
							}), ($el1 = $(this)), (id = e(r.parent().parent().find("td.player a").attr("href"), )), $el1.attr("src", "//www.myfantasyleague.com/player_photos_2014/" + id + "_thumb.jpg", ));
						}), r.attr("src", r.data("player-img-url")));
					}));
				});
			}.call(this),
			$(".target_report tr.lineup_player_row").each(function() {
				var e = $(this).find("td.player a").text(),
				t = e.split(" ")[e.split(" ").length - 1];
				$(this).addClass("position_" + t.toLowerCase()),
				$(this).find("td.pos-rank").attr("data-content", t.toUpperCase());
			}),
			setTimeout(function() {
				$(".target_report tr.locked_bench").each(function() {
					$(this).prevAll(".starters_pos_row:first").after(this);
				});
			},
			10),
			setTimeout(function() {
				$(".target_report tr.current_bench_row").each(function() {
					$(this).prevAll(".starters_pos_row:first").after(this);
				});
			},
			40),
			setTimeout(function() {
				$(".target_report tr.current_starters_row").each(function() {
					$(this).prevAll(".starters_pos_row:first").after(this);
				});
			},
			70),
			setTimeout(function() {
				$(".target_report tr.locked_starter").each(function() {
					$(this).prevAll(".starters_pos_row:first").after(this);
				});
			},
			100),
			setTimeout(function() {
				$(".target_report .lineup_player_row:odd").removeClass("oddtablerow eventablerow").addClass("eventablerow"),
				$(".target_report .lineup_player_row:even").removeClass("oddtablerow eventablerow").addClass("oddtablerow"),
				$(".target_report tr.lineup_player_row").last().addClass("last_row");
			},
			150);
			try {
				MFLPlayerPopupNewsIcon();
			} catch(e) {}
			"undefined" != typeof franchise_id && "0000" !== franchise_id && completedWeek >= endWeek && ($(".team_lineup_table").addClass("week_over"), $(".team_lineup_table.week_over .current_starters_row").addClass("locked_starter_game_over", ), $(".team_lineup_table.week_over .current_bench_row").addClass("locked_bench_game_over", ), $(".team_lineup_table.week_over .player_row").attr("title", "Game Over", ), $("head").append('<style>.team_lineup_table.week_over tr.locked_starter_game_over,.team_lineup_table.week_over tr.locked_bench_game_over{pointer-events:none}.team_lineup_table.week_over tr.locked_starter_game_over:after,.team_lineup_table.week_over tr.locked_bench_game_over::after{content:"\\f30d"!important;width:2.25rem!important;font-size:2.25rem!important;right:-0.188rem!important}.team_lineup_table.week_over tr.locked_bench_game_over:before{position:absolute;z-index:2;font-size:1rem;right:1rem;top:50%;margin-top:0.375rem;transform:translateY(-50%);content:"B";color:#fff;font-weight:700;font-family:monospace}.team_lineup_table.week_over tr.previous_starter.locked_starter_game_over:before{font-family:"Font Awesome 6 Pro";position:absolute;z-index:2;font-size:0.875rem;right:0.875rem;top:50%;margin-top:0.375rem;transform:translateY(-50%);content:"\\f046"}.team_lineup_table.week_over .lineup_filter,.team_lineup_table.week_over input[type="submit"]{pointer-events:none}.team_lineup_table.week_over input[type="submit"],.team_lineup_table.week_over .form_buttons:before{opacity:.5}.team_lineup_table.week_over tr.locked_starter_game_over,.team_lineup_table.week_over tr.locked_bench_game_over{pointer-events:none}.team_lineup_table.week_over .starter_count,.team_lineup_table.week_over .starter_count_sub{display:none!important}.team_lineup_table.week_over tr.locked_starter_game_over td.player,.team_lineup_table.week_over tr.locked_bench_game_over td.player{pointer-events:all}</style>', ));
		}).
		catch((e) = >{
			console.error("Error:", e);
		});
		var y = `$ {
			baseURLDynamic
		}
		/${year}/home / $ {
			league_id
		} ? MODULE = MY_OPTIONS`;
		fetch(y).then((e) = >e.text()).then((e) = >{
			var t = $(e).find("#my_options tbody").contents();
			$("#TeamDetails .team_options_table").html(t),
			$('.myoptions td[class="inputlabel"]').remove(),
			$("tr.mailingaddress td a").contents().unwrap();
		}).
		catch((e) = >{
			console.error("Error:", e);
		});
		var h = `$ {
			baseURLDynamic
		}
		/${year}/home / $ {
			league_id
		} ? MODULE = MY_NEWS`;
		fetch(h).then((e) = >e.text()).then((e) = >{
			var t = $(e).find("#my_news tbody").contents();
			$("#TeamDetails .team_news_table").html(t),
			MFLPlayerPopupArticleIcon("TeamDetails");
		}).
		catch((e) = >{
			console.error("Error:", e);
		});
		var m = `$ {
			baseURLDynamic
		}
		/${year}/home / $ {
			league_id
		} ? MODULE = MY_WATCH_LIST`;
		fetch(m).then((e) = >e.text()).then((e) = >{
			var t = $(e).find("#my_watch_list tbody").contents();
			$("#TeamDetails .team_watch_table").html(t),
			$(".TeamData.team_watch_table > tr:nth-child(1)").replaceWith('<tr><th>Player</th><th style="text-align: left!important">Owner Status</th><th>YTD Pts</th></tr>', );
			try {
				MFLPlayerPopupNewsIcon();
			} catch(e) {}
		}).
		catch((e) = >{
			console.error("Error:", e);
		}),
		e.preventDefault();
	},
	);
}
