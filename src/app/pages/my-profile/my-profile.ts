import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../auth/service/auth-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

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
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern('[a-zA-ZÀ-ÿ ]*')]]
    }
  )

  editing = false;
  deleting = false;

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

  changeMode(save:boolean = false):void
  {
    this.editing = !this.editing;

    if (this.editing)
    {
        this.formulario.controls.name.setValue(this.userService.user()?.name ?? '');
        this.formulario.controls.lastName.setValue(this.userService.user()?.lastName ?? '');
    }

    if (save)
    {
      // WIP
    }
  }

  alertDelete():void
  {
    this.deleting = true;
  }

  deleteAccount():void
  {
    // WIP
  }

  cancelDeleteAccount():void
  {
    this.deleting = false;
  }
}
