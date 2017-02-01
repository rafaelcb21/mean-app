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
  var hash = req.body.hash;

  var list1 = [];
  var list2 = [];
  //var list3 = [];
  var list4 = [];

  var quantidadeTotal = quantidade.reduce((a, b) => parseInt(a) + parseInt(b), 0);
  //var freteByProduto = frete / quantidadeTotal;
  //var parcelaUnidadeFrete = parseFloat(freteByProduto) / valorPgto.length;

  for(let i = 0; i < valorPgto.length; i++) {
    var freteporProduto = (((valorPgto[i] / soma) * frete) / quantidadeTotal);
    list4.push(freteporProduto)

  }

  for (let i = 0; i < proporcaoList.length; i++) {
    for (let j = 0; j < valorPgto.length; j++) {
      var parcela = parseFloat(proporcaoList[i])*parseFloat(valorPgto[j])/quantidade[i];
      list1.push(parcela);
    }
    list2.push(list1);
    list1 = [];
  }

  //for (let j = 0; j < valorPgto.length; j++) {
  //    list3.push(parcelaUnidadeFrete);
  //}

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
        transportadora: selectedTransportadora,
        dataParc: dataParc,
        parcFrete: list4,
        hash: hash
      })
      product.save(function(err, result) {})
    }
  }

  for (let i = 0; i < valorPgto.length; i++) {
    var fluxo = new Fluxo({
        dataParc: dataParc[i],
        dataVencimento: "",
        fornecedor: selectedFornecedor,
        valorPgto: -1*valorPgto[i],
        hash: hash
      })
    fluxo.save(function(err, result) {})
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
  Produto.find({vendido: false}, function(err, doc){
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
  Produto.count({produto: produto, vendido: false}, function(err, doc){
      if (err) {
        return res.status(404).json({
          title: 'Um erro ocorreu',
          obj: err
        });
      }
      Produto.find({produto: produto, vendido: false}, function(erro, docs){
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
  })
})

router.post('/qtdProdutos', function(req, res, next) {
  var selectedProduto = req.body.selectedProduto; //lista
  var quantidade = req.body.quantidade; //lista
  var lista = [];
  var check = "true";
  var contar = function (item, doneCallback) {
    var query = Produto.count({produto: item}).exec();
    query.then(function (doc) {
      return doneCallback(null, doc);
    });  
  };  
  async.map(selectedProduto, contar, function (err, results) {
    for(let i = 0; i < results.length; i++) {
      if(quantidade[i] > results[i]) {
        check = "false";
        break;
      }      
    }
    res.status(200).json({
      check: check
    })
  });
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
  var hash = req.body.hash;

  var list1 = [];
  var list2 = [];
  var list3 = [];
  var valor = [];
  var listHash = [];

  var quantidadeTotal = quantidade.reduce((a, b) => parseInt(a) + parseInt(b), 0);
  //var freteByProduto = frete / quantidadeTotal;
  //var parcelaUnidadeFrete = parseFloat(freteByProduto) / valorPgto.length;

  for(let i = 0; i < valorPgto.length; i++) {
    var freteporProduto = (((valorPgto[i] / soma) * frete) / quantidadeTotal);
    list3.push(freteporProduto);
  }

  for (let i = 0; i < proporcaoList.length; i++) {
    for (let j = 0; j < valorPgto.length; j++) {
      var parcela = parseFloat(proporcaoList[i])*parseFloat(valorPgto[j])/quantidade[i];
      list1.push(parcela);
    }
    list2.push(list1);
    list1 = [];
  }

  //for (let j = 0; j < valorPgto.length; j++) {
  //    var x = ((parseFloat(margem[j])/100)+1) * parseFloat(pm[j]) * parseFloat(quantidade[j]);
  //    valor.push(x);
  //    list3.push(parcelaUnidadeFrete);
  //}

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

      stringRandom = crypto.randomBytes(32).toString('hex');
      var hashId = SHA256(stringRandom).toString();

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
        parcFrete: list3,
        hash: hash,
        hashId: hashId
      })
      sell.save(function(err, result) {});
      listHash.push(hashId)
    }      
  }

  for (let i = 0; i < quantidade.length; i++) {
    var query = Produto.find({produto: selectedProduto[i], vendido: false}).limit(quantidade[i]).exec();
    query.then(function (doc) {
      for (let j = 0; j < doc.length; j++) {
        Produto.update({ _id: doc[j]._id }, { $set: { vendido: true, hashId: listHash[j] }}, function(e, r){
          if(e){
            console.log(e)
          }else{
            console.log(r)
          }
        });
      }      
    });
  }


  for (let i = 0; i < valorPgto.length; i++) {
    var fluxo = new Fluxo({
        dataParc: dataParc[i],
        dataVencimento: vencimento[i],
        fornecedor: selectedCliente,
        valorPgto: valorPgto[i],
        hash: hash
      })
    fluxo.save(function(err, result) {})
  }

  res.status(201).json({
    msg: "sucesso"
  })
})

