---
title: "Casos de Uso - Planes estratégicos"
domain: "Planes estratégicos"
version: "1.1"
date: "2025-08-21"
author: "DGSIC"
---

# Casos de Uso: Planes estratégicos

## Contexto
La aplicación permite gestionar Planes estratégicos vinculados a los PMTDE.
En el menú "Planes estratégicos", el submenú "Planes" se muestra en primer lugar, seguido de "Principios específicos", "Objetivos estratégicos", "Trazabilidad inputs vs objetivos" y "DAFO Planes estratégicos".

---

## Caso de Uso 1: Crear Plan estratégico
**Actores principales:** Usuario administrador o gestor autorizado.

**Precondiciones:**
- Existe al menos un PMTDE registrado.
- Existen usuarios para seleccionar como responsable o expertos.

**Flujo principal:**
1. El usuario abre el menú "Planes estratégicos" y selecciona el submenú "Planes".
2. Elige "Crear nuevo plan".
3. Introduce:
   - PMTDE asociado (obligatorio).
   - Código del plan (máx. 8 caracteres, se convierte a mayúsculas).
   - Nombre del plan.
   - Descripción.
   - Responsable.
   - Grupo de expertos.
4. El usuario confirma la acción.
5. El sistema guarda el plan y asocia los expertos.
6. La lista de Planes estratégicos se refresca para mostrar el nuevo registro.

**Postcondiciones:**
- El Plan estratégico queda registrado con su código normalizado.
- Se muestran los expertos vinculados.

**Reglas de negocio:**
- El código se almacena en mayúsculas y se limita a ocho caracteres.

---

## Caso de Uso 2: Editar Plan estratégico
**Actores principales:** Usuario administrador o gestor autorizado.

**Flujo principal:**
1. El usuario selecciona un Plan estratégico existente.
2. Modifica cualquiera de los campos.
3. Puede añadir o retirar expertos del grupo.
4. El usuario guarda los cambios.
5. El sistema actualiza el Plan estratégico, sustituye el grupo de expertos y refresca la lista.

**Postcondiciones:**
- El Plan estratégico se actualiza con la nueva información.
- El grupo de expertos se reemplaza por la selección actual.

**Reglas de negocio:**
- Los expertos existentes se eliminan y se insertan los seleccionados para mantener consistencia.
- Si se modifica el código del plan estratégico, se recalculan los códigos de sus principios, objetivos y evidencias asociadas.

---

## Caso de Uso 3: Eliminar Plan estratégico
**Actores principales:** Usuario administrador.

**Flujo principal:**
1. El usuario selecciona un Plan estratégico y solicita su eliminación.
2. El sistema informa del número de expertos asociados y solicita confirmación.
3. Tras confirmar, se eliminan los registros del Plan estratégico y sus expertos.
4. La lista de Plan estratégico se refresca.

**Postcondiciones:**
- El Plan estratégico y sus asociaciones de expertos desaparecen del sistema.

**Reglas de negocio:**
- La eliminación sin confirmación devuelve un mensaje con los elementos en cascada pendientes de borrar.

---

## Caso de Uso 4: Listar Planes estratégicos
**Actores principales:** Usuario.

**Flujo principal:**
1. El usuario abre el menú "Planes estratégicos" y selecciona el submenú "Planes".
2. El sistema muestra para cada Plan estratégico:
   - PMTDE asociado.
   - Código.
   - Nombre y descripción.
   - Responsable y grupo de expertos.
3. El usuario puede:
   - Cambiar entre vista tabla o cards.
   - Ordenar por cualquier columna.
   - Abrir la sección de filtros para buscar texto, filtrar por PMTDE, responsable o expertos y reiniciar filtros.
   - Exportar la lista a CSV o PDF.
   - Seleccionar columnas visibles.

**Postcondiciones:**
- El usuario visualiza los Plan estratégico según los filtros aplicados.



---
