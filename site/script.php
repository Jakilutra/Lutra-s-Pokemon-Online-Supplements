<?php
$siteconfig = file("config.txt");
foreach ($siteconfig as $line){
	if (preg_match("/show_scripts=true/", $line) == 1){
		$scriptlink = "../scripts.js";
		$script = file_get_contents($scriptlink);
		$script = htmlentities($script);
		$script = nl2br($script);
		$script = str_replace("\t",'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',$script);
		$scriptarray = explode("<br />", $script);
		$linecount = 0;
		$lines = "";
		foreach ($scriptarray as $scriptline){
			$linecount++;
			$lines .= "{$linecount}.<br/>";
		}			
	}
}
if (isset($script) == false){
	$lines = "N/A";
	$script = "<i>Hidden</i>";
}
$sitepage = "script";
include "navigation.php";
$display = "<html>"
. "<head>"
. "<title>Server Script</title>"
. "<link rel='stylesheet' type='text/css' href='style.css' />"
. "<meta http-equiv='Content-Type' content='text/html' charset='utf-8' />"
. "</head>"
. "<body>"
. $nav
. "<h1><a href='script.php'>Server Script</a></h1>"
. "<table width ='100%'>"
. "<tr align='left' valign='top'><th>Line</th><th>Script&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href={$scriptlink}><input type='submit' value='Raw'></a></input></th></tr>"
. "<tr align='left' valign='top'><td><b><small>{$lines}</small></b></td><td nowrap><b><small>{$script}</small></b></tr>"
. "</table>"
. "</body>"
. "</html>";
echo $display;
fopen("scripts.js", "r");
?>