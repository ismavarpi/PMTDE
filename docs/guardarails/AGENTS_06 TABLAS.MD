# FORMATO DE TABLAS

Revisa todas las tablas para asegurarte de que el formato de tablas para todas ellas cumple que:
- Las cabeceras de los listados de elementos en formato tabla no se distinguen suficientemente bien de los registros de dichas tablas. 
- Aplica a las cabeceras de estas tablas un formato diferenciado para que se vea claramente que son la cabecera de las mismas  pero que no sea demasiado llamativo. 
- Todas las tablas de las listas de elementos tienen que tener la opción de ordenar ascendente y descendentemente por cualquiera de los campos por valores.

# PREFERENCIAS DE USUARIO EN LAS TABLAS

- Quiero que todas las visualizaciones de tipo tabla de la aplicación, tengan un icono con un botón de acción de "selección de columnas" que permita que el usuario seleccione las columnas de la tabla que quiere ver y el orden en el que quiere verlas. La columna con los botones de acción siempre será la última y no será configurable su posición. Tendrá una opción guardar que guardará en base de datos estas preferecias.
- Esta visualización elegida por el usuario para cada una de las tablas será persistida en una tabla de personalizaciones, donde guardaremos el usuario al que se vinculan (usuario anonimo en caso de que no haya token de sesión con un usuario identificado), el nombre de la interfaz concreta, y la selección de campos y orden de los mismos que el usuario ha seleccionado.
- La próxima vez que el usuario entre en esta interfaz, se recuperará esta configuración para mostrar la tabla con las columnas y ordenación de las mismas que este había personalizado para si. 
- Igualmente cuando volvamos a pulsar en el botón de "selección de columnas", se cargará la parametrización que estaba persistirda
- Implementa para que la ordenación de las columnas seleccionadas se pueda realizar mediante drag & drop en el popup de selección de columnas
- Traduce los nombres de columnas para que aparezca su label en español tal como aparecen en las cabeceras de las columnas.
- En el selector de columnas, si haces movimientos drag & drop, este cambio de orden se debe refrescar en el popup de selección y ordenacion de columnas para que se visualice los cambios que se están haciendo.
