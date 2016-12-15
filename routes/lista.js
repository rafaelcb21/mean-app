var express = require('express');
var router = express.Router();
var Lista = require('../modules/lista');

/* GET home page. */
router.post('/item', function(req, res, next) {
  var label = req.body.label;
  var lista = req.body.lista;

  for (let i = 0; i < lista.length; i++) {
    var ll = new Lista({
      label: label,
      name: lista[i]
    })
    ll.save(function(err, result) {})
  }
  res.status(201).json({
    label: label
  })
})

module.exports = router;