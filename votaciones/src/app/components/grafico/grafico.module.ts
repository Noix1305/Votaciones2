import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraficoComponent } from './grafico.component'; // Asegúrate de la ruta correcta

@NgModule({
  declarations: [GraficoComponent],
  imports: [CommonModule],
  exports: [GraficoComponent] // Exporta el componente aquí
})
export class GraficoModule { }
