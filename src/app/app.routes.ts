import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { StoreList } from './pages/store-list/store-list';
import { Register } from './pages/register/register';

export const routes: Routes = [
    {path: '', component : Home},
    {path: 'storeList', component : StoreList},
    {path: 'register', component: Register} 
];
