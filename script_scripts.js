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
		var usymbol = global.auth === undefined ? "" : auth.options["user"].image;
		var display = typecommands + "<tr><td><center>" + usymbol + "<b><font color='green'>/about</font></b>: displays script information. </center></td></tr>"
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
		var display = "<tr><td></td></tr>" + "<tr><td><b>Name:</b> " + scripts.about.script_name + "</td></tr>" + "<tr><td><b>Scripts Length:</b> " + numberofscripts + " scripts, " + scriptlines + " lines, " + scriptcharacters + " characters.</td></tr>" + "<tr><td><b>Scripts Registered:</b> " + scripts.options.registered + "</td></tr>" + "<tr><td><b>Scripts Last Loaded:</b> " + scripts.load + "</td></tr>" + "<tr><td><b>Version:</b> " + scripts.about.version_number + " (" + scripts.about.version_name + ") [" + scripts.about.version_date + "]</td></tr>" + "<tr><td><b>Version Status:</b> " + scripts.version + "</td></tr>" + "<tr><td><b>Latest:</b> " + scripts.about.latest + "</td></tr>" + "<tr><td><b>Repository:</b> <a href='" + scripts.about.script_repo_link + "' style='color:green'>" + scripts.about.script_repo_link + "</a></td></tr>" + "<tr><td><b>Information:</b> <a href='" + scripts.about.script_info_link + "' style='color:green'>" + scripts.about.script_info_link + "</a></td></tr>" + "<tr><td><b>Base Script:</b> <a href='" + construction.source + "scripts.js' style='color:green'>" + construction.source + "scripts.js</a></td></tr>" + "<tr><td><b>Supplement Scripts:</b> " + String(construction.units).replace(/,/gi, ", ") + ".</td></tr>" + "<tr><td><b>Auto-Update:</b> " + construction.auto_update + ".</td></tr>" + "<tr><td><b>Major Contributors:</b> " + String(scripts.about.major_contributors).replace(/,/gi, ", ") + ".</td></tr>" + "<tr><td><b>Minor Contributors:</b> " + String(scripts.about.minor_contributors).replace(/,/gi, ", ") + ".</td></tr>" + "<tr><td><b>Special Thanks to:</b> " + String(scripts.about.specialthanks).replace(/,/gi, ", ") + ".</td></tr>" + "<tr><td><b>Additional Thanks:</b> All the server hosts that use and recommend this script; all the users who discuss it: give feedback and request features for it.</td></tr>"
		commanddisplay(src, "About", display, channel);
	}
}