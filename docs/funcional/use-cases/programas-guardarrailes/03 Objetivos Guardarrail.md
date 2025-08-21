---
title: "Casos de Uso - Gestión de Objetivos Guardarrail"
domain: "Guardarrailes"
version: "1.0"
date: "2025-08-18"
author: "DGSIC"
---

# Casos de Uso: Objetivos Guardarrail

## Contexto
La aplicación permite gestionar **objetivos guardarrail** vinculados a un **programa guardarrail** y, de forma independiente, a uno o varios **planes estratégicos**. Cada objetivo puede disponer de **evidencias** asociadas.

---

## Caso de Uso 1: Crear Objetivo Guardarrail
**Actores principales:** Usuario administrador o gestor autorizado.

**Precondiciones:**
- Existe al menos un Programa Guardarrail registrado.
- Existen Planes Estratégicos para vincular si se requiere.

**Flujo principal:**
1. El usuario abre el menú "Programas guardarrail" y selecciona el submenú "Objetivos guardarrail".
2. Pulsa el botón "Nuevo objetivo"; se abre un formulario **popup** con los campos obligatorios marcados con un asterisco (*).
3. Introduce:
   - Programa Guardarrail (*).
   - Planes Estratégicos a los que aplica (multiselección, opcional).
   - Título (*).
   - Descripción (*).
4. Pulsa **Guardar**. El botón queda desactivado hasta finalizar la operación y, si supera un segundo, se muestra un banner "Procesando... X seg".
5. El sistema genera el código con la regla `códigoPrograma + ".OG" + autonumérico secuencial`, guarda el objetivo y las asociaciones a los planes seleccionados.
6. Se refresca la lista de objetivos.

**Postcondiciones:**
- El objetivo guardarrail queda registrado con su código generado.
- Quedan registradas las relaciones con los planes seleccionados, si los hubiera.

**Reglas de negocio:**
- El código es único dentro del programa guardarrail.
- Si cambia el código del programa guardarrail, se recalculan los códigos del objetivo y de sus evidencias.

---

## Caso de Uso 2: Editar Objetivo Guardarrail
**Actores principales:** Usuario administrador o gestor autorizado.

**Flujo principal:**
1. El usuario selecciona un objetivo y elige "Editar"; se abre un formulario **popup** con los datos actuales y los campos obligatorios marcados con *.
2. Puede modificar el programa guardarrail, el título, la descripción y la lista de planes estratégicos asociados.
3. Pulsa **Guardar**; el botón se desactiva y aparece el banner "Procesando... X seg" si la operación tarda más de un segundo.
4. El sistema actualiza el objetivo, ajusta las asociaciones a los planes y recalcula los códigos si cambia el programa.
5. Se refresca la lista de objetivos.

**Postcondiciones:**
- El objetivo guardarrail se actualiza con la información proporcionada.
- Las asociaciones a planes estratégicos reflejan la selección actual.

---

## Caso de Uso 3: Eliminar Objetivo Guardarrail
**Actores principales:** Usuario administrador.

**Flujo principal:**
1. El usuario selecciona un objetivo y solicita su eliminación.
2. El sistema solicita confirmación en un diálogo. Tras aceptar, el botón queda desactivado y se muestra el banner "Procesando... X seg" si el proceso supera un segundo.
3. El sistema elimina el objetivo, sus evidencias y las asociaciones con planes estratégicos.
4. Recalcula los códigos de los objetivos restantes del mismo programa guardarrail.
5. La lista de objetivos se refresca.

**Postcondiciones:**
- El objetivo, sus evidencias y asociaciones desaparecen del sistema.
- Los códigos de los objetivos restantes se actualizan para mantener la secuencia.

---

## Caso de Uso 4: Listar Objetivos Guardarrail
**Actores principales:** Usuario.

**Flujo principal:**
1. El usuario abre el submenú "Objetivos guardarrail".
2. El sistema muestra para cada objetivo:
   - Programa Guardarrail.
   - Código.
   - Título y descripción.
   - Número de evidencias.
   - Planes Estratégicos asociados.
3. El usuario dispone de los siguientes controles en este orden: crear nuevo, filtrar, seleccionar columnas, alternar vista tabla/cards, exportar a CSV y exportar a PDF.
4. El usuario puede:
   - Alternar entre vista tabla y cards.
   - Ordenar ascendente o descendentemente por cualquier columna.
   - Mostrar u ocultar la sección de filtros mediante un botón solo con icono. La sección incluye:
     - Búsqueda textual en todas las columnas, sin distinguir mayúsculas, minúsculas ni acentos.
     - Filtro por Programa Guardarrail mediante combo multiselección.
     - Filtro por Plan Estratégico mediante combo multiselección.
     - Botón para limpiar todos los filtros.
   - Exportar resultados a CSV o PDF. Los CSV usan ";" como separador y las fechas se exportan entre comillas. Los ficheros se nombran `yyyymmdd HH24:MI ObjetivosGuardarrail.ext`.
   - Seleccionar las columnas visibles y su orden; la preferencia se guarda por usuario.
   - Visualizar la tabla con una cabecera estilizada que la diferencia de los registros.

