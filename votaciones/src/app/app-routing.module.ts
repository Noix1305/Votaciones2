import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { VotacionesComponent } from './components/votaciones/votaciones.component';
import { VerCandidatoComponent } from './components/ver-candidato/ver-candidato.component';
import { VerResultadosComponent } from './components/ver-resultados/ver-resultados.component';
import { VotacionesDisponiblesComponent } from './components/votaciones-disponibles/votaciones-disponibles.component';
import { isUsuarioGuard } from './guards/is-usuario.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'votaciones', component: VotacionesComponent,
    canActivate: [isUsuarioGuard]
  },
  {
    path: 'ver-candidato', component: VerCandidatoComponent,
    canActivate: [isUsuarioGuard]
  },
  {
    path: 'ver-resultados', component: VerResultadosComponent
  },
  {
    path: 'votaciones-disponibles', component: VotacionesDisponiblesComponent,
    canActivate: [isUsuarioGuard]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
