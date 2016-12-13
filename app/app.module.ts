import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { routing } from './routes';
import { FornecedorComponent } from './fornecedor/fornecedor.component';
import { DropdownModule, CalendarModule, InputTextModule } from 'primeng/primeng';


@NgModule({
  declarations: [AppComponent, FornecedorComponent],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
	  CommonModule,
    DropdownModule,
    CalendarModule,
    InputTextModule,
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}