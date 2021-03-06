import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { Message, MenuItem } from 'primeng/primeng';
import { DespesasReceitasService } from './despesasreceitas.service'
import { CaixaService } from '../fluxodecaixa/fluxodecaixa.service';
import { ConfirmationService } from 'primeng/primeng';

declare var sha256: any;

@Component({
    selector: '<despesasreceitas-editar></despesasreceitas-editar>',
    templateUrl: './js/app/despesasreceitas/despesasreceitas-editar.component.html',
    styleUrls: ['./js/app/despesasreceitas/despesasreceitas-editar.component.css'],
})
export class DespesasReceitasEditarComponent implements OnInit {
    private menus: MenuItem[];
    categoria: SelectItem[];
    selectedCategoria: string;
    categoriaList: any[] = [];
    searchCategoriaList: any[] = [];
    tipo: string;
    despesaOUreceita: SelectItem[];
    fixaOUparcelada: SelectItem[];
    periodos: SelectItem[];
    repetir: boolean = false;
    br: any;
    parcela: Number;
    lista = [];
    msgs: Message[] = [];
    valor = 0;
    verify = false;
    descricao: string;
    dataDespesaReceita = undefined;
    fixaparcelada: string;
    periodo: string;
    hash: string;
    origem: string;
    tabela: string;
    data0: string;
    data: Date;
    editar: true;

    constructor(private _router: Router,
        private despesasReceitas: DespesasReceitasService,
        private activatedRoute: ActivatedRoute,
        private caixaService: CaixaService,
        private confirmationService: ConfirmationService
    ){
        this.despesaOUreceita = [
            {label:'Selecione', value:null},
            {label:'Despesa', value:'despesa'},
            {label:'Receita', value:'receita'}
        ];

        this.fixaOUparcelada = [
            {label:'Tipo', value:null},
            {label:'Fixa', value:'fixa'},
            {label:'Parcelada', value:'parcelada'}
        ];

        this.periodos = [
            {label:'Periodo', value:null},            
            {label:'Diário', value:'diário'},
            {label:'Semanal', value:'semanal'},
            {label:'Quinzenal', value:'quinzenal'},
            {label:'Mensal', value:'mensal'},
            {label:'Bimestral', value:'bimestral'},
            {label:'Trimestral', value:'trimestral'},
            {label:'Semestral', value:'semestral'},
            {label:'Anual', value:'anual'},
        ];
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
                this.hash = params['hash'];
                let tabela = params['tabela'];
                this.origem = params['origem'];

            this.caixaService.editar(this.hash, tabela).subscribe(
                data => {
                    this.tabela = tabela;
                    this.descricao = data[0].descricao;
                    this.categoria = data[0].selectedCategoria;
                    this.tipo = data[0].tipo;
                    this.valor = data[0].valor;
                    this.data0 = data[0].dataDespesaReceita;
                    this.fixaparcelada = data[0].fixaparcelada;
                    this.periodo = data[0].periodo;
                    this.parcela = data[0].parcela;
                    this.data = new Date(this.data0); //MM-DD-YYYY
                    this.repetir = data[0].repetir;
                },
                error => console.log(error)
            )
        })

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
                label: 'Fluxo de Caixa',
                routerLink: ['/fluxodecaixa']
            },
            {
                label: 'Editar Lista',
            }
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

        this.despesasReceitas.getItem("Categoria")
            .subscribe(
                data => {
                    for(let i = 0; i < data[0].length; i++) {
                        this.categoriaList.push(data[0][i].label);
                    }
                },
                error => {
                    console.log(error)
                }                
            );
    }

    onlyNumber(event){
        var lista = [48,49,50,51,52,53,54,55,56,57];
        var result = lista.indexOf(event.keyCode);
        if(result == -1) {
            return false
        }else{
            return true
        }        
    }

    searchCategoria(event) {
         this.searchCategoriaList = []

        for (let j = 0; j < this.categoriaList.length; j++) {
            try{
                if (this.categoriaList[j].match(event.query)) {
                    this.searchCategoriaList.push(this.categoriaList[j])
                }
            }catch(e){}
        }
    }

    categoriaDropdownClick(event) {       
        this.searchCategoriaList = [];
        setTimeout(() => {
            this.searchCategoriaList = this.categoriaList;
        }, 100)
    }

    onlyDate(event){
        return false
    }

    randomString(length, chars) {
        var mask = '';
        if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
        if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (chars.indexOf('#') > -1) mask += '0123456789';
        if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
        var result = '';
        for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
        return result;
    }

     salvar(
            descricao,
            selectedCategoria,
            tipo,
            valor,
            dataDespesaReceita,
            repetir,
            fixaparcelada,
            periodo,
            parcela,
            hashExcluir
        ) {
            var listaVerify = [];

            if(descricao == undefined || descricao == null || descricao == "") {listaVerify.push(false)}else{listaVerify.push(true)}
            if(tipo == undefined || tipo == null) {listaVerify.push(false)}else{listaVerify.push(true)}
            if(valor == undefined || valor == null || valor == 0) {listaVerify.push(false)}else{listaVerify.push(true)}
            if(dataDespesaReceita == undefined || dataDespesaReceita == null) {listaVerify.push(false)}else{listaVerify.push(true)}

            if(repetir) {
                if(fixaparcelada == undefined || fixaparcelada == null) {listaVerify.push(false)}else{listaVerify.push(true)}
                if(fixaparcelada == "fixa"){
                    if(periodo == undefined || periodo == null) {listaVerify.push(false)}else{listaVerify.push(true)}
                }
                if(fixaparcelada == "parcelada"){
                    if(periodo == undefined || periodo == null) {listaVerify.push(false)}else{listaVerify.push(true)}
                    if(parcela == undefined || parcela == null || parcela == "" || parcela < 2) {listaVerify.push(false)}else{listaVerify.push(true)}
                }
            }

            if(listaVerify.indexOf(false) == -1){
                this.verify = true;
            }else{
                this.verify = false
            }
            listaVerify = [];

            var hashString = this.randomString(32, '#aA!');
            var pwSHA256 = sha256(hashString);

            if(this.verify == true) {
                //this.showSucesso();                
                this.despesasReceitas.postDespesasReceitas(
                    descricao,
                    selectedCategoria,
                    tipo,
                    valor,
                    dataDespesaReceita,
                    repetir,
                    fixaparcelada,
                    periodo,
                    parcela,
                    pwSHA256,
                    true,
                    hashExcluir
                ).subscribe(
                    data => {
                        if(this.origem=="fc"){
                            this._router.navigate(['/fluxodecaixa']);
                        }
                    },
                    error => {
                        console.log(error)
                    }                
                );
            }else{
                this.showError();
            }
    }

    showError() {
        this.msgs = [];
        this.msgs.push({severity:'error', summary:'Erro', detail:'Formulário preenchido incorretamente'});
    }

    //showSucesso() {
    //    this.msgs = [];
    //    this.msgs.push({severity:'success', summary:'Sucesso', detail:'Formulario enviado com sucesso'});
    //}

    sair(){
        if(this.origem=="fc"){
            this._router.navigate(['/fluxodecaixa']);
        }
    }

    excluir(hash) {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir essa Nota?',
            header: 'Excluir',
            icon: 'fa fa-trash',
            accept: () => {
                this.despesasReceitas.exluirNotaDR(hash).subscribe(
                    data => this._router.navigate(['/fluxodecaixa']),
                    error => console.log(error)
                )
            },
            reject: () => {}
        });
    }
}