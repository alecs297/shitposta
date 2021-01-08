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

const server = settings.ssl.enabled?https.createServer({key: fs.readFileSync(settings.ssl.key, 'utf8'), cert: fs.readFileSync(settings.ssl.cert, 'utf8')}, app):http.createServer(app)

app.set('trust proxy', true);
app.set('etag', false);
app.set('view engine', 'ejs');
app.disable('view cache');

app.use(favicon(__dirname + '/icon.png'));

app.use('*', async function (req, res, next) {
    if (settings.ssl.enabled && req.protocol !== "https") return res.redirect('https://' + req.headers.host + req.url);
    if (shitDB.ready) return next();
    else return res.send("Still bowoting, pwease wait")
})

app.use('/infinity', async function (req, res, next) {
    res.render('pages/random.ejs', {id: (await shitDB.getRandomFile()).id, autoplay: false})
})

app.use('/auto', async function (req, res, next) {
    res.render('pages/random.ejs', {id: (await shitDB.getRandomFile()).id, autoplay: true})
})

app.use('/:id', async function (req, res, next) {
    nocache();
    var trash = await shitDB.getFileName(req.params.id).catch(() => {
        next()
    });
    if (!fs.existsSync(__dirname + shitDB.shitFolder + trash)) return res.send("This meme sucked, RIP")
    res.sendFile(shitDB.shitFolder + trash,
        { root: __dirname })
});

app.use('/', async function (req, res) {
    res.render('pages/index.ejs')
});

app.use('*', async function (req, res) {
    res.send("Error uwu")
});

server.listen(settings.port, settings.address, () => {
    console.log(`Serving Trash on ${settings.address}:${settings.port}`)
});
