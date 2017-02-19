import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { CaixaService } from './fluxodecaixa.service';
import { FluxoDeCaixa } from './fluxodecaixa';
import { Message, MenuItem } from 'primeng/primeng';
import { VenderService } from '../vender/vender.service';
import * as moment from 'moment';

@Component({
    selector: '<fluxodecaixa></fluxodecaixa>',
    templateUrl: './js/app/fluxodecaixa/fluxodecaixa.component.html',
    styleUrls: ['./js/app/fluxodecaixa/fluxodecaixa.component.css'],
})
export class CaixaComponent implements OnInit {
    private menus: MenuItem[];
    fluxodecaixa: FluxoDeCaixa[];
    filtroDropdown: SelectItem[];
    br: any;
    display: boolean = false;

    fornecedor: string;
    cliente: string;
    emissao: string;
    operacao: string;
    categoria: string;
    serie: string;
    nf: string;
    compra: string;
    venda: string;
    produtos = [];
    transportadora: string;
    frete: string;
    tabela: string;
    parcelas = [];
    descricao: string;
    tipo: string;
    valor: string;
    data: string;
    fixaparcelada: string;
    periodo: string;
    parcela: string;

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
                label: 'Despesas e Receitas',
                routerLink: ['/despesasreceitas']
            },
            {
                label: 'Editar Lista',
            },
        ];

        this.br = {
            //data
            closeText: "Pronto",
        	prevText: "<Ant",
        	nextText: "Pro>",
        	currentText: "Hoje",
        	monthNames: [ "janeiro","fevereiro","março","abril","maio","junho",
        	"julho","agosto","setembro","outubro","novembro","dezembro" ],
        	monthNamesShort: [ "jan","fev","mar","abr","mai","jun",
        	"jul","ago","set","out","nov","dez" ],
        	dayNames: [ "domingo","segunda","terça","quarta","quinta","sexta","sábado" ],
        	dayNamesShort: [ "dom","seg","ter","qua","qui","sex","sáb" ],
        	dayNamesMin: [ "D","S","T","Q","Q","S","S" ],
        	weekHeader: "Sm",
        	dateFormat: "dd/mm/yy",
        	firstDay: 1,
        	isRTL: false,
        	showMonthAfterYear: false,
        	yearSuffix: "",

            //tempo
            timeOnlyTitle: 'Escolher horário',
    		timeText: 'Hora',
    		hourText: 'Horas',
    		minuteText: 'Minutos',
    		secondText: 'Segundos',
    		millisecText: 'Milisegundos',
    		microsecText: 'Microsegundos',
    		timezoneText: 'Fuso horario',
    		timeFormat: 'HH:mm',
    		timeSuffix: '',
    		amNames: ['a.m.', 'AM', 'A'],
    		pmNames: ['p.m.', 'PM', 'P'],
        };

        this.caixaService.fc().subscribe(
            data => {
                var start = moment().format("YYYY-MM");
                //this.fluxodecaixa = data.data;
                this.filtro(start);
            },
            error => console.log(error)
        )

        this.filtroDropdown = this.caixaService.filter;
    }

    onlyDate(event) {
        return false
    }

    filtro(period) {
        var mesSearch = [];

        if(period == null){
            return null;
        }

        if(period == "todos"){
            return this.fluxodecaixa = this.caixaService.dataObject;
        }

        for(let i = 0; i < this.caixaService.dataObject.length; i++) {
            var anoMes = this.caixaService.dataObject[i].data.substring(0,7);
            if( anoMes == period){
                mesSearch.push(this.caixaService.dataObject[i])
            }                    
        }
        return this.fluxodecaixa = mesSearch;
    }

    periodoBusca(dataInicio, dataFim) {
        var mesSearch = [];

        if(dataInicio == undefined || dataInicio == undefined || dataFim == undefined || dataFim == undefined) {
            return null
        }

        var inicio = moment(dataInicio).format("YYYY-MM-DD");
        var fim = moment(dataFim).format("YYYY-MM-DD");

        if(dataInicio > dataFim){
            return null
        }

        for(let i = 0; i < this.caixaService.dataObject.length; i++) {
            var anoMesDia = this.caixaService.dataObject[i].data;
            if( anoMesDia >= inicio && anoMesDia <= fim){
                mesSearch.push(this.caixaService.dataObject[i])
            }                    
        }
        return this.fluxodecaixa = mesSearch;
    }

    editar(hash, tabela){
        if(tabela=="compra"){
            this._router.navigate(['/fornecedor-editar/'+hash+"/"+tabela+"/fc"]);
        }
    }

    showDialog(hash, tabela) {
        
        this.caixaService.show(hash, tabela).subscribe(
            data => {
                if(tabela == "compra"){
                    this.tabela = tabela;
                    this.display = true;
                    this.fornecedor = data.fornecedor,
                    this.emissao = data.emissao,
                    this.operacao = data.operacao,
                    this.categoria = data.categoria,
                    this.serie = data.serie,
                    this.nf = data.nf,
                    this.compra = data.compra
                    this.produtos = data.produtos, //lista
                    this.transportadora = data.transportadora,
                    this.frete = data.frete,
                    this.parcelas = data.parcelas //lista
                }
                if(tabela == "venda"){
                    this.tabela = tabela;
                    this.display = true;
                    this.cliente = data.cliente,
                    this.emissao = data.emissao,
                    this.operacao = data.operacao,
                    this.categoria = data.categoria,
                    this.serie = data.serie,
                    this.venda = data.venda,
                    this.produtos = data.produtos, //lista
                    this.transportadora = data.transportadora,
                    this.frete = data.frete,
                    this.parcelas = data.parcelas //lista
                }
                if(tabela == "dr"){
                    this.tabela = tabela;
                    this.display = true;
                    this.descricao = data.descricao,
                    this.categoria = data.categoria,
                    this.tipo = data.tipo,
                    this.valor = data.valor,
                    this.data = data.data,
                    this.fixaparcelada = data.fixaparcelada,
                    this.periodo = data.periodo,
                    this.parcela = data.parcela
                }
                
            },
            error => console.log(error)
        )
    }
}