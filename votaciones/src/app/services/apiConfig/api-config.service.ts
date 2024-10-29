import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  public urlBase = environment.supabaseUrl;

  constructor(private httpClient: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
        'apiKey': environment.supabaseKey,
        'Authorization': 'Bearer ' + environment.supabaseKey,
        'Content-Type': 'application/json' // Asegúrate de que este encabezado esté presente
    });
}

private handleError(error: HttpErrorResponse) {
  let errorMessage = 'Error desconocido';
  if (error.error instanceof ErrorEvent) {
      // Errores del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
  } else {
      // Errores del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
  }
  console.error('Error:', errorMessage); // Muestra el error en la consola
  return throwError(() => new Error(errorMessage)); // Lanza el error para que pueda ser manejado en la suscripción
}


  get<T>(path: string, params?: HttpParams): Observable<HttpResponse<T>> {
    const url = this.urlBase + '/rest/v1/' + path
    console.log(url)
    return this.httpClient.get<T>(url, {
      headers: this.getHeaders(),
      observe: 'response',
      params
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  post<T>(path: string, data: any): Observable<HttpResponse<T>> {
    const url = `${this.urlBase}/rest/v1/${path}`;
    console.log('URL de la solicitud:', url);
    console.log('Datos enviados:', JSON.stringify(data)); // Muestra los datos enviados

    return this.httpClient.post<T>(
        url,
        data,
        {
            headers: this.getHeaders(),
            observe: 'response'
        }
    ).pipe(
        catchError((error) => {
            console.error('Error en la solicitud POST:', error); // Captura el error
            return this.handleError(error); // Maneja el error
        })
    );
}

  patch<T>(path: string, data: any, params?: HttpParams): Observable<HttpResponse<T>> {
    return this.httpClient.patch<T>(`${this.urlBase}/rest/v1/${path}`,
      data,
      {
        headers: this.getHeaders(),
        observe: 'response',
        params
      })
      .pipe(
        catchError(this.handleError)
      );
  }

  patchParcial<T>(path: string, userModel: Partial<T>, params?: HttpParams): Observable<HttpResponse<T>> {
    return this.httpClient.patch<T>(`${this.urlBase}/rest/v1/${path}`,
      userModel,
      {
        headers: this.getHeaders(),
        observe: 'response',
        params
      })
      .pipe(
        catchError(this.handleError)
      );
  }

  delete<T>(path: string, params?: HttpParams): Observable<HttpResponse<T>> {
    return this.httpClient.delete<T>(`${this.urlBase}/rest/v1/${path}`,
      {
        headers: this.getHeaders(),
        observe: 'response',
        params
      })
      .pipe(
        catchError(this.handleError)
      );
  }

  editField<T>(path: string, fieldName: string, value: any, params?: HttpParams): Observable<HttpResponse<T>> {
    // Crear el objeto que contiene el campo a actualizar
    const data = { [fieldName]: value };

    return this.httpClient.patch<T>(`${this.urlBase}/rest/v1/${path}`,
      data,
      {
        headers: this.getHeaders(),
        observe: 'response',
        params
      })
      .pipe(
        catchError(this.handleError)
      );
  }

  signUpUser(correo: string, password: string): Observable<HttpResponse<any>> {
    return this.httpClient.post<any>(`${this.urlBase}/auth/v1/signup`, {
      email: correo,
      password: password
    }, {
      headers: this.getHeaders(),
      observe: 'response'  // Importante para obtener el HttpResponse
    }).pipe(
      catchError(this.handleError)  // Manejo de errores
    );
  }
}
