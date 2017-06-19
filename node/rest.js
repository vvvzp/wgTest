var http = require("http");
var https = require("https");

module.exports.getJSON = function(options, onResult)
{

    var prot = options.port == '443' ? https : http;
    var req = https.request(options, function(res){
        //console.log(res)
        var output = '';
        //console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            try{
            var obj = JSON.parse(output);
        } catch(e){console.log(output); var obj = {}}
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
        //res.send('error: ' + err.message);
    });

    req.end();
};