const mongoose = require('mongoose');

const operationLogSchema = new mongoose.Schema({
    addTime: Date, //操作时间
    userId: String, //操作用户ID
    operations: String, //具体操作
    creditCardId: String, //信用卡id
});

operationLogSchema.methods.getID = function () {// 此处只能使用function定义函数， Do not declare methods using ES6 arrow functions (=>).
//    let greeting = this.name ? "name is " + this.name : "I don't have a name";
    return {id: this._id}
};

operationLogSchema.methods.setInit = function () {// init 为自带方法，不能定义成 init
    this.addTime = new Date();
};

module.exports = mongoose.model('operationHistory.js', operationLogSchema);
