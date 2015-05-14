'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Mensajero = mongoose.model('Mensajero'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, mensajero;

/**
 * Mensajero routes tests
 */
describe('Mensajero CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Mensajero
		user.save(function() {
			mensajero = {
				name: 'Mensajero Name'
			};

			done();
		});
	});

	it('should be able to save Mensajero instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mensajero
				agent.post('/mensajeros')
					.send(mensajero)
					.expect(200)
					.end(function(mensajeroSaveErr, mensajeroSaveRes) {
						// Handle Mensajero save error
						if (mensajeroSaveErr) done(mensajeroSaveErr);

						// Get a list of Mensajeros
						agent.get('/mensajeros')
							.end(function(mensajerosGetErr, mensajerosGetRes) {
								// Handle Mensajero save error
								if (mensajerosGetErr) done(mensajerosGetErr);

								// Get Mensajeros list
								var mensajeros = mensajerosGetRes.body;

								// Set assertions
								(mensajeros[0].user._id).should.equal(userId);
								(mensajeros[0].name).should.match('Mensajero Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Mensajero instance if not logged in', function(done) {
		agent.post('/mensajeros')
			.send(mensajero)
			.expect(401)
			.end(function(mensajeroSaveErr, mensajeroSaveRes) {
				// Call the assertion callback
				done(mensajeroSaveErr);
			});
	});

	it('should not be able to save Mensajero instance if no name is provided', function(done) {
		// Invalidate name field
		mensajero.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mensajero
				agent.post('/mensajeros')
					.send(mensajero)
					.expect(400)
					.end(function(mensajeroSaveErr, mensajeroSaveRes) {
						// Set message assertion
						(mensajeroSaveRes.body.message).should.match('Please fill Mensajero name');
						
						// Handle Mensajero save error
						done(mensajeroSaveErr);
					});
			});
	});

	it('should be able to update Mensajero instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mensajero
				agent.post('/mensajeros')
					.send(mensajero)
					.expect(200)
					.end(function(mensajeroSaveErr, mensajeroSaveRes) {
						// Handle Mensajero save error
						if (mensajeroSaveErr) done(mensajeroSaveErr);

						// Update Mensajero name
						mensajero.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Mensajero
						agent.put('/mensajeros/' + mensajeroSaveRes.body._id)
							.send(mensajero)
							.expect(200)
							.end(function(mensajeroUpdateErr, mensajeroUpdateRes) {
								// Handle Mensajero update error
								if (mensajeroUpdateErr) done(mensajeroUpdateErr);

								// Set assertions
								(mensajeroUpdateRes.body._id).should.equal(mensajeroSaveRes.body._id);
								(mensajeroUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Mensajeros if not signed in', function(done) {
		// Create new Mensajero model instance
		var mensajeroObj = new Mensajero(mensajero);

		// Save the Mensajero
		mensajeroObj.save(function() {
			// Request Mensajeros
			request(app).get('/mensajeros')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Mensajero if not signed in', function(done) {
		// Create new Mensajero model instance
		var mensajeroObj = new Mensajero(mensajero);

		// Save the Mensajero
		mensajeroObj.save(function() {
			request(app).get('/mensajeros/' + mensajeroObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', mensajero.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Mensajero instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mensajero
				agent.post('/mensajeros')
					.send(mensajero)
					.expect(200)
					.end(function(mensajeroSaveErr, mensajeroSaveRes) {
						// Handle Mensajero save error
						if (mensajeroSaveErr) done(mensajeroSaveErr);

						// Delete existing Mensajero
						agent.delete('/mensajeros/' + mensajeroSaveRes.body._id)
							.send(mensajero)
							.expect(200)
							.end(function(mensajeroDeleteErr, mensajeroDeleteRes) {
								// Handle Mensajero error error
								if (mensajeroDeleteErr) done(mensajeroDeleteErr);

								// Set assertions
								(mensajeroDeleteRes.body._id).should.equal(mensajeroSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Mensajero instance if not signed in', function(done) {
		// Set Mensajero user 
		mensajero.user = user;

		// Create new Mensajero model instance
		var mensajeroObj = new Mensajero(mensajero);

		// Save the Mensajero
		mensajeroObj.save(function() {
			// Try deleting Mensajero
			request(app).delete('/mensajeros/' + mensajeroObj._id)
			.expect(401)
			.end(function(mensajeroDeleteErr, mensajeroDeleteRes) {
				// Set message assertion
				(mensajeroDeleteRes.body.message).should.match('User is not logged in');

				// Handle Mensajero error error
				done(mensajeroDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Mensajero.remove().exec();
		done();
	});
});