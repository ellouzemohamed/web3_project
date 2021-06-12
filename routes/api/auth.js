const express=require('express')
const router=express.Router()
const auth=require('../../middlware/auth')
const User=require('../../models/User')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const config=require('config')
const { check, validationResult } = require('express-validator')

router.get('/',auth,async (req,res)=>{
try {
    const user=await User.findById(req.user.id).select('-password')
    res.json(user)
} catch (err) {
    console.error(err.message)
    res.status(500).send('server Error')    
}
})


router.post('/', [
check('email','please include a valis email').isEmail(),
check('password','password is required').exists()
],
async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
const {email,password}=req.body
try {
    //see if user exist

    let user=await User.findOne({email})
    if (!user){
       return res.status(400).json({errors:[{msg:'Invalid credentials'}]})
    }
   
    
const isMatch=await bcrypt.compare(password,user.password)
if (!isMatch){ 
    return res.status(400).json({errors:[{msg:'Invalid credentials'}]})
}


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