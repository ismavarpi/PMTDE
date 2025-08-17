# PMTDE

Programa Marco de Transformación Digital Efectiva

## Desarrollo local

1. Copia el fichero `.env.example` a `.env` y modifica los valores necesarios.
2. Instala las dependencias con:
   ```bash
   npm install
   ```
3. Arranca el servidor:
   ```bash
   npm start
   ```
   La aplicación mostrará en consola la URL donde está disponible. Si no se define `FRONT_PORT`, utilizará por defecto `http://localhost:3000`.

## Despliegue con Docker

1. Instala [Docker](https://docs.docker.com/get-docker/) y [Docker Compose](https://docs.docker.com/compose/).
2. Copia el fichero `.env.example` a `.env` y modifica los valores necesarios para tu entorno. Este mismo fichero es utilizado por la aplicación y por los contenedores para que las variables solo se definan una vez.
3. Desde la raíz del proyecto construye e inicia los contenedores:
   ```bash
   docker-compose up --build
   ```
4. Una vez todos los contenedores estén levantados, en los logs verás un mensaje similar a:
   ```
   PMTDE frontend disponible en http://localhost:8080
   ```
   que indica la URL exacta donde está disponible el frontend de la aplicación.
5. Para detener los contenedores pulsa `Ctrl+C` y, si deseas eliminar los contenedores creados, ejecuta:
   ```bash
   docker-compose down
   ```
