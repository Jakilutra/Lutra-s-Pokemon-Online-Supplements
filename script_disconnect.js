/* Loading Disconnect Object and Settings */
disconnect = {};
set(construction.source, "bans", "disconnect", "bans");

/* Kick Function */
disconnect.kick = function (src, trgt, reason){
	var srcname = sys.name(src), trgtname = sys.name(trgt), 
	reasonline = reason === undefined ? "" : "<br/>Reason: " + reason,
	display = trgtname + " has been kicked from the server by " + srcname + "!" + reasonline;
	if (global.auth !== undefined) {
		auth.echo("mod", display);
	}
	sys.quickCall(function () {sys.kick(trgt);}, 200);
}

/* Ban Function */
disconnect.ban = function (srcname, trgtname, type, reason, duration_time, duration_unit) {
	type = type == 1 ? "by IP address" : "";
	var lowerSrcName = srcname.toLowerCase(),
	lowerTrgtName = trgtname.toLowerCase(),
	startdate = new Date(),
	duration = duration_time === undefined ? "Indefinite" : converttoseconds(duration_unit, duration_time), 
	enddate = duration === "Indefinite" ? "Unknown" : String(new Date(Number(startdate) + duration*1000)),
	reasonline = reason === undefined ? "" : "<br/>Reason: " + reason, 
	durationline = duration === "Indefinite" ? "": " for " + duration_time + " " + duration_unit,
	display = trgtname + " has been banned " + type + " from the server by " + srcname + durationline + "!" + reasonline;
	disconnect.bans[lowerTrgtName] = {};
	disconnect.bans[lowerTrgtName] = {
		"banner" : lowerSrcName,
		"reason" : reason,
		"startdate" : String(startdate),
		"duration" : duration,
		"enddate": enddate
	}
	sys.writeToFile("script_bans.json", JSON.stringify(disconnect.bans));
	if (global.auth !== undefined) {
		auth.echo("admin", display);
	}
	var trgt = sys.id(trgtname);
	if (trgt !== undefined){
		sys.quickCall(function () {sys.kick(trgt);}, 200);
	}
	if (duration === "Indefinite"){
		sys.quickCall(function () {sys.ban(trgtname);}, 400);
	}
}

/* Disconnect Commands */
disconnect.commands = {
	disconnectcommands: function (src, channel, command) {
		var osymbol = "", asymbol = "", msymbol = "";
		if (global.auth !== undefined){
			osymbol = auth.options["owner"].image;
			asymbol = auth.options["admin"].image;
			msymbol = auth.options["mod"].image;
		}
		var display = typecommands
		+ "<tr><td>" + asymbol + "<b><font color='darkgreen'>/ban</font><font color='darkred'> player</font><font color='darkblue'>*reason</font></b> or <b><font color='darkgreen'>/ban</font><font color='darkred'> player</font><font color='darkblue'>*time</font><font color='darkviolet'>*unit</font><font color='indigo'>*reason</font></b>: bans <b>player</b> indefinitely or for <b>time unit</b> from the server for <b>reason</b>. <b>reason</b> is optional.</td></tr>"
		+ "<tr><td>" + asymbol + "<b><font color='darkgreen'>/unban</font><font color='darkred'> player</font><font color='darkblue'>*reason</font></b>: unbans <b>player</b> from the server for <b>reason</b>. <b>reason</b> is optional.</td></tr>"
		+ "<tr><td>" + asymbol + "<b><font color='darkgreen'>/bans</font></b>: displays a table of server bans.</td></tr>"
		+ "<tr><td>" + asymbol + "<b><font color='darkgreen'>/clearbans</font></b>: clears all server bans.</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/silentkick</font><font color='darkred'> player</font></b>: silent kicks <b>player</b> from the server.</td></tr>"
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/kick</font><font color='darkred'> player</font><font color='darkblue'>*reason</font></b>: kicks <b>player</b> from the server for <b>reason</b>. <b>reason</b> is optional.</td></tr>";
		commanddisplay(src, "Disconnect Commands", display, channel);
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
		var index;
		for (index in disconnect.bans){
			if (sys.dbIp(index) == sys.dbIp(trgtname)){
				delete disconnect.bans[trgtname];
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
		if (global.auth !== undefined) {
			auth.echo("admin", display);
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
			display += "<tr><td>" + members[index] + "</td><td>" + sys.dbIp(index) + "</td><td>" + members[bans[index].banner] + "</td><td>" + bans[index].reason + "</td><td><small>" + bans[index].startdate + "</small></td><td>" + duration + "</td><td><small>" + bans[index].enddate + "</small></td><td>" + timeleft +  "</td></tr>";
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
		if (global.auth !== undefined) {
			auth.echo("admin", display);
		}
	}
}

/* Kick Event */
append("beforePlayerKick", "sys.stopEvent(); disconnect.kick(src,trgt);");

/* Ban Event */
append("beforePlayerBan", "sys.stopEvent(); var srcname = sys.name(src), trgtname = sys.name(trgt); disconnect.ban(srcname, trgtname);");

/* Ban Checks */
var timed_ban_check = "\u000A"
+ "\t\tvar lowerSrcName = sys.name(src).toLowerCase(), current_date = new Date();\u000A"
+ "\t\tif(disconnect.bans[lowerSrcName] !== undefined){\u000A"
+ "\t\t\tif (Number(new Date(disconnect.bans[lowerSrcName].enddate)) < Number(current_date) || disconnect.bans[lowerSrcName].enddate === 'Unknown'){\u000A"
+ "\t\t\t\tdelete disconnect.bans[lowerSrcName];\u000A"
+ "\t\t\t\tsys.writeToFile('script_bans.json',JSON.stringify(disconnect.bans));\u000A"
+ "\t\t\t\treturn;\u000A"
+ "\t\t\t}\u000A"
+ "\t\t\tsys.stopEvent();\u000A"
+ "\t\t}\u000A";
prepend("beforeLogIn", timed_ban_check);