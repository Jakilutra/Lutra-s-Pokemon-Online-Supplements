/* Loading Message Object and Settings */
message = {};
set(construction.source, "messageoptions", "message", "options");

/* Creating IMs Object */

/* im object will contain purely a name and an array of from,recipients,messages to that name.
Upon login, a person's ims will be shown and thus deleted from this object*/
if (message.ims === undefined){
	message.ims = {};
}

/* Main Chat IM Function */
message.im = function (group, text, from, to, date, receiver, channel) {
	var sentago = new Date() - date, display;
	sentago = Math.floor(sentago/1000) === 0 ? " (sent just now) ": " (sent " + converttime(sentago) + " ago) "
	if (group === null){
		display = "<ping/><timestamp/><table width='100%' style='background-color:qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0.1 whitesmoke, stop:0.5 silver); color:black;'><tr><th>Instant Personal Message from <i>" + from + "</i> to <i>" + String(to).replace(/,/gi, ", ") + "</i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date: <small>" + date + sentago + "</small></th></tr><tr><td><center><b><big>" + text + "</big></b></center></td></tr></table>";
	}
	else {
		display = "<ping/><timestamp/><table width='100%' style='background-color:qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0.1 " + auth.options[group].minorcolor + ", stop:0.5 " + auth.options[group].majorcolor + "); color:" + auth.options[group].textcolor + ";'><tr><th>Instant Personal Message from <i>" + from + "</i> to <i>" + String(to).replace(/,/gi, ", ") + "</i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date: <small>" + date + sentago + "</small></th></tr><tr><td><center><b><big>" + text + "</big></b></center></td></tr></table>";
	}
	if (channel > -1) {
			sys.sendHtmlMessage(sys.id(receiver), display, channel);
	}
	else {
			sys.sendHtmlMessage(sys.id(receiver), display);
	}
}

/* Message Announcement Function */
message.echo = function (text, channel) {
	var display = "<timestamp/><table width='100%' style='background-color:qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0.1 whitesmoke, stop:0.5 silver); color:black;'><tr><td><center><b><big>" + text + "</big></b><small> - Message Announcement </small></center></td></tr></table>";
	if (channel > -1) {
		sys.sendHtmlAll(display, channel);
	}
	else {
		sys.sendHtmlAll(display);
	}
}

/* Auto-Update Message Settings */
message.updatejsons = function () {
	if (message.options.autoupdatesettings === "1") {
		sys.webCall(construction.source + "script_messageoptions.json", "downloadjson('" + construction.source + "', 'messageoptions', 'message', 'options');");
		updatedjsons.push("messageoptions");
	}
}
if (message.options !== undefined){
	message.updatejsons();
}

