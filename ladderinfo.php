<?php
$ladderscount = $_GET["count"];
$tiername = $_GET["tier"];
$ladderfile = file("tier_" . $tiername . ".txt");
$ladderinfo = array();
$ratings = array();
$rankings = array();
$standings = array();
foreach ($ladderfile as $player){
	$player = explode ("%", $player);
	if (in_array($player[3], $ratings) == false){
		array_push($ratings, $player[3]);
	}
	if (is_string($ladderinfo[$player[3]])){
		$ladderinfo[$player[3]] .= "<tr align='left'><td>" . $player[0] . "</td><td>" . $player[1] . "</td><td>" . $player[3] . "</td><td>" . $player[2] . "</td></tr>";
	}
	else {
		$ladderinfo[$player[3]] = "<tr align='left'><td>" . $player[0] . "</td><td>" . $player[1] . "</td><td>" . $player[3] . "</td><td>" . $player[2] . "</td></tr>";
	}
}
sort($ratings, SORT_NUMERIC);
$ratings = array_reverse($ratings);
foreach ($ratings as $rating){
	array_push($rankings,$ladderinfo[$rating]);
}
$rankings = implode("", $rankings);
$rankings = explode("<tr align='left'>", $rankings);
$rankingscount = count($rankings)-1;
for ($i=1;$i <$rankingscount+1;$i++){
	array_push($standings, "<td>{$i}</td>" . $rankings[$i]);
}
$standings = implode("<tr align='left'>", $standings);
$display = "<html>"
. "<head>"
. "<title>Ladders</title>"
. "<link rel='stylesheet' type='text/css' href='style.css' />"
. "<meta http-equiv='Content-Type' content='text/html'; charset='utf-8' />"
. "</head>"
. "<body>"
. "<center><h1><a href='ladders.php'>Ladders (" . $ladderscount . ")</a></h1></center>"
. "<center><h2> Ladder for " . $tiername . "</h1></center>"
. "<center>"
. "<table width='50%'>"
. "<tr align='left'><th>Ranking</th><th>Name</th><th>Number of Battles</th><th>Displayed Rating</th><th>Actual Rating</th></tr>"
. $standings
. "</table>"
. "</center>"
. "<br/>"
. "<center><form action='ladders.php' method='link'><input type='submit' value='Back to Index'></form></center>"
. "<br/>"
. "<center>"
. "<table>"
. "<tr><td><a href='tiers.php'>Tiers</a></td><th>Ladders</th></tr>"
. "</table>"
. "</center>"
. "</body>"
. "</html>";
echo $display;
?>