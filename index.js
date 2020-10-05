// Require action
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

// Use action
const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vc8eu.mongodb.net/${process.env.DB_DBN}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const eventsCollection = client.db(process.env.DB_DBN).collection("events");
    const registersCollection = client.db(process.env.DB_DBN).collection("registers");
    // Insert Event Data From Admin
    app.post('/addEvent', (req, res) => {
        const newEvent = req.body;
        eventsCollection.insertOne(newEvent)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    // Read or Get Event Data From DB
    app.get('/getEvent', (req, res) => {
        eventsCollection.find({})
            .toArray((err, document) => {
                res.send(document);
            })

    })
    // Insert Register Events Data to DB From Users
    app.post('/addRegisterEvents', (req, res) => {
        const newRegEvents = req.body;
        registersCollection.insertOne(newRegEvents)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
    // Read or Get Register Events Data From DB
    app.get('/getRegisterEvents', (req, res) => {
        registersCollection.find({ email: req.query.email })
            .toArray((err, document) => {
                res.send(document);
            })
    })
    // Delete Register Events Data From DB
    app.delete('/deleteRegisterEvents/:id', (req, res) => {
        registersCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })

    // Admin Panel or Dashboard
    // Read or Get Register Events Data From DB
    app.get('/allRegisterEvents', (req, res) => {
        registersCollection.find({})
            .toArray((err, document) => {
                res.send(document);
            })
    })

    // Delete Register Events Data From DB
    app.delete('/deleteDashboardEvents/:id', (req, res) => {
        registersCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })
});

app.listen(process.env.PORT || 5000);