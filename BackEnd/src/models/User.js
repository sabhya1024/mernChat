import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },

    fullname: {
        type: String, 
        required:true,
    },

    password: {
        required: true,
        type: String,
        minlength: 8,
    },

    profilePic: {
        type: String,
        default:""
    }

},
    { timestamps :true}
)


const User = mongoose.model('User', userSchema);
export default User