<?php
$tiername = $_GET["tier"];
$xml = new DomDocument();
$xml->load("tiers.xml");
$tiers = $xml->getElementsByTagName("tier");
$tierscount = $tiers->length;
foreach ($tiers as $tier){
	if($tier->getAttribute("name") == $tiername){
		$gen = $tier->getAttribute("gen") == 0 ? "All" : $tier->getAttribute("gen");
		$mode = array(0 => "Singles", 1 => "Doubles", 2 => "Triples");
		$mode = $mode[$tier->getAttribute("mode")];
		$teamsize = $tier->getAttribute("numberOfPokemons");
		$clauses = explode(",", $tier->getAttribute("clauses"));
		$clausescount = count($clauses);
		$clauses = implode(", ", $clauses);
		$banparent = $tier->getAttribute("banParent");
		$banparent = $banparent == "" ? "N/A" : "<form action='tierinfo.php?tier=" . urlencode($banparent) . "' method='post'><input type='submit' value='{$banparent}'></form>";
		$banmode = $tier->getAttribute("banMode") == "restrict" ? "Allowed" : "Banned";
		$pokemons = explode(",", $tier->getAttribute("pokemons"));
		$pokemonscount = $pokemons == Array(0=> "") ? "0" : count($pokemons);
		$pokemons = implode(", ", $pokemons);
		$items = explode(",", $tier->getAttribute("items"));
		$itemscount = $items == Array(0=> "") ? "0" : count($items);
		$items = implode(", ", $items);
		$moves = explode(",", $tier->getAttribute("moves"));
		$movescount = $moves == Array(0=> "") ? "0" : count($moves);
		$moves = implode(", ", $moves);
		$restrictno = $tier->getAttribute("numberOfRestricted");
		$restrictpokes = explode(",", $tier->getAttribute("restrictedPokemons"));
		$restrictcount = $restrictpokes == Array(0=> "") ? "0" : count($restrictpokes);
		$restrictpokes = implode(", ", $restrictpokes);
		$display = "<html>"
		. "<head>"
		. "<title>Tiers</title>"
		. "<link rel='stylesheet' type='text/css' href='style.css' />"
		. "<meta http-equiv='Content-Type' content='text/html'; charset='utf-8' />"
		. "</head>"
		. "<body>"
		. "<table>"
		. "<tr><th>Tiers</th><td><a href='ladders.php'>Ladders</a></td><td><a href='usage_stats/formatted/index.html'>Usage Statistics</a></td><td><a href='script.php'>Server Script</a></td></tr>"
		. "</table>"
		. "<h1><a href='tiers.php'>Tiers ({$tierscount})</a></h1>"
		. "<center><h2>{$tiername}</h2></center>" 
		. "<table width='100%'>"
		. "<tr align='center' valign='top'><th>Generation</th><th>Mode</th><th>Maximum Team Size</th><th>Maximum Level</th><th>Clauses ({$clausescount})</th><th>Ban Parent</th><th>{$banmode} Pokemon ({$pokemonscount})</th><th>{$banmode} Items ({$itemscount})</th><th>{$banmode} Moves ({$movescount})</th><th>Maximum Restricted</th><th>Restricted ({$restrictcount})</th></tr>"
		. "<tr align='center' valign='top'><td>&nbsp;{$gen}</td><td>&nbsp;{$mode}</td><td>&nbsp;{$teamsize}</td><td>&nbsp;{$tier->getAttribute("maxLevel")}</td><td>&nbsp;{$clauses}</td><td>&nbsp;{$banparent}</td><td>&nbsp;{$pokemons}</td><td>&nbsp;{$items}</td><td>&nbsp;{$moves}</td><td>&nbsp;{$restrictno}</td><td>&nbsp;{$restrictpokes}</td></tr>" 
		. "</table>"
		. "<br/>"
		. "<center><form action='tiers.php' method='link'><input type='submit' value='Back to Index'></form></center>"
		. "</body>"
		. "</html>";
		echo $display;
	}
}
?>