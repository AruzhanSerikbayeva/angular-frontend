import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CompanyService, Company } from '../../services/company.service';

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-detail.component.html'
})
export class CompanyDetailComponent implements OnInit {
  company?: Company;
  loading = false;

  constructor(private route: ActivatedRoute, private service: CompanyService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCompany(id);
  }

  loadCompany(id: number) {
    this.loading = true;
    this.service.getById(id).subscribe({
      next: (res) => {
        this.company = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Ошибка загрузки компании:', err);
        this.loading = false;
      },
    });
  }
}
