<?php
$tiername = $_GET["tier"];
$ladderfile = file_get_contents("tier_" . $tiername . ".txt");
$ladderfile = explode ("%-", $ladderfile);
$ladderinfo = array();
$ratings = array();
$rankings = array();
foreach ($ladderfile as $player){
	if ($player != $ladderfile[0]){
		$player = substr($player, 7);
	}
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
$rankingscount = count($rankings)-2;
$standings = array();
for ($i=1;$i <$rankingscount+1;$i++){
	array_push($standings, "<td>{$i}</td>" . $rankings[$i]);
}
$standings = implode("<tr align='left'>", $standings);
$display = "<center><h1> Ladder for " . $tiername . "</h1></center>"
. "<table width='100%'>"
. "<tr align='left'><th>Ranking</th><th>Name</th><th>Number of Battles</th><th>Displayed Rating</th><th>Actual Rating</th></tr>"
. $standings
. "</table>"
. "<br/>"
. "<center><form action='ladders.php' method='link'><input type='submit' value='Back to Index'></form></center>";
echo $display;
?>