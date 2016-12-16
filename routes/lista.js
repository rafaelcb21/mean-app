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

router.get('/item/:label', function(req, res, next) {
  var label = req.params.label;
  Lista.find({label: label, status: true},
    {
      "_id" : 0,
      "__v" : 0,
      "status": 0
    }, {sort: "name"}, function(err, doc){
      if (err) {
        return res.status(404).json({
          title: 'Um erro ocorreu',
          obj: err
        });
      }
      res.status(200).json({
        obj: doc
      });
    })
})

module.exports = router;