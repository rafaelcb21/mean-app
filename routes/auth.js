var express = require('express');
var router = express.Router();
var Lista = require('../modules/lista');
var Produto = require('../modules/produto');
var Venda = require('../modules/venda');
var Fluxo = require('../modules/fluxodecaixa');
var DespRec = require('../modules/despesasreceitas');
var async = require('async');
var SHA256 = require("crypto-js/sha256");
var crypto = require("crypto");
var moment = require('moment');
var jwt = require('jsonwebtoken');

require('dotenv').load();
var secret = process.env.SECRET;

router.post('/login', function(req, res, next) {
    var username = req.body.username;
    var senha = req.body.senha;

    if(username === "teste" && senha === "123"){
        var sessionToken = jwt.sign({session: username+senha}, secret, {expiresIn: 21600}); //6h esta em segundos
    }
    res.status(200).json({
        session: sessionToken
    });
})

router.post('/logando', function(req, res, next) {
    var session = req.body.session;
    jwt.verify(req.body.session, secret, function(err, decoded) {
        try{
            if (decoded.session != "teste123") {
                return res.status(401).json({
                    message: false
                });
            }
        }catch(e){
            return res.status(401).json({
                message: false
            });
        }
        return res.status(202).json({
            message: true,
        });
    });
})

module.exports = router;