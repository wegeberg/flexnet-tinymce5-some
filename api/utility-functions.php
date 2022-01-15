<?php
/* UTILITY FUNCTIONS */
if (!function_exists("assign_defaults")) {
    function assign_defaults($data, $defaults) {
        $newData = $data;
        foreach($defaults as $key=>$val) {
            $newData[$key] = isset($data[$key]) ? $data[$key] : $val;
        }
        return $newData;
    }
}
if (!function_exists("apiResponse")) {
	function apiResponse($params) {
		$defaults = [
			"result"        => [],
			"error"         => null,
			"debug"         => null
		];
		$data = assign_defaults($params, $defaults);
		if(!$data["debug"]) {
			unset($data["debug"]);
		} else {
			array_walk($data["debug"], "rens_query");
		}
		$statusCode = isset($data["statusCode"]) 
			?   $data["statusCode"] 
			:   ($data["error"] ? 403 : 200);
			$response = [];
		if ($data["error"]) {
			$response["message"] = $data["error"];
		} else {
			$response = $data["result"];
		}
		if (isset($data["debug"]) && $data["debug"]) $response["debug"] = $data["debug"];
		http_response_code($statusCode);
		echo json_encode($response);
		exit;
	}
}
if (!function_exists("sendNoCacheHeaders")) {
	function sendNoCacheHeaders($origin = "*") {
		header("Access-Control-Allow-Origin: {$origin}");
		header("Content-Type: application/json");
		header("Expires: 0");
		header("Last-Modified: ".gmdate("D, d M Y H:i:s")." GMT");
		header("Cache-Control: no-store, no-cache, must-revalidate");
		header("Cache-Control: post-check=0, pre-check=0", false);
		header("Pragma: no-cache");
	}
}
