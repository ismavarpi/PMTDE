FILTROS
====================================
Revisa todas las pantallas de la aplicación para asegurarte de que se aplica la siguiente funcionalidad de Filtros en todas las listas de elementos:
- Vamos a incorporar en todos los listados de todas las entidades, en la visualización de la lista de registros en formato tabla o cards, un botón de filtrado, que mostrará y ocultará una sección de filtrado. 
En esta sección de filtrado deberemos incorporar:
- por cada campo de tipo fecha, un par de campos de filtrado de fechas "desde" "hasta". Así, a modo de ejemplo, si hay una fecha que se llame "fecha de creación", se deberá incluir dos campos que sería "fecha creación desde" y "fecha creación hasta" en este orden.
- Igualmente se deberá incluir un campo de filtrado de texto, que busque el texto escrito en todas las columnas mostradas en la tabla. Esta búsqueda no tendrá en cuenta mayúsculas y minúsculas, ni acentos.
- También deberá incluirse por cada campo que se refiera a datos en una tabla maestra, y que por tanto se gestionan en las ediciones como combos seleccionables, deberá incorporarse un campo de filtrado de tipo combo de selección que permita seleccionar 1 o n valores de entre los posibles de ese campo y filtrar los que coincidan en dicho valor.
- Todos los botones de filtrado en todos los listados, en lugar de utilizar un icono y texto, utilizaran solo el icono. 
- Dentro de la sección de filtrado que se muestra y se esconda, incorporaremos un botón de reseteo de todos los filtros, que limpie los valores de todos los campos que se muestren en el listado. 
