const jwt = require('jsonwebtoken')
const keys = require('../keys/keys')

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS') {
        return next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]

        if(!token) {
            return res.status(401).json({message: 'unauthorized'})
        }

        const decoded = jwt.verify(token, keys.jwtKey)

        delete decoded.iat
        delete decoded.exp

        req.user = decoded

        next()
        
    } catch (e) {
        console.log(e)
        return res.status(401).json({message: 'unauthorized'})
    }
}