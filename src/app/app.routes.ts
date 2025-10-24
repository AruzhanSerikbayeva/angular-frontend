import { Routes } from '@angular/router';
import { VacancyDetailComponent } from './components/vacancy-detail/vacancy-detail.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyDetailComponent } from './components/company-detail/company-detail.component';
import { VacancyListComponent } from './components/vacancy-list/vacancy-list.component';

export const routes: Routes = [
  { path: '', component: VacancyListComponent },
  { path: 'vacancy/:id', component: VacancyDetailComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'companies', component: CompanyListComponent },
  { path: 'company/:id', component: CompanyDetailComponent },
];
