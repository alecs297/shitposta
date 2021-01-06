const SQLite = require('better-sqlite3');
const fs = require('fs');

class ShitpostaDB {
    constructor(dbPath, shitFolder) {
        this.dbPath = dbPath;
        this.shitFolder = shitFolder;
        this.initDB();
        this.populateDB();
    }

    async initDB() {
        this.db = new SQLite(this.dbPath)
        const table = this.db.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'files';").get();
        if (!table['count(*)']) {
            // If the table isn't there, create it and setup the database correctly.
            this.db.prepare("CREATE TABLE files (id INTEGER PRIMARY KEY, name TEXT);").run();
            // Ensure that the "id" row is always unique and indexed.
            this.db.prepare("CREATE UNIQUE INDEX idx_files_id ON files (id);").run();
            this.db.pragma("synchronous = 1");
            this.db.pragma("journal_mode = wal");
        }
    }

    get length() {
        return this.db.prepare("SELECT count(*) FROM files").get()['count(*)']
    }

    async populateDB() {
        const addFile = this.db.prepare("INSERT OR REPLACE INTO files(id, name) VALUES (?,?)");
        fs.readdirSync(__dirname + this.shitFolder).forEach(function (file, id) {
            addFile.run(id, file);
            //console.log(id, file);
        });
        console.log("dataBase populated");
    }

    async getFileName(id) {
        console.log("looking for", id)
        return this.db.prepare("SELECT name FROM files WHERE id = ?").get(id).name;
    }

    async getRandomFile() {
        return this.db.prepare("SELECT id,name FROM files ORDER BY RANDOM() LIMIT 1").get();
    }

}

module.exports = ShitpostaDB
