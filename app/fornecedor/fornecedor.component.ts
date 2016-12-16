import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { FornecedorService } from './fornecedor.service';

@Component({
    selector: '<fornecedor></fornecedor>',
    templateUrl: './js/app/fornecedor/fornecedor.component.html',
    styleUrls: ['./js/app/fornecedor/fornecedor.component.css'],
})
export class FornecedorComponent {

    fornecedores: SelectItem[];
    operacao: SelectItem[];
    categoria: SelectItem[];
    produto: SelectItem[];
    transportadora: SelectItem[];
    selectedFornecedor: string;
    selectedOperacao: string;
    selectedCategoria: string;
    selectedProduto: string;
    selectedTransportadora: string;
    valueEmissao: Date;
    valuePgto: Date;
    label: string;
    item: string;

    constructor(private _router: Router,
        private fornecedorService: FornecedorService,
    ){
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

        this.fornecedorService.getItem("Produto")
            .subscribe(
                data => {
                    this.produto = data;
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