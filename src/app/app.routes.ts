import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { StoreList } from './pages/store-list/store-list';
import { StoreDetail } from './pages/store-detail/store-detail';
import { StoreForm } from './pages/store-form/store-form';

export const routes: Routes = [
    {path: '', component : Home},
    {path: 'store/list', component : StoreList},
    {path: 'store/form', component : StoreForm},
    {path: 'store/form/:id', component : StoreForm},
    {path: 'store/detail/:id', component : StoreDetail},
];
