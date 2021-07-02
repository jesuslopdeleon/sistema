import { FormGroup } from "@angular/forms";


//hacer validador para  hacer coincidir dos campos con el paswword
export function mustMatch(controlName: string, matchingControlName: string){
    return(formGroup: FormGroup) => {
        //asignamos a dos variables los elementos del formulario para validar
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if(matchingControl.errors && !matchingControl.errors.mustMatch){
            //ejecutamos un retur si otro validador ha encontrado errores
            //en eñ control de errores matching controls
            return;
        }
        //establecemos el control de errores matchingcontrol
        //en verdadero si la validacion falla. es decir si los 
        //password no coinciden
        if(control.value !== matchingControl.value)
            matchingControl.setErrors({mustMatch:true});
        else //los password son iguales y no hay error
            matchingControl.setErrors(null);

    }//fin return
}//fin funcion mustMatch