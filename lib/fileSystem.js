'use strict';

const debug = require('debug')('shrink-har-fileSystem');
debug('[%s] started', __filename);

// File system
const fs = require('fs');

// Command line options parser
const argv = require('yargs')
.help(false)
.argv;

function getFiles(fileSpec, directory) {
    debug('getFiles(%s, %s) :: Entry', fileSpec, directory);
    // Initialise array for results
    let files = [];

    try {
        // Get all files from source directory
        let sourceFiles = fs.readdirSync(directory);
        debug('%s has %s files. Looking for ones which match the spec ...', directory, sourceFiles.length);
        // Initialise 'matcher' package
        let matcher = require('matcher');

        // Filter source files by the file spec
        files = matcher(sourceFiles, fileSpec);

        debug('%s files found: %O', files.length, files);

        return(files);

    } catch (error) {
        debug('An error occurred in getFiles(): %O', error);
        // Return an empty array
        return([]);

    }
}

function getWorkingDirectory() {
    // Check if the '--directory' argument was used
    if (argv.directory) {
        debug('"--directory" argument detected');

        let directory = argv.directory;
        // Check that a string was passed along with "--directory"
        if (typeof(directory) === 'string') {
            debug('The --directory switch was passed the argument [%s], which is type "string".  Checking if it is a valid directory', directory);

                let fileInfo = getFileInfo(directory);

                if(fileInfo.isDirectory) {
                    debug('Directory [%s] is valid', directory);
                    // Make sure the directory is without a trailing separator to keep user input consistent with `process.cwd()`
                    if ((directory.slice(-1) === '/') || (directory.slice(-1) === '\\')) {
                        // Remove the trailing path separator
                        directory = directory.substring(0, directory.length - 1);
                    }

                    // Return the user specified directory
                    return(argv.directory);
                } else {
                    debug('[%s] is *not* a valid directory. Using the current working directory instead', directory);
                    return(process.cwd());
                }
        } else {
            // The value passed via --directory is not a string. Ignore it and return current working directory instead
            debug('It is not a valid directory. Using current working directory instead [%s]', process.cwd());
            return(process.cwd());
        }
    } else {
        // No --directory switch was provided. Return current working directory
        debug('Using current working directory [%s]', process.cwd());
        return(process.cwd());
    }
}

function getFileInfo(file) { // Get various file attributes
    try {
        let stats = fs.statSync(file); // Read file stats
        let fileStats = {}; // Initialise response object

        // Extract required properties
        fileStats.isFile = stats.isFile();
        fileStats.isDirectory = stats.isDirectory();
        fileStats.isSymbolicLink = stats.isSymbolicLink();
        fileStats.size = stats.size;
        fileStats.success = true;

        return(fileStats); // Return file stats
    } catch (error) {
        // Return error object
        let response = {
            success: false,
            message: error.message,
            size: 0,
            isFile: false,
            isDirectory: false,
            isSymbolicLink: false
        };

        return(response);
    }
}

module.exports = { getWorkingDirectory, getFiles, getFileInfo };