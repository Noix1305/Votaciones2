import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { Router, RouterModule } from '@angular/router'; // Importa RouterModule si usas el enrutamiento
import { Candidato } from 'src/app/models/candidato';
import { CandidatoService } from 'src/app/services/canditatoService/candidato.service';
import { Votacion } from 'src/app/models/votacion';

@Component({
  selector: 'app-votaciones',
  standalone: true,
  imports: [CommonModule, RouterModule], // Agrega los módulos aquí
  templateUrl: './votaciones.component.html',
  styleUrls: ['./votaciones.component.scss']
})
export class VotacionesComponent implements OnInit {
  votacion!: Votacion;
  candidatos: Candidato[] = [];
  idVotacion: number | null = null;

  constructor(
    private router: Router,
    private _candidatoService: CandidatoService
  ) { }

  async ngOnInit(): Promise<void> {
    console.log('ngOnInit VotacionesComponent');

    // Cargar la votación desde localStorage
    const votacionJson = localStorage.getItem('votacion');

    if (votacionJson) {
      this.votacion = await JSON.parse(votacionJson); // Convertir el string JSON a objeto
      console.log('Votación recibida:', this.votacion);
    } else {
      console.error('No se encontró la votación en localStorage.');
    }
    if (this.votacion) {
      this.cargarCandidatos(this.votacion.id_votacion);
    }
  }

  cargarCandidatos(id_votacion: number): void {
    this._candidatoService.obtenerCandidatosConFoto(id_votacion).subscribe({
      next: (candidatosConFoto) => {
        console.log('Candidatos con fotos:', candidatosConFoto);
        this.candidatos = candidatosConFoto; // Asigna el resultado al array de candidatos en el componente
      },
      error: (error) => {
        console.error('Error al cargar candidatos con fotos:', error);
      }
    });
  }

  guardarYVerCandidato(candidato: Candidato): void {
    sessionStorage.setItem('candidato', JSON.stringify(candidato)); // Guardar candidato en sessionStorage
    this.router.navigate(['/ver-candidato']);
  }
  
  irAVotar(candidato: Candidato): void {
    console.log('Candidato router:', candidato); // Muestra el objeto candidato completo
  }
  
}

