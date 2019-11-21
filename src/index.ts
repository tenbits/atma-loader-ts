import * as Base from 'atma-io-middleware-base'
import process from './compiler'


export = Base.create({
	name: 'atma-loader-ts',
    textOnly: true,
    cacheable: true,
    defaultOptions: {
        mimeType: 'text/javascript',
        sourceMap: true,
        extensions: [ 'ts' ],
        typescript: {

        }
    },
    process
});


// stacktraces
require('atma-loader-stacktrace')();