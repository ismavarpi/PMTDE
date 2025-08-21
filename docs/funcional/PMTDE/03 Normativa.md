---
title: "Casos de Uso - Normativa"
domain: "PMTDE"
version: "1.0"
date: "2025-08-18"
author: "DGSIC"
---

# Casos de Uso: Normativa

## Contexto
Gestiona la normativa emitida por las organizaciones dentro de un PMTDE. Los campos obligatorios aparecen marcados con un asterisco.

---

## Caso de Uso 1: Crear Normativa
**Actores principales:** Usuario administrador o gestor autorizado.

**Flujo principal:**
1. El usuario accede al submenú "Normativa".
2. Elige "Crear nueva normativa".
3. Introduce:
   - PMTDE asociado (obligatorio).
   - Organización emisora (obligatoria).
   - Código de la normativa (obligatorio, alfanumérico en mayúsculas de hasta 10 caracteres).
   - Nombre de la normativa (obligatorio).
   - URL de consulta (opcional).
4. Confirma la acción.
5. El sistema guarda el registro, deshabilita el botón durante el proceso y refresca la lista. Si la operación tarda más de un segundo se muestra un banner "Procesando... X seg".

**Postcondiciones:**
- La normativa queda registrada vinculada a la organización seleccionada.

---

## Caso de Uso 2: Editar Normativa
**Actores principales:** Usuario administrador o gestor autorizado.

**Flujo principal:**
1. El usuario selecciona una normativa existente.
2. Modifica cualquiera de los campos.
3. Guarda los cambios.
4. El sistema actualiza el registro y refresca la lista, deshabilitando el botón mientras procesa.

**Postcondiciones:**
- La normativa se actualiza con la nueva información.

---

## Caso de Uso 3: Eliminar Normativa
**Actores principales:** Usuario administrador.

**Flujo principal:**
1. El usuario selecciona una normativa y solicita su eliminación.
2. El sistema solicita confirmación indicando que la acción es irreversible.
3. Tras confirmar, se elimina la normativa y se refresca la lista.

**Postcondiciones:**
- La normativa desaparece del sistema.

---

## Caso de Uso 4: Listar Normativa
**Actores principales:** Usuario.

**Flujo principal:**
1. El usuario abre el submenú "Normativa".
2. El sistema muestra para cada normativa:
   - Código.
   - Nombre.
   - Organización emisora.
   - URL.
3. El usuario puede:
   - Cambiar entre vista tabla o cards.
   - Ordenar por cualquier columna.
   - Abrir la sección de filtros para buscar texto, filtrar por organización y reiniciar filtros.
   - Exportar la lista a CSV (separador ";" y fechas entre comillas) o PDF.

**Postcondiciones:**
- El usuario visualiza las normativas según los filtros aplicados.
