---
title: "Casos de Uso - Changelog"
domain: "Changelog"
version: "1.0"
date: "2025-08-21"
author: "DGSIC"
---

# Casos de Uso: Changelog

## Contexto
La pantalla de bienvenida muestra un listado con los cambios más recientes del sistema. La información se obtiene de un fichero `changelog.json` del backend y se presenta de forma que los cambios más recientes aparecen primero.

---

## Caso de Uso 1: Visualizar cambios recientes
**Actores principales:** Usuario.

**Precondiciones:**
- Existe un fichero `changelog.json` con registros de cambios.

**Flujo principal:**
1. El usuario accede a la pantalla de bienvenida.
2. El sistema carga los 25 cambios más recientes del fichero `changelog.json`.
3. Para cada cambio se muestra:
   - Tipo de cambio: "I" (incidencia) o "M" (mejora).
   - Fecha del cambio.
   - Descripción en lenguaje natural.
4. Los cambios se ordenan de forma descendente por fecha.

**Postcondiciones:**
- El usuario visualiza los cambios recientes del sistema.

**Reglas de negocio:**
- Los cambios deben mostrarse del más reciente al más antiguo.
- Cada descripción debe estar redactada en español claro para el usuario final.
- El `changelog.json` solo incluirá cambios que afecten al código del sistema; las modificaciones de documentación se excluyen.

---

## Caso de Uso 2: Cargar más cambios
**Actores principales:** Usuario.

**Precondiciones:**
- Se han cargado previamente 25 cambios.
- Existen más de 25 cambios en el fichero `changelog.json`.

**Flujo principal:**
1. El usuario alcanza el final de la lista inicial de cambios y selecciona la opción "Cargar más".
2. El sistema obtiene los siguientes 25 cambios del fichero `changelog.json`.
3. Los nuevos cambios se añaden al final de la lista existente manteniendo el orden cronológico descendente.

**Postcondiciones:**
- El usuario visualiza 25 cambios adicionales.

**Reglas de negocio:**
- Cada petición de "Cargar más" añade exactamente 25 registros adicionales, si existen.
- Si no hay más cambios disponibles, la opción "Cargar más" se oculta o deshabilita.

---
