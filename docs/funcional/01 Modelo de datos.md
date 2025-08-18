---
title: "Modelo de datos"
description: "Descripción de las entidades y campos de la aplicación"
---

# Modelo de datos

## parametros
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT | SI |  |  |  |
| nombre | VARCHAR(255) | SI |  |  |  |
| valor | VARCHAR(255) | SI | 'n/a' |  |  |
| valor_defecto | VARCHAR(255) | SI | 'n/a' |  |  |

## usuarios
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT | SI |  |  |  |
| nombre | VARCHAR(255) | SI | 'n/a' |  |  |
| apellidos | VARCHAR(255) | SI | 'n/a' |  |  |
| email | VARCHAR(255) | SI | 'n/a' |  |  |

## pmtde
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT | SI |  |  |  |
| nombre | VARCHAR(255) | SI | 'n/a' |  |  |
| descripcion | TEXT | NO | 'n/a' |  |  |
| propietario_id | INT | SI | 1 | usuarios.id | NO |

## programas_guardarrail
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT | SI |  |  |  |
| codigo | VARCHAR(8) | SI | 'n/a' |  |  |
| pmtde_id | INT | SI | 1 | pmtde.id | SI |
| nombre | VARCHAR(255) | SI | 'n/a' |  |  |
| descripcion | TEXT | NO | 'n/a' |  |  |
| responsable_id | INT | SI | 1 | usuarios.id | NO |

## programa_guardarrail_expertos
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| programa_id | INT | SI |  | programas_guardarrail.id | SI |
| usuario_id | INT | SI |  | usuarios.id | SI |

## principios_guardarrail
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT | SI |  |  |  |
| programa_id | INT | SI | 1 | programas_guardarrail.id | SI |
| codigo | VARCHAR(255) | SI | 'n/a' |  |  |
| titulo | VARCHAR(255) | SI | 'n/a' |  |  |
| descripcion | TEXT | NO | 'n/a' |  |  |

## planes_estrategicos
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT | SI |  |  |  |
| codigo | VARCHAR(8) | SI | 'n/a' |  |  |
| pmtde_id | INT | SI | 1 | pmtde.id | SI |
| nombre | VARCHAR(255) | SI | 'n/a' |  |  |
| descripcion | TEXT | NO | 'n/a' |  |  |
| responsable_id | INT | SI | 1 | usuarios.id | NO |

## plan_estrategico_expertos
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| plan_id | INT | SI |  | planes_estrategicos.id | SI |
| usuario_id | INT | SI |  | usuarios.id | SI |

## principios_especificos
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT | SI |  |  |  |
| plan_id | INT | SI | 1 | planes_estrategicos.id | SI |
| codigo | VARCHAR(20) | SI | 'n/a' |  |  |
| titulo | VARCHAR(255) | SI | 'n/a' |  |  |
| descripcion | TEXT | NO | 'n/a' |  |  |

## preferencias_usuario
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| usuario | VARCHAR(255) | SI | 'anonimo' |  |  |
| tabla | VARCHAR(255) | SI | 'n/a' |  |  |
| columnas | TEXT | SI | '[]' |  |  |

## objetivos_estrategicos
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT | SI |  |  |  |
| plan_id | INT | SI | 1 | planes_estrategicos.id | SI |
| codigo | VARCHAR(255) | SI | 'n/a' |  |  |
| titulo | VARCHAR(255) | SI | 'n/a' |  |  |
| descripcion | TEXT | SI | 'n/a' |  |  |

## objetivos_estrategicos_evidencias
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT | SI |  |  |  |
| objetivo_id | INT | SI | 1 | objetivos_estrategicos.id | SI |
| codigo | VARCHAR(255) | SI | 'n/a' |  |  |
| descripcion | TEXT | SI | 'n/a' |  |  |

