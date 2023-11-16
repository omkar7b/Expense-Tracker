const User = require('../models/users.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function generateAccessToken(id, ispremiumuser){
    return jwt.sign({userId: id, ispremiumuser}, 'secretkey');
}

exports.createUser =  async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email|| !password){
            return res.status(400).json({error: 'Bad Parameters'});
        }
        const userExist = await User.findOne({
            where : {email}
        })
        if(userExist){
            console.log('User Already Exists');
            res.status(400).json({error: 'User Already Exists'});
        }
        
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async(err, hash) => {
            console.log(err);
            const newUser = await User.create({
                name: name,
                email: email,
                password: hash
            });
            res.status(201).json({  success: true, message: 'Account Created Successfully' });
            console.log("successful!");
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.loginUser =  async (req,res, next) =>{
    try {
        const {email,password} = req.body;
        const userExist = await User.findAll({
            where: {email}
        })
        
        if(userExist.length>0){
            bcrypt.compare(password, userExist[0].password, (err, result) => {
                if(err){
                    throw new Error('Something went wrong!');
                }
                if(result === true){
                    res.status(200).json({success: true, message: 'User Login Successful' , token : generateAccessToken(userExist[0].id, userExist[0].ispremiumuser)})
                }
                else {
                    return  res.status(400).json({success: false, message: 'User logged in successfully'})
                }
            })
        }
            else {
                return res.status(404).json({ success: false, message: 'User Not Found' });
            }
    }
    catch(error) {
        console.log('Error', error)
    }
}


exports.generateAccessToken = generateAccessToken; 