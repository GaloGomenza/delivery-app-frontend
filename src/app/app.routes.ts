import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { StoreList } from './pages/store-list/store-list';
import { StoreDetail } from './pages/store-detail/store-detail';
import { StoreForm } from './pages/store-form/store-form';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { authGuardFnLogin } from './auth/guards/auth.guard.fn.login';
import { authGuardFn } from './auth/guards/auth.guard.fn';
import { Landing } from './pages/landing/landing';
import { MyProfile } from './pages/my-profile/my-profile';
import { OrderStatusPage } from './pages/order-status/order-status';
import { ProductList } from './pages/product/product-list/product-list';
import { ProductForm } from './pages/product/product-form/product-form';
import { OrderUnassignedList } from './pages/order-unassigned-list/order-unassigned-list';

export const routes: Routes = [
    {path: '', component : Home},
    {path: 'store/list', component : StoreList},
    {path: 'store/form', component : StoreForm},
    {path: 'store/form/:id', component : StoreForm},
    {path: 'store/detail/:id', component : StoreDetail},
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
        path: 'orders/unassigned',
        component: OrderUnassignedList,
        title: 'Ver pedidos sin asignar',
        canActivate: [authGuardFn]
    },
    {
        path: 'orders/:id',
        component: OrderStatusPage,
        title: 'Estado del pedido',
        canActivate: [authGuardFn]
    },
    {
        path: 'myProducts',
        component: ProductList,
        title: 'Mis Productos',
        canActivate: [authGuardFn]
    },
    {
        path: 'myProducts/new',
        component: ProductForm,
        title: 'Nuevo Producto',
        canActivate: [authGuardFn]
    },
    {
        path: 'myProducts/edit/:id',
        component: ProductForm,
        title: 'Editar Producto',
        canActivate: [authGuardFn]
    }


];
