const app = require('express')();
const server = require('http').createServer(app);
const fs = require('fs');
const folder = "/shitpost/";
const nocache = require('nocache');
console.log(folder)
require('path');

app.set('trust proxy', true);
app.set('etag', false);
app.disable('view cache');

function generateTrashList() {
    var list = []
    fs.readdirSync(__dirname + folder).forEach(file => {
        list.push(file)
    });
    return list
}

trashList = generateTrashList()

function sortTrash(trash) {
    a = trash[Math.floor(Math.random() * trash.length)]
    console.log(a)
    return a;
}
app.use('/', async function (req, res, next) {
    nocache();
    res.sendFile(folder + sortTrash(trashList), { root: __dirname })
});

app.use('*', async function (req, res) {
    res.send("Error uwu")
});

// Petit rappel, le settings.json est à configurer (:
server.listen(80, "0.0.0.0", console.log("Weebserver running"));
