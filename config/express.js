var config = require('./config'),
    //session = require('express-session'),
    express = require('express'),
    morgan = require('morgan'), 
    csrf = require('csurf'),
    path = require('path'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    passport = require('passport'),
    session = require('client-sessions'),
    flash = require('connect-flash');
 

require('../app/models/user.server.model');
 var  User = require('mongoose').model('User');
 
module.exports = function(){
   var app = express();
    if(process.env.NODE_ENV === 'develoment'){
       app.use(morgan('dev'))
    }else if (process.env.NODE_ENV === 'production'){
    	app.use(compress());
    }

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json()); 
    app.use(methodOverride());
    //app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static("./public"));
    app.use('/bower_components',  express.static(__dirname + '/bower_components'));


    // app.use (session({
    //   saveUninitialized: true,
    //   resave: true,
    //   secret: config.sessionSecret
    // }));
    app.use(session({
       cookieName: 'session',
       secret: 'kljljljlasdfhalsdjfljlj',
       duration: 30 * 60 * 100,
       activeDuration: 15 * 80 * 120,
       httpOnly: true,
       ephemeral: true
    }));
    // app.use(csrf());

    app.use(function(req, res, next){
         if(req.session && req.session.user){
           User.findOne({
            username : req.session.user.username
           }, function(err, user){
               if(user){
                req.user = user;
                delete req.user.password;
                req.session.user = req.user;
                res.locals.user = req.user;
               }
               next();
           });
         }else{
          next();
         }
    });
 

    
    app.set('views', './app/views');
    app.set('view engine', 'vash');
    
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    // var serverRouter = require("../app/router/index.server.router");
    // serverRouter.init(app);
    // var UserRouter = require("../app/router/user.server.router");
    // UserRouter.init(app);

      // Cargar los archivos de enrutamiento
  require('../app/routes/index.server.routes.js')(app);
  require('../app/routes/user.server.routes.js')(app);
  require('../app/routes/patient.server.routes.js')(app);
  require('../app/routes/seguros.server.routes.js')(app);
  require('../app/routes/pais.server.routes.js')(app);
  require('../app/routes/ciudad.server.routes.js')(app);
  require('../app/routes/sectors.server.routes.js')(app);
  require('../app/routes/clientes.server.routes.js')(app);
  require('../app/routes/procedimientos.server.routes.js')(app);
  require('../app/routes/doctor.server.routes.js')(app);
  require('../app/routes/orders.server.routes.js')(app);
  require('../app/routes/cierretrack.server.routes.js')(app);
  require('../app/routes/tempresult.server.routes.js')(app);
  require('../app/routes/result.server.routes.js')(app);

  //require('../app/routes/articles.server.routes.js')(app);
   

    return app;
};