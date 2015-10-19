'use strict';

var fs = require('fs'),
		_ = require('underscore'),
		JSONStream = require('JSONStream'),
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
		} else {
			if (_.isString(obj[key]) && obj[key].slice(0 , 1) === '$') {
				//we got to get the env variable
				obj[key] = process.env[obj[key].slice(1 , obj[key].length)] || 'none';
			}
		}
	});
	return obj;
};

var _JSONConverter = function _JSONConverter(utf8data) {
	var tmpFile;
		try {
			tmpFile = JSON.parse(utf8data);
			//get dfaults & env configurations...
			return _.extend(_.extend({}, _JSONparser(tmpFile[_defaults])), _JSONparser(tmpFile[env]));
		}
		catch (e) {
			throw { name : 'invalid json',
							message : e };
		}
};			

myconfig.init = function init(spec , cb) {
	var configPath,
			ext,
			utf8data;
	if (_.isObject(spec) && !_.isArray(spec) && !_.isFunction(spec)) {
		configPath = spec.path || null;
		env = spec.env || env;
	} else if (typeof spec === 'string') {
		configPath = spec;
	}
	ext = path.extname(configPath).slice(1 , configPath.length) || null;
	if (typeof configPath !== 'string') throw { name : 'illegal argument',
																							message : 'configPath argument must be string' };
	if (_validFormat !== ext) throw { name : 'illegal format',
																		message : 'valid config file : ' + _validFormat };
	if (typeof env !== 'string') throw { name : 'illegal value',
																			 message : 'env argument must be string' };
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
	} else {
		//callback provided
		if (!_.isFunction(cb)) throw { name : 'illegal argument',
											 						 message : 'cb if provided must be a function' };
		//ok, read file async...
		fs.createReadStream(configPath)
			.pipe(JSONStream.parse())
			.on('error', function(err) {
				return process.nextTick(function() {
					return cb(err);
				});
			})
			.on('root', function(root) {
			 return process.nextTick(function() {
					//set default & env configurations...
					return cb(null, _.extend(_.extend({}, _JSONparser(root[_defaults])), _JSONparser(root[env])));
				});
			});
	}
};


module.exports = myconfig;
