var fs = require('fs');

module.exports = BuildHelper = {
    fs: fs,
    readJSON: function(path) {
        return eval("(" + fs.readFileSync(path, 'utf8') + ")")
    },
    readFile: function(path) {
        return fs.readFileSync(path, 'utf8');
    },
    readFiles: function(file_list, prefix) {
        var result = [];
        for (var i = 0, count = file_list.length; i < count; i++) {
            result.push(this.readFile(prefix + file_list[i]));
        }
        return result;
    },
    deleteFile: function(path) {
        try {
            fs.unlinkSync(path);
        } catch (e) {}
    },
    isFileExists: function(path) {
        try {
            fs.accessSync(path, fs.F_OK);
            return true;
        } catch (e) {}
        return false;
    },
    ensureDirectoryExists: function(path) {
        try {
            fs.statSync(path);
        } catch (e) {
            fs.mkdirSync(path);
        }
    }
};