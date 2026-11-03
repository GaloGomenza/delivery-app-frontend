import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user-service';

@Component({
  imports: [],
  selector: 'app-my-profile',
  styleUrl: './my-profile.css',
  templateUrl: './my-profile.html',
})
export class MyProfile {

  userService = inject(UserService);

  getMyProfile(){
    this.userService.getMyProfile();
    
  }

}
