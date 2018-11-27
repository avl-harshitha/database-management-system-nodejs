const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('pharmamanager',(err) => {
    if(err)
    {
        return console.error(err.message);
    }
    console.log('tables created');
});

db.run('CREATE TABLE if not exists medicines(mcode int,mname text,ingred text,cost int,quantity int)');
db.run('CREATE TABLE if not exists shopdetails(pid int,shpname text,location text,email text)');
db.run('CREATE TABLE if not exists pharmacy(pid int,mcode int,quantity int)');
