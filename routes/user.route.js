const express=require('express');
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")
const userModel = require('../models/user.model');
const blacklist = require('../blacklist');
require('dotenv').config()

const userRouter=express.Router();

userRouter.post('/signup',async(req,res)=>{
 const {email,password}=req.body;
 
 const existedUser=await userModel.findOne({email})

 if(existedUser){
   res.status(200).json({msg:"User already Registered Please Login!!"})
 }
 else{
  if(password.length>5){
    try {
        bcrypt.hash(password, 2,async function(err, hash) {
            // Store hash in your password DB.
            if(hash){
                let user=new userModel({email,password:hash})
                await user.save();
                res.status(200).json({msg:"Successfully Registered"})

            }
            else{
                res.status(200).json({error:err.message})
            }
        });
    } catch (error) {
        res.status(400).json({erro:error.message})
    }
  }
  else{
    res.status(200).json({msg:"Password length is below Level"})
  }
 }

})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;
try {
    let user=await userModel.findOne({email})
    bcrypt.compare(password, user.password, function(err, result) {
        // result == true
        if(result){
            var token = jwt.sign({userId: user._id,userEmail:user.email}, process.env.secretKey);
            res.status(200).json({msg:'Login Successful',token})
        }
        else{
            res.status(200).json({msg:'Incorrect Password'})
        }
    });
} catch (error) {
    res.status(400).json({erro:error.message})
}
})

userRouter.get('/logout',async(req,res)=>{

    const token=req.headers.authorization?.split(" ")[1];
    try {
        if(token){
            blacklist.push(token);
            res.status(200).json({msg:"Logout Successfully"})
            console.log(blacklist)
        }
        else{
            res.status(200).json({msg:"Please Provide Token"})
        }
    } catch (error) {
        res.status(400).json({erro:error.message})
    }

})

module.exports=userRouter