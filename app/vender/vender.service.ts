import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';
import { Config } from '../config';

@Injectable()
export class VenderService {
    constructor(private _http: Http) {}

    getItem(label) {
        return this._http.get(Config.URL_SITE + 'lista/item/' + label)
            .map(response => {
                const data = response.json().obj;
                const labelItem = response.json().label;
                if(data.length > 0){
                    let objs: any[] = [];
                    //var label = data[0].label;
                    //objs.push({label: label, value: {name: label}})
                    for (let i = 0; i < data.length; i++) {
                        var name = data[i].name
                        var item = {label: name, value: {name: name}}
                        objs.push(item)
                    }
                    return [objs, labelItem];
                }else if(data.length == 0){
                    return [{label: labelItem, value: {name: labelItem}}]
                }
            })
            .catch(error => Observable.throw(error.json()));
    }

    removeDuplicates(num) {  
        var x,  
            len=num.length,  
            out=[],  
            obj={};  
        
        for (x=0; x<len; x++) {  
            obj[num[x]]=0;  
        }  
        for (x in obj) {  
            out.push(x);  
        }  
        return out;
    } 

    verificarQtd(selectedProduto, quantidade){
        const body = JSON.stringify({selectedProduto: selectedProduto, quantidade: quantidade});
        const header = new Headers({'Content-Type': 'application/json'});
        return this._http.post(Config.URL_SITE + 'lista/qtdProdutos', body, {headers: header})
            .map(response => {
                var isTrueSet = (response.json().check === 'true');
                return isTrueSet
            })
            .catch(error => Observable.throw(error.json()));
    }

    verificarQtd2(selectedProduto1, quantidade1, selectedProduto2, quantidade2){
        var b = quantidade1.concat(quantidade2);
        var selectedProduto = selectedProduto1.concat(selectedProduto2);
        var dict = {};
        var produtos = [];
        var qtd = [];
        var quantidade = b.map(Number); //lista de numeros

        for(let i = 0; i < selectedProduto.length; i++) {
            dict[selectedProduto[i]] = []; //dicionario dos produtos sem duplicação
        }

        for(let i = 0; i < quantidade.length; i++) {
            dict[selectedProduto[i]].push(quantidade[i]) //insere a quantidade de cada produto na chave especifica do produto
        }
        
        for (var key in dict) {
            produtos.push(key);
            var x = dict[key].reduce((a, b) => a + b, 0); //soma a quantidade de cada produto e insere na mesma ordem da lista de selectedProduto
            qtd.push(x)
        }

        const body = JSON.stringify({selectedProduto: produtos, quantidade: qtd});
        const header = new Headers({'Content-Type': 'application/json'});
        return this._http.post(Config.URL_SITE + 'lista/qtdProdutos', body, {headers: header})
            .map(response => {
                var isTrueSet = (response.json().check === 'true');
                return isTrueSet
            })
            .catch(error => Observable.throw(error.json()));
    }

    getItemProduto() {
        return this._http.get(Config.URL_SITE + 'lista/produto')
            .map(response => {
                const data = response.json().obj;
                if(data.length > 0){
                    let produtos: any[] = [];
                    let produtosListaUnicos: any[] = [];
                    for (let i = 0; i < data.length; i++) {
                        var produto = data[i].produto[0];
                        produtos.push(produto);
                    }
                    var produtosLista = this.removeDuplicates(produtos);
                    for (let i = 0; i < produtosLista.length; i++) {
                        var item = {label: produtosLista[i], value: {name: produtosLista[i]}};
                        produtosListaUnicos.push(item);
                    }
                    return [produtosListaUnicos, "Produto"];
                }else if(data.length == 0){
                    return [{label: "Produto", value: {name: "Produto"}}]
                }
            })
            .catch(error => Observable.throw(error.json()));
    }

    getItemProdutoQuantidade(produto) {
        return this._http.get(Config.URL_SITE + 'lista/produtoQuantidade?produto='+produto)
            .map(response => {
                 const data = response.json().obj;
                 const docs = response.json().objs;
                 var precos = [];
                 for (let i = 0; i < docs.length; i++) {         
                    var preco = docs[i].val[0];
                    precos.push(preco)
                }
                var sum = precos.reduce((a, b) => a + b, 0);
                var preco_medio = sum/data;
                return [data, preco_medio];
            })
            .catch(error => Observable.throw(error.json()));
    }

    postItem(label, lista) {
        const body = JSON.stringify({label: label, lista: lista});
        const header = new Headers({'Content-Type': 'application/json'});
        return this._http.post(Config.URL_SITE + 'lista/item', body, {headers: header})
            .map(response => response.json().label)
            .catch(error => Observable.throw(error.json()));
    }

    postVenda(
        selectedCliente,
        valueEmissao,
        selectedOperacao,
        selectedCategoria,
        serie,
        venda,
        selectedProduto,
        pm,
        quantidade,
        margem,
        selectedTransportadora,
        frete,
        valorPgto,
        vencimento,
        datePgto,
        proporcaoList,
        soma,
        hash
    ) {
        const body = JSON.stringify({
            selectedCliente: selectedCliente,
            valueEmissao: valueEmissao,
            selectedOperacao: selectedOperacao,
            selectedCategoria: selectedCategoria,
            serie: serie,
            venda: venda,
            selectedProduto: selectedProduto,
            pm: pm,
            quantidade: quantidade,
            margem: margem,
            selectedTransportadora: selectedTransportadora,
            frete: frete,
            valorPgto: valorPgto,
            vencimento: vencimento,
            datePgto: datePgto,
            proporcaoList: proporcaoList,
            soma: soma,
            hash: hash
        });
        const header = new Headers({'Content-Type': 'application/json'});
        return this._http.post(Config.URL_SITE + 'lista/venda', body, {headers: header})
            .map(response => response.json().msg)
            .catch(error => Observable.throw(error.json()));
    }

    excluirVenda(hash) {
        const body = JSON.stringify({hash: hash});
        const header = new Headers({'Content-Type': 'application/json'});
        return this._http.post(Config.URL_SITE + 'lista/excluirVenda', body, {headers: header})
            .map(response => response.json().msg)
            .catch(error => Observable.throw(error.json()));
    }

    postVenda2(
        cliente,
        emissaoFC,
        operacaoFC,
        categoriaFC,
        serieFC,
        vendaFC,
        selectedProduto,
        pm,
        quantidade,
        margem,
        selectedProduto2,
        pm2,
        quantidade2,
        margem2,
        transportadoraFC,
        freteFC,
        soma,
        vencimento,
        datePgto,
        valorPgto,
        subtracao,
        hash,
        proporcaoList
    ) {
        const body = JSON.stringify({
            selectedCliente: cliente,
            valueEmissao: emissaoFC,
            selectedOperacao: operacaoFC,
            selectedCategoria: categoriaFC,
            serie: serieFC,
            venda: vendaFC,
            selectedProduto: selectedProduto,
            pm: pm,
            quantidade: quantidade,
            margem: margem,
            selectedProduto2: selectedProduto2,
            pm2: pm2,
            quantidade2: quantidade2,
            margem2: margem2,
            selectedTransportadora: transportadoraFC,
            frete: freteFC,
            soma: soma,
            vencimento: vencimento,
            datePgto: datePgto,
            valorPgto: valorPgto,
            subtracao: subtracao,
            hash: hash,
            proporcaoList: proporcaoList            
        });
        const header = new Headers({'Content-Type': 'application/json'});
        return this._http.post(Config.URL_SITE + 'lista/vendaEdit', body, {headers: header})
            .map(response => response.json().msg)
            .catch(error => Observable.throw(error.json()));
    }
}