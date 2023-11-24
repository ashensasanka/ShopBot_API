const mongoose = require('mongoose');

const UserDeatilsSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: {type: String, unique: true},
    password: String,
    address: String,
},{
    collection:"UserInfo",
});

mongoose.model('UserInfo', UserDeatilsSchema);