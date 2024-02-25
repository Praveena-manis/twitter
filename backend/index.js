const express=require("express");
const cors=require('cors');
const path=require('path');
const dotenv=require('dotenv');
require('./config/connect');
dotenv.config();
const app=express();
global.__basedir=__dirname;
const port=process.env.PORT||5500;
app.use(express.json());
app.use(cors());
app.get('/',(req,res)=>{
    res.send("its working");
})
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use('/api/v1/auth',require('./routes/auth_routes'));
app.use('/api/v1/user',require('./routes/user_routes'));
app.use('/api/v1/tweet',require('./routes/tweet_routes'));
//app.use(require('./routes/file_routes'));
app.listen(port,()=>{
console.log(`Server started:${port}`);
})

