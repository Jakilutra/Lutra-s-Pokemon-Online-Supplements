/* Loading Scripts Object and Settings */
scripts = {};
set(construction.source, "options", "scripts", "options");
if (construction.auto_update === "on") {
	sys.webCall(construction.source + "script_about.json", "downloadjson('" + construction.source + "', 'about', 'scripts', 'about');");
}
else {
	set(construction.source, "about", "scripts", "about");
}

/* Checking Version Status*/
scripts.checkversion = function () {
	if (resp === sys.getFileContent("script_about.json")) {
		scripts.version = "Synchronised with latest version.";
	}
	else {
		scripts.version = "Not synchronised with latest version.";
	}
}
sys.webCall(construction.source + "script_about.json", "scripts.checkversion();");

/* Script Load Date */
scripts.load = new Date();

/* Scripts Announcement Function */
scripts.echo = function (text, channel) {
	var display = "<timestamp/><table width='100%' style='background-color:qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0.1 dimgray, stop:0.5 darkslategray); color:white;'><tr><td><center><b><big>" + text + "</big></b><small> - Scripts Announcement </small></center></td></tr></table>";
	if (channel > -1) {
		sys.sendHtmlAll(display, channel);
	}
	else {
		sys.sendHtmlAll(display);
	}
}

/* Auto-Update Scripts Settings */
scripts.updatejsons = function () {
	if (scripts.options.autoupdatesettings === "1") {
		sys.webCall(construction.source + "script_options.json", "downloadjson('" + construction.source + "', 'options', 'scripts', 'options');");
		updatedjsons.push("options");
	}
}
if (scripts.options !== undefined){
	scripts.updatejsons();
}

