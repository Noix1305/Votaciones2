import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { VerCandidatoComponent } from './components/ver-candidato/ver-candidato.component';
import { VerResultadosComponent } from './components/ver-resultados/ver-resultados.component';
import { VotacionesDisponiblesComponent } from './components/votaciones-disponibles/votaciones-disponibles.component'; // Mantén la importación
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { VotacionesComponent } from './components/votaciones/votaciones.component';
import { NgChartsModule } from 'ng2-charts';
import { GraficoComponent } from './components/grafico/grafico.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    VotacionesComponent,
    VerCandidatoComponent,
    VerResultadosComponent,
    VotacionesDisponiblesComponent,
    GraficoComponent,
    FormsModule,
    NgChartsModule
    // Importa aquí como componente stand-alone
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
