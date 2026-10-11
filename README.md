# OBSIDIAN GATE — CTF Play Box

A six-stage Capture The Flag platform built for IE3132 (Penetration Testing), simulating an insider-threat investigation at a fictional company, **Veridian Dynamics**. Players trace the actions of a rogue employee, **Marcus Cole**, across OSINT, steganography, web exploitation, cryptography, forensics, and privilege escalation challenges.

---

## 1. Story / Scenario

Veridian Dynamics has suffered a suspected insider data leak. Players take on the role of an investigator, working through evidence left behind by Marcus Cole — starting from public information about the company, through hidden files, a compromised web portal, encrypted communications, a deleted disk artifact, and finally into Marcus's personal server — to piece together what happened.

---

## 2. Architecture

The platform runs as a single **Docker Compose** stack on one host (a Kali Linux VM in our build). Every stage is its own container, and all containers — plus the portal — share one isolated Docker bridge network, `obsidian-net`.

```
Participant Machine (browser + SSH client)
            │
            ▼
   OBSIDIAN GATE Portal  (Node/Express · :8090)
   dashboard · flag validation (SHA-256) · progress tracking
            │
   ┌────────┼────────────────────────────┐
   ▼        ▼              ▼             ▼
Stage 1   Stage 2        Stage 3      Stage 4
OSINT     Steganography  Web Exploit  Cryptography
:8080     :5001          :8081        :8082
                             │
                          stage3-db
                          (MySQL 8, internal only)

Stage 5                  Stage 6
Forensics                 Linux Privesc
:8085                     :2222
```

**Why Docker Compose:** each challenge needed isolation from the others without the overhead of separate VMs per stage. Containers are lightweight, start fast, and reset cleanly — a strict requirement for repeatable grading/testing.

**Dependency:** Stage 4 decrypts SSH credentials that are required to access Stage 6. Every other stage is fully independent and can be solved in any order.

**Note on scope:** this is a single-instance pilot build. There is no VPN gateway, CTFd-style orchestration, or per-team isolation — all stages run on one shared bridge network with no external internet access.

---

## 3. Stages

| # | Domain | Container / Port | Flag location |
|---|---|---|---|
| 1 | OSINT | Node/Express · `:8080` | Hidden in image EXIF metadata on the company site |
| 2 | Steganography | Node/Express · `:5001` | Embedded in a file via `steghide` (decoy file included) |
| 3 | Web Exploitation | PHP + Apache + MySQL 8 · `:8081` | SQL injection in `login.php` bypasses authentication |
| 4 | Cryptography | Node/Express · `:8082` | Base64 + Vigenère cipher; key recovered via known-plaintext (badge ID) |
| 5 | Digital Forensics | Node/Express · `:8085` | Deleted file recovered from unallocated space via `scalpel` |
| 6 | Linux Privilege Escalation | Debian + OpenSSH + cron · `:2222` | World-writable script run by root via cron |

Difficulty progresses from easy (Stages 1–2) through moderate (3–4) to moderate-hard and hard (5–6, capstone).

---

## 4. Flag Format

All flags follow the format:

```
OBSIDIAN{...}
```

Flags are submitted through the portal, which validates them by comparing a SHA-256 hash rather than storing plaintext flag values in the application code.

---

## 5. Setup Instructions

**Requirements:** Docker and Docker Compose installed on the host.

```bash
git clone <repo-url>
cd obsidian-gate
docker-compose up -d
```

This builds and starts every stage container plus the portal on the `obsidian-net` bridge network.

**Verify everything is running:**
```bash
docker ps
```

**Access the portal:**
```
http://localhost:8090
```

---

## 6. Running / Solving

1. Open the portal and start from Stage 1.
2. Each stage is reachable at its listed port (see table above).
3. Submit recovered flags through the portal dashboard to track progress.
4. Stage 6 requires the SSH credentials recovered in Stage 4.

---

## 7. Reset Instructions

**Full reset (all containers, clean state):**
```bash
docker-compose down -v
docker-compose up -d
```
The `-v` flag also clears any named volumes (e.g. the Stage 3 database and anything written during Stage 6), so the environment returns to a fully unsolved state.

**Reset a single stage without affecting others:**
```bash
docker-compose up -d --force-recreate <service-name>
```

**Check resource usage:**
```bash
docker stats
```

---

## 8. Testing & Validation

The following was carried out before sign-off:

- **Solve-path testing** — every stage solved end-to-end via its intended method.
- **Peer testing** — each stage solved by a teammate other than its builder.
- **Flag format validation** — consistent `OBSIDIAN{...}` format and correct SHA-256 validation across all six stages.
- **Isolation testing** — confirmed no stage leaks into or depends on another, aside from the declared Stage 4 → Stage 6 dependency.
- **Reset testing** — confirmed `docker-compose down -v && docker-compose up -d` returns every stage to a clean, unsolved state, verified by re-solving a stage post-reset.
- **Unintended-shortcut checks** — confirmed flags are not retrievable by bypassing the intended challenge logic.

---

## 9. Risks / Limitations

- Single-host, single-instance design — no per-team orchestration or VPN segmentation.
- Stage 4 → Stage 6 dependency means a broken Stage 4 blocks Stage 6 entirely.
- No automated monitoring/logging dashboard beyond container-level logs.

---

## 10. Team / Individual Contributions

| Member | Responsibility |
|---|---|
| IT23379138 | CTF Platform & Architecture |
| IT2410226 | Challenge Design A — Stages 1, 2, 3 |
| IT4101629 | Challenge Design B — Stages 4, 5, 6 |
| IT24101399 | Integration, Testing & Documentation |

Evidence of individual contribution (commit history, configuration files, test logs) is included in this repository.

---

## 11. Acknowledgements / Tools Used

- Docker / Docker Compose
- Node.js, Express
- PHP, Apache, MySQL 8
- `exiftool`, `binwalk`, `steghide`
- `scalpel` (file carving)
- OpenSSH, cron

---

## 12. Demonstration Video

See `video_link.txt` in the submission package for the recorded walkthrough.
