const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('pharmamanager',(err) => {
    if(err)
    {
        return console.error(err.message);
    }
    console.log('tables deleted');
});

db.run('DROP TABLE IF EXISTS medicines');
db.run('DROP TABLE IF EXISTS shopdetails');
db.run('DROP TABLE IF EXISTS pharmacy');
