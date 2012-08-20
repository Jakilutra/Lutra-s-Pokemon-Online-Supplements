/* Loading Auth Object and Settings */
auth = {};
set(construction.source, "authoptions", "auth", "options");
set(construction.source, "authmembers", "auth", "members");

/* Creating PMs Object */

/* pm object will contain purely a name and an array of from,recipients,messages to that name.
Upon login, a person's pms will be shown and thus deleted from this object*/
if (auth.pms === undefined){
	auth.pms = {};
}

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
			sys.sendHtmlMessage(to, display, channel);
	}
	else {
			sys.sendHtmlMessage(to, display);
	}
}

/* Finding correct group*/
auth.groupName=function(name){
	var authLevel=sys.dbAuth(name);
	return {3:"owner",2:"admin",1:"mod",0:"user"}[authLevel]
}

/* Auth Commands */
auth.commands = {
	authcommands: function (src, channel, command) {
		var osymbol = auth.options["owner"].image,
			msymbol = auth.options["mod"].image,
			usymbol = auth.options["user"].image;
		var display = typecommands 
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/echo</font><font color='darkred'> authgroup</font><font color='darkblue'>*message</font><font color='darkviolet'>*channel</font></b>: displays <b>message</b> with the announcement background of <b>authgroup</b> - in <b>channel</b> if a name of a channel is specified. </td></tr>" 
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/authranks</font></b>: displays the auth groups and symbols.</td></tr>";
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
		if(command.length <3){
			commanderror(src, "PM command is used with the following Arguments: TO*MESSAGE*CC1*CC2...",channel);
			return;
		}
		var sendTo=[command[1]];
		if(command.length>3){
			sentTo=sentTo.concat(command.slice(3));
		}
		var message = command[2];
		//ability to make maxmessagelength here
		var failure=[]
		for(var i=0;i<sendTo.length;i++){
			//user doesn't exist
			if(members[sendTo[i].toLowerCase()] === undefined){
				failure.push(sendTo[i]);
			}
			//user is offline
			else if(sys.id(sendTo[i])===undefined){
				if(auth.pms[sendTo[i]]!=undefined){
					//potentially check for max mailbox size
					auth.pms[sendTo[i].toLowerCase()].push({
						"from":sys.name(src),
						"message":message,
						"recipients":sendTo
					})
				}
				else{
					auth.pms[sendTo[i].toLowerCase()]=[{
						"from":sys.name(src),
						"message":message,
						"recipients":sendTo
					}];
				}
			}
			//user is online
			else{
				auth.pm(auth.groupName(sys.name(src)),message,sys.name(src),command[1],sendTo,channel)
			}
		}
		if(failure.length !==0){
			sys.sendHtmlMessage(src,"The message failed to send to the following users: "+failure.join()+".  Please check the spelling of all of the names",channel);
		}
	}
}


append("afterLogIn",
"\t\tvar lowerName=sys.name(src).toLowerCase() " +
"\r\t\tif(auth.pms[lowerName]!=undefined){"+
"\r\t\t\tfor(var i=0;i<auth.pms[lowerName].length;i++){"+
"\r\t\t\t\tauth.pm(auth.groupName(auth.pms[lowerName][\"from\"]),auth.pms[lowerName][\"message\"],auth.pms[lowerName][\"from\"],sys.name(src),auth.pms[lowerName][\"recipients\"]);"+
"\r\t\t\t}"+
"\r\t\t\tdelete auth.pms[lowerName]"+
"\r\t\t\t}")