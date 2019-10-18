const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    appId: String,
    name: String, //申请人
    mobilePhone: String, //办卡人手机号
    firstCard: String, //Y: 一卡 N: 二卡
    cardType: String,
    partnerName: String,
    linkRefereePhone: String, //linkRefereePhone 推荐人手机号
    active: Number,//0, 1
    state: Number, //0：申请失败  1：申请成功  2：审批成功  3：审批失败
    time: String, //办卡时间
    createDate: Date, //订单创建时间
});

recordSchema.methods.getID = function () {// 此处只能使用function定义函数， Do not declare methods using ES6 arrow functions (=>).
//    let greeting = this.name ? "name is " + this.name : "I don't have a name";
    return {id: this._id}
};

recordSchema.methods.setInit = function () {// init 为自带方法，不能定义成 init
    this.active = 1;
    this.createDate = new Date();
};
module.exports = mongoose.model('Record', recordSchema);

