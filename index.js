
// source ./RootModule.js
(function(){
	
	var _node_modules_atma_loader_stacktrace_index = {};
var _src_compiler = {};

// source ./ModuleSimplified.js
var _src_compiler;
(function () {
	var exports = {};
	var module = { exports: exports };
	"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
function process(source, file, compiler) {
    var uri = file.uri, filename = uri.toLocalFile();
    var options = __assign({}, (compiler.getOption('typescript') || {}), { fileName: filename });
    if (options.compilerOptions) {
        _defaults(options.compilerOptions, {
            sourceMap: true
        });
    }
    var compiled = _compile(source, options);
    var errors = compiled.errors == null || compiled.errors.length === 0
        ? null
        : 'throw Error("Typescript '
            + compiled.errors.join('\\\n').replace(/"/g, '\\"').replace(/\n/g, '\\n')
            + '");';
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
    var js = compiled.js, sourceMap = compiled.sourceMap;
    if (sourceMap) {
        js += '\n//# sourceMappingURL=' + uri.file + '.map';
    }
    return {
        content: js,
        sourceMap: sourceMap
    };
}
exports.default = process;
function _defaults(target, source) {
    if (target == null)
        return source;
    for (var key in source) {
        if (key in target === false)
            target[key] = source[key];
    }
    return target;
}
function _compile(source, options) {
    try {
        var compiled = ts.transpileModule(source, options);
        var sourceMap = compiled.sourceMapText;
        if (sourceMap != null && typeof sourceMap !== 'string') {
            sourceMap = JSON.stringify(sourceMap, null, 4);
        }
        return {
            js: compiled.outputText,
            sourceMap: sourceMap,
            errors: null
        };
    }
    catch (error) {
        throw new Error(error.message + '\n' + error.codeFrame);
    }
}
;

	function isObject(x) {
		return x != null && typeof x === 'object' && x.constructor === Object;
	}
	if (isObject(_src_compiler) && isObject(module.exports)) {
		Object.assign(_src_compiler, module.exports);
		return;
	}
	_src_compiler = module.exports;
}());
// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _node_modules_atma_loader_stacktrace_index;
(function () {
	var exports = {};
	var module = { exports: exports };
	var File,
	atma = global;
if (atma.io && atma.io.File) 
	File = atma.io.File;

if (File == null) {
	atma = global.atma;
	if (atma && atma.io) 
		File = atma.io.File;
}
if (File == null) 
	File = require('atma-io').File;

/* { handleUncaughtExceptions } */
module.exports = function(options){
	var SourceMap = require('source-map-support');
	var config = {
		retrieveSourceMap: function(path){
			if (io.File.exists(path + '.map')){
				var map = io.File.read(path + '.map');
				if (!map) 
					return null;
				try {
					map = JSON.parse(map);
				} catch(error){
					console.error('Invalid SourceMap Json', path + '.map');
					return null;
				}
				// path should be already absolute, no `root` is required
				//- path = path.replace(/\\/g, '/');
				//- map.sourceRoot = path.substring(0, path.lastIndexOf('/'));
				return {
					map: map
				}
			}
			return null;
		}
	};
	for (var key in options){
		config[key] = options[key];
	}
	SourceMap.install(config);
};;

	function isObject(x) {
		return x != null && typeof x === 'object' && x.constructor === Object;
	}
	if (isObject(_node_modules_atma_loader_stacktrace_index) && isObject(module.exports)) {
		Object.assign(_node_modules_atma_loader_stacktrace_index, module.exports);
		return;
	}
	_node_modules_atma_loader_stacktrace_index = module.exports;
}());
// end:source ./ModuleSimplified.js

"use strict";
var Base = require("atma-io-middleware-base");
var compiler_1 = _src_compiler;
// stacktraces
_node_modules_atma_loader_stacktrace_index();
module.exports = Base.create({
    name: 'atma-loader-ts',
    textOnly: true,
    cacheable: true,
    defaultOptions: {
        mimeType: 'text/javascript',
        sourceMap: true,
        extensions: ['ts'],
        typescript: {}
    },
    process: compiler_1.default
});


}());
// end:source ./RootModule.js
