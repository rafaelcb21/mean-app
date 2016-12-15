var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/item', function(req, res, next) {
  var label = req.body.label;
  var lista = req.body.lista;

  res.status(201).json({
    type: "success"
  })
})

module.exports = router;