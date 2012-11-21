/* Loading Silence Object and Settings */
silence = {};
set(construction.source, "mutes", "silence", "mutes");
set(construction.source, "silences", "silence", "silences");
set(construction.source, "silenceoptions", "silence", "options");
silence.auto_mute_players = [];

/* Silence Function */
silence.silence = function (srcname, level, type, reason, duration_time, duration_unit) {
	var sortofsilence = ["silence", "super silence", "mega silence"][level-1];
	var lowerSrcName = srcname.toLowerCase(), startdate = new Date(),
		duration = duration_time === undefined ? "Indefinite" : converttoseconds(duration_unit, duration_time), 
		enddate = duration === "Indefinite" ? "Unknown" : String(new Date(Number(startdate) + duration*1000)),
		reasonline = reason === "undefined" || reason === undefined ? "" : "<br/>Reason: " + reason, 
		durationline = duration === "Indefinite" ? "": " for " + duration_time + " " + timeplurality(duration_time,duration_unit),
		display = "The server has been " + sortofsilence + "d by " + srcname + durationline + "!" + reasonline;
	silence.silences = {};
	silence.silences = {
		"level": level,
		"silencer": lowerSrcName,
		"reason": reason,
		"startdate": String(startdate),
		"duration": duration,
		"enddate": enddate
	}
	sys.writeToFile("script_silences.json", JSON.stringify(silence.silences));
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
		durationline = duration === "Indefinite" ? "": " for " + duration_time + " " + timeplurality(duration_time,duration_unit),
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
	var display = "<timestamp/><table width='100%' style='background-color:qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0.1 steelblue, stop:0.5 navy); color:white;'><tr><td><center><b><big>" + text + "</big></b><small> - Silence Announcement </small></center></td></tr></table>";
	if (channel > -1) {
		sys.sendHtmlAll(display, channel);
	}
	else {
		sys.sendHtmlAll(display);
	}
}