/* Message Commands */
message.commands = {
	messagecommands: function (src, channel, command) {
		var osymbol = "", asymbol = "", msymbol = "", usymbol = "", srcname = sys.name(src), color = namecolor(src);
		if (global.auth !== undefined){
			osymbol = auth.options["owner"].image;
			asymbol = auth.options["admin"].image;
			msymbol = auth.options["mod"].image;
			usymbol = auth.options["user"].image;
		}
		var display = typecommands
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/aumsettings</font><font color='darkred'> value</font></b>: if <b>value</b> is 0 or 1 - auto-updates: no settings or all settings respectively. </td></tr>" 
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/umsettings</font></b>: updates the message settings according to the auto-update message setting. </td></tr>" 
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/amecho</font><font color='darkred'> status</font></b>: turns announcing by message echo <b>status</b>. <b>status</b> is either on or off.</td></tr>" 
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/mecho</font><font color='darkred'> message</font><font color='darkblue'>*channel</font></b>: displays <b>message</b> with the message echo announcement - in <b>channel</b> if a name of a channel is specified. </td></tr>"
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/ghtml</font><font color='darkred'> message</font></b>: sends an html message into the main chat - in <b>channel</b> if a name of a channel is specified. <b>message</b> is any text.</td></tr>"
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/msettings</font></b>: displays the message settings. </td></tr>"
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/im</font><font color='darkred'> to1*to2...*toN</font><font color='darkblue'>:message</font></b>: messages <b>to1,to2..toN</b> (players from 1 to N) through the server with <b>message</b>.</td></tr>"
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/me</font><font color='darkred'> message</font></b>: sends <font color='" +  color + "'><b><i>*** " + srcname +  " message</i></b></font> into the main chat of the channel you use this in. <b>message</b> is any text.</td></tr>"
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/attack</font><font color='darkred'> target</font></b>: sends <b><font color='" +  color + "'>" + srcname +  "</font><font style='font-family:lucida console' color='red'> has used <font color='goldenrod'> [random move]</font> on target!</font></b> into the main chat of the channel you use this in. <b>target</b> is any text.</td></tr>"
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/imp</font><font color='darkred'> name</font><font color='darkblue'>:message</font></b>: sends <b><font color='" +  color + "'>name:</font> message <small><i>impersonation by " + srcname + "</i></small></b> into the main chat of the channel you use this in. <b>name</b> is any text with at most 20 characters. <b>message</b> is any text.</td></tr>"
		+ "<tr><td>" + usymbol + "<b><font color='darkgreen'>/reverse</font><font color='darkred'> message</font></b>: sends <b>message</b> in reverse into the main chat of the channel you use this in.</td></tr>";
		commanddisplay(src, "Message Commands", display, channel);
	},
	me: function (src, channel, command) {
		var color = namecolor(src), message = command.slice(1).join("*");
		message = message === "undefined" ? "": message;
		sys.sendHtmlAll("<font color =" + color + "><timestamp /><b><i>*** " + sys.name(src) + "</i></b></font> " + escapehtml(message).fontcolor(color).italics(), channel);
	},
	attack: function(src,channel,command){
		if (command[1] === "undefined"){
			command[1] = "The Server";
		}
		var srcname = sys.name(src);
		var message="<font color=\""+namecolor(src)+"\"><timestamp/><b>"+srcname+"</b></font>"; //<font color="namecolor(src)"><b>srcname</b></font>
		message+="<b><font style='font-family:lucida console' color='red'> has used <u><font color='goldenrod'>"+sys.move(Math.floor((Math.random()*559)+1))+"</font></u> on </font></b>"; //the move name itself
		var trgt = sys.id(command[1]);
		if (trgt !== undefined){
			message+="<b><font color=\""+namecolor(trgt)+"\">"+command[1]+"</font>!</b>"; //<font color="namecolor(trgt)">trgtname!</font>
		}
		else {
			message+= "<b>" + command[1] + "!</b>"; //trgtname!</font>
		}
		sys.sendHtmlAll(message, channel);
	},
	ghtml: function (src, channel, command) {
		if (sys.auth(src) < 1){
			commanderror(src, "Sorry, you do not have permission to use the global html command (mod command).", channel);
			return;
		}
		var color = namecolor(src), display = command.slice(1).join("*"), channelid = sys.channelId(command[command.length - 1]);
		if (channelid !== undefined && command.length > 2) {
			display = command.slice(1, command.length-1).join("*");
		}
		display = display === "undefined" ? "": display;
		if (channelid > -1) {
			sys.sendAll(sys.name(src) + ":", channelid);
			sys.sendHtmlAll(display, channelid);
		}
		else {
			sys.sendAll(sys.name(src) + ":");
			sys.sendHtmlAll(display);
		}
	},
	imp: function(src, channel, command){
		command = command.slice(1).join("*").split(":");
		var name = command[0], message = command[1], color = namecolor(src), srcname = sys.name(src);
		if (name === "undefined"){
			name = "";
		}
		if (message === undefined){
			message = "";
		}
		if (name.length > 20){
			commanderror(src, "Sorry, you must specify a name with at most 20 characters.", channel);
			return;
		}
		sys.sendHtmlAll("<font color =" + color + "><timestamp /><b>" + escapehtml(name) + ": </b></font> " + escapehtml(message) + " <b><i><small> Impersonation by " + srcname + "</small></i></b>" , channel);
	},
	reverse: function(src, channel, command){
		var srcname = sys.name(src), message = command.slice(1).join("*").split("").reverse().join("");
		if (message === "denifednu"){
			commanderror(src, "Sorry, you must specify some text to reverse. e.g. /reverse abc",channel);
			return;
		}
		sys.sendAll(srcname + ": " + message, channel);
	},
	im: function (src, channel, command) {
		var commandstring = command.slice(1).join("*");
		if(commandstring.indexOf(":") === -1){
			commanderror(src, "The IM command is used with the following Arguments: to1*to2...*toN:MESSAGE, e.g. \"/im Lutra:hi\" or \"/im Lutra*Swimming95:hi\"",channel);
			return;
		}
		var message = commandstring.split(":").slice(1).join(":"); // this makes it possible to do /im Swimming95*Lutra:This is a test if I want to list: 1,2,3
		var sendTo=commandstring.split(":")[0].split("*");
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
				if(global.message.ims[success[j].toLowerCase()]!== undefined){
					//potentially check for max mailbox size
					global.message.ims[success[j].toLowerCase()].push({
						"from":sys.name(src),
						"message":message,
						"recipients":success,
						"date": new Date()
					})
				}
				else{
					global.message.ims[success[j].toLowerCase()]=[{
						"from":sys.name(src),
						"message":message,
						"recipients":success,
						"date": new Date()
					}];
				}
			}
			//user is online
			else{
				if (global.auth !== undefined){
					global.message.im(auth.groupName(sys.name(src)), message, sys.name(src), success, new Date(),success[j], channel);
				}
				else {
					global.message.im(null, message, sys.name(src), success, new Date(),success[j], channel);
				}
			}
		}
		if (global.auth !== undefined){
			global.message.im(auth.groupName(sys.name(src)),message,sys.name(src),success, new Date(), sys.name(src), channel);
		}
		else {
			global.message.im(null,message,sys.name(src),success, new Date(), sys.name(src), channel);
		}
		if(failure.length !==0){
			commanderror(src,"The message failed to send to the following users because they don't exist: "+failure.join()+".  Please check the spelling of all of the names.",channel);
		}
	},
	msettings: function(src, channel, command) {
		var display = "<tr><td><b> Message Echo: </b>" + message.options.echo + "</td></tr>"
		+ "<tr><td><b> Auto-Update Settings: </b>" + message.options.autoupdatesettings + "</td></tr>";
		commanddisplay(src, "Message Settings", display, channel);
	},
	mecho: function(src, channel, command){
		if (sys.auth(src) < 1) {
			commanderror(src, "Sorry, you do not have permission to use the message echo command (mod command).", channel);
			return;
		}
		var channelid = sys.channelId(command[command.length - 1]);
		sys.sendAll(sys.name(src) + ":", channelid);
		command.splice(0, 1);
		if (channelid !== undefined && command.length > 1) {
			command.splice(command.length - 1, 1);
		}
		command = command.join("*");
		message.echo(command, channelid);
	},
	amecho: function(src, channel, command){
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the auto message echo command (owner command).", channel);
			return;
		}
		var arg = command[1].toLowerCase(), srcname = sys.name(src);
		if (arg !== "on" && arg !== "off") {
			commanderror(src, "Sorry, you are required to specify on or off.", channel);
			return;
		}
		if (arg === "on") {
			if (message.options.echo === "on") {
				commanderror(src, "Sorry, announcing by message echo is already turned on.", channel);
				return;
			}
			message.options.echo = "on";
			sys.writeToFile("script_messageoptions.json", JSON.stringify(message.options));
			message.echo("Announcing by message echo has been turned on by " + srcname + "!", -1);
			return;
		}
		if (message.options.echo === "off") {
			commanderror(src, "Sorry, announcing by message echo is already turned off.", channel);
			return;
		}
		message.options.echo = "off";
		sys.writeToFile("script_messageoptions.json", JSON.stringify(message.options));
		if (global.auth !== undefined) {
			auth.echo("owner", "Announcing by message echo has been turned off by " + srcname + "!", -1);
		}
	},
	aumsettings: function (src, channel, command){
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the auto-update message settings command (owner command).", channel);
			return;
		}
		if (command[1] != "0" && command[1] != "1") {
			commanderror(src, "Sorry, you must specify either 0 or 1 for the auto-update message settings command.", channel);
			return;
		}
		if (command[1] === message.options.autoupdatesettings) {
			commanderror(src, "The message auto-update settings is already set to " + command[1] + ".", channel);
			return;
		}
		message.options.autoupdatesettings = command[1];
		sys.writeToFile("script_messageoptions.json", JSON.stringify(message.options));
		if (global.auth !== undefined && message.options.echo === "off") {
			auth.echo("owner", "The message auto-update settings has been changed to " + command[1] + " by " + sys.name(src) + "!", -1);
		}
		else {
			message.echo("The message auto-update settings has been changed to " + command[1] + " by " + sys.name(src) + "!", -1)
		}
	},
	umsettings: function (src, channel, command){
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the update message settings command (owner command).", channel);
			return;
		}
		if (message.options.autoupdatesettings === "0"){
			commanderror(src, "Sorry, you could not update any settings because auto-update settings is set to 0.", channel);
			return;
		}
		message.updatejsons();
		if (global.auth !== undefined && message.options.echo === "off") {
			auth.echo("owner", "The message settings have been updated by " + sys.name(src) + "!", -1);
		}
		else {
			message.echo("The message settings have been updated by " + sys.name(src) + "!", -1);
		}
	}
}

