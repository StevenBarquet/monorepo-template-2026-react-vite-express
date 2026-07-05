# Reglas de la API

- Agrega una carpeta por cada ruta nueva
- Las rutas pueden crecer como un árbol según su complejidad

## Estructura

Cada ruta puede contener, en el mismo archivo o en archivos separados según la complejidad, los siguientes elementos:

- Controller (obligatorio)
- logic (también llamado service)
- validaciones
- constantes de alcance local (scoped)
- helpers o utils de alcance local (scoped)
- Sub-Controllers o Sub-Routes con la misma estructura
