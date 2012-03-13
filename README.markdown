# About

Created by Lutra(Jakilutra) for use with servers of the Online Pokemon Battle Simulator - [Pokemon Online] (https://github.com/coyotte508/pokemon-online)

## Ownership

All content except `BlueHiddenInnerBall.png`,  `style.css` and `usage_stats/`'s content was originally created for this repository. 

### Background

`BlueHiddenInnerBall.png` is a modification of `HiddenInnerBall.png` from `bin/Themes/Classic/Challenge Window/` in the Pokemon Online repository.

### Usage Statistics

`style.css`, `index.template`, `pokemon_page.template` and `tier_page.template`  are modified from `bin/usage_stats/formatted/` in the Pokemon Online repository.
`poke_img.zip` and `poke_icons.zip` are copies of `black_white.zip` and `icons.zip` respectively from `bin/db/pokes/`  in the Pokemon Online repository.

# Instructions

## Server Scripts

### Setup

Download either `autoupdatescript/scripts.js` (updates the full script every time the script is loaded) or `fullscript/scripts.js` (full script editable in scripts window) to your PO server directory if you want the chosen script to be loaded when you next start the PO server (`Server.exe`).

Otherwise, copy and paste the content of `autoupdatescript/webcallscript.txt` or `fullscript/serverscript.txt` into the Scripts window (Options > Scripts)  and click OK to load.

### File Location

Make sure your chosen `scripts.js` file is not under any directories such as `autoupdatescript/`, `fullscript/`, `site/`, `usage_stats/` or `usage_stats/formatted/` when adding it to your own PO server directory.

## Announcements and Server Description

Copy and paste the content of `Announcements.txt` and/or `serverdescription.txt` into the Announcement and/or Server Description boxes respectively (Options > Config) and commence editing - if you want to  a starting point for your announcements and/or server description.

## Rules

To create a rules command, type `/writemsgcmd rules*html` into the main chat on the server. Copy the content of `rules.html` and replace html with the paste in order to write the default server rules.

## Website

### Setup

If you host a web server with PHP, you can place the `site/` directory in your PO server directory, make it accessible via the web, and set index.php as your default page (or link to it directly) to provide easy-to-read tier, ladder, script and logged battle/chat information to your users.

### Usage Statistics

`usage_stats` and its contents provide useful Pokemon usage statistics information via html pages. Download it to your PO server directory and over-write any existing files in `usage_stats/formatted/`, extract `poke_img.zip` and `poke_icons.zip` to directories of the same name in the same location, and run `StatsExtracter.exe`to complete the server website.

### Configuration

`config.txt` contains options for showing hyperlinks to tiers, ladders, usage statistics, script and logs. Setting an option to true will show any hyperlinks to it, setting it to anything else will hide the hyperlinks to it. For script and logs, the content is also shown/hidden.

### File Locations

Make sure the following are placed under `site/` in your PO server directory: `index.php`, `tiers.php`, `tierinfo.php`, `ladders.php`, `ladderinfo.php`, `script.php`, `logs.php`, `navigation.php`, `config.txt`, `BlueHiddenInnerBall.png`, `tiers.png`, `ladders.png`, `usage_stats.png`, `script.png`, `logs.png` and `style.css`

The following must also be placed under `usage_stats/formatted/` in your PO server directory: `poke_img.zip`, `poke_icons.zip`, `index.template`, `pokemon_page.template` and `tier_page.template`.
