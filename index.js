const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Вставьте сгенерированный секретный ключ сюда
const secretKey = 'f55d81a9558144a6f0e8661cf8f513c2d665f627ee35db3bda9468f192382e0b';

// Temporary array to store posts
const posts = [];

// CRUD Routes
app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const newPost = {
        title: req.body.title,
        text: req.body.text,
        author: authData.user.username
      };

      posts.push(newPost);
      res.json(newPost);
    }
  });
});

app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// Add routes for updating and deleting posts

// Login route
app.post('/api/login', (req, res) => {
  // Replace this with your actual user authentication logic
  const username = req.body.username;

  // Mock user for simplicity
  const user = {
    username
  };

  jwt.sign({ user }, secretKey, { expiresIn: '1h' }, (err, token) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ token });
    }
  });
});

// Verify Token function
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
  
    // Replace this with your actual user authentication logic
    if (username === 'user' && password === 'password') {
      const user = { username };
      jwt.sign({ user }, secretKey, { expiresIn: '1h' }, (err, token) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json({ token });
        }
      });
    } else {
      res.status(401).send('Invalid credentials');
    }
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
