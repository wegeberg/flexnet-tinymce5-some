<?php
include("../../includes/functions.inc.php");

$devMsgs = [];

$url = isset($_GET["url"]) ? trim($_GET["url"]) : null;
$showDebug = isset($_GET["showDebug"]);

if(!$url) {
    sendNoCacheHeaders();
    returnJson([
        "success"   => false,
        "error"     => "URL ikke angivet",
        "result"    => null,
    ]);
}

if(substr($url, 0, 4) != "http") {
    sendNoCacheHeaders();
    returnJson([
        "success"   => false,
        "error"     => "Det ligner ikke en URL....",
        "result"    => null,
    ]);
}

$services = [
    "twitter"       => "https://publish.twitter.com/oembed?omit_script=true&url=",
    "soundcloud"    => "https://soundcloud.com/oembed?format=js&url=",
    "infogram"      => "https://infogram.com/oembed_iframe?url=",
    "youtu.be"      => "https://www.youtube.com/oembed?url=",
    "youtube"       => "https://www.youtube.com/oembed?url=",
    "vimeo"         => "https://vimeo.com/api/oembed.json?url=",
    "instagram"     => "https://api.instagram.com/oembed/?url="
];

$endpoint = null;
$valgtService = null;
foreach($services as $service => $serviceUrl) {
    if(stripos($url, $service) !== false) {
        $endpoint = $serviceUrl;
        $valgtService = $service;
        break;
    }
}

if(!$endpoint) {
    sendNoCacheHeaders();
    returnJson([
        "success"   => false,
        "error"     => "Endpoint kunne ikke findes",
        "result"    => null,
    ]);
}

$content = file_get_contents($endpoint.$url);
$devMsgs[] = "content";
$devMsgs[] = $url;
$devMsgs[] = $content;
if($valgtService == "soundcloud") {
    // Soundcloud leverer resultatet med '(' foran, og efterfulgt af ');'
    $content = substr($content, 1, -2);
}
$result = $content ? json_decode($content, true) : null;
if(!$result) {
    sendNoCacheHeaders();
    returnJson([
        "success"   => false,
        "error"     => "Indhold ikke fundet",
        "result"    => $result,
        "debug"     => $showDebug ? $devMsgs : null,
        "url"       => $endpoint.$url,
        "kode"      => $result ? htmlentities($result["html"]) : null
    ]);
}

$devMsgs[] = "valgService - {$valgtService}";

switch ($valgtService) {
    case 'infogram':
        $devMsgs[] = "Er infogram";
        $ratio = (int) $result["width"] / (int) $result["height"];
        $devMsgs[] = "ratio: {$ratio}";
        $newWidth = 606;
        $newHeight = ceil($newWidth / $ratio);
        $devMsgs[] = "w: {$newWidth} - h: {$newHeight}";
        
        $devMsgs[] = "index3:".stripos($result["html"], 'width="'.$result["width"]);
    
        $html = str_replace('width="'.$result["width"], 'width="'.$newWidth, $result["html"]);
        $html = str_replace('height="'.$result["height"], 'height="'.$newHeight, $html);
    
        $result["html"] = $html;
    
        $result["width"] = $newWidth;
        $result["height"] = $newHeight;
        break;
    case 'youtube':
    case 'youtu.be':
        $devMsgs[] = "Er youtube";
        $urlSplit = explode('/', $url);
        if (count($urlSplit) > 1) {
            $devMsgs[] = "urlSplit-1";
            $result["html"] = <<<RESULTHTML
<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
    <iframe src="https://www.youtube.com/embed/{$urlSplit[count($urlSplit) - 1]}?rel=0" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture;">
    </iframe>
</div>
RESULTHTML;
        } else {
            $devMsgs[] = "urlSplit-2";
            $devMsgs[] = $url;
            $result["html"] = mb_convert_encoding($result["html"], 'HTML-ENTITIES', 'UTF-8');
        }
        break;
    default:
    $devMsgs[] = "Er default";
    $result["html"] = mb_convert_encoding($result["html"], 'HTML-ENTITIES', 'UTF-8');
}

sendNoCacheHeaders();
returnJson([
    "success"   => $result ? true : false,
    "error"     => $result ? null : "Der skete en fejl",
    "result"    => $result,
    "url"       => $endpoint.$url,
    "kode"      => $result ? htmlentities($result["html"]) : null,
    "debug"     => $showDebug ? $devMsgs : null
]);
