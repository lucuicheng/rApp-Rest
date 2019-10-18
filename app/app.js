const http = require('http'),
    Koa = require('koa'),
    config = require('config'),
    err = require('./helpers/error'),
    mongoose = require("mongoose"),//使用 mongoose 操作数据库
    {routes, allowedMethods} = require('./routes'),
    app = new Koa();

app.use(err);
app.use(routes());
app.use(allowedMethods());

const connectMongoDB = () => {
    console.log('connecting mongodb...');
    const dbUrl = process.env.MONGO_URL || 'mongodb://192.168.0.100:27017/TA';//数据库地址//TODO 统一使用配置文件中的类
    mongoose.connect(dbUrl, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true});//尝试连接数据库
    const db = mongoose.connection;
    db.on('open', function (res) {
        console.log(' mongodb connected successful!');
    });
    db.once('error', function (error) {
        console.log(' mongodb database connect failed ' + error);
    });

    return db;
};

const server = http.createServer(app.callback()).listen(config.server.port, function () {
    console.log('%s listening at port %d', config.app.name, config.server.port);
    connectMongoDB();
});

module.exports = {
    closeServer() {
        server.close();
    }
};
