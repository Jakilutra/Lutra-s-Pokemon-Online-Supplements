/* Loading Tiers Object and Settings */
tiers = {};
set(construction.source, "tiersoptions", "tiers", "options");
set(construction.source, "tierslinks", "tiers", "links");
/* Installing Tiers Functions */
tiers.install = function(user, key){
	var current_tiers = sys.getFileContent("tiers.xml");
	if (/category/gi.test(resp)){
		if (current_tiers !== resp){
			sys.writeToFile("tiers (last).xml", sys.getFileContent("tiers.xml"));
			sys.writeToFile("tiers.xml", resp); 
			sys.reloadTiers();
			print(tiers.options["autoupdate"] + " tiers have been installed.");
			if (global.auth !== undefined){
				if (user != "~~Server~~"){
					auth.echo("owner", key + " tiers have been installed as the server's tiers by " + user + "!" , -1);
				}
				else {
					auth.echo("server", key + " tiers have been installed as the server's tiers!", -1);
				}
			}
			return;
		}
		if (user != "~~Server~~"){
			commanderror(sys.id(user), "The server's tiers are already up-to-date.");
		}
		print("The server's tiers are up to date with " + key + "'s.");
		return;
	}
	print(key + "'s tiers could not be downloaded.");
	if (user != "~~Server~~"){
		commanderror(sys.id(user), "Sorry, " + key + "'s tiers could not be downloaded.");
	}
}
tiers.download = function(user, key){
	sys.webCall(tiers.links[key], "tiers.install('" + user + "','" + key + "')");
}
/* Auto-Update Tiers */
if (tiers.links[tiers.options["autoupdate"]] != undefined){
	tiers.download("~~Server~~", tiers.options["autoupdate"]);
}
/* Tiers Commands */
tiers.commands = {
	tierscommands: function(src, channel, command){
		var osymbol = global.auth === undefined ? "" : auth.options["owner"].image;
		var display = typecommands
		+ "<tr><td><center>" + osymbol + "<b><font color='darkgreen'>/nametiers</font><font color='red'> name</font></b>: set the filename of <b>name</b> for the tiers. </center></td></tr>"
		+ "<tr><td><center>" + osymbol + "<b><font color='darkgreen'>/reloadtiers</font></b>: reloads the server's tiers from file. </center></td></tr>"
		+ "<tr><td><center>" + osymbol + "<b><font color='darkgreen'>/reverttiers</font></b>: reverts to the server's last tiers. </center></td></tr>"
		+ "<tr><td><center>" + osymbol + "<b><font color='darkgreen'>/autiers</font><font color='red'> key</font></b>: set <b>key</b>'s tiers as the server's tiers to auto-update. </center></td></tr>"
		+ "<tr><td><center>" + osymbol + "<b><font color='darkgreen'>/updatetiers</font></b>: attemps to update the server's tiers. </center></td></tr>"
		+ "<tr><td><center>" + osymbol + "<b><font color='darkgreen'>/installtiers</font><font color='red'> key</font></b>: installs tiers from the URL address of <b>key</b>. </center></td></tr>";
		commanddisplay(src, "Tiers Commands", display, channel);		
	}
	,
	installtiers: function(src, channel, command){
		if (sys.auth(src) < 3){
			commanderror(src, "Sorry, you do not have permission to use the install tiers command (owner command).", channel);
			return;
		}
		var key = command[1].toUpperCase();
		if (tiers.links[command[1].toUpperCase()] === undefined){
			commanderror(src, "Sorry, " + command[1].toUpperCase() + " does not exist as a tiers key.", channel);
			return;
		}
		tiers.download(sys.name(src), key);
	}
	,
	updatetiers: function(src, channel, command){
		if (sys.auth(src) < 3){
			commanderror(src, "Sorry, you do not have permission to use the install tiers command (owner command).", channel);
			return;
		}
		if (tiers.links[tiers.options["autoupdate"]] === undefined){
			commanderror(src, "Sorry, the autoupdate setting contains no valid key.", channel);
			return;
		}
		tiers.download(sys.name(src), tiers.options["autoupdate"]);
	}
	,
	reloadtiers: function(src, channel, command){
		if (sys.auth(src) < 3){
			commanderror(src, "Sorry, you do not have permission to use the install tiers command (owner command).", channel);
			return;
		}
		sys.reloadTiers();
		if (global.auth !== undefined){
			auth.echo("owner", "The server's tiers have been reloaded by " + sys.name(src) + "!" , -1);
		}
	}
	,
	reverttiers: function(src, channel, command){
		if (sys.auth(src) < 3){
			commanderror(src, "Sorry, you do not have permission to use the install tiers command (owner command).", channel);
			return;
		}
		var last_tiers = sys.getFileContent("tiers (last).xml");
		if (last_tiers === undefined){
			commanderror(src, "Sorry, there is no tiers to revert to.", channel);
			return;
		}
		sys.writeToFile("tiers (last).xml", sys.getFileContent("tiers.xml"));
		sys.writeToFile("tiers.xml", last_tiers);
		sys.reloadTiers();
		if (global.auth !== undefined){
			auth.echo("owner", "The server's tiers have been rerverted by " + sys.name(src) + "!" , -1);
		}
	}
	,
	nametiers: function(src, channel, command){
		if (sys.auth(src) < 3){
			commanderror(src, "Sorry, you do not have permission to use the install tiers command (owner command).", channel);
			return;
		}
		if (/[^A-z]/gi.test(command[1])){
			commanderror(src, "Sorry, you can only name your tiers file with characters from A-z.", channel);
			return;
		}
		if (tiers.options.name === command[1]){
			commanderror(src, "The tiers filename is already " + tiers.options.name + ".", channel);
			return;
		}
		tiers.options.name = command[1];
		sys.writeToFile("script_tiersoptions.json", JSON.stringify(tiers.options));
		if (global.auth !== undefined){
			auth.echo("owner", "The server's tiers filename has been changed to " + tiers.options.name + " by " + sys.name(src) + "." , -1);
		}
	}
	,
	autiers: function(src, channel, command){
		if (sys.auth(src) < 3){
			commanderror(src, "Sorry, you do not have permission to use the install tiers command (owner command).", channel);
			return;
		}
		if (tiers.links[command[1].toUpperCase()] === undefined){
			commanderror(src, command[1].toUpperCase() + " does not exist as a tiers key.", channel);
			return;
		}
		if (tiers.options.autoupdate === command[1].toUpperCase()){
			commanderror(src, "The tiers to auto-update is already set as " + tiers.options.autoupdate + ".", channel);
			return;
		}
		tiers.options.autoupdate = command[1].toUpperCase();
		sys.writeToFile("script_tiersoptions.json", JSON.stringify(tiers.options));
		if (global.auth !== undefined){
			auth.echo("owner", "The server's tiers to auto-update has been changed to " + tiers.options.autoupdate + " by " + sys.name(src) + "." , -1);
		}
	}
}