var User = require('mongoose').model('User');


exports.render = function(req, res){
  // if(req.session.lastVisit){
  // 	console.log(req.session);
  // 	console.log(req.session.lastVisit);
  // }

  // req.session.lastVisit = new Date();
  
   if(req.session && req.session.user){
      User.findOne({username : req.session.user.username}, function(err, user){
          if(!user){
          	req.session.reset();
          	res.redirect('/signin');
          }else{
          	res.locals.user = user;
          	console.log('this pass by the locals variabl');
          	//res.json(res.locals);
          	res.render('index',
              {
                user: JSON.stringify(res.locals.user)
              }
              );
          }
      });
   }else {
   	 res.redirect('/signin');
   }

};

exports.logout = function(req, res){
	req.session.reset();
	res.redirect('/');
}

function requireLogin(req, res, next){
      if(!req.user){
         res.redirect('/signin'); 
      }else {
        next();
      }
 }
