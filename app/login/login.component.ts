import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
    selector: '<login></login>',
    templateUrl: './js/app/login/login.component.html',
    styleUrls: ['./js/app/login/login.component.css'],
})
export class LoginComponent {
    session: string;
    constructor(
        private _loginService: LoginService,
        private _router: Router,
    ) {    
        this._loginService.logado().subscribe(
            data => {
                if (data == true) {
                     this._router.navigate(['/fluxodecaixa']);
                }else{
                    this._router.navigate(['/login']);
                }
            },
            error => { 
                this._router.navigate(['/login']);
            }
        )
    }

    login(username, senha){
        var dict = {username: username, senha: senha}
        this._loginService.login(dict)
        .subscribe(
            data => {
                sessionStorage.setItem('session', data.session);
                this._router.navigate(['/fluxodecaixa']);
            },
            error => console.log(error)
        )
    }
}