import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { VotacionesComponent } from './components/votaciones/votaciones.component'; // Mantén la importación
import { VerCandidatoComponent } from './components/ver-candidato/ver-candidato.component';
import { VerResultadosComponent } from './components/ver-resultados/ver-resultados.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    VotacionesComponent, // Importa aquí como componente stand-alone
    VerCandidatoComponent,
    VerResultadosComponent,
    HomeComponent,
    FormsModule,
    HttpClientModule,
     // Importa aquí como componente stand-alone
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
