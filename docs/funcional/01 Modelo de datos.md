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
| pmtde_id | INT | 1 | pmtde.id | NO |
| nombre | VARCHAR(255) | 'n/a' |  |  |
| descripcion | TEXT | 'n/a' |  |  |
| responsable_id | INT | 1 | usuarios.id | NO |

## programa_guardarrail_expertos
| Campo | Tipo de datos | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------------|------------|------------------------|
| programa_id | INT |  | programas_guardarrail.id | SI |
| usuario_id | INT |  | usuarios.id | NO |

## planes_estrategicos
| Campo | Tipo de datos | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT |  |  |  |
| codigo | VARCHAR(8) | 'n/a' |  |  |
| pmtde_id | INT | 1 | pmtde.id | NO |
| nombre | VARCHAR(255) | 'n/a' |  |  |
| descripcion | TEXT | 'n/a' |  |  |
| responsable_id | INT | 1 | usuarios.id | NO |

## plan_estrategico_expertos
| Campo | Tipo de datos | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------------|------------|------------------------|
| plan_id | INT |  | planes_estrategicos.id | SI |
| usuario_id | INT |  | usuarios.id | NO |

## preferencias_usuario
| Campo | Tipo de datos | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------------|------------|------------------------|
| usuario | VARCHAR(255) | 'anonimo' |  |  |
| tabla | VARCHAR(255) | 'n/a' |  |  |
| columnas | TEXT | '[]' |  |  |

