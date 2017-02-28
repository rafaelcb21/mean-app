import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';
import { Config } from '../config';
import * as moment from 'moment';

@Injectable()
export class CaixaService {

    dataObject = [];
    filter = [
        {label:'Escolha o Periodo', value:null},
        {label:'Todos', value:'todos'}
    ];
    constructor(private _http: Http) {}

    fc(){
        return this._http.get(Config.URL_SITE + 'lista/fc')
            .map(response => {
                if(response.json().compra.length > 0){                
                    const saldo_diaria = response.json().compra;
                    const linha = response.json().linhas_compra;
                    var saldoLista = [];
                    var onlySaldo = [];
                    var saldoAcumulado = [];
                    var linhaCompra = [];
                    this.dataObject = [];
                    var diaEdit: string;
                    var mesEdit: string;

                    for(let i = 0; i < saldo_diaria.length; i++) {
                        var dia = saldo_diaria[i]._id.day;
                        var mes = saldo_diaria[i]._id.month;
                        var ano = saldo_diaria[i]._id.year;

                        if(dia.toString().length == 1){var diaEdit = "0" + dia.toString()}else{diaEdit = dia.toString()}
                        if(mes.toString().length == 1){var mesEdit = "0" + mes.toString()}else{mesEdit = mes.toString()}

                        var data = ano + "-" + mesEdit + "-" + diaEdit;
                        var saldo = saldo_diaria[i].value;
                        saldoLista.push([data, saldo]);
                        
                    }

                    saldoLista.sort();

                    for(let i = 0; i < saldoLista.length; i++) {
                        onlySaldo.push(saldoLista[i][1]);
                    }

                    onlySaldo.reduce(function(a,b,i) { return saldoAcumulado[i] = a+b; },0);
                    
                    for(let i = 0; i < saldoAcumulado.length; i++) {
                        saldoLista[i].push(saldoAcumulado[i]);
                    }

                    for(let i = 0; i < linha.length; i++) {
                        var hash = linha[i].hash;
                        var dataParc = linha[i].dataParc.slice(0, 10);
                        var tabela = linha[i].tabela;
                        if(linha[i].dataVencimento != null) {
                            var venc = linha[i].dataVencimento.slice(0, 10);
                        }else{
                            venc=""
                        }                    
                        var fornecedor = linha[i].fornecedor;
                        var valor = linha[i].valorPgto;
                        linhaCompra.push([dataParc, hash, venc, fornecedor, valor, tabela]);
                    }
                    
                    for(let i = 0; i < linhaCompra.length; i++) {
                        var dataLinha = linhaCompra[i][0];

                        for(let j = 0; j < saldoLista.length; j++) {
                            var dataSaldoAcumulado = saldoLista[j][0];
                            var saldoDoDia = saldoLista[j][1];
                            var valorAcumulado = saldoLista[j][2];

                            if(dataLinha == dataSaldoAcumulado) {
                                linhaCompra[i].push(saldoDoDia)
                                linhaCompra[i].push(valorAcumulado)
                            }
                        }
                    }         
                    
                    var ll = linhaCompra.sort();
                    
                    var ll2 = [];
                    for(let i = 0; i < ll.length-1; i++) {
                        var dataAtual = ll[i][0];
                        var dataNext = ll[i+1][0];
                        var hashAtual = ll[i][1];
                        var vencimentoAtual = ll[i][2];
                        var fornencedorAtual = ll[i][3];
                        var valorCompraAtual = ll[i][4];
                        var tabelaAtual = ll[i][5];

                        if(dataAtual == dataNext) {
                            ll2.push([dataAtual, hashAtual, vencimentoAtual, fornencedorAtual, valorCompraAtual, tabelaAtual, "", ""])
                        }else if(dataAtual != dataNext){
                            var linhaSemAlterar = ll[i];
                            ll2.push(linhaSemAlterar);
                        }
                    }
                    
                    ll2.push(ll[ll.length-1]); //ultimo valor da tabela ll2
                    var dataAgora = moment().format("YYYY-MM");
                    
                    for(let i = 0; i < ll2.length; i++) {
                        var dict = {}
                        dict["order"] = i;
                        dict["data"] = ll2[i][0];
                        dict["hash"] = ll2[i][1];
                        dict["vencimento"] = ll2[i][2];
                        dict["nome"] = ll2[i][3];
                        dict["valor"] = ll2[i][4];
                        dict["tabela"] = ll2[i][5];
                        dict["saldo"] = ll2[i][6];
                        dict["acumulado"] = ll2[i][7];
                        this.dataObject.push(dict);
                    }
                    
                    var mesSearch = [];
                    var lista = [];
                    var mesNome: string;
                    var anoNum: string;
                    
                    /** Irá gerar this.filter uma lista dos meses que compoe o fluxo de CaixaService
                     * que será usada no dropdown "Escolha o período"
                    */
                    for(let i = 0; i < this.dataObject.length; i++) {
                        var anoMes = this.dataObject[i].data.substring(0,7);
                        if( anoMes == dataAgora){
                            mesSearch.push(this.dataObject[i])
                        }                    
                        lista.push(anoMes)
                    }

                    var unique = lista.filter(function(elem, index, self) {
                        return index == self.indexOf(elem);
                    })

                    for(let i = 0; i < unique.length; i++) {
                        var mesFiltro = unique[i].substring(5,7);
                        anoNum = unique[i].substring(0,4);

                        if(mesFiltro == "01"){mesNome = "Janeiro"}
                        if(mesFiltro == "02"){mesNome = "Fevereiro"}
                        if(mesFiltro == "03"){mesNome = "Março"}
                        if(mesFiltro == "04"){mesNome = "Abril"}
                        if(mesFiltro == "05"){mesNome = "Maio"}
                        if(mesFiltro == "06"){mesNome = "Junho"}
                        if(mesFiltro == "07"){mesNome = "Julho"}
                        if(mesFiltro == "08"){mesNome = "Agosto"}
                        if(mesFiltro == "09"){mesNome = "Setembro"}
                        if(mesFiltro == "10"){mesNome = "Outubro"}
                        if(mesFiltro == "11"){mesNome = "Novembro"}
                        if(mesFiltro == "12"){mesNome = "Dezembro"}

                        this.filter.push({label: mesNome+" - "+anoNum, value: unique[i]})
                    }
                    return {"data": this.dataObject}
                }
            })
            .catch(error => error.json().msg);
    }

