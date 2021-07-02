import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import {Router} from '@angular/router';
import {UsuariosI} from '../../models/usuarios';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup , FormBuilder, Validators } from '@angular/forms';

//importar los validadores personalidados para validar el password
//y confirmar que los password conincide
import { mustMatch } from '../../helpers/must-match-validator';

//libreria para alertas
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  
  //variable del formulario
  
  //variable para el modal
  closeResult = '';

  //variable para el formularop
  //variable para el formularop

  public registerForm!: FormGroup;
  public updateForm!: FormGroup;
  public submitted = false;


  //variable que contendra los datos del usuario a eliminar
  public user:any;

  //arreglo que contendra todos los usuarios de la db

public users :any [];

  constructor(private usuariosService: UsuariosService,
              private router: Router,
              public modal:NgbModal,  //modalpara insertar usuario
              public modalDelete: NgbModal, //modal para eliminar usuarioeeee
              public modalUpdate: NgbModal, //Modal para actualizar el usuario
              private formBuilder : FormBuilder) {
    this.users = new Array();
   }

  ngOnInit(): void {

    //agregamos al incialicar el componente el validador para el nombre
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(6)]],
      passwordconfirm: ['',Validators.required],
      tipo:['',Validators.required]
    },
    {
      validator: mustMatch('password', 'passwordconfirm')
    });


     //validadores para actualizar usuario
     this.updateForm = this.formBuilder.group({
       _id:[''],
      uname: ['', Validators.required],
      uemail: ['', [Validators.required, Validators.email]],
      upassword: ['',[Validators.required, Validators.minLength(6)]],
      utipo:['',Validators.required]
    },
    );
  this.getUsers();
  }//fin de oninit

  //metodo getter para facil acceso a los campos del formulario
  get fields(){
    return this.registerForm?.controls;
  }


  onSubmit(){
    this.submitted = true;
    //detener la ejecusion si laformulano es valida
    if(this.registerForm?.invalid){
      return;
    }
    //console.log(this.registerForm.value)
    let usuario = {
      _id:0,
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      tipo: this.registerForm.value.tipo
    }
    this.usuariosService.addUser(usuario)
                        .subscribe(res => {
                          console.log(res);
                          this.getUsers();//obtenermos los usuarios
                          this.registerForm.reset();//limpiamos el formulario
                          this.modal.dismissAll();//cerramos el modal
                        },
                        err => console.log("HTTP Response", err)
                          )
  }//findel onsubmit

  getUsers(){
    this.usuariosService.getUsers()
                        .subscribe(res => {
                           this.users = res as UsuariosService[];
                           //console.log(this.users);
                        })
  }//fin de gat users

  showUser(_id:string){
    this.router.navigate(['usuarios/'+_id]);
  }//fin de showUser

  open(content:any) {
    this.registerForm.reset();
    this.modal.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }//fin de getDismissReason

  ////metodo para abrir el modal para eliminar usurios
  abrirModalEliminar(id:string, modalName:any){
      this.usuariosService.getUser(id)
                          .subscribe(res=>{
                            this.user = res as UsuariosI;
                          },
                          err => console.log("error al obtener el usuario", err)
                          );
              this.modalDelete.open(modalName, {size: 'sm'})
                              .result.then((res)=>{
                                this.closeResult = `Closed with: ${res}`;
                              },(reason)=>{
                                this.closeResult=`Dismissed ${this.getDismissReason(reason)}`;
                              });
  }//fin de abrir modal

  //metodo para eliminar usuario definitivamente
  deleteUser(id:string){
    //console.log(id)
    this.usuariosService.removeUser(id)
                        .subscribe(res=>{
                          Swal.fire({
                            icon:'success',
                            text:'Usuario Eliminado correctamente',
                            confirmButtonColor:'#A1260C'
                          });
                          this.getUsers();
                          this.modalDelete.dismissAll();
                        },
                        err =>console.log("error al eliminar el usuario", err)
                        );
  }//fin de deleteuser
  //Nota: cada que se modifica usn usario se debera cambiar la contraseña por una una 
  //ya que la encripatcion no permite sobreescribier la contraseña
//carga el usuario a modificar en el moal con sus datos en la base de datos
  updateUser(user:UsuariosI, modalName:any){
   // console.log(user)
   //validadores para actualizar usuario
   this.updateForm = this.formBuilder.group({
    _id:[user._id],
    uname: [user.name, Validators.required],
    uemail: [user.email],
    upassword: ['',[Validators.required, Validators.minLength(6)]],
    utipo:[user.tipo,Validators.required]
  },
  );
  this.modalUpdate.open(modalName)
              .result.then((res)=>{
              this.closeResult = `Closed with: ${res}`;
            },(reason)=>{
              this.closeResult=`Dismissed ${this.getDismissReason(reason)}`;
            });
  }//fin de updateuser
  updateSubmit(){
      if(this.updateForm.invalid)
      return;
      //console.log(this.updateForm.value)
      //creamos el objepto del usuario para actualizar
      let usuerUpdate = {
         _id: this.updateForm.value._id,
         name: this.updateForm.value.uname,
         email: this.updateForm.value.uemail, 
         password: this.updateForm.value.upassword,
         tipo: this.updateForm.value.utipo
      }
      this.usuariosService.updateUser(usuerUpdate)  
                          .subscribe(res=>{
                            //console.log(res);
                            Swal.fire({
                              icon:'success',
                              text:'Usuario Actualizado correctamente',
                              confirmButtonColor:'#30a10c'
                            });
                            this.getUsers();
                            this.modalUpdate.dismissAll();
                          })
  }

  cancelUpdate(){
    this.modalUpdate.dismissAll();
  }
}
