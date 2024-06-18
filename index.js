
// source ./RootModuleWrapped.js
(function(){

    var _node_modules_atma_loader_stacktrace_index = {};
var _src_TypeDefinitionFile = {};
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
    var outputType = 'ts';
    if (/\.ts\.map$/.test(filename)) {
        outputType = 'map';
    }
    else if (/\.d\.ts$/.test(filename)) {
        outputType = 'd.ts';
    }
    if (outputType === 'ts' && compiler.getOption('dtsOnly') === true) {
        outputType = 'd.ts';
    }
    var options = __assign(__assign({}, (compiler.getOption('typescript') || {})), { fileName: filename });
    if (options.compilerOptions) {
        _defaults(options.compilerOptions, {
            sourceMap: true
        });
    }
    var compiled = _compile(source, options, outputType);
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
    if (outputType === 'map') {
        return {
            content: compiled.sourceMap,
            sourceMap: null,
        };
    }
    if (outputType === 'd.ts') {
        return {
            content: compiled.definition,
            sourceMap: null,
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
function _compile(source, options, outputType) {
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
    if (outputType === 'd.ts') {
        var definitions = _compileDefinition(source, options);
        return {
            definition: definitions,
            js: null,
            sourceMap: null,
            errors: [],
        };
    }
    try {
        if (outputType === 'map') {
            options.compilerOptions.sourceMap = true;
        }
        var compiled = ts.transpileModule(source, options);
        var sourceMap = compiled.sourceMapText;
        if (sourceMap != null && typeof sourceMap !== 'string') {
            sourceMap = JSON.stringify(sourceMap, null, 4);
        }
        return {
            definitions: null,
            js: compiled.outputText,
            sourceMap: sourceMap,
            errors: [],
        };
    }
    catch (error) {
        throw new Error(error.message + '\n' + error.codeFrame);
    }
}
function _compileDefinition(source, options) {
    var compilerOptions = __assign(__assign({}, options.compilerOptions), { declaration: true, emitDeclarationOnly: true });
    var hostOptions = __assign(__assign({}, options), { compilerOptions: compilerOptions, reportFiles: [options.fileName] });
    var host = ts.createCompilerHost(hostOptions);
    var files = {};
    host.writeFile = function (fileName, contents) {
        files[fileName] = contents;
    };
    host.readFile = function () { return source; };
    var filenameMatch = /(?<filename>[^/.]+)\.[\w\.]+$/.exec(options.fileName);
    if (filenameMatch == null) {
        throw new Error("Could not extract filename from \"".concat(options.fileName, "\""));
    }
    var filename = filenameMatch === null || filenameMatch === void 0 ? void 0 : filenameMatch.groups.filename;
    var program = ts.createProgram([filename], compilerOptions, host);
    program.emit();
    return files[filename + '.d.ts'];
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
var _src_TypeDefinitionFile;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
    var exports = _src_TypeDefinitionFile != null ? _src_TypeDefinitionFile : {};
    var module = { exports: exports };

    "use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.createVirtualFile = void 0;
function createVirtualFile(File) {
    return /** @class */ (function (_super) {
        __extends(TypeDefinitionFile, _super);
        function TypeDefinitionFile() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TypeDefinitionFile.prototype.read = function (opts) {
            if (this.exists('mapOnly'))
                return _super.prototype.read.call(this, opts);
            var path = this.getSourcePath();
            if (path == null)
                return null;
            var file = new File(path);
            file.read(__assign(__assign({}, (opts !== null && opts !== void 0 ? opts : {})), { foo: {
                    bar: 1
                } }));
            return (this.content = file.sourceMap);
        };
        TypeDefinitionFile.prototype.readAsync = function (opts) {
            var _this = this;
            if (this.exists('mapOnly'))
                return _super.prototype.readAsync.call(this, opts);
            var path = this.getSourcePath();
            if (path == null) {
                return Promise.reject({
                    code: 404,
                    filename: this.uri.toLocalFile(),
                    message: 'Path equals original'
                });
            }
            var file = new File(path, {
                cached: false,
                'atma-loader-ts': {
                    dtsOnly: true,
                }
            });
            var prom = file.readAsync(__assign(__assign({}, (opts !== null && opts !== void 0 ? opts : {})), { cached: false }));
            return prom.then(function () {
                return (_this.content = file.content);
            });
        };
        TypeDefinitionFile.prototype.exists = function (check) {
            if (_super.prototype.exists.call(this))
                return true;
            if (check === 'mapOnly')
                return false;
            var path = this.getSourcePath();
            return path != null
                ? File.exists(path)
                : false;
        };
        TypeDefinitionFile.prototype.getSourcePath = function () {
            var path = this.uri.toString(), source = path.replace(/\.d\.ts$/i, '.ts');
            return path === source
                ? null
                : source;
        };
        return TypeDefinitionFile;
    }(File));
}
exports.createVirtualFile = createVirtualFile;
;

    function __isObj(x) {
        return x != null && typeof x === 'object' && x.constructor === Object;
    }
    if (_src_TypeDefinitionFile === module.exports) {
        // do nothing if
    } else if (__isObj(_src_TypeDefinitionFile) && __isObj(module.exports)) {
        Object.assign(_src_TypeDefinitionFile, module.exports);
    } else {
        _src_TypeDefinitionFile = module.exports;
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
var TypeDefinitionFile_1 = _src_TypeDefinitionFile;
// stacktraces
_node_modules_atma_loader_stacktrace_index();
module.exports = Base.create({
    name: 'atma-loader-ts',
    textOnly: true,
    cacheable: true,
    defaultOptions: {
        dtsOnly: false,
        mimeType: 'text/javascript',
        sourceMap: true,
        extensions: ['ts'],
        typescript: {}
    },
    onMount: function (io) {
        if ((io === null || io === void 0 ? void 0 : io.File) != null) {
            io.File.getFactory().registerHandler(/\.d\.ts$/, (0, TypeDefinitionFile_1.createVirtualFile)(io.File));
        }
    },
    process: compiler_1.default
});


}());

// end:source ./RootModuleWrapped.js
