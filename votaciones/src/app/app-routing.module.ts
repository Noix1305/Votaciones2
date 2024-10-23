import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { VotacionesComponent } from './components/votaciones/votaciones.component';
import { VerCandidatoComponent } from './components/ver-candidato/ver-candidato.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'votaciones', component: VotacionesComponent },
  { path: 'ver-candidato', component: VerCandidatoComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
