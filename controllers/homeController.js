//homeController
(function(homecontroller){

 var data = require('../data');

 homecontroller.init = function(app){

  app.get('/', function(req, res){
  
  res.sendfile('./user.html');
  // data.getUsers(function(err, result){
  //   res.render('index', 
  //   	{title: 'User List', 
  //   	err: err, 
  //   	users: result, 
  //       Newerr: req.flash("Newerr")
  //   });
  // });
  });

  app.post('/', function(req, res){
    var userinfo = {
    	usern : req.body.usern, 
    	useremail : req.body.useremail};
    data.createUser(userinfo, function(err){
        if(err){
        	//console.log(err);
        	req.flash("Newerr", err);
        	res.redirect('/');
        }
        else{
            res.redirect('/');
        }
    });
  });

};
})(module.exports);