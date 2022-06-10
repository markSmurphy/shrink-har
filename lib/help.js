const debug = require('debug')('shrink-har-help');
debug('Entry: [%s]', __filename);


function helpScreen(verbose) {
    // Platform independent end-of-line character
    const endOfLine = require('os').EOL;
    // Console colours
    const chalk = require('chalk');
    // Parse package.json for the version number
    const npmPackage = require('../package.json');

    // Display help screen
    console.log(chalk.blueBright(npmPackage.name));
    console.log(chalk.greenBright('Read the docs: ') + npmPackage.homepage);
    console.log(chalk.magentaBright('Support & bugs: ') + npmPackage.bugs.url);
    console.log(endOfLine);
    console.log(chalk.whiteBright('DESCRIPTION:'));
    console.log(chalk.white('   %s'), npmPackage.description);
    console.log(endOfLine);
    console.log(chalk.whiteBright('VERSION:'));
    console.log('   ' + npmPackage.version);
    console.log(endOfLine);
    console.log(chalk.whiteBright('USAGE:'));
    console.log('   ' + 'shrink-har [options]');
    console.log(endOfLine);
    console.log(chalk.whiteBright('OPTIONS:'));
    console.log('   ' + '--file <filespec>             ' + chalk.yellowBright('File specification. Default: *.har'));
    console.log('   ' + '--directory <path>            ' + chalk.yellowBright('Specify the directory.  Default: .'));
    console.log('   ' + '--commit                      ' + chalk.yellowBright('Commit changes to files. If absent only analysis is performed'));
    console.log('   ' + '--yes, -y                     ' + chalk.yellowBright('Automatically answer "yes" to confirmation prompts'));
    console.log('   ' + '--backup                      ' + chalk.yellowBright('Backup files before making changes. Default: false'));
    console.log('   ' + '--verbose                     ' + chalk.yellowBright('Enables verbose output'));
    console.log('   ' + '--debug                       ' + chalk.yellowBright('Enables debugging output'));
    console.log('   ' + '--no-color                    ' + chalk.yellowBright('Switches off colour output'));
    console.log('   ' + '--version                     ' + chalk.yellowBright('Display version number'));
    console.log('   ' + '--help                        ' + chalk.yellowBright('Display this help'));
    console.log(endOfLine);
    console.log(chalk.whiteBright('EXAMPLES:'));
    console.log(chalk.bold('   shrink-har'));
    console.log(chalk.yellowBright('   Analyse *.har in the current directory'));
    console.log(chalk.bold('   shrink-har --verbose'));
    console.log(chalk.yellowBright('   Analyse *.har in the current directory displaying verbose output'));
    console.log(chalk.bold('   shrink-har --commit --yes --backup'));
    console.log(chalk.yellowBright('   Shrink *.har in the current directory, with no prompts, after making a backup'));
    console.log(chalk.bold('   shrink-har --file www.example.com.har --directory ~/Downloads --commit'));
    console.log(chalk.yellowBright('   Shrink `www.example.com.har` in `~/Downloads` after a confirmation prompt'));
    console.log(chalk.bold('   shrink-har --directory /usr/harfiles --commit --yes'));
    console.log(chalk.yellowBright('   Shrink *.har in `/usr/harfiles` without backing up and with no prompt'));

    // Display more information if `verbose` is enabled
    if (verbose) {
        const os = require('os');
        const utils = require('./utils');
        console.log(endOfLine);
        console.log(chalk.whiteBright('SYSTEM:'));
        console.log('   Hostname           ' + chalk.blueBright(os.hostname()));
        console.log('   Uptime             ' + chalk.blueBright(utils.secondsToHms(os.uptime())));
        console.log('   Platform           ' + chalk.blueBright(os.platform()));
        console.log('   O/S                ' + chalk.blueBright(os.type()));
        console.log('   O/S release        ' + chalk.blueBright(os.release()));
        console.log('   Node version       ' + chalk.blueBright(`${process.version} [v8: ${process.versions.v8}]`));
        console.log('   CPU architecture   ' + chalk.blueBright(os.arch()));
        console.log('   CPU cores          ' + chalk.blueBright(os.cpus().length));
        console.log('   CPU model          ' + chalk.blueBright(os.cpus()[0].model));
        console.log('   Free memory        ' + chalk.blueBright(utils.formatBytes(os.freemem())));
        console.log('   Total memory       ' + chalk.blueBright(utils.formatBytes(os.totalmem())));
        console.log('   Home directory     ' + chalk.blueBright(os.homedir()));
        console.log('   Temp directory     ' + chalk.blueBright(os.tmpdir()));
        console.log('   Console width      ' + chalk.blueBright(process.stdout.columns));
        console.log('   Console height     ' + chalk.blueBright(process.stdout.rows));
        console.log('   Colour support     ' + chalk.blueBright(utils.getColourLevelDesc()));
    }
}

module.exports = { helpScreen };