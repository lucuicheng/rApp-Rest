const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    addTime: Date, //注册时间
    updateTime: Date, //更新时间
    phone: String, //手机号码
    password: String, //用户密码
    status: Number, //账号状态[0:封号,1:正常]
    loginTimes: Number, //账号登录次数
    lastLoginTime: Date, //最后登录时间
    roleId: Number, //角色[1:管理员（审批成功）,2:机构管理员（已通过）,3: 客服管理员（已通过），4: 机构管理员正在审核中, 5: 客服人员正在审核中，6：机构管理员未通过审核，7，客服人员未通过审核]
    applyAdminDate: Date, //申请成功管理员名称
    organizationCode: String, //所属机构id
    organization: String, //所属机构名称
});

adminSchema.methods.getID = function () {// 此处只能使用function定义函数， Do not declare methods using ES6 arrow functions (=>).
//    let greeting = this.name ? "name is " + this.name : "I don't have a name";
    return {id: this._id}
};

adminSchema.methods.setInit = function () {// init 为自带方法，不能定义成 init
    this.status = 1;
    this.password = 'enr:' + this.password;
    this.addTime = new Date();
};

adminSchema.methods.encryption = function () {
    return 'enr:' + this.password
};

module.exports = mongoose.model('administrators', adminSchema);
