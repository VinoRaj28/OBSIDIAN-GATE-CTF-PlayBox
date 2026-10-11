const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8090;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const STAGES = [
  {
    id: 'stage1',
    number: 1,
    points: 100,
    title: 'The Digital Footprint',
    category: 'OSINT',
    difficulty: 'easy',
    difficultyLabel: 'Easy',
    port: 8080,
    hostname: 'veridiandynamics.local',
    protocol: 'http',
    blurb: 'Veridian Dynamics has a public-facing site, a staff page, and a former employee who kept blogging after he left.'
  },
  {
    id: 'stage2',
    number: 2,
    points: 100,
    title: 'Hidden in Plain Sight',
    category: 'Steganography',
    difficulty: 'easy',
    difficultyLabel: 'Easy',
    port: 5001,
    hostname: 'mcole-files.local',
    protocol: 'http',
    blurb: 'A personal file backup grabbed before a wipe. Two files. One of them is not what it looks like.'
  },
  {
    id: 'stage3',
    number: 3,
    points: 200,
    title: 'The VeriPortal Breach',
    category: 'Web Exploitation',
    difficulty: 'moderate',
    difficultyLabel: 'Moderate',
    port: 8081,
    hostname: 'veriportal.veridiandynamics.local',
    protocol: 'http',
    blurb: 'A vendor management login that trusts its input a little too much.'
  },
  {
    id: 'stage4',
    number: 4,
    points: 200,
    title: 'The Vigenère Intercept',
    category: 'Cryptography',
    difficulty: 'moderate',
    difficultyLabel: 'Moderate',
    port: 8082,
    hostname: 'netops.veridiandynamics.local',
    protocol: 'http',
    blurb: 'One last transmission before the channel went dark, encrypted with an old habit.'
  },
  {
    id: 'stage5',
    number: 5,
    points: 300,
    title: 'The Workstation Image',
    category: 'Disk Forensics',
    difficulty: 'moderate-hard',
    difficultyLabel: 'Moderate-Hard',
    port: 8085,
    hostname: 'assets.veridiandynamics.local',
    protocol: 'http',
    blurb: 'A forensic image taken moments after a file was deleted. Deletion is not destruction.'
  },
  {
    id: 'stage6',
    number: 6,
    points: 400,
    title: 'Ghost in the Crontab',
    category: 'Linux Privilege Escalation',
    difficulty: 'hard',
    difficultyLabel: 'Hard',
    port: 2222,
    hostname: 'homelab01.local',
    protocol: 'ssh',
    blurb: 'A low-privilege foothold and a scheduled task that trusts a file it should not.'
  }
];

const FLAG_HASHES = {
  stage1: 'f72a97e7354f6448712174f4558dff1b28080f7ddb32f2ffa410c856cad20e6e',
  stage2: '9bde6605a69fc268b11b2c8acfa07e5fe2de7c2a52e5192ea698fa9dece8b0ff',
  stage3: '6ac3d851c3f8520f1c9f91066b3bf1bd0e770491a055a909a19686720afbca83',
  stage4: '49ed2c9849f5d75000b367764908d1ff706bca5f16e191969413b96c278c1833',
  stage5: '5a82faf50e3d071b6af6f3d753781f7a0ab2ec1c88f5024fe9833d9bc2d9bd52',
  stage6: '477b7f9cb55a266e40cc63756779685e3946fa0881db569ceede20cd4932a9ae'
};

app.get('/api/stages', (req, res) => {
  res.json(STAGES);
});

app.post('/api/submit', (req, res) => {
  const { stage, flag } = req.body || {};
  if (typeof stage !== 'string' || typeof flag !== 'string') {
    return res.status(400).json({ correct: false, error: 'stage and flag are required' });
  }
  const challenge = STAGES.find(s => s.id === stage);
  const expected = challenge && FLAG_HASHES[stage];
  if (!expected) {
    return res.status(404).json({ correct: false, error: 'unknown stage' });
  }
  const submittedHash = crypto.createHash('sha256').update(flag.trim()).digest('hex');
  const correct = crypto.timingSafeEqual(
    Buffer.from(submittedHash, 'hex'),
    Buffer.from(expected, 'hex')
  );
  res.json({ correct, points: correct ? challenge.points : 0 });
});

app.listen(PORT, () => console.log(`OBSIDIAN GATE portal running on port ${PORT}`));
