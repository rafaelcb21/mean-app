import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';
import { Config } from '../config';

@Injectable()
export class DespesasReceitasService {
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
    
    postDespesasReceitas(
            descricao,
            selectedCategoria,
            tipo,
            valor,
            dataDespesaReceita,
            repetir,
            fixaparcelada,
            periodo,
            parcela,
            hash,
            editar,
            hashExcluir
        ) {
        const body = JSON.stringify({
            descricao: descricao,
            selectedCategoria: selectedCategoria,
            tipo: tipo,
            valor: valor,
            dataDespesaReceita: dataDespesaReceita,
            repetir: repetir,
            fixaparcelada: fixaparcelada,
            periodo: periodo,
            parcela: parcela,
            hash: hash,
            editar: editar,
            hashExcluir: hashExcluir
        });
        const header = new Headers({'Content-Type': 'application/json'});
        return this._http.post(Config.URL_SITE + 'lista/despesas-receitas', body, {headers: header})
            .map(response => response.json().label)
            .catch(error => Observable.throw(error.json()));
        }

    exluirNotaDR(hash) {
        const body = JSON.stringify({hash: hash});
        const header = new Headers({'Content-Type': 'application/json'});
        return this._http.post(Config.URL_SITE + 'lista/excluirNotaDR', body, {headers: header})
            .map(response => response.json().msg)
            .catch(error => Observable.throw(error.json()));
    }
}