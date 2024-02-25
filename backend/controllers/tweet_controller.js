const TweetModel = require('../model/tweetmodel');
const UserModel = require('../model/authmodel');
const getalltweets = async (req, res) => {
    try {
        const tweets = await TweetModel.find({})
            .populate('tweetedBy', 'password') // Exclude password field
            .populate({ path: 'author', populate: { path: 'name' } })
            .populate({
                path: 'replies',
                populate: {
                    path: 'tweetedBy',
                    select: 'password', // Exclude password field
                },
            })
            .populate({
                path: 'comments.commentedBy',
                model: 'UserModel',
                select: 'name'  // Populate only the 'name' field of the 'commentedBy' user
            })
            .sort({ createdAt: -1 })
            .exec();
        res.status(200).json({ message: "get all tweets successfully", tweets });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const getusertweets = async (req, res) => {
    try {
        const { userId } = req.user.id;
        const tweets = await TweetModel.find({ tweetedBy: userId })
            .populate("tweetedBy", "_id name")
            .populate("comments.commentedBy", "_id name")
            .sort({ createdAt: 'desc' })
            .exec();
        res.status(200).json(tweets);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const usertweets = async (req, res) => {
    try {
        const { userId } = req.params.id;
        const tweets = await TweetModel.find(userId)
            .populate("tweetedBy", "_id name")
            .populate({
                path: 'comments.commentedBy',
                model: 'UserModel',
                select: 'name'  // Populate only the 'name' field of the 'commentedBy' user
            })
            .sort({ createdAt: 'desc' })
            .exec();
            console.log(tweets)
        res.status(200).json(tweets);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const createtweets = async (req, res) => {

    try {
        const { content } = req.body;

        // Check if the request contains files (images)
        if (!req.file) {
            // If no image is provided, create a tweet with text only
            const tweet = new TweetModel({ content, author: req.user })
            await tweet.save();
            //   console.log(tweet);
            res.status(200).json({ message: "New Tweet Successfully Added without image", tweet });
        } else {
            const file = req.file;
            console.log(file);
            if (!file) {
                return res.status(400).json({ message: 'No image in the request' });
            }
            const fileName = file.filename;
            const path = __basedir + `/uploads/${fileName}`;
            const tweet = new TweetModel({ content, image: fileName, author: req.user })
            await tweet.save();
            console.log(tweet);
            res.status(200).json({ message: "New Tweet Successfully Added", tweet });

        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const like = async (req, res) => {
    const tweetId = req.body.postId;
    const userId = req.user._id;

    const existingTweet = await TweetModel.findById(tweetId);

    if (!existingTweet) {
        return res.status(404).json({ message: 'Tweet not found' });
    }
    if (existingTweet.author.toString() === userId.toString()) {
        return res.status(400).json({ message: 'You cannot like your own post' });
    }
    // Check if the user has already liked the tweet
    const userLiked = existingTweet.likes.includes(userId);

    if (!userLiked) {
        // User has not liked the tweet, add like
        const updatedTweet = await TweetModel.findByIdAndUpdate(
            tweetId,
            { $push: { likes: userId } },
            { new: true }
        ).populate("author", "_id name").exec();

        res.status(200).json({ message: "Tweet liked successfully", updatedTweet });
    } else {
        // User has already liked the tweet, remove like (unlike)
        const updatedTweet = await TweetModel.findByIdAndUpdate(
            tweetId,
            { $pull: { likes: userId } },
            { new: true }
        ).populate("author", "_id name").exec();

        res.status(200).json({ message: "Tweet unliked successfully", updatedTweet });
    }
}

const comment = async (req, res) => {
    const userId = req.user._id;
    try {
        const comment = { commentText: req.body.commentText, commentedBy: userId };
        console.log(comment);
        const resp = await TweetModel.findByIdAndUpdate(req.body.postId, { $push: { comments: comment } }, { new: true })
            .populate("author", "_id name")
            .populate({
                path: 'comments.commentedBy',
                model: 'UserModel',
                select: 'name'  // Populate only the 'name' field of the 'commentedBy' user
            })
            .sort({ 'comments.commentedAt': 'desc' })
            .exec();
        if (!resp) {
            return res.status(400).json({ message: "No Post found" });
        }
        resp.comments.sort((a, b) => b.commentedAt - a.commentedAt);
        console.log(resp);
        res.status(200).json(resp)
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const reply = async (req, res) => {

    const { content } = req.body;
    const { id } = req.params;

    try {
        const tweet = await TweetModel.findById(id);

        if (!tweet) {
            return res.status(404).json({ message: 'Tweet not found' });
        }

        const newReply = {
            replyId: mongoose.Types.ObjectId().toString(),
            content,
            author: {
                userId: req.user._id,
                username: req.user.username,
                displayName: req.user.displayName,
            },
        };

        tweet.replies.push(newReply);

        await tweet.save();

        res.status(201).json(newReply);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

// const getsingletweet=async(req,res)=>{
//     const {id}=req.params;
//     try {
//         const tweet=await TweetModel.findById(id).populate('tweetedBy','password').populate({path:'replies',populate:{path:'tweetedBy',select:'-password'}})
//         .exec();
//         if(!tweet){
//             return res.status(404).json({message:'Tweet not found'});
//         }
//         res.json(tweet);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({message:"Internal Server error"});

//     }
// }
const deletetweet = async (req, res) => {
    const { id } = req.params;
    try {
        const resp = await TweetModel.findByIdAndDelete(id).populate('author', '_id name')
        if (!resp) {
            return res.status(400).json({ error: "Post does not exist" });
        }
        res.status(200).json({ message: 'Tweet deleted Successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });

    }
}
const retweet = async (req, res) => {
    const userId = req.user.id;
    console.log(userId);
    const tweetId = req.params.id;
    console.log(tweetId);
    try {
        const existingTweet = await TweetModel.findById(tweetId);
        if (!existingTweet) {
            return res.status(404).json({ message: 'Tweet not found' });
        }
        const userLiked = existingTweet.retweets.includes(userId);

        if (userLiked) {
            // User has not liked the tweet, add like

            const updatedTweet = await TweetModel.findByIdAndUpdate(
                tweetId,
                { $push: { retweets: userId } },
                { new: true }
            ).populate("author", "_id name").exec();

            res.status(200).json({ message: "ReTweeted successfully", updatedTweet });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server error" });
    }
}
module.exports = { getalltweets, createtweets, usertweets, like, comment, reply, deletetweet, retweet, getusertweets };