---
title: "Casos de Uso - Gestión de Objetivos guardarrailes"
domain: "Programas guardarrailes"
version: "1.0"
date: "2025-08-18"
author: "DGSIC"
---

# Casos de Uso: Gestión de Objetivos guardarrailes

## Contexto
Se requiere la creación de un submenú "Objetivos guardarrailes" dentro del menú de "Programas guardarrailes".  
Cada **objetivo guardarrailes** está vinculado obligatoriamente a un **programa guardarrailes** y podrá contener **evidencias** asociadas.

---

## Caso de Uso 1: Crear Objetivo guardarrailes
**Actores principales:** Usuario administrador o gestor autorizado.  

**Precondiciones:**
- Existe al menos un Programa guardarrailes registrado.  

**Flujo principal:**
1. El usuario selecciona el submenú "Objetivos guardarrailes".
2. Elige la opción "Crear nuevo objetivo".
3. Introduce:
   - Programa guardarrail al que pertenece (obligatorio).
   - Título del objetivo.
   - Descripción del objetivo.
4. El sistema genera automáticamente el código del objetivo siguiendo la regla:  
   `códigoPrograma + ".OE" + autonumérico secuencial`.  
5. El sistema guarda el objetivo.  

**Postcondiciones:**
- El objetivo guardarrailes queda registrado y visible en el sistema.
- Se muestra el código generado.

**Reglas de negocio:**
- El código debe ser único en el contexto del programa guardarrail.
- Si se renombra o cambia el código del programa guardarrail, los códigos de todos sus objetivos deben recalcularse.

---

## Caso de Uso 2: Editar Objetivo guardarrail
**Actores principales:** Usuario administrador o gestor autorizado.  

**Flujo principal:**
1. El usuario selecciona un objetivo existente.
2. Puede modificar título, descripción o programa guardarrail asociado.
3. Si cambia de programa guardarrail:
   - El sistema recalcula automáticamente el código del objetivo y los de sus evidencias asociadas, de acuerdo con el nuevo código de programa guardarrail.
4. Se guardan los cambios.

**Postcondiciones:**
- El objetivo se actualiza con la nueva información.
- Los códigos vinculados se recalculan cuando es necesario.

---

## Caso de Uso 3: Eliminar Objetivo guardarrail
**Actores principales:** Usuario administrador.  

**Flujo principal:**
1. El usuario selecciona un objetivo y solicita su eliminación.
2. El sistema elimina también todas las evidencias asociadas.
3. El sistema recalcula los códigos de los objetivos restantes dentro del mismo programa guardarrail y sus evidencias, manteniendo la secuencia sin huecos.

**Postcondiciones:**
- El objetivo y sus evidencias desaparecen del sistema.
- Los códigos de los demás objetivos se actualizan.

---

## Caso de Uso 4: Listar Objetivos guardarrailes
**Actores principales:** Usuario.  

**Flujo principal:**
1. El usuario abre el submenú "Objetivos guardarrailes".
2. El sistema muestra:
   - Programa guardarrail asociado.
   - Código del objetivo.
   - Título y descripción.
   - Número de evidencias vinculadas.  

**Postcondiciones:**
- El usuario visualiza la información actualizada de todos los objetivos.

---

## Caso de Uso 5: Crear Evidencia
**Actores principales:** Usuario administrador o gestor autorizado.  

**Precondiciones:**
- Existe al menos un objetivo guardarrail registrado.  

**Flujo principal:**
1. El usuario selecciona un objetivo.
2. Elige la opción "Añadir evidencia".
3. Introduce la descripción de la evidencia.
4. El sistema genera el código con la regla:  
   `códigoObjetivo + ".EV" + autonumérico secuencial`.  
5. Se guarda la evidencia.

**Postcondiciones:**
- La evidencia queda registrada y vinculada al objetivo.
- El código de evidencia mantiene la secuencia sin huecos.

---

## Caso de Uso 6: Editar Evidencia
**Actores principales:** Usuario administrador o gestor autorizado.  

**Flujo principal:**
1. El usuario selecciona una evidencia existente.
2. Puede modificar su descripción.
3. El sistema guarda los cambios.

**Postcondiciones:**
- La evidencia se actualiza sin afectar su código, salvo que el objetivo guardarrail cambie de código (en cuyo caso se recalculan los códigos automáticamente).

---

## Caso de Uso 7: Eliminar Evidencia
**Actores principales:** Usuario administrador.  

**Flujo principal:**
1. El usuario selecciona una evidencia de un objetivo y solicita su eliminación.
2. El sistema elimina la evidencia.
3. El sistema recalcula los códigos de las evidencias restantes de ese objetivo, manteniendo la secuencia.

**Postcondiciones:**
- La evidencia desaparece del sistema.
- Los códigos de las demás evidencias se actualizan.

---

## Caso de Uso 8: Listar Evidencias
**Actores principales:** Usuario.  

**Flujo principal:**
1. El usuario selecciona un objetivo guardarrail.
2. El sistema muestra la lista de evidencias asociadas:
   - Código de evidencia.
   - Descripción.

**Postcondiciones:**
- El usuario visualiza todas las evidencias vinculadas a un objetivo estratégico.

---
