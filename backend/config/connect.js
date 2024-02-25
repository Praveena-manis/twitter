const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("Connected"))
.catch((error)=>console.log("Error in Connection:"+error))