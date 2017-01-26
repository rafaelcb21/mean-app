import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';
import { Config } from '../config';

@Injectable()
export class CaixaService {
    constructor(private _http: Http) {}

    fc(){
        return this._http.get(Config.URL_SITE + 'lista/fc')
            .map(response => {
                const data = response.json().compra;                
            })
            .catch(error => Observable.throw(error.json()));
    }

}