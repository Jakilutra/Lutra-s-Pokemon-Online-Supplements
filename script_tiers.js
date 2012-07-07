tiers = {};
set(construction.source, "tiersoptions", "tiers", "options");
set(construction.source, "tierslinks", "tiers", "links");
tiers.install = function(user, key){
	sys.writeToFile("tiers (last).xml", sys.getFileContent("tiers.xml"));
	if (global.auth !== undefined){
		if (user != "~~Server~~"){
			auth.echo("owner", key + " tiers have been installed as the server's tiers by " + user + "!" , -1);
		}
		else {
			auth.echo("server", key + " tiers have been installed as the server's tiers!", -1);
		}
	}
	sys.webCall(tiers.links[key], "if (/category/gi.test(resp)){sys.writeToFile('tiers.xml', resp); sys.reloadTiers()}");	
}
if (tiers.links[tiers.options["autoupdate"]] != undefined){
	tiers.install("~~Server~~", tiers.options["autoupdate"]);
	print(tiers.options["autoupdate"] + " tiers have been installed.");
}