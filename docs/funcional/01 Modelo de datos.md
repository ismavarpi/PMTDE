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
| valor | VARCHAR(255) | SI |  |  |  |
| valor_defecto | VARCHAR(255) | SI |  |  |  |

## usuarios
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT | SI |  |  |  |
| nombre | VARCHAR(255) | SI |  |  |  |
| apellidos | VARCHAR(255) | SI |  |  |  |
| email | VARCHAR(255) | SI |  |  |  |

## pmtde
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT | SI |  |  |  |
| nombre | VARCHAR(255) | SI |  |  |  |
| descripcion | TEXT | NO |  |  |  |
| propietario_id | INT | SI |  | usuarios.id | NO |

## programas_guardarrail
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT | SI |  |  |  |
| codigo | VARCHAR(8) | SI |  |  |  |
| pmtde_id | INT | SI |  | pmtde.id | SI |
| nombre | VARCHAR(255) | SI |  |  |  |
| descripcion | TEXT | NO |  |  |  |
| responsable_id | INT | SI |  | usuarios.id | NO |

## programa_guardarrail_expertos
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| programa_id | INT | SI |  | programas_guardarrail.id | SI |
| usuario_id | INT | SI |  | usuarios.id | SI |

## principios_guardarrail
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT | SI |  |  |  |
| programa_id | INT | SI |  | programas_guardarrail.id | SI |
| codigo | VARCHAR(255) | SI |  |  |  |
| titulo | VARCHAR(255) | SI |  |  |  |
| descripcion | TEXT | NO |  |  |  |

## objetivos_guardarrail
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT | SI |  |  |  |
| programa_id | INT | SI |  | programas_guardarrail.id | SI |
| codigo | VARCHAR(255) | SI |  |  |  |
| titulo | VARCHAR(255) | SI |  |  |  |
| descripcion | TEXT | SI |  |  |  |

## objetivo_guardarrail_planes
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| objetivo_id | INT | SI |  | objetivos_guardarrail.id | SI |
| plan_id | INT | SI |  | planes_estrategicos.id | SI |

## objetivos_guardarrail_evidencias
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT | SI |  |  |  |
| objetivo_id | INT | SI |  | objetivos_guardarrail.id | SI |
| codigo | VARCHAR(255) | SI |  |  |  |
| descripcion | TEXT | SI |  |  |  |

## planes_estrategicos
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT | SI |  |  |  |
| codigo | VARCHAR(8) | SI |  |  |  |
| pmtde_id | INT | SI |  | pmtde.id | SI |
| nombre | VARCHAR(255) | SI |  |  |  |
| descripcion | TEXT | NO |  |  |  |
| responsable_id | INT | SI |  | usuarios.id | NO |

## plan_estrategico_expertos
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| plan_id | INT | SI |  | planes_estrategicos.id | SI |
| usuario_id | INT | SI |  | usuarios.id | SI |

## principios_especificos
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT | SI |  |  |  |
| plan_id | INT | SI |  | planes_estrategicos.id | SI |
| codigo | VARCHAR(20) | SI |  |  |  |
| titulo | VARCHAR(255) | SI |  |  |  |
| descripcion | TEXT | NO |  |  |  |

## preferencias_usuario
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| usuario | VARCHAR(255) | SI | 'anónimo' |  |  |
| tabla | VARCHAR(255) | SI |  |  |  |
| columnas | TEXT | SI |  |  |  |

## objetivos_estrategicos
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT | SI |  |  |  |
| plan_id | INT | SI |  | planes_estrategicos.id | SI |
| codigo | VARCHAR(255) | SI |  |  |  |
| titulo | VARCHAR(255) | SI |  |  |  |
| descripcion | TEXT | SI |  |  |  |

## objetivos_estrategicos_evidencias
| Campo | Tipo de datos | Obligatorio | Valor por defecto | Referencia | Eliminación en cascada |
|-------|---------------|-------------|-------------------|------------|------------------------|
| id | INT AUTO_INCREMENT | SI |  |  |  |
| objetivo_id | INT | SI |  | objetivos_estrategicos.id | SI |
| codigo | VARCHAR(255) | SI |  |  |  |
| descripcion | TEXT | SI |  |  |  |