/* Auto-Update Silence Settings */
silence.updatejsons = function () {
	if (silence.options.autoupdatesettings === "1") {
		sys.webCall(construction.source + "script_silenceoptions.json", "downloadjson('" + construction.source + "', 'silenceoptions', 'silence', 'options');");
		updatedjsons.push("silenceoptions");
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
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/ausilencesettings</font><font color='darkred'> value</font></b>: if <b>value</b> is 0 or 1 - auto-updates: no settings or all settings respectively. </td></tr>" 
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/usilencesettings</font></b>: updates the silence settings according to the auto-update silence setting. </td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/amshield</font><font color='darkred'> value</font></b>: if <b>value</b> is 0, 1, 2, 3 or 4 - shields: all players from auto-mute including and above " + auth.options.user.name + ", " + auth.options.mod.name + ", " + auth.options.admin.name + ", " + auth.options.owner.name + " and auth level 4 respectively. </td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/ammax</font><font color='darkred'> value</font></b>: sets the auto-mute maximum message count as <b>value</b>. </td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/amrecover</font><font color='darkred'> decrement</font><font color='darkblue'>*time</font><font color='darkviolet'>*unit</font></b>: sets the auto-mute recover message count as <b>decrement</b> and the recovery period as every <b>time unit</b>. </td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/ampunish</font><font color='darkred'> time</font><font color='darkblue'>*unit</font></b>: sets the auto-mute punishment period as <b>time unit</b>. </td></tr>" 		
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/megasilence</font><font color='darkred'> reason</font></b> or <b><font color='darkgreen'>/megasilence</font><font color='darkred'> time</font><font color='darkblue'>*unit</font><font color='darkviolet'>*reason</font></b>: megasilences the server indefinitely or for <b>time unit</b> for <b>reason</b>. <b>reason</b> is optional.</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/silentmute</font><font color='darkred'> player</font><font color='darkblue'>*reason</font></b> or <b><font color='darkgreen'>/silentmute</font><font color='darkred'> player</font><font color='darkblue'>*time</font><font color='darkviolet'>*unit</font><font color='indigo'>*reason</font></b>: silent mutes <b>player</b> indefinitely or for <b>time unit</b> for <b>reason</b>. <b>reason</b> is optional.</td></tr>";
		var display2 = "<tr><td>" + asymbol + "<b><font color='darkgreen'>/supersilence</font><font color='darkred'> reason</font></b> or <b><font color='darkgreen'>/supersilence</font><font color='darkred'> time</font><font color='darkblue'>*unit</font><font color='darkviolet'>*reason</font></b>: supersilences the server indefinitely or for <b>time unit</b> for <b>reason</b>. <b>reason</b> is optional.</td></tr>"
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/silence</font><font color='darkred'> reason</font></b> or <b><font color='darkgreen'>/silence</font><font color='darkred'> time</font><font color='darkblue'>*unit</font><font color='darkviolet'>*reason</font></b>: silences the server indefinitely or for <b>time unit</b> for <b>reason</b>. <b>reason</b> is optional.</td></tr>"
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/unsilence</font><font color='darkred'> reason</font></b>: unsilences the server for <b>reason</b>. <b>reason</b> is optional.</td></tr>"
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/mute</font><font color='darkred'> player</font><font color='darkblue'>*reason</font></b> or <b><font color='darkgreen'>/mute</font><font color='darkred'> player</font><font color='darkblue'>*time</font><font color='darkviolet'>*unit</font><font color='indigo'>*reason</font></b>: mutes <b>player</b> indefinitely or for <b>time unit</b> for <b>reason</b>. <b>reason</b> is optional.</td></tr>"
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/unmute</font><font color='darkred'> player</font><font color='darkblue'>*reason</font></b>: unmutes <b>player</b> for <b>reason</b>. <b>reason</b> is optional.</td></tr>"
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/mutes</font></b>: displays a table of server mutes.</td></tr>"
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/clearmutes</font></b>: clears all server mutes.</td></tr>"
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/silecho</font><font color='darkred'> message</font><font color='darkblue'>*channel</font></b>: displays <b>message</b> with the silence echo announcement - in <b>channel</b> if a name of a channel is specified. </td></tr>"
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/silencesettings</font></b>: displays the silence settings. </td></tr>";
		commanddisplay(src, "Silence Commands (Part 1)", display, channel);
		commanddisplay(src, "Silence Commands (Part 2)", display2, channel);
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
		var srcname = sys.name(src), trgtname = command[1].toLowerCase(), 
		displayed_name = members[trgtname] === undefined ? command[1] : members[trgtname];
		if (silence.mutes[trgtname] !== undefined){
			if (Number(new Date(silence.mutes[trgtname].enddate)) < Number(new Date())) {
				delete silence.mutes[trgtname];
				sys.writeToFile('script_mutes.json', JSON.stringify(silence.mutes));
			}
		}
		if (silence.mutes[trgtname] === undefined){
			commanderror(src, "Sorry, " + displayed_name + " is not currently muted.", channel);
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
		display = displayed_name + " has been unmuted by " + srcname + "!" + reasonline;
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
			var muter = members[mutes[index].muter] === undefined ? mutes[index].muter : members[mutes[index].muter];
			display += "<tr><td>" + members[index] + "</td><td>" + mutes[index].ip + "</td><td>" + muter + "</td><td>" + mutes[index].reason + "</td><td><small>" + mutes[index].startdate + "</small></td><td>" + duration + "</td><td><small>" + mutes[index].enddate + "</small></td><td>" + timeleft +  "</td></tr>";
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
		if (Number(new Date(silence.silences.enddate)) < Number(new Date())){ 
			silence.silences = {}; 
			sys.writeToFile('script_silences.json', JSON.stringify(silence.silences)); 
		} 
		if (silence.silences.level === 2 && sys.auth(src) < 2){
			commanderror(src, "Sorry, you cannot use silence because super silence is in effect.", channel);
			return;
		}
		if (silence.silences.level === 3 && sys.auth(src) < 3){
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
		if (Number(new Date(silence.silences.enddate)) < Number(new Date())){ 
			silence.silences = {}; 
			sys.writeToFile('script_silences.json', JSON.stringify(silence.silences)); 
		} 
		if (silence.silences.level === 3 && sys.auth(src) < 3){
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
		if (Number(new Date(silence.silences.enddate)) < Number(new Date())){ 
			silence.silences = {}; 
			sys.writeToFile('script_silences.json', JSON.stringify(silence.silences)); 
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
		if (Number(new Date(silence.silences.enddate)) < Number(new Date())){ 
			silence.silences = {}; 
			sys.writeToFile('script_silences.json', JSON.stringify(silence.silences)); 
		} 
		if (silence.silences.level === undefined){
			commanderror(src, "Sorry, you cannot use unsilence because no silence is in effect.", channel);
			return;				
		}
		if (silence.silences.level === 2 && sys.auth(src) < 2){
			commanderror(src, "Sorry, you cannot use unsilence because super silence is in effect.", channel);
			return;
		}
		if (silence.silences.level === 3 && sys.auth(src) < 3){
			commanderror(src, "Sorry, you cannot use unsilence because mega silence is in effect.", channel);
			return;
		}
		var reason = command[1], level = silence.silences.level;
		silence.silences = {};
		sys.writeToFile("script_silences.json", JSON.stringify(silence.silences));
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
		if (Number(new Date(silence.silences.enddate)) < Number(current_date)){
			silence.silences = {};
			sys.writeToFile('script_silences.json',JSON.stringify(silence.silences));
		}
		var duration = converttime(Number(silence.silences.duration)*1000), timeleft = converttime(new Date(silence.silences.enddate) - current_date);
		if (silence.silences.duration === "Indefinite"){
			duration = "Indefinite";
			timeleft = "Unknown";
		}
		var display = "<tr><td><b> Silence Echo: </b>" + silence.options.echo + "</td></tr>"
		+ "<tr><td><b> Auto-Update Settings: </b>" + silence.options.autoupdatesettings + "</td></tr>"
		+ "<tr><td><b> Auto-Mute Shield: </b>" + silence.options.auto_mute_shield + "</td></tr>"
		+ "<tr><td><b> Auto-Mute Maximum Count: </b>" + silence.options.auto_mute_maximum + "</td></tr>"
		+ "<tr><td><b> Auto-Mute Recovery Count: </b>" + silence.options.auto_mute_decrement + "</td></tr>"
		+ "<tr><td><b> Auto-Mute Recovery Time: </b>" + converttime(Number(silence.options.auto_mute_seconds)*1000) + "</td></tr>"
		+ "<tr><td><b> Auto-Mute Punishment Time: </b>" + converttime(Number(silence.options.auto_mute_punish)*1000) + "</td></tr>";
		if (Object.keys(silence.silences).length !== 0){
			display += "<tr><td><b> Silence: </b> on <br/>"
			+ "<b>+Type: </b>" + ["regular", "super", "mega"][silence.silences.level-1] + " <b>+Silenced by:</b> " + members[silence.silences.silencer] + " <b>+Reason:</b> " + silence.silences.reason + " <b>+Start Date:</b> <small>"  + silence.silences.startdate + "</small><br/>"
			+ "<b>+Duration:</b> " + duration + " <b>+End Date:</b> <small>" + silence.silences.enddate + "</small> <b>+Time Left:</b> " + timeleft + "</td></tr>"
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
		if (channelid !== undefined && command.length > 1) {
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
	},
	amshield: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the auto-mute shield command (owner command).", channel);
			return;
		}
		if (command[1] !== "0" && command[1] !== "1" && command[1] !== "2" && command[1] !== "3" && command[1] !== "4"){
			commanderror(src, "Sorry, you must specify either 0, 1, 2, 3 or 4 for the auto mute shield.", channel);
			return;
		}
		silence.options.auto_mute_shield = command[1];
		sys.writeToFile("script_silenceoptions.json", JSON.stringify(silence.options));
		if (global.auth !== undefined && silence.options.echo === "off") {
			auth.echo("owner", "The auto-mute shield has been changed to " + command[1] + " and above by " + sys.name(src) + "!", -1);
		}
		else {
			silence.echo("The auto-mute shield has been changed to " + command[1] + " and above by " + sys.name(src) + "!", -1);
		}
	},
	ammax: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the auto-mute maximum command (owner command).", channel);
			return;
		}
		var max = parseInt(command[1]);
		if (isNaN(max)){
			commanderror(src, "Sorry, you must specify a number to be the auto-mute maximum message count.", channel);
			return;
		}
		silence.options.auto_mute_maximum = String(max);
		sys.writeToFile("script_silenceoptions.json", JSON.stringify(silence.options));
		if (global.auth !== undefined && silence.options.echo === "off") {
			auth.echo("owner", "The auto-mute maximum message count has been changed to " + String(max) + " by " + sys.name(src) + "!", -1);
		}
		else {
			silence.echo("The auto-mute maximum message count has been changed to " + String(max) + " by " + sys.name(src) + "!", -1);
		}	
	},
	amrecover: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the auto-mute recover command (owner command).", channel);
			return;
		}
		var decrement = parseInt(command[1]), time = parseInt(command[2]), unit = command[3];
		if (isNaN(decrement) || isNaN(time) || nottimeunit(unit)){
			commanderror(src, "The auto-mute recover command is used with the following arguments: decrement*time*unit, e.g. \"/amrecover 8*10*seconds\"", channel);
			return;
		}
		silence.options.auto_mute_decrement = decrement;
		silence.options.auto_mute_seconds = converttoseconds(unit, time);
		sys.writeToFile("script_silenceoptions.json", JSON.stringify(silence.options));
		var display = "The auto-mute recover has been set to " + decrement + " per " + converttime(silence.options.auto_mute_seconds*1000) + " by " + sys.name(src) + ".";
		if (global.auth !== undefined && silence.options.echo === "off") {
			auth.echo("owner", display, -1);
		}
		else {
			silence.echo(display, -1);
		}
	},
	ampunish: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the auto-mute punishment command (owner command).", channel);
			return;
		}
		var time = parseInt(command[1]), unit = command[2];
		if (isNaN(time) || nottimeunit(unit)){
			commanderror(src, "The auto-mute punishment command is used with the following arguments: time*unit, e.g. \"/ampunish 5*minutes\"", channel);
			return;
		}
		silence.options.auto_mute_punish = converttoseconds(unit, time);
		sys.writeToFile("script_silenceoptions.json", JSON.stringify(silence.options));
		var display = "The auto-mute punishment has been set to " + converttime(silence.options.auto_mute_punish*1000) + " by " + sys.name(src) + ".";
		if (global.auth !== undefined && silence.options.echo === "off") {
			auth.echo("owner", display, -1);
		}
		else {
			silence.echo(display, -1);
		}	
	}
}

