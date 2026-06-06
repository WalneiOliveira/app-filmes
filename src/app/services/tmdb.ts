import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RespostaApi } from '../models/filme';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Ioc decorator @injectable sinaliza que a classe TmdbService é elegível para DI
@Injectable({
  providedIn: 'root', // Torna o serviço global na aplicação (instância única)
})
export class TmdbService {
  private apiUrl: string = 'https://api.themoviedb.org/3';
  private token = environment.tmdbToken;
  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    accept: 'application/json',
  });

  // O Angular injeta automaticamente o HttpClient aqui
  constructor(private http: HttpClient) {}

  private request<T>(endpoint: string): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    return this.http.get<T>(url, { headers: this.headers });
  }

  buscarFilmesPopulares(page: number = 1): Observable<RespostaApi> {
    return this.request<RespostaApi>(`/movie/popular?page=${page}`);
  }

  buscarPorNome(query: string, page: number = 1): Observable<RespostaApi> {
    return this.request<RespostaApi>(
      `/search/movie?query=${query}&page=${page}`,
    );
  }
}
