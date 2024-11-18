const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Authentification Google API avec le fichier de clé JSON
const auth = new google.auth.GoogleAuth({
    keyFile: 'key.json', // Chemin vers votre fichier clé JSON
    scopes: ['https://www.googleapis.com/auth/drive.file'], // Permet de créer et partager des fichiers
});

const drive = google.drive({ version: 'v3', auth });

// Route pour accéder à la page d'inscription
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route pour gérer l'inscription et l'enregistrement du fichier
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Créez un fichier ou mettez à jour le fichier users.txt
    const fileMetadata = {
        name: 'users.txt', // Nom du fichier sur Google Drive
        mimeType: 'text/plain',
    };

    const fileContent = `Nom d'utilisateur : ${username}\nEmail : ${email}\nMot de passe : ${password}\n`;

    const media = {
        mimeType: 'text/plain',
        body: fileContent, // Contenu du fichier
    };

    try {
        // Créer ou remplacer le fichier users.txt sur Google Drive
        const response = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id',
        });

        // Récupérer l'ID du fichier créé
        const fileId = response.data.id;
        console.log(`Fichier créé sur Google Drive avec l'ID: ${fileId}`);

        // Partager le fichier avec n'importe qui ayant le lien
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                type: 'anyone',
                role: 'reader', // "reader" pour lecture seule, "writer" pour ajout
            },
        });
        console.log('Fichier partagé publiquement !');

        res.send('Inscription réussie ! Le fichier a été créé et partagé sur Google Drive.');
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement ou du partage :', error);
        res.status(500).send('Une erreur est survenue.');
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
