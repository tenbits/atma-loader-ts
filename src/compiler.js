var _ts;
var _utils;

module.exports	= {
	compile: function(source, path, config){
		if (_ts == null) {
			_ts = require('typescript');
			_utils = require('atma-utils');
		}
		
		var uri = new _utils.class_Uri(path),
			filename = uri.toLocalFile();
		
		var options = _defaults(config.typescript, {
			fileName: filename,
		});
		if (options.compilerOptions) {
			_defaults(options.compilerOptions, {
				sourceMap: true
			});
		}

		var compiled = _compile(source, options),	
			errors = compiled.errors == null || compiled.errors.length === 0
				? null
				: 'throw Error("Typescript '
					+ compiled.errors.join('\\\n').replace(/"/g, '\\"').replace(/\n/g, '\\n')
					+ '");'
			;
		
		if (errors) {
			console.error('Typescript Error for "' + filename + '"\n' + compiled.errors.join('\n'));
			return {
				content: errors,
				sourceMap: errors
			};
		}
		if (options.sourceMaps === false) {
			return {
				content: compiled.js,
				sourceMap: null
			};
		}		
		var js = compiled.js,
			sourceMap = compiled.sourceMap || compiled.sourceMapText;
		if (sourceMap) 
			js += '\n//# sourceMappingURL=' + uri.file + '.map';
		
		return {
			content: js,
			sourceMap: sourceMap
		};
	}
};

function _defaults(target, source){
	if (target == null) 
		return source;
	for(var key in source){
		if (key in target === false) 
			target[key] = source[key];
	}
	return target;
}
function _compile(source, options) {
	try {
		
		var compiled =  _ts.transpileModule(source, options);		
		var sourceMap = compiled.sourceMapText;
		if (sourceMap != null && typeof sourceMap !== 'string') 
			sourceMap = JSON.stringify(sourceMap, null, 4);
		return {
			js: compiled.outputText,
			sourceMap: sourceMap
		};
	} catch (error) {		
		throw new Error(error.message + '\n' + error.codeFrame);
	}
}