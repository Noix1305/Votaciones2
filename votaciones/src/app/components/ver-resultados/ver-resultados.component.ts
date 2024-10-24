import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Votacion } from 'src/app/models/votacion';
import { VotacionService } from 'src/app/services/votacionService/votacion.service';

@Component({
  selector: 'app-ver-resultados',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ver-resultados.component.html',
  styleUrls: ['./ver-resultados.component.scss']
})
export class VerResultadosComponent implements OnInit {

  seleccionada: Votacion | null = null;
  votaciones: Votacion[] = [
    // tus datos de ejemplo
  ];
  resultados = [
    { candidato: 'Candidato 1', votos: 300 },
    { candidato: 'Candidato 2', votos: 450 },
    { candidato: 'Candidato 3', votos: 250 }
    // Agrega más resultados según sea necesario
  ];

  constructor(
    private _votacionService: VotacionService
  ) { }
  async ngOnInit() {
    await this.cargarVotaciones();
  }

  verResultados(votacion: Votacion) {
    this.seleccionada = votacion;
  }

  volver() {
    this.seleccionada = null;
  }

  async cargarVotaciones() {
    console.log('Cargando Votaciones')
    this._votacionService.obtenerTodasLasVotaciones().subscribe({
      next: (votaciones) => {
        this.votaciones = votaciones; // Asigna las votaciones activas
      },
      error: (error) => {
        console.error('Error al cargar votaciones:', error);
      },
      complete: () => {
        console.log('Carga de votaciones completada');
      }
    });
  }
}
