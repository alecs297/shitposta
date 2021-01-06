const app = require('express')();
const server = require('http').createServer(app);
const fs = require('fs');
const folder = "/shitpost/";
const nocache = require('nocache');
const ShitpostaDB = require('./shitpostaDB');
const shitDB = new ShitpostaDB('./db/shit.db', "/shitpost/")

console.log(shitDB.shitFolder)
require('path');

app.set('trust proxy', true);
app.set('etag', false);
app.disable('view cache');

app.use('/', async function (req, res, next) {
    nocache();
    res.sendFile(shitDB.shitFolder + shitDB.getRandomFile().name, { root: __dirname })
});

app.use('*', async function (req, res) {
    res.send("Error uwu")
});

// Petit rappel, le settings.json est à configurer (:
server.listen(80, "0.0.0.0");
console.log("Weebserver running");
