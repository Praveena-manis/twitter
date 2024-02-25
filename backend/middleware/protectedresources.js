const jwt=require('jsonwebtoken');
const SECRET=process.env.JWT_SECRET;
const mongoose=require('mongoose');
const UserModel=mongoose.model('UserModel');
const authorization=async(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    if(!authHeader){
        return res.status(401).json({message:"Unauthorized"});
    }
    const token=authHeader.replace('Bearer ','');
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }
    try{
        const decoded=jwt.verify(token,SECRET);
        const user=await UserModel.findById({_id:decoded._id},{password:0});
        const userInfo={"_id":user._id,"name":user.name,"username":user.username,"email":user.email,"password":user.password,"profile":user.profile,"location":user.location,"dateofbirth":user.dateofbirth}
        console.log(user);
        if(!user)
        return res.status(401).json({message:"Unauthorized"});
        req.user=user;
        req.userInfo=userInfo;
        next();
    }catch(error){
        console.log(error);
        return res.status(401).json({message:"Unauthorized"});
    }
}
module.exports={authorization};