# Reglas de eliminación de registros
Se definen a continuación las relaciones entre registros, para indicar si al eliminar un registro, los registros que lo referencian se elimina en cascada o no.

## Catálogo de referencias



| Entidad referenciada | Entidad que referencia | Regla de eliminación |
|-----------|-----------|-----------|
| Usuarios   | PMTDE   | NO_ELIMINACION   |
| Usuarios   | Programas guardarrailes  | NO_ELIMINACION   |
| Usuarios   | Planes estratégicos  | NO_ELIMINACION   |
| PMTDE   | Programas guardarrailes  | CASCADA   |
| PMTDE   | Planes estratégicos  | CASCADA   |

Si una relación entre dos entidades no está definida en la tabla anterior, por defecto el valor es "CASCADA".

En la tabla anterior las reglas de eliminación son las siguientes:
- CASCADA: se elimina la entidad que la referencia y después se elimina la entidad referenciada,
- NO_ELIMINACION: si una "entidad referenciada" es referenciada en una "entidad que referencia", no se podrá eliminar la "entidad referenciada" hasta que no sea referenciada por registros de la "entidad que referencia".

Con estas reglas debes gestionar la configuración de:
- La estructura de base de datos y las relaciones foreign key
- Las reglas de negocio del sistema
- La información que se debe mostrar al usuario al confirmar la eliminación.
