import { Compiler, io } from 'atma-io-middleware-base'
import * as ts from 'typescript'
import type { File } from 'atma-io'
import { compileFunction } from 'vm';


type TPluginOptions = ts.TranspileOptions & {
    sourceMaps?: boolean
    fileName: string
    compilerOptions: ts.CompilerOptions
};

type TOutputType = 'ts' | 'map' | 'd.ts';

export default function process (source: string, file: InstanceType<typeof File>, compiler: Compiler) {

    let uri = file.uri;
    let filename = uri.toLocalFile();
    let outputType = 'ts' as TOutputType;
    if (/.ts.map$/.test(filename)) {
        outputType = 'map';
    } else if (/.d.ts$/.test(filename)) {
        outputType = 'd.ts';
    }

    let options = <TPluginOptions> {
        ...(<any> compiler.getOption('typescript') || {}),
        fileName: filename,
    };
    if (options.compilerOptions) {
        _defaults(options.compilerOptions, {
            sourceMap: true
        });
    }

    let compiled = _compile(source, options, outputType);
    let errors = compiled.errors == null || compiled.errors.length === 0
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
    let { js, sourceMap } = compiled;
    if (sourceMap) {
        js += '\n//# sourceMappingURL=' + uri.file + '.map';
    }
    return {
        content: js,
        sourceMap: sourceMap
    };
}


function _defaults(target, source){
    if (target == null) {
        return source;
    }
    for (let key in source){
        if (key in target === false) {
            target[key] = source[key];
        }
    }
    return target;
}
function _compile(source: string, options: TPluginOptions, outputType: TOutputType) {
    if (options.transformers != null) {
        _tryLoadTransformers(options.transformers.before);
        _tryLoadTransformers(options.transformers.after);
    }
    if (/amd/i.test(options.compilerOptions?.module as any as string)) {
        if (options.transformers == null) {
            options.transformers = {};
        }
        if (options.transformers.after == null) {
            options.transformers.after = [];
        }
        options.transformers.after.push(TopLevelAsyncTransformerForAMD);
    }

    if (outputType === 'd.ts') {
        let definitions = _compileDefinition(source, options);
        return {
            definition: definitions,
            js: null,
            sourceMap: null,
            errors: [],
        }
    }

    try {
        if (outputType === 'map') {
            options.compilerOptions.sourceMap = true;
        }

        let compiled =  ts.transpileModule(source, options);
        let sourceMap = compiled.sourceMapText;
        if (sourceMap != null && typeof sourceMap !== 'string') {
            sourceMap = JSON.stringify(sourceMap, null, 4);
        }
        return {
            definitions: null,
            js: compiled.outputText,
            sourceMap: sourceMap,
            errors: [],
        };
    } catch (error) {
        throw new Error(error.message + '\n' + error.codeFrame);
    }
}

function _compileDefinition (source: string, options: TPluginOptions) {
    let compilerOptions = {
        ...options.compilerOptions,
        declaration: true,
        emitDeclarationOnly: true,
    }
    let hostOptions = <ts.TranspileOptions> {
        ...options,
        compilerOptions,
        reportFiles: [options.fileName],
    };
    const host = ts.createCompilerHost(hostOptions);
    const files = {};
    host.writeFile = (fileName, contents) => {
        files[fileName] = contents;
    };
    host.readFile = () => source;

    const filenameMatch = /(?<filename>[^/.]+)\.[\w\.]+$/.exec(options.fileName);
    if (filenameMatch == null) {
        throw new Error(`Could not extract filename from "${ options.fileName}"`);
    }
    const filename = filenameMatch?.groups.filename;
    const program = ts.createProgram([filename], compilerOptions, host);

    program.emit();

    return files[filename + '.d.ts'];
}

function _tryLoadTransformers (arr) {
    if (arr == null) {
        return;
    }
    for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] === 'string') {
            arr[i] = require(arr[i]);
        }
    }
}


const TopLevelAsyncTransformerForAMD = (ctx: ts.TransformationContext) => {
    return (root: ts.SourceFile) => {
        let options = ctx.getCompilerOptions();
        if (options.module !== ts.ModuleKind.AMD) {
            return root;
        }
        let amdFactoryFn = getAmdFactoryFn(root);
        if (amdFactoryFn == null || hasTopLevelAwait(amdFactoryFn) === false) {
            return root;
        }
        let modifier = ctx.factory.createModifier(ts.SyntaxKind.AsyncKeyword)
        let asyncFactoryFn = ctx.factory.updateFunctionExpression(amdFactoryFn
            , [ modifier ]
            , amdFactoryFn.asteriskToken
            , amdFactoryFn.name
            , amdFactoryFn.typeParameters
            , amdFactoryFn.parameters
            , amdFactoryFn.type
            , amdFactoryFn.body
        );

        root = replaceNode(root, amdFactoryFn, asyncFactoryFn);
        return root;

        function getAmdFactoryFn (node: ts.SourceFile): ts.FunctionExpression | null {
            let defineNode = node
                .statements
                .filter(ts.isExpressionStatement)
                .map((node: ts.ExpressionStatement) => node.expression)
                .filter(node => ts.isCallExpression(node) &&  ts.isIdentifier(node.expression) && (node.expression as ts.Identifier).escapedText === 'define')
                [0] as ts.CallExpression;

            if (defineNode == null) {
                return null;
            }
            let factoryFn = defineNode.arguments[defineNode.arguments.length - 1] as ts.FunctionExpression;
            if (ts.isFunctionExpression(factoryFn) === false) {
                return null;
            }
            return factoryFn;
        }
        function hasTopLevelAwait(fn: ts.FunctionExpression) {
            let hasAwait = false;
            let root = fn.body;
            function visitor (node) {
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
        function replaceNode(root: ts.SourceFile, a, b) {
            function visitor (node) {
                if (node === a) {
                    return b;
                }
                return ts.visitEachChild(node, visitor, ctx);
            }
            return visitor(root);
        }
    };
}
