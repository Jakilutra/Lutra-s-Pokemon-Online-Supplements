<?php
/* Retrieving Champion Ladder Information */
$sort_field = $_GET["sort_field"];
$sort_type = $_GET["sort_type"];
$ladderscount = $_GET["count"];
$db = new SQLite3("../pokemon");
$xml = new DomDocument();
$xml->load("../tiers.xml");
$tiers = $xml->getElementsByTagName("tier");
$ladderchamps = array();
$standings = "";
$rowcount = 0;
foreach ($tiers as $tier){
	$tiername = $tier->getAttribute("name");
	$tablename = $tier->getAttribute("tableName");
	$result = $db->querySingle("SELECT COUNT(*) FROM " . $tablename);
	if ($result){
		$results = $db->query("SELECT * FROM " . $tablename . " WHERE displayed_rating = (SELECT MAX(displayed_rating) FROM " . $tablename . ")");
		while ($row = $results->fetchArray()) {
			if (isset($ladderchamps[$row['name']]) == false){
				$ladderchamps[$row['name']] = array();
				$ladderchamps[$row['name']]['ladders'] = array();
				$ladderchamps[$row['name']]['count'] = 0;
				$ladderchamps[$row['name']]['displayed_rating'] = 0;
				$ladderchamps[$row['name']]['rating'] = 0;
			}
			$ladderchamps[$row['name']]['count']++;
			array_push($ladderchamps[$row['name']]['ladders'], $tiername);
			$ladderchamps[$row['name']]['displayed_rating'] += $row['displayed_rating'];
			$ladderchamps[$row['name']]['rating'] += $row['rating'];
		}
	}
}
if ($sort_field == "name"){
	ksort($ladderchamps);
	if ($sort_type == "ASC"){
		krsort($ladderchamps);
	}
}
else {
	function sortByOrder($a, $b) {
		if ($a[$GLOBALS["sort_field"]] == $b[$GLOBALS["sort_field"]]) {
			return 0;
		}
		if ($GLOBALS["sort_type"] == "DESC"){
			return ($a[$GLOBALS["sort_field"]] > $b[$GLOBALS["sort_field"]]) ? -1 : 1;
		}
		else {
			return ($a[$GLOBALS["sort_field"]] < $b[$GLOBALS["sort_field"]]) ? -1 : 1;
		}
	}
	uasort($ladderchamps, 'sortByOrder');
}
/* Constructing Champion Ladder Table Data Cells */
foreach ($ladderchamps as $key => $value){
	$rowcount++;
	$ladderchampionships = count($value['ladders']);
	$ladders = implode(", ", $value['ladders']);
	$standings.= "\t\t\t" . "<tr>" . "\n"
	. "\t\t\t\t" . "<td>" . "\n"
	. "\t\t\t\t\t" . "{$rowcount}" . "\n"
	. "\t\t\t\t" .  "</td>" . "\n"
	. "\t\t\t\t" . "<td>" . "\n"
	. "\t\t\t\t\t" . "{$key}" . "\n"
	. "\t\t\t\t" . "</td>" . "\n"
	. "\t\t\t\t" . "<td>" . "\n"
	. "\t\t\t\t\t" . "{$ladders}" . "\n"
	. "\t\t\t\t" . "</td>" . "\n"
	. "\t\t\t\t" . "<td>" . "\n"
	. "\t\t\t\t\t" . "{$ladderchampionships}" . "\n"
	. "\t\t\t\t" . "</td>" . "\n"
	. "\t\t\t\t" . "<td>" . "\n"
	. "\t\t\t\t\t" . "{$value['displayed_rating']}" . "\n"
	. "\t\t\t\t" . "</td>" . "\n"
	. "\t\t\t\t" . "<td>" . "\n"
	. "\t\t\t\t\t" . "{$value['rating']}" . "\n"
	. "\t\t\t\t" . "</td>" . "\n"
	. "\t\t\t" . "</tr>" . "\n";
}
/* Constructing Sort Form */
$caption = "\t\t\t" . "<caption>" . "\n"
. "\t\t\t\t" . "<form>" . "\n"
. "\t\t\t\t\t" . "<select name='select' onchange='ob=this.form.select;window.location=ob.options[ob.selectedIndex].value'>" . "\n"
. "\t\t\t\t\t\t" . "<option value='ladderchamps.php?sort_field=displayed_rating&amp;sort_type=DESC&amp;count={$ladderscount}'>sort by total displayed rating descending</option>" . "\n"
. "\t\t\t\t\t\t" . "<option value='ladderchamps.php?sort_field=displayed_rating&amp;sort_type=ASC&amp;count={$ladderscount}'>sort by total displayed rating ascending</option>" . "\n"
. "\t\t\t\t\t\t" . "<option value='ladderchamps.php?sort_field=rating&amp;sort_type=DESC&amp;count={$ladderscount}'>sort by total actual rating descending</option>" . "\n"
. "\t\t\t\t\t\t" . "<option value='ladderchamps.php?sort_field=rating&amp;sort_type=ASC&amp;count={$ladderscount}'>sort by total actual rating ascending</option>" . "\n"
. "\t\t\t\t\t\t" . "<option value='ladderchamps.php?sort_field=count&amp;sort_type=DESC&amp;count={$ladderscount}'>sort by total ladder championships descending</option>" . "\n"
. "\t\t\t\t\t\t" . "<option value='ladderchamps.php?sort_field=count&amp;sort_type=ASC&amp;count={$ladderscount}'>sort by total ladder championships ascending</option>" . "\n"
. "\t\t\t\t\t\t" . "<option value='ladderchamps.php?sort_field=name&amp;sort_type=DESC&amp;count={$ladderscount}'>sort by name descending</option>" . "\n"
."\t\t\t\t\t\t" .  "<option value='ladderchamps.php?sort_field=name&amp;sort_type=ASC&amp;count={$ladderscount}'>sort by name ascending</option>" . "\n"
. "\t\t\t\t\t" . "</select>" . "\n"
. "\t\t\t\t" . "</form>" . "\n"
. "\t\t\t" . "</caption>" . "\n";
/* Retrieving Page URL*/
$currentfile = $_SERVER["PHP_SELF"];
$currentfile = explode("/", $currentfile);
$currentfile = $currentfile[count($currentfile) - 1];
$path = $currentfile . "?" . $_SERVER["QUERY_STRING"];
$path = str_replace("&", "&amp;", $path);
/* Selecting Current Sorting Option */
$caption = str_replace("<option value='" . urldecode($path) . "'>", "<option selected='selected' value='{$path}'>", $caption);
/* Constructing Champion Ladder Table Header Cells */
$tstandings = "\t\t\t" . "<tr>" . "\n"
. "\t\t\t\t" . "<th>". "\n"
. "\t\t\t\t\t" . "Rank". "\n"
. "\t\t\t\t" . "</th>". "\n"
. "\t\t\t\t" . "<th>". "\n"
. "\t\t\t\t\t" . "Name". "\n"
. "\t\t\t\t" . "</th>". "\n"
. "\t\t\t\t" . "<th>". "\n"
. "\t\t\t\t\t" . "Ladders Top In". "\n"
. "\t\t\t\t" . "</th>". "\n"
. "\t\t\t\t" . "<th>". "\n"
. "\t\t\t\t\t" . "Total Ladder Championships". "\n"
. "\t\t\t\t" . "</th>". "\n"
. "\t\t\t\t" . "<th>". "\n"
. "\t\t\t\t\t" . "Total Displayed Rating". "\n"
. "\t\t\t\t" . "</th>". "\n"
. "\t\t\t\t" . "<th>". "\n"
. "\t\t\t\t\t" . "Total Actual Rating". "\n"
. "\t\t\t\t" . "</th>". "\n"
. "\t\t\t" . "</tr>". "\n";
/* Constructing Champion Ladder Header Content */
$championladder = "<a href='{$path}'> Champion Ladder</a>";
/* Hiding Champion Ladder Table */
$siteconfig = file("config.txt");
foreach ($siteconfig as $line){
	if (preg_match("/show_ladders=/", $line) == 1 && preg_match("/show_ladders=true/", $line) == 0){
		$caption = "\t\t\t" . "<caption>" . "\n"
		. "\t\t\t\t" . "<i>Hidden</i>" . "\n"
		. "\t\t\t" . "</caption>" . "\n";
		$ladderscount = "N/A";
		$tstandings = "\t\t\t" . "<tr>" . "\n"
		. "\t\t\t\t" . "<td>" . "\n"
		. "\t\t\t\t\t" . "<i>Hidden</i>" . "\n"
		. "\t\t\t\t" . "</td>" . "\n"
		. "\t\t\t" . "</tr>" . "\n";
		$standings = "\t\t\t" . "<tr>" . "\n"
		. "\t\t\t\t" . "<td>" . "\n"
		. "\t\t\t\t\t" . "<i>Hidden</i>" . "\n"
		. "\t\t\t\t" . "</td>" . "\n"
		. "\t\t\t" . "</tr>" . "\n";
		$championladder = "Hidden";
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
. "\t\t" . "<h2>{$championladder}</h2>" . "\n"
. "\t\t" . "<!--Champion Ladder Table-->" . "\n"
. "\t\t" . "<table class='ladder'>" . "\n"
. $caption
. $tstandings
. $standings
. "\t\t" . "</table>" . "\n"
. "\t\t" . "<br/>" . "\n"
. "\t\t" . "<!--Back to Index Link-->" . "\n"
. "\t\t" . "<table class='back'>" . "\n"
. "\t\t\t" . "<tr>" . "\n"
. "\t\t\t\t" . "<td class='noborder'>" . "\n"
. "\t\t\t\t\t" . "<form action='ladders.php' method='get'><input type='submit' value='Back to Index' /></form>" . "\n"
. "\t\t\t\t" . "</td>" . "\n"
. "\t\t\t" . "</tr>" . "\n"
. "\t\t" . "</table>" . "\n"
. "\t" . "</body>" . "\n"
. "</html>" . "\n";
/* Displaying Page */
echo $display;
?>