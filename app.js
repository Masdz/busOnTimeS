"use strict"
var sys = require('util');
var url = require('url');
var qs  = require("querystring");
var HashMap = require('hashmap');
var http = require('http');
var querystring = require('querystring');
var express = require('express');
var bodyParser = require('body-parser');
//var conexionBD = require('mongoose');
var Schema

var map    = new HashMap();
var app    = express();
var cache  = false;
var best   = 'empty';
var IniDif = 'empty';
var n1,n2,suma;

map.clear();
//conexionBD.connect('mongodb://localhost:27017/BusOnTime',(error,respuesta)=>{
//	if(error){
	//	throw error;
	//}else{
//		console.log("Conectado a la BD");
	//}
	
//});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/OBTENERCORDENADAS/:id?',function(req,res,next){
	var response="";
      if(req.params.id){
        response=map.get(req.params.id);
      }
      else{
        response = "NO_PARAMS"
      }
      res.status(200).send(response);
  });
  
  app.get('/OBTENERCORDENADAS2',function(req,res,next){
	var response="";
	var val=map.values();
	var key=map.keys();
		for (var i=0;i<map.size;i++){
			response=response+'"'+key[i]+'":{'+val[i]+'}';
			if(i+1<map.size){
				response=response+',';
			}
		} 
    res.status(200).send('{'+response+'}');
  });

  app.get('/PROBAR',function(req,res){
    res.status(200).send("Hola");
  });
  
app.post('/ENVIARCORDENADAS', function(req, res){
  map.set(
	req.body.id,'"latitud":'+req.body.latitud+','
	+'"longitud": '+req.body.longitud+','
	+'"velocidad": '+req.body.velocidad);
  res.status(200).send('Exito');
});

app.post('/ELIMINARCORDENADAS', function(req, res){
	map.set(req.params.id,'eliminar');
	map.delete(req.params.id);
	res.status(200).send('Exito');
});

//app.listen(3000);
var server = app.listen((process.env.PORT || 5000), function(){
  console.log('listening on *:5000');
});
//tonsquemike