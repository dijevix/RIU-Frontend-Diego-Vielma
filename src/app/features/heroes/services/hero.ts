import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateHero, Hero } from '../models/hero.model';
import { HeroStore } from './hero-store';

@Service()
export class HeroService {
  private readonly http = inject(HttpClient);
  private readonly store = inject(HeroStore);

  getHeroes(): Hero[] {
    return this.store.getHeroes();
  }

  getHero(id: number): Hero | undefined {
    return this.store.getHero(id);
  }

  searchHeroes(term: string): Hero[] {
    return this.store.searchHeroes(term);
  }

  create(data: CreateHero): Observable<Hero> {
    return this.http.post<Hero>('/api/heroes', data);
  }

  updateHero(hero: Hero): Observable<Hero> {
    return this.http.put<Hero>(`/api/heroes/${hero.id}`, hero);
  }

  deleteHero(id: number): Observable<void> {
    return this.http.delete<void>(`/api/heroes/${id}`);
  }
}
