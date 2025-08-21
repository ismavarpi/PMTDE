---
title: "Casos de Uso - Inputs"
domain: "PMTDE"
version: "1.0"
date: "2025-08-18"
author: "DGSIC"
---

# Casos de Uso: Inputs

## Contexto
Los inputs son las cuestiones que deben ejecutarse por exigencia de una normativa. Su mantenimiento permite gestionarlos como menú del PMTDE.

---

## Caso de Uso 1: Crear Input
**Actores principales:** Usuario administrador o gestor autorizado.

**Flujo principal:**
1. El usuario accede al submenú "Inputs".
2. Elige "Crear nuevo input".
3. Introduce:
   - PMTDE asociado (obligatorio).
   - Normativa asociada (obligatoria). En el combo de selección se muestra el nombre de la normativa seguido entre paréntesis del nombre de la organización, permitiendo búsqueda por ambos valores.
   - Título del input (obligatorio).
   - Descripción (opcional).
4. Confirma la acción.
5. El sistema calcula el código concatenando "código de la organización" + "." + "código de la normativa" + "." + autonumérico (iniciando en 1 por normativa), guarda el registro, deshabilita el botón durante el proceso y refresca la lista. Si la operación tarda más de un segundo se muestra un banner "Procesando... X seg".

**Postcondiciones:**
- El input queda registrado con su código generado y asociado a la normativa seleccionada.

---

## Caso de Uso 2: Editar Input
**Actores principales:** Usuario administrador o gestor autorizado.

**Flujo principal:**
1. El usuario selecciona un input existente.
2. Modifica cualquiera de los campos.
3. Guarda los cambios.
4. El sistema actualiza el registro y refresca la lista, deshabilitando el botón mientras procesa.

**Postcondiciones:**
- El input se actualiza con la nueva información.

---

## Caso de Uso 3: Eliminar Input
**Actores principales:** Usuario administrador.

**Flujo principal:**
1. El usuario selecciona un input y solicita su eliminación.
2. El sistema solicita confirmación indicando que la acción es irreversible.
3. Tras confirmar, se elimina el input y se refresca la lista.

**Postcondiciones:**
- El input desaparece del sistema.

---

## Caso de Uso 4: Listar Inputs
**Actores principales:** Usuario.

**Flujo principal:**
1. El usuario abre el submenú "Inputs".
2. El sistema muestra para cada input:
   - Código.
   - Título.
   - Normativa asociada (con el nombre de la organización entre paréntesis).
   - Descripción.
3. El usuario puede:
   - Cambiar entre vista tabla o cards.
   - Ordenar por cualquier columna.
   - Seleccionar las columnas visibles (Título, Normativa, Descripción).
   - Abrir la sección de filtros para buscar texto, filtrar por normativa y reiniciar filtros.
   - Exportar la lista a CSV (separador ";" y fechas entre comillas) o PDF.

**Postcondiciones:**
- El usuario visualiza los inputs según los filtros aplicados.
