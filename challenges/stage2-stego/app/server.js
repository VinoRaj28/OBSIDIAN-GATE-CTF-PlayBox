const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5001;
app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => console.log(`Stage 2 - Steganography running on port ${PORT}`));