router.get('/fc', function(req, res, next) {
  var linha = [];
  var lista = []

  Fluxo.aggregate([
      {
        "$group":{
          "_id":{
            "year":{ "$year":"$dataParc" },
            "month":{ "$month":"$dataParc" },
            "day":{ "$dayOfMonth":"$dataParc" }
          },
          "value":{ "$sum":"$valorPgto" }
        }
      }
    ], function(err, compra){      
        Fluxo.find({}, function(erro, linhas_compra){
          res.status(200).json({
                  linhas_compra: linhas_compra,
                  compra: compra
            });
          }
        )
      }
   )  

  /*
  Produto.aggregate([
      { "$group": 
        { "_id": "$hash", 
          "fornecedor": { "$addToSet": "$fornecedor" },
          "parc": { "$push": "$parc" },
          "dataParc": { "$first": "$dataParc" },
          "parcFrete": { "$push": "$parcFrete" } 
        }
      }
    ], function(err, compra){})
  })*/

})

router.post('/despesas-receitas', function(req, res, next) {
  var descricao = req.body.descricao;
  var selectedCategoria = req.body.selectedCategoria;
  var tipo = req.body.tipo;
  var valor = req.body.valor;
  var dataDespesaReceita = req.body.dataDespesaReceita;
  var repetir = req.body.repetir;
  var fixaparcelada = req.body.fixaparcelada;
  var periodo = req.body.periodo;
  var parcela = req.body.parcela;
  var hash = req.body.hash;

  var valorPagto = 0;

  if(tipo == "despesa") { valorPagto = -1 * valor }else{ valorPagto = valor }

  var dp = new DespRec({
    descricao: descricao,
    selectedCategoria: selectedCategoria,
    tipo: tipo,
    valor: valorPagto,
    dataDespesaReceita: dataDespesaReceita,
    repetir: repetir,
    fixaparcelada: fixaparcelada,
    periodo: periodo,
    parcela: parcela,
    hash: hash
  })
  
  dp.save(function(err, result) {})

  if(repetir){
    if(fixaparcelada == "fixa"){
      if(periodo == 'diário'){
        var x = moment(dataDespesaReceita).add(1, 'days');

      }else if(periodo == 'semanal'){
        var x = moment(dataDespesaReceita).add(1, 'week');

      }else if(periodo == 'quinzenal'){
        var x = moment(dataDespesaReceita).add(15, 'days');

      }else if(periodo == 'mensal'){
        var x = moment(dataDespesaReceita).add(1, 'months');

      }else if(periodo == 'bimestral'){
        var x = moment(dataDespesaReceita).add(2, 'months');

        console.log(x)

      }else if(periodo == 'trimestral'){
        var x = moment(dataDespesaReceita).add(3, 'months');
        console.log(x)
         
      }else if(periodo == 'semestral'){
        var x = moment(dataDespesaReceita).add(6, 'months');
        console.log(x)

      }else if(periodo == 'anual'){
        var x = moment(dataDespesaReceita).add(1, 'years');
      }
      


    }
  }

  var fluxo = new Fluxo({
      dataParc: dataDespesaReceita,
      dataVencimento: "",
      fornecedor: descricao,
      valorPgto: valorPagto,
      hash: hash
    })
    
  fluxo.save(function(err, result) {})

  res.status(201).json({
    msg: "sucesso"
  })
})

module.exports = router;