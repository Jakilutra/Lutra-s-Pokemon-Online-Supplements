/* Loading Tiers Object and Settings */
tiers = {};
set(construction.source, "tiersoptions", "tiers", "options");
set(construction.source, "tierslinks", "tiers", "links");

/* Installing Tiers Functions */
tiers.install = function (user, key) {
	var current_tiers = sys.getFileContent("tiers.xml");
	if (/category/gi.test(resp)) {
		if (current_tiers !== resp) {
			sys.writeToFile("tiers (last).xml", current_tiers);
			sys.writeToFile("tiers.xml", resp);
			sys.reloadTiers();
			print(tiers.options["autoupdate"] + " tiers have been installed.");
			if (global.auth !== undefined) {
				if (user != "~~Server~~") {
					auth.echo("owner", key + " tiers have been installed as the server's tiers by " + user + "!", -1);
				}
				else {
					auth.echo("server", key + " tiers have been installed as the server's tiers!", -1);
				}
			}
			return;
		}
		if (user != "~~Server~~") {
			commanderror(sys.id(user), "The server's tiers are already up-to-date.");
		}
		print("The server's tiers are up to date with " + key + "'s.");
		return;
	}
	print(key + "'s tiers could not be downloaded.");
	if (user != "~~Server~~") {
		commanderror(sys.id(user), "Sorry, " + key + "'s tiers could not be downloaded.");
	}
}
tiers.download = function (user, key) {
	sys.webCall(tiers.links[key], "tiers.install('" + user + "','" + key + "')");
}

/* Auto-Update Tiers */
if (tiers.links[tiers.options["autoupdate"]] != undefined) {
	tiers.download("~~Server~~", tiers.options["autoupdate"]);
}

/* Auto-Update Tiers Settings */
tiers.updatejsons = function () {
	if (tiers.options.autoupdatesettings === "1" || tiers.options.autoupdatesettings === "2") {
		sys.webCall(construction.source + "script_tiersoptions.json", "downloadjson('" + construction.source + "', 'tiersoptions', 'tiers', 'options');");
	}
	if (tiers.options.autoupdatesettings === "1" || tiers.options.autoupdatesettings === "3") {
		sys.webCall(construction.source + "script_tierslinks.json", "downloadjson('" + construction.source + "', 'tierslinks', 'tiers', 'links');");
	}
}
tiers.updatejsons();

