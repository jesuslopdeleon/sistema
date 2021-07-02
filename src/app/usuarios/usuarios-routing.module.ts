import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActiveGuard } from '../can-active.guard';
import { LoginComponent } from './components/login/login.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import {UsuariodetalleComponent} from './components/usuariodetalle/usuariodetalle.component';


//LA RUTA 
//ruta localhost:4200/USUARIOS
const routes: Routes = [
{ path: 'usuarios', 
  component: UsuariosComponent, 
  canActivate: [CanActiveGuard],
  children: [
    { path: ':id', component: UsuariodetalleComponent,
    canActivate: [CanActiveGuard]
  }
  ]
},
{ path: 'login', component: LoginComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
