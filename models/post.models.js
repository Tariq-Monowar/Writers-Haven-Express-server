const { default: mongoose } = require("mongoose");

const postSchema = mongoose.Schema({
    bookName: {
        type: String,
        required: true
    },
    writer: {
        type: String,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    descriptions: {
        type: String,
        required: true
    },
    postBy: {
        type: String,
        ref: 'User'
    },
    createdOn: {
        type: Date,
        default: Date.now()
    }
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
