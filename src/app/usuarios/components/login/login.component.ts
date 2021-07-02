import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService} from '../../services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  routerRedirect = '';

  constructor(private usuariosService: UsuariosService,
              private router: Router) { }

  ngOnInit(): void {
  }

  onLogin(form:any):void {
       //console.log('Login', form.value);
       this.usuariosService.login(form.value)
                           .subscribe(res => {
                            if (res.success){

                                //redireccion a empleados
                                //this.router.navigateByUrl('/');
                                this.routerRedirect = this.usuariosService.urlUsuarioIntentaAcceder;
                                this.usuariosService.urlUsuarioIntentaAcceder= '';
                                this.router.navigate([this.routerRedirect]);
                              }else{
                                console.log(res)
                                if (res.message =='password no coincide'){
                                  //alert('password no es');
                                 // console.log('password');
                                  Swal.fire({
                                    icon: 'error', 
                                    title: 'Error',
                                    text: 'Contraseña incorrecta',
                                    confirmButtonColor: '#A1260C'
                                  })
                                }
                                if (res.message =='Usuario no encontrado'){
                                  Swal.fire({
                                    icon: 'error', 
                                    title: 'Error',
                                    text: 'Usuario no encontrado',
                                    confirmButtonColor: '#A1260C'
                                  })
                                }

                            }//else
                           })//subcribe
  }//fin de onlogin

}//fin clase login component
