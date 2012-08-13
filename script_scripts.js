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

/* Script Registered Date */
if (scripts.options.registered === undefined) {
	scripts.options.registered = String(new Date());
	sys.writeToFile("script_options.json", JSON.stringify(scripts.options));
}

/* Script Load Date */
scripts.load = new Date();

/* Scripts Commands */
scripts.commands = {
	scriptscommands: function (src, channel, command) {
		var usymbol = global.auth === undefined ? "" : auth.options["user"].image,
		osymbol = global.auth === undefined ? "" : auth.options["owner"].image;
		var display = typecommands
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/about</font></b>: displays script information. </td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/eval</font><font color='darkred'> string</font></b>: evaluates/executes <b>string</b>. <b>string</b> is a JavaScript expression, variable, statement or sequence of statements.</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/system</font><font color='darkred'> command</font></b>: runs <b>command</b> on the underlying operating system.</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/print</font><font color='darkred'> data</font></b>: prints <b>data</b> on the server window. <b>data</b> is a global variable, object, string, number or boolean.</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/clear</font></b>: clears the server window text. </td></tr>"
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
		+ "<tr><td><b>Scripts Registered:</b> " + scripts.options.registered + "</td></tr>" 
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
		if (global.auth !== undefined) {
			auth.echo("owner", "The server window has been cleared by " + sys.name(src) + "!", -1);
		}
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
		commanddisplay(src, "Script Evaluation", display, channel);
	}
}