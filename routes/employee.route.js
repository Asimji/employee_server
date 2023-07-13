const express=require("express");
const auth = require("../middlewares/auth.middleware");
const employeeModel = require("../models/employee.model");

const employeeRouter=express.Router();

employeeRouter.use(auth)

employeeRouter.post("/employees",async(req,res)=>{

    try {
        const employee=new employeeModel(req.body);
        await employee.save();
        res.status(200).json({data:req.body})
    } catch (error) {
        res.status(400).json({error:error.message})
    }

})

employeeRouter.get('/',async(req,res)=>{
try {
    let {q,sortBy,sortOrder,page,limit}=req.query;
    let filter={};
    if(q){
        filter.First_Name={$regex:q,$options:'i'};
    }
    const sort={};
    if(sortBy){
   sort[sortBy]=sortOrder==="desc"? -1 : 1;
    }
    page = page ? page : 1;
    limit=limit?limit:5;

    const employee=await employeeModel.find(filter).sort(sort).skip((page-1)*limit).limit(limit);
    res.status(200).json({employee})

} catch (error) {
    res.status(400).json({error:error.message})
}
})

employeeRouter.patch("/:id",async(req,res)=>{
    const userIdinUserDoc=req.body.userId
    const {id}=req.params;
    try {
        const employee=await employeeModel.findOne({_id:id});
        if(userIdinUserDoc===employee.userId){
            await employeeModel.findByIdAndUpdate({_id:id},req.body)
            res.status(200).json({msg:`${employee.First_Name} Updated Successfully`})
        }
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

employeeRouter.delete("/:id",async(req,res)=>{
    const userIdinUserDoc=req.body.userId
    const {id}=req.params;
    try {
        const employee=await employeeModel.findOne({_id:id});
        if(userIdinUserDoc===employee.userId){
            await employeeModel.findByIdAndDelete({_id:id})
            res.status(200).json({msg:`${employee.First_Name} Deleted Successfully`})
        }
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

module.exports=employeeRouter