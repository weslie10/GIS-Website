<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Request-Headers: GET,POST,OPTIONS,DELETE,PUT");

if (!empty(file_get_contents('php://input'))) {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!empty($data['asdf'])) {
        $file = 'drainase.sql';
        // //read
        // $fp = fopen($file, "r") or die("Unable to open file!");
        // $text = explode(" ", fread($fp, filesize($file)));
        // // var_dump($text);
        //add
        $fp = fopen($file, 'a') or die('Cannot open file:  ' . $file);
        $newText = $data['asdf'];
        fwrite($fp, $newText);
    }
}
