const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const dbPath = './db/shit.db'
const folder = "/shitpost/";

if (!fs.existsSync(dbPath)) {
    var db = new sqlite3.Database('./db/shit.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log("Creating database")
    });
    let sql = `CREATE TABLE files (
        id INTERGER PRIMARY KEY,
        name TEXT UNIQUE
    )`
    db.run(sql, function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Created file table`);
    });
    console.log("populating DB")
    fs.readdirSync(__dirname + folder).forEach(function (file, id) {
        db.run(`INSERT INTO files(id,name) VALUES(?,?)`, [id, file], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    });
} else {
    var db = new sqlite3.Database('./db/shit.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log("Connected to database")
    });
}



// close the database connection
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Close the database connection.');
});
