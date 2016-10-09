
var fs = require('fs');

var BuildHelper = require('./build/BuildHelper.js');

var file_list = BuildHelper.readJSON('build/files.json').firestorm,
    content = BuildHelper.readFiles(file_list, 'src/'),
    wrapper = BuildHelper.readFile('build/wrapper.js');

var result = wrapper
    .replace("/*=FIRESTORM_CONTENT*/", content.join('\n'))
    .replace("<%=version%>", BuildHelper.readJSON('package.json').version);

fs.writeFileSync('lib/firestorm.js', result);

process.exit();