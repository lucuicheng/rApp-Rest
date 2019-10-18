const mongoose = require('mongoose');

const posterSchema = new mongoose.Schema({
    posterName: String, //海报名称
    introduce: String, //介绍
    imgUrl: String, //图片
    status: Number, //状态1：正常 0 作废
    createTime: Date, //创建日期
    updateTime: Date, //创建日期
});

posterSchema.methods.getID = function () {// 此处只能使用function定义函数， Do not declare methods using ES6 arrow functions (=>).
//    let greeting = this.name ? "name is " + this.name : "I don't have a name";
    return {id: this._id}
};

posterSchema.methods.setInit = function () {// init 为自带方法，不能定义成 init
    this.status = 1;
    this.createTime = new Date();
};

module.exports = mongoose.model('poster', posterSchema);
