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
    valuePgto: Date;
    label: string;
    item: string;
    items = [];
    quantidade = [];
    valor = [];
    valorEdit = [];
    selectedProduto = [];
    total = [];
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

    formatDollar(num) {
        var p = num.toFixed(2).split(",");
        return "R$ " + p[0].split("").reverse().reduce(function(acc, num, i, orig) {
            return  num=="-" ? acc : num + (i && !(i % 3) ? "." : "") + acc;
        }, "") + "," + p[1];
    }

    public onInput(x) {
    
        console.log(x)
    }

    process(e) {
        //console.log(this.valor)`


        for(let i = 0; i < this.valor.length; i++) {
            var pr01 = this.valor[i].replace("R$ ", "");
            var pr02 = pr01.replace(",", ".");
            var float = parseFloat(pr02)
            //this.valorEdit.push(float);
            //console.log(this.valorEdit);
            var qtd = this.quantidade[i];

            
            //
        }
        this.total.push(qtd * float)
        console.log(this.total)
        //this.valorEdit.push(total);
        //console.log(this.valorEdit);

    }

    ngOnInit() {
        this.items.push("0");
        this.quantidade.push("");
        this.valor.push("");
        this.selectedProduto.push("");

        this.fornecedorService.getItem("Produto")
            .subscribe(
                data => {
                    this.produto = data;
                },
                error => {
                    console.log(error)
                }                
            );

                this.fornecedorService.getItem("Fornecedores")
            .subscribe(
                data => {
                    this.fornecedores = data;
                },
                error => {
                    console.log(error)
                }                
            );

        this.fornecedorService.getItem("Operação")
            .subscribe(
                data => {
                    this.operacao = data;
                },
                error => {
                    console.log(error)
                }                
            );

        this.fornecedorService.getItem("Categoria")
            .subscribe(
                data => {
                    this.categoria = data;
                },
                error => {
                    console.log(error)
                }                
            );

        this.fornecedorService.getItem("Transportadora")
            .subscribe(
                data => {
                    this.transportadora = data;
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