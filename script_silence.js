/* Loading Silence Object and Settings */
silence = {};
set(construction.source, "mutes", "silence", "mutes");
set(construction.source, "silenceoptions", "silence", "options");

/* Silence Function */
silence.silence = function (srcname, level, type, reason, duration_time, duration_unit) {
	var sortofsilence = ["silence", "super silence", "mega silence"][level-1];
	var lowerSrcName = srcname.toLowerCase(), startdate = new Date(),
		duration = duration_time === undefined ? "Indefinite" : converttoseconds(duration_unit, duration_time), 
		enddate = duration === "Indefinite" ? "Unknown" : String(new Date(Number(startdate) + duration*1000)),
		reasonline = reason === "undefined" || reason === undefined ? "" : "<br/>Reason: " + reason, 
		durationline = duration === "Indefinite" ? "": " for " + duration_time + " " + duration_unit,
		display = "The server has been " + sortofsilence + "d by " + srcname + durationline + "!" + reasonline;
	silence.options.silence = {};
	silence.options.silence = {
		"level": level,
		"silencer": lowerSrcName,
		"reason": reason,
		"startdate": String(startdate),
		"duration": duration,
		"enddate": enddate
	}
	sys.writeToFile("script_silenceoptions.json", JSON.stringify(silence.options));
	if (type !== 1){ // silent silence check
		if (global.auth !== undefined && silence.options.echo === "off") {
			auth.echo(["mod", "admin", "owner"][level-1], display);
		}
		else {
			silence.echo(display);
		}
	}
	else {
		commanddisplay(sys.id(srcname), "Silent Silence", "<center><b>The Server has been silenced " + durationline + "!" + reasonline + "</b></center>");
	}
}

/* Mute Function */
silence.mute = function (srcname, trgtname, type, reason, duration_time, duration_unit) {
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
		durationline = duration === "Indefinite" ? "": " for " + duration_time + " " + duration_unit,
		display = trgtname + " has been muted " + type + " by " + srcname + durationline + "!" + reasonline;
	silence.mutes[lowerTrgtName] = {};
	silence.mutes[lowerTrgtName] = {
		"ip" : sys.dbIp(trgtname),
		"muter" : lowerSrcName,
		"reason" : reason,
		"startdate" : String(startdate),
		"duration" : duration,
		"enddate": enddate
	}
	silence.mutedips[sys.dbIp(trgtname)] = true;
	sys.writeToFile("script_mutes.json", JSON.stringify(silence.mutes));
	if (type !== 2){ // silent mute check
		if (global.auth !== undefined && silence.options.echo === "off") {
			auth.echo("mod", display);
		}
		else {
			silence.echo(display);
		}
	}
	else {
		commanddisplay(sys.id(srcname), "Silent Mute", "<center><b>" + trgtname + " has been muted " + durationline + "!" + reasonline + "</b></center>");
	}
}

/* Muted Ips Object Load */
silence.mutedipsload = function(){
	silence.mutedips = new Object();
	var index;
	for (index in silence.mutes){
		silence.mutedips[silence.mutes[index].ip] = true;
	}
}
silence.mutedipsload();

/* Silence Announcement Function */
silence.echo = function (text, channel) {
	var display = "<timestamp/><table width='100%' style='background-color:qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0.1 black, stop:0.5 thistle); color:black;'><tr><td><center><b><big>" + text + "</big></b><small> - Silence Announcement </small></center></td></tr></table>";
	if (channel > -1) {
		sys.sendHtmlAll(display, channel);
	}
	else {
		sys.sendHtmlAll(display);
	}
}

/* Auto-Update Silence Settings */
silence.updatejsons = function () {
	silence.jsonsupdated = new Array();
	if (silence.options.autoupdatesettings === "1") {
		sys.webCall(construction.source + "script_silenceoptions.json", "downloadjson('" + construction.source + "', 'silenceoptions', 'silence', 'options');");
		silence.jsonsupdated.push("silenceoptions");
	}
	if (silence.jsonsupdated.length !== 0){
		print("The following silence settings were updated : " + String(silence.jsonsupdated).replace(/,/gi, ", ") + ".");
	}
}
if (silence.options !== undefined){
	silence.updatejsons();
}

