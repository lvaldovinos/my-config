'use strict';

var fs = require('fs'),
	_ = require('underscore'),
	env = process.env.NODE_ENV || 'dev',
	path = require('path'),
	myconfig = {},
	_defaults = 'defaults',
	_validFormat = 'json';	

	
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

var _JSONConverter = function _JSONConverter(utf8data) {
	var tmpFile,
		finalConfig;
	try {
		tmpFile = JSON.parse(utf8data);
		//get dfaults...
		finalConfig = tmpFile[_JSONparser(_defaults)] || {};
		//got the json, need to check for properties' value that start with $, and extend finalConfig
		return _.extend(finalConfig , _JSONparser(tmpFile[env]));
	}
	catch (e) {
		throw { name : 'invalid json',
				message : e };
	}
};
	
myconfig.init = function init(configPath , cb) {
	var ext = path.extname(configPath).slice(1 , configPath.length),
		utf8data;
	if (typeof configPath !== 'string') throw { name : 'illegal argument',
												message : 'configPath argument must be string' };
	if (_validFormat !== ext) throw { name : 'illegal format',
									  message : 'valid config file : ' + _validFormat };
	if (!cb) {
		//callback was not provided
		//ok read file sync..
		try {
			utf8data = fs.readFileSync(configPath , { encoding : 'utf8' });
			return _JSONConverter(utf8data);
		}
		catch (e) {
			throw { name : 'file error',
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
			try {
				return cb(null , _JSONConverter(data));
			}
			catch (e) {
				return cb(e);
			}
		});
	}
};


module.exports = myconfig;