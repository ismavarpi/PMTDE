# ESTRUCTURA PRINCIPAL DE LA APLICACIÓN CABECERA Y BOTON ADMINISTRACION Y PERFIL

## Cabecera
- La aplicación debe tener una cabecera que siempre estará visible. Incluso en la pantalla de login.
- En la cabecera aparecerá a la izquierda el nombre de la aplicación.
- A la derecha del todo tendremos, de derecha a izquierda los siguientes elementos:
- - Un menú de "perfil de usuario" representado mediante un icono de avatar.
- - Justo a su izquierda tendremos un menú de "Administración" representado mediante un icono de rueda dentada (gear).


## Menú lateral
Vamos a crear un panel de menú lateral.
En la cabecera en la parte más a la izquierda tendrá un icono que expanderá y contraerá este nuevo menú lateral que será el que utilicemos de menú de la aplicación.
A este menú lateral nos llevaremos las opciones de menú del sistema, salvo el menú avatar y el meú de administración.
Este menú lateral no debe ocultar la cabecera ni la zona de trabajo donde mostramos los pantallas y formularios de trabajo. La cabecera queda siempre visible.
Si  se abre, se quedará abierto hasta que pulsemos nuevamente el botón de la cabecera del menú que ahora lo cerrará. No es por tanto un menú tipo popup.
El icono del menu de la izquierda debe cambiar para reflejar si el menú está abierto o está cerrado.

### Submenus
Si un menu principal tiene submenus, el menú principal se comportará como una sección expandible/contraible en la barra de menú lateral. Así al pulsar en la opción principal, además de mostrar la pantalla que corresponda, se desplegarán las opciones hijas que este contiene. 

## Zona de trabajo
La zona de trabajo, es decir, la zona de la pantalla que se utiliza para cargar las pantallas de gestión, debe ajustar su tamaño en el ancho cuando se carga el menú de la izquierda, de forma que el menú de la izquierda cuando se abra no pise la zona de trabajo, que adecuará su tamaño al tamaño libre restante.
