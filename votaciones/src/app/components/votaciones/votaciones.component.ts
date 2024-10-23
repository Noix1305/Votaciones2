import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { RouterModule } from '@angular/router'; // Importa RouterModule si usas el enrutamiento

@Component({
  selector: 'app-votaciones',
  standalone: true,
  imports: [CommonModule, RouterModule], // Agrega los módulos aquí
  templateUrl: './votaciones.component.html',
  styleUrls: ['./votaciones.component.scss']
})
export class VotacionesComponent {
  // Lógica del componente
}
