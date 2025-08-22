---
title: Variables de entorno
---

FICHEROS DE CONFIGURACION .ENV
================================
- Intenta consolidar todas las variables en un único fichero `.env` que sirva tanto para el server como para el despliegue en dockers, de forma que el valor de los parámetros solo se defina una vez.
- Ajusta el código para utilizar este fichero único de configuraciones.
- Las variables de este fichero `.env` tienen que llamarse como siguen cuando hagan falta. Solo utilizaremos en cada aplicación las variables que hagan falta:
- - DB_USER= DB user for the application
- - DB_PASSWORD=Password for DB_USER
- - DB_HOST=Hostname for the database container
- - DB_PORT=Port where DB will be exposed on the host
- - DB_NAME=Database name used by the application
- - DB_ROOT_PASSWORD=Root password for the DB container
- - NODEJS_SERVER_INSIDE_CONTAINER_PORT=Port used by the Node.js server inside the container
- - FRONT_PORT=Port on the host where the frontend/API will be available
- - USE_AUTH=Indicación true o false de si la aplicación debe utilizar autentificación o no
- - SESSION_SECRET=secreto para la autentificación LDAP
- - LDAP_URL=ruta ldap (debe comenzar por `ldaps://`)
- - LDAP_BASE_DN=base dn donde residen los usuarios para el bind (`uid=<usuario>,<LDAP_BASE_DN>`)
- - LDAP_BIND_DN=usuario del sistema que conectará con LDAP (opcional si se usa bind directo)
- - LDAP_BIND_PASSWORD=Password del sistema que conectará con LDAP (opcional si se usa bind directo)

### Integración LDAP
- `LDAP_URL` debe usar LDAPS para garantizar la conexión segura.
- `LDAP_BASE_DN` debe apuntar al contenedor que agrupa los usuarios, por ejemplo `ou=Grupos,ou=Usuarios,dc=sas,dc=junta-andalucia,dc=es`.
- Con bind directo, el DN del usuario se forma como `uid=<usuario>,${LDAP_BASE_DN}` y no es necesario definir `LDAP_BIND_DN` ni `LDAP_BIND_PASSWORD`.
