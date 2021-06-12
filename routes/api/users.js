const express=require('express')
const router=express.Router()
const gravatar=require('gravatar')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const config=require('config')
const { check, validationResult } = require('express-validator');
const User=require('../../models/User')


router.post('/',[ check('name','name is requuired')
.not()
.isEmpty(),
check('email','please include a valis email').isEmail(),
check('password','password length more 6').isLength({min:6})
],
async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
const {name,email,password}=req.body
try {
    //see if user exist

    let user=await User.findOne({email})
    if (user){
       return res.status(400).json({errors:[{msg:'user already exists'}]})
    }
   
    //Get Users gravatar

    const avatar=gravatar.url(email,{
        s: '200',
        r: 'pg',
        d: 'mm'
    }) 

user=new User({
    name,
    email,
    avatar,
    password
})

//Encrypt password
const salt=await bcrypt.genSalt(10)
user.password=await bcrypt.hash(password,salt)
await user.save()

//return jsonwebtoken
const payload={
    user:{
        id:user.id
    }
}
jwt.sign(payload,
    config.get('jwtSecret'),
    {expiresIn:360000},
    (err,token)=>{
    if (err) throw err
    res.send({
        token,
        user:{
            id:user._id,
            name:user.name,
            email:user.email
        }
    })
})


} catch (err) {
    console.log(err.message)
    res.status(500).send('server error')
}

}
)
module.exports=router