/* Add Silence/Mute Checks to Commands Function */
silence.silencecommands = function (check){
	var silencedcmds = {};
	silencedcmds = {
		auth: ["echo"], tiers: ["techo"], scripts: ["secho"], disconnect: ["decho"], silence: ["silecho"], message: ["ghtml", "me", "attack", "imp", "reverse"], create: ["crecho"]
	}
	var i,j;
	for (i in silencedcmds){
		for (j in silencedcmds[i]){
			prependcommand(i, silencedcmds[i][j], check.replace("sys.stopEvent()", "return"));
		}
	}
};

/* Silence Checks */
var timed_silence_check = "\u000A"
+ "\t\tvar current_date = new Date();\u000A"
+ "\t\tif(silence.silences.level > sys.auth(src) ){\u000A"
+ "\t\t\tif (Number(new Date(silence.silences.enddate)) < Number(current_date)){\u000A"
+ "\t\t\t\tsilence.silences = {};\u000A"
+ "\t\t\t\tsys.writeToFile('script_silences.json',JSON.stringify(silence.silences));\u000A"
+ "\t\t\t}\u000A"
+ "\t\t\telse {\u000A"
+ "\t\t\t\tcommanderror(src, 'Sorry, your auth group is currently silenced.', channel);\u000A"
+ "\t\t\t\tsys.stopEvent();\u000A"
+ "\t\t\t}\u000A"
+ "\t\t}";
append("beforeChatMessage", timed_silence_check);
silence.silencecommands(timed_silence_check);

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
+ "\t\t\t\t\tcommanderror(src, 'Sorry, you are muted.', channel);\u000A"
+ "\t\t\t\t\tsys.stopEvent();\u000A"
+ "\t\t\t\t}\u000A"
+ "\t\t\t}\u000A"
+ "\t\t\tsys.writeToFile('script_mutes.json',JSON.stringify(silence.mutes));\u000A"
+ "\t\t}";
append("beforeChatMessage", timed_mute_check);
silence.silencecommands(timed_mute_check);

