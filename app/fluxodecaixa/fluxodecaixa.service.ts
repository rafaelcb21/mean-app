import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';
import { Config } from '../config';

@Injectable()
export class CaixaService {
    constructor(private _http: Http) {}

    fc(){
        return this._http.get(Config.URL_SITE + 'lista/fc')
            .map(response => {
                const saldo_diaria = response.json().compra;
                const linha = response.json().linhas_compra;
                var saldoLista = [];
                var linhaCompra = [];
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

                for(let i = 0; i < linha.length; i++) {
                    var hash = linha[i].hash;
                    var dataParc = linha[i].dataParc.slice(0, 10);
                    var fornecedor = linha[i].fornecedor;
                    var valor = linha[i].valorPgto;
                    linhaCompra.push([dataParc, hash, "", fornecedor, valor]);
                }

                for(let i = 0; i < linhaCompra.length; i++) {
                    var dataLinha = linhaCompra[i][0];
                    for(let j = 0; j < saldoLista.length; j++) {
                        if(dataLinha == saldoLista[j][0]) {
                            linhaCompra[i].push(saldoLista[j][1])
                        }
                    }
                }

                var ll = linhaCompra.sort();
                var ll2 = []

                for(let i = 0; i < ll.length-1; i++) {
                    if(ll[i][0] == ll[i+1][0]) {
                        ll2.push([ll[i][0], ll[i][1], ll[i][2], ll[i][3], ll[i][4], ""])
                    }else if(ll[i][0] != ll[i+1][0]){
                        ll2.push(ll[i])
                    }
                }

                ll2.push(ll[ll.length-1])

                console.log(saldoLista)
                console.log(linhaCompra.sort())
                console.log(ll2)

            })
            .catch(error => Observable.throw(error.json()));
    }

}