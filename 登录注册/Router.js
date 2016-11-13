//引入文件模块
var serviceFile = require('./serviceFile');
var fs=require('fs');
var router = function(url,req, res) {
    var wurl='./myData/mydata.txt';
//如果是请求注册接口
    if (/\/suibian\/reg/.test(url)) {
        var userReq = '';
        /**
         * 获取注册请求的data
         */
        req.on('data',function(data){
            userReq += data;
        });
        req.on('end',function(){
            console.log(userReq);
        //打开数据文件 并写入注册的数据
            fs.open(wurl,'a+',function (err) {
                if(!err){
                    writeData(wurl,userReq)
                }
            });

            function writeData(wurl,data) {
                fs.appendFile(wurl,data+'\n',function (err) {
                    if(!err){
                        console.log(data+"写入完成");
                    }
                })
            }
            res.end()
        });
//  ajax 请求登录
    } else if(/\/suibian\/login/.test(url)){ 
            var userReq = '';
            /**
             * 登陆请求的data方法,
             */
            req.on('data',function(data){
                userReq += data;
            });
            req.on('end',function() {
                var name=userReq.match(/"name":".*?"/);
                var pwd=userReq.match(/"pwd":".*?"/);
                
                //读取数据库的数据
                fs.readFile(wurl,function (err,content) {
                    if(!err){
                        var con=content+'';
                         var ss=con.split("\n");
                        var j=1;
                        //遍历数据库 匹配登录请求的数据
                        for (var i=0;i<ss.length;i++){
                            
                            //提取数据中的账号 和密码
                             var names=ss[i].match(name);
                             var pwds=ss[i].match(pwd);
                            //看账号是否存在,
                            if(names!=null){
                                console.log("存在"+names);
                                //看密码是否正确
                                if(pwds!=null){
                                    //密码存在给浏览器返回cookie
                                    var curDate = new Date(Date.now() + 1000*60);
                                    var gmt = curDate.toGMTString();
                                    res.setHeader('Set-Cookie',['value='+ss[i]+';expires='+gmt+';path=/',])
                                    res.end('1');
                                }else{
                                    //密码不对相应'2'
                                    res.end('2')
                                }
                               break;
                               
                            }else{
                                //名字不存在
                                j++;
                                if(j==ss.length){
                                    console.log("不存在");
                                    res.end("0");
                                }
                            }
                        }
                    }
                });
            });
    }else{
        //设置响应头,文件和编码格式
        res.setHeader('content-type', 'text/html;charset=utf-8');
        var url = req.url;
        //响应客户端请求的文件
        serviceFile('.' + url, function (content) {
            //响应客户端指定路径文件内容
            res.end(content);
        });
        console.log(url)
    }
};

module.exports = router;