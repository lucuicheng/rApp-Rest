const Router = require('koa-router'),
    KoaBody = require('koa-body'),
    {getId, list, createItem, updateItem, removeItem} = require('../controllers/indexController');

const tt = async (ctx, next) => {
    try {
        // get请求跳过不记录操作日志
        if (ctx.method === 'GET') {
            console.log('ds')
            await next()
        } else {
            // 建立全局对象用于中间价与mongoose传递参数
            if (!global.userLogs) global.userLogs = {}
            // 区分每次请求用到了 请求方法+url 作为key (我们用的restfull风格)
            const _logctx = ctx.method + '_' + ctx.url
            // 在全局变量中 添加该属性
            global.userLogs[_logctx] = {
                url: ctx.url,
                method: ctx.method,
                ip: ctx.ip,
                beforeData: '',
                afterData: '',
                time: Math.floor(new Date().getTime() / 1000)
            }
            await next()
            // 打印需要处理的数据（这里是保存等操作）
            console.log(global.userLogs[_logctx])
        }
    } catch (error) {
        console.log(error)
    }
}

const router = new Router();

router
    .get('/users', tt, list)
    .get('/users/:id', getId)
    .post('/users/', KoaBody(), createItem)
    .put('/users/:id', KoaBody(), updateItem)
    .delete('/users/:id', removeItem);

module.exports = {
    routes() {
        return router.routes()
    },
    allowedMethods() {
        return router.allowedMethods()
    }
}
