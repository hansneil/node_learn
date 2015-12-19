/*
 * 中间件
 * app.method(path, [middleware, ...], callback)
 *                     |___________即为中间件，完成绝大部分功能
 * 执行时间：中间件在收到请求的时点和发送响应的时点之间执行
 * 框架提供：connect模块
 * 实现功能：快速提供静态文件，实现cookie， 支持会话， 处理POST数据， 创建自定义中间件函数
 */

/*
 * 1.Express支持的中间件组件
 *   static: 允许Express服务器流式处理静态文件的GET请求 -- express.static()访问
 *   express-logger: 实现一个格式化的请求记录器来跟踪对服务器的请求
 *   basic-auth-connect: 提供对基本的HTTP身份验证的支持
 *   cookie-parse: 可以从请求读取cookie并在响应中设置cookie
 *   cookie-session：提供基于cookie的会话支持
 *   express-session: 提供相当强大的会话实现
 *   body-parser: 把POST请求正文中的JSON事件解析为req.body属性
 *   compression: 对发给客户端的大响应提供Gzip压缩支持
 *   csurf: 提供跨站点请求伪造保护
 *
 *   使用： 可以对特定路径下的所有路由全局应用中间件
 *         也可以对一个特定的路由应用中间件
 *         [在全局范围内把中间件分配给某个路径]
 *              使用use方法：use([path], middleware)
 *                         middleware: function(req, res, next)--下一个要执行的中间件函数
 *                         每一个中间件组件都有一个构造函数返回相应中间件功能
 *              var express = require('express');
 *              var bodyParser = require('body-parser');
 *              var app = express();
 *              app.use('/', bodyParser());
 *         [把中间件分配给单个路由]
 *              app.get('/parsedRoute', bodyParser(), function(req, res){
 *              });
 *         [添加多个中间件函数]：可以分配任意多的中间件函数
 *              app.use('/', bodyParser()).use('/', cookieParser()).use('/', session());
 *              分配函数的瞬间即为在请求中被应用的顺序
 */

/*
 * 2.使用query中间件
 *   query中间件：将一个查询字符串从url转换为javascript对象
 *   并将其保存为request对象query属性
 *   此功能在4.x中已经内置请求解析器中存在，不需要中间件了
 */

/*var express = require('express');
var http = require('http');
var app = express();
http.createServer(app).listen(80);
app.get('/', function(req, res){
    var id = req.query.id;
    var score = req.query.score;
    console.log(id);
    console.log(JSON.stringify(req.query));
    res.send('done');
});*/

/*
 * 3.提供静态文件服务
 *   static -- 常用的中间件，可以直接从磁盘对客户端提供静态文件
 *             支持的文件：javascript文件、CSS文件、
 *                       图像文件、HTML文件
 *   express.static(path, [options])
 *            -- path 在请求中引用的静态文件所在的根路径
 *            -- options: maxAge[最长保存时间] hidden[启用隐藏文件传输功能]
 *                        redirect[如果请求路径是目录，则被重定向到有一个尾随/的路径]
 *                        index[根路径的默认文件名]
 */

/*
var express = require('express'),
    app = express();
app.use('/', express.static('./static', {maxAge: 60*60*1000}));
app.use('/image', express.static('./images'));  //相当于一个映射，将本地的images目录映射为image
app.listen(80);*/

/*
 * 4.处理POST正文数据
 *   body-parser -- 处理POST请求正文中的数据
 *                  POST请求正文内容：POST参数字符串
 *                                  JSON字符串
 *                                  原始数据
 *   body-parser将请求正文格式化为request对象的req.body属性
 *   但是目前在express中已经删除了bodyParser，可以使用require('body-parser').urlencoded()代替
 */

/*var express = require('express'),
    bodyParser = require('body-parser'),
    app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.get('/', function(req, res){
    var response = '<form method="post">'+
            'First: <input type="text" name="first"><br>' +
            'Last: <input type="text" name="last"><br>' +
            '<input type="submit" value="Submit"></form>';
    res.type('html');
    res.end(response);
});
app.post('/', function(req, res){
   var response = '<form method="post">'+
       'First: <input type="text" name="first"><br>' +
       'Last: <input type="text" name="last"><br>' +
       '<input type="submit" value="Submit"></form>' +
       '<h1>Hello ' + req.body.first + '</h1>';
    res.type('html');
    res.end(response);
    console.log(req.body);
});
app.listen(80);*/

/*
 * 5.发送和接收cookie
 *   接收cookie
 *      cookie-parser -- 处理cookie，转换成js对象存储在req.cookie中
 *      express.cookie-parser([secret])
 *      secret: 在cookie内部签署来防止cookie被篡改
 *   发送cookie
 *      res.cookie(name, value, [options])
 *      options: maxAge httpOnly[true:只能被服务器访问] signed [true:将被签署，并需要通过req.signedCookie访问]
 *               path: cookie应用的路径
 *   删除cookie res.clearCookie()
 */

/*
var express = require('express'),
    cookieParser = require('cookie-parser'),
    app = express();
app.use(cookieParser());
app.get('/', function(req, res){
    console.log(req.cookies);
    if (!req.cookies.hasVisited) {
        res.cookie('hasVisited', '1',
                { maxAge: 60*60*1000,
                  httpOnly: true,
                  path:'/'
                });
    }
    res.send('sending cookie');
});
app.listen(80);*/

