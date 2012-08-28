(function () {

	/* Naming the Global Object */
	global = this;
	
	/* Arrays of files installed/loaded */
	installedscripts = [];
	loadedscripts = [];
	installedjsons = [];
	loadedjsons = [];

	/* Function to Download JavaScript Files */
	downloadjs = function (source, filename) {
		if (resp !== ""){
			sys.writeToFile("script_" + filename + ".js", resp);
		}
		if (sys.getFileContent("script_" + filename + ".js") === undefined) {
			print(filename + " could not be installed.");
		}
		else {
			installedscripts.push(filename);
			try {
				eval(sys.getFileContent("script_" + filename + ".js"));
			}
			catch(error){
				print("Fatal " + filename + " Script Error line " + error.lineNumber + ": " + error.message);
			}
		}
	}	
	
	/* Function to Load External JavaScript Files */
	install = function (source, filename) {
		if (sys.getFileContent("script_" + filename + ".js") === undefined || construction.auto_update === "on") {
			sys.webCall(source + "script_" + filename + ".js", "downloadjs('" + source + "', '" + filename + "');");
		}
		else {
			loadedscripts.push(filename);
			try {
				eval(sys.getFileContent("script_" + filename + ".js"));
			}
			catch(error){
				print("Fatal " + filename + " Script Error line " + error.lineNumber + ": " + error.message);
			}
		}
	}
	
	/* Function to Download JSON Files */
	downloadjson = function (source, filename, object, key) {
		if (resp !== ""){
			sys.writeToFile("script_" + filename + ".json", resp);
		}
		if (sys.getFileContent("script_" + filename + ".json") === undefined) {
			print(filename + " default settings could not be installed.");
		}
		else {
			installedjsons.push(filename);
			try {
				global[object][key] = JSON.parse(sys.getFileContent("script_" + filename + ".json"));
			}
			catch (error){
				print("Error loading " + filename + " settings.");
			}
		}
	}
		
	/* Function to Load External JSON Files */
	set = function (source, filename, object, key) {
		if (sys.getFileContent("script_" + filename + ".json") === undefined) {
			sys.webCall(source + "script_" + filename + ".json", "downloadjson('" + source + "', '" + filename + "', '" + object + "', '" + key + "');");
		}
		else {
			loadedjsons.push(filename);
			try {
				global[object][key] = JSON.parse(sys.getFileContent("script_" + filename + ".json"));
			}
			catch (error) {
				sys.writeToFile("script_" + filename + " (corrupted).json", sys.getFileContent("script_" + filename + ".json"));
				print(filename + " file corrupted - downloading latest " + filename + " file...");
				sys.webCall(source + "script_" + filename + ".json", "downloadjson('" + source + "', '" + filename + "', '" + object + "', '" + key + "');");
				return;
			}
		}
	}

	/* Function for Command Execution in an Object*/
	commandtry = function (object, src, channel, command) {
		validcommand = true;
		if (global[object] === undefined) {
			validcommand = false;
			return;
		}
		if (global[object].commands === undefined) {
			validcommand = false;
			return;
		}
		if (global[object].commands[command[0].toLowerCase()] != undefined) {
			command[0] += "*" + command[1];
			command.splice(1, 1);
		}
		command = command.join(' ').split('*');
		if (global[object].commands[command[0].toLowerCase()] === undefined) {
			validcommand = false;
			return;
		}
		global[object].commands[command[0].toLowerCase()](src, channel, command);
		commandused = true;
	}

	/* Command Error Message Function */
	commanderror = function (id, text, channel) {
		var display = "<timestamp/><table width='100%' style='background-color:qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0.1 black, stop:0.5 grey); color:white;'><tr><th>Personal Message</th></tr><tr><td><center><b><big>" + text + "</big></b></center></td></tr></table>";
		if (channel > -1) {
			sys.sendHtmlMessage(id, display, channel);
		}
		else {
			sys.sendHtmlMessage(id, display);
		}
	}

	/* Command Display Message Function */
	commanddisplay = function (id, header, body, channel) {
		var display = "<timestamp/><table width='100%'; style='background-color:qlineargradient(x1:0, y1:0, x2:0, y2:0.25, stop:0.1 mediumorchid stop:0.5 papayawhip);' color:'black;'>" + "<tr><td><center><h2><u><font color='black'>" + header + "</font></u></h2></center></td></tr>" + body + "</table>";
		if (channel > -1) {
			sys.sendHtmlMessage(id, display, channel);
		}
		else {
			sys.sendHtmlMessage(id, display);
		}
	}
	
	/* Case Sensitive Member Names Load Function */
	memberscase = function () {
		var memberdb = sys.dbAll(), index, player_id;
		members = {};
		for (index in memberdb){
			members[memberdb[index]] = memberdb[index];
			player_id = sys.id(memberdb[index]);
			if (player_id !== undefined) {
				members[memberdb[index]] = sys.name(player_id);
			}
		}
		print ("Case sensitive names loaded.");
	}
	memberscase();
	
	/* Add Case Sensitive Name Function */	
	membersadd = function (srcname) {
		if (members[srcname] === undefined) {
			members[srcname.toLowerCase()] = srcname;
		}
	}
	
	/* Connect Status Function */	
	connectstatus = function (name){
		var id = sys.id(name), index,
			connectstatus = id === undefined ? " <font color='red'><b><small>Offline</small></b></font> " : " <font color='green'><b><small>Online</small></b></font> ",
			color = id == undefined ? "none" : namecolor(id);
		if (sys.battling(id)){
			index = sys.dbAuth(name) + 8;
		}
		else if (sys.away(id) === false){
			index = sys.dbAuth(name);
		}
		else {
			index = sys.dbAuth(name) + 4;
		}
		id = id != undefined ? id : "N/A";
		return authimage(index) + " <b><font color='" + color + "'>" + name + "</b>" + connectstatus + "<b><small>Session ID: " + id + "</small></b> ";
	}

	/* Server Icon Function */
	authimage = function(authlevel){
		return ({
			11: "<img src='Themes/Classic/client/oBattle.png'>",
			10: "<img src='Themes/Classic/client/aBattle.png'>",
			9: "<img src='Themes/Classic/client/mBattle.png'>",
			8: "<img src='Themes/Classic/client/uBattle.png'>",	
			7: "<img src='Themes/Classic/client/oAway.png'>",
			6: "<img src='Themes/Classic/client/aAway.png'>",
			5: "<img src='Themes/Classic/client/mAway.png'>",
			4: "<img src='Themes/Classic/client/uAway.png'>",
			3: "<img src='Themes/Classic/client/oAvailable.png'>",
			2: "<img src='Themes/Classic/client/aAvailable.png'>",
			1: "<img src='Themes/Classic/client/mAvailable.png'>",
			0: "<img src='Themes/Classic/client/uAvailable.png'>"			
		}[authlevel] || "<img src='Themes/Classic/client/uAway.png'>");	
	}
	
	/* Name Color Function */
	namecolor = function (src) {
		if (sys.getColor(src) == '#000000') {
 			var clist = ['#5811b1','#399bcd','#0474bb','#f8760d','#a00c9e','#0d762b','#5f4c00','#9a4f6d','#d0990f','#1b1390','#028678','#0324b1'];
			return clist[src % clist.length]; 
		}
		return sys.getColor(src);
	}

	/* Escape Html Function */
	escapehtml = function (str) {
		return str.replace(/&/g, '&amp;').replace(/\>/g, '&gt;').replace(/\</g, '&lt;');
	}

	/* Remove Spaces Function */
	removespaces = function (str) {
		return str.split(' ').join('');
	}
	
	/* Convert Milliseconds to a Time String Function */	
	converttime = function (time){
		if (time > 86400000){
			return Math.floor(time/86400000) + " Days, " + Math.floor((time%86400000)/3600000) + " Hours, " + Math.floor(((time%86400000)%3600000)/60000) + " Minutes, " + Math.floor((((time%86400000)%3600000)%60000)/1000) + " Seconds";
		}
		if (time > 3600000){
			return Math.floor((time%86400000)/3600000) + " Hours, " + Math.floor(((time%86400000)%3600000)/60000) + " Minutes, " + Math.floor((((time%86400000)%3600000)%60000)/1000) + " Seconds";
		}
		if (time > 60000){
			return Math.floor(((time%86400000)%3600000)/60000) + " Minutes, " + Math.floor((((time%86400000)%3600000)%60000)/1000) + " Seconds";
		}
		return Math.floor((((time%86400000)%3600000)%60000)/1000) + " Seconds" ;
	}

	/* Convert to Seconds Function */
	converttoseconds = function (unit, time) {
		return({"minutes": time*60 , "minute": time*60, "hours": time*3600, "hour": time*3600, "days": time*86400,"day": time*86400, "weeks": time*604800, "week": time*604800, "months": time*2592000 , "month": time*2592000, "year": time*31536000 , "years": time*31536000}[unit] || time);
	}

	/* Plurality of Time Unit Function */
	timeplurality = function (time, unit) {
		if (time == 1 && unit[unit.length-1] == "s") {
			unit = unit.replace(/s$/, "");
		}
		else if (time != 1 && unit[unit.length-1] != "s") {
			unit = unit + "s";
		}
		return unit;
	}

	/* Not a Time Unit Function */
	nottimeunit = function (unit) {
		return unit != "seconds" && unit != "second" && unit != "minutes" && unit != "minute" && unit != "hours" && unit != "hour" && unit != "days" && unit != "day" && unit != "weeks" && unit != "week" && unit != "months" && unit != "month" && unit != "years" && unit != "year";
	}
	
	/* Event Body Function */
		eventbody = function (event) {
		var body = String(script[event]);
		body = body.split("{");
		body.splice(0, 1);
		body = body.join("{");
		body = body.split("}");
		body.splice(body.length-1, 1);
		body = body.join("}");
		return body;
	}
	
	/* Event Arguments Function */
	eventargs = function (event) {
		var args = String(script[event]);
		args = args.split("(");
		args.splice(0,1);
		args = args.join("(");
		args = args.split(")");
		args = args[0];
		return args;
	}
	
	/* Prepend Event Function */
	prepend = function (event, code){
		sys.delayedCall( function(){var body = code + eventbody(event), args = eventargs(event); script[event] = new Function([args], body);}, 1);
	}
	
	/* Append Event Function */
	append = function (event, code){
		sys.delayedCall( function(){var body = eventbody(event) + code, args = eventargs(event); script[event] = new Function([args], body);}, 1);
	}
	
	/* Loading External JavaScript Files */
	construction = {};
	construct = function () {
		var index;
		for (index in construction.units) {
			install(construction.source, construction.units[index]);
		}
	}
	
	/* Function to Download Construction File */
	downloadconstruction = function () {
		if (resp !== ""){
			sys.writeToFile("script_construction.json", resp);
		}
		if (sys.getFileContent("script_construction.json") === undefined) {
			print(filename + " default settings could not be installed.");
		}
		else {
			installedjsons.push("construction");
			try {
				construction = JSON.parse(sys.getFileContent("script_construction.json"));
			}
			catch(error){
				print("Error loading construction settings.");
				return;
			}
			construct();
		}
	}
	
	/* Loading Construction File */
	if (sys.getFileContent("script_construction.json") === undefined) {
		sys.webCall("http://pokemonperfect.co.uk/script_construction.json", "downloadconstruction();");
	}
	else {
		try {
			construction = JSON.parse(sys.getFileContent("script_construction.json"));
		}
		catch (error) {
			sys.writeToFile("script_construction (corrupted).json", sys.getFileContent("script_construction.json"));
			print("Construction file corrupted - downloading latest construction file...");
			sys.webCall("http://pokemonperfect.co.uk/script_construction.json", "downloadconstruction();");
			return;
		}
		if (construction.auto_update === "on") {
			sys.webCall(construction.source + "script_construction.json", "downloadconstruction();");
		}
		else {
			construct();
			loadedjsons.push("construction");
		}
	}

	/* Script Update Check Function */
	updatecheck = function (startup) {
		var current_script = sys.getFileContent("scripts.js");
		if (construction.auto_update === "on" && /download/.test(resp)) {
			if (current_script !== resp) {
				sys.writeToFile("scripts (last).js", current_script);
				sys.writeToFile("scripts.js", resp);
				if (startup) {
					sys.changeScript(resp, true);
				}
				else {
					sys.changeScript(resp);
				}
				print("Script Updated!");
				return;
			}
			print("Script is up-to-date.");
		}
	}

	/* Base Commands */
	typecommands = "<b><font color='orangered'>The following commands need to be entered into a channel's main chat:</font></b>";
	commands = {
		commands: function (src, channel, command) {
			var index, display = typecommands, usymbol = global.auth === undefined ? "" : auth.options["user"].image;
			for (index in construction.units) {
				display += "<tr><td>" + usymbol + "<font color='darkgreen'><b>/" + construction.units[index] + "commands</b></font>: displays the " + construction.units[index] + "commands.</td></tr>";
			}
			commanddisplay(src, "Commands", display, channel);
		}
	}
	
	/* Empty Installed/Loaded Array Check function */
	nonecheck = function(array){
		if (array.length === 0){
			array.push("*none*");
		}
	}
	
	/* Installed/Loaded Messages */
	nonecheck(installedscripts);
	nonecheck(loadedscripts);
	nonecheck(installedjsons);
	nonecheck(loadedjsons);
	print("The following scripts were installed: " + String(installedscripts).replace(/,/gi, ", ") + ".");
	print("The following scripts were loaded: " + String(loadedscripts).replace(/,/gi, ", ") + ".");
	print("The following default settings were installed: " + String(installedjsons).replace(/,/gi, ", ") + ".");
	print("The following settings were loaded: " + String(loadedjsons).replace(/,/gi, ", ") + ".");

	/* Script Reload Message */
	if (global.auth !== undefined) {
		auth.echo("server", "The Script has been reloaded!", -1);
	}
}).call(null);

