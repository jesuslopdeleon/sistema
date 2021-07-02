import { R3FactoryDelegateType } from '@angular/compiler/src/render3/r3_factory';
import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/usuarios/services/usuarios.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  usuarioLogueado = false;
  userName:String ='';
  constructor(public usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.usuarioLogueado = this.usuariosService.isLogged('');
    //traemos el estatus del usuario de memoria global para sabe
    //si tiene una sesion activa
    this.usuariosService.changeLoginStatus$
                        .subscribe((loggedStatus:boolean)=>{
                          this.usuarioLogueado = loggedStatus;
                        })
  this.usuariosService.changeUserName$.subscribe((userName:String)=>{
      this.userName = userName;
  })
  }//fin de ngOnInit
  logout(){
    this.usuariosService.logout();
  }

}
