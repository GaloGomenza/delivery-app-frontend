import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { StoreList } from './pages/store-list/store-list';

export const routes: Routes = [
    {path: '', component : Home},
    {path: 'storeList', component : StoreList}
];
