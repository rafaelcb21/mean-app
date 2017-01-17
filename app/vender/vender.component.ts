import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { VenderService } from './vender.service';
import { Message, MenuItem } from 'primeng/primeng';

declare var sha256: any;

@Component({
    selector: '<vender></vender>',
    templateUrl: './js/app/vender/vender.component.html',
    styleUrls: ['./js/app/vender/vender.component.css'],
})
export class VenderComponent {
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
    ){}

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
            var x = ((parseFloat(this.margem[i])/100)+1) * parseFloat(this.pm[i]) * parseFloat(this.quantidade[i])
            this.ll.push(x)
        }
        this.sum = this.ll.reduce((a, b) => a + b, 0) + this.frete;
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

    searchCliente(event) {
         this.searchClienteList = []

        for (let j = 0; j < this.clienteList.length; j++) {
            try{
                if (this.clienteList[j].match(event.query)) {
                    this.searchClienteList.push(this.clienteList[j])
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
            sum,
            valorPgto,
            vencimento,
            datePgto,
            subtracao
        ) {
            var listaVerify = [];
            if(selectedCliente == undefined) {listaVerify.push(false)}else{listaVerify.push(true)}
            if(this.clienteList.indexOf(selectedCliente) == -1) {listaVerify.push(false)}else{listaVerify.push(true)}

            if(valueEmissao == undefined || valueEmissao == null) {listaVerify.push(false)}else{listaVerify.push(true)}
            
            if(selectedOperacao == undefined) {listaVerify.push(false)}else{listaVerify.push(true)}
            if(this.operacaoList.indexOf(selectedOperacao) == -1) {listaVerify.push(false)}else{listaVerify.push(true)}

            if(selectedCategoria == undefined) {listaVerify.push(false)}else{listaVerify.push(true)}
            if(this.categoriaList.indexOf(selectedCategoria) == -1) {listaVerify.push(false)}else{listaVerify.push(true)}

            if(serie == undefined || serie == "") {listaVerify.push(false)}else{listaVerify.push(true)}
            if(venda == undefined || venda == "") {listaVerify.push(false)}else{listaVerify.push(true)}

            if(selectedProduto.indexOf("") != -1) {listaVerify.push(false)}else{listaVerify.push(true)}
            for (let j = 0; j < selectedProduto.length; j++) {
                if (this.produtoList.indexOf(selectedProduto[j]) == -1) {
                    listaVerify.push(false);
                    break;
                }else{listaVerify.push(true)}
            }

            if(pm.indexOf("") != -1) {listaVerify.push(false)}else{listaVerify.push(true)}
            if(pm.length == 0) {listaVerify.push(false)}else{listaVerify.push(true)}

            if(quantidade.indexOf("") != -1) {listaVerify.push(false)}else{listaVerify.push(true)}
            if(quantidade.length == 0) {listaVerify.push(false)}else{listaVerify.push(true)}

            if(margem.indexOf("") != -1) {listaVerify.push(false)}else{listaVerify.push(true)}
            if(margem.indexOf(0) != -1) {listaVerify.push(false)}else{listaVerify.push(true)}
            
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
            var hashString = this.randomString(32, '#aA!');
            var pwSHA256 = sha256(hashString);

            if(this.verify == true) {
                this.showSucesso();
                this.venderService.postVenda(
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
                    pwSHA256
                ).subscribe(
                    data => {
                        this.selectedCliente = "";
                        this.valueEmissao = undefined;
                        this.selectedOperacao = "";
                        this.selectedCategoria = "";
                        this.serie = undefined;
                        this.venda = undefined;
                        this.items = [];
                        this.selectedProduto.splice(0, this.selectedProduto.length);
                        this.pm.splice(0, this.pm.length);
                        this.quantidade.splice(0, this.quantidade.length);
                        this.margem.splice(0, this.margem.length);
                        this.selectedTransportadora = "";
                        this.frete = 0;
                        this.sum = 0;
                        this.itemsPgto.splice(0, this.itemsPgto.length);
                        this.valorPgto.splice(0, this.valorPgto.length);
                        this.vencimento.splice(0, this.datePgto.length);
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

        this.venderService.getItem("Cliente")
            .subscribe(
                data => {
                    //this.fornecedores = data;
                    for(let i = 0; i < data[0].length; i++) {
                        this.clienteList.push(data[0][i].label);
                    }
                },
                error => {
                    console.log(error)
                }                
            );

        this.venderService.getItem("Operação")
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

        this.venderService.getItem("Categoria")
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
                label: 'Comprar Produto',
                routerLink: ['/fornecedor']
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

    onChange(produto, num){
        this.venderService.getItemProdutoQuantidade(produto)
            .subscribe(
                data => {                    
                    if(data[0] != 0){
                        this.quantidade[num] = data[0];
                        this.pm[num] = data[1];
                    }
                },
                error => {
                    console.log(error)
                }                
            );

    }

    addProduto() {
        if(this.items.length == 0) {
            this.items.push("0");
            this.quantidade.push("");
            this.margem.push("");
            this.pm.push("");
            this.selectedProduto.push("");            
        }else{
            this.items.push(String(this.items.length));
            this.quantidade.push("");
            this.margem.push("");
            this.pm.push("");
            this.selectedProduto.push("");
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
        var tamanho = this.items.length;
        for(let i = 0; i < tamanho-1; i++) {
            this.items.push(String(i))
        }
        this.items.splice(0, tamanho);
        this.quantidade.splice(x, 1);
        this.selectedProduto.splice(x, 1);
        this.margem.splice(x, 1);
        this.pm.splice(x, 1);
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

    itemEscolhido(label, item) {
        if(item.trim() != ""){
            var lista = item.split(";");
            var listaApoio = [];
            this.venderService.postItem(label, lista)
                .subscribe(
                    data => {
                        this.venderService.getItem(data)
                            .subscribe(
                                data => {
                                    for(let i = 0; i < data[0].length; i++) {
                                        listaApoio.push(data[0][i].label);
                                    }                                   
                                    this.clienteList.splice(0, this.clienteList.length);
                                    for(let i = 0; i < listaApoio.length; i++) {
                                        this.clienteList.push(listaApoio[i]);
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