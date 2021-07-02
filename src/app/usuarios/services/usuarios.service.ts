import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';//peticiones al backend
import {Observable, BehaviorSubject, Subject} from 'rxjs';//manejo de tokens en el server
import{ tap} from 'rxjs/operators';
import jwt_decode from 'jwt-decode';

import { UsuariosI} from '../models/usuarios';
import { TokensI} from '../models/tokens';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  AUTH_SERVER: string= 'http://localhost:3000/api/';
  authSubject = new BehaviorSubject(false);
 
 
  private token: any = '';

  public urlUsuarioIntentaAcceder = '';
  //indica si el usuario a iniciado o finalisado la sesion
  public changeLoginStatusSubject = new Subject<boolean>();

  //observable crea una variable global en memoria y esta variable
  //llama changeloginstatus$ monitorea cualquier cambio en la variable global
  //y la actualiza en memoria
  public changeLoginStatus$ = this.changeLoginStatusSubject.asObservable();

  public changeUserNameSubject = new Subject<String>();
  public changeUserName$ = this.changeUserNameSubject.asObservable();


  constructor(private httpClient: HttpClient) { }


login(user: UsuariosI): Observable<TokensI>{
  return this.httpClient.post<TokensI>(this.AUTH_SERVER+'login', user)
          .pipe(tap(
            (res) =>{
              if(res.success){//success = true usuario y contraseñas correctas
                var decoded: any=jwt_decode(res.token);
                ///guardamos el nombre del usuario en la variable glocal
                var userName = decoded.user.name;
                this.changeUserNameSubject.next(userName);
                
                //guardamos el token en localstorage
                this.saveToken(res.token, decoded.exp);
                //cambiamos la bariable global de inicio de sesion a true
                this.changeLoginStatusSubject.next(true);
              }
              return this.token;
            }
          ))
}//fin funcion login

//funcion que regresa verdadero si se encuentra un token en memoria de
//y guarda la url enviada como parametro a la variable para
//urlUsuarioIntentaacceder en caso de encontrar el token en localstore
//en caso contrario solo regresa false(el usuario no se ha logeado)

isLogged(url:string): boolean {
  const isLogged = localStorage.getItem("ACCESS_TOKEN");
  if(!isLogged){//no hay token en memoria 
    this.urlUsuarioIntentaAcceder = url;
    return false;

  }
    return true;
}

logout(): void {
  this.token= '';
  localStorage.removeItem("ACCESS_TOKEN");
  localStorage.removeItem("EXPIRESS_IN");
  //el usuario cerro sesion
  this.changeLoginStatusSubject.next(false);
}//FIN DE LOGOUT

  private saveToken(token: string, expiresIn:string): void{
    localStorage.setItem("ACCESS_TOKEN",token);
    localStorage.setItem("EXPIRESS_IN", expiresIn);
    this.token = token;
  }//fin de save token

  private getToken():string{
    if (this.token){
      this.token = localStorage.getItem("ACCESS_TOKEN");
    }
    return this.token;
  }//fin de get token

  getUsers(){
    return this.httpClient.get(
      this.AUTH_SERVER+'users',
      {
        headers: new HttpHeaders({
          'Authorization': 'token-auth '+ this.getToken ()
        
        })
      } 
    )
  }//fin de getusers
  //obtener datos del usuario
  getUser(id:string){
    return this.httpClient.get(
      this.AUTH_SERVER+'users/'+id,
      {
        headers: new HttpHeaders({
            'Authorization': 'token-auth '+this.getToken()
        })
      }
    )
  }//finn de get users
  
  
  //agregar usuario
  addUser(usuario:UsuariosI){
    return this.httpClient.post(
    this.AUTH_SERVER+'users/', usuario,
    {
      headers: new HttpHeaders({
        'Authorization': 'token-auth ' + this.getToken()
      })
    }
    );
  }//fin de addUser

  //remover usarios
  removeUser(id:string){
    return this.httpClient.delete(
      this.AUTH_SERVER+'users/'+id,
      {
        headers: new HttpHeaders({
          'Authorization': 'token-auth ' + this.getToken()
        })
      }
      );
  }

  //UpdateUser

  updateUser(usuario:UsuariosI){
    return this.httpClient.put(
      this.AUTH_SERVER+'users/'+usuario._id,usuario,
      {
        headers: new HttpHeaders({
          'Authorization': 'token-auth '+ this.getToken()
        })
      }
    );
  }//fin de updateUsers
}//fin de class usuariosService