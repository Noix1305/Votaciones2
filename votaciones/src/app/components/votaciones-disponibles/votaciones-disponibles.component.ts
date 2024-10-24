import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Votacion } from 'src/app/models/votacion';
import { VotacionService } from 'src/app/services/votacionService/votacion.service';

@Component({
  selector: 'app-votaciones-disponibles',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './votaciones-disponibles.component.html',
  styleUrls: ['./votaciones-disponibles.component.scss']
})
export class VotacionesDisponiblesComponent implements OnInit {
  votacionInfo: string = '';

  votacionesActivas: Votacion[] = []

  constructor(
    private _votacionService: VotacionService,
    private router: Router) { }

  ngOnInit() {
    this.cargarVotaciones();
  }

  cargarVotaciones() {
    console.log('Cargando Votaciones')

    this._votacionService.obtenerVotaciones().subscribe({
      next: (votaciones) => {
        this.votacionesActivas = votaciones; // Asigna las votaciones activas
      },
      error: (error) => {
        console.error('Error al cargar votaciones:', error);
      },
      complete: () => {
        console.log('Carga de votaciones completada');
      }
    });
  }

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

  // irAVotar(votacion: Votacion) {
  //   console.log('Votación a enviar:', votacion); // Verifica que tienes datos
  //   // this.router.navigate(['/votaciones'], {
  //   //   state: {
  //   //     votacion: votacion.nombre,
  //   //     descripcion: votacion.descripcion,
  //   //     id: votacion.id_votacion
  //   //   }
  //   // })
  //   this.router.navigate(['/votaciones'], {
  //     state: { votacion } // Envía el objeto de votación completo
  //   });
  // }

  async irAVotar(votacion: Votacion) {
    console.log('Votación a enviar:', votacion);
    // Guardar la votación en localStorage
    localStorage.setItem('votacion', JSON.stringify(votacion));
    // Navegar a la página de votaciones
    this.router.navigate(['/votaciones']);
  }

}
