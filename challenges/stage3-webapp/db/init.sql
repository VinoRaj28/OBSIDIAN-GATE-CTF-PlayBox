CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL
);

INSERT INTO users (username, password, role) VALUES
  ('admin', 'SuperSecretPass2026!', 'admin'),
  ('jsmith', 'password123', 'user');

CREATE TABLE IF NOT EXISTS admin_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  note TEXT NOT NULL
);

INSERT INTO admin_notes (note) VALUES
  ('Ticket #4471: Marcus Cole (Senior DevOps) requested extended VPN access on his last day - approved without secondary review. Flagging for retroactive audit.\n\nFLAG: OBSIDIAN{v3r1p0rt4l_4dm1n_by9455ed}');
