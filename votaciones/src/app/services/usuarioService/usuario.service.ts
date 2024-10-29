import { Injectable } from '@angular/core';
import { ApiConfigService } from '../apiConfig/api-config.service';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Usuario } from 'src/app/models/usuario';



@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  path = 'usuarios';

  constructor(private _apiConfig: ApiConfigService) {
    this.cargarUsuario();
  }

  getUrlFotoUsuario(id_usuario: number): Observable<string> {
    const params = new HttpParams().set('id_usuario', `eq.${id_usuario}`);

    return this._apiConfig.get<{ foto_portada: string }[]>(this.path, params).pipe( // Cambiar el tipo a un array
      map(response => {
        console.log('Respuesta completa:', response); // Imprime la respuesta completa

        // Comprueba si el cuerpo de la respuesta existe y tiene al menos un elemento
        if (response.body && response.body.length > 0 && response.body[0].foto_portada) {
          console.log('Foto portada: ' + response.body[0].foto_portada);
          return response.body[0].foto_portada; // Retorna la URL de la foto
        } else {
          console.warn(`No se encontró la foto de portada para el usuario: ${id_usuario}`);
          return 'ruta/a/foto/por/defecto.jpg'; // Usa una foto por defecto
        }
      }),
      catchError((error) => {
        console.error('Error al obtener la foto del usuario:', error);
        return throwError(() => new Error('Error al obtener la foto del usuario.'));
      })
    );
  }


  getUsuarioPorCorreo(correo: string): Observable<HttpResponse<Usuario>> {
    const params = new HttpParams().set('email', `eq.${correo}`);
    return this._apiConfig.get<Usuario>(this.path, params).pipe(
      catchError((error) => {
        console.error('Error al obtener usuario por Correo:', error);
        return throwError(() => new Error('Error al obtener usuario por Correo.'));
      })
    );
  }

  obtenerUsuarioPorId(id_usuario: number): Observable<Usuario | null> {
    const params = new HttpParams().set('id_usuario', `eq.${id_usuario}`);

    return this._apiConfig.get<Usuario[]>(this.path, params).pipe(
        map(response => {
            // Verifica si el cuerpo de la respuesta existe y no es nulo
            if (response.body && response.body.length > 0) {
                return response.body[0]; // Devuelve el primer usuario si existe
            }
            console.warn(`No se encontró el usuario con id_usuario: ${id_usuario}`);
            return null; // Retorna null si no hay usuario
        }),
        catchError((error) => {
            console.error('Error al obtener el usuario:', error);
            return throwError(() => new Error('Error al obtener el usuario.'));
        })
    );
}




  obtenerUsuarios(): Observable<Usuario[]> {
    const params = new HttpParams().set('select', '*');
    return this._apiConfig.get<Usuario[]>(this.path, params).pipe(
      map(response => {
        // Filtramos los usuarios que están activos
        const usuariosActivos = response.body?.filter(usuario => usuario.id_estado === 1);
        return usuariosActivos || [];
      }),
      catchError((error) => {
        console.error('Error al obtener usuarios:', error);
        return throwError(() => new Error('Error al obtener usuarios.'));
      })
    );
  }

  async cargarUsuario() {
    // Obtener el valor almacenado en localStorage
    const value = localStorage.getItem('userInfo');

    if (value) {
      const usuario = JSON.parse(value) as Usuario;
    }
  }

  decryptText(inputText: string) {
    // Desencripta el texto de entrada reemplazando las secuencias de caracteres especiales con sus vocales originales.
    // Si el texto no está vacío, cada secuencia de caracteres encriptada es reemplazada por su vocal correspondiente.
    // Retorna el texto desencriptado.

    let decryptedText = "";
    if (inputText != "") {
      // Reemplazar cada código encriptado con su letra correspondiente
      decryptedText = inputText.replace(/e#n=t0e!r%/g, 'e')
        .replace(/i#m0e%s/g, 'i')
        .replace(/!a%i&/g, 'a')
        .replace(/o#b%e&r/g, 'o')
        .replace(/u#f0a&t/g, 'u');
    }
    return decryptedText;
  }

  // async enviarContraseñaPorRut(rut?: string, email?: string): Promise<void> {
  //   if (rut) {
  //     const usuarioResponse = await firstValueFrom(this.getUsuarioPorRut(rut));

  //     if (usuarioResponse.body && Array.isArray(usuarioResponse.body) && usuarioResponse.body.length > 0) {
  //       const usuario: Usuario = usuarioResponse.body[0];
  //       const email = usuario.email;

  //       const passDesencriptada = this.decryptText(usuario.password);

  //       if (email) {
  //         // Enviar la contraseña al correo
  //         await this.enviarCorreoConContraseña(email, passDesencriptada);
  //       } else {
  //         throw new Error('El correo electrónico no está disponible para el usuario.');
  //       }
  //     } else {
  //       throw new Error('Usuario no encontrado.');
  //     }
  //   } else if (email) {

  //   } else {
  //     console.error('No se encontraron los parametros para el envío del correo:')
  //   }
  // }

  // // Método para crear un nuevo usuario
  // crearUsuario(usuario: Usuario): Observable<HttpResponse<Usuario>> {
  //   return this._apiConfig.post(this.path, usuario);
  // }

  // editarUsuario(rut: string, usuario: Usuario): Observable<HttpResponse<Usuario>> {
  //   const path = `${this.path}?rut=eq.${rut}`;
  //   return this._apiConfig.patch<Usuario>(path, usuario).pipe(
  //     map(response => {
  //       return new HttpResponse<Usuario>({
  //         body: response.body || null, // Puedes modificar esto si es necesario
  //         status: response.status,
  //         statusText: response.statusText,
  //         headers: response.headers
  //       });
  //     })
  //   );
  // }

  // editarCampoUsuario(rut: string, usuario: Partial<Usuario>): Observable<HttpResponse<Usuario>> {
  //   const path = `${this.path}?rut=eq.${rut}`; // Construye la ruta con el RUT
  //   return this._apiConfig.patchParcial<Usuario>(path, usuario).pipe(
  //     map(response => {
  //       return new HttpResponse<Usuario>({
  //         body: response.body || null,
  //         status: response.status,
  //         statusText: response.statusText,
  //         headers: response.headers
  //       });
  //     })
  //   );
  // }

  // cambiarContrasena(rut: string, nuevaContrasena: string): Observable<HttpResponse<Usuario>> {
  //   const path = `${this.path}?rut=eq.${rut}`;
  //   const body = { password: nuevaContrasena }; // Asumiendo que el campo de la contraseña es 'password'

  //   return this._apiConfig.patch<Usuario>(path, body).pipe(
  //     map(response => {
  //       return new HttpResponse<Usuario>({
  //         body: response.body || null,
  //         status: response.status,
  //         statusText: response.statusText,
  //         headers: response.headers
  //       });
  //     })
  //   );
  // }

  // actualizarRol(rut: string, data: ActualizarRol): Observable<HttpResponse<any>> {
  //   const path = `${this.path}?rut=eq.${rut}`;
  //   return this._apiConfig.patch<any>(path, data);
  // }

  // actualizarUsuario(usuario: Usuario) {
  //   this.usuarioSubject.next(usuario); // Actualiza el estado del usuario
  // }

  // limpiarUsuario() {
  //   this.usuarioSubject.next(null); // Limpia el usuario en caso de logout
  // }

  // getUsuario(): Usuario | null {
  //   return this.usuarioSubject.getValue(); // Obtiene el valor actual del BehaviorSubject
  // }
}
