const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { Story, User } = require('../backend/Modals/storyModel');





////Database Connection

mongoose.connect('mongodb+srv://simranthakur:Blueberry123@cluster0.mohhrpw.mongodb.net/webstory').then(() => {
    console.log('db connection successful');
});

app.use(express.json());
app.use(cors());


//API CREATION
app.get("/", (req, res) => {
    res.send("Express App is running")
})
/////////////Creating API for adding story
app.post('/addStory', async (req, res) => {
    try {
        let stories = await Story.find({}).exec();
        let id = stories.length > 0 ? stories.length + 1 : 1;
        const newStory = await Story.create({ ...req.body, id: id });

        res.status(201).json({
            status: 'success',
            data: {
                newStory
            }
        })
    } catch (err) {
        console.log(err);
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
})

/////Creating API for getting all the stories
app.get("/allstories", async (req, res) => {
    try {
        const stories = await Story.find();
        res.status(201).json({
            status: "success",
            result: stories.length,
            data: {

                stories
            }
        })
    } catch (err) {
        console.log(err);
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
})
////Creating api for adding story
const fetchUser = async (req, res, next) => {
    try {
     
        const token = req.header("auth-token");
        // console.log(token,"auth");
        if (!token) {
            return res.status(401).json({
                message: "Please authenticate using a valid token"
            });
        }

        const data = jwt.verify(token, 'secret_ecom');
        // console.log(data,"dataatttt");
        req.user = data;
        // console.log(data.user);
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 'failed',
            message: 'Internal server error'
        });
    }
};

