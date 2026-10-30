import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/service/auth-service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  authService = inject(AuthService);
 

}
