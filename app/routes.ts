import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FornecedorComponent } from './fornecedor/fornecedor.component';
import { FornecedorEditarComponent } from './fornecedor/fornecedor-editar.component';
import { VenderComponent } from './vender/vender.component';
import { CaixaComponent } from './fluxodecaixa/fluxodecaixa.component';
import { DespesasReceitasComponent } from './despesasreceitas/despesasreceitas.component';

export const appRoutes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'fornecedor', component: FornecedorComponent},
    {path: 'fornecedor-editar/:hash/:tabela', component: FornecedorEditarComponent},
    {path: 'vender', component: VenderComponent},
    {path: 'fluxodecaixa', component: CaixaComponent},
    {path: 'despesasreceitas', component: DespesasReceitasComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'},
];

export const routing = RouterModule.forRoot(appRoutes);



