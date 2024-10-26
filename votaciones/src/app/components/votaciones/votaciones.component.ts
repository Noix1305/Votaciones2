import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { Router, RouterModule } from '@angular/router'; // Importa RouterModule si usas el enrutamiento
import { Candidato } from 'src/app/models/candidato';
import { CandidatoService } from 'src/app/services/canditatoService/candidato.service';
import { Votacion } from 'src/app/models/votacion';
import { interval, Subscription } from 'rxjs';
import { VotacionService } from 'src/app/services/votacionService/votacion.service';
import { Votos } from 'src/app/models/voto';

@Component({
  selector: 'app-votaciones',
  standalone: true,
  imports: [CommonModule, RouterModule], // Agrega los módulos aquí
  templateUrl: './votaciones.component.html',
  styleUrls: ['./votaciones.component.scss']
})
export class VotacionesComponent implements OnInit, OnDestroy {
  votacion!: Votacion;
  candidatos: Candidato[] = [];
  idVotacion: number | null = null;

  tiempoRestante: string = '';
  tiempoHastaInicio: string = ''; // Nueva variable para el tiempo hasta el inicio
  private timerSubscription!: Subscription;

  constructor(
    private router: Router,
    private _candidatoService: CandidatoService,
    private _votacionService: VotacionService
  ) { }

  async ngOnInit(): Promise<void> {
    console.log('ngOnInit VotacionesComponent');

    const votacionJson = localStorage.getItem('votacion');

    if (votacionJson) {
      this.votacion = await JSON.parse(votacionJson);
      console.log('Votación recibida:', this.votacion);
    }

    this.cargarCandidatos(this.votacion.id_votacion);
    console.log('Candidatos cargados:', this.candidatos);

    // Actualizar cada segundo
    this.timerSubscription = interval(1000).subscribe(() => {
      this.tiempoHastaInicio = this._votacionService.calcularTiempoRestante(this.votacion);
      this.tiempoRestante = this._votacionService.calcularTiempoHastaInicio(this.votacion); // Actualizar el tiempo hasta el inicio
    });
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe(); // Limpiar la suscripción al destruir
    }
  }

  async cargarCandidatos(id_votacion: number) {

    this._candidatoService.obtenerCandidatosConFoto(id_votacion).subscribe({
      next: (candidatosConFoto) => {
        console.log('Candidatos con fotos:', candidatosConFoto);
        if (Array.isArray(candidatosConFoto) && candidatosConFoto.length > 0) {
          this.candidatos = candidatosConFoto; // Asigna el resultado al array de candidatos en el componente
          console.log('Candidatos asignados:', this.candidatos); // Verifica la asignación
        } else {
          console.warn('No se encontraron candidatos.');
        }
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

  async irAVotar(candidato: Candidato): Promise<void> {
    const usuarioString = localStorage.getItem('userInfo');
    if (!usuarioString) {
      console.error('No se encontró información del usuario en localStorage.');
      return; // Detiene la ejecución si no hay información del usuario
    }

    const usuario = JSON.parse(usuarioString);

    // Verificar si el usuario tiene la propiedad habilitado
    if (!usuario.habilitado) {
      console.error('El usuario no está habilitado para votar.');
      return; // Detiene la ejecución si el usuario no está habilitado
    }

    // Verificar si la fecha actual está dentro del rango de la votación
    if (!this.isVotacionActiva(this.votacion)) {
      console.error('La votación no está activa en este momento.');
      return; // Detiene la ejecución si la votación no está activa
    }

    // Consultar si ya votó en esta votación
    const yaVoto = await this._votacionService.verificarVotoRegistrado(usuario.id_usuario, this.votacion.id_votacion);

    if (yaVoto) {
      console.error('El usuario ya ha votado en esta votación.');
      return; // Detiene la ejecución si el usuario ya ha votado
    }

    // Si todas las validaciones son exitosas, crea el objeto de voto
    const voto: Votos = {
      id_votacion: this.votacion.id_votacion,
      id_candidato: candidato.id_candidato,
      fecha_voto: new Date().toISOString().split('T')[0], // Solo fecha en formato YYYY-MM-DD
    };

    // Generar el voto
    this._votacionService.generarVoto(voto);
    console.log('Voto registrado exitosamente:', voto);

    await this.registrarVoto(usuario.id_usuario, this.votacion.id_votacion);
  }


  isVotacionActiva(votacion: Votacion): boolean {
    const today = new Date();
    const startDate = new Date(votacion.fecha_inicio);
    const endDate = new Date(votacion.fecha_fin);

    return today >= startDate && today <= endDate;
  }

  async registrarVoto(id_usuario: number, id_votacion: number): Promise<void> {
    const votoRegistrado = {
      id_votacion,
      id_usuario, // Almacena el ID del usuario
      fecha_voto: new Date().toISOString().split('T')[0],
    };

    try {
      this._votacionService.insertarVotoRegistrado(votoRegistrado); // Asegúrate de tener este método en tu servicio
      console.log('Voto registrado correctamente.');
    } catch (error) {
      console.error('Error al registrar el voto:', error);
    }
  }
}
