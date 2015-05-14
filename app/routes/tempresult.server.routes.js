// Invocar modo JavaScript 'strict'
'use strict';

	var users = require('../../app/controllers/user.server.controller');
	var template = require('../../app/controllers/tempresult.server.controller');

module.exports = function(app) {
	// order Routes
	app.route('/api/tempresult')
		//.get(template.list)
		.post(template.create);
   
   app.route('/api/template')
		.get(template.listpage)

   // app.route('/api/count')
   //      .post(cierre.updateCierre)
	// app.route('/api/order/:orderId')
	// 	.get(order.read)
	// 	.put(users.requiresLogin, order.update)
	// 	.delete(users.requiresLogin,  order.delete);

	// // Finish by binding the Pai middleware
	// app.param('doctorId', order.DoctorByID);
};