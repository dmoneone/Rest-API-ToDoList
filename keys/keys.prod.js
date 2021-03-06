module.exports = {
    jwtKey: process.env.JWTKEY,
    mongoDbUri: process.env.MONGODB_URI,
    sendGridApiKey: process.env.SENDGRID_API_KEY,
    baseUrl: process.env.BASE_URL,
    emailFrom: process.env.EMAIL_FROM,
    frontEnd: process.env.FRONTEND || 'http://localhost:3000/auth/reset'
}