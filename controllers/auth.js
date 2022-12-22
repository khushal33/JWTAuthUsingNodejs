const { use } = require('..')
const User = require('../models/user')
var jwt = require("jsonwebtoken");
const config = require('../config').config[env]

const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
  
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
  
    jwt.verify(token, config.JWT_secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.userId = decoded.id;
      req.email = decoded.email;
      next();
    });
  };

const signUp = (req,res) =>{
    return new Promise(async (resolve,reject)=>{
        const {email,password,name} = req.body
        let userExistOrNot = await checkUserExistOrNot(email)
        if(userExistOrNot.status == false){
            reject(userExistOrNot)
        }else{
            let new_user = new User({
                email,name
            })
            new_user.password = new_user.generateHash(password);
            let done = await new_user.save()
            resolve({status:true,message:done})
        }
    })
}

const signIn = (req,res) =>{
    return new Promise(async (resolve,reject)=>{
        const {email,password} = req.body
        let user = await User.findOne({email})
        if(user){
           let done  =  user.validPassword(password)
           if(done){
            var token = jwt.sign({ id: user.id ,email:email}, config.JWT_secret, {
                expiresIn: 43200 //12 hours
                });
            var refreshToken = jwt.sign({ id: user.id ,email:email}, config.REFRESH_TOKEN_SECRET, {
                expiresIn: 86400 // 24 hours
                });
            resolve({status:true,message:user,token:token,refreshToken})
           }else{
            reject({status:false,message:"Incorrect username or password"})
           }
        }else{
            reject({status:false,message:"Incorrect username or password"})
        }
    })
}

const checkUserExistOrNot = (email) =>{
    return new Promise(async (resolve,reject)=>{
        try{
            let user = await User.findOne({email})
            if(user){
                resolve({status:false,message:"User already exist"})
            }else{
                resolve({status:true})
            }
        }catch(err){
            reject(err)
        }
    })
}

const refreshToken = (req,res) =>{
    return new Promise(async (resolve,reject)=>{
        let refreshToken = req.headers.cookie.split("=")[1]
        console.log(refreshToken)
        if (refreshToken) {
            // Verifying refresh token
            jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, 
            (err, decoded) => {
                if (err) { 
                    // Wrong Refesh Token
                    reject({ status:false,message: 'Unauthorized' ,err});
                }
                else {
                    // Correct token we send a new access token
                    const accessToken = jwt.sign({
                        id: decoded.id,
                        email: decoded.email
                    }, config.JWT_secret, {
                        expiresIn: '10m'
                    });
                    resolve({status:true, accessToken });
                }
            })
        } else {
            reject({status:false, message: 'Unauthorized' });
        }
    })
}

module.exports = {signUp,signIn,verifyToken,refreshToken}