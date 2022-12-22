const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')

router.get('/',async (req,res)=>{
    
})

router.post('/signIn',async (req,res)=>{
    authController.signIn(req).then((user)=>{
    res.status(200).send(user)
    }).catch((err)=>{
        res.status(400).send(err)
    })
})

router.post('/signUp',async (req,res)=>{
    authController.signUp(req).then((user)=>{
        res.status(200).send(user)
    }).catch((err)=>{
        res.status(400).send(err)
    })
})

router.post('/refresh',async (req,res)=>{
    authController.refreshToken(req).then((user)=>{
        res.status(200).send(user)
    }).catch((err)=>{
        res.status(400).send(err)
    })
})

router.put('/',async (req,res)=>{
    
})

module.exports = router;