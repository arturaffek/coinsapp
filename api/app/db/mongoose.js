const mongoose = require('mongoose');
const { database } = require('../../config');

if (!database) {
    console.error('BŁĄD: Zmienna środowiskowa DATABASE nie jest zdefiniowana w pliku .env!');
    process.exit(1);
}

mongoose.connect(database)
    .then(() => console.log('Połączono z MongoDB'))
    .catch(err => {
        console.error('Błąd połączenia z MongoDB:', err.message);
        process.exit(1);
    });
