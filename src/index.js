(function(){
	"use strict";

	var Loader;
	(function(module){
		//import /node_modules/atma-loader/index.js
	}(Loader = {}));
	
	if (Loader.exports == null) {
		return;
	}
	
	var Compiler;
	(function(module){
		// import compiler.js
	}(Compiler = {}));

	if (Compiler.exports == null) {
		return;
	}
	
	(function(module){
		
		module.exports = Loader.exports.create({
			name: 'atma-loader-ts',
			options: {
				mimeType: 'text/javascript',
				extensions: [ 'ts' ]
			},
		}, Compiler.exports)
		
	}(typeof include !== 'undefined' ? include : module));
	
	// stacktraces
	require('atma-loader-stacktrace')();
}());