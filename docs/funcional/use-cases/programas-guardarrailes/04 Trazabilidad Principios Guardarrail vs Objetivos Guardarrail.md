---
title: "Casos de Uso - Trazabilidad Principios Guardarrail vs Objetivos Guardarrail"
domain: "Programas guardarrailes"
version: "1.0"
date: "2025-08-21"
author: "DGSIC"
---

# Casos de Uso: Trazabilidad Principios Guardarrail vs Objetivos Guardarrail

## Contexto
Se incorpora un submenú "Trazabilidad principios vs objetivos" dentro de "Programas guardarrailes" para gestionar la relación entre cada **principio guardarrail** y los **objetivos guardarrail** del programa mediante una pantalla de gestión especial con distintos niveles de trazabilidad.
Todas las pantallas relacionadas muestran en la parte superior un título con el nombre de la entidad para facilitar la identificación.

---

## Caso de Uso 1: Visualizar Matriz de Trazabilidad
**Actores principales:** Usuario.

**Precondiciones:**
- Existen principios y objetivos guardarrail registrados en el programa seleccionado.

**Flujo principal:**
1. El usuario accede a "Programas guardarrailes" → "Trazabilidad principios vs objetivos".
2. El sistema muestra una tabla de doble entrada en la que:
   - Las columnas corresponden a los principios guardarrail.
   - Las filas representan los objetivos guardarrail.
   - Al situar el cursor sobre el código de un principio u objetivo se muestra su nombre completo en un tooltip.
   - En cada celda se muestra el nivel de trazabilidad asociado entre principio y objetivo:
     - **0 – "Sin relación"**, representada por un guion **"-"**.
     - **1 – "Baja"**, representada por **un círculo verde claro**.
     - **2 – "Media"**, representada por **dos círculos verde medio**.
     - **3 – "Alta"**, representada por **tres círculos verde oscuro**.
     - **4 – "No aplica"**, mostrado como texto **"N/A"**.
     Los círculos muestran un gradiente de verde cada vez más oscuro.

**Postcondiciones:**
- El usuario visualiza la matriz de trazabilidad con los valores actuales para cada combinación principio–objetivo.

---

## Caso de Uso 2: Actualizar Nivel de Trazabilidad
**Actores principales:** Usuario administrador o gestor autorizado.

**Precondiciones:**
- La matriz de trazabilidad está visible.

**Flujo principal:**
1. El usuario selecciona una celda correspondiente a un principio y un objetivo.
2. Se muestra un desplegable con los valores posibles:
   - **0 – "Sin relación"**, representada por un guion **"-"**.
   - **1 – "Baja"**, representada por **un círculo verde claro**.
   - **2 – "Media"**, representada por **dos círculos verde medio**.
   - **3 – "Alta"**, representada por **tres círculos verde oscuro**.
   - **4 – "No aplica"**, mostrado como texto **"N/A"**.
3. El usuario elige un valor. El control queda desactivado hasta completar la operación; si dura más de un segundo aparece el banner "Procesando... X seg".
4. El sistema guarda automáticamente el nivel seleccionado, refresca la matriz y muestra un banner superior confirmando la actualización.

**Postcondiciones:**
- La relación entre principio y objetivo queda registrada con el nivel elegido.

**Reglas de negocio:**
- Cada combinación principio–objetivo tiene un único nivel de trazabilidad.
- El nivel por defecto es **0 (Sin relación)**.

---
