"use strict"
var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var pasajeroSchema=Schema({
   nombre:String,
   apaterno:String,
   amaterno:String,
   email:String,
   contraseña:String
});
module.exports=mongoose.model('Pasajeros',pasajeroSchema);

