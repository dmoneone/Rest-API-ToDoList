const {Router} = require('express')
const router = Router()
const authMW = require('../Middlewares/auth')
const User = require('../Models/user')
const path = require('path')

router.get('/', authMW, async (req, res) => {
    const user = await User.findById(req.user.userId)

    res.status(200).json({
        message: 'this your profile',
        user: {
            ...req.user,
            avatarUrl: 'http://localhost:3005/api/profile/' + user.avatarUrl
        }
    })
})

router.post('/addAvatar', authMW, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)

        const toChange = {}
        console.log(req.file)
        if(req.file) {
            toChange.avatarUrl = 'images/' + req.file.filename
        }

        if(user) {
            Object.assign(user, toChange)
            await user.save()

            res.json({
                message: 'avatar is uploaded'
            })
        }

    } catch(e) {
        console.log(e)
    }
})

router.get('/images/:img', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'images', req.params.img))
})

module.exports = router