var handlebars = require('handlebars');
var fs = require('fs');

var readHTML = function(filePath, callback) {
    fs.readFile(filePath, {encoding: 'utf-8'}, function(error, html) {
        if(error) {
            throw error;
            callback(error);
        }
        else {
            callback(null, html);
        }
    });
};

readHTML('NotificationEmail.html', function(error,html) {
    var template = handlebars.compile(html);
    var replacements = { NAME: "Matthew", TIMEVAR: "13:37", LOCVAR: "Narnia"};
    
    var completeHTML = template(replacements);
    
    console.log(completeHTML);
});