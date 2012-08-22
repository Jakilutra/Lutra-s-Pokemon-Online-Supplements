/* Loading Disconnect Object */
disconnect = {};

/* Kick Function */
disconnect.kick = function (src, trgt){
	var srcname = sys.name(src), trgtname = sys.name(trgt);
	if (global.auth !== undefined) {
		auth.echo("mod", trgtname + " has been kicked from the server by " + srcname + "!");
	}
	sys.callQuickly("sys.kick(" + trgt + ");", 200);
}

/* Disconnect Commands */
disconnect.commands = {
	disconnectcommands: function (src, channel, command) {
		var osymbol = global.auth === undefined ? "" : auth.options["owner"].image;
		var msymbol = global.auth === undefined ? "" : auth.options["mod"].image;
		var display = typecommands
		+ "<tr><td>" + osymbol + "<b><font color='darkgreen'>/silentkick</font><font color='darkred'> player</font></b>: silent kicks <b>player</b> from the server.</td></tr>"
		+ "<tr><td>" + msymbol + "<b><font color='darkgreen'>/kick</font><font color='darkred'> player</font></b>: kicks <b>player</b> from the server.</td></tr>";
		commanddisplay(src, "Disconnect Commands", display, channel);
	},
	kick: function (src, channel, command) {
		if (sys.auth(src) < 1) {
			commanderror(src, "Sorry, you do not have permission to use the kick command (mod command).", channel);
			return;
		}
		var trgt = sys.id(command[1]);
		if (trgt === undefined){
			commanderror(src, "Sorry, " + command[1] + " is not currently on the server.", channel);
			return;
		}
		if (src == trgt){
			commanderror(src, "Sorry, you are unable to kick yourself.", channel);
			return;
		}
		var trgtname = sys.name(trgt);
		if (sys.auth(src) <= sys.auth(trgt)){
			commanderror(src, "Sorry, you are unable to kick " + trgtname + " because their auth level is not below yours.", channel);
			return;
		}
		disconnect.kick(src, trgt);
	},
	silentkick: function (src, channel, command) {
		if (sys.auth(src) < 3) {
			commanderror(src, "Sorry, you do not have permission to use the silent kick command (owner command).", channel);
			return;
		}
		var trgt = sys.id(command[1]);
		if (trgt === undefined){
			commanderror(src, "Sorry, " + command[1] + " is not currently on the server.", channel);
			return;
		}
		sys.kick(trgt);
	}
}

/* Kick Event */
append("beforePlayerKick", "sys.stopEvent();disconnect.kick(src,trgt);");