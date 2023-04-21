
// source ./RootModuleWrapped.js
(function(){

    var _node_modules_atma_loader_stacktrace_index = {};
var _src_compiler = {};

// source ./ModuleSimplified.js
var _src_compiler;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
    var exports = _src_compiler != null ? _src_compiler : {};
    var module = { exports: exports };

    "use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
function process(source, file, compiler) {
    var uri = file.uri;
    var filename = uri.toLocalFile();
    var options = __assign(__assign({}, (compiler.getOption('typescript') || {})), { fileName: filename });
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
    if (target == null) {
        return source;
    }
    for (var key in source) {
        if (key in target === false) {
            target[key] = source[key];
        }
    }
    return target;
}
function _compile(source, options) {
    var _a;
    if (options.transformers != null) {
        _tryLoadTransformers(options.transformers.before);
        _tryLoadTransformers(options.transformers.after);
    }
    if (/amd/i.test((_a = options.compilerOptions) === null || _a === void 0 ? void 0 : _a.module)) {
        if (options.transformers == null) {
            options.transformers = {};
        }
        if (options.transformers.after == null) {
            options.transformers.after = [];
        }
        options.transformers.after.push(TopLevelAsyncTransformerForAMD);
    }
    try {
        var compiled = ts.transpileModule(source, options);
        var sourceMap = compiled.sourceMapText;
        if (sourceMap != null && typeof sourceMap !== 'string') {
            sourceMap = JSON.stringify(sourceMap, null, 4);
        }
        return {
            js: compiled.outputText,
            sourceMap: sourceMap,
            errors: [],
        };
    }
    catch (error) {
        throw new Error(error.message + '\n' + error.codeFrame);
    }
}
function _tryLoadTransformers(arr) {
    if (arr == null) {
        return;
    }
    for (var i = 0; i < arr.length; i++) {
        if (typeof arr[i] === 'string') {
            arr[i] = require(arr[i]);
        }
    }
}
var TopLevelAsyncTransformerForAMD = function (ctx) {
    return function (root) {
        var options = ctx.getCompilerOptions();
        if (options.module !== ts.ModuleKind.AMD) {
            return root;
        }
        var amdFactoryFn = getAmdFactoryFn(root);
        if (amdFactoryFn == null || hasTopLevelAwait(amdFactoryFn) === false) {
            return root;
        }
        var modifier = ctx.factory.createModifier(ts.SyntaxKind.AsyncKeyword);
        var asyncFactoryFn = ctx.factory.updateFunctionExpression(amdFactoryFn, [modifier], amdFactoryFn.asteriskToken, amdFactoryFn.name, amdFactoryFn.typeParameters, amdFactoryFn.parameters, amdFactoryFn.type, amdFactoryFn.body);
        root = replaceNode(root, amdFactoryFn, asyncFactoryFn);
        return root;
        function getAmdFactoryFn(node) {
            var defineNode = node
                .statements
                .filter(ts.isExpressionStatement)
                .map(function (node) { return node.expression; })
                .filter(function (node) { return ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.escapedText === 'define'; })[0];
            if (defineNode == null) {
                return null;
            }
            var factoryFn = defineNode.arguments[defineNode.arguments.length - 1];
            if (ts.isFunctionExpression(factoryFn) === false) {
                return null;
            }
            return factoryFn;
        }
        function hasTopLevelAwait(fn) {
            var hasAwait = false;
            var root = fn.body;
            function visitor(node) {
                if (ts.isAwaitExpression(node)) {
                    hasAwait = true;
                    return node;
                }
                if (root !== node && ts.isBlock(node)) {
                    return node;
                }
                return ts.visitEachChild(node, visitor, ctx);
            }
            visitor(fn.body);
            return hasAwait;
        }
        function replaceNode(root, a, b) {
            function visitor(node) {
                if (node === a) {
                    return b;
                }
                return ts.visitEachChild(node, visitor, ctx);
            }
            return visitor(root);
        }
    };
};
;

    function __isObj(x) {
        return x != null && typeof x === 'object' && x.constructor === Object;
    }
    if (_src_compiler === module.exports) {
        // do nothing if
    } else if (__isObj(_src_compiler) && __isObj(module.exports)) {
        Object.assign(_src_compiler, module.exports);
    } else {
        _src_compiler = module.exports;
    }

    ;
}());

// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _node_modules_atma_loader_stacktrace_index;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
    var exports = _node_modules_atma_loader_stacktrace_index != null ? _node_modules_atma_loader_stacktrace_index : {};
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

    function __isObj(x) {
        return x != null && typeof x === 'object' && x.constructor === Object;
    }
    if (_node_modules_atma_loader_stacktrace_index === module.exports) {
        // do nothing if
    } else if (__isObj(_node_modules_atma_loader_stacktrace_index) && __isObj(module.exports)) {
        Object.assign(_node_modules_atma_loader_stacktrace_index, module.exports);
    } else {
        _node_modules_atma_loader_stacktrace_index = module.exports;
    }

    ;
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

// end:source ./RootModuleWrapped.js
