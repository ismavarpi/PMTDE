Autentificación mediante LDAP
=========================================
- La aplicación debe contar con un mecanismo de autentificación mediante LDAP utilizando conexiones seguras (LDAPS) y cumpliendo el estándar LDAPv3.
- En el fichero de parámetros de entorno `.env` tendremos un parámetro que active el uso de la autentificación mediante LDAP. Seguir los convenios de nombre establecidos para los parámetros necesarios para LDAP y SSO.
- El sistema soportará Single Sign-On (SSO) basado en LDAP. Si existe un proveedor SSO, se reutilizarán los tokens emitidos para compartir la sesión con otras aplicaciones corporativas.
- El proceso de **login** se realizará solicitando usuario y contraseña LDAP en la pantalla de login. Si ya existe un token SSO válido se creará la sesión local sin pedir credenciales.
- Tras un login satisfactorio se generará y almacenará un token de sesión local firmado. En el menú de avatar se mostrará el nombre del usuario logado seguido de la opción de **logout**.
- Gestión de tokens de sesión:
  - Los tokens se generan como cadenas aleatorias de 32 bytes y se almacenan en la tabla `sesiones` junto con la fecha de creación.
  - La vigencia de cada token se controla con el parámetro de entorno `SESSION_TTL` (en segundos, 3600 por defecto). Superado ese tiempo se considera caducado, se elimina de la tabla y la API responde con código 401 `Token caducado`.
  - Todas las peticiones protegidas deben incluir el token en la cabecera `Authorization`.
  - Durante el proceso de login se purgan automáticamente las sesiones caducadas antes de registrar el nuevo token.
- El **logout** invalidará el token de sesión local y, en caso de SSO, revocará el ticket de SSO. Después se redirigirá a la pantalla de login.
- Comportamiento sin token de sesión:
  - Si no hay token activo, solo se mostrará la cabecera con la opción de login dentro del menú de avatar y la pantalla de login.
  - Cualquier intento de acceder a otra pantalla redirigirá a la pantalla de login.
  - Si el token caduca durante la navegación se redirigirá a la pantalla de login y se limpiará la sesión.
- Todas las peticiones a la API deben validar la existencia y vigencia del token de sesión, rechazando con código 401 o equivalente cualquier petición sin token válido.
