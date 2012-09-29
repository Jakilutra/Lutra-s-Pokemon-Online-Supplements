/* Loading Disconnect Object and Settings */
disconnect = {};
set(construction.source, "bans", "disconnect", "bans");
set(construction.source, "disconnectoptions", "disconnect", "options");

/* Kick Function */
disconnect.kick = function (src, trgt, reason){
	var srcname = sys.name(src), trgtname = sys.name(trgt), 
	reasonline = reason === undefined ? "" : "<br/>Reason: " + reason,
	display = trgtname + " has been kicked from the server by " + srcname + "!" + reasonline;
	if (global.auth !== undefined && disconnect.options.echo === "off") {
		auth.echo("mod", display);
	}
	else {
		disconnect.echo(display);		
	}
	sys.quickCall(function () {sys.kick(trgt);}, 200);
}

/* Punch Function */
disconnect.punch = function (src, trgt, reason){
	var srcname = sys.name(src), trgtname = sys.name(trgt), 
	reasonline = reason === undefined ? "" : "<br/>Reason: " + reason,
	display = trgtname + " has been punched from the server by " + srcname + "!" + reasonline;
	if (global.auth !== undefined && disconnect.options.echo === "off") {
		auth.echo("mod", display);
	}
	else {
		disconnect.echo(display);		
	}
	sys.quickCall(function () {sys.disconnect(trgt);}, 200);
}

/* Ban Function */
disconnect.ban = function (srcname, trgtname, type, reason, duration_time, duration_unit) {
	if (type === 0){
		type = ""
	}
	if (type === 1){
		type = "by IP address"
	}
	var lowerSrcName = srcname.toLowerCase(), lowerTrgtName = trgtname.toLowerCase(),startdate = new Date(),
		duration = duration_time === undefined ? "Indefinite" : converttoseconds(duration_unit, duration_time), 
		enddate = duration === "Indefinite" ? "Unknown" : String(new Date(Number(startdate) + duration*1000)),
		reasonline = reason === undefined ? "" : "<br/>Reason: " + reason, 
		durationline = duration === "Indefinite" ? "": " for " + duration_time + " " + timeplurality(duration_time,duration_unit),
		display = trgtname + " has been banned " + type + " from the server by " + srcname + durationline + "!" + reasonline;
	disconnect.bans[lowerTrgtName] = {};
	disconnect.bans[lowerTrgtName] = {
		"ip" : sys.dbIp(trgtname),
		"banner" : lowerSrcName,
		"reason" : reason,
		"startdate" : String(startdate),
		"duration" : duration,
		"enddate": enddate
	}
	disconnect.bannedips[sys.dbIp(trgtname)] = true;
	sys.writeToFile("script_bans.json", JSON.stringify(disconnect.bans));
	if (type !== 2){ // silent ban check
		if (global.auth !== undefined && disconnect.options.echo === "off") {
			auth.echo("admin", display);
		}
		else {
			disconnect.echo(display);
		}
	}
	else {
		commanddisplay(sys.id(srcname), "Silent Ban", "<center><b>" + trgtname + " has been banned from the server " + durationline + "!" + reasonline + "</b></center>");
	}
	var trgt = sys.id(trgtname);
	if (trgt !== undefined){
		sys.quickCall(function () {sys.kick(trgt);}, 200);
	}
	if (duration === "Indefinite"){
		sys.quickCall(function () {sys.ban(trgtname);}, 400);
	}
}

/* Banned Ips Object Load */
disconnect.bannedipsload = function(){
	disconnect.bannedips = new Object();
	var index;
	for (index in disconnect.bans){
		disconnect.bannedips[disconnect.bans[index].ip] = true;
	}
}
disconnect.bannedipsload();

/* Disconnect Announcement Function */
disconnect.echo = function (text, channel) {
	var display = "<timestamp/><table width='100%' style='background-color:qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0.1 saddlebrown, stop:0.5 chocolate); color:white;'><tr><td><center><b><big>" + text + "</big></b><small> - Disconnect Announcement </small></center></td></tr></table>";
	if (channel > -1) {
		sys.sendHtmlAll(display, channel);
	}
	else {
		sys.sendHtmlAll(display);
	}
}

