const UserModel=require('../model/authmodel');
const getuserbyid=async(req,res)=>{
    try {
        const getuser=await UserModel.findById(req.params.id).populate("followers").populate("following");
        if(!getuser)
        return res.status(400).json({message:"No user found"});
        const user=getuser.toObject();
        delete user.password;
        res.status(200).json({message:"Successfully get the user by id",user});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"internal server error"});
    }
}

const follow=async(req,res)=>{
try {
    // Update the user being followed
    const followedUser = await UserModel.findByIdAndUpdate(
        req.body.followId,
        { $push: { followers: req.user._id } },
        { new: true }
    );

    // Update the current user's following list
    const currentUser = await UserModel.findByIdAndUpdate(
        req.user._id,
        { $push: { following: req.body.followId } },
        { new: true }
    );

    res.json({ followedUser, currentUser });
} catch (error) {
    res.status(422).json({ error: error.message });
}
}
const unfollow=async(req,res)=>{
  
    try {
        // Update the user's followers list
        const unfollowedUser = await UserModel.findByIdAndUpdate(
            req.body.followId,
            { $pull: { followers: req.user._id } },
            { new: true }
        );
    
        // Update the current user's following list
        const currentUser = await UserModel.findByIdAndUpdate(
            req.user._id,
            { $pull: { following: req.body.followId } },
            { new: true }
        );
    
        res.json({ unfollowedUser, currentUser });
    } catch (error) {
        res.status(422).json({ error: error.message });
    }
    
}
const updatedetails=async(req,res)=>{ 
        try {
          //used usermodel and findby id is used for finding the user and update the user details by findbyid and update
          const { name,location,dateofbirth } = req.body;
          if(!name||!location||!dateofbirth){
            return res.status(400).json({message:"one or more fields are empty"});
        }
          const user = await UserModel.findById(req.user._id);
          const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, { name: name || user.name, location: location || user.location,dateofbirth:dateofbirth||user.dateofbirth}, { new: true });
         console.log(updatedUser);
          res.status(200).send({ success: true, message: "Profile Updated successfully", updatedUser });
        } catch (error) {
          console.log(error);
          res.status(400).send({ success: false, message: "Error while update profile", error });
        }
}
const uploadprofilepic=async(req,res)=>{
//    
try {
    const file = req.file;
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    const fileName = file.filename;
    // Save the file location to the user profile in the database
    //  const profilePicPath = `/uploads/${req.file.filename}`;
  
    // Replace the following line with your actual User model and filter criteria
    const user = await UserModel.findByIdAndUpdate( req.user._id, // Use req.user._id as the filter criteria
    { profile: fileName },
    { new: true }
    ).exec();
  
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
  
    res.status(200).json({ message: "Profile pic uploaded successfully", user });
  } catch (error) {
    console.error('Error during file upload or database operation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
}
const getall=async(req,res)=>{
    try {
        const {id}=req.params;
        const data= await UserModel.findById(id);
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send("Some Error Occured")
    }
}
module.exports={getuserbyid,follow,unfollow,updatedetails,uploadprofilepic,getall};