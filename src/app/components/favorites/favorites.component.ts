import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VacancyService, Vacancy } from '../../services/vacancy.service';
@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favorites.component.html'
})
export class FavoritesComponent implements OnInit {
  favorites: number[] = [];
  vacancies: Vacancy[] = [];

  constructor(private service: VacancyService) {}

  ngOnInit() {
    const fav = localStorage.getItem('favorites');
    if (fav) this.favorites = JSON.parse(fav);
    this.loadFavorites();
  }

  loadFavorites() {
    if (this.favorites.length === 0) return;
    // Fetch each vacancy by ID
    this.vacancies = [];
    this.favorites.forEach((id) => {
      this.service.getById(id).subscribe({
        next: (v) => this.vacancies.push(v),
        error: (err) => console.error('Error loading favorite vacancy:', err)
      });
    });
  }

  /** Remove from favorites, but only visible after refresh */
  removeFavorite(id: number) {
    const fav = localStorage.getItem('favorites');
    if (!fav) return;
    const parsed = JSON.parse(fav) as number[];
    const updated = parsed.filter((f) => f !== id);
    localStorage.setItem('favorites', JSON.stringify(updated));
  }
}
