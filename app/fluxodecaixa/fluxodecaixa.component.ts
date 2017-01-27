import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { CaixaService } from './fluxodecaixa.service';
import { Message, MenuItem } from 'primeng/primeng';
import { VenderService } from '../vender/vender.service';

@Component({
    selector: '<fluxodecaixa></fluxodecaixa>',
    templateUrl: './js/app/fluxodecaixa/fluxodecaixa.component.html',
    styleUrls: ['./js/app/fluxodecaixa/fluxodecaixa.component.css'],
})
export class CaixaComponent implements OnInit {
    private menus: MenuItem[];

    constructor(private _router: Router,
        private caixaService: CaixaService,
        private venderService: VenderService
    ){}

    ngOnInit() {
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
                label: 'Despesas',
            },
            {
                label: 'Editar Lista',
            },  
        ];

        this.caixaService.fc().subscribe(
            data => console.log(data),
            error => console.log(error)
        )
    }

}