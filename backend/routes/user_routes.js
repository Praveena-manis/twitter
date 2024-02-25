const express=require('express');
const {getuserbyid,follow,unfollow, updatedetails, uploadprofilepic,getall}=require('../controllers/user_controller');
const {createtweets,getusertweets } = require('../controllers/tweet_controller');
const {authorization}=require('../middleware/protectedresources');
const router=express.Router();
const upload=require('../middleware/fileupload');
const path=require('path');
const __basedir=path.resolve();
router.get('/download/:filename', (req, res) => {
    const fileName = req.params.filename;
    const path = __basedir + "/uploads/";
    res.download(path + fileName, (error) => {
        if (error) {
            res.status(500).send({ message: "File cannot be downloaded " + error })
        }
    })
});
router.post("/createtweets",authorization,upload.single('image'),createtweets);
router.put("/uploadprofile",authorization,upload.single('profile'),uploadprofilepic); 
router.get("/user/:id",authorization,getuserbyid);
router.get("/:id/getall",authorization,getall);
router.put("/follow",authorization,follow);
router.put("/unfollow",authorization,unfollow);
router.put("/updatedetails",authorization,updatedetails);
router.get("/getusertweets",authorization,getusertweets);

module.exports=router;