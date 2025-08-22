# PMTDE

Programa Marco de Transformación Digital Efectiva

## Desarrollo local

1. Copia el fichero `.env.example` a `.env` y modifica los valores necesarios.
   El valor por defecto de `DB_HOST` es `mariadb`, que corresponde al nombre del
   contenedor de base de datos. Si ejecutas el servidor fuera de Docker deberás
   cambiarlo a `localhost` o a la dirección que utilice tu base de datos.
   La variable `SESSION_TTL` define en segundos la duración de los tokens de sesión y
   su valor por defecto es `3600`.
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
   El servicio de base de datos utiliza un volumen Docker llamado `db_pmtde` para mantener los datos entre actualizaciones.
4. Una vez todos los contenedores estén levantados, en los logs verás un mensaje similar a:
   ```
   PMTDE frontend disponible en http://localhost:8080
   ```
   que indica la URL exacta donde está disponible el frontend de la aplicación.
5. Para detener los contenedores pulsa `Ctrl+C` y, si deseas eliminar los contenedores creados (pero conservar los datos), ejecuta:
   ```bash
   docker-compose down
   ```

### Actualizar a una nueva versión manteniendo los datos

1. Detén y elimina los contenedores (los volúmenes, incluido `db_pmtde`, se conservarán):
   ```bash
   docker-compose down
   ```
2. Obtén la versión más reciente del código o de las imágenes:
   - Si trabajas con el repositorio de código, actualiza los archivos:
     ```bash
     git pull
     ```
   - Si utilizas imágenes publicadas, descarga la última versión:
     ```bash
     docker-compose pull
     ```
3. Vuelve a construir e iniciar los contenedores con la versión actualizada:
   ```bash
   docker-compose up --build
   ```

### Resetear completamente el despliegue

Si necesitas limpiar el entorno y eliminar también los datos almacenados, ejecuta:

```bash
docker-compose down -v
```
