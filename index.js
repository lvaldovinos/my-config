var fs = require('fs'),
	env = process.env.NODE_ENV || 'dev',
	path = require('path'),
	myconfig = {},
	_validFormats = ['json'];	
	
myconfig.init = function init(configPath , cb) {
	var ext = path.extname(configPath).slice(1 , configPath.length),
		tmpFile,
		utf8data;
	console.log(ext);
	console.log(env);
	if (typeof configPath !== 'string') throw { name : 'illegal argument',
												message : 'configPath argument must be string' };
	if (_validFormats.indexOf(ext) < 0) throw { name : 'illegal format',
												message : 'valid config files : ' + _validFormats.join(', ') };
	if (!cb) {
		//callback was not provided
		//ok read file sync..
		utf8data = fs.readFileSync(configPath , { encoding : 'utf8' });
		try {
			tmpFile = JSON.parse(utf8data);
			return tmpFile[env];
		}
		catch (e) {
			throw { name : 'invalid json',
					message : e };
		}
	}
	else {
		//callback provided
		if (typeof cb !== 'function') throw { name : 'illegal argument',
											  message : 'cb if provided must be a function' };
		//ok, read file async...
		fs.readFile(configPath , { encoding : 'utf8' } , function(err , data) {
			if (err) return cb(err);
			utf8data = data;
			try {
				tmpFile = JSON.parse(utf8data);
				return cb(null , tmpFile[env]);
			}
			catch (e) {
				throw { name : 'invalid json',
						message : e };
			}
		});
	}
};


module.exports = myconfig;