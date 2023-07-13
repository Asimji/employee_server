const mongoose=require('mongoose');


const employeeSchema=mongoose.Schema({
First_Name:{
    type:String,
    require:true
},
Last_Name:{
    type:String,
    require:true
},
Email:{
    type:String,
    require:true
},
userId:{
    type:String,
    require:true
},
Department :{
    type:String,
    require:true
},
Salary :{
    type:Number,
    require:true
}
},{
    versionKey:false
})

const employeeModel=mongoose.model("employee",employeeSchema);

module.exports=employeeModel