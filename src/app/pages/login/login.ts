import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/service/auth-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from '../../auth/dtos/loginRequest';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

  public authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  
  formulario = this.fb.nonNullable.group(
    {
    email: ['', [Validators.required, Validators.email, Validators.maxLength(40)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9@._!+\-]+$')]],
    }
  )

  iniciarSesion(){

    let loginRequest: LoginRequest = {
      email: this.formulario.controls['email'].value.trim(),
      password: this.formulario.controls['password'].value
    }

    this.authService.login(loginRequest);

    if(this.authService.error() == null){
      //this.router.navigateByUrl('home');
    }
  }

}
