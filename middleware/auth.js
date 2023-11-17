const jwt = require('jsonwebtoken');
const User = require('../models/users');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('authorization');
        const decoded = jwt.verify(token, 'secretkey');
       // console.log('>>>',decoded);
        const user = await User.findByPk(decoded.userId);
            req.user = user;
            next();
       
    } catch(err) {
        console.log('error at authentication>>',err);
        return res.status(401).json({success: false})
    }
}

module.exports = {
    authenticate
}