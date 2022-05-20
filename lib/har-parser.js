'use strict';

const debug = require('debug')('shrink-har-parser');
debug('[%s] started: %O', __filename, process.argv);

// File system path library
const path = require('path');

// File system
const fs = require('fs');

// Helper libraries
const harFS = require('./fileSystem');
const utils = require('./utils');

// Console colours
const chalk = require('chalk');

function initResponseObject() {
    let response = {
        file: '',
        size: 0,
        entries: 'N/A',
        reduction: 0,
        success: true,
        creator: '',
        message: '',
        version: 0
    };

    return (response);
}
function parseFile(file, settings) {
    debug('parseFile(%s) :: Entry', file);
    // Initialise response object
    let response = initResponseObject();
    response.file = file;

    try {
        // Construct full filename with path
        let filePath = settings.directory + path.sep + file;

        // Read raw file
        debug('parseFile() reading [%s]', filePath);
        let rawData = fs.readFileSync(filePath);
        response.size = rawData.length;

        // Parse raw data into JSON
        debug('Parsing raw data into JSON object');
        let harData = JSON.parse(rawData);

        // Check that the JSON has basic HAR properties
        if ((Object.prototype.hasOwnProperty.call(harData.log, 'version')) && (Object.prototype.hasOwnProperty.call(harData.log, 'entries'))) {
            debug('HAR file [%s] is version %s and has %s entries', file, harData.log.version, harData.log.entries.length);

            // Populate response object file properties
            response.version = harData.log.version;
            response.entries = harData.log.entries.length;

            // Extract the HAR Creator details, if it exists
            if (Object.prototype.hasOwnProperty.call(harData.log, 'creator')) {

                debug('Extracting creator: %O', harData.log.creator);
                response.creator = `${harData.log.creator.name} ${harData.log.creator.version}`;
            }

            // Loop through each entry in the HAR
            harData.log.entries.forEach(element => {

                // It's the `text` property under `response.content` which we're going to nullify, so check it's present
                if (Object.prototype.hasOwnProperty.call(element.response.content, 'text')) {
                    // Found a response body we can blat
                    if (settings.verbose) {
                        debug('%s bytes reduction in [%s] response from [%s]', element.response.content.text.length, element.response.content.mimeType, element.request.url);
                    }

                    // Keep a running total of the bytes in response bodies
                    response.reduction += element.response.content.text.length;

                    // Blat the response. This is only in-memory. We'll optionally write these changes to disk later
                    element.response.content.text = '';
                }
            });

            // If we've got 'commit' enabled, write changes to disk
            if (settings.commitChanges) {
                // Initialise object to record before/after stats
                let fileStats = {
                    before: {},
                    after: {}
                };

                // Get File stats before shrinking
                fileStats.before = harFS.getFileInfo(filePath);

                // Write modified JSON to the file
                debug('Writing changes back to %s', filePath);
                fs.writeFileSync(filePath, JSON.stringify(harData), (error) => {
                    if (error) {
                        debug('An error occurred writing changes back to [%s]: %O', file, error);
                        response.success = false;
                        response.message = 'Error saving changes [%s]', error.message;
                    }
                });

                // Get File stats after shrinking
                fileStats.after = harFS.getFileInfo(filePath);

                // Append the file stats to the response object
                response.fileStats = fileStats;
            }

            debug('parseFile() is returning the response: %O', response);
            return (response);

        } else {
            let message = 'Not a recognised HAR format';
            debug(message);
            response.success = false;
            response.message = message;
            return (response);
        }
    } catch (error) {

        debug('An error [%s] occurred in parseFile(): %O', error.message, error);
        response.success = false;
        response.message = error.message;
        return (response);
    }
}

function extractOutput(data, settings) {
    // Take the output from parseFile and extract just those properties required for the outputted columns

    var result = {};
    try {
        // Extract properties from `response` data which we want to display in the results columns`
        result.file = data.file; // Include the filename

        // Pull additional properties if we're in `verbose` mode
        if (settings.verbose) {
            result.creator = chalk.yellowBright(data.creator);
            result.version = chalk.yellowBright(data.version);
        }

        if (settings.commitChanges === false) { // Output properties from the Analysis results
            result.size = chalk.cyanBright(utils.formatBytes(data.size));
            result.entries = chalk.yellowBright(data.entries);

            if (data.success) { // Pull out properties that only exist if the operation was successful
                result.reduction = utils.formatBytes(data.reduction);

                let reductionPercent = Math.round((data.reduction / data.size) * 100);
                result.reductionPercent = `${reductionPercent}%`;

                // Highlight the reduction results if they're larger than 50 %
                if (reductionPercent >= settings.constants.SHRINKHAR_REDUCTION_PERCENT_HIGHLIGHT) {
                    result.reduction = chalk.greenBright(result.reduction);
                    result.reductionPercent = chalk.greenBright(result.reductionPercent);
                }

            } else {
                // Parsing of HAR file didn't succeed
                result.error = chalk.red(data.message);
                result.reduction = chalk.red('N/A');
                debug('Failed File Result: %O', result);
            }


        } else { // Output properties from the Shrink results

            if (data.success) { // Pull out properties that only exist if the operation was successful
                result.before = utils.formatBytes(data.fileStats.before.size);
                result.after = utils.formatBytes(data.fileStats.after.size);
                let reduction = data.fileStats.before.size - data.fileStats.after.size;
                result.reduction = utils.formatBytes(reduction);

                // Apply colour to properties
                result.before = chalk.cyanBright(result.before);
                let reductionPercent = ((reduction / data.fileStats.before.size) * 100);
                if (reductionPercent >= settings.constants.SHRINKHAR_REDUCTION_PERCENT_HIGHLIGHT) {
                    result.reduction = chalk.greenBright(result.reduction);
                    result.after = chalk.greenBright(result.after);
                }

            } else {
                // Shrinking of HAR file didn't succeed
                result.error = chalk.red(data.message);
                result.reduction = chalk.red('N/A');
                debug('Failed File Result: %O', result);
            }
        }

        return (result);

    } catch (error) {
        debug('An error occurred in extractOutput(): %O', result);
        return (result);
    }









}
module.exports = { parseFile, extractOutput };