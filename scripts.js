(function(){
	/* Naming Global Variable */
	global = this;
	/* Function to Load External JavaScript Files */
	install = function(source, filename){
		download = function (source, filename){
			sys.writeToFile("script_" + filename + ".js",resp);
			if (sys.getFileContent("script_" + filename + ".js") === undefined){
				print (filename + " could not be installed.");
			}
			else {
				print ("Installed " + filename + " script.");
				eval(sys.getFileContent("script_" + filename + ".js"));
			}
		}
		if (sys.getFileContent("script_" + filename + ".js") === undefined || construction.auto_update === "on" ){
			sys.webCall(source + "script_" + filename + ".js", "download('" + source + "', '" + filename + "');");
		}
		else {
			print ("Loaded " + filename + " script.");
			eval(sys.getFileContent("script_" + filename + ".js"));
		}
	}
	/* Function to Load External JSON Files */
	set = function(source, filename, object, key){
		download2 = function (source, filename, object, key){
			sys.writeToFile("script_" + filename + ".json",resp);
			if (sys.getFileContent("script_" + filename + ".json") === undefined){
				print (filename + " default settings could not be installed.");
			}
			else {
				global[object][key] = JSON.parse(sys.getFileContent("script_" + filename + ".json"));
				print ("Installed " + filename + " default settings.");
			}
		}
		if (sys.getFileContent("script_" + filename + ".json") === undefined){
			sys.webCall(source + "script_" + filename + ".json", "download2('" + source + "', '" + filename + "', '" + object + "', '" + key + "');");
		}
		else {
			try{
				global[object][key] = JSON.parse(sys.getFileContent("script_" + filename + ".json"));
			}
			catch (error){
				sys.writeToFile("script_" + filename + " (corrupted).json", sys.getFileContent("script_" + filename + ".json"));
				print (filename + " file corrupted - downloading latest " + filename + " file...");			
				sys.webCall(source + "script_" + filename + ".json", "download2('" + source + "', '" + filename + "', '" + object + "', '" + key + "');");
				return;
			}
			print ("Loaded " + filename + " settings.");
		}
	}
	/* Function for Command Execution in an Object*/
	commandtry = function(object, src, channel, command){
		validcommand = true;
		if (global[object].commands[command[0].toLowerCase()] != undefined){
			command[0] += "*" + command[1];
			command.splice(1,1);
		}
		command = command.join(' ').split('*');
		if (global[object].commands[command[0].toLowerCase()] === undefined){
			validcommand = false;
			return;
		}
		global[object].commands[command[0].toLowerCase()](src,channel, command);
	}
	/* Command Error Message Function */
	commanderror = function (id, text, channel){
		var display = "<timestamp/><table width='100%' style='background-color:qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0.1 black, stop:0.5 grey); color:white;'><tr><th>Personal Message</th></tr><tr><td><center><b><big>" + text + "</big></b></center></td></tr></table>";
		if (channel > -1){
			sys.sendHtmlMessage(id, display, channel);
		}
		else {
			sys.sendHtmlMessage(id, display);
		}
	}
	/* Escape Html Function */
	escapehtml = function(str){
		return str.replace(/&/g,'&amp;').replace(/\>/g,'&gt;').replace(/\</g,'&lt;'); 
	}
	/* Loading External JavaScript Files */
	construction = {};
	construct = function(){
		var index;
		for (index in construction.units){
			install(construction.source, construction.units[index]);
		}
	}
	download3 = function (){
		sys.writeToFile("script_construction.json",resp);
		if (sys.getFileContent("script_construction.json") === undefined){
			print (filename + " default settings could not be installed.");
		}
		else {
			construction = JSON.parse(sys.getFileContent("script_construction.json"));
			construct();
			print ("Installed construction default settings.");
		}
	}
	if (sys.getFileContent("script_construction.json") === undefined){
		sys.webCall("http://pokemonperfect.co.uk/script_construction.json", "download3();");
	}
	else {
		try {
			construction = JSON.parse(sys.getFileContent("script_construction.json"));
		}
		catch (error){
			sys.writeToFile("script_construction (corrupted).json", sys.getFileContent("script_construction.json"));
			print ("Construction file corrupted - downloading latest construction file...");
			sys.webCall("http://pokemonperfect.co.uk/script_construction.json", "download3();");
			return;
		}
		if (construction.auto_update === "on"){
			sys.webCall(construction.source + "script_construction.json", "download3();");
		}
		else {
			construct();
			print ("Loaded construction settings.");
		}
	}
	/* Script Reload Message */
	if (global.auth !== undefined){
		auth.echo("server", "The Script has been reloaded!", -1);
	}
}).call(null);

({
	beforeChatMessage: function(src, message, channel){
		/* Command Execution */
		if (message[0] == "/" && message.length > 1){
			sys.stopEvent();
			var command = message.substr(1, message.length).split(' ');
			commandtry("auth", src, channel, command);
			if (!validcommand){
				commanderror(src, "The server does not recognise <b>\"" + escapehtml(message) + "\"</b> as a valid command.", channel);
			}
		}
	}
})