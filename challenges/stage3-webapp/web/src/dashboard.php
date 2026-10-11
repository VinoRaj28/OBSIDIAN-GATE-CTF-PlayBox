<?php
session_start();
require 'db.php';
if (!isset($_SESSION['user'])) { header('Location: index.php'); exit; }
if ($_SESSION['role'] !== 'admin') {
    echo "<h2>Access denied - admin only</h2><a href='logout.php'>Logout</a>";
    exit;
}
$notes = $conn->query("SELECT note FROM admin_notes ORDER BY id");
$username = htmlspecialchars($_SESSION['user']);
$initial = strtoupper(substr($username, 0, 1));
$realRows = [];
while ($row = $notes->fetch_assoc()) { $realRows[] = $row; }
?>
<!DOCTYPE html>
<html><head><title>Admin Dashboard - VeriPortal</title><link rel="stylesheet" href="assets/portal.css"></head>
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
    <div class="user-menu">
      <span class="avatar"><?php echo $initial; ?></span>
      <span class="username"><?php echo $username; ?></span>
      <a class="logout" href="logout.php">Logout</a>
    </div>
  </div>

  <div class="shell">
    <div class="sidebar">
      <a>Dashboard</a>
      <a class="active">Support Tickets</a>
      <a>Vendor Accounts</a>
      <a>Audit Log</a>
      <a>Settings</a>
    </div>

    <div class="main">
      <div class="content-card">
        <div class="breadcrumb">Home / Support Tickets</div>
        <h1 class="page-title">Internal Support Tickets</h1>

        <table class="tickets">
          <thead>
            <tr><th>Ticket ID</th><th>Requester</th><th>Department</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>TKT-4398</td><td>Priya Nair</td><td>IT Support</td>
              <td><span class="pill pill-resolved">Resolved</span></td><td>2026-01-08</td>
            </tr>
            <tr>
              <td>TKT-4432</td><td>Daniel Osei</td><td>Facilities</td>
              <td><span class="pill pill-open">Open</span></td><td>2026-01-11</td>
            </tr>
            <?php foreach ($realRows as $row):
                $note = $row['note'];
                preg_match('/Ticket #(\d+): ([^(]+)\(([^)]+)\)/', $note, $m);
                $ticketId   = isset($m[1]) ? 'TKT-' . $m[1] : 'TKT-????';
                $requester  = isset($m[2]) ? trim($m[2]) : 'Unknown';
                $department = isset($m[3]) ? trim($m[3]) : 'Unknown';
            ?>
            <tr>
              <td><?php echo htmlspecialchars($ticketId); ?></td>
              <td><?php echo htmlspecialchars($requester); ?></td>
              <td><?php echo htmlspecialchars($department); ?></td>
              <td><span class="pill pill-flagged">Flagged</span></td>
              <td>2026-01-14</td>
            </tr>
            <?php endforeach; ?>
            <tr>
              <td>TKT-4455</td><td>Grace Lin</td><td>HR</td>
              <td><span class="pill pill-pending">Pending</span></td><td>2026-01-13</td>
            </tr>
          </tbody>
        </table>
      </div>

      <?php foreach ($realRows as $row):
          $escaped = htmlspecialchars($row['note']);
          $escaped = preg_replace('/^(FLAG:.*)$/m', '<span class="flag-line">$1</span>', $escaped);
      ?>
      <div class="content-card detail-card">
        <h3>Ticket Detail</h3>
        <div class="note-body"><?php echo $escaped; ?></div>
      </div>
      <?php endforeach; ?>
    </div>
  </div>

</body></html>
