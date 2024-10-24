import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiConfigService } from '../apiConfig/api-config.service';
import { Votacion } from 'src/app/models/votacion';

@Injectable({
  providedIn: 'root'
})
export class VotacionService {
  path: string = 'votaciones';

  constructor(private _apiConfig: ApiConfigService) { }

  obtenerVotaciones(): Observable<Votacion[]> {
    const params = new HttpParams().set('select', '*');
    return this._apiConfig.get<Votacion[]>(this.path, params).pipe(
      map(response => {
        // Filtramos los usuarios que están activos
        const votacionesActivas = response.body?.filter(votacion => votacion.id_estado === 1);
        return votacionesActivas || [];
      }),
      catchError((error) => {
        console.error('Error al obtener usuarios:', error);
        return throwError(() => new Error('Error al obtener usuarios.'));
      })
    );
  }

  obtenerTodasLasVotaciones(): Observable<Votacion[]> {
    const params = new HttpParams().set('select', '*');
    return this._apiConfig.get<Votacion[]>(this.path, params).pipe(
      map(response => {
        // Retorna todas las votaciones tal como están en la respuesta del servidor.
        return response.body || [];
      }),
      catchError((error) => {
        console.error('Error al obtener votaciones:', error);
        return throwError(() => new Error('Error al obtener votaciones.'));
      })
    );
  }
  
}