/* Silence Commands */
silence.commands = {
	silencecommands: function (src, channel, command) {
		var osymbol = "", asymbol = "", msymbol = "", usymbol = "";
		if (global.auth !== undefined){
			osymbol = auth.options["owner"].image;
			asymbol = auth.options["admin"].image;
			msymbol = auth.options["mod"].image;
			usymbol = auth.options["user"].image;
		}
		var display = typecommands
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/asilecho</font><font color='darkred'> status</font></b>: turns announcing by silence echo <b>status</b>. <b>status</b> is either on or off.</td></tr>" 
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/silecho</font><font color='darkred'> message</font><font color='darkblue'>*channel</font></b>: displays <b>message</b> with the silence echo announcement - in <b>channel</b> if a name of a channel is specified. </td></tr>"
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/silencesettings</font></b>: displays the silence settings. </td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/ausilencesettings</font><font color='darkred'> value</font></b>: if <b>value</b> is 0 or 1 - auto-updates: no settings or all settings respectively. </td></tr>" 
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/usilencesettings</font></b>: updates the silence settings according to the auto-update silence setting. </td></tr>" 
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/megasilence</font><font color='darkred'> reason</font></b> or <b><font color='darkgreen'>/megasilence</font><font color='darkred'> time</font><font color='darkblue'>*unit</font><font color='darkviolet'>*reason</font></b>: megasilences the server indefinitely or for <b>time unit</b> for <b>reason</b>. <b>reason</b> is optional.</td></tr>"
		+ "<tr><td>" + asymbol + "<b><font color='darkgreen'>/supersilence</font><font color='darkred'> reason</font></b> or <b><font color='darkgreen'>/supersilence</font><font color='darkred'> time</font><font color='darkblue'>*unit</font><font color='darkviolet'>*reason</font></b>: supersilences the server indefinitely or for <b>time unit</b> for <b>reason</b>. <b>reason</b> is optional.</td></tr>"
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/silence</font><font color='darkred'> reason</font></b> or <b><font color='darkgreen'>/silence</font><font color='darkred'> time</font><font color='darkblue'>*unit</font><font color='darkviolet'>*reason</font></b>: silences the server indefinitely or for <b>time unit</b> for <b>reason</b>. <b>reason</b> is optional.</td></tr>"
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/unsilence</font><font color='darkred'> reason</font></b>: unsilences the server for <b>reason</b>. <b>reason</b> is optional.</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/silentmute</font><font color='darkred'> player</font><font color='darkblue'>*reason</font></b> or <b><font color='darkgreen'>/silentmute</font><font color='darkred'> player</font><font color='darkblue'>*time</font><font color='darkviolet'>*unit</font><font color='indigo'>*reason</font></b>: silent mutes <b>player</b> indefinitely or for <b>time unit</b> for <b>reason</b>. <b>reason</b> is optional.</td></tr>"
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/mute</font><font color='darkred'> player</font><font color='darkblue'>*reason</font></b> or <b><font color='darkgreen'>/mute</font><font color='darkred'> player</font><font color='darkblue'>*time</font><font color='darkviolet'>*unit</font><font color='indigo'>*reason</font></b>: mutes <b>player</b> indefinitely or for <b>time unit</b> for <b>reason</b>. <b>reason</b> is optional.</td></tr>"
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/unmute</font><font color='darkred'> player</font><font color='darkblue'>*reason</font></b>: unmutes <b>player</b> for <b>reason</b>. <b>reason</b> is optional.</td></tr>"
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/mutes</font></b>: displays a table of server mutes.</td></tr>"
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/clearmutes</font></b>: clears all server mutes.</td></tr>";
		commanddisplay(src, "Silence Commands", display, channel);
	},
	mute: function (src, channel, command){
		if (sys.auth(src) < 1) {
			commanderror(src, "Sorry, you do not have permission to use the mute command (mod command).", channel);
			return;
		}
		var trgtname = command[1].toLowerCase();
		if (members[trgtname] === undefined){
			commanderror(src, "Sorry, " + command[1] + " could not be found in the member database.", channel);
			return;
		}
		if (silence.mutes[trgtname] !== undefined){
			commanderror(src, "Sorry, " + members[trgtname] + " is undergoing a current mute.", channel);
			return;
		}
		if (sys.ip(src) === sys.dbIp(trgtname)){
			commanderror(src, "Sorry, you are unable to mute yourself.", channel);
			return;
		}
		if (sys.auth(src) <= sys.maxAuth(sys.dbIp(trgtname))){
			commanderror(src, "Sorry, you are unable to mute " + members[trgtname] + " because their maximum auth level is not below your current.", channel);
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
				silence.mute(sys.name(src), members[trgtname], 0, reason, time, timeunit);
				return;
			}
		}
		if (command.length > 2){
			command.splice(0,2);
			reason = command.join("*");
		}
		silence.mute(sys.name(src), members[trgtname], 0, reason);
	},
	unmute: function(src, channel, command){
		if (sys.auth(src) < 1) {
			commanderror(src, "Sorry, you do not have permission to use the unmute command (mod command).", channel);
			return;
		}
		var srcname = sys.name(src), trgtname = command[1].toLowerCase();
		if (members[trgtname] === undefined){
			commanderror(src, "Sorry, " + command[1] + " could not be found in the member database.", channel);
			return;
		}
		if (silence.mutes[trgtname] === undefined){
			commanderror(src, "Sorry, " + members[trgtname] + " is not currently muted.", channel);
			return;
		}
		if (silence.mutes[trgtname].ip === sys.ip(src) || trgtname === sys.name(src).toLowerCase()){
			commanderror(src, "Sorry, you cannot unmute yourself.", channel);
			return;
		}
		if (silence.mutes[trgtname] !== undefined){
			delete silence.mutes[trgtname];
			sys.writeToFile("script_mutes.json", JSON.stringify(silence.mutes));
		}
		delete silence.mutedips[sys.dbIp(trgtname)];
		var i;
		for (i in silence.mutes){
			if (silence.mutes[i].ip === sys.dbIp(trgtname)){
				delete silence.mutes[i];
				sys.writeToFile("script_mutes.json", JSON.stringify(silence.mutes));
			}
		}
		var reason = command[2];
		if (command.length > 2){
			command.splice(0,2);
			reason = command.join("*");
		}
		var reasonline = reason === undefined ? "" : "<br/>Reason: " + reason, 
		display = members[trgtname] + " has been unmuted by " + srcname + "!" + reasonline;
		if (global.auth !== undefined && silence.options.echo === "off") {
			auth.echo("mod", display);
		}
		else {
			silence.echo(display);
		}
	},
	mutes: function(src, channel, command){
		if (sys.auth(src) < 1) {
			commanderror(src, "Sorry, you do not have permission to use the mutes command (mod command).", channel);
			return;
		}
		if (Object.keys(silence.mutes).length === 0) {
			commanderror(src, "Sorry, the Mute List is currently empty.", channel);
			return;
		}
		var display = "<tr><td><b>Name</b></td><td><b>IP Address</b></td><td><b> Muted by </b></td><td><b>Reason</b></td><td><b>Start Date</b></td><td><b>Duration</b></td><td><b>End Date</b></td><td><b>Time Left</b></td></tr>";
		var index, mutes = silence.mutes, mutedplayers = 0;
		for (index in mutes) {
			var current_date = new Date();
			if (Number(new Date(mutes[index].enddate)) < Number(current_date)) {
				delete mutes[index];
				sys.writeToFile('script_mutes.json', JSON.stringify(mutes));
				continue;
			}
			mutedplayers++;
			var duration = converttime(Number(mutes[index].duration)*1000), timeleft = converttime(new Date(mutes[index].enddate) - new Date());
			if (mutes[index].duration === "Indefinite"){
				duration = "Indefinite";
				timeleft = "Unknown";
			}
			display += "<tr><td>" + members[index] + "</td><td>" + mutes[index].ip + "</td><td>" + members[mutes[index].muter] + "</td><td>" + mutes[index].reason + "</td><td><small>" + mutes[index].startdate + "</small></td><td>" + duration + "</td><td><small>" + mutes[index].enddate + "</small></td><td>" + timeleft +  "</td></tr>";
		}
		if (mutedplayers === 0){
			commanderror(src, "Sorry, the Mute List is currently empty.", channel);
			return;
		}
		commanddisplay(src, "Mute List", display, channel);
	},
	clearmutes: function (src, channel, command) {
		if (sys.auth(src) < 1) {
			commanderror(src, "Sorry, you do not have permission to use the clearmutes command (mod command).", channel);
			return;
		}
		if (Object.keys(silence.mutes).length === 0) {
			commanderror(src, "Sorry, the Mute List is already empty.", channel);
			return;
		}
		silence.mutes = {};
		sys.writeToFile("script_mutes.json", JSON.stringify(silence.mutes));
		var display = "The server mute list has been cleared by " + sys.name(src) + ".";
		if (global.auth !== undefined && silence.options.echo === "off") {
			auth.echo("mod", display);
		}
		else {
			silence.echo(display);
		}
	},
	silence: function (src, channel, command){
		if (sys.auth(src) < 1){
			commanderror(src, "Sorry, you do not have permission to use the silence command (mod command).", channel);
			return;
		}
		if (silence.options.silence.level === 1){
			commanderror(src, "Sorry, you cannot use silence because silence is already in effect.", channel);
			return;
		}
		if (silence.options.silence.level === 2 && sys.auth(src) < 2){
			commanderror(src, "Sorry, you cannot use silence because super silence is in effect.", channel);
			return;
		}
		if (silence.options.silence.level === 3 && sys.auth(src) < 3){
			commanderror(src, "Sorry, you cannot use silence because mega silence is in effect.", channel);
			return;
		}
		var reason;
		if (command.length > 2){
			var time = parseInt(command[1]), timeunit = command[2].toLowerCase();
			if (!nottimeunit(timeunit) && !isNaN(time)){
				if (command.length > 3){
					command.splice(0,3);
					reason = command.join("*");
				}
				silence.silence(sys.name(src), 1, 0, reason, time, timeunit);
				return;
			}
		}
		if (command.length > 1){
			command.splice(0,1);
			reason = command.join("*");
		}
		silence.silence(sys.name(src), 1, 0, reason);		
	},
	supersilence: function (src, channel, command){
		if (sys.auth(src) < 2){
			commanderror(src, "Sorry, you do not have permission to use the super silence command (admin command).", channel);
			return;
		}
		if (silence.options.silence.level === 2){
			commanderror(src, "Sorry, you cannot use super silence because super silence is already in effect.", channel);
			return;
		}
		if (silence.options.silence.level === 3 && sys.auth(src) < 3){
			commanderror(src, "Sorry, you cannot use super silence because mega silence is in effect.", channel);
			return;
		}
		var reason;
		if (command.length > 2){
			var time = parseInt(command[1]), timeunit = command[2].toLowerCase();
			if (!nottimeunit(timeunit) && !isNaN(time)){
				if (command.length > 3){
					command.splice(0,3);
					reason = command.join("*");
				}
				silence.silence(sys.name(src), 2, 0, reason, time, timeunit);
				return;
			}
		}
		if (command.length > 1){
			command.splice(0,1);
			reason = command.join("*");
		}
		silence.silence(sys.name(src), 2, 0, reason);		
	},
	megasilence: function (src, channel, command){
		if (sys.auth(src) < 3){
			commanderror(src, "Sorry, you do not have permission to use the mega silence command (owner command).", channel);
			return;
		}
		if (silence.options.silence.level === 3){
			commanderror(src, "Sorry, you cannot use super silence because mega silence is already in effect.", channel);
			return;
		}
		var reason;
		if (command.length > 2){
			var time = parseInt(command[1]), timeunit = command[2].toLowerCase();
			if (!nottimeunit(timeunit) && !isNaN(time)){
				if (command.length > 3){
					command.splice(0,3);
					reason = command.join("*");
				}
				silence.silence(sys.name(src), 3, 0, reason, time, timeunit);
				return;
			}
		}
		if (command.length > 1){
			command.splice(0,1);
			reason = command.join("*");
		}
		silence.silence(sys.name(src), 3, 0, reason);
	},
	unsilence: function (src, channel, command){
		if (sys.auth(src) < 1){
			commanderror(src, "Sorry, you do not have permission to use the unsilence command (mod command).", channel);
			return;
		}
		if (silence.options.silence.level === undefined){
			commanderror(src, "Sorry, you cannot use unsilence because no silence is in effect.", channel);
			return;				
		}
		if (silence.options.silence.level === 2 && sys.auth(src) < 2){
			commanderror(src, "Sorry, you cannot use unsilence because super silence is in effect.", channel);
			return;
		}
		if (silence.options.silence.level === 3 && sys.auth(src) < 3){
			commanderror(src, "Sorry, you cannot use unsilence because mega silence is in effect.", channel);
			return;
		}
		var reason = command[1], level = silence.options.silence.level;
		silence.options.silence = {};
		sys.writeToFile("script_silenceoptions.json", JSON.stringify(silence.options));
		if (command.length > 1){
			command.splice(0,1);
			reason = command.join("*");
		}
		var reasonline = reason === "undefined" ? "" : "<br/>Reason: " + reason, 
		display = "The server has been unsilenced by " + sys.name(src) + "!" + reasonline;
		if (global.auth !== undefined && silence.options.echo === "off") {
			auth.echo(["mod", "admin", "owner"][level-1], display);
		}
		else {
			silence.echo(display);
		}
	},
	silencesettings: function (src, channel, command) {
		var current_date = new Date();
		if (Number(new Date(silence.options.silence.enddate)) < Number(current_date)){
			silence.options.silence = {};
			sys.writeToFile('script_silenceoptions.json',JSON.stringify(silence.options));
		}
		var duration = converttime(Number(silence.options.silence.duration)*1000), timeleft = converttime(new Date(silence.options.silence.enddate) - current_date);
		if (silence.options.silence.duration === "Indefinite"){
			duration = "Indefinite";
			timeleft = "Unknown";
		}
		var display = "<tr><td><b> Silence Echo: </b>" + silence.options.echo + "</td></tr>"
		+ "<tr><td><b> Auto-Update Settings: </b>" + silence.options.autoupdatesettings + "</td></tr>";
		if (Object.keys(silence.options.silence).length !== 0){
			display += "<tr><td><b> Silence: </b> on <br/>"
			+ "<b>+Type: </b>" + ["regular", "super", "mega"][silence.options.silence.level-1] + " <b>+Silenced by:</b> " + members[silence.options.silence.silencer] + " <b>+Reason:</b> " + silence.options.silence.reason + " <b>+Start Date:</b> <small>"  + silence.options.silence.startdate + "</small><br/>"
			+ "<b>+Duration:</b> " + duration + " <b>+End Date:</b> <small>" + silence.options.silence.enddate + "</small> <b>+Time Left:</b> " + timeleft + "</td></tr>"
		}
		else {
			display += "<tr><td><b>Silence:</b> off  </td></tr>";
		}
		commanddisplay(src, "Silence Settings", display, channel);
	},
	silentmute: function (src, channel, command){
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the silent mute command (owner command).", channel);
			return;
		}
		var trgtname = command[1].toLowerCase();
		if (members[trgtname] === undefined){
			commanderror(src, "Sorry, " + command[1] + " could not be found in the member database.", channel);
			return;
		}
		if (silence.mutes[trgtname] !== undefined){
			commanderror(src, "Sorry, " + members[trgtname] + " is undergoing a current mute.", channel);
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
				silence.mute(sys.name(src), members[trgtname], 2, reason, time, timeunit);
				return;
			}
		}
		if (command.length > 2){
			command.splice(0,2);
			reason = command.join("*");
		}
		silence.mute(sys.name(src), members[trgtname], 2, reason);
	},
	silecho: function (src, channel, command){
		if (sys.auth(src) < 1) {
			commanderror(src, "Sorry, you do not have permission to use the silence echo command (mod command).", channel);
			return;
		}
		var channelid = sys.channelId(command[command.length - 1]);
		sys.sendAll(sys.name(src) + ":", channelid);
		command.splice(0, 1);
		if (channelid !== undefined) {
			command.splice(command.length - 1, 1);
		}
		command = command.join("*");
		silence.echo(command, channelid);
	},
	asilecho: function (src, channel, command){
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the auto silence echo command (owner command).", channel);
			return;
		}
		var arg = command[1].toLowerCase(), srcname = sys.name(src);
		if (arg !== "on" && arg !== "off") {
			commanderror(src, "Sorry, you are required to specify on or off.", channel);
			return;
		}
		if (arg === "on") {
			if (silence.options.echo === "on") {
				commanderror(src, "Sorry, announcing by silence echo is already turned on.", channel);
				return;
			}
			silence.options.echo = "on";
			sys.writeToFile("script_silenceoptions.json", JSON.stringify(silence.options));
			silence.echo("Announcing by silence echo has been turned on by " + srcname + "!", -1);
			return;
		}
		if (silence.options.echo === "off") {
			commanderror(src, "Sorry, announcing by silence echo is already turned off.", channel);
			return;
		}
		silence.options.echo = "off";
		sys.writeToFile("script_silenceoptions.json", JSON.stringify(silence.options));
		if (global.auth !== undefined) {
			auth.echo("owner", "Announcing by silence echo has been turned off by " + srcname + "!", -1);
		}
	},
	ausilencesettings: function (src, channel, command){
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the auto-update silence settings command (owner command).", channel);
			return;
		}
		if (command[1] != "0" && command[1] != "1") {
			commanderror(src, "Sorry, you must specify either 0 or 1 for the auto-update silence settings command.", channel);
			return;
		}
		if (command[1] === silence.options.autoupdatesettings) {
			commanderror(src, "The silence auto-update settings is already set to " + command[1] + ".", channel);
			return;
		}
		silence.options.autoupdatesettings = command[1];
		sys.writeToFile("script_silenceoptions.json", JSON.stringify(silence.options));
		if (global.auth !== undefined && silence.options.echo === "off") {
			auth.echo("owner", "The silence auto-update settings has been changed to " + command[1] + " by " + sys.name(src) + "!", -1);
		}
		else {
			silence.echo("The silence auto-update settings has been changed to " + command[1] + " by " + sys.name(src) + "!", -1)
		}
	},
	usilencesettings: function (src, channel, command){
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the update silence settings command (owner command).", channel);
			return;
		}
		if (silence.options.autoupdatesettings === "0"){
			commanderror(src, "Sorry, you could not update any settings because auto-update settings is set to 0.", channel);
			return;
		}
		silence.updatejsons();
		if (global.auth !== undefined && silence.options.echo === "off") {
			auth.echo("owner", "The silence settings have been updated by " + sys.name(src) + "!", -1);
		}
		else {
			silence.echo("The silence settings have been updated by " + sys.name(src) + "!", -1);
		}
	}
}

