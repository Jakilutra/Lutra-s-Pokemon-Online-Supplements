<?php
/* Showing/Hiding Hyperlinks In Central Navigation */
$siteconfig = file("config.txt");
foreach ($siteconfig as $line){
	if (preg_match("/show_tiers=/", $line) == 1 && preg_match("/show_tiers=true/", $line) == 1){
		$tiers= "\t\t\t\t" . "<td class='noborder'>" . "\n"
		. "\t\t\t\t\t" . "<a href='tiers.php'><img src='tiers.png' alt='tiers' /></a><br/>" . "\n"
		. "\t\t\t\t\t" . "<a href='tiers.php'><b>Tiers</b></a>" . "\n"
		. "\t\t\t\t" . "</td>" . "\n";
		continue;
	}
	if (preg_match("/show_ladders=/", $line) == 1 && preg_match("/show_ladders=true/", $line) == 1){
		$ladders = "\t\t\t\t" . "<td class='noborder'>" . "\n"
		. "\t\t\t\t\t" . "<a href='ladders.php'><img src='ladders.png' alt='ladders' /></a><br/>" . "\n"
		. "\t\t\t\t\t" . "<a href='ladders.php'><b>Ladders</b></a>" . "\n"
		. "\t\t\t\t" . "</td>" . "\n";
		continue;
	}
	if (preg_match("/show_stats=/", $line) == 1 && preg_match("/show_stats=true/", $line) == 1){
		$usage_stats = "\t\t\t\t" . "<td class='noborder'>" . "\n"
		. "\t\t\t\t\t" . "<a href='../usage_stats/formatted/index.html'><img src='usage_stats.png' alt='usage_stats' /></a><br/>" . "\n"
		. "\t\t\t\t\t" . "<a href='../usage_stats/formatted/index.html'><b>Usage Statistics</b></a>" . "\n"
		. "\t\t\t\t" . "</td>" . "\n";
		continue;
	}
	if (preg_match("/show_scripts=/", $line) == 1 && preg_match("/show_scripts=true/", $line) == 1){
		$script = "\t\t\t\t" . "<td class='noborder'>" . "\n"
		. "\t\t\t\t\t" . "<a href='script.php'><img src='script.png' alt='script' /></a><br/>" . "\n"
		. "\t\t\t\t\t" . "<a href='script.php'><b>Server Script</b></a>" . "\n"
		. "\t\t\t\t" . "</td>" . "\n";
		continue;
	}
	if (preg_match("/show_logs=/", $line) == 1 && preg_match("/show_logs=true/", $line) == 1){
		$logs = "\t\t\t\t" . "<td class='noborder'>" . "\n"
		. "\t\t\t\t\t" . "<a href='logs.php'><img src='logs.png' alt='logs' /></a><br/>" . "\n"
		. "\t\t\t\t\t" . "<a href='logs.php'><b>Logs</b></a>" . "\n"
		. "\t\t\t\t" . "</td>" . "\n";
	}
}
/* Including  Top Navigation */
$sitepage = "index";
include "navigation.php";
/* Constructing Page */
$display = "<!DOCTYPE html>" . "\n"
. "\t" . "<head>" . "\n"
. "\t\t" . "<title>Index</title>" . "\n"
. "\t\t" . "<link rel='stylesheet' type='text/css' href='style.css' />" . "\n"
. "\t\t" . "<meta http-equiv='Content-Type' content='text/html;charset=utf-8' />" . "\n"
. "\t" . "</head>" . "\n"
. "\t" . "<body>" . "\n"
. "\t\t" . "<!--Top Navigation-->" . "\n"
. $nav
. "\t\t" . "<h1><a href='index.php'>Index</a></h1>" . "\n"
. "\t\t" . "<!--Central Navigation-->" . "\n"
. "\t\t" . "<table class='noborder'>" . "\n"
. "\t\t\t" . "<tr>" . "\n"
. $tiers
. $ladders
. $usage_stats 
. $script
. $logs
. "\t\t\t" . "</tr>" . "\n"
. "\t\t" . "</table>" . "\n"
. "\t" . "</body>" . "\n"
. "</html>" . "\n";
/* Displaying Page */
echo $display;
?>