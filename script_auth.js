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
auth.pm = function (group, text, from, to, date, receiver, channel) {
	var sentago = new Date() - date;
	sentago = Math.floor(sentago/1000) === 0 ? " (sent just now) ": " (sent " + converttime(sentago) + " ago) "
	var display = "<ping/><timestamp/><table width='100%' style='background-color:qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0.1 " + auth.options[group].minorcolor + ", stop:0.5 " + auth.options[group].majorcolor + "); color:" + auth.options[group].textcolor + ";'><tr><th>Personal Message from <i>" + from + "</i> to <i>" + String(to).replace(/,/gi, ", ") + "</i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date: <small>" + date + sentago + "</small></th></tr><tr><td><center><b><big>" + text + "</big></b></center></td></tr></table>";
	var index;
	if (channel > -1) {
			sys.sendHtmlMessage(sys.id(receiver), display, channel);
	}
	else {
			sys.sendHtmlMessage(sys.id(receiver), display);
	}
}

/* Finding correct auth group*/
auth.groupName=function(name){
	var authLevel=sys.dbAuth(name);
	return (["user", "mod", "admin", "owner"][authLevel] || "user");
}

/* Finding auth level of server authgroup */
auth.level= function (group) {
	return ({"owner":3,"admin":2,"mod":1, "user":0}[group] || 0);
}

/* Function that returns a list of auth from a server auth level */
auth.array = function (value){
	var autharray = new Array(), index, authdb = sys.dbAuths();
	for (index in authdb){
		if(sys.dbAuth(authdb[index]) == value){
			autharray.push(members[authdb[index]]);
		}
	}
	return autharray;
}

/* Finding auth group equivalents of a deauthgroup */
auth.reverse = function(group){
	return{
	"owner": ["admin", "mod"],
	"admin": ["owner", "mod"],
	"mod": ["owner", "admin"],
	"user": ["owner", "admin", "mod"],
	"battleplayer": ["battleadmin"],
	"battlespectator": ["battleadmin"],
	"touruser": ["touradmin"],
	"gameuser": ["gameadmin"],
	"chanowner": ["chanadmin", "chanmod"],
	"chanadmin": ["chanowner", "chanmod"],
	"chanmod": ["chanowner", "chanadmin"],
	"chanuser": ["chanowner", "chanadmin", "chanmod"],
	"chantouruser": ["chantouradmin"],
	"changameuser": ["changameadmin"],
	"groupowner": ["groupadmin", "groupmod"],
	"groupadmin": ["groupowner", "groupmod"],
	"groupmod": ["groupowner", "groupadmin"],
	"groupuser": ["groupowner", "groupadmin", "groupmod"]
	}[group] || [];
}

/* Gives auth to owners, admins, mods - writes any owners, admins, mods to file that aren't already */
auth.giveAuth = function() {
	var serverauth = sys.dbAuths(), writtenauth = {"mod":auth.members.mod.perm, "admin":auth.members.admin.perm, "owner":auth.members.owner.perm}, autharray, i, j,k;
	for (i in serverauth){
		if (sys.dbAuth(serverauth[i]) < 4 && sys.dbAuth(serverauth[i]) > -1){
			if (auth.members[auth.groupName(serverauth[i])].perm.indexOf(serverauth[i]) === -1){
				auth.members[auth.groupName(serverauth[i])].perm.push(serverauth[i]);
			}
		}
	}
	sys.writeToFile("script_authmembers.json", JSON.stringify(auth.members));
	for (j in writtenauth){
		autharray = writtenauth[j];
		for (k in autharray){
			var id = sys.id(autharray[k]), name = autharray[k], authlevel = auth.level(j);
			if (sys.dbAuth(name) !== authlevel){
				if (id === undefined){
					sys.changeDbAuth(name, authlevel);
				}
				else {
					sys.changeAuth(id, authlevel);
				}
			}
		}
	}
}
if (auth.members !== undefined){
	auth.giveAuth();
}

