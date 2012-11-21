/* Loading Ladders Object */
ladders = {};
set(construction.source, "laddersoptions", "ladders", "options");

/* Ladder Announcement Function */
ladders.echo = function (text, channel) {
	var display = "<timestamp/><table width='100%' style='background-color:qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0.1 green, stop:0.5 darkgreen); color:white;'><tr><td><center><b><big>" + text + "</big></b><small> - Ladders Announcement </small></center></td></tr></table>";
	if (channel > -1) {
		sys.sendHtmlAll(display, channel);
	}
	else {
		sys.sendHtmlAll(display);
	}
}

/* Auto-Update Ladders Settings */
ladders.updatejsons = function () {
	if (ladders.options.autoupdatesettings === "1") {
		sys.webCall(construction.source + "script_laddersoptions.json", "downloadjson('" + construction.source + "', 'laddersoptions', 'ladders', 'options');");
		updatedjsons.push("laddersoptions");
	}
}
if (ladders.options !== undefined){
	ladders.updatejsons();
}

/* Ladders Commands */
ladders.commands = {
	ladderscommands: function (src, channel, command) {
		var osymbol = "", asymbol = "", msymbol = "", usymbol = "", srcname = sys.name(src);
		if (global.auth !== undefined){
			osymbol = auth.options["owner"].image;
			asymbol = auth.options["admin"].image;
			msymbol = auth.options["mod"].image;
			usymbol = auth.options["user"].image;
		}
		var display = typecommands
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/aladecho</font><font color='darkred'> status</font></b>: turns announcing by ladders echo <b>status</b>. <b>status</b> is either on or off.</td></tr>" 
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/auladdersettings</font><font color='darkred'> value</font></b>: if <b>value</b> is 0 or 1 - auto-updates: no settings or all settings respectively. </td></tr>" 
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/uladdersettings</font></b>: updates the ladders settings according to the auto-update silence setting. </td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/resetladder</font><font color='darkred'> tier</font></b>: resets the ladder for <b>tier</b>. <b>tier</b> is any of the server's tiers.</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/clearladders</font></b>: resets all of the server's ladders.</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/exportladders</font></b>: exports the tier ratings database.</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/changerating</font><font color='darkred'> player</font><font color='darkblue'>*tier</font><font color='darkviolet'>*rating</font></b>: changes the rating of <b>player</b> in <b>tier</b> to <b>rating</b>.</td></tr>"
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/ladecho</font><font color='darkred'> message</font><font color='darkblue'>*channel</font></b>: displays <b>message</b> with the ladders echo announcement - in <b>channel</b> if a name of a channel is specified. </td></tr>"
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/rankings</font><font color='darkred'> player</font></b>: displays the rankings of <b>player</b>. If <b>player</b> is undefined, displays your rankings. </td></tr>"
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/laddersettings</font></b>: displays the ladders settings. </td></tr>";
		commanddisplay(src, "Ladders Commands", display, channel);
	},
	rankings: function (src, channel, command) {
		var trgtname;
		if (command[1] === "undefined"){
			trgtname = sys.name(src);
		}
		else {
			if (members[command[1].toLowerCase()] === undefined){
				commanderror(src, "Sorry, " + command[1] + " does not exist in the member database.", channel);
				return;				
			}
			trgtname = members[command[1].toLowerCase()];
		}
		var display = "<table border='1' cellpadding='5'><tr><th>Tier</th><th>Ranking</th><th>Out Of</th><th>Rating</th><th>No. of Battles</th></tr>"; 
		var tiers = sys.getTierList(), count = 0;
		for (var index in tiers){
			var ranking = sys.ranking(trgtname, tiers[index]);
			if (isNaN(ranking)){
				continue;
			}
			count++;
			var rating = sys.id(trgtname) != undefined ? sys.ladderRating(sys.id(trgtname), tiers[index]) : "Offline";
			display += "<tr><td>" + tiers[index] + "</td><td>" + ranking + "</td><td>" + sys.totalPlayersByTier(tiers[index]) + "</td><td>" + rating + "</td><td>" + sys.ratedBattles(trgtname, tiers[index]) + "</td></tr>"
		}
		display += "</table>";
		if (count === 0){
			commanderror(src, "Sorry, " + trgtname + " is currently unranked in all tiers.", channel);
			return;	
		}
		commanddisplay(src, "Rankings of " + trgtname, display, channel);
	},
	resetladder: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the reset ladder command (owner command).", channel);
			return;
		}
		var tiers = sys.getTierList(), index, srcname = sys.name(src);
		for (index in tiers){
			if (command[1].toLowerCase() == tiers[index].toLowerCase()){
				sys.resetLadder(tiers[index]);
				if (global.auth !== undefined && ladders.options.echo === "off") {
					auth.echo("owner", "The " + tiers[index] + " ladder has been reset by " + srcname + ".");
				}
				else {
					ladders.echo("The " + tiers[index] + " ladder has been reset by " + srcname + ".");
				}
				return;
			}
		}
		commanderror(src, "Sorry, you are unable to reset the ladder of " + command[1] + " because the tier does not exist.", channel);
	},
	clearladders: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the clear ladders command (owner command).", channel);
			return;
		}
		var tiers = sys.getTierList(), index, srcname = sys.name(src);
		for (index in tiers){
			sys.resetLadder(tiers[index]);	
		}
		if (global.auth !== undefined && ladders.options.echo === "off") {
			auth.echo("owner", "All ladders have been reset by " + srcname + ".");
		}
		else {
			ladders.echo("All ladders have been reset by " + srcname + ".");
		}
	}, 
	exportladders: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the export ladders command (owner command).", channel);
			return;
		}
		sys.exportTierDatabase();
		commanddisplay(src, "Ladder Data Exported!", "", channel);	
	},
	changerating: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the export ladders command (owner command).", channel);
			return;
		}
		if (members[command[1].toLowerCase()] === undefined){
			commanderror(src, "Sorry, " + command[1] + " does not exist in the member database.", channel);
			return;				
		}
		if (command[2] === undefined){
			commanderror(src, "Sorry, you must specify a tier to change the rating in.", channel);
			return;		
		}
		var tiers = sys.getTierList(), index;
		for (index in tiers){
			if (command[2].toLowerCase() == tiers[index].toLowerCase()){
				var trgttier = tiers[index];
			}
		}
		if (trgttier === undefined){
			commanderror(src, "Sorry, you are unable to change the rating of " + command[1] + " because " + command[2] + " is not a valid name for a tier.", channel);
			return;
		}
		var trgtrating = command[3];
		if (isNaN(trgtrating)){
			commanderror(src, "Sorry, you are unable to change the rating of " + command[1] + " because " + trgtrating + " is not a valid value for a rating.", channel);
			return;
		}
		var srcname = sys.name(src), trgtname = members[command[1].toLowerCase()];
		sys.changeRating(trgtname, trgttier, trgtrating);
		sys.updateRatings();
		if (global.auth !== undefined && ladders.options.echo === "off") {
			auth.echo("owner", "The Ladder Rating of " + trgtname +  " has been changed to " + trgtrating + " for the " + trgttier + " tier by " + srcname + ".");
		}
		else {
			ladders.echo("The Ladder Rating of " + trgtname +  " has been changed to " + trgtrating + " for the " + trgttier + " tier by " + srcname + ".");
		}
	},
	laddersettings: function (src, channel, command) {
		var display = "<tr><td><b> Ladders Echo: </b>" + ladders.options.echo + "</td></tr>"
		+ "<tr><td><b> Auto-Update Settings: </b>" + ladders.options.autoupdatesettings + "</td></tr>";
		commanddisplay(src, "Ladders Settings", display, channel);
	},
	ladecho: function (src, channel, command){
		if (sys.auth(src) < 1) {
			commanderror(src, "Sorry, you do not have permission to use the ladders echo command (mod command).", channel);
			return;
		}
		var channelid = sys.channelId(command[command.length - 1]);
		sys.sendAll(sys.name(src) + ":", channelid);
		command.splice(0, 1);
		if (channelid !== undefined && command.length > 1) {
			command.splice(command.length - 1, 1);
		}
		command = command.join("*");
		ladders.echo(command, channelid);
	},
	aladecho: function (src, channel, command){
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the auto ladders echo command (owner command).", channel);
			return;
		}
		var arg = command[1].toLowerCase(), srcname = sys.name(src);
		if (arg !== "on" && arg !== "off") {
			commanderror(src, "Sorry, you are required to specify on or off.", channel);
			return;
		}
		if (arg === "on") {
			if (ladders.options.echo === "on") {
				commanderror(src, "Sorry, announcing by ladders echo is already turned on.", channel);
				return;
			}
			ladders.options.echo = "on";
			sys.writeToFile("script_laddersoptions.json", JSON.stringify(ladders.options));
			ladders.echo("Announcing by ladders echo has been turned on by " + srcname + "!", -1);
			return;
		}
		if (ladders.options.echo === "off") {
			commanderror(src, "Sorry, announcing by ladders echo is already turned off.", channel);
			return;
		}
		ladders.options.echo = "off";
		sys.writeToFile("script_laddersoptions.json", JSON.stringify(ladders.options));
		if (global.auth !== undefined) {
			auth.echo("owner", "Announcing by ladders echo has been turned off by " + srcname + "!", -1);
		}
	},
	auladdersettings: function (src, channel, command){
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the auto-update ladders settings command (owner command).", channel);
			return;
		}
		if (command[1] != "0" && command[1] != "1") {
			commanderror(src, "Sorry, you must specify either 0 or 1 for the auto-update ladders settings command.", channel);
			return;
		}
		if (command[1] === ladders.options.autoupdatesettings) {
			commanderror(src, "The ladders auto-update settings is already set to " + command[1] + ".", channel);
			return;
		}
		ladders.options.autoupdatesettings = command[1];
		sys.writeToFile("script_laddersoptions.json", JSON.stringify(ladders.options));
		if (global.auth !== undefined && ladders.options.echo === "off") {
			auth.echo("owner", "The ladders auto-update settings has been changed to " + command[1] + " by " + sys.name(src) + "!", -1);
		}
		else {
			ladders.echo("The ladders auto-update settings has been changed to " + command[1] + " by " + sys.name(src) + "!", -1)
		}
	},
	uladdersettings: function (src, channel, command){
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the update ladders settings command (owner command).", channel);
			return;
		}
		if (ladders.options.autoupdatesettings === "0"){
			commanderror(src, "Sorry, you could not update any settings because auto-update settings is set to 0.", channel);
			return;
		}
		ladders.updatejsons();
		if (global.auth !== undefined && ladders.options.echo === "off") {
			auth.echo("owner", "The ladders settings have been updated by " + sys.name(src) + "!", -1);
		}
		else {
			ladders.echo("The ladders settings have been updated by " + sys.name(src) + "!", -1);
		}
	}
}