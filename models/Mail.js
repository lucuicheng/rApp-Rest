const mongoose = require('mongoose');

const mailSchema = new mongoose.Schema({
    addTime: Date, //生成时间
    updateTime: Date, //更新时间
    partnerId: String, //提交站内信合伙人id
    partnerPhone: String, //提交站内信合伙人手机号
    context: String, //留言内容
    reContext: String, //（客服，admin）回复留言
    returnState: Number, //0：未回复 1：已回复
    returnDate: Date, //回复日期
    status: Number, //0: 作废数据， 1：正常数据
});

mailSchema.methods.getID = function () {// 此处只能使用function定义函数， Do not declare methods using ES6 arrow functions (=>).
//    let greeting = this.name ? "name is " + this.name : "I don't have a name";
    return {id: this._id}
};

mailSchema.methods.setInit = function () {// init 为自带方法，不能定义成 init
    this.status = 1;
    this.returnState = 0;
    this.addTime = new Date();
};

module.exports = mongoose.model('mail', mailSchema);
