import { Component, computed, inject } from '@angular/core';
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

  displayName = computed(() => {
    const user = this.userService.user();

    if (user)
      return user.name + ' ' + user.lastName;

    return this.authService.loggedUser()?.email;
  });
}
