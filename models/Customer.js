const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    token: String
});

userSchema.methods.speak = function () {
    let greeting = this.name ? "name is " + this.name : "I don't have a name";
    console.log(greeting);
};

module.exports = mongoose.model('User', userSchema);

