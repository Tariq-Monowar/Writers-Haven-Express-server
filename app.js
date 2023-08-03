const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const fileUpload = require('express-fileupload');
const route = require('./routes/user.routes');
const routes = require('./routes/post.route');


const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(morgan('dev')) 
app.use(fileUpload());

app.use("/users",route)
app.use("/post",routes)

app.use((req,res,next) => {
    res.status.json({
        message: "404! Route is not found"
    })
})

app.use((err,req,res,next) => {
    res.status(500).json({
        message: "500! Something broken"
    })
})

module.exports = app;