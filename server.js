var express = require('express');


var app = express();


app.configure(function () {
  
  app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
 
   app.use(express.bodyParser());

});





var mongo = require('mongodb');


var Server = mongo.Server,
    
Db = mongo.Db,
  
  BSON = mongo.BSONPure;


var server = new Server('127.0.0.1', 27017, {auto_reconnect: true});

var db = new Db('wined', server);

db.open(function(err, db) {

    if(!err) {
      
  console.log("Connected to 'wined' database");
     
   db.collection('wines', {strict:true}, function(err, collection) {

            if (err) {
  
              console.log("The 'wines' collection doesn't exist. Creating it with sample data...");

                populateDB();
       
     }
  
      });

    }

});

app.get('/update/:id/:la/:lo',function(req,res){
    console.log('entered');
    var ide=req.params.id;
    var lati=req.params.la;
    var lon=req.params.lo;
    console.log('2nd phase');
    db.collection('wines',function(err,collection){
        console.log('entered the collection phase');
        collection.update({'id':ide},{$set:{'lat':lati,'lon':lon}});
   console.log('reached end');
    });
    
});
app.get('/wines/update/:id/:pass',  function(req, res) {
   
 var id = req.params.id;

    var pas = req.params.pass;
 
   console.log('Retrieving wine: ' + id);
 
   db.collection('wines', function(err, collection) {
     
   collection.find({'id':id,'pass':pas}).toArray(function(err, item) {
 
           if(item.length != 0){
  
              
 
               res.send(item);
   
         }
            else{
    
            res.send("fail");
   
         }
    
    });
  
  });

    });



app.get('/wines/:id/:pass',  function(req, res) {
   
 var id = req.params.id;

    var pas = req.params.pass;
 
   console.log('Retrieving wine: ' + id);
 
   db.collection('wines', function(err, collection) {
     
   collection.find({'id':id,'pass':pas}).toArray(function(err, item) {
 
           if(item.length != 0){
  
              
 
               res.send("success");
   
         }
            else{
    
            res.send("fail");
   
         }
    
    });
  
  });

    });


var populateDB = function() {

   
 var wines = [
    
{

id: "bus",
pass:"bus",
lat:"12.7827579",
lon:"80.2260947"

}];

  
  db.collection('wines', function(err, collection) {
  
      collection.insert(wines, {safe:true}, function(err, result) {});

    });


};
  

app.listen(process.env.PORT);
console.log('Listening on port ...'+process.env.PORT);
