<?php
include ("./utility-functions.php");

$url = isset ($_GET["url"]) ? trim($_GET["url"]) : null;
$showDebug = isset ($_GET["showDebug"]);

if (!$url) {
    sendNoCacheHeaders();
    apiResponse([ "error" => "URL is missing" ]);
}

if (!str_starts_with($url, "http")) {
    sendNoCacheHeaders();
    apiResponse([ "error" => "This doesn't look like a valid URL "]);
}

$services = [
    "twitter"       => "https://publish.twitter.com/oembed?omit_script=true&url=",
    "soundcloud"    => "https://soundcloud.com/oembed?format=js&url=",
    "infogram"      => "https://infogram.com/oembed_iframe?url=",
    "youtu.be"      => "https://www.youtube.com/oembed?url=",
    "youtube"       => "https://www.youtube.com/oembed?url=",
    "vimeo"         => "https://vimeo.com/api/oembed.json?url=",
//    "instagram"     => "https://api.instagram.com/oembed/?url="
];
// Instagram now has a separate function in index.js

$endpoint = null;
$valgtService = null;
foreach ($services as $service => $serviceUrl) {
    if (stripos ($url, $service) !== false) {
        $endpoint = $serviceUrl;
        $valgtService = $service;
        break;
    }
}

if (!$endpoint) {
    sendNoCacheHeaders();
    apiResponse([ "Endpoint could not be found" ]);
}

$content = file_get_contents ($endpoint.$url);
if ($valgtService == "soundcloud") {
    // Soundcloud leverer resultatet med '(' foran, og efterfulgt af ');'
    $content = substr ($content, 1, -2);
}
$result = $content ? json_decode ($content, true) : null;
if ($valgtService == "soundcloud") {
    $result = str_replace('width="100%"', 'width="400"', $result);
}
if (!$result) {
    sendNoCacheHeaders();
    apiResponse([ "error" => "Content not found {$endpoint}{$url}"]);
}

if (!$result) {
    sendNoCacheHeaders();
    apiResponse([ "error" => "Content not found {$endpoint}{$url}"]);
}

switch ($valgtService) {
    case 'infogram':
        $ratio = intval ($result["width"]) / intval ($result["height"]);
        $newWidth = 606;
        $newHeight = ceil ($newWidth / $ratio);

        $html = str_replace ('width="'.$result["width"], 'width="'.$newWidth, $result["html"]);
        $html = str_replace ('height="'.$result["height"], 'height="'.$newHeight, $html);

        $result["html"] = $html;

        $result["width"] = $newWidth;
        $result["height"] = $newHeight;
        break;
    case 'youtube':
    case 'youtu.be':
        $urlSplit = explode ('/', $url);
        if (count ($urlSplit) > 1) {
            $result["html"] = <<<RESULTHTML
<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
    <iframe src="https://www.youtube.com/embed/{$urlSplit[count($urlSplit) - 1]}?rel=0" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture;">
    </iframe>
</div>
RESULTHTML;
        } else {
            $result["html"] = mb_convert_encoding ($result["html"], 'HTML-ENTITIES', 'UTF-8');
        }
        break;
    default:
        $result["html"] = mb_convert_encoding ($result["html"], 'HTML-ENTITIES', 'UTF-8');
}

sendNoCacheHeaders();
if (!$result) {
    apiResponse([ "error" => "An error happened" ]);
}
apiResponse([ "result" => $result ]);
