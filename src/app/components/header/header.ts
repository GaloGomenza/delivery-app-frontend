import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/service/auth-service';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  authService = inject(AuthService);
  userService = inject(UserService);
}
