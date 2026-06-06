import { Component, EventEmitter, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-busca',
  imports: [MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule],
  templateUrl: './busca.html',
  styleUrl: './busca.css',
})
export class Busca {
  @Output() termoBuscado = new EventEmitter<string>();

  emitirBusca(termo: string): void {
    if (termo.trim().length < 3) return;
    this.termoBuscado.emit(termo.trim());
  }
}
