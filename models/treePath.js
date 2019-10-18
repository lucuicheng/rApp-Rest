const mongoose = require('mongoose');

const treePathSchema = new mongoose.Schema({
    ancPartnerPhone: String, //合伙人父祖先节patner_id
    desPartnerPhone: String, //合伙人子孙节点patner_id
    distance: Number, //两个节点之间的距离，自身节点时，距离为0
});

treePathSchema.methods.getID = function () {// 此处只能使用function定义函数， Do not declare methods using ES6 arrow functions (=>).
//    let greeting = this.name ? "name is " + this.name : "I don't have a name";
    return {id: this._id}
};

module.exports = mongoose.model('treePath', treePathSchema);
