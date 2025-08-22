---
title: "Directrices UX/UI"
---

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

## Gestión de preferencias de usuario
- El menú de perfil incluirá una opción para configurar las preferencias personales.
- Las preferencias generales del usuario se almacenarán en la tabla `userPreferences` y, por ahora, solo incluyen la densidad de contenido.
- Las columnas visibles y su orden para cada listado se guardarán en la tabla `userListPreferences`.
- La preferencia de densidad admite los valores `Compacto`, `Normal` y `Extendido`.
- La densidad ajustará el **padding**, el **tamaño de fuente** y la **altura mínima** de tablas, listas, barras de herramientas, botones y el menú lateral.
- `Extendido` aplica márgenes y alturas generosos pensados para una lectura cómoda.
- `Compacto` minimiza márgenes, tamaño de fuente y altura de componentes para mostrar la máxima información posible.
- `Normal` se sitúa en un punto medio entre los valores de `Extendido` y `Compacto`.
- Al modificar la densidad de contenido, la aplicación se volverá a renderizar para aplicar el nuevo formato.

## Formato Markdown en descripciones amplias
- Todos los campos de descripción amplia del sistema permitirán formato **markdown**.
- Los componentes de texto largo mostrarán las marcas **markdown** durante la edición, pero en modo solo lectura se renderizará el formato (por ejemplo, en celdas de tablas no editables).
- Cada componente de texto largo tendrá encima un conjunto de botones con iconos que aplicarán al texto seleccionado el formato correspondiente.
- Se ofrecerán botones para todas las opciones de formato admitidas por **markdown** (negrita, títulos, listas, etc.).
- Todos los campos definidos como tipo **TEXT** en el modelo de datos deberán editarse mediante el componente `MarkdownTextField` y cumplir estas directrices de formato **markdown**.
- En los listados, tanto en formato tabla como en cards, los campos de tipo **TEXT** se mostrarán con el Markdown interpretado.

## Título de las pantallas
- Todas las pantallas de gestión derivadas del menú principal mostrarán en la parte superior un título que identifique claramente la entidad que se está gestionando.
- Ejemplos: "Listado de principios guardarrailes", "Editar principio guardarrail" o "Crear principio guardarrail".

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

