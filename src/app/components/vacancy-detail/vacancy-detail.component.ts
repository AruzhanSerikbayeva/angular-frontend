import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VacancyService } from '../../services/vacancy.service';
import { Vacancy } from '../../services/vacancy.service';
@Component({
  selector: 'app-vacancy-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vacancy-detail.component.html'
})
export class VacancyDetailComponent implements OnInit {
  vacancy?: Vacancy;

  constructor(private route: ActivatedRoute, private service: VacancyService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getById(id).subscribe(v => this.vacancy = v);
  }
}
