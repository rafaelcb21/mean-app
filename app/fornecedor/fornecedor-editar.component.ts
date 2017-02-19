import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { FornecedorService } from './fornecedor.service';
import { CaixaService } from '../fluxodecaixa/fluxodecaixa.service';
import { Message, MenuItem } from 'primeng/primeng';
import { VenderService } from '../vender/vender.service';
import * as moment from 'moment';

declare var sha256: any;

@Component({
    selector: '<fornecedor-editar></fornecedor-editar>',
    templateUrl: './js/app/fornecedor/fornecedor-editar.component.html',
    styleUrls: ['./js/app/fornecedor/fornecedor-editar.component.css'],
})
export class FornecedorEditarComponent implements OnInit {
    private menus: MenuItem[];
    fornecedores: SelectItem[];
    operacao: SelectItem[];
    categoria: SelectItem[];
    produto: SelectItem[];
    transportadora: SelectItem[];
    selectedFornecedor: string;
    selectedOperacao: string;
    selectedCategoria: string;
    selectedTransportadora: string;
    valueEmissao: Date;

    fornecedorFC: string;
    emissaoFC: string;
    operacaoFC: string;
    categoriaFC: string;
    serieFC: string;
    nfFC: string;
    compraFC: string;
    transportadoraFC: string;
    freteFC: string;
    parcelasFC = [];

    quantidade2 = [];
    valor2 = [];
    pm2 = [];
    selectedProduto2 = [];
    pmNovo2 = [];
    quantidadeAtual2 = [];
    items2 = [];

    serie: Number;
    nf: Number;
    compra: Number;
    label: string;
    item: string;
    items = [];
    quantidade = [];
    quantidadeAtual = [];
    valor = [];
    valorEdit = [];
    selectedProduto = [];
    total = [];
    itemsPgto = [];
    valorPgto = [];
    datePgto = [];
    frete: any;
    sum: any;
    sumPgto: any;
    ll = [];
    ll2 = [];
    pp = [];
    pm = [];
    pmNovo = [];
    proporcao = [];
    subtracao: any;
    text: string;    
    results: any[] = [];
    verify = false;
    br: any;
    check: Boolean;
    checkError:  Boolean;
    msgs: Message[] = [];

    fornecedoresList: any[] = [];
    searchFornecedorList: any[] = [];

    operacaoList: any[] = [];
    searchOperacaoList: any[] = [];

    categoriaList: any[] = [];
    searchCategoriaList: any[] = [];

    produtoList: any[] = [];
    searchProdutoList: any[] = [];

    transportadoraList: any[] = [];
    searchTransportadoraList: any[] = [];

    //calendario: Date = new Date("01-08-2016");
    //calendarPgto = [];
    hash: string;
    selectedProd = [];
    origem: string;

    constructor(private _router: Router,
        private fornecedorService: FornecedorService,
        private venderService: VenderService,
        private activatedRoute: ActivatedRoute,
        private caixaService: CaixaService
    ){}

