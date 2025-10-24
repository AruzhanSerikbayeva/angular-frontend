import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Company {
  id: number;
  companyName: string;
  companyDescription: string;
  companyUrl?: string;
  city: string;
}

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private api = `${environment.apiUrl}/companies`;

  constructor(private http: HttpClient) {}

  // Пагинированное получение всех компаний
  getPaginated(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.api}?page=${page}&size=${size}`);
  }

  // Пагинированный поиск
  searchPaginated(query: string, page: number, size: number): Observable<any> {
    return this.http.get<any>(
      `${this.api}/search?query=${query}&page=${page}&size=${size}`
    );
  }

  getById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.api}/${id}`);
  }
}
