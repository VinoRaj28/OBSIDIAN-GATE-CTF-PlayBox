<?php
session_start();
require 'db.php';

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

// NOTE: intentionally vulnerable - raw string concatenation, no prepared statement
$query = "SELECT * FROM users WHERE username = '$username' AND password = '$password' LIMIT 1";
$result = $conn->query($query);

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $_SESSION['user'] = $row['username'];
    $_SESSION['role'] = $row['role'];
    header('Location: dashboard.php');
    exit;
} else {
    header('Location: index.php?err=1');
    exit;
}
