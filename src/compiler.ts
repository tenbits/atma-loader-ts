import { Compiler, io } from 'atma-io-middleware-base'
import * as ts from 'typescript'
import * as utils from 'atma-utils'


export default function process (source: string, file, compiler: Compiler) {

    let uri = file.uri,
        filename = uri.toLocalFile();

    let options = {
        ...(<any> compiler.getOption('typescript') || {}),
        fileName: filename,
    };
    if (options.compilerOptions) {
        _defaults(options.compilerOptions, {
            sourceMap: true
        });
    }

    let compiled = _compile(source, options);
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
function _compile(source, options) {
    if (options.transformers != null) {
        _tryLoadTransformers(options.transformers.before);
        _tryLoadTransformers(options.transformers.after);
    }

    try {
        let compiled =  ts.transpileModule(source, options);
        let sourceMap = compiled.sourceMapText;
        if (sourceMap != null && typeof sourceMap !== 'string') {
            sourceMap = JSON.stringify(sourceMap, null, 4);
        }
        return {
            js: compiled.outputText,
            sourceMap: sourceMap,
            errors:null
        };
    } catch (error) {
        throw new Error(error.message + '\n' + error.codeFrame);
    }
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
