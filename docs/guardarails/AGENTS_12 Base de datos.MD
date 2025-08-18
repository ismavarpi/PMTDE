# Despliegue de la instancia de base de datos

- Cuando se despliegue la aplicación en contenedores o servidores, debemos asegurarnos de que en la base de datos se encuentra creada todas las estructuras, tablas, relaciones, etc necesarias para el funcionamiento del sistema.
- Si no están creadas, deberemos crearlas al desplegarlo.

# Estructura de la base de datos

- Igualmente, si están creadas, deberemos verificar que están actualizadas conforme a la última versión de la aplicación.
- Cuando actualicemos estructuras de base de datos nos aseguraremos de intentar no borrar registros. Asegurate de que cuando sea necesario hacer cambios en una entidad, no se borren o eliminen los registros que pudieran existir de dicha entidad. Si hay campos obligatorios que no tienen valor, generaremos instrucciones update para asignarles un valor por defecto que será:
  - 1 si es un campo numérico.
  - "n/a" si es un campo string
  - "1/1/1970" si es un campo date
  - false si es un campo boolean
- Estos valores por defecto solo se utilizarán para hacer updates de registros existentes ante cambios de estructura de base de datos al incorporar un campo obligatorio en tablas con registros ya existentes.
- No se utilizarán estos valores por defecto como valor por defecto de las tablas o entidades del sistema en ningún caso.
- Establece cualquier otra directriz necesaria para poder aplicar los cambios necesarios en la base de datos sin eliminar registros, manteniendo todas las reglas de negocio establecidas, como pueden ser entre otros los campos obligatorios.

# Operaciones CRUD sobre registros

- Todas las operaciones de actualización de registors (update) deben actualizar los registros existentes, no crear nuevos registros.
- Todas las operaciones de eliminación de registros deben solicitar confirmación al usuario.
- Todas las operaciones de eliminación de registros que tengan referencias con terceras entidades, debe hacer que se eliminen en cascada dichas entidades. Para ello, deberá informarse al usuario de las entidades que se van a eliminar en cascada, y que la acción es irreversible.

# Referencias entre tablas
- Asegurate de que las relaciones entre las tablas están reflejadas convenientemente en base de datos mediante foreign keys, y que tiene marcada o no la propiedad de eliminación en cascada en función de los requisitos funcionales indicados en docs/funcional.

# Valor por defecto
- Por norma general no se establecerá nunca un valor por defecto para un campo de una tabla, salvo que el usuario lo específique concretamente.
- Si es un campo obligatorio y no se especifica un valor se ha de indicadr con un mensaje al usuario que es obligatorio, no permitiendo su persistencia hasta que defina este valor.
- Si es un campo no obligatorio, se dejará a null si no se rellena.

