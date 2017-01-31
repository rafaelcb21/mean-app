import { NgModule, LOCALE_ID } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { routing } from './routes';
import { FornecedorComponent } from './fornecedor/fornecedor.component';
import { FornecedorService } from './fornecedor/fornecedor.service';
import { VenderService } from './vender/vender.service';
import { LoginComponent } from './login/login.component';
import { VenderComponent } from './vender/vender.component';
import { CaixaComponent } from './fluxodecaixa/fluxodecaixa.component';
import { CaixaService } from './fluxodecaixa/fluxodecaixa.service';
import { NumberBrasil } from './fluxodecaixa/fluxodecaixa.pipe';
import { DespesasReceitasComponent } from './despesasreceitas/despesasreceitas.component';
import { DespesasReceitasService } from './despesasreceitas/despesasreceitas.service';

import { 
  DropdownModule,
  CalendarModule,
  InputTextModule, 
  OverlayPanelModule,
  ButtonModule,
  AutoCompleteModule, 
  FieldsetModule,
  GrowlModule,
  ContextMenuModule,
  SliderModule,
  PanelModule,
  MenuModule,
  DataTableModule,
  CheckboxModule,
  SharedModule } from 'primeng/primeng';

import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskDirective } from './ng2-currency-mask-master/currency-mask.directive';
//import { CurrencyMaskModule } from "ng2-currency-mask";
//import { MoneyMaskModule } from 'ng2-money-mask';
//import { MoneyMaskDirective } from './mask/money-mask.directive';

@NgModule({
  declarations: [
    AppComponent,
    FornecedorComponent,
    LoginComponent,
    VenderComponent,
    CaixaComponent,
    NumberBrasil,
    DespesasReceitasComponent,
    //MoneyMaskDirective, 
    CurrencyMaskDirective],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
	  CommonModule,
    DropdownModule,
    CalendarModule,
    InputTextModule,
    OverlayPanelModule,
    HttpModule,
    ButtonModule,
    TextMaskModule,
    AutoCompleteModule,
    FieldsetModule,
    GrowlModule,
    ContextMenuModule,
    MenuModule,
    SliderModule,
    PanelModule,
    DataTableModule,
    SharedModule,
    CheckboxModule,
//    CurrencyMaskModule,
//    MoneyMaskModule,
  ],
  providers: [
    FornecedorService,
    VenderService,
    CaixaService,
    DespesasReceitasService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: LOCALE_ID, useValue: "pt-BR"},
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}