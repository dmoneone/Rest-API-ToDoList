const {body, validationResult} = require('express-validator/check')

module.exports = [
    body('email', 'incorrect email').isEmail(),
    body('password', 'password must have min 5 symbols. Use only numbers and Latin').isLength({ min: 5, max: 20 }).isAlphanumeric(),
    body('extraPassword').custom((value, { req }) => {
        if(value !== req.body.password) {
            throw new Error('passwords must be the same')
        }
        return true
    }),
    body('name').isLength({ min: 5, max: 20 }).withMessage('name must have min 5 symbols')
]