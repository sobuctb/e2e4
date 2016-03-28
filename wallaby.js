var wallabyWebpack = require('wallaby-webpack');
var webpackPostprocessor = wallabyWebpack({});

module.exports = function (wallaby) {
    return {
        files: [
            { pattern: 'node_modules/core-js/client/core.js', instrument: false, load: true},
            { pattern: 'src/**/*.ts', load: false },
            { pattern: 'src/**/*.d.ts', ignore: true }
        ],

        tests: [
            { pattern: 'tests/**/*.ts', load: false }
        ],

        postprocessor: webpackPostprocessor,
        env: {
            type: 'browser',
            runner: require('phantomjs-prebuilt').path,
            params: {
                runner: '--web-security=false'
            }
        },

        testFramework: 'mocha@2.2.4',

        bootstrap: function () {
            window.__moduleBundler.loadTests();
        },
        debug: true
    };
};