    ngOnInit() {
        this.frete = 0;
        this.sum = 0;
        this.subtracao = 0.00;

        this.activatedRoute.params.subscribe((params: Params) => {
            this.hash = params['hash'];
            let tabela = params['tabela'];
            this.origem = params['origem'];

            this.caixaService.editar(this.hash, tabela).subscribe(
                data => {
                    this.fornecedorFC = data.fornecedor;
                    this.emissaoFC = data.emissao;
                    this.operacaoFC = data.operacao;
                    this.categoriaFC = data.categoria;
                    this.serieFC = data.serie;
                    this.nfFC = data.nf;
                    this.compraFC = data.compra;

                    this.selectedProduto = data.uniqueProduct; //lista

                    for(let i = 0; i < this.selectedProduto.length; i++){
                        this.items.push(i)
                    }

                    this.quantidadeAtual = data.qtdTotal; //lista
                    this.pm = data.pmTotal; //lista
                    this.quantidade = data.qtdNota; //lista                        
                    this.valor = data.pmTotalNota; //lista
                    this.pmNovo = data.pms; //lista

                    this.transportadoraFC = data.transportadora;
                    this.freteFC = data.frete;

                    //this.datePgto = data.dataParc; //lista
                    
                    for(let i = 0; i < data.dataParc.length; i++){
                        this.itemsPgto.push(i)
                        var x = moment(data.dataParc[i]).format("MM-DD-YYYY"); //convert para MM-DD-YYYY
                        var y = new Date(x); //converto para tipo Date
                        this.datePgto.push(y);
                    }
                    this.valorPgto = data.parcelas; //lista
                },
                error => console.log(error)
            )
        });        

        this.fornecedorService.getItem("Produto")
            .subscribe(
                data => {
                    for(let i = 0; i < data[0].length; i++) {
                        this.produtoList.push(data[0][i].label);
                    }
                },
                error => {
                    console.log(error)
                }                
            );

        this.fornecedorService.getItem("Transportadora")
            .subscribe(
                data => {
                    for(let i = 0; i < data[0].length; i++) {
                        this.transportadoraList.push(data[0][i].label);
                    }
                },
                error => {
                    console.log(error)
                }                
            );

        this.br = {
            //data
            closeText: "Pronto",
        	prevText: "<Ant",
        	nextText: "Pro>",
        	currentText: "Hoje",
        	monthNames: [ "janeiro","fevereiro","março","abril","maio","junho",
        	"julho","agosto","setembro","outubro","novembro","dezembro" ],
        	monthNamesShort: [ "jan","fev","mar","abr","mai","jun",
        	"jul","ago","set","out","nov","dez" ],
        	dayNames: [ "domingo","segunda","terça","quarta","quinta","sexta","sábado" ],
        	dayNamesShort: [ "dom","seg","ter","qua","qui","sex","sáb" ],
        	dayNamesMin: [ "D","S","T","Q","Q","S","S" ],
        	weekHeader: "Sm",
        	dateFormat: "dd/mm/yy",
        	firstDay: 1,
        	isRTL: false,
        	showMonthAfterYear: false,
        	yearSuffix: "",

            //tempo
            timeOnlyTitle: 'Escolher horário',
    		timeText: 'Hora',
    		hourText: 'Horas',
    		minuteText: 'Minutos',
    		secondText: 'Segundos',
    		millisecText: 'Milisegundos',
    		microsecText: 'Microsegundos',
    		timezoneText: 'Fuso horario',
    		timeFormat: 'HH:mm',
    		timeSuffix: '',
    		amNames: ['a.m.', 'AM', 'A'],
    		pmNames: ['p.m.', 'PM', 'P'],
        };

        this.menus = [
            {
                label: 'Comprar Produto',
                routerLink: ['/fornecedor']
            },
            {
                label: 'Vender Produto',
                routerLink: ['/vender']
            },
            {
                label: 'Despesas e Receitas',
                routerLink: ['/despesasreceitas']
            },
            {
                label: 'Fluxo de Caixa',
                routerLink: ['/fluxodecaixa']
            },
            {
                label: 'Editar Lista',
            }
        ];
    }

    randomString(length, chars) {
        var mask = '';
        if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
        if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (chars.indexOf('#') > -1) mask += '0123456789';
        if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
        var result = '';
        for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
        return result;
    }

    onlyNumber(event){
        var lista = [48,49,50,51,52,53,54,55,56,57];
        var result = lista.indexOf(event.keyCode);
        if(result == -1) {
            return false
        }else{
            return true
        }        
    }

    onlyNumberZero(event){
        var lista = [49,50,51,52,53,54,55,56,57];
        var result = lista.indexOf(event.keyCode);
        if(result == -1) {
            return false
        }else{
            return true
        }        
    }

    onlyDate(event){
        return false
    }

    proporcional() {
        this.pp = [];
        this.proporcao = [];
        for(let i = 0;  i < this.quantidade.length; i++) {
            var x = parseFloat(this.quantidade[i])*parseFloat(this.valor[i])
            this.pp.push(x)
        }
        for(let i = 0;  i < this.quantidade2.length; i++) {
            var x = parseFloat(this.quantidade2[i])*parseFloat(this.valor2[i])
            this.pp.push(x)
        }
        this.sum = this.pp.reduce((a, b) => a + b, 0) + this.freteFC;

        for(let i = 0;  i < this.pp.length; i++) {
            var y = parseFloat(this.pp[i])/this.sum;
            this.proporcao.push(y);
        }

        return this.proporcao;
    }

