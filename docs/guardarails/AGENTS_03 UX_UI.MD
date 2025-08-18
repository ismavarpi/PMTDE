# UI

Todas las pantallas y funcionalidades de la aplicación deben cumplir las siguientes indicaciones:
- Asegurate de que todos los campos obligatorios aparecen marcados visualmente como tal con un asterisco o similar. 
- Desarrollaremos una interfaz de usuario basada en el estilo "material"
- Todos los botones de acción que esten encima de listados de elementos (en formato tabla o cards) se visualizarán con un icono de estilo "material" correspondiente a la acción que permitan una mejor pulsación táctil en pantallas android . Cuando pongamos el ratón encima del botón con el icono, nos mostrará siempre en un tooltip la desripción de la acción que estamos realizando.
- Las acciones de cancelar, guardar o aceptar en los formularios de edición aparecerán con el nombre de la acción en el botón.
- Todos los formularios, listados, pantallas en general, estarán diseñados de una forma visualmente confortable respetando espaciados correspondientes y en general medidas que faciliten una visualización cómoda.
- Si existe un menú superior de administración, este se mostrará siempre no con el nombre del menú sino con un icono de una rueda dentada (gear).
- Si existe un menú superior de perfil de usuario, este se mostrará siempre no con el nombre del menú sino con un icono de avatar.
- Todas las interfaces deberán ser responsive, de forma que se adapten correctamente a la visualización en cualquier tipo de terminal: pc, tablet, móvil, etc.
- Todos los botones de acciones sobre listados de elementos (tablas, cards, ec), se mostrarán con un icono y no con texto en el botón.

# UX

## Eliminaciones de registros
Todas las pantallas y funcionalidades de la aplicación deben cumplir las siguientes indicaciones:
- asegurate de que todas las eliminaciones solicitan confirmación de la eliminación antes de llevarse a cabo, e informar de que la acción es irreversible
- Si se van a eliminar registros en cascada, se debe informar al usuario de las nombres de las entidades de las que se van a eliminar registros.

## Creación y modificación de registros
- asegurate de que todas las ediciones e inserciones de elementos una vez hechas, refrescan la lista de resultados par que se vean correctamente los nuevos datos. 

## Opciones de menú en los listados de elementos
- Los listados de elementos tienen todos en su cabecera un pool de botones de acción que es común. Deben aparecer en el mismo orden en todas las listas de elementos, siendo el orden el siguiente:
  - Crear nuevo
  - Filtrar
  - Seleccionar columnas
  - Alternar entre vista tabla o vista cards
  - Exportación a csv
  - Exportación a pdf
