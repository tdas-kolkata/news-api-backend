const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique:true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  cellno:{
      type:String,
      required:true,
      unique:true
  }
},{timestamp:true});


module.exports = mongoose.model('user',userSchema);
