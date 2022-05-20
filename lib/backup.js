'use strict';

const debug = require('debug')('shrink-har-backup');
debug('[%s] started', __filename);

// File system
const fs = require('fs');

// File system path library
const path = require('path');

// Zip archive library
const AdmZip = require('adm-zip');

function backupFiles(files, directory) {
    debug('backupFiles(%s, %s) :: Entry', files, directory);
    // Initialise response object
    let response = {
        success: true
    };

    try {
        // Create ZIP Archive
        let zip = new AdmZip();

        // Add local files to ZIP Archive
        files.forEach(file => {
            let filePath = directory + path.sep + file;
            zip.addLocalFile(filePath);
        });

        // Get unique string from time stamp (used in archive file name)
        let now = new Date();
        let ticks = now.getTime();

        // Construct ZIP Archive filename and path
        let zipFilename = directory + path.sep + 'shrink-har.backup.' + ticks + '.zip';
        response.zipFilename = zipFilename;

        // Write ZIP Archive to disk
        fs.writeFileSync(zipFilename, zip.toBuffer());

        // Return successful response object
        return (response);

    } catch (error) {

        debug('An error occurred in backupFiles(): %O', error);
        // Amend response object and return it
        response.success = false;
        response.errorMessage = error.message;
        return (response);

    }
}

module.exports = { backupFiles };