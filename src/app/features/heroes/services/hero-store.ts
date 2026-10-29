import { Service, signal } from '@angular/core';
import { heroSeed } from '../data/hero.seed';
import { CreateHero, Hero } from '../models/hero.model';

@Service()
export class HeroStore {
  private readonly heroes = signal<Hero[]>([...heroSeed]);
  private nextId = heroSeed.length + 1;

  getHeroes(): Hero[] {
    return this.heroes();
  }

  getHero(id: number): Hero | undefined {
    return this.heroes().find((hero) => hero.id === id);
  }

  searchHeroes(term: string): Hero[] {
    const query = term.trim().toLowerCase();
    if (!query) {
      return this.heroes();
    }
    return this.heroes().filter((hero) =>
      [hero.name, hero.realName, hero.lastName, hero.city].some((field) =>
        field.toLowerCase().includes(query),
      ),
    );
  }

  add(data: CreateHero): Hero {
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

  replace(hero: Hero): void {
    this.heroes.update((list) => list.map((item) => (item.id === hero.id ? hero : item)));
  }

  remove(id: number): void {
    this.heroes.update((list) => list.filter((hero) => hero.id !== id));
  }
}
