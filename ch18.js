/*
 * 实现Express
 * 轻量级模块，把http模块功能封装在一个简单易用的接口中
 * Express扩展流http模块的功能，轻松处理服务器的路由、响应、cookie和HTTP请求的状态
 * 学习： 如何配置Express服务器
 *       设计路由
 *       利用Request和Response对象发送接收请求
 *       实现模板引擎
 */

/*
 * 1.Express入门
 *   安装Express：npm install express
 *   创建一个express类的实例作为http服务器：
 *          var express = require('express');
 *          var app = express();
 *   配置Express设置：定义环境 Express如何处理JSON解析 路由 视图
 *                  提供了set(setting, value) disable enable
 *                  例如： app.enable('trust proxy') //启用信用代理设置
 *                        app.disable('strict routing')
 *                        app.set('view engine', 'jade') //设置视图引擎为jade
 *                  提供了get enabled disabled来得到一个设定值
 *   启动Express服务器：创建一个实例，并开始监听端口
 *      app.listen(8080); //调用底层的http连接绑定到端口上，并开始监听
 *      底层的http模块事实上调用了http.createServer创建server对象
 */

/*var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var app = express();
var options = {
    host: '127.0.0.1',
    key: fs.readFileSync('ssl/server.pem'),
    cert: fs.readFileSync('ssl/server.crt'),
};
http.createServer(app).listen(80);
https.createServer(options, app).listen(443);
app.get('/', function(req, res){
    res.send("Hello from Express");
});*/

/*
 * 2.配置路由
 *   在上述定义的服务器开始接收请求前，需要定义路由
 *   路由：描述了如何处理针对Express服务器的http请求的URI路径部分
 *        URI：统一资源标识符 URL：统一资源定位符[一种具体的URI]
 *        路由定义为两部分: [1] HTTP请求方法[GET 或 POST]
 *                        [2] 在URL中指定的路径
 *        实现路由： express提供了一系列函数
 *                  app.<method>(path, [middleware, ...], callback)
 *                  <method> -- 指定HTTP请求方法
 *                  path -- 指的是需要通过回调函数处理的url的路径部分
 *                  middleware -- 在回调函数执行前的中间件函数
 *                  callback -- 处理请求并将响应发回客户端 (req, res)
 *                  app.all()用于指定路径的每个请求
 *        在路由中应用参数：在URL中实现参数，可以减少路由数量
 *                       [类似的请求使用相同的路由]
 *                       4种方式实现参数：
 *                          1.查询字符串 ?key=value&key=value...
 *                          2.POST参数 Web表单或者POST请求时，通过正文传递参数
 *                          3.正则 定义正则表达式作为路由的路径部分
 *                          4.定义的参数 <parm_name>按名称定义参数
 */

/*
 * 2.1 查询字符串应用路由参数
 *     使用url.parse()解析Request对象的url属性获取参数
 */

/*var express = require('express'),
    url = require('url'),
    http = require('http'),
    app = express();
http.createServer(app).listen(80);
app.get('/find', function(req, res){
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    res.send('Finding Book: Author: ' + query.author + 'Title: ' + query.title);
});*/

/*
 * 2.2 使用正则表达式应用路由参数
 *     可以让路径实现不遵循标准的/格式的模式
 */

/*var express = require('express'),
    http = require('http'),
    app = express();
http.createServer(app).listen(80);
app.get(/^\/book\/(\w+)\:(\w+)?$/, function(req, res){
    res.send('Get Book: Chapter: ' + req.params[0] + ' Page: ' + req.params[1]);
});*/

/*
 * 2.3 使用已经定义的参数来应用路由参数
 *     针对更加格式化的数据，可以使用已定义的参数
 *     在使用定义的参数时，req.param()是一个函数，不是数组
 */

/*var express = require('express'),
    http = require('http'),
    app = express();
http.createServer(app).listen(80);
app.get('/user/:userid', function(req, res){
    console.log('Execute after app.param');
    res.send('Get User: ' + req.param('userid'));
});*/

/*
 * 2.4 为已定义的参数应用回调函数
 *     如果已定义的参数在url中，可以指定被执行的回调函数
 *     如果某个参数有注册的回调函数，他就在调用路由处理程序之前调用参数的回调函数
 *     注册参数的回调函数，使用：app.param()方法
 *        app.param(param, function(req, res, next, value))
 *        next: 用于已注册的下一个app.param()回调的回调函数，如果有的话
 *              必须在某处调用next()，否则回调链将被破坏
 */

