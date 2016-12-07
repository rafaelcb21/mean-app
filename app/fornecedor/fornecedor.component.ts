import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: '<fornecedor></fornecedor>',
    templateUrl: './js/app/fornecedor/fornecedor.component.html',
    styleUrls: ['./js/app/fornecedor/fornecedor.component.css'],
})
export class FornecedorComponent {
    constructor(private _router: Router,){}
}