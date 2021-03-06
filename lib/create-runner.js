"use strict";
var path = require('path');
var spawn = require('child_process').spawn;
function createRunner(config, testFile) {
    var options = {
        cwd: config.dir
    };
    if (options.env == null) {
        options.env = Object.create(process.env);
    }
    options.env.ATOM_SHELL_INTERNAL_RUN_AS_NODE = 1;
    options.env.DIR = config.dir;
    options.env.TUTORIAL_DIR = config.tutorialDir;
    options.env.TASK_POSITION = config.taskPosition;
    var node = null;
    if (process.platform === 'darwin' && process.resourcesPath) {
        node = path.resolve(process.resourcesPath, '..', 'Frameworks', 'Atom Helper.app', 'Contents', 'MacOS', 'Atom Helper');
    }
    else {
        node = process.execPath;
    }
    var ava = path.join(__dirname, '..', '..', 'ava', 'cli');
    var tapJson = path.join('..', '..', 'tap-json', 'bin', 'tap-json');
    return spawn(node, [
        ava,
        '--fail-fast',
        '--tap | ' + tapJson,
        testFile
    ], options);
}
exports.createRunner = createRunner;
