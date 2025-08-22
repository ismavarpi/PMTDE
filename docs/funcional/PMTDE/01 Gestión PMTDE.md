---
title: "Casos de Uso - PMTDE"
domain: "PMTDE"
version: "1.0"
date: "2025-08-18"
author: "DGSIC"
---

# Casos de Uso: PMTDE

## Contexto
La aplicación permite gestionar los registros del Programa Marco de Transformación Digital Efectiva. Esta pantalla no está sujeta al filtro de PMTDE activo y siempre muestra todos los registros.
Todas las pantallas relacionadas muestran en la parte superior un título con el nombre de la entidad.

---

## Caso de Uso 1: Crear PMTDE
**Actores principales:** Usuario administrador o gestor autorizado.

**Flujo principal:**
1. El usuario abre el menú "PMTDE" y selecciona el submenú "PMTDE".
2. Elige "Crear nuevo PMTDE".
3. Introduce:
   - Nombre del PMTDE (obligatorio).
   - Descripción (obligatoria).
   - Propietario (obligatorio).
4. Confirma la acción.
5. El sistema guarda el registro y refresca la lista.

**Postcondiciones:**
- El PMTDE queda registrado con su propietario.

---

## Caso de Uso 2: Editar PMTDE
**Actores principales:** Usuario administrador o gestor autorizado.

**Flujo principal:**
1. El usuario selecciona un PMTDE existente.
2. Modifica cualquiera de los campos.
3. Guarda los cambios.
4. El sistema actualiza el registro y refresca la lista.

**Postcondiciones:**
- El PMTDE se actualiza con la nueva información.

---

## Caso de Uso 3: Eliminar PMTDE
**Actores principales:** Usuario administrador.

**Flujo principal:**
1. El usuario selecciona un PMTDE y solicita su eliminación.
2. El sistema solicita confirmación indicando que la acción es irreversible.
3. Tras confirmar, se elimina el PMTDE y se refresca la lista.

**Postcondiciones:**
- El PMTDE desaparece del sistema junto con sus entidades asociadas.

---

## Caso de Uso 4: Listar PMTDE
**Actores principales:** Usuario.

**Flujo principal:**
1. El usuario abre el menú "PMTDE" y selecciona el submenú "PMTDE".
2. El sistema muestra todos los PMTDE sin aplicar el filtro del PMTDE activo:
   - Nombre.
   - Descripción.
   - Propietario.
3. El usuario puede:
   - Cambiar entre vista tabla o cards.
   - Ordenar por cualquier columna.
   - Abrir la sección de filtros para buscar texto, filtrar por propietario y reiniciar filtros.
   - Exportar la lista a CSV o PDF.
   - Seleccionar columnas visibles.

**Postcondiciones:**
- El usuario visualiza los PMTDE según los filtros aplicados.
