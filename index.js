const app = require('express')();
const favicon = require('serve-favicon');
const fs = require('fs');
const http = require('http');
const https = require('https');
const nocache = require('nocache');

const settings = require('./settings.json');

const ShitpostaDB = require('./shitpostaDB');
const shitDB = new ShitpostaDB('./db/shit.db', settings.folder);

require('path');

const server = settings.ssl.enabled?http.createServer(app):https.createServer({key: fs.readFileSync(settings.ssl.key, 'utf8'), cert: fs.readFileSync(settings.ssl.cert, 'utf8')}, app)

app.set('trust proxy', true);
app.set('etag', false);
app.disable('view cache');

app.use(favicon(__dirname + '/shit.ico'));

app.use('*', async function (req, res, next) {
    if (shitDB.ready) return next();
    else return res.send("Still bowoting, pwease wait")
})

app.use('/infinity', async function (req, res, next) {
    const id = (await shitDB.getRandomFile()).id
    res.send(`<!DOCTYPE html><html lang="en"><head><title>"${id}"</title></head><meta charset="utf-8"><iframe src="/${id}" style="position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;">Your browser doesn't support iframes :'(</iframe></html>`)
})

app.use('/:id', async function (req, res, next) {
    nocache();
    var trash = await shitDB.getFileName(req.params.id).catch(() => {
        next()
    });
    if (!fs.existsSync(__dirname + shitDB.shitFolder + trash)) res.send("This meme sucked, RIP")
    res.sendFile(shitDB.shitFolder + trash,
        { root: __dirname })
});

app.use('/', async function (req, res) {
    res.redirect("/" + (await shitDB.getRandomFile()).id);
});

app.use('*', async function (req, res) {
    res.send("Error uwu")
});

server.listen(settings.port, settings.address, () => {
    console.log(`Serving Trash on ${settings.address}:${settings.port}`)
});