**Postcondiciones:**
- El usuario visualiza los objetivos guardarrail según los filtros aplicados.

---

## Caso de Uso 5: Asociar Plan Estratégico a Objetivo Guardarrail
**Actores principales:** Usuario administrador o gestor autorizado.

**Precondiciones:**
- Existe al menos un objetivo guardarrail y un plan estratégico.

**Flujo principal:**
1. El usuario selecciona un objetivo y elige "Gestionar planes estratégicos".
2. Se abre un formulario **popup** que muestra los planes ya asociados y permite añadir nuevos mediante combo multiselección.
3. Tras seleccionar los planes, pulsa **Guardar**; el botón se desactiva y aparece el banner "Procesando... X seg" si es necesario.
4. El sistema registra las nuevas asociaciones y refresca la lista de planes asociados.

**Postcondiciones:**
- El objetivo guardarrail queda vinculado a los planes estratégicos seleccionados.

---

## Caso de Uso 6: Desasociar Plan Estratégico de Objetivo Guardarrail
**Actores principales:** Usuario administrador o gestor autorizado.

**Flujo principal:**
1. El usuario, desde la gestión de planes asociados a un objetivo, marca los planes a eliminar.
2. Pulsa **Guardar**; el botón se desactiva y, si el proceso supera un segundo, se muestra el banner "Procesando... X seg".
3. El sistema elimina las asociaciones seleccionadas y refresca la lista.

**Postcondiciones:**
- El objetivo guardarrail deja de estar vinculado a los planes estratégicos desasociados.

---

## Caso de Uso 7: Crear Evidencia
**Actores principales:** Usuario administrador o gestor autorizado.

**Precondiciones:**
- Existe al menos un objetivo guardarrail registrado.

**Flujo principal:**
1. El usuario selecciona un objetivo y elige "Añadir evidencia".
2. Se abre un formulario **popup** con los campos obligatorios marcados con *.
3. Introduce la descripción (*) y pulsa **Guardar**. El botón se desactiva y se muestra el banner "Procesando... X seg" si la operación tarda.
4. El sistema genera el código con la regla `códigoObjetivo + ".EV" + autonumérico secuencial` y guarda la evidencia.
5. Se refresca la lista de evidencias del objetivo.

**Postcondiciones:**
- La evidencia queda registrada y vinculada al objetivo guardarrail.

---

## Caso de Uso 8: Editar Evidencia
**Actores principales:** Usuario administrador o gestor autorizado.

**Flujo principal:**
1. El usuario selecciona una evidencia y elige "Editar".
2. Se abre un formulario **popup** con la descripción actual marcada como obligatoria.
3. Tras modificar, pulsa **Guardar**; el botón se desactiva y, si tarda más de un segundo, se muestra el banner "Procesando... X seg".
4. El sistema guarda los cambios y refresca la lista.

**Postcondiciones:**
- La evidencia se actualiza. Si el objetivo cambia de código, el sistema recalcula automáticamente los códigos de sus evidencias.

---

## Caso de Uso 9: Eliminar Evidencia
**Actores principales:** Usuario administrador.

**Flujo principal:**
1. El usuario selecciona una evidencia y solicita su eliminación.
2. El sistema solicita confirmación en un diálogo. Tras aceptar, el botón se desactiva y aparece el banner "Procesando... X seg" si es necesario.
3. El sistema elimina la evidencia y recalcula los códigos de las restantes.
4. Se refresca la lista de evidencias.

**Postcondiciones:**
- La evidencia desaparece del sistema.

---

## Caso de Uso 10: Listar Evidencias
**Actores principales:** Usuario.

**Flujo principal:**
1. El usuario selecciona un objetivo guardarrail.
2. El sistema muestra la lista de evidencias con su código y descripción.
3. El usuario dispone de los controles comunes: crear, filtrar, seleccionar columnas, alternar vista tabla/cards, exportar a CSV y a PDF.
4. El usuario puede:
   - Alternar entre vista tabla y cards.
   - Ordenar por cualquier columna.
   - Mostrar u ocultar la sección de filtros mediante un botón solo con icono. La sección incluye búsqueda textual en todas las columnas y un botón para limpiar filtros.
   - Exportar a CSV (separador ";", fechas entre comillas) o PDF, nombrando los ficheros `yyyymmdd HH24:MI EvidenciasObjetivoGuardarrail.ext`.
   - Seleccionar columnas visibles con preferencia guardada por usuario.
   - Ver la tabla con una cabecera diferenciada.

**Postcondiciones:**
- El usuario visualiza las evidencias del objetivo guardarrail según los filtros aplicados.

---
