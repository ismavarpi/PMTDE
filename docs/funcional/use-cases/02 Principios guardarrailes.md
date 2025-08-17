---
title: "Casos de Uso - Principios guardarrailes"
domain: "Guardarrailes"
version: "1.0"
date: "2025-08-18"
author: "DGSIC"
---

# Casos de Uso: Principios guardarrailes

## Contexto
La aplicación permite gestionar programas guardarrail y principios específicos vinculados a los planes estratégicos del PMTDE.

---

## Caso de Uso 1: Crear Programa Guardarrail
**Actores principales:** Usuario administrador o gestor autorizado.

**Precondiciones:**
- Existe al menos un PMTDE registrado.
- Existen usuarios para seleccionar como responsable o expertos.

**Flujo principal:**
1. El usuario abre el submenú "Programas guardarrail".
2. Elige "Crear nuevo programa".
3. Introduce:
   - PMTDE asociado (obligatorio).
   - Código del programa (máx. 8 caracteres, se convierte a mayúsculas).
   - Nombre del programa.
   - Descripción.
   - Responsable.
   - Grupo de expertos.
4. El usuario confirma la acción.
5. El sistema guarda el programa y asocia los expertos.
6. La lista de programas se refresca para mostrar el nuevo registro.

**Postcondiciones:**
- El programa guardarrail queda registrado con su código normalizado.
- Se muestran los expertos vinculados.

**Reglas de negocio:**
- Los campos sin valor se guardan con valores por defecto (`pmtde_id=1`, `nombre='n/a'`, `descripcion='n/a'`, `responsable_id=1`).
- El código se almacena en mayúsculas y se limita a ocho caracteres.

---

## Caso de Uso 2: Editar Programa Guardarrail
**Actores principales:** Usuario administrador o gestor autorizado.

**Flujo principal:**
1. El usuario selecciona un programa existente.
2. Modifica cualquiera de los campos.
3. Puede añadir o retirar expertos del grupo.
4. El usuario guarda los cambios.
5. El sistema actualiza el programa, sustituye el grupo de expertos y refresca la lista.

**Postcondiciones:**
- El programa guardarrail se actualiza con la nueva información.
- El grupo de expertos se reemplaza por la selección actual.

**Reglas de negocio:**
- Los expertos existentes se eliminan y se insertan los seleccionados para mantener consistencia.

---

## Caso de Uso 3: Eliminar Programa Guardarrail
**Actores principales:** Usuario administrador.

**Flujo principal:**
1. El usuario selecciona un programa y solicita su eliminación.
2. El sistema informa del número de expertos asociados y solicita confirmación.
3. Tras confirmar, se eliminan los registros del programa y sus expertos.
4. La lista de programas se refresca.

**Postcondiciones:**
- El programa guardarrail y sus asociaciones de expertos desaparecen del sistema.

**Reglas de negocio:**
- La eliminación sin confirmación devuelve un mensaje con los elementos en cascada pendientes de borrar.

---

## Caso de Uso 4: Listar Programas Guardarrail
**Actores principales:** Usuario.

**Flujo principal:**
1. El usuario abre el submenú "Programas guardarrail".
2. El sistema muestra para cada programa:
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
- El usuario visualiza los programas según los filtros aplicados.

---

## Caso de Uso 5: Crear Principio Específico
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
- El código se recalcula si el plan cambia.

---

## Caso de Uso 6: Editar Principio Específico
**Actores principales:** Usuario administrador o gestor autorizado.

**Flujo principal:**
1. El usuario selecciona un principio existente.
2. Modifica sus datos o cambia el plan asociado.
3. El sistema recalcula el código si el plan se modifica.
4. Se guardan los cambios y se refresca la lista.

**Postcondiciones:**
- El principio específico se actualiza con la información proporcionada.

---

## Caso de Uso 7: Eliminar Principio Específico
**Actores principales:** Usuario administrador.

**Flujo principal:**
1. El usuario selecciona un principio y solicita su eliminación.
2. El sistema solicita confirmación.
3. Tras confirmar, se elimina el principio.
4. Se refresca la lista.

**Postcondiciones:**
- El principio desaparece del sistema.

**Reglas de negocio:**
- La eliminación sin confirmación responde con un error y no borra el registro.

---

## Caso de Uso 8: Listar Principios Específicos
**Actores principales:** Usuario.

**Flujo principal:**
1. El usuario abre el submenú "Principios específicos".
2. El sistema muestra para cada principio:
   - Código.
   - Plan estratégico.
   - Título y descripción.
3. El usuario puede:
   - Alternar entre vista tabla y cards.
   - Ordenar por cualquier columna.
   - Mostrar/ocultar filtros para búsqueda textual y por plan, con opción de reset.
   - Exportar a CSV o PDF.
   - Seleccionar las columnas visibles.

**Postcondiciones:**
- El usuario visualiza los principios específicos según los filtros aplicados.

---
