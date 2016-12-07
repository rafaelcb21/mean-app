import { Routes, RouterModule } from '@angular/router';
import { FornecedorComponent } from './fornecedor/fornecedor.component';

export const appRoutes: Routes = [
    {path: 'fornecedor', component: FornecedorComponent},
    {path: '', redirectTo: 'fornecedor', pathMatch: 'full'},
];

export const routing = RouterModule.forRoot(appRoutes);

