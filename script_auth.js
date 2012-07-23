/* Loading Auth Object and Settings */
auth = {};
set(construction.source, "authoptions", "auth", "options");
set(construction.source, "authmembers", "auth", "members");

/* Auth-based Announcement Function */
auth.echo = function (group, text, channel) {
	var display = "<timestamp/><table width='100%' style='background-color:qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0.1 " + auth.options[group].minorcolor + ", stop:0.5 " + auth.options[group].majorcolor + "); color:" + auth.options[group].textcolor + ";'><tr><td><center><b><big>" + text + "</big></b></center></td></tr></table>";
	if (channel > -1) {
		sys.sendHtmlAll(display, channel);
	}
	else {
		sys.sendHtmlAll(display);
	}
}

/* Main Chat PM Function */
auth.pm = function (group, text, from, to, recipients, channel) {
	var display = "<timestamp/><table width='100%' style='background-color:qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0.1 " + auth.options[group].minorcolor + ", stop:0.5 " + auth.options[group].majorcolor + "); color:" + auth.options[group].textcolor + ";'><tr><th>Personal Message from <i>" + from + "</i> to <i>" + to + "</i>&nbsp;&nbsp;&nbsp;Sent to: <i>" + String(recipients).replace(/,/gi, ", ") + "</i></th></tr><tr><td><center><b><big>" + text + "</big></b></center></td></tr></table>";
	var index;
	if (channel > -1) {
		for (index in recipients) {
			sys.sendHtmlMessage(sys.id(recipients[index]), display, channel);
		}
	}
	else {
		for (index in recipients) {
			sys.sendHtmlMessage(sys.id(recipients[index]), display);
		}
	}
}

/* Auth Commands */
auth.commands = {
	authcommands: function (src, channel, command) {
		var osymbol = auth.options["owner"].image,
			msymbol = auth.options["mod"].image,
			usymbol = auth.options["user"].image;
		var display = typecommands 
		+ "<tr><td><center>" + msymbol + "<b><font color='darkgreen'>/echo</font><font color='darkred'> authgroup</font><font color='darkblue'>*message</font><font color='darkviolet'>*channel</font></b>: displays <b>message</b> with the announcement background of <b>authgroup</b> - in <b>channel</b> if a name of a channel is specified. </center></td></tr>" 
		+ "<tr><td><center>" + usymbol + "<b><font color='darkgreen'>/authranks</font></b>: displays the auth groups and symbols.</center></td></tr>";
		commanddisplay(src, "Auth Commands", display, channel);
	},
	authranks: function (src, channel, command) {
		var index, display = "<tr><td>";
		for (index in auth.options) {
			display += auth.options[index].image + "<b><font color='" + auth.options[index].majorcolor + "'>" + auth.options[index].name + "</b>&nbsp;&nbsp;";
		}
		display += "</td></tr></table";
		commanddisplay(src, "Auth Ranks", display, channel);
	},
	echo: function (src, channel, command) {
		if (sys.auth(src) < 1) {
			commanderror(src, "Sorry, you do not have permission to use the echo command (mod command).", channel);
			return;
		}
		var index, authgroup, name, authnames = [];
		for (index in auth.options) {
			name = auth.options[index].name.toLowerCase();
			authnames.push(name);
			if (name === command[1].toLowerCase() || removespaces(name) === command[1].toLowerCase()) {
				authgroup = index;
				break;
			}
		}
		if (command[1] === "undefined") {
			commanderror(src, "Sorry, the echo command did not execute as no auth group argument was specified. The following are auth group arguments: " + String(authnames).replace(/,/gi, ", ") + ".<br/> E.G. \"/echo owner*hello\"", channel);
			return;
		}
		if (authgroup === undefined) {
			commanderror(src, "Sorry, the echo command did not execute as no valid auth group argument was specified. The following are auth group arguments: " + String(authnames).replace(/,/gi, ", ") + ".<br/> E.G. \"/echo owner*hello\"", channel);
			return;
		}
		sys.sendAll(sys.name(src) + ":");
		var channelid = sys.channelId(command[command.length - 1]);
		command.splice(0, 2);
		if (channelid !== undefined) {
			command.splice(command.length - 1, 1);
		}
		command = command.join("*");
		auth.echo(authgroup, command, channelid);
	},
	pm: function (src, channel, command) {
		auth.pm(command[1], command[2], sys.name(src), command[3], [sys.name(src), command[3]], command[4]);
	}
}