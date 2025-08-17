---
title: "Modelo de datos"
description: "Descripción de las entidades y campos de la aplicación"
---

# Modelo de datos

## parametros
| Campo | Tipo de datos | Valor por defecto | Referencia | Tipo de referencia |
|-------|---------------|-------------------|------------|--------------------|
| id | INT AUTO_INCREMENT | - | - | - |
| nombre | VARCHAR(255) | - | - | - |
| valor | VARCHAR(255) | 'n/a' | - | - |
| valor_defecto | VARCHAR(255) | 'n/a' | - | - |

## usuarios
| Campo | Tipo de datos | Valor por defecto | Referencia | Tipo de referencia |
|-------|---------------|-------------------|------------|--------------------|
| id | INT AUTO_INCREMENT | - | - | - |
| nombre | VARCHAR(255) | 'n/a' | - | - |
| apellidos | VARCHAR(255) | 'n/a' | - | - |
| email | VARCHAR(255) | 'n/a' | - | - |

## pmtde
| Campo | Tipo de datos | Valor por defecto | Referencia | Tipo de referencia |
|-------|---------------|-------------------|------------|--------------------|
| id | INT AUTO_INCREMENT | - | - | - |
| nombre | VARCHAR(255) | 'n/a' | - | - |
| descripcion | TEXT | 'n/a' | - | - |
| propietario_id | INT | 1 | usuarios.id | Sin cascada |

## programas_guardarrail
| Campo | Tipo de datos | Valor por defecto | Referencia | Tipo de referencia |
|-------|---------------|-------------------|------------|--------------------|
| id | INT AUTO_INCREMENT | - | - | - |
| codigo | VARCHAR(8) | 'N/A' | - | - |
| pmtde_id | INT | 1 | pmtde.id | Sin cascada |
| nombre | VARCHAR(255) | 'n/a' | - | - |
| descripcion | TEXT | 'n/a' | - | - |
| responsable_id | INT | 1 | usuarios.id | Sin cascada |

## programa_guardarrail_expertos
| Campo | Tipo de datos | Valor por defecto | Referencia | Tipo de referencia |
|-------|---------------|-------------------|------------|--------------------|
| programa_id | INT | - | programas_guardarrail.id | En cascada |
| usuario_id | INT | - | usuarios.id | Sin cascada |

## planes_estrategicos
| Campo | Tipo de datos | Valor por defecto | Referencia | Tipo de referencia |
|-------|---------------|-------------------|------------|--------------------|
| id | INT AUTO_INCREMENT | - | - | - |
| codigo | VARCHAR(8) | 'N/A' | - | - |
| pmtde_id | INT | 1 | pmtde.id | Sin cascada |
| nombre | VARCHAR(255) | 'n/a' | - | - |
| descripcion | TEXT | 'n/a' | - | - |
| responsable_id | INT | 1 | usuarios.id | Sin cascada |

## plan_estrategico_expertos
| Campo | Tipo de datos | Valor por defecto | Referencia | Tipo de referencia |
|-------|---------------|-------------------|------------|--------------------|
| plan_id | INT | - | planes_estrategicos.id | En cascada |
| usuario_id | INT | - | usuarios.id | Sin cascada |

## preferencias_usuario
| Campo | Tipo de datos | Valor por defecto | Referencia | Tipo de referencia |
|-------|---------------|-------------------|------------|--------------------|
| usuario | VARCHAR(255) | 'anonimo' | - | - |
| tabla | VARCHAR(255) | 'n/a' | - | - |
| columnas | TEXT | '[]' | - | - |

