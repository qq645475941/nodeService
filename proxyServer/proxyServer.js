var express = require('express')
var path = require('path')
var fs = require('fs');
var http = require('http');
var compression = require('compression')
var cfgPath = './proxy.json';

var app = express()

app.use(compression())

app.use(express.static(path.join(__dirname+'/../')))


// /163 ->
// /detail/ ->
app.use('*', (req, res) => {

    var reqUrl = req.originalUrl;
console.log(`请求${reqUrl}`)

    if(reqUrl=='/'){

        let indexHtml = fs.readFileSync('../index.html');
        res.end(indexHtml);
        return;
    }

    fs.readFile(cfgPath, (err, data) => {
        if (err) throw err;
        data = data.toString();
        let foundDUrl;
        let cfg = JSON.parse(data);

        cfg.forEach((e)=> {
            if (reqUrl.startsWith(e.surl)) {
                foundDUrl = e.durl + reqUrl.replace(e.surl, '');
            }
        })




        if (foundDUrl) {
            console.log(`请求${reqUrl},转发到${foundDUrl}`)
            let clientReq = http.request(foundDUrl, (reqRes) => {
                var chunks = [];
                reqRes.on('data', (chunk)=> {
                    chunks.push(chunk);
                })
                reqRes.on('end', (chunk)=> {
                    res.end(chunks.join(''));
                })
            });
            clientReq.end();
        }else{
            res.end('代理配置不正确');
        }


    });
})


var PORT = process.env.PORT || 8081
app.listen(PORT, function () {
    console.log('Production Express server running at localhost:' + PORT)
})