/* Auto Mute Step */
var auto_mute_step = "\u000A"
+ "\t\tif (silence.options.auto_mute_shield !== '0'){\u000A"
+ "\t\t\tvar i;\u000A"
+ "\t\t\tfor (i in silence.auto_mute_players){\u000A"
+ "\t\t\t\tplayersonline[silence.auto_mute_players[i]].auto_mute_timer++;\u000A"
+ "\t\t\t\tif (playersonline[silence.auto_mute_players[i]].auto_mute_timer == silence.options.auto_mute_seconds){\u000A"
+ "\t\t\t\t\tplayersonline[silence.auto_mute_players[i]].auto_mute_count -= Number(silence.options.auto_mute_decrement);\u000A"
+ "\t\t\t\t\tplayersonline[silence.auto_mute_players[i]].auto_mute_timer = 0;\u000A"
+ "\t\t\t\t\tif (playersonline[silence.auto_mute_players[i]].auto_mute_count <= 0){\u000A"
+ "\t\t\t\t\t\tplayersonline[silence.auto_mute_players[i]].auto_mute_count = 0;\u000A"
+ "\t\t\t\t\t\tsilence.auto_mute_players.splice(i, 1);\u000A"
+ "\t\t\t\t\t}\u000A"
+ "\t\t\t\t}\u000A"
+ "\t\t\t}\u000A"
+ "\t\t}";
append("step", auto_mute_step);

