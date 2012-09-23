/* Loading Create Object and Settings */
create = {};
set(construction.source, "createoptions", "create", "options");
set(construction.source, "displaycmds", "create", "display_cmds");
set(construction.source, "shortcuts", "create", "shortcuts");
set(construction.source, "spotlightcmds", "create", "spotlight_cmds");

/* Create Announcement Function */
create.echo = function (text, channel) {
	var display = "<timestamp/><table width='100%' style='background-color:qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0.1 crimson, stop:0.5 sienna); color:white;'><tr><td><center><b><big>" + text + "</big></b><small> - Create Announcement </small></center></td></tr></table>";
	if (channel > -1) {
		sys.sendHtmlAll(display, channel);
	}
	else {
		sys.sendHtmlAll(display);
	}
}

/* Auto-Update Create Settings */
create.updatejsons = function () {
	if (create.options.autoupdatesettings === "1" || create.options.autoupdatesettings === "2" || create.options.autoupdatesettings === "11" || create.options.autoupdatesettings === "12" || create.options.autoupdatesettings === "13" || create.options.autoupdatesettings === "39" || create.options.autoupdatesettings === "40" || create.options.autoupdatesettings === "45") {
		sys.webCall(construction.source + "script_createoptions.json", "downloadjson('" + construction.source + "', 'createoptions', 'create', 'options');");
		updatedjsons.push("createoptions");
	}
	if (create.options.autoupdatesettings === "1" || create.options.autoupdatesettings === "3" || create.options.autoupdatesettings === "11" || create.options.autoupdatesettings === "18" || create.options.autoupdatesettings === "19" || create.options.autoupdatesettings === "39" || create.options.autoupdatesettings === "40" || create.options.autoupdatesettings === "60") {
		sys.webCall(construction.source + "script_displaycmds.json", "downloadjson('" + construction.source + "', 'displaycmds', 'create', 'display_cmds');");
		updatedjsons.push("displaycmds");
	}
	if (create.options.autoupdatesettings === "1" || create.options.autoupdatesettings === "4" || create.options.autoupdatesettings === "12" || create.options.autoupdatesettings === "18" || create.options.autoupdatesettings === "24" || create.options.autoupdatesettings === "39" || create.options.autoupdatesettings === "45" || create.options.autoupdatesettings === "60") {
		sys.webCall(construction.source + "script_shortcuts.json", "downloadjson('" + construction.source + "', 'shortcuts', 'create', 'shortcuts');");
		updatedjsons.push("shortcuts");
	}
	if (create.options.autoupdatesettings === "1" || create.options.autoupdatesettings === "5" || create.options.autoupdatesettings === "13" || create.options.autoupdatesettings === "19" || create.options.autoupdatesettings === "24" || create.options.autoupdatesettings === "40" || create.options.autoupdatesettings === "45" || create.options.autoupdatesettings === "60") {
		sys.webCall(construction.source + "script_spotlightcmds.json", "downloadjson('" + construction.source + "', 'spotlightcmds', 'create', 'spotlight_cmds');");
		updatedjsons.push("spotlightcmds");
	}
}
if (create.options !== undefined){
	create.updatejsons();
}

