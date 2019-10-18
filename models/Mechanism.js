const mongoose = require('mongoose');

const mechanismSchema = new mongoose.Schema({
    mechanismName: String,
    mechanismCode: String,
    mechanismProvince: String,
    active: Number,//0, 1
    createDate: Date,
    updateDate: Date,
});

mechanismSchema.methods.getID = function () {// 此处只能使用function定义函数， Do not declare methods using ES6 arrow functions (=>).
    return {id: this._id}
};

mechanismSchema.methods.setInit = function () {// init 为自带方法，不能定义成 init
    this.active = 1;
    this.createDate = new Date();
};

module.exports = mongoose.model('Mechanism', mechanismSchema);
