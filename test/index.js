var should = require('should'),
	fs = require('fs'),
	cfp = __dirname + '/config.json',
	myconfig = require('./../index');
	
describe('myconfig test case' , function() {
	describe('#init no callback provided' , function() {
		beforeEach('Create config.json file under __dirname' , function(done) {
			var cf = {
				defaults : {
					'account-types' : ['employee' , 'admin' , 'cooker'],
					database : 'example'
				},
				dev : {
					database : {
						name : 'example dev',
						example : 'example',
						password : '$Path'
					},
					client : {
						name : 'example.com'
					},
					dbshards : [
						{
							host : 'example.dbshard.1.com',
							name : 'idk',
							pass : '123'
						},
						{
							host : 'example.dbshard.2.com',
							name : 'idk',
							pass : '$Path'
						}
					]
				},
				test : {
					database : 'example qa'
				},
				production : {
					database : 'example prod'
				}
			};
			fs.writeFile(cfp , JSON.stringify(cf) , function(err) {
				if (err) return done(err);
				console.log('Config file saved!');
				done();
			});
		});
		it('Should return the development config object' , function() {
			var mc = myconfig.init(cfp);
			mc.should.be.an.Object;
			mc.should.not.be.empty;
			mc.should.be.an.Object;
			mc.should.have.property('database');
			mc.database.should.be.exactly('example dev');
		});
	});
	describe('#init callback provided' , function() { 
		beforeEach('Create config.json file under __dirname' , function(done) {
			var cf = {
				dev : {
					database : {
						name : 'example dev',
						password : {
							'mc-env' : 'path'
						}
					}
				},
				test : {
					database : 'example qa'
				},
				production : {
					database : 'example prod'
				}
			};
			fs.writeFile(cfp , JSON.stringify(cf) , function(err) {
				if (err) return done(err);
				console.log('Config file saved!');
				done();
			});
		});
		it('Should return the development config object' , function(done) {
			var mc = myconfig.init(cfp , function(err , envConfig) {
				if (err) return done(err);
				should(err).not.be.ok;
				envConfig.should.not.be.empty;
				envConfig.should.be.an.Object;
				envConfig.should.have.property('database');
				envConfig.database.should.be.exactly('example dev');
				done();
			});
		});
	});
})