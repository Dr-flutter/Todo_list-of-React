// const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(express.json());

// Configurer la connexion à la base de données
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'express_bd'
});

// Établir la connexion à la base de données
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err.stack);
    return;
  }
  console.log('Connecté à la base de données avec l\'ID:', connection.threadId);
});


const port = process.env.PORT || 5000;

//   LECTURE EN  BASE DE DONNEES






app.listen(port, () => console.log(`Example app listening on port ${port}!`))
