FORMULARIOS DE EDICION
==============================
Todas las pantallas y funcionalidades de la aplicación deben cumplir las siguientes indicaciones:
- Todos los formularios de edición o creacion de registros que deban mostrarse se mostrarán en una pantalla diferenciada del listado de elementos sobre el que se está haciendo la operación CRUD.

Se trabajarán con dos tipos de formularios de edición/creación. 
- Formularios popup. A este tipo lo denominaremos "Formulario popup"
- Formulario que ocupará toda la zona de trabajo sin ser un popup. A este tipo lo denominaremos "Formulario zona de trabajo"
Por defecto los formularios serán formularios popup, pero se pondrá indicar los que específicamente serán "formularios de zona de trabajo", que se deberán mantener en este formato hasta que se indique que pasa a ser un "formulario popup" específicamente.

Características de los formularios popup:
- Ocuparán como mínimo el 25% del ancho de la pantalla, donde añadiremos los datos del registro o actualizaremos los mismos según corresponda a la operación. 
- Incluirá las opciones de guardar y cancelar, que harán que vuelva a la lista de elementos sobre la que hemos hecho la operación CRUD. 
- os aseguraremos de que el popup es suficientemente ancho como para que la información se visualice bien, ampliando la anchura del mismo cuanto sea necesario.
- Por defecto se incluirá un único campo por línea salvo que se haya indicado lo contrario en una pantalla concreta.

Características de un formulario que ocupe toda la zona de trabajo
- Si el formulario es grande, utilizaremos un formulario que ocupará toda la zona de trabajo sin ser un popup. Incluirá las opciones de guardar y cancelar, que harán que vuelva a la lista de elementos sobre la que hemos hecho la operación CRUD.

La estructura de los formularios la definiremos mediante instrucciones como sigue:
- definiremos una lista de campos y al lado de cada uno definiremos los siguientes valores: nombre del campo, nº de línea, un nº de ancho que irá del 1 al 8. Si dieramos un valor mayor de 8, lo saltaríamos a la siguiente línea.
- - Un valor 8 corresponderá al 100% del ancho de la pantalla.
- - Un valor 4 corresponderá al 50% del ancho de la pantalla.
- - Un valor 2 corresponderá al 25% del ancho de la pantalla.
- - Un valor 1 corresponderá al 12,5% del ancho de la pantalla.
- - Y así con el resto de valores

Así a modo de ejemplo podremos definir la estructura de un formulario como sigue:

Ejemplo: creamos un formulario con 3 campos y la siguiente estructura visual.
- Campo 1, línea 1, ancho 8
- Campo 2, linea 2, ancho 4
- Campo 3, línea 2, ancho 4

