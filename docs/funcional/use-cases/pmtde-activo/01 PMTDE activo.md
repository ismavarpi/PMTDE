---
title: "Casos de Uso - PMTDE activo"
domain: "PMTDE"
version: "1.0"
date: "2025-08-22"
author: "DGSIC"
---

# Casos de Uso: PMTDE activo

## Contexto
Los usuarios pueden elegir un PMTDE activo con el que trabajar. El nombre del PMTDE activo aparece en la cabecera de la aplicación antes de la rueda de administración y del menú de perfil. Si no hay ninguno seleccionado se muestra el texto "Seleccionar PMTDE". La selección determina los registros que se muestran en la mayoría de las pantallas del sistema.

---

## Caso de Uso 1: Seleccionar PMTDE activo
**Actores principales:** Usuario.

**Precondiciones:**
- Existen PMTDE registrados.

**Flujo principal:**
1. En la cabecera, el usuario pulsa sobre el nombre del PMTDE activo o sobre "Seleccionar PMTDE".
2. El sistema muestra un popup con la lista de PMTDE disponibles.
3. El usuario elige uno de los PMTDE.
4. El sistema establece dicho PMTDE como activo y lo muestra subrayado y clicable en la cabecera.
5. El sistema cierra el popup.

**Postcondiciones:**
- El PMTDE seleccionado queda como activo y visible en la cabecera.

**Reglas de negocio:**
- Si no existe un PMTDE activo, el texto mostrado es "Seleccionar PMTDE".
- El PMTDE activo puede cambiarse en cualquier momento repitiendo el flujo.

---

## Caso de Uso 2: Filtrar registros por PMTDE activo
**Actores principales:** Usuario.

**Precondiciones:**
- Hay un PMTDE activo seleccionado.

**Flujo principal:**
1. El usuario accede a cualquier listado de gestión de entidades.
2. El sistema aplica automáticamente un filtrado por el PMTDE activo y muestra solo los registros asociados.
3. El filtrado no puede desactivarse desde los filtros propios del listado.
4. Al cambiar el PMTDE activo, el sistema actualiza los listados para reflejar la nueva selección.

**Postcondiciones:**
- Los listados muestran únicamente registros del PMTDE activo.

**Reglas de negocio:**
- La pantalla de gestión del submenú PMTDE es la única que no aplica este filtrado.
- El filtrado es fuerte y solo se modifica al cambiar el PMTDE activo.

---
