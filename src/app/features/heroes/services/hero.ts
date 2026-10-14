import { Service, signal } from '@angular/core';
import { heroSeed } from '../data/hero.seed';
import { CreateHero, Hero } from '../models/hero.model';

@Service()
export class HeroService {
  private readonly heroes = signal<Hero[]>([...heroSeed]);
  private nextId = heroSeed.length + 1;

  create(data: CreateHero): Hero {
    const hero: Hero = {
      id: this.nextId++,
      name: data.name.trim(),
      realName: data.realName.trim(),
      lastName: data.lastName.trim(),
      city: data.city.trim(),
    };
    this.heroes.update((list) => [...list, hero]);
    return hero;
  }

  getHeroes(): Hero[] {
    return this.heroes();
  }

  getHero(id: number): Hero | undefined {
    return this.heroes().find((hero) => hero.id === id);
  }

  searchHeroes(term: string): Hero[] {
    return this.heroes().filter((hero) => hero.name.toLowerCase().includes(term.toLowerCase()));
  }

  updateHero(hero: Hero): void {
    this.heroes.update((list) => list.map((item) => (item.id === hero.id ? hero : item)));
  }

  deleteHero(id: number): void {
    this.heroes.update((list) => list.filter((hero) => hero.id !== id));
  }
}