/*
var express = require('express'),
    http = require('http'),
    app = express();
http.createServer(app).listen(80);
app.get('/user/:userid', function(req, res){
    console.log('Execute after app.param');
    res.send('Get User: ' + req.param('userid'));
});
app.param('userid', function(req, res, next, value){
    console.log('Request with userid ' + value);
    next();
});*/

/*
 * 3.使用Request对象
 *   Request对象作为第一个参数传递到路由处理程序 [注意不同于http.ClientRequest对象]
 *   Request对象: 提供请求的数据和元数据，包括url，标头，查询字符串
 *               常用方法和属性：originalUrl | protocol | ip | path
 *                             host | method | query | fresh: 最后修改和当前匹配时为true
 *                             stale: 最后修改于当前匹配时为false
 *                             secure：建立TLS连接时为true
 *                             acceptsCharset(charset) 如果指定的字符集被支持返回true
 *                             get(header) 获得header的值
 *                             headers 请求标头的对象形式
 */

/*
var express = require('express');
var app = express();
app.listen(80);
app.get('/user/:userid', function (req, res) {
    console.log("URL:\t   " + req.originalUrl);
    console.log("Protocol:  " + req.protocol);
    console.log("IP:\t   " + req.ip);
    console.log("Path:\t   " + req.path);
    console.log("Host:\t   " + req.host);
    console.log("Method:\t   " + req.method);
    console.log("Query:\t   " + JSON.stringify(req.query));
    console.log("Fresh:\t   " + req.fresh);
    console.log("Stale:\t   " + req.stale);
    console.log("Secure:\t   " + req.secure);
    console.log("UTF8:\t   " + req.acceptsCharset('utf8'));
    console.log("Connection: " + req.get('connection'));
    console.log("Headers: " + JSON.stringify(req.headers,null,2));
    res.send("User Request");
});*/

/*
 * 4.使用Response对象
 *   Response对象提供了必要的功能建立和发送适当的HTTP响应
 *   主要功能 设置标头 设置状态 将数据发回客户端
 *           设置标头：制定适当的HTTP响应的一个重要组成部分[如设置Content-Type告诉浏览器如何处理响应]
 *                   最常用的方法：get(header) set(header, value)
 *                   set(headerObj)
 *                   location(path) 参数可以是 url路径 完整url 相对路径 一个浏览器行为
 *                   type(type_string) 根据type_string参数设置Content-Type标头
 *                   attachment([filepath]) content-disposition设置为attachment
 *                                          content-type设置为基于文件的扩展名
 *           设置状态：如果状态是200意外的值，需要设置它
 *                   设置方法：res.status(number)
 *                           200 -- OK正确
 *                           300 -- 重定向
 *                           400 -- 错误请求
 *                           401 -- 未经许可
 *                           403 -- 禁止
 *                           500 -- 服务器错误
 *           发送响应：调用send方法
 *                      res.send(status, [body])
 *                        status -- HTTP状态代码
 *                        body -- 一个String对象或一个buffer对象
 *                      res.send([body])
 *                    只要设置了正确的标头和状态，send()方法就可以处理所有的必要响应，
 *                    一旦完成，设置res.finished 和 res.headerSent
 *           发送JSON响应：使用JSON数据从服务器传输信息到客户端，然后让客户端动态填充数据到页面上
 *                   res提供json()和jsonp()方法，可以很方便地发送JSON
 *                   res.json(status, [object])
 *                   res.json([object])
 *                   res.jsonp(status, [object])
 *                   res.jsonp([object])
 *                   ---------------------------------javascript对象被转换为JSON字符串发送给客户端
 *                   在jsonp情况下，请求的url包括?callback=<method>参数
 *           发送文件：response对象上sendfile方法可以完成将文件发送到客户端的全部事情
 *                    res.sendfile(path, [options], [callback])
 *                    具体执行：根据文件扩展名设置content-type
 *                            设置其他相应的标头，如content-length
 *                            设置响应的状态
 *                            使用response对象内部的连接，将文件内容发送至客户端
 *           发送下载响应：res.download()，将文件作为附件发送
 *                       这意味着content-disposition标头已经被设置
 *           重定位响应：res.redirect(path)负责处理重定向到新位置的请求
 */

/*
var express = require('express');
var url = require('url');
var app = express();
app.listen(80);
app.get('/', function (req, res) {
    var response = '<html><head><title>Simple Send</title></head>' +
        '<body><h1>Hello from Express</h1></body></html>';
    res.status(200);
    res.set({
        'Content-Type': 'text/html',
        'Content-Length': response.length
    });
    res.send(response);
    console.log('Response Finished? ' + res.finished);
    console.log('\nHeaders Sent: ');
    console.log(res.headersSent);
});
app.get('/error', function (req, res) {
    res.status(400);
    res.send("This is a bad request.");
});*/

