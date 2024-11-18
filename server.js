const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Utilisation du middleware body-parser pour analyser les données POST
app.use(bodyParser.urlencoded({ extended: true }));

// Charger les informations de connexion à l'API Google Drive
const credentials = require('./key.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    SCOPES
);

const drive = google.drive({ version: 'v3', auth });

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Logique pour vérifier les identifiants (à adapter)
    res.send(`Bonjour ${username}, vous êtes connecté !`);
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    // Logique pour enregistrer les utilisateurs (à adapter)
    res.send(`Utilisateur ${username} inscrit avec succès !`);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
