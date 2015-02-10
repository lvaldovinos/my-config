var loader = require('./loader'),
		env = process.env.NODE_ENV || 'dev';

loader.init(env , function(err , data) {
	if (err) throw err;
	//data must be the config js data.

});
