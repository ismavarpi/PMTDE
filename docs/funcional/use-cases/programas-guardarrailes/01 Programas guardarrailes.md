---
title: "Casos de Uso - Programas guardarrailes"
domain: "Guardarrailes"
version: "1.0"
date: "2025-08-18"
author: "DGSIC"
---

# Casos de Uso: Programas guardarrailes

## Contexto
La aplicación permite gestionar programas guardarrail vinculados a los PMTDE.

---

## Caso de Uso 1: Crear Programa Guardarrail
**Actores principales:** Usuario administrador o gestor autorizado.

**Precondiciones:**
- Existe al menos un PMTDE registrado.
- Existen usuarios para seleccionar como responsable o expertos.

**Flujo principal:**
1. El usuario abre el menú "Programas guardarrail" y selecciona el submenú "Programas".
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
1. El usuario abre el menú "Programas guardarrail" y selecciona el submenú "Programas".
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
