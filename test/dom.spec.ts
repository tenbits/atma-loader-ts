UTest({
    'include': function(done){
        include
            .js('/test/foo.ts')
            .done(function(resp){

                eq(resp.foo('Baz'), 'Hello, Baz');
                done();
            });
    }
});
