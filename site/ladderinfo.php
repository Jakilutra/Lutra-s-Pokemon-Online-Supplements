<?php
$ladderscount = $_GET["count"];
$tiername = $_GET["tier"];
$tablename = $_GET["table"];
$db = new SQLite3("../pokemon");
$results = $db->query("SELECT * FROM " . $tablename . " ORDER BY displayed_rating DESC");
$standings = "";
$rowcount = 0;
while ($row = $results->fetchArray()) {
	$rowcount++;
	$standings .= "<tr align='left'><td>{$rowcount}</td><td>{$row['name']}</td><td>{$row['matches']}</td><td>{$row['displayed_rating']}</td><td>{$row['rating']}</td></tr>";
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
. "<center><h2> Ladder for {$tiername}</h2></center>"
. "<center>"
. "<table width='50%'>"
. "<tr align='left'><th>Ranking</th><th>Name</th><th>Number of Battles</th><th>Displayed Rating</th><th>Actual Rating</th></tr>"
. $standings
. "</table>"
. "</center>"
. "<br/>"
. "<center><form action='ladders.php' method='link'><input type='submit' value='Back to Index'></form></center>"
. "</body>"
. "</html>";
echo $display;
?>