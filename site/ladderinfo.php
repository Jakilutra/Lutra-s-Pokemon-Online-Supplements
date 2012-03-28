<?php
$ladderscount = $_GET["count"];
$tiername = $_GET["tier"];
$tablename = $_GET["table"];
$sort_field = $_GET["sort_field"];
$sort_type = $_GET["sort_type"];
$db = new SQLite3("../pokemon");
$results = $db->query("SELECT * FROM " . $tablename . " ORDER BY " . $sort_field . " " . $sort_type);
$standings = "";
$rowcount = 0;
while ($row = $results->fetchArray()) {
	$rowcount++;
	$standings .= "<tr align='left'><td>{$rowcount}</td><td>{$row['name']}</td><td>{$row['matches']}</td><td>{$row['displayed_rating']}</td><td>{$row['rating']}</td><td>" . floor($row['bonus_time']/-86400) . "</td></tr>";
}
$caption = "<form>"
. "<caption>"
. "<select name='select' onchange='ob=this.form.select;window.location=ob.options[ob.selectedIndex].value'>"
. "<option value='ladderinfo.php?tier={$tiername}&table={$tablename}&sort_field=displayed_rating&sort_type=DESC&count={$ladderscount}'>sort by displayed rating descending</option>"
. "<option value='ladderinfo.php?tier={$tiername}&table={$tablename}&sort_field=displayed_rating&sort_type=ASC&count={$ladderscount}'>sort by displayed rating ascending</option>"
. "<option value='ladderinfo.php?tier={$tiername}&table={$tablename}&sort_field=rating&sort_type=DESC&count={$ladderscount}'>sort by actual rating descending</option>"
. "<option value='ladderinfo.php?tier={$tiername}&table={$tablename}&sort_field=rating&sort_type=ASC&count={$ladderscount}'>sort by actual rating ascending</option>"
. "<option value='ladderinfo.php?tier={$tiername}&table={$tablename}&sort_field=name&sort_type=DESC&count={$ladderscount}'>sort by name descending</option>"
. "<option value='ladderinfo.php?tier={$tiername}&table={$tablename}&sort_field=name&sort_type=ASC&count={$ladderscount}'>sort by name ascending</option>"
. "<option value='ladderinfo.php?tier={$tiername}&table={$tablename}&sort_field=matches&sort_type=DESC&count={$ladderscount}'>sort by number of battles descending</option>"
. "<option value='ladderinfo.php?tier={$tiername}&table={$tablename}&sort_field=matches&sort_type=ASC&count={$ladderscount}'>sort by number of battles ascending</option>"
. "<option value='ladderinfo.php?tier={$tiername}&table={$tablename}&sort_field=bonus_time&sort_type=ASC&count={$ladderscount}'>sort by days without play descending</option>"
. "<option value='ladderinfo.php?tier={$tiername}&table={$tablename}&sort_field=bonus_time&sort_type=DESC&count={$ladderscount}'>sort by days without play ascending</option>"
. "</select>"
. "</caption>"
. "</form>";
$currentfile = $_SERVER["PHP_SELF"];
$currentfile = explode("/", $currentfile);
$currentfile = $currentfile[count($currentfile) - 1];
$path = $currentfile . "?" . urldecode($_SERVER["QUERY_STRING"]);
$caption = str_replace("<option value='{$path}'>", "<option selected='selected' value='{$path}'>", $caption);
$tstandings = "<tr align='left'><th>Ranking</th><th>Name</th><th>Number of Battles</th><th>Displayed Rating</th><th>Actual Rating</th><th>Days without Play</th></tr>";
$siteconfig = file("config.txt");
foreach ($siteconfig as $line){
	if (preg_match("/show_ladders=/", $line) == 1 && preg_match("/show_ladders=true/", $line) == 0){
		$caption = "<i>Hidden</i>";
		$ladderscount = "N/A";
		$tiername = "<i>Hidden</i>";
		$tstandings = "<tr><th><i>Hidden</i></th></tr>";
		$standings = "<tr><td><i>Hidden</i></td></tr>";
	}
}
$sitepage = "ladders";
include "navigation.php";
$display = "<html>"
. "<head>"
. "<title>Ladders</title>"
. "<link rel='stylesheet' type='text/css' href='style.css' />"
. "<meta http-equiv='Content-Type' content='text/html' charset='utf-8' />"
. "</head>"
. "<body>"
. $nav
. "<h1><a href='ladders.php'>Ladders ({$ladderscount})</a></h1>"
. "<center><h2> Ladder for {$tiername}</h2></center>"
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