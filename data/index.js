(function(data){
   
   var database = require('./database.js');
   var seeData = require("./seeData.js");
  

  data.getUsers = function(next){
  database.getDB(function(err, db){
  if(err){
  	//hadle err
  	next(err, null);
  }
  else{
    db.users.find({isValid: "True"}).toArray(function(err, result){
    	if(err){
    		next(err, null);
    	}else{
    		console.log(result);
    		next(null, result);
    		
    	};
    });
  };
  });
};

 data.GetUser = function(userid, next){
   database.getDB(function(err, db){
  if(err){
  	next(err);
  }
  else{
      db.users.findOne({usern : userid}, next);
  };
  });
 };

 data.getMaster = function(next){
  database.getDB(function(err, db){
  if(err){
    next(err, null);
  }
  else{
      db.master.find().toArray(function(err, result){
        if(err){
          next(err, null);
        }
        else{
          console.log(result);
          next(err, result);
        }
      });
  };
  });
 };
 
data.deleteUser = function(userid, next){
   database.getDB(function(err, db){
  if(err){
  	next(err);
  }
  else{
      db.users.update({usern : userid}, {$set:{isValid: "False"}}, next);
  };
  });
 };


  data.createUser = function(userinfo, next){
   database.getDB(function(err, db){
  if(err){
  	//hadle err
  	next(err, null);
  }
  else{
       db.users.find({usern: userinfo.usern, isActive: "True"}).count(function(err, count){
         if(err){
         	next(err);
         }
         else{
         	if(count !=0){
         		next('User already exits');
         	}else{
			        var user ={
			  	 	usern : userinfo.usern,
			  	 	useremail: userinfo.useremail,
			  	 	isValid: "True"
			  	 };
			  	 db.users.insert(user, function(err){
			        if(err){
			          next(err);
			        }else{
			          next(null);
			        }
			  	 });
         	}
         }
       });
  	};
  });
  };

  function seedDatabase(){
  database.getDB(function(err, db){
  if(err){
  	//hadle err
  }
  else{
     db.users.count(function(err,count){
        if(err){
        	console.log('error getting the data')
        }else{
          if(count == 0){
          	console.log('seeing Database')
          	seeData.initialUsers.users.forEach(function(item){
               db.users.insert(item, function(err){
               	if(err) console.log('There was an error inserting the data');
               });
          	});
          }
          else{
          	console.log('database already seeding');
          }
        };
     });
  };
  });
 };
 seedDatabase();

})(module.exports);