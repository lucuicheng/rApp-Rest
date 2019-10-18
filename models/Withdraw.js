const mongoose = require('mongoose');

const withdrawSchema = new mongoose.Schema({
    partnerId: String,
    partnerPhone: String,
    applyTime: Date, //提现申请时间
    openBankCard: String, //开户行
    bandCardNo: String,//提现银行卡号
    realName: String,
    bandCardType: String, //提现银行类型
    withdrawTime: Date,//提现时间
    withdrawStatus: Number,//申请提现状态 1:审核状态中，2:审核状态（成功），3:审核状态（失败），
    applyWithdrawBalance: String,//申请提现金额
    status: Number, //数据状态
});

withdrawSchema.methods.getID = function () {// 此处只能使用function定义函数， Do not declare methods using ES6 arrow functions (=>).
//    let greeting = this.name ? "name is " + this.name : "I don't have a name";
    return {id: this._id}
};

withdrawSchema.methods.setInit = function () {// init 为自带方法，不能定义成 init
    this.status = 1;
    this.applyTime = new Date();
};

module.exports = mongoose.model('withdraw', withdrawSchema);
