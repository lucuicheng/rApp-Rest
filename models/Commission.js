const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
    firstLevel: String, //一级返佣
    secondLevel: String, //二级返佣
    organizationCode: String, //所属机构id
    organization: String, //所属机构名称
    applyStatus: Number,// 审核状态： ，1： 正在审核中， 2审核通过。3审核（未通过）4未提交
    status: Number,
    addTime: Date,
    updateTime: Date,
});

commissionSchema.methods.getID = function () {// 此处只能使用function定义函数， Do not declare methods using ES6 arrow functions (=>).
//    let greeting = this.name ? "name is " + this.name : "I don't have a name";
    return {id: this._id}
};

commissionSchema.methods.setInit = function () {// init 为自带方法，不能定义成 init
    this.status = 1;
    this.addTime = new Date();
};

module.exports = mongoose.model('commission', commissionSchema);
