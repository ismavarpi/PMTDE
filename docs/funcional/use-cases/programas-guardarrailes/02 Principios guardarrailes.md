---
title: "Casos de Uso - Principios guardarrailes"
domain: "Guardarrailes"
version: "1.0"
date: "2025-08-18"
author: "DGSIC"
---

# Casos de Uso: Principios guardarrailes

## Contexto
La aplicación permite gestionar principios específicos vinculados a los programas guardarrailes
Todas las pantallas relacionadas muestran en la parte superior un título con el nombre de la entidad para facilitar la identificación.

---

## Caso de Uso 1: Crear Principio Específico
**Actores principales:** Usuario administrador o gestor autorizado.

**Precondiciones:**
- Existe al menos un Programa Guardarrail registrado.

**Flujo principal:**
1. El usuario abre el menú "Programas guardarrail" y selecciona el submenú "Principios guardarrail".
2. Elige "Nuevo principio"; se abre un formulario **popup** con los campos marcados como obligatorios mediante un asterisco (*).
3. Introduce:
   - Programa Guardarrail al que pertenece (*).
   - Título.
   - Descripción.
4. Pulsa **Guardar**. El botón queda desactivado hasta que finaliza la operación y, si tarda más de un segundo, se muestra un banner "Procesando... X seg".
5. El sistema genera automáticamente el código con la regla `códigoProgramas Guardarrail + ".P" + autonumérico secuencial`.
6. El sistema guarda el principio y la lista de principios se refresca.

**Postcondiciones:**
- El principio específico queda registrado con su código generado.

**Reglas de negocio:**

- El código se recalcula si el Programas Guardarrail cambia.

---

## Caso de Uso 2: Editar Principio Específico
**Actores principales:** Usuario administrador o gestor autorizado.

**Flujo principal:**
1. El usuario selecciona un principio existente.
2. Se abre un formulario **popup** con los datos actuales, donde los campos obligatorios están marcados con *.
3. Modifica sus datos o cambia el Programas Guardarrail asociado.
4. Pulsa **Guardar**; el botón queda desactivado y, si la operación supera un segundo, aparece el banner "Procesando... X seg".
5. El sistema recalcula el código si el Programas Guardarrail se modifica, guarda los cambios y se refresca la lista.

**Postcondiciones:**
- El principio específico se actualiza con la información proporcionada.

---

## Caso de Uso 3: Eliminar Principio Específico
**Actores principales:** Usuario administrador.

**Flujo principal:**
1. El usuario selecciona un principio y solicita su eliminación.
2. El sistema solicita confirmación en un diálogo. Tras pulsar **Aceptar**, el botón queda desactivado y, si el proceso tarda más de un segundo, se muestra el banner "Procesando... X seg".
3. Tras confirmar, se elimina el principio.
4. El sistema recalcula los códigos de los principios restantes del programa guardarrail.
5. Se refresca la lista.

**Postcondiciones:**
- El principio desaparece del sistema.

**Reglas de negocio:**
- La eliminación sin confirmación responde con un error y no borra el registro.
- Tras eliminar un principio, los códigos de los demás principios del mismo programa guardarrail se renumeran.

---

## Caso de Uso 4: Listar Principios Específicos
**Actores principales:** Usuario.

**Precondiciones:**
- Se ha seleccionado un PMTDE activo.

**Flujo principal:**
1. El usuario abre el menú "Programas guardarrail" y selecciona el submenú "Principios guardarrail".
2. El sistema aplica el filtrado por el PMTDE activo.
3. El sistema muestra para cada principio:
   - Código.
   - Programa Guardarrail.
   - Título y descripción.
4. El usuario dispone de un conjunto común de acciones en este orden: crear nuevo, filtrar, seleccionar columnas, alternar vista tabla/cards, exportar a CSV y exportar a PDF.
5. El usuario puede:
   - Alternar entre vista tabla y cards.
   - Ordenar ascendente o descendentemente por cualquier columna.
   - Mostrar u ocultar una sección de filtros mediante un botón solo con icono. La sección incluye:
     - Campo de búsqueda textual en todas las columnas, sin distinguir mayúsculas, minúsculas ni acentos.
     - Filtro por Programas Guardarrail mediante combo multiselección.
     - Botón para limpiar todos los filtros.
   - Exportar los resultados a CSV o PDF. Los CSV usan ";" como separador y las fechas se exportan entre comillas. Los ficheros se nombran `yyyymmdd HH24:MI PrincipiosGuardarrail.ext`.
   - Seleccionar las columnas visibles y su orden mediante un botón de selección de columnas; la preferencia se guarda por usuario.
   - Visualizar la tabla con una cabecera estilizada que la diferencia de los registros.

**Postcondiciones:**
- El usuario visualiza los principios específicos según los filtros aplicados.

---
