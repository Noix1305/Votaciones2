import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { VotacionesComponent } from './components/votaciones/votaciones.component'; // Mantén la importación
import { VerCandidatoComponent } from './components/ver-candidato/ver-candidato.component'; // Mantén la importación

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
    // No declares aquí VotacionesComponent ni VerCandidatoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    VotacionesComponent, // Importa aquí como componente stand-alone
    VerCandidatoComponent // Importa aquí como componente stand-alone
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
