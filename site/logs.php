<?php
/* Constructing Logs Index and Display */
function browsedir($dir) {
	$dirlist = "";
	if ($handle = opendir($dir)) { 		
		while (false !== ($entry = readdir($handle))) {
			$entry = utf8_encode($entry);	
			$entryvalue = str_replace("'", "&#39;", $entry);
			if (is_dir($dir.$entry)){
				if ($entry != "." && $entry != ".." ){
					$dirlist .= "\t\t\t\t\t" .  "<form action='logs.php?path=" . rawurlencode($dir) . rawurlencode($entry) . "/' method='post'>" . "\n"
					. "\t\t\t\t\t\t" .  "<input type='submit' value='{$entryvalue}'>" . "\n"
					. "\t\t\t\t\t" .  "</form>" . "\n";
				}
			}
			else {
				if (substr_compare($entry, ".raw", strlen($entry)-4, 4) != 0){
					$dirlist .= "\t\t\t\t\t" .  "<form action='logs.php?path=" . rawurlencode($dir) . rawurlencode($entry) . "' method='post'>" . "\n"
					. "\t\t\t\t\t\t" .  "<input type='submit' value='{$entryvalue}'>" . "\n"
					. "\t\t\t\t\t" .  "</form>" . "\n";
				}
			}
		}
		closedir($handle);
		return $dirlist;
	}
}
$battledirs = browsedir("../logs/battles/");
$chatdirs = browsedir("../logs/chat/");
if (isset($_GET["path"])){
	$path = $_GET["path"];
}
if (is_string($path) && substr_compare($path,"../logs/", 0, 7) == 0){
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
	$subdir = "\t\t\t\t\t" .  "&nbsp;" . "\n";
	$subdirname = "No Subdirectory Requested";
	$logname = "No Log Requested";
	$log = "Click on a Battle Logs or Chat Logs subdirectory for access to a list of logs.";
}
/* Hiding Logs Index and Display */
$siteconfig = file("config.txt");
foreach ($siteconfig as $line){
	if (preg_match("/show_logs=/", $line) == 1 && preg_match("/show_logs=true/", $line) == 0){
		$log = "<i>Hidden</i>";
		$battledirs = "\t\t\t\t\t" .  "&nbsp;" . "\n";
		$chatdirs = "\t\t\t\t\t" .  "&nbsp;" . "\n";
		$subdir = "\t\t\t\t\t" .  "&nbsp;" . "\n";
		$subdirname = "<i>Hidden</i>";
		$logname = "<i>Hidden</i>";
	}
}
/* Including Navigation */
$sitepage = "logs";
include "navigation.php";
/* Constructing Page */
$display = "<!DOCTYPE html>" . "\n"
. "\t" . "<head>" . "\n"
. "\t\t" .  "<title>Logs</title>" . "\n"
. "\t\t" .  "<link rel='stylesheet' type='text/css' href='style.css' />" . "\n"
. "\t\t" .  "<meta http-equiv='Content-Type' content='text/html;charset=utf-8' />" . "\n"
. "\t" . "</head>" . "\n"
. "\t" . "<body>" . "\n"
. "\t\t" . "<!--Navigation-->" . "\n"
. $nav
. "\t\t" .  "<h1><a href='logs.php'>Logs</a></h1>" . "\n"
. "\t\t" . "<!--Logs Table-->" . "\n"
. "\t\t" .  "<table class='noborder'>" . "\n"
. "\t\t\t" .  "<tr>" . "\n"
. "\t\t\t\t" .  "<th>" . "\n"
. "\t\t\t\t\t" .  "Battle Logs" . "\n"
. "\t\t\t\t" .  "</th>" . "\n"
. "\t\t\t\t" .  "<th>" . "\n"
. "\t\t\t\t\t" .  "Chat Logs" . "\n"
. "\t\t\t\t" .  "</th>" . "\n"
. "\t\t\t\t" .  "<th>" . "\n"
. "\t\t\t\t\t" .  "{$subdirname}" . "\n"
. "\t\t\t\t" .  "</th>" . "\n"
. "\t\t\t\t" .  "<th>" . "\n"
. "\t\t\t\t\t" .  "{$logname}" . "\n"
. "\t\t\t\t" .  "</th>" . "\n"
. "\t\t\t" .  "</tr>" . "\n"
. "\t\t\t" .  "<tr>" . "\n"
. "\t\t\t\t" . "<!--Battle Subdirectory Index-->" . "\n"
. "\t\t\t\t" .  "<td class='noborder'>" . "\n"
. $battledirs
. "\t\t\t\t" .  "</td>" . "\n"
. "\t\t\t\t" . "<!--Chat Subdirectory Index-->" . "\n"
. "\t\t\t\t" .  "<td class='noborder'>" . "\n"
. $chatdirs
. "\t\t\t\t" .  "</td>" . "\n"
. "\t\t\t\t" . "<!--Log File Index-->" . "\n"
. "\t\t\t\t" .  "<td class='noborder'>" . "\n"
. $subdir
. "\t\t\t\t" .  "</td>" . "\n"
. "\t\t\t\t" . "<!--Log Display-->" . "\n"
. "\t\t\t\t" .  "<td class='logs'>" . "\n"
. "\t\t\t\t\t" .  "{$log}" . "\n"
. "\t\t\t\t" .  "</td>" . "\n"
. "\t\t\t" .  "</tr>" . "\n"
. "\t\t" .  "</table>" . "\n"
. "\t" . "</body>" . "\n";
/* Displaying Page */
echo $display;
?>