/* Auto-Update Disconnect Settings */
disconnect.updatejsons = function () {
	if (disconnect.options.autoupdatesettings === "1") {
		sys.webCall(construction.source + "script_disconnectoptions.json", "downloadjson('" + construction.source + "', 'disconnectoptions', 'disconnect', 'options');");
		updatedjsons.push("disconnectoptions");
	}
}
if (disconnect.options !== undefined){
	disconnect.updatejsons();
}

/* Disconnect Commands */
disconnect.commands = {
	disconnectcommands: function (src, channel, command) {
		var osymbol = "", asymbol = "", msymbol = "", usymbol = "", srcname = sys.name(src), color = namecolor(src);
		if (global.auth !== undefined){
			osymbol = auth.options["owner"].image;
			asymbol = auth.options["admin"].image;
			msymbol = auth.options["mod"].image;
			usymbol = auth.options["user"].image;
		}
		var display = typecommands
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/adecho</font><font color='darkred'> status</font></b>: turns announcing by disconnect echo <b>status</b>. <b>status</b> is either on or off.</td></tr>" 
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/audsettings</font><font color='darkred'> value</font></b>: if <b>value</b> is 0 or 1 - auto-updates: no settings or all settings respectively. </td></tr>" 
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/udsettings</font></b>: updates the disconnect settings according to the auto-update disconnect setting. </td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/setdie</font><font color='darkred'> html</font></b>: saves the default die message as <b>html</b>. </td></tr>" 
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/setbreak</font><font color='darkred'> html</font></b>: saves the default break message as <b>html</b>. </td></tr>" 		
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/silentban</font><font color='darkred'> player</font><font color='darkblue'>*reason</font></b> or <b><font color='darkgreen'>/silentban</font><font color='darkred'> player</font><font color='darkblue'>*time</font><font color='darkviolet'>*unit</font><font color='indigo'>*reason</font></b>: silent bans <b>player</b> indefinitely or for <b>time unit</b> from the server for <b>reason</b>. <b>reason</b> is optional.</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/silentkick</font><font color='darkred'> player</font></b>: silent kicks <b>player</b> from the server.</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/silentpunch</font><font color='darkred'> player</font></b>: silent disconnects <b>player</b> from the server.</td></tr>"
		+ "<tr><td>" + asymbol + "<b><font color='darkgreen'>/ban</font><font color='darkred'> player</font><font color='darkblue'>*reason</font></b> or <b><font color='darkgreen'>/ban</font><font color='darkred'> player</font><font color='darkblue'>*time</font><font color='darkviolet'>*unit</font><font color='indigo'>*reason</font></b>: bans <b>player</b> indefinitely or for <b>time unit</b> from the server for <b>reason</b>. <b>reason</b> is optional.</td></tr>"
		+ "<tr><td>" + asymbol + "<b><font color='darkgreen'>/unban</font><font color='darkred'> player</font><font color='darkblue'>*reason</font></b>: unbans <b>player</b> from the server for <b>reason</b>. <b>reason</b> is optional.</td></tr>"
		+ "<tr><td>" + asymbol + "<b><font color='darkgreen'>/bans</font></b>: displays a table of server bans.</td></tr>"
		+ "<tr><td>" + asymbol + "<b><font color='darkgreen'>/clearbans</font></b>: clears all server bans.</td></tr>";
		var display2 = typecommands
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/kick</font><font color='darkred'> player</font><font color='darkblue'>*reason</font></b>: kicks <b>player</b> from the server for <b>reason</b>. <b>reason</b> is optional.</td></tr>"
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/punch</font><font color='darkred'> player</font><font color='darkblue'>*reason</font></b>: disconnects <b>player</b> from the server for <b>reason</b>. <b>reason</b> is optional.</td></tr>"
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/decho</font><font color='darkred'> message</font><font color='darkblue'>*channel</font></b>: displays <b>message</b> with the disconnect echo announcement - in <b>channel</b> if a name of a channel is specified. </td></tr>"
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/dsettings</font></b>: displays the disconnect settings. </td></tr>"
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/exit</font></b>: silent kicks you from the server. </td></tr>"
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/die</font><font color='darkred'> message</font></b>: sends <b><font color=" + color + ">~" + sys.name(src) + "</font> message</b> into the main chat of the channel you use this in and then kicks you from the server. If no message is specified, the default message is chosen. </td></tr>"
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/disconnect</font></b>: silent disconnects you from the server. </td></tr>"
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/break</font><font color='darkred'> message</font></b>: sends <b><font color=" + color + ">#" + sys.name(src) + "</font> message</b> into the main chat of the channel you use this in and then disconnects you from the server. If no message is specified, the default message is chosen. </td></tr>";
		commanddisplay(src, "Disconnect Commands (Part 1)", display, channel);
		commanddisplay(src, "Disconnect Commands (Part 2)", display2, channel);
	},
	kick: function (src, channel, command) {
		if (sys.auth(src) < 1) {
			commanderror(src, "Sorry, you do not have permission to use the kick command (mod command).", channel);
			return;
		}
		var trgt = sys.id(command[1]);
		if (trgt === undefined){
			commanderror(src, "Sorry, " + command[1] + " is not currently on the server.", channel);
			return;
		}
		if (src == trgt){
			commanderror(src, "Sorry, you are unable to kick yourself.", channel);
			return;
		}
		var trgtname = sys.name(trgt);
		if (sys.auth(src) <= sys.auth(trgt)){
			commanderror(src, "Sorry, you are unable to kick " + trgtname + " because their auth level is not below yours.", channel);
			return;
		}
		var reason = command[2];
		if (command.length > 2){
			command.splice(0,2);
			reason = command.join("*");
		}
		disconnect.kick(src, trgt, reason);
	},
	silentkick: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the silent kick command (owner command).", channel);
			return;
		}
		var trgt = sys.id(command[1]);
		if (trgt === undefined){
			commanderror(src, "Sorry, " + command[1] + " is not currently on the server.", channel);
			return;
		}
		sys.kick(trgt);
	},
	ban: function (src, channel, command){
		if (sys.auth(src) < 2) {
			commanderror(src, "Sorry, you do not have permission to use the ban command (admin command).", channel);
			return;
		}
		var trgtname = command[1].toLowerCase();
		if (members[trgtname] === undefined){
			commanderror(src, "Sorry, " + command[1] + " could not be found in the member database.", channel);
			return;
		}
		if (disconnect.bans[trgtname] !== undefined){
			if (Number(new Date(disconnect.bans[trgtname].enddate)) < Number(new Date())) {
				delete disconnect.bans[trgtname];
				sys.writeToFile('script_bans.json', JSON.stringify(disconnect.bans));
			}
		}
		if (disconnect.bans[trgtname] !== undefined || sys.banList().indexOf(trgtname) !== -1){
			commanderror(src, "Sorry, " + members[trgtname] + " is undergoing a current ban.", channel);
			return;
		}
		if (sys.ip(src) === sys.dbIp(trgtname)){
			commanderror(src, "Sorry, you are unable to ban yourself.", channel);
			return;
		}
		if (sys.auth(src) <= sys.maxAuth(sys.dbIp(trgtname))){
			commanderror(src, "Sorry, you are unable to ban " + members[trgtname] + " because their maximum auth level is not below your current.", channel);
			return;
		}
		var reason;
		if (command.length > 3){
			var time = parseInt(command[2]), timeunit = command[3].toLowerCase();
			if (!nottimeunit(timeunit) && !isNaN(time)){
				if (command.length > 4){
					command.splice(0,4);
					reason = command.join("*");
				}
				disconnect.ban(sys.name(src), members[trgtname], 0, reason, time, timeunit);
				return;
			}
		}
		if (command.length > 2){
			command.splice(0,2);
			reason = command.join("*");
		}
		disconnect.ban(sys.name(src), members[trgtname], 0, reason);
	},
	unban: function (src, channel, command){
		if (sys.auth(src) < 2) {
			commanderror(src, "Sorry, you do not have permission to use the unban command (admin command).", channel);
			return;
		}
		var srcname = sys.name(src), trgtname = command[1].toLowerCase(), banlist = sys.banList();
		if (members[trgtname] === undefined){
			commanderror(src, "Sorry, " + command[1] + " could not be found in the member database.", channel);
			return;
		}
		if (disconnect.bans[trgtname] !== undefined){
			if (Number(new Date(disconnect.bans[trgtname].enddate)) < Number(new Date())) {
				delete disconnect.bans[trgtname];
				sys.writeToFile('script_bans.json', JSON.stringify(disconnect.bans));
			}
		}
		if (disconnect.bans[trgtname] === undefined && banlist.indexOf(trgtname) === -1){
			commanderror(src, "Sorry, " + members[trgtname] + " is not currently banned.", channel);
			return;
		}
		if (banlist.indexOf(trgtname) !== -1){
			sys.unban(trgtname);
		}
		if (disconnect.bans[trgtname] !== undefined){
			delete disconnect.bans[trgtname];
			sys.writeToFile("script_bans.json", JSON.stringify(disconnect.bans));
		}
		delete disconnect.bannedips[sys.dbIp(trgtname)];
		var i;
		for (i in disconnect.bans){
			if (disconnect.bans[i].ip === sys.dbIp(trgtname)){
				delete disconnect.bans[i];
				sys.writeToFile("script_bans.json", JSON.stringify(disconnect.bans));
			}
		}
		var reason = command[2];
		if (command.length > 2){
			command.splice(0,2);
			reason = command.join("*");
		}
		var reasonline = reason === undefined ? "" : "<br/>Reason: " + reason, 
		display = members[trgtname] + " has been unbanned from the server by " + srcname + "!" + reasonline;
		if (global.auth !== undefined && disconnect.options.echo === "off") {
			auth.echo("admin", display);
		}
		else {
			disconnect.echo(display);
		}
	},
	bans: function (src, channel, command){
		if (sys.auth(src) < 2) {
			commanderror(src, "Sorry, you do not have permission to use the bans command (admin command).", channel);
			return;
		}
		var banlist = sys.banList(), player;
		if (banlist.length === 0 && Object.keys(disconnect.bans).length === 0) {
			commanderror(src, "Sorry, the Ban List is currently empty.", channel);
			return;
		}
		var display = "<tr><td><b>Name</b></td><td><b>IP Address</b></td><td><b> Banned by </b></td><td><b>Reason</b></td><td><b>Start Date</b></td><td><b>Duration</b></td><td><b>End Date</b></td><td><b>Time Left</b></td></tr>";
		for (player in banlist){
			if (disconnect.bans[banlist[player]] === undefined) {
				display += "<tr><td>" + members[banlist[player]] + "</td><td>" + sys.dbIp(banlist[player]) + "</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
			}
		}
		var index, bans = disconnect.bans, bannedplayers = 0;
		for (index in bans) {
			var current_date = new Date();
			if (Number(new Date(bans[index].enddate)) < Number(current_date)) {
				delete bans[index];
				sys.writeToFile('script_bans.json', JSON.stringify(bans));
				continue;
			}
			bannedplayers++;
			var duration = converttime(Number(bans[index].duration)*1000), timeleft = converttime(new Date(bans[index].enddate) - new Date());
			if (bans[index].duration === "Indefinite"){
				duration = "Indefinite";
				timeleft = "Unknown";
			}
			display += "<tr><td>" + members[index] + "</td><td>" + bans[index].ip + "</td><td>" + members[bans[index].banner] + "</td><td>" + bans[index].reason + "</td><td><small>" + bans[index].startdate + "</small></td><td>" + duration + "</td><td><small>" + bans[index].enddate + "</small></td><td>" + timeleft +  "</td></tr>";
		}
		if (bannedplayers === 0 && banlist.length === 0){
			commanderror(src, "Sorry, the Ban List is currently empty.", channel);
			return;
		}
		commanddisplay(src, "Ban List", display, channel);
	},
	clearbans: function (src, channel, command) {
		if (sys.auth(src) < 2) {
			commanderror(src, "Sorry, you do not have permission to use the clearbans command (admin command).", channel);
			return;
		}
		var banlist = sys.banList(), index;
		if (banlist.length === 0 && Object.keys(disconnect.bans).length === 0) {
			commanderror(src, "Sorry, the Ban List is already empty.", channel);
			return;
		}
		disconnect.bans = {};
		sys.writeToFile("script_bans.json", JSON.stringify(disconnect.bans));
		for (index in banlist){
			sys.unban(banlist[index]);
		}
		var display = "The server ban list has been cleared by " + sys.name(src) + ".";
		if (global.auth !== undefined && disconnect.options.echo === "off") {
			auth.echo("admin", display);
		}
		else {
			disconnect.echo(display);
		}
	},
	decho: function(src, channel, command){
		if (sys.auth(src) < 1) {
			commanderror(src, "Sorry, you do not have permission to use the disconnect echo command (mod command).", channel);
			return;
		}
		var channelid = sys.channelId(command[command.length - 1]);
		sys.sendAll(sys.name(src) + ":", channelid);
		command.splice(0, 1);
		if (channelid !== undefined && command.length > 1) {
			command.splice(command.length - 1, 1);
		}
		command = command.join("*");
		disconnect.echo(command, channelid);
	},
	adecho: function(src, channel, command){
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the auto disconnect echo command (owner command).", channel);
			return;
		}
		var arg = command[1].toLowerCase(), srcname = sys.name(src);
		if (arg !== "on" && arg !== "off") {
			commanderror(src, "Sorry, you are required to specify on or off.", channel);
			return;
		}
		if (arg === "on") {
			if (disconnect.options.echo === "on") {
				commanderror(src, "Sorry, announcing by disconnect echo is already turned on.", channel);
				return;
			}
			disconnect.options.echo = "on";
			sys.writeToFile("script_disconnectoptions.json", JSON.stringify(disconnect.options));
			disconnect.echo("Announcing by disconnect echo has been turned on by " + srcname + "!", -1);
			return;
		}
		if (disconnect.options.echo === "off") {
			commanderror(src, "Sorry, announcing by disconnect echo is already turned off.", channel);
			return;
		}
		disconnect.options.echo = "off";
		sys.writeToFile("script_disconnectoptions.json", JSON.stringify(disconnect.options));
		if (global.auth !== undefined) {
			auth.echo("owner", "Announcing by disconnect echo has been turned off by " + srcname + "!", -1);
		}
	},
	dsettings: function(src, channel, command) {
		var display = "<tr><td><b> Disconnect Echo: </b>" + disconnect.options.echo + "</td></tr>"
		+ "<tr><td><b> Auto-Update Settings: </b>" + disconnect.options.autoupdatesettings + "</td></tr>"
		+ "<tr><td><b> Die Message: </b>" + escapehtml(disconnect.options.die) + "</td></tr>"
		+ "<tr><td><b> Break Message: </b>" + escapehtml(disconnect.options["break"]) + "</td></tr>";
		commanddisplay(src, "Disconnect Settings", display, channel);
	},
	silentban: function (src, channel, command){
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the silent ban command (owner command).", channel);
			return;
		}
		var trgtname = command[1].toLowerCase();
		if (members[trgtname] === undefined){
			commanderror(src, "Sorry, " + command[1] + " could not be found in the member database.", channel);
			return;
		}
		if (disconnect.bans[trgtname] !== undefined){
			if (Number(new Date(disconnect.bans[trgtname].enddate)) < Number(new Date())) {
				delete disconnect.bans[trgtname];
				sys.writeToFile('script_bans.json', JSON.stringify(disconnect.bans));
			}
		}
		if (disconnect.bans[trgtname] !== undefined || sys.banList().indexOf(trgtname) !== -1){
			commanderror(src, "Sorry, " + members[trgtname] + " is undergoing a current ban.", channel);
			return;
		}
		var reason;
		if (command.length > 3){
			var time = parseInt(command[2]), timeunit = command[3].toLowerCase();
			if (!nottimeunit(timeunit) && !isNaN(time)){
				if (command.length > 4){
					command.splice(0,4);
					reason = command.join("*");
				}
				disconnect.ban(sys.name(src), members[trgtname], 2, reason, time, timeunit);
				return;
			}
		}
		if (command.length > 2){
			command.splice(0,2);
			reason = command.join("*");
		}
		disconnect.ban(sys.name(src), members[trgtname], 2, reason);
	},
	udsettings: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the update disconnect settings command (owner command).", channel);
			return;
		}
		if (disconnect.options.autoupdatesettings === "0"){
			commanderror(src, "Sorry, you could not update any settings because auto-update settings is set to 0.", channel);
			return;
		}
		disconnect.updatejsons();
		if (global.auth !== undefined && disconnect.options.echo === "off") {
			auth.echo("owner", "The disconnect settings have been updated by " + sys.name(src) + "!", -1);
		}
		else {
			disconnect.echo("The disconnect settings have been updated by " + sys.name(src) + "!", -1);
		}
	},
	audsettings: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the auto-update disconnect settings command (owner command).", channel);
			return;
		}
		if (command[1] != "0" && command[1] != "1") {
			commanderror(src, "Sorry, you must specify either 0 or 1 for the auto-update disconnect settings command.", channel);
			return;
		}
		if (command[1] === disconnect.options.autoupdatesettings) {
			commanderror(src, "The disconnect auto-update settings is already set to " + command[1] + ".", channel);
			return;
		}
		disconnect.options.autoupdatesettings = command[1];
		sys.writeToFile("script_disconnectoptions.json", JSON.stringify(disconnect.options));
		if (global.auth !== undefined && disconnect.options.echo === "off") {
			auth.echo("owner", "The disconnect auto-update settings has been changed to " + command[1] + " by " + sys.name(src) + "!", -1);
		}
		else {
			disconnect.echo("The disconnect auto-update settings has been changed to " + command[1] + " by " + sys.name(src) + "!", -1)
		}
	},
	exit: function (src, channel, command){
		sys.kick(src);
	},
	disconnect: function (src, channel, command){
		sys.disconnect(src);
	},
	punch: function (src, channel, command) {
		if (sys.auth(src) < 1) {
			commanderror(src, "Sorry, you do not have permission to use the punch command (mod command).", channel);
			return;
		}
		var trgt = sys.id(command[1]);
		if (trgt === undefined){
			commanderror(src, "Sorry, " + command[1] + " is not currently on the server.", channel);
			return;
		}
		if (src == trgt){
			commanderror(src, "Sorry, you are unable to punch yourself.", channel);
			return;
		}
		var trgtname = sys.name(trgt);
		if (sys.auth(src) <= sys.auth(trgt)){
			commanderror(src, "Sorry, you are unable to punch " + trgtname + " because their auth level is not below yours.", channel);
			return;
		}
		var reason = command[2];
		if (command.length > 2){
			command.splice(0,2);
			reason = command.join("*");
		}
		disconnect.punch(src, trgt, reason);
	},
	silentpunch: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the silent punch command (owner command).", channel);
			return;
		}
		var trgt = sys.id(command[1]);
		if (trgt === undefined){
			commanderror(src, "Sorry, " + command[1] + " is not currently on the server.", channel);
			return;
		}
		sys.disconnect(trgt);
	},
	die: function (src, channel, command) {
		var color = namecolor(src), message = "<font color=" + color + "><timestamp/> <b>~" + sys.name(src) + "</font></b> ";
		if (command[1] === "undefined"){
			message += disconnect.options.die;
		}
		else {
			message += "<b>" + escapehtml(command.slice(1).join("*")) + "</b>";
		}
		sys.sendHtmlAll(message, channel);
		sys.quickCall(function () {sys.kick(src);}, 200);
	},
	'break': function (src, channel, command) {
		var color = namecolor(src), message = "<font color=" + color + "><timestamp/> <b>#" + sys.name(src) + "</font></b> ";
		if (command[1] === "undefined"){
			message += disconnect.options["break"];
		}
		else {
			message += "<b>" + escapehtml(command.slice(1).join("*")) + "</b>";
		}
		sys.sendHtmlAll(message, channel);
		sys.quickCall(function () {sys.disconnect(src);}, 200);
	},
	setdie: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the set die default message command (owner command).", channel);
			return;
		}
		if (command[1] === "undefined"){
			commanderror(src, "Sorry, you do not specify a default message for die. e.g \"/setdie 's PC blew up.\" ", channel);
			return;
		}
		var message = command.slice(1).join("*");
		disconnect.options.die = message;
		if (global.auth !== undefined && disconnect.options.echo === "off") {
			auth.echo("owner", "The die message was changed to: " + escapehtml(message) + " by " + sys.name(src) + ".", -1);
		}
		else {
			disconnect.echo("The die message was changed to: " + escapehtml(message) + " by " + sys.name(src) + ".", -1)
		}
	},
	setbreak: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the set break default message command (owner command).", channel);
			return;
		}
		if (command[1] === "undefined"){
			commanderror(src, "Sorry, you do not specify a default message for break. e.g \"/setbreak 's connection froze.\" ", channel);
			return;
		}
		var message = command.slice(1).join("*");
		disconnect.options["break"] = message;
		if (global.auth !== undefined && disconnect.options.echo === "off") {
			auth.echo("owner", "The break message was changed to: " + escapehtml(message) + " by " + sys.name(src) + ".", -1);
		}
		else {
			disconnect.echo("The break message was changed to: " + escapehtml(message) + " by " + sys.name(src) + ".", -1)
		}
	}
}

