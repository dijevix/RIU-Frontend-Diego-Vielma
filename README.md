# Heroes

SPA in Angular for maintaining superheroes (create, list, search, edit, delete).  
Data lives in memory in a service — no backend.

## Stack

- Angular 22 (standalone, signals, `@if` / `@for`)
- Angular Material
- Vitest (unit tests + coverage)
- Docker + Nginx

## Approach

State uses **signals** (`signal` / `computed` / `effect`) instead of RxJS streams for the hero list and UI state.  
That keeps reactivity simple and matches the current Angular style. RxJS stays available via the framework, but the app logic is signal-first.

## Setup

```bash
npm install
npm start
```

App: [http://localhost:4200](http://localhost:4200)

## Tests

```bash
npm test
```

With coverage:

```bash
npx ng test --watch=false --coverage
```

## Docker

```bash
docker compose up --build
```

App: [http://localhost:8080](http://localhost:8080)
