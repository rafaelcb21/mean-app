import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FornecedorComponent } from './fornecedor/fornecedor.component';
import { FornecedorEditarComponent } from './fornecedor/fornecedor-editar.component';
import { VenderComponent } from './vender/vender.component';
import { VenderEditarComponent } from './vender/vender-editar.component';
import { CaixaComponent } from './fluxodecaixa/fluxodecaixa.component';
import { DespesasReceitasComponent } from './despesasreceitas/despesasreceitas.component';
import { DespesasReceitasEditarComponent } from './despesasreceitas/despesasreceitas-editar.component';
import { AuthGuard } from './auth.guard';

export const appRoutes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'fornecedor', component: FornecedorComponent, canActivate: [AuthGuard]},
    {path: 'fornecedor-editar/:hash/:tabela/:origem', component: FornecedorEditarComponent, canActivate: [AuthGuard]},
    {path: 'vender-editar/:hash/:tabela/:origem', component: VenderEditarComponent, canActivate: [AuthGuard]},
    {path: 'despesasreceitas-editar/:hash/:tabela/:origem', component: DespesasReceitasEditarComponent, canActivate: [AuthGuard]},
    {path: 'vender', component: VenderComponent, canActivate: [AuthGuard]},
    {path: 'fluxodecaixa', component: CaixaComponent, canActivate: [AuthGuard]},
    {path: 'despesasreceitas', component: DespesasReceitasComponent, canActivate: [AuthGuard]},
    {path: '', redirectTo: 'login', pathMatch: 'full'},
];

export const routing = RouterModule.forRoot(appRoutes);



