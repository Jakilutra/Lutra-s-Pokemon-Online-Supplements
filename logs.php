<?php
function browsedir($dir) {
	$dirlist = "";
	if ($handle = opendir($dir)) { 		
		while (false !== ($entry = readdir($handle))) {
			$entryvalue = str_replace("'", "&#39;", $entry);
			if (is_dir($dir.$entry)){
				if ($entry != "." && $entry != ".." ){
					$dirlist .= "<form action='logs.php?path=" . rawurlencode($dir) . rawurlencode($entry) . "/' method='post'><input type='submit' value='{$entryvalue}'></form>";
				}
			}
			else {
				if (substr_compare($entry, ".raw", strlen($entry)-4, 4) != 0){
					$dirlist .= "<form action='logs.php?path=" . rawurlencode($dir) . rawurlencode($entry) . "' method='post'><input type='submit' value='{$entryvalue}'></form>";
				}
			}
		}
		closedir($handle);
		return $dirlist;
	}
}
$battledirs = browsedir("logs/battles/");
$chatdirs = browsedir("logs/chat/");
$path = $_GET["path"];
if (is_string($path) && substr_compare($path,"logs/", 0, 4) == 0){
	if (is_dir($path)){
		$subdir = browsedir($path);
		$patharray = explode("/", $path);
		$pathindex = count($patharray)-2;
		$subdirname = $patharray[$pathindex];
		$logname = "No Log Requested";
		$log = "Click on a file to view the log.";
	}
	else {
		$patharray = explode("/", $path);
		$pathindex = count($patharray)-2;
		$subdir = "";
		for( $i = 0; $i < (count($patharray)-1); ++$i ) {
			$subdir .= $patharray[$i] . "/";
		}
		$subdirname = $patharray[$pathindex];
		$logname = substr($path, strlen($subdir));
		$log = file_get_contents($path);
		if (substr_compare($path, ".html", strlen($path)-5, 5) != 0){
			$log = nl2br($log);
		}
		$subdir = browsedir($subdir);
	}
}
else {
	$subdir = "&nbsp;";
	$subdirname = "No Subdirectory Requested";
	$logname = "No Log Requested";
	$log = "Click on a Battle Logs or Chat Logs subdirectory for access to a list of logs.";
}
$display = "<html>"
. "<head>"
. "<title>Logs</title>"
. "<link rel='stylesheet' type='text/css' href='style.css' />"
. "<meta http-equiv='Content-Type' content='text/html'; charset='utf-8' />"
. "</head>"
. "<body>"
. "<table>"
. "<tr><td><a href='tiers.php'>Tiers</a></td><td><a href='ladders.php'>Ladders</a></td><td><a href='usage_stats/formatted/index.html'>Usage Statistics</a></td><td><a href='script.php'>Server Script</a></td><th>Logs</th></tr>"
. "</table>"
. "<h1><a href='logs.php'>Logs</a></h1>"
. "<table class='noborder' width ='100%'>"
. "<tr align='left' valign='top'><th>Battle Logs</th><th>Chat Logs</th><th>{$subdirname}</th><th>{$logname}</th></tr>"
. "<tr align='left' valign='top'><td class='noborder'>{$battledirs}</td><td class='noborder'>{$chatdirs}</td><td class='noborder'>{$subdir}</td><td width='60%' style='background-color:white;color:black;'>{$log}</td></tr>"
. "</table>"
. "</body>";
echo $display;
?>