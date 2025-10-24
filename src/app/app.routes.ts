// import { Routes } from '@angular/router';
// import { VacancyListComponent } from './components/vacancy-list/vacancy-list.component';
// import { VacancyDetailComponent } from './components/vacancy-detail/vacancy-detail.component';


// export const routes: Routes = [
//     {
//       path: '',
//       loadComponent: () =>
//         import('./components/vacancy-list/vacancy-list.component').then(
//           (m) => m.VacancyListComponent
//         ),
//     },
//     {
//       path: 'vacancy/:id',
//       loadComponent: () =>
//         import('./components/vacancy-detail/vacancy-detail.component').then(
//           (m) => m.VacancyDetailComponent
//         ),
//     },
//   ];
  
import { Routes } from '@angular/router';
import { VacancyListComponent } from './components/vacancy-list/vacancy-list.component';
import { VacancyDetailComponent } from './components/vacancy-detail/vacancy-detail.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyDetailComponent } from './components/company-detail/company-detail.component';

export const routes: Routes = [
  { path: '', component: VacancyListComponent },
  { path: 'vacancy/:id', component: VacancyDetailComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'companies', component: CompanyListComponent },
  { path: 'company/:id', component: CompanyDetailComponent },
];