/* Auth Commands */
auth.commands = {
	authcommands: function (src, channel, command) {
		var osymbol = auth.options["owner"].image,
			asymbol = auth.options["admin"].image,
			msymbol = auth.options["mod"].image,
			usymbol = auth.options["user"].image;
		var display = typecommands
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/a</font><font color='darkred'> authgroup</font><font color='darkblue'>*name</font></b>: puts <b>name</b> into <b>authgroup</b> (auths them globally with permanent auth).</td></tr>"
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/echo</font><font color='darkred'> authgroup</font><font color='darkblue'>*message</font><font color='darkviolet'>*channel</font></b>: displays <b>message</b> with the announcement background of <b>authgroup</b> - in <b>channel</b> if a name of a channel is specified. </td></tr>"
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/pm</font><font color='darkred'> to1*to2...*toN</font><font color='darkblue'>:message</font></b>: messages <b>to1,to2..toN</b> (players from 1 to N) through the server with <b>message</b>.</td></tr>"
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/authranks</font></b>: displays the auth groups and symbols.</td></tr>"
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/auths</font></b>: displays a list of server auth.</td></tr>";
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
		var channelid = sys.channelId(command[command.length - 1]);
		sys.sendAll(sys.name(src) + ":", channelid);
		command.splice(0, 2);
		if (channelid !== undefined) {
			command.splice(command.length - 1, 1);
		}
		command = command.join("*");
		auth.echo(authgroup, command, channelid);
	},
	pm: function (src, channel, command) {
		if(command[command.length-1].indexOf(":") === -1){
			commanderror(src, "PM command is used with the following Arguments: to1*to2...*toN:MESSAGE, e.g. \"/pm Lutra:hi\" or \"/pm Lutra*Swimming95:hi\"",channel);
			return;
		}
		var message = command[command.length-1].split(":").slice(1).join(":"); // this makes it possible to do /pm Swimming95*Lutra:This is a test if I want to list: 1,2,3
		var sendTo=command.slice(1,command.length-1);
		sendTo.push(command[command.length-1].split(":")[0]);
		//ability to make maxmessagelength here
		var failure=[], success = [];
		for(var i=0;i<sendTo.length;i++){
			//user doesn't exist
			if(members[sendTo[i].toLowerCase()] === undefined){
				failure.push(sendTo[i]);
			}
			else {
				success.push(members[sendTo[i].toLowerCase()]);
			}
		}
		for(var j=0;j<success.length;j++){
			//user is offline
			if(sys.id(success[j])=== undefined || !sys.isInChannel(sys.id(success[j]), channel)){
				if(auth.pms[success[j].toLowerCase()]!== undefined){
					//potentially check for max mailbox size
					auth.pms[success[j].toLowerCase()].push({
						"from":sys.name(src),
						"message":message,
						"recipients":success,
						"date": new Date()
					})
				}
				else{
					auth.pms[success[j].toLowerCase()]=[{
						"from":sys.name(src),
						"message":message,
						"recipients":success,
						"date": new Date()
					}];
				}
			}
			//user is online
			else{
				auth.pm(auth.groupName(sys.name(src)), message, sys.name(src), success, new Date(),success[j], channel);
			}
		}
		auth.pm(auth.groupName(sys.name(src)),message,sys.name(src),success, new Date(), sys.name(src), channel);
		if(failure.length !==0){
			commanderror(src,"The message failed to send to the following users because they don't exist: "+failure.join()+".  Please check the spelling of all of the names.",channel);
		}
	},
	auths: function (src, channel, command){
		var owners = auth.array(3), admins = auth.array(2), mods = auth.array(1), authsize = owners.length + admins.length + mods.length, i, j, k;
		if (authsize === 0){
			commanderror(src, "Sorry, there is currently no server auth.", channel);
			return;
		}
		var display = "";
		if (owners.length > 0){
			display += "<tr><td><big><b><font color='" + auth.options["owner"].majorcolor + "'>" + auth.options["owner"].name + "s:</font></big></b></td></tr>";
			for (i in owners){
				display += "<tr><td>" + connectstatus(owners[i]) + "</td></tr>";
			}
			display += "<tr><td></td></tr>";
		}
		if (admins.length > 0){
			display += "<tr><td><big><b><font color='" + auth.options["admin"].majorcolor + "'>" + auth.options["admin"].name + "s:</font></big></b></td></tr>";
			for (i in admins){
				display += "<tr><td>" + connectstatus(admins[i]) + "</td></tr>";
			}
			display += "<tr><td></td></tr>";
		}
		if (mods.length > 0){
			display += "<tr><td><big><b><font color='" + auth.options["mod"].majorcolor + "'>" + auth.options["mod"].name + "s:</font></big></b></td></tr>";
			for (i in mods){
				display += "<tr><td>" + connectstatus(mods[i]) + "</td></tr>";
			}
			display += "<tr><td></td></tr>";
		}
		display += "<tr><td><b>Server Auth Total: </b>" + authsize + "</td></tr>";
		commanddisplay(src, "Server Auth", display, channel);
	},
	a: function (src, channel, command){
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the a command (owner command).", channel);
			return;
		}
		var index, globalauth = JSON.parse(JSON.stringify(auth.options)), authgroup, name, authnames = [];
		delete globalauth.server;
		for (index in globalauth) {
			if (index.substring(0,4) === "chan" || index.substring(0,5) === "group"){
				delete globalauth[index];
				continue;
			}
			name = globalauth[index].name.toLowerCase();
			authnames.push(name);
			if (name === command[1].toLowerCase() || removespaces(name) === command[1].toLowerCase()) {
				authgroup = index;
				break;
			}
		}
		if (command[1] === "undefined") {
			commanderror(src, "Sorry, the a command did not execute as no auth group argument was specified. The following are auth group arguments: " + String(authnames).replace(/,/gi, ", ") + ".<br/> E.G. \"/a owner*Lutra\"", channel);
			return;
		}
		if (authgroup === undefined) {
			commanderror(src, "Sorry, the a command did not execute as no valid auth group argument was specified. The following are auth group arguments: " + String(authnames).replace(/,/gi, ", ") + ".<br/> E.G. \"/a owner*Lutra\"", channel);
			return;
		}
		if (command[2] === undefined) {
			commanderror(src, "Sorry, the a command did not execute as no name argument was specified.<br/> E.G. \"/a owner*Lutra\"", channel);
			return;
		}
		var pname = command[2].toLowerCase();
		if (members[pname] === undefined && authgroup === "user"){
			commanderror(src, "Sorry, " + command[2] + " does not exist in the member database.", channel);
			return;
		}
		if (sys.dbAuth(pname) == auth.level(authgroup)){
			commanderror(src, members[pname] + " is already " + auth.options[authgroup].name + ".", channel);
			return;
		}
		var authable = false;
		if (auth.members[authgroup] !== undefined){
			if (members[pname] === undefined){
				commanderror(src, "Sorry, " + command[2] + " does not exist in the member database.", channel);
				return;
			}
			if (auth.members[authgroup].perm.indexOf(pname) !== -1){
				commanderror(src, members[pname] + " is already " + auth.options[authgroup].name + ".", channel);
				return;
			}
			authable = true;
			auth.members[authgroup].perm.push(pname);
		}
		var reverseauth = auth.reverse(authgroup), i, j, deauthable = false;
		for (i in reverseauth){
			j = auth.members[reverseauth[i]].perm.indexOf(pname);
			if (j !== -1){
				deauthable = true;
				auth.members[reverseauth[i]].perm.splice(j,1);
			}
		}
		if (!deauthable && authgroup !== "owner" && authgroup !== "admin" && authgroup !== "mod" && !authable){
			commanderror(src, members[pname] + " is already " + auth.options[authgroup].name + ".", channel);
			return;
		}
		sys.writeToFile("script_authmembers.json", JSON.stringify(auth.members));
		pname = members[pname.toLowerCase()];
		if (authgroup === "owner" || authgroup === "admin" || authgroup === "mod" || authgroup === "user"){
			var id = sys.id(pname);
			if (id === undefined){
				sys.changeDbAuth(pname, auth.level(authgroup));
			}
			else {
				sys.changeAuth(id, auth.level(authgroup));
			}
		}
		var srcname = sys.name(src);
		auth.echo("owner", pname + " was made " + escapehtml(auth.options[authgroup].name) + " by " + srcname + "!");
	}
}

/*After a user logs in, will send all of their stored pms.  Then deletes them from storage*/
var event_code = "/*After a user logs in, will send all of their stored pms.  Then deletes them from storage*/"
+ "\t\tvar lowerName=sys.name(src).toLowerCase();\u000A"
+ "\t\tif(auth.pms[lowerName]!=undefined){\u000A"
+ "\t\t\tfor(var i=0;i<auth.pms[lowerName].length;i++){\u000A"
+ "\t\t\t\tauth.pm(auth.groupName(auth.pms[lowerName][i]['from']),auth.pms[lowerName][i]['message'],auth.pms[lowerName][i]['from'],auth.pms[lowerName][i]['recipients'], auth.pms[lowerName][i]['date'], sys.name(src));\u000A"
+ "\t\t\t}\u000A"
+ "\t\t\tdelete auth.pms[lowerName];\u000A"
+ "\t\t}\u000A";
append("afterLogIn", event_code);
delete event_code;