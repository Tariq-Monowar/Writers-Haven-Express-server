const { default: mongoose } = require('mongoose')
const config = require('./config')

const db_connection = async ()=>{
    try {
        await mongoose.connect(config.db.url)
        console.log("Connect ...........")
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

module.exports = db_connection