const mongoose = require('mongoose')

// the name of the db and some options for deprecated functions
mongoose.connect(process.env.MONGODB_DEV_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