/* Auto Mute LogIn */
var auto_mute_login = "\u000A"
+ "\t\tplayersonline[src].auto_mute_count = 0;\u000A"
+ "\t\tplayersonline[src].auto_mute_timer = 0;";
append("afterLogIn", auto_mute_login);

/* Auto Mute Chat Message */
var auto_mute_chatmessage = "\u000A"
+ "\t\tvar srcname = sys.name(src), lowerSrcName = sys.name(src).toLowerCase(), startdate = new Date();\u000A"
+ "\t\tif (playersonline[src] !== undefined){\u000A"
+ "\t\t\tif (silence.auto_mute_players.indexOf(src) === -1){\u000A"
+ "\t\t\t\tsilence.auto_mute_players.push(src);\u000A"
+ "\t\t\t}\u000A"
+ "\t\t\tplayersonline[src].auto_mute_count++;\u000A"
+ "\t\t\tif (playersonline[src].auto_mute_count > silence.options.auto_mute_maximum && sys.auth(src) < Number(silence.options.auto_mute_shield)){\u000A"
+ "\t\t\t\tif (silence.mutes[lowerSrcName] === undefined){\u000A"
+ "\t\t\t\t\tif (global.auth !== undefined && silence.options.echo === 'off') {\u000A"
+ "\t\t\t\t\t\tauth.echo('server', srcname + ' has been muted by the server for ' + converttime(Number(silence.options.auto_mute_punish)*1000) + '.<br/>Reason: Flooding');\u000A"
+ "\t\t\t\t\t}\u000A"
+ "\t\t\t\t\telse {\u000A"
+ "\t\t\t\t\t\tsilence.echo(srcname + ' has been muted by the server for ' + converttime(Number(silence.options.auto_mute_punish)*1000) + '.<br/>Reason: Flooding');\u000A"
+ "\t\t\t\t\t}\u000A"
+ "\t\t\t\t\tsilence.mutes[lowerSrcName] = {};\u000A"
+ "\t\t\t\t\tsilence.mutes[lowerSrcName] = {\u000A"
+ "\t\t\t\t\t\tip : sys.dbIp(srcname),\u000A"
+ "\t\t\t\t\t\tmuter : '~~Server~~',\u000A"
+ "\t\t\t\t\t\treason : 'Flooding',\u000A"
+ "\t\t\t\t\t\tstartdate : String(startdate),\u000A"
+ "\t\t\t\t\t\tduration : Number(silence.options.auto_mute_punish),\u000A"
+ "\t\t\t\t\t\tenddate: String(new Date(Number(startdate) + Number(silence.options.auto_mute_punish)*1000))\u000A"
+ "\t\t\t\t\t}\u000A"
+ "\t\t\t\t\tsilence.mutedips[sys.dbIp(srcname)] = true;\u000A"
+ "\t\t\t\t\tsys.writeToFile('script_mutes.json', JSON.stringify(silence.mutes));\u000A"
+ "\t\t\t\t}\u000A"
+ "\t\t\t\tsys.stopEvent();\u000A"
+ "\t\t\t}\u000A"
+ "\t\t}\u000A";
prepend("beforeChatMessage", auto_mute_chatmessage);