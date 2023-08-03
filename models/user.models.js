const { default: mongoose } = require("mongoose");

const userSchma = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    conformPassword:{
        type: String,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String, 
    },
    createdOn:{
        type: Date,
        default: Date.now()
    }

})

module.exports = mongoose.model("User", userSchma);

// const User = mongoose.model("User", userSchma);
// export default User;