/* Kick Event */
append("beforePlayerKick", "sys.stopEvent(); disconnect.kick(src,trgt);");

/* Ban Event */
append("beforePlayerBan", "sys.stopEvent(); var srcname = sys.name(src), trgtname = sys.name(trgt); disconnect.ban(srcname, trgtname, 0);");

/* Ban Checks */
var timed_ban_check = "\u000A"
+ "\t\tvar lowerSrcName = sys.name(src).toLowerCase(), srcip = sys.ip(src), current_date = new Date(), index;\u000A"
+ "\t\tif(disconnect.bannedips[srcip] || disconnect.bans[lowerSrcName] !== undefined){\u000A"
+ "\t\t\tfor (index in disconnect.bans){\u000A"
+ "\t\t\t\tif (disconnect.bans[index].ip === srcip || index === lowerSrcName){\u000A"	
+ "\t\t\t\t\tif (Number(new Date(disconnect.bans[index].enddate)) < Number(current_date) || disconnect.bans[index].enddate === 'Unknown'){\u000A"
+ "\t\t\t\t\t\tdelete disconnect.bannedips[srcip];\u000A"
+ "\t\t\t\t\t\tdelete disconnect.bans[index];\u000A"
+ "\t\t\t\t\t\tcontinue;\u000A"
+ "\t\t\t\t\t}\u000A"
+ "\t\t\t\t\tsys.stopEvent();\u000A"
+ "\t\t\t\t}\u000A"
+ "\t\t\t}\u000A"
+ "\t\t\tsys.writeToFile('script_bans.json',JSON.stringify(disconnect.bans));\u000A"
+ "\t\t}";
prepend("beforeLogIn", timed_ban_check);