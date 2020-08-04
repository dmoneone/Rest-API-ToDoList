const express = require('express')
const mongoose = require('mongoose')
const User = require('./Models/user')
const fileMW = require('./Middlewares/file')
const path = require('path')

const authRoute = require('./Routes/auth')
const toDoListRoute = require('./Routes/toDoList')
const profileRoute = require('./Routes/profile')
const config = require('./config/config')

const app = express()


app.use(fileMW.single('avatar'))
//app.use(express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({extended: true}))
app.use(express.json())


app.use('/api/auth', authRoute)
app.use('/api/list', toDoListRoute)
app.use('/api/profile', profileRoute)
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

start(3005, config.mongoDbUri)

//user ufXgEwTrHcFOIrNy
//mongodb+srv://dmoneone:<password>@cluster0.eee2g.mongodb.net/<dbname>?retryWrites=true&w=majority