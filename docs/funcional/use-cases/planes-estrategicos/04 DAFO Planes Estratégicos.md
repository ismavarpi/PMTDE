---
title: "Casos de Uso - Matrices DAFO Planes Estratégicos"
domain: "Planes estratégicos"
version: "1.0"
date: "2025-08-21"
author: "DGSIC"
---

# Casos de Uso: Matrices DAFO de Planes Estratégicos

## Contexto
La aplicación permite gestionar registros **DAFO** asociados a un **plan estratégico**. Cada registro se vincula a un plan y se clasifica por tipo. Todas las pantallas relacionadas muestran en la parte superior un título con el nombre de la entidad para facilitar la identificación.

---

## Caso de Uso 1: Crear Registro DAFO
**Actores principales:** Usuario administrador o gestor autorizado.

**Precondiciones:**
- Existe al menos un Plan Estratégico registrado.

**Flujo principal:**
1. El usuario abre el menú "Planes estratégicos" y selecciona el submenú "DAFO".
2. Pulsa el botón "Nuevo registro"; se abre un formulario **popup** con los campos obligatorios marcados con *.
3. Introduce:
   - Plan Estratégico (*).
   - Tipo (*).
   - Título (*).
   - Descripción.
4. Pulsa **Guardar**. El botón queda desactivado hasta finalizar la operación y, si supera un segundo, se muestra un banner "Procesando... X seg".
5. El sistema guarda el registro.
6. Se refresca la lista de registros.

**Postcondiciones:**
- El registro DAFO queda asociado al plan estratégico.

---

## Caso de Uso 2: Editar Registro DAFO
**Actores principales:** Usuario administrador o gestor autorizado.

**Flujo principal:**
1. El usuario selecciona un registro y elige "Editar"; se abre un formulario **popup** con los datos actuales y los campos obligatorios marcados con *.
2. Puede modificar el plan estratégico, el tipo, el título y la descripción.
3. Pulsa **Guardar**; el botón se desactiva y aparece el banner "Procesando... X seg" si la operación tarda más de un segundo.
4. El sistema actualiza el registro.
5. Se refresca la lista.

**Postcondiciones:**
- El registro DAFO se actualiza con la información proporcionada.

---

## Caso de Uso 3: Eliminar Registro DAFO
**Actores principales:** Usuario administrador.

**Flujo principal:**
1. El usuario selecciona un registro y solicita su eliminación.
2. El sistema solicita confirmación en un diálogo. Tras aceptar, el botón queda desactivado y se muestra el banner "Procesando... X seg" si el proceso supera un segundo.
3. El sistema elimina el registro.
4. La lista se refresca.

**Postcondiciones:**
- El registro DAFO desaparece del sistema.

---

## Caso de Uso 4: Listar Registros DAFO
**Actores principales:** Usuario.

**Flujo principal:**
1. El usuario abre el submenú "DAFO".
2. El sistema muestra para cada registro:
   - Plan Estratégico.
   - Tipo.
   - Título.
   - Descripción.
3. El usuario dispone de los siguientes controles en este orden: crear nuevo, filtrar, seleccionar columnas, alternar vista tabla/cards, exportar a CSV y exportar a PDF.
4. El usuario puede:
   - Alternar entre vista tabla y cards.
   - Ordenar ascendente o descendentemente por cualquier columna.
   - Mostrar u ocultar la sección de filtros mediante un botón solo con icono. La sección incluye:
     - Búsqueda textual en todas las columnas.
     - Filtro por Plan Estratégico mediante combo multiselección.
     - Filtro por Tipo mediante combo multiselección.
     - Botón para limpiar todos los filtros.
   - Exportar resultados a CSV o PDF. Los CSV usan ";" como separador y las fechas se exportan entre comillas. Los ficheros se nombran `yyyymmdd HH24:MI DafoPlanesEstrategicos.ext`.
   - Seleccionar las columnas visibles y su orden; la preferencia se guarda por usuario.
   - Visualizar la tabla con una cabecera estilizada que la diferencia de los registros.

**Postcondiciones:**
- El usuario visualiza los registros DAFO según los filtros aplicados.

---
