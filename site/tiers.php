<?php
/* Retrieving Tier Index Information */
$xml = new DomDocument();
$xml->load("../tiers.xml");
$categories = $xml->firstChild->getElementsByTagName("category");
$categorieslist = "";
$tierslist = "";
$tierscount = $xml->getElementsByTagName("tier")->length;
foreach ($categories as $category){
	if ($category->parentNode->parentNode->nodeName != "category"){
		$tiers = $category->getElementsByTagName("tier");
		$categorycount = $tiers->length;
		/* Constructing Tier Index Table Header Cells */
		$categorieslist .= "\t\t\t\t" . "<th>" . "\n"
		. "\t\t\t\t\t" . "{$category->getAttribute("name")} ({$categorycount})" . "\n"
		. "\t\t\t\t" . "</th>" . "\n";
		/* Constructing Tier Index Table Data Cells */
		$tierslist .= "\t\t\t\t" . "<td class='noborder'>" . "\n";
		foreach($tiers as $tier){
			$tiername = $tier->getAttribute("name");
			$tierslist .= "\t\t\t\t\t" . "<form action='tierinfo.php?tier=" . rawurlencode($tiername) . "' method='post'><input type='submit' value='{$tiername}'></form>" . "\n";
		}
		$tierslist .= "\t\t\t\t" . "</td> " . "\n";
	}
}
/* Hiding Tier Index */
$siteconfig = file("config.txt");
foreach ($siteconfig as $line){
	if (preg_match("/show_tiers=/", $line) == 1 && preg_match("/show_tiers=true/", $line) == 0){
		$tierscount = "N/A";
		$categorieslist = "\t\t\t\t" . "<td>" . "\n"
		. "\t\t\t\t\t" . "<i>Hidden</i>" . "\n"
		. "\t\t\t\t" . "</td>" . "\n";
		$tierslist = "\t\t\t\t" . "<td>" . "\n"
		. "\t\t\t\t\t" . "<i>Hidden</i>" . "\n"
		. "\t\t\t\t" . "</td>" . "\n";
	}
}
/* Including Navigation */
$sitepage = "tiers";
include "navigation.php";
/* Constructing Page */
$display = "<!DOCTYPE html>" . "\n"
. "\t" . "<head>" . "\n"
. "\t\t" . "<title>Tiers</title>" . "\n"
. "\t\t" . "<link rel='stylesheet' type='text/css' href='style.css' />" . "\n"
. "\t\t" . "<meta http-equiv='Content-Type' content='text/html;charset=utf-8' />" . "\n"
. "\t" . "</head>" . "\n"
. "\t" . "<body>" . "\n"
. "\t\t" . "<!--Navigation-->" . "\n"
. $nav
. "\t\t" . "<h1><a href='tiers.php'>Tiers ({$tierscount})</a></h1>" . "\n"
. "\t\t" . "<!--Tier Information Link Table-->" . "\n"
. "\t\t" . "<table class='noborder'>" . "\n"
. "\t\t\t" . "<tr>" . "\n"
. "\t\t\t\t" . "<!--Tier Categories-->" . "\n"
. $categorieslist 
. "\t\t\t" . "</tr>" . "\n"
. "\t\t\t" . "<tr>" . "\n"
. "\t\t\t\t" . "<!--Tier Buttons-->" . "\n"
. $tierslist
. "\t\t\t" . "</tr>" . "\n"
. "\t\t" . "</table>" . "\n"
. "\t" . "</body>" . "\n"
. "</html>". "\n";
/* Displaying Page */
echo $display;
?>