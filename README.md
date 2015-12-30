# node_learn
nodejs学习笔记

# 关于Node.js
1.使用google chrome的V8虚拟机

2.基于事件驱动和异步I/O的混杂模型

3.Node是javascript程序的平台，而不是一个框架

# 1.一个异步调用的例子
function(){

    var fs = require('fs');

    fs.readFile('./resource.json', function(err, data){

        console.log(data);
    
})
}

# 2.Hello World HTTP 服务器
值得注意的一点，在node中服务器和程序是一样的，下面是一个简单的服务器实现

function(){
    
    var http = require('http');
    
    http.createServer(function(req, res){
        
        res.writeHead(200, {'Content-Type': 'text/plain'});
        
        res.end('Hello World\n');
        
    });
    
    console.log('Server running at http://localhost:3000')
}

# 3.创建流数据
Node在数据流和数据流动上也很强大

function(){

    var stream = fs.createReadStream('./resource.json');
    
    stream.on('data', function(chunk){
    
        console.log(chunk);
    
    });
    
    stream.on('end', function(){
        
        console.log('finished');
        
    })
}
