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
		var osymbol = auth === undefined ? "" : auth.options["owner"].image;
		var display = typecommands
		+ "<tr><td><center>" + osymbol + "<b><font color='darkgreen'>/installtiers</font><font color='red'> tierskey</font></b>: installs tiers from the URL address of <b>tierskey</b>. </center></td></tr>";
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
}