/*
 * 6.实现会话
 *   cookie-session会话需要cookie-parser中间件 [提供了基本的会话支持]
 *   添加cookie-session中间件的语法：
 *          res.cookie([options])
 *          key: 标识会话的cookie名称
 *          secret: 用来签署会话的cookie字符串
 *          cookie：一个对象，定义了cookie的设置[maxAge,path,httpOnly,signed]
 *          proxy: 设置true将导致信任反向代理
 *   会话存储在req.session对象中，当做出任何修改时都会跨越来自同一个浏览器的多个请求流动
 */

/*
var express= require('express'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    app = express();
app.use(cookieParser());
app.use(cookieSession({secret: 'MAGICALEXPRESSKEYII'}));
app.get('/libraries', function(req, res){
    console.log(req.cookies);
    if (req.session.restricted) {
        res.send('You have been in the restricted section ' +
            req.session.restrictedCount + ' times.');
    } else {
        res.send('Welcome to the Library');
    }
});
app.get('/restricted', function(req, res){
    req.session.restricted = true;
    if (!req.session.restrictedCount) {
        req.session.restrictedCount = 1;
    } else {
        req.session.restrictedCount += 1;
    };
    res.redirect('/libraries');
});
app.listen(80);*/

/*
 * 7.基本的HTTP身份验证
 *   使用Authorization标头从浏览器向服务器发送编码后的用户名和密码
 *   如果没有存储URL的授权信息，自动启动基本登录对话框
 *   [适合需要最低限度身份验证的基本网站]
 *   中间件函数：basic-auth-connect
 *   语法：var basicAuth = require('basic-auth-connect')
 *        app.use(basicAuth(function(user, password){
 *            return (user === 'testuser' && pass === 'test');
 *        }));
 */

//全局范围内实现基本的HTTP身份验证
/*
var express = require('express'),
    basicAuth = require('basic-auth-connect'),
    app = express();
app.listen(80);
app.use(basicAuth(function(user, pass){
    return (user === 'testuser' && pass === 'test');
}));
app.get('/', function(req, res){
    res.send('Successful Authentication');
});*/

//为单独的路由实现基本的HTTP身份验证
/*
var express = require('express'),
    basicAuth = require('basic-auth-connect'),
    app = express();
var auth = basicAuth(function(user, pass) {
    return (user === 'neil' && pass === '111');
});
app.get('/library', function(req, res) {
    res.send('Welcome to Library');
});
app.get('/restricted', auth, function(req, res) {
   res.send('Welcome to the restricted section');
});

app.listen(80);*/

/*
 * 8.实现会话身份验证
 *   基本的HTTP身份验证缺点：只要证书被存储，登录就一直存在
 *   更好的实现：实现自己的身份验证机制，并将其存储在一个可以随意使其过期的会话中
 *
 *   中间件：session 附加一个req.session到request对象中来提供会话功能
 *          在res.session上调用的方法：
 *              regenerate([callback]) 移除并创建一个新的req.session对象，让你重置会话
 *              destroy([callback]) 移除req.session对象
 *              save([callback]) 保存会话数据
 *              touch([callback]) 为会话cookie重置maxAge计数
 *              cookie 指定把会话链接到浏览器的cookie对象
 */

/*var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var crypto = require('crypto');
function hashPW(pwd){
    return crypto.createHash('sha256').update(pwd).
    digest('base64').toString();
}
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser('MAGICString'));
app.use(session());
app.get('/restricted', function(req, res){
    if (req.session.user) {
        res.send('<h2>'+ req.session.success + '</h2>' +
            '<p>You have entered the restricted section<p><br>' +
            ' <a href="/logout">logout</a>');
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
});
app.get('/logout', function(req, res){
    req.session.destroy(function(){
        res.redirect('/login');
    });
});
app.get('/login', function(req, res){
    var response = '<form method="POST">' +
        'Username: <input type="text" name="username"><br>' +
        'Password: <input type="password" name="password"><br>' +
        '<input type="submit" value="Submit"></form>';
    if(req.session.user){
        res.redirect('/restricted');
    }else if(req.session.error){
        response +='<h2>' + req.session.error + '<h2>';
    }
    res.type('html');
    res.send(response);
});
app.post('/login', function(req, res){
    //user should be a lookup of req.body.username in database
    var user = {name:req.body.username, password:hashPW("myPass")};
    if (user.password === hashPW(req.body.password.toString())) {
        req.session.regenerate(function(){
            req.session.user = user;
            req.session.success = 'Authenticated as ' + user.name;
            res.redirect('/restricted');
        });
    } else {
        req.session.regenerate(function(){
            req.session.error = 'Authentication failed.';
            res.redirect('/restricted');
        });
    }
});
app.listen(80);*/

/*
 * 9.实现自定义中间件
 *   十分容易，提供一个接受request对象为第一个参数
 *                  接受response对象为第二个参数
 *                  接受next函数作为第三个参数
 */

var express = require('express');
var app = express();
function queryRemover(req, res, next) {
    console.log('\nBefore URL: ');
    console.log(req.url);
    req.url = req.url.split('?')[0];
    console.log('\nAfter URL: ');
    console.log(req.url);
    next();
}
app.use(queryRemover);
app.get('/no/query', function(req, res){
    res.send('test');
});
app.listen(80);