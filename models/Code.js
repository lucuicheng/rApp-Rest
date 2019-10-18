const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    role: Number,//0 ,1, 2
    weChatID: String,
    weChatName: String,
    mechanismCode: String,//10001 start
    mechanism: mongoose.Mixed,
    auth: Number,
    password: String,
    token: String,
    active: Number,//0, 1
    createDate: Date,
    modifyDate: Date,
    bindDate: Date,
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


module.exports = mongoose.model('User', userSchema);

