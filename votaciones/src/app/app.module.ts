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
    FormsModule,
    // Importa aquí como componente stand-alone
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