/*
var express = require('express');
var url = require('url');
var app = express();
app.listen(80);
app.get('/json', function (req, res) {
    app.set('json spaces', 4);
    res.json({name:"Smithsonian", built:'1846', items:'137M',
        centers: ['art', 'astrophysics', 'natural history',
            'planetary', 'biology', 'space', 'zoo']});
});
app.get('/error', function (req, res) {
    res.json(500, {status:false, message:"Internal Server Error"});
});
app.get('/jsonp', function (req, res) {
    app.set('jsonp callback name', 'cb');
    res.jsonp({name:"Smithsonian", built:'1846', items:'137M',
        centers: ['art', 'astrophysics', 'natural history',
            'planetary', 'biology', 'space', 'zoo']});
});
*/

/*var express = require('express');
var url = require('url');
var app = express();
app.listen(80);
app.get('/image', function (req, res) {
    res.sendFile('arch.jpg',
        { maxAge: 24*60*60*1000,
            root: './views/'},
        function(err){
            if (err){
                console.log("Error");
            } else {
                console.log("Success");
            }
        });
});*/

/*
var express = require('express');
var url = require('url');
var app = express();
app.listen(80);
app.get('/image', function (req, res) {
    res.download('./views/arch.jpg',
        function(err){
            if (err){
                console.log("Error");
            } else {
                console.log("Success");
            }
        });
});*/

/*var express = require('express');
var url = require('url');
var app = express();
app.listen(80);
app.get('/google', function (req, res) {
    res.redirect('http://google.com');
});
app.get('/first', function (req, res) {
    res.redirect('/second');
});
app.get('/second', function (req, res) {
    res.send("Response from Second");
});
app.get('/level/A', function (req, res) {
    res.redirect("/level/B");
});
app.get('/level/B', function (req, res) {
    res.send("Response from Level B");
});*/

/*
 * 5.实现模板引擎
 *   使用模板文件和应用程序数据，借助模板引擎生成HTML
 *   使用template创建HTML，好处：简单和快速
 *   可用于Express的模板引擎：jade和内嵌的javascript(EJS)
 *       jade: 使用HTML的速记符号模板，不像HTML，但文件非常小，易于掌握
 *       EJS: 使用特殊的符号在正常的HTML文档中插入javascript，但文档复杂
 *   实现步骤：
 *      1.定义一个默认的模板引擎
 *            在view engine上进行设置
 *            将views设定设置为模板存放的位置
 *                  例如：var app = express(),
 *                       app.set('views', './views')
 *                       app.set('view engine', 'jade')
 *            为需要使用的模板扩展名注册模板引擎
 *                  app.engine('jade', require('jade').__express)
 *                  app.engine('ejs', require('ejs').__express)
 *                  'EJS'提供了renderFile实现使用其他扩展名注册ejs
 *                  app.engine('html', require('ejs').renderFile)
 *      2.加入本地对象 locals对象 -- 包含映射到模板中定义的变量名称的属性
 *                   可以通过app.locals指定本地变量
 *                   app.locals({title: 'My App'})
 *                   app.locals.title = 'My App';
 *      3.创建模板：可重用性 规模 层次
 *      4.在响应中呈现模板
 *        [定义模板引擎 -- 配置模板引擎 -- 创建模板 -- 呈现模板]
 *        使用Express app对象或者Response对象发送一个呈现后的模板
 *        对于Express app对象： 使用app.render(view, [locals], callback)
 *                             view指定views目录中的视图文件名
 *                             locals对象，允许传入local对象
 *                             callback 呈现后执行
 *        对于直接把模板呈现给响应：使用res.render() 原理和app.render()完全一样
 *                              在不需要在发送之前对数据做处理时可以使用res.render()
 *                              这样可以避免额外代码调用res.send()
 */
var express = require('express'),
    jade = require('jade'),
    ejs = require('ejs');
var app = express();
app.set('views', './views');
app.set('view engine', 'jade');
app.engine('jade', jade.__express);
app.engine('html', ejs.renderFile);
app.listen(80);
app.locals.uname='Neil';
app.locals.vehicle='Jeep';
app.locals.terrain='Mountains';
app.locals.climate='Desert';
app.locals.location='Unknown';

app.get('/jade', function(req, res){
    res.render('user_jade');
});
app.get('/ejs', function(req, res){
    app.render('user_ejs.html', function(err, renderedData){
        res.send(renderedData);
    });
});
