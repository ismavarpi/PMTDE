---
title: "Modelo de datos"
description: "Descripción de las entidades y campos de la aplicación"
---

# Modelo de datos

## parametros
| Campo | Tipo de datos | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT |  |  |  |
| nombre | VARCHAR(255) |  |  |  |
| valor | VARCHAR(255) | 'n/a' |  |  |
| valor_defecto | VARCHAR(255) | 'n/a' |  |  |

## usuarios
| Campo | Tipo de datos | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT |  |  |  |
| nombre | VARCHAR(255) | 'n/a' |  |  |
| apellidos | VARCHAR(255) | 'n/a' |  |  |
| email | VARCHAR(255) | 'n/a' |  |  |

## pmtde
| Campo | Tipo de datos | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT |  |  |  |
| nombre | VARCHAR(255) | 'n/a' |  |  |
| descripcion | TEXT | 'n/a' |  |  |
| propietario_id | INT | 1 | usuarios.id | NO |

## programas_guardarrail
| Campo | Tipo de datos | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT |  |  |  |
| codigo | VARCHAR(8) | 'n/a' |  |  |
| pmtde_id | INT | 1 | pmtde.id | SI |
| nombre | VARCHAR(255) | 'n/a' |  |  |
| descripcion | TEXT | 'n/a' |  |  |
| responsable_id | INT | 1 | usuarios.id | NO |

## programa_guardarrail_expertos
| Campo | Tipo de datos | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------------|------------|------------------------|
| programa_id | INT |  | programas_guardarrail.id | SI |
| usuario_id | INT |  | usuarios.id | SI |

## planes_estrategicos
| Campo | Tipo de datos | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT |  |  |  |
| codigo | VARCHAR(8) | 'n/a' |  |  |
| pmtde_id | INT | 1 | pmtde.id | SI |
| nombre | VARCHAR(255) | 'n/a' |  |  |
| descripcion | TEXT | 'n/a' |  |  |
| responsable_id | INT | 1 | usuarios.id | NO |

## plan_estrategico_expertos
| Campo | Tipo de datos | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------------|------------|------------------------|
| plan_id | INT |  | planes_estrategicos.id | SI |
| usuario_id | INT |  | usuarios.id | SI |

## principios_especificos
| Campo | Tipo de datos | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT |  |  |  |
| plan_id | INT | 1 | planes_estrategicos.id | SI |
| codigo | VARCHAR(20) | 'n/a' |  |  |
| titulo | VARCHAR(255) | 'n/a' |  |  |
| descripcion | TEXT | 'n/a' |  |  |

## preferencias_usuario
| Campo | Tipo de datos | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------------|------------|------------------------|
| usuario | VARCHAR(255) | 'anonimo' |  |  |
| tabla | VARCHAR(255) | 'n/a' |  |  |
| columnas | TEXT | '[]' |  |  |

