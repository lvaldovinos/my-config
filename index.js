var fs = require('fs'),
	_ = require('underscore'),
	env = process.env.NODE_ENV || 'dev',
	path = require('path'),
	myconfig = {},
	_defaults = 'defaults',
	_validFormats = ['json'];	

	
var _JSONparser = function _JSONparser(obj) {
	var keys = _.keys(obj);
	keys.forEach(function(key) {
		if (_.isObject(obj[key])) {
			_JSONparser(obj[key]);
		}
		else {
			if (obj[key].slice(0 , 1) === '$') {
				//we got to get the env variable
				obj[key] = process.env[obj[key].slice(1 , obj[key].length)] || 'none';
			}
		}
	});
	return obj;
};


	
myconfig.init = function init(configPath , cb) {
	var ext = path.extname(configPath).slice(1 , configPath.length),
		tmpFile,
		utf8data,
		finalConfig;
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
			//get dfaults...
			finalConfig = tmpFile[_defaults];
			//I got the json, need to check for properties' value that start with $, and extend finalConfig
			return _.extend(finalConfig , _JSONparser(tmpFile[env]));
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
				//get dfaults...
				finalConfig = tmpFile[_defaults];
				//I got the json, need to check for properties' value that start with $, and extend finalConfig
				return cb(null , _.extend(finalConfig , _JSONparser(tmpFile[env])));
			}
			catch (e) {
				throw { name : 'invalid json',
						message : e };
			}
		});
	}
};


module.exports = myconfig;