module.exports = {
    suites: {
        dom: {
            exec: 'dom',
            tests: 'test/dom.spec.ts',
            $config: {
                '$before': function(done){
                    UTest
                        .configurate({
                            'http.eval': function(done){
                                include
                                    .js('/index.js::BabelPlugin')
                                    .done(function(resp){
                                        var app = atma.server.app;
                                        resp.BabelPlugin.attach(app);
                                        done();
                                    });
                            }
                        }, done);

                }
            }
        },
        node: {
            exec: 'node',
            tests: 'test/node.spec.ts'
        }
    }
}
