import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';
import { Config } from '../config';

@Injectable()
export class FornecedorService {
    constructor(private _http: Http) {}

    postItem(label, lista) {
        const body = JSON.stringify({label: label, lista: lista});
        const header = new Headers({'Content-Type': 'application/json'});
        return this._http.post(Config.URL_SITE + 'lista/item', body, {headers: header})
            .map(response => response.json().label)
            .catch(error => Observable.throw(error.json()));
    }

    postFornecedores(
        selectedFornecedor,
        valueEmissao,
        selectedOperacao,
        selectedCategoria,
        serie,
        nf,
        compra,
        selectedProduto,
        quantidade,
        valor,
        selectedTransportadora,
        frete,
        valorPgto,
        datePgto,
        proporcaoList,
        soma
    ) {
        const body = JSON.stringify({
            selectedFornecedor: selectedFornecedor,
            valueEmissao: valueEmissao,
            selectedOperacao: selectedOperacao,
            selectedCategoria: selectedCategoria,
            serie: serie,
            nf: nf,
            compra: compra,
            selectedProduto: selectedProduto,
            quantidade: quantidade,
            valor: valor,
            selectedTransportadora: selectedTransportadora,
            frete: frete,
            valorPgto: valorPgto,
            datePgto: datePgto,
            proporcaoList: proporcaoList,
            soma: soma
        });
        const header = new Headers({'Content-Type': 'application/json'});
        return this._http.post(Config.URL_SITE + 'lista/fornecedores', body, {headers: header})
            .map(response => response.json().msg)
            .catch(error => Observable.throw(error.json()));
    }

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
}