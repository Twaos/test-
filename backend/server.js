const express = require('express');
const sql = require('mssql');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Lubab andmevahetuse frontendi ja backendi vahel
app.use(cors());
// Lubab serveril lugeda JSON formaadis andmeid
app.use(express.json());

// MS SQL ühenduse seaded (võetakse .env failist)
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// --- API PRIIID (CRUD) ---

// 1. GET - Saa kõik tooted andmebaasist
app.get('/api/tooted', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query("SELECT * FROM Tooted");
        res.json(result.recordset);
    } catch (err) {
        console.error("MINU SQL VIGA:", err); // SEE RIDA ON KRIITILINE
        res.status(500).send(err.message);
    }
});

// 2. POST - Lisa uus toode
app.post('/api/tooted', async (req, res) => {
    const { nimi, hind, kogus } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('nimi', sql.NVarChar, nimi)
            .input('hind', sql.Decimal(10, 2), hind)
            .input('kogus', sql.Int, kogus)
            .query("INSERT INTO Tooted (nimi, hind, kogus) VALUES (@nimi, @hind, @kogus)");
        res.status(201).send("Toode edukalt lisatud!");
    } catch (err) {
        res.status(500).send("Viga lisamisel: " + err.message);
    }
});

// 3. PUT - Muuda olemasolevat toodet ID põhjal
app.put('/api/tooted/:id', async (req, res) => {
    const { id } = req.params;
    const { nimi, hind, kogus } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('id', sql.Int, id)
            .input('nimi', sql.NVarChar, nimi)
            .input('hind', sql.Decimal(10, 2), hind)
            .input('kogus', sql.Int, kogus)
            .query("UPDATE Tooted SET nimi=@nimi, hind=@hind, kogus=@kogus WHERE id=@id");
        res.send("Toode uuendatud!");
    } catch (err) {
        res.status(500).send("Viga uuendamisel: " + err.message);
    }
});

// 4. DELETE - Kustuta toode ID põhjal
app.delete('/api/tooted/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM Tooted WHERE id=@id");
        res.send("Toode kustutatud!");
    } catch (err) {
        res.status(500).send("Viga kustutamisel: " + err.message);
    }
});

// Serveri käivitamine
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server töötab pordil ${PORT}`);
});