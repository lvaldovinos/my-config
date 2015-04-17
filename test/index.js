var should = require('should'),
	fs = require('fs'),
	path = require('path'),
	cfp = path.resolve(__dirname , './config.json'),
	myconfig = require('./../index');
	
describe('myconfig test case' , function() {
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
			done();
		});
	});
	describe('#init no callback provided' , function() {
		it('Should return the development config object' , function() {
			var mc = myconfig.init(cfp);
			mc.should.be.an.Object;
			mc.should.not.be.empty;
			mc.should.have.properties('account-types' , 'database' , 'client' , 'dbshards');
			mc.database.should.be.an.Object;
			mc.database.should.have.properties('name' , 'example' , 'password');
			mc.database.password.should.not.be.exactly('$Path');
			mc.client.should.be.an.Object;
			mc.dbshards.should.be.an.Array;
			mc.dbshards.should.have.length(2);
			mc.dbshards[1].pass.should.not.startWith('$');
		});
    it('Should return the development config object specifying environment variable' , function() {
			var mc = myconfig.init({
        path : cfp,
        env : 'dev' });
			mc.should.be.an.Object;
			mc.should.not.be.empty;
			mc.should.have.properties('account-types' , 'database' , 'client' , 'dbshards');
			mc.database.should.be.an.Object;
			mc.database.should.have.properties('name' , 'example' , 'password');
			mc.database.password.should.not.be.exactly('$Path');
			mc.client.should.be.an.Object;
			mc.dbshards.should.be.an.Array;
			mc.dbshards.should.have.length(2);
			mc.dbshards[1].pass.should.not.startWith('$');
		});

	});
	describe('#init callback provided' , function() { 
		it('Should return the development config object specifying callback' , function(done) {
			var mc = myconfig.init(cfp , function(err , mc) {
				if (err) return done(err);
				should(err).not.be.ok;
				mc.should.be.an.Object;
				mc.should.not.be.empty;
				mc.should.have.properties('account-types' , 'database' , 'client' , 'dbshards');
				mc.database.should.be.an.Object;
				mc.database.should.have.properties('name' , 'example' , 'password');
				mc.database.password.should.not.be.exactly('$Path');
				mc.client.should.be.an.Object;
				mc.dbshards.should.be.an.Array;
				mc.dbshards.should.have.length(2);
				mc.dbshards[1].pass.should.not.startWith('$');
				done();
			});
		});
    it('Should return the development config object specifying env variable and callback' , function(done) {
			var mc = myconfig.init({
        path : cfp,
        env : 'dev' }, function(err , mc) {
				if (err) return done(err);
				should(err).not.be.ok;
				mc.should.be.an.Object;
				mc.should.not.be.empty;
				mc.should.have.properties('account-types' , 'database' , 'client' , 'dbshards');
				mc.database.should.be.an.Object;
				mc.database.should.have.properties('name' , 'example' , 'password');
				mc.database.password.should.not.be.exactly('$Path');
				mc.client.should.be.an.Object;
				mc.dbshards.should.be.an.Array;
				mc.dbshards.should.have.length(2);
				mc.dbshards[1].pass.should.not.startWith('$');
				done();
			});
		});

	});
})
