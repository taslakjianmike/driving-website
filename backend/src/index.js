const express = require('express');
const cors = require('cors');
require('dotenv').config();

const topicsRouter = require('./routes/topics');
const questionsRouter = require('./routes/questions');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/images', express.static('images'));

app.use('/api/topics', topicsRouter);
app.use('/api/questions', questionsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});