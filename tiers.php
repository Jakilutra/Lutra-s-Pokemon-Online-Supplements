<?php
$xml = new DomDocument();
$xml->load("tiers.xml");
$categories = $xml->firstChild->getElementsByTagName("category");
$categorieslist = "";
$tiersslist = "";
$tierscount = $xml->getElementsByTagName("tier")->length;
foreach ($categories as $category){
	if ($category->parentNode->parentNode->nodeName != "category"){
		$tiers = $category->getElementsByTagName("tier");
		$categorycount = $tiers->length;
		$categorieslist .= "<th>" . $category->getAttribute("name") . " (" . $categorycount . ")</th>";
		$tierslist .= "<td class='noborder'>";
		foreach($tiers as $tier){
			$tiername = $tier->getAttribute("name");
			$tierslist .= "<form action='tierinfo.php?tier=" . urlencode($tiername) . "' method='post'><input type='submit' value='" . $tiername . "'></form>";
		}
		$tierslist .= "</td>";
	}
}
$display = "<html>"
. "<head>"
. "<title>Tiers</title>"
. "<link rel='stylesheet' type='text/css' href='style.css' />"
. "<meta http-equiv='Content-Type' content='text/html'; charset='utf-8' />"
. "</head>"
. "<body>"
. "<table>"
. "<tr><th>Tiers</th><td><a href='ladders.php'>Ladders</a></td><td><a href='usage_stats/formatted/index.html'>Usage Statistics</a></td></tr>"
. "</table>"
. "<h1><a href='tiers.php'>Tiers (" . $tierscount . ")</a></h1>"
. "<table class='noborder' width='100%'>"
. "<tr valign='top' align='left'>" . $categorieslist . "</tr>"
. "<tr valign='top' align='left'>" . $tierslist . "</tr>" 
. "</table>"
. "</body>"
. "</html>";
echo $display;
?>