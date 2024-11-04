
# Votaciones

Este es un proyecto de Angular llamado "votaciones". A continuación se presentan las instrucciones para instalar las dependencias necesarias para el proyecto.

Requerimientos: NodeJs: 

## Instalación

Para instalar Node.js en tu sistema, puedes usar el siguiente comando en función de tu sistema operativo:

## En sistemas Linux (usando apt en Ubuntu/Debian):

Primero, actualiza el índice de paquetes:

```bash
sudo apt update
```
Luego, instala Node.js (puedes especificar la versión si prefieres una en particular):


```bash
sudo apt install nodejs
sudo apt install npm  # Para instalar npm, el gestor de paquetes de Node.js
```
## En macOS (usando brew):

Si no tienes Homebrew, instala Homebrew:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Luego, instala Node.js:

```bash
brew install node
```

## En Windows

Descarga el instalador desde nodejs.org y sigue las instrucciones para instalarlo.

--Verificar instalación

Después de instalar Node.js, verifica que la instalación fue exitosa comprobando la versión:

```bash
node -v
npm -v
```

Ejecuta el siguiente comando en la raíz del proyecto:

```bash
npm install
```

En caso de que no instale alguna dependencia a continuación dejo los comandos de cada una de las dependencias del proyecto:

### Dependencias de Angular y Angular CLI

Para instalar todas las dependencias de Angular y Angular CLI, ejecuta el siguiente comando en la raíz del proyecto:

```bash
npm install @angular/animations @angular/common @angular/compiler @angular/core @angular/forms @angular/platform-browser @angular/platform-browser-dynamic @angular/router @angular/cli @angular/compiler-cli
```

### Dependencias Adicionales

Para instalar las dependencias adicionales necesarias para el proyecto, utiliza este comando:

```bash
npm install @fortawesome/fontawesome-free @supabase/supabase-js bootstrap chart.js chartjs-plugin-datalabels cors dotenv jquery ng2-charts node-cron pg rxjs sweetalert2 tslib zone.js
```

### Tipos de TypeScript

Para instalar los tipos de TypeScript requeridos, ejecuta:

```bash
npm install --save-dev @types/jasmine @types/node @types/node-cron @types/pg @types/chart.js @types/bonjour @types/estree @types/http-errors
```

### Herramientas de Desarrollo

Finalmente, para instalar las herramientas de desarrollo, utiliza el siguiente comando:

```bash
npm install --save-dev @angular-devkit/build-angular jasmine-core karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter typescript
```

## Uso

Después de instalar las dependencias, puedes iniciar el servidor de desarrollo con el siguiente comando:

```bash
npm start
```
o tambien

```bash
ng serve
```

Esto iniciará la aplicación y podrás acceder a ella en `http://localhost:4200` para ambiente local.

Para conectarse a la aplicación a través del servidor introducir la dirección http://165.1.125.50/votaciones/ en la barra de navegación de su navegador(valga la redundancia).

## Contribución

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un "issue" o un "pull request".

