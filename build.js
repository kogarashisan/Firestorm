
var fs = require('fs');

var BuildHelper = require('./build/BuildHelper.js');

var file_list = BuildHelper.readJSON('build/files.json').firestorm,
    content = BuildHelper.readFiles(file_list, 'src/'),
    wrapper = BuildHelper.readFile('build/wrapper.js'),
    wrapper_raw = BuildHelper.readFile('build/wrapper-raw.js');

var result = wrapper
    .replace("/*<%content%>*/", function () {
		return content.join('\n');
	})
    .replace("<%=version%>", BuildHelper.readJSON('package.json').version);

fs.writeFileSync('lib/firestorm.js', result);

result = wrapper_raw
	.replace("/*<%content%>*/", function () {
		return content.join('\n');
	})
	.replace("<%=version%>", BuildHelper.readJSON('package.json').version);

fs.writeFileSync('lib/firestorm.raw.js', result);

process.exit();