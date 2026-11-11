import { inject } from '@angular/core';
import { AuthService } from '../service/auth-service';
import { Router } from '@angular/router';

export const authGuardFnLogin = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if(!authService.isUserLogged()){
        return true;
    }else{
        router.navigateByUrl('home');
        return false;
    }
}