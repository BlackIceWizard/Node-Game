var testsModules = [];
var modulesMetadata = {};
var module_in_process = null;
var test_in_process = null;
var current_action = null;

var actions = {
    'initializing' : 1,
    'collect_data' : 2,
    'run_test' : 3
};

exports.execute = function () {
    collectTestsModules();
    extractModulesMetadata();
    testing();
    //console.log( testsModules );
};

function collectTestsModules( path ) {

    if( typeof path == 'undefined' )
        path = __dirname+'/../tests';

    var files = discoverPath( path, true, false, true );
    var folders = discoverPath( path, false, true, true );

    if( files.length ) {
        for( var i =0; i < files.length; i++ )
            testsModules.push( files[i] );
    }

    if( folders.length ) {
        for( var i =0; i < folders.length; i++ )
            collectTestsModules( folders[i] );
    }
}

function extractModulesMetadata() {
    for( var i = 0; i < testsModules.length; i++ ) {

        var testModuleFile = testsModules[i];

        modulesMetadata[testModuleFile] = takeTestModuleMetadata( testModuleFile );
    }
}

function testing() {
    var previous_module_in_process = module_in_process;

    module_in_process = null;
    test_in_process = null;

    for( var fileName in modulesMetadata ) {
        var moduleMetadata = modulesMetadata[fileName];

        if( moduleMetadata.initializing_error )
            continue;

        if( !moduleMetadata.initialized ) {
            current_action = actions.initializing;
            moduleMetadata.initialized = true;

            require( fileName ).init( testing );
            return;
        }


        for( var testName in moduleMetadata.tests ) {
            var testMetadata = moduleMetadata.tests[testName];

            if( testMetadata.executed || ( testMetadata.depend !== null && !moduleMetadata.tests[testMetadata.depend].executed ) )
                continue;

            module_in_process = fileName;
            test_in_process = testName;

            break;
        }
        if( module_in_process !== null && test_in_process !== null ) {

            if( previous_module_in_process != module_in_process  )
                console.log( 'Module: '+module_in_process );

            processTest();
            break;
        }
    }
}

function processTest() {
    var module = require( module_in_process );
    var moduleMetadata = modulesMetadata[module_in_process];
    var test = moduleMetadata.tests[test_in_process];

    test.executed = true;

    if( test.dataProvider ) {
        current_action = actions.collect_data;
        module[test.dataProvider]( function ( data ) {

            var argset_i = 0;

            var testIterator = function () {

                if( argset_i >= data.length ) {
                    afterProcessing();
                    return;
                }

                var args = data[ argset_i ];

                function_arg_len = module[test_in_process].length;

                if( args.length > function_arg_len - 1  ) {
                    args = args.splice( 0, function_arg_len - 1 );
                } else if( args.length < function_arg_len - 1 ) {

                    while( args.length != function_arg_len - 1 )
                        args.push( null );
                }

                args.push( testIterator );

                current_action = actions.run_test;

                argset_i++;

                module[test_in_process].apply( {}, args );
            };
            testIterator();
        } );
    } else {
        current_action = actions.run_test;
        module[test_in_process]( afterProcessing );
    }
}

function afterProcessing() {
    console.log( '-- Test: ' + test_in_process + ' \x1b[32mGreen\x1b[0m' );
    testing();
}

process.on( 'uncaughtException', afterError );

function afterError( err ) {
    if( current_action == actions.initializing ) {
        console.log( '-- \x1b[31mInitializing Error\x1b[0m' + err.message );
        modulesMetadata[module_in_process].initializing_error = true;
    } else if( current_action == actions.collect_data ) {
        console.log( '-- Test: ' + test_in_process + ' \x1b[31mCollect Data Error\x1b[0m' );
        console.log( '-- Error message: ' + err.message );
    } else {
        console.log( '-- Test: ' + test_in_process + ' \x1b[31mError\x1b[0m' );
        console.log( '-- Error message: ' + err.message );
    }

    testing();
}

function takeTestModuleMetadata( file ) {
    var module = require( file );

    var tests = {};
    var dataProviders = [];
    var testAmount = 0;

    for( var i in module ) {
        if( typeof module[i] != 'function' )
            continue;

        if( i.indexOf( 'test' ) === 0 ) {
            tests[i] = { 'depend' : null,
                         'dataProvider' : null,
                         'executed' : false };
            testAmount++;
        }

        if( i.indexOf( 'provider' ) === 0 ) {
            dataProviders.push( i );
        }
    }

    if( typeof module.testParams != 'undefined' ) {
        for( var test in module.testParams  ) {

            if( typeof tests[test] == 'undefined' )
                    throw new Error('UnitTest: test "'+test+'", which specified in test params, not found in test module "'+file+'"');

            if( typeof module.testParams[test].dependOn != 'undefined' ) {
                var depend_test = module.testParams[test].dependOn;

                if( typeof tests[depend_test] == 'undefined' )
                    throw new Error('UnitTest: depend test "'+depend_test+'" not found in test module "'+file+'"');

                tests[test].depend = depend_test;
            }

            if( typeof module.testParams[test].provider != 'undefined' ) {
                var provider = module.testParams[test].provider;

                if( dataProviders.indexOf(provider ) == -1 )
                    throw new Error('UnitTest: data provider "'+provider+'" not found in test module "'+file+'"');

                tests[test].dataProvider = provider;
            }
        }
    }

    var initialized = true;
    if( typeof module['init'] == 'function' )
        initialized = false;

    return { 'file' : file,
             'tests' : tests,
             'testAmount' : testAmount,
             'initialized' : initialized,
             'initializing_error' : false };
}

function discoverPath( path, files, folders, absolutePath ) {
    if( typeof absolutePath == 'undefined' )
        absolutePath = false;

    if( typeof files == 'undefined' )
        files = true;

    if( typeof folders == 'undefined' )
        folders = true;

    var fs   = require( 'fs' );

    path = require('path').normalize( path );


    var result = [];

    var FileList = [];

    try {
        FileList = fs.readdirSync( path );
    } catch (err) {
        throw new Error('UnitTesting: PATH "'+path+'" not found' );
    }

    for( var i = 0; i < FileList.length; i++ ) {
        var stats = fs.statSync( path + '/' + FileList[i] );

        if( stats.isFile() && ( !files || FileList[i].substr( -3 ) != '.js') )
            continue;

        if( stats.isDirectory() && !folders )
            continue;

        if( absolutePath )
            result.push( path + '/' + FileList[i] );
        else
            result.push( FileList[i] );

    }

    return result;
}
