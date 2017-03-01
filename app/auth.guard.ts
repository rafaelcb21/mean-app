import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import  {Observable, BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/operator/take';
import { LoginService } from './login/login.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private loginService: LoginService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable <boolean> | boolean {
        return this.loginService.logado()
        .map(
            data => {
                if (data == false) {
                    this.router.navigate(['/login']);
                    return data;
                };
                
                if (data == true) {
                    return data;
                }
            },
            error => {
                this.router.navigate(['/login']);
                return error
            }
        )
    }
}