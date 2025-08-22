---
title: "Formato de tablas"
---

# FORMATO DE TABLAS

Revisa todas las tablas para asegurarte de que el formato de tablas para todas ellas cumple que:
- Las cabeceras de los listados de elementos en formato tabla no se distinguen suficientemente bien de los registros de dichas tablas. 
- Aplica a las cabeceras de estas tablas un formato diferenciado para que se vea claramente que son la cabecera de las mismas  pero que no sea demasiado llamativo. 
- Todas las tablas de las listas de elementos tienen que tener la opción de ordenar ascendente y descendentemente por cualquiera de los campos por valores.

# PREFERENCIAS DE USUARIO EN LAS TABLAS Y CARDS

- Quiero que todas las visualizaciones de tipo tabla y cards de la aplicación tengan un icono con un botón de acción de "selección de columnas" que permita que el usuario seleccione las columnas o campos que quiere ver y el orden en el que quiere verlos. La columna con los botones de acción siempre será la última y no será configurable su posición en la vista de tabla. Tendrá una opción guardar que guardará en base de datos estas preferencias.
- Deberá existir en el sistema una entidad "preferencias de usuario" que persista, asociado al usuario logado en la aplicación, sus preferencias en cada una de las vistas del sistema (tabla o cards): columnas visibles y orden en el que se muestran. Si no existe token de sesión de un usuario logado, se guardarán las preferencias asociados al usuario "anonimo".
- La tabla de preferencias incluirá un campo `viewType` para diferenciar si la configuración corresponde a la vista `table` o `cards`.
- Esta visualización elegida por el usuario para cada una de las vistas será persistida en una tabla de personalizaciones donde guardaremos el usuario al que se vinculan (usuario anonimo en caso de que no haya token de sesión con un usuario identificado), el nombre de la interfaz concreta, el tipo de vista (`table` o `cards`) y la selección de campos y orden de los mismos que el usuario ha seleccionado. Identificaremos al usuario en esta tabla de preferencias de usuario mediante su id de usuario cuando se logue.
- La próxima vez que el usuario entre en esta interfaz, se recuperará esta configuración para mostrar la vista seleccionada (tabla o cards) con las columnas y ordenación de las mismas que este había personalizado para si.
- Igualmente cuando volvamos a pulsar en el botón de "selección de columnas", se cargará la parametrización que estaba persistida para la vista actual.
- Implementa para que la ordenación de las columnas o campos seleccionados se pueda realizar mediante drag & drop en el popup de selección de columnas
- Traduce los nombres de columnas para que aparezca su label en español tal como aparecen en las cabeceras de las columnas.
- En el selector de columnas, si haces movimientos drag & drop, este cambio de orden se debe refrescar en el popup de selección y ordenacion de columnas para que se visualice los cambios que se están haciendo.
