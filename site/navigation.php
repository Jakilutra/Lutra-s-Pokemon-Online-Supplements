<?php
$nav = "<table>"
. "<tr><td><a href='index.php'>Home</a></td><td><a href='tiers.php'>Tiers</a></td><td><a href='ladders.php'>Ladders</a></td><td><a href='../usage_stats/formatted/index.html'>Usage Statistics</a></td><td><a href='script.php'>Server Script</a></td><td><a href='logs.php'>Logs</a></td></tr>"
. "</table>";
$siteconfig = file("config.txt");
foreach ($siteconfig as $line){
	if (preg_match("/show_tiers=/", $line) == 1 && preg_match("/show_tiers=true/", $line) == 0){
		$nav = str_replace("<td><a href='tiers.php'>Tiers</a></td>", "", $nav);
		continue;
	}
	if (preg_match("/show_ladders=/", $line) == 1 && preg_match("/show_ladders=true/", $line) == 0){
		$nav = str_replace("<td><a href='ladders.php'>Ladders</a></td>", "", $nav);
		continue;
	}
	if (preg_match("/show_stats=/", $line) == 1 && preg_match("/show_stats=true/", $line) == 0){
		$nav = str_replace("<td><a href='../usage_stats/formatted/index.html'>Usage Statistics</a></td>", "", $nav);
		continue;
	}
	if (preg_match("/show_scripts=/", $line) == 1 && preg_match("/show_scripts=true/", $line) == 0){
		$nav = str_replace("<td><a href='script.php'>Server Script</a></td>", "", $nav);
		continue;
	}
	if (preg_match("/show_logs=/", $line) == 1 && preg_match("/show_logs=true/", $line) == 0){
		$nav = str_replace("<td><a href='logs.php'>Logs</a></td>", "", $nav);
		continue;
	}
}
if (empty($sitepage)){
	$sitepage = $_GET["sitepage"];
	$level = $_GET["level"];
}
switch($sitepage){
	case "index": $nav = str_replace("<td><a href='index.php'>Home/a></td>", "<th>Home</th>", $nav); break;
	case "tiers": $nav = str_replace("<td><a href='tiers.php'>Tiers</a></td>", "<th>Tiers</th>", $nav); break;
	case "ladders": $nav = str_replace("<td><a href='ladders.php'>Ladders</a></td>", "<th>Ladders</th>", $nav); break;
	case "usage_stats": $nav = str_replace("<td><a href='../usage_stats/formatted/index.html'>Usage Statistics</a></td>", "<th>Usage Statistics</th>", $nav); break;
	case "script": $nav = str_replace("<td><a href='script.php'>Server Script</a></td>", "<th>Server Script</th>", $nav); break;
	case "logs": $nav = str_replace("<td><a href='logs.php'>Logs</a></td>", "<th>Logs</th>", $nav); break;
}
if ($sitepage == "usage_stats"){
	if ($level == "1"){
		$nav = str_replace("<td><a href='index.php'>Home</a></td>", "<td><a href='../../site/index.php'>Home</a></td>", $nav);
		$nav = str_replace("<td><a href='tiers.php'>Tiers</a></td>", "<td><a href='../../site/tiers.php'>Tiers</a></td>", $nav);
		$nav = str_replace("<td><a href='ladders.php'>Ladders</a></td>", "<td><a href='../../site/ladders.php'>Ladders</a></td>", $nav);
		$nav = str_replace("<td><a href='script.php'>Server Script</a></td>", "<td><a href='../../site/script.php'>Server Script</a></td>", $nav);
		$nav = str_replace("<td><a href='logs.php'>Logs</a></td>", "<td><a href='../../site/logs.php'>Logs</a></td>", $nav);
	}
	else {
		$nav = str_replace("<td><a href='index.php'>Home/a></td>", "<td><a href='../../../site/index.php'>Home</a></td>", $nav);
		$nav = str_replace("<td><a href='tiers.php'>Tiers</a></td>", "<td><a href='../../../site/tiers.php'>Tiers</a></td>", $nav);
		$nav = str_replace("<td><a href='ladders.php'>Ladders</a></td>", "<td><a href='../../../site/ladders.php'>Ladders</a></td>", $nav);
		$nav = str_replace("<td><a href='script.php'>Server Script</a></td>", "<td><a href='../../../site/script.php'>Server Script</a></td>", $nav);
		$nav = str_replace("<td><a href='logs.php'>Logs</a></td>", "<td><a href='../../../site/logs.php'>Logs</a></td>", $nav);
	}
	echo "document.write(" . $nav . ");";
}
?>