/* Scripts Commands */
scripts.commands = {
	scriptscommands: function (src, channel, command) {
		var osymbol = "", asymbol = "", msymbol = "", usymbol = "";
		if (global.auth !== undefined){
			osymbol = auth.options["owner"].image;
			asymbol = auth.options["admin"].image;
			msymbol = auth.options["mod"].image;
			usymbol = auth.options["user"].image;
		}
		var display = typecommands
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/asecho</font><font color='darkred'> status</font></b>: turns announcing by scripts echo <b>status</b>. <b>status</b> is either on or off.</td></tr>" 
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/ausettings</font><font color='darkred'> value</font></b>: if <b>value</b> is 0 or 1 - auto-updates: no settings or all settings respectively. </td></tr>" 
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/usettings</font></b>: updates the scripts settings according to the auto-update scripts setting. </td></tr>" 
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/load</font></b>: loads the base script from file. </td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/get</font><font color='darkred'> variable</font></b>: displays the data within <b>variable</b>.</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/delete</font><font color='darkred'> variable</font></b>: deletes <b>variable</b>."
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/eval</font><font color='darkred'> string</font></b>: evaluates/executes <b>string</b>. <b>string</b> is a JavaScript expression, variable, statement or sequence of statements.</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/system</font><font color='darkred'> command</font></b>: runs <b>command</b> on the underlying operating system.</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/print</font><font color='darkred'> data</font></b>: prints <b>data</b> on the server window. <b>data</b> is a global variable, object, string, number or boolean.</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/clear</font></b>: clears the server window text. </td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/broadcast</font><font color='darkred'> status</font></b>: turns the broadcasting of get, delete, eval, system, print and clear commands <b>status</b>. <b>status</b> is either on or off. </td></tr>"
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/secho</font><font color='darkred'> message</font><font color='darkblue'>*channel</font></b>: displays <b>message</b> with the scripts echo announcement - in <b>channel</b> if a name of a channel is specified. </td></tr>" 
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/about</font></b>: displays script information. </td></tr>"
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/settings</font></b>: displays other script settings. </td></tr>";
		commanddisplay(src, "Scripts Commands", display, channel);
	},
	about: function (src, channel, command) {
		var numberofscripts = 1 + construction.units.length,
			scriptlines = sys.getFileContent("scripts.js").split(/\u000A/g).length,
			scriptcharacters = sys.getFileContent("scripts.js").length,
			index;
		for (index in construction.units) {
			scriptlines += sys.getFileContent("script_" + construction.units[index] + ".js").split(/\u000A/g).length;
			scriptcharacters += sys.getFileContent("script_" + construction.units[index] + ".js").length;
		}
		var display = "<tr><td></td></tr>" 
		+ "<tr><td><b>Name:</b> " + scripts.about.script_name + "</td></tr>" 
		+ "<tr><td><b>Scripts Length:</b> " + numberofscripts + " scripts, " + scriptlines + " lines, " + scriptcharacters + " characters.</td></tr>" 
		+ "<tr><td><b>Scripts Last Loaded:</b> " + scripts.load + "</td></tr>" 
		+ "<tr><td><b>Version:</b> " + scripts.about.version_number + " (" + scripts.about.version_name + ") [" + scripts.about.version_date + "]</td></tr>" 
		+ "<tr><td><b>Version Status:</b> " + scripts.version + "</td></tr>" 
		+ "<tr><td><b>Latest:</b> " + scripts.about.latest + "</td></tr>" 
		+ "<tr><td><b>Repository:</b> <a href='" + scripts.about.script_repo_link + "' style='color:green'>" + scripts.about.script_repo_link + "</a></td></tr>" 
		+ "<tr><td><b>Information:</b> <a href='" + scripts.about.script_info_link + "' style='color:green'>" + scripts.about.script_info_link + "</a></td></tr>" 
		+ "<tr><td><b>Base Script:</b> <a href='" + construction.source + "scripts.js' style='color:green'>" + construction.source + "scripts.js</a></td></tr>" 
		+ "<tr><td><b>Supplement Scripts:</b> " + String(construction.units).replace(/,/gi, ", ") + ".</td></tr>" 
		+ "<tr><td><b>Auto-Update:</b> " + construction.auto_update + ".</td></tr>" 
		+ "<tr><td><b>Major Contributors:</b> " + String(scripts.about.major_contributors).replace(/,/gi, ", ") + ".</td></tr>" 
		+ "<tr><td><b>Minor Contributors:</b> " + String(scripts.about.minor_contributors).replace(/,/gi, ", ") + ".</td></tr>" 
		+ "<tr><td><b>Special Thanks to:</b> " + String(scripts.about.specialthanks).replace(/,/gi, ", ") + ".</td></tr>" 
		+ "<tr><td><b>Additional Thanks:</b> All the server hosts that use and recommend this script; all the users who discuss it: give feedback and request features for it.</td></tr>"
		commanddisplay(src, "About", display, channel);
	},
	clear: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the clear command (owner command).", channel);
			return;
		}
		sys.clearChat();
		if (scripts.options.broadcast === "on") {
			if (global.auth !== undefined && scripts.options.echo === "off") {
				auth.echo("owner", "The server window has been cleared by " + sys.name(src) + "!", -1);
			}
			else {
				scripts.echo("The server window has been cleared by " + sys.name(src) + "!", -1);
			}
			return;
		}
		commanddisplay(src,"Server Window Cleared!", "", channel);
	},
	print: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the print command (owner command).", channel);
			return;
		}
		command.splice(0,1);
		command = command.join("*");
		try { 
			eval("print(" + command + ")");
			if (scripts.options.broadcast === "on") {
				if (global.auth !== undefined && scripts.options.echo === "off") {
					auth.echo("owner", sys.name(src) + " has printed the following code on the server window:<br/>" + escapehtml(command), -1);
				}
				else {
					scripts.echo(sys.name(src) + " has printed the following code on the server window:<br/>" + escapehtml(command), -1);
				}
				return;
			}
			commanddisplay(src, "Print Successful!", "<tr><td><center><b>Printed: </b> " + escapehtml(command) + "</center></td></tr>", channel);
		}
		catch(error){
			commanderror(src,error.message);
		}
	},
	system: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the system command (owner command).", channel);
			return;
		}
		command.splice(0,1);
		command = command.join("*");
		sys.system(command);
		if (scripts.options.broadcast === "on") {
			if (global.auth !== undefined && scripts.options.echo === "off") {
				auth.echo("owner", sys.name(src) + " has used the following system command:<br/>" + escapehtml(command), -1);
			}
			else {
				scripts.echo(sys.name(src) + " has used the following system command:<br/>" + escapehtml(command), -1);
			}
			return;
		}
		commanddisplay(src, "System Command", "<tr><td><center>" + escapehtml(command) + "</center></td></tr>", channel);
	},
	eval: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the evaluation command (owner command).", channel);
			return;
		}
		command.splice(0,1);
		command = command.join("*");
		var display = "<tr><td><center><b>Evaluated Code: </b>" + escapehtml(command) + "</center></td></tr>";
		var starttime = new Date();
		try {
			eval(command);
		}
		catch (error) { 
			commanderror(src,error.message, channel);
			return;
		}
		var runtime = new Date() - starttime;
		display += "<tr><td><center><b>Evaluation Runtime:</b> " + runtime + " milliseconds</center></td></tr>";
		if (scripts.options.broadcast === "on") {
			if (global.auth !== undefined && scripts.options.echo === "off") {
				auth.echo("owner", sys.name(src) + " has evaluated the following code in " + runtime + " milliseconds:<br/>" + escapehtml(command), -1);
			}
			else {
				scripts.echo(sys.name(src) + " has evaluated the following code in " + runtime + " milliseconds:<br/>" + escapehtml(command), -1);
			}
			return;
		}
		commanddisplay(src, "Script Evaluation", display, channel);
	},
	get: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the get command (owner command).", channel);
			return;
		}
		var globalvariable;
		try { 
			globalvariable = eval("global." + command[1]);
		}
		catch(error){
			commanderror(src, "Sorry, you cannot get the content of " + command[1] + " because it is not a valid name for a variable.", channel);
			return;
		}
		globalvariable = globalvariable === undefined ? "undefined" : globalvariable; 
		var datatype = typeof globalvariable;
		var display = "<tr><td><b>Variable: </b>" + command[1] + "</td></tr>"
		+ "<tr><td><b>Type: </b>" + datatype + "</td></tr>"
		+ "<tr><td></td></tr>"
		+ "<tr><td>" + escapehtml(String(globalvariable)).replace(/\n/g, "<br/>").replace(/\t/g, "&nbsp;") + "</td></tr>";
		if (scripts.options.broadcast === "on") {
			if (global.auth !== undefined && scripts.options.echo === "off") {
				auth.echo("owner", "<u>" + sys.name(src) + " has got the content of " + command[1] + "</u>" + "<p align='left'> Type: " + datatype + "<br/><br/>" + escapehtml(String(globalvariable)).replace(/\n/g, "<br/>").replace(/\t/g, "&nbsp;") + "</p>", -1);
			}
			else {
				scripts.echo("<u>" + sys.name(src) + " has got the content of " + command[1] + "</u>" + "<p align='left'> Type: " + datatype + "<br/><br/>" + escapehtml(String(globalvariable)).replace(/\n/g, "<br/>").replace(/\t/g, "&nbsp;") + "</p>", -1);
			}
			return;
		}
		commanddisplay(src, "Variable Content", display, channel);
	},
	'delete': function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the delete command (owner command).", channel);
			return;
		}
		try { 
			var globalvariable = eval("global." + command[1]);
		}
		catch(error) {
			commanderror(src, "Sorry, you cannot delete " + command[1] + " because it is not a valid name for a variable.</i>", channel);
			return;
		}
		eval("delete global." + command[1]);
		if (scripts.options.broadcast === "on"){
			if (global.auth !== undefined && scripts.options.echo === "off") {
				auth.echo("owner", sys.name(src) + " has deleted the variable: " + command[1], -1);
			}
			else {
				scripts.echo(sys.name(src) + " has deleted the variable: " + command[1], -1);
			}
			return;
		}
		commanddisplay(src, "Variable Deletion", "<tr><td><center><b>Deleted: </b>" + command[1] + "</center></td></tr>", channel);	
	},
	broadcast: function(src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the broadcast command (owner command).", channel);
			return;
		}
		var arg = command[1].toLowerCase(), srcname = sys.name(src);
		if (arg !== "on" && arg !== "off") {
			commanderror(src, "Sorry, you are required to specify on or off.", channel);
			return;
		}
		if (arg === "on") {
			if (scripts.options.broadcast === "on") {
				commanderror(src, "Sorry, broadcasting script changes is already turned on.", channel);
				return;
			}
			scripts.options.broadcast = "on";
			sys.writeToFile("script_options.json", JSON.stringify(scripts.options));
			if (global.auth !== undefined && scripts.options.echo === "off") {
				auth.echo("owner", "Broadcasting script changes has been turned on by " + srcname + "!", -1);
			}
			else {
				scripts.echo("Broadcasting script changes has been turned on by " + srcname + "!", -1);
			}
			return;
		}
		if (scripts.options.broadcast === "off") {
			commanderror(src, "Sorry, broadcasting script changes is already turned off.", channel);
			return;
		}
		scripts.options.broadcast = "off";
		sys.writeToFile("script_options.json", JSON.stringify(scripts.options));
		if (global.auth !== undefined && scripts.options.echo === "off") {
			auth.echo("owner", "Broadcasting script changes has been turned off by " + srcname + "!", -1);
		}
		else {
			scripts.echo("Broadcasting script changes has been turned off by " + srcname + "!", -1);
		}
	},
	settings: function(src, channel, command) {
		var display = "<tr><td><b> Broadcasting Script Changes: </b>" + scripts.options.broadcast + "</td></tr>"
		+ "<tr><td><b> Scripts Echo: </b>" + scripts.options.echo + "</td></tr>"
		+ "<tr><td><b> Auto-Update Settings: </b>" + scripts.options.autoupdatesettings + "</td></tr>";
		commanddisplay(src, "Settings", display, channel);
	},
	load: function (src, channel, command){
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the load command (owner command).", channel);
			return;
		}
		var srcname = sys.name(src), scriptcontent = sys.getFileContent("scripts.js");
		if (global.auth !== undefined && scripts.options.echo === "off") {
			auth.echo("owner", "The Server Script has been loaded from file by " + srcname + "!");
		}
		else {
			scripts.echo("The Server Script has been loaded from file by " + srcname + "!");
		}
		sys.changeScript(scriptcontent);
	},
	secho: function(src, channel, command){
		if (sys.auth(src) < 1) {
			commanderror(src, "Sorry, you do not have permission to use the scripts echo command (mod command).", channel);
			return;
		}
		var channelid = sys.channelId(command[command.length - 1]);
		sys.sendAll(sys.name(src) + ":", channelid);
		command.splice(0, 1);
		if (channelid !== undefined && command.length > 1) {
			command.splice(command.length - 1, 1);
		}
		command = command.join("*");
		scripts.echo(command, channelid);
	},
	asecho: function(src, channel, command){
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the auto scripts echo command (owner command).", channel);
			return;
		}
		var arg = command[1].toLowerCase(), srcname = sys.name(src);
		if (arg !== "on" && arg !== "off") {
			commanderror(src, "Sorry, you are required to specify on or off.", channel);
			return;
		}
		if (arg === "on") {
			if (scripts.options.echo === "on") {
				commanderror(src, "Sorry, announcing by scripts echo is already turned on.", channel);
				return;
			}
			scripts.options.echo = "on";
			sys.writeToFile("script_options.json", JSON.stringify(scripts.options));
			scripts.echo("Announcing by scripts echo has been turned on by " + srcname + "!", -1);
			return;
		}
		if (scripts.options.echo === "off") {
			commanderror(src, "Sorry, announcing by scripts echo is already turned off.", channel);
			return;
		}
		scripts.options.echo = "off";
		sys.writeToFile("script_options.json", JSON.stringify(scripts.options));
		if (global.auth !== undefined) {
			auth.echo("owner", "Announcing by scripts echo has been turned off by " + srcname + "!", -1);
		}
	},
	usettings: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the update settings command (owner command).", channel);
			return;
		}
		if (scripts.options.autoupdatesettings === "0"){
			commanderror(src, "Sorry, you could not update any settings because auto-update settings is set to 0.", channel);
			return;
		}
		scripts.updatejsons();
		if (global.auth !== undefined && scripts.options.echo === "off") {
			auth.echo("owner", "The scripts settings have been updated by " + sys.name(src) + "!", -1);
		}
		else {
			scripts.echo("The scripts settings have been updated by " + sys.name(src) + "!", -1);
		}
	},
	ausettings: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the auto-update scripts settings command (owner command).", channel);
			return;
		}
		if (command[1] != "0" && command[1] != "1") {
			commanderror(src, "Sorry, you must specify either 0 or 1 for the auto-update scripts settings command.", channel);
			return;
		}
		if (command[1] === scripts.options.autoupdatesettings) {
			commanderror(src, "The scripts auto-update settings is already set to " + command[1] + ".", channel);
			return;
		}
		scripts.options.autoupdatesettings = command[1];
		sys.writeToFile("script_options.json", JSON.stringify(scripts.options));
		if (global.auth !== undefined && scripts.options.echo === "off") {
			auth.echo("owner", "The scripts auto-update settings has been changed to " + command[1] + " by " + sys.name(src) + "!", -1);
		}
		else {
			scripts.echo("The scripts auto-update settings has been changed to " + command[1] + " by " + sys.name(src) + "!", -1)
		}
	}
}