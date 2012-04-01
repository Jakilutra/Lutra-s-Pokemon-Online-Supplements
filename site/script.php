<?php
/* Showing/Hiding Script */
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
/* Including Navigation */
$sitepage = "script";
include "navigation.php";
/* Constructing Page */
$display = "<!DOCTYPE html>" . "\n"
. "\t" . "<head>" . "\n"
. "\t\t" . "<title>Server Script</title>" . "\n"
. "\t\t" . "<link rel='stylesheet' type='text/css' href='style.css' />" . "\n"
. "\t\t" . "<meta http-equiv='Content-Type' content='text/html;charset=utf-8' />" . "\n"
. "\t" . "</head>" . "\n"
. "\t" . "<body>" . "\n"
. "\t\t" . "<!--Navigation-->" . "\n"
. $nav
. "\t\t" . "<h1><a href='script.php'>Server Script</a></h1>" . "\n"
. "\t\t" . "<!--Script Table-->" . "\n"
. "\t\t" . "<table>" . "\n"
. "\t\t\t" . "<tr>" . "\n"
. "\t\t\t\t" . "<th>" . "\n"
. "\t\t\t\t\t" . "Line" . "\n"
. "\t\t\t\t" . "</th>" . "\n"
. "\t\t\t\t" . "<th class='left'>" . "\n"
. "\t\t\t\t" . "<!--Raw Script Link-->" . "\n"
. "\t\t\t\t\t" . "<form action='../scripts.js' method='get'>" . "\n"
. "\t\t\t\t\t\t" . "<input type='submit' value='Raw Script' />" . "\n"
. "\t\t\t\t\t" . "</form>" . "\n"
. "\t\t\t\t" . "</th>" . "\n"
. "\t\t\t" . "</tr>" . "\n"
. "\t\t\t" . "<tr>" . "\n"
. "\t\t\t\t" . "<td>" . "\n"
. "\t\t\t\t" . "<!--Script Line Numbers-->" . "\n"
. "\t\t\t\t\t" . "<b><small>{$lines}</small></b>" . "\n"
. "\t\t\t\t" . "</td>" . "\n"
. "\t\t\t\t" . "<td class='left'>" . "\n"
. "\t\t\t\t" . "<!--Script Lines-->" . "\n"
. "\t\t\t\t\t" . "<b><small>{$script}</small></b>" . "\n"
. "\t\t\t\t" . "</td>" . "\n"
. "\t\t\t" . "</tr>" . "\n"
. "\t\t" . "</table>" . "\n"
. "\t" . "</body>" . "\n"
. "</html>" . "\n";
/* Displaying Page */
echo $display;
?>