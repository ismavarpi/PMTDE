---
title: "Casos de Uso - Organizaciones"
domain: "PMTDE"
version: "1.0"
date: "2025-08-18"
author: "DGSIC"
---

# Casos de Uso: Organizaciones

## Contexto
Permite mantener la maestra de organizaciones asociadas a un PMTDE. Todos los campos obligatorios se marcan visualmente con un asterisco. Cada organización dispone de un código alfanumérico en mayúsculas de hasta 10 caracteres definido por el usuario.

---

## Caso de Uso 1: Crear Organización
**Actores principales:** Usuario administrador o gestor autorizado.

**Flujo principal:**
1. El usuario accede al submenú "Organizaciones".
2. Elige "Crear nueva organización".
3. Introduce:
   - Código de la organización (obligatorio, alfanumérico en mayúsculas, máximo 10 caracteres).
   - PMTDE asociado (obligatorio).
   - Nombre de la organización (obligatorio).
4. Confirma la acción.
5. El sistema guarda el registro, deshabilita el botón durante el proceso y refresca la lista. Si la operación tarda más de un segundo se muestra un banner "Procesando... X seg".

**Postcondiciones:**
- La organización queda registrada dentro del PMTDE seleccionado.

---

## Caso de Uso 2: Editar Organización
**Actores principales:** Usuario administrador o gestor autorizado.

**Flujo principal:**
1. El usuario selecciona una organización existente.
2. Modifica cualquiera de los campos.
3. Guarda los cambios.
4. El sistema actualiza el registro y refresca la lista, deshabilitando el botón mientras procesa.

**Postcondiciones:**
- La organización se actualiza con la nueva información.

---

## Caso de Uso 3: Eliminar Organización
**Actores principales:** Usuario administrador.

**Flujo principal:**
1. El usuario selecciona una organización y solicita su eliminación.
2. El sistema solicita confirmación indicando que la acción es irreversible.
3. Tras confirmar, se elimina la organización y se refresca la lista.

**Postcondiciones:**
- La organización desaparece del sistema.

---

## Caso de Uso 4: Listar Organizaciones
**Actores principales:** Usuario.

**Precondiciones:**
- Se ha seleccionado un PMTDE activo.

**Flujo principal:**
1. El usuario abre el submenú "Organizaciones".
2. El sistema aplica el filtrado por el PMTDE activo.
3. El sistema muestra para cada organización:
   - Código.
   - Nombre.
   - PMTDE asociado.
4. El usuario puede:
   - Cambiar entre vista tabla o cards.
   - Ordenar por cualquier columna.
   - Abrir la sección de filtros para buscar texto, filtrar por PMTDE y reiniciar filtros.
   - Exportar la lista a CSV (separador ";" y fechas entre comillas) o PDF.

**Postcondiciones:**
- El usuario visualiza las organizaciones según los filtros aplicados.
