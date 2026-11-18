const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({ message: 'API Drip Store rodando' });
});

app.use('/v1/user', userRoutes);
app.use('/v1/category', categoryRoutes);

module.exports = app;
