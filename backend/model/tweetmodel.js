const mongoose=require('mongoose');
const tweetSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true,
        trim:true,
        maxlength:250
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserModel",
    },
    tweetedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
      },
  isRetweeted: { type: Boolean, default: false },
    likes:[{
       
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserModel",
    },],
    retweets: [{
      // userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "UserModel"
      // },
      // name: {
      //     type: mongoose.Schema.Types.ObjectId,
      //     ref:"UserModel"
      // }
  }],
    // comments:[
    //     {
    //         commentText:{type:String},
    //         commentedBy:{type:mongoose.Schema.Types.ObjectId,ref:"UserModel"},
    //         commentedAt:{type:Date,default:Date.now,timestamps:true},
    //     },
    // ],
    comments: [
        {
          commentText: {
            type: String,
            required: true,
          },
          commentedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserModel',
          },
          commentedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    replies:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"TweetModel",
    }],
    image:{
        type:String,
        default:'',
    },
},{
    timestamps:true,
})
const TweetModel=mongoose.model('TweetModel',tweetSchema);
module.exports=TweetModel;