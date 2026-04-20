# TeamDelete

Desmantela el equipo activo actual, eliminando su directorio de configuración y el directorio de tareas compartidas. Es la contraparte de limpieza de `TeamCreate` y típicamente se llama después de que el objetivo del equipo se haya logrado y todos los compañeros se hayan apagado.

## Cuándo usar

- El equipo ha completado su trabajo y el informe final ha sido entregado al usuario.
- El equipo se creó por error o su ámbito ha cambiado tan drásticamente que empezar de cero es más limpio que continuar.
- Necesitas crear un nuevo equipo pero ya hay uno activo — elimina el viejo primero, ya que solo se puede liderar un equipo a la vez.
- Un equipo se ha vuelto obsoleto a lo largo de sesiones y su estado persistido bajo `~/.claude/teams/` ya no es necesario.

NO llames mientras los compañeros sigan en ejecución — apágalos primero vía `SendMessage` con un `shutdown_request`, espera cada `shutdown_response` y luego elimina.

## Parámetros

`TeamDelete` no recibe parámetros en su invocación típica. Opera sobre el equipo activo actual propiedad de la sesión que llama.

## Ejemplos

### Ejemplo 1: Apagado rutinario tras el éxito

1. Haz broadcast de una solicitud de apagado al equipo:
   ```
   SendMessage(to="*", message={ "type": "shutdown_request" })
   ```
2. Espera a que cada compañero responda con un `shutdown_response`.
3. Llama a `TeamDelete()` para eliminar el directorio del equipo y el directorio de tareas.

### Ejemplo 2: Reemplazar un equipo mal configurado

Si `TeamCreate` fue llamado con el `agent_type` o `description` equivocado, primero asegúrate de que no se hayan generado compañeros aún (o apágalos), luego:

```
TeamDelete()
TeamCreate(team_name="...", description="...", agent_type="...")
```

## Notas

- `TeamDelete` falla si algún compañero sigue activo. La respuesta de error lista los compañeros vivos — envía a cada uno un `shutdown_request` vía `SendMessage`, espera su `shutdown_response` y reintenta.
- La eliminación es irreversible desde la perspectiva de la herramienta. La configuración del equipo en `~/.claude/teams/{team_name}/config.json` y su directorio de tareas se eliminan del disco. Si necesitas preservar la lista de tareas, exporta o copia el directorio antes de eliminar.
- Solo la sesión líder que creó el equipo puede eliminarlo. Un compañero generado no puede llamar a `TeamDelete` sobre su propio equipo.
- Eliminar el equipo no revierte los cambios del sistema de archivos que los compañeros hicieron en el repositorio. Esos son ediciones ordinarias rastreadas por git y deben revertirse por separado si no se desean.
- Tras el retorno exitoso de `TeamDelete`, la sesión es libre de llamar a `TeamCreate` nuevamente para un nuevo equipo.
