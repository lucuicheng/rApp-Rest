const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    addTime: String, //操作时间
    updateTime: String, //更新时间
    dispatchSign: String, //派单标识
    linkUrl: String, //推广链接URL
    enterPage: String, //入口页面
    detail: String, //详情
    clickCount: Number, //点击次数
    attentionNum: Number, //引进用户数
    rechargeMoney: Number, //总充值金额 单位分
    shareMoney: Number, //已分润充值金额 单位分
    successOrderCount: Number, //成功订单数
    closeOrderCount: Number, //关闭订单数
    rate: String, //完成率%
    customerId: Number, //被获取到的推广链接对应用户id
});

userSchema.methods.getID = function () {// 此处只能使用function定义函数， Do not declare methods using ES6 arrow functions (=>).
//    let greeting = this.name ? "name is " + this.name : "I don't have a name";
    return {id: this._id}
};

userSchema.methods.setInit = function () {// init 为自带方法，不能定义成 init
    this.active = 1;
    this.password = 'enr:' + this.password;
    this.createDate = new Date();
};

userSchema.methods.encryption = function () {
    return 'enr:' + this.password
};


module.exports = mongoose.model('promoteLink', userSchema);
