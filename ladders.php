<?php
$config = file("config");
$ladderinfo = "";
$laddertinfo = "";
foreach ($config as $line){
	if (substr_compare($line, "rated_battle_through_challenge=", 0,31) == 0){
		$laddertinfo .= "<th>Rated Battles via Challenges</th>";
		$ladderinfo .= "<td>" . substr($line, 31) . "</td>";
		continue;
	}
	if (substr_compare($line, "battles_with_same_ip_unrated=", 0,29) == 0){
		$laddertinfo .= "<th>Unrated Battles between Players of Same I.P.</th>";
		$ladderinfo .= "<td>" . substr($line, 29) . "</td>";
		continue;
	}
	if (substr_compare($line, "rated_battles_memory_number=", 0,28) == 0){
		$laddertinfo .= "<th>Rated Battles without Same Opponent</th>";
		$ladderinfo .= "<td>" . substr($line, 28) . "</td>";
		continue;
	}
	if (substr_compare($line, "ladder_percent_per_period=", 0,26) == 0){
		$laddertinfo .= "<th>% Decay per Period</th>";
		$ladderinfo .= "<td>" . substr($line, 26) . "</td>";
		continue;
	}
	if (substr_compare($line, "ladder_period_duration=", 0,23) == 0){
		$laddertinfo .= "<th>Hours per Period</th>";
		$ladderinfo .= "<td>" . substr($line, 23) . "</td>";
		continue;
	}
	if (substr_compare($line, "ladder_max_decay=", 0,17) == 0){
		$laddertinfo .= "<th>% Maximum Decay</th>";
		$ladderinfo .= "<td>" . substr($line, 17) . "</td>";
		continue;
	}
	if (substr_compare($line, "ladder_bonus_time=", 0,18) == 0){
		$laddertinfo .= "<th>Maximum Periods without Decay</th>";
		$ladderinfo .= "<td>" . substr($line, 18) . "</td>";
		continue;
	}
	if (substr_compare($line, "ladder_months_expiration=", 0,25) == 0){
		$laddertinfo .= "<th>Months per Expiration</th>";
		$ladderinfo .= "<td>" . substr($line, 25) . "</td>";
	}
}
$xml = new DomDocument();
$xml->load("tiers.xml");
$categories = $xml->firstChild->getElementsByTagName("category");
$categorieslist = "";
$ladderslist = "";
$ladderscount = 0;
foreach ($categories as $category){
	if ($category->parentNode->parentNode->nodeName != "category"){
		$tiers = $category->getElementsByTagName("tier");
		$categorycount = 0;
		foreach($tiers as $tier){
			$tiername = $tier->getAttribute("name");
			$filename = "tier_" . $tiername . ".txt";
			if (file_exists($filename) && file_get_contents($filename) != ""){
				if ($categorycount == 0){
					$ladderslist .= "<td class='noborder'>";
				}
				$ladderscount++;
				$categorycount++;
				$tiername = $tier->getAttribute("name");
				$ladderslist .= "<form action='ladderinfo.php?tier=" . urlencode($tiername) . "&count=INSERT_HERE' method='post'><input type='submit' value='" . $tiername . "'></form>";
			}
		}
		if ($categorycount != 0){
			$categorieslist .= "<th>" . $category->getAttribute("name") . " (" . $categorycount . ")</th>";
			$ladderslist .= "</td>";
		}
	}
}
$ladderslist = str_replace("INSERT_HERE", $ladderscount, $ladderslist);
$display = "<html>"
. "<head>"
. "<title>Ladders</title>"
. "<link rel='stylesheet' type='text/css' href='style.css' />"
. "<meta http-equiv='Content-Type' content='text/html'; charset='utf-8' />"
. "</head>"
. "<body>"
. "<center><h1><a href='ladders.php'>Ladders (" . $ladderscount . ")</a></h1></center>"
. "<center><h2>Ladders Configuration</h2></center>"
. "<table width='100%'>"
. "<tr align='center'>" . $laddertinfo . "</tr>"
. "<tr align='center'>" . $ladderinfo . "</tr>"
. "</table>"
. "<br/>"
. "<table class='noborder' width='100%'>"
. "<tr valign='top' align='left'>" . $categorieslist . "</tr>"
. "<tr valign='top' align='left'>" . $ladderslist . "</tr>" 
. "</table>"
. "<br/>"
. "<center>"
. "<table>"
. "<tr><th><a href='tiers.php'>Tiers</a></th><th><b>Ladders</b></th></tr>"
. "</table>"
. "</center>"
. "</body>"
. "</html>";
echo $display;
?>