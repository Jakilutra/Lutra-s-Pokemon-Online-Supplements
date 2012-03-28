<?php
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
foreach ($ladderchamps as $key => $value){
	$rowcount++;
	$ladderchampionships = count($value['ladders']);
	$ladders = implode(", ", $value['ladders']);
	$standings.= "<tr align='left'><td>{$rowcount}<td>{$key}</td><td>{$ladders}</td><td>{$ladderchampionships}</td><td>{$value['displayed_rating']}</td><td>{$value['rating']}</td></tr>";
}
$caption = "<form>"
. "<caption>"
. "<select name='select' onchange='ob=this.form.select;window.location=ob.options[ob.selectedIndex].value'>"
. "<option value='ladderchamps.php?sort_field=displayed_rating&sort_type=DESC&count={$ladderscount}'>sort by total displayed rating descending</option>"
. "<option value='ladderchamps.php?sort_field=displayed_rating&sort_type=ASC&count={$ladderscount}'>sort by total displayed rating ascending</option>"
. "<option value='ladderchamps.php?sort_field=rating&sort_type=DESC&count={$ladderscount}'>sort by total actual rating descending</option>"
. "<option value='ladderchamps.php?sort_field=rating&sort_type=ASC&count={$ladderscount}'>sort by total actual rating ascending</option>"
. "<option value='ladderchamps.php?sort_field=count&sort_type=DESC&count={$ladderscount}'>sort by total ladder championships descending</option>"
. "<option value='ladderchamps.php?sort_field=count&sort_type=ASC&count={$ladderscount}'>sort by total ladder championships ascending</option>"
. "<option value='ladderchamps.php?sort_field=name&sort_type=DESC&count={$ladderscount}'>sort by name descending</option>"
. "<option value='ladderchamps.php?sort_field=name&sort_type=ASC&count={$ladderscount}'>sort by name ascending</option>"
. "</select>"
. "</caption>"
. "</form>";
$currentfile = $_SERVER["PHP_SELF"];
$currentfile = explode("/", $currentfile);
$currentfile = $currentfile[count($currentfile) - 1];
$path = $currentfile . "?" . urldecode($_SERVER["QUERY_STRING"]);
$caption = str_replace("<option value='{$path}'>", "<option selected='selected' value='{$path}'>", $caption);
$tstandings = "<tr align='left'><th>Rank</th><th>Name</th><th>Ladders Top In</th><th>Total Ladder Championships</th><th> Total Displayed Rating</th><th>Total Actual Rating</th></tr>";
$championladder = "Champion Ladder";
$siteconfig = file("config.txt");
foreach ($siteconfig as $line){
	if (preg_match("/show_ladders=/", $line) == 1 && preg_match("/show_ladders=true/", $line) == 0){
		$caption = "<i>Hidden</i>";
		$ladderscount = "N/A";
		$tstandings = "<tr><th><i>Hidden</i></th></tr>";
		$standings = "<tr><td><i>Hidden</i></td></tr>";
		$championladder = "Hidden";
	}
}
$sitepage = "ladders";
include "navigation.php";
$display = "<html>"
. "<head>"
. "<title>Ladders</title>"
. "<link rel='stylesheet' type='text/css' href='style.css' />"
. "<meta http-equiv='Content-Type' content='text/html'; charset='utf-8' />"
. "</head>"
. "<body>"
. $nav
. "<h1><a href='ladders.php'>Ladders ({$ladderscount})</a></h1>"
. "<center><h2>{$championladder}</h2></center>"
. "<center>"
. "<table width='70%'>"
. $caption
. $tstandings
. $standings
. "</table>"
. "</center>"
. "<br/>"
. "<center><form action='ladders.php' method='link'><input type='submit' value='Back to Index'></form></center>"
. "</body>"
. "</html>";
echo $display;
?>