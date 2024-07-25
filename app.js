// Grupo #
// Milton Angamarca

const express = require('express');
const app = express();
const port = 3000;
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function main() {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    const db = client.db('restaurant');
    const collection = db.collection('reservations');

    // Mostrar todas las reservas
    app.get('/reservations', async (req, res) => {
        const reservations = await collection.find({}).toArray();
        res.send(reservations);
    });

    // Añadir una reserva
    app.post('/addReservation', async (req, res) => {
        const { name, date, time, guests } = req.body;
        if (!name || !date || !time || !guests) {
            return res.status(400).send({ error: 'All fields are required' });
        }
        await collection.insertOne({ name, date, time, guests });
        res.send({ success: true });
    });

    // Actualizar información de una reserva
    app.put('/updateReservation', async (req, res) => {
        const { name, date, time, guests } = req.body;
        if (!name || !date || !time || !guests) {
            return res.status(400).send({ error: 'All fields are required' });
        }
        await collection.updateOne({ name }, { $set: { date, time, guests } });
        res.send({ success: true });
    });

    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
}

main().catch(console.error);
