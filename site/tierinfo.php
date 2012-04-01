<?php
/* Retrieving Tier Information */
$tiername = $_GET["tier"];
$xml = new DomDocument();
$xml->load("../tiers.xml");
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
		$banparent = $banparent == "" ? "N/A" : "<form action='tierinfo.php?tier=" . rawurlencode($banparent) . "' method='post'><input type='submit' value='{$banparent}'></form>";
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
		/* Constructing Tier Information Table Header Cells*/
		$tiertinfo = "\t\t\t" . "<tr>" . "\n"
		. "\t\t\t\t" . "<th>". "\n"
		. "\t\t\t\t\t" . "Generation" . "\n" 
		. "\t\t\t\t" . "</th>" . "\n"
		. "\t\t\t\t" . "<th>" . "\n"
		. "\t\t\t\t\t" . "Mode" . "\n"
		. "\t\t\t\t" . "</th>" . "\n"
		. "\t\t\t\t" . "<th>" . "\n"
		. "\t\t\t\t\t" . "Maximum Team Size" . "\n"
		. "\t\t\t\t" . "</th>" . "\n"
		. "\t\t\t\t" . "<th>" . "\n" 
		. "\t\t\t\t\t" . "Maximum Level" . "\n"
		. "\t\t\t\t" . "</th>" . "\n"
		. "\t\t\t\t" . "<th>" . "\n" 
		. "\t\t\t\t\t" . "Clauses ({$clausescount})" . "\n"
		. "\t\t\t\t" . "</th>" . "\n"
		. "\t\t\t\t" . "<th>" . "\n"
		. "\t\t\t\t\t" . "Ban Parent" . "\n"
		. "\t\t\t\t" . "</th>" . "\n"
		. "\t\t\t\t" . "<th>" . "\n"
		. "\t\t\t\t\t" . "{$banmode} Pokemon ({$pokemonscount})" . "\n"
		. "\t\t\t\t" . "</th>" . "\n"
		. "\t\t\t\t" . "<th>" . "\n"
		. "\t\t\t\t\t" . "{$banmode} Items ({$itemscount})" . "\n"
		. "\t\t\t\t" . "</th>" . "\n"
		. "\t\t\t\t" . "<th>" . "\n"
		. "\t\t\t\t\t" . "{$banmode} Moves ({$movescount})" . "\n"
		. "\t\t\t\t" . "</th>" . "\n"
		. "\t\t\t\t" . "<th>" . "\n"
		. "\t\t\t\t\t" . "Maximum Restricted" . "\n"
		. "\t\t\t\t" . "</th>" . "\n"
		. "\t\t\t\t" . "<th>" . "\n"
		. "\t\t\t\t\t" . "Restricted ({$restrictcount})" . "\n"
		. "\t\t\t\t" . "</th>" . "\n"
		. "\t\t\t" . "</tr>" . "\n";
		/* Constructing Tier Information Table Data Cells*/
		$tierinfo = "\t\t\t" . "<tr>" . "\n"
		. "\t\t\t\t" . "<td>" . "\n"
		. "\t\t\t\t\t" . "&nbsp;{$gen}" . "\n"
		. "\t\t\t\t" . "</td>" . "\n"
		. "\t\t\t\t" . "<td>" . "\n"
		. "\t\t\t\t\t" . "&nbsp;{$mode}" . "\n"
		. "\t\t\t\t" . "</td>" . "\n"
		. "\t\t\t\t" .  "<td>" . "\n"
		. "\t\t\t\t\t" . "&nbsp;{$teamsize}" . "\n"
		. "\t\t\t\t" . "</td>" . "\n"
		. "\t\t\t\t" . "<td>" . "\n"
		. "\t\t\t\t\t" . "&nbsp;{$tier->getAttribute("maxLevel")}" . "\n"
		. "\t\t\t\t" .  "</td>" . "\n"
		. "\t\t\t\t" . "<td>" . "\n"
		. "\t\t\t\t\t" . "&nbsp;{$clauses}" . "\n"
		. "\t\t\t\t" . "</td>" . "\n"
		. "\t\t\t\t" . "<td>" . "\n"
		. "\t\t\t\t\t" . "&nbsp;{$banparent}" . "\n"
		. "\t\t\t\t" . "</td>" . "\n"
		. "\t\t\t\t" . "<td>" . "\n"
		. "\t\t\t\t\t" . "&nbsp;{$pokemons}" . "\n"
		. "\t\t\t\t" . "</td>" . "\n"
		. "\t\t\t\t" . "<td>" . "\n"
		. "\t\t\t\t\t" . "&nbsp;{$items}" . "\n"
		. "\t\t\t\t" . "</td>" . "\n"
		. "\t\t\t\t" . "<td>" . "\n"
		. "\t\t\t\t\t" . "&nbsp;{$moves}" . "\n"
		. "\t\t\t\t" . "</td>" . "\n"
		. "\t\t\t\t" . "<td>" . "\n"
		. "\t\t\t\t\t" . "&nbsp;{$restrictno}" . "\n"
		. "\t\t\t\t" . "</td>" . "\n"
		. "\t\t\t\t" . "<td>" . "\n"
		. "\t\t\t\t\t" . "&nbsp;{$restrictpokes}" . "\n"
		. "\t\t\t\t" . "</td>" . "\n"
		. "\t\t\t" . "</tr>" . "\n";
		/* Retrieving Page URL*/
		$currentfile = $_SERVER["PHP_SELF"];
		$currentfile = explode("/", $currentfile);
		$currentfile = $currentfile[count($currentfile) - 1];
		$path = $currentfile . "?" . $_SERVER["QUERY_STRING"];
		/* Hiding Tier Information */
		$siteconfig = file("config.txt");
		foreach ($siteconfig as $line){
			if (preg_match("/show_tiers=/", $line) == 1 && preg_match("/show_tiers=true/", $line) == 0){
				$tierscount = "N/A";
				$tiername = "<i>Hidden</i>";
				$tiertinfo = "\t\t\t" . "<tr>" . "\n"
				. "\t\t\t\t" . "<td>" . "\n"
				. "\t\t\t\t\t" . "<i>Hidden</i>" . "\n"
				. "\t\t\t\t" . "</td>" . "\n"
				. "\t\t\t" . "</tr>" . "\n";
				$tierinfo = "\t\t\t" . "<tr>" . "\n"
				. "\t\t\t\t" . "<td>" . "\n"
				. "\t\t\t\t\t" . "<i>Hidden</i>" . "\n"
				. "\t\t\t\t" . "</td>" . "\n"
				. "\t\t\t" . "</tr>" . "\n";
			}
		}
		/* Including Navigation */
		$sitepage = "tiers";
		include "navigation.php";
		/* Constructing Page */
		$display = "<!DOCTYPE html>" . "\n"
		. "\t" . "<head>" . "\n"
		. "\t\t" . "<title>Tiers</title>" . "\n"
		. "\t\t" . "<link rel='stylesheet' type='text/css' href='style.css' />" . "\n"
		. "\t\t" . "<meta http-equiv='Content-Type' content='text/html;charset=utf-8' />" . "\n"
		. "\t" . "</head>" . "\n"
		. "\t" . "<body>" . "\n"
		. "\t\t" . "<!--Navigation-->" . "\n"
		. $nav
		. "\t\t" . "<h1><a href='tiers.php'>Tiers ({$tierscount})</a></h1>" . "\n"
		. "\t\t" . "<h2><a href='{$path}'>{$tiername}</a></h2>"  . "\n"
		. "\t\t" . "<!--Tier Information Table-->" . "\n"
		. "\t\t" . "<table>" . "\n"
		. $tiertinfo
		. $tierinfo
		. "\t\t" . "</table>" . "\n"
		. "\t\t" . "<br/>" . "\n"
		. "\t\t" . "<!--Back to Index Link-->" . "\n"
		. "\t\t" . "<table class='back'>" . "\n"
		. "\t\t\t" . "<tr>" . "\n"
		. "\t\t\t\t" . "<td class='noborder'>" . "\n"
		. "\t\t\t\t\t" . "<form action='tiers.php' method='get'><input type='submit' value='Back to Index' /></form>" . "\n"
		. "\t\t\t\t" . "</td>" . "\n"
		. "\t\t\t" . "</tr>" . "\n"
		. "\t\t" . "</table>" . "\n"
		. "\t" . "</body>" . "\n"
		. "</html>" . "\n";
		/* Displaying Page */
		echo $display;
	}
}
?>