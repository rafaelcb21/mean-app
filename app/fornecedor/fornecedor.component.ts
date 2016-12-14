import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';

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

    constructor(private _router: Router,){
        this.fornecedores = [    
            {label:'Fornecedores', value:null},
            {label:'New York', value:{id:1, name: 'New York', code: 'NY'}},
            {label:'London', value:{id:3, name: 'London', code: 'LDN'}},
            {label:'Rome', value:{id:2, name: 'Rome', code: 'RM'}}
        ];
        //this.fornecedores.push({label:'Paris', value:{id:5, name: 'Paris', code: 'PRS'}});

        this.operacao = [    
            {label:'Operação', value:null},
            {label:'New York', value:{id:1, name: 'New York', code: 'NY'}},
            {label:'London', value:{id:3, name: 'London', code: 'LDN'}},
            {label:'Rome', value:{id:2, name: 'Rome', code: 'RM'}}
        ];

        this.categoria = [
            {label:'Categoria', value:null},
            {label:'New York', value:{id:1, name: 'New York', code: 'NY'}},
            {label:'London', value:{id:3, name: 'London', code: 'LDN'}},
            {label:'Rome', value:{id:2, name: 'Rome', code: 'RM'}}
        ];

        this.produto = [
            {label:'Produto', value:null},
            {label:'New York', value:{id:1, name: 'New York', code: 'NY'}},
            {label:'London', value:{id:3, name: 'London', code: 'LDN'}},
            {label:'Rome', value:{id:2, name: 'Rome', code: 'RM'}}
        ];


        this.transportadora = [
            {label:'Transportadora', value:null},
            {label:'New York', value:{id:1, name: 'New York', code: 'NY'}},
            {label:'London', value:{id:3, name: 'London', code: 'LDN'}},
            {label:'Rome', value:{id:2, name: 'Rome', code: 'RM'}}
        ];
    }

    selectEdit(event, lista, overlaypanel) {
        this.label = lista
        this.item = "";
        overlaypanel.toggle(event);
    }

    itemEscolhido(lista, item) {
        console.log(lista)
        console.log(item)
    }
}