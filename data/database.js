(function(database){
   
 	var mongodb = require('mongodb');
 	var Urlmongodb = "mongodb://localhost:27017/test"
  var theDB = null;
    
    database.getDB = function(next){
    	if(!theDB){
    	mongodb.MongoClient.connect(Urlmongodb, function(err, db){
           if(err){
              next(err, null);
           }else{
           	theDB ={
           		db:db,
              users: db.collection('users'),
              patients: db.collection('patient'),
              master: db.collection('master')
           	}
              next(null, theDB);
           }

    	});
    }else{
    	next(null, theDB);
    };

    };



})(module.exports);