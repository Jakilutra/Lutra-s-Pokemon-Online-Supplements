<?php
$siteconfig = file("config.txt");
foreach ($siteconfig as $line){
	if (preg_match("/show_tiers=/", $line) == 1 && preg_match("/show_tiers=true/", $line) == 1){
		$tiers= "<td class='noborder'>"
		. "<a href='tiers.php'><img src='tiers.png'/></a><br/>"
		. "<a href='tiers.php'><b>Tiers</b></a>"
		. "</td>";
		continue;
	}
	if (preg_match("/show_ladders=/", $line) == 1 && preg_match("/show_ladders=true/", $line) == 1){
		$ladders = "<td class='noborder'>"
		. "<a href='ladders.php'><img src='ladders.png'/></a><br/>"
		. "<a href='ladders.php'><b>Ladders</b></a>"
		. "</td>";
		continue;
	}
	if (preg_match("/show_stats=/", $line) == 1 && preg_match("/show_stats=true/", $line) == 1){
		$usage_stats = "<td class='noborder'>"
		. "<a href='../usage_stats/formatted/index.html'><img src='usage_stats.png'/></a><br/>"
		. "<a href='../usage_stats/formatted/index.html'><b>Usage Statistics</b></a>"
		. "</td>";
		continue;
	}
	if (preg_match("/show_scripts=/", $line) == 1 && preg_match("/show_scripts=true/", $line) == 1){
		$script = "<td class='noborder'>"
		. "<a href='script.php'><img src='script.png'/></a><br/>"
		. "<a href='script.php'><b>Server Script</b></a>"
		. "</td>";
		continue;
	}
	if (preg_match("/show_logs=/", $line) == 1 && preg_match("/show_logs=true/", $line) == 1){
		$logs = "<td class='noborder'>"
		. "<a href='logs.php'><img src='logs.png'/></a><br/>"
		. "<a href='logs.php'><b>Logs</b></a>"
		. "</td>";
	}
}
$sitepage = "index";
include "navigation.php";
$display = "<html>"
. "<head>"
. "<title>Index</title>"
. "<link rel='stylesheet' type='text/css' href='style.css' />"
. "<meta http-equiv='Content-Type' content='text/html' charset='utf-8' />"
. "</head>"
. "<body>"
. $nav
. "<h1><a href='index.php'>Index</a></h1>"
. "<table width='100%' class='noborder'>"
. "<tr align='center'>"
. $tiers
. $ladders
. $usage_stats
. $script
. $logs
. "</tr>"
. "</table>"
. "</body>"
. "</html>";
echo $display;
?>