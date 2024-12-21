import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [

    {
		path: '',
		loadComponent: () => HomeComponent,
		title: 'Temperature sys',
	
	},
	{ path: '', redirectTo: '', pathMatch: 'full' }, // Corregido

];