    somar() {
        this.ll = [];
        this.ll2 = [];
        for(let i = 0;  i < this.quantidade.length; i++) {
            var x = parseFloat(this.quantidade[i])*parseFloat(this.valor[i])
            this.ll.push(x)
        }
        for(let i = 0;  i < this.quantidade2.length; i++) {
            var y = parseFloat(this.quantidade2[i])*parseFloat(this.valor2[i])
            this.ll2.push(y)
        }
        var sum2 = this.ll2.reduce((a, b) => a + b, 0);
        this.sum = this.ll.reduce((a, b) => a + b, 0) + this.freteFC + sum2;

        return this.sum
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

    verificar() {
        this.sumPgto = this.valorPgto.reduce((a, b) => a + b, 0)
        this.subtracao = this.somar() - this.sumPgto;
        var z = this.arredondar(this.subtracao);
        if(parseFloat(z).toFixed(2) == "0.00"){
            this.check = true;
            this.checkError = false;
        }else{
            this.check = false;
            this.checkError = true;
        }
        return this.subtracao;
    }

    searchProduto(event) {
        this.searchProdutoList = [];
        for (let j = 0; j < this.produtoList.length; j++) {
            try{
                if (this.produtoList[j].match(event.query)) {
                    this.searchProdutoList.push(this.produtoList[j])
                }
            }catch(e){}
        }
    }

    searchTransportadora(event) {
        this.searchTransportadoraList = [];
        for (let j = 0; j < this.transportadoraList.length; j++) {
            try{
                if (this.transportadoraList[j].match(event.query)) {
                    this.searchTransportadoraList.push(this.transportadoraList[j])
                }
                //console.log(this.searchTransportadoraList)
            }catch(e){}
        }
    }

    salvar(
            fornecedorFC,
            emissaoFC,
            operacaoFC,
            categoriaFC,   
            hash,
            serieFC,
            nfFC,
            compraFC,
            selectedProduto, //lista
            quantidade, //lista
            valor, //lista
            selectedProduto2, //lista
            quantidade2, //lista
            valor2, //lista
            transportadoraFC,
            freteFC,
            sum,
            valorPgto, //lista
            datePgto, //lista
            subtracao
        ) {
            var listaVerify = [];

            if(selectedProduto2.indexOf("") != -1) {listaVerify.push(false)}else{listaVerify.push(true)}
            for (let j = 0; j < selectedProduto2.length; j++) {
                if (this.produtoList.indexOf(selectedProduto2[j]) == -1) {
                    listaVerify.push(false);
                    break;
                }else{listaVerify.push(true)}
            }

            //var qtd = quantidade.map(Number);
            //if(qtd.indexOf(0) != -1) {listaVerify.push(false)}else{listaVerify.push(true)}

            if(quantidade2.indexOf("") != -1) {listaVerify.push(false)}else{listaVerify.push(true)}
            var qtd2 = quantidade2.map(Number);
            if(qtd2.indexOf(0) != -1) {listaVerify.push(false)}else{listaVerify.push(true)}            

            //if(quantidade.length == 0) {listaVerify.push(false)}else{listaVerify.push(true)}

            if(valor2.indexOf("") != -1) {listaVerify.push(false)}else{listaVerify.push(true)}
            if(valor2.indexOf(0) != -1) {listaVerify.push(false)}else{listaVerify.push(true)}
            
            if(freteFC > 0) {
                if( (transportadoraFC == undefined) || 
                    (transportadoraFC == "") || 
                    (this.transportadoraList.indexOf(transportadoraFC) == -1)) {
                        listaVerify.push(false)
                    }else{listaVerify.push(true)}
            }else{
                transportadoraFC = "";
                listaVerify.push(true)
            }

            var num = parseInt(sum) || 0;

            if((valorPgto.indexOf("") != -1) || (valorPgto.indexOf(0) != -1)) {listaVerify.push(false)}else{listaVerify.push(true)}
            if(valorPgto.length == 0) {listaVerify.push(false)}else{listaVerify.push(true)}

            if((datePgto.indexOf("") != -1) || (datePgto.indexOf(null) != -1)) {listaVerify.push(false)}else{listaVerify.push(true)}
            if(datePgto.length == 0) {listaVerify.push(false)}else{listaVerify.push(true)}

            var somatorio = this.verificar();

            var z = this.toFixed(somatorio);

            if(z.toFixed(2) != 0.00) {listaVerify.push(false)}else{listaVerify.push(true)}

            if(listaVerify.indexOf(false) == -1){
                this.verify = true;
            }else{
                this.verify = false
            }

            listaVerify = [];

            var soma = this.somar();
            var proporcaoList = this.proporcional();
            var hashString = this.randomString(32, '#aA!');
            var hashToVendidos = sha256(hashString);

            if(this.verify == true) {
                this.showSucesso();
                this.fornecedorService.postFornecedoresEdit(
                    fornecedorFC,
                    emissaoFC,
                    operacaoFC,
                    categoriaFC, 
                    hash,
                    serieFC,
                    nfFC,
                    compraFC,
                    selectedProduto,
                    quantidade,
                    valor,
                    selectedProduto2,
                    quantidade2,
                    valor2,
                    transportadoraFC,
                    freteFC,
                    valorPgto,
                    datePgto,
                    proporcaoList,
                    soma,
                    hashToVendidos
                ).subscribe(
                    data => {
                        if(this.origem=="fc"){
                            this._router.navigate(['/fluxodecaixa']);
                        }
                    },
                    error => {
                        console.log(error)
                    }                
                );
            }else{
                this.showError();
            }
    }

    showError() {
        this.msgs = [];
        this.msgs.push({severity:'error', summary:'Erro', detail:'Formulário preenchido incorretamente'});
    }

    showSucesso() {
        this.msgs = [];
        this.msgs.push({severity:'success', summary:'Sucesso', detail:'Formulario enviado com sucesso'});
    }

    toFixed(x) {
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

    onSelected(produto, num){
        var n = this.selectedProduto.indexOf(produto);
        if(n > -1){
            this.quantidadeAtual2[num] = this.quantidadeAtual[n];
            this.pm2[num] = this.pm[n];
        }else{
            this.venderService.getItemProdutoQuantidade(produto)
            .subscribe(
                data => {
                    if(data[0] != 0){
                        this.quantidadeAtual2[num] = data[0];
                        this.pm2[num] = data[1];
                    }else{
                        this.quantidadeAtual2[num] = 0;
                        this.pm2[num] = "";
                        this.pmNovo2[num] = "";
                        this.quantidade2[num] = 0;
                        this.valor2[num] = "";
                    }
                },
                error => {
                    console.log(error)
                }                
            );
        }        
    }

    onChangeCM(valor, num){
        var numerador = ((this.quantidadeAtual2[num]*this.pm2[num])+(this.quantidade2[num]*valor));
        var dividendo = (parseInt(this.quantidadeAtual2[num])+parseInt(this.quantidade2[num]));
        var pmNew = numerador / dividendo;
        this.pmNovo2[num] = pmNew;
    }

    addProduto() {
        if(this.items2.length == 0) {
            this.items2.push("0");
            this.quantidade2.push("");
            this.valor2.push("");
            this.pm2.push("");
            this.selectedProduto2.push("");
            this.pmNovo2.push("");
            this.quantidadeAtual2.push(0);
        }else{            
            this.items2.push(String(this.items2.length));
            this.quantidade2.push("");
            this.valor2.push("");
            this.pm2.push("");
            this.selectedProduto2.push("");
            this.pmNovo2.push("");
            this.quantidadeAtual2.push(0);
        }        
    }

    addPagamento() {
        if(this.itemsPgto.length == 0) {
            this.itemsPgto.push("0");
            this.valorPgto.push("");
            this.datePgto.push("");          
        }else{
            this.itemsPgto.push(String(this.itemsPgto.length));
            this.valorPgto.push("");
            this.datePgto.push("");
        }        
    }

    /*remove(x) {
        var tamanho = this.items.length;
        for(let i = 0; i < tamanho-1; i++) {
            this.items.push(String(i))
        }
        this.items.splice(0, tamanho);
        this.quantidade.splice(x, 1);
        this.valor.splice(x, 1);
        this.selectedProduto.splice(x, 1);
        this.pm.splice(x, 1);
        this.pmNovo.splice(x, 1);
        this.quantidadeAtual.splice(x, 1);
    }*/

    remove2(x) {
        var tamanho = this.items2.length;
        for(let i = 0; i < tamanho-1; i++) {
            this.items2.push(String(i))
        }
        this.items2.splice(0, tamanho);
        this.quantidade2.splice(x, 1);
        this.valor2.splice(x, 1);
        this.selectedProduto2.splice(x, 1);
        this.pm2.splice(x, 1);
        this.pmNovo2.splice(x, 1);
        this.quantidadeAtual2.splice(x, 1);
    }

    removePgto(x) {
        var tamanho = this.itemsPgto.length;
        for(let i = 0; i < tamanho-1; i++) {
            this.itemsPgto.push(String(i))
        }
        this.itemsPgto.splice(0, tamanho);
        this.valorPgto.splice(x, 1);
        this.datePgto.splice(x, 1);
    }

    selectEdit(event, lista, overlaypanel) {
        this.label = lista
        this.item = "";
        overlaypanel.toggle(event);
    }

    sair(){
        if(this.origem=="fc"){
            this._router.navigate(['/fluxodecaixa']);
        }
    }
}