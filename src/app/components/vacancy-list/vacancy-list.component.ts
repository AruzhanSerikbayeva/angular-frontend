import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { VacancyService, Vacancy } from '../../services/vacancy.service';

@Component({
  selector: 'app-vacancy-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './vacancy-list.component.html',
})
export class VacancyListComponent implements OnInit {
  vacancies: Vacancy[] = [];
  query = '';
  favorites: number[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;
  loading = false;
  lazyMode = false;
  cities: string[] = [];
  selectedCity: string = '';

  private searchTerms = new Subject<string>();

  constructor(private service: VacancyService) {}

  ngOnInit() {
    this.loadFavorites();
    this.setupReactiveSearch();
    this.loadCities();
    this.loadVacancies();
  }

  /** Handle input safely (fixes parser error) */
  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement | null;
    const value = input?.value ?? '';
    this.onSearchTerm(value);
  }

  /** RxJS live search stream */
  setupReactiveSearch() {
    this.searchTerms
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap((term: string) => {
          this.query = term;
          this.page = 0;
          this.loading = true;

          return term
            ? this.service.searchPaginated(term, this.page, this.size)
            : this.service.getPaginated(this.page, this.size);
        })
      )
      .subscribe({
        next: (res) => {
          this.totalPages = res.totalPages;
          this.totalElements = res.totalElements;
          this.vacancies = res.content;
          this.loading = false;
        },
        error: (err) => {
          console.error('Ошибка при поиске вакансий:', err);
          this.loading = false;
        },
      });
  }

  onSearchTerm(term: string) {
    this.searchTerms.next(term);
  }



loadCities() {
  this.service.getAllCities().subscribe({
    next: (res) => (this.cities = res),
    error: (err) => console.error('Ошибка загрузки городов:', err),
  });
}

onCityChange(city: string) {
  this.selectedCity = city;
  this.page = 0;
  this.loading = true;
  this.service.filterByCity(city, this.page, this.size).subscribe({
    next: (res) => {
      this.vacancies = res.content;
      this.totalPages = res.totalPages;
      this.totalElements = res.totalElements;
      this.loading = false;
    },
    error: (err) => {
      console.error('Ошибка фильтрации по городу:', err);
      this.loading = false;
    },
   });
  }

  /** Load page of vacancies (pagination / lazy load) */
  loadVacancies() {
    this.loading = true;

    const req = this.query
      ? this.service.searchPaginated(this.query, this.page, this.size)
      : this.service.getPaginated(this.page, this.size);

    req.subscribe({
      next: (res) => {
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;

        this.vacancies = this.lazyMode
          ? [...this.vacancies, ...res.content]
          : res.content;

        this.loading = false;
      },
      error: (err) => {
        console.error('Ошибка при загрузке вакансий:', err);
        this.loading = false;
      },
    });
  }

  /** Pagination controls */
  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadVacancies();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadVacancies();
    }
  }

  /** Infinite scroll handler */
  @HostListener('window:scroll', [])
  onScroll() {
    if (!this.lazyMode) return;
    const bottom =
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 100;
    if (bottom && this.page < this.totalPages - 1 && !this.loading) {
      this.page++;
      this.loadVacancies();
    }
  }

  /** Favorites handling */
  toggleFavorite(id: number) {
    const i = this.favorites.indexOf(id);
    if (i >= 0) this.favorites.splice(i, 1);
    else this.favorites.push(id);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  loadFavorites() {
    const fav = localStorage.getItem('favorites');
    if (fav) this.favorites = JSON.parse(fav);
  }

  isFav(id: number) {
    return this.favorites.includes(id);
  }
}
