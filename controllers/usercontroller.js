(function(user){
 
 var data = require('../data');

 user.init = function(app){
 
 app.get('/user/:userid', function(req, res){
   var userid = req.params.userid;
   
   data.GetUser(userid, function(err, user){
   	  if(err){
         console.log(err);
   	  }else{
   	  	 res.set("Content-Type", "application/json");
         res.send(user);
   	  }
   });
   });
   //res.send({foo : "bar"});
  
   app.post('/:userid', function(req, res){
   var userid = req.params.userid; 
    
    data.deleteUser(userid, function(err){
    	if(err){
    		console.log(err);
    		res.redirect('/');
    	}else{
    		res.redirect('/');
    	}
    });
   });

  app.get('/master', function(req, res){
      data.getMaster(function(err, master){
      if(err){
         console.log('There was an error');
      }else{
         //console.log(master);
         res.set("Content-Type", "application/json");
         res.send(master);

      }
   });
  });


 };
   
})(module.exports);