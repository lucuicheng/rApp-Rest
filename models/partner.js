const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
    level: Number, //当前合伙人所处深度
    parentPhone: String, //上级用户系统
    addTime: Date, //注册时间
    updateTime: Date, //更新时间
    phone: String, //合伙人手机号码
    openid: String,  //授权绑定的微信id
    realName: String,//真实姓名
    nickname: String, //用户昵称
    sex: Number,
    city: String,
    password: String, //用户密码
    regIp: String, //注册ip
    status: Number, //账号状态[0:封号,1:正常]
    loginTimes: Number, //账号登录次数
    lastLoginIp: String, //最后登录IP
    lastLoginTime: Date, //最后登录时间
    headImg: String, //用户头像
    headimgurl: String, //微信头像
    roleId: Number, //角色[0:一级合伙人,1:非一级合伙人]
    organizationCode: String, //所属机构id
    organization: String, //所属机构名称
    organizationApplyStatus: Number, //机构当前审核状态 1，非机构用户（以有推荐合伙人），2（自由合伙人），3.机构用户审核中 4.机构审核未通过， 5.所属机构用户（已通过）
    balance: String, //奖励金额
    withdrawStatus: Number, //提现状态0：未申请提现 1：申请提现
    withdrawBalance: String, //提现金额
    linkUrl: String, //合伙人推广专属链接地址
    imageUrl: String, //合伙人推广二维码图片地址
});

partnerSchema.methods.getID = function () {// 此处只能使用function定义函数， Do not declare methods using ES6 arrow functions (=>).
//    let greeting = this.name ? "name is " + this.name : "I don't have a name";
    return {id: this._id}
};

partnerSchema.methods.setInit = function () {// init 为自带方法，不能定义成 init
    this.status = 1;
    this.password = 'enr:' + this.password;
    this.addTime = new Date();
};

partnerSchema.methods.encryption = function () {
    return 'enr:' + this.password
};

module.exports = mongoose.model('partner', partnerSchema);
