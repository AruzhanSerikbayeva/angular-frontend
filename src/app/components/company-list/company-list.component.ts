import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CompanyService, Company } from '../../services/company.service';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './company-list.component.html'
})
export class CompanyListComponent implements OnInit {
  companies: Company[] = [];
  query = '';
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;
  loading = false;
  private searchTerms = new Subject<string>();

  constructor(private service: CompanyService) {}

  ngOnInit() {
    this.setupReactiveSearch();
    this.loadCompanies();
  }

  setupReactiveSearch() {
    this.searchTerms
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap((term: string) => {
          this.loading = true;
          this.page = 0;
          return term
            ? this.service.searchPaginated(term, this.page, this.size)
            : this.service.getPaginated(this.page, this.size);
        })
      )
      .subscribe({
        next: (res) => {
          this.companies = res.content;
          this.totalPages = res.totalPages;
          this.totalElements = res.totalElements;
          this.loading = false;
        },
        error: (err) => {
          console.error('Ошибка при поиске компаний:', err);
          this.loading = false;
        },
      });
  }

  onSearchTerm(term: string) {
    this.searchTerms.next(term);
  }

  loadCompanies() {
    this.loading = true;
    this.service.getPaginated(this.page, this.size).subscribe({
      next: (res) => {
        this.companies = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.loading = false;
      },
      error: (err) => {
        console.error('Ошибка при загрузке компаний:', err);
        this.loading = false;
      },
    });
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadCompanies();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadCompanies();
    }
  }
}
