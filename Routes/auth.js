const {Router} = require('express')
const jwt = require('jsonwebtoken')
const User = require('../Models/user')
const bcrypt = require('bcryptjs')
const keys = require('../keys/keys')
const router = Router()
const nodemailer = require('nodemailer')
const sendGrid = require('nodemailer-sendgrid-transport')
const crypto = require('crypto')
const {body, validationResult} = require('express-validator/check')
const registerValidators = require('../utils/registerValidators')

const transporter = nodemailer.createTransport(sendGrid({
    auth: { 'api_key': keys.sendGridApiKey }
}))


router.post('/login', [ 
    body('email').isEmail().withMessage('incorrect email') 
], async (req, res) => {
    if(!req.body) {
        return res.json({
            message: 'body is undefined'
        })
    }
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).json({ //422 some errs with validation
            error: errors.array()[0].msg
        })
    }

    const {email, password} = req.body
    const candidate = await User.findOne({ email })
    if(candidate) {
        let isOwner = await bcrypt.compare(password, candidate.password)
        if(isOwner) {
            const user = candidate 
            const token = jwt.sign({
                email: user.email,
                userId: user._id,
                name: user.name
            }, keys.jwtKey, {
                expiresIn: 60 * 60
            })
            
            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            res.status(401).json({
                error: 'incorrect input data'
            })
        }
    } else {
        res.status(404).json({
            error: 'no such user'
        })
    }
})

router.post('/register', registerValidators, async (req, res) => {
    const {name, email, password, extraPassword} = req.body

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).json({ //422 some errs with validation
            error: errors.array()[0].msg
        })
    }

    const isBodyAll = name && email && password && extraPassword

    if(isBodyAll) {
        if(await User.findOne({ email })) return res.status(200).json({
            message: 'user with this email exists'
        })

        const user = new User({
            name,
            email,
            password: await bcrypt.hash(password, 10),
            toDoList: { items: []}
        })

        await user.save()

        res.status(200).json({
            message: 'new user has been added'
        })

        await transporter.sendMail({
            to: email,
            from: keys.emailFrom,
            subject: 'Account has been created',
            html: `
                <h2>Thank you for register!</h2>
            `
        })
    } else {
        return res.json({
            message: 'body is incorrect'
        })
    }

})

router.post('/reset', (req, res) => {
    if(!req.body.email) return res.json({ message: 'email is undefined' })

    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if(err) {
                return res.json({ error: 'something is wrong' })
            }

            const token = buffer.toString('hex')

            const candidate = await User.findOne({ email: req.body.email })

            if(candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000 //1 hour
                await candidate.save()

                await transporter.sendMail({
                    to: req.body.email,
                    from: keys.emailFrom,
                    subject: 'Reset password',
                    html: `
                        <h2>Did you really forget password?</h2>
                        <p>If you are not, just ignore this message</p>
                        <p>Else click this link</p>
                        <p><a href="${keys.baseUrl}api/auth/password/${token}">Reset</a></p>
                    `
                })

                res.json({
                    message: 'email has been sent'
                })


            } else {
                return res.json({
                    message: 'no user with this email'
                })
            }
        })
    } catch(e) {
        console.log(e)
    }
})

router.get('/password/:token', async (req, res) => {
    if(!req.params.token) return 

    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: { $gt: Date.now() } // checking timer of token // bigger than Date.now
        })
    
        if(!user) {
            return res.json({
                message: 'no such user'
            })
        } else {
            return res.json({
                userId: user._id,
                token: req.params.token
            })
        }
    } catch (e) {
        console.log(e)
    }

})

router.post('/password', async (req, res) => {
    if(!req.body.userId && !req.body.token && !req.body.password) return res.json({ message: 'body is incorrect' })

    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: { $gt: Date.now() }
        })
  
        if(user) {
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined

            await user.save()
            res.json({
                message: 'password has been changed'
            })
        } else {
            res.json({
                message: 'time of token is over'
            })
        }

    } catch(e) {
        console.log(e)
    }
})




module.exports = router