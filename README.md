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

1. Asegúrate de tener Docker y Docker Compose instalados.
2. Copia el fichero `.env.example` a `.env` y revisa los parámetros.
3. Construye e inicia los contenedores ejecutando:
   ```bash
   docker-compose up --build
   ```
   Cuando todos los contenedores estén desplegados, en los logs aparecerá un mensaje indicando la URL exacta para acceder al frontend.
