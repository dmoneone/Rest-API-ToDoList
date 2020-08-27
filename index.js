const express = require('express')
const mongoose = require('mongoose')
const User = require('./Models/user')
const fileMW = require('./Middlewares/file')
const path = require('path')
const cors = require('cors')

const authRoute = require('./Routes/auth')
const toDoListRoute = require('./Routes/toDoList')
const profileRoute = require('./Routes/profile')
const usersRoute = require('./Routes/users')
const keys = require('./keys/keys')
const helmet = require('helmet')
const compression = require('compression')

const app = express()


app.use(fileMW.single('avatar'))
//app.use(express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(helmet())
app.use(compression())
app.use(cors())

app.use('/api/auth', authRoute)
app.use('/api/list', toDoListRoute)
app.use('/api/profile', profileRoute)
app.use('/api/users', usersRoute)
app.get('/', (req, res) => {
    res.json({page: 'home'})
})

const start = async (port, uri) => {
    try { 
        await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
        
        app.listen(port, () => {
            console.log(`Server has been launched. Port: ${port}`)
        })
    } catch(e) {
        throw e
    }
}

start((process.env.PORT || 3005), keys.mongoDbUri)

