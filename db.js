const mongoose=require('mongoose');

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
