//var fs = require('fs');
//var path = require('path');
//var spawn = require('child_process').spawn;
var assert = require('assert');
var CLIEngine = require('eslint').CLIEngine;

module.exports = {
  name: 'eslint-runner',

  preBuild: function(result) {
    console.log('NSK -> preBuild');
    assert(CLIEngine);

    console.log('Running eslint against the following dir: ');

    var cli = new CLIEngine({
      configFile: '.eslintrc.js'
    });

    var report = cli.executeOnFiles(['app']);
    console.log('Errors occurred during linting -> ', report.errorCount);

    if(report.errorCount !== 0) {
      console.log('eslint did not pass, hard failing');
      throw 'Dude, your eslint broke stuff';
    } else {
      console.log('eslint passed! Continuing with ember build...');
    }
  }
  //outputReady: function(result) {
    //const BUILT_CSS_FILES = [
        //'./dist/assets/fusor-ember-cli.css',
        //'./dist/assets/fusor-ember-cli.css.map'
      //],
      //CSS_DESTINATION_DIR = '../ui/app/assets/stylesheets/fusor_ui/',
      //BUILT_JS_FILES = ['./dist/assets/vendor.js',
        //'./dist/assets/vendor.map',
        //'./dist/assets/fusor-ember-cli.js',
        //'./dist/assets/fusor-ember-cli.map'
      //],
      //JS_DESTINATION_DIR = '../ui/app/assets/javascripts/fusor_ui/';

    //BUILT_CSS_FILES.forEach(function (src) {
      //var dst = path.join(CSS_DESTINATION_DIR, path.basename(src));
      //spawn('cp', [src, dst]);
    //});

    //BUILT_JS_FILES.forEach(function (src) {
      //var dst = path.join(JS_DESTINATION_DIR, path.basename(src));
      //spawn('cp', [src, dst]);
    //});
  //}
};
