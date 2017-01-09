import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FornecedorComponent } from './fornecedor/fornecedor.component';
import { VenderComponent } from './vender/vender.component';

export const appRoutes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'fornecedor', component: FornecedorComponent},
    {path: 'vender', component: VenderComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'},
];

export const routing = RouterModule.forRoot(appRoutes);



