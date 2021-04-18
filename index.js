const app = require('express')();
const session = require('express-session')
const favicon = require('serve-favicon');
const fs = require('fs');
const http = require('http');
const https = require('https');
const nocache = require('nocache');


const settings = require('./settings.json');

const ShitpostaDB = require('./shitpostaDB');
const shitDB = new ShitpostaDB('./db/shit.db', settings.folder);

const media_filters = {
    VIDEO: true,
    IMG: true,
    AUDIO: true
}

require('path');

const server = settings.ssl.enabled?https.createServer({key: fs.readFileSync(settings.ssl.key, 'utf8'), cert: fs.readFileSync(settings.ssl.cert, 'utf8')}, app):http.createServer(app);

app.set('trust proxy', true);

app.use(session({
  secret: settings.cookies_secret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: settings.ssl.enabled }
}));

app.set('etag', false);
app.set('view engine', 'ejs');
app.disable('view cache');

app.use(favicon(__dirname + '/icon.png'));

app.use('*', async function (req, res, next) {
    if (settings.ssl.enabled && req.protocol !== "https") return res.redirect('https://' + req.headers.host + req.url);
    if (shitDB.ready) return next();
    else return res.send("Still bowoting, pwease wait");
})

app.use('/view', async function (req, res, next) {
    let randomId = (await shitDB.getRandomFile()).id;
    let prevId = req.session.prevId ? req.session.prevId : null
    req.session.views++;
    req.session.prevId = randomId;
    res.render('pages/random.ejs', 
        {
            options: {
                id: randomId,
                auto: req.query.auto?true:false,
                filter: (req.query.filter && media_filters[req.query.filter.toUpperCase()]) ? req.query.filter.toUpperCase() : null,
                copy: req.query.copy?true:false,
                prevId: prevId ? prevId : "view",
                url: req.protocol + '://' + req.get('host') + '/',
                privateStats: req.session.views ? req.session.views : 0
            }
        }
    );
})

app.use('/settings', async function (req, res, next) {
    let prevId = req.session.prevId ? req.session.prevId : null
    res.render('pages/settings.ejs', 
        {
            options: {
                id: 0,
                auto: false,
                filter: null,
                copy: false,
                prevId: prevId ? prevId : "view",
                url: req.protocol + '://' + req.get('host') + '/',
                privateStats: req.session.views ? req.session.views : 0
            }
        }
    );
    
})

app.use('/:id', async function (req, res, next) {
    nocache();
    var trash = await shitDB.getFileName(req.params.id).catch(() => {
        return;
    });
    if (!fs.existsSync(__dirname + shitDB.shitFolder + trash)) return res.send("Not found, RIP")
    res.sendFile(shitDB.shitFolder + trash, { root: __dirname });
});

app.use('/', async function (req, res) {
    res.render('pages/index.ejs');
});

app.use('*', async function (req, res) {
    res.send("Error uwu");
});

server.listen(settings.port, settings.address, () => {
    console.log(`Serving Trash on ${settings.address}:${settings.port}`);
});
