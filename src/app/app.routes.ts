import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { StoreList } from './pages/store-list/store-list';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { authGuardFnLogin } from './auth/guards/auth.guard.fn.login';
import { authGuardFn } from './auth/guards/auth.guard.fn';
import { Landing } from './pages/landing/landing';
import { MyProfile } from './pages/my-profile/my-profile';
import { OrderStatusPage } from './pages/order-status/order-status';

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
        title: 'Registración',
        canActivate: [authGuardFnLogin]
    },
    {
        path: 'login', 
        component: Login,
        title: 'Iniciar Sesion',
        canActivate: [authGuardFnLogin]
    },
    {
        path: 'myProfile',
        component: MyProfile,
        title: 'Mi Perfil',
        canActivate: [authGuardFn]
    },
    {
        path: 'storeList',
        component : StoreList,
        canActivate: [authGuardFn]
    },
    {
        path: 'orders/:id',
        component: OrderStatusPage,
        title: 'Estado del pedido',
        canActivate: [authGuardFn]
    },


];
