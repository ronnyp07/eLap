// Invocar modo JavaScript 'strict'
'use strict';

	var users = require('../../app/controllers/user.server.controller');
	var order = require('../../app/controllers/orders.server.controller');

module.exports = function(app) {
	// order Routes
	app.route('/api/orders')
		.get(order.list)
		.post(order.create);
   
   app.route('/api/mcierre')
        .get(order.lastOrder)
        .post(order.cerrarmonth);
   
  
	// app.route('/api/order/:orderId')
	// 	.get(order.read)
	// 	.put(users.requiresLogin, order.update)
	// 	.delete(users.requiresLogin,  order.delete);

	// // Finish by binding the Pai middleware
	// app.param('doctorId', order.DoctorByID);
};