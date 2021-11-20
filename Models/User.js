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
  },
  refreshToken:{
    type:String
  }
},{timestamp:true});


module.exports = mongoose.model('user',userSchema);
