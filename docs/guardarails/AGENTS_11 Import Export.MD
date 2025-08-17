IMPORT EXPORT
================================
- La aplicación debe tener dentro del menú administración que existirá en la cabecera, un submenú de "Importación / Exportación"
- Este submenú tendrá dos grandes secciones: la sección importar datos y la sección exportar datos
- La sección "Exportación de datos" tendrá un botón que exportará todos los registros de la aplicación en un fichero sql.
- El nombre del fichero de exportación será "fecha en formato yyyymmdd HH24:MI " + exportación de datos + "valor del parámetro nombre de aplicación + ".sql"
- Se exportarán todos los registros de la aplicación en el orden correcto para que cuando luego utilicemos este sql para importar los datos a la aplicación se haga en el orden correcto para que no haya problemas de carga por integridad referencial.
- La sección "Importación de datos" tendrá un botón de "Seleccionar archivo de datos", que permitirá seleccionar un archivo sql local. Cargará este archivo en el sistema y analizará su contenido.
- Mostrará a continuación en la sección de importación de datos los nombres de las entidades que contiene el fichero sql, permitiendo seleccionar aquellas que deseen importarse.
- Por último tendrá un botón "Importar datos", que importará los registros correspondientes a las entidades seleccionadas.
- Mostrará un resumen de la importación en modo tabla que indicará por cada entidad, cuantos registros se han cargado correctamente y en cuantos registros ha habido un error de carga
- Por último mostrará un cuadro con los logs correspondientes al resultado de las importaciones, de forma que podamos verificar si la importación ha ido correctamente o no.
- Cuando importemos registros es importante verificar si ya existe el registro en el sistema por su identificador. Si no existe lo crearemos, y si existe lo actualizaremos.

Cuando importas registros a través de la funcionalidad de "Importación / Exportación", tienes que asegurarte de que funciona como sigue:
- Los registros del fichero seleccionado de importación que no existan en el sistema > se crean.
- Los registros del fichero seleccionado de importación que existan en el sistema > se actualizan.
- Los registros que existan en el sistema, pero no existan en el fichero seleccionado de importación > se deben eliminar.
