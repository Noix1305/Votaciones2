import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-votaciones-disponibles',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './votaciones-disponibles.component.html',
  styleUrls: ['./votaciones-disponibles.component.scss']
})
export class VotacionesDisponiblesComponent {
  votacionInfo: string = '';

  abrirModal(info: string) {
    this.votacionInfo = info;
    const modal = document.getElementById('modalVotacion');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  cerrarModal() {
    const modal = document.getElementById('modalVotacion');
    if (modal) {
      modal.style.display = 'none';
    }
  }
}
