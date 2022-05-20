const debug = require('debug')('shrink-har-configuration');
debug('Entry: [%s]', __filename);

// Helper library
const harFS = require('./fileSystem');

// Console colours
const chalk = require('chalk');

// Command line options parser
const argv = require('yargs')
.help(false)
.argv;

// Initialise default settings
const defaultSettings = {
    directory: '.',
    fileSpec: '*.har',
    files: [],
    commitChanges: false,
    confirmChanges: false,
    backup: false,
    constants: {
        SHRINKHAR_REDUCTION_PERCENT_HIGHLIGHT: 75
    }
};

function getSettings() {
    debug('Entry::getSettings()');
    try {
        // Load the defaults
        let settings = defaultSettings;
        debug('Loaded default settings: %O', settings);

        // Check command line arguments for overrides...
        debug('Looking for command line arguments which override defaults ...');

        // Get the working directory
        debug('Getting the working directory ...');
        settings.directory = harFS.getWorkingDirectory();

        // Get file specs, if any, and replace default value
        debug('Getting file specs ...');
        settings.fileSpec = getFileSpecs(settings.fileSpec)

        // Get the list of files that match the file spec
        debug('Getting list of files ...');
        settings.files = harFS.getFiles(settings.fileSpec, settings.directory);

        // Check for --commit argument
        if (argv.commit) {
            debug('--commit detected. Changes will be written back to files');
            settings.commitChanges = true;
        }

        // Check for --backup argument
        if (argv.backup) {
            debug('--backup detected. Backup mode enabled');
            settings.backup = true;
        }

        // Check for --verbose argument
        if (argv.verbose) {
            debug('--verbose detected. Verbosity mode enabled');
            settings.verbose = true;
        }
        // Check for --yes or --y argument
        if ((argv.yes) || (argv.y)) {
            debug('--yes detected. Automatic confirmation of changes enabled');
            settings.confirmChanges = true;
        }

        debug('getSettings() generated: %O', settings);
        return(settings);

    } catch (error) {
        console.error(chalk.redBright(error.message));
        console.error('An error occurred in getSettings(). Using default settings.');
        debug('An error occurred in getSettings(). Using default settings instead: %O', error);
        return(defaultSettings);
    }
}

function getFileSpecs(defaultFileSpec) { // Get file specification from command line (e.g. *.har)
    if (argv.file) {
        debug('"--file" argument detected');

        let fileSpec = argv.file;
        // Check that a string was passed along with "--file"
        if (typeof(fileSpec) === 'string') {
            debug('The --file switch was passed the argument [%s], which is type "string".', fileSpec);
            return(fileSpec);
        } else {
            // There was no string value provided with the --file switch.
            debug('There was no string value provided with the --file switch. Using the default [%s] instead.', defaultFileSpec);
            return(defaultFileSpec);
        }
    } else {
        // No --file switch provided. Use default
        debug('There was no --file switch. Using the default [%s] instead.', defaultFileSpec);
        return(defaultFileSpec);
    }
}

function getColumnifyOptions() {
    // Columnify output options
    let options = {
        config: {
            file: {
                headingTransform: () => {
                    return(chalk.underline('HAR Filename'));
                }
            },
            size: {
                headingTransform: () => {
                    return(chalk.underline('File Size'));
                }
            },
            reduction: {
                headingTransform: () => {
                    return(chalk.underline('Reduction'));
                }
            },
            reductionPercent: {
                headingTransform: () => {
                    return(chalk.underline('Reduction %'));
                }
            },
            creator: {
                headingTransform: () => {
                    return(chalk.underline('Creator'));
                }
            },
            entries: {
                headingTransform: () => {
                    return(chalk.underline('# Requests'));
                }
            },
            version: {
                headingTransform: () => {
                    return(chalk.underline('HAR Version'));
                }
            },
            error: {
                maxWidth: 30,
                showHeaders: false
            },
            before: {
                headingTransform: () => {
                    return(chalk.underline('Original File Size'));
                }
            },
            after: {
                headingTransform: () => {
                    return(chalk.underline('Shrunk File Size'));
                }
            }
        }
    };

    return(options);

}

module.exports = {getSettings, getColumnifyOptions};
