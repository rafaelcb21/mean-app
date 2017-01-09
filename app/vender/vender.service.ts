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

    postItem(label, lista) {
        const body = JSON.stringify({label: label, lista: lista});
        const header = new Headers({'Content-Type': 'application/json'});
        return this._http.post(Config.URL_SITE + 'lista/item', body, {headers: header})
            .map(response => response.json().label)
            .catch(error => Observable.throw(error.json()));
    }
}