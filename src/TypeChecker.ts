import * as ts from 'typescript'
import { env, File, Directory } from 'atma-io'
import memd from 'memd';

export class TypeChecker {
    constructor() {
    }

    getTypeDiagnostics (source: string, options ) {
        options.compiler
    }
}

class Host implements ts.CompilerHost {

    constructor(configJson) {
        let base = env.currentDir.toLocalString();
        let { options: compilerOptions, errors } = ts.convertCompilerOptionsFromJson(configJson.compilerOptions, base);
        if (errors.length > 0) {
            let str = JSON.stringify(errors);
            throw new Error(str);
        }

        this.host = ts.createCompilerHost(compilerOptions, true);
    }

    @memd.deco.memoize()
    fileExists (filePath: string) {
        return File.exists('file://' + filePath);
    }

    @memd.deco.memoize()
    directoryExists (dirPath) {
        return Directory.exists('file://' + dirPath + '/');
    }

    @memd.deco.memoize()
    getCurrentDirectory () {
        return env.currentDir.toLocalString();
    }
    getDirectories (...args) {
        console.log(`getCurrentDirectory`, ...args);
        return realHost.getDirectories(...args)
    }

    getCanonicalFileName (fileName) {
        //console.log(`getCanonicalFileName`, arguments);
        return realHost.getCanonicalFileName(fileName);
    }
    getNewLine (...args) {
        console.log(`getNewLine`, arguments);
        return realHost.getNewLine(...args)
    }
    getDefaultLibFileName (...args) {
        console.log(`getDefaultLibFileName`, arguments);
        return realHost.getDefaultLibFileName(...args);
    }
    getSourceFile (fileName, languageVersion, onError, shouldCreateNewSourceFile)  {
        console.log(`getSourceFile`, arguments);
        return fileName === path
            ? sourceFile
            : realHost.getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile);
    }
    readFile (filePath ) {
        console.log(`readFile`, arguments);
        return filePath === path
        ? code
        : realHost.readFile(filePath);
    }
    useCaseSensitiveFileNames () {
        console.log(`useCaseSensitiveFileNames`, arguments);
        return realHost.useCaseSensitiveFileNames()
    }
    writeFile: (fileName, data) => {
        console.log(`writeFile`, arguments);
        outputCode = data;
    }
}

namespace Utils {
    export function () {
        const realHost = ts.createCompilerHost(options, true);
    console.log('options', realHost);
    options = ts.convertCompilerOptionsFromJson(options.compilerOptions);


    const sourceFile = ts.createSourceFile(path, code, ts.ScriptTarget.Latest);
    let outputCode = undefined;

    const host= {
        fileExists (filePath) {
            console.log(`fileExists`, arguments);
            return io.File.exists('file://' + filePath);
        },
        directoryExists (dirPath) {
            console.log(`directoryExists`, arguments);
            return io.Directory.exists('file://' + dirPath + '/');
        },
        getCurrentDirectory (...args) {
            console.log(`getCurrentDirectory`, ...args);
            return realHost.getCurrentDirectory(...args)
        },
        getDirectories (...args) {
            console.log(`getCurrentDirectory`, ...args);
            return realHost.getDirectories(...args)
        },

        getCanonicalFileName (fileName) {
            //console.log(`getCanonicalFileName`, arguments);
            return realHost.getCanonicalFileName(fileName);
        },
        getNewLine (...args) {
            console.log(`getNewLine`, arguments);
            return realHost.getNewLine(...args)
        },
        getDefaultLibFileName (...args) {
            console.log(`getDefaultLibFileName`, arguments);
            return realHost.getDefaultLibFileName(...args);
        },
        getSourceFile (fileName, languageVersion, onError, shouldCreateNewSourceFile)  {
            console.log(`getSourceFile`, arguments);
            return fileName === path
                ? sourceFile
                : realHost.getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile);
        },
        readFile (filePath ) {
            console.log(`readFile`, arguments);
            return filePath === path
            ? code
            : realHost.readFile(filePath);
        },
        useCaseSensitiveFileNames () {
            console.log(`useCaseSensitiveFileNames`, arguments);
            return realHost.useCaseSensitiveFileNames()
        },
        writeFile: (fileName, data) => {
            console.log(`writeFile`, arguments);
            outputCode = data;
        },
    };

    //const rootNames = libs.map(lib => require.resolve(`typescript/lib/lib.${lib}.d.ts`));
    const rootNames = [];
    const program = ts.createProgram(rootNames.concat([path]), options, host);
    const emitResult = program.emit();
    const diagnostics = ts.getPreEmitDiagnostics(program);
    console.log(`diagnostics`, diagnostics.length, diagnostics.map(x => [x.file.path, x.messageText]));
    return {
        code: outputCode,
        diagnostics: emitResult.diagnostics.concat(diagnostics)
    };
    }
}
