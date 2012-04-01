<?php
/* Retrieving Ladder Information */
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
	/* Constructing Ladder Information Table Data Cells */
	$standings .= "\t\t\t" . "<tr>" . "\n"
	. "\t\t\t\t" . "<td>" . "\n"
	. "\t\t\t\t\t" . "{$rowcount}" . "\n"
	. "\t\t\t\t" . "</td>" . "\n"
	. "\t\t\t\t" . "<td>" . "\n"
	. "\t\t\t\t\t" . "{$row['name']}" . "\n"
	. "\t\t\t\t" . "</td>" . "\n"
	. "\t\t\t\t" . "<td>" . "\n"
	. "\t\t\t\t\t" . "{$row['matches']}" . "\n"
	. "\t\t\t\t" . "</td>" . "\n"
	. "\t\t\t\t" . "<td>" . "\n"
	. "\t\t\t\t\t" . "{$row['displayed_rating']}" . "\n"
	. "\t\t\t\t" . "</td>" . "\n"
	. "\t\t\t\t" . "<td>" . "\n"
	. "\t\t\t\t\t" . "{$row['rating']}" . "\n"
	. "\t\t\t\t" . "</td>" . "\n"
	. "\t\t\t\t" . "<td>" . "\n"
	. "\t\t\t\t\t" . floor($row['bonus_time']/-86400) . "\n"
	. "\t\t\t\t" . "</td>" . "\n"
	. "\t\t\t" . "</tr>" . "\n";
}
/* Constructing Sort Form */
$caption = "\t\t\t" . "<caption>" . "\n"
. "\t\t\t\t" . "<form>" . "\n"
. "\t\t\t\t\t" . "<select name='select' onchange='ob=this.form.select;window.location=ob.options[ob.selectedIndex].value'>" . "\n"
. "\t\t\t\t\t\t" . "<option value='ladderinfo.php?tier={$tiername}&amp;table={$tablename}&amp;sort_field=displayed_rating&amp;sort_type=DESC&amp;count={$ladderscount}'>sort by displayed rating descending</option>" . "\n"
. "\t\t\t\t\t\t" . "<option value='ladderinfo.php?tier={$tiername}&amp;table={$tablename}&amp;sort_field=displayed_rating&amp;sort_type=ASC&amp;count={$ladderscount}'>sort by displayed rating ascending</option>" . "\n"
. "\t\t\t\t\t\t" . "<option value='ladderinfo.php?tier={$tiername}&amp;table={$tablename}&amp;sort_field=rating&amp;sort_type=DESC&amp;count={$ladderscount}'>sort by actual rating descending</option>" . "\n"
. "\t\t\t\t\t\t" . "<option value='ladderinfo.php?tier={$tiername}&amp;table={$tablename}&amp;sort_field=rating&amp;sort_type=ASC&amp;count={$ladderscount}'>sort by actual rating ascending</option>" . "\n"
. "\t\t\t\t\t\t" . "<option value='ladderinfo.php?tier={$tiername}&amp;table={$tablename}&amp;sort_field=name&amp;sort_type=DESC&amp;count={$ladderscount}'>sort by name descending</option>" . "\n"
. "\t\t\t\t\t\t" . "<option value='ladderinfo.php?tier={$tiername}&amp;table={$tablename}&amp;sort_field=name&amp;sort_type=ASC&amp;count={$ladderscount}'>sort by name ascending</option>" . "\n"
. "\t\t\t\t\t\t" . "<option value='ladderinfo.php?tier={$tiername}&amp;table={$tablename}&amp;sort_field=matches&amp;sort_type=DESC&amp;count={$ladderscount}'>sort by number of battles descending</option>" . "\n"
. "\t\t\t\t\t\t" . "<option value='ladderinfo.php?tier={$tiername}&amp;table={$tablename}&amp;sort_field=matches&amp;sort_type=ASC&amp;count={$ladderscount}'>sort by number of battles ascending</option>" . "\n"
. "\t\t\t\t\t\t" . "<option value='ladderinfo.php?tier={$tiername}&amp;table={$tablename}&amp;sort_field=bonus_time&amp;sort_type=ASC&amp;count={$ladderscount}'>sort by days without play descending</option>" . "\n"
. "\t\t\t\t\t\t" . "<option value='ladderinfo.php?tier={$tiername}&amp;table={$tablename}&amp;sort_field=bonus_time&amp;sort_type=DESC&amp;count={$ladderscount}'>sort by days without play ascending</option>" . "\n"
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
/* Constructing Ladder Information Table Header Cells */
$tstandings = "\t\t\t" . "<tr>" . "\n"
. "\t\t\t\t" . "<th>" . "\n"
. "\t\t\t\t\t" . "Ranking" . "\n"
. "\t\t\t\t" . "</th>" . "\n"
. "\t\t\t\t" . "<th>" . "\n"
. "\t\t\t\t\t" . "Name" . "\n"
. "\t\t\t\t" . "</th>" . "\n"
. "\t\t\t\t" . "<th>" . "\n"
. "\t\t\t\t\t" . "Number of Battles" . "\n"
. "\t\t\t\t" . "</th>" . "\n"
. "\t\t\t\t" . "<th>" . "\n"
. "\t\t\t\t\t" . "Displayed Rating" . "\n"
. "\t\t\t\t" . "</th>" . "\n"
. "\t\t\t\t" . "<th>" . "\n"
. "\t\t\t\t\t" . "Actual Rating" . "\n"
. "\t\t\t\t" . "</th>" . "\n"
. "\t\t\t\t" . "<th>" . "\n"
. "\t\t\t\t\t" . "Days without Play" . "\n"
. "\t\t\t\t" . "</th>" . "\n"
. "\t\t\t" . "</tr>" . "\n";
/* Hiding Ladder Information Table */
$siteconfig = file("config.txt");
foreach ($siteconfig as $line){
	if (preg_match("/show_ladders=/", $line) == 1 && preg_match("/show_ladders=true/", $line) == 0){
		$caption = "\t\t\t" . "<caption>" . "\n"
		. "\t\t\t\t" . "<i>Hidden</i>" . "\n"
		. "\t\t\t" . "</caption>" . "\n";
		$ladderscount = "N/A";
		$tiername = "<i>Hidden</i>";
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
."\t\t" .  "<meta http-equiv='Content-Type' content='text/html;charset=utf-8' />" . "\n"
. "\t" . "</head>" . "\n"
. "\t" . "<body>" . "\n"
. "\t\t" . "<!--Navigation-->" . "\n"
. $nav
. "\t\t" . "<h1><a href='ladders.php'>Ladders ({$ladderscount})</a></h1>" . "\n"
. "\t\t" . "<h2><a href='{$path}'> Ladder for {$tiername}</a></h2>" . "\n"
. "\t\t" . "<!--Ladder Information Table-->" . "\n"
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