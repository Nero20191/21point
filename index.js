const http = require('http');
 
http.createServer(function(req, res){
    res.setHeader("Access-Control-Allow-Origin", "*");//跨域
    res.write("hello world!");
    res.end();
}).listen(8181);