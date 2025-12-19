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
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

app.post('/api/load-mock-data', (req, res) => {
  const sqlFilePath = path.join(__dirname, 'init-db/mock_data.sql');

  // Read the SQL file
  fs.readFile(sqlFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error reading SQL file',
        error: err.message,
      });
    }

    // Remove comment lines and split into statements
    const cleanedData = data
      .split('\n')
      .filter((line) => !line.trim().startsWith('--') && line.trim().length > 0)
      .join('\n');

    const statements = cleanedData
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    let completedQueries = 0;
    let errors = [];
    const totalStatements = statements.length;

    if (totalStatements === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid SQL statements found in file',
      });
    }

    // Execute each statement
    statements.forEach((statement) => {
      db.query(statement, (err, result) => {
        if (err) {
          errors.push({
            statement: statement.substring(0, 100) + '...',
            error: err.message,
          });
        }

        completedQueries++;

        // Check if all queries have been processed
        if (completedQueries === totalStatements) {
          res.json({
            success: errors.length === 0,
            message: 'Mock data loading complete',
            totalStatements: totalStatements,
            successful: totalStatements - errors.length,
            failed: errors.length,
            errors: errors.length > 0 ? errors : undefined,
          });
        }
      });
    });
  });
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

app.get('/recipes', (req, res) => {
  db.query('SELECT * FROM recipes', (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

app.get('/recipes/:id', (req, res) => {
  db.query(
    'SELECT * FROM recipes WHERE recipe_id = ?',
    [req.params.id],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else if (results.length === 0) {
        res.status(404).json({ error: 'Recipe not found' });
      } else {
        res.json(results[0]);
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
