import { Component, OnInit, signal } from '@angular/core';
import { TmdbService } from '../../services/tmdb';
import { Filme } from '../../models/filme';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Busca } from '../busca/busca';

@Component({
  selector: 'app-filmes',
  imports: [
    MatCardModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    Busca,
  ],
  templateUrl: './filmes.html',
  styleUrl: './filmes.css',
})
export class Filmes implements OnInit {
  filmes = signal<Filme[]>([]);
  readonly imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  carregando = signal<boolean>(true);
  termoAtual = signal<string>('');
  paginaAtual = signal<number>(1);
  totalResultados = signal<number>(0);
  itensPorPagina = signal(10);

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

  buscar(termo: string, page: number = 1): void {
    this.carregando.set(true);
    this.termoAtual.set(termo);
    this.paginaAtual.set(page);
    const busca$ = termo
      ? this.tmdbService.buscarPorNome(termo, page)
      : this.tmdbService.buscarFilmesPopulares(page);
    busca$.subscribe((resposta) => {
      this.filmes.set(resposta.results);
      this.totalResultados.set(resposta.total_results);
      this.carregando.set(false);
    });
  }
  mudarPagina(event: { pageIndex: number; pageSize: number }): void {
    const novaPagina = event.pageIndex + 1;
    const mudouApenasTamanho = event.pageSize !== this.itensPorPagina();

    this.itensPorPagina.set(event.pageSize);

    // só chama a API se mudou de página, não de tamanho
    if (!mudouApenasTamanho && novaPagina !== this.paginaAtual()) {
      this.buscar(this.termoAtual(), novaPagina);
    }
  }
  filmesPaginados(): Filme[] {
    return this.filmes().slice(0, this.itensPorPagina());
  }
}
