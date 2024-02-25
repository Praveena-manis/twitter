const mongoose=require('mongoose');
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profile:{
        type:String,
    },
    location:{
        type:String,
    },
    dateofbirth:{
        type:Date,
    },
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserModel'
    }],
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserModel'
    }],
},{timestamps:true});
const UserModel=mongoose.model('UserModel',UserSchema);
module.exports=UserModel;