/* Mute Checks */
var timed_silence_check = "\u000A"
+ "\t\tvar current_date = new Date();\u000A"
+ "\t\tif(silence.options.silence.level > sys.auth(src) ){\u000A"
+ "\t\t\tif (Number(new Date(silence.options.silence.enddate)) < Number(current_date)){\u000A"
+ "\t\t\t\tsilence.options.silence = {};\u000A"
+ "\t\t\t\tsys.writeToFile('script_silenceoptions.json',JSON.stringify(silence.options));\u000A"
+ "\t\t\t}\u000A"
+ "\t\t\telse {\u000A"
+ "\t\t\t\tsys.stopEvent();\u000A"
+ "\t\t\t\tcommanderror(src, 'Sorry, your auth group is currently silenced.', channel);\u000A"
+ "\t\t\t}\u000A"
+ "\t\t}";
append("beforeChatMessage", timed_silence_check);

/* Mute Checks */
var timed_mute_check = "\u000A"
+ "\t\tvar lowerSrcName = sys.name(src).toLowerCase(), srcip = sys.ip(src), current_date = new Date(), index;\u000A"
+ "\t\tif(silence.mutedips[srcip] || silence.mutes[lowerSrcName] !== undefined){\u000A"
+ "\t\t\tfor (index in silence.mutes){\u000A"
+ "\t\t\t\tif (silence.mutes[index].ip === srcip || index === lowerSrcName){\u000A"	
+ "\t\t\t\t\tif (Number(new Date(silence.mutes[index].enddate)) < Number(current_date)){\u000A"
+ "\t\t\t\t\t\tdelete silence.mutedips[srcip];\u000A"
+ "\t\t\t\t\t\tdelete silence.mutes[index];\u000A"
+ "\t\t\t\t\t\tcontinue;\u000A"
+ "\t\t\t\t\t}\u000A"
+ "\t\t\t\t\tsys.stopEvent();\u000A"
+ "\t\t\t\t\tcommanderror(src, 'Sorry, you are muted.', channel);\u000A"
+ "\t\t\t\t}\u000A"
+ "\t\t\t}\u000A"
+ "\t\t\tsys.writeToFile('script_mutes.json',JSON.stringify(silence.mutes));\u000A"
+ "\t\t}";
append("beforeChatMessage", timed_mute_check);