import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../auth/service/auth-service';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserUpdateRequest } from '../../models/User';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-my-profile',
  styleUrl: './my-profile.css',
  templateUrl: './my-profile.html',
})
export class MyProfile implements OnInit{
  userService = inject(UserService);
  authService = inject(AuthService);

  fb = inject(FormBuilder);
  formulario = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern('[a-zA-ZÀ-ÿ ]*')]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern('[a-zA-ZÀ-ÿ ]*')]],
      password: ['', [Validators.minLength(6), Validators.maxLength(20), Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9@._!+\-]+$')]],
      confirmPassword: ['', [Validators.minLength(6), Validators.maxLength(20)]]
    },
    {
      validators: this.matchValues('password', 'confirmPassword')
    }
  )

  editing = false;
  deleting = false;
  guardando = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.userService.getMyProfile();
  }

  getRole(): string{
    let role:string = 'Error al encontrar el rol';

    switch (this.authService.loggedUser()?.role)
    {
      case 'ROLE_CONSUMER':
        role = 'Consumidor';
        break;
      case 'ROLE_MERCHANT':
        role = 'Comerciante';
        break;
      case 'ROLE_RIDER':
        role = 'Repartidor';
        break;
    }

    return role;
  }

  mensaje(campo: string): string | null
  {
    const control = this.formulario.get(campo);

    if (control == null || control.errors == null || !(control.touched || control.dirty))
      return null;

    const errors = control.errors;

    if (errors['required'])
      return 'El campo es obligatorio';

    if (errors['minlength'])
      return `Debe tener al menos ${errors['minlength'].requiredLength} caracteres`;

    if (errors['maxlength'])
      return `Debe tener como máximo ${errors['maxlength'].requiredLength} caracteres`;

    if (errors['pattern'])
    {
      switch (campo)
      {
        case 'password':
          return 'La contraseña debe tener:\n- al menos una letra minúscula\n- al menos una letra mayúscula\n- al menos un número\n- símbolos válidos: @ . _ - ! +';
        default:
          return 'Solo se permiten letras y espacios';
      }
    }

    if (errors['mustMatch'])
      return 'La contraseña debe coincidir';

    return 'Valor inválido';
  }

  editar():void
  {
    this.error.set('');
    this.cargarFormulario();
    this.editing = true;
  }

  cancelar():void
  {
    this.error.set('');
    this.cargarFormulario();
    this.editing = false;
  }

  guardar():void
  {
    if (this.formulario.invalid)
    {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();
    const password = valores.password.trim();

    const body: UserUpdateRequest = {
      name: valores.name.trim(),
      lastName: valores.lastName.trim()
    };

    if (password != '')
    {
      body.password = password;
    }

    this.error.set('');
    this.guardando.set(true);

    this.userService.updateMyProfile(
      body,
      () => {
        this.guardando.set(false);
        this.formulario.controls.password.setValue('');
        this.formulario.controls.confirmPassword.setValue('');
        this.editing = false;
      },
      (mensaje) => {
        this.guardando.set(false);
        this.error.set(mensaje);
      }
    );
  }

  private cargarFormulario():void
  {
    this.formulario.controls.name.setValue(this.userService.user()?.name ?? '');
    this.formulario.controls.lastName.setValue(this.userService.user()?.lastName ?? '');
    this.formulario.controls.password.setValue('');
    this.formulario.controls.confirmPassword.setValue('');
  }

  private matchValues(controlName: string, matchingControlName: string): ValidatorFn
  {
    return (group: AbstractControl): ValidationErrors | null => {
      const control = group.get(controlName);
      const matchingControl = group.get(matchingControlName);

      if (!control || !matchingControl) return null;

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) return null;

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
        return { mustMatch: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }

  alertDelete():void
  {
    this.deleting = true;
  }

  deleteAccount():void
  {
    this.deleting = false;

    this.authService.deleteMyAccount();
  }

  cancelDeleteAccount():void
  {
    this.deleting = false;
  }
}
