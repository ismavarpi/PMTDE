---
title: "Casos de Uso - Principios específicos"
domain: "Planes Estratégicos"
version: "1.1"
date: "2025-08-21"
author: "DGSIC"
---

# Casos de Uso: Principios específicos

## Contexto
La aplicación permite gestionar principios específicos vinculados a los planes estratégicos.
Dentro del menú "Planes estratégicos", el submenú "Principios específicos" se muestra en segundo lugar, precedido por "Planes" y seguido de "Objetivos estratégicos", "Trazabilidad inputs vs objetivos" y "DAFO Planes estratégicos".

---

## Caso de Uso 1: Crear Principio Específico
**Actores principales:** Usuario administrador o gestor autorizado.

**Precondiciones:**
- Existe al menos un Plan Estratégico registrado.

**Flujo principal:**
1. El usuario abre el submenú "Principios específicos".
2. Elige "Nuevo principio".
3. Introduce:
   - Plan estratégico al que pertenece (obligatorio).
   - Título.
   - Descripción.
4. El sistema genera automáticamente el código con la regla `códigoPlan + ".P" + autonumérico secuencial`.
5. El sistema guarda el principio.
6. La lista de principios se refresca.

**Postcondiciones:**
- El principio específico queda registrado con su código generado.

**Reglas de negocio:**
- Los campos sin valor se completan con valores por defecto (`plan_id=1`, `titulo='n/a'`, `descripcion='n/a'`).
- El código es único dentro de cada plan y se recalcula si el plan cambia.

---

## Caso de Uso 2: Editar Principio Específico
**Actores principales:** Usuario administrador o gestor autorizado.

**Flujo principal:**
1. El usuario selecciona un principio existente.
2. Modifica sus datos o cambia el plan asociado.
3. El sistema recalcula el código si el plan se modifica.
4. Se guardan los cambios y se refresca la lista.

**Postcondiciones:**
- El principio específico se actualiza con la información proporcionada.

---

## Caso de Uso 3: Eliminar Principio Específico
**Actores principales:** Usuario administrador.

**Flujo principal:**
1. El usuario selecciona un principio y solicita su eliminación.
2. El sistema solicita confirmación.
3. Tras confirmar, se elimina el principio.
4. El sistema recalcula los códigos de los principios restantes del plan.
5. Se refresca la lista.

**Postcondiciones:**
- El principio desaparece del sistema.
- Los códigos del plan se renumeran.

**Reglas de negocio:**
- La eliminación sin confirmación responde con un error y no borra el registro.
- Tras eliminar un principio, los códigos de los demás principios del mismo plan se renumeran.

---

## Caso de Uso 4: Listar Principios Específicos
**Actores principales:** Usuario.

**Precondiciones:**
- Se ha seleccionado un PMTDE activo.

**Flujo principal:**
1. El usuario abre el submenú "Principios específicos".
2. El sistema aplica el filtrado por el PMTDE activo.
3. El sistema muestra para cada principio:
   - Código.
   - Plan estratégico.
   - Título y descripción.
4. El usuario puede:
   - Alternar entre vista tabla y cards.
   - Ordenar por cualquier columna.
   - Mostrar/ocultar filtros para búsqueda textual y por plan, con opción de reset.
   - Exportar a CSV o PDF.
   - Seleccionar las columnas visibles.

**Postcondiciones:**
- El usuario visualiza los principios específicos según los filtros aplicados.

---
