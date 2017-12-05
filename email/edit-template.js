var handlebars = require('handlebars');
var fs = require('fs');

var readHTML = function(filePath, time, location, rcs_id) {
	var html = fs.readFile(filePath);
	var template = handlebars.compile(html);
	var replacements = { NAME: rcs_id, TIMEVAR: time, LOCVAR: location };

	var completeHTML = template(replacements);

	console.log(completeHTML);

	return completeHTML.toString();
}
