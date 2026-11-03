import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/service/auth-service';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RegisterRequest } from '../../auth/dtos/registerRequest';
import { Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {

  public authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  
  formulario = this.fb.nonNullable.group(
    {
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern('[a-zA-ZÀ-ÿ ]*')]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern('[a-zA-ZÀ-ÿ ]*')]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(40)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9@._!+\-]+$')]],
    confirmPassword: ['', Validators.required],
    role: ['CONSUMER']
    },
    {
    validators: this.matchValues('password', 'confirmPassword')
    }
  )

  registrar(){
    let registerRequest: RegisterRequest = {
      name: this.formulario.controls['name'].value.trim(),
      lastName: this.formulario.controls['lastName'].value.trim(),
      email: this.formulario.controls['email'].value.trim(),
      password: this.formulario.controls['password'].value,
      role: 'ROLE_CONSUMER'
    }
    if(this.formulario.controls['role'].value == 'MERCHANT'){
      registerRequest.role = 'ROLE_MERCHANT';
    }
    if(this.formulario.controls['role'].value == 'RIDER'){
      registerRequest.role = 'ROLE_RIDER';
    }

    this.authService.register(registerRequest);

    if(this.authService.error() == null){
      //this.router.navigateByUrl('home');
    }
  }


  private matchValues(controlName: string, matchingControlName: string): ValidatorFn {

  return (group: AbstractControl): ValidationErrors | null => {
    const control = group.get(controlName);
    const matchingControl = group.get(matchingControlName);

    if (!control || !matchingControl) return null;

    // Si el control ya tiene otros errores activos (ej: required), no los pisamos
    if (matchingControl.errors && !matchingControl.errors['mustMatch']) return null;

    // Comparamos los valores
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
      return { mustMatch: true };
    } else {
      matchingControl.setErrors(null);
      return null;
    }
  };
}



}
