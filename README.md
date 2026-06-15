# API Books

API RESTful para gestionar un catálogo de libros clásicos. Express v5 con patrón de estrategia para intercambiar backends de almacenamiento (JSON, MySQL, Supabase).

## Inicio Rápido

```bash
pnpm install
```

Elegir uno de tres modos:

```bash
pnpm start:local      # JSON in-memory
pnpm start:sql        # MySQL (requiere base de datos 'booksdeb')
pnpm start:supabase   # Supabase (requiere .env con credenciales)
```

El servidor arranca en `http://localhost:1234/`.

## Endpoints

| Método   | Endpoint         | Descripción                  |
|----------|------------------|------------------------------|
| `GET`    | `/books`         | Todos los libros (slugs)     |
| `GET`    | `/books?genre=X` | Filtrar por género           |
| `GET`    | `/books/:slug`   | Libro por slug               |
| `POST`   | `/books`         | Crear libro                  |
| `PATCH`  | `/books/:id`     | Actualizar libro (parcial)   |
| `DELETE` | `/books/:id`     | Eliminar libro               |

## Variables de Entorno

Crear archivo `.env` (solo necesario para modo Supabase):

```env
SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui
```

## Estructura

```
├── app.js                  # Factory de Express
├── server-local.js         # Entry point: JSON
├── server-sql.js           # Entry point: MySQL
├── server-supabase.js      # Entry point: Supabase
├── controllers/books.js    # Controlador
├── models/
│   ├── file-system/books.js
│   ├── mysql/book.js
│   └── supabase/book.js
├── routes/books.js         # Rutas
└── schema/books.js         # Validación con Zod
```

## Arquitectura

Patrón de estrategia: cada modelo implementa la misma interfaz (`getAll`, `getBySlug`, `createBook`, `deleteBook`, `updateBook`). El modelo se inyecta al crear la app, permitiendo cambiar el backend sin modificar la lógica de negocio.

## Licencia

ISC
