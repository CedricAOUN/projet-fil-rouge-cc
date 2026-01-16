const express = require('express');
const mysql2 = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const db = mysql2.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mealmosaic',
});

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/experts', (req, res) => {
  db.query('SELECT * FROM users WHERE is_expert = 1', (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

app.get('/experts/:id', (req, res) => {
  db.query(
    'SELECT * FROM users WHERE user_id = ? AND is_expert = 1 FROM courses c JOIN users u ON c.expert_id = u.user_id WHERE u.is_expert = 1 AND u.user_id = ?',
    [req.params.id],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else if (results.length === 0) {
        res.status(404).json({ error: 'Expert not found' });
      } else {
        res.json(results[0]);
      }
    }
  );
});

app.get('/recipes', (req, res) => {
  const query = `
    SELECT 
      r.*,
      COALESCE(l.amount, 0) as likes,
      COALESCE(
        JSON_ARRAYAGG(
          CASE 
            WHEN c.comment_id IS NOT NULL 
            THEN JSON_OBJECT(
              'comment_id', c.comment_id,
              'content', c.content,
              'creator_id', c.creator_id,
              'username', u.username,
              'avatar_url', u.avatar_url
            )
            ELSE NULL
          END
        ),
        JSON_ARRAY()
      ) as comments
    FROM recipes r
    LEFT JOIN likes l ON r.recipe_id = l.recipe_id
    LEFT JOIN comments c ON r.recipe_id = c.recipe_id
    LEFT JOIN users u ON c.creator_id = u.user_id
    GROUP BY r.recipe_id
    ORDER BY r.creation_date DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // Clean up comments - remove null values from array
      results = results.map((recipe) => ({
        ...recipe,
        comments: recipe.comments.filter((c) => c !== null),
      }));
      res.json(results);
    }
  });
});

app.get('/recipes/:id', (req, res) => {
  const query = `
    SELECT 
      r.*,
      COALESCE(l.amount, 0) as likes,
      COALESCE(
        JSON_ARRAYAGG(
          CASE 
            WHEN c.comment_id IS NOT NULL 
            THEN JSON_OBJECT(
              'comment_id', c.comment_id,
              'content', c.content,
              'creator_id', c.creator_id,
              'username', u.username,
              'avatar_url', u.avatar_url
            )
            ELSE NULL
          END
        ),
        JSON_ARRAY()
      ) as comments
    FROM recipes r
    LEFT JOIN likes l ON r.recipe_id = l.recipe_id
    LEFT JOIN comments c ON r.recipe_id = c.recipe_id
    LEFT JOIN users u ON c.creator_id = u.user_id
    WHERE r.recipe_id = ?
    GROUP BY r.recipe_id
    ORDER BY r.creation_date DESC
  `;

  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Recipe not found' });
    } else {
      res.json(results[0]);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
