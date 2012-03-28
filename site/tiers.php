<?php
$xml = new DomDocument();
$xml->load("../tiers.xml");
$categories = $xml->firstChild->getElementsByTagName("category");
$categorieslist = "";
$tiersslist = "";
$tierscount = $xml->getElementsByTagName("tier")->length;
foreach ($categories as $category){
	if ($category->parentNode->parentNode->nodeName != "category"){
		$tiers = $category->getElementsByTagName("tier");
		$categorycount = $tiers->length;
		$categorieslist .= "<th>{$category->getAttribute("name")} ({$categorycount})</th>";
		$tierslist .= "<td class='noborder'>";
		foreach($tiers as $tier){
			$tiername = $tier->getAttribute("name");
			$tierslist .= "<form action='tierinfo.php?tier=" . rawurlencode($tiername) . "' method='post'><input type='submit' value='{$tiername}'></form>";
		}
		$tierslist .= "</td>";
	}
}
$siteconfig = file("config.txt");
foreach ($siteconfig as $line){
	if (preg_match("/show_tiers=/", $line) == 1 && preg_match("/show_tiers=true/", $line) == 0){
		$tierscount = "N/A";
		$categorieslist = "<td><i>Hidden</i></td>";
		$tierslist = "<td><i>Hidden</i></td>";
	}
}
$sitepage = "tiers";
include "navigation.php";
$display = "<html>"
. "<head>"
. "<title>Tiers</title>"
. "<link rel='stylesheet' type='text/css' href='style.css' />"
. "<meta http-equiv='Content-Type' content='text/html' charset='utf-8' />"
. "</head>"
. "<body>"
. $nav
. "<h1><a href='tiers.php'>Tiers ({$tierscount})</a></h1>"
. "<table class='noborder' width='100%'>"
. "<tr valign='top' align='left'>{$categorieslist}</tr>"
. "<tr valign='top' align='left'>{$tierslist}</tr>" 
. "</table>"
. "</body>"
. "</html>";
echo $display;
?>