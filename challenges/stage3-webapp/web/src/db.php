<?php
$host = getenv('DB_HOST') ?: 'db';
$user = getenv('DB_USER') ?: 'veriportal';
$pass = getenv('DB_PASS') ?: 'veriportal_pw';
$name = getenv('DB_NAME') ?: 'veriportal';
$conn = new mysqli($host, $user, $pass, $name);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
