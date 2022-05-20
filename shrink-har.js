#!/usr/bin/env node

'use strict';

const debug = require('debug');//('shrink-har');
debug('[%s] started: %O', __filename, process.argv);

// Command line options parser
const argv = require('yargs')
    .help(false)
    .argv;

// check if "debug" mode is enabled via the command line
if (argv.debug) {
    debug.enable('*');
}

// Platform specific newline character
const endOfLine = require('os').EOL;

// Import terminal spinner library
const ora = require('ora');

// Console colours
const chalk = require('chalk');

// Console output formatting for columns and colours
const columnify = require('columnify');

// HTTP Archive Parser
const harParser = require('./lib/har-parser');

// Initialise configuration
const config = require('./lib/configuration');

// Populate the settings object
var settings = config.getSettings();

try {
    // Check for '--help' command line parameters
    if (argv.help) {
        debug('--help detected.  Showing help screen.');
        // Show help screen
        let help = require('./lib/help');
        help.helpScreen(argv.verbose);

        process.exit(0) // Exit to terminal

    } else {

        debug('Using these settings: %O', settings);

        // Check that we have at least one file to operate on
        if (settings.files.length === 0) {
            console.log('%s: There are no files in [%s] matching [%s]', chalk.red('Error'), chalk.bold(settings.directory), chalk.bold(settings.fileSpec));

            // Return to terminal with exit code 9 (https://nodejs.org/api/process.html#process_exit_codes)
            // 9 Invalid Argument: Either an unknown option was specified, or an option requiring a value was provided without a value.
            process.exit(9) // Exit to terminal
        }

        // Check if we've been asked to commit changes
        if (settings.commitChanges) {
            // Obtain confirmation for writing changes
            if (settings.confirmChanges === false) { // There was no `--yes` switch, so interactive confirmation is required
                let readlineSync = require('readline-sync'); // Import library to read input lines from terminal

                // Confirm, or warn, about backing up files
                if (settings.backup) {
                    console.log(chalk.blueBright('Info: ') + 'If you confirm these changes your files ' + chalk.bold('will') + ' be backed up');
                } else {
                    console.log(chalk.yellow('Warning: ') + 'If you confirm these changes your files ' + chalk.bold('will not') + ' be backed up!');
                    console.log('You can change this by including the ' + chalk.blueBright('--backup') + ' switch.');
                }

                if (readlineSync.keyInYN('Do you want to shrink these .har files?')) {
                    // 'Y' key was pressed.
                    settings.confirmChanges = true;

                } else {
                    console.log('No changes were made.');
                    process.exit(0);
                }
            }
        }

        // Initialise results object
        let results = [];

        // Display the directory we're working in
        console.log(chalk.blueBright('Info: ') + 'Working directory is ' + chalk.yellowBright(settings.directory));

        // Create and start the activity spinner
        const spinnerProcessing = ora({
            text: 'Initialising ...',
            spinner: 'simpleDotsScrolling'
        }).start();

        // Backup files before making changes (if configured to do so)
        if ((settings.backup === true) && (settings.commitChanges === true)) {
            spinnerProcessing.text = "Backing up files ...";
            spinnerProcessing.render();
            let backup = require('./lib/backup');
            let response = backup.backupFiles(settings.files, settings.directory);
            debug('backup.backupFiles() returned: %O', response);
            if (response.success === false) {
                // Backup failed so we won't make any changes
                console.log('%s: Backup of existing files failed [%s]', chalk.red('Error'), response.message);

                process.exit(5) // Exit to terminal
            } else {
                console.log(chalk.blueBright('Info: ') + 'Files have been backed up to ' + chalk.yellowBright(response.zipFilename));
            }
        }

        // Loop through files
        debug('Processing files: %s', settings.files.join(' | '));
        settings.files.forEach(file => {

            spinnerProcessing.text = `Processing files ... ${file}`;
            spinnerProcessing.render();

            // Process the current file
            let response = harParser.parseFile(file, settings);
            debug('parseFile() returned: %O', response);

            // Extract required properties from the parsing result
            let result = harParser.extractOutput(response, settings);

            // Add result row into Results array
            debug('Adding this result to array: %O', result);
            results.push(result);
        });

        // Stop the activity spinner
        if (settings.commitChanges) {
            spinnerProcessing.succeed('Shrinking Complete.');
        } else {
            spinnerProcessing.succeed('Analysis of estimated reduction is complete.');
        }

        // Columnify output options
        let options = config.getColumnifyOptions();

        // Display results array in columns
        let columns = columnify(results, options);
        console.log(columns);
        console.log(endOfLine);

        if (settings.commitChanges === false) {
            // Analysis complete. Inform the user of how they can apply the changes
            if (settings.files.length > 1) {
                console.log('These files can be shrunk by including the ' + chalk.blueBright('--commit') + ' switch');
            } else {
                console.log('This file can be shrunk by including the ' + chalk.blueBright('--commit') + ' switch');
            }
        }
    }

} catch (error) {
    console.error(chalk.redBright(error.message));
    console.error('An error occurred: %O', error);
}