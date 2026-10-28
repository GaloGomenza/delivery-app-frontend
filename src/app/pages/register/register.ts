import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/service/auth-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterRequest } from '../../auth/dtos/registerRequest';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {

  private authService = inject(AuthService);
  fb = inject(FormBuilder);
  
  formulario = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
    role: [''],
  })

  registrar(){
    let registerRequest: RegisterRequest = {
      name: this.formulario.controls['name'].value,
      lastName: this.formulario.controls['lastName'].value,
      email: this.formulario.controls['email'].value,
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
  }





}
