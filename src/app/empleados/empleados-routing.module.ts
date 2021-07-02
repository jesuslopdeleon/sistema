import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { /*CanActiveGuard*/CanActiveGuard } from '../can-active.guard';
import { EmpleadosComponent } from './components/empleados/empleados.component';

//ruta localhost:4200/empleados
const routes: Routes = [
  {
    path: 'empleados', component: EmpleadosComponent,
    canActivate: [CanActiveGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpleadosRoutingModule { }
