<?php
/**
 * XAMPP Database Configuration for NIRMAN Project
 * This file handles all MySQL database connections
 */

// Database Configuration
define('DB_HOST', 'localhost');          // XAMPP default
define('DB_USER', 'root');               // XAMPP default (no password)
define('DB_PASS', '');                   // XAMPP default (empty password)
define('DB_NAME', 'nirman_db');          // Your database name

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]));
}

// Set charset to UTF-8
$conn->set_charset("utf8");

/**
 * Function to get database connection
 */
function getConnection() {
    global $conn;
    return $conn;
}

/**
 * Function to close connection
 */
function closeConnection() {
    global $conn;
    if ($conn) {
        $conn->close();
    }
}

// Handle CORS requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// For OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
