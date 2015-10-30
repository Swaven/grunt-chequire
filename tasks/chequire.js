/*
 * grunt-chequire
 * https://github.com/Swaven/grunt-chequire
 *
 * Copyright (c) 2015 Swaven
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt){

  grunt.registerMultiTask('chequire', 'Ensures require directives point to existing files (case-sensitively).', function() {

    var path = require('path'),
    fs = require('fs'),
    EventEmitter = require('events').EventEmitter,
    done = this.async(),
    initialCwd = process.cwd(),
    wait = new EventEmitter(),
    rx = /require\(?\s*['"](\..+?)['"]\)?/g, // regex to detect require directives
    pathList = [], // list of paths extracted from require directives
    sourceList = [], // mapping to find which source file contains a problematic require
    res = null;


    wait.on('setup', function(total){
      wait.totalRequires = total;
      wait.fileCounter = 0;
      grunt.verbose.writeln("require paths found: " + wait.totalRequires);
    });

    wait.on('fileDone', function(file){
      grunt.verbose.writeln("exists: " + file);
      wait.fileCounter += 1;
      if (wait.fileCounter === wait.totalRequires){
        grunt.log.writeln('All requires OK');
        // reset cws to initial value
        process.chdir(initialCwd);
        grunt.verbose.writeln('reset directory to ' + initialCwd);
        done(true);
      }
    });

    // maps error to the file that references it
    function showErr(fileName){
      for (var i = 0; i< sourceList.length; i++){
        var o = sourceList[i],
        idx = o.paths.indexOf(fileName);

        if (idx > -1){
          var asis = o.asis[idx];
          grunt.log.error("Path error in " + o.source + '\n  at: ' + asis );
        }
      }
    }

    this.filesSrc.forEach(function(filePath){
      // Warn on and remove invalid source files (if nonull was set).
      if (!grunt.file.exists(filePath)) {
        grunt.log.warn('Source file "' + filePath + '" not found.');
        return;
      }

      var content = grunt.file.read(filePath),
      o = {source: filePath, paths: [], asis: []},
      baseDir = path.dirname(filePath);

      // Extracts all path-based require directives
      do {
        res = rx.exec(content);
        if (res != null) {
          grunt.verbose.writeln('  ' + res[0]);
          var absPath = path.resolve(baseDir, res[1]);
          pathList.push(absPath);
          o.paths.push(absPath);
          o.asis.push(res[0]);
        }
      }
      while (res != null);

      // each item in sourceLis is an object with these properties:
      // - source: path to the file read
      // - paths: absolute paths of all require in the file
      // - asis: require directive extracted from the file
      if (o.paths.length > 0){
        sourceList.push(o);
      }
    });

    // remove duplicates
    pathList = pathList.filter(function(elem, pos){
      return pathList.indexOf(elem) === pos;
    });

    wait.emit('setup', pathList.length);

    // print map structure
    // for (var i = 0; i< sourceList.length; i++){
    //   var o = sourceList[i];
    //   grunt.log.writeln(o.source);
    //   for (var j = 0; j< o.paths.length; j++){
    //     grunt.log.writeln('  ' + o.paths[j]);
    //   }
    // }
    // grunt.log.writeln('');

    function checkFileCase(filePath){
      var name = path.basename(filePath);
      fs.readdir(exactDir, function(err, files){
        if (err){
          grunt.log.error(err);
        }
        else if (files.indexOf(name) === -1){
          showErr(filePath);
        }
        else{
          wait.emit('fileDone', filePath);
        }
      });
    }

    // check each file
    for (var i=0; i< pathList.length; i++){

      var filepath = pathList[i],
      dirName = path.dirname(filepath);

      process.chdir(dirName);
      var exactDir = process.cwd(); // get path with correct casing

      if (dirName !== exactDir){ // check path against exact casing
        showErr(filepath);
      }
      else {
        checkFileCase(filepath);
      }
    }
  });
};
