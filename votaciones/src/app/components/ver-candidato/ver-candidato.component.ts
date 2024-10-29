import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Candidato } from 'src/app/models/candidato';
import { CandidatoService } from 'src/app/services/canditatoService/candidato.service';

@Component({
  selector: 'app-ver-candidato',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ver-candidato.component.html',
  styleUrls: ['./ver-candidato.component.scss']
})
export class VerCandidatoComponent {
  candidato: Candidato | null = null; // Asegúrate de inicializar correctamente el candidato

  constructor(
    private router: Router,
    private _candidatoService: CandidatoService,
    private route: ActivatedRoute
  ) { }
  async ngOnInit() {
    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras?.state?.['candidato']) { // Usar notación con corchetes
      this.candidato = await navigation.extras.state['candidato']; // Correcto: con corchetes
    } else {
      console.log('No hay navigation')
      const candidatoData = sessionStorage.getItem('candidato');
      if (candidatoData) {
        this.candidato = JSON.parse(candidatoData);
      } else {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          await this.cargarCandidato(Number(id));
        }
      }
    }

    console.log('Candidato final:', this.candidato);

    // Si no hay candidato en el estado de navegación (caso de recarga o acceso directo)
    if (!this.candidato) {
      // Intentar obtener el ID desde la URL
      const id = this.route.snapshot.paramMap.get('id_usuario'); // Obtener el ID desde la ruta
      if (id) {
        console.log('ID Candidato desde URL:', id);
        // Cargar el candidato desde la base de datos con el ID
        await this.cargarCandidato(Number(id));
      }
    }

    console.log('Candidato final:', this.candidato); // Verificar el candidato final
  }
  async cargarCandidato(id: number) {
    this._candidatoService.obtenerCandidatoPorId(id).subscribe({
      next: (candidato) => {
        this.candidato = candidato; // Asigna el candidato recibido a la variable
        console.log('Candidato cargado:', this.candidato); // Imprime el candidato cargado
      },
      error: (error) => {
        console.error('Error al cargar el candidato:', error);
      }
    });
  }

}
