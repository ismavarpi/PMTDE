Autentificación mediante LDAP
=========================================
- La aplicacion debe contar con un mecanismo por autentificación mediante LDAP.
- En el fichero de parametros de entorno env, tendremos un parámetro que active el uso de la autentificacion mediante LDAP. Seguir los convenios de nombre establecidos para los parametros necesarios para LDAP.
- Cuando esté activa la autentificación mediante LDAP verificaremos si tenemos un token de sesión activo. Si no hay sesión ldap activa, solo se podrá visualizar la cabecera, en la que solo veremos la opción de menú de avatar con la opcion login y la propia pantalla de login a la que se accede desde este submenú.
- Cuando intentemos cargar cualquier pantalla y no haya token de sesión, mostraremos la pantalla de login.
- Una vez tengamos un token de sesión activa podremos ver cualquier pantalla. En el menú de avatar, mostraremos primero el nombre del usuario logado, y despues una opción de logout que cerraría la sesión.
