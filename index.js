const app = require('express')();
var router = require('express').Router();
var favicon = require('serve-favicon');

const server = require('http').createServer(app);
const fs = require('fs');
const folder = "/shitpost/";
const nocache = require('nocache');
const ShitpostaDB = require('./shitpostaDB');
const shitDB = new ShitpostaDB('./db/shit.db', "/shitpost/")

console.log(shitDB.shitFolder)
require('path');

async function selectShit() {
    return Math.floor(Math.random() * shitDB.length);
}

app.set('trust proxy', true);
app.set('etag', false);
app.disable('view cache');

app.use(favicon(__dirname + '/shit.ico'));

app.use('/:id', async function (req, res, next) {
    nocache();
    console.log("prout", req.params.id)
    res.sendFile(shitDB.shitFolder + await shitDB.getFileName(req.params.id).catch(err => console.error(err)),
        { root: __dirname })
});



app.use('/', async function (req, res) {
    res.redirect("/" + await selectShit());
    //console.log(shitpost.id);
    //res.redirect("/" + toString(shitpost.id));
    //res.sendFile(shitDB.shitFolder + shitpost.name, { root: __dirname })
});

app.use('*', async function (req, res) {
    res.send("Error uwu")
});

// Petit rappel, le settings.json est à configurer (:
server.listen(80, "0.0.0.0");
console.log("Weebserver running");
