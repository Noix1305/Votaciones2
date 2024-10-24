import { Component } from '@angular/core';
import { Usuario } from './models/usuario';
import { firstValueFrom } from 'rxjs';
import { LoginService } from './services/loginService/login.service';
import { UsuarioService } from './services/usuarioService/usuario.service';
import { Router } from '@angular/router';
import 'bootstrap';
declare var bootstrap: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  usuario: Usuario | null = null;
  correo: string = '';
  password: string = '';
  errorMessage: string = '';
  nombreUsuario: string = '';

  ngOnInit() {
    this.cargarUsuario();
    this.cargarNombreUsuario();
  }

  constructor(
    private _loginService: LoginService,
    private _usuarioService: UsuarioService,
    private router: Router,
  ) { }

  private async cargarNombreUsuario() {
    // Esperamos un breve tiempo para simular un proceso asíncrono si es necesario.
    await this.delay(100); // Opcional, elimina si no necesitas una espera

    // Verificamos si hay un usuario en localStorage
    const usuarioAlmacenado = localStorage.getItem('usuario'); // Asegúrate de que 'usuario' sea la clave correcta

    if (usuarioAlmacenado) {
      this.usuario = JSON.parse(usuarioAlmacenado);
      if (this.usuario) { // Convertimos el JSON en objeto
        this.nombreUsuario = this.usuario.pnombre || '';
      }// Cargamos el nombre del usuario
    } else {
      this.nombreUsuario = ''; // Si no hay usuario, aseguramos que el nombre esté vacío
    }
  }

  // Método opcional para simular un retraso
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  private cargarUsuario() {
    const usuarioInfo = localStorage.getItem('userInfo');
    if (usuarioInfo) {
      this.usuario = JSON.parse(usuarioInfo);
    } else {
      this.usuario = null; // No hay usuario, inicializa como null
    }
  }

  toggleLogin() {
    if (this.usuario) {
      // Cerrar sesión
      this.usuario = null;
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['home']); // Redirige a la página de login o donde desees
    } else {
      // Aquí puedes abrir el modal de inicio de sesión
      const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
      loginModal.show();
    }
  }

  async handleLoginSubmit() {
    console.log('Login Submit');
    this.errorMessage = ''; // Reinicia los mensajes de error

    // Usa el RUT como nombre de usuario
    const correo = this.correo;
    const password = this.password; // Encripta la contraseña del formulario

    // Validación de campos
    if (!correo || !password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      console.log(this.errorMessage);
      return false;
    }

    try {
      console.log('Entrando Try');
      // Obtiene los usuarios activos directamente como un observable
      const usuariosActivos: Usuario[] = await firstValueFrom(this._usuarioService.obtenerUsuarios());

      // Usar el tipo de usuario aquí
      const usuarioExistente = usuariosActivos.find((usuario: Usuario) => usuario.email === correo);

      // Ahora intenta iniciar sesión
      if (usuarioExistente) {
        this.usuario = await this._loginService.login(usuarioExistente.email, password) || null;
      } else {
        this.errorMessage = 'El usuario no existe.';
        this.usuario = null; // O maneja el caso cuando usuarioExistente no existe
      }

      if (this.usuario) {
        // Guarda la información del usuario en localStorage
        localStorage.setItem('userInfo', JSON.stringify(this.usuario)); // Convierte el objeto de usuario a string

        // Cierra el modal
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        if (loginModal) {
          loginModal.hide();
        }

        // Redirige al usuario a la página de inicio
        this.router.navigate(['home']);
      } else {
        // Si la contraseña es incorrecta
        this.errorMessage = 'Credenciales incorrectas'; // Maneja credenciales incorrectas
      }

    } catch (error) {
      // Maneja cualquier error durante el proceso de inicio de sesión
      this.errorMessage = 'Ocurrió un error durante el login. Inténtalo de nuevo.';
      console.error('Error en el login:', error); // Registra el error
    }

    return false; // Valor por defecto al final de la función
  }

  async guardarUsuario(user: Usuario) {
    localStorage.setItem('userInfo', JSON.stringify(user)); // Convierte el objeto de usuario a string y lo almacena
  }

  // async onSubmitForgotPassword(event: Event): Promise<void> {
  //   event.preventDefault();
  //   const form = event.target as HTMLFormElement;
  //   const formData = new FormData(form);
  //   const rut = formData.get('rut') as string;

  //   if (!rut) {
  //     console.error('RUT es requerido');
  //     return;
  //   }

  //   try {
  //     await this._usuarioService.enviarContraseñaPorRut(rut);
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       console.error('Error durante la recuperación de contraseña:', error.message);
  //       alert(error.message || 'Ocurrió un error inesperado.');
  //     } else {
  //       console.error('Error desconocido:', error);
  //       alert('Ocurrió un error inesperado.');
  //     }
  //   }
  // }
}
