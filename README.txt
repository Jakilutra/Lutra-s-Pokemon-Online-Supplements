Download either autoupdatescript/scripts.js (updates the full script every time the script is loaded) or fullscript/scripts.js (full script editable in scripts window) to your PO server directory if you want the chosen script to be loaded when you next start the PO server (Server.exe).

Otherwise, copy and paste the content of autoupdatescript/webcallscript.txt or fullscript/serverscript.txt into the Scripts window (Options > Scripts)  and click OK to load.

To create a rules command, type /writemsgcmd rules*html into the main chat on the server. Copy the content of rules.html and replace html with the paste in order to write the default server rules.

If you host your server directory on a web server with PHP, you can just place tiers.php and tiersinfo.php in your server directory and link to tiers.html to provide easy-to-read tier information to your users.

N.B. Make sure your chosen scripts.js file, tiers.php and tiersinfo.php are not under any directories such as autoupdatescript/ or fullscript/ when adding them to your own PO server directory.