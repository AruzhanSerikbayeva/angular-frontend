import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Vacancy {
  id: number;
  position: string;
  location: string;
  salary: string;
  contacts: string;
  description: string;
  company: { id: number; companyName: string; city: string };
}

export interface VacancyPage {
  content: Vacancy[];
  totalPages: number;
  totalElements: number;
  number: number; // текущая страница
}

@Injectable({ providedIn: 'root' })
export class VacancyService {
  private api = `${environment.apiUrl}/vacancies`;

  constructor(private http: HttpClient) {}

  getPaginated(page: number, size: number): Observable<VacancyPage> {
    return this.http.get<VacancyPage>(`${this.api}?page=${page}&size=${size}`);
  }

  searchPaginated(query: string, page: number, size: number): Observable<VacancyPage> {
    return this.http.get<VacancyPage>(`${this.api}/search?query=${query}&page=${page}&size=${size}`);
  }

  getById(id: number): Observable<Vacancy> {
    return this.http.get<Vacancy>(`${this.api}/${id}`);
  }

  getAllCities(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/cities`);
  }
  
  filterByCity(city: string, page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.api}/filter?location=${city}&page=${page}&size=${size}`);
  }

  getByCompany(companyId: number, page: number, size: number): Observable<VacancyPage> {
    return this.http.get<VacancyPage>(`${this.api}/company/${companyId}?page=${page}&size=${size}`);
  }
}
