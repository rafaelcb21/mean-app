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
                const saldo_diaria = response.json().compra;
                const linha = response.json().linhas_compra;
                var saldoLista = [];
                var onlySaldo = [];
                var saldoAcumulado = [];
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
                    if(linha[i].dataVencimento != null) {
                        var venc = linha[i].dataVencimento.slice(0, 10);
                    }else{
                        venc=""
                    }                    
                    var fornecedor = linha[i].fornecedor;
                    var valor = linha[i].valorPgto;
                    linhaCompra.push([dataParc, hash, venc, fornecedor, valor]);
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

                    if(dataAtual == dataNext) {
                        ll2.push([dataAtual, hashAtual, vencimentoAtual, fornencedorAtual, valorCompraAtual, "", ""])
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
                    dict["saldo"] = ll2[i][5];
                    dict["acumulado"] = ll2[i][6];
                    this.dataObject.push(dict);
                }

                var mesSearch = [];
                var lista = [];
                var mesNome: string;
                var anoNum: string;
                
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
                return {"data": mesSearch}
            })
            .catch(error => Observable.throw(error.json()));
    }

}