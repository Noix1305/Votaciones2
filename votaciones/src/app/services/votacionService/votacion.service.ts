import { HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiConfigService } from '../apiConfig/api-config.service';
import { Votacion } from 'src/app/models/votacion';
import { Votos } from 'src/app/models/voto';

@Injectable({
  providedIn: 'root'
})
export class VotacionService {
  path: string = 'votaciones';
  pathVoto: string = 'votos'

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

  generarVoto(voto:Votos) {
    this._apiConfig.post<Votos>('votos', voto).subscribe({
      next: response => {
        console.log('Código de estado:', response.status); // Código de estado HTTP
        console.log('Cuerpo de la respuesta:', response.body); // Cuerpo de la respuesta
        if (response.status === 201) {
          console.log('Voto insertado correctamente:', response.body);
        } else {
          console.error('Error en la inserción:', response.body);
        }
      },
      error: err => {
        console.error('Error al insertar voto:', err);
      }
    });


  }

    async generarYInsertarVotos(cantidad: number = 150) {
      const votos: Votos[] = [];

      for (let i = 51; i <= cantidad; i++) {
          const voto: Votos = {
              folio: i, // Asegúrate de que esto sea único y válido
              id_votacion: 1, // ID de votación fijo
              id_candidato: Math.floor(Math.random() * 2) + 1, // ID candidato aleatorio (1 o 2)
              fecha_voto: new Date().toISOString().split('T')[0], // Solo fecha en formato YYYY-MM-DD
          };

          votos.push(voto);
      }

      // Inserta los votos generados
      for (const voto of votos) {
          try {
              this.generarVoto(voto);
              console.log(`Voto insertado: ${JSON.stringify(voto)}`);
          } catch (error) {
              console.error('Error al insertar voto:', error);
          }
      }

      console.log(`${cantidad} votos generados e insertados.`);
  }

  obtenerVotos(): Observable<Votos[]> {
    return this._apiConfig.get<Votos[]>(this.pathVoto).pipe(
      map((response: HttpResponse<Votos[]>) => response.body ?? []), // Devuelve un arreglo vacío si body es null
      catchError(this.handleError) // Manejo de errores
    );
  }

  obtenerVotosPorVotacion(id_votacion: number): Observable<Votos[]> {
    const url = `${this.pathVoto}?id_votacion=eq.${id_votacion}`; // Asegúrate de que 'eq' está presente en la consulta
    console.log('URL de la solicitud:', url); // Para depuración
  
    return this._apiConfig.get<Votos[]>(url).pipe(
      map((response: HttpResponse<Votos[]>) => response.body ?? []),
      catchError(this.handleError)
    );
  }
  

  private handleError(error: any) {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('test'));
  }


  formatFecha(fecha: Date): string {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Sumar 1 ya que los meses inician en 0
    const dia = String(fecha.getDate()).padStart(2, '0'); // Asegura que el día tenga dos dígitos
    return `${anio}/${mes}/${dia}`;
  }
}





