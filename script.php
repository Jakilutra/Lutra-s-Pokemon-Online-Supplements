<?php
$siteconfig = file("siteconfig.txt");
foreach ($siteconfig as $line){
	if (substr_compare($line, "show_scripts=", 0,13) == 0){
		if(substr($line, 13) == "true"){
			$scriptlink = "scripts.js";
			$script = file_get_contents($scriptlink);
			$script = htmlentities($script);
			$script = nl2br($script);
			$script = str_replace("\t",'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',$script);
			$scriptarray = explode("<br />", $script);
			$linecount = 0;
			$lines = "";
			foreach ($scriptarray as $scriptline){
				$linecount++;
				$lines .= "{$linecount}.<br/>";
			}			
		}
		else {
			$lines = "N/A";
			$script = "<i>Hidden</i>";
		}
		break;
	}
}
$display = "<html>"
. "<head>"
. "<title>Script</title>"
. "<link rel='stylesheet' type='text/css' href='style.css' />"
. "<meta http-equiv='Content-Type' content='text/html'; charset='utf-8' />"
. "</head>"
. "<body>"
. "<table>"
. "<tr><td><a href='tiers.php'>Tiers</a></td><td><a href='ladders.php'>Ladders</a></td><td><a href='usage_stats/formatted/index.html'>Usage Statistics</a></td><th>Server Script</th></tr>"
. "</table>"
. "<h1><a href='script.php'>Server Script</a></center>"
. "<table width ='100%'>"
. "<tr align='left' valign='top'><th>Line</th><th>Script&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href={$scriptlink}><input type='submit' value='Raw'></a></input></th></tr>"
. "<tr align='left' valign='top'><td><b><small>{$lines}</small></b></td><td nowrap><b><small>{$script}</small></b></tr>"
. "</table>"
. "</body>"
. "</html>";
echo $display;
fopen("scripts.js", "r");
?>