
// workaround for a bug in Grunt, https://github.com/gruntjs/grunt/issues/1135
global.bug1135 = function(callback) {
	return function() {
		try {
			return callback();
		} catch (e) {
			throw new Error(e);
		}
	}
};

module.exports = function(grunt) {

	grunt.option('stack', true);

	grunt.registerTask('default', global.bug1135(function() {

		var file_list = grunt.file.readJSON('build/files.json').firestorm,
			wrapper = grunt.file.read('build/wrapper.js'),
			content = [];

		for (var i = 0, count = file_list.length; i < count; i++) {
			content.push(grunt.file.read('src/' + file_list[i]));
		}

		grunt.file.write(
			'lib/firestorm.js',
			wrapper.replace("/*<%firestorm_content%>*/", content.join('\n'))
		);

	}));

};