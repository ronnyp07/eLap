// Invocar el modo 'strict' de JavaScript
'use strict';

// Cargar las dependencias del módulo
var users = require('../../app/controllers/user.server.controller'),
    passport = require('passport');

//Definir el método del módulo routes
module.exports = function(app) {
	//Configurar las rutas 'signup'
  app.route('/signup')
     .get(users.renderSignup)
     .post(users.signup);

  //Configurar las routes 'signin'
  app.route('/signin')
     .get(users.renderSignin)
     .post(users.login);


  app.route('/dashboard')
  .get(users.renderDashboard)
     // .post(passport.authenticate('local', {
     //   successRedirect: '/',
     //   failureRedirect: '/signin',
     //   failureFlash: true
     // }));
     
 // Configurar las rutas Google OAuth 
  // app.get('/oauth/google', passport.authenticate('google', {
  //   scope: [
  //     'https://www.googleapis.com/auth/userinfo.profile',
  //     'https://www.googleapis.com/auth/userinfo.email'
  //   ],
  //   failureRedirect: '/signin'
  // }));
  // app.get('/oauth/google/callback', passport.authenticate('google', {
  //   failureRedirect: '/signin',
  //   successRedirect: '/'
  // }));

  //Configurar la route 'signout'
  app.get('/signout', users.signout);
};