create.commands = {
	createcommands: function (src, channel, command) {
		var osymbol = "", asymbol = "", msymbol = "", usymbol = "", srcname = sys.name(src), color = namecolor(src);
		if (global.auth !== undefined){
			osymbol = auth.options["owner"].image;
			asymbol = auth.options["admin"].image;
			msymbol = auth.options["mod"].image;
			usymbol = auth.options["user"].image;
		}
		var display = typecommands
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/aucreatesettings</font><font color='darkred'> value</font></b>: if <b>value</b> is 0,1,2,3,4,5 - auto-updates: no settings, all settings, only createoptions, only displaycmds, only shortcuts, only spotlightcmds respectively. If <b>value</b> is 11,12,13,18,19 or 24 - auto-updates the combination of 2 jsons. If <b>value</b> is 39,40,45 or 60 - auto-updates the combination of 3 jsons. </td></tr>" 
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/ucreatesettings</font></b>: updates the create settings according to the auto-update create setting. </td></tr>" 
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/writedpcmd</font><font color='darkred'> name</font><font color='darkblue'>*content</font></b>: creates/overwrites a display command called <b>name</b> containing <b>content</b>. <b>content</b> is html.</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/deletedpcmd</font><font color='darkred'> name</font></b>: deletes a display command called <b>name</b>.</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/cleardpcmds</font></b>: deletes all display commands.</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/writeshortcut</font><font color='darkred'> shortcut</font><font color='darkblue'>*message</font></b>: creates/overwrites a shortcut called !<b>shortcut</b> that translates to <b>message</b> (which is never displayed in the main chat).</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/deleteshortcut</font><font color='darkred'> shortcut</font></b>: deletes a shortcut called !<b>shortcut</b>.</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/clearshortcuts</font></b>: deletes all shortcuts.</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/addspotcmd</font><font color='darkred'> command1*command2...*commandN</font></b>: adds <b>command1,command2...commandN</b> (1-N) to spotlight commands.</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/deletespotcmd</font><font color='darkred'> command</font></b>: removes a spotlight command called <b>command</b>.</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/clearspotcmds</font></b>: deletes all spotlight commands.</td></tr>"
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/acrecho</font><font color='darkred'> status</font></b>: turns announcing by create echo <b>status</b>. <b>status</b> is either on or off.</td></tr>" 
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/crecho</font><font color='darkred'> message</font><font color='darkblue'>*channel</font></b>: displays <b>message</b> with the create echo announcement - in <b>channel</b> if a name of a channel is specified. </td></tr>"
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/cmdslist</font></b>: displays a full list of commands.</td></tr>"
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/createsettings</font></b>: displays the create settings. </td></tr>";
		commanddisplay(src, "Create Commands", display, channel);
	},
	writedpcmd: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to write a display command (owner command).", channel);
			return;
		}
		if (command[1] === "undefined" || command[2] == undefined) {
			commanderror(src, "The writedpcmd command is used with the following arguments: name*content, e.g. \"/writedpcmd rules*There are no rules!\"", channel);
			return;
		}
		var commandname = command[1].toLowerCase();
		if (/\W/.test(commandname)){
			commanderror(src, "Sorry, you are unable to create the display command because it contains characters other than A-z, 0-9 and _.", channel);
			return;
		}
		create.display_cmds[commandname] = command[2];
		sys.writeToFile("script_displaycmds.json", JSON.stringify(create.display_cmds));
		create.commands[commandname] = new Function('src', 'channel', 'command', 'commanddisplay(src, "' + command[1].replace(/[a-z]/, String(/[a-z]/.exec(command[1])).toUpperCase()) + '", "<tr><td>' + command[2] + '</tr></td>" , channel);');
		var srcname = sys.name(src);
		if (global.auth !== undefined && create.options.echo === "off"){
			auth.echo("owner", "The " + command[1] + "  display command has been written by " + srcname + "!");
		}
		else {
			create.echo("The " + command[1] + "  display command has been written by " + srcname + "!");
		}
	},
	deletedpcmd: function (src, channel, command){
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to delete a display command (owner command).", channel);
			return;
		}
		var commandname = command[1].toLowerCase();
		if (create.display_cmds[commandname] === undefined){
			commanderror(src, "Sorry, " + command[1] + " is not a display command.", channel);
			return;
		}
		delete create.commands[commandname];
		delete create.display_cmds[commandname];
		sys.writeToFile("script_displaycmds.json", JSON.stringify(create.display_cmds));
		var srcname = sys.name(src);
		if (global.auth !== undefined && create.options.echo === "off"){
			auth.echo("owner", "The " + command[1] + "  display command has been deleted by " + srcname + ".");
		}
		else {
			create.echo("The " + command[1] + "  display command has been deleted by " + srcname + ".");
		}
	},
	cleardpcmds: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to clear the display commands (owner command).", channel);
			return;
		}
		var index;
		for (index in create.display_cmds){
			delete create.commands[index];
		}
		create.display_cmds = {};
		sys.writeToFile("script_displaycmds.json", JSON.stringify(create.display_cmds));
		var srcname = sys.name(src);
		if (global.auth !== undefined && create.options.echo === "off") {
			auth.echo("owner", "All  display commands have been deleted by " + srcname + ".");
		}
		else {
			create.echo("All  display commands have been deleted by " + srcname + ".");
		}
	},
	writeshortcut: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the write shortcut command (owner command).", channel);
			return;
		}
		if (command[1] === "undefined" || command[2] == undefined) {
			commanderror(src, "The write shortcut command is used with the following arguments: shortcut*message, e.g. \"/writeshortcut k*/kick\"", channel);
			return;
		}
		var shortcut = "!" + command[1].toLowerCase(), message = command.slice(2).join("*").toLowerCase();
		create.shortcuts[shortcut] = message;
		sys.writeToFile("script_shortcuts.json", JSON.stringify(create.shortcuts));
		var srcname = sys.name(src);
		if (global.auth !== undefined && create.options.echo === "off") {
			auth.echo("owner", "The " + shortcut + "  shortcut has been created for " + message + " by " + srcname + "!");
		}
		else {
			create.echo("The " + shortcut + "  shortcut has been created for " + message + " by " + srcname + "!");
		}
	},
	deleteshortcut: function (src, channel, command){
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the delete shortcut command(owner command).", channel);
			return;
		}
		var shortcut = "!" + command[1].toLowerCase();
		if (create.shortcuts[shortcut] === undefined){
			commanderror(src, "Sorry, " + shortcut + " is not a shortcut.", channel);
			return;
		}
		delete create.shortcuts[shortcut];
		sys.writeToFile("script_shortcuts.json", JSON.stringify(create.shortcuts));
		var srcname = sys.name(src);
		if (global.auth !== undefined && create.options.echo === "off"){
			auth.echo("owner", "The " + command[1] + "  shortcut has been deleted by " + srcname + ".");
		}
		else {
			create.echo("The " + command[1] + "  shortcut has been deleted by " + srcname + ".");
		}
	},
	clearshortcuts: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to clear the shortcuts (owner command).", channel);
			return;
		}
		create.shortcuts = {};
		sys.writeToFile("script_shortcuts.json", JSON.stringify(create.shortcuts));
		var srcname = sys.name(src);
		if (global.auth !== undefined && create.options.echo === "off") {
			auth.echo("owner", "All  shortcuts have been deleted by " + srcname + ".");
		}
		else {
			create.echo("All  shortcuts have been deleted by " + srcname + ".");
		}
	},
	addspotcmd: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to add a spot light command (owner command).", channel);
			return;
		}
		if (command.length < 2) {
			commanderror(src, "The addspotcmd command is used with the following arguments: command1*command2...*commandN, e.g. \"/addspotcmd /rules\" or \"/addspotcmd /rules*/auth\"", channel);
			return;
		}
		var index, failure = [], already = [], success = [];
		for (index in command) {
			if (index === "0") {
				continue;
			}
			if (command[index][0] !== "!" && command[index][0] !== "/") {
				failure.push(command[index]);
				continue;
			}
			if (create.spotlight_cmds.indexOf(command[index]) !== -1){
				already.push(command[index]);
				continue;
			}
			success.push(command[index]);
			create.spotlight_cmds.push(command[index].toLowerCase());
		}
		sys.writeToFile("script_spotlightcmds.json", JSON.stringify(create.spotlight_cmds));
		if (success.length > 0){
			var srcname = sys.name(src);
			if (global.auth !== undefined && create.options.echo === "off") {
				auth.echo("owner", "The following commands have been added to the spotlight commands:" + String(success).replace(/,/gi, ", ") + " by " + srcname);
			}
			else {
				create.echo("The following commands have been added to the spotlight commands:" + String(success).replace(/,/gi, ", ") + " by " + srcname);
			}
		}
		if (failure.length > 0){
			commanderror(src, "The following input failed because they did not begin with \"!\" (a shortcut) or \"/\" (a command): " + String(failure).replace(/,/gi, ", "), channel);
		}
		if (already.length > 0){
			commanderror(src, "The following inputted commands failed because they were already spotlight commands: " + String(already).replace(/,/gi, ", "), channel);
		}
	},
	deletespotcmd: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to delete a spot light command (owner command).", channel);
			return;
		}
		var spotcmd = create.spotlight_cmds.indexOf(command[1].toLowerCase());
		if (spotcmd === -1){
			commanderror(src, "Sorry, " + command[1] + " is not a spotlight command.", channel);
			return;
		}
		create.spotlight_cmds.splice(spotcmd, 1);
		sys.writeToFile("script_spotlightcmds.json", JSON.stringify(create.spotlight_cmds));
		var srcname = sys.name(src);
		if (global.auth !== undefined && create.options.echo === "off"){
			auth.echo("owner", command[1] + " has been deleted from the spotlight commands by " + srcname + ".");
		}
		else {
			create.echo(command[1] + " has been deleted from the spotlight commands by " + srcname + ".");
		}
	},
	clearspotcmds: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to clear the spotlight commands (owner command).", channel);
			return;
		}
		create.spotlight_cmds = [];
		sys.writeToFile("script_spotlightcmds.json", JSON.stringify(create.spotlight_cmds));
		var srcname = sys.name(src);
		if (global.auth !== undefined && create.options.echo === "off") {
			auth.echo("owner", "All  spotlight commands have been deleted by " + srcname + ".");
		}
		else {
			create.echo("All  spotlight commands have been deleted by " + srcname + ".");
		}
	},
	cmdslist: function (src, channel, command) {
		var cmdslist = "", index, total = 0, temptotal, cmds = ["global"].concat(construction.units);
		for (index in cmds){
			temptotal = Object.keys(global[cmds[index]].commands).length;
			cmdslist += "<tr><td><small><b>" + cmds[index] + ".commands: </b>"  + String(Object.keys(global[cmds[index]].commands)).replace(/,/g, ", ") + " (total: " + temptotal + ")</small></td></tr>";
			total+= temptotal;
		}
		var display = "<tr><td><b> Commands: </b>" + "</td></tr>"
		+ cmdslist
		+ "<tr><td><b>Grand Total: </b>" + total + "</td></tr>";
		commanddisplay(src, "Commands List", display, channel);
	},
	createsettings: function (src, channel, command) {
		var display = "<tr><td><b> Create Echo: </b>" + create.options.echo + "</td></tr>"
		+ "<tr><td><b> Auto-Update Settings: </b>" + create.options.autoupdatesettings + "</td></tr>"
		+ "<tr><td><b> Display Commands: </b>" + String(Object.keys(create.display_cmds)).replace(/,/g, ", ") + "</td></tr>"
		+ "<tr><td><b> Shortcuts: </b>" + String(Object.keys(create.shortcuts)).replace(/,/g, ", ") + "</td></tr>"
		+ "<tr><td><b> Spotlight Commands: </b>" + String(create.spotlight_cmds).replace(/,/g, ", ") + "</td></tr>";
		commanddisplay(src, "Create Settings", display, channel);
	},
	crecho: function(src, channel, command){
		if (sys.auth(src) < 1) {
			commanderror(src, "Sorry, you do not have permission to use the create echo command (mod command).", channel);
			return;
		}
		var channelid = sys.channelId(command[command.length - 1]);
		sys.sendAll(sys.name(src) + ":", channelid);
		command.splice(0, 1);
		if (channelid !== undefined && command.length > 1) {
			command.splice(command.length - 1, 1);
		}
		command = command.join("*");
		create.echo(command, channelid);
	},
	acrecho: function(src, channel, command){
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the auto create echo command (owner command).", channel);
			return;
		}
		var arg = command[1].toLowerCase(), srcname = sys.name(src);
		if (arg !== "on" && arg !== "off") {
			commanderror(src, "Sorry, you are required to specify on or off.", channel);
			return;
		}
		if (arg === "on") {
			if (create.options.echo === "on") {
				commanderror(src, "Sorry, announcing by create echo is already turned on.", channel);
				return;
			}
			create.options.echo = "on";
			sys.writeToFile("script_createoptions.json", JSON.stringify(create.options));
			create.echo("Announcing by create echo has been turned on by " + srcname + "!", -1);
			return;
		}
		if (create.options.echo === "off") {
			commanderror(src, "Sorry, announcing by create echo is already turned off.", channel);
			return;
		}
		create.options.echo = "off";
		sys.writeToFile("script_createoptions.json", JSON.stringify(create.options));
		if (global.auth !== undefined) {
			auth.echo("owner", "Announcing by create echo has been turned off by " + srcname + "!", -1);
		}
	},
	ucreatesettings: function (src, channel, command){
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the update create settings command (owner command).", channel);
			return;
		}
		if (create.options.autoupdatesettings === "0"){
			commanderror(src, "Sorry, you could not update any settings because auto-update settings is set to 0.", channel);
			return;
		}
		create.updatejsons();
		if (global.auth !== undefined && create.options.echo === "off") {
			auth.echo("owner", "The create settings have been updated by " + sys.name(src) + "!", -1);
		}
		else {
			create.echo("The create settings have been updated by " + sys.name(src) + "!", -1);
		}
	},
	aucreatesettings: function (src, channel, command){
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the auto-update create settings command (owner command).", channel);
			return;
		}
		if (command[1] != "0" && command[1] != "1" && command[1] != "2" && command[1] != "3" && command[1] != "4" && command[1] != "5" && command[1] != "11" && command[1] != "12" && command[1] != "13" && command[1] != "18" && command[1] != "19" && command[1] != "24" && command[1] != "39" && command[1] != "40" && command[1] != "45" && command[1] != "60") {
			commanderror(src, "Sorry, you must specify either 0, 1, 2, 3, 4, 5, 11, 12, 13, 18, 19, 24, 39, 40, 45 or 60 for the auto-update create settings command.", channel);
			return;
		}
		if (command[1] === create.options.autoupdatesettings) {
			commanderror(src, "The create auto-update settings is already set to " + command[1] + ".", channel);
			return;
		}
		create.options.autoupdatesettings = command[1];
		sys.writeToFile("script_createoptions.json", JSON.stringify(create.options));
		if (global.auth !== undefined && create.options.echo === "off") {
			auth.echo("owner", "The create auto-update settings has been changed to " + command[1] + " by " + sys.name(src) + "!", -1);
		}
		else {
			create.echo("The create auto-update settings has been changed to " + command[1] + " by " + sys.name(src) + "!", -1)
		}
	}
}

