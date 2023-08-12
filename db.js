const mongoose=require('mongoose');
// const mongoURI="mongodb://127.0.0.1:27017/?readPreference=primary&appName=MongoDB%25Compass&directConnection=true&ssl=false"
// const mongoURI="mongodb+srv://adv6273:eXys7iKuCJXVCVeZ@cluster0.bibrkhl.mongodb.net/Cluster0?retryWrites=true&w=majority"
const mongoURL = process.env.MONGO_URL;


const connectToMongo =()=>{

    mongoose.connect(mongoURL,{
        dbName:'iNotebook',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        
    })
    
    console.log("connected to mongoose");
}

module.exports =connectToMongo;
