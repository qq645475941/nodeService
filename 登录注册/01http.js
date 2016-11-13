

    var http=require('http');
    //加载模块
    var route = require('./Router');
    // 创建服务器
    http.createServer(function (req,res) {
        var url=req.url;
        route(url, req, res);
        }).listen(3000,function (err) {
                if(!err){
            console.log('服务器启动成功');
            }
        });
    
