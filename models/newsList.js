const mongoose = require('mongoose');

const newsListSchema = new mongoose.Schema({
    title: String, //标题
    content: String, //内容
    imgUrl: String, //图片
    linkUrl: String, //广告链接
    status: Number, //状态1：正常 0 作废
    createTime: Date, //创建日期
    updateTime: Date, //创建日期
});

newsListSchema.methods.getID = function () {// 此处只能使用function定义函数， Do not declare methods using ES6 arrow functions (=>).
//    let greeting = this.name ? "name is " + this.name : "I don't have a name";
    return {id: this._id}
};

newsListSchema.methods.setInit = function () {// init 为自带方法，不能定义成 init
    this.status = 1;
    this.createTime = new Date();
};

module.exports = mongoose.model('newsList', newsListSchema);
