<?php
/* Constructing Ladder Configuration Table */
$config = file("../config");
$ladderinfo = "";
$laddertinfo = "";
foreach ($config as $line){
	if (substr_compare($line, "rated_battle_through_challenge=", 0,31) == 0){
		$laddertinfo .= "\t\t\t\t" . "<th>" . "\n"
		. "\t\t\t\t\t" . "Rated Battles via Challenges" . "\n"
		. "\t\t\t\t" . "</th>" . "\n";
		$ladderinfo .= "\t\t\t\t" . "<td>" . "\n"
		. "\t\t\t\t\t" . substr($line, 31) . "\n"
		. "\t\t\t\t" . "</td>" . "\n";
		continue;
	}
	if (substr_compare($line, "battles_with_same_ip_unrated=", 0,29) == 0){
		$laddertinfo .= "\t\t\t\t" . "<th>" . "\n"
		. "\t\t\t\t\t" . "Unrated Battles between Players of Same I.P." . "\n"
		. "\t\t\t\t" . "</th>" . "\n";
		$ladderinfo .= "\t\t\t\t" . "<td>" . "\n"
		. "\t\t\t\t\t" . substr($line, 29) . "\n"
		. "\t\t\t\t" . "</td>" . "\n";
		continue;
	}
	if (substr_compare($line, "rated_battles_memory_number=", 0,28) == 0){
		$laddertinfo .= "\t\t\t\t" . "<th>" . "\n"
		. "\t\t\t\t\t" . "Rated Battles without Same Opponent" . "\n"
		. "\t\t\t\t" . "</th>" . "\n";
		$ladderinfo .= "\t\t\t\t" . "<td>" . "\n"
		. "\t\t\t\t\t" . substr($line, 28) . "\n" 
		. "\t\t\t\t" . "</td>" . "\n";
		continue;
	}
	if (substr_compare($line, "ladder_percent_per_period=", 0,26) == 0){
		$laddertinfo .= "\t\t\t\t" . "<th>" . "\n"
		. "\t\t\t\t\t" . "% Decay per Period" . "\n"
		. "\t\t\t\t" . "</th>" . "\n";
		$ladderinfo .= "\t\t\t\t" . "<td>" . "\n" 
		. "\t\t\t\t\t" . substr($line, 26) . "\n" 
		. "\t\t\t\t" . "</td>" . "\n";
		continue;
	}
	if (substr_compare($line, "ladder_period_duration=", 0,23) == 0){
		$laddertinfo .= "\t\t\t\t" . "<th>" . "\n"
		. "\t\t\t\t\t" . "Hours per Period" . "\n"
		. "\t\t\t\t" . "</th>" . "\n";
		$ladderinfo .= "\t\t\t\t" . "<td>" . "\n"
		. "\t\t\t\t\t" . substr($line, 23) . "\n" 
		. "\t\t\t\t" . "</td>" . "\n";
		continue;
	}
	if (substr_compare($line, "ladder_max_decay=", 0,17) == 0){
		$laddertinfo .= "\t\t\t\t" . "<th>" . "\n"
		. "\t\t\t\t\t" . "% Maximum Decay" . "\n"
		. "\t\t\t\t" . "</th>" . "\n";
		$ladderinfo .= "\t\t\t\t" . "<td>" . "\n"
		. "\t\t\t\t\t" . substr($line, 17) . "\n" 
		. "\t\t\t\t" . "</td>" . "\n";
		continue;
	}
	if (substr_compare($line, "ladder_bonus_time=", 0,18) == 0){
		$laddertinfo .= "\t\t\t\t" . "<th>" . "\n"
		. "\t\t\t\t\t" . "Maximum Periods without Decay" . "\n"
		. "\t\t\t\t" . "</th>" . "\n";
		$ladderinfo .= "\t\t\t\t" . "<td>" . "\n" 
		. "\t\t\t\t\t" . substr($line, 18) . "\n" 
		. "\t\t\t\t" . "</td>" . "\n";
		continue;
	}
	if (substr_compare($line, "ladder_months_expiration=", 0,25) == 0){
		$laddertinfo .= "\t\t\t\t" . "<th>" . "\n"
		. "\t\t\t\t\t" . "Months per Expiration" . "\n"
		. "\t\t\t\t" . "</th>" . "\n";
		$ladderinfo .= "\t\t\t\t" . "<td>" . "\n" 
		. "\t\t\t\t\t" . substr($line, 25)  . "\n"
		. "\t\t\t\t" . "</td>" . "\n";
	}
}
/* Retrieving Ladder Index Information */
$xml = new DomDocument();
$xml->load("../tiers.xml");
$categories = $xml->firstChild->getElementsByTagName("category");
$categorieslist = "";
$ladderslist = "";
$ladderscount = 0;
$db = new SQLite3("../pokemon");
foreach ($categories as $category){
	if ($category->parentNode->parentNode->nodeName != "category"){
		$tiers = $category->getElementsByTagName("tier");
		$categorycount = 0;
		/* Constructing Ladder Index Table Data Cells */
		foreach($tiers as $tier){
			$tiername = $tier->getAttribute("name");
			$tablename = $tier->getAttribute("tableName");
			$result = $db->querySingle("SELECT COUNT(*) FROM " . $tablename);
			$lastcheck = $db->querySingle("SELECT last_check_time FROM " . $tablename);
			$lastcheck = date("F j, Y, g:i a", $lastcheck);
			if ($result){
				if ($categorycount == 0){
					$ladderslist .= "\t\t\t\t" . "<td class='noborder'>" . "\n";
				}
				$ladderscount++;
				$categorycount++;
				$ladderslist .= "\t\t\t\t\t" . "<form action='ladderinfo.php?tier=" . rawurlencode($tiername) . "&amp;table={$tablename}&amp;sort_field=displayed_rating&amp;sort_type=DESC&amp;count=INSERT_HERE' method='post'><input type='submit' value='{$tiername}'></form>" . "\n";
			}
		}
		/* Constructing Ladder Index Table Header Cells */
		if ($categorycount != 0){
			$categorieslist .= "\t\t\t\t" . "<th>" . "\n"
			. "\t\t\t\t\t" . "{$category->getAttribute("name")} ({$categorycount})" . "\n"
			. "\t\t\t\t" . "</th>" . "\n";
			$ladderslist .= "\t\t\t\t" . "</td>" . "\n";
		}
	}
}
$ladderslist = str_replace("INSERT_HERE", $ladderscount, $ladderslist);
/* Constructing Champion Ladder Button */
$championladder = "\t\t" . "<table class='back'>" . "\n"
. "\t\t\t" . "<tr>" . "\n"
. "\t\t\t\t" . "<td class='noborder'>" . "\n"
. "\t\t\t\t\t" . "<form action='ladderchamps.php?sort_field=displayed_rating&amp;sort_type=DESC&amp;count={$ladderscount}' method='post'><input type='submit' value='Champion Ladder'></form>" . "\n"
. "\t\t\t\t" . "</td>"  . "\n"
. "\t\t\t" . "</tr>"  . "\n"
. "\t\t" . "</table>"  . "\n";
/* Hiding Ladder Index */
$siteconfig = file("config.txt");
foreach ($siteconfig as $line){
	if (preg_match("/show_ladders=/", $line) == 1 && preg_match("/show_ladders=true/", $line) == 0){
		$ladderscount = "N/A";
		$laddertinfo = "\t\t\t\t" . "<td>" . "\n"
		. "\t\t\t\t\t" . "<i>Hidden</i>" . "\n"
		. "\t\t\t\t" . "</td>" . "\n";
		$ladderinfo = "\t\t\t\t" . "<td>" . "\n"
		. "\t\t\t\t\t" . "<i>Hidden</i>" . "\n"
		. "\t\t\t\t" . "</td>" . "\n";
		$categorieslist = "\t\t\t\t" . "<td>" . "\n"
		. "\t\t\t\t\t" . "<i>Hidden</i>" . "\n"
		. "\t\t\t\t" . "</td>" . "\n";
		$ladderslist = "\t\t\t\t" . "<td>" . "\n"
		. "\t\t\t\t\t" . "<i>Hidden</i>" . "\n"
		. "\t\t\t\t" . "</td>" . "\n";
		$lastcheck = "<i>Hidden</i>";
		$championladder = "";
	}
}
/* Including Navigation */
$sitepage = "ladders";
include "navigation.php";
/* Constructing Page */
$display = "<!DOCTYPE html>" . "\n"
. "\t" . "<head>" . "\n"
. "\t\t" . "<title>Ladders</title>" . "\n"
. "\t\t" . "<link rel='stylesheet' type='text/css' href='style.css' />" . "\n"
. "\t\t" . "<meta http-equiv='Content-Type' content='text/html;charset=utf-8' />" . "\n"
. "\t" . "</head>" . "\n"
. "\t" . "<body>" . "\n"
. "\t\t" . "<!--Navigation-->" . "\n"
. $nav
. "\t\t" . "<h1><a href='ladders.php'>Ladders ({$ladderscount})</a></h1>" . "\n"
. "\t\t" . "<!--Ladder Configuration Table-->" . "\n"
. "\t\t" . "<table>" . "\n"
. "\t\t\t" . "<caption>Ladders Configuration</caption>" . "\n"
. "\t\t\t" . "<tr>" . "\n"
. $laddertinfo
. "\t\t\t" . "</tr>" . "\n"
. "\t\t\t" . "<tr>" . "\n"
. $ladderinfo
. "\t\t\t" . "</tr>" . "\n"
. "\t\t" . "</table>" . "\n"
. "\t\t" . "<br/>" . "\n"
. "\t\t" . "<!--Champion Ladder Button-->" . "\n"
. $championladder
. "\t\t" . "<br/>" . "\n"
. "\t\t" . "<!--Ladder Information Index-->" . "\n"
. "\t\t" . "<table class='noborder'>" . "\n"
. "\t\t\t" . "<caption>Last Decay: {$lastcheck}</caption>" . "\n"
. "\t\t\t" . "<tr>" . "\n"
. $categorieslist
. "\t\t\t" . "</tr>" . "\n"
. "\t\t\t" . "<tr>" . "\n"
. $ladderslist
. "\t\t\t" . "</tr>"  . "\n"
. "\t\t" . "</table>" . "\n"
. "\t" . "</body>" . "\n"
. "</html>" . "\n";
/* Displaying Page */
echo $display;
?>