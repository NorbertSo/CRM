<?php
// Dodaj na początku dla debugowania
error_log("Proxy called with method: " . $_SERVER['REQUEST_METHOD']);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    error_log("OPTIONS request handled");
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    error_log("POST data: " . $input);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://norbertsobala.app.n8n.cloud/webhook/lead-crm-test');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $input);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    error_log("n8n response code: " . $httpCode);
    error_log("n8n response: " . $response);
    curl_close($ch);
    
    http_response_code($httpCode);
    echo $response;
} else {
    error_log("Unexpected method: " . $_SERVER['REQUEST_METHOD']);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