/* Tiers Commands */
tiers.commands = {
	tierscommands: function (src, channel, command) {
		var osymbol = global.auth === undefined ? "" : auth.options["owner"].image,
			usymbol = global.auth === undefined ? "" : auth.options["user"].image;
		var display = typecommands + "<tr><td><center>" + usymbol + "<b><font color='darkgreen'>/tsettings</font></b>: displays the tiers settings. </center></td></tr>" + "<tr><td><center>" + osymbol + "<b><font color='darkgreen'>/autsettings</font><font color='darkred'> value</font></b>: if <b>value</b> is 0, 1, 2 or 3 - auto-updates: no settings, all settings, only tiersoptions or only tierslinks respectively. </center></td></tr>" + "<tr><td><center>" + osymbol + "<b><font color='darkgreen'>/utsettings</font></b>: updates the tiers settings according to the auto-update tiers setting. </center></td></tr>" + "<tr><td><center>" + osymbol + "<b><font color='darkgreen'>/nametiers</font><font color='darkred'> name</font></b>: set the filename of <b>name</b> for importing and exporting the tiers. </center></td></tr>" + "<tr><td><center>" + osymbol + "<b><font color='darkgreen'>/importtiers</font><font color='darkred'> name</font></b>: imports the server's tiers from <b>name</b>.xml or " + tiers.options.name + ".xml if no <b>name</b> is given. </center></td></tr>" + "<tr><td><center>" + osymbol + "<b><font color='darkgreen'>/exporttiers</font><font color='darkred'> name</font></b>: exports to the server's tiers to <b>name</b>.xml or " + tiers.options.name + ".xml if no <b>name</b> is given. </center></td></tr>" + "<tr><td><center>" + osymbol + "<b><font color='darkgreen'>/reloadtiers</font></b>: reloads the server's tiers from file. </center></td></tr>" + "<tr><td><center>" + osymbol + "<b><font color='darkgreen'>/reverttiers</font></b>: reverts to the server's last tiers. </center></td></tr>" + "<tr><td><center>" + osymbol + "<b><font color='darkgreen'>/writetierskey</font><font color='darkred'> key</font><font color='darkblue'>*URL</font></b>: Writes the tiers key: <b>key</b> with <b>URL</b>. </center></td></tr>" + "<tr><td><center>" + osymbol + "<b><font color='darkgreen'>/removetierskey</font><font color='darkred'> key</font></b>: removes the tiers key: <b>key</b>. </center></td></tr>" + "<tr><td><center>" + osymbol + "<b><font color='darkgreen'>/autiers</font><font color='darkred'> key</font></b>: set <b>key</b>'s tiers as the server's tiers to auto-update. </center></td></tr>" + "<tr><td><center>" + osymbol + "<b><font color='darkgreen'>/updatetiers</font></b>: updates the server's tiers. </center></td></tr>" + "<tr><td><center>" + osymbol + "<b><font color='darkgreen'>/downloadtiers</font><font color='darkred'> URL</font></b>: installs tiers from <b>URL</b>. </center></td></tr>" + "<tr><td><center>" + osymbol + "<b><font color='darkgreen'>/installtiers</font><font color='darkred'> key</font></b>: installs tiers from the URL address of <b>key</b>. </center></td></tr>";
		commanddisplay(src, "Tiers Commands", display, channel);
	},
	installtiers: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the install tiers command (owner command).", channel);
			return;
		}
		var key = command[1].toUpperCase();
		if (tiers.links[command[1].toUpperCase()] === undefined) {
			commanderror(src, "Sorry, " + command[1].toUpperCase() + " does not exist as a tiers key.", channel);
			return;
		}
		tiers.download(sys.name(src), key);
	},
	updatetiers: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the update tiers command (owner command).", channel);
			return;
		}
		if (tiers.links[tiers.options["autoupdate"]] === undefined) {
			commanderror(src, "Sorry, the autoupdate setting contains no valid key.", channel);
			return;
		}
		tiers.download(sys.name(src), tiers.options["autoupdate"]);
	},
	reloadtiers: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the reload tiers command (owner command).", channel);
			return;
		}
		sys.reloadTiers();
		if (global.auth !== undefined) {
			auth.echo("owner", "The server's tiers have been reloaded by " + sys.name(src) + "!", -1);
		}
	},
	reverttiers: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the revert tiers command (owner command).", channel);
			return;
		}
		var last_tiers = sys.getFileContent("tiers (last).xml");
		if (last_tiers === undefined) {
			commanderror(src, "Sorry, there is no tiers to revert to.", channel);
			return;
		}
		sys.writeToFile("tiers (last).xml", sys.getFileContent("tiers.xml"));
		sys.writeToFile("tiers.xml", last_tiers);
		sys.reloadTiers();
		if (global.auth !== undefined) {
			auth.echo("owner", "The server's tiers have been rerverted by " + sys.name(src) + "!", -1);
		}
	},
	nametiers: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the name tiers command (owner command).", channel);
			return;
		}
		if (/[^A-z]/gi.test(command[1])) {
			commanderror(src, "Sorry, you can only name your tiers file with characters from A-z.", channel);
			return;
		}
		if (tiers.options.name === command[1]) {
			commanderror(src, "The tiers filename is already " + tiers.options.name + ".", channel);
			return;
		}
		tiers.options.name = command[1];
		sys.writeToFile("script_tiersoptions.json", JSON.stringify(tiers.options));
		if (global.auth !== undefined) {
			auth.echo("owner", "The server's tiers filename has been changed to " + tiers.options.name + " by " + sys.name(src) + ".", -1);
		}
	},
	autiers: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the auto-update tiers command (owner command).", channel);
			return;
		}
		if (tiers.links[command[1].toUpperCase()] === undefined) {
			commanderror(src, command[1].toUpperCase() + " does not exist as a tiers key.", channel);
			return;
		}
		if (tiers.options.autoupdate === command[1].toUpperCase()) {
			commanderror(src, "The tiers to auto-update is already set as " + tiers.options.autoupdate + ".", channel);
			return;
		}
		tiers.options.autoupdate = command[1].toUpperCase();
		sys.writeToFile("script_tiersoptions.json", JSON.stringify(tiers.options));
		if (global.auth !== undefined) {
			auth.echo("owner", "The server's tiers to auto-update has been changed to " + tiers.options.autoupdate + " by " + sys.name(src) + ".", -1);
		}
	},
	importtiers: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the import tiers command (owner command).", channel);
			return;
		}
		var filename = command[1] === "undefined" ? tiers.options.name + ".xml" : command[1] + ".xml",
			next_tiers = sys.getFileContent(filename),
			current_tiers = sys.getFileContent("tiers.xml");
		if (!/category/gi.test(next_tiers)) {
			commanderror(src, "Sorry, the content of " + filename + " could not be imported.", channel);
			return;
		}
		if (next_tiers === current_tiers) {
			commanderror(src, "Sorry, the content of " + filename + " is the same as the current tiers.", channel);
			return;
		}
		sys.writeToFile("tiers (last).xml", sys.getFileContent("tiers.xml"));
		sys.writeToFile("tiers.xml", next_tiers);
		sys.reloadTiers();
		if (global.auth !== undefined) {
			auth.echo("owner", "The server's tiers have been imported from " + filename + " by " + sys.name(src) + "!", -1);
		}
	},
	exporttiers: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the export tiers command (owner command).", channel);
			return;
		}
		if (command[1] === "undefined") {
			sys.writeToFile(tiers.options.name + ".xml", sys.getFileContent("tiers.xml"));
			if (global.auth !== undefined) {
				auth.echo("owner", "The server's tiers have been exported to " + tiers.options.name + ".xml by " + sys.name(src) + "!", -1);
			}
		}
		else {
			var export_tiers = command[1];
			if (/[^A-z]/gi.test(export_tiers)) {
				commanderror(src, "Sorry, you can only name your tiers file with characters from A-z.", channel);
				return;
			}
			sys.writeToFile(export_tiers + ".xml", sys.getFileContent("tiers.xml"));
			if (global.auth !== undefined) {
				auth.echo("owner", "The server's tiers have been exported to " + export_tiers + ".xml by " + sys.name(src) + "!", -1);
			}
		}
	},
	downloadtiers: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the download tiers command (owner command).", channel);
			return;
		}
		sys.webCall(command[1], "tiers.install('" + sys.name(src) + "','" + command[1] + "')");
	},
	writetierskey: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the write tiers key command (owner command).", channel);
			return;
		}
		if (/[^A-z]/gi.test(command[1])) {
			commanderror(src, "Sorry, you can only create a tiers key with the letters from A-z.", channel);
			return;
		}
		if (command[2] === undefined) {
			commanderror(src, "Sorry, you haven't specified any URL address.", channel);
			return;
		}
		tiers.links[command[1].toUpperCase()] = command[2];
		sys.writeToFile("script_tierslinks.json", JSON.stringify(tiers.links));
		if (global.auth !== undefined) {
			auth.echo("owner", "The " + command[1].toUpperCase() + " tiers key was written with " + command[2] + " by " + sys.name(src) + "!", -1);
		}
	},
	removetierskey: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the remove tiers key command (owner command).", channel);
			return;
		}
		if (tiers.links[command[1].toUpperCase()] === undefined) {
			commanderror(src, "Sorry, the " + command[1] + " tiers key does not exist.", channel);
			return;
		}
		delete tiers.links[command[1].toUpperCase()];
		sys.writeToFile("script_tierslinks.json", JSON.stringify(tiers.links));
		if (global.auth !== undefined) {
			auth.echo("owner", "The " + command[1].toUpperCase() + " tiers key has been removed by " + sys.name(src) + "!", -1);
		}
	},
	tsettings: function (src, channel, command) {
		var index, display = "<tr><td><b>Auto-Update Tiers: </b>" + tiers.options.autoupdate + "</td></tr>" + "<tr><td><b>Tiers File: </b>" + tiers.options.name + ".xml</td></tr>" + "<tr><td><b>Auto-Update Settings: </b>" + tiers.options.autoupdatesettings + "</td></tr>" + "<tr><td></td></tr>" + "<tr><td><h3><u>Tiers Keys</u></h3></td></tr>";
		for (index in tiers.links) {
			display += "<tr><td><b>" + index + ":</b> <a href='" + tiers.links[index] + "' style='color:green'>" + tiers.links[index] + "</a></td></tr>";
		}
		display += "</table";
		commanddisplay(src, "Tiers Settings", display, channel);
	},
	utsettings: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the update tiers settings command (owner command).", channel);
			return;
		}
		tiers.updatejsons();
		if (global.auth !== undefined) {
			auth.echo("owner", "The tiers settings have been updated by " + sys.name(src) + "!", -1);
		}
	},
	autsettings: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the auto-update tiers settings command (owner command).", channel);
			return;
		}
		if (command[1] != "0" && command[1] != "1" && command[1] != "2" && command[1] != "3") {
			commanderror(src, "Sorry, you must specify either 0, 1, 2 or 3 for the auto-update tiers settings command.", channel);
			return;
		}
		if (command[1] === tiers.options.autoupdatesettings) {
			commanderror(src, "The tiers auto-update settings is already set to " + command[1] + ".", channel);
			return;
		}
		tiers.options.autoupdatesettings = command[1];
		sys.writeToFile("script_tiersoptions.json", JSON.stringify(tiers.options));
		if (global.auth !== undefined) {
			auth.echo("owner", "The tiers auto-update settings has been changed to " + command[1] + " by " + sys.name(src) + "!", -1);
		}
	}
}