const express = require('express');
const app = express();
const mongoose = require('mongoose');

require('./models/userModel');

app.use(express.json());
app.use(require('./routes/auth'));

mongoose.connect('mongodb+srv://benoitivars:port3000@clusteraccenture.cqdoojd.mongodb.net/TestDB')
.then(() => console.log('Connexion à MongoDB réussie'))
.catch(err => console.error('Erreur de connexion à MongoDB', err));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});