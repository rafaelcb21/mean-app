import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { FornecedorService } from './fornecedor.service';
import { Message, MenuItem } from 'primeng/primeng';

declare var sha256: any;

@Component({
    selector: '<fornecedor></fornecedor>',
    templateUrl: './js/app/fornecedor/fornecedor.component.html',
    styleUrls: ['./js/app/fornecedor/fornecedor.component.css'],
})
export class FornecedorComponent implements OnInit {
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
    serie: Number;
    nf: Number;
    compra: Number;
    label: string;
    item: string;
    items = [];
    quantidade = [];
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
    
    //ok: any;
    //mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    //<input [textMask]="{mask: mask}" [(ngModel)]="myModel" type="text"/>

    //<input [(ngModel)]="moneyText" [(moneyModel)]="moneyValue" mask-money />

    constructor(private _router: Router,
        private fornecedorService: FornecedorService,
    ){
        /*const numberMask = createNumberMask({
            prefix: 'R$ ',
            suffix: '',
            includeThousandsSeparator: true,
            thousandsSeparatorSymbol: '.',
            allowDecimal: false,
            decimalSymbol: ',',
            decimalLimit: 2,
            requireDecimal: false,
            allowNegative: false,
        })*/
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
            var x = parseFloat(this.quantidade[i])*parseFloat(this.valor[i])
            this.pp.push(x)
        }
        this.sum = this.pp.reduce((a, b) => a + b, 0) + this.frete;

        for(let i = 0;  i < this.pp.length; i++) {
            var y = parseFloat(this.pp[i])/this.sum;
            this.proporcao.push(y);
        }

