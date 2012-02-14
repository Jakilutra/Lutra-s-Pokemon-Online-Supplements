<?php
$tiername = $_GET["tier"];
$xml = new DomDocument();
$xml->load("tiers.xml");
$tiers = $xml->getElementsByTagName("tier");
foreach ($tiers as $tier){
	if($tier->getAttribute("name") == $tiername){
		$gen = $tier->getAttribute("gen") == 0 ? "All" : $tier->getAttribute("gen");
		$mode = array(0 => "Singles", 1 => "Doubles", 2 => "Triples");
		$mode = $mode[$tier->getAttribute("mode")];
		$teamsize = $tier->getAttribute("numberOfPokemons");
		$clauses = explode(",", $tier->getAttribute("clauses"));
		$clauses = implode(", ", $clauses);
		$banparent = $tier->getAttribute("banParent");
		$banparent = "<a href='tierinfo.php?tier=" . urlencode($banparent) . "'>" . $banparent . "</a>";
		$banmode = $tier->getAttribute("banMode") == "restrict" ? "Allowed" : "Banned";
		$pokemons = explode(",", $tier->getAttribute("pokemons"));
		$pokemons = implode(", ", $pokemons);
		$items = explode(",", $tier->getAttribute("items"));
		$items = implode(", ", $items);
		$moves = explode(",", $tier->getAttribute("moves"));
		$moves = implode(", ", $moves);
		$restrictno = $tier->getAttribute("numberOfRestricted");
		$restrictpokes = explode(",", $tier->getAttribute("restrictedPokemons"));
		$restrictpokes = implode(", ", $restrictpokes);
		$display = "<center><h1>" . $tiername . "</h1></center>" 
		. "<table width='100%'>"
		. "<tr align='center' valign='top'><th>Generation</th><th>Mode</th><th>Maximum Team Size</th><th>Maximum Level</th><th>Clauses</th><th>Ban Parent</th><th>" . $banmode . " Pokemon</th><th>" . $banmode . " Items</th><th>" . $banmode . " Moves</th><th>Maximum Restricted</th><th>Restricted</th></tr>"
		. "<tr align='center' valign='top'>" . "<td>" . $gen . "</td>" . "<td>" . $mode . "</td>" . "<td>" . $teamsize . "</td>" . "<td>" . $tier->getAttribute("maxLevel") . "</td>" . "<td>" . $clauses . "</td>" . "<td>" . $banparent . "</td>" . "<td>" . $pokemons . "</td>" . "<td>" . $items . "</td>" . "<td>" . $moves . "</td>" . "<td>" . $restrictno . "</td>" . "<td>" . $restrictpokes . "</td>" . "</tr>" 
		. "</table>";
		echo $display;
	}
}
?>