/*After a user logs in, will send all of their stored ims.  Then deletes them from storage*/
var event_code = "/*After a user logs in, will send all of their stored ims.  Then deletes them from storage*/"
+ "\t\tvar lowerName=sys.name(src).toLowerCase();\u000A"
+ "\t\tif(message.ims[lowerName]!=undefined){\u000A"
+ "\t\t\tfor(var i=0;i<message.ims[lowerName].length;i++){\u000A"
+ "\t\t\t\tif(global.auth !== undefined){\u000A"
+ "\t\t\t\t\tmessage.im(auth.groupName(message.ims[lowerName][i]['from']),message.ims[lowerName][i]['message'],message.ims[lowerName][i]['from'],message.ims[lowerName][i]['recipients'], message.ims[lowerName][i]['date'], sys.name(src));\u000A"
+ "\t\t\t\t}\u000A"
+ "\t\t\t\telse{\u000A"
+ "\t\t\t\t\tmessage.im(null,message.ims[lowerName][i]['message'],message.ims[lowerName][i]['from'],message.ims[lowerName][i]['recipients'], message.ims[lowerName][i]['date'], sys.name(src));\u000A"
+ "\t\t\t\t}\u000A"
+ "\t\t\t}\u000A"
+ "\t\t\tdelete message.ims[lowerName];\u000A"
+ "\t\t}\u000A";
append("afterLogIn", event_code);