({
	serverStartUp: function () {

		/* Script Update Startup Check */
		sys.webCall(construction.source + "scripts.js", "updatecheck(true);");
	},
	beforeChannelCreated: function (channel, channelname, creator) {},
	afterChannelCreated: function (channel, channelname, creator) {},
	beforeChannelDestroyed: function (channel) {},
	afterChannelDestroyed: function (channel) {},
	serverShutDown: function () {},
	step: function () {},
	beforeNewMessage: function (message) {},
	afterNewMessage: function (message) {

		/* Script Update Script Load Check */
		if (message === "Script Check: OK") {
			sys.webCall(construction.source + "scripts.js", "updatecheck(false);");
		}
	},
	beforeChatMessage: function (src, message, channel) {

		/* Command Execution */
		if (message[0] == "/" && message.length > 1) {
			sys.stopEvent();
			var command = message.substr(1, message.length).split(' '),
				index;
			commandused = false;
			commandtry("global", src, channel, command);
			for (index in construction.units) {
				commandtry(construction.units[index], src, channel, command);
			}
			if (!validcommand && !commandused) {
				commanderror(src, "The server does not recognise <b>\"" + escapehtml(message) + "\"</b> as a valid command.", channel);
			}
		}
	},
	afterChatMessage: function (src, message, channel) {},
	beforeLogIn: function (src, channel) {},
	afterLogIn: function (src) {
		/* Case Sensitive Name Adding */
		var srcname = sys.name(src);
		membersadd(srcname);
		
		/* LogIn Notifications */
		var display = "<timestamp/><table width='100%' style='background-color:qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0.1 mediumorchid stop:0.5 papayawhip); color: black;'><tr><td><center><b><big>Type: <font color='darkgreen'>/Commands</font> into a channel's main chat to view a list of commands.</big></b></center></td></tr></table>";
		sys.sendHtmlMessage(src, display);
	},
	beforeChannelJoin: function (src, channel) {},
	afterChannelJoin: function (src, channel) {},
	beforeChannelLeave: function (src, channel) {},
	afterChannelLeave: function (src, channel) {},
	beforeLogOut: function (src) {},
	afterLogOut: function (src) {},
	beforeChangeTeam: function (src) {},
	afterChangeTeam: function (src) {
		/* Case Sensitive Name Adding */
		var srcname = sys.name(src);
		membersadd(srcname);
	},
	beforeChangeTier: function (src, team, oldtier, newtier) {},
	afterChangeTier: function (src, team, oldtier, newtier) {},
	beforePlayerAway: function (src, away) {},
	afterPlayerAway: function (src, away) {},
	beforePlayerKick: function (src, trgt) {},
	afterPlayerKick: function (src, trgt) {},
	beforePlayerBan: function (src, trgt) {},
	afterPlayerBan: function (src, trgt) {},
	beforeNewPM: function (src) {},
	beforeFindBattle: function (src) {},
	afterFindBattle: function (src) {},
	beforeChallengeIssued: function (src, trgt, clauses, rated, mode, srcteam, trgttier) {},
	afterChallengeIssued: function (src, trgt, clauses, rated, mode, srcteam, trgttier) {},
	beforeBattleMatchup: function (src, trgt, clauses, rated, mode) {},
	afterBattleMatchup: function (src, trgt, clauses, rated, mode) {},
	beforeBattleStarted: function (src, trgt, clauses, rated, mode, battle, srcteam, trgtteam) {},
	battleSetup: function (src, trgt, battle) {},
	afterBattleStarted: function (src, trgt, clauses, rated, mode, battle, srcteam, trgtteam) {},
	attemptToSpectateBattle: function (src, battler1, battler2) {},
	beforeSpectateBattle: function (src, battler1, battler2) {},
	afterSpectateBattle: function (src, battler1, battler2) {},
	beforeBattleEnded: function (winner, loser, result, battle) {},
	afterBattleEnded: function (winner, loser, result, battle) {}
})