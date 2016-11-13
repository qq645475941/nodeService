var fs = require('fs');
/***
 * 响应指定文件内容
 * @param pathName
 * @param fn
 */
function serverFile(pathName, fn) {
    /**
     * 判断文件是否存在
     */
    fs.access(pathName, function (err) {
        /**
         * 如果没有错误
         */
        if(!err) {
            fs.readFile(pathName, function (err, content) {
                if (!err) {
                    //拿到文件的状态信息
                    fs.stat(pathName,function(err,state){

                        //console.log([err,state]);

                        fn(content,state.mtime);
                    })
                }
            })
        }else{
            fn('file not exist!')
        }
    })
}


module.exports = serverFile;