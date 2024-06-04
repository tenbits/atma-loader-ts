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
                                    .js('/index.js::TsPlugin')
                                    .done(function(resp){
                                        var app = atma.server.app;
                                        resp.TsPlugin.attach(app);
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
