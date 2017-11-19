"use strict"
var sys = require('util');
var url = require('url');
var qs = require("querystring");
var HashMap = require('hashmap');
var http = require('http');
var querystring = require('querystring');
var express = require('express');
var bodyParser = require('body-parser');
var conexionBD = require('mongoose');

var map    = new HashMap();
var tmap = new HashMap();
var app = express();
var cache = false;
var best = 'empty';
var IniDif = 'empty';
var n1, n2, suma;

var Pasajero = require("./modelos/Pasajero.js");

map.clear();
conexionBD.connect('mongodb://app:passcuenta@ds113626.mlab.com:13626/busontime', (error, respuesta) => {
    if (error) {
        throw error;
    } else {
        console.log('BD conectada');
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
setInterval(function () {
    var val = tmap.values();
    var key = tmap.keys();
    console.log("Iniciando validacion");
    for (var i = 0; i < tmap.size; i++) {
        console.log("Validando " + i + "/" + tmap.size);
        if (val[i] === '1') {
            tmap.set(key[i], '0');
            console.log("un elemento podria ser eliminado");
        } else if (val[i] === '0') {
            map.delete(key[i]);
            tmap.delete(key[i]);
            console.log("se elimino un elemento");
        } else {
            console.log("prro kha");
        }
    }
    console.log("validacion finalizada");
}, 1200000);
//},30000 );

app.get('/OBTENERCORDENADAS/:id?', function (req, res, next) {
    var response = "";
    if (req.params.id) {
        response = map.get(req.params.id);
    } else {
        response = "NO_PARAMS";
    }
    res.status(200).send(response);
});

app.get('/OBTENERCORDENADAS2', function (req, res, next) {
    var response = "";
    var val = map.values();
    var key = map.keys();
    for (var i = 0; i < map.size; i++) {
        response = response + '"' + key[i] + '":{' + val[i] + '}';
        if (i + 1 < map.size) {
            response = response + ',';
        }
    }
    res.status(200).send('{' + response + '}');
});

app.get('/PROBAR', function (req, res) {
    res.status(200).send("Hola 2");
});

app.post('/LOGINPASAJERO', function (req, res) {
    var email=req.body.email;
    var pass=req.body.pass;
    Pasajero.findOne({email:email,contraseña:pass},(error,exito)=>{
        if(error){
            res.status(404).send('Usuario no existe');
        }else{
            if(!exito){
                res.status(404).send('Usuario o contraseña incorectos');
            }else{
                res.status(200).send(exito);
            }
        }
    });
});

app.post('/ENVIARCORDENADAS', function (req, res) {
    map.set(
            req.body.id, '"latitud":' + req.body.latitud + ','
            + '"longitud": ' + req.body.longitud + ','
            + '"velocidad": ' + req.body.velocidad);
    tmap.set(req.body.id, '1');
    res.status(200).send('Exito');
});

app.post('/ELIMINARCORDENADAS', function (req, res) {
    console.log('eliminar' + req.body.id);
    map.delete(req.body.id);
    tmap.delete(req.body.id);
    res.status(200).send('Exito');
});

app.post('/REGISTRARPASAJERO', function (req, res) {
    var usuario = new Pasajero();
    var parametros = req.body;
    res.status(200).send('Exito');
    usuario.nombre = parametros.nombre;
    usuario.apaterno = parametros.apaterno;
    usuario.amaterno = parametros.amaterno;
    usuario.email = parametros.email;
    usuario.contraseña = parametros.contraseña;
    (usuario).save((error, exito) => {
        if (error) {
            res.status(500).send({mesaje: 'Error'});
        } else {
            console.log(req+"");
        }
    })
    //res.status(200).send('Exito');
});

//app.listen(3000);
var server = app.listen((process.env.PORT || 5000), function () {
    console.log('listening on *:5000');
});
//tonsquemike