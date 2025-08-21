---
title: "Casos de Uso - Trazabilidad Principios Guardarrail vs Objetivos Guardarrail"
domain: "Programas guardarrailes"
version: "1.0"
date: "2025-08-18"
author: "DGSIC"
---

# Casos de Uso: Trazabilidad Principios Guardarrail vs Objetivos Guardarrail

## Contexto
Se incorpora un submenú "Trazabilidad principios vs objetivos" dentro de "Programas guardarrailes" para relacionar cada **principio guardarrail** con los **objetivos guardarrail** del programa mediante distintos niveles de trazabilidad.

---

## Caso de Uso 1: Visualizar Matriz de Trazabilidad
**Actores principales:** Usuario.

**Precondiciones:**
- Existen principios y objetivos guardarrail registrados en el programa seleccionado.

**Flujo principal:**
1. El usuario accede a "Programas guardarrailes" → "Trazabilidad principios vs objetivos".
2. El sistema muestra una tabla de doble entrada con:
   - Filas: objetivos guardarrail.
   - Columnas: principios guardarrail.
   - Celdas: nivel de trazabilidad (N/A, baja, media, alta).
3. El usuario puede:
   - Alternar entre vista tabla y cards.
   - Ordenar filas o columnas por cualquier campo mostrado.
   - Mostrar u ocultar una sección de filtros mediante un botón solo con icono. La sección incluye:
     - Campo de búsqueda textual en códigos y títulos, sin distinguir mayúsculas, minúsculas ni acentos.
     - Filtros multiselección por programas, principios y objetivos.
     - Botón para limpiar todos los filtros.
   - Seleccionar las columnas (principios) visibles y su orden.
   - Exportar la matriz a CSV o PDF. Los CSV usan ";" como separador y las fechas se exportan entre comillas. Los ficheros se nombran `yyyymmdd HH24:MI TrazabilidadPrincipiosObjetivos.ext`.
   - Visualizar la tabla con una cabecera estilizada que la diferencia de los registros.

**Postcondiciones:**
- El usuario visualiza la matriz de trazabilidad conforme a los filtros aplicados.

---

## Caso de Uso 2: Actualizar Nivel de Trazabilidad
**Actores principales:** Usuario administrador o gestor autorizado.

**Precondiciones:**
- La matriz de trazabilidad está visible.

**Flujo principal:**
1. El usuario selecciona una celda correspondiente a un principio y un objetivo.
2. Se muestra un desplegable con los valores posibles:
   - 0 – "N/A".
   - 1 – "Baja" (● verde claro).
   - 2 – "Media" (●● verde medio).
   - 3 – "Alta" (●●● verde oscuro).
3. El usuario elige un valor. El control queda desactivado hasta completar la operación; si dura más de un segundo aparece el banner "Procesando... X seg".
4. El sistema guarda automáticamente el nivel seleccionado, refresca la matriz y muestra un banner de confirmación.

**Postcondiciones:**
- La relación entre principio y objetivo queda registrada con el nivel elegido.

**Reglas de negocio:**
- Cada combinación principio–objetivo tiene un único nivel de trazabilidad.
- El nivel por defecto es 0 (N/A).

---
