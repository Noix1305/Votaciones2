import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const isUsuarioGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  try {
    // Obtén el valor almacenado en localStorage directamente
    const userInfoString = localStorage.getItem('userInfo');

    if (userInfoString) {
      const infoUser = JSON.parse(userInfoString);

      // Verifica si el rol de usuario es 2 (suponiendo que se almacena como un array o directamente como número)
      const userRole = Array.isArray(infoUser.id_rol) ? infoUser.id_rol : infoUser.id_rol;
      
      if (userRole === 2) { // Suponiendo que el rol de usuario es 2
        return true; // Permitir acceso
      } else {
        console.log('Acceso denegado: el usuario no tiene el rol de usuario'); // Log de depuración
        router.navigate(['/home']); // Redirige al home o la ruta deseada
        return false; // Denegar acceso
      }
    } else {
      console.log('No se encontró información de usuario en localStorage. Redirigiendo a /home');
      router.navigate(['/home']);
      return false; // Denegar acceso si no hay userInfo
    }
  } catch (error) {
    console.error('Error al verificar el rol de usuario:', error);
    router.navigate(['/home']);
    return false; // Denegar acceso en caso de error
  }
};
