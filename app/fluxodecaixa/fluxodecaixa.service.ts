import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';
import { Config } from '../config';

@Injectable()
export class CaixaService {
    constructor(private _http: Http) {}


}