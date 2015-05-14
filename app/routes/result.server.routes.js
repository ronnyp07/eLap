// Invocar modo JavaScript 'strict'
'use strict';

	var users = require('../../app/controllers/user.server.controller');
	var result = require('../../app/controllers/result.server.controller');

module.exports = function(app) {
	// order Routes
	// app.route('/api/tempresult')
	// 	.post(result.create);
   
   app.route('/api/result')
		.get(result.listpage)
		.post(result.create);

   app.route('/api/result/:resultId')
	 .get(result.read)
	 .put(result.update)
	 //.delete(result.delete);

   app.route('/api/resultfilter')
		.get(result.getResultbyOrder)
		.post(result.getResultbyId);

   app.param('resultId', result.resultByID);
};