    show(hash, tabela){
        return this._http.get(Config.URL_SITE + 'lista/show/'+hash+'/'+tabela)
            .map(response => {
                if(tabela=="compra"){
                    const obj = response.json().obj;
                    var documento = {};

                    var fornecedor = obj[0].fornecedor;
                    var emissao = obj[0].emissao.substring(0,10);
                    var operacao = obj[0].operacao;
                    var categoria = obj[0].categoria;

                    var serie = obj[0].serie;
                    var nf = obj[0].nf;
                    var compra = obj[0].compra;

                    if(serie == undefined || serie == "" || serie == null) { serie = ""}
                    if(nf == undefined || nf == "" || nf == null) { nf = ""}
                    if(compra == undefined || compra == "" || compra == null) { compra = ""}
                    
                    var transportadora = obj[0].transportadora;
                    var dataParc = obj[0].dataParc;

                    var cabecalho = [fornecedor, emissao, operacao, categoria, serie, nf, compra]; //cabeçalho
                    var ll = [];
                    var ll2 = [];
                    var ll3 = [];
                    var listProdutos = [];
                    var parcelasArredondada = [];
                    var parcelasTotal = [];

                    for(let i = 0; i < obj.length; i++){
                        var produto = obj[i].produto[0];
                        var qtd = obj[i].qtd[0];
                        var val = obj[i].val[0];
                        var soma = parseFloat(qtd) * val;
                        ll.push(produto+";"+qtd+";"+String(val)+";"+String(soma));                    
                    }

                    var produtos = ll.filter(function(elem, index, self) { //produtos
                        return index == self.indexOf(elem);
                    })
                    
                    for(let i = 0; i < produtos.length; i++){
                        var y = produtos[i].split(";");
                        listProdutos.push(y);
                    }                
                    
                    for(let i = 0; i < obj.length; i++){
                        for(let j = 0; j < obj[i].parcFrete.length; j++){
                            var parcFrete = obj[i].parcFrete[j];
                            ll2.push(parcFrete)
                        }
                        ll3.push(obj[i].parc) //sera usado para calcular cada parcela
                        ll3.push(obj[i].parcFrete)  
                    }

                    var parcFreteTotal = ll2.reduce((a, b) => a + b, 0);
                    var frete = [transportadora, parcFreteTotal]; //frete

                    var matrix = function sumByIndex(arr) {
                        return arr.map( (item, idx) => {
                            return arr.reduce( (prev, curr) => prev + curr[idx] , 0 )
                        })
                    }

                    var parcelas = matrix(ll3);

                    var parcelasLista = parcelas.slice(0,dataParc.length);

                    for(let i = 0; i < parcelasLista.length; i++){
                            var z = this.arredondar(parcelasLista[i]);
                            var x = parseFloat(z).toFixed(2); //string
                            parcelasArredondada.push(x) //parcelas
                    }

                    for(let i = 0; i < parcelasArredondada.length; i++){
                            parcelasTotal.push([dataParc[i], parcelasArredondada[i]])
                    }


                    documento = { 
                        fornecedor: cabecalho[0],
                        emissao: cabecalho[1],
                        operacao: cabecalho[2],
                        categoria: cabecalho[3],
                        serie: cabecalho[4],
                        nf: cabecalho[5],
                        compra: cabecalho[6],
                        produtos: listProdutos, //lista
                        transportadora: frete[0],
                        frete: frete[1],
                        parcelas: parcelasTotal //lista
                    }
                    return documento;
                }

                 if(tabela == "venda"){
                    const obj = response.json().obj;
                    var documento = {};
                    var cliente = obj[0].cliente;
                    var emissao = obj[0].emissao.substring(0,10);
                    var operacao = obj[0].operacao;
                    var categoria = obj[0].categoria;

                    var serie = obj[0].serie;
                    var venda = obj[0].venda;

                    if(serie == undefined || serie == "" || serie == null) { serie = ""}
                    if(venda == undefined || venda == "" || venda == null) { venda = ""}
                    
                    var transportadora = obj[0].transportadora;
                    var dataParc = obj[0].dataParc;
                    var vencimento = obj[0].vencimento;

                    var cabecalho = [cliente, emissao, operacao, categoria, serie, venda]; //cabeçalho

                    var ll = [];
                    var ll2 = [];
                    var ll3 = [];
                    var listProdutos = [];
                    var parcelasArredondada = [];
                    var parcelasTotal = [];

                    for(let i = 0; i < obj.length; i++){
                        var produto = obj[i].produto[0];
                        var qtd = obj[i].qtd[0];
                        var pm = obj[i].pm[0];
                        var margem = obj[i].margem[0];
                        var soma = parseFloat(qtd) * pm * ((margem/100)+1);
                        ll.push(produto+";"+qtd+";"+String(pm)+";"+String(margem)+"%;"+String(soma));                    
                    }

                    var produtos = ll.filter(function(elem, index, self) { //produtos
                        return index == self.indexOf(elem);
                    })

                    for(let i = 0; i < produtos.length; i++){
                        var y = produtos[i].split(";");
                        listProdutos.push(y);
                    }                

                    for(let i = 0; i < obj.length; i++){
                        for(let j = 0; j < obj[i].parcFrete.length; j++){
                            var parcFrete = obj[i].parcFrete[j];
                            ll2.push(parcFrete)
                        }
                        ll3.push(obj[i].parc) //sera usado para calcular cada parcela
                        ll3.push(obj[i].parcFrete)  
                    }

                    var parcFreteTotal = ll2.reduce((a, b) => a + b, 0);
                    var frete = [transportadora, parcFreteTotal]; //frete

                    var matrix = function sumByIndex(arr) {
                        return arr.map( (item, idx) => {
                            return arr.reduce( (prev, curr) => prev + curr[idx] , 0 )
                        })
                    }

                    var parcelas = matrix(ll3);
                    var parcelasLista = parcelas.slice(0,dataParc.length);

                    for(let i = 0; i < parcelasLista.length; i++){
                            var z = this.arredondar(parcelasLista[i]);
                            var x = parseFloat(z).toFixed(2); //string
                            parcelasArredondada.push(x) //parcelas
                    }

                    for(let i = 0; i < parcelasArredondada.length; i++){
                            parcelasTotal.push([vencimento[i], dataParc[i], parcelasArredondada[i]])
                    }

                    documento = { 
                        cliente: cabecalho[0],
                        emissao: cabecalho[1],
                        operacao: cabecalho[2],
                        categoria: cabecalho[3],
                        serie: cabecalho[4],
                        venda: cabecalho[5],
                        produtos: listProdutos, //lista
                        transportadora: frete[0],
                        frete: frete[1],
                        parcelas: parcelasTotal //lista
                    }
                    return documento;
                 }

                 if(tabela == "dr"){
                    const obj = response.json().obj;
                    var documento = {};
                    var descricao = obj[0].descricao;
                    var categoria = obj[0].selectedCategoria;
                    var tipo = obj[0].tipo;
                    var valor = obj[0].valor;
                    var data = obj[0].dataDespesaReceita;
                    var repetir = obj[0].repetir;

                    if(repetir == true) {
                        var fixaparcelada = obj[0].fixaparcelada;
                        if(fixaparcelada == "fixa"){
                            var periodo = obj[0].periodo;
                            documento = { 
                                descricao: descricao,
                                categoria: categoria,
                                tipo: tipo,
                                valor: valor,
                                data: data,
                                fixaparcelada: fixaparcelada,
                                periodo: periodo,
                                parcela: "false"
                            }
                        }else if(fixaparcelada == "parcelada"){
                            var periodo = obj[0].periodo;
                            var parcela = obj[0].parcela;
                            documento = { 
                                descricao: descricao,
                                categoria: categoria,
                                tipo: tipo,
                                valor: valor,
                                data: data,
                                fixaparcelada: fixaparcelada,
                                periodo: periodo,
                                parcela: parcela
                            }
                        }                    
                    }else{
                        documento = { 
                            descricao: descricao,
                            categoria: categoria,
                            tipo: tipo,
                            valor: valor,
                            data: data,
                            fixaparcelada: "false",
                            periodo: "false",
                            parcela: "false"
                        }
                    }
                    return documento;
                 }
            }
        )
            .catch(error => Observable.throw(error.json()));
    }

    editar(hash, tabela){
        return this._http.get(Config.URL_SITE + 'lista/editar/'+hash+'/'+tabela)
            .map(response => {
                const obj = response.json().obj;
                return obj;
            })
            .catch(error => Observable.throw(error.json()))
    }

    arredondar(x) {
        if (Math.abs(x) < 1.0) {
            var e = parseInt(x.toString().split('e-')[1]);
            if (e) {
              x *= Math.pow(10,e-1);
              x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
            }
        } else {
        var e = parseInt(x.toString().split('+')[1]);
        if (e > 20) {
            e -= 20;
            x /= Math.pow(10,e);
            x += (new Array(e+1)).join('0');
        }
      }
      return x;
    }
}