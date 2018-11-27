const express = require('express');
const app = new express();
const bodyParser = require('body-parser');
var nodemailer = require('nodemailer')
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ontracksols@gmail.com',
    pass: 'lexionTrack'
  }
});
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/',function(request, response){
  response.sendfile('medihome.html');
})

app.get('/medicinedetails', function(request, response){
    response.sendfile('meddetails.html');
});
app.get('/addshop', function(request, response){
    response.sendfile('addshop.html');
});
app.get('/updatemed', function(request, response){
    response.sendfile('updatemed.html');
});
app.get('/addmed', function(request, response){
    response.sendfile('updatemed.html');
});




const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('pharmamanager',(err) => {
    if(err)
    {
        return console.error(err.message);
    }
    console.log('connected');
});

db.serialize(function(){
  
  app.post('/medicinedetails', function (req, res) {
    const pd = req.body;
    
  res.send('Got a POST request')
  db.run('INSERT INTO medicines(mname,ingred,cost,mcode,quantity) VALUES(?,?,?,?,?)',[pd.name,pd.ingredients,pd.cost,pd.medcode,pd.quantity], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted into medicines`);
  });
  
});
});

db.serialize(function(){
  app.post('/addshop', function (req,res) {
    const pd = req.body;
    res.send('Got a POST request')
  db.run('INSERT INTO shopdetails(pid,shpname,location,email) VALUES(?,?,?,?)',[pd.shopcode,pd.shopname,pd.location,pd.emailid], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted into shopdetails`);
  });
  })
});

db.serialize(function(){
  app.post('/addmed', function (req,res) {
    const pd = req.body;
    res.send('Got a POST request')
  db.run('INSERT INTO pharmacy(pid,mcode,medquantity) VALUES(?,?,?)',[pd.shopcode,pd.medcode,pd.medshpquantity], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted into shopdetails`);
  });
  })
});

db.serialize(function(){
  app.post('/updatemed',function(req,res){
    const pd = req.body;
    res.send('Got a POST request')
    db.run('UPDATE pharmacy SET medquantity = ? WHERE mcode = ?',[pd.medshpquantity,pd.medcode], function(err) {
    if (err) {
      return console.log(err.message);
    }
    if(pd.medshpquantity<30)
    {


      let sqlquery = 'SELECT * FROM medicines where mcode = ?';
      db.get(sqlquery, [pd.medcode], (err, row) => {
          if (err) {
            throw err;
          }
          
          if(row.quantity>0){
            console.log(row.quantity);
            let x = row.quantity -(30 - pd.medshpquantity)
            console.log(x);
            let sqlmailquery = 'SELECT email from shopdetails where pid = ?'
            db.get(sqlmailquery,[pd.shopcode],(err,mailrow)=>{
              if(err){
                throw err;
              }
            
            var mailOptions = {
              from: 'ontracksols@gmail.com',
              to: mailrow.email,
              subject: 'Medicines sent',
              text: 'Medicine ' + row.mname + ' '+(30 - pd.medshpquantity)+ ' units has been sent to you'
            };
            
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            }); 
          })

            let sqlquery2 = 'UPDATE medicines SET quantity = ? WHERE mcode = ?';
            db.run(sqlquery2, [x,pd.medcode], function(err) {
              if (err) {
                return console.error(err.message);
              }
              let sqlquery3 = 'UPDATE pharmacy SET medquantity = 30 WHERE pid = ?';
              db.run(sqlquery3, [pd.shopcode], function(err) {
                    if (err) { return console.error(err.message);
                    }
                    console.log(`Row(s) updated: ${this.changes}`);
                  
                  });      
              
                   
            });
          }
        });
    }
    // get the last insert id
    console.log(`A row has been inserted into pharmashop`);
  });
  

  })
});


var listener = app.listen(0, function(){
  console.log('Pharmamanager listening on port ' + listener.address().port); 
});






