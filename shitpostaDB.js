const SQLite = require('better-sqlite3');
const fs = require('fs');

class ShitpostaDB {
    constructor(dbPath, shitFolder) {
        this.dbPath = dbPath;
        this.shitFolder = shitFolder;
        this.ready = false;
        this.initDB();
        this.populateDB();
    }

    async initDB() {
        this.db = new SQLite(this.dbPath)
        const table = this.db.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'files';").get();
        if (!table['count(*)']) {
            // If the table isn't there, create it and setup the database correctly.
            this.db.prepare("CREATE TABLE files (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);").run();
            // Ensure that the "id" row is always unique and indexed.
            this.db.prepare("CREATE UNIQUE INDEX idx_files_id ON files (id);").run();
            this.db.pragma("synchronous = 1;");
            this.db.pragma("journal_mode = wal;");
            console.log("Created tables.")
        }
        else {
            console.log("Loaded tables!")
        }
    }

    async populateDB() {
        const req = this.db
        console.log("Updating db, please wait...")
        fs.readdirSync(__dirname + this.shitFolder).forEach(function (file) {
            if (!(req.prepare("SELECT * from files where name = ?;").get(file))) {
                req.prepare("INSERT INTO files (name) VALUES (?);").run(file);
            }
        });
        this.ready = true;
        console.log("DB updated");
    }

    async getFileName(id) {
        return this.db.prepare("SELECT name FROM files WHERE id = ?;").get(id).name;
    }

    async getRandomFile() {
        return this.db.prepare("SELECT id,name FROM files ORDER BY RANDOM() LIMIT 1;").get();
    }

}

module.exports = ShitpostaDB
