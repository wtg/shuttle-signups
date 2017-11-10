var handlebars = require('handlebars');
var fs = require('fs');

// var readHTML = function(filePath,time,location,rcs_id,callback) {
//     fs.readFile(filePath, {encoding: 'utf-8'}, function(error, html) {
//         if(error) {
//             throw error;
//             callback(error);
//         }
//         else {
//             callback(null, html);
//         }
//     });
// };

var readHTML = function(filePath,time,location,rcs_id) {
                        var html = fs.readFile(filePath);
					    var template = handlebars.compile(html);
					    var replacements = { NAME: rcs_id, TIMEVAR: time, LOCVAR: location};
					    
					    var completeHTML = template(replacements);
					    
					    console.log(completeHTML);
					    
					    return completeHTML.toString();
					}