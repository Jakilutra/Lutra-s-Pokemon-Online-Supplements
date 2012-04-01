<?php
/* Constructing Navigation */
$nav = "\t\t" . "<table class='nav'>" . "\n"
. "\t\t\t" . "<tr>" . "\n"
. "\t\t\t\t" . "<td>" . "\n"
. "\t\t\t\t\t" . "<a href='index.php'>Home</a>" . "\n"
. "\t\t\t\t" . "</td>" . "\n"
. "\t\t\t\t" . "<td>" . "\n"
. "\t\t\t\t\t" . "<a href='tiers.php'>Tiers</a>" . "\n" 
. "\t\t\t\t" . "</td>" . "\n"
. "\t\t\t\t" .  "<td>" . "\n" 
. "\t\t\t\t\t" . "<a href='ladders.php'>Ladders</a>" . "\n"
. "\t\t\t\t" . "</td>" . "\n"
. "\t\t\t\t" . "<td>" . "\n"
. "\t\t\t\t\t" . "<a href='../usage_stats/formatted/index.html'>Usage Statistics</a>" . "\n" 
. "\t\t\t\t" . "</td>" . "\n"
. "\t\t\t\t" . "<td>" . "\n"
. "\t\t\t\t\t" . "<a href='script.php'>Server Script</a>" . "\n" 
. "\t\t\t\t" . "</td>" . "\n"
. "\t\t\t\t" . "<td>" . "\n" 
. "\t\t\t\t\t" . "<a href='logs.php'>Logs</a>" . "\n" 
. "\t\t\t\t" . "</td>" . "\n"
. "\t\t\t" . "</tr>" . "\n"
. "\t\t" . "</table>" . "\n";
/* Hiding Navigation */
$siteconfig = file("config.txt");
foreach ($siteconfig as $line){
	if (preg_match("/show_tiers=/", $line) == 1 && preg_match("/show_tiers=true/", $line) == 0){
		$nav = str_replace("\t\t\t\t<td>\n\t\t\t\t\t<a href='tiers.php'>Tiers</a>\n\t\t\t\t</td>\n", "", $nav);
		continue;
	}
	if (preg_match("/show_ladders=/", $line) == 1 && preg_match("/show_ladders=true/", $line) == 0){
		$nav = str_replace("\t\t\t\t<td>\n\t\t\t\t\t<a href='ladders.php'>Ladders</a>\n\t\t\t\t</td>\n", "", $nav);
		continue;
	}
	if (preg_match("/show_stats=/", $line) == 1 && preg_match("/show_stats=true/", $line) == 0){
		$nav = str_replace("\t\t\t\t<td>\n\t\t\t\t\t<a href='../usage_stats/formatted/index.html'>Usage Statistics</a>\n\t\t\t\t</td>\n", "", $nav);
		continue;
	}
	if (preg_match("/show_scripts=/", $line) == 1 && preg_match("/show_scripts=true/", $line) == 0){
		$nav = str_replace("\t\t\t\t<td>\n\t\t\t\t\t<a href='script.php'>Server Script</a>\n\t\t\t\t</td>\n", "", $nav);
		continue;
	}
	if (preg_match("/show_logs=/", $line) == 1 && preg_match("/show_logs=true/", $line) == 0){
		$nav = str_replace("\t\t\t\t<td>\n\t\t\t\t\t<a href='logs.php'>Logs</a>\n\t\t\t\t</td>\n", "", $nav);
		continue;
	}
}
/* Adapting Navigation for Usage Statistics Pages */
if (empty($sitepage)){
	$sitepage = $_GET["sitepage"];
	$level = $_GET["level"];
}
switch($sitepage){
	case "index": $nav = str_replace("\t\t\t\t<td>\n\t\t\t\t\t<a href='index.php'>Home</a>\n\t\t\t\t</td>\n", "\t\t\t\t<th>\n\t\t\t\t\tHome\n\t\t\t\t</th>\n", $nav); break;
	case "tiers": $nav = str_replace("\t\t\t\t<td>\n\t\t\t\t\t<a href='tiers.php'>Tiers</a>\n\t\t\t\t</td>\n", "\t\t\t\t<th>\n\t\t\t\t\tTiers\n\t\t\t\t</th>\n", $nav); break;
	case "ladders": $nav = str_replace("\t\t\t\t<td>\n\t\t\t\t\t<a href='ladders.php'>Ladders</a>\n\t\t\t\t</td>\n", "\t\t\t\t<th>\n\t\t\t\t\tLadders\n\t\t\t\t</th>\n", $nav); break;
	case "usage_stats": $nav = str_replace("\t\t\t\t<td>\n\t\t\t\t\t<a href='../usage_stats/formatted/index.html'>Usage Statistics</a>\n\t\t\t\t</td>\n", "\t\t\t\t<th>\n\t\t\t\t\tUsage Statistics\n\t\t\t\t</th>\n", $nav); break;
	case "script": $nav = str_replace("\t\t\t\t<td>\n\t\t\t\t\t<a href='script.php'>Server Script</a>\n\t\t\t\t</td>\n", "\t\t\t\t<th>\n\t\t\t\t\tServer Script\n\t\t\t\t</th>\n", $nav); break;
	case "logs": $nav = str_replace("\t\t\t\t<td>\n\t\t\t\t\t<a href='logs.php'>Logs</a>\n\t\t\t\t</td>\n", "\t\t\t\t<th>\n\t\t\t\t\tLogs\n\t\t\t\t</th>\n", $nav); break;
}
if ($sitepage == "usage_stats"){
	if ($level == "1"){
		$nav = str_replace("\t\t\t\t<td>\n\t\t\t\t\t<a href='index.php'>Home</a>\n\t\t\t\t</td>\n", "\t\t\t\t<td>\n\t\t\t\t\t<a href='../../site/index.php'>Home</a>\n\t\t\t\t</td>\n", $nav);
		$nav = str_replace("\t\t\t\t<td>\n\t\t\t\t\t<a href='tiers.php'>Tiers</a>\n\t\t\t\t</td>\n",  "\t\t\t\t<td>\n\t\t\t\t\t<a href='../../site/tiers.php'>Tiers</a>\n\t\t\t\t</td>\n", $nav);
		$nav = str_replace("\t\t\t\t<td>\n\t\t\t\t\t<a href='ladders.php'>Ladders</a>\n\t\t\t\t</td>\n", "\t\t\t\t<td>\n\t\t\t\t\t<a href='../../site/ladders.php'>Ladders</a>\n\t\t\t\t</td>\n", $nav);
		$nav = str_replace("\t\t\t\t<td>\n\t\t\t\t\t<a href='script.php'>Server Script</a>\n\t\t\t\t</td>\n", "\t\t\t\t<td>\n\t\t\t\t\t<a href='../../site/script.php'>Server Script</a>\n\t\t\t\t</td>\n", $nav);
		$nav = str_replace("\t\t\t\t<td>\n\t\t\t\t\t<a href='logs.php'>Logs</a>\n\t\t\t\t</td>\n", "\t\t\t\t<td>\n\t\t\t\t\t<a href='../../site/logs.php'>Logs</a>\n\t\t\t\t</td>\n", $nav);
	}
	else {
		$nav = str_replace("\t\t\t\t<td>\n\t\t\t\t\t<a href='index.php'>Home</a>\n\t\t\t\t</td>\n", "\t\t\t\t<td>\n\t\t\t\t\t<a href='../../../site/index.php'>Home</a>\n\t\t\t\t</td>\n", $nav);
		$nav = str_replace("\t\t\t\t<td>\n\t\t\t\t\t<a href='tiers.php'>Tiers</a>\n\t\t\t\t</td>\n", "\t\t\t\t<td>\n\t\t\t\t\t<a href='../../../site/tiers.php'>Tiers</a>\n\t\t\t\t</td>\n", $nav);
		$nav = str_replace("\t\t\t\t<td>\n\t\t\t\t\t<a href='ladders.php'>Ladders</a>\n\t\t\t\t</td>\n", "\t\t\t\t<td>\n\t\t\t\t\t<a href='../../../site/ladders.php'>Ladders</a>\n\t\t\t\t</td>\n", $nav);
		$nav = str_replace("\t\t\t\t<td>\n\t\t\t\t\t<a href='script.php'>Server Script</a>\n\t\t\t\t</td>\n", "\t\t\t\t<td>\n\t\t\t\t\t<a href='../../../site/script.php'>Server Script</a>\n\t\t\t\t</td>\n", $nav);
		$nav = str_replace("\t\t\t\t<td>\n\t\t\t\t\t<a href='logs.php'>Logs</a>\n\t\t\t\t</td>\n", "\t\t\t\t<td>\n\t\t\t\t\t<a href='../../../site/logs.php'>Logs</a>\n\t\t\t\t</td>\n", $nav);
	}
	echo "document.write(" . $nav . ");";
}
?>