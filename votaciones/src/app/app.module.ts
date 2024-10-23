import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { VotacionesComponent } from './components/votaciones/votaciones.component'; // Mantén la importación
import { VerCandidatoComponent } from './components/ver-candidato/ver-candidato.component';
import { VerResultadosComponent } from './components/ver-resultados/ver-resultados.component'; // Mantén la importación

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    VotacionesComponent, // Importa aquí como componente stand-alone
    VerCandidatoComponent,
    VerResultadosComponent
     // Importa aquí como componente stand-alone
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
