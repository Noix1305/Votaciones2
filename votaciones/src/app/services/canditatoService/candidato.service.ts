import { HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, throwError } from 'rxjs';
import { Candidato } from 'src/app/models/candidato';
import { ApiConfigService } from '../apiConfig/api-config.service';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from '../usuarioService/usuario.service';
import { UsuarioCandidato } from 'src/app/models/ususarioCandidato';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CandidatoService {
  path: string = 'candidatos'
  candidatos: Candidato[] = [];
  candidato: Candidato | null = null;

  constructor(
    private _apiConfig: ApiConfigService,
    private _usuarioService: UsuarioService) { }

  obtenerCandidatos(id_votacion: number): Observable<Candidato[]> {
    const params = new HttpParams().set('select', '*');
    return this._apiConfig.get<Candidato[]>(this.path, params).pipe(
      map(response => {
        // Filtramos los usuarios que están activos
        const candidatos = response.body?.filter(candidato => candidato.id_votacion === id_votacion);
        return candidatos || [];
      }),
      catchError((error) => {
        console.error('Error al obtener candidatos:', error);
        return throwError(() => new Error('Error al obtener candidatos.'));
      })
    );
  }

  obtenerCandidatosConFoto(id_votacion: number): Observable<Candidato[]> {
    return this.obtenerCandidatos(id_votacion).pipe(
      switchMap((candidatos) => {
        this.candidatos = candidatos;

        // Crea un array de observables para obtener los datos del usuario
        const observables = this.candidatos.map(candidato =>
          this._usuarioService.obtenerUsuarioPorId(candidato.id_usuario).pipe(
            map(usuario => {
              if (usuario) { // Verifica si el usuario no es null
                // Asignar los datos del usuario al candidato
                candidato.usuario = {
                  id_usuario: usuario.id_usuario,
                  pnombre: usuario.pnombre,
                  appaterno: usuario.appaterno,
                  apmaterno: usuario.apmaterno,
                  foto_portada: usuario.foto_portada
                } as UsuarioCandidato; // Asegúrate de que sea del tipo correcto
              } else {
                console.warn(`Usuario no encontrado para id_usuario: ${candidato.id_usuario}`);
                // Opcionalmente, puedes asignar un objeto vacío o valores por defecto a `usuario`
                candidato.usuario = {
                  id_usuario: candidato.id_usuario,
                  pnombre: 'Desconocido',
                  appaterno: '',
                  apmaterno: '',
                  foto_portada: 'ruta/a/foto/por/defecto.jpg' // Cambia esta ruta si es necesario
                };
              }
              return candidato; // Devuelve el candidato actualizado
            })
          )
        );

        // Usa forkJoin para esperar a que todas las observaciones se completen
        return forkJoin(observables); // Devuelve un array de candidatos con datos de usuario
      }),
      catchError((error) => {
        console.error('Error al obtener candidatos:', error);
        return throwError(() => new Error('Error al obtener candidatos.'));
      })
    );
  }

  obtenerCandidatoPorId(id_candidato: number): Observable<Candidato | null> {
    const params = new HttpParams().set('id_candidato', `eq.${id_candidato}`);

    return this._apiConfig.get<Candidato[]>(this.path, params).pipe(
      map(response => {
        console.log('Respuesta de la API:', response.body); // Agrega esto
        if (response.body && response.body.length > 0) {
          return response.body[0]; // Devuelve el primer candidato si existe
        }
        console.warn(`No se encontró el candidato con id_candidato: ${id_candidato}`);
        return null; // Retorna null si no hay candidato
      }),
      catchError((error) => {
        console.error('Error al obtener el candidato:', error);
        return throwError(() => new Error('Error al obtener el candidato.'));
      })
    );
  }

  setCandidato(candidato: Candidato): void {
    this.candidato = candidato;
  }

  getCandidato(): Candidato | null {
    return this.candidato;
  }


}