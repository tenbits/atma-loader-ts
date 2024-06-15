import * as Base from 'atma-io-middleware-base'
import process from './compiler'
import { createVirtualFile } from './TypeDefinitionFile';


export = Base.create({
    name: 'atma-loader-ts',
    textOnly: true,
    cacheable: true,
    defaultOptions: {
        dtsOnly: false,
        mimeType: 'text/javascript',
        sourceMap: true,
        extensions: [ 'ts' ],
        typescript: {

        }
    },
    onMount (io) {
        if (io?.File != null) {
            io.File.getFactory().registerHandler(
                /\.d\.ts$/
                , createVirtualFile(io.File)
            );
        }
    },
    process
});


// stacktraces
require('atma-loader-stacktrace')();
