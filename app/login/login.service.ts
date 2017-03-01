import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {Config} from '../config';

@Injectable()
export class LoginService{
    session: string;

    constructor (private _http: Http) {}

    login(contentLogin){
        const body = JSON.stringify(contentLogin);
        const header = new Headers({'Content-Type': 'application/json'});
        return this._http.post(Config.URL_SITE + 'auth/login', body, {headers: header})
            .map(response => response.json())
            .catch(error => Observable.throw(error.json()));
    }   

    logado() {
        this.session = sessionStorage['session'];
        const body = JSON.stringify({session: this.session});
        const header = new Headers({'Content-Type': 'application/json'});
        return this._http.post(Config.URL_SITE + 'auth/logando', body, {headers: header})
            .map(response => response.json().message)
            .catch(error => Observable.of(false));
    }
}