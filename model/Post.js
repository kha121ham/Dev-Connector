const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    text:{
        type:String,
        required:true
    },
    name:{
        type:String
    },
    avatar:{
        type:String
    },
    likes:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref:'user'
            }
        }
    ],
    comments:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref:'user'
            },
            text:{
                type:String,
                required:true
            },
            name:{
                type:String
            },
            avatar:{
                type:String
            },
            date:{
                type:Date,
                defualt:Date.now
            }
        }
    ],
    date:{
        type:Date,
        defualt:Date.now
    }
});

module.exports = Post = mongoose.model('post',PostSchema);