// Invocar modo JavaScript 'strict'
'use strict';

	var users = require('../../app/controllers/user.server.controller');
	var cierre = require('../../app/controllers/cierretrack.server.controller');

module.exports = function(app) {
	// order Routes
	app.route('/api/cierre')
		.post(cierre.create);
		//.post(cierre.create);
   
   app.route('/api/counter')
        .post(cierre.list);

   app.route('/api/count')
        .post(cierre.updateCierre)
	// app.route('/api/order/:orderId')
	// 	.get(order.read)
	// 	.put(users.requiresLogin, order.update)
	// 	.delete(users.requiresLogin,  order.delete);

	// // Finish by binding the Pai middleware
	// app.param('doctorId', order.DoctorByID);
};