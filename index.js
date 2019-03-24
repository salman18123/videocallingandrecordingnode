const express=require('express')
const path=require('path')
const app=express()
const SERVER_PORT=process.env.PORT||2020
const ExpressPeerServer = require('peer').ExpressPeerServer;

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/', express.static(path.join(__dirname, 'public')))
//app.use('/api',require('./api'))
const server=app.listen(SERVER_PORT)
var options = {
    debug: true
}
 
var peerserver = ExpressPeerServer(server, options);
//console.log(peerserver)
app.use('/', peerserver);

peerserver.on('connection', function(id) {

    console.log(id)
});
peerserver.on('call',(call)=>{
    console.log("bhaag")
})
peerserver.on('disconnect', function(id) { 
    


});
app.get('/portno',(req,res)=>{
    console.log(SERVER_PORT)
res.send({portno:SERVER_PORT})
})
app.post('/uploadFile',(request,response)=>{
    // parse a file upload
    var mime = require('mime');
    var formidable = require('formidable');
    var util = require('util');

    var form = new formidable.IncomingForm();

    var dir = !!process.platform.match(/^win/) ? '\\uploads\\' : '/uploads/';

    form.uploadDir = __dirname + dir;
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024;
    form.maxFields = 1000;
    form.multiples = false;

    form.parse(request, function(err, fields, files) {
        var file = util.inspect(files);

        response.writeHead(200, getHeaders('Content-Type', 'application/json'));

        var fileName = file.split('path:')[1].split('\',')[0].split(dir)[1].toString().replace(/\\/g, '').replace(/\//g, '');
        var fileURL = 'http://' + 'localhost' + ':' + '2020' + '/uploads/' + fileName;

        console.log('fileURL: ', fileURL);
        response.write(JSON.stringify({
            fileURL: fileURL
        }));
        response.end();
    });
    function getHeaders(opt, val) {
        try {
            var headers = {};
            headers["Access-Control-Allow-Origin"] = "https://secure.seedocnow.com";
            headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
            headers["Access-Control-Allow-Credentials"] = true;
            headers["Access-Control-Max-Age"] = '86400'; // 24 hours
            headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
    
            if (opt) {
                headers[opt] = val;
            }
    
            return headers;
        } catch (e) {
            return {};
        }
    }


})

