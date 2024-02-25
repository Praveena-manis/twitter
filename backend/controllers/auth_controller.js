const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const SECRET=process.env.JWT_SECRET;
const UserModel=require('../model/authmodel');
const register=async(req,res)=>{
    try {
        const {name,username,email,password}=req.body;
        if(!name||!username||!email||!password){
          return res.status(400).json({message:"All the fields are mandatory"});
        }
        let user=await UserModel.findOne({$or:[{email},{username}]});
        if(user)
        return res.status(500).json({message:"EMail-ID or Username is already registered"});
        const hashedPassword=await bcrypt.hash(req.body.password,10)
        const newuser=new UserModel({name,username,email,password:hashedPassword})
        const resp=await newuser.save();
        res.status(200).json({message:"User Registered Successfully",resp});
    } catch (error) {
        console.log(error);
        res.status(401).json({message:"Internal Server Error"});  
    }
}
const login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email||!password){
            return res.status(400).json({message:"one or more fields are empty"});
        }
        const user=await UserModel.findOne({email});
        if(!user)
        return res.status(500).json({message:"Invalid Credentials"});
        const passwordMatch=await bcrypt.compare(password,user.password);
        if(passwordMatch){
            const jwtToken=jwt.sign({_id:user.id,},SECRET)
            const userInfo={"_id":user._id,"name":user.name,"username":user.username,"email":user.email,"password":user.password,"profile":user.profile,"location":user.location,"dateofbirth":user.dateofbirth}
            res.status(200).json({message:"Login Successfully",jwtToken,userInfo});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json("invalid Credentials");
    }
}
module.exports={register,login};