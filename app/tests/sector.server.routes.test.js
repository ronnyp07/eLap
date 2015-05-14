'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Sector = mongoose.model('Sector'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, sector;

/**
 * Sector routes tests
 */
describe('Sector CRUD tests', function() {
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

		// Save a user to the test db and create new Sector
		user.save(function() {
			sector = {
				name: 'Sector Name'
			};

			done();
		});
	});

	it('should be able to save Sector instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sector
				agent.post('/sectors')
					.send(sector)
					.expect(200)
					.end(function(sectorSaveErr, sectorSaveRes) {
						// Handle Sector save error
						if (sectorSaveErr) done(sectorSaveErr);

						// Get a list of Sectors
						agent.get('/sectors')
							.end(function(sectorsGetErr, sectorsGetRes) {
								// Handle Sector save error
								if (sectorsGetErr) done(sectorsGetErr);

								// Get Sectors list
								var sectors = sectorsGetRes.body;

								// Set assertions
								(sectors[0].user._id).should.equal(userId);
								(sectors[0].name).should.match('Sector Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Sector instance if not logged in', function(done) {
		agent.post('/sectors')
			.send(sector)
			.expect(401)
			.end(function(sectorSaveErr, sectorSaveRes) {
				// Call the assertion callback
				done(sectorSaveErr);
			});
	});

	it('should not be able to save Sector instance if no name is provided', function(done) {
		// Invalidate name field
		sector.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sector
				agent.post('/sectors')
					.send(sector)
					.expect(400)
					.end(function(sectorSaveErr, sectorSaveRes) {
						// Set message assertion
						(sectorSaveRes.body.message).should.match('Please fill Sector name');
						
						// Handle Sector save error
						done(sectorSaveErr);
					});
			});
	});

	it('should be able to update Sector instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sector
				agent.post('/sectors')
					.send(sector)
					.expect(200)
					.end(function(sectorSaveErr, sectorSaveRes) {
						// Handle Sector save error
						if (sectorSaveErr) done(sectorSaveErr);

						// Update Sector name
						sector.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Sector
						agent.put('/sectors/' + sectorSaveRes.body._id)
							.send(sector)
							.expect(200)
							.end(function(sectorUpdateErr, sectorUpdateRes) {
								// Handle Sector update error
								if (sectorUpdateErr) done(sectorUpdateErr);

								// Set assertions
								(sectorUpdateRes.body._id).should.equal(sectorSaveRes.body._id);
								(sectorUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Sectors if not signed in', function(done) {
		// Create new Sector model instance
		var sectorObj = new Sector(sector);

		// Save the Sector
		sectorObj.save(function() {
			// Request Sectors
			request(app).get('/sectors')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Sector if not signed in', function(done) {
		// Create new Sector model instance
		var sectorObj = new Sector(sector);

		// Save the Sector
		sectorObj.save(function() {
			request(app).get('/sectors/' + sectorObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', sector.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Sector instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sector
				agent.post('/sectors')
					.send(sector)
					.expect(200)
					.end(function(sectorSaveErr, sectorSaveRes) {
						// Handle Sector save error
						if (sectorSaveErr) done(sectorSaveErr);

						// Delete existing Sector
						agent.delete('/sectors/' + sectorSaveRes.body._id)
							.send(sector)
							.expect(200)
							.end(function(sectorDeleteErr, sectorDeleteRes) {
								// Handle Sector error error
								if (sectorDeleteErr) done(sectorDeleteErr);

								// Set assertions
								(sectorDeleteRes.body._id).should.equal(sectorSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Sector instance if not signed in', function(done) {
		// Set Sector user 
		sector.user = user;

		// Create new Sector model instance
		var sectorObj = new Sector(sector);

		// Save the Sector
		sectorObj.save(function() {
			// Try deleting Sector
			request(app).delete('/sectors/' + sectorObj._id)
			.expect(401)
			.end(function(sectorDeleteErr, sectorDeleteRes) {
				// Set message assertion
				(sectorDeleteRes.body.message).should.match('User is not logged in');

				// Handle Sector error error
				done(sectorDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Sector.remove().exec();
		done();
	});
});