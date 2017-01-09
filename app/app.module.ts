import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { routing } from './routes';
import { FornecedorComponent } from './fornecedor/fornecedor.component';
import { FornecedorService } from './fornecedor/fornecedor.service';
import { LoginComponent } from './login/login.component';
import { VenderComponent } from './vender/vender.component';
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
  MenuModule } from 'primeng/primeng';
import { TextMaskModule } from 'angular2-text-mask';
//import { MoneyMaskDirective } from './mask/money-mask.directive';
import { CurrencyMaskDirective } from './ng2-currency-mask-master/currency-mask.directive';
//import { CurrencyMaskModule } from "ng2-currency-mask";
//import { MoneyMaskModule } from 'ng2-money-mask';

@NgModule({
  declarations: [
    AppComponent,
    FornecedorComponent,
    LoginComponent,
    VenderComponent,
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
//    CurrencyMaskModule,
//    MoneyMaskModule,
  ],
  providers: [
    FornecedorService,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}