import { Component, OnInit, signal } from '@angular/core';
import { TmdbService } from '../../services/tmdb';
import { Filme } from '../../models/filme';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Busca } from '../busca/busca';

@Component({
  selector: 'app-filmes',
  imports: [MatCardModule, CommonModule, MatProgressSpinnerModule, Busca],
  templateUrl: './filmes.html',
  styleUrl: './filmes.css',
})
export class Filmes implements OnInit {
  filmes = signal<Filme[]>([]);
  readonly imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  carregando = signal<boolean>(true);

  constructor(private tmdbService: TmdbService) {}

  ngOnInit() {
    this.buscar('');
  }

  resumir(texto: string, limite: number = 80): string {
    return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
  }

  corDaNota(nota: number): string {
    if (nota >= 8) return '#1D9E75';
    if (nota >= 7) return '#EF9F27';
    return '#E24B4A';
  }

  buscar(termo: string): void {
    // spiner enquanto espera o resposta da busca
    this.carregando.set(true);
    // ternário com condição pra o tipo de renderização
    const busca$ = termo
      ? this.tmdbService.buscarPorNome(termo)
      : this.tmdbService.buscarFilmesPopulares();
    // logica aplicada a ambos os métodos conforme valor assignado à variavel no ternário
    busca$.subscribe((resposta) => {
      this.filmes.set(resposta.results);
      this.carregando.set(false);
    });
  }
}
