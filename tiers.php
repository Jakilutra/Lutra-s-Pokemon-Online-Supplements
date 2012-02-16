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
		$tierslist .= "<td>";
		foreach($tiers as $tier){
			$tiername = $tier->getAttribute("name");
			$tierslist .= "<form action='tierinfo.php?tier=" . urlencode($tiername) . "' method='post'><input type='submit' value='" . $tiername . "'></form>";
		}
		$tierslist .= "</td>";
	}
}
$display = "<center><h1>Tiers (" . $tierscount . ")</h1></center>"
. "<table width='100%'>"
. "<tr valign='top' align='left'>" . $categorieslist . "</tr>"
. "<tr valign='top' align='left'>" . $tierslist . "</tr>" 
. "</table>";
echo $display;
?>