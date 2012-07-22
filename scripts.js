(function () {

	/* Naming the Global Object */
	global = this;
	
	/* Function to Download JavaScript Files */
	downloadjs = function (source, filename) {
		sys.writeToFile("script_" + filename + ".js", resp);
		if (sys.getFileContent("script_" + filename + ".js") === undefined) {
			print(filename + " could not be installed.");
		}
		else {
			print("Installed " + filename + " script.");
			try {
				eval(sys.getFileContent("script_" + filename + ".js"));
			}
			catch(error){
				print("Error loading " + filename + " script.");
			}
		}
	}	
	
	/* Function to Load External JavaScript Files */
	install = function (source, filename) {
		if (sys.getFileContent("script_" + filename + ".js") === undefined || construction.auto_update === "on") {
			sys.webCall(source + "script_" + filename + ".js", "downloadjs('" + source + "', '" + filename + "');");
		}
		else {
			print("Loaded " + filename + " script.");
			try {
				eval(sys.getFileContent("script_" + filename + ".js"));
			}
			catch(error){
				print("Error loading " + filename + " script.");
			}
		}
	}
	
	/* Function to Download JSON Files */
	downloadjson = function (source, filename, object, key) {
		sys.writeToFile("script_" + filename + ".json", resp);
		if (sys.getFileContent("script_" + filename + ".json") === undefined) {
			print(filename + " default settings could not be installed.");
		}
		else {
			print("Installed " + filename + " default settings.");
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
			print("Loaded " + filename + " settings.");
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

	/* Escape Html Function */
	escapehtml = function (str) {
		return str.replace(/&/g, '&amp;').replace(/\>/g, '&gt;').replace(/\</g, '&lt;');
	}

	/* Remove Spaces Function */
	removespaces = function (str) {
		return str.split(' ').join('');
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
		sys.writeToFile("script_construction.json", resp);
		if (sys.getFileContent("script_construction.json") === undefined) {
			print(filename + " default settings could not be installed.");
		}
		else {
			print("Installed construction default settings.");
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
			print("Loaded construction settings.");
		}
	}

	/* Script Update Check Function */
	updatecheck = function (startup) {
		var current_script = sys.getFileContent("scripts.js");
		if (construction.auto_update === "on" && /download/gi.test(resp)) {
			if (current_script !== resp) {
				sys.writeToFile("scripts (last).js", current_script);
				if (startup) {
					sys.writeToFile("scripts.js", resp);
					sys.changeScript(resp, true);
				}
				else {
					sys.writeToFile("scripts.js", resp);
					sys.changeScript(resp);
				}
				print("Script Updated!");
				return;
			}
			print("Script is up-to-date.");
		}
	}

	/* Base Commands */
	typecommands = "<center><b><font color='orangered'>The following commands need to be entered into a channel's main chat:</font></b></center>";
	commands = {
		commands: function (src, channel, command) {
			var index, display = typecommands;
			for (index in construction.units) {
				display += "<tr><td><center><font color='darkgreen'><b>/" + construction.units[index] + "commands</b></font>: displays the " + construction.units[index] + "commands.</center></td></tr>";
			}
			commanddisplay(src, "Commands", display, channel);
		}
	}

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

		/* LogIn Notifications*/
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
	afterChangeTeam: function (src) {},
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