app.post("/userstories", fetchUser, async (req, res) => {
    try{
        let  story= await Story.find({}).exec();
        let count=1;
        let data=[];
        let val=req.body;
        for(let value of val){
            data.push({
                name:value.story.Heading,
                description:value.story.Description,
                image_url:value.story.Image,
                category:val[0].story.Category,
                user_id:req.user.id,
                creation_time:Date.now(),
                id:story.length+count
            })
            count++;
        }
        console.log(data,"datttttt");
    const mystory = await Story.create(data);
      res.status(200).json({
        status:"success",
        data:{
            mystory
        }
      })
    console.log(req.body);
    }catch(err){
        console.log(err);
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
})

//creating api for getting user story



app.get("/mystory", fetchUser, async (req, res) => {
    try {
        const userStory = await Story.find({ user_id: req.user.id });
        const story = await Story.distinct('creation_time', { user_id: req.user.id });
        
console.log(story,"story");
       
        let topstory_ids = [];
        for (const creation_time of story) {
            const topstory = await Story.findOne({creation_time});
            if (topstory) {
                topstory_ids.push(topstory);
            }
        }
        res.status(200).json({
            status: "success",
            data: {
                topstory_ids
            }
        });
    }
    catch (err) {
        console.log(err);
        res.status(404).json({
            status: 'failed',
            message: "All fields are required."
        })
    }
})

///Creating Api for all the filters

app.get('/getmovies', async (req, res) => {
    try {
        const moviestories = await Story.find().where('category').equals("movie").where('created_by').equals('admin');
        res.status(201).json({
            status: "success",
            result: moviestories.length,
            data: {
                moviestories
            }
        })
    } catch (err) {
        console.log(err);
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
})

app.get('/getfood', async (req, res) => {
    try {
        const foodstories = await Story.find().where('category').equals("food").where('created_by').equals('admin');
        res.status(201).json({
            status: "success",
            result: foodstories.length,
            data: {
                foodstories
            }
        })
    } catch (err) {
        console.log(err);
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
})

app.get('/geteducation', async (req, res) => {
    try {
        const educationstories = await Story.find().where('category').equals("education").where('created_by').equals('admin');
        res.status(201).json({
            status: "success",
            result: educationstories.length,
            data: {
                educationstories
            }
        })
    } catch (err) {
        console.log(err);
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
})

app.get('/gethealth', async (req, res) => {
    try {
        const healthstories = await Story.find().where('category').equals("health and fitness").where('created_by').equals('admin');
        res.status(201).json({
            status: "success",
            result: healthstories.length,
            data: {
                healthstories
            }
        })
    } catch (err) {
        console.log(err);
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
})

app.get('/gettravel', async (req, res) => {
    try {
        const travelstories = await Story.find().where('category').equals("travel").where('created_by').equals('admin');
        res.status(201).json({
            status: "success",
            result: travelstories.length,
            data: {
                travelstories
            }
        })
    } catch (err) {
        console.log(err);
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
})
////Creating api for the category having same creation time

app.get('/getsamecategorystory', async (req, res) => {
    try {
        const story = await Story.find().where('category').equals(req.query.category).where('creation_time').equals(req.query.creation_time);
        res.status(201).json({
            status: "success",
            result: story.length,
            data: {
                story
            }
        })
    } catch (err) {
        console.log(err);
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
})


//////api to create distinct story of same categoy on different creation time

app.get("/top5stories", async (req, res) => {
    try {
        const topstories = await Story.distinct('creation_time', { category: req.query.category });
        let topstory_ids = [];
        for (const creation_time of topstories) {
            const topstory = await Story.findOne({ creation_time, category: req.query.category });
            if (topstory) {
                topstory_ids.push(topstory);
            }
        }
        res.status(200).json({
            status: "success",
            data: {
                topstory_ids
            }
        });
    }
    catch (err) {
        console.log(err);
        res.status(404).json({
            status: 'failed',
            message: "All fields are required."
        })
    }

})
//////Creating api for regestering user
app.post("/signup", async (req, res) => {
    try {
        let check = await User.findOne({ username: req.body.username });
        if (check && req.body.password === "") {
            return res.status(404).json({
                status: 'failed',
                message: "All fields are required."
            })
        }
        if (check) {
            return res.status(400).json({
                status: "failed",
                message: "existing username found"
            })
        }
        let bookmarkdata = {};
        let storydata = {};
        for (let i = 0; i < 300; i++) {
            bookmarkdata[i] = 0;
            storydata[i] = 0;
        }
        let user = await User.find({}).exec();
        let id = user.length > 0 ? user.length + 1 : 1;

        const newUser = await User.create({ ...req.body, id: id, bookmarkData: bookmarkdata, likedStoryData: storydata });
        console.log(newUser);
        ///JWT authentication
        const data = {
            user: {
                id: newUser.id,
                username: newUser.username
            }
        }
        const token = jwt.sign(data, 'secret_ecom');

        res.status(201).json({
            status: 'success',
            token
        })

    }
    catch (err) {
        console.log(err);
        res.status(404).json({
            status: 'failed',
            message: "All fields are required."
        })
    }
})

////Creating endpoint for userlogin

app.post("/login", async (req, res) => {
    try {
        let user = await User.findOne({ username: req.body.username });
        if (user) {
            const entered_password = req.body.password;
            const entered_username = req.body.username
            if (entered_password === user.password && entered_username === user.username) {
                const data = {
                    username: user.username,
                    id: user.id
                }
                const token = jwt.sign(data, 'secret_ecom');
                res.status(200).json({
                    status: "success",
                    token
                })
            }
            else {
                res.status(403).json({
                    status: "failed",
                    message: "Incorrect Password"
                })
            }
        }
        else {
            res.status(403).json({
                status: "failed",
                message: "Please enter validusername or password"
            })
        }
    } catch (err) {
        console.log(err);
        res.status(404).json({
            status: 'failed',
            message: "Account doesnot exist."
        })
    }
})
/////Creating get req to fetch the bookmarkData


app.get("/getbookmarkData",fetchUser,async(req,res)=>{
    try{
    const user=await User.findOne({id:req.user.id});
    const bookmarkdata=user.bookmarkData;
    res.status(200).json({
        status:"success",
        data:{
            bookmarkdata
        }
    })
}catch(err){
    console.log(err);
    res.status(404).json({
        message:err
    })
}
})

app.get("/getlikestoryData",fetchUser,async(req,res)=>{
    try{
    const user=await User.findOne({id:req.user.id});
    const likedstoryData=user.likedStoryData;
    res.status(200).json({
        status:"success",
        data:{
            likedstoryData
        }
    })
}catch(err){
    console.log(err);
    res.status(404).json({
        message:err
    })
}
})

/////Creating api to set bookmark and like items items
app.post("/addbookmark",fetchUser,async(req,res)=>{
    try{
    const user=await User.findOne({id: req.user.id });
 
    user.bookmarkData[req.body.storyId]=1;

   await User.findOneAndUpdate({id:req.user.id},{bookmarkData:user.bookmarkData})

    console.log("success");
   res.status(201).json({
    status:"success",
    message:"updated"
   })
}catch(err){
    console.log(err);
    res.status(404).json({
        status: 'failed',
        message:err
    })
}
})


app.post("/removebookmark",fetchUser,async(req,res)=>{
    try{
    const user=await User.findOne({id: req.user.id });
    user.bookmarkData[req.body.storyId]=0;
   await User.findOneAndUpdate({id:req.user.id},{bookmarkData:user.bookmarkData})

   res.status(201).json({
    status:"success",
    message:"updated"
   })
}catch(err){
    console.log(err);
    res.status(404).json({
        status: 'failed',
        message:err
    })
}
})


app.post("/addlikestory",fetchUser,async(req,res)=>{
    try{
    const user=await User.findOne({id: req.user.id });
    const story=await Story.findOne({id:req.body.storyId});
   story.likecount+=1;
 
    user.likedStoryData[req.body.storyId]=1;
await Story.findOneAndUpdate({id:req.body.storyId},{likecount:story.likecount});
   await User.findOneAndUpdate({id:req.user.id},{likedStoryData:user.likedStoryData})

    console.log("success");
   res.status(201).json({
    status:"success",
    message:"updated"
   })
}catch(err){
    console.log(err);
    res.status(404).json({
        status: 'failed',
        message:err
    })
}
})

/////////get user details
app.get("/username",fetchUser,async(req,res)=>{
    try{
    res.status(200).json({
        status:"success",
        data:{
        username:req.user.username
        }
    })
}catch(err){
    console.log(err);
    res.status(404).json({
        status: 'failed',
        message:err
    })
}
})



app.post("/removelikedstory",fetchUser,async(req,res)=>{
    try{
    const user=await User.findOne({id: req.user.id });
    user.likedStoryData[req.body.storyId]=0;
    const story= await Story.findOne({id:req.body.storyId});
    story.likecount-=1;
   await User.findOneAndUpdate({id:req.user.id},{likedStoryData:user.likedStoryData})
   await Story.findOneAndUpdate({id:req.body.storyId},{likecount:story.likecount});
   res.status(201).json({
    status:"success",
    message:"updated"
   })
}catch(err){
    console.log(err);
    res.status(404).json({
        status: 'failed',
        message:err
    })
}
})


app.listen(port, () => {
    console.log("Listening to port 4000")
})
