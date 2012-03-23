#Lutra's Pokemon Online Server Supplements

Created by Lutra (Jakilutra) for use with servers of the Online Pokemon Battle Simulator - [Pokemon Online] (https://github.com/coyotte508/pokemon-online)

##  Instructions
1. Download the repository files [here] (https://github.com/downloads/Jakilutra/Lutra-s-Pokemon-Online-Server-Supplements/Lutra-s-Pokemon-Online-Server-Supplements.7z)
2. Extract `Lutra-s-Pokemon-Online-Server-Supplements.7z`
3. Refer to the specific instructions on how to setup your chosen supplement.

## Server Script
The Server Script is entirely coded in JavaScript and began as a tournament script.

### Setup
Save either `autoupdatescript/scripts.js` (updates the full script every time the script is loaded) or `fullscript/scripts.js` (full script editable in scripts window) into your PO server directory, if you want the chosen script to be loaded when you next start the PO server (`Server.exe`). Otherwise, copy and paste the content of `autoupdatescript/webcallscript.txt` or `fullscript/serverscript.txt` into the Scripts window (Options > Scripts),  and click OK to load.

### File Location
Make sure your chosen `scripts.js` file is not under any directories such as `autoupdatescript/`, `fullscript/`, `site/`, `usage_stats/` or `usage_stats/formatted/` when adding it to your own PO server directory.

## Announcements
Copy and paste the content of `Announcements.txt` into the Announcement box (Options > Config), making sure to edit for detail relevant to your server, and click apply.

## Server Description
Copy and paste the content of `serverdescription.txt` into the Server Description box (Options > Config), making sure to edit for detail relevant to your server, and click apply.

## Rules
To create a rules command, type `/writemsgcmd rules*html` into the main chat on the server. Copy the content of `rules.html` and replace the `html` argument with the paste in order to write the default server rules.

## Website
For information on the PO Server Website, visit [here] (https://github.com/Jakilutra/Lutra-s-Pokemon-Online-Server-Supplements/wiki/PO-Server-Website)
