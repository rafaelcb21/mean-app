import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { FornecedorService } from '../fornecedor/fornecedor.service';
import { CaixaService } from '../fluxodecaixa/fluxodecaixa.service';
import { Message, MenuItem } from 'primeng/primeng';
import { VenderService } from '../vender/vender.service';
import * as moment from 'moment';
import { ConfirmationService } from 'primeng/primeng';

declare var sha256: any;

@Component({
    selector: '<vender-editar></vender-editar>',
    templateUrl: './js/app/vender/vender-editar.component.html',
    styleUrls: ['./js/app/vender/vender-editar.component.css'],
})
export class VenderEditarComponent implements OnInit {
private menus: MenuItem[];
    fornecedores: SelectItem[];
    operacao: SelectItem[];
    categoria: SelectItem[];
    produto: SelectItem[];
    transportadora: SelectItem[];
    selectedCliente: string;
    selectedOperacao: string;
    selectedCategoria: string;
    selectedTransportadora: string;
    valueEmissao: Date;
    serie: Number;
    nf: Number;
    venda: Number;
    label: string;
    item: string;
    items = [];
    quantidade = [];
    valor = [];
    pm = [];
    valorEdit = [];
    selectedProduto = [];
    total = [];
    itemsPgto = [];
    valorPgto = [];
    datePgto = [];
    vencimento = [];
    frete: any;
    sum: any;
    sumPgto: any;
    ll = [];
    pp = [];
    proporcao = [];
    subtracao: any;
    text: string;    
    results: any[] = [];
    verify = false;
    br: any;
    check: Boolean;
    checkError:  Boolean;
    msgs: Message[] = [];
    margem = [];
    quantidadeAtual = [];
    pmNovo = [];

    items2 = [];
    quantidade2 = [];
    margem2 = [];
    pm2 = [];
    selectedProduto2 = [];
    pmEstoque = [];
    qtdTotal = [];

    cliente: string;
    emissaoFC: string;
    operacaoFC: string;
    categoriaFC: string;
    serieFC: string;
    nfFC: string;
    vendaFC: string;
    transportadoraFC: string;
    freteFC: string;
    parcelasFC = [];
    hash: string;
    selectedProd = [];
    origem: string;
    verificarNota: boolean;
    
    clienteList: any[] = [];
    searchClienteList: any[] = [];

    operacaoList: any[] = [];
    searchOperacaoList: any[] = [];

    categoriaList: any[] = [];
    searchCategoriaList: any[] = [];

    produtoList: any[] = [];
    searchProdutoList: any[] = [];

    transportadoraList: any[] = [];
    searchTransportadoraList: any[] = [];
    
