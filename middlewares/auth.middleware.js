const jwt=require("jsonwebtoken");
const blacklist = require("../blacklist");
require('dotenv').config()

const auth=async(req,res,next)=>{
      const token=req.headers.authorization?.split(" ")[1];
      try {
            if(token){
                  if(blacklist.includes(token)){
                        res.status(200).json({msg:"Please Login"})
                  }
                  else{
                        var decoded = jwt.verify(token, process.env.secretKey);
                        req.body.userId=decoded.userId;
                        req.body.Email=decoded.userEmail;
                        console.log(decoded)
                        next()
                  }
            }
            else{
                  res.status(200).json({msg:"Invalid Credentials"})
            }
      } catch (error) {
            
      }
}

module.exports=auth