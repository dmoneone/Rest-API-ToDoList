const {Router} = require('express')
const router = Router()
const authMW = require('../Middlewares/auth')
const User = require('../Models/user')
const keys = require('../keys/keys')

router.get('/', authMW, async (req, res) => {
    const users = await User.find().select('name email _id avatarUrl toDoList')

    users.forEach(item => {
        if(item.avatarUrl) {
            item.avatarUrl =  keys.baseUrl + 'api/profile/' + item.avatarUrl
        }
    })

    const pageLimit = 5
    const usersCount = users.length

    const pageCount = Math.ceil(usersCount / pageLimit);

    if(req.query.page) {

        let page = parseInt(req.query.page);

        if(page < 1) page = 1;
        if(page > pageCount) page = pageCount;

        return res.status(200).json({
            users: users.slice(page * pageLimit - pageLimit, page * pageLimit),
            pageCount,
            page
        })
    } 

    res.status(200).json({
        users: users.slice(1 * pageLimit - pageLimit, 1 * pageLimit),
        pageCount,
        page
    })
})

router.post('/follow', authMW, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
    
        if(user) {
            await user.follow(req.body.userId)
            
            return res.json({
                message: 'you followed user with id ' + req.body.userId
            })
        }

    } catch(e) {
        throw e
    }

})

router.delete('/unfollow/:id', authMW, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
    
        if(user) {
            await user.unfollow(req.params.id)
            
            return res.json({
                message: 'you unfollowed user with id ' + req.body.userId
            })
        }

    } catch(e) {
        throw e
    }

})

module.exports = router