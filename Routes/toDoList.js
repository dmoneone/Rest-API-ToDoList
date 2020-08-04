const {Router} = require('express')
const User = require('../Models/user')
const authMW = require('../Middlewares/auth')
const router = Router()

router.get('/', authMW, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)

        if(user) {
            let list = user.toDoList.items
            const pageLimit = 10
            const postCount = list.length

            if(req.query.page) {
                const pageCount = Math.ceil(postCount / pageLimit);

                let page = parseInt(req.query.page);

                if(page < 1) page = 1;
                if(page > pageCount) page = pageCount;

                return res.status(200).json({
                    list: list.slice(page * pageLimit - pageLimit, page * pageLimit),
                    pageCount,
                    userId: user._id
                })
            } 
            res.status(200).json({
                list: list.slice(1 * pageLimit - pageLimit, 1 * pageLimit),
                pageCount,
                userId: user._id
            })
        }

    } catch(e) {
        console.log(e)
    }

})

router.post('/addPost', authMW, async (req, res) => {
    if(!req.body) {
        return res.json({
            message: 'body is undefined'
        })
    }

    const newPostTitle = req.body.title

    try {
        const user = await User.findById(req.user.userId)
        await user.addNewPost(newPostTitle)
        const id = (user.toDoList.items[user.toDoList.items.length-1]._id)
        res.status(200).json({
            message: 'new post has been added',
            newPostTitle,
            id
        })
        

    } catch(e) {
        console.log(e)
    }

})

router.delete('/removePost/:id', authMW, async (req, res) => {
    const postId = req.params.id
    const user = await User.findById(req.user.userId)
    await user.removePost(postId)

    res.status(200).json({
        message: 'post has been removed',
        postId
    })

})

router.put('/updatePost', authMW, async (req, res) => {
    if(!req.body) {
        return res.json({
            message: 'body is undefined'
        })
    }

    const {postId, title} = req.body
    const user = await User.findById(req.user.userId)
    await user.updatePost(postId, title)

    res.status(200).json({
        message: 'post has been updated',
        postId,
        newTitle: title
    })

})

router.delete('/clearList', authMW, async (req, res) => {
    const user = await User.findById(req.user.userId)
    await user.clearList()

    res.status(200).json({
        message: 'list has been cleaned',
    })
})

module.exports = router