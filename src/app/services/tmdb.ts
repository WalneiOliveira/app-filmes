import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RespostaApi } from '../models/filme';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private apiUrl: string = 'https://api.themoviedb.org/3';
  private token = environment.tmdbToken;

  constructor(private http: HttpClient) {}

  buscarFilmesPopulares(): Observable<RespostaApi> {
    const url = `${this.apiUrl}/movie/popular`; //?language=pt-BR
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      accept: 'application/json',
    });
    return this.http.get<RespostaApi>(url, { headers });
  }

  buscarPorNome(query: string): Observable<RespostaApi> {
    const url = `${this.apiUrl}/search/movie?query=${query}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      accept: 'application/json',
    });
    return this.http.get<RespostaApi>(url, { headers });
  }
}