    constructor(private _router: Router,
        private venderService: VenderService,
        private activatedRoute: ActivatedRoute,
        private caixaService: CaixaService,
        private confirmationService: ConfirmationService
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
                    this.cliente = data.cliente;
                    this.emissaoFC = data.emissao;
                    this.operacaoFC = data.operacao;
                    this.categoriaFC = data.categoria;
                    this.serieFC = data.serie;
                    this.vendaFC = data.venda;
                    //this.verificarNota = data.verificar;
                    this.selectedProduto = data.uniqueProduct; //lista

                    for(let i = 0; i < this.selectedProduto.length; i++){
                        this.items.push(i)
                    }

                    this.pmEstoque = data.pmEstoque; //lista
                    this.qtdTotal = data.qtdTotal; //lista
                    this.quantidade = data.qtdList; //lista
                    this.pm = data.pmList; //lista
                    this.margem = data.margemList; //lista


                    this.transportadoraFC = data.transportadora;
                    this.freteFC = data.frete;

                    //this.datePgto = data.dataParc; //lista
                    
                    for(let i = 0; i < data.dataParc.length; i++){
                        this.itemsPgto.push(i)
                        var x = moment(data.dataParc[i]).format("MM-DD-YYYY"); //convert para MM-DD-YYYY
                        var y = new Date(x); //converto para tipo Date
                        this.datePgto.push(y);

                        var x1 = moment(data.vencimento[i]).format("MM-DD-YYYY"); //convert para MM-DD-YYYY
                        var y1 = new Date(x1); //converto para tipo Date
                        this.vencimento.push(y1);
                    }

                    this.valorPgto = data.parcelasLista; //lista
                },
                error => console.log(error)
            )
        }); 

        this.venderService.getItemProduto()
            .subscribe(
                data => {
                    //this.produto = data;
                    for(let i = 0; i < data[0].length; i++) {
                        this.produtoList.push(data[0][i].label);
                    }
                },
                error => {
                    console.log(error)
                }                
            );

        this.venderService.getItem("Transportadora")
            .subscribe(
                data => {
                    //this.transportadora = data;
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

    onlyDate(event){
        return false
    }

    proporcional() {
        this.pp = [];
        this.proporcao = [];
        for(let i = 0;  i < this.quantidade.length; i++) {
            var x = ((parseFloat(this.margem[i])/100)+1) * parseFloat(this.pm[i]) * parseFloat(this.quantidade[i])
            this.pp.push(x)
        }
        for(let i = 0;  i < this.quantidade2.length; i++) {
            var x = ((parseFloat(this.margem2[i])/100)+1) * parseFloat(this.pm2[i]) * parseFloat(this.quantidade2[i])
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
        this.ll = []
        for(let i = 0;  i < this.quantidade.length; i++) {
            var x = ((parseFloat(this.margem[i])/100)+1) * parseFloat(this.pm[i]) * parseFloat(this.quantidade[i])
            this.ll.push(x)
        }
        for(let i = 0;  i < this.quantidade2.length; i++) {
            var x = ((parseFloat(this.margem2[i])/100)+1) * parseFloat(this.pm2[i]) * parseFloat(this.quantidade2[i])
            this.ll.push(x)
        }
        this.sum = this.ll.reduce((a, b) => a + b, 0) + this.freteFC;
        var resultado = Math.round(this.sum * 100) / 100;
        return resultado;
    }

    verificar() {
        this.sumPgto = this.valorPgto.reduce((a, b) => a + b, 0);
        var sumPgtoRound = Math.round(this.sumPgto * 100) / 100;
        this.subtracao = this.somar() - sumPgtoRound;
        var y = this.somar();

        if(this.subtracao == 0){
            this.check = true;
            this.checkError = false;
        }else{
            this.check = false;
            this.checkError = true;
        }
        return this.subtracao;
    }

    searchProduto(event) {
         this.searchProdutoList = []

        for (let j = 0; j < this.produtoList.length; j++) {
            try{
                if (this.produtoList[j].match(event.query)) {
                    this.searchProdutoList.push(this.produtoList[j])
                }
            }catch(e){}
        }
    }

    searchTransportadora(event) {
         this.searchTransportadoraList = []

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
            sum,
            vencimento,
            datePgto,
            valorPgto,
            subtracao,
            hash
        ) {
            this.venderService.verificarQtd2(selectedProduto, quantidade, selectedProduto2, quantidade2).subscribe(
                bool =>  {
                    var listaVerify = [];
                    listaVerify.push(bool);

                    if(selectedProduto2.indexOf("") != -1) {listaVerify.push(false)}else{listaVerify.push(true)}
                    for (let j = 0; j < selectedProduto2.length; j++) {
                        if (this.produtoList.indexOf(selectedProduto2[j]) == -1) {
                            listaVerify.push(false);
                            break;
                        }else{listaVerify.push(true)}
                    }

                    if((quantidade.indexOf("") != -1) || (quantidade.indexOf("0") != -1)) {listaVerify.push(false)}else{listaVerify.push(true)}

                    if(margem.indexOf("") != -1 || margem.indexOf(0) != -1 || margem.indexOf("0") != -1) {listaVerify.push(false)}else{listaVerify.push(true)}
                    //if(margem.indexOf(0) != -1) {listaVerify.push(false)}else{listaVerify.push(true)}
                    //if(margem.indexOf("0") != -1) {listaVerify.push(false)}else{listaVerify.push(true)}
                    if((quantidade2.indexOf("") != -1) || (quantidade2.indexOf(0) != -1)) {listaVerify.push(false)}else{listaVerify.push(true)}

                    if(margem2.indexOf("") != -1 || margem2.indexOf(0) != -1 || margem2.indexOf("0") != -1) {listaVerify.push(false)}else{listaVerify.push(true)}
                    //if(margem2.indexOf(0) != -1) {listaVerify.push(false)}else{listaVerify.push(true)}
                    //if(margem2.indexOf("0") != -1) {listaVerify.push(false)}else{listaVerify.push(true)}

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

                    if((vencimento.indexOf("") != -1) || (vencimento.indexOf(null) != -1)) {listaVerify.push(false)}else{listaVerify.push(true)}
                    if(vencimento.length == 0) {listaVerify.push(false)}else{listaVerify.push(true)}

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
                    
                    if(this.verify == true) {
                        this.showSucesso();
                        this.venderService.postVenda2(
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
                },
                    error => console.log(error)
                )          
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

    onChange(produto, num){
        this.venderService.getItemProdutoQuantidade(produto)
            .subscribe(
                data => {                    
                    if(data[0] != 0){
                        this.quantidade2[num] = data[0];
                        this.pm2[num] = data[1];
                    }
                },
                error => {
                    console.log(error)
                }                
            );

    }

    addProduto() {
        if(this.items2.length == 0) {
            this.items2.push("0");
            this.quantidade2.push(0);
            this.margem2.push("");
            this.pm2.push("");
            this.selectedProduto2.push("");            
        }else{
            this.items2.push(String(this.items2.length));
            this.quantidade2.push(0);
            this.margem2.push("");
            this.pm2.push("");
            this.selectedProduto2.push("");
        }
        
    }

    addPagamento() {
        if(this.itemsPgto.length == 0) {
            this.itemsPgto.push("0");
            this.valorPgto.push("");
            this.datePgto.push("");   
            this.vencimento.push("");       
        }else{
            this.itemsPgto.push(String(this.itemsPgto.length));
            this.valorPgto.push("");
            this.datePgto.push("");
            this.vencimento.push("");
        }
        
    }

    remove(x) {
        var tamanho = this.items2.length;
        for(let i = 0; i < tamanho-1; i++) {
            this.items2.push(String(i))
        }
        this.items2.splice(0, tamanho);
        this.quantidade2.splice(x, 1);
        this.selectedProduto2.splice(x, 1);
        this.margem2.splice(x, 1);
        this.pm2.splice(x, 1);
    }

    removePgto(x) {
        var tamanho = this.itemsPgto.length;
        for(let i = 0; i < tamanho-1; i++) {
            this.itemsPgto.push(String(i))
        }
        this.itemsPgto.splice(0, tamanho);
        this.valorPgto.splice(x, 1);
        this.datePgto.splice(x, 1);
        this.vencimento.splice(x, 1);
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

    excluir(hash) {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir essa Nota de Venda?',
            header: 'Excluir',
            icon: 'fa fa-trash',
            accept: () => {
                this.venderService.excluirVenda(hash).subscribe(
                    data => this._router.navigate(['/fluxodecaixa']),
                    error => console.log(error)
                )                
            },
            reject: () => {}
        });
    }

}