/* Creating Display Commands */
create.addcommands = function () {
	var index;
	for (index in create.display_cmds) {
		create.commands[index] = new Function('src', 'channel', 'command', 'commanddisplay(src, "' + index.replace(/[a-z]/, String(/[a-z]/.exec(index)).toUpperCase()) + '", "<tr><td>' + create.display_cmds[index] + '</tr></td>" , channel);');
	}
}
create.addcommands();

/* Shortcut Check */
var shortcut_check = "\u000A"
+ "\tif (message[0] === \"!\" && /\\w/g.test(message)){\u000A"
+ "\t\tvar index;\u000A"
+ "\t\tsys.stopEvent();\u000A"
+ "\t\tcommanddisplay(src, \"Shortcut Message\", \"<tr><td>\" + message + \"</td></tr>\", channel);\u000A"
+ "\t\tfor (index in create.shortcuts){\u000A"
+ "\t\t\tmessage = message.replace(index, create.shortcuts[index]);\u000A"
+ "\t\t}\u000A"
+ "\t}";
prepend("beforeChatMessage", shortcut_check);

/* Displaying Spotlight Commands */
var display_spotlight_cmds = "\u000A"
+ "\tif (create.spotlight_cmds.length > 0){\u000A"
+ "\t\t sys.sendHtmlMessage(src, \"<table width='100%' style='background-color:qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0.1 crimson stop:0.5 sienna); color: white;'><tr><th>Personal Message</th></tr><tr><td><center><b><big> Spotlight Commands: \" + String(create.spotlight_cmds).replace(/,/gi, \"&nbsp;&nbsp;&nbsp;\") + \"</big></b></center></td></tr></table>\");\u000A"
+ "\t}";
append("afterLogIn", display_spotlight_cmds);