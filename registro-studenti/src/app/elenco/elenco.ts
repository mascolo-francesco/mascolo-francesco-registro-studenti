import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StudentiService } from '../services/studenti-service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-elenco',
  styleUrl: './elenco.css',
  templateUrl: './elenco.html',
})
export class Elenco {
  private readonly studentiService = inject(StudentiService);
  readonly filtroClasse = signal('');
  readonly filtrati = computed(() => {
    const filtro = this.filtroClasse().trim().toUpperCase();
    const tutti = this.studentiService.studenti();
    if (filtro === '') {
      return tutti;
    }
    return tutti.filter(s => s.classe.toUpperCase() === filtro);
  });
  readonly ordine = signal<'nome' | 'media'>('nome');
  readonly visibili = computed(() => {
    const copia = [...this.filtrati()];
    if (this.ordine() === 'nome') {
      return copia.sort((a, b) => a.nome.localeCompare(b.nome));
    }
    return copia.sort((a, b) => b.mediaVoti - a.mediaVoti);
  });

  rimuovi(id: number): void {
    this.studentiService.rimuovi(id);
  }
}
