const fs=require('fs');
const mongoose=require('mongoose');
const  { Story, User }=require("../Modals/storyModel");


////Database Connection

mongoose.connect('mongodb+srv://simranthakur:Blueberry123@cluster0.mohhrpw.mongodb.net/webstory'
).then(()=>{
    console.log('db connection successful');
});

const story=JSON.parse(fs.readFileSync(`${__dirname}/data.json`,'utf-8'),);

const importData=async()=>{
    try{
        await Story.create(story);
        console.log("Data added into db");
    }catch(err){
        console.log(err);
    }
    process.exit();
}

const deleteData=async()=>{
    try{
        await Story.deleteMany();
        console.log("Data successsfully deleted");
    }catch(err){
        console.log(err);
    }
    process.exit();
};
if(process.argv[2]==='--import'){
    importData()
}

if(process.argv[2]==='--delete'){
    deleteData()
}