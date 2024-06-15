const Middleware = require('../index.js');


const FILE = '/test/foo.ts';
const FILE_SYNTAX = '/test/foo-errored.ts';

UTest({

    'include': function(done){
        include
            .cfg('amd', true)
            .cfg('es6Exports', true);

        include
            .js(FILE)
            .done(function(resp){

                eq_(resp.foo.Greeter('Foo'), 'Hello, Foo');
                done();
            });
    },

    'io.File.read': function(){

        var content = io.File.read(FILE);
        has_(content, 'function Greeter');
    },
    async 'io.File.readAsync' (){
        const content = await io.File.readAsync<string>(FILE);
        // should be transpiled to AMD
        has_(content, ' function (require, exports)');
    },

    'io.File.read SourceMap': function(){
        var content = io.File.read(FILE + '.map');
        is_(content, 'String');
        content = JSON.parse(content);
        has_(content, 'mappings');
    },
    async 'io.File.readAsync SourceMap' () {
        let content = await io
            .File
            .readAsync(FILE + '.map')

        content = JSON.parse(content);
        has_(content, 'mappings');
    },
    async 'io.File.readAsync Definitions' () {
        let content = await io
            .File
            .readAsync(FILE.replace('.ts', '.d.ts'));

        console.log(content)
        has_(content, 'export declare function Greeter');
    },

    '//should handle errors' (done) {
        io
            .File
            .readAsync(FILE_SYNTAX)
            .done(assert.avoid())
            .fail(error => {
                logger.log(error)
            })
            .always(done);
    }
});
