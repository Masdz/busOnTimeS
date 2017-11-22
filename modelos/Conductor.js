"use strict"
var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var ConductorSchema=Schema({
   nombre:String,
   apaterno:String,
   amaterno:String,
   email:String,
   contraseña:String
});
module.exports=mongoose.model('Conductores',ConductorSchema);

