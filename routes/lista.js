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
        hash: hash,
        tabela: "compra"
      })
    fluxo.save(function(err, result) {})
  }

  res.status(201).json({
    msg: "sucesso"
  })
})

router.post('/fornecedoresEdit', function(req, res, next) {
  var hash = req.body.hash;
  var serie = req.body.serie;
  var nf = req.body.nf;
  var compra = req.body.compra;
  var selectedProduto = req.body.selectedProduto; //lista
  var quantidade = req.body.quantidade; //lista
  var valor = req.body.valor; //lista
  var selectedProduto2 = req.body.selectedProduto2; //lista
  var quantidade2 = req.body.quantidade2; //lista
  var valor2 = req.body.valor2; //lista
  var selectedTransportadora = req.body.selectedTransportadora;
  var frete = req.body.frete;
  var valorPgto = req.body.valorPgto; //lista
  var datePgto = req.body.datePgto; //lista
  var proporcaoList = req.body.proporcaoList; //lista
  var soma = req.body.soma;
  
  var list1 = [];
  var list2 = [];
  var list4 = [];

  /*var quantidadeTotal = quantidade.reduce((a, b) => parseInt(a) + parseInt(b), 0);

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
        hash: hash,
        tabela: "compra"
      })
    fluxo.save(function(err, result) {})
  }*/

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
        transportadora: selectedTransportadora,
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
        hash: hash,
        tabela: "venda"
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
        var fluxo = new Fluxo({
            dataParc: dataDespesaReceita,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        for(let i = 1; i < 180; i++){
          var dateNew = moment(dataDespesaReceita).add(i, 'days'); //6 meses
          var fluxo = new Fluxo({
            dataParc: dateNew,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        }

      }else if(periodo == 'semanal'){
        var fluxo = new Fluxo({
            dataParc: dataDespesaReceita,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        for(let i = 1; i < 48; i++){
          var dateNew = moment(dataDespesaReceita).add(i*7, 'days'); // 1 ano
          var fluxo = new Fluxo({
            dataParc: dateNew,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        }

      }else if(periodo == 'quinzenal'){
        var fluxo = new Fluxo({
            dataParc: dataDespesaReceita,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        for(let i = 1; i < 50; i++){
          var dateNew = moment(dataDespesaReceita).add(i*15, 'days'); //2 anos
          var fluxo = new Fluxo({
            dataParc: dateNew,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        }

      }else if(periodo == 'mensal'){
        var fluxo = new Fluxo({
            dataParc: dataDespesaReceita,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        for(let i = 1; i < 60; i++){
          var dateNew = moment(dataDespesaReceita).add(i, 'months'); //5 anos
          var fluxo = new Fluxo({
            dataParc: dateNew,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        }

      }else if(periodo == 'bimestral'){
        var fluxo = new Fluxo({
            dataParc: dataDespesaReceita,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        for(let i = 1; i < 30; i++){
          var dateNew = moment(dataDespesaReceita).add(i*2, 'months'); //5 anos
          var fluxo = new Fluxo({
            dataParc: dateNew,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        }

      }else if(periodo == 'trimestral'){
        var fluxo = new Fluxo({
            dataParc: dataDespesaReceita,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        for(let i = 1; i < 20; i++){
          var dateNew = moment(dataDespesaReceita).add(i*3, 'months'); //5 anos
          var fluxo = new Fluxo({
            dataParc: dateNew,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        }
         
      }else if(periodo == 'semestral'){
          var fluxo = new Fluxo({
            dataParc: dataDespesaReceita,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        for(let i = 1; i < 10; i++){
          var dateNew = moment(dataDespesaReceita).add(i*6, 'months'); //5 anos
          var fluxo = new Fluxo({
            dataParc: dateNew,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        }

      }else if(periodo == 'anual'){
        var fluxo = new Fluxo({
            dataParc: dataDespesaReceita,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })          
          fluxo.save(function(err, result) {})
        for(let i = 1; i < 5; i++){
          var dateNew = moment(dataDespesaReceita).add(i, 'years'); //5 anos
          var fluxo = new Fluxo({
            dataParc: dateNew,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })          
          fluxo.save(function(err, result) {})
        }
      }
      
    /*PARCELADA*/

    }else if(fixaparcelada=="parcelada"){
      if(periodo == 'diário'){
        var fluxo = new Fluxo({
            dataParc: dataDespesaReceita,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        for(let i = 1; i < parcela; i++){
          var dateNew = moment(dataDespesaReceita).add(i, 'days');
          var fluxo = new Fluxo({
            dataParc: dateNew,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        }
      }else if(periodo == 'semanal'){
        var fluxo = new Fluxo({
            dataParc: dataDespesaReceita,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })          
          fluxo.save(function(err, result) {})
        for(let i = 1; i < parcela; i++){
          var dateNew = moment(dataDespesaReceita).add(i*7, 'days');
          var fluxo = new Fluxo({
            dataParc: dateNew,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })          
          fluxo.save(function(err, result) {})
        }
      }else if(periodo == 'quinzenal'){
        var fluxo = new Fluxo({
            dataParc: dataDespesaReceita,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        for(let i = 1; i < parcela; i++){
          var dateNew = moment(dataDespesaReceita).add(i*15, 'days');
          var fluxo = new Fluxo({
            dataParc: dateNew,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        }

      }else if(periodo == 'mensal'){
        var fluxo = new Fluxo({
            dataParc: dataDespesaReceita,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        for(let i = 1; i < parcela; i++){
          var dateNew = moment(dataDespesaReceita).add(i, 'months');
          var fluxo = new Fluxo({
            dataParc: dateNew,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        }

      }else if(periodo == 'bimestral'){
        var fluxo = new Fluxo({
            dataParc: dataDespesaReceita,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        for(let i = 1; i < parcela; i++){
          var dateNew = moment(dataDespesaReceita).add(i*2, 'months');
          var fluxo = new Fluxo({
            dataParc: dateNew,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        }

      }else if(periodo == 'trimestral'){
        var fluxo = new Fluxo({
            dataParc: dataDespesaReceita,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        for(let i = 1; i < parcela; i++){
          var dateNew = moment(dataDespesaReceita).add(i*3, 'months');
          var fluxo = new Fluxo({
            dataParc: dateNew,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        }
         
      }else if(periodo == 'semestral'){
          var fluxo = new Fluxo({
            dataParc: dataDespesaReceita,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        for(let i = 1; i < parcela; i++){
          var dateNew = moment(dataDespesaReceita).add(i*6, 'months');
          var fluxo = new Fluxo({
            dataParc: dateNew,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })
          fluxo.save(function(err, result) {})
        }

      }else if(periodo == 'anual'){
        var fluxo = new Fluxo({
            dataParc: dataDespesaReceita,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })          
          fluxo.save(function(err, result) {})
        for(let i = 1; i < parcela; i++){
          var dateNew = moment(dataDespesaReceita).add(i, 'years');
          var fluxo = new Fluxo({
            dataParc: dateNew,
            dataVencimento: "",
            fornecedor: descricao,
            valorPgto: valorPagto,
            hash: hash,
            tabela: "dr"
          })          
          fluxo.save(function(err, result) {})
        }
      }
    }
  }else{
    var fluxo = new Fluxo({
        dataParc: dataDespesaReceita,
        dataVencimento: "",
        fornecedor: descricao,
        valorPgto: valorPagto,
        hash: hash,
        tabela: "dr"
      })
      
    fluxo.save(function(err, result) {})
  }

  res.status(201).json({
    msg: "sucesso"
  })
})

router.get('/show/:hash/:tabela', function(req, res, next) {
  var hash = req.params.hash;
  var tabela = req.params.tabela;

  if(tabela=="compra"){
    Produto.find({hash: hash},function(err, doc){
      res.status(200).json({
        obj: doc
      });
    })
  }else if(tabela=="venda"){
    Venda.find({hash: hash},function(err, doc){
      res.status(200).json({
        obj: doc
      });
    })
  }else if(tabela=="dr"){
    DespRec.find({hash: hash},function(err, doc){
      res.status(200).json({
        obj: doc
      });
    })
  }
})

router.get('/editar/:hash/:tabela', function(req, res, next) {
  var hash = req.params.hash;
  var tabela = req.params.tabela;
  ll = [];
  freteList = [];
  parcelasMatrix = [];

  if(tabela=="compra"){    
    Produto.find({hash: hash}, function(err1, doc1){ //todos os produtos da nota da compra 5
      //console.log(doc1)
      fornecedor = doc1[0].fornecedor;
      emissao = doc1[0].emissao;
      operacao = doc1[0].operacao;
      categoria = doc1[0].categoria;
      serie = doc1[0].serie;
      nf = doc1[0].nf;
      compra = doc1[0].compra;
      transportadora = doc1[0].transportadora;
      _dataParc = doc1[0].dataParc;
      dataParc = [];

      for(let j = 0; j < _dataParc.length; j++){
        var date = _dataParc[j].slice(0, 10);
        dataParc.push(date);
      }

      for(let i = 0; i < doc1.length; i++){
        ll.push(doc1[i].produto[0]);
        for(let j = 0; j < doc1[0].parcFrete.length; j++){
          freteList.push(doc1[i].parcFrete[j]);
        }
        
        parcelasMatrix.push(doc1[i].parc);
        parcelasMatrix.push(doc1[i].parcFrete);
      }
      var uniqueProduct = ll.filter(function(elem, index, self){ // 0 => lista de todos os produtos
        return index == self.indexOf(elem);
      })
      var somarFrete = freteList.reduce((a, b) => a + b, 0);
      frete = somarFrete;

      var matrix = function sumByIndex(arr) {
          return arr.map( (item, idx) => {
              return arr.reduce( (prev, curr) => prev + curr[idx] , 0 )
          })
      }
      var parcelas = matrix(parcelasMatrix);
      var parcelasLista = parcelas.slice(0,dataParc.length);

      var funcao1 = function(key, callback){
        ll2 = [];
        Produto.find({ produto: key, vendido: false, hash: {$ne: hash}}, function (err, doc2) {
          qtd_total = doc2.length; //1 quantidade total de produtos não vendidos menos o da nota
          if(qtd_total > 0){
            for(let j = 0; j < qtd_total; j++){
              var produtosValor = doc2[j].val[0];
              ll2.push(produtosValor);
            }
            var sum = ll2.reduce((a, b) => a + b, 0);
            ll2 = [];
            var pm = sum/qtd_total;//2 preço medio do total de produtos não vendidos, não entra na conta a nota
          }else{
            pm = 0
          }
          callback(err, [qtd_total, sum, pm]);
        })
      };

      var funcao2 = function(key, callback){
        ll3 = [];
        Produto.find({ produto: key, vendido: false, hash: hash}, function (err, doc3) {
          var qtd_nota = doc3.length; //3 quantidade do produto na nota da compra que não foram vendidos
          for(let j = 0; j < qtd_nota; j++){
            var produtosValorNota = doc3[j].val[0];
            ll3.push(produtosValorNota);
          }
          var sumNota = ll3.reduce((a, b) => a + b, 0); //6 preço total do produto na nota
          ll3 = [];
          var pmNota = sumNota/qtd_nota; //4 preço medio dos produtos não vendidos da nota
          callback(err, [qtd_nota, sumNota, pmNota]);
        });
      }

      async.map(uniqueProduct, funcao1, function (err1, result1) {
        async.map(uniqueProduct, funcao2, function (err2, result2) {
          //console.log(result1); //[ [ 4, 800, 200 ], [ 0, undefined, 0 ] ]
          //console.log(result2); //[ [ 5, 500, 100 ], [ 6, 1200, 200 ] ]
          var pms = [];
          for(let i = 0; i < result1.length; i++){
            var qtd1 = result1[i][0];
            var qtd2 = result2[i][0];
            var sum1 = result1[i][1];
            var sum2 = result2[i][1];
            if(sum1 == undefined){sum1 = 0;}
            if(sum2 == undefined){sum2 = 0;}

            var quantidade = qtd1 +qtd2;
            var soma = sum1 + sum2;
            var pm_total_nota = soma/quantidade;
            pms.push(pm_total_nota) //6 preço total do produto na nota
          }

          qtdTotal = [];
          pmTotal = [];
          qtdNota = [];
          pmTotalNota = [];
          valTotalNota = [];
          for(let i = 0; i < result1.length; i++){
            qtdTotal.push(result1[i][0]) //1 quantidade total de produtos não vendidos menos o da nota
            pmTotal.push(result1[i][2]) //2 preço medio do total de produtos não vendidos, não entra na conta a nota
            qtdNota.push(result2[i][0]) //3 quantidade do produto na nota da compra que não foram vendidos
            pmTotalNota.push(result2[i][2]) //4 preço medio dos produtos não vendidos da nota
            valTotalNota.push(result2[i][1]) //5 preço medio de todos os produtos não vendidos
          }

          document = {
            fornecedor: fornecedor,
            emissao: emissao,
            operacao: operacao,
            categoria: categoria,
            serie: serie,
            nf: nf,
            compra: compra,
            uniqueProduct: uniqueProduct,
            qtdTotal: qtdTotal,
            pmTotal: pmTotal,
            qtdNota: qtdNota,
            pmTotalNota: pmTotalNota,
            pms: pms,
            valTotalNota: valTotalNota, //nao esta sendo usado
            transportadora: transportadora,
            frete: frete,
            dataParc: dataParc,
            parcelas: parcelasLista
            
          }
          res.status(200).json({
            obj: document
          });

        });
      });
    })
  }else if(tabela=="venda"){
    Venda.find({hash: hash},function(err, doc){
      res.status(200).json({
        obj: doc
      });
    })
  }else if(tabela=="dr"){
    DespRec.find({hash: hash},function(err, doc){
      res.status(200).json({
        obj: doc
      });
    })
  }
})
module.exports = router;