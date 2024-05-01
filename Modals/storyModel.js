const mongoose=require('mongoose');

const storySchema=new mongoose.Schema({
    id:{
        type:Number,
        unique:true,
    },
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    image_url:{
        type:String,
    },
    creation_time:{
        type:Date,
        default:Date.now()
    },
    created_by:{
        type:String,
        default:"user"
    },
    user_id:{
        type:Number,
      
    },
    likecount:{
        type:Number,
        default:0
    }
})


///For user Schema
const userSchema=new mongoose.Schema({
    id:{
        type:Number,
        unique:true,
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    bookmarkData:{
        type:Object
    },
    likedStoryData:{
        type:Object
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

const Story=mongoose.model('Story',storySchema);
const User=mongoose.model('User',userSchema);
module.exports={Story,User};