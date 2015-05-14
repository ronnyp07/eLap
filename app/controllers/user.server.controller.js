// Invocar el modo 'strict'
'use strict';

// Cargar el módulo dependencies
var User     = require('mongoose').model('User'),
    bcrypt   = require('bcryptjs'),
    passport = require('passport');

// Crear un nuevo método controller manejador de errores
var getErrorMessage = function(err) {
  // Definir la variable de error message
  var message = '';

  // Si un error interno de MongoDB ocurre obtener el mensaje de error
  if (err.code) {
    switch (err.code) {
      // Si un eror de index único ocurre configurar el mensaje de error
      case 11000:
      case 11001:
        message = 'Usuario ya existe';
        break;
      // Si un error general ocurre configurar el mensaje de error
      default:
        message = 'Se ha producido un error';
    }
  } else {
    // Grabar el primer mensaje de error de una lista de posibles errores
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }

  // Devolver el mensaje de error
  return message;
};

// Crear un nuevo método controller que renderiza la página signin
exports.renderSignin = function(req, res, next) {
  // Si el usuario no está conectado renderizar la página signin, en otro caso redireccionar al usuario de vuelta a la página principal de la aplicación
  if (!req.user) {
    // Usa el objeto 'response' para renderizar la página signin
    res.render('signin', {
      // Configurar la variable title de la página
      title: 'Sign-in Form',
      //csrfToken : req.csrfToken(),
      // Configurar la variable del mensaje flash
      messages: req.flash('error') || req.flash('info')
    });
  } else {
    return res.redirect('/');
  }
};

// Crear un nuevo método controller que renderiza la página signup
exports.renderSignup = function(req, res, next) {
  // Si el usuario no está conectado renderizar la página signin, en otro caso redireccionar al usuario de vuelta a la página principal de la aplicación
  if (!req.user) {
    // Usa el objeto 'response' para renderizar la página signup
    res.render('signup', {
      // Configurar la variable title de la página
      title: 'Login'
      //csrfToken : req.csrfToken()
    });
  } else {
    return res.redirect('/');
  }
};

exports.signup = function(req, res){
      // res.json(req.body);
       var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
       var user = new User({
           firstName: req.body.firstName,
           lastName: req.body.lastName,
           email : req.body.email,
           username: req.body.username,
           password : hash
       });

       user.save(function(err){
          if(err){
            console.log(err);
            var err = "Huvo un error con su usuario por favor trate de nuevo"
         
            if(err.code === 11000){
              err = "Este usuario ya existe intente con uno nuevo";
            }
            res.render('signup', {err: err});

          }else {
            console.log('suppose to be saved');
            res.redirect('/');
          }
       });
};

// //Crear un nuevo método controller que crea nuevos users 'regular'
// exports.signup = function(req, res, next) {
//   // Si user no está conectado, crear y hacer login a un nuevo usuario, en otro caso redireccionar el user de vuelta a la página de la aplicación principal
//   if (!req.user) {
//     // Crear una nueva instancia del modelo 'User'
//     var user = new User(req.body);
//     var message = null;

//     // Configurar la propiedad user provider
//     user.provider = 'local';

//     // Intenta salvar el nuevo documento user
//     user.save(function(err) {
//       // Si ocurre un error, usa el mensaje flash para reportar el error
//       if (err) {
//         // Usa el método de manejo de errores para obtener el mensaje de error
//         var message = getErrorMessage(err);

//         // Configura los mensajes flash
//         req.flash('error', message);

//         // Redirecciona al usuario de vuelta a la página signup
//         return res.redirect('/signup');
//       }

//       // Si el usuario fue creado de modo correcto usa el método 'login' de Passport para hacer login
//       req.login(user, function(err) {
//         // Si ocurre un error de login moverse al siguiente middleware
//         if (err) return next(err);

//         // Redireccionar al usuario de vuelta a la página de la aplicación principal
//         return res.redirect('/');
//       });
//     });
//   } else {
//     return res.redirect('/');
//   }
// };

// Crear un nuevo método controller que crea nuevos usuarios 'OAuth'
// exports.saveOAuthUserProfile = function(req, profile, done) {
//   // Prueba a encontrar un documento user que fue registrado usando el actual provider OAuth
//   User.findOne({
//     provider: profile.provider,
//     providerId: profile.providerId
//   }, function(err, user) {
//     // Si ha ocurrido un error continua al siguiente middleware
//     if (err) {
//       return done(err);
//     } else {
//       // Si un usuario no ha podido ser encontrado, crea un nueo user, en otro caso, continua al siguiente middleware
//       if (!user) {
//         // Configura un posible username base username
//         var possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');

//         // Encuentra un username único disponible
//         User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
//           // Configura el nombre de usuario disponible 
//           profile.username = availableUsername;
          
//           // Crear el user
//           user = new User(profile);

//           // Intenta salvar el nuevo documento user
//           user.save(function(err) {
//             // Continúa al siguiente middleware
//             return done(err, user);
//           });
//               } else {});

//         // Continúa al siguiente middleware
//         return done(err, user);
//       }
//     }
//   });
// };

// Crear un nuevo método controller para signing out
exports.signout = function(req, res) {
  // Usa el método 'logout' de Passport para hacer logout
  req.logout();

  // Redirecciona al usuario de vuelta a la página de la aplicación principal
  res.redirect('/');
};

// Crear un nuevo middleware controller que es usado para autorizar operaciones de autentificación 
exports.requiresLogin = function(req, res, next) {
  // Si un usuario no está autentificado envía el mensaje de error apropiado
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      message: 'Usuario no está identificado'
    });
  }

  // Llamar al siguiente middleware
  next();
};

// Crear un nuevo middleware controller que es usado para autorizar operaciones de autentificación 
exports.login = function(req, res) {
  //res.json(req.body);
    User.findOne(
      {username : req.body.username} , function(err, user){
          if(!user){
            res.render('signin', {err: "Verificar su informacion e intentar de nuevo"
              //, csrfToken : req.csrfToken()}
              })
          } else {
            if(bcrypt.compareSync(req.body.password, user.password)){
              req.session.user = user;
              res.redirect('/');
            }else {
                 res.render('signin', {err: "Verificar su informacion e intentar de nuevo"
                 // csrfToken : req.csrfToken()
                })
            }
          }
    });
};

exports.getUser = function(req, res) {
  //res.json(req.body);
    User.findOne(
      {id : req.body.username} , function(err, user){
          if(!user){
            res.render('signin', {err: "Verificar su informacion e intentar de nuevo"
              // , csrfToken : req.csrfToken()
            })
          } else {
            if(bcrypt.compareSync(req.body.password, user.password)){
              res.locals.user = user;
              res.redirect('/dashboard')
            }else {
                 res.render('signin', {err: "Verificar su informacion e intentar de nuevo"
                  // , csrfToken : req.csrfToken()
                })
            }
          }
    });
};


exports.renderDashboard = function(req, res) {
    User.findOne(
      {id : req.body.username} , function(err, user){
          if(!user){
             req.session.reset();
             res.redirect('/signin');
          } else {
            console.log('it work');
           res.locals.user = user;
           res.render('dashboard');
          }
    });
};
