const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8085;
app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => console.log(`Stage 5 - Forensics running on port ${PORT}`));
