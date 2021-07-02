import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// REGLA que indica que cuando el usuario teclee una ruta no valida 
//el sistema se redirija a visualizar el componente empleados
const routes: Routes = [
  {
   path: '**', redirectTo: '/empleados', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
