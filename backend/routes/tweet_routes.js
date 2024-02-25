const express=require('express');
const {authorization}=require('../middleware/protectedresources');
const { createtweets, like,  reply, usertweets, getalltweets, deletetweet, retweet, comment, getusertweets } = require('../controllers/tweet_controller');
const router=express.Router();
router.put("/like",authorization,like);
router.put("/comment",authorization,comment);
router.put("/:id/reply",authorization,reply);
router.get("/:id/usertweets",authorization,usertweets);
router.get("/getusertweets",authorization,getusertweets)
router.get('/',authorization,getalltweets);
router.delete('/delete/:id',authorization,deletetweet);
router.post('/retweet/:id',authorization,retweet);
module.exports=router;