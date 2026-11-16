import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/service/auth-service';

export const roleMerchantGuardFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if(authService.loggedUser()?.role === 'ROLE_MERCHANT'){
        return true;
    }else{
        router.navigateByUrl('home');
        return false;
    }
}