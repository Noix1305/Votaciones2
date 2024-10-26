import { HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, throwError } from 'rxjs';
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
  pathVotosRegistrados: string = 'votosregistrados';

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

  generarVoto(voto: Votos) {
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

  async generarEInsertarVotos(cantidad: number = 250) {
    const votos: Votos[] = [];

    for (let i = 1; i <= cantidad; i++) {
      const voto: Votos = {
        id_votacion: 2, // ID de votación fijo
        id_candidato: Math.floor(Math.random() * 2) + 3, // ID candidato aleatorio (3 o 4)
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

  calcularTiempoRestante(votacion: Votacion): string {
    const fechaFin = new Date(votacion.fecha_fin);
    const ahora = new Date();
    const diferencia = fechaFin.getTime() - ahora.getTime();

    let tiempoRestante: string; // Define la variable aquí

    if (diferencia > 0) {
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));

      tiempoRestante = `${dias}d ${horas}h ${minutos}m restantes para finalizar la votación`;
    } else {
      tiempoRestante = 'La votación ha terminado';
    }

    return tiempoRestante; // Retorna el string
  }


  calcularTiempoHastaInicio(votacion: Votacion): string {
    const fechaInicio = new Date(votacion.fecha_inicio);
    const ahora = new Date();
    const diferencia = fechaInicio.getTime() - ahora.getTime();
    let tiempoHastaInicio = '';

    if (diferencia > 0) {
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));

      return tiempoHastaInicio = `Faltan ${dias}d ${horas}h para el inicio de la votación`;
    }
    return tiempoHastaInicio;
  }

  async verificarVotoRegistrado(id_usuario: number, id_votacion: number): Promise<boolean> {
    const path = `${this.pathVotosRegistrados}?id_usuario=eq.${id_usuario}&id_votacion=eq.${id_votacion}`; // Asegúrate de que la consulta sea correcta

    try {
      const response = await firstValueFrom(this._apiConfig.get<Votos[]>(path));

      // Verifica si la respuesta y el cuerpo están definidos
      if (response && response.body) {
        return response.body.length > 0; // Si hay votos, retorna true
      } else {
        return false; // Si no hay cuerpo, retorna false
      }
    } catch (error) {
      console.error('Error al verificar si el usuario ha votado:', error);
      return false; // Retorna false en caso de error
    }
  }

  insertarVotoRegistrado(votoRegistrado: any) {
    this._apiConfig.post<Votos>(this.pathVotosRegistrados, votoRegistrado).subscribe({
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
}