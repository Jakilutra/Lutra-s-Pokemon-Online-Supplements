# Pokemon Online Server Script

For use with servers of the Online Pokemon Battle Simulator - [Pokemon Online] (https://github.com/coyotte508/pokemon-online)

## Ownership

All content except `BlueHiddenInnerBall.png` was originally created for this repository. `BlueHiddenInnerBall.png` is a modification of `HiddenInnerBall.png` found in the Pokemon Online repository.

## Instructions

### Server Scripts

Download either `autoupdatescript/scripts.js` (updates the full script every time the script is loaded) or `fullscript/scripts.js` (full script editable in scripts window) to your PO server directory if you want the chosen script to be loaded when you next start the PO server (`Server.exe`).

Otherwise, copy and paste the content of `autoupdatescript/webcallscript.txt` or `fullscript/serverscript.txt` into the Scripts window (Options > Scripts)  and click OK to load.

### Announcements and Server Description

Copy and paste the content of `Announcements.txt` and/or `serverdescription.txt` into the Announcement and/or Server Description boxes respectively (Options > Config) and commence editing - if you want to  a starting point for your announcements and/or server description.

### Rules

To create a rules command, type `/writemsgcmd rules*html` into the main chat on the server. Copy the content of `rules.html` and replace html with the paste in order to write the default server rules.

### Web Scripts

If you host your server directory on a web server with PHP, you can just place `tiers.php`, `tiersinfo.php`, `ladders.php`, `ladderinfo.php` and `style.css` in your server directory and link to `tiers.php` and `ladders.php` to provide easy-to-read tier and ladder information to your users.

`ladders.php` and `ladderinfo.php` additionally require you to export ladders (`/exportladders` or `/eval sys.exportTierDatabase();` into the main chat of the server).

### Final Note

Make sure your chosen `scripts.js` file, `tiers.php`, `tiersinfo.php`, `ladders.php`, `ladderinfo.php`, `BlueHiddenInnerBall.png` and `style.css` are not under any directories such as `autoupdatescript/` or `fullscript/` when adding them to your own PO server directory.