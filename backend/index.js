const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


const brainrot = [
    'Tralalero Tralala',
    'Chimpanzini Bananini',
    'Crocodilo Potatino',
    'Trippa Troppa Tralala Lirilì Rilà Tung Tung Sahur Boneca Tung Tung Tralalelo Trippi Troppa Crocodina',
    'Ballerino Lololo',
    'Ballerina Cappuccina'
]

app.get('/', (req, res) => {
  res.send('Hello from Backend!');
});

app.get('/api/info', (req, res) => {
  res.json({ message: 'Hello from Backend!' });
});

app.get('/api/random-brainrot', (req, res) => {
  const word = brainrot[Math.floor(Math.random() * brainrot.length)];
  res.json({ word });
});

app.listen(port, () => {
  console.log(`Backend is running at http://localhost:${port}`);
});
