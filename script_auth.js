auth = {};
set(construction.source, "authoptions", "auth", "options");
set(construction.source, "authmembers", "auth", "members");
auth.echo = function(group, text, channel){
	var display = auth.options === undefined ? "<timestamp/><b>" + text + "</b>" : "<timestamp/><table width='100%' style='background-color:qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0.1 " + auth.options[group].minorcolor + ", stop:0.5 " + auth.options[group].majorcolor + "); color:" + auth.options[group].textcolor + ";'><tr><td><center><b><big>" + text + "</big></b></center></td></tr></table>";
	if (channel > -1){
		sys.sendHtmlAll(display, channel);
	}
	else {
		sys.sendHtmlAll(display);
	}
}
auth.pm = function(group, text, from, to, recipients, channel){
	var display = auth.options === undefined ? "<timestamp/> from " + from + " to" + to + " Sent to: " + String(recipients).replace(/,/gi, ", ") + "<br/><b>" + text + "</b>" : "<timestamp/><table width='100%' style='background-color:qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0.1 " + auth.options[group].minorcolor + ", stop:0.5 " + auth.options[group].majorcolor + "); color:" + auth.options[group].textcolor + ";'><tr><th>Personal Message from <i>" + from + "</i> to <i>" + to + "</i>&nbsp;&nbsp;&nbsp;Sent to: <i>" + String(recipients).replace(/,/gi, ", ") + "</i></th></tr><tr><td><center><b><big>" + text + "</big></b></center></td></tr></table>";
	var index;
	if (channel > -1){
		for (index in recipients){
			sys.sendHtmlMessage(sys.id(recipients[index]), display, channel);
		}
	}
	else {
		for (index in recipients){
			sys.sendHtmlMessage(sys.id(recipients[index]), display);
		}
	}
}
auth.commands = {
	echo: function(src, channel, command){
		if (sys.auth(src) < 3){
			commanderror(src, "Sorry, you do not have permission to use the echo command (owner command).", channel);
			return;
		}
		if (command[1] === "undefined"){
			commanderror(src, "Sorry, the echo command did not execute as no auth group argument was specified. The following are auth group arguments: " + String(Object.keys(auth.options)).replace(/,/gi, ", ") + ". E.G. \"/echo owner*hello\"", channel);
			return;
		}
		if (auth.options[command[1].toLowerCase()] === undefined){
			commanderror(src, "Sorry, the echo command did not execute as no valid auth group argument was specified. The following are auth group arguments: " + String(Object.keys(auth.options)).replace(/,/gi, ", ") + ". E.G. \"/echo owner*hello\"", channel);
			return;
		}
		auth.echo(command[1].toLowerCase(), command[2], command[3]);
	}
	
	,
	
	pm: function(src, channel, command){
		auth.pm(command[1], command[2], sys.name(src), command[3], [sys.name(src), command[3]], command[4]);
	}
}