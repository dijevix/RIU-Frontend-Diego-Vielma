import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, map, of } from 'rxjs';
import { CreateHero, Hero } from '../models/hero.model';
import { HeroStore } from '../services/hero-store';

const HEROES_API = '/api/heroes';

export const heroesApiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  if (!req.url.startsWith(HEROES_API)) {
    return next(req);
  }

  const store = inject(HeroStore);

  return of(req).pipe(
    delay(1000),
    map((request) => {
      if (request.method === 'POST' && request.url === HEROES_API) {
        const body = store.add(request.body as CreateHero);
        return new HttpResponse({ status: 201, body });
      }

      const match = /^\/api\/heroes\/(\d+)$/.exec(request.url);
      if (match) {
        const id = Number(match[1]);
        if (request.method === 'PUT') {
          const hero = request.body as Hero;
          store.replace(hero);
          return new HttpResponse({ status: 200, body: hero });
        }
        if (request.method === 'DELETE') {
          store.remove(id);
          return new HttpResponse({ status: 204, body: null });
        }
      }

      return new HttpResponse({ status: 404, body: null });
    }),
  );
};
