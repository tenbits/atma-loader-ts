UTest({
    'include' (done) {
        include
            .js('/test/foo.ts')
            .done(function(resp){

                eq_(typeof resp.foo.Greeter, 'function');
                eq_(resp.foo.Greeter('Baz'), 'Hello, Baz');
                done();
            });
    }
});
