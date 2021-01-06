const app = require('express')();
const favicon = require('serve-favicon');
const server = require('http').createServer(app);
const nocache = require('nocache');

const settings = require('./settings.json');

const ShitpostaDB = require('./shitpostaDB');
const shitDB = new ShitpostaDB('./db/shit.db', settings.folder);

require('path');

app.set('trust proxy', true);
app.set('etag', false);
app.disable('view cache');

app.use(favicon(__dirname + '/shit.ico'));

app.use('/:id', async function (req, res, next) {
    nocache();
    var trash = await shitDB.getFileName(req.params.id).catch(() => {
        next()
    });
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
