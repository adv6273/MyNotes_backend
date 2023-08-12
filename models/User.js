const mongoose=require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({

    name:{
     type:String,
     required:true,
    //  unique:true

    },
    email :{
        unique:true,
     type:String,
     required:true,

    },
    password :{
        type:String,
        require:true
    },
    date :{
        type:String,
        default : (Date.now)
        // ndate: new Date(Date)
    },
    // Ndate:{
    //     type :String,
    //     default: new Date(timestamp)
    // }


});

const User= mongoose.model('user',UserSchema);
// module.exports= mongoose.model('user',UserSchema);
// User.createIndexes()

module.exports=User