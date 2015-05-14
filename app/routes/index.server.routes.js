
var User     = require('mongoose').model('User')

module.exports = function(app) {
    var index = require('../controllers/index.server.controller');
    //var dashboard = require('../controllers/dashboard.server.controller');

    app.get('/', index.render);
   

     app.get('/dashboard', requireLogin, function(req, res){
     
      User.findOne(
      {id : req.body.username} , function(err, user){
          if(!user){
             req.session.reset();
             res.redirect('/signin');
          } else {
            console.log('it work');
           res.locals.user = user;
           res.render('dashboard', {user:  JSON.stringify(req.user) });
          }
    });
    });

    app.route('/logout')
    .get(index.logout);
};

function requireLogin(req, res, next){
      if(!req.user){
         res.redirect('/signin'); 
      }else {
        next();
      }
 }
