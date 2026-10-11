<?php session_start(); if (isset($_SESSION['user'])) { header('Location: dashboard.php'); exit; } ?>
<!DOCTYPE html>
<html><head><title>VeriPortal - Login</title><link rel="stylesheet" href="assets/portal.css"></head>
<body>
  <div class="navbar">
    <div class="wordmark">VeriPortal</div>
    <nav>
      <a>Dashboard</a>
      <a>Vendors</a>
      <a>Tickets</a>
      <a>Reports</a>
      <a>Settings</a>
    </nav>
  </div>

  <div class="login-shell">
    <div class="login-card">
      <div class="brand">Veridian Dynamics</div>
      <h1>VeriPortal</h1>
      <p class="sub">Vendor Management Portal &mdash; Internal Access</p>
      <?php if (isset($_GET['err'])): ?><p class="err">Invalid credentials.</p><?php endif; ?>
      <form method="POST" action="login.php">
        <label>Username</label>
        <input type="text" name="username" autocomplete="off">
        <label>Password</label>
        <input type="password" name="password">
        <button type="submit">Sign In</button>
      </form>
    </div>
  </div>
</body></html>
