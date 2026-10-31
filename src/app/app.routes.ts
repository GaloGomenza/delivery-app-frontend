import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { StoreList } from './pages/store-list/store-list';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { authGuardFnLogin } from './auth/guards/auth.guard.fn.login';
import { authGuardFn } from './auth/guards/auth.guard.fn';
import { Landing } from './pages/landing/landing';
import { MyProfile } from './pages/my-profile/my-profile';

export const routes: Routes = [
    {   path: '', 
        component: Landing
    },
    {
        path: 'home',
        component: Home,
        canActivate: [authGuardFn]
    },
    {
        path: 'register',
        component: Register,
        canActivate: [authGuardFnLogin]
    },
    {
        path: 'login', 
        component: Login,
        canActivate: [authGuardFnLogin]
    },
    {
        path: 'myProfile',
        component: MyProfile,
        canActivate: [authGuardFn]
    },
    {
        path: 'storeList',
        component : StoreList,
        canActivate: [authGuardFn]
    },


];
