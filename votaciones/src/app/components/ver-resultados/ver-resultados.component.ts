import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ver-resultados',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ver-resultados.component.html',
  styleUrls: ['./ver-resultados.component.scss']
})
export class VerResultadosComponent {
  resultados = [
    { candidato: 'Candidato 1', votos: 300 },
    { candidato: 'Candidato 2', votos: 450 },
    { candidato: 'Candidato 3', votos: 250 }
    // Agrega más resultados según sea necesario
  ];
}
