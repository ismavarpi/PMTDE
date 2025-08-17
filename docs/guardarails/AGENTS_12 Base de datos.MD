# Despliegue de la instancia de base de datos

- Cuando se despliegue la aplicación en contenedores o servidores, debemos asegurarnos de que en la base de datos se encuentra creada todas las estructuras, tablas, relaciones, etc necesarias para el funcionamiento del sistema.
- Si no están creadas, deberemos crearlas al desplegarlo.

# Estructura de la base de datos

- Igualmente, si están creadas, deberemos verificar que están actualizadas conforme a la última versión de la aplicación.
- Cuando actualicemos estructuras de base de datos nos aseguraremos de intentar no borrar registros. Asegurate de que cuando sea necesario hacer cambios en una entidad, no se borren o eliminen los registros que pudieran existir de dicha entidad. Si hay campos obligatorios que no tienen valor, les incluiremos un valor por defecto que será:
  - 1 si es un campo numérico.
  - "n/a" si es un campo string
  - "1/1/1970" si es un campo date
  - false si es un campo boolean
- Establece cualquier otra directriz necesaria para poder aplicar los cambios necesarios en la base de datos sin eliminar registros, manteniendo todas las reglas de negocio establecidas, como pueden ser entre otros los campos obligatorios.

# Operaciones CRUD sobre registros

- Todas las operaciones de actualización de registors (update) deben actualizar los registros existentes, no crear nuevos registros.
- Todas las operaciones de eliminación de registros deben solicitar confirmación al usuario.
- Todas las operaciones de eliminación de registros que tengan referencias con terceras entidades, debe hacer que se eliminen en cascada dichas entidades. Para ello, deberá informarse al usuario de las entidades que se van a eliminar en cascada, y que la acción es irreversible.

# Referencias entre tablas
- Asegurate de que las relaciones entre las tablas están reflejadas convenientemente en base de datos mediante foreign keys, y que no tienen marcada la propiedad de eliminación en cascada.
- Cuando se elimine un registro, que está referenciado en otra tabla, no se podrá eliminar. Se informará al usuario de que no se puede eliminar el registro hasta que no se eliminen primero los registros de la entidad en la que se encuentra referenciado, informando de los nombres de las entidaes en las que ocurre.
