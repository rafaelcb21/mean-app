var express = require('express');
var router = express.Router();
var Lista = require('../modules/lista');
var Produto = require('../modules/produto');
var Venda = require('../modules/venda');

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

router.post('/fornecedores', function(req, res, next) {
  var selectedFornecedor = req.body.selectedFornecedor;
  var valueEmissao = req.body.valueEmissao;
  var selectedOperacao = req.body.selectedOperacao;
  var selectedCategoria = req.body.selectedCategoria;
  var serie = req.body.serie;
  var nf = req.body.nf;
  var compra = req.body.compra;
  var selectedProduto = req.body.selectedProduto; //lista
  var quantidade = req.body.quantidade; //lista
  var valor = req.body.valor; //lista
  var selectedTransportadora = req.body.selectedTransportadora;
  var frete = req.body.frete;
  var valorPgto = req.body.valorPgto; //lista
  var datePgto = req.body.datePgto; //lista
  var proporcaoList = req.body.proporcaoList; //lista
  var soma = req.body.soma;

  var list1 = [];
  var list2 = [];
  var list3 = [];

  var quantidadeTotal = quantidade.reduce((a, b) => parseInt(a) + parseInt(b), 0);
  var freteByProduto = frete / quantidadeTotal;
  var parcelaUnidadeFrete = parseFloat(freteByProduto) / valorPgto.length;

  for (let i = 0; i < proporcaoList.length; i++) {
    for (let j = 0; j < valorPgto.length; j++) {
      var parcela = parseFloat(proporcaoList[i])*parseFloat(valorPgto[j])/quantidade[i];
      list1.push(parcela);
    }
    list2.push(list1);
    list1 = [];
  }

  for (let j = 0; j < valorPgto.length; j++) {
      list3.push(parcelaUnidadeFrete);
  }

  for (let i = 0; i < quantidade.length; i++) {
    for (let j = 0; j < quantidade[i]; j++) {

      var produto = selectedProduto[i];
      var qtd = quantidade[i];
      var val = valor[i];
      var prop = proporcaoList[i];
      var parc = list2[i];
      var dataParc = datePgto;

      var product = new Produto({
        fornecedor: selectedFornecedor,
        emissao: valueEmissao,
        operacao: selectedOperacao,
        categoria: selectedCategoria,
        serie: serie,
        nf: nf,
        compra: compra,
        produto: produto,
        qtd: qtd,
        val: val,
        prop: prop,
        parc: parc,
        dataParc: dataParc,
        parcFrete: list3
      })
      product.save(function(err, result) {})          
    }      
  }
  res.status(201).json({
    msg: "sucesso"
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
        label: label,
        obj: doc
      });
  })
})

router.get('/produto', function(req, res, next) {
  Produto.find({}, function(err, doc){
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

router.get('/produtoQuantidade', function(req, res, next) {
  var produto = req.query.produto;
  Produto.count({produto: produto}, function(err, doc){
      if (err) {
        return res.status(404).json({
          title: 'Um erro ocorreu',
          obj: err
        });
      }
      Produto.find({produto: produto}, function(erro, docs){
          if (erro) {
            return res.status(404).json({
              title: 'Um erro ocorreu',
              obj: erro
            });
          }
          res.status(200).json({
            obj: doc,
            objs: docs 
          });
      })
      //res.status(200).json({
      //  obj: doc
      //});
  })
})

router.post('/venda', function(req, res, next) {  
  var selectedCliente = req.body.selectedCliente;
  var valueEmissao = req.body.valueEmissao;
  var selectedOperacao = req.body.selectedOperacao;
  var selectedCategoria = req.body.selectedCategoria;
  var serie = req.body.serie;
  var venda = req.body.venda;
  var selectedProduto = req.body.selectedProduto; //lista
  var pm = req.body.pm; //lista
  var quantidade = req.body.quantidade; //lista
  var margem = req.body.margem; //lista
  var selectedTransportadora = req.body.selectedTransportadora;
  var frete = req.body.frete;
  var valorPgto = req.body.valorPgto; //lista
  var vencimento = req.body.vencimento; //lista
  var datePgto = req.body.datePgto; //lista
  var proporcaoList = req.body.proporcaoList; //lista
  var soma = req.body.soma;

  var list1 = [];
  var list2 = [];
  var list3 = [];
  var valor = [];

  var quantidadeTotal = quantidade.reduce((a, b) => parseInt(a) + parseInt(b), 0);
  var freteByProduto = frete / quantidadeTotal;
  var parcelaUnidadeFrete = parseFloat(freteByProduto) / valorPgto.length;

  for (let i = 0; i < proporcaoList.length; i++) {
    for (let j = 0; j < valorPgto.length; j++) {
      var parcela = parseFloat(proporcaoList[i])*parseFloat(valorPgto[j])/quantidade[i];
      list1.push(parcela);
    }
    list2.push(list1);
    list1 = [];
  }

  for (let j = 0; j < valorPgto.length; j++) {
      var x = ((parseFloat(margem[j])/100)+1) * parseFloat(pm[j]) * parseFloat(quantidade[j]);
      valor.push(x);
      list3.push(parcelaUnidadeFrete);
  }

  for (let i = 0; i < quantidade.length; i++) {
    for (let j = 0; j < quantidade[i]; j++) {

      var produto = selectedProduto[i];
      var custoMedio = pm[i];
      var qtd = quantidade[i];
      var marg = margem[i];
      var val = valor[i];
      var prop = proporcaoList[i];
      var parc = list2[i];
      var dataParc = datePgto;

      var sell = new Venda({
        cliente: selectedCliente,
        emissao: valueEmissao,
        operacao: selectedOperacao,
        categoria: selectedCategoria,
        serie: serie,
        venda: venda,
        produto: produto,
        pm: custoMedio,
        qtd: qtd,
        margem: marg,
        val: val,
        prop: prop,
        parc: parc,
        vencimento: vencimento,
        dataParc: dataParc,
        parcFrete: list3
      })
      sell.save(function(err, result) {})          
    }      
  }
  res.status(201).json({
    msg: "sucesso"
  })
})
module.exports = router;