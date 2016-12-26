import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { FornecedorService } from './fornecedor.service';

@Component({
    selector: '<fornecedor></fornecedor>',
    templateUrl: './js/app/fornecedor/fornecedor.component.html',
    styleUrls: ['./js/app/fornecedor/fornecedor.component.css'],
})
export class FornecedorComponent implements OnInit {

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
    subtracao: any;
    text: string;    
    results: any[] = [];

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

    onlyNumber(event){
        var lista = [48,49,50,51,52,53,54,55,56,57];
        var result = lista.indexOf(event.keyCode);
        if(result == -1) {
            return false
        }else{
            return true
        }        
    }

    somar() {
        this.ll = []
        for(let i = 0;  i < this.quantidade.length; i++) {
            var x = parseFloat(this.quantidade[i])*parseFloat(this.valor[i])
            this.ll.push(x)
        }
        this.sum = this.ll.reduce((a, b) => a + b, 0) + this.frete;
    }

    verificar() {
        this.sumPgto = this.valorPgto.reduce((a, b) => a + b, 0)
        this.subtracao = this.sum - this.sumPgto;
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
                //console.log(this.searchCategoriaList)
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
        console.log(valueEmissao)
        console.log(selectedCategoria)
        console.log(serie)
        console.log(nf)
        console.log(compra)
        console.log(selectedProduto)
        console.log(quantidade)
        console.log(valor)
        console.log(selectedTransportadora)
        console.log(frete)
        console.log(sum)
        console.log(valorPgto)
        console.log(datePgto)
        console.log(subtracao)
    }

    ngOnInit() {
        //this.items.push("0");
        //this.quantidade.push("");
        //this.valor.push("");
        //this.selectedProduto.push("");
        this.frete = 0;
        this.sum = 0;
        this.subtracao = 0;

        this.fornecedorService.getItem("Produto")
            .subscribe(
                data => {
                    //this.produto = data;
                    for(let i = 0; i < data.length; i++) {
                        this.produtoList.push(data[i].label);
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
                    for(let i = 0; i < data.length; i++) {
                        this.fornecedoresList.push(data[i].label);
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
                    for(let i = 0; i < data.length; i++) {
                        this.operacaoList.push(data[i].label);
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
                    for(let i = 0; i < data.length; i++) {
                        this.categoriaList.push(data[i].label);
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
                    for(let i = 0; i < data.length; i++) {
                        this.transportadoraList.push(data[i].label);
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
        var lista = item.split(";");
        this.fornecedorService.postItem(label, lista)
            .subscribe(
                data => {
                    this.fornecedorService.getItem(data)
                        .subscribe(
                            data => {
                                if(data[0].label == "Fornecedores") {
                                    this.fornecedores = data;
                                }else if(data[0].label == "Operação") {
                                    this.operacao = data;
                                }else if(data[0].label == "Categoria") {
                                    this.categoria = data;
                                }else if(data[0].label == "Produto") {
                                    this.produto = data;
                                }else if(data[0].label == "Transportadora") {
                                    this.transportadora = data;
                                }
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