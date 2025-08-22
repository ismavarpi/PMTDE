---
title: "Casos de Uso - Preferencias de Usuario"
domain: "User Preferences"
version: "1.0"
date: "2025-08-21"
author: "DGSIC"
---

# Casos de Uso: Preferencias de Usuario

## Contexto
Las preferencias permiten personalizar la aplicación. Se distinguen entre:
- **userPreferences**: ajustes generales del usuario como la densidad de la interfaz.
- **userListPreferences**: configuración de columnas visibles y su orden para cada listado de tablas o cards.

---

## Caso de Uso 1: Ajustar densidad de contenido
**Actores principales:** Usuario.

**Precondiciones:**
- El usuario ha accedido a la aplicación.

**Flujo principal:**
1. El usuario abre el diálogo de preferencias.
2. Selecciona el nivel de densidad deseado.
3. El sistema guarda la selección en `userPreferences`.
4. La interfaz actualiza el espaciado según la densidad seleccionada.

**Postcondiciones:**
- La densidad elegida queda persistida para futuras sesiones.

---

## Caso de Uso 2: Configurar columnas de un listado
**Actores principales:** Usuario.

**Precondiciones:**
- Existe al menos un listado de datos en la aplicación.

**Flujo principal:**
1. El usuario abre el selector de columnas del listado.
2. Activa o desactiva columnas y las reordena mediante arrastre.
3. El sistema guarda la configuración en `userListPreferences` asociada al listado.
4. El listado refleja inmediatamente los cambios de visibilidad y orden.

**Postcondiciones:**
- La configuración de columnas queda asociada al usuario y al listado específico.

---
