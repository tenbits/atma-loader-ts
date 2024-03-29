require('..');

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

                eq_(resp.foo('Foo'), 'Hello, Foo');
                done();
            });
    },

    'io.File.read': function(){

        var content = io.File.read(FILE);
        has_(content, 'function Greeter');
    },
    'io.File.readAsync': function(){

        return io
            .File
            .readAsync(FILE)
            .done(function(content){
                has_(content, 'function');
            });
    },

    'io.File.read SourceMap': function(){
        var content = io.File.read(FILE + '.map');
        is_(content, 'String');
        content = JSON.parse(content);
        has_(content, 'mappings');
    },
    'io.File.readAsync SourceMap': function(){
        return io
            .File
            .readAsync(FILE + '.map')
            .done(function(content){
                content = JSON.parse(content);
                has_(content, 'mappings');
            });
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