        return this.proporcao;
    }

    somar() {
        this.ll = []
        for(let i = 0;  i < this.quantidade.length; i++) {
            var x = parseFloat(this.quantidade[i])*parseFloat(this.valor[i])
            this.ll.push(x)
        }
        this.sum = this.ll.reduce((a, b) => a + b, 0) + this.frete;
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
         this.searchProdutoList = []

        for (let j = 0; j < this.produtoList.length; j++) {
            try{
                if (this.produtoList[j].match(event.query)) {
                    this.searchProdutoList.push(this.produtoList[j])
                }
            }catch(e){}
        }
    }

    searchFornecedor(event) {
         this.searchFornecedorList = []

        for (let j = 0; j < this.fornecedoresList.length; j++) {
            try{
                if (this.fornecedoresList[j].match(event.query)) {
                    this.searchFornecedorList.push(this.fornecedoresList[j])
                }
                //console.log(this.searchFornecedorList)
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

    searchOperacao(event) {
         this.searchOperacaoList = []

        for (let j = 0; j < this.operacaoList.length; j++) {
            try{
                if (this.operacaoList[j].match(event.query)) {
                    this.searchOperacaoList.push(this.operacaoList[j])
                }
                //console.log(this.searchOperacaoList)
            }catch(e){}
        }
    }

    operacaoDropdownClick(event) {       
        this.searchOperacaoList = [];
        setTimeout(() => {
            this.searchOperacaoList = this.operacaoList;
        }, 100)
    }

    searchCategoria(event) {
         this.searchCategoriaList = []

        for (let j = 0; j < this.categoriaList.length; j++) {
            try{
                if (this.categoriaList[j].match(event.query)) {
                    this.searchCategoriaList.push(this.categoriaList[j])
                }
            }catch(e){}
        }
    }

    categoriaDropdownClick(event) {       
        this.searchCategoriaList = [];
        setTimeout(() => {
            this.searchCategoriaList = this.categoriaList;
        }, 100)
    }

    salvar(
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
            sum,
            valorPgto,
            datePgto,
            subtracao
        ) {
            var listaVerify = [];
            if(selectedFornecedor == undefined) {listaVerify.push(false)}else{listaVerify.push(true)}
            if(this.fornecedoresList.indexOf(selectedFornecedor) == -1) {listaVerify.push(false)}else{listaVerify.push(true)}

            if(valueEmissao == undefined || valueEmissao == null) {listaVerify.push(false)}else{listaVerify.push(true)}
            
            if(selectedOperacao == undefined) {listaVerify.push(false)}else{listaVerify.push(true)}
            if(this.operacaoList.indexOf(selectedOperacao) == -1) {listaVerify.push(false)}else{listaVerify.push(true)}

            if(selectedCategoria == undefined) {listaVerify.push(false)}else{listaVerify.push(true)}
            if(this.categoriaList.indexOf(selectedCategoria) == -1) {listaVerify.push(false)}else{listaVerify.push(true)}

            //if(serie == undefined || serie == "") {listaVerify.push(false)}else{listaVerify.push(true)}
            //if(nf == undefined || nf == "") {listaVerify.push(true)}else{listaVerify.push(true)}
            //if(compra == undefined || compra == "") {listaVerify.push(false)}else{listaVerify.push(true)}

            if(selectedProduto.indexOf("") != -1) {listaVerify.push(false)}else{listaVerify.push(true)}
            for (let j = 0; j < selectedProduto.length; j++) {
                if (this.produtoList.indexOf(selectedProduto[j]) == -1) {
                    listaVerify.push(false);
                    break;
                }else{listaVerify.push(true)}
            }

            if(quantidade.indexOf("") != -1) {listaVerify.push(false)}else{listaVerify.push(true)}
            if(quantidade.length == 0) {listaVerify.push(false)}else{listaVerify.push(true)}

            if(valor.indexOf("") != -1) {listaVerify.push(false)}else{listaVerify.push(true)}
            if(valor.indexOf(0) != -1) {listaVerify.push(false)}else{listaVerify.push(true)}
            
            if(frete > 0) {
                if( (selectedTransportadora == undefined) || 
                    (selectedTransportadora == "") || 
                    (this.transportadoraList.indexOf(selectedTransportadora) == -1)) {
                        listaVerify.push(false)
                    }else{listaVerify.push(true)}
            }else{
                selectedTransportadora = "";
                listaVerify.push(true)
            }

            var num = parseInt(sum) || 0;
            //if(num == 0) {listaVerify.push(false)}else{listaVerify.push(true)}

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
            var pwSHA256 = sha256(hashString);

            if(this.verify == true) {
                this.showSucesso();
                this.fornecedorService.postFornecedores(
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
                    soma,
                    pwSHA256
                ).subscribe(
                    data => {
                        this.selectedFornecedor = "";
                        this.valueEmissao = undefined;
                        this.selectedOperacao = "";
                        this.selectedCategoria = "";
                        this.serie = undefined;
                        this.nf = undefined;
                        this.compra = undefined;
                        this.items = [];
                        this.selectedProduto.splice(0, this.selectedProduto.length);
                        this.quantidade.splice(0, this.quantidade.length);
                        this.valor.splice(0, this.valor.length);
                        this.selectedTransportadora = "";
                        this.frete = 0;
                        this.sum = 0;
                        this.itemsPgto.splice(0, this.itemsPgto.length);
                        this.valorPgto.splice(0, this.valorPgto.length);
                        this.datePgto.splice(0, this.datePgto.length);
                        this.subtracao = 0;
                        this.check = undefined;
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

    ngOnInit() {
        //this.items.push("0");
        //this.quantidade.push("");
        //this.valor.push("");
        //this.selectedProduto.push("");
        this.frete = 0;
        this.sum = 0;
        this.subtracao = 0.00;

        this.fornecedorService.getItem("Produto")
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

        this.fornecedorService.getItem("Fornecedores")
            .subscribe(
                data => {
                    //this.fornecedores = data;
                    for(let i = 0; i < data[0].length; i++) {
                        this.fornecedoresList.push(data[0][i].label);
                    }
                },
                error => {
                    console.log(error)
                }                
            );

        this.fornecedorService.getItem("Operação")
            .subscribe(
                data => {
                    //this.operacao = data;
                    for(let i = 0; i < data[0].length; i++) {
                        this.operacaoList.push(data[0][i].label);
                    }
                },
                error => {
                    console.log(error)
                }                
            );

        this.fornecedorService.getItem("Categoria")
            .subscribe(
                data => {
                    //this.categoria = data;
                    for(let i = 0; i < data[0].length; i++) {
                        this.categoriaList.push(data[0][i].label);
                    }
                },
                error => {
                    console.log(error)
                }                
            );

        this.fornecedorService.getItem("Transportadora")
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

        this.addProduto();
        this.addPagamento();

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
                label: 'Vender Produto',
                routerLink: ['/vender']
            },
            {
                label: 'Despesas',
            },
            {
                label: 'Editar Lista',
            },
            {
                label: 'Fluxo de Caixa',
            }
        ];
    }

    addProduto() {
        if(this.items.length == 0) {
            this.items.push("0");
            this.quantidade.push("");
            this.valor.push("");
            this.selectedProduto.push("");            
        }else{
            this.items.push(String(this.items.length));
            this.quantidade.push("");
            this.valor.push("");
            this.selectedProduto.push("");
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

    remove(x) {
        var tamanho = this.items.length;
        for(let i = 0; i < tamanho-1; i++) {
            this.items.push(String(i))
        }
        this.items.splice(0, tamanho);
        this.quantidade.splice(x, 1);
        this.valor.splice(x, 1);
        this.selectedProduto.splice(x, 1);
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

    itemEscolhido(label, item) {
        if(item.trim() != ""){
            var lista = item.split(";");
            var listaApoio = [];
            this.fornecedorService.postItem(label, lista)
                .subscribe(
                    data => {
                        this.fornecedorService.getItem(data)
                            .subscribe(
                                data => {
                                    for(let i = 0; i < data[0].length; i++) {
                                        listaApoio.push(data[0][i].label);
                                    }

                                    if(data[1] == "Fornecedores") {
                                        this.fornecedoresList.splice(0, this.fornecedoresList.length);
                                        for(let i = 0; i < listaApoio.length; i++) {
                                            this.fornecedoresList.push(listaApoio[i]);
                                        }
                                    }else if(data[1] == "Operação") {
                                        this.operacaoList.splice(0, this.operacaoList.length);
                                        for(let i = 0; i < listaApoio.length; i++) {
                                            this.operacaoList.push(listaApoio[i]);
                                        }
                                    }else if(data[1] == "Categoria") {
                                        this.categoriaList.splice(0, this.categoriaList.length);
                                        for(let i = 0; i < listaApoio.length; i++) {
                                            this.categoriaList.push(listaApoio[i]);
                                        }
                                    }else if(data[1] == "Produto") {
                                        this.produtoList.splice(0, this.produtoList.length);
                                        for(let i = 0; i < listaApoio.length; i++) {
                                            this.produtoList.push(listaApoio[i]);
                                        }
                                    }else if(data[1] == "Transportadora") {
                                        this.transportadoraList.splice(0, this.transportadoraList.length);
                                        for(let i = 0; i < listaApoio.length; i++) {
                                            this.transportadoraList.push(listaApoio[i]);
                                        }
                                    }
                                    listaApoio = [];
                                },
                                error => {
                                    console.log(error)
                                }                
                            );
                    },
                    error => {
                        console.log(error)
                    }                
                );
        }
    }
}